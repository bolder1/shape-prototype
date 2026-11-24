'use client';
// Scene for dc.2-3: white on Gaadi's green-600 fails contrast (`onGreen`). Sana repoints color.action.primary to
// green-700 (`TOKEN_CHANGE`): one line in tokens.json. Style Dictionary names it for each platform (`platformName`),
// the release turns every button that follows the token green-700, and the lines with a copied value or a primitive
// stay green-600 (`refKind`, `renderedGreen`). A token lint flags them (`lintFlags`); they move to tokens.
// Pure function of t (0–36). Also exports `REF_TONE`, `REF_NAME`, `PLATFORM_NAME` and `GreenButton` for `token-trace`.
import { GAADI_CODE, GAADI_GREENS, TOKEN_CHANGE, TOKEN_PLATFORMS, lintFlags, onGreen, platformName, refKind, renderedGreen, type GaadiCode, type GaadiGreen, type RefKind, type TokenPlatform } from '@shape/content';
import { back, clamp, Grid, p, SC } from './shared';

const W = 960, H = 540;
export const REF_TONE: Record<RefKind, string> = { follows: SC.mint, primitive: SC.design, literal: SC.error };
export const REF_NAME: Record<RefKind, string> = { follows: 'Follows the token', primitive: 'Points at the palette', literal: 'Value copied in' };
export const PLATFORM_NAME: Record<TokenPlatform, string> = { web: 'Web · CSS', android: 'Android · Kotlin', ios: 'iOS · Swift' };
const KEYS = Object.keys(GAADI_CODE) as GaadiCode[];
const FLAGGED = lintFlags(KEYS);
const ratio = (g: GaadiGreen) => `${onGreen(g).toFixed(1)}:1`;
const MONO = 'ui-monospace, Consolas, monospace';

/** A green button with its contrast badge. Green-600 is drawn as it really is: failing. */
export function GreenButton({ x, y, g, label, w = 180 }: { x: number; y: number; g: GaadiGreen; label: string; w?: number }) {
  const pass = onGreen(g) >= 4.5;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={44} rx={12} fill={GAADI_GREENS[g]} />
      <text x={w / 2} y={28} textAnchor="middle" fontSize={15} fontWeight={900} fill="#FFFFFF">{label}</text>
      <rect x={w + 10} y={8} width={86} height={28} rx={14} fill={SC.surface} stroke={pass ? SC.mint : SC.error} strokeWidth={2} />
      <text x={w + 53} y={27} textAnchor="middle" fontSize={13} fontWeight={900} fill={SC.text}>{ratio(g)}</text>
    </g>
  );
}

export function TokenPipelineScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const after = t >= 16;
  const moved = t >= 31;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: white text on Gaadi's green-600 is ${ratio(TOKEN_CHANGE.from)}, failing WCAG. Sana repoints ${TOKEN_CHANGE.token} to green-700, ${ratio(TOKEN_CHANGE.to)}: one line in tokens.json. Style Dictionary builds it as ${platformName(TOKEN_CHANGE.token, 'web')} for the web and actionPrimary for Android and iOS. After the release, every button using the token is green-700 on all three platforms. Lines with a copied hex or a green-600 primitive stay green-600. A token lint flags ${FLAGGED.length} lines, and they move to tokens.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>
          {t < 6 ? 'A failing green' : t < 11 ? 'One line at the source' : t < 16 ? 'One file, three platforms' : t < 21 ? 'The release goes out' : t < 26 ? 'Six lines stay green-600' : t < 31 ? 'A lint in review' : 'Next time, one line'}
        </text>

        {t < 6 && (
          <g>
            {['Confirm', 'Book seat', 'Pay ₹230'].map((l, i) => (
              <g key={l} opacity={p(t, 0.4 + i * 0.4, 0.9 + i * 0.4)}><GreenButton x={120} y={130 + i * 80} g="green.600" label={l} w={220} /></g>
            ))}
            <text x={120} y={420} fontSize={17} fontWeight={800} fill={SC.muted} opacity={p(t, 2, 2.5)}>White text needs 4.5:1. Every action button in Gaadi fails.</text>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g>
            <g transform="translate(80 110)" opacity={p(t, 6, 6.5)}>
              <rect width={380} height={200} rx={16} fill={SC.surface} stroke={SC.line} />
              <text x={20} y={34} fontSize={14} fontWeight={900} fill={SC.text}>Figma variables · Semantic</text>
              <text x={20} y={80} fontSize={15} fontWeight={800} fill={SC.text} fontFamily={MONO}>{TOKEN_CHANGE.token}</text>
              <g transform="translate(20 104)">
                <rect width={22} height={22} rx={5} fill={GAADI_GREENS[t < 7.5 ? TOKEN_CHANGE.from : TOKEN_CHANGE.to]} />
                <text x={32} y={17} fontSize={15} fontWeight={800} fill={SC.text} fontFamily={MONO}>→ {t < 7.5 ? TOKEN_CHANGE.from : TOKEN_CHANGE.to}</text>
              </g>
              <text x={20} y={170} fontSize={13} fontWeight={700} fill={SC.muted}>{t < 7.5 ? ratio(TOKEN_CHANGE.from) : ratio(TOKEN_CHANGE.to)} with white text</text>
            </g>
            <g transform="translate(500 110)" opacity={p(t, 8, 8.6)} fontFamily={MONO}>
              <rect width={400} height={200} rx={16} fill="#0F172A" />
              <text x={20} y={34} fontSize={13} fontWeight={800} fill="#93C5FD">tokens.json · 1 line changed</text>
              <text x={20} y={86} fontSize={14} fontWeight={700} fill="#E2E8F0">{'"color.action.primary": {'}</text>
              <rect x={14} y={100} width={372} height={28} fill="#7F1D1D" opacity={0.6} />
              <text x={20} y={119} fontSize={14} fontWeight={700} fill="#FECACA">{'-  "value": "{green.600}"'}</text>
              <rect x={14} y={132} width={372} height={28} fill="#14532D" opacity={0.7} />
              <text x={20} y={151} fontSize={14} fontWeight={700} fill="#BBF7D0">{'+  "value": "{green.700}"'}</text>
              <text x={20} y={184} fontSize={14} fontWeight={700} fill="#E2E8F0">{'}'}</text>
            </g>
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g>
            {[{ x: 60, l: 'tokens.json' }, { x: 300, l: 'Style Dictionary' }].map((b, i) => (
              <g key={b.l} transform={`translate(${b.x} 230)`} opacity={p(t, 11 + i * 0.6, 11.5 + i * 0.6)}>
                <rect width={190} height={60} rx={14} fill={SC.surface} stroke={i ? SC.design : SC.discover} strokeWidth={2.5} />
                <text x={95} y={37} textAnchor="middle" fontSize={16} fontWeight={900} fill={SC.text}>{b.l}</text>
                <line x1={190} x2={240} y1={30} y2={30} stroke={SC.line} strokeWidth={3} />
              </g>
            ))}
            {TOKEN_PLATFORMS.map((pl, i) => (
              <g key={pl} transform={`translate(560 ${130 + i * 100})`} opacity={p(t, 12.4 + i * 0.6, 12.9 + i * 0.6)}>
                <path d={`M-70 ${130 - i * 100} C -30 ${130 - i * 100}, -40 30, 0 30`} fill="none" stroke={SC.line} strokeWidth={3} />
                <rect width={340} height={64} rx={14} fill={SC.surface} stroke={SC.grow} strokeWidth={2} />
                <text x={18} y={26} fontSize={13} fontWeight={800} fill={SC.muted}>{PLATFORM_NAME[pl]}</text>
                <text x={18} y={48} fontSize={14} fontWeight={800} fill={SC.text} fontFamily={MONO}>{platformName(TOKEN_CHANGE.token, pl)}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 16 && t < 31 && (
          <g>
            {TOKEN_PLATFORMS.map((pl, i) => {
              const ks = KEYS.filter(k => GAADI_CODE[k].platform === pl);
              return (
                <g key={pl} transform={`translate(${60 + i * 290} 100)`} opacity={p(t, 16 + i * 0.4, 16.6 + i * 0.4)}>
                  <rect width={270} height={t >= 26 ? 270 : 360} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                  <text x={18} y={32} fontSize={14} fontWeight={900} fill={SC.text}>{PLATFORM_NAME[pl]}</text>
                  {ks.map((k, j) => {
                    const stale = t >= 21 && refKind(GAADI_CODE[k].code) !== 'follows';
                    return (
                      <g key={k} transform={`translate(18 ${52 + j * (t >= 26 ? 54 : 76)})`}>
                        <text x={0} y={12} fontSize={12} fontWeight={800} fill={stale ? SC.error : SC.muted}>{GAADI_CODE[k].where}{stale ? ' · missed' : ''}</text>
                        {t < 26 && <GreenButton x={0} y={22} g={renderedGreen(GAADI_CODE[k].code, after)} label={GAADI_CODE[k].where.split(' ')[0]} w={130} />}
                        {t >= 26 && <rect x={0} y={20} width={234} height={30} rx={6} fill={stale ? SC.soft : 'none'} stroke={stale ? SC.error : SC.line} />}
                        {t >= 26 && <text x={8} y={40} fontSize={10.5} fontWeight={700} fill={SC.text} fontFamily={MONO}>{GAADI_CODE[k].code.length > 34 ? `${GAADI_CODE[k].code.slice(0, 33)}…` : GAADI_CODE[k].code}</text>}
                      </g>
                    );
                  })}
                </g>
              );
            })}
            {t >= 26 && (
              <g transform="translate(60 380)" opacity={p(t, 26.4, 27)} fontFamily={MONO}>
                <rect width={840} height={110} rx={14} fill="#0F172A" />
                <text x={20} y={34} fontSize={14} fontWeight={800} fill="#FCA5A5">token-lint: {FLAGGED.length} problems</text>
                <text x={20} y={62} fontSize={13} fontWeight={700} fill="#E2E8F0">{FLAGGED.filter(k => refKind(GAADI_CODE[k].code) === 'literal').length} hard-coded colours · {FLAGGED.filter(k => refKind(GAADI_CODE[k].code) === 'primitive').length} primitives in component code</text>
                <text x={20} y={90} fontSize={13} fontWeight={700} fill="#94A3B8">Use a semantic token, e.g. {platformName(TOKEN_CHANGE.token, 'web')}</text>
              </g>
            )}
          </g>
        )}

        {moved && (
          <g opacity={p(t, 31, 31.6)}>
            {TOKEN_PLATFORMS.map((pl, i) => (
              <g key={pl} transform={`translate(${60 + i * 290} 120)`}>
                <text x={0} y={0} fontSize={14} fontWeight={900} fill={SC.text}>{PLATFORM_NAME[pl]}</text>
                {[0, 1, 2].map(j => <g key={j} opacity={p(t, 31.4 + j * 0.3 + i * 0.2, 31.8 + j * 0.3 + i * 0.2)}><GreenButton x={0} y={20 + j * 64} g={TOKEN_CHANGE.to} label={['Confirm', 'Pay', 'Seat'][j]} w={140} /></g>)}
              </g>
            ))}
            <g transform="translate(60 380)" opacity={p(t, 33, 33.6)}>
              <rect width={840} height={80} rx={14} fill={SC.surface} stroke={SC.mint} strokeWidth={2.5} />
              <text x={24} y={34} fontSize={17} fontWeight={900} fill={SC.text}>{FLAGGED.length} lines moved to tokens. 0 lint problems.</text>
              <text x={24} y={60} fontSize={14} fontWeight={700} fill={SC.muted}>Next up, the dark theme: one file, every button.</text>
            </g>
          </g>
        )}
      </g>
    </svg>
  );
}
