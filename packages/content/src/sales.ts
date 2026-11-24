// Parcha's sales kit, for chapter bz.3. Parcha is clinic software for Indian clinics: appointments, WhatsApp
// reminders, e-prescriptions and GST billing, sold per doctor per month. Aditi Rao, its product designer, works with
// Karan Malhotra (account executive) on the demo for Sunrise Clinics, a chain of 12 clinics in Pune, redesigns the
// pricing page, and sets up a loop with Lakshmi Pillai (head of customer success). This is the data the bz.3 scenes
// and games draw, and the rules they score against: a demo built on the buyer's problems, a pricing page each buyer
// can place themselves on, and customer signals routed to whoever can act on them.

// ── The demo (bz.3-1, `demo-build`) ───────────────────────────────────────────────────────────────────────────────

/** What Sunrise said hurts, in the order they ranked it on the discovery call. */
export const DEMO_PAINS = ['noshow', 'queue', 'rx'] as const;
export type DemoPain = (typeof DEMO_PAINS)[number];
export const PAIN_NAME: Record<DemoPain, string> = { noshow: '18% no-shows', queue: '25-minute billing queue', rx: 'Prescriptions typed twice' };
/** The demo's share of a 45-minute call: the rest is for their questions and agreeing the next step. */
export const DEMO_MINUTES = 20;
/** `open` recaps what the buyer said; `pain` shows the product answering one of their problems; `tour` shows
 *  something nobody asked about; `close` proposes the next step. */
export type MomentKind = 'open' | 'pain' | 'tour' | 'close';
/** One moment of a demo. `dummy`: it runs on placeholder data ("Test Patient 1") instead of the buyer's world. */
export interface DemoMoment { text: string; kind: MomentKind; mins: number; pain?: DemoPain; dummy?: boolean }
/** What a demo can get wrong, in the order the checks run. */
export const DEMO_FLAWS = ['long', 'gap', 'tour', 'dummy', 'noclose'] as const;
export type DemoFlaw = (typeof DEMO_FLAWS)[number];

export const demoLength = (ms: readonly DemoMoment[]) => ms.reduce((s, m) => s + m.mins, 0);
/** The buyer's pains a demo never shows being solved (on real data). */
export const demoGaps = (ms: readonly DemoMoment[]) => DEMO_PAINS.filter(p => !ms.some(m => m.kind === 'pain' && m.pain === p && !m.dummy));
/** Every flaw in a demo: over time, a pain left unanswered, a feature tour, placeholder data, and no next step. */
export const demoFlaws = (ms: readonly DemoMoment[]): DemoFlaw[] => [
  ...(demoLength(ms) > DEMO_MINUTES ? ['long' as const] : []),
  ...(demoGaps(ms).length ? ['gap' as const] : []),
  ...(ms.some(m => m.kind === 'tour') ? ['tour' as const] : []),
  ...(ms.some(m => m.dummy) ? ['dummy' as const] : []),
  ...(!ms.some(m => m.kind === 'close') ? ['noclose' as const] : []),
];
const momentRank = (m: DemoMoment) => (m.kind === 'open' ? 0 : m.kind === 'close' ? 9 : m.kind === 'tour' ? 8 : 1 + DEMO_PAINS.indexOf(m.pain!));
/** Keys in tell–show–tell order: the recap, then the pains in the buyer's ranking, any tours, and the next step last.
 *  Moments of the same rank keep their order. */
export const demoOrder = <K extends string>(keys: readonly K[], momentOf: (k: K) => DemoMoment) =>
  keys.map((k, i) => ({ k, i })).sort((a, b) => momentRank(momentOf(a.k)) - momentRank(momentOf(b.k)) || a.i - b.i).map(x => x.k);

/** Everything Aditi and Karan could put in the Sunrise demo (`demo-build` cards). */
export const SUNRISE_MOMENTS = {
  recap: { text: 'Recap what Sunrise told us: 18% of appointments are no-shows, the billing queue hits 25 minutes at 11 a.m., and staff retype every prescription.', kind: 'open', mins: 2 },
  reminders: { text: 'Asha Jadhav books Dr. Kulkarni at Sunrise Koregaon Park for Tuesday 10:30. WhatsApp reminders go out the day before and two hours before, with a one-tap reschedule.', kind: 'pain', pain: 'noshow', mins: 4 },
  billing: { text: 'When Dr. Kulkarni finishes, the bill is already at the front desk. Asha pays by UPI QR and gets her GST invoice on WhatsApp.', kind: 'pain', pain: 'queue', mins: 4 },
  rx: { text: 'Dr. Kulkarni writes the prescription on a tablet, her usual medicines one tap away. The pharmacy counter and Asha get it at once.', kind: 'pain', pain: 'rx', mins: 4 },
  pilot: { text: 'Next step: a four-week pilot at Koregaon Park and Aundh, measuring no-shows and queue time against today.', kind: 'close', mins: 3 },
  history: { text: 'Parcha’s founding story, and a map of the 2,000 clinics that use it.', kind: 'tour', mins: 5 },
  settings: { text: 'A walk through all 14 settings tabs, from user roles to printer margins.', kind: 'tour', mins: 10 },
  inventory: { text: 'The inventory module: stock, expiry dates and purchase orders.', kind: 'tour', mins: 8 },
  dummy: { text: 'The booking flow in the demo account, with “Test Patient 1” and “Dr. ABC”.', kind: 'pain', pain: 'noshow', mins: 5, dummy: true },
  scribe: { text: 'A preview of the AI scribe the team hopes to ship next year.', kind: 'tour', mins: 4 },
} as const satisfies Record<string, DemoMoment>;
export type SunriseMoment = keyof typeof SUNRISE_MOMENTS;
/** Karan's first Sunrise demo, a tour of everything Parcha does (the bz.3-1 scene). */
export const KARAN_FIRST_DEMO: readonly SunriseMoment[] = ['history', 'settings', 'dummy', 'inventory', 'scribe'];

// ── The pricing page (bz.3-2, `plan-pick`) ────────────────────────────────────────────────────────────────────────

/** Parcha's plans, cheapest first (`plan-pick` lanes). */
export const PLAN_IDS = ['solo', 'clinic', 'chain'] as const;
export type PlanId = (typeof PLAN_IDS)[number];
export interface Plan { name: string; forWho: string; price: number | null; unit: string; doctors: number; clinics: number; features: readonly string[] }
/** The redesigned page. Solo is a flat fee; Clinic is priced per doctor (two at least); Chain is quoted. */
export const PARCHA_PLANS = {
  solo: { name: 'Solo', forWho: 'One doctor, one clinic', price: 999, unit: 'a month', doctors: 1, clinics: 1,
    features: ['Appointments and WhatsApp reminders', 'E-prescriptions', 'GST invoices'] },
  clinic: { name: 'Clinic', forWho: 'A front desk and 2–25 doctors, up to 3 clinics', price: 799, unit: 'per doctor a month', doctors: 25, clinics: 3,
    features: ['Everything in Solo', 'Shared front-desk calendar', 'UPI billing at the desk', 'No-show and revenue reports'] },
  chain: { name: 'Chain', forWho: '4 or more clinics, or SSO and API access', price: null, unit: 'quoted', doctors: Infinity, clinics: Infinity,
    features: ['Everything in Clinic', 'Single sign-on', 'API and lab integrations', 'An onboarding manager'] },
} as const satisfies Record<PlanId, Plan>;
/** Clinic bills at least this many doctors. */
export const CLINIC_MIN_DOCTORS = 2;
/** Paying yearly costs ten months: two months free. */
export const YEAR_MONTHS_PAID = 10;
/** Needs only the Chain plan covers. */
export type BuyerNeed = 'sso' | 'api';
export interface Buyer { name: string; place: string; doctors: number; clinics: number; needs?: readonly BuyerNeed[] }
/** Why a buyer lands on a plan: the line of the page that decides it. */
export type Fence = 'integration' | 'clinics' | 'doctors' | 'oneDoctor' | 'oneClinic' | 'solo';
export const FENCE_TEXT: Record<Fence, string> = {
  integration: 'SSO and API access are on Chain',
  clinics: 'Clinic covers up to 3 clinics',
  doctors: 'Clinic covers up to 25 doctors',
  oneDoctor: 'Solo is for one doctor',
  oneClinic: 'Solo is for one clinic',
  solo: 'One doctor, one clinic: Solo covers it',
};
/** The first fence a buyer meets, checked from the top plan down. */
export const fenceFor = (b: Buyer): Fence =>
  b.needs?.length ? 'integration'
    : b.clinics > PARCHA_PLANS.clinic.clinics ? 'clinics'
      : b.doctors > PARCHA_PLANS.clinic.doctors ? 'doctors'
        : b.doctors > 1 ? 'oneDoctor'
          : b.clinics > 1 ? 'oneClinic' : 'solo';
/** The cheapest plan that covers a buyer. */
export const planFor = (b: Buyer): PlanId => {
  const f = fenceFor(b);
  return f === 'integration' || f === 'clinics' || f === 'doctors' ? 'chain' : f === 'solo' ? 'solo' : 'clinic';
};
/** What a buyer pays a month on a plan, or null when it's quoted. */
export const monthlyBill = (plan: PlanId, b: Buyer): number | null =>
  plan === 'solo' ? PARCHA_PLANS.solo.price : plan === 'clinic' ? PARCHA_PLANS.clinic.price * Math.max(CLINIC_MIN_DOCTORS, b.doctors) : null;
/** The yearly price for a monthly one, and what it saves. */
export const yearly = (monthly: number) => ({ total: monthly * YEAR_MONTHS_PAID, saves: monthly * (12 - YEAR_MONTHS_PAID) });

/** Clinics, doctors and chains reading the page (`plan-pick` cards). */
export const PARCHA_BUYERS = {
  farida: { name: 'Dr. Farida Shaikh', place: 'Dentist, Nashik', doctors: 1, clinics: 1 },
  kabir: { name: 'Kabir Nair', place: 'Physiotherapist starting out, Bengaluru', doctors: 1, clinics: 1 },
  jaipur: { name: 'Dr. Mehta and Dr. Bhatt', place: 'Two GPs sharing a clinic, Jaipur', doctors: 2, clinics: 1 },
  ritu: { name: 'Dr. Ritu Rao', place: 'Skin clinic with two branches, Hyderabad', doctors: 1, clinics: 2 },
  littleSteps: { name: 'Little Steps', place: 'Children’s clinic, 3 doctors, Kochi', doctors: 3, clinics: 1 },
  drishti: { name: 'Drishti Eye Hospital', place: '9 doctors on one site, Madurai', doctors: 9, clinics: 1 },
  arogya: { name: 'Arogya Diagnostics', place: '2 centres that need their lab system connected, Lucknow', doctors: 4, clinics: 2, needs: ['api'] },
  sunrise: { name: 'Sunrise Clinics', place: '12 clinics and 38 doctors, Pune', doctors: 38, clinics: 12 },
} as const satisfies Record<string, Buyer>;
export type ParchaBuyer = keyof typeof PARCHA_BUYERS;

/** A pricing page, as the checks see it: each tier's name, who it says it's for, and its price (null: "Contact us"). */
export interface PricingPage { tiers: readonly { name: string; forWho?: string; price: number | null }[]; highlight?: string; metric?: string }
/** What a pricing page can get wrong, in the order the checks run. */
export const PRICING_FLAWS = ['choice', 'hidden', 'whofor', 'nofocus', 'metric'] as const;
export type PricingFlaw = (typeof PRICING_FLAWS)[number];
/** Most buyers can compare three or four plans at a glance; past that they stall. */
export const MAX_TIERS = 4;
/** Every flaw in a page: too many tiers, more than one tier without a price, a tier that doesn't say who it's for,
 *  no plan picked out as the usual choice, and no unit saying what the price is per. */
export const pricingFlaws = (page: PricingPage): PricingFlaw[] => [
  ...(page.tiers.length > MAX_TIERS ? ['choice' as const] : []),
  ...(page.tiers.filter(t => t.price === null).length > 1 ? ['hidden' as const] : []),
  ...(page.tiers.some(t => !t.forWho) ? ['whofor' as const] : []),
  ...(!page.tiers.some(t => t.name === page.highlight) ? ['nofocus' as const] : []),
  ...(!page.metric ? ['metric' as const] : []),
];
/** The page Aditi inherited (the bz.3-2 scene). */
export const OLD_PRICING: PricingPage = {
  tiers: [{ name: 'Basic', price: 499 }, { name: 'Standard', price: 1299 }, { name: 'Plus', price: null }, { name: 'Pro', price: null }, { name: 'Premium', price: null }, { name: 'Enterprise', price: null }],
};
/** The redesigned page. */
export const PARCHA_PRICING: PricingPage = {
  tiers: PLAN_IDS.map(id => ({ name: PARCHA_PLANS[id].name, forWho: PARCHA_PLANS[id].forWho, price: PARCHA_PLANS[id].price })),
  highlight: 'Clinic', metric: 'per doctor',
};

// ── Customer success (bz.3-3, `signal-route`) ─────────────────────────────────────────────────────────────────────

/** Where a customer signal goes (`signal-route` lanes). `fix`: the design is wrong. `guide`: it works, but people
 *  can't find or learn it. `promise`: sales said it would do something it doesn't. `roadmap`: a real gap, logged. */
export const ROUTES = ['fix', 'guide', 'promise', 'roadmap'] as const;
export type Route = (typeof ROUTES)[number];
/** Who acts on each route, and how the loop closes. */
export const ROUTE_OWNER: Record<Route, string> = {
  fix: 'Design and engineering fix it; CS tells every clinic that asked when it ships.',
  guide: 'CS writes the help article; design puts a hint where people look for it.',
  promise: 'Sales fixes the deck and the demo; CS resets the expectation with the clinic.',
  roadmap: 'Logged with the revenue behind it; product reviews the list every month.',
};
/** One theme from Lakshmi's ticket queue: last month's tickets, how many clinics raised it, and what those clinics pay a year. */
export interface Signal { text: string; from: string; tickets: number; accounts: number; arr: number; route: Route }
/** Last month's top themes (`signal-route` cards). */
export const PARCHA_SIGNALS = {
  reschedule: { text: 'Our receptionist reschedules by cancelling and rebooking: four taps each time, about 30 times a day.', from: 'Lotus Clinic, Thane', tickets: 64, accounts: 41, arr: 1_180_000, route: 'fix' },
  blank: { text: 'Patients say the reschedule link in the WhatsApp reminder opens a blank page on older Android phones.', from: 'Shree Clinic, Indore', tickets: 18, accounts: 15, arr: 410_000, route: 'fix' },
  invoice: { text: 'Where do I download last month’s GST invoices? I can’t find them anywhere.', from: 'Dr. Farida Shaikh, Nashik', tickets: 71, accounts: 22, arr: 260_000, route: 'guide' },
  timings: { text: 'How do I add a second doctor’s timings to the calendar?', from: 'Little Steps, Kochi', tickets: 23, accounts: 19, arr: 450_000, route: 'guide' },
  marathi: { text: 'We were told reminders would go out in Marathi. They only come in English and Hindi.', from: 'Sunrise Clinics, Pune', tickets: 6, accounts: 1, arr: 360_000, route: 'promise' },
  scribe: { text: 'The demo showed an AI scribe. When do we get it?', from: 'Care Plus Clinics, Nagpur', tickets: 4, accounts: 3, arr: 290_000, route: 'promise' },
  lab: { text: 'We want Thyrocare lab reports to attach to the patient file on their own.', from: 'Arogya Diagnostics, Lucknow', tickets: 9, accounts: 7, arr: 330_000, route: 'roadmap' },
  emi: { text: 'Can patients pay for a dental treatment plan in instalments?', from: 'Smile Studio, Surat', tickets: 11, accounts: 9, arr: 140_000, route: 'roadmap' },
} as const satisfies Record<string, Signal>;
export type ParchaSignal = keyof typeof PARCHA_SIGNALS;
/** Revenue a year behind each route, from the signals routed there. */
export const arrByRoute = (keys: readonly ParchaSignal[]) =>
  Object.fromEntries(ROUTES.map(r => [r, keys.filter(k => PARCHA_SIGNALS[k].route === r).reduce((s, k) => s + PARCHA_SIGNALS[k].arr, 0)])) as Record<Route, number>;
/** Signals, biggest first, by ticket count or by the revenue of the clinics raising them. */
export const rankSignals = (keys: readonly ParchaSignal[], by: 'tickets' | 'arr') =>
  [...keys].sort((a, b) => PARCHA_SIGNALS[b][by] - PARCHA_SIGNALS[a][by]);
/** Clinics to tell when a route's work is done: the loop closes with everyone who asked. */
export const loopAccounts = (keys: readonly ParchaSignal[], route: Route) =>
  keys.filter(k => PARCHA_SIGNALS[k].route === route).reduce((s, k) => s + PARCHA_SIGNALS[k].accounts, 0);
/** Reschedule tickets a month, before and after the one-tap reschedule shipped (the bz.3-3 scene). */
export const RESCHEDULE_TICKETS = { before: 64, after: 9 } as const;
/** "₹11.8 lakh" for 1,180,000. */
export const lakh = (n: number) => `₹${(n / 100_000).toFixed(1)} lakh`;
