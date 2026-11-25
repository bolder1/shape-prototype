// Rasta's design system at scale, for chapter ds.4. Two years after ds.2 and ds.3, Rasta sells bus, metro and
// suburban-rail passes in Chennai, Bengaluru, Hyderabad and Kochi, and its design team has grown to 38 designers in
// nine squads. Kavya leads the design-system team (two designers, two engineers including Arjun). This chapter is
// about running the system as a product: which requests the team builds and which squads contribute, how releases are
// numbered and old APIs retired, and how adoption is measured without fooling anyone. This is the data the ds.4 scenes
// and games draw, and the rules they score against.

// ── Contribution models (ds.4-1, `contribution-route`) ──────────────────────────────────────────────────────────────

/** Where a request to the system goes (`contribution-route` lanes). `reuse`: the system already does this job; point
 *  the squad to it and fix whatever made them miss it. `local`: one squad needs it, or it's a one-off; build it in the
 *  product, log it, and revisit when a second squad asks. `contribute`: the squad that needs it builds it in the
 *  system, with the system team reviewing and pairing. `core`: the system team designs and builds it, because many
 *  squads need it and it has to work for all of them. */
export const CONTRIBUTION_PATHS = ['reuse', 'local', 'contribute', 'core'] as const;
export type ContributionPath = (typeof CONTRIBUTION_PATHS)[number];

/** A request in the system team's queue. `kind`: a fix to something in the system, a variant of an existing
 *  component, or a new component. `teams`: how many squads need it now (not "might one day"). `exists`: something in
 *  the system already does this job; `match` names it. */
export interface SystemRequest { text: string; squad: string; kind: 'fix' | 'variant' | 'component'; teams: number; exists: boolean; match?: string }

/** A new component this many squads need is worth the system team's own time. */
export const CORE_TEAMS = 3;

/** Route a request. Something that exists is reused. A fix is always welcome, from anyone. A thing one squad needs
 *  stays local. A new component three or more squads need is core work; anything else shared is a contribution. */
export const contributionPath = (r: SystemRequest): ContributionPath =>
  r.exists ? 'reuse'
    : r.kind === 'fix' ? 'contribute'
      : r.teams < 2 ? 'local'
        : r.kind === 'component' && r.teams >= CORE_TEAMS ? 'core'
          : 'contribute';

/** System-team hours each path costs: a new core component is research, design, accessibility, React and Figma
 *  builds, and docs; a contribution is review and pairing; reuse and local are a docs pointer or a line in the log. */
export const PATH_HOURS: Record<ContributionPath, number> = { reuse: 1, local: 1, contribute: 12, core: 120 };
/** The hours Kavya's team keeps for requests this quarter, after foundations, migrations and support. */
export const REQUEST_BUDGET = 320;
/** System-team hours for a set of routed requests. */
export const requestHours = (paths: readonly ContributionPath[]) => paths.reduce((s, p) => s + PATH_HOURS[p], 0);

/** Who does each step on each path, for the game's path strip. */
export const PATH_STEPS: Record<ContributionPath, readonly { who: 'squad' | 'system'; step: string }[]> = {
  reuse: [{ who: 'system', step: 'Point to the component' }, { who: 'system', step: 'Fix the docs that hid it' }],
  local: [{ who: 'squad', step: 'Build it in the product' }, { who: 'system', step: 'Log it in the register' }, { who: 'system', step: 'Revisit when a second squad asks' }],
  contribute: [{ who: 'squad', step: 'Propose with the template' }, { who: 'system', step: 'Review the design' }, { who: 'squad', step: 'Build in the system, paired' }, { who: 'system', step: 'Docs check and release' }],
  core: [{ who: 'system', step: 'Gather every squad’s cases' }, { who: 'system', step: 'Design and test' }, { who: 'system', step: 'Build, docs, release' }, { who: 'squad', step: 'Pilot it first' }],
};

/** The requests in Kavya's queue this quarter (`contribution-route` cards). */
const REQUESTS = {
  datePicker: { text: 'A date picker for choosing when a pass starts. Bus, Metro, Business and Rail have each built their own', squad: 'Bus passes', kind: 'component', teams: 4, exists: false },
  qrTicket: { text: 'A QR ticket card that turns the screen to full brightness at the metro gate', squad: 'Metro', kind: 'component', teams: 1, exists: false },
  dangerTertiary: { text: 'A danger style for the tertiary button, for “Remove card” and “Remove employee”', squad: 'Payments', kind: 'variant', teams: 2, exists: false },
  focusRing: { text: 'The Button’s focus ring disappears on the teal fill in dark mode', squad: 'Rider support', kind: 'fix', teams: 1, exists: false },
  snackbar: { text: 'A “snackbar” to confirm “Pass renewed” at the bottom of the screen', squad: 'Onboarding', kind: 'component', teams: 1, exists: true, match: 'Toast' },
  stepper: { text: 'A stepper for the five steps of corporate sign-up', squad: 'Rasta for Business', kind: 'component', teams: 1, exists: false },
  fareTable: { text: 'A data table with a sticky first column, for fare charts, invoices and payouts', squad: 'Rasta for Business', kind: 'component', teams: 3, exists: false },
  tabBadge: { text: 'A count badge on tabs, for unread alerts', squad: 'Rider support', kind: 'variant', teams: 2, exists: false },
  routeSheet: { text: 'A slide-up panel for route filters', squad: 'Bus passes', kind: 'component', teams: 2, exists: true, match: 'Sheet' },
  stopPin: { text: 'Map pins for bus stops and metro stations', squad: 'Metro', kind: 'component', teams: 2, exists: false },
  pongal: { text: 'A Pongal banner with a kolam border, live for one week', squad: 'Growth', kind: 'component', teams: 1, exists: false },
} as const satisfies Record<string, SystemRequest>;
export type RastaRequest = keyof typeof REQUESTS;
export const RASTA_REQUESTS: Record<RastaRequest, SystemRequest> = REQUESTS;

// ── Versioning & deprecation (ds.4-2, `release-plan`) ───────────────────────────────────────────────────────────────

/** Semantic versioning (`release-plan` lanes). `patch`: fixes that make it do what the docs already promise. `minor`:
 *  something new, or a deprecation warning, and nothing existing changes. `major`: anything a consumer has to act on,
 *  or that changes what they ship without them opting in. */
export const VERSION_BUMPS = ['patch', 'minor', 'major'] as const;
export type VersionBump = (typeof VERSION_BUMPS)[number];

/** A change queued for Rasta's next release. `breaks`: existing code stops building, or screens change without the
 *  squad asking for it. `adds`: a new component, prop or slot, or a deprecation warning, with old code untouched. */
export interface SystemChange { text: string; breaks: boolean; adds: boolean }

export const bumpFor = (c: SystemChange): VersionBump => (c.breaks ? 'major' : c.adds ? 'minor' : 'patch');

/** A version, MAJOR.MINOR.PATCH, bumped. A bump resets everything to its right. */
export function bumpVersion(v: string, b: VersionBump): string {
  const [ma, mi, pa] = v.split('.').map(Number);
  return b === 'major' ? `${ma + 1}.0.0` : b === 'minor' ? `${ma}.${mi + 1}.0` : `${ma}.${mi}.${pa + 1}`;
}

/** Rasta's plan: ship everything non-breaking now, and batch breaking changes into a planned major with a migration
 *  guide. `now` is the version the non-breaking changes go out as (null if none); `next` the major (null if none). */
export function planReleases(current: string, bumps: readonly VersionBump[]): { now: string | null; next: string | null } {
  const safe = bumps.filter(b => b !== 'major');
  const now = safe.length ? bumpVersion(current, safe.includes('minor') ? 'minor' : 'patch') : null;
  const next = bumps.includes('major') ? bumpVersion(now ?? current, 'major') : null;
  return { now, next };
}

/** The changelog section each bump goes under, written for the people who consume the system. */
export const CHANGELOG_SECTIONS: Record<VersionBump, string> = { major: 'Breaking: what you need to change', minor: 'Added and deprecated', patch: 'Fixed' };

/** The version Rasta's system is on before this release. */
export const RASTA_VERSION = '3.4.2';
/** A deprecated API keeps working, with a warning, through at least this many minor releases before a major removes it. */
export const DEPRECATION_MINORS = 2;

/** The changes queued for Rasta's next release (`release-plan` cards). */
const CHANGES = {
  renameType: { text: 'Rename Button’s `type` prop to `variant`. `type` keeps working and logs a warning', breaks: false, adds: true },
  removeType: { text: 'Remove the `type` prop, deprecated two minor releases ago, with a codemod', breaks: true, adds: false },
  focusRing: { text: 'Fix the focus ring that disappears on teal buttons in dark mode', breaks: false, adds: false },
  datePicker: { text: 'Add the new DatePicker component', breaks: false, adds: true },
  defaultSize: { text: 'Change Button’s default size from md to sm. No prop names change', breaks: true, adds: false },
  textContrast: { text: 'Darken `color-text-secondary` from 4.2:1 to 4.6:1, so it meets the 4.5:1 the docs promise', breaks: false, adds: false },
  trailingIcon: { text: 'Add an optional `iconTrailing` slot to Input', breaks: false, adds: true },
  react17: { text: 'Drop support for React 17', breaks: true, adds: false },
  tooltipTouch: { text: 'Fix Tooltip opening while you scroll on touch screens, which the docs say it shouldn’t', breaks: false, adds: false },
  chipToTag: { text: 'Mark Chip deprecated in favour of Tag, with a codemod and a docs banner', breaks: false, adds: true },
  iconLabel: { text: 'Make `aria-label` a required prop on IconButton, so builds fail without one', breaks: true, adds: false },
} as const satisfies Record<string, SystemChange>;
export type RastaChange = keyof typeof CHANGES;
export const RASTA_CHANGES: Record<RastaChange, SystemChange> = CHANGES;

// ── Measuring adoption (ds.4-3, `adoption-read`) ────────────────────────────────────────────────────────────────────

/** What a squad's scan says (`adoption-read` lanes). `healthy`: mostly system, current, not fought. `stale`: built
 *  from the system, but stuck on the old major. `detaching`: uses the system and keeps breaking away from it, which
 *  means it's missing something they need. `bypassing`: mostly the squad's own components. */
export const ADOPTION_READS = ['healthy', 'stale', 'detaching', 'bypassing'] as const;
export type AdoptionRead = (typeof ADOPTION_READS)[number];

/** A squad's component instances, from the code scanner and Figma library analytics. `current`: system components
 *  on the current major. `old`: system components on the previous major. `detached`: started from the system, now
 *  detached or overridden, so they no longer get fixes. `local`: the squad's own components doing a system job. */
export interface SquadScan { squad: string; text: string; current: number; old: number; detached: number; local: number }
export const SCAN_KINDS = ['current', 'old', 'detached', 'local'] as const;
export type ScanKind = (typeof SCAN_KINDS)[number];

export const scanTotal = (s: SquadScan) => s.current + s.old + s.detached + s.local;
/** The share of a squad's instances that are live system components, on any version. Detached ones don't count: they
 *  look like the system but no longer get its fixes. */
export const systemShare = (s: SquadScan) => (s.current + s.old) / scanTotal(s);

/** Thresholds for the diagnosis, checked in this order. */
export const ADOPTION_LIMITS = { local: 0.35, detached: 0.2, old: 0.4 } as const;

/** Read a scan. Mostly local: bypassing. Of what came from the system, a fifth or more detached: detaching. Of the live
 *  system instances, two-fifths or more on the old major: stale. Otherwise healthy. */
export function adoptionRead(s: SquadScan): AdoptionRead {
  if (s.local / scanTotal(s) >= ADOPTION_LIMITS.local) return 'bypassing';
  if (s.detached / (s.current + s.old + s.detached) >= ADOPTION_LIMITS.detached) return 'detaching';
  if (s.old / (s.current + s.old) >= ADOPTION_LIMITS.old) return 'stale';
  return 'healthy';
}

/** How close an estimate of a share (in %) is. */
export const shareGrade = (guess: number, truth: number): 'spot' | 'close' | 'off' => {
  const d = Math.abs(guess - truth);
  return d <= 5 ? 'spot' : d <= 12 ? 'close' : 'off';
};

/** A scan as 100 cells for a waffle chart, each a kind, by largest remainder so they always total 100, then dealt in
 *  a fixed scattered order so the eye has to estimate rather than count a block. */
export function waffle(s: SquadScan): ScanKind[] {
  const total = scanTotal(s);
  const raw = SCAN_KINDS.map(k => (s[k] / total) * 100);
  const n = raw.map(Math.floor);
  const order = raw.map((r, i) => [r - Math.floor(r), i] as const).sort((a, b) => b[0] - a[0] || a[1] - b[1]);
  for (let j = 0; j < 100 - n.reduce((a, b) => a + b, 0); j++) n[order[j][1]]++;
  const cells = SCAN_KINDS.flatMap((k, i) => Array<ScanKind>(n[i]).fill(k));
  // 37 is coprime with 100, so this visits every cell once.
  return Array.from({ length: 100 }, (_, i) => cells[(i * 37) % 100]);
}

/** The system share across several squads, weighted by their instances. */
export const overallShare = (scans: readonly SquadScan[]) => scans.reduce((a, s) => a + s.current + s.old, 0) / scans.reduce((a, s) => a + scanTotal(s), 0);
/** The share across several squads that is on the current major. */
export const currentShare = (scans: readonly SquadScan[]) => scans.reduce((a, s) => a + s.current, 0) / scans.reduce((a, s) => a + scanTotal(s), 0);

/** The number leadership was shown: repositories that install @rasta/ui. */
export const RASTA_REPOS = { total: 12, installed: 11 } as const;

/** Each squad's scan (`adoption-read` cards). */
const SCANS = {
  bus: { squad: 'Bus passes', text: 'Bus passes: the oldest squad, rebuilt on v3 last year', current: 820, old: 40, detached: 60, local: 80 },
  payments: { squad: 'Payments', text: 'Payments: UPI, cards and wallet top-ups', current: 150, old: 560, detached: 30, local: 60 },
  business: { squad: 'Rasta for Business', text: 'Rasta for Business: the corporate admin portal', current: 300, old: 50, detached: 210, local: 140 },
  metro: { squad: 'Metro', text: 'Metro: QR tickets and the gate flow', current: 180, old: 20, detached: 30, local: 370 },
  support: { squad: 'Rider support', text: 'Rider support: help centre, chat and refunds', current: 380, old: 10, detached: 20, local: 40 },
  rail: { squad: 'Suburban rail', text: 'Suburban rail: the newest squad, launched in six weeks', current: 90, old: 0, detached: 10, local: 300 },
  onboarding: { squad: 'Onboarding', text: 'Onboarding: sign-up, KYC and the first pass', current: 260, old: 30, detached: 120, local: 40 },
  growth: { squad: 'Growth', text: 'Growth: referrals, offers and festival campaigns', current: 60, old: 250, detached: 20, local: 70 },
  fleet: { squad: 'Fleet console', text: 'Fleet console: the web tool depot staff use', current: 500, old: 60, detached: 40, local: 100 },
} as const satisfies Record<string, SquadScan>;
export type RastaScan = keyof typeof SCANS;
export const RASTA_SCANS: Record<RastaScan, SquadScan> = SCANS;
