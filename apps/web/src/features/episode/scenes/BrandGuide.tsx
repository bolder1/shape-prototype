'use client';
// Scene for br.2-3: six months after launch, Sukoon in the wild (`SUKOON_USES`): a stretched gym poster, a gold Diwali
// offer, a cramped WhatsApp banner, a stock beach. Only the files were shared, so every team guessed. Ishita writes the
// guide (`SUKOON_GUIDE`, `GUIDE_RULES`): clear space in suns and a minimum size, the colour pairs that can carry text,
// faces and sizes, the photo style and voice, each rule with a do and a don't. Templates bring the next Diwali back on
// brand. Pure function of t (0–36). Also exports `UseArt`, the thumbnails `guide-build` draws, wrong or fixed.
import { GUIDE_RULES, SUKOON_GUIDE, contrastRatio, type SukoonUse } from '@shape/content';
import { back, clamp, Grid, p, SC } from './shared';
import { MarkArt, SUKOON } from './LogoProcess';
import { FACE } from './BrandPalette';

const W = 960, H = 540;
const RED = '#B42318', GREEN = '#067647', GOLD = '#C9A227';

/** The logo lockup: the half-sun and the name, `h` units tall, stretched by `sx`. */
function Lockup({ x, y, h, sx = 1, ink = SUKOON.ink, sun = SUKOON.sage, mark = false }: { x: number; y: number; h: number; sx?: number; ink?: string; sun?: string; mark?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${sx} 1)`}>
      <MarkArt k="breath" mono={sun === SUKOON.sage ? undefined : sun} size={h} />
      {!mark && <text x={h * 1.02} y={h * 0.66} fontSize={h * 0.5} fontWeight={700} fontFamily={FACE.tiro} fill={ink}>Sukoon</text>}
    </g>
  );
}

/** A thumbnail of one piece of work in the wild, 160 × 100, drawn wrong or, with `fixed`, the way the guide says. */
export function UseArt({ k, fixed = false, box }: { k: SukoonUse; fixed?: boolean; box?: { x: number; y: number; w: number } }) {
  const P = SUKOON_GUIDE.palette;
  let art: React.ReactNode;
  switch (k) {
    case 'gym':
      art = <g><rect width={160} height={100} fill={P.sand} /><Lockup x={fixed ? 34 : 6} y={20} h={36} sx={fixed ? 1 : 1.4} /><text x={80} y={82} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily={FACE.tiro} fill={P.ink}>Calm after cardio · FitZone</text></g>;
      break;
    case 'whatsapp':
      art = <g><rect width={160} height={100} fill={P.sage} />{fixed ? <Lockup x={12} y={12} h={22} ink="#FFFFFF" sun="#FFFFFF" /> : <Lockup x={2} y={2} h={22} ink="#FFFFFF" sun="#FFFFFF" />}<text x={fixed ? 12 : 4} y={fixed ? 66 : 32} fontSize={14} fontWeight={700} fontFamily={FACE.tiro} fill="#FFFFFF">Five minutes. Free today.</text></g>;
      break;
    case 'partnerList':
      art = (
        <g><rect width={160} height={100} fill="#FFFFFF" />
          {[0, 1, 2].map(i => <g key={i}><rect x={10} y={10 + i * 30} width={140} height={24} rx={4} fill="#F2F4F7" /><rect x={16} y={16 + i * 30} width={12} height={12} rx={3} fill={['#98A2B3', '#D0D5DD', '#98A2B3'][i]} /><rect x={34} y={19 + i * 30} width={50} height={6} rx={3} fill="#D0D5DD" /></g>)}
          {fixed ? <MarkArt k="breath" x={15} y={44} size={14} /> : <Lockup x={14} y={46} h={8} />}
        </g>
      );
      break;
    case 'diwali':
      art = (
        <g><rect width={160} height={100} fill={P.sage} />
          {!fixed && Array.from({ length: 14 }, (_, i) => <circle key={i} cx={(i * 47) % 160} cy={(i * 29) % 100} r={1.6} fill={GOLD} />)}
          {fixed && [30, 80, 130].map(cx => <g key={cx}><ellipse cx={cx} cy={84} rx={12} ry={5} fill={P.peach} /><path d={`M${cx} 70 C${cx + 4} 76 ${cx + 3} 80 ${cx} 80 C${cx - 3} 80 ${cx - 4} 76 ${cx} 70 Z`} fill={P.sand} /></g>)}
          <Lockup x={10} y={8} h={18} ink="#FFFFFF" sun="#FFFFFF" />
          <text x={10} y={54} fontSize={16} fontWeight={700} fontFamily={FACE.tiro} fill={fixed ? P.sand : GOLD}>Diwali: a calmer week</text>
        </g>
      );
      break;
    case 'peachButton':
      art = <g><rect width={160} height={100} fill={P.sand} /><text x={14} y={30} fontSize={14} fontWeight={700} fontFamily={FACE.tiro} fill={P.ink}>Calm in five minutes</text><rect x={14} y={56} width={84} height={26} rx={13} fill={fixed ? P.sage : P.peach} /><text x={56} y={73} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily={FACE.mukta} fill="#FFFFFF">Start free</text></g>;
      break;
    case 'comic':
      art = <g><rect width={160} height={100} fill={P.sand} /><text x={14} y={42} fontSize={15} fontWeight={700} fontFamily={fixed ? FACE.tiro : '"Comic Sans MS", "Chalkboard SE", cursive'} fill={P.ink}>“Slow is also</text><text x={14} y={62} fontSize={15} fontWeight={700} fontFamily={fixed ? FACE.tiro : '"Comic Sans MS", "Chalkboard SE", cursive'} fill={P.ink}>a speed.”</text><Lockup x={110} y={76} h={14} /></g>;
      break;
    case 'tinyTiro':
      art = <g><rect width={160} height={100} fill={P.sand} /><text x={14} y={30} fontSize={15} fontWeight={700} fontFamily={FACE.tiro} fill={P.ink}>Welcome to Sukoon</text>{[0, 1, 2].map(i => <text key={i} x={14} y={52 + i * 12} fontSize={fixed ? 8 : 6} fontFamily={fixed ? FACE.mukta : FACE.tiro} fontStyle={fixed ? 'normal' : 'italic'} fill={P.ink}>{['Pick a time that suits you', 'We’ll remind you, gently', 'You can change this later'][i]}</text>)}</g>;
      break;
    case 'beach':
      art = fixed
        ? <g><rect width={160} height={100} fill="#E9DCC8" /><rect x={96} y={12} width={50} height={40} fill="#F7F1E6" /><rect x={0} y={74} width={160} height={26} fill="#B9A58A" /><circle cx={58} cy={44} r={9} fill="#7A4E34" /><path d="M42 80 C44 58 72 58 74 80 Z" fill={P.sage} /><text x={8} y={96} fontSize={8} fontWeight={700} fill={P.ink}>A parent, home, 7 am</text></g>
        : <g><rect width={160} height={60} fill="#5AB4F0" /><rect y={60} width={160} height={14} fill="#1B7FC4" /><rect y={74} width={160} height={26} fill="#F1D9A6" /><circle cx={130} cy={18} r={9} fill="#FFE066" /><circle cx={70} cy={50} r={7} fill="#E9B48A" /><path d="M58 78 C60 60 80 60 82 78 Z" fill="#FFFFFF" /><path d="M58 60 L46 42 M82 60 L94 42" stroke="#E9B48A" strokeWidth={4} strokeLinecap="round" /></g>;
      break;
    case 'neon':
      art = (
        <g><rect width={160} height={100} fill="#C9C2B3" /><rect x={10} y={14} width={64} height={44} rx={6} fill="#E8E1D2" /><rect x={86} y={14} width={64} height={44} rx={6} fill="#E8E1D2" />
          <circle cx={80} cy={60} r={11} fill="#7A4E34" /><path d="M60 100 C62 74 98 74 100 100 Z" fill="#4F5B62" />
          {!fixed && <rect width={160} height={100} fill="#8E2DE2" opacity={0.55} style={{ mixBlendMode: 'multiply' }} />}
          {!fixed && <rect width={160} height={100} fill="#FF3EA5" opacity={0.18} />}
          <Lockup x={8} y={74} h={18} ink="#FFFFFF" sun="#FFFFFF" />
        </g>
      );
      break;
  }
  const size = box ? { x: box.x, y: box.y, width: box.w, height: box.w * 0.625 } : { className: 'h-full w-full' };
  return <svg viewBox="0 0 160 100" {...size} aria-hidden><defs><clipPath id={`c-${k}-${fixed ? 1 : 0}`}><rect width={160} height={100} rx={6} /></clipPath></defs><g clipPath={`url(#c-${k}-${fixed ? 1 : 0})`}>{art}</g></svg>;
}

function Thumb({ k, x, y, w = 200, fixed, mark }: { k: SukoonUse; x: number; y: number; w?: number; fixed?: boolean; mark?: 'do' | 'dont' }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <UseArt k={k} fixed={fixed} box={{ x: 0, y: 0, w }} />
      {mark && (
        <g transform={`translate(${w - 14} 14)`}>
          <circle r={14} fill={mark === 'do' ? GREEN : RED} />
          <text y={6} textAnchor="middle" fontSize={16} fontWeight={900} fill="#FFFFFF">{mark === 'do' ? '✓' : '×'}</text>
        </g>
      )}
    </g>
  );
}

export function BrandGuideScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const P = SUKOON_GUIDE.palette;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: six months after launch, Sukoon's identity has drifted: a stretched gym poster, a gold Diwali offer, a cramped WhatsApp banner and a stock beach photo. Only the logo files had been shared. Ishita writes a guide: clear space the height of the sun, the full logo never under ${SUKOON_GUIDE.minLockupPx} px, five colours and the three pairs that can carry text, Tiro for headlines and Mukta for the rest, real people in natural light, each rule with a do and a don't, and templates. The next Diwali campaign keeps the palette and changes only the photos and words.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>
          {t < 6 ? 'Six months in the wild' : t < 11 ? 'Everyone guessed' : t < 16 ? 'Logo: space and size' : t < 21 ? 'Colour and type' : t < 26 ? 'Imagery and voice' : t < 31 ? 'Do and don’t' : 'Templates over policing'}
        </text>

        {t < 6 && (
          <g transform="translate(70 100)">
            {(['gym', 'diwali', 'whatsapp', 'beach'] as const).map((k, i) => (
              <g key={k} opacity={p(t, 0.3 + i * 0.6, 0.8 + i * 0.6)} transform={`rotate(${[-2, 1.5, -1, 2][i]} ${(i % 2) * 420 + 180} ${Math.floor(i / 2) * 200 + 80})`}>
                <Thumb k={k} x={(i % 2) * 420 + 40} y={Math.floor(i / 2) * 200} w={260} />
              </g>
            ))}
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g transform="translate(100 110)">
            <g opacity={p(t, 6.2, 6.8)}>
              <path d="M0 20 L60 20 L74 34 L240 34 L240 220 L0 220 Z" fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text x={20} y={70} fontSize={15} fontWeight={800} fill={SC.text}>Shared drive / Sukoon</text>
              {['logo_final.png', 'logo_final_v2.png', 'colours.txt'].map((f, i) => <text key={f} x={20} y={110 + i * 30} fontSize={14} fontWeight={700} fontFamily="ui-monospace, monospace" fill={SC.muted}>{f}</text>)}
            </g>
            {['Partner gym', 'Agency', 'Marketing intern', 'App team'].map((team, i) => (
              <g key={team} transform={`translate(${320 + (i % 2) * 220} ${Math.floor(i / 2) * 120})`} opacity={p(t, 7.2 + i * 0.4, 7.6 + i * 0.4)}>
                <rect width={190} height={90} rx={14} fill={SC.surface} stroke={SC.line} />
                <text x={20} y={38} fontSize={15} fontWeight={800} fill={SC.text}>{team}</text>
                <text x={20} y={68} fontSize={14} fontWeight={700} fill={SC.muted}>{['Stretch it to fit?', 'Gold for Diwali?', 'Which font?', 'What photos?'][i]}</text>
                <text x={160} y={44} fontSize={30} fontWeight={900} fill={RED}>?</text>
              </g>
            ))}
            <text x={0} y={290} fontSize={16} fontWeight={800} fill={SC.text} opacity={p(t, 9.4, 10)}>The files were shared. The rules weren’t, so each team filled the gaps differently.</text>
          </g>
        )}

        {t >= 11 && t < 16 && (() => {
          const h = 120, sun = (28 * h) / 96, k = p(t, 11.6, 12.6);
          return (
            <g transform="translate(140 150)">
              <rect x={-sun * k} y={-sun * k + 10} width={330 + 2 * sun * k} height={h - 10 + 2 * sun * k} fill={P.peach} opacity={0.25} stroke={P.peach} strokeDasharray="6 5" />
              <Lockup x={0} y={0} h={h} />
              {[0, 1].map(i => <g key={i} opacity={p(t, 12.6, 13)}><rect x={i ? 330 : -sun} y={h / 2 - 10} width={sun} height={20} fill={SUKOON.sage} opacity={0.6} /><text x={i ? 330 + sun / 2 : -sun / 2} y={h / 2 + 34} textAnchor="middle" fontSize={12} fontWeight={800} fill={SC.muted}>1 sun</text></g>)}
              <g transform="translate(470 -10)" opacity={p(t, 13.4, 14)}>
                <text x={0} y={0} fontSize={14} fontWeight={800} fill={SC.muted}>Minimum size</text>
                <Lockup x={0} y={14} h={24} />
                <text x={130} y={34} fontSize={13} fontWeight={800} fill={GREEN}>24 px: full logo</text>
                <MarkArt k="breath" x={0} y={60} size={16} />
                <text x={30} y={74} fontSize={13} fontWeight={800} fill={GREEN}>smaller: the mark alone</text>
              </g>
              <text x={-sun} y={h + sun + 70} fontSize={16} fontWeight={800} fill={SC.text} opacity={p(t, 14.2, 14.8)}>{GUIDE_RULES.clear.rule}</text>
            </g>
          );
        })()}

        {t >= 16 && t < 21 && (
          <g transform="translate(90 100)">
            {[{ fg: '#FFFFFF', bg: P.sage, n: 'White on sage' }, { fg: P.ink, bg: P.sand, n: 'Ink on sand' }, { fg: P.ink, bg: P.peach, n: 'Ink on peach' }, { fg: '#FFFFFF', bg: P.peach, n: 'White on peach' }].map((c, i) => {
              const r = contrastRatio(c.fg, c.bg), ok = r >= 4.5;
              return (
                <g key={c.n} transform={`translate(${i * 200} 0)`} opacity={p(t, 16.2 + i * 0.4, 16.6 + i * 0.4)}>
                  <rect width={180} height={110} rx={12} fill={c.bg} stroke={SC.line} />
                  <text x={16} y={40} fontSize={18} fontWeight={800} fill={c.fg}>Aa सुकून</text>
                  <text x={16} y={90} fontSize={13} fontWeight={800} fill={c.fg}>{r.toFixed(1)} : 1</text>
                  <text x={16} y={136} fontSize={14} fontWeight={900} fill={ok ? GREEN : RED}>{ok ? '✓' : '×'} {c.n}</text>
                </g>
              );
            })}
            <g transform="translate(0 190)" opacity={p(t, 18.4, 19)}>
              <text x={0} y={28} fontSize={32} fontWeight={700} fontFamily={FACE.tiro} fill={SC.text}>Tiro, headlines, 24 px+</text>
              <text x={0} y={66} fontSize={18} fontFamily={FACE.mukta} fill={SC.text}>Mukta, body, labels and captions, 14 px+</text>
              <text x={0} y={110} fontSize={14} fontWeight={800} fill={SC.muted}>Every colour as HEX and RGB for screens, CMYK for print.</text>
            </g>
          </g>
        )}

        {t >= 21 && t < 26 && (
          <g transform="translate(90 100)">
            <g opacity={p(t, 21.2, 21.8)}><Thumb k="beach" x={0} y={0} w={300} mark="dont" /></g>
            <g opacity={p(t, 21.8, 22.4)}><Thumb k="beach" x={340} y={0} w={300} fixed mark="do" /></g>
            <text x={0} y={220} fontSize={16} fontWeight={800} fill={SC.text} opacity={p(t, 22.6, 23.2)}>{GUIDE_RULES.photo.rule}</text>
            <g opacity={p(t, 23.6, 24.2)} transform="translate(0 260)">
              <text x={0} y={0} fontSize={14} fontWeight={800} fill={SC.muted}>VOICE · calm, warm, expert</text>
              <text x={0} y={36} fontSize={24} fontWeight={700} fontFamily={FACE.tiro} fill={SC.text}>“Breathe. You’ve got five minutes.”</text>
              <text x={480} y={36} fontSize={18} fontWeight={800} fill={RED}>not “CRUSH your stress NOW!!!”</text>
            </g>
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g transform="translate(90 96)">
            {(['gym', 'whatsapp', 'peachButton'] as const).map((k, i) => (
              <g key={k} transform={`translate(0 ${i * 128})`} opacity={p(t, 26.2 + i * 0.8, 26.7 + i * 0.8)}>
                <Thumb k={k} x={0} y={0} w={180} fixed mark="do" />
                <Thumb k={k} x={200} y={0} w={180} mark="dont" />
                <text x={410} y={50} fontSize={14} fontWeight={800} fill={SC.text}>{GUIDE_RULES[k === 'gym' ? 'stretch' : k === 'whatsapp' ? 'clear' : 'pair'].rule}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 31 && (
          <g transform="translate(90 100)">
            {['Instagram post', 'WhatsApp banner', 'Offer card'].map((n, i) => (
              <g key={n} transform={`translate(${i * 190} 0)`} opacity={p(t, 31.2 + i * 0.4, 31.6 + i * 0.4)}>
                <rect width={170} height={120} rx={12} fill={P.sand} stroke={SC.line} />
                <rect x={14} y={14} width={142} height={50} rx={6} fill="none" stroke={P.sage} strokeDasharray="5 4" />
                <text x={85} y={44} textAnchor="middle" fontSize={11} fontWeight={800} fill={P.ink}>your photo</text>
                <Lockup x={14} y={80} h={22} />
                <text x={85} y={146} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.muted}>{n} template</text>
              </g>
            ))}
            <g opacity={p(t, 33, 33.6)} transform="translate(590 -10)">
              <Thumb k="diwali" x={0} y={0} w={240} fixed mark="do" />
              <text x={0} y={180} fontSize={14} fontWeight={800} fill={SC.text}>Diwali, from the template:</text>
              <text x={0} y={202} fontSize={14} fontWeight={800} fill={SC.muted}>diyas in the picture, palette untouched.</text>
            </g>
            <text x={0} y={250} fontSize={16} fontWeight={800} fill={SC.text} opacity={p(t, 34, 34.6)}>Make the right thing the easy thing. People in a hurry use what’s ready.</text>
          </g>
        )}
      </g>
    </svg>
  );
}
