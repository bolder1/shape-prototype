// Episodes: the rich lesson format. Each lesson becomes a short show with eight stages:
//   watch → check → play → finish the story → takeaways → rapid quiz → prize ladder → grade card.
// The stage order is fixed so learners know the rhythm; the scene, the mini-game and every question are
// custom per lesson. Scenes and games are code (apps/web/src/features/episode), chosen here by id.
import { z } from 'zod';
import { SRM_ALPHA, sampleSize, srmP, twoProp, type Arm } from './stats';

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
  'ease-curves', 'motion-timing', 'motion-meaning', 'reduced-motion',
  'micro-anatomy', 'delight-check',
  'voice-tone', 'content-first', 'loc-ready',
  'keyboard-flow', 'sr-semantics', 'form-errors', 'cognitive-a11y',
  'vision-narrative', 'roadmap-horizons', 'rival-rings',
  'metric-tree', 'heart-goals', 'cohort-triangle', 'track-plan',
  'just-in-time', 'empty-activate', 'upgrade-moment',
  'hypothesis-shape', 'sample-size', 'peek-trap',
  'logo-process', 'brand-palette', 'brand-guide',
  'landing-anatomy', 'conversion-copy', 'campaign-cut', 'seo-read',
  'story-spine', 'objection-room', 'bluf-email',
  'demo-tour', 'pricing-page', 'cs-loop']);
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
 *  - `micro-build`: lanes are `MICRO_PARTS` in order; every card is one part of a Gullak micro-interaction, and its `visual` names which one (one of `GULLAK_MICROS`). Each micro-interaction gets exactly one card per part (see `microStrips`), and the game plays it once its strip is complete. Every card needs a `note`.
 *  - `delight-judge`: lanes are `DELIGHT_LANES` in order; every card's `visual` is a moment from Gullak's playful first build (a key of `GULLAK_MOMENTS`, each used once), and its lane is what `delightVerdict` says about it. The game tallies the time each costs a month with `delightCost`. Every card needs a `note`.
 *  - `tone-dial`: lanes are `TONES` in order, lightest first; every card is a moment in Chaabi, its `visual` a key of `CHAABI_MOMENTS` (each used once). You turn a dial through the four tones, the moment's message rewrites itself in each (same voice, different tone), and its lane is what `toneFor` says the moment's mood and stakes call for. Every card needs a `note`.
 *  - `question-flow`: lanes are `FLOW_QUESTIONS` in order, the four screens of Chaabi's move-out flow, each answering one question a tenant asks; every card is a piece of real content and its `visual` the `LOREM_SLOTS` box Dev's lorem-ipsum layout had for it, which the game shows it overflowing (`slotFits`). Every card needs a `note`.
 *  - `loc-spot`: lanes are `LOC_LANES` in order; every card is a string on Chaabi's rent screen, its `visual` "chars|piece|piece…": how many characters its box holds, then the pieces the code joins to build it. `locFlaw` decides the `pieces` and `room` cards (and must say nothing about the others); `idiom` and `ready` are judged by people. The game previews every string with `pseudoLocalize`. Every card needs a `note`.
 *  - `focus-path`: lanes are `KEY_WAYS` in order; every card is a part of Rahi's seat-booking page, its `visual` a key of `RAHI_PARTS` (each used once), and its lane is that part's `way`: its own Tab stops, one Tab stop with arrow keys inside, or not focusable. The game counts the Tab presses to reach Pay with `tabPresses`. Every card needs a `note`.
 *  - `sr-listen`: lanes are `SR_GAPS` in order; every card is a control on Rahi's search and seat screens, its `visual` a key of `RAHI_CONTROLS` (each used once). The game shows what a screen reader announces (`announce`), and the lane is what `srGap` finds missing: the role, the name, the state, or nothing. Every card needs a `note`.
 *  - `form-tab`: lanes are `FORM_FLAWS` in order; every card is a field on Rahi's passenger form after a failed submit, its `visual` a key of `RAHI_FIELDS` (each used once), in Tab order. The game tabs through them, showing each field and what a screen reader says on it (`fieldAnnounce`), and the lane is `fieldFlaw`. Every card needs a `note`.
 *  - `load-lift`: lanes are `COGA_LANES` in order; every card is a barrier in Rahi's booking flow, its `visual` a key of `RAHI_BARRIERS` (each used once), and its lane is that barrier's `lane`. The game shows the screen before and after, and a right call lifts the barrier's `load` off Sunita's meter (`loadLeft`). Every card needs a `note`.
 *  - `vision-postcard`: lanes are `VISION_PARTS` in order; every card is a line from a draft of Galla's vision. The game builds a postcard from 2030 out of the `today`, `future` and `whyus` lines, and highlights the words `visionFlags` finds in the `cut` ones. A card is in `cut` exactly when `visionFlaw` faults it. Every card needs a `note` (for cut lines, the rewrite).
 *  - `horizon-board`: lanes are `HORIZONS` in order; every card is a bet, its `visual` a key of `GALLA_BETS` (each used once), its `label` the problem it takes on, and its lane is what `horizonFor` says. The game shows the evidence, the fit and the bet it builds on, and the board fades from solid to faint left to right. Every card needs a `note`.
 *  - `rival-map`: lanes are `RIVAL_RINGS` in order; every card is something Shabnam could use instead of Galla, its `visual` a key of `GALLA_RIVALS` (each used once), and its lane is what `ringFor` says. The game drops each one on a ring around her job and shows what it does better than Galla. Every card needs a `note`.
 *  - `metric-flow`: lanes are `METRIC_ROLES` in order; every card is a metric Kahaani's team proposed, its `visual` a key of `KAHAANI_METRICS` (each used once), its `label` that metric's `name`, and its lane is what `metricRole` says. The game wires inputs under the north star, guardrails beside it and vanity metrics into the bin. Every card needs a `note`.
 *  - `heart-grid`: lanes are `GSM_PARTS` in order; every card is a line from the Apni Awaaz HEART plan, its `visual` a key of `AWAAZ_HEART` (each used once), its `label` that line's `text`, and its lane is what `gsmPart` reads in the text. A signal or metric then goes in its HEART row too (the line's `dim`); each row gets one signal and one metric. Every card needs a `note`.
 *  - `cohort-read`: lanes are `DATA_VIEWS` in order; every card is a question about Kahaani's new families, its `visual` a key of `KAHAANI_ASKS` (each used once), and its lane is that ask's `view`. Once the right view is open you estimate the answer on a slider, read by `askValue` and judged by `estimateGrade`. Every card needs a `note`.
 *  - `event-wire`: lanes are the keys of `KAHAANI_EVENTS` in order; every card is a question the team wants answered, its `visual` a key of `TRACK_QUESTIONS` (each used once), and its lane is that question's `event`. You fire the event from its place on the story player, then pick the properties that answer the question, checked by `propsCheck`. Every card needs a `note`.
 *  - `cue-timeline`: lanes are `KAKSHA_MOMENTS` in order; every card is a piece of onboarding, its `visual` a key of `KAKSHA_TIPS` (each used once), its `label` that tip's `text`, and its lane is what `cueFor` says: the first moment in Meenakshi's first month when she can use it. A wrong pick is called too early or too late by `cueVerdict`. Every card needs a `note`.
 *  - `empty-build`: lanes are `EMPTY_SLOTS` in order; every card is a candidate piece of Kaksha's empty Batches screen, its `visual` a key of `EMPTY_PIECES` (each used once), its `label` that piece's `text`, and its lane is the piece's `slot`. The game offers a slot's pieces together; the one to pick is the one `emptyFlaw` passes (exactly one per slot), and the finished screen reports `firstValueTaps`. Every card needs a `note`.
 *  - `paywall-timing`: lanes are `UPGRADE_MOVES` in order; every card is a moment in Meenakshi's months with Kaksha, its `visual` a key of `PRO_MOMENTS` (each used once), and its lane is what `upgradeMove` says. Each pick lands as `moveEffect` describes (a sale, a lost draft, an annoyed tutor…). Every card needs a `note`.
 *  - `hypo-fix`: lanes are `HYPO_PARTS` in order; every card is a hypothesis from Tokri's backlog, its `visual` a key of `TOKRI_HYPOS` (each used once), its `label` the whole sentence (`hypoText`), and its lane is the one weak part `hypoFlaw` finds. You tap the weak part, then choose its rewrite: the hypothesis's `fix`, or a `trap` that is still weak in the same way. Every card needs a `note`.
 *  - `sample-dial`: lanes are `PLAN_VERDICTS` in order; every card is a test Tokri wants to run, its `visual` a key of `TOKRI_PLANS` (each used once), and its lane is `planVerdict` of the weeks `planTest` works out. You estimate the weeks on a dial before the sum is shown, judged by `weeksGrade`; an estimate that isn't off scores. Every card needs a `note`.
 *  - `result-read`: lanes are `READ_CALLS` in order; every card is a test readout, its `visual` a key of `TOKRI_RESULTS` (each used once), and its lane is the call `readCall` makes from the raw counts (the split, the planned sample, significance with any slicing corrected, the guardrail). The game draws the readout with its confidence interval. Every card needs a `note`.
 *  - `logo-stress`: lanes are `MARK_VERDICTS` in order; every card is a candidate mark for Sukoon, its `visual` a key of `SUKOON_MARKS` (each used once), its `label` that mark's `text`, and its lane is what `markVerdict` says: the first test it fails (16 px, one colour, beside the rivals) or `ready`. The game draws each mark from its numbers under four lenses. Every card needs a `note`.
 *  - `kit-pick`: lanes are `KIT_SLOTS` in order; every card is an option for one job in Sukoon's kit, its `visual` a key of `SUKOON_KIT` (each used once) whose `slot` is the lane. Each slot has three options and exactly one that `kitFlaw` passes; the game tries each on a Sukoon screen (Hindi, contrast, the rivals' shelf) before you pick. Every card needs a `note`.
 *  - `guide-build`: lanes are `GUIDE_SECTIONS` in order; every card is a piece of Sukoon's identity made in the wild, its `visual` a key of `SUKOON_USES` (each used once), its `label` that use's `text`, and its lane is what `sectionBroken` says: the section whose rule (`GUIDE_RULES`) it breaks. A right drop writes that rule into the guide. Every card needs a `note`.
 *  - `page-stack`: lanes are `PAGE_ZONES` in order; every card is a piece of Sukoon's launch page, its `visual` a key of `SUKOON_SECTIONS` (each used once), its `label` that section's `text`, and its lane is the section's `zone`: the visitor question it answers. Each right drop stacks the piece on a phone in `pageOrder`, with the share of visitors who reach it from `pageLayout`. Every card needs a `note`.
 *  - `copy-swap`: lanes are `HERO_SLOTS` in order; every card is a draft line, its `visual` a key of `SUKOON_DRAFTS` (each used once), its `label` the draft as written (`copyLine` with every first option), and its lane the draft's `slot`. You swap phrases until `copyFlaws` finds nothing, then lock it; exactly one choice of phrases passes. Every card needs a `note`.
 *  - `asset-fit`: lanes are `ASSET_FORMATS` in order; every card is a campaign asset, its `visual` a key of `SUKOON_ASSETS` (each used once), its `label` that asset's `text`, and its lane the asset's `format`. You nudge blocks by `ASSET_STEP`, resize the headline through `ASSET_SIZES` or swap its line, and ship it; it scores when `assetIssues` finds nothing on the first ship. Every card needs a `note`.
 *  - `serp-spot`: lanes are `SEO_AREAS` in order; every card is one of `SEO_ISSUES` on Sukoon's launch page (its `visual`, each used once), and its lane is `SEO_AREA_OF` that issue. A right tap applies `SEO_FIXES`, so the page and its search result redraw from `fixSeo`. Every card needs a `note`.
 *  - `story-strip`: lanes are `PITCH_PARTS` in order; every card is a beat of Neha's rebuilt Saman pitch, its `visual` a key of `SAMAN_BEATS` (each used once), its `label` that beat's `text`, and its lane the beat's `part`. Each right call adds the beat to a timeline in `pitchOrder`, timed by `pitchTimeline` against `PITCH_SECONDS`, with `PROBLEM_BY` marked. Every card needs a `note`.
 *  - `objection-reply`: lanes are `OBJECTION_KINDS` in order; every card is an objection from Saman's leadership team, its `visual` a key of `SAMAN_OBJECTIONS` (each used once) whose `kind` is the lane. You name the worry, then pick one of its three replies; exactly one passes `replyFlaw`, and the room's trust moves by `replyTrust`. A card scores when both are right first time. Every card needs a `note`.
 *  - `summary-build`: lanes are `SUMMARY_PARTS` in order; every card is a sentence of Neha's long update, its `visual` a key of `SAMAN_UPDATE` (each used once), its `label` that line's `text`, and its lane the line's `part`. The summary grows in `buildSummary` order, with its inbox preview (`inboxPreview`), reading time and `summaryFlaws` shown live. Every card needs a `note`.
 *  - `demo-build`: lanes are `show` then `skip`; every card is a moment of the Sunrise demo, its `visual` a key of `SUNRISE_MOMENTS` (each used once) and its `label` that moment's `text`. Lane `show` exactly when the moment belongs in the clean demo (no `demoFlaws`). Shown moments join an agenda in `demoOrder`, timed against `DEMO_MINUTES`, with `demoGaps` and `demoFlaws` live. Every card needs a `note`.
 *  - `plan-pick`: lanes are `PLAN_IDS` in order; every card is a buyer reading Parcha's pricing page, its `visual` a key of `PARCHA_BUYERS` (each used once), and its lane `planFor` that buyer. A pick lights the plan's row for `fenceFor` (`FENCE_TEXT`) and shows `monthlyBill`. Every card needs a `note`.
 *  - `signal-route`: lanes are `ROUTES` in order; every card is a theme from Parcha's ticket queue, its `visual` a key of `PARCHA_SIGNALS` (each used once), and its lane that signal's `route`. The board totals `arrByRoute` and `loopAccounts` as you go, and the end compares `rankSignals` by tickets and by revenue. Every card needs a `note`.
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
  'ease-tune', 'duration-tune', 'motion-purpose', 'motion-audit',
  'micro-build', 'delight-judge',
  'tone-dial', 'question-flow', 'loc-spot',
  'focus-path', 'sr-listen', 'form-tab', 'load-lift',
  'vision-postcard', 'horizon-board', 'rival-map',
  'metric-flow', 'heart-grid', 'cohort-read', 'event-wire',
  'cue-timeline', 'empty-build', 'paywall-timing',
  'hypo-fix', 'sample-dial', 'result-read',
  'logo-stress', 'kit-pick', 'guide-build',
  'page-stack', 'copy-swap', 'asset-fit', 'serp-spot',
  'story-strip', 'objection-reply', 'summary-build',
  'demo-build', 'plan-pick', 'signal-route']);

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

/** The four parts of a micro-interaction (Dan Saffer's model), in `micro-build` lane order: what starts it, what it is
 *  allowed to do, how you know it happened, and how it changes over time or in another mode. */
export const MICRO_PARTS = ['trigger', 'rules', 'feedback', 'loops'] as const;
export type MicroPart = (typeof MICRO_PARTS)[number];
/** The micro-interactions in Gullak, a Pune UPI and savings-jar app, that the `micro-build` game and scene draw. */
export const GULLAK_MICROS = ['pay', 'roundup', 'refresh'] as const;
export type GullakMicro = (typeof GULLAK_MICROS)[number];
/** Groups `micro-build` cards into strips: for each micro-interaction (a card's `visual`), the card ids under each part. */
export const microStrips = (cards: readonly { id: string; lane: string; visual?: string }[]) => {
  const out: Record<string, Record<string, string[]>> = {};
  for (const c of cards) {
    const strip = (out[c.visual ?? ''] ??= {});
    (strip[c.lane] ??= []).push(c.id);
  }
  return out;
};
/** Whether a strip has exactly one card for every part. */
export const microComplete = (strip: Record<string, readonly string[]> | undefined) => !!strip && MICRO_PARTS.every(p => strip[p]?.length === 1);
/** What Gullak's Pay button shows `ms` after the tap: the press within 100 ms, then a spinner with "Waiting for your
 *  bank", then past 5 seconds "Still waiting. Don't pay again", and past 30 seconds the payment is marked pending with
 *  a promise to tell you. The loop is the feedback changing as the wait goes on. */
export const PAY_STAGES = [
  { id: 'press', until: 100 },
  { id: 'working', until: 5000 },
  { id: 'slow', until: 30000 },
  { id: 'pending', until: Infinity },
] as const;
export type PayStage = (typeof PAY_STAGES)[number]['id'];
export const payStage = (ms: number): PayStage => PAY_STAGES.find(s => ms < s.until)!.id;

/** A playful moment in Gullak: how long it plays, how often a daily user sees it, whether it holds up what they came to
 *  do, the mood of the moment it plays in, and whether it is playful (confetti, a dance, a jingle, a wink). */
export interface DelightSpec { ms: number; perMonth: number; blocks?: boolean; mood: 'good' | 'neutral' | 'bad'; playful: boolean }
/** Critique verdicts for a playful moment (`delight-judge` lanes): keep it, it plays too often, it gets in the way, or
 *  it strikes the wrong tone. */
export const DELIGHT_LANES = ['keep', 'often', 'blocking', 'tone'] as const;
export type DelightLane = (typeof DELIGHT_LANES)[number];
/** Flourishes up to this long are small enough to repeat every day, or to sit in front of the next step. */
export const SMALL_MS = 300;
/** A big flourish seen more than this many times a month (about twice a week) stops being a surprise. */
export const RARE_PER_MONTH = 8;
/** The critique, in order: playfulness on a bad moment (a failure, a fine) is the wrong tone whatever else is true; then
 *  anything longer than a small flourish that holds up the next step is in the way; then a big flourish on something
 *  done more than about twice a week plays too often. What's left is delight: rare and earned, or small. */
export const delightVerdict = (m: DelightSpec): DelightLane => {
  if (m.mood === 'bad' && m.playful) return 'tone';
  if (m.blocks && m.ms > SMALL_MS) return 'blocking';
  if (m.perMonth > RARE_PER_MONTH && m.ms > SMALL_MS) return 'often';
  return 'keep';
};
/** Seconds a month a daily user spends watching a moment, to one decimal place. */
export const delightCost = (m: Pick<DelightSpec, 'ms' | 'perMonth'>) => Math.round((m.ms * m.perMonth) / 100) / 10;
/** The playful moments in Gullak's first build (the `delight-judge` game's cards point at these by `visual`). */
export const GULLAK_MOMENTS = {
  'coin-rain': { ms: 1500, perMonth: 90, blocks: true, mood: 'neutral', playful: true },
  'unlock-dance': { ms: 2000, perMonth: 60, blocks: true, mood: 'neutral', playful: true },
  'pay-confetti': { ms: 1200, perMonth: 60, mood: 'good', playful: true },
  'tap-jingle': { ms: 600, perMonth: 900, mood: 'neutral', playful: true },
  'balance-sparkle': { ms: 800, perMonth: 90, mood: 'neutral', playful: true },
  'failed-wink': { ms: 900, perMonth: 2, mood: 'bad', playful: true },
  'late-fee-party': { ms: 1000, perMonth: 1, mood: 'bad', playful: true },
  'goal-burst': { ms: 900, perMonth: 0.5, mood: 'good', playful: true },
  'tick-draw': { ms: 300, perMonth: 60, mood: 'good', playful: false },
  'pull-coin': { ms: 0, perMonth: 30, mood: 'neutral', playful: true },
} as const satisfies Record<string, DelightSpec>;
export type GullakMoment = keyof typeof GULLAK_MOMENTS;

/** Tone settings for one voice (`tone-dial` lanes), lightest first. Chaabi's voice (straight, neighbourly, sure) never
 *  changes; how much lightness it allows itself does. */
export const TONES = ['playful', 'warm', 'plain', 'serious'] as const;
export type Tone = (typeof TONES)[number];
/** A moment in Chaabi, a Kolkata app for renting a flat: how it feels to the tenant and how much rides on it (money,
 *  a home, a deadline), plus the moment's message written in each tone. */
export interface ToneMoment { mood: 'good' | 'neutral' | 'bad'; stakes: 'low' | 'high'; lines: Record<Tone, string> }
/** The tone a moment calls for. Mood sets the starting point and stakes push it one step graver: bad news is plain, or
 *  serious when money or a home is at risk; routine moments are warm, or plain when something important must be done;
 *  good news can be playful, but only warm when it's big. */
export const toneFor = (m: Pick<ToneMoment, 'mood' | 'stakes'>): Tone => {
  const start = m.mood === 'good' ? 0 : m.mood === 'neutral' ? 1 : 2;
  return TONES[start + (m.stakes === 'high' ? 1 : 0)];
};
/** How many steps apart two tones are on the dial (0 = the same). */
export const toneGap = (a: Tone, b: Tone) => Math.abs(TONES.indexOf(a) - TONES.indexOf(b));
/** The moments in the `tone-dial` game and the `voice-tone` scene. Tanvir is moving out of a Salt Lake flat, rented from
 *  Mrs Sen with a ₹45,000 deposit, into a new one in Jadavpur. */
export const CHAABI_MOMENTS = {
  shortlist: { mood: 'good', stakes: 'low', lines: {
    playful: 'Five flats on your shortlist. Someone’s serious about Jadavpur.',
    warm: 'Five flats saved. We’ll tell you if any of them drop their rent.',
    plain: 'You have saved 5 flats.',
    serious: 'Five flats are saved to your shortlist. Review them before they are let.' } },
  'move-in': { mood: 'good', stakes: 'low', lines: {
    playful: 'Keys in hand. The new flat is officially yours to fill with plants.',
    warm: 'Welcome home, Tanvir. Your rent, repairs and agreement are all in one place now.',
    plain: 'Move-in confirmed for Flat 2A, Jadavpur.',
    serious: 'Your tenancy at Flat 2A, Jadavpur, has started. Rent is due on the 5th of each month.' } },
  'deposit-back': { mood: 'good', stakes: 'high', lines: {
    playful: 'Ka-ching! ₹41,800 just bounced back to you.',
    warm: '₹41,800 of your deposit is on its way. It should reach your bank by Friday.',
    plain: 'Deposit refund: ₹41,800. Expected by Friday.',
    serious: 'A refund of ₹41,800 has been approved against your deposit of ₹45,000.' } },
  'no-results': { mood: 'neutral', stakes: 'low', lines: {
    playful: 'Zero flats. Jadavpur is playing hard to get.',
    warm: 'No flats match all your filters yet. Try raising the rent limit to ₹20,000, or we’ll tell you when one comes up.',
    plain: 'No results. Change your filters.',
    serious: 'No listings match your criteria.' } },
  kyc: { mood: 'neutral', stakes: 'high', lines: {
    playful: 'Quick paperwork party! Bring your PAN.',
    warm: 'Nearly there! Just pop in your PAN and you’re good to go.',
    plain: 'Add your PAN before you sign. Mrs Sen needs it for the rent receipt, and it takes about a minute.',
    serious: 'Your PAN is required. You cannot sign the agreement without it.' } },
  'photo-failed': { mood: 'bad', stakes: 'low', lines: {
    playful: 'Oops, that photo got camera-shy!',
    warm: 'Oh no, your photo didn’t make it. Let’s try that again together!',
    plain: 'That photo didn’t upload. Check your connection and try again. Your request is saved.',
    serious: 'Upload failed. The photo could not be attached to your repair request.' } },
  'rent-failed': { mood: 'bad', stakes: 'high', lines: {
    playful: 'Uh-oh, your rent took a detour! Give it another spin?',
    warm: 'Your rent didn’t go through, but don’t worry, we’ll sort it out together.',
    plain: 'Your rent payment didn’t go through. Try again.',
    serious: 'Your ₹18,500 rent didn’t go through, and no money left your account. It’s due today: pay with another UPI app, or tell Mrs Sen you’ll pay tomorrow.' } },
  notice: { mood: 'bad', stakes: 'high', lines: {
    playful: 'Plot twist: Mrs Sen wants Flat 3B back!',
    warm: 'Mrs Sen has sent you a notice. We know moving is a lot, and we’re here for you.',
    plain: 'Mrs Sen has sent you a notice to leave.',
    serious: 'Mrs Sen has given you two months’ notice to leave Flat 3B, by 28 February. Your agreement allows this. Read the notice, and see flats near you.' } },
} as const satisfies Record<string, ToneMoment>;
export type ChaabiMoment = keyof typeof CHAABI_MOMENTS;

/** The four screens of Chaabi's move-out flow (`question-flow` lanes), each named for the one question a tenant asks
 *  there, in the order they ask them. */
export const FLOW_QUESTIONS = ['howmuch', 'why', 'when', 'next'] as const;
export type FlowQuestion = (typeof FLOW_QUESTIONS)[number];
/** The boxes in Dev's lorem-ipsum move-out screen: characters per line and how many lines each holds. */
export const LOREM_SLOTS = {
  headline: { perLine: 18, lines: 1 },
  tile: { perLine: 16, lines: 2 },
  body: { perLine: 30, lines: 2 },
  button: { perLine: 14, lines: 1 },
} as const satisfies Record<string, { perLine: number; lines: number }>;
export type LoremSlot = keyof typeof LOREM_SLOTS;
/** Lines `text` takes when wrapped word by word at `perLine` characters (a word longer than a line is broken). */
export const wrapLines = (text: string, perLine: number) => wrapText(text, perLine).length;
/** `text` wrapped word by word at `perLine` characters. */
export const wrapText = (text: string, perLine: number) => {
  const out: string[] = [];
  let line = '';
  for (let word of text.split(/\s+/).filter(Boolean)) {
    while (word.length > perLine) {
      if (line) { out.push(line); line = ''; }
      out.push(word.slice(0, perLine));
      word = word.slice(perLine);
    }
    if (!line) line = word;
    else if (line.length + 1 + word.length <= perLine) line += ` ${word}`;
    else { out.push(line); line = word; }
  }
  if (line) out.push(line);
  return out;
};
/** Whether real content fits the lorem box it was drawn for. */
export const slotFits = (text: string, slot: LoremSlot) => wrapLines(text, LOREM_SLOTS[slot].perLine) <= LOREM_SLOTS[slot].lines;

/** Verdicts for a string on its way to Bengali and Hindi (`loc-spot` lanes): ready, built from pieces (joined
 *  fragments, a number stuck to a plural), an idiom that won't survive translation, or no room to grow. */
export const LOC_LANES = ['ready', 'pieces', 'idiom', 'room'] as const;
export type LocLane = (typeof LOC_LANES)[number];
/** How much longer a string may get in translation, by its English length (after IBM's globalization guidelines, at the
 *  low end of each band): short strings grow the most. */
export const growthFor = (len: number) => (len <= 10 ? 1 : len <= 20 ? 0.8 : len <= 30 ? 0.6 : len <= 50 ? 0.4 : len <= 70 ? 0.35 : 0.3);
/** Characters to leave room for once `len` English characters are translated. */
export const roomFor = (len: number) => Math.ceil(Math.round(len * (1 + growthFor(len)) * 1000) / 1000);
/** A `loc-spot` visual: "chars|piece|piece…". */
export const locParse = (visual: string) => {
  const [chars, ...parts] = visual.split('|');
  return { chars: Number(chars), parts, text: parts.join('') };
};
/** What a machine can tell about a string: joined from pieces, or too long for its box once translated; null when
 *  neither (idioms and good strings need a person). */
export const locFlaw = (s: { chars: number; parts: readonly string[] }): 'pieces' | 'room' | null => {
  if (s.parts.length > 1) return 'pieces';
  return roomFor(s.parts.join('').length) > s.chars ? 'room' : null;
};
const ACCENT: Record<string, string> = { a: 'á', e: 'é', i: 'í', o: 'ö', u: 'ü', A: 'Å', E: 'É', I: 'Î', O: 'Ö', U: 'Û', c: 'ç', n: 'ñ', y: 'ý' };
/** A pseudo-translation for testing a layout before any translator starts: accented letters (to catch fonts and
 *  clipped accents), padded to `roomFor` its length (to catch boxes that can't grow) and bracketed (to catch text cut
 *  off at either end). Placeholders in {braces} are left alone. */
export const pseudoLocalize = (text: string) => {
  const body = text.split(/(\{[^}]*\})/).map(s => (s.startsWith('{') ? s : [...s].map(ch => ACCENT[ch] ?? ch).join(''))).join('');
  return `[${body}${'·'.repeat(roomFor(text.length) - text.length)}]`;
};

/** How the keyboard reaches a part of a page (`focus-path` lanes): each of its items is its own Tab stop; the whole
 *  group is one Tab stop and the arrow keys move inside it (a roving tabindex, as in the ARIA Authoring Practices radio
 *  group, toolbar and grid patterns); or it isn't focusable at all, because it isn't interactive or isn't on screen. */
export const KEY_WAYS = ['tab', 'arrows', 'none'] as const;
export type KeyWay = (typeof KEY_WAYS)[number];
/** A part of a page: how many interactive-looking items it has and how the keyboard should reach them. */
export interface PagePart { label: string; n: number; way: KeyWay }
/** Rahi's seat-booking page for an overnight bus from Pune to Goa, in DOM order (which is also reading order). */
export const RAHI_PARTS = {
  skip: { label: 'Skip to seats', n: 1, way: 'tab' },
  nav: { label: 'Header links', n: 5, way: 'tab' },
  menu: { label: 'Mobile menu, while closed', n: 6, way: 'none' },
  dates: { label: 'Date chips', n: 7, way: 'arrows' },
  art: { label: 'Bus illustration', n: 1, way: 'none' },
  seats: { label: 'Seat map', n: 36, way: 'arrows' },
  legend: { label: 'Seat legend', n: 3, way: 'none' },
  boarding: { label: 'Boarding point', n: 1, way: 'tab' },
  fare: { label: 'Fare breakdown', n: 1, way: 'none' },
  pay: { label: 'Pay ₹1,280', n: 1, way: 'tab' },
} as const satisfies Record<string, PagePart>;
export type RahiPart = keyof typeof RAHI_PARTS;
/** Tab stops a part adds: one per item, one for an arrow-key group, none if it isn't focusable. */
export const stopsOf = (p: Pick<PagePart, 'n' | 'way'>) => (p.way === 'tab' ? p.n : p.way === 'arrows' ? 1 : 0);
/** Tab presses from the top of the page to land on the part at `target`, with each part reached the way given. */
export const tabPresses = (parts: readonly Pick<PagePart, 'n' | 'way'>[], target: number) =>
  parts.slice(0, target).reduce((sum, p) => sum + stopsOf(p), 0) + 1;

/** Roles a control can expose to a screen reader (`none`: hidden from it, as a decorative image should be). */
export type SrRole = 'button' | 'link' | 'heading' | 'img' | 'switch' | 'combobox' | 'none';
/** What a control tells assistive technology (WCAG 4.1.2 Name, Role, Value): what it should be, the role it actually
 *  exposes (null: a plain div or span with no role), its accessible name, and its state or value if it needs one. */
export interface SrControl { label: string; expect: SrRole; role: SrRole | null; name: string | null; needsState?: boolean; state?: string | null; fix: Partial<SrControl>; code: readonly [before: string, after: string] }
/** What can be missing from a control (`sr-listen` lanes), checked in this order. */
export const SR_GAPS = ['role', 'name', 'state', 'ok'] as const;
export type SrGap = (typeof SR_GAPS)[number];
/** The first thing a control fails to tell a screen reader: the wrong role (or none), no name, no state; else ok. */
export const srGap = (c: Pick<SrControl, 'expect' | 'role' | 'name' | 'needsState' | 'state'>): SrGap => {
  if (c.role !== c.expect) return 'role';
  if (c.expect !== 'none' && !c.name) return 'name';
  if (c.needsState && !c.state) return 'state';
  return 'ok';
};
const ROLE_WORD: Record<SrRole, string> = { button: 'button', link: 'link', heading: 'heading, level 2', img: 'graphic', switch: 'switch', combobox: 'combo box', none: '' };
/** Roughly what NVDA says when it reaches a control: name, role, state. A hidden control, or a div with no text, says
 *  nothing; a div with text is read as plain text. */
export const announce = (c: Pick<SrControl, 'role' | 'name' | 'state'>) => {
  if (c.role === 'none') return '';
  return [c.name ?? '', c.role ? ROLE_WORD[c.role] : '', c.state ?? ''].filter(Boolean).join(', ');
};
/** Controls on Rahi's search and seat screens, as Arjun first built them, each with its fix. */
export const RAHI_CONTROLS = {
  swap: { label: 'The ⇄ icon that swaps From and To', expect: 'button', role: null, name: null,
    fix: { role: 'button', name: 'Swap From and To' }, code: ['<div class="swap" onclick="swap()"><svg …/></div>', '<button type="button" aria-label="Swap From and To"><svg aria-hidden="true" …/></button>'] },
  heading: { label: '“Choose your seat”, in big bold type', expect: 'heading', role: null, name: 'Choose your seat',
    fix: { role: 'heading' }, code: ['<div class="title-lg">Choose your seat</div>', '<h2>Choose your seat</h2>'] },
  rules: { label: '“Fare rules”, which opens a dialog', expect: 'button', role: 'link', name: 'Fare rules',
    fix: { role: 'button' }, code: ['<a href="#" onclick="openRules()">Fare rules</a>', '<button type="button" onclick="openRules()">Fare rules</button>'] },
  search: { label: 'The magnifier button that runs the search', expect: 'button', role: 'button', name: null,
    fix: { name: 'Search buses' }, code: ['<button><svg …/></button>', '<button aria-label="Search buses"><svg aria-hidden="true" …/></button>'] },
  logo: { label: 'The bus operator’s logo on a result', expect: 'img', role: 'img', name: null,
    fix: { name: 'Konkan Travels' }, code: ['<img src="op_2231.png">', '<img src="op_2231.png" alt="Konkan Travels">'] },
  ac: { label: 'The “AC buses only” switch', expect: 'switch', role: 'switch', name: 'AC buses only', needsState: true, state: null,
    fix: { state: 'off' }, code: ['<div role="switch" class="on">AC buses only</div>', '<button role="switch" aria-checked="false">AC buses only</button>'] },
  sort: { label: 'The “Sort: Departure” menu button', expect: 'button', role: 'button', name: 'Sort: Departure', needsState: true, state: null,
    fix: { state: 'collapsed' }, code: ['<button onclick="toggleSort()">Sort: Departure</button>', '<button aria-expanded="false" aria-controls="sort-menu">Sort: Departure</button>'] },
  booked: { label: 'Seat 14, greyed out because it’s booked', expect: 'button', role: 'button', name: 'Seat 14', needsState: true, state: null,
    fix: { name: 'Seat 14, window', state: 'unavailable' }, code: ['<button class="seat booked">14</button>', '<button class="seat" aria-disabled="true" aria-label="Seat 14, window">14</button>'] },
  photo: { label: 'A decorative photo of the bus at sunset', expect: 'none', role: 'none', name: null,
    fix: {}, code: ['<img src="sunset.jpg" alt="">', '<img src="sunset.jpg" alt="">'] },
  boarding: { label: 'The boarding point dropdown', expect: 'combobox', role: 'combobox', name: 'Boarding point', needsState: true, state: 'Swargate, 9:40 pm',
    fix: {}, code: ['<label for="bp">Boarding point</label><select id="bp">…</select>', '<label for="bp">Boarding point</label><select id="bp">…</select>'] },
  pay: { label: 'The Pay button', expect: 'button', role: 'button', name: 'Pay ₹1,280',
    fix: {}, code: ['<button type="submit">Pay ₹1,280</button>', '<button type="submit">Pay ₹1,280</button>'] },
} as const satisfies Record<string, SrControl>;
export type RahiControl = keyof typeof RAHI_CONTROLS;
/** A control with its fix applied. */
export const fixedControl = (c: SrControl): SrControl => ({ ...c, ...c.fix });

/** What's wrong with a field on a form after a failed submit (`form-tab` lanes), checked in this order: no visible,
 *  programmatically tied label (3.3.2 Labels or Instructions, 1.3.1 Info and Relationships); an error shown only by
 *  colour or that a screen reader can't hear (1.4.1 Use of Color, 3.3.1 Error Identification); an error that names the
 *  problem but not the fix (3.3.3 Error Suggestion); or nothing. */
export const FORM_FLAWS = ['label', 'error', 'help', 'ok'] as const;
export type FormFlaw = (typeof FORM_FLAWS)[number];
/** A form field. `label` is a visible label tied to the field with <label for> (null: none, maybe a placeholder).
 *  `error`, after submit: its visible text (null: a red border only), whether it is linked to the field with
 *  aria-describedby and aria-invalid, and whether it says how to fix it. */
export interface FormField {
  label: string | null; placeholder?: string; kind: 'text' | 'checkbox' | 'radio'; value: string;
  error?: { text: string | null; linked: boolean; fix: boolean };
}
export const fieldFlaw = (f: FormField): FormFlaw => {
  if (!f.label) return 'label';
  if (f.error && (!f.error.text || !f.error.linked)) return 'error';
  if (f.error && !f.error.fix) return 'help';
  return 'ok';
};
const KIND_WORD = { text: 'edit', checkbox: 'check box', radio: 'radio button' } as const;
/** Roughly what NVDA says on focusing a field: its name (a browser falls back to the placeholder when there's no
 *  label), role, "invalid entry" when aria-invalid is set, its value or state, then the linked error text. */
export const fieldAnnounce = (f: FormField) => {
  const linked = !!f.error?.linked && !!f.error.text;
  return [f.label ?? f.placeholder ?? '', KIND_WORD[f.kind], linked ? 'invalid entry' : '', f.value, linked ? f.error!.text! : ''].filter(Boolean).join(', ');
};
/** Rahi's passenger-and-payment form for Farhan's Pune to Goa ticket, in Tab order, just after he pressed Pay. */
export const RAHI_FIELDS = {
  name: { label: 'Full name, as on your ID', kind: 'text', value: 'Farhan Shaikh' },
  age: { label: null, placeholder: 'Age', kind: 'text', value: '34' },
  gender: { label: 'Male', kind: 'radio', value: 'checked' },
  mobile: { label: 'Mobile number', kind: 'text', value: '98200 1234', error: { text: 'Invalid input', linked: true, fix: false } },
  email: { label: 'Email for your ticket', kind: 'text', value: 'farhan@gmail', error: { text: null, linked: false, fix: false } },
  idnum: { label: 'PAN, to show when you board', kind: 'text', value: 'ABCD1234F', error: { text: 'Enter the 10-character PAN, like ABCDE1234F', linked: false, fix: true } },
  pin: { label: 'Pincode', kind: 'text', value: '41100', error: { text: 'Pincode must be 6 digits, like 411001', linked: true, fix: true } },
  promo: { label: null, placeholder: 'Promo code', kind: 'text', value: 'GOA100' },
  upi: { label: 'UPI ID', kind: 'text', value: 'farhan@okhdfc', error: { text: 'Something went wrong', linked: true, fix: false } },
  terms: { label: 'I accept the cancellation policy', kind: 'checkbox', value: 'not checked', error: { text: null, linked: false, fix: false } },
  whatsapp: { label: 'Send my ticket on WhatsApp', kind: 'checkbox', value: 'checked' },
} as const satisfies Record<string, FormField>;
export type RahiField = keyof typeof RAHI_FIELDS;

/** What a cognitive barrier takes away from the person (`load-lift` lanes), after the W3C's Making Content Usable for
 *  People with Cognitive and Learning Disabilities: enough time, nothing to remember, plain words and clear steps, and
 *  no surprises. */
export const COGA_LANES = ['time', 'memory', 'plain', 'predict'] as const;
export type CogaLane = (typeof COGA_LANES)[number];
/** A barrier in Rahi's booking flow: the WCAG success criterion it meets (or the guidance it follows), how much it
 *  weighs on Sunita (1–3), and the screen before and after. */
export interface CogaBarrier { lane: CogaLane; sc: string; load: 1 | 2 | 3; before: string; after: string }
/** Sunita Kulkarni, 67, books a ₹640 seat from Pune to Kolhapur. Since a stroke last year she reads slowly and loses
 *  numbers she saw a moment ago. */
export const RAHI_BARRIERS = {
  hold: { lane: 'time', sc: '2.2.1 Timing Adjustable', load: 3,
    before: 'Seats held for 5:00. At 0:00 they are released, with no warning.',
    after: 'With a minute left: “Your seats are held for 1 more minute.” [Add 5 minutes]' },
  idle: { lane: 'time', sc: '2.2.1 Timing Adjustable', load: 2,
    before: 'Two minutes without typing signs her out, and the form is emptied.',
    after: 'A warning before sign-out: “Still there?” [Continue]. Her details are kept either way.' },
  otp: { lane: 'memory', sc: '3.3.8 Accessible Authentication (Minimum)', load: 2,
    before: 'The OTP box blocks paste, so she copies six digits from Messages by hand.',
    after: 'The code fills itself in from the SMS, and paste works.' },
  retype: { lane: 'memory', sc: '3.3.7 Redundant Entry', load: 2,
    before: 'The payment step asks for her name and mobile number again.',
    after: 'Name and mobile carried over from the passenger step, with Change beside each.' },
  captcha: { lane: 'memory', sc: '3.3.8 Accessible Authentication (Minimum)', load: 3,
    before: 'Sign-in wants a password she must remember, then a puzzle of wobbly letters to copy.',
    after: 'Sign in with a code sent to her phone, or let the browser fill the password. No puzzle.' },
  jargon: { lane: 'plain', sc: 'Plain language (COGA)', load: 2,
    before: 'Choose a fare: Saver, Flexi or Flexi+ (T&C apply).',
    after: 'Free cancellation until 24 hours before you travel: +₹60. Without it, cancelling refunds half.' },
  code: { lane: 'plain', sc: '3.3.3 Error Suggestion', load: 1,
    before: 'Error 4012: session invalid.',
    after: 'This page was open a long time, so we refreshed it. Your seat and details are still here.' },
  steps: { lane: 'plain', sc: 'Clear steps (COGA)', load: 1,
    before: 'Screen after screen, with no sign of how many are left.',
    after: 'Step 3 of 4: Passenger details.' },
  help: { lane: 'predict', sc: '3.2.6 Consistent Help', load: 1,
    before: 'Help is in the footer on one screen, the menu on the next, and missing from payment.',
    after: '“Call us: 020 4800 1234” in the same corner of every screen.' },
  jump: { lane: 'predict', sc: '3.2.2 On Input', load: 2,
    before: 'Picking a boarding point jumps straight to payment.',
    after: 'She picks Swargate, checks it, and presses Continue when she’s ready.' },
  final: { lane: 'predict', sc: '3.3.4 Error Prevention (Legal, Financial, Data)', load: 3,
    before: 'One tap on Book charges ₹640. No review.',
    after: 'A review screen: Pune to Kolhapur, 14 Dec, 7:15 am, seat 12, ₹640. [Pay ₹640] [Change]' },
} as const satisfies Record<string, CogaBarrier>;
export type RahiBarrier = keyof typeof RAHI_BARRIERS;
/** Load Sunita still carries once the barriers in `lifted` are removed. */
export const loadLeft = (barriers: readonly RahiBarrier[], lifted: readonly RahiBarrier[]) =>
  barriers.filter(b => !lifted.includes(b)).reduce((sum, b) => sum + RAHI_BARRIERS[b].load, 0);

/** The parts of a product vision narrative (`vision-postcard` lanes): the struggle today, the world once the product
 *  has done its job, why this team can get there, and lines that don't belong in a vision at all. */
export const VISION_PARTS = ['today', 'future', 'whyus', 'cut'] as const;
export type VisionPart = (typeof VISION_PARTS)[number];
/** What a machine can catch in a vision line: words that sound big and say nothing, a feature someone wants to build,
 *  or a target number dressed up as a destination. */
export type VisionFlaw = 'buzz' | 'feature' | 'target';
const VISION_RULES: [VisionFlaw, RegExp][] = [
  ['buzz', /\b(leading|world-class|best-in-class|ai-powered|seamless|one-stop|revolution\w*|disrupt\w*|synerg\w*|next-gen\w*|cutting-edge|empower\w*|ecosystem|leverag\w*|holistic)\b/gi],
  ['feature', /\b(launch|build|ship|add|integrate|release)\b/gi],
  ['target', /\d[\d,.]*\s*(lakh|crore|million|%)|\bby 20\d\d\b/gi],
];
/** Every flagged word in a vision line, in reading order, with where it starts. */
export const visionFlags = (line: string) => VISION_RULES
  .flatMap(([kind, re]) => [...line.matchAll(re)].map(m => ({ kind, word: m[0], at: m.index ?? 0 })))
  .sort((a, b) => a.at - b.at);
/** The first thing wrong with a vision line, or null when a machine can't fault it (whether it's a good line is still
 *  for people to judge). */
export const visionFlaw = (line: string): VisionFlaw | null => visionFlags(line)[0]?.kind ?? null;

/** Roadmap columns (`horizon-board` lanes), plus the bin for bets that don't serve the vision. Certainty falls from
 *  left to right: Now is committed and detailed, Next is shaped, Later is a problem worth watching. */
export const HORIZONS = ['now', 'next', 'later', 'off'] as const;
export type Horizon = (typeof HORIZONS)[number];
/** How much the team knows: the problem is proven and a fix has been tested, the problem is proven, or it's a signal. */
export const EVIDENCE = ['tested', 'proven', 'signal'] as const;
export type Evidence = (typeof EVIDENCE)[number];
/** One bet on Galla's roadmap: the shopkeeper's problem it takes on (`short` for small cards), the feature first
 *  proposed for it, what the team knows, whether it serves the vision, and the bet it builds on, if any. */
export interface RoadmapBet { short?: string; problem: string; idea: string; evidence: Evidence; fits: boolean; after?: string }
/** Where a bet goes: off the roadmap if it doesn't serve the vision; otherwise its evidence sets the column (tested →
 *  Now, proven → Next, a signal → Later), and it lands at least one column after the bet it builds on. */
export const horizonFor = (bet: RoadmapBet, all: Readonly<Record<string, RoadmapBet>>): Horizon => {
  if (!bet.fits) return 'off';
  const base = EVIDENCE.indexOf(bet.evidence);
  const parent = bet.after ? all[bet.after] : undefined;
  if (!parent) return HORIZONS[base];
  const dep = HORIZONS.indexOf(horizonFor(parent, all));
  return HORIZONS[Math.min(2, Math.max(base, dep + 1))];
};
/** The bets in the `horizon-board` game and the `roadmap-horizons` scene. Galla is a Lucknow app that kirana shops use
 *  to keep their udhaar (credit) ledger. */
export const GALLA_BETS = {
  reminders: { short: 'Customers forget what they owe', problem: 'Customers forget what they owe until Shabnam asks, and she hates asking', idea: 'Automatic WhatsApp reminders', evidence: 'tested', fits: true },
  backup: { short: 'A lost phone wipes the ledger', problem: 'A lost or broken phone wipes out the whole ledger', idea: 'Cloud backup', evidence: 'tested', fits: true },
  collect: { short: 'Paying back means a trip to the shop', problem: 'Customers who get a reminder still have to come to the shop to pay', idea: 'A UPI link inside the reminder', evidence: 'tested', fits: true, after: 'reminders' },
  disputes: { short: 'Arguments over what was bought', problem: 'Customers argue about what they bought on credit', idea: 'A shared statement each customer can open', evidence: 'proven', fits: true, after: 'reminders' },
  voice: { short: 'Entries skipped in the rush', problem: 'Writing an entry in the evening rush takes too long, so it gets written later or not at all', idea: 'Voice entry in Hindi', evidence: 'proven', fits: true },
  stock: { short: 'Fast sellers run out', problem: 'Fast sellers like Parle-G run out before the distributor’s next visit', idea: 'Low-stock alerts', evidence: 'proven', fits: true },
  reorder: { short: 'Three calls to reorder stock', problem: 'Ordering from three distributors means three phone calls', idea: 'One-tap reorder to distributors', evidence: 'signal', fits: true, after: 'stock' },
  loans: { short: 'Short of cash for Diwali stock', problem: 'A good month of udhaar leaves her short of cash for Diwali stock', idea: 'Small working-capital loans', evidence: 'signal', fits: true },
  gst: { short: 'Supermarkets need GST invoices', problem: 'Supermarkets registered for GST need tax invoices', idea: 'GST billing suite', evidence: 'proven', fits: false },
  dark: { short: 'Requests for a dark theme', problem: 'Three users asked for a dark theme', idea: 'Dark mode', evidence: 'signal', fits: false },
} as const satisfies Record<string, RoadmapBet>;
export type GallaBet = keyof typeof GALLA_BETS;

/** How close a rival is to the job (`rival-map` lanes), inner ring first. */
export const RIVAL_RINGS = ['direct', 'indirect', 'substitute', 'not'] as const;
export type RivalRing = (typeof RIVAL_RINGS)[number];
/** Something a shopkeeper could use instead of Galla: whether it's for the same people and the same job (keeping track
 *  of who owes what, and getting it back), and what it is: an app like Galla, a different kind of product, or a
 *  makeshift habit. `edge` is what it does better than Galla today. */
export interface Rival { name: string; who: 'same' | 'other'; job: 'same' | 'other'; kind: 'like' | 'product' | 'makeshift'; edge: string }
/** The ring a rival sits on: not a competitor unless it serves the same people doing the same job; then direct if it's
 *  the same kind of product, indirect if it's a different product, a substitute if it's a habit or a workaround. */
export const ringFor = (r: Pick<Rival, 'who' | 'job' | 'kind'>): RivalRing =>
  r.who !== 'same' || r.job !== 'same' ? 'not' : r.kind === 'like' ? 'direct' : r.kind === 'product' ? 'indirect' : 'substitute';
/** The rivals in the `rival-map` game and the `rival-rings` scene. */
export const GALLA_RIVALS = {
  bahi: { name: 'Bahi, a ledger app for small shops', who: 'same', job: 'same', kind: 'like', edge: 'Prints a bill on a ₹2,000 Bluetooth printer' },
  udhaarpe: { name: 'UdhaarPe, another credit-ledger app', who: 'same', job: 'same', kind: 'like', edge: 'Free SMS reminders, no WhatsApp needed' },
  notebook: { name: 'The paper khata on the counter', who: 'same', job: 'same', kind: 'makeshift', edge: 'Free, never needs charging, and customers trust ink' },
  whatsapp: { name: 'Voice notes to customers on WhatsApp', who: 'same', job: 'same', kind: 'makeshift', edge: 'She already uses it all day' },
  memory: { name: 'Her son Faiz remembering who owes what', who: 'same', job: 'same', kind: 'makeshift', edge: 'Knows every customer by face' },
  upi: { name: 'The “request money” button in a UPI app', who: 'same', job: 'same', kind: 'product', edge: 'Customers can pay in one tap' },
  billing: { name: 'A billing app with a credit-sale tab', who: 'same', job: 'same', kind: 'product', edge: 'Totals the bill and the credit in one step' },
  quick: { name: 'Blinkit and Instamart delivering in ten minutes', who: 'other', job: 'other', kind: 'product', edge: 'Takes her customers’ late-night orders' },
  distributor: { name: 'The distributor’s ordering app', who: 'same', job: 'other', kind: 'product', edge: 'Shows the scheme prices first' },
  pos: { name: 'A billing suite for supermarket chains', who: 'other', job: 'same', kind: 'product', edge: 'Barcodes, GST and ten tills at once' },
} as const satisfies Record<string, Rival>;
export type GallaRival = keyof typeof GALLA_RIVALS;

// st.3 · Metrics that matter. Kahaani is a Hyderabad app of bedtime audio stories for children, in Hindi, Telugu and
// English; families listen at night, so its numbers are about nights, not taps.

/** What a metric is for in a metric tree (`metric-flow` lanes): the one number for the value users get, the levers
 *  teams can pull to move it, the harms it must not cause, and numbers that only look good. */
export const METRIC_ROLES = ['north', 'input', 'guardrail', 'vanity'] as const;
export type MetricRole = (typeof METRIC_ROLES)[number];
/** A proposed metric: whether it counts value the user gets, whether one team can move it in weeks, whether moving it
 *  moves the north star, whether it measures a harm, and whether it only ever goes up. `short` is for small cards. */
export interface Metric { short: string; name: string; value?: boolean; team?: boolean; leads?: boolean; harm?: boolean; cumulative?: boolean }
/** A metric's role: a running total is vanity whatever it counts; a harm is a guardrail; value that no single team
 *  owns is the north star; a lever a team can pull that moves the north star is an input; anything else is vanity. */
export const metricRole = (m: Omit<Metric, 'short' | 'name'>): MetricRole =>
  m.cumulative ? 'vanity' : m.harm ? 'guardrail' : m.value && !m.team ? 'north' : m.team && m.leads ? 'input' : 'vanity';
/** The metrics in the `metric-flow` game and the `metric-tree` scene. */
export const KAHAANI_METRICS = {
  nights: { short: 'Story-nights a week', name: 'Story-nights a week: nights on which a child finishes at least one story', value: true },
  firstweek: { short: 'A first story in week one', name: 'New families who finish a story in their first week', team: true, leads: true },
  finish: { short: 'Stories finished', name: 'Share of started stories that are finished', team: true, leads: true },
  opens: { short: 'Nights opened', name: 'Nights a week each family opens Kahaani', team: true, leads: true },
  shelf: { short: 'New Telugu stories', name: 'New Telugu stories published each week', team: true, leads: true },
  late: { short: 'Listening after 10 pm', name: 'Children still listening after 10 pm', team: true, harm: true },
  mute: { short: 'Notifications turned off', name: 'Parents who turn off Kahaani’s notifications', team: true, harm: true },
  downloads: { short: 'Total downloads', name: 'Total app downloads since launch', cumulative: true },
  played: { short: 'Stories ever played', name: 'Total stories ever played', value: true, cumulative: true },
  screens: { short: 'Screens per visit', name: 'Screens viewed per visit', team: true },
} as const satisfies Record<string, Metric>;
export type KahaaniMetric = keyof typeof KAHAANI_METRICS;
/** The north star broken into its inputs: families listening × nights each opens the app × the share of those nights
 *  that end with a finished story. */
export const storyNights = ({ families, opens, finish }: { families: number; opens: number; finish: number }) => Math.round(families * opens * finish);
/** Kahaani's week of 16 November, for the scene and the end of the game. */
export const KAHAANI_WEEK = { families: 40_000, opens: 3.5, finish: 0.6 } as const;

/** Google's HEART dimensions (Rodden, Hutchinson and Fu, 2010), in order. */
export const HEART = ['happiness', 'engagement', 'adoption', 'retention', 'task'] as const;
export type HeartDim = (typeof HEART)[number];
/** Goals → signals → metrics, plus the bin for numbers that can't fail (`heart-grid` lanes; goals are given). */
export const GSM_PARTS = ['signal', 'metric', 'cut'] as const;
export type GsmPart = (typeof GSM_PARTS)[number];
const RUNNING_TOTAL = /\b(total|ever|since launch|all-time)\b/i;
const MEASURE_WORD = /\b(share|rate|median|average|per)\b|%/i;
const TIME_WINDOW = /\b(\d+\s*(days?|weeks?|months?)|each (day|week|month)|a (day|week|month)|daily|weekly|monthly)\b/i;
/** What a line of a HEART plan is, read from its words: a running total is cut (it only goes up); a rate, share,
 *  median, average or "per" over a time window is a metric; anything else is a signal (something you could notice
 *  people doing or feeling). */
export const gsmPart = (text: string): GsmPart =>
  RUNNING_TOTAL.test(text) ? 'cut' : MEASURE_WORD.test(text) && TIME_WINDOW.test(text) ? 'metric' : 'signal';
/** The goal for each HEART row of Apni Awaaz, Kahaani's feature for recording a story in your own voice. */
export const AWAAZ_GOALS: Record<HeartDim, string> = {
  happiness: 'Families love hearing their own people tell the story',
  engagement: 'Children ask for the recorded stories again',
  adoption: 'Families try recording soon after it launches',
  retention: 'Recorders keep recording, not just once',
  task: 'A 70-year-old can record a story without help',
};
/** Lines from the Apni Awaaz HEART plan (`heart-grid` cards). Cut lines have no row. */
export const AWAAZ_HEART = {
  hsig: { text: 'Parents say the recording sounds “just like Dadi in the room”', dim: 'happiness' },
  hmet: { text: 'Average rating of a recorded story, 1 to 5, asked after it plays, each week', dim: 'happiness' },
  esig: { text: 'Children press play on Dadi’s story again the next night', dim: 'engagement' },
  emet: { text: 'Plays per recorded story in its first 7 days', dim: 'engagement' },
  asig: { text: 'Families tap Record for the first time', dim: 'adoption' },
  amet: { text: 'Share of weekly listening families who save a first recording within 30 days of launch', dim: 'adoption' },
  rsig: { text: 'Families who recorded once come back to record another', dim: 'retention' },
  rmet: { text: 'Share of first-time recorders who save another recording within 4 weeks', dim: 'retention' },
  tsig: { text: 'Grandparents give up halfway through a recording', dim: 'task' },
  tmet: { text: 'Share of recordings started that are saved, and median minutes to save one, each week', dim: 'task' },
  total: { text: 'Total recordings since launch' },
  taps: { text: 'Total taps on the Record button, ever' },
} as const satisfies Record<string, { text: string; dim?: HeartDim }>;
export type AwaazLine = keyof typeof AWAAZ_HEART;

/** The three ways to look at Kahaani's new families (`cohort-read` lanes): one journey step by step, groups by the
 *  week they joined, and groups by something about them. */
export const DATA_VIEWS = ['funnel', 'cohort', 'segment'] as const;
export type DataView = (typeof DATA_VIEWS)[number];
/** New families from 12 October to 22 November, from install to a second night. */
export const KAHAANI_FUNNEL = [
  { id: 'install', label: 'Installed Kahaani', n: 10_000 },
  { id: 'child', label: 'Added a child', n: 8_200 },
  { id: 'started', label: 'Started a first story', n: 6_100 },
  { id: 'finished', label: 'Finished it', n: 3_400 },
  { id: 'second', label: 'Came back a second night', n: 2_100 },
] as const;
export type FunnelStep = (typeof KAHAANI_FUNNEL)[number]['id'];
/** Weekly cohorts: families who joined in the week starting `label`, and how many listened in week 0, 1, 2…
 *  `note` marks what was different about the week. The new first night shipped on 9 November. */
export const KAHAANI_COHORTS = [
  { id: '12oct', label: '12 Oct', kept: [2000, 800, 660, 600, 560] },
  { id: '19oct', label: '19 Oct', kept: [2100, 861, 714, 651, 609] },
  { id: '26oct', label: '26 Oct', kept: [2000, 840, 700, 620, 600] },
  { id: '2nov', label: '2 Nov', kept: [6000, 1320, 960, 780], note: 'Diwali ads' },
  { id: '9nov', label: '9 Nov', kept: [2200, 1144, 990], note: 'New first night' },
  { id: '16nov', label: '16 Nov', kept: [2300, 1242] },
] as const;
export type CohortId = (typeof KAHAANI_COHORTS)[number]['id'];
/** First stories started and finished, by the language the family picked. Adds up to the funnel's two steps. */
export const KAHAANI_SEGMENTS = {
  hindi: { label: 'Hindi', started: 3000, finished: 1800 },
  telugu: { label: 'Telugu', started: 1500, finished: 600 },
  english: { label: 'English', started: 1600, finished: 1000 },
} as const;
export type KahaaniLang = keyof typeof KAHAANI_SEGMENTS;
/** The share of a funnel step that reaches a later one. */
export const funnelShare = (from: FunnelStep, to: FunnelStep) =>
  KAHAANI_FUNNEL.find(s => s.id === to)!.n / KAHAANI_FUNNEL.find(s => s.id === from)!.n;
/** The share of one or more cohorts still listening in a week, weighted by size: blending cohorts gives the bigger
 *  one more say, which is how one unusual week can hide a real change. Null if a cohort hasn't reached that week. */
export const cohortShare = (ids: readonly CohortId[], week: number) => {
  const rows = KAHAANI_COHORTS.filter(c => ids.includes(c.id));
  if (rows.some(c => c.kept.length <= week)) return null;
  return rows.reduce((s, c) => s + (c.kept[week] ?? 0), 0) / rows.reduce((s, c) => s + c.kept[0], 0);
};
export type DataAsk =
  | { view: 'funnel'; from: FunnelStep; to: FunnelStep }
  | { view: 'cohort'; cohorts: readonly CohortId[]; week: number }
  | { view: 'segment'; lang: KahaaniLang };
/** The questions in the `cohort-read` game. */
export const KAHAANI_ASKS = {
  finishFirst: { view: 'funnel', from: 'started', to: 'finished' },
  startAfterChild: { view: 'funnel', from: 'child', to: 'started' },
  secondNight: { view: 'funnel', from: 'install', to: 'second' },
  octWeek4: { view: 'cohort', cohorts: ['26oct'], week: 4 },
  newFirstNight: { view: 'cohort', cohorts: ['9nov'], week: 1 },
  diwali: { view: 'cohort', cohorts: ['2nov'], week: 1 },
  novBlend: { view: 'cohort', cohorts: ['2nov', '9nov', '16nov'], week: 1 },
  telugu: { view: 'segment', lang: 'telugu' },
  hindi: { view: 'segment', lang: 'hindi' },
} as const satisfies Record<string, DataAsk>;
export type KahaaniAsk = keyof typeof KAHAANI_ASKS;
/** The answer to an ask, as a percentage to one decimal place. */
export const askValue = (a: DataAsk) => {
  const share = a.view === 'funnel' ? funnelShare(a.from, a.to)
    : a.view === 'cohort' ? cohortShare(a.cohorts, a.week) ?? 0
      : KAHAANI_SEGMENTS[a.lang].finished / KAHAANI_SEGMENTS[a.lang].started;
  return Math.round(share * 1000) / 10;
};
/** How close an estimate is, in percentage points: within 3 is spot on, within 8 is close. */
export const estimateGrade = (guess: number, truth: number): 'spot' | 'close' | 'off' => {
  const d = Math.abs(guess - truth);
  return d <= 3 ? 'spot' : d <= 8 ? 'close' : 'off';
};

/** Kahaani's tracking plan: each event, the moment it fires on the story player (`where`, which the game and scene
 *  draw), and the properties it carries. Names are object_action in the past tense. */
export const KAHAANI_EVENTS = {
  story_started: { where: 'play', trigger: 'The story’s audio starts playing', props: ['story_id', 'language', 'source', 'length_min'] },
  story_finished: { where: 'end', trigger: 'The last second of the story plays', props: ['story_id', 'language', 'listened_min', 'timer_on'] },
  story_stopped: { where: 'stop', trigger: 'Playback stops before the end', props: ['story_id', 'language', 'at_percent', 'reason'] },
  timer_set: { where: 'timer', trigger: 'A parent picks a sleep-timer length', props: ['story_id', 'minutes'] },
} as const satisfies Record<string, { where: string; trigger: string; props: readonly string[] }>;
export type KahaaniEvent = keyof typeof KAHAANI_EVENTS;
/** Properties that identify a person. They never go in an analytics event, whatever the question. */
export const PII_PROPS = ['child_name', 'phone', 'email', 'address'] as const;
/** The first thing wrong with an event name, or null: names are lower snake_case, say what happened to which object
 *  (not which button or screen), and end in a past-tense action. */
export const eventNameFlaw = (name: string): 'case' | 'ui' | 'vague' | 'tense' | null => {
  if (!/^[a-z]+(_[a-z]+)*$/.test(name)) return 'case';
  const words = name.split('_');
  if (words.some(w => ['button', 'btn', 'screen', 'page', 'tap', 'tapped', 'click', 'clicked', 'pressed'].includes(w))) return 'ui';
  if (words.length < 2 || ['event', 'action', 'thing', 'misc', 'data'].includes(words[0])) return 'vague';
  const verb = words[words.length - 1];
  return verb.endsWith('ed') || ['set', 'sent', 'shown', 'begun'].includes(verb) ? null : 'tense';
};
/** Questions the team wants the tracking plan to answer (`event-wire` cards): the event that answers each, and the
 *  properties it needs. */
export const TRACK_QUESTIONS = {
  source: { event: 'story_started', props: ['source'] },
  language: { event: 'story_started', props: ['language'] },
  timerOn: { event: 'story_finished', props: ['timer_on'] },
  favourite: { event: 'story_finished', props: ['story_id'] },
  teluguDrop: { event: 'story_stopped', props: ['language', 'at_percent'] },
  why: { event: 'story_stopped', props: ['reason'] },
  minutes: { event: 'timer_set', props: ['minutes'] },
  timerStory: { event: 'timer_set', props: ['story_id'] },
} as const satisfies Record<string, { event: KahaaniEvent; props: readonly string[] }>;
export type TrackQuestion = keyof typeof TRACK_QUESTIONS;
/** Checks a pick of properties for a question: what it still needs, and any personal data that must come out. */
export const propsCheck = (need: readonly string[], chosen: readonly string[]) => {
  const missing = need.filter(p => !chosen.includes(p));
  const pii = chosen.filter(p => (PII_PROPS as readonly string[]).includes(p));
  return { missing, pii, ok: missing.length === 0 && pii.length === 0 };
};

// gr.2 · Onboarding & activation. Kaksha is a Chennai app for home tutors: batches, attendance, homework and fee
// reminders, with parents kept up to date on WhatsApp. Its aha is a first class marked, with parents told.

/** Meenakshi's first month with Kaksha (`cue-timeline` lanes), each with what she has done by then. */
export const KAKSHA_MOMENTS = {
  open: { label: 'First open', students: 0, classes: 0, feesDue: false },
  batch: { label: 'First batch made', students: 8, classes: 0, feesDue: false },
  class: { label: 'First class taken', students: 8, classes: 1, feesDue: false },
  fees: { label: 'Fees due, 1st of the month', students: 22, classes: 12, feesDue: true },
} as const satisfies Record<string, { label: string; students: number; classes: number; feesDue: boolean }>;
export type KakshaMoment = keyof typeof KAKSHA_MOMENTS;
/** What has to be true before a piece of onboarding is any use. */
export interface TipNeeds { students?: number; classes?: number; feesDue?: boolean }
/** The first moment at which a tip's needs are met: teach it then, not before (she can't use it) and not after (she
 *  already needed it). Null if no moment in the first month meets them. */
export const cueFor = (needs: TipNeeds): KakshaMoment | null =>
  (Object.keys(KAKSHA_MOMENTS) as KakshaMoment[]).find(k => {
    const m = KAKSHA_MOMENTS[k];
    return m.students >= (needs.students ?? 0) && m.classes >= (needs.classes ?? 0) && (!needs.feesDue || m.feesDue);
  }) ?? null;
/** Whether a tip shown at a moment comes too early, right on time, or too late. */
export const cueVerdict = (needs: TipNeeds, at: KakshaMoment): 'early' | 'right' | 'late' => {
  const order = Object.keys(KAKSHA_MOMENTS);
  const d = order.indexOf(at) - order.indexOf(cueFor(needs) ?? order[order.length - 1]);
  return d < 0 ? 'early' : d > 0 ? 'late' : 'right';
};
/** Pieces of Kaksha's onboarding (`cue-timeline` cards). The old app showed all of them in a tour on first open. */
export const KAKSHA_TIPS = {
  batch: { text: 'Create your first batch: a name, the days and the time', needs: {} },
  students: { text: 'Add students by picking parents from your phone contacts', needs: {} },
  attendance: { text: 'Tap a name to mark them present; parents get a WhatsApp message', needs: { students: 1 } },
  parents: { text: 'Choose which updates parents get: attendance, homework, or both', needs: { students: 1 } },
  homework: { text: 'Send tonight’s homework to the whole batch in one go', needs: { classes: 1 } },
  reschedule: { text: 'Move a class and every parent is told the new time', needs: { classes: 1 } },
  remind: { text: 'Send fee reminders to parents who haven’t paid yet', needs: { feesDue: true } },
  report: { text: 'Share a monthly attendance report with each parent', needs: { classes: 10 } },
} as const satisfies Record<string, { text: string; needs: TipNeeds }>;
export type KakshaTip = keyof typeof KAKSHA_TIPS;

/** The parts of an empty state that activates (`empty-build` lanes), top to bottom of the screen. */
export const EMPTY_SLOTS = ['message', 'starter', 'action', 'preview'] as const;
export type EmptySlot = (typeof EMPTY_SLOTS)[number];
/** A candidate piece for Kaksha's empty Batches screen. Message: does it say what goes here and what to do, or talk
 *  about the app? Starter: how much typing before the first batch has students, and is any sample content marked as
 *  sample? Action: how many equal buttons, and can she see one? Preview: what fills the space until she starts.
 *  `taps` counts taps to a first batch with students in it. */
export type EmptyPiece =
  | { slot: 'message'; text: string; names: boolean; next: boolean; aboutApp?: boolean }
  | { slot: 'starter'; text: string; taps: number; sample?: 'marked' | 'unmarked' }
  | { slot: 'action'; text: string; buttons: number; visible: boolean; taps: number }
  | { slot: 'preview'; text: string; shows: 'example' | 'zeros' | 'art'; pushesDown?: boolean };
export type EmptyFlaw = 'about-app' | 'vague' | 'unmarked' | 'effort' | 'dead-end' | 'competing' | 'zeros' | 'pushes-down';
/** What stops a piece from activating, or null if it helps. More than 6 taps to a first batch is too much typing for
 *  a tutor between classes; sample content must say it's a sample. */
export const emptyFlaw = (p: EmptyPiece): EmptyFlaw | null => {
  switch (p.slot) {
    case 'message': return p.aboutApp ? 'about-app' : p.names && p.next ? null : 'vague';
    case 'starter': return p.sample === 'unmarked' ? 'unmarked' : p.taps > 6 ? 'effort' : null;
    case 'action': return p.buttons === 0 || !p.visible ? 'dead-end' : p.buttons > 1 ? 'competing' : null;
    case 'preview': return p.shows === 'zeros' ? 'zeros' : p.shows === 'art' && p.pushesDown ? 'pushes-down' : null;
  }
};
/** Taps from the empty screen to a first batch with students in it: the button, then filling it. */
export const firstValueTaps = (pieces: readonly EmptyPiece[]) =>
  pieces.reduce((s, p) => s + (p.slot === 'starter' || p.slot === 'action' ? p.taps : 0), 0);
/** The pieces in the `empty-build` game and the `empty-activate` scene. One per slot has no flaw. */
export const EMPTY_PIECES = {
  msgGood: { slot: 'message', text: 'Your batches live here. Make one for each group you teach, and Kaksha keeps attendance and tells parents.', names: true, next: true },
  msgVague: { slot: 'message', text: 'No batches found.', names: false, next: false },
  msgHype: { slot: 'message', text: 'Welcome to Kaksha, India’s smartest tuition platform!', names: false, next: false, aboutApp: true },
  fillContacts: { slot: 'starter', text: 'Pick students’ parents from your phone contacts', taps: 4 },
  fillForm: { slot: 'starter', text: 'A form with 11 fields per student: name, class, school, date of birth, blood group…', taps: 14 },
  fillFake: { slot: 'starter', text: 'Five made-up students already in your batch, not marked as samples', taps: 0, sample: 'unmarked' },
  actOne: { slot: 'action', text: 'One button: Create a batch', buttons: 1, visible: true, taps: 1 },
  actMany: { slot: 'action', text: 'Four equal buttons: Create batch, Add student, Set fees, Watch tutorial', buttons: 4, visible: true, taps: 1 },
  actNone: { slot: 'action', text: 'No button, just “Use the menu to add a batch”', buttons: 0, visible: false, taps: 3 },
  showExample: { slot: 'preview', text: 'A faded example card, “Class 10 Maths · Mon Wed Fri, 5 pm · 8 students”, marked Example', shows: 'example' },
  showZeros: { slot: 'preview', text: 'Dashboard tiles reading 0 students, 0% attendance, ₹0 collected', shows: 'zeros' },
  showArt: { slot: 'preview', text: 'A big illustration of a teacher at a blackboard that pushes the button off the screen', shows: 'art', pushesDown: true },
} as const satisfies Record<string, EmptyPiece>;
export type EmptyPieceId = keyof typeof EMPTY_PIECES;

/** What Kaksha should do about Pro at a moment (`paywall-timing` lanes). */
export const UPGRADE_MOVES = ['offer', 'finish', 'hint', 'quiet'] as const;
export type UpgradeMove = (typeof UPGRADE_MOVES)[number];
/** A moment: has she had value yet, did something just go wrong, has she reached for something Pro does, is she in
 *  the middle of a task someone is waiting on, and is she close to a limit or just had a win? */
export interface ProMoment { value: boolean; failed?: boolean; limit?: boolean; midTask?: boolean; primed?: boolean }
/** No value yet, or something just failed: don't sell. Reaching for Pro: offer it, but after the task if she's in the
 *  middle of one. Near a limit or after a win: a quiet mention. Otherwise stay out of the way. */
export const upgradeMove = (m: ProMoment): UpgradeMove =>
  !m.value || m.failed ? 'quiet' : m.limit ? (m.midTask ? 'finish' : 'offer') : m.primed ? 'hint' : 'quiet';
/** How a pick lands: a sale, a tutor annoyed by a pitch she didn't need, work lost to a block mid-task, a sale missed
 *  because nothing was offered, or fine. */
export const moveEffect = (chosen: UpgradeMove, right: UpgradeMove): 'sale' | 'annoyed' | 'lost' | 'missed' | 'ok' =>
  chosen === right ? (right === 'offer' ? 'sale' : 'ok')
    : chosen === 'offer' && right === 'finish' ? 'lost'
      : (chosen === 'offer' || chosen === 'finish') && (right === 'quiet' || right === 'hint') ? 'annoyed'
        : right === 'offer' || right === 'finish' ? 'missed' : 'ok';
/** Kaksha Pro: free for up to 25 students; Pro is ₹499 a year. */
export const KAKSHA_PRO = { yearly: 499, freeStudents: 25 } as const;
/** Moments in Meenakshi's first months (`paywall-timing` cards). */
export const PRO_MOMENTS = {
  firstOpen: { text: 'First open, before she has made a batch', value: false },
  dayTwo: { text: 'Day two: she opens Kaksha to add one more student before her first class', value: false },
  nearLimit: { text: 'She adds her 23rd student; the free plan holds 25', value: true, primed: true },
  overLimit: { text: 'At home on Sunday, she tries to add a 26th student for a new Class 9 batch', value: true, limit: true },
  receiptLogo: { text: 'A parent waits at the door for a fee receipt, and she taps “Add my logo”, a Pro feature', value: true, limit: true, midTask: true },
  worksheet: { text: 'Halfway through typing a 20-question worksheet, she taps “Attach PDF”, a Pro feature', value: true, limit: true, midTask: true },
  monthWin: { text: 'Month end: 21 of 22 parents paid after reminders, ₹33,000 collected', value: true, primed: true },
  failedSend: { text: 'A fee reminder didn’t send: the parent’s number was wrong', value: true, failed: true },
  marking: { text: 'Marking attendance with the class sitting in front of her', value: true, midTask: true },
  reportCard: { text: 'Planning the term, she looks for term-test report cards, a Pro feature', value: true, limit: true },
  colleague: { text: 'She tries to add her colleague Selvi as a second teacher on a batch', value: true, limit: true },
} as const satisfies Record<string, ProMoment & { text: string }>;
export type ProMomentId = keyof typeof PRO_MOMENTS;

// gr.3 · Experimentation. Tokri is an Indore grocery-delivery app: vegetables, fruit and staples in under an hour.
// Its key number is checkout conversion: the share of carts that become a paid order, 8% today. The maths lives in
// ./stats; this is the chapter's data and the rules the games score against.

/** The four parts of a testable hypothesis (`hypo-fix` lanes), in the order the sentence reads:
 *  “Because [evidence], we believe [one change] for [the people who'll see it] will [move a metric, by how much].” */
export const HYPO_PARTS = ['because', 'change', 'who', 'expect'] as const;
export type HypoPart = (typeof HYPO_PARTS)[number];
/** A hypothesis, part by part. Because: does it cite something seen (data, recordings, tickets, interviews), or only
 *  an opinion? Change: is it one change a designer could build, or vague or a bundle? Who: is it the people who'll
 *  actually meet the change, or everyone (which dilutes the effect)? Expect: does it name a metric, and a direction
 *  and size, so a result could prove it wrong? `fix` rewrites the weak part; `trap` is a rewrite still weak the same
 *  way. */
export interface Hypothesis {
  because: { text: string; evidence: boolean };
  change: { text: string; one: boolean };
  who: { text: string; scoped: boolean };
  expect: { text: string; metric: boolean; size: boolean };
  fix: string;
  trap: string;
}
/** The first part that stops a hypothesis being testable, or null if it's sound. */
export const hypoFlaw = (h: Hypothesis): HypoPart | null =>
  !h.because.evidence ? 'because' : !h.change.one ? 'change' : !h.who.scoped ? 'who' : !(h.expect.metric && h.expect.size) ? 'expect' : null;
/** The hypothesis as one sentence. */
export const hypoText = (h: Pick<Hypothesis, HypoPart>) => `Because ${h.because.text}, we believe ${h.change.text} for ${h.who.text} will ${h.expect.text}.`;
/** The hypothesis with its weak part rewritten by `fix` (or by `trap`, which leaves it weak). */
export const hypoRewrite = (h: Hypothesis, use: 'fix' | 'trap' = 'fix'): Hypothesis => {
  const part = hypoFlaw(h), text = h[use], ok = use === 'fix';
  if (!part) return h;
  const next = { ...h };
  if (part === 'because') next.because = { text, evidence: ok };
  if (part === 'change') next.change = { text, one: ok };
  if (part === 'who') next.who = { text, scoped: ok };
  if (part === 'expect') next.expect = { text, metric: ok || h.expect.metric, size: ok };
  return next;
};
/** Tokri's experiment backlog, as first written (`hypo-fix` cards). Each has exactly one weak part. */
export const TOKRI_HYPOS = {
  feeEarly: {
    because: { text: 'Blinkit and Zepto do it this way', evidence: false },
    change: { text: 'showing the ₹25 delivery fee on the cart', one: true },
    who: { text: 'people who reach the cart', scoped: true },
    expect: { text: 'lift checkout conversion from 8% to at least 8.8%', metric: true, size: true },
    fix: '31% of the carts dropped in last month’s session recordings were dropped on the payment page, where the ₹25 fee first appears',
    trap: 'every big grocery app shows the fee early, and they’re all growing',
  },
  doorstep: {
    because: { text: 'our founder is sure customers want it', evidence: false },
    change: { text: 'a “Leave at the door” option at checkout', one: true },
    who: { text: 'people ordering after 9 pm', scoped: true },
    expect: { text: 'cut failed late-night deliveries from 6% of orders to 4%', metric: true, size: true },
    fix: 'riders logged 340 failed deliveries after 9 pm last month because nobody came to the door',
    trap: 'the whole team agrees it’s a great idea',
  },
  address: {
    because: { text: 'support gets about 40 tickets a week from repeat customers who had to type their address again', evidence: true },
    change: { text: 'a better checkout', one: false },
    who: { text: 'customers with at least one past order', scoped: true },
    expect: { text: 'lift their checkout conversion from 11% to at least 12%', metric: true, size: true },
    fix: 'filling in their last delivery address, with a one-tap Change link',
    trap: 'a cleaner, simpler, more modern checkout',
  },
  fruit: {
    because: { text: 'fruit pages lose 58% of visitors, more than any other page in the app', evidence: true },
    change: { text: 'new photos, new prices and a new layout', one: false },
    who: { text: 'people who open a fruit or vegetable page', scoped: true },
    expect: { text: 'lift add-to-cart on those pages from 12% to at least 13.5%', metric: true, size: true },
    fix: 'a photo of the actual batch, taken that morning at the store',
    trap: 'a fresh look for the whole page: photos, prices, badges and layout',
  },
  coupon: {
    because: { text: 'new customers who order in their first three days are three times as likely to still be ordering in month two', evidence: true },
    change: { text: '₹75 off the first order, shown on the cart', one: true },
    who: { text: 'all Tokri customers', scoped: false },
    expect: { text: 'lift the share of new installs who order within 7 days from 20% to at least 22%', metric: true, size: true },
    fix: 'people who installed in the last 7 days and haven’t ordered yet',
    trap: 'everyone who opens the app, so the result covers all our customers',
  },
  retry: {
    because: { text: 'UPI payments fail three times as often on our Android Go app as anywhere else', evidence: true },
    change: { text: 'retrying a failed UPI payment in one tap, with the cart kept', one: true },
    who: { text: 'every customer', scoped: false },
    expect: { text: 'lift payment success from 91% to at least 93%', metric: true, size: true },
    fix: 'people on the Android Go app whose UPI payment has just failed',
    trap: 'every Tokri customer, on every phone, so nobody misses out',
  },
  usual: {
    because: { text: 'in 12 interviews, 9 shoppers said they forget staples like atta and oil until they run out', evidence: true },
    change: { text: 'a “Your usual” row of last month’s staples on the home screen', one: true },
    who: { text: 'customers with three or more orders', scoped: true },
    expect: { text: 'make them love the app', metric: false, size: false },
    fix: 'lift their orders per customer over four weeks from 2.1 to at least 2.3',
    trap: 'make them engage with the app a lot more',
  },
  hindi: {
    because: { text: 'half our Indore customers have their phones set to Hindi, and checkout is in English only', evidence: true },
    change: { text: 'showing the cart and checkout in Hindi when the phone is set to Hindi', one: true },
    who: { text: 'customers whose phone is set to Hindi', scoped: true },
    expect: { text: 'change their checkout conversion', metric: true, size: false },
    fix: 'lift their checkout conversion from 6.5% to at least 7.2%, closer to English users’ 8%',
    trap: 'move their checkout conversion a lot',
  },
} as const satisfies Record<string, Hypothesis>;
export type TokriHypo = keyof typeof TOKRI_HYPOS;

/** What to do with a test plan once you know how long it needs (`sample-dial` lanes). */
export const PLAN_VERDICTS = ['go', 'long', 'rethink'] as const;
export type PlanVerdict = (typeof PLAN_VERDICTS)[number];
/** A test Tokri wants to run: the metric's baseline rate today, the smallest relative lift worth detecting (the MDE,
 *  0.1 = +10%), people a day who'd meet the change, how many versions including the control, and the share of those
 *  people put into the test. */
export interface TestPlan { text: string; metric: string; base: number; lift: number; daily: number; arms: number; share?: number }
/** Whole weeks a test runs: at least one, and always full weeks, so every weekday and weekend counts the same. */
export const weeksFor = (days: number) => Math.max(1, Math.ceil(days / 7));
/** The sample a plan needs (α = 0.05 two-sided, 80% power; with more than one variant, α is split between the
 *  comparisons with the control, Bonferroni-style), and how long the traffic takes to supply it. */
export const planTest = (p: TestPlan) => {
  const alpha = 0.05 / (p.arms - 1), target = p.base * (1 + p.lift);
  const n = sampleSize(p.base, target, alpha), total = n * p.arms, perDay = p.daily * (p.share ?? 1);
  const days = total / perDay;
  return { n, total, alpha, target, days, weeks: weeksFor(days) };
};
/** Up to four weeks: run it. Five to eight: run it only if it matters that much. More: rethink it (a bolder change,
 *  a busier screen or a metric closer to the change), or learn it another way. */
export const planVerdict = (weeks: number): PlanVerdict => (weeks <= 4 ? 'go' : weeks <= 8 ? 'long' : 'rethink');
/** The most weeks the `sample-dial` dial shows. */
export const WEEKS_MAX = 24;
/** How close an estimate of weeks is: exact is spot on, within a quarter (at least one week) is close. Anything past
 *  the dial counts as the dial's end. */
export const weeksGrade = (guess: number, truth: number): 'spot' | 'close' | 'off' => {
  const t = Math.min(truth, WEEKS_MAX), d = Math.abs(Math.min(guess, WEEKS_MAX) - t);
  return d === 0 ? 'spot' : d <= Math.max(1, Math.round(t / 4)) ? 'close' : 'off';
};
/** Tests Tokri wants to run (`sample-dial` cards). */
export const TOKRI_PLANS = {
  feeEarly: { text: 'Show the ₹25 delivery fee on the cart', metric: 'Checkout conversion', base: 0.08, lift: 0.1, daily: 6000, arms: 2 },
  greenPay: { text: 'Make the Pay button green', metric: 'Checkout conversion', base: 0.08, lift: 0.02, daily: 6000, arms: 2 },
  slots: { text: 'Three new delivery-slot pickers against today’s', metric: 'Slot picked → paid', base: 0.6, lift: 0.05, daily: 700, arms: 4 },
  reorder: { text: 'A “Reorder last basket” button on the home screen', metric: 'Home visit → order', base: 0.03, lift: 0.1, daily: 20000, arms: 2 },
  cautious: { text: 'Show the fee on the cart, but to only 10% of carts, to be safe', metric: 'Checkout conversion', base: 0.08, lift: 0.1, daily: 6000, arms: 2, share: 0.1 },
  smallLift: { text: 'Show the fee on the cart, looking for a +5% lift, on the 4,000 carts a day outside Indore city', metric: 'Checkout conversion', base: 0.08, lift: 0.05, daily: 4000, arms: 2 },
  coupon: { text: '₹75 off the first order, for new installs', metric: 'First order within 7 days', base: 0.2, lift: 0.1, daily: 400, arms: 2 },
  hindi: { text: 'Cart and checkout in Hindi for Hindi phones', metric: 'Checkout conversion', base: 0.065, lift: 0.1, daily: 2500, arms: 2 },
} as const satisfies Record<string, TestPlan>;
export type TokriPlan = keyof typeof TOKRI_PLANS;

/** The call on a finished test (`result-read` lanes). */
export const READ_CALLS = ['ship', 'flat', 'harm', 'distrust'] as const;
export type ReadCall = (typeof READ_CALLS)[number];
export type ReadWhy = 'win' | 'no-effect' | 'worse' | 'guardrail' | 'srm' | 'early' | 'fishing';
/** A test readout: control A and variant B on the primary metric, the per-version sample the plan asked for, and
 *  optionally a guardrail (a rate where higher is worse) and, for a claim about one slice found after the fact, how
 *  many slices were looked at. */
export interface TestRead { text: string; metric: string; a: Arm; b: Arm; planned: number; slices?: number; guard?: { name: string; a: Arm; b: Arm } }
export const READ_ALPHA = 0.05;
/** The call, in the order a careful analyst checks: is the split what it should be (sample ratio mismatch)? Did it
 *  run to its planned sample, or stop at a lucky peek? Is the difference significant, with α divided by the number of
 *  slices when one was picked out afterwards? Which way did it move, and did a guardrail get significantly worse? */
export const readCall = (r: TestRead): { call: ReadCall; why: ReadWhy } => {
  if (srmP(r.a.n, r.b.n) < SRM_ALPHA) return { call: 'distrust', why: 'srm' };
  if (!r.slices && (r.a.n < r.planned || r.b.n < r.planned)) return { call: 'distrust', why: 'early' };
  const t = twoProp(r.a, r.b);
  if (t.p >= READ_ALPHA / (r.slices ?? 1)) return t.p < READ_ALPHA ? { call: 'distrust', why: 'fishing' } : { call: 'flat', why: 'no-effect' };
  if (t.diff < 0) return { call: 'harm', why: 'worse' };
  if (r.guard) { const g = twoProp(r.guard.a, r.guard.b); if (g.p < READ_ALPHA && g.diff > 0) return { call: 'harm', why: 'guardrail' }; }
  return { call: 'ship', why: 'win' };
};
const feePlan = planTest(TOKRI_PLANS.feeEarly).n, hindiPlan = planTest(TOKRI_PLANS.hindi).n;
/** Finished (or not quite finished) tests (`result-read` cards). Counts are people, and orders where a guardrail
 *  is counted per order. */
export const TOKRI_RESULTS = {
  feeEarly: { text: 'Fee on the cart, after its planned week', metric: 'Checkout conversion', a: { n: 18950, x: 1516 }, b: { n: 18910, x: 1665 }, planned: feePlan,
    guard: { name: 'Orders cancelled', a: { n: 1516, x: 61 }, b: { n: 1665, x: 65 } } },
  reorder: { text: '“Reorder last basket”, after its planned week', metric: 'Home visit → order', a: { n: 53400, x: 1602 }, b: { n: 53300, x: 1790 }, planned: planTest(TOKRI_PLANS.reorder).n,
    guard: { name: 'Orders cancelled', a: { n: 1602, x: 80 }, b: { n: 1790, x: 93 } } },
  hindiDay4: { text: 'Hindi checkout on day 4 of its planned 21. The team wants to stop and ship', metric: 'Checkout conversion', a: { n: 5000, x: 325 }, b: { n: 5010, x: 380 }, planned: hindiPlan },
  hindiEnd: { text: 'Hindi checkout, run to its planned sample', metric: 'Checkout conversion', a: { n: 23700, x: 1541 }, b: { n: 23650, x: 1560 }, planned: hindiPlan },
  lightCart: { text: 'A lighter cart page, after a week. B looks 10% better', metric: 'Checkout conversion', a: { n: 19900, x: 1592 }, b: { n: 19000, x: 1672 }, planned: feePlan },
  slice: { text: 'The fee test’s twentieth slice: iPhone users in Vijay Nagar at weekends, up 43%', metric: 'Checkout conversion', a: { n: 600, x: 48 }, b: { n: 610, x: 70 }, planned: feePlan, slices: 20 },
  scarcity: { text: '“Only 2 left!” on fresh produce, after its planned week', metric: 'Checkout conversion', a: { n: 19000, x: 1520 }, b: { n: 19050, x: 1695 }, planned: feePlan,
    guard: { name: 'Orders with a complaint', a: { n: 1520, x: 30 }, b: { n: 1695, x: 58 } } },
  onePage: { text: 'Address, slot and payment on one long page, after its planned week', metric: 'Checkout conversion', a: { n: 19200, x: 1536 }, b: { n: 19150, x: 1398 }, planned: feePlan },
} as const satisfies Record<string, TestRead>;
export type TokriResult = keyof typeof TOKRI_RESULTS;

/** An A/A test (both versions the same English cart, 6.5% conversion) checked every day for two weeks, 1,250
 *  people a version a day: cumulative orders in A and B at the end of each day. Simulated with `prng(315)`; the
 *  p-value dips under 0.05 on day 4 and ends at 0.63. Drawn by the `peek-trap` scene. */
export const TOKRI_AA = { perDay: 1250, a: [80, 157, 231, 294, 377, 465, 539, 633, 707, 795, 878, 964, 1044, 1117], b: [83, 164, 267, 352, 424, 502, 579, 655, 740, 820, 923, 986, 1057, 1139] } as const;
/** The p-value of the A/A test at the end of each day. */
export const aaPValues = () => TOKRI_AA.a.map((x, i) => twoProp({ n: TOKRI_AA.perDay * (i + 1), x }, { n: TOKRI_AA.perDay * (i + 1), x: TOKRI_AA.b[i] }).p);

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
