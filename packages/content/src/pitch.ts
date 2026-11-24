// Saman's restock pitch, for chapter bz.2. Saman is a B2B ordering app that 40,000 kirana shops use to restock from
// wholesale distributors. Neha Iyer, its product designer, has five minutes at Monday's leadership review to win two
// engineers for six weeks. This is the data the bz.2 scenes and games draw, and the rules they score against: the
// story a pitch has to tell, the replies that survive an objection, and the exec summary that gets read.
import { readSeconds, wordCount } from './episode';

// ── The story (bz.2-1, `story-strip`) ────────────────────────────────────────────────────────────────────────────

/** The spine of a pitch, in the order it's told (`story-strip` lanes). */
export const PITCH_PARTS = ['situation', 'complication', 'resolution', 'ask'] as const;
export type PitchPart = (typeof PITCH_PARTS)[number];
/** Neha's slot at the leadership review. */
export const PITCH_SECONDS = 300;
/** Execs decide early whether to listen. By the end of the first minute they should know what's wrong. */
export const PROBLEM_BY = 60;
/** What a pitch can get wrong, in the order the checks run. */
export const PITCH_FLAWS = ['long', 'late', 'process', 'noask'] as const;
export type PitchFlaw = (typeof PITCH_FLAWS)[number];
/** One slide or spoken beat. `process` is a beat about how the team worked rather than what the audience must decide. */
export interface PitchBeat { text: string; part: PitchPart | 'process'; secs: number }

/** Where each beat starts and ends, in seconds, told in the order given. */
export const pitchTimeline = <B extends PitchBeat>(beats: readonly B[]) => {
  let at = 0;
  return beats.map(b => { const start = at; at += b.secs; return { beat: b, start, end: at }; });
};
export const pitchLength = (beats: readonly PitchBeat[]) => beats.reduce((s, b) => s + b.secs, 0);
/** Every flaw in a pitch: over time, the problem arriving after the first minute (or never), time spent on process,
 *  and no clear ask at the end. */
export const pitchFlaws = (beats: readonly PitchBeat[]): PitchFlaw[] => {
  const line = pitchTimeline(beats);
  const problem = line.find(l => l.beat.part === 'complication');
  return [
    ...(pitchLength(beats) > PITCH_SECONDS ? ['long' as const] : []),
    ...(!problem || problem.start >= PROBLEM_BY ? ['late' as const] : []),
    ...(beats.some(b => b.part === 'process') ? ['process' as const] : []),
    ...(beats.at(-1)?.part !== 'ask' ? ['noask' as const] : []),
  ];
};
/** Keys in story order: situation, complication, resolution, ask. Beats in the same part keep their order. */
export const pitchOrder = <K extends string>(keys: readonly K[], partOf: (k: K) => PitchPart) =>
  keys.map((k, i) => ({ k, i })).sort((a, b) => PITCH_PARTS.indexOf(partOf(a.k)) - PITCH_PARTS.indexOf(partOf(b.k)) || a.i - b.i).map(x => x.k);

/** The beats of Neha's rebuilt pitch (`story-strip` cards). */
export const SAMAN_BEATS = {
  ramesh: { text: 'Ramesh runs a kirana in Indore. Every Sunday night he restocks about 60 items on Saman.', part: 'situation', secs: 30 },
  stakes: { text: 'Restock orders are 70% of what flows through Saman: ₹4.2 crore a month.', part: 'situation', secs: 25 },
  minutes: { text: 'A restock takes him 19 minutes in our app. With the distributor’s salesman and a notebook, it took 6.', part: 'complication', secs: 35 },
  carts: { text: '38% of restock carts are never sent. Shopkeepers phone the salesman instead, and the order leaves Saman.', part: 'complication', secs: 30 },
  reorder: { text: 'The new flow opens on last week’s order. Ramesh changes a few quantities and sends it in three taps.', part: 'resolution', secs: 40 },
  tested: { text: 'With eight shopkeepers in Indore and Nagpur, restocking fell from 19 minutes to 4.', part: 'resolution', secs: 30 },
  ask: { text: 'I’m asking for two engineers for six weeks, starting 1 December.', part: 'ask', secs: 20 },
  measure: { text: 'We’ll call it a win if unsent carts fall from 38% to under 20% by March.', part: 'ask', secs: 20 },
} as const satisfies Record<string, PitchBeat>;
export type SamanBeat = keyof typeof SAMAN_BEATS;
/** Neha's first deck, in the order the work happened (the bz.2-1 scene). */
export const NEHA_FIRST_DECK: readonly PitchBeat[] = [
  { text: 'Our research plan', part: 'process', secs: 60 },
  { text: '12 interviews and the affinity map', part: 'process', secs: 70 },
  { text: 'Three personas', part: 'process', secs: 50 },
  { text: 'Wireframes, rounds one to three', part: 'process', secs: 90 },
  { text: 'The new restock flow', part: 'resolution', secs: 60 },
  { text: 'Oh, and restock takes 19 minutes', part: 'complication', secs: 40 },
  { text: 'Questions?', part: 'resolution', secs: 10 },
];

// ── Objections (bz.2-2, `objection-reply`) ──────────────────────────────────────────────────────────────────────────

/** What an objection is really worried about (`objection-reply` lanes). */
export const OBJECTION_KINDS = ['cost', 'risk', 'proof', 'priority'] as const;
export type ObjectionKind = (typeof OBJECTION_KINDS)[number];
/** What a reply can get wrong, in the order the checks run. */
export const REPLY_FLAWS = ['defensive', 'caves', 'vague', 'dismissive'] as const;
export type ReplyFlaw = (typeof REPLY_FLAWS)[number];
/** A reply in the room. `ack`: it names the worry back before answering. `concrete`: a number, a fact or a dated plan.
 *  `attack`: it argues with the person, not the point. `concede`: it drops the plan with no reason. */
export interface Reply { text: string; ack?: boolean; concrete?: boolean; attack?: boolean; concede?: boolean }
/** The first thing wrong with a reply, or null when it lands. */
export const replyFlaw = (r: Reply): ReplyFlaw | null =>
  r.attack ? 'defensive' : r.concede ? 'caves' : !r.concrete ? 'vague' : !r.ack ? 'dismissive' : null;
/** How the room's trust moves after a reply (the game's meter, −2…+2). */
export const replyTrust = (f: ReplyFlaw | null) => (f === null ? 2 : f === 'defensive' ? -2 : -1);
export interface Objection { who: string; role: string; text: string; kind: ObjectionKind; replies: readonly [Reply, Reply, Reply] }

/** What the leadership team says after the pitch (`objection-reply` cards). Each has three replies, exactly one that lands. */
export const SAMAN_OBJECTIONS = {
  cost: { who: 'Farah', role: 'CFO', kind: 'cost', text: 'Two engineers for six weeks is about ₹9 lakh. What do we get back?',
    replies: [
      { text: 'Good design always pays for itself. Finance never sees the value of UX.', attack: true },
      { text: 'Fair question. Unsent carts are about ₹1.6 crore of orders a month. Win back a tenth of them and it pays for itself in the first month.', ack: true, concrete: true },
      { text: 'It will really improve the experience, and happier shopkeepers order more.', ack: true },
    ] },
  oneEngineer: { who: 'Farah', role: 'CFO', kind: 'cost', text: 'Can you do it with one engineer instead of two?',
    replies: [
      { text: 'Sure, one is fine.', concede: true },
      { text: 'If you want it done badly, yes.', attack: true },
      { text: 'We could. It would take twelve weeks, so it lands after the March target. If one is all we have, I’d cut bulk edit and keep six weeks.', ack: true, concrete: true },
    ] },
  lost: { who: 'Sanjay', role: 'CTO', kind: 'risk', text: 'Forty thousand shops know the old order screen. Change it and they’ll be lost.',
    replies: [
      { text: 'That’s the risk I worry about too. So it goes to 10% of shops first, with the old screen one tap away, and we watch support calls for two weeks.', ack: true, concrete: true },
      { text: 'You’re right, let’s leave the order screen and just refresh the colours.', concede: true },
      { text: 'Seven of eight shopkeepers in the test finished faster first time, so there’s nothing to worry about.', concrete: true },
    ] },
  december: { who: 'Sanjay', role: 'CTO', kind: 'risk', text: 'The wedding season is our busiest stretch for orders. Is it safe to ship in the middle of it?',
    replies: [
      { text: 'It should be fine; we’ll be careful.' },
      { text: 'Agreed, we shouldn’t touch the live flow in peak weeks. We build in December and switch it on for 10% on 6 January, after the rush.', ack: true, concrete: true },
      { text: 'Then let’s drop it.', concede: true },
    ] },
  eight: { who: 'Vikram', role: 'COO', kind: 'proof', text: 'Eight shopkeepers is a tiny test. How do you know it holds for forty thousand?',
    replies: [
      { text: 'We feel strongly it will work for everyone.' },
      { text: 'It’s standard practice. You’d know that if you’d read the research.', attack: true },
      { text: 'You’re right that eight can’t prove the size of the win; it finds what’s broken. The 10% rollout measures carts sent against the old flow, and we decide on 15 January.', ack: true, concrete: true },
    ] },
  credit: { who: 'Arjun', role: 'Head of Sales', kind: 'priority', text: 'Distributors want credit limits in the app, not a new order screen. Why this first?',
    replies: [
      { text: 'Credit limits matter, and they only pay off if orders go through the app. Today 38% of carts are never sent, so fixing that first makes credit worth more.', ack: true, concrete: true },
      { text: 'Sales always wants the next shiny feature.', attack: true },
      { text: 'Okay, let’s do credit limits first and come back to this next year.', concede: true },
    ] },
} as const satisfies Record<string, Objection>;
export type SamanObjection = keyof typeof SAMAN_OBJECTIONS;
/** The index of the reply that lands. */
export const goodReply = (o: Objection) => o.replies.findIndex(r => replyFlaw(r) === null);

// ── The exec summary (bz.2-3, `summary-build`) ──────────────────────────────────────────────────────────────────────

/** The parts of an exec summary, top to bottom, and the bin (`summary-build` lanes). */
export const SUMMARY_PARTS = ['ask', 'why', 'plan', 'cut'] as const;
export type SummaryPart = (typeof SUMMARY_PARTS)[number];
/** What a summary can get wrong, in the order the checks run. */
export const SUMMARY_FLAWS = ['buried', 'long', 'jargon', 'vague'] as const;
export type SummaryFlaw = (typeof SUMMARY_FLAWS)[number];
/** An exec reads it in the gap between two meetings: half a minute. */
export const SUMMARY_SECONDS = 30;
/** How much of an email the inbox shows before you open it. */
export const PREVIEW_CHARS = 90;
/** Words that mean something to designers and nothing to a CFO (matched as word stems). */
export const JARGON_STEMS = ['affinit', 'synthes', 'heuristic', 'persona', 'usabilit', 'wirefram', 'fidelity', 'affordanc', 'touchpoint', 'ux'] as const;
/** The jargon words in a sentence, as written. */
export const jargonIn = (text: string) =>
  text.split(/\s+/).filter(w => { const s = w.toLowerCase().replace(/[^\p{L}]/gu, ''); return s && JARGON_STEMS.some(j => (j === 'ux' ? s === 'ux' : s.startsWith(j))); });
/** What the inbox shows of an email: its first characters. */
export const inboxPreview = (text: string, n: number = PREVIEW_CHARS) => (text.length <= n ? text : `${text.slice(0, n - 1).trimEnd()}…`);
export interface SummaryLine { text: string; part: SummaryPart }
/** Every flaw in a summary written as these lines, in this order: the decision isn't the first line, it takes over
 *  half a minute to read, it uses design jargon, or nothing in it carries a number. */
export const summaryFlaws = (lines: readonly SummaryLine[]): SummaryFlaw[] => {
  const text = lines.map(l => l.text).join(' ');
  return [
    ...(lines[0]?.part !== 'ask' ? ['buried' as const] : []),
    ...(readSeconds(text) > SUMMARY_SECONDS ? ['long' as const] : []),
    ...(jargonIn(text).length ? ['jargon' as const] : []),
    ...(!/\d/.test(text) ? ['vague' as const] : []),
  ];
};
export const summaryWords = (lines: readonly SummaryLine[]) => wordCount(lines.map(l => l.text).join(' '));

/** The sentences of Neha's 600-word update, each tagged with where it goes in the summary (`summary-build` cards). */
export const SAMAN_UPDATE = {
  hello: { text: 'Here’s an update on the restock research the design team has been running since September.', part: 'cut' },
  affinity: { text: 'We ran an affinity mapping workshop to synthesise 12 interviews into five themes.', part: 'cut' },
  personas: { text: 'We built three personas: Ramesh, Sunita and Imran.', part: 'cut' },
  heuristic: { text: 'A heuristic evaluation found 23 usability issues across the flow.', part: 'cut' },
  figma: { text: 'The prototype has 46 screens in Figma, linked below.', part: 'cut' },
  minutes: { text: 'A restock takes shopkeepers 19 minutes in the app, against 6 on paper.', part: 'why' },
  carts: { text: '38% of restock carts are never sent: about ₹1.6 crore of orders a month.', part: 'why' },
  tested: { text: 'In tests with eight shopkeepers, the new flow cut restocking to 4 minutes.', part: 'why' },
  rollout: { text: 'It goes to 10% of shops on 6 January, and we decide on the rest by 15 January from carts sent.', part: 'plan' },
  target: { text: 'Success is unsent carts under 20% by March.', part: 'plan' },
  ask: { text: 'Decision needed by Friday: two engineers for six weeks from 1 December, to rebuild restock.', part: 'ask' },
} as const satisfies Record<string, SummaryLine>;
export type SamanLine = keyof typeof SAMAN_UPDATE;
/** The order Neha first wrote them in: the story of the project, with the ask at the bottom (the bz.2-3 scene). */
export const NEHA_UPDATE_ORDER: readonly SamanLine[] = ['hello', 'affinity', 'personas', 'heuristic', 'minutes', 'carts', 'tested', 'figma', 'rollout', 'target', 'ask'];
/** A summary built from the kept lines, in part order: ask, why, plan. */
export const buildSummary = (keys: readonly SamanLine[]) =>
  SUMMARY_PARTS.filter(p => p !== 'cut').flatMap(p => keys.filter(k => SAMAN_UPDATE[k].part === p));
