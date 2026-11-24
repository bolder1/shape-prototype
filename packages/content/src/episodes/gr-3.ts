// Episodes for chapter gr.3 · Experimentation. Drafts by Claude, for review.
// Tokri is an Indore grocery-delivery app: vegetables, fruit and staples in under an hour. Its key number is checkout
// conversion, 8% of carts today. Farhan Qureshi is its product manager, Ananya Joshi its product designer and Kavya
// Nair its analyst. The maths (sample size, the z-test, the split check, peeking) is in ../stats and is tested there;
// the numbers quoted below are what those functions give.
import { TOKRI_HYPOS, TOKRI_PLANS, TOKRI_RESULTS, hypoText, type Episode, type TokriHypo, type TokriPlan, type TokriResult } from '../episode';

const hypo = (k: TokriHypo) => hypoText(TOKRI_HYPOS[k]);
const plan = (k: TokriPlan) => TOKRI_PLANS[k].text;
const result = (k: TokriResult) => TOKRI_RESULTS[k].text;

export const gr3_1: Episode = {
  lessonId: 'gr.3-1',
  hook: 'Tokri ran eleven tests last quarter. Nine came out flat, and nobody could say what any of them had taught the team.',
  scene: {
    id: 'hypothesis-shape', duration: 36,
    beats: [
      { at: 0, title: '“Make it green”', body: 'The Monday growth meeting: green Pay button, a bigger banner, a new font for prices. Each idea goes straight into a test.' },
      { at: 6, title: 'Flat, and nothing learned', body: 'The green button ran two weeks: 8.0% against 8.1%. Nobody had said what they expected, or why, so nobody knew what to do next.' },
      { at: 11, title: 'Because: start from what you saw', body: 'Ananya watches last month’s session recordings. 31% of dropped carts were dropped on the payment page, the first place the ₹25 delivery fee appears.' },
      { at: 16, title: 'One change, the right people', body: 'We believe showing the fee on the cart, for people who reach the cart. One change a designer can build, for the people who will see it.' },
      { at: 21, title: 'Will: a metric and a size', body: 'Checkout conversion from 8% to at least 8.8%. Kavya can size a test from that, and the team knows what counts as a win.' },
      { at: 26, title: 'The whole sentence', body: 'Because 31% of dropped carts stopped where the fee appears, we believe showing it on the cart for people who reach the cart will lift checkout conversion to at least 8.8%.' },
      { at: 31, title: 'Either way, you learn', body: 'If it wins, ship it. If it’s flat, fee shock wasn’t why people left, and the next hypothesis starts from there.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the green-button test teach Tokri nothing?', options: [{ id: 'a', label: 'Green is the wrong colour' }, { id: 'b', label: 'Nobody wrote down what they expected or why, so a flat result had nothing to disprove' }, { id: 'c', label: 'Two weeks is too short' }],
      correct: 'b', explanation: 'A test checks a belief. With no belief written down, there’s nothing for the result to confirm or rule out.' },
    { id: 'c2', prompt: 'Where did the “because” in the new hypothesis come from?', options: [{ id: 'a', label: 'What competitors do' }, { id: 'b', label: 'Session recordings showing where carts were dropped' }, { id: 'c', label: 'The founder’s hunch' }],
      correct: 'b', explanation: 'Evidence makes the reason something a result can confirm or knock down.' },
  ],
  game: {
    id: 'hypo-fix', title: 'Fix the hypothesis',
    instructions: 'Each card is a hypothesis from Tokri’s backlog, and each has one weak part. Tap the part that stops it being testable, then choose the rewrite that fixes it.',
    lanes: [
      { id: 'because', label: 'Because…', hint: 'Something you saw, not an opinion' },
      { id: 'change', label: 'We believe…', hint: 'One change a designer can build' },
      { id: 'who', label: 'For…', hint: 'The people who will meet the change' },
      { id: 'expect', label: 'Will…', hint: 'A metric, a direction and a size' },
    ],
    cards: [
      { id: 'g1', label: hypo('feeEarly'), lane: 'because', visual: 'feeEarly', note: 'What other apps do isn’t evidence about Tokri’s customers. The recordings show where carts were dropped here.' },
      { id: 'g2', label: hypo('address'), lane: 'change', visual: 'address', note: 'The evidence points at one thing: retyping the address. “A better checkout” could be anything, so a result couldn’t say what worked.' },
      { id: 'g3', label: hypo('coupon'), lane: 'who', visual: 'coupon', note: 'Customers who have already ordered can’t use a first-order coupon. Counting them dilutes the effect and makes the test far bigger than it needs to be.' },
      { id: 'g4', label: hypo('usual'), lane: 'expect', visual: 'usual', note: '“Love the app” can’t be measured or lost. Orders per customer can, and the interviews were about forgetting to reorder.' },
      { id: 'g5', label: hypo('doorstep'), lane: 'because', visual: 'doorstep', note: 'Being sure isn’t a reason a test can check. The riders’ logs are.' },
      { id: 'g6', label: hypo('fruit'), lane: 'change', visual: 'fruit', note: 'Three changes at once: if it wins, nobody knows which one did it. The 58% exit points at trust in freshness, so test the photo of today’s batch.' },
      { id: 'g7', label: hypo('retry'), lane: 'who', visual: 'retry', note: 'Most customers never see a failed payment, so they can’t be affected. Test on the people the retry appears for.' },
      { id: 'g8', label: hypo('hindi'), lane: 'expect', visual: 'hindi', note: '“Change” has no direction or size, so any result fits it. Naming 7.2% also tells Kavya how big a test to run.' },
    ],
  },
  gap: {
    id: 'gap', from: 16, at: 20.6,
    prompt: 'Ananya has the because, the change and the who. What does the “will” need?',
    options: [{ id: 'a', label: '“People will like it”' }, { id: 'b', label: 'A metric, a direction and a size: checkout conversion from 8% to at least 8.8%' }, { id: 'c', label: '“Conversion will change”' }],
    correct: 'b', explanation: 'A named metric with a size can be proved wrong, and the size sets how many people the test needs.',
  },
  takeaways: [
    { title: 'Because, believe, for, will', body: 'Evidence, one change, the people who meet it, and a measurable result.' },
    { title: 'Evidence, not opinion', body: 'Recordings, tickets, interviews or data. “Competitors do it” and “we’re sure” aren’t reasons.' },
    { title: 'One change, right people', body: 'Bundles hide what worked; people who never see the change water it down.' },
    { title: 'Say how much', body: 'A direction and a size make it losable, and set the test’s size.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A testable hypothesis can…', options: [{ id: 'a', label: 'Be proved wrong by a result' }, { id: 'b', label: 'Only ever be confirmed' }], correct: 'a', explanation: 'If no result could disprove it, a test can’t teach you anything.' },
      { id: 'q2', prompt: '“New photos, new prices and a new layout” is a weak change because…', options: [{ id: 'a', label: 'It’s too small' }, { id: 'b', label: 'If it wins, you can’t tell which part did it' }, { id: 'c', label: 'Photos can’t be tested' }], correct: 'b', explanation: 'One change per hypothesis, so the result points at something.' },
      { id: 'q3', prompt: 'The best source for the “because” is…', options: [{ id: 'a', label: 'What a competitor did' }, { id: 'b', label: 'The most senior person’s opinion' }, { id: 'c', label: 'Something you observed: data, recordings, tickets or interviews' }], correct: 'c', explanation: 'Evidence about your own customers.' },
      { id: 'q4', prompt: 'A flat result on a well-written hypothesis means…', options: [{ id: 'a', label: 'The test was wasted' }, { id: 'b', label: 'The reason you gave probably wasn’t the cause, at least not at the size you expected' }, { id: 'c', label: 'Run it again until it wins' }, { id: 'd', label: 'The metric is broken' }], correct: 'b', explanation: 'That’s learning: the next hypothesis starts from a better place.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why write the expected size (“at least 8.8%”) before the test, not after?', hint: 'What does the size feed into?', options: [{ id: 'a', label: 'It looks more professional' }, { id: 'b', label: 'It sets the sample size, and deciding it after the result lets you call any change a win' }, { id: 'c', label: 'Managers need a number' }, { id: 'd', label: 'It doesn’t matter when' }], correct: 'b', explanation: 'The minimum detectable effect sizes the test. Picked afterwards, it bends to fit whatever happened.' },
    { id: 'l2', prompt: 'The coupon hypothesis is about new installs, but the test includes every customer. What happens to the effect?', hint: 'Who can use a first-order coupon?', options: [{ id: 'a', label: 'It gets bigger' }, { id: 'b', label: 'It shrinks: most people in the test can’t be affected, so the average change is tiny and the test needs far more people' }, { id: 'c', label: 'Nothing changes' }, { id: 'd', label: 'The test becomes invalid by law' }], correct: 'b', explanation: 'If 1 in 10 people in the test can use the coupon, the measured lift is about a tenth of the real one.' },
    { id: 'l3', prompt: 'Tokri’s north star is weekly orders, but the hypothesis measures checkout conversion. Why?', hint: 'st.3: inputs move faster.', options: [{ id: 'a', label: 'Checkout conversion is easier to fake' }, { id: 'b', label: 'It’s right next to the change, so it moves more and sooner; weekly orders is a guardrail you check too' }, { id: 'c', label: 'Weekly orders don’t matter' }, { id: 'd', label: 'Analysts prefer percentages' }], correct: 'b', explanation: 'Measure the input the change can move, and keep the bigger number as a check.' },
    { id: 'l4', prompt: 'Which “because” is strongest?', hint: 'What would a sceptic accept?', options: [{ id: 'a', label: '“Zepto does it”' }, { id: 'b', label: '“Riders logged 340 failed deliveries after 9 pm last month because nobody came to the door”' }, { id: 'c', label: '“Everyone in the team agrees”' }, { id: 'd', label: '“It’s best practice”' }], correct: 'b', explanation: 'Specific, counted, and about your own customers.' },
    { id: 'l5', prompt: 'A team writes ten hypotheses. Which should they test first?', hint: 'gr.1 and st.1: impact, confidence, effort.', options: [{ id: 'a', label: 'The one the founder likes' }, { id: 'b', label: 'The one with the strongest evidence and biggest likely effect that the traffic can test in a few weeks' }, { id: 'c', label: 'All ten at once on the same screen' }, { id: 'd', label: 'The cheapest to build, whatever it is' }], correct: 'b', explanation: 'Strong evidence, a big effect and a test that can finish soon. Lesson 2 shows how to check the last part.' },
  ],
};

export const gr3_2: Episode = {
  lessonId: 'gr.3-2',
  hook: 'Farhan wanted to run the fee test “for a few days and see”. Kavya showed him that a few days of noise looks exactly like a win.',
  scene: {
    id: 'sample-size', duration: 36,
    beats: [
      { at: 0, title: '“A few days and see”', body: 'The fee-on-the-cart test is ready. Farhan wants to switch it on and look on Thursday.' },
      { at: 6, title: 'Noise first', body: 'Kavya shows the same unchanged cart, day by day: 7.4%, 8.6%, 7.9%, 8.3%. Nothing changed, and it still moves more than the lift they hope for.' },
      { at: 11, title: 'The smallest lift worth finding', body: 'Anything under +10%, from 8% to 8.8%, wouldn’t pay for the work. That’s the minimum detectable effect.' },
      { at: 16, title: '18,872 a version', body: 'At 5% significance and 80% power, each version needs 18,872 people. Lehr’s rule on paper gives 18,400: close enough to plan with.' },
      { at: 21, title: 'Half the lift, four times the people', body: 'To catch +5% would take 73,853 a version. Small effects are expensive.' },
      { at: 26, title: 'Traffic sets the calendar', body: '6,000 carts a day. 37,744 people is just over six days, so the test runs one full week: every weekday and a weekend.' },
      { at: 31, title: 'Written down before it starts', body: 'Metric, MDE, sample, end date. No looking on Thursday. And the green button, at +2%, would need 22 weeks: it’s off the list.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why can’t Tokri “run it for a few days and see”?', options: [{ id: 'a', label: 'Tests must last a month' }, { id: 'b', label: 'Day-to-day noise is bigger than the lift they’re looking for, so a few days can’t tell the two apart' }, { id: 'c', label: 'Kavya was busy' }],
      correct: 'b', explanation: 'The sample has to be big enough for a real effect to stand out from noise.' },
    { id: 'c2', prompt: 'Why does the test run a full week when the sample arrives in about six days?', options: [{ id: 'a', label: 'To use up the budget' }, { id: 'b', label: 'So weekdays and the weekend count equally; people shop differently on a Sunday' }, { id: 'c', label: 'Because tests must be in weeks by law' }],
      correct: 'b', explanation: 'Whole weeks stop one kind of day from skewing the result.' },
  ],
  game: {
    id: 'sample-dial', title: 'How long will it take?',
    instructions: 'Each card is a test Tokri wants to run. Estimate how many weeks it needs at 5% significance and 80% power, then see the sum. Lehr’s rule helps: 16 × p × (1 − p) ÷ (the change, in points)² people a version.',
    lanes: [
      { id: 'go', label: 'Run it', hint: 'Four weeks or less' },
      { id: 'long', label: 'Only if it matters', hint: 'Five to eight weeks' },
      { id: 'rethink', label: 'Rethink it', hint: 'More than eight weeks' },
    ],
    cards: [
      { id: 'g1', label: plan('feeEarly'), lane: 'go', visual: 'feeEarly', note: 'Lehr: 16 × 0.08 × 0.92 ÷ 0.008² ≈ 18,400 a version. Two versions on 6,000 carts a day is about six days, so one full week.' },
      { id: 'g2', label: plan('greenPay'), lane: 'rethink', visual: 'greenPay', note: 'A +2% lift is 0.16 points. One over that squared is huge: 4,55,000 a version, 22 weeks. If a change can only move a metric that little, test something bolder.' },
      { id: 'g3', label: plan('slots'), lane: 'long', visual: 'slots', note: 'Four versions share 700 people a day, and comparing three variants with the control splits the 5% three ways, so each needs 5,508. Five weeks: test two pickers, not three.' },
      { id: 'g4', label: plan('reorder'), lane: 'go', visual: 'reorder', note: 'A low 3% baseline needs 53,211 a version, but 20,000 home visits a day supply that in under six days. Busy screens test fast.' },
      { id: 'g5', label: plan('cautious'), lane: 'rethink', visual: 'cautious', note: 'Same test, a tenth of the traffic, ten times as long: nine weeks. To limit risk, watch guardrails daily instead of starving the test.' },
      { id: 'g6', label: plan('smallLift'), lane: 'long', visual: 'smallLift', note: 'Half the lift needs four times the people, 73,853 a version, on fewer carts a day: six weeks.' },
      { id: 'g7', label: plan('coupon'), lane: 'long', visual: 'coupon', note: 'A 20% baseline and a 2-point lift need only 6,510 a version, but 400 new installs a day take five weeks to get there.' },
      { id: 'g8', label: plan('hindi'), lane: 'go', visual: 'hindi', note: '23,627 a version on 2,500 Hindi carts a day: 19 days, so three full weeks.' },
    ],
  },
  gap: {
    id: 'gap', from: 16, at: 20.6,
    prompt: 'Farhan asks: “What if we only want to catch a 5% lift?” What happens to the sample?',
    options: [{ id: 'a', label: 'It halves' }, { id: 'b', label: 'It roughly quadruples: half the lift, four times the people' }, { id: 'c', label: 'It stays at 18,872' }],
    correct: 'b', explanation: 'Sample size grows with one over the lift squared: 73,853 a version.',
  },
  takeaways: [
    { title: 'Size it before you start', body: 'Baseline, MDE, 5% significance, 80% power: those four numbers give the sample.' },
    { title: 'Half the lift, 4× the people', body: 'The MDE matters most. Small effects need huge samples.' },
    { title: 'Traffic sets the calendar', body: 'Divide by people a day, then round up to whole weeks.' },
    { title: 'Too long? Change the test', body: 'A bolder change, a busier screen, fewer variants, or learn it another way.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'The minimum detectable effect is…', options: [{ id: 'a', label: 'The smallest lift the test is built to find' }, { id: 'b', label: 'The lift you actually got' }], correct: 'a', explanation: 'Pick the smallest change worth acting on.' },
      { id: 'q2', prompt: '80% power means…', options: [{ id: 'a', label: '80% of people see the variant' }, { id: 'b', label: 'If the real lift is at least the MDE, the test will detect it 8 times in 10' }, { id: 'c', label: 'The result is 80% certain' }], correct: 'b', explanation: 'Power is the chance of catching a real effect of that size.' },
      { id: 'q3', prompt: 'Running a test on 10% of traffic “to be safe” makes it…', options: [{ id: 'a', label: 'Ten times as long' }, { id: 'b', label: 'More accurate' }, { id: 'c', label: 'Need fewer people' }], correct: 'a', explanation: 'The sample needed doesn’t change; it just arrives slower.' },
      { id: 'q4', prompt: 'A 5% significance level means…', options: [{ id: 'a', label: 'With no real difference, about 1 test in 20 still comes out “significant”' }, { id: 'b', label: 'The variant is 5% better' }, { id: 'c', label: '5% of users are in the test' }, { id: 'd', label: 'There’s a 95% chance B is better' }], correct: 'a', explanation: 'That’s the false-alarm rate you accept, if you only look once.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why use Lehr’s rule if the exact formula gives a slightly different number?', hint: 'When do you need it?', options: [{ id: 'a', label: 'It’s more accurate' }, { id: 'b', label: 'It’s quick enough to do in a meeting, and close enough to tell a two-week test from a twenty-week one' }, { id: 'c', label: 'The exact formula is wrong' }, { id: 'd', label: 'Analysts insist' }], correct: 'b', explanation: '16·p(1−p)/δ² is for deciding whether a test is worth planning; the calculator is for the plan.' },
    { id: 'l2', prompt: 'Tokri tests three variants against the control. Why does each need more people than a simple A/B?', hint: 'How many chances to get lucky?', options: [{ id: 'a', label: 'It doesn’t' }, { id: 'b', label: 'Three comparisons mean three chances of a false win, so each uses a stricter threshold (5% ÷ 3), which needs more people' }, { id: 'c', label: 'The servers are slower' }, { id: 'd', label: 'Variants are less accurate' }], correct: 'b', explanation: 'Split the 5% between the comparisons (Bonferroni), or the chance of a false winner grows with every variant.' },
    { id: 'l3', prompt: 'The fee test reached 37,744 people on Saturday, day six. Why not stop then?', hint: 'Who shops on a Sunday?', options: [{ id: 'a', label: 'No reason; stop' }, { id: 'b', label: 'The week isn’t complete: Sunday shoppers behave differently, and the plan said one full week' }, { id: 'c', label: 'Stopping early costs money' }, { id: 'd', label: 'The p-value needs a Sunday' }], correct: 'b', explanation: 'Whole weeks, decided in advance. Ending on a convenient day is a quiet form of peeking.' },
    { id: 'l4', prompt: 'A test would need 22 weeks. What’s the best response?', hint: 'Change the inputs.', options: [{ id: 'a', label: 'Run it anyway and check weekly' }, { id: 'b', label: 'Lower the bar to 80% confidence and hope' }, { id: 'c', label: 'Test a bolder change, measure a metric closer to it, or learn it with research instead' }, { id: 'd', label: 'Stop after two weeks and see' }], correct: 'c', explanation: 'A test that can’t finish in time isn’t a test. Change what you test, or use another method.' },
    { id: 'l5', prompt: 'Why plan with 80% power rather than, say, 50%?', hint: 'What does a miss cost?', options: [{ id: 'a', label: '80 is a round number' }, { id: 'b', label: 'At 50%, a real lift the size of the MDE is missed half the time, and the team drops a good idea as “flat”' }, { id: 'c', label: 'Higher power means fewer people' }, { id: 'd', label: 'It’s required by app stores' }], correct: 'b', explanation: 'Low power wastes good ideas. 80% is the usual trade between missed wins and test length.' },
  ],
};

export const gr3_3: Episode = {
  lessonId: 'gr.3-3',
  hook: 'On day four the Hindi checkout was “winning” by 17%. Kavya made the team wait. Three weeks later it was flat.',
  scene: {
    id: 'peek-trap', duration: 36,
    beats: [
      { at: 0, title: 'Day 4: a winner?', body: 'The Hindi checkout is up 17%, p = 0.03. Farhan has the launch post written. Kavya asks for the planned three weeks.' },
      { at: 6, title: 'It was the same cart', body: 'Kavya shows an A/A test: both versions the identical English cart. Checked every day, its p-value dips under 0.05 on day 4, then wanders back to 0.63.' },
      { at: 12, title: 'Every look is another chance', body: 'One look: 5% false alarms. Five looks, stopping at the first dip: 14%. Every day for three weeks: about 25%.' },
      { at: 17, title: 'Check the split first', body: 'A lighter cart page “won” by 10%. But its 50/50 split came out 19,900 against 19,000. The new page crashed on old phones before it logged anyone. The result is void.' },
      { at: 22, title: 'Don’t go fishing', body: 'The fee test, sliced 20 ways, finds iPhone users in Vijay Nagar at weekends up 43%, p = 0.04. With 20 slices, one like that is expected by chance.' },
      { at: 27, title: 'Read the range', body: 'The fee test ran its full week: +0.8 points, 95% range +0.25 to +1.36, a clean split, cancellations flat.' },
      { at: 32, title: 'Ship, and say why', body: 'Fee on the cart ships. Hindi checkout, flat at full length, doesn’t: any effect is probably smaller than the 0.65 points it was sized for.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did Kavya make the team wait on day 4?', options: [{ id: 'a', label: 'The dashboard was slow' }, { id: 'b', label: 'Early p-values swing; stopping at the first dip under 0.05 makes false wins far more likely' }, { id: 'c', label: 'Launches happen on Mondays' }],
      correct: 'b', explanation: 'The A/A test showed it: no real difference, and still “significant” on day 4.' },
    { id: 'c2', prompt: 'What was wrong with the lighter cart page’s 10% win?', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'The split was 19,900 vs 19,000, a sample ratio mismatch, so the groups weren’t comparable' }, { id: 'c', label: 'It wasn’t green' }],
      correct: 'b', explanation: 'People on old phones dropped out of B before being counted, so B was left with the people most likely to buy.' },
  ],
  game: {
    id: 'result-read', title: 'Make the call',
    instructions: 'Each card is a test readout from Tokri. Check the split, the sample and the guardrail before you look at the winner, then make the call.',
    lanes: [
      { id: 'ship', label: 'Ship it', hint: 'A real lift, guardrails fine' },
      { id: 'flat', label: 'No clear effect', hint: 'Ran its full length, nothing detected' },
      { id: 'harm', label: 'Don’t ship', hint: 'It made things worse' },
      { id: 'distrust', label: 'Fix the test first', hint: 'Broken split, stopped early, or fished out' },
    ],
    cards: [
      { id: 'g1', label: result('feeEarly'), lane: 'ship', visual: 'feeEarly', note: 'Clean split, full sample, p = 0.005, and the 95% range (+0.25 to +1.36 points) stays above zero. Cancellations didn’t move.' },
      { id: 'g2', label: result('hindiDay4'), lane: 'distrust', visual: 'hindiDay4', note: '5,000 people of the 23,627 a version it planned. p = 0.03 on day 4 is the kind of dip the A/A test showed. Let it run.' },
      { id: 'g3', label: result('lightCart'), lane: 'distrust', visual: 'lightCart', note: 'A 50/50 split of 38,900 should be within a few hundred of even. 900 apart has odds of about 1 in 2,00,000. Find the bug, then rerun.' },
      { id: 'g4', label: result('hindiEnd'), lane: 'flat', visual: 'hindiEnd', note: 'Full sample, p = 0.68, range −0.35 to +0.54 points. Not proof of zero, but any effect is probably below the 0.65 points it was sized for.' },
      { id: 'g5', label: result('scarcity'), lane: 'harm', visual: 'scarcity', note: 'Checkout rose, but complaints went from 2.0% of orders to 3.4%, and that’s significant too. A win bought with angry customers is a loss.' },
      { id: 'g6', label: result('slice'), lane: 'distrust', visual: 'slice', note: 'p = 0.04 in one of 20 slices is about what chance gives. Corrected for 20 looks (0.05 ÷ 20 = 0.0025), it isn’t close. If you believe it, test it as a new hypothesis.' },
      { id: 'g7', label: result('onePage'), lane: 'harm', visual: 'onePage', note: 'A clean, full test: conversion fell from 8.0% to 7.3%, and the whole range is below zero. The long page made checkout harder.' },
      { id: 'g8', label: result('reorder'), lane: 'ship', visual: 'reorder', note: 'Full sample, clean split, 3.0% to 3.36%, p < 0.001, and cancellations flat. Ship it.' },
    ],
  },
  gap: {
    id: 'gap', from: 17, at: 21.4,
    prompt: 'The lighter cart page won by 10%, but the 50/50 split came out 19,900 vs 19,000. What now?',
    options: [{ id: 'a', label: 'Ship it: 10% is big' }, { id: 'b', label: 'Treat the result as void, find why B lost people, fix it and rerun' }, { id: 'c', label: 'Ship it to half the users' }],
    correct: 'b', explanation: 'A sample ratio mismatch means the groups differ in more than the change. No result from it can be trusted.',
  },
  takeaways: [
    { title: 'Check the test first', body: 'Is the split what you planned? Did it reach its sample? Only then read the winner.' },
    { title: 'Don’t peek and stop', body: 'Every look is another chance of a false win. Decide the end before you start.' },
    { title: 'Read the range', body: 'The confidence interval shows how big the lift could be. Flat isn’t proof of zero.' },
    { title: 'Guardrails and slices', body: 'A win that hurts a guardrail is a loss. A slice found afterwards is a new hypothesis, not a result.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'Checking a test daily and stopping at the first p < 0.05…', options: [{ id: 'a', label: 'Raises the false-win rate well above 5%' }, { id: 'b', label: 'Is fine if p is small' }], correct: 'a', explanation: 'About 25% over three weeks of daily looks.' },
      { id: 'q2', prompt: 'A sample ratio mismatch means…', options: [{ id: 'a', label: 'The split differs from plan by more than chance, so something is broken' }, { id: 'b', label: 'One version won' }, { id: 'c', label: 'The test needs more people' }], correct: 'a', explanation: 'Find the bug before reading anything else.' },
      { id: 'q3', prompt: 'p = 0.03 means…', options: [{ id: 'a', label: 'A 97% chance B is better' }, { id: 'b', label: 'If there were no real difference, a gap this big would turn up about 3% of the time' }, { id: 'c', label: 'B is 3% better' }], correct: 'b', explanation: 'It’s about the data assuming no effect, not the chance the effect is real.' },
      { id: 'q4', prompt: 'Looking at 20 segments and reporting the one with p < 0.05 is…', options: [{ id: 'a', label: 'Thorough analysis' }, { id: 'b', label: 'Fishing: by chance, about one in 20 will “win”' }, { id: 'c', label: 'Required' }, { id: 'd', label: 'A guardrail' }], correct: 'b', explanation: 'Correct for the number of looks, or test the slice afresh.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'If the team really needs to look early, what’s the honest way?', hint: 'Plan the looks.', options: [{ id: 'a', label: 'Look whenever, but only believe big wins' }, { id: 'b', label: 'Use a sequential method built for repeated looks (like a group-sequential or always-valid test), decided before the start' }, { id: 'c', label: 'Hide the dashboard' }, { id: 'd', label: 'Lower the bar to p < 0.1' }], correct: 'b', explanation: 'Sequential tests spend the 5% across planned looks, so peeking stops being cheating.' },
    { id: 'l2', prompt: 'The fee test’s 95% range is +0.25 to +1.36 points. What does that tell Farhan?', hint: 'The range, not only the middle.', options: [{ id: 'a', label: 'The lift is exactly 0.8 points' }, { id: 'b', label: 'The real lift is plausibly anywhere from small (+0.25) to large (+1.36), but it is above zero' }, { id: 'c', label: 'There’s a 95% chance it’s 0.8' }, { id: 'd', label: 'The test failed' }], correct: 'b', explanation: 'Plan the forecast around the range: even the low end is a win.' },
    { id: 'l3', prompt: 'A new feature wins strongly in week one, then fades to flat by week three. What might be happening?', hint: 'Shiny and new.', options: [{ id: 'a', label: 'The servers slowed down' }, { id: 'b', label: 'A novelty effect: regulars tap the new thing because it’s new; look at the effect by week, and at new users alone' }, { id: 'c', label: 'Sample ratio mismatch' }, { id: 'd', label: 'Weekends' }], correct: 'b', explanation: 'Novelty fades. Running whole weeks, and checking new users separately, shows the lasting effect.' },
    { id: 'l4', prompt: '“Only 2 left!” lifted checkout but raised complaints. What should Tokri do?', hint: 'gr.1-4.', options: [{ id: 'a', label: 'Ship it: the primary metric won' }, { id: 'b', label: 'Don’t ship: the guardrail got significantly worse, and fake scarcity is a dark pattern on India’s 2023 list' }, { id: 'c', label: 'Ship it on weekends only' }, { id: 'd', label: 'Run it again until complaints are flat' }], correct: 'b', explanation: 'Guardrails exist for this. A conversion win that costs trust is a loss.' },
    { id: 'l5', prompt: 'Tokri ran 20 tests this year and shipped every one with p < 0.05. If none of the changes really did anything, about how many would still have come out “significant”?', hint: '1 in 20.', options: [{ id: 'a', label: 'None' }, { id: 'b', label: 'About one' }, { id: 'c', label: 'About ten' }, { id: 'd', label: 'All twenty' }], correct: 'b', explanation: 'At 5% significance, about 1 in 20 tests of nothing comes out “significant”, in one direction or the other. That’s why a surprising win is worth rerunning before a big bet.' },
  ],
};
