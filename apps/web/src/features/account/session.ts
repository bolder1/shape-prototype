'use client';
// Who is signed in, if anyone. Filled by <AccountSync /> from Supabase auth; read anywhere with useAccount().
import { create } from 'zustand';

export type SyncStatus = 'off' | 'idle' | 'syncing' | 'synced' | 'error';
export interface AccountUser { id: string; email: string | null; name: string | null; avatarUrl: string | null }

interface AccountState {
  /** `unconfigured`: no Supabase keys yet, so accounts are off and everything stays in this browser. */
  status: 'unconfigured' | 'loading' | 'signed-out' | 'signed-in';
  user: AccountUser | null;
  sync: SyncStatus;
  lastSyncedAt: string | null;
  set: (p: Partial<Omit<AccountState, 'set'>>) => void;
}

export const useAccount = create<AccountState>()(set => ({
  status: 'loading', user: null, sync: 'off', lastSyncedAt: null,
  set: p => set(p),
}));
