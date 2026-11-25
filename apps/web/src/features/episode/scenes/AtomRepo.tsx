'use client';
// Scene for rs.6-2: Siddharth cuts Musafir's old refund decks into a repository of atoms (`MUSAFIR_ATOMS`). Facts carry
// their study (`MUSAFIR_STUDIES`); two facts from different studies hold up an insight; a recommendation links to the
// insight, so it can be traced down (`studiesBehind`). An insight from one study waits (`atomLane`). Priya searches
// “refund” and finds the chain in seconds; a new study's fact links to the same insight and it grows stronger.
// Pure function of t (0–36). Also exports `ATOM_TONE` for `atom-build`.
import { MUSAFIR_ATOMS, MUSAFIR_STUDIES, studiesBehind, type AtomLane } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
export const ATOM_TONE: Record<AtomLane, string> = { fact: SC.discover, insight: SC.design, rec: SC.grow, fix: SC.error };

function Para({ x, y, w, h, size = 15, weight = 800, children, muted }: { x: number; y: number; w: number; h: number; size?: number; weight?: number; children: React.ReactNode; muted?: boolean }) {
  return (
    <foreignObject x={x} y={y} width={w} height={h}>
      <p style={{ margin: 0, font: `${weight} ${size}px/1.35 Inter, system-ui, sans-serif`, color: muted ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)' }}>{children}</p>
    </foreignObject>
  );
}

/** One note in the graph, `k` its fade-in. */
function Note({ x, y, w = 250, h = 96, kind, label, text, k, dashed }: { x: number; y: number; w?: number; h?: number; kind: AtomLane; label: string; text: string; k: number; dashed?: boolean }) {
  return (
    <g transform={`translate(${x} ${y + (1 - k) * 14})`} opacity={k}>
      <rect width={w} height={h} rx={12} fill={SC.surface} stroke={ATOM_TONE[kind]} strokeWidth={2.5} strokeDasharray={dashed ? '6 5' : undefined} />
      <text x={14} y={22} fontSize={11} fontWeight={900} fill={SC.muted}>{label}</text>
      <Para x={14} y={28} w={w - 28} h={h - 32} size={12.5}>{text}</Para>
    </g>
  );
}

function Link({ x1, y1, x2, y2, k }: { x1: number; y1: number; x2: number; y2: number; k: number }) {
  const mx = lerp(x1, x2, k), my = lerp(y1, y2, k);
  return <path d={`M${x1} ${y1} C${x1 + 40} ${y1} ${mx - 40} ${my} ${mx} ${my}`} fill="none" stroke={SC.muted} strokeWidth={2} opacity={k} />;
}

const FACT_X = 60, INS_X = 360, REC_X = 660;

export function AtomRepoScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'The third time' : t < 11 ? 'Cut into facts' : t < 16 ? 'Insights link facts' : t < 21 ? 'Recommendations link insights' : t < 26 ? 'One study isn’t enough' : t < 31 ? 'Search, ten seconds' : 'It gets stronger';
  const A = MUSAFIR_ATOMS;
  const graph = t >= 6 && t < 26;
  const query = 'refund'.slice(0, Math.round(lerp(0, 6, p(t, 26.4, 27.6))));
  const behind = studiesBehind('refundDate');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Musafir has answered why people call about refunds twice, in decks nobody can find. Siddharth cuts the studies into facts, each with its source. A fact from the refund interviews and one from support tickets hold up an insight: people call because they can't see when the money will arrive. A recommendation, show the date the refund will arrive, links to that insight. An insight resting on one diary study waits for a second. Priya searches refund and finds the chain in seconds, and a new study's fact links to the same insight, making it stronger.">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g transform="translate(60 100)">
            {[{ name: 'Refunds deep-dive', when: 'March 2025 · 46 slides' }, { name: 'Refund interviews', when: 'August 2026 · 38 slides' }].map((d, i) => (
              <g key={d.name} transform={`translate(${i * 300} ${i * 20})`} opacity={p(t, 0.3 + i * 0.9, 0.8 + i * 0.9)}>
                {[2, 1, 0].map(j => <rect key={j} x={j * 8} y={j * 8} width={250} height={160} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} />)}
                <text x={20} y={52} fontSize={20} fontWeight={900} fill={SC.text}>{d.name}</text>
                <text x={20} y={80} fontSize={13} fontWeight={800} fill={SC.muted}>{d.when}</text>
                <text x={20} y={140} fontSize={12} fontWeight={800} fill={SC.muted}>Opened twice since</text>
              </g>
            ))}
            <g transform="translate(640 20)" opacity={p(t, 2.8, 3.4)}>
              <rect width={200} height={150} rx={16} fill={SC.surface} stroke={SC.error} strokeWidth={2.5} />
              <text x={20} y={64} fontSize={48} fontWeight={900} fill={SC.text}>3rd</text>
              <Para x={20} y={80} w={170} h={60} size={13}>time someone asks why people call about refunds</Para>
            </g>
          </g>
        )}

        {graph && (
          <g>
            <text x={FACT_X} y={100} fontSize={12} fontWeight={900} fill={SC.muted}>FACTS</text>
            <text x={INS_X} y={100} fontSize={12} fontWeight={900} fill={SC.muted} opacity={p(t, 11, 11.5)}>INSIGHTS</text>
            <text x={REC_X} y={100} fontSize={12} fontWeight={900} fill={SC.muted} opacity={p(t, 16, 16.5)}>RECOMMENDATIONS</text>
            <Note x={FACT_X} y={116} kind="fact" label={MUSAFIR_STUDIES.interviews} text={A.whenMoney.text} k={p(t, 6.4, 7.2)} />
            <Note x={FACT_X} y={228} kind="fact" label={MUSAFIR_STUDIES.tickets} text={A.where48.text} k={p(t, 7.6, 8.4)} />
            <Note x={FACT_X} y={380} kind="fact" label={MUSAFIR_STUDIES.diary} text={A.landmarkSent.text} k={p(t, 8.8, 9.6)} />
            <Link x1={FACT_X + 250} y1={164} x2={INS_X} y2={210} k={p(t, 11.4, 12.4)} />
            <Link x1={FACT_X + 250} y1={276} x2={INS_X} y2={210} k={p(t, 11.8, 12.8)} />
            <Note x={INS_X} y={162} kind="insight" label="Insight · 2 studies" text={A.uncertain.text} k={p(t, 12.6, 13.4)} />
            <Link x1={INS_X + 250} y1={210} x2={REC_X} y2={210} k={p(t, 16.4, 17.4)} />
            <Note x={REC_X} y={162} kind="rec" label="Recommendation" text={A.refundDate.text} k={p(t, 17.2, 18)} />
            {t >= 21 && (
              <g>
                <Link x1={FACT_X + 250} y1={428} x2={INS_X} y2={428} k={p(t, 21.4, 22.2)} />
                <Note x={INS_X} y={380} kind="fix" label="Waiting · 1 study" text={A.callDriver.text} k={p(t, 22, 22.8)} dashed />
                <Para x={REC_X} y={384} w={250} h={90} size={13} muted>The fact goes in with its source. The interpretation waits until a second study says the same.</Para>
              </g>
            )}
          </g>
        )}

        {t >= 26 && (
          <g transform="translate(60 96)">
            <rect width={840} height={52} rx={26} fill={SC.surface} stroke={SC.brand} strokeWidth={2.5} />
            <text x={28} y={33} fontSize={18} fontWeight={800} fill={SC.text}>{query}<tspan fill={SC.muted}>{t < 28 ? '|' : ''}</tspan></text>
            <text x={812} y={33} fontSize={13} fontWeight={800} fill={SC.muted} textAnchor="end" opacity={p(t, 27.8, 28.2)}>0.4 s</text>
            {([['rec', A.refundDate.text], ['insight', A.uncertain.text], ['fact', A.whenMoney.text], ['fact', A.where48.text]] as const).map(([kind, text], i) => (
              <g key={text} transform={`translate(0 ${72 + i * 62})`} opacity={p(t, 28 + i * 0.3, 28.4 + i * 0.3)}>
                <rect width={840} height={52} rx={12} fill={SC.surface} stroke={ATOM_TONE[kind]} strokeWidth={2} />
                <text x={18} y={31} fontSize={11} fontWeight={900} fill={SC.muted}>{kind === 'rec' ? 'RECOMMENDATION' : kind.toUpperCase()}</text>
                <Para x={170} y={8} w={650} h={40} size={13}>{text}</Para>
              </g>
            ))}
            <g opacity={p(t, 29.6, 30.1)}>
              <text x={0} y={344} fontSize={14} fontWeight={900} fill={SC.text}>Behind the recommendation: {behind.map(s => MUSAFIR_STUDIES[s].split(' · ')[0]).join(' and ')}</text>
            </g>
            {t >= 31 && (
              <g transform="translate(0 362)" opacity={p(t, 31.2, 31.8)}>
                <rect width={840} height={64} rx={14} fill={SC.surface} stroke={ATOM_TONE.fact} strokeWidth={2.5} strokeDasharray={t < 32.6 ? '6 5' : undefined} />
                <Para x={18} y={10} w={600} h={48} size={13}>New, Dec 2026 usability test: 5 of 6 people looked for a date on the cancel screen before tapping Cancel</Para>
                <text x={822} y={38} fontSize={15} fontWeight={900} fill={SC.text} textAnchor="end" opacity={p(t, 32.6, 33.2)}>Insight · {behind.length + Math.round(p(t, 33.2, 33.8))} studies</text>
              </g>
            )}
          </g>
        )}
      </g>
    </svg>
  );
}
