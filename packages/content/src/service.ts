// Nabz's service, for chapter ia.5. Nabz collects blood samples at home across Hyderabad and Pune: book a test in the
// app, a phlebotomist comes at 7 am while you're still fasting, the sample goes to the central lab, and the report
// arrives on WhatsApp. It also sells annual check-ups to employers through Nabz for Business. Farah Siddiqui, its lead
// designer, blueprints the home visit front and back stage, maps the roles in a corporate check-up for Tarang Software
// (4,200 staff), and redesigns the screens that were built for a 12-person pilot and now carry thousands. This is the
// data the ia.5 scenes and games draw, and the rules they score against.

// ── Service blueprints (ia.5-1, `blueprint-build`) ──────────────────────────────────────────────────────────────────

/** The rows of a service blueprint, top to bottom (`blueprint-build` lanes). `customer`: what the customer does.
 *  `front`: what the customer sees or hears of the service, from staff they meet or from the app and messages.
 *  `back`: what the staff who meet customers do out of sight. `support`: the systems, teams and partners behind them. */
export const BLUEPRINT_ROWS = ['customer', 'front', 'back', 'support'] as const;
export type BlueprintRow = (typeof BLUEPRINT_ROWS)[number];
/** The lines between the rows, top to bottom: interaction (customer | front), visibility (front | back) and internal
 *  interaction (back | support). */
export const BLUEPRINT_LINES = ['interaction', 'visibility', 'internal'] as const;
/** The columns of the home-visit blueprint, in time order. */
export const BLUEPRINT_PHASES = ['book', 'visit', 'lab', 'report'] as const;
export type BlueprintPhase = (typeof BLUEPRINT_PHASES)[number];
export const PHASE_LABEL: Record<BlueprintPhase, string> = { book: 'Book', visit: 'Home visit', lab: 'To the lab', report: 'Report' };

/** One step in the service. `actor`: `customer`; `contact`, staff who meet or talk to customers (the phlebotomist, the
 *  support agent); or `support`, everyone and everything else (the slot engine, the lab, riders, the pathologist).
 *  `visible`: the customer sees or hears this step happen. `fail`: what goes wrong here today, if it's a fail point. */
export interface ServiceStep { text: string; actor: 'customer' | 'contact' | 'support'; visible: boolean; phase: BlueprintPhase; fail?: string }

/** Where a step goes on the blueprint. The customer's own actions are the top row. Anything the customer sees, from a
 *  person or from a screen or message, is frontstage. Contact staff out of sight are backstage. Everyone else supports. */
export const blueprintRow = (s: ServiceStep): BlueprintRow =>
  s.actor === 'customer' ? 'customer' : s.visible ? 'front' : s.actor === 'contact' ? 'back' : 'support';
/** The line a hand-off from row `a` to row `b` crosses, nearest `a` first; empty when they're the same row. */
export const linesCrossed = (a: BlueprintRow, b: BlueprintRow) => {
  const [i, j] = [BLUEPRINT_ROWS.indexOf(a), BLUEPRINT_ROWS.indexOf(b)];
  const [lo, hi] = i < j ? [i, j] : [j, i];
  return BLUEPRINT_LINES.slice(lo, hi);
};

/** A fasting blood test at home, step by step, as it runs today (`blueprint-build` cards). */
const STEPS = {
  book: { text: 'Books a fasting cholesterol and HbA1c test at home, 7:00–7:30 tomorrow', actor: 'customer', visible: true, phase: 'book' },
  slots: { text: 'The slot engine offers 7:00 slots by counting phlebotomists on shift', actor: 'support', visible: false, phase: 'book', fail: 'It ignores travel time between homes, so it sells more 7:00 visits than anyone can reach' },
  route: { text: 'Lakshmi, the phlebotomist, gets her morning route on her phone at 6:15', actor: 'contact', visible: false, phase: 'visit', fail: 'Routes arrive 45 minutes before the first visit, too late to fix a bad one' },
  eta: { text: 'The app sends “Lakshmi is 12 minutes away” with her live location', actor: 'support', visible: true, phase: 'visit' },
  fasting: { text: 'Fasting since 8 pm, calls support at 7:40 when nobody has come', actor: 'customer', visible: true, phase: 'visit' },
  agent: { text: 'The support agent says the phlebotomist is on her way', actor: 'contact', visible: true, phase: 'visit', fail: 'The agent can’t see Lakshmi’s location or her route, so she guesses' },
  draw: { text: 'Lakshmi checks the name against the order, labels the tubes in front of him and draws blood', actor: 'contact', visible: true, phase: 'visit' },
  hub: { text: 'Lakshmi drops the cool box at the Kondapur collection hub after her last visit', actor: 'contact', visible: false, phase: 'lab', fail: 'Samples from her first visit wait up to four hours, close to what the tubes allow' },
  rider: { text: 'A rider takes the hub’s samples to the central lab in Banjara Hills', actor: 'support', visible: false, phase: 'lab' },
  signoff: { text: 'The analyser runs the samples and a pathologist signs off each report', actor: 'support', visible: false, phase: 'report' },
  whatsapp: { text: 'A WhatsApp message arrives with the report as a PDF', actor: 'support', visible: true, phase: 'report' },
  read: { text: 'Opens the report, sees HbA1c 6.4% marked high, and wonders what to do', actor: 'customer', visible: true, phase: 'report' },
} as const satisfies Record<string, ServiceStep>;
export type NabzStep = keyof typeof STEPS;
export const NABZ_STEPS: Record<NabzStep, ServiceStep> = STEPS;
/** The steps where the service breaks today, in time order. */
export const failPoints = (steps: Record<string, ServiceStep> = NABZ_STEPS) => Object.keys(steps).filter(k => steps[k].fail);

// ── Multi-role / B2B workflows (ia.5-2, `role-swim`) ────────────────────────────────────────────────────────────────

/** Who owns a step in a corporate check-up (`role-swim` lanes). `employee`: the person being tested. `hr`: the
 *  client's HR admin, who runs the programme. `finance`: the client's approver for spending over HR's limit. `nabz`:
 *  Nabz's own team (camp operations and its doctors). */
export const NABZ_ROLES = ['employee', 'hr', 'finance', 'nabz'] as const;
export type NabzRole = (typeof NABZ_ROLES)[number];
/** The most HR can approve on its own, in rupees. */
export const HR_SPEND_LIMIT = 200_000;
/** The smallest group whose health numbers the client may see. Below it, a count can point at a person. */
export const MIN_REPORT_GROUP = 10;

/** A step in the programme. `kind`: `personal` (one employee's own booking, consent or result), `programme`
 *  (setting it up and running it), `spend` (money, with `amount`), `aggregate` (health numbers across `group`
 *  people) or `ops` (Nabz's own staff and kits). */
export interface Duty { text: string; kind: 'personal' | 'programme' | 'spend' | 'aggregate' | 'ops'; amount?: number; group?: number }

/** Personal data stays with the person. Money over HR's limit goes to finance. Health numbers for a group too small to
 *  hide anyone in stay with Nabz's doctors. Running the programme is HR's; running the camps is Nabz's. */
export const dutyOwner = (d: Duty): NabzRole =>
  d.kind === 'personal' ? 'employee'
    : d.kind === 'spend' ? ((d.amount ?? 0) > HR_SPEND_LIMIT ? 'finance' : 'hr')
      : d.kind === 'aggregate' ? ((d.group ?? 0) >= MIN_REPORT_GROUP ? 'hr' : 'nabz')
        : d.kind === 'ops' ? 'nabz' : 'hr';
/** How many times work passes from one role to another, in this order. Every hand-off is a notification and a wait. */
export const roleHandoffs = (owners: readonly NabzRole[]) => owners.slice(1).filter((o, i) => o !== owners[i]).length;

/** Tarang Software's annual check-up, from setting it up to the results (`role-swim` cards, in workflow order). */
const DUTIES = {
  packages: { text: 'Choose the tests: the basic panel for everyone, the advanced one for staff over 40', kind: 'programme' },
  order: { text: 'Approve the ₹38 lakh order for 4,200 check-ups', kind: 'spend', amount: 3_800_000 },
  camps: { text: 'Send four phlebotomists and 600 tube kits to the Pune camp day', kind: 'ops' },
  slot: { text: 'Book a 7:30 slot at the Gachibowli office camp', kind: 'personal' },
  remind: { text: 'Remind everyone who hasn’t booked, a week before the camp', kind: 'programme' },
  result: { text: 'See one employee’s HbA1c result', kind: 'personal' },
  consult: { text: 'Agree to share the results with a Nabz doctor for a free consult', kind: 'personal' },
  hydStats: { text: 'See that 31% of the 2,900 Hyderabad staff have high cholesterol', kind: 'aggregate', group: 2900 },
  kochi: { text: 'See how many of the 6 people at the Kochi sales office have high blood sugar', kind: 'aggregate', group: 6 },
  joiners: { text: 'Add 40 new joiners to the programme in July, ₹48,000', kind: 'spend', amount: 48_000 },
  topup: { text: 'Add ₹3.2 lakh to the budget for a second Pune camp day', kind: 'spend', amount: 320_000 },
} as const satisfies Record<string, Duty>;
export type NabzDuty = keyof typeof DUTIES;
export const NABZ_DUTIES: Record<NabzDuty, Duty> = DUTIES;

// ── Designing for scale (ia.5-3, `scale-dial`) ──────────────────────────────────────────────────────────────────────

/** How a screen should show its items (`scale-dial` lanes). `all`: every option at once, as chips or radio buttons.
 *  `list`: one sorted, scrollable list, the likeliest first. `search`: a search box with filters and a short result
 *  list. `rules`: counts first, then only the exceptions, and actions on a rule (“everyone not booked in Pune”)
 *  instead of on items one by one. */
export const SCALE_PATTERNS = ['all', 'list', 'search', 'rules'] as const;
export type ScalePattern = (typeof SCALE_PATTERNS)[number];
/** Most options people compare at a glance. */
export const SHOW_ALL_MAX = 7;
/** Most items a sorted list carries before scrolling it becomes the work. */
export const SCALE_LIST_MAX = 50;
/** Rows of a list that fit on one phone screen. */
export const ROWS_PER_SCREEN = 10;
/** Screens of scrolling a plain list of `count` items takes. */
export const scrollScreens = (count: number) => Math.ceil(count / ROWS_PER_SCREEN);

/** A job a screen does. `job`: `pick` one item from the set, `watch` the set for the ones that need you, or `act` on
 *  many at once. `count`: how many items it holds. */
export interface ScaleTask { text: string; who: string; job: 'pick' | 'watch' | 'act'; count: number }

/** Watching or acting: a list while it's short, then counts, exceptions and rules. Picking: show a handful, list a
 *  few dozen, search past that. */
export const scalePattern = (t: ScaleTask): ScalePattern =>
  t.job !== 'pick' ? (t.count > SCALE_LIST_MAX ? 'rules' : 'list')
    : t.count <= SHOW_ALL_MAX ? 'all' : t.count <= SCALE_LIST_MAX ? 'list' : 'search';

/** Screens Farah is redesigning now that Nabz runs 9,000 samples a day (`scale-dial` cards). */
const TASKS = {
  slots: { text: 'Pick a collection window tomorrow morning', who: 'A customer booking a home visit', job: 'pick', count: 5 },
  packages: { text: 'Choose which check-up package a group of staff gets', who: 'Meera, HR at Tarang', job: 'pick', count: 3 },
  cities: { text: 'Pick the city for a home visit', who: 'A customer booking a home visit', job: 'pick', count: 14 },
  sites: { text: 'Pick your office for the camp day', who: 'A Tarang employee', job: 'pick', count: 23 },
  tests: { text: 'Add a test to a home visit, from everything Nabz offers', who: 'A customer booking a home visit', job: 'pick', count: 1850 },
  staff: { text: 'Find one employee to fix their booking', who: 'Meera, HR at Tarang', job: 'pick', count: 4200 },
  route: { text: 'See this morning’s visits, in order', who: 'Lakshmi, a phlebotomist', job: 'watch', count: 8 },
  moveDay: { text: 'Move the people booked on a cancelled camp day to the next one', who: 'Meera, HR at Tarang', job: 'act', count: 12 },
  samples: { text: 'Catch the samples about to miss their deadline', who: 'The lab supervisor', job: 'watch', count: 9000 },
  fleet: { text: 'See which phlebotomists are running late at 7:15 am', who: 'The dispatch lead', job: 'watch', count: 310 },
  nudge: { text: 'Remind the staff who haven’t booked yet', who: 'Meera, HR at Tarang', job: 'act', count: 1140 },
} as const satisfies Record<string, ScaleTask>;
export type NabzTask = keyof typeof TASKS;
export const NABZ_TASKS: Record<NabzTask, ScaleTask> = TASKS;
