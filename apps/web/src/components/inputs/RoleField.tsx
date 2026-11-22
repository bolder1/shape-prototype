'use client';
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import { ComboBox } from '@/components/base/select/combobox';
import { SelectItem } from '@/components/base/select/select-item';

export interface RoleOption { id: string; label: string; supportingText?: string; icon?: PhosphorIcon }

/**
 * Type-to-search field for long lists (roles, tools). Built on Untitled UI ComboBox.
 * allowsCustomValue: if your role isn't listed, what you type is kept as the answer.
 */
export function RoleField({ options, label, hint, placeholder, onChange }: {
  options: RoleOption[]; label: string; hint?: string; placeholder?: string;
  onChange: (value: { id?: string; text: string }) => void;
}) {
  return (
    <ComboBox
      label={label} hint={hint} placeholder={placeholder} shortcut={false} allowsCustomValue
      items={options.map(o => ({ id: o.id, label: o.label, supportingText: o.supportingText, icon: o.icon }))}
      onSelectionChange={key => { const o = options.find(x => x.id === key); if (o) onChange({ id: o.id, text: o.label }); }}
      onInputChange={text => {
        // Untitled's ComboBox shows "label supportingText" in the input after a pick; treat that as the pick, not custom text.
        const t = text.trim();
        const o = options.find(x => t === x.label || t === `${x.label} ${x.supportingText ?? ''}`.trim());
        onChange(o ? { id: o.id, text: o.label } : { text });
      }}
    >
      {item => <SelectItem id={item.id} label={item.label} supportingText={item.supportingText} icon={item.icon} />}
    </ComboBox>
  );
}
