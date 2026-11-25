'use client';
// The event log (table `events`, 0002_accounts.sql): one line per thing a learner does. Badges, quests and analytics
// are rules over it. Events queue in this browser and upload when someone is signed in; each carries a client id,
// so a retried upload is stored once.
import type { SupabaseClient } from '@supabase/supabase-js';

export type EventKind = 'lesson_done' | 'review_done' | 'boss_submitted' | 'grade' | 'share' | 'badge' | 'puzzle' | 'signin';
export interface LearnerEvent { clientId: string; kind: EventKind; ref?: string; data?: Record<string, unknown>; at: string }

const QUEUE_KEY = 'shape.events.v1';
const MAX_QUEUED = 2_000;   // a signed-out learner's backlog; oldest dropped past this

function read(): LearnerEvent[] {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? '[]') as LearnerEvent[]; } catch { return []; }
}
function write(q: LearnerEvent[]) {
  try { localStorage.setItem(QUEUE_KEY, JSON.stringify(q.slice(-MAX_QUEUED))); } catch { /* storage blocked */ }
}

const listeners = new Set<() => void>();
/** Called after every logged event (the uploader listens). */
export const onEvent = (f: () => void) => { listeners.add(f); return () => listeners.delete(f); };

/** Records something the learner did. Safe to call anywhere on the client; never throws. */
export function logEvent(kind: EventKind, ref?: string, data?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  write([...read(), { clientId: id, kind, ref, data, at: new Date().toISOString() }]);
  listeners.forEach(f => f());
}

/** Uploads queued events. Ones the server already has are ignored, so the queue clears either way. */
export async function flushEvents(supabase: SupabaseClient, userId: string) {
  const q = read();
  if (!q.length) return true;
  const rows = q.map(e => ({ user_id: userId, client_id: e.clientId, kind: e.kind, ref: e.ref ?? null, data: e.data ?? {}, at: e.at }));
  const { error } = await supabase.from('events').upsert(rows, { onConflict: 'user_id,client_id', ignoreDuplicates: true });
  if (error) return false;
  const sent = new Set(q.map(e => e.clientId));
  write(read().filter(e => !sent.has(e.clientId)));   // keep anything logged while uploading
  return true;
}
