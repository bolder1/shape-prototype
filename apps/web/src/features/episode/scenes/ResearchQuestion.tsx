'use client';
// Scene for rs.1-3: a stakeholder hunch ("add reminders!") is forged into a research question: find the assumption,
// make it open, check it on a meter, then pick a method and agree what would change the plan. Pure function of t (0–34).
import { CheckIcon, HammerIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, lerp, p, Pen, SC } from './shared';

const W = 960, H = 540;
const TILES = ['How do people', 'remember bills today,', 'and where does it break?'];
const CHECKS = ['Open, not yes/no', 'About real behaviour', 'No solution built in', 'Something we can learn'];

export function ResearchQuestionScene({ t }: { t: number }) {
  const hunchOut = p(t, 10.4, 11);
  const strike = p(t, 6.4, 7.2);
  const forgeOut = p(t, 29.6, 30.2);
  const meter = clamp((t - 18.6) / 4.4);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: turning a hunch into a research question">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />

      {/* ---- the hunch, and the assumption under it ---- */}
      {hunchOut < 1 && (
        <g opacity={1 - hunchOut}>
          <g transform="translate(200 210)"><circle cy={-14} r={18} fill="#E8C9AE" /><rect x={-22} y={6} width={44} height={52} rx={16} fill={SC.brand} /></g>
          <g transform={`translate(520 130) scale(${back((t - 0.4) / 0.5)})`}>
            <rect x={-260} y={-34} width={520} height={68} rx={18} fill={SC.surface} stroke={SC.text} strokeOpacity={0.25} strokeWidth={2} />
            <text x={-236} y={8} fontSize={19} fontWeight={700} fill={SC.text}>“People forget bills.</text>
            <text x={-20} y={8} fontSize={19} fontWeight={800} fill={SC.build}>Let’s add reminders!”</text>
            {strike > 0 && <line x1={-24} x2={lerp(-24, 210, strike)} y1={2} y2={2} stroke={SC.error} strokeWidth={4} strokeLinecap="round" />}
          </g>
          {t >= 7.4 && (
            <g transform={`translate(520 280) scale(${back((t - 7.4) / 0.5)})`}>
              <rect x={-220} y={-38} width={440} height={76} rx={16} fill={SC.surface} stroke={SC.design} strokeWidth={3} strokeDasharray="8 6" />
              <text x={-200} y={-10} fontSize={12} fontWeight={800} letterSpacing={1.4} fill={SC.design}>THE ASSUMPTION</text>
              <text x={-200} y={18} fontSize={18} fontWeight={700} fill={SC.text}>People forget to pay bills.</text>
            </g>
          )}
          {t >= 8.6 && <text x={520} y={360} textAnchor="middle" fontSize={14} fontWeight={700} fill={SC.muted} opacity={p(t, 8.6, 9)}>Is it true? For whom? When? That’s what research finds out.</text>}
        </g>
      )}

      {/* ---- the forge: tiles become a question ---- */}
      {t >= 11 && forgeOut < 1 && (
        <g opacity={clamp((t - 11) / 0.4) * (1 - forgeOut)}>
          <g transform="translate(110 80)"><HammerIcon x={0} y={0} width={30} height={30} color={SC.discover} weight="duotone" /><text x={40} y={22} fontSize={15} fontWeight={800} fill={SC.discover}>THE RESEARCH QUESTION</text></g>
          <rect x={100} y={130} width={760} height={70} rx={16} fill={SC.surface} stroke={SC.discover} strokeWidth={3} />
          {TILES.map((tile, i) => {
            const k = back((t - (11.8 + i * 1.6)) / 0.6);
            const x = [128, 318, 548][i];
            const fromY = 420 + (i % 2) * 40;
            return t >= 11.8 + i * 1.6 && (
              <g key={tile} transform={`translate(${x} ${lerp(fromY, 165, clamp(k))})`}>
                <rect y={-22} width={tile.length * 9.6 + 24} height={44} rx={10} fill={SC.discover} opacity={0.14} />
                <text x={12} y={7} fontSize={19} fontWeight={700} fill={SC.text}>{tile}</text>
              </g>
            );
          })}
          {/* sparks as each tile lands */}
          {TILES.map((_, i) => { const at = 12.4 + i * 1.6; return t >= at && t < at + 0.6 && Array.from({ length: 6 }, (_, j) => { const a = (j / 6) * Math.PI * 2, k = (t - at) / 0.6; return <circle key={`${i}${j}`} cx={[180, 380, 640][i] + Math.cos(a) * 40 * k} cy={165 + Math.sin(a) * 30 * k} r={3} fill="#FDE68A" opacity={1 - k} />; }); })}

          {/* the question meter */}
          {t >= 18.2 && (
            <g transform="translate(110 250)" opacity={p(t, 18.2, 18.7)}>
              <text fontSize={14} fontWeight={800} fill={SC.muted}>Does it pass?</text>
              {CHECKS.map((c, i) => {
                const at = 18.8 + i * 1.1, ok = t >= at;
                return (
                  <g key={c} transform={`translate(0 ${26 + i * 44})`}>
                    <rect width={300} height={36} rx={10} fill={SC.surface} stroke={ok ? SC.mint : SC.line} strokeWidth={2} />
                    <text x={14} y={23} fontSize={14} fontWeight={600} fill={SC.text}>{c}</text>
                    {ok && <g transform={`translate(278 18) scale(${back((t - at) / 0.35)})`}><circle r={11} fill={SC.mint} /><CheckIcon x={-7} y={-7} width={14} height={14} color="#fff" weight="bold" /></g>}
                  </g>
                );
              })}
              {/* the gauge */}
              <g transform="translate(470 120)" opacity={1 - p(t, 23.6, 24.2)}>
                <path d="M -90 0 A 90 90 0 0 1 90 0" fill="none" stroke={SC.line} strokeWidth={16} strokeLinecap="round" />
                <path d="M -90 0 A 90 90 0 0 1 90 0" fill="none" stroke={meter >= 1 ? SC.mint : SC.design} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - meter} />
                <line x1={0} y1={0} x2={Math.cos(Math.PI - meter * Math.PI) * 70} y2={-Math.sin(Math.PI - meter * Math.PI) * 70} stroke={SC.text} strokeWidth={4} strokeLinecap="round" />
                <circle r={8} fill={SC.text} />
                <text y={36} textAnchor="middle" fontSize={15} fontWeight={800} fill={meter >= 1 ? SC.mint : SC.muted}>{meter >= 1 ? 'Ready to research' : 'Checking…'}</text>
              </g>
            </g>
          )}

          {/* method and the bar */}
          {t >= 24.2 && (
            <g opacity={p(t, 24.2, 24.8)}>
              {[{ x: 640, y: 300, tag: 'METHOD', text: '8 interviews + a week of bill diaries', c: SC.grow }, { x: 640, y: 400, tag: 'CHANGES THE PLAN IF', text: 'People don’t forget; they lack money or time', c: SC.build }].map((b, i) => (
                <g key={b.tag} transform={`translate(${b.x} ${b.y}) scale(${back((t - (24.2 + i * 1.4)) / 0.5)})`}>
                  <rect x={-200} y={-38} width={400} height={76} rx={14} fill={SC.surface} stroke={b.c} strokeWidth={2.5} />
                  <text x={-184} y={-12} fontSize={11.5} fontWeight={800} letterSpacing={1.3} fill={b.c}>{b.tag}</text>
                  <text x={-184} y={16} fontSize={14.5} fontWeight={700} fill={SC.text}>{b.text}</text>
                </g>
              ))}
            </g>
          )}
        </g>
      )}

      {/* ---- finale ---- */}
      {t >= 30 && (
        <g transform={`translate(${W / 2} 260) scale(${back((t - 30) / 0.6)})`}>
          <rect x={-330} y={-90} width={660} height={180} rx={22} fill={SC.surface} stroke={SC.discover} strokeWidth={3} />
          <text y={-34} textAnchor="middle" fontSize={14} fontWeight={800} letterSpacing={1.5} fill={SC.discover}>FROM HUNCH TO QUESTION</text>
          <text y={8} textAnchor="middle" fontSize={22} fontWeight={800} fill={SC.text}>How do people remember bills today,</text>
          <text y={40} textAnchor="middle" fontSize={22} fontWeight={800} fill={SC.text}>and where does it break?</text>
        </g>
      )}

      {t >= 6 && t < 10.4 && <Pen x={lerp(760, 620, p(t, 6, 6.4))} y={125} scale={0.45} tilt={-30} mood="think" />}
      {t >= 23 && t < 29.6 && <Pen x={880} y={200} scale={0.45} mood="cheer" />}
    </svg>
  );
}
