'use client';
// Scene for ds.4-1: Rasta's design team has grown to 38 designers in nine squads, and every request still goes to
// Kavya's core team of four. The queue reaches 61, four squads build their own date pickers. Centralised (one queue),
// federated (everyone publishes, nobody owns it) and hybrid (a core and a reviewed path) are drawn on the same ring of
// squads; then requests are routed by need into four boxes (`contributionPath`), the path is laid out, and the queue
// falls. Pure function of t (0–36).
import { CONTRIBUTION_PATHS, RASTA_REQUESTS, contributionPath, type ContributionPath, type RastaRequest } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
const CX = 320, CY = 210;
/** One fill per path; white text on each passes 4.5:1. */
export const PATH_FILL: Record<ContributionPath, string> = { reuse: '#175CD3', local: '#475467', contribute: '#067647', core: '#6941C6' };
export const PATH_LABEL: Record<ContributionPath, string> = { reuse: 'Reuse', local: 'Keep local', contribute: 'Contribute', core: 'Core builds' };
const SQUADS = ['Bus', 'Metro', 'Rail', 'Pay', 'B2B', 'Help', 'Join', 'Grow', 'Fleet'];
const ring = (i: number, r = 128) => {
  const a = -Math.PI / 2 + (i / SQUADS.length) * Math.PI * 2;
  return { x: CX + Math.cos(a) * r * 1.65, y: CY + Math.sin(a) * r * 0.82 };
};

/** A small calendar: the date picker four squads each built. */
function Cal({ x, y, s = 1, o = 1 }: { x: number; y: number; s?: number; o?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <rect x={-16} y={-14} width={32} height={30} rx={4} fill={SC.surface} stroke={SC.text} strokeWidth={2} />
      <rect x={-16} y={-14} width={32} height={8} rx={2} fill={SC.error} />
      {[0, 1, 2].map(r => [0, 1, 2].map(c => <rect key={`${r}${c}`} x={-11 + c * 8} y={-2 + r * 6} width={5} height={4} fill={SC.muted} />))}
    </g>
  );
}

function Squad({ i, o = 1, hot = false }: { i: number; o?: number; hot?: boolean }) {
  const { x, y } = ring(i);
  return (
    <g opacity={o}>
      <rect x={x - 36} y={y - 17} width={72} height={34} rx={17} fill={SC.surface} stroke={hot ? SC.brand : SC.line} strokeWidth={hot ? 3 : 2} />
      <text x={x} y={y + 8} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="middle">{SQUADS[i]}</text>
    </g>
  );
}

const ROUTED = Object.keys(RASTA_REQUESTS) as RastaRequest[];
const SHORT: Record<RastaRequest, string> = {
  datePicker: 'Date picker', qrTicket: 'QR ticket', dangerTertiary: 'Danger btn', focusRing: 'Focus fix', snackbar: 'Snackbar',
  stepper: 'Stepper', fareTable: 'Data table', tabBadge: 'Tab badge', routeSheet: 'Slide-up', stopPin: 'Map pins', pongal: 'Pongal',
};

export function ContributionModelsScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'Sixty-one requests' : t < 11 ? 'Everything through one team' : t < 16 ? 'Everyone publishes' : t < 21 ? 'A core and a path' : t < 26 ? 'Route by need' : t < 31 ? 'Cheaper than going around' : 'Two weeks, not fourteen';
  const ringOn = t >= 6 && t < 21;
  const ringIn = p(t, 6, 7);
  const queue = Math.round(t < 6 ? lerp(12, 61, p(t, 0.5, 4.5)) : lerp(61, 74, p(t, 7, 10.5)));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Rasta has 38 designers in nine squads, and every request goes to a core team of four. The queue grows to 61 and four squads build their own date pickers. With everything through one team the queue keeps growing. When every squad publishes directly, the library fills with duplicate tab bars nobody owns. A hybrid keeps a core team that owns foundations and reviews contributions from squads. Requests are routed four ways: reuse what exists, keep one-squad needs local, have squads contribute fixes and shared variants, and have the core team build new components three or more squads need. A short template, weekly office hours and a five-day review make the path cheaper than going around. A quarter later the queue is 18 and the median wait is two weeks.">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            <rect x={40} y={74} width={250} height={262} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            <text x={60} y={106} fontSize={21} fontWeight={800} fill={SC.muted}>Core team queue</text>
            {Array.from({ length: 7 }, (_, i) => (
              <rect key={i} x={60} y={122 + i * 22} width={210} height={16} rx={5} fill={i < 3 ? SC.error : SC.line} opacity={p(t, 0.3 + i * 0.3, 0.8 + i * 0.3) * (i < 3 ? 0.55 : 1)} />
            ))}
            <text x={60} y={316} fontSize={34} fontWeight={900} fill={SC.text}>{queue}</text>
            <text x={120} y={316} fontSize={21} fontWeight={700} fill={SC.muted}>oldest 14 wks</text>
            <text x={330} y={106} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 2.5, 3.2)}>Meanwhile, in four squads</text>
            {['Bus', 'Metro', 'B2B', 'Rail'].map((s, i) => (
              <g key={s} opacity={p(t, 2.8 + i * 0.5, 3.4 + i * 0.5)}>
                <Cal x={360 + (i % 2) * 140} y={160 + Math.floor(i / 2) * 90} s={1.3} />
                <text x={392 + (i % 2) * 140} y={168 + Math.floor(i / 2) * 90} fontSize={21} fontWeight={800} fill={SC.text}>{s}</text>
              </g>
            ))}
          </g>
        )}

        {ringOn && (
          <g opacity={ringIn}>
            {SQUADS.map((_, i) => {
              const s = ring(i), e = ring(i, 52);
              const fed = t >= 11 && t < 16;
              const hyb = t >= 16;
              const k = fed ? p(t, 11.2, 12) : hyb ? p(t, 16.2, 17) : p(t, 6.4 + i * 0.1, 7.2 + i * 0.1);
              const ex = fed ? lerp(s.x, CX + (i - 4) * 18, k) : lerp(s.x, e.x, k);
              const ey = fed ? lerp(s.y, CY, k) : lerp(s.y, e.y, k);
              return <line key={i} x1={s.x} y1={s.y} x2={ex} y2={ey} stroke={hyb && i % 3 === 0 ? SC.mint : SC.muted} strokeWidth={hyb ? 3 : 2} strokeDasharray={fed ? '0' : hyb ? '0' : '6 4'} />;
            })}
            {SQUADS.map((_, i) => <Squad key={i} i={i} />)}
            {t < 11 && (
              <g>
                <circle cx={CX} cy={CY} r={48} fill={SC.surface} stroke={SC.text} strokeWidth={3} />
                <text x={CX} y={CY - 4} fontSize={21} fontWeight={900} fill={SC.text} textAnchor="middle">Core</text>
                <text x={CX} y={CY + 22} fontSize={21} fontWeight={800} fill={SC.error} textAnchor="middle">{queue}</text>
              </g>
            )}
            {t >= 11 && t < 16 && (
              <g opacity={p(t, 11.6, 12.4)}>
                <rect x={CX - 140} y={CY - 34} width={280} height={68} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={CX} y={CY - 6} fontSize={21} fontWeight={900} fill={SC.text} textAnchor="middle">Library</text>
                <text x={CX} y={CY + 22} fontSize={21} fontWeight={800} fill={SC.error} textAnchor="middle" opacity={p(t, 13, 13.6)}>Tab bar ×3 · owner: ?</text>
              </g>
            )}
            {t >= 16 && (
              <g opacity={p(t, 16.2, 17)}>
                <circle cx={CX} cy={CY} r={58} fill={SC.surface} stroke={SC.brand} strokeWidth={4} />
                <text x={CX} y={CY - 6} fontSize={21} fontWeight={900} fill={SC.text} textAnchor="middle">Core</text>
                <text x={CX} y={CY + 20} fontSize={21} fontWeight={700} fill={SC.muted} textAnchor="middle">+ review</text>
                <text x={W - 32} y={44} fontSize={21} fontWeight={800} fill={SC.mint} textAnchor="end" opacity={p(t, 17.5, 18.2)}>— contributions</text>
              </g>
            )}
          </g>
        )}

        {t >= 21 && t < 26 && (
          <g>
            {CONTRIBUTION_PATHS.map((path, i) => {
              const x = 24 + i * 152;
              const mine = ROUTED.filter(k => contributionPath(RASTA_REQUESTS[k]) === path);
              return (
                <g key={path} opacity={p(t, 21.2 + i * 0.25, 21.8 + i * 0.25)}>
                  <rect x={x} y={70} width={140} height={270} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                  <rect x={x} y={70} width={140} height={40} rx={12} fill={PATH_FILL[path]} />
                  <rect x={x} y={96} width={140} height={14} fill={PATH_FILL[path]} />
                  <text x={x + 70} y={98} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle">{PATH_LABEL[path]}</text>
                  {mine.map((k, j) => {
                    const at = 22.4 + ROUTED.indexOf(k) * 0.28;
                    const k2 = p(t, at, at + 0.5);
                    return (
                      <g key={k} opacity={k2} transform={`translate(0 ${(1 - k2) * -30})`}>
                        <rect x={x + 4} y={122 + j * 50} width={132} height={42} rx={8} fill={SC.soft} />
                        <text x={x + 70} y={150 + j * 50} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="middle">{SHORT[k]}</text>
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g>
            {['Propose', 'Review', 'Build', 'Docs', 'Release'].map((s, i) => {
              const x = 24 + i * 120;
              return (
                <g key={s} opacity={p(t, 26.2 + i * 0.4, 26.8 + i * 0.4)}>
                  <rect x={x} y={120} width={108} height={70} rx={12} fill={SC.surface} stroke={i === 1 ? SC.brand : SC.line} strokeWidth={i === 1 ? 3 : 2} />
                  <text x={x + 54} y={162} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="middle">{s}</text>
                  {i < 4 && <path d={`M${x + 110} 155 l8 0`} stroke={SC.muted} strokeWidth={3} />}
                </g>
              );
            })}
            <text x={24} y={230} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 28.2, 28.8)}>Propose in 10 minutes · reply in 5 days</text>
            <text x={24} y={266} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 28.8, 29.4)}>Build in the system, paired · office hours Thu</text>
            <text x={24} y={302} fontSize={21} fontWeight={800} fill={SC.mint} opacity={p(t, 29.4, 30)}>Your name in the release notes</text>
          </g>
        )}

        {t >= 31 && (() => {
          const k = p(t, 31.4, 33.6);
          const stats = [
            { v: Math.round(lerp(61, 18, k)), u: 'open requests' },
            { v: Math.round(lerp(14, 2, k)), u: 'weeks to wait' },
            { v: Math.round(lerp(0, 11, k)), u: 'from squads' },
          ];
          return (
            <g>
              {stats.map((s, i) => (
                <g key={s.u}>
                  <rect x={24 + i * 202} y={110} width={188} height={170} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                  <text x={118 + i * 202} y={202} fontSize={64} fontWeight={900} fill={SC.text} textAnchor="middle">{s.v}</text>
                  <text x={118 + i * 202} y={246} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="middle">{s.u}</text>
                </g>
              ))}
            </g>
          );
        })()}
      </g>
    </svg>
  );
}
