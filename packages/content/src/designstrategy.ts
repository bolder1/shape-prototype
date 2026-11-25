// Design strategy at Munim, for chapter st.4. Munim is a Pune company that makes software for small businesses: Munim
// Books (accounting and GST invoices and returns), Munim Pay (payment links and UPI collections) and Munim Stock
// (inventory). About 3 lakh businesses pay for at least one of them, most outside the metros, and many come through
// their chartered accountant (CA). Aarti Kulkarni is head of design, Vikram Joshi the CEO, Farhan Merchant the CFO and
// Neha Iyer leads product for Books. Ganpat Sawant runs a hardware shop in Nashik and uses Books and Pay.
// This is the data the st.4 scenes and games draw, and the rules they score against: whether a claimed design
// advantage holds; whether a design bet should be funded, probed or killed; and whether a capability belongs in a shared
// platform, should be harvested later, stays in one product, or is bought.

// ── Design as competitive advantage (st.4-1, `moat-crit`) ─────────────────────────────────────────────────────────

/** What a claimed design advantage really is (`moat-crit` lanes). `holds`: customers choose or stay for it, it fits
 *  how Munim wins, and a rival needs a year or more to match it. `copyable`: valued, but a funded rival matches it
 *  inside a year. `unvalued`: no evidence it changes what customers choose. `offstrategy`: valued by someone, but not
 *  by the customers Munim has chosen to serve. */
export const ADVANTAGE_CALLS = ['holds', 'copyable', 'unvalued', 'offstrategy'] as const;
export type AdvantageCall = (typeof ADVANTAGE_CALLS)[number];

/** A rival who can match something in less than this many months has matched it before your strategy pays off. */
export const COPY_MONTHS = 12;

/** A claim from Munim's draft design strategy. `evidence`: what research or data says about it. `valued`: that
 *  evidence shows customers choose or stay for it. `copyMonths`: how long a funded rival would need to match it.
 *  `fits`: it serves the businesses Munim has chosen (small firms outside the metros, sold through their CAs).
 *  `source`: what makes it hard to copy, for claims that hold. */
export interface AdvantageClaim { text: string; short: string; evidence: string; valued: boolean; copyMonths: number; fits: boolean; source?: string }

/** Value first (nobody pays for what they don't value), then fit (winning the wrong customers is not winning), then
 *  how long it lasts. */
export const advantageCall = (c: AdvantageClaim): AdvantageCall =>
  !c.valued ? 'unvalued' : !c.fits ? 'offstrategy' : c.copyMonths < COPY_MONTHS ? 'copyable' : 'holds';

const CLAIMS = {
  invoiceLook: { short: 'Premium invoices', text: 'Our invoices look more premium than any rival’s', evidence: 'Shopkeepers like them; Hisaably copied the layout six weeks after launch', valued: true, copyMonths: 2, fits: true },
  gstClean: { short: 'Clean GST returns', text: 'Returns filed through Munim are rejected 70% less often, because the review screen was designed with CAs', evidence: '140 hours of sessions with CAs; rejection data from 2 lakh returns', valued: true, copyMonths: 18, fits: true, source: 'Research and return data a rival doesn’t have' },
  caView: { short: 'The CA’s view', text: '4,000 CAs close their clients’ books in Munim’s accountant view', evidence: '38% of new customers come through a CA who already uses it', valued: true, copyMonths: 30, fits: true, source: 'A network: every CA brings clients, every client keeps the CA' },
  offline: { short: 'Works offline', text: 'Billing works on patchy 4G and syncs later without duplicate invoices', evidence: 'Top reason given in 120 switching interviews in Nashik and Kolhapur', valued: true, copyMonths: 14, fits: true, source: 'Years of sync and conflict design, hard to rebuild' },
  languages: { short: 'Three languages', text: 'Every screen is in Marathi, Hindi and Gujarati, written by native speakers', evidence: 'Valued in Surat and Nashik; a rival with a budget can hire the same writers', valued: true, copyMonths: 8, fits: true },
  templates: { short: '40 templates', text: '40 invoice templates, more than any rival', evidence: '92% of invoices use one of three templates', valued: true, copyMonths: 1, fits: true },
  animations: { short: 'Smooth animations', text: 'The smoothest onboarding animations in the category', evidence: 'Not mentioned once in 120 switching interviews', valued: false, copyMonths: 3, fits: true },
  awards: { short: 'Design awards', text: 'Three international design awards last year', evidence: 'No customer or CA has asked about them', valued: false, copyMonths: 12, fits: true },
  illustrations: { short: 'Illustrations', text: 'A custom illustration on every empty screen', evidence: 'No change in activation when they were tested against plain text', valued: false, copyMonths: 4, fits: true },
  enterprise: { short: 'Enterprise look', text: 'A design language that wins finance teams at large Mumbai companies', evidence: 'Two enterprise pilots liked it; Munim sells to firms with under 50 staff', valued: true, copyMonths: 12, fits: false },
  genz: { short: 'Gen Z brand', text: 'A playful look for Gen Z founders of online brands', evidence: 'Popular on Instagram; those founders bill through Shopify, not Munim', valued: true, copyMonths: 6, fits: false },
  usTax: { short: 'US sales tax', text: 'Screens ready for US sales tax, for when we go abroad', evidence: 'Asked for by three exporters; no plan to sell in the US for three years', valued: true, copyMonths: 9, fits: false },
} as const satisfies Record<string, AdvantageClaim>;
export type MunimClaim = keyof typeof CLAIMS;
export const MUNIM_CLAIMS: Record<MunimClaim, AdvantageClaim> = CLAIMS;

/** Rumelt's kernel of a strategy, and Munim's design strategy written to it. */
export const STRATEGY_KERNEL = [
  { part: 'Diagnosis', text: 'Rivals copy our screens in weeks, but not how well we know CAs and small shops.' },
  { part: 'Guiding policy', text: 'Design for the CA and the shop together, and make every return right first time.' },
  { part: 'Coherent actions', text: 'Research with CAs every month, one design system across three products, offline first.' },
] as const;

// ── Bets & portfolio thinking (st.4-2, `bet-book`) ───────────────────────────────────────────────────────────────

/** What to do with a design bet (`bet-book` lanes). `fund`: worth it even on the cautious estimate. `probe`: worth it
 *  only if the hopeful estimate is right, so buy a small test before the big spend. `kill`: not worth it even if
 *  everything goes well. */
export const BET_CALLS = ['fund', 'probe', 'kill'] as const;
export type BetCall = (typeof BET_CALLS)[number];

/** How far a bet is from what Munim does today: improve the core, step into an adjacent need, or try something new. */
export const BET_HORIZONS = ['core', 'adjacent', 'new'] as const;
export type BetHorizon = (typeof BET_HORIZONS)[number];
export const BET_HORIZON_LABEL: Record<BetHorizon, string> = { core: 'Core', adjacent: 'Adjacent', new: 'New' };
/** The split many companies aim for across the three (Nagji and Tuff, 2012), as shares of the spend. */
export const BET_MIX_GUIDE: Record<BetHorizon, number> = { core: 0.7, adjacent: 0.2, new: 0.1 };

/** This year's design budget for bets, in lakh rupees (₹3 crore). */
export const MUNIM_BUDGET = 300;

/** A design bet. Money in lakh rupees. `cost`: to build it fully. `payoff`: the gain in a year if it works (margin
 *  from new and kept customers, or engineering time saved). `chance`: the cautious and the hopeful estimate that it
 *  works. `probe`: a small test that narrows the chance, and `probeCost` what it costs. */
export interface DesignBet {
  text: string; short: string; horizon: BetHorizon; cost: number; payoff: number;
  chance: readonly [number, number]; probe?: string; probeCost?: number;
}

/** Expected value at a given chance: chance × payoff − cost. */
export const betValue = (b: DesignBet, chance: number) => Math.round(chance * b.payoff - b.cost);
/** Expected value on the cautious and the hopeful estimate. */
export const betRange = (b: DesignBet) => [betValue(b, b.chance[0]), betValue(b, b.chance[1])] as const;
export const betCall = (b: DesignBet): BetCall => {
  const [low, high] = betRange(b);
  return low >= 0 ? 'fund' : high < 0 ? 'kill' : 'probe';
};
/** What a call commits this year: the full cost to fund, the test to probe, nothing to kill. */
export const betSpend = (b: DesignBet) => { const c = betCall(b); return c === 'fund' ? b.cost : c === 'probe' ? b.probeCost ?? 0 : 0; };

const BETS = {
  gstReview: { short: 'GST review', text: 'Redesign the GST return review so errors are caught before filing', horizon: 'core', cost: 40, payoff: 180, chance: [0.6, 0.8] },
  system: { short: 'Design system', text: 'Tokens and 30 core components shared by Books, Pay and Stock', horizon: 'core', cost: 80, payoff: 200, chance: [0.7, 0.9] },
  whatsapp: { short: 'WhatsApp invoices', text: 'Send invoices with a payment link on WhatsApp', horizon: 'adjacent', cost: 20, payoff: 120, chance: [0.5, 0.8] },
  caInvite: { short: 'Invite your CA', text: 'A flow for shop owners to invite their CA into Munim', horizon: 'adjacent', cost: 30, payoff: 150, chance: [0.15, 0.6], probe: 'A fake-door invite button for 4 weeks', probeCost: 5 },
  scan: { short: 'Barcode scan', text: 'Barcode scanning with the phone camera for stock counts', horizon: 'adjacent', cost: 25, payoff: 90, chance: [0.2, 0.5], probe: 'Ten shops count stock with a prototype for two weeks', probeCost: 4 },
  voice: { short: 'Voice invoices', text: 'Make invoices by speaking Marathi or Hindi', horizon: 'new', cost: 60, payoff: 400, chance: [0.05, 0.3], probe: 'A Wizard of Oz test: 20 shops speak, a person types', probeCost: 8 },
  forecast: { short: 'Cash forecast', text: 'An AI forecast of next month’s cash flow', horizon: 'new', cost: 70, payoff: 350, chance: [0.1, 0.4], probe: 'Forecasts made by hand for 30 businesses, checked a month later', probeCost: 10 },
  darkMode: { short: 'Dark mode', text: 'Dark mode across all three apps', horizon: 'core', cost: 25, payoff: 10, chance: [0.5, 0.9] },
  rebrand: { short: 'Rebrand', text: 'A full rebrand with a new logo and name for each product', horizon: 'core', cost: 90, payoff: 60, chance: [0.4, 0.8] },
  dash3d: { short: '3D dashboard', text: 'An animated 3D dashboard on the home screen', horizon: 'new', cost: 35, payoff: 20, chance: [0.3, 0.6] },
} as const satisfies Record<string, DesignBet>;
export type MunimBet = keyof typeof BETS;
export const MUNIM_BETS: Record<MunimBet, DesignBet> = BETS;

/** How a set of bets spends across the horizons, as shares of the total spend (zero everywhere when nothing is spent). */
export const portfolioMix = (bets: readonly DesignBet[]): Record<BetHorizon, number> => {
  const spend = (h: BetHorizon) => bets.filter(b => b.horizon === h).reduce((s, b) => s + betSpend(b), 0);
  const total = BET_HORIZONS.reduce((s, h) => s + spend(h), 0);
  return Object.fromEntries(BET_HORIZONS.map(h => [h, total ? spend(h) / total : 0])) as Record<BetHorizon, number>;
};

// ── Platform vs. product (st.4-3, `layer-pick`) ──────────────────────────────────────────────────────────────────

/** Where a capability should be built (`layer-pick` lanes). `platform`: once, shared by every product, now.
 *  `harvest`: let the products build it, then extract it once it has settled. `product`: inside the one product that
 *  needs it. `buy`: from a vendor or the phone's own system. */
export const PLATFORM_CALLS = ['platform', 'harvest', 'product', 'buy'] as const;
export type PlatformCall = (typeof PLATFORM_CALLS)[number];

/** Munim's products, in the order the game and scene draw them. */
export const MUNIM_PRODUCTS = ['books', 'pay', 'stock'] as const;
export type MunimProduct = (typeof MUNIM_PRODUCTS)[number];
export const MUNIM_PRODUCT_LABEL: Record<MunimProduct, string> = { books: 'Books', pay: 'Pay', stock: 'Stock' };

/** The rule of three: build a shared version once this many products need the same thing. */
export const RULE_OF_THREE = 3;

/** A capability Munim's products need. `products`: which need it. `settled`: what it must do is understood and
 *  stable. `commodity`: a vendor or the operating system already does it well. `differentiating`: it is part of why
 *  customers choose Munim. */
export interface Capability {
  text: string; short: string; products: readonly MunimProduct[];
  settled: boolean; commodity: boolean; differentiating: boolean;
}

/** Buy a commodity unless it is where you win; share what three products need once it has settled; let a need
 *  shared by fewer products, or still changing, prove itself in the products first; keep the rest in its product. */
export const platformCall = (c: Capability): PlatformCall =>
  c.commodity && !c.differentiating ? 'buy'
    : c.products.length >= RULE_OF_THREE && c.settled ? 'platform'
      : c.products.length >= 2 ? 'harvest' : 'product';

const CAPABILITIES = {
  signIn: { short: 'One sign-in', text: 'One Munim sign-in and business profile across Books, Pay and Stock', products: ['books', 'pay', 'stock'], settled: true, commodity: false, differentiating: false },
  gstInvoice: { short: 'GST invoice', text: 'The GST invoice: its layout, tax lines and e-invoice number', products: ['books', 'pay', 'stock'], settled: true, commodity: false, differentiating: true },
  fields: { short: 'Form fields', text: 'Date pickers, amount fields and the other form controls', products: ['books', 'pay', 'stock'], settled: true, commodity: false, differentiating: false },
  payLink: { short: 'Payment link', text: 'The payment link and UPI collect screen', products: ['pay', 'books'], settled: true, commodity: false, differentiating: true },
  alerts: { short: 'Alert settings', text: 'Settings for which alerts go by WhatsApp, SMS or email', products: ['books', 'pay', 'stock'], settled: false, commodity: false, differentiating: false },
  firstRun: { short: 'First-run setup', text: 'First-run setup: business details, GSTIN and logo', products: ['books', 'pay', 'stock'], settled: false, commodity: false, differentiating: false },
  barcode: { short: 'Barcode count', text: 'Counting stock by scanning barcodes', products: ['stock'], settled: false, commodity: false, differentiating: true },
  forecast: { short: 'Cash forecast', text: 'The AI cash-flow forecast experiment', products: ['books'], settled: false, commodity: false, differentiating: true },
  reorder: { short: 'Reorder report', text: 'The low-stock reorder report', products: ['stock'], settled: true, commodity: false, differentiating: false },
  otp: { short: 'OTP messages', text: 'Sending one-time passwords by SMS', products: ['books', 'pay', 'stock'], settled: true, commodity: true, differentiating: false },
  maps: { short: 'Maps', text: 'Maps and address search for delivery addresses', products: ['stock'], settled: true, commodity: true, differentiating: false },
  helpChat: { short: 'Help chat', text: 'The in-app support chat window', products: ['books', 'pay', 'stock'], settled: true, commodity: true, differentiating: false },
} as const satisfies Record<string, Capability>;
export type MunimCapability = keyof typeof CAPABILITIES;
export const MUNIM_CAPABILITIES: Record<MunimCapability, Capability> = CAPABILITIES;
