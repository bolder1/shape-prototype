'use client';
// Scene for ax.1-2: a booking page beside four pillars. Each beat raises one pillar (Perceivable, Operable, Understandable,
// Robust) and marks the parts of the page it covers: alt text and captions, keyboard focus, a clear error, real HTML.
// Pure function of t (0–34).
import { back, clamp, Grid, p, SC } from './shared';

const W = 960, H = 540;
export const PILLARS = [
  { id: 'p', n: 'Perceivable', q: 'Can people sense it?', c: SC.discover, at: 5 },
  { id: 'o', n: 'Operable', q: 'Can people use it?', c: SC.design, at: 11 },
  { id: 'u', n: 'Understandable', q: 'Does it make sense?', c: SC.grow, at: 17 },
  { id: 'r', n: 'Robust', q: 'Does it work with their tools?', c: SC.build, at: 23 },
] as const;

const Tag = ({ x, y, text, c, o }: { x: number; y: number; text: string; c: string; o: number }) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <rect x={0} y={-13} width={text.length * 7 + 18} height={26} rx={13} fill={c} />
    <text x={9} y={5} fontSize={12} fontWeight={800} fill="#fff" fontFamily="ui-monospace, Consolas, monospace">{text}</text>
  </g>
);

export function PourScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const on = (k: number) => clamp((t - PILLARS[k].at) / 0.5);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: the four WCAG principles, Perceivable, Operable, Understandable and Robust">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {/* the booking page */}
        <g opacity={clamp(t / 0.5)}>
          <rect x={60} y={70} width={400} height={410} rx={22} fill="#ffffff" stroke={SC.line} strokeWidth={2} />
          <text x={86} y={108} fontSize={18} fontWeight={800} fill="#111827">Book a homestay</text>
          <rect x={86} y={124} width={170} height={100} rx={12} fill="url(#pour-img)" />
          <g transform="translate(272 124)"><rect width={162} height={100} rx={12} fill="#1f2937" /><path d="M72 36 l24 14 -24 14 Z" fill="#fff" /></g>
          <text x={86} y={258} fontSize={12} fontWeight={700} fill="#374151">Guests</text>
          <rect x={86} y={266} width={348} height={40} rx={8} fill="#fff" stroke={t >= 17 ? '#dc2626' : '#d1d5db'} strokeWidth={2} />
          <text x={98} y={291} fontSize={13} fill="#111827">12</text>
          {t >= 11 && <rect x={82} y={262} width={356} height={48} rx={11} fill="none" stroke="#2563eb" strokeWidth={3} opacity={on(1)} />}
          {t >= 17 && <text x={86} y={326} fontSize={12} fontWeight={700} fill="#b91c1c" opacity={on(2)}>⚠ Up to 8 guests. Choose 8 or fewer.</text>}
          <rect x={86} y={346} width={348} height={48} rx={12} fill="#2563eb" />
          <text x={260} y={376} textAnchor="middle" fontSize={15} fontWeight={800} fill="#fff">Book for ₹4,200</text>
          <defs><linearGradient id="pour-img" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#34d399" /><stop offset="1" stopColor="#0ea5e9" /></linearGradient></defs>
          {/* tags */}
          <Tag x={92} y={212} text='alt="Hill cottage"' c={SC.discover} o={on(0)} />
          <Tag x={360} y={212} text="CC" c={SC.discover} o={on(0)} />
          <Tag x={366} y={286} text="Tab ↹" c={SC.design} o={on(1)} />
          <Tag x={250} y={420} text="<button>" c={SC.build} o={on(3)} />
          <Tag x={86} y={420} text='<label for>' c={SC.build} o={on(3)} />
        </g>

        {/* the pillars */}
        {PILLARS.map((pl, k) => {
          const x = 510 + k * 105, h = 300 * clamp(back((t - pl.at) / 0.6));
          return (
            <g key={pl.id}>
              <rect x={x} y={460 - h} width={90} height={h} rx={12} fill={pl.c} opacity={0.9} />
              <rect x={x - 6} y={450} width={102} height={18} rx={6} fill={SC.line} />
              {h > 60 && (
                <g>
                  <text x={x + 45} y={460 - h + 50} textAnchor="middle" fontSize={40} fontWeight={900} fill="#fff">{pl.n[0]}</text>
                  <text x={x + 45} y={460 - h + 80} textAnchor="middle" fontSize={11} fontWeight={800} fill="#fff">{pl.n}</text>
                </g>
              )}
            </g>
          );
        })}
        {[0, 1, 2, 3].map(k => {
          const now = t >= PILLARS[k].at && t < (PILLARS[k + 1]?.at ?? 29);
          return now && <text key={k} x={720} y={120} textAnchor="middle" fontSize={20} fontWeight={800} fill={PILLARS[k].c} opacity={on(k)}>{PILLARS[k].q}</text>;
        })}
      </g>

      {fin > 0 && [{ x: 200, n: 'Perceivable', l: 'Alt text · captions · contrast', c: SC.discover }, { x: 480, n: 'Operable · Understandable', l: 'Keyboard, time · plain, predictable', c: SC.design }, { x: 760, n: 'Robust', l: 'Real HTML for real tools', c: SC.build }].map((f, i) => {
        const k = back((t - (29.2 + i * 0.25)) / 0.5);
        return (
          <g key={f.n} transform={`translate(${f.x} 260) scale(${clamp(k)})`}>
            <rect x={-125} y={-70} width={250} height={140} rx={18} fill={SC.surface} stroke={f.c} strokeWidth={3} />
            <text y={-8} textAnchor="middle" fontSize={f.n.length > 14 ? 17 : 22} fontWeight={800} fill={f.c}>{f.n}</text>
            <text y={26} textAnchor="middle" fontSize={13} fontWeight={600} fill={SC.text}>{f.l}</text>
          </g>
        );
      })}
    </svg>
  );
}
