'use client';
// Scene for ax.2-1: Kabir books Rahi's overnight bus to Goa with only a keyboard. First Tab skips all 36 seats (divs
// with click handlers); then Arjun's fix makes every item a stop and the focus ring races through 62 presses,
// vanishing into the closed mobile menu. Meera makes the dates and seats one stop each with arrow keys inside, adds a
// skip link, takes focus off things that do nothing, and Pay is 10 presses away (`tabPresses` over `RAHI_PARTS`). The
// boarding point dialog takes focus in, keeps it, and gives it back on Esc. `RahiPage` and the Rahi colours are
// shared with the Plan the Tab path game. Pure function of t (0–36).
import { RAHI_PARTS, stopsOf, tabPresses, wrapText, type KeyWay, type RahiPart } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';
import { INK, INK_MUTED } from './EaseCurves';

const W = 960, H = 540;
/** Rahi's indigo. White on it is 8.1:1. */
export const RAHI = '#3538CD';
export const RAHI_SOFT = '#EEF0FB';
/** The focus ring: 5.5:1 on white, well over the 3:1 a focus indicator needs. */
export const FOCUS = '#C4320A';
export const PART_KEYS = Object.keys(RAHI_PARTS) as RahiPart[];
export type Ways = Record<RahiPart, KeyWay>;
export const GOOD_WAYS = Object.fromEntries(PART_KEYS.map(k => [k, RAHI_PARTS[k].way])) as Ways;
/** Arjun's first build: seats are divs, so the keyboard can't reach them; there's no skip link. */
export const DIV_WAYS: Ways = { ...GOOD_WAYS, skip: 'none', dates: 'tab', seats: 'none' };
/** Arjun's fix: tabindex="0" on everything that looks clickable. */
export const ALL_WAYS: Ways = Object.fromEntries(PART_KEYS.map(k => [k, k === 'skip' ? 'none' : 'tab'])) as Ways;
export const pressesToPay = (ways: Ways) => tabPresses(PART_KEYS.map(k => ({ n: RAHI_PARTS[k].n, way: ways[k] })), PART_KEYS.indexOf('pay'));

interface Box { x: number; y: number; w: number; h: number }
const SEAT = (i: number): Box => ({ x: 168 + (i % 6) * 36, y: 104 + Math.floor(i / 6) * 27, w: 30, h: 21 });
/** Where each item of each part sits on the 400 × 440 page. */
export const ITEMS: Record<RahiPart, Box[]> = {
  skip: [{ x: 8, y: 6, w: 116, h: 28 }],
  nav: Array.from({ length: 5 }, (_, i) => ({ x: 104 + i * 50, y: 12, w: 44, h: 16 })),
  menu: Array.from({ length: 6 }, () => ({ x: 360, y: 8, w: 30, h: 24 })),
  dates: Array.from({ length: 7 }, (_, i) => ({ x: 12 + i * 54, y: 54, w: 48, h: 34 })),
  art: [{ x: 12, y: 104, w: 140, h: 74 }],
  seats: Array.from({ length: 36 }, (_, i) => SEAT(i)),
  legend: Array.from({ length: 3 }, (_, i) => ({ x: 12 + i * 92, y: 272, w: 86, h: 18 })),
  boarding: [{ x: 12, y: 302, w: 376, h: 34 }],
  fare: [{ x: 12, y: 346, w: 376, h: 22 }],
  pay: [{ x: 12, y: 380, w: 376, h: 44 }],
};
export const BOOKED = new Set([2, 3, 8, 14, 15, 21, 26, 33]);
/** The item an arrow-key group's single Tab stop lands on (the chosen date, the first free seat). */
const ENTRY: Partial<Record<RahiPart, number>> = { dates: 0, seats: 0 };
/** Every Tab stop on the page, in order, with the part it belongs to. */
export const stopsFor = (ways: Ways) => PART_KEYS.flatMap(k => {
  const w = ways[k];
  if (w === 'none') return [];
  return (w === 'arrows' ? [ITEMS[k][ENTRY[k] ?? 0]] : ITEMS[k]).map(b => ({ ...b, part: k }));
});

/** A focus ring around a box. `ghost` draws it dashed: focus is on something you can't see. */
export function Ring({ b, pad = 4, ghost = false, o = 1 }: { b: Box; pad?: number; ghost?: boolean; o?: number }) {
  return <rect x={b.x - pad} y={b.y - pad} width={b.w + pad * 2} height={b.h + pad * 2} rx={8} fill="none" stroke={FOCUS} strokeWidth={3.5} strokeDasharray={ghost ? '6 5' : undefined} opacity={o} />;
}

/** Rahi's seat page, 400 × 440. `ways` decides which parts show their Tab stops as numbered badges (`numbers`);
 *  `picked` is the chosen seat; `dim` fades parts the keyboard can't reach. */
export function RahiPage({ x, y, ways, numbers = false, picked = -1, focus, dim = [], skipShown = false, ghostMenu = false }: {
  x: number; y: number; ways?: Ways; numbers?: boolean; picked?: number; focus?: Box | null; dim?: RahiPart[]; skipShown?: boolean; ghostMenu?: boolean;
}) {
  const stops = ways ? stopsFor(ways) : [];
  const o = (k: RahiPart) => (dim.includes(k) ? 0.35 : 1);
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={400} height={440} rx={18} fill="#FFFFFF" stroke={INK} strokeOpacity={0.15} strokeWidth={2} />
      <rect width={400} height={40} rx={18} fill={RAHI} /><rect y={22} width={400} height={18} fill={RAHI} />
      <text x={16} y={27} fontSize={16} fontWeight={900} fill="#FFFFFF">Rahi</text>
      {['Home', 'Bookings', 'Offers', 'Help', 'Account'].map((l, i) => (
        <text key={l} x={ITEMS.nav[i].x + 22} y={25} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#FFFFFF" opacity={o('nav')}>{l}</text>
      ))}
      <path d="M366 14 h18 M366 20 h18 M366 26 h18" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" />
      {ITEMS.dates.map((b, i) => (
        <g key={i} opacity={o('dates')}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={9} fill={i === 0 ? RAHI : RAHI_SOFT} />
          <text x={b.x + b.w / 2} y={b.y + 14} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={i === 0 ? '#FFFFFF' : INK_MUTED}>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</text>
          <text x={b.x + b.w / 2} y={b.y + 27} textAnchor="middle" fontSize={11} fontWeight={900} fill={i === 0 ? '#FFFFFF' : INK}>{14 + i}</text>
        </g>
      ))}
      <g opacity={o('art')}>
        <rect x={12} y={104} width={140} height={74} rx={10} fill={RAHI_SOFT} />
        <rect x={26} y={120} width={110} height={40} rx={8} fill={RAHI} opacity={0.85} />
        {[0, 1, 2, 3].map(i => <rect key={i} x={34 + i * 25} y={127} width={18} height={12} rx={2} fill="#FFFFFF" opacity={0.85} />)}
        <circle cx={48} cy={162} r={7} fill={INK} /><circle cx={114} cy={162} r={7} fill={INK} />
      </g>
      <text x={12} y={196} fontSize={9.5} fontWeight={700} fill={INK_MUTED}>Pune → Goa · Sleeper</text>
      <text x={12} y={212} fontSize={9.5} fontWeight={700} fill={INK_MUTED}>Departs 9:40 pm</text>
      <g opacity={o('seats')}>
        <rect x={160} y={96} width={228} height={168} rx={12} fill="none" stroke={INK} strokeOpacity={0.12} strokeWidth={1.5} />
        {ITEMS.seats.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={5} fill={i === picked ? RAHI : BOOKED.has(i) ? '#D0D5DD' : '#FFFFFF'} stroke={BOOKED.has(i) ? 'none' : RAHI} strokeWidth={1.5} />
            <text x={b.x + b.w / 2} y={b.y + 14.5} textAnchor="middle" fontSize={8.5} fontWeight={800} fill={i === picked ? '#FFFFFF' : BOOKED.has(i) ? INK_MUTED : RAHI}>{i + 1}</text>
          </g>
        ))}
      </g>
      <g opacity={o('legend')}>
        {['Available', 'Booked', 'Ladies'].map((l, i) => (
          <g key={l}>
            <rect x={ITEMS.legend[i].x} y={276} width={12} height={10} rx={3} fill={i === 1 ? '#D0D5DD' : '#FFFFFF'} stroke={i === 1 ? 'none' : i === 2 ? '#C11574' : RAHI} strokeWidth={1.5} />
            <text x={ITEMS.legend[i].x + 18} y={285} fontSize={9.5} fontWeight={700} fill={INK_MUTED}>{l}</text>
          </g>
        ))}
      </g>
      <g opacity={o('boarding')}>
        <rect x={12} y={302} width={376} height={34} rx={9} fill="#FFFFFF" stroke={INK} strokeOpacity={0.3} strokeWidth={1.5} />
        <text x={24} y={323} fontSize={11} fontWeight={700} fill={INK}>Boarding point: Swargate, 9:40 pm</text>
        <path d="M368 316 l5 5 l5 -5" fill="none" stroke={INK_MUTED} strokeWidth={2} />
      </g>
      <text x={12} y={361} fontSize={10} fontWeight={700} fill={INK_MUTED} opacity={o('fare')}>Fare ₹1,180 · GST and fees ₹100</text>
      <rect x={12} y={380} width={376} height={44} rx={11} fill={RAHI} opacity={o('pay')} />
      <text x={200} y={407} textAnchor="middle" fontSize={14} fontWeight={900} fill="#FFFFFF" opacity={o('pay')}>Pay ₹1,280</text>
      {skipShown && (
        <g>
          <rect {...pick(ITEMS.skip[0])} rx={7} fill="#FFFFFF" stroke={RAHI} strokeWidth={2} />
          <text x={66} y={24} textAnchor="middle" fontSize={10.5} fontWeight={800} fill={RAHI}>Skip to seats</text>
        </g>
      )}
      {numbers && stops.map((s, i) => (
        <g key={i} transform={`translate(${s.x + s.w - 6} ${s.y - 6})`}>
          <circle r={8.5} fill={s.part === 'menu' ? '#FFFFFF' : FOCUS} stroke={FOCUS} strokeWidth={1.5} />
          <text y={3.5} textAnchor="middle" fontSize={i + 1 > 9 ? 7.5 : 9} fontWeight={900} fill={s.part === 'menu' ? FOCUS : '#FFFFFF'}>{i + 1}</text>
        </g>
      ))}
      {focus && <Ring b={focus} ghost={ghostMenu} />}
    </g>
  );
}
const pick = (b: Box) => ({ x: b.x, y: b.y, width: b.w, height: b.h });

function Key({ x, y, label, lit = 0, w = 44 }: { x: number; y: number; label: string; lit?: number; w?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={40} rx={8} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
      <rect width={w} height={40} rx={8} fill={FOCUS} opacity={lit * 0.9} />
      <text x={w / 2} y={26} textAnchor="middle" fontSize={15} fontWeight={900} fill={lit > 0.5 ? '#FFFFFF' : SC.text}>{label}</text>
    </g>
  );
}

function Panel({ title, lines, t0, t }: { title: string; lines: string[]; t0: number; t: number }) {
  return (
    <g opacity={p(t, t0, t0 + 0.5)}>
      <text x={0} y={0} fontSize={27} fontWeight={900} fill={SC.text}>{title}</text>
      <text x={0} y={38} fontSize={15} fontWeight={800} fill={SC.muted}>
        {lines.map((l, i) => <tspan key={i} x={0} dy={i ? 24 : 0}>{l}</tspan>)}
      </text>
    </g>
  );
}

function Counter({ n, label, t, t0 }: { n: number; label: string; t: number; t0: number }) {
  return (
    <g opacity={p(t, t0, t0 + 0.4)}>
      <text x={0} y={0} fontSize={64} fontWeight={900} fill={FOCUS} style={{ fontVariantNumeric: 'tabular-nums' }}>{n}</text>
      <text x={0} y={28} fontSize={15} fontWeight={800} fill={SC.muted}>{label}</text>
    </g>
  );
}

/** Focus walking through `stops` from t0 at `rate` presses a second: the current stop and how many presses so far. */
const walk = <T,>(stops: T[], t: number, t0: number, rate: number) => {
  const n = clamp((t - t0) * rate / Math.max(1, stops.length)) * stops.length;
  const i = Math.min(stops.length - 1, Math.floor(n));
  return { stop: t < t0 ? null : stops[i], presses: t < t0 ? 0 : i + 1 };
};

export function KeyboardFlowScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const fin = p(t, 33, 33.6);
  const PX = 60, PY = 60;
  let page: React.ReactNode = null, side: React.ReactNode = null;

  if (t < 6) {
    const { stop, presses } = walk(stopsFor(DIV_WAYS), t, 1, 3);
    const skipped = stop?.part === 'boarding' || stop?.part === 'pay';
    page = <RahiPage x={PX} y={PY} focus={stop} dim={skipped ? ['seats'] : []} />;
    side = (
      <g transform="translate(520 120)">
        <Panel t={t} t0={0.2} title="Tab skips the seats" lines={['Kabir has a tremor, so he books with the keyboard.', 'The seats are divs with click handlers:', 'no key can reach them. (2.1.1 Keyboard)']} />
        <g transform="translate(0 170)"><Counter t={t} t0={1} n={presses} label="Tab presses" /></g>
        <g transform="translate(0 240)"><Key x={0} y={0} label="Tab" w={70} lit={t > 1 && (t * 3) % 1 < 0.4 ? 1 : 0} /></g>
      </g>
    );
  } else if (t < 12) {
    const stops = stopsFor(ALL_WAYS);
    const { stop, presses } = walk(stops, t, 6.8, 15);
    page = <RahiPage x={PX} y={PY} focus={stop} ghostMenu={stop?.part === 'menu'} />;
    side = (
      <g transform="translate(520 120)">
        <Panel t={t} t0={6} title={`${pressesToPay(ALL_WAYS)} presses to Pay`} lines={['Arjun adds tabindex="0" to everything that looks', 'clickable. Every seat, every chip, the illustration,', 'and six links in a menu nobody can see.']} />
        <g transform="translate(0 170)"><Counter t={t} t0={6.8} n={presses} label="Tab presses" /></g>
        {stop?.part === 'menu' && <text x={0} y={250} fontSize={16} fontWeight={900} fill={FOCUS}>Focus is in the closed menu. Where did it go?</text>}
      </g>
    );
  } else if (t < 18) {
    const path = [0, 1, 4, 10, 11];
    const k = Math.min(path.length - 1, Math.floor(Math.max(0, t - 13.4) / 0.7));
    const seat = t < 13 ? 0 : path[k];
    const picked = t > 16.6 ? 11 : -1;
    const keys = ['→', '→', '↓', '→', 'Space'];
    page = <RahiPage x={PX} y={PY} focus={t < 13 ? ITEMS.dates[0] : SEAT(seat)} picked={picked} />;
    side = (
      <g transform="translate(520 120)">
        <Panel t={t} t0={12} title="One stop, arrows inside" lines={['Tab lands on the seat map once. The arrow keys', 'move from seat to seat, and Space picks one.', 'Booked seats are passed over. The dates work the same.']} />
        <g transform="translate(0 150)">
          {keys.map((l, i) => <Key key={i} x={i * 56} y={0} label={l} w={l === 'Space' ? 84 : 44} lit={t >= 13.4 + i * 0.7 && t < 14.1 + i * 0.7 + (i === 4 ? 2 : 0) ? 1 : 0.0} />)}
        </g>
        <text x={0} y={240} fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 16.6, 17)}>Seat 12, window, picked. 36 stops became 1.</text>
      </g>
    );
  } else if (t < 24) {
    const jumped = t > 20.6;
    page = <RahiPage x={PX} y={PY} skipShown={!jumped} focus={jumped ? ITEMS.seats[0] : t > 18.6 ? ITEMS.skip[0] : null} picked={11} />;
    side = (
      <g transform="translate(520 120)">
        <Panel t={t} t0={18} title="Skip the header" lines={['The first Tab shows “Skip to seats”. One Enter', 'jumps past the header links and the dates,', 'on every visit. (2.4.1 Bypass Blocks)']} />
        <g transform="translate(0 150)">
          <Key x={0} y={0} label="Tab" w={70} lit={t > 18.6 && t < 19.6 ? 1 : 0} />
          <Key x={86} y={0} label="Enter" w={84} lit={t > 20.2 && t < 21.2 ? 1 : 0} />
        </g>
        <text x={0} y={240} fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 21, 21.5)}>Two presses to the seats, instead of eight.</text>
      </g>
    );
  } else if (t < 30) {
    const stops = stopsFor(GOOD_WAYS);
    const { stop, presses } = walk(stops, t, 24.8, 2.2);
    page = <RahiPage x={PX} y={PY} ways={GOOD_WAYS} numbers={t > 24.4} focus={stop} picked={11} skipShown={stop?.part === 'skip'} dim={['menu', 'art', 'legend', 'fare']} />;
    side = (
      <g transform="translate(520 120)">
        <Panel t={t} t0={24} title="Order follows the page" lines={['Tab goes in reading order because the code is', 'in reading order. No positive tabindex, and things', 'that do nothing take no stop. (2.4.3 Focus Order)']} />
        <g transform="translate(0 170)"><Counter t={t} t0={24.8} n={presses} label="Tab presses to Pay" /></g>
        <text x={0} y={250} fontSize={18} fontWeight={900} fill={SC.text} opacity={p(t, 29, 29.4)}>{pressesToPay(ALL_WAYS)} → {pressesToPay(GOOD_WAYS)}</text>
      </g>
    );
  } else {
    const inDialog = t > 30.6 && t < 32.4;
    const opts = [{ x: 100, y: 190, w: 200, h: 30 }, { x: 100, y: 226, w: 200, h: 30 }, { x: 100, y: 262, w: 200, h: 30 }, { x: 236, y: 304, w: 64, h: 28 }];
    const k = Math.floor(Math.max(0, t - 30.8) / 0.4) % opts.length;
    page = (
      <g>
        <RahiPage x={PX} y={PY} picked={11} focus={inDialog ? null : ITEMS.boarding[0]} dim={inDialog ? PART_KEYS : []} />
        {inDialog && (
          <g transform={`translate(${PX} ${PY})`}>
            <rect x={84} y={140} width={232} height={206} rx={14} fill="#FFFFFF" stroke={INK} strokeOpacity={0.2} strokeWidth={2} />
            <text x={100} y={172} fontSize={13} fontWeight={900} fill={INK}>Boarding point</text>
            {['Swargate, 9:40 pm', 'Katraj, 10:05 pm', 'Hinjewadi, 9:10 pm'].map((l, i) => (
              <g key={l}><rect {...pick(opts[i])} rx={7} fill={RAHI_SOFT} /><text x={112} y={opts[i].y + 19} fontSize={10.5} fontWeight={700} fill={INK}>{l}</text></g>
            ))}
            <rect {...pick(opts[3])} rx={7} fill={RAHI} /><text x={268} y={322} textAnchor="middle" fontSize={11} fontWeight={900} fill="#FFFFFF">Done</text>
            <Ring b={opts[k]} />
          </g>
        )}
      </g>
    );
    side = (
      <g transform="translate(520 120)">
        <Panel t={t} t0={30} title="In, around, and back" lines={['The dialog takes focus in and Tab cycles inside it.', 'Esc closes it, and focus goes back to the button', 'that opened it. (2.1.2 No Keyboard Trap)']} />
        <g transform="translate(0 150)">
          <Key x={0} y={0} label="Tab" w={70} lit={inDialog && (t * 2.5) % 1 < 0.4 ? 1 : 0} />
          <Key x={86} y={0} label="Esc" w={70} lit={t > 32.2 && t < 33 ? 1 : 0} />
        </g>
      </g>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Kabir books a bus with only a keyboard. Tab first skips the seat map entirely, then a fix that makes every item a Tab stop takes 62 presses to reach Pay, including stops in a hidden menu. One Tab stop per group with arrow keys inside, a skip link and reading order bring it to 10, and a dialog takes focus in and returns it on Esc">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro * (1 - fin)} transform={`translate(0 ${lerp(10, 0, intro)})`}>
        {page}
        {side}
      </g>
      {t >= 33 && (
        <g opacity={fin}>
          <text x={W / 2} y={110} textAnchor="middle" fontSize={26} fontWeight={900} fill={SC.text}>Draw the path</text>
          {[['Everything by keyboard', 'Native buttons, or real key handling'], ['One stop per group', 'Tab in, arrows inside, Tab out'], ['In, around, back', 'Dialogs hold focus and return it']].map(([h, b], i) => (
            <g key={h} transform={`translate(${100 + i * 265} 170)`} opacity={p(t, 33.2 + i * 0.4, 33.7 + i * 0.4)}>
              <rect width={240} height={150} rx={18} fill={SC.surface} stroke={RAHI} strokeWidth={2} />
              <text x={20} y={44} fontSize={18} fontWeight={900} fill={SC.text}>{h}</text>
              <text x={20} y={80} fontSize={14} fontWeight={700} fill={SC.muted}>{wrapText(b, 26).map((ln, j) => <tspan key={j} x={20} dy={j ? 21 : 0}>{ln}</tspan>)}</text>
            </g>
          ))}
          <text x={W / 2} y={380} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 34.5, 35)}>
            Pay in {pressesToPay(GOOD_WAYS)} presses, not {pressesToPay(ALL_WAYS)}. Meera adds the focus order to the design file.
          </text>
        </g>
      )}
    </svg>
  );
}

/** Tab stops each part adds under `ways` (for the game's running count). */
export const partStops = (k: RahiPart, way: KeyWay) => stopsOf({ n: RAHI_PARTS[k].n, way });
