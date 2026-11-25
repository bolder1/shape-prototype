// Design engineering at Chakki, for chapter dc.4. Chakki delivers stone-ground atta, millet flours, dals and spices
// from neighbourhood mills in Ahmedabad, ground the morning you order. Nandini Desai is its design engineer: she
// designs in Figma and ships the React herself. Rohan Mehta is the staff front-end engineer who reviews her code.
// This is the data the dc.4 scenes and games draw, and the rules they score against: where each piece of a
// component's data should live, what an animation in code needs before it is smooth on a ₹9,000 phone, and what to
// do with each change a coding agent hands back.

// ── Component code with React (dc.4-1, `data-home`) ────────────────────────────────────────────────────────────────

/** Where a piece of `ProductCard`'s data lives (`data-home` lanes). `prop`: the parent passes it in and the card only
 *  reads it. `state`: it changes as someone uses this card, and nothing else needs it, so the card owns it with
 *  `useState`. `lift`: it changes, but another component reads it too, so it lives in their nearest common parent and
 *  the card gets the value and a callback to change it. `derive`: it can be worked out from props or state, so it is
 *  computed while rendering and never stored. */
export const DATA_HOMES = ['prop', 'state', 'lift', 'derive'] as const;
export type DataHome = (typeof DATA_HOMES)[number];

/** One piece of data the product card shows or uses. `computable`: it follows from other props or state. `from`:
 *  `parent` if the page or the API decides it, `use` if it changes when someone taps, types or waits. `shared`: another
 *  component reads or changes it as well. `line`: what it becomes in the card's code. `parent`: for lifted state, the
 *  line that goes in the parent instead. */
export interface CardDatum {
  text: string; short: string; line: string; parent?: string;
  from: 'parent' | 'use'; computable?: boolean; shared?: boolean;
}

/** Computed beats stored; the parent's beats the card's; shared state goes up to the common parent. */
export const dataHome = (d: CardDatum): DataHome =>
  d.computable ? 'derive' : d.from === 'parent' ? 'prop' : d.shared ? 'lift' : 'state';

const DATA = {
  product: { short: 'product', from: 'parent', text: 'The product itself: name, photo, pack size, price and MRP, from the catalogue API.', line: 'product: Product;' },
  size: { short: 'size', from: 'parent', text: 'Whether the card is compact (in search results) or regular (on the category page).', line: 'size?: \'compact\' | \'regular\';' },
  slot: { short: 'slotLabel', from: 'parent', text: '“Arrives today, 7–7:30 pm”, from the delivery slot picked in the page header.', line: 'slotLabel: string;' },
  quantity: { short: 'quantity', from: 'use', shared: true, text: 'How many packs are in the cart. The cart bar at the bottom of the page shows the total too.', line: 'quantity: number; onQuantityChange: (n: number) => void;', parent: 'const [cart, setCart] = useState<Record<string, number>>({});' },
  saved: { short: 'saved', from: 'use', shared: true, text: 'Whether it is saved to “Monthly list”. The Lists tab shows a count of saved items.', line: 'saved: boolean; onSavedChange: (s: boolean) => void;', parent: 'const [saved, setSaved] = useState<Set<string>>(new Set());' },
  grind: { short: 'grind', from: 'use', shared: true, text: 'The grind the customer picks, fine or coarse. The mill reads it from the order at checkout.', line: 'grind: Grind; onGrindChange: (g: Grind) => void;', parent: 'const [grinds, setGrinds] = useState<Record<string, Grind>>({});' },
  open: { short: 'open', from: 'use', text: 'Whether “Which mill, ground when” is expanded under the card.', line: 'const [open, setOpen] = useState(false);' },
  loaded: { short: 'loaded', from: 'use', text: 'Whether the product photo has loaded, so it can fade in over the placeholder.', line: 'const [loaded, setLoaded] = useState(false);' },
  added: { short: 'added', from: 'use', text: 'Whether the “Added” tick is showing, for 1.5 seconds after a tap on Add.', line: 'const [added, setAdded] = useState(false);' },
  total: { short: 'lineTotal', from: 'use', computable: true, text: 'The line total: price × quantity, shown under the stepper.', line: 'const lineTotal = product.price * quantity;' },
  soldOut: { short: 'soldOut', from: 'parent', computable: true, text: 'Whether it is sold out: the API sends stock, and stock is 0.', line: 'const soldOut = product.stock === 0;' },
  discount: { short: 'discount', from: 'parent', computable: true, text: 'The “11% off” badge, from the price and the MRP.', line: 'const discount = Math.round((1 - product.price / product.mrp) * 100);' },
} as const satisfies Record<string, CardDatum>;
export type ChakkiDatum = keyof typeof DATA;
export const CHAKKI_DATA: Record<ChakkiDatum, CardDatum> = DATA;

/** The component as decided so far: the props interface, the card's own state and derived values, and the state
 *  lifted into the parent page. Keys go in the order given; anything not yet decided is left out. */
export const componentCode = (keys: readonly ChakkiDatum[]) => {
  const of = (h: DataHome) => keys.filter(k => dataHome(CHAKKI_DATA[k]) === h).map(k => CHAKKI_DATA[k]);
  return {
    props: [...of('prop'), ...of('lift')].map(d => d.line),
    state: of('state').map(d => d.line),
    derived: of('derive').map(d => d.line),
    parent: of('lift').map(d => d.parent as string),
  };
};

// ── Animation in code (dc.4-2, `anim-fix`) ─────────────────────────────────────────────────────────────────────────

/** A frame at 60 Hz, in ms: everything the browser does for one frame has to fit in it. */
export const FRAME_MS = 1000 / 60;
/** How much of the browser's work a CSS property makes it redo every frame it animates. `layout`: geometry changes,
 *  so it lays the page out again, then paints and composites. `paint`: pixels change, so it repaints, then
 *  composites. `composite`: the compositor moves or fades an already-painted layer, usually off the main thread. */
export const RENDER_WORK = ['composite', 'paint', 'layout'] as const;
export type RenderWork = (typeof RENDER_WORK)[number];
const LAYOUT_PROPS = new Set(['width', 'height', 'top', 'left', 'right', 'bottom', 'margin', 'padding', 'font-size']);
const COMPOSITE_PROPS = new Set(['transform', 'opacity']);
/** The most work one property costs a frame. Anything not geometry, transform or opacity (colour, shadow) repaints. */
export const renderWork = (prop: string): RenderWork =>
  LAYOUT_PROPS.has(prop) ? 'layout' : COMPOSITE_PROPS.has(prop) ? 'composite' : 'paint';
/** The most work any of an animation's properties costs. */
export const worstWork = (props: readonly string[]): RenderWork =>
  props.reduce<RenderWork>((w, p) => (RENDER_WORK.indexOf(renderWork(p)) > RENDER_WORK.indexOf(w) ? renderWork(p) : w), 'composite');

/** What an animation needs before it ships (`anim-fix` lanes). `ship`: it is ready. `transform`: it animates geometry,
 *  so it re-lays out the page every frame; move it with transform (FLIP, for a real layout change). `exit`: React
 *  removes the element in the same render, so its exit animation never plays. `interrupt`: when it is triggered again
 *  mid-way, it jumps instead of carrying on from where it is. */
export const ANIM_FIXES = ['ship', 'transform', 'exit', 'interrupt'] as const;
export type AnimFix = (typeof ANIM_FIXES)[number];

/** An animation in Chakki's app. `props`: the CSS properties it animates. `exits`: it plays as the element leaves.
 *  `staysMounted`: the element stays in the DOM until its exit finishes (AnimatePresence, or unmounting on
 *  `transitionend`). `retriggers`: it can be reversed or restarted half-way (a toggle tapped twice, a drag let go).
 *  `fromCurrent`: it starts from the current value (a CSS transition or a spring), not from a fixed first keyframe.
 *  `code`: how it is written now. `fixed`: how it should be. */
export interface AnimSpec {
  text: string; short: string; code: string; fixed: string; props: readonly string[];
  exits?: boolean; staysMounted?: boolean; retriggers?: boolean; fromCurrent?: boolean;
}

/** Geometry first (it costs every frame), then an exit that can't play, then a jump when interrupted. */
export const animFix = (a: AnimSpec): AnimFix =>
  worstWork(a.props) === 'layout' ? 'transform'
    : a.exits && !a.staysMounted ? 'exit'
      : a.retriggers && !a.fromCurrent ? 'interrupt' : 'ship';

const MOTIONS = {
  press: { short: 'Add button press', props: ['transform', 'background-color'], text: 'Add shrinks to 97% and darkens while pressed.', code: 'transition: transform 120ms ease-out, background-color 120ms;', fixed: 'Keep it: a colour change on one small button is a cheap repaint.', retriggers: true, fromCurrent: true },
  spinner: { short: 'Loading ring', props: ['transform'], text: 'The ring spins while the mill confirms your slot.', code: 'animation: spin 800ms linear infinite;', fixed: 'Keep it: rotation is compositor-only.' },
  photo: { short: 'Photo fade-in', props: ['opacity'], text: 'A product photo fades in over its placeholder once it has loaded.', code: 'transition: opacity 200ms; opacity: loaded ? 1 : 0', fixed: 'Keep it: opacity is compositor-only.', retriggers: true, fromCurrent: true },
  sheet: { short: 'Cart sheet', props: ['top'], text: 'The cart sheet slides up from the bottom of the screen.', code: 'transition: top 300ms ease-out; top: open ? "40%" : "100%"', fixed: 'transform: translateY(open ? 0 : 100%), with the sheet laid out once at its open position.' },
  tabs: { short: 'Tab underline', props: ['left', 'width'], text: 'The underline slides from “Atta” to “Millets” when you switch tab.', code: 'transition: left 250ms, width 250ms;', fixed: 'translateX and scaleX on a full-width bar, or one shared element: <motion.div layoutId="underline" />.' },
  sort: { short: 'Sort by price', props: ['top'], text: 'Sorting by price slides every card to its new place.', code: 'Cards are position: absolute, and each card’s top animates to its new row.', fixed: 'Let the grid lay them out, and animate the difference with FLIP: <motion.li layout>.' },
  toast: { short: '“Added” toast', props: ['transform', 'opacity'], exits: true, text: 'The “Added to cart” toast slides down and fades when it goes.', code: '{show && <Toast className="slide-out" />}', fixed: '<AnimatePresence>{show && <motion.div exit={{ y: 16, opacity: 0 }} />}</AnimatePresence>' },
  row: { short: 'Removed cart row', props: ['opacity'], exits: true, text: 'A row you remove from the cart fades out.', code: 'setItems(items.filter(i => i.id !== id)) on tap, and a .fade-out class', fixed: 'Wrap the list in <AnimatePresence> so the row stays until its exit finishes, then let layout close the gap.' },
  slotSheet: { short: 'Slot picker closing', props: ['transform'], exits: true, text: 'The delivery-slot picker slides away after you choose a slot.', code: 'return open ? <SlotPicker className="slide-away" /> : null;', fixed: 'Keep it mounted and remove it on transitionend, or use AnimatePresence with an exit.' },
  drag: { short: 'Sheet drag release', props: ['transform'], retriggers: true, text: 'You drag the cart sheet down and let go; it snaps open or shut.', code: 'On release: add .snap-open, a @keyframes from translateY(0)', fixed: 'Spring from where the finger let go, carrying its velocity: Motion’s drag="y" with dragConstraints does this.' },
  panel: { short: 'Mill details panel', props: ['transform', 'opacity'], retriggers: true, text: '“Which mill, ground when” slides in under the card. Tap twice fast and it jumps.', code: '.panel-in { animation: slide-in 250ms } and .panel-out { animation: slide-out 250ms }', fixed: 'One transition on transform and opacity, which reverses from where it is when you tap again.' },
  stepper: { short: 'Quantity roll', props: ['transform'], retriggers: true, text: 'The number rolls up when you tap +. Tap three times and it plays three rolls in a row.', code: 'Each tap queues a setTimeout chain that rolls one digit from the start.', fixed: 'Animate to the latest value from the current one, and drop rolls that are already out of date.' },
} as const satisfies Record<string, AnimSpec>;
export type ChakkiMotion = keyof typeof MOTIONS;
export const CHAKKI_MOTIONS: Record<ChakkiMotion, AnimSpec> = MOTIONS;

// ── Building with AI coding agents (dc.4-3, `agent-review`) ────────────────────────────────────────────────────────

/** What to do with a change in a coding agent's pull request (`agent-review` lanes). `keep`: it was asked for, it
 *  follows the repo's rules, and a test or the type checker proves it. `verify`: it was asked for and looks right,
 *  but only a person can check it: how it looks, feels, reads aloud or fits on a real phone. `rules`: it breaks a
 *  team convention the agent wasn't told, so the convention goes into the repo's rules file (AGENTS.md or CLAUDE.md)
 *  and the agent redoes it. `revert`: nobody asked for it, or it weakens the checks that prove the work. */
export const REVIEW_CALLS = ['keep', 'verify', 'rules', 'revert'] as const;
export type ReviewCall = (typeof REVIEW_CALLS)[number];

/** One change in the agent's pull request. `asked`: it is part of the task. `weakens`: it deletes, skips or silences a
 *  test, type or lint check. `breaks`: the convention it breaks, as the line for the rules file. `proof`: what shows
 *  it works, a passing test or type check, or only a person's eyes and ears. */
export interface AgentChange {
  text: string; short: string; file: string; asked: boolean; weakens?: boolean; breaks?: string;
  proof: 'test' | 'types' | 'person';
}

/** Scope and honest checks first, then the team's rules, then who can prove it. */
export const reviewCall = (c: AgentChange): ReviewCall =>
  !c.asked || c.weakens ? 'revert' : c.breaks ? 'rules' : c.proof === 'person' ? 'verify' : 'keep';

const CHANGES = {
  picker: { short: 'Substitution picker', file: 'SubstitutionPicker.tsx', asked: true, proof: 'test', text: 'A new picker built from the design system’s RadioGroup: replace with similar, call me, or refund. Its tests pass.' },
  cutoff: { short: 'Lock before grinding', file: 'substitution.ts', asked: true, proof: 'test', text: 'canChange(order, now) locks the choice 30 minutes before grinding starts, with tests for 29, 30 and 31 minutes.' },
  types: { short: 'Order type', file: 'order.ts', asked: true, proof: 'types', text: 'Order gets substitution: \'replace\' | \'call\' | \'refund\', and the type check passes across the 11 files that read it.' },
  hex: { short: 'Hard-coded green', file: 'SubstitutionPicker.tsx', asked: true, proof: 'person', breaks: 'Colours come from the tokens in tokens.css. Never write a hex value in a component.', text: 'The selected option’s border is #16A34A, written straight into the component.' },
  moment: { short: 'New date library', file: 'package.json', asked: true, proof: 'test', breaks: 'Dates use date-fns, which is already installed. Ask before adding any dependency.', text: 'Adds moment, a second date library, to format “Grinding starts 6:30 am”.' },
  sheet: { short: 'Home-made sheet', file: 'SubstitutionSheet.tsx', asked: true, proof: 'test', breaks: 'Sheets, dialogs and toasts come from @chakki/ui. Don’t build your own.', text: 'Builds its own bottom sheet with a div and a backdrop, instead of the design system’s Sheet.' },
  deleted: { short: 'Deleted test', file: 'packing-cutoff.test.ts', asked: true, weakens: true, proof: 'test', text: 'Deletes packing-cutoff.test.ts, which was failing, and reports “all tests pass”.' },
  rename: { short: 'Renamed component', file: '30 files', asked: false, proof: 'types', text: 'Renames ProductCard to ItemTile across 30 files “for consistency”.' },
  lint: { short: 'Silenced lint', file: 'useSubstitution.ts', asked: true, weakens: true, proof: 'types', text: 'Adds // eslint-disable-next-line react-hooks/exhaustive-deps above a useEffect to clear a warning.' },
  feel: { short: 'Selection animation', file: 'SubstitutionPicker.tsx', asked: true, proof: 'person', text: 'The ring around the chosen option grows in over 150 ms. The agent says it “feels smooth”.' },
  talkback: { short: 'Screen reader', file: 'SubstitutionPicker.tsx', asked: true, proof: 'person', text: 'Says each option is announced as “Replace with similar, radio button, 1 of 3”. It has never heard TalkBack.' },
  gujarati: { short: 'Gujarati at 320 px', file: 'SubstitutionPicker.tsx', asked: true, proof: 'person', text: 'Says the Gujarati labels fit at 320 px wide with text at 130%. There is no visual test for it.' },
} as const satisfies Record<string, AgentChange>;
export type ChakkiChange = keyof typeof CHANGES;
export const CHAKKI_CHANGES: Record<ChakkiChange, AgentChange> = CHANGES;

/** The lines a set of reviewed changes adds to the rules file, in order, without repeats. */
export const rulesFile = (keys: readonly ChakkiChange[]) =>
  [...new Set(keys.filter(k => reviewCall(CHAKKI_CHANGES[k]) === 'rules').map(k => CHAKKI_CHANGES[k].breaks as string))];
/** The pull request after review: what merges, what a person still has to check by hand, what goes back to the agent
 *  with a new rule, and what is undone. */
export const reviewedPr = (keys: readonly ChakkiChange[]) =>
  Object.fromEntries(REVIEW_CALLS.map(r => [r, keys.filter(k => reviewCall(CHAKKI_CHANGES[k]) === r)])) as Record<ReviewCall, ChakkiChange[]>;
