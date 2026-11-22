'use client';
// Scene for ia.2-1: the four-screen happy path of a password reset, then edge cases branch off each step. Three get a
// way back; the expired code first ends in a dead end ("Error. Start again."), which is struck out and replaced by
// "Send a new code". Then four questions to ask of every step. Pure function of t (0–34).
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
/** The happy path, in order. Shared with the Branch the flow game. */
export const STEPS = [
  { id: 'email', n: 'Enter email' },
  { id: 'code', n: 'Enter code' },
  { id: 'password', n: 'New password' },
  { id: 'done', n: 'Signed in' },
] as const;
const CX = [150, 370, 590, 810];
const EDGES = [
  { bad: 'Typo: gmial.com', fix: 'Did you mean gmail.com?' },
  { bad: 'Code expired', fix: 'Send a new code' },
  { bad: 'Too short', fix: 'Show the rule as they type' },
  { bad: 'Was mid-checkout', fix: 'Back to checkout' },
];

function Screen({ i, cx, lit }: { i: number; cx: number; lit: number }) {
  const x = cx - 70;
  return (
    <g>
      <rect x={x} y={80} width={140} height={130} rx={14} fill={SC.surface} stroke={lit > 0 ? SC.mint : SC.line} strokeWidth={lit > 0 ? 3 : 2} />
      {i === 0 && <><rect x={x + 18} y={120} width={104} height={20} rx={5} fill="none" stroke={SC.muted} strokeWidth={1.5} /><rect x={x + 18} y={156} width={104} height={22} rx={6} fill={SC.mint} opacity={0.8} /></>}
      {i === 1 && [0, 1, 2, 3, 4, 5].map(k => <rect key={k} x={x + 16 + k * 18} y={128} width={14} height={20} rx={3} fill="none" stroke={SC.muted} strokeWidth={1.5} />)}
      {i === 2 && <><rect x={x + 18} y={120} width={104} height={20} rx={5} fill="none" stroke={SC.muted} strokeWidth={1.5} />{[0, 1, 2, 3, 4, 5].map(k => <circle key={k} cx={x + 30 + k * 10} cy={130} r={2.5} fill={SC.text} />)}<rect x={x + 18} y={156} width={104} height={22} rx={6} fill={SC.mint} opacity={0.8} /></>}
      {i === 3 && <><circle cx={cx} cy={140} r={24} fill={SC.mint} opacity={0.25} /><path d={`M${cx - 11} ${140} l8 8 l15 -16`} fill="none" stroke={SC.mint} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /></>}
      <text x={cx} y={100} textAnchor="middle" fontSize={12} fontWeight={800} fill={SC.muted}>{i + 1}</text>
      <text x={cx} y={68} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.text}>{STEPS[i].n}</text>
    </g>
  );
}

export function HappyPathScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const travel = p(t, 0.6, 5.2);                         // the dot walks the happy path
  const dotX = lerp(CX[0], CX[3], travel);
  const strike = p(t, 20.2, 20.8), deadFade = 1 - p(t, 21, 21.6);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a password reset's happy path and the edge cases that branch off it">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {/* arrows and the travelling dot sit behind the screens */}
        {[0, 1, 2].map(i => (
          <g key={i}>
            <line x1={CX[i] + 70} y1={145} x2={CX[i + 1] - 78} y2={145} stroke={SC.mint} strokeWidth={3} />
            <path d={`M${CX[i + 1] - 80} 138 l9 7 l-9 7`} fill="none" stroke={SC.mint} strokeWidth={3} strokeLinejoin="round" />
          </g>
        ))}
        {t < 6 && <circle cx={dotX} cy={145} r={9} fill={SC.mint} />}
        {STEPS.map((s, i) => <Screen key={s.id} i={i} cx={CX[i]} lit={t < 6 ? (travel >= i / 3 - 0.01 ? 1 : 0) : 0} />)}
        <text x={480} y={30} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.mint} opacity={1 - p(t, 5.6, 6.2)}>The happy path: everything goes right</text>

        {/* edge cases branch down from each step */}
        {EDGES.map((e, i) => {
          const at = 6.4 + i * 0.9, k = p(t, at, at + 0.5), cx = CX[i];
          if (t < at) return null;
          return (
            <g key={e.bad}>
              <line x1={cx} y1={210} x2={cx} y2={lerp(210, 288, k)} stroke={SC.error} strokeWidth={2.5} strokeDasharray="6 5" />
              <g transform={`translate(${cx} 313) scale(${clamp(back((t - at - 0.3) / 0.4))})`}>
                <rect x={-88} y={-24} width={176} height={48} rx={12} fill={SC.surface} stroke={SC.error} strokeWidth={2} />
                <text y={5} textAnchor="middle" fontSize={14} fontWeight={800} fill={SC.error}>{e.bad}</text>
              </g>
            </g>
          );
        })}

        {/* ways back: three at once, the expired code later */}
        {EDGES.map((e, i) => {
          const at = i === 1 ? 21 : 12.4 + [0, 0, 0.8, 1.6][i], k = p(t, at, at + 0.8), cx = CX[i];
          if (t < at) return null;
          return (
            <g key={e.fix}>
              <path d={`M${cx + 88} 313 C${cx + 112} 313 ${cx + 104} 214 ${cx + 72} 200`} pathLength={1} fill="none" stroke={SC.mint} strokeWidth={3} strokeDasharray={`${k} 1`} />
              <text x={cx} y={366} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.mint} opacity={clamp((t - at - 0.5) / 0.4)}>{e.fix}</text>
            </g>
          );
        })}

        {/* the dead end */}
        {t >= 18.2 && deadFade > 0 && (
          <g opacity={deadFade}>
            <path d={`M${CX[1]} 337 L${CX[1]} 398 Q${CX[1]} 408 ${CX[1] - 10} 408 L40 408 Q30 408 30 398 L30 150`} pathLength={1} fill="none" stroke={SC.error} strokeWidth={2.5} strokeDasharray={`${p(t, 18.2, 19)} 1`} />
            <text x={(CX[0] + CX[1]) / 2} y={440} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.error} opacity={clamp((t - 18.8) / 0.4)}>“Error. Start again.”</text>
            {strike > 0 && <line x1={180} x2={lerp(180, 340, strike)} y1={435} y2={435} stroke={SC.error} strokeWidth={3} />}
          </g>
        )}

        {/* four questions */}
        {t >= 24 && ['Wrong?', 'Slow?', 'Missing?', 'Interrupted?'].map((q, i) => (
          <g key={q} transform={`translate(${255 + i * 150} 470) scale(${clamp(back((t - 24.3 - i * 0.4) / 0.4))})`}>
            <rect x={-62} y={-20} width={124} height={40} rx={20} fill={SC.surface} stroke={SC.design} strokeWidth={2} />
            <text y={6} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.text}>{q}</text>
          </g>
        ))}
        {t >= 24 && <text x={480} y={424} textAnchor="middle" fontSize={14} fontWeight={700} fill={SC.muted} opacity={clamp((t - 24) / 0.4)}>Ask at every step:</text>}
      </g>

      {fin > 0 && [{ x: 200, n: 'Happy path', l: 'One route where it all works', c: SC.discover }, { x: 480, n: 'Branches', l: 'Wrong · slow · missing · interrupted', c: SC.design }, { x: 760, n: 'Way back', l: 'Every branch rejoins the path', c: SC.mint }].map((f, i) => {
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
