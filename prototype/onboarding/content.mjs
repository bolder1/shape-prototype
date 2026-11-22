// All onboarding copy lives here, separate from logic, so it can be reviewed and translated on its own.
// Voice: Tee is a friendly coach. Plain words, one idea per message, no curriculum jargon.
// Consistent terms: "skill" (never "domain"), "your T", "deep skill" (never "spine").

/** Per-skill copy. `what` explains the skill to someone who has never heard of it. */
export const SKILLS = {
  fd: { emoji: '🧠', color: '#FF5C5C', name: 'Design basics', short: 'basics',
        what: 'Seeing why a screen works, using ideas like hierarchy, spacing and grouping.',
        example: 'Spotting why one checkout page feels calm and another feels messy.' },
  rs: { emoji: '🔍', color: '#FF9233', name: 'User research', short: 'research',
        what: 'Talking to and watching real people to learn what they actually need.',
        example: 'Interviewing 5 shoppers about why they leave without paying.' },
  ia: { emoji: '🧭', color: '#FFC21A', name: 'Flows & structure', short: 'flows',
        what: 'Planning the steps, screens and menus so people never get lost.',
        example: 'Mapping every screen a user sees while resetting a password.' },
  ui: { emoji: '🎨', color: '#FF5FA8', name: 'Visual & UI design', short: 'visuals',
        what: 'Making screens look polished and clear: type, colour, spacing, icons.',
        example: 'Turning a rough sketch into a pixel-perfect app screen.' },
  ds: { emoji: '🧩', color: '#9B5CFF', name: 'Design systems', short: 'systems',
        what: 'Building reusable pieces (buttons, colours, rules) so a whole team designs consistently.',
        example: 'Creating one button that works in 12 places and 2 themes.' },
  pr: { emoji: '✨', color: '#4F7BFF', name: 'Prototypes & motion', short: 'motion',
        what: 'Making designs clickable and animated so they feel real before anything is built.',
        example: 'Animating a card that flips when you tap “Pay”.' },
  cw: { emoji: '✍️', color: '#1FB5F0', name: 'UX writing', short: 'words',
        what: 'Writing the words inside a product: buttons, errors, hints, empty screens.',
        example: 'Rewriting “Error 403” into something a human understands.' },
  ax: { emoji: '🫶', color: '#10C4A0', name: 'Accessibility', short: 'accessibility',
        what: 'Making sure everyone can use a product, including people with disabilities.',
        example: 'Checking a page works with a screen reader and keyboard only.' },
  st: { emoji: '🎯', color: '#2BB45A', name: 'Product strategy', short: 'strategy',
        what: 'Deciding what is worth building, and how to tell if it worked.',
        example: 'Picking 3 features from a list of 20 and defining success for each.' },
  gr: { emoji: '📈', color: '#7ACC00', name: 'Growth design', short: 'growth',
        what: 'Designing to move numbers: more sign-ups, more people coming back.',
        example: 'Running an A/B test on two versions of a sign-up screen.' },
  br: { emoji: '🌟', color: '#FF7A45', name: 'Brand & marketing', short: 'branding',
        what: 'Giving a product a look and personality people remember.',
        example: 'Designing a logo, colours and a launch page for a new app.' },
  bz: { emoji: '🤝', color: '#C2569B', name: 'Business & pitching', short: 'business',
        what: 'Understanding how products make money, and convincing people to back your ideas.',
        example: 'Pitching a redesign to your boss with the numbers to back it.' },
  dc: { emoji: '💻', color: '#3F4ACC', name: 'Code & AI', short: 'code',
        what: 'Turning designs into working products with code, or with AI tools.',
        example: 'Building a real, clickable page from your design with AI help.' },
  ld: { emoji: '👑', color: '#8A6BCC', name: 'Leading people', short: 'leadership',
        what: 'Running workshops, guiding decisions and helping a team grow.',
        example: 'Facilitating a 1-hour session where a team agrees on a direction.' },
};

/** Self-rating answers. Values feed the engine (0–5). */
export const LEVELS = [
  { v: 0, emoji: '🌱', label: 'Never tried' },
  { v: 1, emoji: '📖', label: "I've read about it" },
  { v: 3, emoji: '🛠️', label: 'I do it at work' },
  { v: 5, emoji: '🎓', label: 'I could teach it' },
];

/** Step 1: the dream. `spine` = deep skill it implies, `goal` = engine goal. */
export const ASPIRATIONS = [
  { id: 'product-designer', emoji: '📱', label: 'Product designer', sub: 'Shape whole products, end to end', spine: 'ia', goal: 'full-stack', future: 'Product Designer' },
  { id: 'ui-designer',  emoji: '🎨', label: 'UI designer', sub: 'Make beautiful, polished screens', spine: 'ui', goal: 'i-to-t', future: 'UI Virtuoso' },
  { id: 'researcher',   emoji: '🔍', label: 'UX researcher', sub: 'Understand people deeply', spine: 'rs', goal: 'i-to-t', future: 'Insight Hunter' },
  { id: 'motion',       emoji: '✨', label: 'Motion & interaction designer', sub: 'Make products feel alive', spine: 'pr', goal: 'i-to-t', future: 'Motion Master' },
  { id: 'brand',        emoji: '🌟', label: 'Brand designer', sub: 'Build brands people love', spine: 'br', goal: 'i-to-t', future: 'Brand Architect' },
  { id: 'growth',       emoji: '📈', label: 'Growth designer', sub: 'Design that moves numbers', spine: 'gr', goal: 'i-to-t', future: 'Growth Wizard' },
  { id: 'engineer',     emoji: '💻', label: 'Design engineer', sub: 'Design it and build it', spine: 'dc', goal: 'i-to-t', future: 'Design Engineer' },
  { id: 'lead',         emoji: '👑', label: 'Design leader', sub: 'Lead teams and set direction', spine: 'ld', goal: 'i-to-t', future: 'Design Leader' },
  { id: 'literate',     emoji: '🧩', label: 'Better at my own job', sub: 'Understand how products get made', spine: null, goal: 'product-literate', future: 'Product-Minded Pro' },
  { id: 'explore',      emoji: '🧭', label: 'Not sure yet', sub: 'Help me find what I love', spine: null, goal: 't', future: 'Rising Designer' },
];

/** Step 2: today. `home` = deep skill they already practise (engine ROLE_HOME). */
export const ROLES = [
  { id: 'student', emoji: '🎒', label: 'Student or switching careers' },
  { id: 'ui-designer', emoji: '🎨', label: 'UI / visual designer' },
  { id: 'ux-designer', emoji: '🧭', label: 'UX / product designer' },
  { id: 'graphic-designer', emoji: '🖌️', label: 'Graphic designer' },
  { id: 'motion-designer', emoji: '🎬', label: 'Motion designer' },
  { id: 'frontend-engineer', emoji: '💻', label: 'Front-end engineer' },
  { id: 'marketer', emoji: '📣', label: 'Marketing' },
  { id: 'sales', emoji: '🤝', label: 'Sales or customer success' },
  { id: 'product-manager', emoji: '🎯', label: 'Product manager' },
  { id: 'researcher', emoji: '🔍', label: 'Researcher' },
];

/** Only asked when the learner is "Not sure yet". Everyday activities → skill ids. */
export const INTERESTS = [
  ['rs', 'Figuring out why people do what they do'], ['ia', 'Working out how an app should flow'],
  ['ui', 'Making screens look beautiful'], ['pr', 'Making things move and feel alive'],
  ['cw', 'Finding the right words'], ['br', 'Building a brand people remember'],
  ['gr', 'Getting more people to use something'], ['st', "Deciding what's worth building"],
  ['dc', 'Building real things with code or AI'], ['ld', 'Helping a team do its best work'],
];

export const PACE = [
  { min: 10, emoji: '🐢', label: 'Casual', sub: '10 min a day' },
  { min: 20, emoji: '🚶', label: 'Regular', sub: '20 min a day' },
  { min: 30, emoji: '🏃', label: 'Serious', sub: '30 min a day' },
  { min: 60, emoji: '🚀', label: 'Intense', sub: '1 hour a day' },
];

/** Quiz-show bonus round: one question per skill. Asked about the learner's strongest skills. */
export const QUIZ = {
  fd: { q: 'Two buttons sit far apart. One is big and bright, one is small and grey. What does the user assume?', a: ['They do the same thing', 'The big one is the main action', 'The grey one is broken', 'Nothing, size means nothing'], correct: 1, why: 'Size and colour create hierarchy: the eye reads bigger and brighter as more important.' },
  rs: { q: 'In an interview, which question gives the most honest answer?', a: ['Would you use this feature?', 'Do you like this design?', 'Tell me about the last time you did this.', 'Is this easy to use?'], correct: 2, why: 'People are bad at predicting the future but good at recalling the past. Ask about real past behaviour.' },
  ia: { q: 'A settings page has 40 options in one long list. What helps most?', a: ['Make the font smaller', 'Group them into labelled sections', 'Sort them alphabetically', 'Add more colours'], correct: 1, why: 'Grouping related items (chunking) lets people scan sections instead of reading 40 lines.' },
  ui: { q: 'Body text on a phone screen. Which line length reads best?', a: ['About 20 characters', 'About 45–75 characters', 'As wide as the screen allows', 'About 120 characters'], correct: 1, why: 'Roughly 45–75 characters per line keeps the eye from getting lost or jumping too often.' },
  ds: { q: 'Your app has 14 slightly different blue buttons. What is the first step to fix it?', a: ['Pick your favourite', 'Audit and list every variant', 'Delete them all', 'Make them all red'], correct: 1, why: 'You can only consolidate what you can see. An inventory comes before tokens and components.' },
  pr: { q: 'A menu slides open. Which easing feels most natural?', a: ['Linear: same speed throughout', 'Ease-out: fast start, gentle stop', 'Ease-in: slow start, sudden stop', 'No animation at all'], correct: 1, why: 'Things entering the screen should arrive quickly and settle softly. Ease-out mimics real friction.' },
  cw: { q: 'Which error message is best?', a: ['Error 422', 'Invalid input!', 'That email is missing an @. Try name@example.com.', 'Oops! Something went wrong.'], correct: 2, why: 'Good errors say what happened and how to fix it, in plain words.' },
  ax: { q: 'What is the minimum contrast ratio for normal body text (WCAG AA)?', a: ['2:1', '3:1', '4.5:1', '10:1'], correct: 2, why: 'WCAG AA asks for 4.5:1 for normal text and 3:1 for large text.' },
  st: { q: 'Which is an outcome, not an output?', a: ['Ship a new onboarding flow', 'Design 12 screens', 'Increase week-1 retention by 10%', 'Write a spec'], correct: 2, why: 'Outputs are things you make. Outcomes are the change in behaviour you want them to cause.' },
  gr: { q: 'Version B gets 3 more sign-ups than A after 40 visitors. What now?', a: ['Ship B immediately', 'Keep the test running for more data', 'Ship A', 'Stop testing forever'], correct: 1, why: 'With tiny samples, small differences are usually noise. Wait for a sample big enough to trust.' },
  br: { q: 'What is a brand, really?', a: ['The logo', 'The colour palette', 'What people feel and expect from you', 'The company name'], correct: 2, why: 'Logos and colours express a brand, but the brand itself lives in people’s heads.' },
  bz: { q: 'Presenting a redesign to an executive. What do you lead with?', a: ['Your design process', 'The business problem and impact', 'Every screen in detail', 'Your colour choices'], correct: 1, why: 'Executives decide on impact. Lead with the problem and the result, then show the work.' },
  dc: { q: 'In CSS, which layout tool is best for a one-direction row of items?', a: ['Tables', 'Flexbox', 'Floats', 'Absolute positioning'], correct: 1, why: 'Flexbox is built for one-dimensional rows or columns. Grid is for two dimensions.' },
  ld: { q: 'A workshop goes quiet and one person dominates. What helps most?', a: ['End early', 'Silent writing, then share round-robin', 'Agree with the loudest person', 'Skip to voting'], correct: 1, why: 'Writing silently first gives everyone a voice before the group anchors on one opinion.' },
};

/** Rarity on the character card, by average level across all skills. */
export const RARITY = [
  { min: 0, name: 'Rookie', color: '#9AA3B5' },
  { min: 1, name: 'Rare', color: '#4F7BFF' },
  { min: 2, name: 'Epic', color: '#9B5CFF' },
  { min: 3, name: 'Legendary', color: '#FFB800' },
];

export const PERSONA = {
  fd: 'All-Rounder', rs: 'Insight Hunter', ia: 'Flow Builder', ui: 'Pixel Crafter', ds: 'System Builder',
  pr: 'Motion Maker', cw: 'Wordsmith', ax: 'Champion for All', st: 'Product Thinker', gr: 'Growth Hacker',
  br: 'Brand Builder', bz: 'Deal Maker', dc: 'Code Crafter', ld: 'Team Captain',
};

export const PLANS = [
  { id: 'free', name: 'Free', price: '₹0', per: 'forever', cta: 'Start free', live: true,
    perks: ['Your 3D T and character card', 'All beginner chapters', 'Daily streaks & XP', 'Weekly leagues'] },
  { id: 'pro', name: 'Pro', price: 'Soon', per: '', cta: 'Coming soon', live: false,
    perks: ['Your full personal path', 'Boss projects with expert reviews', 'Tee, your AI coach, 24/7', 'Portfolio case-study export'] },
  { id: 'team', name: 'Teams', price: 'Soon', per: '', cta: 'Coming soon', live: false,
    perks: ['Everything in Pro', 'Team T-shape map', 'Shared challenges', 'Admin dashboard'] },
];
