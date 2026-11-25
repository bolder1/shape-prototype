// Episodes for chapter dc.3 · Designing with & for AI. Drafts by Claude, for review.
// Hisaab is a bookkeeping app for kirana shops. Meera Iyer, its product designer, uses AI through a week of work on
// "Snap a bill" (which reads a supplier's bill from a photo), redesigns the feature so Ramesh Patil checks what the AI
// is unsure of before anything reaches his khata, and writes and tests the instructions for the "Ask Hisaab"
// assistant. The tasks, bill fields and test questions, and the rules they're judged by, are in ../ai and tested there.
import type { Episode } from '../episode';
import {
  HISAAB_EVALS, HISAAB_FIELDS, HISAAB_TASKS, aiRole, fieldTreatment,
  type HisaabCase, type HisaabField, type HisaabTask,
} from '../ai';

const task = (k: HisaabTask) => HISAAB_TASKS[k].text;
const role = (k: HisaabTask) => aiRole(HISAAB_TASKS[k]);
const STAKES_TEXT = { money: 'money', record: 'record', label: 'label' } as const;
const field = (k: HisaabField) => { const f = HISAAB_FIELDS[k]; return `${f.label}: read “${f.read}”, ${Math.round(f.conf * 100)}% sure, ${STAKES_TEXT[f.stakes]} field${k === 'total' ? '. The lines don’t add up to it' : ''}`; };
const treat = (k: HisaabField) => fieldTreatment(k);
const asked = (k: HisaabCase) => `“${HISAAB_EVALS[k].ask}” Reply: “${HISAAB_EVALS[k].bad}”`;
const fix = (k: HisaabCase) => HISAAB_EVALS[k].fix;

export const dc3_1: Episode = {
  lessonId: 'dc.3-1',
  hook: 'AI gave Meera back almost 40 hours in a week. One shortcut nearly cost her the whole design.',
  scene: {
    id: 'ai-workflow', duration: 36,
    beats: [
      { at: 0, title: 'One week, one feature', body: 'Meera has a week to research and design “Snap a bill”: photograph a supplier’s bill, and Hisaab fills in the purchase entry.' },
      { at: 6, title: 'The fast parts', body: 'Eight interviews transcribed and translated by lunch. 600 Play Store reviews in themes. 40 dummy bills for the prototype.' },
      { at: 11, title: 'Check what it made', body: 'She plays back every number in the transcripts. One says 60 bills a week; the shop owner said 16. She fixes it before it becomes a finding.' },
      { at: 16, title: 'The shortcut', body: 'A colleague asks a chatbot to play five kirana owners. All five want bills posted automatically, no review. It sounds right.' },
      { at: 21, title: 'Real people disagree', body: 'Meera visits five real shops. All five check every rupee before it goes in the khata. One keeps paper bills in a steel box for a year.' },
      { at: 26, title: 'Widen, then choose', body: 'AI drafts 20 layouts for the review screen. She picks two ideas and combines them. A heuristics pass catches a contrast failure before crit.' },
      { at: 31, title: 'Hours back, judgment kept', body: 'Almost 40 hours back, after checking. She spends them on two more shop visits. The roadmap call stays hers.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did Meera play back the numbers in the transcripts?', options: [{ id: 'a', label: 'The tool is always wrong' }, { id: 'b', label: 'Numbers, names and quotes are where transcripts slip, and they become findings' }, { id: 'c', label: 'To practise Marathi' }],
      correct: 'b', explanation: 'Checking is part of the job you delegated. It’s still faster than transcribing.' },
    { id: 'c2', prompt: 'Why did the chatbot “shop owners” get it wrong?', options: [{ id: 'a', label: 'They used the wrong model' }, { id: 'b', label: 'A simulation says what sounds plausible; it can’t tell you what real owners do' }, { id: 'c', label: 'There were only five' }],
      correct: 'b', explanation: 'Real behaviour, like checking every rupee, comes from real people.' },
  ],
  game: {
    id: 'ai-delegate', title: 'Plan Meera’s week',
    instructions: 'Each card is a task in Meera’s week. Let AI draft it for her to check, keep her in the lead with AI widening the options, or keep AI out. The week fills in, with the hours each call gives back.',
    lanes: [
      { id: 'delegate', label: 'AI drafts, she checks', hint: 'Quick to check, nothing to decide' },
      { id: 'assist', label: 'She leads, AI widens', hint: 'The call is hers' },
      { id: 'keep', label: 'Keep AI out', hint: 'Fakes evidence, or exposes data' },
    ],
    cards: [
      { id: 'g1', label: task('transcribe'), lane: role('transcribe'), visual: 'transcribe', note: 'An approved tool, and output she can spot-check against the audio. She replays every number, name and quote.' },
      { id: 'g2', label: task('synthetic'), lane: role('synthetic'), visual: 'synthetic', note: 'A chatbot can help write the interview guide. It can’t stand in for the interviews: it tells you what owners sound like, not what they do.' },
      { id: 'g3', label: task('layouts'), lane: role('layouts'), visual: 'layouts', note: 'Twenty options in minutes is a real gain. Picking and combining them is the design work, and it’s hers.' },
      { id: 'g4', label: task('bills'), lane: role('bills'), visual: 'bills', note: 'Fake data that looks real makes a better prototype. A glance tells her if the totals and GST make sense.' },
      { id: 'g5', label: task('support'), lane: role('support'), visual: 'support', note: 'Customers’ phone numbers and GSTINs don’t go into a tool the company hasn’t approved. Use the approved one, or strip the data first.' },
      { id: 'g6', label: task('reviews'), lane: role('reviews'), visual: 'reviews', note: 'Public reviews, and themes she can test by reading a sample from each. Counts and quotes still get checked.' },
      { id: 'g7', label: task('roadmap'), lane: role('roadmap'), visual: 'roadmap', note: 'Ask AI to argue the other side, or poke holes in her case. The decision, and owning it, stays with the team.' },
      { id: 'g8', label: task('prototype'), lane: role('prototype'), visual: 'prototype', note: 'She clicks through every path before a participant sees it. A coded prototype that took an afternoon would have taken a sprint.' },
      { id: 'g9', label: task('quotes'), lane: role('quotes'), visual: 'quotes', note: 'A quote is evidence. Tidied by AI, it’s words nobody said. Translate faithfully and mark any cut with “…”.' },
      { id: 'g10', label: task('critique'), lane: role('critique'), visual: 'critique', note: 'A useful first pass that catches contrast and labels. Which findings matter for Ramesh is her call.' },
      { id: 'g11', label: task('translate'), lane: role('translate'), visual: 'translate', note: 'A draft in minutes, then a native speaker checks it. Error messages people read in a hurry have to be right.' },
      { id: 'g12', label: task('notes'), lane: role('notes'), visual: 'notes', note: 'Decisions and owners from a transcript, checked by everyone who was there.' },
    ],
  },
  gap: {
    id: 'gap', from: 16, at: 20.6,
    prompt: 'Five chatbot shop owners all want automatic posting. What should Meera do?',
    options: [{ id: 'a', label: 'Design for automatic posting' }, { id: 'b', label: 'Treat it as a question to ask, and go and watch real shop owners' }, { id: 'c', label: 'Run fifty more chatbot interviews' }],
    correct: 'b', explanation: 'A simulation can suggest what to ask. Only real people tell you what they do.',
  },
  takeaways: [
    { title: 'Delegate what you can check', body: 'Transcripts, themes, dummy data, prototypes. Then check numbers, names and quotes.' },
    { title: 'Assist what you decide', body: 'Let AI widen the options or argue back. The call stays yours.' },
    { title: 'Never fake the evidence', body: 'Simulated users and tidied quotes aren’t research.' },
    { title: 'Mind the data', body: 'Customers’ personal data only goes into approved tools.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'AI is most useful for work you can…', options: [{ id: 'a', label: 'Check faster than you could do it' }, { id: 'b', label: 'Never look at again' }], correct: 'a', explanation: 'Checking is what makes delegating safe.' },
      { id: 'q2', prompt: 'A chatbot role-playing your users is…', options: [{ id: 'a', label: 'Cheaper research' }, { id: 'b', label: 'A way to draft questions, not a replacement for real people' }, { id: 'c', label: 'Better than interviews' }], correct: 'b', explanation: 'It can’t tell you what people actually do.' },
      { id: 'q3', prompt: 'Before pasting support tickets into an AI tool, check…', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'Whether it’s free' }, { id: 'c', label: 'That the tool is approved for customer data, or strip the personal data first' }], correct: 'c', explanation: 'Customers trusted you with that data, not every tool you use.' },
      { id: 'q4', prompt: 'AI drafts 20 layouts. Your job is to…', options: [{ id: 'a', label: 'Ship the first one' }, { id: 'b', label: 'Ask for 20 more' }, { id: 'c', label: 'Ship them all as an A/B test' }, { id: 'd', label: 'Choose, combine and own the direction' }], correct: 'd', explanation: 'Options are cheap now. Judgment isn’t.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'An AI summary of 600 reviews says “users want dark mode” is the top theme. What do you check?', hint: 'Themes are claims.', options: [{ id: 'a', label: 'Nothing, it’s data' }, { id: 'b', label: 'Read a sample of the reviews in that theme and count them yourself' }, { id: 'c', label: 'Ask it again' }, { id: 'd', label: 'Check the colours' }], correct: 'b', explanation: 'A summary can merge, miss or inflate. A sample tells you which.' },
    { id: 'l2', prompt: 'A participant’s quote is long and rambling. What can go in the readout?', hint: 'Whose words?', options: [{ id: 'a', label: 'An AI rewrite that sounds better' }, { id: 'b', label: 'Their words, trimmed with “…” where you cut, translated faithfully' }, { id: 'c', label: 'Your paraphrase in quote marks' }, { id: 'd', label: 'Nothing' }], correct: 'b', explanation: 'In quote marks means they said it.' },
    { id: 'l3', prompt: 'Your company hasn’t approved any AI tool for customer data. What do you do with the support export?', hint: 'The data, not the tool.', options: [{ id: 'a', label: 'Use a free tool anyway' }, { id: 'b', label: 'Strip names, numbers and GSTINs first, or ask for an approved tool' }, { id: 'c', label: 'Use a personal account' }, { id: 'd', label: 'Email it to yourself' }], correct: 'b', explanation: 'Remove what identifies people, or use a tool that’s cleared for it.' },
    { id: 'l4', prompt: 'An AI-generated prototype works, but uses components that aren’t in your design system. What now?', hint: 'What is it for?', options: [{ id: 'a', label: 'Ship it as is' }, { id: 'b', label: 'Use it to learn in testing, then build the real thing with the system’s components' }, { id: 'c', label: 'Add its components to the system' }, { id: 'd', label: 'Throw it away untested' }], correct: 'b', explanation: 'Prototypes answer questions. Production code follows the system.' },
    { id: 'l5', prompt: 'A stakeholder asks why the research took a week when “AI could simulate users in an hour”. Your answer?', hint: 'What would the hour have told you?', options: [{ id: 'a', label: '“You’re right, next time”' }, { id: 'b', label: '“The simulation said owners wanted auto-posting; real ones check every rupee. That finding changed the design.”' }, { id: 'c', label: '“AI is banned”' }, { id: 'd', label: '“Research always takes a week”' }], correct: 'b', explanation: 'Show the decision real research changed. That’s the case for it.' },
  ],
};

export const dc3_2: Episode = {
  lessonId: 'dc.3-2',
  hook: 'Snap a bill read a smudged 16 as 10, and saved it straight to Ramesh’s khata. He went back to typing.',
  scene: {
    id: 'bill-scan', duration: 36,
    beats: [
      { at: 0, title: 'Snap, saved', body: 'The first draft: Ramesh photographs a bill from Shree Ganesh Distributors, and two seconds later it says “Saved to khata”. No review.' },
      { at: 6, title: 'A 16 read as 10', body: 'A smudged quantity of toor dal goes in as 10, and one GSTIN digit is wrong. The lines come to ₹976.50 less than the bill, and his GST credit won’t match the supplier’s filing. He stops using it.' },
      { at: 11, title: 'Show where it read it', body: 'In the redesign, each value sits beside the crop of the bill it came from, so checking one takes a glance, not a hunt.' },
      { at: 16, title: 'Flag what it’s unsure of', body: 'What it’s sure of fills plainly. Unsure money and records are highlighted. The smudged quantity is left blank: “What does this say?” The total doesn’t add up, so it’s flagged too.' },
      { at: 21, title: 'His tap, his khata', body: 'Nothing is saved until Ramesh taps Save. Every field can be edited, and a saved entry can be edited or deleted.' },
      { at: 26, title: 'When it can’t read', body: 'A blurry photo: “Couldn’t read this bill. Retake it in better light, or type it in.” Half a bill, or not a bill at all, each get their own message.' },
      { at: 31, title: 'Five fields, not twelve', body: 'Ramesh checks five fields in about 20 seconds. Nothing wrong reaches the khata unseen, and he snaps every bill now.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What was the draft’s real mistake?', options: [{ id: 'a', label: 'The AI misread a number' }, { id: 'b', label: 'It saved a guess to his money records without showing it or asking' }, { id: 'c', label: 'The photo was blurry' }],
      correct: 'b', explanation: 'Misreads will happen. The design decides whether they reach the khata.' },
    { id: 'c2', prompt: 'Why is the total flagged when the AI read it correctly?', options: [{ id: 'a', label: 'Totals are always flagged' }, { id: 'b', label: 'The lines plus GST don’t add up to it, so one of the lines is wrong' }, { id: 'c', label: 'It was the largest number' }],
      correct: 'b', explanation: 'A plain arithmetic check catches what the model’s confidence missed.' },
  ],
  game: {
    id: 'guess-flag', title: 'Flag the AI’s guesses',
    instructions: 'Each card is a field the AI read off the bill, how sure it is, and what a mistake would cost. Fill it in plainly, highlight it for Ramesh to check, or leave it blank and ask. The review screen builds as you go, and the end shows what would reach his khata.',
    lanes: [
      { id: 'auto', label: 'Fill it in', hint: 'Sure enough, or cheap to fix later' },
      { id: 'check', label: 'Highlight to check', hint: 'Unsure money or records, or a check failed' },
      { id: 'ask', label: 'Leave blank and ask', hint: 'It’s a guess' },
    ],
    cards: [
      { id: 'g1', label: field('supplier'), lane: treat('supplier'), visual: 'supplier', note: 'Very sure, and he’d spot a wrong supplier at a glance. Fill it in.' },
      { id: 'g2', label: field('qty2'), lane: treat('qty2'), visual: 'qty2', note: 'Under 60% it’s a guess. A filled-in 10 looks like a fact; a blank beside the crop gets read. It said 16.' },
      { id: 'g3', label: field('gstin'), lane: treat('gstin'), visual: 'gstin', note: 'One wrong character and his GST input credit won’t match the supplier’s filing. At 91% on a record field, he checks it.' },
      { id: 'g4', label: field('item1'), lane: treat('item1'), visual: 'item1', note: 'A product name is a label: wrong costs one tap later, and nothing in the accounts changes. Fill it in.' },
      { id: 'g5', label: field('total'), lane: treat('total'), visual: 'total', note: 'The read is sure, but the lines plus GST come to ₹5,205.90, not ₹6,182.40. A rule caught what confidence couldn’t: one line is wrong.' },
      { id: 'g6', label: field('rate1'), lane: treat('rate1'), visual: 'rate1', note: 'Money, but 97% sure, above the line where reads were right in testing. Fill it; the total check backs it up.' },
      { id: 'g7', label: field('date'), lane: treat('date'), visual: 'date', note: 'Dates decide which GST period the bill falls in. At 88% he checks it, with the crop beside it.' },
      { id: 'g8', label: field('item2'), lane: treat('item2'), visual: 'item2', note: 'Only 84% sure, but it’s a label. Flagging every label would bury the fields that matter.' },
      { id: 'g9', label: field('qty1'), lane: treat('qty1'), visual: 'qty1', note: 'Quantities are money. At 93% it’s close, but under the line: highlight it.' },
      { id: 'g10', label: field('gst'), lane: treat('gst'), visual: 'gst', note: 'Printed clearly, 99% sure. Fill it in.' },
      { id: 'g11', label: field('invoice'), lane: treat('invoice'), visual: 'invoice', note: 'Sure, and a record field above the line. Fill it in.' },
      { id: 'g12', label: field('rate2'), lane: treat('rate2'), visual: 'rate2', note: 'Above the line, and the total check covers it. Fill it in.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.6,
    prompt: 'Ramesh has stopped using Snap a bill. What should Meera change first?',
    options: [{ id: 'a', label: 'Wait for a better model' }, { id: 'b', label: 'Show what it read and where, flag what it’s unsure of, and let him save' }, { id: 'c', label: 'Add a disclaimer: “AI can make mistakes”' }],
    correct: 'b', explanation: 'A better model still misreads. A disclaimer moves the blame. The design is what catches the mistake.',
  },
  takeaways: [
    { title: 'Show the source', body: 'Put each value beside where it came from, so checking takes a glance.' },
    { title: 'Flag where it changes a decision', body: 'Fill what’s sure or cheap to fix, highlight unsure money and records, ask when it’s a guess.' },
    { title: 'Checks that don’t need AI', body: 'If the lines don’t add up to the total, say so.' },
    { title: 'Their tap, and a way back', body: 'Nothing saves without them; everything can be edited or undone. Every failure has a next step.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'An AI feature that touches someone’s money should…', options: [{ id: 'a', label: 'Wait for their confirmation' }, { id: 'b', label: 'Act at once to save time' }], correct: 'a', explanation: 'Their tap, their records.' },
      { id: 'q2', prompt: 'Showing a confidence percentage on every field…', options: [{ id: 'a', label: 'Is the most transparent option' }, { id: 'b', label: 'Makes people read twelve numbers instead of checking the fields that matter' }, { id: 'c', label: 'Is required' }], correct: 'b', explanation: 'Turn confidence into a treatment: fill, highlight or ask.' },
      { id: 'q3', prompt: '“Something went wrong” after a blurry photo is…', options: [{ id: 'a', label: 'Fine' }, { id: 'b', label: 'Honest' }, { id: 'c', label: 'A dead end: say what happened and offer retake or type it in' }], correct: 'c', explanation: 'Every failure needs a way forward.' },
      { id: 'q4', prompt: 'Confidence thresholds should be set from…', options: [{ id: 'a', label: 'A round number that feels right' }, { id: 'b', label: 'The model’s documentation' }, { id: 'c', label: 'Whatever the engineers pick' }, { id: 'd', label: 'How often reads at each confidence were right in testing on real bills' }], correct: 'd', explanation: 'A model’s 90% isn’t always right 90% of the time. Measure it.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why leave a low-confidence field blank instead of filling in the guess?', hint: 'What does a filled field say?', options: [{ id: 'a', label: 'Blank fields look cleaner' }, { id: 'b', label: 'A filled-in value looks like a fact, so people skim past it; a blank gets read' }, { id: 'c', label: 'It’s faster' }, { id: 'd', label: 'The model can’t output low-confidence values' }], correct: 'b', explanation: 'People anchor on whatever is already there.' },
    { id: 'l2', prompt: 'Why not flag every field the AI read?', hint: 'What happens to attention?', options: [{ id: 'a', label: 'It’s too expensive' }, { id: 'b', label: 'If everything is flagged, people stop reading flags, and the real mistakes slip through' }, { id: 'c', label: 'It isn’t allowed' }, { id: 'd', label: 'There’s no reason not to' }], correct: 'b', explanation: 'Flags work when they’re rare and mean something.' },
    { id: 'l3', prompt: 'Ramesh corrects a misread. What should the app do with that?', hint: 'His data.', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'Use it to improve reads quietly' }, { id: 'c', label: 'Save his correction, and only use it to improve the model if he’s agreed to that' }, { id: 'd', label: 'Email the supplier' }], correct: 'c', explanation: 'Corrections are valuable, and they’re his data. Ask first.' },
    { id: 'l4', prompt: 'Should the review screen say the values were read by AI?', hint: 'What does he need to know?', options: [{ id: 'a', label: 'No, it worries people' }, { id: 'b', label: 'Yes, plainly, with what to check: “Read from your photo. Check the highlighted fields.”' }, { id: 'c', label: 'Only in the terms' }, { id: 'd', label: 'Show the model’s name' }], correct: 'b', explanation: 'Say what happened and what to do about it, not which model did it.' },
    { id: 'l5', prompt: 'Accuracy goes up a lot after a model update. What does Meera do with the thresholds?', hint: 'Measure, then move.', options: [{ id: 'a', label: 'Remove all flags' }, { id: 'b', label: 'Leave them forever' }, { id: 'c', label: 'Lower them by feel' }, { id: 'd', label: 'Re-test on the same real bills, and move them only as far as the new results justify' }], correct: 'd', explanation: 'Thresholds are design decisions backed by data. New model, new measurement.' },
  ],
};

export const dc3_3: Episode = {
  lessonId: 'dc.3-3',
  hook: 'Ask Hisaab’s whole prompt was one line. It told a shop owner a customer who didn’t exist owed him ₹1,500.',
  scene: {
    id: 'prompt-evals', duration: 36,
    beats: [
      { at: 0, title: 'One line', body: 'Ask Hisaab answers shop owners’ questions about their khata. Its instructions: “You are a helpful assistant for Hisaab.”' },
      { at: 6, title: 'Ten real questions', body: 'Meera collects ten questions shop owners actually asked, with what a good answer looks like. The one-line prompt fails all ten.' },
      { at: 11, title: 'Give it the facts', body: 'The khata goes in with every question: customers, balances, last payments. “Answer from it.” Sharma ji’s balance comes back right.' },
      { at: 16, title: 'Limits and shape', body: 'Never guess an amount. Tax decisions go to their CA. Lead with the number, two lines, in the language they asked in, warm in reminders.' },
      { at: 21, title: 'Seven of ten', body: 'Rerun: seven pass. Last month’s total is still wrong, a staff login still sees the bank balance, and a bill’s note still gives orders.' },
      { at: 26, title: 'Fix it in code', body: 'Totals are added up in code and passed in. Access is checked before anything reaches the model. Bill text is data, and only Ramesh’s tap changes anything.' },
      { at: 31, title: 'Ten of ten, and again', body: 'The prompt and its test set are versioned together. Every change, and every model update, reruns all ten before it ships.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why collect real questions before rewriting the prompt?', options: [{ id: 'a', label: 'To make it longer' }, { id: 'b', label: 'So every change is judged against the same test, not a feeling' }, { id: 'c', label: 'For the legal team' }],
      correct: 'b', explanation: 'Without a test set, a fix for one answer can quietly break another.' },
    { id: 'c2', prompt: 'Why not add “never show the bank balance to staff” to the prompt?', options: [{ id: 'a', label: 'It’s too long' }, { id: 'b', label: 'A prompt can be talked around; access has to be enforced in code before the data reaches the model' }, { id: 'c', label: 'Staff can’t use the assistant' }],
      correct: 'b', explanation: 'If the model never gets the data, it can’t leak it.' },
  ],
  game: {
    id: 'eval-fix', title: 'Fix the failing answers',
    instructions: 'Each card is a test question and what the one-line prompt replied. Decide where the fix goes: give the model the facts, set a limit, shape the reply, or fix it in code. The prompt and the test results update as you go.',
    lanes: [
      { id: 'context', label: 'Give it the facts', hint: 'Data it needs to answer' },
      { id: 'rules', label: 'Set a limit', hint: 'What it must never say or claim' },
      { id: 'format', label: 'Shape the reply', hint: 'Length, language, tone' },
      { id: 'code', label: 'Fix it in code', hint: 'What a prompt can’t guarantee' },
    ],
    cards: [
      { id: 'g1', label: asked('owe'), lane: fix('owe'), visual: 'owe', note: 'The model has never seen his khata. Pass the shop’s data in with the question and tell it to answer from that.' },
      { id: 'g2', label: asked('unknown'), lane: fix('unknown'), visual: 'unknown', note: 'There is no Verma. Models fill gaps with plausible answers unless told what to do when the answer isn’t there.' },
      { id: 'g3', label: asked('month'), lane: fix('month'), visual: 'month', note: 'Adding up 412 entries is a job for code, which gets it right every time. The model reports the number it’s given.' },
      { id: 'g4', label: asked('essay'), lane: fix('essay'), visual: 'essay', note: 'He asked for one number with a customer at the counter. Lead with it, two lines at most.' },
      { id: 'g5', label: asked('staff'), lane: fix('staff'), visual: 'staff', note: 'A prompt rule can be argued around. If a staff login never sends the owner’s data to the model, there’s nothing to leak.' },
      { id: 'g6', label: asked('tax'), lane: fix('tax'), visual: 'tax', note: 'Whether to file quarterly depends on his turnover and cash flow. Explain the options; the decision is for him and his CA.' },
      { id: 'g7', label: asked('lang'), lane: fix('lang'), visual: 'lang', note: 'He asked in Hindi, in Devanagari. Reply the way he asked.' },
      { id: 'g8', label: asked('inject'), lane: fix('inject'), visual: 'inject', note: 'Text inside a document is data, not orders, and no prompt line fully prevents injection. Actions on money wait for Ramesh’s tap.' },
      { id: 'g9', label: asked('most'), lane: fix('most'), visual: 'most', note: 'It only had today’s entries, so it answered from those. Pass every open balance.' },
      { id: 'g10', label: asked('tone'), lane: fix('tone'), visual: 'tone', note: 'Sharma ji has bought here for ten years. Warm, respectful, the amount and the date: “Namaste Sharma ji, ₹2,400 is pending since 2 November.”' },
    ],
  },
  gap: {
    id: 'gap', from: 21, at: 25.6,
    prompt: 'Three test questions still fail after the prompt rewrite. What should Meera do?',
    options: [{ id: 'a', label: 'Add “IMPORTANT: never do this” in capitals' }, { id: 'b', label: 'Work with engineering to fix sums, access and document text in code' }, { id: 'c', label: 'Remove them from the test set' }],
    correct: 'b', explanation: 'Some guarantees only code can give. The prompt isn’t a security boundary or a calculator.',
  },
  takeaways: [
    { title: 'The prompt is design', body: 'Write it with engineering, like interface copy, for a real person on a phone.' },
    { title: 'Facts, limits, shape', body: 'Give it the data, say what it must never claim, and set length, language and tone.' },
    { title: 'Some things belong in code', body: 'Sums, permissions, and text from documents treated as data.' },
    { title: 'Test it like a design', body: 'Real questions, pass or fail, rerun after every change and every model update.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'The assistant invents a balance for an unknown customer. Fix it with…', options: [{ id: 'a', label: 'A rule: if it isn’t in the khata, say so and never guess' }, { id: 'b', label: '“Be accurate”' }], correct: 'a', explanation: 'Specific instructions change behaviour; adjectives don’t.' },
      { id: 'q2', prompt: 'Who should see the owner’s data is enforced…', options: [{ id: 'a', label: 'In the prompt' }, { id: 'b', label: 'In code, before the data reaches the model' }, { id: 'c', label: 'By trusting staff' }], correct: 'b', explanation: 'What the model never gets, it can’t reveal.' },
      { id: 'q3', prompt: 'You change one line of the prompt. Next you…', options: [{ id: 'a', label: 'Ship it' }, { id: 'b', label: 'Test the question you were fixing' }, { id: 'c', label: 'Rerun the whole test set' }], correct: 'c', explanation: 'Fixes in one place can break answers elsewhere.' },
      { id: 'q4', prompt: 'The model behind the feature gets updated. You…', options: [{ id: 'a', label: 'Assume it’s better' }, { id: 'b', label: 'Rewrite the prompt from scratch' }, { id: 'c', label: 'Turn the feature off' }, { id: 'd', label: 'Rerun the test set before the update reaches users' }], correct: 'd', explanation: 'A new model can answer differently to the same prompt.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What makes a test question useful in a prompt’s test set?', hint: 'What can you mark?', options: [{ id: 'a', label: 'It’s hard' }, { id: 'b', label: 'It’s real, and comes with what a good answer must and mustn’t contain' }, { id: 'c', label: 'It’s in English' }, { id: 'd', label: 'It’s long' }], correct: 'b', explanation: 'Real questions with a clear pass or fail.' },
    { id: 'l2', prompt: 'The prompt says “two lines at most”, but the answer card in the app needs a name, an amount and a button. What helps most?', hint: 'The app reads it, not just a person.', options: [{ id: 'a', label: 'Ask the model nicely' }, { id: 'b', label: 'Ask for structured output with those fields, and let the app lay out the card' }, { id: 'c', label: 'Parse the sentence with a regex' }, { id: 'd', label: 'Show the raw reply' }], correct: 'b', explanation: 'Structured output gives the design fields to lay out, not prose to squeeze.' },
    { id: 'l3', prompt: 'Should a designer read real conversations with the assistant after launch?', hint: 'Where do new test questions come from?', options: [{ id: 'a', label: 'No, that’s engineering’s job' }, { id: 'b', label: 'Yes, a sample, privacy-safe, to find failures and add them to the test set' }, { id: 'c', label: 'Only complaints' }, { id: 'd', label: 'All of them, with names' }], correct: 'b', explanation: 'Launch is when the real test set starts growing.' },
    { id: 'l4', prompt: 'A shop owner asks Ask Hisaab to send a payment reminder. What should happen?', hint: 'Who acts?', options: [{ id: 'a', label: 'It sends it and says “Done”' }, { id: 'b', label: 'It says it sent it, without sending' }, { id: 'c', label: 'It drafts the message and shows a Send button he taps' }, { id: 'd', label: 'It refuses' }], correct: 'c', explanation: 'The assistant proposes; the person confirms anything that reaches a customer.' },
    { id: 'l5', prompt: 'Why version the prompt together with its test set?', hint: 'Later, someone asks why it changed.', options: [{ id: 'a', label: 'Git requires it' }, { id: 'b', label: 'So any change can be traced, reviewed and rolled back, with results showing what it fixed or broke' }, { id: 'c', label: 'It saves money' }, { id: 'd', label: 'It doesn’t matter' }], correct: 'b', explanation: 'A prompt is product behaviour. Treat it like code.' },
  ],
};
