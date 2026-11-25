// Episodes for chapter gr.4 · Retention & engagement loops. Drafts by Claude, for review.
// Riyaaz is a Bengaluru app for daily music practice: a tanpura drone, a pitch tracker, short lessons from working
// teachers and a weekly class. Meera Krishnan leads product design, Arjun Bhat is the growth PM and Zoya Sheikh the
// analyst. Sunita Deshpande, 42, a bank officer in Dharwad, is relearning vocals; Asha Kulkarni is her teacher; Kabir,
// 16, plays flute in Pune. gr.1 named the hook and the dark patterns, gr.2 got people to the first value and gr.3
// tested changes honestly; this chapter is for the designer who owns what brings people back, and has to do it without
// tricking them. Data and rules: ../retention.
import type { Episode } from '../episode';
import {
  RIYAAZ_BEHAVIOURS, RIYAAZ_MECHANICS, RIYAAZ_NUDGES, RIYAAZ_REFERRALS, habitCall, nudgeCall, referralCall, rewardCall,
  type RiyaazBehaviour, type RiyaazMechanic, type RiyaazNudge, type RiyaazReferral,
} from '../retention';

const beh = (k: RiyaazBehaviour) => RIYAAZ_BEHAVIOURS[k].text;
const habitLane = (k: RiyaazBehaviour) => habitCall(RIYAAZ_BEHAVIOURS[k]);
const nudge = (k: RiyaazNudge) => RIYAAZ_NUDGES[k].text;
const nudgeLane = (k: RiyaazNudge) => nudgeCall(RIYAAZ_NUDGES[k]);
const mech = (k: RiyaazMechanic) => RIYAAZ_MECHANICS[k].text;
const mechLane = (k: RiyaazMechanic) => rewardCall(RIYAAZ_MECHANICS[k]);
const ref = (k: RiyaazReferral) => RIYAAZ_REFERRALS[k].text;
const refLane = (k: RiyaazReferral) => referralCall(RIYAAZ_REFERRALS[k]);

export const gr4_1: Episode = {
  lessonId: 'gr.4-1',
  hook: 'Riyaaz could make people open it every day with a spin wheel. Meera wanted them to sing every day instead. Watch her pick the habit, then build the loop.',
  scene: {
    id: 'practice-loop', duration: 36,
    beats: [
      { at: 0, title: 'Stuck at 31%', body: 'Second-month retention won’t move. The growth team proposes a daily spin wheel.' },
      { at: 6, title: 'The habit zone', body: 'Every behaviour on two axes: how often, and whether it helps the singer. Only one corner deserves a loop.' },
      { at: 11, title: 'An anchor, not an alarm', body: 'Sunita practises after her morning chai. The tanpura opens tuned to her Sa, at the time she chose.' },
      { at: 16, title: 'The loop', body: 'Cue, a ten-minute routine, a shruti map as the reward, and a saved take that loads tomorrow.' },
      { at: 22, title: 'Sixty-six days', body: 'Habits take time: a median of 66 days in Lally’s study. Sunita’s weeks fill in: 2, 3, 4, 5, 4, 5.' },
      { at: 27, title: 'Measure the habit', body: 'The L28 curve: how many of the last 28 days each student practised. The right-hand end grows.' },
      { at: 32, title: 'And the outcome', body: 'Notes in tune and teachers’ marks rise with it. The spin wheel never ships.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why didn’t Meera build a loop around the daily spin wheel?', options: [{ id: 'a', label: 'It was too expensive to build' }, { id: 'b', label: 'It makes opening frequent without helping anyone sing better' }, { id: 'c', label: 'Users didn’t open it' }],
      correct: 'b', explanation: 'A habit is only worth building around something that serves the user’s goal.' },
    { id: 'c2', prompt: 'What does the saved take do in the loop?', options: [{ id: 'a', label: 'It’s the investment that loads tomorrow’s session and the teacher’s feedback' }, { id: 'b', label: 'It earns XP' }, { id: 'c', label: 'It’s shared publicly' }],
      correct: 'a', explanation: 'Each turn of the loop makes the next one easier and more worth doing.' },
  ],
  game: {
    id: 'habit-zone', title: 'Find the habit zone',
    instructions: 'Each card is something people do in Riyaaz, with how often and the evidence. Build a habit loop around it, prompt it at the right moment, or leave it alone? Ask who it helps first, then how often. Right calls plot it on the habit zone.',
    lanes: [
      { id: 'loop', label: 'Build a loop', hint: 'Helps the singer, at least weekly' },
      { id: 'moment', label: 'Prompt at the moment', hint: 'Helps, but rarer than weekly' },
      { id: 'leave', label: 'Leave it', hint: 'Serves our numbers, not them' },
    ],
    cards: [
      { id: 'g1', label: beh('riyaz'), lane: habitLane('riyaz'), visual: 'riyaz', note: 'Daily, and it’s what makes a singer better. This is the habit the whole loop is built around.' },
      { id: 'g2', label: beh('reels'), lane: habitLane('reels'), visual: 'reels', note: 'Very frequent and very easy to make more so. But practice and pitch didn’t move, so making it a habit is compulsion, not value.' },
      { id: 'g3', label: beh('renew'), lane: habitLane('renew'), visual: 'renew', note: 'Once a year. A clear reminder a week ahead and an easy way to pay is the design, not a habit.' },
      { id: 'g4', label: beh('record'), lane: habitLane('record'), visual: 'record', note: 'Five times a week, and it’s the investment: today’s take is what tomorrow is compared with.' },
      { id: 'g5', label: beh('spin'), lane: habitLane('spin'), visual: 'spin', note: 'Opens went up, and 70% of spins led to no practice. Frequent is not the same as useful.' },
      { id: 'g6', label: beh('exam'), lane: habitLane('exam'), visual: 'exam', note: 'Twice a year with a hard deadline. Tell students in time, and make sign-up two taps.' },
      { id: 'g7', label: beh('demo'), lane: habitLane('demo'), visual: 'demo', note: 'Part of the routine: hearing the phrase first halves the takes it needs.' },
      { id: 'g8', label: beh('board'), lane: habitLane('board'), visual: 'board', note: 'Checked mostly by people already ahead, with no link to practice. Don’t engineer more checking.' },
      { id: 'g9', label: beh('newRaga'), lane: habitLane('newRaga'), visual: 'newRaga', note: 'About once a month, triggered by the teacher’s mark. Prompt it right then.' },
      { id: 'g10', label: beh('sendTake'), lane: habitLane('sendTake'), visual: 'sendTake', note: 'Weekly is just enough, and the class day is a ready-made anchor. The teacher’s notes are the reward.' },
      { id: 'g11', label: beh('baithak'), lane: habitLane('baithak'), visual: 'baithak', note: 'Four times a year. A prompt when booking opens, and a reminder the week before.' },
      { id: 'g12', label: beh('badges'), lane: habitLane('badges'), visual: 'badges', note: 'People look, then leave. Nothing on the shelf helps anyone sing.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.6,
    prompt: 'The spin wheel is frequent; renewing the plan is useful. Which behaviour should Meera build the loop around?',
    options: [{ id: 'a', label: 'The spin wheel: it’s the most frequent' }, { id: 'b', label: 'The daily riyaz: useful to the singer and done most days' }, { id: 'c', label: 'Renewal: it’s what earns money' }],
    correct: 'b', explanation: 'The habit zone needs both: frequent enough, and useful to the person doing it.',
  },
  takeaways: [
    { title: 'Pick the habit first', body: 'Only a behaviour that helps the user and happens at least weekly deserves a loop. Rare but useful things get a timely prompt.' },
    { title: 'Anchor it', body: 'Tie the cue to something people already do every day, at a time they chose.' },
    { title: 'Invest in tomorrow', body: 'Make the reward informative and let the investment load the next cue.' },
    { title: 'Measure habit and outcome', body: 'Days practised over 28 days and habits formed, judged over months, next to the skill it’s for.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'Registering for a twice-yearly exam:', options: [{ id: 'a', label: 'Build a loop' }, { id: 'b', label: 'Prompt at the moment' }, { id: 'c', label: 'Leave it' }], correct: 'b', explanation: 'Useful, but far too rare to become a habit.' },
      { id: 'q2', prompt: 'An autoplay feed that raised time in app but not practice:', options: [{ id: 'a', label: 'Leave it' }, { id: 'b', label: 'Build a loop' }, { id: 'c', label: 'Prompt at the moment' }], correct: 'a', explanation: 'Frequent, but it serves the app’s numbers.' },
      { id: 'q3', prompt: 'In Lally’s study, a new habit took a median of…', options: [{ id: 'a', label: '21 days' }, { id: 'b', label: '66 days' }, { id: 'c', label: '7 days' }], correct: 'b', explanation: 'With a range of 18 to 254 days.' },
      { id: 'q4', prompt: 'The L28 curve counts…', options: [{ id: 'a', label: 'Sign-ups in 28 days' }, { id: 'b', label: 'How many of the last 28 days each user was active' }, { id: 'c', label: 'Revenue per user' }], correct: 'b', explanation: 'A habit shows as weight at the right-hand end.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why is “opens per day” a weak measure of Riyaaz’s habit loop?', hint: 'What can raise it without anyone singing?', options: [{ id: 'a', label: 'It’s hard to track' }, { id: 'b', label: 'A spin wheel or a streak can raise opens while practice and pitch don’t move; measure practice days and the skill' }, { id: 'c', label: 'It’s too slow to change' }, { id: 'd', label: 'Opens always fall in summer' }], correct: 'b', explanation: 'Measure the behaviour and the outcome, not the door.' },
    { id: 'l2', prompt: 'Why is the reward a shruti map rather than confetti?', hint: 'What does the singer want to know?', options: [{ id: 'a', label: 'Confetti is too hard to animate' }, { id: 'b', label: 'Information about her own progress is the reward she came for, and it doesn’t wear off like a novelty' }, { id: 'c', label: 'Maps are cheaper' }, { id: 'd', label: 'Confetti is a dark pattern' }], correct: 'b', explanation: 'A reward tied to the user’s goal keeps working.' },
    { id: 'l3', prompt: 'Sunita practises 6, 6, 3, 6, 6 days in five weeks. Has the habit formed by Riyaaz’s definition?', hint: 'Four days for four weeks in a row.', options: [{ id: 'a', label: 'Yes, she averages 5.4' }, { id: 'b', label: 'Not yet: the 3-day week breaks the last four; two more strong weeks will do it' }, { id: 'c', label: 'No, she needs seven days a week' }, { id: 'd', label: 'It can’t be measured' }], correct: 'b', explanation: 'A habit is consistency, not an average.' },
    { id: 'l4', prompt: 'A student practises at a different time every day. What should the loop do?', hint: 'An anchor is a routine, not a clock.', options: [{ id: 'a', label: 'Force a fixed time' }, { id: 'b', label: 'Ask what she does every day anyway (after the school run, after dinner) and cue from that' }, { id: 'c', label: 'Send reminders every two hours' }, { id: 'd', label: 'Give up on her' }], correct: 'b', explanation: 'Fogg: “after I…, I will…”.' },
    { id: 'l5', prompt: 'After 8 weeks, habit formed is up 9 points against the holdout, but notes in tune are flat. What should Meera conclude?', hint: 'What is the loop for?', options: [{ id: 'a', label: 'Success: the habit is the goal' }, { id: 'b', label: 'People practise more but not better; look at the routine itself (is today’s exercise at the right level?) before calling it a win' }, { id: 'c', label: 'The holdout is broken' }, { id: 'd', label: 'Add a leaderboard' }], correct: 'b', explanation: 'Habit is the means; the skill is the end.' },
  ],
};

export const gr4_2: Episode = {
  lessonId: 'gr.4-2',
  hook: 'Riyaaz sent each student 24 notifications a week. 11% turned them all off, and stopped hearing from their teacher too. Watch Meera spend the channel carefully.',
  scene: {
    id: 'nudge-week', duration: 36,
    beats: [
      { at: 0, title: '24 a week', body: 'Every team added one notification that won its own test. Together they fill Sunita’s lock screen.' },
      { at: 6, title: 'The off switch', body: '11% of students turn notifications off in a month. The teacher’s notes go quiet with everything else.' },
      { at: 11, title: 'Does it pressure?', body: 'Guilt, fear and false urgency go first, whoever they’re for.' },
      { at: 16, title: 'Whose need?', body: 'A teacher’s note serves Sunita. “Rate us 5 stars” serves Riyaaz.' },
      { at: 21, title: 'Is it the moment?', body: 'Quiet hours from 22:00 to 7:00. After three ignored, stop and ask.' },
      { at: 26, title: 'One budget', body: 'Three a week that the student didn’t cause. Replies and bookings don’t count.' },
      { at: 31, title: 'A quarter later', body: 'Four a week, opt-outs down to 3%, and 90-day retention up against the holdout.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did 24 notifications a week hurt even though each one won its test?', options: [{ id: 'a', label: 'The tests were wrong' }, { id: 'b', label: 'Together they taught people to ignore Riyaaz, and those who switched off lost the messages that matter' }, { id: 'c', label: 'Phones can’t show that many' }],
      correct: 'b', explanation: 'Notifications share one channel, so they need one budget.' },
    { id: 'c2', prompt: 'What happens after three ignored reminders of one kind?', options: [{ id: 'a', label: 'Send a louder one' }, { id: 'b', label: 'Stop that kind and ask the student what would help' }, { id: 'c', label: 'Switch to SMS' }],
      correct: 'b', explanation: 'Ignoring is an answer. Nagging is a named dark pattern.' },
  ],
  game: {
    id: 'nudge-crit', title: 'Crit the notifications',
    instructions: 'Each card is a draft notification, with when it would arrive. Send it, or name its first problem: it pressures, it’s noise for Riyaaz, or it’s the right message at the wrong moment. Right calls land in Sunita’s week.',
    lanes: [
      { id: 'send', label: 'Send', hint: 'Helps her, now' },
      { id: 'pressure', label: 'Pressure', hint: 'Guilt, fear or false urgency' },
      { id: 'noise', label: 'Noise', hint: 'Serves Riyaaz, not her' },
      { id: 'hold', label: 'Hold', hint: 'Quiet hours, or she stopped opening' },
    ],
    cards: [
      { id: 'g1', label: nudge('teacherNote'), lane: nudgeLane('teacherNote'), visual: 'teacherNote', note: 'A person she trusts, about her own take, at 6 pm. This is what the channel is for.' },
      { id: 'g2', label: nudge('guruSad'), lane: nudgeLane('guruSad'), visual: 'guruSad', note: 'Guilt in her teacher’s name. Drop it; if a reminder helps, it should say what today’s practice is.' },
      { id: 'g3', label: nudge('rateUs'), lane: nudgeLane('rateUs'), visual: 'rateUs', note: 'Riyaaz’s need. Ask in the app, after a good moment like a raga marked learnt, never on the lock screen.' },
      { id: 'g4', label: nudge('lateNote'), lane: nudgeLane('lateNote'), visual: 'lateNote', note: 'Right message, 23:40. It can wait until 7:00, when she’ll want to read it.' },
      { id: 'g5', label: nudge('ownTime'), lane: nudgeLane('ownTime'), visual: 'ownTime', note: 'She chose 7:00, and it says what today’s practice is. Specific and expected.' },
      { id: 'g6', label: nudge('streakFear'), lane: nudgeLane('streakFear'), visual: 'streakFear', note: 'It’s about her own streak, but it works by fear of loss. Rewrite it, or better, make the streak forgiving.' },
      { id: 'g7', label: nudge('darkMode'), lane: nudgeLane('darkMode'), visual: 'darkMode', note: 'A feature announcement she didn’t ask for. Put it in the app’s what’s-new screen.' },
      { id: 'g8', label: nudge('ignored'), lane: nudgeLane('ignored'), visual: 'ignored', note: 'Five ignored in a row. Stop this kind and ask: another time, fewer days, or none?' },
      { id: 'g9', label: nudge('flashSale'), lane: nudgeLane('flashSale'), visual: 'flashSale', note: 'A timer that restarts is false urgency, a dark pattern named in the 2023 guidelines.' },
      { id: 'g10', label: nudge('classPrep'), lane: nudgeLane('classPrep'), visual: 'classPrep', note: 'Her class, her takes, the evening before. Useful and timely.' },
      { id: 'g11', label: nudge('classMoved'), lane: nudgeLane('classMoved'), visual: 'classMoved', note: 'She needs to know, but not at 2 am. The class is tomorrow evening; send it at 7:00.' },
      { id: 'g12', label: nudge('missYou'), lane: nudgeLane('missYou'), visual: 'missYou', note: 'Vague and about Riyaaz. If she’s lapsed, ask what got in the way, or say what her next lesson is.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.6,
    prompt: '11% of students have switched notifications off. What should Meera do first?',
    options: [{ id: 'a', label: 'Send an email asking them to turn notifications back on' }, { id: 'b', label: 'Critique every notification type: cut pressure and noise, then set one budget with quiet hours and back-off' }, { id: 'c', label: 'Send more to the students who still have them on' }],
    correct: 'b', explanation: 'Fix what taught people to switch off before asking them back.',
  },
  takeaways: [
    { title: 'Pressure goes first', body: 'Guilt, fear and false urgency are dark patterns, whoever the message is for.' },
    { title: 'Whose need is it?', body: 'Send what the user asked for or someone is waiting on. Riyaaz’s needs live in the app.' },
    { title: 'Respect the moment', body: 'Quiet hours, and back off after three ignored. Ask instead of nagging.' },
    { title: 'One budget, long holdout', body: 'Cap what the user didn’t cause, and judge by 90-day retention and opt-outs, not taps.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: '“Your guru will be disappointed”:', options: [{ id: 'a', label: 'Send' }, { id: 'b', label: 'Pressure' }, { id: 'c', label: 'Noise' }], correct: 'b', explanation: 'Guilt is a push, not help.' },
      { id: 'q2', prompt: 'A teacher’s reply at 23:40:', options: [{ id: 'a', label: 'Hold until 7:00' }, { id: 'b', label: 'Noise' }, { id: 'c', label: 'Send now' }], correct: 'a', explanation: 'Right message, wrong moment.' },
      { id: 'q3', prompt: '“Try Riyaaz in dark mode!”', options: [{ id: 'a', label: 'Send' }, { id: 'b', label: 'Noise' }, { id: 'c', label: 'Pressure' }], correct: 'b', explanation: 'It serves Riyaaz; put it in the app.' },
      { id: 'q4', prompt: 'Since Android 13, apps must…', options: [{ id: 'a', label: 'Ask permission before sending notifications' }, { id: 'b', label: 'Pay per notification' }, { id: 'c', label: 'Send at least one a week' }], correct: 'a', explanation: 'Like iOS. Ask when the value is clear.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'When should Riyaaz ask for notification permission?', hint: 'When is the value obvious?', options: [{ id: 'a', label: 'On the first screen, before sign-up' }, { id: 'b', label: 'After the first practice: “Want a nudge at this time tomorrow?”' }, { id: 'c', label: 'Never; turn them on by default' }, { id: 'd', label: 'After a week of silence' }], correct: 'b', explanation: 'Ask when the person can see what they’d get.' },
    { id: 'l2', prompt: 'Why does a teacher’s reply not count against the weekly cap?', hint: 'Who caused it?', options: [{ id: 'a', label: 'Teachers pay for it' }, { id: 'b', label: 'The student caused it by sending a take, and someone is waiting on her; the cap is for what Riyaaz starts' }, { id: 'c', label: 'Replies are short' }, { id: 'd', label: 'It does count' }], correct: 'b', explanation: 'Budget what you initiate.' },
    { id: 'l3', prompt: 'One switch turns all Riyaaz notifications off. What should replace it?', hint: 'What do people actually want to stop?', options: [{ id: 'a', label: 'Nothing; one switch is simpler' }, { id: 'b', label: 'Settings by kind (teacher replies, practice reminders, offers), so people can stop the offers and keep the teacher' }, { id: 'c', label: 'Hide the switch' }, { id: 'd', label: 'A confirmation that says “Are you sure you want to stop improving?”' }], correct: 'b', explanation: 'Controls by kind keep the channel for what matters.' },
    { id: 'l4', prompt: 'A new reminder lifts same-day practice 6% in a one-week test. What else must Arjun check before shipping?', hint: 'What does it cost later?', options: [{ id: 'a', label: 'Nothing; it won' }, { id: 'b', label: 'Opt-outs and 90-day retention against a long holdout, and whether it fits the weekly budget' }, { id: 'c', label: 'Its open rate' }, { id: 'd', label: 'Whether competitors send it' }], correct: 'b', explanation: 'Short wins can be long losses.' },
    { id: 'l5', prompt: 'Who should own the notification budget?', hint: 'One channel, many teams.', options: [{ id: 'a', label: 'Every team owns its own' }, { id: 'b', label: 'One person across teams, who decides what each new type must beat to get in' }, { id: 'c', label: 'Marketing' }, { id: 'd', label: 'Nobody; let the tests decide' }], correct: 'b', explanation: 'A shared channel without an owner gets overgrazed.' },
  ],
};

export const gr4_3: Episode = {
  lessonId: 'gr.4-3',
  hook: 'Riyaaz’s new streak lifted daily opens 18%. Minutes sung per open fell from 14 to 6. Watch Meera rebuild the game around the music.',
  scene: {
    id: 'streak-trap', duration: 36,
    beats: [
      { at: 0, title: 'The streak ships', body: 'A flame on the home screen and a counter of days. Opens rise 18% against the holdout.' },
      { at: 6, title: 'One minute of drone', body: 'Minutes sung per open fall from 14 to 6. Notes in tune: flat. People save the streak and leave.' },
      { at: 11, title: 'Goodhart’s law', body: 'When a measure becomes a target, it stops being a good measure. Count the singing, not the opening.' },
      { at: 16, title: 'Inform, don’t control', body: 'Competence, autonomy, relatedness. A goal she sets, rest days, a freeze.' },
      { at: 21, title: 'Never sell the loss', body: '₹49 streak repairs and ₹19 mystery boxes are cut, whatever they earn.' },
      { at: 26, title: 'The new game', body: 'A practice day counts after ten minutes the tracker can hear. A shruti map. The teacher’s mark.' },
      { at: 31, title: 'A month later', body: 'Minutes per open back to 15, and notes in tune up from 71% to 76%.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What went wrong with the first streak?', options: [{ id: 'a', label: 'Nobody used it' }, { id: 'b', label: 'It counted opening the app, so people opened it without practising' }, { id: 'c', label: 'It was too hard to earn' }],
      correct: 'b', explanation: 'People optimise whatever the mechanic counts.' },
    { id: 'c2', prompt: 'What should a practice day count instead?', options: [{ id: 'a', label: 'Opening the app' }, { id: 'b', label: 'Ten minutes of singing the pitch tracker can hear' }, { id: 'c', label: 'Watching a video' }],
      correct: 'b', explanation: 'Point the reward at the real practice.' },
  ],
  game: {
    id: 'reward-pick', title: 'Keep, retarget, soften or cut',
    instructions: 'Each card is a game mechanic proposed for Riyaaz. Keep it, or name its first problem: it rewards a stand-in, it controls people, or it makes money from loss or chance. Check money first, then what it counts, then how it feels.',
    lanes: [
      { id: 'keep', label: 'Keep', hint: 'Real skill, and it informs' },
      { id: 'retarget', label: 'Retarget', hint: 'Counts a stand-in' },
      { id: 'soften', label: 'Soften', hint: 'Right thing, but controls' },
      { id: 'cut', label: 'Cut', hint: 'Money from loss or chance' },
    ],
    cards: [
      { id: 'g1', label: mech('xpOpens'), lane: mechLane('xpOpens'), visual: 'xpOpens', note: 'Opens are the stand-in that broke the first streak. Give XP for phrases finished in tune.' },
      { id: 'g2', label: mech('shrutiMap'), lane: mechLane('shrutiMap'), visual: 'shrutiMap', note: 'It tells her exactly how she’s doing on the skill itself. Competence, with nothing to lose.' },
      { id: 'g3', label: mech('streakRepair'), lane: mechLane('streakRepair'), visual: 'streakRepair', note: 'It charges for a loss Riyaaz designed. Make the streak forgiving instead.' },
      { id: 'g4', label: mech('cityBoard'), lane: mechLane('cityBoard'), visual: 'cityBoard', note: 'It counts real practice, but public ranking you can’t leave shames beginners. Make it opt-in, among friends.' },
      { id: 'g5', label: mech('droneHours'), lane: mechLane('droneHours'), visual: 'droneHours', note: 'The tanpura can play to an empty room. Count hours the tracker hears you sing.' },
      { id: 'g6', label: mech('teacherMark'), lane: mechLane('teacherMark'), visual: 'teacherMark', note: 'A real judgement from a real person, and progress you can feel. Relatedness and competence.' },
      { id: 'g7', label: mech('mysteryBox'), lane: mechLane('mysteryBox'), visual: 'mysteryBox', note: 'Paying for a chance is a gambling mechanic, and Kabir is 16. Sell the sounds at a fixed price.' },
      { id: 'g8', label: mech('zeroStreak'), lane: mechLane('zeroStreak'), visual: 'zeroStreak', note: 'It counts practice, but one missed day wipes it. Add rest days and a freeze.' },
      { id: 'g9', label: mech('lessonsWatched'), lane: mechLane('lessonsWatched'), visual: 'lessonsWatched', note: 'Watching isn’t singing. Level up on phrases learnt.' },
      { id: 'g10', label: mech('weekGoal'), lane: mechLane('weekGoal'), visual: 'weekGoal', note: 'She chooses the goal and rests without losing it. Autonomy.' },
      { id: 'g11', label: mech('expiringGems'), lane: mechLane('expiringGems'), visual: 'expiringGems', note: 'Manufactured loss with a price tag. Cut.' },
      { id: 'g12', label: mech('forcedShare'), lane: mechLane('forcedShare'), visual: 'forcedShare', note: 'The certificate is earned, but posting it shouldn’t be the price of the next lesson. Make sharing optional.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.6,
    prompt: 'Opens are up 18%, minutes sung per open are down from 14 to 6. What should Meera change first?',
    options: [{ id: 'a', label: 'Nothing; opens are up' }, { id: 'b', label: 'What the streak counts: a day should take ten minutes of singing the tracker can hear' }, { id: 'c', label: 'Add a ₹49 streak repair' }],
    correct: 'b', explanation: 'Count the behaviour you want, not the one that’s easy to measure.',
  },
  takeaways: [
    { title: 'It counts something', body: 'People optimise whatever a mechanic counts. Make it count the skill, not opens or time.' },
    { title: 'Inform, don’t control', body: 'Support competence, autonomy and relatedness: goals people set, forgiveness, opt-in rankings.' },
    { title: 'Never sell the loss', body: 'Paid repairs, paid chance and expiring currencies are cut, whatever they earn.' },
    { title: 'Judge by the outcome', body: 'Minutes sung and notes in tune against a holdout, not opens.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: '10 XP for every app open:', options: [{ id: 'a', label: 'Keep' }, { id: 'b', label: 'Retarget' }, { id: 'c', label: 'Cut' }], correct: 'b', explanation: 'It counts a stand-in.' },
      { id: 'q2', prompt: 'Pay ₹49 to restore a lost streak:', options: [{ id: 'a', label: 'Soften' }, { id: 'b', label: 'Cut' }, { id: 'c', label: 'Keep' }], correct: 'b', explanation: 'Money from a loss.' },
      { id: 'q3', prompt: 'A weekly goal of five days that you set yourself:', options: [{ id: 'a', label: 'Keep' }, { id: 'b', label: 'Retarget' }, { id: 'c', label: 'Soften' }], correct: 'a', explanation: 'Real practice, and your choice.' },
      { id: 'q4', prompt: 'Goodhart’s law says…', options: [{ id: 'a', label: 'Rewards always work' }, { id: 'b', label: 'A measure that becomes a target stops being a good measure' }, { id: 'c', label: 'Streaks double retention' }], correct: 'b', explanation: 'People optimise the target.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What did Lepper, Greene and Nisbett’s 1973 study find?', hint: 'Children, markers, an award.', options: [{ id: 'a', label: 'Rewards always raise motivation' }, { id: 'b', label: 'Children promised an award for drawing later drew less in free time than children who weren’t' }, { id: 'c', label: 'Awards had no effect' }, { id: 'd', label: 'Children preferred cash' }], correct: 'b', explanation: 'An expected reward can replace the reason people did it.' },
    { id: 'l2', prompt: 'Students love the city leaderboard. Why soften it rather than keep it?', hint: 'Who does it serve, and who does it shame?', options: [{ id: 'a', label: 'It’s too expensive' }, { id: 'b', label: 'It motivates the few at the top while beginners see their names at the bottom with no way out; opt-in and among friends keeps the good part' }, { id: 'c', label: 'Leaderboards are illegal' }, { id: 'd', label: 'Nobody looks at it' }], correct: 'b', explanation: 'Check who loves it, and who leaves because of it.' },
    { id: 'l3', prompt: 'Arjun says the streak repair would earn ₹4 lakh a month. What’s the strongest reply?', hint: 'Who pays, and why?', options: [{ id: 'a', label: 'It’s too little money' }, { id: 'b', label: 'It earns from the anxiety Riyaaz designed into the streak, from the most committed students; it costs trust, and fixing the streak removes the anxiety' }, { id: 'c', label: 'Price it at ₹99' }, { id: 'd', label: 'Make it free for Pro' }], correct: 'b', explanation: 'Name what it really sells.' },
    { id: 'l4', prompt: 'Which belongs in a review of any new mechanic?', hint: 'gr.1’s test.', options: [{ id: 'a', label: 'Would players be glad of it if they understood exactly how it works?' }, { id: 'b', label: 'Does a rival have it?' }, { id: 'c', label: 'Does it look fun in a screenshot?' }, { id: 'd', label: 'Is it cheap to build?' }], correct: 'a', explanation: 'If it only works while hidden, it’s a trick.' },
    { id: 'l5', prompt: 'Minutes per open recovered, but some students now practise 3 hours a day and report sore throats. What should Riyaaz do?', hint: 'More isn’t always better.', options: [{ id: 'a', label: 'Celebrate the most engaged users' }, { id: 'b', label: 'Ask teachers for a healthy limit, cap what the goal rewards, and suggest rest; engagement past what helps is a cost' }, { id: 'c', label: 'Add a badge for 3 hours' }, { id: 'd', label: 'Nothing; it’s their choice' }], correct: 'b', explanation: 'Design for the right amount, not the most.' },
  ],
};

export const gr4_4: Episode = {
  lessonId: 'gr.4-4',
  hook: '₹200 cashback per friend made Riyaaz’s K five times bigger. A month later, almost none of those friends were still singing. Watch Meera find the loop that brings people who stay.',
  scene: {
    id: 'viral-loop', duration: 38,
    beats: [
      { at: 0, title: 'K = 0.12', body: '0.6 invites per student, 20% join. Small, but it compounds: 1,000 from ads become about 1,136.' },
      { at: 6, title: 'The cashback jump', body: '₹200 per sign-up lifts K to 0.6. After 30 days, 8% are still practising.' },
      { at: 12, title: 'Kept K', body: 'K times the share who stay. Today’s is 0.06; the cashback’s is 0.048. It buys people who leave.' },
      { at: 18, title: 'Loops in the product', body: 'A duet clip with the teacher’s demo, and a link to try the same phrase. Teachers invite whole classes.' },
      { at: 24, title: 'Fair or not', body: 'Texting all contacts, auto-posting takes and invite-to-unlock win on numbers. All three are out.' },
      { at: 30, title: 'The new loop', body: 'Duet clips, class links, ₹150 each after ten practice days. Kept K 0.06 → 0.2.' },
      { at: 34, title: 'Amplified', body: 'Now 1,000 from ads become about 1,250 who stay.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why was the cashback a bad trade despite K of 0.6?', options: [{ id: 'a', label: 'It was too expensive to build' }, { id: 'b', label: 'The friends left: kept K fell below today’s' }, { id: 'c', label: 'Nobody shared it' }],
      correct: 'b', explanation: 'Grow with the people who stay.' },
    { id: 'c2', prompt: 'Why is the duet clip a strong loop?', options: [{ id: 'a', label: 'It pays people to share' }, { id: 'b', label: 'People share it because they’re proud of it, and the link lets a friend try the same phrase' }, { id: 'c', label: 'It posts automatically' }],
      correct: 'b', explanation: 'The best loops are the product being used.' },
  ],
  game: {
    id: 'referral-math', title: 'Run the referral numbers',
    instructions: 'Each card is a referral design with its numbers: invites per student, how many join, and how many are still practising after 30 days. Today, K is 0.12 and kept K is 0.06. Ship it, or is it hollow, dark or flat? Check fairness first.',
    lanes: [
      { id: 'ship', label: 'Ship', hint: 'Fair, and kept K rises' },
      { id: 'hollow', label: 'Hollow', hint: 'K up, but they leave' },
      { id: 'dark', label: 'Dark', hint: 'Not the user’s choice' },
      { id: 'flat', label: 'Flat', hint: 'Fair, moves nothing' },
    ],
    cards: [
      { id: 'g1', label: ref('cashSignup'), lane: refLane('cashSignup'), visual: 'cashSignup', note: 'K of 0.6, but 8% stay: kept K is 0.048, below today. It pays for leavers.' },
      { id: 'g2', label: ref('duet'), lane: refLane('duet'), visual: 'duet', note: 'People share what they’re proud of, and the link opens the phrase to try. Kept K more than doubles.' },
      { id: 'g3', label: ref('contacts'), lane: refLane('contacts'), visual: 'contacts', note: 'Kept K beats today, but it messages hundreds of people in Sunita’s name who she never chose. Out.' },
      { id: 'g4', label: ref('settingsShare'), lane: refLane('settingsShare'), visual: 'settingsShare', note: 'Fair, and nobody finds it. Put sharing where the pride is: right after a good take.' },
      { id: 'g5', label: ref('teacherLink'), lane: refLane('teacherLink'), visual: 'teacherLink', note: 'Teachers bring whole classes, and students who join with their class stay: kept K of 0.245.' },
      { id: 'g6', label: ref('contest'), lane: refLane('contest'), visual: 'contest', note: 'A few people recruit hard, and their recruits don’t stay. Kept K 0.03.' },
      { id: 'g7', label: ref('autoStatus'), lane: refLane('autoStatus'), visual: 'autoStatus', note: 'The numbers are fine. Sharing someone’s recording by default isn’t. Ask each time.' },
      { id: 'g8', label: ref('twoSided'), lane: refLane('twoSided'), visual: 'twoSided', note: 'Both people gain, and only once the friend has really practised. Kept K 0.135.' },
      { id: 'g9', label: ref('badgeShare'), lane: refLane('badgeShare'), visual: 'badgeShare', note: 'Friends on Instagram don’t join for a badge. K falls to 0.04.' },
      { id: 'g10', label: ref('inviteLock'), lane: refLane('inviteLock'), visual: 'inviteLock', note: 'Forced action, one of the 2023 dark patterns. The lesson she came for is held hostage.' },
      { id: 'g11', label: ref('freeMonth'), lane: refLane('freeMonth'), visual: 'freeMonth', note: 'K of 0.48, kept K 0.048. The reward is for the sign-up, so that’s what it buys.' },
      { id: 'g12', label: ref('homeBanner'), lane: refLane('homeBanner'), visual: 'homeBanner', note: 'Fair, but a banner with no reason to share is just wallpaper. Kept K 0.053.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 11.6,
    prompt: 'K is up from 0.12 to 0.6, but only 8% of referred students are still practising after 30 days. What should Meera measure?',
    options: [{ id: 'a', label: 'Sign-ups per day' }, { id: 'b', label: 'Kept K: invites × conversion × the share still practising after 30 days' }, { id: 'c', label: 'Invites sent' }],
    correct: 'b', explanation: 'Kept K shows whether the loop brings people who stay.',
  },
  takeaways: [
    { title: 'K compounds', body: 'Invites × conversion. Below 1, each user acquired becomes 1 ÷ (1 − K). Shorter cycles turn it faster.' },
    { title: 'Count who stays', body: 'Kept K, not sign-ups. Rewards for the sign-up buy people who leave.' },
    { title: 'Loops from the product', body: 'What people are proud to share, and the people who bring groups, beat paid invites.' },
    { title: 'The user chooses', body: 'Every invite to someone they picked, in their name with their say-so; nothing locked behind inviting.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: '1.4 invites per user, 18% join. K is…', options: [{ id: 'a', label: '0.252' }, { id: 'b', label: '1.58' }, { id: 'c', label: '0.18' }], correct: 'a', explanation: '1.4 × 0.18.' },
      { id: 'q2', prompt: 'Invite five friends to unlock the next raga:', options: [{ id: 'a', label: 'Ship' }, { id: 'b', label: 'Dark' }, { id: 'c', label: 'Flat' }], correct: 'b', explanation: 'Forced action.' },
      { id: 'q3', prompt: 'With K = 0.2, 1,000 acquired users become about…', options: [{ id: 'a', label: '1,200' }, { id: 'b', label: '1,250' }, { id: 'c', label: '5,000' }], correct: 'b', explanation: '1,000 ÷ 0.8.' },
      { id: 'q4', prompt: 'A free month per sign-up, with 10% still practising:', options: [{ id: 'a', label: 'Hollow' }, { id: 'b', label: 'Ship' }, { id: 'c', label: 'Dark' }], correct: 'a', explanation: 'K up, kept K down.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why is K above 1 a poor planning assumption?', hint: 'How long do loops stay that strong?', options: [{ id: 'a', label: 'It’s impossible' }, { id: 'b', label: 'It’s rare and rarely lasts, as the people most likely to invite run out; plan referral to amplify other acquisition' }, { id: 'c', label: 'It means losing users' }, { id: 'd', label: 'Investors dislike it' }], correct: 'b', explanation: 'Referral multiplies; it rarely replaces.' },
    { id: 'l2', prompt: 'Two loops have the same kept K, but one turns in 3 days and the other in 30. Which grows faster?', hint: 'Cycle time.', options: [{ id: 'a', label: 'The same' }, { id: 'b', label: 'The 3-day loop: it compounds ten times as often' }, { id: 'c', label: 'The 30-day loop' }, { id: 'd', label: 'It depends on the app store' }], correct: 'b', explanation: 'Faster cycles compound sooner.' },
    { id: 'l3', prompt: 'Why tie the ₹150 to the friend’s first ten practice days, not the sign-up?', hint: 'What does the reward buy?', options: [{ id: 'a', label: 'It’s cheaper to process' }, { id: 'b', label: 'You get what you pay for: paying for sign-ups buys sign-ups, paying for practice brings friends who practise' }, { id: 'c', label: 'Payment rules require it' }, { id: 'd', label: 'Friends prefer to wait' }], correct: 'b', explanation: 'Reward the behaviour you want from the friend.' },
    { id: 'l4', prompt: 'The contacts upload has kept K of 0.072, better than today. Legal says it’s allowed if a checkbox is in the terms. What should Meera say?', hint: 'Who gets the message, and did they choose?', options: [{ id: 'a', label: 'Ship it: the numbers and legal agree' }, { id: 'b', label: 'No: it messages people Sunita never chose, in her name; the DPDP Act asks for consent for a specific purpose, and LinkedIn paid $13 million over a similar flow' }, { id: 'c', label: 'Ship it to half of users' }, { id: 'd', label: 'Only upload work contacts' }], correct: 'b', explanation: 'Numbers don’t make a dark pattern fair.' },
    { id: 'l5', prompt: 'A year later, how will Meera know the referral loop is healthy?', hint: 'Who comes, and do they stay?', options: [{ id: 'a', label: 'Total invites sent' }, { id: 'b', label: 'Kept K and cycle time against a holdout, the 90-day retention of referred students against others, and complaints about unwanted invites' }, { id: 'c', label: 'Sign-ups on launch day' }, { id: 'd', label: 'App store rank' }], correct: 'b', explanation: 'Quality, speed and fairness, measured.' },
  ],
};
