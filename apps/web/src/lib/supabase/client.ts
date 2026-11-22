'use client';
import { createBrowserClient } from '@supabase/ssr';

/** Supabase client for Client Components. Returns null until the project's env vars are set. */
export function getBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return url && key ? createBrowserClient(url, key) : null;
}
