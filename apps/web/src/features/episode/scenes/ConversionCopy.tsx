'use client';
// Scene for br.3-2: the agency's hero for Sukoon's launch ("Unlock your inner calm with our AI-powered meditation
// ecosystem", a sub about passionate experts, a Submit button) fails a five-second test with five people. The
// headline is rebuilt from words people used in interviews; the sub's flagged words (`flaggedWords`) are struck and it
// gets concrete; Submit becomes "Start your free week"; "Free for 7 days. No card needed." goes under it. Five of five
// now say what it is, and trial starts rise from 2.1% to 3.4%. Pure function of t (0–36). Also exports `HeroMock`
// for `copy-swap`.
import { SUKOON_DRAFTS, copyLine, flaggedWords, wordsOf } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';
import { MarkArt, SUKOON } from './LogoProcess';

const W = 960, H = 540;
const RED = '#B42318', GREEN = '#067647';
const first = (k: keyof typeof SUKOON_DRAFTS) => { const d = SUKOON_DRAFTS[k]; return copyLine(d, d.segments.map(() => 0)); };
const OLD = { head: first('launchHead'), sub: first('launchSub'), cta: first('launchCta') };
const NEW = { head: 'Calm in five minutes, between meetings', sub: 'Five-minute guided sessions you can do at your desk, in a cab or before a call.', cta: 'Start your free week', safe: 'Free for 7 days. No card needed.' };

/** Greedy wrap by characters, for SVG text. */
const wrap = (s: string, per: number) => wordsOf(s).reduce<string[]>((acc, w) => { const l = acc.at(-1); if (l !== undefined && l.length + 1 + w.length <= per) acc[acc.length - 1] = `${l} ${w}`; else acc.push(w); return acc; }, []);

/** A line of words with the flagged ones struck through in red as `strike` goes 0 → 1. */
function Flagged({ text, x, y, size, per, strike = 0, weight = 700 }: { text: string; x: number; y: number; size: number; per: number; strike?: number; weight?: number }) {
  const flags = flaggedWords(text);
  let i = 0;
  return (
    <g>
      {wrap(text, per).map((line, li) => (
        <text key={li} x={x} y={y + li * size * 1.3} fontSize={size} fontWeight={weight} fill={SUKOON.ink}>
          {wordsOf(line).map((w, wi) => { const bad = flags[i++]; return <tspan key={wi} fill={bad && strike > 0 ? RED : undefined} textDecoration={bad && strike > 0.5 ? 'line-through' : undefined}>{wi ? ' ' : ''}{w}</tspan>; })}
        </text>
      ))}
    </g>
  );
}

/** A launch-page hero in a browser frame, `w` wide: headline, sub, button and the line under it. */
export function HeroMock({ head, sub, cta, safe, x = 0, y = 0, w = 480, o = 1 }: { head: string; sub: string; cta: string; safe?: string; x?: number; y?: number; w?: number; o?: number }) {
  const per = Math.floor(w / 17);
  const heads = wrap(head, Math.floor(w / 16.5)), subs = wrap(sub, Math.floor(w / 8.4));
  const subY = 92 + heads.length * 36, ctaY = subY + subs.length * 20 + 18;
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <rect width={w} height={ctaY + 96} rx={14} fill={SUKOON.sand} stroke={SC.line} strokeWidth={2} />
      <rect width={w} height={30} rx={14} fill="#FFFFFF" />
      {[0, 1, 2].map(i => <circle key={i} cx={18 + i * 14} cy={15} r={4} fill="#D0D5DD" />)}
      <text x={70} y={20} fontSize={11} fontWeight={700} fill="#475467">sukoon.app</text>
      <MarkArt k="breath" x={20} y={40} size={26} />
      <text x={52} y={60} fontSize={14} fontWeight={900} fill={SUKOON.ink}>Sukoon</text>
      {heads.map((l, i) => <text key={i} x={20} y={110 + i * 36} fontSize={30} fontWeight={900} fill={SUKOON.ink}>{l}</text>)}
      {subs.map((l, i) => <text key={i} x={20} y={subY + 20 + i * 20} fontSize={15} fill={SUKOON.ink}>{l}</text>)}
      <rect x={20} y={ctaY} width={Math.min(w - 40, 40 + cta.length * 9)} height={44} rx={22} fill={SUKOON.sage} />
      <text x={20 + Math.min(w - 40, 40 + cta.length * 9) / 2} y={ctaY + 28} textAnchor="middle" fontSize={15} fontWeight={800} fill="#FFFFFF">{cta.length > per * 2 ? `${cta.slice(0, per * 2 - 1)}…` : cta}</text>
      {safe && <text x={20} y={ctaY + 70} fontSize={12} fontWeight={700} fill={SUKOON.ink}>{safe.length > per * 3 ? `${safe.slice(0, per * 3 - 1)}…` : safe}</text>}
    </g>
  );
}

const PEOPLE = [
  { n: 'Riya', before: 'Some AI thing?', after: 'Five-minute meditation' },
  { n: 'Arjun', before: 'A wellness community?', after: 'Calm between meetings' },
  { n: 'Meher', before: 'No idea, honestly', after: 'A quick meditation app' },
  { n: 'Vikram', before: 'An ecosystem… of what?', after: 'Meditation for work days' },
  { n: 'Sana', before: 'A course about potential?', after: 'Short sessions, free week' },
];

export function ConversionCopyScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const head = t < 13 ? OLD.head : NEW.head;
  const sub = t < 18 ? OLD.sub : NEW.sub;
  const cta = t < 22.4 ? OLD.cta : NEW.cta;
  const safe = t >= 27 ? NEW.safe : undefined;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: the agency's hero for Sukoon reads "${OLD.head}", with a sub about passionate experts and a Submit button. In a five-second test, none of five people can say what it does. The headline is rewritten from interview words as "${NEW.head}"; the sub becomes "${NEW.sub}"; the button becomes "${NEW.cta}", with "${NEW.safe}" under it. Five of five now say what it is, and trial starts rise from 2.1% to 3.4% of visitors.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>
          {t < 6 ? 'The agency’s hero' : t < 11 ? 'A five-second test' : t < 16 ? 'The visitor’s words' : t < 21 ? 'How, and for whom' : t < 26 ? 'A button that promises' : t < 31 ? 'The fear before the click' : 'Tested'}
        </text>

        {(t < 6 || t >= 11) && t < 31 && (
          <g>
            <HeroMock head={head} sub={sub} cta={cta} safe={safe} x={60} y={90} w={480} o={t < 13 && t >= 11 ? 1 - 0.3 * p(t, 12, 13) : 1} />
            {t < 6 && (
              <g opacity={p(t, 2.6, 3.2)}>
                <Flagged text={OLD.head} x={600} y={140} size={16} per={36} strike={p(t, 3.4, 4.4)} weight={800} />
                <text x={600} y={240} fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 4.4, 5)}>Nine words, and three nobody can picture.</text>
              </g>
            )}
            {t >= 11 && t < 16 && (
              <g transform="translate(600 120)">
                {['“I can’t switch off.”', '“I’ve only got five minutes.”', '“Between calls I’m wired.”'].map((q, i) => (
                  <g key={q} opacity={p(t, 11.2 + i * 0.5, 11.7 + i * 0.5)} transform={`translate(${lerp(40, 0, p(t, 11.2 + i * 0.5, 11.8 + i * 0.5))} ${i * 52})`}>
                    <rect width={290} height={40} rx={20} fill={SC.surface} stroke={SC.line} />
                    <text x={16} y={26} fontSize={15} fontWeight={700} fill={SC.text}>{q}</text>
                  </g>
                ))}
                <text x={0} y={200} fontSize={14} fontWeight={800} fill={SC.muted} opacity={p(t, 13.2, 13.8)}>From interviews and Play Store reviews.</text>
              </g>
            )}
            {t >= 16 && t < 21 && (
              <g transform="translate(600 130)">
                <Flagged text={OLD.sub} x={0} y={0} size={15} per={36} strike={p(t, 16.4, 17.4)} />
                <text x={0} y={120} fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 18.2, 18.8)}>We becomes you. Platform becomes</text>
                <text x={0} y={142} fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 18.2, 18.8)}>a desk, a cab, a call.</text>
              </g>
            )}
            {t >= 21 && t < 26 && (
              <g transform="translate(600 150)">
                <text x={0} y={0} fontSize={28} fontWeight={900} fill={RED} textDecoration={t > 22 ? 'line-through' : undefined}>Submit</text>
                <text x={0} y={30} fontSize={14} fontWeight={800} fill={SC.muted}>What a form does</text>
                <text x={0} y={100} fontSize={28} fontWeight={900} fill={GREEN} opacity={p(t, 22.4, 23)}>Start your free week</text>
                <text x={0} y={130} fontSize={14} fontWeight={800} fill={SC.muted} opacity={p(t, 22.6, 23.2)}>What you do, and what you get</text>
              </g>
            )}
            {t >= 26 && t < 31 && (
              <g transform="translate(600 140)">
                <text x={0} y={0} fontSize={16} fontWeight={800} fill={SC.text}>Right before pressing, people wonder:</text>
                <text x={0} y={34} fontSize={16} fontWeight={800} fill={SC.muted} opacity={p(t, 26.4, 27)}>“Will they charge my card?”</text>
                <text x={0} y={60} fontSize={16} fontWeight={800} fill={SC.muted} opacity={p(t, 26.6, 27.2)}>“Can I get out of it?”</text>
                <g opacity={p(t, 28.4, 29)}>
                  <rect x={0} y={96} width={290} height={70} rx={10} fill={SC.surface} stroke={SC.line} />
                  <text x={14} y={122} fontSize={12} fontWeight={800} fill={SC.muted}>The legal line moves to the sign-up screen,</text>
                  <text x={14} y={144} fontSize={12} fontWeight={800} fill={SC.muted}>where people agree to it.</text>
                </g>
              </g>
            )}
          </g>
        )}

        {((t >= 6 && t < 11) || t >= 31) && (
          <g transform="translate(80 110)">
            {PEOPLE.map((pp, i) => {
              const ok = t >= 31;
              return (
                <g key={pp.n} transform={`translate(${i * 165} 0)`} opacity={p(t, (ok ? 31.2 : 6.2) + i * 0.4, (ok ? 31.6 : 6.6) + i * 0.4)}>
                  <circle cx={60} cy={40} r={30} fill={ok ? '#DCEBE5' : '#E4E7EC'} />
                  <text x={60} y={47} textAnchor="middle" fontSize={18} fontWeight={900} fill={SUKOON.ink}>{pp.n[0]}</text>
                  <text x={60} y={92} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.muted}>{pp.n}</text>
                  <rect x={0} y={108} width={150} height={52} rx={12} fill={SC.surface} stroke={ok ? GREEN : RED} strokeWidth={1.5} />
                  {wrap(ok ? pp.after : pp.before, 20).map((l, li) => <text key={li} x={10} y={130 + li * 17} fontSize={13} fontWeight={700} fill={SC.text}>{l}</text>)}
                </g>
              );
            })}
            {t < 11 && <text x={0} y={220} fontSize={17} fontWeight={800} fill={SC.text} opacity={p(t, 8.6, 9.2)}>“What does this do, and who is it for?” Five seconds each. Nobody knows.</text>}
            {t >= 31 && (
              <g opacity={p(t, 33, 33.6)} transform="translate(0 210)">
                <text x={0} y={20} fontSize={14} fontWeight={800} fill={SC.muted}>Trial starts per visitor, two-week A/B test</text>
                <rect x={0} y={36} width={21 * 12} height={30} rx={6} fill="#98A2B3" />
                <text x={21 * 12 + 10} y={57} fontSize={15} fontWeight={900} fill={SC.text}>2.1% old hero</text>
                <rect x={0} y={76} width={34 * 12 * p(t, 33.4, 34.4)} height={30} rx={6} fill={SUKOON.sage} />
                <text x={34 * 12 + 10} y={97} fontSize={15} fontWeight={900} fill={GREEN}>3.4% new hero</text>
              </g>
            )}
          </g>
        )}
      </g>
    </svg>
  );
}
