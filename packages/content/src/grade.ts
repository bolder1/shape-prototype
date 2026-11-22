// Pure grading: the same rules for lessons, reviews and tests.
import type { Exercise, ExerciseOf } from './schema';

/** What the learner has entered for each exercise type. */
export type Answer =
  | { type: 'concept' }
  | { type: 'pick'; choice: string | null }
  | { type: 'sort'; placement: Record<string, string> }   // itemId → bucketId
  | { type: 'order'; sequence: string[] }                 // itemIds in the learner's order
  | { type: 'spot'; selected: string[] }                  // hotspot ids tapped
  | { type: 'tune'; value: number };

export interface Grade {
  correct: boolean;
  /** Item/hotspot ids that were wrong, so the UI can mark them. */
  wrong: string[];
}

/** Whether the learner has given enough input to press Check. */
export function isAnswerReady(ex: Exercise, a: Answer): boolean {
  switch (ex.type) {
    case 'concept': return true;
    case 'pick': return a.type === 'pick' && a.choice != null;
    case 'sort': return a.type === 'sort' && ex.items.every(i => a.placement[i.id]);
    case 'order': return a.type === 'order' && a.sequence.length === ex.items.length;
    case 'spot': return a.type === 'spot' && a.selected.length > 0;
    // A slider always has a value, so require at least one adjustment before Check.
    case 'tune': return a.type === 'tune' && a.value !== ex.start;
  }
}

export function grade(ex: Exercise, a: Answer): Grade {
  switch (ex.type) {
    case 'concept': return { correct: true, wrong: [] };
    case 'pick': {
      const choice = a.type === 'pick' ? a.choice : null;
      return { correct: choice === ex.correct, wrong: choice && choice !== ex.correct ? [choice] : [] };
    }
    case 'sort': {
      const placement = a.type === 'sort' ? a.placement : {};
      const wrong = ex.items.filter(i => placement[i.id] !== i.bucket).map(i => i.id);
      return { correct: wrong.length === 0, wrong };
    }
    case 'order': {
      const seq = a.type === 'order' ? a.sequence : [];
      const wrong = ex.items.filter((item, i) => seq[i] !== item.id).map(i => i.id);
      return { correct: wrong.length === 0, wrong };
    }
    case 'spot': {
      const selected = new Set(a.type === 'spot' ? a.selected : []);
      const targets = new Set(ex.targets);
      // Wrong = tapped something that isn't a problem, or missed a real problem.
      const wrong = [...[...selected].filter(s => !targets.has(s)), ...ex.targets.filter(t => !selected.has(t))];
      return { correct: wrong.length === 0, wrong };
    }
    case 'tune': {
      const v = a.type === 'tune' ? a.value : Number.NaN;
      return { correct: v >= ex.target[0] && v <= ex.target[1], wrong: [] };
    }
  }
}

/** A fresh, empty answer for an exercise. Order exercises start shuffled (deterministically, by id). */
export function initialAnswer(ex: Exercise): Answer {
  switch (ex.type) {
    case 'concept': return { type: 'concept' };
    case 'pick': return { type: 'pick', choice: null };
    case 'sort': return { type: 'sort', placement: {} };
    case 'order': return { type: 'order', sequence: shuffled(ex) };
    case 'spot': return { type: 'spot', selected: [] };
    case 'tune': return { type: 'tune', value: ex.start };
  }
}

/** Deterministic shuffle that is never the correct order (so the exercise always needs solving). */
export function shuffled(ex: ExerciseOf<'order'>): string[] {
  const ids = ex.items.map(i => i.id);
  let seed = [...ex.id].reduce((s, c) => (s * 31 + c.charCodeAt(0)) >>> 0, 7);
  const rand = () => ((seed = (seed * 1103515245 + 12345) >>> 0) / 2 ** 32);
  const out = [...ids];
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  if (out.every((id, i) => id === ids[i])) out.push(out.shift()!);
  return out;
}
