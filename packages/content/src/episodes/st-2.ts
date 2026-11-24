// Episodes for chapter st.2 · Vision & roadmaps. Drafts by Claude, for review.
// Galla (galla is Hindi for a shop's cash box) is a Lucknow app that kirana shops use to keep their udhaar (credit)
// ledger. Anil Verma founded it, Rohan is its product manager and Ishita its product designer. Shabnam runs a kirana
// shop in Aminabad with her son Faiz, and 61 customers owe her ₹38,000 in a paper khata. st.1 covered outcomes, the
// opportunity tree and RICE; this chapter is about the story that says where the product is going, the roadmap that
// gets it there without promising dates, and knowing who you're really up against.
import { GALLA_BETS, type Episode, type GallaBet } from '../episode';

/** A roadmap card is named by the problem its bet takes on. */
const problem = (bet: GallaBet) => GALLA_BETS[bet].problem;

export const st2_1: Episode = {
  lessonId: 'st.2-1',
  hook: '“Galla will be India’s leading AI-powered retail ecosystem.” Everyone nodded. Then nobody could use it to decide a single thing.',
  scene: {
    id: 'vision-narrative', duration: 36,
    beats: [
      { at: 0, title: 'A slogan on a slide', body: 'At the offsite, Anil shows the vision: “Galla will be India’s leading AI-powered retail ecosystem.” The room claps.' },
      { at: 6, title: 'It decides nothing', body: 'On Monday, Rohan brings two proposals: a GST billing suite and voice entry in Hindi. Both “fit” the slogan. The team argues for an hour.' },
      { at: 12, title: 'Highlight the empty words', body: 'Ishita highlights “leading”, “AI-powered” and “ecosystem”. Take them out and almost nothing is left: no person, no problem, no future.' },
      { at: 17, title: 'Start with a person', body: 'Shabnam runs a kirana shop in Aminabad. 61 customers owe her ₹38,000, written in a paper khata. Every Sunday she adds it up, and she hates asking regulars for money.' },
      { at: 23, title: 'Paint 2030', body: 'In 2030 she closes at 9 knowing to the rupee who owes her. Customers pay back before she has to ask, and nobody argues about what they bought.' },
      { at: 28, title: 'Why us', body: 'Galla already holds 40,000 shops’ ledgers, so it sees who pays late before anyone else does. The team grew up behind counters like hers.' },
      { at: 32, title: 'Now it says no', body: 'Voice entry gets entries written in the evening rush: it serves the story. The GST suite is for supermarkets, not Shabnam. Off.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why couldn’t the slogan settle the argument?', options: [{ id: 'a', label: 'It was too short' }, { id: 'b', label: 'It named no person, problem or future, so any idea could claim to fit it' }, { id: 'c', label: 'It didn’t mention AI enough' }],
      correct: 'b', explanation: 'A vision that every idea fits can’t say no to any of them.' },
    { id: 'c2', prompt: 'What are the three parts of Ishita’s narrative?', options: [{ id: 'a', label: 'Features, dates and owners' }, { id: 'b', label: 'Mission, values and logo' }, { id: 'c', label: 'The struggle today, the future for that person, and why this team can get there' }],
      correct: 'c', explanation: 'Today, tomorrow and why us. Features belong on the roadmap.' },
  ],
  game: {
    id: 'vision-postcard', title: 'Write the postcard from 2030',
    instructions: 'Each card is a line from a draft of Galla’s vision. Put it in the part of the story it tells, or cut it. Kept lines build the postcard; cut lines show what gave them away.',
    lanes: [
      { id: 'today', label: 'Today', hint: 'Her struggle now, in her terms' },
      { id: 'future', label: '2030', hint: 'What’s different for her once Galla has done its job' },
      { id: 'whyus', label: 'Why us', hint: 'What lets this team get there' },
      { id: 'cut', label: 'Cut', hint: 'A slogan, a feature or a target' },
    ],
    cards: [
      { id: 'g1', label: 'Today, Shabnam keeps udhaar for 61 customers in a paper khata, and ₹38,000 is written in it.', lane: 'today', note: 'A real person, a real number and the tool she uses now. Everyone can picture the counter.' },
      { id: 'g2', label: 'Galla will be India’s leading AI-powered retail ecosystem.', lane: 'cut', note: 'Three buzzwords and no person. Rewrite it as a change in someone’s life: “Shabnam knows who owes her without opening a notebook.”' },
      { id: 'g3', label: 'In 2030, she closes the shop at 9 knowing to the rupee who owes her, without opening a notebook.', lane: 'future', note: 'A scene you can see, from her side of the counter. It doesn’t say how Galla does it, which leaves room to find out.' },
      { id: 'g4', label: 'Launch voice entry, GST billing and loans in the next release.', lane: 'cut', note: 'A feature list. It belongs on the roadmap, if it belongs anywhere. In the vision say what changes: “Entries get written even in the evening rush.”' },
      { id: 'g5', label: 'Every evening she has to choose between chasing a regular for money and keeping him as a customer.', lane: 'today', note: 'The emotional cost, not just the money. It explains why reminders have to feel polite, not like a debt collector.' },
      { id: 'g6', label: 'Galla already holds the ledgers of 40,000 shops in Lucknow and Kanpur, so it sees who pays late before anyone else does.', lane: 'whyus', note: 'An advantage nobody can copy quickly: the data, and what it lets Galla do.' },
      { id: 'g7', label: 'Reach 10 lakh shops and ₹500 crore of udhaar by 2028.', lane: 'cut', note: 'A target, and a fine one for goals. But numbers don’t say what life looks like. Keep them for the plan; the vision says why they’d happen.' },
      { id: 'g8', label: 'Customers pay back before she has to ask, and nobody argues about what they bought.', lane: 'future', note: 'Two changes she’d notice at once. Each one gives the team something to test ideas against.' },
      { id: 'g9', label: 'Our team grew up behind counters like hers: we know udhaar is trust, not just money.', lane: 'whyus', note: 'Why us, from experience. It also tells designers what to protect: the relationship between shop and customer.' },
      { id: 'g10', label: 'A seamless experience that empowers every shopkeeper.', lane: 'cut', note: '“Seamless” and “empowers” could describe any app. Say what she can do that she can’t today: “add an entry in the time it takes to write one”.' },
    ],
  },
  gap: {
    id: 'gap', from: 28, at: 31.8,
    prompt: 'Rohan asks again about the GST billing suite. What does the new vision say?',
    options: [{ id: 'a', label: 'Yes: it’s retail, and so is Galla' }, { id: 'b', label: 'No: it serves supermarkets with GST invoices, not Shabnam’s udhaar, so it doesn’t move her 2030' }, { id: 'c', label: 'Ask Anil, he wrote the vision' }],
    correct: 'b', explanation: 'A narrative about a person gives you a test: does this change her story? The GST suite doesn’t.',
  },
  takeaways: [
    { title: 'A person, not a slogan', body: 'Name who it’s for and what they struggle with today, in their words.' },
    { title: 'Paint the future', body: 'A scene three to five years out, from their side, without saying how you’ll build it.' },
    { title: 'Say why you', body: 'The advantage or insight that lets this team get there.' },
    { title: 'It has to say no', body: 'If every idea fits, it isn’t a vision. Features go to the roadmap, targets to goals.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '“Launch voice entry next quarter” belongs in…', options: [{ id: 'a', label: 'The vision' }, { id: 'b', label: 'The roadmap' }], correct: 'b', explanation: 'It’s a feature with a time. The vision says what changes.' },
      { id: 'q2', prompt: 'How far ahead does a product vision usually look?', options: [{ id: 'a', label: 'Two weeks' }, { id: 'b', label: 'One quarter' }, { id: 'c', label: 'Three to five years, sometimes ten' }], correct: 'c', explanation: 'Far enough that it won’t change every quarter.' },
      { id: 'q3', prompt: 'Which word is a warning sign in a vision?', options: [{ id: 'a', label: 'Shabnam' }, { id: 'b', label: 'Seamless' }, { id: 'c', label: 'Notebook' }, { id: 'd', label: 'Evening' }], correct: 'b', explanation: 'It sounds good and describes any product.' },
      { id: 'q4', prompt: 'What makes a vision useful on a normal Monday?', options: [{ id: 'a', label: 'It’s on the office wall' }, { id: 'b', label: 'It lets the team say no to an idea' }, { id: 'c', label: 'It names the tech stack' }, { id: 'd', label: 'It has a launch date' }], correct: 'b', explanation: 'A vision you can’t decide with is decoration.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why write the future as a scene (“she closes at 9 knowing who owes her”) rather than a goal (“reduce bad debt”)?', hint: 'What can people picture?', options: [{ id: 'a', label: 'Scenes are shorter' }, { id: 'b', label: 'A scene is something people can picture and test ideas against, from the user’s side' }, { id: 'c', label: 'Goals are banned' }, { id: 'd', label: 'Investors prefer stories' }], correct: 'b', explanation: 'Goals still matter; they measure progress towards the scene.' },
    { id: 'l2', prompt: 'Amazon teams write a press release for a product before building it. What is that practice called?', hint: 'They start at the end.', options: [{ id: 'a', label: 'Design sprint' }, { id: 'b', label: 'Working backwards' }, { id: 'c', label: 'Dogfooding' }, { id: 'd', label: 'Lean canvas' }], correct: 'b', explanation: 'Working backwards: write the launch story for the customer first, then decide whether it’s worth building.' },
    { id: 'l3', prompt: 'Anil wants the vision to say “use AI”. What’s the best response?', hint: 'Means or end?', options: [{ id: 'a', label: 'Add it; AI is the future' }, { id: 'b', label: 'Ban AI from the product' }, { id: 'c', label: 'AI is one way to get there; the vision says what changes for Shabnam, and the roadmap can choose AI where it helps' }, { id: 'd', label: 'Put it in the logo instead' }], correct: 'c', explanation: 'A technology is a how. A vision that names one stops you choosing a better one.' },
    { id: 'l4', prompt: 'Who should help write the vision narrative?', hint: 'Who has to use it?', options: [{ id: 'a', label: 'The founder alone, then announce it' }, { id: 'b', label: 'An agency' }, { id: 'c', label: 'The founder, product, design and engineering, drafting from research with real users' }, { id: 'd', label: 'Whoever has free time' }], correct: 'c', explanation: 'The people deciding with it every week should shape it, and research keeps it honest.' },
    { id: 'l5', prompt: 'A year on, research shows shopkeepers care more about running out of stock than about udhaar. What should happen to the vision?', hint: 'Evidence beats pride.', options: [{ id: 'a', label: 'Nothing; a vision never changes' }, { id: 'b', label: 'Revisit it openly with the evidence: a vision is stable, but not sacred' }, { id: 'c', label: 'Quietly add stock to the slide' }, { id: 'd', label: 'Start a new company' }], correct: 'b', explanation: 'It should outlast quarters, not facts. Change it on purpose, and say why.' },
  ],
};

export const st2_2: Episode = {
  lessonId: 'st.2-2',
  hook: 'Rohan’s roadmap had ten features and ten months. By April three bars were red, and sales had promised loans to a distributor for August.',
  scene: {
    id: 'roadmap-horizons', duration: 36,
    beats: [
      { at: 0, title: 'A Gantt chart with dates', body: 'Rohan’s roadmap is a timeline: ten features, each a bar with a month, from January to October.' },
      { at: 6, title: 'Dates slip', body: 'Voice entry takes twice as long as planned. Everything behind it slides, three bars turn red, and sales has already promised loans to a distributor for August.' },
      { at: 12, title: 'Three columns', body: 'Ishita redraws it as Now, Next and Later. No dates. Now is committed and detailed, Next is shaped, Later is fuzzy on purpose.' },
      { at: 17, title: 'Problems, not features', body: '“Automatic WhatsApp reminders” becomes “Customers forget what they owe until Shabnam asks”. The team can change the fix without breaking a promise.' },
      { at: 22, title: 'Evidence sets the column', body: 'A tested fix goes in Now. A proven problem with no tested fix goes in Next. A request or two is a signal: Later.' },
      { at: 27, title: 'Builds on', body: 'The UPI link tested well, but it lives inside the reminder. It goes in Next, after reminders ship.' },
      { at: 31, title: 'Off the board', body: 'The GST suite and dark mode don’t serve the vision. They leave the board, each with a one-line reason Rohan can send.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the Gantt roadmap break?', options: [{ id: 'a', label: 'The bars were the wrong colour' }, { id: 'b', label: 'It promised dates for work nobody understood yet, so one slip broke every promise behind it' }, { id: 'c', label: 'It had too few features' }],
      correct: 'b', explanation: 'Dates claim a certainty the team didn’t have.' },
    { id: 'c2', prompt: 'What does each item on Ishita’s board name?', options: [{ id: 'a', label: 'A feature and its launch date' }, { id: 'b', label: 'A problem for the shopkeeper' }, { id: 'c', label: 'The engineer working on it' }],
      correct: 'b', explanation: 'Name the problem; the solution can change as you learn.' },
  ],
  game: {
    id: 'horizon-board', title: 'Lay out the roadmap',
    instructions: 'Each card is a bet on Galla’s roadmap, named by the problem it takes on. Check what the team knows and what it builds on, then drag it to Now, Next or Later, or off the board.',
    lanes: [
      { id: 'now', label: 'Now', hint: 'A tested fix, ready to build' },
      { id: 'next', label: 'Next', hint: 'A proven problem, or waits on something in Now' },
      { id: 'later', label: 'Later', hint: 'Only a signal so far, or waits on something in Next' },
      { id: 'off', label: 'Off the board', hint: 'Doesn’t serve the vision' },
    ],
    cards: [
      { id: 'g1', label: problem('reminders'), lane: 'now', visual: 'reminders', note: 'A 40-shop pilot got udhaar paid back faster. Proven problem, tested fix: build it now, in detail.' },
      { id: 'g2', label: problem('voice'), lane: 'next', visual: 'voice', note: 'Ishita watched entries get skipped in the rush, so the problem is real. Hindi voice entry hasn’t been tested in a noisy shop yet: shape it in Next.' },
      { id: 'g3', label: problem('collect'), lane: 'next', visual: 'collect', note: 'The UPI link tested well, but it lives inside the reminder. It can’t go in Now until reminders exist, so it lands one column later.' },
      { id: 'g4', label: problem('gst'), lane: 'off', visual: 'gst', note: 'A real need, for someone else. Supermarkets aren’t Shabnam. The reason to send: “Not for kirana udhaar, so not on our roadmap this year.”' },
      { id: 'g5', label: problem('backup'), lane: 'now', visual: 'backup', note: 'Shopkeepers lose everything with a phone. The fix is known and tested. Now.' },
      { id: 'g6', label: problem('loans'), lane: 'later', visual: 'loans', note: 'A few shopkeepers asked. It fits the vision, but one signal isn’t evidence, and lending brings RBI rules with it. Later, as a problem to research.' },
      { id: 'g7', label: problem('stock'), lane: 'next', visual: 'stock', note: 'Shops run out of fast sellers, and Ishita saw it in visits. No fix tested yet. Next.' },
      { id: 'g8', label: problem('dark'), lane: 'off', visual: 'dark', note: 'Three requests, and it doesn’t change Shabnam’s story. Off, and that’s fine: a roadmap is also a list of what you won’t do.' },
      { id: 'g9', label: problem('reorder'), lane: 'later', visual: 'reorder', note: 'Only a signal, and it needs stock alerts first, which are in Next. Later.' },
      { id: 'g10', label: problem('disputes'), lane: 'next', visual: 'disputes', note: 'Arguments about credit are proven in interviews, and a shared statement builds on the reminder. Next either way.' },
    ],
  },
  gap: {
    id: 'gap', from: 22, at: 26.8,
    prompt: 'The UPI link inside the reminder tested well with 20 shops. Which column does it go in?',
    options: [{ id: 'a', label: 'Now: it’s tested' }, { id: 'b', label: 'Next: it builds on the reminder, which is still being built in Now' }, { id: 'c', label: 'Later: it’s about payments' }],
    correct: 'b', explanation: 'Evidence sets the earliest column; what it depends on can push it later.',
  },
  takeaways: [
    { title: 'Certainty, not dates', body: 'Now is committed, Next is shaped, Later is open. Each column says how sure you are.' },
    { title: 'Name the problem', body: 'Items are problems or outcomes, so the fix can change without breaking a promise.' },
    { title: 'Evidence moves things left', body: 'A tested fix earns Now; a proven problem waits in Next; a signal sits in Later.' },
    { title: 'Off is a decision', body: 'What doesn’t serve the vision leaves the board, with a reason you can share.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'Which column should have the most detail?', options: [{ id: 'a', label: 'Now' }, { id: 'b', label: 'Later' }], correct: 'a', explanation: 'Detail where you’re committed; fuzziness where you’re not.' },
      { id: 'q2', prompt: 'A single customer request belongs…', options: [{ id: 'a', label: 'In Now, to keep them happy' }, { id: 'b', label: 'In Later, as a signal, if it fits the vision' }, { id: 'c', label: 'On a dated timeline' }], correct: 'b', explanation: 'One request is a signal to watch.' },
      { id: 'q3', prompt: 'Which is the better roadmap item?', options: [{ id: 'a', label: '“Cloud backup, March”' }, { id: 'b', label: '“A lost phone wipes out the whole ledger”' }], correct: 'b', explanation: 'The problem stays true even if the fix changes.' },
      { id: 'q4', prompt: 'Who popularised the Now / Next / Later roadmap?', options: [{ id: 'a', label: 'Henry Gantt' }, { id: 'b', label: 'Janna Bastow of ProdPad' }, { id: 'c', label: 'Don Norman' }, { id: 'd', label: 'Jakob Nielsen' }], correct: 'b', explanation: 'She introduced it as an alternative to timeline roadmaps.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Sales needs something to tell customers. What can a Now / Next / Later roadmap offer instead of dates?', hint: 'What do customers really want to know?', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'Which problems you’re solving now and next, and what would move something forward' }, { id: 'c', label: 'Made-up dates' }, { id: 'd', label: 'The engineering backlog' }], correct: 'b', explanation: 'Customers want to know their problem is coming. Honesty about certainty keeps trust.' },
    { id: 'l2', prompt: 'When does an item move from Next to Now?', hint: 'Not when someone shouts.', options: [{ id: 'a', label: 'When the quarter changes' }, { id: 'b', label: 'When a fix has been tested enough to commit, and the team has room' }, { id: 'c', label: 'When the CEO asks' }, { id: 'd', label: 'Never' }], correct: 'b', explanation: 'Evidence and capacity move things, not the calendar.' },
    { id: 'l3', prompt: 'Rohan wants 9 items in Now. What’s the risk?', hint: 'Now means committed.', options: [{ id: 'a', label: 'None, more is faster' }, { id: 'b', label: 'Too much in progress at once: everything slows, and Now stops meaning committed' }, { id: 'c', label: 'The board looks unbalanced' }, { id: 'd', label: 'Later gets jealous' }], correct: 'b', explanation: 'Keep Now to what the team can really be working on.' },
    { id: 'l4', prompt: 'Are dates ever right on a roadmap?', hint: 'Some dates aren’t yours to choose.', options: [{ id: 'a', label: 'Never' }, { id: 'b', label: 'Always' }, { id: 'c', label: 'For fixed external deadlines, like a regulation or Diwali, marked as constraints rather than guesses' }, { id: 'd', label: 'Only in Later' }], correct: 'c', explanation: 'A real deadline is a fact worth showing. A guess dressed as a date is not.' },
    { id: 'l5', prompt: 'How does the roadmap connect to the vision?', hint: 'st.2-1.', options: [{ id: 'a', label: 'It doesn’t' }, { id: 'b', label: 'Every item should move the 2030 story forward; anything that doesn’t comes off' }, { id: 'c', label: 'The vision is the first item in Now' }, { id: 'd', label: 'The roadmap replaces the vision' }], correct: 'b', explanation: 'The vision says where; the roadmap is the next few steps towards it.' },
  ],
};

export const st2_3: Episode = {
  lessonId: 'st.2-3',
  hook: 'Galla ticked more boxes than both rival apps. Then Ishita visited 30 shops in Aminabad and found the real rival: a ₹40 notebook.',
  scene: {
    id: 'rival-rings', duration: 36,
    beats: [
      { at: 0, title: 'The feature table', body: 'Rohan’s competitive analysis is a table: Galla, Bahi and UdhaarPe, twelve features, ticks and crosses. Galla wins on ticks. The plan: copy Bahi’s bill printing.' },
      { at: 6, title: 'Who uses them?', body: 'Ishita visits 30 shops in Aminabad. Four use any ledger app. Twenty-six keep udhaar in a paper khata.' },
      { at: 12, title: 'Start from the job', body: 'In the middle she writes Shabnam’s job: know who owes what, and get it back without losing the customer. Anything that does that job is a rival.' },
      { at: 17, title: 'Direct and indirect', body: 'Bahi and UdhaarPe are direct: apps like Galla. A UPI app’s “request money” button and a billing app with a credit tab are indirect: different products, same job.' },
      { at: 22, title: 'Substitutes', body: 'The khata, voice notes on WhatsApp, and Faiz remembering every customer. Habits, not products, and they hold most of the market.' },
      { at: 27, title: 'Not rivals', body: 'Blinkit takes her late-night customers: a threat to her shop, but not a rival for this job. The distributor’s app does a different job; supermarket billing serves different people.' },
      { at: 31, title: 'What the notebook does better', body: 'It’s free, it never needs charging, and customers trust ink. So Galla’s position: as quick as writing in the khata, and it chases payments for you.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What did the feature table miss?', options: [{ id: 'a', label: 'A column for price' }, { id: 'b', label: 'What most shops actually use: the paper khata' }, { id: 'c', label: 'More rival apps' }],
      correct: 'b', explanation: 'It compared Galla only to things that look like Galla.' },
    { id: 'c2', prompt: 'What sits at the centre of Ishita’s map?', options: [{ id: 'a', label: 'Galla’s logo' }, { id: 'b', label: 'The biggest rival' }, { id: 'c', label: 'The job: know who owes what, and get it back without losing the customer' }],
      correct: 'c', explanation: 'Rivals are defined by the job they do, not by their category.' },
  ],
  game: {
    id: 'rival-map', title: 'Map the rivals',
    instructions: 'Each card is something Shabnam could use instead of Galla. Check who it’s for, what job it does and what it is, then put it on its ring around her job.',
    lanes: [
      { id: 'direct', label: 'Direct', hint: 'A product like Galla, for the same job' },
      { id: 'indirect', label: 'Indirect', hint: 'A different product doing the same job' },
      { id: 'substitute', label: 'Substitute', hint: 'A habit or workaround doing the same job' },
      { id: 'not', label: 'Not a rival', hint: 'Different people or a different job' },
    ],
    cards: [
      { id: 'g1', label: 'Bahi, a ledger app for small shops', lane: 'direct', visual: 'bahi', note: 'Same people, same job, same kind of product. Worth knowing well, but it’s fighting over the same four shops in thirty.' },
      { id: 'g2', label: 'The paper khata on the counter', lane: 'substitute', visual: 'notebook', note: 'The biggest rival by far: 26 of 30 shops. Galla has to be as quick as writing in it before anything else matters.' },
      { id: 'g3', label: 'The “request money” button in a UPI app', lane: 'indirect', visual: 'upi', note: 'A different product doing part of the job: getting paid. Galla’s UPI link has to be as easy as this button.' },
      { id: 'g4', label: 'Blinkit and Instamart delivering in ten minutes', lane: 'not', visual: 'quick', note: 'A threat to Shabnam’s shop, not a rival for her ledger. It belongs in your research on her world, not in this map.' },
      { id: 'g5', label: 'Her son Faiz remembering who owes what', lane: 'substitute', visual: 'memory', note: 'Free and personal, until Faiz goes to college. Knowing customers by face is something Galla should support, not replace.' },
      { id: 'g6', label: 'UdhaarPe, another credit-ledger app', lane: 'direct', visual: 'udhaarpe', note: 'Direct. Its free SMS reminders work on phones without WhatsApp: a real gap in Galla’s plan.' },
      { id: 'g7', label: 'Voice notes to customers on WhatsApp', lane: 'substitute', visual: 'whatsapp', note: 'A workaround in an app she already uses all day. If Galla’s reminder feels harder than a voice note, she’ll keep sending voice notes.' },
      { id: 'g8', label: 'The distributor’s ordering app', lane: 'not', visual: 'distributor', note: 'Same shopkeeper, different job: buying stock. It might become a partner, not a rival.' },
      { id: 'g9', label: 'A billing app with a credit-sale tab', lane: 'indirect', visual: 'billing', note: 'Built for billing, but it records credit along the way. For shops that bill on a phone, it already does Galla’s job.' },
      { id: 'g10', label: 'A billing suite for supermarket chains', lane: 'not', visual: 'pos', note: 'Similar job, different people: chains with tills and GST. Shabnam would never buy it.' },
    ],
  },
  gap: {
    id: 'gap', from: 22, at: 30.6,
    prompt: 'Which rival should shape Galla’s next design decisions most?',
    options: [{ id: 'a', label: 'Bahi, because it has bill printing' }, { id: 'b', label: 'The paper khata, because it’s what 26 of 30 shops use and it’s fast, free and trusted' }, { id: 'c', label: 'Blinkit, because it’s the biggest company' }],
    correct: 'b', explanation: 'Beat the thing people actually use for the job. For Galla, that’s ink on paper.',
  },
  takeaways: [
    { title: 'Start from the job', body: 'Anything people use to get the job done is a rival, product or not.' },
    { title: 'Three rings', body: 'Direct products like yours, indirect products doing the same job, and substitutes: habits and workarounds.' },
    { title: 'Threats aren’t rivals', body: 'Something that hurts your user’s business isn’t competing for your job. Keep it in the research.' },
    { title: 'Find what they do better', body: 'For each rival, its edge and why people stay. That’s where your position comes from, not a tick table.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A paper notebook used for udhaar is a…', options: [{ id: 'a', label: 'Substitute' }, { id: 'b', label: 'Direct competitor' }], correct: 'a', explanation: 'A habit doing the same job.' },
      { id: 'q2', prompt: 'A different product that does the same job is…', options: [{ id: 'a', label: 'Not a rival' }, { id: 'b', label: 'An indirect competitor' }, { id: 'c', label: 'A substitute' }], correct: 'b', explanation: 'Different product, same job.' },
      { id: 'q3', prompt: 'What should a competitive analysis record for each rival?', options: [{ id: 'a', label: 'Only its weaknesses' }, { id: 'b', label: 'Its logo and colours' }, { id: 'c', label: 'What it does better, and why people use it' }, { id: 'd', label: 'Its share price' }], correct: 'c', explanation: 'Its strengths tell you what you must match or beat.' },
      { id: 'q4', prompt: 'When people simply don’t use anything for the job, that’s…', options: [{ id: 'a', label: 'No competition' }, { id: 'b', label: 'Non-consumption, a rival in its own right' }, { id: 'c', label: 'A bug' }, { id: 'd', label: 'A direct competitor' }], correct: 'b', explanation: 'Clayton Christensen’s term. “Do nothing” is often the hardest rival.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why is a tick-box feature table a weak competitive analysis on its own?', hint: 'What does a tick hide?', options: [{ id: 'a', label: 'Tables are hard to read' }, { id: 'b', label: 'It treats every feature as equal, only compares lookalike products, and says nothing about why people choose' }, { id: 'c', label: 'It’s too honest' }, { id: 'd', label: 'Ticks are old-fashioned' }], correct: 'b', explanation: 'It leads to copying features instead of finding where you’re better for the job.' },
    { id: 'l2', prompt: 'Where’s the best evidence for who your real rivals are?', hint: 'Ask the people doing the job.', options: [{ id: 'a', label: 'App store rankings' }, { id: 'b', label: 'Watching and asking users how they do the job today' }, { id: 'c', label: 'Rivals’ press releases' }, { id: 'd', label: 'The sales team’s guess' }], correct: 'b', explanation: 'Ishita found the khata by visiting 30 shops, not by searching the app store.' },
    { id: 'l3', prompt: 'UdhaarPe’s free SMS reminders work without WhatsApp. What should Galla do with that finding?', hint: 'Copy or understand?', options: [{ id: 'a', label: 'Copy it at once' }, { id: 'b', label: 'Ignore it; WhatsApp is everywhere' }, { id: 'c', label: 'Check how many of its shopkeepers’ customers lack WhatsApp, then decide if it matters for the job' }, { id: 'd', label: 'Complain about UdhaarPe' }], correct: 'c', explanation: 'A rival’s edge is a question for research, not an order to copy.' },
    { id: 'l4', prompt: 'After the analysis, what should Galla’s position be built on?', hint: 'Beat the main rival on what matters to the job.', options: [{ id: 'a', label: 'Having the most features' }, { id: 'b', label: 'Being the cheapest' }, { id: 'c', label: 'Being as quick as the khata to write in, and doing what it can’t: chasing payments politely' }, { id: 'd', label: 'Being the most AI-powered' }], correct: 'c', explanation: 'Match the substitute’s strength, then win where it can’t follow.' },
    { id: 'l5', prompt: 'How often should a competitive analysis be updated?', hint: 'Markets move.', options: [{ id: 'a', label: 'Once, at launch' }, { id: 'b', label: 'Regularly, and whenever research shows people doing the job a new way' }, { id: 'c', label: 'Only when a rival raises money' }, { id: 'd', label: 'Never' }], correct: 'b', explanation: 'New habits and products appear; a map from two years ago will mislead you.' },
  ],
};

