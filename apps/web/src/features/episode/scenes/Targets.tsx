'use client';
// Scene for ax.1-4: a thumb misses a 16 px close icon and hits the ad; a 44 px tap area fixes it; two crowded links get
// spaced apart; a keyboard user tabs through a form with no focus ring, then with a clear one. Pure function of t (0–34).
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;

const Thumb = ({ x, y, o = 1 }: { x: number; y: number; o?: number }) => (
  <g opacity={o}><ellipse cx={x} cy={y} rx={30} ry={34} fill="#f5c9a8" stroke="#c2410c" strokeOpacity={0.4} strokeWidth={2} opacity={0.85} /><ellipse cx={x} cy={y - 10} rx={16} ry={14} fill="#fde2cf" opacity={0.8} /></g>
);
const Key = ({ x, y, down }: { x: number; y: number; down: boolean }) => (
  <g transform={`translate(${x} ${y + (down ? 3 : 0)})`}>
    <rect x={-40} y={-22} width={80} height={44} rx={10} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
    <text y={6} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.text}>Tab ↹</text>
  </g>
);

export function TargetsScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const PX = 340, PY = 80;   // phone origin

  // the thumb's path for each beat
  const tap1 = p(t, 2, 3.2), tap2 = p(t, 8.4, 9.6), tap3 = p(t, 13.4, 14.6);
  const tabStep = (from: number) => Math.min(2, Math.max(0, Math.floor((t - from) / 1.4)));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: small touch targets, spacing, and visible keyboard focus">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {t < 18.4 && (
          <g opacity={clamp(t / 0.5) * (1 - p(t, 17.8, 18.4))}>
            <rect x={PX} y={PY} width={280} height={400} rx={30} fill="#ffffff" stroke={SC.line} strokeWidth={2} />
            {t < 12.4 ? (
              <g opacity={1 - p(t, 11.8, 12.4)}>
                {/* an ad with a tiny close button; it closes after the second, successful tap */}
                <g opacity={1 - p(t, 9.8, 10.4)}>
                <rect x={PX + 20} y={PY + 40} width={240} height={150} rx={14} fill="#fde68a" />
                <text x={PX + 40} y={PY + 120} fontSize={20} fontWeight={800} fill="#78350f">50% off chai!</text>
                <rect x={PX + 236} y={PY + 46} width={16} height={16} rx={4} fill="#78350f" />
                <text x={PX + 244} y={PY + 58} textAnchor="middle" fontSize={11} fontWeight={900} fill="#fff">×</text>
                {t >= 6 && <rect x={PX + 222} y={PY + 32} width={44} height={44} rx={10} fill="none" stroke={SC.discover} strokeWidth={2.5} strokeDasharray="5 4" opacity={clamp((t - 6) / 0.4)} />}
                </g>
                {t >= 6.4 && t < 8.4 && <text x={PX + 140} y={PY + 230} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.discover}>Tap area 44 × 44</text>}
                <Thumb x={t < 6 ? lerp(PX + 300, PX + 225, tap1) : lerp(PX + 320, PX + 246, tap2)} y={t < 6 ? lerp(PY + 330, PY + 80, tap1) : lerp(PY + 330, PY + 58, tap2)} o={t < 6 ? clamp((t - 1.6) / 0.3) : clamp((t - 8) / 0.3) * (1 - p(t, 10, 10.5))} />
                {t >= 3.4 && t < 6 && <text x={PX + 140} y={PY + 250} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.error}>Missed. The ad opened instead.</text>}
                {t >= 9.8 && <text x={PX + 140} y={PY + 250} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.mint}>Hit. Closed.</text>}
              </g>
            ) : (
              <g opacity={clamp((t - 12.4) / 0.4)}>
                {/* crowded links, then spaced */}
                {(() => {
                  const gap = lerp(4, 40, p(t, 15.6, 16.6));
                  return (
                    <g>
                      <text x={PX + 140 - gap / 2} y={PY + 300} textAnchor="end" fontSize={14} fontWeight={700} fill="#2563eb" textDecoration="underline">Terms</text>
                      <text x={PX + 140 + gap / 2} y={PY + 300} fontSize={14} fontWeight={700} fill="#2563eb" textDecoration="underline">Privacy</text>
                    </g>
                  );
                })()}
                <Thumb x={lerp(PX + 300, PX + 140, tap3)} y={lerp(PY + 420, PY + 300, tap3)} o={clamp((t - 13) / 0.3) * (1 - p(t, 15.2, 15.6))} />
                {t >= 14.6 && t < 15.8 && <text x={PX + 140} y={PY + 360} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.error}>Terms or Privacy? Both.</text>}
                {t >= 16.6 && <text x={PX + 140} y={PY + 360} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.mint}>Space between: one thumb, one link.</text>}
              </g>
            )}
          </g>
        )}

        {/* keyboard focus */}
        {t >= 18 && t < 29.4 && (
          <g opacity={clamp((t - 18) / 0.5)}>
            <rect x={PX - 40} y={PY + 20} width={360} height={300} rx={22} fill="#ffffff" stroke={SC.line} strokeWidth={2} />
            {['Name', 'Phone', 'Address'].map((n, i) => {
              const step = t < 24 ? tabStep(18.6) : tabStep(24.4);
              const focused = i === step && t >= 18.6;
              return (
                <g key={n} transform={`translate(${PX - 10} ${PY + 50 + i * 86})`}>
                  <text x={0} y={0} fontSize={13} fontWeight={700} fill="#374151">{n}</text>
                  <rect x={0} y={10} width={300} height={42} rx={8} fill="#fff" stroke="#d1d5db" strokeWidth={2} />
                  {t >= 24 && focused && <rect x={-5} y={5} width={310} height={52} rx={11} fill="none" stroke="#2563eb" strokeWidth={4} />}
                </g>
              );
            })}
            <Key x={PX + 140} y={PY + 350} down={(t - (t < 24 ? 18.6 : 24.4)) % 1.4 < 0.2} />
            {t >= 19.4 && t < 24 && <text x={PX + 140} y={PY + 410} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.error}>outline: none. Where am I?</text>}
            {t >= 24.6 && <text x={PX + 140} y={PY + 410} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.mint}>A clear focus ring on every Tab.</text>}
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: '44 × 44', l: 'Tap area, not icon size', c: SC.discover }, { x: 480, n: 'Space between', l: 'One thumb, one target', c: SC.design }, { x: 760, n: 'Visible focus', l: 'Never just remove it', c: SC.mint }].map((f, i) => {
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
