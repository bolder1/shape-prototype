'use client';
// Scene for rs.2-3: Priya's 1:10 pm order, the job behind it, the real competition (tiffin, canteen, skipping lunch),
// the timeline of her switch, and the job story it all becomes. Pure function of t (0–34).
import { BowlFoodIcon, BriefcaseIcon, ClockIcon, ForkKnifeIcon, PackageIcon, ProhibitIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, p, Pen, SC } from './shared';

const W = 960, H = 540;
const RIVALS = [{ n: 'Tiffin from home', icon: PackageIcon }, { n: 'Office canteen', icon: ForkKnifeIcon }, { n: 'Skipping lunch', icon: ProhibitIcon }];
const STEPS = ['First bad day', 'Noticing options', 'Trying one', 'Sticking with it'];
const STORY = [{ k: 'When', v: 'my meetings run through lunch,', c: SC.discover }, { k: 'I want', v: 'food that arrives without thinking,', c: SC.design }, { k: 'so I can', v: 'not crash at 4 pm.', c: SC.mint }];

export function JobsScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: the job a customer hires a product to do">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {/* the order */}
        {t < 12 && (
          <g opacity={1 - p(t, 11.4, 12)}>
            <g transform={`translate(250 260) scale(${clamp(back((t - 0.2) / 0.5))})`}>
              <rect x={-120} y={-150} width={240} height={300} rx={30} fill={SC.surface} stroke={SC.text} strokeOpacity={0.3} strokeWidth={3} />
              <ClockIcon x={-100} y={-128} width={22} height={22} color={SC.muted} weight="bold" />
              <text x={-72} y={-111} fontSize={15} fontWeight={800} fill={SC.muted}>1:10 pm</text>
              <BowlFoodIcon x={-40} y={-70} width={80} height={80} color={SC.build} weight="duotone" />
              <text y={50} textAnchor="middle" fontSize={17} fontWeight={800} fill={SC.text}>Dal-rice bowl</text>
              <text y={76} textAnchor="middle" fontSize={13} fontWeight={600} fill={SC.muted}>Ordered again · 4th this week</text>
            </g>
            {t >= 6 && (
              <g transform={`translate(640 250) scale(${clamp(back((t - 6) / 0.5))})`}>
                <circle cx={-170} cy={60} r={8} fill={SC.surface} stroke={SC.line} /><circle cx={-150} cy={40} r={12} fill={SC.surface} stroke={SC.line} />
                <rect x={-140} y={-80} width={360} height={130} rx={30} fill={SC.surface} stroke={SC.design} strokeWidth={2.5} />
                <BriefcaseIcon x={-118} y={-60} width={30} height={30} color={SC.design} weight="duotone" />
                <text x={-78} y={-38} fontSize={15} fontWeight={800} fill={SC.design}>The real job</text>
                <text x={-118} y={0} fontSize={16} fontWeight={700} fill={SC.text}>Get through back-to-back</text>
                <text x={-118} y={24} fontSize={16} fontWeight={700} fill={SC.text}>meetings without crashing.</text>
              </g>
            )}
          </g>
        )}

        {/* the competition */}
        {t >= 12 && t < 18 && (
          <g opacity={clamp((t - 12) / 0.4) * (1 - p(t, 17.4, 18))}>
            <text x={480} y={110} textAnchor="middle" fontSize={20} fontWeight={800} fill={SC.text}>Also hired for the same job</text>
            {RIVALS.map((r, i) => {
              const Icon = r.icon;
              return (
                <g key={r.n} transform={`translate(${220 + i * 260} 270) scale(${clamp(back((t - 12.4 - i * 0.5) / 0.5))})`}>
                  <rect x={-105} y={-90} width={210} height={180} rx={20} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                  <Icon x={-32} y={-66} width={64} height={64} color={SC.design} weight="duotone" />
                  <text y={40} textAnchor="middle" fontSize={17} fontWeight={800} fill={SC.text}>{r.n}</text>
                </g>
              );
            })}
            <text x={480} y={430} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.mint} opacity={clamp((t - 14.5) / 0.4)}>Not other apps. Other ways to get the job done.</text>
          </g>
        )}

        {/* the switch timeline */}
        {t >= 18 && t < 24 && (
          <g opacity={clamp((t - 18) / 0.4) * (1 - p(t, 23.4, 24))}>
            <text x={480} y={150} textAnchor="middle" fontSize={20} fontWeight={800} fill={SC.text}>The story of her switch</text>
            <line x1={150} x2={810} y1={270} y2={270} stroke={SC.line} strokeWidth={4} />
            <line x1={150} x2={150 + 660 * clamp((t - 18.4) / 4)} y1={270} y2={270} stroke={SC.mint} strokeWidth={4} />
            {STEPS.map((s, i) => {
              const x = 150 + i * 220, on = t >= 18.6 + i;
              return (
                <g key={s}>
                  <circle cx={x} cy={270} r={14} fill={on ? SC.mint : SC.surface} stroke={on ? SC.mint : SC.line} strokeWidth={3} />
                  <text x={x} y={315} textAnchor="middle" fontSize={15} fontWeight={800} fill={on ? SC.text : SC.muted}>{s}</text>
                </g>
              );
            })}
          </g>
        )}

        {/* the job story */}
        {t >= 24 && (
          <g opacity={clamp((t - 24) / 0.4)}>
            {STORY.map((s, i) => (
              <g key={s.k} transform={`translate(140 ${170 + i * 80}) scale(${clamp(back((t - 24.3 - i * 0.6) / 0.4))})`}>
                <rect width={110} height={56} rx={14} fill={s.c} />
                <text x={55} y={35} textAnchor="middle" fontSize={17} fontWeight={900} fill="#fff">{s.k}</text>
                <text x={130} y={36} fontSize={21} fontWeight={800} fill={SC.text}>{s.v}</text>
              </g>
            ))}
            <Pen x={830} y={430} scale={0.45} mood="cheer" />
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Hired for a job', l: 'Progress in a situation', c: SC.design }, { x: 480, n: 'Real rivals', l: 'Anything that does the job', c: SC.build }, { x: 760, n: 'Job stories', l: 'When · I want · so I can', c: SC.mint }].map((f, i) => {
        const k = back((t - (29.2 + i * 0.25)) / 0.5);
        return (
          <g key={f.n} transform={`translate(${f.x} 260) scale(${clamp(k)})`}>
            <rect x={-125} y={-70} width={250} height={140} rx={18} fill={SC.surface} stroke={f.c} strokeWidth={3} />
            <text y={-8} textAnchor="middle" fontSize={22} fontWeight={800} fill={f.c}>{f.n}</text>
            <text y={26} textAnchor="middle" fontSize={14} fontWeight={600} fill={SC.text}>{f.l}</text>
          </g>
        );
      })}
    </svg>
  );
}
