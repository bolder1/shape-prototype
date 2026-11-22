'use client';
// Scene for pr.1-2: a 40-screen demo gets vague praise; a sharp question is written; the grid fades to the four screens on
// its path; five testers try the task and three fail, which is a clear answer. Pure function of t (0–34).
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
const QUESTION = 'Can first-time users change the delivery address after ordering, without help?';
/** The four screens on the path, by index in the 8 × 5 grid. */
const PATH = [9, 18, 27, 36];
const PATH_NAMES = ['Order confirmed', 'Tracking', 'Address picker', 'Updated tracking'];

export function QuestionProtoScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const focus = p(t, 17.2, 18.6);
  const typed = Math.round(QUESTION.length * clamp((t - 12.3) / 3));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a big demo teaches nothing; a small prototype built for one question gives a clear answer">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {/* the 40-screen demo, then the path */}
        {t < 23.4 && (
          <g opacity={1 - p(t, 22.8, 23.4)}>
            {Array.from({ length: 40 }, (_, i) => {
              const col = i % 8, row = Math.floor(i / 8), k = PATH.indexOf(i), onPath = k >= 0;
              const x0 = 150 + col * 84, y0 = 150 + row * 60;
              const x = onPath ? lerp(x0, 175 + k * 170, focus) : x0, y = onPath ? lerp(y0, 300, focus) : y0;
              const s = onPath ? lerp(1, 1.9, focus) : 1;
              return (
                <g key={i} transform={`translate(${x} ${y}) scale(${s * clamp(back((t - i * 0.02) / 0.4))})`} opacity={onPath ? 1 : 1 - focus}>
                  <rect x={-30} y={-24} width={60} height={48} rx={7} fill={SC.surface} stroke={onPath && t >= 17 ? SC.discover : SC.line} strokeWidth={onPath && t >= 17 ? 2.5 : 1.5} />
                  <rect x={-22} y={-16} width={30} height={5} rx={2.5} fill={SC.line} />
                  <rect x={-22} y={-6} width={44} height={14} rx={3} fill={SC.line} opacity={0.7} />
                  {onPath && focus > 0.9 && <text y={42} textAnchor="middle" fontSize={8} fontWeight={800} fill={SC.text}>{PATH_NAMES[k]}</text>}
                </g>
              );
            })}
            {focus > 0.9 && [0, 1, 2].map(k => <path key={k} d={`M${175 + k * 170 + 62} 300 h46`} stroke={SC.discover} strokeWidth={3} markerEnd="url(#qp-arrow)" />)}
            {t < 6.2 && <g transform="translate(150 470)"><rect width={150} height={34} rx={17} fill={SC.error} /><text x={75} y={22} textAnchor="middle" fontSize={14} fontWeight={800} fill="#fff">40 screens · 2 weeks</text></g>}
          </g>
        )}
        <defs><marker id="qp-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill={SC.discover} /></marker></defs>

        {/* vague praise */}
        {t >= 6 && t < 12 && ['“Looks great!”', '“Nice colours.”', '“I’d use it.”'].map((q, i) => (
          <g key={q} transform={`translate(${330 + i * 190} 470) scale(${clamp(back((t - 6.4 - i * 0.6) / 0.4))})`}>
            <rect x={-80} y={-22} width={160} height={44} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            <text y={6} textAnchor="middle" fontSize={15} fontWeight={700} fontStyle="italic" fill={SC.text}>{q}</text>
          </g>
        ))}
        {t >= 9.4 && t < 12 && <text x={480} y={90} textAnchor="middle" fontSize={17} fontWeight={800} fill={SC.error}>What did we learn? Nothing we can act on.</text>}

        {/* the question */}
        {t >= 12 && t < 23.4 && (
          <g opacity={1 - p(t, 22.8, 23.4)}>
            <rect x={100} y={60} width={760} height={50} rx={14} fill={SC.surface} stroke={SC.discover} strokeWidth={3} />
            <text x={120} y={92} fontSize={16} fontWeight={800} fill={SC.text}>{QUESTION.slice(0, typed)}</text>
          </g>
        )}

        {/* the test */}
        {t >= 23 && t < 29.4 && (
          <g opacity={clamp((t - 23) / 0.5)}>
            <text x={480} y={150} textAnchor="middle" fontSize={17} fontWeight={800} fill={SC.text}>Task: “Your food is cooking. Send it to your office instead.”</text>
            {[true, false, false, true, false].map((ok, i) => {
              const Icon = ok ? CheckIcon : XIcon;
              return (
                <g key={i} transform={`translate(${240 + i * 120} 270) scale(${clamp(back((t - 23.6 - i * 0.35) / 0.4))})`}>
                  <circle r={40} fill={SC.surface} stroke={ok ? SC.mint : SC.error} strokeWidth={3} />
                  <circle cy={-10} r={12} fill={SC.muted} opacity={0.6} /><path d="M-20 22 q20 -24 40 0" fill={SC.muted} opacity={0.6} />
                  <g transform="translate(22 -30)"><circle r={14} fill={ok ? SC.mint : SC.error} /><Icon x={-9} y={-9} width={18} height={18} color="#fff" weight="bold" /></g>
                </g>
              );
            })}
            <text x={480} y={380} textAnchor="middle" fontSize={18} fontWeight={800} fill={SC.mint} opacity={clamp((t - 25.6) / 0.4)}>3 of 5 couldn’t find “Change address”. A clear answer.</text>
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Question first', l: 'Who · task · success', c: SC.discover }, { x: 480, n: 'Only the path', l: 'Four screens, not forty', c: SC.design }, { x: 760, n: 'Task, then watch', l: 'Behaviour over praise', c: SC.mint }].map((f, i) => {
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
