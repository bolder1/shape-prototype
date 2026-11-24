'use client';
// Scene for gr.2-3: Kaksha Pro launches with a full-screen paywall on first open, then covers a fee receipt while a
// parent waits at the door, and only 0.9% upgrade. Nisha marks Meenakshi's months as a row of moments from
// `PRO_MOMENTS`, each tagged with the move `upgradeMove` gives it. At the 26th student the offer lands; mid-receipt the
// receipt goes out plain and the offer follows; the Pro screen leads with her own ₹33,000, the full yearly price from
// `KAKSHA_PRO` with the monthly figure, and a plain "Not now". `MOVE_FILL` and `MOVE_NAME` are shared with the When do
// you sell? game. Pure function of t (0–36).
import { KAKSHA_PRO, PRO_MOMENTS, upgradeMove, type ProMomentId, type UpgradeMove } from '@shape/content';
import { back, clamp, Grid, p, SC } from './shared';
import { INK, INK_MUTED } from './EaseCurves';
import { KAKSHA, KAKSHA_SOFT, KakshaPhone } from './JustInTime';

const W = 960, H = 540;
/** One colour per move; white text on each passes 4.5:1. */
export const MOVE_FILL: Record<UpgradeMove, string> = { offer: '#067647', finish: KAKSHA, hint: '#B54708', quiet: '#475467' };
export const MOVE_NAME: Record<UpgradeMove, string> = { offer: 'Offer now', finish: 'Finish, then offer', hint: 'Quiet mention', quiet: 'Don’t sell' };
const ROW: { id: ProMomentId; short: string }[] = [
  { id: 'firstOpen', short: 'First open' },
  { id: 'marking', short: 'Class waiting' },
  { id: 'nearLimit', short: '23rd student' },
  { id: 'receiptLogo', short: 'Receipt, parent waiting' },
  { id: 'failedSend', short: 'Send failed' },
  { id: 'overLimit', short: '26th student' },
];
const monthly = Math.round(KAKSHA_PRO.yearly / 12);

function Paywall({ y = 56, own = false }: { y?: number; own?: boolean }) {
  return (
    <g transform={`translate(8 ${y})`}>
      <rect width={204} height={420 - 8 - y} fill="#FFFFFF" />
      <rect x={14} y={16} width={176} height={26} rx={13} fill={KAKSHA_SOFT} />
      <text x={102} y={34} textAnchor="middle" fontSize={11} fontWeight={900} fill={KAKSHA}>Kaksha Pro</text>
      {own ? (
        <g>
          <text x={102} y={76} textAnchor="middle" fontSize={11} fontWeight={800} fill={INK_MUTED}>Your batches have grown</text>
          <text x={102} y={98} textAnchor="middle" fontSize={11} fontWeight={800} fill={INK_MUTED}>₹33,000 collected this month</text>
          <text x={102} y={136} textAnchor="middle" fontSize={13} fontWeight={900} fill={INK}>Unlimited students</text>
          <text x={102} y={154} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK_MUTED}>Report cards · logo · 2nd teacher</text>
          <text x={102} y={196} textAnchor="middle" fontSize={22} fontWeight={900} fill={INK}>₹{KAKSHA_PRO.yearly} a year</text>
          <text x={102} y={216} textAnchor="middle" fontSize={11} fontWeight={800} fill={INK_MUTED}>about ₹{monthly} a month</text>
          <rect x={22} y={240} width={160} height={36} rx={18} fill={KAKSHA} />
          <text x={102} y={263} textAnchor="middle" fontSize={12} fontWeight={900} fill="#FFFFFF">Get Pro with UPI</text>
          <text x={102} y={302} textAnchor="middle" fontSize={12} fontWeight={900} fill={KAKSHA}>Not now</text>
        </g>
      ) : (
        <g>
          <text x={102} y={110} textAnchor="middle" fontSize={20} fontWeight={900} fill={INK}>Go Pro!</text>
          <text x={102} y={134} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK_MUTED}>14 premium features</text>
          <rect x={22} y={240} width={160} height={36} rx={18} fill={KAKSHA} />
          <text x={102} y={263} textAnchor="middle" fontSize={12} fontWeight={900} fill="#FFFFFF">Upgrade ₹{KAKSHA_PRO.yearly}</text>
          <path d="M176 66 L188 78 M188 66 L176 78" stroke="#98A2B3" strokeWidth={2} />
        </g>
      )}
    </g>
  );
}

function Receipt({ logo = false }: { logo?: boolean }) {
  return (
    <g transform="translate(24 76)">
      <rect width={172} height={200} rx={12} fill="#F9FAFB" stroke="#D0D5DD" />
      {logo && <circle cx={26} cy={26} r={12} fill={KAKSHA} />}
      <text x={logo ? 46 : 16} y={31} fontSize={12} fontWeight={900} fill={INK}>Fee receipt</text>
      <text x={16} y={66} fontSize={11} fontWeight={700} fill={INK_MUTED}>Divya S · Class 10</text>
      <text x={16} y={86} fontSize={11} fontWeight={700} fill={INK_MUTED}>December</text>
      <text x={16} y={130} fontSize={22} fontWeight={900} fill={INK}>₹1,500</text>
      <rect x={16} y={154} width={140} height={30} rx={15} fill={KAKSHA} />
      <text x={86} y={174} textAnchor="middle" fontSize={11} fontWeight={900} fill="#FFFFFF">Send on WhatsApp</text>
    </g>
  );
}

export function UpgradeMomentScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const tag = (i: number) => p(t, 12.4 + i * 0.5, 12.9 + i * 0.5);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Kaksha Pro shows a full-screen paywall on first open and covers a fee receipt while a parent waits, and 0.9% upgrade; the designer marks the tutor's moments as offer now, finish first, quiet mention or don't sell; at the 26th student Pro is offered, a receipt goes out without the logo before the offer, and the Pro screen shows her ₹33,000 collected, ₹499 a year or about ₹42 a month, and a plain Not now; 5.2% of tutors who see it upgrade">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={330} y={56} fontSize={22} fontWeight={900} fill={SC.text}>
          {t < 6 ? 'Pro, on day one' : t < 11 ? 'Blocked at the door' : t < 16 ? 'Map the moments' : t < 21 ? 'Value meets a limit' : t < 26 ? 'Finish first' : t < 31 ? 'Her numbers, the full price' : 'Fewer asks, more yeses'}
        </text>

        <g transform="translate(60 70)">
          <KakshaPhone title={t < 6 ? 'Welcome' : t < 16 || (t >= 21 && t < 26) ? 'Fees' : 'Students'}>
            {t < 6 && (t < 4.4 ? <Paywall /> : <text x={110} y={210} textAnchor="middle" fontSize={12} fontWeight={700} fill="#98A2B3">No batches found.</text>)}
            {t >= 6 && t < 11 && (
              <g>
                <Receipt />
                {t >= 7.2 && <g opacity={t < 9.6 ? p(t, 7.2, 7.6) : 1 - p(t, 9.6, 10)}><Paywall y={120} /></g>}
                {t >= 9.8 && <text x={110} y={330} textAnchor="middle" fontSize={12} fontWeight={900} fill="#B42318" opacity={p(t, 9.8, 10.2)}>Draft lost</text>}
              </g>
            )}
            {t >= 11 && t < 16 && <Receipt />}
            {t >= 16 && t < 21 && (
              <g>
                {['Aditya', 'Divya', 'Karthik', 'Lakshmi'].map((n, i) => (
                  <g key={n} transform={`translate(24 ${70 + i * 36})`}>
                    <rect width={172} height={28} rx={8} fill="#F2F4F7" />
                    <text x={12} y={19} fontSize={11} fontWeight={800} fill={INK}>{n}</text>
                  </g>
                ))}
                <text x={110} y={236} textAnchor="middle" fontSize={11} fontWeight={800} fill={INK_MUTED}>25 of 25 students · free plan</text>
                <rect x={30} y={250} width={160} height={32} rx={16} fill={KAKSHA} />
                <text x={110} y={271} textAnchor="middle" fontSize={11} fontWeight={900} fill="#FFFFFF">Add 26th student</text>
                {t >= 18 && <g opacity={p(t, 18, 18.6)}><Paywall y={56} own /></g>}
              </g>
            )}
            {t >= 21 && t < 26 && (
              <g>
                <Receipt />
                <g opacity={p(t, 22.4, 22.8)}>
                  <text x={110} y={300} textAnchor="middle" fontSize={12} fontWeight={900} fill="#067647">Sent to Divya’s mother</text>
                </g>
                <g transform="translate(18 320)" opacity={p(t, 23.6, 24.2)}>
                  <rect width={184} height={70} rx={12} fill={INK} />
                  <text x={12} y={26} fontSize={11} fontWeight={800} fill="#FFFFFF">Your logo on every receipt?</text>
                  <text x={12} y={46} fontSize={11} fontWeight={800} fill="#FFFFFF">That’s in Pro.</text>
                  <text x={172} y={60} textAnchor="end" fontSize={10} fontWeight={900} fill="#D0D5DD">See Pro</text>
                </g>
              </g>
            )}
            {t >= 26 && <Paywall own />}
          </KakshaPhone>
        </g>

        {t < 6 && (
          <g transform="translate(330 110)" opacity={p(t, 1, 1.6)}>
            <text x={0} y={0} fontSize={17} fontWeight={800} fill={SC.text}>Before a single batch, she’s asked for ₹{KAKSHA_PRO.yearly}.</text>
            <text x={0} y={32} fontSize={17} fontWeight={800} fill={SC.muted}>She doesn’t know what she’d be paying for. She closes it.</text>
          </g>
        )}
        {t >= 6 && t < 11 && (
          <g transform="translate(330 110)">
            <g opacity={p(t, 6.4, 7)}>
              <circle cx={30} cy={40} r={22} fill={KAKSHA_SOFT} stroke={KAKSHA} strokeWidth={2} />
              <text x={70} y={36} fontSize={16} fontWeight={800} fill={SC.text}>A parent waits at the door.</text>
              <text x={70} y={60} fontSize={16} fontWeight={800} fill={SC.muted}>She taps “Add my logo”.</text>
            </g>
            <g opacity={p(t, 9.8, 10.4)}>
              <text x={0} y={160} fontSize={64} fontWeight={900} fill={SC.text}>0.9%</text>
              <text x={0} y={190} fontSize={15} fontWeight={800} fill={SC.muted}>of tutors upgraded. Reviews: “asks for money before anything works”.</text>
            </g>
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g transform="translate(330 100)">
            {ROW.map((r, i) => {
              const move = upgradeMove(PRO_MOMENTS[r.id]);
              return (
                <g key={r.id} transform={`translate(${(i % 3) * 196} ${Math.floor(i / 3) * 130})`} opacity={p(t, 11.2 + i * 0.3, 11.7 + i * 0.3)}>
                  <rect width={182} height={110} rx={14} fill={SC.surface} stroke={SC.line} />
                  <text x={14} y={30} fontSize={13} fontWeight={900} fill={SC.text}>{r.short}</text>
                  <g opacity={tag(i)}>
                    <rect x={14} y={64} width={154} height={30} rx={15} fill={MOVE_FILL[move]} />
                    <text x={91} y={84} textAnchor="middle" fontSize={12} fontWeight={900} fill="#FFFFFF">{MOVE_NAME[move]}</text>
                  </g>
                </g>
              );
            })}
          </g>
        )}

        {t >= 16 && t < 21 && (
          <g transform="translate(330 110)" opacity={p(t, 16.4, 17)}>
            <text x={0} y={0} fontSize={17} fontWeight={800} fill={SC.text}>A month of classes, 25 students, parents paying on time.</text>
            <text x={0} y={32} fontSize={17} fontWeight={800} fill={SC.text}>Now she asks for more of what Kaksha does.</text>
            <rect x={0} y={60} width={150} height={34} rx={17} fill={MOVE_FILL.offer} opacity={p(t, 18, 18.6)} />
            <text x={75} y={82} textAnchor="middle" fontSize={13} fontWeight={900} fill="#FFFFFF" opacity={p(t, 18, 18.6)}>Offer now</text>
          </g>
        )}
        {t >= 21 && t < 26 && (
          <g transform="translate(330 110)" opacity={p(t, 21.4, 22)}>
            <text x={0} y={0} fontSize={17} fontWeight={800} fill={SC.text}>The receipt goes out without the logo.</text>
            <text x={0} y={32} fontSize={17} fontWeight={800} fill={SC.muted}>The offer waits until the parent has gone.</text>
          </g>
        )}
        {t >= 26 && t < 31 && (
          <g transform="translate(330 110)">
            {['Leads with what she asked for', `Her own result: ₹33,000 collected`, `The full price: ₹${KAKSHA_PRO.yearly} a year, about ₹${monthly} a month`, 'A plain “Not now”, no guilt, no timer'].map((s, i) => (
              <g key={s} transform={`translate(0 ${i * 44})`} opacity={p(t, 26.4 + i * 0.8, 27 + i * 0.8)}>
                <circle cx={10} cy={-5} r={10} fill={MOVE_FILL.offer} />
                <path d="M5 -5 L9 -1 L15 -9" stroke="#FFFFFF" strokeWidth={2.5} fill="none" />
                <text x={30} y={0} fontSize={16} fontWeight={800} fill={SC.text}>{s}</text>
              </g>
            ))}
          </g>
        )}
        {t >= 31 && (
          <g transform="translate(330 110)" opacity={p(t, 31.2, 31.8)}>
            <text x={0} y={0} fontSize={15} fontWeight={800} fill={SC.muted}>Tutors who upgrade after seeing Pro</text>
            <text x={0} y={56} fontSize={48} fontWeight={900} fill={SC.muted}>0.9%</text>
            <text x={150} y={52} fontSize={30} fontWeight={900} fill={SC.muted}>→</text>
            <text x={200} y={56} fontSize={48} fontWeight={900} fill={SC.text}>5.2%</text>
            <text x={0} y={100} fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 32.4, 33)}>Shown once or twice, at a limit. The one-star reviews about money stop.</text>
          </g>
        )}
      </g>
    </svg>
  );
}
