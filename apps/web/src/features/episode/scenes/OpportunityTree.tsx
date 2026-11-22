'use client';
// Scene for st.1-2: an opportunity solution tree grows level by level (outcome → opportunities → solutions →
// experiments), then one branch is chosen and the rest dim. Pure function of t (0–34).
import { back, clamp, Grid, p, SC } from './shared';

const W = 960, H = 540;
const OPPS = [
  { n: '“I forget to reorder”', x: 200, sols: ['One-tap reorder', 'Lunch reminder'] },
  { n: '“Fees feel high”', x: 490, sols: ['Free over ₹199', 'Group orders'] },
  { n: '“Can’t decide”', x: 790, sols: ['Surprise me', 'Top 3 picks'] },
];
const EXPS: Record<string, string> = { 'One-tap reorder': 'Fake-door test', 'Free over ₹199': '1-week trial', 'Top 3 picks': '5% rollout' };
const Y = { out: 70, opp: 180, sol: 300, exp: 410 };

function Node({ x, y, w, label, c, s, lit, dim }: { x: number; y: number; w: number; label: string; c: string; s: number; lit?: boolean; dim?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${clamp(s)})`} opacity={dim ? 0.3 : 1}>
      <rect x={-w / 2} y={-22} width={w} height={44} rx={12} fill={lit ? SC.mint : SC.surface} fillOpacity={lit ? 0.18 : 1} stroke={lit ? SC.mint : c} strokeWidth={lit ? 3 : 2} />
      <text y={5} textAnchor="middle" fontSize={14} fontWeight={800} fill={SC.text}>{label}</text>
    </g>
  );
}

export function OpportunityTreeScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const chosen = t >= 25;
  const isLit = (o: number, sol?: string) => chosen && o === 0 && (!sol || sol === 'One-tap reorder');
  const dimOpp = (o: number) => chosen && o !== 0;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: an opportunity solution tree growing from one outcome">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {/* links */}
        {OPPS.map((o, oi) => (
          <g key={o.n}>
            <path d={`M480 ${Y.out + 22} C480 ${Y.out + 60} ${o.x} ${Y.opp - 60} ${o.x} ${Y.opp - 22}`} fill="none" stroke={isLit(oi) ? SC.mint : SC.line} strokeWidth={isLit(oi) ? 4 : 2}
              opacity={clamp((t - 6.2 - oi * 0.5) / 0.5) * (dimOpp(oi) ? 0.3 : 1)} />
            {o.sols.map((s, si) => {
              const sx = o.x + (si ? 75 : -75);
              return (
                <g key={s} opacity={dimOpp(oi) ? 0.3 : 1}>
                  <line x1={o.x} y1={Y.opp + 22} x2={sx} y2={Y.sol - 22} stroke={isLit(oi, s) ? SC.mint : SC.line} strokeWidth={isLit(oi, s) ? 4 : 2} opacity={clamp((t - 13.2 - oi * 0.6 - si * 0.3) / 0.4)} />
                  {EXPS[s] && <line x1={sx} y1={Y.sol + 22} x2={sx} y2={Y.exp - 22} stroke={isLit(oi, s) ? SC.mint : SC.line} strokeWidth={isLit(oi, s) ? 4 : 2} strokeDasharray="5 4" opacity={clamp((t - 20.2 - oi * 0.5) / 0.4)} />}
                </g>
              );
            })}
          </g>
        ))}
        {/* nodes */}
        <Node x={480} y={Y.out} w={300} label="More weekly orders from regulars" c={SC.mint} s={back((t - 0.3) / 0.5)} lit={chosen} />
        {OPPS.map((o, oi) => (
          <g key={o.n}>
            <Node x={o.x} y={Y.opp} w={200} label={o.n} c={SC.design} s={back((t - 6.5 - oi * 0.5) / 0.5)} lit={isLit(oi)} dim={dimOpp(oi)} />
            {o.sols.map((s, si) => {
              const sx = o.x + (si ? 75 : -75);
              return (
                <g key={s}>
                  <Node x={sx} y={Y.sol} w={140} label={s} c={SC.discover} s={back((t - 13.5 - oi * 0.6 - si * 0.3) / 0.4)} lit={isLit(oi, s)} dim={dimOpp(oi) || (chosen && oi === 0 && s !== 'One-tap reorder')} />
                  {EXPS[s] && <Node x={sx} y={Y.exp} w={140} label={EXPS[s]} c={SC.build} s={back((t - 20.5 - oi * 0.5) / 0.4)} lit={isLit(oi, s)} dim={dimOpp(oi)} />}
                </g>
              );
            })}
          </g>
        ))}
        {/* level labels */}
        {[{ y: Y.out, l: 'OUTCOME', at: 0.5 }, { y: Y.opp, l: 'OPPORTUNITIES', at: 6.5 }, { y: Y.sol, l: 'SOLUTIONS', at: 13.5 }, { y: Y.exp, l: 'EXPERIMENTS', at: 20.5 }].map(lv => (
          <text key={lv.l} x={24} y={lv.y - 30} fontSize={11} fontWeight={800} letterSpacing={1} fill={SC.muted} opacity={clamp((t - lv.at) / 0.5)}>{lv.l}</text>
        ))}
        {chosen && <text x={480} y={500} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.mint} opacity={clamp((t - 25.4) / 0.4)}>Test this branch first. The rest wait, on purpose.</text>}
      </g>

      {fin > 0 && [{ x: 200, n: 'One outcome', l: 'On top, measurable', c: SC.mint }, { x: 480, n: 'Many options', l: 'Opportunities, then solutions', c: SC.design }, { x: 760, n: 'Cheap tests', l: 'Before building', c: SC.build }].map((f, i) => {
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
