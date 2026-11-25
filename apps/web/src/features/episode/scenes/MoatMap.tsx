'use client';
// Scene for st.4-1: Munim's new invoices are copied by a rival in six weeks, so Aarti tests every claimed design
// advantage for value, fit and time to copy (`MUNIM_CLAIMS`, `advantageCall`), finds what lasts behind the screen, and
// writes the strategy as Rumelt's kernel (`STRATEGY_KERNEL`). Pure function of t (0–36). Also exports `MOAT_FILL`,
// `moatRow` and `moatCol`, which `moat-crit` uses to draw the same map.
import { COPY_MONTHS, MUNIM_CLAIMS, STRATEGY_KERNEL, advantageCall, type AdvantageCall, type AdvantageClaim, type MunimClaim } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per call; white text on each passes 4.5:1. */
export const MOAT_FILL: Record<AdvantageCall, string> = { holds: '#067647', copyable: '#175CD3', unvalued: '#B42318', offstrategy: '#6941C6' };

/** The map's rows, top first: valued by the customers Munim serves, valued by someone else, not valued. */
export const MOAT_ROWS = ['ours', 'others', 'none'] as const;
export type MoatRow = (typeof MOAT_ROWS)[number];
export const MOAT_ROW_LABEL: Record<MoatRow, string> = { ours: 'Munim’s customers value it', others: 'Others value it', none: 'Nobody chooses for it' };
export const moatRow = (c: AdvantageClaim): MoatRow => (!c.valued ? 'none' : !c.fits ? 'others' : 'ours');
/** The map's columns: copied within a year, or a year or more. */
export const moatCol = (c: AdvantageClaim) => (c.copyMonths < COPY_MONTHS ? 'soon' : 'late') as 'soon' | 'late';

const KEYS = Object.keys(MUNIM_CLAIMS) as MunimClaim[];
/** Words to lines of at most `n` characters. */
const wrap = (s: string, n: number) => s.split(' ').reduce<string[]>((ls, w) => {
  const last = ls[ls.length - 1];
  if (last !== undefined && (last + ' ' + w).length <= n) ls[ls.length - 1] = last + ' ' + w; else ls.push(w);
  return ls;
}, []);
const MENTIONS: [string, number, boolean][] = [['Works offline', 58, true], ['Clean GST returns', 44, true], ['Their CA uses it', 39, true], ['Smooth animations', 0, false], ['Design awards', 0, false]];

export function MoatMapScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'Copied in six weeks' : t < 11 ? '“Beautiful, premium design”' : t < 16 ? 'Valued?' : t < 21 ? 'Hard to copy?' : t < 26 ? 'Behind the screen' : t < 31 ? 'The kernel' : 'It decides things';
  const holds = KEYS.filter(k => advantageCall(MUNIM_CLAIMS[k]) === 'holds');

  // The moat map: x = months to copy (0–30), y = row.
  const mx = (m: number) => 200 + (Math.min(m, 30) / 30) * 400;
  const my = (r: MoatRow) => 92 + MOAT_ROWS.indexOf(r) * 78;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Munim launches cleaner invoices with a QR code to pay, and Hisaably, a rival, ships the same layout six weeks later. Aarti’s first draft calls “beautiful, premium design” the advantage, and she strikes it out. In 120 switching interviews, shops name offline billing, clean GST returns and their CA using Munim; nobody names animations or awards. She maps every claim by who values it and how many months a funded rival needs to copy it, with a line at ${COPY_MONTHS} months. Only ${holds.map(k => MUNIM_CLAIMS[k].short.toLowerCase()).join(', ')} hold, because they rest on research and data, a network and hard capability. The strategy is written as a kernel: ${STRATEGY_KERNEL.map(k => `${k.part}: ${k.text}`).join(' ')} It decides things: the enterprise look, the Gen Z brand and US sales tax stop; monthly CA research, one design system and offline first start.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (() => {
          const weeks = Math.round(lerp(0, 6, p(t, 1.2, 4.4)));
          const copy = p(t, 3.6, 4.6);
          const invoice = (x: number, name: string, o: number) => (
            <g transform={`translate(${x} 72)`} opacity={o}>
              <rect width={252} height={196} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text x={20} y={38} fontSize={21} fontWeight={900} fill={SC.text}>{name}</text>
              {[64, 88, 112].map(y => <rect key={y} x={20} y={y} width={132} height={10} rx={5} fill={SC.line} />)}
              <rect x={172} y={60} width={60} height={60} rx={6} fill="none" stroke={SC.text} strokeWidth={3} />
              <rect x={184} y={72} width={14} height={14} fill={SC.text} /><rect x={206} y={94} width={14} height={14} fill={SC.text} />
              <text x={20} y={168} fontSize={21} fontWeight={800} fill={SC.muted}>Total ₹4,720</text>
            </g>
          );
          return (
            <g>
              {invoice(32, 'Munim', 1)}
              {invoice(356, 'Hisaably', copy)}
              <text x={32} y={322} fontSize={21} fontWeight={800} fill={SC.text}>Weeks since launch: <tspan fontWeight={900} fill={copy > 0.5 ? SC.error : SC.text}>{weeks}</tspan></text>
            </g>
          );
        })()}

        {t >= 6 && t < 11 && (
          <g>
            <rect x={32} y={70} width={576} height={210} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            <text x={56} y={108} fontSize={21} fontWeight={800} fill={SC.muted}>Design strategy, draft 1</text>
            <text x={56} y={150} fontSize={24} fontWeight={900} fill={SC.text}>Our advantage:</text>
            <text x={56} y={186} fontSize={24} fontWeight={900} fill={SC.text}>beautiful, premium design</text>
            <line x1={52} y1={178} x2={lerp(52, 400, p(t, 8.2, 9.2))} y2={178} stroke={SC.error} strokeWidth={4} strokeLinecap="round" />
            <text x={56} y={246} fontSize={21} fontWeight={800} fill={SC.error} opacity={p(t, 9.2, 9.8)}>Anything a rival can see, it can copy.</text>
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g>
            <text x={32} y={84} fontSize={21} fontWeight={800} fill={SC.muted}>Reasons shops gave in 120 switching interviews</text>
            {MENTIONS.map(([label, n, real], i) => {
              const k = p(t, 11.4 + i * 0.4, 12.4 + i * 0.4);
              return (
                <g key={label} opacity={clamp(k * 2)}>
                  <text x={32} y={130 + i * 46} fontSize={21} fontWeight={800} fill={SC.text}>{label}</text>
                  <rect x={250} y={112 + i * 46} width={Math.max(4, (n / 60) * 300 * k)} height={26} rx={6} fill={real ? MOAT_FILL.holds : MOAT_FILL.unvalued} />
                  <text x={262 + (n / 60) * 300 * k} y={132 + i * 46} fontSize={21} fontWeight={900} fill={SC.text}>{Math.round(n * k)}</text>
                </g>
              );
            })}
          </g>
        )}

        {t >= 16 && t < 21 && (
          <g>
            {MOAT_ROWS.map(r => (
              <g key={r}>
                <rect x={190} y={my(r) - 32} width={420} height={64} rx={10} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
                <text x={32} y={my(r) + 7} fontSize={21} fontWeight={800} fill={SC.text}>{r === 'ours' ? 'Valued by ours' : r === 'others' ? 'By others' : 'Not valued'}</text>
              </g>
            ))}
            <rect x={mx(COPY_MONTHS)} y={my('ours') - 32} width={610 - mx(COPY_MONTHS)} height={64} rx={10} fill={MOAT_FILL.holds} opacity={0.18 * p(t, 19, 19.8)} />
            <line x1={mx(COPY_MONTHS)} y1={54} x2={mx(COPY_MONTHS)} y2={314} stroke={SC.text} strokeWidth={2} strokeDasharray="6 6" />
            <text x={200} y={340} fontSize={21} fontWeight={800} fill={SC.muted}>← within a year</text>
            <text x={mx(COPY_MONTHS) + 10} y={340} fontSize={21} fontWeight={800} fill={SC.muted}>a year or more →</text>
            {KEYS.map((k, i) => {
              const c = MUNIM_CLAIMS[k];
              const jitter = ((i * 37) % 5 - 2) * 9;
              return <circle key={k} cx={mx(c.copyMonths)} cy={my(moatRow(c)) + jitter} r={holds.includes(k) ? 11 : 8} fill={MOAT_FILL[advantageCall(c)]} opacity={p(t, 16.4 + i * 0.2, 16.9 + i * 0.2)} />;
            })}
          </g>
        )}

        {t >= 21 && t < 26 && (
          <g>
            {holds.map((k, i) => {
              const c = MUNIM_CLAIMS[k];
              const lines = wrap(c.source ?? '', 46).slice(0, 2);
              return (
                <g key={k} opacity={p(t, 21.2 + i * 1.1, 21.8 + i * 1.1)}>
                  <rect x={32} y={62 + i * 94} width={576} height={84} rx={12} fill={SC.surface} stroke={MOAT_FILL.holds} strokeWidth={2} />
                  <text x={52} y={88 + i * 94} fontSize={21} fontWeight={900} fill={MOAT_FILL.holds}>{c.short}</text>
                  <text x={588} y={88 + i * 94} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="end">{c.copyMonths} months to copy</text>
                  {lines.map((l, j) => <text key={j} x={52} y={112 + i * 94 + j * 24} fontSize={21} fontWeight={700} fill={SC.text}>{l}</text>)}
                </g>
              );
            })}
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g>
            {STRATEGY_KERNEL.map((k, i) => {
              const lines = wrap(k.text, 44).slice(0, 2);
              return (
                <g key={k.part} opacity={p(t, 26.2 + i * 1.1, 26.8 + i * 1.1)}>
                  <rect x={32} y={62 + i * 94} width={576} height={84} rx={12} fill={SC.surface} stroke={MOAT_FILL.holds} strokeWidth={2} />
                  <text x={52} y={88 + i * 94} fontSize={21} fontWeight={900} fill={MOAT_FILL.holds}>{k.part}</text>
                  {lines.map((l, j) => <text key={j} x={52} y={112 + i * 94 + j * 24} fontSize={21} fontWeight={700} fill={SC.text}>{l}</text>)}
                </g>
              );
            })}
          </g>
        )}

        {t >= 31 && (
          <g>
            {([['Stop', ['Enterprise look', 'Gen Z brand', 'US sales tax'], MOAT_FILL.unvalued], ['Start', ['CA research monthly', 'One design system', 'Offline first'], MOAT_FILL.holds]] as const).map(([head, items, fill], c) => (
              <g key={head}>
                <text x={32 + c * 296} y={88} fontSize={24} fontWeight={900} fill={fill}>{head}</text>
                {items.map((s, i) => (
                  <g key={s} opacity={p(t, 31.4 + c * 1.2 + i * 0.3, 31.9 + c * 1.2 + i * 0.3)}>
                    <rect x={32 + c * 296} y={106 + i * 64} width={280} height={50} rx={25} fill={fill} />
                    <text x={172 + c * 296} y={138 + i * 64} fontSize={21} fontWeight={800} fill="#fff" textAnchor="middle">{s}</text>
                  </g>
                ))}
              </g>
            ))}
          </g>
        )}
      </g>
    </svg>
  );
}
