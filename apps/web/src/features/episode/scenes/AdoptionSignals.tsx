'use client';
// Scene for ds.4-3: Kavya's "92% adoption" (repositories that install the package, `RASTA_REPOS`) taken apart. A code
// scan counts every instance as current, old, detached or local (`waffle` of all nine squads together); coverage and
// version lag tell different stories (`overallShare`, `currentShare`, Payments' `systemShare`); detaches turn out to be
// requests; a coverage OKR gets gamed; outcomes show what the system buys; and the report names one action per squad
// (`adoptionRead`). Pure function of t (0–36). Also exports `Waffle` and `SCAN_FILL`, which `adoption-read` uses.
import {
  RASTA_REPOS, RASTA_SCANS, SCAN_KINDS, currentShare, overallShare, systemShare, waffle, type ScanKind, type SquadScan,
} from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** Cell colours: live system components in blue (dark for the current major, light for the old one), detached in
 *  orange, the squad's own in grey. */
export const SCAN_FILL: Record<ScanKind, string> = { current: '#2a78d6', old: '#9ec5f4', detached: '#eb6834', local: '#b4b2ab' };
export const SCAN_LABEL: Record<ScanKind, string> = { current: 'System, current', old: 'System, old major', detached: 'Detached', local: 'Squad’s own' };

/** A 10 × 10 waffle of a scan at (x, y), `size` wide. `shown`: how many cells have appeared (0–100). */
export function Waffle({ s, x, y, size, shown = 100 }: { s: SquadScan; x: number; y: number; size: number; shown?: number }) {
  const c = size / 10, g = Math.max(1.5, c * 0.12);
  return (
    <g>
      {waffle(s).map((k, i) => (
        <rect key={i} x={x + (i % 10) * c} y={y + Math.floor(i / 10) * c} width={c - g} height={c - g} rx={c * 0.18} fill={SCAN_FILL[k]} opacity={i < shown ? 1 : 0.08} />
      ))}
    </g>
  );
}

const ALL = Object.values(RASTA_SCANS);
const TOTAL: SquadScan = { squad: 'All squads', text: 'All squads', ...Object.fromEntries(SCAN_KINDS.map(k => [k, ALL.reduce((a, s) => a + s[k], 0)])) as Record<ScanKind, number> };
const pct = (x: number) => `${Math.round(x * 100)}%`;
const ACTIONS = [
  { squad: 'Payments', read: 'Stale', act: 'Migration pairing day' },
  { squad: 'Business', read: 'Detaching', act: 'Add a row slot to Card' },
  { squad: 'Metro', read: 'Bypassing', act: 'Office hours + audit' },
  { squad: 'Rail', read: 'Bypassing', act: 'Onboarding session' },
];

export function AdoptionSignalsScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? '“92% adoption”' : t < 11 ? 'Count what’s on screen' : t < 16 ? 'Coverage, then lag' : t < 21 ? 'Detaching is a message' : t < 26 ? 'Goodhart’s trap' : t < 31 ? 'Measure what it buys' : 'One action per squad';
  const installed = RASTA_REPOS.installed / RASTA_REPOS.total;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: a slide says 92% adoption, because ${RASTA_REPOS.installed} of ${RASTA_REPOS.total} repositories install the package. A code scan counts 5,500 component instances across nine squads, sorted into current system components, old-major system components, detached ones and squads' own. ${pct(overallShare(ALL))} are live system components, but only ${pct(currentShare(ALL))} are on the current major; Payments has ${pct(systemShare(RASTA_SCANS.payments))} coverage, mostly on the old version. Rasta for Business detaches over a third of what it takes, because the Card can't hold a table row. When coverage becomes an OKR, a squad wraps its own components in a system Box and the number jumps while delivery time stays flat. Screens built from the system ship in 3 days instead of 8, with 70% fewer accessibility defects and one QA round instead of three. The report names one action per squad.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            <text x={32} y={170} fontSize={96} fontWeight={900} fill={SC.text} opacity={p(t, 0.3, 1)}>{pct(installed * p(t, 0.3, 2))}</text>
            <text x={32} y={214} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 1.2, 1.8)}>{RASTA_REPOS.installed} of {RASTA_REPOS.total} repos</text>
            <text x={32} y={244} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 1.2, 1.8)}>install @rasta/ui</text>
            {Array.from({ length: RASTA_REPOS.total }, (_, i) => (
              <g key={i} opacity={p(t, 1.6 + i * 0.12, 2 + i * 0.12)}>
                <rect x={360 + (i % 4) * 64} y={84 + Math.floor(i / 4) * 70} width={52} height={56} rx={8} fill={i < RASTA_REPOS.installed ? SC.surface : SC.soft} stroke={i < RASTA_REPOS.installed ? SC.brand : SC.line} strokeWidth={2} strokeDasharray={i < RASTA_REPOS.installed ? '0' : '5 4'} />
                {i < RASTA_REPOS.installed && <path d={`M${374 + (i % 4) * 64} ${112 + Math.floor(i / 4) * 70} l8 8 l14 -16`} fill="none" stroke={SC.brand} strokeWidth={3} />}
              </g>
            ))}
            <text x={32} y={300} fontSize={21} fontWeight={800} fill={SC.error} opacity={p(t, 3.6, 4.3)}>Installed isn’t used. And used isn’t on screen.</text>
          </g>
        )}

        {t >= 6 && t < 16 && (
          <g>
            <Waffle s={t >= 13 ? RASTA_SCANS.payments : TOTAL} x={32} y={70} size={260} shown={t >= 13 ? 100 : Math.round(lerp(0, 100, p(t, 6.3, 8.5)))} />
            {t < 11 && SCAN_KINDS.map((k, i) => (
              <g key={k} opacity={p(t, 8 + i * 0.4, 8.5 + i * 0.4)}>
                <rect x={330} y={96 + i * 52} width={26} height={26} rx={5} fill={SCAN_FILL[k]} />
                <text x={368} y={117 + i * 52} fontSize={21} fontWeight={800} fill={SC.text}>{SCAN_LABEL[k]}</text>
              </g>
            ))}
            {t < 11 && <text x={330} y={318} fontSize={21} fontWeight={700} fill={SC.muted} opacity={p(t, 9.6, 10.2)}>5,500 instances, 9 squads</text>}
            {t >= 11 && (() => {
              const rows = t < 13
                ? [{ l: 'Repos installed', v: installed, c: SC.line }, { l: 'Live in system', v: overallShare(ALL), c: SCAN_FILL.current }, { l: 'On current major', v: currentShare(ALL), c: SCAN_FILL.current }]
                : [{ l: 'Payments coverage', v: systemShare(RASTA_SCANS.payments), c: SCAN_FILL.current }, { l: 'Of that, on v2', v: RASTA_SCANS.payments.old / (RASTA_SCANS.payments.old + RASTA_SCANS.payments.current), c: SCAN_FILL.old }];
              return rows.map((r, i) => {
                const k = p(t, (t < 13 ? 11.2 : 13.2) + i * 0.5, (t < 13 ? 11.8 : 13.8) + i * 0.5);
                return (
                  <g key={r.l}>
                    <text x={330} y={96 + i * 80} fontSize={21} fontWeight={800} fill={SC.text}>{r.l}</text>
                    <rect x={330} y={108 + i * 80} width={280} height={26} rx={6} fill={SC.surface} />
                    <rect x={330} y={108 + i * 80} width={280 * r.v * k} height={26} rx={6} fill={r.c} />
                    <text x={606} y={96 + i * 80} fontSize={22} fontWeight={900} fill={SC.text} textAnchor="end">{pct(r.v * k)}</text>
                  </g>
                );
              });
            })()}
          </g>
        )}

        {t >= 16 && t < 21 && (() => {
          const k = p(t, 16.8, 18.2);
          return (
            <g>
              {[0, 1, 2].map(i => {
                const dx = i === 2 ? lerp(0, 230, k) : 0, dy = i === 2 ? lerp(0, 16, k) : 0;
                return (
                  <g key={i} transform={`translate(${32 + i * 12 + dx} ${80 + i * 12 + dy})`}>
                    <rect width={220} height={150} rx={12} fill={SC.surface} stroke={i === 2 && k > 0.5 ? SCAN_FILL.detached : SC.line} strokeWidth={i === 2 && k > 0.5 ? 3 : 2} />
                    <rect x={16} y={18} width={120} height={16} rx={4} fill={SC.text} opacity={0.8} />
                    <rect x={16} y={46} width={180} height={10} rx={4} fill={SC.line} />
                    <rect x={16} y={66} width={150} height={10} rx={4} fill={SC.line} />
                    {i === 2 && <g opacity={p(t, 18, 18.6)}><rect x={16} y={92} width={188} height={36} rx={6} fill={SC.soft} stroke={SCAN_FILL.detached} strokeWidth={2} /><text x={28} y={117} fontSize={21} fontWeight={800} fill={SC.text}>Row · ₹ · ⋯</text></g>}
                  </g>
                );
              })}
              <text x={32} y={300} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 18.6, 19.2)}>Business detaches 37% of what it takes.</text>
              <text x={32} y={332} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 19.2, 19.8)}>Every copy adds the same row: a missing slot.</text>
            </g>
          );
        })()}

        {t >= 21 && t < 26 && (() => {
          const k = p(t, 22.2, 24);
          return (
            <g>
              <g opacity={p(t, 21.2, 21.8)}>
                <rect x={32} y={80} width={240} height={120} rx={12} fill="none" stroke={SCAN_FILL.current} strokeWidth={3} strokeDasharray="8 5" opacity={p(t, 22, 22.6)} />
                <text x={44} y={104} fontSize={21} fontWeight={800} fill={SCAN_FILL.current} opacity={p(t, 22, 22.6)}>{'<Box>'}</text>
                <rect x={56} y={116} width={192} height={68} rx={10} fill={SCAN_FILL.local} />
                <text x={152} y={158} fontSize={21} fontWeight={800} fill="#101828" textAnchor="middle">OurCard</text>
              </g>
              <text x={320} y={110} fontSize={21} fontWeight={800} fill={SC.muted}>Coverage</text>
              <text x={320} y={170} fontSize={56} fontWeight={900} fill={SC.text}>{Math.round(lerp(68, 84, k))}%</text>
              <text x={320} y={232} fontSize={21} fontWeight={800} fill={SC.muted}>Design to ship</text>
              <text x={320} y={286} fontSize={44} fontWeight={900} fill={SC.text}>8 days</text>
              <text x={32} y={330} fontSize={21} fontWeight={800} fill={SC.error} opacity={p(t, 24.2, 24.8)}>The number moved. Nothing else did.</text>
            </g>
          );
        })()}

        {t >= 26 && t < 31 && (
          <g>
            {[{ l: 'Days, design to ship', a: 8, b: 3 }, { l: 'A11y defects per release', a: 20, b: 6 }, { l: 'Design QA rounds', a: 3, b: 1 }].map((r, i) => {
              const k = p(t, 26.3 + i * 0.7, 27.2 + i * 0.7), max = Math.max(r.a, r.b);
              return (
                <g key={r.l} opacity={p(t, 26.2 + i * 0.7, 26.7 + i * 0.7)}>
                  <text x={32} y={88 + i * 92} fontSize={21} fontWeight={800} fill={SC.text}>{r.l}</text>
                  <rect x={32} y={100 + i * 92} width={(r.a / max) * 420} height={20} rx={5} fill={SCAN_FILL.local} />
                  <text x={462} y={117 + i * 92} fontSize={21} fontWeight={800} fill={SC.muted}>{r.a} without</text>
                  <rect x={32} y={124 + i * 92} width={(r.b / max) * 420 * k} height={20} rx={5} fill={SCAN_FILL.current} />
                  <text x={462} y={141 + i * 92} fontSize={21} fontWeight={900} fill={SC.text}>{r.b} with</text>
                </g>
              );
            })}
          </g>
        )}

        {t >= 31 && (
          <g>
            {ACTIONS.map((a, i) => (
              <g key={a.squad} opacity={p(t, 31.3 + i * 0.5, 31.8 + i * 0.5)}>
                <rect x={32} y={70 + i * 68} width={576} height={58} rx={10} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={50} y={107 + i * 68} fontSize={21} fontWeight={900} fill={SC.text}>{a.squad}</text>
                <text x={186} y={107 + i * 68} fontSize={21} fontWeight={800} fill={SC.muted}>{a.read}</text>
                <text x={590} y={107 + i * 68} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="end">{a.act}</text>
              </g>
            ))}
          </g>
        )}
      </g>
    </svg>
  );
}
