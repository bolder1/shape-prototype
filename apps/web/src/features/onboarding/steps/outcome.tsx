'use client';
import { useMemo, useState } from 'react';
import { CheckIcon, FlagIcon, ShareNetworkIcon } from '@phosphor-icons/react/ssr';
import { Button } from '@/components/base/buttons/button';
import { Badge } from '@/components/base/badges/badges';
import { ChoiceCards } from '@/components/inputs/ChoiceCards';
import { Segmented } from '@/components/inputs/Segmented';
import { OutcomeSummary } from '@/components/outcome/OutcomeSummary';
import { SkillOutcome } from '@/components/outcome/SkillOutcome';
import { SKILL_META } from '@/lib/skills';
import { cx } from '@/utils/cx';
import { CharacterCard } from '../CharacterCard';
import { PACE, PLANS, START_MODES } from '../content';
import { computeOutcome } from '../profile';
import { StepActions, StepHeader, type StepProps } from './shared';

export const MILESTONES = ['Find your feet', 'Build your bar', 'Go deep', 'Final form'];

export function ProfileStep({ ctx, send }: StepProps) {
  const o = useMemo(() => computeOutcome(ctx), [ctx]);
  return (
    <>
      <StepHeader eyebrow="Chapter 4 · Your profile" title={`You're a ${o.persona}.`}
        body="Here is where you stand in each skill today, and where your path takes you." />
      <OutcomeSummary result={o.result} role={o.future} />
      <SkillOutcome result={o.result} />
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-secondary">How much time can you give each day?</p>
        <Segmented label="Daily time" segments={PACE} value={String(ctx.minutesPerDay)} onChange={v => send({ type: 'SET', patch: { minutesPerDay: Number(v) } })} />
      </div>
      <StepActions onBack={() => send({ type: 'BACK' })} next={() => send({ type: 'NEXT' })} nextLabel="Meet future you" />
    </>
  );
}

export function FutureStep({ ctx, send }: StepProps) {
  const o = useMemo(() => computeOutcome(ctx), [ctx]);
  const [copied, setCopied] = useState(false);
  const share = async () => {
    try { await navigator.clipboard.writeText(`I'm on my way from ${o.persona} to ${o.future} on Shape.`); setCopied(true); } catch { /* clipboard blocked */ }
  };
  return (
    <>
      <StepHeader eyebrow="Chapter 5 · Future you" title={`This is you, ${o.result.estimate.weeks} weeks from now.`}
        body={`Follow the road and you become a ${o.future}. Flip the card to see the difference.`} />
      <CharacterCard result={o.result} persona={o.persona} future={o.future} name={ctx.name} weeks={o.result.estimate.weeks} />
      <StepActions onBack={() => send({ type: 'BACK' })} next={() => send({ type: 'NEXT' })} nextLabel="See the road ahead"
        extra={<Button color="secondary" size="lg" iconLeading={copied ? CheckIcon : ShareNetworkIcon} onPress={share}>{copied ? 'Copied' : 'Share'}</Button>} />
    </>
  );
}

export function RoadStep({ ctx, send }: StepProps) {
  const o = useMemo(() => computeOutcome(ctx), [ctx]);
  const zero = useMemo(() => computeOutcome({ ...ctx, fromZero: true }).result.path.length, [ctx]);
  const path = useMemo(() => computeOutcome({ ...ctx, fromZero: false }).result.path.length, [ctx]);
  const size = Math.max(1, Math.ceil(o.result.path.length / MILESTONES.length));
  const perWeek = o.result.estimate.weeks / Math.max(1, o.result.path.length);
  return (
    <>
      <StepHeader eyebrow="Chapter 6 · The road ahead" title="Your roadmap"
        body={`${o.result.path.length} chapters, about ${o.result.estimate.weeks} weeks at ${ctx.minutesPerDay} minutes a day.`} />
      <ol className="flex flex-col gap-3">
        {MILESTONES.map((m, i) => {
          const items = o.result.path.slice(i * size, (i + 1) * size);
          if (!items.length) return null;
          const w0 = Math.round(i * size * perWeek) + 1, w1 = Math.max(w0, Math.round((i * size + items.length) * perWeek));
          return (
            <li key={m} className="flex gap-3 rounded-xl bg-primary p-4 ring-1 ring-secondary ring-inset">
              <span className={cx('grid size-9 shrink-0 place-items-center rounded-full', i === MILESTONES.length - 1 ? 'bg-mint-600 text-white' : 'bg-brand-50 text-brand-secondary')}>
                <FlagIcon className="size-4.5" weight={i === MILESTONES.length - 1 ? 'fill' : 'duotone'} />
              </span>
              <div className="min-w-0">
                <p className="text-md font-semibold text-primary">{m}</p>
                <p className="text-sm text-tertiary">Week {w0}{w1 > w0 ? `–${w1}` : ''} · {items.length} chapters</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {items.slice(0, 3).map(p => { const Icon = SKILL_META[p.domain].icon; return (
                    <span key={p.id} className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary"><Icon className="size-3.5" weight="duotone" />{p.title}</span>
                  ); })}
                  {items.length > 3 && <span className="rounded-md px-2 py-0.5 text-xs text-tertiary">+{items.length - 3} more</span>}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      <ChoiceCards label="Where do you want to start?" columns={2} value={ctx.fromZero ? 'zero' : 'path'}
        choices={START_MODES.map(s => ({ ...s, description: `${s.description}. ${s.value === 'zero' ? zero : path} chapters.` }))}
        onChange={v => send({ type: 'SET', patch: { fromZero: v === 'zero' } })} />
      <StepActions onBack={() => send({ type: 'BACK' })} next={() => send({ type: 'NEXT' })} />
    </>
  );
}

export function PricingStep({ send }: StepProps) {
  return (
    <>
      <StepHeader eyebrow="Last step" title="Start learning for free"
        body="Everything is free during early access. Paid plans come later, and we'll tell you before anything changes." />
      <div className="grid gap-3">
        {PLANS.map(p => (
          <div key={p.id} className={cx('rounded-xl p-4 ring-inset', p.live ? 'bg-primary ring-2 ring-brand' : 'bg-secondary ring-1 ring-secondary')}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-md font-semibold text-primary">{p.name}</p>
              {p.live ? <Badge type="pill-color" color="success" size="sm">Start here</Badge> : <Badge type="modern" color="gray" size="sm">Coming soon</Badge>}
            </div>
            <p className="mt-1 text-display-xs font-semibold text-primary">{p.price} {p.per && <span className="text-sm font-normal text-tertiary">{p.per}</span>}</p>
            <ul className="mt-2 grid gap-1 sm:grid-cols-2">
              {p.perks.map(k => <li key={k} className="flex items-center gap-1.5 text-sm text-secondary"><CheckIcon className="size-4 text-mint-700" weight="bold" />{k}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <StepActions onBack={() => send({ type: 'BACK' })} next={() => send({ type: 'NEXT' })} nextLabel="Start free" />
    </>
  );
}
