import { fd1 } from './chapters/fd-1';
import { fd2 } from './chapters/fd-2';
import { rs1 } from './chapters/rs-1';
import { ia1 } from './chapters/ia-1';
import { ui1 } from './chapters/ui-1';
import { cw1 } from './chapters/cw-1';
import { st1 } from './chapters/st-1';
import { rs2 } from './chapters/rs-2';
import { ui2 } from './chapters/ui-2';
import { ui3 } from './chapters/ui-3';
import { ds1 } from './chapters/ds-1';
import { pr1 } from './chapters/pr-1';
import { ax1 } from './chapters/ax-1';
import { gr1 } from './chapters/gr-1';
import { br1 } from './chapters/br-1';
import { bz1 } from './chapters/bz-1';
import { dc1 } from './chapters/dc-1';
import { ld2 } from './chapters/ld-2';
import { ia2 } from './chapters/ia-2';
import { fd3 } from './chapters/fd-3';
import { rs3 } from './chapters/rs-3';
import { rs4 } from './chapters/rs-4';
import { ia3 } from './chapters/ia-3';
import { ia4 } from './chapters/ia-4';
import { ui4 } from './chapters/ui-4';
import { ds2 } from './chapters/ds-2';
import { ds3 } from './chapters/ds-3';
import { pr2 } from './chapters/pr-2';
import { pr3 } from './chapters/pr-3';
import { cw2 } from './chapters/cw-2';
import { ax2 } from './chapters/ax-2';
import { st2 } from './chapters/st-2';
import { st3 } from './chapters/st-3';
import { fd1_1 } from './episodes/fd-1-1';
import { fd1_2 } from './episodes/fd-1-2';
import { fd1_3 } from './episodes/fd-1-3';
import { fd1_4 } from './episodes/fd-1-4';
import { fd2_1, fd2_2, fd2_3, fd2_4 } from './episodes/fd-2';
import { rs1_1, rs1_2, rs1_3, rs1_4 } from './episodes/rs-1';
import { ia1_1, ia1_2, ia1_3, ia1_4 } from './episodes/ia-1';
import { ui1_1, ui1_2, ui1_3, ui1_4 } from './episodes/ui-1';
import { cw1_1, cw1_2, cw1_3, cw1_4 } from './episodes/cw-1';
import { st1_1, st1_2, st1_3 } from './episodes/st-1';
import { rs2_1, rs2_2, rs2_3, rs2_4 } from './episodes/rs-2';
import { ui2_1, ui2_2, ui2_3, ui2_4 } from './episodes/ui-2';
import { ui3_1, ui3_2, ui3_3, ui3_4 } from './episodes/ui-3';
import { ds1_1, ds1_2, ds1_3 } from './episodes/ds-1';
import { pr1_1, pr1_2, pr1_3 } from './episodes/pr-1';
import { ax1_1, ax1_2, ax1_3, ax1_4 } from './episodes/ax-1';
import { gr1_1, gr1_2, gr1_3, gr1_4 } from './episodes/gr-1';
import { br1_1, br1_2, br1_3 } from './episodes/br-1';
import { bz1_1, bz1_2, bz1_3 } from './episodes/bz-1';
import { dc1_1, dc1_2, dc1_3 } from './episodes/dc-1';
import { ld2_1, ld2_2, ld2_3 } from './episodes/ld-2';
import { ia2_1, ia2_2, ia2_3 } from './episodes/ia-2';
import { fd3_1, fd3_2, fd3_3 } from './episodes/fd-3';
import { rs3_1, rs3_2, rs3_3, rs3_4 } from './episodes/rs-3';
import { rs4_1, rs4_2, rs4_3, rs4_4 } from './episodes/rs-4';
import { ia3_1, ia3_2, ia3_3 } from './episodes/ia-3';
import { ia4_1, ia4_2, ia4_3, ia4_4 } from './episodes/ia-4';
import { ui4_1, ui4_2, ui4_3, ui4_4 } from './episodes/ui-4';
import { ds2_1, ds2_2, ds2_3 } from './episodes/ds-2';
import { ds3_1, ds3_2, ds3_3 } from './episodes/ds-3';
import { pr2_1, pr2_2, pr2_3, pr2_4 } from './episodes/pr-2';
import { pr3_1, pr3_2 } from './episodes/pr-3';
import { cw2_1, cw2_2, cw2_3 } from './episodes/cw-2';
import { ax2_1, ax2_2, ax2_3, ax2_4 } from './episodes/ax-2';
import { st2_1, st2_2, st2_3 } from './episodes/st-2';
import { st3_1, st3_2, st3_3, st3_4 } from './episodes/st-3';
import type { Exercise, LessonContent } from './schema';
import type { Episode } from './episode';

export * from './schema';
export * from './episode';

/** Lessons that have the rich episode format, keyed by lesson id. The rest play as classic lessons. */
export const EPISODES: Record<string, Episode> = { 'fd.1-1': fd1_1, 'fd.1-2': fd1_2, 'fd.1-3': fd1_3, 'fd.1-4': fd1_4,
  'fd.2-1': fd2_1, 'fd.2-2': fd2_2, 'fd.2-3': fd2_3, 'fd.2-4': fd2_4,
  'rs.1-1': rs1_1, 'rs.1-2': rs1_2, 'rs.1-3': rs1_3, 'rs.1-4': rs1_4,
  'ia.1-1': ia1_1, 'ia.1-2': ia1_2, 'ia.1-3': ia1_3, 'ia.1-4': ia1_4,
  'ui.1-1': ui1_1, 'ui.1-2': ui1_2, 'ui.1-3': ui1_3, 'ui.1-4': ui1_4,
  'cw.1-1': cw1_1, 'cw.1-2': cw1_2, 'cw.1-3': cw1_3, 'cw.1-4': cw1_4,
  'st.1-1': st1_1, 'st.1-2': st1_2, 'st.1-3': st1_3,
  'rs.2-1': rs2_1, 'rs.2-2': rs2_2, 'rs.2-3': rs2_3, 'rs.2-4': rs2_4,
  'ui.2-1': ui2_1, 'ui.2-2': ui2_2, 'ui.2-3': ui2_3, 'ui.2-4': ui2_4,
  'ui.3-1': ui3_1, 'ui.3-2': ui3_2, 'ui.3-3': ui3_3, 'ui.3-4': ui3_4,
  'ds.1-1': ds1_1, 'ds.1-2': ds1_2, 'ds.1-3': ds1_3,
  'pr.1-1': pr1_1, 'pr.1-2': pr1_2, 'pr.1-3': pr1_3,
  'ax.1-1': ax1_1, 'ax.1-2': ax1_2, 'ax.1-3': ax1_3, 'ax.1-4': ax1_4,
  'gr.1-1': gr1_1, 'gr.1-2': gr1_2, 'gr.1-3': gr1_3, 'gr.1-4': gr1_4,
  'br.1-1': br1_1, 'br.1-2': br1_2, 'br.1-3': br1_3,
  'bz.1-1': bz1_1, 'bz.1-2': bz1_2, 'bz.1-3': bz1_3,
  'dc.1-1': dc1_1, 'dc.1-2': dc1_2, 'dc.1-3': dc1_3,
  'ld.2-1': ld2_1, 'ld.2-2': ld2_2, 'ld.2-3': ld2_3,
  'ia.2-1': ia2_1, 'ia.2-2': ia2_2, 'ia.2-3': ia2_3,
  'fd.3-1': fd3_1, 'fd.3-2': fd3_2, 'fd.3-3': fd3_3,
  'rs.3-1': rs3_1, 'rs.3-2': rs3_2, 'rs.3-3': rs3_3, 'rs.3-4': rs3_4,
  'rs.4-1': rs4_1, 'rs.4-2': rs4_2, 'rs.4-3': rs4_3, 'rs.4-4': rs4_4,
  'ia.3-1': ia3_1, 'ia.3-2': ia3_2, 'ia.3-3': ia3_3,
  'ia.4-1': ia4_1, 'ia.4-2': ia4_2, 'ia.4-3': ia4_3, 'ia.4-4': ia4_4,
  'ui.4-1': ui4_1, 'ui.4-2': ui4_2, 'ui.4-3': ui4_3, 'ui.4-4': ui4_4,
  'ds.2-1': ds2_1, 'ds.2-2': ds2_2, 'ds.2-3': ds2_3,
  'ds.3-1': ds3_1, 'ds.3-2': ds3_2, 'ds.3-3': ds3_3,
  'pr.2-1': pr2_1, 'pr.2-2': pr2_2, 'pr.2-3': pr2_3, 'pr.2-4': pr2_4,
  'pr.3-1': pr3_1, 'pr.3-2': pr3_2,
  'cw.2-1': cw2_1, 'cw.2-2': cw2_2, 'cw.2-3': cw2_3,
  'ax.2-1': ax2_1, 'ax.2-2': ax2_2, 'ax.2-3': ax2_3, 'ax.2-4': ax2_4,
  'st.2-1': st2_1, 'st.2-2': st2_2, 'st.2-3': st2_3,
  'st.3-1': st3_1, 'st.3-2': st3_2, 'st.3-3': st3_3, 'st.3-4': st3_4 };
export * from './grade';
export * from './boss';
export * from './boss-grade';
export * from './bosses';

/** Chapters with playable content, keyed by curriculum chapter id. Lessons are in curriculum order. */
export const CONTENT: Record<string, LessonContent[]> = { 'fd.1': fd1, 'fd.2': fd2, 'rs.1': rs1, 'ia.1': ia1, 'ui.1': ui1, 'cw.1': cw1, 'st.1': st1, 'rs.2': rs2, 'ui.2': ui2, 'ui.3': ui3, 'ds.1': ds1, 'pr.1': pr1, 'ax.1': ax1, 'gr.1': gr1, 'br.1': br1, 'bz.1': bz1, 'dc.1': dc1, 'ld.2': ld2, 'ia.2': ia2, 'fd.3': fd3, 'rs.3': rs3, 'rs.4': rs4, 'ia.3': ia3, 'ia.4': ia4, 'ui.4': ui4, 'ds.2': ds2, 'ds.3': ds3, 'pr.2': pr2, 'pr.3': pr3, 'cw.2': cw2, 'ax.2': ax2, 'st.2': st2, 'st.3': st3 };

export const hasContent = (chapterId: string) => !!CONTENT[chapterId]?.length;

/** `n` is 1-based. */
export const getLesson = (chapterId: string, n: number): LessonContent | undefined => CONTENT[chapterId]?.[n - 1];

export const allLessonIds = () => Object.values(CONTENT).flat().map(l => l.id);

/** "fd.1-3" → { chapterId: "fd.1", n: 3 } */
export const parseLessonId = (id: string) => { const i = id.lastIndexOf('-'); return { chapterId: id.slice(0, i), n: Number(id.slice(i + 1)) }; };

export const lessonById = (id: string) => { const { chapterId, n } = parseLessonId(id); return getLesson(chapterId, n); };

/** How each tile-building game words a round when it comes back in the review deck. */
const ROUND_REVIEW: Record<string, { prompt: (p: string) => string; why: (strong: string) => string }> = {
  'question-forge': { prompt: p => p.replace(/^Turn (.+) into a research question\.$/, 'Which is the strongest research question to replace $1?'), why: s => `“${s}” is open and about real behaviour.` },
  'button-forge': { prompt: p => `${p}: which label is best?`, why: s => `“${s}” names the action, so it makes sense without rereading the question.` },
  'voice-fit': { prompt: () => 'Which positioning statement is strongest?', why: s => `“${s}” names the audience, the need, the benefit and the alternative it beats.` },
  'proto-scope': { prompt: () => 'Which question can a prototype answer best?', why: s => `“${s}” names who, the task and how you’d know it worked.` },
  'job-forge': { prompt: p => `${p}: which job story is strongest?`, why: s => `“${s}” names the situation and the progress wanted, not a feature.` },
};

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
    // A tile-building round comes back as "pick the strongest version" (a research question, or a button label).
    const round = ep.game.rounds?.find(r => r.id === id);
    if (round) {
      const strong = round.answer.join(' ');
      const opts = [strong, ...round.weak].map((label, i) => ({ id: `o${i}`, label }));
      const order = [1, 0, 2, 3].filter(i => i < opts.length).map(i => opts[i]);   // the right answer isn't always first
      const words = ROUND_REVIEW[ep.game.id] ?? ROUND_REVIEW['question-forge'];
      return { type: 'pick', id: exerciseId, prompt: words.prompt(round.prompt), options: order, correct: 'o0', explanation: words.why(strong) };
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
