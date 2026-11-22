'use client';
// Scene for dc.1-2: the box model (margin, border, padding, content); a flex row with its gap; justify-content and
// align-items cycling through values; Figma auto layout beside the matching CSS; then a grid. Pure function of t (0–34).
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
const JUSTIFY = ['flex-start', 'center', 'space-between'] as const;

/** x positions of three 80-wide items in a 520-wide row, for each justify-content value. */
const placeRow = (mode: string, gap: number) => {
  const total = 3 * 80 + 2 * gap;
  if (mode === 'center') return [0, 1, 2].map(i => (520 - total) / 2 + i * (80 + gap));
  if (mode === 'space-between') return [0, 220, 440];
  return [0, 1, 2].map(i => i * (80 + gap));
};

export function BoxModelScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const jIdx = t < 11 ? 0 : Math.min(2, Math.floor((t - 11) / 1.8));
  const prev = placeRow(JUSTIFY[Math.max(0, jIdx - 1)], 24), next = placeRow(JUSTIFY[jIdx], 24);
  const k = t < 11 ? 1 : p(t, 11 + jIdx * 1.8, 11.6 + jIdx * 1.8);
  const xs = next.map((x, i) => lerp(prev[i], x, k));
  const alignCenter = t >= 15.2 && t < 17;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: the CSS box model, flexbox and grid">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {/* box model */}
        {t < 6.4 && (
          <g opacity={clamp(t / 0.5) * (1 - p(t, 5.8, 6.4))}>
            {[{ n: 'margin', i: 0, c: '#f59e0b', dash: '8 6' }, { n: 'border', i: 1, c: SC.text }, { n: 'padding', i: 2, c: SC.mint }, { n: 'content', i: 3, c: SC.discover }].map((b, j) => {
              const inset = b.i * 44, s = clamp(back((t - 0.3 - j * 0.6) / 0.5));
              return (
                <g key={b.n} opacity={s}>
                  <rect x={260 + inset} y={110 + inset * 0.7} width={440 - inset * 2} height={320 - inset * 1.4} rx={10}
                    fill={b.n === 'content' ? SC.discover : b.n === 'padding' ? SC.mint : 'none'} fillOpacity={b.n === 'content' ? 0.35 : 0.12}
                    stroke={b.c} strokeWidth={b.n === 'border' ? 5 : 2} strokeDasharray={b.dash} />
                  <text x={272 + inset} y={132 + inset * 0.7} fontSize={14} fontWeight={800} fill={b.c} fontFamily="ui-monospace, Consolas, monospace">{b.n}</text>
                </g>
              );
            })}
          </g>
        )}

        {/* flex row */}
        {t >= 6 && t < 23.4 && (
          <g opacity={clamp((t - 6) / 0.5) * (1 - p(t, 22.8, 23.4))}>
            <g transform="translate(220 150)">
              <rect x={-20} y={-20} width={560} height={150} rx={14} fill="none" stroke={SC.discover} strokeWidth={2} strokeDasharray="6 5" />
              <text x={-20} y={-30} fontSize={13} fontWeight={800} fill={SC.discover} fontFamily="ui-monospace, Consolas, monospace">display: flex</text>
              {xs.map((x, i) => {
                const h = alignCenter ? [60, 100, 40][i] : t >= 17 ? 110 : [60, 100, 40][i];
                const y = alignCenter ? (110 - h) / 2 : 0;
                return <rect key={i} x={x} y={y} width={80} height={h} rx={10} fill={[SC.design, SC.mint, SC.grow][i]} opacity={0.85} />;
              })}
              {t >= 7.4 && t < 11 && [0, 1].map(i => <g key={i} opacity={clamp((t - 7.4) / 0.4)}><rect x={80 + i * 104} y={40} width={24} height={30} fill={SC.design} opacity={0.25} /><text x={92 + i * 104} y={92} textAnchor="middle" fontSize={11} fontWeight={800} fill={SC.muted}>24</text></g>)}
            </g>
            <text x={480} y={350} textAnchor="middle" fontSize={20} fontWeight={800} fill={SC.text} fontFamily="ui-monospace, Consolas, monospace">
              {t < 11 ? 'gap: 24px' : t < 15.2 ? `justify-content: ${JUSTIFY[jIdx]}` : t < 17 ? 'align-items: center' : 'align-items: stretch'}
            </text>
            {t >= 17 && (
              <g opacity={clamp((t - 17.2) / 0.4)}>
                <g transform="translate(150 390)">
                  <rect width={300} height={100} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                  <text x={16} y={26} fontSize={13} fontWeight={800} fill={SC.text}>Figma · Auto layout</text>
                  {['→ Horizontal', 'Gap 24', 'Padding 20', 'Align: fill'].map((l, i) => <text key={l} x={16 + (i % 2) * 140} y={54 + Math.floor(i / 2) * 26} fontSize={12} fontWeight={700} fill={SC.muted}>{l}</text>)}
                </g>
                <text x={480} y={446} textAnchor="middle" fontSize={22} fontWeight={800} fill={SC.mint}>=</text>
                <g transform="translate(510 390)" fontFamily="ui-monospace, Consolas, monospace">
                  <rect width={300} height={100} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                  {['flex-direction: row;', 'gap: 24px;', 'padding: 20px;', 'align-items: stretch;'].map((l, i) => <text key={l} x={16} y={24 + i * 21} fontSize={12} fontWeight={700} fill={SC.text}>{l}</text>)}
                </g>
              </g>
            )}
          </g>
        )}

        {/* grid */}
        {t >= 23 && t < 29.4 && (
          <g opacity={clamp((t - 23) / 0.5)}>
            <text x={480} y={100} textAnchor="middle" fontSize={18} fontWeight={800} fill={SC.text} fontFamily="ui-monospace, Consolas, monospace">grid-template-columns: repeat(3, 1fr)</text>
            {Array.from({ length: 6 }, (_, i) => (
              <rect key={i} x={240 + (i % 3) * 165} y={130 + Math.floor(i / 3) * 150} width={145} height={130} rx={12}
                fill={[SC.discover, SC.design, SC.mint, SC.grow, SC.build, SC.discover][i]} opacity={0.75 * clamp(back((t - 23.3 - i * 0.15) / 0.4))} />
            ))}
            <text x={480} y={460} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.mint}>Rows and columns at once</text>
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Box model', l: 'Content · padding · border · margin', c: SC.discover }, { x: 480, n: 'Flexbox', l: 'Direction, justify, align, gap', c: SC.design }, { x: 760, n: 'Grid', l: 'Rows and columns', c: SC.mint }].map((f, i) => {
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
