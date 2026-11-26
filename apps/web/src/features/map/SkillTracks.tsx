'use client';
// The skill map as a readable grid: one row per skill, one column per depth (Literacy → Practitioner → Expert).
// No pan or zoom, no web of lines: dependencies appear only for the chapter you select.
import { useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, LockSimpleIcon } from '@phosphor-icons/react/ssr';
import { chapters, chapterById, unlocks, type DomainId, type TColumn, type Tier } from '@shape/engine';
import { FAMILIES, FAMILY_ORDER, LEVEL_NAMES, SKILL_META, skillsInFamily } from '@/lib/skills';
import { cx } from '@/utils/cx';
import { TIER_NAME, type ChapterInfo } from './model';

const TIERS: Tier[] = ['bar', 'stem', 'deep'];
const TIER_HINT: Record<Tier, string> = { bar: 'Know the basics', stem: 'Do it in real work', deep: 'Lead and teach it' };
const ROLE_LABEL = { spine: 'Deep skill', adjacent: 'Supporting', bar: 'Broad base' } as const;

export function SkillTracks({ info, cols, selectedId, focusPath, nextId, onSelect }: {
  info: Record<string, ChapterInfo>; cols: Partial<Record<DomainId, TColumn>>; selectedId: string | null;
  focusPath: boolean; nextId: string | null; onSelect: (id: string) => void;
}) {
  const sel = selectedId ? chapterById[selectedId] : null;
  const needs = new Set(sel?.prereqs ?? []);
  const opens = new Set(selectedId ? unlocks[selectedId] : []);

  // Chips in the side panel can select a chapter off screen: bring it into view.
  useEffect(() => {
    if (selectedId) document.getElementById(`ch-${selectedId}`)?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }, [selectedId]);

  return (
    <div className={cx('h-full overflow-auto transition-[padding]', selectedId && 'md:pr-[26rem]')}>
      <div className="mx-auto min-w-[56rem] max-w-7xl px-4 pb-16 md:px-6">
        {/* Column headers */}
        <div className="sticky top-0 z-[5] grid grid-cols-[15rem_repeat(3,minmax(0,1fr))] gap-3 bg-secondary/95 pt-5 pb-3 backdrop-blur">
          <p className="self-end px-1 text-xs font-semibold tracking-wide text-quaternary uppercase">Skill · today → goal</p>
          {TIERS.map((t, n) => (
            <div key={t} className="flex items-center gap-2 px-1">
              <span className="grid size-6 place-items-center rounded-full bg-primary text-xs font-semibold text-secondary ring-1 ring-secondary ring-inset">{n + 1}</span>
              <span>
                <span className="block text-sm font-semibold text-primary">{TIER_NAME[t]}</span>
                <span className="block text-xs text-tertiary">{TIER_HINT[t]}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          {FAMILY_ORDER.map(f => (
            <section key={f} aria-labelledby={`fam-${f}`} className="overflow-hidden rounded-2xl bg-primary shadow-xs ring-1 ring-secondary ring-inset">
              <h2 id={`fam-${f}`} className="flex items-center gap-2 border-b border-secondary px-4 py-2.5 text-sm font-semibold text-primary">
                <span className="size-2.5 rounded-full" style={{ background: FAMILIES[f].color }} />{FAMILIES[f].label}
                <span className="font-normal text-tertiary">{FAMILIES[f].blurb}</span>
              </h2>
              <div className="divide-y divide-secondary">
                {skillsInFamily(f).map(d => (
                  <div key={d} className="grid grid-cols-[15rem_repeat(3,minmax(0,1fr))] gap-3 px-4 py-3">
                    <SkillHeader d={d} col={cols[d]} />
                    {TIERS.map(t => (
                      <div key={t} className="flex flex-col gap-2 border-l border-dashed border-secondary pl-3">
                        {chapters.filter(c => c.domain === d && c.tier === t).map(c => (
                          <ChapterCard key={c.id} id={c.id} i={info[c.id]} onSelect={onSelect} next={c.id === nextId}
                            selected={c.id === selectedId} relation={needs.has(c.id) ? 'needs' : opens.has(c.id) ? 'opens' : null}
                            dim={sel ? c.id !== selectedId && !needs.has(c.id) && !opens.has(c.id) : focusPath && info[c.id].pathIndex == null && info[c.id].status !== 'done'} />
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Skill name plus a five-step level bar: filled = where you are, outlined = where your goal takes you. */
function SkillHeader({ d, col }: { d: DomainId; col?: TColumn }) {
  const meta = SKILL_META[d], color = FAMILIES[meta.family].color;
  const current = col?.current ?? 0, target = col?.target ?? 0;
  return (
    <div className="flex flex-col justify-center gap-2 pr-2">
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg" style={{ background: `color-mix(in oklab, ${color} 14%, transparent)` }}>
          <meta.icon className="size-[18px]" style={{ color }} weight="duotone" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-primary">{meta.short}</span>
          {col && <span className="block text-xs text-tertiary">{ROLE_LABEL[col.role]}</span>}
        </span>
      </div>
      {col && (
        <div title={`${LEVEL_NAMES[current]} today, ${LEVEL_NAMES[target]} at your goal`}>
          <div className="flex gap-1" aria-hidden>
            {[1, 2, 3, 4, 5].map(n => (
              <span key={n} className="h-1.5 flex-1 rounded-full"
                style={n <= current ? { background: color } : n <= target ? { boxShadow: `inset 0 0 0 1.5px ${color}`, opacity: 0.8 } : { background: 'var(--color-bg-tertiary)' }} />
            ))}
          </div>
          <p className="mt-1 text-[11px] text-quaternary">{LEVEL_NAMES[current]}{target > current ? ` → ${LEVEL_NAMES[target]}` : ''}</p>
        </div>
      )}
    </div>
  );
}

function ChapterCard({ id, i, selected, relation, dim, next, onSelect }: {
  id: string; i: ChapterInfo; selected: boolean; relation: 'needs' | 'opens' | null; dim: boolean; next: boolean; onSelect: (id: string) => void;
}) {
  const ch = chapterById[id];
  const onPath = i.pathIndex != null;
  const pct = i.contentLessons ? (i.doneLessons / i.contentLessons) * 100 : 0;
  return (
    <motion.button id={`ch-${id}`} type="button" layout="position" onClick={() => onSelect(id)} aria-pressed={selected}
      animate={{ opacity: dim ? 0.35 : 1 }} transition={{ duration: 0.15 }}
      className={cx('group relative flex w-full items-start gap-2.5 rounded-xl p-2.5 text-left ring-1 transition-shadow ring-inset outline-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
        selected ? 'bg-brand-primary ring-2 ring-brand-solid'
          : relation === 'needs' ? 'bg-primary ring-2 ring-warning-500'
          : relation === 'opens' ? 'bg-primary ring-2 ring-mint-600'
          : onPath ? 'bg-primary ring-primary hover:shadow-md' : 'bg-secondary ring-transparent hover:ring-secondary')}>
      <span className={cx('mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-bold tabular-nums',
        i.status === 'done' ? 'bg-mint-600 text-white' : i.locked.length ? 'bg-tertiary text-quaternary' : onPath ? 'bg-brand-solid text-white' : 'text-quaternary ring-1 ring-secondary ring-inset')}>
        {i.status === 'done' ? <CheckIcon className="size-3.5" weight="bold" /> : i.locked.length ? <LockSimpleIcon className="size-3" /> : onPath ? i.pathIndex! + 1 : i.contentLessons ? '' : <LockSimpleIcon className="size-3" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className={cx('block text-sm leading-5 font-semibold', onPath || i.status === 'done' ? 'text-primary' : 'text-tertiary')}>{ch.title}</span>
        <span className="mt-0.5 block text-xs text-quaternary">
          {relation === 'needs' ? 'Needed first' : relation === 'opens' ? 'Unlocks next' : i.locked.length ? `Locked · finish ${chapterById[i.locked[0]].title}${i.locked.length > 1 ? ` +${i.locked.length - 1}` : ''}` : i.contentLessons ? `${ch.lessons.length} lessons` : 'Coming soon'}
          {i.status === 'progress' && ` · ${i.doneLessons}/${i.contentLessons} done`}
        </span>
        {i.status === 'progress' && <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-tertiary"><span className="block h-full rounded-full bg-brand-solid" style={{ width: `${pct}%` }} /></span>}
      </span>
      {next && !selected && (
        <span className="absolute -top-2 right-2 rounded-full bg-mint-500 px-2 py-0.5 text-[10px] font-bold text-brand-950 shadow-sm">Up next</span>
      )}
    </motion.button>
  );
}
