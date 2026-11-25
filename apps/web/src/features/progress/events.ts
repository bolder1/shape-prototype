'use client';
// The event log (table `events`, 0002_accounts.sql): one line per thing a learner does. Badges and quests are rules
// over it (@shape/engine rewards.ts). The whole log lives in this browser; when signed in, new lines upload and lines
// from other devices download. Each line has a client id, so the same event is never stored or counted twice.
import type { SupabaseClient } from '@supabase/supabase-js';

export type EventKind = 'lesson_done' | 'review_done' | 'boss_submitted' | 'grade' | 'share' | 'badge' | 'puzzle' | 'signin';
export interface LearnerEvent { clientId: string; kind: EventKind; ref?: string; data?: Record<string, unknown>; at: string; sent?: boolean }

const LOG_KEY = 'shape.events.v1';
const MAX_EVENTS = 10_000;   // years of learning; oldest dropped past this

let cache: LearnerEvent[] | null = null;
const listeners = new Set<() => void>();

function read(): LearnerEvent[] {
  if (cache) return cache;
  try { cache = JSON.parse(localStorage.getItem(LOG_KEY) ?? '[]') as LearnerEvent[]; } catch { cache = []; }
  return cache;
}
function write(log: LearnerEvent[]) {
  cache = log.slice(-MAX_EVENTS);
  try { localStorage.setItem(LOG_KEY, JSON.stringify(cache)); } catch { /* storage blocked: the in-memory copy still works */ }
  listeners.forEach(f => f());
}

/** The full log, oldest first. Stable between changes (safe for useSyncExternalStore). */
export const getEvents = (): LearnerEvent[] => (typeof window === 'undefined' ? EMPTY : read());
const EMPTY: LearnerEvent[] = [];
/** Called after every change to the log. */
export const onEvent = (f: () => void) => { listeners.add(f); return () => { listeners.delete(f); }; };

const newId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/** Records something the learner did. Safe to call anywhere on the client; never throws. */
export function logEvent(kind: EventKind, ref?: string, data?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  write([...read(), { clientId: newId(), kind, ref, data, at: new Date().toISOString() }]);
}

/** Adds events from elsewhere (another device, a backfill) that this log doesn't have yet. */
export function mergeEvents(incoming: LearnerEvent[]) {
  const log = read();
  const have = new Set(log.map(e => e.clientId));
  const fresh = incoming.filter(e => !have.has(e.clientId));
  if (fresh.length) write([...log, ...fresh].sort((a, b) => a.at.localeCompare(b.at)));
}

/**
 * Learners who played before the log existed: rebuild their lessons, grades and bosses as events, once.
 * Ids are derived from the record, so two devices backfilling the same history don't double-count.
 */
export function backfillEvents(p: {
  lessons: Record<string, { completedAt: string; firstTry: number; total: number }>;
  bosses: Record<string, { attempts: { at: string; verdict: string; percent: number }[] }>;
}) {
  if (typeof window === 'undefined' || read().some(e => e.clientId.startsWith('backfill:'))) return;
  const out: LearnerEvent[] = [];
  for (const [ref, l] of Object.entries(p.lessons)) {
    const percent = l.total ? Math.round((l.firstTry / l.total) * 100) : 0;
    out.push({ clientId: `backfill:lesson:${ref}`, kind: 'lesson_done', ref, at: l.completedAt, data: { backfill: true } });
    out.push({ clientId: `backfill:grade:${ref}`, kind: 'grade', ref, at: l.completedAt, data: { percent, backfill: true } });
  }
  for (const [ref, b] of Object.entries(p.bosses)) {
    for (const t of b.attempts) out.push({ clientId: `backfill:boss:${ref}:${t.at}`, kind: 'boss_submitted', ref, at: t.at, data: { verdict: t.verdict, percent: t.percent, backfill: true } });
  }
  // Mark the backfill as done even for a brand-new learner, so it never runs again.
  out.push({ clientId: 'backfill:done', kind: 'signin', at: new Date(0).toISOString(), data: { backfill: true }, sent: true });
  mergeEvents(out);
}

type Row = { client_id: string; kind: EventKind; ref: string | null; data: Record<string, unknown>; at: string };

/** Uploads unsent events, then downloads any from other devices. */
export async function syncEvents(supabase: SupabaseClient, userId: string) {
  const unsent = read().filter(e => !e.sent);
  if (unsent.length) {
    const rows = unsent.map(e => ({ user_id: userId, client_id: e.clientId, kind: e.kind, ref: e.ref ?? null, data: e.data ?? {}, at: e.at }));
    const { error } = await supabase.from('events').upsert(rows, { onConflict: 'user_id,client_id', ignoreDuplicates: true });
    if (error) return false;
    const sent = new Set(unsent.map(e => e.clientId));
    write(read().map(e => (sent.has(e.clientId) ? { ...e, sent: true } : e)));
  }
  const { data, error } = await supabase.from('events').select('client_id, kind, ref, data, at').eq('user_id', userId).order('at').limit(MAX_EVENTS);
  if (error) return false;
  mergeEvents(((data ?? []) as Row[]).map(r => ({ clientId: r.client_id, kind: r.kind, ref: r.ref ?? undefined, data: r.data, at: r.at, sent: true })));
  return true;
}
