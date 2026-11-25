'use client';
// Moves a signed-in learner's progress between this browser and Supabase (table `learner_state`, 0002_accounts.sql).
// On sign-in: pull the server copy, merge it with this browser's (nothing earned on either side is lost), write both.
// After that: every change to the stores is pushed, debounced. Signed out, nothing leaves the browser.
import type { SupabaseClient } from '@supabase/supabase-js';
import { mergeProgress } from '@shape/engine';
import { useProgress } from '../progress/store';
import { useLeagueStore } from '../league/store';
import { useAccount } from './session';

const PROFILE_KEY = 'shape.profile.v1';
const PUSH_DELAY = 2_000;

const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const isEmpty = (o: unknown) => !o || (typeof o === 'object' && Object.keys(o as object).length === 0);

/** The persisted part of each store, as plain JSON. */
function snapshot() {
  const { xp, ledger, streak, lessons, review, bosses, bossDrafts } = useProgress.getState();
  const { tier, week, history, seen } = useLeagueStore.getState();
  let profile: unknown = {};
  try { profile = JSON.parse(localStorage.getItem(PROFILE_KEY) ?? '{}'); } catch { /* storage blocked */ }
  return { progress: { xp, ledger, streak, lessons, review, bosses, bossDrafts }, league: { tier, week, history, seen }, profile };
}

type Remote = ReturnType<typeof snapshot>;

/** Pull, merge, write locally, push. Returns false if the server couldn't be reached. */
export async function syncNow(supabase: SupabaseClient, userId: string): Promise<boolean> {
  const account = useAccount.getState();
  account.set({ sync: 'syncing' });
  const { data, error } = await supabase.from('learner_state').select('progress, league, profile').eq('user_id', userId).maybeSingle<Remote>();
  if (error) { account.set({ sync: 'error' }); return false; }

  const local = snapshot();
  if (data && !isEmpty(data.progress)) {
    const merged = mergeProgress(local.progress, data.progress as typeof local.progress, today());
    useProgress.setState(merged);
  }
  // League and profile: this browser's copy if it has one (it's the one being used), else the server's.
  if (data && !isEmpty(data.league) && local.progress.ledger.length === 0) useLeagueStore.setState(data.league as Partial<ReturnType<typeof useLeagueStore.getState>>);
  if (data && !isEmpty(data.profile) && isEmpty(local.profile)) {
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(data.profile)); } catch { /* storage blocked */ }
  }
  return push(supabase, userId);
}

async function push(supabase: SupabaseClient, userId: string) {
  const { error } = await supabase.from('learner_state').upsert({ user_id: userId, ...snapshot() });
  useAccount.getState().set(error ? { sync: 'error' } : { sync: 'synced', lastSyncedAt: new Date().toISOString() });
  return !error;
}

/** Pushes after every store change (debounced) until the returned function is called. */
export function watchStores(supabase: SupabaseClient, userId: string) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const schedule = () => {
    clearTimeout(timer);
    useAccount.getState().set({ sync: 'idle' });
    timer = setTimeout(() => void push(supabase, userId), PUSH_DELAY);
  };
  const flush = () => { if (timer) { clearTimeout(timer); void push(supabase, userId); } };
  const off = [useProgress.subscribe(schedule), useLeagueStore.subscribe(schedule)];
  window.addEventListener('pagehide', flush);
  return () => { off.forEach(f => f()); window.removeEventListener('pagehide', flush); clearTimeout(timer); };
}
