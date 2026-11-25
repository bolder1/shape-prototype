'use client';
// Client-only: reads and writes the profile saved in this browser.
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowCounterClockwiseIcon, CheckCircleIcon, ListChecksIcon, MagnifyingGlassIcon, MinusCircleIcon, PlusIcon, SlidersHorizontalIcon, SparkleIcon, UserIcon,
} from '@phosphor-icons/react/ssr';
import { CONTENT } from '@shape/content';
import { chapterById, chapters, type DomainId } from '@shape/engine';
import { Button } from '@/components/base/buttons/button';
import { Badge } from '@/components/base/badges/badges';
import { Input } from '@/components/base/input/input';
import { Select } from '@/components/base/select/select';
import { SelectItem } from '@/components/base/select/select-item';
import { Toggle } from '@/components/base/toggle/toggle';
import { Segmented } from '@/components/inputs/Segmented';
import { FAMILIES, FAMILY_ORDER, SKILL_META, skillsInFamily } from '@/lib/skills';
import { cx } from '@/utils/cx';
import { AppHeader } from '../app/AppHeader';
import { ASPIRATIONS, LEVELS, PACE } from '../onboarding/content';
import { readProfile, writeProfile } from '../onboarding/storage';
import { initialAnswers, type SurveyAnswers } from '../onboarding/survey/questions';
import { useProgress } from '../progress/store';
import { addChapter, hoursOf, NO_EDITS, removeChapter, replan, TIER_LABEL } from './model';

type Tab = 'chapters' | 'skills';
const DAYS = [{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '5', label: '5' }, { value: '7', label: '7' }];

export default function SyllabusScreen() {
  const [plan, setPlan] = useState(() => {
    const p = readProfile();
    return replan(p?.answers ?? { ...initialAnswers, aspiration: 'explore' }, p?.edits ?? NO_EDITS);
  });
  const [tab, setTab] = useState<Tab>('chapters');
  const [query, setQuery] = useState('');
  const { lessons } = useProgress();
  const a = plan.answers;
  const edits = plan.edits ?? NO_EDITS;

  const update = (answers: SurveyAnswers, nextEdits = edits) => { const next = replan(answers, nextEdits); setPlan(next); writeProfile(next); };
  const set = (p: Partial<SurveyAnswers>) => update({ ...a, ...p });
  const edit = (e: typeof edits) => update(a, e);

  const onPath = new Set(plan.path);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return chapters.filter(c => !onPath.has(c.id) && (!q || c.title.toLowerCase().includes(q) || SKILL_META[c.domain].short.toLowerCase().includes(q)));
  }, [query, plan.path]); // eslint-disable-line react-hooks/exhaustive-deps
  const changed = edits.added.length + edits.removed.length;

  return (
    <div className="min-h-dvh bg-secondary">
      <AppHeader name={a.name} />
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold text-brand-secondary">Your syllabus</p>
            <h1 className="mt-1 text-display-xs font-semibold tracking-tight text-primary md:text-display-sm">Path to {plan.future}</h1>
            <p className="mt-1 text-md text-tertiary">
              {plan.path.length} chapters · about {hoursOf(plan.path)} hours · changes save automatically.
            </p>
          </div>
          {changed > 0 && (
            <Button className="md:ml-auto" color="secondary" size="md" iconLeading={ArrowCounterClockwiseIcon} onPress={() => edit(NO_EDITS)}>
              Reset to recommended
            </Button>
          )}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
          <div className="min-w-0">
            <div role="tablist" aria-label="Syllabus" className="flex gap-1 border-b border-secondary">
              {([['chapters', 'Chapters', ListChecksIcon], ['skills', 'Skill levels', SlidersHorizontalIcon]] as const).map(([id, label, Icon]) => (
                <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
                  className={cx('-mb-px inline-flex items-center gap-2 border-b-2 px-3 pb-3 text-sm font-semibold transition',
                    tab === id ? 'border-brand-solid text-brand-secondary' : 'border-transparent text-tertiary hover:text-secondary')}>
                  <Icon className="size-4" weight={tab === id ? 'fill' : 'regular'} />{label}
                </button>
              ))}
            </div>

            {tab === 'chapters' ? (
              <div className="mt-6 flex flex-col gap-6">
                <section className="overflow-hidden rounded-2xl bg-primary shadow-xs ring-1 ring-secondary ring-inset">
                  <ol className="divide-y divide-secondary">
                    <AnimatePresence initial={false}>
                      {plan.path.map((id, n) => {
                        const ch = chapterById[id]; const meta = SKILL_META[ch.domain as DomainId];
                        const ls = CONTENT[id]; const done = ls ? ls.filter(l => lessons[l.id]).length : 0;
                        const mine = edits.added.includes(id);
                        return (
                          <motion.li key={id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            className="flex items-center gap-4 px-4 py-3.5">
                            <span className="w-6 text-right text-sm font-medium text-quaternary tabular-nums">{n + 1}</span>
                            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary">
                              <meta.icon className="size-5" style={{ color: FAMILIES[meta.family].color }} weight="duotone" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-md font-semibold text-primary">{ch.title}</span>
                              <span className="block text-sm text-tertiary">{meta.short} · {TIER_LABEL[ch.tier]} · {ch.lessons.length} lessons{done ? ` · ${done} done` : ''}</span>
                            </span>
                            {mine && <Badge type="pill-color" color="brand" size="sm">Added by you</Badge>}
                            {!ls && <span className="hidden text-xs text-quaternary sm:inline">Coming soon</span>}
                            <Button color="tertiary" size="sm" iconLeading={MinusCircleIcon} aria-label={`Remove ${ch.title}`}
                              onPress={() => edit(removeChapter(edits, id, plan.recommended))} />
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                  </ol>
                </section>

                <section>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div>
                      <h2 className="text-lg font-semibold text-primary">Add chapters</h2>
                      <p className="text-sm text-tertiary">Anything in the catalogue can go on your path. Added chapters come after the recommended ones.</p>
                    </div>
                    <div className="sm:ml-auto sm:w-64"><Input aria-label="Search chapters" icon={MagnifyingGlassIcon} placeholder="Search chapters or skills" value={query} onChange={setQuery} /></div>
                  </div>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {results.slice(0, query ? 40 : 12).map(c => {
                      const meta = SKILL_META[c.domain];
                      const removed = edits.removed.includes(c.id);
                      return (
                        <li key={c.id} className="flex items-center gap-3 rounded-xl bg-primary p-3 ring-1 ring-secondary ring-inset">
                          <meta.icon className="size-5 shrink-0" style={{ color: FAMILIES[meta.family].color }} weight="duotone" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-primary">{c.title}</span>
                            <span className="block text-xs text-tertiary">{meta.short} · {TIER_LABEL[c.tier]}{removed ? ' · recommended' : ''}</span>
                          </span>
                          <Button color="secondary" size="sm" iconLeading={PlusIcon} onPress={() => edit(addChapter(edits, c.id, plan.recommended))}>Add</Button>
                        </li>
                      );
                    })}
                  </ul>
                  {!results.length && <p className="mt-4 text-sm text-tertiary">{query ? 'No chapters match that search.' : 'Every chapter is already on your path.'}</p>}
                  {!query && results.length > 12 && <p className="mt-3 text-sm text-tertiary">Showing 12 of {results.length}. Search to find the rest.</p>}
                </section>
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-6">
                <p className="text-md text-tertiary">Tell us where you really are. Your path re-plans as you change these, and keeps the chapters you added.</p>
                {FAMILY_ORDER.map(f => (
                  <section key={f} className="overflow-hidden rounded-2xl bg-primary shadow-xs ring-1 ring-secondary ring-inset">
                    <h2 className="flex items-center gap-2 border-b border-secondary px-4 py-3 text-sm font-semibold text-primary">
                      <span className="size-2.5 rounded-full" style={{ background: FAMILIES[f].color }} />{FAMILIES[f].label}
                      <span className="font-normal text-tertiary">· {FAMILIES[f].blurb}</span>
                    </h2>
                    <div className="divide-y divide-secondary">
                      {skillsInFamily(f).map(id => (
                        <div key={id} className="flex flex-col gap-2 px-4 py-3 md:flex-row md:items-center md:gap-6">
                          <span className="flex flex-1 items-center gap-3 text-md font-semibold text-primary">
                            {(() => { const I = SKILL_META[id].icon; return <I className="size-5 shrink-0" style={{ color: FAMILIES[f].color }} weight="duotone" />; })()}
                            {SKILL_META[id].short}
                          </span>
                          <div className="md:w-[22rem]">
                            <Segmented label={`Your level in ${SKILL_META[id].short}`} segments={LEVELS.map(l => ({ value: String(l.level), label: l.label }))}
                              value={String(nearestLevel(a.ratings[id] ?? 0))} onChange={v => set({ ratings: { ...a.ratings, [id]: Number(v) } })} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-6">
            <section className="rounded-2xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset">
              <h2 className="flex items-center gap-2 text-md font-semibold text-primary"><UserIcon className="size-5 text-brand-secondary" weight="duotone" />Goal and pace</h2>
              <div className="mt-4 flex flex-col gap-5">
                <Select label="I want to become" items={ASPIRATIONS.map(x => ({ id: x.id, label: x.label }))} selectedKey={a.aspiration}
                  onSelectionChange={k => k && set({ aspiration: String(k) })}>
                  {item => <SelectItem id={item.id} label={item.label} />}
                </Select>
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-medium text-secondary">Minutes on a learning day</p>
                  <Segmented label="Minutes a day" segments={PACE.map(p => ({ value: p.value, label: p.value }))} value={String(a.minutesPerDay)} onChange={v => set({ minutesPerDay: Number(v) })} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-medium text-secondary">Days a week</p>
                  <Segmented label="Days a week" segments={DAYS} value={String(a.daysPerWeek)} onChange={v => set({ daysPerWeek: Number(v) })} />
                </div>
                <Toggle size="sm" label="Start every skill from the basics" hint="Ignores your skill levels" isSelected={a.fromZero} onChange={fromZero => set({ fromZero })} />
              </div>
            </section>

            <section className="rounded-2xl bg-brand-solid p-5 text-white">
              <SparkleIcon className="size-5 text-mint-400" weight="fill" />
              <p className="mt-3 text-display-xs font-semibold tabular-nums">{plan.ready}%</p>
              <p className="text-sm text-brand-200">ready for {plan.future}, by your skill levels</p>
              <ul className="mt-4 flex flex-col gap-1.5 text-sm text-brand-100">
                <li className="flex items-center gap-2"><CheckCircleIcon className="size-4 text-mint-400" weight="fill" />{plan.recommended.length} recommended chapters</li>
                {edits.added.length > 0 && <li className="flex items-center gap-2"><PlusIcon className="size-4 text-mint-400" />{edits.added.length} added by you</li>}
                {edits.removed.length > 0 && <li className="flex items-center gap-2"><MinusCircleIcon className="size-4 text-mint-400" />{edits.removed.length} removed</li>}
              </ul>
            </section>
            <Link href="/play" className="text-sm font-semibold text-brand-secondary hover:text-brand-secondary_hover">← Back to dashboard</Link>
          </aside>
        </div>
      </main>
    </div>
  );
}

/** Ratings from older profiles can be 2 or 4; the picker shows 0, 1, 3, 5. */
const nearestLevel = (v: number) => LEVELS.reduce((best, l) => (Math.abs(l.level - v) < Math.abs(best - v) ? l.level : best), 0);
