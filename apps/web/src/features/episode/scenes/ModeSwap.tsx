'use client';
// Scene for ds.2-2: Selvi opens Rasta on the night bus and the white pass screen lights up the bus. Inverting every
// colour turns the teal salmon pink and the error red cyan. Then each semantic colour gets a dark value, row by row in
// a light | dark table: a dark-grey page, a raised card one step lighter, off-white text, lighter accents (the Renew
// button goes from 3.2:1 to 7.1:1), every pair measured. It ends on two themes × two modes. `NightPass` is shared
// with the Tune the night mode game. Pure function of t (0–34).
import { contrastRatio, MODE_SPECS, modeHex, RAMPS, type ModeToken } from '@shape/content';
import { back, clamp, Grid, p, SC } from './shared';

const W = 960, H = 540;
const MONO = 'ui-monospace, Consolas, monospace';
export const NIGHT_W = 260, NIGHT_H = 480;
export const MODE_TOKENS = Object.keys(MODE_SPECS) as ModeToken[];
export type ModeColours = Record<ModeToken, string> & { label: string };

/** Rasta's colours in a mode, plus the primary button's label colour (white in light mode, dark in dark mode). */
export const modeColours = (mode: 'light' | 'dark', over: Partial<ModeColours> = {}): ModeColours => ({
  ...(Object.fromEntries(MODE_TOKENS.map(k => [k, modeHex(k, mode)])) as Record<ModeToken, string>),
  label: mode === 'light' ? '#FFFFFF' : RAMPS.grey[900], ...over,
});
const invert = (hex: string) => `#${[1, 3, 5].map(i => (255 - parseInt(hex.slice(i, i + 2), 16)).toString(16).padStart(2, '0')).join('')}`;

type Box = [number, number, number, number];
const AREA: Record<ModeToken, Box[]> = {
  'color-surface-page': [[0, 0, NIGHT_W, NIGHT_H]],
  'color-surface-raised': [[14, 70, 232, 150]],
  'color-text-primary': [[18, 22, 120, 30], [26, 82, 150, 26]],
  'color-text-secondary': [[26, 112, 150, 40], [18, 338, 140, 56]],
  'color-border-default': [[14, 70, 232, 150], [14, 302, 232, 8]],
  'color-action-primary': [[14, 412, 232, 54]],
  'color-feedback-error': [[14, 266, 232, 24]],
  'color-feedback-warning': [[14, 232, 232, 26]],
};

/** Rasta's pass screen painted with one mode's semantic colours. `focus` rings the places one token paints. */
export function NightPass({ c, focus }: { c: ModeColours; focus?: ModeToken }) {
  const row = (y: number, a: string, b: string) => (
    <g transform={`translate(18 ${y})`}>
      <text fontSize={13} fontWeight={800} fill={c['color-text-primary']}>{a}</text>
      <text y={18} fontSize={11} fontWeight={600} fill={c['color-text-secondary']}>{b}</text>
    </g>
  );
  return (
    <g>
      <rect width={NIGHT_W} height={NIGHT_H} rx={28} fill={c['color-surface-page']} stroke={c['color-border-default']} strokeWidth={2} />
      <text x={20} y={44} fontSize={20} fontWeight={900} fill={c['color-text-primary']}>Your pass</text>
      <rect x={16} y={72} width={228} height={146} rx={16} fill={c['color-surface-raised']} stroke={c['color-border-default']} strokeWidth={1.5} />
      <text x={30} y={100} fontSize={15} fontWeight={900} fill={c['color-text-primary']}>Monthly pass · ₹1,000</text>
      <text x={30} y={124} fontSize={11.5} fontWeight={600} fill={c['color-text-secondary']}>Zones A–C · Selvi R</text>
      <text x={30} y={142} fontSize={11.5} fontWeight={600} fill={c['color-text-secondary']}>Valid till 30 Nov</text>
      <g transform="translate(30 156)">
        {Array.from({ length: 14 }, (_, k) => <rect key={k} x={k * 14} y={0} width={(k * 5) % 3 === 0 ? 4 : 8} height={44} fill={c['color-text-primary']} opacity={0.85} />)}
      </g>
      <circle cx={26} cy={245} r={6} fill="none" stroke={c['color-feedback-warning']} strokeWidth={2} />
      <text x={40} y={250} fontSize={12} fontWeight={800} fill={c['color-feedback-warning']}>Your pass ends in 2 days</text>
      <text x={18} y={282} fontSize={12} fontWeight={800} fill={c['color-feedback-error']}>Payment failed. Try another UPI app</text>
      <line x1={16} x2={244} y1={306} y2={306} stroke={c['color-border-default']} strokeWidth={1.5} />
      <text x={18} y={328} fontSize={11} fontWeight={800} fill={c['color-text-secondary']} letterSpacing={0.6}>LAST TRIPS</text>
      {row(352, 'Adyar → T. Nagar', '21C · 11:40 pm')}
      {row(388, 'T. Nagar → Guindy', '47A · 8:05 am')}
      <rect x={16} y={414} width={228} height={50} rx={12} fill={c['color-action-primary']} />
      <text x={NIGHT_W / 2} y={445} textAnchor="middle" fontSize={14} fontWeight={900} fill={c.label}>Renew · ₹1,000</text>
      {focus && AREA[focus].map(([x, y, w, h], k) => <rect key={k} x={x - 3} y={y - 3} width={w + 6} height={h + 6} rx={12} fill="none" stroke={SC.brand} strokeWidth={3} strokeDasharray={focus === 'color-surface-page' ? '8 6' : undefined} />)}
    </g>
  );
}

const ROW_Y = (k: number) => 86 + k * 44;
const SHORT: Record<ModeToken, string> = {
  'color-surface-page': 'surface-page', 'color-surface-raised': 'surface-raised', 'color-text-primary': 'text-primary', 'color-text-secondary': 'text-secondary',
  'color-border-default': 'border-default', 'color-action-primary': 'action-primary', 'color-feedback-error': 'feedback-error', 'color-feedback-warning': 'feedback-warning',
};
const against = (k: ModeToken) => (MODE_SPECS[k].against === 'page' ? RAMPS.grey[900] : RAMPS.grey[100]);

export function ModeSwapScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const inverted = t >= 5.4 && t < 10;
  const light = modeColours('light'), dark = modeColours('dark');
  // in the table act, each row turns dark in order
  const tuned = (k: number) => t >= 11 + k * 0.45;
  const c: ModeColours = inverted
    ? { ...(Object.fromEntries(MODE_TOKENS.map(k => [k, invert(light[k])])) as Record<ModeToken, string>), label: invert(light.label) }
    : t < 10 ? light
    : { ...(Object.fromEntries(MODE_TOKENS.map((k, i) => [k, tuned(i) ? dark[k] : light[k]])) as Record<ModeToken, string>), label: tuned(MODE_TOKENS.indexOf('color-action-primary')) ? dark.label : light.label };
  const focus: ModeToken | undefined = t >= 15 && t < 19 ? 'color-surface-raised' : t >= 19 && t < 24 ? 'color-action-primary' : undefined;
  const table = p(t, 10, 10.6) * (1 - p(t, 28.6, 29.2));
  const themes = p(t, 29, 29.6);
  const night = p(t, 0.2, 1.2) * (1 - p(t, 10, 11));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a bright pass screen on a night bus, a lazy inverted dark mode, then a dark mode tuned token by token and checked for contrast, ending on two themes in two modes">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      {/* the night bus */}
      <g opacity={night}>
        <rect width={W} height={H} fill="#070B14" />
        {[0, 1, 2].map(k => <rect key={k} x={40 + k * 190} y={90} width={160} height={110} rx={14} fill="#0E1626" stroke="#1D2939" strokeWidth={3} />)}
        {[0, 1, 2, 3].map(k => <circle key={k} cx={90 + k * 130} cy={150} r={3} fill="#FBBF24" opacity={0.5} />)}
        <text x={60} y={300} fontSize={22} fontWeight={900} fill="#F2F4F7">11:40 pm · 21C to Adyar</text>
        <text x={60} y={332} fontSize={15} fontWeight={700} fill="#98A2B3" opacity={p(t, 1.4, 2)}>Selvi opens Rasta to show her pass.</text>
        {t >= 5.4 && t < 10 && (
          <g transform="translate(60 380)" opacity={p(t, 5.8, 6.3)}>
            <text fontSize={20} fontWeight={900} fill="#F2F4F7">Inverted</text>
            <text y={28} fontSize={14} fontWeight={700} fill="#98A2B3">Teal → salmon pink. Error red → cyan.</text>
            <text y={50} fontSize={14} fontWeight={700} fill="#98A2B3">Pure black behind pure white.</text>
          </g>
        )}
      </g>
      {/* the glow of a white screen */}
      {t < 5.6 && <ellipse cx={770} cy={270} rx={240} ry={290} fill="#FFFFFF" opacity={0.18 * night * (1 - p(t, 5.2, 5.6))} />}

      {table > 0 && (
        <g transform="translate(36 0)" opacity={table}>
          <text x={0} y={52} fontSize={13} fontWeight={900} fill={SC.muted}>Semantic token</text>
          <text x={250} y={52} fontSize={13} fontWeight={900} fill={SC.muted}>Light</text>
          <text x={360} y={52} fontSize={13} fontWeight={900} fill={SC.muted}>Dark</text>
          <text x={500} y={52} textAnchor="end" fontSize={13} fontWeight={900} fill={SC.muted} opacity={p(t, 24, 24.5)}>Dark contrast</text>
          {MODE_TOKENS.map((k, i) => {
            const s = MODE_SPECS[k], y = ROW_Y(i), r = contrastRatio(dark[k], against(k));
            return (
              <g key={k} opacity={p(t, 10.4 + i * 0.12, 10.8 + i * 0.12)}>
                <rect x={-8} y={y - 22} width={528} height={38} rx={10} fill={SC.surface} stroke={focus === k ? SC.brand : SC.line} strokeWidth={focus === k ? 2.5 : 1} />
                <text x={4} y={y + 2} fontSize={13} fontWeight={800} fill={SC.text} fontFamily={MONO}>{SHORT[k]}</text>
                <circle cx={262} cy={y - 3} r={9} fill={light[k]} stroke={SC.line} />
                <text x={278} y={y + 2} fontSize={12} fontWeight={700} fill={SC.muted} fontFamily={MONO}>{s.ramp}-{s.light}</text>
                <g opacity={tuned(i) ? 1 : 0.2}>
                  <circle cx={372} cy={y - 3} r={9} fill={dark[k]} stroke={SC.line} />
                  <text x={388} y={y + 2} fontSize={12} fontWeight={700} fill={SC.muted} fontFamily={MONO}>{s.ramp}-{s.dark}</text>
                </g>
                <text x={500} y={y + 2} textAnchor="end" fontSize={13} fontWeight={900} fill={SC.text} opacity={p(t, 24 + i * 0.3, 24.4 + i * 0.3)} style={{ fontVariantNumeric: 'tabular-nums' }}>{r.toFixed(1)}:1 ✓</text>
              </g>
            );
          })}
          {t >= 19 && t < 24 && (
            <g transform={`translate(0 ${ROW_Y(MODE_TOKENS.length) + 2})`} opacity={p(t, 19.4, 19.9)}>
              <text fontSize={15} fontWeight={800} fill={SC.error} style={{ fontVariantNumeric: 'tabular-nums' }}>teal-700 on the dark page: {contrastRatio(RAMPS.teal[700], RAMPS.grey[900]).toFixed(1)}:1</text>
              <text y={24} fontSize={15} fontWeight={800} fill={SC.text} opacity={p(t, 20.6, 21)} style={{ fontVariantNumeric: 'tabular-nums' }}>teal-500: {contrastRatio(RAMPS.teal[500], RAMPS.grey[900]).toFixed(1)}:1, with a dark label</text>
            </g>
          )}
          {t >= 15 && t < 19 && (
            <g transform={`translate(0 ${ROW_Y(MODE_TOKENS.length) + 2})`} opacity={p(t, 15.4, 15.9)}>
              <text fontSize={15} fontWeight={800} fill={SC.text}>Page grey-900, card grey-800: higher is lighter.</text>
              <text y={24} fontSize={15} fontWeight={700} fill={SC.muted}>A shadow barely shows on a dark page.</text>
            </g>
          )}
        </g>
      )}

      {themes < 1 && (
        <g transform={`translate(${t < 10 ? 640 : 664} 30)`} opacity={intro * (1 - themes)}>
          <NightPass c={c} focus={focus} />
        </g>
      )}
      {themes > 0 && (
        <g opacity={themes}>
          <text x={60} y={70} fontSize={24} fontWeight={900} fill={SC.text}>Two themes × two modes</text>
          <text x={60} y={100} fontSize={15} fontWeight={700} fill={SC.muted}>Four sets of values. One set of components.</text>
          {([
            ['Rasta · light', light], ['Rasta · dark', dark],
            ['Business · light', modeColours('light', { 'color-action-primary': '#4338CA' })], ['Business · dark', modeColours('dark', { 'color-action-primary': '#818CF8' })],
          ] as const).map(([name, cs], k) => (
            <g key={name} transform={`translate(${60 + k * 222} 130) scale(${0.72 * clamp(back((t - 29.3 - k * 0.3) / 0.5))})`}>
              <NightPass c={cs} />
              <text y={NIGHT_H + 34} fontSize={20} fontWeight={900} fill={SC.text}>{name}</text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
