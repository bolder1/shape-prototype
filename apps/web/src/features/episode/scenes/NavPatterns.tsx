'use client';
// Scene for ia.1-3: one app grows from 4 sections to 12. The tab bar overflows, a hamburger hides everything (and use
// drops), then each surface gets the pattern that fits: tabs + More, a sidebar, and a stepper for checkout. Pure function of t (0–34).
import { DotsThreeIcon, HouseIcon, ListIcon, MagnifyingGlassIcon, ReceiptIcon, UserIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, lerp, p, Pen, SC } from './shared';

const W = 960, H = 540;
const TAB_ICONS = [HouseIcon, MagnifyingGlassIcon, ReceiptIcon, UserIcon];
const SECTIONS = ['Home', 'Search', 'Orders', 'Profile', 'Offers', 'Wallet', 'Rewards', 'Help', 'Stores', 'Gifts', 'Settings', 'Invite'];

function Phone({ x, w = 230, h = 420, children }: { x: number; w?: number; h?: number; children?: React.ReactNode }) {
  return (
    <g transform={`translate(${x - w / 2} 60)`}>
      <rect width={w} height={h} rx={30} fill={SC.surface} stroke={SC.text} strokeOpacity={0.3} strokeWidth={3} />
      {children}
    </g>
  );
}

export function NavPatternsScene({ t }: { t: number }) {
  const fin = p(t, 30, 30.8);
  const grow = p(t, 6.5, 10);                         // 4 → 12 tabs
  const tabs = Math.round(lerp(4, 12, grow));
  const hidden = p(t, 12, 13);                        // hamburger takes over
  const split = p(t, 18, 19);
  const phoneX = lerp(480, 300, split);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: an app's navigation as it grows, from tab bar to hamburger to the right pattern for each job">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {t < 25 && (
          <Phone x={phoneX}>
            <text x={24} y={52} fontSize={18} fontWeight={800} fill={SC.text}>{t < 18 ? 'Thali' : 'Home'}</text>
            {[0, 1, 2].map(i => <rect key={i} x={20} y={80 + i * 90} width={190} height={74} rx={14} fill={SC.soft} />)}
            {/* hamburger era */}
            {hidden > 0 && split < 1 && <ListIcon x={186} y={30} width={28} height={28} color={SC.text} weight="bold" opacity={hidden * (1 - split)} />}
            {/* tab bar: grows, then disappears behind the hamburger, then returns as 4 + More */}
            <g opacity={t < 12 ? 1 : split}>
              <rect x={0} y={360} width={230} height={60} fill={SC.surface} stroke={SC.line} />
              {(split > 0 ? [0, 1, 2, 3, 4] : Array.from({ length: tabs }, (_, i) => i)).map((i, _, all) => {
                const n = all.length, cx = 115 + (i - (n - 1) / 2) * (220 / n);
                const Icon = split > 0 ? (i < 4 ? TAB_ICONS[i] : DotsThreeIcon) : TAB_ICONS[i % 4];
                const size = Math.min(26, 150 / n);
                const cramped = split === 0 && n > 6;
                return <Icon key={i} x={cx - size / 2} y={378 - (26 - size) / 2} width={size} height={size} color={cramped ? SC.error : i === 0 ? SC.discover : SC.muted} weight={i === 0 ? 'fill' : 'regular'} />;
              })}
            </g>
          </Phone>
        )}
        {t >= 7 && t < 12 && <text x={480} y={515} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.error} opacity={clamp((t - 8.5) / 0.5)}>{tabs} tabs: too small to tap, impossible to tell apart</text>}

        {/* usage drops while everything is hidden */}
        {t >= 12.5 && t < 18 && (
          <g transform="translate(680 150)" opacity={clamp((t - 12.5) / 0.4) * (1 - p(t, 17.4, 18))}>
            <text x={0} y={-18} fontSize={13} fontWeight={800} fill={SC.muted}>VISITS PER SECTION</text>
            {SECTIONS.slice(0, 6).map((s, i) => {
              const v = lerp(1, 0.3 + (i % 3) * 0.08, p(t, 13.5, 16));
              return (
                <g key={s} transform={`translate(0 ${i * 40})`}>
                  <text x={0} y={18} fontSize={13} fontWeight={600} fill={SC.text}>{s}</text>
                  <rect x={80} y={6} width={150 * v} height={16} rx={8} fill={v < 0.6 ? SC.error : SC.discover} />
                </g>
              );
            })}
          </g>
        )}

        {/* desktop tool with a sidebar */}
        {split > 0 && t < 25 && (
          <g transform={`translate(${lerp(1000, 520, split)} 90)`}>
            <rect width={400} height={300} rx={16} fill={SC.surface} stroke={SC.text} strokeOpacity={0.3} strokeWidth={3} />
            <rect x={0} y={0} width={120} height={300} rx={16} fill={SC.soft} />
            {SECTIONS.map((s, i) => (
              <g key={s} opacity={clamp((t - 19 - i * 0.12) / 0.3)}>
                <rect x={10} y={14 + i * 23} width={100} height={18} rx={5} fill={i === 2 ? SC.discover : 'none'} fillOpacity={0.15} />
                <text x={18} y={27 + i * 23} fontSize={11} fontWeight={700} fill={i === 2 ? SC.discover : SC.text}>{s}</text>
              </g>
            ))}
            <text x={140} y={40} fontSize={16} fontWeight={800} fill={SC.text}>Orders</text>
            {[0, 1, 2, 3].map(i => <rect key={i} x={140} y={60 + i * 52} width={240} height={40} rx={8} fill={SC.soft} />)}
            <text x={200} y={330} textAnchor="middle" fontSize={14} fontWeight={800} fill={SC.discover}>Desktop: a sidebar holds them all</text>
          </g>
        )}
        {split > 0 && t < 25 && <text x={300} y={515} textAnchor="middle" fontSize={14} fontWeight={800} fill={SC.mint} opacity={split}>Phone: 4 tabs + More</text>}

        {/* checkout stepper */}
        {t >= 25 && (
          <g opacity={clamp((t - 25) / 0.4)}>
            <Phone x={480}>
              <text x={24} y={52} fontSize={18} fontWeight={800} fill={SC.text}>Checkout</text>
              {['Cart', 'Address', 'Pay', 'Done'].map((s, i) => {
                const reached = t >= 25.8 + i * 0.9;
                return (
                  <g key={s} transform={`translate(${36 + i * 52} 100)`}>
                    {i > 0 && <rect x={-40} y={-2} width={28} height={4} rx={2} fill={reached ? SC.mint : SC.line} />}
                    <circle r={13} fill={reached ? SC.mint : SC.soft} stroke={reached ? SC.mint : SC.line} strokeWidth={2} />
                    <text y={5} textAnchor="middle" fontSize={12} fontWeight={800} fill={reached ? '#fff' : SC.muted}>{i + 1}</text>
                    <text y={36} textAnchor="middle" fontSize={11} fontWeight={700} fill={SC.text}>{s}</text>
                  </g>
                );
              })}
              {[0, 1, 2].map(i => <rect key={i} x={20} y={160 + i * 60} width={190} height={46} rx={12} fill={SC.soft} />)}
            </Phone>
            <Pen x={700} y={330} scale={0.45} mood="cheer" />
          </g>
        )}
      </g>

      {fin > 0 && [{ n: 'Tab bar', l: '3–5 frequent places', c: SC.mint }, { n: 'Sidebar', l: 'Many sections', c: SC.discover }, { n: 'Hub', l: 'Separate tasks', c: SC.grow }, { n: 'Stepper', l: 'One task, in order', c: SC.design }].map((f, i) => {
        const k = back((t - (30.2 + i * 0.2)) / 0.5);
        return (
          <g key={f.n} transform={`translate(${135 + i * 230} 260) scale(${clamp(k)})`}>
            <rect x={-100} y={-70} width={200} height={140} rx={18} fill={SC.surface} stroke={f.c} strokeWidth={3} />
            <text y={-8} textAnchor="middle" fontSize={22} fontWeight={800} fill={f.c}>{f.n}</text>
            <text y={26} textAnchor="middle" fontSize={14} fontWeight={600} fill={SC.text}>{f.l}</text>
          </g>
        );
      })}
    </svg>
  );
}
