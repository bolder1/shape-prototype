// The Daily Brief (docs/08-engagement-plan.md §1): five questions a day, the same for everyone, drawn from the
// episodes' quizzes and prize ladders. Five different skill families, getting harder: three quick ones, two tough.
// Deterministic from the date, so every device and every learner gets the same brief without a server.
import { EPISODES } from './index';

/** Day 1 of the Daily Brief. Brief #n is this date plus n − 1 days. */
export const DAILY_EPOCH = '2026-11-25';
export const DAILY_SIZE = 5;

export interface DailyQuestion {
  lessonId: string;
  domain: string;
  level: 'quick' | 'tough';
  id: string;
  prompt: string;
  options: { id: string; label: string }[];
  correct: string;
  explanation: string;
}
export interface DailyBrief { number: number; day: string; questions: DailyQuestion[] }

const toTime = (day: string) => Date.parse(`${day}T00:00:00Z`);
/** Brief number for a local `YYYY-MM-DD` day (1 on launch day). */
export const dailyNumber = (day: string) => Math.round((toTime(day) - toTime(DAILY_EPOCH)) / 86_400_000) + 1;

/** Small deterministic PRNG (mulberry32), seeded per day. */
function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Pooled = Omit<DailyQuestion, 'level'>;
let pools: { quick: Map<string, Pooled[]>; tough: Map<string, Pooled[]> } | null = null;

/** Every quiz question (quick) and ladder question (tough), grouped by skill family. Built once. */
function buildPools() {
  if (pools) return pools;
  const quick = new Map<string, Pooled[]>(), tough = new Map<string, Pooled[]>();
  const add = (m: Map<string, Pooled[]>, q: Pooled) => { if (!m.has(q.domain)) m.set(q.domain, []); m.get(q.domain)!.push(q); };
  for (const [lessonId, ep] of Object.entries(EPISODES).sort(([a], [b]) => a.localeCompare(b))) {
    const domain = lessonId.split('.')[0];
    for (const q of ep.quiz.questions) add(quick, { lessonId, domain, id: `${lessonId}:quiz.${q.id}`, prompt: q.prompt, options: q.options, correct: q.correct, explanation: q.explanation });
    for (const q of ep.ladder) add(tough, { lessonId, domain, id: `${lessonId}:ladder.${q.id}`, prompt: q.prompt, options: q.options, correct: q.correct, explanation: q.explanation });
  }
  return (pools = { quick, tough });
}

/** The brief for a day: five families, three quick questions then two tough ones, options shuffled. */
export function dailyBrief(day: string): DailyBrief {
  const number = dailyNumber(day);
  const rand = rng(number * 7919 + 17);
  const { quick, tough } = buildPools();
  const families = [...quick.keys()].filter(d => tough.has(d)).sort();
  for (let i = families.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [families[i], families[j]] = [families[j], families[i]]; }
  const questions = families.slice(0, DAILY_SIZE).map((domain, i): DailyQuestion => {
    const level = i < 3 ? 'quick' : 'tough';
    const pool = (level === 'quick' ? quick : tough).get(domain)!;
    const q = pool[Math.floor(rand() * pool.length)];
    const options = [...q.options];
    for (let k = options.length - 1; k > 0; k--) { const j = Math.floor(rand() * (k + 1)); [options[k], options[j]] = [options[j], options[k]]; }
    return { ...q, level, options };
  });
  return { number, day, questions };
}

/** "0:38", "1:05". */
export const dailyTime = (ms: number) => { const s = Math.round(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };

/**
 * The spoiler-free share text: right and wrong as squares, no questions or answers, so posting it gives nothing away.
 * Tough questions answered right show as a star square, so a perfect day looks different from a lucky one.
 */
export function dailyShareText(brief: DailyBrief, right: boolean[], ms: number, url: string) {
  const squares = right.map((r, i) => (r ? (brief.questions[i]?.level === 'tough' ? '🟪' : '🟩') : '⬜')).join('');
  return `Shape Daily #${brief.number} · ${right.filter(Boolean).length}/${brief.questions.length} · ${dailyTime(ms)}\n${squares}\n${url}`;
}
