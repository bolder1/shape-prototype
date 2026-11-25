// DesignOps at Saathi, for chapter ld.4. Saathi is a Hyderabad healthtech: a patient app (book a doctor, video
// consults, order medicines, book lab tests), a doctor app for clinics, and a portal for its 2,600 partner pharmacies.
// It has 38 designers in 11 product squads and about 410 engineers. Vandana Reddy is head of design; Megha Pillai has
// just joined as its first DesignOps lead. This is the data the ld.4 scenes and games draw, and the rules they score
// against: what to do about each place a design request loses time, what each reading on the team's health check
// calls for, and where in the org each problem of scale gets solved.

// ── Tooling & workflows (ld.4-1, `flow-fix`) ───────────────────────────────────────────────────────────────────────

/** What to do about a step where a design request loses time (`flow-fix` lanes), in the order Megha applies them.
 *  `remove`: the step changes nothing about the outcome, so no fix makes it worth keeping (and automating it only
 *  makes waste faster). `unblock`: it matters, but work queues behind one person, one meeting or too much in progress.
 *  `standardise`: it matters and flows, but every squad does it differently, so people search, re-ask and redo.
 *  `automate`: it matters, flows and is the same everywhere, but a person does a rule-based job by hand. */
export const FLOW_FIXES = ['remove', 'unblock', 'standardise', 'automate'] as const;
export type FlowFix = (typeof FLOW_FIXES)[number];

/** The stages of a design request at Saathi, from someone asking to the change being live. */
export const FLOW_STAGES = ['ask', 'design', 'review', 'handoff', 'release'] as const;
export type FlowStage = (typeof FLOW_STAGES)[number];

/** One step in the request's journey. `touch`: hours someone actually works on it, per request. `wait`: hours it sits
 *  waiting. `value`: doing it changes what ships. `gate`: the one person, meeting or overload it queues behind.
 *  `varies`: how each squad does it differently. `fixed`: what it becomes, at `after` hours. */
export interface FlowStep {
  text: string; short: string; stage: FlowStage; touch: number; wait: number; value: boolean;
  gate?: string; varies?: string; fixed: string; after: { touch: number; wait: number };
}

/** Remove what adds nothing, then clear the queues, then make the rest the same everywhere, and only then automate. */
export const flowFix = (s: FlowStep): FlowFix =>
  !s.value ? 'remove' : s.gate ? 'unblock' : s.varies ? 'standardise' : 'automate';

const STEPS = {
  dupe: { short: 'Second tracker', stage: 'ask', touch: 2, wait: 0, value: false, text: 'Every request is logged in the design team’s spreadsheet as well as in Jira, and the two never match.', fixed: 'Gone. Jira is the one tracker; design filters its own view of it.', after: { touch: 0, wait: 0 } },
  wip: { short: 'Five at once', stage: 'design', touch: 16, wait: 40, value: true, gate: 'one designer with five requests open', text: 'Rohit works on five requests for three squads at once, so each one waits while he switches to the others.', fixed: 'At most two requests in progress per designer. New ones wait in the squad’s backlog, where the PM can reorder them.', after: { touch: 14, wait: 10 } },
  files: { short: 'File set-up', stage: 'design', touch: 3, wait: 4, value: true, varies: 'every squad lays out its files its own way', text: 'Every squad lays out its Figma files differently, so finding the latest version of a flow takes twenty minutes and a Slack thread.', fixed: 'One file template: a cover with the status, pages for explore, review and ready for dev, and a changelog.', after: { touch: 1, wait: 0 } },
  tools: { short: 'Four tools', stage: 'design', touch: 2, wait: 6, value: true, varies: 'squads picked their own whiteboard and prototyping tools', text: 'Squads use three whiteboard tools and two prototyping tools, so one project’s research and flows live in four places.', fixed: 'One tool per job, agreed with the squads: Figma for design and prototypes, FigJam for workshops. Three licences retired.', after: { touch: 1, wait: 0 } },
  signoff: { short: 'Weekly sign-off', stage: 'review', touch: 1, wait: 20, value: false, text: 'Every design waits for Vandana’s sign-off at a weekly approvals meeting. In a year she has sent none back.', fixed: 'Gone. The squad designer ships; Vandana sees the work in critique.', after: { touch: 0, wait: 0 } },
  a11y: { short: 'One reviewer', stage: 'review', touch: 2, wait: 44, value: true, gate: 'Sana, the only accessibility specialist', text: 'Every screen waits for Sana, the one accessibility specialist, to review it before handoff. Her queue is eleven days long.', fixed: 'Designers run the contrast and label checks themselves. Sana reviews only new patterns, and holds office hours twice a week.', after: { touch: 2, wait: 6 } },
  legal: { short: 'Legal review', stage: 'review', touch: 1, wait: 20, value: true, gate: 'legal’s weekly review meeting', text: 'Every string in the medicines flow waits for legal’s weekly review, button labels included.', fixed: 'Legal pre-approves a library of standard strings. Only new claims about medicines go to the weekly review.', after: { touch: 1, wait: 4 } },
  ready: { short: 'Ready for dev', stage: 'handoff', touch: 2, wait: 16, value: true, varies: '“ready for dev” means something different in each squad', text: '“Ready for dev” means something different in each squad, and engineers find missing states in a third of handoffs.', fixed: 'One ready-for-dev checklist: every state, final copy, tokens only, accessibility notes and the ticket linked.', after: { touch: 2, wait: 2 } },
  redlines: { short: 'Redline PDFs', stage: 'handoff', touch: 4, wait: 0, value: false, text: 'Designers export redline PDFs of every screen for engineers, who measure from the Figma file anyway.', fixed: 'Gone. Engineers use the file’s dev mode, which they already do.', after: { touch: 0, wait: 0 } },
  ticket: { short: 'Handoff ticket', stage: 'handoff', touch: 2, wait: 4, value: true, text: 'When a design is ready, the designer writes its Jira ticket by hand, copying links, screen names and notes out of the file.', fixed: 'Marking a page ready for dev creates the Jira ticket, with the links and the checklist filled in.', after: { touch: 0, wait: 1 } },
  tokens: { short: 'Token copying', stage: 'handoff', touch: 3, wait: 8, value: true, text: 'After every colour change, a designer copies the hex values into a spreadsheet for engineers to paste into code.', fixed: 'Tokens go from Figma variables to the code repository as a pull request, on every change.', after: { touch: 0, wait: 1 } },
  qa: { short: 'Screenshot QA', stage: 'release', touch: 6, wait: 8, value: true, text: 'Before each release, a designer screenshots every screen on four phones and compares them with Figma by eye.', fixed: 'Visual regression tests take the screenshots on every build and flag only what changed.', after: { touch: 1, wait: 1 } },
} as const satisfies Record<string, FlowStep>;
export type SaathiStep = keyof typeof STEPS;
export const SAATHI_STEPS: Record<SaathiStep, FlowStep> = STEPS;

/** Hours of work and of waiting across steps, before any fix or with every step in `fixed` taking its `after` hours. */
export const flowHours = (keys: readonly SaathiStep[], fixed: readonly SaathiStep[] = []) =>
  keys.reduce((h, k) => {
    const s = SAATHI_STEPS[k], v = fixed.includes(k) ? s.after : s;
    return { touch: h.touch + v.touch, wait: h.wait + v.wait };
  }, { touch: 0, wait: 0 });
/** Flow efficiency, in whole per cent: the share of the elapsed time someone was working on it. */
export const flowEfficiency = (h: { touch: number; wait: number }) =>
  h.touch + h.wait ? Math.round((100 * h.touch) / (h.touch + h.wait)) : 0;
/** Working days (8 hours each), rounded. */
export const workDays = (hours: number) => Math.round(hours / 8);

// ── Measuring design team health (ld.4-2, `health-read`) ───────────────────────────────────────────────────────────

/** What a reading on the quarterly health check calls for (`health-read` lanes). `drop`: it counts output or tracks
 *  individuals, so it measures activity, not health, and people will game it. `healthy`: a team measure on the right
 *  side of its line. `watch`: over the line, but for one quarter only, or from a group too small to read (or to keep
 *  anonymous). `act`: over the line for two quarters or more, from a group big enough to trust. */
export const HEALTH_CALLS = ['drop', 'healthy', 'watch', 'act'] as const;
export type HealthCall = (typeof HEALTH_CALLS)[number];
/** The smallest group whose survey answers are read or reported on their own. */
export const MIN_GROUP = 5;
/** Quarters over the line before it counts as a trend. */
export const TREND_QUARTERS = 2;

/** One reading. `kind`: a team measure, a count of output, or a number per named person. `history`: the last three
 *  quarters, oldest first. `limit`: the line the team agreed, and `worse`: which side of it is bad. `n`: how many
 *  people answered, for a survey item. */
export interface HealthReading {
  text: string; short: string; area: 'delivery' | 'quality' | 'people'; kind: 'team' | 'output' | 'person';
  history: readonly number[]; unit: string; limit?: number; worse?: 'above' | 'below'; n?: number;
}

const over = (r: HealthReading, v: number) =>
  r.limit !== undefined && (r.worse === 'below' ? v < r.limit : v > r.limit);
/** Quarters in a row, counting back from the latest, that the reading has been over its line. */
export const overStreak = (r: HealthReading) => {
  let n = 0;
  for (let i = r.history.length - 1; i >= 0 && over(r, r.history[i]); i--) n++;
  return n;
};
/** Drop activity and per-person numbers; read the rest against their lines, and act only on a trend from enough people. */
export const healthCall = (r: HealthReading): HealthCall => {
  if (r.kind !== 'team') return 'drop';
  const s = overStreak(r);
  if (!s) return 'healthy';
  return s < TREND_QUARTERS || (r.n !== undefined && r.n < MIN_GROUP) ? 'watch' : 'act';
};

const READINGS = {
  screens: { short: 'Screens per designer', area: 'delivery', kind: 'output', history: [31, 28, 24], unit: 'a week', text: 'Screens designed per designer per week: down from 31 to 24.' },
  figma: { short: 'Figma hours by name', area: 'people', kind: 'person', history: [29, 27, 26], unit: 'h a week', text: 'Hours each designer was active in Figma last quarter, from the admin log, ranked by name.' },
  closed: { short: 'Tickets closed', area: 'delivery', kind: 'output', history: [317, 350, 412], unit: 'a quarter', text: 'Design tickets closed this quarter: 412, up 30% on the spring.' },
  lead: { short: 'Request to ready', area: 'delivery', kind: 'team', history: [11, 9, 6], unit: 'days', limit: 8, worse: 'above', text: 'Median time from a request to ready for dev: 6 days, inside the 8 the team agreed, and down from 11.' },
  escapes: { short: 'Design defects', area: 'quality', kind: 'team', history: [7, 5, 4], unit: 'per 100 tickets', limit: 6, worse: 'above', text: 'Design defects found after release: 4 per 100 tickets, under the line of 6.' },
  attrition: { short: 'Regretted attrition', area: 'people', kind: 'team', history: [6, 5, 5], unit: '% a year', limit: 10, worse: 'above', text: 'Regretted attrition over the last 12 months: 5%, against a line of 10%.' },
  focus: { short: 'Focus blocks', area: 'people', kind: 'team', history: [9, 9, 6], unit: 'a week', limit: 8, worse: 'below', text: 'Meeting-free blocks of two hours or more: 6 a week per designer, under the target of 8 for the first time.' },
  ratio: { short: 'Engineers per designer', area: 'delivery', kind: 'team', history: [8, 9, 11], unit: 'engineers', limit: 10, worse: 'above', text: 'Engineers per designer: 11, past the 10 the team agreed, after this quarter’s engineering hires.' },
  workload: { short: 'Doctor-app workload', area: 'people', kind: 'team', history: [60, 55, 50], unit: '% agree', limit: 70, worse: 'below', n: 4, text: 'On the doctor-app squad, 2 of the 4 designers agree “my workload is sustainable”: 50%, under 70% for three quarters.' },
  safety: { short: 'Safe to show rough work', area: 'people', kind: 'team', history: [61, 54, 48], unit: '% agree', limit: 70, worse: 'below', n: 36, text: '“I can bring rough work to critique without it being held against me”: 48% of 36 designers agree, under 70% for the third quarter.' },
  research: { short: 'Research behind features', area: 'quality', kind: 'team', history: [45, 31, 22], unit: '% of features', limit: 40, worse: 'below', text: 'Shipped features with any user research behind them: 22%, under the 40% target for two quarters.' },
  hiring: { short: 'Time to fill a role', area: 'people', kind: 'team', history: [71, 88, 94], unit: 'days', limit: 60, worse: 'above', text: 'Time to fill a design role: 94 days, over the 60-day line for three quarters, with nine roles open.' },
} as const satisfies Record<string, HealthReading>;
export type SaathiReading = keyof typeof READINGS;
export const SAATHI_READINGS: Record<SaathiReading, HealthReading> = READINGS;

/** The health check as Megha takes it to the team: the readings grouped by what each calls for, in `HEALTH_CALLS` order. */
export const healthCheck = (keys: readonly SaathiReading[]) =>
  Object.fromEntries(HEALTH_CALLS.map(c => [c, keys.filter(k => healthCall(SAATHI_READINGS[k]) === c)])) as Record<HealthCall, SaathiReading[]>;

// ── Scaling design across an org (ld.4-3, `org-shape`) ─────────────────────────────────────────────────────────────

/** Where in a hub-and-spoke design org a problem of scale gets solved (`org-shape` lanes), in the order Megha asks.
 *  `embed`: solving it needs a squad's daily context (its priorities, users and engineers), so a designer sits in the
 *  squad, still reporting to design. `hub`: it is a shared asset someone has to build and keep up for every squad
 *  (the design system, content standards, accessibility), so a central team owns it. `ops`: it is coordination or
 *  admin that eats designers' and managers' time (hiring, onboarding, cross-squad plans), so DesignOps runs it.
 *  `guild`: what's left is craft drifting between people in different squads, so a community across squads holds it. */
export const ORG_FIXES = ['embed', 'hub', 'ops', 'guild'] as const;
export type OrgFix = (typeof ORG_FIXES)[number];

/** One problem Saathi hit growing from 9 designers to 38. `squads`: how many squads it touches. `context`: fixing it
 *  needs a squad's daily context. `asset`: it needs a shared thing built and maintained. `admin`: it is coordination
 *  or admin work. `owner`: who owns the fix. `fixed`: what changes. */
export interface ScaleProblem {
  text: string; short: string; squads: number; context: boolean; asset: boolean; admin: boolean; owner: string; fixed: string;
}

/** Context first (nobody outside the squad can supply it), then shared assets, then coordination, then craft. */
export const orgFix = (p: ScaleProblem): OrgFix =>
  p.context ? 'embed' : p.asset ? 'hub' : p.admin ? 'ops' : 'guild';

const PROBLEMS = {
  queue: { short: 'Studio queue', squads: 11, context: true, asset: false, admin: false, owner: 'Squad designers', text: 'Squads file tickets with the central design studio and wait three weeks, so designs arrive after engineering has built a version.', fixed: 'A designer sits in each product squad, at its planning and stand-ups, and still reports to design.' },
  planning: { short: 'Missed planning', squads: 1, context: true, asset: false, admin: false, owner: 'Squad designers', text: 'The medicines squad picks its quarter’s bets in a planning meeting no designer attends.', fixed: 'The squad’s designer plans the quarter with the PM and the tech lead, from the first meeting.' },
  doctors: { short: 'Late complaints', squads: 1, context: true, asset: false, admin: false, owner: 'Squad designers', text: 'Doctors’ complaints about the prescription screen reach design six weeks late, through a PM’s summary.', fixed: 'The doctor-app designer joins the squad’s weekly clinic calls and reads its support tags herself.' },
  pickers: { short: 'Five slot pickers', squads: 5, context: false, asset: true, admin: false, owner: 'Design system team', text: 'Five squads have each built their own picker for appointment slots, and they behave differently.', fixed: 'The design system team builds one picker from the five squads’ needs, and retires the other five.' },
  medText: { short: 'Medicine text', squads: 6, context: false, asset: true, admin: false, owner: 'Content design', text: 'Dosage text and medicine names are written differently in every app, and pharmacists have flagged two that could mislead.', fixed: 'A content designer in the hub owns the medicine-text guide and a shared strings library every app uses.' },
  a11y: { short: 'Same a11y bugs', squads: 11, context: false, asset: true, admin: false, owner: 'Accessibility lead', text: 'Accessibility gets fixed squad by squad after each audit, and the same contrast and label bugs come back in every app.', fixed: 'Accessible components in the system, and a specialist in the hub who sets the standard and trains the squads.' },
  hiring: { short: 'Hiring admin', squads: 11, context: false, asset: false, admin: true, owner: 'DesignOps', text: 'Design managers spend a day a week scheduling interviews and chasing feedback for nine open roles.', fixed: 'DesignOps runs the hiring pipeline: scheduling, interview panels, written notes and debriefs.' },
  onboarding: { short: 'Slow onboarding', squads: 11, context: false, asset: false, admin: true, owner: 'DesignOps', text: 'New designers take seven weeks to ship their first change; every manager onboards them differently, from memory.', fixed: 'A 30-day plan DesignOps runs: accounts on day one, a buddy, and a small fix shipped in week two.' },
  launch: { short: 'Cross-squad launch', squads: 4, context: false, asset: false, admin: true, owner: 'DesignOps', text: 'Video consults need designers from four squads, nobody owns the schedule, and the doctor-app side ships two weeks late.', fixed: 'A design programme manager runs one plan for the four designers: one timeline, the dependencies, and a weekly check.' },
  drift: { short: 'Pattern drift', squads: 11, context: false, asset: false, admin: false, owner: 'Craft guild', text: 'Embedded designers solve the same problem three ways, and nobody outside a squad sees the work before it ships.', fixed: 'A weekly critique across squads, grouped by craft, so designers see each other’s work while it can still change.' },
  alone: { short: 'Only designer', squads: 1, context: false, asset: false, admin: false, owner: 'Craft guild', text: 'Lakshmi, the only designer on the lab-tests squad, has nobody to ask about craft and says she feels like a contractor.', fixed: 'She joins the product design guild: a fortnightly crit and a mentor from another squad.' },
  tricks: { short: 'Slow to spread', squads: 11, context: false, asset: false, admin: false, owner: 'Craft guild', text: 'One squad worked out how to prototype video calls in Figma; the other squads found out six months later.', fixed: 'A monthly show-and-tell and a guild channel, so a trick in one squad reaches the rest within a week.' },
} as const satisfies Record<string, ScaleProblem>;
export type SaathiProblem = keyof typeof PROBLEMS;
export const SAATHI_PROBLEMS: Record<SaathiProblem, ScaleProblem> = PROBLEMS;

/** The org the calls build: for each part, the owners in it (each once) and the problems it took. */
export const orgShape = (keys: readonly SaathiProblem[]) =>
  Object.fromEntries(ORG_FIXES.map(f => {
    const ks = keys.filter(k => orgFix(SAATHI_PROBLEMS[k]) === f);
    return [f, { owners: [...new Set(ks.map(k => SAATHI_PROBLEMS[k].owner))], problems: ks }];
  })) as Record<OrgFix, { owners: string[]; problems: SaathiProblem[] }>;

/** Engineers per designer, rounded: the ratio the health check tracks. */
export const engineersPerDesigner = (engineers: number, designers: number) => (designers ? Math.round(engineers / designers) : 0);
