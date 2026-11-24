'use client';
// Scene for rs.4-1: Meher's first task, "Tap My trips and cancel your ticket", lights up the same words on the Safar tab
// bar, and Rohit's finger goes straight there: three seconds, nothing learned. The clue words are struck, the task is
// rewritten as a reason and a goal, and his finger now wanders Profile → Help → My trips while a clock runs to 0:48,
// which is the real finding. A checklist of what makes a fair task ticks in. Pure function of t (0–34).
import { FAMILY_SOLID } from '../kit';
import { at, back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
const PX = 640, PY = 40, PW = 260, PH = 460;   // the phone
const TABS = ['Home', 'My trips', 'Help', 'Profile'];
const tabX = (k: number) => PX + 32 + k * 65;
const TAB_Y = PY + PH - 34;
/** Rough width of bold text, for strike lines. */
const tw = (s: string, size: number) => s.length * size * 0.53;

/** Where the finger is during the rewritten task: centre → Profile → Help → My trips → Cancel. */
const WANDER: [number, readonly [number, number]][] = [
  [21, [PX + 130, PY + 220]], [22.4, [tabX(3), TAB_Y]], [23.8, [tabX(2), TAB_Y]], [25.2, [tabX(1), TAB_Y]], [26.2, [PX + 130, PY + 250]],
];
function wander(t: number) {
  for (let i = 0; i < WANDER.length - 1; i++) {
    const [a, A] = WANDER[i], [b, B] = WANDER[i + 1];
    if (t < b) return at(A, B, p(t, a, a + (b - a) * 0.7));
  }
  return WANDER[WANDER.length - 1][1];
}

export function TaskWritingScene({ t }: { t: number }) {
  const card1 = clamp(back((t - 0.3) / 0.5)), clue = p(t, 5, 5.6), strike = p(t, 10.2, 11.2), out1 = p(t, 13.4, 14.2);
  const card2 = clamp(back((t - 15) / 0.5)), list = p(t, 27, 27.5);
  const first = t >= 5.6 && t < 13.4, second = t >= 21 && t < 27.6;
  // the finger: straight to My trips the first time, a wander the second
  const [fx, fy] = first ? at([PX + 130, PY + 220], [tabX(1), TAB_Y], p(t, 5.8, 7)) : wander(t);
  const clock = first ? Math.round(lerp(0, 3, p(t, 5.8, 7))) : Math.round(lerp(0, 48, clamp((t - 21) / 5.2)));
  const onTab = (k: number) => (first && k === 1 && t > 7) || (second && ((k === 3 && t > 22.4 && t < 23.8) || (k === 2 && t > 23.8 && t < 25.2) || (k === 1 && t > 25.2)));
  const refund = t > 26.2 && t < 27.6;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a usability task that names the button is finished in three seconds; rewritten as a goal, it reveals that nobody looks for refunds under My trips">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />

      {/* the phone */}
      <g>
        <rect x={PX} y={PY} width={PW} height={PH} rx={30} fill={SC.surface} stroke={SC.line} strokeWidth={3} />
        <text x={PX + 24} y={PY + 46} fontSize={20} fontWeight={900} fill={SC.text}>Safar</text>
        <rect x={PX + 20} y={PY + 70} width={PW - 40} height={110} rx={16} fill={SC.soft} />
        <text x={PX + 36} y={PY + 98} fontSize={11} fontWeight={800} fill={SC.muted}>UPCOMING TRIP</text>
        <text x={PX + 36} y={PY + 128} fontSize={19} fontWeight={800} fill={SC.text}>Pune → Nagpur</text>
        <text x={PX + 36} y={PY + 154} fontSize={13} fill={SC.muted}>Fri 14 Mar · 2 passengers</text>
        {[0, 1].map(k => <rect key={k} x={PX + 20} y={PY + 200 + k * 50} width={PW - 40} height={36} rx={10} fill={SC.soft} />)}
        <line x1={PX} x2={PX + PW} y1={TAB_Y - 28} y2={TAB_Y - 28} stroke={SC.line} />
        {TABS.map((n, k) => (
          <g key={n}>
            {onTab(k) && <rect x={tabX(k) - 30} y={TAB_Y - 20} width={60} height={34} rx={10} fill={k === 1 && first ? FAMILY_SOLID[3] : SC.soft} stroke={SC.line} />}
            <text x={tabX(k)} y={TAB_Y + 2} textAnchor="middle" fontSize={12} fontWeight={800} fill={k === 1 && first && onTab(k) ? '#fff' : SC.text}>{n}</text>
          </g>
        ))}
        {refund && (
          <g opacity={p(t, 26.2, 26.6)}>
            <rect x={PX + 20} y={PY + 200} width={PW - 40} height={130} rx={16} fill={SC.surface} stroke={SC.mint} strokeWidth={3} />
            <text x={PX + 36} y={PY + 232} fontSize={13} fontWeight={800} fill={SC.muted}>TICKET CANCELLED</text>
            <text x={PX + 36} y={PY + 272} fontSize={28} fontWeight={900} fill={SC.text}>₹1,180</text>
            <text x={PX + 36} y={PY + 300} fontSize={13} fill={SC.muted}>refund in 3–5 days</text>
          </g>
        )}
        {(first || second) && (
          <g transform={`translate(${fx} ${fy})`}>
            <circle r={16} fill={FAMILY_SOLID[0]} opacity={0.25} />
            <circle r={7} fill={FAMILY_SOLID[0]} />
          </g>
        )}
      </g>

      {/* the clock */}
      {(first || second) && (
        <g transform={`translate(${PX + PW / 2} ${PY + PH + 26})`}>
          <text textAnchor="middle" fontSize={20} fontWeight={900} fill={SC.text}>0:{String(clock).padStart(2, '0')}</text>
        </g>
      )}

      {/* task 1, which gives it away */}
      {out1 < 1 && (
        <g transform={`translate(40 ${70 - out1 * 30}) scale(${card1})`} opacity={1 - out1}>
          <rect width={540} height={130} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
          <text x={26} y={36} fontSize={13} fontWeight={800} fill={SC.muted}>TASK 1</text>
          <text x={26} y={84} fontSize={24} fontWeight={800} fill={SC.text}>
            Tap <tspan fill={clue > 0.5 ? FAMILY_SOLID[3] : SC.text}>“My trips”</tspan> and cancel your ticket.
          </text>
          {strike > 0 && <line x1={24} x2={24 + tw('Tap “My trips” and cancel your ticket.', 24) * strike} y1={76} y2={76} stroke={SC.error} strokeWidth={3.5} />}
        </g>
      )}
      {clue > 0 && t < 10.2 && (
        <path d={`M 250 ${150} C 420 ${200}, 520 ${TAB_Y - 60}, ${tabX(1) - 24} ${TAB_Y - 12}`} fill="none" stroke={FAMILY_SOLID[3]} strokeWidth={2.5} strokeDasharray="6 6" opacity={clue} />
      )}
      {t > 7.2 && t < 13.6 && (
        <g opacity={p(t, 7.2, 7.7) * (1 - p(t, 13, 13.6))} transform="translate(40 250)">
          <rect width={300} height={44} rx={22} fill={SC.surface} stroke={SC.mint} strokeWidth={2} />
          <text x={22} y={28} fontSize={16} fontWeight={800} fill={SC.text}>✓ Done in 3 seconds</text>
          <text y={84} fontSize={18} fontWeight={700} fill={SC.text}>He matched the words. Tested: can he read?</text>
        </g>
      )}
      {t > 10.6 && t < 14.6 && ['No button names', 'No steps', 'A reason and a goal'].map((c, k) => (
        <g key={c} transform={`translate(${40 + k * 186} 380) scale(${clamp(back((t - 10.8 - k * 0.7) / 0.4))})`} opacity={1 - p(t, 14, 14.6)}>
          <rect width={174} height={40} rx={20} fill={k === 2 ? FAMILY_SOLID[0] : SC.surface} stroke={SC.line} />
          <text x={87} y={26} textAnchor="middle" fontSize={15} fontWeight={800} fill={k === 2 ? '#fff' : SC.text}>{k < 2 ? '✕ ' : ''}{c}</text>
        </g>
      ))}

      {/* task 1, rewritten */}
      {card2 > 0 && (
        <g transform={`translate(40 70) scale(${card2})`}>
          <rect width={540} height={150} rx={18} fill={SC.surface} stroke={FAMILY_SOLID[0]} strokeWidth={2.5} />
          <text x={26} y={36} fontSize={13} fontWeight={800} fill={SC.muted}>TASK 1, REWRITTEN</text>
          <text x={26} y={80} fontSize={24} fontWeight={800} fill={SC.text} opacity={p(t, 15.4, 16)}>You can’t travel on Friday any more.</text>
          <text x={26} y={116} fontSize={24} fontWeight={800} fill={SC.text} opacity={p(t, 16.4, 17)}>Get your money back for this ticket.</text>
        </g>
      )}
      {second && (
        <g transform="translate(40 260)" opacity={1 - p(t, 26.8, 27.2)}>
          {[['Profile?', 22.4], ['Help?', 23.8], ['My trips… “Cancel”', 25.2]].map(([l, a], k) => (
            <text key={l} x={k * 150} y={0} fontSize={17} fontWeight={800} fill={k === 2 ? SC.text : SC.muted} opacity={p(t, a as number, (a as number) + 0.4)}>{k + 1}. {l}</text>
          ))}
        </g>
      )}
      {t > 25.6 && (
        <g transform="translate(40 300)" opacity={p(t, 25.6, 26.2) * (1 - p(t, 27, 27.5))}>
          <rect width={540} height={74} rx={16} fill={SC.surface} stroke={FAMILY_SOLID[3]} strokeWidth={2.5} />
          <text x={22} y={30} fontSize={13} fontWeight={800} fill={SC.muted}>FINDING · 48 SECONDS</text>
          <text x={22} y={56} fontSize={18} fontWeight={800} fill={SC.text}>Nobody looks for a refund under “My trips”.</text>
        </g>
      )}

      {/* what makes it fair */}
      {list > 0 && (
        <g transform="translate(40 256)" opacity={list}>
          {['A real reason to do it', 'None of the screen’s words', 'One goal', 'An end you can see: the refund'].map((c, k) => {
            const tick = p(t, 27.6 + k * 0.9, 28.1 + k * 0.9);
            return (
              <g key={c} transform={`translate(0 ${k * 52})`} opacity={0.3 + tick * 0.7}>
                <circle cx={18} cy={18} r={16} fill={tick > 0.5 ? SC.mint : SC.surface} stroke={SC.line} />
                {tick > 0.5 && <path d="M10 18 L16 24 L26 12" stroke="#fff" strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
                <text x={48} y={25} fontSize={19} fontWeight={800} fill={SC.text}>{c}</text>
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
}
