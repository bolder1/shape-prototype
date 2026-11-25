// Bunkar's polish pass, for chapter ui.5. Bunkar sells handloom saris and dupattas straight from weavers' co-operatives
// in Varanasi, Pochampally and Chanderi. Its app works and tests well, and the Diwali edit launches in a week. Kavya
// Menon, its principal designer, runs the polish pass: optical corrections where the maths looks wrong, one light
// source and a small set of elevations, and a detail pass at 400% with every change written down. This is the data the
// ui.5 scenes and games draw, and the rules they score against.

// ── Optical vs. mathematical alignment (ui.5-1, `optical-nudge`) ────────────────────────────────────────────────────

/** What a shape needs once it's placed by its box (`optical-nudge` lanes). `nudge`: move it toward its visual mass,
 *  because its mass isn't at its box centre. `overshoot`: let a round or pointed edge run past the line flat shapes
 *  stop at. `hang`: let ink-light edges (punctuation, bullets, an icon's built-in padding) sit outside the column so
 *  the ink lines up. `exact`: the maths is right; leave it. */
export const OPTICAL_FIXES = ['nudge', 'overshoot', 'hang', 'exact'] as const;
export type OpticalFix = (typeof OPTICAL_FIXES)[number];

/** A shape placed by its bounding box. `against`: what it's aligned to (`centre` of a container, a `line` that other
 *  shapes stand on or reach, or the `edge` of a column or margin). `mass`: whether its visual weight sits at its box
 *  centre. `edge`: what meets the line or edge: `flat`, `round`, `pointed`, or `light` (punctuation, a bullet, padding
 *  inside an icon's box: little or no ink at the edge). `data`: it repeats down a column people read across or compare. */
export interface OpticalCase { text: string; against: 'centre' | 'line' | 'edge'; mass: 'centred' | 'offset'; edge: 'flat' | 'round' | 'pointed' | 'light'; data?: boolean }

/** Data people compare stays exact. Centred things move to their mass. On a line, round and pointed edges overshoot.
 *  At an edge, light edges hang. Everything else, the maths already looks right. */
export const opticalFix = (c: OpticalCase): OpticalFix =>
  c.data ? 'exact'
    : c.against === 'centre' ? (c.mass === 'offset' ? 'nudge' : 'exact')
      : c.against === 'line' ? (c.edge === 'round' || c.edge === 'pointed' ? 'overshoot' : 'exact')
        : c.edge === 'light' ? 'hang' : 'exact';

/** How far a triangle pointing right, `w` wide, sits from true centre when it's centred by its box: its centroid is a
 *  third of the way from its flat side, its box centre halfway. Designers move it most of the way, then judge by eye. */
export const centroidShift = (w: number) => w / 6;
/** The circle with the same area as a `side` × `side` square. Equal area reads as equal size; equal width doesn't. */
export const equalAreaDiameter = (side: number) => side * 2 / Math.sqrt(Math.PI);

/** The things Kavya finds placed by their boxes (`optical-nudge` cards). */
const CASES = {
  play: { text: 'The ▶ on the sari video, centred in its round button by its box', against: 'centre', mass: 'offset', edge: 'pointed' },
  caps: { text: '“ADD TO BAG” in capitals, centred in the button by its line box', against: 'centre', mass: 'offset', edge: 'flat' },
  swatch: { text: 'A round colour dot centred in a round swatch chip', against: 'centre', mass: 'centred', edge: 'round' },
  avatar: { text: 'A weaver’s round photo in a row of square sari thumbnails, all 48 px', against: 'line', mass: 'centred', edge: 'round' },
  star: { text: 'A star “Bestseller” badge beside square badges, all 24 px tall', against: 'line', mass: 'centred', edge: 'pointed' },
  wordmark: { text: 'The “Utsav” festive lettering, its round U and S drawn exactly to the T’s height', against: 'line', mass: 'centred', edge: 'round' },
  quote: { text: 'The opening “ of a weaver’s quote, flush with the paragraph’s left edge', against: 'edge', mass: 'offset', edge: 'light' },
  bullets: { text: 'The bullets of the care instructions, flush with the heading’s left edge', against: 'edge', mass: 'offset', edge: 'light' },
  back: { text: 'The back arrow’s 24 px box on the 16 px margin; its drawn arrow starts 4 px inside the box', against: 'edge', mass: 'centred', edge: 'light' },
  prices: { text: 'Prices in the order summary, right-aligned with tabular figures', against: 'edge', mass: 'centred', edge: 'flat', data: true },
} as const satisfies Record<string, OpticalCase>;
export type BunkarCase = keyof typeof CASES;
export const BUNKAR_CASES: Record<BunkarCase, OpticalCase> = CASES;

// ── Depth, elevation & light (ui.5-2, `elevation-lift`) ─────────────────────────────────────────────────────────────

/** The heights a surface can sit at, lowest first (`elevation-lift` lanes). `flat`: part of the page, separated by
 *  fill, space or a hairline. `low`: a separate object resting on the page. `raised`: on top of other content.
 *  `overlay`: above everything, with a scrim, and the page behind it can't be used. */
export const ELEVATIONS = ['flat', 'low', 'raised', 'overlay'] as const;
export type Elevation = (typeof ELEVATIONS)[number];

/** A surface on a screen. `blocks`: you can't use the page until it's dismissed. `floats`: it sits over other content,
 *  at least some of the time (on scroll, while open, while dragged). `unit`: a separate object you tap or move whole. */
export interface Surface { text: string; blocks: boolean; floats: boolean; unit: boolean }

/** Height follows what the surface does: blocking is an overlay, floating over content is raised, a separate object
 *  rests low, and the rest is the page. */
export const elevationOf = (s: Surface): Elevation =>
  s.blocks ? 'overlay' : s.floats ? 'raised' : s.unit ? 'low' : 'flat';

/** One shadow layer, light from above: `y` offset down, `blur`, and black at `alpha`. There is never an x offset. */
export interface ShadowLayer { y: number; blur: number; alpha: number }
/** Bunkar's shadow tokens: a tight key shadow for the contact edge and a soft ambient one, both growing with height. */
export const SHADOWS: Record<Elevation, readonly ShadowLayer[]> = {
  flat: [],
  low: [{ y: 1, blur: 2, alpha: 0.12 }, { y: 2, blur: 6, alpha: 0.06 }],
  raised: [{ y: 2, blur: 4, alpha: 0.12 }, { y: 8, blur: 20, alpha: 0.1 }],
  overlay: [{ y: 4, blur: 8, alpha: 0.14 }, { y: 20, blur: 44, alpha: 0.18 }],
};
/** A `box-shadow` value for a height. */
export const shadowCss = (e: Elevation) => SHADOWS[e].map(l => `0 ${l.y}px ${l.blur}px rgb(0 0 0 / ${l.alpha})`).join(', ') || 'none';
/** In dark mode shadows barely show on a dark page, so a surface gets lighter the higher it sits (HSL lightness, %). */
export const DARK_LIGHTNESS: Record<Elevation, number> = { flat: 8, low: 12, raised: 16, overlay: 20 };
/** The dim behind an overlay, black at this alpha. */
export const SCRIM_ALPHA = 0.5;
/** True when every shadow falls the same way: one light source. */
export const oneLight = (shadows: readonly { x: number; y: number }[]) =>
  shadows.every(s => Math.sign(s.x) === Math.sign(shadows[0].x) && Math.sign(s.y) === Math.sign(shadows[0].y));

/** The surfaces on Bunkar's product page and checkout (`elevation-lift` cards). */
const SURFACES = {
  page: { text: 'The page background behind the Diwali edit grid', blocks: false, floats: false, unit: false },
  care: { text: 'The “Care instructions” section on a sari’s page', blocks: false, floats: false, unit: false },
  pincode: { text: 'The pincode field at checkout', blocks: false, floats: false, unit: false },
  card: { text: 'A sari’s card in the Diwali edit grid', blocks: false, floats: false, unit: true },
  weaver: { text: 'The weaver’s story card on a sari’s page, tap to open her profile', blocks: false, floats: false, unit: true },
  bagBar: { text: 'The “Add to bag” bar that stays at the bottom as the page scrolls under it', blocks: false, floats: true, unit: false },
  menu: { text: 'The blouse-piece menu, open over the page', blocks: false, floats: true, unit: false },
  toast: { text: 'The “Added to bag” toast', blocks: false, floats: true, unit: false },
  drag: { text: 'A saved sari being dragged to reorder the wishlist', blocks: false, floats: true, unit: true },
  sheet: { text: 'The delivery sheet that slides up and dims the page', blocks: true, floats: true, unit: false },
  dialog: { text: 'The “Remove from bag?” dialog', blocks: true, floats: true, unit: false },
} as const satisfies Record<string, Surface>;
export type BunkarSurface = keyof typeof SURFACES;
export const BUNKAR_SURFACES: Record<BunkarSurface, Surface> = SURFACES;

// ── Detail pass checklist (ui.5-3, `detail-loupe`) ──────────────────────────────────────────────────────────────────

/** The checklist a detail fails, or `ship` (`detail-loupe` lanes). `type`: quotes, dashes, figures, rags.
 *  `shape`: radii, strokes, the geometry of edges. `state`: focus, long content, empty: states nobody drew. */
export const CRAFT_CHECKS = ['type', 'shape', 'state', 'ship'] as const;
export type CraftCheck = (typeof CRAFT_CHECKS)[number];

/** A detail Kavya inspects at 400%, with what she measured. */
export type Detail =
  | { kind: 'quotes'; sample: string }
  | { kind: 'range'; sample: string }
  | { kind: 'figures'; column: boolean; tabular: boolean }
  | { kind: 'rag'; lastLineWords: number }
  | { kind: 'radius'; outer: number; padding: number; inner: number }
  | { kind: 'stroke'; widths: readonly number[] }
  | { kind: 'focus'; ring: boolean }
  | { kind: 'overflow'; chars: number; fits: number; handled: boolean }
  | { kind: 'empty'; designed: boolean };
export type BunkarDetailItem = Detail & { text: string; where: string };

/** A nested corner looks parallel when the inner radius is the outer radius minus the gap between them. */
export const innerRadius = (outer: number, padding: number) => Math.max(0, outer - padding);
/** A straight ' or " in display text, where curly quotes and apostrophes belong. */
const STRAIGHT = /['"]/;
/** A hyphen between two numbers in a range, where an en dash belongs. */
const HYPHEN_RANGE = /\d\s?-\s?\D?\d/;

/** The fix a detail needs, written as a line for the change list, or null when it ships as it is. */
export function craftFix(d: Detail): string | null {
  switch (d.kind) {
    case 'quotes': return STRAIGHT.test(d.sample) ? 'Straight quotes and apostrophes → curly “ ” and ’' : null;
    case 'range': return HYPHEN_RANGE.test(d.sample) ? 'Hyphen in a range → en dash (–)' : null;
    case 'figures': return d.column && !d.tabular ? 'Proportional figures in a column → tabular figures' : null;
    case 'rag': return d.lastLineWords < 2 ? 'One word alone on the heading’s last line → rebalance the lines' : null;
    case 'radius': { const r = innerRadius(d.outer, d.padding); return d.inner !== r ? `Inner radius ${d.inner} px → ${r} px (outer ${d.outer} minus ${d.padding} padding)` : null; }
    case 'stroke': return new Set(d.widths).size > 1 ? `Mixed icon strokes (${[...new Set(d.widths)].join(' and ')} px) → one stroke width` : null;
    case 'focus': return d.ring ? null : 'No visible focus → a 2 px focus ring with a 2 px gap';
    case 'overflow': return d.chars > d.fits && !d.handled ? `${d.chars} characters in a ${d.fits}-character slot → wrap to two lines, then truncate with the full name on tap` : null;
    case 'empty': return d.designed ? null : 'Blank empty state → say what goes here and offer one way to start';
  }
}
/** Which checklist a detail fails, or `ship`. */
export const craftCheck = (d: Detail): CraftCheck => {
  if (craftFix(d) === null) return 'ship';
  return d.kind === 'radius' || d.kind === 'stroke' ? 'shape' : d.kind === 'focus' || d.kind === 'overflow' || d.kind === 'empty' ? 'state' : 'type';
};
/** The change list for a set of details: one line per fix, in order, skipping what ships. */
export const changeList = (ds: readonly Detail[]) => ds.map(craftFix).filter((f): f is string => f !== null);

/** The details on Bunkar's Diwali screens (`detail-loupe` cards). */
const DETAILS = {
  review: { kind: 'quotes', sample: '"Softest Chanderi I\'ve owned"', where: 'A review on the sari page' },
  price: { kind: 'range', sample: '₹2,400-₹3,100', where: 'The price filter' },
  summary: { kind: 'figures', column: true, tabular: false, where: 'The order summary' },
  heading: { kind: 'rag', lastLineWords: 1, where: 'The Diwali edit banner' },
  photo: { kind: 'radius', outer: 16, padding: 8, inner: 16, where: 'A sari card and the photo inside it' },
  tabs: { kind: 'stroke', widths: [1.5, 1.5, 2, 1.5], where: 'The tab bar icons' },
  focus: { kind: 'focus', ring: false, where: 'The “Add to bag” button, reached by keyboard' },
  coop: { kind: 'overflow', chars: 50, fits: 28, handled: false, where: 'The weaver co-op name on a card' },
  wishlist: { kind: 'empty', designed: false, where: 'The wishlist, before anything is saved' },
  sheet: { kind: 'radius', outer: 20, padding: 12, inner: 8, where: 'The delivery sheet and the map inside it' },
  delivery: { kind: 'range', sample: 'Arrives in 4–6 days', where: 'The delivery promise' },
  dates: { kind: 'figures', column: true, tabular: true, where: 'The dates in “My orders”' },
} as const satisfies Record<string, Detail & { where: string }>;
export type BunkarDetail = keyof typeof DETAILS;
/** What each detail is, in words, for the card. */
const DETAIL_TEXT: Record<BunkarDetail, string> = {
  review: 'A review quoted as "Softest Chanderi I\'ve owned", straight quotes and apostrophe',
  price: 'The price filter reads ₹2,400-₹3,100, with a hyphen',
  summary: 'Order summary prices right-aligned, in the font’s default proportional figures',
  heading: '“Handwoven in Pochampally for your Diwali” wraps with “Diwali” alone on line two',
  photo: 'A card with 16 px corners and 8 px padding; the photo inside also has 16 px corners',
  tabs: 'Tab bar icons: home, search and bag at 1.5 px strokes, the wishlist heart at 2 px',
  focus: 'The “Add to bag” button has outline: none and no other focus style',
  coop: '“Pochampally Handloom Weavers’ Co-operative Society” (50 characters) in a 28-character title, no rule for overflow',
  wishlist: 'The empty wishlist is a blank white screen with a heading',
  sheet: 'A sheet with 20 px corners and 12 px padding; the map inside has 8 px corners',
  delivery: 'The delivery promise reads “Arrives in 4–6 days”, with an en dash',
  dates: 'Order dates right-aligned in a column, in tabular figures',
};
export const BUNKAR_DETAILS = Object.fromEntries(
  Object.entries(DETAILS).map(([k, d]) => [k, { ...d, text: DETAIL_TEXT[k as BunkarDetail] }]),
) as Record<BunkarDetail, BunkarDetailItem>;
