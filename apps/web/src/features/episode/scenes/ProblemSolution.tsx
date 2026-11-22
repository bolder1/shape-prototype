'use client';
// Scene for fd.1-1: "Make the button bigger." The stage is split into the problem space (left) and the solution space (right).
// The team starts on the wrong side, Nib leads them into the problem space, and only then back to a solution that works.
// Pure function of t (seconds, 0–34).
import { CheckIcon, ShoppingCartIcon, XIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, lerp, p, Pen, SC } from './shared';

const W = 960, H = 540, DIV = 480;
const PHONE = { x: 800, y: 290 };

const SHOPPERS = [
  { x: 100, y: 360, says: 'Delivery costs surprised me', at: 6.6 },
  { x: 240, y: 390, says: 'I don’t want another account', at: 7.8, key: true },
  { x: 380, y: 360, says: 'Where does my coupon go?', at: 9 },
];
const FUNNEL = [{ label: 'Cart', pct: 100 }, { label: 'Delivery', pct: 82 }, { label: 'Create an account', pct: 41, drop: true }, { label: 'Pay', pct: 38 }];
const CHIPS = [
  { tag: 'WHO', text: 'First-time buyers', at: 18.2, c: SC.discover },
  { tag: 'WHAT', text: 'quit at checkout', at: 19.2, c: SC.design },
  { tag: 'WHY', text: 'because they’re forced to make an account', at: 20.2, c: SC.build },
];
const IDEAS = ['Bigger button', 'Sign in with Google', 'Guest checkout', 'Save cart by email'];
const PICK = 2;

/** Where Nib is (keyframes, eased between). */
function nibAt(t: number) {
  const keys: [number, number, number][] = [[3.8, 640, 190], [5.4, 640, 190], [7, 250, 150], [10.8, 250, 150], [11.6, 420, 170], [16.8, 420, 170], [17.6, 430, 250], [22.8, 430, 250], [24.2, 640, 110], [28.6, 640, 110], [29.6, 480, 90]];
  if (t < keys[0][0]) return null;
  const i = keys.findIndex(k => k[0] > t);
  if (i === -1) return { x: keys.at(-1)![1], y: keys.at(-1)![2] };
  const a = keys[i - 1], b = keys[i], k = p(t, a[0], b[0]);
  return { x: lerp(a[1], b[1], k), y: lerp(a[2], b[2], k) - Math.sin(k * Math.PI) * 30 };
}

export function ProblemSolutionScene({ t }: { t: number }) {
  const problemOn = clamp((t - 5.4) / 0.8) * (1 - p(t, 23, 24)) + p(t, 29, 30);
  const solutionOn = 1 - p(t, 5.4, 6.2) + p(t, 23, 24);
  const nib = nibAt(t);
  const button = { w: lerp(110, 196, back((t - 0.8) / 2)), h: lerp(40, 58, back((t - 0.8) / 2)) };
  const guest = t >= 26.8;
  const rate = t < 29 ? 2.1 : lerp(2.1, 3.4, p(t, 29, 30.4));
  const nibMood = t > 29.4 ? 'cheer' : (t > 3.8 && t < 5.6) || (t > 16.8 && t < 18) ? 'think' : 'idle';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: the problem space and the solution space">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      {/* the two spaces */}
      <rect x={0} y={0} width={DIV} height={H} fill={SC.discover} opacity={0.04 + problemOn * 0.1} />
      <rect x={DIV} y={0} width={W - DIV} height={H} fill={SC.grow} opacity={0.04 + solutionOn * 0.1} />
      <line x1={DIV} x2={DIV} y1={20} y2={H - 20} stroke={SC.muted} strokeOpacity={0.4} strokeWidth={2} strokeDasharray="6 8" />
      <text x={DIV / 2} y={44} textAnchor="middle" fontSize={15} fontWeight={800} letterSpacing={2} fill={SC.discover} opacity={0.35 + problemOn * 0.65}>PROBLEM SPACE</text>
      <text x={DIV + (W - DIV) / 2} y={44} textAnchor="middle" fontSize={15} fontWeight={800} letterSpacing={2} fill={SC.grow} opacity={0.35 + solutionOn * 0.65}>SOLUTION SPACE</text>

      {/* ---- the phone: always in the solution space ---- */}
      <g transform={`translate(${PHONE.x} ${PHONE.y})`} opacity={0.45 + 0.55 * solutionOn}>
        <rect x={-85} y={-150} width={170} height={300} rx={24} fill={SC.surface} stroke={SC.text} strokeOpacity={0.2} strokeWidth={3} />
        <ShoppingCartIcon x={-62} y={-128} width={20} height={20} color={SC.text} weight="bold" />
        <text x={-36} y={-112} fontSize={15} fontWeight={800} fill={SC.text}>Checkout</text>
        {['Cart', 'Delivery', guest ? 'Continue as guest' : 'Create an account'].map((s, i) => (
          <g key={i} transform={`translate(0 ${-76 + i * 38})`}>
            <rect x={-66} y={-14} width={132} height={28} rx={8} fill={i === 2 && guest ? SC.mint : SC.soft} opacity={i === 2 && guest ? 0.25 + 0.75 * back((t - 26.8) / 0.4) : 1} />
            <text y={5} textAnchor="middle" fontSize={11.5} fontWeight={600} fill={SC.text}>{s}</text>
          </g>
        ))}
        <g transform="translate(0 70)">
          <rect x={-button.w / 2} y={-button.h / 2} width={button.w} height={button.h} rx={12} fill={SC.brand} />
          <text y={6} textAnchor="middle" fontSize={lerp(14, 20, clamp((t - 0.8) / 2))} fontWeight={800} fill="#fff">Pay ₹1,499</text>
        </g>
      </g>
      {/* conversion */}
      <g transform={`translate(${PHONE.x} ${PHONE.y + 186})`}>
        <rect x={-92} y={-20} width={184} height={40} rx={12} fill={SC.surface} stroke={t >= 29 ? SC.mint : SC.line} strokeWidth={2} />
        <text y={6} textAnchor="middle" fontSize={15} fontWeight={700} fill={SC.text}>Conversion <tspan fill={t >= 29 ? SC.mint : SC.text} fontWeight={800}>{rate.toFixed(1)}%</tspan></text>
      </g>
      {t > 3.4 && t < 6 && (
        <text x={PHONE.x} y={PHONE.y + 228} textAnchor="middle" fontSize={13} fontWeight={700} fill={SC.error} opacity={clamp((t - 3.4) / 0.3) * (1 - p(t, 5.5, 6))}>…no change</text>
      )}

      {/* ---- the request ---- */}
      {t < 6 && (
        <g opacity={1 - p(t, 5.2, 6)}>
          <g transform="translate(590 190)">
            <circle cy={-8} r={16} fill="#E8C9AE" />
            <rect x={-20} y={10} width={40} height={44} rx={14} fill={SC.brand} />
          </g>
          <g transform={`translate(590 120) scale(${back((t - 0.2) / 0.5)})`}>
            <rect x={-150} y={-24} width={300} height={44} rx={14} fill={SC.surface} stroke={SC.text} strokeOpacity={0.25} strokeWidth={2} />
            <text y={4} textAnchor="middle" fontSize={15} fontWeight={700} fill={SC.text}>“Make the checkout button bigger!”</text>
          </g>
        </g>
      )}

      {/* ---- problem space: listen to the people who quit ---- */}
      {t >= 6 && t < 12 && SHOPPERS.map((s, i) => {
        const inK = back((t - (6 + i * 0.3)) / 0.5), out = p(t, 11, 11.8);
        const said = back((t - s.at) / 0.5);
        const focus = s.key ? p(t, 10, 10.5) : 0, dim = !s.key ? p(t, 10, 10.5) * 0.5 : 0;
        return (
          <g key={i} opacity={(1 - out) * (1 - dim)} transform={`translate(${s.x} ${s.y + (1 - clamp(inK)) * 30})`}>
            <circle cy={-34} r={15} fill="#E8C9AE" />
            <rect x={-19} y={-16} width={38} height={48} rx={14} fill={[SC.discover, SC.grow, SC.build][i]} opacity={0.85} />
            {t >= s.at && (
              <g transform={`translate(0 ${i % 2 ? -150 : -84}) scale(${said * (1 + focus * 0.1)})`}>
                <rect x={-104} y={-20} width={208} height={36} rx={12} fill={SC.surface} stroke={focus ? SC.error : SC.line} strokeWidth={focus ? 3 : 1.5} />
                <path d="M-6 16 L0 26 L6 16 Z" fill={SC.surface} />
                <text y={3} textAnchor="middle" fontSize={12.5} fontWeight={600} fill={SC.text}>{s.says}</text>
              </g>
            )}
          </g>
        );
      })}

      {/* ---- evidence: the checkout funnel ---- */}
      {t >= 11.4 && t < 18 && (
        <g opacity={clamp((t - 11.4) / 0.4) * (1 - p(t, 17.2, 17.8))}>
          <text x={60} y={150} fontSize={14} fontWeight={700} fill={SC.muted}>Of 100 people who start checkout…</text>
          {FUNNEL.map((f, i) => {
            const k = p(t, 11.8 + i * 0.5, 12.6 + i * 0.5);
            return (
              <g key={f.label} transform={`translate(60 ${185 + i * 62})`}>
                <text y={-6} fontSize={12.5} fontWeight={600} fill={SC.text}>{f.label}</text>
                <rect y={0} width={f.pct * 3.4 * k} height={26} rx={8} fill={f.drop ? SC.error : SC.discover} opacity={f.drop ? 0.9 : 0.75} />
                <text x={f.pct * 3.4 * k + 8} y={18} fontSize={13} fontWeight={800} fill={SC.text} opacity={k}>{Math.round(f.pct * k)}</text>
              </g>
            );
          })}
          {t >= 14.4 && (
            <g transform={`translate(300 ${185 + 2 * 62 + 13}) scale(${back((t - 14.4) / 0.5)})`}>
              <rect x={-4} y={-17} width={108} height={34} rx={17} fill={SC.error} />
              <text x={50} y={5} textAnchor="middle" fontSize={14} fontWeight={800} fill="#fff">half quit</text>
            </g>
          )}
        </g>
      )}

      {/* ---- the problem statement ---- */}
      {t >= 17.3 && (
        <g transform={`translate(240 ${300}) scale(${back((t - 17.3) / 0.5)})`} opacity={1 - p(t, 23, 23.8) * 0.55}>
          <rect x={-200} y={-100} width={400} height={200} rx={18} fill={SC.surface} stroke={SC.discover} strokeWidth={3} strokeDasharray={t < 18 ? '8 6' : undefined} />
          <text x={-176} y={-68} fontSize={13} fontWeight={800} letterSpacing={1.5} fill={SC.discover}>PROBLEM STATEMENT</text>
          {CHIPS.map((c, i) => {
            if (t < c.at) return null;
            const k = back((t - c.at) / 0.5);
            const w = Math.max(150, c.text.length * 8.2 + 64);
            return (
              <g key={c.tag} transform={`translate(${-176 + (1 - clamp(k)) * -60} ${-38 + i * 46})`} opacity={clamp(k)}>
                <rect width={Math.min(352, w)} height={36} rx={10} fill={c.c} opacity={0.16} />
                <rect width={44} height={36} rx={10} fill={c.c} />
                <text x={22} y={23} textAnchor="middle" fontSize={11} fontWeight={800} fill="#fff">{c.tag}</text>
                <text x={54} y={23} fontSize={13.5} fontWeight={700} fill={SC.text}>{c.text}</text>
              </g>
            );
          })}
        </g>
      )}

      {/* ---- back to the solution space: ideas, judged against the problem ---- */}
      {t >= 23.2 && t < 29.4 && (
        <path d={`M 440 300 C 500 300 520 ${150 + PICK * 56} 540 ${150 + PICK * 56}`} fill="none" stroke={SC.discover} strokeWidth={3} strokeDasharray="6 6"
          pathLength={1} strokeDashoffset={0} opacity={p(t, 23.2, 24) * (1 - p(t, 28.6, 29.4))} />
      )}
      {t >= 24 && IDEAS.map((idea, i) => {
        const k = back((t - (24 + i * 0.3)) / 0.45);
        const picked = i === PICK, crossed = i === 0 && t >= 25;
        const fly = picked ? p(t, 26, 26.8) : 0;
        const dim = !picked && t >= 25.8 ? 0.35 : 1;
        if (fly >= 1) return null;
        const x = lerp(548, PHONE.x - 66, fly), y = lerp(150 + i * 56, PHONE.y - 14, fly);
        return (
          <g key={idea} transform={`translate(${x} ${y}) scale(${clamp(k) * (1 - fly * 0.4)})`} opacity={dim * (1 - fly * 0.6)}>
            <rect y={-18} width={150} height={36} rx={10} fill={SC.surface} stroke={picked && t >= 25.6 ? SC.mint : SC.grow} strokeWidth={2} />
            <text x={12} y={5} fontSize={12.5} fontWeight={700} fill={SC.text} textDecoration={crossed ? 'line-through' : undefined}>{idea}</text>
            {crossed && <g transform="translate(150 0)"><circle r={11} fill={SC.error} /><XIcon x={-7} y={-7} width={14} height={14} color="#fff" weight="bold" /></g>}
            {picked && t >= 25.6 && <g transform={`translate(150 0) scale(${back((t - 25.6) / 0.4)})`}><circle r={11} fill={SC.mint} /><CheckIcon x={-7} y={-7} width={14} height={14} color="#fff" weight="bold" /></g>}
          </g>
        );
      })}

      {/* ---- finale ---- */}
      {t >= 30 && [{ x: DIV / 2, line: 'Who struggles, what goes wrong, why', c: SC.discover }, { x: DIV + (W - DIV) / 2, line: 'What we could build to fix it', c: SC.grow }].map(f => (
        <text key={f.line} x={f.x} y={78} textAnchor="middle" fontSize={15} fontWeight={700} fill={f.c} opacity={p(t, 30, 30.8)}>{f.line}</text>
      ))}

      {nib && <g opacity={clamp((t - 3.8) / 0.4)}><Pen x={nib.x} y={nib.y} scale={0.5} mood={nibMood} /></g>}
    </svg>
  );
}
