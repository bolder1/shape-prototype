'use client';
// Mini-game for rs.2-3: build job stories from tiles into three coloured slots (situation · motivation · outcome). Feature
// tiles are traps. After the rounds, sort statements into jobs and feature requests.
import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { HammerIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { Classify } from './Classify';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Round = NonNullable<Game['rounds']>[number];
const SLOT = [{ k: 'Situation', c: 'var(--color-family-discover)' }, { k: 'Motivation', c: 'var(--color-family-design)' }, { k: 'Outcome', c: 'var(--color-mint-600)' }];

function ForgeRound({ round, index, total, onDone }: { round: Round; index: number; total: number; onDone: (correct: boolean) => void }) {
  // Fixed shuffle so tiles never sit in answer order.
  const tiles = useMemo(() => [...round.answer, ...round.distractors].map((text, i) => ({ id: `t${i}`, text, k: (i * 7 + 3) % 5 })).sort((a, b) => a.k - b.k || a.id.localeCompare(b.id)), [round]);
  const [placed, setPlaced] = useState<string[]>([]);
  const [verdict, setVerdict] = useState<boolean | null>(null);
  const built = placed.map(id => tiles.find(t => t.id === id)!.text);
  const shown = verdict === false ? round.answer : built;

  const forge = () => {
    const ok = built.length === round.answer.length && built.every((w, i) => w === round.answer[i]);
    play(ok ? 'correct' : 'wrong');
    setVerdict(ok);
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm font-semibold text-tertiary">Round {index + 1} of {total}</p>
      <h2 className="text-xl font-semibold text-primary">{round.prompt}</h2>

      {/* the three slots */}
      <motion.div animate={verdict === false ? { x: [0, -10, 10, -6, 6, 0] } : {}} transition={{ duration: 0.45 }} className="relative flex flex-col gap-2">
        {verdict && <Burst count={18} />}
        {SLOT.slice(0, round.answer.length).map((s, k) => (
          <div key={s.k} className="flex items-stretch overflow-hidden rounded-xl ring-1 ring-secondary ring-inset">
            <span className="flex w-24 shrink-0 items-center px-3 text-sm font-bold text-white" style={{ background: s.c }}>{s.k}</span>
            <span className={cx('flex min-h-11 flex-1 items-center px-3 text-md font-semibold', shown[k] ? 'bg-primary text-primary' : 'bg-secondary text-quaternary',
              verdict === false && 'text-mint-700')}>{shown[k] ?? '…'}</span>
          </div>
        ))}
      </motion.div>

      <div className="flex flex-wrap gap-2">
        {tiles.map(t => {
          const used = placed.includes(t.id);
          return (
            <motion.button key={t.id} type="button" whileTap={{ scale: 0.95 }} disabled={verdict !== null}
              onClick={() => { play('tap'); setPlaced(p => (used ? p.filter(x => x !== t.id) : [...p, t.id])); }}
              className={cx('rounded-xl px-3 py-2 text-md font-semibold shadow-sm ring-1 ring-inset transition-colors disabled:cursor-default',
                used ? 'bg-brand-solid text-white ring-brand' : 'bg-primary text-primary ring-secondary hover:bg-primary_hover')}>{t.text}</motion.button>
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
          <NibSays mood={verdict ? 'cheer' : 'think'}>
            {verdict ? 'A real job: a situation, the progress wanted, and why it matters.' : 'Close. The traps were features, which describe a solution instead of the progress someone wants.'}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => onDone(verdict)}>{index + 1 < total ? 'Next story' : 'Sort some statements'}</Button></div>
        </div>
      )}
    </div>
  );
}

export function JobForge({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const rounds = game.rounds ?? [];
  const [step, setStep] = useState(0);
  const [forged, setForged] = useState<GameResult[]>([]);
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow={step < rounds.length ? 'Play · forge' : 'Play · sort'} title={game.title}>
        {step < rounds.length ? game.instructions : 'A job or a feature request? Jobs describe a situation and the progress wanted.'}
      </StageTitle>
      {step < rounds.length
        ? <ForgeRound key={rounds[step].id} round={rounds[step]} index={step} total={rounds.length} onDone={ok => { setForged(f => [...f, { id: rounds[step].id, correct: ok }]); setStep(s => s + 1); }} />
        : <Classify game={game} title="Job or feature request?" onDone={r => onDone([...forged, ...r])} />}
    </div>
  );
}
