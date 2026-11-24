'use client';
// Scene for pr.3-1: Meera taps Pay ₹240 for Raju's milk in Gullak, nothing changes for two seconds, she taps again and
// pays twice. Then the button comes apart into Saffer's four parts, lit one by one on a strip: the trigger (her tap, or
// the system), the rules (the button locks, so a second tap bounces off), the feedback (press, spinner with words, tick),
// the loops over a long wait (the words change at 5 s and the payment goes pending at 30 s, from `payStage`) and over
// weeks (a "Pay Raju again" shortcut by day 20). `PayButton`, `Piggy` and `MicroDemo` are shared with the Build the
// micro-interaction game and the Delight scene. Pure function of t (0–36).
import { MICRO_PARTS, PAY_STAGES, payStage, type GullakMicro, type MicroPart, type PayStage } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';
import { INK, INK_MUTED } from './EaseCurves';

const W = 960, H = 540;
/** Gullak's brand purple. White on it is 8.8:1. */
export const GULLAK = '#5B2EA6';
export const GULLAK_DARK = '#46218A';
export const GULLAK_SOFT = '#EFE7FB';
/** Success green. White on it is 5.6:1. */
export const PAID = '#067647';
export const COIN = '#F5B301';
export const COIN_EDGE = '#A86F00';
export const PIG = '#F4A7B9';
export const PIG_DARK = '#D9718F';
export const PART_NAME: Record<MicroPart, string> = { trigger: 'Trigger', rules: 'Rules', feedback: 'Feedback', loops: 'Loops & modes' };
export const MICRO_NAME: Record<GullakMicro, string> = { pay: 'Paying Raju', roundup: 'Rounding up into the Goa jar', refresh: 'Pulling to refresh the passbook' };

/** Gullak's piggy, centred on (x, y). */
export function Piggy({ x, y, r = 18, rot = 0, wink = false }: { x: number; y: number; r?: number; rot?: number; wink?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M${-r * 0.55} ${-r * 0.8} L${-r * 0.35} ${-r * 1.2} L${-r * 0.1} ${-r * 0.9} Z`} fill={PIG_DARK} />
      <path d={`M${r * 0.15} ${-r * 0.9} L${r * 0.4} ${-r * 1.2} L${r * 0.6} ${-r * 0.8} Z`} fill={PIG_DARK} />
      <circle r={r} fill={PIG} />
      <ellipse cx={r * 0.45} cy={r * 0.2} rx={r * 0.32} ry={r * 0.24} fill={PIG_DARK} />
      <circle cx={r * 0.36} cy={r * 0.2} r={r * 0.06} fill={INK} /><circle cx={r * 0.54} cy={r * 0.2} r={r * 0.06} fill={INK} />
      {wink
        ? <path d={`M${-r * 0.3} ${-r * 0.25} q${r * 0.12} ${r * 0.12} ${r * 0.24} 0`} fill="none" stroke={INK} strokeWidth={Math.max(1.2, r * 0.08)} strokeLinecap="round" />
        : <circle cx={-r * 0.18} cy={-r * 0.25} r={r * 0.09} fill={INK} />}
      <circle cx={r * 0.15} cy={-r * 0.25} r={r * 0.09} fill={INK} />
      <rect x={-r * 0.25} y={-r * 0.98} width={r * 0.5} height={r * 0.1} rx={r * 0.05} fill={PIG_DARK} />
    </g>
  );
}

/** A coin with an optional label (dark ink on gold). */
export function Coin({ x, y, r = 8, label }: { x: number; y: number; r?: number; label?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill={COIN} stroke={COIN_EDGE} strokeWidth={1.5} />
      {label && <text y={r * 0.35} textAnchor="middle" fontSize={r * 0.9} fontWeight={900} fill={INK}>{label}</text>}
    </g>
  );
}

/** A spinner arc at angle `a` degrees. */
function Spinner({ x, y, r = 7, a, color = '#FFFFFF' }: { x: number; y: number; r?: number; a: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a})`}>
      <circle r={r} fill="none" stroke={color} strokeOpacity={0.3} strokeWidth={2.5} />
      <path d={`M0 ${-r} A${r} ${r} 0 0 1 ${r} 0`} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  );
}

export type ButtonState = 'idle' | PayStage | 'done';
const BUTTON_LABEL: Record<ButtonState, string> = {
  idle: 'Pay ₹240 to Raju', press: 'Pay ₹240 to Raju', working: 'Waiting for your bank…', slow: 'Still waiting. Don’t pay again',
  pending: 'Pending. We’ll tell you', done: '₹240 paid to Raju',
};

/** Gullak's Pay button, `w` wide and 40 tall, in a given state. `spin` turns the spinner (degrees). */
export function PayButton({ x, y, w, state, spin = 0 }: { x: number; y: number; w: number; state: ButtonState; spin?: number }) {
  const fill = state === 'done' ? PAID : state === 'press' ? GULLAK_DARK : GULLAK;
  const s = state === 'press' ? 0.97 : 1;
  const busy = state === 'working' || state === 'slow';
  return (
    <g transform={`translate(${x + w / 2} ${y + 20}) scale(${s}) translate(${-w / 2} -20)`}>
      <rect width={w} height={40} rx={12} fill={fill} />
      {busy && <Spinner x={20} y={20} a={spin} />}
      {state === 'pending' && <g transform="translate(20 20)"><circle r={7} fill="none" stroke="#FFFFFF" strokeWidth={2} /><path d="M0 -4 V0 H3" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" /></g>}
      {state === 'done' && <path d="M13 20 L18 25 L27 15" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />}
      <text x={busy || state === 'pending' || state === 'done' ? w / 2 + 10 : w / 2} y={25} textAnchor="middle" fontSize={state === 'slow' ? 11 : 12.5} fontWeight={800} fill="#FFFFFF">{BUTTON_LABEL[state]}</text>
    </g>
  );
}

/** A tap ripple at (x, y), `k` 0 → 1 through it. */
function Tap({ x, y, k }: { x: number; y: number; k: number }) {
  if (k <= 0 || k >= 1) return null;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={lerp(6, 26, k)} fill="none" stroke={INK} strokeOpacity={0.5 * (1 - k)} strokeWidth={2} />
      <circle r={9} fill={INK} opacity={0.25 * (1 - k)} />
    </g>
  );
}

/** One of Gullak's micro-interactions in a 200 × 150 frame, `k` (0 → 1) through it. */
export function MicroDemo({ micro, k, x = 0, y = 0 }: { micro: GullakMicro; k: number; x?: number; y?: number }) {
  const id = `md-${micro}`;
  return (
    <g transform={`translate(${x} ${y})`}>
      <clipPath id={id}><rect width={200} height={150} rx={16} /></clipPath>
      <rect width={200} height={150} rx={16} fill="#FFFFFF" stroke="#D0D5DD" strokeWidth={1.5} />
      <g clipPath={`url(#${id})`}>
        {micro === 'pay' && (() => {
          const state: ButtonState = k < 0.06 ? 'idle' : k < 0.12 ? 'press' : k < 0.36 ? 'working' : k < 0.55 ? 'slow' : 'done';
          return (
            <g>
              <circle cx={30} cy={34} r={14} fill={GULLAK_SOFT} />
              <text x={30} y={39} textAnchor="middle" fontSize={13} fontWeight={900} fill={GULLAK}>R</text>
              <text x={52} y={31} fontSize={12} fontWeight={900} fill={INK}>Raju · milk</text>
              <text x={52} y={46} fontSize={10.5} fontWeight={700} fill={INK_MUTED}>Every morning · ₹240</text>
              <PayButton x={14} y={70} w={172} state={state} spin={k * 2400} />
              <Tap x={100} y={90} k={(k - 0.03) / 0.12} />
              {state === 'slow' && <text x={100} y={130} textAnchor="middle" fontSize={10} fontWeight={800} fill={INK_MUTED}>5 seconds…</text>}
              {state === 'done' && <text x={100} y={130} textAnchor="middle" fontSize={10.5} fontWeight={800} fill={PAID} opacity={clamp((k - 0.58) / 0.1)}>Buzz · 7:42 am · Receipt</text>}
            </g>
          );
        })()}
        {micro === 'roundup' && (() => {
          const cleared = k > 0.12, f = clamp((k - 0.2) / 0.3), landed = k >= 0.5;
          const cx = lerp(60, 160, f), cy = lerp(40, 98, f) - Math.sin(f * Math.PI) * 34;
          return (
            <g>
              <rect x={12} y={20} width={176} height={40} rx={10} fill="#F9FAFB" stroke="#EAECF0" />
              <text x={24} y={38} fontSize={11.5} fontWeight={900} fill={INK}>Sharma Kirana</text>
              <text x={24} y={52} fontSize={10} fontWeight={700} fill={INK_MUTED}>{cleared ? 'Paid · cleared' : 'Clearing…'}</text>
              <text x={176} y={45} textAnchor="end" fontSize={12} fontWeight={900} fill={INK}>₹234</text>
              <g transform="translate(160 112)">
                <path d="M-22 -16 H22 L18 22 H-18 Z" fill={GULLAK_SOFT} stroke={GULLAK} strokeWidth={2} />
                <rect x={-17} y={lerp(4, -2, landed ? 1 : 0)} width={34} height={lerp(16, 22, landed ? 1 : 0)} fill={COIN} opacity={0.6} />
                <text y={-22} textAnchor="middle" fontSize={9.5} fontWeight={900} fill={GULLAK}>Goa jar</text>
              </g>
              <text x={20} y={110} fontSize={10.5} fontWeight={800} fill={INK_MUTED}>Saved for Goa</text>
              <text x={20} y={130} fontSize={16} fontWeight={900} fill={INK}>₹{landed ? '1,210' : '1,204'}</text>
              {cleared && !landed && <Coin x={cx} y={cy} r={10} label="₹6" />}
              {landed && k < 0.7 && <text x={104} y={130} fontSize={11} fontWeight={900} fill={PAID} opacity={1 - clamp((k - 0.6) / 0.1)}>+₹6</text>}
            </g>
          );
        })()}
        {micro === 'refresh' && (() => {
          const pull = k < 0.3 ? clamp(k / 0.3) : k < 0.4 ? 1 : 1 - clamp((k - 0.7) / 0.1);
          const dy = pull * 36, loading = k >= 0.35 && k < 0.7, fresh = k >= 0.7;
          const slide = clamp((k - 0.7) / 0.1);
          return (
            <g>
              <Piggy x={100} y={lerp(-10, 20, pull)} r={11} rot={loading ? (k - 0.35) * 2000 : pull * 300} />
              <g transform={`translate(0 ${dy})`}>
                <text x={16} y={22} fontSize={11.5} fontWeight={900} fill={INK}>Passbook</text>
                {fresh && (
                  <g opacity={slide} transform={`translate(0 ${lerp(-10, 0, slide)})`}>
                    <rect x={12} y={30} width={176} height={26} rx={7} fill={GULLAK_SOFT} />
                    <text x={22} y={47} fontSize={10.5} fontWeight={800} fill={INK}>Raju · milk</text>
                    <text x={178} y={47} textAnchor="end" fontSize={10.5} fontWeight={900} fill={INK}>−₹240</text>
                  </g>
                )}
                {['Sharma Kirana · −₹234', 'Salary · +₹18,000', 'Jio recharge · −₹299'].map((row, i) => (
                  <g key={row} transform={`translate(0 ${(fresh ? 30 * slide : 0) + 30 + i * 30})`}>
                    <rect x={12} width={176} height={26} rx={7} fill="#F2F4F7" />
                    <text x={22} y={17} fontSize={10.5} fontWeight={700} fill={INK}>{row}</text>
                  </g>
                ))}
              </g>
              {k < 0.3 && <text x={186} y={140} textAnchor="end" fontSize={10} fontWeight={800} fill={INK_MUTED}>pull {Math.round(pull * 64)} px</text>}
            </g>
          );
        })()}
      </g>
    </g>
  );
}

/** The four-part strip, with `lit` parts filled and `on` highlighted. */
function Strip({ x, y, lit, on }: { x: number; y: number; lit: number; on?: MicroPart }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {MICRO_PARTS.map((part, i) => {
        const filled = i < lit, active = part === on;
        return (
          <g key={part} transform={`translate(${i * 128} 0)`}>
            <rect width={116} height={46} rx={12} fill={filled ? (active ? GULLAK : SC.surface) : SC.soft} stroke={active ? GULLAK : SC.line} strokeWidth={active ? 2.5 : 1.5} strokeDasharray={filled ? undefined : '5 5'} />
            <text x={58} y={29} textAnchor="middle" fontSize={13.5} fontWeight={900} fill={active ? '#FFFFFF' : filled ? SC.text : SC.muted}>{PART_NAME[part]}</text>
            {i < 3 && <path d="M120 23 h6" stroke={SC.muted} strokeWidth={2} />}
          </g>
        );
      })}
    </g>
  );
}

/** The phone, 250 × 440, with Raju's card, the Pay button, and passbook entries. */
function PayPhone({ state, spin, taps, debits, again, blocked }: { state: ButtonState; spin: number; taps: number[]; debits: number; again: number; blocked?: number }) {
  return (
    <g>
      <rect width={250} height={440} rx={34} fill="#FFFFFF" stroke="#1D2939" strokeWidth={6} />
      <text x={24} y={50} fontSize={18} fontWeight={900} fill={GULLAK}>Gullak</text>
      <Piggy x={214} y={44} r={11} />
      {again > 0 && (
        <g opacity={again} transform={`translate(0 ${lerp(-10, 0, again)})`}>
          <rect x={18} y={68} width={214} height={40} rx={12} fill={GULLAK_SOFT} stroke={GULLAK} strokeWidth={1.5} />
          <text x={32} y={93} fontSize={12} fontWeight={900} fill={GULLAK}>Pay Raju ₹240 again</text>
          <text x={218} y={93} textAnchor="end" fontSize={14} fontWeight={900} fill={GULLAK}>›</text>
        </g>
      )}
      <g transform="translate(18 126)">
        <rect width={214} height={140} rx={16} fill="#F9FAFB" stroke="#EAECF0" strokeWidth={1.5} />
        <circle cx={34} cy={36} r={18} fill={GULLAK_SOFT} />
        <text x={34} y={42} textAnchor="middle" fontSize={16} fontWeight={900} fill={GULLAK}>R</text>
        <text x={62} y={32} fontSize={14} fontWeight={900} fill={INK}>Raju · milk</text>
        <text x={62} y={50} fontSize={11.5} fontWeight={700} fill={INK_MUTED}>Every morning · ₹240</text>
        <PayButton x={14} y={82} w={186} state={state} spin={spin} />
        {taps.map((k, i) => <Tap key={i} x={107} y={102} k={k} />)}
        {blocked !== undefined && blocked > 0 && blocked < 1 && (
          <text x={107} y={76} textAnchor="middle" fontSize={11} fontWeight={900} fill={SC.error} opacity={1 - blocked}>Second tap ignored</text>
        )}
      </g>
      <text x={24} y={300} fontSize={12} fontWeight={900} fill={INK_MUTED}>Passbook</text>
      {Array.from({ length: debits }, (_, i) => (
        <g key={i} transform={`translate(18 ${312 + i * 34})`}>
          <rect width={214} height={28} rx={8} fill={debits > 1 ? '#FEF3F2' : '#F2F4F7'} />
          <text x={12} y={19} fontSize={11.5} fontWeight={800} fill={INK}>Raju · milk</text>
          <text x={202} y={19} textAnchor="end" fontSize={11.5} fontWeight={900} fill={debits > 1 ? '#B42318' : INK}>−₹240</text>
        </g>
      ))}
    </g>
  );
}

const SEGS = [
  { at: 0, part: undefined, lit: 0, title: 'Tapped twice, paid twice' },
  { at: 5, part: 'trigger', lit: 1, title: 'What starts it' },
  { at: 10, part: 'rules', lit: 2, title: 'What it may do' },
  { at: 16, part: 'feedback', lit: 3, title: 'How she knows' },
  { at: 22, part: 'loops', lit: 4, title: 'The long wait' },
  { at: 28, part: 'loops', lit: 4, title: 'The twentieth morning' },
] as const;

const SIDE: Record<number, readonly string[]> = {
  5: ['Manual: Meera taps “Pay ₹240 to Raju”.', 'The label says what the tap will do,', 'amount and name included.', 'System triggers start on their own:', 'a payment clears, the balance', 'drops below ₹500.'],
  10: ['One tap pays once. The button locks', 'until the bank answers.', 'Over ₹1,000, ask for the UPI PIN.', 'Rules are invisible. The double', 'payment was a missing rule.'],
  16: ['Press: within 100 ms.', 'Working: a spinner and words.', 'Done: a tick, one buzz, and', '“₹240 paid to Raju”.', 'Words as well as motion.'],
};

export function MicroAnatomyScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const seg = [...SEGS].reverse().find(s => t >= s.at)!;
  const fin = p(t, 32, 32.6);
  const enter = p(t, seg.at, seg.at + 0.5);

  // The phone's state for each part of the story.
  let state: ButtonState = 'idle', taps: number[] = [], debits = 0, again = 0, blocked: number | undefined;
  const spin = t * 360;
  let elapsed = 0;
  if (t < 5) {
    taps = [(t - 1) / 0.6, (t - 3) / 0.6];
    debits = t >= 3.6 ? 2 : t >= 2.2 ? 1 : 0;
  } else if (t < 10) {
    const k = ((t - 5.5) % 1.6 + 1.6) % 1.6;
    taps = [k / 0.6];
    state = k > 0.05 && k < 0.25 ? 'press' : 'idle';
  } else if (t < 16) {
    taps = [(t - 10.6) / 0.6, (t - 12) / 0.6, (t - 13.2) / 0.6];
    state = t < 10.6 ? 'idle' : t < 10.8 ? 'press' : 'working';
    blocked = t >= 12 ? (t - 12) / 2.4 : undefined;
    debits = 0;
  } else if (t < 22) {
    const k = ((t - 16.3) % 4 + 4) % 4;
    taps = [k / 0.6];
    state = k < 0.1 ? 'idle' : k < 0.25 ? 'press' : k < 2 ? 'working' : 'done';
    debits = state === 'done' ? 1 : 0;
  } else if (t < 28) {
    elapsed = clamp((t - 22.4) / 5) * 36000;
    state = t < 22.4 ? 'idle' : payStage(elapsed);
  } else {
    state = 'done';
    debits = 1;
    again = p(t, 28.8, 29.4);
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Meera pays Raju twice because Gullak's Pay button gave no feedback; then the button is rebuilt as a trigger, rules that block a second tap, feedback with a spinner, words and a tick, and loops that change the words over a long wait and add a shortcut by the twentieth day">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro * (1 - fin)}>
        <g transform={`translate(70 ${lerp(60, 50, intro)})`}>
          <PayPhone state={state} spin={spin} taps={taps} debits={debits} again={again} blocked={blocked} />
        </g>
        <Strip x={380} y={60} lit={seg.lit} on={seg.part} />
        <text x={380} y={160} fontSize={28} fontWeight={900} fill={t < 5 ? SC.error : SC.text} opacity={enter}>{seg.title}</text>

        {t < 5 && (
          <g opacity={p(t, 1, 1.5)}>
            <text x={380} y={200} fontSize={15} fontWeight={800} fill={SC.muted}>
              <tspan x={380} dy={0}>No press, no spinner, no words for two seconds.</tspan>
              <tspan x={380} dy={24}>So Meera tapped again, and nothing stopped it.</tspan>
            </text>
            <text x={380} y={290} fontSize={40} fontWeight={900} fill={SC.error} opacity={p(t, 3.6, 4)}>−₹480</text>
          </g>
        )}
        {SIDE[seg.at] && (
          <text x={380} y={204} fontSize={16} fontWeight={800} fill={SC.muted} opacity={enter}>
            {SIDE[seg.at].map((line, i) => <tspan key={i} x={380} dy={i ? 26 : 0} opacity={p(t, seg.at + 0.4 + i * 0.35, seg.at + 0.8 + i * 0.35)}>{line}</tspan>)}
          </text>
        )}
        {seg.at === 22 && (
          <g transform="translate(380 200)" opacity={enter}>
            <text x={0} y={0} fontSize={16} fontWeight={800} fill={SC.muted}>The bank is slow today. The feedback keeps talking.</text>
            {PAY_STAGES.map((s, i) => {
              const x0 = [0, 40, 160, 360][i], x1 = [40, 160, 360, 500][i];
              const on = state === s.id;
              return (
                <g key={s.id}>
                  <rect x={x0} y={30} width={x1 - x0 - 4} height={34} rx={8} fill={on ? GULLAK : SC.surface} stroke={SC.line} />
                  <text x={(x0 + x1 - 4) / 2} y={52} textAnchor="middle" fontSize={11.5} fontWeight={900} fill={on ? '#FFFFFF' : SC.muted}>{['Press', 'Working', 'Still waiting', 'Pending'][i]}</text>
                </g>
              );
            })}
            {['0', '0.1 s', '5 s', '30 s'].map((l, i) => <text key={l} x={[0, 40, 160, 360][i]} y={84} fontSize={11} fontWeight={800} fill={SC.muted}>{l}</text>)}
            <line x1={lerp(0, 500, Math.min(1, elapsed / 36000))} x2={lerp(0, 500, Math.min(1, elapsed / 36000))} y1={24} y2={70} stroke={SC.text} strokeWidth={3} />
            <text x={0} y={140} fontSize={48} fontWeight={900} fill={SC.text}>{(elapsed / 1000).toFixed(1)} s</text>
            <text x={0} y={172} fontSize={14} fontWeight={800} fill={SC.muted} opacity={p(t, 26.5, 27)}>When it clears, a notification: “₹240 paid to Raju”.</text>
          </g>
        )}
        {seg.at === 28 && (
          <g transform="translate(380 200)" opacity={enter}>
            <text x={0} y={0} fontSize={16} fontWeight={800} fill={SC.muted}>A loop over weeks: the familiar gets shorter.</text>
            <text x={0} y={70} fontSize={56} fontWeight={900} fill={GULLAK}>Day {Math.round(lerp(1, 20, p(t, 28.3, 29.3)))}</text>
            <text x={0} y={110} fontSize={15} fontWeight={800} fill={SC.muted}>
              <tspan x={0} dy={0}>Four taps on day 1. One tap on day 20,</tspan>
              <tspan x={0} dy={24}>and an offer of autopay after that.</tspan>
            </text>
          </g>
        )}
      </g>

      {t >= 32 && (
        <g opacity={fin}>
          <text x={W / 2} y={70} textAnchor="middle" fontSize={26} fontWeight={900} fill={SC.text}>One button, four parts, written down</text>
          {MICRO_PARTS.map((part, i) => (
            <g key={part} transform={`translate(${90 + i * 200} 120)`} opacity={p(t, 32.3 + i * 0.3, 32.8 + i * 0.3)}>
              <rect width={180} height={250} rx={18} fill={SC.surface} stroke={i === 3 ? GULLAK : SC.line} strokeWidth={2} />
              <text x={20} y={40} fontSize={18} fontWeight={900} fill={SC.text}>{PART_NAME[part]}</text>
              <text x={20} y={76} fontSize={13} fontWeight={700} fill={SC.muted}>
                {[['Her tap, or', 'the system', 'noticing.'], ['One tap pays', 'once. PIN', 'over ₹1,000.'], ['Press, spinner', 'with words,', 'tick and buzz.'], ['New words at', '5 s, pending', 'at 30 s, a', 'shortcut by', 'day 20.']][i].map((l, j) => <tspan key={j} x={20} dy={j ? 20 : 0}>{l}</tspan>)}
              </text>
            </g>
          ))}
          <text x={W / 2} y={440} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 34, 34.5)}>Rohan builds from the strip, not from a mock-up of the happy path.</text>
        </g>
      )}
    </svg>
  );
}
