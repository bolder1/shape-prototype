'use client';
// Scene for br.2-1: Kabir wants his gradient sunset by Friday; Ishita starts from Sukoon's platform. Traits become
// words, words become forty thumbnails, three go on the wall (`SUKOON_MARKS` mandala, dusk, breath). At 16 px the
// mandala smudges (its strokes are under a pixel, `markPx`), in one colour the sunset is a blob, and beside the
// category's lotuses and ensōs the half-sun stands apart. It ends refined and locked up with the name, its clear space
// drawn in suns. Pure function of t (0–36). Also exports the mark drawings and Sukoon's colours for the br.2 games.
import { useId } from 'react';
import { ICON_PX, MARK_BOX, SUKOON_GUIDE, SUKOON_MARKS, markPx, markVerdict, type SukoonMark } from '@shape/content';
import { back, clamp, Grid, p, SC } from './shared';

export const SUKOON = SUKOON_GUIDE.palette;
export const VIOLET = '#6E4AA8';
const W = 960, H = 540;
const RED = '#B42318', GREEN = '#067647';

/** One of Sukoon's candidate marks on a 96-unit square, drawn from its numbers. `mono` paints it in one flat colour;
 *  `blur` (box units) smears it like a screen does at small sizes. */
export function MarkArt({ k, mono, blur = 0, x = 0, y = 0, size = 96 }: { k: SukoonMark | 'head'; mono?: string; blur?: number; x?: number; y?: number; size?: number }) {
  const id = useId().replace(/:/g, '');
  const sage = mono ?? SUKOON.sage;
  const thin = k === 'head' ? 8 : SUKOON_MARKS[k].thin;
  let art: React.ReactNode;
  switch (k) {
    case 'mandala':
      art = <g fill="none" stroke={sage} strokeWidth={thin}>{Array.from({ length: 24 }, (_, i) => <ellipse key={i} cx={48} cy={28} rx={6} ry={18} transform={`rotate(${i * 15} 48 48)`} />)}<circle cx={48} cy={48} r={8} /></g>;
      break;
    case 'rays':
      art = <g stroke={sage} strokeWidth={3} strokeLinecap="round"><circle cx={48} cy={48} r={13} fill={sage} stroke="none" />{Array.from({ length: 16 }, (_, i) => { const a = (i * Math.PI) / 8; return <line key={i} x1={48 + 20 * Math.cos(a)} y1={48 + 20 * Math.sin(a)} x2={48 + 44 * Math.cos(a)} y2={48 + 44 * Math.sin(a)} />; })}</g>;
      break;
    case 'dusk':
      art = (
        <g>
          {!mono && <defs><linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={SUKOON.peach} /><stop offset="1" stopColor={VIOLET} /></linearGradient></defs>}
          <circle cx={48} cy={48} r={36} fill={mono ?? `url(#g${id})`} />
        </g>
      );
      break;
    case 'overlap':
      art = mono
        ? <g fill={mono}><circle cx={36} cy={48} r={26} /><circle cx={60} cy={48} r={26} /></g>
        : <g><circle cx={36} cy={48} r={26} fill={SUKOON.sage} /><circle cx={60} cy={48} r={26} fill={SUKOON.peach} opacity={0.8} /><path d="M48 25.2 A26 26 0 0 1 48 70.8 A26 26 0 0 1 48 25.2 Z" fill="#A6735F" /></g>;
      break;
    case 'lotus':
      art = <g fill={sage}>{[-56, -28, 0, 28, 56].map(r => <path key={r} d="M48 76 C36 60 38 36 48 22 C58 36 60 60 48 76 Z" transform={`rotate(${r} 48 76)`} opacity={r ? 0.9 : 1} />)}<rect x={20} y={78} width={56} height={thin} rx={4} /></g>;
      break;
    case 'enso':
      art = <path d="M66 20 A32 32 0 1 0 78 40" fill="none" stroke={sage} strokeWidth={thin} strokeLinecap="round" />;
      break;
    case 'breath':
      art = <g fill={sage}><path d="M20 60 A28 28 0 0 1 76 60 Z" /><rect x={16} y={66} width={64} height={thin} rx={thin / 2} /></g>;
      break;
    case 'pause':
      art = <path d="M66 26 C58 16 30 18 32 34 C34 48 64 46 64 62 C64 78 38 80 30 70" fill="none" stroke={sage} strokeWidth={thin} strokeLinecap="round" />;
      break;
    case 'head':
      art = <g fill={sage}><circle cx={48} cy={48} r={42} opacity={0.25} /><circle cx={48} cy={38} r={14} /><path d="M24 80 C26 60 70 60 72 80 Z" /></g>;
      break;
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${size / MARK_BOX})`}>
      {blur > 0 && <defs><filter id={`b${id}`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={blur} /></filter></defs>}
      <g filter={blur > 0 ? `url(#b${id})` : undefined}>{art}</g>
    </g>
  );
}
/** How a mark looks at 16 px, drawn large: blurred by half a pixel of the icon. */
export const ICON_BLUR = MARK_BOX / ICON_PX / 2;

const SHORT: SukoonMark[] = ['mandala', 'dusk', 'breath'];
const WORDS = [
  { trait: 'Calm', words: ['still water', 'dusk', 'a slow breath out'] },
  { trait: 'Warm', words: ['sunlight', 'hands', 'a cup of chai'] },
  { trait: 'Expert', words: ['precise', 'steady', 'one clean line'] },
  { trait: 'Five minutes', words: ['a pause', 'a short arc', 'a horizon'] },
];
const THUMBS: SukoonMark[] = ['lotus', 'rays', 'enso', 'mandala', 'dusk', 'pause', 'overlap', 'breath'];

export function LogoProcessScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const ink = SUKOON.ink;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Ishita designs Sukoon's logo. She turns the traits calm, warm and expert into words, sketches forty thumbnails, and shortlists a fine-line mandala, a gradient sunset and a half-sun over a line. At ${ICON_PX} px the mandala's ${SUKOON_MARKS.mandala.thin}-unit strokes are ${markPx(SUKOON_MARKS.mandala.thin).toFixed(2)} px and smudge; in one colour the sunset is a plain circle; beside the category's lotuses and ensō circles the half-sun stands apart. It is refined and locked up with the name Sukoon, with clear space the height of the sun.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>
          {t < 6 ? '“A logo by Friday”' : t < 11 ? 'Words before shapes' : t < 16 ? 'Forty thumbnails' : t < 21 ? 'Three on the wall' : t < 26 ? 'Test them small' : t < 31 ? 'Beside the rivals' : 'Refine, then lock up'}
        </text>

        {t < 6 && (
          <g transform="translate(80 100)">
            <g opacity={p(t, 0.2, 0.8)}>
              <rect width={200} height={360} rx={28} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <MarkArt k="dusk" x={40} y={90} size={120} />
              <text x={100} y={260} textAnchor="middle" fontSize={14} fontWeight={800} fill={SC.muted}>saved_logo_idea.png</text>
              <text x={100} y={300} textAnchor="middle" fontSize={14} fontWeight={800} fill={SC.text}>Kabir: “This, by Friday?”</text>
            </g>
            <g opacity={p(t, 2.4, 3)} transform="translate(300 40)">
              <rect width={480} height={250} rx={16} fill={SC.surface} stroke={SC.line} />
              <text x={24} y={40} fontSize={15} fontWeight={900} fill={SC.muted}>SUKOON · BRAND PLATFORM</text>
              <text x={24} y={84} fontSize={18} fontWeight={800} fill={SC.text}>For busy professionals who can’t switch off,</text>
              <text x={24} y={112} fontSize={18} fontWeight={800} fill={SC.text}>calm in five minutes.</text>
              {['Calm', 'Warm', 'Expert'].map((tr, i) => (
                <g key={tr} transform={`translate(${24 + i * 140} 150)`} opacity={p(t, 3.2 + i * 0.4, 3.6 + i * 0.4)}>
                  <rect width={124} height={40} rx={20} fill={SUKOON.sage} />
                  <text x={62} y={26} textAnchor="middle" fontSize={15} fontWeight={900} fill="#FFFFFF">{tr}</text>
                </g>
              ))}
              <text x={24} y={226} fontSize={14} fontWeight={800} fill={SC.muted} opacity={p(t, 4.6, 5)}>Ishita: “Let’s start here, not from a picture.”</text>
            </g>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g transform="translate(60 110)">
            {WORDS.map((w, i) => (
              <g key={w.trait} transform={`translate(${i * 215} 0)`} opacity={p(t, 6.2 + i * 0.5, 6.7 + i * 0.5)}>
                <rect width={195} height={44} rx={12} fill={SUKOON.sage} />
                <text x={97} y={28} textAnchor="middle" fontSize={16} fontWeight={900} fill="#FFFFFF">{w.trait}</text>
                {w.words.map((x, j) => (
                  <g key={x} transform={`translate(0 ${70 + j * 64})`} opacity={p(t, 6.8 + i * 0.5 + j * 0.3, 7.2 + i * 0.5 + j * 0.3)}>
                    <rect width={195} height={48} rx={10} fill={SC.surface} stroke={SC.line} />
                    <text x={97} y={30} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.text}>{x}</text>
                  </g>
                ))}
              </g>
            ))}
            <text x={0} y={330} fontSize={16} fontWeight={800} fill={SC.text} opacity={p(t, 9.6, 10.2)}>Each word is a picture you could draw. “A slow breath out” is where the best mark comes from.</text>
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g transform="translate(80 96)">
            {Array.from({ length: 40 }, (_, i) => {
              const k = THUMBS[(i * 3) % THUMBS.length];
              return (
                <g key={i} transform={`translate(${(i % 10) * 82} ${Math.floor(i / 10) * 82})`} opacity={p(t, 11.1 + i * 0.07, 11.3 + i * 0.07)}>
                  <rect width={70} height={70} rx={6} fill={SC.surface} stroke={SC.line} />
                  <g transform={`rotate(${((i * 37) % 9) - 4} 35 35)`}><MarkArt k={k} mono={SC.muted} x={11} y={11} size={48} /></g>
                </g>
              );
            })}
            <text x={0} y={360} fontSize={16} fontWeight={800} fill={SC.text} opacity={p(t, 14, 14.6)}>Twenty minutes, a pencil. The first ten are lotuses and suns: the obvious ideas, used up.</text>
          </g>
        )}

        {t >= 16 && t < 26 && (
          <g transform="translate(90 100)">
            {SHORT.map((k, i) => {
              const tested = t >= 21, v = markVerdict(SUKOON_MARKS[k]), ok = v === 'ready';
              return (
                <g key={k} transform={`translate(${i * 270} 0)`} opacity={p(t, 16.2 + i * 0.6, 16.8 + i * 0.6)}>
                  <rect width={240} height={300} rx={18} fill={SC.surface} stroke={SC.line} />
                  <MarkArt k={k} x={60} y={24} size={120} />
                  <text x={120} y={176} textAnchor="middle" fontSize={14} fontWeight={800} fill={SC.muted}>{k === 'mandala' ? 'Fine-line mandala' : k === 'dusk' ? 'Gradient sunset' : 'Half-sun over a line'}</text>
                  {tested && (
                    <g opacity={p(t, 21.3 + i * 0.7, 21.8 + i * 0.7)}>
                      <rect x={30} y={196} width={80} height={80} rx={10} fill={SC.soft} />
                      <MarkArt k={k} x={38} y={204} size={64} blur={ICON_BLUR} />
                      <text x={70} y={292} textAnchor="middle" fontSize={11} fontWeight={800} fill={SC.muted}>at 16 px</text>
                      <rect x={130} y={196} width={80} height={80} rx={10} fill={SC.soft} />
                      <MarkArt k={k} x={138} y={204} size={64} mono={ink} />
                      <text x={170} y={292} textAnchor="middle" fontSize={11} fontWeight={800} fill={SC.muted}>one colour</text>
                      <circle cx={220} cy={20} r={16} fill={ok ? GREEN : RED} />
                      <text x={220} y={26} textAnchor="middle" fontSize={16} fontWeight={900} fill="#FFFFFF">{ok ? '✓' : '×'}</text>
                    </g>
                  )}
                </g>
              );
            })}
            {t >= 23.4 && (
              <text x={0} y={350} fontSize={16} fontWeight={800} fill={SC.text} opacity={p(t, 23.4, 24)}>
                <tspan x={0}>Mandala strokes: {SUKOON_MARKS.mandala.thin} units = {markPx(SUKOON_MARKS.mandala.thin).toFixed(2)} px at 16 px. The sunset’s idea was its gradient.</tspan>
                <tspan x={0} dy={22}>The half-sun: {markPx(SUKOON_MARKS.breath.thin)} px, one colour.</tspan>
              </text>
            )}
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g transform="translate(90 120)">
            <text x={0} y={0} fontSize={15} fontWeight={800} fill={SC.muted}>The category’s app icons, and Sukoon’s</text>
            {(['lotus', 'enso', 'head', 'lotus', 'enso', 'breath'] as const).map((k, i) => {
              const us = k === 'breath';
              return (
                <g key={i} transform={`translate(${i * 135} 30)`} opacity={p(t, 26.2 + i * 0.3, 26.6 + i * 0.3)}>
                  <rect width={112} height={112} rx={26} fill={us ? SUKOON.sand : SC.surface} stroke={us ? SUKOON.sage : SC.line} strokeWidth={us ? 3 : 1} />
                  <MarkArt k={k} mono={us ? undefined : SC.muted} x={16} y={16} size={80} />
                </g>
              );
            })}
            <text x={0} y={200} fontSize={18} fontWeight={900} fill={SC.text} opacity={p(t, 28.4, 29)}>Lotuses, ensō circles, glowing heads: the stock symbols of calm.</text>
            <text x={0} y={230} fontSize={16} fontWeight={800} fill={SC.muted} opacity={p(t, 29, 29.6)}>The half-sun looks like none of them, so people can remember whose it is.</text>
          </g>
        )}

        {t >= 31 && (() => {
          const k = p(t, 31.2, 32.4), sun = (28 * 156) / MARK_BOX;   // the half-sun's height (28 units) at this size
          return (
            <g transform="translate(200 130)">
              <rect x={-sun * k} y={-sun * k} width={460 + 2 * sun * k} height={160 + 2 * sun * k} fill="none" stroke={SUKOON.peach} strokeWidth={2} strokeDasharray="6 5" opacity={p(t, 33.2, 33.8)} />
              <rect width={460} height={160} rx={8} fill={SUKOON.sand} />
              <MarkArt k="breath" x={16} y={2} size={156} />
              <text x={180} y={92} fontSize={56} fontWeight={700} fontFamily="Georgia, serif" fill={SUKOON.ink} opacity={p(t, 32, 32.8)}>Sukoon</text>
              <text x={182} y={132} fontSize={26} fontWeight={600} fill={SUKOON.sage} opacity={p(t, 32.4, 33.2)}>सुकून</text>
              <text x={230} y={-sun - 14} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.muted} opacity={p(t, 33.4, 34)}>Clear space: one sun on every side</text>
              <text x={230} y={160 + sun + 34} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.text} opacity={p(t, 34.2, 34.8)}>Arc thickened where it meets the line; line shortened to balance.</text>
            </g>
          );
        })()}
      </g>
    </svg>
  );
}
