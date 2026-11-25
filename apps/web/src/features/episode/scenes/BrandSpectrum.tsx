'use client';
// Scene for br.4-2: Sukoon has twelve things to name (`SUKOON_OFFERS`). Ishita lays out Aaker and Joachimsthaler's
// brand relationship spectrum, then asks the four questions in `archCall`'s order (promise, risk, equity, buyer) and
// ends on the family tree, each offering named by `archName`. Pure function of t (0–36). Also exports `ARCH_FILL` and
// `ARCH_LABEL`, which `family-sort` uses to draw the same tree.
import { ARCH_CALLS, SUKOON_OFFERS, archCall, archName, type ArchCall, type SukoonOffer } from '@shape/content';
import { back, clamp, Grid, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per place in the family; white text on each passes 4.5:1. */
export const ARCH_FILL: Record<ArchCall, string> = { master: '#067647', sub: '#175CD3', endorsed: '#6941C6', own: '#B42318' };
export const ARCH_LABEL: Record<ArchCall, string> = { master: 'Just Sukoon', sub: 'Sub-brand', endorsed: 'Endorsed', own: 'Own brand' };

const KEYS = Object.keys(SUKOON_OFFERS) as SukoonOffer[];
const of = (c: ArchCall) => KEYS.filter(k => archCall(SUKOON_OFFERS[k]) === c);
const SPECTRUM: [string, string, string][] = [['Branded house', 'Google Maps', 'master'], ['Sub-brand', 'Amazon Prime', 'sub'], ['Endorsed', 'Courtyard by Marriott', 'endorsed'], ['House of brands', 'Surf Excel (HUL)', 'own']];
/** The step of the four questions that settles each kept-apart offering, for the acts that pull them out. */
const ACTS: { from: number; keys: SukoonOffer[]; head: string; why: string }[] = [
  { from: 11, keys: ['prana'], head: 'Breaks the promise', why: 'Hour-long classes aren’t five minutes.' },
  { from: 16, keys: ['therapy', 'gummies'], head: 'Could break it', why: 'One bad headline would be about Sukoon.' },
  { from: 21, keys: of('endorsed'), head: 'Equity Sukoon bought', why: 'Keep the name; add “by Sukoon”.' },
  { from: 26, keys: of('sub'), head: 'A different buyer', why: 'HR, parents and counsellors choose.' },
];

export function BrandSpectrumScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'Twelve things to name' : t < 11 ? 'The spectrum' : t < 16 ? 'Does it keep the promise?' : t < 21 ? 'Could it break it?' : t < 26 ? 'Equity you bought' : t < 31 ? 'A different buyer' : 'The family tree';
  const act = ACTS.find(a => t >= a.from && t < a.from + 5);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Sukoon has twelve things to name: ${KEYS.map(k => SUKOON_OFFERS[k].short).join(', ')}. Ishita lays out the brand relationship spectrum, from a branded house like Google Maps, through a sub-brand like Amazon Prime and an endorsed brand like Courtyard by Marriott, to a house of brands like Hindustan Unilever’s Surf Excel. She asks four questions in order. Does it keep the promise, calm in five minutes? Prana Studios’ hour-long classes don’t, so it keeps its own name. Could a failure break the promise? Therapy and gummies could, so they get their own brands, Saath and Thehrav. Does it have equity Sukoon bought? Neend and Pause keep their names, endorsed by Sukoon. Does someone else choose or pay? Teams, Kids and Pro become Sukoon sub-brands. Everything else is just Sukoon with a plain description: ${of('master').map(k => archName(SUKOON_OFFERS[k])).join(', ')}.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && KEYS.map((k, i) => {
          const col = i % 3, row = Math.floor(i / 3);
          return (
            <g key={k} opacity={p(t, 0.3 + i * 0.25, 0.8 + i * 0.25)}>
              <rect x={32 + col * 196} y={70 + row * 64} width={184} height={50} rx={25} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text x={124 + col * 196} y={102 + row * 64} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="middle">{SUKOON_OFFERS[k].short}</text>
            </g>
          );
        })}

        {t >= 6 && t < 11 && (
          <g>
            <line x1={48} y1={120} x2={592} y2={120} stroke={SC.text} strokeWidth={3} />
            <text x={32} y={92} fontSize={21} fontWeight={800} fill={SC.muted}>One name</text>
            <text x={608} y={92} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="end">Each on its own</text>
            {SPECTRUM.map(([name, eg, c], i) => (
              <g key={name} opacity={p(t, 6.4 + i * 0.8, 7 + i * 0.8)}>
                <circle cx={80 + i * 160} cy={120} r={12} fill={ARCH_FILL[c as ArchCall]} />
                <rect x={8 + i * 160} y={150} width={144} height={130} rx={12} fill={SC.surface} stroke={ARCH_FILL[c as ArchCall]} strokeWidth={2} />
                {name.split(' ').reduce<string[]>((ls, w) => { const l = ls[ls.length - 1]; if (l && (l + ' ' + w).length <= 11) ls[ls.length - 1] = l + ' ' + w; else ls.push(w); return ls; }, []).map((l, j) => (
                  <text key={j} x={80 + i * 160} y={180 + j * 24} fontSize={21} fontWeight={900} fill={ARCH_FILL[c as ArchCall]} textAnchor="middle">{l}</text>
                ))}
                {eg.split(' ').reduce<string[]>((ls, w) => { const l = ls[ls.length - 1]; if (l && (l + ' ' + w).length <= 12) ls[ls.length - 1] = l + ' ' + w; else ls.push(w); return ls; }, []).map((l, j) => (
                  <text key={j} x={80 + i * 160} y={236 + j * 22} fontSize={21} fontWeight={700} fill={SC.text} textAnchor="middle">{l}</text>
                ))}
              </g>
            ))}
            <text x={32} y={330} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 9.6, 10.2)}>Further right: more protection, more to pay for.</text>
          </g>
        )}

        {act && (
          <g>
            <text x={32} y={88} fontSize={21} fontWeight={800} fill={SC.muted}>{act.head}</text>
            {act.keys.map((k, i) => {
              const o = SUKOON_OFFERS[k], c = archCall(o);
              const k1 = p(t, act.from + 0.6 + i * 0.6, act.from + 1.6 + i * 0.6);
              return (
                <g key={k} opacity={p(t, act.from + 0.2 + i * 0.4, act.from + 0.7 + i * 0.4)}>
                  <rect x={32} y={110 + i * 66} width={250} height={52} rx={26} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                  <text x={157} y={144 + i * 66} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="middle">{o.short}</text>
                  <line x1={290} y1={136 + i * 66} x2={290 + 40 * k1} y2={136 + i * 66} stroke={SC.text} strokeWidth={3} strokeLinecap="round" />
                  <g opacity={k1}>
                    <rect x={340} y={110 + i * 66} width={268} height={52} rx={26} fill={ARCH_FILL[c]} />
                    <text x={474} y={144 + i * 66} fontSize={21} fontWeight={800} fill="#fff" textAnchor="middle">{archName(o)}</text>
                  </g>
                </g>
              );
            })}
            <text x={32} y={334} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, act.from + 2.8, act.from + 3.4)}>{act.why}</text>
          </g>
        )}

        {t >= 31 && (
          <g>
            <rect x={240} y={58} width={160} height={44} rx={10} fill={ARCH_FILL.master} />
            <text x={320} y={88} fontSize={22} fontWeight={900} fill="#fff" textAnchor="middle">Sukoon</text>
            {(ARCH_CALLS.filter(c => c !== 'own')).map((c, i) => {
              const x = 32 + i * 200;
              return (
                <g key={c} opacity={p(t, 31.3 + i * 0.6, 31.9 + i * 0.6)}>
                  <line x1={320} y1={102} x2={x + 92} y2={122} stroke={SC.line} strokeWidth={2} />
                  <text x={x} y={142} fontSize={21} fontWeight={900} fill={ARCH_FILL[c]}>{ARCH_LABEL[c]}</text>
                  {of(c).map((k, j) => (
                    <text key={k} x={x} y={170 + j * 26} fontSize={21} fontWeight={700} fill={SC.text}>{c === 'master' ? SUKOON_OFFERS[k].short : archName(SUKOON_OFFERS[k])}</text>
                  ))}
                </g>
              );
            })}
            <g opacity={p(t, 33.4, 34)}>
              <rect x={32} y={286} width={576} height={50} rx={12} fill={SC.surface} stroke={ARCH_FILL.own} strokeWidth={2} strokeDasharray="6 6" />
              <text x={52} y={318} fontSize={21} fontWeight={800} fill={SC.text}>Kept apart: {of('own').map(k => SUKOON_OFFERS[k].name).join(', ')}</text>
            </g>
          </g>
        )}
      </g>
    </svg>
  );
}
