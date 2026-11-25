'use client';
// Scene for ui.5-2: Bunkar's app has shadows from four suns. Kavya picks one light from above, so every shadow falls
// straight down; gives each surface a height by what it does (`ELEVATIONS`: the page flat, a card low, the bag bar and
// menu raised, the delivery sheet an overlay); grows offset and blur with height (`SHADOWS`); stops every card
// floating; and in dark mode lightens surfaces as they rise (`DARK_LIGHTNESS`). Pure function of t (0–36). Also exports
// `ELEVATION_LABEL` for `elevation-lift`.
import { DARK_LIGHTNESS, ELEVATIONS, SHADOWS, type Elevation } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
export const ELEVATION_LABEL: Record<Elevation, string> = { flat: 'Flat', low: 'Low', raised: 'Raised', overlay: 'Overlay' };
const dark = (e: Elevation) => `hsl(222 18% ${DARK_LIGHTNESS[e]}%)`;

/** A surface with its shadow: a blurred dark copy offset by (dx, dy). */
function Lifted({ x, y, w, h, dx, dy, blur, alpha, fill = SC.surface, children }: { x: number; y: number; w: number; h: number; dx: number; dy: number; blur: number; alpha: number; fill?: string; children?: React.ReactNode }) {
  return (
    <g>
      {alpha > 0 && <rect x={x + dx} y={y + dy} width={w} height={h} rx={12} fill="#000" opacity={alpha} filter={`url(#ls-b${Math.min(3, Math.round(blur / 6))})`} />}
      <rect x={x} y={y} width={w} height={h} rx={12} fill={fill} stroke={SC.line} strokeWidth={1.5} />
      {children}
    </g>
  );
}

export function LightSourceScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'Four suns' : t < 11 ? 'One light, from above' : t < 16 ? 'Height by behaviour' : t < 21 ? 'Higher, further, softer' : t < 26 ? 'If everything floats' : t < 31 ? 'Dark mode' : 'Four tokens';
  const one = p(t, 6.4, 8.4);
  const messy = [[-10, 6], [10, 10], [-6, -8], [12, -4]] as const;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: shadows on an app fall in four directions, from four imagined lights. One light from above makes every shadow fall straight down. Each surface gets a height by what it does: the page flat, a product card low, the sticky bag bar and a menu raised, a bottom sheet an overlay. Higher surfaces cast shadows that fall further and blur more. When every card floats, the open menu stops standing out. In dark mode shadows vanish, so higher surfaces get lighter fills. Twenty-three shadows become four tokens.">
      <defs>
        {[2, 6, 12, 20].map((b, i) => <filter key={b} id={`ls-b${i}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={b / 2} /></filter>)}
      </defs>
      <rect width={W} height={H} fill={t >= 26 && t < 31 ? dark('flat') : SC.soft} />
      {!(t >= 26 && t < 31) && <Grid w={W} h={H} />}
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={t >= 26 && t < 31 ? '#fff' : SC.text}>{title}</text>

        {t < 11 && (
          <g>
            {[0, 1, 2, 3].map(i => {
              const [mx, my] = messy[i];
              return (
                <Lifted key={i} x={60 + (i % 2) * 200} y={86 + Math.floor(i / 2) * 130} w={170} h={100}
                  dx={lerp(mx, 0, one)} dy={lerp(my, 6, one)} blur={12} alpha={0.22}>
                  <rect x={76 + (i % 2) * 200} y={102 + Math.floor(i / 2) * 130} width={60} height={68} rx={8} fill={[SC.design, SC.build, SC.grow, SC.discover][i]} opacity={0.35} />
                  <rect x={146 + (i % 2) * 200} y={110 + Math.floor(i / 2) * 130} width={70} height={14} rx={5} fill={SC.muted} opacity={0.5} />
                </Lifted>
              );
            })}
            {messy.map(([mx, my], i) => (
              <g key={i} transform={`translate(${lerp(520 - mx * 6, 520, one)} ${lerp(190 - my * 8, 100, one)})`} opacity={i === 0 ? 1 : 1 - one}>
                <circle r={18} fill={SC.design} opacity={0.5} />
                <circle r={11} fill={SC.design} />
              </g>
            ))}
            <text x={520} y={300} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="middle">{t < 6 ? '23 shadows' : 'All fall down'}</text>
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g>
            <line x1={40} y1={300} x2={600} y2={300} stroke={SC.text} strokeWidth={3} />
            {ELEVATIONS.map((e, i) => {
              const y = 300 - i * 56 - 14;
              const k = p(t, 11.3 + i * 0.6, 11.9 + i * 0.6);
              return (
                <g key={e} opacity={k}>
                  <rect x={200 + i * 24} y={lerp(300 - 14, y, k)} width={320 - i * 48} height={14} rx={7} fill={[SC.line, SC.discover, SC.design, SC.build][i]} />
                  <text x={186} y={lerp(300, y + 13, k)} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="end">{['Page', 'Sari card', 'Bag bar, menu', 'Sheet'][i]}</text>
                </g>
              );
            })}
          </g>
        )}

        {t >= 16 && t < 21 && (
          <g>
            {ELEVATIONS.map((e, i) => {
              const last = SHADOWS[e].at(-1);
              const k = p(t, 16.3 + i * 0.5, 16.9 + i * 0.5);
              return (
                <g key={e} opacity={k}>
                  <Lifted x={40 + i * 150} y={110} w={120} h={120} dx={0} dy={(last?.y ?? 0) * 1.5} blur={(last?.blur ?? 0) * 0.6} alpha={(last?.alpha ?? 0) * 2.2} />
                  <text x={100 + i * 150} y={290} fontSize={22} fontWeight={900} fill={SC.text} textAnchor="middle">{ELEVATION_LABEL[e]}</text>
                </g>
              );
            })}
          </g>
        )}

        {t >= 21 && t < 26 && (() => {
          const calm = p(t, 23, 24.2);
          return (
            <g>
              {[0, 1, 2, 3, 4, 5].map(i => (
                <Lifted key={i} x={50 + (i % 3) * 140} y={90 + Math.floor(i / 3) * 120} w={120} h={100} dx={0} dy={lerp(14, 2, calm)} blur={lerp(20, 4, calm)} alpha={lerp(0.3, 0.16, calm)} />
              ))}
              <Lifted x={300} y={150} w={160} h={150} dx={0} dy={14} blur={20} alpha={0.32}>
                {['Plain', 'Zari border', 'Contrast'].map((o, i) => <text key={o} x={318} y={190 + i * 38} fontSize={21} fontWeight={800} fill={SC.text}>{o}</text>)}
              </Lifted>
              <text x={510} y={130} fontSize={21} fontWeight={800} fill={SC.muted}>{calm < 0.5 ? 'Which is' : 'Now the'}</text>
              <text x={510} y={158} fontSize={21} fontWeight={800} fill={SC.muted}>{calm < 0.5 ? 'on top?' : 'menu is'}</text>
            </g>
          );
        })()}

        {t >= 26 && t < 31 && (
          <g>
            {ELEVATIONS.map((e, i) => (
              <g key={e} opacity={p(t, 26.3 + i * 0.5, 26.9 + i * 0.5)}>
                <rect x={40 + i * 150} y={110 + (3 - i) * 14} width={120} height={120} rx={12} fill={dark(e)} stroke="#fff" strokeOpacity={i >= 2 ? 0.14 : 0} />
                <text x={100 + i * 150} y={290} fontSize={22} fontWeight={900} fill="#fff" textAnchor="middle">{ELEVATION_LABEL[e]}</text>
                <text x={100 + i * 150} y={318} fontSize={21} fontWeight={700} fill="#fff" opacity={0.75} textAnchor="middle">{DARK_LIGHTNESS[e]}%</text>
              </g>
            ))}
          </g>
        )}

        {t >= 31 && (
          <g>
            <text x={170} y={210} fontSize={96} fontWeight={900} fill={SC.muted} textAnchor="middle" opacity={1 - p(t, 32.4, 33.4) * 0.6}>23</text>
            <text x={320} y={200} fontSize={44} fontWeight={900} fill={SC.muted} textAnchor="middle" opacity={p(t, 31.6, 32.2)}>→</text>
            <text x={470} y={210} fontSize={96} fontWeight={900} fill={SC.text} textAnchor="middle" opacity={p(t, 32.2, 32.8)}>4</text>
            <text x={320} y={290} fontSize={22} fontWeight={800} fill={SC.muted} textAnchor="middle" opacity={p(t, 33, 33.6)}>New screens pick a height, never a shadow</text>
          </g>
        )}
      </g>
    </svg>
  );
}
