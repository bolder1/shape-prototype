'use client';
// Scene for dc.3-2: Hisaab's "Snap a bill". The first draft reads Shree Ganesh Distributors' bill and saves it
// straight to Ramesh's khata (`DRAFT_TREATMENT`); a smudged 16 goes in as 10 and a GSTIN digit is wrong (`slipped`),
// so the lines fall short of the bill (`billAddsUp`) and he stops using it. The redesign puts each value beside its
// crop, fills, highlights or asks per field (`fieldTreatment`), flags the total a rule caught (`failsCheck`), keeps
// Save as his tap, and gives every failure a message (`BILL_FAILURES`). It ends on `reviewLoad`. Pure function of t (0–36).
// Also exports `TREAT_TONE` and `Paper` for `guess-flag`.
import { BILL_FAILURES, BILL_READ, BILL_TRUTH, DRAFT_TREATMENT, HISAAB_FIELDS, fieldTreatment, reviewLoad, rupees, slipped, type FieldTreatment, type HisaabField } from '@shape/content';
import { back, clamp, Grid, p, SC } from './shared';

const W = 960, H = 540;
const WARN = 'var(--color-fg-warning-primary)';
export const TREAT_TONE: Record<FieldTreatment, string> = { auto: SC.mint, check: WARN, ask: SC.error };
const KEYS = Object.keys(HISAAB_FIELDS) as HisaabField[];
const lineSum = (b: { qty1: number; rate1: number; qty2: number; rate2: number; gstPct: number }) => (b.qty1 * b.rate1 + b.qty2 * b.rate2) * (1 + b.gstPct / 100);
const SHORT = Math.round((lineSum(BILL_TRUTH) - lineSum(BILL_READ)) * 100) / 100;

/** The supplier's paper bill, drawn small: printed header, two handwritten lines, the total. */
export function Paper({ x, y, s = 1, smudge = true }: { x: number; y: number; s?: number; smudge?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(-3)`}>
      <rect width={230} height={320} rx={4} fill="#FFFDF5" stroke="#D6D3C4" strokeWidth={1.5} />
      <text x={16} y={30} fontSize={13} fontWeight={900} fill="#1F2937">SHREE GANESH DISTRIBUTORS</text>
      <text x={16} y={48} fontSize={9} fontWeight={700} fill="#4B5563">GSTIN 27AAKFS4827M1Z5 · Pune</text>
      <text x={16} y={64} fontSize={9} fontWeight={700} fill="#4B5563">Bill SGD/26-27/1187 · 18/11/2026</text>
      <line x1={16} x2={214} y1={76} y2={76} stroke="#D6D3C4" />
      <text x={16} y={100} fontSize={11} fontWeight={700} fill="#1F2937">Sunflower oil 1 L</text>
      <text x={150} y={100} fontSize={12} fontWeight={700} fill="#1E3A8A" fontStyle="italic">24</text>
      <text x={214} y={100} textAnchor="end" fontSize={11} fontWeight={700} fill="#1F2937">142</text>
      <text x={16} y={128} fontSize={11} fontWeight={700} fill="#1F2937">Toor dal 1 kg</text>
      <text x={150} y={128} fontSize={12} fontWeight={700} fill="#1E3A8A" fontStyle="italic">16</text>
      {smudge && <ellipse cx={157} cy={124} rx={11} ry={8} fill="#64748B" opacity={0.35} />}
      <text x={214} y={128} textAnchor="end" fontSize={11} fontWeight={700} fill="#1F2937">155</text>
      <line x1={16} x2={214} y1={240} y2={240} stroke="#D6D3C4" />
      <text x={16} y={262} fontSize={10} fontWeight={700} fill="#4B5563">GST 5%</text>
      <text x={16} y={290} fontSize={13} fontWeight={900} fill="#1F2937">Total</text>
      <text x={214} y={290} textAnchor="end" fontSize={13} fontWeight={900} fill="#1F2937">{rupees(BILL_TRUTH.total)}</text>
    </g>
  );
}

function Row({ k, y, mode, o }: { k: HisaabField; y: number; mode: 'draft' | 'crop' | 'treat'; o: number }) {
  const f = HISAAB_FIELDS[k];
  const tr = mode === 'treat' ? fieldTreatment(k) : 'auto';
  const tone = tr === 'check' ? WARN : tr === 'ask' ? SC.error : SC.line;
  return (
    <g transform={`translate(0 ${y})`} opacity={o}>
      <text x={0} y={14} fontSize={11} fontWeight={700} fill={SC.muted}>{f.label}</text>
      {mode !== 'draft' && <rect x={118} y={0} width={44} height={20} rx={3} fill="#FFFDF5" stroke="#D6D3C4" />}
      {mode !== 'draft' && <text x={140} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill="#1E3A8A">crop</text>}
      <rect x={170} y={-1} width={190} height={22} rx={6} fill={tr === 'check' ? 'var(--color-bg-warning-primary)' : SC.surface} stroke={tone} strokeWidth={tr === 'auto' ? 1 : 2} strokeDasharray={tr === 'ask' ? '5 4' : undefined} />
      <text x={178} y={14} fontSize={11} fontWeight={800} fill={tr === 'ask' ? SC.muted : SC.text}>{tr === 'ask' ? 'What does this say?' : f.read.length > 26 ? `${f.read.slice(0, 25)}…` : f.read}</text>
      {tr === 'check' && <text x={352} y={14} textAnchor="end" fontSize={10} fontWeight={900} fill={SC.text}>Check</text>}
    </g>
  );
}

export function BillScanScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'Snap, saved' : t < 11 ? 'A 16 read as 10' : t < 16 ? 'Show where it read it' : t < 21 ? 'Flag what it’s unsure of' : t < 26 ? 'His tap, his khata' : t < 31 ? 'When it can’t read' : 'Five fields, not twelve';
  const mode = t < 11 ? 'draft' : t < 16 ? 'crop' : 'treat';
  const wrong = slipped(DRAFT_TREATMENT);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Hisaab's first Snap a bill reads Ramesh's supplier bill and saves it to his khata without review. A smudged 16 is read as 10 and a GSTIN digit is wrong, so the lines come to ${rupees(SHORT)} less than the bill and he stops using it. The redesign shows each value beside a crop of the bill, fills what it is sure of, highlights unsure money and record fields, leaves the smudged quantity blank to ask, and flags the total because the lines don't add up. Nothing saves until Ramesh taps Save, and entries can be edited or deleted. Blurry photos, cut-off bills and things that aren't bills each get a message and a way forward. He checks ${reviewLoad(fieldTreatment)} fields, not ${KEYS.length}.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 26 && <Paper x={60} y={100} s={1.05} />}

        {t < 26 && (
          <g transform="translate(400 90)">
            <rect width={420} height={430} rx={30} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            <text x={28} y={40} fontSize={15} fontWeight={900} fill={SC.text}>{mode === 'draft' ? 'Purchase entry' : 'Check this bill'}</text>
            {mode !== 'draft' && <text x={28} y={58} fontSize={10} fontWeight={700} fill={SC.muted}>Read from your photo. Check the highlighted fields.</text>}
            <g transform="translate(28 72)">
              {KEYS.map((k, i) => <Row key={k} k={k} y={i * 26} mode={mode} o={p(t, (mode === 'draft' ? 0.6 : mode === 'crop' ? 11 : 16) + i * 0.12, (mode === 'draft' ? 0.9 : mode === 'crop' ? 11.3 : 16.3) + i * 0.12)} />)}
            </g>
            {t >= 16 && t < 21 && (
              <g transform="translate(28 388)" opacity={p(t, 18, 18.5)}>
                <text fontSize={11} fontWeight={800} fill={SC.text}>⚠ Total: the lines plus GST come to {rupees(lineSum(BILL_READ))}</text>
              </g>
            )}
            {t < 11 && (
              <g transform="translate(60 380)" opacity={p(t, 2, 2.5)}>
                <rect width={300} height={36} rx={18} fill={SC.text} />
                <text x={150} y={23} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.surface}>✓ Saved to khata</text>
              </g>
            )}
            {t >= 21 && (
              <g transform="translate(28 384)" opacity={p(t, 21, 21.5)}>
                <rect width={250} height={36} rx={10} fill="#15803D" />
                <text x={125} y={23} textAnchor="middle" fontSize={13} fontWeight={900} fill="#FFFFFF">Save to khata</text>
                <rect x={262} width={102} height={36} rx={10} fill="none" stroke={SC.line} strokeWidth={2} />
                <text x={313} y={23} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.text}>Edit</text>
                <circle cx={125} cy={18} r={lerpR(t)} fill={SC.brand} opacity={0.25 * p(t, 23, 23.3) * (1 - p(t, 24, 24.6))} />
              </g>
            )}
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g transform="translate(60 488)">
            <g opacity={p(t, 6.4, 7)}>
              <rect width={310} height={46} rx={12} fill={SC.surface} stroke={SC.error} strokeWidth={2} />
              <text x={14} y={20} fontSize={12} fontWeight={800} fill={SC.error}>{wrong.length} wrong values in the khata</text>
              <text x={14} y={37} fontSize={12} fontWeight={700} fill={SC.text}>Lines short by {rupees(SHORT)}; GSTIN won’t match</text>
            </g>
            <g transform="translate(0 -42)" opacity={p(t, 8.5, 9)}>
              <rect width={250} height={36} rx={14} fill={SC.surface} stroke={SC.line} />
              <text x={14} y={23} fontSize={13} fontWeight={800} fill={SC.text}>Ramesh: “I’ll type it myself.”</text>
            </g>
          </g>
        )}

        {t >= 26 && t < 31 && BILL_FAILURES.map((f, i) => (
          <g key={f.when} transform={`translate(${60 + i * 290} 120)`} opacity={p(t, 26.2 + i * 0.7, 26.7 + i * 0.7)}>
            <rect width={270} height={330} rx={26} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            <rect x={20} y={24} width={230} height={120} rx={10} fill={SC.soft} />
            {i === 0 && <g transform="translate(95 40)" opacity={0.35}><rect width={80} height={90} rx={3} fill="#FFFDF5" /><circle cx={40} cy={45} r={36} fill={SC.muted} opacity={0.4} /></g>}
            {i === 1 && <g transform="translate(95 64)"><rect width={80} height={80} rx={3} fill="#FFFDF5" stroke="#D6D3C4" />{[0, 1, 2].map(r => <rect key={r} x={8} y={10 + r * 16} width={60} height={5} rx={2} fill="#CBD5E1" />)}</g>}
            {i === 2 && <g transform="translate(135 84)"><circle r={30} fill={SC.design} opacity={0.3} /><circle cy={-6} r={10} fill={SC.design} opacity={0.6} /></g>}
            <text x={20} y={176} fontSize={13} fontWeight={900} fill={SC.text}>{f.when}</text>
            {wrapText(f.says, 32).map((l, j) => <text key={j} x={20} y={204 + j * 20} fontSize={13} fontWeight={700} fill={SC.text}>{l}</text>)}
            <rect x={20} y={274} width={230} height={34} rx={10} fill="none" stroke={SC.brand} strokeWidth={2} />
            <text x={135} y={296} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.text}>{['Retake · Type it in', 'Retake', 'Add as a note'][i]}</text>
          </g>
        ))}

        {t >= 31 && (
          <g transform="translate(80 140)" opacity={p(t, 31, 31.5)}>
            {[
              { l: 'First draft', checks: reviewLoad(DRAFT_TREATMENT), slips: slipped(DRAFT_TREATMENT).length },
              { l: 'Redesign', checks: reviewLoad(fieldTreatment), slips: slipped(fieldTreatment).length },
            ].map((r, i) => (
              <g key={r.l} transform={`translate(0 ${i * 150})`} opacity={p(t, 31.3 + i * 0.8, 31.8 + i * 0.8)}>
                <text fontSize={18} fontWeight={900} fill={SC.text}>{r.l}</text>
                <text y={36} fontSize={15} fontWeight={800} fill={SC.muted}>Fields Ramesh checks</text>
                <rect x={260} y={20} width={Math.max(6, (r.checks / KEYS.length) * 420)} height={22} rx={6} fill={WARN} />
                <text x={260 + Math.max(6, (r.checks / KEYS.length) * 420) + 12} y={37} fontSize={16} fontWeight={900} fill={SC.text}>{r.checks}</text>
                <text y={76} fontSize={15} fontWeight={800} fill={SC.muted}>Wrong values in the khata</text>
                <rect x={260} y={60} width={Math.max(6, r.slips * 120)} height={22} rx={6} fill={r.slips ? SC.error : SC.mint} />
                <text x={260 + Math.max(6, r.slips * 120) + 12} y={77} fontSize={16} fontWeight={900} fill={SC.text}>{r.slips}</text>
              </g>
            ))}
          </g>
        )}
      </g>
    </svg>
  );
}

const lerpR = (t: number) => 10 + 60 * p(t, 23, 24.6);
/** Greedy word wrap for SVG text. */
function wrapText(s: string, n: number) {
  const out: string[] = [];
  let line = '';
  for (const w of s.split(' ')) { if ((line + ' ' + w).trim().length > n) { out.push(line); line = w; } else line = (line + ' ' + w).trim(); }
  if (line) out.push(line);
  return out;
}
