'use client';
import { useMemo, useState } from 'react';
import { buildPath } from '@shape/engine';
import { Segmented } from '@/components/inputs/Segmented';
import { OutcomeSummary } from '@/components/outcome/OutcomeSummary';
import { SkillOutcome } from '@/components/outcome/SkillOutcome';
import { SAMPLE_PROFILES } from './copy';

/**
 * The hero visual is the product itself: the same today → goal chart a learner sees at the end of onboarding,
 * computed live by the path engine for three example starting points. Switching re-runs buildPath.
 */
export function HeroDemo() {
  const [id, setId] = useState(SAMPLE_PROFILES[0].id);
  const sample = SAMPLE_PROFILES.find(s => s.id === id) ?? SAMPLE_PROFILES[0];
  const result = useMemo(() => buildPath({ goal: sample.goal, spine: sample.spine, selfRating: sample.selfRating, weeklyHours: 3 }), [sample]);

  return (
    <div className="rounded-2xl bg-primary p-4 shadow-lg ring-1 ring-secondary sm:p-6">
      <p className="mb-2 text-sm font-semibold text-secondary">Example: start as a</p>
      <Segmented label="Example starting point" value={id} onChange={setId}
        segments={SAMPLE_PROFILES.map(s => ({ value: s.id, label: s.label }))} />
      <div className="mt-6" key={id}>
        <OutcomeSummary result={result} role={sample.role} />
        <div className="mt-6 max-h-[26rem] overflow-y-auto pr-1">
          <SkillOutcome result={result} />
        </div>
      </div>
      <p className="mt-4 text-xs text-tertiary">Example profiles at 3 hours a week. Yours comes from your answers in onboarding.</p>
    </div>
  );
}
