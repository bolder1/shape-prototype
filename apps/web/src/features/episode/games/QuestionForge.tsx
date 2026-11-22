'use client';
// Mini-game for rs.1-3: build research questions from word tiles (some are traps), Duolingo-style. Tap a tile to add it,
// tap a placed tile to take it back, then forge. After the rounds, judge a few questions as strong or weak.
import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { HammerIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { Classify } from './Classify';
import type { GameResult } from './DiamondSort';

type Game = Episode['game'];
type Round = NonNullable<Game['rounds']>[number];

function ForgeRound({ round, index, total, onDone }: { round: Round; index: number; total: number; onDone: (correct: boolean) => void }) {
  // Fixed shuffle so tiles never sit in answer order.
  const tiles = useMemo(() => [...round.answer, ...round.distractors].map((text, i) => ({ id: `t${i}`, text, k: (i * 7 + 3) % 5 })).sort((a, b) => a.k - b.k || a.id.localeCompare(b.id)), [round]);
  const [placed, setPlaced] = useState<string[]>([]);
  const [verdict, setVerdict] = useState<boolean | null>(null);
  const built = placed.map(id => tiles.find(t => t.id === id)!.text);

  const forge = () => setVerdict(built.length === round.answer.length && built.every((w, i) => w === round.answer[i]));

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm font-semibold text-tertiary">Round {index + 1} of {total}</p>
      <h2 className="text-xl font-semibold text-primary">{round.prompt}</h2>
      {/* the anvil: where the question is built */}
      <motion.div animate={verdict === false ? { x: [0, -10, 10, -6, 6, 0] } : verdict ? { scale: [1, 1.03, 1] } : {}} transition={{ duration: 0.45 }}
        className={cx('relative flex min-h-20 flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed p-3', verdict === null ? 'border-secondary' : verdict ? 'border-mint-600 bg-mint-500/10' : 'border-error bg-error-primary')}>
        {verdict && <Burst count={18} />}
        {!placed.length && <span className="px-2 text-sm text-quaternary">Tap tiles to build the question…</span>}
        {placed.map(id => (
          <motion.button key={id} type="button" layoutId={id} onClick={() => verdict === null && setPlaced(p => p.filter(x => x !== id))}
            className="rounded-xl bg-brand-solid px-3 py-2 text-md font-semibold text-white shadow-sm">{tiles.find(t => t.id === id)!.text}</motion.button>
        ))}
      </motion.div>
      {/* the tile tray */}
      <div className="flex flex-wrap gap-2">
        {tiles.map(t => placed.includes(t.id)
          ? <span key={t.id} className="rounded-xl bg-secondary px-3 py-2 text-md font-semibold text-transparent select-none" aria-hidden>{t.text}</span>
          : (
            <motion.button key={t.id} type="button" layoutId={t.id} onClick={() => verdict === null && setPlaced(p => [...p, t.id])} whileTap={{ scale: 0.95 }}
              className="rounded-xl bg-primary px-3 py-2 text-md font-semibold text-primary shadow-sm ring-1 ring-secondary ring-inset hover:bg-primary_hover">{t.text}</motion.button>
          ))}
      </div>
      {verdict === null ? (
        <div className="flex justify-end"><Button size="lg" iconLeading={HammerIcon} onPress={forge} isDisabled={!placed.length}>Forge it</Button></div>
      ) : (
        <div className="flex flex-col gap-3">
          <NibSays mood={verdict ? 'cheer' : 'think'}>
            {verdict ? 'Forged. Open, about real behaviour, no solution baked in.' : <>Close. The strong version: <strong>“{round.answer.join(' ')}”</strong> The trap tiles made it yes/no or about opinions.</>}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => onDone(verdict)}>{index + 1 < total ? 'Next round' : 'Judge some questions'}</Button></div>
        </div>
      )}
    </div>
  );
}

export function QuestionForge({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const rounds = game.rounds ?? [];
  const [step, setStep] = useState(0);
  const [forged, setForged] = useState<GameResult[]>([]);
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow={step < rounds.length ? 'Play · forge' : 'Play · judge'} title={game.title}>
        {step < rounds.length ? game.instructions : 'Strong or weak? A strong question is open, about real behaviour, and free of a built-in solution.'}
      </StageTitle>
      {step < rounds.length
        ? <ForgeRound key={rounds[step].id} round={rounds[step]} index={step} total={rounds.length} onDone={ok => { setForged(f => [...f, { id: rounds[step].id, correct: ok }]); setStep(s => s + 1); }} />
        : <Classify game={game} title="Strong or weak?" onDone={r => onDone([...forged, ...r])} />}
    </div>
  );
}
