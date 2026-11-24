'use client';
// Scene for ia.3-1: Zoya's first Khelo turf list looks finished (brand green, sunset photos, a glossy Book button) but
// its words are placeholders. Review comments pile up about the paint and question marks hang over ₹XXX. Then the polish
// turns to grey boxes, the placeholders turn into real names, prices and sports, and the comments change to structure.
// Ends on the rule: looks low, words real. `KheloList` (each part drafted or fixed) is shared with the Plainer or realer?
// game. Pure function of t (0–34).
import type { KheloPart } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
/** The drafted polish: a dark brand green that carries white text at better than 4.5:1. */
const GREEN = '#157A3F', GREEN_DARK = '#0E5A2D';

/** Where each part sits on the 240 × 470 phone (for focus rings and comment pointers). */
export const KHELO_BOX: Record<KheloPart, [number, number, number, number]> = {
  logo: [16, 20, 72, 24], search: [16, 56, 208, 32], tabs: [16, 98, 208, 28],
  photo: [24, 144, 192, 78], name: [24, 228, 192, 34], rating: [24, 259, 110, 15], price: [24, 296, 100, 19], button: [132, 290, 80, 26],
};

const CARDS = [
  { y: 136, h: 190, photoH: 78, name: ['Smash Arena, HSR Layout', 'Sector 2'], rating: '4.6 · 212 reviews', price: '₹1,200 / hour' },
  { y: 338, h: 124, photoH: 44, name: ['Goal Box, Agara', ''], rating: '4.3 · 88 reviews', price: '₹1,000 / hour' },
];

function Photo({ x, y, w, h, fixed }: { x: number; y: number; w: number; h: number; fixed: boolean }) {
  if (fixed) return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={SC.soft} stroke={SC.line} strokeWidth={1.5} />
      <line x1={x} y1={y} x2={x + w} y2={y + h} stroke={SC.line} strokeWidth={1.5} /><line x1={x + w} y1={y} x2={x} y2={y + h} stroke={SC.line} strokeWidth={1.5} />
    </g>
  );
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="#F4A259" />
      <rect x={x} y={y} width={w} height={h * 0.45} rx={6} fill="#E76F51" />
      <circle cx={x + w * 0.7} cy={y + h * 0.5} r={h * 0.18} fill="#FFD166" />
      <rect x={x} y={y + h * 0.62} width={w} height={h * 0.38} fill="#2D6A4F" />
      <line x1={x + w / 2} y1={y + h * 0.62} x2={x + w / 2} y2={y + h} stroke="#fff" strokeOpacity={0.7} strokeWidth={1.5} />
    </g>
  );
}

/** The Khelo turf list as a phone wireframe. Each part is drawn as Zoya drafted it, or fixed (plain looks, real words). */
export function KheloList({ fixed, focus, x = 0, y = 0, scale = 1 }: { fixed: Partial<Record<KheloPart, boolean>>; focus?: KheloPart; x?: number; y?: number; scale?: number }) {
  const f = (k: KheloPart) => !!fixed[k];
  const tabs = f('tabs') ? ['Football', 'Cricket', 'Pickleball'] : ['Tab 1', 'Tab 2', 'Tab 3'];
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect width={240} height={470} rx={28} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
      {/* logo */}
      {f('logo')
        ? <g><rect x={16} y={20} width={72} height={24} rx={4} fill={SC.soft} stroke={SC.line} strokeWidth={1.5} /><text x={52} y={36} textAnchor="middle" fontSize={11} fontWeight={700} fill={SC.muted}>Logo</text></g>
        : <g><rect x={16} y={20} width={72} height={24} rx={12} fill={GREEN} /><text x={52} y={37} textAnchor="middle" fontSize={14} fontWeight={900} fontStyle="italic" fill="#fff">khelo</text></g>}
      <circle cx={212} cy={32} r={11} fill={SC.soft} stroke={SC.line} strokeWidth={1.5} />
      {/* search */}
      <rect x={16} y={56} width={208} height={32} rx={8} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
      <circle cx={32} cy={72} r={5} fill="none" stroke={SC.muted} strokeWidth={1.5} />
      <text x={44} y={76} fontSize={11.5} fontWeight={600} fill={SC.muted}>Search turfs in HSR Layout</text>
      {/* tabs */}
      {tabs.map((tb, k) => <text key={tb} x={16 + k * 72} y={116} fontSize={12} fontWeight={k === 0 ? 800 : 600} fill={k === 0 ? SC.text : SC.muted}>{tb}</text>)}
      <rect x={16} y={122} width={f('tabs') ? 56 : 34} height={2.5} fill={SC.text} />
      <line x1={16} x2={224} y1={126} y2={126} stroke={SC.line} />
      {/* cards */}
      {CARDS.map((c, k) => {
        const ph = c.y + 8, ny = ph + c.photoH + 18, two = f('name') && c.name[1];
        const ry = ny + (two ? 30 : 16), py = c.y + c.h - 16, by = c.y + c.h - 36;
        return (
          <g key={k}>
            <rect x={16} y={c.y} width={208} height={c.h} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
            <Photo x={24} y={ph} w={192} h={c.photoH} fixed={f('photo')} />
            {f('name')
              ? <g><text x={24} y={ny} fontSize={13} fontWeight={800} fill={SC.text}>{c.name[0]}</text>{c.name[1] && <text x={24} y={ny + 15} fontSize={13} fontWeight={800} fill={SC.text}>{c.name[1]}</text>}</g>
              : <text x={24} y={ny} fontSize={13} fontWeight={800} fill={SC.text}>Lorem ipsum dolor</text>}
            <text x={24} y={Math.min(ry, py - 18)} fontSize={11} fontWeight={600} fill={SC.muted}>{c.rating}</text>
            <text x={24} y={py} fontSize={13} fontWeight={800} fill={SC.text}>{f('price') ? c.price : '₹XXX'}</text>
            {f('button')
              ? <g><rect x={132} y={by} width={80} height={26} rx={6} fill={SC.surface} stroke={SC.text} strokeWidth={1.5} /><text x={172} y={by + 17} textAnchor="middle" fontSize={11} fontWeight={800} fill={SC.text}>Book a slot</text></g>
              : <g><rect x={134} y={by + 3} width={80} height={26} rx={13} fill={GREEN_DARK} opacity={0.5} /><rect x={132} y={by} width={80} height={26} rx={13} fill={GREEN} /><rect x={140} y={by + 3} width={64} height={7} rx={3.5} fill="#fff" opacity={0.25} /><text x={172} y={by + 18} textAnchor="middle" fontSize={11} fontWeight={900} fill="#fff">BOOK NOW</text></g>}
          </g>
        );
      })}
      {focus && (() => { const [bx, by, bw, bh] = KHELO_BOX[focus]; return <rect x={bx - 5} y={by - 5} width={bw + 10} height={bh + 10} rx={8} fill="none" stroke={SC.brand} strokeWidth={2.5} strokeDasharray="6 4" />; })()}
    </g>
  );
}

const PX = 150, PY = 36;   // the phone on the stage
const FLIP: Record<KheloPart, number> = { logo: 16.6, photo: 17.6, button: 18.6, tabs: 21.6, name: 22.6, price: 23.6, search: 99, rating: 99 };
const PAINT = [
  { who: 'Neha, founder', say: 'Can the green be brighter?', part: 'logo' as KheloPart, at: 5.4 },
  { who: 'Arjun, PM', say: 'That photo isn’t even our turf.', part: 'photo' as KheloPart, at: 6.8 },
  { who: 'Neha', say: 'The shadow on Book looks dated.', part: 'button' as KheloPart, at: 8.2 },
];
const STRUCT = [
  { who: 'Arjun', say: 'Where do I pick a time?', at: 26.4 },
  { who: 'Neha', say: 'Can I filter to 5-a-side?', at: 27.4 },
  { who: 'Arjun', say: 'Two lines for the name is fine.', at: 28.4 },
];

function Bubble({ x, y, who, say, tone, o }: { x: number; y: number; who: string; say: string; tone: string; o: number }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <rect width={330} height={54} rx={14} fill={SC.surface} stroke={tone} strokeWidth={2} />
      <text x={16} y={21} fontSize={12} fontWeight={800} fill={SC.muted}>{who}</text>
      <text x={16} y={41} fontSize={15} fontWeight={700} fill={SC.text}>{say}</text>
    </g>
  );
}

export function StayUglyScene({ t }: { t: number }) {
  const fixed = Object.fromEntries(Object.entries(FLIP).map(([k, at]) => [k, t >= at])) as Record<KheloPart, boolean>;
  const paintOut = 1 - p(t, 15.6, 16.4), clock = p(t, 9.4, 10), qs = p(t, 11, 11.6) * (1 - p(t, 21, 21.6));
  const rule = p(t, 30, 30.6);
  const box = (k: KheloPart) => { const [bx, by, bw, bh] = KHELO_BOX[k]; return { x: PX + bx + bw, y: PY + by + bh / 2 }; };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a polished wireframe draws comments about colour and photos, then plain grey boxes with real names and prices draw comments about structure">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={clamp(back(t / 0.6))}>
        <KheloList fixed={fixed} x={PX} y={PY} />
      </g>
      <text x={PX + 120} y={PY - 10} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.muted}>{t < 16 ? 'DRAFT 1 · LOOKS FINISHED' : t < 26 ? 'DRAFT 2 · WORK IN PROGRESS' : 'DRAFT 2 · IN REVIEW'}</text>

      {/* comments about the paint */}
      {paintOut > 0 && PAINT.map((c, k) => {
        const o = p(t, c.at, c.at + 0.5) * paintOut, b = box(c.part), by = 70 + k * 72;
        return (
          <g key={c.say} opacity={o}>
            <line x1={b.x + 4} y1={b.y} x2={500} y2={by + 27} stroke={SC.error} strokeWidth={1.5} strokeDasharray="4 4" />
            <Bubble x={500} y={by} who={c.who} say={c.say} tone={SC.error} o={1} />
          </g>
        );
      })}
      {clock > 0 && paintOut > 0 && (
        <g opacity={clock * paintOut} transform="translate(500 296)">
          <rect width={330} height={40} rx={20} fill={SC.error} />
          <text x={165} y={26} textAnchor="middle" fontSize={15} fontWeight={800} fill="#fff">20 minutes, all on looks</text>
        </g>
      )}
      {/* question marks over the placeholders */}
      {qs > 0 && (['name', 'price', 'tabs'] as KheloPart[]).map((k, j) => {
        const [bx, by] = KHELO_BOX[k];
        return (
          <g key={k} opacity={qs * p(t, 11 + j * 0.4, 11.5 + j * 0.4)} transform={`translate(${PX + bx - 30} ${PY + by + 14})`}>
            <circle r={13} fill={SC.brand} /><text y={5} textAnchor="middle" fontSize={16} fontWeight={900} fill="#fff">?</text>
          </g>
        );
      })}
      {t >= 11 && t < 16 && (
        <g opacity={p(t, 11.8, 12.4) * paintOut} transform="translate(500 356)">
          <text fontSize={15} fontWeight={700} fill={SC.text}>Is ₹XXX per hour or per person?</text>
          <text y={26} fontSize={15} fontWeight={700} fill={SC.text}>Does a real turf name fit on one line?</text>
          <text y={52} fontSize={14} fontWeight={700} fill={SC.muted}>Nobody can tell from this draft.</text>
        </g>
      )}

      {/* the two moves */}
      {t >= 16 && t < 30 && (
        <g transform="translate(500 80)" opacity={1 - p(t, 25.6, 26.2)}>
          {[{ at: 16, n: 'Make it plainer', d: 'Logo, photos, Book button → grey boxes', parts: ['logo', 'photo', 'button'] }, { at: 21, n: 'Make it realer', d: 'Lorem, ₹XXX, Tab 1 → real names, prices, sports', parts: ['tabs', 'name', 'price'] }].map((m, k) => (
            <g key={m.n} transform={`translate(0 ${k * 150})`} opacity={p(t, m.at, m.at + 0.5)}>
              <rect width={360} height={124} rx={16} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
              <text x={20} y={34} fontSize={19} fontWeight={900} fill={SC.text}>{m.n}</text>
              <text x={20} y={60} fontSize={13.5} fontWeight={600} fill={SC.muted}>{m.d}</text>
              {m.parts.map((part, j) => {
                const done = fixed[part as KheloPart];
                return (
                  <g key={part} transform={`translate(${20 + j * 110} 78)`}>
                    <rect width={98} height={30} rx={15} fill={done ? SC.mint : SC.soft} fillOpacity={done ? 0.2 : 1} stroke={done ? SC.mint : SC.line} />
                    <text x={49} y={20} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.text}>{done ? '✓ ' : ''}{part}</text>
                  </g>
                );
              })}
            </g>
          ))}
        </g>
      )}

      {/* comments about structure */}
      {t >= 26 && STRUCT.map((c, k) => (
        <Bubble key={c.say} x={500} y={70 + k * 72} who={c.who} say={c.say} tone={SC.mint} o={p(t, c.at, c.at + 0.5) * (1 - rule * 0.6)} />
      ))}

      {/* the rule */}
      {rule > 0 && (
        <g opacity={rule} transform={`translate(500 ${lerp(320, 300, rule)})`}>
          <rect width={380} height={150} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
          {[{ n: 'Looks', v: 0.18, w: 'low' }, { n: 'Words', v: 0.95, w: 'real' }].map((r, k) => (
            <g key={r.n} transform={`translate(24 ${40 + k * 52})`}>
              <text fontSize={16} fontWeight={900} fill={SC.text}>{r.n}</text>
              <rect x={80} y={-10} width={200} height={8} rx={4} fill={SC.soft} stroke={SC.line} />
              <rect x={80} y={-10} width={200 * r.v * p(t, 30.4 + k * 0.4, 31.2 + k * 0.4)} height={8} rx={4} fill={SC.brand} />
              <text x={296} y={0} fontSize={15} fontWeight={800} fill={SC.muted}>{r.w}</text>
            </g>
          ))}
          <text x={24} y={134} fontSize={13.5} fontWeight={700} fill={SC.muted} opacity={p(t, 31.6, 32.2)}>Polish goes up once the structure stops changing.</text>
        </g>
      )}
    </svg>
  );
}
