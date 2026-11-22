'use client';
// Scene for ds.1-1: atoms (icon, label, input, button) snap into molecules (a search bar, a form field), molecules into an
// organism (a header), organisms into a template with placeholders, and the template fills with real content as a page.
// Pure function of t (0–34).
import { MagnifyingGlassIcon, StarIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
const BLUE = '#2563eb', GREY = 'var(--color-bg-quaternary)';

/** A small wireframe of a UI part, drawn in a 160 × 100 box. Shared with the Stack the parts game. */
export function PartArt({ visual }: { visual?: string }) {
  const bar = (x: number, y: number, w: number, h = 8, fill: string = SC.muted) => <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} opacity={fill === SC.muted ? 0.55 : 1} />;
  const input = (x: number, y: number, w: number) => <rect x={x} y={y} width={w} height={24} rx={6} fill={SC.surface} stroke={SC.muted} strokeWidth={1.5} />;
  const btn = (x: number, y: number, w = 56, label = 'Go') => (
    <g><rect x={x} y={y} width={w} height={24} rx={6} fill={BLUE} /><text x={x + w / 2} y={y + 16} textAnchor="middle" fontSize={11} fontWeight={800} fill="#fff">{label}</text></g>
  );
  switch (visual) {
    case 'icon': return <StarIcon x={56} y={26} width={48} height={48} color={SC.design} weight="fill" />;
    case 'label': return <text x={80} y={58} textAnchor="middle" fontSize={20} fontWeight={700} fill={SC.text}>Label</text>;
    case 'input': return input(30, 38, 100);
    case 'button': return btn(40, 38, 80, 'Button');
    case 'search': return <g>{input(14, 38, 96)}<MagnifyingGlassIcon x={20} y={43} width={14} height={14} color={SC.muted} />{btn(114, 38, 34, 'Go')}</g>;
    case 'field': return <g>{bar(24, 22, 40, 8, SC.text)}{input(24, 38, 112)}{bar(24, 70, 80, 6)}</g>;
    case 'avatar': return <g><circle cx={46} cy={50} r={18} fill={SC.discover} opacity={0.8} />{bar(72, 40, 60, 9, SC.text)}{bar(72, 56, 44, 7)}</g>;
    case 'header': return <g><rect x={6} y={30} width={148} height={40} rx={8} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} /><rect x={14} y={40} width={20} height={20} rx={5} fill={SC.design} />{[42, 62, 82].map(x => <g key={x}>{bar(x, 46, 16, 6)}</g>)}{input(102, 38, 46)}</g>;
    case 'grid': return <g>{[0, 1, 2].flatMap(c => [0, 1].map(r => <g key={`${c}${r}`}><rect x={14 + c * 46} y={14 + r * 38} width={40} height={32} rx={6} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} /><rect x={18 + c * 46} y={18 + r * 38} width={32} height={12} rx={3} fill={SC.discover} opacity={0.5} /></g>))}</g>;
    case 'layout': return <g><rect x={14} y={8} width={132} height={14} rx={4} fill={GREY} /><rect x={14} y={28} width={80} height={48} rx={6} fill={GREY} /><rect x={100} y={28} width={46} height={22} rx={4} fill={GREY} /><rect x={100} y={54} width={46} height={22} rx={4} fill={GREY} /><rect x={14} y={82} width={132} height={10} rx={4} fill={GREY} /></g>;
    case 'checkout': return <g>{[{ x: 14, y: 10, w: 84, h: 80, n: 'form' }, { x: 104, y: 10, w: 42, h: 50, n: 'summary' }, { x: 104, y: 66, w: 42, h: 24, n: 'button' }].map(s => <g key={s.n}><rect x={s.x} y={s.y} width={s.w} height={s.h} rx={6} fill="none" stroke={SC.muted} strokeWidth={1.5} strokeDasharray="5 4" /><text x={s.x + s.w / 2} y={s.y + s.h / 2 + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill={SC.muted}>{s.n}</text></g>)}</g>;
    default: return null;
  }
}

/** A part at (x, y), scaled. */
const Part = ({ v, x, y, s = 1, o = 1 }: { v: string; x: number; y: number; s?: number; o?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}><PartArt visual={v} /></g>
);

const LEVELS = ['Atoms', 'Molecules', 'Organisms', 'Templates', 'Pages'];

export function AtomicScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const level = t < 6 ? 0 : t < 12 ? 1 : t < 18 ? 2 : t < 24 ? 3 : 4;
  const fill = p(t, 24.4, 26);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: atoms combine into molecules, organisms, templates and pages">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {/* the level ladder */}
        <g>
          {LEVELS.map((n, i) => (
            <g key={n} transform={`translate(${120 + i * 180} 70)`}>
              <rect x={-70} y={-18} width={140} height={36} rx={18} fill={i === level ? SC.discover : SC.surface} stroke={i <= level ? SC.discover : SC.line} strokeWidth={2} />
              <text y={6} textAnchor="middle" fontSize={15} fontWeight={800} fill={i === level ? '#fff' : i < level ? SC.discover : SC.muted}>{n}</text>
            </g>
          ))}
        </g>

        {/* atoms → molecules */}
        {t < 12.4 && (
          <g opacity={1 - p(t, 11.8, 12.4)}>
            {[{ v: 'icon', a: [120, 220], b: [80, 360] }, { v: 'label', a: [300, 220], b: [560, 250] }, { v: 'input', a: [480, 220], b: [170, 250] }, { v: 'button', a: [660, 220], b: [300, 250] }].map((pt, i) => {
              const k = p(t, 6.4, 7.8);
              return <Part key={pt.v} v={pt.v} x={lerp(pt.a[0], pt.b[0], k)} y={lerp(pt.a[1], pt.b[1], k)} s={1.4 * clamp(back((t - 0.4 - i * 0.3) / 0.5))} o={pt.v === 'icon' ? 1 - k : 1 - p(t, 7.8, 8.4)} />;
            })}
            {t >= 7.8 && (
              <g opacity={clamp((t - 7.8) / 0.5)}>
                <Part v="search" x={150} y={240} s={1.8} />
                <Part v="field" x={540} y={240} s={1.8} />
                <text x={294} y={450} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.mint}>input + button = search bar</text>
                <text x={684} y={450} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.mint}>label + input + help = field</text>
              </g>
            )}
          </g>
        )}

        {/* organism */}
        {t >= 12 && t < 18.4 && (
          <g opacity={clamp((t - 12) / 0.5) * (1 - p(t, 17.8, 18.4))}>
            <g transform={`translate(160 180) scale(${lerp(0.6, 1, clamp(back((t - 12.2) / 0.6)))})`}>
              <rect width={640} height={110} rx={20} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <rect x={28} y={30} width={50} height={50} rx={12} fill={SC.design} />
              {['Menu', 'Offers', 'Orders'].map((n, i) => <text key={n} x={110 + i * 90} y={62} fontSize={18} fontWeight={700} fill={SC.text}>{n}</text>)}
              <Part v="search" x={390} y={-5} s={1.5} />
            </g>
            <text x={480} y={350} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.mint} opacity={clamp((t - 13.4) / 0.4)}>Logo + navigation + search bar = header</text>
          </g>
        )}

        {/* template → page */}
        {t >= 18 && t < 29.4 && (
          <g opacity={clamp((t - 18) / 0.5)}>
            <rect x={230} y={110} width={500} height={390} rx={22} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            <rect x={254} y={130} width={452} height={46} rx={10} fill={fill > 0.5 ? SC.surface : GREY} stroke={SC.line} />
            {fill > 0.5 && <g><rect x={266} y={140} width={26} height={26} rx={7} fill={SC.design} /><text x={306} y={159} fontSize={14} fontWeight={700} fill={SC.text}>Menu   Offers   Orders</text></g>}
            <rect x={254} y={192} width={270} height={150} rx={12} fill={fill > 0.5 ? 'url(#atomic-hero)' : GREY} />
            {fill > 0.5 && <text x={274} y={322} fontSize={22} fontWeight={800} fill="#fff">Paneer tikka thali</text>}
            {[0, 1].map(i => (
              <g key={i}>
                <rect x={540} y={192 + i * 78} width={166} height={70} rx={10} fill={fill > 0.5 ? SC.soft : GREY} />
                {fill > 0.5 && <><text x={556} y={222 + i * 78} fontSize={14} fontWeight={800} fill={SC.text}>{['Dal makhani', 'Veg biryani'][i]}</text><text x={556} y={244 + i * 78} fontSize={13} fill={SC.muted}>{['₹220', '₹260'][i]}</text></>}
              </g>
            ))}
            <rect x={254} y={358} width={452} height={56} rx={12} fill={fill > 0.5 ? BLUE : GREY} />
            {fill > 0.5 && <text x={480} y={392} textAnchor="middle" fontSize={17} fontWeight={800} fill="#fff">Add to cart · ₹340</text>}
            <defs><linearGradient id="atomic-hero" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f59e0b" /><stop offset="1" stopColor="#dc2626" /></linearGradient></defs>
            <text x={480} y={460} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.mint}>{fill > 0.5 ? 'Same layout, real content: a page' : 'Organisms in a layout, grey placeholders: a template'}</text>
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Five levels', l: 'Atom → page', c: SC.discover }, { x: 480, n: 'Fix it low', l: 'Change an atom, update everywhere', c: SC.design }, { x: 760, n: 'Test with pages', l: 'Real content finds the gaps', c: SC.mint }].map((f, i) => {
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
