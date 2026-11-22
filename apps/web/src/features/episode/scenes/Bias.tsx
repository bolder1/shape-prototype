'use client';
// Scene for rs.1-4: an interview, four times. Leading, hypothetical and priming questions get polite answers that hide
// the truth (shown in thought bubbles); an open question about the past gets the real story. Pure function of t (0–34).
import { CalendarIcon, UsersIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, p, Pen, SC } from './shared';

const W = 960, H = 540;
const ACTS = [
  { at: 0, end: 7, q: '“Don’t you love our new feature?”', a: '“Yes, it’s great!”', think: 'meh, never used it', tag: 'LEADING', c: SC.error },
  { at: 7, end: 14, q: '“Would you pay ₹199 for this?”', a: '“Sure, definitely!”', think: '(three months later: never paid)', tag: 'HYPOTHETICAL', c: SC.design },
  { at: 14, end: 21, q: '“Most people find it easy. Did you?”', a: '“Uh… yes, easy.”', think: 'I got stuck twice', tag: 'PRIMING', c: SC.build },
  { at: 21, end: 29, q: '“Tell me about the last time you paid a bill.”', a: '“I was at the bank queue, the app timed out at OTP, so I gave up and paid cash…”', think: '', tag: 'OPEN · ABOUT THE PAST', c: SC.mint },
];

function Person({ x, c, nod = 0 }: { x: number; c: string; nod?: number }) {
  return (
    <g transform={`translate(${x} 400)`}>
      <g transform={`translate(0 ${nod})`}><circle cy={-66} r={26} fill="#E8C9AE" /></g>
      <rect x={-32} y={-38} width={64} height={86} rx={22} fill={c} />
    </g>
  );
}

export function BiasScene({ t }: { t: number }) {
  const act = ACTS.find(a => t >= a.at && t < a.end) ?? ACTS[3];
  const local = t - act.at;
  const honest = act === ACTS[3];
  const nodding = !honest && local > 2.2 && local < 3.6 ? Math.sin((local - 2.2) * 14) * 5 : 0;
  const fin = p(t, 29, 29.8);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: biased interview questions versus an open question">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      {fin < 1 && (
        <g opacity={1 - fin}>
          {/* the crowd that primes the answer */}
          {act === ACTS[2] && (
            <g opacity={clamp((local - 0.4) / 0.5)}>
              {[0, 1, 2].map(i => <g key={i} transform={`translate(${80 + i * 46} ${330 - i * 6})`} opacity={0.35}><circle cy={-34} r={16} fill={SC.muted} /><rect x={-20} y={-16} width={40} height={50} rx={14} fill={SC.muted} /></g>)}
              <UsersIcon x={100} y={200} width={40} height={40} color={SC.build} weight="duotone" />
            </g>
          )}
          <Person x={260} c={SC.brand} />
          <Person x={700} c={SC.grow} nod={nodding} />
          <text x={260} y={480} textAnchor="middle" fontSize={13} fontWeight={700} fill={SC.muted}>Interviewer</text>
          <text x={700} y={480} textAnchor="middle" fontSize={13} fontWeight={700} fill={SC.muted}>Participant</text>

          {/* question */}
          <g key={`q${act.at}`} transform={`translate(260 120) scale(${back(local / 0.5)})`}>
            <rect x={-220} y={-30} width={440} height={60} rx={16} fill={SC.surface} stroke={SC.text} strokeOpacity={0.25} strokeWidth={2} />
            <text y={6} textAnchor="middle" fontSize={16} fontWeight={700} fill={SC.text}>{act.q}</text>
          </g>
          {/* answer */}
          {local >= 1.6 && (
            <g transform={`translate(${honest ? 655 : 700} 200) scale(${back((local - 1.6) / 0.5)})`}>
              {honest ? (
                <>
                  <rect x={-250} y={-40} width={500} height={84} rx={16} fill={SC.surface} stroke={SC.mint} strokeWidth={2.5} />
                  <text x={-232} y={-8} fontSize={14} fontWeight={600} fill={SC.text}>“I was in the bank queue, the app timed out at OTP,</text>
                  <text x={-232} y={20} fontSize={14} fontWeight={600} fill={SC.text}>so I gave up and paid cash. Third time this month.”</text>
                </>
              ) : (
                <>
                  <rect x={-130} y={-28} width={260} height={56} rx={16} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                  <text y={6} textAnchor="middle" fontSize={16} fontWeight={700} fill={SC.text}>{act.a}</text>
                </>
              )}
            </g>
          )}
          {/* what they're really thinking */}
          {!honest && local >= 3 && (
            <g transform={`translate(770 300) scale(${back((local - 3) / 0.5)})`} opacity={0.95}>
              <circle cx={-70} cy={34} r={6} fill={SC.surface} stroke={SC.line} /><circle cx={-54} cy={20} r={9} fill={SC.surface} stroke={SC.line} />
              <rect x={-40} y={-30} width={200} height={48} rx={24} fill={SC.surface} stroke={SC.line} strokeWidth={2} strokeDasharray="4 4" />
              <text x={60} y={0} textAnchor="middle" fontSize={13} fontStyle="italic" fill={SC.muted}>{act.think}</text>
            </g>
          )}
          {act === ACTS[1] && local >= 4.4 && <CalendarIcon x={860} y={380} width={40} height={40} color={SC.design} weight="duotone" />}
          {/* the tag */}
          {local >= 3.6 && (
            <g transform={`translate(230 230) rotate(-6) scale(${back((local - 3.6) / 0.4)})`}>
              <rect x={-act.tag.length * 6.6 - 16} y={-22} width={act.tag.length * 13.2 + 32} height={44} rx={10} fill={SC.surface} stroke={act.c} strokeWidth={4} />
              <text y={8} textAnchor="middle" fontSize={20} fontWeight={900} letterSpacing={1.5} fill={act.c}>{act.tag}</text>
            </g>
          )}
          {honest && local >= 5 && <text x={600} y={290} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.mint} opacity={clamp((local - 5) / 0.4)}>A real story. Now you know where it breaks.</text>}
        </g>
      )}

      {fin > 0 && [{ x: 200, n: 'No hints', l: 'Don’t lead the answer', c: SC.error }, { x: 480, n: 'Past, not future', l: 'Ask what they did', c: SC.design }, { x: 760, n: 'No crowd', l: 'Don’t say what others think', c: SC.build }].map((f, i) => {
        const k = back((t - (29.2 + i * 0.25)) / 0.5);
        return (
          <g key={f.n} transform={`translate(${f.x} 260) scale(${clamp(k)})`}>
            <rect x={-125} y={-70} width={250} height={140} rx={18} fill={SC.surface} stroke={f.c} strokeWidth={3} />
            <text y={-8} textAnchor="middle" fontSize={22} fontWeight={800} fill={f.c}>{f.n}</text>
            <text y={26} textAnchor="middle" fontSize={14} fontWeight={600} fill={SC.text}>{f.l}</text>
          </g>
        );
      })}
      {t >= 21.6 && t < 28.6 && <Pen x={470} y={330} scale={0.45} mood="cheer" />}
    </svg>
  );
}
