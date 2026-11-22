// Validates the curriculum graph and renders docs/02-syllabus.md.
// Usage: node scripts/build-syllabus.mjs
import { writeFileSync } from 'node:fs';
import { domains, chapters, chapterById } from '../curriculum/curriculum.mjs';

// ---- validation -----------------------------------------------------------
const errors = [];
for (const c of chapters) {
  for (const p of c.prereqs) if (!chapterById[p]) errors.push(`${c.id}: unknown prereq ${p}`);
}
for (const d of domains) {
  for (const a of d.adjacent) if (!domains.some(x => x.id === a)) errors.push(`${d.id}: unknown adjacent ${a}`);
}
// cycle detection (DFS)
const state = {};
const visit = (id, stack) => {
  if (state[id] === 'done') return;
  if (state[id] === 'open') { errors.push(`cycle: ${[...stack, id].join(' → ')}`); return; }
  state[id] = 'open';
  for (const p of chapterById[id]?.prereqs ?? []) visit(p, [...stack, id]);
  state[id] = 'done';
};
chapters.forEach(c => visit(c.id, []));
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }

// ---- render ---------------------------------------------------------------
const tierName = { bar: 'Literacy', stem: 'Practitioner', deep: 'Expert' };
const lessons = chapters.reduce((n, c) => n + c.lessons.length, 0);
const studio = chapters.filter(c => c.studio);

let md = `# Master Syllabus\n\n> Generated from \`curriculum/curriculum.mjs\`. Do not edit by hand; run \`node scripts/build-syllabus.mjs\`.\n\n`;
md += `**${domains.length} domains · ${chapters.length} chapters · ${lessons} lessons · ${chapters.length} boss assignments · ${studio.length} Studio layers**\n\n`;
md += `Tiers: **Literacy** (bar, level 2) → **Practitioner** (stem, level 3) → **Expert** (deep, level 4–5).\n`;
md += `Nobody takes everything in order. The personalization engine picks a path through this graph from each learner's T-shape.\n\n`;

md += `## Domain overview\n\n| Domain | Tagline | Literacy | Practitioner | Expert | Neighbours |\n|---|---|---|---|---|---|\n`;
for (const d of domains) {
  const n = t => d.chapters.filter(c => c.tier === t).length;
  md += `| **${d.name}** \`${d.id}\` | ${d.tagline} | ${n('bar')} | ${n('stem')} | ${n('deep')} | ${d.adjacent.join(', ')} |\n`;
}

for (const d of domains) {
  md += `\n---\n\n## ${d.name} — _${d.tagline}_\n`;
  for (const c of d.chapters) {
    md += `\n### \`${c.id}\` ${c.title}  ·  ${tierName[c.tier]}\n`;
    if (c.prereqs.length) md += `_Requires:_ ${c.prereqs.map(p => `\`${p}\` ${chapterById[p].title}`).join(', ')}\n\n`;
    md += c.lessons.map((l, i) => `${i + 1}. ${l.title} — *${l.mechanic}*`).join('\n') + '\n';
    md += `\n**Boss:** ${c.boss}\n`;
    if (c.studio) md += `\n**Studio layer:** ${c.studio}\n`;
  }
}

md += `\n---\n\n## Studio: the product you build across the curriculum\n\nEach Studio layer adds to the same real product and ends as a portfolio case study.\n\n`;
md += studio.map((c, i) => `${i + 1}. **${c.studio}** (\`${c.id}\`)`).join('\n') + '\n';

writeFileSync(new URL('../docs/02-syllabus.md', import.meta.url), md);
console.log(`OK: ${domains.length} domains, ${chapters.length} chapters, ${lessons} lessons, ${studio.length} studio layers`);
