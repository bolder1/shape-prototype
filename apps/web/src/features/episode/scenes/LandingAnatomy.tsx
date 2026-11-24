'use client';
// Scene for br.3-1: Kabir's launch page (`KABIR_PAGE`) opens on a logo banner and keeps its only form for the bottom.
// A reach ruler drawn from `scrollReach` shows each screen keeping about 70% of visitors, so the form, 2,860 px down,
// is seen by a third (`ctaReach`). Then the visitor's four questions (`ZONE_ASKS`), the first screen built above the
// fold, proof before price, the close with the button again, and the whole new page (`SUKOON_SECTIONS` in
// `pageOrder`) with every visitor seeing a way to start. Pure function of t (0–36). Also exports `PageStrip` and the
// zone colours for `page-stack`.
import { FOLD_PX, KABIR_PAGE, PAGE_ZONES, SUKOON_SECTIONS, ZONE_ASKS, ctaReach, pageLayout, pageOrder, type PageBlock, type PageZone, type SukoonSection } from '@shape/content';
import { back, clamp, Grid, p, SC } from './shared';
import { MarkArt, SUKOON } from './LogoProcess';

const W = 960, H = 540;
const RED = '#B42318', GREEN = '#067647';
/** A fill per zone that keeps ink text above 4.5:1. */
export const ZONE_FILL: Record<PageZone, string> = { hero: '#DCEBE5', proof: '#F7E3D8', how: '#E7E2F3', close: '#F3E9DC' };
export const ZONE_NAME: Record<PageZone, string> = { hero: 'First screen', proof: 'Proof', how: 'How it works', close: 'Close' };
const pct = (x: number) => `${Math.round(x * 100)}%`;
const ALL = pageOrder(Object.keys(SUKOON_SECTIONS) as SukoonSection[]);

/** A page as a vertical strip of blocks, `scale` px per page px, with the fold and each block's reach on the right. */
export function PageStrip({ blocks, x, y, w, scale, show = 1, reach = true, label = true }: {
  blocks: readonly (PageBlock & { zone?: PageZone })[]; x: number; y: number; w: number; scale: number; show?: number; reach?: boolean; label?: boolean;
}) {
  const laid = pageLayout(blocks);
  return (
    <g transform={`translate(${x} ${y})`}>
      {laid.map((b, i) => {
        const k = clamp(show * laid.length - i);
        if (k <= 0) return null;
        const h = b.px * scale, fill = b.zone ? ZONE_FILL[b.zone] : '#E4E7EC';
        return (
          <g key={i} opacity={k}>
            <rect x={0} y={b.top * scale} width={w} height={Math.max(2, h - 2)} rx={4} fill={fill} stroke={b.cta ? SUKOON.sage : 'none'} strokeWidth={b.cta ? 2.5 : 0} />
            {label && h >= 14 && <text x={8} y={b.top * scale + Math.min(h / 2 + 5, 20)} fontSize={Math.min(13, h - 4)} fontWeight={700} fill={SUKOON.ink}>{b.text.length > 40 ? `${b.text.slice(0, 38)}…` : b.text}</text>}
            {reach && <text x={w + 10} y={b.top * scale + 12} fontSize={12} fontWeight={800} fill={b.reach < 0.5 ? RED : SC.muted}>{pct(b.reach)}</text>}
          </g>
        );
      })}
      <line x1={-6} x2={w + 6} y1={FOLD_PX * scale} y2={FOLD_PX * scale} stroke={SC.text} strokeDasharray="5 4" strokeWidth={1.5} />
      <text x={-10} y={FOLD_PX * scale + 4} textAnchor="end" fontSize={11} fontWeight={800} fill={SC.muted}>fold</text>
    </g>
  );
}

function Phone({ x, y, children, o = 1 }: { x: number; y: number; children: React.ReactNode; o?: number }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <rect width={220} height={400} rx={28} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
      <rect x={10} y={14} width={200} height={372} rx={20} fill={SUKOON.sand} />
      {children}
    </g>
  );
}

export function LandingAnatomyScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const kabirReach = ctaReach(KABIR_PAGE);
  const page = ALL.map(k => SUKOON_SECTIONS[k]);
  const finalReach = pageLayout(page).at(-1)!.reach;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Kabir's launch page opens on a logo banner and keeps its only sign-up form for the bottom, 2,860 px down. Each screen of scrolling keeps about 70% of visitors, so only ${pct(kabirReach)} see the form. Ishita rebuilds the page around the visitor's four questions: what is it and is it for me, why believe you, how does it work, what does it cost and what now. The first screen carries the headline and the button, proof comes before the price, and the button repeats at the end, so every visitor sees a way to start.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>
          {t < 6 ? 'The page the company wanted' : t < 11 ? 'Where people stop' : t < 16 ? 'Four questions, in order' : t < 21 ? 'The first screen' : t < 26 ? 'Proof before price' : t < 31 ? 'Close, and ask again' : 'One page, one goal'}
        </text>

        {t < 11 && (
          <g>
            <PageStrip blocks={KABIR_PAGE} x={140} y={90} w={300} scale={0.125} show={p(t, 0.3, 4.5)} reach={t >= 6} />
            {t < 6 && <text x={500} y={140} fontSize={17} fontWeight={800} fill={SC.text} opacity={p(t, 3.6, 4.2)}>The only button is the form at the very end.</text>}
            {t >= 6 && (
              <g transform="translate(520 110)">
                {[0, 1, 2, 3, 4].map(i => (
                  <g key={i} opacity={p(t, 6.2 + i * 0.4, 6.6 + i * 0.4)}>
                    <rect x={0} y={i * 44} width={260 * 0.7 ** i} height={30} rx={6} fill={i === 0 ? SUKOON.sage : '#667085'} opacity={0.85} />
                    <text x={10} y={i * 44 + 20} fontSize={13} fontWeight={800} fill="#FFFFFF">Screen {i + 1}: {pct(0.7 ** i)}</text>
                  </g>
                ))}
                <g opacity={p(t, 8.4, 9)}>
                  <text x={0} y={262} fontSize={40} fontWeight={900} fill={RED}>{pct(kabirReach)}</text>
                  <text x={96} y={252} fontSize={15} fontWeight={800} fill={SC.text}>of visitors ever see</text>
                  <text x={96} y={272} fontSize={15} fontWeight={800} fill={SC.text}>the sign-up form.</text>
                </g>
              </g>
            )}
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g transform="translate(100 100)">
            {PAGE_ZONES.map((z, i) => (
              <g key={z} transform={`translate(${(i % 2) * 400} ${Math.floor(i / 2) * 170})`} opacity={p(t, 11.2 + i * 0.7, 11.8 + i * 0.7)}>
                <rect width={360} height={140} rx={16} fill={ZONE_FILL[z]} />
                <text x={24} y={40} fontSize={14} fontWeight={800} fill={SUKOON.ink}>{i + 1} · {ZONE_NAME[z].toUpperCase()}</text>
                <text x={24} y={84} fontSize={21} fontWeight={900} fill={SUKOON.ink}>{ZONE_ASKS[z]}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 16 && t < 21 && (
          <g>
            <Phone x={140} y={100}>
              <g opacity={p(t, 16.3, 16.9)}>
                <text x={26} y={60} fontSize={20} fontWeight={900} fill={SUKOON.ink}>Calm in five</text>
                <text x={26} y={84} fontSize={20} fontWeight={900} fill={SUKOON.ink}>minutes, between</text>
                <text x={26} y={108} fontSize={20} fontWeight={900} fill={SUKOON.ink}>meetings</text>
                <text x={26} y={134} fontSize={11} fill={SUKOON.ink}>Five-minute guided sessions for</text>
                <text x={26} y={148} fontSize={11} fill={SUKOON.ink}>your desk, a cab or before a call.</text>
              </g>
              <g opacity={p(t, 17.2, 17.8)}>
                <rect x={26} y={164} width={168} height={38} rx={19} fill={SUKOON.sage} />
                <text x={110} y={188} textAnchor="middle" fontSize={13} fontWeight={800} fill="#FFFFFF">Start your free week</text>
                <text x={110} y={218} textAnchor="middle" fontSize={10} fontWeight={700} fill={SUKOON.ink}>No card needed</text>
              </g>
              <g opacity={p(t, 18, 18.6)}>
                <rect x={60} y={234} width={100} height={140} rx={14} fill="#FFFFFF" stroke={SUKOON.ink} strokeOpacity={0.2} />
                <circle cx={110} cy={296} r={20 + 6 * Math.sin(t * 1.6)} fill={SUKOON.peach} opacity={0.7} />
                <text x={110} y={354} textAnchor="middle" fontSize={10} fontWeight={700} fill={SUKOON.ink}>Breathe out · 3:12</text>
              </g>
            </Phone>
            <g transform="translate(440 140)" opacity={p(t, 18.8, 19.4)}>
              <text x={0} y={0} fontSize={18} fontWeight={900} fill={SC.text}>Everything a visitor needs to decide,</text>
              <text x={0} y={28} fontSize={18} fontWeight={900} fill={SC.text}>before any scrolling:</text>
              {['What it is, and who it’s for', 'The one action, and what it costs you', 'The product doing its job'].map((s, i) => (
                <text key={s} x={0} y={78 + i * 32} fontSize={16} fontWeight={800} fill={SC.muted}>· {s}</text>
              ))}
              <text x={0} y={210} fontSize={40} fontWeight={900} fill={GREEN}>100%</text>
              <text x={108} y={202} fontSize={15} fontWeight={800} fill={SC.text}>see the button</text>
            </g>
          </g>
        )}

        {t >= 21 && t < 31 && (
          <g>
            <PageStrip blocks={page} x={140} y={90} w={300} scale={0.14} show={t < 26 ? 3 / 11 + p(t, 21.2, 24.5) * (5 / 11) : 8 / 11 + p(t, 26.2, 28.4) * (3 / 11)} />
            <g transform="translate(540 130)">
              {t < 26 ? (
                <g opacity={p(t, 22.4, 23)}>
                  <text x={0} y={0} fontSize={18} fontWeight={900} fill={SC.text}>Why should I believe you?</text>
                  <text x={0} y={30} fontSize={15} fontWeight={800} fill={SC.muted}>A rating from a store people trust,</text>
                  <text x={0} y={52} fontSize={15} fontWeight={800} fill={SC.muted}>reviews with names, jobs and cities,</text>
                  <text x={0} y={74} fontSize={15} fontWeight={800} fill={SC.muted}>and teams that use it at work.</text>
                  <text x={0} y={130} fontSize={18} fontWeight={900} fill={SC.text} opacity={p(t, 23.8, 24.4)}>Then: how does it work?</text>
                  <text x={0} y={160} fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 24, 24.6)}>Three steps, then what you get.</text>
                </g>
              ) : (
                <g opacity={p(t, 27, 27.6)}>
                  <text x={0} y={0} fontSize={18} fontWeight={900} fill={SC.text}>₹149 a month, after 7 free days.</text>
                  <text x={0} y={30} fontSize={15} fontWeight={800} fill={SC.muted}>Then the questions people ask before paying,</text>
                  <text x={0} y={52} fontSize={15} fontWeight={800} fill={SC.muted}>and the button again for the {pct(finalReach)} who</text>
                  <text x={0} y={74} fontSize={15} fontWeight={800} fill={SC.muted}>read to the end.</text>
                </g>
              )}
            </g>
          </g>
        )}

        {t >= 31 && (
          <g>
            <PageStrip blocks={page} x={140} y={90} w={300} scale={0.14} />
            <g transform="translate(540 120)" opacity={p(t, 31.4, 32)}>
              <rect width={320} height={56} rx={12} fill={SC.surface} stroke={SC.line} />
              <MarkArt k="breath" x={14} y={10} size={36} />
              <text x={62} y={34} fontSize={17} fontWeight={900} fill={SC.text}>Sukoon</text>
              <rect x={188} y={12} width={118} height={32} rx={16} fill={SUKOON.sage} />
              <text x={247} y={33} textAnchor="middle" fontSize={12} fontWeight={800} fill="#FFFFFF">Start free week</text>
              <text x={0} y={100} fontSize={15} fontWeight={800} fill={SC.muted}>The top bar: the logo and the button. No blog,</text>
              <text x={0} y={122} fontSize={15} fontWeight={800} fill={SC.muted}>no careers page, no Instagram.</text>
              <g opacity={p(t, 32.8, 33.4)}>
                <text x={0} y={190} fontSize={40} fontWeight={900} fill={RED}>{pct(kabirReach)}</text>
                <text x={0} y={214} fontSize={13} fontWeight={800} fill={SC.muted}>saw a button before</text>
                <text x={150} y={190} fontSize={40} fontWeight={900} fill={GREEN}>{pct(ctaReach(page))}</text>
                <text x={150} y={214} fontSize={13} fontWeight={800} fill={SC.muted}>see one now</text>
              </g>
            </g>
          </g>
        )}
      </g>
    </svg>
  );
}
