'use client';
// Scene for pr.2-3: Dabba's first build, where the logo spins, every card bounces and icons float, so Kiran can't tell
// her rajma chawal went into the cart. Then motion with a job: the meal flies into the cart and the badge counts up
// (where it went), the menu pushes left and the photo grows into its page (where am I), a wrong PIN shakes and a right
// one draws a tick (what changed), Friday's empty slot pulses once (look here), and the decoration is struck out.
// `MotionTile` draws every one of `MEANING_MOTIONS` and is shared with the What is it for? game. Pure function of t (0–34).
import { bezierAt, EASE_CURVES, type MeaningMotion } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';
import { DABBA, DABBA_SOFT, INK, INK_MUTED } from './EaseCurves';

const W = 960, H = 540;
const out = (k: number) => bezierAt(EASE_CURVES.out, clamp(k));
const move = (k: number) => bezierAt(EASE_CURVES.inout, clamp(k));
/** A 2.4-second loop from `start`, as 0 → 1. */
export const tileLoop = (t: number, start = 0, period = 2.4) => ((((t - start) % period) + period) % period) / period;

function Cart({ x, y, n, bump = 0 }: { x: number; y: number; n: number; bump?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-11 -7 H-7 L-3 7 H9 L12 -3 H-5" fill="none" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <circle cx={-1} cy={11} r={1.8} fill={INK} /><circle cx={7} cy={11} r={1.8} fill={INK} />
      <g transform={`translate(11 -10) scale(${1 + bump * 0.25})`}>
        <circle r={8} fill={DABBA} />
        <text y={4} textAnchor="middle" fontSize={10} fontWeight={900} fill="#FFFFFF">{n}</text>
      </g>
    </g>
  );
}

/** One of Dabba's motions in a 200 × 150 frame, `k` (0 → 1) through its loop. */
export function MotionTile({ motion, k, x = 0, y = 0 }: { motion: MeaningMotion; k: number; x?: number; y?: number }) {
  const id = `mt-${motion}`;
  return (
    <g transform={`translate(${x} ${y})`}>
      <clipPath id={id}><rect width={200} height={150} rx={16} /></clipPath>
      <rect width={200} height={150} rx={16} fill="#FFFFFF" stroke="#D0D5DD" strokeWidth={1.5} />
      <g clipPath={`url(#${id})`}>
        {motion === 'fly-to-cart' && (() => {
          const f = out(k / 0.45), landed = k >= 0.45;
          const [sx, sy, ex, ey] = [36, 46, 166, 128];
          const fx = lerp(sx, ex, f), fy = lerp(sy, ey, f) - Math.sin(f * Math.PI) * 40;
          return (
            <g>
              <rect x={14} y={24} width={172} height={44} rx={10} fill="#FFFFFF" stroke="#EAECF0" strokeWidth={1.5} />
              <circle cx={sx} cy={sy} r={12} fill={DABBA} opacity={0.7} />
              <text x={56} y={51} fontSize={11.5} fontWeight={800} fill={INK}>Rajma chawal</text>
              <rect x={0} y={112} width={200} height={38} fill="#F9FAFB" />
              <Cart x={166} y={130} n={landed ? 3 : 2} bump={landed ? clamp(1 - (k - 0.45) / 0.15) : 0} />
              {!landed && <circle cx={fx} cy={fy} r={lerp(12, 5, f)} fill={DABBA} opacity={0.85} />}
            </g>
          );
        })()}
        {motion === 'push-deeper' && (() => {
          const f = k < 0.5 ? move(k / 0.35) : 1 - move((k - 0.5) / 0.35);
          return (
            <g>
              <g transform={`translate(${-60 * f} 0)`} opacity={1 - f * 0.4}>
                <text x={16} y={28} fontSize={12} fontWeight={900} fill={INK}>Menu</text>
                {[0, 1, 2].map(i => <rect key={i} x={16} y={40 + i * 34} width={168} height={26} rx={7} fill={i === 1 ? DABBA_SOFT : '#F2F4F7'} />)}
              </g>
              <g transform={`translate(${200 * (1 - f)} 0)`}>
                <rect width={200} height={150} fill="#FFFFFF" />
                <line x1={0} x2={0} y1={0} y2={150} stroke="#D0D5DD" strokeWidth={2} />
                <text x={16} y={28} fontSize={12} fontWeight={900} fill={INK}>‹ Rajma chawal</text>
                <rect x={16} y={40} width={168} height={60} rx={10} fill={DABBA_SOFT} />
              </g>
              <text x={186} y={140} textAnchor="end" fontSize={10.5} fontWeight={800} fill={INK_MUTED}>{k < 0.5 ? 'deeper →' : '← back'}</text>
            </g>
          );
        })()}
        {motion === 'expand-card' && (() => {
          const f = k < 0.55 ? out(k / 0.4) : 1 - out((k - 0.55) / 0.3);
          return (
            <g>
              {[0, 1, 2].map(i => <rect key={i} x={16} y={20 + i * 42} width={168} height={34} rx={8} fill="#F2F4F7" opacity={1 - f} />)}
              <rect x={lerp(22, 0, f)} y={lerp(64, 0, f)} width={lerp(30, 200, f)} height={lerp(22, 76, f)} rx={lerp(6, 0, f)} fill={DABBA} opacity={0.75} />
              <g opacity={clamp((f - 0.6) / 0.4)}>
                <text x={16} y={100} fontSize={13} fontWeight={900} fill={INK}>Rajma chawal</text>
                <text x={16} y={118} fontSize={10.5} fontWeight={700} fill={INK_MUTED}>₹99 · Tuesday</text>
              </g>
            </g>
          );
        })()}
        {motion === 'sheet-from-button' && (() => {
          const f = k < 0.55 ? out(k / 0.4) : 1 - out((k - 0.55) / 0.3);
          return (
            <g>
              <rect x={16} y={22} width={168} height={30} rx={8} fill="#F2F4F7" />
              <text x={26} y={41} fontSize={11} fontWeight={700} fill={INK}>Deliver to: Hostel B, gate 2</text>
              <g transform={`translate(100 37) scale(${lerp(0.1, 1, f)}) translate(-100 -37)`} opacity={f}>
                <rect x={10} y={30} width={180} height={112} rx={14} fill="#FFFFFF" stroke={DABBA} strokeWidth={1.5} />
                <text x={24} y={56} fontSize={11.5} fontWeight={900} fill={INK}>Change address</text>
                {[0, 1].map(i => <rect key={i} x={24} y={66 + i * 32} width={152} height={24} rx={6} fill="#F2F4F7" />)}
              </g>
            </g>
          );
        })()}
        {motion === 'shake' && (() => {
          const s = k < 0.3 ? Math.sin((k / 0.3) * Math.PI * 6) * 7 * (1 - k / 0.3) : 0;
          const wrong = k < 0.85;
          return (
            <g>
              <text x={100} y={36} textAnchor="middle" fontSize={11.5} fontWeight={800} fill={INK_MUTED}>Enter UPI PIN</text>
              <g transform={`translate(${s} 0)`}>
                <rect x={36} y={50} width={128} height={40} rx={10} fill="#FFFFFF" stroke={wrong ? '#D92D20' : '#D0D5DD'} strokeWidth={2} />
                {[0, 1, 2, 3].map(i => <circle key={i} cx={64 + i * 24} cy={70} r={5} fill={INK} />)}
              </g>
              {wrong && <text x={100} y={114} textAnchor="middle" fontSize={11.5} fontWeight={800} fill="#B42318">Wrong PIN · 2 tries left</text>}
            </g>
          );
        })()}
        {motion === 'check-draw' && (() => {
          const f = out(k / 0.35);
          return (
            <g>
              <circle cx={100} cy={62} r={30} fill={f > 0.02 ? '#067647' : '#FFFFFF'} stroke="#067647" strokeWidth={3} opacity={clamp(f * 3)} />
              <path d="M86 63 L96 73 L115 52" fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - f} />
              <text x={100} y={120} textAnchor="middle" fontSize={12.5} fontWeight={900} fill={INK} opacity={clamp((k - 0.3) / 0.15)}>Order placed for the week</text>
            </g>
          );
        })()}
        {motion === 'skeleton' && (
          <g>
            <defs>
              <linearGradient id={`${id}-g`} x1={0} x2={1}>
                <stop offset="0" stopColor="#F2F4F7" /><stop offset="0.5" stopColor="#FFFFFF" /><stop offset="1" stopColor="#F2F4F7" />
              </linearGradient>
            </defs>
            {[0, 1, 2].map(i => (
              <g key={i} transform={`translate(16 ${18 + i * 42})`}>
                <rect width={34} height={34} rx={8} fill="#EAECF0" />
                <rect x={44} y={4} width={110} height={10} rx={5} fill="#EAECF0" />
                <rect x={44} y={20} width={70} height={10} rx={5} fill="#EAECF0" />
              </g>
            ))}
            <rect x={lerp(-80, 200, k)} y={0} width={80} height={150} fill={`url(#${id}-g)`} opacity={0.7} />
          </g>
        )}
        {motion === 'count-up' && (() => {
          const f = out((k - 0.2) / 0.2);
          return (
            <g>
              <path d="M70 60 H80 L90 95 H122 L130 70 H86" fill="none" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
              <circle cx={96} cy={106} r={4} fill={INK} /><circle cx={118} cy={106} r={4} fill={INK} />
              <clipPath id={`${id}-b`}><circle cx={132} cy={52} r={16} /></clipPath>
              <circle cx={132} cy={52} r={16} fill={DABBA} />
              <g clipPath={`url(#${id}-b)`}>
                <text x={132} y={58 - f * 26} textAnchor="middle" fontSize={16} fontWeight={900} fill="#FFFFFF">2</text>
                <text x={132} y={84 - f * 26} textAnchor="middle" fontSize={16} fontWeight={900} fill="#FFFFFF">3</text>
              </g>
            </g>
          );
        })()}
        {motion === 'pulse-once' && (() => {
          const f = clamp((k - 0.15) / 0.45);
          return (
            <g>
              {['Wed · Paneer roll', 'Thu · Curd rice', 'Fri · Pick by 9 pm'].map((l, i) => (
                <g key={l} transform={`translate(16 ${16 + i * 42})`}>
                  {i === 2 && f > 0 && f < 1 && <rect x={-6 * f} y={-6 * f} width={168 + 12 * f} height={34 + 12 * f} rx={8 + 6 * f} fill="none" stroke={DABBA} strokeWidth={3} opacity={1 - f} />}
                  <rect width={168} height={34} rx={8} fill={i === 2 ? '#FFFFFF' : '#F2F4F7'} stroke={i === 2 ? DABBA : 'none'} strokeWidth={1.5} strokeDasharray={i === 2 ? '4 3' : undefined} />
                  <text x={12} y={22} fontSize={11.5} fontWeight={800} fill={i === 2 ? '#8A3209' : INK}>{l}</text>
                </g>
              ))}
            </g>
          );
        })()}
        {motion === 'logo-spin' && (
          <g transform={`translate(100 70) rotate(${out(k / 0.6) * 360})`}>
            <circle r={34} fill={DABBA} />
            <rect x={-18} y={-10} width={36} height={24} rx={6} fill="#FFFFFF" />
            <rect x={-20} y={-16} width={40} height={8} rx={4} fill="#FFFFFF" />
          </g>
        )}
        {motion === 'logo-spin' && <text x={100} y={132} textAnchor="middle" fontSize={11} fontWeight={800} fill={INK_MUTED}>Every time the app opens</text>}
        {motion === 'bounce-all' && [0, 1, 2, 3].map(i => {
          const b = Math.abs(Math.sin((k * 2 + i * 0.18) * Math.PI)) * 12;
          return <rect key={i} x={14 + (i % 2) * 90} y={18 + Math.floor(i / 2) * 64 - b} width={82} height={52} rx={10} fill={i % 2 ? '#F2F4F7' : DABBA_SOFT} stroke="#EAECF0" />;
        })}
        {motion === 'float-icons' && (
          <g>
            {[0, 1, 2].map(i => <rect key={i} x={16} y={20 + i * 40} width={168} height={30} rx={8} fill="#F2F4F7" />)}
            {Array.from({ length: 7 }, (_, i) => {
              const fx = ((k + i / 7) % 1) * 240 - 20, fy = 20 + ((i * 37) % 110) + Math.sin((k * 2 + i) * Math.PI) * 8;
              return i % 2
                ? <circle key={i} cx={fx} cy={fy} r={7} fill="#F5C26B" opacity={0.85} />
                : <path key={i} d={`M${fx} ${fy - 8} Q${fx + 7} ${fy} ${fx} ${fy + 9} Q${fx - 3} ${fy} ${fx} ${fy - 8} Z`} fill="#D92D20" opacity={0.75} />;
            })}
          </g>
        )}
      </g>
    </g>
  );
}

type Seg = { at: number; tiles: MeaningMotion[]; title: string; job?: string; bad?: boolean };
const SEGS: Seg[] = [
  { at: 0, tiles: ['bounce-all', 'logo-spin', 'float-icons'], title: 'Everything moves. Did the meal go in?', bad: true },
  { at: 6, tiles: ['fly-to-cart', 'count-up'], title: 'Where did it go?', job: 'Shows where something went' },
  { at: 12, tiles: ['push-deeper', 'expand-card'], title: 'Where am I?', job: 'Shows where something came from' },
  { at: 18, tiles: ['shake', 'check-draw'], title: 'Did it work?', job: 'Shows what changed' },
  { at: 24, tiles: ['pulse-once'], title: 'Look here', job: 'Points at the one thing that matters' },
];

export function MotionMeaningScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const seg = [...SEGS].reverse().find(s => t >= s.at)!;
  const fin = p(t, 29, 29.6);
  const n = seg.tiles.length, scale = n === 1 ? 2 : n === 2 ? 1.7 : 1.35;
  const tw = 200 * scale, gap = 30, x0 = (W - (n * tw + (n - 1) * gap)) / 2;
  const enter = p(t, seg.at, seg.at + 0.5);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Dabba's decorative motion is replaced by motion with a job: showing where a meal went, where a page came from, what changed, and where to look">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro * (1 - fin)}>
        <text x={W / 2} y={70} textAnchor="middle" fontSize={26} fontWeight={900} fill={seg.bad ? SC.error : SC.text} opacity={enter}>{seg.title}</text>
        {seg.job && <text x={W / 2} y={100} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.muted} opacity={enter}>{seg.job}</text>}
        {seg.tiles.map((m, i) => (
          <g key={m} transform={`translate(${x0 + i * (tw + gap)} ${lerp(150, 130, enter)}) scale(${scale})`} opacity={enter}>
            <MotionTile motion={m} k={tileLoop(t, seg.at + 0.3 + i * 0.4)} />
          </g>
        ))}
        {seg.bad && (
          <text x={W / 2} y={500} textAnchor="middle" fontSize={14} fontWeight={800} fill={SC.muted} opacity={p(t, 2, 2.5)}>Kiran tapped Add on Tuesday’s rajma chawal. Nothing told her it worked.</text>
        )}
      </g>

      {t >= 29 && (
        <g opacity={fin}>
          <text x={W / 2} y={60} textAnchor="middle" fontSize={24} fontWeight={900} fill={SC.text}>Every motion has a job, or it goes</text>
          {([['fly-to-cart', 'Where it went'], ['check-draw', 'What changed'], ['pulse-once', 'Look here'], ['logo-spin', 'No job: cut it']] as const).map(([m, l], i) => (
            <g key={m} transform={`translate(${70 + i * 210} 110)`} opacity={p(t, 29.3 + i * 0.4, 29.8 + i * 0.4)}>
              <g opacity={i === 3 ? 0.5 : 1}><MotionTile motion={m} k={tileLoop(t, 29.5 + i * 0.3)} /></g>
              {i === 3 && <line x1={10} x2={190} y1={140} y2={10} stroke={SC.error} strokeWidth={4} strokeLinecap="round" opacity={p(t, 31, 31.4)} />}
              <text x={100} y={180} textAnchor="middle" fontSize={15} fontWeight={900} fill={i === 3 ? SC.error : SC.text}>{l}</text>
            </g>
          ))}
          <text x={W / 2} y={360} textAnchor="middle" fontSize={14} fontWeight={700} fill={SC.muted} opacity={p(t, 31.5, 32)}>Turn a motion off. If nobody loses any understanding, it was decoration.</text>
        </g>
      )}
    </svg>
  );
}
