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
  'funnel', 'aha', 'fogg', 'dark-patterns',
  'brand-layers', 'positioning', 'moodboard',
  'business-models', 'unit-economics', 'buying-journey',
  'dom-tree', 'box-model', 'frontend-build',
  'case-study', 'portfolio-crit', 'whiteboard',
  'happy-path', 'fewer-steps', 'ui-states',
  'taste-reason', 'feedback-frame', 'receive-critique',
  'affinity-map', 'observation-insight', 'persona-jtbd', 'journey-map',
  'task-writing', 'mod-unmod', 'severity', 'heuristic-eval',
  'stay-ugly', 'wire-grid', 'pattern-library',
  'form-pain', 'press-feedback', 'two-devices', 'direct-touch',
  'component-kit', 'icon-audit', 'image-choice', 'table-tidy',
  'token-tiers', 'mode-swap', 'token-names',
  'prop-sprawl', 'variant-explosion', 'doc-page',
  'ease-curves', 'motion-timing', 'motion-meaning', 'reduced-motion']);
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
 *  - `brand-layer`: lanes `logo`, `identity`, `brand` (drawn as rings, inside out).
 *  - `voice-fit`: needs `rounds` (forge a positioning statement), then lanes `off`, `on`; every card needs a `note`.
 *  - `mood-build`: lanes `drop`, `keep`; every card's `visual` names a tile the game draws and has a `note`.
 *  - `model-match`: lanes `sub`, `mkt`, `ads`, `free` (each drawn as a money-flow diagram).
 *  - `unit-calc`: lanes `losing`, `risky`, `healthy`; every card's `visual` is "price|months|margin%|CAC" and its lane follows `unitHealth`.
 *  - `buyer-role`: lanes `user`, `buyer`, `it`, `proc` (the B2B buying group).
 *  - `tag-match`: lanes `header`, `nav`, `main`, `footer` (regions of a page wireframe; drag or tap).
 *  - `flex-tune`: lanes `direction`, `justify`, `align`, `gap`; every card's `visual` is the CSS declaration that solves it, for its lane's property.
 *  - `fe-flow`: lanes `design`, `component`, `data`, `ship` (stations of a pipeline).
 *  - `case-order`: lanes `context`, `process`, `solution`, `outcome` (sections of a case study page; drag or tap).
 *  - `portfolio-crit`: lanes `weak`, `strong`; every card needs a `note` (how a reviewer would see it).
 *  - `whiteboard-step`: lanes `clarify`, `users`, `ideas`, `measure` (whiteboard columns, in order).
 *  - `edge-branch`: lanes `email`, `code`, `password`, `done` (steps of a password reset, in order); every card needs a `note` (its recovery).
 *  - `step-trim`: lanes `cut`, `merge`, `defer`, `keep`; every card needs a short `visual` (its screen's name in the flow strip) and a `note`.
 *  - `state-pick`: lanes `empty`, `loading`, `error`, `success` (the phone draws each); every card needs a `note`.
 *  - `taste-filter`: lanes `taste`, `reason`; every card's `visual` is the part of the Kosh home screen it's about (one of `KOSH_PARTS`) and it needs a `note`.
 *  - `frame-feedback`: lanes `like`, `wish`, `whatif`, `bin`; every card needs a `note`, and every card outside `bin` a `visual`: the thought rewritten as a sentence that starts with its lane's lead (`FRAME_LEAD`).
 *  - `calm-reply`: lanes `ask`, `note`, `context`; every card's `visual` is the defensive reflex reply (struck out once decided) and its `note` the better reply.
 *  - `affinity-wall`: up to 4 lanes (groups, each labelled as a sentence a participant could say); every card's `visual` is who it came from (`P1`…`P12`, see `participantOf`), distinct within a group, and it needs a `note`.
 *  - `insight-sharpen`: lanes `why`, `who`, `fix`, `good` (what the draft lacks); every card's `visual` is the sharp version as "who|what they do|because why" (see `insightParts`), and a `good` card's label is that sentence.
 *  - `tool-fit`: lanes `persona`, `job`, `arch`; every card's `visual` is the line of that tool that answers it (one of `TOOL_PARTS[lane]`) and it needs a `note`.
 *  - `journey-plot`: lanes are `JOURNEY_STAGES` in order; every card's `visual` is how the person felt, an integer from -2 to 2 (see `journeyFeelings`), and it needs a `note`.
 *  - `task-fix`: lanes `leak`, `steps`, `vague`, `good`; every card needs a `note` (for a flawed task, the rewrite in quotes). A flawed card's `visual` is the run of words in its label that spoils it (see `flawSpan`); a `good` card has none.
 *  - `method-pick`: lanes `person`, `remote`, `unmod`; every card's `visual` is how many people take part (costed by `studyCost`), and it needs a `note`.
 *  - `severity-rate`: lanes are `SEVERITY` in order; every card's `visual` is "people of 5 who hit it|impact 1–3" (see `findingOf`), its lane is what `severityOf` says, and it needs a `note`.
 *  - `heuristic-sweep`: up to 4 lanes, each a heuristic id from `NIELSEN_10`; every card's `visual` is the part of the Safar booking screen that breaks it (one of `SAFAR_PARTS`, each used once) and its `note` the fix.
 *  - `fidelity-tidy`: lanes `plain`, `real`, `fine`; every card's `visual` is the part of the Khelo turf-list wireframe it's about (one of `KHELO_PARTS`, each used once), and it needs a `note`.
 *  - `grid-place`: lanes `bleed`, `full`, `main`, `side` (areas of a 12-column page, see `GRID_AREA`); every card's `visual` is its row on the page (1, 2, …). A row holds one `bleed` or `full` block, or a `main` block with at most one `side` block beside it (see `phoneStack`). Every card needs a `note`.
 *  - `pattern-stamp`: lanes `cards`, `chips`, `form`, `sheet` (patterns from the wireframe library, drawn by the game); every card's `visual` is the screen of the Khelo booking flow it goes on (one of `KHELO_SCREENS`, every screen used), and it needs a `note`.
 *  - `form-triage`: lanes `label`, `keyboard`, `error`, `cut` (see `FORM_LANES`); every card's `visual` is a field of Mandi's sign-up form (a key of `MANDI_FIELDS`, every field used once), its lane is the fix that field needs, and it needs a `note`.
 *  - `wait-feedback`: lanes are `FEEDBACK` in order; every card's `visual` is how long the action takes in ms, its lane is what `feedbackFor` says, and it needs a `note`.
 *  - `port-phone`: lanes `show`, `menu`, `sheet`, `thumb`; every card's `visual` is the part of the desktop packing dashboard it's about (one of `PACKING_PARTS`, each used once), and its `note` the phone version.
 *  - `gesture-map`: lanes are `GESTURES` in order; every card needs a `note`, and every card that isn't a tap has a `visual`: the visible button that does the same job, because a gesture is never the only way.
 *  - `state-sheet`: lanes are `KIT_STATES` in order; every card's `visual` is the component it puts in that state (one of `KIT_PARTS`), each component × state cell is used at most once, and every card needs a `note`.
 *  - `icon-odd`: lanes `style`, `size`, `meaning`, `label` (how one icon breaks its row); every card's `visual` is a row of five icons and the odd one's place, "home,search,…|2", plus for `style` and `size` cards how it's drawn wrong, "…|2|fill" (see `iconRow`, `ICON_FLAWS`). A `meaning` card's odd icon is one of `WRONG_METAPHORS`, and no other icon is. Every card needs a `note`.
 *  - `image-budget`: lanes are `IMAGE_KINDS` in order; every card's `visual` is the short name of the screen the image goes on, and it needs a `note`. The game adds up each pick's weight with `pageWeight`.
 *  - `table-build`: lanes `align`, `format`, `stress`, `cut`; every card's `visual` is the part of Hisaab's udhaar table it fixes (one of `LEDGER_PARTS`, each used once), and it needs a `note`.
 *  - `tier-edit`: lanes are `TOKEN_TIERS` in order; every card is a change request, its `visual` is the one Rasta token to edit (its tier is the lane, see `tierOf`) and, after a colon, what it becomes: a raw value for a primitive, another primitive for a semantic or component token ("color-action-primary:amber-700"). Editing the token's parent instead must reach further (`blastRadius`). Every card needs a `note`.
 *  - `mode-tune`: lanes `surface`, `text`, `accent`, `border` (the kind of colour, which sets the rule); every card's `visual` is a semantic colour from `MODE_SPECS`, tuned along its ramp for dark mode and checked by `darkCheck`. Its light-mode step must fail in dark mode. Every card needs a `note`.
 *  - `token-rename`: lanes are `NAME_FLAWS` in order; every card's `label` is "badName · where it's used", the lane is what `nameFlaw` says about the bad name, and the `visual` is the good name (no flaw), built from tiles. Every card needs a `note`.
 *  - `api-build`: lanes are `API_KINDS` in order; every card's `label` is "oldProp · what it's used for" (a prop of the old Button, see `oldPropKind`), and its `visual` is what it becomes in the new API: an enum option for `enum` ("variant=danger"), the prop's name for `boolean`, the slot's name for `slot`, and for `fixed` the prop or token that now decides it ("size", "button-radius"). The game builds the API with `apiFrom` and counts its looks with `comboCount`. Every card needs a `note`.
 *  - `prop-type`: lanes are `PROP_TYPES` in order (Figma's variant, boolean, text and instance-swap properties); every card is one thing that varies on Rasta's Button, and its `visual` is the values it takes, comma-separated. Only `variant` cards multiply the frames you draw (`frameCount`). Every card needs a `note`.
 *  - `doc-rewrite`: lanes are `DOC_BLOCKS` in order; every card's `label` is a paragraph from the old Button docs, and its `visual` is the rewrite that goes in that block of the new page (shorter: see `readSeconds`). A `cut` card has no visual. Every card needs a `note`.
 *  - `ease-tune`: lanes are `EASES` in order; every card is a moment in Dabba, its `visual` is where the thing starts and ends ("off>on", "on>off", "on>on", "loop" or "finger"), and its lane is `curveFor(visual)`. The game plays the motion on the curve you pick (`bezierAt`) beside the right one. Every card needs a `note`.
 *  - `duration-tune`: lanes are the `DURATION_BANDS` ids in order; every card is a transition in Dabba, its `visual` is "ms|kind" (how long Dabba's first build ran it, outside the card's band, and one of `DURATION_KINDS` to draw). You tune the duration on a slider and it is judged by `durationVerdict`. Every card needs a `note`.
 *  - `motion-purpose`: lanes are `MOTION_JOBS` in order; every card is a motion in Dabba, its `visual` one of `MEANING_MOTIONS` (each used once), drawn and played by the game. Every card needs a `note`.
 *  - `motion-audit`: lanes are `REDUCE_LANES` in order; every card's `visual` is a part of Dabba's home screen (a key of `DABBA_MOTIONS`, each used once), and its lane is what `reduceFor` says it becomes when Reduce motion is on. Every card needs a `note`.
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
  'funnel-leak', 'aha-path', 'fogg-fix', 'dark-spot',
  'brand-layer', 'voice-fit', 'mood-build',
  'model-match', 'unit-calc', 'buyer-role',
  'tag-match', 'flex-tune', 'fe-flow',
  'case-order', 'portfolio-crit', 'whiteboard-step',
  'edge-branch', 'step-trim', 'state-pick',
  'taste-filter', 'frame-feedback', 'calm-reply',
  'affinity-wall', 'insight-sharpen', 'tool-fit', 'journey-plot',
  'task-fix', 'method-pick', 'severity-rate', 'heuristic-sweep',
  'fidelity-tidy', 'grid-place', 'pattern-stamp',
  'form-triage', 'wait-feedback', 'port-phone', 'gesture-map',
  'state-sheet', 'icon-odd', 'image-budget', 'table-build',
  'tier-edit', 'mode-tune', 'token-rename',
  'api-build', 'prop-type', 'doc-rewrite',
  'ease-tune', 'duration-tune', 'motion-purpose', 'motion-audit']);

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

/** The parts of the Kosh home screen a `taste-filter` card can point at (the game and scene draw each). */
export const KOSH_PARTS = ['balance', 'banner', 'actions', 'fee', 'history'] as const;
export type KoshPart = (typeof KOSH_PARTS)[number];
/** How each part of the I like / I wish / What if frame starts (`frame-feedback` lanes). */
export const FRAME_LEAD = { like: 'I like', wish: 'I wish', whatif: 'What if' } as const;

/** Who an `affinity-wall` note came from: "P7" → 7. */
export const participantOf = (visual: string) => Number(visual.replace(/^P/, ''));
/** A theme's reach: how many different participants its notes came from. */
export const themeReach = (visuals: readonly string[]) => new Set(visuals.map(participantOf)).size;
/** The three parts of an `insight-sharpen` visual: "who|what they do|because why". */
export const insightParts = (visual: string) => { const [who, what, why] = visual.split('|'); return { who, what, why }; };
/** The lines each `tool-fit` artefact draws (lane → parts). */
export const TOOL_PARTS = { persona: ['context', 'goal', 'frustration'], job: ['situation', 'motivation', 'outcome'], arch: ['remote', 'self', 'helper'] } as const;
export type ToolLane = keyof typeof TOOL_PARTS;
/** Stages of a remote medicine refill (`journey-plot` lanes), in order. */
export const JOURNEY_STAGES = ['notice', 'rx', 'order', 'arrive'] as const;
/** Average feeling (−2…2) at each stage from the evidence placed there (a card's `visual`); null where there is none yet. */
export const journeyFeelings = (cards: readonly { lane: string; visual?: string }[]) => JOURNEY_STAGES.map(s => {
  const f = cards.filter(c => c.lane === s).map(c => Number(c.visual));
  return f.length ? f.reduce((a, b) => a + b, 0) / f.length : null;
});
/** The stage where people feel worst: the journey's low point (null before any evidence). */
export const journeyLow = (cards: readonly { lane: string; visual?: string }[]) => {
  const f = journeyFeelings(cards);
  let low = -1;
  f.forEach((v, i) => { if (v !== null && (low < 0 || v < (f[low] as number))) low = i; });
  return low < 0 ? null : JOURNEY_STAGES[low];
};

/** A `task-fix` task as the words the game lets you tap. */
export const taskWords = (label: string) => label.split(' ');
/** Where a `task-fix` flaw sits: the first and last word index of `phrase` inside `label`, or null if it isn't there. */
export const flawSpan = (label: string, phrase: string): [number, number] | null => {
  const w = taskWords(label), f = taskWords(phrase);
  for (let i = 0; i + f.length <= w.length; i++) if (f.every((x, k) => w[i + k] === x)) return [i, i + f.length - 1];
  return null;
};
/** Rough cost of one study by method (`method-pick` lanes): calendar days until you have results, and incentives and travel in rupees. */
export const METHOD_COST = {
  person: { setupDays: 3, daysEach: 0.5, rupeesEach: 2000 },
  remote: { setupDays: 2, daysEach: 0.25, rupeesEach: 1000 },
  unmod: { setupDays: 2, daysEach: 0, rupeesEach: 400 },
} as const;
export type Method = keyof typeof METHOD_COST;
export const studyCost = (method: Method, people: number) => { const m = METHOD_COST[method]; return { days: m.setupDays + people * m.daysEach, rupees: people * m.rupeesEach }; };
/** Severity ratings, lowest first (`severity-rate` lanes). */
export const SEVERITY = ['cosmetic', 'minor', 'major', 'critical'] as const;
export type Severity = (typeof SEVERITY)[number];
/** A `severity-rate` visual: "people of 5 who hit it|impact", impact 1 = noticed it, 2 = slowed down or detoured, 3 = blocked or lost money. */
export const findingOf = (visual: string) => { const [users, impact] = visual.split('|').map(Number); return { users, impact }; };
/** Frequency × impact as a rule of thumb: blocking or costly problems rate high even when few hit them; small ones rise only when nearly everyone does. */
export const severityOf = (users: number, impact: number): Severity =>
  impact >= 3 ? (users >= 2 ? 'critical' : 'major')
    : impact === 2 ? (users >= 3 ? 'major' : 'minor')
      : users >= 4 ? 'minor' : 'cosmetic';
/** Jakob Nielsen's 10 usability heuristics (1994; names as on nngroup.com). */
export const NIELSEN_10 = [
  { id: 'status', name: 'Visibility of system status' },
  { id: 'match', name: 'Match between the system and the real world' },
  { id: 'control', name: 'User control and freedom' },
  { id: 'consistency', name: 'Consistency and standards' },
  { id: 'prevention', name: 'Error prevention' },
  { id: 'recognition', name: 'Recognition rather than recall' },
  { id: 'flexibility', name: 'Flexibility and efficiency of use' },
  { id: 'minimal', name: 'Aesthetic and minimalist design' },
  { id: 'recovery', name: 'Help users recognise, diagnose and recover from errors' },
  { id: 'help', name: 'Help and documentation' },
] as const;
/** The parts of the Safar train-booking screen a `heuristic-sweep` card can point at (the game and scene draw each). */
export const SAFAR_PARTS = ['back', 'route', 'date', 'quota', 'search', 'passengers', 'fare', 'book'] as const;
export type SafarPart = (typeof SAFAR_PARTS)[number];

/** The parts of the Khelo turf-list wireframe a `fidelity-tidy` card can point at (the game and scene draw each, as drafted and as fixed). */
export const KHELO_PARTS = ['logo', 'tabs', 'search', 'photo', 'name', 'rating', 'price', 'button'] as const;
export type KheloPart = (typeof KHELO_PARTS)[number];
/** Where each `grid-place` lane sits on a 12-column desktop grid: first and last column. `bleed` also runs past the margins, edge to edge. */
export const GRID_AREA = { bleed: [1, 12], full: [1, 12], main: [1, 8], side: [9, 12] } as const;
export type GridArea = keyof typeof GRID_AREA;
/** A grid-placed page on a 4-column phone grid: every block goes full width, rows top to bottom, and in a shared row the main block comes before the side one. */
export const phoneStack = <C extends { lane: string; visual?: string }>(cards: readonly C[]) =>
  [...cards].sort((a, b) => Number(a.visual) - Number(b.visual) || Number(a.lane === 'side') - Number(b.lane === 'side'));
/** The five screens of the Khelo turf-booking flow, in order (a `pattern-stamp` card's `visual`). */
export const KHELO_SCREENS = ['find', 'turf', 'slot', 'players', 'pay'] as const;
export type KheloScreen = (typeof KHELO_SCREENS)[number];

/** The fields of Mandi's first sign-up form a `form-triage` card can point at, with seconds to fill each [as drafted, as fixed]; a cut field costs 0 once fixed. */
export const MANDI_FIELDS = {
  name: [14, 8], phone: [16, 6], email2: [12, 0], gender: [5, 0], diet: [10, 5], pincode: [12, 5], flat: [30, 12], password: [40, 14],
} as const satisfies Record<string, readonly [number, number]>;
export type MandiField = keyof typeof MANDI_FIELDS;
/** The four fixes a `form-triage` card can call, in lane order. */
export const FORM_LANES = ['label', 'keyboard', 'error', 'cut'] as const;
/** Seconds to fill Mandi's sign-up form, given which fields are fixed so far. */
export const formSeconds = (fixed: Partial<Record<MandiField, boolean>>) =>
  (Object.keys(MANDI_FIELDS) as MandiField[]).reduce((s, k) => s + MANDI_FIELDS[k][fixed[k] ? 1 : 0], 0);

/** Response-time limits in ms (Nielsen): up to 0.1 s feels instant, up to 1 s keeps the flow, up to 10 s keeps attention. */
export const WAIT_LIMITS = [100, 1000, 10000] as const;
/** The feedback a wait needs, shortest first (`wait-feedback` lanes). */
export const FEEDBACK = ['instant', 'pressed', 'spinner', 'progress'] as const;
export type Feedback = (typeof FEEDBACK)[number];
export const feedbackFor = (ms: number): Feedback => (ms <= WAIT_LIMITS[0] ? 'instant' : ms <= WAIT_LIMITS[1] ? 'pressed' : ms <= WAIT_LIMITS[2] ? 'spinner' : 'progress');

/** Parts of Mandi's desktop packing dashboard a `port-phone` card can point at (the game draws each on a laptop, then on a phone). */
export const PACKING_PARTS = ['tooltip', 'rowhover', 'rightclick', 'panel', 'popover', 'toolbar', 'checkbox', 'chart'] as const;
export type PackingPart = (typeof PACKING_PARTS)[number];

/** Gestures a `gesture-map` card can be given, in lane order. */
export const GESTURES = ['tap', 'swipe', 'drag', 'pinch'] as const;
export type Gesture = (typeof GESTURES)[number];

/** Components a `state-sheet` card can draw, and the states it can put them in (lane order). */
export const KIT_PARTS = ['button', 'input', 'card'] as const;
export type KitPart = (typeof KIT_PARTS)[number];
export const KIT_STATES = ['focus', 'disabled', 'loading', 'error'] as const;
export type KitState = (typeof KIT_STATES)[number];

/** Icons the `icon-odd` game can draw, with the label shown under each. */
export const ICONS = {
  home: 'Home', search: 'Search', sale: 'New sale', udhaar: 'Udhaar', stock: 'Stock', customers: 'Customers', reports: 'Reports',
  settings: 'Settings', bell: 'Alerts', scan: 'Scan', share: 'Share', call: 'Call', rupee: 'Payments', trash: 'Delete', edit: 'Edit',
  calendar: 'Calendar', bolt: 'Quick sale', chat: 'Messages', dollar: 'Payments', mailbox: 'Messages',
} as const;
export type IconName = keyof typeof ICONS;
/** Metaphors that don't belong in a rupee app for Indian shopkeepers: a dollar sign, an American kerbside mailbox. */
export const WRONG_METAPHORS = ['dollar', 'mailbox'] as const satisfies readonly IconName[];
/** How the odd icon of a `style` or `size` row is drawn wrong. */
export const ICON_FLAWS = { style: ['fill', 'bold'], size: ['small', 'big'] } as const;
/** Parses an `icon-odd` card's visual: "home,search,sale|2|fill" → the icons in the row, the odd one's index, and how it's drawn wrong (style and size rows only). */
export const iconRow = (visual: string) => {
  const [list = '', odd = '', flaw] = visual.split('|');
  return { icons: list.split(',') as IconName[], odd: Number(odd), flaw };
};

/** The kinds of image an `image-budget` card can be given, in lane order. */
export const IMAGE_KINDS = ['photo', 'illus', 'icon', 'none'] as const;
export type ImageKind = (typeof IMAGE_KINDS)[number];
/** Rough weight of each kind on a phone screen, in kB: a compressed photo, an SVG illustration, an icon, nothing. */
export const IMAGE_KB = { photo: 120, illus: 8, icon: 1, none: 0 } as const satisfies Record<ImageKind, number>;
/** Total weight in kB of the images picked for a set of screens. */
export const pageWeight = (kinds: readonly string[]) => kinds.reduce((s, k) => s + (IMAGE_KB[k as ImageKind] ?? 0), 0);

/** Parts of Hisaab's udhaar table a `table-build` card can point at (the game redraws each once fixed). */
export const LEDGER_PARTS = ['amount', 'days', 'date', 'header', 'overdue', 'total', 'grid', 'id'] as const;
export type LedgerPart = (typeof LEDGER_PARTS)[number];
/** Rupees in Indian digit grouping, rounded to whole rupees: 125000 → "₹1,25,000". */
export const inr = (n: number) => {
  const s = String(Math.round(Math.abs(n))), head = s.slice(0, -3), tail = s.slice(-3);
  return `${n < 0 ? '−' : ''}₹${head ? `${head.replace(/\B(?=(\d{2})+(?!\d))/g, ',')},` : ''}${tail}`;
};

/** Rasta's tokens in three tiers (ds.2): primitives hold raw values, semantic tokens give a primitive a job, and
 *  component tokens point at a semantic token for one part of one component. Each entry names the token it references. */
export const PRIMITIVES = {
  'teal-700': '#0F766E', 'amber-700': '#B45309', 'red-600': '#DC2626', 'grey-800': '#1D2939', 'grey-900': '#101828', white: '#FFFFFF',
  'radius-8': '8', 'radius-16': '16', 'radius-20': '20',
} as const;
export type PrimitiveToken = keyof typeof PRIMITIVES;
export const SEMANTIC = {
  'color-action-primary': 'teal-700', 'color-text-link': 'teal-700', 'color-feedback-error': 'red-600',
  'color-text-primary': 'grey-900', 'color-surface-inverse': 'grey-900', 'color-surface-raised': 'white', 'color-text-on-action': 'white',
  'radius-control': 'radius-8', 'radius-container': 'radius-16',
} as const satisfies Record<string, PrimitiveToken>;
export type SemanticToken = keyof typeof SEMANTIC;
export const COMPONENT = {
  'button-primary-bg': 'color-action-primary', 'button-primary-label': 'color-text-on-action', 'tab-indicator-color': 'color-action-primary',
  'toggle-on-bg': 'color-action-primary', 'link-color': 'color-text-link', 'input-error-border': 'color-feedback-error',
  'input-error-text': 'color-feedback-error', 'card-title-color': 'color-text-primary', 'header-bg': 'color-surface-inverse',
  'card-bg': 'color-surface-raised', 'button-radius': 'radius-control', 'input-radius': 'radius-control',
  'card-radius': 'radius-container', 'banner-radius': 'radius-container',
} as const satisfies Record<string, SemanticToken>;
export type ComponentToken = keyof typeof COMPONENT;
export const TOKEN_TIERS = ['primitive', 'semantic', 'component'] as const;
export type TokenTier = (typeof TOKEN_TIERS)[number];
/** Which tier a token lives in, or null if Rasta has no such token. */
export const tierOf = (token: string): TokenTier | null =>
  token in PRIMITIVES ? 'primitive' : token in SEMANTIC ? 'semantic' : token in COMPONENT ? 'component' : null;
/** The token one tier up: what this one references (null for a primitive). */
export const parentOf = (token: string): string | null =>
  (SEMANTIC as Record<string, string>)[token] ?? (COMPONENT as Record<string, string>)[token] ?? null;
/** Every component token that changes when `token` is edited: the edit's blast radius. */
export const blastRadius = (token: string): ComponentToken[] =>
  (Object.keys(COMPONENT) as ComponentToken[]).filter(c => c === token || COMPONENT[c] === token || SEMANTIC[COMPONENT[c]] === token);
/** Every component token resolved to its raw value. `edits` maps a primitive to a new raw value, or a semantic or
 *  component token to the primitive it should point at instead. */
export const resolveTokens = (edits: Partial<Record<string, string>> = {}): Record<ComponentToken, string> => {
  const raw = (prim: string) => (tierOf(prim) === 'primitive' && edits[prim]) || ((PRIMITIVES as Record<string, string>)[prim] ?? prim);
  const sem = (s: SemanticToken) => raw(edits[s] ?? SEMANTIC[s]);
  return Object.fromEntries((Object.keys(COMPONENT) as ComponentToken[]).map(c => [c, edits[c] ? raw(edits[c]!) : sem(COMPONENT[c])])) as Record<ComponentToken, string>;
};

/** Colour ramps for Rasta's light and dark modes (ds.2-2), keyed by step. */
export const RAMPS = {
  grey: { 25: '#FCFCFD', 50: '#F9FAFB', 100: '#F2F4F7', 200: '#EAECF0', 300: '#D0D5DD', 400: '#98A2B3', 500: '#667085', 600: '#475467', 700: '#344054', 800: '#1D2939', 900: '#101828', 950: '#0C111D' },
  teal: { 100: '#CCFBF1', 200: '#99F6E4', 300: '#5EEAD4', 400: '#2DD4BF', 500: '#14B8A6', 600: '#0D9488', 700: '#0F766E', 800: '#115E59', 900: '#134E4A' },
  red: { 100: '#FEE2E2', 200: '#FECACA', 300: '#FCA5A5', 400: '#F87171', 500: '#EF4444', 600: '#DC2626', 700: '#B91C1C', 800: '#991B1B', 900: '#7F1D1D' },
  amber: { 100: '#FEF3C7', 200: '#FDE68A', 300: '#FCD34D', 400: '#FBBF24', 500: '#F59E0B', 600: '#D97706', 700: '#B45309', 800: '#92400E', 900: '#78350F' },
} as const;
export type RampName = keyof typeof RAMPS;
/** A ramp's steps, lightest first. */
export const rampSteps = (ramp: RampName) => Object.keys(RAMPS[ramp]).map(Number).sort((a, b) => a - b);
export const rampHex = (ramp: RampName, step: number): string | undefined => (RAMPS[ramp] as Record<number, string>)[step];
/** What each semantic colour must do in dark mode: its ramp, its light and dark steps, what it's measured against
 *  ('page' is the dark page, grey-900; 'text' is dark-mode body text, grey-100) and the contrast band it must land in. */
export const MODE_SPECS = {
  'color-surface-page': { ramp: 'grey', light: 50, dark: 900, against: 'text', min: 15, max: 21 },
  'color-surface-raised': { ramp: 'grey', light: 25, dark: 800, against: 'text', min: 10, max: 15 },
  'color-text-primary': { ramp: 'grey', light: 900, dark: 100, against: 'page', min: 12, max: 16.5 },
  'color-text-secondary': { ramp: 'grey', light: 600, dark: 400, against: 'page', min: 4.5, max: 9 },
  'color-border-default': { ramp: 'grey', light: 300, dark: 700, against: 'page', min: 1.5, max: 3 },
  'color-action-primary': { ramp: 'teal', light: 700, dark: 500, against: 'page', min: 4.5, max: 10 },
  'color-feedback-error': { ramp: 'red', light: 600, dark: 400, against: 'page', min: 4.5, max: 10 },
  'color-feedback-warning': { ramp: 'amber', light: 700, dark: 500, against: 'page', min: 4.5, max: 11 },
} as const satisfies Record<string, { ramp: RampName; light: number; dark: number; against: 'page' | 'text'; min: number; max: number }>;
export type ModeToken = keyof typeof MODE_SPECS;
/** Rasta's value for a semantic colour in a mode. */
export const modeHex = (token: ModeToken, mode: 'light' | 'dark') => rampHex(MODE_SPECS[token].ramp, MODE_SPECS[token][mode])!;
/** Checks a dark-mode pick for a semantic colour: its contrast against what it sits on or carries, and whether it lands in the band. */
export const darkCheck = (token: ModeToken, step: number) => {
  const s = MODE_SPECS[token], hex = rampHex(s.ramp, step);
  const ratio = hex ? contrastRatio(hex, s.against === 'page' ? RAMPS.grey[900] : RAMPS.grey[100]) : 1;
  return { hex, ratio, ok: !!hex && ratio >= s.min && ratio <= s.max, low: ratio < s.min };
};

/** Rasta's naming grammar (ds.2-3): a category or component first, then concept, variant and property, and a state last. */
export const NAME_HEADS = ['color', 'space', 'radius', 'font', 'shadow', 'button', 'card', 'input', 'tab', 'toggle', 'link', 'header', 'banner'] as const;
export const NAME_STATES = ['hover', 'pressed', 'focus', 'disabled'] as const;
export const NAME_HUES = ['red', 'teal', 'blue', 'green', 'grey', 'gray', 'amber', 'orange', 'pink', 'light', 'dark'] as const;
export const NAME_VAGUE = ['new', 'old', 'final', 'misc', 'temp', 'copy', 'other'] as const;
/** What a bad name gets wrong (`token-rename` lanes). */
export const NAME_FLAWS = ['look', 'order', 'vague', 'style'] as const;
export type NameFlaw = (typeof NAME_FLAWS)[number];
/** The first thing wrong with a semantic or component token name, checked in this order: not kebab-case, versioned
 *  or vague, named after its look, parts out of order. Null for a name that follows the grammar. */
export const nameFlaw = (name: string): NameFlaw | null => {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) return 'style';
  const parts = name.split('-');
  if (parts.some(w => (NAME_VAGUE as readonly string[]).includes(w) || /^v?\d+$/.test(w) || /[a-z]\d+$/.test(w))) return 'vague';
  if (parts.some(w => (NAME_HUES as readonly string[]).includes(w))) return 'look';
  if (!(NAME_HEADS as readonly string[]).includes(parts[0])) return 'order';
  if (parts.slice(0, -1).some(w => (NAME_STATES as readonly string[]).includes(w))) return 'order';
  return null;
};
/** A `token-rename` card's bad name: its label up to " · ". */
export const badName = (label: string) => label.split(' · ')[0];
/** The words of a token name in any style: "cardTitle_color" → ["card", "title", "color"]. */
export const nameWords = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase().split(/[-_\s]+/).filter(Boolean);

/** What an old-Button prop could be set to before ds.3-1's clean-up: `is…` / `has…` props are on/off, the rest took any value. */
export const oldPropKind = (name: string): 'boolean' | 'free' => (/^(is|has)[A-Z]/.test(name) ? 'boolean' : 'free');
/** What a prop becomes in a component's API (`api-build` lanes). `fixed` means it isn't a prop: the system decides it. */
export const API_KINDS = ['enum', 'boolean', 'slot', 'fixed'] as const;
export type ApiKind = (typeof API_KINDS)[number];
/** One prop in an API. `free` takes any value (a hex code, a padding), which no one can design or test. */
export interface ApiProp { name: string; kind: 'enum' | 'boolean' | 'slot' | 'free'; options?: string[] }
/** The value an enum takes when nobody sets it: the old Button's look with no flags on. */
export const ENUM_DEFAULTS: Record<string, string> = { variant: 'secondary', size: 'md' };
/** Rasta's Button after the clean-up. */
export const BUTTON_API: readonly ApiProp[] = [
  { name: 'variant', kind: 'enum', options: ['secondary', 'primary', 'tertiary', 'danger'] },
  { name: 'size', kind: 'enum', options: ['md', 'sm', 'lg'] },
  { name: 'isLoading', kind: 'boolean' }, { name: 'isDisabled', kind: 'boolean' },
  { name: 'iconLeading', kind: 'slot' }, { name: 'iconTrailing', kind: 'slot' },
];
/** One `api-build` decision: the old prop, the card's `visual` (what it should become), and the kind picked (none yet = still the old prop). */
export interface ApiDecision { old: string; visual: string; kind?: ApiKind }
/** Builds an API from decisions, in order. An `enum` pick adds an option to the enum its visual names (or, for a card that
 *  isn't an enum option, turns the old prop into another variant: variant=loading). `boolean` and `slot` keep a name,
 *  `fixed` drops the prop, and undecided props stay as they were in the old Button. */
export const apiFrom = (ds: readonly ApiDecision[]): ApiProp[] => {
  const out: ApiProp[] = [];
  const add = (p: ApiProp) => { if (!out.some(o => o.name === p.name)) out.push(p); };
  const option = (name: string, value: string) => {
    let e = out.find(o => o.name === name && o.kind === 'enum');
    if (!e) { e = { name, kind: 'enum', options: ENUM_DEFAULTS[name] ? [ENUM_DEFAULTS[name]] : [] }; out.push(e); }
    if (!e.options!.includes(value)) e.options!.push(value);
  };
  const stem = (old: string) => old.replace(/^(is|has)/, '').replace(/^./, c => c.toLowerCase());
  for (const d of ds) {
    const [name, value] = d.visual.split('=');
    if (!d.kind) add({ name: d.old, kind: oldPropKind(d.old) });
    else if (d.kind === 'enum') { if (value) option(name, value); else option('variant', stem(d.old)); }
    else if (d.kind === 'boolean') add({ name: !value && /^(is|has)[A-Z]/.test(d.visual) ? d.visual : d.old, kind: 'boolean' });
    else if (d.kind === 'slot') add({ name: !value && d.visual.startsWith('icon') ? d.visual : d.old, kind: 'slot' });
  }
  return out;
};
/** How many different looks an API can be set to: each enum multiplies by its options and each boolean by 2. Slots hold
 *  content, so they add none. One free-value prop makes it endless. */
export const comboCount = (api: readonly ApiProp[]) =>
  api.reduce((n, p) => (p.kind === 'free' ? Infinity : p.kind === 'enum' ? n * Math.max(1, p.options?.length ?? 1) : p.kind === 'boolean' ? n * 2 : n), 1);

/** Figma's component property types (`prop-type` lanes). Only variant properties multiply the frames in a component set. */
export const PROP_TYPES = ['variant', 'boolean', 'text', 'swap'] as const;
export type PropType = (typeof PROP_TYPES)[number];
/** A `prop-type` card's values: "primary,secondary,tertiary" → three. */
export const propValues = (visual: string) => visual.split(',').map(v => v.trim()).filter(Boolean);
/** Frames you draw in a component set: the product of the values of every property made a variant. */
export const frameCount = (props: readonly { visual?: string; type?: string }[]) =>
  props.reduce((n, p) => (p.type === 'variant' ? n * Math.max(1, propValues(p.visual ?? '').length) : n), 1);

/** The blocks of a component's doc page, top to bottom (`doc-rewrite` lanes). `cut` is what goes. */
export const DOC_BLOCKS = ['when', 'dodont', 'a11y', 'cut'] as const;
export type DocBlock = (typeof DOC_BLOCKS)[number];
/** Words in a piece of text (anything with a letter or digit in it). */
export const wordCount = (text: string) => text.split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;
/** Seconds to read text at `wpm` words a minute (238 is a common average for adults reading English silently). */
export const readSeconds = (text: string, wpm = 238) => Math.ceil((wordCount(text) / wpm) * 60);

/** Easing curves as CSS cubic-bezier control points (x1, y1, x2, y2), in `ease-tune` lane order. `out` decelerates
 *  (things arriving), `in` accelerates (things leaving), `inout` speeds up then slows (moving across the screen), and
 *  `linear` keeps one speed (loops, and anything that follows a finger). */
export const EASE_CURVES = {
  out: [0.16, 1, 0.3, 1],
  in: [0.7, 0, 0.84, 0],
  inout: [0.65, 0, 0.35, 1],
  linear: [0, 0, 1, 1],
} as const satisfies Record<string, readonly [number, number, number, number]>;
export const EASES = ['out', 'in', 'inout', 'linear'] as const;
export type Ease = (typeof EASES)[number];
/** The CSS for a curve: "cubic-bezier(0.16, 1, 0.3, 1)". */
export const bezierCss = (e: Ease) => `cubic-bezier(${EASE_CURVES[e].join(', ')})`;
/** How far along a cubic-bezier(x1, y1, x2, y2) is at time `x` (0–1), solved the way browsers do: find the curve
 *  parameter whose x is `x` (Newton's method, then bisection if that stalls), and return its y. */
export const bezierAt = (curve: readonly number[], x: number) => {
  const [x1, y1, x2, y2] = curve;
  const c = Math.min(1, Math.max(0, x));
  if (x1 === y1 && x2 === y2) return c;
  const bx = (s: number) => 3 * x1 * s * (1 - s) ** 2 + 3 * x2 * s * s * (1 - s) + s ** 3;
  const by = (s: number) => 3 * y1 * s * (1 - s) ** 2 + 3 * y2 * s * s * (1 - s) + s ** 3;
  const dx = (s: number) => 3 * x1 * (1 - s) ** 2 + 6 * (x2 - x1) * s * (1 - s) + 3 * (1 - x2) * s * s;
  let s = c;
  for (let k = 0; k < 8; k++) {
    const err = bx(s) - c, d = dx(s);
    if (Math.abs(err) < 1e-6) return by(s);
    if (Math.abs(d) < 1e-6) break;
    s -= err / d;
  }
  let lo = 0, hi = 1;
  s = c;
  for (let k = 0; k < 40; k++) { if (bx(s) < c) lo = s; else hi = s; s = (lo + hi) / 2; }
  return by(s);
};
/** The curve a motion needs, from an `ease-tune` card's visual: "off>on" arrives (ease out), "on>off" leaves (ease in),
 *  "on>on" moves across the screen (ease in-out), and "loop" or "finger" keeps one speed (linear). */
export const curveFor = (path: string): Ease =>
  path === 'off>on' ? 'out' : path === 'on>off' ? 'in' : path === 'on>on' ? 'inout' : 'linear';

/** Duration bands for UI motion (`duration-tune` lanes), each up to `max` ms. Past the last band, motion makes people wait. */
export const DURATION_BANDS = [
  { id: 'instant', min: 0, max: 100 },
  { id: 'quick', min: 101, max: 200 },
  { id: 'standard', min: 201, max: 400 },
  { id: 'long', min: 401, max: 600 },
] as const;
export type DurationBand = (typeof DURATION_BANDS)[number]['id'];
/** The band a duration falls in, or `slow` past 600 ms. */
export const bandOf = (ms: number): DurationBand | 'slow' => DURATION_BANDS.find(b => ms <= b.max)?.id ?? 'slow';
/** Whether a tuned duration fits the band a transition needs. */
export const durationVerdict = (ms: number, band: DurationBand): 'right' | 'fast' | 'slow' => {
  const b = DURATION_BANDS.find(x => x.id === band)!;
  return ms < b.min ? 'fast' : ms > b.max ? 'slow' : 'right';
};
/** What a `duration-tune` card animates, and for how long Dabba's first build ran it: "600|sheet". */
export const DURATION_KINDS = ['press', 'check', 'toast', 'tooltip', 'sheet', 'sheet-out', 'page', 'menu'] as const;
export type DurationKind = (typeof DURATION_KINDS)[number];
export const timingOf = (visual: string) => { const [ms, kind] = visual.split('|'); return { ms: Number(ms), kind: kind as DurationKind }; };
/** When the last of `n` staggered items starts, `step` ms apart: the first waits nothing. */
export const staggerEnd = (n: number, step: number) => Math.max(0, n - 1) * step;
/** The stagger step that brings `n` items in within `budget` ms (40 ms at most, so a short list doesn't crawl). */
export const staggerStep = (n: number, budget = 200, most = 40) => (n <= 1 ? 0 : Math.min(most, Math.floor(budget / (n - 1))));

/** What a motion is for (`motion-purpose` lanes). `none` is decoration: cut it, or keep it rare. */
export const MOTION_JOBS = ['where', 'state', 'focus', 'none'] as const;
export type MotionJob = (typeof MOTION_JOBS)[number];
/** Motions the `motion-purpose` game and the Motion with meaning scene can draw (a card's `visual`). */
export const MEANING_MOTIONS = ['fly-to-cart', 'push-deeper', 'expand-card', 'sheet-from-button', 'shake', 'check-draw', 'skeleton', 'count-up',
  'pulse-once', 'logo-spin', 'bounce-all', 'float-icons'] as const;
export type MeaningMotion = (typeof MEANING_MOTIONS)[number];

/** How a motion moves, for deciding what it becomes when someone has turned on Reduce motion. `travel` is how far it moves, in px. */
export interface MotionSpec { travel: number; zoom?: boolean; spin?: boolean; parallax?: boolean; auto?: boolean; status?: boolean; meaning: boolean }
/** What a motion becomes under prefers-reduced-motion (`motion-audit` lanes). */
export const REDUCE_LANES = ['stop', 'fade', 'keep'] as const;
export type ReduceLane = (typeof REDUCE_LANES)[number];
/** Movement past this many px, or any zoom, spin or parallax, is the kind that can trigger vestibular symptoms. */
export const VESTIBULAR_PX = 40;
/** The rule: a status indicator (a spinner, a progress bar) stays, because it is the only sign something is happening.
 *  Other motion that plays by itself stops, and so does big motion that means nothing; big motion that means something
 *  is swapped for a fade (or an instant change) that keeps the meaning; small, meaningful changes stay. Reduce motion,
 *  don't remove meaning. */
export const reduceFor = (m: MotionSpec): ReduceLane => {
  const big = m.travel > VESTIBULAR_PX || !!m.zoom || !!m.spin || !!m.parallax;
  if (m.status) return 'keep';
  if (m.auto) return 'stop';
  if (big) return m.meaning ? 'fade' : 'stop';
  return 'keep';
};
/** The animated parts of Dabba's home screen (the `motion-audit` game's cards point at these by `visual`). */
export const DABBA_MOTIONS = {
  hero: { travel: 120, parallax: true, meaning: false },
  offers: { travel: 300, auto: true, meaning: true },
  page: { travel: 390, meaning: true },
  sheet: { travel: 0, zoom: true, meaning: true },
  fly: { travel: 300, meaning: true },
  confetti: { travel: 220, spin: true, meaning: false },
  press: { travel: 0, meaning: true },
  spinner: { travel: 0, spin: true, auto: true, status: true, meaning: true },
  toast: { travel: 8, meaning: true },
  badge: { travel: 4, meaning: true },
} as const satisfies Record<string, MotionSpec>;
export type DabbaPart = keyof typeof DABBA_MOTIONS;

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
/** Parses a `unit-calc` card's visual: "price|months|margin%|CAC". */
export const unitNumbers = (visual: string) => { const [price, months, margin, cac] = visual.split('|').map(Number); return { price, months, margin, cac, ltv: price * months * (margin / 100) }; };
/** LTV ÷ CAC: below 1 loses money on each customer, 3 or more is healthy. */
export const unitHealth = (ratio: number): 'losing' | 'risky' | 'healthy' => (ratio < 1 ? 'losing' : ratio < 3 ? 'risky' : 'healthy');
export type EpisodeQuestion = z.infer<typeof Question>;
