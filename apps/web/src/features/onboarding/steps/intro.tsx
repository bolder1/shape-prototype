'use client';
import { Input } from '@/components/base/input/input';
import { Select } from '@/components/base/select/select';
import { SelectItem } from '@/components/base/select/select-item';
import { ChoiceCards } from '@/components/inputs/ChoiceCards';
import { ChipSelect } from '@/components/inputs/ChipSelect';
import { RoleField } from '@/components/inputs/RoleField';
import type { DomainId } from '@shape/engine';
import { ASPIRATIONS, INTERESTS, ROLES, YEARS } from '../content';
import { StepActions, StepHeader, type StepProps } from './shared';

export function ArrivalStep({ ctx, send }: StepProps) {
  return (
    <>
      <StepHeader eyebrow="Welcome" title="Every product starts as a problem someone noticed."
        body="In about four minutes, walk the road from idea to launch, see where you stand in each part of design, and meet the designer you could become." />
      <Input label="What should we call you?" hint="Optional" placeholder="First name" value={ctx.name}
        onChange={name => send({ type: 'SET', patch: { name } })} />
      <StepActions next={() => send({ type: 'NEXT' })} nextLabel="Begin the story" />
    </>
  );
}

export function DreamStep({ ctx, send }: StepProps) {
  return (
    <>
      <StepHeader eyebrow="Chapter 1 · The dream" title={ctx.name ? `${ctx.name}, who do you want to become?` : 'Who do you want to become?'}
        body="Pick the one that pulls you most. You can change it later." />
      <ChoiceCards label="Who do you want to become?" hideLabel columns={2} value={ctx.aspiration ?? undefined}
        choices={ASPIRATIONS.map(a => ({ value: a.id, label: a.label, description: a.description, icon: a.icon }))}
        onChange={aspiration => send({ type: 'SET', patch: { aspiration } })} />
      <StepActions onBack={() => send({ type: 'BACK' })} next={() => send({ type: 'NEXT' })} nextDisabled={!ctx.aspiration} />
    </>
  );
}

export function TodayStep({ ctx, send }: StepProps) {
  return (
    <>
      <StepHeader eyebrow="Chapter 2 · Today" title="And today, what do you do?"
        body="Designers and people from neighbouring crafts are all welcome here." />
      <RoleField label="Your current role" placeholder="Search or type your role" options={ROLES}
        hint={ctx.roleText ? `Saved as: ${ctx.roleText}` : 'Not listed? Just type it.'}
        onChange={v => send({ type: 'SET', patch: { role: v.id ?? null, roleText: v.text } })} />
      <Select label="How long have you been doing it?" placeholder="Select" items={YEARS} selectedKey={ctx.years}
        onSelectionChange={k => send({ type: 'SET', patch: { years: k ? String(k) : null } })}>
        {item => <SelectItem id={item.id} label={item.label} />}
      </Select>
      <StepActions onBack={() => send({ type: 'BACK' })} next={() => send({ type: 'NEXT' })} nextDisabled={!ctx.roleText.trim()} />
    </>
  );
}

export function InterestsStep({ ctx, send }: StepProps) {
  return (
    <>
      <StepHeader eyebrow="Chapter 2 · Today" title="Which of these sound fun?" body="Pick up to two. There are no wrong answers." />
      <ChipSelect label="Interests" max={2} value={ctx.interests} chips={INTERESTS}
        onChange={v => send({ type: 'SET', patch: { interests: v as DomainId[] } })} />
      <StepActions onBack={() => send({ type: 'BACK' })} next={() => send({ type: 'NEXT' })} nextDisabled={!ctx.interests.length} />
    </>
  );
}
