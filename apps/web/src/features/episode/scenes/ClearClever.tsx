'use client';
// Scene for cw.1-1: a clever sign-up screen gets a two-second glance and loses people; the plain rewrite wins them back;
// a playful line returns only once nothing is at stake. Pure function of t (0–34).
import { CheckCircleIcon, EyeIcon, SignOutIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, lerp, p, Pen, SC } from './shared';

const W = 960, H = 540;
const PX = 330, PY = 50, PW = 260, PH = 440;
const GUESSES = [{ t: 'Recipes?', x: 120, y: 150 }, { t: 'A cooking class?', x: 90, y: 250 }, { t: 'Restaurant guide?', x: 110, y: 350 }];

export function ClearCleverScene({ t }: { t: number }) {
  const rewrite = p(t, 17, 18.5);
  const success = t >= 24;
  const fin = p(t, 29, 29.8);
  const glance = t >= 6 && t < 12;
  const ring = glance ? clamp(((t - 6) % 2) / 2) : 0;
  const signups = lerp(0.18, 0.62, p(t, 19, 22));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a clever headline versus a clear one">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {/* the phone */}
        <rect x={PX} y={PY} width={PW} height={PH} rx={34} fill={SC.surface} stroke={SC.text} strokeOpacity={0.3} strokeWidth={3} />
        {!success ? (
          <g>
            <rect x={PX + 24} y={PY + 60} width={PW - 48} height={140} rx={16} fill={SC.design} opacity={0.25} />
            <g opacity={1 - rewrite}>
              <text x={PX + PW / 2} y={PY + 250} textAnchor="middle" fontSize={22} fontWeight={800} fill={SC.text}>Unleash your</text>
              <text x={PX + PW / 2} y={PY + 278} textAnchor="middle" fontSize={22} fontWeight={800} fill={SC.text}>inner foodie</text>
            </g>
            <g opacity={rewrite}>
              <text x={PX + PW / 2} y={PY + 250} textAnchor="middle" fontSize={19} fontWeight={800} fill={SC.text}>Order lunch from 200</text>
              <text x={PX + PW / 2} y={PY + 276} textAnchor="middle" fontSize={19} fontWeight={800} fill={SC.text}>kitchens near you</text>
            </g>
            <rect x={PX + 24} y={PY + 360} width={PW - 48} height={50} rx={14} fill={SC.discover} />
            <text x={PX + PW / 2} y={PY + 391} textAnchor="middle" fontSize={17} fontWeight={800} fill="#fff" opacity={1 - rewrite}>Let’s roll!</text>
            <text x={PX + PW / 2} y={PY + 391} textAnchor="middle" fontSize={17} fontWeight={800} fill="#fff" opacity={rewrite}>See restaurants</text>
            {/* the glance blurs everything but a few words */}
            {glance && <rect x={PX} y={PY} width={PW} height={PH} rx={34} fill={SC.surface} opacity={0.35 + 0.35 * Math.sin(ring * Math.PI)} />}
          </g>
        ) : (
          <g opacity={clamp((t - 24) / 0.4)}>
            <CheckCircleIcon x={PX + PW / 2 - 40} y={PY + 120} width={80} height={80} color={SC.mint} weight="fill" />
            <text x={PX + PW / 2} y={PY + 250} textAnchor="middle" fontSize={20} fontWeight={800} fill={SC.text}>Lunch is on its way</text>
            <text x={PX + PW / 2} y={PY + 280} textAnchor="middle" fontSize={15} fontWeight={600} fill={SC.muted}>Arriving 12:40. Time to look busy.</text>
            <Pen x={PX + PW + 90} y={PY + 300} scale={0.45} mood="cheer" />
          </g>
        )}

        {/* the two-second glance */}
        {glance && (
          <g transform="translate(720 220)">
            <circle r={46} fill="none" stroke={SC.line} strokeWidth={6} />
            <circle r={46} fill="none" stroke={SC.build} strokeWidth={6} strokeDasharray={`${ring * 289} 289`} transform="rotate(-90)" />
            <EyeIcon x={-20} y={-20} width={40} height={40} color={SC.build} weight="duotone" />
            <text y={80} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.build}>2-second glance</text>
          </g>
        )}
        {t >= 12 && t < 17 && GUESSES.map((g, i) => (
          <g key={g.t} transform={`translate(${g.x} ${g.y}) scale(${clamp(back((t - 12.3 - i * 0.5) / 0.4))})`}>
            <rect x={-10} y={-24} width={g.t.length * 9 + 20} height={36} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            <text x={0} y={0} fontSize={15} fontWeight={700} fontStyle="italic" fill={SC.muted}>{g.t}</text>
          </g>
        ))}
        {t >= 14.5 && t < 17 && (
          <g transform="translate(700 260)" opacity={clamp((t - 14.5) / 0.4)}>
            <SignOutIcon x={-24} y={-60} width={48} height={48} color={SC.error} weight="bold" />
            <text textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.error}>Most people leave</text>
          </g>
        )}
        {/* sign-ups */}
        {t >= 18 && t < 24 && (
          <g transform="translate(680 140)" opacity={clamp((t - 18) / 0.4)}>
            <text x={0} y={0} fontSize={13} fontWeight={800} fill={SC.muted}>SIGN-UPS</text>
            <rect x={0} y={20} width={60} height={220} rx={10} fill={SC.line} opacity={0.5} />
            <rect x={0} y={20 + 220 * (1 - signups)} width={60} height={220 * signups} rx={10} fill={SC.mint} />
            <text x={80} y={30 + 220 * (1 - signups)} fontSize={20} fontWeight={900} fill={SC.mint}>{Math.round(signups * 100)}%</text>
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Glance-proof', l: 'Clear in two seconds', c: SC.build }, { x: 480, n: 'Say what happens', l: 'Name the thing or result', c: SC.mint }, { x: 760, n: 'Warmth later', l: 'When nothing is at stake', c: SC.design }].map((f, i) => {
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
