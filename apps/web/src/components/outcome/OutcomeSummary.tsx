import type { PathResult } from '@shape/engine';
import { ProgressBarBase } from '@/components/base/progress-indicators/progress-indicators';

/** Headline numbers: how ready you are for the role you want, and what it takes to get there. */
export function OutcomeSummary({ result, role }: { result: PathResult; role: string }) {
  const now = result.tshape.columns.reduce((s, c) => s + c.current, 0);
  const goal = result.tshape.columns.reduce((s, c) => s + c.target, 0);
  const ready = goal ? Math.round((now / goal) * 100) : 0;
  const stats = [
    { label: 'Chapters', value: result.path.length },
    { label: 'Hours', value: result.estimate.hours },
    { label: 'Weeks', value: result.estimate.weeks },
  ];
  return (
    <div className="grid gap-6 sm:grid-cols-[1.4fr_1fr]">
      <div>
        <p className="text-sm text-tertiary">Ready for <span className="font-semibold text-primary">{role}</span></p>
        <p className="mt-1 text-display-md font-semibold text-primary tabular-nums">{ready}<span className="text-display-xs text-quaternary">%</span></p>
        <div className="mt-3" role="img" aria-label={`${ready}% ready for ${role}`}>
          <ProgressBarBase value={ready} progressClassName="bg-mint-600" />
        </div>
      </div>
      <dl className="grid grid-cols-3 gap-3">
        {stats.map(s => (
          <div key={s.label} className="rounded-xl bg-primary p-4 shadow-xs ring-1 ring-secondary ring-inset">
            <dt className="text-sm text-tertiary">{s.label}</dt>
            <dd className="mt-1 text-display-xs font-semibold text-primary tabular-nums">{s.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
