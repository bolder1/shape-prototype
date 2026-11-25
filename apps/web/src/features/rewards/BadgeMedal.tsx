'use client';
// A badge drawn as a medal: the outline says what kind it is, the metal says the tier, the glyph says which badge.
// Vector and token-coloured, so it matches the product and stays crisp at any size. Locked badges are drawn as a
// quiet outline; secret ones show only a question mark.
import {
  BookOpenTextIcon, BrainIcon, CalendarCheckIcon, CrownIcon, FireIcon, MedalIcon, MoonStarsIcon, QuestionIcon,
  SealCheckIcon, ShareNetworkIcon, SparkleIcon, StackIcon, SwordIcon, ArrowCounterClockwiseIcon, WindIcon,
} from '@phosphor-icons/react/ssr';
import type { BadgeKind, BadgeTier } from '@shape/engine';
import { cx } from '@/utils/cx';

type Icon = typeof MedalIcon;
export const BADGE_ICON: Record<string, Icon> = {
  lessons: BookOpenTextIcon, 'top-marks': SealCheckIcon, 'chapter-master': CrownIcon, 'well-rounded': StackIcon,
  'boss-slayer': SwordIcon, distinction: MedalIcon, flawless: SparkleIcon,
  'on-fire': FireIcon, reviewer: BrainIcon, regular: CalendarCheckIcon,
  'show-off': ShareNetworkIcon,
  'night-owl': MoonStarsIcon, comeback: ArrowCounterClockwiseIcon, 'second-wind': WindIcon,
};

/** Metal for each tier: a light and a dark stop, chosen so the white glyph keeps ≥ 4.5:1 on the darker half. */
const METAL: Record<BadgeTier, [string, string]> = {
  bronze: ['#E0A36A', '#8A4B1F'],
  silver: ['#D5DCE6', '#5B6B80'],
  gold: ['#F6D365', '#9A6A00'],
};

/** Outline per kind, in a 64×64 box. */
const SHAPE: Record<BadgeKind, string> = {
  mastery: 'M32 3 L58 18 L58 46 L32 61 L6 46 L6 18 Z',                                   // hexagon
  craft: 'M32 3 L56 11 L56 34 C56 48 45 57 32 61 C19 57 8 48 8 34 L8 11 Z',               // shield
  habit: 'M32 4 A28 28 0 1 1 31.99 4 Z',                                                   // circle
  social: 'M14 6 H50 A8 8 0 0 1 58 14 V50 A8 8 0 0 1 50 58 H14 A8 8 0 0 1 6 50 V14 A8 8 0 0 1 14 6 Z', // rounded square
  secret: 'M32 3 L39 22 L60 24 L44 37 L49 58 L32 47 L15 58 L20 37 L4 24 L25 22 Z',         // star
};

export function BadgeMedal({ id, kind, tier, hidden = false, size = 56, className }: {
  id: string; kind: BadgeKind; tier: BadgeTier | null; hidden?: boolean; size?: number; className?: string;
}) {
  const Glyph = hidden ? QuestionIcon : BADGE_ICON[id] ?? MedalIcon;
  const grad = `medal-${id}-${tier ?? 'none'}`;
  const [light, dark] = tier ? METAL[tier] : ['transparent', 'transparent'];
  return (
    <span className={cx('relative inline-grid shrink-0 place-items-center', className)} style={{ width: size, height: size }} aria-hidden>
      <svg viewBox="0 0 64 64" className="absolute inset-0 size-full">
        {tier && (
          <defs>
            <linearGradient id={grad} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={light} />
              <stop offset="0.55" stopColor={dark} />
            </linearGradient>
          </defs>
        )}
        <path d={SHAPE[kind]} fill={tier ? `url(#${grad})` : 'var(--color-bg-tertiary)'}
          stroke={tier ? dark : 'var(--color-border-secondary)'} strokeWidth={tier ? 1.5 : 2} strokeDasharray={tier ? undefined : '4 3'} strokeLinejoin="round" />
        {tier && <path d={SHAPE[kind]} fill="none" stroke="white" strokeOpacity={0.35} strokeWidth={1} transform="translate(32 32) scale(0.86) translate(-32 -32)" />}
      </svg>
      <Glyph className={cx('relative', tier ? 'text-white' : 'text-fg-quaternary')} style={{ width: size * 0.42, height: size * 0.42 }} weight={tier ? 'fill' : 'bold'} />
    </span>
  );
}

export const tierLabel = (t: BadgeTier) => t[0].toUpperCase() + t.slice(1);
