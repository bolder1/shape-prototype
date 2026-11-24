'use client';
// Scene for ui.4-1: Nisha's wireframe of Hisaab's "Record payment" screen has three identical grey buttons, so Ramesh ji
// taps Delete instead of Save. The buttons get a rank (one filled Save at the bottom, an outlined receipt button, Delete
// as red text up in the header), the amount box gets a label, ₹ prefix and hint, then an error under the box that keeps
// the 0, the customer card gets one job, and every part's states are drawn on one sheet. `KitCell` is shared with the
// Fill the state sheet game. Pure function of t (0–34).
import { KIT_PARTS, KIT_STATES, type KitPart, type KitState } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
export const CELL_W = 220, CELL_H = 74;
const RING = 'var(--color-family-discover)';

const Spinner = ({ x, y, r = 7, a = 0, color = '#fff' }: { x: number; y: number; r?: number; a?: number; color?: string }) => (
  <g transform={`rotate(${a} ${x} ${y})`}>
    <circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeOpacity={0.35} strokeWidth={2.5} />
    <path d={`M${x} ${y - r} A${r} ${r} 0 0 1 ${x + r} ${y}`} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
  </g>
);

/** One part of Hisaab's kit (button, amount input, customer card) in one state, in a CELL_W × CELL_H box. */
export function KitCell({ part, state = 'default', spin = 0 }: { part: KitPart; state?: KitState | 'default'; spin?: number }) {
  if (part === 'button') {
    const off = state === 'disabled';
    return (
      <g>
        {state === 'focus' && <rect x={6} y={8} width={208} height={52} rx={14} fill="none" stroke={RING} strokeWidth={2.5} />}
        <rect x={10} y={12} width={200} height={44} rx={10} fill={off ? SC.soft : SC.brand} stroke={off ? SC.line : 'none'} />
        {state === 'loading'
          ? <g><Spinner x={78} y={34} a={spin} /><text x={92} y={39} fontSize={14} fontWeight={800} fill="#fff">Saving…</text></g>
          : <text x={110} y={39} textAnchor="middle" fontSize={14} fontWeight={800} fill={off ? SC.muted : '#fff'}>Save payment</text>}
        {off && <text x={110} y={72} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={SC.muted}>Enter an amount to save</text>}
      </g>
    );
  }
  if (part === 'input') {
    const off = state === 'disabled', err = state === 'error', focus = state === 'focus';
    return (
      <g>
        <text x={10} y={10} fontSize={11} fontWeight={800} fill={SC.text}>{off ? 'Mobile number' : 'Amount (₹)'}</text>
        <rect x={10} y={16} width={200} height={38} rx={9} fill={off ? SC.soft : SC.surface} stroke={err ? SC.error : focus ? SC.brand : SC.line} strokeWidth={err || focus ? 2.5 : 1.5} />
        {off
          ? <text x={22} y={40} fontSize={13.5} fontWeight={700} fill={SC.muted}>+91 98290 41234</text>
          : <g><text x={22} y={40} fontSize={14} fontWeight={800} fill={SC.muted}>₹</text>
            <text x={38} y={40} fontSize={14} fontWeight={800} fill={SC.text}>{err ? '0' : '500'}</text>
            {focus && <line x1={66} x2={66} y1={26} y2={45} stroke={SC.brand} strokeWidth={2} />}</g>}
        {err && <g><circle cx={196} cy={35} r={7} fill={SC.error} /><text x={196} y={39} textAnchor="middle" fontSize={11} fontWeight={900} fill="#fff">!</text></g>}
        <text x={10} y={70} fontSize={10.5} fontWeight={700} fill={err ? SC.error : SC.muted}>{err ? 'Enter an amount above ₹0' : off ? 'Change it on the customer’s page' : 'Udhaar paid today'}</text>
      </g>
    );
  }
  const load = state === 'loading', err = state === 'error';
  return (
    <g>
      {state === 'focus' && <rect x={5} y={3} width={210} height={68} rx={17} fill="none" stroke={RING} strokeWidth={2.5} />}
      <rect x={10} y={8} width={200} height={58} rx={13} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
      {load
        ? <g><rect x={24} y={22} width={96} height={11} rx={5} fill={SC.soft} /><rect x={24} y={41} width={64} height={9} rx={4} fill={SC.soft} /><rect x={140} y={26} width={56} height={14} rx={6} fill={SC.soft} /></g>
        : <g>
          <text x={24} y={33} fontSize={14} fontWeight={900} fill={SC.text}>Sunita Sharma</text>
          {err
            ? <text x={24} y={53} fontSize={11} fontWeight={800} fill={SC.error}>Couldn’t load balance · <tspan textDecoration="underline">Retry</tspan></text>
            : <g><text x={24} y={52} fontSize={11} fontWeight={700} fill={SC.muted}>Last paid 3 Dec</text>
              <text x={196} y={39} textAnchor="end" fontSize={15} fontWeight={900} fill={SC.text} style={{ fontVariantNumeric: 'tabular-nums' }}>₹2,450</text></g>}
        </g>}
    </g>
  );
}

/** The state sheet: KIT_PARTS down, KIT_STATES across. `show(part, state)` says how visible a cell is (0 hides it). */
export function StateSheet({ show, scale = 0.5, spin = 0, gap = 14 }: { show: (part: KitPart, state: KitState) => number; scale?: number; spin?: number; gap?: number }) {
  const cw = CELL_W * scale + gap, ch = CELL_H * scale + gap;
  return (
    <g>
      {KIT_STATES.map((s, c) => <text key={s} x={84 + c * cw + (CELL_W * scale) / 2} y={0} textAnchor="middle" fontSize={12} fontWeight={800} fill={SC.muted}>{s[0].toUpperCase() + s.slice(1)}</text>)}
      {KIT_PARTS.map((part, r) => (
        <g key={part} transform={`translate(0 ${14 + r * ch})`}>
          <text x={0} y={(CELL_H * scale) / 2 + 4} fontSize={13} fontWeight={800} fill={SC.text}>{part[0].toUpperCase() + part.slice(1)}</text>
          {KIT_STATES.map((s, c) => {
            const o = show(part, s);
            return (
              <g key={s} transform={`translate(${84 + c * cw} 0)`}>
                <rect width={CELL_W * scale} height={CELL_H * scale} rx={8} fill="none" stroke={SC.line} strokeDasharray="4 4" />
                {o > 0 && <g opacity={o} transform={`scale(${scale})`}><KitCell part={part} state={s} spin={spin} /></g>}
              </g>
            );
          })}
        </g>
      ))}
    </g>
  );
}

/** The cells the sheet fills (a button has no error of its own; a card is never disabled). */
export const SHEET_CELLS: Record<KitPart, readonly KitState[]> = { button: ['focus', 'disabled', 'loading'], input: ['focus', 'disabled', 'error'], card: ['focus', 'loading', 'error'] };

const PX = 90, PY = 40, PW = 300;
type Box = [number, number, number, number];
const box = (a: Box, b: Box, k: number): Box => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k), lerp(a[3], b[3], k)];

export function ComponentKitScene({ t }: { t: number }) {
  const rank = p(t, 10, 12), field = p(t, 15, 16.4), card = p(t, 23, 24.4);
  const err = t >= 19.6 && t < 28 ? p(t, 19.6, 20) : 0;
  const deleted = t >= 6.4 && t < 10.4;
  const panel = (a: number, b: number) => p(t, a, a + 0.5) * (1 - p(t, b - 0.5, b));
  const tapK = (a: number) => clamp(1 - Math.abs(t - a) / 0.35);

  const save = box([PX + 20, PY + 384, 80, 44], [PX + 20, PY + 388, 260, 50], rank);
  const receipt = box([PX + 110, PY + 384, 80, 44], [PX + 20, PY + 330, 260, 44], rank);
  const del = box([PX + 200, PY + 384, 80, 44], [PX + 200, PY + 22, 84, 26], rank);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: three equal grey buttons get a rank, an amount box gets a label and a helpful error, a customer card gets one job, and every state is drawn on one sheet">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={clamp(back(t / 0.6)) * (deleted ? 0.35 : 1)}>
        <rect x={PX} y={PY} width={PW} height={460} rx={30} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
        <text x={PX + 20} y={PY + 44} fontSize={18} fontWeight={900} fill={SC.text}>Record payment</text>
        {/* the customer card: a grey box, then one job */}
        <g transform={`translate(${PX + 20} ${PY + 66})`}>
          <rect width={260} height={72} rx={14} fill={card ? SC.surface : SC.soft} stroke={SC.line} strokeWidth={1.5} />
          <g opacity={1 - card}><rect x={16} y={18} width={110} height={12} rx={4} fill={SC.line} /><rect x={16} y={40} width={70} height={10} rx={4} fill={SC.line} /><rect x={180} y={26} width={64} height={16} rx={4} fill={SC.line} /></g>
          <g opacity={card}>
            <circle cx={36} cy={36} r={18} fill={SC.soft} stroke={SC.line} />
            <text x={36} y={41} textAnchor="middle" fontSize={13} fontWeight={900} fill={SC.text}>SS</text>
            <text x={64} y={32} fontSize={15} fontWeight={900} fill={SC.text}>Sunita Sharma</text>
            <text x={64} y={51} fontSize={11.5} fontWeight={700} fill={SC.muted}>Last paid 3 Dec · ₹500</text>
            <text x={244} y={33} textAnchor="end" fontSize={11} fontWeight={700} fill={SC.muted}>Owes</text>
            <text x={244} y={52} textAnchor="end" fontSize={16} fontWeight={900} fill={SC.text} style={{ fontVariantNumeric: 'tabular-nums' }}>₹2,450</text>
            {t >= 25 && t < 28 && <rect x={-4} y={-4} width={268} height={80} rx={17} fill="none" stroke={RING} strokeWidth={2.5} opacity={0.5 + 0.5 * Math.sin((t - 25) * 5)} />}
          </g>
        </g>
        {/* the amount input: a grey box, then a labelled field, then an error */}
        <g transform={`translate(${PX + 20} ${PY + 168})`}>
          <g opacity={1 - field}><rect width={260} height={44} rx={8} fill={SC.soft} stroke={SC.line} /><text x={14} y={27} fontSize={12} fontWeight={700} fill={SC.muted}>Enter here</text></g>
          <g opacity={field}>
            <text x={0} y={0} fontSize={12.5} fontWeight={800} fill={SC.text}>Amount (₹)</text>
            <rect y={8} width={260} height={46} rx={10} fill={SC.surface} stroke={err ? SC.error : t >= 16.4 && t < 19.6 ? SC.brand : SC.line} strokeWidth={err || (t >= 16.4 && t < 19.6) ? 2.5 : 1.5} />
            <text x={14} y={37} fontSize={16} fontWeight={800} fill={SC.muted}>₹</text>
            <text x={32} y={37} fontSize={16} fontWeight={800} fill={SC.text}>{t < 17.4 ? '' : t < 19.6 ? '500'.slice(0, Math.ceil(clamp((t - 17.4) / 1.2) * 3)) : t < 28 ? '0' : '500'}</text>
            {err > 0 && <g opacity={err}><circle cx={240} cy={31} r={8} fill={SC.error} /><text x={240} y={35.5} textAnchor="middle" fontSize={12} fontWeight={900} fill="#fff">!</text></g>}
            <text y={74} fontSize={11.5} fontWeight={700} fill={err ? SC.error : SC.muted}>{err ? 'Enter an amount above ₹0' : 'Udhaar paid today'}</text>
          </g>
        </g>
        {/* the three buttons */}
        <g>
          <rect x={save[0]} y={save[1]} width={save[2]} height={save[3]} rx={10} fill={rank ? SC.brand : SC.soft} stroke={SC.line} strokeWidth={rank ? 0 : 1.5} />
          <text x={save[0] + save[2] / 2} y={save[1] + save[3] / 2 + 5} textAnchor="middle" fontSize={rank ? 15 : 12} fontWeight={800} fill={rank ? '#fff' : SC.muted}>{rank > 0.5 ? 'Save payment' : 'Save'}</text>
          <rect x={receipt[0]} y={receipt[1]} width={receipt[2]} height={receipt[3]} rx={10} fill={rank ? SC.surface : SC.soft} stroke={rank ? SC.brand : SC.line} strokeWidth={rank ? 2 : 1.5} />
          <text x={receipt[0] + receipt[2] / 2} y={receipt[1] + receipt[3] / 2 + 5} textAnchor="middle" fontSize={rank ? 14 : 12} fontWeight={800} fill={rank ? SC.text : SC.muted}>{rank > 0.5 ? 'Send receipt on WhatsApp' : 'Receipt'}</text>
          <rect x={del[0]} y={del[1]} width={del[2]} height={del[3]} rx={10} fill={SC.soft} stroke={SC.line} strokeWidth={1.5} opacity={1 - rank} />
          <text x={del[0] + del[2] / 2 + rank * 40} y={del[1] + del[3] / 2 + 5} textAnchor={rank > 0.5 ? 'end' : 'middle'} fontSize={12} fontWeight={800} fill={rank > 0.5 ? SC.error : SC.muted}>Delete</text>
        </g>
        {t >= 5.6 && t < 7.2 && <ellipse cx={PX + 240} cy={PY + 412} rx={20} ry={24} fill="#f5c9a8" stroke="#c2410c" strokeOpacity={0.4} strokeWidth={2} opacity={0.85 * tapK(6.3)} />}
        {t >= 19 && t < 20.2 && <ellipse cx={PX + 180} cy={PY + 418} rx={20} ry={24} fill="#f5c9a8" stroke="#c2410c" strokeOpacity={0.4} strokeWidth={2} opacity={0.85 * tapK(19.5)} />}
      </g>
      {deleted && (
        <g transform={`translate(${PX + 20} ${PY + 190})`} opacity={p(t, 6.4, 6.8) * (1 - p(t, 9.8, 10.4))}>
          <rect width={260} height={76} rx={14} fill={SC.text} />
          <text x={18} y={32} fontSize={14} fontWeight={800} fill={SC.surface}>Customer deleted</text>
          <text x={18} y={56} fontSize={12.5} fontWeight={700} fill={SC.surface} opacity={0.8}>Sunita Sharma · ₹2,450 udhaar gone</text>
        </g>
      )}

      {t >= 5 && t < 10.4 && (
        <g transform="translate(460 150)" opacity={panel(5, 10.4)}>
          <text fontSize={20} fontWeight={900} fill={SC.text}>Three buttons, one weight</text>
          <text y={32} fontSize={15} fontWeight={700} fill={SC.muted}>Nothing says which one matters,</text>
          <text y={56} fontSize={15} fontWeight={700} fill={SC.muted}>so the thumb goes where it always goes.</text>
        </g>
      )}
      {t >= 10.4 && t < 15 && (
        <g transform="translate(460 130)" opacity={panel(10.4, 15)}>
          <text fontSize={20} fontWeight={900} fill={SC.text}>Give them a rank</text>
          {[['Primary', 'filled, full width, one per screen'], ['Secondary', 'outlined, for the useful extra'], ['Destructive', 'red text, far from the thumb']].map(([a, b], k) => (
            <text key={a} y={40 + k * 32} fontSize={15} fontWeight={700} fill={SC.text} opacity={p(t, 11 + k * 0.6, 11.5 + k * 0.6)}><tspan fontWeight={900}>{a}: </tspan>{b}</text>
          ))}
        </g>
      )}
      {t >= 15 && t < 23 && (
        <g transform="translate(460 130)" opacity={panel(15, 23)}>
          <text fontSize={20} fontWeight={900} fill={SC.text}>{t < 19.4 ? 'A box that explains itself' : 'An error that helps'}</text>
          {(t < 19.4 ? ['Label above, always visible', '₹ in front, so it isn’t typed', 'A hint below, and the number pad'] : ['Under the box, not in a pop-up', 'Says how to fix it', 'Keeps the 0 he typed']).map((s, k) => (
            <text key={s} y={40 + k * 32} fontSize={15} fontWeight={700} fill={SC.text} opacity={p(t, (t < 19.4 ? 15.6 : 20) + k * 0.6, (t < 19.4 ? 16.1 : 20.5) + k * 0.6)}><tspan fill={SC.mint}>✓ </tspan>{s}</text>
          ))}
        </g>
      )}
      {t >= 23 && t < 28 && (
        <g transform="translate(460 130)" opacity={panel(23, 28)}>
          <text fontSize={20} fontWeight={900} fill={SC.text}>A card with one job</text>
          {['Her name first, biggest', 'What she owes, on the right', 'The last payment, in grey', 'The whole card opens her page'].map((s, k) => (
            <text key={s} y={40 + k * 32} fontSize={15} fontWeight={700} fill={SC.text} opacity={p(t, 23.6 + k * 0.6, 24.1 + k * 0.6)}><tspan fill={SC.mint}>✓ </tspan>{s}</text>
          ))}
        </g>
      )}
      {t >= 28 && (
        <g transform="translate(405 150)" opacity={p(t, 28, 28.6)}>
          <text y={-34} fontSize={20} fontWeight={900} fill={SC.text}>Draw every state before it’s built</text>
          <StateSheet scale={0.45} spin={t * 360} show={(part, s) => (SHEET_CELLS[part].includes(s) ? p(t, 28.4 + KIT_PARTS.indexOf(part) * 0.7 + KIT_STATES.indexOf(s) * 0.2, 28.9 + KIT_PARTS.indexOf(part) * 0.7 + KIT_STATES.indexOf(s) * 0.2) : 0)} />
        </g>
      )}
    </svg>
  );
}
