// Sukoon's launch, for chapter br.3. Sukoon is the meditation app from br.1 and br.2: for busy professionals who can't
// switch off, calm in five minutes; calm, warm and expert. Free for 7 days, then ₹149 a month or ₹999 a year. This is
// the data the br.3 scenes and games draw, and the rules they score against: how far down a page visitors scroll, what
// makes a line of conversion copy weak, whether a campaign asset survives its format, and what Google can read.

// ── Landing page anatomy (br.3-1, `page-stack`) ──────────────────────────────────────────────────────────────────────

/** The four jobs of a landing page, top to bottom (`page-stack` lanes), and the visitor's question each answers. */
export const PAGE_ZONES = ['hero', 'proof', 'how', 'close'] as const;
export type PageZone = (typeof PAGE_ZONES)[number];
export const ZONE_ASKS: Record<PageZone, string> = {
  hero: 'What is it, and is it for me?',
  proof: 'Why should I believe you?',
  how: 'How does it work, and what do I get?',
  close: 'What does it cost, and what now?',
};
/** What a phone shows before any scrolling, after the browser's own bars: the fold. */
export const FOLD_PX = 700;
/** On Sukoon's launch traffic, each further screen of scrolling keeps about 70% of the visitors who got that far. */
export const SCREEN_KEEP = 0.7;
/** Share of visitors whose scroll ever brings the point `y` px down the page into view. */
export const scrollReach = (y: number) => (y <= FOLD_PX ? 1 : SCREEN_KEEP ** ((y - FOLD_PX) / FOLD_PX));
export interface PageBlock { text: string; px: number; cta?: boolean }
/** Blocks stacked in order: where each starts, and the share of visitors who ever see its top. */
export const pageLayout = <B extends PageBlock>(blocks: readonly B[]) => {
  let top = 0;
  return blocks.map(b => { const at = { ...b, top, reach: scrollReach(top) }; top += b.px; return at; });
};
/** The share of visitors who see at least one call to action: the best-placed button decides. */
export const ctaReach = (blocks: readonly PageBlock[]) => Math.max(0, ...pageLayout(blocks).filter(b => b.cta).map(b => b.reach));
/** Kabir's first launch page, before Ishita: built the way the company thinks, not the way a visitor asks. */
export const KABIR_PAGE: readonly PageBlock[] = [
  { text: 'A full-screen banner of the logo', px: 560 },
  { text: '“Welcome to Sukoon”', px: 200 },
  { text: 'A slideshow of beach photos', px: 600 },
  { text: 'Our features', px: 900 },
  { text: 'About us: our story', px: 600 },
  { text: 'Sign-up form: name, email, phone, city, password', px: 480, cta: true },
];
export interface PageSection extends PageBlock { zone: PageZone }
/** The pieces of Sukoon's new launch page (`page-stack` cards). Heights are on a 390 px wide phone. */
export const SUKOON_SECTIONS = {
  headline: { text: 'The headline and one line under it: “Calm in five minutes, between meetings”', zone: 'hero', px: 220 },
  heroCta: { text: 'A “Start your free week” button with “No card needed” under it', zone: 'hero', px: 130, cta: true },
  heroShot: { text: 'A phone showing a five-minute session, mid-breath', zone: 'hero', px: 300 },
  rating: { text: '4.8 stars from 12,000 ratings on the Play Store', zone: 'proof', px: 100 },
  quotes: { text: 'Three short reviews with names, jobs and cities', zone: 'proof', px: 360 },
  logos: { text: 'Logos of the companies whose teams use Sukoon at work', zone: 'proof', px: 120 },
  steps: { text: 'How it works: pick a moment, press play, breathe for five minutes', zone: 'how', px: 380 },
  features: { text: 'What you get: 200 sessions, sleep stories, offline mode, English and Hindi', zone: 'how', px: 420 },
  pricing: { text: 'The price: free for 7 days, then ₹149 a month or ₹999 a year', zone: 'close', px: 360 },
  faq: { text: 'Questions people ask before paying: cancelling, offline, privacy', zone: 'close', px: 400 },
  finalCta: { text: 'The button again at the end: “Start your free week”', zone: 'close', px: 180, cta: true },
} as const satisfies Record<string, PageSection>;
export type SukoonSection = keyof typeof SUKOON_SECTIONS;
/** The sections in page order: zone by zone, each zone in the order its pieces are listed. */
export const pageOrder = (keys: readonly SukoonSection[]) =>
  PAGE_ZONES.flatMap(z => (Object.keys(SUKOON_SECTIONS) as SukoonSection[]).filter(k => keys.includes(k) && SUKOON_SECTIONS[k].zone === z));

// ── Conversion copy and CTAs (br.3-2, `copy-swap`) ───────────────────────────────────────────────────────────────────

/** The four lines of a hero (`copy-swap` lanes). */
export const HERO_SLOTS = ['headline', 'sub', 'cta', 'reassure'] as const;
export type HeroSlot = (typeof HERO_SLOTS)[number];
/** What can be wrong with a line, in the order it's checked. */
export const COPY_FLAWS = ['long', 'buzz', 'we', 'generic', 'vague'] as const;
export type CopyFlaw = (typeof COPY_FLAWS)[number];
/** Most words each line can carry and still be read in the five seconds a visitor gives a hero. */
export const COPY_LIMITS: Record<HeroSlot, number> = { headline: 8, sub: 20, cta: 5, reassure: 10 };
/** Words that sound like marketing and say nothing a visitor can picture. */
export const BUZZWORDS = ['unlock', 'potential', 'revolutionary', 'revolutionise', 'next-level', 'seamless', 'seamlessly', 'transform', 'journey',
  'elevate', 'empower', 'empowering', 'holistic', 'ecosystem', 'platform', 'solution', 'solutions', 'ai-powered', 'cutting-edge', 'world-class',
  'synergy', 'leverage', 'leverages', 'best-in-class', 'game-changing'] as const;
/** Button labels that name an action but not what the visitor gets. */
export const GENERIC_CTAS = ['submit', 'click here', 'learn more', 'sign up', 'register', 'go', 'continue', 'get started', 'buy now', 'start', 'download'] as const;
const NUMBER = /\d|\b(one|two|three|four|five|six|seven|eight|nine|ten|twelve|twenty)\b/i;
export const wordsOf = (text: string) => text.split(/\s+/).filter(Boolean);
const bare = (w: string) => w.toLowerCase().replace(/[^a-z0-9-]/g, '');
/** Every flaw a line has for its slot, in `COPY_FLAWS` order. The headline and the sub need a concrete number. */
export const copyFlaws = (text: string, slot: HeroSlot): CopyFlaw[] => {
  const ws = wordsOf(text).map(bare);
  const we = ws.filter(w => ['we', 'our', 'us'].includes(w)).length, you = ws.filter(w => ['you', 'your'].includes(w)).length;
  const flaws: CopyFlaw[] = [];
  if (ws.length > COPY_LIMITS[slot]) flaws.push('long');
  if (ws.some(w => (BUZZWORDS as readonly string[]).includes(w))) flaws.push('buzz');
  if (ws[0] === 'we' || ws[0] === 'our' || we > you) flaws.push('we');
  if (slot === 'cta' && (GENERIC_CTAS as readonly string[]).includes(ws.join(' '))) flaws.push('generic');
  if ((slot === 'headline' || slot === 'sub') && !NUMBER.test(text)) flaws.push('vague');
  return flaws;
};
/** Which words of a line to underline: the buzzwords and the we-words. */
export const flaggedWords = (text: string) => wordsOf(text).map(w => { const b = bare(w); return (BUZZWORDS as readonly string[]).includes(b) || ['we', 'our', 'us'].includes(b); });
/** A draft line as phrases you can swap: each segment's first option is the draft. */
export interface CopyDraft { slot: HeroSlot; page: 'launch' | 'teams'; segments: readonly (readonly string[])[] }
/** The line a choice of options makes (one index per segment); empty options drop out. */
export const copyLine = (d: CopyDraft, picks: readonly number[]) =>
  d.segments.map((s, i) => s[picks[i] ?? 0]).filter(Boolean).join(' ').replace(/\s+([,.!?:])/g, '$1');
/** Every choice of options, as index lists. */
export const copyChoices = (d: CopyDraft): number[][] =>
  d.segments.reduce<number[][]>((acc, s) => acc.flatMap(c => s.map((_, i) => [...c, i])), [[]]);
/** Kabir's and the agency's drafts for the launch page and the Sukoon for Teams page (`copy-swap` cards). */
export const SUKOON_DRAFTS = {
  launchHead: { slot: 'headline', page: 'launch', segments: [['Unlock your inner calm', 'Calm in five minutes,', 'Stress less'], ['with our AI-powered meditation ecosystem', 'between meetings', 'with our app']] },
  launchSub: { slot: 'sub', page: 'launch', segments: [['We are a team of passionate experts who built', 'Five-minute guided sessions', 'Guided sessions'], ['a revolutionary platform to transform your journey.', 'you can do at your desk, in a cab or before a call.', 'that unlock your potential.']] },
  launchCta: { slot: 'cta', page: 'launch', segments: [['Submit', 'Start your free week', 'Click here to begin your journey']] },
  launchSafe: { slot: 'reassure', page: 'launch', segments: [['By signing up you agree to our terms and consent to receive our marketing emails.', 'We promise you’ll love it.', 'Free for 7 days. No card needed.']] },
  teamsHead: { slot: 'headline', page: 'teams', segments: [['Empowering holistic employee wellness', 'Our wellness platform for teams', 'Five-minute calm breaks for your team']] },
  teamsSub: { slot: 'sub', page: 'teams', segments: [['Our platform leverages', 'Your people get', 'Our employees can access'], ['best-in-class content to drive synergy.', '200 short sessions in English and Hindi, and you see usage, never names.', 'great content.']] },
  teamsCta: { slot: 'cta', page: 'teams', segments: [['Learn more', 'Book a 20-minute demo', 'Contact our sales team today for pricing']] },
  teamsSafe: { slot: 'reassure', page: 'teams', segments: [['Our team will reach out to you shortly.', 'Pick any time that suits you, and we reply within a day.', 'A 20-minute call with a real person, no slides.']] },
} as const satisfies Record<string, CopyDraft>;
export type SukoonDraft = keyof typeof SUKOON_DRAFTS;

// ── Social and campaign assets (br.3-3, `asset-fit`) ─────────────────────────────────────────────────────────────────

/** The formats one campaign goes out in (`asset-fit` lanes). */
export const ASSET_FORMATS = ['post', 'story', 'thumb', 'link'] as const;
export type AssetFormat = (typeof ASSET_FORMATS)[number];
/** Each format's canvas, the bands the app's own UI covers, and how wide it's shown on the smallest place it lives. */
export const FORMAT_SPECS: Record<AssetFormat, { name: string; w: number; h: number; top: number; bottom: number; margin: number; shownPx: number; where: string }> = {
  post: { name: 'Instagram post', w: 1080, h: 1350, top: 0, bottom: 0, margin: 60, shownPx: 360, where: 'the feed, full phone width' },
  story: { name: 'Story or Status', w: 1080, h: 1920, top: 250, bottom: 340, margin: 60, shownPx: 360, where: 'full screen, under the profile bar and the reply bar' },
  thumb: { name: 'YouTube thumbnail', w: 1280, h: 720, top: 0, bottom: 0, margin: 60, shownPx: 168, where: 'the Up next list, 168 px wide' },
  link: { name: 'Link preview', w: 1200, h: 630, top: 0, bottom: 0, margin: 60, shownPx: 300, where: 'a WhatsApp or LinkedIn message, about 300 px wide' },
};
/** Text smaller than this on the phone, after the asset is shrunk to where it's shown, can't be read in a scroll. */
export const MIN_SHOWN_PX = 12;
/** Most words a campaign headline can carry while someone scrolls past. */
export const ASSET_WORDS = 7;
export const ASSET_ISSUES = ['unsafe', 'overlap', 'tiny', 'wordy'] as const;
export type AssetIssue = (typeof ASSET_ISSUES)[number];
/** A layout in the format's own pixels: tops of the headline, the logo and the button (if any), and the headline's size. */
export interface AssetLayout { head: number; size: number; logo: number; cta?: number; line: number }
export interface Asset { format: AssetFormat; text: string; lines: readonly string[]; draft: AssetLayout; fix: AssetLayout }
/** Average letter width as a share of the font size, for the bold sans the campaign uses. */
const CHAR_EM = 0.55;
/** A headline wrapped at `size` px into its format's text width, greedily, word by word. */
export const headWrap = (line: string, size: number, f: AssetFormat) => {
  const width = FORMAT_SPECS[f].w - 2 * FORMAT_SPECS[f].margin, per = Math.max(1, Math.floor(width / (size * CHAR_EM)));
  const out: string[] = [];
  for (const w of wordsOf(line)) { const last = out.at(-1); if (last !== undefined && last.length + 1 + w.length <= per) out[out.length - 1] = `${last} ${w}`; else out.push(w); }
  return out;
};
/** How many lines a headline wraps to at `size` px in its format's text width. */
export const headLines = (line: string, size: number, f: AssetFormat) => Math.max(1, headWrap(line, size, f).length);
export const LOGO_H: Record<AssetFormat, number> = { post: 90, story: 110, thumb: 90, link: 80 };
export const CTA_H: Record<AssetFormat, number> = { post: 110, story: 140, thumb: 0, link: 0 };
/** The boxes a layout draws, top and bottom, in format pixels. */
export const assetBoxes = (a: Pick<Asset, 'format' | 'lines'>, l: AssetLayout) => {
  const f = a.format, headH = Math.round(headLines(a.lines[l.line], l.size, f) * l.size * 1.15);
  return [
    { id: 'head' as const, top: l.head, bottom: l.head + headH },
    { id: 'logo' as const, top: l.logo, bottom: l.logo + LOGO_H[f] },
    ...(l.cta !== undefined ? [{ id: 'cta' as const, top: l.cta, bottom: l.cta + CTA_H[f] }] : []),
  ];
};
/** How tall the headline's letters are on the phone, where the asset is shown smallest. */
export const shownSize = (f: AssetFormat, size: number) => (size * FORMAT_SPECS[f].shownPx) / FORMAT_SPECS[f].w;
/** Every issue a layout has, in `ASSET_ISSUES` order. */
export const assetIssues = (a: Pick<Asset, 'format' | 'lines'>, l: AssetLayout): AssetIssue[] => {
  const s = FORMAT_SPECS[a.format], boxes = assetBoxes(a, l), out: AssetIssue[] = [];
  if (boxes.some(b => b.top < Math.max(s.top, s.margin) || b.bottom > s.h - Math.max(s.bottom, s.margin))) out.push('unsafe');
  if (boxes.some((b, i) => boxes.some((c, j) => j > i && b.top < c.bottom && c.top < b.bottom))) out.push('overlap');
  if (shownSize(a.format, l.size) < MIN_SHOWN_PX) out.push('tiny');
  if (wordsOf(a.lines[l.line]).length > ASSET_WORDS) out.push('wordy');
  return out;
};
/** The launch campaign, cut into each format by the agency (`asset-fit` cards). `draft` is what they sent; `fix` is
 *  one layout that works. The game starts from the draft and moves blocks in `ASSET_STEP` px steps. */
export const SUKOON_ASSETS = {
  storyLaunch: { format: 'story', text: 'The launch Story, with the headline under the profile bar and the button under the reply bar', lines: ['Calm in five minutes'],
    draft: { head: 120, size: 120, logo: 900, cta: 1700, line: 0 }, fix: { head: 360, size: 120, logo: 900, cta: 1380, line: 0 } },
  storyTeams: { format: 'story', text: 'A Status for HR heads, with the logo sitting on the headline', lines: ['Calm breaks for your whole team', 'Calm breaks for your team'],
    draft: { head: 600, size: 100, logo: 680, cta: 1300, line: 0 }, fix: { head: 600, size: 100, logo: 960, cta: 1300, line: 0 } },
  postLaunch: { format: 'post', text: 'The launch post, with every feature in the headline', lines: ['Sukoon is now live with 200 sessions, sleep stories, offline mode and Hindi', 'Sukoon is live. Calm in five minutes.'],
    draft: { head: 180, size: 64, logo: 1100, cta: 900, line: 0 }, fix: { head: 180, size: 80, logo: 1100, cta: 900, line: 1 } },
  postQuote: { format: 'post', text: 'A review post: “Five minutes in the cab. Every day.” Ananya, Pune', lines: ['“Five minutes in the cab. Every day.”'],
    draft: { head: 240, size: 84, logo: 1140, line: 0 }, fix: { head: 240, size: 84, logo: 1140, line: 0 } },
  thumbTalk: { format: 'thumb', text: 'The YouTube thumbnail for a five-minute guided session', lines: ['Five minutes of calm before your next meeting, guided in Hindi and English', 'Calm in 5 minutes'],
    draft: { head: 200, size: 44, logo: 560, line: 0 }, fix: { head: 160, size: 110, logo: 560, line: 1 } },
  linkCard: { format: 'link', text: 'The preview card when someone shares the launch page on WhatsApp', lines: ['Calm in five minutes, between meetings'],
    draft: { head: 180, size: 40, logo: 470, line: 0 }, fix: { head: 140, size: 64, logo: 470, line: 0 } },
} as const satisfies Record<string, Asset>;
export type SukoonAsset = keyof typeof SUKOON_ASSETS;
/** How far one tap moves a block, in the format's pixels. */
export const ASSET_STEP: Record<AssetFormat, number> = { post: 30, story: 40, thumb: 20, link: 10 };
/** The headline sizes a tap can step through. */
export const ASSET_SIZES = [40, 44, 56, 64, 72, 80, 84, 100, 110, 120] as const;

// ── SEO basics (br.3-4, `serp-spot`) ─────────────────────────────────────────────────────────────────────────────────

/** The parts of a page where an SEO problem lives (`serp-spot` lanes). */
export const SEO_AREAS = ['snippet', 'headings', 'images', 'links'] as const;
export type SeoArea = (typeof SEO_AREAS)[number];
/** Google cuts a title at about 600 px on a desktop, roughly 60 characters, and a description at about 160. */
export const TITLE_MAX = 60;
export const DESC_MAX = 160;
/** Images heavier than this slow the first screen; a slow 4G phone gets about 3 Mbps. */
export const IMAGE_MAX_KB = 200;
export const SLOW_4G_MBPS = 3;
export const GENERIC_LINKS = ['click here', 'here', 'read more', 'learn more', 'more'] as const;
export interface SeoPage {
  /** What people type when they need this page. */
  query: string;
  title: string; description: string; slug: string;
  headings: readonly { level: number; text: string }[];
  images: readonly { name: string; alt?: string; decorative?: boolean; kb: number; textInImage?: boolean }[];
  /** `href` missing: a clickable div run by script, which search engines can't follow. */
  links: readonly { text: string; href?: string }[];
}
export const SEO_ISSUES = ['titleLong', 'titleQuery', 'desc', 'slug', 'h1', 'skip', 'alt', 'textImage', 'heavy', 'linkText', 'crawl'] as const;
export type SeoIssue = (typeof SEO_ISSUES)[number];
export const SEO_AREA_OF: Record<SeoIssue, SeoArea> = {
  titleLong: 'snippet', titleQuery: 'snippet', desc: 'snippet', slug: 'snippet',
  h1: 'headings', skip: 'headings',
  alt: 'images', textImage: 'images', heavy: 'images',
  linkText: 'links', crawl: 'links',
};
/** Seconds an image takes to arrive on a slow 4G phone. */
export const loadSeconds = (kb: number) => (kb * 8) / 1000 / SLOW_4G_MBPS;
/** The title as Google shows it: cut at a word before `TITLE_MAX`, with an ellipsis. */
export const serpTitle = (title: string) => {
  if (title.length <= TITLE_MAX) return title;
  const cut = title.slice(0, TITLE_MAX - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s|–-]+$/, '')} …`;
};
/** Every SEO issue a page has, in `SEO_ISSUES` order. */
export const seoIssues = (pg: SeoPage): SeoIssue[] => {
  const out: SeoIssue[] = [], title = pg.title.toLowerCase();
  if (pg.title.length > TITLE_MAX) out.push('titleLong');
  if (!wordsOf(pg.query).every(w => title.includes(w.toLowerCase()))) out.push('titleQuery');
  if (!pg.description || pg.description.length > DESC_MAX) out.push('desc');
  if (!/^\/[a-z0-9-]*$/.test(pg.slug)) out.push('slug');
  if (pg.headings.filter(h => h.level === 1).length !== 1) out.push('h1');
  if (pg.headings.some((h, i) => i > 0 && h.level > pg.headings[i - 1].level + 1)) out.push('skip');
  if (pg.images.some(i => !i.decorative && !i.alt)) out.push('alt');
  if (pg.images.some(i => i.textInImage)) out.push('textImage');
  if (pg.images.some(i => i.kb > IMAGE_MAX_KB)) out.push('heavy');
  if (pg.links.some(l => (GENERIC_LINKS as readonly string[]).includes(l.text.toLowerCase()))) out.push('linkText');
  if (pg.links.some(l => !l.href)) out.push('crawl');
  return out;
};
/** Sukoon's launch page as it went live: beautiful, and nearly blank to a search engine. */
export const SUKOON_SEO_BEFORE: SeoPage = {
  query: 'meditation app',
  title: 'Home | Welcome to the Official Website of Sukoon Wellness Private Limited',
  description: '',
  slug: '/index.php?page_id=42',
  headings: [{ level: 1, text: 'Sukoon' }, { level: 1, text: 'Welcome' }, { level: 4, text: 'How it works' }, { level: 2, text: 'Pricing' }, { level: 2, text: 'Questions' }],
  images: [
    { name: 'hero.png', alt: 'Calm in five minutes, between meetings', kb: 2400, textInImage: true },
    { name: 'reviews.png', kb: 180 },
    { name: 'wave.svg', alt: '', decorative: true, kb: 4 },
  ],
  links: [{ text: 'Click here', href: '/pricing' }, { text: 'Start your free week' }],
};
/** One fix per issue, each touching only what that issue needs. */
export const SEO_FIXES: Record<SeoIssue, { fix: string; apply: (pg: SeoPage) => SeoPage }> = {
  titleLong: { fix: 'Cut the title to what matters, and put the brand last', apply: pg => ({ ...pg, title: pg.title.replace(/ \| Welcome.*$/, ' | Sukoon') }) },
  titleQuery: { fix: 'Start the title with the words people search for', apply: pg => ({ ...pg, title: pg.title.replace(/^Home/, '5-minute meditation app') }) },
  desc: { fix: 'Write a description of under 160 characters that sells the click', apply: pg => ({ ...pg, description: 'Short guided meditations for busy days, in English and Hindi. Calm in five minutes, between meetings. Free for 7 days.' }) },
  slug: { fix: 'Give the page a readable address', apply: pg => ({ ...pg, slug: '/meditation-app' }) },
  h1: { fix: 'One H1, and make it the headline', apply: pg => ({ ...pg, headings: [{ level: 1, text: 'Calm in five minutes, between meetings' }, ...pg.headings.filter(h => h.level !== 1)] }) },
  skip: { fix: 'Step headings down one level at a time', apply: pg => ({ ...pg, headings: pg.headings.map((h, i) => (i > 0 && h.level > pg.headings[i - 1].level + 1 ? { ...h, level: pg.headings[i - 1].level + 1 } : h)) }) },
  alt: { fix: 'Say what the picture shows, in words', apply: pg => ({ ...pg, images: pg.images.map(i => (!i.decorative && !i.alt ? { ...i, alt: 'Rated 4.8 by 12,000 people on the Play Store' } : i)) }) },
  textImage: { fix: 'Set the headline as live text over the photo', apply: pg => ({ ...pg, images: pg.images.map(i => (i.textInImage ? { ...i, textInImage: false } : i)) }) },
  heavy: { fix: 'Export the hero as WebP at the size it’s shown', apply: pg => ({ ...pg, images: pg.images.map(i => (i.kb > IMAGE_MAX_KB ? { ...i, name: i.name.replace(/\.\w+$/, '.webp'), kb: 140 } : i)) }) },
  linkText: { fix: 'Make the link say where it goes', apply: pg => ({ ...pg, links: pg.links.map(l => ((GENERIC_LINKS as readonly string[]).includes(l.text.toLowerCase()) ? { ...l, text: 'See plans and prices' } : l)) }) },
  crawl: { fix: 'Make the button a real link with an address', apply: pg => ({ ...pg, links: pg.links.map(l => (l.href ? l : { ...l, href: '/start' })) }) },
};
/** The page with the given fixes applied, in any order. */
export const fixSeo = (pg: SeoPage, issues: readonly SeoIssue[]) => issues.reduce((acc, k) => SEO_FIXES[k].apply(acc), pg);
