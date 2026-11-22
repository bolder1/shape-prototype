// Episodes for chapter ia.1 · Information architecture. Drafts by Claude, for review.
import type { Episode } from '../episode';

export const ia1_1: Episode = {
  lessonId: 'ia.1-1',
  hook: 'Everyone carries a map of your product in their head. It’s rarely the map your team drew.',
  scene: {
    id: 'mental-models', duration: 34,
    beats: [
      { at: 0, title: 'Meera wants to pay a bill', body: 'In her head the task is simple: “pay my electricity bill”. So she looks for “Pay bills”.' },
      { at: 5, title: 'The app’s map', body: 'The menu was built the way the bank is built: BBPS services, IMPS/NEFT, KYC. Correct, and meaningless to her.' },
      { at: 11, title: 'Two maps, one gap', body: 'She taps around and gives up. Nothing is broken. The two maps just don’t match.' },
      { at: 19, title: 'Learn her map', body: 'The designer watches people like Meera and writes down their words for each task.' },
      { at: 24, title: 'Speak her language', body: 'Same features, new labels: Pay bills, Send money, Verify your ID. She finds it in one tap.' },
      { at: 30, title: 'Match the model', body: 'Organise and name things the way people already think about them.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why couldn’t Meera find the bill payment?', options: [{ id: 'a', label: 'The feature was broken' }, { id: 'b', label: 'The menu used the bank’s words, not hers' }, { id: 'c', label: 'She doesn’t use phones' }],
      correct: 'b', explanation: 'The feature worked. The labels matched the company’s model instead of hers.' },
    { id: 'c2', prompt: 'How did the designer find the right labels?', options: [{ id: 'a', label: 'From the database' }, { id: 'b', label: 'From a brainstorm' }, { id: 'c', label: 'By watching people and noting their words' }],
      correct: 'c', explanation: 'A mental model lives in people’s heads, so you learn it from people.' },
  ],
  game: {
    id: 'jargon-swap', title: 'Jargon swap',
    instructions: 'Each label lands on the menu. Does it speak like the user, or like the system? Swap every system label for the words people use.',
    lanes: [
      { id: 'sys', label: 'System talk', hint: 'Named after how the company or code is built' },
      { id: 'user', label: 'User talk', hint: 'Named after what people want to do' },
    ],
    cards: [
      { id: 'g1', label: 'BBPS services', lane: 'sys', note: 'Pay bills' },
      { id: 'g2', label: 'Send money', lane: 'user' },
      { id: 'g3', label: 'Initiate IMPS transfer', lane: 'sys', note: 'Transfer to a bank account' },
      { id: 'g4', label: 'Track my order', lane: 'user' },
      { id: 'g5', label: 'Fulfilment status', lane: 'sys', note: 'Where’s my order?' },
      { id: 'g6', label: 'Saved addresses', lane: 'user' },
      { id: 'g7', label: 'KYC module', lane: 'sys', note: 'Verify your ID' },
      { id: 'g8', label: 'Help with a payment', lane: 'user' },
      { id: 'g9', label: 'Ticketing portal', lane: 'sys', note: 'Get help' },
    ],
  },
  gap: {
    id: 'gap', from: 11, at: 18.6,
    prompt: 'Meera gave up looking. What should the team do?',
    options: [{ id: 'a', label: 'Add a tutorial that explains the menu' }, { id: 'b', label: 'Learn how people like Meera think about the task, then rename and regroup' }, { id: 'c', label: 'Make the menu icons bigger' }],
    correct: 'b', explanation: 'A tutorial teaches people the company’s map. It’s better to redraw the map to match theirs.',
  },
  takeaways: [
    { title: 'Two maps', body: 'People navigate with their mental model. Your team built the product with another one.' },
    { title: 'Learn theirs', body: 'Watch and ask real people. Their words for a task are your best labels.' },
    { title: 'Drop the jargon', body: 'Name things after goals (“Pay bills”), not systems (“BBPS services”).' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '“Fulfilment status” is…', options: [{ id: 'a', label: 'User talk' }, { id: 'b', label: 'System talk' }], correct: 'b', explanation: 'People say “Where’s my order?”.' },
      { id: 'q2', prompt: 'A mental model is…', options: [{ id: 'a', label: 'What people believe about how something is organised' }, { id: 'b', label: 'A 3D model' }, { id: 'c', label: 'The database schema' }], correct: 'a', explanation: 'It’s the map in their head.' },
      { id: 'q3', prompt: 'Best source for menu labels?', options: [{ id: 'a', label: 'The org chart' }, { id: 'b', label: 'Engineering names' }, { id: 'c', label: 'Words users say in research' }, { id: 'd', label: 'Competitor slogans' }], correct: 'c', explanation: 'Their words match their model.' },
      { id: 'q4', prompt: 'People can’t find a working feature. Likely cause?', options: [{ id: 'a', label: 'A bug' }, { id: 'b', label: 'Slow servers' }, { id: 'c', label: 'Dark mode' }, { id: 'd', label: 'A mismatch between their model and yours' }], correct: 'd', explanation: 'Findability problems are usually model problems.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Which label matches a user’s mental model?', hint: 'Which one is a goal?', options: [{ id: 'a', label: 'SKU catalogue' }, { id: 'b', label: 'Shop by category' }, { id: 'c', label: 'Inventory API' }, { id: 'd', label: 'Merchant ledger' }], correct: 'b', explanation: 'It names what people want to do.' },
    { id: 'l2', prompt: 'Why do teams drift into system talk?', hint: 'What do they hear every day at work?', options: [{ id: 'a', label: 'They use internal names every day and stop noticing them' }, { id: 'b', label: 'Users ask for jargon' }, { id: 'c', label: 'It’s shorter' }, { id: 'd', label: 'Laws require it' }], correct: 'a', explanation: 'Internal words feel normal to the people who use them all day.' },
    { id: 'l3', prompt: 'Two user groups have different models (shop owners vs. shoppers). What do you do?', hint: 'One map can’t fit both.', options: [{ id: 'a', label: 'Use the founder’s model' }, { id: 'b', label: 'Average the two' }, { id: 'c', label: 'Design separate entry points or labels for each group' }, { id: 'd', label: 'Ignore one group' }], correct: 'c', explanation: 'When groups think differently, give each a path that fits their model.' },
    { id: 'l4', prompt: 'Should you ever change a user’s mental model?', hint: 'Think of something truly new.', options: [{ id: 'a', label: 'Never' }, { id: 'b', label: 'Always, users are wrong' }, { id: 'c', label: 'Only by hiding features' }, { id: 'd', label: 'Sometimes, for a genuinely new concept, with clear cues that build on what they know' }], correct: 'd', explanation: 'New ideas need a new model. Bridge it from familiar ones (UPI built on “send money”).' },
    { id: 'l5', prompt: 'A tree test shows 70% look for “Refunds” under “Orders”, but it lives under “Payments”. Best fix?', hint: 'Follow the majority, help the rest.', options: [{ id: 'a', label: 'Move it under Orders and link it from Payments' }, { id: 'b', label: 'Keep it, people will learn' }, { id: 'c', label: 'Rename Payments to Refunds' }, { id: 'd', label: 'Add a pop-up' }], correct: 'a', explanation: 'Put it where most people look, and add a cross-link for the rest.' },
  ],
};

export const ia1_2: Episode = {
  lessonId: 'ia.1-2',
  hook: 'Don’t guess how people group things. Hand them the cards and watch.',
  scene: {
    id: 'card-sort', duration: 34,
    beats: [
      { at: 0, title: 'Nine cards, no groups', body: 'A shopping app’s account area has grown into a list nobody can scan. How should it be grouped?' },
      { at: 5, title: 'Open sort', body: 'One person sorts the cards into piles and names each pile in their own words.' },
      { at: 12, title: 'Twenty people, one pattern', body: 'Sort after sort, the same piles keep forming. Agreement shows where each card belongs.' },
      { at: 19, title: 'A split is data too', body: '“Gift card balance” lands in Payments for some people and My account for others. People see it two ways.' },
      { at: 25, title: 'Closed sort to check', body: 'Now people sort into your draft groups. Most cards find a home. A few need a better label.' },
      { at: 30, title: 'Their groups, your structure', body: 'Open sorts discover. Closed sorts confirm.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'In an open sort, who names the groups?', options: [{ id: 'a', label: 'The participants' }, { id: 'b', label: 'The designer' }, { id: 'c', label: 'Nobody' }],
      correct: 'a', explanation: 'Open sorts let people create and name groups, which shows their mental model.' },
    { id: 'c2', prompt: 'What did the split on “Gift card balance” mean?', options: [{ id: 'a', label: 'The study failed' }, { id: 'b', label: 'The card is wrong' }, { id: 'c', label: 'People see the card in two ways' }],
      correct: 'c', explanation: 'Low agreement is a finding: the label or its home is ambiguous.' },
  ],
  game: {
    id: 'crowd-sort', title: 'Sort like the crowd',
    instructions: 'Twenty people already sorted these cards. Put each card where you think most of them did, then see how the crowd voted.',
    lanes: [
      { id: 'orders', label: 'Orders', hint: 'Things you bought and what happens to them' },
      { id: 'pay', label: 'Payments', hint: 'How you pay and get money back' },
      { id: 'me', label: 'My account', hint: 'You, your details and your preferences' },
    ],
    cards: [
      { id: 'g1', label: 'Track a package', lane: 'orders', agree: 95 },
      { id: 'g2', label: 'Return an item', lane: 'orders', agree: 85 },
      { id: 'g3', label: 'Refund status', lane: 'orders', agree: 60, note: 'Split with Payments: link it from both.' },
      { id: 'g4', label: 'Saved cards', lane: 'pay', agree: 90 },
      { id: 'g5', label: 'UPI settings', lane: 'pay', agree: 85 },
      { id: 'g6', label: 'Gift card balance', lane: 'pay', agree: 55, note: 'Nearly half put it with My account. Test the label.' },
      { id: 'g7', label: 'Change phone number', lane: 'me', agree: 90 },
      { id: 'g8', label: 'Saved addresses', lane: 'me', agree: 70, note: 'Some looked under Orders, where addresses get used.' },
      { id: 'g9', label: 'Notification settings', lane: 'me', agree: 80 },
    ],
  },
  gap: {
    id: 'gap', from: 19, at: 24.6,
    prompt: 'People split on “Gift card balance”. What now?',
    options: [{ id: 'a', label: 'Ignore it, pick one at random' }, { id: 'b', label: 'Delete the feature' }, { id: 'c', label: 'Try a clearer label, or make it findable from both groups' }],
    correct: 'c', explanation: 'A split tells you people expect it in more than one place. Clarify the label, or cross-link it.',
  },
  takeaways: [
    { title: 'Open sorts discover', body: 'People make and name their own groups, revealing their mental model.' },
    { title: 'Agreement is the signal', body: 'Cards most people group together have a clear home. Splits need attention.' },
    { title: 'Closed sorts confirm', body: 'Check your draft categories by asking people to sort into them.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'You have no categories yet. Run…', options: [{ id: 'a', label: 'A closed sort' }, { id: 'b', label: 'An open sort' }], correct: 'b', explanation: 'Open sorts discover groups.' },
      { id: 'q2', prompt: '90% put a card in one group. That card…', options: [{ id: 'a', label: 'Has a clear home' }, { id: 'b', label: 'Is confusing' }, { id: 'c', label: 'Should be deleted' }], correct: 'a', explanation: 'High agreement means a clear home.' },
      { id: 'q3', prompt: 'A closed sort checks…', options: [{ id: 'a', label: 'Colours' }, { id: 'b', label: 'Page speed' }, { id: 'c', label: 'Whether your categories work' }, { id: 'd', label: 'Prices' }], correct: 'c', explanation: 'People sort into your groups.' },
      { id: 'q4', prompt: 'How many people for a useful sort?', options: [{ id: 'a', label: '1' }, { id: 'b', label: '2' }, { id: 'c', label: '1,000' }, { id: 'd', label: 'About 15–20' }], correct: 'd', explanation: 'Patterns stabilise around 15–20 people.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Where should card labels come from?', hint: 'Real things on the site.', options: [{ id: 'a', label: 'Real content and features, in plain words' }, { id: 'b', label: 'Department names' }, { id: 'c', label: 'Random words' }, { id: 'd', label: 'The group names you want' }], correct: 'a', explanation: 'Cards should describe real content without hinting at the groups.' },
    { id: 'l2', prompt: 'Why avoid cards that share a word with a group (“Payment methods” → “Payments”)?', hint: 'What would people match on?', options: [{ id: 'a', label: 'It’s too long' }, { id: 'b', label: 'People match the word instead of thinking about meaning' }, { id: 'c', label: 'It confuses the software' }, { id: 'd', label: 'No reason' }], correct: 'b', explanation: 'Shared words create false agreement.' },
    { id: 'l3', prompt: 'Open sort piles are named “Money stuff”, “Paying”, “Wallet”. What do you do?', hint: 'Different names, same idea?', options: [{ id: 'a', label: 'Pick the funniest' }, { id: 'b', label: 'Treat them as three groups' }, { id: 'c', label: 'Treat them as one theme and pick a clear name' }, { id: 'd', label: 'Throw them out' }], correct: 'c', explanation: 'Look past the names to the shared meaning, then choose the clearest label.' },
    { id: 'l4', prompt: 'What can’t a card sort tell you?', hint: 'Sorting isn’t navigating.', options: [{ id: 'a', label: 'How people group things' }, { id: 'b', label: 'Which labels they use' }, { id: 'c', label: 'Which cards are ambiguous' }, { id: 'd', label: 'Whether people can find things in the final navigation' }], correct: 'd', explanation: 'That’s what a tree test or usability test checks.' },
    { id: 'l5', prompt: 'A card sits evenly across three groups. Best move?', hint: 'Maybe it isn’t one thing.', options: [{ id: 'a', label: 'Put it in all three, or split it into clearer items' }, { id: 'b', label: 'Hide it' }, { id: 'c', label: 'Put it in the biggest group' }, { id: 'd', label: 'Rename the groups' }], correct: 'a', explanation: 'Even splits often mean the card covers several needs. Split it or cross-link it.' },
  ],
};

export const ia1_3: Episode = {
  lessonId: 'ia.1-3',
  hook: 'A tab bar, a sidebar, a hub, a stepper. Each fits one shape of content and breaks on the others.',
  scene: {
    id: 'nav-patterns', duration: 34,
    beats: [
      { at: 0, title: 'Four places', body: 'A new app with four main areas. A bottom tab bar fits: every area one tap away.' },
      { at: 6, title: 'It grows', body: 'A year later there are twelve sections. The tab bar can’t hold them.' },
      { at: 12, title: 'Hide it all?', body: 'Everything goes behind a hamburger menu. The screen is clean, and use of every section drops.' },
      { at: 18, title: 'The right pattern per job', body: 'The phone keeps four tabs for the most-used areas plus “More”. The desktop tool gets a sidebar.' },
      { at: 25, title: 'Some tasks are a line', body: 'Checkout isn’t a place to wander. A stepper walks people through it in order.' },
      { at: 30, title: 'Shape decides pattern', body: 'Few and frequent: tabs. Many: sidebar. Separate tasks: hub. One task in order: stepper.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What happened when everything went behind the hamburger?', options: [{ id: 'a', label: 'Use went up' }, { id: 'b', label: 'Use of every section dropped' }, { id: 'c', label: 'Nothing changed' }],
      correct: 'b', explanation: 'Hidden navigation gets discovered and used less.' },
    { id: 'c2', prompt: 'Why did checkout use a stepper?', options: [{ id: 'a', label: 'It looks modern' }, { id: 'b', label: 'It has the most sections' }, { id: 'c', label: 'It’s one task done in order' }],
      correct: 'c', explanation: 'Steppers fit linear tasks.' },
  ],
  game: {
    id: 'pattern-fit', title: 'Pattern fit',
    instructions: 'Each product needs navigation. Pick the pattern that fits the shape of its content.',
    lanes: [
      { id: 'tab', label: 'Tab bar', hint: '3–5 top places people switch between often' },
      { id: 'side', label: 'Sidebar', hint: 'Many sections in a tool people work in' },
      { id: 'hub', label: 'Hub', hint: 'A home of separate tasks, each its own path' },
      { id: 'step', label: 'Stepper', hint: 'One task done in a fixed order' },
    ],
    cards: [
      { id: 'g1', label: 'A UPI app: Home, Scan, History, Profile', lane: 'tab' },
      { id: 'g2', label: 'An admin dashboard with 14 sections', lane: 'side' },
      { id: 'g3', label: 'A super-app: Cabs, Food, Groceries, Bills, each its own flow', lane: 'hub' },
      { id: 'g4', label: 'Applying for a loan: details, documents, review, submit', lane: 'step' },
      { id: 'g5', label: 'A music app: Home, Search, Library', lane: 'tab' },
      { id: 'g6', label: 'An email client with folders and labels', lane: 'side' },
      { id: 'g7', label: 'A government services portal with 20 unrelated services', lane: 'hub' },
      { id: 'g8', label: 'Setting up a new bank account', lane: 'step' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 11.6,
    prompt: 'The app now has twelve sections. What happens to the tab bar?',
    options: [{ id: 'a', label: 'Twelve tiny tabs' }, { id: 'b', label: 'Keep the 4 most-used areas, group the rest under “More”' }, { id: 'c', label: 'Hide everything behind a hamburger menu' }],
    correct: 'b', explanation: 'Keep the frequent places visible and give the rest a clear home. (Watch what happens to the hamburger.)',
  },
  takeaways: [
    { title: 'Count and frequency', body: 'How many places, and how often people switch between them, decide the pattern.' },
    { title: 'Visible beats hidden', body: 'Hiding main sections behind a menu means people use them less.' },
    { title: 'Tasks have shapes', body: 'Linear tasks want a stepper; separate tasks want a hub.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '4 top areas used daily:', options: [{ id: 'a', label: 'Tab bar' }, { id: 'b', label: 'Stepper' }], correct: 'a', explanation: 'Few, frequent places.' },
      { id: 'q2', prompt: 'An analytics tool with 16 sections:', options: [{ id: 'a', label: 'Tab bar' }, { id: 'b', label: 'Stepper' }, { id: 'c', label: 'Sidebar' }], correct: 'c', explanation: 'Many sections.' },
      { id: 'q3', prompt: 'A KYC flow in 4 steps:', options: [{ id: 'a', label: 'Sidebar' }, { id: 'b', label: 'Stepper' }, { id: 'c', label: 'Hub' }, { id: 'd', label: 'Tab bar' }], correct: 'b', explanation: 'One task, fixed order.' },
      { id: 'q4', prompt: 'Hiding main sections behind ≡ usually…', options: [{ id: 'a', label: 'Raises use' }, { id: 'b', label: 'Has no effect' }, { id: 'c', label: 'Lowers use' }], correct: 'c', explanation: 'Out of sight, out of mind.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Maximum comfortable tabs on a phone tab bar?', hint: 'Thumbs and labels need room.', options: [{ id: 'a', label: '2' }, { id: 'b', label: 'About 5' }, { id: 'c', label: '9' }, { id: 'd', label: '12' }], correct: 'b', explanation: 'Beyond about five, tabs get cramped and hard to tell apart.' },
    { id: 'l2', prompt: 'Why might a sidebar suit desktop but not phones?', hint: 'Screen width.', options: [{ id: 'a', label: 'Phones can’t show lists' }, { id: 'b', label: 'Sidebars are old' }, { id: 'c', label: 'On a phone it takes the width you need for content' }, { id: 'd', label: 'Desktop users prefer it' }], correct: 'c', explanation: 'Phones usually collapse sidebars into a drawer or a tab bar.' },
    { id: 'l3', prompt: 'A stepper lets people jump to any step freely. What’s the risk?', hint: 'Why is it in order?', options: [{ id: 'a', label: 'None' }, { id: 'b', label: 'Fewer clicks' }, { id: 'c', label: 'It looks cluttered' }, { id: 'd', label: 'People skip steps later ones depend on' }], correct: 'd', explanation: 'Steps in a stepper usually depend on earlier ones.' },
    { id: 'l4', prompt: 'A hub-and-spoke app makes switching between tasks…', hint: 'You go back to the hub each time.', options: [{ id: 'a', label: 'Slower, via home' }, { id: 'b', label: 'Instant' }, { id: 'c', label: 'Impossible' }, { id: 'd', label: 'Automatic' }], correct: 'a', explanation: 'Hubs suit separate tasks, not constant switching.' },
    { id: 'l5', prompt: 'Your app’s top 3 tabs get 90% of visits; tab 4 gets 1%. Best move?', hint: 'Prime spots are scarce.', options: [{ id: 'a', label: 'Add a fifth tab' }, { id: 'b', label: 'Move tab 4 into “More” and give the slot to something people need' }, { id: 'c', label: 'Make tab 4 bigger' }, { id: 'd', label: 'Remove the tab bar' }], correct: 'b', explanation: 'Tab slots should go to the places people visit most.' },
  ],
};

export const ia1_4: Episode = {
  lessonId: 'ia.1-4',
  hook: 'Before any screen, draw where every page lives. The problems show up on the map first.',
  scene: {
    id: 'sitemap', duration: 34,
    beats: [
      { at: 0, title: 'A pile of pages', body: 'A food app has 14 pages and no plan for where they live.' },
      { at: 5, title: 'Grow a tree', body: 'Home at the top, four sections below, pages inside each. That diagram is a sitemap.' },
      { at: 12, title: 'Too deep', body: 'Change password: Account, Settings, Security, Login, Password. Five guesses to get right.' },
      { at: 18, title: 'Too wide', body: 'The fix overshoots: twenty items on one level. Now people scan forever.' },
      { at: 24, title: 'Balanced', body: 'Three levels, groups of four to seven. Every common task within 2–3 taps.' },
      { at: 29, title: 'Test the tree', body: 'A tree test gives people a task and the bare structure. Their first click tells you if it works.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What does a sitemap show?', options: [{ id: 'a', label: 'Where every page lives in the structure' }, { id: 'b', label: 'What each screen looks like' }, { id: 'c', label: 'The colour palette' }],
      correct: 'a', explanation: 'It’s the structure, before any visual design.' },
    { id: 'c2', prompt: 'What was wrong with twenty items on one level?', options: [{ id: 'a', label: 'Too deep' }, { id: 'b', label: 'Too wide' }, { id: 'c', label: 'Nothing' }],
      correct: 'b', explanation: 'Too many choices at once slows people down.' },
  ],
  game: {
    id: 'tree-test', title: 'Tree test',
    instructions: 'You’re the participant. For each task, open the section you’d try first. The path lights up to show where the page really lives.',
    lanes: [
      { id: 'order', label: 'Orders', hint: 'Current and past orders, and problems with them' },
      { id: 'acct', label: 'Account', hint: 'Your details, addresses, payments and settings' },
      { id: 'offer', label: 'Offers', hint: 'Coupons, memberships and rewards' },
      { id: 'help', label: 'Help', hint: 'Policies, guides and contacting support' },
    ],
    cards: [
      { id: 'g1', label: 'Change your delivery address', lane: 'acct', note: 'Account › Saved addresses' },
      { id: 'g2', label: 'Report a missing item from today’s order', lane: 'order', note: 'Orders › Today’s order › Report an issue' },
      { id: 'g3', label: 'Apply a coupon you got by SMS', lane: 'offer', note: 'Offers › My coupons' },
      { id: 'g4', label: 'Read the cancellation policy', lane: 'help', note: 'Help › Policies › Cancellations' },
      { id: 'g5', label: 'Reorder last Friday’s biryani', lane: 'order', note: 'Orders › Past orders › Reorder' },
      { id: 'g6', label: 'Remove a saved card', lane: 'acct', note: 'Account › Payment methods' },
      { id: 'g7', label: 'Check when your membership renews', lane: 'offer', note: 'Offers › Membership' },
      { id: 'g8', label: 'Chat with support about a late refund', lane: 'help', note: 'Help › Contact support' },
    ],
  },
  gap: {
    id: 'gap', from: 12, at: 17.6,
    prompt: 'Changing the password is five levels deep. How do you fix it?',
    options: [{ id: 'a', label: 'Add a sixth level with a shortcut' }, { id: 'b', label: 'Merge levels so it’s 2–3 taps, without piling everything on one screen' }, { id: 'c', label: 'Put every setting on the top level' }],
    correct: 'b', explanation: 'Flatten, but not all the way. Too flat is just as bad (see what happens next).',
  },
  takeaways: [
    { title: 'Map before screens', body: 'A sitemap shows every page and where it lives, so structure problems show up early.' },
    { title: 'Not too deep, not too wide', body: 'Aim for 2–3 taps to common tasks, with groups of about 4–7.' },
    { title: 'Tree test it', body: 'Give people tasks on the bare structure. Wrong first clicks show where the tree misleads.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '5 levels to reach a common page is…', options: [{ id: 'a', label: 'Too wide' }, { id: 'b', label: 'Too deep' }], correct: 'b', explanation: 'Too many levels.' },
      { id: 'q2', prompt: '30 links on one level is…', options: [{ id: 'a', label: 'Too wide' }, { id: 'b', label: 'Too deep' }, { id: 'c', label: 'Balanced' }], correct: 'a', explanation: 'Too many choices at once.' },
      { id: 'q3', prompt: 'A tree test measures…', options: [{ id: 'a', label: 'Visual appeal' }, { id: 'b', label: 'Load time' }, { id: 'c', label: 'Typing speed' }, { id: 'd', label: 'Whether people find things in the structure' }], correct: 'd', explanation: 'Structure only, no visuals.' },
      { id: 'q4', prompt: 'A page with no parent in the sitemap is…', options: [{ id: 'a', label: 'An orphan page' }, { id: 'b', label: 'The home page' }, { id: 'c', label: 'A hub' }], correct: 'a', explanation: 'Orphans can only be reached by search or a direct link.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why draw a sitemap before wireframes?', hint: 'Cheap to change.', options: [{ id: 'a', label: 'Structure problems are cheap to fix on a diagram' }, { id: 'b', label: 'Clients like diagrams' }, { id: 'c', label: 'It replaces research' }, { id: 'd', label: 'It sets the colours' }], correct: 'a', explanation: 'Moving a box is cheaper than redesigning screens.' },
    { id: 'l2', prompt: 'In a tree test, the most telling metric is…', hint: 'Where did they go first?', options: [{ id: 'a', label: 'Time on the home page' }, { id: 'b', label: 'First-click success' }, { id: 'c', label: 'Number of participants who smiled' }, { id: 'd', label: 'Screen size' }], correct: 'b', explanation: 'People who click right first usually succeed.' },
    { id: 'l3', prompt: 'The same page appears in two branches. When is that fine?', hint: 'Remember the card-sort splits.', options: [{ id: 'a', label: 'Never' }, { id: 'b', label: 'Always' }, { id: 'c', label: 'When research shows people genuinely look in both places' }, { id: 'd', label: 'When the page is long' }], correct: 'c', explanation: 'Cross-links help when people’s models split. Duplicated pages with different content don’t.' },
    { id: 'l4', prompt: 'Why does a tree test hide the visual design?', hint: 'What could help people find things?', options: [{ id: 'a', label: 'It’s cheaper to build' }, { id: 'b', label: 'Visuals don’t matter' }, { id: 'c', label: 'It hides the colours' }, { id: 'd', label: 'So layout and icons can’t cover up a weak structure' }], correct: 'd', explanation: 'It tests labels and hierarchy on their own.' },
    { id: 'l5', prompt: '60% go to “Help” to report a missing item, but it lives under “Orders”. Best fix?', hint: 'Meet people where they look.', options: [{ id: 'a', label: 'Add “Report an issue” to Help too, pointing to the same flow' }, { id: 'b', label: 'Rename Help to Orders' }, { id: 'c', label: 'Move all of Orders into Help' }, { id: 'd', label: 'Nothing, 40% got it' }], correct: 'a', explanation: 'A cross-link catches the majority without breaking the structure.' },
  ],
};
