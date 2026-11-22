// Episodes for chapter st.1 · Product thinking. Drafts by Claude, for review.
import type { Episode } from '../episode';

export const st1_1: Episode = {
  lessonId: 'st.1-1',
  hook: 'Twelve features shipped, zero change. Busy isn’t the same as better.',
  scene: {
    id: 'outcome-output', duration: 34,
    beats: [
      { at: 0, title: 'Shipping isn’t winning', body: 'A team ships feature after feature. The weekly-orders line doesn’t move.' },
      { at: 7, title: 'Start from a problem', body: 'Interviews show it: regulars forget to reorder their usual lunch, then eat elsewhere.' },
      { at: 13, title: 'Name the outcome', body: 'Weekly orders per regular, from 1.2 to 1.6. That’s the change that matters.' },
      { at: 19, title: 'Then choose outputs', body: 'Several ideas could move it: a reorder button, a lunchtime reminder, a weekly plan. Test, don’t guess.' },
      { at: 25, title: 'Watch the outcome', body: 'One output moves the line. The others get dropped without regret.' },
      { at: 29, title: 'Problem → outcome → output', body: 'In that order, every time.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why didn’t twelve features move weekly orders?', options: [{ id: 'a', label: 'They weren’t tied to a problem or an outcome' }, { id: 'b', label: 'They were too small' }, { id: 'c', label: 'The app was too slow' }],
      correct: 'a', explanation: 'Outputs chosen without a target outcome rarely hit it.' },
    { id: 'c2', prompt: 'Which one was the outcome?', options: [{ id: 'a', label: 'A reorder button' }, { id: 'b', label: 'Weekly orders per regular going from 1.2 to 1.6' }, { id: 'c', label: 'Regulars forgetting to reorder' }],
      correct: 'b', explanation: 'An outcome is a measurable change in behaviour.' },
  ],
  game: {
    id: 'rung-sort', title: 'Three rungs',
    instructions: 'Every statement belongs on one rung: the problem people have, the outcome you want, or the output you’d build.',
    lanes: [
      { id: 'problem', label: 'Problem', hint: 'A struggle people have, in their world' },
      { id: 'outcome', label: 'Outcome', hint: 'A measurable change in what people do' },
      { id: 'output', label: 'Output', hint: 'Something the team builds or ships' },
    ],
    cards: [
      { id: 'g1', label: 'Regulars forget to reorder their usual lunch', lane: 'problem' },
      { id: 'g2', label: 'Weekly orders per regular rise from 1.2 to 1.6', lane: 'outcome' },
      { id: 'g3', label: 'A one-tap reorder button', lane: 'output' },
      { id: 'g4', label: 'Checkout feels risky on an unfamiliar site', lane: 'problem' },
      { id: 'g5', label: 'Payment drop-off falls from 40% to 25%', lane: 'outcome' },
      { id: 'g6', label: 'A redesigned onboarding carousel', lane: 'output' },
      { id: 'g7', label: 'New shop owners don’t know how to list products', lane: 'problem' },
      { id: 'g8', label: 'Half of new shops list a product in week one', lane: 'outcome' },
      { id: 'g9', label: 'A lunchtime push notification', lane: 'output' },
    ],
  },
  gap: {
    id: 'gap', from: 13, at: 18.6,
    prompt: 'The outcome is agreed. What’s the next step?',
    options: [{ id: 'a', label: 'Build the reorder button the CEO likes' }, { id: 'b', label: 'List several possible outputs and test which moves the outcome' }, { id: 'c', label: 'Ship all of them at once' }],
    correct: 'b', explanation: 'Several candidate outputs, small tests, and the outcome decides.',
  },
  takeaways: [
    { title: 'Problem first', body: 'Start with a real struggle people have, found in research.' },
    { title: 'Outcome is the goal', body: 'A measurable change in behaviour, like more weekly orders.' },
    { title: 'Outputs are bets', body: 'Features are guesses about how to reach the outcome. Keep the ones that work.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '“A dark-mode toggle” is…', options: [{ id: 'a', label: 'An outcome' }, { id: 'b', label: 'An output' }], correct: 'b', explanation: 'It’s something you build.' },
      { id: 'q2', prompt: '“Drop-off falls from 40% to 25%” is…', options: [{ id: 'a', label: 'An outcome' }, { id: 'b', label: 'A problem' }, { id: 'c', label: 'An output' }], correct: 'a', explanation: 'A measurable change.' },
      { id: 'q3', prompt: 'Which comes first?', options: [{ id: 'a', label: 'Output' }, { id: 'b', label: 'Roadmap' }, { id: 'c', label: 'Problem' }, { id: 'd', label: 'Launch' }], correct: 'c', explanation: 'Problem, then outcome, then output.' },
      { id: 'q4', prompt: 'A good team measures success by…', options: [{ id: 'a', label: 'Features shipped' }, { id: 'b', label: 'Lines of code' }, { id: 'c', label: 'Meetings held' }, { id: 'd', label: 'Outcomes reached' }], correct: 'd', explanation: 'Behaviour change, not activity.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: '“Increase engagement” as an outcome is weak because…', hint: 'Can you measure it next Monday?', options: [{ id: 'a', label: 'It’s vague: which behaviour, by how much?' }, { id: 'b', label: 'Engagement is bad' }, { id: 'c', label: 'It’s too ambitious' }, { id: 'd', label: 'It’s an output' }], correct: 'a', explanation: 'Name the behaviour and the target, e.g. “weekly orders per regular to 1.6”.' },
    { id: 'l2', prompt: 'Who should own the outcome?', hint: 'Not just one function.', options: [{ id: 'a', label: 'Only the CEO' }, { id: 'b', label: 'The whole product team: design, engineering and product together' }, { id: 'c', label: 'Only marketing' }, { id: 'd', label: 'Nobody' }], correct: 'b', explanation: 'Shared outcomes let the team choose the best output, not just the requested one.' },
    { id: 'l3', prompt: 'An output shipped, the outcome didn’t move. Best response?', hint: 'It was a bet.', options: [{ id: 'a', label: 'Ship more features on top' }, { id: 'b', label: 'Change the metric' }, { id: 'c', label: 'Learn why, then remove or rethink the output' }, { id: 'd', label: 'Blame the users' }], correct: 'c', explanation: 'A failed bet is information. Keep the product lean.' },
    { id: 'l4', prompt: 'What’s an “impact” (business result) compared with an outcome?', hint: 'Think one level higher.', options: [{ id: 'a', label: 'The same thing' }, { id: 'b', label: 'A feature' }, { id: 'c', label: 'A problem' }, { id: 'd', label: 'The business result outcomes lead to, like revenue or retention' }], correct: 'd', explanation: 'Outputs → outcomes (behaviour) → impact (business results).' },
    { id: 'l5', prompt: 'A stakeholder asks for a specific feature. Best first question?', hint: 'Find the outcome behind the output.', options: [{ id: 'a', label: '“What would change for customers if we had it?”' }, { id: 'b', label: '“What colour?”' }, { id: 'c', label: '“By when?”' }, { id: 'd', label: '“No.”' }], correct: 'a', explanation: 'Uncover the outcome; there may be a better output for it.' },
  ],
};

export const st1_2: Episode = {
  lessonId: 'st.1-2',
  hook: 'One outcome, many ways to reach it. Draw them before you bet on one.',
  scene: {
    id: 'opportunity-tree', duration: 34,
    beats: [
      { at: 0, title: 'One outcome', body: 'At the top: more weekly orders from regulars.' },
      { at: 6, title: 'Opportunities from research', body: 'Interviews reveal needs: “I forget to reorder”, “Fees feel high for small orders”, “I can’t decide what to eat”.' },
      { at: 13, title: 'Solutions under each', body: 'Each opportunity gets several possible solutions, not just one favourite.' },
      { at: 20, title: 'Experiments under solutions', body: 'Small, cheap tests: a fake-door button, a one-week reminder trial.' },
      { at: 25, title: 'Compare, then choose', body: 'With the whole tree visible, the team picks the most promising branch, and knows what it’s not doing.' },
      { at: 29, title: 'The tree', body: 'Outcome → opportunities → solutions → experiments.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Where did the opportunities come from?', options: [{ id: 'a', label: 'Customer interviews' }, { id: 'b', label: 'Competitors’ apps' }, { id: 'c', label: 'The roadmap' }],
      correct: 'a', explanation: 'Opportunities are customer needs, found in research.' },
    { id: 'c2', prompt: 'What sits directly under a solution?', options: [{ id: 'a', label: 'The outcome' }, { id: 'b', label: 'Another opportunity' }, { id: 'c', label: 'Experiments that test it' }],
      correct: 'c', explanation: 'Small tests check whether a solution works before it’s built fully.' },
  ],
  game: {
    id: 'ost-grow', title: 'Grow the tree',
    instructions: 'The outcome is “more weekly orders from regulars”. Hang each solution under the opportunity it addresses, and watch the tree grow.',
    lanes: [
      { id: 'forget', label: '“I forget to reorder”', hint: 'Help regulars remember' },
      { id: 'fees', label: '“Fees feel high for small orders”', hint: 'Make small orders worth it' },
      { id: 'decide', label: '“I can’t decide what to eat”', hint: 'Make choosing easier' },
    ],
    cards: [
      { id: 'g1', label: 'One-tap reorder on the home screen', lane: 'forget' },
      { id: 'g2', label: 'Free delivery over ₹199', lane: 'fees' },
      { id: 'g3', label: 'A “surprise me” button', lane: 'decide' },
      { id: 'g4', label: 'A lunchtime reminder with your usual', lane: 'forget' },
      { id: 'g5', label: 'Group orders with colleagues to split the fee', lane: 'fees' },
      { id: 'g6', label: 'Today’s top three picks near you', lane: 'decide' },
      { id: 'g7', label: 'A weekly lunch plan you set once', lane: 'forget' },
      { id: 'g8', label: 'A monthly pass with no delivery fees', lane: 'fees' },
    ],
  },
  gap: {
    id: 'gap', from: 13, at: 19.6,
    prompt: 'The tree has solutions. How do you know which one works?',
    options: [{ id: 'a', label: 'Build the biggest one fully' }, { id: 'b', label: 'Run small experiments under each promising solution' }, { id: 'c', label: 'Vote in a meeting' }],
    correct: 'b', explanation: 'Cheap tests first; build only what the evidence supports.',
  },
  takeaways: [
    { title: 'One outcome on top', body: 'Every branch must connect back to the same goal.' },
    { title: 'Opportunities are needs', body: 'They come from customers, not from feature lists.' },
    { title: 'Many solutions, small tests', body: 'Compare options and test cheaply before committing.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'The top of the tree is…', options: [{ id: 'a', label: 'An outcome' }, { id: 'b', label: 'A solution' }], correct: 'a', explanation: 'One measurable goal.' },
      { id: 'q2', prompt: '“I forget to reorder” is…', options: [{ id: 'a', label: 'A solution' }, { id: 'b', label: 'An experiment' }, { id: 'c', label: 'An opportunity' }], correct: 'c', explanation: 'A customer need.' },
      { id: 'q3', prompt: 'A fake-door button test is…', options: [{ id: 'a', label: 'An outcome' }, { id: 'b', label: 'An experiment' }, { id: 'c', label: 'An opportunity' }, { id: 'd', label: 'A roadmap' }], correct: 'b', explanation: 'A cheap test of a solution.' },
      { id: 'q4', prompt: 'Why draw many solutions per opportunity?', options: [{ id: 'a', label: 'To look busy' }, { id: 'b', label: 'Trees must be big' }, { id: 'c', label: 'To fill a slide' }, { id: 'd', label: 'To compare options instead of locking onto the first idea' }], correct: 'd', explanation: 'Comparing beats falling in love with one idea.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'An opportunity phrased as “We need a chatbot” is wrong because…', hint: 'Is that a need or a solution?', options: [{ id: 'a', label: 'It’s a solution disguised as an opportunity' }, { id: 'b', label: 'Chatbots are bad' }, { id: 'c', label: 'It’s too short' }, { id: 'd', label: 'It’s an outcome' }], correct: 'a', explanation: 'Opportunities are written from the customer’s side: “I can’t get quick answers”.' },
    { id: 'l2', prompt: 'How many outcomes should one tree have?', hint: 'Focus.', options: [{ id: 'a', label: 'As many as possible' }, { id: 'b', label: 'One' }, { id: 'c', label: 'Ten' }, { id: 'd', label: 'None' }], correct: 'b', explanation: 'One outcome keeps every branch comparable.' },
    { id: 'l3', prompt: 'Which opportunity should you work on first?', hint: 'Size and evidence.', options: [{ id: 'a', label: 'The one the team finds most fun' }, { id: 'b', label: 'The newest one' }, { id: 'c', label: 'The one that affects the most customers most often, with good evidence' }, { id: 'd', label: 'Any, at random' }], correct: 'c', explanation: 'Size the opportunities, then focus.' },
    { id: 'l4', prompt: 'How often should the tree change?', hint: 'It’s a living document.', options: [{ id: 'a', label: 'Never, once it’s drawn' }, { id: 'b', label: 'Once a year' }, { id: 'c', label: 'Only when the CEO asks' }, { id: 'd', label: 'Continuously, as research and experiments teach you more' }], correct: 'd', explanation: 'New interviews add opportunities; experiments prune solutions.' },
    { id: 'l5', prompt: 'An experiment fails. What happens to the tree?', hint: 'That branch taught you something.', options: [{ id: 'a', label: 'Prune or rethink that solution, and try another branch' }, { id: 'b', label: 'Delete the whole tree' }, { id: 'c', label: 'Change the outcome' }, { id: 'd', label: 'Ignore the result' }], correct: 'a', explanation: 'Failing cheap and early is the point.' },
  ],
};

export const st1_3: Episode = {
  lessonId: 'st.1-3',
  hook: 'When everything is urgent, the loudest voice wins. Unless you score it.',
  scene: {
    id: 'prioritization', duration: 34,
    beats: [
      { at: 0, title: 'Everything is urgent', body: 'Twenty requests in the backlog. Sales, support and the CEO each want theirs first.' },
      { at: 6, title: 'The loudest wins?', body: 'Without a way to compare, the most senior voice decides. Often it’s the wrong call.' },
      { at: 11, title: 'RICE', body: 'Reach × Impact × Confidence ÷ Effort. Four numbers anyone can question.' },
      { at: 18, title: 'Score and sort', body: 'A boring fix to slow checkout outscores the shiny voice search, by a lot.' },
      { at: 23, title: 'Kano: how features feel', body: 'Basics are expected, performance features please more the better they get, delighters surprise.' },
      { at: 29, title: 'Score, then discuss', body: 'Numbers start the conversation; judgment finishes it.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What does the E in RICE do to the score?', options: [{ id: 'a', label: 'More effort lowers the score' }, { id: 'b', label: 'More effort raises it' }, { id: 'c', label: 'Nothing' }],
      correct: 'a', explanation: 'Effort divides: costly ideas need more value to rank high.' },
    { id: 'c2', prompt: 'Why did slow-checkout fix beat voice search?', options: [{ id: 'a', label: 'It was more exciting' }, { id: 'b', label: 'High reach and confidence, low effort' }, { id: 'c', label: 'The CEO asked' }],
      correct: 'b', explanation: 'Boring but certain and cheap often wins.' },
  ],
  game: {
    id: 'rice-duel', title: 'RICE duel',
    instructions: 'Two ideas, four numbers each. Which scores higher on RICE (reach × impact × confidence ÷ effort)? Then see the scores race.',
    lanes: [
      { id: 'a', label: 'Left idea', hint: 'The first idea scores higher' },
      { id: 'b', label: 'Right idea', hint: 'The second idea scores higher' },
    ],
    cards: [
      { id: 'g1', label: 'One-tap reorder vs dark mode', lane: 'a', visual: 'One-tap reorder|4000|2|80|2;Dark mode|6000|0.5|100|3' },
      { id: 'g2', label: 'Group orders vs saved cards', lane: 'b', visual: 'Group orders|1500|3|50|6;Save card for next time|5000|1|80|1' },
      { id: 'g3', label: 'Voice search vs faster checkout', lane: 'b', visual: 'Voice search|8000|1|20|8;Fix slow checkout|8000|2|80|4' },
      { id: 'g4', label: 'Referral credits vs a smaller sign-up form', lane: 'b', visual: 'Referral credits|3000|2|50|3;Shorter sign-up form|9000|1|80|2' },
      { id: 'g5', label: 'Order-tracking map vs a recipe blog', lane: 'a', visual: 'Order-tracking map|7000|2|80|5;Recipe blog|2000|0.5|50|4' },
      { id: 'g6', label: 'Scheduled orders vs loyalty tiers', lane: 'a', visual: 'Scheduled orders|2500|2|80|2;Loyalty tiers|4000|2|50|8' },
    ],
  },
  gap: {
    id: 'gap', from: 11, at: 17.6,
    prompt: 'Voice search: huge reach, but low confidence and 8 weeks of work. Checkout fix: same reach, high confidence, 4 weeks. Which ranks higher?',
    options: [{ id: 'a', label: 'Voice search, it’s more exciting' }, { id: 'b', label: 'The checkout fix' }, { id: 'c', label: 'They tie' }],
    correct: 'b', explanation: 'Confidence multiplies and effort divides. Certain and cheap beats exciting and uncertain.',
  },
  takeaways: [
    { title: 'RICE', body: 'Reach × Impact × Confidence ÷ Effort turns opinions into numbers you can question.' },
    { title: 'Confidence counts', body: 'A bold guess with little evidence should score lower than a sure thing.' },
    { title: 'Kano for feelings', body: 'Basics prevent anger, performance features add value, delighters create love.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'In RICE, effort…', options: [{ id: 'a', label: 'Divides the score' }, { id: 'b', label: 'Multiplies the score' }], correct: 'a', explanation: 'Costly ideas need more value.' },
      { id: 'q2', prompt: '1,000 reach × 1 impact × 100% ÷ 1 effort =', options: [{ id: 'a', label: '100' }, { id: 'b', label: '10' }, { id: 'c', label: '1,000' }], correct: 'c', explanation: '1,000 × 1 × 1 ÷ 1.' },
      { id: 'q3', prompt: 'In Kano, a working login is…', options: [{ id: 'a', label: 'A delighter' }, { id: 'b', label: 'A basic' }, { id: 'c', label: 'A performance feature' }, { id: 'd', label: 'Not a feature' }], correct: 'b', explanation: 'Expected; only noticed when broken.' },
      { id: 'q4', prompt: 'A surprise birthday treat is…', options: [{ id: 'a', label: 'A basic' }, { id: 'b', label: 'A bug' }, { id: 'c', label: 'Effort' }, { id: 'd', label: 'A delighter' }], correct: 'd', explanation: 'Unexpected joy.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why include confidence in the score?', hint: 'Not all estimates are equal.', options: [{ id: 'a', label: 'It discounts ideas built on guesses rather than evidence' }, { id: 'b', label: 'It makes maths harder' }, { id: 'c', label: 'To favour the CEO' }, { id: 'd', label: 'No reason' }], correct: 'a', explanation: 'Low evidence, lower score, until research raises confidence.' },
    { id: 'l2', prompt: 'Should you follow RICE scores blindly?', hint: 'A tool, not a judge.', options: [{ id: 'a', label: 'Yes, always' }, { id: 'b', label: 'No: use them to start the discussion and check strategy, dependencies and risk' }, { id: 'c', label: 'Only for small teams' }, { id: 'd', label: 'Only in Q4' }], correct: 'b', explanation: 'Scores frame the debate; judgment decides.' },
    { id: 'l3', prompt: 'Over time, what happens to Kano delighters?', hint: 'Remember when free delivery was a surprise?', options: [{ id: 'a', label: 'They stay delighters forever' }, { id: 'b', label: 'They disappear' }, { id: 'c', label: 'They become expected, drifting toward basics' }, { id: 'd', label: 'They turn into bugs' }], correct: 'c', explanation: 'Yesterday’s delight is today’s expectation.' },
    { id: 'l4', prompt: 'A basic feature is broken, and a delighter is ready to ship. Which first?', hint: 'What makes people angry?', options: [{ id: 'a', label: 'The delighter, it’s more fun' }, { id: 'b', label: 'Both at once, half-done' }, { id: 'c', label: 'Neither' }, { id: 'd', label: 'Fix the basic: missing basics cause anger no delight can offset' }], correct: 'd', explanation: 'Basics first. Delight on a broken base feels hollow.' },
    { id: 'l5', prompt: 'Teams inflate impact scores for their pet ideas. A good guard?', hint: 'Make it shared.', options: [{ id: 'a', label: 'Score together using a shared impact scale (e.g. 3 massive, 2 high, 1 medium, 0.5 low)' }, { id: 'b', label: 'Let each person score alone' }, { id: 'c', label: 'Remove impact' }, { id: 'd', label: 'Only the CEO scores' }], correct: 'a', explanation: 'A fixed scale and scoring as a group keep numbers honest.' },
  ],
};
