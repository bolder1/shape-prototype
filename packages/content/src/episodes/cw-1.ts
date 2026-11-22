// Episodes for chapter cw.1 · UX writing basics. Drafts by Claude, for review.
import type { Episode } from '../episode';

export const cw1_1: Episode = {
  lessonId: 'cw.1-1',
  hook: 'Nobody reads your interface. They glance at it. Write for the glance.',
  scene: {
    id: 'clear-clever', duration: 34,
    beats: [
      { at: 0, title: 'A clever sign-up screen', body: '“Unleash your inner foodie.” Button: “Let’s roll!” The team loved it in the review.' },
      { at: 6, title: 'The two-second glance', body: 'Real people give it two seconds, mid-commute, one thumb free.' },
      { at: 12, title: 'What did they get?', body: 'Is it recipes? A restaurant guide? A cooking class? Most leave without finding out.' },
      { at: 17, title: 'Say it plainly', body: '“Order lunch from 200 kitchens near you.” Button: “See restaurants.” Sign-ups climb.' },
      { at: 24, title: 'Clever has a place', body: 'Once lunch is ordered and nothing is at stake, a little warmth is welcome.' },
      { at: 29, title: 'Clear first', body: 'Clarity when people decide, personality when they relax.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did people leave the first screen?', options: [{ id: 'a', label: 'The colours were wrong' }, { id: 'b', label: 'In a two-second glance, it didn’t say what the app does' }, { id: 'c', label: 'The button was too small' }],
      correct: 'b', explanation: 'The clever line needed decoding, and people don’t stop to decode.' },
    { id: 'c2', prompt: 'Where was a playful line fine?', options: [{ id: 'a', label: 'On the payment button' }, { id: 'b', label: 'In an error message' }, { id: 'c', label: 'After the order, when nothing was at stake' }],
      correct: 'c', explanation: 'Personality works when it doesn’t get in the way of a decision.' },
  ],
  game: {
    id: 'glance-test', title: 'Glance test',
    instructions: 'Each line flashes for under two seconds, like a real glance. Did it tell you what happens, or make you think? Clever lines get rewritten.',
    lanes: [
      { id: 'clever', label: 'Made me think', hint: 'Clever, vague or a joke you have to decode' },
      { id: 'clear', label: 'Got it', hint: 'Says plainly what it is or what happens' },
    ],
    cards: [
      { id: 'g1', label: 'Unleash your inner foodie', lane: 'clever', note: 'Order lunch from 200 kitchens near you' },
      { id: 'g2', label: 'Track your order', lane: 'clear' },
      { id: 'g3', label: 'Magic awaits', lane: 'clever', note: 'Set up your shop in 5 minutes' },
      { id: 'g4', label: 'Save 20% on your first order', lane: 'clear' },
      { id: 'g5', label: 'Houston, we have a problem', lane: 'clever', note: 'Your payment didn’t go through' },
      { id: 'g6', label: 'Download your invoice', lane: 'clear' },
      { id: 'g7', label: 'Let’s roll!', lane: 'clever', note: 'See restaurants' },
      { id: 'g8', label: 'Your OTP is valid for 10 minutes', lane: 'clear' },
      { id: 'g9', label: 'Level up your wallet game', lane: 'clever', note: 'Add money to your wallet' },
    ],
  },
  gap: {
    id: 'gap', from: 12, at: 16.6,
    prompt: 'People don’t get what the app does. What do you change?',
    options: [{ id: 'a', label: 'An even punchier slogan' }, { id: 'b', label: 'Say plainly what it does and what the button leads to' }, { id: 'c', label: 'Add an animation to grab attention' }],
    correct: 'b', explanation: 'Attention isn’t the problem; understanding is. Plain words fix that.',
  },
  takeaways: [
    { title: 'Write for the glance', body: 'People give interface text a second or two. Make that enough.' },
    { title: 'Say what happens', body: 'Name the thing or the result: “Track your order”, not “Where’s my grub?”.' },
    { title: 'Personality when it’s safe', body: 'Be warm in calm moments, never at the cost of clarity.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '“Magic awaits” is…', options: [{ id: 'a', label: 'Clear' }, { id: 'b', label: 'Clever' }], correct: 'b', explanation: 'It says nothing about what happens.' },
      { id: 'q2', prompt: 'How long do people usually look at a label?', options: [{ id: 'a', label: 'A second or two' }, { id: 'b', label: 'A minute' }, { id: 'c', label: 'As long as it takes' }], correct: 'a', explanation: 'Interfaces are glanced at, not read.' },
      { id: 'q3', prompt: 'Best place for a joke?', options: [{ id: 'a', label: 'Payment errors' }, { id: 'b', label: 'Legal terms' }, { id: 'c', label: 'A success screen' }, { id: 'd', label: 'The delete button' }], correct: 'c', explanation: 'Nothing is at stake there.' },
      { id: 'q4', prompt: 'Clear copy mainly…', options: [{ id: 'a', label: 'Sounds fancy' }, { id: 'b', label: 'Uses more words' }, { id: 'c', label: 'Hides details' }, { id: 'd', label: 'Says what something is or does' }], correct: 'd', explanation: 'No decoding needed.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Which word is clearer for most people?', hint: 'Everyday words.', options: [{ id: 'a', label: 'Use' }, { id: 'b', label: 'Utilise' }, { id: 'c', label: 'Leverage' }, { id: 'd', label: 'Operationalise' }], correct: 'a', explanation: 'Short, common words are read faster.' },
    { id: 'l2', prompt: 'Why can puns be risky for an Indian audience using English?', hint: 'Many users read English as a second language.', options: [{ id: 'a', label: 'Puns are rude' }, { id: 'b', label: 'Wordplay often doesn’t survive a second language or translation' }, { id: 'c', label: 'They’re too short' }, { id: 'd', label: 'There’s no risk' }], correct: 'b', explanation: 'Plain English works for more people; puns depend on native-speaker intuition.' },
    { id: 'l3', prompt: 'Where should the key words go in a line?', hint: 'People scan the start.', options: [{ id: 'a', label: 'At the end, as a surprise' }, { id: 'b', label: 'In the middle' }, { id: 'c', label: 'At the start, so a scan catches them' }, { id: 'd', label: 'In brackets' }], correct: 'c', explanation: '“Payment failed: try another card” beats “Unfortunately, it seems that your payment…”.' },
    { id: 'l4', prompt: 'A stakeholder says the clear version is “boring”. Best answer?', hint: 'Test it.', options: [{ id: 'a', label: 'Agree and use the slogan' }, { id: 'b', label: 'Add emojis' }, { id: 'c', label: 'Ignore them' }, { id: 'd', label: 'Test both with real people; boring that converts beats clever that confuses' }], correct: 'd', explanation: 'A quick test turns taste into evidence.' },
    { id: 'l5', prompt: 'Can a line be both clear and warm?', hint: 'Think “Nice! Your table is booked.”', options: [{ id: 'a', label: 'Yes: clarity first, a light human touch around it' }, { id: 'b', label: 'No, pick one' }, { id: 'c', label: 'Only with emojis' }, { id: 'd', label: 'Only in errors' }], correct: 'a', explanation: 'Warmth can wrap a clear message without replacing it.' },
  ],
};

export const cw1_2: Episode = {
  lessonId: 'cw.1-2',
  hook: '“OK” makes people reread the question. A good button tells them what happens when they tap.',
  scene: {
    id: 'button-labels', duration: 34,
    beats: [
      { at: 0, title: '“Delete 3 photos?”', body: 'Two buttons: OK and Cancel. Which one keeps the photos?' },
      { at: 6, title: 'A wrong tap', body: 'In a hurry, Riya taps OK. Three photos of her grandmother, gone.' },
      { at: 12, title: 'Verb + object', body: 'Rewrite: “Delete 3 photos” and “Keep photos”. Each button stands on its own.' },
      { at: 18, title: '“Submit”', body: 'The last step of checkout says “Submit”. Submit what? For how much?' },
      { at: 24, title: '“Pay ₹450”', body: 'The button says exactly what will happen, at the moment people commit.' },
      { at: 29, title: 'Read only the buttons', body: 'If the buttons alone tell the story, they’re good.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did Riya tap the wrong button?', options: [{ id: 'a', label: '“OK” didn’t say what would happen' }, { id: 'b', label: 'The button was red' }, { id: 'c', label: 'Her phone was slow' }],
      correct: 'a', explanation: 'She had to remember the question to know what “OK” meant.' },
    { id: 'c2', prompt: 'What made “Pay ₹450” better than “Submit”?', options: [{ id: 'a', label: 'It’s longer' }, { id: 'b', label: 'It names the action and the amount' }, { id: 'c', label: 'It’s in capitals' }],
      correct: 'b', explanation: 'People know exactly what they’re committing to.' },
  ],
  game: {
    id: 'button-forge', title: 'Button forge',
    instructions: 'Build each button from word tiles: a verb plus what it acts on. Then sort real button labels into specific or vague.',
    lanes: [
      { id: 'sp', label: 'Specific', hint: 'Names the action, so it works on its own' },
      { id: 'va', label: 'Vague', hint: 'Could be on any button; people must reread the question' },
    ],
    rounds: [
      { id: 'r1', prompt: 'The confirm button for “Delete 3 photos?”', answer: ['Delete', '3', 'photos'], distractors: ['OK', 'Yes', 'Sure'], weak: ['OK', 'Yes'] },
      { id: 'r2', prompt: 'The last button of checkout, for a ₹450 order', answer: ['Pay', '₹450'], distractors: ['Submit', 'Continue', 'Done'], weak: ['Submit', 'Continue'] },
      { id: 'r3', prompt: 'The button that sends a friend an invite', answer: ['Send', 'invite'], distractors: ['Go', 'Submit', 'OK'], weak: ['Go', 'Submit'] },
    ],
    cards: [
      { id: 'g1', label: 'Book table for 4', lane: 'sp' },
      { id: 'g2', label: 'OK', lane: 'va' },
      { id: 'g3', label: 'Download invoice', lane: 'sp' },
      { id: 'g4', label: 'Submit', lane: 'va' },
      { id: 'g5', label: 'Start free trial', lane: 'sp' },
      { id: 'g6', label: 'Click here', lane: 'va' },
      { id: 'g7', label: 'Save address', lane: 'sp' },
      { id: 'g8', label: 'Yes', lane: 'va' },
    ],
  },
  gap: {
    id: 'gap', from: 18, at: 23.6,
    prompt: 'The checkout button says “Submit”. What should it say?',
    options: [{ id: 'a', label: 'Continue' }, { id: 'b', label: 'Pay ₹450' }, { id: 'c', label: 'Submit order now!' }],
    correct: 'b', explanation: 'Name the action and the amount at the moment people commit.',
  },
  takeaways: [
    { title: 'Verb + object', body: '“Send invite”, “Delete 3 photos”, “Pay ₹450”.' },
    { title: 'Buttons stand alone', body: 'Someone reading only the buttons should know what each one does.' },
    { title: 'Drop OK, Yes, Submit', body: 'They push people back to reread the question, and wrong taps follow.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '“Submit” is…', options: [{ id: 'a', label: 'Specific' }, { id: 'b', label: 'Vague' }], correct: 'b', explanation: 'Submit what?' },
      { id: 'q2', prompt: 'Best confirm for “Remove item?”', options: [{ id: 'a', label: 'Yes' }, { id: 'b', label: 'OK' }, { id: 'c', label: 'Remove item' }], correct: 'c', explanation: 'Repeat the action.' },
      { id: 'q3', prompt: 'A good button label starts with…', options: [{ id: 'a', label: 'A verb' }, { id: 'b', label: 'An emoji' }, { id: 'c', label: '“Please”' }, { id: 'd', label: 'The brand name' }], correct: 'a', explanation: 'Say the action first.' },
      { id: 'q4', prompt: 'The cancel option for “Delete 3 photos?”', options: [{ id: 'a', label: 'No' }, { id: 'b', label: 'Nope' }, { id: 'c', label: 'Abort' }, { id: 'd', label: 'Keep photos' }], correct: 'd', explanation: 'Specific on both sides.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why “Start free trial” over “Sign up”?', hint: 'What do I get?', options: [{ id: 'a', label: 'It says what you get, which reduces worry about paying' }, { id: 'b', label: 'It’s shorter' }, { id: 'c', label: 'It sounds more legal' }, { id: 'd', label: 'No difference' }], correct: 'a', explanation: 'Naming the outcome answers the unspoken question.' },
    { id: 'l2', prompt: 'Two buttons side by side both say “Continue”. Problem?', hint: 'Can you tell them apart?', options: [{ id: 'a', label: 'None' }, { id: 'b', label: 'People can’t tell what each leads to' }, { id: 'c', label: 'Too many words' }, { id: 'd', label: 'They need icons' }], correct: 'b', explanation: 'Each button should describe its own result.' },
    { id: 'l3', prompt: 'A destructive action button should…', hint: 'Make the risk visible.', options: [{ id: 'a', label: 'Say “OK” to stay calm' }, { id: 'b', label: 'Be the biggest, brightest button' }, { id: 'c', label: 'Name the action plainly and look different from safe actions' }, { id: 'd', label: 'Be hidden' }], correct: 'c', explanation: '“Delete account”, styled as destructive, never as the default.' },
    { id: 'l4', prompt: 'Is “Click here” ever a good link label?', hint: 'Screen readers list links on their own.', options: [{ id: 'a', label: 'Yes, always' }, { id: 'b', label: 'Yes on desktop' }, { id: 'c', label: 'Only in emails' }, { id: 'd', label: 'No: name the destination, e.g. “Read the refund policy”' }], correct: 'd', explanation: 'Descriptive links help everyone, especially screen-reader users.' },
    { id: 'l5', prompt: 'Should button labels change with the amount (“Pay ₹450” → “Pay ₹520”)?', hint: 'At the moment of paying.', options: [{ id: 'a', label: 'Yes, keeping the live amount on the button builds trust' }, { id: 'b', label: 'No, labels must be fixed' }, { id: 'c', label: 'Only for big amounts' }, { id: 'd', label: 'Only in dark mode' }], correct: 'a', explanation: 'Showing the current total right where people commit avoids surprises.' },
  ],
};

export const cw1_3: Episode = {
  lessonId: 'cw.1-3',
  hook: '“Error 4012” is a dead end. A good error message is a short set of directions out.',
  scene: {
    id: 'error-messages', duration: 34,
    beats: [
      { at: 0, title: 'Error 4012', body: 'Arjun adds his UPI ID. A red banner at the top says “Error 4012: invalid input”.' },
      { at: 6, title: 'Stuck', body: 'Which field? What’s wrong with it? He tries again, then gives up.' },
      { at: 12, title: 'What went wrong', body: 'Name the problem in plain words: the UPI ID is missing its @.' },
      { at: 17, title: 'How to fix it', body: 'Show the way out: “UPI IDs look like name@bank.”' },
      { at: 22, title: 'Right where it happened', body: 'The message moves under the field, and nothing blames him.' },
      { at: 28, title: 'Fixed in one try', body: 'He adds the @ and he’s through.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What was wrong with “Error 4012: invalid input”?', options: [{ id: 'a', label: 'It was too polite' }, { id: 'b', label: 'It didn’t say what was wrong or how to fix it' }, { id: 'c', label: 'It was too long' }],
      correct: 'b', explanation: 'A code and a vague word leave people guessing.' },
    { id: 'c2', prompt: 'Where did the fixed message appear?', options: [{ id: 'a', label: 'In a pop-up' }, { id: 'b', label: 'At the top of the page' }, { id: 'c', label: 'Under the field with the problem' }],
      correct: 'c', explanation: 'Errors belong next to the thing that needs fixing.' },
  ],
  game: {
    id: 'error-doctor', title: 'Error doctor',
    instructions: 'Each error appears under a form field. Diagnose it: what’s its problem? Then see a better version.',
    lanes: [
      { id: 'vague', label: 'Vague', hint: 'Doesn’t say what went wrong' },
      { id: 'nofix', label: 'Dead end', hint: 'Says what’s wrong but not how to fix it' },
      { id: 'blame', label: 'Blames you', hint: 'Makes it the person’s fault' },
      { id: 'good', label: 'Helpful', hint: 'What went wrong and how to fix it, kindly' },
    ],
    cards: [
      { id: 'g1', label: 'Something went wrong', lane: 'vague', note: 'We couldn’t save your address. Check your connection and try again.' },
      { id: 'g2', label: 'Password must be at least 8 characters', lane: 'good' },
      { id: 'g3', label: 'You entered an invalid phone number', lane: 'blame', note: 'Phone numbers need 10 digits.' },
      { id: 'g4', label: 'Invalid date', lane: 'nofix', note: 'Use the format DD/MM/YYYY, like 05/03/1994.' },
      { id: 'g5', label: 'Error 4012', lane: 'vague', note: 'UPI IDs need an @, like name@bank.' },
      { id: 'g6', label: 'That email is already registered. Log in instead?', lane: 'good' },
      { id: 'g7', label: 'Wrong PIN, you’ve made too many mistakes', lane: 'blame', note: 'That PIN didn’t match. You have 2 tries left.' },
      { id: 'g8', label: 'Card declined', lane: 'nofix', note: 'Your bank declined this card. Try another card or UPI.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 11.6,
    prompt: 'Arjun is stuck. What should the message say first?',
    options: [{ id: 'a', label: 'A more precise error code' }, { id: 'b', label: 'What exactly is wrong, in plain words' }, { id: 'c', label: '“Oops!”' }],
    correct: 'b', explanation: 'Start with the problem in his words, then the fix.',
  },
  takeaways: [
    { title: 'What, then how', body: 'Say what went wrong and how to fix it. Skip codes and jargon.' },
    { title: 'Put it where it happened', body: 'Show the message next to the field or action that needs fixing.' },
    { title: 'Never blame', body: '“Phone numbers need 10 digits”, not “You entered an invalid number”.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '“Invalid input” is…', options: [{ id: 'a', label: 'Helpful' }, { id: 'b', label: 'Vague' }], correct: 'b', explanation: 'Which input? Invalid how?' },
      { id: 'q2', prompt: 'A good error says…', options: [{ id: 'a', label: 'The error code' }, { id: 'b', label: 'Who’s at fault' }, { id: 'c', label: 'What went wrong and how to fix it' }], correct: 'c', explanation: 'Problem plus way out.' },
      { id: 'q3', prompt: 'Where should a field error appear?', options: [{ id: 'a', label: 'Next to the field' }, { id: 'b', label: 'In an email' }, { id: 'c', label: 'At the page top only' }, { id: 'd', label: 'In the console' }], correct: 'a', explanation: 'Close to the problem.' },
      { id: 'q4', prompt: '“You entered it wrong” is a problem because it…', options: [{ id: 'a', label: 'Is too short' }, { id: 'b', label: 'Has no code' }, { id: 'c', label: 'Is too kind' }, { id: 'd', label: 'Blames the person' }], correct: 'd', explanation: 'Describe the problem, not the person.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'When is the best time to show “Password too short”?', hint: 'Not after they hit submit on a long form.', options: [{ id: 'a', label: 'When they leave the field, or as they type' }, { id: 'b', label: 'After submitting the whole form' }, { id: 'c', label: 'Next day by email' }, { id: 'd', label: 'Never' }], correct: 'a', explanation: 'Inline, timely feedback avoids a wall of errors at the end.' },
    { id: 'l2', prompt: 'Should errors rely on red colour alone?', hint: 'Colour-blind users.', options: [{ id: 'a', label: 'Yes, red means error' }, { id: 'b', label: 'No: add an icon and text so it works without colour' }, { id: 'c', label: 'Use green instead' }, { id: 'd', label: 'Only on mobile' }], correct: 'b', explanation: 'Colour plus icon plus words reaches everyone.' },
    { id: 'l3', prompt: 'A payment fails on the bank’s side. What should the message do?', hint: 'It isn’t the user’s fault, and money matters.', options: [{ id: 'a', label: 'Say “Payment error”' }, { id: 'b', label: 'Blame the card' }, { id: 'c', label: 'Say no money was taken (if true) and offer another way to pay' }, { id: 'd', label: 'Show the bank’s raw error' }], correct: 'c', explanation: 'Answer the scary question first, then offer a way forward.' },
    { id: 'l4', prompt: 'Is “Oops! Something went wrong 🙈” a good error?', hint: 'Cute isn’t helpful.', options: [{ id: 'a', label: 'Yes, it’s friendly' }, { id: 'b', label: 'Yes, emojis calm people' }, { id: 'c', label: 'Only for kids' }, { id: 'd', label: 'No: it’s vague, and playful tone can feel dismissive when something breaks' }], correct: 'd', explanation: 'Be calm and specific when things go wrong.' },
    { id: 'l5', prompt: 'Best way to prevent an error message entirely?', hint: 'Design, not words.', options: [{ id: 'a', label: 'Constrain or guide input (e.g. a date picker, or a hint before typing)' }, { id: 'b', label: 'Hide errors' }, { id: 'c', label: 'Longer messages' }, { id: 'd', label: 'Bigger red' }], correct: 'a', explanation: 'The best error message is the one nobody needs.' },
  ],
};

export const cw1_4: Episode = {
  lessonId: 'cw.1-4',
  hook: 'An empty screen is the first thing many people see. Make it a doorway, not a dead end.',
  scene: {
    id: 'empty-states', duration: 34,
    beats: [
      { at: 0, title: '“No items.”', body: 'Meena opens “Saved recipes” for the first time. Grey text, nothing else.' },
      { at: 5, title: 'Now what?', body: 'Is it broken? What goes here? She closes the tab.' },
      { at: 10, title: 'What, why, what next', body: 'Rewrite: what this place is for, why it’s empty, and one clear action.' },
      { at: 16, title: 'Not all empties are equal', body: 'First use, all done, no results, something failed: each needs different words.' },
      { at: 24, title: 'One clear step', body: 'Every empty state ends in a single action that gets people moving.' },
      { at: 29, title: 'A doorway', body: 'Explain, then invite.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did “No items.” fail?', options: [{ id: 'a', label: 'It didn’t explain the page or what to do' }, { id: 'b', label: 'It was the wrong colour' }, { id: 'c', label: 'It was too long' }],
      correct: 'a', explanation: 'An empty state with no explanation looks broken.' },
    { id: 'c2', prompt: 'What does every empty state end with?', options: [{ id: 'a', label: 'A joke' }, { id: 'b', label: 'A list of features' }, { id: 'c', label: 'One clear next step' }],
      correct: 'c', explanation: 'One action gets people moving.' },
  ],
  game: {
    id: 'empty-match', title: 'Fill the empty',
    instructions: 'Each screen is empty for a different reason. Pick the kind of empty, and see the screen it should show.',
    lanes: [
      { id: 'first', label: 'First use', hint: 'Explain what goes here and how to start' },
      { id: 'done', label: 'All done', hint: 'Celebrate: they cleared it themselves' },
      { id: 'noresults', label: 'No results', hint: 'Suggest another search or filter' },
      { id: 'error', label: 'Couldn’t load', hint: 'Say what failed and offer a retry' },
    ],
    cards: [
      { id: 'g1', label: 'A new user opens “Saved recipes”', lane: 'first' },
      { id: 'g2', label: 'Your to-do list after ticking off every task', lane: 'done' },
      { id: 'g3', label: 'A search for “biriyani” finds nothing', lane: 'noresults' },
      { id: 'g4', label: 'Orders won’t load: you’re offline', lane: 'error' },
      { id: 'g5', label: 'Favourites before you’ve favourited anything', lane: 'first' },
      { id: 'g6', label: 'An inbox after reading every message', lane: 'done' },
      { id: 'g7', label: 'Filters “Under ₹100” and “Pure veg” leave no restaurants', lane: 'noresults' },
      { id: 'g8', label: 'Your wallet history fails to load', lane: 'error' },
    ],
  },
  gap: {
    id: 'gap', from: 5, at: 9.6,
    prompt: 'Meena thinks the page is broken. What should it say?',
    options: [{ id: 'a', label: '“No items found.”' }, { id: 'b', label: 'What saved recipes are for, and a button to browse recipes' }, { id: 'c', label: 'Nothing, keep it minimal' }],
    correct: 'b', explanation: 'Explain the place and give one way to fill it.',
  },
  takeaways: [
    { title: 'What, why, what next', body: 'Say what the place is for, why it’s empty, and give one action.' },
    { title: 'Match the reason', body: 'First use teaches, all done celebrates, no results suggests, errors offer a retry.' },
    { title: 'Never a dead end', body: 'An empty screen should always lead somewhere.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A brand-new user’s empty list is…', options: [{ id: 'a', label: 'First use' }, { id: 'b', label: 'An error' }], correct: 'a', explanation: 'Teach and invite.' },
      { id: 'q2', prompt: 'A search with no results should…', options: [{ id: 'a', label: 'Say “No items”' }, { id: 'b', label: 'Suggest other searches or clearing filters' }, { id: 'c', label: 'Show an error code' }], correct: 'b', explanation: 'Help them find something.' },
      { id: 'q3', prompt: 'An inbox someone just cleared can…', options: [{ id: 'a', label: 'Warn them' }, { id: 'b', label: 'Show an error' }, { id: 'c', label: 'Celebrate a little' }, { id: 'd', label: 'Hide the screen' }], correct: 'c', explanation: 'They did it; nice moment.' },
      { id: 'q4', prompt: 'How many main actions in an empty state?', options: [{ id: 'a', label: 'Five' }, { id: 'b', label: 'Three' }, { id: 'c', label: 'None' }, { id: 'd', label: 'One' }], correct: 'd', explanation: 'One clear next step.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Should a “couldn’t load” state look like a first-use state?', hint: 'One is broken, one is new.', options: [{ id: 'a', label: 'No: say it failed, so people don’t think their data is gone' }, { id: 'b', label: 'Yes, keep it simple' }, { id: 'c', label: 'Only offline' }, { id: 'd', label: 'Doesn’t matter' }], correct: 'a', explanation: 'Mixing them up can make people think they lost their orders.' },
    { id: 'l2', prompt: 'What could an empty state show besides words?', hint: 'Show, don’t tell.', options: [{ id: 'a', label: 'A long tutorial video' }, { id: 'b', label: 'A preview or example of what will appear here' }, { id: 'c', label: 'Ads' }, { id: 'd', label: 'Legal text' }], correct: 'b', explanation: 'A sample of the filled screen explains instantly.' },
    { id: 'l3', prompt: 'No-results page: best detail to include?', hint: 'Help them recover.', options: [{ id: 'a', label: 'A sad illustration only' }, { id: 'b', label: 'Their search, repeated in bold' }, { id: 'c', label: 'What they searched for, plus a spelling suggestion or one-tap “clear filters”' }, { id: 'd', label: 'The number zero, large' }], correct: 'c', explanation: 'Show what you tried and the quickest way out.' },
    { id: 'l4', prompt: 'Why keep empty-state copy short?', hint: 'Glance again.', options: [{ id: 'a', label: 'To save storage' }, { id: 'b', label: 'Long copy looks smart' }, { id: 'c', label: 'Translators charge per word' }, { id: 'd', label: 'People glance; one line plus one action gets read' }], correct: 'd', explanation: 'Same rule as everywhere: write for the glance.' },
    { id: 'l5', prompt: 'A team fills every empty screen with demo data. Risk?', hint: 'Whose data is it?', options: [{ id: 'a', label: 'People may confuse sample data with their own' }, { id: 'b', label: 'None' }, { id: 'c', label: 'It loads faster' }, { id: 'd', label: 'Better retention always' }], correct: 'a', explanation: 'Label samples clearly, or let people clear them easily.' },
  ],
};
