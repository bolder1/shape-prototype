'use client';
// Scene for ld.2-2: a reviewer's eyes jump across a portfolio page (summary, role, image, outcome); vague words get struck
// out; a specific sentence is labelled problem → insight → decision; an honest trade-off earns trust; forty screens
// shrink to three. Pure function of t (0–34).
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
const GAZE = [[300, 120], [300, 170], [470, 260], [300, 380], [620, 380]];

export function PortfolioCritScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const gi = Math.max(0, Math.min(GAZE.length - 1, Math.floor(t / 1.1))), gk = p(t, gi * 1.1, gi * 1.1 + 0.4);
  const from = GAZE[Math.max(0, gi - 1)], to = GAZE[gi];
  const collapse = p(t, 24.4, 26);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: how reviewers read portfolios and what makes a case study strong">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {/* the page and the gaze */}
        {t < 6.4 && (
          <g opacity={clamp(t / 0.5) * (1 - p(t, 5.8, 6.4))}>
            <rect x={240} y={80} width={480} height={380} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            <rect x={270} y={108} width={300} height={16} rx={6} fill={SC.text} opacity={0.8} />
            <rect x={270} y={160} width={180} height={10} rx={5} fill={SC.muted} opacity={0.6} />
            <rect x={270} y={200} width={420} height={120} rx={10} fill="#93c5fd" opacity={0.6} />
            <rect x={270} y={340} width={200} height={10} rx={5} fill={SC.line} /><rect x={270} y={360} width={240} height={10} rx={5} fill={SC.line} />
            <rect x={560} y={350} width={130} height={60} rx={10} fill={SC.mint} opacity={0.5} />
            {['summary', 'role', 'image', 'text', 'outcome'].map((l, i) => i <= gi && <circle key={l} cx={GAZE[i][0]} cy={GAZE[i][1]} r={18} fill={SC.design} opacity={0.25} />)}
            <circle cx={lerp(from[0], to[0], gk)} cy={lerp(from[1], to[1], gk)} r={12} fill={SC.design} />
            <text x={480} y={500} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.muted}>Summary, role, first image, outcome. The rest is skimmed.</text>
          </g>
        )}

        {/* vague vs specific */}
        {t >= 6 && t < 18.4 && (
          <g opacity={clamp((t - 6) / 0.5) * (1 - p(t, 17.8, 18.4))}>
            {['“Clean.”', '“Modern.”', '“User-friendly.”'].map((w, i) => (
              <g key={w} transform={`translate(${220 + i * 260} 160) scale(${clamp(back((t - 6.3 - i * 0.4) / 0.4))})`}>
                <text textAnchor="middle" fontSize={28} fontWeight={800} fill={SC.muted}>{w}</text>
                {t >= 8 + i * 0.4 && <line x1={-80} x2={lerp(-80, 80, p(t, 8 + i * 0.4, 8.4 + i * 0.4))} y1={-9} y2={-9} stroke={SC.error} strokeWidth={4} />}
              </g>
            ))}
            {t >= 12 && (
              <g opacity={clamp((t - 12) / 0.5)}>
                <rect x={110} y={250} width={740} height={64} rx={14} fill={SC.surface} stroke={SC.mint} strokeWidth={2} />
                <text x={480} y={290} textAnchor="middle" fontSize={17} fontWeight={700} fill={SC.text}>“Riders feared being overcharged, so we showed the final fare before payment.”</text>
                {[{ x: 270, l: 'Problem' }, { x: 520, l: 'Insight' }, { x: 730, l: 'Decision' }].map((b, i) => (
                  <g key={b.l} transform={`translate(${b.x} 350) scale(${clamp(back((t - 12.6 - i * 0.5) / 0.4))})`}>
                    <rect x={-56} y={-15} width={112} height={30} rx={15} fill={SC.mint} />
                    <text y={5} textAnchor="middle" fontSize={13} fontWeight={800} fill="#fff">{b.l}</text>
                  </g>
                ))}
              </g>
            )}
          </g>
        )}

        {/* trade-off */}
        {t >= 18 && t < 24.4 && (
          <g opacity={clamp((t - 18) / 0.5) * (1 - p(t, 23.8, 24.4))}>
            <rect x={180} y={200} width={600} height={80} rx={16} fill={SC.surface} stroke={SC.design} strokeWidth={2} />
            <text x={480} y={235} textAnchor="middle" fontSize={17} fontWeight={700} fill={SC.text}>“We cut saved addresses to ship on time.</text>
            <text x={480} y={262} textAnchor="middle" fontSize={17} fontWeight={700} fill={SC.text}>It came back in version 2.”</text>
            <text x={480} y={330} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.mint} opacity={clamp((t - 19.4) / 0.4)}>Admitting a limit makes the rest believable.</text>
          </g>
        )}

        {/* forty screens to three */}
        {t >= 24 && t < 29.4 && (
          <g opacity={clamp((t - 24) / 0.5)}>
            {Array.from({ length: 40 }, (_, i) => {
              const keep = i === 7 || i === 18 || i === 29, k = keep ? [0, 1, 2][[7, 18, 29].indexOf(i)] : 0;
              const x0 = 130 + (i % 10) * 72, y0 = 120 + Math.floor(i / 10) * 70;
              const x = keep ? lerp(x0, 230 + k * 190, collapse) : x0, y = keep ? lerp(y0, 200, collapse) : y0;
              const s = keep ? lerp(1, 2.4, collapse) : 1;
              return <rect key={i} x={x} y={y} width={60 * s} height={56 * s} rx={8} fill={['#93c5fd', '#fcd34d', '#a7f3d0', '#f9a8d4'][i % 4]} opacity={keep ? 0.9 : 0.8 * (1 - collapse)} />;
            })}
            {collapse > 0.9 && <text x={480} y={420} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.mint}>Three screens that show the key decision.</text>}
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Specific', l: 'Problem · insight · decision', c: SC.discover }, { x: 480, n: 'Honest', l: 'Trade-offs build trust', c: SC.design }, { x: 760, n: 'Focused', l: 'A few screens, explained', c: SC.mint }].map((f, i) => {
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
