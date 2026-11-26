'use client';
// The owner's side of the Skill Passport: a live preview from this browser's event log, and (signed in) the settings
// that publish it at /@handle. Private until the learner flips "Public" on (decision 4 in docs/08-engagement-plan.md).
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowSquareOutIcon, CheckIcon, CopyIcon, GlobeIcon, LinkedinLogoIcon, LockSimpleIcon, PrinterIcon } from '@phosphor-icons/react/ssr';
import { handleProblem, passportFrom, type PassportCredential } from '@shape/engine';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { Toggle } from '@/components/base/toggle/toggle';
import { getBrowserSupabase } from '@/lib/supabase/client';
import { AppHeader } from '../app/AppHeader';
import { useAccount } from '../account/session';
import { readProfile } from '../onboarding/storage';
import { getEvents, onEvent } from '../progress/events';
import { useProgress } from '../progress/store';
import { PassportView } from './PassportView';
import { linkedInCertUrl, passportPath, siteUrl, type PassportData } from './types';

interface Settings { handle: string; display_name: string; headline: string; is_public: boolean; open_to_work: boolean; created_at?: string }
const EMPTY: Settings = { handle: '', display_name: '', headline: '', is_public: false, open_to_work: false };

/** A starting handle from the learner's name: "Maya K." → "maya-k". */
const suggestHandle = (name: string) => name.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 24);

export default function PassportScreen() {
  const { status, user } = useAccount();
  const profileName = readProfile()?.answers.name ?? '';
  const events = useSyncExternalStore(onEvent, getEvents, getEvents);
  const longest = useProgress(s => s.streak.longest);

  const [saved, setSaved] = useState<Settings | null>(null);   // what the server has (null: nothing yet)
  const [form, setForm] = useState<Settings>({ ...EMPTY, display_name: profileName, handle: suggestHandle(profileName) });
  const [loaded, setLoaded] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load the learner's passport settings once they're signed in.
  useEffect(() => {
    const supabase = getBrowserSupabase();
    if (status !== 'signed-in' || !user || !supabase) return;
    let live = true;
    supabase.from('passports').select('handle, display_name, headline, is_public, open_to_work, created_at').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => {
        if (!live) return;
        if (data) { const s = { ...EMPTY, ...data, display_name: data.display_name ?? '', headline: data.headline ?? '' }; setSaved(s); setForm(s); }
        setLoaded(true);
      });
    return () => { live = false; };
  }, [status, user]);

  // The preview: this browser's events. A project with a review receipt shows as verified here; the public page
  // re-checks every receipt on the server before it says so.
  const preview: PassportData = useMemo(() => ({
    handle: form.handle || 'you', name: form.display_name || profileName || 'You', headline: form.headline || null,
    openToWork: form.open_to_work, since: saved?.created_at ?? new Date().toISOString(),
    summary: passportFrom(events.map(e => e.kind === 'boss_submitted' ? { ...e, data: { ...e.data, verified: !!e.data?.receipt } } : e), longest),
  }), [events, longest, form, profileName, saved?.created_at]);

  const set = (p: Partial<Settings>) => { setForm(f => ({ ...f, ...p })); setProblem(null); };
  const dirty = JSON.stringify(form) !== JSON.stringify(saved ?? { ...EMPTY, display_name: profileName, handle: suggestHandle(profileName) });
  const url = saved ? `${siteUrl()}${passportPath(saved.handle)}` : '';

  const save = async () => {
    const supabase = getBrowserSupabase();
    if (!supabase || !user) return;
    const h = form.handle.trim().toLowerCase();
    const bad = handleProblem(h);
    if (bad) return setProblem(bad);
    setSaving(true);
    const { data: free } = await supabase.rpc('handle_available', { p_handle: h });
    if (free === false) { setSaving(false); return setProblem('Someone already has that handle.'); }
    const row = { user_id: user.id, handle: h, display_name: form.display_name.trim() || null, headline: form.headline.trim() || null, is_public: form.is_public, open_to_work: form.open_to_work };
    const { data, error } = await supabase.from('passports').upsert(row).select('handle, display_name, headline, is_public, open_to_work, created_at').single();
    setSaving(false);
    if (error) return setProblem(error.code === '23505' ? 'Someone already has that handle.' : 'Couldn’t save. Try again in a moment.');
    const s = { ...EMPTY, ...data, display_name: data.display_name ?? '', headline: data.headline ?? '' };
    setSaved(s); setForm(s);
  };

  const copy = async () => { try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard blocked */ } };

  const linkedIn = (c: PassportCredential) => saved?.is_public && c.verified ? (
    <a href={linkedInCertUrl(c, saved.handle)} target="_blank" rel="noopener noreferrer"
      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-secondary hover:underline">
      <LinkedinLogoIcon className="size-4" weight="fill" />Add to LinkedIn<ArrowSquareOutIcon className="size-3.5" />
    </a>
  ) : null;

  return (
    <div className="min-h-dvh bg-secondary">
      <AppHeader name={profileName} />
      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:px-6 lg:grid-cols-[1fr_22rem]">
        <div className="min-w-0">
          <p className="mb-4 text-sm font-semibold text-brand-secondary">Your Skill Passport · preview</p>
          <PassportView p={preview} actions={linkedIn} preview />
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
          {status === 'signed-in' ? (
            <section className="flex flex-col gap-4 rounded-2xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset" aria-busy={!loaded}>
              <h2 className="text-md font-semibold text-primary">Publish</h2>
              <Input label="Handle" value={form.handle} onChange={v => set({ handle: v.toLowerCase() })} isInvalid={!!problem}
                hint={problem ?? `Your page: ${siteUrl().replace(/^https?:\/\//, '')}/@${form.handle || 'handle'}`} />
              <Input label="Name on the passport" value={form.display_name} onChange={v => set({ display_name: v })} maxLength={60} />
              <Input label="Headline" placeholder="Visual designer moving into product" value={form.headline} onChange={v => set({ headline: v })} maxLength={120} />
              <Toggle size="sm" label="Open to work" hint="Shows a badge next to your name" isSelected={form.open_to_work} onChange={v => set({ open_to_work: v })} />
              <Toggle size="sm" label="Public" hint="Off: only you can see it. On: anyone with the link." isSelected={form.is_public} onChange={v => set({ is_public: v })} />
              <Button size="md" onPress={save} isDisabled={!dirty || saving}>{saving ? 'Saving…' : saved ? 'Save changes' : 'Create my passport'}</Button>
            </section>
          ) : (
            <section className="flex flex-col gap-3 rounded-2xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset">
              <LockSimpleIcon className="size-6 text-fg-quaternary" weight="duotone" />
              <h2 className="text-md font-semibold text-primary">Only you can see this</h2>
              <p className="text-sm text-tertiary">
                {status === 'unconfigured'
                  ? 'Accounts aren’t set up on this copy of Shape yet. Once they are, sign in to publish your passport at its own link.'
                  : 'Sign in to publish it at your own link, add projects to LinkedIn and print a CV insert. It stays private until you switch it on.'}
              </p>
              {status !== 'unconfigured' && <Button size="md" href="/signin?next=/passport">Sign in</Button>}
            </section>
          )}

          {saved && (
            <section className="flex flex-col gap-3 rounded-2xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset">
              <h2 className="flex items-center gap-2 text-md font-semibold text-primary">
                {saved.is_public ? <GlobeIcon className="size-5 text-brand-secondary" weight="duotone" /> : <LockSimpleIcon className="size-5 text-fg-quaternary" weight="duotone" />}
                {saved.is_public ? 'Live' : 'Private'}
              </h2>
              {saved.is_public ? <>
                <p className="truncate text-sm text-secondary">{url}</p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" color="secondary" iconLeading={copied ? CheckIcon : CopyIcon} onPress={copy}>{copied ? 'Copied' : 'Copy link'}</Button>
                  <Button size="sm" color="secondary" iconLeading={ArrowSquareOutIcon} href={passportPath(saved.handle)}>Open</Button>
                  <Button size="sm" color="secondary" iconLeading={PrinterIcon} href={`${passportPath(saved.handle)}/print`}>CV insert</Button>
                </div>
                <p className="text-xs text-quaternary">Verified projects get an “Add to LinkedIn” link in the preview. LinkedIn opens with the form filled in; you check it and save.</p>
              </> : <p className="text-sm text-tertiary">Turn on Public and save to get your link, the LinkedIn buttons and the CV insert.</p>}
            </section>
          )}
          <Link href="/play" className="text-sm font-semibold text-brand-secondary hover:text-brand-secondary_hover">← Back to dashboard</Link>
        </aside>
      </main>
    </div>
  );
}
