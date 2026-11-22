'use client';
import { motion } from 'motion/react';
import type { DomainId, PathResult } from '@shape/engine';
import { domainById } from '@shape/engine';
import { Tooltip, TooltipTrigger } from '@/components/base/tooltip/tooltip';
import { FAMILIES, FAMILY_ORDER, LEVEL_NAMES, SKILL_META, skillsInFamily } from '@/lib/skills';

const pct = (level: number) => `${(level / 5) * 100}%`;
const GRID = 'grid grid-cols-[minmax(0,10rem)_1fr_2.5rem] gap-3 @2xl:grid-cols-[13rem_1fr_3rem]';

/**
 * Today → goal for every skill (dumbbell chart).
 * Colour does one job: midnight = where you are today, mint = where your path takes you.
 * Families are labelled row groups, so identity never relies on colour alone.
 */
export function SkillOutcome({ result }: { result: PathResult }) {
  const cols = Object.fromEntries(result.tshape.columns.map(c => [c.domain, c]));
  const chapters = result.path.reduce<Record<string, number>>((m, p) => ({ ...m, [p.domain]: (m[p.domain] ?? 0) + 1 }), {});
  let row = 0;

  return (
    <figure className="@container w-full">
      <figcaption className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-tertiary">
        <span>Levels 0–5 per skill</span>
        <span className="flex items-center gap-4" aria-hidden>
          <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-brand-solid" />Today</span>
          <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-full border-2 border-mint-600 bg-primary" />Goal</span>
        </span>
      </figcaption>

      <div className={`${GRID} pb-2 text-xs text-quaternary`} aria-hidden>
        <span />
        <div className="relative h-4">
          {LEVEL_NAMES.map((n, i) => (
            <span key={n} className="absolute -translate-x-1/2 whitespace-nowrap first:translate-x-0 last:-translate-x-full" style={{ left: pct(i) }}>
              <span className="hidden @3xl:inline">{n}</span><span className="@3xl:hidden">{i}</span>
            </span>
          ))}
        </div>
        <span />
      </div>

      <div className="flex flex-col gap-5" aria-hidden>
        {FAMILY_ORDER.map(f => (
          <div key={f}>
            <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold tracking-wide text-tertiary uppercase">
              <i className="size-2 rounded-full" style={{ background: FAMILIES[f].color }} />{FAMILIES[f].label}
            </div>
            {skillsInFamily(f).map(id => {
              const c = cols[id], { icon: Icon, short } = SKILL_META[id as DomainId];
              const gain = c.target - c.current, i = row++;
              const spring = { type: 'spring' as const, stiffness: 120, damping: 20, delay: 0.1 + i * 0.03 };
              return (
                <Tooltip key={id} placement="top" title={domainById[id as DomainId].name}
                  description={`Today: ${LEVEL_NAMES[c.current]} · Goal: ${LEVEL_NAMES[c.target]} · ${chapters[id] ? `${chapters[id]} chapters on your path` : gain > 0 ? 'Covered by other chapters' : 'Already at your goal'}`}>
                  <TooltipTrigger className={`${GRID} w-full cursor-default items-center rounded-md px-1 py-1.5 text-left hover:bg-primary_hover`}>
                    <span className="flex min-w-0 items-center gap-2 text-sm text-secondary">
                      <Icon className="size-4 shrink-0" style={{ color: FAMILIES[f].color }} weight="duotone" />
                      <span className="truncate">{short}</span>
                    </span>
                    <span className="relative block h-3">
                      {[0, 1, 2, 3, 4, 5].map(t => <i key={t} className="absolute top-0 h-3 w-px bg-border-secondary" style={{ left: pct(t) }} />)}
                      <motion.i className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-mint-100"
                        style={{ left: pct(c.current) }} initial={{ width: 0 }} animate={{ width: pct(gain) }} transition={spring} />
                      <motion.i className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-mint-600 bg-primary"
                        initial={{ left: pct(c.current), opacity: 0 }} animate={{ left: pct(c.target), opacity: 1 }} transition={spring} />
                      <i className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-solid ring-2 ring-bg-primary" style={{ left: pct(c.current) }} />
                    </span>
                    <span className="text-right text-sm text-tertiary tabular-nums">{gain > 0 ? `+${gain}` : '–'}</span>
                  </TooltipTrigger>
                </Tooltip>
              );
            })}
          </div>
        ))}
      </div>

      <table className="sr-only">
        <caption>Skill levels today and at goal</caption>
        <thead><tr><th>Skill</th><th>Today</th><th>Goal</th><th>Chapters on path</th></tr></thead>
        <tbody>{result.tshape.columns.map(c => (
          <tr key={c.domain}><td>{domainById[c.domain].name}</td><td>{c.current}</td><td>{c.target}</td><td>{chapters[c.domain] ?? 0}</td></tr>
        ))}</tbody>
      </table>
    </figure>
  );
}
