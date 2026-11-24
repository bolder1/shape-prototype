// Episodes for chapter bz.2 · Presenting & persuading. Drafts by Claude, for review.
// Saman is a B2B ordering app that 40,000 kirana shops use to restock from wholesale distributors. Neha Iyer, its
// product designer, has redesigned the restock flow and needs two engineers for six weeks. The leadership team:
// Vikram (COO), Farah (CFO), Sanjay (CTO) and Arjun (Head of Sales). The beats, objections and update lines, and the
// rules they're judged by, are in ../pitch and tested there.
import type { Episode } from '../episode';
import { SAMAN_BEATS, SAMAN_OBJECTIONS, SAMAN_UPDATE, type SamanBeat, type SamanLine, type SamanObjection } from '../pitch';

const beat = (k: SamanBeat) => SAMAN_BEATS[k].text;
const obj = (k: SamanObjection) => `${SAMAN_OBJECTIONS[k].who} (${SAMAN_OBJECTIONS[k].role}): “${SAMAN_OBJECTIONS[k].text}”`;
const line = (k: SamanLine) => SAMAN_UPDATE[k].text;

export const bz2_1: Episode = {
  lessonId: 'bz.2-1',
  hook: 'Neha had five minutes and fourteen slides. The problem was on slide twelve, and by then the COO was on his phone.',
  scene: {
    id: 'story-spine', duration: 36,
    beats: [
      { at: 0, title: 'Five minutes on Monday', body: 'Neha’s deck runs in the order the work happened: research plan, interviews, personas, three rounds of wireframes.' },
      { at: 6, title: 'The room drifts', body: 'By minute three Vikram is on his phone. “Restock takes 19 minutes” arrives at 5:30, after her time is up, and there’s no ask.' },
      { at: 11, title: 'Start with Ramesh', body: 'The rebuild opens on a person: a kirana in Indore, Sunday night, about 60 items to restock on Saman.' },
      { at: 16, title: 'The problem, inside a minute', body: '19 minutes in the app against 6 with a notebook. 38% of carts never sent: the order leaves Saman.' },
      { at: 21, title: 'The fix, through his eyes', body: 'The new flow opens on last week’s order: change a few quantities, send in three taps. In tests, 19 minutes became 4.' },
      { at: 26, title: 'End on the ask', body: 'Two engineers for six weeks from 1 December. A win means unsent carts under 20% by March.' },
      { at: 31, title: 'Process to the appendix', body: 'Under four minutes now. The affinity map and the wireframes wait at the back, ready for questions.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the first deck lose the room?', options: [{ id: 'a', label: 'The slides were ugly' }, { id: 'b', label: 'It followed the work, so the problem came last and there was no ask' }, { id: 'c', label: 'It was too short' }],
      correct: 'b', explanation: 'Leaders decide early whether to listen. The order of the work isn’t the order of the argument.' },
    { id: 'c2', prompt: 'Why open with Ramesh rather than a statistic?', options: [{ id: 'a', label: 'A real person in a real moment makes the numbers that follow mean something' }, { id: 'b', label: 'Numbers are boring' }, { id: 'c', label: 'Execs don’t trust data' }],
      correct: 'a', explanation: 'The person gives the room someone to care about; the number tells them how big it is.' },
  ],
  game: {
    id: 'story-strip', title: 'Rebuild the pitch',
    instructions: 'Each card is a beat of Neha’s new pitch. Put it on the story spine: situation, complication, resolution or ask. The strip times the pitch as it grows, against five minutes.',
    lanes: [
      { id: 'situation', label: 'Situation', hint: 'Who, and what they do today' },
      { id: 'complication', label: 'Complication', hint: 'What goes wrong, with a number' },
      { id: 'resolution', label: 'Resolution', hint: 'The design, and proof it works' },
      { id: 'ask', label: 'Ask', hint: 'The decision, and how you’ll judge it' },
    ],
    cards: [
      { id: 'g1', label: beat('carts'), lane: 'complication', visual: 'carts', note: 'The business problem in one line: orders Saman should carry are going back to the phone.' },
      { id: 'g2', label: beat('ramesh'), lane: 'situation', visual: 'ramesh', note: 'A named person and a real moment. Everyone in the room can picture Sunday night in a kirana.' },
      { id: 'g3', label: beat('ask'), lane: 'ask', visual: 'ask', note: 'Specific people, a length of time and a start date: something the room can say yes to today.' },
      { id: 'g4', label: beat('reorder'), lane: 'resolution', visual: 'reorder', note: 'The design shown through Ramesh, not as a tour of screens.' },
      { id: 'g5', label: beat('stakes'), lane: 'situation', visual: 'stakes', note: 'Why the room should care: restock is most of the money flowing through Saman.' },
      { id: 'g6', label: beat('tested'), lane: 'resolution', visual: 'tested', note: 'Evidence the fix works, in the same unit as the problem: minutes.' },
      { id: 'g7', label: beat('minutes'), lane: 'complication', visual: 'minutes', note: '19 against 6 makes the problem concrete, and it lands well inside the first minute.' },
      { id: 'g8', label: beat('measure'), lane: 'ask', visual: 'measure', note: 'Saying how you’ll judge it makes the ask safer to approve.' },
    ],
  },
  gap: {
    id: 'gap', from: 16, at: 20.6,
    prompt: 'The room knows the problem now. What should Neha show next?',
    options: [{ id: 'a', label: 'The research plan and the affinity map' }, { id: 'b', label: 'Ramesh using the new flow, and what the tests found' }, { id: 'c', label: 'All 46 screens of the prototype' }],
    correct: 'b', explanation: 'Resolution comes next, through the same person, with proof. Process waits in the appendix.',
  },
  takeaways: [
    { title: 'Their order, not yours', body: 'Don’t present the work in the order you did it.' },
    { title: 'Problem in a minute', body: 'Situation and complication before the first minute is up.' },
    { title: 'Show it through a person', body: 'The design is what changes for them, with evidence.' },
    { title: 'End on the ask', body: 'The decision you need, and how you’ll know it worked.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'The spine of a pitch is…', options: [{ id: 'a', label: 'Situation, complication, resolution, ask' }, { id: 'b', label: 'Research, wireframes, visuals' }], correct: 'a', explanation: 'Story order, not work order.' },
      { id: 'q2', prompt: 'Where do personas and wireframe rounds go?', options: [{ id: 'a', label: 'First' }, { id: 'b', label: 'The appendix, for questions' }, { id: 'c', label: 'The ask' }], correct: 'b', explanation: 'They show how you got there, not why to say yes.' },
      { id: 'q3', prompt: 'By when should the room know the problem?', options: [{ id: 'a', label: 'The last slide' }, { id: 'b', label: 'Minute three' }, { id: 'c', label: 'The first minute' }], correct: 'c', explanation: 'That’s when they decide whether to listen.' },
      { id: 'q4', prompt: 'A good ask includes…', options: [{ id: 'a', label: '“Questions?”' }, { id: 'b', label: 'People, time, a start date and a success measure' }, { id: 'c', label: 'A thank-you slide' }, { id: 'd', label: 'The full roadmap' }], correct: 'b', explanation: 'Something the room can approve today.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What’s the complication in a situation–complication–resolution story?', hint: 'The tension.', options: [{ id: 'a', label: 'The thing that goes wrong and makes the situation a problem worth solving' }, { id: 'b', label: 'The hardest slide to design' }, { id: 'c', label: 'The technical detail' }, { id: 'd', label: 'The team’s process' }], correct: 'a', explanation: 'Without it, there’s no reason to change anything.' },
    { id: 'l2', prompt: 'Why show the design through Ramesh rather than screen by screen?', hint: 'What does the room care about?', options: [{ id: 'a', label: 'Screens are confidential' }, { id: 'b', label: 'Leaders judge outcomes; a person’s before and after shows the outcome, a screen tour shows the work' }, { id: 'c', label: 'It’s shorter' }, { id: 'd', label: 'Ramesh is the CEO' }], correct: 'b', explanation: 'Before and after, through one person, is the story.' },
    { id: 'l3', prompt: 'Neha has 5 minutes. How long should she plan to talk?', hint: 'Leave room.', options: [{ id: 'a', label: 'Exactly 5 minutes' }, { id: 'b', label: 'About 4, so there’s time for questions and a late start' }, { id: 'c', label: '7, and talk fast' }, { id: 'd', label: '1' }], correct: 'b', explanation: 'Meetings start late and questions take time. The ask must not get squeezed out.' },
    { id: 'l4', prompt: 'Which number should open the complication for a CFO?', hint: 'Their units.', options: [{ id: 'a', label: 'The number of interviews run' }, { id: 'b', label: 'The 23 issues found' }, { id: 'c', label: 'The orders lost to unsent carts, in rupees' }, { id: 'd', label: 'The number of screens' }], correct: 'c', explanation: 'Translate the user problem into the money it costs.' },
    { id: 'l5', prompt: 'Before a big review, what helps the pitch most?', hint: 'No surprises.', options: [{ id: 'a', label: 'A longer deck' }, { id: 'b', label: 'Walking the key decision-maker through it one to one beforehand, so their questions come early' }, { id: 'c', label: 'Keeping it secret for impact' }, { id: 'd', label: 'Adding animations' }], correct: 'b', explanation: 'Pre-wiring turns objections into improvements before the meeting.' },
  ],
};

export const bz2_2: Episode = {
  lessonId: 'bz.2-2',
  hook: 'The CFO asked what ₹9 lakh would buy. Neha’s first answer was “good design pays for itself”, and Farah folded her arms.',
  scene: {
    id: 'objection-room', duration: 36,
    beats: [
      { at: 0, title: 'The questions start', body: 'Farah, the CFO: “Two engineers for six weeks is about ₹9 lakh. What do we get back?”' },
      { at: 6, title: 'The reflex', body: 'Neha’s first instinct: “Good design always pays for itself.” It argues with Farah, not her question. Trust drops.' },
      { at: 11, title: 'Name the worry', body: 'It’s a cost question, so answer in rupees: unsent carts are about ₹1.6 crore of orders a month. A tenth pays it back in a month.' },
      { at: 16, title: 'Risk, not resistance', body: 'Sanjay, the CTO: forty thousand shops know the old screen. Neha agrees it’s the real risk, and offers a 10% rollout with the old screen one tap away.' },
      { at: 21, title: 'What eight can show', body: 'Vikram doubts eight shopkeepers. Eight finds what’s broken; the rollout measures the size of the win, with a decision on 15 January.' },
      { at: 26, title: 'Don’t cave', body: 'Farah: one engineer? Neha shows the trade instead of agreeing: twelve weeks and a missed target, or cut bulk edit and keep six.' },
      { at: 31, title: 'A yes with a date', body: 'Approved for the 10% rollout. Review on 15 January.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What was wrong with “good design always pays for itself”?', options: [{ id: 'a', label: 'It was too long' }, { id: 'b', label: 'It defended design instead of answering a cost question in rupees' }, { id: 'c', label: 'Nothing' }],
      correct: 'b', explanation: 'A defensive reply argues with the person. The question was about money; answer with money.' },
    { id: 'c2', prompt: 'How did Neha answer the one-engineer question?', options: [{ id: 'a', label: 'She agreed straight away' }, { id: 'b', label: 'She refused' }, { id: 'c', label: 'She showed the trade-off: twelve weeks, or a smaller scope in six' }],
      correct: 'c', explanation: 'Neither caving nor digging in. Show what each choice costs and let the room decide.' },
  ],
  game: {
    id: 'objection-reply', title: 'Answer the room',
    instructions: 'Each card is an objection from Saman’s leadership team. First name the worry underneath it, then pick the reply that lands. Watch the room’s trust move.',
    lanes: [
      { id: 'cost', label: 'Cost', hint: 'Money and people' },
      { id: 'risk', label: 'Risk', hint: 'What could break' },
      { id: 'proof', label: 'Proof', hint: 'Is the evidence enough' },
      { id: 'priority', label: 'Priority', hint: 'Why this, why now' },
    ],
    cards: [
      { id: 'g1', label: obj('cost'), lane: 'cost', visual: 'cost', note: 'Acknowledge, then answer in the CFO’s units: rupees and months to pay back.' },
      { id: 'g2', label: obj('lost'), lane: 'risk', visual: 'lost', note: 'Agreeing it’s a real risk, then showing how you’ll contain it, beats telling the CTO not to worry.' },
      { id: 'g3', label: obj('eight'), lane: 'proof', visual: 'eight', note: 'Concede what the evidence can’t show, and say how you’ll get the rest. That makes the proof stronger, not weaker.' },
      { id: 'g4', label: obj('credit'), lane: 'priority', visual: 'credit', note: 'Connect your work to theirs: credit limits are worth more once orders go through the app.' },
      { id: 'g5', label: obj('december'), lane: 'risk', visual: 'december', note: 'A dated plan that avoids the peak answers the risk without dropping the project.' },
      { id: 'g6', label: obj('oneEngineer'), lane: 'cost', visual: 'oneEngineer', note: 'Show the trade-off and let them choose. Saying yes to half the people for the same result is a promise you can’t keep.' },
    ],
  },
  gap: {
    id: 'gap', from: 16, at: 20.6,
    prompt: 'Sanjay says forty thousand shops will be lost. What does Neha say first?',
    options: [{ id: 'a', label: '“Users always complain about change, then adapt.”' }, { id: 'b', label: '“That’s the risk I worry about too,” then the 10% rollout with the old screen one tap away' }, { id: 'c', label: '“Fine, let’s just change the colours.”' }],
    correct: 'b', explanation: 'Acknowledge the worry in his words, then answer it with a concrete plan.',
  },
  takeaways: [
    { title: 'Find the worry', body: 'Cost, risk, proof or priority. Answer the one they asked.' },
    { title: 'Acknowledge first', body: 'Say the concern back before answering it.' },
    { title: 'Be concrete', body: 'A number, a fact or a dated plan.' },
    { title: 'Neither defend nor cave', body: 'Show the trade-off; say “I’ll find out by Wednesday” when you don’t know.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '“Is it safe to ship in the rush?” is a…', options: [{ id: 'a', label: 'Risk worry' }, { id: 'b', label: 'Cost worry' }], correct: 'a', explanation: 'It’s about what could break.' },
      { id: 'q2', prompt: '“Finance never sees the value of UX” is…', options: [{ id: 'a', label: 'Concrete' }, { id: 'b', label: 'Defensive' }, { id: 'c', label: 'Acknowledging' }], correct: 'b', explanation: 'It attacks the person, not the point.' },
      { id: 'q3', prompt: 'You don’t know the answer. You…', options: [{ id: 'a', label: 'Guess confidently' }, { id: 'b', label: 'Change the subject' }, { id: 'c', label: 'Say so, and say when you’ll find out' }], correct: 'c', explanation: 'A wrong guess costs more trust than “I don’t know”.' },
      { id: 'q4', prompt: 'Dropping the plan the moment someone pushes back is…', options: [{ id: 'a', label: 'Good listening' }, { id: 'b', label: 'Caving' }, { id: 'c', label: 'Prioritising' }, { id: 'd', label: 'Concrete' }], correct: 'b', explanation: 'Change your plan for a reason, not for pressure.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why say the concern back before answering it?', hint: 'Are you answering their question?', options: [{ id: 'a', label: 'To buy time only' }, { id: 'b', label: 'It shows you heard it and checks you’re answering the question they actually asked' }, { id: 'c', label: 'It’s polite filler' }, { id: 'd', label: 'To repeat it for the minutes' }], correct: 'b', explanation: 'Many weak replies answer a different question.' },
    { id: 'l2', prompt: 'The Head of Sales wants a different feature first. What’s the strongest reply?', hint: 'Connect, don’t compete.', options: [{ id: 'a', label: 'Explain why sales is wrong' }, { id: 'b', label: 'Show how your work makes theirs pay off sooner, with a number' }, { id: 'c', label: 'Agree to swap' }, { id: 'd', label: 'Escalate to the CEO' }], correct: 'b', explanation: 'Credit limits only matter on orders that get sent.' },
    { id: 'l3', prompt: 'Which objections are worth preparing for before the meeting?', hint: 'Think person by person.', options: [{ id: 'a', label: 'None; it looks scripted' }, { id: 'b', label: 'The likely one from each person in the room, given what they’re measured on' }, { id: 'c', label: 'Only the CEO’s' }, { id: 'd', label: 'Only technical ones' }], correct: 'b', explanation: 'The CFO asks about money, the CTO about risk, Sales about priorities.' },
    { id: 'l4', prompt: 'Eight usability sessions are best at showing…', hint: 'Find vs. measure.', options: [{ id: 'a', label: 'The exact revenue gain' }, { id: 'b', label: 'What’s broken and whether the fix works for real users' }, { id: 'c', label: 'What all 40,000 shops will do' }, { id: 'd', label: 'Statistical significance' }], correct: 'b', explanation: 'Small tests find problems; a rollout or A/B test measures the size.' },
    { id: 'l5', prompt: 'An exec says “Let’s take this offline.” What should Neha do?', hint: 'Keep the decision alive.', options: [{ id: 'a', label: 'Nothing; it’s dead' }, { id: 'b', label: 'Agree, then book the follow-up with a date and the question it should answer' }, { id: 'c', label: 'Keep arguing in the meeting' }, { id: 'd', label: 'Email everyone the whole deck again' }], correct: 'b', explanation: 'An objection without a next step quietly becomes a no.' },
  ],
};

export const bz2_3: Episode = {
  lessonId: 'bz.2-3',
  hook: 'Neha’s update was 600 words, and the ask was in the last paragraph. Farah read the inbox preview and archived it.',
  scene: {
    id: 'bluf-email', duration: 36,
    beats: [
      { at: 0, title: 'Sent Thursday', body: 'Neha’s update tells the story of the project: research since September, the workshop, the personas. The ask is the last line.' },
      { at: 6, title: 'What Farah sees', body: 'The inbox preview: “Here’s an update on the restock research…”. No decision, no deadline. Archived.' },
      { at: 11, title: 'Bottom line up front', body: 'The rewrite opens on the decision: two engineers for six weeks from 1 December, needed by Friday.' },
      { at: 16, title: 'Why, in their units', body: '19 minutes against 6 on paper. 38% of carts never sent: ₹1.6 crore a month. Tested at 4 minutes.' },
      { at: 21, title: 'What happens next', body: '10% of shops on 6 January, a decision by 15 January, and unsent carts under 20% by March.' },
      { at: 26, title: 'Cut the method', body: 'The affinity map, the personas, the heuristics and the 46 screens: linked below, not listed.' },
      { at: 31, title: 'Read in the lift', body: '84 words, about 22 seconds to read. Farah replies from her phone: “Approved. Go.”' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the first update fail?', options: [{ id: 'a', label: 'It had a typo' }, { id: 'b', label: 'The decision was at the bottom, so the preview showed nothing worth opening' }, { id: 'c', label: 'It was sent on a Thursday' }],
      correct: 'b', explanation: 'Many leaders decide from the preview. Put the ask where they’ll see it.' },
    { id: 'c2', prompt: 'What happened to the workshop and the personas?', options: [{ id: 'a', label: 'They went first' }, { id: 'b', label: 'Linked for anyone who wants them, not in the summary' }, { id: 'c', label: 'Deleted from the project' }],
      correct: 'b', explanation: 'They’re real work, just not what the CFO needs to decide.' },
  ],
  game: {
    id: 'summary-build', title: 'Write the summary',
    instructions: 'Each card is a sentence from Neha’s long update. Put it where it belongs in the summary, or cut it. Watch the inbox preview and the reading time as the summary takes shape.',
    lanes: [
      { id: 'ask', label: 'The ask', hint: 'The decision, and by when' },
      { id: 'why', label: 'Why it’s worth it', hint: 'The problem and the proof, in their units' },
      { id: 'plan', label: 'What happens next', hint: 'Dates, and how we’ll know' },
      { id: 'cut', label: 'Cut', hint: 'They don’t need it to decide' },
    ],
    cards: [
      { id: 'g1', label: line('hello'), lane: 'cut', visual: 'hello', note: 'A warm-up line that eats the whole inbox preview. Cut it.' },
      { id: 'g2', label: line('carts'), lane: 'why', visual: 'carts', note: 'The problem in rupees: the line the CFO will remember.' },
      { id: 'g3', label: line('affinity'), lane: 'cut', visual: 'affinity', note: 'Method and jargon. If anyone asks how you know, link the research.' },
      { id: 'g4', label: line('ask'), lane: 'ask', visual: 'ask', note: 'The decision and the deadline, short enough to fit in the preview.' },
      { id: 'g5', label: line('rollout'), lane: 'plan', visual: 'rollout', note: 'A small, dated first step makes it easier to say yes.' },
      { id: 'g6', label: line('heuristic'), lane: 'cut', visual: 'heuristic', note: '“Heuristic” and “usability” mean nothing to this reader, and the count isn’t what matters. The carts line already says what it costs.' },
      { id: 'g7', label: line('minutes'), lane: 'why', visual: 'minutes', note: '19 against 6 shows the problem in one comparison anyone can feel.' },
      { id: 'g8', label: line('personas'), lane: 'cut', visual: 'personas', note: 'Useful to the team, not to the decision.' },
      { id: 'g9', label: line('tested'), lane: 'why', visual: 'tested', note: 'The evidence it works, in the same unit as the problem.' },
      { id: 'g10', label: line('figma'), lane: 'cut', visual: 'figma', note: 'The size of the prototype measures effort, not value. Link it.' },
      { id: 'g11', label: line('target'), lane: 'plan', visual: 'target', note: 'How everyone will know it worked, and when.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.6,
    prompt: 'Farah archived the update after reading the preview. How should Neha’s rewrite start?',
    options: [{ id: 'a', label: '“Following up on my last email…”' }, { id: 'b', label: '“Decision needed by Friday: two engineers for six weeks…”' }, { id: 'c', label: 'With the research timeline, but shorter' }],
    correct: 'b', explanation: 'Bottom line up front: the decision and the deadline, in the first line.',
  },
  takeaways: [
    { title: 'Bottom line up front', body: 'The decision and the deadline in the first line.' },
    { title: 'Their units', body: 'Rupees, customers, minutes, weeks. Not method names.' },
    { title: 'Next steps with dates', body: 'And how you’ll know it worked.' },
    { title: 'Half a minute', body: 'Cut the process, link the long version.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'An exec summary starts with…', options: [{ id: 'a', label: 'The decision needed' }, { id: 'b', label: 'The background' }], correct: 'a', explanation: 'Bottom line up front.' },
      { id: 'q2', prompt: '“A heuristic evaluation found usability issues” is…', options: [{ id: 'a', label: 'Perfect for a CFO' }, { id: 'b', label: 'Jargon to rewrite or cut' }, { id: 'c', label: 'The ask' }], correct: 'b', explanation: 'Say what happens to shopkeepers and the business instead.' },
      { id: 'q3', prompt: 'A good target length is about…', options: [{ id: 'a', label: '600 words' }, { id: 'b', label: 'Two pages' }, { id: 'c', label: 'What can be read in half a minute' }], correct: 'c', explanation: 'Roughly 100 words. Link the rest.' },
      { id: 'q4', prompt: 'The inbox preview shows…', options: [{ id: 'a', label: 'The whole email' }, { id: 'b', label: 'The first line or so' }, { id: 'c', label: 'The last line' }, { id: 'd', label: 'Nothing' }], correct: 'b', explanation: 'So that’s where the ask goes.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What does BLUF stand for?', hint: 'A military writing rule.', options: [{ id: 'a', label: 'Bottom line up front' }, { id: 'b', label: 'Big logo, unified font' }, { id: 'c', label: 'Brief, light, useful, friendly' }, { id: 'd', label: 'Build last, use first' }], correct: 'a', explanation: 'State the conclusion or request first, then support it.' },
    { id: 'l2', prompt: 'What makes a subject line useful?', hint: 'It works on its own.', options: [{ id: 'a', label: '“Update”' }, { id: 'b', label: '“Decision by Fri: 2 engineers for restock rebuild”' }, { id: 'c', label: '“Quick question!!”' }, { id: 'd', label: 'Leaving it blank' }], correct: 'b', explanation: 'It says what’s needed and by when, before anyone opens it.' },
    { id: 'l3', prompt: 'Neha has one strong number and four weaker ones. What goes in the summary?', hint: 'Less is louder.', options: [{ id: 'a', label: 'All five, for completeness' }, { id: 'b', label: 'The strongest one or two, in the reader’s units' }, { id: 'c', label: 'None' }, { id: 'd', label: 'Only the weakest, to be modest' }], correct: 'b', explanation: 'Extra numbers dilute the one that matters.' },
    { id: 'l4', prompt: 'Why link the full report instead of pasting it?', hint: 'Two readers.', options: [{ id: 'a', label: 'Attachments are banned' }, { id: 'b', label: 'Deciders get a short read; anyone who wants detail can still find it' }, { id: 'c', label: 'To hide the method' }, { id: 'd', label: 'Reports are always wrong' }], correct: 'b', explanation: 'The summary serves the decision; the report serves the curious.' },
    { id: 'l5', prompt: 'How do you check a summary before sending it?', hint: 'Test it like a design.', options: [{ id: 'a', label: 'Read it once yourself' }, { id: 'b', label: 'Show only the first two lines to someone outside the team and ask what you need from them' }, { id: 'c', label: 'Count the adjectives' }, { id: 'd', label: 'Send it and see' }], correct: 'b', explanation: 'If they can’t say the ask back, the preview isn’t doing its job.' },
  ],
};
