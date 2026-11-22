'use client';
// Scene for bz.1-1: four business models as money-flow diagrams (subscription, marketplace, advertising, freemium), one per
// beat with coins travelling along the arrows; then all four side by side with what each model makes design optimise.
// Pure function of t (0–34).
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;

const Node = ({ x, y, label, c }: { x: number; y: number; label: string; c: string }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-62} y={-28} width={124} height={56} rx={16} fill={SC.surface} stroke={c} strokeWidth={3} />
    <text y={6} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.text}>{label}</text>
  </g>
);
const Arrow = ({ x1, y1, x2, y2, label, c = SC.muted }: { x1: number; y1: number; x2: number; y2: number; label?: string; c?: string }) => (
  <g>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={2.5} markerEnd="url(#bm-arrow)" />
    {label && <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 10} textAnchor="middle" fontSize={12} fontWeight={800} fill={SC.muted}>{label}</text>}
  </g>
);
/** A coin travelling from (x1, y1) to (x2, y2), looping every `period` seconds. */
const Coin = ({ x1, y1, x2, y2, t, offset = 0, period = 1.6, c = '#f59e0b' }: { x1: number; y1: number; x2: number; y2: number; t: number; offset?: number; period?: number; c?: string }) => {
  const k = (((t + offset) % period) + period) % period / period;
  return <g transform={`translate(${lerp(x1, x2, k)} ${lerp(y1, y2, k)})`} opacity={Math.sin(k * Math.PI)}><circle r={9} fill={c} /><text y={4} textAnchor="middle" fontSize={10} fontWeight={900} fill="#fff">₹</text></g>;
};

/** The arrowhead the money flows use. Render once inside any SVG that draws a MoneyFlow. */
export const MoneyFlowDefs = () => <defs><marker id="bm-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill={SC.muted} /></marker></defs>;

/** One model's money flow, drawn in a 440 × 220 box. Shared with the Follow the money game. */
export function MoneyFlow({ model, t }: { model: string; t: number }) {
  switch (model) {
    case 'sub': return (
      <g>
        <Node x={80} y={110} label="User" c={SC.discover} /><Node x={360} y={110} label="App" c={SC.design} />
        <Arrow x1={142} y1={110} x2={298} y2={110} label="₹199 every month" />
        {[0, 0.53, 1.06].map(o => <Coin key={o} x1={142} y1={110} x2={298} y2={110} t={t} offset={o} />)}
        <text x={220} y={170} textAnchor="middle" fontSize={12} fontWeight={700} fill={SC.muted}>…until they cancel</text>
      </g>
    );
    case 'mkt': return (
      <g>
        <Node x={70} y={110} label="Buyer" c={SC.discover} /><Node x={220} y={110} label="Platform" c={SC.design} /><Node x={370} y={110} label="Seller" c={SC.grow} />
        <Arrow x1={132} y1={110} x2={158} y2={110} /><Arrow x1={282} y1={110} x2={308} y2={110} />
        <text x={145} y={70} textAnchor="middle" fontSize={12} fontWeight={800} fill={SC.muted}>₹500 order</text>
        <text x={295} y={70} textAnchor="middle" fontSize={12} fontWeight={800} fill={SC.muted}>₹400 to seller</text>
        <text x={220} y={170} textAnchor="middle" fontSize={12} fontWeight={800} fill={SC.mint}>Keeps ₹100 (20%)</text>
        <Coin x1={70} y1={110} x2={220} y2={110} t={t} period={1.4} /><Coin x1={220} y1={110} x2={370} y2={110} t={t} offset={0.7} period={1.4} />
      </g>
    );
    case 'ads': return (
      <g>
        <Node x={80} y={60} label="Advertiser" c={SC.build} /><Node x={220} y={160} label="App" c={SC.design} /><Node x={360} y={60} label="User" c={SC.discover} />
        <Arrow x1={110} y1={88} x2={190} y2={132} label="₹ per view" /><Arrow x1={250} y1={132} x2={330} y2={88} label="Free content" />
        <Coin x1={110} y1={88} x2={190} y2={132} t={t} /><Coin x1={110} y1={88} x2={190} y2={132} t={t} offset={0.8} />
        <text x={360} y={112} textAnchor="middle" fontSize={11} fontWeight={700} fill={SC.muted}>pays with attention</text>
      </g>
    );
    case 'free': return (
      <g>
        {Array.from({ length: 24 }, (_, i) => <circle key={i} cx={30 + (i % 8) * 26} cy={70 + Math.floor(i / 8) * 34} r={9} fill={i === 13 ? '#f59e0b' : SC.line} />)}
        <Node x={370} y={110} label="App" c={SC.design} />
        <Arrow x1={240} y1={110} x2={308} y2={110} />
        <text x={274} y={134} textAnchor="middle" fontSize={12} fontWeight={800} fill={SC.muted}>₹149/month</text>
        <Coin x1={186} y1={104} x2={308} y2={110} t={t} />
        <text x={110} y={190} textAnchor="middle" fontSize={12} fontWeight={700} fill={SC.muted}>23 free · 1 upgrades</text>
      </g>
    );
    default: return null;
  }
}

const MODELS = [
  { id: 'sub', n: 'Subscription', at: 0, focus: 'Retention' },
  { id: 'mkt', n: 'Marketplace', at: 6, focus: 'Trust on both sides' },
  { id: 'ads', n: 'Advertising', at: 12, focus: 'Attention, used fairly' },
  { id: 'free', n: 'Freemium', at: 18, focus: 'The upgrade moment' },
];

export function BusinessModelsScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const grid = t >= 24;
  const cur = MODELS.reduce((k, m, i) => (t >= m.at ? i : k), 0);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: money flows in four business models">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <MoneyFlowDefs />
      <g opacity={1 - fin}>
        {!grid && (
          <g key={cur} opacity={clamp((t - MODELS[cur].at) / 0.4) * (1 - p(t, MODELS[cur].at + 5.6, MODELS[cur].at + 6))}>
            <text x={480} y={110} textAnchor="middle" fontSize={30} fontWeight={800} fill={SC.text}>{MODELS[cur].n}</text>
            <g transform={`translate(260 150) scale(${clamp(back((t - MODELS[cur].at) / 0.5))})`}><MoneyFlow model={MODELS[cur].id} t={t} /></g>
          </g>
        )}
        {grid && t < 29.4 && (
          <g opacity={clamp((t - 24) / 0.5)}>
            {MODELS.map((m, i) => (
              <g key={m.id} transform={`translate(${30 + (i % 2) * 460} ${40 + Math.floor(i / 2) * 240}) scale(${clamp(back((t - 24.2 - i * 0.25) / 0.5))})`}>
                <rect width={440} height={220} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={20} y={30} fontSize={16} fontWeight={800} fill={SC.text}>{m.n}</text>
                <text x={420} y={30} textAnchor="end" fontSize={13} fontWeight={800} fill={SC.mint}>Design for: {m.focus}</text>
                <g transform="translate(0 20) scale(0.95)"><MoneyFlow model={m.id} t={t} /></g>
              </g>
            ))}
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Four models', l: 'Sub · market · ads · freemium', c: SC.discover }, { x: 480, n: 'Who pays?', l: 'For what, how often', c: SC.design }, { x: 760, n: 'Design follows', l: 'The model sets the goal', c: SC.mint }].map((f, i) => {
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
