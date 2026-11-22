'use client';
// Scene for rs.1-2: numbers show where (60% drop at payment), interviews show why (trust); then where each one lies:
// a click spike that's really confusion, and "3 of 5" turned into "60% of users". Pure function of t (0–34).
import { ChartBarIcon, ChatCircleIcon, HeartIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, lerp, p, Pen, SC } from './shared';

const W = 960, H = 540;
const FUNNEL = [{ l: 'Visited', v: 100 }, { l: 'Added to cart', v: 70 }, { l: 'Reached payment', v: 65 }, { l: 'Paid', v: 26, drop: true }];
const QUOTES = ['“Is this site even safe?”', '“Never heard of this brand.”', '“I didn’t want to type my card.”'];

function Face({ x, y, c, heart }: { x: number; y: number; c: string; heart?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cy={-22} r={14} fill="#E8C9AE" />
      <rect x={-17} y={-6} width={34} height={40} rx={12} fill={c} opacity={0.85} />
      {heart && <g transform="translate(0 -56)"><HeartIcon x={-12} y={-12} width={24} height={24} color={SC.build} weight="fill" /></g>}
    </g>
  );
}

function Stamp({ t, at, x, y, text, color }: { t: number; at: number; x: number; y: number; text: string; color: string }) {
  if (t < at) return null;
  return (
    <g transform={`translate(${x} ${y}) rotate(-8) scale(${back((t - at) / 0.4)})`}>
      <rect x={-text.length * 7.6 - 18} y={-26} width={text.length * 15.2 + 36} height={52} rx={10} fill={SC.surface} stroke={color} strokeWidth={5} />
      <text y={9} textAnchor="middle" fontSize={24} fontWeight={900} fill={color}>{text}</text>
    </g>
  );
}

export function QualQuantScene({ t }: { t: number }) {
  const act1 = clamp((t - 0.2) / 0.5) * (1 - p(t, 14.4, 15));
  const act2 = clamp((t - 15) / 0.5) * (1 - p(t, 20.4, 21));
  const act3 = clamp((t - 21) / 0.5) * (1 - p(t, 27.6, 28.2));
  const fin = p(t, 28.2, 29);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: quantitative shows where, qualitative shows why">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />

      {/* ================= where (quant) + why (qual) ================= */}
      {act1 > 0 && (
        <g opacity={act1}>
          <g transform="translate(60 80)">
            <ChartBarIcon x={0} y={0} width={26} height={26} color={SC.discover} weight="bold" />
            <text x={34} y={20} fontSize={15} fontWeight={800} fill={SC.discover}>QUANT · the numbers</text>
            {FUNNEL.map((f, i) => {
              const k = p(t, 0.6 + i * 0.5, 1.4 + i * 0.5);
              return (
                <g key={f.l} transform={`translate(0 ${60 + i * 62})`}>
                  <text y={-6} fontSize={12.5} fontWeight={600} fill={SC.text}>{f.l}</text>
                  <rect width={f.v * 3.2 * k} height={26} rx={8} fill={f.drop ? SC.error : SC.discover} opacity={0.85} />
                  <text x={f.v * 3.2 * k + 8} y={18} fontSize={13} fontWeight={800} fill={SC.text} opacity={k}>{Math.round(f.v * k)}</text>
                </g>
              );
            })}
            {t >= 3.4 && <text x={0} y={330} fontSize={15} fontWeight={800} fill={SC.error} opacity={p(t, 3.4, 3.9)}>60% drop off at payment. That’s WHERE.</text>}
            {t >= 4.6 && <text x={0} y={358} fontSize={15} fontWeight={700} fill={SC.muted} opacity={p(t, 4.6, 5.1)}>But the chart can’t say why.</text>}
          </g>
          {t >= 8 && (
            <g transform="translate(540 80)" opacity={p(t, 8, 8.6)}>
              <ChatCircleIcon x={0} y={0} width={26} height={26} color={SC.grow} weight="bold" />
              <text x={34} y={20} fontSize={15} fontWeight={800} fill={SC.grow}>QUAL · the stories</text>
              {[0, 1, 2, 3, 4].map(i => <Face key={i} x={30 + i * 70} y={110} c={[SC.discover, SC.design, SC.grow, SC.build, SC.discover][i]} />)}
              {QUOTES.map((q, i) => t >= 9.2 + i * 1.1 && (
                <g key={q} transform={`translate(0 ${170 + i * 50}) scale(${back((t - 9.2 - i * 1.1) / 0.4)})`}>
                  <rect width={320} height={38} rx={12} fill={SC.surface} stroke={SC.grow} strokeWidth={2} />
                  <text x={14} y={24} fontSize={13.5} fontWeight={600} fill={SC.text}>{q}</text>
                </g>
              ))}
              {t >= 12.8 && <text x={0} y={350} fontSize={15} fontWeight={800} fill={SC.grow} opacity={p(t, 12.8, 13.3)}>They didn’t trust the card form. That’s WHY.</text>}
            </g>
          )}
        </g>
      )}

      {/* ================= where numbers lie ================= */}
      {act2 > 0 && (
        <g opacity={act2}>
          <text x={W / 2} y={70} textAnchor="middle" fontSize={15} fontWeight={800} letterSpacing={1.5} fill={SC.muted}>WHERE NUMBERS LIE</text>
          <g transform="translate(180 130)">
            <text fontSize={14} fontWeight={700} fill={SC.text}>Clicks on “Help”, after the redesign</text>
            {[30, 34, 31, 36, 120].map((v, i) => {
              const k = p(t, 15.4 + i * 0.25, 16 + i * 0.25);
              return <rect key={i} x={i * 58} y={260 - v * 1.6 * k} width={42} height={v * 1.6 * k} rx={6} fill={i === 4 ? SC.mint : SC.discover} opacity={0.85} />;
            })}
            {t >= 16.8 && <text x={232} y={44} fontSize={18} fontWeight={800} fill={SC.mint} opacity={p(t, 16.8, 17.2)}>+300%! They love it?</text>}
          </g>
          {t >= 17.8 && (
            <g transform="translate(560 170)" opacity={p(t, 17.8, 18.3)}>
              <Face x={60} y={60} c={SC.design} />
              <rect x={110} y={20} width={230} height={46} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text x={124} y={49} fontSize={14} fontWeight={600} fill={SC.text}>“I couldn’t find anything.”</text>
            </g>
          )}
          <Stamp t={t} at={18.8} x={700} y={330} text="LOST, NOT LOVE" color={SC.error} />
        </g>
      )}

      {/* ================= where stories lie ================= */}
      {act3 > 0 && (
        <g opacity={act3}>
          <text x={W / 2} y={70} textAnchor="middle" fontSize={15} fontWeight={800} letterSpacing={1.5} fill={SC.muted}>WHERE STORIES LIE</text>
          {[0, 1, 2, 3, 4].map(i => <Face key={i} x={140 + i * 70} y={200} c={[SC.discover, SC.design, SC.grow, SC.build, SC.discover][i]} heart={i < 3 && t >= 21.8 + i * 0.3} />)}
          <text x={280} y={270} textAnchor="middle" fontSize={15} fontWeight={700} fill={SC.text} opacity={p(t, 22.6, 23)}>3 of 5 interviewees loved it</text>
          {t >= 23.6 && (
            <g transform={`translate(${lerp(560, 540, p(t, 23.6, 24.2))} 140)`} opacity={p(t, 23.6, 24.2)}>
              <rect width={320} height={190} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <rect width={320} height={34} rx={14} fill={SC.soft} />
              <text x={16} y={23} fontSize={12} fontWeight={700} fill={SC.muted}>Stakeholder slide</text>
              <text x={160} y={110} textAnchor="middle" fontSize={44} fontWeight={900} fill={SC.text}>60%</text>
              <text x={160} y={146} textAnchor="middle" fontSize={15} fontWeight={700} fill={SC.text}>of users want it!</text>
            </g>
          )}
          <Stamp t={t} at={25} x={700} y={420} text="5 PEOPLE ≠ 60%" color={SC.error} />
        </g>
      )}

      {/* ================= finale ================= */}
      {fin > 0 && [{ x: 270, n: 'Quant', l: 'Where, and how much', c: SC.discover }, { x: 690, n: 'Qual', l: 'Why', c: SC.grow }].map((f, i) => {
        const k = back((t - (28.4 + i * 0.3)) / 0.5);
        return (
          <g key={f.n} transform={`translate(${f.x} 250) scale(${clamp(k)})`}>
            <rect x={-170} y={-80} width={340} height={160} rx={20} fill={SC.surface} stroke={f.c} strokeWidth={3} />
            <text y={-6} textAnchor="middle" fontSize={30} fontWeight={800} fill={f.c}>{f.n}</text>
            <text y={30} textAnchor="middle" fontSize={16} fontWeight={600} fill={SC.text}>{f.l}</text>
          </g>
        );
      })}
      {fin > 0 && <text x={W / 2} y={420} textAnchor="middle" fontSize={20} fontWeight={800} fill={SC.text} opacity={p(t, 29.4, 30)}>Use both. Each covers the other’s blind spot.</text>}

      {t >= 4.8 && t < 8 && <Pen x={520} y={300} scale={0.45} mood="think" />}
      {t >= 19 && t < 20.4 && <Pen x={900} y={130} scale={0.45} mood="think" />}
    </svg>
  );
}
