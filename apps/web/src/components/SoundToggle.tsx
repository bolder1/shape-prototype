'use client';
import { SpeakerHighIcon, SpeakerSlashIcon } from '@phosphor-icons/react/ssr';
import { play, useSound } from '@/lib/sound';
import { cx } from '@/utils/cx';

/** Mute/unmute sound effects. Remembered per browser. */
export function SoundToggle({ className }: { className?: string }) {
  const { on, toggle } = useSound();
  return (
    <button type="button" aria-pressed={on} aria-label={on ? 'Mute sounds' : 'Turn sounds on'} title={on ? 'Sounds on' : 'Sounds off'}
      onClick={() => { toggle(); if (!on) setTimeout(() => play('tap'), 0); }}
      className={cx('grid size-9 shrink-0 place-items-center rounded-lg text-fg-quaternary transition hover:bg-primary_hover hover:text-fg-secondary', className)}>
      {on ? <SpeakerHighIcon className="size-5" weight="bold" /> : <SpeakerSlashIcon className="size-5" weight="bold" />}
    </button>
  );
}
