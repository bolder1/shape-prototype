'use client';
// Scene for ds.3-2: Kavya's Figma component set for Rasta's Button, with every property a variant: 4 × 3 × 5 × 6 icons
// × 3 icon positions = 1,080 frames, and a file that takes 40 seconds to open. Then the properties panel changes type
// one row at a time: icon position becomes two booleans (360), the icon an instance swap (60), the label a text property,
// and the names line up with the code. `FrameWall` (a component set of n frames) is shared with the Build the
// component set game. Pure function of t (0–34).
import { back, clamp, Grid, lerp, p, SC } from './shared';
import { BTN_H, BTN_SIZES, BTN_STYLE, BTN_VARIANTS, RastaButton } from './PropSprawl';

const W = 960, H = 540;
const MONO = 'ui-monospace, Consolas, monospace';
/** Figma draws component sets with a dashed purple border. */
export const FIGMA_PURPLE = '#9747FF';
const STATES = ['default', 'hover', 'pressed', 'focus', 'disabled'] as const;

/** A component set of `n` frames inside w × h. Up to 60 frames are drawn as real buttons (state across, hierarchy and
 *  size down); more become a dense wall of swatches, and past `cap` the rest is counted. */
export function FrameWall({ n, w, h, cap = 1200 }: { n: number; w: number; h: number; cap?: number }) {
  const shown = Math.min(n, cap);
  const real = n <= 60 && n >= 1;
  const cols = real ? Math.min(5, n) : Math.max(1, Math.round(Math.sqrt((shown * w) / h)));
  const rows = Math.max(1, Math.ceil(shown / cols));
  const cw = (w - 16) / cols, ch = (h - 16) / rows;
  return (
    <g>
      <rect width={w} height={h} rx={6} fill="#FFFFFF" stroke={FIGMA_PURPLE} strokeWidth={1.5} strokeDasharray="5 4" />
      {Array.from({ length: shown }, (_, k) => {
        const c = k % cols, r = Math.floor(k / cols), x = 8 + c * cw, y = 8 + r * ch;
        const v = BTN_VARIANTS[Math.floor(r / 3) % 4], s = BTN_SIZES[r % 3];
        if (real) {
          const z = Math.min(1, (ch - 4) / 40), st = STATES[c % 5];
          return (
            <g key={k} transform={`translate(${x + 3} ${y + (ch - BTN_H[s] * z) / 2}) scale(${z})`}>
              <RastaButton x={0} y={0} w={(cw - 6) / z} variant={v} size={s} label={cw > 60 ? 'Renew' : ''} state={st} />
            </g>
          );
        }
        const st = BTN_STYLE[BTN_VARIANTS[k % 4]];
        return <rect key={k} x={x + 1} y={y + 1} width={Math.max(1, cw - 2)} height={Math.max(1, ch - 2)} rx={Math.min(3, ch / 4)} fill={st.fill === 'none' ? '#F2F4F7' : st.fill} stroke={st.stroke} strokeWidth={0.5} />;
      })}
    </g>
  );
}

type Row = { name: string; type: 'variant' | 'boolean' | 'swap' | 'text'; value: string; at?: number; until?: number };

function TypeIcon({ type, x, y }: { type: Row['type']; x: number; y: number }) {
  const c = type === 'variant' ? FIGMA_PURPLE : type === 'boolean' ? SC.discover : type === 'swap' ? SC.grow : SC.build;
  if (type === 'variant') return <rect x={x - 5} y={y - 5} width={10} height={10} transform={`rotate(45 ${x} ${y})`} fill="none" stroke={c} strokeWidth={2} />;
  if (type === 'boolean') return <g><rect x={x - 8} y={y - 5} width={16} height={10} rx={5} fill={c} /><circle cx={x + 3} cy={y} r={3.2} fill="#fff" /></g>;
  if (type === 'swap') return <path d={`M${x - 6} ${y - 2} a6 6 0 0 1 11 -2 M${x + 6} ${y + 2} a6 6 0 0 1 -11 2`} fill="none" stroke={c} strokeWidth={2} />;
  return <text x={x} y={y + 5} textAnchor="middle" fontSize={14} fontWeight={900} fill={c}>T</text>;
}

export function VariantExplosionScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const n = t < 10 ? Math.round(lerp(0, 1080, p(t, 0.4, 3))) : t < 15 ? Math.round(lerp(1080, 360, p(t, 10.4, 12))) : Math.round(lerp(360, 60, p(t, 15.4, 17)));
  const icon = t >= 15 && t < 20 ? (Math.floor((t - 15.6) / 1.2) % 2 === 1 ? 'bus' : 'ticket') : 'ticket';
  const typed = t >= 20 ? 'Renew pass'.slice(0, Math.floor(clamp((t - 20.4) / 1.6) * 10)) : '';
  const rows: Row[] = [
    { name: 'Hierarchy', type: 'variant', value: 'primary' },
    { name: 'Size', type: 'variant', value: 'md' },
    { name: 'State', type: 'variant', value: 'default' },
    { name: 'Icon position', type: 'variant', value: 'left', until: 10.6 },
    { name: 'Leading icon', type: 'boolean', value: 'on', at: 10.6 },
    { name: 'Trailing icon', type: 'boolean', value: 'off', at: 11.2 },
    { name: 'Icon', type: t >= 15.4 ? 'swap' : 'variant', value: icon },
    { name: 'Label', type: 'text', value: typed || 'Renew', at: 20 },
  ].filter(r => (r.at === undefined || t >= r.at) && (r.until === undefined || t < r.until)) as Row[];
  const lit = (r: Row) => (t >= 10 && t < 12 && (r.name.includes('icon') || r.name === 'Icon position')) || (t >= 15 && t < 17 && r.name === 'Icon') || (t >= 20 && t < 22 && r.name === 'Label');
  const slow = t >= 5 && t < 10;
  const fin = p(t, 29, 29.6);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a Button component set of 1,080 variants shrinks to 60 when the icon becomes a boolean and an instance swap and the label a text property">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g transform={`translate(36 ${lerp(48, 36, intro)})`} opacity={intro * (1 - fin * 0.6)}>
        <text x={0} y={0} fontSize={13} fontWeight={800} fill={FIGMA_PURPLE}>◇ Button</text>
        <text x={560} y={0} textAnchor="end" fontSize={13} fontWeight={900} fill={SC.text} style={{ fontVariantNumeric: 'tabular-nums' }}>{n.toLocaleString('en-IN')} frames</text>
        <g transform="translate(0 12)"><FrameWall n={n} w={560} h={lerp(440, 262, p(t, 23.6, 24.2))} /></g>
        {slow && (
          <g transform="translate(130 190)" opacity={p(t, 5, 5.5)}>
            <rect width={300} height={96} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
            <text x={20} y={34} fontSize={14} fontWeight={800} fill={SC.text}>Opening Rasta UI library…</text>
            <rect x={20} y={50} width={260} height={8} rx={4} fill={SC.line} />
            <rect x={20} y={50} width={260 * p(t, 5.2, 9.8)} height={8} rx={4} fill={FIGMA_PURPLE} />
            <text x={20} y={80} fontSize={12} fontWeight={700} fill={SC.error}>{Math.round(lerp(0, 40, p(t, 5.2, 9.8)))} s · one new icon = 180 more frames</text>
          </g>
        )}
      </g>

      {/* the properties panel */}
      <g transform={`translate(632 ${lerp(40, 28, intro)})`} opacity={intro}>
        <rect width={296} height={470} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
        <text x={18} y={30} fontSize={13} fontWeight={900} fill={SC.text}>Properties</text>
        <rect x={18} y={44} width={260} height={56} rx={10} fill="#FFFFFF" stroke={SC.line} />
        <RastaButton x={68} y={56} w={160} variant="primary" label={typed || 'Renew'} icon={t >= 15 ? icon === 'ticket' : true} />
        {t >= 15 && t < 20 && <text x={148} y={116} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={SC.muted}>icon: {icon}</text>}
        {rows.map((r, k) => (
          <g key={r.name} transform={`translate(18 ${140 + k * 38})`}>
            {lit(r) && <rect x={-8} y={-16} width={276} height={32} rx={8} fill={SC.brand} opacity={0.1} />}
            <TypeIcon type={r.type} x={8} y={0} />
            <text x={26} y={4.5} fontSize={12.5} fontWeight={700} fill={SC.text}>{r.name}</text>
            {r.type === 'boolean'
              ? <g transform="translate(232 -7)"><rect width={26} height={14} rx={7} fill={r.value === 'on' ? SC.brand : SC.line} /><circle cx={r.value === 'on' ? 19 : 7} cy={7} r={5} fill="#fff" /></g>
              : <g><rect x={140} y={-12} width={120} height={24} rx={6} fill={SC.soft} stroke={SC.line} /><text x={150} y={4.5} fontSize={11.5} fontWeight={700} fill={SC.text} fontFamily={r.type === 'text' ? undefined : MONO}>{r.value}{r.type === 'text' && t >= 20 && t < 22.4 ? '|' : ''}</text>{r.type !== 'text' && <text x={250} y={4.5} textAnchor="end" fontSize={10} fill={SC.muted}>▾</text>}</g>}
          </g>
        ))}
      </g>
      {t >= 24 && (
        <g transform="translate(36 332)" opacity={p(t, 24, 24.6) * (1 - fin)}>
          <rect width={560} height={150} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
          <text x={18} y={28} fontSize={12} fontWeight={900} fill={SC.text}>The same names in code</text>
          {['<Button', '  variant="primary"', '  size="md"', '  iconLeading={<TicketIcon />}', '>Renew pass</Button>'].map((l, k) => (
            <text key={l} x={18} y={52 + k * 17} fontSize={11.5} fontWeight={700} fill={k > 0 && k < 4 ? SC.brand : SC.text} fontFamily={MONO} opacity={p(t, 24.3 + k * 0.3, 24.7 + k * 0.3)}>{l}</text>
          ))}
          <text x={18} y={134} fontSize={10.5} fontWeight={700} fill={SC.muted} opacity={p(t, 26, 26.5)}>State stays in Figma: the browser supplies hover.</text>
        </g>
      )}
      {t >= 29 && (
        <g transform="translate(110 150)" opacity={fin}>
          <rect width={440} height={230} rx={20} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
          <text x={28} y={50} fontSize={21} fontWeight={900} fill={SC.text}>Draw only what changes the drawing</text>
          <text x={28} y={104} fontSize={40} fontWeight={900} fill={SC.error} style={{ fontVariantNumeric: 'tabular-nums' }} opacity={0.7}>1,080</text>
          <line x1={26} x2={140} y1={92} y2={92} stroke={SC.error} strokeWidth={3} opacity={p(t, 29.6, 30)} />
          <text x={160} y={104} fontSize={40} fontWeight={900} fill={SC.mint}>→ 60 frames</text>
          {[['◇', 'Variant', 'the fill, size or border changes'], ['◉', 'Boolean · swap · text', 'show a layer, pick a nested part, type words']].map(([i, a, b], k) => (
            <g key={a} transform={`translate(28 ${140 + k * 42})`} opacity={p(t, 30 + k * 0.5, 30.5 + k * 0.5)}>
              <text fontSize={14} fontWeight={900} fill={k ? SC.brand : FIGMA_PURPLE}>{i} {a}</text>
              <text y={18} fontSize={12.5} fontWeight={700} fill={SC.muted}>{b}</text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
