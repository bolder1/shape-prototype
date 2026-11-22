'use client';
// Scene for fd.2-1: a confusing sign-up form fixed by proximity, then similarity (the grey link), then closure.
// Pure function of t (seconds, 0–34).
import { CheckIcon, QuestionIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, lerp, p, Pen, SC } from './shared';

const W = 960, H = 540;
const FIELDS = ['Name', 'Email', 'Phone', 'Card number', 'Expiry', 'CVV'];
const LINKS = ['Pricing', 'Docs', 'Blog', 'Careers'];

export function GestaltScene({ t }: { t: number }) {
  // ---- act 1: proximity ----
  const group = p(t, 7, 10);                         // 0 = evenly spaced, 1 = two clear groups
  const formOut = p(t, 13.4, 14.4);                  // the form steps aside for the next act
  const fieldY = (i: number) => 118 + i * lerp(60, 48, group) + (i >= 3 ? lerp(0, 56, group) : 0) + (i >= 3 ? 0 : -lerp(0, 10, group));
  // ---- act 2: similarity ----
  const simIn = p(t, 14, 14.8), simOut = p(t, 20.4, 21.2);
  const fixed = p(t, 18, 18.6);
  // ---- act 3: closure ----
  const cloIn = p(t, 21, 21.8), cloOut = p(t, 27.6, 28.4);
  const imagined = p(t, 23.2, 24.6);
  // ---- finale ----
  const fin = p(t, 28.2, 29.2);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: proximity, similarity and closure fix a confusing form">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />

      {/* ================= the form (proximity) ================= */}
      {formOut < 1 && (
        <g opacity={1 - formOut} transform={`translate(${-formOut * 120} 0)`}>
          <rect x={330} y={40} width={300} height={470} rx={20} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
          <text x={354} y={74} fontSize={17} fontWeight={800} fill={SC.text}>Create your account</text>
          {['About you', 'Payment'].map((title, gi) => (
            <text key={title} x={354} y={fieldY(gi * 3) - 18} fontSize={12} fontWeight={800} letterSpacing={1.2} fill={gi ? SC.grow : SC.discover} opacity={p(t, 9.4 + gi * 0.4, 10.2 + gi * 0.4)}>{title.toUpperCase()}</text>
          ))}
          {FIELDS.map((f, i) => (
            <g key={f} transform={`translate(354 ${fieldY(i)})`}>
              <text y={0} fontSize={11.5} fontWeight={600} fill={SC.muted}>{f}</text>
              <rect y={6} width={252} height={28} rx={7} fill={SC.soft} stroke={SC.line} />
            </g>
          ))}
          {/* the gap that does the work */}
          {group > 0.2 && t < 13 && (
            <g opacity={clamp((group - 0.2) / 0.5)} transform={`translate(622 ${fieldY(2) + 40})`}>
              <line x1={0} x2={0} y1={0} y2={lerp(0, 66, group)} stroke={SC.mint} strokeWidth={3} />
              <line x1={-6} x2={6} y1={0} y2={0} stroke={SC.mint} strokeWidth={3} /><line x1={-6} x2={6} y1={lerp(0, 66, group)} y2={lerp(0, 66, group)} stroke={SC.mint} strokeWidth={3} />
            </g>
          )}
          {/* confusion, then clarity */}
          {[0, 1, 2].map(i => t >= 2.4 + i * 0.6 && t < 7.4 && (
            <g key={i} transform={`translate(${680 + i * 34} ${170 + i * 60}) scale(${back((t - 2.4 - i * 0.6) / 0.4) * (1 - p(t, 7, 7.4))})`}>
              <circle r={16} fill={SC.error} /><QuestionIcon x={-10} y={-10} width={20} height={20} color="#fff" weight="bold" />
            </g>
          ))}
          {t >= 10.6 && (
            <g transform={`translate(700 270) scale(${back((t - 10.6) / 0.4)})`}><circle r={22} fill={SC.mint} /><CheckIcon x={-13} y={-13} width={26} height={26} color="#fff" weight="bold" /></g>
          )}
        </g>
      )}

      {/* ================= similarity ================= */}
      {simIn > 0 && simOut < 1 && (
        <g opacity={simIn * (1 - simOut)}>
          <text x={240} y={110} textAnchor="middle" fontSize={14} fontWeight={800} letterSpacing={1.5} fill={SC.muted}>WHICH ARE LINKS?</text>
          <rect x={110} y={130} width={260} height={230} rx={16} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
          {LINKS.map((l, i) => {
            const odd = i === 3;
            const col = odd ? (fixed > 0.5 ? SC.discover : SC.muted) : SC.discover;
            return (
              <g key={l} transform={`translate(140 ${178 + i * 48})`}>
                <text fontSize={18} fontWeight={600} fill={col}>{l}</text>
                {(!odd || fixed > 0.5) && <line x1={0} x2={l.length * 9.6} y1={5} y2={5} stroke={col} strokeWidth={2} opacity={odd ? fixed : 1} />}
                {odd && t >= 16 && t < 18 && <text x={110} fontSize={13} fontWeight={700} fill={SC.error} opacity={clamp((t - 16) / 0.3)}>← skipped: looks like plain text</text>}
              </g>
            );
          })}
          {/* eyes hopping over the links that look alike */}
          {t >= 15 && t < 17.6 && [0, 1, 2].map(i => t >= 15 + i * 0.5 && <circle key={i} cx={120} cy={172 + i * 48} r={6} fill={SC.build} opacity={0.8} />)}
          {/* a grid that reads as columns because of colour */}
          <text x={700} y={110} textAnchor="middle" fontSize={14} fontWeight={800} letterSpacing={1.5} fill={SC.muted}>ROWS OR COLUMNS?</text>
          {Array.from({ length: 4 }, (_, c) => Array.from({ length: 4 }, (_, r) => (
            <circle key={`${c}-${r}`} cx={620 + c * 54} cy={170 + r * 54} r={16} fill={c % 2 ? SC.design : SC.discover} opacity={back((t - (15 + (c + r) * 0.08)) / 0.4)} />
          )))}
          <text x={700} y={400} textAnchor="middle" fontSize={14} fontWeight={700} fill={SC.text} opacity={p(t, 17, 17.6)}>Columns. Colour groups them.</text>
        </g>
      )}

      {/* ================= closure ================= */}
      {cloIn > 0 && cloOut < 1 && (
        <g opacity={cloIn * (1 - cloOut)}>
          <g transform="translate(300 270)">
            {[0, 1, 2, 3].map(i => {
              const a0 = (i * 90 + 14) * (Math.PI / 180), a1 = (i * 90 + 76) * (Math.PI / 180), r = 110;
              return <path key={i} d={`M ${Math.cos(a0) * r} ${Math.sin(a0) * r} A ${r} ${r} 0 0 1 ${Math.cos(a1) * r} ${Math.sin(a1) * r}`} fill="none" stroke={SC.text} strokeWidth={10} strokeLinecap="round" opacity={p(t, 21.4 + i * 0.3, 22 + i * 0.3)} />;
            })}
            <circle r={110} fill="none" stroke={SC.mint} strokeWidth={4} strokeDasharray="4 10" pathLength={1} opacity={imagined * 0.9} />
            <text y={170} textAnchor="middle" fontSize={15} fontWeight={700} fill={SC.text} opacity={imagined}>No full circle drawn. You see one anyway.</text>
          </g>
          <g transform="translate(680 270)" opacity={p(t, 24.8, 25.6)}>
            {[[-90, 70], [90, 70], [0, -86]].map(([x, y], i) => {
              const ang = Math.atan2(-y, -x);   // the mouth points at the triangle's centre
              const m = 0.52;
              return <path key={i} d={`M ${x} ${y} L ${x + Math.cos(ang - m) * 34} ${y + Math.sin(ang - m) * 34} A 34 34 0 1 0 ${x + Math.cos(ang + m) * 34} ${y + Math.sin(ang + m) * 34} Z`} fill={SC.text} />;
            })}
            <polygon points="-90,70 90,70 0,-86" fill="none" stroke={SC.mint} strokeWidth={3} strokeDasharray="6 8" opacity={p(t, 26, 26.8)} />
            <text y={170} textAnchor="middle" fontSize={15} fontWeight={700} fill={SC.text} opacity={p(t, 26, 26.8)}>A triangle made of nothing.</text>
          </g>
        </g>
      )}

      {/* ================= finale ================= */}
      {fin > 0 && [{ x: 200, label: 'Proximity', c: SC.discover }, { x: 480, label: 'Similarity', c: SC.design }, { x: 760, label: 'Closure', c: SC.grow }].map((f, i) => {
        const k = back((t - (28.4 + i * 0.25)) / 0.5);
        return (
          <g key={f.label} transform={`translate(${f.x} 260) scale(${clamp(k)})`}>
            <rect x={-110} y={-90} width={220} height={180} rx={18} fill={SC.surface} stroke={f.c} strokeWidth={3} />
            {i === 0 && [[-40, -30], [-20, -30], [-40, -10], [-20, -10], [26, -30], [46, -30], [26, -10], [46, -10]].map(([x, y], j) => <circle key={j} cx={x} cy={y} r={7} fill={f.c} />)}
            {i === 1 && [-45, -15, 15, 45].map((x, j) => <circle key={j} cx={x} cy={-20} r={10} fill={j % 2 ? SC.design : SC.muted} />)}
            {i === 2 && [0, 1, 2, 3].map(j => { const a0 = (j * 90 + 15) * Math.PI / 180, a1 = (j * 90 + 75) * Math.PI / 180, r = 30; return <path key={j} d={`M ${Math.cos(a0) * r} ${-20 + Math.sin(a0) * r} A ${r} ${r} 0 0 1 ${Math.cos(a1) * r} ${-20 + Math.sin(a1) * r}`} fill="none" stroke={f.c} strokeWidth={6} strokeLinecap="round" />; })}
            <text y={50} textAnchor="middle" fontSize={19} fontWeight={800} fill={f.c}>{f.label}</text>
          </g>
        );
      })}

      {/* Nib nudges the gap open, then watches */}
      {t >= 6 && t < 13.4 && <Pen x={lerp(700, 640, group)} y={fieldY(2) + 70} scale={0.42} tilt={-30} mood={t > 10.6 ? 'cheer' : 'idle'} />}
      {t >= 23 && t < 27.6 && <Pen x={300 + 110} y={270} scale={0.42} tilt={-40} mood="cheer" />}
    </svg>
  );
}
