'use client';
// Scene for ia.4-1: Meenal signs up for Mandi on a bus. The form's placeholder vanishes, her number opens the letter
// keyboard, Submit says "Invalid input" and wipes her password, and she leaves at 3:40. Then fields are cut (twelve
// become six) and the rest fixed: labels that stay, the number pad, rules up front, errors beside the field. The
// stopwatch ends at the fixed form's time from `formSeconds`. `MandiForm` (each field drafted or fixed) is shared with
// the Triage the form game. Pure function of t (0–34).
import { formSeconds, MANDI_FIELDS, type MandiField } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
export const FORM_W = 240, FORM_H = 560;
const ORDER = Object.keys(MANDI_FIELDS) as MandiField[];
const ROW = 58, TOP = 56;

/** Where each field sits on the phone, given which are fixed (cut fields close up once fixed). */
export function formLayout(fixed: Partial<Record<MandiField, boolean>>) {
  const at: Partial<Record<MandiField, number>> = {};
  let y = TOP;
  for (const k of ORDER) {
    if (fixed[k] && MANDI_FIELDS[k][1] === 0) continue;
    at[k] = y; y += ROW;
  }
  return { at, bottom: y };
}
export const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

function Box({ y, text, muted, tone, badge }: { y: number; text: string; muted?: boolean; tone?: string; badge?: string }) {
  return (
    <g>
      <rect x={16} y={y} width={208} height={28} rx={6} fill={SC.surface} stroke={tone ?? SC.line} strokeWidth={tone ? 2 : 1.5} />
      <text x={26} y={y + 18} fontSize={11.5} fontWeight={600} fill={muted ? SC.muted : SC.text}>{text}</text>
      {badge && <g><rect x={186} y={y + 6} width={30} height={16} rx={4} fill={SC.soft} stroke={SC.line} /><text x={201} y={y + 17.5} textAnchor="middle" fontSize={8.5} fontWeight={800} fill={SC.muted}>{badge}</text></g>}
    </g>
  );
}
const Label = ({ y, text }: { y: number; text: string }) => <text x={16} y={y + 10} fontSize={10.5} fontWeight={800} fill={SC.text}>{text}</text>;
const Hint = ({ y, text, tone }: { y: number; text: string; tone?: string }) => <text x={16} y={y + 54} fontSize={9.5} fontWeight={700} fill={tone ?? SC.muted}>{text}</text>;

function Field({ k, y, fixed }: { k: MandiField; y: number; fixed: boolean }) {
  const b = y + 15;
  switch (k) {
    case 'name': return fixed
      ? <g><Label y={y} text="Full name" /><Box y={b} text="Meenal Kulkarni" /></g>
      : <g><Box y={b} text="Enter here" muted /></g>;
    case 'phone': return fixed
      ? <g><Label y={y} text="Mobile number" /><Box y={b} text="+91  98230 41562" badge="123" /></g>
      : <g><Label y={y} text="Mobile" /><Box y={b} text="98230" badge="ABC" /></g>;
    case 'email2': return <g opacity={fixed ? 0.3 : 1}><Label y={y} text="Confirm email *" /><Box y={b} text="" /></g>;
    case 'gender': return <g opacity={fixed ? 0.3 : 1}><Label y={y} text="Gender *" /><Box y={b} text="Select" muted /><text x={208} y={b + 18} fontSize={11} fill={SC.muted}>▾</text></g>;
    case 'diet': return fixed
      ? <g><Label y={y} text="What do you eat?" />{['Veg', 'Eggs', 'Non-veg'].map((c, i) => <g key={c}><rect x={16 + i * 70} y={b} width={64} height={28} rx={14} fill={i === 0 ? SC.brand : SC.surface} stroke={i === 0 ? SC.brand : SC.line} strokeWidth={1.5} /><text x={48 + i * 70} y={b + 18} textAnchor="middle" fontSize={11} fontWeight={800} fill={i === 0 ? '#fff' : SC.text}>{c}</text></g>)}</g>
      : <g><Box y={b} text="Select" muted /><text x={208} y={b + 18} fontSize={11} fill={SC.muted}>▾</text></g>;
    case 'pincode': return fixed
      ? <g><Label y={y} text="Pincode" /><Box y={b} text="411028" badge="123" /><Hint y={y} text="✓ Hadapsar, Pune" tone={SC.mint} /></g>
      : <g><Label y={y} text="Pincode" /><Box y={b} text="4110" badge="ABC" /></g>;
    case 'flat': return fixed
      ? <g><Label y={y} text="Flat and wing" /><Box y={b} text="B/702, Magarpatta" /><text x={210} y={b + 19} fontSize={13} fontWeight={900} fill={SC.mint}>✓</text></g>
      : <g><Label y={y} text="Flat no." /><Box y={b} text="B/702" tone={SC.error} /><Hint y={y} text="Invalid input" tone={SC.error} /></g>;
    case 'password': return fixed
      ? <g><Label y={y} text="Password" /><Box y={b} text="••••••••••" /><text x={190} y={b + 18} fontSize={10} fontWeight={800} fill={SC.brand}>Show</text><Hint y={y} text="✓ At least 8 characters" tone={SC.mint} /></g>
      : <g><Label y={y} text="Password *" /><Box y={b} text="" tone={SC.error} /><Hint y={y} text="Invalid password" tone={SC.error} /></g>;
  }
}

/** Mandi's sign-up form on a 240 × 560 phone, each field as drafted or fixed. Cut fields fade, then close up once `closed`. */
export function MandiForm({ fixed, focus, x = 0, y = 0, scale = 1, closed = true }: { fixed: Partial<Record<MandiField, boolean>>; focus?: MandiField; x?: number; y?: number; scale?: number; closed?: boolean }) {
  const { at, bottom } = formLayout(closed ? fixed : {});
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect width={FORM_W} height={FORM_H} rx={28} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
      <text x={16} y={38} fontSize={16} fontWeight={900} fill={SC.text}>Join Mandi</text>
      {ORDER.map(k => at[k] !== undefined && <Field key={k} k={k} y={at[k]!} fixed={!!fixed[k]} />)}
      <rect x={16} y={Math.min(bottom + 10, FORM_H - 52)} width={208} height={36} rx={8} fill={SC.brand} />
      <text x={120} y={Math.min(bottom + 10, FORM_H - 52) + 23} textAnchor="middle" fontSize={12.5} fontWeight={800} fill="#fff">Start my box</text>
      {focus && at[focus] !== undefined && <rect x={8} y={at[focus]! - 4} width={224} height={ROW} rx={10} fill="none" stroke={SC.brand} strokeWidth={2.5} strokeDasharray="6 4" />}
    </g>
  );
}

const PX = 120, PY = 14, PS = 0.92;
const CUT_AT = 21, FIX_AT: Partial<Record<MandiField, number>> = { name: 25.2, phone: 25.8, diet: 26.4, pincode: 27, flat: 27.6, password: 28.2 };
const GONE = ['Confirm email', 'Gender', 'Date of birth', 'City (from pincode)', 'State (from pincode)', 'How did you hear? (ask later)'];
const FIXES = ['Labels above the boxes', 'Number pad for numbers', 'Rules before typing', 'Errors beside the field, nothing wiped'];

export function FormPainScene({ t }: { t: number }) {
  const fixed = Object.fromEntries(ORDER.map(k => [k, MANDI_FIELDS[k][1] === 0 ? t >= CUT_AT + 1.2 : t >= (FIX_AT[k] ?? 99)])) as Record<MandiField, boolean>;
  const closed = t >= CUT_AT + 2.4;
  const focus: MandiField | undefined = t >= 5 && t < 9 ? 'name' : t >= 9 && t < 13 ? 'phone' : t >= 13 && t < 17 ? 'flat' : undefined;
  const drafted = Math.min(220, lerp(0, 220, clamp(t / 17))), done = formSeconds(fixed);
  const clockS = t < 20 ? drafted : t < 30 ? NaN : lerp(0, done, p(t, 30, 31.4));
  const left = p(t, 17, 17.6) * (1 - p(t, 19.6, 20.2));
  const yLeft = (k: number) => 78 + k * 30;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a long sign-up form loses a user on a bus, then is cut to six fields and fixed until it takes under a minute">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={clamp(back(t / 0.6))}><MandiForm fixed={fixed} focus={focus} x={PX} y={PY} scale={PS} closed={closed} /></g>
      {t < 20 && <text x={PX + FORM_W * PS + 14} y={PY + FORM_H * PS - 8} fontSize={12} fontWeight={700} fill={SC.muted} opacity={1 - p(t, 19, 19.6)}>← Scroll for 4 more: date of birth, city, state, how did you hear…</text>}

      {/* stopwatch */}
      {!Number.isNaN(clockS) && (
        <g transform="translate(470 40)" opacity={t < 20 ? clamp(t / 0.6) * (1 - p(t, 19.4, 20)) : p(t, 30, 30.4)}>
          <rect width={220} height={70} rx={16} fill={SC.surface} stroke={t >= 30 ? SC.mint : SC.line} strokeWidth={2} />
          <text x={20} y={26} fontSize={12} fontWeight={800} fill={SC.muted}>{t >= 30 ? 'FIXED FORM' : 'TIME ON THE FORM'}</text>
          <text x={20} y={56} fontSize={28} fontWeight={900} fill={SC.text} style={{ fontVariantNumeric: 'tabular-nums' }}>{mmss(clockS)}</text>
          {t >= 30 && <text x={130} y={56} fontSize={14} fontWeight={800} fill={SC.mint} opacity={p(t, 31.4, 32)}>before her stop</text>}
        </g>
      )}

      {/* what goes wrong */}
      {[{ a: 5, b: 9, say: 'Wait, was this box my name or my society?' }, { a: 9, b: 13, say: 'Letters keyboard again. Switch, type, switch…' }, { a: 13, b: 17, say: '“Invalid input”? Which one? And my password is gone.' }].map(m => t >= m.a && t < m.b && (
        <g key={m.a} transform="translate(470 140)" opacity={p(t, m.a, m.a + 0.5) * (1 - p(t, m.b - 0.4, m.b))}>
          <rect width={420} height={64} rx={16} fill={SC.surface} stroke={SC.error} strokeWidth={2} />
          <text x={20} y={24} fontSize={12} fontWeight={800} fill={SC.muted}>Meenal, on the bus</text>
          <text x={20} y={47} fontSize={15} fontWeight={700} fill={SC.text}>{m.say}</text>
        </g>
      ))}
      {left > 0 && (
        <g transform="translate(470 230)" opacity={left}>
          <rect width={420} height={92} rx={18} fill={SC.error} />
          <text x={24} y={38} fontSize={22} fontWeight={900} fill="#fff">Meenal left at field 9</text>
          <text x={24} y={68} fontSize={15} fontWeight={700} fill="#fff">3 minutes 40 seconds. No box this Saturday.</text>
        </g>
      )}

      {/* cut, then fix */}
      {t >= 20 && t < 30 && (
        <g transform="translate(470 40)" opacity={p(t, 20, 20.5) * (1 - p(t, 29.4, 30))}>
          <text fontSize={20} fontWeight={900} fill={SC.text} y={20}>Cut first: 12 → 6</text>
          {GONE.map((g, k) => (
            <g key={g} opacity={p(t, 20.4 + k * 0.3, 20.8 + k * 0.3)}>
              <text x={0} y={yLeft(k) - 18} fontSize={15} fontWeight={700} fill={SC.muted}>{g}</text>
              <line x1={0} x2={lerp(0, g.length * 7.4, p(t, 20.8 + k * 0.3, 21.3 + k * 0.3))} y1={yLeft(k) - 23} y2={yLeft(k) - 23} stroke={SC.error} strokeWidth={2.5} />
            </g>
          ))}
          <g opacity={p(t, 25, 25.5)} transform="translate(0 260)">
            <text fontSize={20} fontWeight={900} fill={SC.text}>Then fix what stays</text>
            {FIXES.map((f, k) => <text key={f} y={32 + k * 28} fontSize={15} fontWeight={700} fill={SC.text} opacity={p(t, 25.2 + k * 0.6, 25.7 + k * 0.6)}><tspan fill={SC.mint}>✓ </tspan>{f}</text>)}
          </g>
        </g>
      )}
      {t >= 30 && (
        <g transform="translate(470 150)" opacity={p(t, 31, 31.6)}>
          <rect width={420} height={120} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
          <text x={24} y={40} fontSize={18} fontWeight={900} fill={SC.text}>Every field is a cost.</text>
          <text x={24} y={70} fontSize={15} fontWeight={700} fill={SC.muted}>Cut what you don’t need yet.</text>
          <text x={24} y={96} fontSize={15} fontWeight={700} fill={SC.muted}>Make what stays easy to fill.</text>
        </g>
      )}
    </svg>
  );
}
