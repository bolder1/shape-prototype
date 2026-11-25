// Episodes for chapter fd.4 · Design judgment at scale. Drafts by Claude, for review.
// Haat is a grocery and essentials marketplace in 30 Indian cities. Ritika Sen, its principal designer, reads
// trade-off matrices for the kind of call they are, rewrites the team's principles until they settle real arguments,
// and judges which rule breaks to refuse, test, log or turn into a new rule. The decisions, principles and rule
// breaks, and the rules they're judged by, are in ../judgment and tested there.
import type { Episode } from '../episode';
import {
  HAAT_BREAKS, HAAT_DECISIONS, HAAT_PRINCIPLES, matrixCall, principleVerdict, ruleCall,
  type HaatBreak, type HaatDecision, type HaatPrinciple,
} from '../judgment';

const decision = (k: HaatDecision) => HAAT_DECISIONS[k].text;
const read = (k: HaatDecision) => matrixCall(HAAT_DECISIONS[k]);
const draft = (k: HaatPrinciple) => HAAT_PRINCIPLES[k].text;
const verdict = (k: HaatPrinciple) => principleVerdict(HAAT_PRINCIPLES[k]);
const proposal = (k: HaatBreak) => HAAT_BREAKS[k].text;
const rule = (k: HaatBreak) => ruleCall(HAAT_BREAKS[k]);

export const fd4_1: Episode = {
  lessonId: 'fd.4-1',
  hook: 'Three weeks of arguing about one ₹25 fee. Ritika draws a grid, and the argument ends in twenty minutes. The next one doesn’t, and that tells her more.',
  scene: {
    id: 'tradeoff-matrix', duration: 36,
    beats: [
      { at: 0, title: 'Three weeks, one fee', body: 'Haat charges ₹25 delivery under ₹199. Ishaan in growth wants it on the cart page only. Pooja in trust wants it on every product card. Three weeks of meetings.' },
      { at: 6, title: 'Rows and columns', body: 'Ritika puts the options in rows and what matters in columns: orders, no surprises, quick to build. Then a third option nobody had written down: the basket bar.' },
      { at: 11, title: 'Everyone’s weights', body: 'She weighs the grid three ways, as Ishaan, Pooja and Rajat would. The basket bar wins all three. Decided in twenty minutes.' },
      { at: 16, title: 'Pay later', body: 'Next: “Pay later” at checkout. Growth’s weights pick it by default. Trust’s weights pick none at all.' },
      { at: 21, title: 'Not a scoring problem', body: 'The winner flips with the weights, so better scores won’t settle it. The argument is about priorities, and Kabir owns those.' },
      { at: 26, title: 'One guess', body: 'A 10-minute promise in Pune wins every lens. But rider safety is a must-have, and its score is a guess. If it’s low, the promise is out.' },
      { at: 31, title: 'What kind of call', body: 'Clear, a matter of weights, waiting on evidence, or nothing passes. The matrix tells you which before you argue about it.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the fee argument end once the grid was weighed three ways?', options: [{ id: 'a', label: 'Ritika’s weights were the right ones' }, { id: 'b', label: 'The same option won however anyone in the room weighed it' }, { id: 'c', label: 'It had the highest single score' }],
      correct: 'b', explanation: 'When the winner survives everyone’s weights, there is nothing left to argue about.' },
    { id: 'c2', prompt: 'Why couldn’t the grid settle “Pay later”?', options: [{ id: 'a', label: 'The scores were wrong' }, { id: 'b', label: 'There weren’t enough options' }, { id: 'c', label: 'The winner changed with the weights: it’s a question of priorities' }],
      correct: 'c', explanation: 'Growth and trust value different things. Someone who owns the priorities has to choose.' },
  ],
  game: {
    id: 'matrix-read', title: 'Read the matrix',
    instructions: 'Each card is one of Haat’s open decisions as a trade-off matrix. Tap a person to weigh it their way, and swing any guessed score low or high. Then say what kind of call it is.',
    lanes: [
      { id: 'clear', label: 'Decide it', hint: 'One option wins every way it’s weighed' },
      { id: 'weights', label: 'Settle priorities', hint: 'The winner changes with who is weighing' },
      { id: 'evidence', label: 'Check the guess', hint: 'A guessed score could flip it' },
      { id: 'reframe', label: 'Find a new option', hint: 'Nothing clears the must-haves' },
    ],
    cards: [
      { id: 'g1', label: decision('fee'), lane: read('fee'), visual: 'fee', note: 'The basket bar wins for growth, trust and engineering alike. It’s at least as good as cart-only on everything, so stop meeting about it.' },
      { id: 'g2', label: decision('paylater'), lane: read('paylater'), visual: 'paylater', note: 'Growth’s weights pick the default; trust’s pick none at all. That’s a values question, so Kabir chooses, with this grid showing what each answer gives up.' },
      { id: 'g3', label: decision('search'), lane: read('search'), visual: 'search', note: 'If search is really slower for customers than for staff, the grid flips. Five remote sessions with real shoppers settle it in a week.' },
      { id: 'g4', label: decision('cod'), lane: read('cod'), visual: 'cod', note: 'Every option breaks the fraud limit or the orders limit. Stop scoring: the new option is paying the rider by UPI QR at the door.' },
      { id: 'g5', label: decision('reorder'), lane: read('reorder'), visual: 'reorder', note: '“Order again” loses on ad revenue and still wins, even weighed the brand team’s way. A clear call doesn’t need to win every column.' },
      { id: 'g6', label: decision('substitute'), lane: read('substitute'), visual: 'substitute', note: 'Operations weighs picker speed, design weighs customer control, and each gets a different winner. Haat needs a principle for this, not a better score.' },
      { id: 'g7', label: decision('tenmin'), lane: read('tenmin'), visual: 'tenmin', note: 'At a safety score of 1, the promise fails a must-have and the 30-minute window wins. Time real routes at peak hour before promising anything.' },
      { id: 'g8', label: decision('bulkprice'), lane: read('bulkprice'), visual: 'bulkprice', note: 'Speed for sellers and protection for buyers can’t both pass with these options. The new one: changes under 20% go live at once, and only rows above it wait for review.' },
    ],
  },
  gap: {
    id: 'gap', from: 16, at: 20.6,
    prompt: 'Growth’s weights pick “Pay later” by default; trust’s weights pick no pay later. What should Ritika do?',
    options: [{ id: 'a', label: 'Average the weights and go with the total' }, { id: 'b', label: 'Take the priorities to Kabir, showing what each choice gives up' }, { id: 'c', label: 'Rescore until one option wins both' }],
    correct: 'b', explanation: 'A disagreement about priorities needs someone who owns them. Averaging hides it, and rescoring until you get the answer you want is worse.',
  },
  takeaways: [
    { title: 'Must-haves first', body: 'An option that fails one is out, whatever its total.' },
    { title: 'Weigh it every way', body: 'Score it as each person in the room would. Same winner each time: decide.' },
    { title: 'Flips with the weights', body: 'Then it’s about priorities, not scores. Take it to whoever owns them.' },
    { title: 'Swing the guesses', body: 'If a guessed score can flip the answer, check it first. If nothing passes, find a new option.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'An option scores highest but fails a must-have. It…', options: [{ id: 'a', label: 'Is out' }, { id: 'b', label: 'Wins on total' }, { id: 'c', label: 'Needs a higher weight' }], correct: 'a', explanation: 'Must-haves come before totals.' },
      { id: 'q2', prompt: 'The winner changes with whose weights you use. The problem is…', options: [{ id: 'a', label: 'Missing data' }, { id: 'b', label: 'Bad scoring' }, { id: 'c', label: 'Disagreement about priorities' }], correct: 'c', explanation: 'More data won’t change what people value.' },
      { id: 'q3', prompt: 'A guessed score can flip the winner. Next step?', options: [{ id: 'a', label: 'Decide anyway' }, { id: 'b', label: 'Check that score' }, { id: 'c', label: 'Remove the column' }], correct: 'b', explanation: 'Check the guess that the decision depends on.' },
      { id: 'q4', prompt: 'No option clears every must-have. You should…', options: [{ id: 'a', label: 'Lower the must-haves' }, { id: 'b', label: 'Pick the highest total' }, { id: 'c', label: 'Look for a new option' }], correct: 'c', explanation: 'It isn’t a trade-off yet. The answer isn’t on the grid.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What makes a trade-off matrix worth drawing?', hint: 'Not the total.', options: [{ id: 'a', label: 'It produces an objective score' }, { id: 'b', label: 'It shows what kind of disagreement you’re having' }, { id: 'c', label: 'It makes the meeting look rigorous' }, { id: 'd', label: 'It replaces the decider' }], correct: 'b', explanation: 'Clear, priorities, evidence or reframe: each needs a different next step.' },
    { id: 'l2', prompt: '“Order again” loses on ad revenue but wins under every lens, including the brand team’s. Is that a clear call?', hint: 'Does it need to win every column?', options: [{ id: 'a', label: 'No, it loses a column' }, { id: 'b', label: 'Yes: it wins every way the room weighs it' }, { id: 'c', label: 'Only if brands agree' }, { id: 'd', label: 'Only if it dominates' }], correct: 'b', explanation: 'Winning every weighting is enough. Dominating every column is rare and not required.' },
    { id: 'l3', prompt: 'Someone suggests averaging growth’s and trust’s weights for “Pay later”. What’s wrong with that?', hint: 'Who loses, and do they know?', options: [{ id: 'a', label: 'Nothing, it’s fair' }, { id: 'b', label: 'The arithmetic is hard' }, { id: 'c', label: 'It hides a disagreement about values, and the loser reopens it later' }, { id: 'd', label: 'Averages are always wrong' }], correct: 'c', explanation: 'Name the priority call and who makes it. A decision made by arithmetic doesn’t stay made.' },
    { id: 'l4', prompt: 'Search-first wins, but its speed score came from six employees. When is that guess worth checking?', hint: 'Swing it.', options: [{ id: 'a', label: 'Always' }, { id: 'b', label: 'Never, employees are users too' }, { id: 'c', label: 'When the low end of the range would flip the winner' }, { id: 'd', label: 'Only after launch' }], correct: 'c', explanation: 'Check the guesses the answer depends on. A guess that can’t flip the answer can stay a guess.' },
    { id: 'l5', prompt: 'Every cash-on-delivery option fails the fraud limit or the orders limit. What did the grid just do?', hint: 'It found its own limits.', options: [{ id: 'a', label: 'Failed' }, { id: 'b', label: 'Showed the answer isn’t on it, so the team needs a new option, like UPI at the door' }, { id: 'c', label: 'Proved cash should be banned' }, { id: 'd', label: 'Showed the limits are too strict' }], correct: 'b', explanation: 'A grid with no viable row is telling you to design, not decide.' },
  ],
};

export const fd4_2: Episode = {
  lessonId: 'fd.4-2',
  hook: 'Haat’s principles poster says “Customer first”. Both sides of a three-week argument quote it. Ritika’s test: would anyone choose “Customer last”?',
  scene: {
    id: 'principle-poster', duration: 36,
    beats: [
      { at: 0, title: 'The poster', body: 'Simple. Fast. Delightful. Customer first. Haat’s four principles hang in every meeting room in Bengaluru.' },
      { at: 6, title: 'Both sides quote it', body: 'Out-of-stock items: swap automatically or ask first? Operations says “Customer first: it arrives complete.” Design says “Customer first: it’s their basket.”' },
      { at: 11, title: 'The opposite test', body: 'Would a sensible team choose “Customer last”? Or “Complicated”? No. Then those words rule nothing out.' },
      { at: 16, title: 'Name the cost', body: 'Ritika rewrites each one around a real choice, and what it costs: “The first price you see is the price you pay, even when hiding the fee would sell more.”' },
      { at: 21, title: 'Against the disputes', body: 'Four arguments Haat keeps having: the fee, substitutions, paid search results, big seller price changes. Each new principle settles at least one.' },
      { at: 26, title: 'Two good ones collide', body: '“The basket is the customer’s” says ask. “A weekly shop in under three minutes” says swap. Both are good. Neither can be deleted.' },
      { at: 31, title: 'Ranked, written down', body: 'Ritika puts the basket first and writes the order down. The substitution argument closes, and the next one like it is already decided.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why couldn’t “Customer first” settle the substitution argument?', options: [{ id: 'a', label: 'It was poorly worded' }, { id: 'b', label: 'Nobody would argue the opposite, so both sides could claim it' }, { id: 'c', label: 'It’s not about customers' }],
      correct: 'b', explanation: 'A principle nobody disagrees with doesn’t pick a side.' },
    { id: 'c2', prompt: 'What did Ritika do when two good principles pulled opposite ways?', options: [{ id: 'a', label: 'Deleted the weaker one' }, { id: 'b', label: 'Merged them' }, { id: 'c', label: 'Ranked them and wrote the order down' }],
      correct: 'c', explanation: 'A written ranking settles that clash once, before the next review.' },
  ],
  game: {
    id: 'principle-test', title: 'Does it decide?',
    instructions: 'Each card is a draft from Haat’s principles workshop. Is it a platitude nobody would argue against, a side taken too loosely to settle anything, or a principle that decides? The four disputes at the top light up as your principles settle them.',
    lanes: [
      { id: 'platitude', label: 'Platitude', hint: 'Nobody would choose the opposite' },
      { id: 'vague', label: 'Too vague', hint: 'Takes a side, settles nothing' },
      { id: 'decides', label: 'Decides', hint: 'Settles a real dispute, names the cost' },
    ],
    cards: [
      { id: 'g1', label: draft('simple'), lane: verdict('simple'), visual: 'simple', note: 'Nobody chooses “complicated”. Rewritten: “One way to do each thing, even when power users ask for shortcuts.”' },
      { id: 'g2', label: draft('till'), lane: verdict('till'), visual: 'till', note: 'It settles the fee argument: show it early. And it admits the cost, which is why people trust it.' },
      { id: 'g3', label: draft('bold'), lane: verdict('bold'), visual: 'bold', note: 'A side, but bold about what? Applied to the fee or substitutions, it points nowhere. Say what you’re bold about, and what it costs.' },
      { id: 'g4', label: draft('customer'), lane: verdict('customer'), visual: 'customer', note: 'Both sides of the substitution argument quoted it. Rewritten around the real choice, it became “The basket is the customer’s”.' },
      { id: 'g5', label: draft('basket'), lane: verdict('basket'), visual: 'basket', note: 'Settles substitutions: ask first. Watch the dispute strip: another good principle pulls the other way.' },
      { id: 'g6', label: draft('sellers'), lane: verdict('sellers'), visual: 'sellers', note: 'Another platform could choose big sellers first, so it takes a side. But it doesn’t settle the price-review argument. Try: “A kirana owner on a ₹8,000 phone comes first.”' },
      { id: 'g7', label: draft('answer'), lane: verdict('answer'), visual: 'answer', note: 'Settles paid search: best match on top. The “even when a brand pays more” is the part that costs Haat money, and the part that decides.' },
      { id: 'g8', label: draft('modern'), lane: verdict('modern'), visual: 'modern', note: 'That’s a visual style, and nobody chooses “dated and cluttered”. If Haat should feel like a kirana and not a mall, say so, and say what it gives up.' },
      { id: 'g9', label: draft('speed'), lane: verdict('speed'), visual: 'speed', note: 'A good principle: it settles substitutions as swap. It also clashes with “The basket is the customer’s”, so Ritika has to rank them.' },
      { id: 'g10', label: draft('ship'), lane: verdict('ship'), visual: 'ship', note: 'Sensible teams disagree, so it’s not a platitude, but it settles none of Haat’s four disputes. Ship what, and what do you accept to learn faster?' },
      { id: 'g11', label: draft('fair'), lane: verdict('fair'), visual: 'fair', note: 'Settles big price changes: held for review. It names who loses, the largest sellers, which is what makes it hold up in a meeting.' },
    ],
  },
  gap: {
    id: 'gap', from: 21, at: 25.6,
    prompt: 'Two good principles pull the substitution decision opposite ways. What should Ritika do?',
    options: [{ id: 'a', label: 'Rank them, write down the order, and apply it' }, { id: 'b', label: 'Delete the one she likes less' }, { id: 'c', label: 'Merge them into “fast and respectful”' }],
    correct: 'a', explanation: 'Both principles decide things. A written ranking settles the clash once; merging them gives you another platitude.',
  },
  takeaways: [
    { title: 'The opposite test', body: 'If no sensible team would choose the opposite, it rules nothing out.' },
    { title: 'Name the cost', body: '“X, even when Y.” The cost is what makes a principle decide.' },
    { title: 'Test on real disputes', body: 'A principle is finished when it settles an argument you actually have.' },
    { title: 'Rank the clashes', body: 'When two good principles collide, write down which wins.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: '“Delightful in every interaction” is…', options: [{ id: 'a', label: 'A strong principle' }, { id: 'b', label: 'A platitude' }], correct: 'b', explanation: 'Nobody chooses “joyless”.' },
      { id: 'q2', prompt: 'What turns a side into a decision?', options: [{ id: 'a', label: 'A nicer poster' }, { id: 'b', label: 'Shorter words' }, { id: 'c', label: 'Naming what it costs: “even when…”' }], correct: 'c', explanation: 'The cost shows where it draws the line.' },
      { id: 'q3', prompt: 'How many principles should a team keep?', options: [{ id: 'a', label: 'Three to five' }, { id: 'b', label: 'Twelve or more' }, { id: 'c', label: 'One' }], correct: 'a', explanation: 'Few enough to remember in a meeting, enough to cover the real arguments.' },
      { id: 'q4', prompt: 'A principle settles none of your live disputes. It’s…', options: [{ id: 'a', label: 'Fine, it’s aspirational' }, { id: 'b', label: 'Still too vague' }, { id: 'c', label: 'A platitude by definition' }], correct: 'b', explanation: 'It may take a side, but not one you can apply yet.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Which of these passes the opposite test?', hint: 'Could a good team choose the reverse?', options: [{ id: 'a', label: 'Simple and intuitive' }, { id: 'b', label: 'Customer first' }, { id: 'c', label: 'Decide small things for people, so a weekly shop takes under three minutes' }, { id: 'd', label: 'Modern and clean' }], correct: 'c', explanation: 'Another good team could choose “people decide every detail”.' },
    { id: 'l2', prompt: '“Be bold” takes a side. Why isn’t it a principle that decides?', hint: 'Apply it to the fee.', options: [{ id: 'a', label: 'Bold is bad' }, { id: 'b', label: 'It doesn’t settle any of the arguments Haat actually has' }, { id: 'c', label: 'It’s too short' }, { id: 'd', label: 'It’s a platitude' }], correct: 'b', explanation: 'Passing the opposite test is necessary but not enough. It has to settle something.' },
    { id: 'l3', prompt: 'Why does “even when a brand pays more” matter in the search principle?', hint: 'What does Haat lose?', options: [{ id: 'a', label: 'It sounds honest' }, { id: 'b', label: 'It names the cost, so nobody can bend it when a brand offers more' }, { id: 'c', label: 'Legal asked for it' }, { id: 'd', label: 'It doesn’t matter' }], correct: 'b', explanation: 'A principle that says what it costs can’t be argued around in a meeting.' },
    { id: 'l4', prompt: 'Two teams each quote a different Haat principle on substitutions. Ritika’s best move?', hint: 'Both are good.', options: [{ id: 'a', label: 'Let the more senior team win' }, { id: 'b', label: 'Decide this one case and move on' }, { id: 'c', label: 'Rank the two principles in writing, so the next clash is already settled' }, { id: 'd', label: 'Rewrite both until they agree' }], correct: 'c', explanation: 'Settling the case alone leaves the clash for next time. The ranking settles every future case like it.' },
    { id: 'l5', prompt: 'A year on, nobody quotes Haat’s principles in reviews. What’s the likeliest cause?', hint: 'Were they tested?', options: [{ id: 'a', label: 'People forgot them' }, { id: 'b', label: 'They were never applied to real disputes, so they don’t settle anything' }, { id: 'c', label: 'The poster faded' }, { id: 'd', label: 'There were too few' }], correct: 'b', explanation: 'Principles that settle arguments get quoted. Rewrite them against this year’s disputes.' },
  ],
};

export const fd4_3: Episode = {
  lessonId: 'fd.4-3',
  hook: 'Tanvi breaks the one-primary-button rule, and has 40 support calls to show why. Aditya wants to break another because it “feels more exciting”. Ritika says yes to one.',
  scene: {
    id: 'rule-break', duration: 36,
    beats: [
      { at: 0, title: 'The rulebook', body: 'Haat’s design system has rules for 14 designers and 900 screens. Every Thursday, the design review hears requests to break them.' },
      { at: 6, title: 'Floors', body: 'First up: the Diwali banner in gold on cream, 2.1:1 contrast. Contrast is a floor: it keeps people from being shut out. No, and Tanvi gets a gold that passes.' },
      { at: 11, title: 'Taste and hunches', body: '“SALE” in capitals because it feels exciting: no. Swipe-to-add, because Kabir is sure it’s faster: maybe. Test it first.' },
      { at: 16, title: 'Evidence, once', body: 'Order tracking: 40 support calls where riders couldn’t find the flat because “Share location” was missed. Two primary buttons, here only.' },
      { at: 21, title: 'Logged', body: 'The exception goes in the log with the support calls attached, so the next designer can see why, and can’t use it to justify taste.' },
      { at: 26, title: 'The third time', body: 'Payment, returns, and the sellers’ stock count all lose people through the bottom bar. Three exceptions for the same reason.' },
      { at: 31, title: 'Change the rule', body: 'Three places is a pattern, not an exception. The rule becomes: the bottom bar hides during focused tasks. Everyone gets it.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why was the Diwali banner refused, even for two weeks?', options: [{ id: 'a', label: 'Gold is off-brand' }, { id: 'b', label: 'Contrast is a floor: it keeps people from being shut out' }, { id: 'c', label: 'Banners need approval' }],
      correct: 'b', explanation: 'Floors protect people. Change how you meet them, not whether.' },
    { id: 'c2', prompt: 'Why did the bottom-bar rule change instead of collecting a third exception?', options: [{ id: 'a', label: 'Three places had the same need, with evidence' }, { id: 'b', label: 'A senior designer asked' }, { id: 'c', label: 'Exceptions are banned' }],
      correct: 'a', explanation: 'When the same evidence shows up three times, the rule is what’s wrong.' },
  ],
  game: {
    id: 'rule-call', title: 'Thursday design review',
    instructions: 'Each card is a request to break one of Haat’s design-system rules. Hold the rule, test the idea, log an exception, or change the rule for everyone. Your calls fill in the rulebook.',
    lanes: [
      { id: 'hold', label: 'Hold the rule', hint: 'A floor, or only taste' },
      { id: 'test', label: 'Test it first', hint: 'A guess about users' },
      { id: 'exception', label: 'Log an exception', hint: 'Evidence, in one place' },
      { id: 'change', label: 'Change the rule', hint: 'The same evidence, again and again' },
    ],
    cards: [
      { id: 'g1', label: proposal('diwali'), lane: rule('diwali'), visual: 'diwali', note: 'Contrast is a floor, and two weeks of Diwali is when the most people shop. A deeper gold passes 4.5:1 and still looks festive.' },
      { id: 'g2', label: proposal('track'), lane: rule('track'), visual: 'track', note: 'Real evidence, one screen. Break it here, and attach the 40 calls to the exception so it can’t become a precedent for taste.' },
      { id: 'g3', label: proposal('caps'), lane: rule('caps'), visual: 'caps', note: 'Taste never breaks a rule. A sale tag in the system’s own style does the job, and stays readable for screen readers too.' },
      { id: 'g4', label: proposal('focus'), lane: rule('focus'), visual: 'focus', note: 'Three places, the same evidence. Rewrite the rule: the bottom bar hides during payment and other focused tasks, everywhere.' },
      { id: 'g5', label: proposal('swipe'), lane: rule('swipe'), visual: 'swipe', note: 'A confident guess is still a guess. Test swipe-to-add with a share of users, keeping the visible button as a fallback, and measure.' },
      { id: 'g6', label: proposal('oneTap'), lane: rule('oneTap'), visual: 'oneTap', note: 'The data is real, and so are the doubled complaints. The confirmation protects money: make it faster, but don’t remove it.' },
      { id: 'g7', label: proposal('packing'), lane: rule('packing'), visual: 'packing', note: 'Measured harm, one specialist screen. Log the tighter spacing as an exception for the packing screen only.' },
      { id: 'g8', label: proposal('pregst'), lane: rule('pregst'), visual: 'pregst', note: 'Showing prices without GST misleads people about what they’ll pay. That rule is a floor, and looking cheaper than rivals doesn’t change it.' },
      { id: 'g9', label: proposal('amount'), lane: rule('amount'), visual: 'amount', note: 'Plausible, unchecked. Put the bigger amount in front of 20 riders at noon for a week and count the cash errors.' },
      { id: 'g10', label: proposal('tamil'), lane: rule('tamil'), visual: 'tamil', note: 'Five flows, three languages, real misreadings. The two-word rule was written in English. Change it for everyone.' },
    ],
  },
  gap: {
    id: 'gap', from: 21, at: 25.6,
    prompt: 'A third team asks to hide the bottom bar, with the same evidence as the first two. What should Ritika do?',
    options: [{ id: 'a', label: 'Log a third exception' }, { id: 'b', label: 'Change the rule for everyone' }, { id: 'c', label: 'Refuse: three exceptions is too many' }],
    correct: 'b', explanation: 'The same need with the same evidence in three places means the rule is wrong. Rewrite it.',
  },
  takeaways: [
    { title: 'Floors don’t bend', body: 'Access and money rules protect people. Change how you meet them, not whether.' },
    { title: 'Taste never breaks a rule', body: '“It feels better” is how systems decay.' },
    { title: 'Hunches get tested', body: 'A claim about users earns an experiment, not a change.' },
    { title: 'Three times, change it', body: 'Evidence once is an exception, logged. The same evidence three times means the rule is wrong.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'A rule protects contrast. Data says breaking it lifts clicks. You…', options: [{ id: 'a', label: 'Break it' }, { id: 'b', label: 'Hold it, and find a way that passes' }, { id: 'c', label: 'Test it' }], correct: 'b', explanation: 'Floors don’t bend for metrics.' },
      { id: 'q2', prompt: '“I’m sure users will love it” is…', options: [{ id: 'a', label: 'Evidence' }, { id: 'b', label: 'Taste' }, { id: 'c', label: 'A hunch to test' }], correct: 'c', explanation: 'It’s a claim about users. Check it.' },
      { id: 'q3', prompt: 'An exception should be…', options: [{ id: 'a', label: 'Logged with its evidence' }, { id: 'b', label: 'Kept quiet' }, { id: 'c', label: 'Copied everywhere' }], correct: 'a', explanation: 'So the next designer sees why, and can’t cite it for taste.' },
      { id: 'q4', prompt: 'The same exception is requested a third time. That means…', options: [{ id: 'a', label: 'Designers are lazy' }, { id: 'b', label: 'Refuse it' }, { id: 'c', label: 'The rule needs changing' }], correct: 'c', explanation: 'A pattern of exceptions is a rule asking to be rewritten.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Which Haat rule is a floor?', hint: 'Who gets hurt if it bends?', options: [{ id: 'a', label: 'Spacing from the 8-point scale' }, { id: 'b', label: 'Sentence case everywhere' }, { id: 'c', label: 'Prices show the full amount, GST included' }, { id: 'd', label: 'One primary button per screen' }], correct: 'c', explanation: 'It keeps people from being misled about what they pay.' },
    { id: 'l2', prompt: 'Kabir, the head of product, is sure swipe-to-add will be faster. What does his seniority change?', hint: 'Is it evidence?', options: [{ id: 'a', label: 'It becomes the rule' }, { id: 'b', label: 'Nothing: it’s still a hunch, so it earns a test' }, { id: 'c', label: 'It skips review' }, { id: 'd', label: 'It’s refused to keep things fair' }], correct: 'b', explanation: 'How senior the person is doesn’t change what kind of reason it is.' },
    { id: 'l3', prompt: 'Why log an exception rather than just allowing it quietly?', hint: 'Think about next year.', options: [{ id: 'a', label: 'Paperwork' }, { id: 'b', label: 'So it carries its evidence, can’t be cited for taste, and shows when the rule needs changing' }, { id: 'c', label: 'To blame someone later' }, { id: 'd', label: 'It doesn’t matter' }], correct: 'b', explanation: 'The log is how you notice the third time.' },
    { id: 'l4', prompt: 'Skipping payment confirmation lifts orders 2% and doubles complaints about wrong amounts. The right move?', hint: 'What does the rule protect?', options: [{ id: 'a', label: 'Ship: 2% is a lot' }, { id: 'b', label: 'Keep the confirmation and make it faster' }, { id: 'c', label: 'Ship to half of users' }, { id: 'd', label: 'Log an exception' }], correct: 'b', explanation: 'It protects money. Take the friction out without removing the protection.' },
    { id: 'l5', prompt: 'The two-word label rule keeps cutting off Tamil and Kannada labels. What does that tell Ritika about the rule?', hint: 'Who was it written for?', options: [{ id: 'a', label: 'Translators need to be shorter' }, { id: 'b', label: 'It was written for English, and the evidence says it’s wrong for Haat’s users' }, { id: 'c', label: 'Make exceptions per language' }, { id: 'd', label: 'Drop those languages' }], correct: 'b', explanation: 'A rule that fails the same way in five flows is the problem. Change it for everyone.' },
  ],
};
