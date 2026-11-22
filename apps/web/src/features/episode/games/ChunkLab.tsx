'use client';
// Mini-game for fd.2-4: a real memory test. Memorise 8 random letters, then 9 letters as 3 words, and compare your recall.
// Chunking is the difference. Then classify design changes as adding or reducing load (scored).
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BrainIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { NibSays, StageTitle } from '../kit';
import { Classify } from './Classify';
import type { GameResult } from './DiamondSort';

type Game = Episode['game'];
const ROUNDS = [
  { id: 'flat', show: ['K', 'F', 'R', 'Q', 'M', 'T', 'L', 'B'], answer: 'KFRQMTLB', label: '8 random letters' },
  { id: 'chunked', show: ['SUN', 'CAT', 'MAP'], answer: 'SUNCATMAP', label: '9 letters as 3 words' },
];
const SHOW_MS = 4000;

/** Letters in the right position, as a share of the answer. */
const recall = (typed: string, answer: string) => answer.split('').filter((ch, i) => typed.replace(/[^A-Z]/gi, '').toUpperCase()[i] === ch).length / answer.length;

function MemoryRound({ round, onDone }: { round: (typeof ROUNDS)[number]; onDone: (share: number) => void }) {
  const [phase, setPhase] = useState<'ready' | 'show' | 'recall'>('ready');
  const [typed, setTyped] = useState('');
  const [left, setLeft] = useState(SHOW_MS);
  useEffect(() => {
    if (phase !== 'show') return;
    const t0 = performance.now();
    const id = setInterval(() => {
      const l = SHOW_MS - (performance.now() - t0);
      setLeft(Math.max(0, l));
      if (l <= 0) { clearInterval(id); setPhase('recall'); }
    }, 50);
    return () => clearInterval(id);
  }, [phase]);

  return (
    <div className="flex flex-col items-center gap-5 rounded-2xl bg-secondary px-4 py-8 text-center ring-1 ring-secondary ring-inset">
      {phase === 'ready' && (
        <>
          <p className="text-lg text-secondary">You’ll see <strong className="text-primary">{round.label}</strong> for 4 seconds. Remember them in order.</p>
          <Button size="lg" onPress={() => setPhase('show')}>I’m ready</Button>
        </>
      )}
      {phase === 'show' && (
        <>
          <div className="flex flex-nowrap justify-center gap-1.5 sm:gap-3" aria-live="polite">
            {round.show.map((s, i) => (
              <motion.span key={i} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ...springs.pop, delay: i * 0.04 }}
                className="rounded-lg bg-primary px-2 py-2 font-mono text-xl font-bold tracking-widest sm:rounded-xl sm:px-4 sm:py-3 sm:text-display-xs text-primary shadow-sm ring-1 ring-secondary ring-inset">{s}</motion.span>
            ))}
          </div>
          <div className="h-2 w-64 overflow-hidden rounded-full bg-tertiary"><div className="h-full bg-mint-600" style={{ width: `${(left / SHOW_MS) * 100}%` }} /></div>
        </>
      )}
      {phase === 'recall' && (
        <form className="flex w-full max-w-sm flex-col gap-3" onSubmit={e => { e.preventDefault(); onDone(recall(typed, round.answer)); }}>
          <label htmlFor={`recall-${round.id}`} className="text-md font-semibold text-primary">Type what you remember, in order</label>
          <input id={`recall-${round.id}`} autoFocus autoComplete="off" value={typed} onChange={e => setTyped(e.target.value.toUpperCase())}
            className="rounded-xl bg-primary px-4 py-3 text-center font-mono text-xl font-bold tracking-widest text-primary ring-2 ring-secondary outline-none ring-inset focus:ring-brand-solid" />
          <Button size="lg" type="submit" isDisabled={!typed.trim()}>Check</Button>
        </form>
      )}
    </div>
  );
}

export function ChunkLab({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [step, setStep] = useState(0);            // 0, 1 memory rounds · 2 compare · 3 classify
  const [shares, setShares] = useState<number[]>([]);
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow={step < 3 ? 'Play · memory test' : 'Play · adds or reduces?'} title={step < 3 ? game.title : 'Load check'}>
        {step < 2 ? `Round ${step + 1} of 2. Not scored. Just notice how it feels.` : step === 2 ? 'Here’s what your memory did.' : 'Does each change add to or reduce what people have to hold in their head?'}
      </StageTitle>
      {step < 2 && <MemoryRound key={step} round={ROUNDS[step]} onDone={s => { setShares(x => [...x, s]); setStep(step + 1); }} />}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          {ROUNDS.map((r, i) => (
            <div key={r.id} className="flex items-center gap-3 text-sm">
              <span className="w-44 font-semibold text-secondary">{r.label}</span>
              <span className="h-3 flex-1 overflow-hidden rounded-full bg-secondary">
                <motion.span className={cx('block h-full rounded-full', i ? 'bg-mint-600' : 'bg-error-solid')} initial={{ width: 0 }} animate={{ width: `${shares[i] * 100}%` }} transition={springs.gentle} />
              </span>
              <span className="w-12 text-right font-bold text-primary tabular-nums">{Math.round(shares[i] * 100)}%</span>
            </div>
          ))}
          <NibSays mood="cheer">
            <BrainIcon className="mr-1 inline size-4" weight="fill" />
            {shares[1] > shares[0] ? 'More letters, better recall. ' : 'Interesting! Most people recall the words far better. '}Three words are three chunks; eight random letters are eight. That’s why grouping and labelling work.
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => setStep(3)}>Now apply it</Button></div>
        </div>
      )}
      {step === 3 && <Classify game={game} title="Adds or reduces load?" onDone={onDone} />}
    </div>
  );
}
