'use client';
// Mini-game for cw.1-2: build button labels from word tiles inside a real dialog, so the label you build is the button
// people would tap. Trap tiles are the vague words (OK, Submit). After the rounds, sort real labels: specific or vague.
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

function ForgeRound({ round, index, total, onDone }: { round: Round; index: number; total: number; onDone: (correct: boolean) => void }) {
  // Fixed shuffle so tiles never sit in answer order.
  const tiles = useMemo(() => [...round.answer, ...round.distractors].map((text, i) => ({ id: `t${i}`, text, k: (i * 7 + 3) % 5 })).sort((a, b) => a.k - b.k || a.id.localeCompare(b.id)), [round]);
  const [placed, setPlaced] = useState<string[]>([]);
  const [verdict, setVerdict] = useState<boolean | null>(null);
  const built = placed.map(id => tiles.find(t => t.id === id)!.text);
  const label = verdict === false ? round.answer.join(' ') : built.join(' ');
  // The dialog shows the question the button answers, when the prompt quotes one.
  const question = round.prompt.match(/“(.+?)”/)?.[1];

  const forge = () => {
    const ok = built.length === round.answer.length && built.every((w, i) => w === round.answer[i]);
    play(ok ? 'correct' : 'wrong');
    setVerdict(ok);
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm font-semibold text-tertiary">Round {index + 1} of {total}</p>
      <h2 className="text-xl font-semibold text-primary">{round.prompt}</h2>

      {/* the dialog, with the button being built */}
      <motion.div animate={verdict === false ? { x: [0, -10, 10, -6, 6, 0] } : {}} transition={{ duration: 0.45 }}
        className="relative mx-auto flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-primary p-5 shadow-xl ring-1 ring-secondary ring-inset">
        {verdict && <Burst count={18} />}
        {question ? <p className="text-lg font-semibold text-primary">{question}</p> : <span className="block h-3 w-2/3 rounded-full bg-quaternary" />}
        <span className="block h-2.5 w-1/2 rounded-full bg-secondary" />
        <div className="flex justify-end gap-2">
          <span className="rounded-lg px-4 py-2.5 text-sm font-semibold text-tertiary ring-1 ring-secondary ring-inset">Cancel</span>
          <motion.span layout className={cx('min-w-24 rounded-lg px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors',
            verdict === null ? (placed.length ? 'bg-brand-solid' : 'bg-quaternary') : verdict ? 'bg-mint-600' : 'bg-error-solid')}>
            {label || '…'}
          </motion.span>
        </div>
      </motion.div>

      {/* placed tiles (tap to take back) and the tray */}
      <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-xl border-2 border-dashed border-secondary p-2">
        {!placed.length && <span className="px-2 text-sm text-quaternary">Tap tiles to write the button…</span>}
        {placed.map(id => (
          <motion.button key={id} type="button" layoutId={id} onClick={() => verdict === null && setPlaced(p => p.filter(x => x !== id))}
            className="rounded-xl bg-brand-solid px-3 py-2 text-md font-semibold text-white shadow-sm">{tiles.find(t => t.id === id)!.text}</motion.button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {tiles.map(t => placed.includes(t.id)
          ? <span key={t.id} className="rounded-xl bg-secondary px-3 py-2 text-md font-semibold text-transparent select-none" aria-hidden>{t.text}</span>
          : (
            <motion.button key={t.id} type="button" layoutId={t.id} onClick={() => { if (verdict === null) { play('tap'); setPlaced(p => [...p, t.id]); } }} whileTap={{ scale: 0.95 }}
              className="rounded-xl bg-primary px-3 py-2 text-md font-semibold text-primary shadow-sm ring-1 ring-secondary ring-inset hover:bg-primary_hover">{t.text}</motion.button>
          ))}
      </div>

      {verdict === null ? (
        <div className="flex justify-end"><Button size="lg" iconLeading={HammerIcon} onPress={forge} isDisabled={!placed.length}>Make the button</Button></div>
      ) : (
        <div className="flex flex-col gap-3">
          <NibSays mood={verdict ? 'cheer' : 'think'}>
            {verdict ? 'Verb plus object. Nobody has to reread the question.' : <>The strong label is <strong>“{round.answer.join(' ')}”</strong>. Words like “{round.weak[0]}” make people reread the question.</>}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => onDone(verdict)}>{index + 1 < total ? 'Next button' : 'Sort some labels'}</Button></div>
        </div>
      )}
    </div>
  );
}

export function ButtonForge({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const rounds = game.rounds ?? [];
  const [step, setStep] = useState(0);
  const [forged, setForged] = useState<GameResult[]>([]);
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow={step < rounds.length ? 'Play · build' : 'Play · sort'} title={game.title}>
        {step < rounds.length ? game.instructions : 'Specific or vague? A specific label says what happens when you tap it.'}
      </StageTitle>
      {step < rounds.length
        ? <ForgeRound key={rounds[step].id} round={rounds[step]} index={step} total={rounds.length} onDone={ok => { setForged(f => [...f, { id: rounds[step].id, correct: ok }]); setStep(s => s + 1); }} />
        : <Classify game={game} title="Specific or vague?" onDone={r => onDone([...forged, ...r])} />}
    </div>
  );
}
