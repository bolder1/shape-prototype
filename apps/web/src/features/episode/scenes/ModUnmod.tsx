'use client';
// Scene for rs.4-2: two panels. Moderated: a video call where Anjali stops at the refund screen, Meher asks what she
// expected, and the answer is the why; five sessions fill two days. Unmoderated: forty recordings tile in overnight and
// a bar fills to 62% finished, but a question mark sits over the other 38% with no one to ask, and one unclear task
// would spoil every tile. The rule for choosing lands at the bottom. Pure function of t (0–34).
import { FAMILY_SOLID } from '../kit';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;

function Person({ x, y, s = 1, c }: { x: number; y: number; s?: number; c: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cy={-12} r={10} fill={c} />
      <path d="M-16 16 Q-16 -1 0 -1 Q16 -1 16 16 Z" fill={c} />
    </g>
  );
}

function Bubble({ x, y, w, lines, o, tone }: { x: number; y: number; w: number; lines: string[]; o: number; tone: 'ask' | 'say' }) {
  const fill = tone === 'ask' ? FAMILY_SOLID[0] : SC.surface;
  return (
    <g transform={`translate(${x} ${y}) scale(${clamp(back(o))})`} opacity={clamp(o * 2)}>
      <rect width={w} height={16 + lines.length * 20} rx={12} fill={fill} stroke={tone === 'say' ? SC.line : 'none'} strokeWidth={2} />
      {lines.map((l, k) => <text key={l} x={12} y={23 + k * 20} fontSize={14} fontWeight={700} fill={tone === 'ask' ? '#fff' : SC.text}>{l}</text>)}
    </g>
  );
}

export function ModUnmodScene({ t }: { t: number }) {
  const panels = p(t, 0.2, 0.9);
  const call = p(t, 5, 5.6), ask = (t - 7) / 0.5, say = (t - 8.6) / 0.5;
  const days = p(t, 11, 11.6), why = clamp(back((t - 14) / 0.5));
  const tiles = t > 16 ? clamp((t - 16.2) / 2.4) : 0, bar = p(t, 19, 20.6);
  const gap = p(t, 22, 22.6), wasted = p(t, 24.4, 25) * (1 - p(t, 26.4, 27)), many = clamp(back((t - 26.6) / 0.5));
  const rule = p(t, 28, 28.6);
  const shrink = lerp(1, 0.86, rule);   // panels make room for the rule

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a moderated video-call session finds why a participant stopped; an unmoderated test returns forty recordings and a success rate, but no reasons">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />

      <g transform={`translate(${W / 2} 30) scale(${shrink}) translate(${-W / 2} 0)`} opacity={panels}>
        {/* moderated */}
        <rect x={30} y={0} width={440} height={420} rx={20} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
        <text x={54} y={36} fontSize={14} fontWeight={800} fill={SC.muted}>MODERATED · VIDEO CALL</text>
        {call > 0 && (
          <g opacity={call}>
            <rect x={54} y={56} width={392} height={190} rx={14} fill={SC.soft} />
            {/* Anjali's shared screen */}
            <rect x={70} y={70} width={240} height={162} rx={10} fill={SC.surface} stroke={SC.line} />
            <text x={86} y={96} fontSize={12} fontWeight={800} fill={SC.muted}>CANCEL TICKET</text>
            <text x={86} y={124} fontSize={16} fontWeight={800} fill={SC.text}>Pune → Nagpur, Fri</text>
            <text x={86} y={150} fontSize={13} fill={SC.muted}>Cancellation charges apply</text>
            <rect x={86} y={170} width={140} height={34} rx={8} fill={SC.brand} />
            <text x={156} y={192} textAnchor="middle" fontSize={13} fontWeight={800} fill="#fff">Cancel ticket</text>
            {t > 6 && t < 11 && (
              <g opacity={p(t, 6, 6.4)}>
                <rect x={232} y={176} width={70} height={24} rx={12} fill={FAMILY_SOLID[3]} />
                <text x={267} y={193} textAnchor="middle" fontSize={11} fontWeight={800} fill="#fff">paused 9 s</text>
              </g>
            )}
            {/* faces */}
            <rect x={326} y={70} width={106} height={76} rx={10} fill={SC.surface} stroke={SC.line} />
            <Person x={379} y={112} c={FAMILY_SOLID[2]} />
            <text x={334} y={140} fontSize={11} fontWeight={700} fill={SC.muted}>Anjali</text>
            <rect x={326} y={156} width={106} height={76} rx={10} fill={SC.surface} stroke={SC.line} />
            <Person x={379} y={198} c={FAMILY_SOLID[0]} />
            <text x={334} y={226} fontSize={11} fontWeight={700} fill={SC.muted}>Meher</text>
          </g>
        )}
        {ask > 0 && <Bubble x={54} y={258} w={250} lines={['What did you expect there?']} o={ask} tone="ask" />}
        {say > 0 && <Bubble x={140} y={302} w={310} lines={['“I thought cancelling would cost', 'me the whole fare.”']} o={say} tone="say" />}
        {days > 0 && (
          <g opacity={days} transform="translate(54 372)">
            <text y={0} fontSize={14} fontWeight={800} fill={SC.text}>5 sessions · 2 days</text>
            {Array.from({ length: 5 }, (_, k) => <circle key={k} cx={190 + k * 26} cy={-5} r={9} fill={t > 11.4 + k * 0.5 ? FAMILY_SOLID[0] : SC.line} />)}
          </g>
        )}
        {why > 0 && (
          <g transform={`translate(390 380) scale(${why})`}>
            <rect x={-56} y={-20} width={112} height={40} rx={20} fill={FAMILY_SOLID[0]} />
            <text y={7} textAnchor="middle" fontSize={17} fontWeight={900} fill="#fff">THE WHY</text>
          </g>
        )}

        {/* unmoderated */}
        <rect x={490} y={0} width={440} height={420} rx={20} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
        <text x={514} y={36} fontSize={14} fontWeight={800} fill={SC.muted}>UNMODERATED · TESTING TOOL</text>
        {t > 16 && (
          <g>
            <text x={514} y={66} fontSize={15} fontWeight={700} fill={SC.text} opacity={p(t, 16, 16.5)}>Sent at 6 pm. By morning:</text>
            {Array.from({ length: 40 }, (_, k) => {
              const on = tiles * 40 > k, failed = k % 8 >= 5;   // 15 of 40 didn't finish
              return (
                <g key={k} transform={`translate(${514 + (k % 8) * 50} ${80 + Math.floor(k / 8) * 34})`} opacity={on ? 1 : 0}>
                  <rect width={42} height={26} rx={5} fill={wasted > 0 ? SC.error : SC.soft} fillOpacity={wasted > 0 ? 0.25 + wasted * 0.35 : 1} stroke={SC.line} />
                  <path d="M17 8 L27 13 L17 18 Z" fill={SC.muted} />
                  {bar > 0.9 && failed && gap > 0 && <circle cx={36} cy={6} r={4} fill={FAMILY_SOLID[3]} opacity={gap} />}
                </g>
              );
            })}
            <g transform="translate(514 262)" opacity={p(t, 18.8, 19.2)}>
              <rect width={392} height={22} rx={11} fill={SC.soft} stroke={SC.line} />
              <rect width={392 * 0.62 * bar} height={22} rx={11} fill={FAMILY_SOLID[0]} />
              <text y={50} fontSize={20} fontWeight={900} fill={SC.text}>{Math.round(62 * bar)}% finished</text>
              <text x={392} y={50} textAnchor="end" fontSize={14} fontWeight={700} fill={SC.muted}>40 recordings</text>
            </g>
          </g>
        )}
        {gap > 0 && (
          <g opacity={gap * (1 - wasted)} transform="translate(514 340)">
            <text fontSize={30} fontWeight={900} fill={FAMILY_SOLID[3]}>?</text>
            <text x={30} y={-6} fontSize={15} fontWeight={800} fill={SC.text}>Why did the other 38% give up?</text>
            <text x={30} y={16} fontSize={14} fill={SC.muted}>Nobody was there to ask.</text>
          </g>
        )}
        {wasted > 0 && (
          <g opacity={wasted} transform="translate(514 340)">
            <text fontSize={15} fontWeight={800} fill={SC.text}>One unclear task, read alone by everyone:</text>
            <text y={24} fontSize={15} fontWeight={800} fill={SC.error}>40 wasted sessions.</text>
          </g>
        )}
        {many > 0 && (
          <g transform={`translate(850 380) scale(${many})`}>
            <rect x={-66} y={-20} width={132} height={40} rx={20} fill={FAMILY_SOLID[2]} />
            <text y={7} textAnchor="middle" fontSize={17} fontWeight={900} fill="#fff">HOW MANY</text>
          </g>
        )}
      </g>

      {/* how to choose */}
      {rule > 0 && (
        <g opacity={rule}>
          {[
            { x: 70, c: FAMILY_SOLID[0], a: 'Why · early · rough · sensitive', b: 'Moderated' },
            { x: 490, c: FAMILY_SOLID[2], a: 'How many · how fast · sturdy', b: 'Unmoderated' },
          ].map((r, k) => (
            <g key={r.b} transform={`translate(${r.x} 420) scale(${clamp(back((t - 28.2 - k * 0.5) / 0.4))})`}>
              <rect width={400} height={46} rx={23} fill={r.c} />
              <text x={22} y={29} fontSize={15} fontWeight={700} fill="#fff">{r.a}</text>
              <text x={380} y={29} textAnchor="end" fontSize={15} fontWeight={900} fill="#fff">→ {r.b}</text>
            </g>
          ))}
          <text x={W / 2} y={506} textAnchor="middle" fontSize={16} fontWeight={700} fill={SC.text} opacity={p(t, 29.6, 30.2)}>Often both: five moderated sessions to find the problems, forty unmoderated to measure the fix.</text>
        </g>
      )}
    </svg>
  );
}
