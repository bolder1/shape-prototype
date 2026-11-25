'use client';
// Scene for ax.3-3: Tenzin was Hazri's only accessibility reviewer, squads kept shipping barriers, and a Munich
// customer's request for an EN 301 549 conformance report stalled a deal. Then: where Hazri stands on the W3C draft
// maturity model (`MATURITY_STAGES`, `HAZRI_MATURITY`), an owner, policy and budget, accessibility built into the
// design and build process, a roadmap in dependency order (`HAZRI_PROGRAM`, `programLane`), and measures on the
// leadership dashboard. Pure function of t (0–36). Also exports `QUARTER_FILL`, which `program-road` uses.
import { HAZRI_MATURITY, HAZRI_PROGRAM, MATURITY_STAGES, PROGRAM_QUARTERS, QUARTER_LABEL, programLane, type HazriStep, type ProgramQuarter } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per quarter; white text on each passes 4.5:1. */
export const QUARTER_FILL: Record<ProgramQuarter, string> = { q1: '#B42318', q2: '#6941C6', q3: '#175CD3', q4: '#067647' };

const STEPS = Object.keys(HAZRI_PROGRAM) as HazriStep[];
/** Short names for `HAZRI_MATURITY`'s dimensions, in order, to fit the grid. */
const DIM_SHORT = ['Leadership', 'Skills', 'Process', 'Research', 'Procurement'];
/** A chip's width for its short name at 21px bold. */
export const chipWidth = (text: string) => text.length * 12 + 24;

export function MaturityRoadScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'One specialist, 30 reviews' : t < 11 ? 'The deal that slipped' : t < 16 ? 'Where Hazri stands' : t < 21 ? 'Owner, policy, budget' : t < 26 ? 'Build it into the system' : t < 31 ? 'In order' : 'Measure what matters';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Tenzin is Hazri's only accessibility reviewer, checking 30 pull requests a week, and squads still ship new barriers. Kranich Logistik, a Munich customer, asks for a conformance report against EN 301 549; nobody can write one and the deal slips a quarter. On the W3C draft maturity model, which runs ${MATURITY_STAGES.join(', ')}, Hazri stands at ${HAZRI_MATURITY.map(d => `${MATURITY_STAGES[d.now]} on ${d.dimension.toLowerCase()}`).join(', ')}. An accountable executive takes ownership with a budget and a policy: WCAG 2.2 AA for web and app, and no release with a known critical issue. Accessibility is built into components, handoff, the definition of done, CI and a manual pass, with a champion in every squad. The roadmap runs in dependency order: ${PROGRAM_QUARTERS.map(q => `${QUARTER_LABEL[q]}: ${STEPS.filter(k => programLane(k) === q).map(k => HAZRI_PROGRAM[k].short.toLowerCase()).join(', ')}`).join('; ')}. Critical issues shipped, time to fix and panel findings go on the leadership dashboard, and Kranich signs.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (() => {
          const n = Math.round(lerp(0, 30, p(t, 0.6, 4.6)));
          return (
            <g>
              {Array.from({ length: n }, (_, i) => (
                <rect key={i} x={32 + (i % 10) * 40} y={80 + Math.floor(i / 10) * 46} width={32} height={36} rx={6} fill={SC.surface} stroke={i % 7 === 3 ? SC.error : SC.line} strokeWidth={2} />
              ))}
              <g transform="translate(480 80)">
                <circle cx={64} cy={40} r={30} fill={SC.line} />
                <rect x={24} y={78} width={80} height={60} rx={20} fill={SC.line} />
                <text x={64} y={170} fontSize={21} fontWeight={900} fill={SC.text} textAnchor="middle">Tenzin</text>
              </g>
              <text x={32} y={262} fontSize={30} fontWeight={900} fill={SC.text}>{n}</text>
              <text x={84} y={260} fontSize={21} fontWeight={800} fill={SC.muted}>pull requests waiting this week</text>
              <text x={32} y={322} fontSize={21} fontWeight={800} fill={SC.error} opacity={p(t, 4, 4.6)}>And new barriers still ship every sprint.</text>
            </g>
          );
        })()}

        {t >= 6 && t < 11 && (
          <g>
            <g opacity={p(t, 6.2, 6.8)}>
              <rect x={32} y={70} width={576} height={170} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text x={56} y={106} fontSize={21} fontWeight={800} fill={SC.muted}>From: Procurement, Kranich Logistik</text>
              <text x={56} y={146} fontSize={21} fontWeight={900} fill={SC.text}>Please send your accessibility</text>
              <text x={56} y={176} fontSize={21} fontWeight={900} fill={SC.text}>conformance report for Hazri Admin,</text>
              <text x={56} y={206} fontSize={21} fontWeight={900} fill={SC.text}>against EN 301 549.</text>
            </g>
            <g opacity={p(t, 8, 8.6)}>
              <rect x={32} y={262} width={300} height={56} rx={28} fill={QUARTER_FILL.q1} />
              <text x={182} y={297} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle">Deal: next quarter</text>
            </g>
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g>
            {MATURITY_STAGES.map((s, i) => (
              <text key={s} x={252 + i * 100} y={84} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="middle" opacity={p(t, 11.2, 11.8)}>{s}</text>
            ))}
            {HAZRI_MATURITY.map((d, r) => (
              <g key={d.dimension} opacity={p(t, 11.6 + r * 0.4, 12.1 + r * 0.4)}>
                <text x={32} y={128 + r * 48} fontSize={21} fontWeight={800} fill={SC.text}>{DIM_SHORT[r]}</text>
                {MATURITY_STAGES.map((_, c) => (
                  <rect key={c} x={208 + c * 100} y={108 + r * 48} width={88} height={28} rx={8} fill={c <= d.now ? QUARTER_FILL.q1 : SC.surface} stroke={SC.line} strokeWidth={1.5} />
                ))}
              </g>
            ))}
          </g>
        )}

        {t >= 16 && t < 21 && (
          <g>
            {[['Owner', 'Chief product officer'], ['Budget', '₹1.2 crore this year'], ['Standard', 'WCAG 2.2 AA, web and app'], ['Rule', 'No release with a critical issue']].map(([a, b], i) => (
              <g key={a} opacity={p(t, 16.3 + i * 0.7, 16.9 + i * 0.7)}>
                <rect x={32} y={70 + i * 66} width={576} height={54} rx={12} fill={SC.surface} stroke={QUARTER_FILL.q2} strokeWidth={2} />
                <text x={52} y={104 + i * 66} fontSize={21} fontWeight={900} fill={QUARTER_FILL.q2}>{a}</text>
                <text x={588} y={104 + i * 66} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="end">{b}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 21 && t < 26 && (() => {
          const stages = ['Components', 'Annotations', 'Definition of done', 'CI checks', 'Manual pass'];
          const lit = Math.floor(lerp(0, stages.length + 0.99, p(t, 21.4, 24.4)));
          return (
            <g>
              {stages.map((s, i) => (
                <g key={s} opacity={p(t, 21.2 + i * 0.3, 21.6 + i * 0.3)}>
                  <rect x={32 + i * 52} y={66 + i * 48} width={300} height={40} rx={20} fill={i < lit ? QUARTER_FILL.q3 : SC.surface} stroke={i < lit ? 'none' : SC.line} strokeWidth={2} />
                  <text x={182 + i * 52} y={93 + i * 48} fontSize={21} fontWeight={800} fill={i < lit ? '#fff' : SC.text} textAnchor="middle">{s}</text>
                </g>
              ))}
              <text x={32} y={334} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 24.4, 25)}>A champion in every squad</text>
            </g>
          );
        })()}

        {t >= 26 && t < 31 && (
          <g>
            {PROGRAM_QUARTERS.map((q, r) => {
              let x = 32;
              return (
                <g key={q} opacity={p(t, 26.2 + r * 0.9, 26.8 + r * 0.9)}>
                  <text x={32} y={82 + r * 70} fontSize={21} fontWeight={900} fill={QUARTER_FILL[q]}>{QUARTER_LABEL[q]}</text>
                  {STEPS.filter(k => programLane(k) === q).map(k => {
                    const s = HAZRI_PROGRAM[k].short, w = chipWidth(s), cx = x;
                    x += w + 8;
                    return (
                      <g key={k}>
                        <rect x={cx} y={92 + r * 70} width={w} height={34} rx={17} fill={QUARTER_FILL[q]} />
                        <text x={cx + w / 2} y={116 + r * 70} fontSize={21} fontWeight={800} fill="#fff" textAnchor="middle">{s}</text>
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </g>
        )}

        {t >= 31 && (
          <g>
            {[['Critical issues shipped', `${Math.round(lerp(14, 0, p(t, 31.6, 33.6)))} a quarter`], ['Median time to fix', `${Math.round(lerp(95, 24, p(t, 31.8, 33.8)))} days`], ['Panel completes payroll', `${Math.round(lerp(40, 90, p(t, 32, 34)))}%`]].map(([a, b], i) => (
              <g key={a} opacity={p(t, 31.2 + i * 0.4, 31.7 + i * 0.4)}>
                <rect x={32} y={68 + i * 70} width={576} height={58} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={52} y={105 + i * 70} fontSize={21} fontWeight={800} fill={SC.text}>{a}</text>
                <text x={588} y={105 + i * 70} fontSize={24} fontWeight={900} fill={QUARTER_FILL.q4} textAnchor="end">{b}</text>
              </g>
            ))}
            <g opacity={p(t, 34.2, 34.8)}>
              <rect x={32} y={286} width={220} height={50} rx={25} fill={QUARTER_FILL.q4} />
              <text x={142} y={318} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle">Kranich signs</text>
            </g>
          </g>
        )}
      </g>
    </svg>
  );
}
