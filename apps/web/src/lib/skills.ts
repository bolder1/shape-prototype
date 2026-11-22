// Icons: Phosphor only (see docs/06-icons-and-inputs.md). Skill icons render in the duotone weight.
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import {
  CodeIcon, CursorClickIcon, HandshakeIcon, MagnifyingGlassIcon, MegaphoneIcon, PaletteIcon, PersonArmsSpreadIcon,
  ShapesIcon, StackIcon, TargetIcon, TextAaIcon, TreeStructureIcon, TrendUpIcon, UsersThreeIcon,
} from '@phosphor-icons/react/ssr';
import type { DomainId } from '@shape/engine';

export type FamilyId = 'discover' | 'design' | 'grow' | 'build';

/** Four skill families. Colour belongs to the family, never to an individual skill (14 hues would be noise). */
export const FAMILIES: Record<FamilyId, { label: string; blurb: string; color: string }> = {
  discover: { label: 'Discover', blurb: 'Understand people and decide what matters', color: 'var(--color-family-discover)' },
  design:   { label: 'Design',   blurb: 'Shape how a product works, looks and reads', color: 'var(--color-family-design)' },
  grow:     { label: 'Grow',     blurb: 'Bring a product to market and make it win', color: 'var(--color-family-grow)' },
  build:    { label: 'Build & lead', blurb: 'Ship it in code and grow the people around you', color: 'var(--color-family-build)' },
};

export type { PhosphorIcon };

export const SKILL_META: Record<DomainId, { short: string; family: FamilyId; icon: PhosphorIcon }> = {
  rs: { short: 'User research',        family: 'discover', icon: MagnifyingGlassIcon },
  st: { short: 'Product strategy',     family: 'discover', icon: TargetIcon },
  fd: { short: 'Design foundations',   family: 'design',   icon: ShapesIcon },
  ia: { short: 'Flows & structure',    family: 'design',   icon: TreeStructureIcon },
  ui: { short: 'Visual & UI',          family: 'design',   icon: PaletteIcon },
  ds: { short: 'Design systems',       family: 'design',   icon: StackIcon },
  pr: { short: 'Prototyping & motion', family: 'design',   icon: CursorClickIcon },
  cw: { short: 'UX writing',           family: 'design',   icon: TextAaIcon },
  ax: { short: 'Accessibility',        family: 'design',   icon: PersonArmsSpreadIcon },
  gr: { short: 'Growth design',        family: 'grow',     icon: TrendUpIcon },
  br: { short: 'Brand & marketing',    family: 'grow',     icon: MegaphoneIcon },
  bz: { short: 'Business & pitching',  family: 'grow',     icon: HandshakeIcon },
  dc: { short: 'Code & AI',            family: 'build',    icon: CodeIcon },
  ld: { short: 'Leadership',           family: 'build',    icon: UsersThreeIcon },
};

export const FAMILY_ORDER: FamilyId[] = ['discover', 'design', 'grow', 'build'];
export const skillsInFamily = (f: FamilyId) => (Object.keys(SKILL_META) as DomainId[]).filter(id => SKILL_META[id].family === f);

/** Level names, shared by onboarding answers, the outcome chart and lessons. */
export const LEVEL_NAMES = ['Not started', 'Aware', 'Literate', 'Practitioner', 'Advanced', 'Expert'] as const;
