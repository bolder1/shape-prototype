// Episodes for chapter ia.5 · Complex systems & service design. Drafts by Claude, for review.
// Nabz collects blood samples at home across Hyderabad and Pune, and sells annual check-ups to employers through Nabz
// for Business. Farah Siddiqui, its lead designer, blueprints the 7 am home visit front and back stage, maps the roles
// in Tarang Software's check-up for 4,200 staff, and redesigns the screens built for a 12-person pilot that now carry
// thousands. The steps, duties and screens, and the rules they're judged by, are in ../service and tested there.
import type { Episode } from '../episode';
import {
  NABZ_DUTIES, NABZ_STEPS, NABZ_TASKS, blueprintRow, dutyOwner, scalePattern,
  type NabzDuty, type NabzStep, type NabzTask,
} from '../service';

const step = (k: NabzStep) => NABZ_STEPS[k].text;
const row = (k: NabzStep) => blueprintRow(NABZ_STEPS[k]);
const duty = (k: NabzDuty) => NABZ_DUTIES[k].text;
const owner = (k: NabzDuty) => dutyOwner(NABZ_DUTIES[k]);
const task = (k: NabzTask) => NABZ_TASKS[k].text;
const fit = (k: NabzTask) => scalePattern(NABZ_TASKS[k]);

export const ia5_1: Episode = {
  lessonId: 'ia.5-1',
  hook: 'Mr Reddy has fasted for twelve hours and the phlebotomist is 40 minutes late. The app screens are fine. Farah goes looking below them.',
  scene: {
    id: 'service-blueprint', duration: 36,
    beats: [
      { at: 0, title: '7:40, still fasting', body: 'Mr Reddy booked a 7:00 fasting test. The tracker says “12 minutes away” for the third time. One in six 7:00 visits is this late.' },
      { at: 6, title: 'The screens look fine', body: 'Booking, tracking, the report: every screen tests well. The product manager wants a better tracker. Farah draws the whole service instead.' },
      { at: 11, title: 'Four rows, three lines', body: 'What the customer does. What he sees. What staff do out of his sight. And the systems and teams behind them.' },
      { at: 16, title: 'Down the rows', body: 'The late visit was sold the night before. The slot engine counts phlebotomists on shift, not the travel between homes.' },
      { at: 21, title: 'The blind agent', body: 'He calls support. The agent can’t see Lakshmi’s route, so she guesses “on her way”. The app knows more than she does.' },
      { at: 26, title: 'Fail points', body: 'Four of them, three below the line of visibility. The sample from the first visit waits four hours at the hub.' },
      { at: 31, title: 'Fix below the line', body: 'Slots that count travel, routes the evening before, the agent sees the map. Late 7:00 visits fall from 1 in 6 to 1 in 20.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why didn’t Farah start with a better live tracker?', options: [{ id: 'a', label: 'Trackers are hard to build' }, { id: 'b', label: 'The lateness was caused below the line of visibility, by the slot engine' }, { id: 'c', label: 'Customers don’t use trackers' }],
      correct: 'b', explanation: 'The customer notices a failure frontstage. The cause is usually further down the rows.' },
    { id: 'c2', prompt: 'The WhatsApp report is sent by a system. Which row is it in?', options: [{ id: 'a', label: 'Frontstage: the customer sees it' }, { id: 'b', label: 'Support processes: a system sends it' }, { id: 'c', label: 'Backstage' }],
      correct: 'a', explanation: 'Rows follow what the customer sees, not who or what does the work.' },
  ],
  game: {
    id: 'blueprint-build', title: 'Blueprint the 7 am test',
    instructions: 'Each card is one step of Nabz’s home blood test, in time order. Put it in its row of the blueprint. Right calls pin it to the board in its column; fail points light up once they’re placed.',
    lanes: [
      { id: 'customer', label: 'Customer actions', hint: 'What Mr Reddy does' },
      { id: 'front', label: 'Frontstage', hint: 'What he sees or hears: people, screens, messages' },
      { id: 'back', label: 'Backstage', hint: 'Staff he meets, working out of his sight' },
      { id: 'support', label: 'Support processes', hint: 'Systems, teams and partners behind them' },
    ],
    cards: [
      { id: 'g1', label: step('book'), lane: row('book'), visual: 'book', note: 'His own action: the top row. Every other step on the blueprint hangs under one of these.' },
      { id: 'g2', label: step('slots'), lane: row('slots'), visual: 'slots', note: 'A system he never sees: support. And the first fail point. It sells more 7:00 visits than anyone can reach, because it ignores travel between homes.' },
      { id: 'g3', label: step('route'), lane: row('route'), visual: 'route', note: 'Lakshmi meets customers, but this happens out of sight: backstage. Getting the route at 6:15 leaves no time to fix a bad one.' },
      { id: 'g4', label: step('eta'), lane: row('eta'), visual: 'eta', note: 'Sent by a system, seen by him: frontstage. Screens and messages are touchpoints too.' },
      { id: 'g5', label: step('fasting'), lane: row('fasting'), visual: 'fasting', note: 'His action, and a wait he feels in his stomach. Mark waits on the blueprint; they’re where a service hurts.' },
      { id: 'g6', label: step('agent'), lane: row('agent'), visual: 'agent', note: 'She talks to him, so she’s frontstage. The fail point is the hand-off below her: she can’t see the route or location the app already has.' },
      { id: 'g7', label: step('draw'), lane: row('draw'), visual: 'draw', note: 'Frontstage, and physical evidence: the labelled tubes are what tells him the sample won’t be mixed up.' },
      { id: 'g8', label: step('hub'), lane: row('hub'), visual: 'hub', note: 'Contact staff out of sight: backstage. Dropping samples only after the last visit means the first one waits up to four hours.' },
      { id: 'g9', label: step('rider'), lane: row('rider'), visual: 'rider', note: 'Someone he never meets, behind the frontline staff: support.' },
      { id: 'g10', label: step('signoff'), lane: row('signoff'), visual: 'signoff', note: 'The lab and the pathologist are support processes. He only sees the result of their work.' },
      { id: 'g11', label: step('whatsapp'), lane: row('whatsapp'), visual: 'whatsapp', note: 'A system sends it, and he holds it: frontstage, and the physical evidence of the whole service.' },
      { id: 'g12', label: step('read'), lane: row('read'), visual: 'read', note: 'His action, and the end of the blueprint isn’t the end of his need. A high HbA1c with no next step is a gap worth designing for.' },
    ],
  },
  gap: {
    id: 'gap', from: 16, at: 20.6,
    prompt: 'The blueprint shows the slot engine sells 7:00 visits without counting travel time. What should Farah change first?',
    options: [{ id: 'a', label: 'A clearer tracker, so people know how late it’ll be' }, { id: 'b', label: 'The slot engine: count travel between homes before selling a slot' }, { id: 'c', label: 'A discount code for late visits' }],
    correct: 'b', explanation: 'Fix the cause below the line. A better tracker only shows the lateness more clearly.',
  },
  takeaways: [
    { title: 'Rows follow the customer’s view', body: 'Customer actions, frontstage, backstage, support. A message he sees is frontstage, whoever sends it.' },
    { title: 'Three lines', body: 'Interaction, visibility, internal interaction. Most fail points sit at hand-offs across them.' },
    { title: 'Mark fail points and waits', body: 'Build it from research and with the people who do the work, then mark where it breaks and where people wait.' },
    { title: 'Fix below the line', body: 'When the backstage works, the frontstage stops needing apologies.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'The phlebotomist plans her route on her phone before the first visit. Row?', options: [{ id: 'a', label: 'Frontstage' }, { id: 'b', label: 'Backstage' }, { id: 'c', label: 'Customer actions' }], correct: 'b', explanation: 'Contact staff, out of the customer’s sight.' },
      { id: 'q2', prompt: 'The line of visibility separates…', options: [{ id: 'a', label: 'What the customer sees from what they don’t' }, { id: 'b', label: 'Staff from systems' }, { id: 'c', label: 'Paid from free steps' }], correct: 'a', explanation: 'Above it, the customer sees it happen.' },
      { id: 'q3', prompt: 'The SMS receipt is…', options: [{ id: 'a', label: 'Physical evidence, frontstage' }, { id: 'b', label: 'A support process' }, { id: 'c', label: 'Not on a blueprint' }], correct: 'a', explanation: 'What the customer holds is part of the service.' },
      { id: 'q4', prompt: 'Most fail points sit…', options: [{ id: 'a', label: 'On the screens' }, { id: 'b', label: 'At hand-offs, often below the line of visibility' }, { id: 'c', label: 'In the customer’s actions' }], correct: 'b', explanation: 'Where work passes between people and systems.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'How is a service blueprint different from a customer journey map?', hint: 'What’s under the journey?', options: [{ id: 'a', label: 'It’s the same thing with more colour' }, { id: 'b', label: 'A journey map shows what the customer goes through; a blueprint adds what the organisation does, seen and unseen, to deliver it' }, { id: 'c', label: 'A blueprint has no customer in it' }, { id: 'd', label: 'A blueprint is only for physical stores' }], correct: 'b', explanation: 'The journey map is the top of a blueprint. The rows under it show how the service actually runs.' },
    { id: 'l2', prompt: 'Who should be in the room when Farah builds the blueprint?', hint: 'Who knows the backstage?', options: [{ id: 'a', label: 'Only designers' }, { id: 'b', label: 'Phlebotomists, support agents, dispatch and lab staff, with the research on customers' }, { id: 'c', label: 'Only the managers of each team' }, { id: 'd', label: 'Customers only' }], correct: 'b', explanation: 'The people who do the work know where it really breaks. Managers describe the process as it was designed.' },
    { id: 'l3', prompt: 'A blueprint for “every Nabz service” fills a wall and nobody uses it. What went wrong?', hint: 'What does one blueprint follow?', options: [{ id: 'a', label: 'It needed more detail' }, { id: 'b', label: 'It mixed scenarios; a useful blueprint follows one customer through one scenario' }, { id: 'c', label: 'It should have been digital' }, { id: 'd', label: 'Nothing; walls of blueprints are normal' }], correct: 'b', explanation: 'One scenario, like a fasting test at 7:00, is concrete enough to find fail points. Make more blueprints, not bigger ones.' },
    { id: 'l4', prompt: 'Samples wait up to four hours at the hub before a rider takes them. Which fix keeps the frontstage the same?', hint: 'He’d never see this one.', options: [{ id: 'a', label: 'Tell customers samples might be redrawn' }, { id: 'b', label: 'Pickups every two hours, timed to the routes, so no sample waits past its limit' }, { id: 'c', label: 'Add a tracker for samples' }, { id: 'd', label: 'Book fewer visits' }], correct: 'b', explanation: 'Many of the best service fixes are invisible to the customer: they just stop the bad outcome from happening.' },
    { id: 'l5', prompt: 'The fixes cut late 7:00 visits from 1 in 6 to 1 in 20. What should happen to the blueprint now?', hint: 'Services keep changing.', options: [{ id: 'a', label: 'Archive it: the problem is solved' }, { id: 'b', label: 'Update it to the new service, keep the fail points it still has, and revisit it when the service changes' }, { id: 'c', label: 'Print it for the office' }, { id: 'd', label: 'Delete the fail points' }], correct: 'b', explanation: 'A blueprint is a working map of how the service runs. Keep it current and it shows where the next problem is.' },
  ],
};

export const ia5_2: Episode = {
  lessonId: 'ia.5-2',
  hook: 'Tarang Software bought check-ups for 4,200 staff. The order sat for nine days, and HR asked to see who has diabetes. One product, four people, and they all need something different.',
  scene: {
    id: 'role-swimlane', duration: 36,
    beats: [
      { at: 0, title: 'Who’s the user?', body: 'Meera in HR buys it. Finance approves it. 4,200 employees get tested. Nabz’s team runs the camps. The pilot was designed for one “user”.' },
      { at: 6, title: 'One lane each', body: 'Farah draws the check-up as a swimlane: four roles, and every step in the lane of whoever owns it.' },
      { at: 11, title: 'Every arrow is a wait', body: 'Nine hand-offs from setting it up to the results. Each one is a message, a wait, and a place it can stall.' },
      { at: 16, title: 'Nine days', body: 'The ₹38 lakh order sat with an approver on leave. Nobody was told, and Meera couldn’t see where it was.' },
      { at: 21, title: 'Whose data?', body: 'A result belongs to the employee. Meera sees group numbers: 31% of 2,900 in Hyderabad. Not the six people in Kochi.' },
      { at: 26, title: 'A home for each role', body: 'Meera’s home starts with bookings and what’s waiting on her. The employee’s starts with her slot. Finance sees what needs approving.' },
      { at: 31, title: 'Designed hand-offs', body: 'A delegate after two working days, a status anyone waiting can see. The next order was approved in a day and a half.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did Tarang’s order stall for nine days?', options: [{ id: 'a', label: 'Finance said no' }, { id: 'b', label: 'The hand-off had no plan for an approver on leave, and nobody waiting could see it' }, { id: 'c', label: 'The order was too big' }],
      correct: 'b', explanation: 'Every hand-off needs a plan for when nobody acts.' },
    { id: 'c2', prompt: 'Why can’t Meera see the Kochi office’s blood-sugar count?', options: [{ id: 'a', label: 'Kochi isn’t in the programme' }, { id: 'b', label: 'In a group of six, a count points at people' }, { id: 'c', label: 'The report is too long' }],
      correct: 'b', explanation: 'Group numbers hide individuals only when the group is big enough.' },
  ],
  game: {
    id: 'role-swim', title: 'Run the check-up',
    instructions: 'Each card is a step in Tarang’s annual check-up, in workflow order. Put it in the lane of the role that owns it: who does it, or who may see it. Right calls draw it on the swimlane and count the hand-offs.',
    lanes: [
      { id: 'employee', label: 'Employee', hint: 'Her own booking, consent and results' },
      { id: 'hr', label: 'HR admin', hint: 'Runs the programme, sees group numbers' },
      { id: 'finance', label: 'Finance', hint: 'Approves spending over ₹2 lakh' },
      { id: 'nabz', label: 'Nabz team', hint: 'Camps, kits and Nabz’s doctors' },
    ],
    cards: [
      { id: 'g1', label: duty('packages'), lane: owner('packages'), visual: 'packages', note: 'Setting up the programme is HR’s job. The tests are chosen by group, not by person.' },
      { id: 'g2', label: duty('order'), lane: owner('order'), visual: 'order', note: 'Well over HR’s ₹2 lakh limit: finance signs. This is the hand-off that stalled for nine days, so it gets a delegate and a visible status.' },
      { id: 'g3', label: duty('camps'), lane: owner('camps'), visual: 'camps', note: 'Nabz’s own operations. Tarang doesn’t need to see which phlebotomist goes where, only that the camp is staffed.' },
      { id: 'g4', label: duty('slot'), lane: owner('slot'), visual: 'slot', note: 'The employee books her own slot. HR sees how many have booked, which is what the next step needs.' },
      { id: 'g5', label: duty('remind'), lane: owner('remind'), visual: 'remind', note: 'HR runs the programme, so HR sends the reminder, by rule, to everyone not booked yet.' },
      { id: 'g6', label: duty('result'), lane: owner('result'), visual: 'result', note: 'Her result is hers. Her employer never sees it, and that promise is why people turn up.' },
      { id: 'g7', label: duty('consult'), lane: owner('consult'), visual: 'consult', note: 'Only she can agree to share her results, and she can change her mind.' },
      { id: 'g8', label: duty('hydStats'), lane: owner('hydStats'), visual: 'hydStats', note: 'A group of 2,900 hides everyone in it. HR can plan a cholesterol programme from it.' },
      { id: 'g9', label: duty('kochi'), lane: owner('kochi'), visual: 'kochi', note: 'Six people is too few: a count would point at someone. HR’s report says “fewer than 10”, and Nabz’s doctors can offer the office a talk.' },
      { id: 'g10', label: duty('joiners'), lane: owner('joiners'), visual: 'joiners', note: 'Under HR’s limit, so HR adds them without waiting on anyone. Not every step needs an approval.' },
      { id: 'g11', label: duty('topup'), lane: owner('topup'), visual: 'topup', note: 'Over ₹2 lakh: back to finance. Limits decide who signs, not job titles.' },
    ],
  },
  gap: {
    id: 'gap', from: 16, at: 20.6,
    prompt: 'The approver is on leave and the order has been waiting nine days. What should the workflow do?',
    options: [{ id: 'a', label: 'Let HR approve it instead' }, { id: 'b', label: 'Remind the approver, pass it to a named delegate after two working days, and show Meera where it’s waiting' }, { id: 'c', label: 'Cancel the order and start again' }],
    correct: 'b', explanation: 'Keep the approval, and design for the day nobody acts.',
  },
  takeaways: [
    { title: 'Buyer, approver, user, operator', body: 'In B2B they’re different people with different goals. Map every role before you design a screen.' },
    { title: 'Swimlanes show the hand-offs', body: 'Each step in its owner’s lane. Every arrow between lanes is a message, a wait and a place to stall.' },
    { title: 'Plan for nobody acting', body: 'Delegates, reminders, escalation after a set time, and a status the waiting person can see.' },
    { title: 'Permissions from the data', body: 'Personal data stays with the person, small groups aren’t reported, and limits decide who signs.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'One employee’s blood result belongs to…', options: [{ id: 'a', label: 'The employee' }, { id: 'b', label: 'HR' }, { id: 'c', label: 'Whoever paid' }], correct: 'a', explanation: 'Personal data stays with the person.' },
      { id: 'q2', prompt: 'An arrow between swimlanes means…', options: [{ id: 'a', label: 'A hand-off: a message and a wait' }, { id: 'b', label: 'A screen' }, { id: 'c', label: 'A bug' }], correct: 'a', explanation: 'Work passes from one role to another.' },
      { id: 'q3', prompt: 'A ₹48,000 top-up, with HR’s limit at ₹2 lakh, is approved by…', options: [{ id: 'a', label: 'Finance' }, { id: 'b', label: 'HR' }, { id: 'c', label: 'Nabz' }], correct: 'b', explanation: 'Under the limit, HR signs.' },
      { id: 'q4', prompt: 'HR’s home screen should start with…', options: [{ id: 'a', label: 'Every feature in the product' }, { id: 'b', label: 'The work waiting for HR' }, { id: 'c', label: 'The employee’s results' }], correct: 'b', explanation: 'Each role’s home starts with what they need to do next.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why did the pilot’s single “user” design fail at Tarang?', hint: 'Who actually showed up?', options: [{ id: 'a', label: 'It was ugly' }, { id: 'b', label: 'Four roles with different goals, data and moments shared one screen designed for none of them' }, { id: 'c', label: 'The pilot was too small to learn from' }, { id: 'd', label: 'Employees didn’t want check-ups' }], correct: 'b', explanation: 'Design for each role’s job, then connect them through the workflow.' },
    { id: 'l2', prompt: 'Meera asks for “admin access to everything” to save time. What should Farah do?', hint: 'What does she actually need to do?', options: [{ id: 'a', label: 'Give it: she’s the admin' }, { id: 'b', label: 'Find the tasks behind the request and give HR what those need, without individual health data' }, { id: 'c', label: 'Refuse and say nothing' }, { id: 'd', label: 'Give it for a week' }], correct: 'b', explanation: 'Requests for more access usually hide a slow task. Fix the task; keep the data where it belongs.' },
    { id: 'l3', prompt: 'Where do B2B workflows most often stall?', hint: 'Look at the arrows.', options: [{ id: 'a', label: 'Inside one person’s screen' }, { id: 'b', label: 'At hand-offs, when the next person isn’t told, isn’t there, or doesn’t have what they need to act' }, { id: 'c', label: 'At login' }, { id: 'd', label: 'At the end of the workflow' }], correct: 'b', explanation: 'That’s why every hand-off gets a message, a fallback and a visible status.' },
    { id: 'l4', prompt: 'Why report groups of at least ten, and not just “remove names”?', hint: 'Six people in one office.', options: [{ id: 'a', label: 'Ten is a round number' }, { id: 'b', label: 'In a small group, a count alone can identify people, even with no names' }, { id: 'c', label: 'Small offices don’t matter' }, { id: 'd', label: 'The law says ten exactly' }], correct: 'b', explanation: 'Anonymity needs a crowd. The exact threshold is a policy choice; the principle isn’t.' },
    { id: 'l5', prompt: 'Nabz’s team, an HR admin and an employee all need a status for the same booking. What’s the best approach?', hint: 'Same facts, different views.', options: [{ id: 'a', label: 'One status everyone sees the same way' }, { id: 'b', label: 'One source of truth for the booking, shown to each role in the words and detail that role needs' }, { id: 'c', label: 'Separate statuses for each role, updated by hand' }, { id: 'd', label: 'No status for HR' }], correct: 'b', explanation: 'One record, many views. Separate copies drift apart; one view fits nobody.' },
  ],
};

export const ia5_3: Episode = {
  lessonId: 'ia.5-3',
  hook: 'The HR portal was designed with a 12-person pilot. Tarang has 4,200 staff, and the lab sees 9,000 samples a day. Watch every screen break at its own size.',
  scene: {
    id: 'scale-up', duration: 36,
    beats: [
      { at: 0, title: 'Designed at twelve', body: 'The pilot: twelve staff, each with a checkbox. It looked clean in every review.' },
      { at: 6, title: 'Now 4,200', body: 'Same list, ten rows a screen: 420 screens of scrolling to find one person. Search finds her in two keystrokes.' },
      { at: 11, title: 'Picking changes shape', body: 'Five slots: show them all. 23 offices: a sorted list, her own office first. 1,850 tests: search, with filters.' },
      { at: 16, title: '9,000 rows', body: 'The lab supervisor’s screen lists every sample of the day. The 40 about to miss their deadline are somewhere in it.' },
      { at: 21, title: 'Counts, then exceptions', body: 'Counts by state on top. Below, only the samples close to their deadline, most urgent first.' },
      { at: 26, title: 'Act on a rule', body: 'Reminding 1,140 people isn’t 1,140 ticks. It’s “not booked, Pune, camp on 14 March”, with a count and a preview.' },
      { at: 31, title: 'Real data, real size', body: 'Farah fills every design with the real numbers, the longest names, and the morning when 300 phlebotomists start at once.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the checkbox list stop working?', options: [{ id: 'a', label: 'Checkboxes are outdated' }, { id: 'b', label: 'It was designed for twelve items; at 4,200, scrolling becomes the work' }, { id: 'c', label: 'HR didn’t like it' }],
      correct: 'b', explanation: 'Patterns break at a size. Design for the real one.' },
    { id: 'c2', prompt: 'What does the lab supervisor see first now?', options: [{ id: 'a', label: 'All 9,000 samples, newest first' }, { id: 'b', label: 'Counts by state, then only the samples close to their deadline' }, { id: 'c', label: 'A search box' }],
      correct: 'b', explanation: 'When the job is watching, show what needs someone.' },
  ],
  game: {
    id: 'scale-dial', title: 'Size the screen',
    instructions: 'Each card is a screen at Nabz, with how many items it holds and what the person is trying to do. Choose the pattern it needs at that size. The dial runs up to the real count, and the screen draws the pattern you picked.',
    lanes: [
      { id: 'all', label: 'Show them all', hint: 'Chips or radios, up to about 7' },
      { id: 'list', label: 'A sorted list', hint: 'Likeliest first, a few dozen at most' },
      { id: 'search', label: 'Search and filter', hint: 'Picking one from hundreds or thousands' },
      { id: 'rules', label: 'Counts, exceptions, rules', hint: 'Watching or acting on many' },
    ],
    cards: [
      { id: 'g1', label: task('slots'), lane: fit('slots'), visual: 'slots', note: 'Five windows fit on one row of chips, and people compare them at a glance. Anything more is extra taps.' },
      { id: 'g2', label: task('packages'), lane: fit('packages'), visual: 'packages', note: 'Three options, side by side, with what each includes. Hiding them in a dropdown makes comparing harder.' },
      { id: 'g3', label: task('cities'), lane: fit('cities'), visual: 'cities', note: 'Fourteen is too many for chips, too few for search. A list with the city from her location first.' },
      { id: 'g4', label: task('sites'), lane: fit('sites'), visual: 'sites', note: 'Twenty-three offices: a list, her own office first from her HR record, the rest by city.' },
      { id: 'g5', label: task('tests'), lane: fit('tests'), visual: 'tests', note: 'Nobody scrolls 1,850 tests. Search that understands “sugar” and “thyroid”, plus filters by body system for people who don’t know the name.' },
      { id: 'g6', label: task('staff'), lane: fit('staff'), visual: 'staff', note: 'Ten rows a screen is 420 screens. Search by name, employee ID or phone, and she’s found in two keystrokes.' },
      { id: 'g7', label: task('route'), lane: fit('route'), visual: 'route', note: 'Eight visits, in the order she’ll do them, with the next one on top. A list is the whole job.' },
      { id: 'g8', label: task('moveDay'), lane: fit('moveDay'), visual: 'moveDay', note: 'Twelve people: select them in a list and move them. A rule would be more machinery than the job needs.' },
      { id: 'g9', label: task('samples'), lane: fit('samples'), visual: 'samples', note: 'Counts by state, then only the samples near their deadline, sorted by time left. The 9,000 stay behind a search.' },
      { id: 'g10', label: task('fleet'), lane: fit('fleet'), visual: 'fleet', note: '310 people at 7:15: counts of on time, late and not started, then the late ones by how many visits they put at risk.' },
      { id: 'g11', label: task('nudge'), lane: fit('nudge'), visual: 'nudge', note: 'A rule (not booked, by office and camp day) with a count and a preview. It keeps working as people book.' },
    ],
  },
  gap: {
    id: 'gap', from: 16, at: 20.6,
    prompt: 'The supervisor misses late samples in a 9,000-row list. What should her screen lead with?',
    options: [{ id: 'a', label: 'Pages of 50 rows' }, { id: 'b', label: 'Counts by state, then only the samples near their deadline, most urgent first' }, { id: 'c', label: 'Late rows coloured red' }],
    correct: 'b', explanation: 'Watching many is a job for counts and exceptions, not rows.',
  },
  takeaways: [
    { title: 'Patterns break at a size', body: 'About 7 to show all, a few dozen for a list, then search. Know the number before you pick.' },
    { title: 'Name the job', body: 'Picking one, watching for a few, or acting on many need different screens at the same size.' },
    { title: 'At scale, exceptions and rules', body: 'Counts first, then only what needs someone. Act on a rule with a preview, not on a thousand ticks.' },
    { title: 'Design with real data', body: 'Real counts, the longest names, the busiest morning, and the empty state too.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'Four delivery speeds to choose from. Pattern?', options: [{ id: 'a', label: 'Show them all' }, { id: 'b', label: 'Search' }, { id: 'c', label: 'A rule' }], correct: 'a', explanation: 'A handful: let people compare at a glance.' },
      { id: 'q2', prompt: '4,200 staff, ten rows a screen. Screens of scrolling?', options: [{ id: 'a', label: '42' }, { id: 'b', label: '420' }, { id: 'c', label: '4,200' }], correct: 'b', explanation: '4,200 ÷ 10 = 420.' },
      { id: 'q3', prompt: 'Messaging 1,140 people is best done…', options: [{ id: 'a', label: 'With a rule and a preview' }, { id: 'b', label: 'By ticking each one' }, { id: 'c', label: 'One page at a time' }], correct: 'a', explanation: 'State the intent once; the rule finds the people.' },
      { id: 'q4', prompt: 'A screen for watching 300 things should start with…', options: [{ id: 'a', label: 'The full list' }, { id: 'b', label: 'Counts and the exceptions' }, { id: 'c', label: 'A search box' }], correct: 'b', explanation: 'Show what needs someone first.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why did the pilot screens pass every review and still fail?', hint: 'What data was in the mockups?', options: [{ id: 'a', label: 'The reviewers were careless' }, { id: 'b', label: 'They were reviewed with small, tidy sample data, never at the size they’d carry' }, { id: 'c', label: 'Pilots always fail' }, { id: 'd', label: 'The engineers changed them' }], correct: 'b', explanation: 'Mockup data hides scale problems. Review with real numbers and the worst case.' },
    { id: 'l2', prompt: 'Search for 1,850 tests works for people who know the name. What about people who don’t?', hint: 'Not everyone knows “HbA1c”.', options: [{ id: 'a', label: 'They should ask a doctor' }, { id: 'b', label: 'Filters by body system or concern, and search that understands everyday words like “sugar”' }, { id: 'c', label: 'A list of all 1,850' }, { id: 'd', label: 'Show the ten most popular only' }], correct: 'b', explanation: 'Search for people who know what they want; browsing and synonyms for people who don’t.' },
    { id: 'l3', prompt: 'Is pagination a fix for a 9,000-row list?', hint: 'What’s the job?', options: [{ id: 'a', label: 'Yes, 50 a page is fine' }, { id: 'b', label: 'No: it splits the same pile into 180 pages. The fix is showing only what needs attention' }, { id: 'c', label: 'Yes, with infinite scroll' }, { id: 'd', label: 'Only on desktop' }], correct: 'b', explanation: 'Pagination helps loading, not finding. Change what you show, not how you slice it.' },
    { id: 'l4', prompt: 'A rule will message 1,140 people. What must the screen show before Meera sends it?', hint: 'Acting on many is risky.', options: [{ id: 'a', label: 'Nothing; rules are exact' }, { id: 'b', label: 'How many it reaches, a sample of who, and what they’ll receive' }, { id: 'c', label: 'Every name, to tick off' }, { id: 'd', label: 'A warning in red' }], correct: 'b', explanation: 'A preview makes a rule safe: she can see it’s the right people before it goes.' },
    { id: 'l5', prompt: 'Nabz expects five times the volume in two years. Which design question matters most now?', hint: 'Where do the thresholds fall?', options: [{ id: 'a', label: 'Which colour to use for late items' }, { id: 'b', label: 'Which screens cross a pattern’s size limit at five times today’s numbers, and what they’ll need then' }, { id: 'c', label: 'Whether to add dark mode' }, { id: 'd', label: 'How to make rows thinner' }], correct: 'b', explanation: 'Check each screen against its future size. The ones that will cross a threshold need the new pattern before they get there.' },
  ],
};
