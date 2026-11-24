// Episodes for chapter bz.3 · Design for sales & customers. Drafts by Claude, for review.
// Parcha is clinic software for Indian clinics, sold per doctor per month. Aditi Rao, its product designer, builds the
// Sunrise Clinics demo with Karan Malhotra (account executive), redesigns the pricing page, and sets up a loop with
// Lakshmi Pillai (head of customer success). The moments, plans, buyers and signals, and the rules they're judged
// by, are in ../sales and tested there.
import type { Episode } from '../episode';
import { PARCHA_BUYERS, PARCHA_SIGNALS, SUNRISE_MOMENTS, planFor, type ParchaBuyer, type ParchaSignal, type SunriseMoment } from '../sales';

const moment = (k: SunriseMoment) => SUNRISE_MOMENTS[k].text;
const buyer = (k: ParchaBuyer) => `${PARCHA_BUYERS[k].name}: ${PARCHA_BUYERS[k].place}`;
const plan = (k: ParchaBuyer) => planFor(PARCHA_BUYERS[k]);
const signal = (k: ParchaSignal) => `${PARCHA_SIGNALS[k].from}: “${PARCHA_SIGNALS[k].text}”`;

export const bz3_1: Episode = {
  lessonId: 'bz.3-1',
  hook: 'Sunrise Clinics said no-shows were killing them. Karan’s demo spent ten minutes on printer margins.',
  scene: {
    id: 'demo-tour', duration: 36,
    beats: [
      { at: 0, title: 'Everything Parcha does', body: 'Karan’s demo for Sunrise runs 32 minutes: the founding story, all 14 settings tabs, inventory, and a booking for “Test Patient 1”.' },
      { at: 6, title: 'What Sunrise asked about', body: 'On the discovery call they named three problems: 18% no-shows, a 25-minute billing queue, prescriptions typed twice. The tour shows none of them.' },
      { at: 11, title: 'Say it back first', body: 'Aditi rebuilds it. Two minutes to recap Sunrise’s three problems, in their numbers, so the room nods before anything is shown.' },
      { at: 16, title: 'Their clinic, their data', body: 'Asha Jadhav books Dr. Kulkarni at Sunrise Koregaon Park. The reminders, the UPI bill and the prescription all happen to her.' },
      { at: 21, title: 'Biggest problem first', body: 'No-shows, then the queue, then the prescriptions: the order Sunrise ranked them. Each one ends on what changes for them.' },
      { at: 26, title: 'Cut what they didn’t ask', body: 'Settings, inventory and the founding story go. The AI scribe goes too: never demo what isn’t built, or CS inherits the promise.' },
      { at: 31, title: 'A small next step', body: '17 minutes, then a four-week pilot at two clinics, measured against today. The medical director asks when it can start.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did Karan’s first demo miss?', options: [{ id: 'a', label: 'It was a tour of the product, and never showed Sunrise’s three problems solved' }, { id: 'b', label: 'The product was too slow' }, { id: 'c', label: 'It had no slides' }],
      correct: 'a', explanation: 'A demo is judged on the buyer’s problems, not on how much of the product it covers.' },
    { id: 'c2', prompt: 'Why use Asha and Dr. Kulkarni instead of “Test Patient 1”?', options: [{ id: 'a', label: 'It’s required by law' }, { id: 'b', label: 'Buyers can picture it in their own clinic, so they judge the outcome, not the screen' }, { id: 'c', label: 'It’s faster to type' }],
      correct: 'b', explanation: 'Demo data that looks like their world does half the persuading.' },
  ],
  game: {
    id: 'demo-build', title: 'Build the Sunrise demo',
    instructions: 'Each card is a moment you could show Sunrise. Put it in the demo or leave it out. The agenda orders itself tell–show–tell, and the checks run as you build. You have 20 minutes.',
    lanes: [
      { id: 'show', label: 'Show it', hint: 'Answers something Sunrise said' },
      { id: 'skip', label: 'Leave it out', hint: 'Nobody asked, or it isn’t real' },
    ],
    cards: [
      { id: 'g1', label: moment('settings'), lane: 'skip', visual: 'settings', note: 'Ten minutes nobody asked for. Settings come up in onboarding, not in the sale.' },
      { id: 'g2', label: moment('reminders'), lane: 'show', visual: 'reminders', note: 'Their biggest problem, solved on their clinic, with a patient they can picture.' },
      { id: 'g3', label: moment('recap'), lane: 'show', visual: 'recap', note: 'Saying their problems back first shows you listened, and sets what the demo will prove.' },
      { id: 'g4', label: moment('dummy'), lane: 'skip', visual: 'dummy', note: 'The same flow on placeholder data proves less. The Asha version already covers no-shows.' },
      { id: 'g5', label: moment('billing'), lane: 'show', visual: 'billing', note: 'The 25-minute queue, gone: the bill is waiting when the doctor finishes.' },
      { id: 'g6', label: moment('scribe'), lane: 'skip', visual: 'scribe', note: 'Never demo what isn’t built. If Sunrise buys for it, CS inherits a promise nobody can keep.' },
      { id: 'g7', label: moment('rx'), lane: 'show', visual: 'rx', note: 'Typed twice becomes written once, and the pharmacy gets it straight away.' },
      { id: 'g8', label: moment('history'), lane: 'skip', visual: 'history', note: 'About Parcha, not about Sunrise. One proof line from a similar chain does more.' },
      { id: 'g9', label: moment('pilot'), lane: 'show', visual: 'pilot', note: 'A small, dated, measurable step is easier to say yes to than “any questions?”' },
      { id: 'g10', label: moment('inventory'), lane: 'skip', visual: 'inventory', note: 'Real and useful, but not one of their three problems. Mention it if they ask.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.6,
    prompt: 'Aditi is rebuilding the demo. What should the first two minutes be?',
    options: [{ id: 'a', label: 'Parcha’s founding story and customer map' }, { id: 'b', label: 'Sunrise’s three problems said back, in their numbers' }, { id: 'c', label: 'The settings, so they see how flexible it is' }],
    correct: 'b', explanation: 'Tell them what you heard; then show it solved; then tell them what changes.',
  },
  takeaways: [
    { title: 'Start from discovery', body: 'Recap their problems, in their numbers, before showing anything.' },
    { title: 'Their world on screen', body: 'Their clinic, their doctors, a patient they can picture. No “Test Patient 1”.' },
    { title: 'Cut the tour', body: 'Only what answers them, and never what isn’t built.' },
    { title: 'End on a small yes', body: 'A pilot with a date and a measure; and slide headlines that state the point.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A demo should be built from…', options: [{ id: 'a', label: 'What the buyer said hurts' }, { id: 'b', label: 'The product menu' }], correct: 'a', explanation: 'Discovery first, demo second.' },
      { id: 'q2', prompt: 'Showing a feature that isn’t built yet…', options: [{ id: 'a', label: 'Builds excitement safely' }, { id: 'b', label: 'Creates a promise someone else has to keep' }, { id: 'c', label: 'Is fine if it’s labelled beta' }], correct: 'b', explanation: 'It becomes a ticket, or a churned customer.' },
      { id: 'q3', prompt: 'The best demo close is…', options: [{ id: 'a', label: '“Any questions?”' }, { id: 'b', label: 'The pricing table' }, { id: 'c', label: 'A small, dated next step like a pilot' }], correct: 'c', explanation: 'Easy to say yes to, and measured.' },
      { id: 'q4', prompt: 'A forwarded deck works when each headline…', options: [{ id: 'a', label: 'Names the topic' }, { id: 'b', label: 'States the point' }, { id: 'c', label: 'Is one word' }, { id: 'd', label: 'Is a question' }], correct: 'b', explanation: 'The reader gets the argument without a presenter.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What is “tell–show–tell” in a demo?', hint: 'Three moves.', options: [{ id: 'a', label: 'Say the problem, show it solved, say what changes for them' }, { id: 'b', label: 'Show every screen three times' }, { id: 'c', label: 'Talk, then slides, then video' }, { id: 'd', label: 'A sales qualification method' }], correct: 'a', explanation: 'The buyer knows what to look for, sees it, and hears why it matters.' },
    { id: 'l2', prompt: 'How should a designer help make the demo environment?', hint: 'What does the buyer see?', options: [{ id: 'a', label: 'Leave it to sales' }, { id: 'b', label: 'Seed realistic data for each kind of buyer: clinic names, doctors, a busy day, a few no-shows' }, { id: 'c', label: 'Use production data from real patients' }, { id: 'd', label: 'Lorem ipsum everywhere' }], correct: 'b', explanation: 'Realistic, never real: patient data stays private.' },
    { id: 'l3', prompt: 'Sunrise’s IT head joins the call. What changes?', hint: 'Different question, same demo spine.', options: [{ id: 'a', label: 'Start the demo again from the top' }, { id: 'b', label: 'Keep the demo; offer a short separate session on security and SSO, with a one-page leave-behind' }, { id: 'c', label: 'Show the settings tour after all' }, { id: 'd', label: 'Ignore them' }], correct: 'b', explanation: 'Answer each person’s question in the format that suits it, without derailing the main story.' },
    { id: 'l4', prompt: 'Why make a demo click-path a designed, rehearsed flow?', hint: 'What goes wrong live?', options: [{ id: 'a', label: 'It looks scripted, which is bad' }, { id: 'b', label: 'A dead end, a loading spinner or an empty state mid-demo costs trust; a rehearsed path avoids them' }, { id: 'c', label: 'Sales can’t use the product' }, { id: 'd', label: 'There’s no reason' }], correct: 'b', explanation: 'Design the golden path, and the recovery if something breaks.' },
    { id: 'l5', prompt: 'Which proof slide helps Sunrise most?', hint: 'Someone like them.', options: [{ id: 'a', label: 'A wall of 40 logos' }, { id: 'b', label: 'A similar clinic chain’s before-and-after, in the same metric Sunrise cares about' }, { id: 'c', label: 'An award badge' }, { id: 'd', label: 'Funding raised' }], correct: 'b', explanation: 'Specific, comparable evidence beats volume.' },
  ],
};

export const bz3_2: Episode = {
  lessonId: 'bz.3-2',
  hook: 'Parcha’s pricing page had six plans and four of them said “Contact us”. Most solo doctors left without picking one.',
  scene: {
    id: 'pricing-page', duration: 36,
    beats: [
      { at: 0, title: 'Six plans, two prices', body: 'Basic, Standard, Plus, Pro, Premium, Enterprise. Only two show a price, none says who it’s for, and no unit says what you pay per.' },
      { at: 6, title: 'Dr. Farida tries to choose', body: 'A dentist in Nashik, one chair, one clinic. She compares 40 feature rows, can’t tell which plan is hers, and leaves.' },
      { at: 11, title: 'Three plans, named for who', body: 'Solo: one doctor, one clinic. Clinic: a front desk and 2–25 doctors. Chain: 4 or more clinics, or SSO and API.' },
      { at: 16, title: 'Price per something you count', body: 'Solo ₹999 a month. Clinic ₹799 per doctor a month. One “Talk to us”, for chains only.' },
      { at: 21, title: 'Mark the usual choice', body: '“Most clinics pick this” on Clinic. The fences between plans are doctors and clinics, things every buyer knows.' },
      { at: 26, title: 'Honest about the year', body: 'Pay yearly: two months free. On Solo that’s ₹9,990 a year, a saving of ₹1,998, shown in rupees, with GST stated up front.' },
      { at: 31, title: 'Farida finds hers in seconds', body: 'One doctor, one clinic: Solo, ₹999 a month. She starts a trial.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why couldn’t Dr. Farida pick a plan?', options: [{ id: 'a', label: 'The page was too colourful' }, { id: 'b', label: 'Plans were named by size, not by who they’re for, and most hid their price' }, { id: 'c', label: 'She didn’t want software' }],
      correct: 'b', explanation: 'A buyer should find their plan from facts they know about themselves.' },
    { id: 'c2', prompt: 'Why charge Clinic per doctor?', options: [{ id: 'a', label: 'It’s easiest to bill' }, { id: 'b', label: 'Doctors are something every buyer can count, and value grows with them' }, { id: 'c', label: 'Competitors do' }],
      correct: 'b', explanation: 'A good value metric is easy to count and rises with what the customer gets.' },
  ],
  game: {
    id: 'plan-pick', title: 'Which plan is theirs?',
    instructions: 'Each card is a clinic reading Parcha’s new pricing page. Pick the plan that covers them for the least money. The page lights up the line that decides it, and shows what they’ll pay.',
    lanes: [
      { id: 'solo', label: 'Solo', hint: '₹999 a month · one doctor, one clinic' },
      { id: 'clinic', label: 'Clinic', hint: '₹799 per doctor a month · 2–25 doctors, up to 3 clinics' },
      { id: 'chain', label: 'Chain', hint: 'Quoted · 4+ clinics, or SSO and API' },
    ],
    cards: [
      { id: 'g1', label: buyer('farida'), lane: plan('farida'), visual: 'farida', note: 'One doctor, one clinic: the description alone answers it.' },
      { id: 'g2', label: buyer('jaipur'), lane: plan('jaipur'), visual: 'jaipur', note: 'Two doctors crosses the Solo fence. On Clinic they pay ₹1,598 a month.' },
      { id: 'g3', label: buyer('sunrise'), lane: plan('sunrise'), visual: 'sunrise', note: '12 clinics is past Clinic’s 3. A chain this size wants a quote and an onboarding manager anyway.' },
      { id: 'g4', label: buyer('ritu'), lane: plan('ritu'), visual: 'ritu', note: 'One doctor, but two branches: Solo is one clinic. Fences have to be things buyers can check about themselves.' },
      { id: 'g5', label: buyer('kabir'), lane: plan('kabir'), visual: 'kabir', note: 'Starting out, one practice: Solo. A clear cheapest plan keeps new clinics from leaving.' },
      { id: 'g6', label: buyer('arogya'), lane: plan('arogya'), visual: 'arogya', note: 'Only two centres, but connecting their lab system needs the API, and that’s on Chain.' },
      { id: 'g7', label: buyer('littleSteps'), lane: plan('littleSteps'), visual: 'littleSteps', note: 'Three doctors and a front desk: exactly who the marked plan is for.' },
      { id: 'g8', label: buyer('drishti'), lane: plan('drishti'), visual: 'drishti', note: 'Nine doctors on one site is well inside Clinic: ₹7,191 a month, growing only as they hire.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.6,
    prompt: 'Farida left the old page without choosing. What should Aditi change first?',
    options: [{ id: 'a', label: 'Add a seventh plan for dentists' }, { id: 'b', label: 'Fewer plans, each saying who it’s for, with prices shown' }, { id: 'c', label: 'A longer feature table' }],
    correct: 'b', explanation: 'Buyers should recognise themselves in a plan before they read a single feature.',
  },
  takeaways: [
    { title: 'Three or four plans', body: 'Each named and described by who it’s for.' },
    { title: 'Show the price, and per what', body: 'One “Talk to us” for the biggest customers at most.' },
    { title: 'Fences buyers can count', body: 'Doctors and clinics, not obscure feature differences.' },
    { title: 'Mark the usual pick, and be honest', body: 'Savings in rupees, taxes up front, no checkout surprises.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'Six plans, four saying “Contact us”, mostly…', options: [{ id: 'a', label: 'Drives buyers away' }, { id: 'b', label: 'Builds trust' }], correct: 'a', explanation: 'Hidden prices read as expensive and slow.' },
      { id: 'q2', prompt: 'A good value metric is…', options: [{ id: 'a', label: 'Something the buyer can count that grows with value' }, { id: 'b', label: 'Whatever is easiest to invoice' }, { id: 'c', label: 'Hidden until checkout' }], correct: 'a', explanation: 'Per doctor, per seat, per order.' },
      { id: 'q3', prompt: 'A “Most clinics pick this” badge helps because…', options: [{ id: 'a', label: 'It’s colourful' }, { id: 'b', label: 'It hides the other plans' }, { id: 'c', label: 'It gives unsure buyers a sensible default' }], correct: 'c', explanation: 'It shortens the decision.' },
      { id: 'q4', prompt: 'Yearly billing is shown honestly as…', options: [{ id: 'a', label: '“Save up to 90%*”' }, { id: 'b', label: '“2 months free: ₹9,990 a year, you save ₹1,998”' }, { id: 'c', label: 'Pre-selected without saying so' }, { id: 'd', label: 'Only at checkout' }], correct: 'b', explanation: 'Real rupees, no asterisks.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What is a plan “fence”?', hint: 'What separates two plans.', options: [{ id: 'a', label: 'The limit that puts a buyer on one plan rather than another, like number of doctors' }, { id: 'b', label: 'A paywall popup' }, { id: 'c', label: 'A legal term' }, { id: 'd', label: 'The page border' }], correct: 'a', explanation: 'Good fences match how buyers differ, so each finds their plan.' },
    { id: 'l2', prompt: 'Why might Chain be “Talk to us” while the others show prices?', hint: 'Who buys it, and how.', options: [{ id: 'a', label: 'To hide a high price from everyone' }, { id: 'b', label: 'Chains buy through a committee, need contracts and integration work, and expect to negotiate' }, { id: 'c', label: 'The designer forgot' }, { id: 'd', label: 'Legal requires it' }], correct: 'b', explanation: 'Self-serve for small clinics, sales-led for chains: the page serves both.' },
    { id: 'l3', prompt: 'Putting Clinic in the middle and marking it is an example of…', hint: 'How people compare.', options: [{ id: 'a', label: 'A dark pattern' }, { id: 'b', label: 'Anchoring and a default: the plans either side frame it, and the badge reduces doubt' }, { id: 'c', label: 'Random layout' }, { id: 'd', label: 'Accessibility' }], correct: 'b', explanation: 'Fine when the marked plan really is right for most; manipulative when it isn’t.' },
    { id: 'l4', prompt: 'How would you test a pricing page redesign?', hint: 'Outcome, not opinion.', options: [{ id: 'a', label: 'Ask the CEO' }, { id: 'b', label: 'Give five clinic owners a description of their clinic and time how fast they find their plan and price; then watch plan mix and trial starts' }, { id: 'c', label: 'Count how many plans competitors have' }, { id: 'd', label: 'Make the prices bigger' }], correct: 'b', explanation: 'Speed and accuracy of choosing, then real behaviour.' },
    { id: 'l5', prompt: 'Which is a dark pattern on a pricing page?', hint: 'Honesty.', options: [{ id: 'a', label: 'Showing GST up front' }, { id: 'b', label: 'A yearly plan pre-selected with the monthly price shown large, so it looks cheaper than it bills' }, { id: 'c', label: 'An FAQ on cancelling' }, { id: 'd', label: 'A comparison table' }], correct: 'b', explanation: 'It tricks people into a bigger charge, and CS gets the angry calls.' },
  ],
};

export const bz3_3: Episode = {
  lessonId: 'bz.3-3',
  hook: 'Lakshmi’s team answers 212 tickets a month. Design had never read one.',
  scene: {
    id: 'cs-loop', duration: 36,
    beats: [
      { at: 0, title: '212 tickets a month', body: 'Lakshmi Pillai runs customer success. Every month her team answers the same questions, and design hears about none of it.' },
      { at: 6, title: 'Sit in, read the queue', body: 'Aditi joins five CS calls and reads a month of tickets. She and Lakshmi agree one set of tags so themes can be counted.' },
      { at: 11, title: 'Loud isn’t big', body: 'GST invoice questions are the most tickets, 71 from 22 small clinics. Rescheduling is 64, but from 41 clinics paying ₹11.8 lakh a year.' },
      { at: 16, title: 'Four routes', body: 'Wrong design is a fix. Can’t find it is a guide. “We were told…” is a sales promise. Doesn’t exist yet goes on the roadmap.' },
      { at: 21, title: 'The fix, reviewed by CS', body: 'Drag an appointment to reschedule, one tap. Lakshmi’s team tries it on the scripts they use with clinics before it ships.' },
      { at: 26, title: 'The promise goes back to sales', body: 'Marathi reminders were promised in a demo. Karan takes it off the deck until it’s built; Lakshmi calls Sunrise.' },
      { at: 31, title: 'Close the loop', body: 'CS tells all 41 clinics it’s live. Next month reschedule tickets fall from 64 to 9.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why fix rescheduling before the invoice question?', options: [{ id: 'a', label: 'It had more tickets' }, { id: 'b', label: 'Fewer tickets, but nearly twice as many clinics and over four times the revenue' }, { id: 'c', label: 'It was easier' }],
      correct: 'b', explanation: 'Weigh themes by customers and revenue, not by how often they’re heard.' },
    { id: 'c2', prompt: 'Where did the Marathi reminders complaint go?', options: [{ id: 'a', label: 'Back to sales, who promised it' }, { id: 'b', label: 'A design fix' }, { id: 'c', label: 'Nowhere' }],
      correct: 'a', explanation: 'It’s a broken promise. The deck and demo change so it doesn’t happen again.' },
  ],
  game: {
    id: 'signal-route', title: 'Route the queue',
    instructions: 'Each card is a theme from Lakshmi’s ticket queue. Send it to the route that can act on it: a design fix, a guide, back to sales, or the roadmap. The board totals the clinics and revenue behind each route.',
    lanes: [
      { id: 'fix', label: 'Design fix', hint: 'It works the wrong way' },
      { id: 'guide', label: 'Guide', hint: 'It works; they can’t find it' },
      { id: 'promise', label: 'Sales promise', hint: '“We were told it would…”' },
      { id: 'roadmap', label: 'Roadmap', hint: 'A real gap, logged with its revenue' },
    ],
    cards: [
      { id: 'g1', label: signal('invoice'), lane: 'guide', visual: 'invoice', note: 'The invoices are under Reports → Billing. A help article and a “Download GST invoices” link on the billing screen fix it.' },
      { id: 'g2', label: signal('reschedule'), lane: 'fix', visual: 'reschedule', note: 'Cancel-and-rebook is the wrong design for a job done 30 times a day. And it’s the biggest theme by revenue.' },
      { id: 'g3', label: signal('marathi'), lane: 'promise', visual: 'marathi', note: 'One account, but a ₹3.6 lakh chain that bought on a promise. Sales takes it off the deck; CS resets the expectation.' },
      { id: 'g4', label: signal('lab'), lane: 'roadmap', visual: 'lab', note: 'A real gap. Logged with seven clinics and ₹3.3 lakh behind it, so product can weigh it against everything else.' },
      { id: 'g5', label: signal('blank'), lane: 'fix', visual: 'blank', note: 'A broken page is a bug in the design, not a training problem. Test the link on the phones patients actually own.' },
      { id: 'g6', label: signal('scribe'), lane: 'promise', visual: 'scribe', note: 'The AI scribe was shown in a demo before it existed. This is what that costs.' },
      { id: 'g7', label: signal('timings'), lane: 'guide', visual: 'timings', note: 'It works, but it’s three menus deep. An in-app hint where the receptionist looks, plus the article CS sends.' },
      { id: 'g8', label: signal('emi'), lane: 'roadmap', visual: 'emi', note: 'Not something Parcha does yet. Logged, with the dental clinics asking.' },
    ],
  },
  gap: {
    id: 'gap', from: 11, at: 15.6,
    prompt: 'Invoices are the loudest theme, rescheduling the biggest. What does Aditi do?',
    options: [{ id: 'a', label: 'Fix invoices first because they’re loudest' }, { id: 'b', label: 'Design the reschedule fix, and have CS ship a guide for invoices alongside' }, { id: 'c', label: 'Run a survey before deciding' }],
    correct: 'b', explanation: 'The biggest theme gets the design work; the quick findability fix runs in parallel.',
  },
  takeaways: [
    { title: 'Get into the stream', body: 'Sit in on CS calls, read the queue, share one set of tags.' },
    { title: 'Weigh, don’t count', body: 'Clinics and revenue behind a theme, not ticket volume.' },
    { title: 'Four routes', body: 'Fix, guide, sales promise, roadmap. Not everything is a redesign.' },
    { title: 'Close the loop', body: 'Tell everyone who asked, and check the tickets fall.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '“Where do I find X?” for a feature that works is usually…', options: [{ id: 'a', label: 'A guide or findability fix' }, { id: 'b', label: 'A roadmap item' }], correct: 'a', explanation: 'It exists; people can’t find it.' },
      { id: 'q2', prompt: '“We were told it would do Y” goes to…', options: [{ id: 'a', label: 'The bin' }, { id: 'b', label: 'Sales, to fix the deck and demo' }, { id: 'c', label: 'Design, to build Y now' }], correct: 'b', explanation: 'A promise problem starts in the sale.' },
      { id: 'q3', prompt: 'Themes are best ranked by…', options: [{ id: 'a', label: 'Ticket count' }, { id: 'b', label: 'Who shouts loudest' }, { id: 'c', label: 'Customers and revenue affected' }], correct: 'c', explanation: 'Loud isn’t the same as big.' },
      { id: 'q4', prompt: 'Closing the loop means…', options: [{ id: 'a', label: 'Closing the ticket' }, { id: 'b', label: 'Telling everyone who asked that it shipped, and checking tickets fall' }, { id: 'c', label: 'A release note' }, { id: 'd', label: 'Archiving the tag' }], correct: 'b', explanation: 'It turns complainers into advocates, and proves the fix.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why agree one set of tags with CS?', hint: 'Counting.', options: [{ id: 'a', label: 'So themes can be counted the same way every month and compared' }, { id: 'b', label: 'For tidiness' }, { id: 'c', label: 'Tags are required by the helpdesk' }, { id: 'd', label: 'So design can close tickets' }], correct: 'a', explanation: 'Without shared tags, every month’s analysis starts from scratch.' },
    { id: 'l2', prompt: 'What does CS add when reviewing a design before it ships?', hint: 'They talk to customers daily.', options: [{ id: 'a', label: 'Visual polish' }, { id: 'b', label: 'Whether it fits how they explain the product, what customers will ask, and what to update in help and training' }, { id: 'c', label: 'Nothing' }, { id: 'd', label: 'Final approval on colours' }], correct: 'b', explanation: 'They’re the first to hear if it’s confusing.' },
    { id: 'l3', prompt: 'A churn interview says “too complicated”. What next?', hint: 'Vague signal.', options: [{ id: 'a', label: 'Simplify everything' }, { id: 'b', label: 'Ask CS for that clinic’s tickets and usage to find which task was complicated' }, { id: 'c', label: 'Ignore it' }, { id: 'd', label: 'Offer a discount' }], correct: 'b', explanation: 'Turn a vague reason into a specific task you can fix.' },
    { id: 'l4', prompt: 'Which metric shows a guide fix worked?', hint: 'Same signal it came from.', options: [{ id: 'a', label: 'Page views of the blog' }, { id: 'b', label: 'Tickets on that theme per active clinic, before and after' }, { id: 'c', label: 'Total revenue' }, { id: 'd', label: 'NPS of all customers' }], correct: 'b', explanation: 'Normalise by clinics so growth doesn’t hide the effect.' },
    { id: 'l5', prompt: 'One huge account asks for a feature nobody else wants. What do you do?', hint: 'Log, weigh, decide.', options: [{ id: 'a', label: 'Build it immediately' }, { id: 'b', label: 'Log it with its revenue and renewal date, and decide alongside everything else, openly' }, { id: 'c', label: 'Refuse to discuss it' }, { id: 'd', label: 'Promise it to keep them happy' }], correct: 'b', explanation: 'Revenue matters, but so does building a product for many clinics, not one.' },
  ],
};
