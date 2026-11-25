// Rasoi's team at work, for chapter ld.1. Rasoi is a home-style tiffin subscription in Bengaluru: subscribers get
// lunch and dinner from its kitchens, and pause or swap meals in the app. Nisha Menon, its product designer, works in
// two-week sprints with Arjun Rao (PM), Devika Pai (engineering lead), Rohan (Android) and Karthik (backend); runs a
// 90-minute workshop on why subscribers pause; and helps Vikram Shetty, the founder, decide which problems deserve a
// five-day design sprint. This is the data the ld.1 scenes and games draw, and the rules they score against: raise
// things where they'll be acted on soonest, steer the room so every voice is heard on time, and spend a sprint only on
// a big, costly decision you already understand.

// ── Design process in agile teams (ld.1-1, `ceremony-route`) ────────────────────────────────────────────────────────

/** Where Nisha raises something during a sprint (`ceremony-route` lanes). `standup`: the 15 minutes every morning,
 *  for what's blocking work today. `refinement`: the mid-sprint session where upcoming stories are shaped, questioned
 *  and sized. `review`: the end-of-sprint demo of working software to stakeholders. `retro`: the team's look at how it
 *  works, straight after the review. */
export const CEREMONIES = ['standup', 'refinement', 'review', 'retro'] as const;
export type Ceremony = (typeof CEREMONIES)[number];
/** Working days in one sprint. Planning is the morning of day 1. */
export const SPRINT_DAYS = 10;
/** The day each meeting happens in a sprint (stand-up: every morning). */
export const CEREMONY_DAY: Record<Exclude<Ceremony, 'standup'>, number> = { refinement: 6, review: 10, retro: 10 };
/** What a thing is about. `blocking`: someone can't carry on building this sprint's work without an answer.
 *  `upcoming`: a story for a later sprint, still being shaped. `built`: working software someone should see.
 *  `process`: how the team works, not what it builds. */
export type About = 'blocking' | 'upcoming' | 'built' | 'process';
/** Something that comes up for Nisha. `day`: the sprint day it comes up, after that morning's stand-up. */
export interface SprintItem { text: string; day: number; about: About }

/** Blockers go to tomorrow's stand-up, upcoming stories to refinement, working software to the review, and how we
 *  work to the retro. */
export const ceremonyFor = (i: SprintItem): Ceremony =>
  i.about === 'blocking' ? 'standup' : i.about === 'upcoming' ? 'refinement' : i.about === 'built' ? 'review' : 'retro';
/** The day a thing gets raised if it waits for `c`: the next stand-up is tomorrow morning; a meeting that has
 *  already happened this sprint means the same meeting next sprint. */
export const raisedOn = (day: number, c: Ceremony) => {
  if (c === 'standup') return day + 1;
  const d = CEREMONY_DAY[c];
  return day < d ? d : d + SPRINT_DAYS;
};
/** Days a thing waits before it's raised at `c`. */
export const waitDays = (i: SprintItem, c: Ceremony = ceremonyFor(i)) => raisedOn(i.day, c) - i.day;
/** Days the blockers among `items` keep someone waiting, given where each is raised. */
export const blockedDays = (items: readonly SprintItem[], where: (i: SprintItem) => Ceremony = ceremonyFor) =>
  items.filter(i => i.about === 'blocking').reduce((s, i) => s + waitDays(i, where(i)), 0);

/** What comes up for Nisha in the sprint that builds "Pause my meals" (`ceremony-route` cards). The next sprint
 *  builds "Swap tomorrow's meal". */
const ITEMS = {
  cutoff: { text: 'Rohan can’t finish the date picker: the design doesn’t say what happens if a pause starts tomorrow, after the 9 pm kitchen cut-off', day: 2, about: 'blocking' },
  refund: { text: 'Karthik needs to know whether paused days refund to the wallet or extend the plan before he builds the API', day: 4, about: 'blocking' },
  smallphone: { text: 'On a small Android phone the calendar is cut off, and Rohan is waiting to hear which way to fix it', day: 7, about: 'blocking' },
  banner: { text: 'Testing finds the pause banner covers the Pay button, and the build goes out tomorrow', day: 9, about: 'blocking' },
  swap: { text: 'Nisha’s tested flow for next sprint’s “Swap tomorrow’s meal”, ready for the developers to question and size', day: 3, about: 'upcoming' },
  oneday: { text: 'Five interviews say people mostly pause for a single day, not a week. Next sprint’s story may split in two', day: 5, about: 'upcoming' },
  diwali: { text: 'An idea for a later sprint: a “Going home for Diwali” pause that covers the whole festival week', day: 8, about: 'upcoming' },
  staging: { text: 'Pausing works end to end on staging, with real menus and the wallet refund', day: 9, about: 'built' },
  wallet: { text: 'The refund now shows in the wallet straight away. Sunita in support has been asking to see it', day: 6, about: 'built' },
  kannada: { text: 'The pause confirmation now reads in Kannada and Hindi as well as English', day: 8, about: 'built' },
  dayone: { text: 'Designs keep reaching the developers on day 1 of the sprint, with no time to ask questions', day: 3, about: 'process' },
  qalate: { text: 'Design QA happens after release, so every fix slips into the next sprint', day: 8, about: 'process' },
} as const satisfies Record<string, SprintItem>;
export type RasoiItem = keyof typeof ITEMS;
export const RASOI_ITEMS: Record<RasoiItem, SprintItem> = ITEMS;

/** The two tracks Nisha works in (the ld.1-1 scene). Discovery runs a sprint ahead; delivery is this sprint's build. */
export const TRACKS = [
  { id: 'discovery', label: 'Discovery', does: 'Interviews, sketches and a tested flow for the next sprint’s stories' },
  { id: 'delivery', label: 'Delivery', does: 'Answering questions, pairing on edge cases and design QA for this sprint’s build' },
] as const;

// ── Facilitating workshops (ld.1-2, `room-read`) ─────────────────────────────────────────────────────────────────────

/** The facilitator's moves (`room-read` lanes). `silent`: everyone writes alone first, then shares or votes at the
 *  same moment. `round`: go round the room, one point each. `park`: write it on the parking lot, with an owner for
 *  after. `timebox`: a short timer, then a decision (a vote, or the decider) and move on. */
export const MOVES = ['silent', 'round', 'park', 'timebox'] as const;
export type Move = (typeof MOVES)[number];
/** What's going wrong in the room. `anchor`: the most senior voice goes first and the room follows it. `echo`: the
 *  first idea said aloud shapes all the rest. `quiet`: people who know things aren't speaking. `dominate`: a few
 *  people take all the airtime. `tangent`: a real issue, but not this workshop's. `loop`: a debate going round
 *  without new information. `overrun`: the plan is running out of time. */
export type RoomProblem = 'anchor' | 'echo' | 'quiet' | 'dominate' | 'tangent' | 'loop' | 'overrun';
/** A moment in the workshop. `minute`: when it happens. `voices`: who gets heard when the move is right.
 *  `cost`: minutes the workshop loses when it isn't. */
export interface RoomMoment { text: string; minute: number; problem: RoomProblem; voices: readonly RasoiPerson[]; cost: number }

/** Who is in the room. Vikram and Arjun speak whatever the facilitator does. */
export const ROOM = ['Vikram', 'Arjun', 'Devika', 'Rohan', 'Karthik', 'Sunita', 'Meghna', 'Ashok'] as const;
export type RasoiPerson = (typeof ROOM)[number];
export const ALWAYS_HEARD: readonly RasoiPerson[] = ['Vikram', 'Arjun'];
export const ROLE_OF: Record<RasoiPerson, string> = {
  Vikram: 'Founder, the decider', Arjun: 'Product manager', Devika: 'Engineering lead, on the call', Rohan: 'Android developer',
  Karthik: 'Backend developer, on the call', Sunita: 'Customer support lead', Meghna: 'Marketing', Ashok: 'Head chef, plans the menus',
};
export const WORKSHOP_MINUTES = 90;

/** Ideas written alone beat the boss's opinion and the first idea said; quiet or crowded rooms go round; tangents
 *  park; loops and overruns get a timer and a decision. */
export const moveFor = (m: RoomMoment): Move =>
  m.problem === 'anchor' || m.problem === 'echo' ? 'silent'
    : m.problem === 'quiet' || m.problem === 'dominate' ? 'round'
      : m.problem === 'tangent' ? 'park' : 'timebox';

/** The moments in Nisha's workshop (`room-read` cards), in the order they happen. */
const MOMENTS = {
  price: { text: 'Before anyone has written a note, Vikram says: “It’s price. People pause because we’re too expensive.”', minute: 14, problem: 'anchor', voices: ['Sunita', 'Ashok'], cost: 0 },
  muted: { text: 'Devika and Karthik, on the call from the other office, haven’t unmuted once', minute: 18, problem: 'quiet', voices: ['Devika', 'Karthik'], cost: 0 },
  chef: { text: 'Ashok plans every menu and hears from the delivery riders daily. He hasn’t said a word', minute: 22, problem: 'quiet', voices: ['Ashok'], cost: 0 },
  gateway: { text: 'Meghna and Karthik start debating whether to change the payment gateway', minute: 27, problem: 'tangent', voices: [], cost: 10 },
  arjun: { text: 'Arjun has shared six ideas. Rohan and Sunita haven’t shared one', minute: 33, problem: 'dominate', voices: ['Rohan', 'Sunita'], cost: 0 },
  discount: { text: 'The ideas round opens aloud. The first idea is “discounts”, and the next four are versions of it', minute: 40, problem: 'echo', voices: ['Meghna', 'Rohan'], cost: 5 },
  dots: { text: 'At the dot vote, Vikram places his dots first, and people start putting theirs beside his', minute: 55, problem: 'anchor', voices: ['Meghna', 'Devika'], cost: 0 },
  pauseskip: { text: 'Fifteen minutes on whether “pause” and “skip” are one feature or two, and no closer', minute: 60, problem: 'loop', voices: [], cost: 15 },
  bug: { text: 'Sunita brings up a refund bug support hears about every day. It isn’t on today’s agenda', minute: 66, problem: 'tangent', voices: [], cost: 8 },
  late: { text: 'Choosing what to test is running ten minutes over, and Vikram has to leave at 4:30', minute: 75, problem: 'overrun', voices: [], cost: 10 },
} as const satisfies Record<string, RoomMoment>;
export type RasoiMoment = keyof typeof MOMENTS;
export const RASOI_MOMENTS: Record<RasoiMoment, RoomMoment> = MOMENTS;

/** How the workshop went, from the facilitator's first call on each moment: who was heard, and how many minutes it ran
 *  over. A right move brings its voices in; a wrong one costs its minutes. */
export const workshopResult = (firstCalls: Partial<Record<RasoiMoment, boolean>>) => {
  const heard = new Set<RasoiPerson>(ALWAYS_HEARD);
  let over = 0;
  for (const k of Object.keys(RASOI_MOMENTS) as RasoiMoment[]) {
    const ok = firstCalls[k];
    if (ok === undefined) continue;
    if (ok) for (const v of RASOI_MOMENTS[k].voices) heard.add(v);
    else over += RASOI_MOMENTS[k].cost;
  }
  return { heard: ROOM.filter(p => heard.has(p)), over };
};

/** Nisha's 90-minute agenda, planned backwards from the outputs (the ld.1-2 scene and lesson). */
export interface AgendaBlock { minutes: number; activity: string; output: string }
export const WORKSHOP_GOAL = 'Why do subscribers pause, and which two ideas do we test first?';
export const WORKSHOP_OUTPUTS = ['The top reasons people pause, from data, not opinion', 'Two ideas to test, each with an owner', 'A parking lot with an owner for every item'] as const;
export const AGENDA: readonly AgendaBlock[] = [
  { minutes: 10, activity: 'Goal, outputs and how we’ll work', output: 'Everyone knows what we leave with' },
  { minutes: 15, activity: 'What we know: support tickets, pause data, three interview clips', output: 'Shared facts on the wall' },
  { minutes: 15, activity: 'Why do people pause? Notes written alone, then grouped', output: 'Reasons, grouped' },
  { minutes: 20, activity: 'Ideas: four sketches each, alone, then shared', output: 'About 30 ideas' },
  { minutes: 15, activity: 'Dot vote at the same time, then impact against effort', output: 'A shortlist of five' },
  { minutes: 10, activity: 'Vikram picks two to test; owners and dates', output: 'Two ideas, two owners' },
  { minutes: 5, activity: 'Recap, parking lot owners, thank-you', output: 'Notes out the same day' },
];
export const agendaMinutes = (a: readonly AgendaBlock[]) => a.reduce((s, b) => s + b.minutes, 0);

// ── Design sprints (ld.1-3, `sprint-fit`) ────────────────────────────────────────────────────────────────────────────

/** How to answer a question (`sprint-fit` lanes). `sprint`: a five-day design sprint with the decider in the room.
 *  `test`: prototype the one design and test it with five people in a few days. `research`: go and understand the
 *  problem first. `build`: just build it, and watch what happens. */
export const SPRINT_CALLS = ['sprint', 'test', 'research', 'build'] as const;
export type SprintCall = (typeof SPRINT_CALLS)[number];
/** A question on Rasoi's list. `understood`: the team knows the problem and who has it. `costly`: getting it wrong is
 *  expensive or slow to undo. `open`: many ways to solve it, and several teams have to agree. */
export interface SprintQuestion { text: string; understood: boolean; costly: boolean; open: boolean }
/** Understand the problem before you sprint on it; build what's cheap to undo; sprint on big, open, costly calls; test
 *  the rest. */
export const sprintCall = (q: SprintQuestion): SprintCall =>
  !q.understood ? 'research' : !q.costly ? 'build' : q.open ? 'sprint' : 'test';
/** Team-days each call takes before there's an answer: a sprint is five days for seven people. */
export const CALL_DAYS: Record<SprintCall, { days: number; people: number }> = {
  sprint: { days: 5, people: 7 }, test: { days: 3, people: 2 }, research: { days: 8, people: 2 }, build: { days: 0, people: 0 },
};
export const teamDays = (c: SprintCall) => CALL_DAYS[c].days * CALL_DAYS[c].people;
/** Team-days a set of calls spends deciding. */
export const daysSpent = (calls: readonly SprintCall[]) => calls.reduce((s, c) => s + teamDays(c), 0);

/** Rasoi's list for the quarter (`sprint-fit` cards). */
const QUESTIONS = {
  offices: { text: 'Should Rasoi sell lunch plans to offices? Sales, the kitchens, pricing and the app would all change', understood: true, costly: true, open: true },
  family: { text: 'A family plan with meals to several addresses: routes, pricing and the app change, and three teams each have a different idea', understood: true, costly: true, open: true },
  checkout: { text: 'The new plan checkout is already designed. If it’s wrong, every new subscription suffers', understood: true, costly: true, open: false },
  onboard: { text: 'Replace the five-screen sign-up with the three-step one Nisha has designed', understood: true, costly: true, open: false },
  pune: { text: 'Subscribers in Pune cancel twice as often as in Bengaluru, and nobody knows why', understood: false, costly: true, open: true },
  week2: { text: 'Why do so many people stop opening the app in their second week?', understood: false, costly: true, open: true },
  kitchen: { text: 'A tablet app for cooks to mark meals packed. Nobody on the product team has watched a kitchen shift', understood: false, costly: true, open: false },
  label: { text: 'Rename the “Hold” button to “Pause meals”', understood: true, costly: false, open: false },
  typo: { text: 'Fix the wrong dish name in Tuesday’s Kannada menu', understood: true, costly: false, open: false },
  dark: { text: 'Add a dark theme to the menu screen, behind a setting', understood: true, costly: false, open: true },
} as const satisfies Record<string, SprintQuestion>;
export type RasoiQuestion = keyof typeof QUESTIONS;
export const RASOI_QUESTIONS: Record<RasoiQuestion, SprintQuestion> = QUESTIONS;

/** The five days of the office-lunch sprint (the ld.1-3 scene). */
export const SPRINT_WEEK = [
  { day: 'Mon', name: 'Map', makes: 'A long-term goal, sprint questions, a map of the journey and one target on it' },
  { day: 'Tue', name: 'Sketch', makes: 'Lightning demos, then a detailed solution sketch from each person, alone' },
  { day: 'Wed', name: 'Decide', makes: 'Silent critique, a heat map of dots, and the decider’s supervote; then a storyboard' },
  { day: 'Thu', name: 'Prototype', makes: 'A realistic facade of the storyboard, just enough to test' },
  { day: 'Fri', name: 'Test', makes: 'Five interviews with real customers, the team watching and noting patterns' },
] as const;
/** The sprint questions, and what each of Friday's five office admins did (true: yes, false: no, null: didn't get
 *  that far). */
export const FRIDAY = [
  { question: 'Will an office admin sign up without a sales call?', results: [true, true, false, true, true] },
  { question: 'Do they understand per-meal pricing?', results: [false, false, true, false, false] },
  { question: 'Can staff choose their own meals without the admin?', results: [true, null, true, false, null] },
] as const satisfies readonly { question: string; results: readonly (boolean | null)[] }[];
/** A pattern needs three of five: three yes is a yes, three no is a no; anything less is unclear. */
export const fridayVerdict = (results: readonly (boolean | null)[]): 'yes' | 'no' | 'unclear' =>
  results.filter(r => r === true).length >= 3 ? 'yes' : results.filter(r => r === false).length >= 3 ? 'no' : 'unclear';
