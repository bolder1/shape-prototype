'use client';
import { Radio, RadioGroup, Label } from 'react-aria-components';
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import { CheckIcon } from '@phosphor-icons/react/ssr';
import { motion } from 'motion/react';
import { cx } from '@/utils/cx';

export interface Choice { value: string; label: string; description?: string; icon?: PhosphorIcon }

/**
 * Card-style single choice: onboarding answers, lesson options.
 * React Aria RadioGroup: arrow keys move, Space selects, announced as "radio, 2 of 4".
 */
export function ChoiceCards({ choices, value, onChange, columns = 2, label, hideLabel }: {
  choices: Choice[]; value?: string; onChange?: (v: string) => void; columns?: 1 | 2 | 3 | 4; label: string; hideLabel?: boolean;
}) {
  return (
    <RadioGroup value={value ?? null} onChange={onChange} className="flex flex-col gap-2">
      <Label className={cx('text-sm font-medium text-secondary', hideLabel && 'sr-only')}>{label}</Label>
      <div className={cx('grid gap-2', { 1: 'grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'grid-cols-2 lg:grid-cols-4' }[columns])}>
        {choices.map((c, i) => (
          <motion.div key={c.value} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24, delay: i * 0.035 }}>
            <Radio value={c.value}
              className={({ isSelected, isFocusVisible, isHovered }) => cx(
                'relative flex h-full cursor-pointer items-start gap-3 rounded-xl bg-primary p-4 ring-1 ring-secondary outline-none transition duration-100 ease-linear ring-inset',
                isHovered && !isSelected && 'bg-primary_hover',
                isSelected && 'bg-brand-primary ring-2 ring-brand-solid',
                isFocusVisible && 'outline-2 outline-offset-2 outline-brand',
              )}>
              {({ isSelected }) => (
                <>
                  {c.icon && (
                    <span className={cx('grid size-10 shrink-0 place-items-center rounded-lg ring-1 ring-secondary ring-inset',
                      isSelected ? 'bg-brand-solid text-white ring-transparent' : 'bg-primary text-fg-secondary')}>
                      <c.icon className="size-5" weight={isSelected ? 'fill' : 'duotone'} />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-primary">{c.label}</span>
                    {c.description && <span className="mt-0.5 block text-sm text-tertiary">{c.description}</span>}
                  </span>
                  <span className={cx('grid size-5 shrink-0 place-items-center rounded-full transition-all',
                    isSelected ? 'scale-100 bg-brand-solid text-white' : 'scale-90 ring-1 ring-primary ring-inset')}>
                    {isSelected && <CheckIcon className="size-3" weight="bold" />}
                  </span>
                </>
              )}
            </Radio>
          </motion.div>
        ))}
      </div>
    </RadioGroup>
  );
}
