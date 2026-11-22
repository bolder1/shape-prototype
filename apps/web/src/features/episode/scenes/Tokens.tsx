'use client';
// Scene for ds.1-2: #2563EB pasted into nine places across three screens; a hand-made rebrand misses one; the value gets
// a name (color-primary) that every element points at; changing the token turns them all green at once; then spacing,
// type and radius tokens. Pure function of t (0–34).
import { back, clamp, Grid, p, SC } from './shared';

const W = 960, H = 540;
const BLUE = '#2563eb', GREEN = '#16a34a';
const SCREENS = [140, 380, 620];
const MISSED = 5;

export function TokensScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const named = t >= 12;
  const screens = t < 22.4;

  /** The colour of element j (0–8) at time t. */
  const colour = (j: number) => {
    if (t >= 6.4 && t < 12) return j !== MISSED && t >= 6.6 + j * 0.55 ? GREEN : BLUE;
    if (t >= 17.4) return GREEN;
    return BLUE;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a colour pasted everywhere, then named as a token and changed once">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {screens && (
          <g opacity={1 - p(t, 21.8, 22.4)}>
            {named && (
              <g transform={`translate(480 70) scale(${clamp(back((t - 12.2) / 0.5))})`}>
                <rect x={-110} y={-22} width={220} height={44} rx={22} fill={SC.surface} stroke={SC.discover} strokeWidth={3} />
                <circle cx={-82} cy={0} r={10} fill={t >= 17.4 ? GREEN : BLUE} />
                <text x={10} y={6} textAnchor="middle" fontSize={17} fontWeight={800} fill={SC.text} fontFamily="ui-monospace, Consolas, monospace">color-primary</text>
              </g>
            )}
            {SCREENS.map((x, s) => (
              <g key={x} transform={`translate(${x} 130) scale(${clamp(back((t - s * 0.25) / 0.5))})`}>
                <rect width={200} height={320} rx={22} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                {/* tab, link, button */}
                {[0, 1, 2].map(k => {
                  const j = s * 3 + k, c = colour(j);
                  const pos = [[20, 50], [20, 150], [20, 250]][k];
                  return (
                    <g key={k}>
                      {named && <line x1={pos[0] + 60} y1={pos[1]} x2={480 - x} y2={-38} stroke={SC.discover} strokeWidth={1.2} strokeDasharray="4 4" opacity={clamp((t - 12.6) / 0.5) * 0.7} />}
                      {k === 0 && <><text x={pos[0]} y={pos[1]} fontSize={14} fontWeight={800} fill={c}>Orders</text><rect x={pos[0]} y={pos[1] + 8} width={52} height={4} rx={2} fill={c} /></>}
                      {k === 1 && <text x={pos[0]} y={pos[1]} fontSize={14} fontWeight={700} fill={c} textDecoration="underline">See details</text>}
                      {k === 2 && <><rect x={pos[0]} y={pos[1] - 26} width={160} height={42} rx={10} fill={c} /><text x={pos[0] + 80} y={pos[1] + 0} textAnchor="middle" fontSize={15} fontWeight={800} fill="#fff">Pay now</text></>}
                      <text x={pos[0] + 100} y={pos[1] + (k === 2 ? 34 : 22)} fontSize={11} fontWeight={700} fill={SC.muted} fontFamily="ui-monospace, Consolas, monospace" textAnchor="middle">
                        {named ? 'color-primary' : c === GREEN ? '#16A34A' : '#2563EB'}
                      </text>
                      {j === MISSED && t >= 11 && t < 12 && <circle cx={pos[0] + 50} cy={pos[1] - 5} r={34} fill="none" stroke={SC.error} strokeWidth={3} />}
                    </g>
                  );
                })}
                {[0, 1, 2, 3].map(r => <rect key={r} x={20} y={90 + r * 10} width={r === 3 ? 90 : 160} height={5} rx={2.5} fill={SC.line} />)}
              </g>
            ))}
            {t >= 6.4 && t < 12 && <text x={480} y={500} textAnchor="middle" fontSize={16} fontWeight={800} fill={t >= 11 ? SC.error : SC.muted}>{t >= 11 ? 'One missed. Now the app has an old blue and a new green.' : 'Rebranding by hand, one copy at a time…'}</text>}
            {t >= 17.6 && <text x={480} y={500} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.mint} opacity={clamp((t - 17.6) / 0.4)}>One edit. All nine changed. Nothing missed.</text>}
          </g>
        )}

        {/* more kinds of token */}
        {t >= 22 && t < 29.4 && (
          <g opacity={clamp((t - 22) / 0.5)}>
            {[{ n: 'color-primary', v: '#2563EB' }, { n: 'space-4', v: '16px' }, { n: 'text-title', v: '20px · 600' }, { n: 'radius-md', v: '8px' }].map((k, i) => (
              <g key={k.n} transform={`translate(${150 + i * 220} 270) scale(${clamp(back((t - 22.3 - i * 0.3) / 0.5))})`}>
                <rect x={-95} y={-95} width={190} height={190} rx={22} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                {i === 0 && <rect x={-36} y={-66} width={72} height={60} rx={12} fill={BLUE} />}
                {i === 1 && <g><rect x={-60} y={-60} width={30} height={46} rx={6} fill={SC.line} /><rect x={30} y={-60} width={30} height={46} rx={6} fill={SC.line} /><path d="M-28 -37 H28" stroke={SC.discover} strokeWidth={3} /><path d="M-28 -45 v16 M28 -45 v16" stroke={SC.discover} strokeWidth={3} /></g>}
                {i === 2 && <text y={-18} textAnchor="middle" fontSize={44} fontWeight={600} fill={SC.text}>Aa</text>}
                {i === 3 && <path d="M-36 -10 V-40 Q-36 -64 -12 -64 H36" fill="none" stroke={SC.discover} strokeWidth={6} strokeLinecap="round" />}
                <text y={34} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.text} fontFamily="ui-monospace, Consolas, monospace">{k.n}</text>
                <text y={60} textAnchor="middle" fontSize={14} fontWeight={700} fill={SC.muted}>{k.v}</text>
              </g>
            ))}
            <text x={480} y={430} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.mint} opacity={clamp((t - 24) / 0.4)}>Any decision you repeat deserves a name.</text>
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Name the value', l: 'color-primary, not #2563EB', c: SC.discover }, { x: 480, n: 'Change once', l: 'Every use updates', c: SC.design }, { x: 760, n: 'One language', l: 'Shared by design and code', c: SC.mint }].map((f, i) => {
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
