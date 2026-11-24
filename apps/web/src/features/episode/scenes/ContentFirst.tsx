'use client';
// Scene for cw.2-2: Dev draws Chaabi's move-out screen in lorem ipsum and everything fits. Then the real words arrive
// and spill out of every box (`wrapText` against `LOREM_SLOTS`, overflow in red). Ananya starts again from Tanvir's four
// questions (`FLOW_QUESTIONS`), writes the real answers, and the screen is rebuilt around them: the amount biggest, the
// deductions with their proof, the date, and buttons that grow with their words. `SlotBox`, `FlowScreen` and the
// question names are shared with the Build the move-out flow game. Pure function of t (0–36).
import { FLOW_QUESTIONS, LOREM_SLOTS, wrapText, type FlowQuestion, type LoremSlot } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';
import { INK } from './EaseCurves';
import { CHAABI, CHAABI_SOFT } from './VoiceTone';

const W = 960, H = 540;
const OVER = '#B42318';
export const QUESTION_NAME: Record<FlowQuestion, string> = {
  howmuch: 'How much do I get back?', why: 'Why was anything kept?', when: 'When will it reach me?', next: 'What do I do now?',
};
/** How each lorem box is drawn: size and font, chosen so `LOREM_SLOTS[slot].perLine` characters fill a line. */
export const SLOT_BOX: Record<LoremSlot, { w: number; h: number; fs: number }> = {
  headline: { w: 212, h: 30, fs: 19 }, tile: { w: 102, h: 38, fs: 11 }, body: { w: 212, h: 40, fs: 12.5 }, button: { w: 102, h: 34, fs: 12.5 },
};
export const SLOT_NAME: Record<LoremSlot, string> = { headline: 'headline', tile: 'tile', body: 'body text', button: 'button' };

/** One of Dev's lorem boxes at (x, y) holding `text`. Lines past the box's capacity spill out below it in red. */
export function SlotBox({ x, y, slot, text, k = 1 }: { x: number; y: number; slot: LoremSlot; text: string; k?: number }) {
  const b = SLOT_BOX[slot], cap = LOREM_SLOTS[slot].lines, lh = b.fs * 1.3;
  const rows = wrapText(text, LOREM_SLOTS[slot].perLine);
  const over = rows.length > cap, isButton = slot === 'button';
  const shown = Math.ceil(rows.length * clamp(k));
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={b.w} height={b.h} rx={isButton ? 10 : 6} fill={isButton ? CHAABI : '#F2F4F7'} stroke={over && k > 0.3 ? OVER : 'none'} strokeWidth={2} />
      <text x={isButton ? b.w / 2 : 6} y={(b.h - cap * lh) / 2 + b.fs} textAnchor={isButton ? 'middle' : 'start'} fontSize={b.fs} fontWeight={isButton || slot === 'headline' ? 900 : 700}>
        {rows.slice(0, shown).map((r, i) => (
          <tspan key={i} x={isButton ? b.w / 2 : 6} dy={i ? lh : 0} fill={i >= cap ? OVER : isButton ? '#FFFFFF' : INK}>{r}</tspan>
        ))}
      </text>
    </g>
  );
}

/** Dev's lorem layout for the move-out screen, 240 × 400. `real` swaps the lorem for real content, one box at a time. */
function LoremPhone({ x, y, real }: { x: number; y: number; real: number }) {
  const R = (n: number) => clamp(real * 6 - n);
  const box = (slot: LoremSlot, lorem: string, text: string, bx: number, by: number, n: number) =>
    <SlotBox x={bx} y={by} slot={slot} text={R(n) > 0 ? text : lorem} k={R(n) > 0 ? R(n) : 1} />;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={240} height={400} rx={30} fill="#FFFFFF" stroke={INK} strokeOpacity={0.15} strokeWidth={2} />
      <rect x={14} y={14} width={212} height={84} rx={12} fill="#E4E7EC" />
      <path d="M40 84 L80 44 L110 70 L130 54 L170 84 Z" fill="#D0D5DD" /><circle cx={180} cy={40} r={10} fill="#D0D5DD" />
      {box('headline', 'Lorem ipsum dolor', '₹41,800 of your ₹45,000 deposit is coming back', 14, 112, 0)}
      {box('tile', 'Sit amet elit', '₹3,200 kept for two repairs', 14, 180, 1)}
      {box('tile', 'Sed do eiusmod', 'Normal wear, like faded paint in the hall, can’t be charged', 124, 180, 2)}
      {box('body', 'Consectetur adipiscing elit, sed do', '₹2,400 to repaint the bedroom wall, with Mrs Sen’s photo of the damp patch', 14, 262, 3)}
      {box('button', 'Lorem', 'Accept and get paid', 14, 348, 4)}
      {box('button', 'Ipsum', 'Question a deduction', 124, 348, 5)}
    </g>
  );
}

/** A screen of the content-first flow, 190 × 300, answering `q` with `items`: a headline-sized item leads, button items become
 *  full-width buttons (the first filled), and the rest is body text. */
export function FlowScreen({ x, y, q, items, lit = false, k = 1 }: { x: number; y: number; q: FlowQuestion; items: readonly { text: string; slot: LoremSlot }[]; lit?: boolean; k?: number }) {
  const firstButton = items.findIndex(o => o.slot === 'button');
  const blocks = items.map((it, i) => {
    const lead = it.slot === 'headline', action = it.slot === 'button';
    const rows = wrapText(it.text, lead ? 15 : action ? 22 : 26);
    const fs = lead ? 17 : 11.5, lh = fs * 1.3;
    return { lead, action, first: action && i === firstButton, rows, fs, lh, h: rows.length * lh + (action ? 14 : 6) };
  });
  const tops = blocks.reduce<number[]>((acc, bl, i) => [...acc, i ? acc[i - 1] + blocks[i - 1].h + 8 : 64], []);
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={190} height={300} rx={22} fill="#FFFFFF" stroke={lit ? CHAABI : INK} strokeOpacity={lit ? 1 : 0.15} strokeWidth={lit ? 3 : 2} />
      <rect x={12} y={12} width={166} height={32} rx={10} fill={CHAABI_SOFT} />
      <text x={22} y={33} fontSize={11.5} fontWeight={900} fill={CHAABI}>{QUESTION_NAME[q]}</text>
      {blocks.map(({ lead, action, first, rows, fs, lh, h }, i) => {
        const top = tops[i];
        if (top + h > 300) return null;
        return (
          <g key={i} opacity={clamp(k * items.length - i)}>
            {action && <rect x={12} y={top} width={166} height={h} rx={10} fill={first ? CHAABI : '#FFFFFF'} stroke={CHAABI} strokeWidth={1.5} />}
            <text x={action ? 95 : 14} y={top + fs + (action ? 5 : 0)} textAnchor={action ? 'middle' : 'start'} fontSize={fs} fontWeight={lead || action ? 900 : 700} fill={first ? '#FFFFFF' : action ? CHAABI : INK}>
              {rows.map((r, j) => <tspan key={j} x={action ? 95 : 14} dy={j ? lh : 0}>{r}</tspan>)}
            </text>
          </g>
        );
      })}
    </g>
  );
}

const ANSWERS: Record<FlowQuestion, { text: string; slot: LoremSlot }[]> = {
  howmuch: [{ text: '₹41,800 of your ₹45,000 deposit is coming back', slot: 'headline' }, { text: '₹3,200 kept for two repairs', slot: 'tile' }],
  why: [{ text: '₹2,400 to repaint the bedroom wall, with Mrs Sen’s photo of the damp patch', slot: 'body' }, { text: '₹800 for the broken geyser knob, from the plumber’s bill', slot: 'body' }],
  when: [{ text: 'In your bank by 14 March', slot: 'tile' }, { text: 'Mrs Sen has 3 days to approve. If she doesn’t, it’s approved for her', slot: 'body' }],
  next: [{ text: 'Accept and get paid', slot: 'button' }, { text: 'Question a deduction', slot: 'button' }],
};

export function ContentFirstScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const fin = p(t, 33, 33.6);
  const real = p(t, 6.4, 10.4);
  const lorem = 1 - p(t, 23.6, 24.2);
  const qs = t >= 12 && t < 24 ? p(t, 12, 12.4) : 0;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Dev's lorem-ipsum move-out screen fits perfectly until the real words arrive and spill out of every box; Ananya starts again from the tenant's four questions, writes the real answers, and the flow is rebuilt around them">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro * (1 - fin)}>
        {lorem > 0 && <g opacity={lorem}><LoremPhone x={70} y={lerp(80, 70, intro)} real={real} /></g>}

        {t < 6 && (
          <g opacity={p(t, 1, 1.5)}>
            <text x={380} y={120} fontSize={28} fontWeight={900} fill={SC.text}>Dev’s move-out screen</text>
            <text x={380} y={160} fontSize={16} fontWeight={800} fill={SC.muted}>
              <tspan x={380} dy={0}>A photo, an 18-character headline, two tiles,</tspan>
              <tspan x={380} dy={26}>a paragraph and two short buttons.</tspan>
              <tspan x={380} dy={40} fill={SC.mint} opacity={p(t, 3, 3.5)}>In lorem ipsum, everything fits.</tspan>
            </text>
          </g>
        )}
        {t >= 6 && t < 12 && (
          <g opacity={p(t, 6, 6.5)}>
            <text x={380} y={120} fontSize={28} fontWeight={900} fill={SC.error}>Then the real words arrive</text>
            <text x={380} y={160} fontSize={16} fontWeight={800} fill={SC.muted}>
              <tspan x={380} dy={0}>The amount needs three lines. The reasons</tspan>
              <tspan x={380} dy={26}>don’t fit a tile. The buttons spill over.</tspan>
            </text>
            <g transform="translate(380 240)" opacity={p(t, 9.6, 10.2)}>
              <rect width={420} height={64} rx={16} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text x={20} y={28} fontSize={14} fontWeight={900} fill={SC.text}>Dev: “Can we just say ‘Refund: ₹41,800’?”</text>
              <text x={20} y={48} fontSize={13} fontWeight={700} fill={SC.muted}>Cutting to fit removes the reasons Tanvir needs.</text>
            </g>
          </g>
        )}
        {qs > 0 && (
          <g transform="translate(380 90)" opacity={qs}>
            <text x={0} y={0} fontSize={13} fontWeight={900} fill={SC.muted} letterSpacing={1.5}>WHAT TANVIR WANTS TO KNOW, IN ORDER</text>
            {FLOW_QUESTIONS.map((q, i) => (
              <g key={q} transform={`translate(0 ${24 + i * 96})`} opacity={p(t, 12.4 + i * 0.8, 12.9 + i * 0.8)}>
                <circle cx={16} cy={16} r={16} fill={CHAABI} />
                <text x={16} y={21} textAnchor="middle" fontSize={14} fontWeight={900} fill="#FFFFFF">{i + 1}</text>
                <text x={44} y={22} fontSize={19} fontWeight={900} fill={SC.text}>{QUESTION_NAME[q]}</text>
                <text x={44} y={50} fontSize={14} fontWeight={700} fill={SC.muted} opacity={p(t, 18 + i * 1.2, 18.6 + i * 1.2)}>
                  {wrapText(ANSWERS[q].map(a => a.text).join(' · '), 58).slice(0, 2).map((r, j) => <tspan key={j} x={44} dy={j ? 20 : 0}>{r}</tspan>)}
                </text>
              </g>
            ))}
          </g>
        )}
        {t >= 24 && t < 30 && (
          <g>
            {FLOW_QUESTIONS.map((q, i) => (
              <g key={q} opacity={p(t, 24.2 + i * 0.6, 24.8 + i * 0.6)}>
                <FlowScreen x={60 + i * 215} y={lerp(140, 120, p(t, 24.2 + i * 0.6, 24.8 + i * 0.6))} q={q} items={ANSWERS[q]} k={p(t, 24.4 + i * 0.6, 25.4 + i * 0.6)} />
                {i < 3 && <path d={`M${255 + i * 215} 270 h16 m-6 -6 l6 6 l-6 6`} fill="none" stroke={SC.muted} strokeWidth={2.5} strokeLinecap="round" />}
              </g>
            ))}
            <text x={W / 2} y={80} textAnchor="middle" fontSize={26} fontWeight={900} fill={SC.text} opacity={p(t, 24, 24.5)}>One question per screen, sized to its answer</text>
            <text x={W / 2} y={470} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 27, 27.5)}>The amount is the biggest thing. The proof sits under each deduction. The buttons grow with their words.</text>
          </g>
        )}
        {t >= 30 && t < 33 && (
          <g transform="translate(180 140)" opacity={p(t, 30, 30.5)}>
            <text x={0} y={0} fontSize={26} fontWeight={900} fill={SC.text}>Tenants who questioned a deduction</text>
            {[{ l: 'Lorem layout, reasons cut', v: 1 / 3, c: SC.error, s: '1 in 3' }, { l: 'Content first, reasons shown', v: 1 / 12, c: CHAABI, s: '1 in 12' }].map((b, i) => (
              <g key={b.l} transform={`translate(0 ${50 + i * 90})`}>
                <text x={0} y={18} fontSize={15} fontWeight={800} fill={SC.muted}>{b.l}</text>
                <rect x={0} y={30} width={lerp(0, 600 * b.v, p(t, 30.4 + i * 0.5, 31.2 + i * 0.5))} height={30} rx={8} fill={b.c} />
                <text x={600 * b.v + 14} y={52} fontSize={18} fontWeight={900} fill={SC.text} opacity={p(t, 31 + i * 0.5, 31.4 + i * 0.5)}>{b.s}</text>
              </g>
            ))}
          </g>
        )}
      </g>

      {t >= 33 && (
        <g opacity={fin}>
          <text x={W / 2} y={110} textAnchor="middle" fontSize={26} fontWeight={900} fill={SC.text}>Words before boxes</text>
          {['Their questions, in order', 'Real answers, longest first', 'Then the layout'].map((s, i) => (
            <g key={s} transform={`translate(${110 + i * 260} 180)`} opacity={p(t, 33.2 + i * 0.4, 33.7 + i * 0.4)}>
              <rect width={220} height={120} rx={18} fill={SC.surface} stroke={i === 2 ? CHAABI : SC.line} strokeWidth={2} />
              <text x={110} y={52} textAnchor="middle" fontSize={34} fontWeight={900} fill={CHAABI}>{i + 1}</text>
              <text x={110} y={88} textAnchor="middle" fontSize={15} fontWeight={900} fill={SC.text}>{s}</text>
              {i < 2 && <path d="M232 60 h20 m-7 -7 l7 7 l-7 7" fill="none" stroke={SC.muted} strokeWidth={2.5} strokeLinecap="round" />}
            </g>
          ))}
          <text x={W / 2} y={360} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 34.5, 35)}>Lorem ipsum is always the right length. Nothing real is.</text>
        </g>
      )}
    </svg>
  );
}
