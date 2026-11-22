'use client';
// Scene for bz.1-2: one customer's ledger as two columns. CAC (₹500) in red; LTV built month by month from margin blocks
// (₹99 × 60% ≈ ₹59 a month). Six months leave it underwater; design stretches it to 14 months and cuts CAC to ₹250,
// passing 3 × CAC. Pure function of t (0–34).
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
const PER_MONTH = 99 * 0.6;       // margin per month
const BASE = 380, SCALE = 0.3;   // px per rupee, baseline y

export function UnitEconomicsScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const months = t < 6 ? 0 : t < 17 ? Math.min(6, Math.floor((t - 6.2) / 0.5) + 1) : Math.min(14, 6 + Math.floor((t - 17.4) / 0.45) + 1);
  const ltv = months * PER_MONTH;
  const cac = lerp(500, 250, p(t, 23.4, 24.6));
  const ratio = ltv / cac;
  const verdict = ratio >= 3 ? { l: `LTV ${ratio.toFixed(1)} × CAC: healthy`, c: SC.mint } : ratio >= 1 ? { l: `LTV ${ratio.toFixed(1)} × CAC: risky`, c: SC.design } : { l: `LTV ${ratio.toFixed(1)} × CAC: losing money`, c: SC.error };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: lifetime value against acquisition cost for one customer">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        <line x1={180} y1={BASE} x2={780} y2={BASE} stroke={SC.muted} strokeWidth={2} />
        {/* CAC */}
        <g opacity={clamp(t / 0.5)}>
          <rect x={260} y={BASE - cac * SCALE} width={140} height={cac * SCALE} rx={10} fill={SC.error} opacity={0.85} />
          <text x={330} y={BASE + 30} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.text}>CAC</text>
          <text x={330} y={BASE - cac * SCALE - 12} textAnchor="middle" fontSize={18} fontWeight={800} fill={SC.error}>₹{Math.round(cac)}</text>
          <text x={330} y={BASE + 52} textAnchor="middle" fontSize={12} fontWeight={700} fill={SC.muted}>cost to win them</text>
        </g>
        {/* LTV, month by month */}
        {t >= 6 && (
          <g>
            {Array.from({ length: months }, (_, i) => (
              <rect key={i} x={560} y={BASE - (i + 1) * PER_MONTH * SCALE + 1} width={140} height={PER_MONTH * SCALE - 2} rx={4}
                fill={i >= 6 ? SC.mint : SC.discover} opacity={0.85} transform={`translate(0 ${(1 - clamp(back((t - (i < 6 ? 6.2 + i * 0.5 : 17.4 + (i - 6) * 0.45)) / 0.3))) * -30})`} />
            ))}
            <text x={630} y={BASE + 30} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.text}>LTV</text>
            <text x={630} y={BASE - ltv * SCALE - 12} textAnchor="middle" fontSize={18} fontWeight={800} fill={SC.discover}>₹{Math.round(ltv)}</text>
            <text x={630} y={BASE + 52} textAnchor="middle" fontSize={12} fontWeight={700} fill={SC.muted}>{months} months × ₹99 × 60%</text>
          </g>
        )}
        {/* 3 × CAC line */}
        {t >= 23 && (
          <g opacity={clamp((t - 23) / 0.4)}>
            <line x1={540} y1={BASE - 3 * cac * SCALE} x2={720} y2={BASE - 3 * cac * SCALE} stroke={SC.mint} strokeWidth={2} strokeDasharray="6 5" />
            <text x={728} y={BASE - 3 * cac * SCALE + 4} fontSize={12} fontWeight={800} fill={SC.mint}>3 × CAC</text>
          </g>
        )}
        {t >= 11 && (
          <g transform="translate(480 70)" opacity={clamp((t - 11) / 0.4)}>
            <rect x={-170} y={-22} width={340} height={44} rx={22} fill={verdict.c} />
            <text y={6} textAnchor="middle" fontSize={16} fontWeight={800} fill="#fff">{verdict.l}</text>
          </g>
        )}
        {t >= 17.4 && t < 23 && <text x={480} y={480} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.mint}>Better onboarding and habits: 14 months instead of 6</text>}
        {t >= 24.6 && t < 29 && <text x={480} y={480} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.mint}>Easier sign-up and referrals: CAC halves to ₹250</text>}
      </g>

      {fin > 0 && [{ x: 200, n: 'LTV', l: 'Price × months × margin', c: SC.discover }, { x: 480, n: 'CAC', l: 'Cost to win a customer', c: SC.error }, { x: 760, n: 'LTV ≥ 3 × CAC', l: 'Design moves both', c: SC.mint }].map((f, i) => {
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
