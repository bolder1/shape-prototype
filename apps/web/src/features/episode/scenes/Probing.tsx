'use client';
// Scene for rs.2-2: an interview as a chat. A closed question dies; an open one starts a story; "tell me more", a
// three-second silence and "why?" each go one level deeper, shown on a depth meter. Pure function of t (0–34).
import { back, clamp, Grid, p, SC } from './shared';

const W = 960, H = 540;
const TURNS = [
  { at: 0, q: '“Do you like paying with UPI?”', a: '“Yes.”', depth: 0, tag: 'CLOSED' },
  { at: 6, q: '“Tell me about the last time you paid at a shop.”', a: '“There was a queue, the network was slow, the cashier looked worried…”', depth: 1, tag: 'OPEN' },
  { at: 13, q: '“Tell me more.”', a: '“I keep cash for exactly that shop.”', depth: 2, tag: 'FOLLOW-UP' },
  { at: 19, q: '…', a: '“Actually, I don’t trust it for big amounts.”', depth: 3, tag: 'SILENCE' },
  { at: 25, q: '“Why is that?”', a: '“A payment failed once. The refund took a week.”', depth: 4, tag: 'WHY' },
];

function Bubble({ x, y, w, text, who, s }: { x: number; y: number; w: number; text: string; who: 'q' | 'a'; s: number }) {
  const lines = Math.ceil(text.length / (w / 9));
  const h = 22 + lines * 20;
  return (
    <g transform={`translate(${x} ${y}) scale(${clamp(s)})`}>
      <rect width={w} height={h} rx={16} fill={who === 'q' ? SC.discover : SC.surface} stroke={who === 'q' ? 'none' : SC.line} strokeWidth={2} />
      <foreignObject x={14} y={10} width={w - 28} height={h - 14}>
        <div style={{ fontSize: 15, fontWeight: 700, lineHeight: '20px', color: who === 'q' ? '#fff' : 'var(--color-text-primary)', fontStyle: who === 'a' ? 'italic' : 'normal' }}>{text}</div>
      </foreignObject>
    </g>
  );
}

export function ProbingScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const turn = [...TURNS].reverse().find(x => t >= x.at)!;
  const local = t - turn.at;
  const silence = turn.tag === 'SILENCE';
  const answerAt = silence ? 3.2 : 1.4;
  // The meter rises when the answer arrives, not when the question is asked.
  const depth = local >= answerAt ? turn.depth : Math.max(0, turn.depth - 1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: open questions, follow-ups and silence in an interview">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        <g key={turn.at}>
          <text x={80} y={90} fontSize={13} fontWeight={900} letterSpacing={1.5} fill={turn.tag === 'CLOSED' ? SC.error : SC.mint} opacity={clamp(local / 0.3)}>{turn.tag}</text>
          {silence ? (
            <g transform="translate(80 110)" opacity={clamp(local / 0.3)}>
              <rect width={200} height={52} rx={16} fill={SC.discover} opacity={0.25} />
              {[0, 1, 2].map(i => <circle key={i} cx={60 + i * 40} cy={26} r={8} fill={SC.discover} opacity={local >= i + 0.4 ? 1 : 0.25} />)}
              <text x={220} y={33} fontSize={15} fontWeight={800} fill={SC.muted}>{Math.min(3, Math.floor(local))} s…</text>
            </g>
          ) : <Bubble x={80} y={110} w={460} text={turn.q} who="q" s={back(local / 0.4)} />}
          {local >= answerAt && <Bubble x={240} y={210} w={480} text={turn.a} who="a" s={back((local - answerAt) / 0.4)} />}
          {turn.tag === 'CLOSED' && local >= 2.4 && <text x={480} y={330} textAnchor="middle" fontSize={18} fontWeight={800} fill={SC.error} opacity={clamp((local - 2.4) / 0.4)}>…and that’s the end of that.</text>}
        </g>

        {/* depth meter */}
        <g transform="translate(830 90)">
          <text x={30} y={-14} textAnchor="middle" fontSize={12} fontWeight={800} fill={SC.muted}>STORY DEPTH</text>
          {[0, 1, 2, 3].map(i => (
            <rect key={i} x={0} y={300 - (i + 1) * 74} width={60} height={64} rx={10} fill={depth > i ? SC.mint : SC.surface} stroke={SC.line} strokeWidth={2} opacity={depth > i ? 1 : 0.7} />
          ))}
          <text x={30} y={330} textAnchor="middle" fontSize={20} fontWeight={900} fill={depth >= 4 ? SC.mint : SC.text}>{depth}</text>
        </g>
      </g>

      {fin > 0 && [{ x: 200, n: 'Open', l: '“Tell me about…”', c: SC.discover }, { x: 480, n: 'Follow', l: '“Tell me more” · “Why?”', c: SC.design }, { x: 760, n: 'Wait', l: 'Silence draws out more', c: SC.mint }].map((f, i) => {
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
