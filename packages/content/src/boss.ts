// Boss projects: the chapter-end brief you can fail. Judged against a rubric
// (docs/01-product-vision.md §6: auto checks + AI critique + peer review later).
import { z } from 'zod';
import { MockId } from './schema';

/** What the learner hands in. Kept to text for now so the AI reviewer can read every part. */
export const BossField = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  hint: z.string().min(1),
  kind: z.enum(['text', 'long', 'list']),
  /** list: how many items are needed. */
  items: z.number().int().min(1).max(10).optional(),
  /** text / long: fewest words that counts as an attempt (each list item counts on its own). */
  minWords: z.number().int().min(1).default(3),
  placeholder: z.string().optional(),
});
export type BossField = z.infer<typeof BossField>;

/** One rubric line. Scored 0–3: missing, partial, solid, strong. */
export const BossCriterion = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  /** What a "strong" (3) answer does. The AI reviewer and the self-review both judge against this. */
  strong: z.string().min(1),
  weight: z.number().int().min(1).max(3).default(1),
  /** Must reach at least "solid" to pass, whatever the total. */
  required: z.boolean().default(false),
});
export type BossCriterion = z.infer<typeof BossCriterion>;

export const BossBrief = z.object({
  chapterId: z.string().regex(/^[a-z]{2}\.\d+$/),
  title: z.string().min(1),
  minutes: z.number().int().min(10).max(120),
  /** The situation, in 2–4 short paragraphs. */
  scenario: z.array(z.string().min(1)).min(1),
  mock: MockId.optional(),
  fields: z.array(BossField).min(1),
  rubric: z.array(BossCriterion).min(2),
  tips: z.array(z.string().min(1)).default([]),
  /** A strong answer, shown after review so the learner can compare. */
  example: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
});
export type BossBrief = z.infer<typeof BossBrief>;
export type BossBriefInput = z.input<typeof BossBrief>;

/** Answers keyed by field id. A list field holds one string per item. */
export type BossAnswers = Record<string, string | string[]>;

export const LEVELS = ['Missing', 'Partial', 'Solid', 'Strong'] as const;
export type Level = 0 | 1 | 2 | 3;
