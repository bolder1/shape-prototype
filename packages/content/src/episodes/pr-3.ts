// Episodes for chapter pr.3 · Micro-interactions. Drafts by Claude, for review.
// Gullak, a Pune UPI payments and savings-jar app (gullak is Hindi for piggy bank), is polishing its small moments.
// Ishita is its designer and Rohan its front-end developer. Meera, who runs a tailoring shop in Kothrud, pays Raju the
// milkman ₹240 every morning and is saving ₹15,000 for a Goa trip. pr.2 covered how things move; this chapter is about
// the small, single-task moments that motion serves, and when a flourish helps or gets in the way.
import type { Episode } from '../episode';

export const pr3_1: Episode = {
  lessonId: 'pr.3-1',
  hook: 'Meera taps Pay ₹240 and nothing seems to happen, so she taps again and pays Raju twice. Watch one button come apart into trigger, rules, feedback and loops.',
  scene: {
    id: 'micro-anatomy', duration: 36,
    beats: [
      { at: 0, title: 'Paid twice', body: 'Meera taps Pay ₹240 for Raju’s milk. The button doesn’t change for two seconds, so she taps again. Two debits. Gullak’s Pay button had a trigger and nothing else.' },
      { at: 5, title: 'Trigger', body: 'Ishita starts with what kicks it off. Here it’s Meera’s tap. Some triggers come from the system instead: a payment clearing, or the balance dropping below ₹500.' },
      { at: 10, title: 'Rules', body: 'Then what it may do. The button locks after the first tap, so a second tap can’t pay again. Over ₹1,000 it asks for the UPI PIN; Raju’s ₹240 goes through UPI Lite without one. Rules are invisible, and they’re where the double payment came from.' },
      { at: 16, title: 'Feedback', body: 'Within 100 ms the button presses in. Then the label becomes a spinner and “Waiting for your bank”. On success a tick draws in, the phone buzzes once, and the words say “₹240 paid to Raju”.' },
      { at: 22, title: 'Loops: the long wait', body: 'Banks are sometimes slow. After 5 seconds the words change to “Still waiting. Don’t pay again.” After 30 the payment is marked pending, with a promise to tell her when it clears.' },
      { at: 28, title: 'Loops: the twentieth time', body: 'By the twentieth morning, Gullak puts “Pay Raju ₹240 again” at the top of the home screen. The same interaction gets shorter as it gets familiar.' },
      { at: 32, title: 'Four parts, written down', body: 'Trigger, rules, feedback, loops. Rohan builds from the strip, not from a mock-up of the happy path.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did Meera pay twice?', options: [{ id: 'a', label: 'Her internet was slow' }, { id: 'b', label: 'There was no feedback for two seconds and no rule stopping a second tap' }, { id: 'c', label: 'The button was too small' }],
      correct: 'b', explanation: 'Missing feedback made her tap again, and a missing rule let the second tap through.' },
    { id: 'c2', prompt: '“Still waiting. Don’t pay again” after 5 seconds is which part?', options: [{ id: 'a', label: 'A loop: the feedback changes as time passes' }, { id: 'b', label: 'The trigger' }, { id: 'c', label: 'A rule about amounts' }],
      correct: 'a', explanation: 'Loops decide what happens over time, including a long wait.' },
  ],
  game: {
    id: 'micro-build', title: 'Build the micro-interaction',
    instructions: 'Three of Gullak’s small moments, in pieces. Pick a piece, then drop it into its part of the strip. When a strip is complete, it plays.',
    lanes: [
      { id: 'trigger', label: 'Trigger', hint: 'What starts it: a person or the system' },
      { id: 'rules', label: 'Rules', hint: 'What it may do, and what it won’t' },
      { id: 'feedback', label: 'Feedback', hint: 'How you know it happened' },
      { id: 'loops', label: 'Loops & modes', hint: 'How it changes over time or offline' },
    ],
    cards: [
      { id: 'g1', label: 'Meera taps “Pay ₹240” on Raju’s card', lane: 'trigger', visual: 'pay', note: 'A manual trigger: a person does something. Make it look tappable and say exactly what it will do, amount included.' },
      { id: 'g2', label: 'The button locks after the first tap, so a second tap can’t pay twice', lane: 'rules', visual: 'pay', note: 'The rule that would have saved Meera ₹240. Rules are invisible, so write them down or nobody builds them.' },
      { id: 'g3', label: 'The label becomes a spinner and “Waiting for your bank”, then a tick and one buzz', lane: 'feedback', visual: 'pay', note: 'The press shows within 100 ms, the spinner says it’s working, and the tick says it’s done, in words as well as motion.' },
      { id: 'g4', label: 'After 5 seconds the words change to “Still waiting. Don’t pay again”', lane: 'loops', visual: 'pay', note: 'A loop over a long wait. The same spinner for 20 seconds looks frozen; new words keep people from tapping again.' },
      { id: 'g5', label: 'A ₹234 payment clears', lane: 'trigger', visual: 'roundup', note: 'A system trigger: nobody tapped. Gullak noticed something and started the interaction itself.' },
      { id: 'g6', label: 'Round up to ₹240, but only if the balance stays above ₹500', lane: 'rules', visual: 'roundup', note: 'The rule protects Meera’s money: saving ₹6 should never leave her short for tomorrow’s milk.' },
      { id: 'g7', label: 'A ₹6 coin drops into the Goa jar and its total ticks up', lane: 'feedback', visual: 'roundup', note: 'System triggers need feedback even more, or the money seems to go missing. The coin shows where the ₹6 went.' },
      { id: 'g8', label: 'After the tenth round-up, the coin stops and a Sunday summary shows the week’s total', lane: 'loops', visual: 'roundup', note: 'A long loop. A coin animation 30 times a week becomes noise; one summary says more.' },
      { id: 'g9', label: 'Meera pulls the passbook down past 64 px', lane: 'trigger', visual: 'refresh', note: 'A gesture as trigger. The 64 px threshold stops a scroll from refreshing by accident.' },
      { id: 'g10', label: 'Refresh only if the last one was over 10 seconds ago; otherwise just snap back', lane: 'rules', visual: 'refresh', note: 'A rule that saves the bank’s servers and Meera’s data. The pull still answers, it just doesn’t fetch.' },
      { id: 'g11', label: 'The piggy rolls with her finger, then spins while new entries load', lane: 'feedback', visual: 'refresh', note: 'It follows the finger, so she knows the pull is being read, then shows the work. New entries slide in at the top.' },
      { id: 'g12', label: 'Offline, the pull says “You’re offline. Showing this morning’s passbook” instead of spinning', lane: 'loops', visual: 'refresh', note: 'A mode: the same gesture in a different situation. A spinner that can never finish would be a lie.' },
    ],
  },
  gap: {
    id: 'gap', from: 5, at: 9.6,
    prompt: 'The trigger is Meera’s tap. What should Ishita decide next, before any animation?',
    options: [{ id: 'a', label: 'The colour of the tick' }, { id: 'b', label: 'The rules: what one tap may do, and that a second tap can’t pay again' }, { id: 'c', label: 'A confetti burst for success' }],
    correct: 'b', explanation: 'Rules come before feedback. The double payment was a missing rule, not a missing animation.',
  },
  takeaways: [
    { title: 'Trigger', body: 'A person or the system starts it. Make manual triggers say what they’ll do.' },
    { title: 'Rules', body: 'What it may do and what it won’t. Invisible, so write them down.' },
    { title: 'Feedback', body: 'Within 100 ms, specific, and in words as well as motion.' },
    { title: 'Loops and modes', body: 'Long waits, the twentieth time, offline. Decide how it changes, or it won’t.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A savings jar filling after a payment clears has a…', options: [{ id: 'a', label: 'System trigger' }, { id: 'b', label: 'Manual trigger' }], correct: 'a', explanation: 'Nobody tapped; the app started it.' },
      { id: 'q2', prompt: '“A second tap can’t pay twice” is a…', options: [{ id: 'a', label: 'Trigger' }, { id: 'b', label: 'Loop' }, { id: 'c', label: 'Rule' }], correct: 'c', explanation: 'It limits what the interaction may do.' },
      { id: 'q3', prompt: 'A button should show it was pressed within about…', options: [{ id: 'a', label: '1 second' }, { id: 'b', label: '100 ms' }, { id: 'c', label: '500 ms' }, { id: 'd', label: '3 seconds' }], correct: 'b', explanation: 'Slower than that and people tap again.' },
      { id: 'q4', prompt: 'The same pull to refresh behaving differently offline is a…', options: [{ id: 'a', label: 'Trigger' }, { id: 'b', label: 'Rule' }, { id: 'c', label: 'Feedback' }, { id: 'd', label: 'Mode' }], correct: 'd', explanation: 'Modes are the same interaction in a different situation.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why write the rules before designing the feedback?', hint: 'What does the feedback report?', options: [{ id: 'a', label: 'Feedback reports what the rules did; you can’t design the message before you know the outcomes' }, { id: 'b', label: 'Rules are quicker to write' }, { id: 'c', label: 'Developers prefer it' }, { id: 'd', label: 'Feedback is optional' }], correct: 'a', explanation: 'Each rule creates an outcome (paid, locked, PIN needed, pending), and each outcome needs its own feedback.' },
    { id: 'l2', prompt: 'Gullak’s round-up has a system trigger. Why does it need feedback more than the Pay button does?', hint: 'Who did something?', options: [{ id: 'a', label: 'It doesn’t' }, { id: 'b', label: 'Meera didn’t act, so without feedback money seems to vanish from her balance' }, { id: 'c', label: 'System triggers are slower' }, { id: 'd', label: 'The law requires an animation' }], correct: 'b', explanation: 'When the app acts on its own, feedback is the only way people learn it happened and why.' },
    { id: 'l3', prompt: 'Meera has paid Raju ₹240 every morning for 20 days. What would a good loop do?', hint: 'Familiar tasks.', options: [{ id: 'a', label: 'Add a longer celebration each time' }, { id: 'b', label: 'Nothing; every payment should be identical' }, { id: 'c', label: 'Offer “Pay Raju ₹240 again” on the home screen, and later an autopay' }, { id: 'd', label: 'Hide Raju’s card' }], correct: 'c', explanation: 'Loops let a repeated interaction get shorter as it becomes routine.' },
    { id: 'l4', prompt: 'The bank confirms the payment after 40 seconds, when Meera has already left the screen. What should happen?', hint: 'Feedback can arrive later.', options: [{ id: 'a', label: 'Nothing; she has left' }, { id: 'b', label: 'A notification saying “₹240 paid to Raju”, and the passbook entry turns from pending to paid' }, { id: 'c', label: 'Pay again to be safe' }, { id: 'd', label: 'Show the tick the next time she opens the app, with confetti' }], correct: 'b', explanation: 'The pending state promised to tell her. Keeping that promise is part of the loop.' },
    { id: 'l5', prompt: 'Rohan asks how to spec a micro-interaction so he can build it without guessing. What’s best?', hint: 'More than a mock-up.', options: [{ id: 'a', label: 'A video of the happy path' }, { id: 'b', label: 'The final frame in Figma' }, { id: 'c', label: 'A written strip of trigger, rules with every edge case, feedback for each outcome with timings, and loops and modes' }, { id: 'd', label: 'A link to a Dribbble shot' }], correct: 'c', explanation: 'The happy path is one outcome. The strip covers the double tap, the long wait and offline too.' },
  ],
};

export const pr3_2: Episode = {
  lessonId: 'pr.3-2',
  hook: 'Gullak’s new build rains coins on launch, throws confetti on every payment and winks at a failed one. Meera loved it on Monday. Watch what she thought of it by Friday.',
  scene: {
    id: 'delight-check', duration: 36,
    beats: [
      { at: 0, title: 'Monday: so much fun', body: 'Gullak’s playful build ships. Coins rain when the app opens, confetti bursts after each payment, and every tap chimes. Meera smiles the first time.' },
      { at: 6, title: 'Friday: still waiting', body: 'By Friday she has opened Gullak 15 times. Each time, 1.5 seconds of coins stand between her and her balance. She’s at the counter with a customer waiting.' },
      { at: 12, title: 'Do the sum', body: 'Confetti for 1.2 seconds on 60 payments a month is 72 seconds of watching. The coin rain is over two minutes. The jingle plays 900 times a month.' },
      { at: 18, title: 'The wrong moment', body: 'A payment fails because her bank is down. The piggy winks: “Oopsie!” Then a ₹50 late-fee notice arrives with a party popper. Playful on a bad moment reads as mockery.' },
      { at: 24, title: 'What earns it', body: 'The Goa jar reaches ₹15,000. The piggy fills, bursts, and coins scatter for under a second, once. Rare, earned, and not in the way.' },
      { at: 29, title: 'Small, every day', body: 'Everyday payments get a 300 ms tick and one buzz. The pull to refresh rolls the piggy with her finger, which adds no time at all.' },
      { at: 33, title: 'Rare, quick, in tune', body: 'Ishita cuts what plays too often, gets in the way or strikes the wrong tone. What’s left is noticed.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the coin rain stop feeling fun by Friday?', options: [{ id: 'a', label: 'The coins were the wrong colour' }, { id: 'b', label: 'It played on every launch and stood between Meera and her balance' }, { id: 'c', label: 'Her phone was slow' }],
      correct: 'b', explanation: 'A surprise that repeats every time isn’t a surprise, and one that blocks the task is a wait.' },
    { id: 'c2', prompt: 'What made the Goa jar burst feel like delight?', options: [{ id: 'a', label: 'It happens once, at a moment she earned, and doesn’t block anything' }, { id: 'b', label: 'It’s the longest animation in the app' }, { id: 'c', label: 'It has sound' }],
      correct: 'a', explanation: 'Rare, earned and out of the way.' },
  ],
  game: {
    id: 'delight-judge', title: 'Run the delight review',
    instructions: 'Each card is a playful moment from Gullak’s new build. Watch it and give your critique: keep it, or say what’s wrong. The time it costs Meera each month adds up as you go.',
    lanes: [
      { id: 'keep', label: 'Keep it', hint: 'Rare and earned, or small and quick' },
      { id: 'often', label: 'Too often', hint: 'A big flourish on an everyday task' },
      { id: 'blocking', label: 'In the way', hint: 'You wait for it before you can carry on' },
      { id: 'tone', label: 'Wrong tone', hint: 'Playful on a bad moment' },
    ],
    cards: [
      { id: 'g1', label: 'Coins rain for 1.5 seconds before the balance shows, every time Gullak opens', lane: 'blocking', visual: 'coin-rain', note: 'Meera opens the app to check her balance, and the rain sits in front of it. Show the balance at once; save the rain for a goal reached.' },
      { id: 'g2', label: 'The piggy dances for 2 seconds after the PIN, before the Pay screen appears', lane: 'blocking', visual: 'unlock-dance', note: 'Two seconds between her and the payment, 60 times a month. Anything in front of the next step must be under about 300 ms.' },
      { id: 'g3', label: 'Confetti bursts for 1.2 seconds after every payment', lane: 'often', visual: 'pay-confetti', note: 'It doesn’t block, but at 60 a month it means nothing by day two. Everyday success gets the tick; confetti is for rare wins.' },
      { id: 'g4', label: 'A coin jingle plays on every button tap', lane: 'often', visual: 'tap-jingle', note: 'Around 900 taps a month, often in a shop or on a bus. Sound on every tap is noise. Keep sound for the rare moment, and respect silent mode.' },
      { id: 'g5', label: 'The balance sparkles and wiggles every time it appears', lane: 'often', visual: 'balance-sparkle', note: 'Motion on the number she checks most makes it harder to read. A balance should be still and clear.' },
      { id: 'g6', label: 'A failed payment shows a winking piggy: “Oopsie! Try again?”', lane: 'tone', visual: 'failed-wink', note: 'Her money may or may not have left. She needs calm, plain words: what happened, whether she was charged, what to do. No winks.' },
      { id: 'g7', label: 'A ₹50 late-fee notice arrives with a party popper', lane: 'tone', visual: 'late-fee-party', note: 'Celebrating a fine reads as mockery. Bad news gets a neutral tone and a clear next step.' },
      { id: 'g8', label: 'The Goa jar fills and bursts, once, when Meera reaches ₹15,000', lane: 'keep', visual: 'goal-burst', note: 'Rare, earned after months of saving, under a second, and nothing waits on it. This is where the playfulness belongs.' },
      { id: 'g9', label: 'A tick draws in over 300 ms with one buzz after each payment', lane: 'keep', visual: 'tick-draw', note: 'Frequent, so it’s small and quick. It tells her the money went, and never makes her wait.' },
      { id: 'g10', label: 'The piggy rolls with Meera’s finger as she pulls to refresh', lane: 'keep', visual: 'pull-coin', note: 'It follows her finger, so it adds no time, and it shows the pull is being read. Small delight inside a real job.' },
    ],
  },
  gap: {
    id: 'gap', from: 18, at: 22.6,
    prompt: 'A payment has failed and the piggy winks “Oopsie!”. What should the failure screen do instead?',
    options: [{ id: 'a', label: 'A bigger, sadder piggy' }, { id: 'b', label: 'Say plainly what happened, whether money left her account, and what to do next, with no flourish' }, { id: 'c', label: 'Keep the wink but make it shorter' }],
    correct: 'b', explanation: 'Bad moments need calm and clarity. Playfulness there reads as not taking her money seriously.',
  },
  takeaways: [
    { title: 'Do the sum', body: 'Duration × times a month. Big flourishes are only for rare moments.' },
    { title: 'Never in the way', body: 'Nothing longer than about 300 ms should stand between someone and the next step.' },
    { title: 'Read the mood', body: 'No playfulness on failures, fines or serious payments.' },
    { title: 'Earned and small', body: 'Celebrate what people achieved, once. Make everyday feedback quick and quiet.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A 1-second animation on a task done 60 times a month costs…', options: [{ id: 'a', label: '1 minute a month' }, { id: 'b', label: '6 seconds a month' }], correct: 'a', explanation: '1 s × 60 = 60 s.' },
      { id: 'q2', prompt: 'Confetti belongs on…', options: [{ id: 'a', label: 'Every payment' }, { id: 'b', label: 'A savings goal reached' }, { id: 'c', label: 'A failed payment, to soften it' }], correct: 'b', explanation: 'Rare and earned.' },
      { id: 'q3', prompt: 'A failed payment should feel…', options: [{ id: 'a', label: 'Playful' }, { id: 'b', label: 'Silent' }, { id: 'c', label: 'Calm and clear about what to do' }, { id: 'd', label: 'Like a celebration of trying' }], correct: 'c', explanation: 'Read the mood of the moment.' },
      { id: 'q4', prompt: 'A flourish that sits before the next step should be under about…', options: [{ id: 'a', label: '2 seconds' }, { id: 'b', label: '1 second' }, { id: 'c', label: '5 seconds' }, { id: 'd', label: '300 ms' }], correct: 'd', explanation: 'Longer and people wait for it.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why do people love a flourish on day one and resent it by day five?', hint: 'Surprise.', options: [{ id: 'a', label: 'Delight depends on surprise; once it’s expected, only its cost is left' }, { id: 'b', label: 'Phones get slower' }, { id: 'c', label: 'They don’t; it’s the same every day' }, { id: 'd', label: 'Sound settings change' }], correct: 'a', explanation: 'Repetition turns surprise into a wait, which is why frequency matters more than polish.' },
    { id: 'l2', prompt: 'Ishita wants a “Skip” button on the coin rain. Is that enough?', hint: 'Who pays the cost?', options: [{ id: 'a', label: 'Yes, skippable is fine' }, { id: 'b', label: 'No; every person still has to notice and tap it every time. Don’t put the rain there at all' }, { id: 'c', label: 'Yes, if the button is big' }, { id: 'd', label: 'No, skip buttons are illegal' }], correct: 'b', explanation: 'A skip button moves the cost onto the user. Fix the placement and frequency instead.' },
    { id: 'l3', prompt: 'Meera has Reduce motion on. What should the Goa jar celebration become?', hint: 'pr.2.', options: [{ id: 'a', label: 'Nothing at all' }, { id: 'b', label: 'The same burst' }, { id: 'c', label: 'A still illustration of the full jar with “You saved ₹15,000 for Goa”, faded in' }, { id: 'd', label: 'A sound instead' }], correct: 'c', explanation: 'Keep the meaning, the achievement, and drop the scattering motion.' },
    { id: 'l4', prompt: 'How could Gullak check whether the confetti was delight or distraction?', hint: 'Measure, don’t guess.', options: [{ id: 'a', label: 'Ask the team if they like it' }, { id: 'b', label: 'Compare time from opening to first payment, and ask daily users after two weeks, with and without it' }, { id: 'c', label: 'Count Dribbble likes' }, { id: 'd', label: 'Check it on the designer’s phone' }], correct: 'b', explanation: 'Delight is judged by daily users after the novelty fades, and by whether it slows the task.' },
    { id: 'l5', prompt: 'Rohan asks for one rule the whole team can use. Which is best?', hint: 'Frequency and mood.', options: [{ id: 'a', label: 'Every screen needs one delightful animation' }, { id: 'b', label: 'No animation ever' }, { id: 'c', label: 'The more often it happens, the smaller the feedback; celebrate only rare, earned moments, never bad ones, and never in the way' }, { id: 'd', label: 'Copy what other apps do' }], correct: 'c', explanation: 'Size scales inversely with frequency, mood decides tone, and nothing blocks the task.' },
  ],
};
