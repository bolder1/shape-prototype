// Episodes for chapter ld.4 · DesignOps. Drafts by Claude, for review.
// Saathi is a Hyderabad healthtech: a patient app, a doctor app and a portal for 2,600 partner pharmacies, with 38
// designers in 11 squads. Megha Pillai, its first DesignOps lead, finds where design requests wait and fixes them in
// order, replaces an activity dashboard with a health check read for trends, and shapes the org as hub and spoke.
// This chapter is for design managers and DesignOps leads, and it closes the curriculum. Data and rules: ../designops.
import type { Episode } from '../episode';
import {
  SAATHI_PROBLEMS, SAATHI_READINGS, SAATHI_STEPS, flowFix, healthCall, orgFix,
  type SaathiProblem, type SaathiReading, type SaathiStep,
} from '../designops';

const step = (k: SaathiStep) => SAATHI_STEPS[k].text;
const fix = (k: SaathiStep) => flowFix(SAATHI_STEPS[k]);
const reading = (k: SaathiReading) => SAATHI_READINGS[k].text;
const hcall = (k: SaathiReading) => healthCall(SAATHI_READINGS[k]);
const problem = (k: SaathiProblem) => SAATHI_PROBLEMS[k].text;
const home = (k: SaathiProblem) => orgFix(SAATHI_PROBLEMS[k]);

export const ld4_1: Episode = {
  lessonId: 'ld.4-1',
  hook: 'A design request takes 27 working days, and someone works on it for five and a half of them. Watch Megha find the other three weeks.',
  scene: {
    id: 'wait-time', duration: 36,
    beats: [
      { at: 0, title: 'One request, 27 days', body: 'From the first ask to live in the patient app.' },
      { at: 6, title: 'Mostly waiting', body: '44 hours of work, 170 hours sitting in queues. Flow efficiency: 21%.' },
      { at: 11, title: 'Remove first', body: 'A sign-off that never says no, redlines nobody opens, a second tracker.' },
      { at: 16, title: 'Unblock the queues', body: 'One accessibility reviewer for 38 designers. Five requests open at once.' },
      { at: 21, title: 'Then standardise', body: 'One file template, one meaning of “ready for dev”, one tool per job.' },
      { at: 26, title: 'Automate what’s left', body: 'Tokens, handoff tickets and screenshot checks, without a person copying.' },
      { at: 31, title: '6 days', body: 'Half the work, a seventh of the waiting, and 47% efficiency.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Where did most of the 27 days go?', options: [{ id: 'a', label: 'Designers working slowly' }, { id: 'b', label: 'Waiting between steps: queues, gates and meetings' }, { id: 'c', label: 'Engineering' }],
      correct: 'b', explanation: '170 of 214 hours were waiting.' },
    { id: 'c2', prompt: 'Why does Megha remove steps before automating anything?', options: [{ id: 'a', label: 'Automation is expensive' }, { id: 'b', label: 'Automating a step that changes nothing just makes the waste faster' }, { id: 'c', label: 'Engineers are busy' }],
      correct: 'b', explanation: 'Remove, unblock, standardise, then automate.' },
  ],
  game: {
    id: 'flow-fix', title: 'Fix the flow',
    instructions: 'Each card is a step where Saathi’s design requests lose time. Remove it if it changes nothing about what ships. Unblock it if work queues behind one person, one meeting or too much in progress. Standardise it if every squad does it differently. Automate it only if it matters, flows and is done the same everywhere. Right calls shrink the request’s journey.',
    lanes: [
      { id: 'remove', label: 'Remove', hint: 'Changes nothing' },
      { id: 'unblock', label: 'Unblock', hint: 'Queues behind a gate' },
      { id: 'standardise', label: 'Standardise', hint: 'Each squad differs' },
      { id: 'automate', label: 'Automate', hint: 'Same rule, by hand' },
    ],
    cards: [
      { id: 'g1', label: step('signoff'), lane: fix('signoff'), visual: 'signoff', note: 'A gate that never closes isn’t a check, it’s a week of waiting. Vandana still sees the work in critique.' },
      { id: 'g2', label: step('a11y'), lane: fix('a11y'), visual: 'a11y', note: 'The review matters; the queue is the problem. Designers run the routine checks, and Sana spends her time on what needs her.' },
      { id: 'g3', label: step('files'), lane: fix('files'), visual: 'files', note: 'Eleven layouts mean eleven places to look. One template agreed with the squads, and the latest version is where everyone expects it.' },
      { id: 'g4', label: step('tokens'), lane: fix('tokens'), visual: 'tokens', note: 'The values matter and the rule is always the same: a job for a pipeline, not a person with a spreadsheet.' },
      { id: 'g5', label: step('redlines'), lane: fix('redlines'), visual: 'redlines', note: 'Four hours a request for a document nobody reads. Don’t automate it; stop doing it.' },
      { id: 'g6', label: step('wip'), lane: fix('wip'), visual: 'wip', note: 'Switching between five requests makes every one of them wait. Fewer at once finishes more.' },
      { id: 'g7', label: step('ready'), lane: fix('ready'), visual: 'ready', note: 'When “ready” means eleven things, engineers find the gaps and the work comes back. One checklist ends the rework.' },
      { id: 'g8', label: step('qa'), lane: fix('qa'), visual: 'qa', note: 'Comparing screenshots by eye is a rule a machine follows better. A person looks only at what changed.' },
      { id: 'g9', label: step('dupe'), lane: fix('dupe'), visual: 'dupe', note: 'Two trackers that never match are worse than one. Keep Jira and filter it.' },
      { id: 'g10', label: step('legal'), lane: fix('legal'), visual: 'legal', note: 'Claims about medicines need legal. Button labels don’t. Pre-approve the standard strings and the weekly queue shrinks.' },
      { id: 'g11', label: step('tools'), lane: fix('tools'), visual: 'tools', note: 'Four homes for one project means hunting. Agree one tool per job with the squads, and retire the rest.' },
      { id: 'g12', label: step('ticket'), lane: fix('ticket'), visual: 'ticket', note: 'Once the checklist is the same everywhere, the ticket can write itself from the file.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.6,
    prompt: 'Vandana sees the map and says: “Let’s buy an AI tool so designers draft faster.” What does Megha say?',
    options: [{ id: 'a', label: 'Yes, it will halve the 27 days' }, { id: 'b', label: 'The work is 44 of 214 hours. The time is in the waits, so remove and unblock first' }, { id: 'c', label: 'Hire more designers instead' }],
    correct: 'b', explanation: 'Making the work faster barely moves a journey that is four-fifths waiting.',
  },
  takeaways: [
    { title: 'Map the waits', body: 'Log work and waiting time for every step of real requests before you change a tool.' },
    { title: 'Remove first', body: 'A step that changes nothing goes. Automating it makes the waste faster.' },
    { title: 'Then queues, then sameness', body: 'Limit work in progress, spread the gates, and agree one way of doing things with the squads.' },
    { title: 'Automate last', body: 'Automate what matters, flows and is the same everywhere. Count tools by use, not by seats.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: '44 hours of work in 214 hours elapsed:', options: [{ id: 'a', label: '21% flow efficiency' }, { id: 'b', label: '79% flow efficiency' }, { id: 'c', label: 'A slow designer' }], correct: 'a', explanation: 'Work time over elapsed time.' },
      { id: 'q2', prompt: 'A weekly approval that never rejects anything:', options: [{ id: 'a', label: 'Automate it' }, { id: 'b', label: 'Remove it' }, { id: 'c', label: 'Standardise it' }], correct: 'b', explanation: 'It changes nothing about what ships.' },
      { id: 'q3', prompt: 'Every squad means something different by “ready for dev”:', options: [{ id: 'a', label: 'Standardise' }, { id: 'b', label: 'Remove' }, { id: 'c', label: 'Unblock' }], correct: 'a', explanation: 'One checklist, agreed with the squads.' },
      { id: 'q4', prompt: 'One designer with five requests open at once:', options: [{ id: 'a', label: 'Automate' }, { id: 'b', label: 'Unblock: limit work in progress' }, { id: 'c', label: 'Keep it; it’s efficient' }], correct: 'b', explanation: 'Every request waits while the others are worked on.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Megha wants to know where requests wait. What is the most reliable way to find out?', hint: 'Opinions, or real requests?', options: [{ id: 'a', label: 'A survey asking designers what slows them down' }, { id: 'b', label: 'Follow a sample of real requests through Jira and the files, and log work and waiting time for each step' }, { id: 'c', label: 'Ask the squads’ PMs' }, { id: 'd', label: 'Count meetings' }], correct: 'b', explanation: 'People remember the annoying steps, not the long ones. Timestamps show both.' },
    { id: 'l2', prompt: 'Saathi pays for 61 seats of a whiteboard tool; 14 people opened it all quarter, and two squads swear by it. What does Megha do?', hint: 'Use, and who depends on it.', options: [{ id: 'a', label: 'Cancel it tomorrow' }, { id: 'b', label: 'Agree with the squads one whiteboard tool for the whole team, move the two squads’ boards over with them, and cut the seats to what’s used' }, { id: 'c', label: 'Buy seats for everyone so it gets used' }, { id: 'd', label: 'Leave it; licences are finance’s problem' }], correct: 'b', explanation: 'Consolidate by use and by agreement, and make the move easy for the people who depend on it.' },
    { id: 'l3', prompt: 'After the fixes, Sana’s queue is short, but squads now ship screens without the routine checks they agreed to run. What’s missing?', hint: 'Spreading a gate needs something in its place.', options: [{ id: 'a', label: 'Put the full review back' }, { id: 'b', label: 'Build the checks into the ready-for-dev checklist and the file template, run the automated ones on every build, and sample a few screens a month' }, { id: 'c', label: 'Blame the squads' }, { id: 'd', label: 'Nothing; accessibility is optional' }], correct: 'b', explanation: 'When a gate is spread, the standard has to live in the workflow, and someone checks it still holds.' },
    { id: 'l4', prompt: 'Engineering wants a design “velocity” number: screens shipped per designer per sprint. What should Megha offer instead?', hint: 'What does the squad actually feel?', options: [{ id: 'a', label: 'Screens per designer, as asked' }, { id: 'b', label: 'Lead time from request to ready for dev, and how often handoffs come back for missing states' }, { id: 'c', label: 'Hours logged in Figma' }, { id: 'd', label: 'Nothing; design can’t be measured' }], correct: 'b', explanation: 'Measure the flow the squad waits on, not how much each person produces.' },
    { id: 'l5', prompt: 'Three months on, a request takes 6 days. A year later, it’s back to 15. What most likely happened?', hint: 'Workflows drift.', options: [{ id: 'a', label: 'The fixes were wrong' }, { id: 'b', label: 'New steps and gates crept back with new squads and nobody re-measured; map the flow again every half-year and remove what has grown' }, { id: 'c', label: 'Designers got slower' }, { id: 'd', label: 'Nothing can be done' }], correct: 'b', explanation: 'A workflow is never finished. Re-measure on a rhythm, the same way.' },
  ],
};

export const ld4_2: Episode = {
  lessonId: 'ld.4-2',
  hook: 'Tickets closed: up 30%. Leadership is thrilled, and a third of the team wants to leave. Watch Megha swap the dashboard for a health check.',
  scene: {
    id: 'health-pulse', duration: 36,
    beats: [
      { at: 0, title: 'A dashboard of activity', body: 'Tickets closed, screens per designer, Figma hours by name.' },
      { at: 6, title: 'Counts aren’t health', body: 'They reward splitting work, and names on numbers make people look busy.' },
      { at: 11, title: 'Three areas', body: 'Delivery, quality and people, each with a few team measures.' },
      { at: 16, title: 'A line for each', body: 'The team agrees where good ends and bad begins.' },
      { at: 21, title: 'One quarter is a blip', body: 'Focus time dipped once. Watch it, and ask what changed.' },
      { at: 26, title: 'Three is a trend', body: 'Safe to show rough work: 61%, 54%, 48%. Time to act.' },
      { at: 31, title: 'Then ask the team', body: 'The number says where to look. The team says what’s wrong.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did Megha drop “Figma hours by name”?', options: [{ id: 'a', label: 'The data was hard to get' }, { id: 'b', label: 'It tracks individuals and activity, so people game it and feel watched' }, { id: 'c', label: 'Figma hours were too low' }],
      correct: 'b', explanation: 'Measure the team, not the people.' },
    { id: 'c2', prompt: 'When does a reading over its line call for action?', options: [{ id: 'a', label: 'The first quarter it crosses' }, { id: 'b', label: 'When it has been over for two quarters or more, from enough people' }, { id: 'c', label: 'Only when leadership asks' }],
      correct: 'b', explanation: 'One quarter is a blip to watch; two is a trend.' },
  ],
  game: {
    id: 'health-read', title: 'Read the health check',
    instructions: 'Each card is a reading on Saathi’s quarterly design health check, drawn over three quarters against the line the team agreed. Drop it if it counts output or tracks named people. It is healthy if it’s on the right side of its line. Watch it if it crossed for one quarter only, or comes from fewer than five people. Act on it if it has been over the line for two quarters or more. Right calls build the check Megha takes to the team.',
    lanes: [
      { id: 'drop', label: 'Drop it', hint: 'Activity or by name' },
      { id: 'healthy', label: 'Healthy', hint: 'Right side of the line' },
      { id: 'watch', label: 'Watch', hint: 'One quarter, or too few' },
      { id: 'act', label: 'Act', hint: 'Two quarters or more' },
    ],
    cards: [
      { id: 'g1', label: reading('closed'), lane: hcall('closed'), visual: 'closed', note: 'More tickets can mean smaller tickets. A count of output says nothing about whether the team is well.' },
      { id: 'g2', label: reading('safety'), lane: hcall('safety'), visual: 'safety', note: 'Three quarters falling, from 36 people. This is the one to take to the team first, and ask why.' },
      { id: 'g3', label: reading('focus'), lane: hcall('focus'), visual: 'focus', note: 'Under the line for one quarter. Ask what changed and check again; don’t rebuild everyone’s calendar on one reading.' },
      { id: 'g4', label: reading('lead'), lane: hcall('lead'), visual: 'lead', note: 'Inside its line and still improving. The workflow fixes are holding.' },
      { id: 'g5', label: reading('figma'), lane: hcall('figma'), visual: 'figma', note: 'Hours by name is surveillance. People learn to leave Figma open, and the trust you need for every other number goes.' },
      { id: 'g6', label: reading('research'), lane: hcall('research'), visual: 'research', note: 'Two quarters under the target and falling fast. Find out why squads stopped testing.' },
      { id: 'g7', label: reading('workload'), lane: hcall('workload'), visual: 'workload', note: 'With four people, any result points at someone. Report it with the next group up, and let the manager raise workload in the open.' },
      { id: 'g8', label: reading('escapes'), lane: hcall('escapes'), visual: 'escapes', note: 'Under its line for two quarters. Healthy, and worth saying so to the team.' },
      { id: 'g9', label: reading('hiring'), lane: hcall('hiring'), visual: 'hiring', note: 'Three quarters over the line with nine roles open. The pipeline itself needs fixing.' },
      { id: 'g10', label: reading('screens'), lane: hcall('screens'), visual: 'screens', note: 'Fewer screens might mean better ones. It rewards splitting work, so it can’t tell you either way.' },
      { id: 'g11', label: reading('ratio'), lane: hcall('ratio'), visual: 'ratio', note: 'Over the line for the first time, because engineering hired. Watch it, and plan the next design hires around it.' },
      { id: 'g12', label: reading('attrition'), lane: hcall('attrition'), visual: 'attrition', note: 'Well inside its line. But it lags: the safety score is how you see the next resignations coming.' },
    ],
  },
  gap: {
    id: 'gap', from: 21, at: 25.6,
    prompt: 'Focus blocks fell under the line for the first time this quarter. Vandana wants to ban Wednesday meetings from Monday. What does Megha do?',
    options: [{ id: 'a', label: 'Ban them' }, { id: 'b', label: 'Mark it to watch, ask the team what changed, and act if it holds next quarter' }, { id: 'c', label: 'Ignore it' }],
    correct: 'b', explanation: 'One quarter is a blip worth a question; two is a trend worth a change.',
  },
  takeaways: [
    { title: 'Team, not people', body: 'Drop counts of output and numbers by name. They measure activity and teach people to look busy.' },
    { title: 'Three areas, agreed lines', body: 'A few measures of delivery, quality and people, each with a line the team set.' },
    { title: 'Trends, from enough people', body: 'Watch one quarter over the line; act on two. Groups under five are reported with the next one up.' },
    { title: 'Number, then conversation', body: 'Take the readings to the team, ask why, and agree one change to check next quarter.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'Screens designed per designer per week:', options: [{ id: 'a', label: 'Drop it' }, { id: 'b', label: 'Act on it' }, { id: 'c', label: 'Healthy' }], correct: 'a', explanation: 'A count of output, per person.' },
      { id: 'q2', prompt: 'Over the line for the first time:', options: [{ id: 'a', label: 'Act' }, { id: 'b', label: 'Watch' }, { id: 'c', label: 'Drop' }], correct: 'b', explanation: 'One quarter is a blip.' },
      { id: 'q3', prompt: 'The smallest group to report survey results for:', options: [{ id: 'a', label: '2' }, { id: 'b', label: '5' }, { id: 'c', label: 'Any size, without names' }], correct: 'b', explanation: 'Fewer, and everyone can tell who said what.' },
      { id: 'q4', prompt: 'A signal that warns of attrition early:', options: [{ id: 'a', label: 'Attrition' }, { id: 'b', label: 'Falling psychological safety and focus time' }, { id: 'c', label: 'Tickets closed' }], correct: 'b', explanation: 'Leading measures move quarters before people resign.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'The CFO wants a single “design productivity” score for the board. What should Megha give him?', hint: 'What is the board actually asking?', options: [{ id: 'a', label: 'Tickets closed per designer' }, { id: 'b', label: 'A short page: lead time, defects after release, research behind features and regretted attrition, each against its line, with one sentence on what the team is changing' }, { id: 'c', label: 'Nothing; design can’t be measured' }, { id: 'd', label: 'A blend of every metric into one index' }], correct: 'b', explanation: 'A few honest measures with their lines tell the board more than one invented index, and can’t be gamed as easily.' },
    { id: 'l2', prompt: 'After Megha publishes lead time, a squad starts marking designs “ready for dev” early to hit the line. What does that tell her?', hint: 'Goodhart’s law.', options: [{ id: 'a', label: 'The squad is fast' }, { id: 'b', label: 'A measure that becomes a target gets gamed; pair it with one that catches the gaming, like handoffs sent back for missing states' }, { id: 'c', label: 'Stop measuring lead time' }, { id: 'd', label: 'Punish the squad' }], correct: 'b', explanation: 'Pair each speed measure with a quality one, and keep the numbers about learning, not ratings.' },
    { id: 'l3', prompt: 'The anonymous pulse asks 40 questions; response rate fell from 90% to 41%. What should Megha do?', hint: 'Who is answering now?', options: [{ id: 'a', label: 'Make it mandatory' }, { id: 'b', label: 'Cut it to a handful of questions that map to actions, and show the team what changed because of the last one' }, { id: 'c', label: 'Run it monthly' }, { id: 'd', label: 'Offer a prize for answering' }], correct: 'b', explanation: 'People answer surveys that are short and visibly lead somewhere. A 41% sample is the people with time or with grievances.' },
    { id: 'l4', prompt: 'Vandana wants to use the health check in each designer’s performance review. What is the risk?', hint: 'What happens to honest answers?', options: [{ id: 'a', label: 'None; it’s good data' }, { id: 'b', label: 'Once team numbers feed ratings, people answer and work to protect themselves, and the check stops telling the truth' }, { id: 'c', label: 'Reviews take longer' }, { id: 'd', label: 'HR won’t allow it' }], correct: 'b', explanation: 'A health check works only while it can’t hurt the people who fill it in.' },
    { id: 'l5', prompt: 'Safety to show rough work has fallen for three quarters. Megha has the number. What is her next step?', hint: 'The number says where, not why.', options: [{ id: 'a', label: 'Announce a new critique format' }, { id: 'b', label: 'Share it with the team, run a facilitated session on why, agree one change with them, and check the same question next quarter' }, { id: 'c', label: 'Find out which designers answered “no”' }, { id: 'd', label: 'Wait for a fourth quarter' }], correct: 'b', explanation: 'The team knows the cause. Ask them, agree one change, and measure it the same way again.' },
  ],
};

export const ld4_3: Episode = {
  lessonId: 'ld.4-3',
  hook: 'Nine designers in a studio was too slow. Thirty-eight designers in squads built five appointment pickers. Watch Megha shape a design org that scales.',
  scene: {
    id: 'hub-spoke', duration: 36,
    beats: [
      { at: 0, title: 'A studio of nine', body: 'Every squad files tickets with one central design team.' },
      { at: 6, title: 'The queue', body: 'Three weeks a ticket, and designs arrive after the build.' },
      { at: 11, title: 'Into the squads', body: 'A designer in every squad, still reporting to design.' },
      { at: 16, title: 'Drift', body: 'Five slot pickers, five ways to write a dose, the same bugs everywhere.' },
      { at: 21, title: 'A hub for shared work', body: 'Design system, content and accessibility, owned once for every squad.' },
      { at: 26, title: 'Ops for coordination', body: 'Hiring, onboarding and cross-squad launches leave designers’ desks.' },
      { at: 31, title: 'Guilds across squads', body: 'Critique by craft, so nobody is a team of one.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why do embedded designers still report to design?', options: [{ id: 'a', label: 'To keep headcount in design’s budget' }, { id: 'b', label: 'So their craft and careers are managed by designers, while the squad gives them context' }, { id: 'c', label: 'Because PMs don’t want reports' }],
      correct: 'b', explanation: 'Context from the squad, craft from design.' },
    { id: 'c2', prompt: 'Five squads built their own slot picker. Where does the fix belong?', options: [{ id: 'a', label: 'In each squad' }, { id: 'b', label: 'In the hub: the design system team builds one for all' }, { id: 'c', label: 'With DesignOps' }],
      correct: 'b', explanation: 'A shared asset someone must maintain belongs in the hub.' },
  ],
  game: {
    id: 'org-shape', title: 'Shape the org',
    instructions: 'Each card is a problem Saathi hit growing from 9 designers to 38. Ask in order. Does fixing it need a squad’s daily context? Embed. Is it a shared asset someone must maintain? The hub. Is it coordination or admin? DesignOps. What’s left is craft drifting between people: a guild. Right calls build the org chart.',
    lanes: [
      { id: 'embed', label: 'In the squad', hint: 'Needs its context' },
      { id: 'hub', label: 'The hub', hint: 'Shared asset' },
      { id: 'ops', label: 'DesignOps', hint: 'Coordination, admin' },
      { id: 'guild', label: 'A guild', hint: 'Craft across squads' },
    ],
    cards: [
      { id: 'g1', label: problem('queue'), lane: home('queue'), visual: 'queue', note: 'No central team can be in eleven planning meetings. Put a designer where the decisions are made.' },
      { id: 'g2', label: problem('pickers'), lane: home('pickers'), visual: 'pickers', note: 'Five teams maintaining five pickers is four too many. Build one in the system, from all five squads’ needs.' },
      { id: 'g3', label: problem('hiring'), lane: home('hiring'), visual: 'hiring', note: 'Scheduling and chasing aren’t design management. DesignOps runs the pipeline; managers interview and decide.' },
      { id: 'g4', label: problem('drift'), lane: home('drift'), visual: 'drift', note: 'Nothing to build and nothing to schedule: designers just need to see each other’s work in time. Critique across squads does it.' },
      { id: 'g5', label: problem('doctors'), lane: home('doctors'), visual: 'doctors', note: 'Six weeks late and filtered through a summary. Only someone in the squad hears doctors first-hand.' },
      { id: 'g6', label: problem('medText'), lane: home('medText'), visual: 'medText', note: 'Medicine text that could mislead needs one owner and one library for every app. That is hub work.' },
      { id: 'g7', label: problem('onboarding'), lane: home('onboarding'), visual: 'onboarding', note: 'Seven weeks and a different start for everyone. A plan run the same way each time is an ops job.' },
      { id: 'g8', label: problem('alone'), lane: home('alone'), visual: 'alone', note: 'Her squad gives her context; it can’t give her peers. A guild and a mentor from another squad can.' },
      { id: 'g9', label: problem('a11y'), lane: home('a11y'), visual: 'a11y', note: 'Fixing it squad by squad means fixing it forever. Accessible components and one standard in the hub fix it once.' },
      { id: 'g10', label: problem('planning'), lane: home('planning'), visual: 'planning', note: 'The bets are made in that room. The squad’s designer belongs in it from the first meeting.' },
      { id: 'g11', label: problem('launch'), lane: home('launch'), visual: 'launch', note: 'Four squads, one launch, no owner. A design programme manager owns the plan so the designers can design.' },
      { id: 'g12', label: problem('tricks'), lane: home('tricks'), visual: 'tricks', note: 'Six months for a trick to spread is a missing community, not a missing tool. A show-and-tell fixes it.' },
    ],
  },
  gap: {
    id: 'gap', from: 16, at: 20.6,
    prompt: 'Five slot pickers, five dose formats, the same bugs in every app. A new CPO says: “Pull all designers back into one studio.” What does Megha say?',
    options: [{ id: 'a', label: 'Agree; a studio is most consistent' }, { id: 'b', label: 'Keep designers in squads for context, and put the shared work in a hub that owns the system, content and accessibility' }, { id: 'c', label: 'Let each squad hire its own designer' }],
    correct: 'b', explanation: 'Centralising buys consistency by giving up context. A hub gets both.',
  },
  takeaways: [
    { title: 'Spokes for context', body: 'A designer sits in each squad for its priorities and users, and reports to design for craft and career.' },
    { title: 'A hub for what’s shared', body: 'The design system, content standards and accessibility are owned once, for every squad.' },
    { title: 'Ops takes coordination', body: 'Hiring, onboarding, tools and cross-squad launches leave designers’ and managers’ desks.' },
    { title: 'Guilds hold the craft', body: 'Critique, mentoring and show-and-tells across squads, so nobody designs alone.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'The squad plans its quarter without a designer:', options: [{ id: 'a', label: 'In the squad' }, { id: 'b', label: 'The hub' }, { id: 'c', label: 'A guild' }], correct: 'a', explanation: 'It needs the squad’s daily context.' },
      { id: 'q2', prompt: 'The same accessibility bugs in every app:', options: [{ id: 'a', label: 'DesignOps' }, { id: 'b', label: 'The hub' }, { id: 'c', label: 'Each squad' }], correct: 'b', explanation: 'A shared standard and components, owned once.' },
      { id: 'q3', prompt: 'Managers scheduling interviews a day a week:', options: [{ id: 'a', label: 'DesignOps' }, { id: 'b', label: 'A guild' }, { id: 'c', label: 'The hub' }], correct: 'a', explanation: 'Coordination and admin.' },
      { id: 'q4', prompt: 'The only designer on a squad feels alone:', options: [{ id: 'a', label: 'Hire a second one' }, { id: 'b', label: 'A guild and a mentor across squads' }, { id: 'c', label: 'Move her to the hub' }], correct: 'b', explanation: 'The squad gives context; the guild gives peers.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Saathi has 11 engineers per designer, against an agreed 10, and budget for four designers. Where should they go?', hint: 'Where is design thinnest?', options: [{ id: 'a', label: 'All four into the hub' }, { id: 'b', label: 'Into the squads where each designer covers the most engineers, checking that those squads have the most design work queued' }, { id: 'c', label: 'Evenly, one per product' }, { id: 'd', label: 'Wherever the loudest PM is' }], correct: 'b', explanation: 'Use the ratio and the queue together to place headcount where design is the bottleneck.' },
    { id: 'l2', prompt: 'The hub’s design system team starts designing features for squads because it has the best craft. What goes wrong?', hint: 'Which part of the model is it becoming?', options: [{ id: 'a', label: 'Nothing; better craft wins' }, { id: 'b', label: 'The hub turns back into a studio with a queue and no squad context, and the system stops being maintained' }, { id: 'c', label: 'The squads get faster' }, { id: 'd', label: 'Engineers complain' }], correct: 'b', explanation: 'The hub owns shared assets. Feature work belongs to the designers in the squads.' },
    { id: 'l3', prompt: 'Squad PMs want to write their designers’ performance reviews, since they see the work daily. What does Megha propose?', hint: 'Context from one, craft from the other.', options: [{ id: 'a', label: 'Let PMs write them' }, { id: 'b', label: 'Design managers write the reviews against the ladder, with written input from each designer’s PM and tech lead' }, { id: 'c', label: 'No reviews for embedded designers' }, { id: 'd', label: 'Peer votes' }], correct: 'b', explanation: 'The squad supplies evidence of impact; the design manager judges the craft and the level.' },
    { id: 'l4', prompt: 'The craft guild meets weekly, but attendance has fallen to six of 38. What should Megha check first?', hint: 'The same three questions as any ritual.', options: [{ id: 'a', label: 'Make attendance mandatory' }, { id: 'b', label: 'Whether it still has a purpose designers value, whether it’s safe to bring rough work, and whether anything comes out of it; then reshape or cut it' }, { id: 'c', label: 'Add pizza' }, { id: 'd', label: 'Move it to a bigger room' }], correct: 'b', explanation: 'A guild is a ritual like any other: it earns its time or it goes.' },
    { id: 'l5', prompt: 'Saathi acquires a Pune diagnostics startup with six designers and its own tools. What is Megha’s first move?', hint: 'Map before you merge.', options: [{ id: 'a', label: 'Move them onto Saathi’s tools and templates in week one' }, { id: 'b', label: 'Map their workflow and health the same way as Saathi’s, embed their designers in the squads they serve, bring them into the guilds, and merge tools once there’s a reason' }, { id: 'c', label: 'Keep them as a separate studio forever' }, { id: 'd', label: 'Wait a year' }], correct: 'b', explanation: 'Apply the same ops: measure first, place people by context, connect the craft, and standardise with them, not at them.' },
  ],
};
