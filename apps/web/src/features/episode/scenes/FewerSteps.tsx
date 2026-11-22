'use client';
// Scene for ia.2-2: an eleven-screen first order. Cut screens get struck and vanish, Name and Phone merge into "Your
// details", three screens slide down to an "after the first order" shelf. Then everything is squashed into one long form
// that goes wrong, and the flow settles on four clear screens with the trust steps kept. Pure function of t (0–34).
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
const NAMES = ['Welcome', 'Account', 'Name', 'Phone', 'Verify', 'Diet', 'Address', 'Newsletter', 'Photo', 'Rate us', 'Review'];
const CUT = [0, 7, 9], DEFER = [1, 5, 8], KEEP = [4, 6, 10];
const SW = 72, GAP = 10, Y = 110, SH = 120;

/** x of screen i when only `shown` are on the row, centred. Screens not in the row keep `fallback`. */
const rowX = (shown: number[], i: number, fallback: number) => {
  const r = shown.indexOf(i);
  if (r < 0) return fallback;
  return 480 - (shown.length * (SW + GAP) - GAP) / 2 + r * (SW + GAP);
};
const ALL = NAMES.map((_, i) => i);
const S1 = ALL.filter(i => !CUT.includes(i));
const S2 = S1.filter(i => i !== 3);
const S3 = S2.filter(i => !DEFER.includes(i));

export function FewerStepsScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const k1 = p(t, 8.2, 9.6), k2 = p(t, 12.6, 13.8), k3 = p(t, 16.6, 18.2);
  const squash = p(t, 20.2, 21.4) * (1 - p(t, 24.8, 25.8));
  const count = t < 9 ? 11 : t < 13.4 ? 8 : t < 17.6 ? 7 : 4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: shortening a sign-up flow by cutting, merging and deferring steps, without losing clarity">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        <text x={480} y={66} textAnchor="middle" fontSize={22} fontWeight={800} fill={SC.text} opacity={1 - squash}>{count} screens before lunch</text>

        {/* the row of screens */}
        <g opacity={1 - squash * 0.85}>
          {NAMES.map((n, i) => {
            const x0 = rowX(ALL, i, 0), x1 = rowX(S1, i, x0), x2 = i === 3 ? rowX(S2, 2, x1) : rowX(S2, i, x1), x3 = rowX(S3, i, x2);
            let x = lerp(lerp(lerp(x0, x1, k1), x2, k2), x3, k3), y = Y, o = 1;
            const cut = CUT.includes(i), defer = DEFER.includes(i);
            if (cut) o = 1 - p(t, 8, 8.8);
            if (i === 3) o = 1 - p(t, 13.2, 13.8);
            if (defer) { const s = DEFER.indexOf(i); x = lerp(x, 480 - 128 + s * 92, k3); y = lerp(Y, 368, k3); }
            if (o <= 0) return null;
            const kept = KEEP.includes(i) && t >= 25.4, label = i === 2 && t >= 13.4 ? 'Details' : n;
            return (
              <g key={n} opacity={o}>
                <rect x={x} y={y} width={SW} height={SH} rx={10} fill={SC.surface} stroke={kept ? SC.mint : SC.line} strokeWidth={kept ? 3 : 2} />
                <rect x={x + 12} y={y + 22} width={SW - 24} height={8} rx={4} fill={SC.line} />
                <rect x={x + 12} y={y + 40} width={SW - 30} height={8} rx={4} fill={SC.line} />
                {i === 2 && t >= 13.4 && <rect x={x + 12} y={y + 58} width={SW - 24} height={8} rx={4} fill={SC.line} />}
                <text x={x + SW / 2} y={y + SH - 14} textAnchor="middle" fontSize={11} fontWeight={800} fill={SC.text}>{label}</text>
                {cut && t >= 6.4 && t < 8.8 && <path d={`M${x + 14} ${y + 30} l${SW - 28} ${SH - 60} M${x + SW - 14} ${y + 30} l${-(SW - 28)} ${SH - 60}`} stroke={SC.error} strokeWidth={4} strokeLinecap="round" opacity={clamp((t - 6.4 - CUT.indexOf(i) * 0.3) / 0.3)} />}
              </g>
            );
          })}
        </g>

        {/* drop-off: fewer people make it to each screen */}
        {t < 6.2 && NAMES.map((_, i) => {
          const h = 70 * (1 - i * 0.065), x = rowX(ALL, i, 0) + SW / 2 - 10;
          return <rect key={i} x={x} y={330 - h * p(t, 0.6 + i * 0.25, 1 + i * 0.25)} width={20} height={h * p(t, 0.6 + i * 0.25, 1 + i * 0.25)} rx={4} fill={SC.design} opacity={0.7 * (1 - p(t, 5.6, 6.2))} />;
        })}
        {t < 6.2 && <text x={480} y={360} textAnchor="middle" fontSize={14} fontWeight={700} fill={SC.muted} opacity={clamp((t - 2) / 0.5) * (1 - p(t, 5.6, 6.2))}>People still going, screen by screen</text>}

        {/* step labels */}
        {[{ at: 6, l: 'Cut', c: SC.error }, { at: 11, l: 'Merge', c: SC.design }, { at: 15, l: 'Defer', c: SC.discover }].map(s => t >= s.at && t < s.at + (s.l === 'Defer' ? 5 : 4) && (
          <text key={s.l} x={480} y={286} textAnchor="middle" fontSize={20} fontWeight={800} fill={s.c} opacity={clamp((t - s.at) / 0.4) * (1 - squash)}>{s.l}</text>
        ))}
        {t >= 16.6 && (
          <g opacity={clamp((t - 16.6) / 0.6) * (1 - squash * 0.85)}>
            <rect x={300} y={354} width={360} height={148} rx={16} fill="none" stroke={SC.line} strokeWidth={2} strokeDasharray="6 6" />
            <text x={480} y={346} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.muted}>After the first order</text>
          </g>
        )}

        {/* too far: one long form */}
        {squash > 0 && (
          <g opacity={squash}>
            <rect x={380} y={40} width={200} height={460} rx={16} fill={SC.surface} stroke={SC.error} strokeWidth={2.5} />
            {Array.from({ length: 13 }, (_, k) => <rect key={k} x={400} y={64 + k * 32} width={k % 3 === 2 ? 110 : 160} height={14} rx={5} fill={SC.line} />)}
            {[{ y: 150, l: 'Where am I?' }, { y: 270, l: 'Missed this error' }, { y: 390, l: 'Wrong address!' }].map((q, k) => (
              <g key={q.l} opacity={clamp((t - 21.4 - k * 0.6) / 0.4)}>
                <circle cx={612} cy={q.y} r={14} fill={SC.error} /><text x={612} y={q.y + 5} textAnchor="middle" fontSize={15} fontWeight={800} fill="#fff">?</text>
                <text x={634} y={q.y + 5} fontSize={14} fontWeight={800} fill={SC.error}>{q.l}</text>
              </g>
            ))}
            <text x={480} y={526} textAnchor="middle" fontSize={14} fontWeight={800} fill={SC.error}>One screen, but harder to get right</text>
          </g>
        )}

        {/* keep what builds trust */}
        {t >= 25.4 && <text x={480} y={286} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.mint} opacity={clamp((t - 25.6) / 0.4)}>Verify, address and review stay: four clear screens</text>}
      </g>

      {fin > 0 && [{ x: 200, n: 'Cut', l: 'Steps that do nothing', c: SC.error }, { x: 480, n: 'Merge · Defer', l: 'Combine, or ask after value', c: SC.design }, { x: 760, n: 'Keep', l: 'Steps that prevent mistakes', c: SC.mint }].map((f, i) => {
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
