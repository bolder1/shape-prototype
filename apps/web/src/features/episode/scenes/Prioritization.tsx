'use client';
// Scene for st.1-3: a backlog where everyone shouts; the CEO's voice search jumps the queue. RICE scores each idea and the
// list re-sorts (the boring checkout fix wins). Then a Kano chart: basics, performance, delighters. Pure function of t (0–34).
import { MegaphoneIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
// Reach, impact, confidence %, effort (weeks). Echoes the game's numbers; reorder's reach is lower so the top isn't a tie.
const IDEAS = [
  { n: 'Voice search', who: 'CEO', r: 8000, i: 1, c: 20, e: 8 },
  { n: 'Fix slow checkout', who: 'Support', r: 8000, i: 2, c: 80, e: 4 },
  { n: 'Dark mode', who: 'Design', r: 6000, i: 0.5, c: 100, e: 3 },
  { n: 'One-tap reorder', who: 'Product', r: 3000, i: 2, c: 80, e: 2 },
  { n: 'Recipe blog', who: 'Marketing', r: 2000, i: 0.5, c: 50, e: 4 },
];
const score = (x: (typeof IDEAS)[number]) => (x.r * x.i * (x.c / 100)) / x.e;
const SORTED = [...IDEAS].sort((a, b) => score(b) - score(a));
const MAX = score(SORTED[0]);

export function PrioritizationScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const kano = t >= 23;
  const sort = p(t, 19, 20.5);
  const bars = p(t, 18, 19);
  const ceo = t >= 6 && t < 11;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: prioritising with RICE and Kano">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {!kano && (
          <g opacity={1 - p(t, 22.4, 23)}>
            {IDEAS.map((x, i) => {
              // Order: as received; the CEO's pick jumps to the top; then the RICE order.
              const start = i, ceoOrder = i === 0 ? 0 : i, rice = SORTED.indexOf(x);
              const row = t < 6 ? start : t < 19 ? ceoOrder : lerp(ceoOrder, rice, sort);
              const y = 110 + row * 66;
              const s = score(x);
              return (
                <g key={x.n} transform={`translate(80 ${y}) scale(${clamp(back((t - 0.4 - i * 0.3) / 0.4))})`}>
                  <rect width={330} height={52} rx={12} fill={SC.surface} stroke={ceo && i === 0 ? SC.error : SC.line} strokeWidth={ceo && i === 0 ? 3 : 2} />
                  <text x={18} y={23} fontSize={16} fontWeight={800} fill={SC.text}>{x.n}</text>
                  <text x={18} y={42} fontSize={12} fontWeight={600} fill={SC.muted}>from {x.who}</text>
                  {bars > 0 && (
                    <g opacity={bars}>
                      <rect x={350} y={14} width={360 * (s / MAX) * bars} height={24} rx={8} fill={x === SORTED[0] ? SC.mint : SC.discover} opacity={0.85} />
                      <text x={358 + 360 * (s / MAX) * bars} y={32} fontSize={14} fontWeight={900} fill={SC.text}>{Math.round(s).toLocaleString('en-IN')}</text>
                    </g>
                  )}
                </g>
              );
            })}
            {t < 6 && <text x={620} y={250} textAnchor="middle" fontSize={22} fontWeight={900} fill={SC.error} opacity={clamp((t - 2) / 0.4)}>“Mine first!”</text>}
            {ceo && (
              <g transform="translate(560 180)" opacity={clamp((t - 6) / 0.4)}>
                <MegaphoneIcon x={0} y={0} width={56} height={56} color={SC.error} weight="duotone" />
                <text x={70} y={36} fontSize={18} fontWeight={800} fill={SC.error}>The loudest voice decides?</text>
              </g>
            )}
            {t >= 11 && t < 18.5 && (
              <g transform="translate(500 170)" opacity={clamp((t - 11) / 0.4) * (1 - p(t, 18, 18.5))}>
                {['Reach', '× Impact', '× Confidence', '÷ Effort'].map((w, k) => (
                  <text key={w} x={0} y={k * 48} fontSize={26} fontWeight={900} fill={[SC.discover, SC.design, SC.mint, SC.build][k]} opacity={clamp((t - 11.4 - k * 0.6) / 0.4)}>{w}</text>
                ))}
              </g>
            )}
          </g>
        )}

        {/* Kano */}
        {kano && (
          <g opacity={clamp((t - 23) / 0.5)}>
            <line x1={480} x2={480} y1={70} y2={470} stroke={SC.line} strokeWidth={2} />
            <line x1={200} x2={760} y1={270} y2={270} stroke={SC.line} strokeWidth={2} />
            <text x={760} y={320} textAnchor="end" fontSize={12} fontWeight={800} fill={SC.muted}>DONE WELL →</text>
            <text x={490} y={84} fontSize={12} fontWeight={800} fill={SC.muted}>DELIGHTED</text>
            <text x={490} y={464} fontSize={12} fontWeight={800} fill={SC.muted}>ANGRY</text>
            {[
              { d: 'M200 460 C 380 330, 520 290, 760 280', c: SC.error, l: 'Basic', lx: 520, ly: 348, at: 23.6 },
              { d: 'M200 440 L 760 100', c: SC.discover, l: 'Performance', lx: 640, ly: 196, at: 24.4 },
              { d: 'M200 262 C 440 250, 580 200, 760 80', c: SC.mint, l: 'Delighter', lx: 330, ly: 235, at: 25.2 },
            ].map(cv => (
              <g key={cv.l} opacity={clamp((t - cv.at) / 0.5)}>
                <path d={cv.d} fill="none" stroke={cv.c} strokeWidth={4} strokeLinecap="round" />
                <text x={cv.lx} y={cv.ly} fontSize={16} fontWeight={800} fill={cv.c}>{cv.l}</text>
              </g>
            ))}
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'RICE', l: 'Reach × Impact × Conf ÷ Effort', c: SC.discover }, { x: 480, n: 'Confidence', l: 'Guesses score lower', c: SC.mint }, { x: 760, n: 'Kano', l: 'Basics before delight', c: SC.design }].map((f, i) => {
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
