// Haat's design calls, for chapter fd.4. Haat is a grocery and essentials marketplace in 30 Indian cities: about
// 40 lakh households order each week, from Haat's own dark stores and from local sellers on its seller app. Ritika Sen
// is its principal designer, across 14 designers. She reads trade-off matrices for what kind of call they really are,
// rewrites the team's principles until they settle arguments, and judges when a design-system rule should bend, break
// or change. This is the data the fd.4 scenes and games draw, and the rules they score against.

// ── Trade-off matrices (fd.4-1, `matrix-read`) ──────────────────────────────────────────────────────────────────────

/** What a matrix tells you (`matrix-read` lanes). `clear`: one option wins however the people in the room weigh it,
 *  so decide. `weights`: the winner changes with who is weighing, so the argument is about priorities, and a leader
 *  has to set them. `evidence`: the winner hangs on a score that is a guess, so find out before deciding. `reframe`:
 *  no option clears every must-have, so this isn't a trade-off yet; look for a new option. */
export const MATRIX_CALLS = ['clear', 'weights', 'evidence', 'reframe'] as const;
export type MatrixCall = (typeof MATRIX_CALLS)[number];
/** A column. Scores are 1–5, higher is better. `must`: the lowest score an option can have here and still be
 *  considered at all. */
export interface Criterion { label: string; must?: number }
export interface TradeOption { label: string; scores: readonly number[] }
/** One person's weights (1–3), one per criterion. */
export interface Lens { who: string; weights: readonly number[] }
/** A score nobody has checked: the true value could be anywhere from `low` to `high`. */
export interface Unsure { option: number; criterion: number; low: number; high: number; why: string }
export interface TradeDecision {
  text: string; criteria: readonly Criterion[]; options: readonly TradeOption[]; lenses: readonly Lens[]; unsure?: Unsure;
}

/** Weighted total. */
export const weighted = (scores: readonly number[], weights: readonly number[]) => scores.reduce((s, x, i) => s + x * weights[i], 0);
/** Does an option clear every must-have? */
export const clearsMusts = (d: TradeDecision, scores: readonly number[]) => d.criteria.every((c, i) => c.must === undefined || scores[i] >= c.must);
/** `d` with the unsure cell set to `value`. */
export const withCell = (d: TradeDecision, value: number): TradeDecision => !d.unsure ? d : {
  ...d, options: d.options.map((o, i) => i !== d.unsure!.option ? o : { ...o, scores: o.scores.map((s, j) => (j === d.unsure!.criterion ? value : s)) }),
};
/** The option (index) that wins under `weights`, among those that clear the must-haves; null if none does. */
export const winner = (d: TradeDecision, weights: readonly number[]) => {
  let best: number | null = null;
  d.options.forEach((o, i) => {
    if (!clearsMusts(d, o.scores)) return;
    if (best === null || weighted(o.scores, weights) > weighted(d.options[best].scores, weights)) best = i;
  });
  return best;
};
/** The winner under each lens. */
export const lensWinners = (d: TradeDecision) => d.lenses.map(l => winner(d, l.weights));
/** Read the matrix in order: does anything clear the must-haves; does the winner survive everyone's weights; does it
 *  survive the guess being wrong either way. */
export const matrixCall = (d: TradeDecision): MatrixCall => {
  const ws = lensWinners(d);
  if (ws.every(w => w === null)) return 'reframe';
  if (new Set(ws).size > 1) return 'weights';
  if (d.unsure) for (const v of [d.unsure.low, d.unsure.high]) if (lensWinners(withCell(d, v)).some(w => w !== ws[0])) return 'evidence';
  return 'clear';
};

/** Haat's open decisions (`matrix-read` cards). */
const DECISIONS = {
  fee: {
    text: 'Where to show the ₹25 delivery fee on orders under ₹199',
    criteria: [{ label: 'Orders' }, { label: 'No surprises' }, { label: 'Quick to build' }],
    options: [
      { label: 'Only on the cart page', scores: [4, 2, 5] },
      { label: 'On every product card', scores: [2, 5, 2] },
      { label: 'In the basket bar, from the first item', scores: [4, 4, 5] },
    ],
    lenses: [{ who: 'Ishaan, growth', weights: [3, 1, 1] }, { who: 'Pooja, trust', weights: [1, 3, 1] }, { who: 'Rajat, engineering', weights: [1, 1, 3] }],
  },
  reorder: {
    text: 'What goes at the top of the home screen: “Order again”, or brand-paid offers',
    criteria: [{ label: 'Repeat orders' }, { label: 'Ad revenue' }, { label: 'Quick to build' }],
    options: [
      { label: '“Order again” on top', scores: [5, 4, 4] },
      { label: 'Brand offers on top', scores: [2, 5, 4] },
      { label: 'Both, in one carousel', scores: [3, 3, 2] },
    ],
    lenses: [{ who: 'Kabir, head of product', weights: [3, 1, 1] }, { who: 'Ishaan, growth', weights: [2, 2, 1] }, { who: 'Neha, brand partnerships', weights: [1, 2, 1] }],
  },
  paylater: {
    text: 'Add “Pay later” at checkout, through a lending partner',
    criteria: [{ label: 'Basket size' }, { label: 'Nobody nudged into debt' }, { label: 'Quick to build' }],
    options: [
      { label: 'Pay later, selected by default', scores: [5, 1, 3] },
      { label: 'Pay later, offered below UPI', scores: [3, 4, 3] },
      { label: 'No pay later', scores: [1, 5, 5] },
    ],
    lenses: [{ who: 'Ishaan, growth', weights: [3, 1, 1] }, { who: 'Pooja, trust', weights: [1, 3, 1] }],
  },
  substitute: {
    text: 'An item is out of stock while a picker packs the order',
    criteria: [{ label: 'Order arrives complete' }, { label: 'Customer stays in control' }, { label: 'Picker speed' }],
    options: [
      { label: 'Swap in a similar item automatically', scores: [5, 1, 5] },
      { label: 'Ask the customer, wait up to 3 minutes', scores: [4, 5, 2] },
      { label: 'Drop it and refund', scores: [1, 3, 5] },
    ],
    lenses: [{ who: 'Sandeep, store operations', weights: [1, 1, 3] }, { who: 'Ritika, design', weights: [1, 3, 1] }],
  },
  search: {
    text: 'Make the home screen search-first, replacing the category grid',
    criteria: [{ label: 'Time to find an item' }, { label: 'Browsing and discovery' }, { label: 'Quick to build' }],
    options: [
      { label: 'Search-first home', scores: [4, 3, 4] },
      { label: 'Category grid, as today', scores: [3, 3, 4] },
    ],
    lenses: [{ who: 'Ritika, design', weights: [3, 1, 1] }, { who: 'Kabir, head of product', weights: [2, 2, 1] }],
    unsure: { option: 0, criterion: 0, low: 2, high: 5, why: 'From one hallway test with six Haat employees, who know the catalogue by heart' },
  },
  tenmin: {
    text: 'Promise 10-minute delivery in Pune, instead of a 30-minute window',
    criteria: [{ label: 'Speed' }, { label: 'Riders stay safe', must: 3 }, { label: 'Cost per order' }],
    options: [
      { label: '10-minute promise', scores: [5, 3, 3] },
      { label: '30-minute window', scores: [3, 5, 4] },
    ],
    lenses: [{ who: 'Ishaan, growth', weights: [3, 1, 1] }, { who: 'Kabir, head of product', weights: [3, 1, 2] }],
    unsure: { option: 0, criterion: 1, low: 1, high: 4, why: 'Operations says “probably fine”. Nobody has timed a real route at 7 pm' },
  },
  cod: {
    text: 'Cash on delivery for orders over ₹2,000 in Haat’s four newest cities',
    criteria: [{ label: 'Fraud losses kept low', must: 3 }, { label: 'People still order', must: 3 }, { label: 'Quick to build' }],
    options: [
      { label: 'Cash on delivery for everyone', scores: [1, 5, 5] },
      { label: 'No cash over ₹2,000', scores: [4, 1, 5] },
      { label: 'Cash only for repeat customers', scores: [3, 2, 4] },
    ],
    lenses: [{ who: 'Pooja, trust', weights: [3, 1, 1] }, { who: 'Ishaan, growth', weights: [1, 3, 1] }],
  },
  bulkprice: {
    text: 'Sellers want to edit hundreds of prices at once; edits over 20% are reviewed, to stop price gouging',
    criteria: [{ label: 'Seller time saved', must: 3 }, { label: 'Buyers protected', must: 3 }, { label: 'Quick to build' }],
    options: [
      { label: 'Bulk edits, no review', scores: [5, 1, 4] },
      { label: 'Bulk edits, every row reviewed', scores: [1, 5, 3] },
      { label: 'One price at a time, as today', scores: [2, 4, 5] },
    ],
    lenses: [{ who: 'Aditya, seller app', weights: [3, 1, 1] }, { who: 'Pooja, trust', weights: [1, 3, 1] }],
  },
} as const satisfies Record<string, TradeDecision>;
export type HaatDecision = keyof typeof DECISIONS;
export const HAAT_DECISIONS: Record<HaatDecision, TradeDecision> = DECISIONS;

// ── Principles that actually decide things (fd.4-2, `principle-test`) ──────────────────────────────────────────────

/** What a draft principle is (`principle-test` lanes). `platitude`: no sensible team would argue the opposite, so it
 *  rules nothing out. `vague`: it takes a side, but too loosely to settle any argument Haat actually has. `decides`:
 *  it settles at least one live dispute, and says what it costs. */
export const PRINCIPLE_VERDICTS = ['platitude', 'vague', 'decides'] as const;
export type PrincipleVerdict = (typeof PRINCIPLE_VERDICTS)[number];
/** The arguments Haat's teams keep having, each with its two sides. */
export const HAAT_DISPUTES = {
  fee: { question: 'Show the delivery fee early, or only at checkout?', a: 'Early', b: 'At checkout' },
  substitute: { question: 'Out of stock: swap automatically, or ask first?', a: 'Swap', b: 'Ask' },
  ads: { question: 'Brand-paid results above the best match in search?', a: 'Paid on top', b: 'Best match on top' },
  bulk: { question: 'Big seller price changes: instant, or held for review?', a: 'Instant', b: 'Held' },
} as const;
export type HaatDispute = keyof typeof HAAT_DISPUTES;
export const DISPUTE_IDS = Object.keys(HAAT_DISPUTES) as HaatDispute[];
export type Side = 'a' | 'b';
/** A draft principle. `opposite`: a sensible team could hold the opposite. `settles`: the disputes it decides, and
 *  which way. */
export interface Principle { text: string; opposite: boolean; settles: Partial<Record<HaatDispute, Side>> }
export const principleVerdict = (p: Principle): PrincipleVerdict =>
  !p.opposite ? 'platitude' : Object.keys(p.settles).length === 0 ? 'vague' : 'decides';
/** The sides a set of principles pushes a dispute towards. */
export const sidesFor = (ps: readonly Principle[], d: HaatDispute): Side[] =>
  (['a', 'b'] as const).filter(s => ps.some(p => p.settles[d] === s));
/** Disputes the set settles one way, and disputes it pulls both ways: two good principles in conflict, which need
 *  ranking. */
export const disputeState = (ps: readonly Principle[]) => {
  const settled: HaatDispute[] = [], torn: HaatDispute[] = [];
  for (const d of DISPUTE_IDS) { const s = sidesFor(ps, d); if (s.length === 1) settled.push(d); else if (s.length === 2) torn.push(d); }
  return { settled, torn };
};

/** Drafts from Haat's principles workshop (`principle-test` cards). */
const PRINCIPLES = {
  simple: { text: 'Simple and intuitive.', opposite: false, settles: {} },
  customer: { text: 'Customer first, always.', opposite: false, settles: {} },
  modern: { text: 'Modern, clean and premium.', opposite: false, settles: {} },
  bold: { text: 'Be bold and opinionated.', opposite: true, settles: {} },
  sellers: { text: 'Grow with every seller, from a one-shop kirana to a 40-store chain.', opposite: true, settles: {} },
  ship: { text: 'Ship to learn.', opposite: true, settles: {} },
  till: { text: 'The first price you see is the price you pay, even when hiding the fee would sell more.', opposite: true, settles: { fee: 'a' } },
  basket: { text: 'The basket is the customer’s: we never change what’s in it without asking, even when asking is slower.', opposite: true, settles: { substitute: 'b' } },
  speed: { text: 'A weekly shop in under three minutes, even if that means we decide small things for people.', opposite: true, settles: { substitute: 'a' } },
  answer: { text: 'Search answers the search: paid results are labelled and never above the best match, even when a brand pays more.', opposite: true, settles: { ads: 'b' } },
  fair: { text: 'Buyers are protected before sellers are pleased: big price jumps wait for a human, even for our largest sellers.', opposite: true, settles: { bulk: 'b' } },
} as const satisfies Record<string, Principle>;
export type HaatPrinciple = keyof typeof PRINCIPLES;
export const HAAT_PRINCIPLES: Record<HaatPrinciple, Principle> = PRINCIPLES;
/** Ritika's call when two good principles collide (the fd.4-2 scene and game end): the higher one wins. */
export const PRINCIPLE_RANK: readonly HaatPrinciple[] = ['basket', 'speed'];

// ── When to break the rules (fd.4-3, `rule-call`) ───────────────────────────────────────────────────────────────────

/** What to do with a proposed rule break (`rule-call` lanes). `hold`: keep the rule. `test`: break it in an
 *  experiment and measure, because the reason is a guess about users. `exception`: break it here, with the evidence
 *  written into the system's exceptions log. `change`: the rule itself is wrong for a need that keeps coming up, so
 *  rewrite it for everyone. */
export const RULE_CALLS = ['hold', 'test', 'exception', 'change'] as const;
export type RuleCall = (typeof RULE_CALLS)[number];
/** What a rule protects. `access` and `money` are floors: they keep people from being shut out or misled about what
 *  they pay. `consistency` keeps the product learnable. */
export type Protects = 'access' | 'money' | 'consistency';
/** The reason given for breaking it. `taste`: preference, or the team's convenience. `hunch`: a claim about users
 *  nobody has checked. `data`: research or numbers showing the rule hurts people here. */
export type Reason = 'taste' | 'hunch' | 'data';
export interface RuleBreak { text: string; rule: HaatRule; protects: Protects; reason: Reason; places: number }
/** Places with the same need before a rule should change rather than collect exceptions. */
export const CHANGE_AT = 3;
/** Floors don't bend; taste never breaks a rule; a hunch earns a test; evidence earns an exception, and the same
 *  evidence in three places earns a new rule. */
export const ruleCall = (b: RuleBreak): RuleCall =>
  b.protects !== 'consistency' || b.reason === 'taste' ? 'hold'
    : b.reason === 'hunch' ? 'test' : b.places >= CHANGE_AT ? 'change' : 'exception';

/** Haat's design-system rules. */
export const HAAT_RULES = {
  contrast: 'Text contrast is at least 4.5:1',
  gst: 'Prices show the full amount, GST included',
  confirm: 'Every payment shows what is being paid before it goes',
  primary: 'One primary button per screen',
  tabs: 'The bottom bar is always visible',
  spacing: 'Spacing comes from the 8-point scale',
  type: 'Text sizes come from the type scale',
  labels: 'Button labels are two words at most',
  case: 'Sentence case everywhere',
  buttons: 'Every action has a visible button',
} as const;
export type HaatRule = keyof typeof HAAT_RULES;

/** Proposals in Haat's design review (`rule-call` cards). */
const BREAKS = {
  diwali: { text: 'Tanvi wants the Diwali sale banner in gold on cream, at 2.1:1. “It’s only up for two weeks.”', rule: 'contrast', protects: 'access', reason: 'taste', places: 1 },
  pregst: { text: 'Growth wants product cards to show prices before GST, so Haat looks cheaper than its rivals', rule: 'gst', protects: 'money', reason: 'taste', places: 1 },
  oneTap: { text: 'Skip the confirmation for repeat orders. A test says it lifts orders 2%, and complaints about wrong amounts doubled', rule: 'confirm', protects: 'money', reason: 'data', places: 1 },
  caps: { text: 'Aditya wants “SALE” in capitals on product cards. “It feels more exciting.”', rule: 'case', protects: 'consistency', reason: 'taste', places: 1 },
  amount: { text: 'Rider app: the cash-to-collect amount at 32 px, off the type scale. Riders “probably” misread it in sunlight; nobody has asked them', rule: 'type', protects: 'consistency', reason: 'hunch', places: 1 },
  swipe: { text: 'Kabir wants swipe-to-add instead of “Add” buttons. He’s sure people will shop faster', rule: 'buttons', protects: 'consistency', reason: 'hunch', places: 1 },
  track: { text: 'Order tracking: “Share location” as a second primary button. In 40 support calls, riders couldn’t find the flat because people missed it', rule: 'primary', protects: 'consistency', reason: 'data', places: 1 },
  packing: { text: 'The packing screen at 4-point spacing, to fit 12 orders instead of 8. Timing studies show pickers scrolling all shift', rule: 'spacing', protects: 'consistency', reason: 'data', places: 1 },
  focus: { text: 'Hide the bottom bar during payment. Recordings show 1 in 6 people tap Home mid-payment; returns and the sellers’ stock count show the same', rule: 'tabs', protects: 'consistency', reason: 'data', places: 3 },
  tamil: { text: 'Allow three-word button labels. Tamil, Malayalam and Kannada labels are cut off in five flows, and testers misread them', rule: 'labels', protects: 'consistency', reason: 'data', places: 5 },
} as const satisfies Record<string, RuleBreak>;
export type HaatBreak = keyof typeof BREAKS;
export const HAAT_BREAKS: Record<HaatBreak, RuleBreak> = BREAKS;
/** How the rulebook ends up after a set of calls: rules rewritten, exceptions logged, tests running, breaks refused. */
export const rulebook = (calls: readonly RuleCall[]) =>
  Object.fromEntries(RULE_CALLS.map(c => [c, calls.filter(x => x === c).length])) as Record<RuleCall, number>;
