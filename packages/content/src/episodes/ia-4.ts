// Episodes for chapter ia.4 · Interaction patterns. Drafts by Claude, for review.
// One product runs through the chapter: Ishaan, the designer at Mandi (a weekly box of vegetables and fruit from farms
// around Pune, delivered on Saturdays), fixes how it feels to use: the sign-up form, the feedback when you tap, the
// packing dashboard moving from a desktop to the packers' phones, and the gestures on the weekly basket.
import type { Episode } from '../episode';

export const ia4_1: Episode = {
  lessonId: 'ia.4-1',
  hook: 'Meenal tries to sign up for Mandi on a bus and gives up at field nine. Watch the same form cut, labelled and fixed until it takes under a minute.',
  scene: {
    id: 'form-pain', duration: 34,
    beats: [
      { at: 0, title: 'Twelve fields on a bus', body: 'Meenal signs up for Mandi on the PMPML bus home. The form has twelve fields, and the clock starts.' },
      { at: 5, title: 'Where am I?', body: 'The grey “Enter here” vanishes as she types. Was that box for her name or her society?' },
      { at: 9, title: 'The wrong keyboard', body: 'Her mobile number opens the letter keyboard. She switches by hand, twice.' },
      { at: 13, title: 'Wiped on submit', body: '“Invalid input” at the top. The flat number “B/702” had a slash, and the password field is empty again.' },
      { at: 17, title: 'She leaves', body: '3 minutes 40 seconds, stopped at field nine. The vegetables stay at the shop.' },
      { at: 20, title: 'Cut first', body: 'Confirm email, gender, date of birth, “how did you hear about us”: gone or asked later. Twelve fields become six.' },
      { at: 25, title: 'Then fix what stays', body: 'Labels above the boxes, the number pad for numbers, rules shown up front, errors beside the field.' },
      { at: 30, title: 'Fifty seconds', body: 'Same bus, same Meenal. Done before her stop.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What was Ishaan’s first move on the form?', options: [{ id: 'a', label: 'Restyle the fields' }, { id: 'b', label: 'Cut every field Mandi didn’t need yet' }, { id: 'c', label: 'Add a progress bar' }],
      correct: 'b', explanation: 'The cheapest field to fill is the one that isn’t there.' },
    { id: 'c2', prompt: 'Why did the error hurt so much?', options: [{ id: 'a', label: 'It was red' }, { id: 'b', label: 'It came after submit, didn’t say which field, and cleared her password' }, { id: 'c', label: 'It was too short' }],
      correct: 'b', explanation: 'Errors should come early, sit beside the field, say how to fix it, and keep what was typed.' },
  ],
  game: {
    id: 'form-triage', title: 'Triage the form',
    instructions: 'Mandi’s sign-up form, as first drafted. For each ringed field, call the fix it needs: a label that stays, the right keyboard, better rules and errors, or cut it. The form redraws and the time to fill it drops as you go.',
    lanes: [
      { id: 'label', label: 'Label it', hint: 'A visible label above the box, not a vanishing placeholder' },
      { id: 'keyboard', label: 'Right keyboard', hint: 'Open the keypad the answer needs' },
      { id: 'error', label: 'Fix rules and errors', hint: 'Say the rule first, check early, keep what was typed' },
      { id: 'cut', label: 'Cut it', hint: 'Not needed now, or Mandi can work it out' },
    ],
    cards: [
      { id: 'g1', label: 'The name box’s only clue is grey placeholder text, “Enter here”, that vanishes as you type', visual: 'name', lane: 'label', note: 'A label above the box, “Full name”, stays while you type. One field for the whole name, not first and last.' },
      { id: 'g2', label: 'The mobile number field opens the letter keyboard', visual: 'phone', lane: 'keyboard', note: 'A number pad, with +91 already shown in front, so people type only their 10 digits.' },
      { id: 'g3', label: '“Confirm your email”: type the whole address a second time', visual: 'email2', lane: 'cut', note: 'Most people copy and paste their first attempt anyway. Show the address back on the next screen, and send a sign-in link to check it.' },
      { id: 'g4', label: 'Gender, a required dropdown', visual: 'gender', lane: 'cut', note: 'A vegetable box doesn’t need it. Every field you can’t explain to the person filling it should go.' },
      { id: 'g5', label: 'A dropdown with no label that says “Select”, for veg, eggs or non-veg', visual: 'diet', lane: 'label', note: 'Label it “What do you eat?”, and with three choices, show them as chips instead of hiding them in a dropdown.' },
      { id: 'g6', label: 'The pincode field opens the letter keyboard, and city and state are asked for separately', visual: 'pincode', lane: 'keyboard', note: 'A number pad for the six digits, and the city and state fill in from the pincode, so those two fields go too.' },
      { id: 'g7', label: 'Flat number “B/702” is rejected on submit with “Invalid input”, and the form clears', visual: 'flat', lane: 'error', note: 'Accept the slash: it’s how Pune writes flats. Check the field when the person leaves it, write the error beside it, and never wipe what they typed.' },
      { id: 'g8', label: 'The password’s rules appear only after it fails: “Invalid password”', visual: 'password', lane: 'error', note: 'Show “At least 8 characters” under the box before they type, tick it off as they go, and add a Show button so they can check it.' },
    ],
  },
  gap: {
    id: 'gap', from: 13, at: 19.6,
    prompt: 'Meenal gave up at field nine. What should Ishaan do first?',
    options: [{ id: 'a', label: 'Split the form into three pages so it looks shorter' }, { id: 'b', label: 'Remove every field Mandi doesn’t need before the first box, then fix the ones that stay' }, { id: 'c', label: 'Add a discount for finishing the form' }],
    correct: 'b', explanation: 'Splitting hides the length but keeps the work. Cutting removes it, then labels, keyboards and errors make the rest easy.',
  },
  takeaways: [
    { title: 'Cut before you polish', body: 'For each field ask: do we need it now, can we ask later, can we work it out ourselves?' },
    { title: 'Labels that stay', body: 'A short label above the box. Placeholders vanish as soon as you type.' },
    { title: 'The right keyboard', body: 'Numbers for phone and pincode, email keyboard for email. Fill the city from the pincode.' },
    { title: 'Errors that help', body: 'Rules before typing, checks when you leave a field, errors beside it, and never wipe what was typed.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A pincode field should open…', options: [{ id: 'a', label: 'The number pad' }, { id: 'b', label: 'The letter keyboard' }], correct: 'a', explanation: 'Six digits, nothing else.' },
      { id: 'q2', prompt: '“Confirm your email” is usually…', options: [{ id: 'a', label: 'Essential' }, { id: 'b', label: 'Double typing that catches little' }, { id: 'c', label: 'A legal requirement' }], correct: 'b', explanation: 'Show it back or verify it with a link instead.' },
      { id: 'q3', prompt: 'The best time to show a password’s rules is…', options: [{ id: 'a', label: 'After it fails' }, { id: 'b', label: 'In the terms and conditions' }, { id: 'c', label: 'Under the box, before typing' }], correct: 'c', explanation: 'People can’t follow a rule they haven’t seen.' },
      { id: 'q4', prompt: 'An error message should sit…', options: [{ id: 'a', label: 'At the top of the page' }, { id: 'b', label: 'Next to the field it’s about' }, { id: 'c', label: 'In a pop-up' }], correct: 'b', explanation: 'Where the person’s eyes and thumb already are.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why one “Full name” field instead of first and last?', hint: 'Think of all the names in India.', options: [{ id: 'a', label: 'It’s shorter to code' }, { id: 'b', label: 'Many people have one name, or names that don’t split into first and last' }, { id: 'c', label: 'Last names are private' }, { id: 'd', label: 'It looks nicer' }], correct: 'b', explanation: 'Names vary. One field fits everyone, and you can ask what to call them if you need to.' },
    { id: 'l2', prompt: 'Should a form check each field as you type every letter?', hint: 'Imagine an error before you’ve finished.', options: [{ id: 'a', label: 'Yes, always' }, { id: 'b', label: 'No: check when the person leaves the field, so they aren’t told off mid-word' }, { id: 'c', label: 'Only on submit' }, { id: 'd', label: 'Never check' }], correct: 'b', explanation: 'Checking on leaving the field catches mistakes early without nagging. Rules like “8 characters” can tick off live.' },
    { id: 'l3', prompt: 'Mandi needs the delivery gate instructions, but only for the first box. When should it ask?', hint: 'Sign-up or later?', options: [{ id: 'a', label: 'On the sign-up form, required' }, { id: 'b', label: 'After the first order is placed, as an optional field' }, { id: 'c', label: 'Never' }, { id: 'd', label: 'In a survey' }], correct: 'b', explanation: 'Ask for information when it’s needed and the reason is obvious. Sign-up stays short.' },
    { id: 'l4', prompt: 'Marking every field with a red asterisk tells people…', hint: 'If everything is marked…', options: [{ id: 'a', label: 'Exactly what’s needed' }, { id: 'b', label: 'Nothing useful. If most fields are required, mark the few optional ones “(optional)” instead' }, { id: 'c', label: 'That the form is secure' }, { id: 'd', label: 'That they made a mistake' }], correct: 'b', explanation: 'Mark the exception, not the rule, and spell it out in words.' },
    { id: 'l5', prompt: 'Why lay a form out in one column on a phone and on desktop?', hint: 'Where does the eye go next?', options: [{ id: 'a', label: 'Two columns don’t fit on desktop' }, { id: 'b', label: 'One column gives one clear path down the form, so fields aren’t skipped' }, { id: 'c', label: 'It’s required by WCAG' }, { id: 'd', label: 'It uses fewer fields' }], correct: 'b', explanation: 'Side-by-side fields make the eye zigzag, and people miss the one on the right.' },
  ],
};

export const ia4_2: Episode = {
  lessonId: 'ia.4-2',
  hook: 'Nobody finds “Skip this week”, and the few who do tap it three times. Watch a button learn to look like a button, then answer when it’s pressed.',
  scene: {
    id: 'press-feedback', duration: 34,
    beats: [
      { at: 0, title: 'Hidden in plain grey', body: 'Mandi’s basket screen. “Skip this week” is grey text under the list. It looks like a footnote, so people ring support instead.' },
      { at: 6, title: 'Make it look pressable', body: 'An outlined button with a verb: “Skip this week”. A clear shape is the signifier that says “press me”.' },
      { at: 11, title: 'Then nothing happens', body: 'Arjun taps it. Two seconds of nothing. He taps again, and again.' },
      { at: 15, title: 'Three taps, three requests', body: 'Skip, unskip, skip. Saturday’s box is on, then off, then on. He isn’t sure which.' },
      { at: 19, title: 'Answer every press', body: 'The button darkens the moment it’s touched, then shows “Skipping…”, and stops taking more taps.' },
      { at: 24, title: 'Match the wait', body: 'Under 0.1 s, just change. Under 1 s, show the press. Up to 10 s, a spinner with words. Longer, real progress.' },
      { at: 29, title: 'Done, and undoable', body: '“Skipped Sat 14 Dec · Undo”. Arjun knows what happened, and can take it back.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did people miss “Skip this week” at first?', options: [{ id: 'a', label: 'It looked like plain text, not something to tap' }, { id: 'b', label: 'It was at the top' }, { id: 'c', label: 'Nobody skips' }],
      correct: 'a', explanation: 'Without a signifier, an action is invisible even when it’s on screen.' },
    { id: 'c2', prompt: 'Why did Arjun tap three times?', options: [{ id: 'a', label: 'He liked tapping' }, { id: 'b', label: 'Nothing showed that his first tap had worked' }, { id: 'c', label: 'The button was too small' }],
      correct: 'b', explanation: 'With no feedback, people repeat the action, and repeated actions cause real mistakes.' },
  ],
  game: {
    id: 'wait-feedback', title: 'Feedback on the clock',
    instructions: 'Each card is an action in Mandi and how long it really takes. Pick the feedback it needs. The wait drops onto the timeline, and the phone shows what the person sees.',
    lanes: [
      { id: 'instant', label: 'Just change it', hint: 'Up to 0.1 s: the result is the feedback' },
      { id: 'pressed', label: 'Show the press', hint: 'Up to 1 s: a pressed, busy button, no spinner' },
      { id: 'spinner', label: 'Spinner with words', hint: '1–10 s: say what’s happening' },
      { id: 'progress', label: 'Progress you can leave', hint: 'Over 10 s: how far, how long, carry on meanwhile' },
    ],
    cards: [
      { id: 'g1', label: 'Tick “Leave at the door”', visual: '40', lane: 'instant', note: 'The tick appears as you tap. Anything more would be noise.' },
      { id: 'g2', label: 'Switch the box from Small to Large', visual: '60', lane: 'instant', note: 'The size and the price change in place. The change itself says it worked.' },
      { id: 'g3', label: 'Add 1 kg of tomatoes to the basket', visual: '400', lane: 'pressed', note: 'The + darkens on touch and the count goes up when the server agrees. A spinner that flashes for 0.4 s just looks like a glitch.' },
      { id: 'g4', label: 'Skip this Saturday’s box', visual: '700', lane: 'pressed', note: 'Pressed and disabled so it can’t be tapped twice, then “Skipped Sat 14 Dec · Undo”.' },
      { id: 'g5', label: 'Check that Mandi delivers to pincode 411028', visual: '2000', lane: 'spinner', note: 'A small spinner in the field with “Checking Hadapsar…”, then a tick or a clear no.' },
      { id: 'g6', label: 'Pay ₹640 by UPI', visual: '4000', lane: 'spinner', note: '“Waiting for your UPI app…”, with the amount on screen. Saying what’s happening stops people paying twice.' },
      { id: 'g7', label: 'Make a GST invoice for the month', visual: '25000', lane: 'progress', note: 'A bar with “Adding 4 of 9 orders”, and “We’ll notify you when it’s ready” so the person can leave.' },
      { id: 'g8', label: 'A farm uploads 30 photos of this week’s produce', visual: '120000', lane: 'progress', note: '“12 of 30 uploaded · about a minute left”, and the farmer can keep filling in prices meanwhile.' },
    ],
  },
  gap: {
    id: 'gap', from: 11, at: 18.6,
    prompt: 'Arjun tapped three times and doesn’t know if his box is skipped. What should the button do?',
    options: [{ id: 'a', label: 'Show a pop-up: “Please tap only once”' }, { id: 'b', label: 'Darken the instant it’s touched, say “Skipping…”, ignore extra taps, then confirm with Undo' }, { id: 'c', label: 'Make the button bigger' }],
    correct: 'b', explanation: 'Immediate feedback stops the repeat taps; a clear result and Undo settle the doubt.',
  },
  takeaways: [
    { title: 'Look like what it does', body: 'Actions look like buttons, with a verb. Things that aren’t tappable shouldn’t look tappable.' },
    { title: 'Answer every press', body: 'Show the touch at once, so nobody taps twice.' },
    { title: 'Match the wait', body: '0.1 s: just change. 1 s: show the press. 10 s: a spinner with words. Longer: progress you can leave.' },
    { title: 'Confirm, then offer Undo', body: 'Say what happened in plain words, and let people take back what’s easy to regret.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A 3-second payment needs…', options: [{ id: 'a', label: 'A spinner that says what’s happening' }, { id: 'b', label: 'Nothing' }], correct: 'a', explanation: 'Between 1 and 10 s, show work in progress.' },
      { id: 'q2', prompt: 'A signifier is…', options: [{ id: 'a', label: 'A sound effect' }, { id: 'b', label: 'The visible clue that tells you what you can do' }, { id: 'c', label: 'A loading bar' }], correct: 'b', explanation: 'A shape, label or icon that says “press”, “drag” or “type”.' },
      { id: 'q3', prompt: 'A checkbox that ticks in 40 ms needs…', options: [{ id: 'a', label: 'A spinner' }, { id: 'b', label: 'A toast' }, { id: 'c', label: 'Nothing extra: the tick is the feedback' }], correct: 'c', explanation: 'Under 0.1 s feels instant.' },
      { id: 'q4', prompt: 'For an action people may regret, prefer…', options: [{ id: 'a', label: 'Doing it with an Undo' }, { id: 'b', label: 'Two confirmation dialogs' }, { id: 'c', label: 'No feedback' }], correct: 'a', explanation: 'Undo is faster than “Are you sure?” and actually saves the mistake.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What’s the difference between an affordance and a signifier?', hint: 'One is possible, one is visible.', options: [{ id: 'a', label: 'They’re the same' }, { id: 'b', label: 'The affordance is what you can do; the signifier is the clue that shows you can' }, { id: 'c', label: 'Signifiers are only icons' }, { id: 'd', label: 'Affordances are only on desktop' }], correct: 'b', explanation: 'A link you can tap has the affordance; blue underlined text is the signifier.' },
    { id: 'l2', prompt: 'Why not show a spinner for an action that takes 0.3 s?', hint: 'How long would it be on screen?', options: [{ id: 'a', label: 'Spinners are old-fashioned' }, { id: 'b', label: 'It flashes for a moment and looks like something broke; a pressed state is enough' }, { id: 'c', label: 'Spinners slow the app down' }, { id: 'd', label: 'You should always show one' }], correct: 'b', explanation: 'Under a second, people stay in the flow. A pressed button says “got it” without the flicker.' },
    { id: 'l3', prompt: 'A card on the home screen has a shadow and a chevron, but tapping it does nothing. What’s wrong?', hint: 'What does it promise?', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'It signals an action it doesn’t have, so people tap and feel the app is broken' }, { id: 'c', label: 'The shadow is too dark' }, { id: 'd', label: 'It needs a spinner' }], correct: 'b', explanation: 'False signifiers are as bad as missing ones. Make it tappable or make it look flat.' },
    { id: 'l4', prompt: 'A photo upload will take two minutes. What matters most in its feedback?', hint: 'What will the person do meanwhile?', options: [{ id: 'a', label: 'A fun animation' }, { id: 'b', label: 'How far along it is, roughly how long is left, and that they can keep working or leave' }, { id: 'c', label: 'A sound when it ends' }, { id: 'd', label: 'Blocking the screen so they don’t interrupt it' }], correct: 'b', explanation: 'Beyond ten seconds people need to know it’s moving and that they don’t have to stare at it.' },
    { id: 'l5', prompt: 'Why make the Skip button ignore taps while it’s working?', hint: 'Remember Saturday’s box.', options: [{ id: 'a', label: 'To save battery' }, { id: 'b', label: 'Each repeated tap could send a new request and flip the result, like skip, unskip, skip' }, { id: 'c', label: 'To punish impatient users' }, { id: 'd', label: 'It’s required by Android' }], correct: 'b', explanation: 'Feedback stops most repeat taps; a busy, disabled state stops the rest doing harm.' },
  ],
};

export const ia4_3: Episode = {
  lessonId: 'ia.4-3',
  hook: 'Mandi’s packing dashboard works fine on the office PC. Watch it fall apart on a packer’s phone, then get rebuilt for a thumb.',
  scene: {
    id: 'two-devices', duration: 34,
    beats: [
      { at: 0, title: 'Built for a mouse', body: 'Rekha runs Mandi’s packing centre in Hadapsar from a desktop dashboard: hover a row for Edit, right-click to reassign, details in a side panel.' },
      { at: 6, title: 'Squeezed onto a phone', body: 'Packers now work from phones, walking between crates. The same screen, just smaller.' },
      { at: 10, title: 'No hover, no right-click', body: 'Sunil can’t find Edit: it only appeared on hover. Long-pressing does nothing.' },
      { at: 14, title: 'Tiny targets, far away', body: 'A 20 px checkbox, a crate in his other hand, and the menu up in the top corner. He ticks the wrong order.' },
      { at: 18, title: 'Where a thumb reaches', body: 'One hand on the phone: the bottom of the screen is easy, the top corners are a stretch.' },
      { at: 22, title: 'Port the interaction', body: 'Tabs move to the bottom. Rows grow to 56 px with a big “Packed” button. Hidden actions go into ⋯.' },
      { at: 27, title: 'Sheets, not panels', body: 'Order details slide up as a bottom sheet. Hover tooltips become words on the screen.' },
      { at: 31, title: 'Same jobs, different hands', body: 'The desktop stays dense for Rekha. The phone is built for Sunil’s thumb.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why couldn’t Sunil find Edit on the phone?', options: [{ id: 'a', label: 'It only appeared on hover, and a finger can’t hover' }, { id: 'b', label: 'It was deleted' }, { id: 'c', label: 'He wasn’t allowed to edit' }],
      correct: 'a', explanation: 'Anything that needs a hover is invisible on touch screens.' },
    { id: 'c2', prompt: 'Where did the tabs go in the phone version?', options: [{ id: 'a', label: 'The top' }, { id: 'b', label: 'The bottom, within thumb reach' }, { id: 'c', label: 'Behind a hamburger menu' }],
      correct: 'b', explanation: 'One-handed, the bottom of the screen is where the thumb lands easily.' },
  ],
  game: {
    id: 'port-phone', title: 'Port it to the phone',
    instructions: 'Each card is a part of Mandi’s desktop packing dashboard. Choose what it becomes on a packer’s phone: shown on the screen, moved into a ⋯ menu, opened as a bottom sheet, or moved into thumb reach. The laptop part redraws on the phone as you call it.',
    lanes: [
      { id: 'show', label: 'Show it', hint: 'Hover-only information goes on the screen' },
      { id: 'menu', label: '⋯ menu', hint: 'Secondary actions that were hidden' },
      { id: 'sheet', label: 'Bottom sheet', hint: 'Panels and pop-ups that sat beside things' },
      { id: 'thumb', label: 'Thumb reach', hint: 'Main actions and navigation: low and big' },
    ],
    cards: [
      { id: 'g1', label: 'A tooltip on hover explains that the leaf icon means “organic”', visual: 'tooltip', lane: 'show', note: 'Write “Organic” next to the leaf. An icon that needs a tooltip on desktop needs a word on a phone.' },
      { id: 'g2', label: 'Hover a row to reveal Edit and Delete', visual: 'rowhover', lane: 'menu', note: 'A ⋯ button on every row opens Edit and Delete. Visible, one tap, and out of the way.' },
      { id: 'g3', label: 'Right-click an order to reassign it to another packer', visual: 'rightclick', lane: 'menu', note: 'Phones have no right-click, and long-press is hidden. Put “Reassign” in the row’s ⋯ menu.' },
      { id: 'g4', label: 'Click a row and the order’s details slide in from the right', visual: 'panel', lane: 'sheet', note: 'A bottom sheet slides up with the details and closes back to the list, so the packer keeps his place.' },
      { id: 'g5', label: 'The delivery-date picker pops up beside the field', visual: 'popover', lane: 'sheet', note: 'A sheet from the bottom with large day buttons, where a thumb can reach them.' },
      { id: 'g6', label: 'A toolbar at the top: Orders · Crates · Riders', visual: 'toolbar', lane: 'thumb', note: 'A bottom tab bar with three tabs, each a full 56 px tall, in reach of the thumb holding the phone.' },
      { id: 'g7', label: 'A 20 px checkbox marks an order packed', visual: 'checkbox', lane: 'thumb', note: 'A full-width “Packed” button at least 48 px tall on each row, easy to hit with a crate in the other hand.' },
      { id: 'g8', label: 'Hover over a bar in the chart to read the day’s total crates', visual: 'chart', lane: 'show', note: 'Print the number on top of each bar, or show today’s total big above the chart. No hover needed.' },
    ],
  },
  gap: {
    id: 'gap', from: 14, at: 21.6,
    prompt: 'Sunil ticks the wrong order and can’t find Edit. What should Ishaan do?',
    options: [{ id: 'a', label: 'Teach packers to zoom in on the desktop layout' }, { id: 'b', label: 'Rebuild the interactions for touch: big targets low on the screen, and no hover or right-click' }, { id: 'c', label: 'Make the phone app landscape only' }],
    correct: 'b', explanation: 'A smaller desktop screen keeps the mouse’s interactions. Phones need them ported to a thumb.',
  },
  takeaways: [
    { title: 'A thumb isn’t a mouse', body: 'No hover, no right-click, a 10 mm fingertip, and an easy reach only near the bottom.' },
    { title: 'Nothing hover-only', body: 'Show the information, or put the action one tap away in a ⋯ menu.' },
    { title: 'Panels become sheets', body: 'Side panels and pop-ups become bottom sheets or full screens.' },
    { title: 'Main actions low and big', body: 'Navigation and the main action in thumb reach, at least 44–48 px tall.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'On a phone, a right-click menu becomes…', options: [{ id: 'a', label: 'A ⋯ menu on the row' }, { id: 'b', label: 'A double tap' }], correct: 'a', explanation: 'Visible, and one tap away.' },
      { id: 'q2', prompt: 'A comfortable minimum touch target is about…', options: [{ id: 'a', label: '16 px' }, { id: 'b', label: '24 px' }, { id: 'c', label: '44–48 px' }], correct: 'c', explanation: 'Apple says 44 pt, Material says 48 dp.' },
      { id: 'q3', prompt: 'Holding a phone in one hand, the easiest place to tap is…', options: [{ id: 'a', label: 'The top corners' }, { id: 'b', label: 'The bottom middle' }, { id: 'c', label: 'The very top' }], correct: 'b', explanation: 'Where the thumb rests.' },
      { id: 'q4', prompt: 'Keyboard shortcuts belong…', options: [{ id: 'a', label: 'On desktop, as extras for frequent users' }, { id: 'b', label: 'On phones' }, { id: 'c', label: 'Nowhere' }], correct: 'a', explanation: 'The pointer and keyboard allow density and speed that a thumb doesn’t.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why not just shrink the desktop layout onto the phone?', hint: 'What do the interactions need?', options: [{ id: 'a', label: 'It’s fine if the text is readable' }, { id: 'b', label: 'Hover, right-click and small targets need a mouse; the layout survives but the interactions break' }, { id: 'c', label: 'Phones can’t show tables' }, { id: 'd', label: 'It costs more' }], correct: 'b', explanation: 'Port the interaction, not the pixels.' },
    { id: 'l2', prompt: 'Rekha still uses the desktop all day. Should it copy the phone’s big buttons?', hint: 'Different hands.', options: [{ id: 'a', label: 'Yes, everything should match' }, { id: 'b', label: 'No: the desktop can stay denser, with hover, shortcuts and more rows, because a mouse allows it' }, { id: 'c', label: 'Delete the desktop version' }, { id: 'd', label: 'Make both landscape' }], correct: 'b', explanation: 'Same jobs and words on both, different interactions for different inputs.' },
    { id: 'l3', prompt: 'Is a long-press a good replacement for right-click?', hint: 'Can you see it?', options: [{ id: 'a', label: 'Yes, everyone knows it' }, { id: 'b', label: 'Only as a shortcut; the same actions must also be visible, for example in a ⋯ menu' }, { id: 'c', label: 'Yes, and hide the ⋯ menu' }, { id: 'd', label: 'Never use long-press' }], correct: 'b', explanation: 'Long-press is as invisible as hover. Keep it as an extra, not the only way.' },
    { id: 'l4', prompt: 'Where should a destructive action like “Cancel order” go on the phone?', hint: 'The thumb rests near the bottom.', options: [{ id: 'a', label: 'Big and right under the thumb, next to Packed' }, { id: 'b', label: 'Away from the main action, inside the ⋯ menu, with Undo or a confirmation' }, { id: 'c', label: 'At the top, in red' }, { id: 'd', label: 'Nowhere on mobile' }], correct: 'b', explanation: 'The easiest spot belongs to the most common, safe action. Keep risky ones a deliberate step away.' },
    { id: 'l5', prompt: 'A screen will be used on both, from one codebase. What’s the sensible way to design it?', hint: 'What changes at the breakpoint?', options: [{ id: 'a', label: 'Design desktop and let it squash' }, { id: 'b', label: 'Same content and words, with the interaction swapped at the breakpoint: hover → visible, panel → sheet, top bar → bottom tabs' }, { id: 'c', label: 'Two unrelated apps' }, { id: 'd', label: 'Design the phone and stretch it' }], correct: 'b', explanation: 'Plan both inputs together, so each gets the interaction it suits.' },
  ],
};

export const ia4_4: Episode = {
  lessonId: 'ia.4-4',
  hook: 'Swipe, drag and pinch make Mandi’s basket feel alive, until Asha aunty can’t find any of them. Watch gestures become shortcuts with a visible twin.',
  scene: {
    id: 'direct-touch', duration: 34,
    beats: [
      { at: 0, title: 'This Saturday’s box', body: 'Meenal’s basket: tomatoes, okra, spinach, mangoes. A row for each, with a photo and a kilo count.' },
      { at: 4, title: 'Drag the mangoes', body: 'She holds the mangoes and drags them into next week. The row follows her finger, and the gap opens where it will land.' },
      { at: 10, title: 'Swipe the okra away', body: 'The row slides under her thumb, red “Remove” showing behind it. Let go, and it’s gone.' },
      { at: 15, title: 'Pinch the spinach', body: 'Two fingers spread on the photo. Is it fresh? The leaves fill the screen.' },
      { at: 19, title: 'Asha aunty sees none of it', body: 'Her mother opens the same screen. No row says “swipe me”. She rings Mandi to remove the okra.' },
      { at: 24, title: 'Give every gesture a twin', body: 'A visible ⋯ on each row: Remove, Move to next week. A + and − beside the kilos. Tap the photo to see it big.' },
      { at: 29, title: 'And an Undo', body: '“Okra removed · Undo”. Swipes happen by accident; one tap puts it back.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What made the drag feel direct?', options: [{ id: 'a', label: 'The row followed her finger and showed where it would land' }, { id: 'b', label: 'A sound played' }, { id: 'c', label: 'It asked for confirmation' }],
      correct: 'a', explanation: 'Direct manipulation shows the result while you’re still moving.' },
    { id: 'c2', prompt: 'Why did Asha aunty ring Mandi?', options: [{ id: 'a', label: 'The app crashed' }, { id: 'b', label: 'Nothing on screen showed the swipe, so she couldn’t find Remove' }, { id: 'c', label: 'She wanted more okra' }],
      correct: 'b', explanation: 'Gestures are invisible. Without a visible twin, some people never find them.' },
  ],
  game: {
    id: 'gesture-map', title: 'Map the gestures',
    instructions: 'Build the interactions for Mandi’s basket screen. For each job, pick the gesture people expect. The phone plays it, then adds the visible button that does the same thing, because a gesture is never the only way.',
    lanes: [
      { id: 'tap', label: 'Tap', hint: 'Open, choose, step a number' },
      { id: 'swipe', label: 'Swipe', hint: 'Dismiss, or reveal actions on a row' },
      { id: 'drag', label: 'Drag', hint: 'Move or reorder the thing itself' },
      { id: 'pinch', label: 'Pinch', hint: 'Zoom in and out' },
    ],
    cards: [
      { id: 'g1', label: 'Open Saturday’s box to see what’s inside', lane: 'tap', note: 'A tap on the card opens it. The simplest gesture for the most common job.' },
      { id: 'g2', label: 'Add 1 kg more tomatoes', lane: 'tap', note: 'A + and − stepper. Dragging a slider to an exact kilo is fiddly; one tap per kilo is exact.' },
      { id: 'g3', label: 'Remove the okra from this week', visual: 'Remove', lane: 'swipe', note: 'Swipe left reveals Remove behind the row. The same Remove sits in the row’s ⋯ menu, with Undo after.' },
      { id: 'g4', label: 'Dismiss the “Monsoon prices” banner', visual: '✕ Close', lane: 'swipe', note: 'Swipe it away, or tap the ✕ that’s always on it.' },
      { id: 'g5', label: 'Move the mangoes to next Saturday’s box', visual: 'Move to next week', lane: 'drag', note: 'Hold and drag the row into next week; the gap opens where it will land. “Move to next week” in the ⋯ menu does the same.' },
      { id: 'g6', label: 'Put your favourite items in order', visual: 'Move up', lane: 'drag', note: 'Drag by the handle on the right, the row following your finger. Move up and Move down in the menu are the twin, and what screen-reader users need.' },
      { id: 'g7', label: 'Zoom into the spinach photo to check it’s fresh', visual: 'View full size', lane: 'pinch', note: 'Pinch to zoom, as in every photo app. A tap opens it full size for anyone who doesn’t pinch.' },
      { id: 'g8', label: 'Zoom the delivery map in to your building’s gate', visual: '+ −', lane: 'pinch', note: 'Pinch on the map, with + and − buttons in the corner for one-handed use.' },
    ],
  },
  gap: {
    id: 'gap', from: 15, at: 23.6,
    prompt: 'Asha aunty can’t find how to remove the okra. What should Ishaan change?',
    options: [{ id: 'a', label: 'Add a tutorial on first launch showing every swipe' }, { id: 'b', label: 'Keep the swipe, and add a visible ⋯ menu on each row with Remove and Move to next week' }, { id: 'c', label: 'Remove the swipe entirely' }],
    correct: 'b', explanation: 'Tutorials are skipped and forgotten. A gesture works as a shortcut when a visible control does the same job.',
  },
  takeaways: [
    { title: 'Act on the thing', body: 'Drag the item, swipe the row, pinch the photo, and show the result while the finger moves.' },
    { title: 'Use the expected gesture', body: 'Tap to open, swipe to dismiss, drag to move, pinch to zoom. Don’t invent new ones.' },
    { title: 'Every gesture has a twin', body: 'A visible button or menu item does the same job, for people who don’t know or can’t do the gesture.' },
    { title: 'Undo the accidents', body: 'Swipes and drags misfire. Make them easy to take back.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'To zoom a photo, people expect to…', options: [{ id: 'a', label: 'Pinch' }, { id: 'b', label: 'Long-press' }], correct: 'a', explanation: 'Pinch-to-zoom is learned from every photo app.' },
      { id: 'q2', prompt: 'A gesture with no visible alternative…', options: [{ id: 'a', label: 'Is cleaner' }, { id: 'b', label: 'Will be missed by many people' }, { id: 'c', label: 'Is more accessible' }], correct: 'b', explanation: 'Nothing on screen tells you it’s there.' },
      { id: 'q3', prompt: 'Direct manipulation means…', options: [{ id: 'a', label: 'Typing commands' }, { id: 'b', label: 'Using a settings page' }, { id: 'c', label: 'Moving the object itself and seeing the result as you go' }], correct: 'c', explanation: 'The thing follows your finger.' },
      { id: 'q4', prompt: 'After a swipe removes an item, show…', options: [{ id: 'a', label: 'A confirmation dialog first' }, { id: 'b', label: '“Removed · Undo”' }, { id: 'c', label: 'Nothing' }], correct: 'b', explanation: 'Fast and forgiving.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why a + and − stepper for kilos instead of a drag slider?', hint: 'How exact is a thumb?', options: [{ id: 'a', label: 'Sliders are ugly' }, { id: 'b', label: 'Dragging to an exact small number is fiddly; a tap per step is exact and easy' }, { id: 'c', label: 'Sliders can’t show kilos' }, { id: 'd', label: 'Steppers are newer' }], correct: 'b', explanation: 'Drag suits rough, continuous values; taps suit small exact counts.' },
    { id: 'l2', prompt: 'A drag-to-reorder list needs which visible twin for accessibility?', hint: 'Not everyone can drag.', options: [{ id: 'a', label: 'None' }, { id: 'b', label: 'Move up / Move down actions that a screen reader or switch user can reach' }, { id: 'c', label: 'A longer animation' }, { id: 'd', label: 'A tutorial' }], correct: 'b', explanation: 'WCAG 2.2 asks for a single-pointer alternative to any dragging movement.' },
    { id: 'l3', prompt: 'Swipe left on a row deletes it at once, with no Undo. What’s the risk?', hint: 'Think of scrolling.', options: [{ id: 'a', label: 'None' }, { id: 'b', label: 'Sideways slips while scrolling delete things by accident, and they can’t be got back' }, { id: 'c', label: 'It’s too slow' }, { id: 'd', label: 'Swipes are banned on Android' }], correct: 'b', explanation: 'Easy gestures are easy to trigger by mistake. Pair them with Undo.' },
    { id: 'l4', prompt: 'Your team wants a new two-finger twist to skip a week. Good idea?', hint: 'Who has seen it before?', options: [{ id: 'a', label: 'Yes, it’s memorable' }, { id: 'b', label: 'No: nobody expects it, nobody will find it, and a visible Skip button already does the job' }, { id: 'c', label: 'Only on tablets' }, { id: 'd', label: 'Yes, with a sound' }], correct: 'b', explanation: 'Invented gestures cost learning and give little back. Use the familiar ones.' },
    { id: 'l5', prompt: 'What makes a drag feel direct rather than clumsy?', hint: 'While the finger is down.', options: [{ id: 'a', label: 'A long delay before it starts' }, { id: 'b', label: 'The item sticks to the finger, others move aside to show where it will land, and letting go settles it there' }, { id: 'c', label: 'A dialog asking where to put it' }, { id: 'd', label: 'Vibrating the whole time' }], correct: 'b', explanation: 'Continuous, visible results while acting are the heart of direct manipulation.' },
  ],
};
