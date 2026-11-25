'use client';
// Scene for ds.5-2: the same Sawari booking on iOS, Android and the web. Android showed the ₹62 fee after Pay; the
// web copied the iPhone's wheel picker. Then the three kinds of decision (`PARITY_CALLS`): the same everywhere, adapted
// to each platform's units, and each platform's own control, drawn from `SAWARI_DECISIONS`; the platform table in a
// component spec; and the parity check at release. Pure function of t (0–36). Also exports `PARITY_FILL` and `Frame`,
// which `parity-sort` uses.
import { PARITY_PLATFORMS, PARITY_PLATFORM_LABEL, SAWARI_DECISIONS, type ParityCall, type ParityPlatform } from '@shape/content';
import { back, clamp, Grid, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per parity call; white text on each passes 4.5:1. */
export const PARITY_FILL: Record<ParityCall, string> = { same: '#175CD3', adapt: '#0E7090', native: '#C11574' };
const FX = [32, 230, 428], FW = 180;

/** A device frame: a notch for iOS, a status dot for Android, an address bar for the web. */
export function Frame({ x, y, w, h, platform, o = 1, children }: { x: number; y: number; w: number; h: number; platform: ParityPlatform; o?: number; children?: React.ReactNode }) {
  return (
    <g opacity={o}>
      <rect x={x} y={y} width={w} height={h} rx={platform === 'web' ? 8 : 22} fill={SC.surface} stroke={SC.line} strokeWidth={3} />
      {platform === 'ios' && <rect x={x + w / 2 - 26} y={y + 8} width={52} height={12} rx={6} fill={SC.line} />}
      {platform === 'android' && <circle cx={x + w / 2} cy={y + 14} r={5} fill={SC.line} />}
      {platform === 'web' && <rect x={x + 10} y={y + 8} width={w - 20} height={14} rx={7} fill={SC.soft} />}
      <text x={x + w / 2} y={y + h + 28} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="middle">{PARITY_PLATFORM_LABEL[platform]}</text>
      {children}
    </g>
  );
}

/** Greedy word wrap by character count, for text inside a narrow frame. */
export function wrapWords(s: string, max = 13): string[] {
  const lines: string[] = [];
  for (const w of s.split(' ')) {
    const last = lines[lines.length - 1];
    if (last !== undefined && (last + ' ' + w).length <= max) lines[lines.length - 1] = last + ' ' + w;
    else lines.push(w);
  }
  return lines;
}

/** Three frames side by side, each with what `say` gives for its platform, wrapped. */
function Three({ say, fill }: { say: (pl: ParityPlatform) => string; fill: string }) {
  return (
    <g>
      {PARITY_PLATFORMS.map((pl, i) => {
        const lines = wrapWords(say(pl));
        return (
          <Frame key={pl} x={FX[i]} y={70} w={FW} h={200} platform={pl}>
            {lines.map((l, j) => (
              <text key={j} x={FX[i] + FW / 2} y={178 - (lines.length - 1) * 14 + j * 28} fontSize={21} fontWeight={800} fill={fill} textAnchor="middle">{l}</text>
            ))}
          </Frame>
        );
      })}
    </g>
  );
}

export function PlatformParityScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'Three apps, one ticket' : t < 11 ? 'Identical isn’t the goal' : t < 16 ? 'Same: what it means' : t < 21 ? 'Adapt: how it’s measured' : t < 26 ? 'Native: what the OS owns' : t < 31 ? 'One table per component' : 'Checked at release';
  const D = SAWARI_DECISIONS;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: the same Sawari coach seat booked on iOS, Android and the web. On Android the 62 rupee convenience fee appears after Pay, on the others before it. The web team copied the iPhone's wheel picker, which fights the keyboard and screen readers. What the product means is the same everywhere: the fare and fees, the steps, the error words, the brand. Some things are adapted to each platform's units: body text at 17 points, 16 sp and 1 rem; tap areas of 44 points, 48 dp and 44 pixels. Some are each platform's own: going back, sharing, switches, time pickers. Each component spec has a platform table, and the shared rows are checked on all three platforms at every release. The fee now shows before Pay everywhere.">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            {PARITY_PLATFORMS.map((pl, i) => {
              const late = pl === 'android';
              return (
                <Frame key={pl} x={FX[i]} y={70} w={FW} h={200} platform={pl} o={p(t, 0.3 + i * 0.4, 0.9 + i * 0.4)}>
                  <text x={FX[i] + 16} y={124} fontSize={21} fontWeight={800} fill={SC.text}>₹1,240</text>
                  <g opacity={late ? 0 : 1}><text x={FX[i] + 16} y={156} fontSize={21} fontWeight={700} fill={SC.muted}>+ ₹62 fee</text></g>
                  <rect x={FX[i] + 16} y={192} width={FW - 32} height={40} rx={10} fill={SC.text} />
                  <text x={FX[i] + FW / 2} y={219} fontSize={21} fontWeight={800} fill="#fff" textAnchor="middle">Pay</text>
                  {late && <text x={FX[i] + FW / 2} y={258} fontSize={21} fontWeight={800} fill={SC.error} textAnchor="middle" opacity={p(t, 2.4, 3)}>+ ₹62 after</text>}
                </Frame>
              );
            })}
            <text x={320} y={338} fontSize={21} fontWeight={800} fill={SC.error} textAnchor="middle" opacity={p(t, 3.4, 4)}>300 support calls in a week</text>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g>
            {PARITY_PLATFORMS.map((pl, i) => (
              <Frame key={pl} x={FX[i]} y={70} w={FW} h={200} platform={pl} o={pl === 'android' ? 0.4 : 1}>
                {pl !== 'android' && [0, 1, 2].map(r => (
                  <text key={r} x={FX[i] + FW / 2} y={140 + r * 40} fontSize={r === 1 ? 24 : 21} fontWeight={r === 1 ? 900 : 600} fill={r === 1 ? SC.text : SC.muted} textAnchor="middle">{['06:30', '07:00', '07:30'][r]}</text>
                ))}
              </Frame>
            ))}
            <g opacity={p(t, 7, 7.6)}>
              <rect x={428} y={286} width={180} height={34} rx={17} fill={SC.error} />
              <text x={518} y={310} fontSize={21} fontWeight={800} fill="#fff" textAnchor="middle">Copied wheel</text>
            </g>
            <text x={32} y={310} fontSize={21} fontWeight={700} fill={SC.muted} opacity={p(t, 8, 8.6)}>Keyboard ✕ · screen reader ✕</text>
          </g>
        )}

        {t >= 11 && t < 16 && (() => {
          const rows = [D.fare, D.steps, D.upiError] as const;
          const k = Math.min(2, Math.floor((t - 11) / 1.6));
          return (
            <g>
              <Three say={pl => rows[k].show[pl]} fill={SC.text} />
              <text x={320} y={338} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="middle">{['Fare and fee', 'Steps', 'Error words'][k]}: identical</text>
            </g>
          );
        })()}

        {t >= 16 && t < 21 && (() => {
          const rows = [D.bodySize, D.target] as const;
          const k = t < 18.5 ? 0 : 1;
          return (
            <g>
              {PARITY_PLATFORMS.map((pl, i) => (
                <Frame key={pl} x={FX[i]} y={70} w={FW} h={200} platform={pl}>
                  <text x={FX[i] + FW / 2} y={170} fontSize={24} fontWeight={900} fill={SC.text} textAnchor="middle">{rows[k].show[pl].split(',')[0]}</text>
                  <text x={FX[i] + FW / 2} y={206} fontSize={21} fontWeight={700} fill={SC.muted} textAnchor="middle">{rows[k].show[pl].split(', ')[1] ?? ''}</text>
                </Frame>
              ))}
              <text x={320} y={338} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="middle">{k ? 'One token: minimum target' : 'One token: body text'}</text>
            </g>
          );
        })()}

        {t >= 21 && t < 26 && (() => {
          const rows = [D.back, D.share, D.time] as const;
          const k = Math.min(2, Math.floor((t - 21) / 1.6));
          return (
            <g>
              <Three say={pl => rows[k].show[pl].split(',')[0]} fill={SC.text} />
              <text x={320} y={338} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="middle">{['Going back', 'Sharing a ticket', 'Picking a time'][k]}: each its own</text>
            </g>
          );
        })()}

        {t >= 26 && t < 31 && (
          <g>
            <rect x={32} y={64} width={576} height={276} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            <text x={52} y={98} fontSize={22} fontWeight={900} fill={SC.text}>Button · platform table</text>
            {([
              { c: 'same' as const, head: 'Shared', s: 'Label, variants, plum, states' },
              { c: 'adapt' as const, head: 'Adapted', s: '17 pt · 16 sp · 1 rem; 44/48/44' },
              { c: 'native' as const, head: 'Native', s: 'Pressed feel, haptics, web focus' },
            ]).map((r, i) => (
              <g key={r.c} opacity={p(t, 26.4 + i * 0.6, 27 + i * 0.6)}>
                <rect x={52} y={120 + i * 70} width={130} height={48} rx={10} fill={PARITY_FILL[r.c]} />
                <text x={117} y={152 + i * 70} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle">{r.head}</text>
                <text x={198} y={152 + i * 70} fontSize={21} fontWeight={700} fill={SC.text}>{r.s}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 31 && (
          <g>
            {PARITY_PLATFORMS.map((pl, i) => (
              <Frame key={pl} x={FX[i]} y={70} w={FW} h={200} platform={pl}>
                <text x={FX[i] + 16} y={124} fontSize={21} fontWeight={800} fill={SC.text}>₹1,240</text>
                <text x={FX[i] + 16} y={156} fontSize={21} fontWeight={700} fill={SC.muted}>+ ₹62 fee</text>
                <rect x={FX[i] + 16} y={192} width={FW - 32} height={40} rx={10} fill={SC.text} />
                <text x={FX[i] + FW / 2} y={219} fontSize={21} fontWeight={800} fill="#fff" textAnchor="middle">Pay</text>
                <circle cx={FX[i] + FW - 24} cy={124} r={14} fill="#067647" opacity={p(t, 31.6 + i * 0.5, 32 + i * 0.5)} />
                <text x={FX[i] + FW - 24} y={131} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle" opacity={p(t, 31.6 + i * 0.5, 32 + i * 0.5)}>✓</text>
              </Frame>
            ))}
            <text x={320} y={338} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="middle" opacity={p(t, 33.4, 34)}>Shared rows checked on all three</text>
          </g>
        )}
      </g>
    </svg>
  );
}
