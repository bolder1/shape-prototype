'use client';
// Scene for ds.3-1: Rasta's Button after two years of requests has twelve props. Arjun turns on isPrimary and isDanger
// together and gets a teal button with a red label. Ten switches describe 1,024 buttons and the two free-value props make
// it endless. Then the props fold into a new API one decision at a time (variant and size enums, two booleans, two
// slots, three props the system now decides), with the counter worked out by `apiFrom` and `comboCount`, down to 48
// real buttons. `RastaButton` is shared with the ds.3 games and the Variants scene. Pure function of t (0–34).
import { apiFrom, comboCount, type ApiDecision } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
const MONO = 'ui-monospace, Consolas, monospace';

export type BtnVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type BtnSize = 'sm' | 'md' | 'lg';
/** Rasta's Button looks, drawn on a white surface. White on teal-700 is 5.5:1, white on the error red 4.8:1. */
export const BTN_STYLE: Record<BtnVariant, { fill: string; stroke?: string; text: string }> = {
  primary: { fill: '#0F766E', text: '#FFFFFF' },
  secondary: { fill: '#FFFFFF', stroke: '#D0D5DD', text: '#344054' },
  tertiary: { fill: 'none', text: '#0F766E' },
  danger: { fill: '#D92D20', text: '#FFFFFF' },
};
export const BTN_H: Record<BtnSize, number> = { sm: 26, md: 32, lg: 40 };
export const BTN_VARIANTS: BtnVariant[] = ['primary', 'secondary', 'tertiary', 'danger'];
export const BTN_SIZES: BtnSize[] = ['sm', 'md', 'lg'];

/** A Rasta button with its top-left at (x, y). `text` overrides the label colour (for the clash); `icon` draws a ticket before the label. */
export function RastaButton({ x, y, w, variant = 'secondary', size = 'md', label, icon, text, state = 'default', opacity = 1 }: {
  x: number; y: number; w: number; variant?: BtnVariant; size?: BtnSize; label: string; icon?: boolean; text?: string;
  state?: 'default' | 'hover' | 'pressed' | 'focus' | 'disabled'; opacity?: number;
}) {
  const s = BTN_STYLE[variant], h = BTN_H[size], fs = size === 'sm' ? 10.5 : size === 'md' ? 12 : 13.5;
  const disabled = state === 'disabled';
  const shade = state === 'hover' ? 0.12 : state === 'pressed' ? 0.24 : 0;
  const fill = disabled ? (variant === 'tertiary' ? 'none' : '#F2F4F7') : s.fill;
  const ink = disabled ? '#98A2B3' : text ?? s.text;
  const iw = icon ? 14 : 0;
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      {state === 'focus' && <rect x={-3.5} y={-3.5} width={w + 7} height={h + 7} rx={h / 4 + 3.5} fill="none" stroke="#14B8A6" strokeWidth={2} />}
      <rect width={w} height={h} rx={h / 4} fill={fill} stroke={disabled ? (variant === 'secondary' ? '#EAECF0' : 'none') : s.stroke ?? 'none'} strokeWidth={1.2} />
      {shade > 0 && <rect width={w} height={h} rx={h / 4} fill={variant === 'primary' || variant === 'danger' ? '#000' : '#0F766E'} opacity={variant === 'primary' || variant === 'danger' ? shade : shade / 2.5} />}
      {icon && (
        <g transform={`translate(${w / 2 - (label.length * fs * 0.29) - iw / 2 - 2} ${h / 2 - 5})`}>
          <rect width={12} height={10} rx={2} fill="none" stroke={ink} strokeWidth={1.6} />
          <line x1={5} x2={5} y1={1} y2={9} stroke={ink} strokeWidth={1.2} strokeDasharray="1.5 1.5" />
        </g>
      )}
      <text x={w / 2 + iw / 2} y={h / 2 + fs * 0.36} textAnchor="middle" fontSize={fs} fontWeight={800} fill={ink}>{label}</text>
    </g>
  );
}

/** The old Button's props, in the order the scene folds them, with what each becomes and when. */
const SPRAWL: (ApiDecision & { at: number; type: string; why?: string })[] = [
  { old: 'isPrimary', visual: 'variant=primary', kind: 'enum', at: 15.4, type: 'boolean' },
  { old: 'isTertiary', visual: 'variant=tertiary', kind: 'enum', at: 15.9, type: 'boolean' },
  { old: 'isDanger', visual: 'variant=danger', kind: 'enum', at: 16.4, type: 'boolean' },
  { old: 'isSmall', visual: 'size=sm', kind: 'enum', at: 17.6, type: 'boolean' },
  { old: 'isBig', visual: 'size=lg', kind: 'enum', at: 18.1, type: 'boolean' },
  { old: 'isLoading', visual: 'isLoading', kind: 'boolean', at: 19, type: 'boolean' },
  { old: 'isDisabled', visual: 'isDisabled', kind: 'boolean', at: 19.4, type: 'boolean' },
  { old: 'hasIcon', visual: 'iconLeading', kind: 'slot', at: 20.6, type: 'boolean' },
  { old: 'hasIconRight', visual: 'iconTrailing', kind: 'slot', at: 21.8, type: 'boolean' },
  { old: 'isRounded', visual: 'button-radius', kind: 'fixed', at: 25.8, type: 'boolean', why: 'button-radius' },
  { old: 'color', visual: 'variant', kind: 'fixed', at: 24.6, type: 'string', why: 'variant tokens' },
  { old: 'padding', visual: 'size', kind: 'fixed', at: 25.2, type: 'string', why: 'size' },
];
const KIND_COLOUR = { enum: SC.brand, boolean: SC.discover, slot: SC.grow, fixed: SC.error } as const;

const fmt = (n: number) => (n === Infinity ? '∞' : n.toLocaleString('en-IN'));

export function PropSprawlScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const decided = SPRAWL.map(d => ({ ...d, kind: t >= d.at ? d.kind : undefined }));
  const api = apiFrom(decided);
  const count = t < 10 ? null : t < 12.6 ? comboCount(apiFrom(decided.filter(d => d.type === 'boolean'))) : comboCount(api);
  const clash = t >= 5 && t < 10;
  const fin = p(t, 29, 29.6);
  const rowY = (k: number) => 86 + k * 33;
  const newApi = api.filter(a => a.kind !== 'free' && !(a.kind === 'boolean' && !SPRAWL.find(s => s.old === a.name && s.kind === 'boolean' && t >= s.at)));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a Button with twelve props that allows impossible combinations is folded into variant and size, two booleans and two slots, while colour, padding and corners move to tokens">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      {/* the old props */}
      <g transform={`translate(36 ${lerp(44, 30, intro)})`} opacity={intro}>
        <rect width={300} height={490} rx={16} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
        <text x={20} y={34} fontSize={14} fontWeight={900} fill={SC.text}>Button · old props</text>
        <text x={280} y={34} textAnchor="end" fontSize={11} fontWeight={700} fill={SC.muted} fontFamily={MONO}>12</text>
        {SPRAWL.map((d, k) => {
          const shown = p(t, 0.4 + k * 0.32, 0.7 + k * 0.32);
          const done = t >= d.at, lit = clash && (d.old === 'isPrimary' || d.old === 'isDanger');
          const c = done ? KIND_COLOUR[d.kind!] : lit ? SC.error : SC.text;
          return (
            <g key={d.old} transform={`translate(20 ${rowY(k) - 30})`} opacity={shown * (done ? 0.55 : 1)}>
              {lit && <rect x={-8} y={-16} width={276} height={26} rx={6} fill={SC.error} opacity={0.12} />}
              <text fontSize={13} fontWeight={700} fill={c} fontFamily={MONO}>{d.old}</text>
              {done && d.kind === 'fixed'
                ? <text x={150} fontSize={11} fontWeight={800} fill={SC.error}>← {d.why}</text>
                : <text x={150} fontSize={11} fontWeight={600} fill={SC.muted} fontFamily={MONO}>{d.type === 'string' ? 'any string' : 'boolean'}</text>}
              {done && d.kind === 'fixed' && <line x1={-2} x2={110} y1={-4} y2={-4} stroke={SC.error} strokeWidth={2} />}
              {done && <text x={262} textAnchor="end" fontSize={11} fontWeight={800} fill={c}>{d.kind === 'fixed' ? '✕' : '→'}</text>}
            </g>
          );
        })}
      </g>

      {/* 0–15: what the old API does */}
      {t < 15.2 && (
        <g opacity={intro * (1 - p(t, 14.6, 15.2))}>
          <rect x={372} y={40} width={552} height={300} rx={20} fill="#FFFFFF" stroke={SC.line} strokeWidth={1.5} />
          {t < 5 && (
            <g opacity={p(t, 0.8, 1.4)}>
              <text x={648} y={96} textAnchor="middle" fontSize={14} fontWeight={800} fill="#475467">One prop for every request</text>
              <RastaButton x={528} y={150} w={240} size="lg" variant="primary" label="Renew · ₹1,000" />
              <text x={648} y={240} textAnchor="middle" fontSize={12} fontWeight={600} fill="#475467" fontFamily={MONO}>{'<Button isPrimary isBig color="#0F766E" …>'}</text>
            </g>
          )}
          {clash && (
            <g opacity={p(t, 5, 5.5)}>
              <text x={648} y={96} textAnchor="middle" fontSize={12.5} fontWeight={700} fill="#101828" fontFamily={MONO}>{'<Button isPrimary isDanger>Cancel pass</Button>'}</text>
              <RastaButton x={548} y={136} w={200} size="lg" variant="primary" text="#FDA29B" label="Cancel pass" />
              <g opacity={p(t, 6.6, 7.2)}>
                <text x={648} y={222} textAnchor="middle" fontSize={15} fontWeight={900} fill="#B42318">Teal fill, red label.</text>
                <text x={648} y={246} textAnchor="middle" fontSize={13} fontWeight={600} fill="#475467">Whichever rule comes last in the CSS wins.</text>
              </g>
            </g>
          )}
          {t >= 10 && (
            <g opacity={p(t, 10, 10.5)}>
              {Array.from({ length: 48 }, (_, k) => {
                const v = BTN_VARIANTS[(k * 7) % 4], bad = (k * 5) % 7 < 4;
                return (
                  <g key={k} opacity={p(t, 10.2 + k * 0.04, 10.5 + k * 0.04)}>
                    <rect x={400 + (k % 12) * 42} y={64 + Math.floor(k / 12) * 26} width={34} height={16} rx={4} fill={BTN_STYLE[v].fill === 'none' ? '#FFFFFF' : BTN_STYLE[v].fill} stroke="#D0D5DD" />
                    {bad && t >= 11.4 && <path d={`M${404 + (k % 12) * 42} ${68 + Math.floor(k / 12) * 26} l26 8 M${430 + (k % 12) * 42} ${68 + Math.floor(k / 12) * 26} l-26 8`} stroke="#D92D20" strokeWidth={1.6} />}
                  </g>
                );
              })}
              <text x={648} y={214} textAnchor="middle" fontSize={44} fontWeight={900} fill="#101828" style={{ fontVariantNumeric: 'tabular-nums' }}>{fmt(count!)}</text>
              <text x={648} y={246} textAnchor="middle" fontSize={13} fontWeight={700} fill="#475467">{t < 12.6 ? 'buttons from ten on/off switches, most of them nonsense' : 'color and padding take any value: nobody can design or test them all'}</text>
            </g>
          )}
        </g>
      )}

      {/* 15+: the new API */}
      {t >= 15 && (
        <g transform="translate(372 40)" opacity={p(t, 15, 15.4) * (1 - fin * 0.7)}>
          <rect width={300} height={330} rx={16} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
          <text x={20} y={34} fontSize={14} fontWeight={900} fill={SC.text}>Button · new API</text>
          {newApi.map((a, k) => (
            <g key={a.name} transform={`translate(20 ${74 + k * 40})`}>
              <text fontSize={13} fontWeight={800} fill={a.kind === 'enum' ? SC.brand : a.kind === 'boolean' ? SC.discover : SC.grow} fontFamily={MONO}>{a.name}</text>
              <text x={0} y={17} fontSize={10.5} fontWeight={600} fill={SC.muted} fontFamily={MONO}>
                {a.kind === 'enum' ? a.options!.map(o => `"${o}"`).join(' | ') : a.kind === 'slot' ? 'slot: any icon' : 'boolean'}
              </text>
            </g>
          ))}
        </g>
      )}
      {t >= 15 && (
        <g transform="translate(696 40)" opacity={p(t, 15, 15.4)}>
          <rect width={228} height={330} rx={16} fill="#FFFFFF" stroke={SC.line} strokeWidth={1.5} />
          <text x={114} y={36} textAnchor="middle" fontSize={12} fontWeight={800} fill="#475467">Buttons it can describe</text>
          <text x={114} y={88} textAnchor="middle" fontSize={44} fontWeight={900} fill={comboCount(api) === 48 ? '#067647' : '#101828'} style={{ fontVariantNumeric: 'tabular-nums' }}>{fmt(comboCount(api.filter(a => a.kind !== 'free')))}</text>
          {t >= 29 ? (
            <g opacity={fin}>
              {BTN_VARIANTS.map((v, r) => BTN_SIZES.map((s, c) => (
                <RastaButton key={v + s} x={14 + c * 68} y={116 + r * 50 + (40 - BTN_H[s]) / 2} w={c === 0 ? 52 : c === 1 ? 60 : 64} variant={v} size={s} label="Renew" />
              )))}
            </g>
          ) : (
            <text x={114} y={118} textAnchor="middle" fontSize={11} fontWeight={600} fill="#475467">{api.some(a => a.kind === 'free') ? '+ color and padding: still endless' : 'enums × booleans, nothing free'}</text>
          )}
        </g>
      )}
      {t >= 29 && (
        <g transform="translate(372 392)" opacity={p(t, 29.6, 30.2)}>
          <rect width={552} height={118} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
          <text x={24} y={38} fontSize={18} fontWeight={900} fill={SC.text}>Forty-eight buttons, every one real</text>
          <text x={24} y={66} fontSize={13} fontWeight={700} fill={SC.muted}>One enum per choice · booleans for real states · slots for content</text>
          <text x={24} y={92} fontSize={12} fontWeight={700} fill={SC.brand} fontFamily={MONO}>{'Figma: variant · size · iconLeading   Code: the same names'}</text>
        </g>
      )}
      {t >= 5 && t < 15 && (
        <g transform="translate(372 364)" opacity={p(t, 5.4, 6)}>
          <rect width={552} height={64} rx={14} fill={SC.surface} stroke={SC.line} />
          <text x={22} y={38} fontSize={14} fontWeight={800} fill={SC.text}>{t < 10 ? 'Arjun needs “Cancel pass”: dangerous, and the main action.' : 'Every switch doubles what has to be designed, built and tested.'}</text>
        </g>
      )}
    </svg>
  );
}
