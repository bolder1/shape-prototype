'use client';
// Scene for bz.3-2: Parcha's inherited pricing page (`OLD_PRICING`): six plans from Basic to Enterprise, four of them
// "Contact us", none saying who it's for and no unit. `pricingFlaws` lists every problem while Dr. Farida's cursor
// wanders between columns and gives up. Then the redesign (`PARCHA_PLANS`, `PARCHA_PRICING`): three plans named for
// who they're for, a price per something buyers count, "Most clinics pick this" on Clinic, and the yearly saving in
// rupees (`yearly`). Farida's fence (`fenceFor`) lights Solo and her bill appears. Pure function of t (0–36).
// Also exports `PLAN_TONE` for `plan-pick`.
import { FENCE_TEXT, OLD_PRICING, PARCHA_BUYERS, PARCHA_PLANS, PARCHA_PRICING, PLAN_IDS, fenceFor, inr, monthlyBill, planFor, pricingFlaws, yearly, type PlanId, type PricingFlaw } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
export const PLAN_TONE: Record<PlanId, string> = { solo: SC.discover, clinic: SC.design, chain: SC.build };
const FLAW_NAME: Record<PricingFlaw, string> = {
  choice: 'Six plans to compare', hidden: 'Four say “Contact us”', whofor: 'None says who it’s for', nofocus: 'No usual choice marked', metric: 'No “per” on any price',
};
const OLD_FLAWS = pricingFlaws(OLD_PRICING);
const NEW_FLAWS = pricingFlaws(PARCHA_PRICING);
const FARIDA = PARCHA_BUYERS.farida;
const FARIDA_PLAN = planFor(FARIDA);
const SOLO_YEAR = yearly(PARCHA_PLANS.solo.price);

function OldPage({ o, t }: { o: number; t: number }) {
  // Farida's cursor drifts across the columns, then stops.
  const cx = 110 + ((Math.sin(t * 1.7) + 1) / 2) * 560, cy = 220 + Math.sin(t * 2.3) * 40;
  return (
    <g opacity={o}>
      {OLD_PRICING.tiers.map((tier, i) => (
        <g key={tier.name} transform={`translate(${60 + i * 112} 130)`}>
          <rect width={102} height={220} rx={12} fill={SC.surface} stroke={SC.line} />
          <text x={51} y={32} textAnchor="middle" fontSize={15} fontWeight={900} fill={SC.text}>{tier.name}</text>
          <text x={51} y={66} textAnchor="middle" fontSize={tier.price === null ? 12 : 17} fontWeight={800} fill={tier.price === null ? SC.muted : SC.text}>{tier.price === null ? 'Contact us' : inr(tier.price)}</text>
          {Array.from({ length: 7 }, (_, r) => <rect key={r} x={14} y={88 + r * 17} width={74 - ((r * 13 + i * 7) % 30)} height={7} rx={3} fill={SC.line} />)}
        </g>
      ))}
      {t >= 6 && t < 11 && (
        <g transform={`translate(${cx} ${cy})`} opacity={p(t, 6, 6.4)}>
          <path d="M0 0 L0 20 L5 15 L9 24 L12 22 L8 14 L15 14 Z" fill={SC.text} stroke={SC.surface} strokeWidth={1.5} />
          <text x={18} y={-4} fontSize={22} fontWeight={900} fill={SC.error} opacity={p(t, 8, 8.5)}>?</text>
        </g>
      )}
    </g>
  );
}

function NewPage({ o, t }: { o: number; t: number }) {
  const fence = fenceFor(FARIDA);
  return (
    <g opacity={o}>
      {PLAN_IDS.map((id, i) => {
        const pl = PARCHA_PLANS[id];
        const shown = p(t, 11 + i * 0.5, 11.6 + i * 0.5);
        const mark = id === 'clinic' ? p(t, 21, 21.6) : 0;
        const lit = id === FARIDA_PLAN && t >= 31.4;
        return (
          <g key={id} transform={`translate(${60 + i * 222} ${lerp(150, 130, shown)})`} opacity={shown}>
            <rect width={208} height={248} rx={14} fill={SC.surface} stroke={lit ? SC.mint : mark ? PLAN_TONE[id] : SC.line} strokeWidth={lit ? 4 : mark ? 3 : 1} />
            {mark > 0 && (
              <g opacity={mark}>
                <rect x={36} y={-14} width={136} height={26} rx={13} fill={SC.surface} stroke={PLAN_TONE[id]} strokeWidth={2} />
                <text x={104} y={4} textAnchor="middle" fontSize={12} fontWeight={900} fill={SC.text}>Most clinics pick this</text>
              </g>
            )}
            <rect x={16} y={22} width={30} height={6} rx={3} fill={PLAN_TONE[id]} />
            <text x={16} y={52} fontSize={20} fontWeight={900} fill={SC.text}>{pl.name}</text>
            {(pl.forWho.length > 24 ? [pl.forWho.slice(0, pl.forWho.lastIndexOf(' ', 24)), pl.forWho.slice(pl.forWho.lastIndexOf(' ', 24) + 1)] : [pl.forWho]).map((l, k) => (
              <text key={k} x={16} y={76 + k * 17} fontSize={13} fontWeight={700} fill={SC.muted}>{l}</text>
            ))}
            <g opacity={p(t, 16, 16.6)}>
              <text x={16} y={136} fontSize={pl.price === null ? 20 : 26} fontWeight={900} fill={SC.text}>{pl.price === null ? 'Talk to us' : inr(pl.price)}</text>
              <text x={16} y={156} fontSize={12} fontWeight={700} fill={SC.muted}>{pl.price === null ? 'Quoted for your chain' : pl.unit}</text>
            </g>
            {pl.features.slice(0, 3).map((f, k) => (
              <text key={f} x={16} y={186 + k * 18} fontSize={12} fontWeight={600} fill={SC.text} opacity={p(t, 17 + k * 0.3, 17.5 + k * 0.3)}>· {f}</text>
            ))}
          </g>
        );
      })}
      <g transform="translate(726 130)" opacity={p(t, 26, 26.6)}>
        <rect width={180} height={120} rx={14} fill={SC.surface} stroke={SC.grow} strokeWidth={2} />
        <text x={16} y={30} fontSize={14} fontWeight={900} fill={SC.text}>Pay yearly</text>
        <text x={16} y={52} fontSize={13} fontWeight={700} fill={SC.muted}>2 months free</text>
        <text x={16} y={78} fontSize={13} fontWeight={800} fill={SC.text}>Solo: {inr(SOLO_YEAR.total)} a year</text>
        <text x={16} y={98} fontSize={13} fontWeight={800} fill={SC.text}>You save {inr(SOLO_YEAR.saves)}</text>
      </g>
      <text x={726} y={274} fontSize={12} fontWeight={700} fill={SC.muted} opacity={p(t, 27, 27.6)}>All prices before 18% GST, stated here</text>
      {t >= 31 && (
        <g transform="translate(60 410)" opacity={p(t, 31, 31.6)}>
          <rect width={640} height={84} rx={16} fill={SC.surface} stroke={SC.mint} strokeWidth={3} />
          <text x={22} y={34} fontSize={18} fontWeight={900} fill={SC.text}>{FARIDA.name}, {FARIDA.place}</text>
          <text x={22} y={62} fontSize={15} fontWeight={700} fill={SC.muted}>{FENCE_TEXT[fence]} · {inr(monthlyBill(FARIDA_PLAN, FARIDA)!)} a month · starts a trial</text>
        </g>
      )}
    </g>
  );
}

export function PricingPageScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const swap = p(t, 10.4, 11);
  const flaws = t < 11 ? OLD_FLAWS : NEW_FLAWS;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Parcha's old pricing page has six plans, Basic to Enterprise; four say Contact us, none says who it's for, and no price says what it is per. Dr. Farida, a dentist in Nashik, can't tell which is hers and leaves. The redesign has three plans: Solo, one doctor and one clinic, ${inr(PARCHA_PLANS.solo.price)} a month; Clinic, 2 to 25 doctors, ${inr(PARCHA_PLANS.clinic.price)} per doctor a month, marked Most clinics pick this; and Chain, quoted. Paying yearly gets two months free, a saving of ${inr(SOLO_YEAR.saves)} on Solo. Farida finds Solo in seconds and starts a trial.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>
          {t < 6 ? 'Six plans, two prices' : t < 11 ? 'Dr. Farida tries to choose' : t < 16 ? 'Three plans, named for who' : t < 21 ? 'Price per something you count' : t < 26 ? 'Mark the usual choice' : t < 31 ? 'Honest about the year' : 'Farida finds hers in seconds'}
        </text>
        <text x={60} y={88} fontSize={15} fontWeight={700} fill={SC.muted}>parcha.in/pricing · {t < 11 ? 'before' : 'after'}</text>

        {swap < 1 && <OldPage o={1 - swap} t={t} />}
        {swap > 0 && <NewPage o={swap} t={t} />}

        {t < 11 && (
          <g transform="translate(60 380)">
            {OLD_FLAWS.map((f, i) => (
              <g key={f} transform={`translate(${(i % 3) * 270} ${Math.floor(i / 3) * 34})`} opacity={p(t, 1.5 + i * 0.6, 2 + i * 0.6)}>
                <rect width={256} height={26} rx={13} fill={SC.surface} stroke={SC.error} strokeWidth={2} />
                <text x={14} y={18} fontSize={13} fontWeight={800} fill={SC.error}>{FLAW_NAME[f]}</text>
              </g>
            ))}
            {t >= 9 && <text x={0} y={100} fontSize={16} fontWeight={800} fill={SC.text} opacity={p(t, 9, 9.5)}>Farida closes the tab.</text>}
          </g>
        )}
        {t >= 21 && t < 31 && flaws.length === 0 && (
          <g transform="translate(60 420)" opacity={p(t, 22, 22.6)}>
            <rect width={420} height={40} rx={20} fill={SC.surface} stroke={SC.mint} strokeWidth={2} />
            <text x={20} y={26} fontSize={15} fontWeight={800} fill={SC.text}>Fences buyers can count: doctors and clinics</text>
          </g>
        )}
      </g>
    </svg>
  );
}
