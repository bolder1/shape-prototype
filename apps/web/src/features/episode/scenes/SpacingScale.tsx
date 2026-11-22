'use client';
// Scene for ui.1-1: a product card spaced by eye (13, 7, 22, 9px). A spacing scale appears, every gap snaps to its nearest
// step, then the gaps are re-balanced so related things sit close and the action sits apart. Pure function of t (0–34).
import { back, clamp, Grid, lerp, p, Pen, SC } from './shared';

const W = 960, H = 540;
const SCALE = [4, 8, 16, 24, 32, 48];
const K = 3;                 // px → scene units, so small gaps are visible
// [padding, image→name, name→price, price→button]
const BAD = [13, 7, 22, 9], SNAP = [16, 8, 24, 8], GOOD = [16, 8, 4, 24];
const NAMES = ['padding', 'image → name', 'name → price', 'price → button'];

export function SpacingScaleScene({ t }: { t: number }) {
  const snap = p(t, 16, 17.5), balance = p(t, 23, 24.5);
  const gaps = BAD.map((b, i) => lerp(lerp(b, SNAP[i], snap), GOOD[i], balance));
  const shown = gaps.map(g => Math.round(g));
  const onScale = t >= 17.5;
  const fin = p(t, 29, 29.8);
  const wobble = t >= 6 && t < 11 ? Math.sin(t * 9) * 1.5 : 0;

  // the card, laid out from the gaps
  const X = 170, CW = 330, pad = gaps[0] * K;
  const imgY = 70 + pad, imgH = 140;
  const nameY = imgY + imgH + gaps[1] * K, nameH = 24;
  const priceY = nameY + nameH + gaps[2] * K, priceH = 20;
  const btnY = priceY + priceH + gaps[3] * K, btnH = 40;
  const cardH = btnY + btnH + pad - 70;
  const marks = [
    { y1: 70, y2: imgY }, { y1: imgY + imgH, y2: nameY }, { y1: nameY + nameH, y2: priceY }, { y1: priceY + priceH, y2: btnY },
  ];
  const align = onScale ? 0 : 1;      // the messy card also has three alignments

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: random spacing snapped to a spacing scale">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        <g transform={`translate(${wobble} 0)`}>
          <rect x={X} y={70} width={CW} height={cardH} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
          <rect x={X + pad} y={imgY} width={CW - 2 * pad} height={imgH} rx={12} fill={SC.grow} opacity={0.35} />
          <rect x={X + pad + align * 60} y={nameY} width={170} height={nameH} rx={6} fill={SC.text} opacity={0.85} />
          <rect x={X + pad} y={priceY} width={80} height={priceH} rx={6} fill={SC.mint} />
          <rect x={X + pad + align * 140} y={btnY} width={align ? CW - 2 * pad - 140 : CW - 2 * pad} height={btnH} rx={10} fill={SC.discover} />
          <text x={X + CW / 2 + (align ? 70 : 0)} y={btnY + 26} textAnchor="middle" fontSize={15} fontWeight={800} fill="#fff">Add</text>
        </g>
        {/* measurements */}
        {marks.map((m, i) => {
          const y = (m.y1 + m.y2) / 2, ok = SCALE.includes(shown[i]) && onScale;
          return (
            <g key={NAMES[i]} opacity={clamp((t - 1 - i * 0.4) / 0.4)}>
              <line x1={X + CW + 16} x2={X + CW + 16} y1={m.y1} y2={m.y2} stroke={ok ? SC.mint : SC.error} strokeWidth={3} />
              <line x1={X + CW + 10} x2={X + CW + 22} y1={m.y1} y2={m.y1} stroke={ok ? SC.mint : SC.error} strokeWidth={2} />
              <line x1={X + CW + 10} x2={X + CW + 22} y1={m.y2} y2={m.y2} stroke={ok ? SC.mint : SC.error} strokeWidth={2} />
              <text x={X + CW + 32} y={y + 5} fontSize={16} fontWeight={900} fill={ok ? SC.mint : SC.error}>{shown[i]}px</text>
              <text x={X + CW + 86} y={y + 5} fontSize={12} fontWeight={600} fill={SC.muted}>{NAMES[i]}</text>
            </g>
          );
        })}

        {/* the scale */}
        {t >= 11 && (
          <g transform="translate(610 490)">
            <text x={0} y={-20} fontSize={13} fontWeight={800} fill={SC.muted} opacity={clamp((t - 11) / 0.4)}>SPACING SCALE</text>
            {SCALE.map((s, i) => (
              <g key={s} transform={`translate(${i * 48} 0) scale(${clamp(back((t - 11.3 - i * 0.15) / 0.4))})`}>
                <rect width={40} height={40} rx={10} fill={SC.surface} stroke={SC.mint} strokeWidth={2} />
                <text x={20} y={26} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.text}>{s}</text>
              </g>
            ))}
          </g>
        )}
        {t >= 6 && t < 11 && <Pen x={780} y={300} scale={0.5} mood="think" />}
        {t >= 23.5 && t < 29 && (
          <g opacity={clamp((t - 23.5) / 0.5)}>
            <text x={640} y={130} fontSize={16} fontWeight={800} fill={SC.mint}>Name + price: one unit → 4</text>
            <text x={640} y={160} fontSize={16} fontWeight={800} fill={SC.discover}>The action stands apart → 24</text>
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Use a scale', l: '4 · 8 · 16 · 24 · 32 · 48', c: SC.mint }, { x: 480, n: 'Small inside', l: 'Related things sit close', c: SC.discover }, { x: 760, n: 'Big between', l: 'Groups stand apart', c: SC.design }].map((f, i) => {
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
