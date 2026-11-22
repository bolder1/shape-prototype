// Episodes: the rich lesson format. Each lesson becomes a short show with eight stages:
//   watch → check → play → finish the story → takeaways → rapid quiz → prize ladder → grade card.
// The stage order is fixed so learners know the rhythm; the scene, the mini-game and every question are
// custom per lesson. Scenes and games are code (apps/web/src/features/episode), chosen here by id.
import { z } from 'zod';

/** Animated scenes (one per lesson). Each is a pure function of time, so it can be scrubbed like a video. */
export const SceneId = z.enum(['double-diamond', 'problem-solution', 'design-thinking', 'product-team', 'gestalt', 'hierarchy', 'ux-laws', 'cognitive-load',
  'explore-check', 'qual-quant', 'research-question', 'bias',
  'mental-models', 'card-sort', 'nav-patterns', 'sitemap',
  'spacing-scale', 'responsive-grid', 'whitespace', 'alignment',
  'clear-clever', 'button-labels', 'error-messages', 'empty-states',
  'outcome-output', 'opportunity-tree', 'prioritization',
  'script-shape', 'probing', 'jobs', 'context-visit',
  'type-anatomy', 'type-scale', 'font-pairing', 'measure',
  'colour-models', 'palette-build', 'semantic-colour', 'contrast-dark',
  'atomic', 'tokens', 'inconsistency',
  'fidelity', 'question-proto', 'proto-links',
  'spectrum', 'pour', 'colour-blind', 'targets',
  'funnel', 'aha', 'fogg', 'dark-patterns']);
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
 *  - `spacing-fix`: lanes `t`, `m`, `l` (tight, medium, loose); every card has a `visual` the game draws (a pair of elements).
 *  - `column-span`: lane ids are column counts that divide 12 (e.g. `3`, `4`, `6`, `12`).
 *  - `line-cut`: two lanes; cards in the FIRST lane are the ones to cut; each card's `note` is shown after.
 *  - `align-snap`: lanes `left`, `center`, `right`.
 *  - `glance-test`: two lanes; cards in the FIRST lane are the unclear ones and each needs a `note` (a clear rewrite).
 *  - `button-forge`: needs `rounds` (build a button label from tiles), then the cards are classified.
 *  - `error-doctor`: lanes `vague`, `nofix`, `blame`, `good`; every card not in `good` needs a `note` (a better message).
 *  - `empty-match`: lanes `first`, `done`, `noresults`, `error` (each drawn as its own empty screen).
 *  - `rung-sort`: lanes `problem`, `outcome`, `output`.
 *  - `ost-grow`: two to four lanes (opportunities); cards are solutions hung under them.
 *  - `rice-duel`: lanes `a`, `b`; every card's `visual` is two ideas, "Name|reach|impact|confidence%|effort;Name|…" (see `riceIdeas`).
 *  - `script-builder`: lanes `open`, `broad`, `deep`, `close` (the parts of an interview script, in order).
 *  - `chat-probe`: two lanes; every card's `visual` is what the participant just said, `label` is the follow-up;
 *    cards in the FIRST lane are weak follow-ups and each needs a `note` (a better one).
 *  - `job-forge`: needs `rounds` (build a job story from tiles), then the cards are classified.
 *  - `ask-watch`: lanes `ask`, `watch`.
 *  - `anatomy-pin`: lanes `cap`, `x`, `base`, `desc` (the lines of a letter, drawn on a giant word).
 *  - `size-it`: lanes `display`, `heading`, `body`, `small`; every card's `visual` names a piece of the reading screen it sizes.
 *  - `pair-judge`: lanes `works`, `clash`; every card's `visual` is "headingFont|weight|bodyFont|weight" (or `five`) and has a `note`.
 *  - `measure-tune`: lanes `measure`, `leading`, `ok`; every card's `visual` is "characters|lineHeight" (see `measureVerdict`).
 *  - `hsl-dial`: lanes `h`, `s`, `l`; every card's `visual` is a change "h,s,l>h,s,l" where only the card's dial moves (see `hslDial`).
 *  - `ramp-pick`: lanes `tint`, `border`, `solid`, `ink` (zones of a 50–900 ramp); every card's `visual` names the element it paints.
 *  - `token-route`: lanes `error`, `success`, `warning`, `info`; every card's `label` is the message a toast shows.
 *  - `atom-stack`: lanes `atom`, `molecule`, `organism`, `template` (bottom to top); every card's `visual` names the part it draws.
 *  - `token-swap`: lanes `color`, `space`, `text`, `radius` (each lane's `label` is the token name); every card's `visual` names the screen element it binds.
 *  - `debt-hunt`: lanes `debt`, `ok`; every card's `visual` is a button "bg|radius|paddingX|weight|label"; `ok` cards all match one system style, `debt` cards differ and need a `note`.
 *  - `fidelity-pick`: lanes `paper`, `wire`, `hifi`, `code` (cheapest to dearest; the game charges each lane's cost).
 *  - `proto-scope`: needs `rounds` (forge the prototype's question), then lanes `cut`, `keep`; every card needs a `note`.
 *  - `wire-flow`: lanes `navigate`, `overlay`, `back`, `change` (Figma prototype actions the game plays back).
 *  - `persona-spectrum`: lanes `perm`, `temp`, `sit`; every card's `visual` is a sense (`touch`, `see`, `hear`) and each sense × lane cell holds exactly one card.
 *  - `pour-sort`: lanes `p`, `o`, `u`, `r` (Perceivable, Operable, Understandable, Robust), drawn as pillars.
 *  - `cvd-fix`: lanes `broken`, `clear`; every card's `visual` names a mini design the game draws (and simulates for colour blindness) and has a `note`.
 *  - `target-spot`: lanes `problem`, `ok`; every card's `visual` names an element of the checkout mock and has a `note`.
 *  - `funnel-leak`: lanes `acq`, `act`, `ret`, `rev`; every card's `visual` is a funnel "visitors|sign-ups|activated|retained|paying" and its lane is the leakiest step (see `leakiestStep`).
 *  - `aha-path`: lanes `before`, `later`, `cut`; every card needs a `note`.
 *  - `fogg-fix`: lanes `motivation`, `ability`, `prompt`; every card's `visual` is "motivation,ability,prompt" (1–9, 1–9, 0/1) and its lane is the missing factor (see `foggMissing`).
 *  - `dark-spot`: lanes `dark`, `fair`; every card's `visual` names a mini UI the game draws and has a `note`.
 *  - `contrast-check`: lanes `pass`, `large`, `fail`; every card's `visual` is "#fg|#bg" and its lane is what WCAG says (see `contrastLane`).
 */
export const GameId = z.enum(['diamond-sort', 'swipe-sort', 'myth-pop', 'role-route', 'gestalt-hunt', 'squint-test', 'law-lab', 'chunk-lab',
  'flashlight', 'scale-sort', 'question-forge', 'red-pen',
  'jargon-swap', 'crowd-sort', 'pattern-fit', 'tree-test',
  'spacing-fix', 'column-span', 'line-cut', 'align-snap',
  'glance-test', 'button-forge', 'error-doctor', 'empty-match',
  'rung-sort', 'ost-grow', 'rice-duel',
  'script-builder', 'chat-probe', 'job-forge', 'ask-watch',
  'anatomy-pin', 'size-it', 'pair-judge', 'measure-tune',
  'hsl-dial', 'ramp-pick', 'token-route', 'contrast-check',
  'atom-stack', 'token-swap', 'debt-hunt',
  'fidelity-pick', 'proto-scope', 'wire-flow',
  'persona-spectrum', 'pour-sort', 'cvd-fix', 'target-spot',
  'funnel-leak', 'aha-path', 'fogg-fix', 'dark-spot']);

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

/** One idea in a RICE duel. Confidence is a percentage. */
export interface RiceIdea { name: string; reach: number; impact: number; confidence: number; effort: number }
/** Parses a `rice-duel` card's visual: "Name|reach|impact|confidence%|effort;Name|…". */
export const riceIdeas = (visual: string): RiceIdea[] => visual.split(';').map(part => {
  const [name, reach, impact, confidence, effort] = part.split('|');
  return { name, reach: Number(reach), impact: Number(impact), confidence: Number(confidence), effort: Number(effort) };
});
/** Reach × Impact × Confidence ÷ Effort. */
export const riceScore = (i: RiceIdea) => (i.reach * i.impact * (i.confidence / 100)) / i.effort;
/** A body-text setting in a `measure-tune` card: characters per line and line height. */
export interface MeasureSetting { chars: number; leading: number }
/** Parses a `measure-tune` card's visual: "characters|lineHeight". */
export const measureSetting = (visual: string): MeasureSetting => { const [chars, leading] = visual.split('|').map(Number); return { chars, leading }; };
/** Comfortable body text: 45–75 characters a line, line height 1.4–1.7. */
export const MEASURE = { chars: [45, 75], leading: [1.4, 1.7] } as const;
const within = (n: number, [lo, hi]: readonly [number, number]) => n >= lo && n <= hi;
/** What to fix first in a body-text setting: the line length, then the line height. */
export const measureVerdict = (s: MeasureSetting): 'measure' | 'leading' | 'ok' =>
  !within(s.chars, MEASURE.chars) ? 'measure' : !within(s.leading, MEASURE.leading) ? 'leading' : 'ok';
/** An HSL colour: hue 0–360, saturation and lightness 0–100. */
export type Hsl = [number, number, number];
/** Parses a `hsl-dial` card's visual: "h,s,l>h,s,l". */
export const hslChange = (visual: string): { from: Hsl; to: Hsl } => {
  const [from, to] = visual.split('>').map(part => part.split(',').map(Number) as Hsl);
  return { from, to };
};
/** The one dial a change turns, or null when it turns none or several. */
export const hslDial = ({ from, to }: { from: Hsl; to: Hsl }): 'h' | 's' | 'l' | null => {
  const moved = (['h', 's', 'l'] as const).filter((_, i) => from[i] !== to[i]);
  return moved.length === 1 ? moved[0] : null;
};

/** WCAG relative luminance of a #rrggbb colour. */
const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
/** WCAG contrast ratio between two #rrggbb colours, from 1 to 21. */
export const contrastRatio = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
/** WCAG AA: 4.5:1 for body text, 3:1 for large text and icons. */
export const contrastLane = (ratio: number): 'pass' | 'large' | 'fail' => (ratio >= 4.5 ? 'pass' : ratio >= 3 ? 'large' : 'fail');
/** The four steps between funnel stages, in order. */
export const FUNNEL_STEPS = ['acq', 'act', 'ret', 'rev'] as const;
/** Parses a `funnel-leak` card's visual into stage counts. */
export const funnelCounts = (visual: string) => visual.split('|').map(Number);
/** Conversion rate of each step (stage n+1 ÷ stage n). */
export const funnelRates = (counts: number[]) => counts.slice(1).map((n, i) => n / counts[i]);
/** The step with the lowest conversion. */
export const leakiestStep = (counts: number[]) => { const r = funnelRates(counts); return FUNNEL_STEPS[r.indexOf(Math.min(...r))]; };
/** Parses a `fogg-fix` card's visual: "motivation,ability,prompt". */
export const foggPoint = (visual: string) => { const [m, a, p] = visual.split(',').map(Number); return { m, a, p }; };
/** Which factor is missing: no prompt, then low motivation, then low ability. */
export const foggMissing = ({ m, a, p }: { m: number; a: number; p: number }): 'prompt' | 'motivation' | 'ability' => (!p ? 'prompt' : m <= 3 ? 'motivation' : 'ability');
export type EpisodeQuestion = z.infer<typeof Question>;
