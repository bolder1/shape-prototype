'use client';
import { useEffect, useRef, useState } from 'react';
import { CheckCircleIcon, XCircleIcon, LightbulbIcon } from '@phosphor-icons/react/ssr';
import { domainById } from '@shape/engine';
import { ChoiceCards } from '@/components/inputs/ChoiceCards';
import { ProgressBarBase } from '@/components/base/progress-indicators/progress-indicators';
import { Button } from '@/components/base/buttons/button';
import { FAMILIES, FAMILY_ORDER, SKILL_META } from '@/lib/skills';
import { LEVELS, QUIZ, SKILL_COPY, STATION_STORY } from '../content';
import { JOURNEY } from '../profile';
import { StepActions, StepHeader, type StepProps } from './shared';

export function SkillStep({ ctx, send }: StepProps) {
  const id = JOURNEY[ctx.skillIndex];
  const meta = SKILL_META[id], family = FAMILIES[meta.family];
  const station = FAMILY_ORDER.indexOf(meta.family);
  const firstInStation = ctx.skillIndex === 0 || SKILL_META[JOURNEY[ctx.skillIndex - 1]].family !== meta.family;
  const [picked, setPicked] = useState<string | undefined>(ctx.ratings[id] != null ? String(ctx.ratings[id]) : undefined);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const choose = (v: string) => {
    setPicked(v);
    clearTimeout(timer.current);
    // A short beat so the selection registers before the road moves on.
    timer.current = setTimeout(() => send({ type: 'RATE', level: Number(v) }), 380);
  };

  return (
    <>
      <StepHeader eyebrow={`Station ${station + 1} of 4 · ${family.label}`} title={domainById[id].name}
        body={firstInStation ? STATION_STORY[meta.family] : undefined} />
      <div className="flex flex-col gap-3 rounded-xl bg-secondary p-4">
        <p className="flex items-start gap-2 text-md text-secondary">
          <meta.icon className="mt-0.5 size-5 shrink-0" style={{ color: family.color }} weight="duotone" />
          {SKILL_COPY[id].what}
        </p>
        <p className="text-sm text-tertiary"><span className="font-semibold text-secondary">For example:</span> {SKILL_COPY[id].example}</p>
      </div>
      <ChoiceCards label="How much have you done this?" columns={2} value={picked} onChange={choose}
        choices={LEVELS.map(l => ({ value: l.value, label: l.label, description: l.description, icon: l.icon }))} />
      <div className="flex items-center justify-between text-sm text-quaternary">
        <span>Skill {ctx.skillIndex + 1} of {JOURNEY.length}</span>
      </div>
      <StepActions onBack={() => send({ type: 'BACK' })} />
    </>
  );
}

const SECONDS = 20;

export function CheckStep({ ctx, send }: StepProps) {
  const id = ctx.quizIds[ctx.quizIndex];
  const q = QUIZ[id];
  const [choice, setChoice] = useState<string>();
  const [answered, setAnswered] = useState<null | { correct: boolean; timedOut: boolean }>(null);
  const [left, setLeft] = useState(SECONDS);
  // Running out of time is derived, not stored: no answer + no time left = timed out.
  const revealed = answered ?? (left <= 0 ? { correct: false, timedOut: true } : null);
  const setRevealed = setAnswered;

  const done = revealed != null;
  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => setLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left, done]);

  const confirm = () => choice != null && setRevealed({ correct: Number(choice) === q.correct, timedOut: false });

  return (
    <>
      <StepHeader eyebrow={`Quick check · ${ctx.quizIndex + 1} of ${ctx.quizIds.length} · ${domainById[id].name}`} title={q.q}
        body={ctx.quizIndex === 0 ? 'Three quick questions on your strongest skills. Right answers confirm your level.' : undefined} />
      {!revealed && (
        <div className="flex items-center gap-3" aria-label={`${left} seconds left`}>
          <div className="flex-1"><ProgressBarBase value={(left / SECONDS) * 100} progressClassName="bg-brand-solid transition-all duration-1000 ease-linear" /></div>
          <span className="w-8 text-right text-sm text-tertiary tabular-nums">{left}s</span>
        </div>
      )}
      <ChoiceCards label="Your answer" hideLabel columns={1} value={choice}
        onChange={v => !revealed && setChoice(v)}
        choices={q.a.map((a, i) => ({ value: String(i), label: `${'ABCD'[i]}. ${a}` }))} />
      {revealed && (
        <div className={`flex items-start gap-3 rounded-xl p-4 ring-1 ring-inset ${revealed.correct ? 'bg-mint-50 ring-mint-200' : 'bg-warning-primary ring-yellow-200'}`} role="status">
          {revealed.correct ? <CheckCircleIcon className="size-5 shrink-0 text-mint-700" weight="fill" /> : revealed.timedOut ? <LightbulbIcon className="size-5 shrink-0 text-fg-warning-primary" weight="fill" /> : <XCircleIcon className="size-5 shrink-0 text-fg-warning-primary" weight="fill" />}
          <div>
            <p className="text-sm font-semibold text-primary">
              {revealed.correct ? 'Correct' : revealed.timedOut ? `Time's up. The answer is ${'ABCD'[q.correct]}.` : `Not quite. The answer is ${'ABCD'[q.correct]}.`}
            </p>
            <p className="text-sm text-secondary">{q.why}</p>
          </div>
        </div>
      )}
      <StepActions onBack={() => send({ type: 'BACK' })}
        extra={!revealed
          ? <Button size="lg" onPress={confirm} isDisabled={choice == null}>Confirm answer</Button>
          : <Button size="lg" onPress={() => send({ type: 'QUIZ_ANSWERED', correct: revealed.correct })}>{ctx.quizIndex < ctx.quizIds.length - 1 ? 'Next question' : 'See my profile'}</Button>} />
    </>
  );
}
