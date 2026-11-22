// Onboarding copy. Plain words, one idea per screen, no curriculum jargon.
// Terms: "skill" (never "domain"), "deep skill" (never "spine"), "your path".
import type { Icon } from '@phosphor-icons/react';
import {
  BookOpenIcon, BriefcaseIcon, ChalkboardTeacherIcon, CodeIcon, CompassIcon, CursorClickIcon, DevicesIcon, DiamondIcon,
  FilmSlateIcon, HandshakeIcon, MagnifyingGlassIcon, MegaphoneIcon, PaintBrushIcon, PaletteIcon, PlantIcon, PuzzlePieceIcon,
  StrategyIcon, TrendUpIcon, TreeStructureIcon, UserIcon, UsersThreeIcon, RocketLaunchIcon, ArrowCounterClockwiseIcon,
} from '@phosphor-icons/react/ssr';
import type { DomainId, Goal } from '@shape/engine';

/** What each skill is, in words anyone understands, with a concrete example. */
export const SKILL_COPY: Record<DomainId, { what: string; example: string }> = {
  rs: { what: 'Talking to and watching real people to learn what they actually need.', example: 'Interviewing 5 shoppers about why they leave without paying.' },
  st: { what: 'Deciding what is worth building, and how to tell if it worked.', example: 'Picking 3 features from a list of 20 and defining success for each.' },
  fd: { what: 'Seeing why a screen works, using ideas like hierarchy, spacing and grouping.', example: 'Spotting why one checkout page feels calm and another feels messy.' },
  ia: { what: 'Planning the steps, screens and menus so people never get lost.', example: 'Mapping every screen someone sees while resetting a password.' },
  ui: { what: 'Making screens polished and clear: type, colour, spacing, icons.', example: 'Turning a rough sketch into a pixel-perfect app screen.' },
  ds: { what: 'Building reusable pieces (buttons, colours, rules) so a whole team designs consistently.', example: 'Creating one button that works in 12 places and two themes.' },
  pr: { what: 'Making designs clickable and animated so they feel real before anything is built.', example: 'Animating a card that flips when you tap “Pay”.' },
  cw: { what: 'Writing the words inside a product: buttons, errors, hints, empty screens.', example: 'Rewriting “Error 403” into something a person understands.' },
  ax: { what: 'Making sure everyone can use a product, including people with disabilities.', example: 'Checking a page works with a screen reader and a keyboard only.' },
  gr: { what: 'Designing to move numbers: more sign-ups, more people coming back.', example: 'Running an A/B test on two versions of a sign-up screen.' },
  br: { what: 'Giving a product a look and personality people remember.', example: 'Designing a logo, colours and a launch page for a new app.' },
  bz: { what: 'Understanding how products make money, and convincing people to back your ideas.', example: 'Pitching a redesign to your manager with the numbers to support it.' },
  dc: { what: 'Turning designs into working products with code, or with AI tools.', example: 'Building a real, clickable page from your design with AI help.' },
  ld: { what: 'Running workshops, guiding decisions and helping a team grow.', example: 'Facilitating a one-hour session where a team agrees on a direction.' },
};

export const LEVELS: { value: string; level: number; label: string; description: string; icon: Icon }[] = [
  { value: '0', level: 0, label: 'Not yet', description: "I haven't tried this", icon: PlantIcon },
  { value: '1', level: 1, label: 'Aware', description: "I've read or watched about it", icon: BookOpenIcon },
  { value: '3', level: 3, label: 'Practitioner', description: 'I do this in my work', icon: BriefcaseIcon },
  { value: '5', level: 5, label: 'Expert', description: 'I could teach this', icon: ChalkboardTeacherIcon },
];

export interface Aspiration { id: string; label: string; description: string; icon: Icon; spine: DomainId | null; goal: Goal; future: string }
export const ASPIRATIONS: Aspiration[] = [
  { id: 'product-designer', label: 'Product designer', description: 'Shape whole products, end to end', icon: DevicesIcon, spine: 'ia', goal: 'full-stack', future: 'Product Designer' },
  { id: 'ui-designer', label: 'UI designer', description: 'Make polished, beautiful screens', icon: PaletteIcon, spine: 'ui', goal: 'i-to-t', future: 'UI Designer' },
  { id: 'researcher', label: 'UX researcher', description: 'Understand people deeply', icon: MagnifyingGlassIcon, spine: 'rs', goal: 'i-to-t', future: 'UX Researcher' },
  { id: 'motion', label: 'Motion and interaction designer', description: 'Make products feel alive', icon: CursorClickIcon, spine: 'pr', goal: 'i-to-t', future: 'Interaction Designer' },
  { id: 'brand', label: 'Brand designer', description: 'Build brands people remember', icon: DiamondIcon, spine: 'br', goal: 'i-to-t', future: 'Brand Designer' },
  { id: 'growth', label: 'Growth designer', description: 'Design that moves numbers', icon: TrendUpIcon, spine: 'gr', goal: 'i-to-t', future: 'Growth Designer' },
  { id: 'engineer', label: 'Design engineer', description: 'Design it and build it', icon: CodeIcon, spine: 'dc', goal: 'i-to-t', future: 'Design Engineer' },
  { id: 'lead', label: 'Design leader', description: 'Lead teams and set direction', icon: UsersThreeIcon, spine: 'ld', goal: 'i-to-t', future: 'Design Leader' },
  { id: 'literate', label: 'Better at my own job', description: 'Understand how products get made', icon: PuzzlePieceIcon, spine: null, goal: 'product-literate', future: 'Product-minded Professional' },
  { id: 'explore', label: 'Not sure yet', description: 'Help me find what I enjoy', icon: CompassIcon, spine: null, goal: 't', future: 'Product Designer' },
];

export const ROLES = [
  { id: 'ui-designer', label: 'UI / visual designer', supportingText: 'Design', icon: PaletteIcon },
  { id: 'ux-designer', label: 'UX designer', supportingText: 'Design', icon: TreeStructureIcon },
  { id: 'product-designer', label: 'Product designer', supportingText: 'Design', icon: CursorClickIcon },
  { id: 'researcher', label: 'UX researcher', supportingText: 'Design', icon: MagnifyingGlassIcon },
  { id: 'graphic-designer', label: 'Graphic designer', supportingText: 'Neighbouring craft', icon: PaintBrushIcon },
  { id: 'motion-designer', label: 'Motion designer', supportingText: 'Neighbouring craft', icon: FilmSlateIcon },
  { id: 'frontend-engineer', label: 'Front-end engineer', supportingText: 'Neighbouring craft', icon: CodeIcon },
  { id: 'marketer', label: 'Marketing', supportingText: 'Neighbouring craft', icon: MegaphoneIcon },
  { id: 'sales', label: 'Sales or customer success', supportingText: 'Neighbouring craft', icon: HandshakeIcon },
  { id: 'product-manager', label: 'Product manager', supportingText: 'Neighbouring craft', icon: StrategyIcon },
  { id: 'student', label: 'Student or switching careers', supportingText: 'Starting out', icon: UserIcon },
];

export const YEARS = [
  { id: '0', label: 'Just starting' }, { id: '1', label: 'Less than a year' }, { id: '2', label: '1–3 years' },
  { id: '5', label: '3–7 years' }, { id: '8', label: '7+ years' },
];

/** Only asked when the learner is "not sure yet": everyday activities that map to skills. */
export const INTERESTS: { value: DomainId; label: string }[] = [
  { value: 'rs', label: 'Understanding people' }, { value: 'ia', label: 'Working out how an app flows' },
  { value: 'ui', label: 'Beautiful screens' }, { value: 'pr', label: 'Motion and interaction' },
  { value: 'cw', label: 'Words and tone' }, { value: 'br', label: 'Brands people remember' },
  { value: 'gr', label: 'Growing a product' }, { value: 'st', label: 'Deciding what to build' },
  { value: 'dc', label: 'Building with code' }, { value: 'ld', label: 'Helping a team do its best' },
];

export const PACE = [
  { value: '10', label: 'Casual', hint: '10 min/day' }, { value: '20', label: 'Regular', hint: '20 min/day' },
  { value: '30', label: 'Serious', hint: '30 min/day' }, { value: '60', label: 'Intense', hint: '1 h/day' },
];

export const START_MODES = [
  { value: 'path', label: 'Follow my path', description: 'Skip what you already know', icon: RocketLaunchIcon },
  { value: 'zero', label: 'Start from zero', description: 'Every basic, from chapter one', icon: ArrowCounterClockwiseIcon },
];

/** Quick check: one scenario question per skill; asked about the learner's three strongest skills. */
export const QUIZ: Record<DomainId, { q: string; a: string[]; correct: number; why: string }> = {
  fd: { q: 'Two buttons sit side by side. One is large and dark, one is small and light. What will most people assume?', a: ['They do the same thing', 'The large one is the main action', 'The light one is broken', 'Size means nothing'], correct: 1, why: 'Size and contrast create hierarchy: the eye reads larger and stronger as more important.' },
  rs: { q: 'In an interview, which question gets the most honest answer?', a: ['Would you use this feature?', 'Do you like this design?', 'Tell me about the last time you did this.', 'Is this easy to use?'], correct: 2, why: 'People are poor at predicting the future but good at recalling the past. Ask about real past behaviour.' },
  ia: { q: 'A settings page has 40 options in one long list. What helps most?', a: ['Smaller font', 'Group them into labelled sections', 'Sort alphabetically', 'More colour'], correct: 1, why: 'Grouping related items lets people scan a few sections instead of reading 40 lines.' },
  ui: { q: 'Body text on a phone. Which line length reads best?', a: ['About 20 characters', 'About 45–75 characters', 'As wide as the screen', 'About 120 characters'], correct: 1, why: 'Around 45–75 characters per line keeps the eye from getting lost or jumping too often.' },
  ds: { q: 'Your app has 14 slightly different blue buttons. What do you do first?', a: ['Pick your favourite', 'List every variant you can find', 'Delete them all', 'Make them all red'], correct: 1, why: 'You can only consolidate what you can see. An inventory comes before tokens and components.' },
  pr: { q: 'A menu slides open. Which easing feels most natural?', a: ['Linear: constant speed', 'Ease-out: fast start, gentle stop', 'Ease-in: slow start, sudden stop', 'No animation'], correct: 1, why: 'Things entering the screen should arrive quickly and settle softly, like real objects with friction.' },
  cw: { q: 'Which error message is best?', a: ['Error 422', 'Invalid input', 'That email is missing an @. Try name@example.com.', 'Something went wrong.'], correct: 2, why: 'Good errors say what happened and how to fix it, in plain words.' },
  ax: { q: 'What is the minimum contrast for normal body text (WCAG AA)?', a: ['2:1', '3:1', '4.5:1', '10:1'], correct: 2, why: 'WCAG AA asks for 4.5:1 for normal text and 3:1 for large text.' },
  st: { q: 'Which of these is an outcome, not an output?', a: ['Ship a new onboarding flow', 'Design 12 screens', 'Increase week-1 retention by 10%', 'Write a spec'], correct: 2, why: 'Outputs are things you make. Outcomes are the change in behaviour they are meant to cause.' },
  gr: { q: 'Version B gets 3 more sign-ups than A after 40 visitors. What now?', a: ['Ship B now', 'Keep the test running', 'Ship A', 'Stop testing'], correct: 1, why: 'With tiny samples, small differences are usually noise. Wait for a sample you can trust.' },
  br: { q: 'What is a brand, really?', a: ['The logo', 'The colour palette', 'What people feel and expect from you', 'The company name'], correct: 2, why: 'Logos and colours express a brand, but the brand itself lives in people’s minds.' },
  bz: { q: 'You present a redesign to an executive. What do you lead with?', a: ['Your process', 'The business problem and impact', 'Every screen in detail', 'Your colour choices'], correct: 1, why: 'Executives decide on impact. Lead with the problem and the result, then show the work.' },
  dc: { q: 'In CSS, which tool is best for a single row of items?', a: ['Tables', 'Flexbox', 'Floats', 'Absolute positioning'], correct: 1, why: 'Flexbox is built for one-direction rows or columns. Grid is for two dimensions.' },
  ld: { q: 'A workshop goes quiet and one person dominates. What helps most?', a: ['End early', 'Silent writing, then share in turn', 'Agree with the loudest person', 'Skip to voting'], correct: 1, why: 'Writing silently first gives everyone a voice before the group anchors on one opinion.' },
};

export const PERSONA: Record<DomainId, string> = {
  fd: 'All-rounder', rs: 'Insight Hunter', ia: 'Flow Builder', ui: 'Pixel Crafter', ds: 'System Builder',
  pr: 'Motion Maker', cw: 'Wordsmith', ax: 'Inclusive Designer', st: 'Product Thinker', gr: 'Growth Designer',
  br: 'Brand Builder', bz: 'Deal Maker', dc: 'Design Engineer', ld: 'Team Lead',
};

export const PLANS = [
  { id: 'free', name: 'Free', price: '₹0', per: 'during early access', live: true, perks: ['Your skill profile and character card', 'All beginner chapters', 'Daily streaks and XP', 'Weekly leagues'] },
  { id: 'pro', name: 'Pro', price: 'Coming soon', per: '', live: false, perks: ['Your full personal path', 'Boss projects with expert review', 'Your AI buddy, any time', 'Portfolio case-study export'] },
  { id: 'team', name: 'Teams', price: 'Coming soon', per: '', live: false, perks: ['Everything in Pro', 'Team skill map', 'Shared challenges', 'Admin dashboard'] },
];

export const STATION_STORY: Record<string, string> = {
  discover: 'Every product starts here: listening to people and deciding what is worth solving.',
  design: 'Ideas become flows, screens, systems and words people can actually use.',
  grow: 'A product only matters if people find it, remember it and come back.',
  build: 'Design ships through code, and great teams need someone to lead them.',
};
