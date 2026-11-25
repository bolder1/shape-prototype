'use client';
// Scene for ld.3-2: Shalini runs all five designers the same way, and it fits one of them. She asks two questions about
// each piece of work (how able, how keen) and a skill × will grid appears. Tanmay's first study lands in direct; after
// it goes badly he drops to coach; Irfan, able but quiet, is support; Neelam's dark mode is delegate. Then Aditya's
// three pieces of work land in three quadrants: style is per task, not per person. Pure function of t (0–36). Also
// exports `STYLE_FILL`, `STYLE_LABEL` and `quadrant`, which `style-pick` uses.
import type { LeadStyle } from '@shape/content';
import { at, back, clamp, Grid, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per style; white text on each passes 4.5:1. */
export const STYLE_FILL: Record<LeadStyle, string> = { direct: '#175CD3', coach: '#6941C6', support: '#B54708', delegate: '#067647' };
export const STYLE_LABEL: Record<LeadStyle, string> = { direct: 'Direct', coach: 'Coach', support: 'Support', delegate: 'Delegate' };
/** Where each style sits on the grid: column 0 is low skill, row 0 is high will. */
export const quadrant: Record<LeadStyle, { col: 0 | 1; row: 0 | 1 }> = {
  direct: { col: 0, row: 0 }, delegate: { col: 1, row: 0 }, coach: { col: 0, row: 1 }, support: { col: 1, row: 1 },
};
const AVATAR = '#344054';
const GX = 32, GY = 64, QW = 160, QH = 126;
/** The centre of a quadrant, nudged by `dx` so several people can share one. */
const spot = (s: LeadStyle, dx = 0) => [GX + quadrant[s].col * QW + 100 + dx, GY + quadrant[s].row * QH + 82] as const;

function Board({ k = 1 }: { k?: number }) {
  return (
    <g opacity={k}>
      {(Object.keys(quadrant) as LeadStyle[]).map(s => {
        const x = GX + quadrant[s].col * QW, y = GY + quadrant[s].row * QH;
        return (
          <g key={s}>
            <rect x={x} y={y} width={QW - 4} height={QH - 4} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            <rect x={x} y={y} width={8} height={QH - 4} rx={3} fill={STYLE_FILL[s]} />
            <text x={x + 20} y={y + 32} fontSize={21} fontWeight={900} fill={SC.text}>{STYLE_LABEL[s]}</text>
          </g>
        );
      })}
      <text x={GX} y={GY + 2 * QH + 24} fontSize={21} fontWeight={800} fill={SC.muted}>Skill on this task →</text>
      <text x={GX + 2 * QW + 4} y={GY + 20} fontSize={21} fontWeight={800} fill={SC.muted}>↑ Will</text>
    </g>
  );
}

function Person({ x, y, n, k = 1 }: { x: number; y: number; n: string; k?: number }) {
  return (
    <g opacity={k}>
      <circle cx={x} cy={y} r={20} fill={AVATAR} />
      <text x={x} y={y + 8} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle">{n}</text>
    </g>
  );
}

/** Text on the right of the grid. */
function Side({ lines, k, y = 120 }: { lines: string[]; k: number; y?: number }) {
  return <g opacity={k}>{lines.map((l, i) => <text key={l} x={368} y={y + i * 30} fontSize={21} fontWeight={i === 0 ? 900 : 800} fill={i === 0 ? SC.text : SC.muted}>{l}</text>)}</g>;
}

export function SkillWillScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'One style for all' : t < 11 ? 'Two questions' : t < 16 ? 'Direct' : t < 21 ? 'Coach' : t < 26 ? 'Support' : t < 31 ? 'Delegate' : 'Per task, not per person';
  const [tx, ty] = t < 16 ? spot('direct') : at(spot('direct'), spot('coach'), p(t, 16.3, 17.4));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Shalini gives all five designers the same weekly check-in. Tanmay, new and eager, flounders; Neelam, her most experienced designer, feels watched. She asks two questions about each piece of work: how able is this person at it, and how keen? A grid appears with skill across and will up. Tanmay’s first usability study is high will and low skill: direct, with a template, the steps and a first session together. When the study goes badly and his will drops, he moves to coach: explain why and plan the next one together. Irfan is able but has gone quiet: support, listen and clear the way. Neelam wants to own dark mode, which she has done before: delegate. Aditya’s first CFO review is direct, his blocked refund flow is coach, and UPI autopay is delegate: one person, three styles.">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            {(['T', 'P', 'A', 'I', 'N'] as const).map((n, i) => (
              <g key={n} opacity={p(t, 0.3 + i * 0.3, 0.8 + i * 0.3)}>
                <Person x={80 + i * 120} y={110} n={n} />
                <rect x={32 + i * 120} y={146} width={96} height={34} rx={8} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={80 + i * 120} y={170} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="middle">weekly</text>
              </g>
            ))}
            <g opacity={p(t, 2.6, 3.2)}>
              <text x={32} y={236} fontSize={21} fontWeight={900} fill={SC.error}>Tanmay: no one showed him how.</text>
              <text x={32} y={268} fontSize={21} fontWeight={900} fill={SC.error}>Neelam: feels watched.</text>
            </g>
            <text x={32} y={322} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 4, 4.6)}>The same touch for everyone fits about one.</text>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g>
            <Board k={p(t, 7.6, 8.6)} />
            <Side k={p(t, 6.2, 6.8)} lines={['On this work:', 'How able are', 'they? How keen?']} y={110} />
            <Side k={p(t, 9, 9.6)} lines={['Skill: how much', 'to tell.', 'Will: how much', 'to back.']} y={210} />
          </g>
        )}

        {t >= 11 && t < 21 && (
          <g>
            <Board />
            <Person x={tx} y={ty} n="T" k={p(t, 11.3, 12)} />
            {t < 16
              ? <Side k={p(t, 12.2, 12.8)} lines={['First study, keen,', 'never written a', 'script. Template,', 'steps, first', 'session together.']} />
              : <Side k={p(t, 17.6, 18.2)} lines={['No-shows, and a PM', 'called it obvious.', 'Explain why,', 'plan the next one', 'together.']} />}
          </g>
        )}

        {t >= 21 && t < 31 && (() => {
          const [ix, iy] = spot('support');
          const [nx, ny] = spot('delegate');
          return (
            <g>
              <Board />
              <Person x={spot('coach')[0]} y={spot('coach')[1]} n="T" k={0.45} />
              <Person x={ix} y={iy} n="I" k={p(t, 21.3, 22)} />
              {t >= 26 && <Person x={nx} y={ny} n="N" k={p(t, 26.3, 27)} />}
              {t < 26
                ? <Side k={p(t, 22.2, 22.8)} lines={['Able, gone quiet', 'since his promo', 'was deferred.', 'Listen, ask, clear', 'the way.']} />
                : <Side k={p(t, 27.2, 27.8)} lines={['Did dark mode', 'before; wants it.', 'Agree the outcome', 'and step back.']} />}
            </g>
          );
        })()}

        {t >= 31 && (() => {
          const pts = (['direct', 'coach', 'delegate'] as const).map(s => spot(s, -40));
          const k = p(t, 31.6, 33);
          return (
            <g>
              <Board />
              <path d={`M${pts[0][0]} ${pts[0][1]} L${pts[1][0]} ${pts[1][1]} M${pts[0][0]} ${pts[0][1]} L${pts[2][0]} ${pts[2][1]}`} stroke={SC.muted} strokeWidth={3} strokeDasharray="6 6" opacity={k} />
              {pts.map(([x, y], i) => <Person key={i} x={x} y={y} n="A" k={p(t, 31.3 + i * 0.4, 31.8 + i * 0.4)} />)}
              <Side k={p(t, 33, 33.6)} lines={['Aditya: CFO review,', 'blocked refunds,', 'UPI autopay.', 'Three styles.', 'The 1:1 tells which.']} />
            </g>
          );
        })()}
      </g>
    </svg>
  );
}
