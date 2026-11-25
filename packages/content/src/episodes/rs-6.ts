// Episodes for chapter rs.6 · ResearchOps & strategy. Drafts by Claude, for review.
// Musafir sells seats on 2,400 private intercity bus operators in 19 states. It has nine squads and four people in
// research: Lavanya Iyer, head of research, two researchers, and Siddharth Rao, who runs ResearchOps. Lavanya turns
// an inbox of requests into a half-year roadmap tied to decisions, Siddharth breaks old decks into a repository of
// linked atoms, and together they open research up to the squads inside guardrails. The requests, notes and plans,
// and the rules they're judged by, are in ../researchops and tested there.
import type { Episode } from '../episode';
import {
  MUSAFIR_PLANS, MUSAFIR_REQUESTS, atomLane, roadmapSlot, support, MUSAFIR_ATOMS,
  type MusafirAtom, type MusafirPlan, type MusafirRequest,
} from '../researchops';

const request = (k: MusafirRequest) => MUSAFIR_REQUESTS[k].text;
const slot = (k: MusafirRequest) => roadmapSlot(MUSAFIR_REQUESTS[k]);
const atom = (k: MusafirAtom) => MUSAFIR_ATOMS[k].text;
const lane = (k: MusafirAtom) => atomLane(k);
const plan = (k: MusafirPlan) => MUSAFIR_PLANS[k].text;
const help = (k: MusafirPlan) => support(MUSAFIR_PLANS[k]);

export const rs6_1: Episode = {
  lessonId: 'rs.6-1',
  hook: 'Twenty-three requests, three researchers, six months. Lavanya stops reading the inbox and opens the company roadmap instead.',
  scene: {
    id: 'roadmap-plan', duration: 36,
    beats: [
      { at: 0, title: 'The inbox', body: 'Twenty-three research requests for January to June, from nine squads. Last year Musafir’s researchers took them in order, and the big decisions got answers too late.' },
      { at: 6, title: 'Decisions first', body: 'Lavanya lists the half’s decisions, each with an owner and a date: Musafir Pass in March, operator app v2 in May, safety features in June.' },
      { at: 11, title: 'Every request finds a decision', body: 'Or it doesn’t. Dark mode feeds no decision. Refunds were answered last August: Priya gets a link to the repository.' },
      { at: 16, title: 'Count backwards', body: 'The operator app is scoped on 17 May. The depot study takes eight weeks. So it starts by 22 March, in Q1, not in Q2.' },
      { at: 21, title: 'Three researchers', body: 'In week 17, three studies overlap: the whole team. So the seat-map question, cheap to reverse, goes to Rohan’s squad to test live.' },
      { at: 26, title: 'Later, not never', body: 'Rail tickets matter a lot, but the board decides in October. It goes into the Q3 plan, with a note to watch what Q2 learns.' },
      { at: 31, title: 'Questions and dates', body: 'The roadmap goes out as questions, the decision each one feeds, and the date it lands. It gets reviewed every six weeks.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the depot study go into Q1 when its decision is in May?', options: [{ id: 'a', label: 'Q1 had free time' }, { id: 'b', label: 'Eight weeks back from the decision date is 22 March' }, { id: 'c', label: 'Manoj asked first' }],
      correct: 'b', explanation: 'Schedule from the decision backwards. The quarter the decision sits in doesn’t matter.' },
    { id: 'c2', prompt: 'What happened to the refunds request?', options: [{ id: 'a', label: 'It got a new study' }, { id: 'b', label: 'It went to the backlog' }, { id: 'c', label: 'Priya got a link to last year’s findings in the repository' }],
      correct: 'c', explanation: 'A question that’s already answered gets a link, not a study.' },
  ],
  game: {
    id: 'roadmap-slot', title: 'Build the half',
    instructions: 'Each card is a request from Lavanya’s inbox, with the decision it feeds, when that decision is made and how long the study takes. Put it in the quarter it has to start in, the backlog, or out. The timeline shows the decision flag; the right call draws the study.',
    lanes: [
      { id: 'q1', label: 'Q1: Jan–Mar', hint: 'Must start by the end of March' },
      { id: 'q2', label: 'Q2: Apr–Jun', hint: 'Can start in April or later' },
      { id: 'backlog', label: 'Backlog', hint: 'Low stakes, or decided after June' },
      { id: 'none', label: 'Not a study', hint: 'No decision, or already answered' },
    ],
    cards: [
      { id: 'g1', label: request('pass'), lane: slot('pass'), visual: 'pass', note: 'The launch decision is in late March and pricing research takes six weeks, so it starts by 8 February. Pair the interviews with a price test; what people say they’ll pay runs high.' },
      { id: 'g2', label: request('boarding'), lane: slot('boarding'), visual: 'boarding', note: 'The ticket redesign is decided in early March. Four weeks of diary study, starting 8 February, lands just in time.' },
      { id: 'g3', label: request('operator'), lane: slot('operator'), visual: 'operator', note: 'A May decision, an eight-week study: it has to start by 22 March. The decision is in Q2; the work isn’t.' },
      { id: 'g4', label: request('women'), lane: slot('women'), visual: 'women', note: 'Ten weeks of careful, researcher-led interviews, starting in early April to land before the June call. Big, slow, and high stakes: exactly what the core team is for.' },
      { id: 'g5', label: request('ratings'), lane: slot('ratings'), visual: 'ratings', note: 'The ranking change is decided in late May. Five weeks from late April is enough, and it keeps week 17 at three studies.' },
      { id: 'g6', label: request('autopay'), lane: slot('autopay'), visual: 'autopay', note: 'A short, focused test of the renewal messages, three weeks before the June decision. Small, but money taken by surprise costs trust fast.' },
      { id: 'g7', label: request('seatmap'), lane: slot('seatmap'), visual: 'seatmap', note: 'Cheap to change and easy to test live. Rohan’s squad can run an A/B test, or five unmoderated sessions with the template, without a researcher.' },
      { id: 'g8', label: request('rail'), lane: slot('rail'), visual: 'rail', note: 'The biggest question here, decided in October. It goes into the Q3 plan, and Q1 and Q2 studies note anything about trips that mix bus and train.' },
      { id: 'g9', label: request('refunds'), lane: slot('refunds'), visual: 'refunds', note: 'Last August’s interviews and 1,400 tagged tickets already answer it: people can’t see when their money will arrive. Send Priya the link, not a study.' },
      { id: 'g10', label: request('darkmode'), lane: slot('darkmode'), visual: 'darkmode', note: 'Nobody is deciding anything that depends on the answer. If Android wants to build it, that’s a product call, and usage after launch will say whether it was used.' },
    ],
  },
  gap: {
    id: 'gap', from: 16, at: 20.6,
    prompt: 'Operator app v2 is scoped on 17 May. The depot study takes eight weeks. Where does Lavanya put it?',
    options: [{ id: 'a', label: 'In Q2, with the decision' }, { id: 'b', label: 'In Q1: it has to start by 22 March to land in time' }, { id: 'c', label: 'In the backlog until someone asks again' }],
    correct: 'b', explanation: 'Count back from the decision. Research that lands after the decision is a history lesson.',
  },
  takeaways: [
    { title: 'Start from decisions', body: 'List the half’s decisions with owners and dates. Requests attach to one, or get a no.' },
    { title: 'Answered gets a link', body: 'Check the repository before you plan a study. Low-stakes questions go to the squad.' },
    { title: 'Schedule backwards', body: 'Start date = decision date minus the study’s length. A May decision can need February fieldwork.' },
    { title: 'Plan the load', body: 'No more studies at once than researchers, a fifth of the time free, and a review every six weeks.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'A request ties to no decision. It…', options: [{ id: 'a', label: 'Goes to the backlog' }, { id: 'b', label: 'Isn’t a study, for now' }, { id: 'c', label: 'Goes first' }], correct: 'b', explanation: 'Research that can’t change a decision can wait for one.' },
      { id: 'q2', prompt: 'Decision in week 20, a 6-week study. Latest start?', options: [{ id: 'a', label: 'Week 14' }, { id: 'b', label: 'Week 20' }, { id: 'c', label: 'Week 26' }], correct: 'a', explanation: '20 − 6 = 14.' },
      { id: 'q3', prompt: 'A roadmap is best published as…', options: [{ id: 'a', label: 'A list of methods' }, { id: 'b', label: 'Questions, decisions and dates' }, { id: 'c', label: 'A Gantt chart of interviews' }], correct: 'b', explanation: 'Stakeholders care what you’ll learn and when, not how.' },
      { id: 'q4', prompt: 'A decision is cheap to reverse and easy to test live. The research…', options: [{ id: 'a', label: 'Needs a big study' }, { id: 'b', label: 'Can be the live test, run by the squad' }, { id: 'c', label: 'Isn’t needed ever' }], correct: 'b', explanation: 'Save the core team for decisions that are hard to undo.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What’s wrong with taking research requests in the order they arrive?', hint: 'Who gets served?', options: [{ id: 'a', label: 'Nothing, it’s fair' }, { id: 'b', label: 'The team serves whoever asked first, and big decisions get answers too late' }, { id: 'c', label: 'It’s too slow to type' }, { id: 'd', label: 'Requests are always bad' }], correct: 'b', explanation: 'A queue optimises for the requester. A roadmap optimises for the company’s decisions.' },
    { id: 'l2', prompt: 'Why keep about a fifth of the research time unplanned?', hint: 'What happens in March that nobody planned in January?', options: [{ id: 'a', label: 'For holidays' }, { id: 'b', label: 'For urgent questions nobody saw coming, without wrecking the plan' }, { id: 'c', label: 'To look less busy' }, { id: 'd', label: 'For training' }], correct: 'b', explanation: 'Without slack, every surprise pushes a planned study past its decision.' },
    { id: 'l3', prompt: 'Rail tickets are a huge question, decided in October. Why isn’t it on the January–June plan?', hint: 'When does it need to land?', options: [{ id: 'a', label: 'It’s too big for research' }, { id: 'b', label: 'Its decision is outside the half; it goes in the Q3 plan, and current studies note anything relevant' }, { id: 'c', label: 'The CEO’s office should do it' }, { id: 'd', label: 'It should start immediately' }], correct: 'b', explanation: 'Plan to the decision. Starting now would mean stale findings by October.' },
    { id: 'l4', prompt: 'Four studies would overlap in week 17 with three researchers. Which is the best move?', hint: 'Which one can someone else run?', options: [{ id: 'a', label: 'Cancel the newest' }, { id: 'b', label: 'Give the low-stakes, testable question to the squad to run with support' }, { id: 'c', label: 'Ask researchers to run two each' }, { id: 'd', label: 'Delay all four a week' }], correct: 'b', explanation: 'Keep researchers on the hard, high-stakes work. A live test can answer a reversible question.' },
    { id: 'l5', prompt: 'The Pass launch moves from March to May. What should happen to the roadmap?', hint: 'It’s a living plan.', options: [{ id: 'a', label: 'Nothing until the next half' }, { id: 'b', label: 'Re-slot the Pass study against the new date at the six-weekly review, and use the freed weeks' }, { id: 'c', label: 'Finish the study early anyway' }, { id: 'd', label: 'Cancel it' }], correct: 'b', explanation: 'Decisions move, so the roadmap moves with them. That’s what the review is for.' },
  ],
};

export const rs6_2: Episode = {
  lessonId: 'rs.6-2',
  hook: 'Priya asks why people call about refunds. Musafir has answered that twice before, in decks nobody can find. Siddharth starts cutting them into pieces.',
  scene: {
    id: 'atom-repo', duration: 36,
    beats: [
      { at: 0, title: 'The third time', body: 'A 46-slide deck from 2025. Another from last August. Both answer “why do people call about refunds?” Nobody could find either.' },
      { at: 6, title: 'Cut into facts', body: 'Siddharth breaks each study into facts: one thing seen or heard, with its study, participant and date. “7 of 12 didn’t know when the money would arrive.”' },
      { at: 11, title: 'Insights link facts', body: 'A fact from the interviews and one from support tickets point the same way. Two studies: now it’s an insight.' },
      { at: 16, title: 'Recommendations link insights', body: '“Show the date the refund will arrive.” It links to the insight, so anyone can follow it down to the people who said it.' },
      { at: 21, title: 'One study isn’t enough', body: '“Travellers trust a call more than a map” rests on one diary study. It waits for a second source.' },
      { at: 26, title: 'Search, ten seconds', body: 'Priya types “refund”. Two facts, one insight, one recommendation, and the studies behind them.' },
      { at: 31, title: 'It gets stronger', body: 'A new study adds a fact, and it links to the same insight. The repository grows by connection, not by more decks.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'When did the refund note become an insight?', options: [{ id: 'a', label: 'When Siddharth wrote it down' }, { id: 'b', label: 'When facts from two different studies backed it' }, { id: 'c', label: 'When a PM liked it' }],
      correct: 'b', explanation: 'One study is a lead. Two that agree make an insight worth storing.' },
    { id: 'c2', prompt: 'Why can Priya trust the recommendation she found?', options: [{ id: 'a', label: 'It’s in the repository' }, { id: 'b', label: 'She can follow its links down to the facts and studies underneath' }, { id: 'c', label: 'A researcher wrote it' }],
      correct: 'b', explanation: 'Traceability is what separates a repository from a pile of opinions.' },
  ],
  game: {
    id: 'atom-build', title: 'Build the repository',
    instructions: 'Each card is a note from Musafir’s old decks. File it as a fact, an insight or a recommendation, or send it back to fix. Right calls add it to the graph and link it to what it rests on, so you can see each recommendation’s evidence build up.',
    lanes: [
      { id: 'fact', label: 'Fact', hint: 'One observation, with its source' },
      { id: 'insight', label: 'Insight', hint: 'What facts from two studies mean' },
      { id: 'rec', label: 'Recommendation', hint: 'An action resting on an insight' },
      { id: 'fix', label: 'Fix it first', hint: 'No source, two in one, or too thin' },
    ],
    cards: [
      { id: 'g1', label: atom('whenMoney'), lane: lane('whenMoney'), visual: 'whenMoney', note: 'One observation, counted, from the refund interviews. A fact: tag it “cancellation” and “refund”.' },
      { id: 'g2', label: atom('where48'), lane: lane('where48'), visual: 'where48', note: 'From 1,400 tagged support tickets. A different study saying something close to the interviews: that’s what an insight needs.' },
      { id: 'g3', label: atom('hate'), lane: lane('hate'), visual: 'hate', note: 'Who said it, where, and when? With no source it’s an opinion. Find the quotes behind it, or leave it out.' },
      { id: 'g4', label: atom('uncertain'), lane: lane('uncertain'), visual: 'uncertain', note: 'It rests on facts from the interviews and the tickets. Two studies agree, so it goes in as an insight.' },
      { id: 'g5', label: atom('refundDate'), lane: lane('refundDate'), visual: 'refundDate', note: 'It links to the insight about not knowing when money arrives, which links to two studies. Anyone can follow it down.' },
      { id: 'g6', label: atom('chatbot'), lane: lane('chatbot'), visual: 'chatbot', note: 'Nothing under it: no insight says people want to chat. If anything, the evidence says they want a date, not a conversation.' },
      { id: 'g7', label: atom('landmarkSent'), lane: lane('landmarkSent'), visual: 'landmarkSent', note: 'Counted, from the diary study. A fact.' },
      { id: 'g8', label: atom('landmarkTicket'), lane: lane('landmarkTicket'), visual: 'landmarkTicket', note: 'From support tickets, pointing the same way as the diary. A second study.' },
      { id: 'g9', label: atom('landmarks'), lane: lane('landmarks'), visual: 'landmarks', note: 'Backed by the diary study and the tickets. An insight, and one the boarding redesign can stand on.' },
      { id: 'g10', label: atom('callDriver'), lane: lane('callDriver'), visual: 'callDriver', note: 'Plausible, but it rests on one diary study of nine people. Keep it as a lead until a second study backs it.' },
      { id: 'g11', label: atom('landmarkLine'), lane: lane('landmarkLine'), visual: 'landmarkLine', note: 'It rests on the landmark insight, which rests on two studies. A recommendation the ticket squad can trace.' },
      { id: 'g12', label: atom('majestic'), lane: lane('majestic'), visual: 'majestic', note: 'Two notes in one. Split it: the fact (P4 walked round Majestic for 25 minutes) and, separately, a recommendation linked to the landmark insight.' },
    ],
  },
  gap: {
    id: 'gap', from: 21, at: 25.6,
    prompt: '“Travellers trust a call to the driver more than any map” comes from one diary study of nine people. Does it go in as an insight?',
    options: [{ id: 'a', label: 'Yes: it’s clearly true' }, { id: 'b', label: 'Not yet: keep its fact, and wait for a second study to back it' }, { id: 'c', label: 'No: delete it' }],
    correct: 'b', explanation: 'The fact goes in with its source. The interpretation waits for a second study, so the insights stay trustworthy.',
  },
  takeaways: [
    { title: 'Reports die, atoms travel', body: 'Break every study into small notes someone can find and reuse.' },
    { title: 'Three levels, linked', body: 'Facts with sources, insights that rest on facts, recommendations that rest on insights.' },
    { title: 'Two studies for an insight', body: 'One study is a lead. Store the fact and wait.' },
    { title: 'Links make it trusted', body: 'Anyone can follow a recommendation down to the people it came from, and new facts strengthen or challenge it.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: '“P7 gave up at the payment step on a Jio phone.” This is…', options: [{ id: 'a', label: 'A fact' }, { id: 'b', label: 'An insight' }, { id: 'c', label: 'A recommendation' }], correct: 'a', explanation: 'One thing seen, with a participant.' },
      { id: 'q2', prompt: '“Add a progress bar to checkout.” This is…', options: [{ id: 'a', label: 'A fact' }, { id: 'b', label: 'A recommendation' }, { id: 'c', label: 'An insight' }], correct: 'b', explanation: 'It says what to do.' },
      { id: 'q3', prompt: 'A note says “P2 was confused, so simplify the form.” You should…', options: [{ id: 'a', label: 'Store it as it is' }, { id: 'b', label: 'Split it into a fact and a recommendation' }, { id: 'c', label: 'Delete it' }], correct: 'b', explanation: 'One kind of thing per note.' },
      { id: 'q4', prompt: 'A repository without an owner tends to…', options: [{ id: 'a', label: 'Stay tidy' }, { id: 'b', label: 'Turn into a folder of decks again' }, { id: 'c', label: 'Grow insights by itself' }], correct: 'b', explanation: 'Tags drift and links break without someone tending it.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why does atomic research store facts separately from insights?', hint: 'What can change?', options: [{ id: 'a', label: 'It’s tidier' }, { id: 'b', label: 'The same facts can support new insights later, and an insight can be re-checked against its facts' }, { id: 'c', label: 'Facts are more important' }, { id: 'd', label: 'Tools need it' }], correct: 'b', explanation: 'Interpretations change; observations don’t. Keeping them apart lets both be reused and tested.' },
    { id: 'l2', prompt: 'A new survey contradicts a stored insight. What should happen?', hint: 'Evidence goes in, not out.', options: [{ id: 'a', label: 'Delete the insight' }, { id: 'b', label: 'Ignore the survey' }, { id: 'c', label: 'Link the new fact as contradicting, and flag the insight for review' }, { id: 'd', label: 'Make a new repository' }], correct: 'c', explanation: 'An insight is a claim that keeps being tested.' },
    { id: 'l3', prompt: 'The consent form said recordings are kept for 12 months. What does that mean for the repository?', hint: 'Facts and raw data aren’t the same thing.', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'Delete the recordings at 12 months; the facts, without personal details, can stay' }, { id: 'c', label: 'Delete every fact from that study' }, { id: 'd', label: 'Keep everything, it’s internal' }], correct: 'b', explanation: 'Respect what people agreed to. Anonymised facts keep the learning without the personal data.' },
    { id: 'l4', prompt: 'Which tag helps a PM most when searching the repository?', hint: 'How do PMs think?', options: [{ id: 'a', label: 'The researcher’s name' }, { id: 'b', label: 'The journey stage and product area, like “cancellation · refunds”' }, { id: 'c', label: 'The file type' }, { id: 'd', label: 'The month of the study' }], correct: 'b', explanation: 'Tag by where people are and what they’re doing, the way squads look for things.' },
    { id: 'l5', prompt: 'Two years in, the repository has 4,000 facts and nobody uses it. The most likely cause?', hint: 'Finding vs. storing.', options: [{ id: 'a', label: 'Too few facts' }, { id: 'b', label: 'Everything was stored, but few insights or recommendations link it up, so searching returns a pile' }, { id: 'c', label: 'The tool is wrong' }, { id: 'd', label: 'PMs don’t read' }], correct: 'b', explanation: 'Facts alone are a heap. The linked insights and recommendations are what people come for.' },
  ],
};

export const rs6_3: Episode = {
  lessonId: 'rs.6-3',
  hook: 'A PM’s phone recordings turn up in a WhatsApp group. Lavanya could ban squads from research. She builds them a guardrail instead.',
  scene: {
    id: 'research-guardrails', duration: 36,
    beats: [
      { at: 0, title: 'Nine squads, three researchers', body: 'Sixty requests a quarter, and researchers can run about twelve studies. Squads have started talking to travellers on their own.' },
      { at: 6, title: 'The clips', body: 'Traveller calls, recorded on a PM’s own phone, shared in the squad’s WhatsApp group. Nobody agreed to that.' },
      { at: 11, title: 'Not a ban', body: 'A ban would just hide the research. Lavanya has the clips deleted and makes the approved way easier than the phone.' },
      { at: 16, title: 'The kit', body: 'Siddharth builds it: a research panel with consent built in, templates for tests and interviews, a two-hour course, and office hours every Thursday.' },
      { at: 21, title: 'Four levels', body: 'Go with the templates. A researcher reviews first. A researcher leads or pairs. Or it doesn’t run.' },
      { at: 26, title: 'The hard ones', body: 'Calls with women who reported harassment: a researcher leads, with a counsellor’s number ready and the right to stop at any time.' },
      { at: 31, title: 'A quarter later', body: 'Squads ran 41 studies. Researchers spent their weeks on the six that needed them most.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why didn’t Lavanya ban squads from research after the clips?', options: [{ id: 'a', label: 'She didn’t have the authority' }, { id: 'b', label: 'A ban drives research underground; a safe, easy way stops the harm' }, { id: 'c', label: 'The clips were useful' }],
      correct: 'b', explanation: 'Make the right way the easy way, and squads use it.' },
    { id: 'c2', prompt: 'Why did a researcher lead the harassment calls?', options: [{ id: 'a', label: 'The squad was busy' }, { id: 'b', label: 'Participants could be hurt by taking part, so it needs care and experience' }, { id: 'c', label: 'It was a survey' }],
      correct: 'b', explanation: 'Who could be hurt decides the level, before the method does.' },
  ],
  game: {
    id: 'plan-critique', title: 'Review the plans',
    instructions: 'Each card is a research plan a squad sent in: who’s running it, how, with whom, and what rides on it. Decide what support it gets. The right call puts the red pen on the line that decided it.',
    lanes: [
      { id: 'go', label: 'Go ahead', hint: 'Templates and office hours' },
      { id: 'review', label: 'Review first', hint: 'A researcher checks the guide or sample' },
      { id: 'partner', label: 'Researcher leads', hint: 'Big open question, or people at risk' },
      { id: 'stop', label: 'Stop', hint: 'Breaks consent or data rules' },
    ],
    cards: [
      { id: 'g1', label: plan('seatTest'), lane: help('seatTest'), visual: 'seatTest', note: 'Low stakes, its own design, people who agreed to research, and a template. This is what the program is for. Go.' },
      { id: 'g2', label: plan('depotWatch'), lane: help('depotWatch'), visual: 'depotWatch', note: 'Watching people use a screen, with signed consent and the template. Go, and drop the notes into the repository.' },
      { id: 'g3', label: plan('passCheckout'), lane: help('passCheckout'), visual: 'passCheckout', note: 'A usability test the squad can run, but money and a launch ride on it. A researcher checks the tasks and the script first.' },
      { id: 'g4', label: plan('priceSurvey'), lane: help('priceSurvey'), visual: 'priceSurvey', note: 'A researcher checks the sample and the questions before it goes. People overstate what they’ll pay, so pair it with a live price test.' },
      { id: 'g5', label: plan('cancelChats'), lane: help('cancelChats'), visual: 'cancelChats', note: 'Interviews are easy to lead by accident. A researcher reviews the guide, then support runs them.' },
      { id: 'g6', label: plan('railInterviews'), lane: help('railInterviews'), visual: 'railInterviews', note: 'A huge open question, and eight interviews can’t settle it alone. A researcher designs it, alongside market data.' },
      { id: 'g7', label: plan('harassment'), lane: help('harassment'), visual: 'harassment', note: 'Taking part could hurt. A researcher leads, with clear consent, the right to stop, and a counsellor’s number ready.' },
      { id: 'g8', label: plan('drivers'), lane: help('drivers'), visual: 'drivers', note: 'Drivers could lose work for what they say. A researcher runs it away from the depot and the manager, and keeps answers anonymous.' },
      { id: 'g9', label: plan('phoneClips'), lane: help('phoneClips'), visual: 'phoneClips', note: 'No consent, a personal phone, a WhatsApp group. Delete the clips, and give the squad an approved recorder that’s easier to use.' },
      { id: 'g10', label: plan('coldCalls'), lane: help('coldCalls'), visual: 'coldCalls', note: 'People gave their numbers to book a bus, not for research. Recruit from the panel, where people agreed to be contacted.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.6,
    prompt: 'The clips are useful, and nobody agreed to be recorded. What should Lavanya do?',
    options: [{ id: 'a', label: 'Ban squads from talking to travellers' }, { id: 'b', label: 'Have the clips deleted, and make the approved way to record easier than a phone' }, { id: 'c', label: 'Keep the clips, but don’t share them further' }],
    correct: 'b', explanation: 'Stop the harm, then remove the reason it happened. A ban only hides the next one.',
  },
  takeaways: [
    { title: 'Guardrails, not gates', body: 'Training, templates, a consented panel and office hours let squads learn fast and safely.' },
    { title: 'Consent and data first', body: 'A plan that breaks them doesn’t run, however useful the answers would be.' },
    { title: 'Who could be hurt', body: 'Sensitive participants get a researcher, whatever the method.' },
    { title: 'Match help to stakes', body: 'Low-stakes tests go; surveys, interviews and big decisions get a review or a researcher.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'A squad tests its prototype with five panel members, using the template. It…', options: [{ id: 'a', label: 'Goes ahead' }, { id: 'b', label: 'Needs a researcher to lead' }, { id: 'c', label: 'Stops' }], correct: 'a', explanation: 'Low stakes, its own design, consented people.' },
      { id: 'q2', prompt: 'A squad wants to survey 5,000 people to set a price. It…', options: [{ id: 'a', label: 'Goes ahead' }, { id: 'b', label: 'Gets a review of the sample and questions first' }, { id: 'c', label: 'Stops' }], correct: 'b', explanation: 'Surveys are easy to get wrong, and money rides on this one.' },
      { id: 'q3', prompt: 'Booking data used to cold-call people for research is…', options: [{ id: 'a', label: 'Fine, it’s our data' }, { id: 'b', label: 'Not what people agreed to' }, { id: 'c', label: 'Fine if it’s short' }], correct: 'b', explanation: 'Use data for the purpose people gave it.' },
      { id: 'q4', prompt: 'The first question in any plan review is…', options: [{ id: 'a', label: 'What method?' }, { id: 'b', label: 'Consent and data' }, { id: 'c', label: 'How many people?' }], correct: 'b', explanation: 'It’s the only one that stops a plan outright.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What’s the main argument for letting squads run research?', hint: 'Who learns, and how fast?', options: [{ id: 'a', label: 'It saves money on researchers' }, { id: 'b', label: 'Squads that watch people use their work learn faster, and researchers can focus on hard questions' }, { id: 'c', label: 'Research is easy' }, { id: 'd', label: 'Researchers want less work' }], correct: 'b', explanation: 'It spreads learning; it doesn’t replace expertise.' },
    { id: 'l2', prompt: 'Which risk grows most when non-researchers run interviews?', hint: 'Think about the questions.', options: [{ id: 'a', label: 'Too many insights' }, { id: 'b', label: 'Leading questions and picking people who already agree, then deciding on it' }, { id: 'c', label: 'Running out of participants' }, { id: 'd', label: 'Using the wrong tool' }], correct: 'b', explanation: 'That’s why interview guides get a review before they run.' },
    { id: 'l3', prompt: 'Drivers will be interviewed at the depot with a manager nearby. Why is that a researcher-led study?', hint: 'What could happen to them?', options: [{ id: 'a', label: 'Drivers are hard to recruit' }, { id: 'b', label: 'Drivers could be punished for what they say, so it needs privacy, anonymity and care' }, { id: 'c', label: 'It’s generative' }, { id: 'd', label: 'Depots are far away' }], correct: 'b', explanation: 'Power over participants makes a study sensitive, even when the topic sounds ordinary.' },
    { id: 'l4', prompt: 'Squads ran 41 studies last quarter. How does Lavanya know the program is working, not just busy?', hint: 'Quality, not count.', options: [{ id: 'a', label: 'More studies is always better' }, { id: 'b', label: 'Sample a few each quarter: guide quality, consent records, and whether findings reached the repository and a decision' }, { id: 'c', label: 'Ask squads if they liked it' }, { id: 'd', label: 'Count the templates used' }], correct: 'b', explanation: 'Audit a sample. Count of studies is an output; good decisions are the outcome.' },
    { id: 'l5', prompt: 'A squad keeps running high-stakes interviews without a review. What does Lavanya do first?', hint: 'Why are they skipping it?', options: [{ id: 'a', label: 'Revoke their panel access' }, { id: 'b', label: 'Find out why: if review is slow, fix the review, then hold them to it' }, { id: 'c', label: 'Ignore it' }, { id: 'd', label: 'Escalate to the CEO' }], correct: 'b', explanation: 'Guardrails people skip are usually too slow. Make the safe path quick, then enforce it.' },
  ],
};
