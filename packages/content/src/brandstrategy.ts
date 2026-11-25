// Sukoon's brand strategy, for chapter br.4. Sukoon is the meditation app from br.1 to br.3: for busy professionals who
// can't switch off, calm in five minutes; calm, warm and expert. A year after launch it has 4 lakh paying subscribers,
// a Teams plan for employers, and has just bought Neend, a sleep-sounds app. Kabir Malhotra founded it; Ishita Rao,
// now head of brand, runs its first brand campaign, “Switch off”. Meera Sethi, a product manager in Gurugram, is the
// subscriber the film is about. This is the data the br.4 scenes and games draw, and the rules they score against: the
// part of the story a campaign piece carries, where an offering sits in the brand family, and what a month of search
// data says about a brand's future share.

// ── Narrative arcs for products (br.4-1, `arc-map`) ───────────────────────────────────────────────────────────────

/** The part of the campaign story a piece carries (`arc-map` lanes). `tension`: the problem, as the audience lives it.
 *  `turn`: the moment the product helps, shown as something you can do. `proof`: the new normal, shown in real lives.
 *  `off`: not part of the story: it is about the brand, or it asserts instead of showing. */
export const CAMPAIGN_ROLES = ['tension', 'turn', 'proof', 'off'] as const;
export type CampaignRole = (typeof CAMPAIGN_ROLES)[number];

/** A piece of the “Switch off” campaign. `about`: whose story it tells. `shows`: what it shows of that story.
 *  `specific`: a concrete moment, person or number, not a general claim. `channel`: where it runs. */
export interface CampaignPiece {
  text: string; short: string; channel: string;
  about: 'customer' | 'brand'; shows: 'problem' | 'change' | 'result'; specific: boolean;
}

/** The customer is the hero and the brand the guide: a piece about the brand is off the story, and so is one that
 *  claims instead of showing. The rest carry the part of the story they show. */
export const arcRole = (c: CampaignPiece): CampaignRole =>
  c.about === 'brand' || !c.specific ? 'off' : c.shows === 'problem' ? 'tension' : c.shows === 'change' ? 'turn' : 'proof';

const PIECES = {
  filmOpen: { short: 'Film: dinner', channel: 'Film, 0–20 s', text: 'Meera answers Slack at the dinner table while her daughter tells her about school. She nods and hears none of it.', about: 'customer', shows: 'problem', specific: true },
  billboard: { short: 'Billboard', channel: 'Billboard', text: 'On the Gurugram expressway at 9 pm: “Laptop shut. Head still in the meeting.”', about: 'customer', shows: 'problem', specific: true },
  audio: { short: 'Late audio', channel: 'Spotify audio, 11 pm', text: 'A phone buzzes three times, then silence: “Your day ended two hours ago. Did your head get the message?”', about: 'customer', shows: 'problem', specific: true },
  filmTurn: { short: 'Film: the lift', channel: 'Film, 20–40 s', text: 'In the office lift Meera opens Sukoon. A voice says “Breathe out longer than you breathe in.” Her shoulders drop as the floors count down.', about: 'customer', shows: 'change', specific: true },
  bumper: { short: '6-second ad', channel: 'YouTube, 6 s', text: 'One long breath out over a closing laptop, and the words “Five minutes. Then switch off.”', about: 'customer', shows: 'change', specific: true },
  reel: { short: 'Lift breath reel', channel: 'Instagram reel', text: 'A 30-second lift breath anyone can try right now, with no download: in for four, out for six, three times.', about: 'customer', shows: 'change', specific: true },
  filmEnd: { short: 'Film: the story', channel: 'Film, 40–60 s', text: 'The next evening Meera closes the laptop, sits on the floor, and hears the end of her daughter’s story.', about: 'customer', shows: 'result', specific: true },
  carousel: { short: 'Five subscribers', channel: 'Instagram carousel', text: 'Five subscribers, first names and photos, each with the moment they use Sukoon: “Before the 9:30 stand-up”, “In the cab home”.', about: 'customer', shows: 'result', specific: true },
  study: { short: 'The Teams pilot', channel: 'LinkedIn post', text: 'An eight-week pilot with 412 employees at three Bengaluru firms: those who used Sukoon on four days a week reported sleeping 26 minutes longer.', about: 'customer', shows: 'result', specific: true },
  number1: { short: '“India’s #1”', channel: 'Press ad', text: '“India’s #1 meditation app, with 40 world-class experts.”', about: 'brand', shows: 'result', specific: true },
  features: { short: 'Feature list', channel: 'Display banner', text: 'A banner listing 120 sessions, 8 languages, sleep stories, focus music and offline mode.', about: 'brand', shows: 'change', specific: true },
  bestLife: { short: '“Best life”', channel: 'Display banner', text: '“Feel calmer instantly. Live your best life.”', about: 'customer', shows: 'result', specific: false },
} as const satisfies Record<string, CampaignPiece>;
export type SukoonPiece = keyof typeof PIECES;
export const SUKOON_PIECES: Record<SukoonPiece, CampaignPiece> = PIECES;

/** The 60-second film, beat by beat, with how tense each moment feels (0 calm, 10 the worst of it): the shape the
 *  scene draws. The tension builds to the turn, then falls lower than it started. */
export const SUKOON_FILM = [
  { at: 0, beat: 'Dinner, Slack open', tension: 5 },
  { at: 10, beat: 'Misses her daughter’s story', tension: 8 },
  { at: 18, beat: 'Lies awake, replaying the day', tension: 9 },
  { at: 26, beat: 'Opens Sukoon in the lift', tension: 6 },
  { at: 36, beat: 'Five minutes, one long breath out', tension: 3 },
  { at: 48, beat: 'Hears the end of the story', tension: 1 },
] as const;

/** The brand's long story, which every campaign retells in its own way. */
export const SUKOON_NARRATIVE = 'Work got faster. Your head didn’t. Five minutes to switch off, and be where you are.';

// ── Brand architecture (br.4-2, `family-sort`) ───────────────────────────────────────────────────────────────────

/** Where an offering sits in the brand family (`family-sort` lanes), from Aaker and Joachimsthaler's brand
 *  relationship spectrum. `master`: Sukoon itself, with a plain description. `sub`: a Sukoon sub-brand, for a
 *  different buyer. `endorsed`: its own name, backed by Sukoon. `own`: its own brand, kept apart from Sukoon. */
export const ARCH_CALLS = ['master', 'sub', 'endorsed', 'own'] as const;
export type ArchCall = (typeof ARCH_CALLS)[number];

/** An offering Sukoon makes, sells or has bought. `name`: what it would be called on its own. `fits`: it keeps the
 *  master promise, calm in five minutes for busy professionals. `risk`: a failure or a bad headline would damage that
 *  promise. `equity`: it already has a name people know and trust. `newBuyer`: someone other than the subscriber
 *  chooses or pays for it. */
export interface Offering { text: string; short: string; name: string; fits: boolean; risk: boolean; equity: boolean; newBuyer: boolean }

/** Protect the promise first: what doesn't keep it, or could break it, gets its own brand. Then keep the equity you
 *  bought, behind an endorsement. Then give a different buyer a sub-brand. Everything else is just Sukoon. */
export const archCall = (o: Offering): ArchCall =>
  !o.fits || o.risk ? 'own' : o.equity ? 'endorsed' : o.newBuyer ? 'sub' : 'master';

/** What the offering is called once it has its place in the family. */
export const archName = (o: Offering): string => {
  switch (archCall(o)) {
    case 'master': return `Sukoon · ${o.name}`;
    case 'sub': return `Sukoon ${o.name}`;
    case 'endorsed': return `${o.name}, by Sukoon`;
    case 'own': return o.name;
  }
};

const OFFERS = {
  sleep: { short: 'Sleep stories', name: 'Sleep stories', text: 'Sleep stories and wind-down sessions, inside the same subscription', fits: true, risk: false, equity: false, newBuyer: false },
  focus: { short: 'Focus music', name: 'Focus music', text: 'Focus music for deep work, inside the same subscription', fits: true, risk: false, equity: false, newBuyer: false },
  watch: { short: 'Watch app', name: 'on your watch', text: 'Two-minute breathing on Wear OS and Apple Watch', fits: true, risk: false, equity: false, newBuyer: false },
  tamil: { short: 'Tamil, Bengali', name: 'in Tamil', text: 'Every session recorded in Tamil and Bengali by native teachers', fits: true, risk: false, equity: false, newBuyer: false },
  teams: { short: 'Teams plan', name: 'Teams', text: 'A plan HR teams buy per seat, with a dashboard of how many staff use it', fits: true, risk: false, equity: false, newBuyer: true },
  kids: { short: 'Kids', name: 'Kids', text: 'Five-minute bedtime calm for 6 to 10 year olds, chosen and paid for by parents', fits: true, risk: false, equity: false, newBuyer: true },
  pro: { short: 'Counsellor tool', name: 'Pro', text: 'A tool for counsellors to assign sessions to their clients and see who did them', fits: true, risk: false, equity: false, newBuyer: true },
  neend: { short: 'Neend', name: 'Neend', text: 'Neend, the sleep-sounds app Sukoon just bought: 30 lakh downloads and five years of loyal reviews', fits: true, risk: false, equity: true, newBuyer: false },
  pause: { short: 'Pause', name: 'Pause', text: 'Pause, a Bengaluru app of two-minute desk stretches, bought with 6 lakh users who love its name', fits: true, risk: false, equity: true, newBuyer: false },
  prana: { short: 'Prana Studios', name: 'Prana Studios', text: 'Prana Studios, 12 yoga studios in Pune with hour-long classes and a loyal following, bought last month', fits: false, risk: false, equity: true, newBuyer: false },
  therapy: { short: 'Therapy', name: 'Saath', text: 'Video therapy with licensed psychologists, ₹1,200 a session', fits: true, risk: true, equity: false, newBuyer: false },
  gummies: { short: 'Gummies', name: 'Thehrav', text: 'Ashwagandha sleep gummies to sell on Nykaa and Amazon', fits: false, risk: true, equity: false, newBuyer: false },
} as const satisfies Record<string, Offering>;
export type SukoonOffer = keyof typeof OFFERS;
export const SUKOON_OFFERS: Record<SukoonOffer, Offering> = OFFERS;

// ── Measuring brand (br.4-3, `search-share`) ─────────────────────────────────────────────────────────────────────

/** What a month of search data says about a brand (`search-share` lanes), after Les Binet's work on share of search
 *  (IPA, 2020). `gain`: its share of the category's brand searches is well above its share of the market, so its
 *  share tends to grow. `hold`: the two are close. `lose`: search share is well below market share, a warning.
 *  `distorted`: the count isn't people looking for the brand, so it says nothing yet. */
export const SOS_CALLS = ['gain', 'hold', 'lose', 'distorted'] as const;
export type SosCall = (typeof SOS_CALLS)[number];

/** Points of gap between share of search and share of market before Ishita reads it as a signal. */
export const SOS_GAP = 3;

/** A month of search data. `searches`: searches for the brand; `category`: searches for every brand in the category,
 *  both in thousands. `share`: the brand's share of paying subscribers in the same place, in %. `clean`: the count
 *  is people looking for the brand; `distortion` says what is wrong with it when it isn't. */
export interface SearchReading {
  text: string; short: string; brand: string; searches: number; category: number; share: number; clean: boolean; distortion?: string;
}

/** Share of search, in % of the category's brand searches, to the nearest point. */
export const shareOfSearch = (r: SearchReading) => Math.round((r.searches / r.category) * 100);
/** Share of search minus share of market, in points. */
export const sosGap = (r: SearchReading) => shareOfSearch(r) - r.share;
export const sosCall = (r: SearchReading): SosCall => {
  if (!r.clean) return 'distorted';
  const g = sosGap(r);
  return g >= SOS_GAP ? 'gain' : g <= -SOS_GAP ? 'lose' : 'hold';
};

const READINGS = {
  sukoonIndia: { short: 'Sukoon, India', text: 'Sukoon, all India, October', brand: 'Sukoon', searches: 54, category: 180, share: 24, clean: true },
  shaantIndia: { short: 'Shaant, India', text: 'Shaant, all India, October', brand: 'Shaant', searches: 45, category: 180, share: 31, clean: true },
  dhyanaIndia: { short: 'Dhyana, India', text: 'Dhyana, all India, October', brand: 'Dhyana', searches: 36, category: 180, share: 19, clean: true },
  calmlyIndia: { short: 'Calmly, India', text: 'Calmly, all India, October', brand: 'Calmly', searches: 27, category: 180, share: 9, clean: true },
  sukoonPune: { short: 'Sukoon, Pune', text: 'Sukoon, Pune, October', brand: 'Sukoon', searches: 9, category: 30, share: 29, clean: true },
  sukoonHyd: { short: 'Sukoon, Hyderabad', text: 'Sukoon, Hyderabad, October', brand: 'Sukoon', searches: 4, category: 25, share: 21, clean: true },
  sukoonBlr: { short: 'Sukoon, Bengaluru', text: 'Sukoon, Bengaluru, November', brand: 'Sukoon', searches: 12, category: 40, share: 26, clean: true },
  dhyanaChennai: { short: 'Dhyana, Chennai', text: 'Dhyana, Chennai, November', brand: 'Dhyana', searches: 6, category: 30, share: 27, clean: true },
  shaantMumbai: { short: 'Shaant, Mumbai', text: 'Shaant, Mumbai, November', brand: 'Shaant', searches: 10, category: 40, share: 26, clean: true },
  sukoonRaw: { short: 'Every “sukoon”', text: 'Sukoon, all India, September, counting every search for “sukoon”', brand: 'Sukoon', searches: 410, category: 530, share: 22, clean: false, distortion: '“Sukoon” is an everyday Hindi and Urdu word and the name of a hit song; count “sukoon app” and “sukoon meditation”' },
  shaantNews: { short: 'Shaant, leak month', text: 'Shaant, all India, November, the month its data leak was in the news', brand: 'Shaant', searches: 120, category: 260, share: 30, clean: false, distortion: 'People were reading about a leak, not looking for an app; set the month aside or use the trend either side of it' },
  calmlyCash: { short: 'Calmly, cashback', text: 'Calmly, all India, Diwali week, while it paid ₹100 to anyone who searched its name', brand: 'Calmly', searches: 60, category: 140, share: 9, clean: false, distortion: 'Searches bought with cashback measure the offer, not the brand' },
} as const satisfies Record<string, SearchReading>;
export type SukoonReading = keyof typeof READINGS;
export const SUKOON_READINGS: Record<SukoonReading, SearchReading> = READINGS;

/** A brand-tracker measure before and after a campaign, in campaign cities and in the cities held out. */
export interface TrackerMeasure { measure: string; test: readonly [number, number]; holdout: readonly [number, number] }
/** The lift a campaign caused: the change where it ran minus the change where it didn't (difference in differences). */
export const geoLift = (m: TrackerMeasure) => (m.test[1] - m.test[0]) - (m.holdout[1] - m.holdout[0]);

/** Sukoon's monthly tracker (1,000 working professionals a month, % who say yes), before and after “Switch off”,
 *  which ran in Pune and Bengaluru and was held back from Hyderabad and Chennai. */
export const SUKOON_TRACKER: readonly TrackerMeasure[] = [
  { measure: 'Have heard of Sukoon', test: [31, 42], holdout: [29, 32] },
  { measure: 'Would consider it', test: [14, 19], holdout: [13, 14] },
  { measure: 'Prefer it to any other', test: [6, 8], holdout: [6, 6] },
];

/** Binet and Field's rule of thumb for consumer brands: about 60% of the budget on building the brand, 40% on
 *  activation that sells now. */
export const BRAND_SPLIT = { brand: 0.6, activation: 0.4 } as const;
