// Sukoon's visual identity, for chapter br.2. Sukoon is the meditation app from br.1: for busy professionals who can't
// switch off, calm in five minutes; calm, warm and expert. This is the data the br.2 scenes and games draw, and the
// rules they score against: the stress tests a logo must survive, the checks on a typeface or colour for the kit, and
// the guideline rules a piece of work in the wild can break.
import { contrastRatio } from './episode';

// ── Logo stress tests (br.2-1, `logo-stress`) ──────────────────────────────────────────────────────────────────────

/** Marks are drawn on a 96-unit square. */
export const MARK_BOX = 96;
/** The smallest place the mark lives: a browser tab or a notification, 16 px square. */
export const ICON_PX = 16;
/** A line or gap thinner than one pixel at that size blurs into its neighbours. */
export const MIN_LINE_PX = 1;
/** The tests, in the order the game runs them, then the verdict for a mark that survives them all. */
export const MARK_TESTS = ['small', 'mono', 'generic'] as const;
export const MARK_VERDICTS = [...MARK_TESTS, 'ready'] as const;
export type MarkTest = (typeof MARK_TESTS)[number];
export type MarkVerdict = (typeof MARK_VERDICTS)[number];
/** A candidate mark. `thin` is its thinnest stroke or gap, in box units; `tones` how many flat colours it needs to
 *  read; `gradient` if it relies on one; `cliche` the stock symbol of the category it repeats, if any. */
export interface Mark { text: string; thin: number; tones: number; gradient?: boolean; cliche?: string }
/** How wide `units` of the box are when the mark is drawn `px` pixels square. */
export const markPx = (units: number, px: number = ICON_PX) => (units * px) / MARK_BOX;
/** Every test a mark fails, in test order. */
export const markFlaws = (m: Mark): MarkTest[] => [
  ...(markPx(m.thin) < MIN_LINE_PX ? ['small' as const] : []),
  ...(m.gradient || m.tones > 1 ? ['mono' as const] : []),
  ...(m.cliche ? ['generic' as const] : []),
];
/** The first test a mark fails, or `ready`. */
export const markVerdict = (m: Mark): MarkVerdict => markFlaws(m)[0] ?? 'ready';
/** Ishita's shortlist after forty thumbnails (`logo-stress` cards). The game draws each from these numbers. */
export const SUKOON_MARKS = {
  mandala: { text: 'A fine-line mandala of twenty-four petals', thin: 2.5, tones: 1 },
  rays: { text: 'A sun with sixteen hairline rays', thin: 4, tones: 1 },
  dusk: { text: 'A sun setting through a peach-to-violet gradient', thin: 24, tones: 1, gradient: true },
  overlap: { text: 'A sage circle and a peach circle that overlap into a third colour', thin: 20, tones: 3 },
  lotus: { text: 'A lotus flower', thin: 8, tones: 1, cliche: 'lotus' },
  enso: { text: 'A brushed Zen circle, an ensō', thin: 10, tones: 1, cliche: 'ensō' },
  breath: { text: 'A half-sun rising over a line: one slow breath out', thin: 12, tones: 1 },
  pause: { text: 'Two rounded strokes that curve into an S, like a pause', thin: 14, tones: 1 },
} as const satisfies Record<string, Mark>;
export type SukoonMark = keyof typeof SUKOON_MARKS;

// ── The kit: type and colour (br.2-2, `kit-pick`) ─────────────────────────────────────────────────────────────────

export const SUKOON_TRAITS = ['calm', 'warm', 'expert'] as const;
export type SukoonTrait = (typeof SUKOON_TRAITS)[number];
/** The four jobs in the kit (`kit-pick` lanes): heading face, text face, the main button, the session background. */
export const KIT_SLOTS = ['display', 'text', 'action', 'session'] as const;
export type KitSlot = (typeof KIT_SLOTS)[number];
/** Why an option is wrong for its job, in the order the game checks. */
export const KIT_FLAWS = ['script', 'contrast', 'rival', 'trait'] as const;
export type KitFlaw = (typeof KIT_FLAWS)[number];
/** Sukoon ships in English and Hindi, so both faces need Latin and Devanagari. */
export const KIT_SCRIPTS = ['latn', 'deva'] as const;
/** Text on the button and on session screens is body size, so it needs WCAG AA's 4.5:1. */
export const KIT_MIN_CONTRAST = 4.5;
/** Sukoon's ink, used for text on light backgrounds. */
export const SUKOON_INK = '#1F2A2E';
/** The hues the category's two biggest apps already own: a calm blue and a bright orange. */
export const RIVAL_HUES = { blue: 215, orange: 24 } as const;

export type KitOption =
  | { kind: 'type'; slot: 'display' | 'text'; name: string; text: string; scripts: readonly ('latn' | 'deva')[]; fights?: SukoonTrait }
  | { kind: 'colour'; slot: 'action' | 'session'; name: string; text: string; hex: string; on: string; fights?: SukoonTrait };

/** #rrggbb → [hue 0–360, saturation 0–100, lightness 0–100]. */
export const hexHsl = (hex: string): [number, number, number] => {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min, l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  const h = d === 0 ? 0 : max === r ? (60 * ((g - b) / d) + 360) % 360 : max === g ? 60 * ((b - r) / d) + 120 : 60 * ((r - g) / d) + 240;
  return [h, s * 100, l * 100];
};
/** Degrees between two hues, the short way round. */
export const hueGap = (a: number, b: number) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
/** A strong mid-tone within 20° of a rival's hue reads as theirs. Pale tints and deep shades don't. */
export const rivalOf = (hex: string): keyof typeof RIVAL_HUES | null => {
  const [h, s, l] = hexHsl(hex);
  if (s < 50 || l < 25 || l > 70) return null;
  return (Object.keys(RIVAL_HUES) as (keyof typeof RIVAL_HUES)[]).find(k => hueGap(h, RIVAL_HUES[k]) <= 20) ?? null;
};
/** What's wrong with an option for its job, or null when it fits. Type: does it set Hindi, does it fight a trait?
 *  Colour: can its text be read, does it look like a rival, does it fight a trait? */
export const kitFlaw = (o: KitOption): KitFlaw | null => {
  if (o.kind === 'type') return !KIT_SCRIPTS.every(s => o.scripts.includes(s)) ? 'script' : o.fights ? 'trait' : null;
  if (contrastRatio(o.hex, o.on) < KIT_MIN_CONTRAST) return 'contrast';
  if (rivalOf(o.hex)) return 'rival';
  return o.fights ? 'trait' : null;
};
/** The options Ishita weighs for each job (`kit-pick` cards, three a slot, exactly one that fits). */
export const SUKOON_KIT = {
  tiro: { kind: 'type', slot: 'display', name: 'Tiro Devanagari Hindi', text: 'A calm book serif, drawn with matching Latin and Devanagari', scripts: ['latn', 'deva'] },
  playfair: { kind: 'type', slot: 'display', name: 'Playfair Display', text: 'A glamorous high-contrast serif with Latin, Cyrillic and Vietnamese, but no Devanagari', scripts: ['latn'] },
  baloo: { kind: 'type', slot: 'display', name: 'Baloo 2', text: 'A round, bubbly display face with Latin and Devanagari', scripts: ['latn', 'deva'], fights: 'expert' },
  mukta: { kind: 'type', slot: 'text', name: 'Mukta', text: 'A clear humanist sans with Latin and Devanagari, made for screens', scripts: ['latn', 'deva'] },
  inter: { kind: 'type', slot: 'text', name: 'Inter', text: 'A crisp interface sans with Latin, Greek and Cyrillic, but no Devanagari', scripts: ['latn'] },
  yatra: { kind: 'type', slot: 'text', name: 'Yatra One', text: 'A heavy brush-lettered poster face with Latin and Devanagari', scripts: ['latn', 'deva'], fights: 'calm' },
  sage: { kind: 'colour', slot: 'action', name: 'Deep sage', text: 'Deep sage, with a white label', hex: '#2F5D50', on: '#FFFFFF' },
  peach: { kind: 'colour', slot: 'action', name: 'Moodboard peach', text: 'The moodboard’s peach, with a white label', hex: '#F2A98A', on: '#FFFFFF' },
  cobalt: { kind: 'colour', slot: 'action', name: 'Cobalt', text: 'A confident cobalt blue, with a white label', hex: '#1F5FD1', on: '#FFFFFF' },
  sand: { kind: 'colour', slot: 'session', name: 'Sand', text: 'Warm sand, with ink text', hex: '#F3E9DC', on: SUKOON_INK },
  rani: { kind: 'colour', slot: 'session', name: 'Rani pink', text: 'A bright rani pink, with ink text', hex: '#FF4FA3', on: SUKOON_INK, fights: 'calm' },
  slate: { kind: 'colour', slot: 'session', name: 'Night slate', text: 'A night-sky slate, with ink text', hex: '#3E4C55', on: SUKOON_INK },
} as const satisfies Record<string, KitOption>;
export type SukoonKitKey = keyof typeof SUKOON_KIT;

// ── The guidelines (br.2-3, `guide-build`) ─────────────────────────────────────────────────────────────────────────

/** The sections of Sukoon's brand guide (`guide-build` lanes). */
export const GUIDE_SECTIONS = ['logo', 'colour', 'type', 'imagery'] as const;
export type GuideSection = (typeof GUIDE_SECTIONS)[number];
/** Sukoon's identity as the guide fixes it. Clear space is measured in suns: the height of the half-sun in the mark. */
export const SUKOON_GUIDE = {
  clearSuns: 1,
  minLockupPx: 24,
  palette: { sage: '#2F5D50', sand: '#F3E9DC', peach: '#F2A98A', ink: SUKOON_INK, white: '#FFFFFF' },
  faces: { display: { name: 'Tiro Devanagari Hindi', minPx: 24 }, text: { name: 'Mukta', minPx: 14 } },
} as const;
export const GUIDE_RULES = {
  stretch: { section: 'logo', rule: 'Scale the logo only in proportion. Never stretch or squash it to fit a space.' },
  clear: { section: 'logo', rule: 'Leave clear space the height of the sun on every side of the logo.' },
  size: { section: 'logo', rule: 'The full logo is never under 24 px tall on screen. Smaller than that, use the mark alone.' },
  palette: { section: 'colour', rule: 'Use only the five palette colours. A festival changes the photos and the words, not the palette.' },
  pair: { section: 'colour', rule: 'Put text only on the pairs in the chart: white on sage, ink on sand, ink on peach. White on peach fails.' },
  face: { section: 'type', rule: 'Headlines in Tiro Devanagari Hindi, everything else in Mukta. No other typefaces.' },
  faceSize: { section: 'type', rule: 'Tiro is for 24 px and up. Captions, labels and body text are Mukta, at 14 px or more.' },
  photo: { section: 'imagery', rule: 'Real people in real Indian homes and commutes, in natural light. No stock poses, no filters.' },
} as const satisfies Record<string, { section: GuideSection; rule: string }>;
export type GuideRule = keyof typeof GUIDE_RULES;
/** One piece of work made with the identity. Each field is optional; only what the piece shows is checked. `stretch`
 *  is width ÷ height relative to the real logo; `clearSuns` the space round the logo; `lockupPx` its height on screen;
 *  `colours` every text/background pair as "fg|bg"; `type` the face and size of its smallest text in that face. */
export interface BrandUse {
  text: string;
  stretch?: number; clearSuns?: number; lockupPx?: number;
  colours?: readonly string[];
  type?: readonly { face: 'display' | 'text' | 'other'; px: number }[];
  photo?: 'real' | 'stock' | 'filtered';
}
const inPalette = (hex: string) => (Object.values(SUKOON_GUIDE.palette) as string[]).includes(hex.toUpperCase());
/** Every guideline rule a piece breaks, in rule order. */
export const rulesBroken = (u: BrandUse): GuideRule[] => {
  const pairs = (u.colours ?? []).map(c => c.split('|'));
  const broken: GuideRule[] = [];
  if (u.stretch !== undefined && Math.abs(u.stretch - 1) > 0.02) broken.push('stretch');
  if (u.clearSuns !== undefined && u.clearSuns < SUKOON_GUIDE.clearSuns) broken.push('clear');
  if (u.lockupPx !== undefined && u.lockupPx < SUKOON_GUIDE.minLockupPx) broken.push('size');
  if (pairs.some(p => p.some(h => !inPalette(h)))) broken.push('palette');
  else if (pairs.some(([fg, bg]) => contrastRatio(fg, bg) < KIT_MIN_CONTRAST)) broken.push('pair');
  if (u.type?.some(t => t.face === 'other')) broken.push('face');
  else if (u.type?.some(t => t.px < SUKOON_GUIDE.faces[t.face as 'display' | 'text'].minPx)) broken.push('faceSize');
  if (u.photo && u.photo !== 'real') broken.push('photo');
  return broken;
};
/** The section of the guide whose rule a piece breaks first, or null when it follows them all. */
export const sectionBroken = (u: BrandUse): GuideSection | null => { const r = rulesBroken(u)[0]; return r ? GUIDE_RULES[r].section : null; };
const P = SUKOON_GUIDE.palette;
/** Sukoon's identity six months in, made by partners, agencies and the team's own marketing (`guide-build` cards). */
export const SUKOON_USES = {
  gym: { text: 'A partner gym’s poster, the logo stretched wide to fill the banner', stretch: 1.4, clearSuns: 1.5, lockupPx: 120, colours: [`${P.ink}|${P.sand}`], type: [{ face: 'display', px: 48 }], photo: 'real' },
  whatsapp: { text: 'A WhatsApp banner with the logo jammed into the corner against the headline', stretch: 1, clearSuns: 0.2, lockupPx: 40, colours: [`${P.white}|${P.sage}`], type: [{ face: 'display', px: 32 }] },
  partnerList: { text: 'An office-wellness app’s partner list, with the full logo 12 px tall', stretch: 1, clearSuns: 1, lockupPx: 12, colours: [`${P.ink}|${P.white}`] },
  diwali: { text: 'A Diwali offer in gold on sage', stretch: 1, clearSuns: 1.2, lockupPx: 48, colours: ['#C9A227|#2F5D50'], type: [{ face: 'display', px: 40 }], photo: 'real' },
  peachButton: { text: 'A landing page whose main button is white text on peach', colours: [`${P.white}|${P.peach}`, `${P.ink}|${P.sand}`], type: [{ face: 'text', px: 16 }] },
  comic: { text: 'An Instagram quote card with the headline in a comic marker font', stretch: 1, clearSuns: 1.5, lockupPx: 32, colours: [`${P.ink}|${P.sand}`], type: [{ face: 'other', px: 36 }] },
  tinyTiro: { text: 'An onboarding screen with 12 px captions set in Tiro', colours: [`${P.ink}|${P.sand}`], type: [{ face: 'display', px: 28 }, { face: 'display', px: 12 }] },
  beach: { text: 'An app-store screenshot with a stock photo of a woman meditating on a beach', colours: [`${P.ink}|${P.sand}`], type: [{ face: 'display', px: 32 }], photo: 'stock' },
  neon: { text: 'A YouTube thumbnail with a real commuter photo under a purple neon filter', stretch: 1, clearSuns: 1, lockupPx: 36, colours: [`${P.white}|${P.sage}`], type: [{ face: 'display', px: 40 }], photo: 'filtered' },
} as const satisfies Record<string, BrandUse>;
export type SukoonUse = keyof typeof SUKOON_USES;
