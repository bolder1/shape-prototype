'use client';
// Scene for bz.1-3: a B2C purchase as a four-step sprint in two minutes, then a B2B purchase as a four-month timeline with
// a buying group (nurses, manager, IT, procurement), their questions, a stall when IT says no, and a fix for every role.
// Pure function of t (0–34).
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, p, SC } from './shared';

const W = 960, H = 540;
export const ROLES = [
  { id: 'user', n: 'Nurses', q: '“Is it easy on a shift?”', fix: 'A delightful app', c: SC.discover },
  { id: 'buyer', n: 'Manager', q: '“What’s the ROI?”', fix: 'An ROI calculator', c: SC.design },
  { id: 'it', n: 'IT & security', q: '“Is our data safe?”', fix: 'SSO + security page', c: SC.build },
  { id: 'proc', n: 'Procurement', q: '“What are the terms?”', fix: 'Clear contracts', c: SC.grow },
] as const;

export function BuyingJourneyScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const b2b = t >= 6;
  const stall = t >= 18 && t < 24;
  const fixed = t >= 24;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a quick consumer purchase versus a slow business purchase with many decision makers">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {/* B2C sprint */}
        <g opacity={b2b ? 0.5 : clamp(t / 0.5)} transform={`translate(0 ${b2b ? -10 : 0})`}>
          <text x={80} y={70} fontSize={15} fontWeight={800} fill={SC.muted}>B2C · Priya on the bus</text>
          {['Sees an ad', 'Downloads', 'Tries it', 'Pays ₹99'].map((s, i) => (
            <g key={s} transform={`translate(${130 + i * 190} 120) scale(${clamp(back((t - 0.4 - i * 0.8) / 0.4))})`}>
              <rect x={-70} y={-24} width={140} height={48} rx={14} fill={SC.surface} stroke={SC.discover} strokeWidth={2} />
              <text y={6} textAnchor="middle" fontSize={14} fontWeight={800} fill={SC.text}>{s}</text>
              {i < 3 && <path d="M78 0 h34" stroke={SC.muted} strokeWidth={2} markerEnd="url(#bj-arrow)" />}
            </g>
          ))}
          {t >= 3.8 && <text x={880} y={170} textAnchor="end" fontSize={15} fontWeight={800} fill={SC.mint}>2 minutes · 1 person</text>}
        </g>
        <defs><marker id="bj-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill={SC.muted} /></marker></defs>

        {/* B2B committee */}
        {b2b && (
          <g opacity={clamp((t - 6) / 0.5)}>
            <text x={80} y={220} fontSize={15} fontWeight={800} fill={SC.muted}>B2B · a hospital buying scheduling software</text>
            <line x1={80} y1={250} x2={880} y2={250} stroke={SC.line} strokeWidth={4} />
            {['Month 1', 'Month 2', 'Month 3', 'Month 4'].map((m, i) => <text key={m} x={80 + i * 266} y={240} fontSize={11} fontWeight={700} fill={SC.muted}>{m}</text>)}
            {/* progress pauses while IT blocks the deal */}
            <circle cx={80 + 800 * Math.min(1, ((t < 18 ? t : t < 24 ? 18 : t - 6) - 6) / 16)} cy={250} r={8} fill={stall ? SC.error : SC.mint} />
            {ROLES.map((r, i) => {
              const x = 170 + i * 205, blocked = stall && r.id === 'it';
              return (
                <g key={r.id} transform={`translate(${x} 340) scale(${clamp(back((t - 6.4 - i * 0.35) / 0.5))})`}>
                  <circle r={30} fill={SC.surface} stroke={r.c} strokeWidth={3} />
                  <circle cy={-6} r={9} fill={r.c} opacity={0.8} /><path d="M-15 18 q15 -18 30 0" fill={r.c} opacity={0.8} />
                  <text y={52} textAnchor="middle" fontSize={14} fontWeight={800} fill={SC.text}>{r.n}</text>
                  {t >= 12 && !fixed && (
                    <g opacity={clamp((t - 12.2 - i * 0.4) / 0.4)}>
                      <rect x={-88} y={70} width={176} height={34} rx={12} fill={blocked ? SC.error : SC.surface} stroke={blocked ? SC.error : SC.line} strokeWidth={2} />
                      <text y={92} textAnchor="middle" fontSize={12} fontWeight={700} fill={blocked ? '#fff' : SC.text}>{blocked ? 'No SSO. Blocked.' : r.q}</text>
                    </g>
                  )}
                  {fixed && (
                    <g opacity={clamp((t - 24.2 - i * 0.4) / 0.4)}>
                      <rect x={-88} y={70} width={176} height={34} rx={12} fill={SC.mint} />
                      <text y={92} textAnchor="middle" fontSize={12} fontWeight={800} fill="#fff">{r.fix}</text>
                    </g>
                  )}
                  {(blocked || fixed) && (
                    <g transform="translate(22 -24)">
                      <circle r={12} fill={blocked ? SC.error : SC.mint} />
                      {blocked ? <XIcon x={-8} y={-8} width={16} height={16} color="#fff" weight="bold" /> : <CheckIcon x={-8} y={-8} width={16} height={16} color="#fff" weight="bold" />}
                    </g>
                  )}
                </g>
              );
            })}
            {stall && <text x={480} y={500} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.error}>The nurses loved it. One “no” from IT stalls the deal.</text>}
            {fixed && t < 29 && <text x={480} y={500} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.mint}>Something for every role. Signed in month four.</text>}
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'B2C', l: 'One person, minutes', c: SC.discover }, { x: 480, n: 'B2B', l: 'A group, months', c: SC.design }, { x: 760, n: 'Every role', l: 'Can say no; design for each', c: SC.mint }].map((f, i) => {
        const k = back((t - (29.2 + i * 0.25)) / 0.5);
        return (
          <g key={f.n} transform={`translate(${f.x} 260) scale(${clamp(k)})`}>
            <rect x={-125} y={-70} width={250} height={140} rx={18} fill={SC.surface} stroke={f.c} strokeWidth={3} />
            <text y={-8} textAnchor="middle" fontSize={22} fontWeight={800} fill={f.c}>{f.n}</text>
            <text y={26} textAnchor="middle" fontSize={13} fontWeight={600} fill={SC.text}>{f.l}</text>
          </g>
        );
      })}
    </svg>
  );
}
