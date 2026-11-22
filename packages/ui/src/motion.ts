// Motion presets: every animation in the app picks from these, so the whole product moves with one personality.
import type { Transition } from 'motion/react';

/**
 * Spring presets.
 *  - press:  buttons and cards reacting to a tap (fast, barely any bounce)
 *  - pop:    things appearing: answer cards, XP badges, new blocks (playful overshoot)
 *  - gentle: large surfaces: panels, page transitions, the character card flipping (soft, no wobble)
 *
 * stiffness = how fast it moves toward the target; damping = how quickly the wobble dies out;
 * mass = how heavy it feels.
 */
export const springs = {
  // TODO(human): tune these three so press, pop and gentle feel distinct.
  press:  { type: 'spring', stiffness: 300, damping: 30 },
  pop:    { type: 'spring', stiffness: 300, damping: 30 },
  gentle: { type: 'spring', stiffness: 300, damping: 30 },
} satisfies Record<string, Transition>;

/** Entrance used by chat messages, option cards and stage content. */
export const popIn = {
  initial: { opacity: 0, y: 14, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: springs.pop,
} as const;

/** Stagger children (e.g. a grid of answer cards) by this many seconds. */
export const stagger = (i: number, step = 0.04) => ({ ...springs.pop, delay: i * step });
