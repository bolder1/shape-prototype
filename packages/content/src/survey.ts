// Bolo's quant research, for chapter rs.5. Bolo is a spoken-English app for students and job-seekers in Lucknow,
// Indore, Coimbatore and Patna: about 2.4 lakh people practise each month, on a 7-day free trial and then ₹249 a
// month. Tanushree Bose leads its research; Kunal Bhatia is the product manager, Rehan Siddiqui the analyst and
// Aparna Iyer the product designer. Bolo has to choose between two directions for next year: "Live rooms" (small
// speaking groups with a tutor, three evenings a week) and "Daily drills" (ten-minute self-paced speaking drills with
// instant feedback). This is the data the rs.5 scenes and games draw, and the rules they score against. The
// sampling maths is here; the two-proportion test comes from ./stats (gr.3).
import { normInv, twoProp, type Arm } from './stats';

// ── Survey design & sampling (rs.5-1, `survey-spot`) ────────────────────────────────────────────────────────────────

/** Where a survey item goes wrong, in the order Tanushree checks (`survey-spot` lanes): the question itself, its
 *  answer options, who gets asked; or nothing, it's sound. */
export const SURVEY_PARTS = ['stem', 'options', 'sample', 'sound'] as const;
export type SurveyPart = (typeof SURVEY_PARTS)[number];
/** Flaws in the wording, which only a reader can see. `leading`: it suggests the answer it wants. `double`: two
 *  questions in one, so an answer can't say which it's about. `hypothetical`: it asks what someone would do in
 *  future, which people over-claim; ask what they did last time instead. */
export type StemFlaw = 'leading' | 'double' | 'hypothetical';
/** One answer option. `tone`: where it sits on an evaluative scale (−2 to 2, 0 neutral). `range`: the numbers it
 *  covers, inclusive (`Infinity` for "or more"). `out`: an honest way out, like "None of these" or "Something else". */
export interface SurveyOption { label: string; tone?: number; range?: readonly [number, number]; out?: boolean }
/** A question as it would go out, and who it would go to. `needsOut`: some honest respondents fit none of the
 *  options, so the list needs a way out. `covers`: the way it's sent can reach everyone the decision is about.
 *  `random`: who answers is chosen by Bolo, at random, not by who happens to tap. */
export interface SurveyItem {
  stem: string; stemFlaw?: StemFlaw; options: readonly SurveyOption[]; needsOut?: boolean;
  audience: string; covers: boolean; random: boolean;
}
export type OptionFlaw = 'overlap' | 'gap' | 'unbalanced' | 'no-out';
export type SampleFlaw = 'coverage' | 'self-selected';

/** What's wrong with the answer options, if anything: number ranges that overlap or leave a gap (in the order
 *  given), a rating scale with more positive than negative options, or no way out when one is needed. */
export const optionFlaw = (item: Pick<SurveyItem, 'options' | 'needsOut'>): OptionFlaw | null => {
  const ranges = item.options.flatMap(o => (o.range ? [o.range] : []));
  for (let i = 1; i < ranges.length; i++) {
    if (ranges[i][0] <= ranges[i - 1][1]) return 'overlap';
    if (ranges[i][0] > ranges[i - 1][1] + 1) return 'gap';
  }
  const tones = item.options.flatMap(o => (o.tone === undefined ? [] : [o.tone]));
  if (tones.length && tones.filter(t => t > 0).length !== tones.filter(t => t < 0).length) return 'unbalanced';
  if (item.needsOut && !item.options.some(o => o.out)) return 'no-out';
  return null;
};
/** What's wrong with who gets asked: a channel that can't reach everyone the decision is about is worse than a
 *  self-selected sample, because no amount of answers fixes it. */
export const sampleFlaw = (item: Pick<SurveyItem, 'covers' | 'random'>): SampleFlaw | null =>
  !item.covers ? 'coverage' : !item.random ? 'self-selected' : null;
/** The first part of an item that's broken, or `sound`. */
export const surveyFlaw = (item: SurveyItem): SurveyPart =>
  item.stemFlaw ? 'stem' : optionFlaw(item) ? 'options' : sampleFlaw(item) ? 'sample' : 'sound';

/** z for a two-sided interval at `conf`. */
export const zFor = (conf = 0.95) => normInv(1 - (1 - conf) / 2);
/** The margin of error of one share from a simple random sample of `n`: z·√(p(1−p)/n), with the finite-population
 *  correction √((N−n)/(N−1)) when the population `N` is known. p = 0.5 is the worst case, which is what a survey
 *  quotes. It measures chance only: it says nothing about bias from a leading question or a skewed sample. */
export const moe = (n: number, p = 0.5, conf = 0.95, N = Infinity) => {
  const fpc = Number.isFinite(N) ? Math.sqrt((N - n) / (N - 1)) : 1;
  return zFor(conf) * Math.sqrt((p * (1 - p)) / n) * fpc;
};
/** Responses needed for margin `e`: n₀ = z²p(1−p)/e², then n₀ / (1 + (n₀−1)/N) for a known population. Rounded
 *  up. ±5 points at 95% is the familiar 385. */
export const responsesFor = (e: number, p = 0.5, conf = 0.95, N = Infinity) => {
  const n0 = (zFor(conf) ** 2 * p * (1 - p)) / (e * e);
  return Math.ceil(Number.isFinite(N) ? n0 / (1 + (n0 - 1) / N) : n0);
};
/** Invitations to send for `n` responses at a given response rate. */
export const invitesFor = (n: number, rate: number) => Math.ceil(n / rate);

/** Bolo's draft survey, as Kunal and the team first wrote it (`survey-spot` cards). Each has at most one broken
 *  part. */
const RANDOM = 'SMS and WhatsApp to 1,200 people picked at random from everyone who signed up June–October, lapsed or not, with two reminders';
const ITEMS = {
  confidence: {
    stem: 'Wouldn’t live practice with a tutor help your confidence?', stemFlaw: 'leading',
    options: [{ label: 'Yes' }, { label: 'No' }, { label: 'Not sure', out: true }],
    audience: RANDOM, covers: true, random: true,
  },
  lessonPrice: {
    stem: 'How satisfied are you with Bolo’s lessons and price?', stemFlaw: 'double',
    options: [{ label: 'Very satisfied', tone: 2 }, { label: 'Satisfied', tone: 1 }, { label: 'Neither', tone: 0 }, { label: 'Dissatisfied', tone: -1 }, { label: 'Very dissatisfied', tone: -2 }],
    audience: RANDOM, covers: true, random: true,
  },
  wouldJoin: {
    stem: 'Would you join a live speaking room three evenings a week?', stemFlaw: 'hypothetical',
    options: [{ label: 'Yes' }, { label: 'Maybe' }, { label: 'No' }],
    audience: RANDOM, covers: true, random: true,
  },
  minutes: {
    stem: 'How many minutes did you practise English yesterday?',
    options: [{ label: '0', range: [0, 0] }, { label: '1–10', range: [1, 10] }, { label: '10–20', range: [10, 20] }, { label: '20 or more', range: [20, Infinity] }],
    audience: RANDOM, covers: true, random: true,
  },
  rating: {
    stem: 'How would you rate today’s lesson?',
    options: [{ label: 'Excellent', tone: 2 }, { label: 'Very good', tone: 1 }, { label: 'Good', tone: 1 }, { label: 'Average', tone: 0 }, { label: 'Poor', tone: -1 }],
    audience: RANDOM, covers: true, random: true,
  },
  goal: {
    stem: 'What is your main reason for learning English?', needsOut: true,
    options: [{ label: 'Job interviews' }, { label: 'College exams' }, { label: 'Calls at work' }, { label: 'Travel' }],
    audience: RANDOM, covers: true, random: true,
  },
  popup: {
    stem: 'In your last practice session, which of these did you do?',
    options: [{ label: 'Speaking drills' }, { label: 'Grammar videos' }, { label: 'Vocabulary cards' }, { label: 'None of these', out: true }],
    audience: 'A pop-up at the end of a lesson, this week, for anyone who taps “Give feedback”', covers: false, random: false,
  },
  lapsed: {
    stem: 'What made you stop practising with Bolo?', needsOut: true,
    options: [{ label: 'Price' }, { label: 'No time' }, { label: 'Didn’t feel I was improving' }, { label: 'Something else', out: true }],
    audience: 'An in-app message to everyone who hasn’t practised in 30 days', covers: false, random: true,
  },
  lastWeek: {
    stem: 'In the last 7 days, on how many days did you practise English?',
    options: [{ label: 'None', range: [0, 0] }, { label: '1–2', range: [1, 2] }, { label: '3–4', range: [3, 4] }, { label: '5–7', range: [5, 7] }],
    audience: RANDOM, covers: true, random: true,
  },
  evenings: {
    stem: 'Last week, on which evenings were you free for 30 minutes between 7 and 10 pm?', needsOut: true,
    options: [{ label: 'Weekdays only' }, { label: 'Weekends only' }, { label: 'Both' }, { label: 'Neither', out: true }],
    audience: RANDOM, covers: true, random: true,
  },
} as const satisfies Record<string, SurveyItem>;
export const BOLO_ITEMS: Record<keyof typeof ITEMS, SurveyItem> = ITEMS;
export type BoloItem = keyof typeof ITEMS;
/** The fixed survey's numbers: 1,200 invites, and the 41% who answered. */
export const BOLO_FIELD = { invites: 1200, responded: 492 } as const;

// ── Statistical significance, intuitively (rs.5-2, `gap-read`) ──────────────────────────────────────────────────────

/** What a gap in survey or test results means for the decision (`gap-read` lanes). `real`: bigger than chance and
 *  at least as big as the smallest gap that would change the decision. `small`: bigger than chance, but smaller than
 *  that. `none`: could be chance, and the whole interval sits inside the gap that would matter, so there's no
 *  difference worth having. `unclear`: could be chance, but the interval also reaches gaps that would matter: ask
 *  more people before deciding. */
export const GAP_CALLS = ['real', 'small', 'none', 'unclear'] as const;
export type GapCall = (typeof GAP_CALLS)[number];
/** A gap to read. `between`: two separate groups (a: the first, b: the second), compared as B − A. `lead`: two
 *  answers to one question in the same sample of `a.n` people (a.x and b.x choose each), so the two shares move
 *  together. `matters`: the smallest gap, as a proportion, that would change what Bolo does. */
export interface GapRead {
  text: string; kind: 'between' | 'lead'; a: Arm & { label: string }; b: Arm & { label: string }; matters: number;
}
/** The gap (B − A) and its 95% interval. Between groups: the two-proportion (Wald) interval from ./stats. A lead in
 *  one sample: the variance of p̂b − p̂a is (pa + pb − (pa − pb)²)/n, because one person's choice of A is a choice
 *  against B. That makes a lead roughly twice as noisy as either share on its own. */
export const gapInterval = (r: GapRead, conf = 0.95) => {
  if (r.kind === 'between') { const t = twoProp(r.a, r.b, conf); return { diff: t.diff, lo: t.ci[0], hi: t.ci[1], half: (t.ci[1] - t.ci[0]) / 2 }; }
  const n = r.a.n, pa = r.a.x / n, pb = r.b.x / n, diff = pb - pa;
  const half = zFor(conf) * Math.sqrt((pa + pb - diff * diff) / n);
  return { diff, lo: diff - half, hi: diff + half, half };
};
/** Read the gap: is zero inside the interval? Then is it big enough, or is the interval tight enough to rule out a
 *  gap that matters? */
export const gapCall = (r: GapRead): GapCall => {
  const { diff, lo, hi } = gapInterval(r);
  if (lo > 0 || hi < 0) return Math.abs(diff) >= r.matters ? 'real' : 'small';
  return lo > -r.matters && hi < r.matters ? 'none' : 'unclear';
};
/** How close an estimate of the ± margin is, both in percentage points: spot on within 1, close within a quarter
 *  (at least 2). */
export const marginGrade = (guess: number, truth: number): 'spot' | 'close' | 'off' => {
  const d = Math.abs(guess - truth);
  return d <= 1 ? 'spot' : d <= Math.max(2, truth / 4) ? 'close' : 'off';
};
/** The most points the `gap-read` dial shows. */
export const MARGIN_MAX = 25;

/** Gaps Bolo's team wants to act on (`gap-read` cards). */
const GAPS = {
  headline: { text: 'First survey: which would you use more?', kind: 'lead', a: { label: 'Live rooms', n: 492, x: 216 }, b: { label: 'Daily drills', n: 492, x: 256 }, matters: 0.05 },
  followup: { text: 'The same question, to a bigger random sample', kind: 'lead', a: { label: 'Live rooms', n: 1600, x: 624 }, b: { label: 'Daily drills', n: 1600, x: 880 }, matters: 0.05 },
  jobseekers: { text: 'Who would use live rooms more: students or job-seekers?', kind: 'between', a: { label: 'Students', n: 320, x: 99 }, b: { label: 'Job-seekers', n: 400, x: 232 }, matters: 0.1 },
  lessonScreen: { text: 'Lessons rated 4 or 5 stars: old lesson screen against the new one', kind: 'between', a: { label: 'Old screen', n: 8000, x: 6100 }, b: { label: 'New screen', n: 8000, x: 6290 }, matters: 0.05 },
  cities: { text: '“Good value for money”: Lucknow against Coimbatore', kind: 'between', a: { label: 'Lucknow', n: 3000, x: 1830 }, b: { label: 'Coimbatore', n: 3000, x: 1740 }, matters: 0.08 },
  voice: { text: '“Easy to follow”: drills read by a male voice against a female voice', kind: 'between', a: { label: 'Male voice', n: 1200, x: 840 }, b: { label: 'Female voice', n: 1200, x: 846 }, matters: 0.05 },
  reminder: { text: 'Practised that day: reminder at 7 am against 8 pm', kind: 'between', a: { label: '7 am', n: 2000, x: 820 }, b: { label: '8 pm', n: 2000, x: 832 }, matters: 0.05 },
  women30: { text: 'Prefer live rooms: women over 30 against everyone else', kind: 'between', a: { label: 'Everyone else', n: 462, x: 198 }, b: { label: 'Women over 30', n: 30, x: 18 }, matters: 0.1 },
} as const satisfies Record<string, GapRead>;
export const BOLO_GAPS: Record<keyof typeof GAPS, GapRead> = GAPS;
export type BoloGap = keyof typeof GAPS;

// ── Analytics as research (rs.5-3, `signal-gate`) ──────────────────────────────────────────────────────────────────

/** The gates a number from the dashboard passes before anyone acts on it (`signal-gate` lanes), and where it stops.
 *  `instrument`: the number doesn't mean what it used to; fix the data. `segment`: one slice, or a change in the
 *  mix of people, explains it; look there, not at everyone. `ask`: the data says what happened, not why; go and
 *  ask, with interviews, a short survey or sessions. `act`: the question was one behaviour data answers; act on it. */
export const GATES = ['instrument', 'segment', 'ask', 'act'] as const;
export type Gate = (typeof GATES)[number];
/** One slice of people, before and after: how many, and how many did the thing. */
export interface Segment { name: string; before: Arm; after: Arm }
/** A signal from Bolo's dashboard. `broken`: what changed in how it's measured, if anything. `segments`: the same
 *  rate split by a slice. `answers`: the question being asked is about what, when, where or how many, which
 *  behaviour data can answer; a "why" is not. */
export interface DashSignal { text: string; metric: string; broken?: string; segments?: readonly Segment[]; answers: boolean }
export const SIGNAL_ALPHA = 0.05;
const total = (segs: readonly Segment[], k: 'before' | 'after'): Arm => segs.reduce((s, g) => ({ n: s.n + g[k].n, x: s.x + g[k].x }), { n: 0, x: 0 });
/** The overall change, and each slice's, as two-proportion tests of after against before. */
export const segmentChanges = (segs: readonly Segment[]) => ({
  overall: twoProp(total(segs, 'before'), total(segs, 'after')),
  slices: segs.map(g => ({ name: g.name, ...twoProp(g.before, g.after) })),
});
/** What the split says. `mix`: the overall rate moved significantly, but no slice moved significantly the same way,
 *  so the change is in who the people are, not what they do (Simpson's paradox at its mildest). `one`: exactly one
 *  slice moved significantly, the same way as the total. Otherwise null: the change is everywhere. */
export const segmentStory = (segs?: readonly Segment[]): 'mix' | 'one' | null => {
  if (!segs || segs.length < 2) return null;
  const { overall, slices } = segmentChanges(segs);
  if (overall.p >= SIGNAL_ALPHA) return null;
  const moved = slices.filter(s => s.p < SIGNAL_ALPHA), same = moved.filter(s => Math.sign(s.diff) === Math.sign(overall.diff));
  return same.length === 0 ? 'mix' : moved.length === 1 ? 'one' : null;
};
/** The gate a signal stops at. */
export const signalGate = (s: DashSignal): Gate => (s.broken ? 'instrument' : segmentStory(s.segments) ? 'segment' : !s.answers ? 'ask' : 'act');

/** What turns up on Bolo's dashboard in November (`signal-gate` cards). */
const SIGNALS = {
  dau: { text: 'Daily practisers jumped 22% the week app 6.1 shipped', metric: 'Practised today', answers: false,
    broken: 'Version 6.1 counts tapping a reminder notification as a practice session, even if the learner closes the app straight away' },
  ratings: { text: 'The average lesson rating fell from 4.5 to 3.9 on Android overnight', metric: 'Lesson rating', answers: false,
    broken: 'The new Android rating sheet starts on three stars, and most people tap Done without changing it' },
  trial: { text: 'Trial-to-paid fell from 20% to 16% after the college campaign', metric: 'Trials that become paid', answers: false,
    segments: [
      { name: 'Job-seekers', before: { n: 6000, x: 1500 }, after: { n: 6000, x: 1490 } },
      { name: 'Students', before: { n: 3000, x: 300 }, after: { n: 9000, x: 890 } },
    ] },
  fiveDays: { text: 'Paid learners practising five or more days a week fell from 38% to 35%', metric: 'Practised 5+ days', answers: false,
    segments: [
      { name: 'Lucknow', before: { n: 6000, x: 2280 }, after: { n: 6000, x: 2270 } },
      { name: 'Indore', before: { n: 4000, x: 1520 }, after: { n: 4000, x: 1510 } },
      { name: 'Coimbatore', before: { n: 3000, x: 1140 }, after: { n: 3000, x: 810 } },
    ] },
  dayThree: { text: '46% of people who start the free trial never come back after day 3. Why?', metric: 'Back after day 3', answers: false },
  speakFirst: { text: 'Since speaking drills moved to the start of each lesson, finished lessons fell from 64% to 58%', metric: 'Lessons finished', answers: false,
    segments: [
      { name: 'Job-seekers', before: { n: 5000, x: 3200 }, after: { n: 5000, x: 2910 } },
      { name: 'Students', before: { n: 5000, x: 3200 }, after: { n: 5000, x: 2890 } },
    ] },
  bestTime: { text: 'When should live rooms run? 71% of practice sessions start between 9 and 11 pm', metric: 'Session start time', answers: true },
  quits: { text: 'Where should the content team start? 3 of 120 lessons account for 40% of mid-lesson quits', metric: 'Quit mid-lesson', answers: true },
} as const satisfies Record<string, DashSignal>;
export const BOLO_SIGNALS: Record<keyof typeof SIGNALS, DashSignal> = SIGNALS;
export type BoloSignal = keyof typeof SIGNALS;

// ── Triangulation (rs.5-4, `source-triangle`) ──────────────────────────────────────────────────────────────────────

/** How much a finding can carry (`source-triangle` lanes). `confident`: at least two methods agree, and they include
 *  both what people say and what they do, so their blind spots don't overlap. `lead`: everything agrees, but it's all
 *  one kind of evidence, so it shares one blind spot; check it the other way before betting on it. `conflict`: a
 *  source disagrees; the gap between them is the finding, so find out why before deciding. */
export const WEIGHTS = ['confident', 'lead', 'conflict'] as const;
export type Weight = (typeof WEIGHTS)[number];
/** Research methods, and which kind of evidence each gives: what people say (attitudes, memories, intentions) or
 *  what they do (observed behaviour). Support tickets are people describing a problem, so they're "say". */
export const METHOD_KIND = { survey: 'say', interview: 'say', support: 'say', analytics: 'do', usability: 'do' } as const;
export type ResearchMethod = keyof typeof METHOD_KIND;
export const METHOD_LABEL: Record<ResearchMethod, string> = { survey: 'Survey', interview: 'Interviews', support: 'Support tickets', analytics: 'Analytics', usability: 'Usability tests' };
export interface Source { method: ResearchMethod; finding: string; agrees: boolean }
export interface Claim { text: string; sources: readonly Source[] }
/** Weigh a claim: any disagreement first, then whether the agreeing sources span both kinds of evidence. */
export const triangulate = (c: Claim): Weight => {
  if (c.sources.some(s => !s.agrees)) return 'conflict';
  const methods = new Set(c.sources.map(s => s.method)), kinds = new Set(c.sources.map(s => METHOD_KIND[s.method]));
  return methods.size >= 2 && kinds.size === 2 ? 'confident' : 'lead';
};

/** Claims in the draft decision memo (`source-triangle` cards). */
const CLAIMS = {
  drills: { text: 'Learners would use short daily drills more than live rooms', sources: [
    { method: 'survey', finding: '55% chose drills, 39% live rooms (1,600 people, random sample)', agrees: true },
    { method: 'analytics', finding: 'Learners who practise in short sessions on 4+ days a week renew at twice the rate', agrees: true },
    { method: 'interview', finding: '9 of 12 practise in 10-minute gaps: on the bus, at lunch, before bed', agrees: true },
  ] },
  price: { text: 'People stop paying because ₹249 is too much', sources: [
    { method: 'survey', finding: '46% of lapsed learners picked “Price” as the reason they stopped', agrees: true },
    { method: 'analytics', finding: 'A ₹99 first month in Indore didn’t change renewals at month 2', agrees: false },
  ] },
  certificate: { text: 'A certificate would make people practise longer', sources: [
    { method: 'survey', finding: '68% said a certificate would motivate them', agrees: true },
    { method: 'interview', finding: '7 of 12 mentioned showing something to employers', agrees: true },
  ] },
  mic: { text: 'People can’t find the record button on small phones', sources: [
    { method: 'usability', finding: '4 of 5 people on 5-inch phones looked for it for over 10 seconds', agrees: true },
    { method: 'support', finding: 'About 280 tickets a month say “can’t record” or “mic not working”', agrees: true },
    { method: 'analytics', finding: '31% of speaking drills on small screens are abandoned before the first recording', agrees: true },
  ] },
  liveDemand: { text: 'Job-seekers want live rooms', sources: [
    { method: 'survey', finding: '58% of job-seekers said they’d use live rooms more than drills', agrees: true },
    { method: 'analytics', finding: 'Of 2,000 job-seekers offered a free live room in the pilot, 9% joined one even once', agrees: false },
  ] },
  slow: { text: 'The app has got slower', sources: [
    { method: 'support', finding: 'Tickets saying “app is slow” doubled in October', agrees: true },
    { method: 'analytics', finding: 'The median screen load is 1.2 seconds, the same as in September', agrees: false },
  ] },
  hindi: { text: 'Instructions in Hindi would help Lucknow and Patna learners', sources: [
    { method: 'survey', finding: '61% of Lucknow and Patna learners asked for Hindi instructions', agrees: true },
    { method: 'analytics', finding: 'Learners who switched to the Hindi beta finished 1.5 times as many lessons', agrees: true },
  ] },
  grammar: { text: 'Learners skip the grammar videos because they find them boring', sources: [
    { method: 'analytics', finding: '70% of grammar videos are skipped in the first 15 seconds', agrees: true },
    { method: 'usability', finding: '3 of 5 people skipped the video without comment', agrees: true },
  ] },
  friends: { text: 'Learners want to practise with a friend', sources: [
    { method: 'survey', finding: '49% said they’d like to practise with a friend', agrees: true },
    { method: 'interview', finding: '5 of 12 said practising alone feels strange', agrees: true },
  ] },
} as const satisfies Record<string, Claim>;
export const BOLO_CLAIMS: Record<keyof typeof CLAIMS, Claim> = CLAIMS;
export type BoloClaim = keyof typeof CLAIMS;
