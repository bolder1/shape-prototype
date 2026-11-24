'use client';
// Mini-game for pr.2-3: each card is a motion from Dabba, drawn and played by the scene's `MotionTile` (its `visual`).
// Watch it, then say what job it does: where it went, what changed, look here, or none (cut it). A cut motion is struck
// out on the spot. The end shows the motion Dabba keeps, grouped by job, beside the pile it cut. With reduced motion on,
// tiles hold their finished frame until Play is pressed.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, PlayIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode, MeaningMotion, MotionJob } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { MotionTile, tileLoop } from '../scenes/MotionMeaning';
import { useMotionDemo } from './useMotionDemo';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
/** The frame a tile shows when it can't move: the point where its meaning is clearest. */
const STILL_AT: Record<MeaningMotion, number> = {
  'fly-to-cart': 0.3, 'push-deeper': 0.45, 'expand-card': 0.5, 'sheet-from-button': 0.5, shake: 0.12, 'check-draw': 0.6, skeleton: 0.45,
  'count-up': 0.5, 'pulse-once': 0.3, 'logo-spin': 0.25, 'bounce-all': 0.2, 'float-icons': 0.3,
};

function Tile({ m, k, cut, label }: { m: MeaningMotion; k: number; cut?: boolean; label: string }) {
  return (
    <svg viewBox="-2 -2 204 154" className="w-full" role="img" aria-label={label}>
      <g opacity={cut ? 0.45 : 1}><MotionTile motion={m} k={k} /></g>
      {cut && <line x1={12} x2={188} y1={138} y2={12} stroke="var(--color-fg-error-primary)" strokeWidth={5} strokeLinecap="round" />}
    </svg>
  );
}

export function MotionPurpose({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<Record<string, MotionJob>>({});
  const clock = useMotionDemo(2.4);
  const card = game.cards[i];
  const picked = card ? picks[card.id] : undefined;
  const kOf = (m: MeaningMotion, offset = 0) => (clock.still ? STILL_AT[m] : tileLoop(clock.t, offset));

  if (!card) {
    const right = game.cards.filter(c => picks[c.id] === c.lane).length;
    const kept = game.lanes.filter(l => l.id !== 'none');
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Motion with a job" title={`${right} of ${game.cards.length} jobs right`}>
          {game.cards.filter(c => c.lane !== 'none').length} motions stay, each explaining something. {game.cards.filter(c => c.lane === 'none').length} go.
        </StageTitle>
        <div className="grid w-full gap-3 text-left sm:grid-cols-2">
          {[...kept, game.lanes.find(l => l.id === 'none')!].map(l => (
            <section key={l.id} className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
              <h2 className={cx('text-sm font-semibold', l.id === 'none' ? 'text-error-primary' : 'text-primary')}>{l.label}</h2>
              <div className="grid grid-cols-3 gap-2">
                {game.cards.filter(c => c.lane === l.id).map((c, n) => (
                  <div key={c.id} className={cx('rounded-xl bg-primary p-1 ring-1 ring-inset', picks[c.id] === c.lane ? 'ring-secondary' : 'ring-error')}>
                    <Tile m={c.visual as MeaningMotion} k={kOf(c.visual as MeaningMotion, n * 0.3)} cut={l.id === 'none'} label={c.label} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>If you turned a motion off and nobody lost any understanding, it was decoration. What’s left can now be noticed.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: picks[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane, m = card.visual as MeaningMotion;
  const owner = game.lanes.find(l => l.id === card.lane)!;
  const pick = (job: MotionJob) => { if (picked) return; play(job === card.lane ? 'correct' : 'wrong'); setPicks(p => ({ ...p, [card.id]: job })); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">The motion</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className={cx('grid items-center gap-4 rounded-2xl bg-primary px-5 py-4 shadow-lg ring-2 ring-inset sm:grid-cols-[1fr_1fr]', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
        <span className="text-lg font-semibold text-primary">{card.label}</span>
        <div className="flex flex-col items-center gap-2">
          <div className="w-full max-w-64"><Tile m={m} k={kOf(m)} cut={picked === 'none'} label={card.label} /></div>
          {clock.reduce && <Button size="sm" color="secondary" iconLeading={<PlayIcon data-icon weight="bold" />} onPress={clock.play}>Play once</Button>}
        </div>
      </motion.div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => pick(l.id as MotionJob)} disabled={!!picked} whileTap={{ scale: 0.96 }}
            className={cx('flex flex-col items-start gap-1 rounded-2xl bg-primary px-3 py-3 text-left ring-2 ring-secondary ring-inset transition disabled:cursor-default',
              !picked && 'hover:bg-primary_hover', picked && l.id !== picked && l.id !== card.lane && 'opacity-40', picked && l.id === card.lane && 'ring-mint-600', picked === l.id && !ok && 'ring-error')}>
            <span className="text-sm font-bold text-primary">{l.label}</span>
            <span className="text-xs leading-tight text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      {picked && (
        <>
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{owner.label}.</span>{' '}
            {!ok && picked === 'none' && <>Cutting it would lose something people need. </>}
            {!ok && card.lane === 'none' && <>It tells Kiran nothing she needs. </>}
            {card.note}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => setI(n => n + 1)}>{i + 1 < game.cards.length ? 'Next motion' : 'See what stays'}</Button></div>
        </>
      )}
    </div>
  );
}
