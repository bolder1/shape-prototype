'use client';
// Scene for br.2-2: Sukoon's moodboard colours meet real screens. White on the moodboard's peach measures 1.9:1
// (`contrastRatio`), so peach becomes a background; the shelf's rivals own blue and orange (`rivalOf`), so deep sage,
// at 7.5:1 with white, becomes the main colour; a 60-30-10 split on a phone. Then type: Playfair Display has no
// Devanagari and सुकून turns into empty boxes, Tiro Devanagari Hindi sets both; Tiro for headlines, Mukta for the rest.
// It ends on the kit. Pure function of t (0–36). Also exports the face stacks and the Hindi sample for `kit-pick`.
import { SUKOON_INK, SUKOON_KIT, contrastRatio } from '@shape/content';
import { back, clamp, Grid, p, SC } from './shared';

const W = 960, H = 540;
const RED = '#B42318', GREEN = '#067647';
/** Stand-ins for the kit's faces (the app doesn't ship them): close system faces in the same spirit. */
export const FACE: Record<string, string> = {
  tiro: 'Georgia, "Noto Serif Devanagari", "Nirmala UI", serif',
  playfair: '"Playfair Display", Didot, "Bodoni MT", Georgia, serif',
  baloo: '"Baloo 2", "Comic Sans MS", "Trebuchet MS", "Nirmala UI", sans-serif',
  mukta: 'system-ui, -apple-system, "Segoe UI", "Nirmala UI", sans-serif',
  inter: 'system-ui, -apple-system, "Segoe UI", sans-serif',
  yatra: 'Impact, "Arial Black", "Nirmala UI", sans-serif',
};
export const HINDI = 'साँस लीजिए';
export const RIVAL_FILL = { blue: '#2E6FD8', orange: '#F47D31', violet: '#6E4AA8' };
const ratio = (a: string, b: string) => contrastRatio(a, b).toFixed(1);

/** A word as a font without Devanagari shows it: one empty box (tofu) per character cluster. */
export const tofu = (s: string) => Array.from(s.replace(/\s/g, '')).filter(ch => !/[ऀ-ःऺ-ॏॢॣ]/.test(ch)).map(() => '□').join('');

export function BrandPaletteScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const sage = SUKOON_KIT.sage.hex, peach = SUKOON_KIT.peach.hex, sand = SUKOON_KIT.sand.hex;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Sukoon's moodboard colours, sand, peach and sage, meet real screens. White text on peach is ${ratio('#FFFFFF', peach)}:1, under the 4.5:1 text needs, so peach becomes a background. The biggest meditation apps own blue and orange; white on deep sage is ${ratio('#FFFFFF', sage)}:1, so sage becomes the main colour, split 60% sand, 30% sage, 10% peach. In Playfair Display, which has no Devanagari, the Hindi name shows as empty boxes; Tiro Devanagari Hindi sets both scripts. Tiro is for headlines and Mukta for everything else.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>
          {t < 6 ? 'From the moodboard' : t < 11 ? 'Peach can’t carry text' : t < 16 ? 'A colour nobody owns' : t < 21 ? '60, 30, 10' : t < 26 ? 'A face that speaks Hindi' : t < 31 ? 'Two faces, clear jobs' : 'The kit'}
        </text>

        {t < 6 && (
          <g transform="translate(120 110)">
            {[{ c: sand, n: 'Sand' }, { c: peach, n: 'Peach' }, { c: sage, n: 'Sage' }].map((s, i) => (
              <g key={s.n} transform={`translate(${i * 250} ${(i % 2) * 20}) rotate(${i - 1} 110 110)`} opacity={p(t, 0.3 + i * 0.5, 0.9 + i * 0.5)}>
                <rect width={220} height={240} rx={6} fill={SC.surface} stroke={SC.line} />
                <rect x={14} y={14} width={192} height={170} rx={4} fill={s.c} />
                <text x={20} y={218} fontSize={17} fontWeight={900} fill={SC.text}>{s.n}</text>
              </g>
            ))}
            <text x={0} y={330} fontSize={16} fontWeight={800} fill={SC.text} opacity={p(t, 3.4, 4)}>Warm and quiet: the board everyone agreed on. Now each colour needs a job.</text>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g transform="translate(120 110)">
            <rect width={300} height={330} rx={30} fill={t < 8.6 ? SC.surface : peach} stroke={SC.line} strokeWidth={2} />
            <rect x={40} y={240} width={220} height={56} rx={28} fill={t < 8.6 ? peach : sage} />
            <text x={150} y={276} textAnchor="middle" fontSize={20} fontWeight={800} fill="#FFFFFF">Begin</text>
            <g transform="translate(360 40)">
              <text x={0} y={30} fontSize={44} fontWeight={900} fill={RED} opacity={p(t, 6.6, 7.2)}>{ratio('#FFFFFF', peach)} : 1</text>
              <text x={0} y={64} fontSize={16} fontWeight={800} fill={SC.muted} opacity={p(t, 6.8, 7.4)}>White on peach. Body text needs 4.5 : 1.</text>
              <g opacity={p(t, 8.6, 9.2)}>
                <text x={0} y={140} fontSize={18} fontWeight={900} fill={SC.text}>Peach moves to the background.</text>
                <text x={0} y={170} fontSize={16} fontWeight={800} fill={SC.muted}>Ink on peach: {ratio(SUKOON_INK, peach)} : 1. It can carry dark text,</text>
                <text x={0} y={194} fontSize={16} fontWeight={800} fill={SC.muted}>just not white.</text>
              </g>
            </g>
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g transform="translate(100 110)">
            <text x={0} y={0} fontSize={15} fontWeight={800} fill={SC.muted}>Meditation apps on the store shelf</text>
            {[RIVAL_FILL.blue, RIVAL_FILL.orange, RIVAL_FILL.blue, RIVAL_FILL.violet, RIVAL_FILL.orange, sage].map((c, i) => (
              <g key={i} transform={`translate(${i * 130} 24)`} opacity={p(t, 11.2 + i * 0.3, 11.6 + i * 0.3)}>
                <rect width={108} height={108} rx={26} fill={c} stroke={i === 5 ? SC.text : 'none'} strokeWidth={3} />
                <circle cx={54} cy={54} r={22} fill="#FFFFFF" opacity={0.9} />
              </g>
            ))}
            <text x={5 * 130 + 54} y={160} textAnchor="middle" fontSize={14} fontWeight={900} fill={SC.text} opacity={p(t, 12.8, 13.2)}>Sukoon</text>
            <g opacity={p(t, 13.4, 14)} transform="translate(0 210)">
              <text x={0} y={0} fontSize={18} fontWeight={900} fill={SC.text}>Blue and orange are taken. A strong green isn’t.</text>
              <text x={0} y={32} fontSize={44} fontWeight={900} fill={GREEN}>{ratio('#FFFFFF', sage)} : 1</text>
              <text x={170} y={30} fontSize={16} fontWeight={800} fill={SC.muted}>white on deep sage, {sage}</text>
            </g>
          </g>
        )}

        {t >= 16 && t < 21 && (
          <g transform="translate(100 110)">
            {[{ c: sand, w: 60, n: 'Sand · backgrounds' }, { c: sage, w: 30, n: 'Sage · buttons, mark' }, { c: peach, w: 10, n: 'Peach · warm touches' }].reduce<{ x: number; els: React.ReactNode[] }>((acc, s, i) => {
              const w = 6.4 * s.w * p(t, 16.2 + i * 0.5, 17 + i * 0.5);
              acc.els.push(
                <g key={s.n}>
                  <rect x={acc.x} y={0} width={w} height={70} fill={s.c} stroke={SC.line} />
                  <text x={acc.x + 8} y={100 + i * 24} fontSize={15} fontWeight={800} fill={SC.text} opacity={p(t, 17 + i * 0.5, 17.4 + i * 0.5)}>{s.w}% {s.n}</text>
                </g>,
              );
              acc.x += 6.4 * s.w;
              return acc;
            }, { x: 0, els: [] }).els}
            <g transform="translate(470 0)" opacity={p(t, 18.4, 19)}>
              <rect width={200} height={330} rx={26} fill={sand} stroke={SC.line} strokeWidth={2} />
              <rect x={24} y={40} width={152} height={120} rx={14} fill={peach} />
              <circle cx={100} cy={100} r={34} fill={sand} opacity={0.6} />
              <text x={24} y={200} fontSize={18} fontWeight={700} fontFamily={FACE.tiro} fill={SUKOON_INK}>Five minutes</text>
              <text x={24} y={222} fontSize={12} fontFamily={FACE.mukta} fill={SUKOON_INK}>A breathing break before</text>
              <text x={24} y={238} fontSize={12} fontFamily={FACE.mukta} fill={SUKOON_INK}>your next meeting.</text>
              <rect x={24} y={262} width={152} height={44} rx={22} fill={sage} />
              <text x={100} y={290} textAnchor="middle" fontSize={15} fontWeight={800} fill="#FFFFFF">Begin</text>
            </g>
          </g>
        )}

        {t >= 21 && t < 26 && (
          <g transform="translate(100 120)">
            {[{ f: 'playfair', n: 'Playfair Display', deva: false }, { f: 'tiro', n: 'Tiro Devanagari Hindi', deva: true }].map((x, i) => (
              <g key={x.f} transform={`translate(${i * 400} 0)`} opacity={p(t, 21.2 + i * 1.6, 21.8 + i * 1.6)}>
                <rect width={360} height={250} rx={16} fill={SC.surface} stroke={x.deva ? GREEN : RED} strokeWidth={2} />
                <text x={24} y={36} fontSize={14} fontWeight={800} fill={SC.muted}>{x.n}</text>
                <text x={24} y={100} fontSize={44} fontWeight={700} fontFamily={FACE[x.f]} fill={SC.text}>Sukoon</text>
                <text x={24} y={170} fontSize={44} fontWeight={700} fontFamily={FACE[x.f]} fill={x.deva ? SC.text : SC.muted} letterSpacing={x.deva ? 0 : 6}>{x.deva ? 'सुकून' : tofu('सुकून')}</text>
                <text x={24} y={226} fontSize={15} fontWeight={900} fill={x.deva ? GREEN : RED}>{x.deva ? 'Latin and Devanagari, one voice' : 'No Devanagari: empty boxes'}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g transform="translate(100 110)">
            <g opacity={p(t, 26.2, 26.8)}>
              <text x={0} y={20} fontSize={14} fontWeight={800} fill={SC.muted}>HEADLINES · Tiro Devanagari Hindi · 24 px and up</text>
              <text x={0} y={76} fontSize={44} fontWeight={700} fontFamily={FACE.tiro} fill={SC.text}>Breathe. You’ve got five minutes.</text>
              <text x={0} y={130} fontSize={36} fontWeight={700} fontFamily={FACE.tiro} fill={SC.text}>साँस लीजिए, पाँच मिनट हैं।</text>
            </g>
            <g opacity={p(t, 27.6, 28.2)} transform="translate(0 180)">
              <text x={0} y={20} fontSize={14} fontWeight={800} fill={SC.muted}>EVERYTHING ELSE · Mukta · 14 px and up</text>
              <text x={0} y={56} fontSize={18} fontFamily={FACE.mukta} fill={SC.text}>Sit comfortably. Breathe in for four counts, and out for six.</text>
              <text x={0} y={86} fontSize={18} fontFamily={FACE.mukta} fill={SC.text}>आराम से बैठिए। चार तक साँस लीजिए, छह तक छोड़िए।</text>
            </g>
            <text x={0} y={330} fontSize={16} fontWeight={800} fill={SC.text} opacity={p(t, 29, 29.6)}>One face with character, one that stays out of the way.</text>
          </g>
        )}

        {t >= 31 && (
          <g transform="translate(120 100)" opacity={p(t, 31.2, 31.8)}>
            <rect width={720} height={360} rx={20} fill={SC.surface} stroke={SC.line} />
            {[{ c: sand, n: 'Sand', on: SUKOON_INK }, { c: sage, n: 'Sage', on: '#FFFFFF' }, { c: peach, n: 'Peach', on: SUKOON_INK }, { c: SUKOON_INK, n: 'Ink', on: '#FFFFFF' }, { c: '#FFFFFF', n: 'White', on: SUKOON_INK }].map((s, i) => (
              <g key={s.n} transform={`translate(${30 + i * 134} 30)`} opacity={p(t, 31.6 + i * 0.3, 32 + i * 0.3)}>
                <rect width={120} height={120} rx={12} fill={s.c} stroke={SC.line} />
                <text x={12} y={30} fontSize={16} fontWeight={900} fill={s.on}>{s.n}</text>
                <text x={12} y={106} fontSize={12} fontWeight={800} fill={s.on}>{s.c}</text>
              </g>
            ))}
            <text x={30} y={200} fontSize={14} fontWeight={800} fill={SC.muted}>Text pairs: white on sage {ratio('#FFFFFF', sage)} · ink on sand {ratio(SUKOON_INK, sand)} · ink on peach {ratio(SUKOON_INK, peach)}</text>
            <text x={30} y={260} fontSize={36} fontWeight={700} fontFamily={FACE.tiro} fill={SC.text} opacity={p(t, 33.2, 33.8)}>Tiro · सुकून</text>
            <text x={30} y={310} fontSize={20} fontFamily={FACE.mukta} fill={SC.text} opacity={p(t, 33.8, 34.4)}>Mukta · सुकून · for everything else</text>
          </g>
        )}
      </g>
    </svg>
  );
}
