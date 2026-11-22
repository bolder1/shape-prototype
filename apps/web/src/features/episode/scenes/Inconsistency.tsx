'use client';
// Scene for ds.1-3: five screens, each with its own primary button; the buttons are cut out and lined up, an inventory
// counts the debt, the costs appear, and five buttons collapse into one primary and one secondary. Pure function of t (0–34).
import { CopyIcon, HammerIcon, WrenchIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
/** Five primary buttons that drifted: fill, corner radius, width, weight. */
const DRIFT = [
  { screen: 'Home', fill: '#2563eb', r: 8, w: 130, wt: 600, note: '' },
  { screen: 'Cart', fill: '#2563eb', r: 3, w: 130, wt: 600, note: 'radius 3' },
  { screen: 'Profile', fill: '#3b6fe0', r: 8, w: 130, wt: 600, note: '#3B6FE0' },
  { screen: 'Settings', fill: '#2563eb', r: 21, w: 120, wt: 600, note: 'pill' },
  { screen: 'Checkout', fill: '#1d4ed8', r: 8, w: 110, wt: 800, note: 'bold, darker' },
];

function Btn({ x, y, d, s = 1, label = 'Continue' }: { x: number; y: number; d: (typeof DRIFT)[number]; s?: number; label?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-d.w / 2} y={-21} width={d.w} height={42} rx={d.r} fill={d.fill} />
      <text y={5} textAnchor="middle" fontSize={15} fontWeight={d.wt} fill="#fff">{label}</text>
    </g>
  );
}

export function InconsistencyScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const lift = p(t, 6.2, 7.6);   // buttons leave their screens and line up
  const merge = p(t, 24.4, 25.8);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: five slightly different buttons found in an audit, then reduced to two">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {/* the screens */}
        {t < 12.4 && DRIFT.map((d, i) => {
          const x = 120 + i * 180;
          return (
            <g key={d.screen} opacity={(1 - lift * 0.7) * (1 - p(t, 11.8, 12.4))} transform={`translate(0 ${(1 - clamp(back((t - i * 0.2) / 0.5))) * 40})`}>
              <rect x={x - 80} y={110} width={160} height={260} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text x={x} y={142} textAnchor="middle" fontSize={14} fontWeight={800} fill={SC.muted}>{d.screen}</text>
              {[0, 1, 2].map(r => <rect key={r} x={x - 60} y={164 + r * 22} width={r === 2 ? 70 : 120} height={8} rx={4} fill={SC.line} />)}
            </g>
          );
        })}
        {t < 24.6 && DRIFT.map((d, i) => {
          const x0 = 120 + i * 180, y0 = 330, y1 = 260;
          return (
            <g key={d.screen} opacity={1 - p(t, 24, 24.6)}>
              <Btn x={x0} y={lerp(y0, y1, lift)} d={d} s={lerp(0.8, 1.15, lift) * clamp(back((t - i * 0.2) / 0.5))} />
              {t >= 7.8 && d.note && <text x={x0} y={y1 + 52} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.error} opacity={clamp((t - 8 - i * 0.3) / 0.4)}>{d.note}</text>}
              {t >= 7.8 && !d.note && <text x={x0} y={y1 + 52} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.mint} opacity={clamp((t - 8) / 0.4)}>the system one</text>}
            </g>
          );
        })}

        {/* the tally */}
        {t >= 12 && t < 24.4 && (
          <g opacity={clamp((t - 12) / 0.5) * (1 - p(t, 23.8, 24.4))}>
            {[{ n: 'primary buttons', v: 5 }, { n: 'greys', v: 9 }, { n: 'corner radii', v: 4 }].map((c, i) => (
              <g key={c.n} transform={`translate(${240 + i * 240} 130)`}>
                <text textAnchor="middle" fontSize={44} fontWeight={900} fill={SC.error}>{Math.min(c.v, Math.floor(clamp((t - 12.4 - i * 0.4) / 1.2) * c.v + 0.5))}</text>
                <text y={28} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.text}>{c.n}</text>
              </g>
            ))}
            {t >= 18 && [{ icon: CopyIcon, l: 'New screens copy a random one' }, { icon: HammerIcon, l: 'The same button built five times' }, { icon: WrenchIcon, l: 'Fixes miss the copies' }].map((c, i) => {
              const Icon = c.icon;
              return (
                <g key={c.l} transform={`translate(${170 + i * 310} 400) scale(${clamp(back((t - 18.2 - i * 0.5) / 0.5))})`}>
                  <rect x={-140} y={-30} width={280} height={60} rx={16} fill={SC.surface} stroke={SC.error} strokeWidth={2} />
                  <Icon x={-126} y={-14} width={28} height={28} color={SC.error} weight="duotone" />
                  <text x={-90} y={5} fontSize={14} fontWeight={800} fill={SC.text}>{c.l}</text>
                </g>
              );
            })}
          </g>
        )}

        {/* five become two */}
        {t >= 24 && t < 29.4 && (
          <g opacity={clamp((t - 24) / 0.4)}>
            {DRIFT.map((d, i) => merge < 1 && <Btn key={d.screen} x={lerp(120 + i * 180, 380, merge)} y={260} d={d} s={1.15} />)}
            {merge >= 1 && (
              <g>
                <Btn x={380} y={260} d={DRIFT[0]} s={1.3} label="Primary" />
                <g transform="translate(580 260) scale(1.3)">
                  <rect x={-65} y={-21} width={130} height={42} rx={8} fill={SC.surface} stroke="#2563eb" strokeWidth={2} />
                  <text y={5} textAnchor="middle" fontSize={15} fontWeight={600} fill={SC.discover}>Secondary</text>
                </g>
                <text x={480} y={360} textAnchor="middle" fontSize={17} fontWeight={800} fill={SC.mint}>Five became two. Every screen uses them.</text>
              </g>
            )}
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Inventory', l: 'Every variant, side by side', c: SC.discover }, { x: 480, n: 'Agree one', l: 'Then replace the rest', c: SC.design }, { x: 760, n: 'Protect it', l: 'Components and tokens', c: SC.mint }].map((f, i) => {
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
