'use client';
import type { ReactNode } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@phosphor-icons/react/ssr';
import { Button } from '@/components/base/buttons/button';
import type { OnboardingContext, OnboardingEvent } from '../machine';

export interface StepProps { ctx: OnboardingContext; send: (e: OnboardingEvent) => void }

export function StepHeader({ eyebrow, title, body }: { eyebrow: string; title: ReactNode; body?: ReactNode }) {
  return (
    <header className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-brand-secondary">{eyebrow}</p>
      <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">{title}</h1>
      {body && <p className="text-md text-tertiary">{body}</p>}
    </header>
  );
}

/** Back + primary action. `next` omitted = the step advances itself (e.g. answering a card). */
export function StepActions({ onBack, next, nextLabel = 'Continue', nextDisabled, extra }: {
  onBack?: () => void; next?: () => void; nextLabel?: string; nextDisabled?: boolean; extra?: ReactNode;
}) {
  return (
    <div className="mt-2 flex items-center justify-between gap-3">
      {onBack ? <Button color="link-gray" size="md" iconLeading={ArrowLeftIcon} onPress={onBack}>Back</Button> : <span />}
      <div className="flex items-center gap-3">
        {extra}
        {next && <Button size="lg" iconTrailing={ArrowRightIcon} onPress={next} isDisabled={nextDisabled}>{nextLabel}</Button>}
      </div>
    </div>
  );
}
