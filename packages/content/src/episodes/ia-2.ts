// Episodes for chapter ia.2 · User flows & task design. Drafts by Claude, for review.
import type { Episode } from '../episode';

export const ia2_1: Episode = {
  lessonId: 'ia.2-1',
  hook: 'Resetting a password takes four screens when everything goes right. What happens when the code expires?',
  scene: {
    id: 'happy-path', duration: 34,
    beats: [
      { at: 0, title: 'The happy path', body: 'Enter your email, type the code, choose a new password, you’re in. Four screens, nothing goes wrong.' },
      { at: 6, title: 'Real life leaves the path', body: 'A typo in the email. A code that expires. A password that’s too short. A connection that drops on Save.' },
      { at: 12, title: 'Every branch needs a way back', body: 'Each edge case gets a message and a fix that returns people to the path, not to the start.' },
      { at: 18, title: 'No dead ends', body: '“Error. Start again.” throws away everything they typed. “Send a new code” keeps them moving.' },
      { at: 24, title: 'Ask four questions', body: 'At every step: what if it’s wrong, slow, missing or interrupted?' },
      { at: 29, title: 'Design the branches', body: 'The happy path is one route. Most confusion lives on the branches, so draw them on purpose.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What is the happy path?', options: [{ id: 'a', label: 'The route where nothing goes wrong' }, { id: 'b', label: 'The most colourful screens' }, { id: 'c', label: 'Every possible route' }],
      correct: 'a', explanation: 'It’s the one route where every step succeeds.' },
    { id: 'c2', prompt: 'Where should an edge-case branch lead?', options: [{ id: 'a', label: 'Back to the very first screen' }, { id: 'b', label: 'A fix that returns people to the path' }, { id: 'c', label: 'Nowhere: show an error and stop' }],
      correct: 'b', explanation: 'Recover in place so nothing they did is lost.' },
  ],
  game: {
    id: 'edge-branch', title: 'Branch the flow',
    instructions: 'Here’s the happy path for resetting a password. Each card is something that goes wrong. Tap the step where it happens, and its recovery branch grows from there.',
    lanes: [
      { id: 'email', label: 'Enter email', hint: 'Typing the address' },
      { id: 'code', label: 'Enter code', hint: 'Waiting for and typing the code' },
      { id: 'password', label: 'New password', hint: 'Choosing and saving it' },
      { id: 'done', label: 'Signed in', hint: 'After the reset' },
    ],
    cards: [
      { id: 'g1', label: 'They type gmial.com instead of gmail.com', lane: 'email', note: 'Suggest “Did you mean gmail.com?” before sending anything.' },
      { id: 'g2', label: 'The email has no account', lane: 'email', note: 'Say “If an account exists, we’ve sent a code”, so you never reveal who has an account.' },
      { id: 'g3', label: 'The code never arrives', lane: 'code', note: 'Show a resend timer and a hint to check spam.' },
      { id: 'g4', label: 'The code expired after 10 minutes', lane: 'code', note: 'Say it expired and offer “Send a new code” on the same screen.' },
      { id: 'g5', label: 'The new password is too short', lane: 'password', note: 'Show the rule before they type and check it as they go.' },
      { id: 'g6', label: 'The connection drops as they tap Save', lane: 'password', note: 'Keep what they typed and offer “Try again” when the connection returns.' },
      { id: 'g7', label: 'They’re still signed in on an old phone', lane: 'done', note: 'Ask whether to sign out of other devices.' },
      { id: 'g8', label: 'They were halfway through checkout before resetting', lane: 'done', note: 'Return them to checkout, not to the home screen.' },
    ],
  },
  gap: {
    id: 'gap', from: 12, at: 19.6,
    prompt: 'The expired-code branch ends in “Error. Start again.” What should replace it?',
    options: [{ id: 'a', label: 'A bigger red error' }, { id: 'b', label: '“Send a new code”, then back to the code step' }, { id: 'c', label: 'Lock the account for safety' }],
    correct: 'b', explanation: 'Fix it in place so they rejoin the happy path without starting over.',
  },
  takeaways: [
    { title: 'Happy path first', body: 'Map the route where everything works, step by step.' },
    { title: 'Then every branch', body: 'At each step ask: what if it’s wrong, slow, missing or interrupted?' },
    { title: 'Always a way back', body: 'Each branch explains what happened and returns people to the path.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '“The code expired” is…', options: [{ id: 'a', label: 'Happy path' }, { id: 'b', label: 'An edge case' }], correct: 'b', explanation: 'Something went wrong.' },
      { id: 'q2', prompt: 'A dead end is a branch that…', options: [{ id: 'a', label: 'Has no way back to the path' }, { id: 'b', label: 'Is very short' }, { id: 'c', label: 'Uses red' }], correct: 'a', explanation: 'People get stuck.' },
      { id: 'q3', prompt: 'For an email with no account, the safest message is…', options: [{ id: 'a', label: '“No account with that email”' }, { id: 'b', label: '“Error 404”' }, { id: 'c', label: '“If an account exists, we’ve sent a code”' }], correct: 'c', explanation: 'Don’t reveal who has an account.' },
      { id: 'q4', prompt: 'After a reset mid-checkout, send them…', options: [{ id: 'a', label: 'To the home screen' }, { id: 'b', label: 'To settings' }, { id: 'c', label: 'To a survey' }, { id: 'd', label: 'Back to checkout' }], correct: 'd', explanation: 'Return them to their task.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What is a user flow?', hint: 'Think of a route.', options: [{ id: 'a', label: 'The steps someone takes through a product to finish a task' }, { id: 'b', label: 'A colour palette' }, { id: 'c', label: 'A list of every screen' }, { id: 'd', label: 'The company org chart' }], correct: 'a', explanation: 'A flow follows one task from start to finish.' },
    { id: 'l2', prompt: 'Why do edge cases deserve design time?', hint: 'Where do people get stuck?', options: [{ id: 'a', label: 'They look nice in a portfolio' }, { id: 'b', label: 'Most confusion and support requests happen there' }, { id: 'c', label: 'Engineers enjoy them' }, { id: 'd', label: 'They don’t; ship the happy path' }], correct: 'b', explanation: 'Real use leaves the happy path often.' },
    { id: 'l3', prompt: 'Which question finds the most edge cases at a step?', hint: 'Four ways things go wrong.', options: [{ id: 'a', label: '“Is it on brand?”' }, { id: 'b', label: '“Can we add a feature?”' }, { id: 'c', label: '“What if it’s wrong, slow, missing or interrupted?”' }, { id: 'd', label: '“What colour is the button?”' }], correct: 'c', explanation: 'These four cover most real failures.' },
    { id: 'l4', prompt: 'A password rule is only shown after someone fails it. What’s better?', hint: 'Prevent, don’t punish.', options: [{ id: 'a', label: 'Hide the rule completely' }, { id: 'b', label: 'Clear the field after each failure' }, { id: 'c', label: 'Add more rules' }, { id: 'd', label: 'Show the rule up front and check it as they type' }], correct: 'd', explanation: 'Preventing the error beats explaining it later.' },
    { id: 'l5', prompt: 'How do you draw an edge case on a flow diagram?', hint: 'Branch and return.', options: [{ id: 'a', label: 'A branch from the step where it happens, with an arrow back to the path' }, { id: 'b', label: 'A note at the bottom of the page' }, { id: 'c', label: 'A separate diagram nobody links to' }, { id: 'd', label: 'You don’t draw them' }], correct: 'a', explanation: 'Show where it starts and how people get back.' },
  ],
};

export const ia2_2: Episode = {
  lessonId: 'ia.2-2',
  hook: 'Eleven screens stand between a hungry student and their first ₹99 lunch. How many do they really need?',
  scene: {
    id: 'fewer-steps', duration: 34,
    beats: [
      { at: 0, title: 'Eleven screens', body: 'A lunch app’s first order: carousel, account, name, phone, code, diet, address, newsletter, photo, rating, review. People drop off at every one.' },
      { at: 6, title: 'Cut', body: 'The carousel, the newsletter screen and the rating pop-up add nothing to ordering. Gone.' },
      { at: 11, title: 'Merge', body: 'Name and phone sit on separate screens. Put them on one: “Your details”.' },
      { at: 15, title: 'Defer', body: 'An account before browsing, dietary preferences, a profile photo: ask after the first order, once lunch has arrived.' },
      { at: 20, title: 'Too far', body: 'Squash it all into one long form and people lose their place, miss errors and pay for the wrong address.' },
      { at: 25, title: 'Keep what builds trust', body: 'Verifying the phone, the address and the review before paying stay. Four clear screens.' },
      { at: 29, title: 'Cut, merge, defer, keep', body: 'Ask it of every step. Fewer screens is good; fewer mistakes is the goal.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What happened to dietary preferences?', options: [{ id: 'a', label: 'Deleted forever' }, { id: 'b', label: 'Moved to after the first order' }, { id: 'c', label: 'Put on the first screen' }],
      correct: 'b', explanation: 'Deferred until the user has had value.' },
    { id: 'c2', prompt: 'Why did the one long form go wrong?', options: [{ id: 'a', label: 'People lost their place and missed errors' }, { id: 'b', label: 'It was too fast' }, { id: 'c', label: 'It had too few fields' }],
      correct: 'a', explanation: 'Fewer screens isn’t the goal; clarity is.' },
  ],
  game: {
    id: 'step-trim', title: 'Trim the flow',
    instructions: 'Here’s the eleven-screen first order. For each screen, decide: cut it, merge it with a neighbour, defer it until after the first order, or keep it.',
    lanes: [
      { id: 'cut', label: 'Cut', hint: 'Adds nothing to the task' },
      { id: 'merge', label: 'Merge', hint: 'Combine with a neighbour' },
      { id: 'defer', label: 'Defer', hint: 'Ask after the first order' },
      { id: 'keep', label: 'Keep', hint: 'Prevents mistakes or builds trust' },
    ],
    cards: [
      { id: 'g1', label: 'A three-slide welcome carousel', visual: 'Welcome', lane: 'cut', note: 'Nobody needs a tour to order lunch. Show the menu.' },
      { id: 'g2', label: 'Create an account before you can see the menu', visual: 'Account', lane: 'defer', note: 'Let people browse first; ask for details at checkout.' },
      { id: 'g3', label: 'Your name, on its own screen', visual: 'Name', lane: 'merge', note: 'One “Your details” screen with name and phone together.' },
      { id: 'g4', label: 'Your phone number, on its own screen', visual: 'Phone', lane: 'merge', note: 'It belongs with the name on “Your details”.' },
      { id: 'g5', label: 'Type the code sent to your phone', visual: 'Verify', lane: 'keep', note: 'The rider needs a working number to call when they arrive.' },
      { id: 'g6', label: 'Choose your dietary preferences', visual: 'Diet', lane: 'defer', note: 'Ask after the first lunch, when it can tune next week’s menu.' },
      { id: 'g7', label: 'Pick your hostel or delivery address', visual: 'Address', lane: 'keep', note: 'No address, no lunch. It stays.' },
      { id: 'g8', label: 'Sign up for our newsletter', visual: 'Newsletter', lane: 'cut', note: 'Unrelated to ordering. A tick box later, at most.' },
      { id: 'g9', label: 'Upload a profile photo', visual: 'Photo', lane: 'defer', note: 'Nice to have; ask once they’re a regular.' },
      { id: 'g10', label: '“Rate our app” before you’ve eaten', visual: 'Rate us', lane: 'cut', note: 'Asking for a rating before any value just annoys people.' },
      { id: 'g11', label: 'Review your order and total before paying', visual: 'Review', lane: 'keep', note: 'One calm look at what they’re paying for prevents costly mistakes.' },
    ],
  },
  gap: {
    id: 'gap', from: 15, at: 19.8,
    prompt: 'The team wants to go further and put every remaining question on one long form. Good idea?',
    options: [{ id: 'a', label: 'Yes, one screen is always best' }, { id: 'b', label: 'No: people lose their place and miss errors; keep a few clear steps' }, { id: 'c', label: 'Yes, and remove the review step too' }],
    correct: 'b', explanation: 'Shorter isn’t the goal; less effort and fewer mistakes are.',
  },
  takeaways: [
    { title: 'Cut', body: 'Remove steps that do nothing for the task.' },
    { title: 'Merge and defer', body: 'Combine neighbours; ask for nice-to-haves after the user gets value.' },
    { title: 'Keep the trust steps', body: 'Reviews and confirmations prevent mistakes. Clarity beats a lower step count.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A welcome carousel before ordering: cut or keep?', options: [{ id: 'a', label: 'Cut' }, { id: 'b', label: 'Keep' }], correct: 'a', explanation: 'It adds nothing to the task.' },
      { id: 'q2', prompt: 'Name and phone on separate screens should be…', options: [{ id: 'a', label: 'Cut' }, { id: 'b', label: 'Merged' }, { id: 'c', label: 'Deferred' }], correct: 'b', explanation: 'They belong together.' },
      { id: 'q3', prompt: 'The order review before paying should be…', options: [{ id: 'a', label: 'Cut' }, { id: 'b', label: 'Deferred' }, { id: 'c', label: 'Kept' }], correct: 'c', explanation: 'It prevents costly mistakes.' },
      { id: 'q4', prompt: '“Defer” means…', options: [{ id: 'a', label: 'Delete' }, { id: 'b', label: 'Ask after the user gets value' }, { id: 'c', label: 'Ask twice' }, { id: 'd', label: 'Hide behind a menu' }], correct: 'b', explanation: 'Later, not never.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why does each extra screen matter?', hint: 'Every step is a choice to continue.', options: [{ id: 'a', label: 'It doesn’t' }, { id: 'b', label: 'It costs more to host' }, { id: 'c', label: 'Each one is a chance for people to give up' }, { id: 'd', label: 'Screens are slow to draw' }], correct: 'c', explanation: 'Drop-off adds up step by step.' },
    { id: 'l2', prompt: 'What’s the best moment to ask for optional details?', hint: 'After value.', options: [{ id: 'a', label: 'After the user has got what they came for' }, { id: 'b', label: 'Before they can see anything' }, { id: 'c', label: 'Never' }, { id: 'd', label: 'In a pop-up on every screen' }], correct: 'a', explanation: 'People share more once they trust you.' },
    { id: 'l3', prompt: 'Which step is most worth keeping, even though it adds a screen?', hint: 'Prevents expensive mistakes.', options: [{ id: 'a', label: 'A newsletter sign-up' }, { id: 'b', label: 'A review of the order and total before paying' }, { id: 'c', label: 'A welcome video' }, { id: 'd', label: 'A rating request' }], correct: 'b', explanation: 'Confirming money and address protects the user.' },
    { id: 'l4', prompt: 'How can you remove typing without removing a step?', hint: 'Let the product do the work.', options: [{ id: 'a', label: 'Make the fields smaller' }, { id: 'b', label: 'Hide the labels' }, { id: 'c', label: 'Ask the same question twice' }, { id: 'd', label: 'Smart defaults and autofill, like picking from known hostels' }], correct: 'd', explanation: 'Fewer decisions per step is also “fewer steps”.' },
    { id: 'l5', prompt: 'How do you know a trimmed flow is actually better?', hint: 'Measure the task.', options: [{ id: 'a', label: 'Count the screens' }, { id: 'b', label: 'Ask the team' }, { id: 'c', label: 'Test it: completion rate, time and errors' }, { id: 'd', label: 'It looks cleaner' }], correct: 'c', explanation: 'Fewer screens only matters if more people finish, correctly.' },
  ],
};

export const ia2_3: Episode = {
  lessonId: 'ia.2-3',
  hook: 'The orders screen looked perfect in the mock-up. Then a new user opened it and saw a blank page.',
  scene: {
    id: 'ui-states', duration: 34,
    beats: [
      { at: 0, title: 'The perfect mock-up', body: 'A full list of past orders, every photo loaded. Then a brand-new user opens it: a blank screen.' },
      { at: 6, title: 'Empty', body: '“No orders yet.” Say what will appear here and how to start: “Browse this week’s menu”.' },
      { at: 12, title: 'Loading', body: 'Grey blocks shaped like the list show progress, and nothing jumps when the real data lands.' },
      { at: 17, title: 'Error', body: '“Couldn’t load your orders. Check your connection.” What happened, and a Try again button.' },
      { at: 22, title: 'Success', body: '“Order placed. Arrives at 12:30.” Confirm what changed and what happens next.' },
      { at: 26, title: 'One screen, five moments', body: 'Empty, loading, then the list or an error, and retry leads back to loading. Design every box.' },
      { at: 29, title: 'Design every state', body: 'A screen isn’t done until its empty, loading, error and success states are.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What should an empty state do?', options: [{ id: 'a', label: 'Stay blank' }, { id: 'b', label: 'Say what will appear and how to start' }, { id: 'c', label: 'Show an error' }],
      correct: 'b', explanation: 'Turn nothing into a next step.' },
    { id: 'c2', prompt: 'Why use placeholder blocks while loading?', options: [{ id: 'a', label: 'They show progress and stop the layout jumping' }, { id: 'b', label: 'They look like adverts' }, { id: 'c', label: 'They load faster' }],
      correct: 'a', explanation: 'The shape stays steady.' },
  ],
  game: {
    id: 'state-pick', title: 'Pick the state',
    instructions: 'Each card is a moment in a lunch app. Which state should the screen show? Pick one, and the phone shows how it should look.',
    lanes: [
      { id: 'empty', label: 'Empty', hint: 'Nothing here yet' },
      { id: 'loading', label: 'Loading', hint: 'On its way' },
      { id: 'error', label: 'Error', hint: 'Something went wrong' },
      { id: 'success', label: 'Success', hint: 'It worked' },
    ],
    cards: [
      { id: 'g1', visual: 'No orders yet|Your lunches will show up here.|Browse this week’s menu', label: 'A new user opens Orders before ordering anything', lane: 'empty', note: '“No orders yet” with a button to browse this week’s menu.' },
      { id: 'g2', label: 'The menu is on its way and takes two seconds', lane: 'loading', note: 'Placeholder cards in the shape of the menu.' },
      { id: 'g3', visual: 'Couldn’t load your orders|Check your connection.|Try again', label: 'The connection dropped while loading orders', lane: 'error', note: 'Say what happened and offer Try again.' },
      { id: 'g4', visual: 'Order placed|Arrives at 12:30', label: 'The payment went through', lane: 'success', note: 'Confirm the order and when it arrives.' },
      { id: 'g5', visual: 'No dishes match “paneer”|Try “dal” or “rajma”.|Clear search', label: 'A search for “paneer” matches nothing', lane: 'empty', note: 'Say nothing matched and suggest similar dishes.' },
      { id: 'g6', label: 'They tapped Pay and the bank is confirming', lane: 'loading', note: 'Show progress and disable the button so they don’t pay twice.' },
      { id: 'g7', visual: 'Card declined|Your order is saved.|Pay with UPI', label: 'The bank declined the card', lane: 'error', note: 'Say it was declined, keep the order, and offer another way to pay.' },
      { id: 'g8', visual: 'Address saved|Hostel B, room 214', label: 'Their new hostel address was saved', lane: 'success', note: 'A short confirmation, then back to what they were doing.' },
    ],
  },
  gap: {
    id: 'gap', from: 12, at: 16.6,
    prompt: 'The connection drops while the orders load. What should the screen show?',
    options: [{ id: 'a', label: 'The loading blocks forever' }, { id: 'b', label: 'A blank page' }, { id: 'c', label: 'What happened, and a Try again button' }],
    correct: 'c', explanation: 'Explain the problem and give a way forward.',
  },
  takeaways: [
    { title: 'Empty', body: 'Say what will appear and how to start.' },
    { title: 'Loading and error', body: 'Show progress in the content’s shape; on failure, say what happened and how to retry.' },
    { title: 'Success', body: 'Confirm what changed and what happens next.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '“The bank declined the card” is…', options: [{ id: 'a', label: 'An error state' }, { id: 'b', label: 'An empty state' }], correct: 'a', explanation: 'Something went wrong.' },
      { id: 'q2', prompt: 'A first-time user with no orders sees…', options: [{ id: 'a', label: 'A loading state' }, { id: 'b', label: 'A success state' }, { id: 'c', label: 'An empty state' }], correct: 'c', explanation: 'No data yet.' },
      { id: 'q3', prompt: 'While Pay is processing, the button should…', options: [{ id: 'a', label: 'Stay tappable' }, { id: 'b', label: 'Show progress and be disabled' }, { id: 'c', label: 'Disappear' }], correct: 'b', explanation: 'So nobody pays twice.' },
      { id: 'q4', prompt: 'A good error message includes…', options: [{ id: 'a', label: 'An error code only' }, { id: 'b', label: 'A joke' }, { id: 'c', label: 'Blame' }, { id: 'd', label: 'What happened and how to fix it' }], correct: 'd', explanation: 'Explain and offer a way forward.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Which four states should most data screens have?', hint: 'Before, during, broken, done.', options: [{ id: 'a', label: 'Empty, loading, error, success' }, { id: 'b', label: 'Light, dark, blue, green' }, { id: 'c', label: 'Small, medium, large, huge' }, { id: 'd', label: 'Draft, review, final, archived' }], correct: 'a', explanation: 'Every screen with data passes through these.' },
    { id: 'l2', prompt: 'Why does a skeleton screen often feel faster than a spinner?', hint: 'Shape and progress.', options: [{ id: 'a', label: 'It really loads faster' }, { id: 'b', label: 'It shows the layout coming, so waiting feels shorter' }, { id: 'c', label: 'It uses less battery' }, { id: 'd', label: 'Spinners are banned' }], correct: 'b', explanation: 'Visible progress shortens perceived waits.' },
    { id: 'l3', prompt: 'A search has no results. What makes the empty state useful?', hint: 'Give a next step.', options: [{ id: 'a', label: 'A big “0”' }, { id: 'b', label: 'An error icon' }, { id: 'c', label: 'Say nothing matched and suggest something close' }, { id: 'd', label: 'Clear the search box' }], correct: 'c', explanation: 'Help them find what they wanted.' },
    { id: 'l4', prompt: 'Some orders loaded but the photos failed. What state is that?', hint: 'Not all-or-nothing.', options: [{ id: 'a', label: 'Full error: hide everything' }, { id: 'b', label: 'Empty' }, { id: 'c', label: 'Success' }, { id: 'd', label: 'A partial state: show what loaded, mark what didn’t' }], correct: 'd', explanation: 'Real screens often half-work; design for that too.' },
    { id: 'l5', prompt: 'When should states be designed?', hint: 'Before engineers guess.', options: [{ id: 'a', label: 'Alongside the main screen, before it’s built' }, { id: 'b', label: 'After launch, if users complain' }, { id: 'c', label: 'Only for error pages' }, { id: 'd', label: 'Never; engineers handle them' }], correct: 'a', explanation: 'Otherwise someone designs them by accident.' },
  ],
};
