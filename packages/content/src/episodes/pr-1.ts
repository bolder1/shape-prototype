// Episodes for chapter pr.1 · Prototyping. Drafts by Claude, for review.
import type { Episode } from '../episode';

export const pr1_1: Episode = {
  lessonId: 'pr.1-1',
  hook: 'Three days polishing a prototype to answer a question a pencil could have answered by lunch. Fidelity is a price; pay only what the question needs.',
  scene: {
    id: 'fidelity', duration: 34,
    beats: [
      { at: 0, title: 'Three days, one simple question', body: 'A team polishes a pixel-perfect prototype to ask “which layout is clearer?”. Testers talk about the colours.' },
      { at: 6, title: 'Paper', body: 'Five layout sketches in thirty minutes. Cheap to make, cheap to throw away. Perfect for exploring.' },
      { at: 12, title: 'Clickable wireframe', body: 'Grey boxes linked together in an hour or two. Enough to test whether people can find their way.' },
      { at: 18, title: 'High fidelity', body: 'Real colours, type and copy over a few days. Needed when the question is about trust, feel or the brand.' },
      { at: 24, title: 'Coded', body: 'A week or more, with real data and real gestures. For questions only the real thing can answer.' },
      { at: 29, title: 'The lowest rung that answers it', body: 'Each step up costs more and changes the feedback. Climb only as high as the question needs.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the polished prototype backfire?', options: [{ id: 'a', label: 'It cost days, and testers commented on colours instead of layouts' }, { id: 'b', label: 'It had bugs' }, { id: 'c', label: 'It was too fast' }],
      correct: 'a', explanation: 'Polish costs time and pulls feedback towards surface details.' },
    { id: 'c2', prompt: 'When do you need high fidelity?', options: [{ id: 'a', label: 'Always, from day one' }, { id: 'b', label: 'When the question is about trust, feel or brand' }, { id: 'c', label: 'Never' }],
      correct: 'b', explanation: 'Some questions only real visuals can answer.' },
  ],
  game: {
    id: 'fidelity-pick', title: 'Pick the rung',
    instructions: 'Each card is a question a team wants answered. Pick the lowest fidelity that can answer it. Too high wastes days; too low can’t answer it.',
    lanes: [
      { id: 'paper', label: 'Paper', hint: 'Sketches · about 30 minutes' },
      { id: 'wire', label: 'Clickable wireframe', hint: 'Grey boxes linked up · a few hours' },
      { id: 'hifi', label: 'High fidelity', hint: 'Real visuals and copy · a few days' },
      { id: 'code', label: 'Coded', hint: 'Real data and gestures · a week or more' },
    ],
    cards: [
      { id: 'g1', label: 'Explore five layout ideas for the home screen this afternoon', lane: 'paper' },
      { id: 'g2', label: 'Can people find “Cancel order” in the navigation?', lane: 'wire' },
      { id: 'g3', label: 'Does the new checkout feel trustworthy enough to pay?', lane: 'hifi' },
      { id: 'g4', label: 'Does a swipe-to-reorder gesture feel right on a real phone?', lane: 'code' },
      { id: 'g5', label: 'Sketch ideas with the team in a 30-minute workshop', lane: 'paper' },
      { id: 'g6', label: 'Can first-time users get through a six-screen sign-up?', lane: 'wire' },
      { id: 'g7', label: 'Which of two visual styles better fits the brand refresh?', lane: 'hifi' },
      { id: 'g8', label: 'Are search results useful across thousands of real products?', lane: 'code' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.6,
    prompt: 'The team wants to compare five layout ideas today. Which fidelity?',
    options: [{ id: 'a', label: 'A polished prototype of each' }, { id: 'b', label: 'Paper sketches' }, { id: 'c', label: 'Build all five in code' }],
    correct: 'b', explanation: 'Paper is fast enough to explore many ideas and cheap enough to throw most away.',
  },
  takeaways: [
    { title: 'Fidelity costs', body: 'Paper takes minutes, wireframes hours, polished prototypes days, code weeks.' },
    { title: 'Feedback follows fidelity', body: 'Polish invites comments on colours; rough sketches invite comments on ideas.' },
    { title: 'Lowest rung that answers', body: 'Match the fidelity to the question, not to how impressive it looks.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'Fastest way to explore many ideas?', options: [{ id: 'a', label: 'Paper' }, { id: 'b', label: 'Code' }], correct: 'a', explanation: 'Minutes, not days.' },
      { id: 'q2', prompt: 'Testing whether people can find a menu item needs…', options: [{ id: 'a', label: 'Final visuals' }, { id: 'b', label: 'A clickable wireframe' }, { id: 'c', label: 'A coded app' }], correct: 'b', explanation: 'Structure, not polish.' },
      { id: 'q3', prompt: 'Testing a gesture with real data needs…', options: [{ id: 'a', label: 'Paper' }, { id: 'b', label: 'A wireframe' }, { id: 'c', label: 'A slide deck' }, { id: 'd', label: 'A coded prototype' }], correct: 'd', explanation: 'Only the real thing behaves like it.' },
      { id: 'q4', prompt: 'Polished prototypes tend to get feedback on…', options: [{ id: 'a', label: 'The core idea' }, { id: 'b', label: 'Navigation only' }, { id: 'c', label: 'Surface details like colour' }, { id: 'd', label: 'Nothing' }], correct: 'c', explanation: 'Polish pulls attention to the surface.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What is “Wizard of Oz” prototyping?', hint: 'A person behind the curtain.', options: [{ id: 'a', label: 'A human secretly performs what the system would do, so you can test before building' }, { id: 'b', label: 'A magic-themed design' }, { id: 'c', label: 'A coded prototype' }, { id: 'd', label: 'Testing with children' }], correct: 'a', explanation: 'Great for testing AI or automation ideas cheaply.' },
    { id: 'l2', prompt: 'Fidelity has several dimensions. Which pair can you mix?', hint: 'Looks vs. behaviour.', options: [{ id: 'a', label: 'None, fidelity is one dial' }, { id: 'b', label: 'Low visual fidelity with high interaction fidelity, or the reverse' }, { id: 'c', label: 'Only colour and font' }, { id: 'd', label: 'Only paper and code' }], correct: 'b', explanation: 'A grey wireframe can still have realistic interactions, and a static mockup can look final.' },
    { id: 'l3', prompt: 'Why can rough prototypes get more honest feedback?', hint: 'How hard does it look to change?', options: [{ id: 'a', label: 'People can’t see them well' }, { id: 'b', label: 'They’re shorter' }, { id: 'c', label: 'They look unfinished, so people feel free to criticise' }, { id: 'd', label: 'They’re free' }], correct: 'c', explanation: 'Polish signals “done”, and people hold back.' },
    { id: 'l4', prompt: 'A stakeholder wants a polished prototype “to show the board”. What’s the risk?', hint: 'What does polish promise?', options: [{ id: 'a', label: 'None' }, { id: 'b', label: 'It loads slowly' }, { id: 'c', label: 'Boards dislike colour' }, { id: 'd', label: 'It can look finished and lock decisions before they’re tested' }], correct: 'd', explanation: 'Be clear it’s a concept, and test the risky parts first.' },
    { id: 'l5', prompt: 'Your clickable wireframe test went well. Next step?', hint: 'Climb only when needed.', options: [{ id: 'a', label: 'Move up a rung only for the questions that need it, like trust or feel' }, { id: 'b', label: 'Ship it as is' }, { id: 'c', label: 'Go straight to code for everything' }, { id: 'd', label: 'Start again on paper' }], correct: 'a', explanation: 'Raise fidelity question by question.' },
  ],
};

export const pr1_2: Episode = {
  lessonId: 'pr.1-2',
  hook: 'A 40-screen prototype got “looks great!” from everyone and taught the team nothing. Four screens and one question would have.',
  scene: {
    id: 'question-proto', duration: 34,
    beats: [
      { at: 0, title: 'The demo', body: 'Forty screens, every feature linked up. It took two weeks.' },
      { at: 6, title: '“Looks great!”', body: 'Testers wander around and say nice things. The team learns nothing it can act on.' },
      { at: 12, title: 'Write the question', body: '“Can first-time users change the delivery address after ordering, without help?”' },
      { at: 17, title: 'Cut to the path', body: 'Only four screens are on that path. Everything else fades away.' },
      { at: 23, title: 'A clear answer', body: 'Five testers try the task. Three can’t find “Change address”. Now the team knows exactly what to fix.' },
      { at: 29, title: 'Questions, not demos', body: 'One question, the screens on its path, and a task that shows the answer.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the demo teach nothing?', options: [{ id: 'a', label: 'It had no question, so feedback was vague praise' }, { id: 'b', label: 'It was too short' }, { id: 'c', label: 'It had no colours' }],
      correct: 'a', explanation: 'Without a question there’s nothing specific to learn.' },
    { id: 'c2', prompt: 'How many screens did the focused prototype need?', options: [{ id: 'a', label: 'All forty' }, { id: 'b', label: 'Four, on the question’s path' }, { id: 'c', label: 'One' }],
      correct: 'b', explanation: 'Only the path the task uses.' },
  ],
  game: {
    id: 'proto-scope', title: 'Scope the prototype',
    instructions: 'First, forge a question a prototype can answer. Then keep only the screens on that question’s path.',
    lanes: [
      { id: 'cut', label: 'Skip it', hint: 'Not on the path the question tests' },
      { id: 'keep', label: 'Build it', hint: 'The task passes through this screen' },
    ],
    cards: [
      { id: 'g1', label: 'Order confirmation', lane: 'keep', note: 'The task starts right after ordering.' },
      { id: 'g2', label: 'Order tracking with a “Change address” option', lane: 'keep', note: 'This is where people must find the option.' },
      { id: 'g3', label: 'Address picker', lane: 'keep', note: 'Where they choose the new address.' },
      { id: 'g4', label: 'Tracking updated with the new address', lane: 'keep', note: 'Shows whether they believe it worked.' },
      { id: 'g5', label: 'Login screen', lane: 'cut', note: 'Start the test already logged in.' },
      { id: 'g6', label: 'Restaurant menu', lane: 'cut', note: 'The order is already placed when the task begins.' },
      { id: 'g7', label: 'Onboarding carousel', lane: 'cut', note: 'Nothing to do with changing an address.' },
      { id: 'g8', label: 'Payment methods', lane: 'cut', note: 'Payment isn’t part of the task.' },
      { id: 'g9', label: 'Rate your order', lane: 'cut', note: 'Comes after delivery, long after the task.' },
    ],
    rounds: [
      { id: 'r1', prompt: 'Forge a question the address prototype can answer',
        answer: ['Can first-time users', 'change the delivery address', 'after ordering,', 'without help?'],
        distractors: ['love the new design', 'see every feature', 'in under a second'],
        weak: ['Do people love the new design?', 'Can users see every feature of the app?'] },
    ],
  },
  gap: {
    id: 'gap', from: 12, at: 16,
    prompt: 'The question is about changing the delivery address. Which screens do you build?',
    options: [{ id: 'a', label: 'All forty, to be safe' }, { id: 'b', label: 'Only the screens on that task’s path' }, { id: 'c', label: 'Just the home screen' }],
    correct: 'b', explanation: 'Build the path the task walks, nothing more.',
  },
  takeaways: [
    { title: 'Write the question first', body: 'Who, what task, and how you’ll know whether it worked.' },
    { title: 'Build only the path', body: 'Every screen off the path is effort with no answer attached.' },
    { title: 'Give a task, watch', body: 'Ask people to do the task, not to tour the prototype.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A prototype should start from…', options: [{ id: 'a', label: 'A question' }, { id: 'b', label: 'A feature list' }], correct: 'a', explanation: 'What do we need to learn?' },
      { id: 'q2', prompt: '“Do people like it?” is…', options: [{ id: 'a', label: 'A sharp question' }, { id: 'b', label: 'Too vague to act on' }, { id: 'c', label: 'Required' }], correct: 'b', explanation: 'Name a task and a signal instead.' },
      { id: 'q3', prompt: 'Screens off the task’s path should be…', options: [{ id: 'a', label: 'Polished' }, { id: 'b', label: 'Doubled' }, { id: 'c', label: 'Coded' }, { id: 'd', label: 'Left out' }], correct: 'd', explanation: 'No answer attached.' },
      { id: 'q4', prompt: 'In the test you should…', options: [{ id: 'a', label: 'Give a tour' }, { id: 'b', label: 'Explain every screen' }, { id: 'c', label: 'Give a task and watch' }, { id: 'd', label: 'Ask what they’d change' }], correct: 'c', explanation: 'Behaviour beats opinions.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What makes a prototype question testable?', hint: 'You need to recognise success.', options: [{ id: 'a', label: 'It names who, the task, and a signal of success' }, { id: 'b', label: 'It’s long' }, { id: 'c', label: 'It mentions the brand' }, { id: 'd', label: 'It’s yes/no about liking' }], correct: 'a', explanation: 'E.g. “first-time users”, “change address”, “without help”.' },
    { id: 'l2', prompt: 'Your prototype hits a dead end if a tester clicks off the path. What do you do?', hint: 'Plan for it.', options: [{ id: 'a', label: 'Build all screens' }, { id: 'b', label: 'Add a gentle “not part of this test” screen and steer back' }, { id: 'c', label: 'Stop the test' }, { id: 'd', label: 'Hide the menu' }], correct: 'b', explanation: 'A placeholder keeps the session going without building everything.' },
    { id: 'l3', prompt: 'Can one prototype answer two questions?', hint: 'Watch the scope.', options: [{ id: 'a', label: 'Never' }, { id: 'b', label: 'Always ten or more' }, { id: 'c', label: 'Sometimes, if they share a path; otherwise build two small ones' }, { id: 'd', label: 'Only in code' }], correct: 'c', explanation: 'Keep each question’s path clear.' },
    { id: 'l4', prompt: 'Three of five testers can’t find “Change address”. What’s the next step?', hint: 'The prototype did its job.', options: [{ id: 'a', label: 'Ship anyway' }, { id: 'b', label: 'Test with 50 more people first' }, { id: 'c', label: 'Blame the testers' }, { id: 'd', label: 'Change where the option lives and test the new version' }], correct: 'd', explanation: 'Iterate on the answer, then re-test.' },
    { id: 'l5', prompt: 'Why use realistic content (real addresses, real names) even in a low-fi prototype?', hint: 'Lorem ipsum hides problems.', options: [{ id: 'a', label: 'Testers react to real situations, and real content shows layout problems' }, { id: 'b', label: 'It looks nicer' }, { id: 'c', label: 'It’s required by Figma' }, { id: 'd', label: 'It doesn’t matter' }], correct: 'a', explanation: 'Real content makes tasks believable.' },
  ],
};

export const pr1_3: Episode = {
  lessonId: 'pr.1-3',
  hook: 'Two static frames become something you can tap through in under a minute. It all comes down to three settings: trigger, action, animation.',
  scene: {
    id: 'proto-links', duration: 34,
    beats: [
      { at: 0, title: 'Two frames', body: 'A product list and a product page. Right now they’re just pictures.' },
      { at: 5, title: 'Pick a hotspot', body: 'Select the product card. That’s where the interaction starts.' },
      { at: 10, title: 'Draw the connection', body: 'Drag the connection from the card to the product page frame.' },
      { at: 15, title: 'Trigger, action, animation', body: 'On tap → Navigate to → Smart animate, 300 ms. Three choices define the whole interaction.' },
      { at: 20, title: 'Overlays', body: 'The Filters button opens a sheet over the list instead of replacing it: Open overlay.' },
      { at: 25, title: 'Press play', body: 'Set a starting frame and click through it, just like the real app.' },
      { at: 29, title: 'Frames + connections', body: 'Hotspot, trigger, action, animation. That’s a prototype.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Where does a connection start?', options: [{ id: 'a', label: 'At a hotspot, like a button' }, { id: 'b', label: 'In the layers panel' }, { id: 'c', label: 'At the canvas edge' }],
      correct: 'a', explanation: 'The element people tap.' },
    { id: 'c2', prompt: 'Which action shows the filter sheet over the list?', options: [{ id: 'a', label: 'Navigate to' }, { id: 'b', label: 'Back' }, { id: 'c', label: 'Open overlay' }],
      correct: 'c', explanation: 'Overlays sit on top of the current frame.' },
  ],
  game: {
    id: 'wire-flow', title: 'Wire the flow',
    instructions: 'Each card is an interaction in a shopping app. Pick the Figma action that builds it, and the mini prototype plays it back.',
    lanes: [
      { id: 'navigate', label: 'Navigate to', hint: 'Go to another frame' },
      { id: 'overlay', label: 'Open overlay', hint: 'Show a frame on top of this one' },
      { id: 'back', label: 'Back', hint: 'Return to the previous frame' },
      { id: 'change', label: 'Change to', hint: 'Switch a component to another variant' },
    ],
    cards: [
      { id: 'g1', label: 'Tap a product card → open the product page', lane: 'navigate' },
      { id: 'g2', label: 'Tap “Filters” → a filter sheet slides up over the list', lane: 'overlay' },
      { id: 'g3', label: 'Tap the ← arrow on the product page', lane: 'back' },
      { id: 'g4', label: 'Tap a toggle → it switches on', lane: 'change' },
      { id: 'g5', label: 'Tap “Delete” → a confirm dialog appears on top', lane: 'overlay' },
      { id: 'g6', label: 'Tap “Checkout” → go to the checkout screen', lane: 'navigate' },
      { id: 'g7', label: 'Tap “Done” after editing → return to where you were', lane: 'back' },
      { id: 'g8', label: 'Tap the heart icon → it fills in', lane: 'change' },
    ],
  },
  gap: {
    id: 'gap', from: 15, at: 19.6,
    prompt: 'The Filters button should bring up a sheet over the list, not a new screen. Which action?',
    options: [{ id: 'a', label: 'Open overlay' }, { id: 'b', label: 'Navigate to' }, { id: 'c', label: 'Back' }],
    correct: 'a', explanation: 'Overlays keep the list underneath, like a real bottom sheet.',
  },
  takeaways: [
    { title: 'Hotspot to frame', body: 'Connections run from the element people tap to where they go.' },
    { title: 'Trigger · action · animation', body: 'On tap, navigate to, smart animate: three choices per interaction.' },
    { title: 'Overlays and variants', body: 'Sheets and dialogs are overlays; toggles and hearts change component variants.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A bottom sheet uses…', options: [{ id: 'a', label: 'Open overlay' }, { id: 'b', label: 'Navigate to' }], correct: 'a', explanation: 'On top of the current frame.' },
      { id: 'q2', prompt: 'The ← arrow uses…', options: [{ id: 'a', label: 'Navigate to' }, { id: 'b', label: 'Back' }, { id: 'c', label: 'Change to' }], correct: 'b', explanation: 'Return to the previous frame.' },
      { id: 'q3', prompt: '“On tap” is a…', options: [{ id: 'a', label: 'Action' }, { id: 'b', label: 'Animation' }, { id: 'c', label: 'Frame' }, { id: 'd', label: 'Trigger' }], correct: 'd', explanation: 'What starts the interaction.' },
      { id: 'q4', prompt: 'A toggle switching on uses…', options: [{ id: 'a', label: 'Open overlay' }, { id: 'b', label: 'Back' }, { id: 'c', label: 'Change to a variant' }, { id: 'd', label: 'Open link' }], correct: 'c', explanation: 'Component variants handle states.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What does Smart animate do?', hint: 'Matching layers.', options: [{ id: 'a', label: 'Animates layers with the same name between two frames' }, { id: 'b', label: 'Adds sound' }, { id: 'c', label: 'Writes code' }, { id: 'd', label: 'Picks colours' }], correct: 'a', explanation: 'Name layers consistently and Figma tweens their changes.' },
    { id: 'l2', prompt: 'Which trigger fits a splash screen that moves on by itself?', hint: 'No tap needed.', options: [{ id: 'a', label: 'On tap' }, { id: 'b', label: 'After delay' }, { id: 'c', label: 'While hovering' }, { id: 'd', label: 'On drag' }], correct: 'b', explanation: 'After delay advances automatically.' },
    { id: 'l3', prompt: 'Why use interactive components for a toggle instead of two frames?', hint: 'Think of reuse.', options: [{ id: 'a', label: 'They look nicer' }, { id: 'b', label: 'Figma requires it' }, { id: 'c', label: 'Every instance works anywhere, without wiring a frame per state' }, { id: 'd', label: 'They export to code' }], correct: 'c', explanation: 'Wire the variants once in the component.' },
    { id: 'l4', prompt: 'A long page should scroll inside the phone frame while the header stays put. What do you set?', hint: 'Overflow and fixed elements.', options: [{ id: 'a', label: 'Make it taller only' }, { id: 'b', label: 'Use Back' }, { id: 'c', label: 'An overlay' }, { id: 'd', label: 'Vertical scrolling on the frame, and fix the header’s position' }], correct: 'd', explanation: 'Scroll behaviour plus fixed position mimics a real app.' },
    { id: 'l5', prompt: 'Before a test, why set a flow starting point and test it yourself?', hint: 'Dead ends embarrass.', options: [{ id: 'a', label: 'To make sure testers start in the right place and every task path works' }, { id: 'b', label: 'Figma charges otherwise' }, { id: 'c', label: 'It improves colours' }, { id: 'd', label: 'It isn’t needed' }], correct: 'a', explanation: 'Click every path before a tester does.' },
  ],
};
