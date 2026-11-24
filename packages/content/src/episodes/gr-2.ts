// Episodes for chapter gr.2 · Onboarding & activation. Drafts by Claude, for review.
// Kaksha is a Chennai app for home tutors: batches, attendance, homework and fee reminders, with parents kept up to date
// on WhatsApp. Siddharth is its product manager and Nisha Varghese its product designer. Meenakshi Iyer teaches maths
// to Class 9 and 10 from her flat in Anna Nagar. gr.1 found the aha moment and cleared the path to it; this chapter is
// about the first weeks after that: teaching in context, empty screens that start the work, and asking for money well.
import { EMPTY_PIECES, KAKSHA_TIPS, PRO_MOMENTS, type EmptyPieceId, type Episode, type KakshaTip, type ProMomentId } from '../episode';

const tip = (k: KakshaTip) => KAKSHA_TIPS[k].text;
const piece = (k: EmptyPieceId) => EMPTY_PIECES[k].text;
const moment = (k: ProMomentId) => PRO_MOMENTS[k].text;

export const gr2_1: Episode = {
  lessonId: 'gr.2-1',
  hook: 'Kaksha’s welcome tour taught fourteen features in ninety seconds. A month later, tutors were still asking how to send a fee reminder.',
  scene: {
    id: 'just-in-time', duration: 36,
    beats: [
      { at: 0, title: 'Fourteen features, one swipe', body: 'Meenakshi installs Kaksha between two classes. Seven tour screens: batches, attendance, homework, fees, reports, reschedules, parents. She swipes through all seven in twelve seconds.' },
      { at: 6, title: 'Then nothing', body: 'The home screen is empty. On the 1st, with fees due, she can’t find reminders and writes to twenty-two parents one by one on WhatsApp.' },
      { at: 11, title: 'Map the first month', body: 'Nisha draws Meenakshi’s first month as a flow: first open, first batch, first class, fees due. Every tip has to wait for the moment it’s useful.' },
      { at: 17, title: 'One step at first open', body: 'The tour goes. First open asks for one thing, a batch, with students picked from her contacts.' },
      { at: 22, title: 'Tips that wait their turn', body: 'Marking attendance appears once the batch has students. Homework appears after the first class. Fee reminders arrive on the 1st, on the Fees screen.' },
      { at: 28, title: 'A short checklist', body: 'Three items: create a batch, add students, mark your first class. Each one is a step towards the aha: parents getting their first update.' },
      { at: 32, title: 'Teach in place', body: 'Tutors finishing setup on day one: 38% to 61%. Fee reminders sent in the first month: up four times.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the tour fail?', options: [{ id: 'a', label: 'It had too few screens' }, { id: 'b', label: 'It taught everything before she could use any of it, so nothing stuck' }, { id: 'c', label: 'Tutors don’t like pictures' }],
      correct: 'b', explanation: 'A lesson with no task attached is forgotten. The fee tip was useless on day one and missing on the 1st.' },
    { id: 'c2', prompt: 'What sets off each tip in the new Kaksha?', options: [{ id: 'a', label: 'A timer: one tip a day' }, { id: 'b', label: 'What she has done, or a date in her world, like fees falling due' }, { id: 'c', label: 'A random pick' }],
      correct: 'b', explanation: 'Triggers come from her progress, so each tip lands when it’s useful.' },
  ],
  game: {
    id: 'cue-timeline', title: 'Time the tips',
    instructions: 'Each card is a piece of Kaksha’s onboarding. Drop it on the moment in Meenakshi’s first month when she can first use it: not before, and not after she already needed it.',
    lanes: [
      { id: 'open', label: 'First open', hint: 'Nothing made yet' },
      { id: 'batch', label: 'First batch made', hint: '8 students, no classes yet' },
      { id: 'class', label: 'First class taken', hint: 'One class marked' },
      { id: 'fees', label: 'Fees due, 1st of the month', hint: '22 students, 12 classes, fees due' },
    ],
    cards: [
      { id: 'g1', label: tip('batch'), lane: 'open', visual: 'batch', note: 'Nothing else works until a batch exists, so it’s the one thing first open asks for.' },
      { id: 'g2', label: tip('remind'), lane: 'fees', visual: 'remind', note: 'On day one there’s nothing to remind anyone about. On the 1st it’s the most useful thing in the app, so the tip lives on the Fees screen that day.' },
      { id: 'g3', label: tip('attendance'), lane: 'batch', visual: 'attendance', note: 'Once there are names in the batch, marking them is the next step, and it’s what sends parents their first update.' },
      { id: 'g4', label: tip('homework'), lane: 'class', visual: 'homework', note: 'Right after the first class, when she has tonight’s sums in her head.' },
      { id: 'g5', label: tip('students'), lane: 'open', visual: 'students', note: 'Part of making the batch: picking parents from contacts takes four taps instead of a long form.' },
      { id: 'g6', label: tip('report'), lane: 'fees', visual: 'report', note: 'A report needs a few weeks of classes behind it. After one class it would be a single tick.' },
      { id: 'g7', label: tip('parents'), lane: 'batch', visual: 'parents', note: 'It only means something once there are parents to tell. Ask now, before the first message goes out.' },
      { id: 'g8', label: tip('reschedule'), lane: 'class', visual: 'reschedule', note: 'Once a class exists, it can move. Show it the first time she opens a class’s menu.' },
    ],
  },
  gap: {
    id: 'gap', from: 17, at: 21.6,
    prompt: 'Her batch now has eight students. Which tip should Kaksha show next?',
    options: [{ id: 'a', label: 'How to send fee reminders' }, { id: 'b', label: 'Tap a name to mark them present; parents get a message' }, { id: 'c', label: 'All fourteen features again' }],
    correct: 'b', explanation: 'Marking attendance is the next thing she’ll do, and it leads straight to the aha: parents getting their first update.',
  },
  takeaways: [
    { title: 'Drop the up-front tour', body: 'Teaching before people can use it is teaching nobody.' },
    { title: 'Trigger on progress', body: 'Each tip waits for what the person has done, or for a date that matters to them.' },
    { title: 'Teach in place', body: 'Show the tip on the screen where the action happens, and let people dismiss it.' },
    { title: 'Checklists lead to the aha', body: 'Three or four steps they’d take anyway, each one closer to the value.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'Progressive onboarding teaches a feature…', options: [{ id: 'a', label: 'When it first becomes useful' }, { id: 'b', label: 'All on day one' }], correct: 'a', explanation: 'Just in time, not just in case.' },
      { id: 'q2', prompt: 'A good onboarding checklist item is…', options: [{ id: 'a', label: 'Rate us on the Play Store' }, { id: 'b', label: 'A step towards the aha moment' }, { id: 'c', label: 'Read our terms' }], correct: 'b', explanation: 'Each item should move people closer to the value.' },
      { id: 'q3', prompt: 'The fee-reminder tip belongs…', options: [{ id: 'a', label: 'In the welcome tour' }, { id: 'b', label: 'In an email on day two' }, { id: 'c', label: 'On the Fees screen when fees fall due' }], correct: 'c', explanation: 'In place, at the moment of need.' },
      { id: 'q4', prompt: 'Duolingo lets you finish a first lesson before making a profile. That’s…', options: [{ id: 'a', label: 'A bug' }, { id: 'b', label: 'Gradual engagement: value first, sign-up after' }, { id: 'c', label: 'A dark pattern' }, { id: 'd', label: 'A free trial' }], correct: 'b', explanation: 'Luke Wroblewski’s name for letting people use the product before asking them to commit.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why is a time-based drip (“day 3: tip about reports”) weaker than a progress trigger?', hint: 'Not everyone moves at the same speed.', options: [{ id: 'a', label: 'Emails are old-fashioned' }, { id: 'b', label: 'A tutor who hasn’t taken a class by day 3 can’t use a report tip, and one who took six already needed it' }, { id: 'c', label: 'Day 3 is a weekend' }, { id: 'd', label: 'It costs more' }], correct: 'b', explanation: 'Triggers on what people did fit every speed; the calendar fits almost nobody.' },
    { id: 'l2', prompt: 'A checklist starts at “1 of 4 done” because making the account counts as a step. What effect is this using?', hint: 'A car wash loyalty card with two free stamps.', options: [{ id: 'a', label: 'Endowed progress: people finish more when they start part-way' }, { id: 'b', label: 'Hick’s law' }, { id: 'c', label: 'Social proof' }, { id: 'd', label: 'Loss aversion' }], correct: 'a', explanation: 'Nunes and Drèze (2006): an 8-stamp card with 2 given free got finished far more often than a plain 8-stamp card. It must be a real step, though, not a fake tick.' },
    { id: 'l3', prompt: 'Meenakshi dismisses the homework tip. What should Kaksha do?', hint: 'Who decides?', options: [{ id: 'a', label: 'Show it again every day' }, { id: 'b', label: 'Respect it, and keep the feature easy to find from the class screen' }, { id: 'c', label: 'Lock homework until she reads it' }, { id: 'd', label: 'Email her about it' }], correct: 'b', explanation: 'A dismissed tip is an answer. Nagging turns help into noise.' },
    { id: 'l4', prompt: 'How do you know the new onboarding works?', hint: 'gr.1 and st.3.', options: [{ id: 'a', label: 'Count how many tips were shown' }, { id: 'b', label: 'Compare the share of new tutors who reach the aha (a first class marked, parents told) in week one, cohort against cohort' }, { id: 'c', label: 'Ask the team if they like it' }, { id: 'd', label: 'Total downloads' }], correct: 'b', explanation: 'Activation rate by weekly cohort shows whether more people reach the value, and how fast.' },
    { id: 'l5', prompt: 'Which tip should stay out of onboarding altogether?', hint: 'Who is it for?', options: [{ id: 'a', label: 'How to mark attendance' }, { id: 'b', label: 'How to move a class' }, { id: 'c', label: '“Kaksha now has a dark mode!” shown to a tutor in her first week' }, { id: 'd', label: 'How to send homework' }], correct: 'c', explanation: 'Announcements about the product help nobody reach the value. Save them for people who have settled in.' },
  ],
};

export const gr2_2: Episode = {
  lessonId: 'gr.2-2',
  hook: 'Nearly half of new tutors opened Kaksha, saw “No batches found.” and never made one.',
  scene: {
    id: 'empty-activate', duration: 36,
    beats: [
      { at: 0, title: '“No batches found.”', body: 'Meenakshi opens Batches for the first time. Grey text in the middle of a white screen. Siddharth’s funnel: 46% of new tutors never create a batch.' },
      { at: 6, title: 'The first screen is the first step', body: 'Nisha stops calling it an empty state. It’s the start of the job, so it should get her a batch with students in it, fast.' },
      { at: 11, title: 'Say what goes here', body: 'One line: your batches live here; make one for each group you teach, and Kaksha keeps attendance and tells parents.' },
      { at: 16, title: 'Make the first step cheap', body: 'Her students’ parents are already in her phone. Picking them from contacts: four taps. The old 11-field form: an evening.' },
      { at: 21, title: 'One button', body: 'Create a batch. No “Add student”, “Set fees” and “Watch tutorial” competing beside it.' },
      { at: 26, title: 'Show what it will look like', body: 'A faded example card: Class 10 Maths, Mon Wed Fri, 5 pm, 8 students, marked Example. No tiles of zeros.' },
      { at: 31, title: 'A batch in five taps', body: 'Tutors who create a first batch on day one: 54% to 81%. The Fees tab, still empty, now says what will appear on the 1st.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What changed in how Nisha thought about the empty screen?', options: [{ id: 'a', label: 'She made it prettier' }, { id: 'b', label: 'She treated it as the first step of the task, not a gap waiting for data' }, { id: 'c', label: 'She hid it' }],
      correct: 'b', explanation: 'For a new user nearly every screen is empty. That’s where activation happens.' },
    { id: 'c2', prompt: 'Why import students from contacts?', options: [{ id: 'a', label: 'It collects more data' }, { id: 'b', label: 'The parents are already in her phone, so the first batch takes taps, not typing' }, { id: 'c', label: 'Contacts are required by law' }],
      correct: 'b', explanation: 'Start from what people already have.' },
  ],
  game: {
    id: 'empty-build', title: 'Build the empty Batches screen',
    instructions: 'Build the screen Meenakshi sees before she has any batches. For each part, pick the piece that gets her to a first batch with students in it. Watch the taps add up.',
    lanes: [
      { id: 'message', label: 'Message', hint: 'What goes here, and what to do' },
      { id: 'starter', label: 'First content', hint: 'How the screen gets its first batch' },
      { id: 'action', label: 'Action', hint: 'The button that starts it' },
      { id: 'preview', label: 'Until then', hint: 'What fills the space while it’s empty' },
    ],
    cards: [
      { id: 'g1', label: piece('msgVague'), lane: 'message', visual: 'msgVague', note: 'It says nothing about what a batch is or how to make one. Half of new tutors thought the app was broken.' },
      { id: 'g2', label: piece('msgGood'), lane: 'message', visual: 'msgGood', note: 'What goes here, why it’s worth doing, in her words: groups she teaches, attendance, parents.' },
      { id: 'g3', label: piece('msgHype'), lane: 'message', visual: 'msgHype', note: 'It talks about Kaksha, not about her batches. A welcome line can’t tell her what to do next.' },
      { id: 'g4', label: piece('fillForm'), lane: 'starter', visual: 'fillForm', note: 'Eleven fields for each of eight students is an evening of typing. Ask for a name and a parent’s number now, the rest later.' },
      { id: 'g5', label: piece('fillContacts'), lane: 'starter', visual: 'fillContacts', note: 'The parents are already in her phone. Four taps, and the batch has students.' },
      { id: 'g6', label: piece('fillFake'), lane: 'starter', visual: 'fillFake', note: 'Sample content can help, but unmarked fake students would get real WhatsApp messages. Samples must say they’re samples, and be easy to clear.' },
      { id: 'g7', label: piece('actMany'), lane: 'action', visual: 'actMany', note: 'Four equal buttons make her choose before she knows the app. Only one of them gets her to a batch.' },
      { id: 'g8', label: piece('actNone'), lane: 'action', visual: 'actNone', note: 'A screen that sends her to the menu is a dead end. The action belongs where she’s looking.' },
      { id: 'g9', label: piece('actOne'), lane: 'action', visual: 'actOne', note: 'One clear next step, in the middle of the screen she’s already on.' },
      { id: 'g10', label: piece('showZeros'), lane: 'preview', visual: 'showZeros', note: 'A wall of zeros looks like failure on day one. Show a dashboard once there’s something in it.' },
      { id: 'g11', label: piece('showExample'), lane: 'preview', visual: 'showExample', note: 'She sees what a batch looks like before making one, and the label keeps it honest.' },
      { id: 'g12', label: piece('showArt'), lane: 'preview', visual: 'showArt', note: 'An illustration is fine if it’s small. One that pushes the button off the screen costs more than it gives.' },
    ],
  },
  gap: {
    id: 'gap', from: 11, at: 15.6,
    prompt: 'How should Meenakshi add her first eight students?',
    options: [{ id: 'a', label: 'An 11-field form for each student' }, { id: 'b', label: 'Pick their parents from her phone contacts' }, { id: 'c', label: 'Email a spreadsheet to support' }],
    correct: 'b', explanation: 'Start from what she already has. Four taps beats an evening of typing.',
  },
  takeaways: [
    { title: 'Empty is the first step', body: 'For new users nearly every screen is empty. Design it as the start of the task.' },
    { title: 'Make the first step cheap', body: 'Import, templates or clearly marked samples, instead of a long form.' },
    { title: 'One action', body: 'Say what goes here, and give one button that starts it.' },
    { title: 'Show, don’t zero', body: 'A faded, labelled example beats a dashboard of zeros.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'Sample content in an empty state must be…', options: [{ id: 'a', label: 'Clearly marked and easy to clear' }, { id: 'b', label: 'Hidden among real data' }], correct: 'a', explanation: 'Otherwise people can’t tell what’s real.' },
      { id: 'q2', prompt: 'On day one, a dashboard of 0s…', options: [{ id: 'a', label: 'Motivates people' }, { id: 'b', label: 'Looks like failure and teaches nothing' }, { id: 'c', label: 'Is required' }], correct: 'b', explanation: 'Wait until there’s something to show.' },
      { id: 'q3', prompt: 'Canva and Notion open new users to…', options: [{ id: 'a', label: 'A blank page only' }, { id: 'b', label: 'A pricing page' }, { id: 'c', label: 'Templates to start from' }, { id: 'd', label: 'A survey' }], correct: 'c', explanation: 'Templates make the first step a choice, not a blank page.' },
      { id: 'q4', prompt: 'A screen that can’t be filled yet (no fees due) should…', options: [{ id: 'a', label: 'Say what will appear and when, and offer what she can do now' }, { id: 'b', label: 'Be hidden' }, { id: 'c', label: 'Show an error' }], correct: 'a', explanation: 'Set the expectation, then give a useful step.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'cw.1 taught “what, why, what next” for empty-state copy. What does this lesson add?', hint: 'Beyond the words.', options: [{ id: 'a', label: 'Nothing new' }, { id: 'b', label: 'Making the first step cheap: import, templates or samples, and judging it by taps to first value' }, { id: 'c', label: 'Bigger illustrations' }, { id: 'd', label: 'Longer copy' }], correct: 'b', explanation: 'The words point the way; the starter content shortens it.' },
    { id: 'l2', prompt: 'Asking for contacts access before she knows why will often get a “Deny”. What helps?', hint: 'Ask in context.', options: [{ id: 'a', label: 'Ask on first open, before anything else' }, { id: 'b', label: 'Ask when she taps “Pick from contacts”, saying it’s only to find her students’ parents' }, { id: 'c', label: 'Ask three times' }, { id: 'd', label: 'Don’t say why' }], correct: 'b', explanation: 'A permission asked at the moment it’s needed, with the reason, makes sense to people.' },
    { id: 'l3', prompt: 'When is an empty state with a template better than one with an import?', hint: 'What does she already have?', options: [{ id: 'a', label: 'Never' }, { id: 'b', label: 'When there’s nothing to import, like a tutor starting her first ever batch with no students yet' }, { id: 'c', label: 'Always' }, { id: 'd', label: 'Only on desktop' }], correct: 'b', explanation: 'Import when people bring data; template when they start from scratch.' },
    { id: 'l4', prompt: 'Which metric shows the new empty state works?', hint: 'st.3.', options: [{ id: 'a', label: 'Time spent on the empty screen' }, { id: 'b', label: 'Share of new tutors who create a batch with students on day one, and the median time it takes' }, { id: 'c', label: 'Total batches ever created' }, { id: 'd', label: 'Taps on the illustration' }], correct: 'b', explanation: 'A rate and a time, compared by weekly cohort.' },
    { id: 'l5', prompt: 'A tutor clears her batches at the end of the school year. Should she see the first-use empty state again?', hint: 'cw.1’s kinds of empty.', options: [{ id: 'a', label: 'Yes, the same one' }, { id: 'b', label: 'No: she knows the app, so it can celebrate the year and offer to copy last year’s batches' }, { id: 'c', label: 'Hide the screen' }, { id: 'd', label: 'Show the welcome tour' }], correct: 'b', explanation: 'A returning user’s empty is different from a new user’s; start from what she had.' },
  ],
};

export const gr2_3: Episode = {
  lessonId: 'gr.2-3',
  hook: 'Kaksha Pro asked for ₹499 before tutors had made a batch, and blocked a fee receipt with a parent waiting at the door. Reviews called it greedy.',
  scene: {
    id: 'upgrade-moment', duration: 36,
    beats: [
      { at: 0, title: 'Pro on day one', body: 'Kaksha Pro launches at ₹499 a year. A full-screen paywall appears on first open, before Meenakshi has made a batch. She closes it.' },
      { at: 6, title: 'Blocked at the door', body: 'A parent waits for a fee receipt. She taps “Add my logo”, and a paywall covers the receipt. She loses the draft. Upgrades: 0.9%.' },
      { at: 11, title: 'Map the moments', body: 'Nisha marks Meenakshi’s months: when she has had value, when she reaches for something only Pro does, and when she is mid-task.' },
      { at: 16, title: 'Value meets a limit', body: 'After a month of classes she tries to add a 26th student. That’s the moment: she knows what Kaksha does and asks for more of it.' },
      { at: 21, title: 'Finish first', body: 'The receipt goes out without the logo. Then: “Want your logo on every receipt? That’s in Pro.”' },
      { at: 26, title: 'Her numbers, the full price', body: 'The Pro screen shows ₹33,000 collected with reminders this month, ₹499 a year, about ₹42 a month, and a plain “Not now”.' },
      { at: 31, title: 'Fewer asks, more yeses', body: 'Tutors who see Pro see it once or twice, at a limit. 5.2% of them upgrade, and the one-star reviews about money stop.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What was wrong with the day-one paywall?', options: [{ id: 'a', label: 'The price was too low' }, { id: 'b', label: 'She hadn’t had any value yet, so she didn’t know what she’d be paying for' }, { id: 'c', label: 'It had no images' }],
      correct: 'b', explanation: 'An offer only makes sense after the product has shown what it does.' },
    { id: 'c2', prompt: 'What did the new Pro screen show?', options: [{ id: 'a', label: 'A countdown timer' }, { id: 'b', label: 'Her own result, the full yearly price with the monthly figure, and a plain “Not now”' }, { id: 'c', label: 'Every feature in a long table' }],
      correct: 'b', explanation: 'Her numbers remind her of the value; an honest price and an easy no keep her trust.' },
  ],
  game: {
    id: 'paywall-timing', title: 'When do you sell?',
    instructions: 'Each card is a moment in Meenakshi’s first months with Kaksha. Decide what Kaksha does about Pro: offer it now, let her finish then offer, mention it quietly, or not sell at all.',
    lanes: [
      { id: 'offer', label: 'Offer Pro now', hint: 'She has had value and just reached for something Pro does' },
      { id: 'finish', label: 'Let her finish, then offer', hint: 'She reached for Pro in the middle of a task' },
      { id: 'hint', label: 'A quiet mention', hint: 'Close to a limit, or right after a win' },
      { id: 'quiet', label: 'Don’t sell here', hint: 'No value yet, something failed, or she’s busy' },
    ],
    cards: [
      { id: 'g1', label: moment('firstOpen'), lane: 'quiet', visual: 'firstOpen', note: 'She doesn’t know what Kaksha does yet, so there’s nothing to upgrade. Get her to a first class instead.' },
      { id: 'g2', label: moment('overLimit'), lane: 'offer', visual: 'overLimit', note: 'The textbook moment: a month of value, and she’s asking for more of it. She’s at home, with time to decide.' },
      { id: 'g3', label: moment('receiptLogo'), lane: 'finish', visual: 'receiptLogo', note: 'Blocking now costs her the receipt and the parent’s patience. Send it plain, then offer the logo.' },
      { id: 'g4', label: moment('nearLimit'), lane: 'hint', visual: 'nearLimit', note: '“2 free places left” on the batch screen. No pop-up, no block, just no surprise later.' },
      { id: 'g5', label: moment('failedSend'), lane: 'quiet', visual: 'failedSend', note: 'Right after something went wrong is the worst time to ask for money. Help her fix the number.' },
      { id: 'g6', label: moment('monthWin'), lane: 'hint', visual: 'monthWin', note: 'A win is a good time to mention what Pro adds, in one line under the summary. Not a wall.' },
      { id: 'g7', label: moment('marking'), lane: 'quiet', visual: 'marking', note: 'She hasn’t reached for anything Pro does, and the class is waiting. Stay out of the way.' },
      { id: 'g8', label: moment('reportCard'), lane: 'offer', visual: 'reportCard', note: 'She went looking for a Pro feature, with time to think. Show her a sample report card with her batch’s names.' },
      { id: 'g9', label: moment('worksheet'), lane: 'finish', visual: 'worksheet', note: 'Save her draft first. Let her send it as text now, and offer PDFs when she’s done.' },
      { id: 'g10', label: moment('dayTwo'), lane: 'quiet', visual: 'dayTwo', note: 'Still before her first class, so still no value. Help her finish the batch.' },
      { id: 'g11', label: moment('colleague'), lane: 'offer', visual: 'colleague', note: 'Sharing a batch with another teacher is a Pro feature she asked for. Offer it, and say exactly what Selvi will see.' },
    ],
  },
  gap: {
    id: 'gap', from: 16, at: 20.6,
    prompt: 'A parent waits at the door while Meenakshi taps “Add my logo” on a receipt. What should Kaksha do?',
    options: [{ id: 'a', label: 'Cover the receipt with the Pro screen' }, { id: 'b', label: 'Let her send the receipt without the logo, then offer Pro' }, { id: 'c', label: 'Quietly delete the button' }],
    correct: 'b', explanation: 'Never block a task someone is waiting on. Finish first, then sell.',
  },
  takeaways: [
    { title: 'Value, then limit', body: 'Offer the upgrade when someone has had value and reaches for what the paid plan does.' },
    { title: 'Never block mid-task', body: 'Let them finish, keep their work, then offer.' },
    { title: 'Their numbers, the full price', body: 'Show what they got, the price in rupees with the monthly figure, and a plain “Not now”.' },
    { title: 'Don’t sell after a failure', body: 'Fix the problem first. A pitch now feels like a ransom.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'The best upgrade moment is…', options: [{ id: 'a', label: 'When value meets a limit' }, { id: 'b', label: 'First open' }], correct: 'a', explanation: 'They know what they’re buying.' },
      { id: 'q2', prompt: 'A reverse trial…', options: [{ id: 'a', label: 'Charges first, refunds later' }, { id: 'b', label: 'Starts everyone on the paid plan for a while, then drops them to free' }, { id: 'c', label: 'Has no free plan' }], correct: 'b', explanation: 'People feel what they’d lose, and still keep a free plan.' },
      { id: 'q3', prompt: 'Under RBI rules, before a UPI AutoPay renewal is charged, the bank must…', options: [{ id: 'a', label: 'Do nothing' }, { id: 'b', label: 'Send a pre-debit notification at least 24 hours before' }, { id: 'c', label: 'Call the customer' }, { id: 'd', label: 'Wait a month' }], correct: 'b', explanation: 'A pre-debit notice gives people the chance to cancel. Say this on the Pro screen too.' },
      { id: 'q4', prompt: '“No thanks, I don’t care about my students” is…', options: [{ id: 'a', label: 'Good copy' }, { id: 'b', label: 'Confirmshaming, a dark pattern' }, { id: 'c', label: 'A legal requirement' }, { id: 'd', label: 'A tooltip' }], correct: 'b', explanation: 'gr.1-4: guilt-trip buttons are on India’s list of dark patterns.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why show “₹499 a year (about ₹42 a month)” instead of only “₹42/month*”?', hint: 'What will she actually pay?', options: [{ id: 'a', label: 'It looks bigger' }, { id: 'b', label: 'She pays ₹499 at once; hiding that is drip pricing, and the monthly figure still helps her compare' }, { id: 'c', label: 'Monthly prices are banned' }, { id: 'd', label: 'It doesn’t matter' }], correct: 'b', explanation: 'Show the amount that will be charged, plus the comparison that helps.' },
    { id: 'l2', prompt: 'Freemium works when…', hint: 'Who keeps it alive?', options: [{ id: 'a', label: 'The free plan is useless' }, { id: 'b', label: 'The free plan is good enough to love, and the paid plan is what the most active users grow into' }, { id: 'c', label: 'Everyone upgrades' }, { id: 'd', label: 'There’s no limit' }], correct: 'b', explanation: 'Most people stay free; they bring word of mouth. A small share, often a few percent, pay.' },
    { id: 'l3', prompt: 'Pro upgrades double after a change, but cancellations in month two triple. What happened?', hint: 'Who said yes?', options: [{ id: 'a', label: 'Nothing; upgrades doubled' }, { id: 'b', label: 'The paywall pushed people who didn’t need Pro yet; watch refunds and cancellations as guardrails' }, { id: 'c', label: 'The price is too low' }, { id: 'd', label: 'UPI is broken' }], correct: 'b', explanation: 'An upgrade that’s regretted is a refund and a review. Guardrails catch it.' },
    { id: 'l4', prompt: 'What should the Pro screen for “add a 26th student” lead with?', hint: 'What did she just ask for?', options: [{ id: 'a', label: 'A table of every Pro feature' }, { id: 'b', label: 'The thing she reached for: unlimited students, so her new Class 9 batch fits' }, { id: 'c', label: 'The company story' }, { id: 'd', label: 'A discount timer' }], correct: 'b', explanation: 'Start with the need in front of her; the rest can sit below.' },
    { id: 'l5', prompt: 'She says “Not now” to Pro. When should Kaksha ask again?', hint: 'Respect the answer.', options: [{ id: 'a', label: 'Tomorrow morning, and every morning' }, { id: 'b', label: 'The next time she reaches for a Pro feature, and not every time; keep the free limit working as promised' }, { id: 'c', label: 'Never, even if she asks' }, { id: 'd', label: 'Delete some of her students' }], correct: 'b', explanation: 'Ask again only at a new moment of need. Taking things away to force an upgrade breaks trust.' },
  ],
};
