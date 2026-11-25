'use client';
// Mounted once in the root layout. Follows Supabase auth and, while someone is signed in, keeps their progress
// and event log in step with the server. Renders nothing.
import { useEffect } from 'react';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { getBrowserSupabase } from '@/lib/supabase/client';
import { flushEvents, logEvent, onEvent } from '../progress/events';
import { useAccount, type AccountUser } from './session';
import { syncNow, watchStores } from './sync';

const toUser = (s: Session): AccountUser => {
  const m = s.user.user_metadata ?? {};
  return { id: s.user.id, email: s.user.email ?? null, name: (m.full_name ?? m.name ?? null) as string | null, avatarUrl: (m.avatar_url ?? null) as string | null };
};

export function AccountSync() {
  useEffect(() => {
    const supabase = getBrowserSupabase();
    const set = useAccount.getState().set;
    if (!supabase) { set({ status: 'unconfigured', sync: 'off' }); return; }

    let stop: (() => void) | null = null;
    let current: string | null = null;

    const start = (sb: SupabaseClient, session: Session) => {
      if (current === session.user.id) return;   // token refreshes fire too; only a new person restarts sync
      stop?.();
      current = session.user.id;
      set({ status: 'signed-in', user: toUser(session) });
      const userId = session.user.id;
      void syncNow(sb, userId).then(() => flushEvents(sb, userId));
      const unwatch = watchStores(sb, userId);
      let t: ReturnType<typeof setTimeout> | undefined;
      const offEvents = onEvent(() => { clearTimeout(t); t = setTimeout(() => void flushEvents(sb, userId), 3_000); });
      stop = () => { unwatch(); offEvents(); clearTimeout(t); };
    };

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        if (event === 'SIGNED_IN' && current !== session.user.id) logEvent('signin');
        start(supabase, session);
      } else {
        stop?.(); stop = null; current = null;
        set({ status: 'signed-out', user: null, sync: 'off' });
      }
    });
    return () => { sub.subscription.unsubscribe(); stop?.(); };
  }, []);
  return null;
}
