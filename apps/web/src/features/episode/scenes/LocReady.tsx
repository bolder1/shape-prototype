'use client';
// Scene for cw.2-3: Chaabi's rent screen goes to Moumita, its Bengali translator, and comes back broken in ways nobody
// wrote into the Bengali. Strings joined from pieces lock English word order and show “1 repairs open”; Ananya rewrites
// them as whole messages with a plural rule. “We’ve got your back” comes back as a sentence about a spine. Then a
// pseudo-localized build (`pseudoLocalize`, padded to `roomFor`) clips the fixed button and the tabs, joined strings
// show their seams as separate brackets, and dates and rupees are formatted by locale. `LocPhone` draws the screen in
// English or pseudo-locale. Pure function of t (0–36).
import { growthFor, locFlaw, locParse, pseudoLocalize, roomFor, wrapText } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';
import { INK, INK_MUTED } from './EaseCurves';
import { CHAABI, CHAABI_SOFT } from './VoiceTone';

const W = 960, H = 540;
const OVER = '#B42318';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
/** Monospace at 10 px: about 6 px a character, so a box's width in characters is honest. */
const FS = 10, CW = 6;

interface Str { id: string; visual: string; x: number; y: number; kind: 'tab' | 'text' | 'button' | 'banner'; bad?: boolean }
/** The rent screen's strings ("chars|piece|piece…", as in the `loc-spot` game), and where they sit on the phone. */
const SCREEN: Str[] = [
  { id: 'home', visual: '10|Home', x: 14, y: 360, kind: 'tab' },
  { id: 'payments', visual: '10|Payments', x: 86, y: 360, kind: 'tab', bad: true },
  { id: 'repairs', visual: '10|Repairs', x: 158, y: 360, kind: 'tab', bad: true },
  { id: 'due', visual: '35|Rent due in |3| days', x: 14, y: 78, kind: 'text', bad: true },
  { id: 'pay', visual: '16|Pay rent', x: 14, y: 100, kind: 'button' },
  { id: 'paid', visual: '35|Paid to |Mrs Sen', x: 14, y: 158, kind: 'text', bad: true },
  { id: 'count', visual: '35|1| repairs open', x: 14, y: 190, kind: 'text', bad: true },
  { id: 'back', visual: '35|We’ve got your back', x: 14, y: 226, kind: 'banner', bad: true },
  { id: 'raise', visual: '16|Raise a request', x: 14, y: 290, kind: 'button', bad: true },
];
const FIXED: Record<string, string> = {
  due: 'Rent due in 3 days', paid: 'Paid to Mrs Sen', count: '1 repair open', back: 'We’ll help if anything goes wrong',
};

function StringBox({ s, pseudo, fixed, flag }: { s: Str; pseudo: number; fixed: number; flag: number }) {
  const { chars, parts, text } = locParse(s.visual);
  const w = chars * CW + 8, h = s.kind === 'button' ? 28 : s.kind === 'banner' ? 30 : 20;
  const shown = fixed > 0.5 && FIXED[s.id] ? FIXED[s.id] : text;
  const piecewise = fixed <= 0.5 && parts.length > 1;
  const ps = piecewise ? parts.map(pseudoLocalize).join('') : pseudoLocalize(shown);
  const str = pseudo > 0.5 ? ps : shown;
  const clips = pseudo > 0.5 && locFlaw({ chars, parts: [shown] }) === 'room';
  const tooWide = str.length * CW > w - 8;
  const fill = s.kind === 'button' ? CHAABI : s.kind === 'banner' ? CHAABI_SOFT : 'none';
  const ink = s.kind === 'button' ? '#FFFFFF' : s.kind === 'banner' ? CHAABI : INK;
  return (
    <g transform={`translate(${s.x} ${s.y})`}>
      <clipPath id={`loc-${s.id}`}><rect width={w} height={h} rx={6} /></clipPath>
      {fill !== 'none' && <rect width={w} height={h} rx={s.kind === 'tab' ? 6 : 8} fill={fill} />}
      {s.kind === 'tab' && <rect width={w} height={h} rx={6} fill="#F2F4F7" />}
      <g clipPath={clips ? `url(#loc-${s.id})` : undefined}>
        <text x={4} y={h / 2 + 3.5} fontFamily={MONO} fontSize={FS} fontWeight={700} fill={ink}
          {...(tooWide && !clips ? { textLength: w - 8, lengthAdjust: 'spacingAndGlyphs' } : {})}>{str}</text>
      </g>
      {(clips || (flag > 0 && s.bad && fixed < 0.5 && pseudo < 0.5)) && (
        <rect x={-2} y={-2} width={w + 4} height={h + 4} rx={8} fill="none" stroke={OVER} strokeWidth={2} opacity={clips ? 1 : flag} />
      )}
    </g>
  );
}

/** Chaabi's rent screen, 240 × 400: English, pseudo-locale (`pseudo` 1) or after the fixes (`fixed` 1). */
export function LocPhone({ x, y, pseudo = 0, fixed = 0, flag = 0 }: { x: number; y: number; pseudo?: number; fixed?: number; flag?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={240} height={400} rx={30} fill="#FFFFFF" stroke={INK} strokeOpacity={0.15} strokeWidth={2} />
      <rect x={14} y={14} width={212} height={44} rx={14} fill={CHAABI} />
      <text x={30} y={41} fontSize={15} fontWeight={900} fill="#FFFFFF">Chaabi · Rent</text>
      <text x={14} y={146} fontSize={10} fontWeight={800} fill={INK_MUTED}>{fixed > 0.5 ? '5 February' : '05/02'} · {fixed > 0.5 ? '₹18,500' : 'Rs.18500'}</text>
      <text x={14} y={278} fontSize={10} fontWeight={800} fill={INK_MUTED}>Deposit {fixed > 0.5 ? '₹1,00,000' : '₹100,000'}</text>
      {SCREEN.map(s => <StringBox key={s.id} s={s} pseudo={pseudo} fixed={fixed} flag={flag} />)}
    </g>
  );
}

/** A code tile, as the string is built in code. */
function Tile({ x, y, label, code = true, w }: { x: number; y: number; label: string; code?: boolean; w: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={36} rx={8} fill={code ? SC.surface : CHAABI} stroke={SC.line} strokeWidth={2} />
      <text x={w / 2} y={23} textAnchor="middle" fontFamily={MONO} fontSize={13} fontWeight={700} fill={code ? SC.text : '#FFFFFF'}>{label}</text>
    </g>
  );
}

export function LocReadyScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const fin = p(t, 33, 33.6);
  const flag = t < 24 ? p(t, 2.5, 3.2) : 0;
  const pseudo = t >= 24.6 && t < 30 ? 1 : 0;
  const fixed = t >= 30 ? p(t, 30, 30.4) : 0;
  const shake = t > 7.5 && t < 9.5 ? Math.sin(t * 40) * 4 * (1 - p(t, 9, 9.5)) : 0;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Chaabi's rent screen comes back from translation broken; strings joined from pieces lock English word order and show 1 repairs open, an idiom is translated word for word, a pseudo-localized build shows buttons and tabs clipping, and the fixes are whole messages with plural rules, plain meaning, room to grow and locale formats">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro * (1 - fin)}>
        <LocPhone x={70} y={lerp(80, 70, intro)} pseudo={pseudo} fixed={fixed} flag={flag} />

        {t < 6 && (
          <g opacity={p(t, 1, 1.5)}>
            <text x={380} y={120} fontSize={28} fontWeight={900} fill={SC.text}>Off to the Bengali translator</text>
            <text x={380} y={160} fontSize={16} fontWeight={800} fill={SC.muted}>
              <tspan x={380} dy={0}>Moumita can only translate what she’s given.</tspan>
              <tspan x={380} dy={26} fill={SC.error} opacity={p(t, 3, 3.5)}>Seven strings come back broken, and none of the</tspan>
              <tspan x={380} dy={26} fill={SC.error} opacity={p(t, 3, 3.5)}>problems are in the Bengali.</tspan>
            </text>
          </g>
        )}
        {t >= 6 && t < 12 && (
          <g transform="translate(380 110)" opacity={p(t, 6, 6.5)}>
            <text x={0} y={0} fontSize={28} fontWeight={900} fill={SC.text}>Built from pieces</text>
            <text x={0} y={36} fontSize={15} fontWeight={800} fill={SC.muted}>In code, the reminder is three fragments:</text>
            <g transform={`translate(${shake} 56)`}>
              <Tile x={0} y={0} label="“Rent due in ”" w={160} />
              <text x={170} y={24} fontFamily={MONO} fontSize={16} fontWeight={900} fill={SC.muted}>+ 3 +</text>
              <Tile x={230} y={0} label="“ days”" w={90} />
            </g>
            <text x={0} y={130} fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 7.4, 7.9)}>
              <tspan x={0} dy={0}>Bengali and Hindi put the verb at the end, but each</tspan>
              <tspan x={0} dy={24}>fragment is translated alone and stays in English order.</tspan>
            </text>
            <g opacity={p(t, 9.6, 10.1)}>
              <rect x={0} y={190} width={240} height={40} rx={10} fill={SC.surface} stroke={SC.error} strokeWidth={2} />
              <text x={16} y={216} fontFamily={MONO} fontSize={15} fontWeight={700} fill={SC.error}>1 + “ repairs open”</text>
            </g>
          </g>
        )}
        {t >= 12 && t < 18 && (
          <g transform="translate(380 110)" opacity={p(t, 12, 12.5)}>
            <text x={0} y={0} fontSize={28} fontWeight={900} fill={SC.text}>Whole messages</text>
            <rect x={0} y={26} width={500} height={70} rx={12} fill={SC.surface} stroke={CHAABI} strokeWidth={2} />
            <text x={16} y={54} fontFamily={MONO} fontSize={13.5} fontWeight={700} fill={SC.text}>Rent due in {'{days, plural,'}</text>
            <text x={16} y={78} fontFamily={MONO} fontSize={13.5} fontWeight={700} fill={SC.text}>{'  one {# day} other {# days}}'}</text>
            <g opacity={p(t, 13.4, 13.9)}>
              <Tile x={0} y={112} label="Rent due in 1 day" code={false} w={220} />
              <Tile x={236} y={112} label="Rent due in 3 days" code={false} w={230} />
            </g>
            <g opacity={p(t, 15, 15.5)}>
              <text x={0} y={196} fontSize={15} fontWeight={800} fill={SC.muted}>“Paid to {'{name}'}”, one string, so Hindi can move the name first:</text>
              <text x={0} y={234} fontSize={22} fontWeight={800} fill={SC.text}>श्रीमती सेन को भुगतान किया</text>
            </g>
          </g>
        )}
        {t >= 18 && t < 24 && (
          <g transform="translate(380 110)" opacity={p(t, 18, 18.5)}>
            <text x={0} y={0} fontSize={28} fontWeight={900} fill={SC.text}>Idioms don’t travel</text>
            <Tile x={0} y={30} label="We’ve got your back" w={220} />
            <text x={0} y={110} fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 19, 19.5)}>Translated word for word, then back into English:</text>
            <text x={0} y={142} fontSize={20} fontWeight={900} fill={SC.error} opacity={p(t, 19.6, 20.1)}>“We have taken hold of your spine.”</text>
            <g opacity={p(t, 21.2, 21.7)}>
              <text x={0} y={192} fontSize={15} fontWeight={800} fill={SC.muted}>Say what it means:</text>
              <Tile x={0} y={206} label="We’ll help if anything goes wrong with your flat." code={false} w={480} />
            </g>
          </g>
        )}
        {t >= 24 && t < 30 && (
          <g transform="translate(380 110)" opacity={p(t, 24, 24.5)}>
            <text x={0} y={0} fontSize={28} fontWeight={900} fill={SC.text}>Pseudo-localize first</text>
            <text x={0} y={34} fontSize={15} fontWeight={800} fill={SC.muted}>
              <tspan x={0} dy={0}>Accented, padded, bracketed text, before any</tspan>
              <tspan x={0} dy={24}>translator starts. Red boxes can’t grow.</tspan>
            </text>
            <g opacity={p(t, 25.6, 26.1)}>
              {[8, 15, 25, 40].map((len, i) => (
                <g key={len} transform={`translate(0 ${96 + i * 42})`}>
                  <text x={0} y={18} fontSize={14} fontWeight={800} fill={SC.muted}>{['Up to 10 characters', '11 to 20', '21 to 30', '31 to 50'][i]}</text>
                  <rect x={170} y={4} width={len * 5} height={20} rx={5} fill={SC.line} />
                  <rect x={170 + len * 5} y={4} width={lerp(0, (roomFor(len) - len) * 5, p(t, 26 + i * 0.3, 26.8 + i * 0.3))} height={20} rx={5} fill={CHAABI} />
                  <text x={180 + roomFor(len) * 5} y={19} fontSize={14} fontWeight={900} fill={SC.text}>+{Math.round(growthFor(len) * 100)}%</text>
                </g>
              ))}
            </g>
            <text x={0} y={290} fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 27.6, 28.1)}>Short strings grow the most. Joined strings show their seams.</text>
          </g>
        )}
        {t >= 30 && t < 33 && (
          <g transform="translate(380 110)" opacity={p(t, 30, 30.5)}>
            <text x={0} y={0} fontSize={28} fontWeight={900} fill={SC.text}>Formats by locale</text>
            {[['05/02', '5 February'], ['₹100,000', '₹1,00,000'], ['Rs.18500', '₹18,500']].map(([a, b], i) => (
              <g key={a} transform={`translate(0 ${40 + i * 60})`} opacity={p(t, 30.3 + i * 0.4, 30.8 + i * 0.4)}>
                <Tile x={0} y={0} label={a} w={150} />
                <path d="M164 18 h28 m-8 -8 l8 8 l-8 8" fill="none" stroke={SC.muted} strokeWidth={2.5} strokeLinecap="round" />
                <Tile x={206} y={0} label={b} code={false} w={170} />
              </g>
            ))}
            <text x={0} y={244} fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 31.6, 32)}>05/02 is 5 February here and 2 May in the US. The app formats it per language.</text>
          </g>
        )}
      </g>

      {t >= 33 && (
        <g opacity={fin}>
          <text x={W / 2} y={110} textAnchor="middle" fontSize={26} fontWeight={900} fill={SC.text}>Ready to translate</text>
          {[['Whole sentences', 'Placeholders and plural rules, never joined pieces'], ['Plain meaning', 'No idioms to translate word for word'], ['Room to grow', 'Boxes that grow, checked with pseudo-locale']].map(([h, b], i) => (
            <g key={h} transform={`translate(${100 + i * 265} 170)`} opacity={p(t, 33.2 + i * 0.4, 33.7 + i * 0.4)}>
              <rect width={240} height={150} rx={18} fill={SC.surface} stroke={CHAABI} strokeWidth={2} />
              <text x={20} y={44} fontSize={19} fontWeight={900} fill={SC.text}>{h}</text>
              <text x={20} y={78} fontSize={14} fontWeight={700} fill={SC.muted}>
                {wrapText(b, 26).map((ln, j) => <tspan key={j} x={20} dy={j ? 22 : 0}>{ln}</tspan>)}
              </text>
            </g>
          ))}
          <text x={W / 2} y={380} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 34.5, 35)}>Moumita translates the screen in an afternoon.</text>
        </g>
      )}
    </svg>
  );
}
