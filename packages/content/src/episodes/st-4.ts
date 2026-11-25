// Episodes for chapter st.4 · Design strategy. Drafts by Claude, for review.
// Munim is a Pune company that makes software for small businesses: Munim Books (accounting, GST invoices and returns),
// Munim Pay (payment links and UPI collections) and Munim Stock (inventory). Aarti Kulkarni is head of design, Vikram
// Joshi the CEO, Farhan Merchant the CFO and Neha Iyer leads product for Books. Ganpat Sawant runs a hardware shop in
// Nashik. st.2 wrote a product vision and roadmap and st.3 chose the metrics; this chapter is for the design leader
// who has to say where design competes, how its budget is bet, and what is built once for every product. Data and
// rules: ../designstrategy.
import type { Episode } from '../episode';
import {
  MUNIM_BETS, MUNIM_CAPABILITIES, MUNIM_CLAIMS, advantageCall, betCall, platformCall,
  type MunimBet, type MunimCapability, type MunimClaim,
} from '../designstrategy';

const claim = (k: MunimClaim) => MUNIM_CLAIMS[k].text;
const call = (k: MunimClaim) => advantageCall(MUNIM_CLAIMS[k]);
const bet = (k: MunimBet) => MUNIM_BETS[k].text;
const betLane = (k: MunimBet) => betCall(MUNIM_BETS[k]);
const cap = (k: MunimCapability) => MUNIM_CAPABILITIES[k].text;
const capLane = (k: MunimCapability) => platformCall(MUNIM_CAPABILITIES[k]);

export const st4_1: Episode = {
  lessonId: 'st.4-1',
  hook: 'Munim’s new invoices were the best-looking in the market. Six weeks later, a rival’s looked the same. Watch Aarti find the advantage nobody can copy by next year.',
  scene: {
    id: 'moat-map', duration: 36,
    beats: [
      { at: 0, title: 'Copied in six weeks', body: 'Munim ships cleaner invoices with a QR code to pay. Six weeks later Hisaably ships the same layout.' },
      { at: 6, title: '“Beautiful, premium design”', body: 'Aarti’s first draft names it as the advantage. The invoices just showed why it can’t be.' },
      { at: 11, title: 'Valued?', body: 'Switching interviews, churn reasons, win and loss notes. Awards and animations: not mentioned once.' },
      { at: 16, title: 'Hard to copy?', body: 'Every claim on a map: how much customers value it, and how many months a funded rival needs.' },
      { at: 21, title: 'Behind the screen', body: 'CA research and return data, 4,000 CAs in the accountant view, offline sync. Years, not weeks.' },
      { at: 26, title: 'The kernel', body: 'A diagnosis, a guiding policy, coherent actions. Not a goal, not a list of values.' },
      { at: 31, title: 'It decides things', body: 'The enterprise look and the Gen Z brand go. CA research every month comes in.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why couldn’t the new invoices be Munim’s advantage?', options: [{ id: 'a', label: 'Customers didn’t like them' }, { id: 'b', label: 'Anything a rival can see, it can copy, and Hisaably did in six weeks' }, { id: 'c', label: 'They broke GST rules' }],
      correct: 'b', explanation: 'An advantage has to last longer than a rival’s next release.' },
    { id: 'c2', prompt: 'What are the three parts of Rumelt’s kernel?', options: [{ id: 'a', label: 'Vision, mission, values' }, { id: 'b', label: 'Diagnosis, guiding policy, coherent actions' }, { id: 'c', label: 'Goal, target, deadline' }],
      correct: 'b', explanation: 'A strategy says what the challenge is and how you’ll meet it.' },
  ],
  game: {
    id: 'moat-crit', title: 'Crit the advantages',
    instructions: 'Each card is a claim from Aarti’s draft, with the evidence behind it. Does it hold, or is it copyable, unvalued, or valued by customers Munim doesn’t serve? Name the first problem. Right calls plot it on the moat map.',
    lanes: [
      { id: 'holds', label: 'Holds', hint: 'Valued, fits, a year+ to copy' },
      { id: 'copyable', label: 'Copyable', hint: 'A rival matches it within a year' },
      { id: 'unvalued', label: 'Unvalued', hint: 'Nobody chooses Munim for it' },
      { id: 'offstrategy', label: 'Wrong customer', hint: 'Valued, but not by Munim’s' },
    ],
    cards: [
      { id: 'g1', label: claim('invoiceLook'), lane: call('invoiceLook'), visual: 'invoiceLook', note: 'Customers liked it, and Hisaably matched it in six weeks. Keep making invoices better, but don’t call it a moat.' },
      { id: 'g2', label: claim('gstClean'), lane: call('gstClean'), visual: 'gstClean', note: 'Fewer rejected returns is why CAs recommend Munim. The research and the data from 2 lakh returns take a rival years.' },
      { id: 'g3', label: claim('animations'), lane: call('animations'), visual: 'animations', note: 'Not one of 120 switching interviews mentioned them. Nice to have, but not a reason anyone chooses Munim.' },
      { id: 'g4', label: claim('enterprise'), lane: call('enterprise'), visual: 'enterprise', note: 'Valued by finance teams at big companies, which Munim doesn’t serve. Entering enterprise is a leadership decision, not a design one.' },
      { id: 'g5', label: claim('caView'), lane: call('caView'), visual: 'caView', note: 'A network: every CA brings clients, and clients stay with their CA. 38% of new customers arrive this way.' },
      { id: 'g6', label: claim('templates'), lane: call('templates'), visual: 'templates', note: 'Most invoices use three of them, and any rival can add 40 in a month.' },
      { id: 'g7', label: claim('awards'), lane: call('awards'), visual: 'awards', note: 'Good for hiring designers. No customer or CA has ever asked about them.' },
      { id: 'g8', label: claim('offline'), lane: call('offline'), visual: 'offline', note: 'The top reason in switching interviews, and years of sync and conflict design to rebuild. It holds.' },
      { id: 'g9', label: claim('genz'), lane: call('genz'), visual: 'genz', note: 'Popular on Instagram with founders who bill through Shopify. They aren’t Munim’s customers.' },
      { id: 'g10', label: claim('languages'), lane: call('languages'), visual: 'languages', note: 'Valued in Surat and Nashik, and worth keeping. But a funded rival can hire the same writers in under a year.' },
      { id: 'g11', label: claim('illustrations'), lane: call('illustrations'), visual: 'illustrations', note: 'Tested against plain text, with no change in activation. Customers don’t choose for it.' },
      { id: 'g12', label: claim('usTax'), lane: call('usTax'), visual: 'usTax', note: 'Three exporters asked, and there’s no plan to sell in the US for three years. Not where Munim plays.' },
    ],
  },
  gap: {
    id: 'gap', from: 0, at: 10.6,
    prompt: 'Hisaably copied the invoices in six weeks. What should Aarti’s strategy rest on instead?',
    options: [{ id: 'a', label: 'Even better-looking screens, shipped faster' }, { id: 'b', label: 'What customers choose Munim for and rivals can’t copy within a year: CA research and data, the CA network, offline billing' }, { id: 'c', label: 'Design awards' }],
    correct: 'b', explanation: 'Compete where the evidence says customers care and a rival needs years.',
  },
  takeaways: [
    { title: 'Seen is copied', body: 'Pixels, templates and animations can be matched within a quarter. They don’t make a strategy.' },
    { title: 'Three tests', body: 'Customers choose or stay for it, it fits the customers you serve, and a funded rival needs a year or more.' },
    { title: 'Behind the screen', body: 'Lasting advantage comes from research and data, networks and hard capability.' },
    { title: 'Write the kernel', body: 'Diagnosis, guiding policy, coherent actions. A goal or a list of values isn’t a strategy.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: '40 invoice templates:', options: [{ id: 'a', label: 'Holds' }, { id: 'b', label: 'Copyable' }, { id: 'c', label: 'Wrong customer' }], correct: 'b', explanation: 'A month’s work for a rival.' },
      { id: 'q2', prompt: 'Design awards no customer has asked about:', options: [{ id: 'a', label: 'Unvalued' }, { id: 'b', label: 'Holds' }, { id: 'c', label: 'Copyable' }], correct: 'a', explanation: 'Advantage starts with what customers value.' },
      { id: 'q3', prompt: '“Be the best-designed GST app” is…', options: [{ id: 'a', label: 'A diagnosis' }, { id: 'b', label: 'A goal' }, { id: 'c', label: 'A guiding policy' }], correct: 'b', explanation: 'It says where, not how.' },
      { id: 'q4', prompt: 'What makes the CA view hard to copy?', options: [{ id: 'a', label: 'Its colours' }, { id: 'b', label: 'The network of 4,000 CAs and their clients' }, { id: 'c', label: 'Its code' }], correct: 'b', explanation: 'Networks take years to build.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'If polish is copyable, should Munim stop investing in visual quality?', hint: 'Is copyable the same as worthless?', options: [{ id: 'a', label: 'Yes, it’s wasted money' }, { id: 'b', label: 'No: quality is table stakes customers expect, so keep it high, but don’t build the strategy on it or spend the strategic budget on it' }, { id: 'c', label: 'Only for marketing pages' }, { id: 'd', label: 'Yes, until rivals stop copying' }], correct: 'b', explanation: 'Parity where it’s expected, advantage where it lasts.' },
    { id: 'l2', prompt: 'Vikram quotes McKinsey: top design companies grow revenue 32 points faster. Is that the business case?', hint: 'What kind of evidence is it?', options: [{ id: 'a', label: 'Yes, it proves design pays' }, { id: 'b', label: 'It’s a correlation across many firms; use it to open the conversation, then show Munim’s own numbers: rejected returns, CA referrals, churn reasons' }, { id: 'c', label: 'No, consultancy reports are worthless' }, { id: 'd', label: 'Only if it’s about India' }], correct: 'b', explanation: 'Industry studies start the case; your own data makes it.' },
    { id: 'l3', prompt: 'Native-speaker translations are valued and fit, but a rival could match them in eight months. What should the strategy say about them?', hint: 'Copyable but valued.', options: [{ id: 'a', label: 'Drop them' }, { id: 'b', label: 'Keep them as something customers expect, and link them to what lasts: the research with shops and CAs in those languages that rivals don’t have' }, { id: 'c', label: 'Call them the main advantage' }, { id: 'd', label: 'Patent them' }], correct: 'b', explanation: 'A copyable feature can feed a lasting one.' },
    { id: 'l4', prompt: 'Which design strategy action is coherent with “design for the CA and the shop together”?', hint: 'Does it follow from the policy?', options: [{ id: 'a', label: 'A new mascot' }, { id: 'b', label: 'A monthly research panel of CAs and their clients, and a shared review screen both of them use' }, { id: 'c', label: 'A dark theme' }, { id: 'd', label: 'Winning another award' }], correct: 'b', explanation: 'Actions should follow from the policy and support each other.' },
    { id: 'l5', prompt: 'A year from now, how will Aarti know the strategy worked?', hint: 'What did the diagnosis say mattered?', options: [{ id: 'a', label: 'The app looks better' }, { id: 'b', label: 'The numbers the diagnosis pointed at moved: rejected returns, CA referrals, churn from shops on patchy networks; and the team turned down work that didn’t fit' }, { id: 'c', label: 'More Dribbble likes' }, { id: 'd', label: 'The design team grew' }], correct: 'b', explanation: 'A strategy is judged by the outcomes it aimed at and the choices it forced.' },
  ],
};

export const st4_2: Episode = {
  lessonId: 'st.4-2',
  hook: 'Farhan, the CFO, gave design ₹3 crore and asked what he’d get for it. Aarti had ten ideas and a lot of enthusiasm. Watch her turn them into bets.',
  scene: {
    id: 'bet-portfolio', duration: 36,
    beats: [
      { at: 0, title: '₹3 crore, ten ideas', body: 'From a GST review redesign to voice invoices to dark mode. Ranked by excitement, they can’t answer Farhan.' },
      { at: 6, title: 'Price every bet', body: 'What it costs, what it’s worth in a year if it works, and the chance that it does.' },
      { at: 11, title: 'Two chances, not one', body: 'A cautious and a hopeful estimate. Expected value = chance × payoff − cost, at both ends.' },
      { at: 16, title: 'Fund, kill, probe', body: 'Pays on the cautious chance: fund. Loses on the hopeful one: kill. Crosses zero: buy a small test first.' },
      { at: 21, title: 'The mix', body: 'Core, adjacent, new: close to 70/20/10, with ₹1.33 crore held back to scale what passes.' },
      { at: 26, title: 'Kill criteria first', body: 'Each probe gets a number to hit and a review date, agreed before it starts.' },
      { at: 31, title: 'Judge the decision', body: 'A well-sized bet that fails was still a good call. Voice passes its test, and gets the money.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'How is a bet’s expected value worked out?', options: [{ id: 'a', label: 'Payoff − cost' }, { id: 'b', label: 'Chance × payoff − cost' }, { id: 'c', label: 'Cost ÷ chance' }],
      correct: 'b', explanation: 'Weight the payoff by how likely it is, then subtract what it costs.' },
    { id: 'c2', prompt: 'A bet loses on the cautious chance but pays on the hopeful one. What does Aarti do?', options: [{ id: 'a', label: 'Fund it' }, { id: 'b', label: 'Probe it with a small test' }, { id: 'c', label: 'Kill it' }],
      correct: 'b', explanation: 'When the range crosses zero, buy information before the build.' },
  ],
  game: {
    id: 'bet-book', title: 'Place the bets',
    instructions: 'Each card is a design bet with its cost, its payoff if it works and a cautious and a hopeful chance (money in lakh rupees). Work out what it’s worth at both ends. Fund it, probe it or kill it. Right calls fill the budget.',
    lanes: [
      { id: 'fund', label: 'Fund', hint: 'Pays even on the cautious chance' },
      { id: 'probe', label: 'Probe', hint: 'Pays only if the hopeful one is right' },
      { id: 'kill', label: 'Kill', hint: 'Loses even if all goes well' },
    ],
    cards: [
      { id: 'g1', label: bet('gstReview'), lane: betLane('gstReview'), visual: 'gstReview', note: 'At 60% it’s worth ₹68 lakh; at 80%, ₹1.04 crore. It pays either way, and it’s the core of the strategy.' },
      { id: 'g2', label: bet('voice'), lane: betLane('voice'), visual: 'voice', note: 'From −₹40 lakh to +₹60 lakh. An ₹8 lakh Wizard of Oz test with 20 shops tells you which.' },
      { id: 'g3', label: bet('darkMode'), lane: betLane('darkMode'), visual: 'darkMode', note: 'Even at 90%, ₹9 lakh back on ₹25 lakh. People asked for it; it still doesn’t pay.' },
      { id: 'g4', label: bet('system'), lane: betLane('system'), visual: 'system', note: 'Shared components save engineering time in three products: at least ₹60 lakh, even on the cautious chance.' },
      { id: 'g5', label: bet('forecast'), lane: betLane('forecast'), visual: 'forecast', note: 'Huge if it works, −₹35 lakh if it doesn’t. Make forecasts by hand for 30 businesses first, for ₹10 lakh.' },
      { id: 'g6', label: bet('rebrand'), lane: betLane('rebrand'), visual: 'rebrand', note: '₹90 lakh for at most ₹48 lakh back, and new names would split the brand CAs already trust.' },
      { id: 'g7', label: bet('whatsapp'), lane: betLane('whatsapp'), visual: 'whatsapp', note: 'Cheap, and shops already send invoices on WhatsApp by hand. Worth ₹40 lakh at worst.' },
      { id: 'g8', label: bet('caInvite'), lane: betLane('caInvite'), visual: 'caInvite', note: 'Negative at 15%, ₹60 lakh at 60%. A fake-door button for four weeks costs ₹5 lakh and narrows it.' },
      { id: 'g9', label: bet('dash3d'), lane: betLane('dash3d'), visual: 'dash3d', note: 'At best ₹12 lakh back on ₹35 lakh. Exciting in a demo, a loss on paper.' },
      { id: 'g10', label: bet('scan'), lane: betLane('scan'), visual: 'scan', note: 'From −₹7 lakh to +₹20 lakh. Ten shops counting stock with a prototype will settle it for ₹4 lakh.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 15.6,
    prompt: 'Voice invoices could be worth −₹40 lakh or +₹60 lakh. Farhan asks whether to fund the ₹60 lakh build. What does Aarti say?',
    options: [{ id: 'a', label: 'Yes, the upside is big' }, { id: 'b', label: 'Not yet: an ₹8 lakh test with 20 shops first, with a pass mark agreed now' }, { id: 'c', label: 'No, kill it' }],
    correct: 'b', explanation: 'When the range crosses zero, a small test is worth more than a guess.',
  },
  takeaways: [
    { title: 'Price every bet', body: 'Cost, payoff if it works, and the chance it does. Expected value is chance × payoff − cost.' },
    { title: 'Let the range decide', body: 'Fund what pays on the cautious chance, kill what loses on the hopeful one, probe the rest.' },
    { title: 'Manage the portfolio', body: 'Balance core, adjacent and new, and hold money back to scale the probes that pass.' },
    { title: 'Judge decisions, not luck', body: 'Agree kill criteria up front, stop what misses, and don’t confuse a bad outcome with a bad call.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'Cost ₹20 lakh, payoff ₹120 lakh, chance 50–80%:', options: [{ id: 'a', label: 'Fund' }, { id: 'b', label: 'Probe' }, { id: 'c', label: 'Kill' }], correct: 'a', explanation: '₹40 lakh even at 50%.' },
      { id: 'q2', prompt: 'Cost ₹25 lakh, payoff ₹10 lakh, chance 50–90%:', options: [{ id: 'a', label: 'Fund' }, { id: 'b', label: 'Probe' }, { id: 'c', label: 'Kill' }], correct: 'c', explanation: 'Negative even at 90%.' },
      { id: 'q3', prompt: 'A probe misses its agreed kill criterion. Next:', options: [{ id: 'a', label: 'Another quarter' }, { id: 'b', label: 'Stop it and move the money' }, { id: 'c', label: 'Lower the bar' }], correct: 'b', explanation: 'That’s what the criterion was for.' },
      { id: 'q4', prompt: '“Resulting” means…', options: [{ id: 'a', label: 'Judging a decision only by its outcome' }, { id: 'b', label: 'Measuring results' }, { id: 'c', label: 'Shipping fast' }], correct: 'a', explanation: 'Good calls can fail; bad ones can get lucky.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Where do the payoff numbers come from, if nobody can know the future?', hint: 'What would make an estimate arguable?', options: [{ id: 'a', label: 'Make them up' }, { id: 'b', label: 'From the drivers you can check: how many shops it reaches, what it does to churn or upgrades, the margin per shop; written down so anyone can challenge them' }, { id: 'c', label: 'Only finance should estimate' }, { id: 'd', label: 'Skip numbers for design work' }], correct: 'b', explanation: 'Rough, visible assumptions beat confident silence.' },
    { id: 'l2', prompt: 'The design system saves engineering time but brings in no new revenue. Should it count as a bet?', hint: 'What is time worth?', options: [{ id: 'a', label: 'No, only revenue counts' }, { id: 'b', label: 'Yes: price the hours saved across three products, and the bugs and GST updates not made three times' }, { id: 'c', label: 'Only if customers see it' }, { id: 'd', label: 'It’s free' }], correct: 'b', explanation: 'Saved cost is payoff too.' },
    { id: 'l3', prompt: 'Why hold back ₹1.33 crore instead of funding more bets now?', hint: 'What happens when a probe passes?', options: [{ id: 'a', label: 'To return it to Farhan' }, { id: 'b', label: 'So the probes that pass can be built this year without a new budget fight; money sitting ready is what makes probing worth it' }, { id: 'c', label: 'In case of a rebrand' }, { id: 'd', label: 'There’s no reason' }], correct: 'b', explanation: 'A probe is only useful if a pass can be acted on.' },
    { id: 'l4', prompt: 'Half of Munim’s spend going to new ideas would be…', hint: 'Who pays for the core?', options: [{ id: 'a', label: 'Bold and good' }, { id: 'b', label: 'Risky: the core earns the money and keeps customers; most companies keep most spend there and fund new work with small tests' }, { id: 'c', label: 'Required by 70/20/10' }, { id: 'd', label: 'Irrelevant' }], correct: 'b', explanation: 'The mix is a guide to balance, not a rule to break or worship.' },
    { id: 'l5', prompt: 'The voice test passed, the build shipped, and a year later voice invoices made only a small gain. Was funding it a mistake?', hint: 'Judge the process, not just the result.', options: [{ id: 'a', label: 'Yes, it failed' }, { id: 'b', label: 'Not necessarily: check whether the estimate, the test and the pass mark were sound when the call was made, and what to learn from where the forecast was wrong' }, { id: 'c', label: 'Yes, never bet on new ideas' }, { id: 'd', label: 'No, all bets are good' }], correct: 'b', explanation: 'Review how the decision was made, then update your estimates.' },
  ],
};

export const st4_3: Episode = {
  lessonId: 'st.4-3',
  hook: 'Ganpat signed into two Munim apps with two passwords, and got two invoices for one sale. Three product teams had each built the same things. Watch Aarti decide what to build once.',
  scene: {
    id: 'platform-layers', duration: 36,
    beats: [
      { at: 0, title: 'Three of everything', body: 'Books, Pay and Stock each built their own sign-in, invoice and payment link. Ganpat has two passwords.' },
      { at: 6, title: 'The cost of copies', body: 'Three sets of bugs. When the GST rules change, three updates. A customer who thinks he uses three companies.' },
      { at: 11, title: 'The rule of three', body: 'Sign-in, the GST invoice and form controls: three products, and settled. Build them once.' },
      { at: 16, title: 'Not yet', body: 'Alert settings are still changing, and the payment link has two users. Let them prove themselves, then harvest.' },
      { at: 21, title: 'Keep it, or buy it', body: 'Barcode counts stay in Stock. OTP messages, maps and help chat come from vendors.' },
      { at: 26, title: 'A product for teams', body: 'The platform gets an owner, a roadmap and a support channel. Its customers are the product teams.' },
      { at: 31, title: 'Measure adoption', body: 'New screens built on the platform, and time to ship a common flow. Ganpat signs in once.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'When should a capability move into the shared platform?', options: [{ id: 'a', label: 'As soon as two teams might want it' }, { id: 'b', label: 'When several products need it and what it must do has settled' }, { id: 'c', label: 'Always; platforms are faster' }],
      correct: 'b', explanation: 'Sharing too early freezes a guess.' },
    { id: 'c2', prompt: 'Why buy OTP messages instead of building them?', options: [{ id: 'a', label: 'Vendors do it well, and it isn’t why anyone chooses Munim' }, { id: 'b', label: 'It’s cheaper to build' }, { id: 'c', label: 'Only Stock needs it' }],
      correct: 'a', explanation: 'Buy commodities; build where you win.' },
  ],
  game: {
    id: 'layer-pick', title: 'Build it once?',
    instructions: 'Each card is something Munim’s products need, with which products need it and whether it has settled. Put it in the shared platform, harvest it later, keep it in its product, or buy it. Right calls build the product map.',
    lanes: [
      { id: 'platform', label: 'Platform', hint: 'Three products, and settled' },
      { id: 'harvest', label: 'Harvest later', hint: 'Shared, but still proving itself' },
      { id: 'product', label: 'In the product', hint: 'Only one product needs it' },
      { id: 'buy', label: 'Buy', hint: 'A commodity, not where we win' },
    ],
    cards: [
      { id: 'g1', label: cap('signIn'), lane: capLane('signIn'), visual: 'signIn', note: 'All three need it, it’s well understood, and two passwords is what Ganpat hit first. Build it once.' },
      { id: 'g2', label: cap('otp'), lane: capLane('otp'), visual: 'otp', note: 'All three need it, but SMS gateways do it well and nobody chooses Munim for it. Buy it.' },
      { id: 'g3', label: cap('barcode'), lane: capLane('barcode'), visual: 'barcode', note: 'Only Stock counts stock, and the team is still learning how shops do it. Keep it there.' },
      { id: 'g4', label: cap('alerts'), lane: capLane('alerts'), visual: 'alerts', note: 'All three need it, but which alerts go by WhatsApp is still being tested. Sharing it now would freeze a guess.' },
      { id: 'g5', label: cap('gstInvoice'), lane: capLane('gstInvoice'), visual: 'gstInvoice', note: 'The rules are set by law, all three products issue invoices, and one change must reach them all on the same day.' },
      { id: 'g6', label: cap('maps'), lane: capLane('maps'), visual: 'maps', note: 'Map providers do this far better than Munim could, and it isn’t why shops choose Munim.' },
      { id: 'g7', label: cap('payLink'), lane: capLane('payLink'), visual: 'payLink', note: 'Two products, and it matters. Books reuses Pay’s link; it moves to the platform once both have settled on it.' },
      { id: 'g8', label: cap('forecast'), lane: capLane('forecast'), visual: 'forecast', note: 'An experiment in Books. Putting it in a platform would slow the learning it exists for.' },
      { id: 'g9', label: cap('fields'), lane: capLane('fields'), visual: 'fields', note: 'Every product has forms, and a date picker is a solved problem. One accessible version, in the design system.' },
      { id: 'g10', label: cap('helpChat'), lane: capLane('helpChat'), visual: 'helpChat', note: 'Support tools do this well. Buy one and connect it to Munim’s sign-in.' },
      { id: 'g11', label: cap('firstRun'), lane: capLane('firstRun'), visual: 'firstRun', note: 'Each product is still testing its first run. Harvest the steps that work, like GSTIN lookup, once they settle.' },
      { id: 'g12', label: cap('reorder'), lane: capLane('reorder'), visual: 'reorder', note: 'Settled, but only Stock needs it. Settled isn’t enough on its own to share.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.6,
    prompt: 'Three teams have built three of everything. Neha wants one platform team to rebuild it all, now. What does Aarti propose?',
    options: [{ id: 'a', label: 'Yes, put everything in the platform' }, { id: 'b', label: 'Share what three products need and has settled; harvest what’s still changing; keep or buy the rest' }, { id: 'c', label: 'Let each team keep its own' }],
    correct: 'b', explanation: 'A platform for what’s proven, products for what’s still being learned.',
  },
  takeaways: [
    { title: 'Copies cost', body: 'Duplicated capabilities mean duplicated bugs and updates, and a product that feels like three companies.' },
    { title: 'Share what has settled', body: 'The rule of three: build once when three products need it and what it must do is understood.' },
    { title: 'Harvest, keep, buy', body: 'Let what’s still changing prove itself in products; keep what one product needs; buy commodities.' },
    { title: 'A product for teams', body: 'Give the platform an owner and roadmap, and measure adoption and speed, not components shipped.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'Three products need it and it has settled:', options: [{ id: 'a', label: 'Platform' }, { id: 'b', label: 'Harvest later' }, { id: 'c', label: 'Product' }], correct: 'a', explanation: 'The rule of three.' },
      { id: 'q2', prompt: 'Three products need it, still changing:', options: [{ id: 'a', label: 'Platform' }, { id: 'b', label: 'Harvest later' }, { id: 'c', label: 'Buy' }], correct: 'b', explanation: 'Don’t freeze a guess.' },
      { id: 'q3', prompt: 'SMS one-time passwords:', options: [{ id: 'a', label: 'Platform' }, { id: 'b', label: 'Product' }, { id: 'c', label: 'Buy' }], correct: 'c', explanation: 'A commodity.' },
      { id: 'q4', prompt: 'A platform team’s customers are…', options: [{ id: 'a', label: 'The product teams' }, { id: 'b', label: 'Nobody' }, { id: 'c', label: 'The CEO' }], correct: 'a', explanation: 'Measure it by what it saves them.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'The GST invoice is part of why customers choose Munim. Doesn’t that mean it should stay in each product?', hint: 'Does differentiating mean unique to one product?', options: [{ id: 'a', label: 'Yes, differentiators stay in products' }, { id: 'b', label: 'No: what differentiates every product, and must be right everywhere, is exactly what to build once and build well' }, { id: 'c', label: 'Buy it instead' }, { id: 'd', label: 'It doesn’t matter' }], correct: 'b', explanation: 'Shared and differentiating aren’t opposites.' },
    { id: 'l2', prompt: 'Should the platform team be able to block a product release that doesn’t use the shared sign-in?', hint: 'What must be consistent, and what can vary?', options: [{ id: 'a', label: 'Yes, for anything' }, { id: 'b', label: 'Only for what must be consistent, like identity, money, tax and accessibility; elsewhere, make the platform the easiest path and ask teams why they go around it' }, { id: 'c', label: 'Never' }, { id: 'd', label: 'Only the CEO can decide' }], correct: 'b', explanation: 'Mandate the few things that must match; earn the rest.' },
    { id: 'l3', prompt: 'Stock built a better date picker than the platform’s. What should happen?', hint: 'Which way should improvements flow?', options: [{ id: 'a', label: 'Make Stock use the platform’s anyway' }, { id: 'b', label: 'Contribute it back: the platform reviews it, adopts it, and every product gets it' }, { id: 'c', label: 'Keep both' }, { id: 'd', label: 'Delete Stock’s' }], correct: 'b', explanation: 'A platform should have a clear way in for better work.' },
    { id: 'l4', prompt: 'Munim buys help chat from a vendor. Two years later, support is where customers say Munim wins. Now what?', hint: 'Do the calls ever change?', options: [{ id: 'a', label: 'Nothing; the decision is made' }, { id: 'b', label: 'Revisit it: once something becomes a reason customers choose you, consider building or deeply customising it' }, { id: 'c', label: 'Buy a second vendor' }, { id: 'd', label: 'Remove help chat' }], correct: 'b', explanation: 'Platform, product and buy calls are reviewed as the business changes.' },
    { id: 'l5', prompt: 'Farhan asks what the platform team is worth. What’s Aarti’s best answer?', hint: 'What does it save, and what does it protect?', options: [{ id: 'a', label: '84 components' }, { id: 'b', label: 'Product teams ship a common flow in days instead of weeks, a GST change reaches all three products in one release, and customers see one Munim' }, { id: 'c', label: 'Design consistency' }, { id: 'd', label: 'It’s an industry best practice' }], correct: 'b', explanation: 'Speed, risk and customer experience, in Munim’s terms.' },
  ],
};
