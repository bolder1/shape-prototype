'use client';
// Scene for fd.1-4: one feature ("split the bill") through three roles. The PM sets the why and the metric, the designer
// draws the flow, the engineer builds it; a crunch forces a shared trade-off; it ends in three overlapping circles.
// Pure function of t (seconds, 0–34).
import { CheckIcon, ClockIcon, CodeIcon, PenNibIcon, ReceiptIcon, RocketLaunchIcon, ScissorsIcon, TargetIcon } from '@phosphor-icons/react/ssr';
import type { Icon } from '@phosphor-icons/react';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
const ROLES: { label: string; x: number; c: string; icon: Icon; on: [number, number] }[] = [
  { label: 'Product manager', x: 170, c: SC.discover, icon: TargetIcon, on: [5, 11] },
  { label: 'Designer', x: 480, c: SC.design, icon: PenNibIcon, on: [11, 17] },
  { label: 'Engineer', x: 790, c: SC.build, icon: CodeIcon, on: [17, 22] },
];
const PM_CHIPS = [{ tag: 'WHO', text: 'Groups of friends' }, { tag: 'WHY', text: 'Owing money gets awkward' }, { tag: 'GOAL', text: 'Paid back within a day' }];
const SCREENS = ['Add the bill', 'Pick friends', 'Request sent'];
const CODE = ['POST /api/split', 'payments table', 'UPI request', 'notify friends'];
const SAYS = ['What matters for v1?', 'The core flow first.', 'Animation can wait.'];

export function ProductTeamScene({ t }: { t: number }) {
  const crunch = t >= 22 && t < 28;
  const venn = p(t, 28, 29.4);
  const build = t < 18 ? 0 : t < 25.6 ? lerp(0, 0.8, p(t, 18, 21.5)) : lerp(0.8, 1, p(t, 25.8, 26.6));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a product manager, a designer and an engineer build one feature together">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />

      {/* ---- the idea ---- */}
      <g transform={`translate(${W / 2} ${lerp(-60, 70, back((t - 0.2) / 0.7))})`} opacity={1 - venn * 0.8}>
        <rect x={-120} y={-28} width={240} height={56} rx={16} fill={SC.surface} stroke={SC.text} strokeOpacity={0.25} strokeWidth={2} />
        <ReceiptIcon x={-104} y={-14} width={28} height={28} color={SC.mint} weight="duotone" />
        <text x={-68} y={-4} fontSize={16} fontWeight={800} fill={SC.text}>Split the bill</text>
        <text x={-68} y={15} fontSize={12} fill={SC.muted}>Help friends pay each other back</text>
      </g>

      {/* ---- the three people ---- */}
      {ROLES.map((r, i) => {
        const k = back((t - (1.2 + i * 0.3)) / 0.5);
        const spot = (t >= r.on[0] && t < r.on[1]) || crunch;
        const dim = t >= 5 && t < 22 && !spot ? 0.35 : 1;
        const bob = spot ? Math.abs(Math.sin(t * 5)) * -6 : 0;
        return t >= 1.2 && (
          <g key={r.label} transform={`translate(${r.x} ${430 + bob}) scale(${clamp(k)})`} opacity={dim * (1 - venn * 0.75)}>
            {spot && <ellipse cy={64} rx={70} ry={12} fill={r.c} opacity={0.3} />}
            <circle cy={-40} r={22} fill="#E8C9AE" />
            <rect x={-28} y={-16} width={56} height={70} rx={20} fill={r.c} />
            <g transform="translate(26 -58)"><circle r={16} fill={SC.surface} stroke={r.c} strokeWidth={2.5} /><r.icon x={-10} y={-10} width={20} height={20} color={r.c} weight="bold" /></g>
            <text y={84} textAnchor="middle" fontSize={14} fontWeight={800} fill={SC.text}>{r.label}</text>
            {crunch && t >= 24 + i * 0.5 && (
              <g transform={`translate(0 -96) scale(${back((t - (24 + i * 0.5)) / 0.4)})`}>
                <rect x={-92} y={-18} width={184} height={34} rx={12} fill={SC.surface} stroke={r.c} strokeWidth={2} />
                <text y={4} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={SC.text}>{SAYS[i]}</text>
              </g>
            )}
          </g>
        );
      })}

      {/* ---- PM: why, who, goal ---- */}
      {t >= 5.6 && (
        <g opacity={(t < 22 ? 1 : 0.15) * (1 - venn)}>
          {PM_CHIPS.map((c, i) => {
            const k = back((t - (5.8 + i * 1.3)) / 0.5);
            return t >= 5.8 + i * 1.3 && (
              <g key={c.tag} transform={`translate(${60 + (1 - clamp(k)) * -30} ${150 + i * 50})`} opacity={clamp(k)}>
                <rect width={250} height={38} rx={10} fill={SC.surface} stroke={SC.discover} strokeWidth={2} />
                <rect width={56} height={38} rx={10} fill={SC.discover} />
                <text x={28} y={24} textAnchor="middle" fontSize={11} fontWeight={800} fill="#fff">{c.tag}</text>
                <text x={66} y={24} fontSize={13} fontWeight={700} fill={SC.text}>{c.text}</text>
              </g>
            );
          })}
        </g>
      )}

      {/* ---- Designer: the flow ---- */}
      {t >= 11.4 && (
        <g opacity={(t < 22 ? 1 : 0.15) * (1 - venn)}>
          {SCREENS.map((s, i) => {
            const k = back((t - (11.6 + i * 1.4)) / 0.5);
            const x = 360 + i * 90;
            return t >= 11.6 + i * 1.4 && (
              <g key={s}>
                {i > 0 && <line x1={x - 52} x2={x - 38} y1={210} y2={210} stroke={SC.design} strokeWidth={3} opacity={clamp(k)} />}
                <g transform={`translate(${x} 210) scale(${clamp(k)})`}>
                  <rect x={-36} y={-58} width={72} height={116} rx={10} fill={SC.surface} stroke={SC.design} strokeWidth={2.5} />
                  <rect x={-24} y={-42} width={48} height={8} rx={4} fill={SC.design} opacity={0.5} />
                  <rect x={-24} y={-26} width={48} height={22} rx={5} fill={SC.soft} />
                  <rect x={-24} y={30} width={48} height={14} rx={7} fill={i === 2 ? SC.mint : SC.design} />
                  {i === 2 && <CheckIcon x={-10} y={-24} width={20} height={20} color={SC.mint} weight="bold" />}
                  <text y={76} textAnchor="middle" fontSize={11} fontWeight={700} fill={SC.muted}>{s}</text>
                </g>
              </g>
            );
          })}
        </g>
      )}

      {/* ---- Engineer: the build ---- */}
      {t >= 17.4 && (
        <g opacity={1 - venn}>
          {CODE.map((line, i) => {
            const k = clamp((t - (17.6 + i * 0.7)) / 0.4);
            return t >= 17.6 + i * 0.7 && (
              <g key={line} transform={`translate(${660 + (1 - k) * 30} ${145 + i * 34})`} opacity={k * (t < 22 ? 1 : 0.15)}>
                <rect width={240} height={28} rx={7} fill="#0F1730" />
                <text x={12} y={19} fontSize={12.5} fontWeight={600} fontFamily="ui-monospace, monospace" fill="#2BC08A">{'>'} <tspan fill="#E2E8F0">{line}</tspan></text>
              </g>
            );
          })}
          <g transform="translate(660 300)">
            <text y={-8} fontSize={12} fontWeight={700} fill={SC.muted}>Build {Math.round(build * 100)}%</text>
            <rect width={240} height={12} rx={6} fill={SC.line} />
            <rect width={240 * build} height={12} rx={6} fill={build >= 1 ? SC.mint : SC.build} />
          </g>
          {t >= 20.6 && (
            <g transform={`translate(780 340) scale(${back((t - 20.6) / 0.4)})`} opacity={1 - p(t, 21.6, 22.2)}>
              <rect x={-64} y={-15} width={128} height={30} rx={15} fill={SC.mint} />
              <text y={5} textAnchor="middle" fontSize={12.5} fontWeight={800} fill="#fff">Loads in 0.8 s</text>
            </g>
          )}
        </g>
      )}

      {/* ---- crunch: the animation that costs two weeks ---- */}
      {t >= 22 && t < 28.6 && (() => {
        const k = back((t - 22.2) / 0.5), cut = p(t, 25.6, 26.6);
        return (
          <g opacity={1 - p(t, 27.8, 28.6)}>
            <g transform={`translate(${W / 2} 200) scale(${clamp(k)})`}>
              <g transform={`translate(${-cut * 30} ${cut * 120}) rotate(${-cut * 20})`} opacity={1 - cut}>
                <rect x={-110} y={-30} width={110} height={60} rx="12" fill={SC.surface} stroke={SC.build} strokeWidth={2.5} strokeDasharray="6 4" />
                <text x={-55} y={5} textAnchor="middle" fontSize={12.5} fontWeight={800} fill={SC.text}>Confetti</text>
              </g>
              <g transform={`translate(${cut * 30} ${cut * 120}) rotate(${cut * 20})`} opacity={1 - cut}>
                <rect x={0} y={-30} width={110} height={60} rx="12" fill={SC.surface} stroke={SC.build} strokeWidth={2.5} strokeDasharray="6 4" />
                <text x={55} y={5} textAnchor="middle" fontSize={12.5} fontWeight={800} fill={SC.text}>animation</text>
              </g>
              {t < 25.6 && (
                <g transform="translate(0 -62)">
                  <ClockIcon x={-80} y={-13} width={26} height={26} color={SC.error} weight="bold" />
                  <text x={-48} y={6} fontSize={15} fontWeight={800} fill={SC.error}>+2 weeks?</text>
                </g>
              )}
              {t >= 25.2 && t < 26.6 && <ScissorsIcon x={-18} y={-18 + lerp(-40, 30, p(t, 25.2, 26))} width={36} height={36} color={SC.text} weight="bold" />}
            </g>
            {t >= 26.8 && (
              <g transform={`translate(${W / 2} 200) scale(${back((t - 26.8) / 0.5)})`}>
                <rect x={-90} y={-24} width={180} height={48} rx={24} fill={SC.mint} />
                <RocketLaunchIcon x={-74} y={-13} width={26} height={26} color="#fff" weight="fill" />
                <text x={12} y={6} textAnchor="middle" fontSize={16} fontWeight={800} fill="#fff">v1 shipped</text>
              </g>
            )}
          </g>
        );
      })()}

      {/* ---- finale: three circles that overlap ---- */}
      {venn > 0 && (
        <g transform={`translate(${W / 2} 290)`} opacity={venn}>
          {[{ dx: -78, dy: -40, c: SC.discover, label: 'Why & what' }, { dx: 78, dy: -40, c: SC.design, label: 'How it works' }, { dx: 0, dy: 70, c: SC.build, label: 'How it’s built' }].map((v, i) => {
            const k = back((t - (28.2 + i * 0.25)) / 0.6);
            return (
              <g key={v.label}>
                <circle cx={v.dx * clamp(k)} cy={v.dy * clamp(k)} r={118 * clamp(k)} fill={v.c} opacity={0.22} stroke={v.c} strokeWidth={3} />
                <text x={v.dx * 1.75} y={v.dy * 1.9 + (v.dy > 0 ? 18 : 0)} textAnchor="middle" fontSize={15} fontWeight={800} fill={v.c} opacity={p(t, 29.2, 29.8)}>{v.label}</text>
              </g>
            );
          })}
          <g opacity={p(t, 29.8, 30.6)}>
            <rect x={-70} y={-16} width={140} height={32} rx={16} fill={SC.surface} stroke={SC.mint} strokeWidth={2} />
            <text y={5} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.text}>Great product</text>
          </g>
        </g>
      )}
    </svg>
  );
}
