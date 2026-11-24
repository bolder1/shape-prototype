'use client';
// Scene for br.3-3: Sukoon's launch key visual (sand, the half-sun, "Calm in five minutes") works as a feed post. The
// agency squeezes it into a Story, where the profile bar and the reply bar (`FORMAT_SPECS`) cover the headline and the
// button, and into a YouTube thumbnail whose 44 px headline is under 6 px in the Up next list (`shownSize`). Then the
// safe zones are drawn and the blocks move into them (`SUKOON_ASSETS` draft → fix), the thumbnail gets a short line at
// 110 px, one template per format, and five weeks of posts built from them. Pure function of t (0–36). Also exports
// `AssetArt`, which draws any asset layout in its format's own pixels, for `asset-fit`.
import { CTA_H, FORMAT_SPECS, LOGO_H, SUKOON_ASSETS, assetBoxes, headWrap, shownSize, type Asset, type AssetLayout } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';
import { MarkArt, SUKOON } from './LogoProcess';

const W = 960, H = 540;
const RED = '#B42318', GREEN = '#067647';

/** An asset drawn in its format's pixels (an SVG of `width` px). `ui` draws the platform's own bars over it; `bad`
 *  outlines blocks in red; `pick` rings the selected block. */
export function AssetArt({ a, l, width, ui = false, bad = [], pick, x, y }: {
  a: Pick<Asset, 'format' | 'lines'>; l: AssetLayout; width: number; ui?: boolean; bad?: readonly string[]; pick?: string; x?: number; y?: number;
}) {
  const s = FORMAT_SPECS[a.format], boxes = assetBoxes(a, l), lines = headWrap(a.lines[l.line], l.size, a.format);
  const logoW = LOGO_H[a.format] * 3.6, ctaW = s.w * 0.62;
  const inner = (
    <>
      <rect width={s.w} height={s.h} fill={SUKOON.sand} />
      <circle cx={s.w * 0.78} cy={s.h * 0.62} r={Math.min(s.w, s.h) * 0.34} fill={SUKOON.peach} opacity={0.55} />
      {lines.map((ln, i) => <text key={i} x={s.w / 2} y={l.head + l.size * (0.92 + i * 1.15)} textAnchor="middle" fontSize={l.size} fontWeight={900} fill={SUKOON.ink} fontFamily="system-ui, sans-serif">{ln}</text>)}
      <g transform={`translate(${(s.w - logoW) / 2} ${l.logo})`}>
        <MarkArt k="breath" size={LOGO_H[a.format]} />
        <text x={LOGO_H[a.format] * 1.1} y={LOGO_H[a.format] * 0.72} fontSize={LOGO_H[a.format] * 0.62} fontWeight={900} fill={SUKOON.ink}>Sukoon</text>
      </g>
      {l.cta !== undefined && (
        <g>
          <rect x={(s.w - ctaW) / 2} y={l.cta} width={ctaW} height={CTA_H[a.format]} rx={CTA_H[a.format] / 2} fill={SUKOON.sage} />
          <text x={s.w / 2} y={l.cta + CTA_H[a.format] * 0.64} textAnchor="middle" fontSize={CTA_H[a.format] * 0.36} fontWeight={800} fill="#FFFFFF">Start your free week</text>
        </g>
      )}
      {boxes.map(b => (bad.includes(b.id) || pick === b.id) && (
        <rect key={b.id} x={s.margin / 2} y={b.top} width={s.w - s.margin} height={b.bottom - b.top} fill="none" stroke={bad.includes(b.id) ? RED : SUKOON.sage} strokeWidth={s.w / 160} strokeDasharray={pick === b.id && !bad.includes(b.id) ? `${s.w / 60} ${s.w / 90}` : undefined} rx={s.w / 80} />
      ))}
      {ui && a.format === 'story' && (
        <g>
          <rect width={s.w} height={s.top} fill="#101828" opacity={0.72} />
          <rect x={40} y={36} width={s.w - 80} height={8} rx={4} fill="#FFFFFF" opacity={0.7} />
          <circle cx={100} cy={140} r={50} fill="#FFFFFF" opacity={0.9} />
          <text x={176} y={156} fontSize={44} fontWeight={800} fill="#FFFFFF">sukoon.app · 2h</text>
          <rect y={s.h - s.bottom} width={s.w} height={s.bottom} fill="#101828" opacity={0.72} />
          <rect x={50} y={s.h - s.bottom + 110} width={s.w - 260} height={110} rx={55} fill="none" stroke="#FFFFFF" strokeWidth={4} />
          <text x={110} y={s.h - s.bottom + 180} fontSize={40} fontWeight={700} fill="#FFFFFF">Send message</text>
        </g>
      )}
      {ui && a.format === 'thumb' && (
        <g><rect x={s.w - 190} y={s.h - 100} width={150} height={64} rx={10} fill="#101828" opacity={0.85} /><text x={s.w - 115} y={s.h - 52} textAnchor="middle" fontSize={40} fontWeight={800} fill="#FFFFFF">5:02</text></g>
      )}
      {ui && (a.format === 'post' || a.format === 'link') && <rect x={s.margin} y={s.margin} width={s.w - 2 * s.margin} height={s.h - 2 * s.margin} fill="none" stroke="#101828" strokeOpacity={0.35} strokeWidth={4} strokeDasharray="20 14" />}
    </>
  );
  const scale = width / s.w;
  if (x !== undefined) return <g transform={`translate(${x} ${y ?? 0}) scale(${scale})`}>{inner}</g>;
  return <svg viewBox={`0 0 ${s.w} ${s.h}`} width={width} height={s.h * scale} role="img" aria-label={`${s.name}: “${a.lines[l.line]}”`}>{inner}</svg>;
}

const mix = (a: AssetLayout, b: AssetLayout, k: number): AssetLayout => ({
  head: lerp(a.head, b.head, k), logo: lerp(a.logo, b.logo, k), size: a.size, line: a.line,
  ...(a.cta !== undefined && b.cta !== undefined ? { cta: lerp(a.cta, b.cta, k) } : {}),
});
const POST = { format: 'post' as const, lines: ['Calm in five minutes'] };
const POST_L: AssetLayout = { head: 260, size: 110, logo: 1100, cta: 880, line: 0 };
const { storyLaunch: story, thumbTalk: thumb, linkCard: link, postQuote: quote } = SUKOON_ASSETS;
const REVIEWS = ['“Five minutes in the cab. Every day.”', '“My 3 pm slump is gone.”', '“Calmer before every client call.”', '“I sleep by eleven now.”', '“The Hindi sessions feel like home.”'];

export function CampaignCutScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const sq = FORMAT_SPECS.story;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Sukoon's launch post works in the feed. Squeezed into a Story, the profile bar covers the headline and the reply bar covers the button. On the YouTube thumbnail, a 44 px headline ends up ${shownSize('thumb', 44).toFixed(1)} px tall in the Up next list. Each format then gets its own layout: Story text and buttons move out of the top ${sq.top} px and bottom ${sq.bottom} px, the thumbnail gets "Calm in 5 minutes" at 110 px, about 14 px on screen, and one template per format carries five weeks of posts.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>
          {t < 6 ? 'One key visual' : t < 11 ? 'Squeezed into a Story' : t < 16 ? 'Shrunk to a thumbnail' : t < 21 ? 'Safe zones' : t < 26 ? 'Big for its format' : t < 31 ? 'A template for each' : 'The campaign runs'}
        </text>

        {t < 6 && (
          <g>
            <AssetArt a={POST} l={POST_L} width={300} x={120} y={90 + 20 * (1 - p(t, 0.2, 1))} />
            <g transform="translate(500 160)" opacity={p(t, 2.4, 3)}>
              <text x={0} y={0} fontSize={18} fontWeight={900} fill={SC.text}>The launch post, 1080 × 1350.</text>
              <text x={0} y={32} fontSize={16} fontWeight={800} fill={SC.muted}>Sand, the half-sun, one promise.</text>
              <text x={0} y={56} fontSize={16} fontWeight={800} fill={SC.muted}>It works in the feed. Now it has to</text>
              <text x={0} y={80} fontSize={16} fontWeight={800} fill={SC.muted}>work everywhere else.</text>
            </g>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g>
            <AssetArt a={story} l={story.draft} width={220} x={140} y={86} ui={t > 7.6} bad={t > 8.4 ? ['head', 'cta'] : []} />
            <g transform="translate(440 150)" opacity={p(t, 7.8, 8.4)}>
              <text x={0} y={0} fontSize={18} fontWeight={900} fill={SC.text}>The app draws over the top and bottom.</text>
              <text x={0} y={34} fontSize={16} fontWeight={800} fill={RED}>The headline: under the profile bar.</text>
              <text x={0} y={60} fontSize={16} fontWeight={800} fill={RED}>The button: under “Send message”.</text>
            </g>
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g>
            <AssetArt a={thumb} l={thumb.draft} width={420} x={80} y={100} />
            <text x={80} y={360} fontSize={14} fontWeight={800} fill={SC.muted}>On the canvas: 1280 × 720, headline 44 px</text>
            <g opacity={p(t, 12.4, 13)}>
              <AssetArt a={thumb} l={thumb.draft} width={168} x={600} y={120} ui />
              <rect x={776} y={124} width={120} height={10} rx={4} fill="#98A2B3" /><rect x={776} y={142} width={80} height={8} rx={4} fill="#D0D5DD" />
              <text x={600} y={240} fontSize={14} fontWeight={800} fill={SC.muted}>In the Up next list: 168 px wide</text>
              <text x={600} y={300} fontSize={40} fontWeight={900} fill={RED} opacity={p(t, 13.6, 14.2)}>{shownSize('thumb', 44).toFixed(1)} px</text>
              <text x={600} y={326} fontSize={14} fontWeight={800} fill={SC.text} opacity={p(t, 13.8, 14.4)}>tall letters on the phone. Nobody can read that.</text>
            </g>
          </g>
        )}

        {t >= 16 && t < 21 && (
          <g>
            <AssetArt a={story} l={mix(story.draft, story.fix, p(t, 17.6, 19.4))} width={220} x={140} y={86} ui={t < 17.4} />
            <g transform="translate(140 86)">
              <rect width={220} height={sq.top * 220 / sq.w} fill={RED} opacity={0.18} />
              <rect y={(sq.h - sq.bottom) * 220 / sq.w} width={220} height={sq.bottom * 220 / sq.w} fill={RED} opacity={0.18} />
            </g>
            <g transform="translate(440 150)" opacity={p(t, 16.4, 17)}>
              <text x={0} y={0} fontSize={18} fontWeight={900} fill={SC.text}>Mark the bands the app covers:</text>
              <text x={0} y={32} fontSize={16} fontWeight={800} fill={SC.muted}>top {sq.top} px, bottom {sq.bottom} px.</text>
              <text x={0} y={70} fontSize={16} fontWeight={800} fill={GREEN} opacity={p(t, 19.4, 20)}>Text and the button live in the middle.</text>
              <text x={0} y={94} fontSize={16} fontWeight={800} fill={SC.muted} opacity={p(t, 19.6, 20.2)}>The photo can still fill the frame.</text>
            </g>
          </g>
        )}

        {t >= 21 && t < 26 && (
          <g>
            <AssetArt a={thumb} l={t < 22.4 ? thumb.draft : thumb.fix} width={420} x={80} y={100} />
            <g opacity={p(t, 22.6, 23.2)}>
              <AssetArt a={thumb} l={thumb.fix} width={168} x={600} y={120} ui />
              <text x={600} y={240} fontSize={14} fontWeight={800} fill={SC.muted}>The same list, 168 px wide</text>
              <text x={600} y={300} fontSize={40} fontWeight={900} fill={GREEN}>{shownSize('thumb', thumb.fix.size).toFixed(1)} px</text>
              <text x={600} y={326} fontSize={14} fontWeight={800} fill={SC.text}>Four words, 110 px on the canvas.</text>
              <text x={600} y={350} fontSize={14} fontWeight={800} fill={SC.muted}>The full title goes under the picture.</text>
            </g>
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g>
            {[
              { el: <AssetArt a={POST} l={POST_L} width={170} x={60} y={120} />, n: 'Feed post · 4:5' },
              { el: <AssetArt a={story} l={story.fix} width={150} x={270} y={100} />, n: 'Story · 9:16' },
              { el: <AssetArt a={thumb} l={thumb.fix} width={230} x={460} y={150} />, n: 'Thumbnail · 16:9' },
              { el: <AssetArt a={link} l={link.fix} width={190} x={730} y={160} />, n: 'Link preview · 1.91:1' },
            ].map((f, i) => (
              <g key={f.n} opacity={p(t, 26.2 + i * 0.6, 26.8 + i * 0.6)}>
                {f.el}
                <text x={[60, 270, 460, 730][i]} y={400} fontSize={14} fontWeight={800} fill={SC.text}>{f.n}</text>
              </g>
            ))}
            <text x={60} y={460} fontSize={16} fontWeight={800} fill={SC.muted} opacity={p(t, 29, 29.6)}>Same promise, sun and colours. A fresh layout for every frame, saved as a template.</text>
          </g>
        )}

        {t >= 31 && (
          <g>
            {REVIEWS.map((r, i) => (
              <g key={r} opacity={p(t, 31.2 + i * 0.4, 31.6 + i * 0.4)}>
                <AssetArt a={{ format: 'post', lines: [r] }} l={quote.fix} width={150} x={70 + i * 168} y={130} />
                <text x={70 + i * 168} y={340} fontSize={13} fontWeight={800} fill={SC.muted}>Week {i + 1}</text>
              </g>
            ))}
            <text x={70} y={420} fontSize={17} fontWeight={800} fill={SC.text} opacity={p(t, 33.4, 34)}>Built from the template in minutes. All of them look like Sukoon.</text>
          </g>
        )}
      </g>
    </svg>
  );
}
