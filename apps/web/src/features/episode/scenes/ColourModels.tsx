'use client';
// Scene for ui.3-1: a hex code nobody can steer becomes three HSL dials; hue walks the wheel, saturation and lightness
// move; then six hues at HSL lightness 50 look unevenly bright, and an OKLCH row evens them out. Pure function of t (0–34).
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
/** Six hues at HSL 100% / 50%, with how bright each really looks (relative luminance), for the "HSL lies" row. */
const ROW = [{ h: 60, lum: 0.93 }, { h: 180, lum: 0.79 }, { h: 120, lum: 0.72 }, { h: 300, lum: 0.28 }, { h: 0, lum: 0.21 }, { h: 240, lum: 0.07 }];

export function ColourModelsScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const dials = t >= 6 && t < 22.4;
  const hue = (220 + 360 * p(t, 11.5, 15.5)) % 360;
  const sat = t < 16 ? 80 : lerp(lerp(80, 12, p(t, 16.4, 17.6)), 80, p(t, 18.2, 19));
  const light = t < 19 ? 50 : lerp(lerp(lerp(50, 86, p(t, 19.2, 20)), 24, p(t, 20.3, 21.1)), 50, p(t, 21.3, 21.9));
  const fill = `hsl(${hue} ${sat}% ${light}%)`;
  const RX = 610, RY = 175, R = 62;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a colour as hue, saturation and lightness dials, and why OKLCH lightness is more even than HSL">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {t < 22.6 && (
          <g opacity={1 - p(t, 22, 22.6)}>
            {/* the swatch */}
            <g transform={`translate(${dials ? lerp(480, 250, p(t, 6, 7)) : 480} 270) scale(${clamp(back(t / 0.7))})`}>
              <rect x={-110} y={-110} width={220} height={220} rx={36} fill={fill} />
              <text y={150} textAnchor="middle" fontSize={22} fontWeight={800} fill={SC.text} fontFamily="ui-monospace, Consolas, monospace">
                {t < 6.5 ? '#2563EB' : `hsl(${Math.round(hue)} ${Math.round(sat)}% ${Math.round(light)}%)`}
              </text>
            </g>
            {t >= 1.6 && t < 6 && ['Darker?', 'More muted?', 'Greener?'].map((q, i) => (
              <g key={q} transform={`translate(${[680, 690, 270][i]} ${[150, 330, 120][i]}) scale(${clamp(back((t - 1.6 - i * 0.5) / 0.4)) * (1 - p(t, 5.4, 6))})`}>
                <rect x={-80} y={-20} width={160} height={40} rx={20} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text y={6} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.muted}>{q}</text>
              </g>
            ))}

            {/* the three dials */}
            {dials && (
              <g opacity={clamp((t - 6.4) / 0.5)}>
                {Array.from({ length: 36 }, (_, i) => {
                  const a = (i * 10 - 90) * Math.PI / 180, a2 = ((i + 1) * 10 - 90) * Math.PI / 180;
                  return <path key={i} d={`M${RX + Math.cos(a) * R} ${RY + Math.sin(a) * R} A${R} ${R} 0 0 1 ${RX + Math.cos(a2) * R} ${RY + Math.sin(a2) * R}`} stroke={`hsl(${i * 10} 85% 55%)`} strokeWidth={18} fill="none" />;
                })}
                <circle cx={RX + Math.cos((hue - 90) * Math.PI / 180) * R} cy={RY + Math.sin((hue - 90) * Math.PI / 180) * R} r={13} fill={SC.surface} stroke={SC.text} strokeWidth={3} />
                <text x={RX + 100} y={RY + 6} fontSize={18} fontWeight={800} fill={SC.text}>Hue</text>
                <text x={RX + 100} y={RY + 28} fontSize={13} fontWeight={700} fill={SC.muted}>which colour</text>
                {[{ y: 320, n: 'Saturation', d: 'how vivid', v: sat }, { y: 410, n: 'Lightness', d: 'how light or dark', v: light }].map((b, i) => (
                  <g key={b.n}>
                    <defs>
                      <linearGradient id={`cm-${i}`}>
                        {i === 0 ? <><stop offset="0" stopColor={`hsl(${hue} 0% ${light}%)`} /><stop offset="1" stopColor={`hsl(${hue} 100% ${light}%)`} /></>
                          : <><stop offset="0" stopColor="#000" /><stop offset="0.5" stopColor={`hsl(${hue} ${sat}% 50%)`} /><stop offset="1" stopColor="#fff" /></>}
                      </linearGradient>
                    </defs>
                    <rect x={470} y={b.y - 9} width={300} height={18} rx={9} fill={`url(#cm-${i})`} stroke={SC.line} />
                    <circle cx={470 + 3 * b.v} cy={b.y} r={13} fill={SC.surface} stroke={SC.text} strokeWidth={3} />
                    <text x={790} y={b.y + 2} fontSize={18} fontWeight={800} fill={SC.text}>{b.n}</text>
                    <text x={790} y={b.y + 24} fontSize={13} fontWeight={700} fill={SC.muted}>{b.d}</text>
                  </g>
                ))}
              </g>
            )}
          </g>
        )}

        {/* HSL's lie, and OKLCH */}
        {t >= 22 && t < 29.4 && (
          <g opacity={clamp((t - 22) / 0.5)}>
            {[{ y: 150, n: 'HSL · lightness 50 for all six', ok: false }, { y: 340, n: 'OKLCH · lightness 0.72 for all six', ok: true, at: 26 }].map(r => (r.at === undefined || t >= r.at) && (
              <g key={r.n} opacity={clamp((t - (r.at ?? 22)) / 0.5)}>
                <text x={130} y={r.y - 20} fontSize={16} fontWeight={800} fill={r.ok ? SC.mint : SC.error}>{r.n}</text>
                {ROW.map((c, i) => {
                  const x = 130 + i * 120;
                  const bright = r.ok ? 0.5 : c.lum;
                  return (
                    <g key={c.h} transform={`translate(${x} ${r.y}) scale(${clamp(back((t - (r.at ?? 22.2) - i * 0.12) / 0.4))})`}>
                      <rect width={100} height={70} rx={14} fill={r.ok ? `oklch(0.72 0.13 ${(c.h + 30) % 360})` : `hsl(${c.h} 100% 50%)`} />
                      <rect y={84} width={100} height={8} rx={4} fill={SC.line} />
                      <rect y={84} width={100 * bright} height={8} rx={4} fill={SC.text} />
                    </g>
                  );
                })}
                <text x={850} y={r.y + 93} fontSize={12} fontWeight={700} fill={SC.muted}>looks</text>
              </g>
            ))}
            {t >= 23.4 && t < 26 && <text x={480} y={300} textAnchor="middle" fontSize={17} fontWeight={800} fill={SC.error} opacity={clamp((t - 23.4) / 0.4)}>Same number. Yellow glares, blue looks dark.</text>}
            {t >= 27 && <text x={480} y={490} textAnchor="middle" fontSize={17} fontWeight={800} fill={SC.mint} opacity={clamp((t - 27) / 0.4)}>Equal lightness that looks equal.</text>}
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Hue', l: 'Which colour', c: SC.discover }, { x: 480, n: 'Saturation · Lightness', l: 'How vivid · how light', c: SC.design }, { x: 760, n: 'OKLCH', l: 'Lightness you can trust', c: SC.mint }].map((f, i) => {
        const k = back((t - (29.2 + i * 0.25)) / 0.5);
        return (
          <g key={f.n} transform={`translate(${f.x} 260) scale(${clamp(k)})`}>
            <rect x={-125} y={-70} width={250} height={140} rx={18} fill={SC.surface} stroke={f.c} strokeWidth={3} />
            <text y={-8} textAnchor="middle" fontSize={f.n.length > 12 ? 18 : 22} fontWeight={800} fill={f.c}>{f.n}</text>
            <text y={26} textAnchor="middle" fontSize={14} fontWeight={600} fill={SC.text}>{f.l}</text>
          </g>
        );
      })}
    </svg>
  );
}
