// Episodes for chapter br.4 · Brand strategy & storytelling. Drafts by Claude, for review.
// Sukoon is the meditation app from br.1 to br.3, a year after launch: 4 lakh paying subscribers, a Teams plan, and two
// apps it has just bought. Kabir Malhotra founded it; Ishita Rao, now head of brand, runs its first brand campaign,
// “Switch off”. Meera Sethi, a product manager in Gurugram, is the subscriber the film is about. This chapter is for
// the brand lead who has to make the story about the customer, decide what the brand family is called, and prove the
// brand grew. Data and rules: ../brandstrategy.
import type { Episode } from '../episode';
import {
  SUKOON_OFFERS, SUKOON_PIECES, SUKOON_READINGS, arcRole, archCall, sosCall,
  type SukoonOffer, type SukoonPiece, type SukoonReading,
} from '../brandstrategy';

const piece = (k: SukoonPiece) => SUKOON_PIECES[k].text;
const role = (k: SukoonPiece) => arcRole(SUKOON_PIECES[k]);
const offer = (k: SukoonOffer) => SUKOON_OFFERS[k].text;
const place = (k: SukoonOffer) => archCall(SUKOON_OFFERS[k]);
const reading = (k: SukoonReading) => SUKOON_READINGS[k].text;
const read = (k: SukoonReading) => sosCall(SUKOON_READINGS[k]);

export const br4_1: Episode = {
  lessonId: 'br.4-1',
  hook: 'The agency’s film opened on the logo and ended on the app-store badges. Every line was true, and nobody remembered it. Watch Ishita make Meera the hero instead.',
  scene: {
    id: 'campaign-arc', duration: 36,
    beats: [
      { at: 0, title: 'The brand as hero', body: 'Logo, “India’s #1”, a feature montage, the founder, the badges. True, and forgettable.' },
      { at: 6, title: 'Find the tension', body: 'The diary study: after 9 pm, still answering work. That’s the moment to start in.' },
      { at: 11, title: 'Tension', body: 'Meera answers Slack at dinner and hears none of her daughter’s story. The villain is the day that won’t end.' },
      { at: 16, title: 'The turn', body: 'In the lift she opens Sukoon: “Breathe out longer than you breathe in.” The brand arrives as the guide.' },
      { at: 21, title: 'Proof', body: 'The next evening she closes the laptop and hears the end of the story. Shown, not claimed.' },
      { at: 26, title: 'The shape', body: 'Tension rises to the turn, then falls lower than it started.' },
      { at: 31, title: 'One story, cut by channel', body: 'The film carries it all. Billboards hold the tension, six seconds the turn, social the proof.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What was wrong with the agency’s first film?', options: [{ id: 'a', label: 'It had facts that weren’t true' }, { id: 'b', label: 'The brand was the hero, so there was no story to remember' }, { id: 'c', label: 'It was too short' }],
      correct: 'b', explanation: 'People remember someone like them in trouble, not a list of claims.' },
    { id: 'c2', prompt: 'Where does Sukoon arrive in Ishita’s arc?', options: [{ id: 'a', label: 'In the first frame, as the star' }, { id: 'b', label: 'At the turn, as the guide with a plan' }, { id: 'c', label: 'Only on the end card' }],
      correct: 'b', explanation: 'The customer is the hero; the brand helps them change.' },
  ],
  game: {
    id: 'arc-map', title: 'Map the campaign',
    instructions: 'Each card is a piece of “Switch off”, with the channel it runs on. Is it the tension, the turn or the proof in Meera’s story, or should it be cut because it’s about the brand or claims instead of showing? Right calls place it on the campaign arc.',
    lanes: [
      { id: 'tension', label: 'Tension', hint: 'The problem, as people live it' },
      { id: 'turn', label: 'Turn', hint: 'Sukoon helps, in a way you can see' },
      { id: 'proof', label: 'Proof', hint: 'The new normal, shown' },
      { id: 'off', label: 'Cut', hint: 'About the brand, or a claim' },
    ],
    cards: [
      { id: 'g1', label: piece('filmOpen'), lane: role('filmOpen'), visual: 'filmOpen', note: 'The film opens inside the problem, with something at stake: a daughter who isn’t being heard.' },
      { id: 'g2', label: piece('number1'), lane: role('number1'), visual: 'number1', note: 'About Sukoon, not about anyone watching. Rankings belong on the app-store page, not in the story.' },
      { id: 'g3', label: piece('filmTurn'), lane: role('filmTurn'), visual: 'filmTurn', note: 'The guide gives a plan you could follow right now. Shoulders dropping shows the change without saying “calm”.' },
      { id: 'g4', label: piece('carousel'), lane: role('carousel'), visual: 'carousel', note: 'Real people and real moments are proof you can check. It lives on Instagram, where people can scroll and ask.' },
      { id: 'g5', label: piece('billboard'), lane: role('billboard'), visual: 'billboard', note: 'A billboard holds one moment. On the drive home at 9 pm, the tension is the one people recognise.' },
      { id: 'g6', label: piece('bestLife'), lane: role('bestLife'), visual: 'bestLife', note: 'Any brand could say it, and nobody believes “instantly”. Show a moment instead.' },
      { id: 'g7', label: piece('bumper'), lane: role('bumper'), visual: 'bumper', note: 'Six seconds can carry one movement. The turn, with the five minutes that only Sukoon promises.' },
      { id: 'g8', label: piece('filmEnd'), lane: role('filmEnd'), visual: 'filmEnd', note: 'The payoff answers the opening: this time she hears the end of the story.' },
      { id: 'g9', label: piece('audio'), lane: role('audio'), visual: 'audio', note: 'At 11 pm, in the listener’s own ears. The tension, timed to when it’s true.' },
      { id: 'g10', label: piece('features'), lane: role('features'), visual: 'features', note: 'A feature list is the brand talking about itself. Features earn a place when they show up inside a moment.' },
      { id: 'g11', label: piece('reel'), lane: role('reel'), visual: 'reel', note: 'The turn as something you can do before you download anything. Giving the plan away builds trust in the guide.' },
      { id: 'g12', label: piece('study'), lane: role('study'), visual: 'study', note: 'Specific numbers from a named pilot, on LinkedIn where HR buyers look. Proof for the Teams side of the story.' },
    ],
  },
  gap: {
    id: 'gap', from: 0, at: 10.6,
    prompt: 'The agency’s film is true and forgettable. Where should Ishita’s new film start?',
    options: [{ id: 'a', label: 'On the logo, so people know who it’s from' }, { id: 'b', label: 'Inside the problem: Meera, after 9 pm, still answering work while her daughter talks' }, { id: 'c', label: 'With Kabir explaining why he founded Sukoon' }],
    correct: 'b', explanation: 'Start where the audience lives, with something at stake.',
  },
  takeaways: [
    { title: 'The customer is the hero', body: 'The brand is the guide that offers a plan. A film about the brand is an ad nobody retells.' },
    { title: 'Tension, turn, proof', body: 'Start in the problem with stakes, bring the brand in at the turn, and show the new normal.' },
    { title: 'Show, don’t claim', body: '“Feel calmer instantly” is a claim. Shoulders dropping in a lift is the same idea, believed.' },
    { title: 'One story, many cuts', body: 'Each channel carries the part it can hold, makes sense alone, and adds up in sequence.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: '“India’s #1 meditation app”:', options: [{ id: 'a', label: 'Tension' }, { id: 'b', label: 'Proof' }, { id: 'c', label: 'Cut' }], correct: 'c', explanation: 'The brand talking about itself.' },
      { id: 'q2', prompt: 'The villain in a brand story is usually…', options: [{ id: 'a', label: 'The market leader' }, { id: 'b', label: 'The problem the customer lives with' }, { id: 'c', label: 'The customer' }], correct: 'b', explanation: 'Here, the day that won’t end.' },
      { id: 'q3', prompt: 'A billboard can carry…', options: [{ id: 'a', label: 'The whole arc' }, { id: 'b', label: 'One moment, usually the tension' }, { id: 'c', label: 'The feature list' }], correct: 'b', explanation: 'Seconds of attention, one idea.' },
      { id: 'q4', prompt: 'If a rival could put its logo on your film’s end card…', options: [{ id: 'a', label: 'The story isn’t yours yet' }, { id: 'b', label: 'It’s universal, so it works' }, { id: 'c', label: 'Add more logos' }], correct: 'a', explanation: 'Anchor it in what only you do.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Kabir says: “Our founder story is a story too. Why not lead with it?”', hint: 'Whose change is the audience watching?', options: [{ id: 'a', label: 'It should lead every campaign' }, { id: 'b', label: 'It’s a good story about the brand; use it for press, the About page and hiring, but in the campaign the customer is the one who changes' }, { id: 'c', label: 'Founder stories never work' }, { id: 'd', label: 'Only if it’s under 10 seconds' }], correct: 'b', explanation: 'Every story has a place; the campaign’s hero is the customer.' },
    { id: 'l2', prompt: 'Ishita’s arc tests well, but Meera is a Gurugram product manager. Will it work for a nurse in Kochi on night shifts?', hint: 'What should stay fixed, and what can change?', options: [{ id: 'a', label: 'Yes, everyone is stressed' }, { id: 'b', label: 'Keep the arc and the brand narrative; recast the tension in her real moment, found in research, not by swapping the actor' }, { id: 'c', label: 'Make one film with everyone in it' }, { id: 'd', label: 'Drop nurses as an audience' }], correct: 'b', explanation: 'The structure travels; the moment has to be true to the person.' },
    { id: 'l3', prompt: 'The film is 60 seconds, but most people will see it as a 15-second cut. What should the cut keep?', hint: 'Which movement can’t be lost?', options: [{ id: 'a', label: 'Just the logo and the price' }, { id: 'b', label: 'A compressed arc: one beat of tension, the turn with Sukoon, one beat of proof, so it still changes something' }, { id: 'c', label: 'Only the tension, for curiosity' }, { id: 'd', label: 'The feature montage' }], correct: 'b', explanation: 'Shorter is fine; a story still needs a before and an after.' },
    { id: 'l4', prompt: 'How should Ishita test the film before spending ₹2.4 crore on media?', hint: 'What should viewers be able to do afterwards?', options: [{ id: 'a', label: 'Ask whether they liked it' }, { id: 'b', label: 'Show it to target viewers among other ads, then ask a day later what happened in it and which brand it was for' }, { id: 'c', label: 'Count likes on an early post' }, { id: 'd', label: 'Ask the agency' }], correct: 'b', explanation: 'Recall of the story and the brand, not liking, predicts whether it works.' },
    { id: 'l5', prompt: 'A year on, the brand narrative “Work got faster. Your head didn’t.” is still working. What should the next campaign change?', hint: 'What is fixed for years, and what is fresh?', options: [{ id: 'a', label: 'The narrative, to stay fresh' }, { id: 'b', label: 'Keep the narrative and distinctive assets; tell a new chapter, a new moment and person, so each campaign adds to the same memory' }, { id: 'c', label: 'Nothing; rerun the film forever' }, { id: 'd', label: 'Switch to price ads' }], correct: 'b', explanation: 'Consistency builds memory; fresh stories keep it alive.' },
  ],
};

export const br4_2: Episode = {
  lessonId: 'br.4-2',
  hook: 'Marketing wanted everything called Sukoon. Neend’s founder wanted to keep his name. The gummies team wanted the logo on the box. Watch Ishita draw the family tree.',
  scene: {
    id: 'brand-spectrum', duration: 36,
    beats: [
      { at: 0, title: 'Twelve things to name', body: 'Features, a Teams plan, two bought apps, yoga studios, therapy and gummies. One meeting, every opinion.' },
      { at: 6, title: 'The spectrum', body: 'From a branded house, one name for all, to a house of brands, each on its own.' },
      { at: 11, title: 'Does it keep the promise?', body: 'Calm in five minutes for busy professionals. Hour-long yoga classes don’t, so Prana keeps its name.' },
      { at: 16, title: 'Could it break it?', body: 'One bad therapy session, one side effect, and it’s news about Sukoon. Saath and Thehrav stand apart.' },
      { at: 21, title: 'Equity you bought', body: 'Neend has five years of reviews. Keep the name, add “by Sukoon”, revisit in two years.' },
      { at: 26, title: 'A different buyer', body: 'HR signs the contract for Teams; parents choose Kids. Each gets a sub-brand.' },
      { at: 31, title: 'The family tree', body: 'Everything else is just Sukoon with a plain description. The rules settle the next request in minutes.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What is an endorsed brand?', options: [{ id: 'a', label: 'A brand with its own name, backed by the master brand' }, { id: 'b', label: 'A brand a celebrity promotes' }, { id: 'c', label: 'A feature with a plain description' }],
      correct: 'a', explanation: 'Courtyard by Marriott; Neend, by Sukoon.' },
    { id: 'c2', prompt: 'Why does therapy get its own brand even though it fits the promise?', options: [{ id: 'a', label: 'It’s more expensive' }, { id: 'b', label: 'A failure there would be news about Sukoon and damage the promise' }, { id: 'c', label: 'Psychologists asked for it' }],
      correct: 'b', explanation: 'Risk to the master brand comes before fit.' },
  ],
  game: {
    id: 'family-sort', title: 'Draw the family tree',
    instructions: 'Each card is something Sukoon makes, sells or has bought. Is it just Sukoon, a Sukoon sub-brand, endorsed by Sukoon, or its own brand? Ask the four questions in order: promise, risk, equity, buyer. Right calls build the family tree.',
    lanes: [
      { id: 'master', label: 'Just Sukoon', hint: 'Keeps the promise, nothing new' },
      { id: 'sub', label: 'Sub-brand', hint: 'Someone else chooses or pays' },
      { id: 'endorsed', label: 'Endorsed', hint: 'A trusted name of its own' },
      { id: 'own', label: 'Own brand', hint: 'Off the promise, or a risk to it' },
    ],
    cards: [
      { id: 'g1', label: offer('sleep'), lane: place('sleep'), visual: 'sleep', note: 'Same promise, same subscriber, no name of its own. A plain description puts all the attention on Sukoon.' },
      { id: 'g2', label: offer('neend'), lane: place('neend'), visual: 'neend', note: 'Five years of reviews are equity Sukoon paid for. Renaming it throws that away; endorsing it lends Sukoon’s trust.' },
      { id: 'g3', label: offer('teams'), lane: place('teams'), visual: 'teams', note: 'HR signs the contract, and needs a name for the deck and the invoice. Sukoon Teams leans on the brand staff already use.' },
      { id: 'g4', label: offer('therapy'), lane: place('therapy'), visual: 'therapy', note: 'It fits, but one bad session would be news about Sukoon, and “five minutes” overpromises therapy. Saath stands apart.' },
      { id: 'g5', label: offer('watch'), lane: place('watch'), visual: 'watch', note: 'The same product on a new device. “Sukoon on your watch” needs no name.' },
      { id: 'g6', label: offer('prana'), lane: place('prana'), visual: 'prana', note: 'Hour-long classes in a studio aren’t calm in five minutes. Prana keeps its own name and its own loyal following.' },
      { id: 'g7', label: offer('kids'), lane: place('kids'), visual: 'kids', note: 'Parents choose it for someone else, and it needs its own tone. Sukoon Kids borrows the trust parents already have.' },
      { id: 'g8', label: offer('gummies'), lane: place('gummies'), visual: 'gummies', note: 'A supplement makes health claims a meditation app can’t stand behind, and a side effect would land on Sukoon.' },
      { id: 'g9', label: offer('focus'), lane: place('focus'), visual: 'focus', note: 'Inside the subscription, for the same people. “Sukoon · Focus music” is all it needs.' },
      { id: 'g10', label: offer('pause'), lane: place('pause'), visual: 'pause', note: 'Two-minute stretches keep the promise, and its users love the name. Endorse it rather than rename it.' },
      { id: 'g11', label: offer('pro'), lane: place('pro'), visual: 'pro', note: 'Counsellors choose it for their clients: a different buyer with different needs. Sukoon Pro.' },
      { id: 'g12', label: offer('tamil'), lane: place('tamil'), visual: 'tamil', note: 'New languages widen the same product. A description, not a brand.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 15.6,
    prompt: 'Therapy with licensed psychologists fits “calm for busy professionals”. Marketing wants to call it Sukoon Therapy. What does Ishita decide?',
    options: [{ id: 'a', label: 'Sukoon Therapy: it fits the promise' }, { id: 'b', label: 'Its own brand, Saath: one bad session would be news about Sukoon, and “five minutes” overpromises therapy' }, { id: 'c', label: 'Don’t offer therapy at all' }],
    correct: 'b', explanation: 'Fit isn’t enough if a failure could break the promise.',
  },
  takeaways: [
    { title: 'Architecture is a trade', body: 'What each offering borrows from the master brand, against what it could cost it.' },
    { title: 'Four questions, in order', body: 'Keeps the promise? Could break it? Has its own equity? Has a different buyer?' },
    { title: 'Name less', body: 'Features get plain descriptions. Every extra brand needs its own budget to build.' },
    { title: 'Write the rules', body: 'So the next naming request takes minutes, and the family stays legible.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'Google Maps, Google Drive:', options: [{ id: 'a', label: 'Branded house' }, { id: 'b', label: 'House of brands' }, { id: 'c', label: 'Endorsed' }], correct: 'a', explanation: 'One name does the work.' },
      { id: 'q2', prompt: 'Surf Excel, Lux and Brooke Bond, all Hindustan Unilever:', options: [{ id: 'a', label: 'Sub-brands' }, { id: 'b', label: 'House of brands' }, { id: 'c', label: 'Branded house' }], correct: 'b', explanation: 'Each built on its own.' },
      { id: 'q3', prompt: 'An app you bought, with a name its users love, that keeps your promise:', options: [{ id: 'a', label: 'Rename it' }, { id: 'b', label: 'Endorse it' }, { id: 'c', label: 'Hide the owner' }], correct: 'b', explanation: 'Keep the equity, lend the trust.' },
      { id: 'q4', prompt: 'A new feature inside the subscription:', options: [{ id: 'a', label: 'A plain description' }, { id: 'b', label: 'A sub-brand' }, { id: 'c', label: 'Its own brand' }], correct: 'a', explanation: 'Names cost attention and budget.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Investors say a house of brands is “safer”. Why not give everything its own name?', hint: 'What does each brand need to exist?', options: [{ id: 'a', label: 'It is always safer' }, { id: 'b', label: 'Each brand needs its own budget and years to build; for a company Sukoon’s size, a branded house puts all the money behind one name' }, { id: 'c', label: 'It’s illegal' }, { id: 'd', label: 'Names are free' }], correct: 'b', explanation: 'Separation buys protection at the price of efficiency.' },
    { id: 'l2', prompt: 'Two years on, 70% of Neend users know Sukoon owns it, and they rate both highly. What now?', hint: 'The endorsement was a stage, not an end.', options: [{ id: 'a', label: 'Keep it endorsed forever' }, { id: 'b', label: 'Consider moving it closer, to “Sukoon Neend” or into the app, tested with Neend users first' }, { id: 'c', label: 'Sell Neend' }, { id: 'd', label: 'Rename Sukoon to Neend' }], correct: 'b', explanation: 'Architecture moves as the evidence does.' },
    { id: 'l3', prompt: 'Sukoon Kids grows fast, and a news story questions screen time for children. What does the sub-brand mean here?', hint: 'What does a sub-brand share?', options: [{ id: 'a', label: 'Nothing; Kids is separate' }, { id: 'b', label: 'Kids shares Sukoon’s name, so the story touches Sukoon; that was the trade, so answer it as Sukoon, with evidence and clear limits' }, { id: 'c', label: 'Rename Kids overnight' }, { id: 'd', label: 'Ignore it' }], correct: 'b', explanation: 'Borrowed trust means shared risk; plan for it.' },
    { id: 'l4', prompt: 'How should the identity system show the family?', hint: 'Who must look related, and how closely?', options: [{ id: 'a', label: 'Every brand looks identical' }, { id: 'b', label: 'Sub-brands use Sukoon’s identity with their own descriptor; endorsed brands keep their look with a “by Sukoon” lockup; own brands share nothing visible' }, { id: 'c', label: 'Every brand gets a new identity' }, { id: 'd', label: 'Only colours differ' }], correct: 'b', explanation: 'The visual system should show the relationships the strategy chose.' },
    { id: 'l5', prompt: 'A new team asks for “Sukoon Shanti”, a premium tier at ₹499 a month. What does Ishita ask first?', hint: 'Run the four questions.', options: [{ id: 'a', label: 'What colour it should be' }, { id: 'b', label: 'Is it the same promise for the same people at a higher price? If so, it’s a plan name, like “Sukoon Plus”, not a brand' }, { id: 'c', label: 'Whether an agency is free' }, { id: 'd', label: 'Whether competitors have one' }], correct: 'b', explanation: 'A price tier is a plan, not a new member of the family.' },
  ],
};

export const br4_3: Episode = {
  lessonId: 'br.4-3',
  hook: 'Installs jumped 70% in week one and were back to normal by week four. Kabir asked whether ₹2.4 crore had been wasted. Watch Ishita measure what the campaign actually built.',
  scene: {
    id: 'brand-tracker', duration: 36,
    beats: [
      { at: 0, title: 'Up, then down', body: 'Installs spike in week one and fade by week four. “Did it fail?”' },
      { at: 6, title: 'Not those numbers', body: '1.2 crore impressions count what was bought. A week of installs is activation, not brand.' },
      { at: 11, title: 'The tracker', body: 'Every month, 1,000 professionals: heard of it, would consider it, prefer it.' },
      { at: 16, title: 'Against the holdout', body: 'Awareness rose 11 points where it ran, and 3 where it didn’t. The campaign caused 8.' },
      { at: 21, title: 'Share of search', body: 'Sukoon gets 30% of the category’s brand searches with 24% of the market. Expect it to grow.' },
      { at: 26, title: 'Clean the count', body: '“Sukoon” is a word and a song. Count “sukoon app”; set aside news spikes and bought searches.' },
      { at: 31, title: 'The long clock', body: 'Brand builds over months. Agree the measures and read dates before the next campaign.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why don’t a week of installs tell Kabir whether the brand grew?', options: [{ id: 'a', label: 'Installs are never useful' }, { id: 'b', label: 'They measure short-term activation; brand effects build over months' }, { id: 'c', label: 'Installs are too hard to count' }],
      correct: 'b', explanation: 'Short and long effects run on different clocks.' },
    { id: 'c2', prompt: 'Awareness rose 11 points where the campaign ran and 3 points where it didn’t. What did the campaign cause?', options: [{ id: 'a', label: '11 points' }, { id: 'b', label: '8 points' }, { id: 'c', label: '3 points' }],
      correct: 'b', explanation: 'The holdout shows what would have happened anyway.' },
  ],
  game: {
    id: 'search-share', title: 'Read share of search',
    instructions: 'Each card is a month of search data: a brand’s searches, every brand search in the category (both in thousands), and its share of paying subscribers. Work out its share of search. Three points or more above market share is gaining, three below is losing. But first check the count is real. Right calls plot it on the chart.',
    lanes: [
      { id: 'gain', label: 'Gaining', hint: 'Search share 3+ points above' },
      { id: 'hold', label: 'Holding', hint: 'Within 3 points' },
      { id: 'lose', label: 'Losing', hint: 'Search share 3+ points below' },
      { id: 'distorted', label: 'Distorted', hint: 'Not people looking for the brand' },
    ],
    cards: [
      { id: 'g1', label: reading('sukoonIndia'), lane: read('sukoonIndia'), visual: 'sukoonIndia', note: '54 of 180 is 30%, six points above a 24% share. The campaign is showing up in what people look for.' },
      { id: 'g2', label: reading('shaantIndia'), lane: read('shaantIndia'), visual: 'shaantIndia', note: 'The leader gets 25% of searches with 31% of the market. Big today, but fewer people are looking for it.' },
      { id: 'g3', label: reading('sukoonRaw'), lane: read('sukoonRaw'), visual: 'sukoonRaw', note: '77% of searches would be absurd. Most are for the word and the song. Count “sukoon app” and “sukoon meditation”.' },
      { id: 'g4', label: reading('dhyanaIndia'), lane: read('dhyanaIndia'), visual: 'dhyanaIndia', note: '20% of searches, 19% of the market. In balance.' },
      { id: 'g5', label: reading('sukoonHyd'), lane: read('sukoonHyd'), visual: 'sukoonHyd', note: '16% against 21%. A held-out city, and a warning: without brand building, Sukoon’s share there may slip.' },
      { id: 'g6', label: reading('calmlyIndia'), lane: read('calmlyIndia'), visual: 'calmlyIndia', note: 'A small brand searched far more than its 9% share. One to watch.' },
      { id: 'g7', label: reading('shaantNews'), lane: read('shaantNews'), visual: 'shaantNews', note: 'People were reading about a leak, not choosing an app. Set the month aside and read the trend either side.' },
      { id: 'g8', label: reading('sukoonPune'), lane: read('sukoonPune'), visual: 'sukoonPune', note: '30% against 29%. Pune already knew Sukoon well, so search and share are in line.' },
      { id: 'g9', label: reading('dhyanaChennai'), lane: read('dhyanaChennai'), visual: 'dhyanaChennai', note: '20% of searches against 27% of the market: seven points short.' },
      { id: 'g10', label: reading('calmlyCash'), lane: read('calmlyCash'), visual: 'calmlyCash', note: 'Searches bought with cashback measure the offer. They stop when the money does.' },
      { id: 'g11', label: reading('sukoonBlr'), lane: read('sukoonBlr'), visual: 'sukoonBlr', note: '12 of 40 is 30%, four points above a 26% share. Bengaluru is where the campaign is building.' },
      { id: 'g12', label: reading('shaantMumbai'), lane: read('shaantMumbai'), visual: 'shaantMumbai', note: '25% against 26%. Within the noise.' },
    ],
  },
  gap: {
    id: 'gap', from: 11, at: 20.6,
    prompt: 'The campaign ran in Pune and Bengaluru. Before it ends, the agency wants to say “Sukoon’s share of search is 30%, so we’re winning everywhere.” What does Ishita check first?',
    options: [{ id: 'a', label: 'Nothing; 30% is great' }, { id: 'b', label: 'Whether the count is clean (“sukoon app”, not the word and the song), and how it compares to market share city by city, including the held-out ones' }, { id: 'c', label: 'Whether the ads were liked' }],
    correct: 'b', explanation: 'A clean count, read against market share, place by place.',
  },
  takeaways: [
    { title: 'Two clocks', body: 'Activation peaks and fades in weeks. Brand builds over months. Don’t judge one by the other.' },
    { title: 'Lift needs a holdout', body: 'The change where it ran minus the change where it didn’t. Everything else is a guess.' },
    { title: 'Share of search leads', body: 'Searched more than your market share, you tend to grow. Less, a warning.' },
    { title: 'Clean before you read', body: 'Generic words, news spikes and bought searches aren’t people looking for you.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: '18 of 60 thousand searches, 25% market share:', options: [{ id: 'a', label: 'Gaining' }, { id: 'b', label: 'Holding' }, { id: 'c', label: 'Losing' }], correct: 'a', explanation: '30%, five points above.' },
      { id: 'q2', prompt: '8 of 40 thousand searches, 21% market share:', options: [{ id: 'a', label: 'Gaining' }, { id: 'b', label: 'Holding' }, { id: 'c', label: 'Losing' }], correct: 'b', explanation: '20%, within three points.' },
      { id: 'q3', prompt: '1.2 crore impressions tells you…', options: [{ id: 'a', label: 'The brand grew' }, { id: 'b', label: 'What media was bought' }, { id: 'c', label: 'Market share' }], correct: 'b', explanation: 'An output, not an effect.' },
      { id: 'q4', prompt: 'A tracker of 1,000 moves 2 points in a month:', options: [{ id: 'a', label: 'Celebrate' }, { id: 'b', label: 'Within chance; watch the trend' }, { id: 'c', label: 'Cut the budget' }], correct: 'b', explanation: 'About ±3 points is noise.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'The agency’s “ad recall up 40%” came from asking people who saw the ad whether they remembered it. What’s wrong?', hint: 'Compared with whom?', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'No comparison group: recall of an ad among people who saw it says little about the brand; compare exposed and held-out people on brand measures' }, { id: 'c', label: 'The sample is too large' }, { id: 'd', label: 'Recall should be 100%' }], correct: 'b', explanation: 'Brand lift is measured against people who weren’t reached.' },
    { id: 'l2', prompt: 'Kabir asks for a weekly brand report. What should Ishita offer?', hint: 'How fast does the thing move, and how noisy is it?', options: [{ id: 'a', label: 'Weekly, with every metric' }, { id: 'b', label: 'Monthly tracker and quarterly share of search, read as trends against the holdout, with activation numbers weekly for the sales side' }, { id: 'c', label: 'Once a year' }, { id: 'd', label: 'Only when numbers go up' }], correct: 'b', explanation: 'Match the read cadence to how fast each measure can really move.' },
    { id: 'l3', prompt: 'Share of search rose for two quarters, but market share hasn’t moved. Was share of search wrong?', hint: 'Which one usually moves first?', options: [{ id: 'a', label: 'Yes, drop it' }, { id: 'b', label: 'Not necessarily: it often leads by months; check the query is still clean, then look for what stops searchers converting, like price or the store page' }, { id: 'c', label: 'Market share is wrong' }, { id: 'd', label: 'Spend more on search ads' }], correct: 'b', explanation: 'A leading signal that doesn’t convert points at a leak downstream.' },
    { id: 'l4', prompt: 'Finance wants to cut the brand budget to fund more performance ads, because those show sales the same week. What’s Ishita’s case?', hint: 'What happens over a year?', options: [{ id: 'a', label: 'Brand is creative, so it can’t be measured' }, { id: 'b', label: 'Show the holdout lift in consideration and share of search, and that activation sells to people the brand already built; cutting brand shrinks the pool performance ads harvest' }, { id: 'c', label: 'Agree, cut it all' }, { id: 'd', label: 'Ask for double' }], correct: 'b', explanation: 'Brand fills the pool; activation fishes in it. Show both with evidence.' },
    { id: 'l5', prompt: 'What business number should brand measures finally lead to?', hint: 'What does a stronger brand let you do?', options: [{ id: 'a', label: 'Followers' }, { id: 'b', label: 'Share of market, lower churn and the price Sukoon can charge above rivals without losing subscribers' }, { id: 'c', label: 'Awards' }, { id: 'd', label: 'Website visits' }], correct: 'b', explanation: 'A brand is worth what it does to choice, loyalty and price.' },
  ],
};
