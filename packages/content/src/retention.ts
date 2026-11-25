// Retention and engagement loops at Riyaaz, for chapter gr.4. Riyaaz is a Bengaluru app for daily music practice:
// Hindustani and Carnatic vocals, flute and harmonium, with a tanpura drone, a pitch tracker that shows how close each
// note sits to the shruti, short lessons recorded by working teachers, and a weekly class. Pro costs ₹299 a month.
// Meera Krishnan leads product design, Arjun Bhat is the growth product manager and Zoya Sheikh the analyst. Sunita
// Deshpande, 42, a bank officer in Dharwad, is relearning the vocals she gave up at 19; Asha Kulkarni teaches her and
// 30 other students on Riyaaz; Kabir, 16, plays flute in Pune.
// This is the data the gr.4 scenes and games draw, and the rules they score against: which behaviours deserve a habit
// loop; which notifications to send; which game mechanics to keep, retarget, soften or cut; and which referral designs
// really grow the base.

// ── Habit loops (gr.4-1, `habit-zone`) ─────────────────────────────────────────────────────────────────────────────

/** What to design for a behaviour (`habit-zone` lanes). `loop`: useful to the user and done at least weekly, so build a
 *  habit loop around it. `moment`: useful but rare, so don't try to make it a habit; prompt it at the moment it's
 *  needed and make it easy to find. `leave`: it serves Riyaaz's numbers, not the user's goal, so don't engineer it at
 *  all, however often people do it. */
export const HABIT_CALLS = ['loop', 'moment', 'leave'] as const;
export type HabitCall = (typeof HABIT_CALLS)[number];

/** A behaviour done less often than this many times a week rarely becomes a habit. */
export const HABIT_MIN_PER_WEEK = 1;

/** A behaviour in Riyaaz. `perWeek`: how often someone who wants it would do it. `useful`: doing it moves the user
 *  towards their own goal (singing or playing better), not only Riyaaz's engagement numbers. `why`: the evidence. */
export interface Behaviour { text: string; short: string; perWeek: number; useful: boolean; why: string }

/** Who benefits first, then how often. */
export const habitCall = (b: Behaviour): HabitCall =>
  !b.useful ? 'leave' : b.perWeek >= HABIT_MIN_PER_WEEK ? 'loop' : 'moment';

const BEHAVIOURS = {
  riyaz: { short: 'Daily riyaz', text: 'A 15-minute riyaz with the tanpura and the pitch tracker', perWeek: 6, useful: true, why: 'Students who practise five days a week improve their pitch accuracy three times faster than those who practise twice' },
  record: { short: 'Record a take', text: 'Record one take of the day’s alankar and hear it back', perWeek: 5, useful: true, why: 'Hearing yourself is how you notice a flat Ga; it is also the take tomorrow is compared with' },
  demo: { short: 'Teacher’s demo', text: 'Listen to the teacher’s 3-minute demo of the next phrase', perWeek: 4, useful: true, why: 'Students who hear the phrase first finish it in half the takes' },
  sendTake: { short: 'Send to teacher', text: 'Send the week’s best take to the teacher before class', perWeek: 1, useful: true, why: 'Asha-ji’s notes on a take are the most replayed screen in the app' },
  renew: { short: 'Renew the plan', text: 'Renew the yearly Pro plan', perWeek: 0.02, useful: true, why: 'Once a year; people need a clear reminder and an easy way to pay, not a habit' },
  exam: { short: 'Exam sign-up', text: 'Register for the Gandharva Mahavidyalaya grade exam', perWeek: 0.04, useful: true, why: 'Twice a year, with a fixed deadline that students miss if nobody tells them' },
  newRaga: { short: 'Start a new raga', text: 'Move on to a new raga once the teacher marks the current one learnt', perWeek: 0.25, useful: true, why: 'About once a month, right after the teacher’s mark' },
  baithak: { short: 'Book a baithak', text: 'Book a seat at the students’ baithak, the quarterly concert', perWeek: 0.08, useful: true, why: 'Four times a year; students who perform keep practising longer' },
  reels: { short: 'Clip feed', text: 'Scroll an autoplay feed of other students’ clips', perWeek: 20, useful: false, why: 'Feed time rose 40% in a test; practice minutes and pitch accuracy did not move' },
  board: { short: 'Leaderboard checks', text: 'Check the weekly leaderboard', perWeek: 10, useful: false, why: 'Checked most by students who were already ahead; no link to practice' },
  spin: { short: 'Daily spin', text: 'Open the app to spin a wheel for a daily bonus', perWeek: 7, useful: false, why: 'Opens rose; 70% of spins were not followed by any practice' },
  badges: { short: 'Badge shelf', text: 'Browse the badge collection', perWeek: 2, useful: false, why: 'Visited, then closed; nothing on it helps anyone sing' },
} as const satisfies Record<string, Behaviour>;
export type RiyaazBehaviour = keyof typeof BEHAVIOURS;
export const RIYAAZ_BEHAVIOURS: Record<RiyaazBehaviour, Behaviour> = BEHAVIOURS;

/** Riyaaz's practice loop, in the order it runs. The investment loads the next cue: today's take is what tomorrow's
 *  session is compared with. */
export const PRACTICE_LOOP = [
  { part: 'Cue', text: 'After morning chai, the tanpura is already tuned to your Sa' },
  { part: 'Routine', text: 'Ten minutes of today’s alankar, with the pitch tracker listening' },
  { part: 'Reward', text: 'The shruti map: which notes sat true, which drifted, and how that compares with last week' },
  { part: 'Investment', text: 'Save the take, so tomorrow opens with it and the teacher can hear it' },
] as const;

/** A habit has formed when someone practises at least this many days a week ... */
export const HABIT_DAYS = 4;
/** ... for this many weeks in a row. */
export const HABIT_WEEKS = 4;
/** Whether a week-by-week record of practice days (oldest first) shows a habit: the last `HABIT_WEEKS` weeks all reach
 *  `HABIT_DAYS`. Fewer weeks than that is not yet a habit. */
export const habitFormed = (daysPerWeek: readonly number[]) =>
  daysPerWeek.length >= HABIT_WEEKS && daysPerWeek.slice(-HABIT_WEEKS).every(d => d >= HABIT_DAYS);

/** The share of monthly practisers (%) by how many of the last 28 days they practised, before and after Riyaaz rebuilt
 *  its practice loop around the morning cue and the saved take. A habit shows as weight moving to the right. */
export const L28_BUCKETS = ['1–7 days', '8–14 days', '15–21 days', '22–28 days'] as const;
export const RIYAAZ_L28 = { before: [58, 22, 12, 8], after: [41, 21, 19, 19] } as const;

// ── Notifications without spam (gr.4-2, `nudge-crit`) ─────────────────────────────────────────────────────────────

/** What to do with a draft notification (`nudge-crit` lanes). `send`: it helps the user, now. `pressure`: it pushes
 *  with guilt, fear or false urgency, a dark pattern whoever it's for. `noise`: it serves Riyaaz, not the user.
 *  `hold`: the right message at the wrong moment: in quiet hours, or one more of a kind the user has stopped opening. */
export const NUDGE_CALLS = ['send', 'pressure', 'noise', 'hold'] as const;
export type NudgeCall = (typeof NUDGE_CALLS)[number];

/** Quiet hours, in the user's local time: nothing that can wait goes out from 22:00 to 7:00. */
export const QUIET_FROM = 22;
export const QUIET_TO = 7;
export const inQuietHours = (hour: number) => hour >= QUIET_FROM || hour < QUIET_TO;
/** After this many of one kind ignored in a row, stop sending that kind and ask the user what they want instead. */
export const IGNORE_LIMIT = 3;
/** At most this many notifications a week that the user didn't directly cause (a reply or a booking they made is not
 *  counted). */
export const NUDGE_WEEKLY_CAP = 3;

/** A draft notification. `forUser`: it's about something the user asked for, their own progress, or a person waiting
 *  on them. `pressure`: the push it uses, if any. `hour`: when it would arrive, in the user's local time (7.5 is
 *  7:30). `ignored`: how many of this kind the user has ignored in a row. */
export interface Nudge {
  text: string; short: string; forUser: boolean;
  pressure?: 'guilt' | 'fear' | 'false urgency';
  hour: number; ignored: number;
}

/** Pressure first (a dark pattern is rewritten whoever it's for), then who it serves, then the moment. */
export const nudgeCall = (n: Nudge): NudgeCall =>
  n.pressure ? 'pressure' : !n.forUser ? 'noise' : inQuietHours(n.hour) || n.ignored >= IGNORE_LIMIT ? 'hold' : 'send';
/** Why a held notification is held: quiet hours, or a kind the user has stopped opening. */
export const holdReason = (n: Nudge): 'quiet' | 'ignored' | null =>
  nudgeCall(n) !== 'hold' ? null : inQuietHours(n.hour) ? 'quiet' : 'ignored';

const NUDGES = {
  teacherNote: { short: 'Teacher’s note', text: 'Asha-ji left a note on your Yaman take: “Good meend into Ni. Hold the Pa longer.”', forUser: true, hour: 18, ignored: 0 },
  ownTime: { short: 'Your 7:00 riyaz', text: 'Your 7:00 riyaz. The tanpura is tuned to C#. Today: ten minutes of Yaman alankars.', forUser: true, hour: 7, ignored: 0 },
  classPrep: { short: 'Class tomorrow', text: 'Class with Asha-ji tomorrow at 6 pm. Your two best takes are ready to send.', forUser: true, hour: 17.5, ignored: 0 },
  guruSad: { short: '“Your guru…”', text: 'Your guru will be disappointed. Don’t give up now.', forUser: true, pressure: 'guilt', hour: 19, ignored: 0 },
  streakFear: { short: 'Streak alarm', text: 'Only 2 hours left before your 41-day streak is lost forever!', forUser: true, pressure: 'fear', hour: 20, ignored: 0 },
  flashSale: { short: 'Flash sale', text: 'Pro at ₹99 ends in 10 minutes! (The timer restarts every time you open the app.)', forUser: false, pressure: 'false urgency', hour: 13, ignored: 0 },
  darkMode: { short: 'New feature', text: 'New! Try Riyaaz in dark mode.', forUser: false, hour: 12, ignored: 0 },
  rateUs: { short: 'Rate us', text: 'Enjoying Riyaaz? Rate us 5 stars on the Play Store.', forUser: false, hour: 16, ignored: 0 },
  missYou: { short: '“We miss you”', text: 'We miss you! Come back and see what’s new.', forUser: false, hour: 11, ignored: 0 },
  lateNote: { short: 'Note at 23:40', text: 'Asha-ji replied to your question about the komal Re in Bhairav.', forUser: true, hour: 23.7, ignored: 0 },
  classMoved: { short: 'Class moved, 2 am', text: 'Tomorrow’s class has moved to 7 pm.', forUser: true, hour: 2.2, ignored: 0 },
  ignored: { short: 'Sixth reminder', text: 'Time for your evening riyaz.', forUser: true, hour: 19, ignored: 5 },
} as const satisfies Record<string, Nudge>;
export type RiyaazNudge = keyof typeof NUDGES;
export const RIYAAZ_NUDGES: Record<RiyaazNudge, Nudge> = NUDGES;

/** Before: what one active student got from Riyaaz in a week, by day (Mon–Sun), and the share of students who turned
 *  notifications off that month. After: the cap, quiet hours and back-off. */
export const NUDGE_WEEK = {
  before: { perDay: [3, 4, 3, 3, 4, 3, 4], optOut: 11 },
  after: { perDay: [1, 0, 1, 1, 0, 1, 0], optOut: 3 },
} as const;

// ── Gamification done right (gr.4-3, `reward-pick`) ─────────────────────────────────────────────────────────────

/** What to do with a game mechanic (`reward-pick` lanes). `keep`: it rewards the real skill or real practice, and tells
 *  people how they are doing without pushing. `retarget`: it rewards a stand-in (opens, taps, time with the app open),
 *  so point it at the real thing. `soften`: it rewards the right thing but controls people (loss, public ranking,
 *  forced sharing), so make it informational and optional. `cut`: it makes money from loss or chance. */
export const REWARD_CALLS = ['keep', 'retarget', 'soften', 'cut'] as const;
export type RewardCall = (typeof REWARD_CALLS)[number];

/** The three needs self-determination theory says a good game supports (Deci and Ryan). */
export const SDT_NEEDS = ['competence', 'autonomy', 'relatedness'] as const;
export type SdtNeed = (typeof SDT_NEEDS)[number];

/** A game mechanic proposed for Riyaaz. `rewards`: what it counts. `controlling`: it pushes with loss, public ranking or
 *  forced actions rather than informing. `paid`: it takes money from a loss or a chance. `need`: for mechanics worth
 *  keeping, the need it supports. */
export interface Mechanic {
  text: string; short: string; rewards: 'skill' | 'practice' | 'proxy';
  controlling: boolean; paid: boolean; need?: SdtNeed;
}

/** Money from loss or chance is cut outright; then what it counts; then how it feels. */
export const rewardCall = (m: Mechanic): RewardCall =>
  m.paid ? 'cut' : m.rewards === 'proxy' ? 'retarget' : m.controlling ? 'soften' : 'keep';

const MECHANICS = {
  shrutiMap: { short: 'Shruti map', text: 'A shruti map after every take, showing which notes sat sharp or flat', rewards: 'skill', controlling: false, paid: false, need: 'competence' },
  teacherMark: { short: 'Teacher’s mark', text: 'The teacher marks a raga “learnt” after three clean takes, which opens the next one', rewards: 'skill', controlling: false, paid: false, need: 'relatedness' },
  weekGoal: { short: '5-of-7 goal', text: 'A weekly goal of five practice days you set yourself, with two rest days that don’t break it', rewards: 'practice', controlling: false, paid: false, need: 'autonomy' },
  xpOpens: { short: 'XP for opens', text: '10 XP every time you open the app', rewards: 'proxy', controlling: false, paid: false },
  droneHours: { short: 'Tanpura hours', text: 'A badge for 100 hours with the tanpura playing', rewards: 'proxy', controlling: false, paid: false },
  lessonsWatched: { short: 'Lessons watched', text: 'Levels for the number of lesson videos watched', rewards: 'proxy', controlling: false, paid: false },
  cityBoard: { short: 'City leaderboard', text: 'A city leaderboard of practice minutes with everyone’s name shown, and no way to leave it', rewards: 'practice', controlling: true, paid: false },
  zeroStreak: { short: 'All-or-nothing streak', text: 'A streak that drops to zero after one missed day, with a broken red flame', rewards: 'practice', controlling: true, paid: false },
  forcedShare: { short: 'Share to unlock', text: 'Each certificate must be posted on WhatsApp before the next lesson opens', rewards: 'skill', controlling: true, paid: false },
  streakRepair: { short: 'Paid streak repair', text: 'Pay ₹49 to bring back a lost streak', rewards: 'practice', controlling: true, paid: true },
  mysteryBox: { short: 'Mystery boxes', text: 'Mystery boxes of tanpura sounds and themes at ₹19 a spin', rewards: 'proxy', controlling: false, paid: true },
  expiringGems: { short: 'Expiring gems', text: 'Gems that vanish unless you buy more within 24 hours', rewards: 'proxy', controlling: true, paid: true },
} as const satisfies Record<string, Mechanic>;
export type RiyaazMechanic = keyof typeof MECHANICS;
export const RIYAAZ_MECHANICS: Record<RiyaazMechanic, Mechanic> = MECHANICS;

/** What the streak launch did, a month in, against a holdout without it. Opens rose; practice and skill did not. */
export const STREAK_LAUNCH = [
  { metric: 'Daily opens', holdout: 100, streak: 118, unit: 'index' },
  { metric: 'Minutes sung per open', holdout: 14, streak: 6, unit: 'min' },
  { metric: 'Notes in tune', holdout: 71, streak: 71, unit: '%' },
] as const;

// ── Referral & viral loops (gr.4-4, `referral-math`) ─────────────────────────────────────────────────────────────

/** What to do with a referral design (`referral-math` lanes). `ship`: fair, and the friends it brings stay, so kept K
 *  rises. `hollow`: K rises but kept K doesn't: it buys sign-ups who leave. `dark`: it messages people the user didn't
 *  choose, shares without asking, or forces invites, however good the numbers look. `flat`: fair, but moves nothing. */
export const REFERRAL_CALLS = ['ship', 'hollow', 'dark', 'flat'] as const;
export type ReferralCall = (typeof REFERRAL_CALLS)[number];

/** A referral design. `invites`: invites sent per user in their first month. `conversion`: share of invites that sign
 *  up. `kept`: share of those sign-ups still practising 30 days later. `fair`: every message goes to someone the user
 *  chose, with their say-so, and nothing is locked behind inviting; `unfair` says what breaks it. */
export interface Referral { text: string; short: string; invites: number; conversion: number; kept: number; fair: boolean; unfair?: string }

/** The viral coefficient: new users each user brings, invites × conversion. */
export const kFactor = (r: Referral) => Math.round(r.invites * r.conversion * 1000) / 1000;
/** New users each user brings who are still practising a month later. */
export const keptK = (r: Referral) => Math.round(r.invites * r.conversion * r.kept * 1000) / 1000;
/** Total users that each user you acquire becomes, over every cycle of invites: 1 / (1 − K) while K is below 1. */
export const amplify = (k: number) => (k < 1 ? 1 / (1 - k) : Infinity);

/** Riyaaz today: a “Refer a friend” link in the profile menu. */
export const REFERRAL_BASE: Referral = { short: 'Today', text: 'A “Refer a friend” link in the profile menu', invites: 0.6, conversion: 0.2, kept: 0.5, fair: true };

/** Fairness first, then whether the people it brings stay, then whether it brings more of them. */
export const referralCall = (r: Referral, base: Referral = REFERRAL_BASE): ReferralCall =>
  !r.fair ? 'dark' : keptK(r) > keptK(base) ? 'ship' : kFactor(r) > kFactor(base) ? 'hollow' : 'flat';

const REFERRALS = {
  duet: { short: 'Duet clip', text: 'Share a 30-second duet of your take with the teacher’s demo; the link opens the same phrase to try', invites: 1.4, conversion: 0.18, kept: 0.55, fair: true },
  teacherLink: { short: 'Teacher’s class link', text: 'Teachers invite their whole class with one link, and get a free batch dashboard', invites: 1.0, conversion: 0.35, kept: 0.7, fair: true },
  twoSided: { short: '₹150 each, after 10 days', text: '₹150 off for you and your friend once the friend has practised on 10 days', invites: 0.9, conversion: 0.25, kept: 0.6, fair: true },
  cashSignup: { short: '₹200 per sign-up', text: '₹200 cashback for every friend who signs up', invites: 2.0, conversion: 0.3, kept: 0.08, fair: true },
  contest: { short: 'Referral contest', text: 'A ₹5,000 prize for whoever brings the most sign-ups this month', invites: 1.5, conversion: 0.2, kept: 0.1, fair: true },
  freeMonth: { short: 'Free month per sign-up', text: 'A free month of Pro for every sign-up you bring', invites: 1.6, conversion: 0.3, kept: 0.1, fair: true },
  contacts: { short: 'Text all contacts', text: 'Upload your contacts, and Riyaaz texts all of them “Sunita invited you”', invites: 12, conversion: 0.02, kept: 0.3, fair: false, unfair: 'It messages hundreds of people the user never chose, in the user’s name' },
  autoStatus: { short: 'Auto-post takes', text: 'Every take posts to your WhatsApp status unless you turn it off', invites: 4, conversion: 0.04, kept: 0.4, fair: false, unfair: 'It shares a recording by default, without asking each time' },
  inviteLock: { short: 'Invite to unlock', text: 'Invite five friends to unlock the next raga', invites: 3.0, conversion: 0.1, kept: 0.25, fair: false, unfair: 'It locks the lesson the user came for behind inviting: forced action' },
  settingsShare: { short: 'Share in settings', text: 'A share button at the bottom of the settings page', invites: 0.55, conversion: 0.2, kept: 0.5, fair: true },
  badgeShare: { short: 'Share badges', text: 'Share your badges to Instagram', invites: 0.8, conversion: 0.05, kept: 0.4, fair: true },
  homeBanner: { short: 'Home banner', text: 'A “Refer a friend” banner on the home screen, with no reward', invites: 0.7, conversion: 0.15, kept: 0.5, fair: true },
} as const satisfies Record<string, Referral>;
export type RiyaazReferral = keyof typeof REFERRALS;
export const RIYAAZ_REFERRALS: Record<RiyaazReferral, Referral> = REFERRALS;

/** Kept K once the duet clip, the teacher’s class link and the two-sided reward ran together for a quarter, as measured
 *  against a holdout (the designs overlap, so it is less than their sum). */
export const REFERRAL_NEW_KEPT_K = 0.2;
