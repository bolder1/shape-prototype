import 'server-only';
// Loads a public passport by handle and checks every project receipt on the way, so `verified` on the page can only
// come from a review this server signed for this learner. Returns null for an unknown, private or unconfigured passport.
import { passportFrom, type RewardEvent } from '@shape/engine';
import { bossReceiptFields, verifyFields } from '@/lib/share-sign';
import { getServerSupabase } from '@/lib/supabase/server';
import type { PassportData } from './types';

interface Row {
  userId: string; handle: string; name: string; headline: string | null; openToWork: boolean; since: string;
  longestStreak: number; events: RewardEvent[];
}

export async function loadPassport(handle: string): Promise<PassportData | null> {
  const supabase = await getServerSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc('public_passport', { p_handle: handle.toLowerCase() });
  if (error || !data) return null;
  const row = data as Row;
  const events = await Promise.all(row.events.map(async e => {
    if (e.kind !== 'boss_submitted' || !e.ref) return e;
    const { receipt, verified: _claimed, ...rest } = (e.data ?? {}) as Record<string, unknown> & { receipt?: { at?: unknown; sig?: unknown } };
    void _claimed;   // whatever the browser wrote here is ignored
    const ok = !!receipt && typeof receipt.at === 'string' && await verifyFields(
      bossReceiptFields(row.userId, e.ref, String(rest.verdict), Number(rest.percent), receipt.at), receipt.sig);
    return { ...e, data: { ...rest, verified: ok } };
  }));
  return {
    handle: row.handle, name: row.name, headline: row.headline, openToWork: row.openToWork, since: row.since,
    summary: passportFrom(events, row.longestStreak),
  };
}
