'use client';
// Scene for fd.3-2: Kabir shares the Sabzi checkout and gets "Honestly this is confusing. Redo it." He can't tell what
// to change. The same thought is rebuilt as I like (the pinned total, kept), I wish (the delivery slot found after
// paying, with the 7 am slot gone) and What if (slot chips sketched above Pay, dashed: an offer). Then three rules,
// and the blunt line struck out. Pure function of t (0–34).
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
const PX = 60, PY = 60;   // the phone's spot
/** Pay button fill that carries white text at 5.6:1 in both themes. */
const GO = '#047857';

function Checkout({ t }: { t: number }) {
  const slot = p(t, 13, 13.8);     // the slot row, revealed below Pay
  const chips = p(t, 19, 19.8);    // the sketched what-if
  return (
    <g>
      <rect width={240} height={440} rx={30} fill={SC.surface} stroke={SC.text} strokeOpacity={0.5} strokeWidth={3} />
      <rect x={95} y={14} width={50} height={6} rx={3} fill={SC.line} />
      <text x={22} y={52} fontSize={17} fontWeight={800} fill={SC.text}>Checkout</text>
      <rect x={22} y={66} width={196} height={28} rx={8} fill="none" stroke={SC.muted} strokeWidth={1.5} />
      <text x={32} y={84} fontSize={10} fill={SC.muted}>Coupon code</text>
      {[['Tomatoes', '500 g', 32], ['Coriander', '100 g', 12], ['Atta', '5 kg', 245], ['Milk', '1 L', 68]].map(([n, w, r], k) => (
        <g key={n as string} transform={`translate(22 ${112 + k * 38})`}>
          <rect width={28} height={28} rx={7} fill={['#fca5a5', '#a7f3d0', '#fcd34d', '#e5e7eb'][k]} />
          <text x={38} y={12} fontSize={11} fontWeight={700} fill={SC.text}>{n}</text>
          <text x={38} y={25} fontSize={9} fill={SC.muted}>{w}</text>
          <text x={196} y={18} textAnchor="end" fontSize={11} fontWeight={700} fill={SC.text}>₹{r}</text>
        </g>
      ))}
      {chips > 0 && ['7 am', '8 am', '9 am'].map((c, k) => (
        <g key={c} opacity={chips}>
          <rect x={22 + k * 68} y={276} width={60} height={26} rx={13} fill="none" stroke={SC.grow} strokeWidth={2} strokeDasharray="5 4" />
          <text x={52 + k * 68} y={293} textAnchor="middle" fontSize={11} fontWeight={700} fill={SC.text}>{c}</text>
        </g>
      ))}
      <rect x={14} y={312} width={212} height={44} rx={10} fill={SC.soft} />
      <text x={26} y={339} fontSize={12} fontWeight={700} fill={SC.muted}>Total</text>
      <text x={214} y={340} textAnchor="end" fontSize={16} fontWeight={800} fill={SC.text}>₹357</text>
      <rect x={14} y={362} width={212} height={40} rx={12} fill={GO} />
      <text x={120} y={387} textAnchor="middle" fontSize={14} fontWeight={800} fill="#fff">Pay ₹357</text>
      <g opacity={lerp(0.35, 1, slot)}>
        <text x={22} y={424} fontSize={10} fill={SC.muted}>Delivery slot: 7 am <tspan fontWeight={800} fill={SC.error}>{slot > 0.5 ? 'full' : ''}</tspan></text>
      </g>
    </g>
  );
}

/** Kabir: a face whose mouth and brows follow `mood` (−1 deflated, 1 pleased). */
function Kabir({ x, y, mood }: { x: number; y: number; mood: number }) {
  const m = mood * 8;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={34} fill="#F4C9A0" />
      <path d="M-34 -6 Q-30 -40 0 -40 Q30 -40 34 -6 Q22 -24 0 -26 Q-22 -24 -34 -6 Z" fill="#2A1E17" />
      <circle cx={-12} cy={-2} r={3.5} fill="#2A1E17" /><circle cx={12} cy={-2} r={3.5} fill="#2A1E17" />
      <path d={`M-18 ${-12 - Math.max(0, -m) * 0.4} L-6 ${-12 + Math.max(0, -m) * 0.4}`} stroke="#2A1E17" strokeWidth={2.5} strokeLinecap="round" />
      <path d={`M18 ${-12 - Math.max(0, -m) * 0.4} L6 ${-12 + Math.max(0, -m) * 0.4}`} stroke="#2A1E17" strokeWidth={2.5} strokeLinecap="round" />
      <path d={`M-12 16 Q0 ${16 + m} 12 16`} fill="none" stroke="#2A1E17" strokeWidth={3} strokeLinecap="round" />
      <text y={56} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.text}>Kabir</text>
    </g>
  );
}

const FRAME = [
  { at: 6.2, n: 'I like', c: SC.mint, l1: 'that the total stays pinned above Pay.', l2: 'I always knew what I’d spend.', to: 334 },
  { at: 12.2, n: 'I wish', c: SC.design, l1: 'I’d picked the delivery slot before paying.', l2: 'By the time I found it, 7 am was gone.', to: 420 },
  { at: 18.2, n: 'What if', c: SC.grow, l1: 'the next three slots sat as chips', l2: 'right above Pay?', to: 289 },
];

export function FeedbackFrameScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const blunt = clamp(back((t - 0.6) / 0.5)), bluntOut = p(t, 5.4, 6);
  const strike = p(t, 25.6, 26.3);
  const mood = t < 1.6 ? 0 : t < 6.2 ? -1 : lerp(-1, 1, p(t, 6.4, 20));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: blunt feedback on a grocery checkout rewritten as I like, I wish and What if">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        <g transform={`translate(${PX} ${PY})`}><Checkout t={t} /></g>
        <Kabir x={880} y={70} mood={mood} />
        {t >= 2 && t < 6.2 && <text x={880} y={150} textAnchor="middle" fontSize={22} fontWeight={800} fill={SC.muted} opacity={clamp((t - 2) / 0.4)}>?</text>}

        {/* the blunt version, then its ghost being struck */}
        {t < 6 && (
          <g transform={`translate(560 230) scale(${blunt * (1 - bluntOut * 0.2)})`} opacity={1 - bluntOut}>
            <rect x={-230} y={-50} width={460} height={100} rx={20} fill={SC.surface} stroke={SC.error} strokeWidth={3} />
            <text y={-6} textAnchor="middle" fontSize={22} fontWeight={800} fill={SC.text}>“Honestly this is confusing.</text>
            <text y={24} textAnchor="middle" fontSize={22} fontWeight={800} fill={SC.text}>Redo it.”</text>
            {t > 2.6 && <text y={86} textAnchor="middle" fontSize={15} fontWeight={700} fill={SC.muted} opacity={clamp((t - 2.6) / 0.4)}>True, maybe. But what should Kabir change?</text>}
          </g>
        )}

        {/* the frame, card by card, each pointing at the screen */}
        {FRAME.map((f, i) => {
          if (t < f.at) return null;
          const k = clamp(back((t - f.at) / 0.45)), line = p(t, f.at + 0.3, f.at + 0.9), y = 110 + i * 112;
          return (
            <g key={f.n}>
              <path d={`M352 ${y} C326 ${y} 330 ${PY + f.to} ${PX + 244} ${PY + f.to}`} pathLength={1} fill="none" stroke={f.c} strokeWidth={2.5} strokeDasharray={`${line} 1`} />
              <g transform={`translate(590 ${y}) scale(${k})`}>
                <rect x={-238} y={-44} width={476} height={88} rx={16} fill={SC.surface} stroke={f.c} strokeWidth={3} />
                <text x={-218} y={-12} fontSize={18} fontWeight={800} fill={SC.text}>{f.n}…</text>
                <text x={-218} y={12} fontSize={14} fontWeight={600} fill={SC.text}>{f.l1}</text>
                <text x={-218} y={32} fontSize={14} fill={SC.muted}>{f.l2}</text>
              </g>
            </g>
          );
        })}

        {/* three rules, and the blunt line struck out */}
        {t >= 24 && ['Point at the screen', 'Say who it affects', 'Leave the fix open'].map((r, i) => (
          <g key={r} transform={`translate(${440 + i * 160} 470) scale(${clamp(back((t - 24.2 - i * 0.4) / 0.4))})`}>
            <rect x={-74} y={-20} width={148} height={40} rx={20} fill={SC.surface} stroke={SC.text} strokeOpacity={0.4} strokeWidth={2} />
            <text y={5} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.text}>{r}</text>
          </g>
        ))}
        {t >= 25.2 && (
          <g opacity={clamp((t - 25.2) / 0.4)}>
            <text x={600} y={522} textAnchor="middle" fontSize={14} fontWeight={700} fill={SC.muted}>“Honestly this is confusing. Redo it.”</text>
            <line x1={474} x2={lerp(474, 726, strike)} y1={517} y2={517} stroke={SC.error} strokeWidth={2.5} />
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'I like', l: 'What to keep', c: SC.mint }, { x: 480, n: 'I wish', l: 'A problem, from the user’s seat', c: SC.design }, { x: 760, n: 'What if', l: 'An idea, offered', c: SC.grow }].map((f, i) => {
        const k = back((t - (29.2 + i * 0.25)) / 0.5);
        return (
          <g key={f.n} transform={`translate(${f.x} 260) scale(${clamp(k)})`}>
            <rect x={-125} y={-70} width={250} height={140} rx={18} fill={SC.surface} stroke={f.c} strokeWidth={3} />
            <text y={-8} textAnchor="middle" fontSize={24} fontWeight={800} fill={SC.text}>{f.n}</text>
            <text y={26} textAnchor="middle" fontSize={13} fontWeight={600} fill={SC.muted}>{f.l}</text>
          </g>
        );
      })}
    </svg>
  );
}
