// Advanced prototyping at Thela, for chapter pr.4. Thela is a Hyderabad grocery app that delivers in about 15 minutes
// from dark stores in Kukatpally, Madhapur and Kondapur. Ananya Reddy leads its design, Vikram builds its front end and
// writes the code prototypes, and Sana runs research. Before a big release they test with real households, such as
// Lakshmi, who shops for a family of five in Kukatpally. This is the data the pr.4 scenes and games draw, and the rules
// they score against: which prototype behaviour needs a variable, a conditional or a mode; the cheapest tool that can
// answer a research question; and how the outputs of an AI feature should reach a participant during a test.

// ── Variables & conditional logic (pr.4-1, `logic-wire`) ───────────────────────────────────────────────────────────

/** The three items in the prototype cart. `mrp` is the printed price, `price` Thela's, `plus` the Thela Plus member
 *  price. `stock` caps how many can be added. */
export interface ThelaItem { name: string; te: string; unit: string; mrp: number; price: number; plus: number; stock: number }

const ITEMS = {
  milk: { name: 'Toned milk', te: 'టోన్డ్ పాలు', unit: '1 L', mrp: 56, price: 54, plus: 52, stock: 20 },
  atta: { name: 'Chakki atta', te: 'గోధుమ పిండి', unit: '5 kg', mrp: 300, price: 265, plus: 255, stock: 20 },
  butter: { name: 'Salted butter', te: 'ఉప్పు వెన్న', unit: '100 g', mrp: 58, price: 56, plus: 54, stock: 2 },
} as const satisfies Record<string, ThelaItem>;
export type ThelaItemId = keyof typeof ITEMS;
export const THELA_ITEMS: Record<ThelaItemId, ThelaItem> = ITEMS;
export const THELA_ITEM_IDS = Object.keys(ITEMS) as ThelaItemId[];

/** Thela's cart rules. Below `freeDeliveryAt` delivery costs `deliveryFee`; below `smallCartBelow` a small-cart fee is
 *  added; FIRST50 takes ₹50 off from `couponMin`. Plus members get free delivery and no small-cart fee. */
export const CART_RULES = { freeDeliveryAt: 199, deliveryFee: 25, smallCartBelow: 99, smallCartFee: 15, couponMin: 299, couponOff: 50 } as const;

export type ThelaQty = Record<ThelaItemId, number>;
export interface CartOptions { plus?: boolean; coupon?: boolean }

/** Everything the prototype cart shows for a set of quantities. `freeDeliveryNeed` and `couponNeed` are how much more
 *  the cart needs to reach each threshold (0 once reached). `couponApplied` is false when FIRST50 was entered but the
 *  cart is below its minimum. */
export function cartTotals(qty: ThelaQty, opts: CartOptions = {}) {
  const ids = THELA_ITEM_IDS;
  const n = (id: ThelaItemId) => Math.max(0, Math.min(qty[id] ?? 0, THELA_ITEMS[id].stock));
  const unit = (id: ThelaItemId) => (opts.plus ? THELA_ITEMS[id].plus : THELA_ITEMS[id].price);
  const count = ids.reduce((s, id) => s + n(id), 0);
  const subtotal = ids.reduce((s, id) => s + n(id) * unit(id), 0);
  const savings = ids.reduce((s, id) => s + n(id) * (THELA_ITEMS[id].mrp - unit(id)), 0);
  const r = CART_RULES;
  const empty = count === 0;
  const delivery = empty || opts.plus || subtotal >= r.freeDeliveryAt ? 0 : r.deliveryFee;
  const smallCartFee = empty || opts.plus || subtotal >= r.smallCartBelow ? 0 : r.smallCartFee;
  const couponApplied = !!opts.coupon && subtotal >= r.couponMin;
  const couponOff = couponApplied ? r.couponOff : 0;
  return {
    count, subtotal, savings, delivery, smallCartFee, couponApplied, couponOff,
    freeDeliveryNeed: opts.plus ? 0 : Math.max(0, r.freeDeliveryAt - subtotal),
    couponNeed: Math.max(0, r.couponMin - subtotal),
    total: subtotal + delivery + smallCartFee - couponOff,
  };
}

/** Whether + is still allowed for an item (the stock rule). */
export const canAdd = (qty: ThelaQty, id: ThelaItemId) => (qty[id] ?? 0) < THELA_ITEMS[id].stock;

/** What a prototype behaviour is wired with (`logic-wire` lanes). `variable`: a value the prototype remembers and
 *  updates, often with an expression. `conditional`: the prototype checks a value and does one thing or another.
 *  `mode`: a whole set of values swapped at once (a language, a membership, a participant's starting data). */
export const WIRE_KINDS = ['variable', 'conditional', 'mode'] as const;
export type WireKind = (typeof WIRE_KINDS)[number];

/** A behaviour the cart prototype needs. `set`: it swaps many values together. `decides`: the screen depends on a
 *  comparison. Otherwise it stores and shows a value. `wires` names the Figma pieces it takes. */
export interface CartBehaviour { text: string; set: boolean; decides: boolean; wires: string }

/** A set of values is a mode, whatever it contains; a comparison is a conditional; the rest is a variable. */
export const wireKind = (b: CartBehaviour): WireKind => (b.set ? 'mode' : b.decides ? 'conditional' : 'variable');

/** The behaviours Ananya needs before Sana's cart test (`logic-wire` cards). */
const BEHAVIOURS = {
  badge: { text: 'The cart badge counts the items as people add them', set: false, decides: false, wires: 'Number `itemCount`; + sets it to itemCount + 1' },
  subtotal: { text: 'The subtotal adds up as items go in: ₹54 for milk, ₹265 for atta', set: false, decides: false, wires: 'Number `subtotal`; + sets it to subtotal + price' },
  savings: { text: '“You saved ₹37” adds up the difference from the printed MRP', set: false, decides: false, wires: 'Number `savings`; + adds mrp − price' },
  freeDelivery: { text: 'Below ₹199, “Add ₹X more for free delivery”; at ₹199 or more, delivery is free', set: false, decides: true, wires: 'If subtotal < 199: show the bar, set delivery to 25. Else: 0' },
  smallCart: { text: 'A ₹15 small-cart fee on carts under ₹99', set: false, decides: true, wires: 'If subtotal < 99: set smallCartFee to 15. Else: 0' },
  coupon: { text: 'FIRST50 works from ₹299; below that, say how much more is needed', set: false, decides: true, wires: 'If subtotal ≥ 299: take 50 off. Else: show “Add ₹X more”' },
  stock: { text: 'Only 2 packs of butter left: + stops working at 2', set: false, decides: true, wires: 'If butterQty < 2: add one. Else: show “Only 2 left”' },
  telugu: { text: 'Every label switches between English and Telugu', set: true, decides: false, wires: 'String variables with English and Telugu modes' },
  plus: { text: 'Thela Plus members see member prices and free delivery on every order', set: true, decides: false, wires: 'A Member mode for prices, fees and the badge' },
  returning: { text: 'Sana starts each session as a new or a returning customer, with that person’s saved address and past orders', set: true, decides: false, wires: 'A New / Returning mode, set on the first frame' },
} as const satisfies Record<string, CartBehaviour>;
export type ThelaBehaviour = keyof typeof BEHAVIOURS;
export const THELA_BEHAVIOURS: Record<ThelaBehaviour, CartBehaviour> = BEHAVIOURS;

// ── Code prototypes (pr.4-2, `proto-fit`) ──────────────────────────────────────────────────────────────────────────

/** Tools from cheapest to dearest. */
export const PROTO_TOOLS = ['figma', 'framer', 'code'] as const;
export type ProtoTool = (typeof PROTO_TOOLS)[number];
export const PROTO_TOOL_LABEL: Record<ProtoTool, string> = { figma: 'Figma', framer: 'Framer', code: 'React' };

/** What a research question needs the prototype to make real. */
export const PROTO_NEEDS = ['flow', 'logic', 'web', 'typing', 'content', 'live', 'device'] as const;
export type ProtoNeed = (typeof PROTO_NEEDS)[number];
export const PROTO_NEED_LABEL: Record<ProtoNeed, string> = {
  flow: 'Tap through screens', logic: 'Values and rules', web: 'Real scroll, hover, breakpoints', typing: 'Real typing',
  content: 'Many real items', live: 'Live data or real timing', device: 'Camera, location, sensors',
};

/** What each tool makes real without custom code. Framer can run React code components too, but at that point the
 *  team is writing a code prototype, and pays for one. */
export const TOOL_CAN: Record<ProtoTool, readonly ProtoNeed[]> = {
  figma: ['flow', 'logic'],
  framer: ['flow', 'logic', 'web', 'typing', 'content'],
  code: PROTO_NEEDS,
};
/** Days of Ananya's and Vikram's time each takes for one Thela test. */
export const TOOL_DAYS: Record<ProtoTool, number> = { figma: 1, framer: 3, code: 6 };

export const toolCovers = (tool: ProtoTool, needs: readonly ProtoNeed[]) => needs.every(n => TOOL_CAN[tool].includes(n));
/** The cheapest tool that makes everything the question needs real. More fidelity than that costs days and answers
 *  nothing extra; less, and the test measures the prototype instead of the design. */
export const protoTool = (needs: readonly ProtoNeed[]): ProtoTool => PROTO_TOOLS.find(t => toolCovers(t, needs)) ?? 'code';
/** The needs a tool leaves fake. */
export const missingNeeds = (tool: ProtoTool, needs: readonly ProtoNeed[]) => needs.filter(n => !TOOL_CAN[tool].includes(n));

export interface ProtoQuestion { text: string; needs: readonly ProtoNeed[] }

/** Questions on the research board for Thela's next release (`proto-fit` cards). */
const QUESTIONS = {
  staples: { text: 'Can people find the Weekly staples list from the home screen?', needs: ['flow'] },
  nudge: { text: 'Do people notice the free-delivery bar and add one more item to reach ₹199?', needs: ['flow', 'logic'] },
  fee: { text: 'Does the ₹15 small-cart fee feel fair as it appears and disappears with the quantities?', needs: ['flow', 'logic'] },
  teluguCart: { text: 'Do people on the Telugu cart understand the fees as well as people on the English one?', needs: ['flow', 'logic'] },
  sticky: { text: 'On the web store, does the sticky basket bar hide products as people scroll on a laptop?', needs: ['flow', 'web'] },
  address: { text: 'Do people fill the new address form, flat, landmark and pincode, right first time?', needs: ['flow', 'typing'] },
  aisle: { text: 'Can people compare 60 real atta and rice packs on the category page?', needs: ['flow', 'web', 'content'] },
  search: { text: 'Does search find toor dal when people type “tur”, “arhar” or “kandi pappu”?', needs: ['typing', 'live'] },
  slots: { text: 'Does “15 minutes” still feel true when delivery slots take 2 to 4 seconds to load on 4G?', needs: ['flow', 'live'] },
  scan: { text: 'Can people photograph a handwritten kirana list and fix what Thela misread?', needs: ['device', 'live'] },
  buyAgain: { text: 'Do returning customers trust “Buy again” when it shows their own last five orders?', needs: ['flow', 'live'] },
} as const satisfies Record<string, ProtoQuestion>;
export type ThelaQuestion = keyof typeof QUESTIONS;
export const THELA_QUESTIONS: Record<ThelaQuestion, ProtoQuestion> = QUESTIONS;

// ── Prototyping AI & dynamic content (pr.4-3, `output-plan`) ───────────────────────────────────────────────────────

/** How an AI feature's outputs reach a participant (`output-plan` lanes). `wizard`: a person writes them live, behind
 *  the curtain, because no model can do it yet. `recorded`: real outputs generated beforehand and chosen, so every
 *  participant sees the same ones, failures included. `live`: the real model answers each participant's own input. */
export const OUTPUT_METHODS = ['wizard', 'recorded', 'live'] as const;
export type OutputMethod = (typeof OUTPUT_METHODS)[number];

/** A study of “Ask Thela”, which turns a request like “biryani for 6” into a cart. `modelReady`: a model can do this
 *  well enough today. `sameForAll`: the question needs every participant to meet the same output, such as a planned
 *  failure or a comparison. `ownInput`: the question is about what people ask for themselves. `seen`: what three
 *  participants were shown. */
export interface AiStudy {
  text: string; modelReady: boolean; sameForAll: boolean; ownInput: boolean;
  seen: readonly [string, string, string];
}

/** No model, no choice: a person plays it. Then a controlled output wins over a live one whenever the question needs
 *  everyone to see the same thing. Live only when the question is about people's own input. */
export const outputMethod = (s: AiStudy): OutputMethod =>
  !s.modelReady ? 'wizard' : s.sameForAll ? 'recorded' : s.ownInput ? 'live' : 'recorded';

/** Sana's research plan for Ask Thela (`output-plan` cards). */
const STUDIES = {
  want: { text: 'Before any model work: do people even want to ask for a dish instead of searching for items?', modelReady: false, sameForAll: false, ownInput: true,
    seen: ['Pesarattu for 4: moong dal, rice, ginger, chillies', 'Sunday chicken curry: 1 kg chicken, onions, curd', 'Tiffin for the week: idli rava, urad dal, coconut'] },
  voice: { text: 'Voice orders that mix Telugu and English, “2 kg ullipaya, one butter”, before the speech model is trained', modelReady: false, sameForAll: false, ownInput: true,
    seen: ['Onions 2 kg, butter 100 g', 'Tomatoes 1 kg, coriander 1 bunch', 'Curd 400 g, green chillies 100 g'] },
  followUp: { text: 'A follow-up question, “Basmati or sona masoori?”, which the model can’t ask yet', modelReady: false, sameForAll: false, ownInput: true,
    seen: ['Basmati or sona masoori?', 'For 6, 1.5 kg rice?', 'Do you have whole spices at home?'] },
  wrongItem: { text: 'How do people react when Ask Thela puts chicken in a cart for veg biryani?', modelReady: true, sameForAll: true, ownInput: false,
    seen: ['Veg biryani for 6 · chicken 1 kg added', 'Veg biryani for 6 · chicken 1 kg added', 'Veg biryani for 6 · chicken 1 kg added'] },
  layouts: { text: 'Is the AI cart easier to check as one list, or grouped by recipe? Same cart in both', modelReady: true, sameForAll: true, ownInput: false,
    seen: ['Biryani for 6 · 14 items', 'Biryani for 6 · 14 items', 'Biryani for 6 · 14 items'] },
  wait: { text: 'Does a 9-second “Building your cart…” wait feel too long?', modelReady: true, sameForAll: true, ownInput: false,
    seen: ['Building your cart… 9 s', 'Building your cart… 9 s', 'Building your cart… 9 s'] },
  longCart: { text: 'Do people still check quantities when the cart is 23 items long, for a Diwali sweets list?', modelReady: true, sameForAll: true, ownInput: false,
    seen: ['Diwali sweets · 23 items', 'Diwali sweets · 23 items', 'Diwali sweets · 23 items'] },
  realAsks: { text: 'What do 8 Hyderabad households actually type when they plan a week of cooking?', modelReady: true, sameForAll: false, ownInput: true,
    seen: ['Weekday dinners, less oil, 4 people', 'Pappu, rasam and curd rice for the week', 'Kids’ snack box, no maida'] },
  trust: { text: 'Do people trust and fix the carts the real model builds from their own family recipes?', modelReady: true, sameForAll: false, ownInput: true,
    seen: ['Amma’s gongura pickle · 9 items', 'Mutton biryani for 10 · 17 items', 'Ragi malt for a toddler · 4 items'] },
  fixRate: { text: 'In the beta, how often do people’s own requests need a fix before checkout?', modelReady: true, sameForAll: false, ownInput: true,
    seen: ['Paneer butter masala · 2 fixes', 'Upma for 3 · no fixes', 'Fish fry · 1 fix'] },
} as const satisfies Record<string, AiStudy>;
export type ThelaStudy = keyof typeof STUDIES;
export const THELA_STUDIES: Record<ThelaStudy, AiStudy> = STUDIES;

/** The range a dynamic-content prototype is stocked with, so the test meets the real catalogue, not the tidy mock. */
export const CONTENT_RANGE = [
  { case: 'Shortest name', sample: 'Jeera' },
  { case: 'Longest name', sample: 'Sharbati whole wheat chakki atta, multigrain, family pack, 10 kg' },
  { case: 'Telugu', sample: 'కంది పప్పు 1 కి.గ్రా' },
  { case: 'Price', sample: '₹9 to ₹4,999' },
  { case: 'No results', sample: '0 items for “kandi podi”' },
] as const;
