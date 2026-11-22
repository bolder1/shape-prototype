'use client';
// Scene for fd.2-3: three short acts. Fitts (a finger misses a tiny ×), Hick (9 plans vs 3, with a stopwatch),
// Jakob (eyes hunt for a cart in the wrong corner). Pure function of t (seconds, 0–34).
import { CheckIcon, HandPointingIcon, ShoppingCartIcon, TimerIcon, XIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, lerp, p, Pen, SC } from './shared';

const W = 960, H = 540;

function Title({ t, at, out, n, name }: { t: number; at: number; out: number; n: number; name: string }) {
  return t >= at && t < out ? (
    <g opacity={clamp((t - at) / 0.4) * (1 - p(t, out - 0.5, out))}>
      <text x={48} y={60} fontSize={13} fontWeight={800} letterSpacing={1.5} fill={SC.muted}>LAW {n} OF 3</text>
      <text x={48} y={92} fontSize={28} fontWeight={800} fill={SC.text}>{name}</text>
    </g>
  ) : null;
}

/** A stopwatch readout that counts up while running. */
function Watch({ x, y, value, good }: { x: number; y: number; value: number; good?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-70} y={-24} width={140} height={48} rx={14} fill={SC.surface} stroke={good ? SC.mint : SC.line} strokeWidth={2} />
      <TimerIcon x={-56} y={-12} width={24} height={24} color={good ? SC.mint : SC.muted} weight="bold" />
      <text x={14} y={8} textAnchor="middle" fontSize={22} fontWeight={800} fill={good ? SC.mint : SC.text}>{value.toFixed(1)} s</text>
    </g>
  );
}

export function UxLawsScene({ t }: { t: number }) {
  // ---------- Fitts (0–11) ----------
  const f1 = p(t, 1.6, 3.2), f1miss = t >= 3.2 && t < 4.4, f1b = p(t, 4.4, 5.6);
  const finger = t < 6.4
    ? { x: lerp(lerp(300, 438, f1), 432, f1b), y: lerp(lerp(470, 132, f1), 118, f1b) }
    : { x: lerp(300, 300, 0), y: lerp(470, 352, p(t, 7, 7.6)) };
  const smallTime = t < 1.6 ? 0 : Math.min(lerp(0, 1.6, (t - 1.6) / 4), 1.6);
  const bigTime = t < 7 ? 0 : Math.min(lerp(0, 0.4, (t - 7) / 0.6), 0.4);
  // ---------- Hick (11–22) ----------
  const nine = t < 16.6;
  const scan = nine ? Math.floor(clamp((t - 12) / 3.8) * 9) : Math.floor(clamp((t - 17.4) / 1) * 3);
  const hickTime = nine ? Math.min(Math.max(0, t - 12) * 1.6, 6.2) : Math.min(Math.max(0, t - 17.4) * 1.4, 1.8);
  // ---------- Jakob (22–30) ----------
  const cartMove = p(t, 26.6, 27.6);
  const lookTR = t >= 23 && t < 26.4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Fitts's, Hick's and Jakob's laws">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <Title t={t} at={0} out={11} n={1} name="Fitts’s law" />
      <Title t={t} at={11} out={22} n={2} name="Hick’s law" />
      <Title t={t} at={22} out={30} n={3} name="Jakob’s law" />

      {/* ================= Fitts ================= */}
      {t < 11 && (
        <g opacity={1 - p(t, 10.4, 11)}>
          <rect x={220} y={100} width={240} height={400} rx={28} fill={SC.surface} stroke={SC.text} strokeOpacity={0.2} strokeWidth={3} />
          <rect x={240} y={110} width={200} height={60} rx={10} fill={SC.soft} />
          <text x={254} y={146} fontSize={12} fontWeight={700} fill={SC.text}>Get 20% off today!</text>
          <g transform="translate(428 122)"><circle r={7} fill={SC.muted} opacity={0.3} /><XIcon x={-5} y={-5} width={10} height={10} color={SC.text} weight="bold" /></g>
          {f1miss && <circle cx={438} cy={132} r={lerp(6, 22, (t - 3.2) / 1.2)} fill="none" stroke={SC.error} strokeWidth={3} opacity={1 - (t - 3.2) / 1.2} />}
          {t >= 6.4 && (
            <g transform={`scale(${t >= 7.6 ? 1 : 1})`}>
              <rect x={240} y={330} width={200} height={48} rx={14} fill={SC.brand} opacity={p(t, 6.4, 6.8)} />
              <text x={340} y={360} textAnchor="middle" fontSize={15} fontWeight={800} fill="#fff" opacity={p(t, 6.4, 6.8)}>Got it</text>
            </g>
          )}
          <HandPointingIcon x={finger.x - 18} y={finger.y - 4} width={40} height={40} color={SC.text} weight="fill" />
          <g opacity={p(t, 1.8, 2.2)}>
            <text x={620} y={160} fontSize={13} fontWeight={700} fill={SC.muted}>Tiny and far</text>
            <Watch x={690} y={196} value={smallTime} />
            {t > 3.2 && t < 4.4 && <text x={620} y={244} fontSize={13} fontWeight={800} fill={SC.error}>Missed!</text>}
          </g>
          <g opacity={p(t, 6.8, 7.2)}>
            <text x={620} y={300} fontSize={13} fontWeight={700} fill={SC.muted}>Big and close</text>
            <Watch x={690} y={336} value={bigTime} good={t >= 7.6} />
          </g>
          <text x={620} y={430} fontSize={16} fontWeight={800} fill={SC.text} opacity={p(t, 8.2, 8.8)}>Size and distance decide speed.</text>
        </g>
      )}

      {/* ================= Hick ================= */}
      {t >= 11 && t < 22 && (
        <g opacity={clamp((t - 11) / 0.5) * (1 - p(t, 21.4, 22))}>
          {(nine ? Array.from({ length: 9 }) : Array.from({ length: 3 })).map((_, i) => {
            const cols = nine ? 3 : 3, cw = nine ? 120 : 150, ch = nine ? 92 : 220;
            const x = (nine ? 120 : 110) + (i % cols) * (cw + 16), y = nine ? 130 + Math.floor(i / cols) * (ch + 14) : 150;
            const popular = !nine && i === 1;
            const k = back((t - ((nine ? 11.4 : 16.8) + i * 0.08)) / 0.4);
            return (
              <g key={`${nine}-${i}`} transform={`translate(${x} ${y}) scale(${clamp(k)})`}>
                <rect width={cw} height={ch} rx={12} fill={SC.surface} stroke={popular ? SC.mint : i < scan ? SC.build : SC.line} strokeWidth={popular ? 3 : 2} />
                <text x={14} y={26} fontSize={13} fontWeight={800} fill={SC.text}>{nine ? `Plan ${i + 1}` : ['Basic', 'Plus', 'Team'][i]}</text>
                <text x={14} y={48} fontSize={11.5} fill={SC.muted}>{nine ? `₹${(i + 1) * 99}/mo` : ['₹99/mo', '₹299/mo', '₹799/mo'][i]}</text>
                {popular && <><rect x={14} y={ch - 46} width={cw - 28} height={30} rx={10} fill={SC.mint} /><text x={cw / 2} y={ch - 26} textAnchor="middle" fontSize={12} fontWeight={800} fill="#fff">Most popular</text></>}
              </g>
            );
          })}
          <Watch x={760} y={200} value={hickTime} good={!nine && t > 18.6} />
          <text x={680} y={260} fontSize={13} fontWeight={700} fill={SC.muted}>{nine ? '9 plans: time to decide' : '3 plans: time to decide'}</text>
          {!nine && t >= 18.8 && <text x={680} y={300} fontSize={15} fontWeight={800} fill={SC.text} opacity={p(t, 18.8, 19.4)}>Fewer choices, faster decisions.</text>}
        </g>
      )}

      {/* ================= Jakob ================= */}
      {t >= 22 && t < 30.4 && (
        <g opacity={clamp((t - 22) / 0.5) * (1 - p(t, 29.8, 30.4))}>
          <rect x={200} y={120} width={560} height={360} rx={16} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
          <rect x={200} y={120} width={560} height={50} rx={16} fill={SC.soft} />
          <text x={226} y={152} fontSize={16} fontWeight={800} fill={SC.text}>ShopKart</text>
          {[0, 1, 2, 3, 4, 5].map(i => <rect key={i} x={230 + (i % 3) * 172} y={196 + Math.floor(i / 3) * 132} width={150} height={112} rx={10} fill={SC.soft} />)}
          {/* the cart: bottom-left "to be different", then where everyone looks */}
          <g transform={`translate(${lerp(236, 720, cartMove)} ${lerp(452, 146, cartMove)})`}>
            <circle r={18} fill={cartMove >= 1 ? SC.mint : SC.design} />
            <ShoppingCartIcon x={-11} y={-11} width={22} height={22} color="#fff" weight="bold" />
          </g>
          {/* where eyes go first: top-right */}
          {lookTR && [0, 1, 2].map(i => t >= 23.2 + i * 0.6 && <circle key={i} cx={720 - i * 26} cy={146 + i * 6} r={10} fill={SC.build} opacity={0.75} />)}
          {t >= 24.6 && t < 26.4 && <text x={600} y={210} fontSize={14} fontWeight={800} fill={SC.error}>“Where’s the cart?”</text>}
          {cartMove >= 1 && <g transform={`translate(720 104) scale(${back((t - 27.6) / 0.4)})`}><circle r={13} fill={SC.mint} /><CheckIcon x={-8} y={-8} width={16} height={16} color="#fff" weight="bold" /></g>}
          {t >= 27.8 && <text x={480} y={516} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.text} opacity={p(t, 27.8, 28.4)}>Put things where people already expect them.</text>}
        </g>
      )}

      {/* ================= finale ================= */}
      {t >= 30 && [{ x: 200, n: 'Fitts', line: 'Big & close', c: SC.discover }, { x: 480, n: 'Hick', line: 'Fewer choices', c: SC.design }, { x: 760, n: 'Jakob', line: 'Familiar patterns', c: SC.grow }].map((f, i) => {
        const k = back((t - (30.2 + i * 0.25)) / 0.5);
        return (
          <g key={f.n} transform={`translate(${f.x} 270) scale(${clamp(k)})`}>
            <rect x={-110} y={-70} width={220} height={140} rx={18} fill={SC.surface} stroke={f.c} strokeWidth={3} />
            <text y={-10} textAnchor="middle" fontSize={24} fontWeight={800} fill={f.c}>{f.n}</text>
            <text y={24} textAnchor="middle" fontSize={15} fontWeight={700} fill={SC.text}>{f.line}</text>
          </g>
        );
      })}

      {t >= 8.6 && t < 10.6 && <Pen x={860} y={420} scale={0.45} mood="cheer" />}
      {t >= 19 && t < 21.4 && <Pen x={880} y={400} scale={0.45} mood="cheer" />}
      {t >= 24.4 && t < 26.6 && <Pen x={880} y={400} scale={0.45} mood="think" />}
    </svg>
  );
}
