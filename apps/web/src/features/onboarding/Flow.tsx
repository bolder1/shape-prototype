'use client';
// Client-only module (loaded with ssr:false), so browser APIs can be read during the first render.
import { useEffect, useMemo, useState, useSyncExternalStore, type ComponentType } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useMachine } from '@xstate/react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react/ssr';
import type { Snapshot } from 'xstate';
import { Button } from '@/components/base/buttons/button';
import { Toggle } from '@/components/base/toggle/toggle';
import { ProgressBarBase } from '@/components/base/progress-indicators/progress-indicators';
import { cx } from '@/utils/cx';
import { Buddy } from './Buddy';
import { onboardingMachine, progressOf, type Scene } from './machine';
import { computeOutcome } from './profile';
import { ArrivalStep, DreamStep, InterestsStep, TodayStep } from './steps/intro';
import { CheckStep, SkillStep } from './steps/journey';
import { FutureStep, PricingStep, ProfileStep, RoadStep } from './steps/outcome';
import type { StepProps } from './steps/shared';

const World = dynamic(() => import('./world/World'), { ssr: false });

import { ONBOARDING_KEY as STORAGE_KEY, PROFILE_KEY } from './storage';

const STEPS: Record<Exclude<Scene, 'done'>, ComponentType<StepProps>> = {
  arrival: ArrivalStep, dream: DreamStep, today: TodayStep, interests: InterestsStep, journey: SkillStep,
  check: CheckStep, profile: ProfileStep, future: FutureStep, road: RoadStep, pricing: PricingStep,
};
const WIDE: Scene[] = ['profile', 'road', 'pricing'];

function canUseWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

function readSaved(): Snapshot<unknown> | undefined {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : undefined; } catch { return undefined; }
}

const DESKTOP = '(min-width: 1024px)';
const subscribeDesktop = (cb: () => void) => { const mq = matchMedia(DESKTOP); mq.addEventListener('change', cb); return () => mq.removeEventListener('change', cb); };

export default function Flow() {
  const router = useRouter();
  const [boot] = useState(() => ({ snapshot: readSaved(), webgl: canUseWebGL(), reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches }));
  const { webgl, reducedMotion } = boot;
  const [state, send, actor] = useMachine(onboardingMachine, boot.snapshot ? { snapshot: boot.snapshot as never } : undefined);
  const scene = state.value as Scene;
  const ctx = state.context;
  const desktop = useSyncExternalStore(subscribeDesktop, () => matchMedia(DESKTOP).matches, () => false);

  // Save after every step, so a reload resumes the story.
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(actor.getPersistedSnapshot())); } catch { /* storage blocked */ }
  }, [state, actor]);

  // Finish: keep the profile (until accounts exist) and go home.
  useEffect(() => {
    if (scene !== 'done') return;
    try {
      const o = computeOutcome(ctx);
      localStorage.setItem(PROFILE_KEY, JSON.stringify({ answers: ctx, persona: o.persona, future: o.future, ready: o.ready, path: o.result.path.map(p => p.id), savedAt: new Date().toISOString() }));
      localStorage.removeItem(STORAGE_KEY);
    } catch { /* storage blocked */ }
    router.push('/play');
  }, [scene, ctx, router]);

  const story = webgl && ctx.storyMode;
  const wide = WIDE.includes(scene);
  const panelWidth = wide ? 600 : 480;
  const Step = scene === 'done' ? null : STEPS[scene];
  const stepKey = scene === 'journey' ? `journey-${ctx.skillIndex}` : scene === 'check' ? `check-${ctx.quizIndex}` : scene;
  const progress = useMemo(() => progressOf(scene, ctx), [scene, ctx]);

  return (
    <div className={cx('relative flex min-h-dvh flex-col', story ? 'bg-[#F3F5F9]' : 'bg-secondary')}>
      {/* Stage: full screen on desktop, a strip on top on phones. */}
      {story && (
        <div className={cx('transition-opacity duration-500', desktop ? 'fixed inset-0' : 'relative h-[38vh] shrink-0', scene === 'profile' && 'opacity-40')} aria-hidden>
          <World scene={scene} ctx={ctx} reducedMotion={reducedMotion} panelOffset={desktop ? panelWidth + 48 : 0} />
        </div>
      )}

      <header className={cx('z-20 flex items-center gap-4 px-4 py-3 md:px-6', story && desktop ? 'fixed inset-x-0 top-0' : story ? 'absolute inset-x-0 top-0' : 'sticky top-0 bg-secondary')}>
        <span className="text-lg font-semibold tracking-tight text-primary">Shape</span>
        <div className="mx-auto w-full max-w-sm" role="progressbar" aria-label="Onboarding progress" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
          <ProgressBarBase value={progress * 100} progressClassName="bg-mint-600 transition-all duration-500" />
        </div>
        <div className="flex items-center gap-3">
          {webgl && <div className="hidden sm:block"><Toggle size="sm" label="3D story" isSelected={ctx.storyMode} onChange={() => send({ type: 'TOGGLE_STORY' })} /></div>}
          <Button color="link-gray" size="sm" iconLeading={ArrowCounterClockwiseIcon} onPress={() => send({ type: 'RESTART' })}>Start over</Button>
        </div>
      </header>

      {/* Story panel */}
      <main className={cx('relative z-10 flex flex-1',
        story && desktop ? 'pointer-events-none fixed top-16 bottom-6 left-6' : story ? '-mt-6' : 'justify-center px-4 pt-6 pb-24')}
        style={story && desktop ? { width: panelWidth } : undefined}>
        <AnimatePresence mode="wait">
          {Step && (
            <motion.section key={stepKey}
              initial={reducedMotion ? false : { opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={reducedMotion ? undefined : { opacity: 0, x: 16 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              className={cx('pointer-events-auto flex w-full flex-col gap-5 overflow-y-auto bg-primary p-5 md:p-6',
                story && desktop ? 'max-h-full rounded-2xl shadow-xl ring-1 ring-secondary' : story ? 'rounded-t-3xl pb-28 shadow-[0_-8px_24px_rgba(16,24,40,0.08)]' : cx('rounded-2xl shadow-sm ring-1 ring-secondary', wide ? 'max-w-3xl' : 'max-w-xl'))}>
              <Step ctx={ctx} send={send} />
            </motion.section>
          )}
        </AnimatePresence>
        {scene === 'done' && <p className="m-auto text-md text-tertiary" role="status">Saving your path…</p>}
      </main>

      <Buddy scene={scene} ctx={ctx} />
    </div>
  );
}
