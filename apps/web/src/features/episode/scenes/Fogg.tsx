'use client';
// Scene for gr.1-3: the Fogg behaviour model as a chart (ability across, motivation up, the action line curving between).
// A savings behaviour sits below the line until setup gets easier; a forgotten habit sits above it until a prompt
// arrives; then the Hook loop turns. Pure function of t (0–34).
import { LightningIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
const X0 = 110, X1 = 590, Y0 = 440, Y1 = 90;
/** Chart position for motivation and ability on 1–9 scales. Shared with the What's missing? game. */
export const foggXY = (m: number, a: number) => [X0 + ((a - 1) / 8) * (X1 - X0), Y0 - ((m - 1) / 8) * (Y0 - Y1)] as const;
/** The action line: motivation × ability = 25. */
export const ACTION_LINE = Array.from({ length: 40 }, (_, i) => { const a = 25 / 9 + i * ((9 - 25 / 9) / 39); const [x, y] = foggXY(25 / a, a); return `${i ? 'L' : 'M'}${x} ${y}`; }).join(' ');

export function FoggChart({ children }: { children?: React.ReactNode }) {
  return (
    <g>
      <line x1={X0} y1={Y0} x2={X1} y2={Y0} stroke={SC.muted} strokeWidth={2} />
      <line x1={X0} y1={Y0} x2={X0} y2={Y1} stroke={SC.muted} strokeWidth={2} />
      <text x={(X0 + X1) / 2} y={Y0 + 34} textAnchor="middle" fontSize={14} fontWeight={800} fill={SC.muted}>Ability: hard → easy</text>
      <text x={X0 - 40} y={(Y0 + Y1) / 2} textAnchor="middle" fontSize={14} fontWeight={800} fill={SC.muted} transform={`rotate(-90 ${X0 - 40} ${(Y0 + Y1) / 2})`}>Motivation: low → high</text>
      <path d={ACTION_LINE} stroke={SC.discover} strokeWidth={3} fill="none" />
      <text x={X1 - 10} y={foggXY(25 / 9, 9)[1] - 14} textAnchor="end" fontSize={12} fontWeight={800} fill={SC.discover}>Action line</text>
      <text x={X0 + 24} y={Y0 - 16} fontSize={12} fontWeight={700} fill={SC.muted}>Prompts fail here</text>
      <text x={X1 - 20} y={foggXY(4.5, 9)[1]} textAnchor="end" fontSize={12} fontWeight={700} fill={SC.muted}>Prompts work here</text>
      {children}
    </g>
  );
}

const HOOK = ['Trigger', 'Action', 'Variable reward', 'Investment'];

export function FoggScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const chart = t < 23.4;
  const easier = p(t, 12.6, 14);
  const [sx, sy] = foggXY(8, lerp(2, 8, easier));
  const [fx, fy] = foggXY(7, 6.5);
  const bolt = p(t, 19, 19.8);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: the Fogg behaviour model and the Hook loop">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {chart && (
          <g opacity={clamp(t / 0.5) * (1 - p(t, 22.8, 23.4))}>
            <FoggChart />
            {/* B = MAP */}
            <g transform="translate(780 140)" opacity={clamp((t - 0.6) / 0.5)}>
              <text textAnchor="middle" fontSize={34} fontWeight={900} fill={SC.text}>B = MAP</text>
              {['Motivation', 'Ability', 'Prompt'].map((n, i) => <text key={n} y={40 + i * 26} textAnchor="middle" fontSize={15} fontWeight={800} fill={[SC.design, SC.grow, SC.build][i]}>{n}</text>)}
            </g>
            {/* the savings dot */}
            {t >= 6.4 && t < 18 && (
              <g opacity={clamp((t - 6.4) / 0.4)}>
                <circle cx={sx} cy={sy} r={14} fill={easier > 0.9 ? SC.mint : SC.error} />
                <text x={sx + 22} y={sy + 5} fontSize={13} fontWeight={800} fill={SC.text}>{easier > 0.9 ? 'Save in one tap' : 'Set up savings: 9 screens'}</text>
                {t >= 14.2 && <text x={780} y={330} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.mint}>Easier moved it above the line</text>}
              </g>
            )}
            {/* the forgotten habit */}
            {t >= 18 && (
              <g opacity={clamp((t - 18) / 0.4)}>
                <circle cx={fx} cy={fy} r={14} fill={bolt > 0.9 ? SC.mint : SC.design} />
                <text x={fx + 22} y={fy + 5} fontSize={13} fontWeight={800} fill={SC.text}>Log a workout</text>
                <g transform={`translate(${lerp(fx + 140, fx, bolt)} ${lerp(fy - 120, fy - 30, bolt)})`} opacity={bolt < 1 ? 1 : 1 - p(t, 20.4, 21)}>
                  <LightningIcon x={-14} y={-14} width={28} height={28} color={SC.build} weight="fill" />
                </g>
                <text x={780} y={330} textAnchor="middle" fontSize={15} fontWeight={800} fill={bolt > 0.9 ? SC.mint : SC.muted}>{bolt > 0.9 ? 'Prompt + above the line = action' : 'Wants to, can… forgets'}</text>
              </g>
            )}
          </g>
        )}

        {/* the hook loop */}
        {t >= 23 && t < 29.4 && (
          <g opacity={clamp((t - 23) / 0.5)}>
            <circle cx={480} cy={280} r={170} fill="none" stroke={SC.line} strokeWidth={4} strokeDasharray="10 8" />
            {HOOK.map((n, i) => {
              const a = (-90 + i * 90) * Math.PI / 180, x = 480 + Math.cos(a) * 170, y = 280 + Math.sin(a) * 170;
              const on = Math.floor((t - 23.4) / 1.1) % 4 === i;
              return (
                <g key={n} transform={`translate(${x} ${y}) scale(${clamp(back((t - 23.2 - i * 0.25) / 0.4)) * (on ? 1.08 : 1)})`}>
                  <rect x={-80} y={-24} width={160} height={48} rx={24} fill={on ? SC.discover : SC.surface} stroke={SC.discover} strokeWidth={2} />
                  <text y={6} textAnchor="middle" fontSize={15} fontWeight={800} fill={on ? '#fff' : SC.text}>{n}</text>
                </g>
              );
            })}
            <text x={480} y={286} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.muted}>The Hook loop</text>
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'B = MAP', l: 'All three, same moment', c: SC.discover }, { x: 480, n: 'Easier beats louder', l: 'Raise ability first', c: SC.design }, { x: 760, n: 'Use it fairly', l: 'Habits users would thank you for', c: SC.mint }].map((f, i) => {
        const k = back((t - (29.2 + i * 0.25)) / 0.5);
        return (
          <g key={f.n} transform={`translate(${f.x} 260) scale(${clamp(k)})`}>
            <rect x={-125} y={-70} width={250} height={140} rx={18} fill={SC.surface} stroke={f.c} strokeWidth={3} />
            <text y={-8} textAnchor="middle" fontSize={22} fontWeight={800} fill={f.c}>{f.n}</text>
            <text y={26} textAnchor="middle" fontSize={13} fontWeight={600} fill={SC.text}>{f.l}</text>
          </g>
        );
      })}
    </svg>
  );
}
