'use client';
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { CheckCircleIcon, PlayCircleIcon } from '@phosphor-icons/react/ssr';
import { Button } from '@/components/base/buttons/button';
import { chapterById, chapters, domainById } from '@shape/engine';
import { Toggle } from '@/components/base/toggle/toggle';
import { Segmented } from '@/components/inputs/Segmented';
import { FAMILIES, FAMILY_ORDER, SKILL_META, skillsInFamily } from '@/lib/skills';
import { cx } from '@/utils/cx';
import { AppHeader } from '../app/AppHeader';
import { readProfile } from '../onboarding/storage';
import { useProgress } from '../progress/store';
import { ChapterPanel } from './ChapterPanel';
import { buildLayout } from './layout';
import { MapCanvas, type MapCanvasHandle } from './MapCanvas';
import { buildModel, TIER_NAME, type ChapterInfo } from './model';

const layout = buildLayout();

function Legend() {
  const item = (swatch: React.ReactNode, label: string) => <span className="inline-flex items-center gap-1.5">{swatch}{label}</span>;
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-tertiary" aria-hidden>
      {item(<span className="grid size-4 place-items-center rounded-full bg-brand-solid text-[9px] font-bold text-white">1</span>, 'Your path')}
      {item(<CheckCircleIcon className="size-4 text-mint-600" weight="fill" />, 'Done')}
      {item(<span className="h-0.5 w-5 rounded bg-mint-600" />, 'Path link')}
      {item(<span className="size-3 rounded-sm ring-1 ring-primary ring-inset" />, 'Other chapters')}
    </div>
  );
}

function MapList({ info, onSelect }: { info: Record<string, ChapterInfo>; onSelect: (id: string) => void }) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6">
        {FAMILY_ORDER.map(f => (
          <section key={f} aria-labelledby={`fam-${f}`}>
            <h2 id={`fam-${f}`} className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide text-tertiary uppercase">
              <i className="size-2 rounded-full" style={{ background: FAMILIES[f].color }} />{FAMILIES[f].label}
            </h2>
            <div className="flex flex-col gap-3">
              {skillsInFamily(f).map(d => {
                const meta = SKILL_META[d];
                return (
                  <div key={d} className="rounded-xl bg-primary p-3 ring-1 ring-secondary ring-inset">
                    <h3 className="mb-2 flex items-center gap-2 px-1 text-sm font-semibold text-primary"><meta.icon className="size-4" style={{ color: FAMILIES[f].color }} weight="duotone" />{domainById[d].name}</h3>
                    <ul className="flex flex-col">
                      {chapters.filter(c => c.domain === d).map(c => {
                        const i = info[c.id];
                        return (
                          <li key={c.id}>
                            <button type="button" onClick={() => onSelect(c.id)} className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-primary_hover">
                              <span className={cx('grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-bold',
                                i.status === 'done' ? 'bg-mint-600 text-white' : i.pathIndex != null ? 'bg-brand-solid text-white' : 'bg-secondary text-quaternary')}>
                                {i.status === 'done' ? '✓' : i.pathIndex != null ? i.pathIndex + 1 : ''}
                              </span>
                              <span className="flex-1 text-sm text-primary">{c.title}</span>
                              <span className="text-xs text-quaternary">{TIER_NAME[c.tier]}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

/** Client-only: reads the saved profile and progress. */
export default function MapScreen() {
  const [profile] = useState(readProfile);
  const lessons = useProgress(s => s.lessons);
  const model = useMemo(() => buildModel(profile, lessons), [profile, lessons]);
  const [view, setView] = useState<'map' | 'list'>('map');
  const [focusPath, setFocusPath] = useState(!!profile);
  const [selected, setSelected] = useState<string | null>(null);
  const canvas = useRef<MapCanvasHandle>(null);
  const doneCount = Object.values(model.info).filter(i => i.status === 'done').length;

  const select = (id: string) => { setSelected(id); if (view === 'map') canvas.current?.focusNode(id); };

  return (
    <div className="flex h-dvh flex-col bg-secondary">
      <AppHeader name={profile?.answers.name} wide />
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-secondary bg-primary px-4 py-3 md:px-6">
        <div>
          <h1 className="text-lg font-semibold text-primary">Skill map</h1>
          <p className="text-sm text-tertiary">
            {model.hasProfile ? `${model.path.length} chapters on your path · ${doneCount} done · ${chapters.length} in total` : <>All {chapters.length} chapters. <Link href="/onboarding" className="font-semibold text-brand-secondary underline-offset-2 hover:underline">Map your skills</Link> to light up your path.</>}
          </p>
        </div>
        <div className="hidden lg:block"><Legend /></div>
        <div className="flex w-full items-center justify-between gap-4 sm:ml-auto sm:w-auto sm:justify-end">
          <Button size="sm" color="secondary" href="/map/journey" iconLeading={PlayCircleIcon}>Play journey</Button>
          {model.hasProfile && view === 'map' && <Toggle size="sm" label="Focus on my path" isSelected={focusPath} onChange={setFocusPath} />}
          <div className="w-40"><Segmented label="View" value={view} onChange={v => setView(v as 'map' | 'list')} segments={[{ value: 'map', label: 'Map' }, { value: 'list', label: 'List' }]} /></div>
        </div>
      </div>

      <main className="relative min-h-0 flex-1">
        {view === 'map'
          ? <MapCanvas ref={canvas} layout={layout} info={model.info} selectedId={selected} focusPath={focusPath} onSelect={select} />
          : <MapList info={model.info} onSelect={setSelected} />}
        {selected && chapterById[selected] && (
          <ChapterPanel id={selected} info={model.info[selected]} lessons={lessons} onClose={() => setSelected(null)} onSelect={select} />
        )}
      </main>
    </div>
  );
}
