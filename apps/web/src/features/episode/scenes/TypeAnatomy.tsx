'use client';
// Scene for ui.2-1: a giant "Hxp" gets its four lines one at a time (baseline, x-height, cap height, descender), then two
// fonts at the same size show how x-height changes apparent size. Pure function of t (0–34).
import { back, clamp, Grid, p, SC } from './shared';

const W = 960, H = 540;
/** Where each line sits, in glyph units (baseline 0, up is negative). */
export const LINES = { cap: -72, x: -50, base: 0, desc: 24 } as const;
export const LINE_COLOR: Record<keyof typeof LINES, string> = { base: SC.discover, x: SC.design, cap: SC.grow, desc: SC.build };
export const LINE_NAME: Record<keyof typeof LINES, string> = { base: 'Baseline', x: 'x-height', cap: 'Cap height', desc: 'Descender' };

/** A geometric "Hxp" drawn in glyph units: 156 wide, baseline at y = 0. `xh` changes the x-height (default 50). */
export function Hxp({ xh = 50, color = SC.text, width = 9 }: { xh?: number; color?: string; width?: number }) {
  const s = { stroke: color, strokeWidth: width, strokeLinecap: 'round' as const, fill: 'none' };
  return (
    <g aria-hidden>
      <path d="M0 0 V-72 M44 0 V-72 M0 -36 H44" {...s} />
      <path d={`M60 ${-xh} L98 0 M98 ${-xh} L60 0`} {...s} />
      <path d={`M116 ${-xh} V24`} {...s} />
      <ellipse cx={136} cy={-xh / 2} rx={20} ry={xh / 2} {...s} />
    </g>
  );
}

const ORDER: { k: keyof typeof LINES; at: number }[] = [{ k: 'base', at: 1.6 }, { k: 'x', at: 6.2 }, { k: 'cap', at: 11.2 }, { k: 'desc', at: 16.2 }];

export function TypeAnatomyScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const big = 1 - p(t, 21.4, 22);   // the single giant specimen
  const pair = t >= 22 ? clamp((t - 22) / 0.6) : 0;
  const S = 2.6, ox = 480 - 78 * S, oy = 330;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: the baseline, x-height, cap height and descender of a word">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {big > 0 && (
          <g opacity={big}>
            <g transform={`translate(${ox} ${oy}) scale(${S * clamp(back(t / 0.8))})`}><Hxp /></g>
            {ORDER.map(({ k, at }) => {
              const k1 = p(t, at, at + 0.8), y = oy + LINES[k] * S, c = LINE_COLOR[k];
              const now = t >= at && t < at + 4.6;
              return k1 > 0 && (
                <g key={k}>
                  <line x1={200} x2={200 + 560 * k1} y1={y} y2={y} stroke={c} strokeWidth={now ? 4 : 2.5} strokeDasharray={k === 'base' ? undefined : '10 6'} />
                  <g transform={`translate(772 ${y}) scale(${clamp(back((t - at - 0.5) / 0.5))})`}>
                    <rect x={0} y={-15} width={130} height={30} rx={15} fill={c} opacity={now ? 1 : 0.85} />
                    <text x={65} y={5} textAnchor="middle" fontSize={14} fontWeight={800} fill="#fff">{LINE_NAME[k]}</text>
                  </g>
                </g>
              );
            })}
            {t >= 16.8 && (
              <g opacity={clamp((t - 16.8) / 0.4) * (1 - p(t, 20.6, 21.2))}>
                <text x={200} y={470} fontSize={16} fontWeight={700} fill={SC.muted}>Leading has to leave room for these tails before the next line’s capitals.</text>
              </g>
            )}
          </g>
        )}

        {/* two fonts, both 16px */}
        {pair > 0 && t < 29.4 && (
          <g opacity={pair}>
            {[{ x: 150, xh: 38, n: 'Short x-height' }, { x: 560, xh: 58, n: 'Tall x-height' }].map((f, i) => {
              const s = 1.7, y = 300;
              return (
                <g key={f.n} transform={`translate(0 ${(1 - clamp(back((t - 22.2 - i * 0.3) / 0.5))) * 30})`}>
                  {/* the em box: identical for both */}
                  <rect x={f.x - 20} y={y - 90 * s} width={156 * s + 40} height={120 * s} rx={10} fill={SC.surface} stroke={SC.line} strokeWidth={2} strokeDasharray="6 5" />
                  <g transform={`translate(${f.x} ${y}) scale(${s})`}><Hxp xh={f.xh} color={SC.text} width={8} /></g>
                  <line x1={f.x - 12} x2={f.x + 156 * s + 12} y1={y - f.xh * s} y2={y - f.xh * s} stroke={SC.design} strokeWidth={2.5} strokeDasharray="8 5" />
                  <text x={f.x + 78 * s} y={y + 70} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.design}>{f.n}</text>
                  <text x={f.x + 78 * s} y={y - 96 * s - 8} textAnchor="middle" fontSize={14} fontWeight={800} fill={SC.muted}>16px</text>
                </g>
              );
            })}
            {t >= 25.6 && (
              <text x={480} y={470} textAnchor="middle" fontSize={17} fontWeight={800} fill={SC.mint} opacity={clamp((t - 25.6) / 0.4)}>Same box. Taller lowercase looks bigger and reads better when small.</text>
            )}
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Baseline', l: 'Everything sits on it', c: SC.discover }, { x: 480, n: 'x-height', l: 'Decides how big text looks', c: SC.design }, { x: 760, n: 'Room for tails', l: 'Descenders need leading', c: SC.build }].map((f, i) => {
        const k = back((t - (29.2 + i * 0.25)) / 0.5);
        return (
          <g key={f.n} transform={`translate(${f.x} 260) scale(${clamp(k)})`}>
            <rect x={-125} y={-70} width={250} height={140} rx={18} fill={SC.surface} stroke={f.c} strokeWidth={3} />
            <text y={-8} textAnchor="middle" fontSize={22} fontWeight={800} fill={f.c}>{f.n}</text>
            <text y={26} textAnchor="middle" fontSize={14} fontWeight={600} fill={SC.text}>{f.l}</text>
          </g>
        );
      })}
    </svg>
  );
}
