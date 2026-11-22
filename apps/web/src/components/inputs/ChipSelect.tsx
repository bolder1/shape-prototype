'use client';
import type { Selection } from 'react-aria-components';
import { Tag, TagGroup, TagList } from '@/components/base/tags/tags';

export interface Chip { value: string; label: string }

/**
 * Multi-select chips (Untitled UI TagGroup) with an optional cap: interests, tools, tags.
 * At the cap, the newest pick replaces the oldest instead of silently doing nothing.
 */
export function ChipSelect({ chips, value, onChange, max, label }: {
  chips: Chip[]; value: string[]; onChange: (v: string[]) => void; max?: number; label: string;
}) {
  const handle = (keys: Selection) => {
    if (keys === 'all') return;
    const picked = [...keys].map(String);
    const added = picked.filter(k => !value.includes(k));
    const next = [...value.filter(k => picked.includes(k)), ...added];
    onChange(max && next.length > max ? next.slice(next.length - max) : next);
  };
  return (
    <TagGroup label={label} selectionMode="multiple" size="md" selectedKeys={new Set(value)} onSelectionChange={handle}>
      <TagList className="flex flex-wrap gap-2">
        {chips.map(c => <Tag key={c.value} id={c.value}>{c.label}</Tag>)}
      </TagList>
    </TagGroup>
  );
}
