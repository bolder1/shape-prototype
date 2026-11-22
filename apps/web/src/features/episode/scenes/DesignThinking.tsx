'use client';
// Scene for fd.1-3: the myth (a big workshop that changes nothing) versus the reality (a loop of cheap tries and real learning).
// Pure function of t (seconds, 0–34).
import { CheckIcon, QuestionIcon, SmileyIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, lerp, p, Pen, SC } from './shared';

const W = 960, H = 540;
const NOTE_COLORS = ['#FDE68A', '#BFDBFE', '#FBCFE8', '#BBF7D0', '#DDD6FE'];
// 28 sticky notes on the wall, in a loose grid.
const NOTES = Array.from({ length: 28 }, (_, i) => ({ x: 250 + (i % 7) * 66 + ((i * 13) % 11) - 5, y: 130 + Math.floor(i / 7) * 62 + ((i * 7) % 9) - 4, r: ((i * 37) % 13) - 6, c: NOTE_COLORS[i % 5] }));

// The loop: four stations on a circle.
const LOOP = { x: 250, y: 290, r: 120 };
const STATIONS = ['Understand', 'Frame', 'Try', 'Learn'].map((label, i) => {
  const a = -Math.PI / 2 + (i * Math.PI) / 2;
  return { label, x: LOOP.x + Math.cos(a) * LOOP.r, y: LOOP.y + Math.sin(a) * LOOP.r, at: 10.6 + i * 1.1 };
});

/** Five testers; the first round confuses three of them, the second round lands with everyone. */
const TESTERS = [0, 1, 2, 3, 4].map(i => ({ x: 600 + i * 66, confused: i === 1 || i === 2 || i === 4 }));

export function DesignThinkingScene({ t }: { t: number }) {
  const myth = 1 - p(t, 9.4, 10.2);
  const loopDraw = p(t, 10.2, 14.6);
  const spin = t > 23.6 ? (t - 23.6) * 1.4 : 0;     // the loop goes round again
  const round2 = t >= 25.4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: the design thinking myth versus the reality">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />

      {/* ================= MYTH: the workshop ================= */}
      {myth > 0 && (
        <g opacity={myth}>
          <text x={W / 2} y={70} textAnchor="middle" fontSize={22} fontWeight={800} fill={SC.text}>
            {t < 3 ? 'Workshop · Day 1' : t < 6 ? 'Workshop · Day 2' : '3 weeks later…'}
          </text>
          <rect x={220} y={100} width={520} height={300} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
          {NOTES.map((n, i) => {
            const k = back((t - (0.3 + i * 0.16)) / 0.4);
            const fall = p(t, 6.6 + (i % 9) * 0.25, 7.8 + (i % 9) * 0.25) * (i % 3 === 0 ? 0 : 1);   // most notes drop off the wall
            if (t < 0.3 + i * 0.16) return null;
            return (
              <rect key={i} x={n.x} y={n.y + fall * 260} width={50} height={46} rx={4} fill={n.c}
                transform={`rotate(${n.r + fall * 40} ${n.x + 25} ${n.y + 23 + fall * 260})`} opacity={clamp(k) * (1 - fall * 0.7)} />
            );
          })}
          {/* celebration, then nothing */}
          {t > 4.6 && t < 6.2 && Array.from({ length: 14 }, (_, i) => {
            const k = p(t, 4.6, 6.2), a = (i / 14) * Math.PI * 2;
            return <circle key={i} cx={480 + Math.cos(a) * 200 * k} cy={260 + Math.sin(a) * 120 * k - 60 * k} r={5} fill={NOTE_COLORS[i % 5]} opacity={1 - k} />;
          })}
          {t > 6.4 && (
            <g transform={`translate(${W / 2} 470)`} opacity={clamp((t - 6.4) / 0.4)}>
              <rect x={-150} y={-20} width={300} height={40} rx={12} fill={SC.surface} stroke={SC.line} />
              <text y={6} textAnchor="middle" fontSize={15} fontWeight={700} fill={SC.muted}>Product changes shipped: <tspan fill={SC.error} fontWeight={800}>0</tspan></text>
            </g>
          )}
          {t > 7.8 && (
            <g transform={`translate(${W / 2} 250) rotate(-12) scale(${back((t - 7.8) / 0.4)})`}>
              <rect x={-170} y={-38} width={340} height={76} rx={10} fill="none" stroke={SC.error} strokeWidth={6} />
              <text y={14} textAnchor="middle" fontSize={40} fontWeight={900} letterSpacing={6} fill={SC.error}>MYTH</text>
            </g>
          )}
        </g>
      )}

      {/* ================= REALITY: the loop ================= */}
      {t >= 9.8 && (
        <g opacity={clamp((t - 9.8) / 0.5)}>
          <text x={LOOP.x} y={84} textAnchor="middle" fontSize={15} fontWeight={800} letterSpacing={2} fill={SC.mint}>REALITY: A LOOP</text>
          <circle cx={LOOP.x} cy={LOOP.y} r={LOOP.r} fill="none" stroke={SC.line} strokeWidth={10} />
          <circle cx={LOOP.x} cy={LOOP.y} r={LOOP.r} fill="none" stroke={SC.mint} strokeWidth={10} strokeLinecap="round"
            pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - loopDraw} transform={`rotate(-90 ${LOOP.x} ${LOOP.y})`} />
          {/* a pulse travelling round when the team loops back */}
          {spin > 0 && (() => { const a = -Math.PI / 2 + spin * Math.PI; return <circle cx={LOOP.x + Math.cos(a) * LOOP.r} cy={LOOP.y + Math.sin(a) * LOOP.r} r={13} fill={SC.mint} opacity={0.9} />; })()}
          {STATIONS.map((s, i) => {
            const k = back((t - s.at) / 0.45);
            const active = (i === 2 && t >= 16 && t < 23.6) || (i === 3 && t >= 23.6 && t < 25.4) || (i === 2 && t >= 25.4 && t < 29);
            return t >= s.at && (
              <g key={s.label} transform={`translate(${s.x} ${s.y}) scale(${clamp(k) * (active ? 1.12 : 1)})`}>
                <circle r={34} fill={active ? SC.mint : SC.surface} stroke={SC.mint} strokeWidth={3} />
                <text y={5} textAnchor="middle" fontSize={12.5} fontWeight={800} fill={active ? '#fff' : SC.text}>{s.label}</text>
              </g>
            );
          })}
          <text x={LOOP.x} y={LOOP.y + 6} textAnchor="middle" fontSize={14} fontWeight={700} fill={SC.muted} opacity={p(t, 14.6, 15.2)}>{round2 ? 'Round 2' : 'Round 1'}</text>
        </g>
      )}

      {/* ---- try cheaply: paper vs built ---- */}
      {t >= 16 && t < 20.4 && (
        <g opacity={clamp((t - 16) / 0.4) * (1 - p(t, 19.8, 20.4))}>
          <text x={560} y={130} fontSize={15} fontWeight={700} fill={SC.muted}>The cost of finding out you’re wrong</text>
          {[{ label: 'Paper prototype', sub: '1 hour · ₹0', w: 40, c: SC.mint }, { label: 'Fully built app', sub: '3 months · ₹8 lakh', w: 230, c: SC.error }].map((b, i) => {
            const k = p(t, 16.4 + i * 0.6, 17.4 + i * 0.6);
            return (
              <g key={b.label} transform={`translate(560 ${180 + i * 80})`}>
                <text y={-8} fontSize={13} fontWeight={700} fill={SC.text}>{b.label}</text>
                <rect y={0} width={Math.max(8, b.w * k)} height={30} rx={8} fill={b.c} />
                <text x={Math.max(8, b.w * k) + 10} y={20} fontSize={13} fontWeight={800} fill={SC.text} opacity={k}>{b.sub}</text>
              </g>
            );
          })}
        </g>
      )}

      {/* ---- the paper prototype being tested ---- */}
      {t >= 19.8 && (
        <g opacity={clamp((t - 19.8) / 0.4) * (1 - p(t, 29.2, 29.8))}>
          <g transform={`translate(732 190) rotate(${round2 ? 0 : -3})`}>
            <rect x={-70} y={-80} width={140} height={160} rx={10} fill="#FFFDF5" stroke="#1E2A4A" strokeWidth={2} strokeDasharray={round2 ? undefined : '6 4'} />
            <path d="M-50 -55 Q-20 -62 10 -55 T50 -55" stroke="#1E2A4A" strokeWidth={2} fill="none" />
            <rect x={-50} y={-30} width={100} height={22} rx={4} fill="none" stroke="#1E2A4A" strokeWidth={2} />
            <rect x={-50} y={0} width={100} height={22} rx={4} fill="none" stroke="#1E2A4A" strokeWidth={2} />
            <rect x={-40} y={40} width={80} height={24} rx={12} fill={round2 ? '#2BC08A' : '#1E2A4A'} />
            <text y={-90} textAnchor="middle" fontSize={12} fontWeight={800} fill={SC.muted}>{round2 ? 'Version 2' : 'Version 1 (paper)'}</text>
          </g>
          {TESTERS.map((tt, i) => {
            const k = back((t - (20.4 + i * 0.25)) / 0.4);
            const react1 = t >= 21.6 + i * 0.2, react2 = round2 && t >= 26.4 + i * 0.2;
            const happy = react2 || (react1 && !tt.confused && !round2);
            const confused = react1 && tt.confused && !react2;
            return (
              <g key={i} transform={`translate(${tt.x} 380) scale(${clamp(k)})`}>
                <circle cy={-30} r={16} fill="#E8C9AE" />
                <rect x={-18} y={-12} width={36} height={44} rx={13} fill={[SC.discover, SC.design, SC.grow, SC.build, SC.discover][i]} opacity={0.85} />
                {(happy || confused) && (
                  <g transform={`translate(0 -70) scale(${back(((react2 ? t - (26.4 + i * 0.2) : t - (21.6 + i * 0.2))) / 0.35)})`}>
                    <circle r={15} fill={happy ? SC.mint : SC.error} />
                    {happy ? <SmileyIcon x={-10} y={-10} width={20} height={20} color="#fff" weight="bold" /> : <QuestionIcon x={-10} y={-10} width={20} height={20} color="#fff" weight="bold" />}
                  </g>
                )}
              </g>
            );
          })}
          <g transform="translate(732 460)">
            <rect x={-110} y={-20} width={220} height={40} rx={12} fill={SC.surface} stroke={round2 && t >= 27.6 ? SC.mint : SC.line} strokeWidth={2} />
            <text y={6} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.text}>
              Understood it: <tspan fill={round2 && t >= 27.6 ? SC.mint : t >= 22.6 ? SC.error : SC.text}>{round2 && t >= 27.6 ? '5 / 5' : t >= 22.6 ? '2 / 5' : '…'}</tspan>
            </text>
          </g>
          {round2 && t >= 27.6 && (
            <g transform={`translate(860 120) scale(${back((t - 27.6) / 0.4)})`}><circle r={22} fill={SC.mint} /><CheckIcon x={-13} y={-13} width={26} height={26} color="#fff" weight="bold" /></g>
          )}
        </g>
      )}

      {/* ---- finale ---- */}
      {t >= 29.6 && (
        <g transform={`translate(${lerp(732, 700, p(t, 29.6, 30.4))} 300)`} opacity={p(t, 29.6, 30.4)}>
          <rect x={-200} y={-60} width={400} height={120} rx={18} fill={SC.surface} stroke={SC.mint} strokeWidth={3} />
          <text y={-12} textAnchor="middle" fontSize={22} fontWeight={800} fill={SC.text}>A habit, not a workshop</text>
          <text y={20} textAnchor="middle" fontSize={14} fill={SC.muted}>Understand · Frame · Try · Learn · repeat</text>
        </g>
      )}

      {/* Nib draws the loop, then cheers the second round */}
      {t >= 10.2 && t < 15 && (() => {
        const a = -Math.PI / 2 + loopDraw * Math.PI * 2;
        return <Pen x={LOOP.x + Math.cos(a) * LOOP.r} y={LOOP.y + Math.sin(a) * LOOP.r} scale={0.45} tilt={-20} />;
      })()}
      {t >= 15 && <g opacity={clamp((t - 15) / 0.4)}><Pen x={LOOP.x + 150} y={150} scale={0.45} mood={t > 27.6 ? 'cheer' : t > 22.6 && t < 25.4 ? 'think' : 'idle'} /></g>}
      {t < 9 && t > 3.8 && <Pen x={820} y={150} scale={0.45} mood={t > 6.6 ? 'think' : 'cheer'} />}
    </svg>
  );
}
