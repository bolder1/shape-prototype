'use client';
// Scene for ld.4-3: Saathi's nine designers sit in a central studio and squads' tickets pile up beside it. The
// designers move into the squads (still reporting to design), each squad then builds its own slot picker, and Megha
// adds a hub that owns the shared work, DesignOps for the coordination, and a guild that links designers across
// squads. Pure function of t (0–36). Also exports `ORG_FILL` and `ORG_LABEL`, which `org-shape` uses.
import type { OrgFix } from '@shape/content';
import { at, back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per part of the org; white text on each passes 4.5:1. */
export const ORG_FILL: Record<OrgFix, string> = { embed: '#067647', hub: '#175CD3', ops: '#6941C6', guild: '#B54708' };
export const ORG_LABEL: Record<OrgFix, string> = { embed: 'In the squad', hub: 'The hub', ops: 'DesignOps', guild: 'A guild' };

const SQUADS = ['Patients', 'Doctors', 'Medicines', 'Lab tests', 'Payments', 'Video'] as const;
const BW = 184, BH = 72;
const box = (i: number) => ({ x: 32 + (i % 3) * 196, y: i < 3 ? 52 : 244 });
/** Designers per squad once embedded: nine in all. */
const PER = [2, 2, 1, 2, 1, 1];
const DOTS = PER.flatMap((n, s) => Array.from({ length: n }, (_, j) => ({ s, j })));
const studio = (i: number) => [294 + (i % 3) * 26, 182 + Math.floor(i / 3) * 18] as const;
const seat = (d: { s: number; j: number }) => { const b = box(d.s); return [b.x + 22 + d.j * 24, b.y + 54] as const; };
/** A picker drawn differently in each squad until the hub builds one. */
function Picker({ x, y, kind, color }: { x: number; y: number; kind: number; color: string }) {
  if (kind === 0) return <circle cx={x} cy={y} r={13} fill="none" stroke={color} strokeWidth={4} />;
  if (kind === 1) return <rect x={x - 12} y={y - 12} width={24} height={24} fill="none" stroke={color} strokeWidth={4} />;
  if (kind === 2) return <path d={`M${x} ${y - 14}L${x + 14} ${y + 11}H${x - 14}Z`} fill="none" stroke={color} strokeWidth={4} strokeLinejoin="round" />;
  return <path d={`M${x - 14} ${y}L${x} ${y - 14}L${x + 14} ${y}L${x} ${y + 14}Z`} fill="none" stroke={color} strokeWidth={4} strokeLinejoin="round" />;
}

export function HubSpokeScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'A studio of nine' : t < 11 ? 'The queue' : t < 16 ? 'Into the squads' : t < 21 ? 'Drift' : t < 26 ? 'A hub for shared work' : t < 31 ? 'Ops for coordination' : 'Guilds across squads';
  const move = p(t, 11.4, 13.6);
  const studioOn = 1 - p(t, 13, 14);
  const hubOn = p(t, 21.3, 22.2), opsOn = p(t, 26.3, 27.2), guildOn = p(t, 31.3, 32.6);
  const tickets = t >= 6 && t < 12 ? Math.floor(lerp(0, 12, p(t, 6.2, 10))) : 0;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Saathi’s nine designers sit together in a central studio, and six squads, patients, doctors, medicines, lab tests, payments and video, file tickets that pile up for three weeks. The designers move into the squads, still reporting to design. Then every squad builds its own appointment picker, each a different shape. Megha adds a hub that owns the design system, content and accessibility, and the pickers become one. DesignOps takes hiring, onboarding and cross-squad launches. Finally a guild links the designers across squads, so nobody designs alone.">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={36} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {SQUADS.map((name, i) => {
          const b = box(i);
          const drift = t >= 16 && t < 21.6;
          return (
            <g key={name} opacity={p(t, 0.3 + i * 0.2, 0.8 + i * 0.2)}>
              <rect x={b.x} y={b.y} width={BW} height={BH} rx={12} fill={SC.surface} stroke={drift ? SC.error : SC.line} strokeWidth={drift ? 3 : 2} />
              <text x={b.x + 14} y={b.y + 30} fontSize={21} fontWeight={800} fill={SC.text}>{name}</text>
              {t >= 16 && (
                <g opacity={p(t, 16.3 + i * 0.25, 16.8 + i * 0.25)}>
                  <Picker x={b.x + 156} y={b.y + 46} kind={t >= 22 ? 0 : i % 4} color={t >= 22 ? ORG_FILL.hub : SC.error} />
                </g>
              )}
            </g>
          );
        })}

        <g opacity={studioOn}>
          <rect x={240} y={136} width={160} height={96} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
          <text x={320} y={162} fontSize={21} fontWeight={900} fill={SC.text} textAnchor="middle">Studio</text>
          {Array.from({ length: tickets }, (_, i) => (
            <rect key={i} x={414 + (i % 4) * 22} y={204 - Math.floor(i / 4) * 16} width={18} height={12} rx={2} fill={SC.error} />
          ))}
          {t >= 7 && t < 12 && <text x={414} y={164} fontSize={21} fontWeight={900} fill={SC.error} opacity={p(t, 8, 8.6)}>3 weeks</text>}
        </g>

        {hubOn > 0 && (
          <g opacity={hubOn}>
            {[0, 1, 2, 3, 4, 5].map(i => { const b = box(i); return <line key={i} x1={172} y1={i < 3 ? 148 : 220} x2={b.x + BW / 2} y2={i < 3 ? b.y + BH : b.y} stroke={ORG_FILL.hub} strokeWidth={2} opacity={0.5} />; })}
            <rect x={32} y={148} width={280} height={72} rx={12} fill={ORG_FILL.hub} />
            <text x={48} y={177} fontSize={21} fontWeight={900} fill="#fff">Hub</text>
            <text x={48} y={206} fontSize={21} fontWeight={700} fill="#fff">System, content, a11y</text>
          </g>
        )}
        {opsOn > 0 && (
          <g opacity={opsOn}>
            <rect x={328} y={148} width={280} height={72} rx={12} fill={ORG_FILL.ops} />
            <text x={344} y={177} fontSize={21} fontWeight={900} fill="#fff">DesignOps</text>
            <text x={344} y={206} fontSize={21} fontWeight={700} fill="#fff">Hiring, onboarding</text>
          </g>
        )}

        {guildOn > 0 && (
          <g opacity={guildOn}>
            {DOTS.slice(0, -1).map((d, i) => {
              const a = seat(d), b2 = seat(DOTS[i + 1]);
              return <line key={i} x1={a[0]} y1={a[1]} x2={b2[0]} y2={b2[1]} stroke={ORG_FILL.guild} strokeWidth={3} strokeDasharray="6 5" />;
            })}
          </g>
        )}

        {DOTS.map((d, i) => {
          const [x, y] = at(studio(i), seat(d), move);
          return <circle key={i} cx={x} cy={y} r={9} fill={guildOn > 0.5 ? ORG_FILL.guild : ORG_FILL.embed} opacity={p(t, 1 + i * 0.25, 1.4 + i * 0.25)} />;
        })}

        {t >= 11 && t < 16 && (
          <text x={32} y={348} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 13.6, 14.2)}>Context from the squad, craft from design.</text>
        )}
        {t >= 16 && t < 21 && (
          <text x={32} y={348} fontSize={21} fontWeight={800} fill={SC.error} opacity={p(t, 18, 18.6)}>Six squads, six pickers. Same bugs everywhere.</text>
        )}
        {t >= 31 && (
          <text x={32} y={348} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 33, 33.6)}>38 designers, 11 squads, one practice.</text>
        )}
      </g>
    </svg>
  );
}
