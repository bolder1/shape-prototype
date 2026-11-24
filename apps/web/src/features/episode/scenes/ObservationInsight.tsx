'use client';
// Scene for rs.3-2: one quote (P3, Sunita) becomes a pattern (7 of 12 people, drawn as a row of figures), then Arjun's
// "Insight: users want refill reminders" is stamped FEATURE and struck. "Why?" is asked twice, and the insight builds
// in three coloured blocks: who · what they do · because. It opens a "How might we…?" with several answers, the
// reminder only one of them. Pure function of t (0–34).
import { FAMILY_SOLID } from '../kit';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;

/** A small figure: head and shoulders. */
function Figure({ x, y, on }: { x: number; y: number; on: boolean }) {
  const c = on ? FAMILY_SOLID[0] : SC.line;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cy={-14} r={8} fill={c} />
      <path d="M-13 12 Q-13 -3 0 -3 Q13 -3 13 12 Z" fill={c} />
    </g>
  );
}

const BLOCKS = [
  { k: 'Who', l: ['Children in', 'another city'], w: 190 },
  { k: 'What they do', l: ['reorder a parent’s', 'medicines late'], w: 230 },
  { k: 'Because', l: ['the only sign that stock is', 'low is the parent’s call'], w: 330 },
];

export function ObservationInsightScene({ t }: { t: number }) {
  const quote = clamp(back((t - 0.4) / 0.5)), pattern = p(t, 5, 5.8);
  const leap = clamp(back((t - 10.2) / 0.5)), stamp = p(t, 12, 12.4), strike = p(t, 13, 13.6);
  const why = p(t, 15.2, 15.8), why2 = p(t, 17.6, 18.2);
  const hmw = p(t, 27.2, 27.9);
  const lift = p(t, 21, 22);   // the earlier rungs move up and fade as the insight takes the floor

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: an interview quote becomes a pattern, a feature is struck out, and asking why builds an insight">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />

      <g opacity={1 - lift * 0.85} transform={`translate(0 ${-lift * 30})`}>
        {/* rung 1: the observation */}
        <g transform={`translate(40 60) scale(${quote})`}>
          <rect width={420} height={110} rx={16} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
          <text x={22} y={32} fontSize={13} fontWeight={800} fill={SC.muted}>OBSERVATION · P3, Sunita</text>
          <text x={22} y={62} fontSize={17} fontWeight={700} fill={SC.text}>“I only find out she’s run out</text>
          <text x={22} y={86} fontSize={17} fontWeight={700} fill={SC.text}>when she calls me at work.”</text>
        </g>

        {/* rung 2: the pattern */}
        {pattern > 0 && (
          <g transform="translate(500 60)" opacity={pattern}>
            <rect width={420} height={110} rx={16} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            <text x={22} y={32} fontSize={13} fontWeight={800} fill={SC.muted}>PATTERN</text>
            {Array.from({ length: 12 }, (_, i) => <Figure key={i} x={34 + i * 30} y={66} on={i < 7 && t > 6 + i * 0.25} />)}
            <text x={22} y={98} fontSize={14} fontWeight={700} fill={SC.text}>7 of 12 order for a parent in another city</text>
          </g>
        )}

        {/* the tempting leap */}
        {leap > 0 && (
          <g transform={`translate(270 200) scale(${leap})`}>
            <rect width={420} height={86} rx={16} fill={SC.surface} stroke={SC.error} strokeWidth={2.5} />
            <text x={22} y={30} fontSize={13} fontWeight={800} fill={SC.muted}>ARJUN’S “INSIGHT”</text>
            <text x={22} y={62} fontSize={20} fontWeight={800} fill={SC.text}>Users want refill reminders</text>
            {strike > 0 && <line x1={20} x2={lerp(20, 300, strike)} y1={56} y2={56} stroke={SC.error} strokeWidth={3} />}
            {stamp > 0 && (
              <g transform={`translate(340 44) rotate(-12) scale(${lerp(1.6, 1, stamp)})`} opacity={stamp}>
                <rect x={-58} y={-18} width={116} height={36} rx={6} fill="none" stroke={SC.error} strokeWidth={3} />
                <text y={7} textAnchor="middle" fontSize={17} fontWeight={900} fill={SC.error}>FEATURE</text>
              </g>
            )}
          </g>
        )}
      </g>

      {/* asking why, twice */}
      {why > 0 && t < 21.4 && (
        <g opacity={why * (1 - p(t, 20.6, 21.3))}>
          <g transform="translate(140 340)">
            <rect x={-70} y={-24} width={140} height={48} rx={24} fill={FAMILY_SOLID[1]} />
            <text y={7} textAnchor="middle" fontSize={20} fontWeight={800} fill="#fff">Why?</text>
          </g>
          <text x={240} y={334} fontSize={17} fontWeight={700} fill={SC.text}>Why do they reorder late?</text>
          <text x={240} y={360} fontSize={15} fill={SC.muted}>They can’t see the shelf from Pune.</text>
          {why2 > 0 && (
            <g opacity={why2}>
              <g transform="translate(140 430)">
                <rect x={-70} y={-24} width={140} height={48} rx={24} fill={FAMILY_SOLID[1]} />
                <text y={7} textAnchor="middle" fontSize={20} fontWeight={800} fill="#fff">Why?</text>
              </g>
              <text x={240} y={424} fontSize={17} fontWeight={700} fill={SC.text}>Why does that make them late?</text>
              <text x={240} y={450} fontSize={15} fill={SC.muted}>The only signal is Ma calling, once the strip is empty.</text>
            </g>
          )}
        </g>
      )}

      {/* who · what · because */}
      {t >= 21 && (() => {
        let x = 60;
        return (
          <g transform={`translate(0 ${lerp(250, 200, hmw)})`}>
            <text x={60} y={-18} fontSize={14} fontWeight={800} fill={SC.muted} opacity={p(t, 21, 21.6)}>INSIGHT</text>
            {BLOCKS.map((b, k) => {
              const s = clamp(back((t - 21.4 - k * 0.7) / 0.5)), bx = x;
              x += b.w + 10;
              return (
                <g key={b.k} transform={`translate(${bx} 0)`} opacity={s}>
                  <rect width={b.w} height={104} rx={14} fill={FAMILY_SOLID[[0, 2, 1][k]]} />
                  <text x={16} y={26} fontSize={12} fontWeight={800} fill="#fff" opacity={0.9}>{b.k.toUpperCase()}</text>
                  {b.l.map((l, j) => <text key={l} x={16} y={58 + j * 24} fontSize={18} fontWeight={800} fill="#fff">{l}</text>)}
                </g>
              );
            })}
          </g>
        );
      })()}

      {/* the question it opens */}
      {hmw > 0 && (
        <g opacity={hmw}>
          <text x={60} y={366} fontSize={20} fontWeight={800} fill={SC.text}>How might the person far away see a refill coming</text>
          <text x={60} y={392} fontSize={20} fontWeight={800} fill={SC.text}>before it’s urgent?</text>
          {['A refill reminder', 'A shared stock count', 'The chemist pings the family', 'Strip photo → days left'].map((a, k) => (
            <g key={a} transform={`translate(${60 + [0, 200, 410, 680][k]} 440) scale(${clamp(back((t - 28.6 - k * 0.35) / 0.4))})`}>
              <rect width={[180, 196, 256, 214][k]} height={40} rx={20} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text x={[180, 196, 256, 214][k] / 2} y={26} textAnchor="middle" fontSize={14} fontWeight={700} fill={SC.text}>{a}</text>
            </g>
          ))}
          <text x={60} y={514} fontSize={14} fontWeight={600} fill={SC.muted} opacity={p(t, 30.2, 30.8)}>The reminder is still there. Now it’s one answer among several.</text>
        </g>
      )}
    </svg>
  );
}
