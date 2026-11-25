'use client';
// Scene for ax.3-2: Hazri's four personas hung on every squad's wall while "Accessible Arun" sat in a folder, so the
// payroll squad designed for the four. Then: a diagnosis rewritten as a need, pity cut, every line held to evidence
// (`PERSONA_SESSIONS`), access needs folded into Revathi's core card (`REVATHI`, `HAZRI_LINES`), a review with the
// people described, and a design review that checks against her. Pure function of t (0–36). Also exports
// `VERDICT_FILL`, which `persona-crit` uses.
import { HAZRI_LINES, PERSONA_SESSIONS, REVATHI, type PersonaFlaw } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per persona verdict; white text on each passes 4.5:1. */
export const VERDICT_FILL: Record<PersonaFlaw, string> = { keep: '#067647', stereotype: '#B42318', unfounded: '#175CD3', diagnosis: '#6941C6' };

const CORE = [['Revathi', 'Payroll officer'], ['Manoj', 'Store manager'], ['Aisha', 'New joiner'], ['Prakash', 'Shift worker']] as const;

export function PersonaRewriteScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'The fifth persona' : t < 11 ? 'Needs, not diagnoses' : t < 16 ? 'Cut pity and heroes' : t < 21 ? 'Every line has evidence' : t < 26 ? 'Into the core' : t < 31 ? 'Checked with the people' : 'Put it to work';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Hazri has four personas on every squad's wall, ${CORE.map(([n, r]) => `${n}, ${r.toLowerCase()}`).join('; ')}, and a fifth, “Accessible Arun, 34, blind”, in a folder nobody opens. “Has retinitis pigmentosa” is rewritten as a need: she misses anything at the edges of the screen. “Inspiring, never lets her condition stop her” is cut, because it is about the writer's feelings. Every line is held to evidence: “Works at 200% zoom” was seen in ${HAZRI_LINES.zoom.evidence} of ${PERSONA_SESSIONS} sessions and stays; “Loves dark mode” was seen in none and goes. Revathi's core card now carries her setup, context and barriers. Revathi and the employee disability network review the cards, and two lines change. Design review asks whether each screen works for Revathi at 200% zoom, and the payroll table stops scrolling sideways.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            {CORE.map(([n], i) => (
              <g key={n} opacity={p(t, 0.3 + i * 0.4, 0.8 + i * 0.4)}>
                <rect x={32 + i * 146} y={72} width={134} height={120} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <circle cx={99 + i * 146} cy={114} r={24} fill={SC.line} />
                <text x={99 + i * 146} y={170} fontSize={21} fontWeight={900} fill={SC.text} textAnchor="middle">{n}</text>
              </g>
            ))}
            <g opacity={lerp(0, 0.55, p(t, 2.2, 3))}>
              <rect x={32} y={236} width={360} height={64} rx={12} fill={SC.surface} stroke={SC.muted} strokeWidth={2} strokeDasharray="6 6" />
              <text x={52} y={276} fontSize={21} fontWeight={800} fill={SC.muted}>Accessible Arun, 34, blind</text>
            </g>
            <text x={416} y={276} fontSize={21} fontWeight={900} fill={SC.error} opacity={p(t, 3.6, 4.2)}>Opened: never</text>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g>
            <g opacity={p(t, 6.2, 6.8)}>
              <rect x={32} y={76} width={576} height={64} rx={12} fill={SC.surface} stroke={VERDICT_FILL.diagnosis} strokeWidth={2} />
              <text x={52} y={116} fontSize={22} fontWeight={800} fill={SC.muted} textDecoration={t > 7.6 ? 'line-through' : undefined}>{HAZRI_LINES.rp.text}</text>
            </g>
            <path d="M 320 150 L 320 182" stroke={VERDICT_FILL.keep} strokeWidth={4} opacity={p(t, 7.8, 8.2)} />
            <path d="M 310 174 L 320 186 L 330 174" fill="none" stroke={VERDICT_FILL.keep} strokeWidth={4} opacity={p(t, 7.8, 8.2)} />
            <g opacity={p(t, 8.2, 8.8)}>
              <rect x={32} y={196} width={576} height={96} rx={12} fill={VERDICT_FILL.keep} />
              <text x={52} y={236} fontSize={21} fontWeight={900} fill="#fff">Misses anything at the edges of the</text>
              <text x={52} y={266} fontSize={21} fontWeight={900} fill="#fff">screen, like a toast in the top right</text>
            </g>
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g>
            <g opacity={1 - p(t, 14, 15)}>
              <rect x={32} y={86} width={576} height={64} rx={12} fill={SC.surface} stroke={VERDICT_FILL.stereotype} strokeWidth={2} />
              <text x={52} y={126} fontSize={21} fontWeight={800} fill={SC.text} textDecoration={t > 12.4 ? 'line-through' : undefined}>“Inspiring: never lets her condition stop her”</text>
            </g>
            <text x={32} y={200} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 12.6, 13.2)}>About the writer’s feelings, not her work.</text>
            <text x={32} y={240} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 13.2, 13.8)}>Pity and heroism both make her a symbol.</text>
            <text x={32} y={300} fontSize={22} fontWeight={900} fill={VERDICT_FILL.stereotype} opacity={p(t, 14.6, 15.2)}>Cut.</text>
          </g>
        )}

        {t >= 16 && t < 21 && (
          <g>
            {([['zoom', 'Works at 200% zoom', 1], ['darkMode', 'Loves dark mode', 0]] as const).map(([k, short, keep], i) => {
              const l = HAZRI_LINES[k];
              const grow = p(t, 16.6 + i * 1.4, 17.6 + i * 1.4);
              return (
                <g key={k} opacity={p(t, 16.2 + i * 1.4, 16.8 + i * 1.4)}>
                  <text x={32} y={98 + i * 116} fontSize={21} fontWeight={900} fill={SC.text}>{short}</text>
                  <rect x={32} y={114 + i * 116} width={400} height={20} rx={10} fill={SC.surface} stroke={SC.line} />
                  <rect x={32} y={114 + i * 116} width={Math.max(0.01, (400 * l.evidence) / PERSONA_SESSIONS) * grow} height={20} rx={10} fill={VERDICT_FILL.unfounded} />
                  <text x={448} y={131 + i * 116} fontSize={21} fontWeight={800} fill={SC.text}>{l.evidence} of {PERSONA_SESSIONS} sessions</text>
                  <text x={32} y={166 + i * 116} fontSize={21} fontWeight={900} fill={keep ? VERDICT_FILL.keep : VERDICT_FILL.stereotype} opacity={p(t, 18 + i * 1.4, 18.5 + i * 1.4)}>{keep ? 'Stays' : 'Goes, until research shows it'}</text>
                </g>
              );
            })}
          </g>
        )}

        {t >= 21 && t < 31 && (() => {
          const rows = ['200% zoom, Windows high contrast on', 'Misses anything at the screen’s edges', 'Writes notes to supervisors in Tamil', 'Payroll for 1,200 workers by the 28th'];
          const revised = ['', 'Misses status messages at the edges', '', 'Pays 1,200 workers; late screen, late pay'];
          const reviewed = t >= 26;
          return (
            <g>
              <rect x={32} y={64} width={576} height={276} rx={16} fill={SC.surface} stroke={SC.text} strokeWidth={2} />
              <circle cx={78} cy={108} r={26} fill={SC.line} />
              <text x={118} y={104} fontSize={22} fontWeight={900} fill={SC.text}>{REVATHI.name}, {REVATHI.age}</text>
              <text x={118} y={130} fontSize={21} fontWeight={700} fill={SC.muted}>Payroll officer, Coimbatore</text>
              {rows.map((r, i) => {
                const changed = reviewed && (i === 1 || i === 3);
                return (
                  <g key={i} opacity={p(t, 21.6 + i * 0.6, 22.2 + i * 0.6)}>
                    <rect x={52} y={158 + i * 44} width={8} height={30} rx={4} fill={changed ? VERDICT_FILL.unfounded : VERDICT_FILL.keep} />
                    <text x={72} y={181 + i * 44} fontSize={21} fontWeight={700} fill={SC.text}>{changed ? revised[i] : r}</text>
                  </g>
                );
              })}
              {reviewed && <text x={592} y={104} fontSize={21} fontWeight={900} fill={VERDICT_FILL.unfounded} textAnchor="end" opacity={p(t, 27.4, 28)}>2 lines changed</text>}
            </g>
          );
        })()}

        {t >= 31 && (() => {
          const fix = p(t, 32.8, 34.4);
          return (
            <g>
              <text x={32} y={88} fontSize={21} fontWeight={900} fill={SC.text} opacity={p(t, 31.2, 31.8)}>“Does this work for Revathi at 200%?”</text>
              <clipPath id="persona-table-clip"><rect x={32} y={112} width={576} height={216} rx={14} /></clipPath>
              <rect x={32} y={112} width={576} height={216} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <g clipPath="url(#persona-table-clip)">
              {['Employee', 'Days', 'Gross', 'Net'].map((h, i) => {
                const x = lerp(52 + i * 190, 52, fix), y = lerp(150, 150 + i * 46, fix);
                return (
                  <g key={h}>
                    <text x={x} y={y} fontSize={21} fontWeight={900} fill={SC.text}>{h}</text>
                    <text x={x + lerp(0, 150, fix)} y={y + lerp(36, 0, fix)} fontSize={21} fontWeight={700} fill={SC.muted}>{['S. Murugan', '26', '₹18,400', '₹16,950'][i]}</text>
                  </g>
                );
              })}
              </g>
              <text x={608} y={348} fontSize={21} fontWeight={800} fill={fix > 0.9 ? VERDICT_FILL.keep : SC.error} textAnchor="end">{fix > 0.9 ? 'Reflows. No sideways scroll.' : 'Scrolls sideways at 200%'}</text>
            </g>
          );
        })()}
      </g>
    </svg>
  );
}
