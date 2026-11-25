// A second brand on Rasta's system, for chapter ds.5. A year after ds.4, Rasta has bought Sawari, a premium
// intercity coach brand (Chennai–Bengaluru, Hyderabad–Vijayawada and nine more routes) with its own iOS, Android and
// web apps. Sawari keeps its name, its plum and gold and its serif headings, and is rebuilt on Rasta's components
// rather than a copy of them. Kavya's system team owns the move, with Arjun on the pipeline and Meera Iyer, Sawari's
// brand lead, on the brand side. This is the data the ds.5 scenes and games draw, and the rules they score against:
// what a brand may change and what every brand shares, what stays the same across iOS, Android and web, and which
// way a change flows when Figma and code disagree.
import { contrastRatio } from './episode';

// ── Multi-brand theming (ds.5-1, `brand-tune`) ──────────────────────────────────────────────────────────────────────

export const BRAND_IDS = ['rasta', 'sawari'] as const;
export type BrandId = (typeof BRAND_IDS)[number];
export const BRAND_MODES = ['light', 'dark'] as const;
export type BrandMode = (typeof BRAND_MODES)[number];

/** The semantic values a theme resolves, per brand and mode. Components only ever read these names; a brand is a set
 *  of values for them, never a prop or a variant. `display` is the heading face, `radius` the container radius in px. */
export interface BrandTheme {
  actionPrimary: string; onAction: string; surface: string; text: string; accent: string;
  display: 'sans' | 'serif'; radius: number;
}

/** Rasta and Sawari, light and dark: four themes, one set of components. */
export const BRAND_THEMES: Record<BrandId, Record<BrandMode, BrandTheme>> = {
  rasta: {
    light: { actionPrimary: '#0F766E', onAction: '#FFFFFF', surface: '#FFFFFF', text: '#101828', accent: '#0F766E', display: 'sans', radius: 8 },
    dark: { actionPrimary: '#2DD4BF', onAction: '#0C111D', surface: '#0C111D', text: '#F2F4F7', accent: '#2DD4BF', display: 'sans', radius: 8 },
  },
  sawari: {
    light: { actionPrimary: '#6B357F', onAction: '#FFFFFF', surface: '#FFFCF7', text: '#1D1024', accent: '#E3AE3B', display: 'serif', radius: 12 },
    dark: { actionPrimary: '#D3AEE3', onAction: '#3F1F4B', surface: '#140D17', text: '#F3E8F8', accent: '#F2C96B', display: 'serif', radius: 12 },
  },
};

/** The checks the token build runs on every theme before it publishes: text on its fill, text on the page, and the
 *  button against the page (WCAG 1.4.11, 3:1 for a control's boundary). */
export function themeChecks(t: BrandTheme) {
  const checks = [
    { pair: 'label on button', ratio: contrastRatio(t.onAction, t.actionPrimary), min: 4.5 },
    { pair: 'text on page', ratio: contrastRatio(t.text, t.surface), min: 4.5 },
    { pair: 'button on page', ratio: contrastRatio(t.actionPrimary, t.surface), min: 3 },
  ];
  return checks.map(c => ({ ...c, pass: c.ratio >= c.min }));
}

/** How many tokens Rasta's system has, and how many Sawari's brand layer sets. Everything else is shared. */
export const SYSTEM_TOKENS = 412;
export const SAWARI_OVERRIDES = 38;

/** Sawari's plum and gold ramps, the primitives its brand layer points at. */
export const SAWARI_RAMPS = {
  plum: { 50: '#FAF5FC', 100: '#F3E8F8', 200: '#E6D0F0', 300: '#D3AEE3', 400: '#B983CF', 500: '#9D5BB6', 600: '#82449A', 700: '#6B357F', 800: '#552A65', 900: '#3F1F4B' },
  gold: { 200: '#F8E2A8', 300: '#F2C96B', 400: '#E3AE3B', 500: '#C98F1E', 600: '#A87116', 700: '#865815' },
} as const;
export type SawariRamp = keyof typeof SAWARI_RAMPS;
export const sawariSteps = (ramp: SawariRamp) => Object.keys(SAWARI_RAMPS[ramp]).map(Number).sort((a, b) => a - b);
export const sawariHex = (ramp: SawariRamp, step: number): string => (SAWARI_RAMPS[ramp] as Record<number, string>)[step];

/** What happens to a brand request (`brand-tune` lanes). `theme`: a brand decision; set it in Sawari's brand layer as
 *  asked. `tune`: a brand decision, but the value as asked fails a rule every brand shares, so tune it until it
 *  passes. `shared`: not a brand decision at all; it stays the same in every brand. */
export const BRAND_CALLS = ['theme', 'tune', 'shared'] as const;
export type BrandCall = (typeof BRAND_CALLS)[number];

/** A colour to tune: which ramp it moves along, what it sits on, and the ratio it must reach. */
export interface TuneSpec { ramp: SawariRamp; asked: number; against: string; min: number; role: string }

/** A request from Sawari's brand team. `shared`: it touches meaning, accessibility or a component's API, which no
 *  brand owns. `tune`: present when the value as asked has to pass a contrast rule. */
export interface BrandRequest { text: string; token: string; shared: boolean; tune?: TuneSpec }

/** The ratio a tuned step reaches, and whether it passes. */
export function tuneCheck(spec: TuneSpec, step: number) {
  const ratio = contrastRatio(sawariHex(spec.ramp, step), spec.against);
  return { ratio, pass: ratio >= spec.min };
}

/** Shared things stay shared. A brand value that fails its shared rule as asked gets tuned; the rest is themed. */
export const brandCall = (r: BrandRequest): BrandCall =>
  r.shared ? 'shared' : r.tune && !tuneCheck(r.tune, r.tune.asked).pass ? 'tune' : 'theme';

/** The steps on a ramp that pass, nearest the asked step first: the brand team's colour, changed as little as it can be. */
export function passingSteps(spec: TuneSpec): number[] {
  return sawariSteps(spec.ramp).filter(s => tuneCheck(spec, s).pass)
    .sort((a, b) => Math.abs(a - spec.asked) - Math.abs(b - spec.asked) || a - b);
}

/** Meera's requests for Sawari (`brand-tune` cards). */
const REQUESTS = {
  serif: { text: 'Headings in Sawari’s serif. Body text stays in the system sans', token: 'font-family-display', shared: false },
  radius: { text: 'Softer corners: 12 px on cards and sheets, where Rasta uses 8', token: 'radius-container', shared: false },
  cardEdge: { text: 'A thin gold-400 line along the top of every card', token: 'card-accent-border', shared: false },
  motion: { text: 'Calmer transitions: 280 ms where Rasta uses 200', token: 'motion-duration-base', shared: false },
  iconStroke: { text: 'Sawari’s finer 1.5 px icon stroke, where Rasta’s icons use 2 px', token: 'icon-stroke-width', shared: false },
  goldLabel: { text: 'Plum-700 labels on the gold-400 “Book seat” button', token: 'color-text-on-accent', shared: false,
    tune: { ramp: 'plum', asked: 700, against: SAWARI_RAMPS.gold[400], min: 4.5, role: 'Label on gold-400' } },
  plumLink: { text: 'Links in a lighter plum-400, on white', token: 'color-text-link', shared: false,
    tune: { ramp: 'plum', asked: 400, against: '#FFFFFF', min: 4.5, role: 'Link on white' } },
  darkLink: { text: 'Dark mode: keep the plum-600 links on the near-black page', token: 'color-text-link (dark)', shared: false,
    tune: { ramp: 'plum', asked: 600, against: '#0C111D', min: 4.5, role: 'Link on the dark page' } },
  errorGold: { text: 'Error messages in gold instead of red, so nothing clashes with the brand', token: 'color-feedback-error', shared: true },
  slimButton: { text: 'Slimmer 36 px buttons, to look more premium', token: 'button-min-height', shared: true },
  focusRing: { text: 'Hide the focus ring on Sawari: it looks busy on plum', token: 'focus-ring-width', shared: true },
} as const satisfies Record<string, BrandRequest>;
export type SawariRequest = keyof typeof REQUESTS;
export const SAWARI_REQUESTS: Record<SawariRequest, BrandRequest> = REQUESTS;

// ── iOS / Android / Web parity (ds.5-2, `parity-sort`) ──────────────────────────────────────────────────────────────

export const PARITY_PLATFORMS = ['ios', 'android', 'web'] as const;
export type ParityPlatform = (typeof PARITY_PLATFORMS)[number];
export const PARITY_PLATFORM_LABEL: Record<ParityPlatform, string> = { ios: 'iOS', android: 'Android', web: 'Web' };

/** How a decision should differ across platforms (`parity-sort` lanes). `same`: identical everywhere, because it is
 *  what the product says or does, or the brand itself. `adapt`: the same intent, expressed in each platform's own
 *  unit or mechanism. `native`: the platform owns it, and riders already know its control or gesture. */
export const PARITY_CALLS = ['same', 'adapt', 'native'] as const;
export type ParityCall = (typeof PARITY_CALLS)[number];

/** A decision in Sawari's booking flow. `meaning`: it changes what the product says, charges or asks for, so a rider
 *  (and the support team) must get the same answer everywhere. `convention`: the OS has its own control or gesture
 *  for it. `mechanism`: the value has to be expressed in a platform's own unit or rendering. `show`: what each
 *  platform renders, for the game's three frames. */
export interface PlatformDecision {
  text: string; meaning: boolean; convention: boolean; mechanism: boolean;
  show: Record<ParityPlatform, string>;
}

/** Meaning first: a fee or a step never differs, whatever the platform does. Then the platform's own conventions.
 *  Then values each platform measures its own way. Anything left is brand, and brand is the same everywhere. */
export const parityCall = (d: PlatformDecision): ParityCall =>
  d.meaning ? 'same' : d.convention ? 'native' : d.mechanism ? 'adapt' : 'same';

/** Decisions in Sawari's booking flow (`parity-sort` cards). */
const DECISIONS = {
  fare: { text: 'How the fare breaks down before Pay: ₹1,240 plus a ₹62 convenience fee', meaning: true, convention: false, mechanism: false,
    show: { ios: '₹1,240 + ₹62 fee', android: '₹1,240 + ₹62 fee', web: '₹1,240 + ₹62 fee' } },
  steps: { text: 'The order of the booking steps: route, seat, passengers, pay', meaning: true, convention: false, mechanism: false,
    show: { ios: 'Route → Seat → Pay', android: 'Route → Seat → Pay', web: 'Route → Seat → Pay' } },
  upiError: { text: 'What the screen says when a UPI payment fails, and what to do next', meaning: true, convention: false, mechanism: false,
    show: { ios: '“Not charged. Try again”', android: '“Not charged. Try again”', web: '“Not charged. Try again”' } },
  plum: { text: 'The plum on the primary button, plum-700', meaning: false, convention: false, mechanism: false,
    show: { ios: 'plum-700', android: 'plum-700', web: 'plum-700' } },
  bodySize: { text: 'Body text size, so it follows each phone’s text-size setting', meaning: false, convention: false, mechanism: true,
    show: { ios: '17 pt, Dynamic Type', android: '16 sp, font scale', web: '1 rem, browser zoom' } },
  target: { text: 'The smallest tap area for a seat on the seat map', meaning: false, convention: false, mechanism: true,
    show: { ios: '44 × 44 pt', android: '48 × 48 dp', web: '44 × 44 px' } },
  elevation: { text: 'How the fare sheet shows it sits above the page', meaning: false, convention: false, mechanism: true,
    show: { ios: 'Soft shadow', android: 'Tonal surface', web: 'box-shadow' } },
  back: { text: 'Going back from the seat map to the bus list', meaning: false, convention: true, mechanism: false,
    show: { ios: 'Edge swipe, ‹ Buses', android: 'System back', web: 'Browser back' } },
  share: { text: 'Sending the ticket to family on WhatsApp', meaning: false, convention: true, mechanism: false,
    show: { ios: 'Share sheet', android: 'Sharesheet', web: 'Web Share or copy link' } },
  toggle: { text: 'The on/off control for “Alert me when the bus is 10 minutes away”', meaning: false, convention: true, mechanism: false,
    show: { ios: 'iOS switch', android: 'Material switch', web: 'Switch, role="switch"' } },
  time: { text: 'Picking the time for a departure-time alarm', meaning: false, convention: true, mechanism: false,
    show: { ios: 'Wheel picker', android: 'Clock dial', web: '<input type="time">' } },
} as const satisfies Record<string, PlatformDecision>;
export type SawariDecision = keyof typeof DECISIONS;
export const SAWARI_DECISIONS: Record<SawariDecision, PlatformDecision> = DECISIONS;

// ── Design-code sync (ds.5-3, `sync-flow`) ──────────────────────────────────────────────────────────────────────────

/** Where the truth lives for each kind of thing. Tokens: the tokens repository (W3C design-token JSON), which builds
 *  Figma variables and every platform's code. Component API: the code. New designs: Figma, through an approved RFC. */
export const SYNC_SOURCES = { tokens: 'tokens repo', api: 'code', design: 'Figma, via RFC' } as const;

/** What to do with a drift the nightly check finds (`sync-flow` lanes). `to-code`: the design is ahead and approved;
 *  build it. `to-figma`: code or the tokens repo is ahead and approved; bring the library up to it. `revert`: one
 *  side changed without going through its source; undo it there, and propose it properly if it's wanted. */
export const SYNC_MOVES = ['to-code', 'to-figma', 'revert'] as const;
export type SyncMove = (typeof SYNC_MOVES)[number];

/** A difference between the Figma library and the code. `figma` and `code`: whether each has the change. `source`:
 *  whether its source of truth has it (a merged tokens PR, a released version, an approved RFC). */
export interface DriftReport { text: string; figma: boolean; code: boolean; source: boolean; kind: keyof typeof SYNC_SOURCES }

/** A change its source doesn't have is reverted wherever it was made. One its source has flows to whichever side
 *  is missing it. */
export const syncMove = (d: DriftReport): SyncMove => (!d.source ? 'revert' : !d.code ? 'to-code' : 'to-figma');
/** The side the move acts on: where an unapproved change was made, or the side that's behind an approved one. */
export const driftSide = (d: DriftReport): 'figma' | 'code' => (d.source ? (d.code ? 'figma' : 'code') : d.figma ? 'figma' : 'code');

/** How many drifts the first nightly check found, and how many are still open once these are handled. */
export const DRIFTS_FOUND = 47;
export const DRIFTS_LEFT = 3;
/** The version both sides release under once they agree. */
export const SYNCED_VERSION = '4.1.0';

/** What the nightly check found this week (`sync-flow` cards). */
const DRIFTS = {
  ghost: { text: 'Figma’s Button has a `ghost` variant from approved RFC-41. The React, Compose and SwiftUI Buttons don’t', figma: true, code: false, source: true, kind: 'design' },
  focus: { text: 'After the accessibility audit, Figma’s focus ring is 3 px with a 2 px gap, as approved. Web still draws 2 px', figma: true, code: false, source: true, kind: 'design' },
  serifIos: { text: 'Sawari’s serif headings are merged in the tokens repo and show in Figma. The iOS theme still uses the system font', figma: true, code: false, source: true, kind: 'tokens' },
  slot: { text: 'Input’s `iconTrailing` slot shipped in 3.5.0. The Figma Input has no such property', figma: false, code: true, source: true, kind: 'api' },
  rename: { text: 'Code renamed Button’s `type` to `variant` in 3.5.0. The Figma property is still called “Type”', figma: false, code: true, source: true, kind: 'api' },
  plumValue: { text: 'The tokens repo has Sawari’s `color-action-primary` as plum-700, merged, and code uses it. Figma’s Sawari mode still shows plum-600', figma: false, code: true, source: true, kind: 'tokens' },
  handRadius: { text: 'Someone set Sawari’s `radius-container` to 20 in Figma variables by hand. There’s no tokens PR', figma: true, code: false, source: false, kind: 'tokens' },
  brandVariant: { text: 'The Figma Sheet has a new “Sawari” variant, drawn by hand. Code has no brand variants', figma: true, code: false, source: false, kind: 'design' },
  brandProp: { text: 'A pull request adds a `brand="sawari"` prop to the React Card', figma: false, code: true, source: false, kind: 'api' },
  goldBright: { text: 'Android’s Compose theme has a `sawariGoldBright` colour that isn’t in the tokens repo', figma: false, code: true, source: false, kind: 'tokens' },
  iconSize: { text: 'Figma’s IconButton has a 20 px icon size nobody proposed. Code offers 16 and 24', figma: true, code: false, source: false, kind: 'design' },
} as const satisfies Record<string, DriftReport>;
export type SawariDrift = keyof typeof DRIFTS;
export const SAWARI_DRIFTS: Record<SawariDrift, DriftReport> = DRIFTS;
