'use client';
// Small interactive UI mocks used by exercises. Spot exercises make named regions tappable (hotspots);
// tune exercises pass a live `value`. Mocks deliberately contain the flaws the lesson teaches.
import type { ReactNode } from 'react';
import { ImageIcon, ShoppingBagIcon } from '@phosphor-icons/react/ssr';
import type { MockId } from '@shape/content';
import { cx } from '@/utils/cx';

export interface SpotState { selected: string[]; onToggle: (id: string) => void; reveal?: { targets: string[] }; disabled?: boolean }

function Hot({ id, label, spot, children, className }: { id: string; label: string; spot?: SpotState; children: ReactNode; className?: string }) {
  if (!spot) return <div className={className}>{children}</div>;
  const on = spot.selected.includes(id);
  const isTarget = spot.reveal?.targets.includes(id);
  const state = spot.reveal ? (isTarget ? (on ? 'hit' : 'missed') : on ? 'false' : 'none') : on ? 'on' : 'none';
  return (
    <button type="button" aria-pressed={on} aria-label={label} disabled={spot.disabled} onClick={() => spot.onToggle(id)}
      className={cx('relative block w-full rounded-lg text-left outline-none transition ring-offset-2 focus-visible:ring-2 focus-visible:ring-brand-solid',
        !spot.disabled && 'cursor-pointer hover:bg-brand-primary/60',
        state === 'on' && 'ring-2 ring-brand-solid bg-brand-primary',
        state === 'hit' && 'ring-2 ring-mint-600 bg-mint-50',
        state === 'missed' && 'outline-2 outline-dashed outline-offset-2 outline-mint-600',
        state === 'false' && 'ring-2 ring-error bg-error-primary', className)}>
      {children}
    </button>
  );
}

const Frame = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cx('mx-auto w-full max-w-md rounded-2xl bg-primary p-5 shadow-sm ring-1 ring-secondary', className)}>{children}</div>
);

function Buttons({ hierarchy }: { hierarchy: boolean }) {
  return (
    <Frame>
      <p className="text-md font-semibold text-primary">Unsaved changes</p>
      <p className="mt-1 text-sm text-tertiary">You edited 3 fields on this page.</p>
      <div className="mt-5 flex justify-end gap-2">
        {hierarchy ? (
          <><span className="rounded-lg px-3 py-2 text-sm font-semibold text-tertiary">Discard</span>
            <span className="rounded-lg bg-brand-solid px-4 py-2 text-sm font-semibold text-white">Save changes</span></>
        ) : (
          <><span className="rounded-lg px-4 py-2 text-sm font-semibold text-secondary ring-1 ring-primary">Discard</span>
            <span className="rounded-lg px-4 py-2 text-sm font-semibold text-secondary ring-1 ring-primary">Save changes</span></>
        )}
      </div>
    </Frame>
  );
}

function ProductCard({ spot }: { spot?: SpotState }) {
  return (
    <Frame className="flex flex-col gap-2">
      <Hot id="image" label="Product photo" spot={spot}>
        <div className="grid h-32 place-items-center rounded-lg bg-secondary text-fg-quaternary"><ImageIcon className="size-8" weight="duotone" /></div>
      </Hot>
      <Hot id="title" label="Product name" spot={spot} className="px-1"><p className="text-lg font-semibold text-primary">Linen overshirt</p></Hot>
      <Hot id="price" label="Price" spot={spot} className="px-1"><p className="text-xs text-quaternary">₹2,499</p></Hot>
      <Hot id="meta" label="Delivery details" spot={spot} className="px-1"><p className="text-sm text-[#D5D9E0]">Ships in 2 days · Free returns</p></Hot>
      <Hot id="actions" label="Buttons" spot={spot} className="p-1">
        <div className="grid grid-cols-2 gap-2">
          <span className="rounded-lg py-2 text-center text-sm font-semibold text-secondary ring-1 ring-primary">Buy now</span>
          <span className="flex items-center justify-center gap-1 rounded-lg py-2 text-sm font-semibold text-secondary ring-1 ring-primary"><ShoppingBagIcon className="size-4" />Add to cart</span>
        </div>
      </Hot>
    </Frame>
  );
}

function ReadingText({ value = 1.05 }: { value?: number }) {
  return (
    <Frame>
      <p className="text-md text-secondary" style={{ lineHeight: value }}>
        Good line spacing gives each line room to breathe, so the eye can travel back to the start of the next line without
        losing its place. Too tight, and lines blur into a grey block. Too loose, and the paragraph falls apart into separate strips
        that no longer feel connected.
      </p>
    </Frame>
  );
}

function GroupSpacing({ value = 10 }: { value?: number }) {
  const field = (label: string) => (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-secondary">{label}</span>
      <span className="h-9 rounded-lg ring-1 ring-primary" />
    </div>
  );
  return (
    <Frame>
      <div className="flex flex-col" style={{ gap: value }}>
        <div className="flex flex-col gap-2">{field('First name')}{field('Last name')}</div>
        <div className="flex flex-col gap-2">{field('Street address')}{field('City')}</div>
      </div>
    </Frame>
  );
}

/** value = % darkness of the helper text (0 white … 100 black). Shows the live contrast ratio. */
function ContrastLabel({ value = 30 }: { value?: number }) {
  const g = Math.round(255 * (1 - value / 100));
  const lin = (c: number) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
  const ratio = 1.05 / (lin(g) + 0.05);
  return (
    <Frame>
      <span className="text-sm font-medium text-secondary">Email</span>
      <span className="mt-1 block h-10 rounded-lg ring-1 ring-primary" />
      <p className="mt-2 text-sm" style={{ color: `rgb(${g},${g},${g})` }}>We’ll never share your email with anyone.</p>
      <p className="mt-4 inline-flex rounded-md bg-secondary px-2 py-0.5 font-mono text-xs text-secondary">Contrast {ratio.toFixed(1)}:1</p>
    </Frame>
  );
}

const QUESTIONS = [
  ['q1', 'Tell me about the last time you booked a train ticket.'],
  ['q2', 'Don’t you find the booking app confusing?'],
  ['q3', 'What happened next?'],
  ['q4', 'Would you use a feature that saves your favourite routes?'],
  ['q5', 'How do you usually decide which train to take?'],
  ['q6', 'Most people love our new design. What do you think?'],
];
function InterviewScript({ spot }: { spot?: SpotState }) {
  return (
    <Frame>
      <p className="mb-3 text-xs font-semibold tracking-wide text-quaternary uppercase">Interview script · Rail app</p>
      <ol className="flex flex-col gap-1.5">
        {QUESTIONS.map(([id, q], i) => (
          <li key={id}><Hot id={id} label={`Question ${i + 1}: ${q}`} spot={spot} className="px-2 py-1.5">
            <span className="text-sm text-secondary"><span className="mr-2 font-mono text-quaternary">{i + 1}</span>{q}</span>
          </Hot></li>
        ))}
      </ol>
    </Frame>
  );
}

const SETTINGS = ['Display name', 'Email', 'Password', 'Two-step login', 'Email alerts', 'Push alerts', 'Weekly digest', 'Theme', 'Language', 'Text size', 'Connected apps', 'Delete account'];
function SettingsList({ grouped }: { grouped: boolean }) {
  const row = (s: string) => <li key={s} className="flex items-center justify-between border-b border-secondary py-2 text-sm text-secondary last:border-0">{s}<span className="text-quaternary">›</span></li>;
  if (!grouped) return <Frame><ul>{SETTINGS.map(row)}</ul></Frame>;
  const groups: [string, string[]][] = [['Account', SETTINGS.slice(0, 4)], ['Notifications', SETTINGS.slice(4, 7)], ['Preferences', SETTINGS.slice(7, 12)]];
  return (
    <Frame className="flex flex-col gap-4">
      {groups.map(([h, items]) => <section key={h}><p className="mb-1 text-xs font-semibold tracking-wide text-quaternary uppercase">{h}</p><ul>{items.map(row)}</ul></section>)}
    </Frame>
  );
}

export function Mock({ id, value, spot }: { id: MockId; value?: number; spot?: SpotState }) {
  switch (id) {
    case 'buttons-equal': return <Buttons hierarchy={false} />;
    case 'buttons-hierarchy': return <Buttons hierarchy />;
    case 'product-card': return <ProductCard spot={spot} />;
    case 'reading-text': return <ReadingText value={value} />;
    case 'group-spacing': return <GroupSpacing value={value} />;
    case 'contrast-label': return <ContrastLabel value={value} />;
    case 'interview-script': return <InterviewScript spot={spot} />;
    case 'settings-list': return <SettingsList grouped={false} />;
    case 'settings-grouped': return <SettingsList grouped />;
  }
}
