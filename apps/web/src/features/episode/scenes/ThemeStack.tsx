'use client';
// Scene for ds.5-1: Rasta has bought Sawari, a premium coach brand. Copying the library would fork it; instead the
// brand becomes a layer of tokens. Components read semantic tokens, each brand gives them values, and two brands in
// light and dark make four themes (`BRAND_THEMES`). Then what a brand may set and what stays shared, the contrast check
// that tunes plum-700 to plum-800 on gold (`tuneCheck`), and Sawari's 38 tokens of 412. Pure function of t (0–36).
// Also exports `CALL_FILL` and `ThemeCard`, which `brand-tune` uses.
import {
  BRAND_IDS, BRAND_MODES, BRAND_THEMES, SAWARI_OVERRIDES, SAWARI_RAMPS, SAWARI_REQUESTS, SYSTEM_TOKENS, sawariHex, tuneCheck,
  type BrandCall, type BrandTheme,
} from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per brand call; white text on each passes 4.5:1. */
export const CALL_FILL: Record<BrandCall, string> = { theme: '#6941C6', tune: '#B54708', shared: '#475467' };
const SERIF = 'Georgia, "Times New Roman", serif';
const SANS = 'inherit';
const NAME = { rasta: 'Rasta', sawari: 'Sawari' } as const;

/** A small app card in one theme: a heading in the theme's display face and a primary button. */
export function ThemeCard({ x, y, w, h, theme, title, label, o = 1 }: { x: number; y: number; w: number; h: number; theme: BrandTheme; title: string; label: string; o?: number }) {
  return (
    <g opacity={o}>
      <rect x={x} y={y} width={w} height={h} rx={theme.radius + 4} fill={theme.surface} stroke={SC.line} strokeWidth={2} />
      <rect x={x} y={y} width={w} height={6} rx={3} fill={theme.accent} />
      <text x={x + 16} y={y + 40} fontSize={22} fontWeight={800} fontFamily={theme.display === 'serif' ? SERIF : SANS} fill={theme.text}>{title}</text>
      <rect x={x + 16} y={y + h - 58} width={w - 32} height={42} rx={theme.radius} fill={theme.actionPrimary} />
      <text x={x + w / 2} y={y + h - 30} fontSize={21} fontWeight={800} fill={theme.onAction} textAnchor="middle">{label}</text>
    </g>
  );
}

export function ThemeStackScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'A second brand' : t < 11 ? 'The fork' : t < 16 ? 'Brand is a layer' : t < 21 ? 'Two brands, two modes' : t < 26 ? 'What a brand can turn' : t < 31 ? 'Every theme is checked' : `${SAWARI_OVERRIDES} of ${SYSTEM_TOKENS}`;
  const gold = SAWARI_REQUESTS.goldLabel.tune!;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Rasta has bought Sawari, a premium coach brand with plum and gold colours and serif headings. Copying the component library would make two Buttons and two sets of bugs. Instead the brand becomes a layer: components read semantic tokens, and each brand gives them values. Rasta and Sawari in light and dark make four themes from one set of components. A brand can set colour roles, the heading face, radius, motion and icon stroke, but not error colours, tap targets, focus rings or the component API. The build checks every theme: plum-700 on gold-400 fails at 4.25 to 1, and plum-800 passes at 5.4 to 1. Sawari sets ${SAWARI_OVERRIDES} of ${SYSTEM_TOKENS} tokens, and a focus-ring fix reaches both apps in one release.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            <ThemeCard x={32} y={80} w={272} h={170} theme={BRAND_THEMES.rasta.light} title="Rasta" label="Renew pass" o={p(t, 0.3, 1)} />
            <ThemeCard x={336} y={80} w={272} h={170} theme={BRAND_THEMES.sawari.light} title="Sawari" label="Book seat" o={p(t, 1, 1.7)} />
            <text x={168} y={290} fontSize={21} fontWeight={700} fill={SC.muted} textAnchor="middle" opacity={p(t, 1.6, 2.2)}>Bus, metro, rail passes</text>
            <text x={472} y={290} fontSize={21} fontWeight={700} fill={SC.muted} textAnchor="middle" opacity={p(t, 2, 2.6)}>Coaches on 11 routes</text>
            <text x={320} y={330} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="middle" opacity={p(t, 3, 3.6)}>Two quarters to share one system</text>
          </g>
        )}

        {t >= 6 && t < 11 && (() => {
          const split = p(t, 6.4, 8);
          return (
            <g>
              {(['rasta', 'sawari'] as const).map((b, i) => {
                const x = lerp(234, i ? 352 : 116, split);
                const th = BRAND_THEMES[b].light;
                return (
                  <g key={b}>
                    <rect x={x} y={76} width={172} height={176} rx={12} fill={SC.surface} stroke={i ? th.actionPrimary : SC.line} strokeWidth={2} />
                    <text x={x + 86} y={108} fontSize={21} fontWeight={900} fill={SC.text} textAnchor="middle">{NAME[b]} library</text>
                    {['Button', 'Card', 'Input'].map((c, j) => (
                      <g key={c}>
                        <rect x={x + 16} y={124 + j * 40} width={140} height={30} rx={6} fill={th.actionPrimary} opacity={0.9} />
                        <text x={x + 86} y={146 + j * 40} fontSize={21} fontWeight={800} fill={th.onAction} textAnchor="middle">{i ? `${c} copy` : c}</text>
                      </g>
                    ))}
                  </g>
                );
              })}
              <g opacity={p(t, 8.4, 9)}>
                <text x={320} y={292} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="middle">Focus-ring fix: lands in 1 of 2</text>
                <text x={320} y={324} fontSize={21} fontWeight={700} fill={SC.error} textAnchor="middle">Every bug, twice. Drift by August.</text>
              </g>
            </g>
          );
        })()}

        {t >= 11 && t < 16 && (
          <g>
            {[
              { s: 'Components: Button, Card, Sheet', c: SC.surface, k: 'read' },
              { s: 'Semantic: color-action-primary', c: SC.surface, k: 'name' },
              { s: '', c: SC.surface, k: 'brand' },
              { s: 'Primitives: teal, plum, gold ramps', c: SC.surface, k: 'raw' },
            ].map((row, i) => (
              <g key={row.k} opacity={p(t, 11.2 + i * 0.5, 11.8 + i * 0.5)}>
                <rect x={32} y={68 + i * 70} width={576} height={56} rx={10} fill={row.c} stroke={row.k === 'brand' ? CALL_FILL.theme : SC.line} strokeWidth={row.k === 'brand' ? 3 : 2} />
                {row.k === 'brand' ? (
                  <g>
                    <text x={52} y={104 + i * 70} fontSize={21} fontWeight={900} fill={SC.text}>Brand</text>
                    <rect x={150} y={80 + i * 70} width={212} height={32} rx={16} fill={BRAND_THEMES.rasta.light.actionPrimary} />
                    <text x={256} y={103 + i * 70} fontSize={21} fontWeight={800} fill="#fff" textAnchor="middle">Rasta → teal</text>
                    <rect x={376} y={80 + i * 70} width={212} height={32} rx={16} fill={BRAND_THEMES.sawari.light.actionPrimary} />
                    <text x={482} y={103 + i * 70} fontSize={21} fontWeight={800} fill="#fff" textAnchor="middle">Sawari → plum</text>
                  </g>
                ) : <text x={52} y={104 + i * 70} fontSize={21} fontWeight={800} fill={SC.text}>{row.s}</text>}
              </g>
            ))}
            <text x={604} y={104} fontSize={21} fontWeight={700} fill={SC.muted} textAnchor="end" opacity={p(t, 13.6, 14.2)}>no brand prop</text>
          </g>
        )}

        {t >= 16 && t < 21 && (
          <g>
            {BRAND_IDS.flatMap((b, i) => BRAND_MODES.map((m, j) => (
              <g key={`${b}-${m}`}>
                <ThemeCard x={32 + j * 296} y={64 + i * 140} w={280} h={128} theme={BRAND_THEMES[b][m]} title={`${NAME[b]} · ${m}`} label={b === 'rasta' ? 'Renew pass' : 'Book seat'} o={p(t, 16.2 + (i * 2 + j) * 0.5, 16.8 + (i * 2 + j) * 0.5)} />
              </g>
            )))}
          </g>
        )}

        {t >= 21 && t < 26 && (
          <g>
            {([
              { head: 'A brand sets', fill: CALL_FILL.theme, items: ['Colour roles', 'Heading face', 'Corner radius', 'Motion timing', 'Icon stroke'] },
              { head: 'Every brand shares', fill: CALL_FILL.shared, items: ['Error colours', 'Tap targets', 'Focus ring', 'Spacing scale', 'Component API'] },
            ]).map((col, i) => (
              <g key={col.head}>
                <rect x={32 + i * 296} y={66} width={280} height={42} rx={10} fill={col.fill} opacity={p(t, 21.2 + i * 0.4, 21.6 + i * 0.4)} />
                <text x={172 + i * 296} y={95} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle" opacity={p(t, 21.2 + i * 0.4, 21.6 + i * 0.4)}>{col.head}</text>
                {col.items.map((s, j) => (
                  <text key={s} x={52 + i * 296} y={148 + j * 42} fontSize={21} fontWeight={700} fill={SC.text} opacity={p(t, 21.8 + j * 0.35 + i * 0.2, 22.2 + j * 0.35 + i * 0.2)}>{i ? '■' : '●'} {s}</text>
                ))}
              </g>
            ))}
          </g>
        )}

        {t >= 26 && t < 31 && (() => {
          const tuned = t >= 28.4;
          const step = tuned ? 800 : gold.asked;
          const r = tuneCheck(gold, step);
          return (
            <g>
              <rect x={32} y={72} width={576} height={130} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <rect x={64} y={104} width={250} height={64} rx={12} fill={SAWARI_RAMPS.gold[400]} />
              <text x={189} y={145} fontSize={24} fontWeight={900} fill={sawariHex('plum', step)} textAnchor="middle">Book seat</text>
              <text x={340} y={130} fontSize={22} fontWeight={900} fill={SC.text}>plum-{step} on gold-400</text>
              <text x={340} y={164} fontSize={22} fontWeight={900} fill={r.pass ? SC.text : SC.error}>{r.ratio.toFixed(2)}:1 {r.pass ? '✓ passes' : '✕ needs 4.5'}</text>
              <g opacity={p(t, 26.8, 27.4)}>
                {BRAND_IDS.flatMap(b => BRAND_MODES.map(m => [NAME[b], m] as const)).map(([b, m], i) => (
                  <g key={`${b}-${m}`}>
                    <rect x={32 + i * 146} y={222} width={134} height={70} rx={10} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                    <text x={99 + i * 146} y={252} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="middle">{b}</text>
                    <text x={99 + i * 146} y={278} fontSize={21} fontWeight={700} fill={SC.muted} textAnchor="middle">{m}</text>
                  </g>
                ))}
              </g>
              <text x={320} y={322} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="middle" opacity={p(t, 27.4, 28)}>{tuned ? 'One step darker, still Sawari' : 'The build checks every pair, every theme'}</text>
            </g>
          );
        })()}

        {t >= 31 && (() => {
          const k = p(t, 31.2, 32.6);
          return (
            <g>
              <rect x={32} y={80} width={576} height={40} rx={8} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <rect x={32} y={80} width={576 * (SAWARI_OVERRIDES / SYSTEM_TOKENS) * k} height={40} rx={8} fill={BRAND_THEMES.sawari.light.actionPrimary} />
              <text x={32} y={152} fontSize={21} fontWeight={800} fill={SC.text}>Sawari sets {Math.round(SAWARI_OVERRIDES * k)} tokens. The other {SYSTEM_TOKENS - SAWARI_OVERRIDES} are shared.</text>
              <g opacity={p(t, 33, 33.6)}>
                <text x={32} y={214} fontSize={22} fontWeight={900} fill={SC.text}>Focus-ring fix, one release</text>
                {(['rasta', 'sawari'] as const).map((b, i) => (
                  <g key={b}>
                    <rect x={32 + i * 296} y={236} width={280} height={60} rx={12} fill={BRAND_THEMES[b].light.actionPrimary} />
                    <text x={172 + i * 296} y={274} fontSize={22} fontWeight={900} fill="#fff" textAnchor="middle">{NAME[b]} ✓</text>
                  </g>
                ))}
              </g>
            </g>
          );
        })()}
      </g>
    </svg>
  );
}
