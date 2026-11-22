'use client';
// Scene for ui.3-2: one brand blue spreads into a 50–900 ramp, each zone gets a job, a neutral ramp joins underneath,
// and a card is built only from ramp steps. Pure function of t (0–34).
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
/** The blue ramp, 50 → 900. Shared with the Pick from the ramp game. */
export const BLUE = ['#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'];
/** A neutral ramp with a hint of blue. */
export const SLATE = ['#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155', '#1e293b', '#0f172a'];
/** Ramp zones and the step indexes they cover. */
export const ZONES = [
  { id: 'tint', n: 'Tint', job: 'backgrounds', from: 0, to: 1 },
  { id: 'border', n: 'Light', job: 'borders', from: 2, to: 3 },
  { id: 'solid', n: 'Solid', job: 'buttons, links', from: 5, to: 6 },
  { id: 'ink', n: 'Ink', job: 'text', from: 8, to: 9 },
] as const;

const SW = 72, X0 = 480 - (SW * 10) / 2;

export function PaletteBuildScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const spread = p(t, 6, 7.6);
  const ramps = 1 - p(t, 22.6, 23.2);
  const card = t >= 23 ? clamp((t - 23) / 0.5) : 0;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: one brand colour becomes a ramp of shades, each with a job">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {ramps > 0 && (
          <g opacity={ramps}>
            {t < 6.2 && (
              <g transform={`translate(480 250) scale(${clamp(back(t / 0.7))})`}>
                <rect x={-80} y={-80} width={160} height={160} rx={28} fill={BLUE[5]} />
                <text y={115} textAnchor="middle" fontSize={18} fontWeight={800} fill={SC.text}>Brand blue · 500</text>
              </g>
            )}
            {t >= 6 && (
              <g>
                {BLUE.map((c, i) => {
                  const x = lerp(480 - SW / 2, X0 + i * SW, spread), y = lerp(170, 140, p(t, 16.6, 17.4));
                  return (
                    <g key={c}>
                      <rect x={x} y={y} width={SW - 6} height={90} rx={12} fill={c} stroke={i === 0 ? SC.line : 'none'} />
                      <text x={x + (SW - 6) / 2} y={y + 112} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.muted} opacity={spread}>{STEPS[i]}</text>
                    </g>
                  );
                })}
                {t >= 11 && ZONES.map((z, k) => {
                  const x1 = X0 + z.from * SW, x2 = X0 + (z.to + 1) * SW - 6, y = lerp(300, 270, p(t, 16.6, 17.4));
                  return (
                    <g key={z.id} opacity={clamp((t - 11.2 - k * 0.5) / 0.4)}>
                      <path d={`M${x1} ${y} v8 H${x2} v-8`} stroke={SC.discover} strokeWidth={2.5} fill="none" />
                      <text x={(x1 + x2) / 2} y={y + 28} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.discover}>{z.n}</text>
                      <text x={(x1 + x2) / 2} y={y + 46} textAnchor="middle" fontSize={12} fontWeight={700} fill={SC.muted}>{z.job}</text>
                    </g>
                  );
                })}
                {t >= 17 && (
                  <g opacity={clamp((t - 17.2) / 0.5)}>
                    <text x={X0} y={362} fontSize={15} fontWeight={800} fill={SC.text}>Neutrals · most of the screen</text>
                    {SLATE.map((c, i) => <rect key={c} x={X0 + i * SW} y={376} width={SW - 6} height={60} rx={12} fill={c} stroke={i === 0 ? SC.line : 'none'} transform={`translate(0 ${(1 - clamp(back((t - 17.4 - i * 0.06) / 0.4))) * 20})`} />)}
                  </g>
                )}
              </g>
            )}
          </g>
        )}

        {/* a card built from ramp steps */}
        {card > 0 && t < 29.4 && (
          <g opacity={card} transform={`translate(0 ${(1 - clamp(back((t - 23) / 0.5))) * 30})`}>
            <rect x={260} y={120} width={440} height={280} rx={24} fill={BLUE[0]} stroke={BLUE[2]} strokeWidth={3} />
            <text x={296} y={180} fontSize={28} fontWeight={800} fill={BLUE[9]}>Save ₹500 a month</text>
            <text x={296} y={216} fontSize={16} fill={SLATE[6]}>Round up every payment and put</text>
            <text x={296} y={240} fontSize={16} fill={SLATE[6]}>the change into savings.</text>
            <rect x={296} y={290} width={170} height={52} rx={14} fill={BLUE[6]} />
            <text x={381} y={322} textAnchor="middle" fontSize={17} fontWeight={800} fill="#fff">Start saving</text>
            {[{ x: 720, y: 140, l: 'blue-50 · tint', a: [700, 130] }, { x: 720, y: 190, l: 'blue-200 · border', a: [700, 190] }, { x: 720, y: 240, l: 'blue-900 · heading', a: [640, 175] }, { x: 720, y: 290, l: 'slate-600 · body', a: [570, 230] }, { x: 720, y: 340, l: 'blue-600 · button', a: [466, 316] }].map((c, i) => (
              <g key={c.l} opacity={clamp((t - 23.8 - i * 0.4) / 0.4)}>
                <line x1={c.x - 6} y1={c.y - 5} x2={c.a[0]} y2={c.a[1]} stroke={SC.muted} strokeWidth={1.5} strokeDasharray="4 4" />
                <text x={c.x} y={c.y} fontSize={14} fontWeight={800} fill={SC.text}>{c.l}</text>
              </g>
            ))}
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'One colour, ten shades', l: 'A ramp from 50 to 900', c: SC.discover }, { x: 480, n: 'Jobs, not looks', l: 'Tint · light · solid · ink', c: SC.design }, { x: 760, n: 'Mostly neutral', l: 'Brand is the accent', c: SC.mint }].map((f, i) => {
        const k = back((t - (29.2 + i * 0.25)) / 0.5);
        return (
          <g key={f.n} transform={`translate(${f.x} 260) scale(${clamp(k)})`}>
            <rect x={-125} y={-70} width={250} height={140} rx={18} fill={SC.surface} stroke={f.c} strokeWidth={3} />
            <text y={-8} textAnchor="middle" fontSize={f.n.length > 16 ? 18 : 22} fontWeight={800} fill={f.c}>{f.n}</text>
            <text y={26} textAnchor="middle" fontSize={14} fontWeight={600} fill={SC.text}>{f.l}</text>
          </g>
        );
      })}
    </svg>
  );
}
