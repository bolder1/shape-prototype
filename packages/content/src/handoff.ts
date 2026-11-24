// Gaadi's handoff kit, for chapter dc.2. Gaadi is an intercity bus-booking app. Sana Kapoor, its product designer,
// hands Ritesh Nair (front-end engineer) the "Change your trip" sheet, which moves a booked Bengaluru → Chennai trip
// to another bus or date; runs a design QA pass on the build; and fixes the Confirm button's contrast with one token
// change that reaches web, Android and iOS. This is the data the dc.2 scenes and games draw, and the rules they score
// against: a spec that answers what only the designer knows, a QA pass that sorts what blocks a release from what
// doesn't, and code that follows tokens instead of copying their values.
import { contrastRatio } from './episode';

// ── The spec (dc.2-1, `spec-write`) ───────────────────────────────────────────────────────────────────────────────

/** What Ritesh needs to know before he builds the sheet, that only Sana can answer. */
export const DEV_QUESTIONS = ['states', 'edge', 'content', 'responsive', 'a11y', 'data'] as const;
export type DevQuestion = (typeof DEV_QUESTIONS)[number];
export const DEV_QUESTION_TEXT: Record<DevQuestion, string> = {
  states: 'What shows while the new fare loads, or if the check fails?',
  edge: 'What if the bus is sold out, or it’s too late to change?',
  content: 'What happens to a very long operator name?',
  responsive: 'What happens on a small phone, or with large text?',
  a11y: 'What does a screen reader say, and where does focus go?',
  data: 'Where does the fare difference come from, and does it include GST?',
};
/** Where a line of handoff belongs (`spec-write` lanes). `note`: only the designer can say it, so it's written in the
 *  spec. `tool`: Dev Mode already shows it exactly, with the token name; retyping it only creates a copy that drifts.
 *  `cut`: not the spec's job. */
export const SPEC_SOURCES = ['note', 'tool', 'cut'] as const;
export type SpecSource = (typeof SPEC_SOURCES)[number];
/** One line Sana could put in the handoff. `answers`: the question it settles. `inspect`: what Dev Mode shows instead. */
export interface SpecItem { text: string; source: SpecSource; answers?: DevQuestion; inspect?: string }
/** What a handoff can get wrong, in the order the checks run. */
export const SPEC_FLAWS = ['unanswered', 'redline', 'noise'] as const;
export type SpecFlaw = (typeof SPEC_FLAWS)[number];

/** The questions a spec settles. */
export const specAnswered = (items: readonly SpecItem[]) => DEV_QUESTIONS.filter(q => items.some(i => i.source === 'note' && i.answers === q));
/** Every flaw in a spec: a question left for Ritesh to guess, values retyped by hand that Dev Mode already shows, and
 *  material that isn't the spec's job. */
export const specFlaws = (items: readonly SpecItem[]): SpecFlaw[] => [
  ...(specAnswered(items).length < DEV_QUESTIONS.length ? ['unanswered' as const] : []),
  ...(items.some(i => i.source === 'tool') ? ['redline' as const] : []),
  ...(items.some(i => i.source === 'cut') ? ['noise' as const] : []),
];

/** Everything Sana could put in the handoff for the sheet (`spec-write` cards). */
const SPEC = {
  states: { text: 'While the new fare loads, the fare row shows a skeleton and Confirm stays disabled. If the check fails: an inline error with Retry, and the old booking is untouched.', source: 'note', answers: 'states' },
  edge: { text: 'Sold-out buses show “Sold out” and can’t be picked. Within 6 hours of departure the sheet says “Changes close 6 hours before you leave” and offers Cancel instead.', source: 'note', answers: 'edge' },
  content: { text: 'Operator names wrap to two lines, then end in “…”. Boarding points never truncate: “Majestic Bus Stand, Platform 4” is what people look for.', source: 'note', answers: 'content' },
  responsive: { text: 'At 320 px wide or 200% text, the fare breakdown stacks under the bus list and the sheet scrolls. Confirm stays pinned at the bottom.', source: 'note', answers: 'responsive' },
  a11y: { text: 'The sheet is a dialog titled “Change your trip”. Focus starts on the date and returns to “Change trip” on close. A bus reads “Volvo AC sleeper, 9:30 p.m., 3 seats left, ₹180 more”.', source: 'note', answers: 'a11y' },
  data: { text: 'The difference comes from the fare-quote API with GST included: “₹180 more” or “₹120 back to your UPI”. The ₹50 change fee is a line of its own.', source: 'note', answers: 'data' },
  padding: { text: 'Padding 24 px inside the sheet, 16 px between bus rows.', source: 'tool', inspect: 'padding: var(--space-6) · gap: var(--space-4)' },
  hex: { text: 'The Confirm button is #15803D.', source: 'tool', inspect: 'background: var(--color-action-primary)' },
  font: { text: 'Bus times are Inter Semibold, 16 on 24.', source: 'tool', inspect: 'font: var(--text-md-semibold)' },
  history: { text: 'All 14 earlier versions of the sheet, so Ritesh can see how it evolved.', source: 'cut' },
  deck: { text: 'The 30-slide research readout on why people change trips.', source: 'cut' },
  vibe: { text: '“Make it feel smooth and premium.”', source: 'cut' },
} as const satisfies Record<string, SpecItem>;
export type GaadiSpecItem = keyof typeof SPEC;
export const GAADI_SPEC: Record<GaadiSpecItem, SpecItem> = SPEC;
/** Sana's first handoff: a frame redlined by hand and a link to the deck (the dc.2-1 scene). */
export const SANA_FIRST_SPEC: readonly GaadiSpecItem[] = ['padding', 'hex', 'font', 'history', 'deck'];
/** Slack questions from Ritesh during the build, before and after the rebuilt spec (the dc.2-1 scene). */
export const BUILD_QUESTIONS = { before: 23, after: 2 } as const;

// ── Design QA (dc.2-2, `qa-pass`) ─────────────────────────────────────────────────────────────────────────────────

/** What to do with a QA finding (`qa-pass` lanes), worst first. */
export const QA_LANES = ['blocker', 'fix', 'pass'] as const;
export type QaLane = (typeof QA_LANES)[number];
/** Visual offsets this small are rendering noise, not mistakes. */
export const QA_TOLERANCE_PX = 2;
/** One difference between the design and the build. `breaks`: a task fails or the money is wrong. `a11y`: it fails
 *  WCAG or assistive tech. `drift`: it works, but doesn't match the spec or the system. `px`: how far a thing moved. */
export interface QaIssue { where: string; expected: string; actual: string; breaks?: boolean; a11y?: boolean; drift?: boolean; px?: number }
/** Blocks release when it breaks a task or access; fixed this sprint when it drifts from the spec or the system, or
 *  moves past the tolerance; let go otherwise. */
export const qaLane = (i: QaIssue): QaLane =>
  i.breaks || i.a11y ? 'blocker' : i.drift || (i.px ?? 0) > QA_TOLERANCE_PX ? 'fix' : 'pass';
/** Ship only with no blockers open. */
export const qaVerdict = (issues: readonly QaIssue[]) => (issues.some(i => qaLane(i) === 'blocker') ? 'hold' : 'ship');
/** The phone and settings Sana tests on: a cheap Android with large text, not her own iPhone. */
export const QA_DEVICE = 'Redmi 12, Android 14, text 130%';
/** A ticket an engineer can act on without asking: where, expected, actual, and the device. */
export const qaTicket = (i: QaIssue) => `${i.where}. Expected: ${i.expected}. Actual: ${i.actual}. On ${QA_DEVICE}.`;
/** The grey the build used for "3 seats left", and the token it should have used. */
export const SEATS_GREY = '#9CA3AF';
export const TEXT_TERTIARY = '#4B5563';

/** What Sana found on the test build (`qa-pass` cards). */
export const GAADI_QA = {
  double: { where: 'Confirm', expected: 'one change, one ₹50 fee', actual: 'a double tap books two changes and charges ₹100', breaks: true },
  focus: { where: 'The sheet, with TalkBack on', expected: 'focus moves into the sheet', actual: 'focus stays on the page behind; the bus list can’t be reached', a11y: true },
  seats: { where: '“3 seats left”', expected: 'color-text-tertiary, 7.6:1', actual: `${SEATS_GREY} on white, ${contrastRatio(SEATS_GREY, '#FFFFFF').toFixed(1)}:1`, a11y: true },
  gst: { where: 'Fare difference', expected: '“₹180 more”, GST included, matching the payment page', actual: 'the sheet says ₹180; the payment page charges ₹212', breaks: true },
  hex: { where: 'Confirm button', expected: 'var(--color-action-primary)', actual: 'a hard-coded #16A34A', drift: true },
  gap: { where: 'Bus rows', expected: '16 px apart (space-4)', actual: '12 px apart', drift: true, px: 4 },
  wrap: { where: '“Sharma Travels Premium Sleeper”', expected: 'two lines, then “…”', actual: 'cut after one line', drift: true },
  weight: { where: 'Bus times', expected: 'Inter Semibold as in Figma', actual: 'Android renders the same weight a touch heavier' },
  handle: { where: 'The drag handle', expected: '8 px from the top', actual: '9 px from the top', px: 1 },
  shadow: { where: 'Sheet shadow', expected: 'the Figma blur', actual: 'a slightly softer Android elevation shadow' },
} as const satisfies Record<string, QaIssue>;
export type GaadiQa = keyof typeof GAADI_QA;

// ── Tokens in code (dc.2-3, `token-trace`) ────────────────────────────────────────────────────────────────────────

/** Gaadi's greens. */
export const GAADI_GREENS = { 'green.600': '#16A34A', 'green.700': '#15803D' } as const;
export type GaadiGreen = keyof typeof GAADI_GREENS;
/** The fix: white on green-600 fails 4.5:1, so the semantic token is repointed to green-700. One line in tokens.json. */
export const TOKEN_CHANGE = { token: 'color.action.primary', from: 'green.600', to: 'green.700' } as const satisfies { token: string; from: GaadiGreen; to: GaadiGreen };
export const TOKEN_PLATFORMS = ['web', 'android', 'ios'] as const;
export type TokenPlatform = (typeof TOKEN_PLATFORMS)[number];
/** What Style Dictionary names a token on each platform: kebab-case CSS variables, camelCase on Android and iOS. */
export const platformName = (path: string, platform: TokenPlatform) => {
  const parts = path.split('.');
  const camel = parts.map((s, i) => (i === 0 ? s : s[0].toUpperCase() + s.slice(1))).join('');
  const role = camel.replace(/^color/, '');
  return platform === 'web' ? `var(--${parts.join('-')})`
    : platform === 'android' ? `GaadiTheme.colors.${role[0].toLowerCase()}${role.slice(1)}`
      : `Color.${role[0].toLowerCase()}${role.slice(1)}`;
};
/** How a line of code gets its colour (`token-trace` lanes). `follows`: a semantic or component token, so the change
 *  reaches it. `primitive`: the palette directly, so it skips the role and misses the change. `literal`: the value
 *  itself, copied in, so nothing reaches it. */
export const REF_KINDS = ['follows', 'primitive', 'literal'] as const;
export type RefKind = (typeof REF_KINDS)[number];
const LITERAL = /#[0-9a-f]{6}\b|0x[0-9a-f]{8}|red:\s*[\d.]+/i;
const PRIMITIVE = /--green-\d|Palette\.Green\d|Color\.green\d/;
/** Reads a line of code the way a token lint does. */
export const refKind = (code: string): RefKind => (LITERAL.test(code) ? 'literal' : PRIMITIVE.test(code) ? 'primitive' : 'follows');
/** The green a line renders once the token build has run, before or after the change. */
export const renderedGreen = (code: string, after: boolean): GaadiGreen =>
  refKind(code) === 'follows' && after ? TOKEN_CHANGE.to : TOKEN_CHANGE.from;
/** White text on a green, as a WCAG ratio. */
export const onGreen = (g: GaadiGreen) => contrastRatio('#FFFFFF', GAADI_GREENS[g]);

/** Lines across Gaadi's three codebases that paint something green (`token-trace` cards). */
export const GAADI_CODE = {
  webBtn: { platform: 'web', where: 'Confirm button', code: 'background: var(--color-action-primary);' },
  webComp: { platform: 'web', where: 'Book button', code: 'background: var(--button-primary-bg);' },
  android: { platform: 'android', where: 'Confirm button', code: 'containerColor = GaadiTheme.colors.actionPrimary' },
  ios: { platform: 'ios', where: 'Confirm button', code: '.background(Color.actionPrimary)' },
  webHex: { platform: 'web', where: 'Fare banner button', code: 'background: #16A34A;' },
  androidHex: { platform: 'android', where: 'Pay button', code: 'containerColor = Color(0xFF16A34A)' },
  iosRgb: { platform: 'ios', where: 'Pay button', code: 'UIColor(red: 0.09, green: 0.64, blue: 0.29, alpha: 1)' },
  webSeat: { platform: 'web', where: 'Selected seat', code: 'background: var(--green-600);' },
  androidSeat: { platform: 'android', where: 'Selected seat', code: 'color = Palette.Green600' },
  iosSeat: { platform: 'ios', where: 'Selected seat', code: '.fill(Color.green600)' },
} as const satisfies Record<string, { platform: TokenPlatform; where: string; code: string }>;
export type GaadiCode = keyof typeof GAADI_CODE;
/** Lines a token lint should flag: everything that doesn't follow a token. */
export const lintFlags = (keys: readonly GaadiCode[]) => keys.filter(k => refKind(GAADI_CODE[k].code) !== 'follows');
