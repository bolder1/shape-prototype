'use client';
// Scene for cw.1-2: "Delete 3 photos?" with OK / Cancel; a hurried tap deletes them. The buttons are rewritten as
// "Delete 3 photos" / "Keep photos". Then checkout's "Submit" becomes "Pay ₹450". Pure function of t (0–34).
import { CheckCircleIcon, ImageIcon, TrashIcon } from '@phosphor-icons/react/ssr';
import { at, back, clamp, Grid, p, SC } from './shared';

const W = 960, H = 540;
const DX = 300, DY = 130, DW = 360, DH = 240;

function Btn({ x, y, w, label, fill, text = '#fff', stroke }: { x: number; y: number; w: number; label: string; fill: string; text?: string; stroke?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={46} rx={12} fill={fill} stroke={stroke ?? 'none'} strokeWidth={2} />
      <text x={x + w / 2} y={y + 29} textAnchor="middle" fontSize={16} fontWeight={800} fill={text}>{label}</text>
    </g>
  );
}

export function ButtonLabelsScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const dialog = t < 18, checkout = t >= 18;
  const rewritten = t >= 12;
  const paid = t >= 24;
  const tap = t >= 7 && t < 8.2;
  const gone = p(t, 8, 9.5);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: vague button labels versus specific ones">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {dialog && (
          <g opacity={1 - p(t, 17.4, 18)}>
            {/* the photos */}
            {[0, 1, 2].map(i => {
              const [x, y] = at([360 + i * 90, 60], [760, 450], gone);
              return (
                <g key={i} opacity={rewritten ? 1 : 1 - gone * 0.9} transform={`translate(${rewritten ? 360 + i * 90 : x} ${rewritten ? 60 : y}) scale(${rewritten ? 1 : 1 - gone * 0.6})`}>
                  <rect width={72} height={56} rx={8} fill={SC.grow} opacity={0.35} />
                  <ImageIcon x={22} y={14} width={28} height={28} color={SC.grow} weight="duotone" />
                </g>
              );
            })}
            {t >= 8.5 && !rewritten && <TrashIcon x={740} y={420} width={48} height={48} color={SC.error} weight="duotone" />}
            <rect x={DX} y={DY} width={DW} height={DH} rx={22} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            <text x={DX + DW / 2} y={DY + 70} textAnchor="middle" fontSize={24} fontWeight={800} fill={SC.text}>Delete 3 photos?</text>
            <text x={DX + DW / 2} y={DY + 102} textAnchor="middle" fontSize={14} fontWeight={600} fill={SC.muted}>This can’t be undone.</text>
            {!rewritten ? (
              <>
                <Btn x={DX + 30} y={DY + 150} w={140} label="Cancel" fill={SC.soft} text={SC.text} stroke={SC.line} />
                <Btn x={DX + 190} y={DY + 150} w={140} label="OK" fill={SC.discover} />
              </>
            ) : (
              <g opacity={clamp((t - 12) / 0.5)}>
                <Btn x={DX + 20} y={DY + 150} w={150} label="Keep photos" fill={SC.soft} text={SC.text} stroke={SC.line} />
                <Btn x={DX + 180} y={DY + 150} w={160} label="Delete 3 photos" fill={SC.error} />
              </g>
            )}
            {tap && <circle cx={DX + 260} cy={DY + 173} r={16 + (t - 7) * 10} fill={SC.design} opacity={0.5 * (1 - (t - 7) / 1.2)} />}
            {t >= 9 && t < 12 && <text x={DX + DW / 2} y={DY + DH + 50} textAnchor="middle" fontSize={18} fontWeight={800} fill={SC.error} opacity={clamp((t - 9) / 0.4)}>Gone. She meant to keep them.</text>}
            {t >= 13 && t < 18 && <text x={DX + DW / 2} y={DY + DH + 50} textAnchor="middle" fontSize={17} fontWeight={800} fill={SC.mint} opacity={clamp((t - 13) / 0.4)}>Each button says what it does</text>}
          </g>
        )}

        {checkout && (
          <g opacity={clamp((t - 18) / 0.5)}>
            <rect x={DX} y={DY - 20} width={DW} height={DH + 40} rx={22} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            <text x={DX + 30} y={DY + 30} fontSize={20} fontWeight={800} fill={SC.text}>Your order</text>
            {[['Veg thali × 2', '₹380'], ['Delivery', '₹40'], ['Taxes', '₹30']].map(([l, a], i) => (
              <g key={l}>
                <text x={DX + 30} y={DY + 72 + i * 30} fontSize={15} fontWeight={600} fill={SC.muted}>{l}</text>
                <text x={DX + DW - 30} y={DY + 72 + i * 30} textAnchor="end" fontSize={15} fontWeight={700} fill={SC.text}>{a}</text>
              </g>
            ))}
            <text x={DX + 30} y={DY + 172} fontSize={17} fontWeight={900} fill={SC.text}>Total</text>
            <text x={DX + DW - 30} y={DY + 172} textAnchor="end" fontSize={17} fontWeight={900} fill={SC.text}>₹450</text>
            <g transform={`translate(${DX + DW / 2} ${DY + 213}) scale(${paid ? back((t - 24) / 0.5) : 1}) translate(${-(DX + DW / 2)} ${-(DY + 213)})`}>
              <Btn x={DX + 30} y={DY + 190} w={DW - 60} label={paid ? 'Pay ₹450' : 'Submit'} fill={paid ? SC.mint : SC.discover} />
            </g>
            {!paid && t >= 19.5 && ['Submit what?', 'For how much?'].map((q, i) => (
              <g key={q} transform={`translate(${720 + i * 10} ${170 + i * 70}) scale(${clamp(back((t - 19.8 - i * 0.6) / 0.4))})`}>
                <rect x={-10} y={-24} width={q.length * 9 + 20} height={36} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text fontSize={15} fontWeight={700} fontStyle="italic" fill={SC.muted}>{q}</text>
              </g>
            ))}
            {paid && <CheckCircleIcon x={DX + DW + 24} y={DY + 190} width={44} height={44} color={SC.mint} weight="fill" opacity={clamp((t - 24.6) / 0.4)} />}
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Verb + object', l: '“Send invite”', c: SC.mint }, { x: 480, n: 'Stands alone', l: 'Read only the buttons', c: SC.discover }, { x: 760, n: 'No OK, Submit', l: 'Name the result', c: SC.design }].map((f, i) => {
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
