'use client';
// Scene for ia.1-4: a pile of pages becomes a sitemap. One branch is too deep, the over-correction is too wide, the
// balanced tree has 2–3 taps to everything, and a tree test lights up a participant's path. Pure function of t (0–34).
import { CheckCircleIcon, CursorClickIcon } from '@phosphor-icons/react/ssr';
import { at, back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
const SECTIONS = [{ n: 'Orders', c: SC.discover }, { n: 'Account', c: SC.design }, { n: 'Offers', c: SC.grow }, { n: 'Help', c: SC.build }];
const PAGES = [
  ['Current', 'Past orders', 'Report issue'], ['Profile', 'Addresses', 'Payments'], ['Coupons', 'Membership'], ['Policies', 'Contact', 'Guides'],
];
const SX = (i: number) => 150 + i * 220;
const BW = 118, BH = 34;
// Scattered start positions for the 11 pages (deterministic).
const SCATTER = [[90, 420], [300, 90], [520, 460], [770, 120], [200, 250], [860, 430], [420, 300], [650, 260], [120, 120], [560, 110], [740, 360]];

function Box({ x, y, label, c, lit = false, s = 1 }: { x: number; y: number; label: string; c?: string; lit?: boolean; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-BW / 2} y={-BH / 2} width={BW} height={BH} rx={9} fill={lit ? SC.mint : SC.surface} fillOpacity={lit ? 0.2 : 1} stroke={lit ? SC.mint : c ?? SC.line} strokeWidth={lit ? 3 : 2} />
      <text y={5} textAnchor="middle" fontSize={13} fontWeight={700} fill={SC.text}>{label}</text>
    </g>
  );
}

export function SitemapScene({ t }: { t: number }) {
  const tree = p(t, 5, 9);                                  // pile → tree
  const deep = t >= 12 && t < 18, wide = t >= 18 && t < 24;
  const treeOn = (t < 12) || t >= 24;
  const fin = p(t, 30.4, 31.2);
  const testing = t >= 29;
  const lit = (step: number) => testing && t >= 29.3 + step * 0.35;   // Home → Account → Addresses

  let k = 0;
  const flat = PAGES.flatMap((pages, si) => pages.map((n, pi) => ({ n, si, pi, idx: k++ })));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: building a sitemap, too deep versus too wide, and a tree test">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {treeOn && (
          <g opacity={t >= 24 ? clamp((t - 24) / 0.5) : 1 - p(t, 11.4, 12)}>
            {/* lines */}
            <g opacity={tree}>
              {SECTIONS.map((s, i) => <path key={s.n} d={`M480 82 C480 120 ${SX(i)} 120 ${SX(i)} 158`} fill="none" stroke={lit(1) && i === 1 ? SC.mint : SC.line} strokeWidth={lit(1) && i === 1 ? 4 : 2} />)}
              {flat.map(f => <line key={f.n} x1={SX(f.si)} y1={192} x2={SX(f.si)} y2={232 + f.pi * 52} stroke={lit(2) && f.n === 'Addresses' ? SC.mint : SC.line} strokeWidth={lit(2) && f.n === 'Addresses' ? 4 : 1.5} />)}
            </g>
            <Box x={480} y={64} label="Home" c={SC.discover} s={back((t - 4.6) / 0.4)} lit={lit(0)} />
            {SECTIONS.map((s, i) => <Box key={s.n} x={SX(i)} y={175} label={s.n} c={s.c} s={back((t - 5.4 - i * 0.2) / 0.4)} lit={lit(1) && i === 1} />)}
            {flat.map(f => {
              const [x, y] = at(SCATTER[f.idx], [SX(f.si), 250 + f.pi * 52], tree);
              return <Box key={f.n} x={x} y={y} label={f.n} s={clamp(back((t - 0.3 - f.idx * 0.1) / 0.4))} lit={lit(2) && f.n === 'Addresses'} />;
            })}
          </g>
        )}
        {t >= 24 && t < 29 && (
          <g opacity={clamp((t - 24.6) / 0.4)}>
            <rect x={380} y={460} width={200} height={40} rx={20} fill={SC.mint} />
            <text x={480} y={486} textAnchor="middle" fontSize={15} fontWeight={800} fill="#fff">3 levels · 2–3 taps</text>
          </g>
        )}

        {/* too deep: a staircase of five levels */}
        {deep && (
          <g opacity={clamp((t - 12) / 0.4) * (1 - p(t, 17.5, 18))}>
            {['Account', 'Settings', 'Security', 'Login', 'Password'].map((n, i) => {
              const x = 170 + i * 150, y = 90 + i * 80, show = clamp((t - 12.4 - i * 0.7) / 0.3);
              return (
                <g key={n} opacity={show}>
                  {i > 0 && <path d={`M${x - 150} ${y - 63} L${x - 150} ${y} L${x - BW / 2} ${y}`} fill="none" stroke={SC.line} strokeWidth={2} />}
                  <Box x={x} y={y} label={n} c={i === 4 ? SC.error : undefined} />
                  <text x={x} y={y - 26} textAnchor="middle" fontSize={12} fontWeight={800} fill={SC.muted}>tap {i + 1}</text>
                </g>
              );
            })}
            <text x={240} y={470} textAnchor="middle" fontSize={20} fontWeight={900} fill={SC.error} opacity={clamp((t - 16) / 0.4)}>Too deep</text>
          </g>
        )}

        {/* too wide: twenty items on one level */}
        {wide && (
          <g opacity={clamp((t - 18) / 0.4) * (1 - p(t, 23.5, 24))}>
            <Box x={480} y={90} label="Account" c={SC.design} />
            {Array.from({ length: 20 }, (_, i) => {
              const col = i % 10, row = Math.floor(i / 10), x = 66 + col * 92, y = 230 + row * 70;
              return (
                <g key={i} opacity={clamp((t - 18.4 - i * 0.08) / 0.2)}>
                  <line x1={480} y1={107} x2={x} y2={y - 14} stroke={SC.line} strokeWidth={1} />
                  <rect x={x - 40} y={y - 14} width={80} height={28} rx={7} fill={SC.surface} stroke={SC.error} strokeOpacity={0.5} strokeWidth={1.5} />
                  <rect x={x - 28} y={y - 3} width={lerp(30, 56, (i * 7) % 10 / 10)} height={6} rx={3} fill={SC.muted} opacity={0.4} />
                </g>
              );
            })}
            <text x={480} y={430} textAnchor="middle" fontSize={20} fontWeight={900} fill={SC.error} opacity={clamp((t - 20.5) / 0.4)}>Too wide: 20 choices at once</text>
          </g>
        )}

        {/* the tree test */}
        {testing && (
          <g transform="translate(40 470)" opacity={clamp((t - 29) / 0.4)}>
            <rect width={330} height={50} rx={14} fill={SC.surface} stroke={SC.discover} strokeWidth={2} />
            <CursorClickIcon x={14} y={12} width={26} height={26} color={SC.discover} weight="duotone" />
            <text x={50} y={31} fontSize={14} fontWeight={700} fill={SC.text}>Task: change your address</text>
            {lit(2) && <CheckCircleIcon x={290} y={12} width={26} height={26} color={SC.mint} weight="fill" />}
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Map it first', l: 'Every page has a home', c: SC.discover }, { x: 480, n: 'Balance', l: 'Not too deep, not too wide', c: SC.mint }, { x: 760, n: 'Tree test', l: 'Check first clicks', c: SC.design }].map((f, i) => {
        const kk = back((t - (30.6 + i * 0.25)) / 0.5);
        return (
          <g key={f.n} transform={`translate(${f.x} 260) scale(${clamp(kk)})`}>
            <rect x={-125} y={-70} width={250} height={140} rx={18} fill={SC.surface} stroke={f.c} strokeWidth={3} />
            <text y={-8} textAnchor="middle" fontSize={22} fontWeight={800} fill={f.c}>{f.n}</text>
            <text y={26} textAnchor="middle" fontSize={14} fontWeight={600} fill={SC.text}>{f.l}</text>
          </g>
        );
      })}
    </svg>
  );
}
