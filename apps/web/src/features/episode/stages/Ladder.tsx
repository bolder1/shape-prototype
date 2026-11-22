'use client';
// The prize ladder: the summary round, quiz-show style. Questions climb in difficulty and value, with suspense
// before every reveal and two lifelines (50:50 and Ask Nib). A wrong answer ends the climb and you keep your
// last safe rung. Our own format, inspired by TV quiz shows; no show's name or branding.
import { useState } from 'react';
import { motion } from 'motion/react';
import { ChatCircleDotsIcon, LockSimpleIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, Choice, Nib, choiceState, type ChoiceState } from '../kit';
import { play } from '@/lib/sound';

export interface LadderResult { answered: { id: string; correct: boolean }[]; banked: number; reached: number }

const PRIZES = [100, 250, 500, 1000, 2500, 5000];
const SAFE = 1;   // index of the safe rung: reach it and you keep it

export function Ladder({ questions, onDone }: { questions: Episode['ladder']; onDone: (r: LadderResult) => void }) {
  const prizes = PRIZES.slice(0, questions.length);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [phase, setPhase] = useState<'ask' | 'suspense' | 'reveal' | 'over'>('ask');
  const [answered, setAnswered] = useState<{ id: string; correct: boolean }[]>([]);
  const [fifty, setFifty] = useState<{ q: string; hide: string[] } | null>(null);
  const [usedFifty, setUsedFifty] = useState(false);
  const [askNib, setAskNib] = useState<string | null>(null);
  const [usedNib, setUsedNib] = useState(false);
  const q = questions[i];
  const won = answered.length === questions.length && answered.every(a => a.correct);
  const lastRight = answered.filter(a => a.correct).length - 1;
  const lost = answered.some(a => !a.correct);
  const banked = won ? prizes.at(-1)! : lost ? (lastRight >= SAFE ? prizes[SAFE] : 0) : lastRight >= 0 ? prizes[lastRight] : 0;

  const lockIn = () => {
    if (!picked) return;
    setPhase('suspense');
    play('drumroll');
    setTimeout(() => {
      const correct = picked === q.correct;
      setAnswered(a => [...a, { id: q.id, correct }]);
      play(correct ? 'reveal' : 'wrong');
      setPhase('reveal');
    }, 1600);
  };
  const next = () => {
    const last = answered.at(-1);
    if (!last?.correct || i + 1 >= questions.length) { if (last?.correct) play('fanfare'); setPhase('over'); return; }
    setI(i + 1); setPicked(null); setPhase('ask'); setAskNib(null);
  };
  const useFifty = () => {
    const wrong = q.options.filter(o => o.id !== q.correct).map(o => o.id);
    setFifty({ q: q.id, hide: wrong.sort((a, b) => a.localeCompare(b)).slice(0, Math.max(0, q.options.length - 2)) });
    setUsedFifty(true);
    if (picked && wrong.includes(picked)) setPicked(null);
  };

  const state = (id: string): ChoiceState => {
    if (fifty?.q === q.id && fifty.hide.includes(id)) return 'hidden';
    if (phase === 'reveal' || phase === 'over') return choiceState(id, picked, q.correct, true);
    return picked === id ? 'selected' : 'idle';
  };

  return (
    <div className="relative -mx-4 overflow-hidden rounded-none bg-brand-950 px-4 py-6 text-white sm:mx-0 sm:rounded-3xl sm:px-8 sm:py-8">
      {/* stage lighting */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(60% 50% at 50% 0%, rgba(43,192,138,0.22), transparent 70%), radial-gradient(40% 40% at 90% 100%, rgba(139,92,246,0.25), transparent 70%)' }} />
      {phase === 'suspense' && <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-white" animate={{ opacity: [0, 0.06, 0, 0.06, 0] }} transition={{ duration: 1.6 }} />}

      <div className="relative grid gap-6 md:grid-cols-[1fr_11rem]">
        <div className="flex flex-col gap-5">
          {/* phones: the ladder as a compact strip on top, so the climb stays in view */}
          <ol className="grid gap-1 md:hidden" style={{ gridTemplateColumns: `repeat(${prizes.length}, minmax(0, 1fr))` }} aria-label="Prize ladder">
            {prizes.map((p, k) => {
              const done = answered[k]?.correct, current = k === i && phase !== 'over', failed = answered[k] && !answered[k].correct;
              return (
                <li key={p} className={cx('rounded-md px-1 py-1 text-center text-[11px] font-bold tabular-nums ring-1 ring-inset',
                  done ? 'bg-mint-600 text-white ring-mint-500' : failed ? 'bg-error-solid/80 text-white ring-error' : current ? 'bg-white text-brand-950 ring-white' : 'bg-white/5 text-white/60 ring-white/10')}>
                  {p.toLocaleString('en-IN')}{k === SAFE && <LockSimpleIcon className="ml-0.5 inline size-2.5" weight="bold" aria-label="safe rung" />}
                </li>
              );
            })}
          </ol>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold tracking-wide text-mint-300 uppercase">Prize ladder · for {prizes[Math.min(i, prizes.length - 1)].toLocaleString('en-IN')} points</p>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={useFifty} disabled={usedFifty || phase !== 'ask'} aria-label="Lifeline: fifty-fifty"
                className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-bold whitespace-nowrap ring-1 ring-white/20 transition hover:bg-white/20 disabled:opacity-30">50:50</button>
              <button type="button" onClick={() => { setAskNib(q.hint); setUsedNib(true); }} disabled={usedNib || phase !== 'ask'} aria-label="Lifeline: ask Nib"
                className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-sm font-bold whitespace-nowrap ring-1 ring-white/20 transition hover:bg-white/20 disabled:opacity-30">
                <ChatCircleDotsIcon className="size-4" weight="fill" />Ask Nib
              </button>
            </div>
          </div>

          {phase !== 'over' ? (
            <>
                <motion.h2 key={q.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={springs.gentle}
                  className="rounded-2xl bg-white/5 px-5 py-5 text-center text-xl font-semibold ring-1 ring-white/15 md:text-display-xs">{q.prompt}</motion.h2>
              {askNib && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-3">
                  <Nib mood="think" size={44} />
                  <p className="rounded-2xl rounded-bl-sm bg-white/10 px-4 py-2.5 text-md ring-1 ring-white/15">{askNib}</p>
                </motion.div>
              )}
              <motion.div className="grid gap-3 sm:grid-cols-2" animate={phase === 'suspense' ? { scale: [1, 1.01, 1] } : {}} transition={{ duration: 0.8, repeat: phase === 'suspense' ? 2 : 0 }}>
                {q.options.map((o, j) => (
                  <Choice key={o.id} index={j} label={o.label} tone="stage" state={state(o.id)} onPress={() => phase === 'ask' && setPicked(o.id)} disabled={phase !== 'ask'} />
                ))}
              </motion.div>
              <div className="flex min-h-11 items-center justify-between gap-3">
                <p className="text-sm text-white/70" role="status">
                  {phase === 'suspense' ? 'Locked in… let’s see.' : phase === 'reveal' ? (answered.at(-1)?.correct ? `Correct! ${q.explanation}` : `Not this time. ${q.explanation}`) : picked ? 'Final answer?' : 'Pick an answer.'}
                </p>
                {phase === 'ask' && <Button size="lg" isDisabled={!picked} onPress={lockIn} iconLeading={LockSimpleIcon}>Lock it in</Button>}
                {phase === 'reveal' && <Button size="lg" onPress={next}>{answered.at(-1)?.correct && i + 1 < questions.length ? 'Next rung' : 'See your total'}</Button>}
              </div>
            </>
          ) : (
            <div className="relative flex flex-col items-center gap-4 py-8 text-center">
              {won && <Burst count={50} />}
              <Nib mood={won ? 'cheer' : banked ? 'idle' : 'sad'} size={72} />
              <p className="text-sm font-semibold tracking-wide text-mint-300 uppercase">{won ? 'Top of the ladder' : 'You banked'}</p>
              <motion.p initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop} className="text-display-lg font-bold tabular-nums">{banked.toLocaleString('en-IN')}</motion.p>
              <p className="max-w-sm text-md text-white/70">{won ? 'Every rung, no slips. Your grade card is ready.' : 'Your grade card is ready. Every question you missed comes back in review.'}</p>
              <Button size="xl" onPress={() => onDone({ answered, banked, reached: answered.filter(a => a.correct).length })}>Reveal my grade</Button>
            </div>
          )}
        </div>

        {/* the ladder */}
        <ol className="hidden flex-col-reverse gap-1.5 self-start md:flex" aria-label="Prize ladder">
          {prizes.map((p, k) => {
            const done = answered[k]?.correct, current = k === i && phase !== 'over', failed = answered[k] && !answered[k].correct;
            return (
              <motion.li key={p} layout animate={current ? { scale: 1.04 } : { scale: 1 }} transition={springs.pop}
                className={cx('flex items-center justify-between rounded-lg px-3 py-1.5 text-sm font-bold tabular-nums ring-1 ring-inset',
                  done ? 'bg-mint-600 text-white ring-mint-500' : failed ? 'bg-error-solid/80 text-white ring-error' : current ? 'bg-white text-brand-950 ring-white' : 'bg-white/5 text-white/60 ring-white/10')}>
                <span>{k + 1}</span><span>{p.toLocaleString('en-IN')}{k === SAFE && <LockSimpleIcon className="ml-1 inline size-3.5" weight="bold" aria-label="safe rung" />}</span>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
