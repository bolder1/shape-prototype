// Episodes for chapter rs.5 · Surveys & quant research. Drafts by Claude, for review.
// Bolo is a spoken-English app for students and job-seekers in Lucknow, Indore, Coimbatore and Patna. It has to choose
// between "Live rooms" (small speaking groups with a tutor) and "Daily drills" (ten-minute self-paced speaking drills).
// Tanushree Bose, its lead researcher, fixes the survey and who gets it, reads the gaps it finds with Kunal Bhatia,
// the PM, puts the dashboard through three gates with Rehan Siddiqui, the analyst, and weighs every claim in the
// decision memo. The data and the rules the games score against are in ../survey and tested there; the numbers quoted
// below are what those functions give.
import type { Episode } from '../episode';
import {
  BOLO_CLAIMS, BOLO_GAPS, BOLO_ITEMS, BOLO_SIGNALS, gapCall, signalGate, surveyFlaw, triangulate,
  type BoloClaim, type BoloGap, type BoloItem, type BoloSignal,
} from '../survey';

const item = (k: BoloItem) => BOLO_ITEMS[k].stem;
const flaw = (k: BoloItem) => surveyFlaw(BOLO_ITEMS[k]);
const gap = (k: BoloGap) => BOLO_GAPS[k].text;
const call = (k: BoloGap) => gapCall(BOLO_GAPS[k]);
const signal = (k: BoloSignal) => BOLO_SIGNALS[k].text;
const gate = (k: BoloSignal) => signalGate(BOLO_SIGNALS[k]);
const claim = (k: BoloClaim) => BOLO_CLAIMS[k].text;
const weight = (k: BoloClaim) => triangulate(BOLO_CLAIMS[k]);

export const rs5_1: Episode = {
  lessonId: 'rs.5-1',
  hook: 'Kunal’s pop-up gets 2,300 answers in a week, and 81% say yes. Tanushree sends 1,200 text messages instead, and trusts the 492 who reply more.',
  scene: {
    id: 'survey-sample', duration: 36,
    beats: [
      { at: 0, title: 'The quick survey', body: 'Bolo must choose: live rooms with a tutor, or ten-minute daily drills. Kunal puts a pop-up in the app. 2,300 answers in a week; 81% say yes.' },
      { at: 6, title: 'What the question did', body: '“Wouldn’t live practice with a tutor help your confidence?” It asks for a yes. Tanushree rewrites it: “In a normal week, which would you use more?”' },
      { at: 11, title: 'Who answered', body: 'The pop-up shows after a lesson, to people who chose to tap. Six in ten sign-ups have stopped practising. None of them saw it.' },
      { at: 16, title: 'Bigger isn’t better', body: 'In 1936 the Literary Digest had 2.4 million ballots and called the US election for the loser. Size can’t bring back the people who are missing.' },
      { at: 21, title: 'A random 1,200', body: 'Picked at random from everyone who signed up June to October, lapsed or not. Sent by SMS and WhatsApp, with two reminders.' },
      { at: 26, title: '492 answers', body: '41% reply. The margin of error is ±4.4 points, and Tanushree checks who answered against who she asked: city, plan, and how long since they practised.' },
      { at: 31, title: 'Honest about what it covers', body: 'Fewer answers, from the right people, with a margin that says exactly what it measures: chance, not bias.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did 81% say yes to Kunal’s question?', options: [{ id: 'a', label: 'Learners love tutors' }, { id: 'b', label: 'The question asked for a yes' }, { id: 'c', label: 'The sample was too small' }],
      correct: 'b', explanation: '“Wouldn’t it help…?” is a leading question. It measures politeness as much as preference.' },
    { id: 'c2', prompt: 'Why couldn’t 2,300 pop-up answers speak for all learners?', options: [{ id: 'a', label: 'People who’d stopped practising never saw it, and the rest chose themselves' }, { id: 'b', label: '2,300 is too few' }, { id: 'c', label: 'Pop-ups are annoying' }],
      correct: 'a', explanation: 'Coverage and self-selection are problems of who answers. More answers don’t fix them.' },
  ],
  game: {
    id: 'survey-spot', title: 'Lint the survey',
    instructions: 'Each card is an item from Bolo’s draft survey, as it would go out: the question, its answers, and who gets it. Tap the part that’s broken, or send it if it’s sound. The margin of error at the end only counts if the sample is honest.',
    lanes: [
      { id: 'stem', label: 'The question', hint: 'Leading, two in one, or about the future' },
      { id: 'options', label: 'The answers', hint: 'Overlapping, gaps, lopsided, or no way out' },
      { id: 'sample', label: 'Who gets it', hint: 'Can’t reach everyone, or people pick themselves' },
      { id: 'sound', label: 'Sound: send it', hint: 'Nothing to fix' },
    ],
    cards: [
      { id: 'g1', label: item('confidence'), lane: flaw('confidence'), visual: 'confidence', note: '“Wouldn’t it help…?” asks for a yes. Try: “In a normal week, which would you use more: a live room with a tutor, or a 10-minute drill?”' },
      { id: 'g2', label: item('lessonPrice'), lane: flaw('lessonPrice'), visual: 'lessonPrice', note: 'Two questions in one. Someone who loves the lessons and hates the price can’t answer. Ask about each separately.' },
      { id: 'g3', label: item('wouldJoin'), lane: flaw('wouldJoin'), visual: 'wouldJoin', note: 'People over-claim what they’ll do. Ask what they did: “Last week, on which evenings were you free for 30 minutes?”' },
      { id: 'g4', label: item('minutes'), lane: flaw('minutes'), visual: 'minutes', note: 'Someone who practised 10 minutes fits two boxes, and so does 20. Use 1–9, 10–19, 20 or more.' },
      { id: 'g5', label: item('rating'), lane: flaw('rating'), visual: 'rating', note: 'Three good options, one middle, one bad. The scale pushes ratings up. Balance it: very good, good, neither, poor, very poor.' },
      { id: 'g6', label: item('goal'), lane: flaw('goal'), visual: 'goal', note: 'A learner who wants English to talk to their child’s teacher has nowhere to go, so they pick something untrue. Add “Something else”.' },
      { id: 'g7', label: item('popup'), lane: flaw('popup'), visual: 'popup', note: 'A good question, sent to the wrong people: only learners finishing a lesson see it, and only those who tap answer.' },
      { id: 'g8', label: item('lapsed'), lane: flaw('lapsed'), visual: 'lapsed', note: 'People who stopped practising rarely open the app, so an in-app message never reaches most of them. Text a random sample instead.' },
      { id: 'g9', label: item('lastWeek'), lane: flaw('lastWeek'), visual: 'lastWeek', note: 'Recent, countable, ranges that cover 0 to 7 with no overlap, sent to a random sample that includes lapsed learners. Send it.' },
      { id: 'g10', label: item('evenings'), lane: flaw('evenings'), visual: 'evenings', note: 'It asks about last week, not a promise, and “Neither” is a real answer. This is the question that tells you whether live rooms can fill.' },
    ],
  },
  gap: {
    id: 'gap', from: 11, at: 15.6,
    prompt: '2,300 pop-up answers, from learners who finished a lesson and chose to tap. Enough to decide for everyone?',
    options: [{ id: 'a', label: 'Yes: thousands of answers means a tiny margin of error' }, { id: 'b', label: 'No: people who stopped never saw it, so ask a random sample of everyone' }, { id: 'c', label: 'Yes, if the next 2,300 agree' }],
    correct: 'b', explanation: 'The margin of error measures chance, not who’s missing. A random sample of everyone, lapsed learners included, beats a big sample of the keen.',
  },
  takeaways: [
    { title: 'Start from the decision', body: 'Know which number would change what you do before you write a question.' },
    { title: 'Measure the person, not the question', body: 'Neutral, one idea each, about what people did. Options that don’t overlap, scales that balance, and a way out.' },
    { title: 'Coverage before size', body: 'If your channel can’t reach someone, no number of answers speaks for them.' },
    { title: 'The margin measures chance', body: 'About ±1/√n. It says nothing about a leading question or a skewed sample.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: '“How happy are you with the speed and accuracy of scoring?” is…', options: [{ id: 'a', label: 'Double-barrelled' }, { id: 'b', label: 'Fine' }, { id: 'c', label: 'Hypothetical' }], correct: 'a', explanation: 'Two things, one answer.' },
      { id: 'q2', prompt: 'The margin of error for 400 random answers is about…', options: [{ id: 'a', label: '±1 point' }, { id: 'b', label: '±5 points' }, { id: 'c', label: '±20 points' }], correct: 'b', explanation: '1/√400 = 0.05.' },
      { id: 'q3', prompt: 'To halve the margin of error you need…', options: [{ id: 'a', label: 'Twice the answers' }, { id: 'b', label: 'Four times the answers' }, { id: 'c', label: 'A better question' }], correct: 'b', explanation: 'The margin shrinks with √n.' },
      { id: 'q4', prompt: 'An email survey to people who signed up by phone number has a problem of…', options: [{ id: 'a', label: 'Wording' }, { id: 'b', label: 'Coverage' }, { id: 'c', label: 'Scale balance' }], correct: 'b', explanation: 'Everyone without an email address is left out.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Which is the better question for deciding whether live rooms can fill?', hint: 'Past or future?', options: [{ id: 'a', label: 'Would you join live rooms three evenings a week?' }, { id: 'b', label: 'Last week, on which evenings were you free for 30 minutes?' }, { id: 'c', label: 'Do you like live rooms?' }, { id: 'd', label: 'How excited are you about live rooms?' }], correct: 'b', explanation: 'Recent behaviour predicts better than promises.' },
    { id: 'l2', prompt: 'The pop-up had 2,300 answers and a ±2-point margin. Why isn’t that margin honest?', hint: 'What does it measure?', options: [{ id: 'a', label: 'The maths is wrong' }, { id: 'b', label: 'It only counts chance, and the sample was skewed towards keen learners' }, { id: 'c', label: 'It should be ±1' }, { id: 'd', label: 'Margins only work for elections' }], correct: 'b', explanation: 'Bias doesn’t shrink as n grows. The margin just gets narrower around the wrong number.' },
    { id: 'l3', prompt: '41% replied, and lapsed learners replied less often than active ones. What should Tanushree do?', hint: 'Compare who answered with who was asked.', options: [{ id: 'a', label: 'Nothing, 41% is good' }, { id: 'b', label: 'Report lapsed and active learners separately, or weight answers to match the list' }, { id: 'c', label: 'Drop the lapsed learners' }, { id: 'd', label: 'Send it to active learners only' }], correct: 'b', explanation: 'Non-response is a bias too. You can see it because you know who you asked.' },
    { id: 'l4', prompt: 'Bolo has 2,000 learners in Patna. How many random answers give ±5 points there?', hint: 'A small, known population needs fewer.', options: [{ id: 'a', label: '385' }, { id: 'b', label: 'About 320' }, { id: 'c', label: '2,000' }, { id: 'd', label: '50' }], correct: 'b', explanation: 'The finite-population correction takes 385 down to 323 when the whole population is 2,000.' },
    { id: 'l5', prompt: 'The Literary Digest had 2.4 million answers in 1936 and called the election for the loser. What went wrong?', hint: 'Who was on the list, and who sent it back?', options: [{ id: 'a', label: 'Too few answers' }, { id: 'b', label: 'A list that leaned towards better-off voters, and a sample that chose to reply' }, { id: 'c', label: 'Bad maths' }, { id: 'd', label: 'Leading questions' }], correct: 'b', explanation: 'Coverage and self-selection. Gallup’s smaller, chosen sample called it right.' },
  ],
};

export const rs5_2: Episode = {
  lessonId: 'rs.5-2',
  hook: 'Drills 52%, live rooms 44%. Kunal is writing the launch email. Tanushree draws one bar across the gap, and it reaches zero.',
  scene: {
    id: 'margin-band', duration: 36,
    beats: [
      { at: 0, title: 'A win?', body: '492 random answers: 52% would use daily drills more, 44% live rooms. Kunal: “Drills by 8 points. Done.”' },
      { at: 6, title: 'Every share wobbles', body: 'From 492 people, each share is give or take 4.4 points. Draw the bands, and they nearly touch.' },
      { at: 11, title: 'The lead wobbles more', body: 'Every vote for drills is a vote against live rooms, so the lead wobbles about twice as much: 8 points, give or take 8.6.' },
      { at: 16, title: 'The line that matters', body: 'The team agreed beforehand: a 5-point lead decides it. The interval runs from just below zero to 17. It could be nothing, or decisive. Unclear.' },
      { at: 21, title: 'More people', body: 'A bigger random sample: 1,600 people. Drills 55%, live rooms 39%. A lead of 16 ± 4.7, clear of zero and of the line.' },
      { at: 26, title: 'Significant isn’t big', body: 'Meanwhile, a new lesson screen lifts top ratings by 2.4 points, p < 0.001. It’s real, and well short of the 5 points the rebuild needed.' },
      { at: 31, title: 'Four readings', body: 'Real, too small, no difference worth having, or unclear. The interval and the line decide which, before anyone argues.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why wasn’t an 8-point lead from 492 people a decision?', options: [{ id: 'a', label: 'Its interval included zero' }, { id: 'b', label: '8 points is small' }, { id: 'c', label: 'Surveys can’t decide things' }],
      correct: 'a', explanation: 'A lead in one sample has about twice the headline margin: 8 ± 8.6.' },
    { id: 'c2', prompt: 'The new lesson screen’s lift was highly significant. Why didn’t it justify the rebuild?', options: [{ id: 'a', label: 'The test was flawed' }, { id: 'b', label: 'It was real but smaller than the 5 points the team said it needed' }, { id: 'c', label: 'p was too low' }],
      correct: 'b', explanation: 'Significance says the gap isn’t zero. The line set beforehand says whether it’s worth anything.' },
  ],
  game: {
    id: 'gap-read', title: 'Read the gap',
    instructions: 'Each card is a gap from Bolo’s research. First estimate its margin, the “give or take” on the gap, in points. Then see the interval drawn against zero and the line that matters, and say what it means.',
    lanes: [
      { id: 'real', label: 'Real, and it matters', hint: 'Clear of zero, at least as big as the line' },
      { id: 'small', label: 'Real, too small', hint: 'Clear of zero, smaller than the line' },
      { id: 'none', label: 'No gap worth having', hint: 'The whole interval sits inside the line' },
      { id: 'unclear', label: 'Unclear: ask more', hint: 'Reaches zero and gaps that matter' },
    ],
    cards: [
      { id: 'g1', label: gap('headline'), lane: call('headline'), visual: 'headline', note: '8 ± 8.6: the lead could be zero, or 17. A lead within one sample wobbles about twice as much as either share. Ask more people.' },
      { id: 'g2', label: gap('followup'), lane: call('followup'), visual: 'followup', note: '16 ± 4.7, from 1,600. Even the bottom of the interval, 11 points, is past the 5-point line. Drills it is.' },
      { id: 'g3', label: gap('jobseekers'), lane: call('jobseekers'), visual: 'jobseekers', note: 'Two separate groups: their margins combine, so ± 7. Still, 27 points is far past the 10-point line. If live rooms happen, they’re for job-seekers.' },
      { id: 'g4', label: gap('lessonScreen'), lane: call('lessonScreen'), visual: 'lessonScreen', note: '2.4 ± 1.3, from 8,000 a version. Definitely real, and definitely under 5. Big samples make small gaps significant.' },
      { id: 'g5', label: gap('cities'), lane: call('cities'), visual: 'cities', note: 'Coimbatore is 3 points lower, ± 2.5. Real, but the team only sets city prices for an 8-point gap, and the whole interval is under that.' },
      { id: 'g6', label: gap('voice'), lane: call('voice'), visual: 'voice', note: '0.5 ± 3.7: whichever voice is better, it’s by less than the 5 points that would matter. Choose on cost or variety.' },
      { id: 'g7', label: gap('reminder'), lane: call('reminder'), visual: 'reminder', note: '0.6 ± 3.1, inside ±5 both ways. The reminder time doesn’t matter enough to argue about. That’s a result.' },
      { id: 'g8', label: gap('women30'), lane: call('women30'), visual: 'women30', note: '17 points sounds big, but from 30 women the gap is ± 18. A subgroup this small is a question for the next study, not a finding.' },
    ],
  },
  gap: {
    id: 'gap', from: 11, at: 15.6,
    prompt: 'The lead is 8 points, give or take 8.6. Should Kunal announce that drills won?',
    options: [{ id: 'a', label: 'Yes: 8 points is a clear lead' }, { id: 'b', label: 'No: zero is inside the interval, so ask more people first' }, { id: 'c', label: 'No: surveys can’t decide between products' }],
    correct: 'b', explanation: 'With zero inside the interval, the lead could be chance. A bigger random sample can settle it.',
  },
  takeaways: [
    { title: 'Everything wobbles', body: 'About ±1/√n for one share. Two separate groups: the margins combine. A lead in one sample: about double.' },
    { title: 'Zero inside means maybe nothing', body: 'That’s all “not significant” means. Look at the interval, not the headline.' },
    { title: 'Set the line first', body: 'Write down the smallest gap that would change the decision before you see the data.' },
    { title: 'Four readings', body: 'Real, too small, no difference worth having, or unclear. Only the last needs more people.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'A gap’s 95% interval runs from −2 to +9 points. It is…', options: [{ id: 'a', label: 'Significant' }, { id: 'b', label: 'Could be chance' }], correct: 'b', explanation: 'Zero is inside.' },
      { id: 'q2', prompt: 'A lead between two answers from the same 400 people wobbles about…', options: [{ id: 'a', label: '±10 points' }, { id: 'b', label: '±5 points' }, { id: 'c', label: '±2.5 points' }], correct: 'a', explanation: 'Roughly twice the ±5 for one share.' },
      { id: 'q3', prompt: '100,000 users a version, +0.3 points, p < 0.001. Most likely…', options: [{ id: 'a', label: 'A big win' }, { id: 'b', label: 'Real but probably too small to matter' }, { id: 'c', label: 'A tracking bug' }], correct: 'b', explanation: 'Huge samples make tiny gaps significant.' },
      { id: 'q4', prompt: 'You slice a survey 20 ways and one slice is significant at 5%. That’s…', options: [{ id: 'a', label: 'A finding' }, { id: 'b', label: 'About what chance alone would give' }, { id: 'c', label: 'Proof of a segment' }], correct: 'b', explanation: 'One in 20 by chance. Test it fresh.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Lucknow 61%, Coimbatore 58%, 3,000 people each. Roughly how big is the margin on the gap?', hint: 'Each share is about ±1.8. Combine them.', options: [{ id: 'a', label: '±1.8' }, { id: 'b', label: '±2.5' }, { id: 'c', label: '±3.6' }, { id: 'd', label: '±0.9' }], correct: 'b', explanation: '√(1.8² + 1.8²) ≈ 2.5. Not double: the margins combine like the sides of a right-angled triangle.' },
    { id: 'l2', prompt: 'Why does a lead within one sample wobble more than a gap between two groups of the same size?', hint: 'A vote for one is…', options: [{ id: 'a', label: 'It doesn’t' }, { id: 'b', label: 'Every vote for one option is a vote against the other, so the two shares move in opposite directions' }, { id: 'c', label: 'Samples are smaller' }, { id: 'd', label: 'Leads use a different test' }], correct: 'b', explanation: 'The shares are negatively linked. That’s why a poll’s lead has about twice the quoted margin.' },
    { id: 'l3', prompt: 'Reminder times: 0.6 ± 3.1 points, and 5 points would matter. What should the write-up say?', hint: 'Where is the whole interval?', options: [{ id: 'a', label: 'Inconclusive, rerun it' }, { id: 'b', label: 'No difference worth having: the interval rules out a 5-point gap either way' }, { id: 'c', label: '8 pm is better' }, { id: 'd', label: 'Nothing, it failed' }], correct: 'b', explanation: 'A tight interval around zero is a finding. It frees the team to stop arguing.' },
    { id: 'l4', prompt: 'Why write down the line that matters before seeing the data?', hint: 'What happens if you set it after?', options: [{ id: 'a', label: 'It’s a formality' }, { id: 'b', label: 'Otherwise the line drifts to whatever the result turned out to be' }, { id: 'c', label: 'Statistics requires it' }, { id: 'd', label: 'It makes the sample smaller' }], correct: 'b', explanation: 'A line set afterwards is a rationalisation. Set it when nobody knows the answer.' },
    { id: 'l5', prompt: 'Women over 30 prefer live rooms by 17 ± 18 points, from 30 of them. Kunal wants a women-only live room. Best response?', hint: 'How many people, and how many slices did you look at?', options: [{ id: 'a', label: 'Build it: 17 points is huge' }, { id: 'b', label: 'Treat it as a question: sample enough women over 30 to tell, before building anything' }, { id: 'c', label: 'Ignore subgroups' }, { id: 'd', label: 'Average it with everyone else' }], correct: 'b', explanation: 'A small slice found after the fact is a hypothesis. A study designed for it can confirm it.' },
  ],
};

export const rs5_3: Episode = {
  lessonId: 'rs.5-3',
  hook: 'Trial-to-paid falls four points, and Kunal wants a new trial. Rehan splits the number in two, and nobody’s behaviour has changed at all.',
  scene: {
    id: 'dashboard-dig', duration: 36,
    beats: [
      { at: 0, title: 'Monday’s dashboard', body: 'Trial-to-paid is down from 20% to 16% in a month. Kunal wants the trial redesigned by December.' },
      { at: 6, title: 'Gate 1: the instrument', body: 'Rehan checks the release notes and the event that marks a payment. Nothing changed in how a conversion is counted.' },
      { at: 11, title: 'Gate 2: split it', body: 'By who signed up: job-seekers converted at 25% before and 25% after. Students at 10% and 10%. But a college campaign tripled the students.' },
      { at: 16, title: 'The mix moved', body: 'Nobody behaves differently. More of the people who always convert less arrived. Redesigning the trial would fix nothing.' },
      { at: 21, title: 'Another number', body: 'Since speaking drills moved to the start of each lesson, finished lessons fell from 64% to 58%, for job-seekers and students alike.' },
      { at: 26, title: 'Gate 3: why?', body: 'The data says what, and everywhere. It can’t say why. Tanushree calls six learners who quit at the first drill: five practise on a bus or in a shared room, and won’t speak aloud there.' },
      { at: 31, title: 'Back to the data', body: 'A “Speak later” button ships. Rehan watches the same number: finished lessons climb back to 63%.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What did Rehan check before splitting the number?', options: [{ id: 'a', label: 'Whether it was significant' }, { id: 'b', label: 'Whether the way it’s measured had changed' }, { id: 'c', label: 'What Kunal thought' }],
      correct: 'b', explanation: 'A number has to mean what it meant last month before anyone explains it.' },
    { id: 'c2', prompt: 'How did Bolo find out why finished lessons fell?', options: [{ id: 'a', label: 'From the event data' }, { id: 'b', label: 'By asking six people who quit at the drill' }, { id: 'c', label: 'From a dashboard filter' }],
      correct: 'b', explanation: 'Analytics showed who and where to ask. People told them why.' },
  ],
  game: {
    id: 'signal-gate', title: 'Through the gates',
    instructions: 'Each card is a number from Bolo’s dashboard. Send it through the gates: does it still mean what it did, does one slice or a change in the mix explain it, and does the data answer the question being asked? Stop it at the first gate it fails, or let it through to act.',
    lanes: [
      { id: 'instrument', label: 'Fix the data', hint: 'It doesn’t mean what it used to' },
      { id: 'segment', label: 'Look at the slice', hint: 'One group, or the mix, explains it' },
      { id: 'ask', label: 'Ask why', hint: 'The data says what, not why' },
      { id: 'act', label: 'Act on it', hint: 'The data answers the question' },
    ],
    cards: [
      { id: 'g1', label: signal('dau'), lane: gate('dau'), visual: 'dau', note: 'A jump on a release day is a tracking question first. In 6.1, a tapped notification counts as practice. Fix the event, then look again.' },
      { id: 'g2', label: signal('ratings'), lane: gate('ratings'), visual: 'ratings', note: 'The sheet now starts on three stars, so “Done” records a 3. The lessons didn’t get worse; the measure did. Start it empty.' },
      { id: 'g3', label: signal('trial'), lane: gate('trial'), visual: 'trial', note: 'Both groups convert exactly as before. The campaign brought three times the students, who convert less. The question is the campaign, not the trial.' },
      { id: 'g4', label: signal('fiveDays'), lane: gate('fiveDays'), visual: 'fiveDays', note: 'Lucknow and Indore are flat. Coimbatore fell from 38% to 27%. Look there first: what changed for Tamil-speaking learners?' },
      { id: 'g5', label: signal('dayThree'), lane: gate('dayThree'), visual: 'dayThree', note: 'The data tells you who left and when. Text a short exit survey to those people, and call six of them.' },
      { id: 'g6', label: signal('speakFirst'), lane: gate('speakFirst'), visual: 'speakFirst', note: 'The data is sound and the drop is everywhere, so no slice explains it. Why people stop at a speaking drill is something you have to ask.' },
      { id: 'g7', label: signal('bestTime'), lane: gate('bestTime'), visual: 'bestTime', note: 'A “when” question, and the data answers it. Run live rooms at 9 pm, not 7.' },
      { id: 'g8', label: signal('quits'), lane: gate('quits'), visual: 'quits', note: 'A “where” question: start the rewrite with those three lessons. Why people quit them is the next question, for after the first fix.' },
    ],
  },
  gap: {
    id: 'gap', from: 11, at: 15.6,
    prompt: 'Job-seekers and students each convert exactly as before, but there are three times as many students. Should Bolo redesign the trial?',
    options: [{ id: 'a', label: 'Yes: trial-to-paid fell four points' }, { id: 'b', label: 'No: the mix changed, so ask whether the campaign brought the right people' }, { id: 'c', label: 'Fix the tracking first' }],
    correct: 'b', explanation: 'When every slice is flat and the total moves, who the users are changed, not what they do.',
  },
  takeaways: [
    { title: 'Check the instrument', body: 'A step on a release day is a tracking question before it’s a user question.' },
    { title: 'Split before you explain', body: 'Every slice flat and the total moving means the mix moved. One slice moving means look there.' },
    { title: 'What, not why', body: 'Analytics shows what, when, where and how many. Ask people for the why.' },
    { title: 'Measure the fix', body: 'Research explains; the same number tells you whether the fix worked.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'A metric jumps on the day a new version ships. First check…', options: [{ id: 'a', label: 'The event definition' }, { id: 'b', label: 'User interviews' }, { id: 'c', label: 'Significance' }], correct: 'a', explanation: 'Make sure it still measures the same thing.' },
      { id: 'q2', prompt: 'The total falls but every segment is flat. That’s…', options: [{ id: 'a', label: 'A tracking bug' }, { id: 'b', label: 'A change in the mix' }, { id: 'c', label: 'Impossible' }], correct: 'b', explanation: 'Simpson’s paradox, at its mildest.' },
      { id: 'q3', prompt: '“Why do people quit on day 3?” is answered best by…', options: [{ id: 'a', label: 'A funnel chart' }, { id: 'b', label: 'Asking people who quit on day 3' }, { id: 'c', label: 'A bigger sample' }], correct: 'b', explanation: 'The funnel finds them. They tell you why.' },
      { id: 'q4', prompt: '“Which hour do most sessions start?” is answered by…', options: [{ id: 'a', label: 'The event data' }, { id: 'b', label: 'A survey' }, { id: 'c', label: 'Interviews' }], correct: 'a', explanation: 'A “when” question about behaviour. The logs know.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Android ratings fell from 4.5 to 3.9 overnight. The new sheet starts on three stars. What’s the right next step?', hint: 'Did the lessons change overnight?', options: [{ id: 'a', label: 'Improve the lessons' }, { id: 'b', label: 'Start the sheet empty, and compare ratings only from before the change or after the fix' }, { id: 'c', label: 'Ask learners why they’re unhappy' }, { id: 'd', label: 'Ignore Android' }], correct: 'b', explanation: 'A default became the answer. Fix the measure before reading it.' },
    { id: 'l2', prompt: 'Practising five days a week fell from 38% to 35%. Lucknow and Indore are flat; Coimbatore fell 11 points. What does that tell Rehan?', hint: 'Where did it happen?', options: [{ id: 'a', label: 'All learners are losing interest' }, { id: 'b', label: 'Something changed for Coimbatore learners, so look there' }, { id: 'c', label: 'It’s noise' }, { id: 'd', label: 'Tracking broke everywhere' }], correct: 'b', explanation: 'One slice explains the whole drop. A national fix would miss it.' },
    { id: 'l3', prompt: 'Why can’t the trial data alone explain the college campaign’s effect on revenue?', hint: 'What’s still unknown?', options: [{ id: 'a', label: 'It can, completely' }, { id: 'b', label: 'It shows students convert less, but not whether they renew later or tell friends' }, { id: 'c', label: 'Students don’t pay' }, { id: 'd', label: 'Campaigns can’t be measured' }], correct: 'b', explanation: 'Behaviour data answers the question it records. Ask a new one before deciding the campaign failed.' },
    { id: 'l4', prompt: 'Lessons finished fell everywhere after drills moved first. Kunal says “People hate speaking, obviously.” What’s wrong with that?', hint: 'Is that in the data?', options: [{ id: 'a', label: 'Nothing, it’s obvious' }, { id: 'b', label: 'It’s a guess about why; the data only says they stopped there' }, { id: 'c', label: 'He should have looked at Android' }, { id: 'd', label: 'It’s not significant' }], correct: 'b', explanation: 'The real reason, nobody speaks aloud on a bus, needed a different fix from “they hate speaking”.' },
    { id: 'l5', prompt: 'Which pairing uses analytics and research best?', hint: 'Who finds whom?', options: [{ id: 'a', label: 'Survey everyone, then build dashboards' }, { id: 'b', label: 'Use the data to find who to ask and where, ask them why, then measure the fix with the same number' }, { id: 'c', label: 'Pick whichever agrees with the team' }, { id: 'd', label: 'Analytics for big decisions, research for small' }], correct: 'b', explanation: 'Each does what the other can’t, and the number closes the loop.' },
  ],
};

export const rs5_4: Episode = {
  lessonId: 'rs.5-4',
  hook: 'The survey says job-seekers want live rooms. The pilot says 9% turned up. Tanushree puts the two side by side and finds the real finding in the gap.',
  scene: {
    id: 'source-weave', duration: 36,
    beats: [
      { at: 0, title: 'The memo', body: 'Friday. Tanushree writes the decision memo: live rooms or daily drills. Nine claims, from five kinds of research.' },
      { at: 6, title: 'Say and do', body: 'She tags every source. Surveys, interviews and support tickets: what people say. Analytics and usability tests: what they do.' },
      { at: 11, title: 'Drills: confident', body: '55% chose drills. Learners with short, frequent sessions renew twice as often. Nine of twelve practise in 10-minute gaps. Say and do agree.' },
      { at: 16, title: 'Live rooms: a conflict', body: '58% of job-seekers say they’d use live rooms more. Of 2,000 offered a free one, 9% joined even once.' },
      { at: 21, title: 'The gap is the finding', body: 'The pilot ran at 7 pm; 71% of sessions start after 9. And in six calls, job-seekers said speaking in front of strangers felt like an interview.' },
      { at: 26, title: 'Certificates: a lead', body: 'A survey and interviews both say a certificate would motivate people. Both are what people say. So test it: offer one to a random tenth of learners.' },
      { at: 31, title: 'The call', body: 'Daily drills, built now. A 9 pm live-room pilot to settle the conflict. Every claim in the memo carries its weight.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why was “learners prefer drills” confident?', options: [{ id: 'a', label: '55% is a majority' }, { id: 'b', label: 'What people said and what they did both pointed the same way' }, { id: 'c', label: 'The survey was big' }],
      correct: 'b', explanation: 'Methods with different blind spots agreed.' },
    { id: 'c2', prompt: 'What did Tanushree do with the live-room conflict?', options: [{ id: 'a', label: 'Trusted the survey' }, { id: 'b', label: 'Dug into why people didn’t join, and found the time and the nerves' }, { id: 'c', label: 'Dropped live rooms for good' }],
      correct: 'b', explanation: 'When sources disagree, the reason is usually the most useful finding in the study.' },
  ],
  game: {
    id: 'source-triangle', title: 'Weigh the memo',
    instructions: 'Each card is a claim from Bolo’s decision memo with the evidence behind it, tagged by what people say and what they do. Weigh it: confident, a lead to check, or a conflict to dig into.',
    lanes: [
      { id: 'confident', label: 'Confident', hint: 'What people say and do agree' },
      { id: 'lead', label: 'A lead', hint: 'All one kind of evidence' },
      { id: 'conflict', label: 'Conflict', hint: 'A source disagrees' },
    ],
    cards: [
      { id: 'g1', label: claim('drills'), lane: weight('drills'), visual: 'drills', note: 'A survey, behaviour data and interviews, pointing the same way. Build on it.' },
      { id: 'g2', label: claim('price'), lane: weight('price'), visual: 'price', note: 'People say price; a cheaper month didn’t change what they did. Price is the easy reason to give. Ask what “not worth it” means to them.' },
      { id: 'g3', label: claim('certificate'), lane: weight('certificate'), visual: 'certificate', note: 'Two methods, one blind spot: both are what people say would motivate them. Offer certificates to a random share and measure practice.' },
      { id: 'g4', label: claim('mic'), lane: weight('mic'), visual: 'mic', note: 'Watched, reported and measured. Move the record button into reach on small phones; nobody needs to argue.' },
      { id: 'g5', label: claim('liveDemand'), lane: weight('liveDemand'), visual: 'liveDemand', note: '58% said yes; 9% came. Find out what stopped them: the 7 pm slot, and speaking to strangers feeling like an interview.' },
      { id: 'g6', label: claim('slow'), lane: weight('slow'), visual: 'slow', note: 'Screens load as fast as ever, so what’s “slow”? Probably the speech score on weak connections, which the load-time chart doesn’t measure.' },
      { id: 'g7', label: claim('hindi'), lane: weight('hindi'), visual: 'hindi', note: 'Asked for, and it works when people get it. Roll Hindi instructions out to Lucknow and Patna.' },
      { id: 'g8', label: claim('grammar'), lane: weight('grammar'), visual: 'grammar', note: 'The data shows they skip, not why. “Boring” is a guess: they may already know it, or be on mute. Ask.' },
      { id: 'g9', label: claim('friends'), lane: weight('friends'), visual: 'friends', note: 'All say, no do. Before building a friends feature, see whether people share an invite link when you give them one.' },
    ],
  },
  gap: {
    id: 'gap', from: 16, at: 20.6,
    prompt: '58% of job-seekers say they’d use live rooms more. 9% of those offered one joined. What should the memo say?',
    options: [{ id: 'a', label: 'Job-seekers want live rooms' }, { id: 'b', label: 'The sources conflict: find out why they didn’t join before deciding' }, { id: 'c', label: 'Drop the survey, it was wrong' }],
    correct: 'b', explanation: 'The disagreement is the finding. Find what stood between wanting and joining.',
  },
  takeaways: [
    { title: 'Say and do', body: 'Every method has a blind spot. Check a claim with methods whose blind spots don’t overlap.' },
    { title: 'More of one kind isn’t more', body: 'Three surveys agreeing is still one kind of evidence.' },
    { title: 'Conflict is a finding', body: 'When what people say and do disagree, the reason is what you most need to know.' },
    { title: 'Weigh every claim', body: 'Confident, lead or conflict, written next to the claim. Decide on the confident ones.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'Support tickets record…', options: [{ id: 'a', label: 'What people say' }, { id: 'b', label: 'What people do' }], correct: 'a', explanation: 'They’re people describing a problem.' },
      { id: 'q2', prompt: 'A survey and interviews agree. That’s…', options: [{ id: 'a', label: 'Confident' }, { id: 'b', label: 'A lead' }, { id: 'c', label: 'A conflict' }], correct: 'b', explanation: 'Both are what people say.' },
      { id: 'q3', prompt: 'People say price; a discount changes nothing. Most likely…', options: [{ id: 'a', label: 'The discount was too small' }, { id: 'b', label: 'Price is the easy answer, not the cause' }, { id: 'c', label: 'Analytics is wrong' }], correct: 'b', explanation: 'A classic say–do gap.' },
      { id: 'q4', prompt: 'A decision should rest on…', options: [{ id: 'a', label: 'The biggest sample' }, { id: 'b', label: 'Confident claims' }, { id: 'c', label: 'The CEO’s favourite' }], correct: 'b', explanation: 'Leads and conflicts become the next research.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Which pair of sources triangulates “people can’t find the record button”?', hint: 'One say, one do.', options: [{ id: 'a', label: 'A survey and interviews' }, { id: 'b', label: 'Support tickets and a usability test' }, { id: 'c', label: 'Two surveys' }, { id: 'd', label: 'Analytics and a second analytics tool' }], correct: 'b', explanation: 'Reported and watched: different blind spots.' },
    { id: 'l2', prompt: '“The app has got slower” doubles in tickets, but median load time is flat. What should Tanushree look at?', hint: 'What does each source measure?', options: [{ id: 'a', label: 'Nothing, the data says it isn’t slower' }, { id: 'b', label: 'What “slow” means to those people: maybe the speech score on weak connections' }, { id: 'c', label: 'Ask support to close the tickets' }, { id: 'd', label: 'Average the two' }], correct: 'b', explanation: 'Sources can disagree because they measure different things. Find the thing people mean.' },
    { id: 'l3', prompt: 'Grammar videos are skipped 70% of the time and 3 of 5 testers skipped them. The memo says “because they’re boring”. What’s the problem?', hint: 'Which part did the evidence show?', options: [{ id: 'a', label: 'Nothing, two sources agree' }, { id: 'b', label: 'Both sources show what people do; the “because” is a guess' }, { id: 'c', label: 'Five testers is too few' }, { id: 'd', label: 'Videos are always skipped' }], correct: 'b', explanation: 'Behaviour shows the skip. Only asking shows the reason.' },
    { id: 'l4', prompt: 'Why is a conflict between say and do often the most useful finding in a study?', hint: 'What does the gap hide?', options: [{ id: 'a', label: 'It proves the survey wrong' }, { id: 'b', label: 'The reason for the gap is usually what the design has to solve' }, { id: 'c', label: 'It makes the memo longer' }, { id: 'd', label: 'It isn’t' }], correct: 'b', explanation: 'Job-seekers wanted practice, not a 7 pm stage. That shaped the next pilot.' },
    { id: 'l5', prompt: 'The memo recommends daily drills. What should it do with the live-room conflict and the certificate lead?', hint: 'Decide on what, and research what?', options: [{ id: 'a', label: 'Leave them out' }, { id: 'b', label: 'List them with their weights as the next research: a 9 pm pilot and a certificate test' }, { id: 'c', label: 'Build both anyway' }, { id: 'd', label: 'Count them as support for drills' }], correct: 'b', explanation: 'Decide on the confident claims; turn the rest into the next studies.' },
  ],
};
