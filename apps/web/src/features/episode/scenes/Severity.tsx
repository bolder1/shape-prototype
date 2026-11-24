'use client';
// Scene for rs.4-3: thirty-one sticky notes from five sessions cover the wall. Kabir pulls the three easiest (a typo,
// the grey fare, the old icon) into "Done by lunch" while "Can't cancel" waits. Then every note shrinks to a dot and
// slides across by how many of the five hit it, and up by how badly: noticed, slowed, blocked. Severity zones colour
// the grid (from `severityOf`) and a ranked report fills six sprint slots, with effort in its own column.
// Pure function of t (0–34).
import { severityOf, type Severity } from '@shape/content';
import { FAMILY, FAMILY_SOLID } from '../kit';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
const X0 = 150, COL = 74, Y0 = 92, ROW = 100;   // the frequency × impact grid
const ROWS = ['Blocked', 'Slowed', 'Noticed'];

/** Severity colours: pills carry white text on the solid fills; zones use the light ones. */
export const SEV_STYLE: Record<Severity, { solid: string; zone: string; ink: string; name: string }> = {
  cosmetic: { solid: SC.line, zone: SC.line, ink: SC.text, name: 'Cosmetic' },
  minor: { solid: FAMILY_SOLID[0], zone: FAMILY[0], ink: '#fff', name: 'Minor' },
  major: { solid: FAMILY_SOLID[1], zone: FAMILY[1], ink: '#fff', name: 'Major' },
  critical: { solid: FAMILY_SOLID[3], zone: FAMILY[3], ink: '#fff', name: 'Critical' },
};

// The eight findings the game rates (numbered), then the rest of the wall.
const NAMED = [
  { n: 'Can’t cancel', u: 4, i: 3, e: 'L' }, { n: 'Paid twice', u: 2, i: 3, e: 'M' }, { n: 'Quota: GN', u: 3, i: 2, e: 'S' }, { n: 'Seat map', u: 1, i: 3, e: 'M' },
  { n: 'Date format', u: 2, i: 2, e: 'S' }, { n: 'Grey fare', u: 5, i: 1, e: 'S' }, { n: 'Old icon', u: 1, i: 1, e: 'S' }, { n: 'Two Backs', u: 2, i: 1, e: 'S' },
];
const EXTRA: [number, number][] = [[1, 1], [1, 2], [2, 1], [1, 1], [3, 1], [1, 2], [2, 2], [1, 1], [2, 1], [4, 1], [1, 1], [3, 1], [2, 1], [1, 2], [1, 1], [2, 2], [1, 1], [3, 2], [1, 1], [2, 1], [1, 3], [1, 1], [2, 1]];
const NOTES = [...NAMED.map((f, k) => ({ ...f, k })), ...EXTRA.map(([u, i], j) => ({ n: j === 0 ? 'Typo' : '', u, i, e: 'S', k: -1 }))];
const EASY = new Set(['Typo', 'Grey fare', 'Old icon']);

// a slot for every note on the wall, and inside its grid cell
const WALL = NOTES.map((_, j) => ({ x: 82 + (j % 7) * 94, y: 104 + Math.floor(j / 7) * 70 }));
const EASY_SLOT = NOTES.map(f => [...EASY].indexOf(f.n));
const CELL = (() => {
  const count: Record<string, number> = {};
  return NOTES.map(f => {
    const key = `${f.u}|${f.i}`, j = (count[key] = (count[key] ?? -1) + 1);
    return { x: X0 + (f.u - 0.5) * COL + ((j % 3) - 1) * 20, y: Y0 + (3 - f.i + 0.5) * ROW + (Math.floor(j / 3) - 1) * 22 };
  });
})();

export function SeverityScene({ t }: { t: number }) {
  const easy = p(t, 5.4, 6.6), back2 = p(t, 10, 10.6);
  const shrink = p(t, 10, 11.4), across = p(t, 10.4, 14), up = p(t, 15, 19.5);
  const axes = p(t, 10.4, 11), axesY = p(t, 15, 15.6);
  const zones = p(t, 21, 22.4), report = p(t, 27, 27.6);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: thirty-one usability problems are plotted by how many people hit them and how badly, coloured by severity, and ranked into a report">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />

      {/* the grid */}
      {axes > 0 && (
        <g opacity={axes}>
          {[0, 1, 2].map(r => [1, 2, 3, 4, 5].map(u => {
            const sev = severityOf(u, 3 - r);
            return <rect key={`${r}${u}`} x={X0 + (u - 1) * COL + 2} y={Y0 + r * ROW + 2} width={COL - 4} height={ROW - 4} rx={8} fill={zones > 0 ? SEV_STYLE[sev].zone : SC.surface} fillOpacity={zones > 0 ? 0.25 + zones * 0.35 : 0.7} stroke={SC.line} />;
          }))}
          {[1, 2, 3, 4, 5].map(u => <text key={u} x={X0 + (u - 0.5) * COL} y={Y0 + 3 * ROW + 24} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.text}>{u}</text>)}
          <text x={X0 + 2.5 * COL} y={Y0 + 3 * ROW + 50} textAnchor="middle" fontSize={14} fontWeight={800} fill={SC.muted}>PEOPLE WHO HIT IT, OF 5</text>
          <g opacity={axesY}>
            {ROWS.map((r, k) => <text key={r} x={X0 - 12} y={Y0 + k * ROW + 56} textAnchor="end" fontSize={15} fontWeight={800} fill={SC.text}>{r}</text>)}
            <text x={X0 - 12} y={Y0 - 16} textAnchor="end" fontSize={14} fontWeight={800} fill={SC.muted}>HOW BADLY</text>
          </g>
        </g>
      )}

      {/* the notes, then dots */}
      {NOTES.map((f, j) => {
        const d = EASY_SLOT[j], pull = d >= 0 ? easy * (1 - back2) : 0;
        const x = lerp(lerp(WALL[j].x, 800, pull), CELL[j].x, across);
        const y = lerp(lerp(WALL[j].y, 130 + d * 64, pull), CELL[j].y, up);
        const w = lerp(84, 18, shrink), h = lerp(54, 18, shrink);
        const named = f.k >= 0, sev = severityOf(f.u, f.i);
        const fill = named && shrink > 0.9 ? (zones > 0 ? SEV_STYLE[sev].solid : FAMILY_SOLID[0]) : SC.surface;
        return (
          <g key={j} transform={`translate(${x - w / 2} ${y - h / 2})`} opacity={clamp(back((t - 0.2 - j * 0.04) / 0.4))}>
            <rect width={named && shrink > 0.9 ? 22 : w} height={named && shrink > 0.9 ? 22 : h} rx={lerp(6, 11, shrink)} fill={fill} stroke={SC.line} strokeWidth={1.5} />
            {shrink < 0.6 && (f.n
              ? <text x={8} y={30} fontSize={12} fontWeight={800} fill={SC.text} opacity={1 - shrink * 1.6}>{f.n}</text>
              : <g opacity={1 - shrink * 1.6}><rect x={8} y={18} width={58} height={5} rx={2} fill={SC.line} /><rect x={8} y={30} width={40} height={5} rx={2} fill={SC.line} /></g>)}
            {named && shrink > 0.9 && <text x={11} y={16} textAnchor="middle" fontSize={12} fontWeight={900} fill={zones > 0 ? SEV_STYLE[sev].ink : '#fff'}>{f.k + 1}</text>}
          </g>
        );
      })}

      {/* Kabir's quick wins */}
      {easy > 0 && back2 < 1 && (
        <g opacity={easy * (1 - back2)}>
          <text x={728} y={80} fontSize={13} fontWeight={800} fill={SC.muted}>DONE BY LUNCH</text>
          <g transform="translate(40 470)" opacity={p(t, 7.4, 8)}>
            <rect width={392} height={44} rx={22} fill={SC.surface} stroke={FAMILY_SOLID[3]} strokeWidth={2} />
            <text x={20} y={28} fontSize={15} fontWeight={800} fill={SC.text}>“Can’t cancel” is still waiting: 4 of 5 gave up.</text>
          </g>
        </g>
      )}

      {/* the scale */}
      {zones > 0 && report < 1 && (
        <g opacity={zones * (1 - report)} transform="translate(600 110)">
          <text fontSize={13} fontWeight={800} fill={SC.muted}>SEVERITY, LOWEST FIRST</text>
          {(['cosmetic', 'minor', 'major', 'critical'] as Severity[]).map((s, k) => (
            <g key={s} transform={`translate(0 ${20 + k * 56})`} opacity={p(t, 21.4 + k * 0.5, 21.9 + k * 0.5)}>
              <rect width={130} height={38} rx={19} fill={SEV_STYLE[s].solid} />
              <text x={65} y={25} textAnchor="middle" fontSize={15} fontWeight={800} fill={SEV_STYLE[s].ink}>{SEV_STYLE[s].name}</text>
              <text x={146} y={25} fontSize={14} fontWeight={600} fill={SC.text}>{['Noticed, no slowdown', 'A pause or detour', 'Most slowed, or one blocked', 'Blocked, or lost money'][k]}</text>
            </g>
          ))}
        </g>
      )}

      {/* the report */}
      {report > 0 && (
        <g opacity={report} transform="translate(570 70)">
          <text fontSize={13} fontWeight={800} fill={SC.muted}>FINDINGS REPORT · ROOM FOR SIX</text>
          <text x={360} fontSize={12} fontWeight={800} fill={SC.muted} textAnchor="end">EFFORT</text>
          {NAMED.slice(0, 6).map((f, k) => {
            const sev = severityOf(f.u, f.i);
            return (
              <g key={f.n} transform={`translate(0 ${16 + k * 50})`} opacity={p(t, 27.4 + k * 0.4, 27.9 + k * 0.4)}>
                <rect width={370} height={42} rx={10} fill={SC.surface} stroke={SC.line} />
                <text x={18} y={27} fontSize={14} fontWeight={900} fill={SC.text}>{k + 1}</text>
                <rect x={36} y={9} width={78} height={24} rx={12} fill={SEV_STYLE[sev].solid} />
                <text x={75} y={26} textAnchor="middle" fontSize={12} fontWeight={800} fill={SEV_STYLE[sev].ink}>{SEV_STYLE[sev].name}</text>
                <text x={126} y={27} fontSize={14} fontWeight={700} fill={SC.text}>{f.n}</text>
                <text x={268} y={27} textAnchor="end" fontSize={13} fontWeight={700} fill={SC.muted}>{f.u} of 5</text>
                <text x={344} y={27} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.text}>{f.e}</text>
              </g>
            );
          })}
          <text y={340} fontSize={14} fontWeight={700} fill={SC.muted} opacity={p(t, 30, 30.6)}>Cosmetic ones are logged and parked.</text>
          <text y={364} fontSize={14} fontWeight={700} fill={SC.muted} opacity={p(t, 30.6, 31.2)}>Effort sits apart, so a hard fix can’t sink a serious problem.</text>
        </g>
      )}
    </svg>
  );
}
