// Episodes for chapter gr.1 · Growth basics. Drafts by Claude, for review.
import type { Episode } from '../episode';

export const gr1_1: Episode = {
  lessonId: 'gr.1-1',
  hook: 'The team doubled its ad spend. Nine in ten new sign-ups still left before seeing any value. The leak was never at the top.',
  scene: {
    id: 'funnel', duration: 34,
    beats: [
      { at: 0, title: '1,000 people arrive', body: 'Acquisition: visitors land from ads, search and friends.' },
      { at: 5, title: 'Each stage loses people', body: 'Activation, Retention, Referral, Revenue. The pipe narrows at every step.' },
      { at: 11, title: 'Measure each step', body: 'Conversion between stages: 40% sign up, but only 10% of those activate.' },
      { at: 17, title: 'More water, same leak', body: 'Double the ad spend: twice the visitors, twice the cost, and 90% of sign-ups still leak away at activation.' },
      { at: 23, title: 'Fix the leakiest step', body: 'Improve activation from 10% to 30% and everything downstream triples.' },
      { at: 29, title: 'AARRR', body: 'Acquisition, Activation, Retention, Referral, Revenue. Find the leak before you pour in more.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why was doubling ads a poor fix?', options: [{ id: 'a', label: 'Ads never work' }, { id: 'b', label: 'The big leak was activation, further down' }, { id: 'c', label: 'The ads were too cheap' }],
      correct: 'b', explanation: 'More people in, but 90% still leak out at activation. Fixing the leak is cheaper.' },
    { id: 'c2', prompt: 'Activation means…', options: [{ id: 'a', label: 'Downloading the app' }, { id: 'b', label: 'Paying' }, { id: 'c', label: 'Getting real value for the first time' }],
      correct: 'c', explanation: 'The first time the product delivers on its promise.' },
  ],
  game: {
    id: 'funnel-leak', title: 'Find the leak',
    instructions: 'Each card is a product’s funnel: visitors, sign-ups, activated, still active after a month, paying. Tap the step that leaks the most.',
    lanes: [
      { id: 'acq', label: 'Visit → sign up', hint: 'Acquisition' },
      { id: 'act', label: 'Sign up → activated', hint: 'Activation' },
      { id: 'ret', label: 'Activated → month 2', hint: 'Retention' },
      { id: 'rev', label: 'Month 2 → paying', hint: 'Revenue' },
    ],
    cards: [
      { id: 'g1', label: 'A recipe app', lane: 'act', visual: '2000|600|90|60|12' },
      { id: 'g2', label: 'A fitness app', lane: 'acq', visual: '1000|80|56|30|9' },
      { id: 'g3', label: 'A bill-splitting app', lane: 'ret', visual: '5000|1500|900|90|30' },
      { id: 'g4', label: 'A language-learning app', lane: 'rev', visual: '3000|900|600|420|8' },
      { id: 'g5', label: 'A meditation app', lane: 'act', visual: '4000|1600|160|120|24' },
      { id: 'g6', label: 'A grocery delivery app', lane: 'acq', visual: '10000|300|240|180|90' },
      { id: 'g7', label: 'A note-taking app', lane: 'ret', visual: '2000|800|560|56|28' },
      { id: 'g8', label: 'A photo-editing app', lane: 'rev', visual: '6000|2400|1200|840|17' },
    ],
  },
  gap: {
    id: 'gap', from: 17, at: 22.4,
    prompt: 'Only 10% of sign-ups activate. Where should the team put its effort?',
    options: [{ id: 'a', label: 'Double the ad budget again' }, { id: 'b', label: 'Help more sign-ups reach first value' }, { id: 'c', label: 'Redesign the pricing page' }],
    correct: 'b', explanation: 'Fixing the leakiest step multiplies every stage after it.',
  },
  takeaways: [
    { title: 'Five stages', body: 'Acquisition, Activation, Retention, Referral, Revenue.' },
    { title: 'Conversion, not totals', body: 'Measure the % that moves from one stage to the next.' },
    { title: 'Fix the leak first', body: 'More visitors won’t help if the pipe leaks further down.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'The first A in AARRR is…', options: [{ id: 'a', label: 'Acquisition' }, { id: 'b', label: 'Analytics' }], correct: 'a', explanation: 'People arrive.' },
      { id: 'q2', prompt: 'Coming back next week is…', options: [{ id: 'a', label: 'Referral' }, { id: 'b', label: 'Retention' }, { id: 'c', label: 'Revenue' }], correct: 'b', explanation: 'They return.' },
      { id: 'q3', prompt: '400 sign-ups, 40 activate. Activation rate?', options: [{ id: 'a', label: '40%' }, { id: 'b', label: '4%' }, { id: 'c', label: '1%' }, { id: 'd', label: '10%' }], correct: 'd', explanation: '40 ÷ 400.' },
      { id: 'q4', prompt: 'Fix first…', options: [{ id: 'a', label: 'The top of the funnel, always' }, { id: 'b', label: 'Whatever is easiest' }, { id: 'c', label: 'The leakiest step' }, { id: 'd', label: 'The last step' }], correct: 'c', explanation: 'Biggest drop, biggest win.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Who coined the AARRR “pirate metrics”?', hint: 'A 500 Startups founder, 2007.', options: [{ id: 'a', label: 'Dave McClure' }, { id: 'b', label: 'Steve Jobs' }, { id: 'c', label: 'Eric Ries' }, { id: 'd', label: 'Don Norman' }], correct: 'a', explanation: 'Dave McClure, in a 2007 talk.' },
    { id: 'l2', prompt: 'Why is retention often called the most important stage?', hint: 'A leaky bucket.', options: [{ id: 'a', label: 'It’s the easiest to measure' }, { id: 'b', label: 'Without it, every user you acquire eventually leaves, so growth stalls' }, { id: 'c', label: 'It brings revenue directly' }, { id: 'd', label: 'Investors don’t care about it' }], correct: 'b', explanation: 'Retention is what makes the other stages compound.' },
    { id: 'l3', prompt: 'A cohort chart shows what?', hint: 'Groups by start date.', options: [{ id: 'a', label: 'Revenue by country' }, { id: 'b', label: 'Ad clicks per hour' }, { id: 'c', label: 'How many users from each sign-up week are still active over time' }, { id: 'd', label: 'Page load times' }], correct: 'c', explanation: 'Cohorts reveal whether retention is improving for newer users.' },
    { id: 'l4', prompt: 'Your funnel looks great, but most “activated” users are bots. What went wrong?', hint: 'Garbage in.', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'The design' }, { id: 'c', label: 'The pricing' }, { id: 'd', label: 'The activation event is too easy to fake; pick one that reflects real value' }], correct: 'd', explanation: 'Define stages by meaningful actions, not clicks.' },
    { id: 'l5', prompt: 'Where does referral fit for most products?', hint: 'It loops.', options: [{ id: 'a', label: 'It loops back into acquisition: happy users bring new ones' }, { id: 'b', label: 'It replaces revenue' }, { id: 'c', label: 'It happens before activation' }, { id: 'd', label: 'It doesn’t matter' }], correct: 'a', explanation: 'Referral turns the funnel into a loop.' },
  ],
};

export const gr1_2: Episode = {
  lessonId: 'gr.1-2',
  hook: 'Seven onboarding screens stood between new users and the one moment that would make them stay. Most never got there.',
  scene: {
    id: 'aha', duration: 34,
    beats: [
      { at: 0, title: 'The long road in', body: 'A running app: sign up, profile, goals, friends, a tour video… and only then, a first run.' },
      { at: 6, title: 'People leave along the way', body: 'Each extra screen loses people. Few ever reach the moment that matters.' },
      { at: 12, title: 'Find the aha', body: 'The data shows it: users who finish one tracked run in week one keep running with the app.' },
      { at: 18, title: 'Clear the path', body: 'Keep what the first run needs. Move the rest after it. Cut what adds nothing.' },
      { at: 24, title: 'Aha in two taps', body: 'Allow location, tap Start. Account and goals come after the first run, when people care.' },
      { at: 29, title: 'Shorten time to value', body: 'Find the aha moment, then remove everything between new users and it.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What was the running app’s aha moment?', options: [{ id: 'a', label: 'Creating an account' }, { id: 'b', label: 'Finishing a first tracked run' }, { id: 'c', label: 'Watching the tour' }],
      correct: 'b', explanation: 'That’s when the value is felt.' },
    { id: 'c2', prompt: 'What happened to the account sign-up?', options: [{ id: 'a', label: 'It was deleted' }, { id: 'b', label: 'It moved after the first run' }, { id: 'c', label: 'It got longer' }],
      correct: 'b', explanation: 'Ask once people have something worth saving.' },
  ],
  game: {
    id: 'aha-path', title: 'Clear the path to aha',
    instructions: 'A running app’s aha is finishing the first tracked run. For each onboarding step, keep it before the run, move it after, or cut it.',
    lanes: [
      { id: 'before', label: 'Before the run', hint: 'The first run can’t happen without it' },
      { id: 'later', label: 'After the run', hint: 'Useful, once people care' },
      { id: 'cut', label: 'Cut it', hint: 'Adds nothing at the start' },
    ],
    cards: [
      { id: 'g1', label: 'Allow location access', lane: 'before', note: 'GPS is how the run gets tracked.' },
      { id: 'g2', label: 'Tap “Start run”', lane: 'before', note: 'This is the run itself.' },
      { id: 'g3', label: 'Create an account with email', lane: 'later', note: 'Ask to save the run once it’s done; people sign up to keep what they made.' },
      { id: 'g4', label: 'Set a weekly distance goal', lane: 'later', note: 'Goals make sense after a first run shows what’s realistic.' },
      { id: 'g5', label: 'Find friends from your contacts', lane: 'later', note: 'Social features help retention, not the first run.' },
      { id: 'g6', label: 'Upload a profile photo', lane: 'later', note: 'Nice to have, never needed to run.' },
      { id: 'g7', label: 'Watch a 90-second intro video', lane: 'cut', note: 'A run teaches the app faster than a video.' },
      { id: 'g8', label: 'Swipe through a five-screen feature tour', lane: 'cut', note: 'People skip tours; show features in context instead.' },
      { id: 'g9', label: 'Rate the app five stars', lane: 'cut', note: 'Asking for a rating before any value annoys people.' },
    ],
  },
  gap: {
    id: 'gap', from: 18, at: 23.4,
    prompt: 'Where should “Create an account” go?',
    options: [{ id: 'a', label: 'First, before anything' }, { id: 'b', label: 'After the first run, to save it' }, { id: 'c', label: 'Nowhere, ever' }],
    correct: 'b', explanation: 'After value is felt, people have a reason to sign up.',
  },
  takeaways: [
    { title: 'Know your aha', body: 'The action that predicts people sticking around.' },
    { title: 'Shorten time to value', body: 'Only what the aha needs goes first.' },
    { title: 'Ask later', body: 'Accounts, goals and profiles come after people care.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'The aha moment is…', options: [{ id: 'a', label: 'When value is first felt' }, { id: 'b', label: 'The download' }], correct: 'a', explanation: 'Value, not installs.' },
      { id: 'q2', prompt: 'A five-screen feature tour…', options: [{ id: 'a', label: 'Boosts activation' }, { id: 'b', label: 'Usually gets skipped' }, { id: 'c', label: 'Is required' }], correct: 'b', explanation: 'Show features in context.' },
      { id: 'q3', prompt: 'Asking for an account after value…', options: [{ id: 'a', label: 'Loses everyone' }, { id: 'b', label: 'Is illegal' }, { id: 'c', label: 'Is pointless' }, { id: 'd', label: 'Gives people a reason to sign up' }], correct: 'd', explanation: 'Save what you made.' },
      { id: 'q4', prompt: 'Activation rate measures…', options: [{ id: 'a', label: 'App store rating' }, { id: 'b', label: 'Ad clicks' }, { id: 'c', label: 'Share of new users who reach the aha' }, { id: 'd', label: 'Revenue' }], correct: 'c', explanation: 'How many get there.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'How do teams usually find their aha moment?', hint: 'Compare who stayed.', options: [{ id: 'a', label: 'Compare actions of users who stayed vs left, then test it' }, { id: 'b', label: 'Ask the CEO' }, { id: 'c', label: 'Copy a competitor' }, { id: 'd', label: 'Pick the first screen' }], correct: 'a', explanation: 'Find actions that predict retention, then check they cause it.' },
    { id: 'l2', prompt: '“Users who add 7 friends in 10 days stick around.” What’s the trap?', hint: 'Correlation…', options: [{ id: 'a', label: 'There’s no trap' }, { id: 'b', label: 'Engaged people may add friends anyway; forcing it may not cause retention' }, { id: 'c', label: '7 is unlucky' }, { id: 'd', label: 'Friends don’t matter' }], correct: 'b', explanation: 'Test whether nudging the action actually lifts retention.' },
    { id: 'l3', prompt: 'What’s an “empty state” doing during activation?', hint: 'First screen with no data.', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'Showing an error' }, { id: 'c', label: 'Pointing new users to the first action that leads to value' }, { id: 'd', label: 'Hiding the menu' }], correct: 'c', explanation: 'A blank screen with one clear next step.' },
    { id: 'l4', prompt: 'Your activation rate rose after removing sign-up, but week-4 retention fell. Why might that be?', hint: 'Quality of users.', options: [{ id: 'a', label: 'Retention never changes' }, { id: 'b', label: 'The app got slower' }, { id: 'c', label: 'Pricing changed' }, { id: 'd', label: 'Anonymous users had nothing tying them back; prompt sign-up right after value' }], correct: 'd', explanation: 'Move steps later, don’t lose them.' },
    { id: 'l5', prompt: 'Time-to-value is best measured as…', hint: 'From where to where?', options: [{ id: 'a', label: 'Time from first open to the aha action' }, { id: 'b', label: 'Session length' }, { id: 'c', label: 'Total time in app' }, { id: 'd', label: 'Download time' }], correct: 'a', explanation: 'Shorter is better.' },
  ],
};

export const gr1_3: Episode = {
  lessonId: 'gr.1-3',
  hook: 'If people aren’t doing the thing, one of three things is missing. Find which one before you send another reminder.',
  scene: {
    id: 'fogg', duration: 34,
    beats: [
      { at: 0, title: 'Behaviour = M × A × P', body: 'Motivation, ability and a prompt, all at the same moment. That’s BJ Fogg’s model.' },
      { at: 6, title: 'The action line', body: 'High motivation can carry a hard task; an easy task needs little motivation. Below the curve, prompts fail.' },
      { at: 12, title: 'Make it easier', body: 'Savings setup goes from nine screens to one tap. The dot jumps above the line.' },
      { at: 18, title: 'Add a prompt', body: 'People wanted to do it and could. They just weren’t reminded at the right moment.' },
      { at: 23, title: 'The hook loop', body: 'Trigger, action, variable reward, investment. Each loop makes the next one more likely.' },
      { at: 29, title: 'Diagnose, then design', body: 'Missing motivation, ability or prompt? Fix that one. Easier usually beats louder.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What are the three parts of Fogg’s model?', options: [{ id: 'a', label: 'Motivation, ability, prompt' }, { id: 'b', label: 'Price, place, promotion' }, { id: 'c', label: 'Trigger, reward, loss' }],
      correct: 'a', explanation: 'B = MAP.' },
    { id: 'c2', prompt: 'What moved the savings dot above the line?', options: [{ id: 'a', label: 'A louder message' }, { id: 'b', label: 'Making setup far easier' }, { id: 'c', label: 'More reminders' }],
      correct: 'b', explanation: 'Raising ability.' },
  ],
  game: {
    id: 'fogg-fix', title: 'What’s missing?',
    instructions: 'Each card is a behaviour that isn’t happening. The dot shows where it sits on the Fogg chart. Diagnose what’s missing: motivation, ability or a prompt.',
    lanes: [
      { id: 'motivation', label: 'Motivation', hint: 'People don’t care enough' },
      { id: 'ability', label: 'Ability', hint: 'It’s too hard, long or costly' },
      { id: 'prompt', label: 'Prompt', hint: 'Nothing reminds them at the right moment' },
    ],
    cards: [
      { id: 'g1', label: 'People want to save money, but setting up a savings goal takes nine screens', lane: 'ability', visual: '8,2,1' },
      { id: 'g2', label: 'Users love the habit tracker but forget to open it', lane: 'prompt', visual: '8,8,0' },
      { id: 'g3', label: 'A daily ping asks people to log water, but they don’t care about water intake', lane: 'motivation', visual: '2,8,1' },
      { id: 'g4', label: 'Uploading a document needs a scanner most people don’t own', lane: 'ability', visual: '7,1,1' },
      { id: 'g5', label: 'People would happily rate their order, but the app never asks', lane: 'prompt', visual: '6,8,0' },
      { id: 'g6', label: 'A one-tap “Invite a friend” button, but nobody gets anything for it', lane: 'motivation', visual: '2,9,1' },
      { id: 'g7', label: 'Customers want e-bills, but must print, sign and post a form', lane: 'ability', visual: '8,1,1' },
      { id: 'g8', label: 'Patients mean to refill prescriptions on time, but nothing reminds them', lane: 'prompt', visual: '9,7,0' },
    ],
  },
  gap: {
    id: 'gap', from: 18, at: 22.4,
    prompt: 'People want to log their workouts and it’s easy, but they forget. What do you add?',
    options: [{ id: 'a', label: 'A prompt at the right moment, like right after a workout' }, { id: 'b', label: 'A longer form' }, { id: 'c', label: 'A motivational video' }],
    correct: 'a', explanation: 'Motivation and ability are there; the prompt is missing.',
  },
  takeaways: [
    { title: 'B = MAP', body: 'Behaviour needs motivation, ability and a prompt at the same moment.' },
    { title: 'Easier beats louder', body: 'Raising ability is more reliable than pumping motivation.' },
    { title: 'Hooks loop', body: 'Trigger, action, variable reward, investment, then again.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '“Nine screens to set up” is low…', options: [{ id: 'a', label: 'Ability' }, { id: 'b', label: 'Motivation' }], correct: 'a', explanation: 'Too hard.' },
      { id: 'q2', prompt: '“They forget to open it” is a missing…', options: [{ id: 'a', label: 'Motivation' }, { id: 'b', label: 'Ability' }, { id: 'c', label: 'Prompt' }], correct: 'c', explanation: 'Nothing reminds them.' },
      { id: 'q3', prompt: 'The last step of the Hook model is…', options: [{ id: 'a', label: 'Trigger' }, { id: 'b', label: 'Action' }, { id: 'c', label: 'Reward' }, { id: 'd', label: 'Investment' }], correct: 'd', explanation: 'Users put something in, which loads the next trigger.' },
      { id: 'q4', prompt: 'Most reliable lever?', options: [{ id: 'a', label: 'More reminders' }, { id: 'b', label: 'Louder copy' }, { id: 'c', label: 'Make it easier' }, { id: 'd', label: 'Bigger buttons only' }], correct: 'c', explanation: 'Ability.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'In Fogg’s model, what happens when a prompt arrives below the action line?', hint: 'Not enough M × A.', options: [{ id: 'a', label: 'The behaviour doesn’t happen, and people get annoyed' }, { id: 'b', label: 'It always works' }, { id: 'c', label: 'Motivation rises' }, { id: 'd', label: 'Ability rises' }], correct: 'a', explanation: 'Prompts can’t rescue a behaviour that’s too hard or unwanted.' },
    { id: 'l2', prompt: 'Why are rewards in the Hook model “variable”?', hint: 'Slot machines.', options: [{ id: 'a', label: 'They’re cheaper' }, { id: 'b', label: 'Unpredictable rewards hold attention more than fixed ones' }, { id: 'c', label: 'Users prefer losing' }, { id: 'd', label: 'It’s a typo' }], correct: 'b', explanation: 'And that power is exactly why it needs ethical care.' },
    { id: 'l3', prompt: 'Which is an “investment” in the Hook model?', hint: 'Something that makes the product better for you.', options: [{ id: 'a', label: 'Seeing an ad' }, { id: 'b', label: 'Receiving a notification' }, { id: 'c', label: 'Following people, saving playlists, building history' }, { id: 'd', label: 'Uninstalling' }], correct: 'c', explanation: 'Stored value makes coming back more worthwhile.' },
    { id: 'l4', prompt: 'A growth team uses hooks to keep kids playing late at night. What’s the issue?', hint: 'Who benefits?', options: [{ id: 'a', label: 'None, engagement is good' }, { id: 'b', label: 'It costs too much' }, { id: 'c', label: 'Kids don’t use phones' }, { id: 'd', label: 'Behaviour design that works against users’ interests is manipulation' }], correct: 'd', explanation: 'Ask: would users thank you for this habit?' },
    { id: 'l5', prompt: 'Which prompt is best timed?', hint: 'Right moment, right place.', options: [{ id: 'a', label: '“Rate your ride” as the trip ends' }, { id: 'b', label: 'A rating request at 3 am' }, { id: 'c', label: 'A rating request before the first ride' }, { id: 'd', label: 'A monthly email' }], correct: 'a', explanation: 'Prompts work when motivation and ability peak.' },
  ],
};

export const gr1_4: Episode = {
  lessonId: 'gr.1-4',
  hook: 'A pre-ticked box made the conversion chart go up. Then the refunds, the complaints and the regulator arrived.',
  scene: {
    id: 'dark-patterns', duration: 34,
    beats: [
      { at: 0, title: 'A checkout full of tricks', body: 'Insurance pre-ticked, a timer counting down, a fee that appears at the last step.' },
      { at: 6, title: 'Confirmshaming', body: '“No thanks, I don’t like saving money.” Declining is made to feel shameful.' },
      { at: 11, title: 'The roach motel', body: 'Subscribe in one tap. To cancel, call a number between 10 and 11 am on weekdays.' },
      { at: 17, title: 'The bill comes due', body: 'Conversions rise for a while, then refunds, angry reviews and complaints follow. Trust drops.' },
      { at: 23, title: 'The fair version', body: 'Opt-in boxes unticked, the full price up front, a real deadline, and cancel in two taps.' },
      { at: 29, title: 'Growth people choose', body: 'If it only works because people are fooled, it isn’t growth. It’s debt.' },
    ],
  },
  check: [
    { id: 'c1', prompt: '“No thanks, I don’t like saving money” is…', options: [{ id: 'a', label: 'Friendly copy' }, { id: 'b', label: 'Confirmshaming' }, { id: 'c', label: 'A legal notice' }],
      correct: 'b', explanation: 'It shames people for declining.' },
    { id: 'c2', prompt: 'What happened after the tricks lifted conversions?', options: [{ id: 'a', label: 'Lasting growth' }, { id: 'b', label: 'Refunds, complaints and lost trust' }, { id: 'c', label: 'Nothing' }],
      correct: 'b', explanation: 'The cost arrives later.' },
  ],
  game: {
    id: 'dark-spot', title: 'Dark or fair?',
    instructions: 'Each card is a piece of a real-looking checkout or subscription. Is it a dark pattern, or fair to the user?',
    lanes: [
      { id: 'dark', label: 'Dark pattern', hint: 'Tricks, pressures or hides information' },
      { id: 'fair', label: 'Fair', hint: 'Lets people choose freely with the facts' },
    ],
    cards: [
      { id: 'g1', label: 'A pop-up with “No thanks, I don’t like saving money”', lane: 'dark', visual: 'confirmshame', note: 'Confirmshaming: guilt-tripping people who decline.' },
      { id: 'g2', label: 'A pop-up with a plain “No thanks” button', lane: 'fair', visual: 'decline-plain', note: 'Declining is as easy and neutral as accepting.' },
      { id: 'g3', label: 'Travel insurance pre-ticked at checkout', lane: 'dark', visual: 'preticked', note: 'Sneaking into the basket: people pay for what they didn’t choose.' },
      { id: 'g4', label: 'An unticked “Add travel insurance for ₹149” box', lane: 'fair', visual: 'optin', note: 'People opt in if they want it.' },
      { id: 'g5', label: '“Offer ends in 09:59”, restarting on every visit', lane: 'dark', visual: 'fake-timer', note: 'False urgency: the deadline is invented.' },
      { id: 'g6', label: '“Sale ends Sunday, 30 November” with a real end date', lane: 'fair', visual: 'real-deadline', note: 'A true deadline people can plan around.' },
      { id: 'g7', label: 'To cancel, call 10–11 am on weekdays', lane: 'dark', visual: 'cancel-call', note: 'Roach motel: easy to get in, hard to get out.' },
      { id: 'g8', label: '“Cancel subscription” in settings, two taps', lane: 'fair', visual: 'cancel-easy', note: 'Leaving is as easy as joining.' },
      { id: 'g9', label: 'A ₹99 “convenience fee” first shown on the payment screen', lane: 'dark', visual: 'hidden-fee', note: 'Drip pricing: hiding part of the cost until the end.' },
      { id: 'g10', label: 'The total with all fees shown from the first screen', lane: 'fair', visual: 'total-upfront', note: 'No surprises at payment.' },
    ],
  },
  gap: {
    id: 'gap', from: 17, at: 22.4,
    prompt: 'The pre-ticked insurance raised revenue but refunds and complaints are climbing. What now?',
    options: [{ id: 'a', label: 'Make the box smaller' }, { id: 'b', label: 'Untick it and let people opt in' }, { id: 'c', label: 'Hide the refund button' }],
    correct: 'b', explanation: 'An honest opt-in keeps the buyers who actually want it, without the backlash.',
  },
  takeaways: [
    { title: 'Name the patterns', body: 'Confirmshaming, sneaking into the basket, false urgency, roach motels, drip pricing.' },
    { title: 'Short-term lift, long-term cost', body: 'Refunds, complaints, churn and regulators follow.' },
    { title: 'Fair is the default', body: 'Opt-in, full price up front, real deadlines, easy exits.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A pre-ticked add-on is…', options: [{ id: 'a', label: 'A dark pattern' }, { id: 'b', label: 'Fair' }], correct: 'a', explanation: 'Sneaking into the basket.' },
      { id: 'q2', prompt: 'A timer that restarts on reload is…', options: [{ id: 'a', label: 'Fair' }, { id: 'b', label: 'False urgency' }, { id: 'c', label: 'A bug only' }], correct: 'b', explanation: 'An invented deadline.' },
      { id: 'q3', prompt: 'Fees revealed only at payment are…', options: [{ id: 'a', label: 'Normal' }, { id: 'b', label: 'Helpful' }, { id: 'c', label: 'Required' }, { id: 'd', label: 'Drip pricing' }], correct: 'd', explanation: 'Hidden costs.' },
      { id: 'q4', prompt: 'Fair cancellation is…', options: [{ id: 'a', label: 'Phone only' }, { id: 'b', label: 'Hidden in FAQs' }, { id: 'c', label: 'As easy as signing up' }, { id: 'd', label: 'Impossible' }], correct: 'c', explanation: 'Easy in, easy out.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Which Indian body issued guidelines banning dark patterns in 2023?', hint: 'Consumer protection.', options: [{ id: 'a', label: 'The Central Consumer Protection Authority' }, { id: 'b', label: 'SEBI' }, { id: 'c', label: 'ISRO' }, { id: 'd', label: 'The Election Commission' }], correct: 'a', explanation: 'The CCPA’s guidelines list 13 specified dark patterns.' },
    { id: 'l2', prompt: 'What is “basket sneaking”?', hint: 'Things appear in your cart.', options: [{ id: 'a', label: 'Removing items you added' }, { id: 'b', label: 'Adding items or donations you didn’t choose' }, { id: 'c', label: 'Showing a cart icon' }, { id: 'd', label: 'Saving your cart' }], correct: 'b', explanation: 'One of the CCPA’s named patterns.' },
    { id: 'l3', prompt: 'A “Accept all cookies” button is bright blue; “Reject” is grey text in a sub-menu. What’s wrong?', hint: 'Equal choices?', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'The colours are off-brand' }, { id: 'c', label: 'Interface interference: one choice is made much harder than the other' }, { id: 'd', label: 'Too few cookies' }], correct: 'c', explanation: 'Make accept and reject equally easy.' },
    { id: 'l4', prompt: 'Your manager says, “Everyone uses a fake timer, our conversion will drop without it.” Best response?', hint: 'Make the case with data.', options: [{ id: 'a', label: 'Agree quietly' }, { id: 'b', label: 'Refuse to discuss it' }, { id: 'c', label: 'Make the timer longer' }, { id: 'd', label: 'Show the legal risk and test an honest alternative, like a real deadline or social proof' }], correct: 'd', explanation: 'Offer an ethical option, measured.' },
    { id: 'l5', prompt: 'A quick test for any persuasive design?', hint: 'Imagine the user knew.', options: [{ id: 'a', label: 'Would users still be happy if they fully understood what you’re doing?' }, { id: 'b', label: 'Does it raise conversion?' }, { id: 'c', label: 'Do competitors do it?' }, { id: 'd', label: 'Is it pretty?' }], correct: 'a', explanation: 'If it needs people not to notice, it’s a dark pattern.' },
  ],
};
