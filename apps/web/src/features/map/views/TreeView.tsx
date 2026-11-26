'use client';
// Tree: one skill at a time, as an unlock tree. Finish a chapter and the ones below it light up.
// Prerequisites from other skills show as small "needs" chips you can jump to.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, LockSimpleIcon, StarIcon } from '@phosphor-icons/react/ssr';
import { chapterById, type DomainId, type Tier } from '@shape/engine';
import { FAMILIES, LEVEL_NAMES, SKILL_META } from '@/lib/skills';
import { cx } from '@/utils/cx';
import { TIER_NAME } from '../model';
import { chaptersOf, isUnlocked, SKILL_ORDER, skillColor, type ViewProps } from './shared';

const TIERS: Tier[] = ['bar', 'stem', 'deep'];
const ROW = 190, TOP = 70;

export function TreeView({ info, cols, selectedId, nextId, guided, onSelect }: ViewProps) {
  const first = (selectedId && chapterById[selectedId]?.domain) || (nextId && chapterById[nextId]?.domain) || SKILL_ORDER[0];
  const [skill, setSkill] = useState<DomainId>(first as DomainId);
  const color = skillColor(skill);
  const list = chaptersOf(skill);

  // Positions: one row per tier, nodes spread evenly across the row (x in %, y in px).
  const pos: Record<string, { x: number; y: number }> = {};
  TIERS.forEach((t, r) => {
    const row = list.filter(c => c.tier === t);
    row.forEach((c, k) => { pos[c.id] = { x: ((k + 1) / (row.length + 1)) * 100, y: TOP + r * ROW }; });
  });
  const height = TOP + ROW * 2 + 120;
  const edges = list.flatMap(c => c.prereqs.filter(p => pos[p]).map(p => ({ from: p, to: c.id })));

  return (
    <div className={cx('grid h-full grid-cols-[16rem_1fr] overflow-hidden', selectedId && 'md:pr-[26rem]')}>
      <nav aria-label="Skills" className="overflow-y-auto border-r border-secondary bg-primary p-2">
        {SKILL_ORDER.map(d => {
          const meta = SKILL_META[d], c = skillColor(d), col = cols[d];
          const ds = chaptersOf(d), done = ds.filter(x => info[x.id].status === 'done').length;
          return (
            <button key={d} type="button" onClick={() => setSkill(d)} aria-current={skill === d}
              className={cx('flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition', skill === d ? 'bg-secondary' : 'hover:bg-primary_hover')}>
              <meta.icon className="size-5 shrink-0" style={{ color: c }} weight={skill === d ? 'fill' : 'duotone'} />
              <span className="min-w-0 flex-1">
                <span className={cx('block truncate text-sm font-semibold', skill === d ? 'text-primary' : 'text-secondary')}>{meta.short}</span>
                <span className="mt-1 flex gap-0.5">
                  {ds.map(x => <span key={x.id} className="h-1 flex-1 rounded-full" style={{ background: info[x.id].status === 'done' ? 'var(--color-mint-500)' : info[x.id].pathIndex != null ? c : 'var(--color-bg-tertiary)', opacity: info[x.id].status === 'done' || info[x.id].pathIndex != null ? 1 : 0.6 }} />)}
                </span>
              </span>
              {col && <span className="text-[11px] text-quaternary tabular-nums">{done}/{ds.length}</span>}
            </button>
          );
        })}
      </nav>

      <div className="overflow-auto">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <header className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl" style={{ background: `color-mix(in oklab, ${color} 16%, transparent)` }}>
              {(() => { const I = SKILL_META[skill].icon; return <I className="size-6" style={{ color }} weight="duotone" />; })()}
            </span>
            <div>
              <h2 className="text-lg font-semibold text-primary">{SKILL_META[skill].short}</h2>
              <p className="text-sm text-tertiary">{FAMILIES[SKILL_META[skill].family].label}{cols[skill] ? ` · ${LEVEL_NAMES[cols[skill]!.current]} today → ${LEVEL_NAMES[cols[skill]!.target]} at your goal` : ''}</p>
            </div>
          </header>

          <motion.div key={skill} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="relative mt-4" style={{ height }}>
            {TIERS.map((t, r) => (
              <p key={t} className="absolute left-0 text-xs font-semibold tracking-wide text-quaternary uppercase" style={{ top: TOP + r * ROW - 58 }}>{TIER_NAME[t]}</p>
            ))}
            <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-hidden>
              {edges.map(e => {
                const a = pos[e.from], b = pos[e.to], lit = info[e.from].status === 'done';
                const d = a.y === b.y ? `M${a.x},${a.y} L${b.x},${b.y}`  // same row: straight, hidden under the nodes at both ends
                  : `M${a.x},${a.y + 34} C${a.x},${(a.y + b.y) / 2} ${b.x},${(a.y + b.y) / 2} ${b.x},${b.y - 34}`;
                return <motion.path key={`${e.from}-${e.to}`} d={d}
                  fill="none" stroke={lit ? 'var(--color-mint-500)' : color} strokeOpacity={lit ? 1 : 0.35} strokeWidth={lit ? 3 : 2} vectorEffect="non-scaling-stroke"
                  strokeDasharray={lit ? undefined : '6 6'} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />;
              })}
            </svg>
            {list.map((c, k) => {
              const i = info[c.id], p = pos[c.id], open = isUnlocked(c.id, info, guided), picked = c.id === selectedId;
              const outside = c.prereqs.filter(x => !pos[x]);
              const state = i.status === 'done' ? 'done' : !open ? 'locked' : 'open';
              return (
                <div key={c.id} className="absolute flex w-44 -translate-x-1/2 -translate-y-[34px] flex-col items-center gap-2 text-center" style={{ left: `${p.x}%`, top: p.y }}>
                  <motion.button type="button" onClick={() => onSelect(c.id)} aria-label={c.title}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18, delay: k * 0.05 }}
                    whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                    className={cx('relative grid size-[68px] place-items-center rounded-[22px] ring-inset transition-shadow', picked ? 'ring-4 ring-white' : 'ring-2')}
                    style={state === 'done' ? { background: 'var(--color-mint-600)', boxShadow: '0 0 28px color-mix(in oklab, var(--color-mint-500) 55%, transparent)' }
                      : state === 'open' ? { background: `color-mix(in oklab, ${color} 22%, var(--color-bg-primary))`, ['--tw-ring-color' as string]: color }
                      : { background: 'var(--color-bg-secondary)', ['--tw-ring-color' as string]: 'var(--color-border-secondary)' }}>
                    {state === 'done' ? <CheckIcon className="size-7 text-white" weight="bold" />
                      : state === 'locked' ? <LockSimpleIcon className="size-6 text-fg-quaternary" />
                      : c.tier === 'deep' ? <StarIcon className="size-7" style={{ color }} weight="fill" />
                      : (() => { const I = SKILL_META[skill].icon; return <I className="size-7" style={{ color }} weight="duotone" />; })()}
                    {i.pathIndex != null && state !== 'done' && (
                      <span className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-brand-solid text-[10px] font-bold text-white ring-2 ring-[var(--color-bg-secondary)]">{i.pathIndex + 1}</span>
                    )}
                    {c.id === nextId && <span className="absolute -bottom-2 rounded-full bg-mint-500 px-1.5 text-[10px] font-bold text-brand-950">Next</span>}
                  </motion.button>
                  <span className={cx('text-sm leading-tight font-semibold', state === 'locked' ? 'text-tertiary' : 'text-primary')}>{c.title}</span>
                  {outside.length > 0 && (
                    <span className="flex flex-wrap justify-center gap-1">
                      {outside.map(x => (
                        <button key={x} type="button" onClick={() => { setSkill(chapterById[x].domain); onSelect(x); }}
                          className={cx('rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset', info[x].status === 'done' ? 'text-mint-600 ring-mint-600/40' : 'text-warning-600 ring-warning-500/40')}>
                          needs {chapterById[x].title}
                        </button>
                      ))}
                    </span>
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
