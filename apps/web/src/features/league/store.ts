'use client';
// Your league: tier, the week you're competing in, and past results. Saved in this browser until accounts exist
// (then the weekly rollover runs as a cron over leagues / league_members, using the same @shape/engine rules).
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TIERS, initialLeague, standings, syncLeague, weekOf, weeklyXp, type LeagueState, type TierRank, type WeekResult } from '@shape/engine';
import { useProgress } from '../progress/store';

export const tierName = (t: TierRank) => TIERS[t - 1];

/** "3d 4h", "5h 12m", "8m": time left until the week ends. */
export function timeLeft(end: Date, now: Date) {
  const m = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 60_000));
  const d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60);
  return d ? `${d}d ${h}h` : h ? `${h}h ${m % 60}m` : `${m}m`;
}

interface LeagueStore extends LeagueState {
  /** The last settled week whose result you've seen. */
  seen: string | null;
  sync: (ledger: { at: string; amount: number }[], name: string) => void;
  acknowledge: () => void;
}

export const useLeagueStore = create<LeagueStore>()(persist((set, get) => ({
  ...initialLeague(),
  seen: null,
  sync: (ledger, name) => {
    const { tier, week, history } = get();
    const { state } = syncLeague({ tier, week, history }, ledger, new Date(), name);
    if (state.tier !== tier || state.week !== week || state.history.length !== history.length) set(state);
  },
  acknowledge: () => set(s => ({ seen: s.history.at(-1)?.week ?? null })),
}), { name: 'shape.league.v1', version: 1, partialize: ({ tier, week, history, seen }) => ({ tier, week, history, seen }) }));

/** Re-renders every `ms` so rivals' scores and the countdown move while the screen is open. */
function useNow(ms: number) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), ms); return () => clearInterval(t); }, [ms]);
  return now;
}

/** League view model: keeps the league in step with the XP ledger and returns this week's table. */
export function useLeague(name = 'You') {
  const ledger = useProgress(s => s.ledger);
  const league = useLeagueStore();
  const now = useNow(30_000);
  const { sync } = league;
  useEffect(() => { sync(ledger, name); }, [ledger, name, sync, now]);

  const week = league.week ?? weekOf(now);
  const xp = weeklyXp(ledger, week);
  const table = standings({ name, xp }, week, league.tier, now);
  const last: WeekResult | undefined = league.history.at(-1);
  return {
    tier: league.tier, joined: league.week !== null, week, xp, table, now,
    you: table.find(r => r.you)!,
    /** A settled week you haven't seen yet: shown once as a result banner. */
    result: last && last.week !== league.seen ? last : undefined,
    acknowledge: league.acknowledge,
  };
}
