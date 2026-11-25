'use client';
// Scene for ld.4-1: one Saathi design request, 27 working days from ask to live, drawn as a bar of work (green) and
// waiting (grey) for each of the twelve steps in `SAATHI_STEPS`. Megha removes the steps that change nothing, clears
// the queues, standardises what every squad does differently and automates the rest, and each step's segments shrink
// to its `after` hours until the request takes 6 days at 47% flow efficiency. Pure function of t (0–36). Also exports
// `FLOW_FILL` and `FLOW_LABEL`, which `flow-fix` uses.
import { FLOW_STAGES, SAATHI_STEPS, flowEfficiency, flowFix, flowHours, workDays, type FlowFix, type SaathiStep } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per fix; white text on each passes 4.5:1. */
export const FLOW_FILL: Record<FlowFix, string> = { remove: '#475467', unblock: '#B54708', standardise: '#175CD3', automate: '#6941C6' };
export const FLOW_LABEL: Record<FlowFix, string> = { remove: 'Remove', unblock: 'Unblock', standardise: 'Standardise', automate: 'Automate' };
/** Work time on the bar. */
export const WORK_FILL = '#067647';

const KEYS = (Object.keys(SAATHI_STEPS) as SaathiStep[])
  .sort((a, b) => FLOW_STAGES.indexOf(SAATHI_STEPS[a].stage) - FLOW_STAGES.indexOf(SAATHI_STEPS[b].stage));
const BEFORE = flowHours(KEYS);
const SCALE = 576 / (BEFORE.touch + BEFORE.wait);
/** When each fix's steps shrink. */
const PHASE: Record<FlowFix, number> = { remove: 11.6, unblock: 16.6, standardise: 21.6, automate: 26.6 };
const NOTES: Record<FlowFix, readonly string[]> = {
  remove: ['Sign-off that never says no', 'Redlines nobody opens · a second tracker'],
  unblock: ['One reviewer for 38 designers', 'Five requests open at once · legal on every label'],
  standardise: ['One file template · one tool per job', 'One meaning of “ready for dev”'],
  automate: ['Tokens reach code as a pull request', 'Tickets and screenshot checks, by the build'],
};

export function WaitTimeScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'One request, 27 days' : t < 11 ? 'Mostly waiting' : t < 16 ? 'Remove first' : t < 21 ? 'Unblock the queues' : t < 26 ? 'Then standardise' : t < 31 ? 'Automate what’s left' : '6 days';
  const k = (s: SaathiStep) => p(t, PHASE[flowFix(SAATHI_STEPS[s])], PHASE[flowFix(SAATHI_STEPS[s])] + 2.4);
  const hours = KEYS.map(s => {
    const st = SAATHI_STEPS[s], m = k(s);
    return { s, touch: lerp(st.touch, st.after.touch, m), wait: lerp(st.wait, st.after.wait, m) };
  });
  const total = hours.reduce((h, x) => ({ touch: h.touch + x.touch, wait: h.wait + x.wait }), { touch: 0, wait: 0 });
  const grow = p(t, 0.3, 4.5);
  const phase: FlowFix | null = t >= 11 && t < 31 ? (t < 16 ? 'remove' : t < 21 ? 'unblock' : t < 26 ? 'standardise' : 'automate') : null;
  const starts = hours.map((_, i) => 32 + hours.slice(0, i).reduce((s, h) => s + (h.touch + h.wait) * SCALE * grow, 0));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: one design request at Saathi takes 27 working days from the first ask to going live. Drawn as a bar, only 44 hours of it are work and 170 hours are waiting, a flow efficiency of 21%. Megha first removes steps that change nothing: a weekly sign-off that never rejects anything, redline PDFs nobody opens and a second tracker. Then she clears the queues: one accessibility reviewer for 38 designers, a designer with five requests open, legal reviewing every label. Then she standardises the file template, the meaning of ready for dev and one tool per job. Only then she automates token copying, handoff tickets and screenshot checks. The request now takes 6 days at 47% flow efficiency.">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>
        <text x={608} y={44} fontSize={24} fontWeight={900} fill={t >= 31 ? WORK_FILL : SC.text} textAnchor="end">
          {t < 4.5 ? `Day ${Math.max(1, Math.round(27 * grow))}` : `${workDays(total.touch + total.wait)} days`}
        </text>

        <g>
          <rect x={32} y={88} width={576 * grow} height={48} rx={8} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
          {hours.map((h, i) => {
            const fx = flowFix(SAATHI_STEPS[h.s]);
            const tw = h.touch * SCALE * grow, ww = h.wait * SCALE * grow;
            const x0 = starts[i];
            const lit = phase === fx;
            return (
              <g key={h.s}>
                {tw > 0.5 && <rect x={x0} y={92} width={tw} height={40} fill={WORK_FILL} />}
                {ww > 0.5 && <rect x={x0 + tw} y={92} width={ww} height={40} fill={SC.line} />}
                {lit && tw + ww > 1 && <rect x={x0} y={88} width={tw + ww} height={48} fill="none" stroke={FLOW_FILL[fx]} strokeWidth={4} rx={4} />}
              </g>
            );
          })}
        </g>

        <g opacity={p(t, 4.6, 5.4)}>
          <rect x={32} y={158} width={18} height={18} rx={4} fill={WORK_FILL} />
          <text x={58} y={175} fontSize={21} fontWeight={800} fill={SC.text}>Work {Math.round(total.touch)} h</text>
          <rect x={220} y={158} width={18} height={18} rx={4} fill={SC.line} />
          <text x={246} y={175} fontSize={21} fontWeight={800} fill={SC.text}>Waiting {Math.round(total.wait)} h</text>
          <text x={608} y={175} fontSize={21} fontWeight={900} fill={t >= 31 ? WORK_FILL : SC.text} textAnchor="end">{flowEfficiency(total)}% efficient</text>
        </g>

        {t >= 6 && t < 11 && (
          <g opacity={p(t, 6.6, 7.2)}>
            <text x={32} y={252} fontSize={21} fontWeight={900} fill={SC.text}>Four-fifths of the time, nobody works on it.</text>
            <text x={32} y={286} fontSize={21} fontWeight={800} fill={SC.muted}>Faster drafting would save almost nothing.</text>
          </g>
        )}

        {phase && (
          <g key={phase}>
            <rect x={32} y={220} width={168} height={40} rx={10} fill={FLOW_FILL[phase]} opacity={p(t, PHASE[phase] - 0.4, PHASE[phase])} />
            <text x={116} y={247} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle" opacity={p(t, PHASE[phase] - 0.4, PHASE[phase])}>{FLOW_LABEL[phase]}</text>
            {NOTES[phase].map((l, i) => (
              <text key={l} x={32} y={296 + i * 32} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, PHASE[phase] + 0.4 + i * 0.6, PHASE[phase] + 1 + i * 0.6)}>{l}</text>
            ))}
          </g>
        )}

        {t >= 31 && (
          <g opacity={p(t, 31.4, 32)}>
            <text x={32} y={252} fontSize={21} fontWeight={900} fill={SC.text}>From 27 days to 6.</text>
            <text x={32} y={286} fontSize={21} fontWeight={800} fill={SC.muted}>Half the work, a seventh of the waiting.</text>
            <text x={32} y={320} fontSize={21} fontWeight={800} fill={SC.muted}>Then map it again in six months.</text>
          </g>
        )}
      </g>
    </svg>
  );
}
