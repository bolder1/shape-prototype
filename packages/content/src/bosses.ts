// Boss briefs for chapters with playable lessons. DRAFTS for review (same as the lesson files).
import { BossBrief, type BossBriefInput } from './boss';

const fd1: BossBriefInput = {
  chapterId: 'fd.1',
  title: 'Reframe “make it pop”',
  minutes: 30,
  scenario: [
    'You join Dabba, a lunch-subscription app in Bengaluru. On your first day the head of marketing messages you: “The menu screen is boring. Can you make it pop? Maybe more colour, bigger photos.”',
    'You have one fact: 62% of people who open the weekly menu leave without picking any meals, and most of them come back later to pick the default thali.',
    'Before you open a design tool, turn the request into a problem worth solving.',
  ],
  fields: [
    { id: 'request', label: 'The request, in its own words', kind: 'long', minWords: 8, hint: 'What was asked for, and what solution is already baked into it?' },
    { id: 'problem', label: 'Problem statement', kind: 'long', minWords: 15, hint: 'Who is stuck, doing what, and why it matters. No solution in it.', placeholder: 'People who … struggle to … because … which means …' },
    { id: 'metric', label: 'How you’ll know it’s solved', kind: 'text', minWords: 6, hint: 'One measurable signal, with a direction and a rough target.' },
    { id: 'questions', label: 'Questions to ask before designing', kind: 'list', items: 3, minWords: 4, hint: 'What would you need to find out? Ask about people and behaviour, not colours.' },
  ],
  rubric: [
    { id: 'solution-free', label: 'Stays in the problem space', strong: 'The problem statement names no UI change (no colours, photos, layouts). It notices that “more colour, bigger photos” is a solution in disguise.', weight: 2, required: true },
    { id: 'who-what-why', label: 'Who, what and why', strong: 'Names a specific group (e.g. weekly subscribers who open the menu), the struggle (leaving without choosing) and why it matters to them and to the business.', weight: 2, required: true },
    { id: 'uses-evidence', label: 'Uses the evidence', strong: 'Builds on the 62% drop-off and the fallback to the default thali instead of the stakeholder’s guess.', weight: 1 },
    { id: 'metric', label: 'Measurable success', strong: 'One metric tied to the problem (e.g. share of menu visits that end with a meal picked), with a direction and target, not “engagement”.', weight: 2 },
    { id: 'questions', label: 'Useful questions', strong: 'Questions probe behaviour and causes (why people leave, what they do instead), not preferences (“do you like blue?”).', weight: 1 },
  ],
  tips: ['If your problem statement still makes sense with any design, it’s solution-free.', 'A good metric can go down. “Users are happier” can’t.'],
  example: {
    request: 'Marketing asked for “more colour and bigger photos” on the menu. That’s a solution, and it assumes the problem is how the menu looks.',
    problem: 'Weekly subscribers open the menu to plan their lunches but 62% leave without choosing, then fall back to the default thali. They aren’t getting the variety they pay for, and Dabba risks them cancelling from boredom.',
    metric: 'Share of menu visits that end with at least one meal picked: from 38% to 55% in six weeks.',
    questions: ['What are people trying to decide when they open the menu, and what makes them give up?', 'When people come back later, what has changed?', 'Do people who always get the default thali cancel more often?'],
  },
};

const fd2: BossBriefInput = {
  chapterId: 'fd.2',
  title: 'Annotate a settings screen',
  minutes: 30,
  scenario: [
    'This is the account settings screen of a bill-splitting app. Support says people “can’t find anything” on it.',
    'Its twelve rows are below. Annotate it like a design reviewer: name the principles it uses or breaks, point to exactly where, and say what that does to the person using it.',
  ],
  mock: 'settings-list',
  fields: [
    { id: 'notes', label: 'Annotations', kind: 'list', items: 4, minWords: 10, hint: 'Principle → where on the screen → effect on the user. Mix what works and what breaks.', placeholder: 'Proximity (breaks): “Delete account” sits right next to “Edit profile”, so …' },
    { id: 'fix', label: 'The one change you’d make first', kind: 'long', minWords: 15, hint: 'Pick the annotation with the biggest effect and say why it goes first.' },
  ],
  rubric: [
    { id: 'named', label: 'Names real principles', strong: 'Each note names a principle from the chapter (proximity, similarity, hierarchy, Hick’s law, Fitts’s law, chunking…) and uses it correctly.', weight: 2, required: true },
    { id: 'located', label: 'Points to the exact spot', strong: 'Every note says where on the screen: which row, label or group. No generic “the layout is cluttered”.', weight: 2 },
    { id: 'effect', label: 'Says what it does to people', strong: 'Each note explains the effect on someone using it (slower to scan, risky tap, hard to find), not just “looks bad”.', weight: 2, required: true },
    { id: 'balance', label: 'Sees what works too', strong: 'At least one note is about something the screen does well and why.', weight: 1 },
    { id: 'priority', label: 'Prioritises with a reason', strong: 'The first change is chosen for its impact on the support complaint, with the reasoning spelled out.', weight: 1 },
  ],
  tips: ['Read the screen in 5 seconds first. What did your eye land on? That’s your hierarchy note.'],
  example: {
    notes: [
      'Chunking (breaks): all twelve options sit in one flat list, so people read every row to find one setting.',
      'Proximity (breaks): “Delete account” sits right under “Connected apps” with the same spacing and style, so it reads as an everyday option and is easy to tap by mistake.',
      'Similarity (works): every row uses the same icon, label and chevron pattern, so people learn quickly that each row opens a page.',
      'Hick’s law (breaks): with no groups, people choose among 12 options at once instead of 3–4 groups, which slows down every visit.',
    ],
    fix: 'Group the rows into Account, Notifications, Preferences and a separated Danger zone. It fixes the “can’t find anything” complaint (chunking and Hick’s law) and moves the risky action away from everyday ones.',
  },
};

const rs1: BossBriefInput = {
  chapterId: 'rs.1',
  title: 'Turn an assumption into research',
  minutes: 30,
  scenario: [
    'The founder of a UPI payments app is sure that “older users don’t trust QR payments, so we should add a voice confirmation”.',
    'Nobody has checked. Your job is to turn this belief into research the team can run next week, without assuming the answer.',
  ],
  fields: [
    { id: 'assumption', label: 'The assumption, split into parts', kind: 'long', minWords: 12, hint: 'What is believed about who, what they feel, and what would fix it? Each part can be wrong separately.' },
    { id: 'questions', label: 'Three research questions', kind: 'list', items: 3, minWords: 6, hint: 'Open, neutral, answerable. What the team needs to learn, not what you’d ask in an interview.' },
    { id: 'method', label: 'How you’d answer the first one', kind: 'long', minWords: 15, hint: 'Generative or evaluative? Qual or quant? Who, how many, and why that method.' },
  ],
  rubric: [
    { id: 'decomposed', label: 'Splits the assumption', strong: 'Separates the claims (older users hesitate with QR; the cause is trust; voice confirmation would help) so each can be tested on its own.', weight: 2 },
    { id: 'neutral', label: 'Neutral questions', strong: 'No question presumes the answer (“Why don’t older users trust QR?” presumes they don’t). Each could come back “no”.', weight: 2, required: true },
    { id: 'answerable', label: 'Answerable and specific', strong: 'Each question names who and what behaviour, and research could actually answer it.', weight: 2, required: true },
    { id: 'method', label: 'Fitting method', strong: 'The method suits the question (e.g. observation or interviews to find causes, data to measure the drop-off) and explains who and how many.', weight: 1 },
  ],
  tips: ['If you can only imagine one answer to your question, it’s leading.'],
  example: {
    assumption: 'Three beliefs: (1) people over 55 drop out of QR payments more than others; (2) the reason is distrust, not, say, small text or a slow camera; (3) a voice confirmation would address that reason.',
    questions: ['How does the QR payment completion rate of people over 55 compare with other age groups?', 'Where in the QR payment flow do older users hesitate or drop out, and what are they doing at that moment?', 'What do older users do to feel sure a payment went through?'],
    method: 'Generative and qualitative for the second question: watch 6–8 people over 55 pay a local shop with QR, in context, and ask them to think aloud. Watching shows where they hesitate and why, which a survey can’t.',
  },
};

/** Boss briefs keyed by chapter id. */
export const BOSSES: Record<string, BossBrief> = Object.fromEntries(
  [fd1, fd2, rs1].map(b => { const brief = BossBrief.parse(b); return [brief.chapterId, brief]; }),
);

export const getBoss = (chapterId: string): BossBrief | undefined => BOSSES[chapterId];
