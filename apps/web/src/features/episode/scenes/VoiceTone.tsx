'use client';
// Scene for cw.2-1: Chaabi, a Kolkata flat-rental app, tells Tanvir “Uh-oh, your rent took a detour!” when ₹18,500
// fails on the day it’s due: a line copied from the cheeky shortlist screen. Ananya pins down the voice (three traits
// that never change), then the tone dial appears, turned by the moment's mood and stakes (`toneFor`). The needle swings
// through four moments and the phone rewrites each in its tone (`CHAABI_MOMENTS`), ending on the serious version of
// the failed rent. `ChaabiPhone`, `ToneDial` and the tone colours are shared with the Turn the tone dial game.
// Pure function of t (0–36).
import { CHAABI_MOMENTS, TONES, toneFor, wrapText, type ChaabiMoment, type Tone } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';
import { INK, INK_MUTED } from './EaseCurves';

const W = 960, H = 540;
/** Chaabi's teal. White on it is 6.1:1. */
export const CHAABI = '#0E6E6E';
export const CHAABI_SOFT = '#E3F2F1';
/** Tone colours, lightest first; white on each passes 4.5:1. */
export const TONE_FILL: Record<Tone, string> = { playful: '#C11574', warm: '#B54708', plain: '#475467', serious: '#1D2939' };
export const TONE_NAME: Record<Tone, string> = { playful: 'Playful', warm: 'Warm', plain: 'Plain', serious: 'Serious' };
export const MOMENT_TITLE: Record<ChaabiMoment, string> = {
  shortlist: 'Your shortlist', 'move-in': 'Flat 2A, Jadavpur', 'deposit-back': 'Deposit refund', 'no-results': 'Search · Jadavpur',
  kyc: 'Rental agreement', 'photo-failed': 'Repair request', 'rent-failed': 'Rent · ₹18,500', notice: 'Notice from Mrs Sen',
};
export const MOOD_NAME = { good: 'Good news', neutral: 'Routine', bad: 'Bad news' } as const;
export const STAKES_NAME = { low: 'Low stakes', high: 'Money, a home or a deadline' } as const;
export const VOICE = [
  { trait: 'Straight', not: 'not blunt' },
  { trait: 'Neighbourly', not: 'not chummy' },
  { trait: 'Sure', not: 'not bossy' },
];

/** Chaabi's phone, 240 × 400, showing one moment's message in a tone. `pop` (0–1) brings the message in. */
export function ChaabiPhone({ x, y, moment, tone, pop = 1, alarm = false }: { x: number; y: number; moment: ChaabiMoment; tone: Tone; pop?: number; alarm?: boolean }) {
  const line = CHAABI_MOMENTS[moment].lines[tone];
  const rows = wrapText(line, 25);
  const bad = CHAABI_MOMENTS[moment].mood === 'bad';
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={240} height={400} rx={30} fill="#FFFFFF" stroke={INK} strokeOpacity={0.15} strokeWidth={2} />
      <rect x={14} y={14} width={212} height={44} rx={14} fill={CHAABI} />
      <circle cx={36} cy={36} r={9} fill="none" stroke="#FFFFFF" strokeWidth={2.5} /><path d="M45 36 H58 M53 36 V41" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" />
      <text x={68} y={41} fontSize={15} fontWeight={900} fill="#FFFFFF">Chaabi</text>
      <g transform={`translate(14 ${lerp(92, 76, pop)})`} opacity={pop}>
        <rect width={212} height={Math.max(150, 76 + rows.length * 20)} rx={14} fill={bad ? '#FEF3F2' : CHAABI_SOFT} stroke={alarm ? '#B42318' : 'none'} strokeWidth={2} />
        <rect x={14} y={14} width={8} height={8} rx={4} fill={TONE_FILL[tone]} />
        <text x={28} y={22} fontSize={11.5} fontWeight={900} fill={INK_MUTED}>{MOMENT_TITLE[moment]}</text>
        <text x={14} y={48} fontSize={14} fontWeight={700} fill={INK}>
          {rows.map((r, i) => <tspan key={i} x={14} dy={i ? 20 : 0}>{r}</tspan>)}
        </text>
      </g>
      <rect x={14} y={340} width={212} height={40} rx={12} fill={CHAABI} opacity={pop} />
      <text x={120} y={365} textAnchor="middle" fontSize={13} fontWeight={900} fill="#FFFFFF" opacity={pop}>{bad ? 'What can I do?' : 'Continue'}</text>
    </g>
  );
}

/** The tone dial, a half circle of radius `r` centred on (x, y). `at` is the needle's position, 0 (playful) to 3 (serious). */
export function ToneDial({ x, y, r = 120, at, lit }: { x: number; y: number; r?: number; at: number; lit?: Tone }) {
  const ang = (i: number) => (Math.PI * (180 - i * 60)) / 180;
  const a = ang(at);
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M${-r} 0 A${r} ${r} 0 0 1 ${r} 0`} fill="none" stroke={SC.line} strokeWidth={18} strokeLinecap="round" />
      {TONES.map((tone, i) => {
        const nx = Math.cos(ang(i)) * r, ny = -Math.sin(ang(i)) * r;
        const lx = Math.cos(ang(i)) * (r + 44), ly = -Math.sin(ang(i)) * (r + 30);
        return (
          <g key={tone}>
            <circle cx={nx} cy={ny} r={lit === tone ? 14 : 10} fill={TONE_FILL[tone]} />
            <text x={lx} y={ly + 5} textAnchor="middle" fontSize={14} fontWeight={900} fill={lit === tone ? SC.text : SC.muted}>{TONE_NAME[tone]}</text>
          </g>
        );
      })}
      <line x1={0} y1={0} x2={Math.cos(a) * (r - 24)} y2={-Math.sin(a) * (r - 24)} stroke={SC.text} strokeWidth={6} strokeLinecap="round" />
      <circle r={12} fill={SC.text} />
    </g>
  );
}

/** The four moments the needle visits, one tone each. */
const TOUR: ChaabiMoment[] = ['shortlist', 'deposit-back', 'kyc', 'rent-failed'];

export function VoiceToneScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const fin = p(t, 33, 33.6);

  // What the phone shows.
  let moment: ChaabiMoment = 'rent-failed', tone: Tone = 'playful', pop = p(t, 0.4, 1), alarm = t > 2.5 && t < 6;
  let needle = 0;
  if (t >= 6 && t < 11) { moment = 'shortlist'; pop = p(t, 6.2, 6.8); alarm = false; }
  if (t >= 11 && t < 23) { moment = 'shortlist'; alarm = false; pop = 1; needle = lerp(0, 3, p(t, 19, 21)) * (t < 21.5 ? 1 : 1 - p(t, 21.5, 22.5)); }
  if (t >= 23 && t < 29) {
    const i = Math.min(3, Math.floor((t - 23) / 1.5));
    moment = TOUR[i]; tone = toneFor(CHAABI_MOMENTS[moment]);
    needle = lerp(TONES.indexOf(toneFor(CHAABI_MOMENTS[TOUR[Math.max(0, i - 1)]])), i, p(t, 23 + i * 1.5, 23.5 + i * 1.5));
    pop = p(t, 23.1 + i * 1.5, 23.6 + i * 1.5); alarm = false;
  }
  if (t >= 29) { moment = 'rent-failed'; tone = 'serious'; needle = 3; pop = p(t, 29.1, 29.7); alarm = false; }
  const dial = t >= 17 && t < 33 ? p(t, 17, 17.6) : 0;
  const voice = t >= 11 && t < 33 ? p(t, 11, 11.6) : 0;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Chaabi jokes about Tanvir's failed rent payment with a line copied from a happy screen; then its voice is written down as three traits that never change, and a tone dial turned by the mood and stakes of each moment rewrites the same message from playful to serious">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro * (1 - fin)}>
        <ChaabiPhone x={70} y={lerp(80, 70, intro)} moment={moment} tone={tone} pop={pop} alarm={alarm} />

        {t < 6 && (
          <g opacity={p(t, 1.5, 2)}>
            <text x={380} y={120} fontSize={28} fontWeight={900} fill={SC.error}>A joke, on the day rent is due</text>
            <g transform="translate(380 160)">
              <rect width={360} height={70} rx={20} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text x={20} y={30} fontSize={15} fontWeight={800} fill={SC.text}>Tanvir: “Did the ₹18,500 leave my</text>
              <text x={20} y={52} fontSize={15} fontWeight={800} fill={SC.text}>account? Do I pay again?”</text>
            </g>
            <text x={380} y={290} fontSize={16} fontWeight={800} fill={SC.muted} opacity={p(t, 3, 3.5)}>The message doesn’t answer either question.</text>
          </g>
        )}
        {t >= 6 && t < 11 && (
          <g opacity={p(t, 6, 6.5)}>
            <text x={380} y={120} fontSize={28} fontWeight={900} fill={SC.text}>Written for a happy screen</text>
            <text x={380} y={160} fontSize={16} fontWeight={800} fill={SC.muted}>
              <tspan x={380} dy={0}>The shortlist line made people smile.</tspan>
              <tspan x={380} dy={26}>Someone copied its style into the failure.</tspan>
            </text>
            <path d={`M380 260 C 460 ${lerp(260, 300, p(t, 8, 9))} 560 300 640 300`} fill="none" stroke={SC.error} strokeWidth={3} strokeDasharray="8 6" opacity={p(t, 8, 8.5)} />
            <text x={650} y={305} fontSize={15} fontWeight={900} fill={SC.error} opacity={p(t, 8.5, 9)}>→ failed rent</text>
          </g>
        )}

        {voice > 0 && (
          <g transform="translate(380 60)" opacity={voice}>
            <text x={0} y={0} fontSize={13} fontWeight={900} fill={SC.muted} letterSpacing={1.5}>VOICE · NEVER CHANGES</text>
            {VOICE.map((v, i) => (
              <g key={v.trait} transform={`translate(${i * 172} 14)`} opacity={p(t, 11.6 + i * 0.6, 12.1 + i * 0.6)}>
                <rect width={162} height={58} rx={14} fill={CHAABI} />
                <text x={14} y={26} fontSize={17} fontWeight={900} fill="#FFFFFF">{v.trait}</text>
                <text x={14} y={46} fontSize={12.5} fontWeight={700} fill="#FFFFFF">{v.not}</text>
              </g>
            ))}
            {t < 17 && (
              <text x={0} y={130} fontSize={16} fontWeight={800} fill={SC.muted} opacity={p(t, 13.6, 14.2)}>
                <tspan x={0} dy={0}>The same person at a wedding and at a hospital:</tspan>
                <tspan x={0} dy={26}>recognisably themselves, but not saying it the same way.</tspan>
              </text>
            )}
          </g>
        )}

        {dial > 0 && (
          <g opacity={dial}>
            <text x={380} y={180} fontSize={13} fontWeight={900} fill={SC.muted} letterSpacing={1.5}>TONE · SET BY THE MOMENT</text>
            <ToneDial x={620} y={390} r={118} at={needle} lit={t >= 23 ? TONES[Math.round(needle)] : undefined} />
            {t < 23 && (
              <g transform="translate(380 440)" opacity={p(t, 18, 18.6)}>
                <rect width={200} height={34} rx={17} fill={SC.surface} stroke={SC.line} />
                <text x={100} y={22} textAnchor="middle" fontSize={13} fontWeight={900} fill={SC.text}>Mood sets the start</text>
                <rect x={220} width={300} height={34} rx={17} fill={SC.surface} stroke={SC.line} opacity={p(t, 19.5, 20)} />
                <text x={370} y={22} textAnchor="middle" fontSize={13} fontWeight={900} fill={SC.text} opacity={p(t, 19.5, 20)}>Stakes push it one step graver</text>
              </g>
            )}
            {t >= 23 && (
              <g transform="translate(380 440)">
                <rect width={520} height={34} rx={17} fill={SC.surface} stroke={SC.line} />
                <text x={260} y={22} textAnchor="middle" fontSize={13} fontWeight={900} fill={SC.text}>
                  {MOOD_NAME[CHAABI_MOMENTS[moment].mood]} · {CHAABI_MOMENTS[moment].stakes === 'high' ? 'high stakes' : 'low stakes'} → {TONE_NAME[toneFor(CHAABI_MOMENTS[moment])]}
                </text>
              </g>
            )}
          </g>
        )}
      </g>

      {t >= 33 && (
        <g opacity={fin}>
          <text x={W / 2} y={64} textAnchor="middle" fontSize={26} fontWeight={900} fill={SC.text}>One voice, four tones</text>
          {TOUR.map((m, i) => {
            const tn = toneFor(CHAABI_MOMENTS[m]);
            const rows = wrapText(CHAABI_MOMENTS[m].lines[tn], 24);
            return (
              <g key={m} transform={`translate(${60 + i * 216} 100)`} opacity={p(t, 33.2 + i * 0.3, 33.7 + i * 0.3)}>
                <rect width={200} height={300} rx={18} fill={SC.surface} stroke={TONE_FILL[tn]} strokeWidth={3} />
                <rect x={16} y={16} width={84} height={26} rx={13} fill={TONE_FILL[tn]} />
                <text x={58} y={34} textAnchor="middle" fontSize={12.5} fontWeight={900} fill="#FFFFFF">{TONE_NAME[tn]}</text>
                <text x={16} y={66} fontSize={12} fontWeight={900} fill={SC.muted}>{MOMENT_TITLE[m]}</text>
                <text x={16} y={92} fontSize={13} fontWeight={700} fill={SC.text}>
                  {rows.map((r, j) => <tspan key={j} x={16} dy={j ? 19 : 0}>{r}</tspan>)}
                </text>
              </g>
            );
          })}
          <text x={W / 2} y={450} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 34.5, 35)}>Straight, neighbourly and sure in every one. Only the lightness changes.</text>
        </g>
      )}
    </svg>
  );
}
