'use client';
// Scene for gr.4-4: Riyaaz's referral loop. K and its amplification (`kFactor`, `amplify`, `REFERRAL_BASE`), the
// cashback that lifts K while kept K falls (`keptK`), loops that come from the product, the designs that win on numbers
// but aren't fair (`RIYAAZ_REFERRALS`, `referralCall`), and the new loop (`REFERRAL_NEW_KEPT_K`). Pure function of t
// (0–38). Also exports `REFERRAL_FILL`, which `referral-math` uses.
import { REFERRAL_BASE, REFERRAL_NEW_KEPT_K, RIYAAZ_REFERRALS, amplify, kFactor, keptK, referralCall, type ReferralCall, type RiyaazReferral } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per call; white text on each passes 4.5:1. */
export const REFERRAL_FILL: Record<ReferralCall, string> = { ship: '#067647', hollow: '#175CD3', dark: '#B42318', flat: '#475467' };

const KEYS = Object.keys(RIYAAZ_REFERRALS) as RiyaazReferral[];
const of = (c: ReferralCall) => KEYS.filter(k => referralCall(RIYAAZ_REFERRALS[k]) === c);
const fmt = (n: number) => Math.round(n).toLocaleString('en-IN');
const cash = RIYAAZ_REFERRALS.cashSignup;

export function ViralLoopScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? `K = ${kFactor(REFERRAL_BASE)}` : t < 12 ? 'The cashback jump' : t < 18 ? 'Kept K' : t < 24 ? 'Loops in the product' : t < 30 ? 'Fair or not' : t < 34 ? 'The new loop' : 'Amplified';
  const baseK = kFactor(REFERRAL_BASE);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Riyaaz students send ${REFERRAL_BASE.invites} invites each and ${REFERRAL_BASE.conversion * 100}% join, so K is ${baseK}, and 1,000 students from ads become about ${fmt(1000 * amplify(baseK))}. ₹200 cashback per sign-up lifts K to ${kFactor(cash)}, but only ${cash.kept * 100}% are practising after 30 days, so kept K falls from ${keptK(REFERRAL_BASE)} to ${keptK(cash)}. The best loops come from the product: a duet clip with the teacher’s demo, and teachers inviting whole classes. ${of('dark').map(k => RIYAAZ_REFERRALS[k].short).join(', ')} win on numbers but aren’t the user’s choice, so they are out. With duet clips, class links and ₹150 each after ten practice days, kept K rises to ${REFERRAL_NEW_KEPT_K}, and 1,000 students from ads become about ${fmt(1000 * amplify(REFERRAL_NEW_KEPT_K))} who stay.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            {([['Invites per student', `${REFERRAL_BASE.invites}`], ['× share who join', `${REFERRAL_BASE.conversion * 100}%`], ['= K', `${baseK}`]] as const).map(([a, b], i) => (
              <g key={a} opacity={p(t, 0.3 + i * 0.7, 0.9 + i * 0.7)}>
                <text x={32} y={104 + i * 44} fontSize={21} fontWeight={800} fill={SC.text}>{a}</text>
                <text x={330} y={104 + i * 44} fontSize={24} fontWeight={900} fill={i === 2 ? REFERRAL_FILL.ship : SC.text} textAnchor="end">{b}</text>
              </g>
            ))}
            {[1, baseK, baseK ** 2, baseK ** 3].map((v, i) => {
              const k = p(t, 2.6 + i * 0.5, 3.1 + i * 0.5);
              return (
                <g key={i} opacity={k}>
                  <rect x={380} y={74 + i * 52} width={Math.max(4, v * 150)} height={36} rx={6} fill={i ? REFERRAL_FILL.ship : SC.brand} />
                  <text x={608} y={99 + i * 52} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="end">{fmt(1000 * v)}</text>
                </g>
              );
            })}
            <text x={32} y={300} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 4.4, 5)}>1,000 from ads, every round of invites:</text>
            <text x={32} y={334} fontSize={24} fontWeight={900} fill={REFERRAL_FILL.ship} opacity={p(t, 4.4, 5)}>about {fmt(1000 * amplify(baseK))} in all · 1 ÷ (1 − K)</text>
          </g>
        )}

        {t >= 6 && t < 12 && (
          <g>
            <text x={32} y={88} fontSize={21} fontWeight={800} fill={SC.muted}>₹200 cashback for every friend who signs up</text>
            {([['K', baseK, kFactor(cash), 0.7], ['Still practising at 30 days', REFERRAL_BASE.kept, cash.kept, 1]] as const).map(([label, a, b, max], i) => {
              const k = p(t, 6.6 + i * 2, 7.8 + i * 2);
              const v = lerp(a, b, k);
              return (
                <g key={label}>
                  <text x={32} y={142 + i * 100} fontSize={21} fontWeight={800} fill={SC.text}>{label}</text>
                  <rect x={32} y={156 + i * 100} width={(v / max) * 460} height={34} rx={6} fill={i ? SC.error : REFERRAL_FILL.hollow} />
                  <text x={44 + (v / max) * 460} y={181 + i * 100} fontSize={21} fontWeight={900} fill={SC.text}>{i ? `${Math.round(v * 100)}%` : v.toFixed(2)}</text>
                </g>
              );
            })}
          </g>
        )}

        {t >= 12 && t < 18 && (
          <g>
            <text x={32} y={88} fontSize={21} fontWeight={800} fill={SC.muted}>Kept K = invites × join × still practising</text>
            {([['Today', REFERRAL_BASE, SC.brand], ['Cashback', cash, SC.error]] as const).map(([label, r, fill], i) => {
              const k = p(t, 12.6 + i * 1.4, 13.6 + i * 1.4);
              return (
                <g key={label} opacity={clamp(k * 2)}>
                  <text x={32} y={150 + i * 90} fontSize={24} fontWeight={900} fill={SC.text}>{label}</text>
                  <text x={32} y={180 + i * 90} fontSize={21} fontWeight={700} fill={SC.muted}>{r.invites} × {r.conversion} × {r.kept}</text>
                  <rect x={300} y={136 + i * 90} width={keptK(r) / 0.07 * 220 * k} height={36} rx={6} fill={fill} />
                  <text x={312 + keptK(r) / 0.07 * 220 * k} y={162 + i * 90} fontSize={21} fontWeight={900} fill={SC.text}>{keptK(r)}</text>
                </g>
              );
            })}
            <text x={32} y={330} fontSize={21} fontWeight={800} fill={SC.error} opacity={p(t, 15.8, 16.4)}>It pays for sign-ups who leave.</text>
          </g>
        )}

        {t >= 18 && t < 24 && (
          <g>
            <g opacity={p(t, 18.3, 19)}>
              <rect x={32} y={70} width={280} height={250} rx={18} fill={SC.surface} stroke={REFERRAL_FILL.ship} strokeWidth={2} />
              <text x={52} y={104} fontSize={21} fontWeight={900} fill={SC.text}>Duet · Yaman</text>
              {[0, 1].map(row => (
                <g key={row}>
                  <text x={52} y={146 + row * 56} fontSize={21} fontWeight={700} fill={SC.muted}>{row ? 'Sunita' : 'Asha-ji'}</text>
                  {Array.from({ length: 14 }, (_, i) => {
                    const h = 8 + Math.abs(Math.sin(i * 1.3 + row + t * 3)) * 24;
                    return <rect key={i} x={140 + i * 11} y={140 + row * 56 - h / 2} width={6} height={h} rx={3} fill={row ? REFERRAL_FILL.ship : SC.brand} />;
                  })}
                </g>
              ))}
              <rect x={52} y={256} width={240} height={44} rx={22} fill={REFERRAL_FILL.ship} />
              <text x={172} y={285} fontSize={21} fontWeight={800} fill="#fff" textAnchor="middle">Try this phrase</text>
            </g>
            <g opacity={p(t, 20.4, 21.1)}>
              <rect x={336} y={70} width={272} height={250} rx={18} fill={SC.surface} stroke={REFERRAL_FILL.ship} strokeWidth={2} />
              <text x={356} y={104} fontSize={21} fontWeight={900} fill={SC.text}>Asha-ji’s class</text>
              {Array.from({ length: 12 }, (_, i) => (
                <circle key={i} cx={376 + (i % 6) * 40} cy={156 + Math.floor(i / 6) * 48} r={14} fill={REFERRAL_FILL.ship} opacity={p(t, 21 + i * 0.12, 21.3 + i * 0.12)} />
              ))}
              <text x={356} y={276} fontSize={21} fontWeight={700} fill={SC.muted}>One link, a whole</text>
              <text x={356} y={302} fontSize={21} fontWeight={700} fill={SC.muted}>class joins</text>
            </g>
          </g>
        )}

        {t >= 24 && t < 30 && (
          <g>
            {of('dark').map((k, i) => {
              const r = RIYAAZ_REFERRALS[k];
              const strike = p(t, 25 + i * 1.2, 25.6 + i * 1.2);
              return (
                <g key={k} opacity={p(t, 24.2 + i * 0.3, 24.7 + i * 0.3)}>
                  <rect x={32} y={70 + i * 88} width={576} height={74} rx={12} fill={SC.surface} stroke={REFERRAL_FILL.dark} strokeWidth={2} />
                  <text x={52} y={102 + i * 88} fontSize={21} fontWeight={800} fill={SC.text}>{r.short}</text>
                  <text x={52} y={130 + i * 88} fontSize={21} fontWeight={700} fill={SC.muted}>kept K {keptK(r)} · beats today</text>
                  <line x1={48} y1={96 + i * 88} x2={lerp(48, 260, strike)} y2={96 + i * 88} stroke={REFERRAL_FILL.dark} strokeWidth={3} />
                  <rect x={480} y={90 + i * 88} width={110} height={34} rx={17} fill={REFERRAL_FILL.dark} opacity={strike} />
                  <text x={535} y={114 + i * 88} fontSize={21} fontWeight={800} fill="#fff" textAnchor="middle" opacity={strike}>Out</text>
                </g>
              );
            })}
          </g>
        )}

        {t >= 30 && t < 34 && (
          <g>
            {of('ship').map((k, i) => (
              <g key={k} opacity={p(t, 30.2 + i * 0.4, 30.7 + i * 0.4)}>
                <rect x={32} y={70 + i * 58} width={330} height={46} rx={23} fill={REFERRAL_FILL.ship} />
                <text x={197} y={100 + i * 58} fontSize={21} fontWeight={800} fill="#fff" textAnchor="middle">{RIYAAZ_REFERRALS[k].short}</text>
              </g>
            ))}
            <text x={400} y={120} fontSize={21} fontWeight={800} fill={SC.muted}>Kept K</text>
            <text x={400} y={176} fontSize={44} fontWeight={900} fill={REFERRAL_FILL.ship}>{lerp(keptK(REFERRAL_BASE), REFERRAL_NEW_KEPT_K, p(t, 31.4, 33)).toFixed(2)}</text>
            <text x={32} y={290} fontSize={21} fontWeight={700} fill={SC.muted} opacity={p(t, 32, 32.6)}>Every invite to someone the student picked.</text>
          </g>
        )}

        {t >= 34 && (
          <g>
            {([['Before', keptK(REFERRAL_BASE), SC.brand], ['Now', REFERRAL_NEW_KEPT_K, REFERRAL_FILL.ship]] as const).map(([label, k, fill], i) => {
              const total = 1000 * amplify(k);
              const g = p(t, 34.2 + i * 0.9, 35.2 + i * 0.9);
              return (
                <g key={label}>
                  <text x={32} y={110 + i * 100} fontSize={21} fontWeight={800} fill={SC.text}>{label} · kept K {k}</text>
                  <rect x={32} y={124 + i * 100} width={lerp(400, (total / 1300) * 520, g)} height={40} rx={6} fill={fill} />
                  <text x={44 + lerp(400, (total / 1300) * 520, g)} y={152 + i * 100} fontSize={21} fontWeight={900} fill={SC.text}>{fmt(lerp(1000, total, g))}</text>
                </g>
              );
            })}
            <text x={32} y={330} fontSize={21} fontWeight={700} fill={SC.muted} opacity={p(t, 36, 36.6)}>From 1,000 students acquired, who stay</text>
          </g>
        )}
      </g>
    </svg>
  );
}
