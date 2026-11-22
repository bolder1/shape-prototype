'use client';
// Scene for gr.1-2: a running app's onboarding as a road of nine screens to the aha (a first tracked run). Dots (new
// users) walk it and drop out at each screen; then the path is cleared (needed steps stay, the rest move after the aha
// or are cut) and most dots reach the star. Pure function of t (0–34).
import { StarIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
const STEPS = [
  { n: 'Sign up', k: 'later' }, { n: 'Profile', k: 'later' }, { n: 'Photo', k: 'later' }, { n: 'Goals', k: 'later' },
  { n: 'Friends', k: 'later' }, { n: 'Tour video', k: 'cut' }, { n: 'Rate us', k: 'cut' }, { n: 'Location', k: 'before' }, { n: 'Start run', k: 'before' },
];
const DOTS = 24;
/** The screen each dot gives up at in the long version (9 = reaches the aha). Fixed so the scene is a pure function. */
const QUIT = Array.from({ length: DOTS }, (_, i) => [0, 1, 0, 2, 3, 1, 4, 9, 0, 5, 2, 6, 1, 3, 7, 0, 9, 2, 4, 1, 8, 3, 0, 6][i]);
const QUIT_SHORT = Array.from({ length: DOTS }, (_, i) => (i % 6 === 0 ? 0 : i % 11 === 0 ? 1 : 9));

export function AhaScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const clear = p(t, 18.4, 20);
  const short = t >= 24;
  const before = STEPS.filter(s => s.k === 'before');

  // Long road: nine screens from x 70 to 790, aha at 880. Short road: two screens then the aha.
  const longX = (i: number) => 70 + i * 90;
  const shortX = (i: number) => 260 + i * 180;
  const AHA_X = 860, ROAD_Y = 230;

  /** New users walking the road: each moves screen to screen, stopping (and dropping away) at the screen it quits on. */
  const walk = (start: number, quit: number[], n: number, xOf: (i: number) => number, dur = 3.6, gap = 0.12) => {
    const nodes = [...Array.from({ length: n }, (_, i) => xOf(i)), AHA_X];
    return Array.from({ length: DOTS }, (_, d) => {
      const pos = clamp((t - start - d * gap) / dur) * n;
      const end = quit[d] === 9 ? n : quit[d];
      const stop = Math.min(pos, end), i0 = Math.min(Math.floor(stop), n - 1);
      const x = stop >= n ? AHA_X : lerp(nodes[i0], nodes[i0 + 1], stop - i0);
      const over = quit[d] === 9 ? 0 : Math.max(0, pos - end);
      return <circle key={d} cx={x} cy={ROAD_Y + 60 + ((d * 7) % 5) * 9 + over * 40} r={5} fill={over > 0 ? SC.error : SC.discover} opacity={Math.max(0, 1 - over * 1.5)} />;
    });
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: removing onboarding steps between new users and the aha moment">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {/* the aha */}
        <g transform={`translate(${AHA_X} ${ROAD_Y})`} opacity={t >= 12 ? 1 : 0.35}>
          <circle r={44} fill={SC.mint} opacity={t >= 12 ? 0.25 + 0.1 * Math.sin(t * 4) : 0.15} />
          <StarIcon x={-22} y={-22} width={44} height={44} color={SC.mint} weight="fill" />
          <text y={68} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.mint}>First run</text>
        </g>

        {!short && STEPS.map((s, i) => {
          const moved = s.k === 'later' ? clear : 0, cut = s.k === 'cut' ? clear : 0;
          const bi = before.findIndex(b => b.n === s.n);
          const x = s.k === 'before' ? lerp(longX(i), shortX(bi), clear) : s.k === 'later' ? lerp(longX(i), 300 + STEPS.slice(0, i).filter(z => z.k === 'later').length * 110, moved) : longX(i);
          const y = s.k === 'later' ? lerp(ROAD_Y, 430, moved) : ROAD_Y;
          return (
            <g key={s.n} transform={`translate(${x} ${y}) scale(${clamp(back((t - i * 0.12) / 0.4))})`} opacity={1 - cut}>
              <rect x={-36} y={-28} width={72} height={56} rx={10} fill={SC.surface} stroke={s.k === 'before' && t >= 18 ? SC.mint : SC.line} strokeWidth={2} />
              <text y={5} textAnchor="middle" fontSize={11} fontWeight={800} fill={SC.text}>{s.n}</text>
            </g>
          );
        })}
        {t >= 18.6 && t < 24 && <text x={300} y={385} fontSize={13} fontWeight={800} fill={SC.muted} opacity={clear}>After the first run →</text>}
        {short && (
          <g>
            {before.map((s, i) => (
              <g key={s.n} transform={`translate(${shortX(i)} ${ROAD_Y})`}>
                <rect x={-36} y={-28} width={72} height={56} rx={10} fill={SC.surface} stroke={SC.mint} strokeWidth={2} />
                <text y={5} textAnchor="middle" fontSize={11} fontWeight={800} fill={SC.text}>{s.n}</text>
              </g>
            ))}
            {STEPS.filter(s => s.k === 'later').map((s, i) => (
              <g key={s.n} transform={`translate(${300 + i * 110} 430)`} opacity={0.7}>
                <rect x={-36} y={-22} width={72} height={44} rx={10} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text y={4} textAnchor="middle" fontSize={11} fontWeight={700} fill={SC.muted}>{s.n}</text>
              </g>
            ))}
            <text x={300} y={385} fontSize={13} fontWeight={800} fill={SC.muted}>After the first run →</text>
          </g>
        )}

        {/* the walkers */}
        {t >= 1.5 && t < 12 && walk(1.5, QUIT, 9, longX)}
        {short && walk(24.2, QUIT_SHORT, 2, shortX, 2.2, 0.06)}
        {t >= 6.5 && t < 12 && <text x={480} y={110} textAnchor="middle" fontSize={17} fontWeight={800} fill={SC.error}>Only 2 in 24 reach the first run.</text>}
        {t >= 12.4 && t < 18 && <text x={480} y={110} textAnchor="middle" fontSize={17} fontWeight={800} fill={SC.mint}>People who finish a first run keep running with the app.</text>}
        {t >= 26 && <text x={480} y={110} textAnchor="middle" fontSize={17} fontWeight={800} fill={SC.mint}>Two taps to the aha. Most people get there.</text>}
      </g>

      {fin > 0 && [{ x: 200, n: 'Know your aha', l: 'The moment value is felt', c: SC.discover }, { x: 480, n: 'Clear the path', l: 'Only what the aha needs', c: SC.design }, { x: 760, n: 'Ask later', l: 'Accounts after value', c: SC.mint }].map((f, i) => {
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
