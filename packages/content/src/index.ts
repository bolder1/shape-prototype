import { fd1 } from './chapters/fd-1';
import { fd2 } from './chapters/fd-2';
import { rs1 } from './chapters/rs-1';
import { ia1 } from './chapters/ia-1';
import { ui1 } from './chapters/ui-1';
import { fd1_1 } from './episodes/fd-1-1';
import { fd1_2 } from './episodes/fd-1-2';
import { fd1_3 } from './episodes/fd-1-3';
import { fd1_4 } from './episodes/fd-1-4';
import { fd2_1, fd2_2, fd2_3, fd2_4 } from './episodes/fd-2';
import { rs1_1, rs1_2, rs1_3, rs1_4 } from './episodes/rs-1';
import { ia1_1, ia1_2, ia1_3, ia1_4 } from './episodes/ia-1';
import { ui1_1, ui1_2, ui1_3, ui1_4 } from './episodes/ui-1';
import type { Exercise, LessonContent } from './schema';
import type { Episode } from './episode';

export * from './schema';
export * from './episode';

/** Lessons that have the rich episode format, keyed by lesson id. The rest play as classic lessons. */
export const EPISODES: Record<string, Episode> = { 'fd.1-1': fd1_1, 'fd.1-2': fd1_2, 'fd.1-3': fd1_3, 'fd.1-4': fd1_4,
  'fd.2-1': fd2_1, 'fd.2-2': fd2_2, 'fd.2-3': fd2_3, 'fd.2-4': fd2_4,
  'rs.1-1': rs1_1, 'rs.1-2': rs1_2, 'rs.1-3': rs1_3, 'rs.1-4': rs1_4,
  'ia.1-1': ia1_1, 'ia.1-2': ia1_2, 'ia.1-3': ia1_3, 'ia.1-4': ia1_4,
  'ui.1-1': ui1_1, 'ui.1-2': ui1_2, 'ui.1-3': ui1_3, 'ui.1-4': ui1_4 };
export * from './grade';
export * from './boss';
export * from './boss-grade';
export * from './bosses';

/** Chapters with playable content, keyed by curriculum chapter id. Lessons are in curriculum order. */
export const CONTENT: Record<string, LessonContent[]> = { 'fd.1': fd1, 'fd.2': fd2, 'rs.1': rs1, 'ia.1': ia1, 'ui.1': ui1 };

export const hasContent = (chapterId: string) => !!CONTENT[chapterId]?.length;

/** `n` is 1-based. */
export const getLesson = (chapterId: string, n: number): LessonContent | undefined => CONTENT[chapterId]?.[n - 1];

export const allLessonIds = () => Object.values(CONTENT).flat().map(l => l.id);

/** "fd.1-3" → { chapterId: "fd.1", n: 3 } */
export const parseLessonId = (id: string) => { const i = id.lastIndexOf('-'); return { chapterId: id.slice(0, i), n: Number(id.slice(i + 1)) }; };

export const lessonById = (id: string) => { const { chapterId, n } = parseLessonId(id); return getLesson(chapterId, n); };

/**
 * Finds any reviewable exercise by id: a classic lesson step, or an episode question / mini-game card
 * (ids like "quiz.q1", "game.g3"), turned into a pick so the review deck can replay it.
 */
export function findExercise(lessonId: string, exerciseId: string): Exercise | undefined {
  const step = lessonById(lessonId)?.steps.find(s => s.id === exerciseId);
  if (step) return step;
  const ep = EPISODES[lessonId];
  if (!ep) return undefined;
  const [stage, id] = exerciseId.split('.');
  if (stage === 'game') {
    // A sentence-building round comes back as "pick the strongest question".
    const round = ep.game.rounds?.find(r => r.id === id);
    if (round) {
      const strong = round.answer.join(' ');
      const opts = [strong, ...round.weak].map((label, i) => ({ id: `o${i}`, label }));
      const order = [1, 0, 2, 3].filter(i => i < opts.length).map(i => opts[i]);   // the right answer isn't always first
      return { type: 'pick', id: exerciseId, prompt: round.prompt.replace(/^Turn (.+) into a research question\.$/, 'Which is the strongest research question to replace $1?'),
        options: order, correct: 'o0', explanation: `“${strong}” is open and about real behaviour.` };
    }
    const card = ep.game.cards.find(c => c.id === id);
    if (!card) return undefined;
    const lane = ep.game.lanes.find(l => l.id === card.lane)!;
    return { type: 'pick', id: exerciseId, prompt: `“${card.label}”: which is it?`, options: ep.game.lanes.map(l => ({ id: l.id, label: l.label })),
      correct: card.lane, explanation: `${lane.label}: ${lane.hint.toLowerCase()}.${card.note ? ` ${card.note}` : ''}` };
  }
  const pool = { check: ep.check, gap: [ep.gap], quiz: ep.quiz.questions, ladder: ep.ladder }[stage];
  const q = pool?.find(x => x.id === id);
  return q && { type: 'pick', id: exerciseId, prompt: q.prompt, options: q.options, correct: q.correct, explanation: q.explanation };
}
