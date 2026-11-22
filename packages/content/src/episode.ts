// Episodes: the rich lesson format. Each lesson becomes a short show with eight stages:
//   watch → check → play → finish the story → takeaways → rapid quiz → prize ladder → grade card.
// The stage order is fixed so learners know the rhythm; the scene, the mini-game and every question are
// custom per lesson. Scenes and games are code (apps/web/src/features/episode), chosen here by id.
import { z } from 'zod';

/** Animated scenes (one per lesson). Each is a pure function of time, so it can be scrubbed like a video. */
export const SceneId = z.enum(['double-diamond', 'problem-solution', 'design-thinking', 'product-team', 'gestalt', 'hierarchy', 'ux-laws', 'cognitive-load',
  'explore-check', 'qual-quant', 'research-question', 'bias',
  'mental-models', 'card-sort', 'nav-patterns', 'sitemap']);
/**
 * Mini-games (one per lesson).
 *  - `swipe-sort`: exactly two lanes; the first is swipe-left, the second swipe-right.
 *  - `myth-pop`: exactly two lanes; cards in the FIRST lane are the ones to pop.
 *  - `role-route`, `diamond-sort`: two to four lanes.
 *  - `gestalt-hunt`, `squint-test`: every card has a `visual` (a picture the game draws), not just text.
 *  - `law-lab`, `chunk-lab`: a hands-on experiment first, then the cards are classified.
 *  - `flashlight`, `scale-sort`: two lanes.
 *  - `question-forge`: needs `rounds` (build a sentence from tiles), then the cards are classified.
 *  - `red-pen`: two lanes; cards in the FIRST lane are the ones to strike; each card's `note` is shown after.
 *  - `jargon-swap`: two lanes; cards in the FIRST lane are system talk and each needs a `note` (the user's words).
 *  - `crowd-sort`: two to four lanes; every card has `agree` (share of participants who chose its lane).
 *  - `pattern-fit`: lane ids are drawn as wireframes: `tab`, `side`, `hub`, `step`.
 *  - `tree-test`: two to four lanes (top-level sections); every card is a task whose `note` is the page's path.
 */
export const GameId = z.enum(['diamond-sort', 'swipe-sort', 'myth-pop', 'role-route', 'gestalt-hunt', 'squint-test', 'law-lab', 'chunk-lab',
  'flashlight', 'scale-sort', 'question-forge', 'red-pen',
  'jargon-swap', 'crowd-sort', 'pattern-fit', 'tree-test']);

const Option = z.object({ id: z.string().min(1), label: z.string().min(1) });
const Question = z.object({
  id: z.string().min(1),
  prompt: z.string().min(1),
  options: z.array(Option).min(2).max(4),
  correct: z.string().min(1),
  /** The why, shown after answering. */
  explanation: z.string().min(1),
});

/** A caption on the scene's timeline. */
const Beat = z.object({ at: z.number().nonnegative(), title: z.string().min(1), body: z.string().optional() });

export const Episode = z.object({
  lessonId: z.string().regex(/^[a-z]{2}\.\d+-\d+$/),
  /** One line that sells the episode on its title card. */
  hook: z.string().min(1),
  scene: z.object({
    id: SceneId,
    /** Seconds. */
    duration: z.number().positive(),
    beats: z.array(Beat).min(2),
  }),
  /** Two quick questions right after watching. */
  check: z.array(Question).min(1).max(3),
  game: z.object({
    id: GameId,
    title: z.string().min(1),
    instructions: z.string().min(1),
    /** Lanes the cards go into, and the cards themselves. */
    lanes: z.array(z.object({ id: z.string().min(1), label: z.string().min(1), hint: z.string().min(1) })).min(2).max(4),
    cards: z.array(z.object({
      id: z.string().min(1), label: z.string().min(1), lane: z.string().min(1),
      /** A picture the game draws for this card (visual games); `label` stays as its accessible description. */
      visual: z.string().min(1).optional(),
      /** Shown once the card is decided, e.g. a fairer rewrite of a biased question. */
      note: z.string().min(1).optional(),
      /** Crowd games: the % of participants who put this card in `lane`. */
      agree: z.number().int().min(0).max(100).optional(),
    })).min(4).max(12),
    /** Sentence-building rounds: arrange tiles into `answer` (in order); the other tiles are distractors. */
    rounds: z.array(z.object({
      id: z.string().min(1), prompt: z.string().min(1),
      answer: z.array(z.string().min(1)).min(2).max(6),
      distractors: z.array(z.string().min(1)).min(1).max(4),
      /** Weak versions of the question, for the review deck. */
      weak: z.array(z.string().min(1)).min(1).max(3),
    })).max(4).optional(),
  }),
  /** "Finish the story": the scene replays from `from` and pauses at `at` for the learner to decide what happens. */
  gap: Question.extend({ from: z.number().nonnegative(), at: z.number().positive() }),
  takeaways: z.array(z.object({ title: z.string().min(1), body: z.string().min(1) })).min(2).max(4),
  /** Rapid quiz: answered against a timer. */
  quiz: z.object({ seconds: z.number().int().min(5).max(30), questions: z.array(Question).min(3).max(6) }),
  /** The prize ladder: questions get harder; each has a hint for the "Ask Nib" lifeline. */
  ladder: z.array(Question.extend({ hint: z.string().min(1) })).min(4).max(6),
});
export type Episode = z.infer<typeof Episode>;
export type EpisodeQuestion = z.infer<typeof Question>;
