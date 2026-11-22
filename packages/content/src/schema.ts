// Lesson content schema. Every exercise type the lesson player supports is defined here,
// and every lesson file is validated against it (see content.test.ts).
import { z } from 'zod';

/** Interactive mock UIs the player can render (implemented in apps/web/src/features/lessons/mocks). */
export const MockId = z.enum([
  'buttons-equal', 'buttons-hierarchy', 'product-card', 'reading-text', 'group-spacing', 'contrast-label',
  'interview-script', 'settings-list', 'settings-grouped',
]);
export type MockId = z.infer<typeof MockId>;

const base = {
  id: z.string().min(1),
  prompt: z.string().min(1),
  /** Shown after Check, right or wrong: the why. */
  explanation: z.string().min(1),
};

export const Concept = z.object({
  type: z.literal('concept'), id: z.string().min(1), title: z.string().min(1),
  body: z.array(z.string().min(1)).min(1), mock: MockId.optional(),
});

export const Pick = z.object({
  type: z.literal('pick'), ...base,
  options: z.array(z.object({ id: z.string(), label: z.string(), detail: z.string().optional() })).min(2).max(5),
  correct: z.string(),
  mock: MockId.optional(),
  /** Optional extra feedback for specific wrong answers. */
  feedback: z.record(z.string(), z.string()).optional(),
});

export const Sort = z.object({
  type: z.literal('sort'), ...base,
  buckets: z.array(z.object({ id: z.string(), label: z.string() })).min(2).max(3),
  items: z.array(z.object({ id: z.string(), label: z.string(), bucket: z.string() })).min(3).max(8),
});

export const Order = z.object({
  type: z.literal('order'), ...base,
  /** Listed in the CORRECT order; the player shuffles them. */
  items: z.array(z.object({ id: z.string(), label: z.string() })).min(3).max(6),
});

export const Spot = z.object({
  type: z.literal('spot'), ...base,
  mock: MockId,
  /** Hotspot ids (defined by the mock) that ARE problems. */
  targets: z.array(z.string()).min(1),
});

export const Tune = z.object({
  type: z.literal('tune'), ...base,
  mock: MockId,
  min: z.number(), max: z.number(), step: z.number().positive(), start: z.number(),
  target: z.tuple([z.number(), z.number()]),
  unit: z.string(),
});

export const Exercise = z.discriminatedUnion('type', [Concept, Pick, Sort, Order, Spot, Tune]);
export type Exercise = z.infer<typeof Exercise>;
export type ExerciseOf<T extends Exercise['type']> = Extract<Exercise, { type: T }>;

export const LessonContent = z.object({
  /** "<chapterId>-<n>", n is 1-based and matches the curriculum lesson order. */
  id: z.string().regex(/^[a-z]{2}\.\d+-\d+$/),
  title: z.string().min(1),
  minutes: z.number().int().positive(),
  steps: z.array(Exercise).min(3),
});
export type LessonContent = z.infer<typeof LessonContent>;
