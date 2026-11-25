// Marketing copy for the landing page (/). Everything here is either a product fact from docs/ or derived from real data.
// Rules: no em dashes, no invented numbers, no testimonials until real ones exist (antislop R-02, R-17, R-18).
import type { DomainId, Goal } from '@shape/engine';

// Draft hero (Claude's wording, awaiting the owner's positioning call). Replace freely.
export const HERO = {
  headline: 'Learn product design by playing it',
  sub: 'Map where you stand across 14 design skills, see the designer you could become, and get there through 3 to 5 minute episodes built around your answers.',
};

/** Example starting points for the hero demo. Each runs through the real path engine (buildPath), nothing is hand-drawn. */
export const SAMPLE_PROFILES: { id: string; label: string; role: string; goal: Goal; spine: DomainId[]; selfRating: Partial<Record<DomainId, number>> }[] = [
  { id: 'visual', label: 'UI designer', role: 'Product designer', goal: 'i-to-t', spine: ['ui'], selfRating: { ui: 4, fd: 3, br: 2, pr: 2 } },
  { id: 'motion', label: 'Motion designer', role: 'Product-literate motion designer', goal: 'product-literate', spine: ['pr'], selfRating: { pr: 4, ui: 3, br: 2, fd: 1 } },
  { id: 'frontend', label: 'Front-end dev', role: 'Design engineer', goal: 'i-to-t', spine: ['dc'], selfRating: { dc: 4, ds: 2, ui: 2, ax: 1 } },
];

/** The four stations of the onboarding road, one per skill family. Copy mirrors docs/05-onboarding-story.md. */
export const STATIONS: { family: 'discover' | 'design' | 'grow' | 'build'; scene: string }[] = [
  { family: 'discover', scene: 'An interview room and a wall of sticky notes that cluster into an insight.' },
  { family: 'design', scene: 'A drafting table where wireframes turn into polished screens.' },
  { family: 'grow', scene: 'A launch stage, a growth chart and a brand billboard.' },
  { family: 'build', scene: 'A code terminal and a workshop table for the team.' },
];

/** XP rules from docs/01-product-vision.md §7. Shown as-is: these are the real rules the app uses. */
export const XP_RULES = [
  { event: 'Pass a lesson check on the first try', xp: '10' },
  { event: 'Pass after a retry', xp: '5' },
  { event: 'Answer a review card when it is due', xp: '3' },
  { event: 'Pass a boss project (rubric 70% or more)', xp: '50' },
  { event: 'Boss project with distinction (90% or more)', xp: '+25' },
];

/** What a first-time visitor needs settled before starting onboarding. Answers are product facts from docs/. */
export const FAQ = [
  {
    q: 'I’m not a designer. Is this for me?',
    a: 'Yes. Pick “better at my own job” in onboarding and your craft (motion, code, marketing, sales, product) becomes your home base. Shape then brings the core product loop (foundations, research, flows, strategy) up to working level and keeps everything else at literacy, so you understand the whole product without changing careers.',
  },
  {
    q: 'How much time does it take?',
    a: 'Episodes take 3 to 5 minutes. In onboarding you choose a daily pace of 10, 20, 30 or 60 minutes, and your roadmap shows the weeks that pace adds up to.',
  },
  {
    q: 'What does it cost?',
    a: 'Nothing during early access. Pro and Teams plans will come later, priced in rupees.',
  },
  {
    q: 'How do I earn XP? Can I just click through?',
    a: 'Clicking through earns nothing. XP comes from passed checks, reviews done on time and boss projects that pass the rubric. Opening a lesson is worth zero, so leagues reward skill, not speed.',
  },
  {
    q: 'What is a boss project?',
    a: 'The brief at the end of each chapter: 30 to 90 minutes of real work, scored against a weighted rubric with required elements. You can fail it, and that is the point.',
  },
  {
    q: 'Who is Nib?',
    a: 'Your buddy. Nib walks the onboarding road with you, explains why each question matters, and inside every episode you can ask Nib about the concept you are stuck on.',
  },
];
