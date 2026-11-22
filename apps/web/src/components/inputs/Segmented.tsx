'use client';
import { ToggleButton, ToggleButtonGroup } from 'react-aria-components';
import { cx } from '@/utils/cx';

export interface Segment { value: string; label: string; hint?: string }

/** Segmented control for 2–5 short, ordered options (pace, frequency). One always selected. */
export function Segmented({ segments, value, onChange, label }: {
  segments: Segment[]; value?: string; onChange: (v: string) => void; label: string;
}) {
  return (
    <ToggleButtonGroup aria-label={label} selectionMode="single" disallowEmptySelection
      selectedKeys={value ? [value] : []} onSelectionChange={keys => { const k = [...keys][0]; if (k != null) onChange(String(k)); }}
      className="grid w-full auto-cols-fr grid-flow-col gap-1 rounded-xl bg-secondary_alt p-1 ring-1 ring-secondary ring-inset">
      {segments.map(s => (
        <ToggleButton key={s.value} id={s.value}
          className={({ isSelected, isFocusVisible }) => cx(
            'flex cursor-pointer flex-col items-center rounded-lg px-2 py-2 text-sm outline-none transition duration-100 ease-linear',
            isSelected ? 'bg-primary text-primary shadow-sm ring-1 ring-secondary ring-inset' : 'text-quaternary hover:text-secondary',
            isFocusVisible && 'outline-2 outline-offset-2 outline-brand',
          )}>
          <span className="font-semibold">{s.label}</span>
          {s.hint && <span className="text-xs text-tertiary">{s.hint}</span>}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
