'use client';
// Scene for rs.1-1: generative research as a flashlight in the dark (discovering freelancers' tax problems),
// then evaluative research as a magnifier over a prototype (checking tasks pass or fail). Pure function of t (0–34).
import { CheckIcon, FlashlightIcon, MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, lerp, p, Pen, SC } from './shared';

const W = 960, H = 540;
const FINDS = [
  { x: 180, y: 170, text: 'Receipts in a shoebox', at: 5.6 },
  { x: 420, y: 130, text: 'Panic every March', at: 7 },
  { x: 700, y: 180, text: '“What even is GST?”', at: 8.4 },
  { x: 260, y: 330, text: 'Clients pay late', at: 9.8 },
  { x: 560, y: 300, text: 'Spreadsheet chaos', at: 11.2 },
  { x: 760, y: 380, text: 'Fear of penalties', at: 12.6 },
];
const TASKS = [{ t: 'Add an expense', ok: true }, { t: 'Set a tax reminder', ok: true }, { t: 'Find the GST due date', ok: false }, { t: 'Export for your CA', ok: true }];

/** The flashlight wanders and lingers on each discovery as it's found. */
function lightAt(t: number) {
  const pts = [{ at: 4.4, x: 80, y: 80 }, ...FINDS.map(f => ({ at: f.at, x: f.x, y: f.y })), { at: 14.4, x: 480, y: 270 }];
  const i = pts.findIndex(q => q.at > t);
  if (i <= 0) return i === 0 ? pts[0] : pts.at(-1)!;
  const a = pts[i - 1], b = pts[i], k = p(t, a.at, b.at);
  return { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k) };
}

export function ExploreCheckScene({ t }: { t: number }) {
  const dark = clamp((t - 4) / 0.6) * (1 - p(t, 14.4, 15.2));
  const light = lightAt(t);
  const proto = p(t, 15.2, 16.4), protoOut = p(t, 28, 28.8);
  const mag = (() => { const i = Math.min(3, Math.max(0, Math.floor((t - 18.6) / 2.2))); return { x: 330, y: 190 + i * 52 }; })();

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: exploring with generative research, checking with evaluative research">
      <defs>
        <radialGradient id="beam"><stop offset="0.55" stopColor="#000" /><stop offset="1" stopColor="#fff" /></radialGradient>
        <mask id="dark-mask">
          <rect width={W} height={H} fill="#fff" />
          <circle cx={light.x} cy={light.y} r={120} fill="url(#beam)" />
          {FINDS.map((f, i) => t >= f.at && <circle key={i} cx={f.x} cy={f.y} r={70} fill="#000" opacity={0.8} />)}
        </mask>
      </defs>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />

      {/* ---- the hunch ---- */}
      {t < 5 && (
        <g transform={`translate(${W / 2} ${H / 2}) scale(${back((t - 0.2) / 0.5)})`} opacity={1 - p(t, 4.2, 5)}>
          <rect x={-210} y={-44} width={420} height={88} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
          <text y={-6} textAnchor="middle" fontSize={20} fontWeight={800} fill={SC.text}>“Freelancers struggle with taxes”</text>
          <text y={22} textAnchor="middle" fontSize={14} fill={SC.muted}>A hunch. No product. No details.</text>
        </g>
      )}

      {/* ---- discoveries in the dark ---- */}
      {t >= 4 && t < 16 && FINDS.map((f, i) => {
        const k = back((t - f.at) / 0.4);
        return t >= f.at && (
          <g key={i} transform={`translate(${f.x} ${f.y}) scale(${clamp(k)})`} opacity={1 - p(t, 15, 15.8)}>
            <rect x={-92} y={-20} width={184} height={40} rx={12} fill={SC.surface} stroke={SC.discover} strokeWidth={2} />
            <text y={6} textAnchor="middle" fontSize={13} fontWeight={700} fill={SC.text}>{f.text}</text>
          </g>
        );
      })}
      {dark > 0 && <rect width={W} height={H} fill="#05081A" opacity={dark * 0.92} mask="url(#dark-mask)" />}
      {dark > 0 && (
        <g transform={`translate(${light.x - 150} ${light.y + 110}) rotate(-30)`} opacity={dark}>
          <FlashlightIcon x={0} y={0} width={44} height={44} color="#FDE68A" weight="fill" />
        </g>
      )}
      {t >= 4.6 && t < 14.6 && <text x={W / 2} y={H - 24} textAnchor="middle" fontSize={15} fontWeight={800} fill="#FDE68A" opacity={dark}>GENERATIVE · exploring what you didn’t know to ask</text>}

      {/* ---- the prototype, built from what was found ---- */}
      {proto > 0 && protoOut < 1 && (
        <g opacity={proto * (1 - protoOut)}>
          <g transform={`translate(330 ${lerp(320, 300, proto)})`}>
            <rect x={-110} y={-190} width={220} height={380} rx={26} fill={SC.surface} stroke={SC.text} strokeOpacity={0.2} strokeWidth={3} />
            <text x={-86} y={-150} fontSize={15} fontWeight={800} fill={SC.text}>TaxBuddy</text>
            {TASKS.map((task, i) => (
              <rect key={i} x={-86} y={-126 + i * 52} width={172} height={40} rx={10} fill={SC.soft} stroke={t >= 19 + i * 2.2 + 1 ? (task.ok ? SC.mint : SC.error) : SC.line} strokeWidth={2} />
            ))}
          </g>
          {/* the checklist */}
          <text x={560} y={150} fontSize={15} fontWeight={800} fill={SC.grow} opacity={p(t, 17.6, 18.2)}>EVALUATIVE · can people do the tasks?</text>
          {TASKS.map((task, i) => {
            const at = 19 + i * 2.2, done = t >= at + 1;
            return t >= at && (
              <g key={i} transform={`translate(560 ${190 + i * 56})`} opacity={clamp((t - at) / 0.3)}>
                <rect width={300} height={42} rx={12} fill={SC.surface} stroke={done ? (task.ok ? SC.mint : SC.error) : SC.line} strokeWidth={2} />
                <text x={16} y={27} fontSize={14} fontWeight={700} fill={SC.text}>{task.t}</text>
                {done && (
                  <g transform={`translate(276 21) scale(${back((t - at - 1) / 0.35)})`}>
                    <circle r={13} fill={task.ok ? SC.mint : SC.error} />
                    {task.ok ? <CheckIcon x={-8} y={-8} width={16} height={16} color="#fff" weight="bold" /> : <XIcon x={-8} y={-8} width={16} height={16} color="#fff" weight="bold" />}
                  </g>
                )}
              </g>
            );
          })}
          {t >= 25.6 && <text x={560} y={440} fontSize={14} fontWeight={700} fill={SC.error} opacity={p(t, 25.6, 26.2)}>3 of 5 people couldn’t find the due date.</text>}
          {t >= 18.6 && t < 28 && <MagnifyingGlassIcon x={mag.x + 40} y={mag.y - 12} width={64} height={64} color={SC.grow} weight="bold" />}
        </g>
      )}

      {/* ---- finale ---- */}
      {t >= 28.6 && [{ x: 270, Icon: FlashlightIcon, n: 'Explore', l: 'Generative: what to build', c: SC.discover }, { x: 690, Icon: MagnifyingGlassIcon, n: 'Check', l: 'Evaluative: does it work?', c: SC.grow }].map((f, i) => {
        const k = back((t - (28.8 + i * 0.3)) / 0.5);
        return (
          <g key={f.n} transform={`translate(${f.x} 270) scale(${clamp(k)})`}>
            <rect x={-170} y={-90} width={340} height={180} rx={20} fill={SC.surface} stroke={f.c} strokeWidth={3} />
            <f.Icon x={-24} y={-70} width={48} height={48} color={f.c} weight="duotone" />
            <text y={14} textAnchor="middle" fontSize={26} fontWeight={800} fill={f.c}>{f.n}</text>
            <text y={46} textAnchor="middle" fontSize={15} fontWeight={600} fill={SC.text}>{f.l}</text>
          </g>
        );
      })}

      {t >= 15.4 && t < 18.4 && <Pen x={520} y={230} scale={0.45} tilt={-20} mood="cheer" />}
      {t >= 25.8 && t < 28 && <Pen x={880} y={420} scale={0.45} mood="think" />}
    </svg>
  );
}
