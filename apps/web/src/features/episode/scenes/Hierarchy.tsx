'use client';
// Scene for fd.2-2: a five-second test on a flat landing page, the squint test, then a real hierarchy and a contrast fix.
// Pure function of t (seconds, 0–34).
import { CheckIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, lerp, p, Pen, SC } from './shared';

const W = 960, H = 540;
const CHAOS = [[560, 120], [300, 300], [700, 360], [380, 160], [620, 250], [270, 400], [520, 420], [680, 150]];
const PATH = [[252, 166], [312, 214], [350, 309]];

export function HierarchyScene({ t }: { t: number }) {
  const fix = p(t, 15, 19);                                     // 0 = flat page, 1 = clear hierarchy
  const blur = t < 11 ? 0 : t < 15 ? lerp(0, 7, p(t, 11, 12.2)) * (1 - p(t, 14.2, 15)) : t >= 31 && t < 33.4 ? 5 * p(t, 31, 31.6) * (1 - p(t, 32.8, 33.4)) : 0;
  const contrast = lerp(2.8, 4.6, p(t, 27, 29));
  const helper = Math.round(lerp(200, 104, p(t, 27, 29)));      // grey value of the helper text
  const titleSize = lerp(20, 31, fix), titleWeight = fix > 0.5 ? 800 : 500;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a flat page gets a clear visual hierarchy">
      <defs><filter id="squint" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation={blur} /></filter></defs>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />

      {/* the page */}
      <g filter={blur > 0.05 ? 'url(#squint)' : undefined}>
        <rect x={220} y={50} width={520} height={440} rx={18} fill="#FFFFFF" stroke={SC.line} strokeWidth={2} />
        {/* nav */}
        <rect x={244} y={72} width={70} height={14} rx={4} fill="#475467" />
        {[0, 1, 2].map(i => <rect key={i} x={540 + i * 60} y={74} width={44} height={10} rx={4} fill="#98A2B3" />)}
        {/* title */}
        <text x={480} y={lerp(170, 176, fix)} textAnchor="middle" fontSize={titleSize} fontWeight={titleWeight} fill={fix > 0.3 ? '#101828' : '#667085'}>Pay friends back in seconds</text>
        {/* body: flat lines that become one subtitle */}
        {[0, 1, 2].map(i => (
          <rect key={i} x={lerp(300, 330 + i * 40, fix)} y={lerp(196 + i * 22, 214, fix)} width={lerp(360, 300 - i * 80, fix)} height={lerp(12, 10, fix)} rx={5}
            fill="#98A2B3" opacity={i === 0 ? 1 : 1 - fix} />
        ))}
        {/* two buttons → one primary, one quiet */}
        <g transform="translate(0 0)">
          <rect x={lerp(330, 370, fix)} y={286} width={lerp(130, 120, fix)} height={46} rx={12} fill={fix > 0.5 ? '#222F4F' : '#FFFFFF'} stroke="#222F4F" strokeWidth={2} />
          <text x={lerp(395, 430, fix)} y={315} textAnchor="middle" fontSize={15} fontWeight={700} fill={fix > 0.5 ? '#FFFFFF' : '#222F4F'}>Get started</text>
          <rect x={lerp(500, 510, fix)} y={286} width={130} height={46} rx={12} fill="#FFFFFF" stroke="#222F4F" strokeWidth={2} opacity={1 - fix} />
          <text x={lerp(565, 555, fix)} y={315} textAnchor="middle" fontSize={15} fontWeight={lerp(700, 600, fix)} fill={fix > 0.5 ? '#475467' : '#222F4F'} textDecoration={fix > 0.5 ? 'underline' : undefined}>Learn more</text>
        </g>
        {/* helper text with poor contrast */}
        <text x={lerp(395, 430, fix)} y={356} textAnchor="middle" fontSize={12} fill={`rgb(${helper},${helper},${helper})`}>No card needed</text>
        {/* image block */}
        <rect x={300} y={390} width={360} height={74} rx={12} fill="#EAECF0" />
      </g>

      {/* five-second test: chaotic gaze, then a clear path */}
      {t >= 5 && t < 11 && CHAOS.map(([x, y], i) => t >= 5.3 + i * 0.55 && (
        <g key={i} opacity={1 - p(t, 10.4, 11)}>
          {i > 0 && t >= 5.3 + i * 0.55 && <line x1={CHAOS[i - 1][0]} y1={CHAOS[i - 1][1]} x2={x} y2={y} stroke={SC.build} strokeWidth={2} opacity={0.5} />}
          <circle cx={x} cy={y} r={13 * back((t - 5.3 - i * 0.55) / 0.3)} fill={SC.build} opacity={0.85} />
          <text x={x} y={y + 4} textAnchor="middle" fontSize={11} fontWeight={800} fill="#fff">{i + 1}</text>
        </g>
      ))}
      {t >= 22 && t < 27 && PATH.map(([x, y], i) => t >= 22.3 + i * 0.8 && (
        <g key={i} opacity={1 - p(t, 26.4, 27)}>
          {i > 0 && <line x1={PATH[i - 1][0]} y1={PATH[i - 1][1]} x2={x} y2={y} stroke={SC.mint} strokeWidth={3} />}
          <circle cx={x} cy={y} r={15 * back((t - 22.3 - i * 0.8) / 0.3)} fill={SC.mint} />
          <text x={x} y={y + 5} textAnchor="middle" fontSize={13} fontWeight={800} fill="#fff">{i + 1}</text>
        </g>
      ))}

      {/* labels around the page */}
      {t >= 7.5 && t < 11 && <text x={480} y={522} textAnchor="middle" fontSize={15} fontWeight={700} fill={SC.error} opacity={clamp((t - 7.5) / 0.4) * (1 - p(t, 10.4, 11))}>Eyes bounce around. Nothing leads.</text>}
      {t >= 12.4 && t < 15 && <text x={480} y={522} textAnchor="middle" fontSize={15} fontWeight={700} fill={SC.text} opacity={clamp((t - 12.4) / 0.4)}>Squint: does anything stand out? Nope.</text>}
      {t >= 23 && t < 27 && <text x={480} y={522} textAnchor="middle" fontSize={15} fontWeight={700} fill={SC.mint} opacity={clamp((t - 23) / 0.4)}>Title → point → button. One clear path.</text>}
      {t >= 31.4 && <text x={480} y={522} textAnchor="middle" fontSize={15} fontWeight={700} fill={SC.mint} opacity={clamp((t - 31.4) / 0.4)}>Squint again: the title and button still win.</text>}

      {/* contrast meter */}
      {t >= 26.6 && (
        <g transform={`translate(840 340) scale(${back((t - 26.6) / 0.5)})`}>
          <rect x={-88} y={-44} width={176} height={88} rx={14} fill={SC.surface} stroke={contrast >= 4.5 ? SC.mint : SC.error} strokeWidth={2.5} />
          <text y={-16} textAnchor="middle" fontSize={12} fontWeight={700} fill={SC.muted}>Helper text contrast</text>
          <text y={16} textAnchor="middle" fontSize={26} fontWeight={800} fill={contrast >= 4.5 ? SC.mint : SC.error}>{contrast.toFixed(1)}:1</text>
          <text y={36} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={contrast >= 4.5 ? SC.mint : SC.error}>{contrast >= 4.5 ? 'Passes AA' : 'Fails AA (needs 4.5)'}</text>
          {contrast >= 4.5 && <g transform="translate(78 -40)"><circle r={13} fill={SC.mint} /><CheckIcon x={-8} y={-8} width={16} height={16} color="#fff" weight="bold" /></g>}
        </g>
      )}

      {/* Nib squints, then rearranges */}
      {t >= 10.6 && t < 22 && <Pen x={820} y={180} scale={0.5} mood={t < 15 ? 'think' : 'cheer'} />}
    </svg>
  );
}
