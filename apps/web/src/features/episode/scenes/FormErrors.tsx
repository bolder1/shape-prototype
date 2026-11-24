'use client';
// Scene for ax.2-3: Farhan presses Pay on Rahi's passenger form. Fields turn red, focus stays on the button and NVDA
// says nothing. Without colour, nobody can tell which fields are wrong; the Age placeholder vanishes once he types;
// the email error is only a border. The fixes, field by field (`RAHI_FIELDS`, read aloud by `fieldAnnounce`): visible
// labels, errors in text linked with aria-describedby and aria-invalid, errors that say how to fix it, and focus on a
// summary after a failed submit. Pure function of t (0–36).
import { fieldAnnounce, RAHI_FIELDS, wrapText, type FormField } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';
import { INK, INK_MUTED } from './EaseCurves';
import { RAHI, Ring } from './KeyboardFlow';
import { Speech } from './SrSemantics';

const W = 960, H = 540;
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const ERR = '#D92D20';
type Row = 'name' | 'age' | 'mobile' | 'email' | 'idnum' | 'terms';
const ROWS: Row[] = ['name', 'age', 'mobile', 'email', 'idnum', 'terms'];
const ROW_Y: Record<Row, number> = { name: 56, age: 112, mobile: 168, email: 224, idnum: 280, terms: 338 };
/** Each field after Meera's fixes. */
export const FIXED_FIELDS: Record<Row, FormField> = {
  name: RAHI_FIELDS.name,
  age: { ...RAHI_FIELDS.age, label: 'Age' },
  mobile: { ...RAHI_FIELDS.mobile, error: { text: 'Enter a 10-digit mobile number, like 98200 12345', linked: true, fix: true } },
  email: { ...RAHI_FIELDS.email, error: { text: 'Enter an email like name@example.com', linked: true, fix: true } },
  idnum: { ...RAHI_FIELDS.idnum, error: { text: 'Enter the 10-character PAN, like ABCDE1234F', linked: true, fix: true } },
  terms: { ...RAHI_FIELDS.terms, error: { text: 'Tick this to accept the cancellation policy', linked: true, fix: true } },
};
const box = (r: Row) => (r === 'terms' ? { x: 12, y: ROW_Y.terms - 2, w: 20, h: 20 } : { x: 12, y: ROW_Y[r] + 6, w: 376, h: 28 });
const PAY = { x: 12, y: 384, w: 376, h: 44 };

function FieldRow({ r, f, errors, typed = true }: { r: Row; f: FormField; errors: boolean; typed?: boolean }) {
  const y = ROW_Y[r], err = errors && f.error;
  if (r === 'terms') {
    return (
      <g>
        <rect x={12} y={y - 2} width={20} height={20} rx={4} fill="#FFFFFF" stroke={err ? ERR : INK} strokeOpacity={err ? 1 : 0.4} strokeWidth={2} />
        <text x={42} y={y + 13} fontSize={11.5} fontWeight={700} fill={INK}>{f.label}{err && !f.error?.text ? <tspan fill={ERR}> *</tspan> : null}</text>
        {err && f.error?.text && <text x={42} y={y + 31} fontSize={10} fontWeight={800} fill={ERR}>{f.error.text}</text>}
      </g>
    );
  }
  const showValue = typed || !f.placeholder;
  return (
    <g>
      {f.label && <text x={12} y={y} fontSize={10} fontWeight={800} fill={INK_MUTED}>{f.label}</text>}
      <rect x={12} y={y + 6} width={376} height={28} rx={7} fill="#FFFFFF" stroke={err ? ERR : INK} strokeOpacity={err ? 1 : 0.3} strokeWidth={err ? 2.5 : 1.5} />
      <text x={22} y={y + 25} fontSize={12} fontWeight={700} fill={showValue ? INK : '#98A2B3'}>{showValue ? f.value : f.placeholder}</text>
      {err && f.error?.text && <text x={12} y={y + 47} fontSize={10} fontWeight={800} fill={ERR}>{f.error.text}</text>}
    </g>
  );
}

/** Rahi's passenger form, 400 × 440. `fixed` lists the rows already fixed. */
function RahiForm({ x, y, errors, fixed, focus, ageTyped = true, summary = 0, grey = 0 }: {
  x: number; y: number; errors: boolean; fixed: Row[]; focus?: { x: number; y: number; w: number; h: number } | null; ageTyped?: boolean; summary?: number; grey?: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs><filter id="fe-grey"><feColorMatrix type="saturate" values={String(1 - grey)} /></filter></defs>
      <g filter={grey > 0 ? 'url(#fe-grey)' : undefined}>
        <rect width={400} height={440} rx={18} fill="#FFFFFF" stroke={INK} strokeOpacity={0.15} strokeWidth={2} />
        <rect width={400} height={40} rx={18} fill={RAHI} /><rect y={22} width={400} height={18} fill={RAHI} />
        <text x={16} y={27} fontSize={15} fontWeight={900} fill="#FFFFFF">Passenger details · Pune → Goa</text>
        {ROWS.map(r => <FieldRow key={r} r={r} f={fixed.includes(r) ? FIXED_FIELDS[r] : RAHI_FIELDS[r]} errors={errors} typed={r !== 'age' || ageTyped} />)}
        <rect {...{ x: PAY.x, y: PAY.y, width: PAY.w, height: PAY.h }} rx={11} fill={RAHI} />
        <text x={200} y={411} textAnchor="middle" fontSize={14} fontWeight={900} fill="#FFFFFF">Pay ₹1,280</text>
      </g>
      {summary > 0 && (
        <g opacity={summary} transform={`translate(0 ${lerp(-8, 0, summary)})`}>
          <rect x={8} y={46} width={384} height={98} rx={12} fill="#FEF3F2" stroke={ERR} strokeWidth={2} />
          <text x={22} y={72} fontSize={14} fontWeight={900} fill="#912018">There are 3 problems</text>
          {['Email for your ticket', 'PAN, to show when you board', 'Cancellation policy'].map((l, i) => (
            <text key={l} x={22} y={94 + i * 17} fontSize={11} fontWeight={800} fill="#912018" textDecoration="underline">{l}</text>
          ))}
        </g>
      )}
      {focus && <Ring b={focus} />}
    </g>
  );
}

function Panel({ title, lines, t0, t }: { title: string; lines: string[]; t0: number; t: number }) {
  return (
    <g opacity={p(t, t0, t0 + 0.5)}>
      <text x={0} y={0} fontSize={27} fontWeight={900} fill={SC.text}>{title}</text>
      <text x={0} y={36} fontSize={15} fontWeight={800} fill={SC.muted}>
        {lines.map((l, i) => <tspan key={i} x={0} dy={i ? 23 : 0}>{l}</tspan>)}
      </text>
    </g>
  );
}

export function FormErrorsScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const fin = p(t, 33, 33.6);
  const PX = 50, PY = 60;
  const errors = t > 1.6;
  let fixed: Row[] = [], focus: { x: number; y: number; w: number; h: number } | null = PAY, side: React.ReactNode = null;
  let ageTyped = true, summary = 0, grey = 0;

  if (t < 6) {
    side = (
      <g transform="translate(500 110)">
        <Panel t={t} t0={0.2} title="Red, and silent" lines={['Farhan presses Pay. Fields turn red, but focus', 'stays on the button and NVDA says nothing new.', 'He presses Pay again.']} />
        <Speech x={0} y={110} text={t < 1.6 ? 'Pay ₹1,280, button' : ''} k={t < 1.6 ? p(t, 0.6, 1.2) : p(t, 2, 2.6)} />
      </g>
    );
  } else if (t < 12) {
    grey = p(t, 8, 8.8);
    focus = null;
    side = (
      <g transform="translate(500 110)">
        <Panel t={t} t0={6} title="Colour isn’t a message" lines={['A red border is invisible to Farhan and unclear', 'to many colour-blind people. Take the colour away:', 'which fields are wrong now?']} />
        <text x={0} y={150} fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 9.4, 9.9)}>
          <tspan x={0} dy={0}>Errors must be said in words.</tspan>
          <tspan x={0} dy={23}>(1.4.1 Use of Color, 3.3.1 Error Identification)</tspan>
        </text>
      </g>
    );
  } else if (t < 18) {
    ageTyped = t > 13.6;
    fixed = t > 15.6 ? ['age'] : [];
    focus = box('age');
    const f = fixed.includes('age') ? FIXED_FIELDS.age : RAHI_FIELDS.age;
    side = (
      <g transform="translate(500 110)">
        <Panel t={t} t0={12} title="Labels that stay" lines={['“Age” is a placeholder. Once he types 34, the', 'clue is gone for anyone who looks back. A visible', 'label, tied with <label for>. (3.3.2)']} />
        <Speech x={0} y={110} text={fieldAnnounce(f)} k={p(t, 12.8, 13.3)} />
        <text x={0} y={230} fontSize={14} fontWeight={800} fill={SC.muted} opacity={p(t, 14, 14.5)}>NVDA falls back on the placeholder. Eyes can’t.</text>
      </g>
    );
  } else if (t < 24) {
    const after = t > 20.6;
    fixed = after ? ['age', 'email'] : ['age'];
    focus = box('email');
    side = (
      <g transform="translate(500 110)">
        <Panel t={t} t0={18} title="Errors you can hear" lines={['The message goes in text under the field, linked', 'with aria-describedby, and the field is marked', 'aria-invalid, so NVDA reads it on focus.']} />
        <Speech x={0} y={104} tag="Before" text={fieldAnnounce(RAHI_FIELDS.email)} k={p(t, 18.6, 19.2)} />
        <g opacity={p(t, 20, 20.5)}>
          <text x={0} y={208} fontFamily={MONO} fontSize={10.5} fontWeight={700} fill={RAHI}>{'<input id="email" aria-invalid="true" aria-describedby="email-err">'}</text>
        </g>
        {after && <Speech x={0} y={222} tag="After" text={fieldAnnounce(FIXED_FIELDS.email)} k={p(t, 20.8, 21.8)} w={400} />}
      </g>
    );
  } else if (t < 30) {
    const after = t > 26;
    fixed = after ? ['age', 'email', 'mobile'] : ['age', 'email'];
    focus = box('mobile');
    side = (
      <g transform="translate(500 110)">
        <Panel t={t} t0={24} title="Say how to fix it" lines={['“Invalid input” is heard, but it doesn’t say what', 'valid is. Name what’s expected, with an example.', '(3.3.3 Error Suggestion)']} />
        <Speech x={0} y={104} tag={after ? 'After' : 'Before'} w={400} text={fieldAnnounce(after ? FIXED_FIELDS.mobile : RAHI_FIELDS.mobile)} k={after ? p(t, 26.2, 27.2) : p(t, 24.6, 25.2)} />
        <text x={0} y={262} fontSize={14} fontWeight={800} fill={SC.muted} opacity={p(t, 27.8, 28.3)}>
          <tspan x={0} dy={0}>And UPI’s “Something went wrong” becomes</tspan>
          <tspan x={0} dy={22}>“We couldn’t find farhan@okhdfc. Check it, or pay by card.”</tspan>
        </text>
      </g>
    );
  } else {
    fixed = [...ROWS];
    summary = p(t, 30.4, 30.9);
    focus = t > 30.9 ? { x: 14, y: 54, w: 372, h: 26 } : PAY;
    side = (
      <g transform="translate(500 110)">
        <Panel t={t} t0={30} title="Start at the summary" lines={['After a failed submit, focus moves to a summary', 'with a link to each problem. Everything he', 'typed is still there.']} />
        <Speech x={0} y={110} text="There are 3 problems, heading, level 2" k={p(t, 31, 31.7)} />
      </g>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Farhan presses Pay and three fields turn red while his screen reader says nothing. Without colour the errors disappear; a placeholder label vanishes once typed; errors are rewritten in text, linked to their fields so they are read aloud, say how to fix the problem, and focus moves to a summary of the problems">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro * (1 - fin)} transform={`translate(0 ${lerp(10, 0, intro)})`}>
        <RahiForm x={PX} y={PY} errors={errors} fixed={fixed} focus={focus} ageTyped={ageTyped} summary={summary} grey={grey} />
        {side}
      </g>
      {t >= 33 && (
        <g opacity={fin}>
          <text x={W / 2} y={110} textAnchor="middle" fontSize={26} fontWeight={900} fill={SC.text}>Errors everyone can see and hear</text>
          {[['Labels stay', 'Visible, and tied to the field'], ['In words, linked', 'Text errors, aria-describedby, aria-invalid'], ['Fix, then focus', 'Say what’s expected; start at the summary']].map(([h, b], i) => (
            <g key={h} transform={`translate(${100 + i * 265} 170)`} opacity={p(t, 33.2 + i * 0.4, 33.7 + i * 0.4)}>
              <rect width={240} height={150} rx={18} fill={SC.surface} stroke={RAHI} strokeWidth={2} />
              <text x={20} y={44} fontSize={19} fontWeight={900} fill={SC.text}>{h}</text>
              <text x={20} y={78} fontSize={13} fontWeight={700} fill={SC.muted}>{wrapText(b, 28).map((ln, j) => <tspan key={j} x={20} dy={j ? 20 : 0}>{ln}</tspan>)}</text>
            </g>
          ))}
          <text x={W / 2} y={380} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 34.5, 35)}>It helps Sunita, Kabir, and anyone filling it in on a bumpy bus.</text>
        </g>
      )}
    </svg>
  );
}
