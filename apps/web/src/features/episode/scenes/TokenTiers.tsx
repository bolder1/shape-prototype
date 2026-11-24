'use client';
// Scene for ds.2-1: Rasta's pass screen with its colours and radii wired straight to the palette. Marketing wants gold
// buttons for Pongal week; editing teal-700 turns the fare-chart link gold too. Then the three tiers appear one at a
// time (primitives, semantic jobs, component handles), and repointing color-action-primary at amber-700 changes the
// button, the active tab and the toggle while the link stays teal. `RastaPass` and `TierChain` are shared with the
// Edit the right tier game. Pure function of t (0–34).
import { COMPONENT, PRIMITIVES, resolveTokens, SEMANTIC, tierOf, type ComponentToken } from '@shape/content';
import { useId } from 'react';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
const MONO = 'ui-monospace, Consolas, monospace';

export const PASS_W = 260, PASS_H = 480;
type Box = [number, number, number, number];
/** Where each component token shows on the pass screen, for rings. */
const AREA: Record<ComponentToken, Box> = {
  'header-bg': [0, 0, PASS_W, 96], 'tab-indicator-color': [14, 62, 74, 32], 'banner-radius': [14, 108, 232, 38],
  'card-bg': [14, 154, 232, 136], 'card-title-color': [22, 164, 170, 26], 'card-radius': [14, 154, 232, 136],
  'toggle-on-bg': [194, 296, 52, 30], 'input-error-border': [14, 334, 232, 62], 'input-error-text': [14, 376, 232, 22], 'input-radius': [14, 334, 232, 62],
  'link-color': [14, 400, 140, 22], 'button-primary-bg': [14, 424, 232, 50], 'button-primary-label': [14, 424, 232, 50], 'button-radius': [14, 424, 232, 50],
};

/** Rasta's pass screen drawn from resolved component tokens. `good` rings what changed as asked, `bad` what changed by mistake. */
export function RastaPass({ v, good = [], bad = [] }: { v: Record<ComponentToken, string>; good?: readonly ComponentToken[]; bad?: readonly ComponentToken[] }) {
  const clip = `rasta-pass-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const r = (k: ComponentToken) => Number(v[k]) || 0;
  const ring = (k: ComponentToken, c: string) => { const [x, y, w, h] = AREA[k]; return <rect key={`${c}${k}`} x={x - 3} y={y - 3} width={w + 6} height={h + 6} rx={10} fill="none" stroke={c} strokeWidth={3} />; };
  const uniq = (ks: readonly ComponentToken[]) => ks.filter((k, i) => ks.findIndex(o => AREA[o].join() === AREA[k].join()) === i);
  return (
    <g>
      <defs><clipPath id={clip}><rect width={PASS_W} height={PASS_H} rx={28} /></clipPath></defs>
      <g clipPath={`url(#${clip})`}>
        <rect width={PASS_W} height={PASS_H} fill="#F9FAFB" />
        <rect width={PASS_W} height={96} fill={v['header-bg']} />
        <text x={20} y={40} fontSize={20} fontWeight={900} fill="#fff">Rasta</text>
        <text x={PASS_W - 20} y={40} textAnchor="end" fontSize={11} fontWeight={700} fill="#fff" opacity={0.8}>Chennai</text>
        {['Pass', 'Trips', 'Wallet'].map((l, k) => <text key={l} x={20 + k * 64} y={80} fontSize={13} fontWeight={800} fill="#fff" opacity={k ? 0.7 : 1}>{l}</text>)}
        <rect x={20} y={88} width={30} height={3} rx={1.5} fill={v['tab-indicator-color']} />
      </g>
      <rect x={16} y={110} width={228} height={34} rx={r('banner-radius')} fill="#FEF3C7" stroke="#FCD34D" />
      <text x={30} y={132} fontSize={12} fontWeight={700} fill="#92400E">Your pass ends in 2 days</text>
      <rect x={16} y={156} width={228} height={132} rx={r('card-radius')} fill={v['card-bg']} stroke="#EAECF0" strokeWidth={1.5} />
      <text x={30} y={184} fontSize={15} fontWeight={900} fill={v['card-title-color']}>Monthly pass</text>
      <text x={30} y={204} fontSize={11.5} fontWeight={600} fill="#475467">Zones A–C · Selvi R</text>
      <text x={30} y={222} fontSize={11.5} fontWeight={600} fill="#475467">Valid till 30 Nov</text>
      <text x={30} y={266} fontSize={20} fontWeight={900} fill={v['card-title-color']} style={{ fontVariantNumeric: 'tabular-nums' }}>₹1,000</text>
      <g transform="translate(176 176)">
        {Array.from({ length: 25 }, (_, k) => ((k * 7 + 3) % 5 < 3 || k % 6 === 0) && <rect key={k} x={(k % 5) * 11} y={Math.floor(k / 5) * 11} width={9} height={9} rx={1.5} fill="#101828" />)}
      </g>
      <text x={16} y={316} fontSize={13} fontWeight={700} fill="#101828">Auto-renew</text>
      <rect x={198} y={300} width={44} height={22} rx={11} fill={v['toggle-on-bg']} />
      <circle cx={231} cy={311} r={8} fill="#fff" />
      <text x={16} y={334} fontSize={10.5} fontWeight={700} fill="#475467">UPI ID</text>
      <rect x={16} y={340} width={228} height={34} rx={r('input-radius')} fill="#fff" stroke={v['input-error-border']} strokeWidth={2} />
      <text x={28} y={362} fontSize={12.5} fontWeight={600} fill="#101828">selvi@</text>
      <text x={16} y={391} fontSize={10.5} fontWeight={700} fill={v['input-error-text']}>Enter a UPI ID like name@okbank</text>
      <text x={16} y={416} fontSize={12.5} fontWeight={800} fill={v['link-color']} textDecoration="underline">See the fare chart</text>
      <rect x={16} y={426} width={228} height={46} rx={r('button-radius')} fill={v['button-primary-bg']} />
      <text x={PASS_W / 2} y={454} textAnchor="middle" fontSize={14} fontWeight={900} fill={v['button-primary-label']}>Renew · ₹1,000</text>
      <rect width={PASS_W} height={PASS_H} rx={28} fill="none" stroke="#D0D5DD" strokeWidth={2} />
      {uniq(good).map(k => ring(k, SC.mint))}
      {uniq(bad).map(k => ring(k, SC.error))}
    </g>
  );
}

export const CHAIN_W = 560, CHAIN_H = 470;
const COL_X = { primitive: 0, semantic: 190, component: 395 } as const;
const COL_W = { primitive: 140, semantic: 180, component: 165 } as const;
const ROW = 30, TOP = 46;
const PRIMS = Object.keys(PRIMITIVES), SEMS = Object.keys(SEMANTIC), COMPS = Object.keys(COMPONENT) as ComponentToken[];
const rowOf = (token: string) => {
  const tier = tierOf(token)!, list = tier === 'primitive' ? PRIMS : tier === 'semantic' ? SEMS : COMPS;
  const gap = (COMPS.length - list.length) * ROW / list.length;
  return TOP + list.indexOf(token) * (ROW + gap) + gap / 2;
};

/** The three tiers as columns, with a line from each token to the one it references (after `edits`).
 *  `sem` fades the semantic tier in (0 wires components straight to primitives, as a flat list would); `lit` lights an
 *  edited token's whole chain and dims the rest; `focus` dims every column but one. */
export function TierChain({ edits = {}, sem = 1, lit, focus }: { edits?: Record<string, string>; sem?: number; lit?: string; focus?: 'primitive' | 'semantic' | 'component' }) {
  const target = (k: string): string | null => (tierOf(k) === 'primitive' ? null : edits[k] ?? (SEMANTIC as Record<string, string>)[k] ?? (COMPONENT as Record<string, string>)[k]);
  const up = (k: string) => { const out: string[] = []; for (let x = target(k); x; x = target(x)) out.push(x); return out; };
  const reach = lit ? new Set<string>([lit, ...up(lit), ...[...SEMS, ...COMPS].filter(x => up(x).includes(lit))]) : null;
  const on = (k: string) => !reach || reach.has(k);
  const colOp = (tier: keyof typeof COL_X) => (focus && focus !== tier ? 0.25 : 1) * (tier === 'semantic' ? sem : 1);
  const value = (k: string) => (edits[k] && tierOf(k) === 'primitive' ? edits[k] : (PRIMITIVES as Record<string, string>)[k]);
  const edge = (a: string, b: string, op: number, key: string) => {
    const ta = tierOf(a)!, tb = tierOf(b)!;
    const x1 = COL_X[ta], y1 = rowOf(a), x2 = COL_X[tb] + COL_W[tb], y2 = rowOf(b), lt = on(a) && on(b) && !!reach;
    return <path key={key} d={`M${x1} ${y1} C${x1 - 30} ${y1} ${x2 + 30} ${y2} ${x2} ${y2}`} fill="none" stroke={lt ? SC.brand : SC.muted} strokeOpacity={op * (reach ? (lt ? 1 : 0.15) : 0.45)} strokeWidth={lt ? 2.4 : 1.2} />;
  };
  const node = (k: string) => {
    const tier = tierOf(k)!, x = COL_X[tier], y = rowOf(k), w = COL_W[tier], val = tier === 'primitive' ? value(k) : null, edited = k in edits;
    return (
      <g key={k} opacity={(on(k) ? 1 : 0.3) * colOp(tier)}>
        <rect x={x} y={y - 11} width={w} height={22} rx={6} fill={SC.surface} stroke={edited ? SC.brand : SC.line} strokeWidth={edited ? 2.4 : 1.2} />
        {val?.startsWith('#') && <circle cx={x + 12} cy={y} r={6} fill={val} stroke={SC.line} />}
        {val && !val.startsWith('#') && <text x={x + 12} y={y + 4} textAnchor="middle" fontSize={10} fontWeight={800} fill={SC.muted}>{val}</text>}
        <text x={x + (val ? 24 : 8)} y={y + 4} fontSize={10.5} fontWeight={700} fill={SC.text} fontFamily={MONO}>{k}</text>
      </g>
    );
  };
  return (
    <g>
      {(['primitive', 'semantic', 'component'] as const).map(tier => (
        <text key={tier} x={COL_X[tier]} y={16} fontSize={13} fontWeight={900} fill={SC.text} opacity={colOp(tier)}>
          {tier === 'primitive' ? '1 · Primitives' : tier === 'semantic' ? '2 · Semantic' : sem < 0.5 ? 'Where it’s used' : '3 · Component'}
        </text>
      ))}
      {/* flat: components straight to primitives */}
      {sem < 1 && COMPS.map(c => edge(c, SEMANTIC[COMPONENT[c]], 1 - sem, `f${c}`))}
      {sem > 0 && COMPS.map(c => edge(c, target(c)!, sem, `c${c}`))}
      {sem > 0 && SEMS.map(s => edge(s, target(s)!, sem, `s${s}`))}
      {PRIMS.map(node)}
      {SEMS.map(node)}
      {COMPS.map(node)}
    </g>
  );
}

export function TokenTiersScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const flatGold = t >= 6.4 && t < 10;
  const pongal = t >= 25.4 && t < 29;
  const edits: Record<string, string> = flatGold ? { 'teal-700': PRIMITIVES['amber-700'] } : pongal ? { 'color-action-primary': 'amber-700' } : {};
  const v = resolveTokens(edits);
  const sem = p(t, 15, 16.6);
  const focus = t >= 10.4 && t < 15 ? 'primitive' : t >= 15 && t < 20 ? 'semantic' : t >= 20 && t < 24 ? 'component' : undefined;
  const lit = flatGold ? undefined : pongal || (t >= 24 && t < 29) ? 'color-action-primary' : undefined;
  const fin = p(t, 29, 29.6);
  const good: ComponentToken[] = pongal ? ['button-primary-bg', 'tab-indicator-color', 'toggle-on-bg'] : flatGold && t >= 6.8 ? ['button-primary-bg'] : [];
  const bad: ComponentToken[] = flatGold && t >= 7.4 ? ['link-color'] : [];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a flat token list turns a link gold by mistake, then primitives, semantic and component tiers let one change land only on the primary actions">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g transform={`translate(28 ${lerp(40, 30, intro)})`} opacity={intro * (1 - fin * 0.85)}>
        <TierChain edits={flatGold ? {} : edits} sem={sem} lit={lit} focus={focus} />
        {flatGold && (
          <g opacity={p(t, 6.4, 6.8)}>
            <rect x={-4} y={rowOf('teal-700') - 15} width={148} height={30} rx={8} fill="none" stroke={SC.brand} strokeWidth={3} />
            <text x={0} y={rowOf('teal-700') + 32} fontSize={12} fontWeight={800} fill={SC.error}>teal-700 → gold: and the link too</text>
          </g>
        )}
      </g>
      <g transform="translate(672 30)" opacity={intro}>
        <RastaPass v={v} good={good} bad={bad} />
      </g>
      {pongal && (
        <g transform="translate(672 524)" opacity={p(t, 26, 26.5)}>
          <text fontSize={13} fontWeight={800} fill={SC.text}>Button, tab, toggle: gold. Link: still teal.</text>
        </g>
      )}
      {t >= 29 && (
        <g transform="translate(60 150)" opacity={fin}>
          <rect width={560} height={240} rx={20} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
          <text x={28} y={50} fontSize={22} fontWeight={900} fill={SC.text}>Edit the smallest tier that does the whole job</text>
          {[['Primitive', 'The colour itself changes, everywhere', 'teal-700'], ['Semantic', 'One job changes', 'color-action-primary'], ['Component', 'One component needs an exception', 'tab-indicator-color']].map(([a, b, c], k) => (
            <g key={a} transform={`translate(28 ${96 + k * 48})`} opacity={p(t, 29.4 + k * 0.5, 29.9 + k * 0.5)}>
              <text fontSize={16} fontWeight={900} fill={SC.brand}>{a}</text>
              <text x={120} fontSize={15} fontWeight={700} fill={SC.text}>{b}</text>
              <text x={120} y={20} fontSize={12} fontWeight={700} fill={SC.muted} fontFamily={MONO}>{c}</text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
