// Episodes for chapter bz.4 · Design ROI & business cases. Drafts by Claude, for review.
// Raahi sells intercity bus tickets: 60 lakh seat selections and 18 lakh bookings a year, ₹60 kept on each. Aparna
// Iyengar leads design and has to show Sameer Batra, the CFO, what her team's work is worth, then win ₹90 lakh to
// rebuild the trip screens. Nikhil Varghese runs Kolam, a four-person studio in Kochi, and has to price work so the
// studio survives. This chapter is for the senior designer or lead who has to put design in the company's money
// language without overclaiming. Data and rules: ../designroi.
import type { Episode } from '../episode';
import {
  KOLAM_ENQUIRIES, RAAHI_CASE, RAAHI_IMPACTS, caseFix, engageCall, impactBand,
  type KolamEnquiry, type RaahiCaseLine, type RaahiImpact,
} from '../designroi';

const claim = (k: RaahiImpact) => RAAHI_IMPACTS[k].text;
const band = (k: RaahiImpact) => impactBand(RAAHI_IMPACTS[k]);
const line = (k: RaahiCaseLine) => RAAHI_CASE[k].text;
const fix = (k: RaahiCaseLine) => caseFix(RAAHI_CASE[k]);
const enquiry = (k: KolamEnquiry) => KOLAM_ENQUIRIES[k].text;
const take = (k: KolamEnquiry) => engageCall(KOLAM_ENQUIRIES[k]);

export const bz4_1: Episode = {
  lessonId: 'bz.4-1',
  hook: 'The launch deck said the new checkout was worth ₹16 crore. The CFO stopped reading. Watch Aparna turn it into a number he believes.',
  scene: {
    id: 'impact-chain', duration: 36,
    beats: [
      { at: 0, title: '“Worth ₹16 crore”', body: '1.8 lakh extra bookings × the ₹900 ticket. Sameer stops reading.' },
      { at: 6, title: 'What Raahi keeps', body: 'Commission less payment fees and cashback: ₹60 a booking, not ₹900.' },
      { at: 11, title: 'Against a control', body: 'The A/B test: 30% to 33%. Three points, not “10%”, and not the Diwali rush.' },
      { at: 16, title: 'The chain', body: '60 lakh × 3 points × ₹60 = ₹1.08 crore a year.' },
      { at: 21, title: 'Money out counts too', body: 'Cancellation calls from 8 to 2 per 100, at ₹95 each: ₹1.03 crore.' },
      { at: 26, title: 'Time is half-money', body: '15,000 agent hours is ₹60 lakh of time; about ₹30 lakh becomes fewer hires.' },
      { at: 31, title: 'Signals, kept apart', body: 'Ratings and “it’s easier” stay on the dashboard, not in the total.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why was “₹16 crore” wrong?', options: [{ id: 'a', label: 'The A/B test was too short' }, { id: 'b', label: 'It valued each booking at the rider’s ticket, not the ₹60 Raahi keeps' }, { id: 'c', label: 'Conversion didn’t really rise' }],
      correct: 'b', explanation: 'Count what the company keeps or saves, never gross revenue.' },
    { id: 'c2', prompt: 'What turns a claimed impact into one the CFO will count?', options: [{ id: 'a', label: 'A bigger number' }, { id: 'b', label: 'A control showing design caused it, and a value for each unit' }, { id: 'c', label: 'A quote from a happy rider' }],
      correct: 'b', explanation: 'Volume × change against a control × what each is worth.' },
  ],
  game: {
    id: 'value-size', title: 'Size the impact',
    instructions: 'Each card is something Aparna’s team claims its work did. Work out roughly what it is worth to Raahi a year: volume × change × what each is worth × the share that becomes money. Is it under ₹10 lakh, ₹10 lakh to ₹1 crore, over ₹1 crore, or can’t it be counted yet? Right calls add it to the impact ledger.',
    lanes: [
      { id: 'small', label: 'Under ₹10 lakh', hint: 'Real, but small' },
      { id: 'mid', label: '₹10 lakh–₹1 crore', hint: 'Worth a line in the review' },
      { id: 'big', label: '₹1 crore+', hint: 'Worth a slide' },
      { id: 'unproven', label: 'Can’t count it', hint: 'No control, or not money' },
    ],
    cards: [
      { id: 'g1', label: claim('checkout'), lane: band('checkout'), visual: 'checkout', note: '60 lakh × 3 points is 1.8 lakh bookings; at ₹60 each, ₹1.08 crore. At the ₹900 ticket it would look like ₹16 crore, and nobody would believe the rest of the deck.' },
      { id: 'g2', label: claim('diwali'), lane: band('diwali'), visual: 'diwali', note: 'October is the Diwali rush every year. Without a comparison, the 40% is the festival, not the home screen.' },
      { id: 'g3', label: claim('refund'), lane: band('refund'), visual: 'refund', note: '18 lakh × 2 per 100 is 36,000 contacts; at ₹95 each, ₹34.2 lakh a year. Saving money counts as much as making it.' },
      { id: 'g4', label: claim('filters'), lane: band('filters'), visual: 'filters', note: '0.2 points of 60 lakh is 12,000 bookings, ₹7.2 lakh. Real and small: don’t let it share credit with checkout for the same points.' },
      { id: 'g5', label: claim('rebook'), lane: band('rebook'), visual: 'rebook', note: '8 lakh × 0.25 is 2 lakh more trips; at ₹60, ₹1.2 crore a year. Retention work is often the biggest number, and the holdout makes it believable.' },
      { id: 'g6', label: claim('console'), lane: band('console'), visual: 'console', note: '1.5 minutes × 6 lakh is 15,000 hours, ₹60 lakh of time. Only about half becomes fewer hires, so count ₹30 lakh and show the rest as capacity.' },
      { id: 'g7', label: claim('rating'), lane: band('rating'), visual: 'rating', note: 'A rating is a signal with no rupee attached. Keep it on the dashboard, and look for the behaviour it predicts.' },
      { id: 'g8', label: claim('cancel'), lane: band('cancel'), visual: 'cancel', note: '18 lakh × 6 per 100 is 1.08 lakh calls; at ₹95, ₹1.03 crore. The late cities in the rollout are the control.' },
      { id: 'g9', label: claim('invoice'), lane: band('invoice'), visual: 'invoice', note: '9,000 × ₹95 is ₹8.6 lakh. Small, and it also made business travellers happier, which may matter more.' },
      { id: 'g10', label: claim('boarding'), lane: band('boarding'), visual: 'boarding', note: '0.3% of 18 lakh is 5,400 missed buses avoided; Raahi refunds each in full, so ₹48.6 lakh. Here the ticket price is the right value, because it is what Raahi pays.' },
      { id: 'g11', label: claim('survey'), lane: band('survey'), visual: 'survey', note: 'What people say is easier isn’t what they do. The A/B test on the same checkout is the number to count.' },
      { id: 'g12', label: claim('system'), lane: band('system'), visual: 'system', note: '1,380 hours × ₹1,200 is ₹16.6 lakh of time; half realised is ₹8.3 lakh. The design system’s bigger value is speed, so measure time to ship too.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 15.6,
    prompt: 'Aparna has the A/B result: 30% to 33% on 60 lakh seat selections, ₹60 kept per booking. What does she tell Sameer?',
    options: [{ id: 'a', label: '“Conversion up 10%, worth ₹16 crore”' }, { id: 'b', label: '“3 points against a control: 1.8 lakh more bookings, ₹1.08 crore a year at what we keep”' }, { id: 'c', label: '“Riders love it: 73% say it’s easier”' }],
    correct: 'b', explanation: 'Absolute change, a control, and the value Raahi keeps.',
  },
  takeaways: [
    { title: 'Volume × change × value', body: 'A year’s volume, the change against a control, at what the company keeps or saves.' },
    { title: 'Contribution, not revenue', body: 'Raahi keeps ₹60 of a ₹900 ticket. Value at revenue and the CFO stops reading.' },
    { title: 'Absolute, and controlled', body: '30% to 33% is 3 points. Without a control, a festival looks like a redesign.' },
    { title: 'Signals stay signals', body: 'Ratings and survey scores belong on the dashboard, not in the rupee total.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'Conversion 30% → 33% is…', options: [{ id: 'a', label: '+3 points' }, { id: 'b', label: '+33 points' }, { id: 'c', label: '+0.3 points' }], correct: 'a', explanation: 'Also a 10% relative lift; the money moves on the 3 points.' },
      { id: 'q2', prompt: 'Value an extra booking at…', options: [{ id: 'a', label: 'The ticket price' }, { id: 'b', label: 'What Raahi keeps after costs' }, { id: 'c', label: 'The average order of all apps' }], correct: 'b', explanation: '₹60, not ₹900.' },
      { id: 'q3', prompt: 'Bookings up 40% in Diwali month, no control:', options: [{ id: 'a', label: 'Count it' }, { id: 'b', label: 'Can’t count it yet' }, { id: 'c', label: 'Count half' }], correct: 'b', explanation: 'The festival would have done much of it anyway.' },
      { id: 'q4', prompt: '15,000 agent hours freed, at ₹400 an hour:', options: [{ id: 'a', label: '₹60 lakh, all of it' }, { id: 'b', label: 'The share that becomes fewer hires' }, { id: 'c', label: 'Nothing' }], correct: 'b', explanation: 'Time is money only when it changes spending.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Raahi can’t A/B test a new boarding-point flow, because operators share one ticket format. How can Aparna still get a control?', hint: 'Who could get it later?', options: [{ id: 'a', label: 'Compare this month with last month' }, { id: 'b', label: 'Roll it out route by route and compare early routes with late ones over the same weeks' }, { id: 'c', label: 'Ask riders whether it helped' }, { id: 'd', label: 'Skip measurement' }], correct: 'b', explanation: 'A staggered rollout gives you a comparison running in the same season.' },
    { id: 'l2', prompt: 'The checkout test ran four weeks. Sameer asks whether ₹1.08 crore a year is safe to put in the plan.', hint: 'What happens to new things over time?', options: [{ id: 'a', label: 'Yes, multiply four weeks by 13' }, { id: 'b', label: 'Keep a small holdout for a few months, check the lift hasn’t faded, and plan on a range below the test’s figure until then' }, { id: 'c', label: 'Double it for growth' }, { id: 'd', label: 'Never annualise' }], correct: 'b', explanation: 'Novelty fades; a long holdout shows what lasts.' },
    { id: 'l3', prompt: 'Checkout and the new AC filter both claim the same 3 points. What should Aparna do?', hint: 'Can two projects own one point?', options: [{ id: 'a', label: 'Let both count it' }, { id: 'b', label: 'Attribute each point once: test them separately or together with a factorial split, and report the combined lift' }, { id: 'c', label: 'Give it to whoever launched first' }, { id: 'd', label: 'Split it 50:50' }], correct: 'b', explanation: 'Double counting is how impact reports lose a CFO’s trust.' },
    { id: 'l4', prompt: 'A new security screen stops a rare fraud, about 20 cases a year, but each costs ₹3 lakh in refunds and a regulator’s attention. How should it be sized?', hint: 'Value can be a risk avoided.', options: [{ id: 'a', label: 'It’s rare, so it isn’t worth counting' }, { id: 'b', label: 'As risk avoided: cases × cost each, ₹60 lakh a year, plus the regulatory risk named in words' }, { id: 'c', label: 'Count every rider as protected' }, { id: 'd', label: 'Only count it after a fraud happens' }], correct: 'b', explanation: 'Less risk is the third kind of value, next to more in and less out.' },
    { id: 'l5', prompt: 'Sameer asks what design returned overall this year. What should Aparna send?', hint: 'What earns the next budget?', options: [{ id: 'a', label: 'The sum of every claim, including ratings and surveys' }, { id: 'b', label: 'Counted impacts with their controls and ranges, signals listed separately, and what design cost, so he can see the return' }, { id: 'c', label: 'Only the biggest win' }, { id: 'd', label: 'A list of screens shipped' }], correct: 'b', explanation: 'An honest ledger, with costs, is what makes the next number believable.' },
  ],
};

export const bz4_2: Episode = {
  lessonId: 'bz.4-2',
  hook: 'Eleven pages of research, screens and the word “delightful”. The CFO read it for two minutes and asked three questions. Watch Aparna rewrite the case so it gets funded.',
  scene: {
    id: 'case-shape', duration: 36,
    beats: [
      { at: 0, title: 'Eleven pages', body: 'Research, screens, “delightful”, and “NPS should rise by 10 points”.' },
      { at: 6, title: 'Three questions', body: 'What do we get? What does it really cost? How sure are you?' },
      { at: 11, title: 'The ask first', body: '₹90 lakh, six people, six months, for the trip screens. Then the options, including doing nothing.' },
      { at: 16, title: 'Benefits by driver', body: 'Calls, missed-bus refunds and repeat trips, each with a basis and a range.' },
      { at: 21, title: 'Every cost', body: '₹90 lakh to build, ₹12 lakh a year to run, and the seat-map work that waits.' },
      { at: 26, title: 'Three cases', body: 'Base: 28% in year one, payback in 9.1 months. Low: a loss, 18.8 months. High: 71%.' },
      { at: 31, title: 'How we’ll know', body: 'Fund two cities first. Release the rest if calls fall below 4 per 100 in eight weeks.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What goes first in a business case?', options: [{ id: 'a', label: 'The research method' }, { id: 'b', label: 'The ask: how much, for what' }, { id: 'c', label: 'The screens' }],
      correct: 'b', explanation: 'It’s a decision document; lead with the decision.' },
    { id: 'c2', prompt: 'Why show the low case, where year one loses money?', options: [{ id: 'a', label: 'To look modest' }, { id: 'b', label: 'Because showing how it could disappoint is what makes the base case believable' }, { id: 'c', label: 'Finance requires exactly three cases' }],
      correct: 'b', explanation: 'A CFO trusts a case that has already looked for its own weak spots.' },
  ],
  game: {
    id: 'case-edit', title: 'Edit the business case',
    instructions: 'Each card is a line from Aparna’s draft. Is it ready for Sameer, or does it need fixing? Activity, taste and scores need to become money; one confident number or all the credit needs a range and an honest basis; costs need building, running and what waits. Right calls put the rewritten line into the case.',
    lanes: [
      { id: 'keep', label: 'Ready', hint: 'Money, range, full cost' },
      { id: 'money', label: 'Make it money', hint: 'Activity, taste or a score' },
      { id: 'range', label: 'Overclaims', hint: 'One number, or all the credit' },
      { id: 'cost', label: 'Missing costs', hint: 'Build, run, what waits' },
    ],
    cards: [
      { id: 'g1', label: line('sessions'), lane: fix('sessions'), visual: 'sessions', note: 'Sessions and screens are what the team does. Sameer funds what changes for riders and Raahi: calls per 100 bookings.' },
      { id: 'g2', label: line('ask'), lane: fix('ask'), visual: 'ask', note: 'How much, how many people, how long, and for what, in one sentence at the top.' },
      { id: 'g3', label: line('total'), lane: fix('total'), visual: 'total', note: 'A single total sounds certain and invites one question: what if it’s wrong? Give the low and high case with it.' },
      { id: 'g4', label: line('build'), lane: fix('build'), visual: 'build', note: 'Maps and GPS feeds cost ₹12 lakh every year the screens exist. Year one is ₹1.02 crore, not ₹90 lakh.' },
      { id: 'g5', label: line('delight'), lane: fix('delight'), visual: 'delight', note: 'Nobody can fund “delightful”. Say what riders will manage that they can’t today, and how you’ll measure it.' },
      { id: 'g6', label: line('calls'), lane: fix('calls'), visual: 'calls', note: 'A basis, a pilot, a unit cost and a range. This is the shape every benefit line should have.' },
      { id: 'g7', label: line('credit'), lane: fix('credit'), visual: 'credit', note: 'The test shows 3 points; the monsoon sale did the rest. Claiming all 22% makes Sameer doubt the next number too.' },
      { id: 'g8', label: line('eng'), lane: fix('eng'), visual: 'eng', note: 'Engineers are most of the cost and their time has another use. Name who is on the team and what waits because of it.' },
      { id: 'g9', label: line('nps'), lane: fix('nps'), visual: 'nps', note: 'A score isn’t money. Find the behaviour behind it: riders who track their bus rebook more, and that has a rupee value.' },
      { id: 'g10', label: line('refunds'), lane: fix('refunds'), visual: 'refunds', note: 'One city in the monsoon is a best case. Use it as the high end of a range, not the plan.' },
      { id: 'g11', label: line('payback'), lane: fix('payback'), visual: 'payback', note: 'Counting design time only flatters it. With building and running, payback is 9.1 months in the base case and 18.8 in the low.' },
      { id: 'g12', label: line('costs'), lane: fix('costs'), visual: 'costs', note: 'Build, run and what waits. Opportunity cost is the line most cases forget.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.6,
    prompt: 'Sameer has asked his three questions. How should Aparna’s rewrite open?',
    options: [{ id: 'a', label: 'With the research and how it was done' }, { id: 'b', label: 'With the ask: ₹90 lakh, six people, six months, for the trip screens' }, { id: 'c', label: 'With the new screens' }],
    correct: 'b', explanation: 'The decision first; the evidence follows to support it.',
  },
  takeaways: [
    { title: 'A decision document', body: 'The ask first, then the problem in money and the options, including doing nothing.' },
    { title: 'Drivers with ranges', body: 'Each benefit has a basis, a unit value and a low, base and high case.' },
    { title: 'Every cost', body: 'Building, running and what waits. Year one costs more than the build.' },
    { title: 'Stage the risk', body: 'Fund the first step, name the early number and the result that would stop you.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: '“We will ship 28 new screens” is…', options: [{ id: 'a', label: 'A benefit' }, { id: 'b', label: 'Activity' }, { id: 'c', label: 'A cost' }], correct: 'b', explanation: 'Say what changes because of the screens.' },
      { id: 'q2', prompt: 'Year-one ROI is…', options: [{ id: 'a', label: '(benefit − cost) ÷ cost' }, { id: 'b', label: 'benefit ÷ build cost' }, { id: 'c', label: 'cost ÷ benefit' }], correct: 'a', explanation: 'Here (₹1.3 crore − ₹1.02 crore) ÷ ₹1.02 crore, about 28%.' },
      { id: 'q3', prompt: '“Do nothing” in the options list…', options: [{ id: 'a', label: 'Is free' }, { id: 'b', label: 'Has a cost: calls grow with bookings' }, { id: 'c', label: 'Should be left out' }], correct: 'b', explanation: 'Every option, including waiting, has a price.' },
      { id: 'q4', prompt: 'The seat-map work that waits a year is…', options: [{ id: 'a', label: 'An opportunity cost' }, { id: 'b', label: 'Irrelevant' }, { id: 'c', label: 'A benefit' }], correct: 'a', explanation: 'What you give up to do this is part of its price.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Sameer asks why the base case plans on 3 calls per 100 when the Pune pilot got 2.', hint: 'Was Pune typical?', options: [{ id: 'a', label: 'To make the numbers look modest' }, { id: 'b', label: 'Pune has the best GPS coverage and newest buses; across the network the base assumes half the pilot’s gain, and the pilot is the high case' }, { id: 'c', label: 'Finance always halves numbers' }, { id: 'd', label: 'No reason' }], correct: 'b', explanation: 'Say why the plan differs from the best evidence, in the case itself.' },
    { id: 'l2', prompt: 'Payments has a rival case: ₹60 lakh, base return 45%, payback 7 months. Aparna’s base is 28% and 9.1 months. What should she do?', hint: 'Is this a competition she must win?', options: [{ id: 'a', label: 'Raise her base case to beat it' }, { id: 'b', label: 'Compare honestly: if budget allows one, theirs may go first; argue for hers on what theirs doesn’t cover, like the refund risk, or a staged start' }, { id: 'c', label: 'Criticise their numbers' }, { id: 'd', label: 'Withdraw' }], correct: 'b', explanation: 'Credibility across cases is worth more than winning one.' },
    { id: 'l3', prompt: 'Year two has no build cost. How should the case show it?', hint: 'What’s left to pay after launch?', options: [{ id: 'a', label: 'It shouldn’t; only year one matters' }, { id: 'b', label: 'Show year two separately: benefit less ₹12 lakh running, and whether the benefit is expected to hold, grow with bookings or fade' }, { id: 'c', label: 'Add years two to five as pure profit' }, { id: 'd', label: 'Double year one' }], correct: 'b', explanation: 'Multi-year cases need their own assumptions, not a copy of year one.' },
    { id: 'l4', prompt: 'The exec team approves only ₹30 lakh, for two cities. What should Aparna write next?', hint: 'What will the rest depend on?', options: [{ id: 'a', label: 'A complaint' }, { id: 'b', label: 'A one-page plan: which cities, the number read at eight weeks, the threshold to release the rest, and who decides' }, { id: 'c', label: 'The same case again' }, { id: 'd', label: 'Nothing until it’s done' }], correct: 'b', explanation: 'A stage gate only works if everyone agreed the gate before the result.' },
    { id: 'l5', prompt: 'Eight weeks in: calls fell to 4.5 per 100, not below 4. What should Aparna do?', hint: 'What did the case say would happen?', options: [{ id: 'a', label: 'Move the threshold to 4.5' }, { id: 'b', label: 'Report it plainly, find why (perhaps bus GPS gaps on two routes), and propose either a fix and a second read or stopping, as agreed' }, { id: 'c', label: 'Ask for the full budget anyway' }, { id: 'd', label: 'Stop reporting' }], correct: 'b', explanation: 'Keeping to the agreed rule is what gets the next case funded.' },
  ],
};

export const bz4_3: Episode = {
  lessonId: 'bz.4-3',
  hook: 'Kolam was always busy and the account was always thin. Watch Nikhil find the day rate his studio actually needs, and the work he should have turned down.',
  scene: {
    id: 'studio-rate', duration: 36,
    beats: [
      { at: 0, title: 'Busy and broke', body: 'Four people, ₹72 lakh a year in costs, and prices copied from a Bengaluru studio.' },
      { at: 6, title: 'Billable days', body: '880 working days, but sales, admin and gaps take 40%. 528 can be billed.' },
      { at: 11, title: 'The floor', body: '₹72 lakh ÷ 528 is ₹13,600 a day. Below it, every project loses money.' },
      { at: 16, title: 'The target', body: 'For a 20% margin on fees: ₹72 lakh ÷ 0.8 ÷ 528, about ₹17,000 a day.' },
      { at: 21, title: 'Scope creep', body: 'Ten days of “small changes” turn ₹17,500 a day into ₹12,353.' },
      { at: 26, title: 'Match the contract', body: 'Fixed for clear scope, time for the unknown, retainers for a stream.' },
      { at: 31, title: 'Say no on purpose', body: 'Spec work, equity for salaries, prices below the floor. Generous only when chosen.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why can’t Kolam bill all 880 working days?', options: [{ id: 'a', label: 'Holidays' }, { id: 'b', label: 'Sales, proposals, admin, learning and gaps between projects take about 40%' }, { id: 'c', label: 'Clients pay for fewer days' }],
      correct: 'b', explanation: 'Price on the days you can bill, not the days you work.' },
    { id: 'c2', prompt: 'Who carries the risk in a fixed-fee project?', options: [{ id: 'a', label: 'The studio' }, { id: 'b', label: 'The client' }, { id: 'c', label: 'Nobody' }],
      correct: 'a', explanation: 'So it needs clear scope and a written change process.' },
  ],
  game: {
    id: 'engage-sort', title: 'Take the work, the right way',
    instructions: 'Each card is an enquiry Kolam has received, with the fee and the days it will take. Kolam’s floor is the rate below which it loses money. Price it as a fixed fee, a retainer, time and materials, or decline it. Check the day rate first, then ask whether the work is a stream and whether the scope is clear. Right calls fill Kolam’s quarter.',
    lanes: [
      { id: 'fixed', label: 'Fixed fee', hint: 'Clear scope, one-off' },
      { id: 'retainer', label: 'Retainer', hint: 'A steady stream' },
      { id: 'time', label: 'Time & materials', hint: 'Nobody knows the scope yet' },
      { id: 'decline', label: 'Decline', hint: 'Unpaid, or under the floor' },
    ],
    cards: [
      { id: 'g1', label: enquiry('audit'), lane: take('audit'), visual: 'audit', note: '₹2.4 lakh ÷ 12 days is ₹20,000 a day, above target. Twenty screens and a report is a scope both sides can see.' },
      { id: 'g2', label: enquiry('pitch'), lane: take('pitch'), visual: 'pitch', note: 'Five days is about ₹85,000 of Kolam’s time, given away as ideas. Offer a paid workshop or show past work instead.' },
      { id: 'g3', label: enquiry('lender'), lane: take('lender'), visual: 'lender', note: '₹20,000 a day for a steady stream. Cap the days, say what happens to unused ones, and review the scope each quarter.' },
      { id: 'g4', label: enquiry('tailors'), lane: take('tailors'), visual: 'tailors', note: 'Nobody knows what the app is yet, so any fixed price is a guess. Sell a two-week paid discovery, then quote.' },
      { id: 'g5', label: enquiry('cafe'), lane: take('cafe'), visual: 'cafe', note: '₹1.5 lakh ÷ 18 days is about ₹8,300 a day, far below the floor. Offer what the budget buys at Kolam’s rate, or walk away.' },
      { id: 'g6', label: enquiry('seats'), lane: take('seats'), visual: 'seats', note: '₹17,500 a day from a signed spec. Write the change process in: ten unplanned days would take it under the floor.' },
      { id: 'g7', label: enquiry('hospital'), lane: take('hospital'), visual: 'hospital', note: '₹18,000 a day, four days every month: predictable work that smooths out the gaps between projects.' },
      { id: 'g8', label: enquiry('claims'), lane: take('claims'), visual: 'claims', note: 'The client can’t say what’s broken, so neither can Kolam. Bill by the day, with a weekly cap and a check-in.' },
      { id: 'g9', label: enquiry('equity'), lane: take('equity'), visual: 'equity', note: 'Equity doesn’t pay four salaries this month. If Nikhil likes the idea, a reduced cash fee plus equity is the most to offer.' },
      { id: 'g10', label: enquiry('clinic'), lane: take('clinic'), visual: 'clinic', note: '₹1.1 lakh ÷ 6 days is about ₹18,300 a day, and the copy is supplied. Small, clear, fixed.' },
      { id: 'g11', label: enquiry('ngo'), lane: take('ngo'), visual: 'ngo', note: '₹14,000 a day is above the floor and below target. A choice Kolam can make on purpose, because it knows the numbers.' },
      { id: 'g12', label: enquiry('rescue'), lane: take('rescue'), visual: 'rescue', note: 'The ₹20,000 a day is fine; the 25 days are a guess about someone else’s code. Audit first, then bill by the day.' },
    ],
  },
  gap: {
    id: 'gap', from: 16, at: 25.6,
    prompt: 'Raahi’s fixed-fee seat flow has grown by ten days of unwritten “small changes”. What should Nikhil do next time?',
    options: [{ id: 'a', label: 'Absorb it; Raahi is a good client' }, { id: 'b', label: 'Put a change process in the contract: each change estimated in days and approved in writing before work starts' }, { id: 'c', label: 'Never take fixed-fee work again' }],
    correct: 'b', explanation: 'Fixed fees work when the scope is fixed, in writing.',
  },
  takeaways: [
    { title: 'Know your floor', body: 'Costs ÷ the days you can actually bill. Below it, every project loses money.' },
    { title: 'Price for a margin', body: 'Divide by (1 − margin) to find the target rate that leaves something over.' },
    { title: 'Match the contract to the risk', body: 'Fixed for clear scope, time for the unknown, retainers for a stream.' },
    { title: 'Decline on purpose', body: 'Spec work, equity for salaries and below-floor prices are losses agreed in advance.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: '4 people × 220 days × 60% billable:', options: [{ id: 'a', label: '880 days' }, { id: 'b', label: '528 days' }, { id: 'c', label: '220 days' }], correct: 'b', explanation: 'The days you can actually charge for.' },
      { id: 'q2', prompt: 'Scope nobody can define yet:', options: [{ id: 'a', label: 'Fixed fee' }, { id: 'b', label: 'Time and materials, or paid discovery' }, { id: 'c', label: 'Retainer' }], correct: 'b', explanation: 'Price the unknown by the day until it’s known.' },
      { id: 'q3', prompt: 'An unpaid pitch with designs:', options: [{ id: 'a', label: 'Spec work' }, { id: 'b', label: 'Marketing' }, { id: 'c', label: 'A retainer' }], correct: 'a', explanation: 'Free ideas, real cost.' },
      { id: 'q4', prompt: '₹4.2 lakh for 34 days instead of 24:', options: [{ id: 'a', label: '₹17,500 a day' }, { id: 'b', label: 'About ₹12,350 a day' }, { id: 'c', label: '₹42,000 a day' }], correct: 'b', explanation: 'Scope creep pulls the rate under Kolam’s ₹13,600 floor.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Raahi is 55% of Kolam’s fees this year. Why does that worry Nikhil?', hint: 'What if one client leaves?', options: [{ id: 'a', label: 'It doesn’t; Raahi pays on time' }, { id: 'b', label: 'One decision at Raahi could take more than half the income; aim for no client above about a third' }, { id: 'c', label: 'Clients dislike sharing studios' }, { id: 'd', label: 'GST is higher on big clients' }], correct: 'b', explanation: 'Concentration is a risk even when the client is happy.' },
    { id: 'l2', prompt: 'A new client wants 90-day payment terms on a ₹6 lakh project. Kolam’s salaries are monthly.', hint: 'Who funds the gap?', options: [{ id: 'a', label: 'Accept; it’s normal' }, { id: 'b', label: 'Ask for a third to half upfront and the rest at milestones, or price in the cost of waiting' }, { id: 'c', label: 'Start work and invoice at the end' }, { id: 'd', label: 'Refuse all late payers' }], correct: 'b', explanation: 'Cash flow kills more studios than low margins.' },
    { id: 'l3', prompt: 'Utilisation drops from 60% to 50% while Nikhil spends time on sales. What happens to the floor?', hint: 'Same costs, fewer days.', options: [{ id: 'a', label: 'It falls' }, { id: 'b', label: 'It rises, to about ₹16,400 a day, because the same costs spread over 440 days' }, { id: 'c', label: 'It stays the same' }, { id: 'd', label: 'It doubles' }], correct: 'b', explanation: '₹72 lakh ÷ 440 days. Utilisation is part of the price.' },
    { id: 'l4', prompt: 'A client asks for Nikhil’s day rate before saying anything about the project. What should he do?', hint: 'What is the client really buying?', options: [{ id: 'a', label: 'Quote ₹17,000 and hope' }, { id: 'b', label: 'Ask about the problem and what solving it is worth first, then propose a price for the outcome, with the day rate as his check' }, { id: 'c', label: 'Quote below the floor to win' }, { id: 'd', label: 'Refuse to discuss price' }], correct: 'b', explanation: 'Leading with a day rate invites comparison on cost, not value.' },
    { id: 'l5', prompt: 'Kolam is booked solid for three months and a good enquiry arrives. What does that say?', hint: 'What does full utilisation signal?', options: [{ id: 'a', label: 'Work harder' }, { id: 'b', label: 'Demand is above capacity: raise rates for new work, and decide whether to hire with the floor recalculated' }, { id: 'c', label: 'Cut rates to keep clients' }, { id: 'd', label: 'Take it and overrun' }], correct: 'b', explanation: 'A full calendar is a pricing signal.' },
  ],
};
