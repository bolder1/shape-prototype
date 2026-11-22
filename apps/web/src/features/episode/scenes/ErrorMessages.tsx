'use client';
// Scene for cw.1-3: "Error 4012: invalid input" in a banner leaves Arjun stuck. The message gains what went wrong, then
// how to fix it, then moves under the field. He adds the @ and gets through. Pure function of t (0–34).
import { CheckCircleIcon, QuestionIcon, WarningCircleIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, lerp, p, Pen, SC } from './shared';

const W = 960, H = 540;
const FX = 260, FY = 70, FW = 440, FH = 400;

export function ErrorMessagesScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const what = p(t, 12, 13), how = p(t, 17, 18), move = p(t, 22, 23.5), fixed = t >= 28;
  const msgY = lerp(FY + 70, FY + 232, move);
  const stuck = t >= 6 && t < 12;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a vague error message rewritten to help">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        <rect x={FX} y={FY} width={FW} height={FH} rx={22} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
        <text x={FX + 30} y={FY + 44} fontSize={20} fontWeight={800} fill={SC.text}>Add UPI ID</text>
        {/* the field */}
        <text x={FX + 30} y={FY + 168} fontSize={14} fontWeight={700} fill={SC.muted}>UPI ID</text>
        <rect x={FX + 30} y={FY + 180} width={FW - 60} height={48} rx={12} fill={SC.soft} stroke={fixed ? SC.mint : move > 0.5 ? SC.error : SC.line} strokeWidth={2} />
        <text x={FX + 46} y={FY + 210} fontSize={17} fontWeight={600} fill={SC.text}>{fixed ? 'arjun' : 'arjun.okbank'}{fixed && <tspan fill={SC.mint} fontWeight={900}>@</tspan>}{fixed ? 'okbank' : ''}</text>
        {stuck && <rect x={FX + 46 + ((t * 40) % 120)} y={FY + 192} width={2} height={24} fill={SC.text} opacity={Math.sin(t * 12) > 0 ? 1 : 0} />}

        {/* the message: a banner at the top, then under the field */}
        {!fixed && (
          <g transform={`translate(0 ${msgY - (FY + 70)})`}>
            <rect x={FX + 30} y={FY + 70} width={FW - 60} height={how > 0 ? 64 : 44} rx={10} fill={SC.error} opacity={0.12 + 0.05 * (1 - move)} stroke={SC.error} strokeWidth={move > 0.5 ? 0 : 1.5} />
            <WarningCircleIcon x={FX + 42} y={FY + 80} width={24} height={24} color={SC.error} weight="fill" />
            <text x={FX + 74} y={FY + 98} fontSize={15} fontWeight={800} fill={SC.error} opacity={1 - what}>Error 4012: invalid input</text>
            <text x={FX + 74} y={FY + 98} fontSize={15} fontWeight={800} fill={SC.error} opacity={what}>That UPI ID is missing an @</text>
            <text x={FX + 74} y={FY + 122} fontSize={14} fontWeight={600} fill={SC.text} opacity={how}>UPI IDs look like name@bank</text>
          </g>
        )}
        {fixed && (
          <g opacity={clamp((t - 28) / 0.4)}>
            <CheckCircleIcon x={FX + FW - 76} y={FY + 192} width={26} height={26} color={SC.mint} weight="fill" />
            <text x={FX + 30} y={FY + 262} fontSize={15} fontWeight={800} fill={SC.mint}>UPI ID added</text>
          </g>
        )}
        <rect x={FX + 30} y={FY + FH - 76} width={FW - 60} height={48} rx={12} fill={SC.discover} />
        <text x={FX + FW / 2} y={FY + FH - 46} textAnchor="middle" fontSize={16} fontWeight={800} fill="#fff">Add UPI ID</text>

        {/* side notes */}
        {stuck && [0, 1].map(i => <QuestionIcon key={i} x={760 + i * 50} y={200 + i * 60} width={44} height={44} color={SC.error} weight="bold" opacity={clamp((t - 6.5 - i * 0.6) / 0.3)} />)}
        {stuck && t >= 8 && <text x={790} y={340} textAnchor="middle" fontSize={14} fontWeight={800} fill={SC.error} opacity={clamp((t - 8) / 0.4)}>Which field? What’s wrong?</text>}
        {[{ at: 12.4, y: 150, l: '1. What went wrong', c: SC.error }, { at: 17.4, y: 200, l: '2. How to fix it', c: SC.discover }, { at: 22.4, y: 250, l: '3. Right where it happened', c: SC.design }].map(n => t >= n.at && t < 28 && (
          <g key={n.l} transform={`translate(716 ${n.y}) scale(${clamp(back((t - n.at) / 0.4))})`}>
            <text fontSize={15} fontWeight={800} fill={n.c}>{n.l}</text>
          </g>
        ))}
        {fixed && <Pen x={810} y={330} scale={0.45} mood="cheer" />}
      </g>

      {fin > 0 && [{ x: 200, n: 'What', l: 'Say what went wrong', c: SC.error }, { x: 480, n: 'How', l: 'Show the way out', c: SC.discover }, { x: 760, n: 'Where', l: 'Next to the problem, no blame', c: SC.mint }].map((f, i) => {
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
