'use client';
// Scene for ds.2-3: Rasta's token file after two years (tealNew, primaryBtnFinal, blue2, color-grey-light…). Arjun
// needs the Renew button's hover colour, finds three likely names and picks blue2, the old logo's colour. Then a
// grammar appears (category · concept · variant · state) and the file is rewritten line by line: jobs instead of looks,
// no versions, one order, one style. It ends with autocomplete offering exactly the right names. Pure function of t (0–34).
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
const MONO = 'ui-monospace, Consolas, monospace';

/** Each line of the old file, what it becomes (null: removed), its value, and when it's rewritten. */
const LINES = [
  { old: 'tealNew', next: 'color-action-primary', value: '#0F766E', at: 21 },
  { old: 'primaryBtnFinal', next: 'button-primary-bg', value: '{tealNew}', at: 21.8 },
  { old: 'blue2', next: null, value: '#1D4ED8', at: 22.6 },
  { old: 'hover-primary', next: 'color-action-primary-hover', value: '#115E59', at: 12.4 },
  { old: 'color-grey-light', next: 'color-text-secondary', value: '#475467', at: 16 },
  { old: 'errorRed', next: 'color-feedback-error', value: '#DC2626', at: 17 },
  { old: 'color_surface_raised', next: 'color-surface-raised', value: '#FCFCFD', at: 25 },
  { old: 'space17', next: 'space-4', value: '16px', at: 26 },
] as const;
const NEW_VALUE: Record<string, string> = { 'button-primary-bg': '{color-action-primary}', 'space-4': '16px' };
const SLOTS = [['color', 'category'], ['action', 'concept'], ['primary', 'variant'], ['hover', 'state']] as const;

export function TokenNamesScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const FX = 40, FY = 150, LH = 40;
  const guess = t >= 5 && t < 10.4;
  const suspects = ['tealNew', 'primaryBtnFinal', 'blue2'];
  const grammar = p(t, 10, 10.6);
  const auto = p(t, 29, 29.6);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a messy token file leads a developer to pick the wrong colour, then a naming grammar rewrites every line so autocomplete offers the right name">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      {/* the token file */}
      <g transform={`translate(${FX} ${lerp(FY + 20, FY, intro)})`} opacity={intro * (1 - auto * 0.7)}>
        <rect x={-16} y={-46} width={560} height={LINES.length * LH + 66} rx={16} fill="#0C111D" />
        <text x={0} y={-18} fontSize={13} fontWeight={700} fill="#98A2B3" fontFamily={MONO}>tokens.json · Rasta</text>
        {LINES.map((l, k) => {
          const y = 14 + k * LH, done = p(t, l.at, l.at + 0.6), suspect = guess && suspects.includes(l.old);
          const wrong = l.old === 'blue2' && t >= 8 && t < 10.4;
          return (
            <g key={l.old} transform={`translate(0 ${y})`}>
              {suspect && <rect x={-8} y={-22} width={536} height={34} rx={8} fill={wrong ? SC.error : '#FBBF24'} opacity={wrong ? 0.35 : 0.16 * p(t, 5.6 + k * 0.4, 6 + k * 0.4)} />}
              <text fontSize={15} fontWeight={700} fill="#F2F4F7" fontFamily={MONO} opacity={1 - done} textDecoration={done > 0 && !l.next ? 'line-through' : undefined}>{l.old}</text>
              {l.next && <text fontSize={15} fontWeight={800} fill="#5EEAD4" fontFamily={MONO} opacity={done}>{l.next}</text>}
              {!l.next && <text x={180} fontSize={13} fontWeight={700} fill="#F87171" opacity={done}>removed: the old logo blue</text>}
              <text x={520} textAnchor="end" fontSize={13} fontWeight={600} fill="#98A2B3" fontFamily={MONO} opacity={l.next ? 1 : 1 - done}>{done > 0.5 && l.next ? NEW_VALUE[l.next] ?? l.value : l.value}</text>
            </g>
          );
        })}
      </g>

      {/* Arjun's guess */}
      {guess && (
        <g transform="translate(640 170)" opacity={p(t, 5, 5.5) * (1 - p(t, 10, 10.4))}>
          <text fontSize={20} fontWeight={900} fill={SC.text}>Arjun needs: Renew, hover</text>
          <text y={34} fontSize={15} fontWeight={700} fill={SC.muted}>Three names look right.</text>
          <text y={58} fontSize={15} fontWeight={700} fill={SC.muted}>None says what it’s for.</text>
          {t >= 8 && (
            <g opacity={p(t, 8, 8.4)}>
              <text y={104} fontSize={17} fontWeight={900} fill={SC.error} fontFamily={MONO}>blue2 ✗</text>
              <text y={130} fontSize={14} fontWeight={700} fill={SC.muted}>The blue from the old logo.</text>
            </g>
          )}
        </g>
      )}

      {/* the grammar */}
      {grammar > 0 && (
        <g transform="translate(40 34)" opacity={grammar * (1 - auto)}>
          {SLOTS.map(([word, kind], k) => {
            const x = k * 150, fill = p(t, 11 + k * 0.4, 11.4 + k * 0.4);
            return (
              <g key={kind} transform={`translate(${x} 0)`}>
                <rect width={136} height={44} rx={10} fill={SC.surface} stroke={k === 3 ? SC.discover : SC.brand} strokeWidth={2} />
                <text x={68} y={28} textAnchor="middle" fontSize={16} fontWeight={900} fill={SC.text} fontFamily={MONO} opacity={fill}>{word}</text>
                <text x={68} y={64} textAnchor="middle" fontSize={12} fontWeight={800} fill={SC.muted}>{kind}</text>
                {k < 3 && <text x={143} y={28} textAnchor="middle" fontSize={18} fontWeight={900} fill={SC.muted}>-</text>}
              </g>
            );
          })}
        </g>
      )}

      {/* side notes for each act */}
      {[
        [14.6, 19.6, 'Name the job, not the look', 'Hues and shades live in primitives only.'],
        [20, 24, 'No new, final or 2', 'History lives in git, not in names.'],
        [24, 28.6, 'One style', 'kebab-case, like CSS: --color-text-secondary'],
      ].map(([a, b, h, s]) => t >= (a as number) && t < (b as number) && (
        <g key={h as string} transform="translate(640 230)" opacity={p(t, a as number, (a as number) + 0.5) * (1 - p(t, (b as number) - 0.4, b as number))}>
          <text fontSize={20} fontWeight={900} fill={SC.text}>{h}</text>
          <text y={30} fontSize={14} fontWeight={700} fill={SC.muted}>{s}</text>
        </g>
      ))}

      {/* autocomplete */}
      {auto > 0 && (
        <g transform="translate(300 120)" opacity={auto}>
          <rect width={420} height={52} rx={12} fill={SC.surface} stroke={SC.brand} strokeWidth={2.5} />
          <text x={20} y={33} fontSize={18} fontWeight={800} fill={SC.text} fontFamily={MONO}>{'color-action-'.slice(0, Math.round(lerp(0, 13, p(t, 29.4, 30.6))))}</text>
          {['primary', 'primary-hover', 'secondary', 'danger'].map((s, k) => {
            const on = s === 'primary-hover' && t >= 31.6;
            return (
              <g key={s} transform={`translate(0 ${70 + k * 46})`} opacity={p(t, 30.8 + k * 0.15, 31.2 + k * 0.15)}>
                <rect width={420} height={40} rx={10} fill={on ? SC.brand : SC.surface} stroke={SC.line} />
                <text x={20} y={26} fontSize={16} fontWeight={700} fill={on ? '#fff' : SC.text} fontFamily={MONO}>color-action-{s}</text>
                {on && <text x={400} y={26} textAnchor="end" fontSize={16} fontWeight={900} fill="#fff">✓</text>}
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
}
