'use client';
// Scene for ui.2-2: a reading card with sizes picked by eye (15, 17, 18, 22, 23) turns muddy; a base and a ratio build
// a scale (13 → 39) on the right; then every piece of text on the card snaps to a step. Pure function of t (0–34).
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
const STEPS = [13, 16, 20, 25, 31, 39];
/** The card's text: the size picked by eye, then its step on the scale. */
const ROWS = [
  { k: 'title', text: 'Monsoon dal', old: 23, now: 39, w: 800 },
  { k: 'sub', text: 'A one-pot dinner', old: 22, now: 20, w: 600 },
  { k: 'by', text: 'By Asha Rao · 6 min', old: 15, now: 13, w: 500 },
  { k: 'head', text: 'Why it works', old: 18, now: 25, w: 700 },
  { k: 'body', text: 'Lentils soften fast in', old: 17, now: 16, w: 400 },
  { k: 'body2', text: 'a pressure cooker.', old: 17, now: 16, w: 400 },
] as const;
const MUDDY = [['title', 'sub'], ['head', 'body']] as const;

/** Lays the card out from the current sizes: each row takes its size × 1.45 (plus a gap after the byline). */
const layout = (snap: number) => ROWS.reduce<{ rows: ((typeof ROWS)[number] & { size: number; y: number })[]; y: number }>((acc, r, i) => {
  const size = lerp(r.old, r.now, clamp(snap * 1.4 - i * 0.08));
  return { rows: [...acc.rows, { ...r, size, y: acc.y + size }], y: acc.y + size * 1.45 + (r.k === 'by' ? 14 : 0) };
}, { rows: [], y: 130 }).rows;

export function TypeScaleScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const snap = p(t, 22.2, 23.6);
  const scale = t >= 11 && t < 29.4;

  const rows = layout(snap);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: text sizes picked by eye, then snapped to a type scale">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {/* the reading card */}
        <g transform={`translate(0 ${(1 - clamp(back(t / 0.7))) * 30})`}>
          <rect x={80} y={90} width={400} height={380} rx={24} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
          {rows.map(r => {
            const muddy = t >= 6 && t < 11 && MUDDY.some(m => (m as readonly string[]).includes(r.k));
            return (
              <g key={r.k}>
                <text x={110} y={r.y} fontSize={r.size} fontWeight={r.w} fill={r.k === 'by' ? SC.muted : SC.text}>{r.text}</text>
                {t < 29 && (
                  <g transform={`translate(498 ${r.y - r.size * 0.35})`} opacity={r.k === 'body2' ? 0 : 1}>
                    <rect x={0} y={-10} width={44} height={20} rx={10} fill={muddy ? SC.error : snap > 0.5 ? SC.mint : SC.line} />
                    <text x={22} y={4} textAnchor="middle" fontSize={11} fontWeight={800} fill={muddy || snap > 0.5 ? '#fff' : SC.text}>{Math.round(r.size)}</text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
        {t >= 6.4 && t < 11 && (
          <g opacity={clamp((t - 6.4) / 0.4) * (1 - p(t, 10.4, 11))}>
            <text x={720} y={240} textAnchor="middle" fontSize={22} fontWeight={800} fill={SC.error}>22 ≈ 23?   17 ≈ 18?</text>
            <text x={720} y={276} textAnchor="middle" fontSize={16} fontWeight={700} fill={SC.muted}>Too close to read as different levels</text>
          </g>
        )}

        {/* base × ratio, then the scale climbing */}
        {scale && (
          <g opacity={clamp((t - 11) / 0.5) * (1 - p(t, 28.6, 29.2))}>
            <g transform={`translate(740 112) scale(${clamp(back((t - 11.2) / 0.5))})`}>
              <rect x={-150} y={-26} width={300} height={52} rx={16} fill={SC.discover} />
              <text y={8} textAnchor="middle" fontSize={20} fontWeight={800} fill="#fff">Base 16 × ratio 1.25</text>
            </g>
            {STEPS.map((s, i) => {
              const at = 16 + i * 0.6, k = clamp(back((t - at) / 0.5));
              const hit = snap > 0.2 && ROWS.some(r => r.now === s);
              const yy = 470 - i * 52;
              return k > 0 && (
                <g key={s} transform={`translate(620 ${yy}) scale(${k})`}>
                  <text x={0} y={0} fontSize={s} fontWeight={700} fill={hit ? SC.design : SC.text}>Aa</text>
                  <text x={80} y={-4} fontSize={15} fontWeight={800} fill={SC.muted}>{s}px</text>
                  {i > 0 && t >= at + 0.4 && <text x={150} y={-4} fontSize={13} fontWeight={700} fill={SC.muted}>{STEPS[i - 1]} × 1.25</text>}
                </g>
              );
            })}
          </g>
        )}
        {t >= 24 && t < 29 && (
          <text x={280} y={505} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.mint} opacity={clamp((t - 24) / 0.4)}>Every piece of text on a step</text>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Base × ratio', l: '16 × 1.25 = 20 …', c: SC.discover }, { x: 480, n: 'Far apart', l: 'Levels you can see', c: SC.design }, { x: 760, n: 'Same role, same step', l: 'Name and reuse them', c: SC.mint }].map((f, i) => {
        const k = back((t - (29.2 + i * 0.25)) / 0.5);
        return (
          <g key={f.n} transform={`translate(${f.x} 260) scale(${clamp(k)})`}>
            <rect x={-125} y={-70} width={250} height={140} rx={18} fill={SC.surface} stroke={f.c} strokeWidth={3} />
            <text y={-8} textAnchor="middle" fontSize={22} fontWeight={800} fill={f.c}>{f.n}</text>
            <text y={26} textAnchor="middle" fontSize={14} fontWeight={600} fill={SC.text}>{f.l}</text>
          </g>
        );
      })}
    </svg>
  );
}
