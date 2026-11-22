'use client';
// Mini-game for pr.1-2. First forge the prototype's question from tiles (game.rounds). Then a storyboard of every screen
// the team could build: tap the ones on the question's path to build them, and hand in the plan. Each screen scores on
// its final call; every card's `note` explains why it's in or out.
import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, HammerIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Round = NonNullable<Game['rounds']>[number];

function Forge({ round, onDone }: { round: Round; onDone: (correct: boolean) => void }) {
  const tiles = useMemo(() => [...round.answer, ...round.distractors].map((text, i) => ({ id: `t${i}`, text, k: (i * 5 + 2) % 7 })).sort((a, b) => a.k - b.k), [round]);
  const [placed, setPlaced] = useState<string[]>([]);
  const [verdict, setVerdict] = useState<boolean | null>(null);
  const built = placed.map(id => tiles.find(t => t.id === id)!.text);
  const shown = verdict === false ? round.answer : built;
  const forge = () => { const ok = built.join(' ') === round.answer.join(' '); play(ok ? 'correct' : 'wrong'); setVerdict(ok); };
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-primary">{round.prompt}</h2>
      <motion.div animate={verdict === false ? { x: [0, -10, 10, -6, 6, 0] } : {}} transition={{ duration: 0.45 }}
        className={cx('relative flex min-h-16 flex-wrap items-center gap-1.5 rounded-2xl bg-secondary px-4 py-3 text-lg font-semibold ring-2 ring-inset', verdict === null ? 'ring-secondary' : verdict ? 'ring-mint-600' : 'ring-error')}>
        {verdict && <Burst count={16} />}
        {shown.length ? shown.map((w, k) => <span key={k} className="text-primary">{w}</span>) : <span className="text-quaternary">Tap tiles to build the question…</span>}
      </motion.div>
      <div className="flex flex-wrap gap-2">
        {tiles.map(t => {
          const used = placed.includes(t.id);
          return (
            <motion.button key={t.id} type="button" whileTap={{ scale: 0.95 }} disabled={verdict !== null}
              onClick={() => { play('tap'); setPlaced(p => (used ? p.filter(x => x !== t.id) : [...p, t.id])); }}
              className={cx('rounded-xl px-3 py-2 text-md font-semibold shadow-sm ring-1 ring-inset transition-colors disabled:cursor-default', used ? 'bg-brand-solid text-white ring-brand' : 'bg-primary text-primary ring-secondary hover:bg-primary_hover')}>{t.text}</motion.button>
          );
        })}
      </div>
      {verdict === null ? (
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-tertiary">Tap a placed tile again to take it back.</span>
          <Button size="lg" iconLeading={HammerIcon} onPress={forge} isDisabled={placed.length !== round.answer.length}>Forge it</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <NibSays mood={verdict ? 'cheer' : 'think'}>{verdict ? 'Who, the task, and how you’ll know it worked. Testable.' : 'Close. The traps were about liking or seeing everything, which no test can settle.'}</NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => onDone(verdict)}>Plan the screens</Button></div>
        </div>
      )}
    </div>
  );
}

export function ProtoScope({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const round = game.rounds?.[0];
  const [forged, setForged] = useState<GameResult | null>(round ? null : { id: 'none', correct: true });
  const [build, setBuild] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const call = (id: string, lane: string) => build.includes(id) === (lane === 'keep');
  const right = game.cards.filter(c => call(c.id, c.lane)).length;

  if (!forged && round) {
    return <div className="flex flex-col gap-5"><StageTitle eyebrow="Play · forge" title={game.title}>{game.instructions}</StageTitle><Forge round={round} onDone={ok => setForged({ id: round.id, correct: ok })} /></div>;
  }

  const toggle = (id: string) => { if (done) return; play('tap'); setBuild(b => (b.includes(id) ? b.filter(x => x !== id) : [...b, id])); };
  return (
    <div className="relative flex flex-col gap-5">
      {done && right === game.cards.length && <Burst count={36} />}
      <StageTitle eyebrow={done ? 'Plan handed in' : 'Play · scope'} title={done ? `${right} of ${game.cards.length} screens called right` : 'Which screens do you build?'}>
        {done ? 'Ticked calls were right. Each screen says why it’s in or out.' : 'Tap every screen the task passes through. Leave the rest out.'}
      </StageTitle>
      {round && <p className="rounded-xl bg-secondary px-4 py-3 text-md font-semibold text-primary">“{round.answer.join(' ')}”</p>}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {game.cards.map(c => {
          const on = build.includes(c.id), ok = call(c.id, c.lane);
          return (
            <motion.button key={c.id} type="button" onClick={() => toggle(c.id)} whileTap={done ? undefined : { scale: 0.97 }} aria-pressed={on}
              className={cx('relative flex min-h-36 flex-col gap-2 rounded-2xl p-3 text-left ring-2 ring-inset transition-colors',
                on ? 'bg-primary' : 'bg-secondary', !done ? (on ? 'ring-brand' : 'ring-secondary') : ok ? 'ring-mint-600' : 'ring-error', done && 'cursor-default')}>
              {/* a tiny screen thumbnail */}
              <span className={cx('flex h-14 flex-col gap-1 rounded-lg p-2 transition-opacity', on ? 'bg-secondary' : 'bg-primary opacity-60')}>
                <span className="h-1.5 w-1/2 rounded-full bg-quaternary" /><span className="h-5 w-full rounded bg-quaternary/70" />
              </span>
              <span className={cx('text-sm font-semibold', on ? 'text-primary' : 'text-tertiary')}>{c.label}</span>
              {!done && on && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={springs.pop} className="absolute top-2 right-2 rounded-full bg-brand-solid px-2 py-0.5 text-[11px] font-bold text-white">Build</motion.span>}
              {done && (
                <>
                  <span className={cx('absolute top-2 right-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold text-white', ok ? 'bg-mint-600' : 'bg-error-solid')}>
                    {ok ? <CheckIcon className="size-3" weight="bold" /> : <XIcon className="size-3" weight="bold" />}{c.lane === 'keep' ? 'on the path' : 'skip'}
                  </span>
                  <span className="text-xs text-tertiary">{c.note}</span>
                </>
              )}
            </motion.button>
          );
        })}
      </div>
      {!done ? (
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-tertiary">{build.length} of {game.cards.length} screens to build.</span>
          <Button size="lg" iconLeading={HammerIcon} onPress={() => { play(right === game.cards.length ? 'fanfare' : 'reveal'); setDone(true); }} isDisabled={!build.length}>Hand in the plan</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>{game.cards.filter(c => c.lane === 'keep').length} screens out of {game.cards.length}. Smaller prototype, sharper answer.</NibSays>
          <div className="flex justify-end"><Button size="xl" onPress={() => onDone([...(forged && forged.id !== 'none' ? [forged] : []), ...game.cards.map(c => ({ id: c.id, correct: call(c.id, c.lane) }))])}>Continue the story</Button></div>
        </div>
      )}
    </div>
  );
}
