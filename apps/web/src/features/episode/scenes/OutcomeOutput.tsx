'use client';
// Scene for st.1-1: a team ships twelve features and weekly orders stay flat. Interviews find the problem, the team names
// an outcome (1.2 → 1.6 weekly orders per regular), tests three outputs, and one moves the line. Pure function of t (0–34).
import { QuotesIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, lerp, p, Pen, SC } from './shared';

const W = 960, H = 540;
const SHIPPED = ['Dark mode', 'Banner', 'Carousel', 'New icons', 'Badges', 'Filters', 'Stories', 'Themes', 'Stickers', 'Tips', 'Widgets', 'Promo bar'];
const OUTPUTS = [{ n: 'Reorder button', win: true }, { n: 'Lunch reminder', win: false }, { n: 'Weekly plan', win: false }];
// The chart: x 560–900, value 1.0–1.8 mapped to y 380–120.
const CX0 = 560, CX1 = 900, vy = (v: number) => 380 - ((v - 1) / 0.8) * 260;

export function OutcomeOutputScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const shipped = t < 7 ? Math.min(SHIPPED.length, Math.floor(t * 2.2)) : SHIPPED.length;
  const rise = p(t, 25, 28.5);
  const pts = Array.from({ length: 12 }, (_, i) => {
    const x = lerp(CX0, CX1, i / 11);
    const flat = 1.2 + Math.sin(i * 1.7) * 0.025;
    const v = i < 8 ? flat : lerp(flat, 1.2 + ((i - 7) / 4) * 0.4, rise);
    return `${x},${vy(v)}`;
  });
  const reveal = t < 7 ? clamp(t / 6) : 1;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: shipping outputs versus moving an outcome">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {/* the chart */}
        <text x={CX0} y={100} fontSize={13} fontWeight={800} fill={SC.muted}>WEEKLY ORDERS PER REGULAR</text>
        <line x1={CX0} x2={CX1} y1={380} y2={380} stroke={SC.line} strokeWidth={2} />
        {t >= 13 && (
          <g opacity={clamp((t - 13) / 0.5)}>
            <line x1={CX0} x2={CX1} y1={vy(1.6)} y2={vy(1.6)} stroke={SC.mint} strokeWidth={2} strokeDasharray="6 5" />
            <text x={CX1} y={vy(1.6) - 8} textAnchor="end" fontSize={13} fontWeight={800} fill={SC.mint}>target 1.6</text>
          </g>
        )}
        <clipPath id="oo-reveal"><rect x={CX0 - 4} y={60} width={(CX1 - CX0 + 8) * reveal} height={340} /></clipPath>
        <polyline clipPath="url(#oo-reveal)" points={pts.join(' ')} fill="none" stroke={rise > 0 ? SC.mint : SC.discover} strokeWidth={4} strokeLinejoin="round" />
        <text x={CX0} y={vy(1.2) - 14} fontSize={13} fontWeight={800} fill={SC.discover} opacity={t < 7 ? reveal : 1}>1.2</text>

        {/* 1. features piling up */}
        {t < 7.5 && (
          <g opacity={1 - p(t, 7, 7.5)}>
            {SHIPPED.slice(0, shipped).map((s, i) => (
              <g key={s} transform={`translate(${70 + (i % 3) * 140} ${380 - Math.floor(i / 3) * 56}) scale(${clamp(back((t - i / 2.2) / 0.3))})`}>
                <rect width={124} height={44} rx={10} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={62} y={28} textAnchor="middle" fontSize={13} fontWeight={700} fill={SC.text}>{s}</text>
              </g>
            ))}
            <text x={270} y={120} textAnchor="middle" fontSize={22} fontWeight={900} fill={SC.text}>{shipped} features shipped</text>
            {t >= 4 && <text x={270} y={150} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.error} opacity={clamp((t - 4) / 0.4)}>The line didn’t move</text>}
          </g>
        )}

        {/* 2. the problem */}
        {t >= 7.5 && t < 13 && (
          <g transform={`translate(70 170) scale(${clamp(back((t - 7.6) / 0.5))})`}>
            <rect width={410} height={150} rx={18} fill={SC.surface} stroke={SC.design} strokeWidth={2.5} />
            <QuotesIcon x={20} y={18} width={30} height={30} color={SC.design} weight="fill" />
            <text x={60} y={44} fontSize={16} fontWeight={700} fontStyle="italic" fill={SC.text}>I keep forgetting to reorder,</text>
            <text x={60} y={68} fontSize={16} fontWeight={700} fontStyle="italic" fill={SC.text}>so I just eat at the canteen.</text>
            <rect x={20} y={100} width={96} height={30} rx={15} fill={SC.design} />
            <text x={68} y={120} textAnchor="middle" fontSize={13} fontWeight={800} fill="#fff">PROBLEM</text>
          </g>
        )}
        {/* 3. the outcome */}
        {t >= 13 && t < 19 && (
          <g transform={`translate(70 170) scale(${clamp(back((t - 13.1) / 0.5))})`}>
            <rect width={410} height={150} rx={18} fill={SC.surface} stroke={SC.mint} strokeWidth={2.5} />
            <text x={24} y={50} fontSize={16} fontWeight={700} fill={SC.muted}>Weekly orders per regular</text>
            <text x={24} y={95} fontSize={38} fontWeight={900} fill={SC.text}>1.2 → 1.6</text>
            <rect x={280} y={100} width={106} height={30} rx={15} fill={SC.mint} />
            <text x={333} y={120} textAnchor="middle" fontSize={13} fontWeight={800} fill="#fff">OUTCOME</text>
          </g>
        )}
        {/* 4. outputs as bets */}
        {t >= 19 && t < 29 && OUTPUTS.map((o, i) => {
          const won = t >= 25.5;
          return (
            <g key={o.n} transform={`translate(70 ${150 + i * 74}) scale(${clamp(back((t - 19.2 - i * 0.4) / 0.4))})`} opacity={won && !o.win ? 0.35 : 1}>
              <rect width={300} height={58} rx={12} fill={SC.surface} stroke={won && o.win ? SC.mint : SC.line} strokeWidth={won && o.win ? 3 : 2} />
              <text x={20} y={36} fontSize={17} fontWeight={800} fill={SC.text}>{o.n}</text>
              <rect x={210} y={16} width={74} height={26} rx={13} fill={won ? (o.win ? SC.mint : SC.muted) : SC.build} opacity={0.9} />
              <text x={247} y={34} textAnchor="middle" fontSize={12} fontWeight={800} fill="#fff">{won ? (o.win ? 'KEEP' : 'DROP') : 'TEST'}</text>
            </g>
          );
        })}
        {t >= 26 && t < 29 && <Pen x={420} y={420} scale={0.45} mood="cheer" />}
      </g>

      {fin > 0 && [{ x: 200, n: 'Problem', l: 'A real struggle', c: SC.design }, { x: 480, n: 'Outcome', l: 'A measurable change', c: SC.mint }, { x: 760, n: 'Output', l: 'A bet to get there', c: SC.discover }].map((f, i) => {
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
