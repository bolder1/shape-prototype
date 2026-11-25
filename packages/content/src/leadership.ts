// Design leadership at Kaarigar, for chapter ld.3. Kaarigar is a Pune marketplace for home services: customers book
// a verified electrician, plumber, carpenter or AC technician in the customer app, and about 18,000 kaarigars (the
// tradespeople) accept jobs and get paid in the partner app. Shalini Verma is head of design. Five designers report to
// her: Neelam Rao and Irfan Shaikh (senior), Pooja Shinde and Aditya Joshi (product designers) and Tanmay Kulkarni
// (associate). She is hiring a sixth, a senior designer for the partner app. This is the data the ld.3 scenes and
// games draw, and the rules they score against: what an interview note is evidence of, which way to lead a designer
// on one piece of work, and what to do with each ritual on the team's calendar.

// ── Hiring & leveling (ld.3-1, `level-call`) ───────────────────────────────────────────────────────────────────────

/** Kaarigar's design ladder, lowest first. Each rung is the widest scope someone works at without being told what
 *  problem to solve: a task someone else framed, a feature, a whole product area, or across teams and people. */
export const DESIGN_LADDER = ['associate', 'designer', 'senior', 'lead'] as const;
export type LadderLevel = (typeof DESIGN_LADDER)[number];
/** The scope each rung works at, in the same order as `DESIGN_LADDER`. */
export const LADDER_SCOPES = ['task', 'feature', 'product', 'org'] as const;
export type LadderScope = (typeof LADDER_SCOPES)[number];
/** What each rung means on the ladder: the line the boss's example and the scene use. */
export const LADDER_LINES: Record<LadderLevel, string> = {
  associate: 'Delivers well-framed tasks with guidance, and asks for help early.',
  designer: 'Owns a feature end to end: frames it with the PM, designs, tests and ships it.',
  senior: 'Owns a product area: sets its problems from evidence and moves PM and engineering with it.',
  lead: 'Shapes how several teams work, and grows other designers.',
};

/** What a debrief note says about the senior bar (`level-call` lanes). `noise`: it describes no behaviour (pedigree,
 *  years, “fit”, likability), so it counts for nothing. `below`, `at`, `above`: the rung the behaviour shows, against
 *  the senior bar the role is hired at. */
export const BAR_CALLS = ['noise', 'below', 'at', 'above'] as const;
export type BarCall = (typeof BAR_CALLS)[number];

/** One note from Ritu Bhandari's interview loop. `who`: the interviewer and the interview. `behaviour`: it describes
 *  something she did or said, not who she is or where she worked. `scope`: how wide that work was. `guided`: someone
 *  else set the problem or made the call, which counts one rung lower. */
export interface DebriefNote {
  text: string; short: string; who: string; behaviour: boolean; scope?: LadderScope; guided?: boolean;
}

/** The rung a behavioural note shows: its scope, one lower if someone else framed it. Null for a note with no behaviour. */
export const noteLevel = (n: DebriefNote): LadderLevel | null => {
  if (!n.behaviour || !n.scope) return null;
  return DESIGN_LADDER[Math.max(0, LADDER_SCOPES.indexOf(n.scope) - (n.guided ? 1 : 0))];
};
/** No behaviour is no evidence; the rest is placed against the bar (senior, unless the role says otherwise). */
export const barCall = (n: DebriefNote, bar: LadderLevel = 'senior'): BarCall => {
  const l = noteLevel(n);
  if (!l) return 'noise';
  const d = DESIGN_LADDER.indexOf(l) - DESIGN_LADDER.indexOf(bar);
  return d < 0 ? 'below' : d > 0 ? 'above' : 'at';
};
/** The level the loop supports: the lower median of the behavioural notes' rungs, so one glowing or one bad interview
 *  can't decide it. Notes without behaviour are left out. Null if there is no evidence at all. */
export const offerLevel = (notes: readonly DebriefNote[]): LadderLevel | null => {
  const ranks = notes.map(noteLevel).filter((l): l is LadderLevel => !!l).map(l => DESIGN_LADDER.indexOf(l)).sort((a, b) => a - b);
  return ranks.length ? DESIGN_LADDER[ranks[Math.floor((ranks.length - 1) / 2)]] : null;
};

const NOTES = {
  pedigree: { short: 'Pedigree', who: 'Aditya · portfolio review', behaviour: false, text: 'Ex-Flipkart and an NID graduate. Strong pedigree for a senior.' },
  fit: { short: 'Culture fit', who: 'Neelam · values interview', behaviour: false, text: 'Great culture fit. I’d happily get chai with her every day.' },
  years: { short: 'Years', who: 'Kavya (PM) · working with product', behaviour: false, text: 'Eight years of experience, so she should be a senior already.' },
  polish: { short: 'App critique', who: 'Irfan · critique of the partner app', behaviour: true, scope: 'feature', text: 'Critiquing our partner app, she listed spacing and icon fixes on the job card, but never asked who uses it or how many jobs get accepted.' },
  framed: { short: 'Payments case', who: 'Aditya · portfolio review', behaviour: true, scope: 'feature', guided: true, text: 'In her payments case study, the PM wrote the problem and the metric; she designed the screens and ran two usability tests.' },
  escalate: { short: 'Pushback', who: 'Kavya (PM) · working with product', behaviour: true, scope: 'product', guided: true, text: 'Asked what she’d do when engineering cut her scope in half, she said she would take it to her manager to decide.' },
  onboarding: { short: 'Seller onboarding', who: 'Aditya · portfolio review', behaviour: true, scope: 'product', text: 'Owned seller onboarding at her last company for a year: found the problem in support tickets with the PM, and drop-off fell from 41% to 23%.' },
  flow: { short: 'Craft exercise', who: 'Irfan · craft exercise', behaviour: true, scope: 'product', text: 'Asked to improve the job-offer card, she redrew the whole accept-a-job flow around the 30 seconds a kaarigar has to decide, and said what she’d test first.' },
  brief: { short: 'Changed the brief', who: 'Kavya (PM) · working with product', behaviour: true, scope: 'product', text: 'She pushed back on my mock brief with our own Play Store reviews, and changed what we’d measure from installs to first job accepted.' },
  critique: { short: 'Started a critique', who: 'Neelam · values interview', behaviour: true, scope: 'org', text: 'Started a weekly critique for four designers at her last company and wrote its rules. Two of them run it now.' },
  mentor: { short: 'Mentored', who: 'Neelam · values interview', behaviour: true, scope: 'org', text: 'Mentored two junior designers to promotion, and showed the promotion documents she helped them write.' },
  principles: { short: 'Principles', who: 'Shalini · hiring manager', behaviour: true, scope: 'org', text: 'Wrote the design principles that a product and engineering org of 60 now uses to settle arguments.' },
} as const satisfies Record<string, DebriefNote>;
export type KaarigarNote = keyof typeof NOTES;
export const KAARIGAR_NOTES: Record<KaarigarNote, DebriefNote> = NOTES;

// ── Managing designers (ld.3-2, `style-pick`) ──────────────────────────────────────────────────────────────────────

/** How Shalini leads one designer on one piece of work (`style-pick` lanes), after situational leadership. `direct`:
 *  new to it and keen, so she says what good looks like, gives the steps and checks in often. `coach`: still learning
 *  it and knocked back, so she explains why, decides with them and encourages. `support`: fully able but low on
 *  will or confidence, so she listens, asks and clears the way, and they decide. `delegate`: able and keen, so they
 *  agree the outcome and a check-in, and she steps back. */
export const LEAD_STYLES = ['direct', 'coach', 'support', 'delegate'] as const;
export type LeadStyle = (typeof LEAD_STYLES)[number];

/** The team, as the game and scene draw them. */
export const KAARIGAR_TEAM = {
  tanmay: { name: 'Tanmay', role: 'Associate designer' },
  pooja: { name: 'Pooja', role: 'Product designer, partner app' },
  aditya: { name: 'Aditya', role: 'Product designer, payments' },
  irfan: { name: 'Irfan', role: 'Senior designer, booking' },
  neelam: { name: 'Neelam', role: 'Senior designer, design system' },
} as const;
export type KaarigarPerson = keyof typeof KAARIGAR_TEAM;

/** One designer on one piece of work. `skill`: how able they are at this task, not in general. `will`: their drive
 *  and confidence for it right now. `move`: what Shalini does. */
export interface Situation {
  text: string; short: string; who: KaarigarPerson; skill: 'low' | 'high'; will: 'low' | 'high'; move: string;
}

/** Skill at this task decides how much she tells; will decides how much she backs them. */
export const leadStyle = (s: Situation): LeadStyle =>
  s.skill === 'high' ? (s.will === 'high' ? 'delegate' : 'support') : (s.will === 'high' ? 'direct' : 'coach');

const SITUATIONS = {
  study: { short: 'First study', who: 'tanmay', skill: 'low', will: 'high', text: 'Tanmay volunteers to run his first usability study, with five plumbers in Hadapsar next week. He has never written a test script.', move: 'Sits with him on the script, gives him the last study as a template, and joins the first session.' },
  cfo: { short: 'First CFO review', who: 'aditya', skill: 'low', will: 'high', text: 'Aditya is excited to present the refunds redesign to the CFO for the first time on Thursday. His draft is 40 slides of process.', move: 'Tells him the shape: the decision and the money on slide one, three slides of evidence, and a dry run with her on Wednesday.' },
  marathi: { short: 'Marathi partner app', who: 'pooja', skill: 'low', will: 'high', text: 'Pooja jumps at the Marathi version of the partner app. She has never designed for a second language or script.', move: 'Lays out the steps: test real strings early, check line length and font support, and review with a Marathi-speaking kaarigar before handoff.' },
  noshow: { short: 'Study went badly', who: 'tanmay', skill: 'low', will: 'low', text: 'Tanmay’s second study went badly: two kaarigars didn’t show and a PM called the findings “obvious”. He wants to hand research to someone else.', move: 'Goes through what happened with him, explains why recruiting buffers and a sharper question would help, and plans the next study together.' },
  refund: { short: 'Blocked twice', who: 'aditya', skill: 'low', will: 'low', text: 'Aditya has designed the partial-refund flow twice, and engineering has said twice it can’t ship this sprint. He has started saying “just tell me what to draw”.', move: 'Explains how to bring engineering in at the sketch stage, works out the first version with him and his tech lead, and tells him what he did well.' },
  facilitate: { short: 'Ran over', who: 'pooja', skill: 'low', will: 'low', text: 'Pooja’s first time facilitating critique ran 30 minutes over and two seniors argued past her. She says she isn’t cut out for running rooms.', move: 'Debriefs it with her, explains timeboxes and how to park an argument, and co-facilitates the next one before handing it back.' },
  quiet: { short: 'Gone quiet', who: 'irfan', skill: 'high', will: 'low', text: 'Irfan, the strongest interaction designer on the team, has gone quiet in critique since his promotion case was deferred.', move: 'Asks him in their 1:1 what the deferral felt like, listens, and works out with him the two pieces of evidence the next case needs.' },
  tokens: { short: 'Dreading migration', who: 'neelam', skill: 'high', will: 'low', text: 'Neelam knows the design system better than anyone, but dreads the token migration: the last one burned her out.', move: 'Asks what made the last one hard, gets her an engineer for the codemods, and protects her calendar. Neelam plans the migration.' },
  shelved: { short: 'Shelved before', who: 'irfan', skill: 'high', will: 'low', text: 'Irfan could design the AC-service booking flow in his sleep, but says there’s no point: the last redesign was shelved.', move: 'Gets the PM to say in writing why this one is funded, then asks Irfan how he’d want to run it.' },
  dark: { short: 'Dark mode', who: 'neelam', skill: 'high', will: 'high', text: 'Neelam wants to own dark mode for the customer app end to end. She shipped it for the partner app last year.', move: 'Agrees the outcome and a date, asks to see it at the halfway review, and stays out of the way.' },
  crossCrit: { short: 'Cross-team critique', who: 'irfan', skill: 'high', will: 'high', text: 'Irfan asks to run a critique for the booking squad’s PMs and engineers. He has been doing it informally for months.', move: 'Hands it over, agrees what a good month looks like, and drops in once a quarter.' },
  autopay: { short: 'UPI autopay', who: 'aditya', skill: 'high', will: 'high', text: 'Aditya has shipped three payment flows on time and asks to run UPI autopay for AMC plans without weekly check-ins.', move: 'Agrees the outcome, the risks to flag early and a fortnightly check-in, and lets him run it.' },
} as const satisfies Record<string, Situation>;
export type KaarigarSituation = keyof typeof SITUATIONS;
export const KAARIGAR_SITUATIONS: Record<KaarigarSituation, Situation> = SITUATIONS;

/** For each person, the styles their situations need, in `LEAD_STYLES` order: one person, several styles. */
export const stylesByPerson = (keys: readonly KaarigarSituation[]) =>
  Object.fromEntries((Object.keys(KAARIGAR_TEAM) as KaarigarPerson[]).map(p => [p,
    LEAD_STYLES.filter(s => keys.some(k => KAARIGAR_SITUATIONS[k].who === p && leadStyle(KAARIGAR_SITUATIONS[k]) === s))])) as Record<KaarigarPerson, LeadStyle[]>;

// ── Design culture & rituals (ld.3-3, `ritual-crit`) ───────────────────────────────────────────────────────────────

/** What to do with a ritual on the team's calendar (`ritual-crit` lanes). `cut`: its reason has gone, or something
 *  else already does its job. `make-safe`: it has a purpose, but it punishes showing early or honest work (a boss
 *  picking winners, names on mistakes, scores that reach reviews). `reshape`: it is safe and has a purpose, but nothing
 *  comes out of it, so it gets an output: a decision, a log, an owner. `keep`: purpose, safety and an output. */
export const RITUAL_CALLS = ['keep', 'reshape', 'make-safe', 'cut'] as const;
export type RitualCall = (typeof RITUAL_CALLS)[number];

/** A ritual. `minutes`: what it costs each designer per week. `purpose`: there is still a reason for it. `duplicates`:
 *  what already does its job. `unsafe`: what makes people hold back. `output`: a decision or artefact comes out.
 *  `fixed`: what it becomes. `after`: minutes a week once fixed, if different. */
export interface Ritual {
  text: string; short: string; when: string; minutes: number; purpose: boolean; output: boolean;
  duplicates?: string; unsafe?: string; fixed: string; after?: number;
}

/** Cut what has no reason or is done elsewhere, then make it safe, then make it produce something. */
export const ritualCall = (r: Ritual): RitualCall =>
  !r.purpose || r.duplicates ? 'cut' : r.unsafe ? 'make-safe' : !r.output ? 'reshape' : 'keep';

const RITUALS = {
  critique: { short: 'Monday critique', when: 'Mon 11:00 · 90 min', minutes: 90, purpose: true, output: true, text: 'Two designs a week. The presenter says what feedback they need first, and it ends with the decisions written down.', fixed: 'Keep it as it is.' },
  rideAlong: { short: 'Kaarigar day', when: 'Monthly · half a day', minutes: 60, purpose: true, output: true, text: 'Each designer spends half a day on jobs with an electrician or plumber, then posts notes and one change they’d make.', fixed: 'Keep it as it is.' },
  oneOnOne: { short: '1:1s', when: 'Weekly · 30 min', minutes: 30, purpose: true, output: true, text: 'A weekly 1:1 with Shalini. The designer brings the agenda; actions go in a shared doc.', fixed: 'Keep it as it is.' },
  inspiration: { short: 'Inspiration hour', when: 'Fri 16:00 · 60 min', minutes: 60, purpose: true, output: false, text: 'People show Dribbble shots they liked this week. Nobody remembers any of them by Monday.', fixed: 'Thirty minutes: bring one pattern from a shipped app and say where Kaarigar could use it. It goes on the patterns board.', after: 30 },
  review: { short: 'PM design review', when: 'Fortnightly · 60 min', minutes: 30, purpose: true, output: false, text: 'Designers show work to the PMs, everyone nods, nobody writes down what was decided, and the same debates come back.', fixed: 'Same slot, with a decisions log: what was decided, who owns it, by when.' },
  offsite: { short: 'Quarterly brainstorm', when: 'Quarterly · 1 day', minutes: 30, purpose: true, output: false, text: 'A day of sticky-note ideas at a café in Koregaon Park. The photos stay on someone’s phone.', fixed: 'It ends with three bets, each with an owner and a first step, reviewed at the next one.' },
  ceoFriday: { short: 'CEO walk-through', when: 'Fri 17:00 · 60 min', minutes: 60, purpose: true, output: true, unsafe: 'The CEO picks a winner, so designers only bring finished work.', text: 'Designers show work in progress to the CEO, who says which version he likes. Now nobody brings anything rough.', fixed: 'A monthly showcase of shipped and nearly shipped work for leadership. Work in progress stays in critique, without him.', after: 15 },
  shame: { short: 'Bug channel', when: 'Slack · all week', minutes: 0, purpose: true, output: true, unsafe: 'The designer is tagged on every bug.', text: '#design-oops: screenshots of UI bugs in production, with the designer who made the screen tagged.', fixed: 'A blameless #design-fixes: what broke, why the process let it through, and the fix. No names.' },
  scores: { short: 'Critique scores', when: 'During critique', minutes: 0, purpose: true, output: true, unsafe: 'The scores feed performance reviews.', text: 'Each design in critique gets a 1–5 score in a shared sheet, and the scores are used in performance reviews.', fixed: 'No scores. Critique feedback stays in critique and never feeds a rating.' },
  standup: { short: 'Design stand-up', when: 'Daily 9:30 · 15 min', minutes: 75, purpose: true, output: true, duplicates: 'their squads’ stand-ups', text: 'A daily design stand-up, half an hour before the squad stand-ups every designer already attends.', fixed: 'Cut. Blockers go to the squad stand-up, or to Shalini on Slack.' },
  sync: { short: 'Status sync', when: 'Wed 15:00 · 60 min', minutes: 60, purpose: true, output: true, duplicates: 'the Linear board', text: 'Each designer reads out the status of their tickets in turn. It is all on the Linear board already.', fixed: 'Cut. Shalini reads the board; the hour goes back to the team.' },
  hygiene: { short: 'Figma hygiene hour', when: 'Monthly · 60 min', minutes: 15, purpose: false, output: true, text: 'Set up by the last head of design for a file migration that finished a year ago. Nobody is sure what it’s for now.', fixed: 'Cut. The migration is done.' },
} as const satisfies Record<string, Ritual>;
export type KaarigarRitual = keyof typeof RITUALS;
export const KAARIGAR_RITUALS: Record<KaarigarRitual, Ritual> = RITUALS;

/** Minutes a week each designer spends in rituals, before and after the calls: cut ones go, fixed ones take `after`. */
export const ritualMinutes = (keys: readonly KaarigarRitual[]) => {
  const before = keys.reduce((s, k) => s + KAARIGAR_RITUALS[k].minutes, 0);
  const after = keys.reduce((s, k) => {
    const r = KAARIGAR_RITUALS[k];
    return s + (ritualCall(r) === 'cut' ? 0 : r.after ?? r.minutes);
  }, 0);
  return { before, after };
};
/** Minutes as “8 h 30 min”. */
export const hoursLabel = (m: number) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}` : `${m} min`);
