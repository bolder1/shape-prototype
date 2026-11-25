// Episodes for chapter ax.3 · Inclusive design leadership. Drafts by Claude, for review.
// Hazri is a Bengaluru HR and payroll platform: about 9 lakh employees at 1,400 employers use its app for attendance,
// leave, payslips and expenses, and HR teams run payroll in Hazri Admin. Nandini Rao is head of design, Tenzin Dorje
// the accessibility specialist, Kiran Shetty runs engineering. Salma (blind, TalkBack), Joseph (Deaf, Indian Sign
// Language), Deepa (cerebral palsy, a wheelchair, Voice Access) and Revathi (low vision, 200% zoom) are the people in the research.
// ax.1 and ax.2 taught the standards and how people operate an interface; this chapter is for the people who lead the
// work: how to research with disabled people, how to carry access needs into personas, and how to build a programme
// that outlasts any one specialist. Data and rules: ../inclusive.
import type { Episode } from '../episode';
import {
  HAZRI_CHOICES, HAZRI_LINES, HAZRI_PROGRAM, personaFlaw, programLane, studyFlaw,
  type HazriChoice, type HazriLine, type HazriStep,
} from '../inclusive';

const choice = (k: HazriChoice) => HAZRI_CHOICES[k].text;
const flawOf = (k: HazriChoice) => studyFlaw(HAZRI_CHOICES[k]);
const line = (k: HazriLine) => HAZRI_LINES[k].text;
const verdict = (k: HazriLine) => personaFlaw(HAZRI_LINES[k]);
const step = (k: HazriStep) => HAZRI_PROGRAM[k].text;
const quarter = (k: HazriStep) => programLane(k);

export const ax3_1: Episode = {
  lessonId: 'ax.3-1',
  hook: 'Hazri’s leave flow passed every automated check. Then Salma, who is blind, tried to book a day off and couldn’t. Watch Nandini plan research that disabled people can take part in on equal terms.',
  scene: {
    id: 'study-session', duration: 36,
    beats: [
      { at: 0, title: 'Zero violations', body: 'The scan is clean and the WCAG 2.2 checklist is green. The leave flow ships.' },
      { at: 6, title: '“Button. Button. Button.”', body: 'Salma swipes through the date picker with TalkBack. Not one date is read out. She can’t apply for leave.' },
      { at: 11, title: 'Ask what people use', body: 'The screener asks about screen readers, zoom, voice control, sign language and time, never a diagnosis. Pay is at least the same hourly rate.' },
      { at: 16, title: 'Make the study accessible', body: 'A consent form TalkBack can read. An ISL interpreter Joseph chose. A step-free room, or the session at home.' },
      { at: 21, title: 'Their setup, their lead', body: 'Salma uses her own phone at her own speech rate and shares the audio. When she’s stuck, the moderator waits.' },
      { at: 26, title: 'Findings with owners', body: 'Each barrier gets a severity, the criterion it fails and the squad that owns the screen. Recordings stay private.' },
      { at: 31, title: 'Every month, not once', body: 'A paid panel of disabled employees and customers tests something every month. Salma books leave in 40 seconds.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the leave flow fail Salma after passing every check?', options: [{ id: 'a', label: 'She used TalkBack wrongly' }, { id: 'b', label: 'Automated tools and checklists catch only part of what stops real people; only testing with her showed the unnamed dates' }, { id: 'c', label: 'The scan was broken' }],
      correct: 'b', explanation: 'Conformance checks and real use are different questions.' },
    { id: 'c2', prompt: 'What should Hazri’s screener ask?', options: [{ id: 'a', label: 'The participant’s diagnosis' }, { id: 'b', label: 'What assistive technology and support they use' }, { id: 'c', label: 'For a disability certificate' }],
      correct: 'b', explanation: 'Needs tell you how to run the session. A diagnosis tells you nothing you need.' },
  ],
  game: {
    id: 'study-fix', title: 'Fix the study plan',
    instructions: 'Each card is a choice in Hazri’s plan for sessions with disabled participants. Is it sound, or does it harm people, shut them out, or skew the evidence? Name the worst problem. Right calls fix the plan, stage by stage.',
    lanes: [
      { id: 'sound', label: 'Sound', hint: 'Fair, accessible, real use' },
      { id: 'harms', label: 'Harms', hint: 'Unfair pay, prying, exposure' },
      { id: 'excludes', label: 'Shuts out', hint: 'They can’t take part as planned' },
      { id: 'skews', label: 'Skews', hint: 'Won’t show how they really work' },
    ],
    cards: [
      { id: 'g1', label: choice('pay'), lane: flawOf('pay'), visual: 'pay', note: 'Same work, less money, and more of their time. Pay at least the standard hourly rate: ₹2,250 for 90 minutes, costs on top.' },
      { id: 'g2', label: choice('labPhone'), lane: flawOf('labPhone'), visual: 'labPhone', note: 'Salma has used TalkBack at triple speed with her own gestures for ten years. On a strange phone at default settings, you test the phone, not Hazri.' },
      { id: 'g3', label: choice('network'), lane: flawOf('network'), visual: 'network', note: 'People come through organisations they trust, and those organisations are paid for the work of recruiting. Keep it.' },
      { id: 'g4', label: choice('consent'), lane: flawOf('consent'), visual: 'consent', note: 'A scanned PDF is an image to a screen reader. Salma can’t read what she’s agreeing to, let alone sign it.' },
      { id: 'g5', label: choice('diagnosis'), lane: flawOf('diagnosis'), visual: 'diagnosis', note: 'Medical details aren’t needed to run the session, and asking for proof treats people as suspects. Ask what they use.' },
      { id: 'g6', label: choice('takeOver'), lane: flawOf('takeOver'), visual: 'takeOver', note: 'The 30 seconds she was stuck is the finding. Wait, ask what she’d try next, and note it if she can’t go on.' },
      { id: 'g7', label: choice('interpreter'), lane: flawOf('interpreter'), visual: 'interpreter', note: 'ISL is Joseph’s first language, and English text in a chat isn’t. Without an interpreter, he isn’t really in the session.' },
      { id: 'g8', label: choice('pacing'), lane: flawOf('pacing'), visual: 'pacing', note: 'Screen readers, voice control and interpreting all take time. Fewer tasks and a break give better evidence. Keep it.' },
      { id: 'g9', label: choice('oneSpeaks'), lane: flawOf('oneSpeaks'), visual: 'oneSpeaks', note: 'Salma proved the date picker announces no dates. Report that, its severity and WCAG 4.1.2, not a claim about every blind person.' },
      { id: 'g10', label: choice('stairs'), lane: flawOf('stairs'), visual: 'stairs', note: '“Usually” isn’t access. Deepa uses a wheelchair; one broken lift and she can’t reach the room.' },
      { id: 'g11', label: choice('audio'), lane: flawOf('audio'), visual: 'audio', note: 'The team hears exactly what Salma hears, at her speed. Keep it.' },
      { id: 'g12', label: choice('footage'), lane: flawOf('footage'), visual: 'footage', note: 'Disability is health information. Restrict access, name people by number, and share clips only with consent.' },
    ],
  },
  gap: {
    id: 'gap', from: 0, at: 10.6,
    prompt: 'Salma couldn’t book leave on a flow that passed every check. What does Nandini change?',
    options: [{ id: 'a', label: 'Run a stricter scanner' }, { id: 'b', label: 'Test key flows with disabled people, recruited and paid fairly, on their own setups, every month' }, { id: 'c', label: 'Ask Tenzin to try it with TalkBack' }],
    correct: 'b', explanation: 'The people who use assistive technology every day find what checks and specialists miss.',
  },
  takeaways: [
    { title: 'Checks aren’t enough', body: 'Automated tools and audits catch part of it. Sessions with disabled people catch what stops real work.' },
    { title: 'Fair and accessible', body: 'Recruit through trusted networks, ask about needs not diagnoses, pay at least the same rate, and make every part of the study accessible.' },
    { title: 'Their setup, their lead', body: 'Own devices and settings, longer sessions, and a moderator who waits instead of taking over.' },
    { title: 'Findings to owners', body: 'Severity, criterion and owning squad for each barrier; private recordings; a standing panel, not a one-off.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'Participants should use…', options: [{ id: 'a', label: 'Their own devices and settings' }, { id: 'b', label: 'The lab phone' }, { id: 'c', label: 'Whatever’s fastest' }], correct: 'a', explanation: 'Otherwise you test the setup, not the product.' },
      { id: 'q2', prompt: 'A scanned PDF consent form:', options: [{ id: 'a', label: 'Fine' }, { id: 'b', label: 'Shuts out screen reader users' }, { id: 'c', label: 'Harms nobody' }], correct: 'b', explanation: 'An image of text is unreadable to a screen reader.' },
      { id: 'q3', prompt: 'Disabled participants’ incentive should be…', options: [{ id: 'a', label: 'Lower, since sessions are longer' }, { id: 'b', label: 'At least the same hourly rate, costs on top' }, { id: 'c', label: 'Optional' }], correct: 'b', explanation: 'Same rate for the same work.' },
      { id: 'q4', prompt: 'Salma is stuck. The moderator should…', options: [{ id: 'a', label: 'Wait, then ask what she’d try' }, { id: 'b', label: 'Tap it for her' }, { id: 'c', label: 'Turn off TalkBack' }], correct: 'a', explanation: 'The stuck moment is the finding.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why not have sighted designers test with a blindfold instead?', hint: 'Who knows how to use TalkBack?', options: [{ id: 'a', label: 'It works just as well' }, { id: 'b', label: 'A blindfolded beginner shows the shock of losing sight, not how an expert TalkBack user works; it misleads more than it reveals' }, { id: 'c', label: 'Blindfolds are expensive' }, { id: 'd', label: 'It takes longer' }], correct: 'b', explanation: 'Simulation measures novelty, not use.' },
    { id: 'l2', prompt: 'Salma’s TalkBack reads a label oddly, but NVDA and VoiceOver read it fine, and the code is correct. How should the team log it?', hint: 'Is it Hazri’s fault?', options: [{ id: 'a', label: 'As a critical Hazri bug' }, { id: 'b', label: 'As a screen reader quirk, noted with versions; check whether a small change helps, but don’t let it displace real product faults' }, { id: 'c', label: 'Ignore it' }, { id: 'd', label: 'Tell Salma to switch screen readers' }], correct: 'b', explanation: 'Separate assistive technology behaviour from product faults.' },
    { id: 'l3', prompt: 'Hazri can afford six sessions this quarter. How should Nandini spread them?', hint: 'One kind of access need, or several?', options: [{ id: 'a', label: 'Six blind participants, for confidence' }, { id: 'b', label: 'Across needs: screen reader, zoom, voice or switch control, Deaf, cognitive; then repeat next quarter with new people' }, { id: 'c', label: 'Six people without disabilities, for a baseline' }, { id: 'd', label: 'One long session' }], correct: 'b', explanation: 'Breadth now, repetition over time.' },
    { id: 'l4', prompt: 'Deepa tires quickly after about an hour of Voice Access. Halfway through, she asks to stop. What should the moderator do?', hint: 'Whose session is it?', options: [{ id: 'a', label: 'Ask her to finish the last task' }, { id: 'b', label: 'Stop, pay her in full, and offer to finish another day if she’d like' }, { id: 'c', label: 'Pay half' }, { id: 'd', label: 'Continue without recording' }], correct: 'b', explanation: 'Participants can stop at any time, and stopping costs them nothing.' },
    { id: 'l5', prompt: 'Kiran asks why Hazri needs disabled participants when Tenzin, an expert, already audits everything. What’s Nandini’s answer?', hint: 'What does each find?', options: [{ id: 'a', label: 'Audits are useless' }, { id: 'b', label: 'An expert audit finds where screens fail the standard; sessions show which failures stop real people, and barriers no criterion names. Hazri needs both' }, { id: 'c', label: 'It’s required by law' }, { id: 'd', label: 'It looks good' }], correct: 'b', explanation: 'Conformance and usability are different evidence.' },
  ],
};

export const ax3_2: Episode = {
  lessonId: 'ax.3-2',
  hook: 'Hazri had four personas on every squad’s wall and a fifth, “Accessible Arun”, that nobody opened. Watch Nandini fold access needs into the personas people actually use.',
  scene: {
    id: 'persona-rewrite', duration: 36,
    beats: [
      { at: 0, title: 'The fifth persona', body: 'Four personas on the wall. “Accessible Arun, 34, blind” sits in a folder. The payroll squad designs for the four.' },
      { at: 6, title: 'Needs, not diagnoses', body: '“Has retinitis pigmentosa” becomes “misses anything at the edges of the screen”. Now the squad knows what to fix.' },
      { at: 11, title: 'Cut pity and heroes', body: '“Inspiring, never lets her condition stop her.” It’s about the writer’s feelings, so it goes.' },
      { at: 16, title: 'Every line has evidence', body: '“Works at 200% zoom”: seen in 4 of 9 sessions. “Loves dark mode”: seen in none, so it goes too.' },
      { at: 21, title: 'Into the core', body: 'Revathi’s card now says how she works: 200% zoom, high contrast, Tamil notes, a deadline on the 28th.' },
      { at: 26, title: 'Checked with the people', body: 'Revathi and the employee disability network read the cards. Two lines change.' },
      { at: 31, title: 'Put it to work', body: 'Design review asks: “Does this work for Revathi at 200%?” The payroll table stops scrolling sideways.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the payroll squad ignore Arun?', options: [{ id: 'a', label: 'He was badly written' }, { id: 'b', label: 'A separate accessibility persona sits outside the ones squads design for, so it gets treated as a special case' }, { id: 'c', label: 'They didn’t have time' }],
      correct: 'b', explanation: 'Fold access needs into the core personas.' },
    { id: 'c2', prompt: 'What should a persona line about a disability describe?', options: [{ id: 'a', label: 'The diagnosis' }, { id: 'b', label: 'What the person does, uses and runs into' }, { id: 'c', label: 'How they feel about it' }],
      correct: 'b', explanation: 'Designers need a need, not a condition.' },
  ],
  game: {
    id: 'persona-crit', title: 'Crit the persona',
    instructions: 'Each card is a line from a draft of Revathi’s persona, with the research behind it. Keep it, or name its worst problem: a stereotype, a line with no evidence, or a label instead of a need. Right calls rebuild her card beside you.',
    lanes: [
      { id: 'keep', label: 'Keep', hint: 'A need, with evidence' },
      { id: 'stereotype', label: 'Stereotype', hint: 'Pity, hero or assumption' },
      { id: 'unfounded', label: 'No evidence', hint: 'No session showed it' },
      { id: 'diagnosis', label: 'Label', hint: 'A condition, not a need' },
    ],
    cards: [
      { id: 'g1', label: line('zoom'), lane: verdict('zoom'), visual: 'zoom', note: 'Her real setup, seen in four sessions. Every squad can check a design against it.' },
      { id: 'g2', label: line('brave'), lane: verdict('brave'), visual: 'brave', note: 'Inspiration framing is about how the writer feels. It tells a designer nothing and makes her a symbol. Cut it.' },
      { id: 'g3', label: line('rp'), lane: verdict('rp'), visual: 'rp', note: 'A diagnosis leaves every designer to guess. Say what it means for the screen: she misses things at the edges.' },
      { id: 'g4', label: line('deadline'), lane: verdict('deadline'), visual: 'deadline', note: 'The stakes. Every barrier on the payroll run costs 1,200 people their pay on time.' },
      { id: 'g5', label: line('darkMode'), lane: verdict('darkMode'), visual: 'darkMode', note: 'A designer’s guess. In sessions she used Windows high contrast, not the app’s dark theme. Cut it until research shows it.' },
      { id: 'g6', label: line('tech'), lane: verdict('tech'), visual: 'tech', note: 'An age stereotype the research contradicts. She uses three systems daily and learns screens from their labels.' },
      { id: 'g7', label: line('tables'), lane: verdict('tables'), visual: 'tables', note: 'A barrier the payroll squad can fix: at 200%, the table should reflow, not scroll sideways (WCAG 1.4.10).' },
      { id: 'g8', label: line('disabled'), lane: verdict('disabled'), visual: 'disabled', note: 'True of her, and useless to a designer. The lines about her setup and barriers say what it means. Cut the label.' },
      { id: 'g9', label: line('tamil'), lane: verdict('tamil'), visual: 'tamil', note: 'Context that shapes the design: notes and messages may be in Tamil, so fields and fonts must handle it.' },
      { id: 'g10', label: line('help'), lane: verdict('help'), visual: 'help', note: 'An assumption about what she can do. The sessions showed she works alone and asks only when a screen changes without warning.' },
      { id: 'g11', label: line('toast'), lane: verdict('toast'), visual: 'toast', note: 'A barrier with a cause: a short-lived message where her vision doesn’t reach. Put status near the action and keep it.' },
      { id: 'g12', label: line('reader'), lane: verdict('reader'), visual: 'reader', note: 'A prediction, not a finding. Describe the magnifier she uses today.' },
    ],
  },
  gap: {
    id: 'gap', from: 0, at: 5.6,
    prompt: 'The squads design for the four personas on the wall, never the fifth. What does Nandini do?',
    options: [{ id: 'a', label: 'Put Arun on the wall too' }, { id: 'b', label: 'Fold access needs into the four core personas, from the research, and check design reviews against them' }, { id: 'c', label: 'Make one persona per disability' }],
    correct: 'b', explanation: 'Access needs belong in the personas people already use.',
  },
  takeaways: [
    { title: 'No separate persona', body: 'Fold access needs into the core personas, so every squad designs for them by default.' },
    { title: 'Needs, not diagnoses', body: 'Describe what people do, use and run into: setup, settings, context and barriers.' },
    { title: 'Evidence for every line', body: 'Trace each line to research. Cut guesses, labels, pity and heroism.' },
    { title: 'Put them to work', body: 'Review personas with the people they describe, and check every design against them.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: '“Has retinitis pigmentosa” is…', options: [{ id: 'a', label: 'A label' }, { id: 'b', label: 'A need' }, { id: 'c', label: 'A stereotype' }], correct: 'a', explanation: 'Say what it means on screen.' },
      { id: 'q2', prompt: '“Loves dark mode”, seen in no session:', options: [{ id: 'a', label: 'Keep' }, { id: 'b', label: 'No evidence' }, { id: 'c', label: 'Label' }], correct: 'b', explanation: 'Personas summarise research.' },
      { id: 'q3', prompt: '“Inspiring, never lets her condition stop her”:', options: [{ id: 'a', label: 'Stereotype' }, { id: 'b', label: 'Keep' }, { id: 'c', label: 'Label' }], correct: 'a', explanation: 'Pity and heroism both mislead.' },
      { id: 'q4', prompt: 'Where do access needs go?', options: [{ id: 'a', label: 'A separate persona' }, { id: 'b', label: 'The core personas' }, { id: 'c', label: 'An appendix' }], correct: 'b', explanation: 'Where squads will see them.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'A PM objects: “If every persona has an access need, we’ll design only for edge cases.” What’s the answer?', hint: 'Who else is helped?', options: [{ id: 'a', label: 'Agree, and keep one' }, { id: 'b', label: 'Needs are spread by the research, not given to everyone; and a table that reflows at 200% also works on a small laptop or in bright sun' }, { id: 'c', label: 'Remove access needs' }, { id: 'd', label: 'Make it optional' }], correct: 'b', explanation: 'Solve for one, extend to many.' },
    { id: 'l2', prompt: 'One session showed Revathi using the magnifier. Should that line stay?', hint: 'How strong does evidence need to be?', options: [{ id: 'a', label: 'No, one is too few' }, { id: 'b', label: 'Yes, with its evidence shown (“1 of 9 sessions”), so readers know how strong it is; add more research before building big decisions on it' }, { id: 'c', label: 'Only if she’s blind' }, { id: 'd', label: 'Yes, as a certainty' }], correct: 'b', explanation: 'Show the strength of the evidence.' },
    { id: 'l3', prompt: 'Should the persona photo show Revathi’s magnifier or dark glasses?', hint: 'What does the image tell people?', options: [{ id: 'a', label: 'Yes, always, so people remember' }, { id: 'b', label: 'Only if it’s true and ordinary in her life; a photo that turns a person into their disability works against the whole card' }, { id: 'c', label: 'Use a stock photo of a blind person' }, { id: 'd', label: 'Use no people at all, ever' }], correct: 'b', explanation: 'Show the person, not the condition.' },
    { id: 'l4', prompt: 'Situational limits like a shift-floor phone held in one gloved hand: personas or not?', hint: 'Do they change the design?', options: [{ id: 'a', label: 'No, only permanent disabilities count' }, { id: 'b', label: 'Yes, where research shows them: they’re mismatches too, and they often lead to the same fix as a permanent need' }, { id: 'c', label: 'Only in a separate persona' }, { id: 'd', label: 'Only for marketing' }], correct: 'b', explanation: 'The persona spectrum covers permanent, temporary and situational.' },
    { id: 'l5', prompt: 'Who should review the rebuilt personas before they go on the wall?', hint: '“Nothing about us without us.”', options: [{ id: 'a', label: 'The design team alone' }, { id: 'b', label: 'Participants and the employee disability network, alongside the squads who will use them' }, { id: 'c', label: 'Legal' }, { id: 'd', label: 'Nobody' }], correct: 'b', explanation: 'The people described can spot what the writers can’t.' },
  ],
};

export const ax3_3: Episode = {
  lessonId: 'ax.3-3',
  hook: 'Tenzin reviewed 30 pull requests a week, and Hazri still shipped new barriers every sprint. Then a Munich customer asked for a conformance report nobody could write. Watch one specialist become a programme.',
  scene: {
    id: 'maturity-road', duration: 36,
    beats: [
      { at: 0, title: 'One specialist, 30 reviews', body: 'Tenzin is the only person who checks accessibility. Releases wait for him, and squads still ship new barriers.' },
      { at: 6, title: 'The deal that slipped', body: 'Kranich Logistik asks for a conformance report against EN 301 549. Nobody can write one. The deal slips a quarter.' },
      { at: 11, title: 'Where Hazri stands', body: 'The W3C’s draft maturity model runs from Inactive to Optimize. On leadership, research and procurement, Hazri is Inactive.' },
      { at: 16, title: 'Owner, policy, budget', body: 'An accountable executive and a policy: WCAG 2.2 AA for web and app, and no release with a known critical issue.' },
      { at: 21, title: 'Build it into the system', body: 'Accessible components, a definition of done, checks in CI, a manual pass, a champion in every squad.' },
      { at: 26, title: 'In order', body: 'Policy before gates. Fixes before the report. Each quarter starts what the last one made possible.' },
      { at: 31, title: 'Measure what matters', body: 'Critical issues shipped, time to fix and panel findings sit on the leadership dashboard. Kranich signs.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why wasn’t Tenzin enough?', options: [{ id: 'a', label: 'He wasn’t skilled enough' }, { id: 'b', label: 'One reviewer can find problems but not stop squads making them; prevention needs process, people and ownership' }, { id: 'c', label: 'He was too slow' }],
      correct: 'b', explanation: 'A programme, not a person.' },
    { id: 'c2', prompt: 'What did Kranich ask for?', options: [{ id: 'a', label: 'A conformance report against EN 301 549' }, { id: 'b', label: 'A certificate from the government' }, { id: 'c', label: 'A demo' }],
      correct: 'a', explanation: 'Buyers ask for a report of how each criterion is met.' },
  ],
  game: {
    id: 'program-road', title: 'Plan the year',
    instructions: 'Each card is part of Hazri’s accessibility programme, with what it depends on. Put it in the earliest quarter it can start: the first, or the one after the last thing it needs. Right calls build the roadmap beside you.',
    lanes: [
      { id: 'q1', label: 'Jan–Mar', hint: 'Needs nothing first' },
      { id: 'q2', label: 'Apr–Jun', hint: 'Needs a Q1 step' },
      { id: 'q3', label: 'Jul–Sep', hint: 'Needs a Q2 step' },
      { id: 'q4', label: 'Oct–Dec', hint: 'Needs a Q3 step' },
    ],
    cards: [
      { id: 'g1', label: step('policy'), lane: quarter('policy'), visual: 'policy', note: 'A policy needs someone accountable for keeping it, and the budget to meet it. Once the executive is named, write it.' },
      { id: 'g2', label: step('exec'), lane: quarter('exec'), visual: 'exec', note: 'Everything else rests on an owner with a budget. Start here.' },
      { id: 'g3', label: step('gate'), lane: quarter('gate'), visual: 'gate', note: 'A gate needs a policy to enforce, components that pass it and people trained to meet it. All three land in Q2.' },
      { id: 'g4', label: step('baseline'), lane: quarter('baseline'), visual: 'baseline', note: 'You can’t prioritise what you haven’t measured. Audit the busiest journeys first, with disabled participants.' },
      { id: 'g5', label: step('acr'), lane: quarter('acr'), visual: 'acr', note: 'An honest report needs the critical issues fixed and a policy to state. Then Kranich gets a report it can rely on.' },
      { id: 'g6', label: step('components'), lane: quarter('components'), visual: 'components', note: 'Fix what the audit found, in the components every squad uses, with champions to review them. One fix reaches every screen.' },
      { id: 'g7', label: step('champions'), lane: quarter('champions'), visual: 'champions', note: 'Champions need nothing first, and Tenzin stops being the only reviewer.' },
      { id: 'g8', label: step('dashboard'), lane: quarter('dashboard'), visual: 'dashboard', note: 'Measures are meaningful once the gate is producing data. Then leadership reviews them each quarter.' },
      { id: 'g9', label: step('critical'), lane: quarter('critical'), visual: 'critical', note: 'The audit says what’s critical. Fix those first: leave, payslips and the payroll run.' },
      { id: 'g10', label: step('training'), lane: quarter('training'), visual: 'training', note: 'Champions in each squad help shape and run the training, so it fits how each role works.' },
      { id: 'g11', label: step('statement'), lane: quarter('statement'), visual: 'statement', note: 'Publish once you can name the standard and the critical issues are fixed, and list what’s still known to fail.' },
      { id: 'g12', label: step('procurement'), lane: quarter('procurement'), visual: 'procurement', note: 'Once Hazri has written its own report, it knows how to judge one. Then ask the same of its vendors.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.6,
    prompt: 'Kranich wants a conformance report, and Tenzin is already the bottleneck. What does Nandini propose?',
    options: [{ id: 'a', label: 'Hire a second specialist to review everything' }, { id: 'b', label: 'A year-long programme: an accountable owner and policy, accessibility built into the system and process, and measures leadership reviews' }, { id: 'c', label: 'A big audit before the deal' }],
    correct: 'b', explanation: 'More reviewers move the bottleneck. A programme removes it.',
  },
  takeaways: [
    { title: 'A programme, not a person', body: 'An accountable owner, a budget and a policy naming the standard, WCAG 2.2 AA for most teams.' },
    { title: 'Built into the system', body: 'Accessible components, definition of done, CI checks and a manual pass, champions in every squad.' },
    { title: 'Proof you can stand behind', body: 'An honest conformance report per product and a public statement with known issues.' },
    { title: 'Sequence and measure', body: 'Start what the last quarter made possible, and put outcomes, not activity, on the dashboard.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'Which comes first?', options: [{ id: 'a', label: 'An accountable owner and budget' }, { id: 'b', label: 'A release gate' }, { id: 'c', label: 'A public statement' }], correct: 'a', explanation: 'Everything else rests on it.' },
      { id: 'q2', prompt: 'A conformance report with 14 critical issues open should…', options: [{ id: 'a', label: 'Say “Supports” everywhere' }, { id: 'b', label: 'Report gaps honestly, with a fix plan' }, { id: 'c', label: 'Wait for perfection' }], correct: 'b', explanation: 'Buyers rely on it.' },
      { id: 'q3', prompt: 'EN 301 549 is…', options: [{ id: 'a', label: 'The European standard for ICT accessibility' }, { id: 'b', label: 'An Indian law' }, { id: 'c', label: 'A screen reader' }], correct: 'a', explanation: 'It references WCAG 2.1 AA for the web.' },
      { id: 'q4', prompt: 'The best sign the programme works:', options: [{ id: 'a', label: 'Training attendance' }, { id: 'b', label: 'Fewer critical issues shipped, fixed faster' }, { id: 'c', label: 'Scans run' }], correct: 'b', explanation: 'Measure outcomes, not activity.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why does the release gate wait until Q3?', hint: 'What does a gate check against?', options: [{ id: 'a', label: 'It doesn’t matter much' }, { id: 'b', label: 'Gating before the policy, the fixed components and the training exist just blocks releases nobody can make pass' }, { id: 'c', label: 'CI is expensive' }, { id: 'd', label: 'Engineers will object' }], correct: 'b', explanation: 'Make passing possible before you require it.' },
    { id: 'l2', prompt: 'Kiran proposes automated checks as the whole of the gate. What’s missing?', hint: 'How much can a tool judge?', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'Tools catch only part of the failures; a manual keyboard and screen reader pass, and the panel, cover focus order, meaningful names and real use' }, { id: 'c', label: 'A second tool' }, { id: 'd', label: 'A longer report' }], correct: 'b', explanation: 'Automate what you can, and check the rest by hand.' },
    { id: 'l3', prompt: 'The CFO asks for the business case in one line. Which is strongest for Hazri?', hint: 'What just happened with Kranich?', options: [{ id: 'a', label: 'It’s the right thing to do' }, { id: 'b', label: 'Buyers now ask for conformance reports, we lost a quarter on one deal, and fixing barriers in components costs less than fixing them screen by screen' }, { id: 'c', label: 'Competitors are doing it' }, { id: 'd', label: 'It’s cheap' }], correct: 'b', explanation: 'Revenue, risk and cost, in the company’s own numbers.' },
    { id: 'l4', prompt: 'Does Hazri, a private Indian company, have to meet EN 301 549?', hint: 'Who is asking for it, and why?', options: [{ id: 'a', label: 'Yes, by Indian law' }, { id: 'b', label: 'It’s Kranich’s buying requirement, not Indian law; which rules apply to Hazri is for legal to confirm, and meeting WCAG 2.2 AA covers most of it either way' }, { id: 'c', label: 'No, so ignore it' }, { id: 'd', label: 'Only if it’s in German' }], correct: 'b', explanation: 'Know who requires what, and aim above the floor.' },
    { id: 'l5', prompt: 'A year in, critical issues shipped are down 80%. Tenzin wants to step back. Is the programme mature?', hint: 'What happens without him?', options: [{ id: 'a', label: 'Yes, it’s done' }, { id: 'b', label: 'It’s integrated if it keeps working without him: owners, gates, champions, the panel and the dashboard all run on their own; then aim for Optimize, including hiring disabled people onto the team' }, { id: 'c', label: 'No, it needs a second Tenzin' }, { id: 'd', label: 'Only when there are zero issues' }], correct: 'b', explanation: 'Maturity is how well it runs without its founder.' },
  ],
};
