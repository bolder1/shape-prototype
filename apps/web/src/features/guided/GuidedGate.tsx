'use client';
// Guided path, on the lesson route: if the chapter is still locked, show what opens it instead of the lesson.
// Reads the profile through useSyncExternalStore so the prerendered page (no profile) and the browser agree on
// the first render; the lock appears once the browser's copy is read.
import { useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { ArrowRightIcon, LockSimpleIcon } from '@phosphor-icons/react/ssr';
import { CONTENT } from '@shape/content';
import { chapterById } from '@shape/engine';
import { Button } from '@/components/base/buttons/button';
import { buildModel } from '../map/model';
import { PROFILE_KEY, readProfile } from '../onboarding/storage';
import { useProgress } from '../progress/store';

const subscribe = (cb: () => void) => { window.addEventListener('storage', cb); return () => window.removeEventListener('storage', cb); };
const snapshot = () => { try { return localStorage.getItem(PROFILE_KEY); } catch { return null; } };

/** Prerequisites still standing in the way of a chapter, or [] when Guided path is off or the chapter is open. */
export function useGuidedLock(chapterId: string): string[] {
  const raw = useSyncExternalStore(subscribe, snapshot, () => null);
  const lessons = useProgress(s => s.lessons), bosses = useProgress(s => s.bosses);
  return useMemo(() => {
    const profile = raw ? readProfile() : null;
    if (!profile?.guided) return [];
    return buildModel(profile, lessons, bosses).info[chapterId]?.locked ?? [];
  }, [raw, lessons, bosses, chapterId]);
}

export function GuidedGate({ chapterId, children }: { chapterId: string; children: ReactNode }) {
  const missing = useGuidedLock(chapterId);
  const lessons = useProgress(s => s.lessons);
  if (!missing.length) return children;
  const first = missing[0];
  const firstLesson = Math.max(0, (CONTENT[first] ?? []).findIndex(l => !lessons[l.id])) + 1;
  const names = missing.map(p => chapterById[p].title);
  return (
    <main className="grid min-h-dvh place-items-center bg-secondary px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-5 rounded-3xl bg-primary p-8 text-center shadow-xs ring-1 ring-secondary ring-inset">
        <span className="grid size-14 place-items-center rounded-2xl bg-secondary"><LockSimpleIcon className="size-7 text-fg-tertiary" weight="duotone" /></span>
        <div>
          <p className="text-sm font-semibold text-brand-secondary">Guided path</p>
          <h1 className="mt-1 text-xl font-semibold text-primary">{chapterById[chapterId].title} opens after {names.join(' and ')}</h1>
          <p className="mt-2 text-sm text-tertiary">It builds on {missing.length > 1 ? 'those chapters' : 'that chapter'}, so you’ll get more out of it once {missing.length > 1 ? 'they’re' : 'it’s'} behind you.</p>
        </div>
        <div className="flex w-full flex-col gap-2">
          <Button size="lg" className="w-full" href={`/learn/${first}/${firstLesson}`} iconTrailing={ArrowRightIcon}>Go to {names[0]}</Button>
          <Button size="lg" color="secondary" className="w-full" href="/map">Back to the map</Button>
        </div>
        <p className="text-xs text-quaternary">Prefer to roam? Turn Guided path off in your <a href="/syllabus" className="font-semibold text-brand-secondary hover:underline">syllabus</a>.</p>
      </div>
    </main>
  );
}
