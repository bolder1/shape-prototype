'use client';
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { Icon } from '@phosphor-icons/react';
import dynamic from 'next/dynamic';
import { GlobeHemisphereWestIcon, CheckCircleIcon, GraphIcon, PlayCircleIcon, RowsIcon, TreeStructureIcon } from '@phosphor-icons/react/ssr';
import { Button } from '@/components/base/buttons/button';
import { chapterById, chapters } from '@shape/engine';
import { Toggle } from '@/components/base/toggle/toggle';
import { cx } from '@/utils/cx';
import { AppHeader } from '../app/AppHeader';
import { readProfile } from '../onboarding/storage';
import { useProgress } from '../progress/store';
import { ChapterPanel } from './ChapterPanel';
import { buildLayout } from './layout';
import { MapCanvas, type MapCanvasHandle } from './MapCanvas';
import { buildModel } from './model';
import { SkillTracks } from './SkillTracks';
import { TreeView } from './views/TreeView';

const layout = buildLayout();
// three.js is heavy: load the planet only when its tab is opened.
const PlanetView = dynamic(() => import('./planet/PlanetView'), { ssr: false, loading: () => <div className="grid h-full place-items-center text-sm text-tertiary">Forming the planet…</div> });

type View = 'planet' | 'skills' | 'tree' | 'graph';
const VIEWS: { id: View; label: string; icon: Icon; blurb: string }[] = [
  { id: 'planet', label: 'Planet', icon: GlobeHemisphereWestIcon, blurb: 'Spin your skill planet' },
  { id: 'skills', label: 'Skills', icon: RowsIcon, blurb: 'Every skill by depth' },
  { id: 'tree', label: 'Tree', icon: TreeStructureIcon, blurb: 'Unlock one skill at a time' },
  { id: 'graph', label: 'Graph', icon: GraphIcon, blurb: 'Every chapter and every link' },
];
const VIEW_KEY = 'shape.map.view';

function Legend() {
  const item = (swatch: React.ReactNode, label: string) => <span className="inline-flex items-center gap-1.5">{swatch}{label}</span>;
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-tertiary" aria-hidden>
      {item(<span className="grid size-4 place-items-center rounded-full bg-brand-solid text-[9px] font-bold text-white">1</span>, 'Stop on your path')}
      {item(<CheckCircleIcon className="size-4 text-mint-600" weight="fill" />, 'Done')}
      {item(<span className="size-3 rounded-sm ring-2 ring-warning-500 ring-inset" />, 'Needed first')}
      {item(<span className="size-3 rounded-sm ring-2 ring-mint-600 ring-inset" />, 'Unlocks next')}
    </div>
  );
}

/** Client-only: reads the saved profile and progress. */
export default function MapScreen() {
  const [profile] = useState(readProfile);
  const lessons = useProgress(s => s.lessons);
  const model = useMemo(() => buildModel(profile, lessons), [profile, lessons]);
  const [view, setViewState] = useState<View>(() => {
    try { const v = localStorage.getItem(VIEW_KEY) as View | null; return v && VIEWS.some(x => x.id === v) ? v : 'skills'; } catch { return 'skills'; }
  });
  const [focusPath, setFocusPath] = useState(!!profile);
  const [selected, setSelected] = useState<string | null>(null);
  const canvas = useRef<MapCanvasHandle>(null);
  const nextId = model.path.find(id => ['path', 'progress'].includes(model.info[id]?.status) && model.info[id].contentLessons > 0) ?? null;
  const doneCount = Object.values(model.info).filter(i => i.status === 'done').length;

  const setView = (v: View) => { setViewState(v); try { localStorage.setItem(VIEW_KEY, v); } catch { /* storage blocked */ } };
  const select = (id: string) => { setSelected(id); if (view === 'graph') canvas.current?.focusNode(id); };
  const toggle = (id: string) => setSelected(s => (s === id ? null : id));
  const props = { info: model.info, cols: model.cols, path: model.path, selectedId: selected, nextId, focusPath, onSelect: toggle };

  return (
    <div className="flex h-dvh flex-col bg-secondary">
      <AppHeader name={profile?.answers.name} wide />
      <div className="flex flex-col gap-3 border-b border-secondary bg-primary px-4 pt-3 md:px-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div>
            <h1 className="text-lg font-semibold text-primary">Skill map</h1>
            <p className="text-sm text-tertiary">
              {model.hasProfile ? `${model.path.length} chapters on your path · ${doneCount} done · ${chapters.length} in total` : <>All {chapters.length} chapters. <Link href="/onboarding" className="font-semibold text-brand-secondary underline-offset-2 hover:underline">Set up your plan</Link> to light up your path.</>}
            </p>
          </div>
          <div className="hidden xl:block"><Legend /></div>
          <div className="flex items-center gap-4 sm:ml-auto">
            {model.hasProfile && <Toggle size="sm" label="Focus on my path" isSelected={focusPath} onChange={setFocusPath} />}
            <Button size="sm" color="secondary" href="/map/journey" iconLeading={PlayCircleIcon}>Play journey</Button>
          </div>
        </div>
        <div role="tablist" aria-label="Map view" className="-mb-px flex gap-1 overflow-x-auto">
          {VIEWS.map(v => (
            <button key={v.id} role="tab" aria-selected={view === v.id} onClick={() => setView(v.id)}
              className={cx('inline-flex shrink-0 items-center gap-2 border-b-2 px-3 pb-2.5 text-sm font-semibold transition',
                view === v.id ? 'border-brand-solid text-brand-secondary' : 'border-transparent text-tertiary hover:text-secondary')}>
              <v.icon className="size-4" weight={view === v.id ? 'fill' : 'regular'} />{v.label}
            </button>
          ))}
          <span className="ml-auto hidden shrink-0 self-center pb-2.5 text-xs text-quaternary md:block">{VIEWS.find(v => v.id === view)!.blurb}</span>
        </div>
      </div>

      <main className="relative min-h-0 flex-1">
        {view === 'graph' && <MapCanvas ref={canvas} layout={layout} info={model.info} selectedId={selected} focusPath={focusPath} onSelect={select} />}
        {view === 'planet' && <PlanetView {...props} />}
        {view === 'skills' && <SkillTracks {...props} />}
        {view === 'tree' && <TreeView {...props} />}
        {selected && chapterById[selected] && (
          <ChapterPanel id={selected} info={model.info[selected]} lessons={lessons} onClose={() => setSelected(null)} onSelect={select} />
        )}
      </main>
    </div>
  );
}
