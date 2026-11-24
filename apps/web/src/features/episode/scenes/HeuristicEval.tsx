'use client';
// Scene for rs.4-4: the Safar booking screen ships Friday with no users booked. Nielsen's ten heuristics line up, then
// Kabir, Meher and Tara each review the screen alone and pin about a third of its eight problems, each a different
// third. Merged, they hold seven. One finding is written up properly (where · heuristic · why), and then a real user
// taps "Book now" and pays at once: the eighth problem, which all three experts missed. Pure function of t (0–34).
// `SafarScreen` is shared with the Sweep the screen game.
import { NIELSEN_10, type SafarPart } from '@shape/content';
import { FAMILY_SOLID } from '../kit';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;

/** Where each part sits on the 300 × 548 phone. */
export const SAFAR_BOX: Record<SafarPart, { x: number; y: number; w: number; h: number; name: string }> = {
  back: { x: 8, y: 14, w: 44, h: 40, name: 'Back arrow' },
  route: { x: 16, y: 64, w: 268, h: 64, name: 'Route' },
  date: { x: 16, y: 138, w: 268, h: 52, name: 'Date' },
  quota: { x: 16, y: 200, w: 268, h: 50, name: 'Quota' },
  search: { x: 16, y: 260, w: 268, h: 44, name: 'Search button' },
  passengers: { x: 16, y: 314, w: 268, h: 92, name: 'Passengers' },
  fare: { x: 16, y: 416, w: 268, h: 50, name: 'Fare' },
  book: { x: 16, y: 478, w: 268, h: 52, name: 'Book now' },
};

export type SafarMark = { tone: 'found' | 'miss' | 'answer'; n?: number; color?: string };

/** The Safar booking screen, drawn at 300 × 548 inside its own <g>. Parts are tappable when `onPart` is given. */
export function SafarScreen({ marks = {}, onPart, fare = '₹1,420', disabled = false }: {
  marks?: Partial<Record<SafarPart, SafarMark>>; onPart?: (part: SafarPart) => void; fare?: string; disabled?: boolean;
}) {
  const box = SAFAR_BOX;
  return (
    <g>
      <rect width={300} height={548} rx={28} fill={SC.surface} stroke={SC.line} strokeWidth={3} />
      {/* header */}
      <path d="M38 34 L24 34 M24 34 L32 26 M24 34 L32 42" stroke={SC.text} strokeWidth={3} strokeLinecap="round" fill="none" />
      <text x={62} y={40} fontSize={18} fontWeight={800} fill={SC.text}>Book ticket</text>
      {/* route */}
      <text x={28} y={86} fontSize={11} fontWeight={800} fill={SC.muted}>FROM → TO</text>
      <text x={28} y={116} fontSize={26} fontWeight={900} fill={SC.text}>PUNE → NGP</text>
      {/* date */}
      <text x={28} y={156} fontSize={11} fontWeight={800} fill={SC.muted}>DATE</text>
      <rect x={28} y={162} width={244} height={24} rx={6} fill={SC.soft} stroke={SC.line} />
      <text x={38} y={179} fontSize={14} fontWeight={600} fill={SC.text}>14-3</text>
      {/* quota */}
      <text x={28} y={216} fontSize={11} fontWeight={800} fill={SC.muted}>QUOTA</text>
      {['GN', 'TQ', 'LD', 'PT'].map((q, k) => (
        <g key={q} transform={`translate(${28 + k * 62} 222)`}>
          <rect width={54} height={24} rx={12} fill={k === 0 ? FAMILY_SOLID[0] : SC.soft} stroke={SC.line} />
          <text x={27} y={17} textAnchor="middle" fontSize={13} fontWeight={800} fill={k === 0 ? '#fff' : SC.text}>{q}</text>
        </g>
      ))}
      {/* search */}
      <rect x={28} y={264} width={244} height={36} rx={10} fill={SC.brand} />
      <text x={150} y={288} textAnchor="middle" fontSize={15} fontWeight={800} fill="#fff">Search trains</text>
      {/* passengers */}
      <text x={28} y={332} fontSize={11} fontWeight={800} fill={SC.muted}>PASSENGERS</text>
      <text x={272} y={332} textAnchor="end" fontSize={12} fontWeight={700} fill={SC.error}>Clear all</text>
      {['Anjali Rao · 29 · F', 'Vikram Rao · 31 · M'].map((n, k) => (
        <g key={n} transform={`translate(28 ${342 + k * 30})`}>
          <rect width={244} height={24} rx={6} fill={SC.soft} />
          <text x={10} y={17} fontSize={13} fontWeight={600} fill={SC.text}>{n}</text>
        </g>
      ))}
      {/* fare */}
      <line x1={28} x2={272} y1={420} y2={420} stroke={SC.line} />
      <text x={28} y={450} fontSize={14} fontWeight={700} fill={SC.muted}>Fare, 2 adults</text>
      <text x={272} y={452} textAnchor="end" fontSize={22} fontWeight={900} fill={SC.text}>{fare}</text>
      {/* book */}
      <rect x={28} y={484} width={244} height={42} rx={12} fill={SC.brand} />
      <text x={150} y={511} textAnchor="middle" fontSize={17} fontWeight={800} fill="#fff">Book now</text>

      {/* marks and hit areas */}
      {(Object.keys(box) as SafarPart[]).map(part => {
        const b = box[part], m = marks[part];
        const stroke = m?.tone === 'miss' ? SC.error : m?.tone === 'answer' ? SC.mint : m?.color ?? SC.mint;
        return (
          <g key={part}>
            {m && <rect x={b.x - 3} y={b.y - 3} width={b.w + 6} height={b.h + 6} rx={10} fill="none" stroke={stroke} strokeWidth={4} strokeDasharray={m.tone === 'answer' ? '8 5' : undefined} />}
            {m?.n !== undefined && (
              <g transform={`translate(${b.x + b.w - 4} ${b.y + 4})`}>
                <circle r={13} fill={m.color ?? FAMILY_SOLID[0]} stroke={SC.surface} strokeWidth={2} />
                <text y={5} textAnchor="middle" fontSize={13} fontWeight={900} fill="#fff">{m.n}</text>
              </g>
            )}
            {onPart && (
              <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={8} fill="transparent" role="button" tabIndex={disabled ? -1 : 0} aria-label={b.name}
                aria-disabled={disabled} style={{ cursor: disabled ? 'default' : 'pointer', outlineOffset: 2 }}
                onClick={() => !disabled && onPart(part)}
                onKeyDown={e => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onPart(part); } }} />
            )}
          </g>
        );
      })}
    </g>
  );
}

const EVALUATORS = [
  { name: 'Kabir', finds: ['route', 'search', 'back'] as SafarPart[] },
  { name: 'Meher', finds: ['quota', 'date', 'search'] as SafarPart[] },
  { name: 'Tara', finds: ['fare', 'passengers', 'route'] as SafarPart[] },
];
const FINDING = [
  { k: 'WHERE', v: ['Quota chips, booking screen'], y: 44 },
  { k: 'HEURISTIC', v: ['2 · Match between the system and the real world'], y: 92 },
  { k: 'WHY IT HURTS', v: ['Travellers don’t know GN, TQ, LD or PT.', 'They guess, and a wrong quota can lose the seat.'], y: 140 },
  { k: 'SEVERITY', v: ['Major'], y: 210 },
  { k: 'DIRECTION', v: ['Use words: General, Tatkal, Ladies and', 'Premium Tatkal, with a line on each.'], y: 252 },
];
const MERGED: SafarPart[] = ['route', 'search', 'back', 'quota', 'date', 'fare', 'passengers'];

export function HeuristicEvalScene({ t }: { t: number }) {
  const list = p(t, 5, 5.6) * (1 - p(t, 10.6, 11.2));
  const evals = p(t, 11, 11.6) * (1 - p(t, 22.4, 23));
  const merge = p(t, 17, 18.4);
  const card = p(t, 23, 23.6) * (1 - p(t, 28.6, 29.2));
  const user = p(t, 29, 29.6);
  const tapped = t > 30.6;

  // pins on the phone: by evaluator while they work alone, then one pin per merged problem
  const marks: Partial<Record<SafarPart, SafarMark>> = {};
  if (t > 11.5 && t < 17.4) {
    EVALUATORS.forEach((e, k) => e.finds.forEach((part, j) => { if (t > 12 + k * 1.4 + j * 0.4 && !marks[part]) marks[part] = { tone: 'found', color: FAMILY_SOLID[k] }; }));
  }
  if (t >= 17.4 && t < 29) MERGED.forEach((part, j) => { marks[part] = { tone: 'found', n: j + 1, color: FAMILY_SOLID[0] }; });
  if (t >= 23 && t < 29) marks.quota = { tone: 'found', n: 4, color: FAMILY_SOLID[3] };
  if (tapped) marks.book = { tone: 'miss' };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: three designers review a train-booking screen against Nielsen's ten heuristics, merge their findings, and a user finds the one they all missed">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />

      <g transform="translate(56 22) scale(0.9)">
        <SafarScreen marks={marks} />
      </g>

      {/* the deadline */}
      <g opacity={1 - p(t, 4.4, 5)}>
        {[['RELEASE', 'Friday'], ['NEXT USER TEST', 'In two weeks']].map(([k, v], i) => (
          <g key={k} transform={`translate(420 ${150 + i * 110}) scale(${clamp(back((t - 0.4 - i * 0.8) / 0.5))})`}>
            <rect width={300} height={84} rx={16} fill={SC.surface} stroke={i === 0 ? FAMILY_SOLID[3] : SC.line} strokeWidth={2.5} />
            <text x={22} y={32} fontSize={13} fontWeight={800} fill={SC.muted}>{k}</text>
            <text x={22} y={64} fontSize={26} fontWeight={900} fill={SC.text}>{v}</text>
          </g>
        ))}
        <text x={420} y={400} fontSize={18} fontWeight={700} fill={SC.text} opacity={p(t, 2.4, 3)}>No users before release. Check it against principles.</text>
      </g>

      {/* Nielsen's ten */}
      {list > 0 && (
        <g opacity={list}>
          <text x={400} y={58} fontSize={14} fontWeight={800} fill={SC.muted}>NIELSEN’S 10 USABILITY HEURISTICS</text>
          {NIELSEN_10.map((h, k) => {
            const s = clamp(back((t - 5.4 - k * 0.32) / 0.4));
            const words = h.name.length > 38 ? [h.name.slice(0, h.name.lastIndexOf(' ', 36)), h.name.slice(h.name.lastIndexOf(' ', 36) + 1)] : [h.name];
            return (
              <g key={h.id} transform={`translate(400 ${78 + k * 44})`} opacity={s}>
                <rect width={520} height={38} rx={10} fill={SC.surface} stroke={SC.line} />
                <circle cx={22} cy={19} r={13} fill={FAMILY_SOLID[k % 4]} />
                <text x={22} y={24} textAnchor="middle" fontSize={13} fontWeight={900} fill="#fff">{k + 1}</text>
                {words.length === 1
                  ? <text x={46} y={25} fontSize={15} fontWeight={700} fill={SC.text}>{words[0]}</text>
                  : words.map((w, j) => <text key={w} x={46} y={16 + j * 15} fontSize={13} fontWeight={700} fill={SC.text}>{w}</text>)}
              </g>
            );
          })}
        </g>
      )}

      {/* three evaluators, alone, then merged */}
      {evals > 0 && (
        <g opacity={evals}>
          <text x={400} y={70} fontSize={14} fontWeight={800} fill={SC.muted}>{merge < 0.5 ? 'EACH EVALUATOR, ALONE' : 'MERGED, DUPLICATES REMOVED'}</text>
          {EVALUATORS.map((e, k) => {
            const y = lerp(90 + k * 104, 90, merge), o = 1 - merge;
            return (
              <g key={e.name} transform={`translate(400 ${y})`} opacity={o}>
                <rect width={520} height={88} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <circle cx={34} cy={44} r={20} fill={FAMILY_SOLID[k]} />
                <text x={34} y={50} textAnchor="middle" fontSize={16} fontWeight={900} fill="#fff">{e.name[0]}</text>
                <text x={68} y={38} fontSize={17} fontWeight={800} fill={SC.text}>{e.name}</text>
                <text x={68} y={62} fontSize={14} fill={SC.muted}>{e.finds.length} of 8 problems · about a third</text>
              </g>
            );
          })}
          {merge > 0 && (
            <g opacity={merge} transform="translate(400 100)">
              <text fontSize={54} fontWeight={900} fill={SC.text} y={50}>7 of 8</text>
              <text y={86} fontSize={17} fontWeight={700} fill={SC.text}>Three people, alone, then merged.</text>
              <text y={112} fontSize={15} fill={SC.muted}>Each found a different third. Together they found most.</text>
              {MERGED.map((part, j) => (
                <g key={part} transform={`translate(${(j % 4) * 130} ${140 + Math.floor(j / 4) * 40}) scale(${clamp(back((t - 18.4 - j * 0.25) / 0.4))})`}>
                  <rect width={122} height={30} rx={15} fill={SC.surface} stroke={SC.line} />
                  <text x={14} y={20} fontSize={12} fontWeight={900} fill={FAMILY_SOLID[0]}>{j + 1}</text>
                  <text x={30} y={20} fontSize={12} fontWeight={700} fill={SC.text}>{SAFAR_BOX[part].name}</text>
                </g>
              ))}
            </g>
          )}
        </g>
      )}

      {/* one finding, written so it can be fixed */}
      {card > 0 && (
        <g opacity={card} transform={`translate(400 ${lerp(110, 90, card)})`}>
          <text y={-14} fontSize={14} fontWeight={800} fill={SC.muted}>FINDING 4</text>
          <rect width={520} height={300} rx={18} fill={SC.surface} stroke={FAMILY_SOLID[3]} strokeWidth={2.5} />
          {FINDING.map((r, j) => (
            <g key={r.k} opacity={p(t, 23.4 + j * 0.5, 23.9 + j * 0.5)}>
              <text x={24} y={r.y} fontSize={12} fontWeight={800} fill={SC.muted}>{r.k}</text>
              {r.v.map((v, i) => <text key={v} x={140} y={r.y + i * 22} fontSize={14} fontWeight={700} fill={SC.text}>{v}</text>)}
            </g>
          ))}
        </g>
      )}

      {/* then a user */}
      {user > 0 && (
        <g opacity={user}>
          <g transform="translate(470 120)">
            <circle cy={-22} r={16} fill={FAMILY_SOLID[2]} />
            <path d="M-26 22 Q-26 -4 0 -4 Q26 -4 26 22 Z" fill={FAMILY_SOLID[2]} />
            <text x={50} y={-14} fontSize={18} fontWeight={800} fill={SC.text}>Session 1, a week later</text>
            <text x={50} y={12} fontSize={15} fill={SC.muted}>Farah wants to check the berths first. She taps Book now.</text>
          </g>
          {/* the tap */}
          {t > 30 && (
            <circle cx={56 + 150 * 0.9} cy={22 + 505 * 0.9} r={lerp(6, 30, p(t, 30, 30.8))} fill="none" stroke={SC.error} strokeWidth={3} opacity={1 - p(t, 30.6, 31.4)} />
          )}
          {tapped && (
            <g opacity={p(t, 30.8, 31.4)} transform="translate(420 220)">
              <rect width={480} height={210} rx={18} fill={SC.surface} stroke={SC.error} strokeWidth={2.5} />
              <text x={24} y={44} fontSize={22} fontWeight={900} fill={SC.text}>₹1,420 paid. No review screen.</text>
              <text x={24} y={80} fontSize={15} fontWeight={700} fill={SC.muted}>“Wait, I hadn’t chosen the lower berth yet.”</text>
              <text x={24} y={124} fontSize={16} fontWeight={800} fill={SC.text}>Problem 8: error prevention.</text>
              <text x={24} y={150} fontSize={15} fill={SC.muted}>All three experts missed it. A user found it in two minutes.</text>
              <text x={24} y={186} fontSize={15} fontWeight={700} fill={SC.text} opacity={p(t, 32, 32.6)}>Review first, then test with users.</text>
            </g>
          )}
        </g>
      )}
    </svg>
  );
}
