// Weekly leagues (docs/01-product-vision.md §5 Arena): groups of 20, XP from mastery only.
// Pure functions so the browser (today) and the weekly rollover cron (later) share one set of rules.
// Until accounts exist, the other 19 seats are filled by seeded practice rivals.

export const TIERS = ['Sketch', 'Wireframe', 'Mockup', 'Prototype', 'Polished', 'Shipped', 'Masterpiece'] as const;
export type TierRank = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export const TOP_TIER = TIERS.length as TierRank;
export const GROUP_SIZE = 20;
export const MOVE = 5;   // the top 5 move up and the bottom 5 move down

export type Outcome = 'promoted' | 'stayed' | 'demoted';
export type Zone = 'up' | 'down' | 'safe';
export interface LedgerEntry { at: string; amount: number }
export interface Rival { id: string; name: string; target: number; days: number[] }
export interface Standing { id: string; name: string; xp: number; rank: number; zone: Zone; you: boolean }
export interface WeekResult { week: string; tier: TierRank; rank: number; xp: number; outcome: Outcome; nextTier: TierRank }
export interface LeagueState {
  tier: TierRank;
  /** The week you're competing in (its Monday), or null until you earn XP this week. */
  week: string | null;
  history: WeekResult[];
}

export const initialLeague = (): LeagueState => ({ tier: 1, week: null, history: [] });

// ---------- calendar (local time: a week runs Monday 00:00 → next Monday 00:00) ----------

const key = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const monday = (week: string) => { const [y, m, d] = week.split('-').map(Number); return new Date(y, m - 1, d); };

/** The Monday (YYYY-MM-DD) of the week that contains `d`. */
export function weekOf(d: Date): string {
  const m = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  m.setDate(m.getDate() - ((m.getDay() + 6) % 7));
  return key(m);
}

export function weekEndsAt(week: string): Date { const d = monday(week); d.setDate(d.getDate() + 7); return d; }

/** How far through the week `now` is, 0 → 1. */
export function weekElapsed(week: string, now: Date): number {
  const start = monday(week).getTime(), end = weekEndsAt(week).getTime();
  return Math.min(1, Math.max(0, (now.getTime() - start) / (end - start)));
}

/** XP earned inside one league week. */
export const weeklyXp = (ledger: LedgerEntry[], week: string) =>
  ledger.reduce((t, e) => t + (weekOf(new Date(e.at)) === week ? e.amount : 0), 0);

// ---------- practice rivals ----------

function hash(s: string) { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; }
function rng(seed: number) {   // mulberry32: small, fast, reproducible
  return () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

const NAMES = ['Aarav', 'Ananya', 'Vihaan', 'Diya', 'Ishaan', 'Saanvi', 'Kabir', 'Meera', 'Arjun', 'Kavya', 'Rohan', 'Nisha',
  'Aditya', 'Priya', 'Dev', 'Tara', 'Neel', 'Zoya', 'Kiran', 'Riya', 'Farhan', 'Isha', 'Varun', 'Pooja', 'Sam', 'Leah', 'Omar', 'Mei'];
const INITIALS = 'ABCDGIJKMNPRSTV';

/** Median weekly XP in a tier: roughly two to three lessons a week in Sketch, rising 35% per tier. */
export const tierMedian = (tier: TierRank) => Math.round(80 * 1.35 ** (tier - 1));

/**
 * The 19 rivals for a week and tier. Same inputs → same rivals, so a reload never reshuffles the table.
 * The mix mirrors real leagues: a few people barely show up, most are casual or steady, one or two grind.
 */
export function rivalsFor(week: string, tier: TierRank): Rival[] {
  const r = rng(hash(`${week}|${tier}`));
  const names = [...NAMES].sort(() => r() - 0.5);
  const median = tierMedian(tier);
  return Array.from({ length: GROUP_SIZE - 1 }, (_, i) => {
    const roll = r();
    const scale = roll < 0.18 ? r() * 0.15 : roll < 0.55 ? 0.4 + r() * 0.45 : roll < 0.9 ? 0.85 + r() * 0.5 : 1.5 + r() * 0.8;
    const active = scale < 0.2 ? 0.3 : scale < 0.9 ? 0.6 : 0.85;   // chance of practising on a given day
    const days = Array.from({ length: 7 }, () => (r() < active ? 0.5 + r() : 0));
    if (!days.some(d => d > 0)) days[Math.floor(r() * 7)] = 1;
    return { id: `rival-${i}`, name: `${names[i % names.length]} ${INITIALS[Math.floor(r() * INITIALS.length)]}.`, target: Math.round(median * scale), days };
  });
}

/** A rival's XP so far: their weekly target, spread over the days they practise. */
export function rivalXp(rival: Rival, elapsed: number): number {
  const total = rival.days.reduce((a, b) => a + b, 0);
  const t = Math.min(7, Math.max(0, elapsed * 7));
  const day = Math.floor(t);
  let done = 0;
  for (let i = 0; i < day && i < 7; i++) done += rival.days[i];
  if (day < 7) done += rival.days[day] * (t - day);
  return Math.round((rival.target * done) / total);
}

// ---------- the table ----------

export function zoneFor(rank: number, tier: TierRank): Zone {
  if (rank <= MOVE && tier < TOP_TIER) return 'up';
  if (rank > GROUP_SIZE - MOVE && tier > 1) return 'down';
  return 'safe';
}

/** The league table. On a tie you rank above the practice rivals. */
export function standings(you: { name: string; xp: number }, week: string, tier: TierRank, now: Date): Standing[] {
  const elapsed = weekElapsed(week, now);
  const rows = [
    { id: 'you', name: you.name, xp: you.xp, you: true },
    ...rivalsFor(week, tier).map(r => ({ id: r.id, name: r.name, xp: rivalXp(r, elapsed), you: false })),
  ].sort((a, b) => b.xp - a.xp || Number(b.you) - Number(a.you));
  return rows.map((row, i) => ({ ...row, rank: i + 1, zone: zoneFor(i + 1, tier) }));
}

const nextTier = (tier: TierRank, outcome: Outcome) =>
  (outcome === 'promoted' ? tier + 1 : outcome === 'demoted' ? tier - 1 : tier) as TierRank;

/**
 * Brings the league up to date with the ledger:
 *  1. a finished week is settled (final table → promoted / stayed / demoted), and
 *  2. you join this week's league as soon as you earn XP in it. Weeks with no XP have no league, so nobody is demoted for a holiday.
 */
export function syncLeague(state: LeagueState, ledger: LedgerEntry[], now: Date, name = 'You'): { state: LeagueState; settled?: WeekResult } {
  const current = weekOf(now);
  let next = state, settled: WeekResult | undefined;
  if (state.week && state.week < current) {
    const xp = weeklyXp(ledger, state.week);
    const row = standings({ name, xp }, state.week, state.tier, weekEndsAt(state.week)).find(r => r.you)!;
    const outcome: Outcome = row.zone === 'up' ? 'promoted' : row.zone === 'down' ? 'demoted' : 'stayed';
    settled = { week: state.week, tier: state.tier, rank: row.rank, xp, outcome, nextTier: nextTier(state.tier, outcome) };
    next = { tier: settled.nextTier, week: null, history: [...state.history, settled] };
  }
  if (!next.week && weeklyXp(ledger, current) > 0) next = { ...next, week: current };
  return { state: next, settled };
}
