// Musafir's research operation, for chapter rs.6. Musafir sells seats on 2,400 private intercity bus operators across
// 19 states, through its app and site. It has nine product squads and a research team of four: Lavanya Iyer, head
// of research; Arjun Pillai and Sneha Kulkarni, researchers; and Siddharth Rao, who runs ResearchOps (the panel,
// consent, tools and the repository). Lavanya turns a pile of requests into a two-quarter roadmap tied to the
// company's decisions, breaks old decks into a repository of atoms, and lets squads run their own research inside
// guardrails. This is the data the rs.6 scenes and games draw, and the rules they score against.

// ── Research roadmaps (rs.6-1, `roadmap-slot`) ──────────────────────────────────────────────────────────────────────

/** Where a request goes on the January–June roadmap (`roadmap-slot` lanes). `q1` / `q2`: the quarter the study has to
 *  start in to land before its decision. `backlog`: worth knowing, but nothing big rides on it this half, or its
 *  decision comes after June. `none`: not a study: no decision waits on it, or the repository already answers it. */
export const SLOTS = ['q1', 'q2', 'backlog', 'none'] as const;
export type Slot = (typeof SLOTS)[number];
/** Weeks in the half (week 1 starts Monday 4 January 2027) and the last week of Q1. */
export const HALF_WEEKS = 26;
export const Q1_END = 13;
/** Researchers who can lead a study at once. */
export const RESEARCHERS = 3;

/** A research request as it reached Lavanya. `decision`: what it feeds, if anything. `due`: the week that decision is
 *  made (past `HALF_WEEKS` means after June). `stakes`: `low` when the decision is cheap to reverse or to test live.
 *  `known`: the repository already answers it. `weeks`: how long the study takes, recruiting to readout. */
export interface ResearchRequest {
  text: string; from: string; decision: string | null; due: number | null; stakes: 'high' | 'low'; known: boolean; weeks: number;
}

/** The last week a study can start and still land the week before its decision. */
export const latestStart = (r: ResearchRequest) => (r.due === null ? null : r.due - r.weeks);
/** No decision, or already answered: not a study. Low stakes, or decided after June: backlog. Otherwise schedule
 *  backwards from the decision: the quarter it must start in. */
export const roadmapSlot = (r: ResearchRequest): Slot => {
  if (r.decision === null || r.due === null || r.known) return 'none';
  if (r.stakes === 'low' || r.due > HALF_WEEKS) return 'backlog';
  return latestStart(r)! <= Q1_END ? 'q1' : 'q2';
};
/** The weeks a scheduled study runs, starting as late as it safely can: [first, last]. */
export const studyWeeks = (r: ResearchRequest): [number, number] | null => {
  const s = latestStart(r);
  return s === null ? null : [s, s + r.weeks - 1];
};
/** How many scheduled studies run in each week of the half (index 0 = week 1). */
export const weekLoad = (rs: readonly ResearchRequest[]) => Array.from({ length: HALF_WEEKS }, (_, i) => rs.filter(r => {
  const slot = roadmapSlot(r);
  if (slot !== 'q1' && slot !== 'q2') return false;
  const [a, b] = studyWeeks(r)!;
  return i + 1 >= a && i + 1 <= b;
}).length);
/** The Monday of week `w`, as “8 Mar”. */
export const weekDate = (w: number) => {
  const d = new Date(Date.UTC(2027, 0, 4 + (w - 1) * 7));
  return `${d.getUTCDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getUTCMonth()]}`;
};

/** The requests in Lavanya's inbox for January–June 2027 (`roadmap-slot` cards). */
const REQUESTS = {
  pass: { text: 'Will people pay ₹199 a quarter for Musafir Pass: free cancellation and no convenience fee?', from: 'Aisha Khan, growth', decision: 'Launch Musafir Pass, and at what price', due: 12, stakes: 'high', known: false, weeks: 6 },
  boarding: { text: 'Why do 1 in 9 travellers struggle to find their boarding point?', from: 'Priya Nair, support', decision: 'Redesign the boarding details on the ticket', due: 10, stakes: 'high', known: false, weeks: 4 },
  operator: { text: 'How do depot clerks in small towns actually update seat availability?', from: 'Manoj Yadav, operator app', decision: 'What operator app v2 rebuilds first', due: 20, stakes: 'high', known: false, weeks: 8 },
  women: { text: 'What makes a woman travelling alone at night choose one bus over another?', from: 'Kavya Reddy, trust and safety', decision: 'Which safety features go into the second half', due: 24, stakes: 'high', known: false, weeks: 10 },
  ratings: { text: 'Do operator ratings make people trust an operator they’ve never used?', from: 'Rohan Desai, search', decision: 'How ratings rank operators in search', due: 22, stakes: 'high', known: false, weeks: 5 },
  autopay: { text: 'Will renewing Musafir Pass by UPI Autopay surprise people?', from: 'Aisha Khan, growth', decision: 'The Pass renewal flow', due: 25, stakes: 'high', known: false, weeks: 3 },
  seatmap: { text: 'Which of two seat-map layouts helps people pick a seat faster?', from: 'Rohan Desai, search', decision: 'Ship the new seat map', due: 8, stakes: 'low', known: false, weeks: 3 },
  rail: { text: 'Should Musafir sell train tickets too?', from: 'Vikram Shah, CEO’s office', decision: 'Enter rail ticketing', due: 40, stakes: 'high', known: false, weeks: 12 },
  refunds: { text: 'Why do so many people call support about refunds?', from: 'Priya Nair, support', decision: 'Fix the refund experience', due: 9, stakes: 'high', known: true, weeks: 6 },
  darkmode: { text: 'Do our users want a dark mode?', from: 'Nikhil Jain, Android', decision: null, due: null, stakes: 'low', known: false, weeks: 2 },
} as const satisfies Record<string, ResearchRequest>;
export type MusafirRequest = keyof typeof REQUESTS;
export const MUSAFIR_REQUESTS: Record<MusafirRequest, ResearchRequest> = REQUESTS;

// ── Repositories & atomic research (rs.6-2, `atom-build`) ───────────────────────────────────────────────────────────

/** Where a draft note goes in the repository (`atom-build` lanes). `fact`: one observation, traced to its source.
 *  `insight`: an interpretation resting on facts from at least two studies. `rec`: an action that rests on an
 *  insight. `fix`: it can't go in yet: no source, two levels in one note, an insight on one study, or a
 *  recommendation with nothing under it. */
export const ATOM_LANES = ['fact', 'insight', 'rec', 'fix'] as const;
export type AtomLane = (typeof ATOM_LANES)[number];
/** Studies an insight needs facts from before it goes in. */
export const INSIGHT_STUDIES = 2;

/** The studies Musafir's notes come from. */
export const MUSAFIR_STUDIES = {
  interviews: 'Refund interviews · Aug 2026 · 12 travellers',
  tickets: 'Support tickets · Sep 2026 · 1,400 tagged',
  diary: 'Boarding diary study · Nov 2026 · 9 travellers',
} as const;
export type MusafirStudy = keyof typeof MUSAFIR_STUDIES;

/** A draft note. `level`: what it claims to be. `source`: the study a fact comes from. `links`: the notes it rests on
 *  (facts for an insight, insights for a recommendation). `mixed`: it says two kinds of thing at once. */
export interface Atom { text: string; level: 'fact' | 'insight' | 'rec'; source?: MusafirStudy; links: readonly string[]; mixed?: boolean }

/** Siddharth's migration pile: notes from three studies, on their way into the repository (`atom-build` cards). */
const ATOMS = {
  whenMoney: { text: '7 of 12 travellers who cancelled said they didn’t know when the money would reach their account', level: 'fact', source: 'interviews', links: [] },
  where48: { text: '38% of refund tickets ask “where is my refund?” within 48 hours of cancelling', level: 'fact', source: 'tickets', links: [] },
  landmarkSent: { text: '6 of 9 diary travellers sent the operator a landmark or a photo to find the boarding point', level: 'fact', source: 'diary', links: [] },
  landmarkTicket: { text: '1 in 5 boarding complaints names a landmark the ticket didn’t mention', level: 'fact', source: 'tickets', links: [] },
  hate: { text: 'Users hate our refund policy', level: 'fact', links: [] },
  uncertain: { text: 'People call about refunds because they can’t see when the money will arrive, more than because it’s slow', level: 'insight', links: ['whenMoney', 'where48'] },
  landmarks: { text: 'Travellers find a boarding point by its landmark, not its address', level: 'insight', links: ['landmarkSent', 'landmarkTicket'] },
  callDriver: { text: 'Travellers trust a call to the driver more than any map', level: 'insight', links: ['landmarkSent'] },
  refundDate: { text: 'Show the date the refund will arrive, for each way of paying, on the cancel screen and in the SMS', level: 'rec', links: ['uncertain'] },
  landmarkLine: { text: 'Put each boarding point’s landmark and a photo at the top of the ticket', level: 'rec', links: ['landmarks'] },
  chatbot: { text: 'Add a chatbot for refund questions', level: 'rec', links: [] },
  majestic: { text: 'P4 walked round Majestic bus stand for 25 minutes, so we should add a photo of every boarding point', level: 'fact', source: 'diary', links: [], mixed: true },
} as const satisfies Record<string, Atom>;
export type MusafirAtom = keyof typeof ATOMS;
export const MUSAFIR_ATOMS: Record<MusafirAtom, Atom> = ATOMS;

/** The studies behind a note, followed down through its links. */
export const studiesBehind = (k: MusafirAtom, atoms: Record<string, Atom> = MUSAFIR_ATOMS): MusafirStudy[] => {
  const a = atoms[k];
  const own = a.source && a.links.length === 0 ? [a.source] : [];
  const below = a.links.flatMap(l => studiesBehind(l as MusafirAtom, atoms));
  return [...new Set([...own, ...below])].sort() as MusafirStudy[];
};
/** Where a note goes: one thing per note; facts need a source; insights need facts from two studies; a recommendation
 *  needs an insight that holds. */
export const atomLane = (k: MusafirAtom, atoms: Record<string, Atom> = MUSAFIR_ATOMS): AtomLane => {
  const a = atoms[k];
  if (a.mixed) return 'fix';
  if (a.level === 'fact') return a.source ? 'fact' : 'fix';
  if (a.level === 'insight') return a.links.every(l => atoms[l]?.level === 'fact' && atomLane(l as MusafirAtom, atoms) === 'fact')
    && studiesBehind(k, atoms).length >= INSIGHT_STUDIES ? 'insight' : 'fix';
  return a.links.length > 0 && a.links.every(l => atoms[l]?.level === 'insight' && atomLane(l as MusafirAtom, atoms) === 'insight') ? 'rec' : 'fix';
};

// ── Democratizing research safely (rs.6-3, `plan-critique`) ────────────────────────────────────────────────────────

/** What support a squad's research plan gets (`plan-critique` lanes). `go`: run it with the templates and office
 *  hours. `review`: a researcher checks the guide or the sample first. `partner`: a researcher leads or pairs on it.
 *  `stop`: it can't run as planned. */
export const SUPPORT = ['go', 'review', 'partner', 'stop'] as const;
export type Support = (typeof SUPPORT)[number];
/** A squad's plan. `method`: `evaluative` (does this design work), `generative` (what do people need), `survey`.
 *  `people`: `sensitive` when participants could be hurt or exposed by taking part. `stakes`: `high` when a
 *  hard-to-reverse decision rides on it. `breach`: what it does with people's data or consent that isn't allowed. */
export interface ResearchPlan { text: string; who: string; method: 'evaluative' | 'generative' | 'survey'; people: 'general' | 'sensitive'; stakes: 'high' | 'low'; breach?: string }
/** The line of the plan that decides its support. */
export type PlanLine = 'data' | 'people' | 'method' | 'stakes' | 'none';
/** Breaches stop; sensitive participants and big generative questions get a researcher alongside; anything that
 *  isn't a low-stakes evaluation gets a review; the rest goes. */
export const support = (p: ResearchPlan): Support =>
  p.breach ? 'stop'
    : p.people === 'sensitive' || (p.method === 'generative' && p.stakes === 'high') ? 'partner'
      : p.method !== 'evaluative' || p.stakes === 'high' ? 'review' : 'go';
/** Which line set the call, for the red pen. */
export const decidingLine = (p: ResearchPlan): PlanLine =>
  p.breach ? 'data' : p.people === 'sensitive' ? 'people' : p.method !== 'evaluative' ? 'method' : p.stakes === 'high' ? 'stakes' : 'none';
/** Researcher hours each kind of support costs, against running the study themselves. */
export const SUPPORT_HOURS: Record<Support, number> = { go: 1, review: 4, partner: 24, stop: 2 };
export const FULL_STUDY_HOURS = 40;
export const researcherHours = (calls: readonly Support[]) => calls.reduce((s, c) => s + SUPPORT_HOURS[c], 0);

/** Plans squads sent in, the quarter after Musafir opened research to them (`plan-critique` cards). */
const PLANS = {
  seatTest: { text: 'Five unmoderated tests of the new seat map with people from the research panel, using the usability template', who: 'Rohan’s search squad', method: 'evaluative', people: 'general', stakes: 'low' },
  depotWatch: { text: 'Watch three depot clerks use the new trip screen, with the observation template and the signed consent form', who: 'Manoj’s operator squad', method: 'evaluative', people: 'general', stakes: 'low' },
  passCheckout: { text: 'Usability test the Musafir Pass checkout a week before launch, with six panel members', who: 'Aisha’s growth squad', method: 'evaluative', people: 'general', stakes: 'high' },
  priceSurvey: { text: 'Survey 5,000 travellers to pick the price of Musafir Pass', who: 'Aisha’s growth squad', method: 'survey', people: 'general', stakes: 'high' },
  cancelChats: { text: 'Interview six travellers who cancelled last month, to rewrite the support team’s refund replies', who: 'Priya’s support squad', method: 'generative', people: 'general', stakes: 'low' },
  railInterviews: { text: 'Interview eight frequent travellers to decide whether Musafir should sell train tickets', who: 'Vikram, CEO’s office', method: 'generative', people: 'general', stakes: 'high' },
  harassment: { text: 'Call women who reported harassment on a bus, to shape the new safety features', who: 'Kavya’s trust and safety squad', method: 'generative', people: 'sensitive', stakes: 'high' },
  drivers: { text: 'Interview drivers about their shifts and pay, at the operators’ depots, with the operator’s manager nearby', who: 'Manoj’s operator squad', method: 'generative', people: 'sensitive', stakes: 'low' },
  phoneClips: { text: 'Share clips of last week’s traveller calls, recorded on a PM’s own phone, in the squad’s WhatsApp group', who: 'Rohan’s search squad', method: 'evaluative', people: 'general', stakes: 'low', breach: 'Recorded without consent, stored on a personal phone, shared outside the research tools' },
  coldCalls: { text: 'Export 300 travellers’ numbers from the bookings database and call them for feedback this week', who: 'Aisha’s growth squad', method: 'generative', people: 'general', stakes: 'low', breach: 'Booking data used to contact people who never agreed to research' },
} as const satisfies Record<string, ResearchPlan>;
export type MusafirPlan = keyof typeof PLANS;
export const MUSAFIR_PLANS: Record<MusafirPlan, ResearchPlan> = PLANS;
