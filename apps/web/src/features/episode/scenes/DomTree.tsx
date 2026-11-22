'use client';
// Scene for dc.1-1: a recipe page beside its DOM tree. The tree grows from html and body into header, nav, main and
// footer; then everything turns into anonymous divs and a screen reader hears a blur; landmarks come back and it can jump
// to the recipe; finally Tab lands on a real button but skips a clickable div. Pure function of t (0–34).
import { back, clamp, Grid, p, SC } from './shared';

const W = 960, H = 540;
/** Page regions: id, label, wireframe box (x, y, w, h), colour. Shared with the Tag the page game. */
export const REGIONS = [
  { id: 'header', y: 0, h: 44, c: SC.discover },
  { id: 'nav', y: 50, h: 30, c: SC.design },
  { id: 'main', y: 86, h: 170, c: SC.mint },
  { id: 'footer', y: 262, h: 38, c: SC.grow },
] as const;

/** A recipe page wireframe, 300 × 300, with optional highlighted region. */
export function PageWire({ lit, soup = 0 }: { lit?: string; soup?: number }) {
  return (
    <g>
      {REGIONS.map(r => (
        <g key={r.id}>
          <rect x={0} y={r.y} width={300} height={r.h} rx={8} fill={SC.surface} stroke={lit === r.id ? r.c : SC.line} strokeWidth={lit === r.id ? 3 : 1.5} />
          {r.id === 'header' && <g><rect x={10} y={12} width={28} height={20} rx={5} fill={SC.design} opacity={0.8} /><rect x={170} y={13} width={120} height={18} rx={9} fill={SC.line} /></g>}
          {r.id === 'nav' && [0, 1, 2].map(i => <rect key={i} x={10 + i * 70} y={60} width={56} height={10} rx={5} fill={SC.discover} opacity={0.6} />)}
          {r.id === 'main' && <g><rect x={10} y={96} width={160} height={14} rx={5} fill={SC.text} opacity={0.8} /><rect x={10} y={118} width={120} height={80} rx={8} fill="#f59e0b" opacity={0.6} /><rect x={140} y={120} width={150} height={8} rx={4} fill={SC.line} /><rect x={140} y={134} width={130} height={8} rx={4} fill={SC.line} /><rect x={140} y={148} width={140} height={8} rx={4} fill={SC.line} /><rect x={10} y={210} width={110} height={32} rx={8} fill="#2563eb" /><text x={65} y={231} textAnchor="middle" fontSize={11} fontWeight={800} fill="#fff">Save recipe</text></g>}
          {r.id === 'footer' && <rect x={10} y={276} width={180} height={8} rx={4} fill={SC.line} />}
          {soup > 0.5 && <text x={292} y={r.y + 14} textAnchor="end" fontSize={10} fontWeight={800} fill={SC.muted} fontFamily="ui-monospace, Consolas, monospace">div</text>}
        </g>
      ))}
    </g>
  );
}

const TREE = [
  { id: 'header', kids: ['logo', 'search'] },
  { id: 'nav', kids: ['a', 'a', 'a'] },
  { id: 'main', kids: ['h1', 'img', 'ol', 'button'] },
  { id: 'footer', kids: ['p'] },
];

export function DomTreeScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const grow = p(t, 5.2, 7.6);
  const soup = t >= 11 && t < 17 ? p(t, 11.2, 12) : 0;
  const PX = 70, PY = 120, TX = 470;
  const tag = (id: string) => (soup > 0.5 ? 'div' : id);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a page and its DOM tree, divs versus semantic landmarks">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        <g transform={`translate(${PX} ${PY})`} opacity={clamp(t / 0.5)}>
          <PageWire soup={soup} lit={t >= 17 && t < 23 ? 'main' : undefined} />
        </g>

        {/* the tree */}
        {t >= 5 && t < 23.4 && (
          <g opacity={grow * (1 - p(t, 22.8, 23.4))} fontFamily="ui-monospace, Consolas, monospace">
            {[{ l: 'html', y: 110 }, { l: 'body', y: 160 }].map(n => (
              <g key={n.l}><rect x={TX + 160} y={n.y - 16} width={80} height={30} rx={8} fill={SC.surface} stroke={SC.line} strokeWidth={2} /><text x={TX + 200} y={n.y + 4} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.text}>{n.l}</text></g>
            ))}
            <line x1={TX + 200} y1={124} x2={TX + 200} y2={144} stroke={SC.line} strokeWidth={2} />
            {TREE.map((n, i) => {
              const x = TX + 30 + i * 112, y = 240, r = REGIONS.find(q => q.id === n.id)!;
              const k = clamp((grow - i * 0.15) / 0.4);
              return (
                <g key={n.id} opacity={k}>
                  <path d={`M${TX + 200} 174 C ${TX + 200} 200, ${x + 40} 200, ${x + 40} ${y - 16}`} stroke={SC.line} strokeWidth={2} fill="none" />
                  <rect x={x} y={y - 16} width={80} height={30} rx={8} fill={soup > 0.5 ? SC.surface : r.c} stroke={soup > 0.5 ? SC.line : 'none'} strokeWidth={2} />
                  <text x={x + 40} y={y + 4} textAnchor="middle" fontSize={13} fontWeight={800} fill={soup > 0.5 ? SC.muted : '#fff'}>{tag(n.id)}</text>
                  {n.kids.map((kid, j) => (
                    <g key={j}>
                      <line x1={x + 40} y1={y + 14} x2={x + 40} y2={y + 34 + j * 30} stroke={SC.line} strokeWidth={1.5} />
                      <rect x={x + 8} y={y + 26 + j * 30} width={64} height={22} rx={6} fill={SC.surface} stroke={SC.line} />
                      <text x={x + 40} y={y + 41 + j * 30} textAnchor="middle" fontSize={11} fontWeight={700} fill={SC.muted}>{soup > 0.5 ? 'div' : kid}</text>
                    </g>
                  ))}
                </g>
              );
            })}
          </g>
        )}

        {/* the screen reader */}
        {t >= 12.4 && t < 23 && (
          <g transform="translate(470 440)" opacity={clamp((t - 12.4) / 0.4)}>
            <rect width={420} height={46} rx={14} fill={t < 17 ? SC.error : SC.mint} />
            <text x={18} y={29} fontSize={14} fontWeight={800} fill="#fff">{t < 17 ? '🔊 “group, group, group, clickable, group…”' : '🔊 “Main landmark: Dal makhani recipe”'}</text>
          </g>
        )}

        {/* Tab: button vs div */}
        {t >= 23 && t < 29.4 && (
          <g opacity={clamp((t - 23) / 0.5)}>
            {[{ y: 180, l: '<button>Save recipe</button>', ok: true }, { y: 300, l: '<div onclick>Save recipe</div>', ok: false }].map((b, i) => {
              const focused = b.ok && t >= 24.2 && t < 29;
              return (
                <g key={b.l} transform={`translate(470 ${b.y})`}>
                  <text x={0} y={-16} fontSize={13} fontWeight={800} fill={SC.muted} fontFamily="ui-monospace, Consolas, monospace">{b.l}</text>
                  <rect width={180} height={50} rx={12} fill="#2563eb" />
                  {focused && <rect x={-5} y={-5} width={190} height={60} rx={15} fill="none" stroke={SC.mint} strokeWidth={4} />}
                  <text x={90} y={31} textAnchor="middle" fontSize={15} fontWeight={800} fill="#fff">Save recipe</text>
                  <text x={200} y={31} fontSize={14} fontWeight={800} fill={b.ok ? SC.mint : SC.error} opacity={clamp((t - 24.6 - i * 0.6) / 0.4)}>{b.ok ? 'Tab reaches it, Enter presses it' : 'Tab skips it entirely'}</text>
                </g>
              );
            })}
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Pages are trees', l: 'HTML → the DOM', c: SC.discover }, { x: 480, n: 'Meaning, not looks', l: 'header · nav · main · button', c: SC.design }, { x: 760, n: 'Free accessibility', l: 'Native elements just work', c: SC.mint }].map((f, i) => {
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
