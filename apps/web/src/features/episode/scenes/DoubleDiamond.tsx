'use client';
// Scene for fd.1-2: a team fixes QuickPay's broken sign-up, and the Double Diamond draws itself around the story.
// Pure function of t (seconds, 0–34), so the Watch stage can play, pause and scrub it like a video.
import { ChartBarIcon, ChatsCircleIcon, CheckIcon, RocketLaunchIcon, TicketIcon, UsersIcon, XIcon } from '@phosphor-icons/react/ssr';
import { at, back, clamp, lerp, p, Pen } from './shared';

const W = 960, H = 540, MID = 280;
const C = {
  surface: 'var(--color-bg-primary)', soft: 'var(--color-bg-secondary)', line: 'var(--color-border-secondary)',
  text: 'var(--color-text-primary)', muted: 'var(--color-text-tertiary)', brand: 'var(--color-bg-brand-solid)',
  mint: '#2BC08A', error: 'var(--color-fg-error-primary)',
  discover: 'var(--color-family-discover)', define: 'var(--color-family-design)', develop: 'var(--color-family-grow)', deliver: 'var(--color-family-build)',
};

// Diamond corners.
const D1 = { L: [120, MID], T: [300, MID - 150], B: [300, MID + 150], R: [480, MID] } as const;
const D2 = { L: [500, MID], T: [680, MID - 150], B: [680, MID + 150], R: [860, MID] } as const;


/** Two edges that open from (or close to) a point: drawn in step with the phase. */
function Half({ from, a, b, k, color, fill }: { from: readonly number[]; a: readonly number[]; b: readonly number[]; k: number; color: string; fill: number }) {
  const [x1, y1] = at(from, a, k), [x2, y2] = at(from, b, k);
  return (
    <g>
      {fill > 0 && <polygon points={`${from} ${a} ${b}`} fill={color} opacity={fill * 0.14} />}
      <line x1={from[0]} y1={from[1]} x2={x1} y2={y1} stroke={color} strokeWidth={4} strokeLinecap="round" />
      <line x1={from[0]} y1={from[1]} x2={x2} y2={y2} stroke={color} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
}


const RESEARCH = [
  { icon: ChatsCircleIcon, x: 190, y: 220 }, { icon: TicketIcon, x: 230, y: 310 }, { icon: ChartBarIcon, x: 260, y: 200 },
  { icon: UsersIcon, x: 285, y: 345 }, { icon: ChatsCircleIcon, x: 300, y: 250 }, { icon: TicketIcon, x: 215, y: 265 },
  { icon: ChartBarIcon, x: 330, y: 300 }, { icon: UsersIcon, x: 250, y: 255 }, { icon: TicketIcon, x: 320, y: 210 },
];
const IDEAS = [{ x: 560, y: 225 }, { x: 600, y: 330 }, { x: 640, y: 180 }, { x: 680, y: 280 }, { x: 650, y: 380 }];

/** Pen position over the whole story: tracing whichever edge is being drawn. */
function penAt(t: number): { x: number; y: number; show: number } {
  const seg: [number, number, readonly number[], readonly number[]][] = [
    [5, 10.5, D1.L, D1.T], [11, 16.5, D1.T, D1.R], [17, 22.5, D2.L, D2.T], [23, 28.5, D2.T, D2.R],
  ];
  for (const [a, b, A, B] of seg) if (t >= a - 0.6 && t <= b + 0.3) { const [x, y] = at(A, B, p(t, a, b)); return { x, y, show: clamp((t - (a - 0.6)) / 0.4) }; }
  if (t > 28.8) return { x: 900, y: 120, show: clamp((t - 29) / 0.6) };   // Nib floats off to admire the work
  return { x: 0, y: 0, show: 0 };
}

export function DoubleDiamondScene({ t }: { t: number }) {
  const pen = penAt(t);
  const finale = p(t, 29, 30.5);
  const pulse = finale > 0 ? 0.5 + 0.5 * Math.sin(t * 3) : 0;

  // ---- intro: the broken sign-up ----
  const phoneShrink = p(t, 4.2, 5.2);
  const phone = { x: lerp(W / 2, D1.L[0], phoneShrink), y: lerp(MID, D1.L[1], phoneShrink), s: lerp(1, 0.22, phoneShrink) };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated Double Diamond: Discover, Define, Develop, Deliver">
      <rect width={W} height={H} fill={C.soft} />
      {/* faint grid, like a designer's canvas */}
      {Array.from({ length: 24 }, (_, i) => <line key={`v${i}`} x1={i * 40} x2={i * 40} y1={0} y2={H} stroke={C.line} strokeOpacity={0.35} />)}
      {Array.from({ length: 14 }, (_, i) => <line key={`h${i}`} y1={i * 40} y2={i * 40} x1={0} x2={W} stroke={C.line} strokeOpacity={0.35} />)}

      {/* ---- the diamonds, drawn phase by phase ---- */}
      <g opacity={1}>
        <Half from={D1.L} a={D1.T} b={D1.B} k={p(t, 5, 10.5)} color={C.discover} fill={p(t, 9, 11) + pulse * 0.5} />
        {t >= 11 && <Half from={D1.R} a={D1.T} b={D1.B} k={p(t, 11, 16.5)} color={C.define} fill={p(t, 15, 17) + pulse * 0.5} />}
        {t >= 16.5 && <line x1={D1.R[0]} y1={MID} x2={lerp(D1.R[0], D2.L[0], p(t, 16.5, 17))} y2={MID} stroke={C.muted} strokeWidth={3} strokeDasharray="4 6" />}
        {t >= 17 && <Half from={D2.L} a={D2.T} b={D2.B} k={p(t, 17, 22.5)} color={C.develop} fill={p(t, 21, 23) + pulse * 0.5} />}
        {t >= 23 && <Half from={D2.R} a={D2.T} b={D2.B} k={p(t, 23, 28.5)} color={C.deliver} fill={p(t, 27, 29) + pulse * 0.5} />}
      </g>

      {/* phase labels */}
      {[
        { label: 'Discover', x: 210, at: 5.3, c: C.discover }, { label: 'Define', x: 390, at: 11.3, c: C.define },
        { label: 'Develop', x: 590, at: 17.3, c: C.develop }, { label: 'Deliver', x: 770, at: 23.3, c: C.deliver },
      ].map(l => {
        const k = back((t - l.at) / 0.5);
        return t >= l.at && (
          <g key={l.label} transform={`translate(${l.x} ${86 - (1 - k) * 12})`} opacity={clamp((t - l.at) / 0.3)}>
            <rect x={-52} y={-18} width={104} height={32} rx={16} fill={l.c} />
            <text y={4} textAnchor="middle" fontSize={15} fontWeight={700} fill="#fff">{l.label}</text>
          </g>
        );
      })}

      {/* ---- Discover: research spreads out ---- */}
      {RESEARCH.map((r, i) => {
        const out = back((t - (5.8 + i * 0.45)) / 0.7);
        const inK = p(t, 12 + i * 0.35, 13.2 + i * 0.35);       // Define: everything converges on one insight
        if (t < 5.8 + i * 0.45 || inK >= 1) return null;
        const x = lerp(lerp(D1.L[0], r.x, out), D1.R[0] - 30, inK), y = lerp(lerp(D1.L[1], r.y, out), MID, inK);
        const s = (1 - inK * 0.7) * clamp(out);
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            <circle r={18} fill={C.surface} stroke={C.discover} strokeWidth={2} />
            <r.icon x={-11} y={-11} width={22} height={22} color={C.discover} weight="duotone" />
          </g>
        );
      })}
      {t >= 15.3 && t < 31 && (() => {
        const k = back((t - 15.3) / 0.6), fade = 1 - p(t, 29.5, 30.5);
        return (
          <g transform={`translate(${D1.R[0]} ${MID - 70}) scale(${k})`} opacity={fade}>
            <rect x={-150} y={-22} width={300} height={44} rx={12} fill={C.define} />
            <text y={6} textAnchor="middle" fontSize={15} fontWeight={700} fill="#fff">“ID upload is where people quit”</text>
            <path d="M-8 22 L0 34 L8 22 Z" fill={C.define} />
          </g>
        );
      })()}

      {/* ---- Develop: five ideas fan out ---- */}
      {IDEAS.map((idea, i) => {
        const out = back((t - (17.8 + i * 0.6)) / 0.7);
        if (t < 17.8 + i * 0.6) return null;
        const rejected = i !== 1 && i !== 3;
        const drop = rejected ? p(t, 23.6 + i * 0.15, 24.6 + i * 0.15) : 0;
        const toTest = rejected ? 0 : p(t, 24, 25);
        const winner = i === 3;
        const ship = winner ? p(t, 26.6, 27.6) : 0;
        const loser = i === 1 ? p(t, 26.2, 26.9) : 0;
        if (drop >= 1 || loser >= 1 || ship >= 1) return null;
        const tx = lerp(lerp(D2.L[0], idea.x, out), 740, toTest), ty = lerp(lerp(D2.L[1], idea.y, out), i === 1 ? 230 : 330, toTest);
        const x = lerp(tx, D2.R[0] - 20, ship), y = lerp(ty, MID, ship) + drop * 60;
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${clamp(out) * (1 - ship * 0.6)}) rotate(${(i - 2) * 4 * (1 - toTest)})`} opacity={(1 - drop) * (1 - loser)}>
            <rect x={-34} y={-24} width={68} height={48} rx={8} fill={C.surface} stroke={C.develop} strokeWidth={2} />
            <path d="M-24 -10 Q-12 -16 0 -10 T24 -10" stroke={C.develop} strokeWidth={2} fill="none" />
            <rect x={-24} y={0} width={30} height={6} rx={3} fill={C.develop} opacity={0.5} />
            <text x={0} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.muted}>Idea {i + 1}</text>
            {/* testing with people, then a verdict */}
            {toTest > 0.9 && t < 26.6 && <g transform="translate(44 -6)"><circle r={13} fill={C.surface} stroke={C.deliver} strokeWidth={2} /><UsersIcon x={-8} y={-8} width={16} height={16} color={C.deliver} weight="bold" /></g>}
            {t >= 25.6 && (winner
              ? <g transform={`translate(0 -38) scale(${back((t - 25.6) / 0.4)})`}><circle r={13} fill={C.mint} /><CheckIcon x={-8} y={-8} width={16} height={16} color="#fff" weight="bold" /></g>
              : <g transform={`translate(0 -38) scale(${back((t - 25.8) / 0.4)})`}><circle r={13} fill={C.error} /><XIcon x={-8} y={-8} width={16} height={16} color="#fff" weight="bold" /></g>)}
          </g>
        );
      })}

      {/* ---- Deliver: shipped ---- */}
      {t >= 27.4 && (() => {
        const k = back((t - 27.4) / 0.6);
        return (
          <g transform={`translate(${D2.R[0]} ${MID}) scale(${k})`}>
            <circle r={30} fill={C.deliver} />
            <RocketLaunchIcon x={-17} y={-17} width={34} height={34} color="#fff" weight="fill" />
          </g>
        );
      })()}
      {t >= 27.9 && (() => {
        const k = back((t - 27.9) / 0.6);
        const pct = Math.round(lerp(48, 81, p(t, 28, 29.2)));
        return (
          <g transform={`translate(${D2.R[0] - 40} ${MID + 110}) scale(${k})`}>
            <rect x={-118} y={-26} width={236} height={52} rx={14} fill={C.surface} stroke={C.mint} strokeWidth={2} />
            <text x={-100} y={-4} fontSize={12} fill={C.muted}>Sign-up completion</text>
            <text x={-100} y={16} fontSize={18} fontWeight={800} fill={C.text}>48% → <tspan fill={C.mint}>{pct}%</tspan></text>
          </g>
        );
      })()}

      {/* ---- finale: what each diamond is about ---- */}
      {finale > 0 && [{ x: 300, label: 'The problem' }, { x: 680, label: 'The solution' }].map(d => (
        <g key={d.label} opacity={finale} transform={`translate(${d.x} ${MID + 196 - (1 - finale) * 10})`}>
          <text textAnchor="middle" fontSize={20} fontWeight={800} fill={C.text}>{d.label}</text>
        </g>
      ))}

      {/* ---- intro: the phone and the people who quit ---- */}
      {t < 5.3 && (
        <g transform={`translate(${phone.x} ${phone.y}) scale(${phone.s})`} opacity={1 - p(t, 4.9, 5.3)}>
          {Array.from({ length: 16 }, (_, i) => {
            const start = 0.3 + i * 0.16, k = p(t, start, start + 0.9);
            const quits = i % 2 === 1, fall = quits ? p(t, start + 0.9, start + 1.6) : 0;
            if (t < start) return null;
            return <circle key={i} cx={lerp(-330, 0, k) + (quits ? fall * 40 : 0)} cy={(i % 4 - 1.5) * 18 + fall * 160} r={7}
              fill={quits && fall > 0 ? C.error : C.discover} opacity={quits ? 1 - fall : 1 - p(t, start + 0.9, start + 1.1)} />;
          })}
          <rect x={-80} y={-140} width={160} height={280} rx={24} fill={C.surface} stroke={C.text} strokeOpacity={0.2} strokeWidth={3} />
          <text y={-100} textAnchor="middle" fontSize={16} fontWeight={800} fill={C.text}>QuickPay</text>
          {['Phone number', 'Your details', 'Upload ID', 'Done'].map((s, i) => (
            <g key={s} transform={`translate(0 ${-60 + i * 40})`}>
              <rect x={-60} y={-14} width={120} height={28} rx={8} fill={i === 2 ? C.error : C.soft} opacity={i === 2 ? 0.25 + 0.35 * clamp((t - 2.5) / 0.5) : 1} />
              <text y={5} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.text}>{s}</text>
            </g>
          ))}
        </g>
      )}
      {t >= 2.6 && t < 5 && (
        <g transform={`translate(${W / 2 + 200} ${MID - 40}) scale(${back((t - 2.6) / 0.5)})`} opacity={1 - p(t, 4.3, 4.8)}>
          <text fontSize={56} fontWeight={800} fill={C.error}>52%</text>
          <text y={30} fontSize={16} fill={C.muted}>quit before finishing</text>
        </g>
      )}

      {pen.show > 0 && <g opacity={pen.show}><Pen x={pen.x} y={pen.y} tilt={-20} /></g>}
    </svg>
  );
}
