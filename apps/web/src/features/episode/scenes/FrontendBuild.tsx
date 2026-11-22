'use client';
// Scene for dc.1-3: a Figma Button with variants becomes a code component with props; it's reused on many screens and
// one fix spreads to all of them; an order list cycles through loading, empty, error and success; then tests, a preview
// and a deploy. Pure function of t (0–34).
import { CheckIcon, RocketLaunchIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, p, SC } from './shared';

const W = 960, H = 540;
export const STATIONS = [
  { id: 'design', n: 'Design & tokens', c: SC.discover },
  { id: 'component', n: 'Components', c: SC.design },
  { id: 'data', n: 'Data & state', c: SC.mint },
  { id: 'ship', n: 'Test & ship', c: SC.grow },
] as const;

const Btn = ({ x, y, fill, w = 110, label = 'Order', ghost = false }: { x: number; y: number; fill: string; w?: number; label?: string; ghost?: boolean }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect width={w} height={36} rx={10} fill={ghost ? 'none' : fill} stroke={fill} strokeWidth={2} />
    <text x={w / 2} y={23} textAnchor="middle" fontSize={13} fontWeight={800} fill={ghost ? fill : '#fff'}>{label}</text>
  </g>
);

export function FrontendBuildScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const fixed = t >= 15;
  const btnFill = fixed ? '#15803d' : '#2563eb';
  const state = t < 17 ? -1 : Math.min(3, Math.floor((t - 17.2) / 1.4));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: from a Figma component to a coded component with props, states and deployment">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {/* Figma variants → code */}
        {t < 12.4 && (
          <g opacity={clamp(t / 0.5) * (1 - p(t, 11.8, 12.4))}>
            <g transform="translate(90 110)">
              <rect width={340} height={240} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text x={20} y={32} fontSize={14} fontWeight={800} fill={SC.text}>Figma · Button variants</text>
              {[{ g: false, s: 110, l: 'Primary' }, { g: true, s: 110, l: 'Secondary' }, { g: false, s: 80, l: 'Small' }, { g: false, s: 110, l: 'Disabled' }].map((v, i) => (
                <g key={v.l} opacity={clamp(back((t - 0.4 - i * 0.3) / 0.4)) * (v.l === 'Disabled' ? 0.45 : 1)}><Btn x={20 + (i % 2) * 160} y={60 + Math.floor(i / 2) * 80} fill="#2563eb" w={v.s} label={v.l} ghost={v.g} /></g>
              ))}
            </g>
            {t >= 6 && (
              <g transform="translate(500 110)" opacity={clamp((t - 6) / 0.5)} fontFamily="ui-monospace, Consolas, monospace">
                <rect width={380} height={240} rx={18} fill="#0f172a" />
                {['<Button', '  variant="primary"', '  size="large"', '  disabled={false}', '>', '  Order', '</Button>'].map((l, i) => (
                  <text key={i} x={24} y={44 + i * 26} fontSize={15} fontWeight={700} fill={i === 0 || i === 6 ? '#93c5fd' : i >= 1 && i <= 3 ? '#fde68a' : '#e2e8f0'} opacity={clamp((t - 6.4 - i * 0.25) / 0.3)}>{l}</text>
                ))}
              </g>
            )}
            {t >= 7.6 && <text x={480} y={400} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.mint}>Variants in Figma = props in code. Tokens become CSS variables.</text>}
          </g>
        )}

        {/* reuse + one fix */}
        {t >= 12 && t < 17.4 && (
          <g opacity={clamp((t - 12) / 0.5) * (1 - p(t, 16.8, 17.4))}>
            {Array.from({ length: 10 }, (_, i) => (
              <g key={i} transform={`translate(${110 + (i % 5) * 150} ${110 + Math.floor(i / 5) * 170}) scale(${clamp(back((t - 12.2 - i * 0.08) / 0.4))})`}>
                <rect width={130} height={150} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <rect x={14} y={16} width={80} height={8} rx={4} fill={SC.line} /><rect x={14} y={32} width={100} height={8} rx={4} fill={SC.line} />
                <Btn x={10} y={100} fill={btnFill} w={110} />
              </g>
            ))}
            <text x={480} y={480} textAnchor="middle" fontSize={16} fontWeight={800} fill={fixed ? SC.mint : SC.muted}>{fixed ? 'One fix to the Button: all ten screens updated.' : 'One Button component, used on every screen.'}</text>
          </g>
        )}

        {/* data states */}
        {t >= 17 && t < 23.4 && (
          <g opacity={clamp((t - 17) / 0.5) * (1 - p(t, 22.8, 23.4))}>
            <g transform="translate(330 100)">
              <rect width={300} height={320} rx={22} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text x={20} y={36} fontSize={15} fontWeight={800} fill={SC.text}>Your orders</text>
              {state === 0 && [0, 1, 2].map(i => <rect key={i} x={20} y={60 + i * 70} width={260} height={56} rx={10} fill={SC.line} opacity={0.5 + 0.3 * Math.sin(t * 6 + i)} />)}
              {state === 1 && <g><text x={150} y={170} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.text}>No orders yet</text><Btn x={95} y={190} fill="#15803d" label="Browse menu" /></g>}
              {state === 2 && <g><text x={150} y={160} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.error}>Couldn’t load orders</text><Btn x={95} y={180} fill="#15803d" label="Try again" /></g>}
              {state === 3 && ['Dal makhani · ₹220', 'Veg biryani · ₹260', 'Paneer roll · ₹160'].map((o, i) => <g key={o}><rect x={20} y={60 + i * 70} width={260} height={56} rx={10} fill={SC.soft} /><text x={36} y={93 + i * 70} fontSize={13} fontWeight={700} fill={SC.text}>{o}</text></g>)}
            </g>
            {['Loading', 'Empty', 'Error', 'Success'].map((s, i) => (
              <g key={s} transform={`translate(${200 + i * 150} 470)`}>
                <rect x={-60} y={-16} width={120} height={32} rx={16} fill={i === state ? SC.discover : SC.surface} stroke={SC.line} strokeWidth={1.5} />
                <text y={5} textAnchor="middle" fontSize={13} fontWeight={800} fill={i === state ? '#fff' : SC.muted}>{s}</text>
              </g>
            ))}
          </g>
        )}

        {/* ship */}
        {t >= 23 && t < 29.4 && (
          <g opacity={clamp((t - 23) / 0.5)}>
            {STATIONS.map((s, i) => (
              <g key={s.id} transform={`translate(${150 + i * 220} 240) scale(${clamp(back((t - 23.2 - i * 0.3) / 0.4))})`}>
                <circle r={46} fill={s.c} opacity={0.85} />
                {i === 3 ? <RocketLaunchIcon x={-20} y={-20} width={40} height={40} color="#fff" weight="duotone" /> : <CheckIcon x={-18} y={-18} width={36} height={36} color="#fff" weight="bold" />}
                <text y={78} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.text}>{s.n}</text>
                {i < 3 && <path d="M54 0 h112" stroke={SC.line} strokeWidth={3} strokeDasharray="6 5" />}
              </g>
            ))}
            <text x={480} y={400} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.mint} opacity={clamp((t - 25) / 0.4)}>Tests pass, the preview looks right, and it’s live.</text>
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Components', l: 'Variants = props', c: SC.discover }, { x: 480, n: 'Four states', l: 'Loading · empty · error · success', c: SC.design }, { x: 760, n: 'Tokens & pipelines', l: 'CSS variables, tests, deploys', c: SC.mint }].map((f, i) => {
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
