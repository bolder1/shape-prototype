// Episodes for chapter rs.1 · Research basics. Drafts by Claude, for review.
import type { Episode } from '../episode';

export const rs1_1: Episode = {
  lessonId: 'rs.1-1',
  hook: 'Sometimes you explore in the dark. Sometimes you check what you built. Know which one you’re doing.',
  scene: {
    id: 'explore-check', duration: 34,
    beats: [
      { at: 0, title: 'A hunch, no product', body: 'Freelancers seem to struggle with taxes. But how, exactly? Nobody knows yet.' },
      { at: 4, title: 'Generative: explore', body: 'Interviews and shadowing light up the unknown. You discover problems you didn’t know to ask about.' },
      { at: 15, title: 'Now there’s a prototype', body: 'A tax-reminder app, sketched from what you learned.' },
      { at: 18, title: 'Evaluative: check', body: 'Usability tests check the thing you built: can people actually do the tasks?' },
      { at: 28, title: 'Explore, then check', body: 'Generative tells you what to build. Evaluative tells you if it works.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'With only a hunch and no product, what kind of research came first?', options: [{ id: 'a', label: 'Generative: exploring the problem' }, { id: 'b', label: 'Evaluative: testing a design' }, { id: 'c', label: 'An A/B test' }],
      correct: 'a', explanation: 'With nothing built, there’s nothing to evaluate. Explore first.' },
    { id: 'c2', prompt: 'What did the usability test tell the team?', options: [{ id: 'a', label: 'What freelancers dream about' }, { id: 'b', label: 'Whether people could complete the tasks in the prototype' }, { id: 'c', label: 'How big the market is' }],
      correct: 'b', explanation: 'Evaluative research checks a specific design against real use.' },
  ],
  game: {
    id: 'flashlight', title: 'Flashlight',
    instructions: 'Research methods are hidden in the dark. Move your light to find each one, then decide: does it explore or check?',
    lanes: [
      { id: 'gen', label: 'Explore', hint: 'Generative: discovers needs and problems before there’s a design' },
      { id: 'eval', label: 'Check', hint: 'Evaluative: tests a specific design or idea' },
    ],
    cards: [
      { id: 'g1', label: 'Shadowing a shop owner for a day', lane: 'gen' },
      { id: 'g2', label: 'Usability test of a new checkout', lane: 'eval' },
      { id: 'g3', label: 'Interviews about how families plan trips', lane: 'gen' },
      { id: 'g4', label: 'A/B test of two headlines', lane: 'eval' },
      { id: 'g5', label: 'A diary study of a week of commuting', lane: 'gen' },
      { id: 'g6', label: 'Five-second test of a landing page', lane: 'eval' },
      { id: 'g7', label: 'Visiting freelancers at their desks', lane: 'gen' },
      { id: 'g8', label: 'Testing whether people find the new menu', lane: 'eval' },
    ],
  },
  gap: {
    id: 'gap', from: 15, at: 17.6,
    prompt: 'The team now has a prototype tax-reminder app. What research fits best?',
    options: [{ id: 'a', label: 'More open interviews about life as a freelancer' }, { id: 'b', label: 'A usability test of the prototype' }, { id: 'c', label: 'A market-size survey' }],
    correct: 'b', explanation: 'Once there’s a design, check it: can real people use it to do what it promises?',
  },
  takeaways: [
    { title: 'Explore before you build', body: 'Generative research finds the problems worth solving.' },
    { title: 'Check what you built', body: 'Evaluative research tests a specific design with real people.' },
    { title: 'Match the moment', body: 'No design yet? Explore. Have a design? Check it.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A diary study of a week of commuting is…', options: [{ id: 'a', label: 'Generative' }, { id: 'b', label: 'Evaluative' }], correct: 'a', explanation: 'It explores real life, not a design.' },
      { id: 'q2', prompt: 'Testing a new checkout with 5 people is…', options: [{ id: 'a', label: 'Generative' }, { id: 'b', label: 'Evaluative' }], correct: 'b', explanation: 'It checks a specific design.' },
      { id: 'q3', prompt: 'You have only a hunch. Start with…', options: [{ id: 'a', label: 'A/B test' }, { id: 'b', label: 'Usability test' }, { id: 'c', label: 'Generative interviews' }, { id: 'd', label: 'Analytics' }], correct: 'c', explanation: 'Explore the problem before designing.' },
      { id: 'q4', prompt: 'Generative research mostly answers…', options: [{ id: 'a', label: 'Does this button work?' }, { id: 'b', label: 'Which headline wins?' }, { id: 'c', label: 'Is it fast?' }, { id: 'd', label: 'What problems do people have?' }], correct: 'd', explanation: 'It discovers needs and problems.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Evaluative research needs…', hint: 'You can’t check nothing.', options: [{ id: 'a', label: 'Something to evaluate, like a design or prototype' }, { id: 'b', label: 'A big budget' }, { id: 'c', label: 'A finished product only' }, { id: 'd', label: 'No users' }], correct: 'a', explanation: 'Even a paper sketch can be evaluated.' },
    { id: 'l2', prompt: 'Which is generative?', hint: 'No design involved.', options: [{ id: 'a', label: 'A/B test' }, { id: 'b', label: 'Usability test' }, { id: 'c', label: 'Contextual inquiry at people’s workplaces' }, { id: 'd', label: 'First-click test' }], correct: 'c', explanation: 'Watching people in their real context explores needs.' },
    { id: 'l3', prompt: 'A team runs only usability tests for a year. What might they miss?', hint: 'They only check what they already built.', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'Bigger problems and opportunities nobody designed for' }, { id: 'c', label: 'Typos' }, { id: 'd', label: 'Speed' }], correct: 'b', explanation: 'Evaluative research only sees what’s on the screen. Generative finds what isn’t.' },
    { id: 'l4', prompt: 'Can one study be both?', hint: 'Think about a session with two halves.', options: [{ id: 'a', label: 'Never' }, { id: 'b', label: 'Yes: e.g. open questions first, then a quick prototype test' }, { id: 'c', label: 'Only online' }, { id: 'd', label: 'Only with 100+ people' }], correct: 'b', explanation: 'Many sessions start exploratory and end with a quick evaluation.' },
    { id: 'l5', prompt: 'Why can testing an idea too early be risky?', hint: 'What are you comparing against?', options: [{ id: 'a', label: 'You may polish a solution to the wrong problem' }, { id: 'b', label: 'Users get bored' }, { id: 'c', label: 'Tests are illegal early' }, { id: 'd', label: 'It’s expensive to test paper' }], correct: 'a', explanation: 'Without exploring first, you can perfect something nobody needed.' },
  ],
};

export const rs1_2: Episode = {
  lessonId: 'rs.1-2',
  hook: 'Numbers tell you where. Stories tell you why. Each one lies when used alone.',
  scene: {
    id: 'qual-quant', duration: 34,
    beats: [
      { at: 0, title: 'The numbers', body: '60% of people drop off on the payment page. That’s where. But not why.' },
      { at: 8, title: 'The stories', body: 'Five interviews reveal it: people didn’t trust the card form on an unfamiliar site.' },
      { at: 15, title: 'Where numbers lie', body: 'A spike in clicks looks like love. Interviews show people were lost.' },
      { at: 21, title: 'Where stories lie', body: '“3 of 5 loved it” becomes “60% of users want it”. Five people can’t be a percentage.' },
      { at: 28, title: 'Use both', body: 'Quant shows the size and place of a problem. Qual explains it.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What did the 60% drop-off number tell the team?', options: [{ id: 'a', label: 'Exactly why people leave' }, { id: 'b', label: 'Where the problem is, but not why' }, { id: 'c', label: 'That the price is too high' }],
      correct: 'b', explanation: 'Quant points at the spot. You need qual to understand it.' },
    { id: 'c2', prompt: 'What was wrong with “60% of users want it”?', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'It came from just five interviews' }, { id: 'c', label: 'It should be 70%' }],
      correct: 'b', explanation: 'Five people show you reasons and patterns, not percentages.' },
  ],
  game: {
    id: 'scale-sort', title: 'The scale',
    instructions: 'Each question drops in. Send it to the pan that answers it: Why (qualitative) or How many (quantitative).',
    lanes: [
      { id: 'ql', label: 'Why', hint: 'Qualitative: interviews and observation explain reasons and feelings' },
      { id: 'qn', label: 'How many', hint: 'Quantitative: analytics and surveys measure how much and how often' },
    ],
    cards: [
      { id: 'g1', label: 'Why do people abandon their cart?', lane: 'ql' },
      { id: 'g2', label: 'How many people use the search?', lane: 'qn' },
      { id: 'g3', label: 'What does planning a wedding feel like?', lane: 'ql' },
      { id: 'g4', label: 'Did the new layout raise sign-ups?', lane: 'qn' },
      { id: 'g5', label: 'What confuses people about our pricing?', lane: 'ql' },
      { id: 'g6', label: 'Which step loses the most users?', lane: 'qn' },
      { id: 'g7', label: 'How do nurses decide what to check first?', lane: 'ql' },
      { id: 'g8', label: 'What share of visitors come from mobile?', lane: 'qn' },
    ],
  },
  gap: {
    id: 'gap', from: 0, at: 7.6,
    prompt: 'You know 60% drop off at payment. How do you find out why?',
    options: [{ id: 'a', label: 'Look harder at the same chart' }, { id: 'b', label: 'Watch and talk to a handful of people as they pay' }, { id: 'c', label: 'Guess and redesign' }],
    correct: 'b', explanation: 'Numbers can’t explain themselves. A few interviews or observed sessions reveal the reasons.',
  },
  takeaways: [
    { title: 'Quant: where and how much', body: 'Analytics and surveys size the problem and point at it.' },
    { title: 'Qual: why', body: 'Interviews and observation explain behaviour and feelings.' },
    { title: 'Don’t mix them up', body: 'Don’t turn 5 interviews into percentages, or read reasons into a chart.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '“Which step loses the most users?” needs…', options: [{ id: 'a', label: 'Qual' }, { id: 'b', label: 'Quant' }], correct: 'b', explanation: 'It’s a how-many question.' },
      { id: 'q2', prompt: '“Why don’t people trust our form?” needs…', options: [{ id: 'a', label: 'Qual' }, { id: 'b', label: 'Quant' }], correct: 'a', explanation: 'It’s a why question.' },
      { id: 'q3', prompt: '3 of 5 interviewees liked it. You can say…', options: [{ id: 'a', label: '60% of users like it' }, { id: 'b', label: 'Most users like it' }, { id: 'c', label: 'Some people liked it, and here’s why' }, { id: 'd', label: 'Everyone likes it' }], correct: 'c', explanation: 'Report reasons and patterns, not percentages.' },
      { id: 'q4', prompt: 'A click spike after a redesign means…', options: [{ id: 'a', label: 'People love it' }, { id: 'b', label: 'Something changed; find out why' }, { id: 'c', label: 'Ship more' }, { id: 'd', label: 'Nothing' }], correct: 'b', explanation: 'More clicks can mean people are lost. Ask.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Qualitative research is best at…', hint: 'Stories, not counts.', options: [{ id: 'a', label: 'Measuring how many' }, { id: 'b', label: 'Explaining why' }, { id: 'c', label: 'Proving significance' }, { id: 'd', label: 'Tracking revenue' }], correct: 'b', explanation: 'It uncovers reasons, feelings and context.' },
    { id: 'l2', prompt: 'Quantitative research is best at…', hint: 'Counting.', options: [{ id: 'a', label: 'How much and how often' }, { id: 'b', label: 'Feelings' }, { id: 'c', label: 'Motivations' }, { id: 'd', label: 'Stories' }], correct: 'a', explanation: 'It measures scale and frequency.' },
    { id: 'l3', prompt: 'Analytics show people spend 5 minutes on a page. Good or bad?', hint: 'One number, two stories.', options: [{ id: 'a', label: 'Good: they’re engaged' }, { id: 'b', label: 'Bad: they’re stuck' }, { id: 'c', label: 'You can’t tell without asking or watching' }, { id: 'd', label: 'Always good' }], correct: 'c', explanation: 'Engaged and lost look the same in a chart.' },
    { id: 'l4', prompt: 'A good mixed-methods sequence is…', hint: 'Find it, then explain it.', options: [{ id: 'a', label: 'Use data to find where, interviews to learn why, data again to size the fix' }, { id: 'b', label: 'Only surveys' }, { id: 'c', label: 'Only interviews' }, { id: 'd', label: 'Guess, then survey' }], correct: 'a', explanation: 'Each method covers the other’s blind spot.' },
    { id: 'l5', prompt: 'Why can a survey of 1,000 people still mislead?', hint: 'Big isn’t the same as right.', options: [{ id: 'a', label: 'It can’t' }, { id: 'b', label: 'Leading questions or the wrong people make big numbers wrong' }, { id: 'c', label: 'Surveys are always illegal' }, { id: 'd', label: '1,000 is too few for anything' }], correct: 'b', explanation: 'Sample and wording matter more than size.' },
  ],
};

export const rs1_3: Episode = {
  lessonId: 'rs.1-3',
  hook: 'A stakeholder’s hunch is not a research question. Watch one get forged into something you can actually learn.',
  scene: {
    id: 'research-question', duration: 34,
    beats: [
      { at: 0, title: 'A hunch arrives', body: '“People forget to pay bills. Let’s add reminders!” A solution, dressed as a fact.' },
      { at: 6, title: 'Write down the assumption', body: 'Pull out the belief underneath: people forget to pay bills.' },
      { at: 11, title: 'Make it open', body: 'Not “would you want reminders?” but “how do people remember bills today, and where does it break?”' },
      { at: 18, title: 'Check the question', body: 'Is it open? About real behaviour? Free of a built-in solution? Something you can learn?' },
      { at: 24, title: 'Pick a method, set the bar', body: 'Choose how to answer it, and agree what result would change the plan.' },
      { at: 30, title: 'A question you can learn from', body: 'Research starts with a good question, not a feature idea.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What was wrong with “Let’s add reminders”?', options: [{ id: 'a', label: 'It’s a solution, not a question' }, { id: 'b', label: 'Reminders are always bad' }, { id: 'c', label: 'It’s too short' }],
      correct: 'a', explanation: 'It jumps to a feature before learning how people actually behave.' },
    { id: 'c2', prompt: 'What made the final question good?', options: [{ id: 'a', label: 'It was yes/no' }, { id: 'b', label: 'It was open and about real behaviour' }, { id: 'c', label: 'It mentioned the feature' }],
      correct: 'b', explanation: 'Open questions about behaviour are something you can actually learn about.' },
  ],
  game: {
    id: 'question-forge', title: 'Question forge',
    instructions: 'Build each research question from the tiles. Some tiles are traps. Then judge a few questions yourself.',
    lanes: [
      { id: 'strong', label: 'Strong', hint: 'Open, about real behaviour, and free of a built-in solution' },
      { id: 'weak', label: 'Weak', hint: 'Yes/no, leading, about opinions, or already assumes the solution' },
    ],
    rounds: [
      { id: 'r1', prompt: 'Turn “Should we add bill reminders?” into a research question.',
        answer: ['How do people', 'remember to pay bills today,', 'and where does that break down?'],
        distractors: ['Would people love', 'reminders?'], weak: ['Should we add bill reminders?', 'Would people love reminders?'] },
      { id: 'r2', prompt: 'Turn “Do investors like our app?” into a research question.',
        answer: ['How do first-time investors', 'choose a fund,', 'and what makes them hesitate?'],
        distractors: ['Do you like', 'our app?'], weak: ['Do investors like our app?', 'Is our app good?'] },
      { id: 'r3', prompt: 'Turn “Is the onboarding too long?” into a research question.',
        answer: ['What happens', 'in the first five minutes', 'when new users try to set up?'],
        distractors: ['Is it', 'too long?'], weak: ['Is the onboarding too long?', 'Do users hate onboarding?'] },
    ],
    cards: [
      { id: 'g1', label: 'How do nurses hand over patients between shifts?', lane: 'strong' },
      { id: 'g2', label: 'Would users like a dark mode?', lane: 'weak' },
      { id: 'g3', label: 'What do shop owners do when an invoice is late?', lane: 'strong' },
      { id: 'g4', label: 'Isn’t our new design better?', lane: 'weak' },
      { id: 'g5', label: 'How do families decide where to go on holiday?', lane: 'strong' },
      { id: 'g6', label: 'Do people want AI features?', lane: 'weak' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.8,
    prompt: 'The assumption is “people forget to pay bills”. Which research question should come next?',
    options: [{ id: 'a', label: '“Would you use a reminder feature?”' }, { id: 'b', label: '“How do people remember bills today, and where does that break down?”' }, { id: 'c', label: '“What colour should reminders be?”' }],
    correct: 'b', explanation: 'Ask about real behaviour, openly. The answer may or may not point to reminders, and that’s the point.',
  },
  takeaways: [
    { title: 'Find the assumption', body: 'Every hunch hides a belief about people. Write it down.' },
    { title: 'Open and about behaviour', body: 'Ask how people do things today, not whether they’d like your idea.' },
    { title: 'Agree what would change the plan', body: 'Decide before the research what result would make you act differently.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '“Do people like our app?” is…', options: [{ id: 'a', label: 'Strong' }, { id: 'b', label: 'Weak' }], correct: 'b', explanation: 'Yes/no, about opinion.' },
      { id: 'q2', prompt: '“How do freelancers track expenses today?” is…', options: [{ id: 'a', label: 'Strong' }, { id: 'b', label: 'Weak' }], correct: 'a', explanation: 'Open, about real behaviour.' },
      { id: 'q3', prompt: 'A good research question usually starts with…', options: [{ id: 'a', label: '“Would you…”' }, { id: 'b', label: '“Don’t you think…”' }, { id: 'c', label: '“How do…” or “What happens when…”' }, { id: 'd', label: '“Is it…”' }], correct: 'c', explanation: 'Open stems invite real stories.' },
      { id: 'q4', prompt: 'Before research, agree on…', options: [{ id: 'a', label: 'The final design' }, { id: 'b', label: 'What result would change the plan' }, { id: 'c', label: 'The launch date' }, { id: 'd', label: 'The answer you want' }], correct: 'b', explanation: 'Otherwise any result just confirms what you planned.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'A research question should be…', hint: 'Something you can learn about.', options: [{ id: 'a', label: 'A feature request' }, { id: 'b', label: 'Open and answerable through research' }, { id: 'c', label: 'Yes/no' }, { id: 'd', label: 'Secret' }], correct: 'b', explanation: 'Open questions you can actually investigate.' },
    { id: 'l2', prompt: 'What’s hiding inside “Let’s add reminders”?', hint: 'A belief about people.', options: [{ id: 'a', label: 'An assumption that people forget' }, { id: 'b', label: 'A budget' }, { id: 'c', label: 'A metric' }, { id: 'd', label: 'Nothing' }], correct: 'a', explanation: 'Find the assumption and test it.' },
    { id: 'l3', prompt: 'Why avoid asking “Would you use feature X?”', hint: 'People are bad at predicting.', options: [{ id: 'a', label: 'It’s too long' }, { id: 'b', label: 'People predict their future behaviour badly and want to be polite' }, { id: 'c', label: 'It’s illegal' }, { id: 'd', label: 'It’s too open' }], correct: 'b', explanation: 'Ask about past and present behaviour instead.' },
    { id: 'l4', prompt: 'Which question best supports a decision?', hint: 'Tie it to what you’ll do.', options: [{ id: 'a', label: 'Do people like us?' }, { id: 'b', label: 'Where in the current bill-paying routine do people miss payments, and how often?' }, { id: 'c', label: 'Is design important?' }, { id: 'd', label: 'What’s trendy?' }], correct: 'b', explanation: 'Specific behaviour you can act on.' },
    { id: 'l5', prompt: 'Research comes back and doesn’t support the hunch. A good team…', hint: 'That’s what research is for.', options: [{ id: 'a', label: 'Ignores it' }, { id: 'b', label: 'Changes the plan, as agreed up front' }, { id: 'c', label: 'Reruns it until it agrees' }, { id: 'd', label: 'Hides it' }], correct: 'b', explanation: 'Agreeing the bar beforehand makes acting on it easy.' },
  ],
};

export const rs1_4: Episode = {
  lessonId: 'rs.1-4',
  hook: 'Ask the wrong way and people tell you what you want to hear. Learn to hear the bias in a question.',
  scene: {
    id: 'bias', duration: 34,
    beats: [
      { at: 0, title: 'A leading question', body: '“Don’t you love our new feature?” They nod politely. You learned nothing.' },
      { at: 7, title: 'A hypothetical', body: '“Would you pay ₹199 for this?” “Sure!” People are bad at predicting their own behaviour.' },
      { at: 14, title: 'Priming', body: '“Most people find it easy. Did you?” Now they don’t want to be the odd one out.' },
      { at: 21, title: 'Ask about real life', body: '“Tell me about the last time you…” gets real stories, not polite guesses.' },
      { at: 29, title: 'Neutral, open, past', body: 'No hints, no futures, no crowd. Just what actually happened.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did “Don’t you love our new feature?” fail?', options: [{ id: 'a', label: 'It hinted at the answer they wanted' }, { id: 'b', label: 'It was too long' }, { id: 'c', label: 'It was asked too late' }],
      correct: 'a', explanation: 'Leading questions push people towards a polite “yes”.' },
    { id: 'c2', prompt: 'What worked better?', options: [{ id: 'a', label: 'Asking about the last time they did it' }, { id: 'b', label: 'Asking if they’d pay more' }, { id: 'c', label: 'Telling them what others thought' }],
      correct: 'a', explanation: 'Real past behaviour beats predictions and opinions.' },
  ],
  game: {
    id: 'red-pen', title: 'Red pen',
    instructions: 'Here’s an interview script. Strike every biased question with your red pen, then hand it in to see the fair versions.',
    lanes: [
      { id: 'biased', label: 'Biased', hint: 'Leads, primes, asks about an imagined future, or asks two things at once' },
      { id: 'fair', label: 'Fair', hint: 'Neutral and open, about real past behaviour' },
    ],
    cards: [
      { id: 'g1', label: 'Tell me about the last time you paid a bill.', lane: 'fair', note: 'Fair: open, about a real moment.' },
      { id: 'g2', label: 'Don’t you find our app easy to use?', lane: 'biased', note: 'Leading. Try: “Walk me through the last time you used it.”' },
      { id: 'g3', label: 'What happened next?', lane: 'fair', note: 'Fair: neutral follow-up that lets them keep talking.' },
      { id: 'g4', label: 'Would you use a feature that reminds you to pay?', lane: 'biased', note: 'Hypothetical. Try: “How do you remember to pay today?”' },
      { id: 'g5', label: 'How did you feel when that happened?', lane: 'fair', note: 'Fair: open, about their real experience.' },
      { id: 'g6', label: 'Most people love the new design. Do you?', lane: 'biased', note: 'Priming. Try: “What did you notice about the new design?”' },
      { id: 'g7', label: 'Was it fast and easy?', lane: 'biased', note: 'Double-barrelled and leading. Try: “How did it go?”' },
      { id: 'g8', label: 'What did you try before this app?', lane: 'fair', note: 'Fair: about past behaviour.' },
    ],
  },
  gap: {
    id: 'gap', from: 14, at: 20.6,
    prompt: 'You want to know if the app is easy to use. Which question should you ask?',
    options: [{ id: 'a', label: '“Most people find it easy. Did you?”' }, { id: 'b', label: '“Tell me about the last time you used it. What happened?”' }, { id: 'c', label: '“Would you say it’s easy?”' }],
    correct: 'b', explanation: 'A neutral question about a real moment lets them show you, without a hint of the “right” answer.',
  },
  takeaways: [
    { title: 'No hints', body: 'Don’t put the answer in the question: “Don’t you love…?”' },
    { title: 'Past, not future', body: 'Ask what people did, not what they would do.' },
    { title: 'No crowd', body: 'Don’t tell them what others think before they answer.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '“Isn’t it a bargain at ₹199?” is…', options: [{ id: 'a', label: 'Leading' }, { id: 'b', label: 'Fair' }], correct: 'a', explanation: 'It hints at the answer.' },
      { id: 'q2', prompt: '“What happened next?” is…', options: [{ id: 'a', label: 'Leading' }, { id: 'b', label: 'Fair' }], correct: 'b', explanation: 'Neutral and open.' },
      { id: 'q3', prompt: '“Would you pay for this?” is mainly…', options: [{ id: 'a', label: 'Priming' }, { id: 'b', label: 'Double-barrelled' }, { id: 'c', label: 'Hypothetical' }, { id: 'd', label: 'Fair' }], correct: 'c', explanation: 'It asks people to predict the future.' },
      { id: 'q4', prompt: '“Was it quick and clear?” is…', options: [{ id: 'a', label: 'Double-barrelled' }, { id: 'b', label: 'Fair' }, { id: 'c', label: 'Hypothetical' }, { id: 'd', label: 'Open' }], correct: 'a', explanation: 'Two questions in one; you won’t know which they answered.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'A leading question…', hint: 'It points somewhere.', options: [{ id: 'a', label: 'Hints at the answer you want' }, { id: 'b', label: 'Is very long' }, { id: 'c', label: 'Is asked first' }, { id: 'd', label: 'Is open' }], correct: 'a', explanation: 'It nudges people towards an answer.' },
    { id: 'l2', prompt: 'Why are hypothetical questions risky?', hint: 'Can you predict yourself?', options: [{ id: 'a', label: 'People predict their behaviour badly' }, { id: 'b', label: 'They’re too short' }, { id: 'c', label: 'They’re illegal' }, { id: 'd', label: 'They’re always leading' }], correct: 'a', explanation: 'Stated intentions often don’t match what people do.' },
    { id: 'l3', prompt: 'Best fix for “Most people love it. Do you?”', hint: 'Remove the crowd.', options: [{ id: 'a', label: '“Everyone loves it, right?”' }, { id: 'b', label: '“What did you notice when you used it?”' }, { id: 'c', label: '“Do you love it too?”' }, { id: 'd', label: '“Rate it 10/10?”' }], correct: 'b', explanation: 'Neutral and open, no social pressure.' },
    { id: 'l4', prompt: 'A participant says what they think you want to hear. What helps most?', hint: 'Make it safe to be honest.', options: [{ id: 'a', label: 'Tell them you designed it' }, { id: 'b', label: 'Say you didn’t design it and there are no wrong answers' }, { id: 'c', label: 'Ask faster' }, { id: 'd', label: 'Offer a bigger reward for praise' }], correct: 'b', explanation: 'Distance from the design and permission to criticise reduce politeness bias.' },
    { id: 'l5', prompt: 'Even neutral questions can bias results if…', hint: 'Who are you asking?', options: [{ id: 'a', label: 'You only interview your biggest fans' }, { id: 'b', label: 'You record the session' }, { id: 'c', label: 'You ask follow-ups' }, { id: 'd', label: 'You take notes' }], correct: 'a', explanation: 'Who you ask (sampling bias) shapes what you hear.' },
  ],
};
