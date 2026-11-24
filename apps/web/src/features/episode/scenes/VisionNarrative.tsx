'use client';
// Scene for st.2-1: Anil's offsite slide says “Galla will be India’s leading AI-powered retail ecosystem”, and on
// Monday it can't settle a single argument: the GST suite and voice entry both “fit”. Ishita highlights the words
// `visionFlags` finds and they drop out, leaving nothing. Then she writes a narrative as a postcard from 2030: Shabnam's
// struggle today, the future at her counter, and why Galla can get there. The two proposals come back, and now the
// story says yes to one and no to the other. `Postcard`, `PART_FILL` and the Galla colours are shared with the Write
// the postcard from 2030 game. Pure function of t (0–36).
import { VISION_PARTS, visionFlags, wrapText, type VisionPart } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';
import { INK, INK_MUTED } from './EaseCurves';

const W = 960, H = 540;
/** Galla's brick red, the colour of a shop's cash box. White on it is 7.7:1. */
export const GALLA = '#9C2A00';
export const GALLA_SOFT = '#FDEEE6';
/** Colours for the parts of the narrative; white on each passes 4.5:1. */
export const PART_FILL: Record<VisionPart, string> = { today: '#B54708', future: '#155EEF', whyus: '#067647', cut: '#B42318' };
export const PART_NAME: Record<VisionPart, string> = { today: 'Today', future: '2030', whyus: 'Why us', cut: 'Cut' };
export const SLOGAN = 'Galla will be India’s leading AI-powered retail ecosystem.';

/** Story parts of the postcard in order (everything but `cut`). */
export const STORY_PARTS = VISION_PARTS.filter(v => v !== 'cut');

/** A line of text with the words `visionFlags` finds marked: highlighted, then (with `drop` 0–1) fading out. Monospace
 *  widths keep the marks under their words. */
function FlaggedLine({ x, y, text, mark, drop, size = 26 }: { x: number; y: number; text: string; mark: number; drop: number; size?: number }) {
  const cw = size * 0.6;
  const flags = visionFlags(text);
  return (
    <g transform={`translate(${x} ${y})`}>
      {flags.map((f, i) => (
        <rect key={i} x={f.at * cw - 3} y={-size * 0.85} width={f.word.length * cw * clamp(mark * 1.4 - i * 0.2) + 6} height={size * 1.15} rx={4} fill="#FDE272" opacity={1 - drop} />
      ))}
      <text fontSize={size} fontWeight={800} fill={INK} fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
        {splitByFlags(text).map((s, i) => <tspan key={i} opacity={s.flag ? 1 - drop : 1}>{s.text}</tspan>)}
      </text>
    </g>
  );
}
/** `text` cut into runs, each either a flagged word or the text between. */
export const splitByFlags = (text: string) => {
  const out: { text: string; flag: boolean }[] = [];
  let i = 0;
  for (const f of visionFlags(text)) {
    if (f.at > i) out.push({ text: text.slice(i, f.at), flag: false });
    out.push({ text: f.word, flag: true });
    i = f.at + f.word.length;
  }
  if (i < text.length) out.push({ text: text.slice(i), flag: false });
  return out;
};

/** The postcard from 2030: one section per story part, each showing its lines. `show` (0–1 per part) brings sections in. */
export function Postcard({ x, y, w = 520, lines, show }: { x: number; y: number; w?: number; lines: Record<'today' | 'future' | 'whyus', string[]>; show: Record<'today' | 'future' | 'whyus', number> }) {
  const per = Math.floor((w - 60) / 7.4);
  const parts = STORY_PARTS.map(part => ({ part, rows: lines[part as 'today'].flatMap(l => wrapText(l, per)) }));
  const tops = parts.map((_, i) => parts.slice(0, i).reduce((y0, s) => y0 + 26 + s.rows.length * 18 + 16, 62));
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={400} rx={18} fill="#FFFFFF" stroke={INK} strokeOpacity={0.15} strokeWidth={2} />
      <rect x={w - 76} y={16} width={56} height={64} rx={6} fill={GALLA_SOFT} stroke={GALLA} strokeWidth={2} strokeDasharray="4 3" />
      <text x={w - 48} y={53} textAnchor="middle" fontSize={12} fontWeight={900} fill={GALLA}>2030</text>
      <text x={22} y={38} fontSize={15} fontWeight={900} fill={GALLA}>A postcard from Aminabad</text>
      {parts.map(({ part, rows }, n) => {
        const top = tops[n];
        const k = show[part as 'today'];
        return (
          <g key={part} transform={`translate(22 ${top + lerp(10, 0, k)})`} opacity={k}>
            <rect width={70} height={22} rx={11} fill={PART_FILL[part]} />
            <text x={35} y={15.5} textAnchor="middle" fontSize={11.5} fontWeight={900} fill="#FFFFFF">{PART_NAME[part]}</text>
            <text x={0} y={42} fontSize={13} fontWeight={700} fill={INK}>
              {rows.map((r, i) => <tspan key={i} x={0} dy={i ? 18 : 0}>{r}</tspan>)}
            </text>
          </g>
        );
      })}
    </g>
  );
}

const STORY = {
  today: ['Shabnam keeps udhaar for 61 customers in a paper khata: ₹38,000. Every Sunday she adds it up, and she hates asking regulars for money.'],
  future: ['She closes at 9 knowing to the rupee who owes her. Customers pay back before she has to ask, and nobody argues about what they bought.'],
  whyus: ['Galla already holds 40,000 shops’ ledgers, and its team grew up behind counters like hers.'],
};

/** A proposal card with a verdict stamp. */
function Proposal({ x, y, title, verdict, k, stamp }: { x: number; y: number; title: string; verdict: string; k: number; stamp: 'fit' | 'yes' | 'no' }) {
  const fill = stamp === 'no' ? '#B42318' : stamp === 'yes' ? '#067647' : INK_MUTED;
  return (
    <g transform={`translate(${x} ${y + lerp(14, 0, k)})`} opacity={k}>
      <rect width={340} height={92} rx={16} fill="#FFFFFF" stroke={INK} strokeOpacity={0.15} strokeWidth={2} />
      <text x={18} y={34} fontSize={17} fontWeight={900} fill={INK}>{title}</text>
      <rect x={18} y={50} width={Math.max(120, verdict.length * 7.2 + 24)} height={26} rx={13} fill={fill} />
      <text x={30} y={67.5} fontSize={12.5} fontWeight={900} fill="#FFFFFF">{verdict}</text>
    </g>
  );
}

export function VisionNarrativeScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const slide = t < 17 ? 1 - p(t, 16.4, 17) : 0;
  const card = t >= 17 ? p(t, 17, 17.6) : 0;
  const show = { today: p(t, 17.6, 18.4), future: p(t, 23.2, 24), whyus: p(t, 28.2, 29) };
  const props = t >= 6 && t < 12 ? p(t, 6.2, 6.8) * (1 - p(t, 11.4, 12)) : t >= 32 ? p(t, 32.2, 32.8) : 0;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Galla's vision slogan is full of buzzwords and can't settle an argument between two proposals; the empty words are highlighted and removed, then a narrative about Shabnam, a kirana shopkeeper, is written as a postcard from 2030 with her struggle today, her future and why Galla can get there, and it now says yes to voice entry and no to a GST suite">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        {slide > 0 && (
          <g opacity={slide}>
            <rect x={60} y={50} width={840} height={230} rx={14} fill="#FFFFFF" stroke={INK} strokeOpacity={0.15} strokeWidth={2} />
            <rect x={60} y={50} width={840} height={36} rx={14} fill={GALLA} />
            <rect x={60} y={72} width={840} height={14} fill={GALLA} />
            <text x={84} y={74} fontSize={14} fontWeight={900} fill="#FFFFFF">Galla offsite · Our vision</text>
            <FlaggedLine x={84} y={170} text={SLOGAN} size={22} mark={p(t, 12.4, 14)} drop={p(t, 14.6, 15.6)} />
            {t < 6 && <text x={84} y={240} fontSize={16} fontWeight={800} fill={INK_MUTED} opacity={p(t, 2, 2.6)}>The room claps. Everyone agrees with it.</text>}
            {t >= 6 && t < 12 && <text x={84} y={240} fontSize={16} fontWeight={800} fill={INK_MUTED} opacity={p(t, 9, 9.6)}>Monday: both proposals fit. An hour of arguing, no decision.</text>}
            {t >= 12 && (
              <text x={84} y={240} fontSize={16} fontWeight={900} fill={SC.error} opacity={p(t, 15.4, 16)}>Take out the empty words: no person, no problem, no future.</text>
            )}
          </g>
        )}

        {t >= 6 && t < 12 && (
          <g>
            <Proposal x={130} y={320} title="GST billing suite" verdict="Fits the slogan" stamp="fit" k={props} />
            <Proposal x={490} y={320} title="Voice entry in Hindi" verdict="Fits the slogan" stamp="fit" k={props * p(t, 6.6, 7.2)} />
            <text x={480} y={470} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 8, 8.6)}>A vision that every idea fits can’t say no to any of them.</text>
          </g>
        )}

        {card > 0 && (
          <g opacity={card}>
            <Postcard x={400} y={lerp(80, 60, card)} lines={STORY} show={show} />
            {/* the left column: what each part of the story is drawn from */}
            {t < 23 && (
              <g transform="translate(60 100)" opacity={p(t, 18, 18.6)}>
                <rect width={300} height={240} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <rect x={30} y={150} width={240} height={60} rx={8} fill={GALLA_SOFT} stroke={GALLA} strokeWidth={2} />
                <text x={150} y={186} textAnchor="middle" fontSize={14} fontWeight={900} fill={GALLA}>The counter, Aminabad</text>
                <g transform="translate(70 50)">
                  <rect width={160} height={90} rx={6} fill="#FFFFFF" stroke={INK} strokeOpacity={0.3} strokeWidth={2} />
                  <line x1={80} y1={0} x2={80} y2={90} stroke={INK} strokeOpacity={0.3} strokeWidth={2} />
                  {Array.from({ length: 5 }, (_, i) => <line key={i} x1={10} x2={70} y1={18 + i * 14} y2={18 + i * 14} stroke={INK} strokeOpacity={0.25} />)}
                  {Array.from({ length: 5 }, (_, i) => <line key={i} x1={90} x2={150} y1={18 + i * 14} y2={18 + i * 14} stroke={INK} strokeOpacity={0.25} opacity={p(t, 19 + i * 0.3, 19.3 + i * 0.3)} />)}
                </g>
                <text x={150} y={34} textAnchor="middle" fontSize={15} fontWeight={900} fill={SC.text} opacity={p(t, 20, 20.6)}>61 customers · ₹38,000</text>
              </g>
            )}
            {t >= 23 && t < 28 && (
              <g transform="translate(60 100)" opacity={p(t, 23.4, 24)}>
                <rect width={300} height={240} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <circle cx={240} cy={52} r={20} fill="#FDE272" />
                <circle cx={250} cy={46} r={18} fill={SC.surface} />
                <rect x={40} y={90} width={220} height={lerp(20, 120, p(t, 24.4, 25.6))} rx={4} fill={INK_MUTED} />
                {Array.from({ length: 6 }, (_, i) => <line key={i} x1={40} x2={260} y1={100 + i * 18} y2={100 + i * 18} stroke="#FFFFFF" strokeOpacity={0.3} opacity={p(t, 24.4 + i * 0.2, 24.6 + i * 0.2)} />)}
                <text x={150} y={46} textAnchor="middle" fontSize={22} fontWeight={900} fill={SC.text}>9:00 pm</text>
                <text x={150} y={232} textAnchor="middle" fontSize={14} fontWeight={900} fill={SC.text} opacity={p(t, 25.6, 26.2)}>Nothing left to chase</text>
              </g>
            )}
            {t >= 28 && (
              <g transform="translate(60 100)" opacity={p(t, 28.4, 29)}>
                <rect width={300} height={240} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                {Array.from({ length: 80 }, (_, i) => (
                  <circle key={i} cx={34 + (i % 10) * 26} cy={44 + Math.floor(i / 10) * 20} r={6} fill={GALLA} opacity={p(t, 28.6 + i * 0.02, 28.9 + i * 0.02) * 0.85} />
                ))}
                <text x={150} y={222} textAnchor="middle" fontSize={14} fontWeight={900} fill={SC.text}>Each dot: 500 shops’ ledgers</text>
              </g>
            )}
          </g>
        )}

        {t >= 32 && (
          <g>
            <rect x={0} y={0} width={W} height={H} fill={SC.soft} opacity={props * 0.85} />
            <text x={480} y={110} textAnchor="middle" fontSize={26} fontWeight={900} fill={SC.text} opacity={props}>Does it change Shabnam’s story?</text>
            <Proposal x={130} y={180} title="Voice entry in Hindi" verdict="Yes: entries get written in the rush" stamp="yes" k={props} />
            <Proposal x={490} y={180} title="GST billing suite" verdict="Off: it’s for supermarkets" stamp="no" k={p(t, 32.8, 33.4)} />
            <text x={480} y={360} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.muted} opacity={p(t, 34, 34.6)}>A person, a struggle, a future, a reason. Now the vision can say no.</text>
          </g>
        )}
      </g>
    </svg>
  );
}
