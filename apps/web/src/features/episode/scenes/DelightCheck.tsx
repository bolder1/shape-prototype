'use client';
// Scene for pr.3-2: Gullak's playful build. On Monday the coin rain, the confetti and the tap jingle are fun; by Friday
// Meera has waited behind the coins 15 times. Then the sum (`delightCost`: duration × times a month, drawn as bars),
// the wrong moment (a winking piggy on a failed payment, a party popper on a late fee), what earns a flourish (the Goa
// jar bursting once at ₹15,000), the small everyday feedback that stays (the tick, the piggy rolling with her finger),
// and the review board sorted by `delightVerdict`. `MomentTile` draws every one of `GULLAK_MOMENTS` and is shared with
// the Run the delight review game. Pure function of t (0–36).
import { DELIGHT_LANES, GULLAK_MOMENTS, delightCost, delightVerdict, type DelightLane, type GullakMoment } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';
import { INK, INK_MUTED } from './EaseCurves';
import { Coin, GULLAK, GULLAK_SOFT, PAID, Piggy } from './MicroAnatomy';
import { tileLoop } from './MotionMeaning';

const W = 960, H = 540;
export const MOMENT_NAME: Record<GullakMoment, string> = {
  'coin-rain': 'Coin rain on launch', 'unlock-dance': 'Piggy dance after the PIN', 'pay-confetti': 'Confetti on every payment',
  'tap-jingle': 'Jingle on every tap', 'balance-sparkle': 'Sparkling balance', 'failed-wink': 'Winking piggy on a failure',
  'late-fee-party': 'Party popper on a late fee', 'goal-burst': 'Goa jar bursts at ₹15,000', 'tick-draw': 'Tick and one buzz',
  'pull-coin': 'Piggy rolls as you pull',
};
export const LANE_NAME: Record<DelightLane, string> = { keep: 'Keep it', often: 'Too often', blocking: 'In the way', tone: 'Wrong tone' };
const CONFETTI = ['#5B2EA6', '#F5B301', '#D9718F', '#067647', '#1570EF'];

/** Seconds as "72 s" or "2 min 15 s". */
export const fmtCost = (s: number) => (s < 60 ? `${s} s` : `${Math.floor(s / 60)} min${s % 60 ? ` ${Math.round(s % 60)} s` : ''}`);

/** Falling bits of confetti, `k` 0 → 1. */
function Confetti({ k, n = 18, seed = 1 }: { k: number; n?: number; seed?: number }) {
  if (k <= 0 || k >= 1) return null;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const r = Math.sin((i + 1) * 12.9898 * seed) * 43758.5453, u = r - Math.floor(r);
        const x = 10 + u * 180, y = lerp(-10, 160, k) * (0.6 + u * 0.5) - 10;
        return <rect key={i} x={x} y={y} width={6} height={3.5} rx={1} fill={CONFETTI[i % CONFETTI.length]} transform={`rotate(${(u * 360 + k * 500) % 360} ${x + 3} ${y + 2})`} />;
      })}
    </g>
  );
}

function Balance({ x, y, size = 26, rot = 0 }: { x: number; y: number; size?: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <text y={-size * 0.9} textAnchor="middle" fontSize={size * 0.42} fontWeight={800} fill={INK_MUTED}>Balance</text>
      <text textAnchor="middle" fontSize={size} fontWeight={900} fill={INK}>₹3,480</text>
    </g>
  );
}

/** One of Gullak's playful moments in a 200 × 150 frame, `k` (0 → 1) through its loop. */
export function MomentTile({ moment, k, x = 0, y = 0 }: { moment: GullakMoment; k: number; x?: number; y?: number }) {
  const id = `gm-${moment}`;
  return (
    <g transform={`translate(${x} ${y})`}>
      <clipPath id={id}><rect width={200} height={150} rx={16} /></clipPath>
      <rect width={200} height={150} rx={16} fill="#FFFFFF" stroke="#D0D5DD" strokeWidth={1.5} />
      <g clipPath={`url(#${id})`}>
        {moment === 'coin-rain' && (() => {
          const raining = k < 0.62;
          return (
            <g>
              {!raining && <g opacity={clamp((k - 0.62) / 0.06)}><Balance x={100} y={84} /></g>}
              {raining && Array.from({ length: 16 }, (_, i) => {
                const u = ((i * 37) % 16) / 16, fall = (k / 0.62 + u) % 1;
                return <Coin key={i} x={12 + ((i * 53) % 176)} y={lerp(-12, 160, fall)} r={9} />;
              })}
              {raining && <text x={100} y={142} textAnchor="middle" fontSize={10} fontWeight={800} fill={INK_MUTED}>waiting for the balance…</text>}
            </g>
          );
        })()}
        {moment === 'unlock-dance' && (() => {
          const dancing = k < 0.83, f = k / 0.83;
          return (
            <g>
              <text x={16} y={24} fontSize={10.5} fontWeight={800} fill={PAID}>UPI PIN ✓</text>
              {dancing
                ? <Piggy x={100 + Math.sin(f * Math.PI * 8) * 22} y={84 - Math.abs(Math.sin(f * Math.PI * 8)) * 26} r={24} rot={Math.sin(f * Math.PI * 8) * 20} />
                : (
                  <g opacity={clamp((k - 0.83) / 0.05)}>
                    <text x={16} y={56} fontSize={13} fontWeight={900} fill={INK}>Pay Raju</text>
                    <rect x={16} y={90} width={168} height={34} rx={10} fill={GULLAK} />
                    <text x={100} y={112} textAnchor="middle" fontSize={11.5} fontWeight={800} fill="#FFFFFF">Pay ₹240</text>
                  </g>
                )}
            </g>
          );
        })()}
        {moment === 'pay-confetti' && (
          <g>
            <circle cx={100} cy={60} r={22} fill={PAID} />
            <path d="M90 60 L97 67 L111 52" fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
            <text x={100} y={108} textAnchor="middle" fontSize={12} fontWeight={900} fill={INK}>₹240 paid to Raju</text>
            <Confetti k={k / 0.5} n={22} />
            <text x={186} y={140} textAnchor="end" fontSize={10} fontWeight={800} fill={INK_MUTED}>60 times a month</text>
          </g>
        )}
        {moment === 'tap-jingle' && (() => {
          const f = (k * 3) % 1;
          return (
            <g>
              {[0, 1, 2].map(i => (
                <rect key={i} x={16 + i * 58} y={92} width={52} height={32} rx={9} fill={i === Math.floor(k * 3) % 3 && f < 0.15 ? '#46218A' : GULLAK} />
              ))}
              {[0, 1, 2].map(i => {
                const n = (f + i * 0.3) % 1;
                return <text key={i} x={44 + Math.floor(k * 3) % 3 * 58 + (i - 1) * 16} y={lerp(86, 20, n)} textAnchor="middle" fontSize={18} fontWeight={900} fill={GULLAK} opacity={1 - n}>♪</text>;
              })}
              <text x={186} y={140} textAnchor="end" fontSize={10} fontWeight={800} fill={INK_MUTED}>900 taps a month</text>
            </g>
          );
        })()}
        {moment === 'balance-sparkle' && (
          <g>
            <Balance x={100} y={82} rot={Math.sin(k * Math.PI * 6) * 5} />
            {[[40, 40], [160, 46], [150, 104], [52, 108]].map(([sx, sy], i) => {
              const s = Math.max(0, Math.sin((k * 2 + i * 0.25) * Math.PI * 2));
              return <path key={i} d={`M${sx} ${sy - 8 * s} L${sx + 2 * s} ${sy} L${sx} ${sy + 8 * s} L${sx - 2 * s} ${sy} Z M${sx - 8 * s} ${sy} L${sx} ${sy - 2 * s} L${sx + 8 * s} ${sy} L${sx} ${sy + 2 * s} Z`} fill="#F5B301" />;
            })}
          </g>
        )}
        {moment === 'failed-wink' && (
          <g>
            <rect x={12} y={14} width={176} height={30} rx={8} fill="#FEF3F2" />
            <text x={24} y={34} fontSize={11.5} fontWeight={900} fill="#B42318">Payment failed · ₹240</text>
            <Piggy x={56} y={94} r={26} rot={Math.sin(k * Math.PI * 4) * 8} wink={k % 0.5 < 0.25} />
            <rect x={92} y={70} width={96} height={42} rx={12} fill={GULLAK_SOFT} />
            <text x={140} y={88} textAnchor="middle" fontSize={11.5} fontWeight={900} fill={GULLAK}>Oopsie! 😜</text>
            <text x={140} y={104} textAnchor="middle" fontSize={10} fontWeight={800} fill={GULLAK}>Try again?</text>
          </g>
        )}
        {moment === 'late-fee-party' && (
          <g>
            <rect x={12} y={14} width={176} height={46} rx={10} fill="#F9FAFB" stroke="#EAECF0" />
            <text x={24} y={33} fontSize={11.5} fontWeight={900} fill={INK}>₹50 late fee added 🎉</text>
            <text x={24} y={50} fontSize={10} fontWeight={700} fill={INK_MUTED}>MSEDCL electricity bill</text>
            <g transform={`translate(52 112) rotate(${-30 + Math.sin(k * Math.PI * 4) * 6})`}>
              <path d="M-10 18 L0 -16 L10 18 Z" fill={GULLAK} />
            </g>
            {Array.from({ length: 10 }, (_, i) => {
              const a = -1.2 + i * 0.22, f = (k * 2) % 1;
              return <circle key={i} cx={52 + Math.cos(a) * 80 * f} cy={96 + Math.sin(a) * 70 * f} r={3} fill={CONFETTI[i % CONFETTI.length]} opacity={1 - f} />;
            })}
          </g>
        )}
        {moment === 'goal-burst' && (() => {
          const fill = clamp(k / 0.35), burst = clamp((k - 0.35) / 0.35);
          return (
            <g>
              <text x={16} y={24} fontSize={10.5} fontWeight={800} fill={INK_MUTED}>Goa jar</text>
              <text x={16} y={42} fontSize={14} fontWeight={900} fill={INK}>₹{Math.round(lerp(14760, 15000, fill)).toLocaleString('en-IN')} / ₹15,000</text>
              <g transform="translate(100 96)">
                <path d="M-30 -30 H30 L25 34 H-25 Z" fill={GULLAK_SOFT} stroke={GULLAK} strokeWidth={2.5} />
                <rect x={-24} y={lerp(18, -24, fill)} width={48} height={lerp(14, 56, fill)} fill="#F5B301" opacity={0.75} />
              </g>
              {burst > 0 && burst < 1 && Array.from({ length: 9 }, (_, i) => {
                const a = -Math.PI + (i / 8) * Math.PI;
                return <Coin key={i} x={100 + Math.cos(a) * 80 * burst} y={70 + Math.sin(a) * 60 * burst + burst * burst * 40} r={7} />;
              })}
              {k > 0.5 && <text x={100} y={146} textAnchor="middle" fontSize={10.5} fontWeight={900} fill={PAID}>Goal reached · once</text>}
            </g>
          );
        })()}
        {moment === 'tick-draw' && (() => {
          const f = clamp(k / 0.15);
          return (
            <g>
              <circle cx={100} cy={64} r={28} fill={PAID} opacity={clamp(f * 3)} />
              <path d="M87 65 L96 74 L114 54" fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - f} />
              <text x={100} y={116} textAnchor="middle" fontSize={12} fontWeight={900} fill={INK}>₹240 paid to Raju</text>
              {k > 0.1 && k < 0.2 && <g stroke={INK_MUTED} strokeWidth={2} strokeLinecap="round"><path d="M58 50 l-8 -4 M58 64 h-9 M58 78 l-8 4 M142 50 l8 -4 M142 64 h9 M142 78 l8 4" /></g>}
              <text x={186} y={140} textAnchor="end" fontSize={10} fontWeight={800} fill={INK_MUTED}>300 ms · one buzz</text>
            </g>
          );
        })()}
        {moment === 'pull-coin' && (() => {
          const pull = k < 0.4 ? clamp(k / 0.4) : 1 - clamp((k - 0.5) / 0.15);
          return (
            <g>
              <Piggy x={100} y={lerp(-12, 24, pull)} r={12} rot={pull * 360} />
              <g transform={`translate(0 ${pull * 38})`}>
                {[0, 1, 2, 3].map(i => <rect key={i} x={12} y={14 + i * 30} width={176} height={24} rx={7} fill="#F2F4F7" />)}
              </g>
              <g transform={`translate(160 ${lerp(60, 98, pull)})`} opacity={k < 0.5 ? 1 : 0}>
                <circle r={9} fill={INK} opacity={0.2} />
              </g>
            </g>
          );
        })()}
      </g>
    </g>
  );
}

const SEGS: { at: number; title: string; sub: string; tiles: GullakMoment[]; bad?: boolean }[] = [
  { at: 0, title: 'Monday: so much fun', sub: 'Gullak’s playful build ships', tiles: ['coin-rain', 'pay-confetti', 'tap-jingle'] },
  { at: 6, title: 'Friday: still waiting', sub: 'Opened 15 times this week, 1.5 s behind the coins each time', tiles: ['coin-rain'], bad: true },
  { at: 12, title: 'Do the sum', sub: 'How long it plays × how often Meera sees it, every month', tiles: [] },
  { at: 18, title: 'The wrong moment', sub: 'Playful on a bad moment reads as mockery', tiles: ['failed-wink', 'late-fee-party'], bad: true },
  { at: 24, title: 'What earns it', sub: 'Rare, earned, and not in the way', tiles: ['goal-burst'] },
  { at: 29, title: 'Small, every day', sub: 'Frequent moments get feedback that costs no time', tiles: ['tick-draw', 'pull-coin'] },
];
const BARS: GullakMoment[] = ['tap-jingle', 'coin-rain', 'unlock-dance', 'pay-confetti', 'balance-sparkle'];

export function DelightCheckScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const seg = [...SEGS].reverse().find(s => t >= s.at)!;
  const fin = p(t, 33, 33.6);
  const enter = p(t, seg.at, seg.at + 0.5);
  const n = seg.tiles.length, scale = n === 1 ? 2 : n === 2 ? 1.7 : 1.35;
  const tw = 200 * scale, gap = 30, x0 = (W - (n * tw + (n - 1) * gap)) / 2;
  const most = Math.max(...BARS.map(m => delightCost(GULLAK_MOMENTS[m])));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Gullak's coin rain, confetti and jingle are fun on Monday and in the way by Friday; their cost a month is added up, a winking piggy on a failed payment and a party on a late fee strike the wrong tone, the savings goal burst is kept, and small everyday feedback stays">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro * (1 - fin)}>
        <text x={W / 2} y={66} textAnchor="middle" fontSize={26} fontWeight={900} fill={seg.bad ? SC.error : SC.text} opacity={enter}>{seg.title}</text>
        <text x={W / 2} y={96} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.muted} opacity={enter}>{seg.sub}</text>
        {seg.tiles.map((m, i) => (
          <g key={m} transform={`translate(${x0 + i * (tw + gap)} ${lerp(140, 124, enter)}) scale(${scale})`} opacity={enter}>
            <MomentTile moment={m} k={tileLoop(t, seg.at + 0.3 + i * 0.4)} />
          </g>
        ))}
        {seg.at === 6 && (
          <g opacity={p(t, 7.5, 8)}>
            <text x={W / 2} y={470} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.muted}>A customer is waiting at the counter. Meera just wants to see whether the ₹600 for a blouse came in.</text>
          </g>
        )}
        {seg.at === 12 && (
          <g transform="translate(150 140)">
            {BARS.map((m, i) => {
              const s = GULLAK_MOMENTS[m], cost = delightCost(s), grow = p(t, 12.4 + i * 0.5, 13.2 + i * 0.5);
              return (
                <g key={m} transform={`translate(0 ${i * 64})`}>
                  <text x={0} y={22} fontSize={14} fontWeight={900} fill={SC.text}>{MOMENT_NAME[m]}</text>
                  <text x={0} y={42} fontSize={12} fontWeight={700} fill={SC.muted}>{s.ms / 1000} s × {s.perMonth} a month</text>
                  <rect x={240} y={8} width={Math.max(4, (cost / most) * 380 * grow)} height={34} rx={8} fill={i === 0 ? SC.error : GULLAK} opacity={0.9} />
                  <text x={240 + Math.max(4, (cost / most) * 380 * grow) + 10} y={31} fontSize={14} fontWeight={900} fill={SC.text} opacity={grow}>{fmtCost(cost)}</text>
                </g>
              );
            })}
          </g>
        )}
      </g>

      {t >= 33 && (
        <g opacity={fin}>
          <text x={W / 2} y={56} textAnchor="middle" fontSize={24} fontWeight={900} fill={SC.text}>The delight review</text>
          {DELIGHT_LANES.map((lane, i) => {
            const ms = (Object.keys(GULLAK_MOMENTS) as GullakMoment[]).filter(m => delightVerdict(GULLAK_MOMENTS[m]) === lane);
            return (
              <g key={lane} transform={`translate(${60 + i * 215} 90)`} opacity={p(t, 33.3 + i * 0.3, 33.8 + i * 0.3)}>
                <rect width={200} height={360} rx={18} fill={SC.surface} stroke={lane === 'keep' ? PAID : SC.line} strokeWidth={2} />
                <text x={20} y={38} fontSize={18} fontWeight={900} fill={lane === 'keep' ? SC.text : SC.error}>{LANE_NAME[lane]}</text>
                {ms.map((m, j) => (
                  <g key={m} transform={`translate(16 ${60 + j * 96})`}>
                    <g transform="scale(0.5)" opacity={lane === 'keep' ? 1 : 0.55}><MomentTile moment={m} k={tileLoop(t, 33 + j * 0.3)} /></g>
                    <text x={108} y={30} fontSize={11.5} fontWeight={800} fill={SC.text}>
                      {MOMENT_NAME[m].split(' ').reduce<string[]>((rows, w) => { const last = rows[rows.length - 1]; if (last && (last + ' ' + w).length <= 11) rows[rows.length - 1] = `${last} ${w}`; else rows.push(w); return rows; }, []).map((r, k) => <tspan key={k} x={108} dy={k ? 15 : 0}>{r}</tspan>)}
                    </text>
                  </g>
                ))}
              </g>
            );
          })}
          <text x={W / 2} y={500} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 34.5, 35)}>Rare, quick and in tune is delight. What’s left is noticed.</text>
        </g>
      )}
    </svg>
  );
}
