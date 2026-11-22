import { domains, chapters, chapterById } from './curriculum';

/** Returns a list of problems in the curriculum graph (unknown ids, cycles). Empty = valid. */
export function validateCurriculum(): string[] {
  const errors: string[] = [];
  for (const c of chapters) for (const p of c.prereqs) if (!chapterById[p]) errors.push(`${c.id}: unknown prereq ${p}`);
  for (const d of domains) for (const a of d.adjacent) if (!domains.some(x => x.id === a)) errors.push(`${d.id}: unknown adjacent ${a}`);

  const state: Record<string, 'open' | 'done'> = {};
  const visit = (id: string, stack: string[]) => {
    if (state[id] === 'done') return;
    if (state[id] === 'open') { errors.push(`cycle: ${[...stack, id].join(' → ')}`); return; }
    state[id] = 'open';
    for (const p of chapterById[id]?.prereqs ?? []) visit(p, [...stack, id]);
    state[id] = 'done';
  };
  chapters.forEach(c => visit(c.id, []));
  return errors;
}
