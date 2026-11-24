'use client';
// Scene for st.3-1: Kunal's Monday dashboard at Kahaani, a Hyderabad bedtime-story app, celebrates downloads, stories
// ever played and minutes up 40%, until the night behind the minutes shows: autoplay keeps Advik awake at 10:30 pm and
// Pooja mutes the app. Tara asks what a family gets, and the north star appears: story-nights a week. It splits into
// families × nights opened × finish share (`storyNights` over `KAHAANI_WEEK`), each team gets an input leaf, guardrails
// stand beside the tree and the running totals drop into the bin. `ROLE_FILL`, `ROLE_NAME` and `KAHAANI` are shared
// with the Wire the metric tree game. Pure function of t (0–36).
import { KAHAANI_METRICS, KAHAANI_WEEK, storyNights, type KahaaniMetric, type MetricRole } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';
import { INK, INK_MUTED } from './EaseCurves';

const W = 960, H = 540;
/** Kahaani's night indigo; white on it passes 4.5:1. */
export const KAHAANI = '#3E1C96';
/** Role colours; white on each passes 4.5:1. */
export const ROLE_FILL: Record<MetricRole, string> = { north: KAHAANI, input: '#155EEF', guardrail: '#B54708', vanity: '#475467' };
export const ROLE_NAME: Record<MetricRole, string> = { north: 'North star', input: 'Input', guardrail: 'Guardrail', vanity: 'Vanity bin' };
/** Which team owns each input. */
export const INPUT_OWNER: Partial<Record<KahaaniMetric, string>> = { firstweek: 'Onboarding', finish: 'Player', opens: 'Growth', shelf: 'Content' };

const fmt = (n: number) => n.toLocaleString('en-IN');

/** A rounded node with a label and an optional small line under it. */
function Node({ x, y, w, label, sub, fill, k = 1, solid }: { x: number; y: number; w: number; label: string; sub?: string; fill: string; k?: number; solid?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={k}>
      <rect width={w} height={sub ? 52 : 38} rx={12} fill={solid ? fill : '#FFFFFF'} stroke={fill} strokeWidth={2} />
      <text x={w / 2} y={sub ? 22 : 24} textAnchor="middle" fontSize={13} fontWeight={900} fill={solid ? '#FFFFFF' : INK}>{label}</text>
      {sub && <text x={w / 2} y={40} textAnchor="middle" fontSize={11} fontWeight={800} fill={solid ? '#FFFFFF' : INK_MUTED}>{sub}</text>}
    </g>
  );
}

const DASH = [
  { label: 'Downloads', value: '1,00,000', up: 'since launch' },
  { label: 'Stories ever played', value: '9,00,000', up: 'since launch' },
  { label: 'Minutes played', value: '+40%', up: 'since autoplay' },
];
const BRANCHES = [
  { label: 'Families listening', value: fmt(KAHAANI_WEEK.families), x: 120 },
  { label: 'Nights opened each', value: `${KAHAANI_WEEK.opens}`, x: 390 },
  { label: 'Nights finished', value: `${KAHAANI_WEEK.finish * 100}%`, x: 660 },
];
const LEAVES: { m: KahaaniMetric; x: number; under: number; at: number }[] = [
  { m: 'firstweek', x: 40, under: 0, at: 23.4 }, { m: 'opens', x: 330, under: 1, at: 24.2 },
  { m: 'finish', x: 560, under: 2, at: 25 }, { m: 'shelf', x: 740, under: 2, at: 25.8 },
];

export function MetricTreeScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const dash = t < 12.6 ? 1 - p(t, 12, 12.6) : 0;
  const tree = t >= 12 ? p(t, 12.3, 13) : 0;
  const night = p(t, 6.2, 7);
  const count = p(t, 19.5, 22);
  const total = Math.round(storyNights(KAHAANI_WEEK) * count / 100) * 100;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Kahaani's dashboard celebrates downloads, stories ever played and minutes played, while autoplay keeps a child awake late; the team picks story-nights a week as its north star, splits it into families, nights opened and the share finished, gives each team an input, adds guardrails for late listening and muted notifications, and drops the running totals into a bin">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        {dash > 0 && (
          <g opacity={dash}>
            <text x={40} y={56} fontSize={24} fontWeight={900} fill={SC.text}>Kahaani · Monday dashboard</text>
            <text x={40} y={82} fontSize={14} fontWeight={800} fill={SC.muted}>Kunal · week of 16 November</text>
            {DASH.map((d, i) => (
              <g key={d.label} transform={`translate(${40 + i * 300} 110)`} opacity={p(t, 0.5 + i * 0.6, 1.1 + i * 0.6)}>
                <rect width={270} height={130} rx={16} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={20} y={34} fontSize={14} fontWeight={800} fill={SC.muted}>{d.label}</text>
                <text x={20} y={84} fontSize={40} fontWeight={900} fill={SC.text}>{d.value}</text>
                <path d="M228 84 L242 64 L256 84 Z" fill={t > 7.5 && i === 2 ? '#B54708' : '#067647'} />
                <text x={20} y={112} fontSize={12} fontWeight={800} fill={SC.muted}>{d.up}</text>
              </g>
            ))}
            {t >= 6 && (
              <g transform="translate(40 270)" opacity={night}>
                <rect width={880} height={220} rx={20} fill="#1B0F45" />
                <circle cx={90} cy={80} r={34} fill="#FDE272" />
                <circle cx={106} cy={68} r={30} fill="#1B0F45" />
                <text x={160} y={62} fontSize={20} fontWeight={900} fill="#FFFFFF">10:30 pm, Kondapur</text>
                <text x={160} y={92} fontSize={15} fontWeight={700} fill="#E9D7FE">Autoplay starts a third story. Advik is still awake.</text>
                {[{ txt: 'Story 3 of the night · 24 min', at: 8 }, { txt: 'Pooja: notifications off', at: 9.4 }, { txt: 'Minutes up. Sleep down.', at: 10.6 }].map((x, i) => (
                  <g key={x.txt} transform={`translate(${160 + i * 240} 130)`} opacity={p(t, x.at, x.at + 0.5)}>
                    <rect width={224} height={40} rx={20} fill={i === 2 ? '#B42318' : '#3E1C96'} />
                    <text x={112} y={26} textAnchor="middle" fontSize={13} fontWeight={900} fill="#FFFFFF">{x.txt}</text>
                  </g>
                ))}
              </g>
            )}
          </g>
        )}

        {tree > 0 && (
          <g opacity={tree}>
            <text x={40} y={50} fontSize={22} fontWeight={900} fill={SC.text}>
              {t < 17 ? 'What does a family get from Kahaani?' : t < 23 ? 'Break the north star into inputs' : t < 28 ? 'A lever for each team' : t < 32 ? 'Guardrails beside the tree' : 'Totals go in the bin'}
            </text>
            <g transform={`translate(0 ${lerp(30, 0, p(t, 12.6, 13.6))})`}>
              <Node x={300} y={74} w={300} label={KAHAANI_METRICS.nights.short} sub={t >= 17 ? `≈ ${fmt(total)} this week` : 'nights a child finishes a story'} fill={ROLE_FILL.north} solid />
            </g>
            {BRANCHES.map((b, i) => {
              const k = p(t, 17.2 + i * 0.5, 17.8 + i * 0.5);
              return (
                <g key={b.label} opacity={k}>
                  <path d={`M450 126 C 450 160 ${b.x + 90} 150 ${b.x + 90} 186`} fill="none" stroke={ROLE_FILL.north} strokeWidth={2.5} />
                  <Node x={b.x} y={186} w={180} label={b.label} sub={b.value} fill={ROLE_FILL.north} />
                  {i < 2 && <text x={b.x + 225} y={218} textAnchor="middle" fontSize={22} fontWeight={900} fill={SC.muted} opacity={p(t, 18.6, 19.2)}>×</text>}
                </g>
              );
            })}
            {LEAVES.map(l => {
              const k = p(t, l.at, l.at + 0.5), b = BRANCHES[l.under];
              const m = KAHAANI_METRICS[l.m];
              return (
                <g key={l.m} opacity={k}>
                  <path d={`M${b.x + 90} 238 L${l.x + 90} 300`} stroke={ROLE_FILL.input} strokeWidth={2} strokeDasharray="5 4" />
                  <Node x={l.x} y={300} w={180} label={m.short} sub={`${INPUT_OWNER[l.m]} team`} fill={ROLE_FILL.input} />
                </g>
              );
            })}
            {(['late', 'mute'] as const).map((g, i) => (
              <g key={g} transform={`translate(${40 + i * 230} 390)`} opacity={p(t, 28.3 + i * 0.6, 28.9 + i * 0.6)}>
                <path d="M0 6 L14 0 L28 6 L28 20 C28 30 20 36 14 40 C8 36 0 30 0 20 Z" fill={ROLE_FILL.guardrail} />
                <text x={40} y={18} fontSize={13} fontWeight={900} fill={SC.text}>{KAHAANI_METRICS[g].short}</text>
                <text x={40} y={36} fontSize={11.5} fontWeight={800} fill={SC.muted}>must not rise</text>
              </g>
            ))}
            {t >= 31.6 && (
              <g transform="translate(600 400)" opacity={p(t, 31.8, 32.4)}>
                <path d="M0 0 H300 L284 110 H16 Z" fill={SC.surface} stroke={ROLE_FILL.vanity} strokeWidth={2} strokeDasharray="6 4" />
                <text x={150} y={100} textAnchor="middle" fontSize={12.5} fontWeight={900} fill={SC.muted}>Vanity: they only go up</text>
                {(['downloads', 'played'] as const).map((v, i) => {
                  const k = p(t, 32.6 + i * 0.8, 33.4 + i * 0.8);
                  return (
                    <g key={v} transform={`translate(${30 + i * 130} ${lerp(-90, 24 + i * 10, k)})`} opacity={k}>
                      <rect width={120} height={34} rx={10} fill="#FFFFFF" stroke={ROLE_FILL.vanity} strokeWidth={2} />
                      <text x={60} y={22} textAnchor="middle" fontSize={11.5} fontWeight={900} fill={INK} textDecoration="line-through">{KAHAANI_METRICS[v].short}</text>
                    </g>
                  );
                })}
              </g>
            )}
          </g>
        )}
      </g>
    </svg>
  );
}
