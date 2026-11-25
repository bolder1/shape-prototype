// Inclusive design leadership at Hazri, for chapter ax.3. Hazri is a Bengaluru HR and payroll platform: about 9 lakh
// employees at 1,400 employers use the Hazri app to mark attendance, apply for leave, see payslips and claim expenses,
// and HR teams run payroll in Hazri Admin on the web. Nandini Rao is head of design, Tenzin Dorje its only
// accessibility specialist, and Kiran Shetty runs engineering. The people in the research: Salma, who is blind and uses
// TalkBack; Joseph, who is Deaf and signs Indian Sign Language; Deepa, who has cerebral palsy, uses a wheelchair and controls her phone with Voice Access; and
// Revathi, a payroll officer in Coimbatore with low vision. Kranich Logistik, a Munich firm with staff in India and
// Germany, wants Hazri Admin, and its procurement team asks for an accessibility conformance report.
// This is the data the ax.3 scenes and games draw, and the rules they score against: what is wrong with a choice in a
// study plan; what is wrong with a line in a persona; and the earliest quarter each part of an accessibility programme
// can start.

// ── Testing with disabled users (ax.3-1, `study-fix`) ──────────────────────────────────────────────────────────────

/** The stages of a study, in order (the flow the game and scene draw). */
export const STUDY_STEPS = ['recruit', 'prepare', 'run', 'report'] as const;
export type StudyStep = (typeof STUDY_STEPS)[number];
export const STUDY_STEP_LABEL: Record<StudyStep, string> = { recruit: 'Recruit', prepare: 'Prepare', run: 'Run', report: 'Report' };

/** What is wrong with a choice in the study plan (`study-fix` lanes). `sound`: nothing. `harms`: it treats the
 *  participant unfairly or exposes them. `excludes`: the study itself shuts them out. `skews`: the evidence won't show
 *  how they really use Hazri. */
export const STUDY_FLAWS = ['sound', 'harms', 'excludes', 'skews'] as const;
export type StudyFlaw = (typeof STUDY_FLAWS)[number];

/** Hazri's standard incentive for a research session, in rupees per hour. */
export const INCENTIVE_PER_HOUR = 1500;
/** The least a session of this length should pay anyone: the standard hourly rate, rounded up to ₹50. Travel, an
 *  escort's or an interpreter's costs are paid on top, never out of it. */
export const fairIncentive = (minutes: number) => Math.ceil((INCENTIVE_PER_HOUR * minutes) / 60 / 50) * 50;

/** A choice in Hazri's plan for sessions with disabled participants. `harms`: unfair pay, intrusive questions, or
 *  personal data exposed. `excludes`: a participant can't take part as planned (an inaccessible form, room or
 *  conversation). `skews`: the session can't show real use (someone else's device or settings, a moderator who takes
 *  over, one person standing in for everyone). `fix`: what the plan says instead. */
export interface StudyChoice { text: string; step: StudyStep; harms: boolean; excludes: boolean; skews: boolean; fix?: string }

/** Worst first: harm to a person outranks a session they can't join, which outranks evidence that misleads. */
export const studyFlaw = (c: StudyChoice): StudyFlaw =>
  c.harms ? 'harms' : c.excludes ? 'excludes' : c.skews ? 'skews' : 'sound';

const CHOICES = {
  pay: { text: 'Disabled participants get ₹1,000 for a 90-minute session; everyone else gets ₹1,500 for 60', step: 'recruit', harms: true, excludes: false, skews: false, fix: `Pay at least the same hourly rate: ₹${fairIncentive(90).toLocaleString('en-IN')} for 90 minutes, with travel and an escort’s costs on top.` },
  diagnosis: { text: 'The screener asks for a diagnosis and a copy of the disability certificate', step: 'recruit', harms: true, excludes: false, skews: false, fix: 'Ask what people use and need: “Which assistive technology do you use on your phone?” Nobody needs a certificate to take part.' },
  network: { text: 'Recruit through a disability-led organisation and Hazri’s employee disability network, paying the organisation for its time', step: 'recruit', harms: false, excludes: false, skews: false },
  consent: { text: 'The consent form is a scanned PDF to print, sign and send back', step: 'prepare', harms: false, excludes: true, skews: false, fix: 'An accessible web form or plain-text document, read aloud on request, with consent recorded verbally if the participant prefers.' },
  interpreter: { text: 'Joseph’s session has no ISL interpreter; the moderator will type questions in the chat', step: 'prepare', harms: false, excludes: true, skews: false, fix: 'Book a qualified ISL interpreter Joseph is happy with, and brief them on the tasks the day before.' },
  stairs: { text: 'The lab is on the second floor, and the lift is “usually working”', step: 'prepare', harms: false, excludes: true, skews: false, fix: 'A step-free room with an accessible toilet, checked the day before, or run the session where the participant is.' },
  labPhone: { text: 'Everyone uses the lab’s Android phone, with TalkBack at its default settings', step: 'prepare', harms: false, excludes: false, skews: true, fix: 'Participants use their own phones with their own speech rate, zoom and gestures, remotely or brought along; a spare phone is only a backup.' },
  pacing: { text: 'Sessions run 90 minutes with three tasks and a break, instead of 60 minutes with six', step: 'prepare', harms: false, excludes: false, skews: false },
  takeOver: { text: 'When Salma is stuck for 30 seconds, the moderator takes her phone and taps the button for her', step: 'run', harms: false, excludes: false, skews: true, fix: 'Wait, then ask “What would you do next?” Taking over hides the barrier the session was meant to find.' },
  audio: { text: 'Salma shares her phone’s audio, so the team hears TalkBack at the speed she does', step: 'run', harms: false, excludes: false, skews: false },
  oneSpeaks: { text: 'After Salma’s session, the report says “blind users can’t use the leave flow”', step: 'report', harms: false, excludes: false, skews: true, fix: 'Report what Salma hit and why, with its severity. One person proves a barrier exists, not how every blind person works.' },
  footage: { text: 'Recordings, with names and disabilities in the file names, go into the company-wide research folder', step: 'report', harms: true, excludes: false, skews: false, fix: 'Restricted access, participants named by number, and clips shared only with each person’s consent.' },
} as const satisfies Record<string, StudyChoice>;
export type HazriChoice = keyof typeof CHOICES;
export const HAZRI_CHOICES: Record<HazriChoice, StudyChoice> = CHOICES;

/** The access needs Hazri's screener asks about, in place of diagnoses (the scene's “ask what people use”). */
export const HAZRI_SCREENER = ['Screen reader (TalkBack, VoiceOver, NVDA)', 'Zoom or a magnifier', 'Voice or switch control', 'Sign language or captions', 'Extra time or simpler steps'] as const;

// ── Inclusive personas (ax.3-2, `persona-crit`) ─────────────────────────────────────────────────────────────────────

/** What is wrong with a line in a persona (`persona-crit` lanes). `keep`: nothing. `stereotype`: pity, heroism or an
 *  assumption about what someone can do. `unfounded`: no session showed it. `diagnosis`: it names a condition or a
 *  label, not what the person does, uses or runs into. */
export const PERSONA_FLAWS = ['keep', 'stereotype', 'unfounded', 'diagnosis'] as const;
export type PersonaFlaw = (typeof PERSONA_FLAWS)[number];

/** How many research sessions sit behind Revathi's persona. */
export const PERSONA_SESSIONS = 9;

/** A line in the persona. `evidence`: sessions (of `PERSONA_SESSIONS`) where it showed up. `stereotype`: it frames the
 *  person through pity, inspiration or an assumption. `labelOnly`: it names a condition or category and stops there.
 *  `part`: where it sits on the persona card. `rewrite`: what replaces it (null: cut, with nothing in its place). */
export interface PersonaLine {
  text: string; evidence: number; stereotype: boolean; labelOnly: boolean;
  part: 'context' | 'setup' | 'barrier'; rewrite?: string | null;
}

/** Worst first: a stereotype misleads and offends whatever the evidence; a guess has no business in a persona; a bare
 *  label gives a designer nothing to design for. */
export const personaFlaw = (l: PersonaLine): PersonaFlaw =>
  l.stereotype ? 'stereotype' : l.evidence <= 0 ? 'unfounded' : l.labelOnly ? 'diagnosis' : 'keep';

const LINES = {
  deadline: { text: 'Runs payroll for 1,200 mill workers by the 28th; a stuck screen means 1,200 people are paid late', evidence: 6, stereotype: false, labelOnly: false, part: 'context' },
  tamil: { text: 'Reads English well, but writes notes to the shift supervisors in Tamil', evidence: 3, stereotype: false, labelOnly: false, part: 'context' },
  zoom: { text: 'Works at 200% browser zoom with Windows high contrast turned on', evidence: 4, stereotype: false, labelOnly: false, part: 'setup' },
  tables: { text: 'Loses her place in the payroll table at 200%, because its columns scroll sideways', evidence: 5, stereotype: false, labelOnly: false, part: 'barrier' },
  toast: { text: 'Missed “Payroll saved” twice: it appears at the top right and disappears after 3 seconds', evidence: 4, stereotype: false, labelOnly: false, part: 'barrier' },
  rp: { text: 'Has retinitis pigmentosa', evidence: 1, stereotype: false, labelOnly: true, part: 'setup', rewrite: 'Sees a narrow field of view, so she misses anything that appears at the edges of the screen.' },
  disabled: { text: 'Is a disabled user', evidence: 9, stereotype: false, labelOnly: true, part: 'context', rewrite: null },
  brave: { text: 'Inspiring: never lets her condition stop her', evidence: 2, stereotype: true, labelOnly: false, part: 'context', rewrite: null },
  tech: { text: 'Not comfortable with technology, like most people her age', evidence: 0, stereotype: true, labelOnly: false, part: 'context', rewrite: 'Uses Hazri Admin, Tally and the bank’s portal every day, and learns a new screen from its labels.' },
  help: { text: 'Needs a colleague to help her with anything new', evidence: 1, stereotype: true, labelOnly: false, part: 'context', rewrite: 'Works alone, and asks a colleague only when a screen changes without warning.' },
  darkMode: { text: 'Loves dark mode', evidence: 0, stereotype: false, labelOnly: false, part: 'setup', rewrite: null },
  reader: { text: 'Will switch to a screen reader within two years', evidence: 0, stereotype: false, labelOnly: false, part: 'setup', rewrite: 'Uses the Windows Magnifier for small print; uses no screen reader today.' },
} as const satisfies Record<string, PersonaLine>;
export type HazriLine = keyof typeof LINES;
export const HAZRI_LINES: Record<HazriLine, PersonaLine> = LINES;

/** Revathi's heading on the persona card. */
export const REVATHI = { name: 'Revathi', age: 48, role: 'Payroll officer at a textile mill in Coimbatore' } as const;

// ── Building an accessibility programme (ax.3-3, `program-road`) ────────────────────────────────────────────────────

/** The roadmap's quarters (`program-road` lanes), in order. */
export const PROGRAM_QUARTERS = ['q1', 'q2', 'q3', 'q4'] as const;
export type ProgramQuarter = (typeof PROGRAM_QUARTERS)[number];
export const QUARTER_LABEL: Record<ProgramQuarter, string> = { q1: 'Jan–Mar', q2: 'Apr–Jun', q3: 'Jul–Sep', q4: 'Oct–Dec' };

/** A piece of the programme: its short name on the roadmap, what it is, who owns it, and which other pieces must be done first. */
export interface ProgramStep { short: string; text: string; owner: string; needs: readonly string[] }

const STEPS = {
  exec: { short: 'Owner and budget', text: 'An accountable executive, a yearly budget and a named lead (Tenzin)', owner: 'Chief product officer', needs: [] },
  baseline: { short: 'Baseline audit', text: 'Audit leave, payslips and the payroll run with an expert review and six disabled participants', owner: 'Tenzin', needs: [] },
  champions: { short: 'Champions', text: 'One designer and one engineer per squad as accessibility champions, two hours a week', owner: 'Kiran', needs: [] },
  policy: { short: 'Policy', text: 'A policy: WCAG 2.2 AA for the web and the app, and no release with a known critical issue', owner: 'Chief product officer', needs: ['exec'] },
  components: { short: 'Components', text: 'Fix and document the design system’s 12 most-used components: keyboard, focus, names, states', owner: 'Design system team', needs: ['baseline', 'champions'] },
  critical: { short: 'Critical fixes', text: 'Fix every critical issue the audit found in leave, payslips and the payroll run', owner: 'Squads', needs: ['baseline'] },
  training: { short: 'Training', text: 'Training by role: designers annotate, engineers test with a keyboard and TalkBack, PMs write criteria', owner: 'Tenzin', needs: ['champions'] },
  gate: { short: 'Release gate', text: 'Accessibility in every squad’s definition of done, with automated checks in CI and a manual pass each release', owner: 'Kiran', needs: ['policy', 'components', 'training'] },
  acr: { short: 'Conformance report', text: 'An accessibility conformance report for Hazri Admin, against EN 301 549, for Kranich', owner: 'Tenzin', needs: ['critical', 'policy'] },
  statement: { short: 'Statement', text: 'A public accessibility statement: the standard, known issues, and how to report a problem', owner: 'Nandini', needs: ['critical', 'policy'] },
  dashboard: { short: 'Dashboard', text: 'Accessibility on the leadership dashboard: open issues by severity, time to fix, and panel findings', owner: 'Chief product officer', needs: ['gate'] },
  procurement: { short: 'Vendor reports', text: 'Ask every vendor Hazri buys software from for a conformance report, and check it', owner: 'Procurement', needs: ['acr'] },
} as const satisfies Record<string, ProgramStep>;
export type HazriStep = keyof typeof STEPS;
export const HAZRI_PROGRAM: Record<HazriStep, ProgramStep> = STEPS;

/** The earliest quarter a step can start: the first, or the one after the last of the steps it needs. */
export const programQuarter = (k: HazriStep, seen: readonly HazriStep[] = []): number => {
  if (seen.includes(k)) throw new Error(`Programme steps depend on each other in a loop: ${[...seen, k].join(' → ')}`);
  const needs = HAZRI_PROGRAM[k].needs as readonly HazriStep[];
  return needs.length ? 1 + Math.max(...needs.map(n => programQuarter(n, [...seen, k]))) : 0;
};
export const programLane = (k: HazriStep): ProgramQuarter => PROGRAM_QUARTERS[Math.min(programQuarter(k), PROGRAM_QUARTERS.length - 1)];

/** Placed in quarter `q` (0-based): the steps it needs that won't be done yet. Empty when the slot works. */
export const unmetNeeds = (k: HazriStep, q: number) => (HAZRI_PROGRAM[k].needs as readonly HazriStep[]).filter(n => programQuarter(n) >= q);

/** The four stages of the W3C's draft Accessibility Maturity Model, lowest first. */
export const MATURITY_STAGES = ['Inactive', 'Launch', 'Integrate', 'Optimize'] as const;
/** Where Hazri stands on a few of the model's dimensions this January, and where the roadmap aims by December
 *  (indexes into `MATURITY_STAGES`). */
export const HAZRI_MATURITY = [
  { dimension: 'Leadership and budget', now: 0, aim: 2 },
  { dimension: 'Knowledge and skills', now: 1, aim: 2 },
  { dimension: 'Design and build process', now: 1, aim: 3 },
  { dimension: 'People with disabilities in research', now: 0, aim: 2 },
  { dimension: 'Procurement', now: 0, aim: 1 },
] as const;
