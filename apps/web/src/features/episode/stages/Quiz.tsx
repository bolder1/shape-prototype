'use client';
// Rapid quiz: a timer ring per question. Faster right answers score more; running out of time counts as a miss.
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { FireIcon, LightningIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, Choice, StageTitle, choiceState } from '../kit';

export interface QuizResult { id: string; correct: boolean; points: number }

export function Quiz({ quiz, onDone }: { quiz: Episode['quiz']; onDone: (results: QuizResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [left, setLeft] = useState(quiz.seconds);
  const [results, setResults] = useState<QuizResult[]>([]);
  const started = useRef(performance.now());
  const q = quiz.questions[i];
  const score = results.reduce((s, r) => s + r.points, 0);
  const streak = (() => { let n = 0; for (let k = results.length - 1; k >= 0 && results[k].correct; k--) n++; return n; })();

  // Countdown, smooth for the ring.
  useEffect(() => {
    if (revealed || !q) return;
    started.current = performance.now();
    let raf = 0;
    const tick = () => {
      const l = Math.max(0, quiz.seconds - (performance.now() - started.current) / 1000);
      setLeft(l);
      if (l <= 0) { answer(null); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, revealed]);

  function answer(id: string | null) {
    if (revealed) return;
    const correct = id === q.correct;
    const remaining = Math.max(0, quiz.seconds - (performance.now() - started.current) / 1000);
    setPicked(id); setRevealed(true);
    setResults(r => [...r, { id: q.id, correct, points: correct ? 100 + Math.round(remaining * 10) : 0 }]);
  }

  // Auto-advance after the reveal.
  useEffect(() => {
    if (!revealed) return;
    const t = setTimeout(() => { setI(n => n + 1); setPicked(null); setRevealed(false); setLeft(quiz.seconds); }, 1600);
    return () => clearTimeout(t);
  }, [revealed, quiz.seconds]);

  if (!q) {
    const right = results.filter(r => r.correct).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        {right === results.length && <Burst count={36} />}
        <StageTitle eyebrow="Rapid quiz" title={`${score} points`}>{right} of {results.length} right. Speed counted.</StageTitle>
        <div className="flex gap-2">
          {results.map((r, k) => (
            <motion.span key={r.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...springs.pop, delay: k * 0.08 }}
              className={cx('grid size-12 place-items-center rounded-xl text-sm font-bold text-white', r.correct ? 'bg-mint-600' : 'bg-error-solid')}>
              {r.correct ? `+${r.points}` : '0'}
            </motion.span>
          ))}
        </div>
        <Button size="xl" onPress={() => onDone(results)}>Final round</Button>
      </div>
    );
  }

  const R = 26, C = 2 * Math.PI * R, frac = left / quiz.seconds;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <StageTitle eyebrow={`Rapid quiz · ${i + 1} of ${quiz.questions.length}`} title={q.prompt} />
        <div className="relative grid size-16 shrink-0 place-items-center" role="timer" aria-label={`${Math.ceil(left)} seconds left`}>
          <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90">
            <circle cx={32} cy={32} r={R} fill="none" stroke="var(--color-bg-tertiary)" strokeWidth={6} />
            <circle cx={32} cy={32} r={R} fill="none" stroke={frac > 0.33 ? 'var(--color-mint-600)' : 'var(--color-fg-error-primary)'} strokeWidth={6} strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C * (1 - frac)} />
          </svg>
          <span className={cx('text-lg font-bold tabular-nums', frac > 0.33 ? 'text-primary' : 'text-error-primary')}>{Math.ceil(left)}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 text-sm font-semibold">
        <span className="inline-flex items-center gap-1 text-mint-700"><LightningIcon className="size-4" weight="fill" />{score}</span>
        {streak >= 2 && <span className="inline-flex items-center gap-1 text-fg-warning-primary"><FireIcon className="size-4" weight="fill" />{streak} streak</span>}
      </div>
        <motion.div key={q.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.18 }}
          className="grid gap-3 sm:grid-cols-2">
          {q.options.map((o, j) => <Choice key={o.id} index={j} label={o.label} state={choiceState(o.id, picked, q.correct, revealed)} onPress={() => answer(o.id)} disabled={revealed} />)}
        </motion.div>
      {revealed && <p className="text-sm text-tertiary" role="status">{picked === null ? 'Time’s up. ' : ''}{q.explanation}</p>}
    </div>
  );
}
