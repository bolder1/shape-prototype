// Episodes for chapter ld.1 · Working in a team. Drafts by Claude, for review.
// Rasoi is a tiffin subscription in Bengaluru. Nisha Menon, its product designer, learns to work a sprint ahead and
// inside the sprint, facilitates a 90-minute workshop on why subscribers pause, and helps Vikram, the founder, run a
// design sprint on selling lunch plans to offices. The sprint items, workshop moments and questions, and the rules
// they're judged by, are in ../team and tested there.
import type { Episode } from '../episode';
import {
  RASOI_ITEMS, RASOI_MOMENTS, RASOI_QUESTIONS, ceremonyFor, moveFor, sprintCall,
  type RasoiItem, type RasoiMoment, type RasoiQuestion,
} from '../team';

const item = (k: RasoiItem) => `Day ${RASOI_ITEMS[k].day} · ${RASOI_ITEMS[k].text}`;
const meet = (k: RasoiItem) => ceremonyFor(RASOI_ITEMS[k]);
const moment = (k: RasoiMoment) => `Minute ${RASOI_MOMENTS[k].minute} · ${RASOI_MOMENTS[k].text}`;
const move = (k: RasoiMoment) => moveFor(RASOI_MOMENTS[k]);
const ask = (k: RasoiQuestion) => RASOI_QUESTIONS[k].text;
const call = (k: RasoiQuestion) => sprintCall(RASOI_QUESTIONS[k]);

export const ld1_1: Episode = {
  lessonId: 'ld.1-1',
  hook: 'Nisha spent three weeks perfecting 22 screens. On day 1 of the build, Rohan asked a question that redrew half of them.',
  scene: {
    id: 'sprint-cadence', duration: 36,
    beats: [
      { at: 0, title: 'Three weeks, then a handoff', body: 'Rasoi delivers home-style tiffins across Bengaluru. Nisha designs all of “Pause my meals” alone for three weeks, then hands over 22 finished screens.' },
      { at: 6, title: 'The surprises', body: 'Day 1 of the build: what if a pause starts after the 9 pm kitchen cut-off? Can the wallet refund mid-week? Half the screens are redrawn and the sprint slips.' },
      { at: 11, title: 'Two tracks', body: 'Next time she works in two tracks. Discovery, a sprint ahead: interviews and a tested flow. Delivery, in the sprint: questions, edge cases, checking the build.' },
      { at: 16, title: 'Stand-up', body: 'Day 2: Rohan is stuck on the cut-off. He says so at the next morning’s stand-up; Nisha and Arjun answer it by lunch.' },
      { at: 21, title: 'Refinement', body: 'Day 6: the tested flow for next sprint’s “Swap tomorrow’s meal”. Karthik spots that swaps after 9 pm can’t reach the kitchen in time, before anyone builds it.' },
      { at: 26, title: 'Review, then retro', body: 'Day 10: pausing works on staging for Vikram and Sunita from support. Then the retro: designs reach developers too late, so they’ll come to refinement first.' },
      { at: 31, title: 'Thin slices, early answers', body: 'Pausing a single day, refund included, ships this sprint; presets come later. The blockers waited four days in all, not eighteen.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the three-week handoff go wrong?', options: [{ id: 'a', label: 'The screens were badly drawn' }, { id: 'b', label: 'The people building it saw it last, when changes were most expensive' }, { id: 'c', label: 'Three weeks was too short' }],
      correct: 'b', explanation: 'Questions the developers would have asked in week one arrived after the design was finished.' },
    { id: 'c2', prompt: 'What is refinement for?', options: [{ id: 'a', label: 'Showing stakeholders what’s built' }, { id: 'b', label: 'The people who’ll build an upcoming story question and size it' }, { id: 'c', label: 'Talking about how the team works' }],
      correct: 'b', explanation: 'Karthik’s cut-off catch is refinement working: a problem found before it’s built.' },
  ],
  game: {
    id: 'ceremony-route', title: 'Where does it go?',
    instructions: 'Each card is something that comes up for Nisha during the sprint, and the day it comes up. Raise it at tomorrow’s stand-up, at refinement on day 6, at the review or the retro on day 10. The sprint calendar shows how long each one waits.',
    lanes: [
      { id: 'standup', label: 'Stand-up', hint: 'Someone is blocked today' },
      { id: 'refinement', label: 'Refinement', hint: 'A story for a later sprint' },
      { id: 'review', label: 'Sprint review', hint: 'Working software to show' },
      { id: 'retro', label: 'Retro', hint: 'How the team works' },
    ],
    cards: [
      { id: 'g1', label: item('cutoff'), lane: meet('cutoff'), visual: 'cutoff', note: 'Rohan loses a day for every day it waits. Tomorrow’s stand-up, or a message now; then Nisha and Arjun settle it straight after.' },
      { id: 'g2', label: item('swap'), lane: meet('swap'), visual: 'swap', note: 'Refinement is where the people who’ll build it ask their questions, while the flow is still cheap to change.' },
      { id: 'g3', label: item('dayone'), lane: meet('dayone'), visual: 'dayone', note: 'It’s about how the team works, so the retro. The fix they agree: designs come to refinement before planning.' },
      { id: 'g4', label: item('staging'), lane: meet('staging'), visual: 'staging', note: 'Working software is what the review is for. Vikram and Sunita try it themselves, not in a slide.' },
      { id: 'g5', label: item('refund'), lane: meet('refund'), visual: 'refund', note: 'Karthik can’t build the API without it. Raise it at stand-up, then Arjun makes the product call that day.' },
      { id: 'g6', label: item('oneday'), lane: meet('oneday'), visual: 'oneday', note: 'It changes a story that hasn’t been planned yet. Bring the finding and the split to refinement on day 6.' },
      { id: 'g7', label: item('wallet'), lane: meet('wallet'), visual: 'wallet', note: 'Nothing is blocked; Sunita wants to see it working. The review is four days away, and that’s fine.' },
      { id: 'g8', label: item('smallphone'), lane: meet('smallphone'), visual: 'smallphone', note: 'A developer waiting on design is a blocker, whatever day it is. Stand-up tomorrow, the fix agreed by noon.' },
      { id: 'g9', label: item('qalate'), lane: meet('qalate'), visual: 'qalate', note: 'A process problem. At the retro the team moves design QA inside the sprint, before release.' },
      { id: 'g10', label: item('diwali'), lane: meet('diwali'), visual: 'diwali', note: 'This sprint’s refinement has passed, and that’s fine: it isn’t blocking anyone. It goes to the next one.' },
      { id: 'g11', label: item('banner'), lane: meet('banner'), visual: 'banner', note: 'It ships tomorrow and hides the Pay button. Stand-up in the morning, if not a message tonight.' },
      { id: 'g12', label: item('kannada'), lane: meet('kannada'), visual: 'kannada', note: 'Built and working: show it at the review, where Kannada-speaking stakeholders can read it on a real phone.' },
    ],
  },
  gap: {
    id: 'gap', from: 11, at: 15.6,
    prompt: 'Day 2: Rohan can’t finish the date picker until he knows what happens after the 9 pm cut-off. What should Nisha do?',
    options: [{ id: 'a', label: 'Note it for the retro on day 10' }, { id: 'b', label: 'Hear it at the next stand-up, or sooner, and get it answered that day' }, { id: 'c', label: 'Tell Rohan to guess' }],
    correct: 'b', explanation: 'Every day a blocker waits is a developer’s day lost. The retro is for how you work, not today’s question.',
  },
  takeaways: [
    { title: 'Two tracks', body: 'Discovery a sprint ahead; delivery inside the sprint, with the people building it.' },
    { title: 'Raise it where it’s acted on', body: 'Blockers at stand-up, upcoming stories at refinement, working software at the review, process at the retro.' },
    { title: 'Bring flows to refinement', body: 'Let the people who’ll build it question a tested flow before it’s planned.' },
    { title: 'Slice thin', body: 'Each sprint ships something that works end to end for a real person.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'In dual-track agile, discovery works…', options: [{ id: 'a', label: 'About a sprint ahead of delivery' }, { id: 'b', label: 'After the feature ships' }], correct: 'a', explanation: 'So tested flows are ready when the team plans them.' },
      { id: 'q2', prompt: 'A developer is blocked on a design question. Raise it…', options: [{ id: 'a', label: 'At the retro' }, { id: 'b', label: 'At the next stand-up, or sooner' }, { id: 'c', label: 'At the review' }], correct: 'b', explanation: 'Blockers cost a day for every day they wait.' },
      { id: 'q3', prompt: 'The sprint review shows…', options: [{ id: 'a', label: 'Slides about the plan' }, { id: 'b', label: 'Figma files' }, { id: 'c', label: 'Working software, to stakeholders who try it' }], correct: 'c', explanation: 'What’s built is the evidence.' },
      { id: 'q4', prompt: 'A good first slice of a feature is…', options: [{ id: 'a', label: 'All the screens, no backend' }, { id: 'b', label: 'The backend, no screens' }, { id: 'c', label: 'Every option at once' }, { id: 'd', label: 'One small path working end to end' }], correct: 'd', explanation: 'Thin and complete beats wide and half-done.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Which of these belongs at the retro?', hint: 'How, not what.', options: [{ id: 'a', label: 'The pause banner covers Pay' }, { id: 'b', label: 'Designs keep reaching developers on day 1 of the sprint' }, { id: 'c', label: 'The refund now shows in the wallet' }, { id: 'd', label: 'A tested flow for next sprint' }], correct: 'b', explanation: 'The retro is for how the team works. The others are a blocker, a demo and a refinement item.' },
    { id: 'l2', prompt: 'Nisha’s flow for next sprint is tested. What should happen before planning?', hint: 'Who hasn’t seen it?', options: [{ id: 'a', label: 'Nothing, it’s tested' }, { id: 'b', label: 'Developers question and size it at refinement' }, { id: 'c', label: 'Vikram signs it off' }, { id: 'd', label: 'She makes it pixel-perfect first' }], correct: 'b', explanation: 'Tested with users isn’t the same as understood by the builders. Refinement finds the 9 pm problems early.' },
    { id: 'l3', prompt: 'Five interviews say most pauses are a single day. The story for next sprint assumed a week. What now?', hint: 'It isn’t planned yet.', options: [{ id: 'a', label: 'Build the week anyway, it’s agreed' }, { id: 'b', label: 'Bring the finding to refinement and split the story' }, { id: 'c', label: 'Wait until after release to mention it' }, { id: 'd', label: 'Redesign this sprint’s build' }], correct: 'b', explanation: 'Discovery is meant to change upcoming stories. That’s cheapest before they’re planned.' },
    { id: 'l4', prompt: 'The team asks Nisha to have every screen finished before a story enters a sprint. What’s the risk?', hint: 'Remember the 22 screens.', options: [{ id: 'a', label: 'None, it’s thorough' }, { id: 'b', label: 'It drifts back to a handoff: questions arrive late and the screens get redrawn' }, { id: 'c', label: 'Developers get bored' }, { id: 'd', label: 'The sprint gets shorter' }], correct: 'b', explanation: 'Ready means tested and understood, not every pixel final. Detail gets worked out with the builders.' },
    { id: 'l5', prompt: 'A stakeholder says design “slows the sprints down”. What does Nisha show them?', hint: 'Measure it.', options: [{ id: 'a', label: 'Her Figma files' }, { id: 'b', label: 'Blocked days fell from eighteen to four, and nothing was redrawn after planning' }, { id: 'c', label: 'A list of design principles' }, { id: 'd', label: 'Nothing, it’s obvious' }], correct: 'b', explanation: 'Show how the team’s flow changed, in the team’s own numbers.' },
  ],
};

export const ld1_2: Episode = {
  lessonId: 'ld.1-2',
  hook: 'Fourteen minutes in, the founder says “It’s price.” Eight people nod. Nisha has seventy-six minutes to find out what’s true.',
  scene: {
    id: 'workshop-room', duration: 36,
    beats: [
      { at: 0, title: 'A meeting with a job', body: 'Vikram asks for “a brainstorm on pauses”. Nisha asks one question back: what should we leave the room with?' },
      { at: 6, title: 'Plan back from the outputs', body: 'The top reasons people pause, from data. Two ideas to test, with owners. A parking lot, with owners. The 90 minutes are planned back from those.' },
      { at: 11, title: 'The founder goes first', body: 'Minute 14, before a single note: “It’s price. We’re too expensive.” Heads start to nod.' },
      { at: 16, title: 'Write alone', body: '“Three minutes, one reason per note, alone.” 23 notes. Price is three of them. Travel, and the same dal four days a week, are most of the rest.' },
      { at: 21, title: 'Every voice in', body: 'Round the room: Devika and Karthik on the call, then Ashok the head chef, who plans every menu. The payment gateway debate goes on the parking lot.' },
      { at: 26, title: 'Timer, then decide', body: '“Pause” or “skip”, fifteen minutes and no closer. A two-minute timer, then Vikram decides. Everyone places their dots at once.' },
      { at: 31, title: 'Two ideas, two owners', body: 'A one-day pause, owned by Nisha, and a menu that changes daily, owned by Ashok. Out at minute 90, notes sent by 6 pm.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did Nisha ask what they’d leave with before planning anything?', options: [{ id: 'a', label: 'To keep it short' }, { id: 'b', label: 'Every block of the agenda is planned to produce part of those outputs' }, { id: 'c', label: 'Vikram asked her to' }],
      correct: 'b', explanation: 'Without outputs, a workshop is a long meeting.' },
    { id: 'c2', prompt: 'What did writing alone change?', options: [{ id: 'a', label: 'Nothing, price still won' }, { id: 'b', label: 'Everyone’s reasons reached the wall before the founder’s view could shape them' }, { id: 'c', label: 'It saved time' }],
      correct: 'b', explanation: 'Price was three notes of 23. The room would never have said so aloud.' },
  ],
  game: {
    id: 'room-read', title: 'Read the room',
    instructions: 'Each card is a moment in Nisha’s 90-minute workshop. Pick her move: everyone writes alone first, go round the room, park it, or set a timer and decide. The room shows who’s been heard, and the clock shows how far over you’re running.',
    lanes: [
      { id: 'silent', label: 'Write alone first', hint: 'One view is about to set the direction' },
      { id: 'round', label: 'Go round the room', hint: 'Voices are missing' },
      { id: 'park', label: 'Park it', hint: 'Real, but not today’s goal' },
      { id: 'timebox', label: 'Timer, then decide', hint: 'Going in circles or out of time' },
    ],
    cards: [
      { id: 'g1', label: moment('price'), lane: move('price'), visual: 'price', note: 'Once the founder has said it, people agree with him. Three minutes of silent notes puts Sunita’s and Ashok’s reasons on the wall too.' },
      { id: 'g2', label: moment('muted'), lane: move('muted'), visual: 'muted', note: 'Remote people need to be asked by name. Go round, starting with the call: Devika, then Karthik.' },
      { id: 'g3', label: moment('chef'), lane: move('chef'), visual: 'chef', note: 'Ashok knows what people leave on the plate. Going round gives him a turn without putting him on the spot.' },
      { id: 'g4', label: moment('gateway'), lane: move('gateway'), visual: 'gateway', note: 'A real question, and not this one. On the parking lot with Karthik’s name on it, it gets answered, just not now.' },
      { id: 'g5', label: moment('arjun'), lane: move('arjun'), visual: 'arjun', note: 'One idea each, round the room, and Arjun goes last. Rohan and Sunita bring the two ideas nobody else had.' },
      { id: 'g6', label: moment('discount'), lane: move('discount'), visual: 'discount', note: 'The first idea said aloud shapes the rest. Four sketches each, alone, then share: the ideas spread out again.' },
      { id: 'g7', label: moment('dots'), lane: move('dots'), visual: 'dots', note: 'A vote you can watch is a vote you can follow. Everyone marks their choices, then places all the dots at once.' },
      { id: 'g8', label: moment('pauseskip'), lane: move('pauseskip'), visual: 'pauseskip', note: 'No new information is arriving. Two minutes for anyone with a new point, then the decider calls it.' },
      { id: 'g9', label: moment('bug'), lane: move('bug'), visual: 'bug', note: 'Support hears it daily, so it matters. Park it with an owner and a date, and tell Sunita when it’ll be looked at.' },
      { id: 'g10', label: moment('late'), lane: move('late'), visual: 'late', note: 'Protect the decision. Cut the discussion to five minutes so Vikram picks the two before he leaves.' },
    ],
  },
  gap: {
    id: 'gap', from: 21, at: 25.6,
    prompt: 'Fifteen minutes on whether “pause” and “skip” are one feature or two. What should Nisha do?',
    options: [{ id: 'a', label: 'Let it run, it’ll settle' }, { id: 'b', label: 'Set a two-minute timer for new points, then ask Vikram to decide' }, { id: 'c', label: 'Skip the voting to make up time' }],
    correct: 'b', explanation: 'A loop with no new information won’t settle by itself. A timer and a decider move it on.',
  },
  takeaways: [
    { title: 'Outputs first', body: 'Decide what you leave with, then plan every block back from it.' },
    { title: 'Alone, then together', body: 'Write and vote silently before discussion, so no one voice sets the direction.' },
    { title: 'Steer the room', body: 'Go round for missing voices, park tangents with an owner, timebox loops.' },
    { title: 'Same-day notes', body: 'Decisions, owners and the parking lot, sent before people forget.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A workshop agenda starts from…', options: [{ id: 'a', label: 'The outputs you need' }, { id: 'b', label: 'Your favourite activities' }], correct: 'a', explanation: 'Every block should produce part of an output.' },
      { id: 'q2', prompt: 'The most senior person shares a strong opinion first. Next…', options: [{ id: 'a', label: 'Build on it' }, { id: 'b', label: 'Everyone writes their own view alone' }, { id: 'c', label: 'Vote on it' }], correct: 'b', explanation: 'Silent writing gets past the anchor.' },
      { id: 'q3', prompt: 'A parking lot item needs…', options: [{ id: 'a', label: 'Nothing, it’s parked' }, { id: 'b', label: 'A longer discussion' }, { id: 'c', label: 'An owner, so it gets picked up after' }], correct: 'c', explanation: 'Without an owner, it’s a polite way of ignoring someone.' },
      { id: 'q4', prompt: 'Dot votes work best when…', options: [{ id: 'a', label: 'The founder votes first' }, { id: 'b', label: 'People vote one at a time, aloud' }, { id: 'c', label: 'Only designers vote' }, { id: 'd', label: 'Everyone places their dots at the same time' }], correct: 'd', explanation: 'A vote you can watch is easy to follow.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Which is a workshop output?', hint: 'Could you hold it up at the end?', options: [{ id: 'a', label: 'Alignment' }, { id: 'b', label: 'Two ideas to test, each with an owner and a date' }, { id: 'c', label: 'Energy in the room' }, { id: 'd', label: 'A good discussion' }], correct: 'b', explanation: 'You can check it’s there, and someone owns what happens next.' },
    { id: 'l2', prompt: 'Who must be in the room for the workshop to end in a decision?', hint: 'Who can say yes?', options: [{ id: 'a', label: 'Everyone in the company' }, { id: 'b', label: 'The person who can decide, and people who know the problem from different sides' }, { id: 'c', label: 'Only designers' }, { id: 'd', label: 'Whoever is free' }], correct: 'b', explanation: 'Without the decider, you leave with a recommendation. Without the range of people who know the problem, the ideas are thin.' },
    { id: 'l3', prompt: 'Why share the support tickets and pause data before the ideas round?', hint: 'What do people argue from?', options: [{ id: 'a', label: 'To fill time' }, { id: 'b', label: 'So everyone works from the same facts, not their own hunch' }, { id: 'c', label: 'To impress Vikram' }, { id: 'd', label: 'It’s tradition' }], correct: 'b', explanation: 'Shared evidence turns a debate between opinions into a discussion about data.' },
    { id: 'l4', prompt: 'Half the room is on a video call. What changes?', hint: 'Who’s easy to forget?', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'Everyone uses the same online board, and remote people are asked first by name' }, { id: 'c', label: 'Remote people just listen' }, { id: 'd', label: 'Cancel it' }], correct: 'b', explanation: 'One shared surface, and turns that start with the people who can’t catch your eye.' },
    { id: 'l5', prompt: 'The workshop picked two ideas. A week later nobody has started. What did Nisha miss?', hint: 'After minute 90.', options: [{ id: 'a', label: 'More sticky notes' }, { id: 'b', label: 'Owners with dates, and notes sent the same day' }, { id: 'c', label: 'A longer workshop' }, { id: 'd', label: 'A better icebreaker' }], correct: 'b', explanation: 'A decision without an owner and a date doesn’t get done.' },
  ],
};

export const ld1_3: Episode = {
  lessonId: 'ld.1-3',
  hook: 'Lunch plans for offices could double Rasoi, or eat a quarter of building. Vikram gets an answer in five days.',
  scene: {
    id: 'sprint-week', duration: 36,
    beats: [
      { at: 0, title: 'A big question', body: 'Should Rasoi sell lunch plans to offices? Sales want it, the kitchens are worried, and there are three ideas for pricing. Getting it wrong costs months.' },
      { at: 6, title: 'Monday: map', body: 'A long-term goal: 50 offices eating Rasoi lunches in a year. Three sprint questions. A map of the journey, and one target: the office admin signing up.' },
      { at: 11, title: 'Tuesday: sketch', body: 'Lightning demos of what others do, then everyone sketches alone. Ashok’s idea: staff pick from a weekly menu, the admin just pays.' },
      { at: 16, title: 'Wednesday: decide', body: 'Sketches on the wall, critiqued in silence. Dots make a heat map; Vikram, the decider, places his supervote. A 12-frame storyboard by evening.' },
      { at: 21, title: 'Thursday: prototype', body: 'A realistic facade in Figma: the landing page, a plan picker, the staff menu, a GST invoice. Nothing behind it, but it looks real.' },
      { at: 26, title: 'Friday: test', body: 'Five office admins from Koramangala and Whitefield try it, one at a time. The team watches next door and notes what each one does.' },
      { at: 31, title: 'Patterns', body: 'Four of five would sign up without a sales call. Four of five can’t follow per-meal pricing. Pricing gets rethought before a line of it is built.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why sketch alone on Tuesday?', options: [{ id: 'a', label: 'It’s faster' }, { id: 'b', label: 'Detailed ideas made alone beat a loud group brainstorm' }, { id: 'c', label: 'Nobody likes each other' }],
      correct: 'b', explanation: 'Ashok’s weekly menu would never have won a shouting match.' },
    { id: 'c2', prompt: 'What did Friday tell Rasoi?', options: [{ id: 'a', label: 'Ship it all' }, { id: 'b', label: 'Admins would sign up alone, but per-meal pricing confuses them' }, { id: 'c', label: 'Offices don’t want lunch' }],
      correct: 'b', explanation: 'A yes, a no, and a clear next step, in five days.' },
  ],
  game: {
    id: 'sprint-fit', title: 'Sprint, or something smaller?',
    instructions: 'Each card is a question on Rasoi’s list for the quarter. Run a five-day sprint, test one design in a few days, research the problem first, or just build it. The counter adds up the team-days each call spends before there’s an answer.',
    lanes: [
      { id: 'sprint', label: 'Design sprint', hint: 'Big, costly, many answers' },
      { id: 'test', label: 'Test one design', hint: 'Costly, one clear idea' },
      { id: 'research', label: 'Research first', hint: 'The problem isn’t understood' },
      { id: 'build', label: 'Just build it', hint: 'Cheap to undo' },
    ],
    cards: [
      { id: 'g1', label: ask('offices'), lane: call('offices'), visual: 'offices', note: 'Several teams, many possible answers, months at stake, and a problem the team understands. Worth seven people for a week.' },
      { id: 'g2', label: ask('label'), lane: call('label'), visual: 'label', note: 'Cheap to change back. Ship it and watch the taps.' },
      { id: 'g3', label: ask('pune'), lane: call('pune'), visual: 'pune', note: 'A sprint on a problem nobody understands sketches answers to the wrong question. Go and talk to Pune subscribers first.' },
      { id: 'g4', label: ask('checkout'), lane: call('checkout'), visual: 'checkout', note: 'Costly to get wrong, but there’s one design. Prototype it and test it with five people this week.' },
      { id: 'g5', label: ask('family'), lane: call('family'), visual: 'family', note: 'Three teams, three ideas, and a costly launch. A sprint makes them decide together, with Vikram in the room.' },
      { id: 'g6', label: ask('typo'), lane: call('typo'), visual: 'typo', note: 'Just fix it. A process for this would cost more than the mistake.' },
      { id: 'g7', label: ask('week2'), lane: call('week2'), visual: 'week2', note: 'You can’t map a journey you don’t know yet. Interviews and the usage data come first.' },
      { id: 'g8', label: ask('onboard'), lane: call('onboard'), visual: 'onboard', note: 'One design to check, and every new sign-up depends on it. A three-day test, not a five-day sprint.' },
      { id: 'g9', label: ask('kitchen'), lane: call('kitchen'), visual: 'kitchen', note: 'Watch a kitchen shift before designing for one. Research first.' },
      { id: 'g10', label: ask('dark'), lane: call('dark'), visual: 'dark', note: 'Behind a setting, easy to change or remove. Build it and see who turns it on.' },
    ],
  },
  gap: {
    id: 'gap', from: 26, at: 30.6,
    prompt: 'Four of five office admins couldn’t follow per-meal pricing. What should the team do?',
    options: [{ id: 'a', label: 'Ship it, five is too few to matter' }, { id: 'b', label: 'Rethink the pricing, and test the new version before anyone builds it' }, { id: 'c', label: 'Write a help article' }],
    correct: 'b', explanation: 'Three of five is a pattern; four of five is a loud one. The sprint just saved months.',
  },
  takeaways: [
    { title: 'Five days, one big question', body: 'Map, sketch, decide, prototype, test with five customers.' },
    { title: 'A decider in the room', body: 'The team votes; the decider calls it, so the week ends in a decision.' },
    { title: 'Alone, then together', body: 'Detailed sketches made alone, critiqued in silence.' },
    { title: 'Not everything needs a sprint', body: 'Research what you don’t understand, test single designs, build what’s cheap to undo.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A design sprint ends with…', options: [{ id: 'a', label: 'A prototype tested with real customers' }, { id: 'b', label: 'A finished feature' }], correct: 'a', explanation: 'An answer, not a launch.' },
      { id: 'q2', prompt: 'On Wednesday, the final call is made by…', options: [{ id: 'a', label: 'A show of hands' }, { id: 'b', label: 'The decider' }, { id: 'c', label: 'The facilitator' }], correct: 'b', explanation: 'The dots inform; the decider decides.' },
      { id: 'q3', prompt: 'Friday’s interviews are with…', options: [{ id: 'a', label: 'The team' }, { id: 'b', label: 'Fifty people in a survey' }, { id: 'c', label: 'Five real customers, one at a time' }], correct: 'c', explanation: 'Five is enough to see the big patterns.' },
      { id: 'q4', prompt: 'Nobody understands why people churn yet. Run…', options: [{ id: 'a', label: 'A sprint now' }, { id: 'b', label: 'An A/B test' }, { id: 'c', label: 'Nothing' }, { id: 'd', label: 'Research first' }], correct: 'd', explanation: 'A sprint answers a question you can already ask well.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What does Monday produce?', hint: 'Before any ideas.', options: [{ id: 'a', label: 'Sketches' }, { id: 'b', label: 'A long-term goal, sprint questions, a map and a target' }, { id: 'c', label: 'A prototype' }, { id: 'd', label: 'A roadmap' }], correct: 'b', explanation: 'Everything later is aimed at that target and those questions.' },
    { id: 'l2', prompt: 'How much prototype is enough on Thursday?', hint: 'It’s for Friday.', options: [{ id: 'a', label: 'Working code' }, { id: 'b', label: 'Paper sketches' }, { id: 'c', label: 'A realistic facade of the storyboard, nothing more' }, { id: 'd', label: 'Every screen in the product' }], correct: 'c', explanation: 'Real enough that customers react honestly; thin enough to build in a day.' },
    { id: 'l3', prompt: 'Two of five admins struggled with the staff menu, two didn’t, one never got there. What do you conclude?', hint: 'How many make a pattern?', options: [{ id: 'a', label: 'It works' }, { id: 'b', label: 'It fails' }, { id: 'c', label: 'Unclear: test that part again' }, { id: 'd', label: 'Average it' }], correct: 'c', explanation: 'Look for three of five. Below that, it’s a question for the next test.' },
    { id: 'l4', prompt: 'Vikram can only join on Monday morning. Should the sprint go ahead?', hint: 'Who decides on Wednesday?', options: [{ id: 'a', label: 'Yes, the team can decide' }, { id: 'b', label: 'Only if he names someone with full authority to decide, and keeps to their call' }, { id: 'c', label: 'Yes, he can veto it later' }, { id: 'd', label: 'Only if it’s four days' }], correct: 'b', explanation: 'A sprint without a decider ends in a recommendation that can be overturned.' },
    { id: 'l5', prompt: 'A manager wants a design sprint every fortnight, for everything. What do you tell them?', hint: 'Count the cost.', options: [{ id: 'a', label: '“Great idea”' }, { id: 'b', label: '“A sprint costs about 35 team-days. Let’s save it for big, costly decisions and use quicker tests for the rest”' }, { id: 'c', label: '“Sprints don’t work”' }, { id: 'd', label: '“Only designers should run them”' }], correct: 'b', explanation: 'The method is strong because it’s expensive. Match the tool to the size of the question.' },
  ],
};
