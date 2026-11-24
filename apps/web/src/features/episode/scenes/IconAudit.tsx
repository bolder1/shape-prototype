'use client';
// Scene for ui.4-2: Hisaab's home screen has eight icons from three free packs and no labels. Ramesh ji, asked to find
// udhaar, taps the bolt before the book; a $ sits on Payments and an American mailbox on Messages. The icons are lined
// up (1.5, 2 and 3 px strokes, one filled, one edge to edge), redrawn on one 24 px grid with a 2 px stroke, given words,
// swapped to ₹ and a chat bubble, shown inside 48 px tap areas, and he finds all eight. `HIcon` and `IconRowArt` are
// shared with the Spot the odd icon game. Pure function of t (0–34).
import { ICONS, type IconName } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;

const circ = (cx: number, cy: number, r: number) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`;

/** Each icon as stroke paths on a 24 × 24 grid; `solid` parts are the closed shapes a filled version fills. */
const PATHS: Record<IconName, { d: string; solid?: string }> = {
  home: { d: 'M3 11 L12 4 L21 11 M5.5 9.5 V20 H18.5 V9.5 M10 20 V14.5 H14 V20', solid: 'M5.5 9.5 L12 4.5 L18.5 9.5 V20 H5.5 Z' },
  search: { d: `${circ(11, 11, 6.5)} M16 16 L20.5 20.5`, solid: circ(11, 11, 6.5) },
  sale: { d: 'M6 3.5 H18 V20.5 L15 19 L12 20.5 L9 19 L6 20.5 Z M9 11.5 H15 M12 8.5 V14.5', solid: 'M6 3.5 H18 V20.5 L15 19 L12 20.5 L9 19 L6 20.5 Z' },
  udhaar: { d: 'M4 4.5 H10.5 C11.4 4.5 12 5.1 12 6 V20 C12 19.2 11.4 18.5 10.5 18.5 H4 Z M20 4.5 H13.5 C12.6 4.5 12 5.1 12 6 V20 C12 19.2 12.6 18.5 13.5 18.5 H20 Z', solid: 'M4 4.5 H10.5 C11.4 4.5 12 5.1 12 6 V20 C12 19.2 11.4 18.5 10.5 18.5 H4 Z M20 4.5 H13.5 C12.6 4.5 12 5.1 12 6 V20 C12 19.2 12.6 18.5 13.5 18.5 H20 Z' },
  stock: { d: 'M3.5 7.5 L12 3 L20.5 7.5 V16.5 L12 21 L3.5 16.5 Z M3.5 7.5 L12 12 L20.5 7.5 M12 12 V21', solid: 'M3.5 7.5 L12 3 L20.5 7.5 V16.5 L12 21 L3.5 16.5 Z' },
  customers: { d: `${circ(9, 8, 3.2)} M3 20 C3 16.2 5.7 14 9 14 C12.3 14 15 16.2 15 20 ${circ(17, 9, 2.4)} M16.5 14 C19 14 21 15.8 21 19`, solid: `${circ(9, 8, 3.2)} M3 20 C3 16.2 5.7 14 9 14 C12.3 14 15 16.2 15 20 Z` },
  reports: { d: 'M4 20 H20 M7 17 V11 M12 17 V6 M17 17 V13' },
  settings: { d: `${circ(12, 12, 3)} ${circ(12, 12, 7)} M12 2.5 V5 M12 19 V21.5 M2.5 12 H5 M19 12 H21.5 M5.3 5.3 L7 7 M17 17 L18.7 18.7 M5.3 18.7 L7 17 M17 7 L18.7 5.3`, solid: circ(12, 12, 7) },
  bell: { d: 'M6 16.5 V11 C6 7.7 8.7 5 12 5 C15.3 5 18 7.7 18 11 V16.5 L19.5 18 H4.5 Z M10 21 H14 M12 3 V5', solid: 'M6 16.5 V11 C6 7.7 8.7 5 12 5 C15.3 5 18 7.7 18 11 V16.5 L19.5 18 H4.5 Z' },
  scan: { d: 'M4 8.5 V4 H8.5 M15.5 4 H20 V8.5 M20 15.5 V20 H15.5 M8.5 20 H4 V15.5 M7 12 H17' },
  share: { d: `${circ(18, 5.5, 2.5)} ${circ(6, 12, 2.5)} ${circ(18, 18.5, 2.5)} M8.3 10.8 L15.7 6.7 M8.3 13.2 L15.7 17.3`, solid: `${circ(18, 5.5, 2.5)} ${circ(6, 12, 2.5)} ${circ(18, 18.5, 2.5)}` },
  call: { d: 'M5.5 3.5 H9 L11 8.5 L8.5 10 C9.6 12.4 11.6 14.4 14 15.5 L15.5 13 L20.5 15 V18.5 C20.5 19.6 19.6 20.5 18.5 20.5 C10.5 20 4 13.5 3.5 5.5 C3.5 4.4 4.4 3.5 5.5 3.5 Z', solid: 'M5.5 3.5 H9 L11 8.5 L8.5 10 C9.6 12.4 11.6 14.4 14 15.5 L15.5 13 L20.5 15 V18.5 C20.5 19.6 19.6 20.5 18.5 20.5 C10.5 20 4 13.5 3.5 5.5 C3.5 4.4 4.4 3.5 5.5 3.5 Z' },
  rupee: { d: 'M7 4 H17 M7 8.5 H17 M7 4 H10 C13 4 14.5 6 14.5 8.5 C14.5 11 13 13 10 13 H7 L15 20.5' },
  trash: { d: 'M4 7 H20 M9 7 V4 H15 V7 M6 7 L7 20 H17 L18 7 M10 11 V16 M14 11 V16', solid: 'M6 7 L7 20 H17 L18 7 Z' },
  edit: { d: 'M4 20 L5 15 L16 4 L20 8 L9 19 Z M14 6 L18 10', solid: 'M4 20 L5 15 L16 4 L20 8 L9 19 Z' },
  calendar: { d: 'M5.5 5.5 H18.5 C19.3 5.5 20 6.2 20 7 V19 C20 19.8 19.3 20.5 18.5 20.5 H5.5 C4.7 20.5 4 19.8 4 19 V7 C4 6.2 4.7 5.5 5.5 5.5 Z M4 10 H20 M8 3 V7 M16 3 V7' },
  bolt: { d: 'M13 3 L5 13.5 H11 L10 21 L19 9.5 H13 Z', solid: 'M13 3 L5 13.5 H11 L10 21 L19 9.5 H13 Z' },
  chat: { d: 'M5 4.5 H19 C19.8 4.5 20.5 5.2 20.5 6 V15 C20.5 15.8 19.8 16.5 19 16.5 H10 L6 20 V16.5 H5 C4.2 16.5 3.5 15.8 3.5 15 V6 C3.5 5.2 4.2 4.5 5 4.5 Z', solid: 'M5 4.5 H19 C19.8 4.5 20.5 5.2 20.5 6 V15 C20.5 15.8 19.8 16.5 19 16.5 H10 L6 20 V16.5 H5 C4.2 16.5 3.5 15.8 3.5 15 V6 C3.5 5.2 4.2 4.5 5 4.5 Z' },
  dollar: { d: 'M12 3 V21 M16 7.5 C16 6 14.5 5 12 5 C9.5 5 8 6.2 8 8 C8 10 10 10.7 12 11.2 C14 11.7 16 12.5 16 15 C16 17 14.5 18.5 12 18.5 C9.5 18.5 8 17.4 8 16' },
  mailbox: { d: 'M4 20 V11 C4 8.2 6.2 6 9 6 H15 C17.8 6 20 8.2 20 11 V15 H4 M9 6 C11.8 6 14 8.2 14 11 V15 M12 15 V21 M16.5 9 V3.5 H19.5 V5.5 H16.5', solid: 'M4 15 V11 C4 8.2 6.2 6 9 6 H15 C17.8 6 20 8.2 20 11 V15 Z' },
};

/** The ₹ and chat bubble that replace the wrong metaphors once fixed. */
export const ICON_FIX: Partial<Record<IconName, IconName>> = { dollar: 'rupee', mailbox: 'chat' };

/**
 * One icon at (x, y), `size` px square. `stroke` is in grid units (2 = a 2 px stroke at 24 px). `fill` fills its
 * closed shapes, `edge` scales it out past the grid's padding (drawn edge to edge).
 */
export function HIcon({ name, x = 0, y = 0, size = 24, stroke = 2, fill = false, edge = false, color = SC.text, opacity = 1 }: {
  name: IconName; x?: number; y?: number; size?: number; stroke?: number; fill?: boolean; edge?: boolean; color?: string; opacity?: number;
}) {
  const icon = PATHS[name], k = size / 24, e = edge ? 1.3 : 1;
  return (
    <g transform={`translate(${x + size / 2} ${y + size / 2}) scale(${k * e}) translate(-12 -12)`} opacity={opacity} aria-hidden>
      {fill && icon.solid && <path d={icon.solid} fill={color} fillRule="evenodd" />}
      <path d={icon.d} fill="none" stroke={color} strokeWidth={stroke / e} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

export const ROW_W = 400, ROW_H = 104;
const SLOT = 80;

/**
 * A row of five icons, each centred in an 80 px slot, with labels underneath. The `odd` icon is drawn with its flaw
 * (`fill`, `bold`, `small`, `big`, a wrong picture, or no label) until `fixed`. `ring` circles one slot.
 */
export function IconRowArt({ icons, odd, flaw, lane, fixed, ring, ringTone = SC.text, hit }: {
  icons: readonly IconName[]; odd: number; flaw?: string; lane: string; fixed?: boolean; ring?: number; ringTone?: string; hit?: number;
}) {
  return (
    <g>
      <rect width={ROW_W} height={ROW_H} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
      {icons.map((n, k) => {
        const isOdd = k === odd && !fixed, cx = k * SLOT + SLOT / 2;
        const name = !fixed || k !== odd ? n : (ICON_FIX[n] ?? n);
        const size = isOdd && flaw === 'small' ? 18 : 28;
        const dy = isOdd && flaw === 'small' ? 9 : 0;
        return (
          <g key={k}>
            {hit === k && <rect x={k * SLOT + 8} y={10} width={SLOT - 16} height={SLOT - 12} rx={14} fill={SC.soft} />}
            <HIcon name={name} x={cx - size / 2} y={22 + (28 - size) / 2 + dy} size={size}
              stroke={isOdd && flaw === 'bold' ? 3.2 : isOdd && flaw === 'fill' ? 2.4 : 2} fill={isOdd && flaw === 'fill'} edge={isOdd && flaw === 'big'} />
            {!(isOdd && lane === 'label') && <text x={cx} y={78} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={SC.muted}>{ICONS[name]}</text>}
            {isOdd && lane === 'label' && <text x={cx} y={78} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={SC.line}>?</text>}
            {ring === k && <rect x={k * SLOT + 6} y={8} width={SLOT - 12} height={SLOT - 8} rx={16} fill="none" stroke={ringTone} strokeWidth={3} />}
          </g>
        );
      })}
    </g>
  );
}

const PX = 80, PY = 46;
/** The home screen: what each tile is, and how the first draft drew it. */
const TILES: { name: IconName; draft: IconName; stroke: number; fill?: boolean; edge?: boolean }[] = [
  { name: 'sale', draft: 'bolt', stroke: 2 }, { name: 'udhaar', draft: 'udhaar', stroke: 1.5 },
  { name: 'stock', draft: 'stock', stroke: 2 }, { name: 'rupee', draft: 'dollar', stroke: 2 },
  { name: 'customers', draft: 'customers', stroke: 2, fill: true }, { name: 'reports', draft: 'reports', stroke: 3.2 },
  { name: 'chat', draft: 'mailbox', stroke: 1.5 }, { name: 'settings', draft: 'settings', stroke: 2, edge: true },
];
const TILE_LABEL: Partial<Record<IconName, string>> = { sale: 'New sale', rupee: 'Payments', chat: 'Messages' };
const tileAt = (k: number) => ({ x: PX + 22 + (k % 4) * 66, y: PY + 120 + Math.floor(k / 4) * 104 });

const Thumb = ({ x, y, o }: { x: number; y: number; o: number }) => (
  <g opacity={o}><ellipse cx={x} cy={y} rx={20} ry={24} fill="#f5c9a8" stroke="#c2410c" strokeOpacity={0.4} strokeWidth={2} opacity={0.85} /><ellipse cx={x} cy={y - 7} rx={11} ry={9} fill="#fde2cf" opacity={0.8} /></g>
);

export function IconAuditScene({ t }: { t: number }) {
  const redraw = p(t, 18, 20), words = p(t, 22, 23.4), swap = p(t, 22.6, 23.6);
  const tap = (a: number) => clamp(1 - Math.abs(t - a) / 0.35);
  const panel = (a: number, b: number) => p(t, a, a + 0.5) * (1 - p(t, b - 0.5, b));
  const bolt = tileAt(0), book = tileAt(1);
  const found = t >= 30 ? 8 : 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: eight unlabelled icons from three packs confuse a shopkeeper, then are redrawn as one family with labels and he finds them all">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={clamp(back(t / 0.6))}>
        <rect x={PX} y={PY} width={300} height={440} rx={30} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
        <text x={PX + 24} y={PY + 44} fontSize={18} fontWeight={900} fill={SC.text}>Hisaab</text>
        <text x={PX + 24} y={PY + 66} fontSize={12} fontWeight={700} fill={SC.muted}>Sharma General Store · Malviya Nagar</text>
        {TILES.map((tile, k) => {
          const { x, y } = tileAt(k);
          const draft = tile.draft, fixedName = tile.name;
          return (
            <g key={k}>
              <rect x={x} y={y} width={56} height={56} rx={14} fill={SC.soft} stroke={SC.line} />
              {/* the draft icon fades out as the redrawn one fades in */}
              <HIcon name={draft} x={x + 14} y={y + 14} size={28} stroke={tile.stroke} fill={tile.fill} edge={tile.edge} opacity={1 - (draft === fixedName ? redraw : Math.max(redraw, swap))} />
              <HIcon name={fixedName} x={x + 14} y={y + 14} size={28} opacity={draft === fixedName ? redraw : swap} color={SC.brand} />
              <text x={x + 28} y={y + 74} textAnchor="middle" fontSize={11} fontWeight={800} fill={SC.text} opacity={words}>{TILE_LABEL[fixedName] ?? ICONS[fixedName]}</text>
              {t >= 10 && t < 14 && (draft === 'dollar' || draft === 'mailbox') && (
                <rect x={x - 4} y={y - 4} width={64} height={64} rx={17} fill="none" stroke={SC.error} strokeWidth={3} opacity={panel(10, 14)} />
              )}
              {t >= 27 && t < 30 && k === 1 && (
                <g opacity={panel(27, 30)}>
                  <rect x={x + 4} y={y + 4} width={48} height={48} rx={10} fill="none" stroke={SC.mint} strokeWidth={2} strokeDasharray="4 3" />
                </g>
              )}
            </g>
          );
        })}
        {/* Ramesh ji's guesses */}
        {t >= 5.6 && t < 8.4 && <Thumb x={bolt.x + 40} y={bolt.y + 44} o={tap(6.3)} />}
        {t >= 6.8 && t < 8.6 && <Thumb x={book.x + 40} y={book.y + 44} o={tap(7.6)} />}
        {t >= 6.3 && t < 9.6 && <rect x={bolt.x - 4} y={bolt.y - 4} width={64} height={64} rx={17} fill="none" stroke={SC.error} strokeWidth={3} opacity={p(t, 6.3, 6.6) * (1 - p(t, 9, 9.6))} />}
        {t >= 7.6 && t < 9.6 && <rect x={book.x - 4} y={book.y - 4} width={64} height={64} rx={17} fill="none" stroke={SC.mint} strokeWidth={3} opacity={p(t, 7.6, 7.9) * (1 - p(t, 9, 9.6))} />}
      </g>

      {/* the test */}
      {t >= 4.6 && t < 10 && (
        <g transform="translate(450 120)" opacity={panel(4.6, 10)}>
          <text fontSize={14} fontWeight={800} fill={SC.muted}>Task 3 of 8</text>
          <text y={34} fontSize={22} fontWeight={900} fill={SC.text}>“Where would you write down udhaar?”</text>
          <text y={74} fontSize={15} fontWeight={700} fill={SC.text} opacity={p(t, 6.3, 6.7)}><tspan fill={SC.error}>✕ </tspan>The lightning bolt. “Fast entry?”</text>
          <text y={102} fontSize={15} fontWeight={700} fill={SC.text} opacity={p(t, 7.6, 8)}><tspan fill={SC.mint}>✓ </tspan>The book, on the second try</text>
          <g transform="translate(0 140)" opacity={p(t, 8.4, 8.9)}>
            <rect width={300} height={70} rx={16} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
            <text x={20} y={30} fontSize={13} fontWeight={800} fill={SC.muted}>Found first time</text>
            <text x={20} y={56} fontSize={22} fontWeight={900} fill={SC.text}>{found} of 8 tiles</text>
          </g>
        </g>
      )}
      {t >= 10 && t < 14 && (
        <g transform="translate(450 130)" opacity={panel(10, 14)}>
          <text fontSize={20} fontWeight={900} fill={SC.text}>Pictures from someone else’s world</text>
          {([['dollar', 'Payments in rupees, drawn as $'], ['mailbox', '“Is that the post office?”']] as const).map(([n, s], k) => (
            <g key={n} transform={`translate(0 ${34 + k * 64})`} opacity={p(t, 10.6 + k * 0.8, 11.1 + k * 0.8)}>
              <rect width={52} height={52} rx={14} fill={SC.surface} stroke={SC.error} strokeWidth={2} />
              <HIcon name={n} x={12} y={12} size={28} />
              <text x={70} y={32} fontSize={16} fontWeight={800} fill={SC.text}>{s}</text>
            </g>
          ))}
        </g>
      )}
      {t >= 14 && t < 18.4 && (
        <g transform="translate(440 120)" opacity={panel(14, 18.4)}>
          <text fontSize={20} fontWeight={900} fill={SC.text}>Three packs in one screen</text>
          {TILES.map((tile, k) => (
            <g key={k} transform={`translate(${(k % 4) * 116} ${36 + Math.floor(k / 4) * 120})`} opacity={p(t, 14.4 + k * 0.2, 14.8 + k * 0.2)}>
              <rect width={96} height={96} rx={16} fill={SC.surface} stroke={SC.line} />
              <HIcon name={tile.draft} x={24} y={20} size={48} stroke={tile.stroke} fill={tile.fill} edge={tile.edge} />
              <text x={48} y={88} textAnchor="middle" fontSize={11} fontWeight={800} fill={tile.stroke !== 2 || tile.fill || tile.edge ? SC.error : SC.muted}>
                {tile.fill ? 'filled' : tile.edge ? 'edge to edge' : `${tile.stroke} px`}
              </text>
            </g>
          ))}
        </g>
      )}
      {t >= 18 && t < 22.4 && (
        <g transform="translate(470 110)" opacity={panel(18, 22.4)}>
          <text fontSize={20} fontWeight={900} fill={SC.text}>One family, one grid</text>
          <g transform="translate(0 30)">
            <rect width={240} height={240} rx={8} fill={SC.surface} stroke={SC.line} />
            {Array.from({ length: 25 }, (_, k) => <line key={`v${k}`} x1={k * 10} x2={k * 10} y1={0} y2={240} stroke={SC.line} strokeOpacity={0.5} />)}
            {Array.from({ length: 25 }, (_, k) => <line key={`h${k}`} y1={k * 10} y2={k * 10} x1={0} x2={240} stroke={SC.line} strokeOpacity={0.5} />)}
            <rect x={20} y={20} width={200} height={200} fill="none" stroke={SC.discover} strokeWidth={1.5} strokeDasharray="5 4" opacity={p(t, 18.6, 19.2)} />
            <circle cx={120} cy={120} r={100} fill="none" stroke={SC.design} strokeWidth={1.5} strokeDasharray="5 4" opacity={p(t, 19, 19.6)} />
            <HIcon name="udhaar" x={0} y={0} size={240} color={SC.text} opacity={p(t, 19.4, 20.2)} />
          </g>
          <g transform="translate(270 70)" opacity={p(t, 20, 20.6)}>
            {['24 px grid', '2 px stroke', 'round ends and corners', 'the same visual size'].map((s, k) => (
              <text key={s} y={k * 32} fontSize={15} fontWeight={800} fill={SC.text}><tspan fill={SC.mint}>✓ </tspan>{s}</text>
            ))}
          </g>
        </g>
      )}
      {t >= 22.4 && t < 27 && (
        <g transform="translate(470 150)" opacity={panel(22.4, 27)}>
          <text fontSize={20} fontWeight={900} fill={SC.text}>A word under every icon</text>
          <text y={32} fontSize={15} fontWeight={700} fill={SC.muted}>Only search, home and close are safe alone.</text>
          {([['dollar', 'rupee'], ['mailbox', 'chat']] as const).map(([a, b], k) => (
            <g key={a} transform={`translate(0 ${64 + k * 68})`} opacity={p(t, 23 + k * 0.6, 23.5 + k * 0.6)}>
              <HIcon name={a} x={0} y={8} size={36} color={SC.muted} opacity={0.6} />
              <text x={56} y={34} fontSize={20} fontWeight={900} fill={SC.muted}>→</text>
              <HIcon name={b} x={90} y={8} size={36} color={SC.brand} />
              <text x={142} y={32} fontSize={15} fontWeight={800} fill={SC.text}>{ICONS[b]}</text>
            </g>
          ))}
        </g>
      )}
      {t >= 27 && t < 30.4 && (
        <g transform="translate(500 140)" opacity={panel(27, 30.4)}>
          <text fontSize={20} fontWeight={900} fill={SC.text}>Small icon, big target</text>
          <g transform="translate(40 40)">
            <rect width={144} height={144} rx={24} fill={SC.surface} stroke={SC.mint} strokeWidth={2.5} strokeDasharray="8 6" />
            <HIcon name="udhaar" x={36} y={36} size={72} color={SC.brand} />
            <text x={72} y={170} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.muted}>24 px icon · 48 px tap area</text>
          </g>
        </g>
      )}
      {t >= 30 && (
        <g transform="translate(470 170)" opacity={p(t, 30.2, 30.8)}>
          <text fontSize={14} fontWeight={800} fill={SC.muted}>Same test, same shopkeeper</text>
          <text y={50} fontSize={40} fontWeight={900} fill={SC.text}>{Math.round(lerp(2, 8, p(t, 30.6, 32)))} of 8</text>
          <text y={84} fontSize={16} fontWeight={700} fill={SC.muted}>found first time.</text>
        </g>
      )}
    </svg>
  );
}
