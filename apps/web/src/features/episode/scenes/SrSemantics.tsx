'use client';
// Scene for ax.2-2: Farhan, who is blind, tabs through Rahi's search screen with NVDA and hears “button”, then nothing
// where the swap icon is. Each control is checked for its name, role and state (`srGap`), and what NVDA says comes
// from `announce`, before and after Arjun's fixes (`fixedControl` over `RAHI_CONTROLS`): native first, names for icons,
// states for switches, menus and booked seats, and a real heading Farhan can jump to with H. `RahiSearch` and
// `Speech` are shared with the Listen to the screen game. Pure function of t (0–36).
import { announce, fixedControl, RAHI_CONTROLS, srGap, wrapText, type RahiControl, type SrControl } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';
import { INK, INK_MUTED } from './EaseCurves';
import { FOCUS, RAHI, RAHI_SOFT, Ring } from './KeyboardFlow';

const W = 960, H = 540;
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
interface Box { x: number; y: number; w: number; h: number }
/** Where each control sits on the 400 × 440 search screen. */
export const CONTROL_BOX: Record<RahiControl | 'from' | 'to', Box> = {
  photo: { x: 12, y: 52, w: 376, h: 56 },
  from: { x: 12, y: 120, w: 150, h: 36 },
  swap: { x: 170, y: 124, w: 28, h: 28 },
  to: { x: 206, y: 120, w: 140, h: 36 },
  search: { x: 352, y: 120, w: 36, h: 36 },
  ac: { x: 12, y: 170, w: 160, h: 30 },
  sort: { x: 182, y: 170, w: 150, h: 30 },
  logo: { x: 24, y: 226, w: 46, h: 46 },
  rules: { x: 290, y: 254, w: 84, h: 20 },
  heading: { x: 12, y: 298, w: 190, h: 26 },
  booked: { x: 74, y: 334, w: 48, h: 32 },
  boarding: { x: 220, y: 298, w: 168, h: 28 },
  pay: { x: 12, y: 380, w: 376, h: 44 },
};
const SEATS = [13, 14, 15, 16, 17, 18];

/** Rahi's search and results screen, 400 × 440. `acOn` shows the switch on. */
export function RahiSearch({ x, y, focus, acOn = false }: { x: number; y: number; focus?: Box | null; acOn?: boolean }) {
  const B = CONTROL_BOX;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={400} height={440} rx={18} fill="#FFFFFF" stroke={INK} strokeOpacity={0.15} strokeWidth={2} />
      <rect width={400} height={40} rx={18} fill={RAHI} /><rect y={22} width={400} height={18} fill={RAHI} />
      <text x={16} y={27} fontSize={16} fontWeight={900} fill="#FFFFFF">Rahi</text>
      <defs>
        <linearGradient id="sr-sunset" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F79009" /><stop offset="1" stopColor="#C11574" /></linearGradient>
      </defs>
      <rect x={B.photo.x} y={B.photo.y} width={B.photo.w} height={B.photo.h} rx={10} fill="url(#sr-sunset)" opacity={0.85} />
      <circle cx={300} cy={92} r={14} fill="#FEF0C7" />
      <rect x={60} y={86} width={90} height={16} rx={5} fill={INK} opacity={0.75} />
      {(['from', 'to'] as const).map(k => (
        <g key={k}>
          <rect x={B[k].x} y={B[k].y} width={B[k].w} height={B[k].h} rx={9} fill="#FFFFFF" stroke={INK} strokeOpacity={0.3} strokeWidth={1.5} />
          <text x={B[k].x + 10} y={B[k].y + 14} fontSize={8.5} fontWeight={700} fill={INK_MUTED}>{k === 'from' ? 'From' : 'To'}</text>
          <text x={B[k].x + 10} y={B[k].y + 29} fontSize={12} fontWeight={800} fill={INK}>{k === 'from' ? 'Pune' : 'Goa'}</text>
        </g>
      ))}
      <circle cx={184} cy={138} r={14} fill={RAHI_SOFT} />
      <path d="M177 134 h14 l-4 -4 M191 142 h-14 l4 4" fill="none" stroke={RAHI} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <rect x={B.search.x} y={B.search.y} width={36} height={36} rx={9} fill={RAHI} />
      <circle cx={368} cy={136} r={7} fill="none" stroke="#FFFFFF" strokeWidth={2.5} /><path d="M373 141 l6 6" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" />
      <rect x={B.ac.x} y={B.ac.y} width={B.ac.w} height={B.ac.h} rx={15} fill={RAHI_SOFT} />
      <rect x={22} y={177} width={30} height={16} rx={8} fill={acOn ? RAHI : '#98A2B3'} /><circle cx={acOn ? 44 : 30} cy={185} r={6} fill="#FFFFFF" />
      <text x={60} y={189} fontSize={11} fontWeight={800} fill={INK}>AC buses only</text>
      <rect x={B.sort.x} y={B.sort.y} width={B.sort.w} height={B.sort.h} rx={15} fill={RAHI_SOFT} />
      <text x={196} y={189} fontSize={11} fontWeight={800} fill={INK}>Sort: Departure</text>
      <path d="M312 182 l5 5 l5 -5" fill="none" stroke={INK} strokeWidth={2} />
      <rect x={12} y={214} width={376} height={70} rx={12} fill="#FFFFFF" stroke={INK} strokeOpacity={0.15} strokeWidth={1.5} />
      <rect x={B.logo.x} y={B.logo.y} width={46} height={46} rx={10} fill="#027A48" />
      <text x={47} y={254} textAnchor="middle" fontSize={15} fontWeight={900} fill="#FFFFFF">KT</text>
      <text x={82} y={240} fontSize={12} fontWeight={900} fill={INK}>Konkan Travels · Sleeper</text>
      <text x={82} y={258} fontSize={10.5} fontWeight={700} fill={INK_MUTED}>9:40 pm → 7:30 am · ₹1,280</text>
      <text x={B.rules.x + 4} y={B.rules.y + 14} fontSize={10.5} fontWeight={800} fill={RAHI} textDecoration="underline">Fare rules</text>
      <text x={B.heading.x} y={B.heading.y + 19} fontSize={16} fontWeight={900} fill={INK}>Choose your seat</text>
      <rect x={B.boarding.x} y={B.boarding.y} width={B.boarding.w} height={B.boarding.h} rx={8} fill="#FFFFFF" stroke={INK} strokeOpacity={0.3} strokeWidth={1.5} />
      <text x={B.boarding.x + 8} y={B.boarding.y + 18} fontSize={9.5} fontWeight={700} fill={INK}>Boarding: Swargate, 9:40 pm</text>
      {SEATS.map((n, i) => (
        <g key={n}>
          <rect x={12 + i * 62} y={334} width={48} height={32} rx={7} fill={n === 14 ? '#D0D5DD' : '#FFFFFF'} stroke={n === 14 ? 'none' : RAHI} strokeWidth={1.5} />
          <text x={36 + i * 62} y={355} textAnchor="middle" fontSize={11} fontWeight={800} fill={n === 14 ? INK_MUTED : RAHI}>{n}</text>
        </g>
      ))}
      <rect x={12} y={380} width={376} height={44} rx={11} fill={RAHI} />
      <text x={200} y={407} textAnchor="middle" fontSize={14} fontWeight={900} fill="#FFFFFF">Pay ₹1,280</text>
      {focus && <Ring b={focus} />}
    </g>
  );
}

/** A speech bubble with what the screen reader says, typed out as `k` goes 0 → 1. Silence shows as a dotted line. */
export function Speech({ x, y, text, k = 1, w = 360, tag = 'NVDA says' }: { x: number; y: number; text: string; k?: number; w?: number; tag?: string }) {
  const shown = text.slice(0, Math.round(text.length * clamp(k)));
  const rows = wrapText(shown || ' ', Math.floor(w / 11));
  const h = Math.max(1, rows.length) * 26 + 46;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} rx={16} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
      <text x={18} y={26} fontSize={12} fontWeight={900} fill={SC.muted} letterSpacing={0.5}>{tag.toUpperCase()}</text>
      {text ? (
        <text x={18} y={56} fontSize={19} fontWeight={800} fill={SC.text}>
          {rows.map((r, i) => <tspan key={i} x={18} dy={i ? 26 : 0}>{r}</tspan>)}
        </text>
      ) : (
        <text x={18} y={56} fontSize={19} fontWeight={800} fill={SC.muted} opacity={clamp(k * 2)}>(silence)</text>
      )}
    </g>
  );
}

const GAP_LABEL = { role: 'Role', name: 'Name', state: 'State' } as const;
/** Name, role and state, ticked or crossed for one control. */
function Triad({ x, y, c, o = 1 }: { x: number; y: number; c: SrControl; o?: number }) {
  const gap = srGap(c);
  const missing = (k: 'role' | 'name' | 'state') => gap === k;
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      {(['name', 'role', 'state'] as const).map((k, i) => {
        const na = k === 'state' && !c.needsState;
        return (
          <g key={k} transform={`translate(${i * 124} 0)`}>
            <rect width={112} height={44} rx={10} fill={SC.surface} stroke={missing(k) ? FOCUS : SC.line} strokeWidth={2} />
            <text x={14} y={28} fontSize={15} fontWeight={900} fill={SC.text}>{GAP_LABEL[k]}</text>
            <text x={96} y={29} textAnchor="end" fontSize={17} fontWeight={900} fill={missing(k) ? FOCUS : na ? SC.muted : '#079455'}>{missing(k) ? '✕' : na ? '–' : '✓'}</text>
          </g>
        );
      })}
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

const C = RAHI_CONTROLS as Record<RahiControl, SrControl>;
/** Cycle through `keys` every `each` seconds from t0. */
const cycle = <T,>(keys: readonly T[], t: number, t0: number, each: number) => {
  const i = Math.min(keys.length - 1, Math.max(0, Math.floor((t - t0) / each)));
  return { key: keys[i], local: Math.max(0, t - t0 - i * each) };
};

export function SrSemanticsScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const fin = p(t, 33, 33.6);
  const PX = 50, PY = 60;
  let focus: Box | null = null, side: React.ReactNode = null, acOn = false;

  if (t < 6) {
    const stops = [{ box: CONTROL_BOX.from, say: 'From, edit, Pune' }, { box: CONTROL_BOX.to, say: 'To, edit, Goa' }, { box: CONTROL_BOX.search, say: announce(C.search) }];
    const { key, local } = cycle(stops, t, 0.6, 1.6);
    focus = t > 0.6 ? key.box : null;
    side = (
      <g transform="translate(500 110)">
        <Panel t={t} t0={0.2} title="“Button.” Which button?" lines={['Farhan tabs through Rahi with NVDA. Tab jumps', 'straight past the swap icon, and the search', 'button has no name.']} />
        {t > 0.6 && <Speech x={0} y={110} text={key.say} k={local / 0.6} />}
        <g opacity={p(t, 4.4, 4.8)}><text x={0} y={250} fontSize={15} fontWeight={800} fill={FOCUS}>The swap icon: no focus, and nothing said.</text></g>
      </g>
    );
  } else if (t < 12) {
    focus = CONTROL_BOX.search;
    side = (
      <g transform="translate(500 110)">
        <Panel t={t} t0={6} title="Name, role, state" lines={['A screen reader reads what the code says: what', 'a control is called, what kind of thing it is,', 'and its condition. (4.1.2 Name, Role, Value)']} />
        <Triad x={0} y={108} c={C.search} o={p(t, 7, 7.5)} />
        <Speech x={0} y={176} text={announce(C.search)} k={p(t, 8, 8.4)} />
        <text x={0} y={300} fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 9.5, 10)}>Role: yes. State: not needed. Name: missing.</text>
      </g>
    );
  } else if (t < 18) {
    const fixed = t > 14.6;
    focus = fixed ? CONTROL_BOX.swap : null;
    const [before, after] = C.swap.code;
    side = (
      <g transform="translate(500 110)">
        <Panel t={t} t0={12} title="Native first" lines={['A div with a click handler has no role, no focus', 'and no Enter key. A <button> has all three.', 'The first rule of ARIA: use the HTML element.']} />
        <g transform="translate(0 100)" opacity={p(t, 12.6, 13)}>
          <rect width={430} height={40} rx={9} fill={SC.surface} stroke={fixed ? SC.line : FOCUS} strokeWidth={2} />
          <text x={12} y={25} fontFamily={MONO} fontSize={11} fontWeight={700} fill={SC.text}>{before}</text>
        </g>
        <g transform="translate(0 150)" opacity={p(t, 14, 14.5)}>
          <rect width={430} height={54} rx={9} fill={SC.surface} stroke={RAHI} strokeWidth={2} />
          {wrapText(after, 60).map((ln, i) => <text key={i} x={12} y={22 + i * 18} fontFamily={MONO} fontSize={11} fontWeight={700} fill={SC.text}>{ln}</text>)}
        </g>
        {fixed && <Speech x={0} y={222} text={announce(fixedControl(C.swap))} k={p(t, 14.8, 15.4)} />}
      </g>
    );
  } else if (t < 24) {
    const { key, local } = cycle(['search', 'logo', 'photo'] as const, t, 18.3, 1.9);
    focus = key === 'photo' ? null : CONTROL_BOX[key];
    const notes = { search: 'aria-label="Search buses"', logo: 'alt="Konkan Travels"', photo: 'alt="", so NVDA skips it' };
    side = (
      <g transform="translate(500 110)">
        <Panel t={t} t0={18} title="Name the icons" lines={['Icon-only buttons get aria-label. Meaningful images', 'get alt text; decoration gets alt="" and silence.', '(1.1.1 Non-text Content)']} />
        <text x={0} y={118} fontFamily={MONO} fontSize={14} fontWeight={800} fill={RAHI}>{notes[key]}</text>
        <Speech x={0} y={136} text={announce(C[key])} k={p(local, 0, 0.3)} tag="Before" w={190} />
        <Speech x={204} y={136} text={announce(fixedControl(C[key]))} k={p(local, 0.6, 1.1)} tag="After" w={230} />
      </g>
    );
  } else if (t < 30) {
    const { key, local } = cycle(['ac', 'sort', 'booked'] as const, t, 24.3, 1.9);
    focus = CONTROL_BOX[key];
    acOn = key === 'ac' && local > 1;
    const attr = { ac: 'aria-checked', sort: 'aria-expanded', booked: 'aria-disabled' };
    side = (
      <g transform="translate(500 110)">
        <Panel t={t} t0={24} title="Say the state" lines={['The AC switch only changed colour. Sort didn’t say', 'it opens a menu. Seat 14 was just grey.', 'States make each change something he can hear.']} />
        <text x={0} y={118} fontFamily={MONO} fontSize={14} fontWeight={800} fill={RAHI}>{attr[key]}</text>
        <Speech x={0} y={136} text={announce(C[key])} k={p(local, 0, 0.3)} tag="Before" w={190} />
        <Speech x={204} y={136} text={announce(fixedControl(C[key]))} k={p(local, 0.6, 1.1)} tag="After" w={230} />
      </g>
    );
  } else {
    const jumped = t > 31;
    focus = jumped ? CONTROL_BOX.heading : CONTROL_BOX.search;
    side = (
      <g transform="translate(500 110)">
        <Panel t={t} t0={30} title="Headings to jump" lines={['“Choose your seat” was bold text. As an <h2>,', 'Farhan presses H and lands on it, the way sighted', 'people skim. (1.3.1 Info and Relationships)']} />
        <g transform="translate(0 100)">
          <rect width={52} height={44} rx={9} fill={jumped ? FOCUS : SC.surface} stroke={SC.line} strokeWidth={2} />
          <text x={26} y={29} textAnchor="middle" fontSize={18} fontWeight={900} fill={jumped ? '#FFFFFF' : SC.text}>H</text>
        </g>
        {jumped && <Speech x={0} y={164} text={announce(fixedControl(C.heading))} k={p(t, 31.1, 31.8)} />}
      </g>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Farhan, who is blind, tabs through Rahi with a screen reader and hears only “button”, and nothing at all for the swap icon. Each control is checked for its name, role and state; a native button, labels for icons, empty alt for decoration, states for the switch, menu and booked seat, and a real heading fix what he hears">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro * (1 - fin)} transform={`translate(0 ${lerp(10, 0, intro)})`}>
        <RahiSearch x={PX} y={PY} focus={focus} acOn={acOn} />
        {side}
      </g>
      {t >= 33 && (
        <g opacity={fin}>
          <text x={W / 2} y={100} textAnchor="middle" fontSize={26} fontWeight={900} fill={SC.text}>What Farhan hears now</text>
          {(['search', 'ac', 'booked', 'rules'] as const).map((k, i) => (
            <g key={k} opacity={p(t, 33.2 + i * 0.35, 33.7 + i * 0.35)}>
              <Speech x={220} y={130 + i * 84} w={520} text={announce(fixedControl(C[k]))} tag={C[k].label} />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
