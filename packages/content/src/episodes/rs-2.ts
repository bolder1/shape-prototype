// Episodes for chapter rs.2 · Interviews & observation. Drafts by Claude, for review.
import type { Episode } from '../episode';

export const rs2_1: Episode = {
  lessonId: 'rs.2-1',
  hook: 'Start with their life, end with their stories. Your product comes up last, if at all.',
  scene: {
    id: 'script-shape', duration: 34,
    beats: [
      { at: 0, title: 'Straight to the product', body: '“What do you think of our app?” The participant is polite, vague and done in five minutes.' },
      { at: 6, title: 'A script has a shape', body: 'Intro, warm-up, broad, deep dive, wrap-up. Like a funnel: wide at the top, narrow where the stories are.' },
      { at: 12, title: 'Intro and warm-up', body: 'Who you are, how long it takes, no wrong answers, consent to record. Then easy questions about their day.' },
      { at: 18, title: 'Broad, then deep', body: 'How they handle money in general, then one specific story: “the last time a payment went wrong”.' },
      { at: 25, title: 'Wrap-up', body: '“Anything I should have asked?” often brings the best answer of the hour.' },
      { at: 29, title: 'Broad to narrow', body: 'Their world first, the topic next, specific stories last.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the first interview fail?', options: [{ id: 'a', label: 'It jumped straight to opinions about the product' }, { id: 'b', label: 'It was too long' }, { id: 'c', label: 'The recorder broke' }],
      correct: 'a', explanation: 'Without context and trust, people give polite, vague opinions.' },
    { id: 'c2', prompt: 'Where do the specific stories go?', options: [{ id: 'a', label: 'First' }, { id: 'b', label: 'In the deep dive, after broad questions' }, { id: 'c', label: 'In the intro' }],
      correct: 'b', explanation: 'Broad first, then narrow into specific past events.' },
  ],
  game: {
    id: 'script-builder', title: 'Build the script',
    instructions: 'A pile of lines for a 45-minute interview about paying bills. Put each line in its part of the script and watch it take shape.',
    lanes: [
      { id: 'open', label: 'Intro & warm-up', hint: 'Set people at ease and learn about their day' },
      { id: 'broad', label: 'Broad', hint: 'The topic in general, in their world' },
      { id: 'deep', label: 'Deep dive', hint: 'One specific, recent story in detail' },
      { id: 'close', label: 'Wrap-up', hint: 'Catch what you missed and say thanks' },
    ],
    cards: [
      { id: 'g1', label: '“This takes about 45 minutes, and there are no wrong answers. Is it OK if I record?”', lane: 'open' },
      { id: 'g2', label: '“Tell me a bit about your work and a normal weekday.”', lane: 'open' },
      { id: 'g3', label: '“How do you keep track of bills that are due?”', lane: 'broad' },
      { id: 'g4', label: '“Who else in your home handles money?”', lane: 'broad' },
      { id: 'g5', label: '“Walk me through the last time a bill payment went wrong.”', lane: 'deep' },
      { id: 'g6', label: '“What did you do right after that?”', lane: 'deep' },
      { id: 'g7', label: '“Is there anything I should have asked but didn’t?”', lane: 'close' },
      { id: 'g8', label: '“Thank you, this was really helpful. Here’s your voucher.”', lane: 'close' },
    ],
  },
  gap: {
    id: 'gap', from: 18, at: 24.6,
    prompt: 'Broad questions are done. What comes next?',
    options: [{ id: 'a', label: '“What features would you like?”' }, { id: 'b', label: '“Walk me through the last time a payment went wrong.”' }, { id: 'c', label: '“Would you recommend our app?”' }],
    correct: 'b', explanation: 'Go deep on one real, recent story. Feature wishes and predictions tell you little.',
  },
  takeaways: [
    { title: 'A funnel shape', body: 'Intro, warm-up, broad, deep dive, wrap-up.' },
    { title: 'Trust first', body: 'Easy questions about their day make later answers honest.' },
    { title: 'Stories, not opinions', body: 'The deep dive asks for one specific, recent event in detail.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'The first part of a script is…', options: [{ id: 'a', label: 'The deep dive' }, { id: 'b', label: 'The intro' }], correct: 'b', explanation: 'Set people at ease first.' },
      { id: 'q2', prompt: 'Consent to record belongs in…', options: [{ id: 'a', label: 'The intro' }, { id: 'b', label: 'The wrap-up' }, { id: 'c', label: 'An email after' }], correct: 'a', explanation: 'Ask before you start.' },
      { id: 'q3', prompt: 'A good deep-dive question asks about…', options: [{ id: 'a', label: 'The future' }, { id: 'b', label: 'Opinions of the app' }, { id: 'c', label: 'A specific recent event' }, { id: 'd', label: 'Their age' }], correct: 'c', explanation: 'Real past events.' },
      { id: 'q4', prompt: 'Why end with “Anything I should have asked?”', options: [{ id: 'a', label: 'It’s polite only' }, { id: 'b', label: 'To fill time' }, { id: 'c', label: 'Legal reasons' }, { id: 'd', label: 'People often share what matters most to them' }], correct: 'd', explanation: 'It catches what your script missed.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'How strictly should you follow the script?', hint: 'It’s a guide.', options: [{ id: 'a', label: 'Loosely: follow interesting threads, use the script to cover the essentials' }, { id: 'b', label: 'Word for word' }, { id: 'c', label: 'Not at all' }, { id: 'd', label: 'Only the first half' }], correct: 'a', explanation: 'The best insights are often off-script.' },
    { id: 'l2', prompt: 'How many core questions fit a 45-minute interview?', hint: 'Follow-ups take most of the time.', options: [{ id: 'a', label: '40' }, { id: 'b', label: 'About 8–12, with plenty of follow-ups' }, { id: 'c', label: '2' }, { id: 'd', label: '100' }], correct: 'b', explanation: 'Fewer questions, deeper answers.' },
    { id: 'l3', prompt: 'Should you show your product during a discovery interview?', hint: 'What are you trying to learn?', options: [{ id: 'a', label: 'Yes, at the start' }, { id: 'b', label: 'Always' }, { id: 'c', label: 'Not until the end, if at all; it steers people toward it' }, { id: 'd', label: 'Only screenshots' }], correct: 'c', explanation: 'Showing it early turns discovery into a usability test.' },
    { id: 'l4', prompt: 'Why pilot the script with one person first?', hint: 'Find the broken bits.', options: [{ id: 'a', label: 'It’s a tradition' }, { id: 'b', label: 'To get more data' }, { id: 'c', label: 'To impress the team' }, { id: 'd', label: 'To find confusing, leading or too-long parts before real sessions' }], correct: 'd', explanation: 'A pilot catches problems cheaply.' },
    { id: 'l5', prompt: 'Someone becomes upset talking about money troubles. What do you do?', hint: 'People before data.', options: [{ id: 'a', label: 'Pause, acknowledge it, offer to skip or stop; their wellbeing comes first' }, { id: 'b', label: 'Push on for the insight' }, { id: 'c', label: 'Change the subject without a word' }, { id: 'd', label: 'End abruptly' }], correct: 'a', explanation: 'Consent is ongoing. People can skip or stop at any time.' },
  ],
};

export const rs2_2: Episode = {
  lessonId: 'rs.2-2',
  hook: 'The first answer is the polite one. The real story is two follow-ups away.',
  scene: {
    id: 'probing', duration: 34,
    beats: [
      { at: 0, title: 'A closed door', body: '“Do you like paying with UPI?” “Yes.” Silence. Nothing learned.' },
      { at: 6, title: 'An open door', body: '“Tell me about the last time you paid at a shop.” Now there’s a story: a queue, a slow network, a worried cashier.' },
      { at: 13, title: '“Tell me more”', body: 'Three words, and the story goes deeper: she keeps cash for exactly that shop.' },
      { at: 19, title: 'The power of silence', body: 'The interviewer waits. Three seconds later: “Actually, I don’t trust it for big amounts.”' },
      { at: 25, title: 'Why, not what', body: '“Why is that?” uncovers the real reason: a failed payment that took a week to refund.' },
      { at: 29, title: 'Open, follow, wait', body: 'Ask open questions, follow the thread, and let silence work.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What did “Do you like paying with UPI?” get?', options: [{ id: 'a', label: 'A rich story' }, { id: 'b', label: 'A one-word answer' }, { id: 'c', label: 'A complaint' }],
      correct: 'b', explanation: 'Closed questions get yes or no.' },
    { id: 'c2', prompt: 'What did staying silent do?', options: [{ id: 'a', label: 'Made it awkward and useless' }, { id: 'b', label: 'Ended the interview' }, { id: 'c', label: 'Gave her room to add what she really thought' }],
      correct: 'c', explanation: 'People fill silences, often with the most honest part.' },
  ],
  game: {
    id: 'chat-probe', title: 'Follow-up',
    instructions: 'A participant has just said something. Does the follow-up open the story up, or close it down? Weak follow-ups get a better version.',
    lanes: [
      { id: 'closed', label: 'Closes down', hint: 'Yes/no, leading, or changes the subject' },
      { id: 'open', label: 'Opens up', hint: 'Invites the story and the reasons' },
    ],
    cards: [
      { id: 'g1', label: '“So it was too slow?”', lane: 'closed', visual: '“I just gave up on it.”', note: '“Tell me about the moment you gave up.”' },
      { id: 'g2', label: '“Tell me more about that.”', lane: 'open', visual: '“I keep cash for that one shop.”' },
      { id: 'g3', label: '“Do you do that often?”', lane: 'closed', visual: '“I ask my son to pay the electricity bill.”', note: '“Walk me through the last time he paid it for you.”' },
      { id: 'g4', label: '“What happened next?”', lane: 'open', visual: '“The payment failed at the counter.”' },
      { id: 'g5', label: '“That must have been really annoying, right?”', lane: 'closed', visual: '“The refund took a week.”', note: '“How did that week go for you?”' },
      { id: 'g6', label: '“Why was that important to you?”', lane: 'open', visual: '“I always check the bank SMS before leaving.”' },
      { id: 'g7', label: '“OK. Next: how old are you?”', lane: 'closed', visual: '“Honestly, I don’t trust it for big amounts.”', note: '“What makes an amount feel big?”' },
      { id: 'g8', label: '(waits quietly for three seconds)', lane: 'open', visual: '“It’s fine, mostly…”' },
    ],
  },
  gap: {
    id: 'gap', from: 13, at: 18.6,
    prompt: 'She’s finished a sentence and looks at you. What do you do?',
    options: [{ id: 'a', label: 'Move to the next question right away' }, { id: 'b', label: 'Stay quiet for a few seconds' }, { id: 'c', label: 'Summarise what she meant for her' }],
    correct: 'b', explanation: 'Silence invites people to go on. Often the next sentence is the honest one.',
  },
  takeaways: [
    { title: 'Open questions', body: '“Tell me about…”, “Walk me through…” get stories; “Do you…?” gets a word.' },
    { title: 'Follow the thread', body: '“Tell me more”, “What happened next?”, “Why was that?”' },
    { title: 'Let silence work', body: 'Wait a few seconds after an answer. People fill the gap.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '“Do you use UPI?” is…', options: [{ id: 'a', label: 'Open' }, { id: 'b', label: 'Closed' }], correct: 'b', explanation: 'Yes or no.' },
      { id: 'q2', prompt: 'Best follow-up to a surprising answer?', options: [{ id: 'a', label: '“Tell me more about that.”' }, { id: 'b', label: '“Interesting. Next question.”' }, { id: 'c', label: '“Are you sure?”' }], correct: 'a', explanation: 'Follow the thread.' },
      { id: 'q3', prompt: '“That must have been annoying, right?” is…', options: [{ id: 'a', label: 'Open' }, { id: 'b', label: 'Neutral' }, { id: 'c', label: 'Leading' }, { id: 'd', label: 'Perfect' }], correct: 'c', explanation: 'It suggests the feeling.' },
      { id: 'q4', prompt: 'After an answer, a short silence…', options: [{ id: 'a', label: 'Wastes time' }, { id: 'b', label: 'Is rude' }, { id: 'c', label: 'Means you’re lost' }, { id: 'd', label: 'Often draws out more detail' }], correct: 'd', explanation: 'People fill silences.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'A participant asks, “What do other people say?” Best response?', hint: 'Don’t prime them.', options: [{ id: 'a', label: '“I’m more interested in your experience. What’s it like for you?”' }, { id: 'b', label: 'Tell them the majority view' }, { id: 'c', label: 'Ignore the question' }, { id: 'd', label: '“Everyone loves it.”' }], correct: 'a', explanation: 'Sharing others’ views biases their answer.' },
    { id: 'l2', prompt: 'Why ask “why” carefully, not five times in a row?', hint: 'Tone matters.', options: [{ id: 'a', label: 'It’s fine to repeat it' }, { id: 'b', label: 'Repeated “why?” can feel like an interrogation; vary it (“what made that important?”)' }, { id: 'c', label: '“Why” is always leading' }, { id: 'd', label: 'It takes too long' }], correct: 'b', explanation: 'Dig for reasons, but keep it a conversation.' },
    { id: 'l3', prompt: 'She says, “I’d definitely use that.” How much weight does it carry?', hint: 'Prediction vs behaviour.', options: [{ id: 'a', label: 'Lots, it’s a promise' }, { id: 'b', label: 'It proves demand' }, { id: 'c', label: 'Little: people predict their future behaviour badly; ask what they do today' }, { id: 'd', label: 'None, ignore her' }], correct: 'c', explanation: 'Past behaviour is far more reliable than predictions.' },
    { id: 'l4', prompt: 'What’s “echoing”?', hint: 'Repeat their words.', options: [{ id: 'a', label: 'Recording twice' }, { id: 'b', label: 'Agreeing loudly' }, { id: 'c', label: 'Asking the same question again' }, { id: 'd', label: 'Repeating their last words as a question (“Didn’t trust it?”) to invite more' }], correct: 'd', explanation: 'A gentle, neutral way to go deeper.' },
    { id: 'l5', prompt: 'The participant’s story contradicts what they said earlier. What do you do?', hint: 'Curious, not accusing.', options: [{ id: 'a', label: 'Note it and gently explore: “Earlier you mentioned X; how does that fit with this?”' }, { id: 'b', label: 'Point out they’re wrong' }, { id: 'c', label: 'Ignore it' }, { id: 'd', label: 'Stop the interview' }], correct: 'a', explanation: 'Contradictions often point to the most interesting insight.' },
  ],
};

export const rs2_3: Episode = {
  lessonId: 'rs.2-3',
  hook: 'Priya doesn’t want a lunch app. She wants to survive a day of meetings without crashing at 4 pm.',
  scene: {
    id: 'jobs', duration: 34,
    beats: [
      { at: 0, title: 'An order at 1:10 pm', body: 'Priya orders the same dal-rice bowl almost every weekday.' },
      { at: 6, title: 'The job behind it', body: 'Her real goal: get through back-to-back meetings without skipping lunch or losing energy.' },
      { at: 12, title: 'The real competition', body: 'Not other apps. Her mother’s tiffin, the office canteen, and skipping lunch entirely.' },
      { at: 18, title: 'The story of the switch', body: 'A JTBD interview walks back through it: the first bad day, noticing options, trying one, sticking with it.' },
      { at: 24, title: 'A job story', body: '“When my meetings run through lunch, I want food that arrives without thinking, so I don’t crash at 4 pm.”' },
      { at: 29, title: 'Hire and fire', body: 'People hire products to make progress, and fire them when something does the job better.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What was Priya’s real job?', options: [{ id: 'a', label: 'Trying new restaurants' }, { id: 'b', label: 'Getting through meetings without skipping lunch or crashing' }, { id: 'c', label: 'Saving money' }],
      correct: 'b', explanation: 'The job is the progress she wants in her situation.' },
    { id: 'c2', prompt: 'Who was the real competition?', options: [{ id: 'a', label: 'Only other food apps' }, { id: 'b', label: 'Nobody' }, { id: 'c', label: 'Tiffin from home, the canteen, and skipping lunch' }],
      correct: 'c', explanation: 'Anything that does the same job competes, including doing nothing.' },
  ],
  game: {
    id: 'job-forge', title: 'Job story forge',
    instructions: 'Build job stories from tiles: when [situation], I want to [motivation], so I can [outcome]. Feature tiles are traps. Then sort statements into jobs and feature requests.',
    lanes: [
      { id: 'job', label: 'A job', hint: 'A situation and the progress someone wants' },
      { id: 'feature', label: 'A feature request', hint: 'A solution someone has already imagined' },
    ],
    rounds: [
      { id: 'r1', prompt: 'Priya, whose meetings run through lunch', answer: ['When meetings run through lunch,', 'I want food that just arrives,', 'so I don’t crash at 4 pm.'], distractors: ['I want a dark mode,', 'so I can earn reward points.'], weak: ['When meetings run through lunch, I want a dark mode, so I can earn reward points.'] },
      { id: 'r2', prompt: 'Ravi, who sends money home every month', answer: ['When my salary arrives,', 'I want my parents to get money fast,', 'so they never wait on me.'], distractors: ['I want a bigger button,', 'so the app looks modern.'], weak: ['When my salary arrives, I want a bigger button, so the app looks modern.'] },
    ],
    cards: [
      { id: 'g1', label: '“When I’m new in a city, I want to find food I trust, so I feel at home.”', lane: 'job' },
      { id: 'g2', label: '“Add a filter for spice level.”', lane: 'feature' },
      { id: 'g3', label: '“When guests arrive suddenly, I want snacks in minutes, so I’m not embarrassed.”', lane: 'job' },
      { id: 'g4', label: '“Can you add a chatbot?”', lane: 'feature' },
      { id: 'g5', label: '“When I split rent with flatmates, I want it settled without awkward reminders.”', lane: 'job' },
      { id: 'g6', label: '“Put the cart button at the top.”', lane: 'feature' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 11.6,
    prompt: 'Who does the lunch app really compete with?',
    options: [{ id: 'a', label: 'Only other delivery apps' }, { id: 'b', label: 'Anything that does the same job, even skipping lunch' }, { id: 'c', label: 'Nobody, it’s unique' }],
    correct: 'b', explanation: 'Competition is defined by the job, not the category.',
  },
  takeaways: [
    { title: 'People hire products', body: 'They hire them to make progress in a situation, and fire them when something does better.' },
    { title: 'Competition by job', body: 'Tiffins, canteens and doing nothing compete with your app.' },
    { title: 'Job stories', body: '“When [situation], I want to [motivation], so I can [outcome].”' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '“Add a spice filter” is…', options: [{ id: 'a', label: 'A job' }, { id: 'b', label: 'A feature request' }], correct: 'b', explanation: 'It names a solution.' },
      { id: 'q2', prompt: 'A job story starts with…', options: [{ id: 'a', label: '“When…”' }, { id: 'b', label: '“As a user…”' }, { id: 'c', label: '“Add…”' }], correct: 'a', explanation: 'The situation comes first.' },
      { id: 'q3', prompt: 'A JTBD interview reconstructs…', options: [{ id: 'a', label: 'Future wishes' }, { id: 'b', label: 'Demographics' }, { id: 'c', label: 'The story of a real switch' }, { id: 'd', label: 'App ratings' }], correct: 'c', explanation: 'From first thought to first use.' },
      { id: 'q4', prompt: 'Skipping lunch can be a competitor because…', options: [{ id: 'a', label: 'It’s cheaper' }, { id: 'b', label: 'It’s popular' }, { id: 'c', label: 'It isn’t a competitor' }, { id: 'd', label: 'It’s another way of dealing with the same situation' }], correct: 'd', explanation: 'Non-consumption competes.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why focus on one recent switch in a JTBD interview?', hint: 'Memory is fresh.', options: [{ id: 'a', label: 'Recent, real events give details people can actually recall' }, { id: 'b', label: 'It’s faster' }, { id: 'c', label: 'Old switches don’t count' }, { id: 'd', label: 'It’s a rule' }], correct: 'a', explanation: 'Specific past events beat general opinions.' },
    { id: 'l2', prompt: 'What are the “forces” in a switch?', hint: 'Push, pull, and two that hold back.', options: [{ id: 'a', label: 'Price and quality' }, { id: 'b', label: 'Push of the problem, pull of the new, anxiety about it, and habit of the old' }, { id: 'c', label: 'Marketing and sales' }, { id: 'd', label: 'Gravity' }], correct: 'b', explanation: 'Progress happens when push and pull beat anxiety and habit.' },
    { id: 'l3', prompt: 'A user story says “As a user, I want filters.” What does a job story add?', hint: 'Context and why.', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'A persona photo' }, { id: 'c', label: 'The situation and the motivation, which open up other solutions' }, { id: 'd', label: 'An estimate' }], correct: 'c', explanation: 'Knowing why reveals better options than the requested feature.' },
    { id: 'l4', prompt: 'How can habit stop someone switching to a better product?', hint: 'Familiar feels safe.', options: [{ id: 'a', label: 'It can’t' }, { id: 'b', label: 'Habits only matter for food' }, { id: 'c', label: 'Only price matters' }, { id: 'd', label: 'The effort and comfort of the current way can outweigh a better option' }], correct: 'd', explanation: 'Designing for the switch means lowering habit and anxiety too.' },
    { id: 'l5', prompt: 'Two very different people hire your app for the same job. What does that suggest?', hint: 'Demographics aren’t the point.', options: [{ id: 'a', label: 'Design for the job, not the age or income group' }, { id: 'b', label: 'Your research is wrong' }, { id: 'c', label: 'Make two apps' }, { id: 'd', label: 'Ignore one of them' }], correct: 'a', explanation: 'Jobs often cut across demographics.' },
  ],
};

export const rs2_4: Episode = {
  lessonId: 'rs.2-4',
  hook: '“I do everything in the app,” he says. Then you visit his shop and see the paper ledger.',
  scene: {
    id: 'context-visit', duration: 34,
    beats: [
      { at: 0, title: 'In the interview room', body: 'Suresh, a kirana owner, says he runs his whole shop on the billing app.' },
      { at: 6, title: 'At the shop', body: 'The researcher sits beside the counter for a morning, watching real sales.' },
      { at: 11, title: 'What he didn’t mention', body: 'A paper ledger for regulars who pay later. A calculator before every bill. A sticky note of UPI IDs.' },
      { at: 18, title: 'Ask in the moment', body: '“Why did you write that in the book?” “The app can’t do credit for regulars.”' },
      { at: 24, title: 'Say vs do', body: 'Not a lie: habits and workarounds are invisible to the people who have them.' },
      { at: 29, title: 'Be the apprentice', body: 'Watch real work, in its real place, and ask why as it happens.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why didn’t Suresh mention the ledger?', options: [{ id: 'a', label: 'He was lying' }, { id: 'b', label: 'Workarounds feel normal and invisible to the people using them' }, { id: 'c', label: 'He forgot the interview' }],
      correct: 'b', explanation: 'People rarely notice their own habits.' },
    { id: 'c2', prompt: 'When did the researcher ask “why”?', options: [{ id: 'a', label: 'In a survey a week later' }, { id: 'b', label: 'Never' }, { id: 'c', label: 'Right as it happened, at the counter' }],
      correct: 'c', explanation: 'Asking in the moment gets accurate reasons.' },
  ],
  game: {
    id: 'ask-watch', title: 'Ask or watch?',
    instructions: 'Each thing you want to learn is easier to get one way. Send it to the interview room (ask) or the shop counter (watch).',
    lanes: [
      { id: 'ask', label: 'Ask', hint: 'Feelings, reasons, history, plans' },
      { id: 'watch', label: 'Watch', hint: 'Habits, workarounds, tools, the environment' },
    ],
    cards: [
      { id: 'g1', label: 'The paper ledger he keeps next to the app', lane: 'watch' },
      { id: 'g2', label: 'Why he chose this billing app last year', lane: 'ask' },
      { id: 'g3', label: 'The calculator he opens before every bill', lane: 'watch' },
      { id: 'g4', label: 'What worries him about giving credit', lane: 'ask' },
      { id: 'g5', label: 'The sticky note of UPI IDs on the counter', lane: 'watch' },
      { id: 'g6', label: 'How a slow festival season felt', lane: 'ask' },
      { id: 'g7', label: 'How often customers wait while he types', lane: 'watch' },
      { id: 'g8', label: 'What “a good month” means to him', lane: 'ask' },
    ],
  },
  gap: {
    id: 'gap', from: 11, at: 17.6,
    prompt: 'You see him write a sale in the paper ledger. What do you do?',
    options: [{ id: 'a', label: 'Note it silently and ask in a survey later' }, { id: 'b', label: 'Ask then and there: “Why did you write that in the book?”' }, { id: 'c', label: 'Tell him the app can do it' }],
    correct: 'b', explanation: 'Ask in the moment, curious and neutral, while the reason is fresh.',
  },
  takeaways: [
    { title: 'Say ≠ do', body: 'What people report and what they do often differ, with no lying involved.' },
    { title: 'Go to their place', body: 'Paper, sticky notes and calculators reveal the workarounds.' },
    { title: 'Ask as it happens', body: 'Like an apprentice: watch the work and ask “why?” in the moment.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A sticky note of passwords is found by…', options: [{ id: 'a', label: 'Asking' }, { id: 'b', label: 'Watching' }], correct: 'b', explanation: 'People rarely mention workarounds.' },
      { id: 'q2', prompt: 'Why someone switched banks is found by…', options: [{ id: 'a', label: 'Asking' }, { id: 'b', label: 'Watching' }, { id: 'c', label: 'Analytics' }], correct: 'a', explanation: 'Reasons and history need asking.' },
      { id: 'q3', prompt: 'In contextual inquiry, the researcher acts like…', options: [{ id: 'a', label: 'An auditor' }, { id: 'b', label: 'A salesperson' }, { id: 'c', label: 'An apprentice' }, { id: 'd', label: 'A boss' }], correct: 'c', explanation: 'Learning from the expert.' },
      { id: 'q4', prompt: 'Say vs do gaps mean people are…', options: [{ id: 'a', label: 'Lying' }, { id: 'b', label: 'Confused' }, { id: 'c', label: 'Unreliable, ignore them' }, { id: 'd', label: 'Unaware of their own habits' }], correct: 'd', explanation: 'Habits are invisible to their owners.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Before visiting someone’s shop or home, you should…', hint: 'It’s their space.', options: [{ id: 'a', label: 'Get consent for the visit, notes and any photos, and keep their routine undisturbed' }, { id: 'b', label: 'Just turn up' }, { id: 'c', label: 'Bring the whole team' }, { id: 'd', label: 'Record secretly' }], correct: 'a', explanation: 'Respect and consent come first, especially in homes and shops.' },
    { id: 'l2', prompt: 'Why not interrupt every few seconds?', hint: 'You want real work.', options: [{ id: 'a', label: 'It’s rude only' }, { id: 'b', label: 'Constant questions change how they work; pick natural pauses' }, { id: 'c', label: 'You’ll forget questions' }, { id: 'd', label: 'Recorders fail' }], correct: 'b', explanation: 'Balance watching with asking.' },
    { id: 'l3', prompt: 'What’s an “artefact” in contextual inquiry?', hint: 'Things they use.', options: [{ id: 'a', label: 'An old app' }, { id: 'b', label: 'A bug' }, { id: 'c', label: 'Objects people use to work: ledgers, notes, printouts, forms' }, { id: 'd', label: 'A competitor' }], correct: 'c', explanation: 'Artefacts reveal what the official tools miss.' },
    { id: 'l4', prompt: 'You spot a workaround. Best design reaction?', hint: 'It’s a clue.', options: [{ id: 'a', label: 'Ban the workaround' }, { id: 'b', label: 'Ignore it' }, { id: 'c', label: 'Tell them they’re using the app wrong' }, { id: 'd', label: 'Treat it as an unmet need and understand what job it does' }], correct: 'd', explanation: 'Workarounds are where products fall short.' },
    { id: 'l5', prompt: 'How many visits make a useful contextual study?', hint: 'Patterns, not statistics.', options: [{ id: 'a', label: 'Often 4–8 visits across different kinds of users reveal the main patterns' }, { id: 'b', label: 'One is enough forever' }, { id: 'c', label: 'At least 500' }, { id: 'd', label: 'It depends only on budget' }], correct: 'a', explanation: 'Qualitative patterns appear quickly when you vary the people.' },
  ],
};
