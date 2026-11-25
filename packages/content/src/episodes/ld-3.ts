// Episodes for chapter ld.3 · Design leadership. Drafts by Claude, for review.
// Kaarigar is a Pune marketplace for home services: customers book electricians, plumbers and AC technicians, and
// about 18,000 kaarigars accept jobs in its partner app. Shalini Verma is head of design, with five designers: Neelam
// and Irfan (senior), Pooja and Aditya (product designers) and Tanmay (associate). She hires a sixth against a ladder
// instead of a feeling, leads each designer the way this piece of work needs, and audits the team's calendar of
// rituals. This chapter is for design managers and leads. Data and rules: ../leadership.
import type { Episode } from '../episode';
import {
  KAARIGAR_NOTES, KAARIGAR_RITUALS, KAARIGAR_SITUATIONS, barCall, leadStyle, ritualCall,
  type KaarigarNote, type KaarigarRitual, type KaarigarSituation,
} from '../leadership';

const note = (k: KaarigarNote) => KAARIGAR_NOTES[k].text;
const bar = (k: KaarigarNote) => barCall(KAARIGAR_NOTES[k]);
const sit = (k: KaarigarSituation) => KAARIGAR_SITUATIONS[k].text;
const style = (k: KaarigarSituation) => leadStyle(KAARIGAR_SITUATIONS[k]);
const ritual = (k: KaarigarRitual) => KAARIGAR_RITUALS[k].text;
const rcall = (k: KaarigarRitual) => ritualCall(KAARIGAR_RITUALS[k]);

export const ld3_1: Episode = {
  lessonId: 'ld.3-1',
  hook: 'Five interviewers, one senior role, and the first person to speak says “great culture fit”. Watch Shalini level the candidate on evidence instead.',
  scene: {
    id: 'debrief-room', duration: 36,
    beats: [
      { at: 0, title: 'One role, five interviews', body: 'Kaarigar needs a senior designer for its partner app. Ritu has done the loop.' },
      { at: 6, title: 'The loudest voice', body: '“Great culture fit!” Everyone nods. Last time, this hired a designer at a senior’s pay.' },
      { at: 11, title: 'Write first, talk second', body: 'Every interviewer writes their notes before the debrief starts.' },
      { at: 16, title: 'What senior means here', body: 'Four rungs, by scope: a task, a feature, a product area, several teams.' },
      { at: 21, title: 'Evidence, not vibes', body: '“Ex-Flipkart” describes nothing. “Drop-off fell from 41% to 23%” does.' },
      { at: 26, title: 'Where most of it sits', body: 'Nine notes on the ladder. The middle of them is senior.' },
      { at: 31, title: 'Same ladder inside', body: 'Promotions use it too, and the pay band follows the level.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why does Shalini have everyone write notes before the debrief?', options: [{ id: 'a', label: 'So HR has a record' }, { id: 'b', label: 'So the first person to speak can’t anchor everyone else' }, { id: 'c', label: 'To keep the debrief short' }],
      correct: 'b', explanation: 'Independent notes first; discussion second.' },
    { id: 'c2', prompt: 'What separates the rungs on Kaarigar’s ladder?', options: [{ id: 'a', label: 'Years of experience' }, { id: 'b', label: 'The scope someone works at without being told what problem to solve' }, { id: 'c', label: 'How polished their visuals are' }],
      correct: 'b', explanation: 'Craft matters at every rung; scope and independence separate them.' },
  ],
  game: {
    id: 'level-call', title: 'Level the loop',
    instructions: 'Each card is a note from Ritu’s interview loop for a senior role. Is it evidence at all? If it is, does the behaviour sit below the senior bar, at it, or above it? A rung is the scope she worked at unaided; if someone else framed it, it counts one lower. Right calls put the note on the ladder.',
    lanes: [
      { id: 'noise', label: 'Not evidence', hint: 'Pedigree, years, “fit”' },
      { id: 'below', label: 'Below senior', hint: 'A feature, or framed for her' },
      { id: 'at', label: 'At senior', hint: 'A product area, unaided' },
      { id: 'above', label: 'Above senior', hint: 'Across teams and people' },
    ],
    cards: [
      { id: 'g1', label: note('pedigree'), lane: bar('pedigree'), visual: 'pedigree', note: 'Where she worked and studied says nothing about what she did there. Ask what she owned at Flipkart instead.' },
      { id: 'g2', label: note('onboarding'), lane: bar('onboarding'), visual: 'onboarding', note: 'A product area for a year, problem found with the PM from evidence, and a result. That is the senior bar.' },
      { id: 'g3', label: note('framed'), lane: bar('framed'), visual: 'framed', note: 'Good feature work, but the PM set the problem and the metric, so it shows a rung below designer-led work.' },
      { id: 'g4', label: note('mentor'), lane: bar('mentor'), visual: 'mentor', note: 'Growing other designers is lead-level scope. For a senior role it is a plus, not the bar.' },
      { id: 'g5', label: note('fit'), lane: bar('fit'), visual: 'fit', note: '“Fit” is usually “like me”. Replace it with the values you hire for, and the behaviour that shows each.' },
      { id: 'g6', label: note('flow'), lane: bar('flow'), visual: 'flow', note: 'She widened the brief to the whole flow and framed it around the kaarigar’s 30 seconds, on her own. Product-area thinking.' },
      { id: 'g7', label: note('polish'), lane: bar('polish'), visual: 'polish', note: 'Sharp craft on one screen, but she never asked who uses it or what it’s for. Feature scope.' },
      { id: 'g8', label: note('principles'), lane: bar('principles'), visual: 'principles', note: 'Principles an org of 60 uses shape how many teams work. Above the senior bar.' },
      { id: 'g9', label: note('years'), lane: bar('years'), visual: 'years', note: 'People with eight years can be at any rung. Count what she did in them.' },
      { id: 'g10', label: note('brief'), lane: bar('brief'), visual: 'brief', note: 'Moving a PM with evidence and changing the metric is exactly what a senior does with product.' },
      { id: 'g11', label: note('escalate'), lane: bar('escalate'), visual: 'escalate', note: 'Handing a scope fight to her manager means someone else makes the product call. A senior negotiates it.' },
      { id: 'g12', label: note('critique'), lane: bar('critique'), visual: 'critique', note: 'She changed how a team works and it outlasted her. That is lead-level scope.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.6,
    prompt: 'Aditya opens the debrief with “great culture fit!” and two others nod. What does Shalini do?',
    options: [{ id: 'a', label: 'Agree, since most of the room does' }, { id: 'b', label: 'Ask everyone to read out their written notes first, and to say what Ritu did that shows it' }, { id: 'c', label: 'Ask Aditya to leave the debrief' }],
    correct: 'b', explanation: 'Notes written before the debrief, read before discussion, and behaviour as the only evidence.',
  },
  takeaways: [
    { title: 'Ladder first', body: 'Say what each level means before you interview. Otherwise everyone hires against their own idea of senior.' },
    { title: 'Scope and independence', body: 'Rungs differ by how wide someone works without being told the problem. Framed for them counts one lower.' },
    { title: 'Behaviour only', body: 'Pedigree, years and “fit” describe nothing. Count what they did or said.' },
    { title: 'Write, then talk', body: 'Independent notes before the debrief, and level where most of the evidence sits.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: '“She’s ex-Google”:', options: [{ id: 'a', label: 'Evidence of senior' }, { id: 'b', label: 'Not evidence' }, { id: 'c', label: 'Evidence of lead' }], correct: 'b', explanation: 'It says where, not what.' },
      { id: 'q2', prompt: 'She owned a product area and set its problems with the PM:', options: [{ id: 'a', label: 'At the senior bar' }, { id: 'b', label: 'Below it' }, { id: 'c', label: 'Not evidence' }], correct: 'a', explanation: 'Product scope, unaided.' },
      { id: 'q3', prompt: 'The best time to write the interview rubric:', options: [{ id: 'a', label: 'After the first candidate' }, { id: 'b', label: 'Before any candidate' }, { id: 'c', label: 'In the debrief' }], correct: 'b', explanation: 'A rubric written afterwards bends to the candidate you liked.' },
      { id: 'q4', prompt: 'Pay should follow:', options: [{ id: 'a', label: 'How hard they negotiated' }, { id: 'b', label: 'The level' }, { id: 'c', label: 'Their last salary' }], correct: 'b', explanation: 'Bands per level keep the ladder fair for the people already on it.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Shalini wants a take-home exercise. What makes one fair to candidates?', hint: 'Whose time does it cost?', options: [{ id: 'a', label: 'Three days on a full redesign of Kaarigar’s app' }, { id: 'b', label: 'Timeboxed to a few hours, paid or done in the interview, on a realistic problem, scored on the same rubric for everyone' }, { id: 'c', label: 'Whatever the candidate wants to show' }, { id: 'd', label: 'A logo test' }], correct: 'b', explanation: 'Long unpaid take-homes filter for free time, not skill, and get real work done for free.' },
    { id: 'l2', prompt: 'Irfan wants to promote Pooja because she has been a product designer for three years. What does the ladder ask instead?', hint: 'Time or scope?', options: [{ id: 'a', label: 'Three years is enough' }, { id: 'b', label: 'Evidence that she already works at senior scope: owning a product area and setting its problems, over months' }, { id: 'c', label: 'A vote of the team' }, { id: 'd', label: 'A new job title to keep her happy' }], correct: 'b', explanation: 'Promote people already doing the next level’s work, with evidence; tenure isn’t on the ladder.' },
    { id: 'l3', prompt: 'Every hire Shalini’s team has rated “strong” went to the same two design schools. What should she look at first?', hint: 'Where could bias get into the loop?', options: [{ id: 'a', label: 'Only recruit from those schools' }, { id: 'b', label: 'Whether the rubric and the questions reward behaviour, or proxies like school and polish; and whether the sourcing reaches anyone else' }, { id: 'c', label: 'Nothing; it means those schools are better' }, { id: 'd', label: 'Hide candidates’ names' }], correct: 'b', explanation: 'Proxies in the rubric and narrow sourcing both reproduce the team you already have.' },
    { id: 'l4', prompt: 'The candidate’s notes split: four at the senior bar, two below, one far above. The CEO says “go lead, she’s a star”. What is the honest offer?', hint: 'Where does most of the evidence sit?', options: [{ id: 'a', label: 'Lead, to be safe' }, { id: 'b', label: 'Senior, at the senior band, with the above-bar evidence noted for her first promotion conversation' }, { id: 'c', label: 'Designer, to leave room to grow' }, { id: 'd', label: 'Let her choose' }], correct: 'b', explanation: 'Level where most of the evidence sits; one standout interview is a note, not a level.' },
    { id: 'l5', prompt: 'Kaarigar’s ladder has a manager track and an individual contributor track above senior. Why does Shalini insist on both?', hint: 'What happens to a great designer who doesn’t want to manage?', options: [{ id: 'a', label: 'To have more titles' }, { id: 'b', label: 'So designers can grow in scope and pay without becoming managers; otherwise the best ones become reluctant managers or leave' }, { id: 'c', label: 'Because HR requires it' }, { id: 'd', label: 'So managers earn less' }], correct: 'b', explanation: 'A staff or principal track keeps strong individual contributors growing as individual contributors.' },
  ],
};

export const ld3_2: Episode = {
  lessonId: 'ld.3-2',
  hook: 'Tanmay drowns with too little help. Neelam feels watched with too much. Watch Shalini stop managing people the same way and start reading the task.',
  scene: {
    id: 'skill-will', duration: 36,
    beats: [
      { at: 0, title: 'One style for all', body: 'The same weekly check-in for five designers. It fits about one of them.' },
      { at: 6, title: 'Two questions', body: 'On this piece of work: how able are they? How keen?' },
      { at: 11, title: 'Direct', body: 'Tanmay’s first study: eager, never written a script. Show him the steps.' },
      { at: 16, title: 'Coach', body: 'His second study went badly. Explain why, plan the next one together.' },
      { at: 21, title: 'Support', body: 'Irfan can do it, but he’s gone quiet. Listen, ask, clear the way.' },
      { at: 26, title: 'Delegate', body: 'Neelam owns dark mode. Agree the outcome and step back.' },
      { at: 31, title: 'Per task, not per person', body: 'Aditya needs three styles this quarter. The 1:1 is where she finds out which.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What decides Shalini’s style with a designer?', options: [{ id: 'a', label: 'Their job title' }, { id: 'b', label: 'Their skill and will on this piece of work' }, { id: 'c', label: 'How long they’ve been on the team' }],
      correct: 'b', explanation: 'The same person needs different styles for different tasks.' },
    { id: 'c2', prompt: 'Irfan is fully able but has gone quiet. Which style?', options: [{ id: 'a', label: 'Direct: tell him the steps' }, { id: 'b', label: 'Support: listen, ask, clear blockers, let him decide' }, { id: 'c', label: 'Leave him alone until he recovers' }],
      correct: 'b', explanation: 'Telling an expert the steps insults him; leaving him alone ignores the real problem.' },
  ],
  game: {
    id: 'style-pick', title: 'Lead this one',
    instructions: 'Each card is one designer on one piece of work. Pick how Shalini leads them: direct if they’re new to it and keen, coach if they’re still learning and knocked back, support if they’re able but low on will, delegate if they’re able and keen. Right calls plot them on the skill and will grid.',
    lanes: [
      { id: 'direct', label: 'Direct', hint: 'New to it, keen' },
      { id: 'coach', label: 'Coach', hint: 'Learning, knocked back' },
      { id: 'support', label: 'Support', hint: 'Able, low will' },
      { id: 'delegate', label: 'Delegate', hint: 'Able and keen' },
    ],
    cards: [
      { id: 'g1', label: sit('study'), lane: style('study'), visual: 'study', note: 'Keen but new: give him a template, the steps and a first session together. Leaving him alone is how he floundered last time.' },
      { id: 'g2', label: sit('dark'), lane: style('dark'), visual: 'dark', note: 'She has done this exact job before and wants it. Agree the outcome and get out of her way.' },
      { id: 'g3', label: sit('quiet'), lane: style('quiet'), visual: 'quiet', note: 'His skill hasn’t changed; his will has. The fix is a conversation, not instructions.' },
      { id: 'g4', label: sit('refund'), lane: style('refund'), visual: 'refund', note: '“Just tell me what to draw” is low will after two knock-backs, and he still has a skill to learn: bringing engineering in early.' },
      { id: 'g5', label: sit('cfo'), lane: style('cfo'), visual: 'cfo', note: 'Brilliant at payments, new to CFOs. Tell him the shape and rehearse it; there’s no time to discover it.' },
      { id: 'g6', label: sit('tokens'), lane: style('tokens'), visual: 'tokens', note: 'No one knows the system better. What she needs is help and protection, and the plan stays hers.' },
      { id: 'g7', label: sit('autopay'), lane: style('autopay'), visual: 'autopay', note: 'Three on-time payment flows earn the autonomy he asks for, with the risks agreed up front.' },
      { id: 'g8', label: sit('facilitate'), lane: style('facilitate'), visual: 'facilitate', note: 'Still learning to run a room and her confidence is dented. Explain, co-facilitate, then hand it back.' },
      { id: 'g9', label: sit('marathi'), lane: style('marathi'), visual: 'marathi', note: 'Eager and new to a second script. Lay out the steps so she doesn’t learn them from a broken release.' },
      { id: 'g10', label: sit('shelved'), lane: style('shelved'), visual: 'shelved', note: 'He doesn’t need help designing it; he needs a reason to believe it will ship. Clear that blocker, then ask him.' },
      { id: 'g11', label: sit('noshow'), lane: style('noshow'), visual: 'noshow', note: 'A setback on something he’s still learning. Explain what went wrong and why, and plan the next one with him.' },
      { id: 'g12', label: sit('crossCrit'), lane: style('crossCrit'), visual: 'crossCrit', note: 'He already does it well and wants it. Make it official and step back.' },
    ],
  },
  gap: {
    id: 'gap', from: 16, at: 20.6,
    prompt: 'Tanmay says he wants to hand research to someone else after a bad study. What does Shalini do?',
    options: [{ id: 'a', label: 'Give research to Pooja; it’s not his strength' }, { id: 'b', label: 'Go through what happened, explain what would help, and plan the next study with him' }, { id: 'c', label: 'Tell him to try harder' }],
    correct: 'b', explanation: 'Still learning and knocked back: coach. Explain, decide together, and encourage.',
  },
  takeaways: [
    { title: 'Read the task', body: 'Ask how able and how keen this person is for this piece of work, not in general.' },
    { title: 'Four styles', body: 'Direct the new and keen, coach the learning and knocked back, support the able and unsure, delegate the able and keen.' },
    { title: 'Their 1:1', body: 'Weekly, their agenda. Status goes on the board.' },
    { title: 'Say it plainly', body: 'Name the problem and its effect, write down the expectation and a date, and check in against it.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'Keen, but has never done this task:', options: [{ id: 'a', label: 'Delegate' }, { id: 'b', label: 'Direct' }, { id: 'c', label: 'Support' }], correct: 'b', explanation: 'Show what good looks like and the steps.' },
      { id: 'q2', prompt: 'Has done it before and wants to own it:', options: [{ id: 'a', label: 'Delegate' }, { id: 'b', label: 'Coach' }, { id: 'c', label: 'Direct' }], correct: 'a', explanation: 'Agree the outcome, then step back.' },
      { id: 'q3', prompt: 'Who sets the agenda of a 1:1?', options: [{ id: 'a', label: 'The manager' }, { id: 'b', label: 'The designer' }, { id: 'c', label: 'The PM' }], correct: 'b', explanation: 'It is their time with you.' },
      { id: 'q4', prompt: 'Hard feedback goes:', options: [{ id: 'a', label: 'In critique, in front of the team' }, { id: 'b', label: 'In private, soon, and specific' }, { id: 'c', label: 'In the annual review' }], correct: 'b', explanation: 'Private and soon is when people can act on it.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Shalini delegates UPI autopay to Aditya. Three weeks in, the squad says he’s missed a dependency on the bank’s mandate screens. What does delegating mean now?', hint: 'Did delegating mean never checking?', options: [{ id: 'a', label: 'Take the project back' }, { id: 'b', label: 'Use the agreed check-in: ask what he’s seeing, help him decide how to recover, and agree to flag risks like this sooner' }, { id: 'c', label: 'Say nothing; it’s his project' }, { id: 'd', label: 'Give the project to Irfan' }], correct: 'b', explanation: 'Delegating hands over the decisions, not the check-in. A slip is a reason to adjust, not to grab it back.' },
    { id: 'l2', prompt: 'Neelam is overloaded and Shalini’s instinct is to take the token migration plan off her and write it herself. Why might that backfire?', hint: 'What does it tell Neelam?', options: [{ id: 'a', label: 'It won’t; managers should step in' }, { id: 'b', label: 'Neelam is able and only low on will; taking the plan says she isn’t trusted, and makes Shalini the bottleneck. Clear her load instead' }, { id: 'c', label: 'Shalini doesn’t know tokens' }, { id: 'd', label: 'It costs more' }], correct: 'b', explanation: 'Support keeps the decision with the expert and removes what is in her way.' },
    { id: 'l3', prompt: 'Leadership is reorganising squads and nothing is final. Pooja asks if her squad is being split. What should Shalini say?', hint: 'Shield from churn, but don’t hide.', options: [{ id: 'a', label: '“Nothing is changing”, even though she doesn’t know' }, { id: 'b', label: 'What she knows, what she doesn’t, when she’ll know more, and that she’ll tell Pooja first' }, { id: 'c', label: 'Forward her the leadership thread' }, { id: 'd', label: 'Avoid the question' }], correct: 'b', explanation: 'Honest about what is known and unknown, and a promise she can keep.' },
    { id: 'l4', prompt: 'Aditya’s files are still late after four weeks of a written expectation and weekly check-ins, with help offered. What is the fair next step?', hint: 'What has already been done?', options: [{ id: 'a', label: 'Lower the expectation' }, { id: 'b', label: 'Bring in HR for a formal performance plan with the same expectations and dates, having told him plainly where this is heading' }, { id: 'c', label: 'Move him to another team without saying why' }, { id: 'd', label: 'Keep hinting' }], correct: 'b', explanation: 'Clear, written, supported, then formal. No one should be surprised by the next step.' },
    { id: 'l5', prompt: 'Shalini now spends 70% of her week reviewing files and almost none on hiring, strategy or her designers’ growth. What is going wrong?', hint: 'Which style is she using with everyone?', options: [{ id: 'a', label: 'Nothing; reviews are a manager’s job' }, { id: 'b', label: 'She’s directing people who are ready to be delegated to, so she has become the bottleneck; delegate where skill and will are high, and spend the time on the team' }, { id: 'c', label: 'She needs a bigger team' }, { id: 'd', label: 'She should stop doing 1:1s' }], correct: 'b', explanation: 'A manager’s output is the team’s output. Reviewing everything caps it at her own hours.' },
  ],
};

export const ld3_3: Episode = {
  lessonId: 'ld.3-3',
  hook: 'Eight and a half hours a week of rituals, and still nobody brings a sketch to critique. Watch Shalini audit the calendar.',
  scene: {
    id: 'ritual-week', duration: 36,
    beats: [
      { at: 0, title: 'A full calendar', body: '12 rituals, 8 h 30 min a week for each designer.' },
      { at: 6, title: 'Only finished work', body: 'The CEO picks winners on Friday. So nobody brings anything rough.' },
      { at: 11, title: 'Three questions', body: 'Is there a reason for it? Is it safe? Does anything come out?' },
      { at: 16, title: 'Cut', body: 'A stand-up that repeats the squad’s, a status round that repeats the board.' },
      { at: 21, title: 'Make it safe', body: 'Leadership gets a monthly showcase. Bugs go blameless. Scores go.' },
      { at: 26, title: 'Give it an output', body: 'The PM review ends with a decisions log; the offsite with three owned bets.' },
      { at: 31, title: '4 h 45 min', body: 'Half the time, and sketches back in Monday critique.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did designers stop bringing rough work?', options: [{ id: 'a', label: 'They were too busy' }, { id: 'b', label: 'Showing early work in front of the CEO turned it into a verdict' }, { id: 'c', label: 'Figma was slow' }],
      correct: 'b', explanation: 'People hold back wherever showing early work costs them.' },
    { id: 'c2', prompt: 'What is the first question Shalini asks of each ritual?', options: [{ id: 'a', label: 'Does it have a nice name?' }, { id: 'b', label: 'Is there still a reason for it, that nothing else already covers?' }, { id: 'c', label: 'Does the CEO like it?' }],
      correct: 'b', explanation: 'Cut what has lost its reason before fixing anything.' },
  ],
  game: {
    id: 'ritual-crit', title: 'Audit the calendar',
    instructions: 'Each card is a ritual on the design team’s calendar. Keep it if it has a reason, is safe and produces something. Reshape it if it is safe but nothing comes out. Make it safe if it punishes rough or honest work. Cut it if its reason has gone or something else already does its job. Right calls fix the week and give back the hours.',
    lanes: [
      { id: 'keep', label: 'Keep', hint: 'Reason, safe, output' },
      { id: 'reshape', label: 'Reshape', hint: 'Nothing comes out' },
      { id: 'make-safe', label: 'Make it safe', hint: 'People hold back' },
      { id: 'cut', label: 'Cut', hint: 'No reason, or done elsewhere' },
    ],
    cards: [
      { id: 'g1', label: ritual('standup'), lane: rcall('standup'), visual: 'standup', note: 'Every designer is already at a squad stand-up. 75 minutes a week each, for news they’ve already heard.' },
      { id: 'g2', label: ritual('critique'), lane: rcall('critique'), visual: 'critique', note: 'The presenter asks for the feedback they need, and decisions get written down. That is critique working.' },
      { id: 'g3', label: ritual('ceoFriday'), lane: rcall('ceoFriday'), visual: 'ceoFriday', note: 'Leadership seeing the work is a good reason. Picking winners from work in progress is what made people stop bringing it.' },
      { id: 'g4', label: ritual('inspiration'), lane: rcall('inspiration'), visual: 'inspiration', note: 'Fresh eyes are worth an afternoon slot, but only if something comes out of it. A patterns board gives it one.' },
      { id: 'g5', label: ritual('hygiene'), lane: rcall('hygiene'), visual: 'hygiene', note: 'The migration it was for ended a year ago. Rituals outlive their reasons unless someone asks.' },
      { id: 'g6', label: ritual('shame'), lane: rcall('shame'), visual: 'shame', note: 'Bugs should be seen. Names on them teach people to hide mistakes, so ask why the process let it through instead.' },
      { id: 'g7', label: ritual('rideAlong'), lane: rcall('rideAlong'), visual: 'rideAlong', note: 'Half a day on a real job, and a change proposed from it. It has a reason, it’s safe, and something comes out.' },
      { id: 'g8', label: ritual('review'), lane: rcall('review'), visual: 'review', note: 'Agreement with no record is how debates come back. A decisions log, read at the start of the next one, ends them.' },
      { id: 'g9', label: ritual('sync'), lane: rcall('sync'), visual: 'sync', note: 'A status round reading out a board anyone can read. The hour goes back to design.' },
      { id: 'g10', label: ritual('scores'), lane: rcall('scores'), visual: 'scores', note: 'Once critique feeds ratings, people perform in it instead of learning. Keep feedback and reviews apart.' },
      { id: 'g11', label: ritual('oneOnOne'), lane: rcall('oneOnOne'), visual: 'oneOnOne', note: 'Their agenda, written actions, every week. Keep it.' },
      { id: 'g12', label: ritual('offsite'), lane: rcall('offsite'), visual: 'offsite', note: 'A day out is worth it if it ends in bets someone owns, checked at the next one.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.6,
    prompt: 'Designers now bring only finished work, because the CEO picks winners every Friday. What does Shalini do?',
    options: [{ id: 'a', label: 'Tell designers to be braver' }, { id: 'b', label: 'Give leadership a monthly showcase of shipped work, and keep work in progress in the team’s critique' }, { id: 'c', label: 'Cancel critique' }],
    correct: 'b', explanation: 'Separate the room where work is judged from the room where it is shaped.',
  },
  takeaways: [
    { title: 'Culture is the calendar', body: 'What your rituals reward every week is the culture, whatever the values say.' },
    { title: 'Cut first', body: 'Rituals that lost their reason, or repeat another meeting, go before anything else is fixed.' },
    { title: 'Safe to be rough', body: 'No bosses judging work in progress, no names on mistakes, no critique in ratings.' },
    { title: 'Something comes out', body: 'Every ritual ends with a decision, a log or an owner.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'A daily design stand-up right before the squad stand-ups:', options: [{ id: 'a', label: 'Keep' }, { id: 'b', label: 'Cut' }, { id: 'c', label: 'Make it safe' }], correct: 'b', explanation: 'Something else already does its job.' },
      { id: 'q2', prompt: 'Critique scores feed performance reviews:', options: [{ id: 'a', label: 'Make it safe' }, { id: 'b', label: 'Reshape' }, { id: 'c', label: 'Keep' }], correct: 'a', explanation: 'People stop showing honest work once it is graded.' },
      { id: 'q3', prompt: 'A review where nothing decided is written down:', options: [{ id: 'a', label: 'Cut' }, { id: 'b', label: 'Reshape: add a decisions log' }, { id: 'c', label: 'Keep' }], correct: 'b', explanation: 'It has a purpose; it needs an output.' },
      { id: 'q4', prompt: 'A bug channel that tags the designer:', options: [{ id: 'a', label: 'Make it blameless' }, { id: 'b', label: 'Keep, for accountability' }, { id: 'c', label: 'Cut, and hide bugs' }], correct: 'a', explanation: 'See the bug, fix the process, leave out the name.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'A new designer says critique feels like a defence of her work. Shalini changes one thing first. What?', hint: 'Who sets what the feedback is for?', options: [{ id: 'a', label: 'Make critique longer' }, { id: 'b', label: 'The presenter opens by saying what stage the work is at and what feedback they need, and the room answers that' }, { id: 'c', label: 'Ban negative feedback' }, { id: 'd', label: 'Let only seniors speak' }], correct: 'b', explanation: 'When the presenter frames the question, critique serves the work instead of judging the person.' },
    { id: 'l2', prompt: 'The team’s values poster says “we ship fast and learn”. Every launch slips because designs wait a week for Shalini’s sign-off. What does the team actually learn?', hint: 'Which one does the calendar reward?', options: [{ id: 'a', label: 'That they ship fast' }, { id: 'b', label: 'That nothing ships without her, whatever the poster says; the sign-off is the real value' }, { id: 'c', label: 'Nothing; posters work' }, { id: 'd', label: 'That speed doesn’t matter' }], correct: 'b', explanation: 'People follow what the routines reward. Change the routine, not the poster.' },
    { id: 'l3', prompt: 'Kaarigar is about to hire two remote designers in Kochi and Indore. Which ritual change matters most?', hint: 'Who is in the room when it happens?', options: [{ id: 'a', label: 'None; they can dial in' }, { id: 'b', label: 'Run critique remote-first: everyone on their own screen, comments in the file before the call, decisions written down, so nobody is second-class' }, { id: 'c', label: 'Fly them in every Monday' }, { id: 'd', label: 'Skip critique for them' }], correct: 'b', explanation: 'A hybrid ritual run for the room leaves the remote people out of the conversation and the decisions.' },
    { id: 'l4', prompt: 'Shalini wants to know if the changes worked. What should she look at a quarter later?', hint: 'What were the rituals for?', options: [{ id: 'a', label: 'How many meetings there are' }, { id: 'b', label: 'Whether rough work shows up in critique, whether decisions stick, and what the team says in an anonymous pulse survey about safety to speak up' }, { id: 'c', label: 'Whether the CEO is happy' }, { id: 'd', label: 'Attendance' }], correct: 'b', explanation: 'Measure the behaviour the rituals are meant to produce, not the rituals themselves.' },
    { id: 'l5', prompt: 'Irfan suggests a new weekly “design jam”. What should Shalini ask before it goes on the calendar?', hint: 'The same three questions, plus one.', options: [{ id: 'a', label: 'Nothing; more rituals mean more culture' }, { id: 'b', label: 'What it is for that nothing else covers, whether it’s safe to bring rough work, what comes out of it, and when they’ll check if it’s still worth it' }, { id: 'c', label: 'Whether the CEO will attend' }, { id: 'd', label: 'What snacks to order' }], correct: 'b', explanation: 'Every ritual starts with a reason, a safe room, an output and a date to review it.' },
  ],
};
