'use client';
// Scene for ia.4-3: Rekha's packing dashboard for Mandi works with a mouse (hover a row for Edit, right-click to
// reassign, a side panel, a popover date picker, a hover-only chart and a leaf icon with a tooltip). Squeezed onto a
// packer's phone, it breaks: no hover, a 20 px checkbox, a menu up in the corner. A thumb-zone map shows where a thumb
// reaches, and each part is ported: words instead of tooltips, a ⋯ menu, a bottom sheet, big buttons and bottom tabs.
// `DeskDash` and `PhoneDash` (each part drafted or ported) are shared with the Port it to the phone game. Pure
// function of t (0–34).
import type { PackingPart } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
export const DESK_W = 460, DESK_H = 290, PHONE_W = 200, PHONE_H = 400;
type Ported = Partial<Record<PackingPart, boolean>>;

/** Where each part sits on the desktop dashboard (for focus rings). */
export const DESK_BOX: Record<PackingPart, [number, number, number, number]> = {
  toolbar: [10, 8, 200, 22], chart: [10, 40, 130, 86], popover: [10, 134, 130, 120], checkbox: [150, 64, 18, 92],
  tooltip: [262, 38, 64, 24], rowhover: [150, 92, 182, 28], rightclick: [234, 120, 96, 48], panel: [338, 36, 114, 246],
};
const ROWS = ['#2041 · Kulkarni', '#2042 · Shaikh', '#2043 · Iyer'];
const BARS = [42, 38, 51, 47];

/** Mandi's packing dashboard on a desktop, as Rekha uses it with a mouse. */
export function DeskDash({ focus, x = 0, y = 0, scale = 1, cursor }: { focus?: PackingPart; x?: number; y?: number; scale?: number; cursor?: [number, number] }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect width={DESK_W} height={DESK_H} rx={10} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
      {/* toolbar */}
      {['Orders', 'Crates', 'Riders'].map((n, k) => <text key={n} x={16 + k * 62} y={24} fontSize={12} fontWeight={k === 0 ? 900 : 700} fill={k === 0 ? SC.text : SC.muted}>{n}</text>)}
      <line x1={0} x2={DESK_W} y1={34} y2={34} stroke={SC.line} />
      {/* chart, values only on hover */}
      <text x={14} y={52} fontSize={9} fontWeight={800} fill={SC.muted}>Crates a day</text>
      {BARS.map((b, k) => <rect key={k} x={18 + k * 30} y={122 - b * 1.2} width={20} height={b * 1.2} rx={3} fill={k === 3 ? SC.brand : SC.line} />)}
      {/* date field + popover */}
      <rect x={14} y={136} width={122} height={20} rx={4} fill={SC.surface} stroke={SC.line} />
      <text x={20} y={150} fontSize={9.5} fontWeight={700} fill={SC.text}>Deliver: Sat 14 Dec</text>
      <rect x={14} y={160} width={122} height={92} rx={6} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
      {Array.from({ length: 21 }, (_, k) => <text key={k} x={24 + (k % 7) * 16} y={178 + Math.floor(k / 7) * 22} fontSize={8.5} fontWeight={700} fill={k === 13 ? SC.brand : SC.muted}>{k + 1}</text>)}
      {/* table */}
      <text x={174} y={52} fontSize={9} fontWeight={800} fill={SC.muted}>Order</text>
      {ROWS.map((r, k) => {
        const ry = 64 + k * 28;
        return (
          <g key={r}>
            {k === 1 && <rect x={150} y={ry} width={182} height={28} fill={SC.soft} />}
            <rect x={156} y={ry + 9} width={10} height={10} rx={2} fill={SC.surface} stroke={SC.muted} />
            <text x={174} y={ry + 18} fontSize={10} fontWeight={700} fill={SC.text}>{r}</text>
            <path d={`M${292} ${ry + 20} q 6 -14 14 -12 q -2 10 -14 12 z`} fill={SC.mint} />
            {k === 1 && <text x={312} y={ry + 18} fontSize={8.5} fontWeight={800} fill={SC.brand}>Edit  Delete</text>}
            <line x1={150} x2={332} y1={ry + 28} y2={ry + 28} stroke={SC.line} />
          </g>
        );
      })}
      {/* tooltip */}
      <g><rect x={264} y={40} width={60} height={20} rx={4} fill={SC.text} /><text x={294} y={54} textAnchor="middle" fontSize={9} fontWeight={800} fill={SC.surface}>Organic</text></g>
      {/* right-click menu */}
      <g><rect x={236} y={130} width={92} height={36} rx={4} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} /><text x={244} y={145} fontSize={9} fontWeight={700} fill={SC.text}>Reassign…</text><text x={244} y={160} fontSize={9} fontWeight={700} fill={SC.text}>Print label</text></g>
      {/* side panel */}
      <rect x={340} y={38} width={110} height={242} rx={6} fill={SC.soft} stroke={SC.line} />
      <text x={350} y={58} fontSize={10.5} fontWeight={900} fill={SC.text}>Order #2041</text>
      {['Tomatoes 1 kg', 'Spinach ×2', 'Okra 500 g', 'Mangoes ×6'].map((l, k) => <text key={l} x={350} y={80 + k * 18} fontSize={9} fontWeight={600} fill={SC.muted}>{l}</text>)}
      {cursor && <path d={`M${cursor[0]} ${cursor[1]} l0 16 l4 -4 l3 7 l3 -1 l-3 -7 l6 0 z`} fill={SC.text} stroke={SC.surface} strokeWidth={1} />}
      {focus && (() => { const [bx, by, bw, bh] = DESK_BOX[focus]; return <rect x={bx - 4} y={by - 4} width={bw + 8} height={bh + 8} rx={8} fill="none" stroke={SC.brand} strokeWidth={2.5} strokeDasharray="6 4" />; })()}
    </g>
  );
}

/** The packing dashboard on a packer's phone. Each part is either the desktop version squeezed, or ported for a thumb. */
export function PhoneDash({ ported, x = 0, y = 0, scale = 1, glow }: { ported: Ported; x?: number; y?: number; scale?: number; glow?: PackingPart }) {
  const g = (k: PackingPart) => !!ported[k];
  const hi = (k: PackingPart) => (glow === k ? { stroke: SC.mint, strokeWidth: 2.5 } : {});
  const menu = g('rowhover') || g('rightclick');
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect width={PHONE_W} height={PHONE_H} rx={26} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
      {/* toolbar: squeezed at the top, or tabs at the bottom */}
      {g('toolbar')
        ? <g><rect x={6} y={PHONE_H - 52} width={PHONE_W - 12} height={46} rx={18} fill={SC.soft} {...hi('toolbar')} />{['Orders', 'Crates', 'Riders'].map((n, k) => <text key={n} x={38 + k * 62} y={PHONE_H - 24} textAnchor="middle" fontSize={11} fontWeight={k === 0 ? 900 : 700} fill={k === 0 ? SC.text : SC.muted}>{n}</text>)}</g>
        : <g>{['Orders', 'Crates', 'Riders'].map((n, k) => <text key={n} x={20 + k * 30} y={30} fontSize={6.5} fontWeight={700} fill={SC.muted}>{n}</text>)}</g>}
      {/* chart */}
      {BARS.map((b, k) => <rect key={k} x={20 + k * 22} y={96 - b * 0.9} width={14} height={b * 0.9} rx={2} fill={k === 3 ? SC.brand : SC.line} />)}
      {g('chart')
        ? <g>{BARS.map((b, k) => <text key={k} x={27 + k * 22} y={92 - b * 0.9} textAnchor="middle" fontSize={8} fontWeight={800} fill={SC.text}>{b}</text>)}<text x={116} y={70} fontSize={11} fontWeight={900} fill={SC.text}>Today</text><text x={116} y={90} fontSize={18} fontWeight={900} fill={SC.text}>47</text></g>
        : <text x={116} y={86} fontSize={6.5} fontWeight={700} fill={SC.muted}>hover for totals</text>}
      {/* rows */}
      {ROWS.map((r, k) => {
        const ry = 108 + k * 56;
        return (
          <g key={r}>
            <rect x={10} y={ry} width={PHONE_W - 20} height={50} rx={10} fill={SC.surface} stroke={SC.line} />
            {!g('checkbox') && <rect x={18} y={ry + 21} width={8} height={8} rx={1.5} fill={SC.surface} stroke={SC.muted} {...hi('checkbox')} />}
            <text x={g('checkbox') ? 18 : 32} y={ry + 21} fontSize={10.5} fontWeight={800} fill={SC.text}>{r}</text>
            <path d={`M${g('checkbox') ? 18 : 32} ${ry + 40} q 5 -11 11 -9 q -2 8 -11 9 z`} fill={SC.mint} />
            {g('tooltip') && <text x={(g('checkbox') ? 18 : 32) + 15} y={ry + 39} fontSize={9.5} fontWeight={800} fill={SC.text} textDecoration={glow === 'tooltip' ? 'underline' : undefined}>Organic</text>}
            {g('checkbox') && <g><rect x={98} y={ry + 26} width={58} height={20} rx={6} fill={SC.brand} {...hi('checkbox')} /><text x={127} y={ry + 40} textAnchor="middle" fontSize={9.5} fontWeight={800} fill="#fff">Packed</text></g>}
            {menu && <text x={172} y={ry + 22} fontSize={14} fontWeight={900} fill={SC.text}>⋯</text>}
          </g>
        );
      })}
      {menu && (
        <g transform="translate(96 126)">
          <rect width={86} height={(g('rowhover') ? 2 : 0) * 22 + (g('rightclick') ? 22 : 0) + 8} rx={8} fill={SC.surface} stroke={glow === 'rowhover' || glow === 'rightclick' ? SC.mint : SC.line} strokeWidth={2} />
          {[...(g('rowhover') ? ['Edit', 'Delete'] : []), ...(g('rightclick') ? ['Reassign'] : [])].map((m, k) => <text key={m} x={12} y={20 + k * 22} fontSize={10.5} fontWeight={800} fill={m === 'Delete' ? SC.error : SC.text}>{m}</text>)}
        </g>
      )}
      {/* order details: a sliver of side panel, or a bottom sheet */}
      {g('panel')
        ? <g><rect x={6} y={274} width={PHONE_W - 12} height={g('toolbar') ? 66 : 120} rx={16} fill={SC.soft} {...hi('panel')} /><rect x={86} y={280} width={28} height={4} rx={2} fill={SC.line} /><text x={18} y={302} fontSize={11} fontWeight={900} fill={SC.text}>Order #2041 · 4 items</text>
          {g('popover') ? ['Sat 14', 'Sun 15', 'Mon 16'].map((d, k) => <g key={d}><rect x={18 + k * 56} y={312} width={50} height={22} rx={11} fill={k === 0 ? SC.brand : SC.surface} stroke={glow === 'popover' ? SC.mint : SC.line} strokeWidth={glow === 'popover' ? 2.5 : 1} /><text x={43 + k * 56} y={327} textAnchor="middle" fontSize={9} fontWeight={800} fill={k === 0 ? '#fff' : SC.text}>{d}</text></g>) : <text x={18} y={322} fontSize={7} fontWeight={700} fill={SC.muted}>Deliver: Sat 14 Dec ▾</text>}</g>
        : <g><rect x={178} y={108} width={22} height={160} fill={SC.soft} stroke={SC.line} /><text x={182} y={124} fontSize={7} fontWeight={800} fill={SC.text}>Ord</text>
          {!g('popover') && <g><rect x={120} y={240} width={62} height={44} rx={4} fill={SC.surface} stroke={SC.line} /><text x={126} y={254} fontSize={6} fontWeight={700} fill={SC.muted}>1 2 3 4 5 6 7</text><text x={126} y={266} fontSize={6} fontWeight={700} fill={SC.muted}>8 9 10 11 12 13</text></g>}</g>}
      {!g('panel') && g('popover') && ['Sat 14', 'Sun 15', 'Mon 16'].map((d, k) => <g key={d}><rect x={18 + k * 56} y={282} width={50} height={22} rx={11} fill={k === 0 ? SC.brand : SC.surface} stroke={glow === 'popover' ? SC.mint : SC.line} strokeWidth={glow === 'popover' ? 2.5 : 1} /><text x={43 + k * 56} y={297} textAnchor="middle" fontSize={9} fontWeight={800} fill={k === 0 ? '#fff' : SC.text}>{d}</text></g>)}
    </g>
  );
}

const Thumb = ({ x, y, o }: { x: number; y: number; o: number }) => (
  <g opacity={o}><ellipse cx={x} cy={y} rx={22} ry={26} fill="#f5c9a8" stroke="#c2410c" strokeOpacity={0.4} strokeWidth={2} opacity={0.85} /><ellipse cx={x} cy={y - 8} rx={12} ry={10} fill="#fde2cf" opacity={0.8} /></g>
);
const PORT_AT: Record<PackingPart, number> = { toolbar: 22.4, checkbox: 23.2, rowhover: 24, rightclick: 24.8, panel: 27.2, popover: 28, tooltip: 28.8, chart: 29.6 };

export function TwoDevicesScene({ t }: { t: number }) {
  const ported = Object.fromEntries(Object.entries(PORT_AT).map(([k, a]) => [k, t >= a])) as Ported;
  const desk = 1 - p(t, 5.6, 6.4) + p(t, 30.6, 31.4);
  const phoneX = lerp(380, 600, p(t, 30.6, 31.4));
  const squeezed = t >= 6 && t < 22, zone = p(t, 18, 19) * (1 - p(t, 21.6, 22.2));
  const cur: [number, number] = [lerp(200, 250, p(t, 1, 2.4)), lerp(160, 108, p(t, 1, 2.4))];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a desktop dashboard built for a mouse breaks on a phone, then each interaction is ported for a thumb">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      {desk > 0 && (
        <g opacity={clamp(desk) * clamp(back(t / 0.6))}>
          <DeskDash x={t < 30 ? 250 : 40} y={t < 30 ? 90 : 120} scale={t < 30 ? 1 : 1.05} cursor={t < 6 ? cur : undefined} />
          <text x={t < 30 ? 480 : 280} y={t < 30 ? 410 : 450} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.muted}>{t < 30 ? 'Rekha’s desktop: hover, right-click, side panel' : 'Desktop: dense, for a mouse'}</text>
        </g>
      )}
      {t >= 6 && (
        <g opacity={p(t, 6, 6.8)}>
          {squeezed
            ? <g><rect x={380} y={70} width={PHONE_W} height={PHONE_H} rx={26} fill={SC.surface} stroke={SC.line} strokeWidth={2} /><DeskDash x={386} y={190} scale={(PHONE_W - 12) / DESK_W} /></g>
            : <PhoneDash ported={ported} x={phoneX} y={70} glow={Object.entries(PORT_AT).find(([, a]) => t >= a && t < a + 0.8)?.[0] as PackingPart | undefined} />}
          {t >= 30.6 && <text x={phoneX + 100} y={500} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 31, 31.6)}>Phone: big, low, for a thumb</text>}
          {/* the thumb zone */}
          {zone > 0 && (
            <g opacity={zone * 0.55}>
              <rect x={380} y={70} width={PHONE_W} height={130} rx={26} fill={SC.error} opacity={0.5} />
              <rect x={380} y={200} width={PHONE_W} height={110} fill="#F59E0B" opacity={0.45} />
              <rect x={380} y={310} width={PHONE_W} height={160} rx={26} fill={SC.mint} opacity={0.55} />
            </g>
          )}
          {/* thumb tries hover, then a tiny checkbox */}
          {t >= 10 && t < 18 && <Thumb x={t < 14 ? lerp(560, 470, p(t, 10.2, 11.4)) : lerp(560, 392, p(t, 14.2, 15.4))} y={t < 14 ? lerp(470, 225, p(t, 10.2, 11.4)) : lerp(470, 220, p(t, 14.2, 15.4))} o={p(t, 10, 10.4) * (1 - p(t, 17.4, 18))} />}
        </g>
      )}

      {/* captions on the right */}
      {t >= 10 && t < 22 && (
        <g transform="translate(630 120)">
          {[{ a: 10, b: 14, h: 'Where is Edit?', s: 'It only showed on hover. A finger can’t hover.' }, { a: 14, b: 18, h: 'Wrong order ticked', s: 'A 20 px checkbox, a crate in the other hand.' }, { a: 18, b: 22, h: 'Where a thumb reaches', s: 'Bottom: easy. Middle: OK. Top: a stretch.' }].map(c => t >= c.a && t < c.b && (
            <g key={c.a} opacity={p(t, c.a + 0.4, c.a + 0.9) * (1 - p(t, c.b - 0.4, c.b))}>
              <rect width={300} height={90} rx={16} fill={SC.surface} stroke={c.a === 18 ? SC.mint : SC.error} strokeWidth={2} />
              <text x={20} y={36} fontSize={18} fontWeight={900} fill={SC.text}>{c.h}</text>
              <text x={20} y={64} fontSize={13} fontWeight={700} fill={SC.muted}>{c.s}</text>
            </g>
          ))}
        </g>
      )}
      {t >= 22 && t < 30.6 && (
        <g transform="translate(630 110)" opacity={1 - p(t, 30, 30.6)}>
          <text fontSize={20} fontWeight={900} fill={SC.text}>Port the interaction</text>
          {[['Top toolbar', 'Bottom tabs', 22.4], ['20 px checkbox', '“Packed” button', 23.2], ['Hover, right-click', '⋯ menu', 24], ['Side panel, popover', 'Bottom sheet', 27.2], ['Tooltip, hover chart', 'Words on screen', 28.8]].map(([a, b, at], k) => (
            <g key={a as string} transform={`translate(0 ${36 + k * 50})`} opacity={p(t, at as number, (at as number) + 0.5)}>
              <text fontSize={13} fontWeight={700} fill={SC.muted}>{a as string}</text>
              <text y={20} fontSize={15} fontWeight={900} fill={SC.text}><tspan fill={SC.mint}>→ </tspan>{b as string}</text>
            </g>
          ))}
        </g>
      )}
      {t >= 31.4 && <text x={480} y={60} textAnchor="middle" fontSize={22} fontWeight={900} fill={SC.text} opacity={p(t, 31.6, 32.2)}>Same jobs, different hands.</text>}
    </svg>
  );
}
