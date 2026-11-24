'use client';
// Scene for br.3-4: Sukoon's launch page looks right to people, and nearly blank to a search engine. What Google reads
// (`SUKOON_SEO_BEFORE`): a title cut by `serpTitle`, no description, /index.php?page_id=42, the headline baked into a
// 2.4 MB hero (`loadSeconds`), two H1s and an H4. Then the fixes from `SEO_FIXES`, area by area: the result, the
// outline, the pictures, the links, with `fixSeo` redrawing the page each time, ending on the result for "meditation
// app". Pure function of t (0–36). Also exports `Serp` and `ReadView` for `serp-spot`.
import { IMAGE_MAX_KB, SEO_AREA_OF, SEO_ISSUES, SUKOON_SEO_BEFORE, fixSeo, loadSeconds, serpTitle, type SeoArea, type SeoPage } from '@shape/content';
import { back, clamp, Grid, p, SC } from './shared';
import { MarkArt, SUKOON } from './LogoProcess';

const W = 960, H = 540;
const RED = '#B42318', GREEN = '#067647', LINK = '#1A0DAB';
const only = (a: SeoArea) => SEO_ISSUES.filter(i => SEO_AREA_OF[i] === a);
const upTo = (areas: readonly SeoArea[]) => SEO_ISSUES.filter(i => areas.includes(SEO_AREA_OF[i]));
const cut = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

/** The search result Google builds from a page, `w` wide. With no description it shows scraps of the page. */
export function Serp({ pg, x = 0, y = 0, w = 520 }: { pg: SeoPage; x?: number; y?: number; w?: number }) {
  const desc = pg.description || 'Home · About · Login · We use cookies to improve your experience. Accept all · Sukoon Wellness Private Limited ©';
  const per = Math.floor((w - 32) / 7.4);
  const lines = [desc.slice(0, per), desc.slice(per, per * 2)].filter(Boolean);
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={128} rx={12} fill="#FFFFFF" stroke="#D0D5DD" />
      <circle cx={28} cy={28} r={12} fill={SUKOON.sand} />
      <MarkArt k="breath" x={19} y={19} size={18} />
      <text x={48} y={24} fontSize={12} fontWeight={700} fill="#202124">Sukoon</text>
      <text x={48} y={40} fontSize={11} fill="#4D5156">{cut(`https://sukoon.app${pg.slug}`, Math.floor((w - 60) / 6.4))}</text>
      <text x={16} y={70} fontSize={18} fill={LINK}>{cut(serpTitle(pg.title), Math.floor((w - 32) / 9.2))}</text>
      {lines.map((l, i) => <text key={i} x={16} y={94 + i * 18} fontSize={12.5} fill={pg.description ? '#4D5156' : RED}>{i === lines.length - 1 && desc.length > per * 2 ? `${l.slice(0, -1)}…` : l}</text>)}
    </g>
  );
}

/** What a search engine reads in one area of a page: the result, the outline, the images or the links.
 *  The result is an SVG, the rest HTML lists, so the game can make each area a button. */
export function ReadView({ pg, area }: { pg: SeoPage; area: SeoArea }) {
  if (area === 'snippet') {
    return <svg viewBox="0 0 520 128" className="w-full" role="img" aria-label={`Search result: title “${serpTitle(pg.title)}”, address sukoon.app${pg.slug}, ${pg.description ? `description “${pg.description}”` : 'no description, so Google shows scraps of the page'}`}><Serp pg={pg} /></svg>;
  }
  if (area === 'headings') {
    return (
      <ul className="flex flex-col gap-1 font-mono text-xs">
        {pg.headings.map((h, i) => {
          const skip = i > 0 && h.level > pg.headings[i - 1].level + 1, extraH1 = h.level === 1 && pg.headings.filter(x => x.level === 1).length !== 1;
          return <li key={i} className={skip || extraH1 ? 'text-error-primary' : 'text-secondary'} style={{ paddingLeft: (h.level - 1) * 12 }}>&lt;h{h.level}&gt; {h.text}</li>;
        })}
      </ul>
    );
  }
  if (area === 'images') {
    return (
      <ul className="flex flex-col gap-1 font-mono text-xs">
        {pg.images.map(im => {
          const bad = (!im.decorative && !im.alt) || im.textInImage || im.kb > IMAGE_MAX_KB;
          return (
            <li key={im.name} className={bad ? 'text-error-primary' : 'text-secondary'}>
              {im.name} · {im.kb.toLocaleString('en-IN')} kB{im.kb > IMAGE_MAX_KB ? ` (${loadSeconds(im.kb).toFixed(1)} s on slow 4G)` : ''} · alt={im.alt === undefined ? 'missing' : `"${im.alt}"`}{im.textInImage ? ' · headline baked in' : ''}
            </li>
          );
        })}
      </ul>
    );
  }
  return (
    <ul className="flex flex-col gap-1 font-mono text-xs">
      {pg.links.map(l => <li key={l.text} className={!l.href || ['click here', 'here', 'read more', 'learn more', 'more'].includes(l.text.toLowerCase()) ? 'text-error-primary' : 'text-secondary'}>{l.href ? `<a href="${l.href}">${l.text}</a>` : `<div onclick>${l.text}</div>`}</li>)}
    </ul>
  );
}

function Code({ x, y, rows, o = 1 }: { x: number; y: number; rows: { s: string; bad?: boolean }[]; o?: number }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <rect width={400} height={28 + rows.length * 24} rx={10} fill="#101828" />
      {rows.map((r, i) => <text key={i} x={16} y={30 + i * 24} fontSize={13} fontFamily="ui-monospace, monospace" fill={r.bad ? '#FDA29B' : '#D0D5DD'}>{cut(r.s, 50)}</text>)}
    </g>
  );
}

function Seen({ x, y, pg }: { x: number; y: number; pg: SeoPage }) {
  const hero = pg.images[0];
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={220} height={400} rx={28} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
      <rect x={10} y={14} width={200} height={372} rx={20} fill={SUKOON.sand} />
      <rect x={22} y={40} width={176} height={150} rx={12} fill={SUKOON.peach} opacity={0.6} stroke={hero.textInImage ? RED : 'none'} strokeDasharray="6 4" strokeWidth={2} />
      <text x={34} y={90} fontSize={17} fontWeight={900} fill={SUKOON.ink}>Calm in five</text>
      <text x={34} y={112} fontSize={17} fontWeight={900} fill={SUKOON.ink}>minutes, between</text>
      <text x={34} y={134} fontSize={17} fontWeight={900} fill={SUKOON.ink}>meetings</text>
      <rect x={34} y={206} width={152} height={36} rx={18} fill={SUKOON.sage} />
      <text x={110} y={229} textAnchor="middle" fontSize={12} fontWeight={800} fill="#FFFFFF">Start your free week</text>
      {[262, 286, 310].map(yy => <rect key={yy} x={34} y={yy} width={152} height={12} rx={6} fill={SUKOON.ink} opacity={0.12} />)}
      <text x={34} y={356} fontSize={11} fontWeight={700} fill={SUKOON.ink}>★ 4.8 · 12,000 ratings</text>
    </g>
  );
}

export function SeoReadScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const before = SUKOON_SEO_BEFORE;
  const fixedAreas: SeoArea[] = t < 16 ? [] : t < 21 ? ['snippet'] : t < 26 ? ['snippet', 'headings'] : t < 31 ? ['snippet', 'headings', 'images'] : ['snippet', 'headings', 'images', 'links'];
  const pg = fixSeo(before, upTo(fixedAreas));
  const hero = before.images[0];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Sukoon's launch page looks right to people. Google reads a title cut to "${serpTitle(before.title)}", no description, the address ${before.slug}, two H1s and an H4, a headline baked into a ${hero.kb.toLocaleString('en-IN')} kB hero that takes ${loadSeconds(hero.kb).toFixed(1)} seconds on slow 4G, a screenshot with no alt text, a "Click here" link and a Start button that isn't a link. Each is fixed: the result becomes "${serpTitle(fixSeo(before, [...SEO_ISSUES]).title)}" at /meditation-app with a description, one H1 as live text, H2s under it, alt text, a 140 kB WebP, and links that say where they go.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>
          {t < 6 ? 'What people see' : t < 11 ? 'What Google reads' : t < 16 ? 'The headline is a picture' : t < 21 ? 'The result, fixed' : t < 26 ? 'An outline that makes sense' : t < 31 ? 'Pictures with words' : 'Links that go somewhere'}
        </text>

        <Seen x={80} y={100} pg={pg} />

        {t < 6 && (
          <g transform="translate(360 160)" opacity={p(t, 1.6, 2.2)}>
            <text x={0} y={0} fontSize={18} fontWeight={900} fill={SC.text}>Sand, the half-sun, the promise, the button.</text>
            <text x={0} y={32} fontSize={16} fontWeight={800} fill={SC.muted}>People searching “meditation app” never find it.</text>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g>
            <Code x={360} y={100} o={p(t, 6.2, 6.8)} rows={[{ s: `<title>${before.title}</title>`, bad: true }, { s: '<meta name="description"> missing', bad: true }, { s: `sukoon.app${before.slug}`, bad: true }]} />
            <g opacity={p(t, 7.8, 8.4)}><Serp pg={before} x={360} y={240} w={520} /></g>
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g>
            <Code x={360} y={100} o={p(t, 11.2, 11.8)} rows={[...before.headings.map((h, i) => ({ s: `${'  '.repeat(h.level - 1)}<h${h.level}>${h.text}</h${h.level}>`, bad: h.level === 1 || i === 2 })), { s: `<img src="${hero.name}"> headline baked in`, bad: true }]} />
            <g transform="translate(360 300)" opacity={p(t, 12.8, 13.4)}>
              <text x={0} y={0} fontSize={15} fontWeight={800} fill={SC.text}>{hero.name}: {hero.kb.toLocaleString('en-IN')} kB on a slow 4G phone</text>
              <rect x={0} y={16} width={480} height={22} rx={11} fill={SC.surface} stroke={SC.line} />
              <rect x={0} y={16} width={480 * p(t, 13.2, 15.6)} height={22} rx={11} fill={RED} opacity={0.8} />
              <text x={490} y={33} fontSize={14} fontWeight={900} fill={RED}>{(loadSeconds(hero.kb) * p(t, 13.2, 15.6)).toFixed(1)} s</text>
            </g>
          </g>
        )}

        {t >= 16 && t < 21 && (
          <g>
            <g opacity={0.45}><Serp pg={before} x={360} y={100} w={520} /></g>
            <g opacity={p(t, 16.8, 17.6)}><Serp pg={pg} x={360} y={250} w={520} /></g>
            <text x={360} y={410} fontSize={15} fontWeight={800} fill={GREEN} opacity={p(t, 18.4, 19)}>Searchers’ words first, the brand last, {pg.title.length} characters.</text>
          </g>
        )}

        {t >= 21 && t < 26 && (
          <g>
            <Code x={360} y={100} rows={pg.headings.map(h => ({ s: `${'  '.repeat(h.level - 1)}<h${h.level}>${h.text}</h${h.level}>` }))} o={p(t, 21.2, 21.8)} />
            <text x={360} y={290} fontSize={16} fontWeight={800} fill={SC.text} opacity={p(t, 22.6, 23.2)}>One H1, the headline, as live text over the photo.</text>
            <text x={360} y={316} fontSize={16} fontWeight={800} fill={SC.muted} opacity={p(t, 23, 23.6)}>Levels for structure; sizes come from styles.</text>
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g>
            <Code x={360} y={100} o={p(t, 26.2, 26.8)} rows={pg.images.map(im => ({ s: `<img src="${im.name}" alt="${im.alt ?? ''}"> ${im.kb} kB` }))} />
            <g transform="translate(360 250)" opacity={p(t, 27.4, 28)}>
              <text x={0} y={0} fontSize={15} fontWeight={800} fill={SC.text}>{pg.images[0].name}: {pg.images[0].kb} kB</text>
              <rect x={0} y={16} width={480} height={22} rx={11} fill={SC.surface} stroke={SC.line} />
              <rect x={0} y={16} width={480 * (pg.images[0].kb / hero.kb)} height={22} rx={11} fill={GREEN} />
              <text x={0} y={64} fontSize={14} fontWeight={900} fill={GREEN}>{loadSeconds(pg.images[0].kb).toFixed(2)} s on the same phone</text>
              <text x={0} y={92} fontSize={14} fontWeight={800} fill={SC.muted}>The decorative wave keeps an empty alt, so screen readers skip it.</text>
            </g>
          </g>
        )}

        {t >= 31 && (
          <g>
            <Code x={360} y={100} o={p(t, 31.2, 31.8)} rows={pg.links.map(l => ({ s: `<a href="${l.href}">${l.text}</a>` }))} />
            <g opacity={p(t, 32.4, 33)}>
              <rect x={360} y={200} width={520} height={34} rx={17} fill="#FFFFFF" stroke="#D0D5DD" />
              <text x={380} y={222} fontSize={14} fill="#202124">meditation app</text>
              <Serp pg={pg} x={360} y={246} w={520} />
            </g>
            <text x={360} y={410} fontSize={15} fontWeight={800} fill={SC.text} opacity={p(t, 33.6, 34.2)}>{only('links').length + only('images').length + only('headings').length + only('snippet').length} fixes. Now people can find the page, and so can Google.</text>
          </g>
        )}
      </g>
    </svg>
  );
}
