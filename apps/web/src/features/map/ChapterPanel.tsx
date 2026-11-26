'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRightIcon, CheckCircleIcon, CircleIcon, FlagIcon, LightbulbIcon, LockSimpleIcon, PlayIcon, XIcon } from '@phosphor-icons/react/ssr';
import { BOSSES, CONTENT } from '@shape/content';
import { chapterById, domainById, unlocks } from '@shape/engine';
import { Badge } from '@/components/base/badges/badges';
import { Button } from '@/components/base/buttons/button';
import { FAMILIES, SKILL_META } from '@/lib/skills';
import { bossUnlocked, useProgress, type LessonRecord } from '../progress/store';
import { TIER_NAME, type ChapterInfo } from './model';

const STATUS_LABEL: Record<ChapterInfo['status'], string> = {
  done: 'Done', progress: 'In progress', path: 'On your path', available: 'Available now', later: 'Coming later',
};

/** Details for one chapter. Desktop: right-hand panel over the map. Phone: bottom sheet. */
export function ChapterPanel({ id, info, lessons, onClose, onSelect }: {
  id: string; info: ChapterInfo; lessons: Record<string, LessonRecord>; onClose: () => void; onSelect: (id: string) => void;
}) {
  const ch = chapterById[id], meta = SKILL_META[ch.domain], family = FAMILIES[meta.family];
  const content = CONTENT[id] ?? [];
  const firstOpen = Math.max(0, content.findIndex(l => !lessons[l.id]));
  const boss = BOSSES[id];
  const bossRecord = useProgress(s => s.bosses[id]);
  const bossOpen = bossUnlocked(content.map(l => l.id), lessons);
  const locked = info.locked.length > 0;
  const needs = info.locked.map(p => chapterById[p].title);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const chip = (cid: string) => (
    <button key={cid} type="button" onClick={() => onSelect(cid)}
      className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5 text-left text-sm text-secondary ring-1 ring-secondary ring-inset hover:bg-secondary_hover">
      {(() => { const M = SKILL_META[chapterById[cid].domain]; return <M.icon className="size-4 shrink-0" style={{ color: FAMILIES[M.family].color }} weight="duotone" />; })()}
      {chapterById[cid].title}
    </button>
  );

  return (
    <motion.aside key={id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, ease: 'easeOut' }}
      aria-label={`Chapter: ${ch.title}`}
      className="absolute inset-x-0 bottom-0 z-10 flex max-h-[70%] flex-col overflow-hidden rounded-t-3xl bg-primary shadow-xl ring-1 ring-secondary md:inset-x-auto md:top-4 md:right-4 md:bottom-4 md:max-h-none md:w-[24rem] md:rounded-2xl">
      <header className="flex items-start gap-3 border-b border-secondary p-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary"><meta.icon className="size-5" style={{ color: family.color }} weight="duotone" /></span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-tertiary">{domainById[ch.domain].name} · {TIER_NAME[ch.tier]}</p>
          <h2 className="text-lg font-semibold text-primary">{ch.title}</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {locked
              ? <Badge type="pill-color" color="gray" size="sm"><LockSimpleIcon className="mr-1 size-3" />Locked</Badge>
              : <Badge type="pill-color" color={info.status === 'done' ? 'success' : info.pathIndex != null ? 'brand' : 'gray'} size="sm">{STATUS_LABEL[info.status]}</Badge>}
            {info.pathIndex != null && <Badge type="modern" color="gray" size="sm">Stop {info.pathIndex + 1}</Badge>}
          </div>
        </div>
        <button type="button" aria-label="Close" onClick={onClose} className="rounded-lg p-1.5 text-fg-quaternary hover:bg-primary_hover"><XIcon className="size-5" /></button>
      </header>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
        <section className="flex gap-3 rounded-xl bg-brand-primary p-4">
          <LightbulbIcon className="mt-0.5 size-5 shrink-0 text-brand-secondary" weight="duotone" />
          <div>
            <p className="text-sm font-semibold text-primary">{info.pathIndex != null ? 'Why it’s on your path' : 'Where it fits'}</p>
            <p className="text-sm text-secondary">{info.why}</p>
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold text-primary">Lessons</h3>
          <ol className="flex flex-col gap-1">
            {ch.lessons.map((l, i) => {
              const done = content[i] && lessons[content[i].id];
              return (
                <li key={l.title} className="flex items-center gap-2.5 rounded-lg px-1 py-1.5 text-sm text-secondary">
                  {done ? <CheckCircleIcon className="size-5 shrink-0 text-mint-600" weight="fill" /> : content[i] ? <CircleIcon className="size-5 shrink-0 text-fg-quaternary" /> : <LockSimpleIcon className="size-5 shrink-0 text-fg-quaternary" />}
                  <span className="flex-1">{l.title}</span>
                </li>
              );
            })}
          </ol>
          {!content.length && <p className="mt-2 text-xs text-tertiary">Lessons for this chapter are being written.</p>}
        </section>

        <section className="flex gap-3 rounded-xl bg-secondary p-4">
          <FlagIcon className="mt-0.5 size-5 shrink-0 text-fg-tertiary" weight="duotone" />
          <div>
            <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-primary">Chapter project
              {bossRecord && <Badge type="pill-color" color={bossRecord.best === 'retry' ? 'warning' : 'success'} size="sm">{bossRecord.best === 'distinction' ? 'Distinction' : bossRecord.best === 'pass' ? 'Passed' : 'Not passed yet'} · {bossRecord.bestPercent}%</Badge>}
            </p>
            <p className="text-sm text-secondary">{ch.boss}</p>
            {boss && <Link href={`/boss/${id}`} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-secondary hover:underline">{bossOpen ? (bossRecord ? 'Open your project' : 'Start the project') : 'Read the brief'}<ArrowRightIcon className="size-4" /></Link>}
          </div>
        </section>

        {ch.prereqs.length > 0 && <section><h3 className="mb-2 text-sm font-semibold text-primary">Builds on</h3><div className="flex flex-wrap gap-2">{ch.prereqs.map(chip)}</div></section>}
        {unlocks[id].length > 0 && <section><h3 className="mb-2 text-sm font-semibold text-primary">Unlocks</h3><div className="flex flex-wrap gap-2">{unlocks[id].map(chip)}</div></section>}
      </div>

      <footer className="border-t border-secondary p-4">
        {locked ? (
          <div className="flex flex-col gap-3">
            <p className="flex gap-2 text-sm text-secondary"><LockSimpleIcon className="mt-0.5 size-4 shrink-0 text-fg-quaternary" />
              <span>Guided path is on. Finish {needs.join(' and ')} first, and this chapter opens.</span></p>
            <Button size="lg" color="secondary" className="w-full" iconTrailing={ArrowRightIcon} onPress={() => onSelect(info.locked[0])}>Go to {needs[0]}</Button>
          </div>
        ) : content.length ? (
          <Button size="lg" className="w-full" href={`/learn/${id}/${firstOpen + 1}`} iconLeading={info.status === 'done' ? ArrowRightIcon : PlayIcon}>
            {info.status === 'done' ? 'Revisit chapter' : info.status === 'progress' ? 'Continue chapter' : 'Start chapter'}
          </Button>
        ) : (
          <p className="text-center text-sm text-tertiary"><LockSimpleIcon className="mr-1 inline size-4 align-[-2px]" />Coming soon. It stays on your map meanwhile.</p>
        )}
      </footer>
    </motion.aside>
  );
}
