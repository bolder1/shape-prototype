// Episodes for chapter ld.2 · Career & portfolio. Drafts by Claude, for review.
import type { Episode } from '../episode';

export const ld2_1: Episode = {
  lessonId: 'ld.2-1',
  hook: 'A hiring manager opens your case study and gives it 40 seconds. In that time, can they see the problem, your part and what changed?',
  scene: {
    id: 'case-study', duration: 34,
    beats: [
      { at: 0, title: 'The gallery', body: 'Forty beautiful screens, one after another. No problem, no role, no result. The reader scrolls, then closes it.' },
      { at: 6, title: 'Start with the summary', body: 'One line at the top: the problem, your role, the outcome. Now the reader knows why to keep going.' },
      { at: 11, title: 'Context', body: 'Riders were abandoning bookings at payment. You were the only designer, with two engineers, for six weeks.' },
      { at: 16, title: 'Process', body: 'Interviews, a journey map, three payment layouts tested. Show the key decisions, not every step.' },
      { at: 22, title: 'Solution and outcome', body: 'A one-tap UPI flow with the fare locked first. Drop-off fell from 38% to 21%.' },
      { at: 29, title: 'A story with a shape', body: 'Context, process, solution, outcome, learnings. Skimmable in 40 seconds, deep if they stay.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What went at the very top?', options: [{ id: 'a', label: 'A one-line summary with problem, role and outcome' }, { id: 'b', label: 'The tool list' }, { id: 'c', label: 'The final screens' }],
      correct: 'a', explanation: 'It tells a busy reader why to keep going.' },
    { id: 'c2', prompt: 'How should the process section treat every step you took?', options: [{ id: 'a', label: 'Show all of them in order' }, { id: 'b', label: 'Focus on the key decisions' }, { id: 'c', label: 'Skip process entirely' }],
      correct: 'b', explanation: 'Decisions show thinking; exhaustive lists bury it.' },
  ],
  game: {
    id: 'case-order', title: 'Build the case study',
    instructions: 'Here are snippets from a case study about a ride-hailing payment flow. Drag each one into the section where it belongs, or tap the section.',
    lanes: [
      { id: 'context', label: 'Context', hint: 'The problem and your role' },
      { id: 'process', label: 'Process', hint: 'Research and key decisions' },
      { id: 'solution', label: 'Solution', hint: 'What you designed and why' },
      { id: 'outcome', label: 'Outcome', hint: 'What changed' },
    ],
    cards: [
      { id: 'g1', label: 'Riders abandoned 38% of bookings at the payment step.', lane: 'context' },
      { id: 'g2', label: 'As the only designer, I owned the flow with two engineers over six weeks.', lane: 'context' },
      { id: 'g3', label: 'I interviewed eight riders and mapped where they hesitated.', lane: 'process' },
      { id: 'g4', label: 'We tested three payment layouts with 20 people and picked the clearest.', lane: 'process' },
      { id: 'g5', label: 'A one-tap UPI flow, with the fare locked before you pay.', lane: 'solution' },
      { id: 'g6', label: 'Saved payment methods appear first; cash is one tap away.', lane: 'solution' },
      { id: 'g7', label: 'Payment drop-off fell from 38% to 21% in six weeks.', lane: 'outcome' },
      { id: 'g8', label: 'Payment support tickets halved.', lane: 'outcome' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.4,
    prompt: 'The case study opens with 40 screens. What should replace them at the top?',
    options: [{ id: 'a', label: 'A one-line summary: the problem, your role, the result' }, { id: 'b', label: 'Your CV' }, { id: 'c', label: 'A list of software' }],
    correct: 'a', explanation: 'Lead with the story in one sentence; screens come later, as evidence.',
  },
  takeaways: [
    { title: 'Lead with the summary', body: 'Problem, role, outcome, in one line at the top.' },
    { title: 'A clear shape', body: 'Context, process, solution, outcome, learnings.' },
    { title: 'Decisions over screens', body: 'Show the key choices and why; screens are evidence, not the story.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '“Drop-off fell from 38% to 21%” belongs in…', options: [{ id: 'a', label: 'Outcome' }, { id: 'b', label: 'Context' }], correct: 'a', explanation: 'What changed.' },
      { id: 'q2', prompt: '“I interviewed eight riders” belongs in…', options: [{ id: 'a', label: 'Solution' }, { id: 'b', label: 'Process' }, { id: 'c', label: 'Outcome' }], correct: 'b', explanation: 'Research.' },
      { id: 'q3', prompt: 'Your role belongs in…', options: [{ id: 'a', label: 'Outcome' }, { id: 'b', label: 'Solution' }, { id: 'c', label: 'Learnings' }, { id: 'd', label: 'Context' }], correct: 'd', explanation: 'Up front.' },
      { id: 'q4', prompt: 'How long do many reviewers spend at first?', options: [{ id: 'a', label: 'An hour' }, { id: 'b', label: 'A day' }, { id: 'c', label: 'Under a minute' }, { id: 'd', label: 'Never look' }], correct: 'c', explanation: 'Make it skimmable.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'You don’t have hard numbers. What can you show as an outcome?', hint: 'Evidence comes in many forms.', options: [{ id: 'a', label: 'Qualitative results: test findings, quotes, adoption by the team' }, { id: 'b', label: 'Invent numbers' }, { id: 'c', label: 'Skip the outcome' }, { id: 'd', label: 'Say “it was great”' }], correct: 'a', explanation: 'Honest evidence beats made-up metrics.' },
    { id: 'l2', prompt: 'How many case studies should a junior portfolio have?', hint: 'Depth over volume.', options: [{ id: 'a', label: 'Fifteen' }, { id: 'b', label: 'Two or three strong ones' }, { id: 'c', label: 'One line each for twenty projects' }, { id: 'd', label: 'None, just screens' }], correct: 'b', explanation: 'A few deep stories beat many shallow ones.' },
    { id: 'l3', prompt: 'Your best work is under NDA. What can you do?', hint: 'Protect the client, show the thinking.', options: [{ id: 'a', label: 'Post it anyway' }, { id: 'b', label: 'Never mention it' }, { id: 'c', label: 'Anonymise and blur details, or describe the process without confidential screens' }, { id: 'd', label: 'Copy someone else’s' }], correct: 'c', explanation: 'Respect the NDA; show method and outcomes.' },
    { id: 'l4', prompt: 'Why include what you’d do differently?', hint: 'Self-awareness.', options: [{ id: 'a', label: 'It isn’t needed' }, { id: 'b', label: 'To fill space' }, { id: 'c', label: 'To blame others' }, { id: 'd', label: 'It shows you learn from work, which hiring managers value' }], correct: 'd', explanation: 'Reflection signals growth.' },
    { id: 'l5', prompt: 'A concept project (not shipped) can still be strong if…', hint: 'Real constraints.', options: [{ id: 'a', label: 'It tackles a real problem with research, constraints and testing' }, { id: 'b', label: 'It redesigns a famous app’s logo' }, { id: 'c', label: 'It has the most screens' }, { id: 'd', label: 'It uses trendy gradients' }], correct: 'a', explanation: 'Show real thinking, even without launch.' },
  ],
};

export const ld2_2: Episode = {
  lessonId: 'ld.2-2',
  hook: 'Two portfolios with equally beautiful screens. One gets a call back. The difference is in the sentences.',
  scene: {
    id: 'portfolio-crit', duration: 34,
    beats: [
      { at: 0, title: 'How reviewers read', body: 'Eyes jump: the summary, the role, the first image, the outcome. Everything else is skimmed.' },
      { at: 6, title: 'Vague words', body: '“Clean.” “Modern.” “User-friendly.” These say nothing about the problem or what you did.' },
      { at: 12, title: 'Specific words', body: '“Riders feared being overcharged, so we showed the final fare before payment.” A problem, an insight, a decision.' },
      { at: 18, title: 'Honest trade-offs', body: '“We cut saved addresses to ship on time.” Admitting limits makes the rest believable.' },
      { at: 24, title: 'Fewer, better screens', body: 'Three screens that show the key decision beat forty that show everything.' },
      { at: 29, title: 'Show how you think', body: 'Specific problems, decisions, trade-offs and results. That’s what gets the call back.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What’s wrong with “clean and modern”?', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'It says nothing about the problem or your decisions' }, { id: 'c', label: 'It’s too long' }],
      correct: 'b', explanation: 'Vague praise isn’t evidence.' },
    { id: 'c2', prompt: 'Why mention trade-offs?', options: [{ id: 'a', label: 'They make the rest of the story believable' }, { id: 'b', label: 'To look bad' }, { id: 'c', label: 'Required by law' }],
      correct: 'a', explanation: 'Real projects have limits.' },
  ],
  game: {
    id: 'portfolio-crit', title: 'Critique the portfolio',
    instructions: 'Each card is a line or section from someone’s portfolio. Is it strong, or weak? Then see how a reviewer would improve it.',
    lanes: [
      { id: 'weak', label: 'Weak', hint: 'Vague, looks-only or missing your part' },
      { id: 'strong', label: 'Strong', hint: 'Specific problem, decision or result' },
    ],
    cards: [
      { id: 'g1', label: '“I made the app look modern and clean.”', lane: 'weak', note: 'Say what problem the redesign solved and how you know.' },
      { id: 'g2', label: '“Riders dropped off at payment; I redesigned the flow and cut drop-off from 38% to 21%.”', lane: 'strong', note: 'Problem, action and result in one line.' },
      { id: 'g3', label: '“Here are all 40 screens of the final UI.”', lane: 'weak', note: 'Pick the three screens that show the key decisions, and explain them.' },
      { id: 'g4', label: '“Three screens that show why we locked the fare before payment.”', lane: 'strong', note: 'Screens used as evidence for a decision.' },
      { id: 'g5', label: '“We did user research.”', lane: 'weak', note: 'Say what you learned and how it changed the design.' },
      { id: 'g6', label: '“Interviews showed riders feared being overcharged, so we showed the final fare first.”', lane: 'strong', note: 'An insight that led directly to a decision.' },
      { id: 'g7', label: '“Everything went perfectly.”', lane: 'weak', note: 'Real projects have trade-offs; honest ones build trust.' },
      { id: 'g8', label: '“We cut saved addresses to ship on time; it came back in v2.”', lane: 'strong', note: 'An honest trade-off and its follow-up.' },
      { id: 'g9', label: '“I designed everything.” (on a team of five)', lane: 'weak', note: 'Say exactly what you owned and who you worked with.' },
      { id: 'g10', label: '“Role: lead designer, with two engineers and a PM, six weeks.”', lane: 'strong', note: 'Clear ownership and context.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 11.4,
    prompt: 'A case study says “The new design is clean and user-friendly.” How do you improve it?',
    options: [{ id: 'a', label: 'Add more adjectives' }, { id: 'b', label: 'Name the problem, the decision and the evidence' }, { id: 'c', label: 'Use a bigger font' }],
    correct: 'b', explanation: 'Replace adjectives with specifics a reviewer can believe.',
  },
  takeaways: [
    { title: 'Specific beats pretty', body: 'Problems, insights, decisions and results, in concrete words.' },
    { title: 'Your part, clearly', body: 'Say what you owned on the team.' },
    { title: 'Honest and focused', body: 'Show trade-offs and a few key screens, not everything.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '“Modern and clean” is…', options: [{ id: 'a', label: 'Weak' }, { id: 'b', label: 'Strong' }], correct: 'a', explanation: 'Vague.' },
      { id: 'q2', prompt: 'Showing all 40 screens is…', options: [{ id: 'a', label: 'Ideal' }, { id: 'b', label: 'Usually too much' }, { id: 'c', label: 'Required' }], correct: 'b', explanation: 'Curate.' },
      { id: 'q3', prompt: 'On a team project, say…', options: [{ id: 'a', label: 'You did it all' }, { id: 'b', label: 'Nothing about the team' }, { id: 'c', label: 'Only the result' }, { id: 'd', label: 'Exactly what you owned' }], correct: 'd', explanation: 'Clear contribution.' },
      { id: 'q4', prompt: 'Admitting a trade-off…', options: [{ id: 'a', label: 'Hurts you' }, { id: 'b', label: 'Is unprofessional' }, { id: 'c', label: 'Builds credibility' }, { id: 'd', label: 'Is irrelevant' }], correct: 'c', explanation: 'Real work has limits.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What’s the first thing to fix in most junior portfolios?', hint: 'Story first.', options: [{ id: 'a', label: 'Add clear problems, roles and outcomes to each case study' }, { id: 'b', label: 'Change the font' }, { id: 'c', label: 'Add animations' }, { id: 'd', label: 'Add more projects' }], correct: 'a', explanation: 'Structure and substance before polish.' },
    { id: 'l2', prompt: 'Should a portfolio include Dribbble-style visual explorations?', hint: 'Context.', options: [{ id: 'a', label: 'Only those' }, { id: 'b', label: 'A few, clearly labelled as explorations, alongside real case studies' }, { id: 'c', label: 'Never' }, { id: 'd', label: 'Instead of case studies' }], correct: 'b', explanation: 'Visual skill matters; thinking matters more.' },
    { id: 'l3', prompt: 'How should you ask for portfolio feedback?', hint: 'Make it easy to answer.', options: [{ id: 'a', label: '“Thoughts?”' }, { id: 'b', label: 'Send it to 100 strangers' }, { id: 'c', label: 'Ask specific questions, like “Is my role clear in 30 seconds?”' }, { id: 'd', label: 'Only ask friends who love it' }], correct: 'c', explanation: 'Specific questions get useful answers.' },
    { id: 'l4', prompt: 'Your portfolio site loads slowly because of huge images. Why does that matter?', hint: 'First impressions.', options: [{ id: 'a', label: 'It doesn’t' }, { id: 'b', label: 'Only on Wi-Fi' }, { id: 'c', label: 'Only for developers' }, { id: 'd', label: 'Reviewers may leave before it loads, and it suggests you don’t sweat details' }], correct: 'd', explanation: 'Your portfolio is a product too.' },
    { id: 'l5', prompt: 'A good case study title is…', hint: 'Outcome-focused.', options: [{ id: 'a', label: '“Cutting payment drop-off for a ride app”' }, { id: 'b', label: '“Project 3”' }, { id: 'c', label: '“Ride app redesign (Figma)”' }, { id: 'd', label: '“My best work!!!”' }], correct: 'a', explanation: 'Say the problem and the result.' },
  ],
};

export const ld2_3: Episode = {
  lessonId: 'ld.2-3',
  hook: '“Design a parking app. You have 45 minutes.” The interviewer isn’t waiting for a perfect sketch. They’re listening to how you think.',
  scene: {
    id: 'whiteboard', duration: 34,
    beats: [
      { at: 0, title: 'The panic start', body: 'A candidate grabs the marker and draws a login screen in the first minute. Wrong problem, nothing to discuss.' },
      { at: 6, title: 'Clarify first', body: 'Who parks? Where? What’s the hardest part today? A few questions turn a vague prompt into a real brief.' },
      { at: 12, title: 'User and goal', body: 'A commuter who needs a spot near the metro by 8:30, every weekday, without circling.' },
      { at: 18, title: 'Ideas, then a choice', body: 'Three quick sketches: reserve ahead, live availability, a monthly pass. Pick one and say why.' },
      { at: 24, title: 'Measure and trade-offs', body: 'Success: time to park under five minutes. Trade-off: reservations add cost, so show the price up front.' },
      { at: 29, title: 'Think out loud', body: 'Clarify, users, ideas, measures. Narrate every step; that’s what’s being assessed.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What went wrong at the start?', options: [{ id: 'a', label: 'They drew screens before understanding the problem' }, { id: 'b', label: 'They asked too many questions' }, { id: 'c', label: 'The marker ran out' }],
      correct: 'a', explanation: 'Clarify before you sketch.' },
    { id: 'c2', prompt: 'What did the candidate do after sketching three ideas?', options: [{ id: 'a', label: 'Drew all three in detail' }, { id: 'b', label: 'Picked one and explained why' }, { id: 'c', label: 'Asked the interviewer to choose' }],
      correct: 'b', explanation: 'Show judgement.' },
  ],
  game: {
    id: 'whiteboard-step', title: 'Run the whiteboard',
    instructions: 'Prompt: “Design an app that helps parents get kids to school on time.” Each card is something a candidate says. Stick it in the right column of the whiteboard.',
    lanes: [
      { id: 'clarify', label: 'Clarify', hint: 'Questions that shape the brief' },
      { id: 'users', label: 'User & goal', hint: 'Who it’s for and what they need' },
      { id: 'ideas', label: 'Ideas', hint: 'Exploring options and choosing one' },
      { id: 'measure', label: 'Measure', hint: 'Success metrics and trade-offs' },
    ],
    cards: [
      { id: 'g1', label: '“Before I start: is this for parents, kids or the school?”', lane: 'clarify' },
      { id: 'g2', label: '“Is this a phone app, or something on a smart speaker?”', lane: 'clarify' },
      { id: 'g3', label: '“The main user is a parent with two kids and a 9 am job.”', lane: 'users' },
      { id: 'g4', label: '“Their goal: leave home by 7:45 without checking anything twice.”', lane: 'users' },
      { id: 'g5', label: '“Let me sketch three ideas quickly, then pick one.”', lane: 'ideas' },
      { id: 'g6', label: '“Option B wins: one glance shows what’s left to do.”', lane: 'ideas' },
      { id: 'g7', label: '“I’d measure on-time departures and how often people reopen the app.”', lane: 'measure' },
      { id: 'g8', label: '“The trade-off: fewer features, but less to read in a rush.”', lane: 'measure' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 11.4,
    prompt: 'The prompt is “Design a parking app.” What do you do first?',
    options: [{ id: 'a', label: 'Draw the home screen' }, { id: 'b', label: 'Ask who parks, where, and what’s hardest today' }, { id: 'c', label: 'Pick a brand colour' }],
    correct: 'b', explanation: 'A few questions turn a vague prompt into a brief you can design for.',
  },
  takeaways: [
    { title: 'Clarify first', body: 'Questions about who, where and the hardest problem.' },
    { title: 'User, ideas, choice', body: 'Define the goal, explore a few options, pick one and say why.' },
    { title: 'Measure and narrate', body: 'Name success metrics and trade-offs, thinking out loud throughout.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'The first step in a whiteboard challenge is…', options: [{ id: 'a', label: 'Clarifying questions' }, { id: 'b', label: 'Drawing screens' }], correct: 'a', explanation: 'Shape the brief.' },
      { id: 'q2', prompt: '“I’d measure on-time departures” is…', options: [{ id: 'a', label: 'Clarify' }, { id: 'b', label: 'Measure' }, { id: 'c', label: 'Ideas' }], correct: 'b', explanation: 'Success metric.' },
      { id: 'q3', prompt: 'Interviewers mostly assess…', options: [{ id: 'a', label: 'Drawing skill' }, { id: 'b', label: 'Speed' }, { id: 'c', label: 'Handwriting' }, { id: 'd', label: 'How you think and decide' }], correct: 'd', explanation: 'Process over pixels.' },
      { id: 'q4', prompt: 'After sketching ideas, you should…', options: [{ id: 'a', label: 'Keep all of them' }, { id: 'b', label: 'Ask them to pick' }, { id: 'c', label: 'Pick one and explain why' }, { id: 'd', label: 'Erase everything' }], correct: 'c', explanation: 'Show judgement.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'You realise halfway through that your idea won’t work. What now?', hint: 'Interviewers like this.', options: [{ id: 'a', label: 'Say so, explain why, and pivot' }, { id: 'b', label: 'Hide it and continue' }, { id: 'c', label: 'Start again silently' }, { id: 'd', label: 'Give up' }], correct: 'a', explanation: 'Changing course with reasons is good design behaviour.' },
    { id: 'l2', prompt: 'How long should clarifying take in a 45-minute challenge?', hint: 'Not too short, not forever.', options: [{ id: 'a', label: '30 seconds' }, { id: 'b', label: 'About 5 minutes' }, { id: 'c', label: '30 minutes' }, { id: 'd', label: 'None' }], correct: 'b', explanation: 'Enough to scope, then move on.' },
    { id: 'l3', prompt: 'What’s a portfolio presentation interview usually looking for?', hint: 'Depth.', options: [{ id: 'a', label: 'Your fastest work' }, { id: 'b', label: 'Your favourite colours' }, { id: 'c', label: 'How you explain decisions, handle questions and reflect on one or two projects' }, { id: 'd', label: 'Every project you’ve done' }], correct: 'c', explanation: 'Go deep on a couple.' },
    { id: 'l4', prompt: 'The interviewer challenges your choice. Best response?', hint: 'Collaborate.', options: [{ id: 'a', label: 'Defend it no matter what' }, { id: 'b', label: 'Immediately agree' }, { id: 'c', label: 'Stay silent' }, { id: 'd', label: 'Explain your reasoning, consider their point, and adjust if it’s better' }], correct: 'd', explanation: 'They’re testing how you handle critique.' },
    { id: 'l5', prompt: 'Which question shows good product sense at the end of an interview?', hint: 'Curiosity about impact.', options: [{ id: 'a', label: '“How does design work with product and engineering here, and how do you measure its impact?”' }, { id: 'b', label: '“How many holidays do I get?” (first question)' }, { id: 'c', label: '“No questions.”' }, { id: 'd', label: '“Did I pass?”' }], correct: 'a', explanation: 'It shows you care about how design creates value.' },
  ],
};
