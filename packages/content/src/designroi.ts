// Design ROI at Raahi, for chapter bz.4. Raahi sells intercity bus tickets across South and West India: about 2 crore
// searches, 60 lakh seat selections and 18 lakh bookings a year, from 8 lakh customers. It keeps a commission on each
// ticket; after payment fees and cashback that leaves ₹60 contribution per booking. Aparna Iyengar leads design, Sameer
// Batra is the CFO. Nikhil Varghese runs Kolam, a four-person design studio in Kochi that has worked for Raahi. This is
// the data the bz.4 scenes and games draw, and the rules they score against: what a claimed design impact is worth a
// year, what a line of a business case needs before a CFO will believe it, and how a studio should price (or turn
// down) a piece of work.
import { inr } from './episode';

/** Money for people, Indian style: ₹1.08 crore, ₹34.2 lakh, ₹9,500. One decimal for lakh, two for crore. */
export const inrScale = (n: number) => {
  const a = Math.abs(n), sign = n < 0 ? '−' : '';
  const trim = (s: string) => s.replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
  if (a >= 1e7) return `${sign}₹${trim((a / 1e7).toFixed(2))} crore`;
  if (a >= 1e5) return `${sign}₹${trim((a / 1e5).toFixed(1))} lakh`;
  return inr(n);
};

/** Raahi's contribution per booking, in ₹: commission less payment fees and cashback. Not the ticket price (₹900). */
export const RAAHI_CONTRIBUTION = 60;
/** Raahi's average ticket, in ₹. What a booking costs the rider, not what Raahi keeps. */
export const RAAHI_TICKET = 900;
/** What one support contact costs Raahi, in ₹ (agent time, telephony, the tools). */
export const RAAHI_CONTACT_COST = 95;

// ── Quantifying design impact (bz.4-1, `value-size`) ──────────────────────────────────────────────────────────────

/** How big a claimed impact is, a year (`value-size` lanes). `small`: under ₹10 lakh. `mid`: ₹10 lakh to ₹1 crore.
 *  `big`: ₹1 crore or more. `unproven`: it can't be counted yet, because nothing shows design caused it or it isn't
 *  linked to money. */
export const IMPACT_BANDS = ['small', 'mid', 'big', 'unproven'] as const;
export type ImpactBand = (typeof IMPACT_BANDS)[number];
/** Band edges, in ₹ a year: ₹10 lakh and ₹1 crore. */
export const BAND_EDGES = { mid: 1_000_000, big: 10_000_000 } as const;

/** A claimed design impact. Its yearly value is `volume` (things a year, in `per`) × `change` (the absolute change
 *  each, against a control) × `unitValue` (₹ each, contribution or cost, never revenue) × `realise` (the share that
 *  becomes money: 1 for money, about half for time saved). `controlled`: a holdout or A/B test shows design caused
 *  it. `money`: it is linked to money at all. */
export interface ImpactClaim {
  text: string; short: string; source: string; per: string;
  volume: number; change: number; unitValue: number; realise: number;
  controlled: boolean; money: boolean;
}

/** Yearly value of a claim, in whole ₹. */
export const impactValue = (c: ImpactClaim) => Math.round(c.volume * c.change * c.unitValue * c.realise);
export const impactBand = (c: ImpactClaim): ImpactBand => {
  if (!c.controlled || !c.money) return 'unproven';
  const v = impactValue(c);
  return v >= BAND_EDGES.big ? 'big' : v >= BAND_EDGES.mid ? 'mid' : 'small';
};

const IMPACTS = {
  checkout: { short: 'Checkout', per: 'seat selections', source: 'Four-week A/B test, 50:50 split', text: 'The new checkout lifted seat-to-payment conversion from 30% to 33% in an A/B test, on 60 lakh seat selections a year.', volume: 6_000_000, change: 0.03, unitValue: RAAHI_CONTRIBUTION, realise: 1, controlled: true, money: true },
  rebook: { short: 'One-tap rebook', per: 'customers', source: '10% holdout for six months', text: 'One-tap rebook for a past route: against a 10% holdout, each of 8 lakh customers booked 0.25 more trips a year.', volume: 800_000, change: 0.25, unitValue: RAAHI_CONTRIBUTION, realise: 1, controlled: true, money: true },
  cancel: { short: 'Self-serve cancel', per: 'bookings', source: 'Rolled out city by city; late cities as control', text: 'Self-serve cancellation cut calls from 8 to 2 per 100 bookings, on 18 lakh bookings, at ₹95 a call.', volume: 1_800_000, change: 0.06, unitValue: RAAHI_CONTACT_COST, realise: 1, controlled: true, money: true },
  refund: { short: 'Refund tracker', per: 'bookings', source: 'A/B test on the refund screen', text: 'A refund tracker cut “where is my refund” contacts from 3 to 1 per 100 bookings, on 18 lakh bookings, at ₹95 each.', volume: 1_800_000, change: 0.02, unitValue: RAAHI_CONTACT_COST, realise: 1, controlled: true, money: true },
  boarding: { short: 'Boarding photos', per: 'bookings', source: 'A/B test on the ticket screen', text: 'Photos of each boarding point cut missed buses from 0.5% to 0.2% of 18 lakh bookings. Raahi refunds a missed bus in full, ₹900.', volume: 1_800_000, change: 0.003, unitValue: RAAHI_TICKET, realise: 1, controlled: true, money: true },
  console: { short: 'Agent console', per: 'contacts', source: 'Timed on 2,000 contacts, old console against new', text: 'The new agent console saves 1.5 minutes on each of 6 lakh contacts a year. An agent hour costs ₹400; about half the freed time becomes fewer hires.', volume: 600_000, change: 1.5 / 60, unitValue: 400, realise: 0.5, controlled: true, money: true },
  filters: { short: 'AC filter', per: 'seat selections', source: 'A/B test on search results', text: 'An AC / sleeper filter lifted seat-to-payment conversion by 0.2 points, on 60 lakh seat selections.', volume: 6_000_000, change: 0.002, unitValue: RAAHI_CONTRIBUTION, realise: 1, controlled: true, money: true },
  invoice: { short: 'GST invoices', per: 'emails', source: 'Support tags, compared with last year', text: 'A GST invoice download for business travellers ended 9,000 emails a year asking for invoices, at ₹95 each.', volume: 9_000, change: 1, unitValue: RAAHI_CONTACT_COST, realise: 1, controlled: true, money: true },
  system: { short: 'Design system', per: 'designer hours', source: 'Five designers’ timesheets, six weeks before and after', text: 'The design system saves each of 5 designers 6 hours a week, 46 weeks a year: 1,380 hours at ₹1,200 an hour, about half of it realised.', volume: 1_380, change: 1, unitValue: 1_200, realise: 0.5, controlled: true, money: true },
  diwali: { short: 'Diwali month', per: 'bookings', source: 'This October against September', text: 'Bookings rose 40% in the month after the new home screen launched. It launched on 1 October, the start of the Diwali rush.', volume: 150_000, change: 0.4, unitValue: RAAHI_CONTRIBUTION, realise: 1, controlled: false, money: true },
  rating: { short: 'Store rating', per: '', source: 'Play Store, before and after', text: 'The app’s Play Store rating rose from 4.1 to 4.5 after the redesign.', volume: 0, change: 0, unitValue: 0, realise: 1, controlled: false, money: false },
  survey: { short: 'Survey', per: '', source: 'In-app survey, 1,200 replies', text: '73% of riders in an in-app survey said the new checkout is easier to use.', volume: 0, change: 0, unitValue: 0, realise: 1, controlled: false, money: false },
} as const satisfies Record<string, ImpactClaim>;
export type RaahiImpact = keyof typeof IMPACTS;
export const RAAHI_IMPACTS: Record<RaahiImpact, ImpactClaim> = IMPACTS;

// ── Writing a business case (bz.4-2, `case-edit`) ─────────────────────────────────────────────────────────────────

/** What a line of a business case needs (`case-edit` lanes). `keep`: it is ready for the CFO. `money`: it reports
 *  activity, taste or a score, not money or a business outcome. `range`: one confident number, or more credit than
 *  design earned. `cost`: costs are missing or understated. */
export const CASE_FIXES = ['keep', 'money', 'range', 'cost'] as const;
export type CaseFix = (typeof CASE_FIXES)[number];

/** A line of Aparna's business case. `part`: the section it sits in. `money`: a benefit stated as money or a
 *  business outcome. `honest`: a benefit with a range and its assumption, crediting design only with what it caused.
 *  `complete`: a cost line that counts building, running and what waits. `fixed`: the line as it should read. */
export interface CaseLine {
  text: string; short: string; fixed: string; part: 'ask' | 'benefit' | 'cost';
  money?: boolean; honest?: boolean; complete?: boolean;
}

/** Benefits must be money first, then honest about it; costs must be complete. Everything else is ready. */
export const caseFix = (l: CaseLine): CaseFix => {
  if (l.part === 'benefit') return !l.money ? 'money' : !l.honest ? 'range' : 'keep';
  if (l.part === 'cost') return !l.complete ? 'cost' : 'keep';
  return 'keep';
};

/** One driver of benefit in the trip redesign: yearly `volume` × `change` × ₹ `unitValue`, with the change at its
 *  low, base and high case. */
export interface CaseDriver { label: string; volume: number; unitValue: number; change: readonly [number, number, number]; basis: string }
export const SCENARIOS = ['low', 'base', 'high'] as const;
export type Scenario = (typeof SCENARIOS)[number];

/** The trip redesign Aparna is asking for: live bus tracking, boarding point and refunds, rebuilt. */
export const TRIP_DRIVERS: readonly CaseDriver[] = [
  { label: '“Where is my bus” calls', volume: 1_800_000, unitValue: RAAHI_CONTACT_COST, change: [0.02, 0.03, 0.04], basis: '6 per 100 bookings today; 2 in the Pune pilot' },
  { label: 'Missed-bus refunds', volume: 1_800_000, unitValue: RAAHI_TICKET, change: [0.001, 0.0025, 0.003], basis: '0.5% of bookings today; 0.2% in the pilot' },
  { label: 'Repeat trips', volume: 800_000, unitValue: RAAHI_CONTRIBUTION, change: [0.04, 0.08, 0.12], basis: 'Pilot riders who tracked their bus rebooked more' },
];
/** What the redesign costs: six people for six months to build, and maps and GPS feeds to run. */
export const TRIP_COST = { build: 9_000_000, runYear: 1_200_000 } as const;

/** One driver's yearly benefit in a scenario, in whole ₹. */
export const driverValue = (d: CaseDriver, s: Scenario) => Math.round(d.volume * d.change[SCENARIOS.indexOf(s)] * d.unitValue);
/** Total yearly benefit in a scenario, in whole ₹. */
export const scenarioBenefit = (drivers: readonly CaseDriver[], s: Scenario) => drivers.reduce((sum, d) => sum + driverValue(d, s), 0);

/** First-year returns. `cost`: build plus a year of running. `net`: benefit − cost. `roi`: net ÷ cost, in whole %.
 *  `payback`: months until the monthly net benefit (benefit − running, ÷ 12) has repaid the build, to one decimal;
 *  null if running costs eat the benefit. */
export const caseReturns = (benefit: number, cost: { build: number; runYear: number }) => {
  const total = cost.build + cost.runYear, net = benefit - total, monthly = (benefit - cost.runYear) / 12;
  return {
    cost: total, net, roi: Math.round((net / total) * 100),
    payback: monthly > 0 ? Math.round((cost.build / monthly) * 10) / 10 : null,
  };
};

const lowB = inrScale(scenarioBenefit(TRIP_DRIVERS, 'low')), highB = inrScale(scenarioBenefit(TRIP_DRIVERS, 'high'));
const baseB = inrScale(scenarioBenefit(TRIP_DRIVERS, 'base'));
const r = (s: Scenario) => caseReturns(scenarioBenefit(TRIP_DRIVERS, s), TRIP_COST);
const range = (i: number) => `${inrScale(driverValue(TRIP_DRIVERS[i], 'low'))} to ${inrScale(driverValue(TRIP_DRIVERS[i], 'high'))}`;

const LINES = {
  ask: { part: 'ask', short: 'The ask', text: 'Fund six people for six months, ₹90 lakh, to rebuild the trip screens riders use between booking and boarding.', fixed: 'Fund six people for six months, ₹90 lakh, to rebuild the trip screens riders use between booking and boarding.' },
  calls: { part: 'benefit', short: 'Fewer calls', money: true, honest: true, text: `Fewer “where is my bus” calls: 6 per 100 bookings today, 2 in the Pune pilot with live tracking. At ₹95 a call, ${range(0)} a year.`, fixed: `Fewer “where is my bus” calls: 6 per 100 bookings today, 2 in the Pune pilot with live tracking. At ₹95 a call, ${range(0)} a year.` },
  costs: { part: 'cost', short: 'Full costs', complete: true, text: 'Costs: ₹90 lakh to build, ₹12 lakh a year for maps and GPS feeds, and the seat-map refresh waits until next year.', fixed: 'Costs: ₹90 lakh to build, ₹12 lakh a year for maps and GPS feeds, and the seat-map refresh waits until next year.' },
  sessions: { part: 'benefit', short: '40 sessions', money: false, text: 'We will run 40 usability sessions and ship 28 new screens.', fixed: 'Riders will find their bus without calling: we will measure calls per 100 bookings, from 6 today to between 2 and 4.' },
  delight: { part: 'benefit', short: '“Delightful”', money: false, text: 'The trip screens will get a modern, delightful look in line with the new brand.', fixed: 'Riders will find their boarding point first time: we will measure missed buses per 1,000 bookings, 5 today, and aim for 2 to 4.' },
  nps: { part: 'benefit', short: 'NPS +10', money: false, text: 'NPS should rise by 10 points.', fixed: `More repeat trips: pilot riders who tracked their bus rebooked 0.04 to 0.12 more times a year, at ₹60 each: ${range(2)}.` },
  refunds: { part: 'benefit', short: '−80% refunds', money: true, honest: false, text: 'Missed-bus refunds will fall by 80%, saving ₹65 lakh a year.', fixed: `The 80% was one city in the monsoon, when fewer people travel. Across the network, plan on a 20% to 60% fall: ${range(1)} a year.` },
  total: { part: 'benefit', short: 'One total', money: true, honest: false, text: `Total benefit: ${baseB} a year.`, fixed: `Total benefit: ${lowB} to ${highB} a year; ${baseB} if the pilot holds across the network.` },
  credit: { part: 'benefit', short: 'All the credit', money: true, honest: false, text: 'Bookings rose 22% after last year’s checkout redesign, all of it thanks to design.', fixed: 'Last year’s checkout test added 3 points against a holdout, about ₹1.08 crore a year. The rest of the 22% was the monsoon sale.' },
  build: { part: 'cost', short: '“₹90 lakh”', complete: false, text: 'Cost: ₹90 lakh.', fixed: 'Cost: ₹90 lakh to build and ₹12 lakh a year to run; the first year costs ₹1.02 crore.' },
  eng: { part: 'cost', short: 'Engineering?', complete: false, text: 'Engineering effort is out of scope for this document.', fixed: 'The six people are two designers, three engineers and a product manager. Their seat-map work moves to next year, which costs about ₹20 lakh in delayed conversion.' },
  payback: { part: 'cost', short: 'Payback', complete: false, text: 'Payback: under 6 months, counting design time only.', fixed: `Payback: ${r('base').payback} months in the base case, counting building and running; ${r('low').payback} months if the low case holds.` },
} as const satisfies Record<string, CaseLine>;
export type RaahiCaseLine = keyof typeof LINES;
export const RAAHI_CASE: Record<RaahiCaseLine, CaseLine> = LINES;

/** The options a business case compares, with what each does to calls a year at today's growth (bookings up 20% a
 *  year). Doing nothing is an option with a cost. */
export const TRIP_OPTIONS = [
  { id: 'nothing', label: 'Do nothing', cost: 0, note: 'Calls grow with bookings, 20% a year' },
  { id: 'patch', label: 'Add tracking to today’s screens', cost: 2_500_000, note: 'Half the call drop; no boarding photos' },
  { id: 'redesign', label: 'Rebuild the trip screens', cost: TRIP_COST.build, note: 'The pilot, across the network' },
] as const;

// ── Freelance & agency business (bz.4-3, `engage-sort`) ──────────────────────────────────────────────────────────

/** How Kolam should take on a piece of work (`engage-sort` lanes). `fixed`: a fixed fee, because the scope is clear
 *  and won't move. `retainer`: a monthly fee for a steady stream of work. `time`: time and materials, or a paid
 *  discovery first, because nobody can say yet what the work is. `decline`: unpaid pitch work, or a rate below what
 *  the studio costs to run. */
export const ENGAGE_CALLS = ['fixed', 'retainer', 'time', 'decline'] as const;
export type EngageCall = (typeof ENGAGE_CALLS)[number];

/** Kolam's year: four people, what they cost, and the share of working days that can be billed. */
export const KOLAM = { people: 4, salaries: 6_000_000, overheads: 1_200_000, workingDays: 220, utilisation: 0.6, margin: 0.2 } as const;
export type Studio = { people: number; salaries: number; overheads: number; workingDays: number; utilisation: number; margin: number };

/** Days a year the studio can bill: people × working days × utilisation. */
export const billableDays = (s: Studio) => Math.round(s.people * s.workingDays * s.utilisation);
/** The day rate below which the studio loses money: costs ÷ billable days, to the nearest ₹100. */
export const floorRate = (s: Studio) => Math.round((s.salaries + s.overheads) / billableDays(s) / 100) * 100;
/** The day rate that pays costs and leaves the target margin on fees: costs ÷ (1 − margin) ÷ billable days, to the
 *  nearest ₹500. */
export const targetRate = (s: Studio) => Math.round((s.salaries + s.overheads) / (1 - s.margin) / billableDays(s) / 500) * 500;

/** A piece of work Kolam has been offered. `fee` for `days` of work (per month for ongoing work). `ongoing`: a steady
 *  stream, not a project. `clear`: the scope is agreed and stable. `spec`: unpaid work to win work. */
export interface Enquiry { text: string; short: string; client: string; fee: number; days: number; ongoing: boolean; clear: boolean; spec: boolean }

/** What the work pays per day, in whole ₹. */
export const effectiveRate = (e: Enquiry) => (e.days > 0 ? Math.round(e.fee / e.days) : 0);
/** Turn down spec work and anything below the floor; then ongoing work is a retainer, a clear one-off a fixed fee,
 *  and an unclear one time and materials. */
export const engageCall = (e: Enquiry, s: Studio = KOLAM): EngageCall =>
  e.spec || effectiveRate(e) < floorRate(s) ? 'decline' : e.ongoing ? 'retainer' : e.clear ? 'fixed' : 'time';

const ENQUIRIES = {
  audit: { short: 'Store audit', client: 'Textile brand, Coimbatore', text: 'A UX audit of a textile brand’s Shopify store: 20 screens, a written report and a walkthrough.', fee: 240_000, days: 12, ongoing: false, clear: true, spec: false },
  seats: { short: 'Raahi seat flow', client: 'Raahi, Bengaluru', text: 'Raahi’s operator app: redesign the nine screens of the seat-layout flow from a spec both sides signed.', fee: 420_000, days: 24, ongoing: false, clear: true, spec: false },
  clinic: { short: 'Clinic launch', client: 'Ayurveda clinic, Kochi', text: 'A landing page and three ad sizes for a clinic’s new branch, copy supplied.', fee: 110_000, days: 6, ongoing: false, clear: true, spec: false },
  lender: { short: 'Lender, monthly', client: 'Lending startup, Chennai', text: 'A designer for “whatever comes up” each month, about 8 days of work, ₹1,60,000 a month.', fee: 160_000, days: 8, ongoing: true, clear: false, spec: false },
  hospital: { short: 'Hospital system', client: 'Hospital chain, Kerala', text: 'Keep a hospital chain’s design system up to date and review new screens: 4 days a month, ₹72,000 a month.', fee: 72_000, days: 4, ongoing: true, clear: true, spec: false },
  ngo: { short: 'NGO, monthly', client: 'Education NGO, Madurai', text: 'Two days a month of design help for a volunteer app, ₹28,000 a month.', fee: 28_000, days: 2, ongoing: true, clear: true, spec: false },
  tailors: { short: '“Uber for tailors”', client: 'First-time founder, Kochi', text: 'A founder with an idea for “Uber for tailors” wants one fixed price for the whole app. No research, no spec.', fee: 600_000, days: 30, ongoing: false, clear: false, spec: false },
  claims: { short: 'Claims journey', client: 'Health insurer, Mumbai', text: 'An insurer wants its claims journey “fixed” but can’t say which part is broken. ₹18,000 a day, 10 days to start.', fee: 180_000, days: 10, ongoing: false, clear: false, spec: false },
  rescue: { short: 'App rescue', client: 'D2C brand, Hyderabad', text: 'Finish a half-built app another agency left. Nobody knows how much is left. ₹5,00,000 for an estimated 25 days.', fee: 500_000, days: 25, ongoing: false, clear: false, spec: false },
  pitch: { short: 'Bank pitch', client: 'Private bank, Mumbai', text: 'A bank invites five studios to pitch, each with designs for its new home screen. Unpaid, about 5 days’ work.', fee: 0, days: 5, ongoing: false, clear: true, spec: true },
  cafe: { short: 'Café chain', client: 'Café chain, Kochi', text: 'A logo, a website and an ordering app for a café chain: ₹1,50,000 fixed, about 18 days of work.', fee: 150_000, days: 18, ongoing: false, clear: true, spec: false },
  equity: { short: 'Equity only', client: 'Pre-seed startup, Bengaluru', text: 'A startup offers 0.5% equity instead of fees for three months of design, about 60 days of work.', fee: 0, days: 60, ongoing: false, clear: true, spec: false },
} as const satisfies Record<string, Enquiry>;
export type KolamEnquiry = keyof typeof ENQUIRIES;
export const KOLAM_ENQUIRIES: Record<KolamEnquiry, Enquiry> = ENQUIRIES;
