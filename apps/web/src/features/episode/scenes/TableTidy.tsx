'use client';
// Scene for ui.4-4: Hisaab's udhaar table, copied from a spreadsheet: every cell boxed, everything centred, headers like
// CUST_NM, amounts as 12400.00, ₹800 and 3,600. Ramesh ji takes 14 seconds to find who owes the most. Then the amounts
// and days are right-aligned in tabular figures, values and headers get one format, the boxes and the ID column go,
// overdue rows say so in words, the total stands out, and on the phone each row becomes a card. `Ledger` and
// `LedgerCards` are shared with the Build the table game. Pure function of t (0–34).
import { inr, type LedgerPart } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;

export const LEDGER_ROWS = [
  { id: 'C-00231', name: 'Sunita Sharma', owed: 2450, raw: '2450', days: 12, rawDate: '2024-12-03', date: '3 Dec' },
  { id: 'C-00187', name: 'Mohd. Irfan', owed: 12400, raw: '12400.00', days: 45, rawDate: 'Nov 9th', date: '9 Nov' },
  { id: 'C-00342', name: 'Kavita Joshi', owed: 800, raw: '₹800', days: 3, rawDate: '22/11', date: '22 Nov' },
  { id: 'C-00098', name: 'Ramprasad Meena', owed: 8000, raw: '8000', days: 120, rawDate: '2024-08-07', date: '7 Aug' },
  { id: 'C-00411', name: 'Pooja Agarwal', owed: 1250, raw: '1250.00', days: 6, rawDate: 'Dec 1st', date: '1 Dec' },
  { id: 'C-00276', name: 'Deepak Saini', owed: 3600, raw: '3,600', days: 28, rawDate: '27/10', date: '27 Oct' },
] as const;
const OVERDUE = 30;
const TOTAL = LEDGER_ROWS.reduce((s, r) => s + r.owed, 0);
const num = (n: number) => inr(n).replace('₹', '');

export const LEDGER_W = 540, LEDGER_H = 290;
const HEAD = 34, ROW = 36, TOT = 40;
const COLS = ['id', 'name', 'amount', 'days', 'date'] as const;
const BEFORE = { id: 80, name: 150, amount: 110, days: 80, date: 120 };
const AFTER = { id: 0, name: 190, amount: 120, days: 100, date: 130 };
const HEAD_BEFORE = { id: 'ID', name: 'CUST_NM', amount: 'AMT', days: 'DAYS', date: 'LST_PD' };
const HEAD_AFTER = { id: '', name: 'Customer', amount: 'Owed (₹)', days: 'Days due', date: 'Last paid' };
const PAD = 12;

/** Hisaab's udhaar table. `fixed` says how far each part is fixed (0 → 1); `focus` rings one part. */
export function Ledger({ fixed, focus }: { fixed: Partial<Record<LedgerPart, number>>; focus?: LedgerPart }) {
  const f = (k: LedgerPart) => clamp(fixed[k] ?? 0);
  const cut = f('id');
  const widths = Object.fromEntries(COLS.map(c => [c, lerp(BEFORE[c], AFTER[c], cut)])) as Record<(typeof COLS)[number], number>;
  const xs = {} as Record<(typeof COLS)[number], number>;
  COLS.reduce((x, c) => { xs[c] = x; return x + widths[c]; }, 0);
  const rowY = (k: number) => HEAD + k * ROW;
  const totalY = HEAD + LEDGER_ROWS.length * ROW;
  const grid = f('grid'), align = { amount: f('amount'), days: f('days') };
  /** A value that slides from centred (k = 0) to right-aligned (k = 1) in its column. */
  const cell = (c: 'amount' | 'days', y: number, before: string, after: string, k: number, extra: { weight?: number; fill?: string; size?: number } = {}) => (
    <g>
      <text x={xs[c] + widths[c] / 2} y={y} textAnchor="middle" fontSize={extra.size ?? 13} fontWeight={extra.weight ?? 600} fill={extra.fill ?? SC.text} opacity={1 - k} style={{ fontVariantNumeric: 'proportional-nums' }}>{before}</text>
      <text x={xs[c] + widths[c] - PAD} y={y} textAnchor="end" fontSize={extra.size ?? 13} fontWeight={extra.weight ?? 600} fill={extra.fill ?? SC.text} opacity={k} style={{ fontVariantNumeric: 'tabular-nums' }}>{after}</text>
    </g>
  );
  const ring = (x: number, y: number, w: number, h: number) => <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} rx={8} fill="none" stroke={SC.brand} strokeWidth={3} />;

  return (
    <g>
      <rect width={LEDGER_W} height={LEDGER_H} rx={10} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
      {/* overdue rows: a red background, which fades to a faint tint once the words carry the meaning */}
      {LEDGER_ROWS.map((r, k) => r.days > OVERDUE && <rect key={r.id} x={1} y={rowY(k)} width={LEDGER_W - 2} height={ROW} fill={SC.error} opacity={lerp(0.14, 0.04, f('overdue'))} />)}
      {/* lines: a box round every cell, then light rules between rows */}
      <g opacity={1 - grid}>
        {COLS.slice(1).map(c => <line key={c} x1={xs[c]} x2={xs[c]} y1={0} y2={LEDGER_H} stroke={SC.text} strokeOpacity={0.45} />)}
        {Array.from({ length: LEDGER_ROWS.length + 1 }, (_, k) => <line key={k} x1={0} x2={LEDGER_W} y1={rowY(k)} y2={rowY(k)} stroke={SC.text} strokeOpacity={0.45} />)}
      </g>
      <g opacity={grid}>
        {Array.from({ length: LEDGER_ROWS.length }, (_, k) => <line key={k} x1={PAD} x2={LEDGER_W - PAD} y1={rowY(k + 1)} y2={rowY(k + 1)} stroke={SC.line} />)}
        <line x1={PAD} x2={LEDGER_W - PAD} y1={HEAD} y2={HEAD} stroke={SC.line} strokeWidth={1.5} />
      </g>
      {/* the header */}
      {COLS.map(c => {
        if (!widths[c]) return null;
        const right = c === 'amount' || c === 'days';
        const k = right ? align[c] : 0;
        const before = HEAD_BEFORE[c], after = HEAD_AFTER[c], hk = f('header');
        return (
          <g key={c} opacity={c === 'id' ? 1 - cut : 1}>
            <text x={lerp(right ? xs[c] + widths[c] / 2 : xs[c] + PAD, xs[c] + widths[c] - PAD, k)} y={22} textAnchor={k > 0.5 ? 'end' : right ? 'middle' : 'start'} fontSize={11.5} fontWeight={900} fill={SC.text} opacity={1 - hk}>{before}</text>
            <text x={lerp(right ? xs[c] + widths[c] / 2 : xs[c] + PAD, xs[c] + widths[c] - PAD, k)} y={22} textAnchor={k > 0.5 ? 'end' : right ? 'middle' : 'start'} fontSize={12} fontWeight={700} fill={SC.muted} opacity={hk}>{after}</text>
          </g>
        );
      })}
      {/* the rows */}
      {LEDGER_ROWS.map((r, k) => {
        const y = rowY(k) + 23, late = r.days > OVERDUE, ok = f('overdue');
        return (
          <g key={r.id}>
            {widths.id > 4 && <text x={xs.id + PAD} y={y} fontSize={12} fontWeight={600} fill={SC.muted} opacity={1 - cut}>{r.id}</text>}
            <text x={xs.name + PAD} y={y} fontSize={13} fontWeight={700} fill={SC.text}>{r.name}</text>
            {late && <g opacity={ok}><rect x={xs.name + PAD + (r.name.length * 7.1) + 6} y={y - 12} width={54} height={16} rx={8} fill={SC.error} /><text x={xs.name + PAD + (r.name.length * 7.1) + 33} y={y} textAnchor="middle" fontSize={10} fontWeight={800} fill="#fff">Overdue</text></g>}
            {cell('amount', y, r.raw, num(r.owed), align.amount)}
            {cell('days', y, String(r.days), String(r.days), align.days, late ? { fill: ok > 0.5 ? SC.error : SC.text, weight: ok > 0.5 ? 800 : 600 } : {})}
            <text x={xs.date + PAD} y={y} fontSize={13} fontWeight={600} fill={SC.text} opacity={1 - f('date')}>{r.rawDate}</text>
            <text x={xs.date + PAD} y={y} fontSize={13} fontWeight={600} fill={SC.muted} opacity={f('date')}>{r.date}</text>
          </g>
        );
      })}
      {/* the total */}
      <line x1={f('total') ? PAD : 0} x2={LEDGER_W - (f('total') ? PAD : 0)} y1={totalY} y2={totalY} stroke={SC.text} strokeWidth={lerp(0.6, 2, f('total'))} strokeOpacity={lerp(0.45, 1, f('total'))} />
      <text x={xs.name + PAD} y={totalY + 26} fontSize={lerp(13, 14.5, f('total'))} fontWeight={f('total') > 0.5 ? 900 : 600} fill={SC.text}>{f('header') > 0.5 ? 'Total' : 'TOTAL'}</text>
      {cell('amount', totalY + 26, '28500.00', num(TOTAL), align.amount, { weight: f('total') > 0.5 ? 900 : 600, size: lerp(13, 15, f('total')) })}

      {focus === 'amount' && ring(xs.amount, 0, widths.amount, LEDGER_H)}
      {focus === 'days' && ring(xs.days, 0, widths.days, totalY)}
      {focus === 'date' && ring(xs.date, 0, widths.date, totalY)}
      {focus === 'id' && ring(xs.id, 0, widths.id, totalY)}
      {focus === 'header' && ring(0, 0, LEDGER_W, HEAD)}
      {focus === 'total' && ring(0, totalY, LEDGER_W, TOT + 16)}
      {focus === 'grid' && ring(0, 0, LEDGER_W, LEDGER_H)}
      {focus === 'overdue' && LEDGER_ROWS.map((r, k) => r.days > OVERDUE && <g key={r.id}>{ring(0, rowY(k), LEDGER_W, ROW)}</g>)}
    </g>
  );
}

export const CARDS_W = 240, CARDS_H = 470;
/** The same udhaar list on a phone: one small card per customer. `show` fades the cards in one by one (0 → 1). */
export function LedgerCards({ show = 1 }: { show?: number }) {
  return (
    <g>
      <rect width={CARDS_W} height={CARDS_H} rx={26} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
      <text x={18} y={36} fontSize={16} fontWeight={900} fill={SC.text}>Udhaar</text>
      <text x={CARDS_W - 18} y={36} textAnchor="end" fontSize={13} fontWeight={900} fill={SC.text} style={{ fontVariantNumeric: 'tabular-nums' }}>{inr(TOTAL)}</text>
      {LEDGER_ROWS.map((r, k) => {
        const late = r.days > OVERDUE;
        return (
          <g key={r.id} transform={`translate(12 ${52 + k * 68})`} opacity={clamp(show * LEDGER_ROWS.length - k)}>
            <rect width={CARDS_W - 24} height={60} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
            <text x={12} y={24} fontSize={13} fontWeight={800} fill={SC.text}>{r.name}</text>
            <text x={CARDS_W - 36} y={24} textAnchor="end" fontSize={14} fontWeight={900} fill={SC.text} style={{ fontVariantNumeric: 'tabular-nums' }}>{inr(r.owed)}</text>
            <text x={12} y={45} fontSize={11} fontWeight={700} fill={SC.muted}>Last paid {r.date}</text>
            <text x={CARDS_W - 36} y={45} textAnchor="end" fontSize={11} fontWeight={800} fill={late ? SC.error : SC.muted}>{late ? `${r.days} days overdue` : `${r.days} days`}</text>
          </g>
        );
      })}
    </g>
  );
}

export function TableTidyScene({ t }: { t: number }) {
  const fixed: Partial<Record<LedgerPart, number>> = {
    amount: p(t, 9, 10.4), days: p(t, 9.6, 11), date: p(t, 13, 14.4), header: p(t, 13.6, 15),
    grid: p(t, 17, 18.4), id: p(t, 18, 19.6), overdue: p(t, 21, 22.4), total: p(t, 25, 26.4),
  };
  const table = clamp(back(t / 0.6)) * (1 - p(t, 28.6, 29.2));
  const panel = (a: number, b: number) => p(t, a, a + 0.5) * (1 - p(t, b - 0.5, b));
  const scan = clamp((t - 5.4) / 3);
  const TX = 36, TY = 120;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a boxed, centred spreadsheet of who owes what becomes an aligned, consistent table, then a list of cards on a phone">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      {table > 0 && (
        <g transform={`translate(${TX} ${TY})`} opacity={table}>
          <text y={-20} fontSize={18} fontWeight={900} fill={SC.text}>Udhaar · Sharma General Store</text>
          <Ledger fixed={fixed} focus={t >= 25 && t < 28 ? 'total' : undefined} />
          {t >= 5.4 && t < 8.8 && (
            <g opacity={p(t, 5.4, 5.7) * (1 - p(t, 8.4, 8.8))}>
              <ellipse cx={290} cy={HEAD + 18 + scan * ROW * 5.5} rx={16} ry={20} fill="#f5c9a8" stroke="#c2410c" strokeOpacity={0.4} strokeWidth={2} opacity={0.8} />
            </g>
          )}
          {t >= 10.4 && t < 13 && <rect x={-3} y={HEAD + ROW - 3} width={LEDGER_W + 6} height={ROW + 6} rx={8} fill="none" stroke={SC.mint} strokeWidth={3} opacity={panel(10.4, 13)} />}
        </g>
      )}
      {t >= 29 && (
        <g transform="translate(120 40)" opacity={p(t, 29, 29.6)}>
          <LedgerCards show={p(t, 29.2, 31)} />
        </g>
      )}

      {t >= 4.6 && t < 9.2 && (
        <g transform="translate(620 160)" opacity={panel(4.6, 9.2)}>
          <text fontSize={20} fontWeight={900} fill={SC.text}>“Who owes the most?”</text>
          <text y={56} fontSize={44} fontWeight={900} fill={SC.text} style={{ fontVariantNumeric: 'tabular-nums' }}>{Math.round(lerp(0, 14, scan))} s</text>
          <text y={88} fontSize={15} fontWeight={700} fill={SC.muted}>12400.00 and 8000, centred,</text>
          <text y={110} fontSize={15} fontWeight={700} fill={SC.muted}>look about the same.</text>
        </g>
      )}
      {t >= 9.2 && t < 13 && (
        <g transform="translate(620 160)" opacity={panel(9.2, 13)}>
          <text fontSize={20} fontWeight={900} fill={SC.text}>Line up the numbers</text>
          <text y={32} fontSize={15} fontWeight={700} fill={SC.muted}>Right-aligned, tabular figures:</text>
          <text y={56} fontSize={15} fontWeight={700} fill={SC.muted}>thousands under thousands.</text>
          <text y={98} fontSize={26} fontWeight={900} fill={SC.text} style={{ fontVariantNumeric: 'tabular-nums' }}>12,400</text>
          <text y={128} fontSize={26} fontWeight={900} fill={SC.muted} style={{ fontVariantNumeric: 'tabular-nums' }}>{' '}8,000</text>
        </g>
      )}
      {t >= 13 && t < 17 && (
        <g transform="translate(620 160)" opacity={panel(13, 17)}>
          <text fontSize={20} fontWeight={900} fill={SC.text}>One format</text>
          {[['12400.00 · ₹800 · 3,600', '12,400 · 800 · 3,600'], ['2024-12-03 · Nov 9th', '3 Dec · 9 Nov'], ['CUST_NM · AMT', 'Customer · Owed (₹)']].map(([a, b], k) => (
            <g key={a} transform={`translate(0 ${40 + k * 52})`} opacity={p(t, 13.4 + k * 0.5, 13.9 + k * 0.5)}>
              <text fontSize={13} fontWeight={700} fill={SC.muted} textDecoration="line-through">{a}</text>
              <text y={22} fontSize={15} fontWeight={800} fill={SC.text}>{b}</text>
            </g>
          ))}
        </g>
      )}
      {t >= 17 && t < 21 && (
        <g transform="translate(620 160)" opacity={panel(17, 21)}>
          <text fontSize={20} fontWeight={900} fill={SC.text}>Less ink</text>
          <text y={32} fontSize={15} fontWeight={700} fill={SC.muted}>No box round every cell;</text>
          <text y={56} fontSize={15} fontWeight={700} fill={SC.muted}>light rules between rows.</text>
          <text y={90} fontSize={15} fontWeight={700} fill={SC.muted} opacity={p(t, 18, 18.5)}>The ID column nobody reads: cut.</text>
        </g>
      )}
      {t >= 21 && t < 25 && (
        <g transform="translate(620 160)" opacity={panel(21, 25)}>
          <text fontSize={20} fontWeight={900} fill={SC.text}>Not just red</text>
          <text y={32} fontSize={15} fontWeight={700} fill={SC.muted}>“Overdue” in words, the days in red.</text>
          <text y={56} fontSize={15} fontWeight={700} fill={SC.muted}>It still reads in greyscale.</text>
        </g>
      )}
      {t >= 25 && t < 29 && (
        <g transform="translate(620 160)" opacity={panel(25, 29)}>
          <text fontSize={20} fontWeight={900} fill={SC.text}>The total stands out</text>
          <text y={32} fontSize={15} fontWeight={700} fill={SC.muted}>Bold, under a heavier rule,</text>
          <text y={56} fontSize={15} fontWeight={700} fill={SC.muted}>with a header that stays put.</text>
        </g>
      )}
      {t >= 29 && (
        <g transform="translate(460 180)" opacity={p(t, 30, 30.6)}>
          <text fontSize={20} fontWeight={900} fill={SC.text}>On the phone, rows become cards</text>
          <text y={32} fontSize={15} fontWeight={700} fill={SC.muted}>Name and amount first. Tap for the rest.</text>
          <text y={92} fontSize={44} fontWeight={900} fill={SC.text} opacity={p(t, 31.4, 32)}>3 s</text>
          <text y={120} fontSize={15} fontWeight={700} fill={SC.muted} opacity={p(t, 31.4, 32)}>to find who owes the most, down from 14.</text>
        </g>
      )}
    </svg>
  );
}
