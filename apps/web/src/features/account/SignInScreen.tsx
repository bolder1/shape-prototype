'use client';
// Sign in to keep progress across devices (and, later, for leagues, buddy streaks and the Skill Passport).
// Email magic link or Google. Signing in never wipes anything: this browser's progress merges into the account.
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircleIcon, CloudCheckIcon, EnvelopeSimpleIcon, WarningCircleIcon } from '@phosphor-icons/react/ssr';
import { Button } from '@/components/base/buttons/button';
import { SocialButton } from '@/components/base/buttons/social-button';
import { Input } from '@/components/base/input/input';
import { getBrowserSupabase } from '@/lib/supabase/client';
import { AppHeader } from '../app/AppHeader';
import { useAccount } from './session';

const looksLikeEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());

export function SignInScreen() {
  const { status, user, sync, lastSyncedAt } = useAccount();
  const params = useSearchParams();
  const next = params.get('next') ?? '/play';
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(params.get('error') === 'link' ? 'That sign-in link has expired or was already used. Ask for a new one.' : null);

  const redirectTo = () => `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  const sendLink = async () => {
    const supabase = getBrowserSupabase();
    if (!supabase) return;
    if (!looksLikeEmail(email)) { setError('Enter an email address, like asha@example.com.'); return; }
    setBusy(true); setError(null);
    const { error: e } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: redirectTo() } });
    setBusy(false);
    if (e) setError('We couldn’t send the link. Check the address and try again in a minute.');
    else setSent(true);
  };

  const google = async () => {
    const supabase = getBrowserSupabase();
    if (!supabase) return;
    const { error: e } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectTo() } });
    if (e) setError('Google sign-in isn’t available right now. Try the email link instead.');
  };

  const signOut = async () => { await getBrowserSupabase()?.auth.signOut(); };

  return (
    <div className="flex min-h-dvh flex-col bg-secondary">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-10">
        {status === 'unconfigured' && (
          <Panel>
            <Title>Accounts are coming soon</Title>
            <p className="text-md text-tertiary">Your progress is saved in this browser for now. Keep using the same browser and nothing is lost.</p>
            <Button size="lg" href="/play">Back to learning</Button>
          </Panel>
        )}

        {status === 'loading' && <Panel><p className="text-md text-tertiary" aria-busy="true">Checking your account…</p></Panel>}

        {status === 'signed-in' && user && (
          <Panel>
            <CloudCheckIcon className="size-10 text-success-primary" weight="duotone" aria-hidden />
            <Title>You’re signed in</Title>
            <p className="text-md text-tertiary">{user.email ?? user.name}. Your progress is saved to your account and follows you to any device.</p>
            <p className="text-sm text-quaternary" aria-live="polite">
              {sync === 'syncing' ? 'Saving…' : sync === 'error' ? 'Couldn’t reach the server. We’ll keep trying.' : lastSyncedAt ? `Saved ${new Date(lastSyncedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : 'Saved'}
            </p>
            <div className="flex flex-col gap-3">
              <Button size="lg" href={next}>Continue learning</Button>
              <Button size="lg" color="secondary" onClick={signOut}>Sign out</Button>
            </div>
          </Panel>
        )}

        {status === 'signed-out' && !sent && (
          <Panel>
            <Title>Save your progress</Title>
            <p className="text-md text-tertiary">Sign in to keep your XP, streak and grades on every device. Everything you’ve done in this browser comes with you.</p>
            <form className="flex flex-col gap-3" onSubmit={e => { e.preventDefault(); void sendLink(); }}>
              <Input label="Email" type="email" autoComplete="email" placeholder="you@example.com" icon={EnvelopeSimpleIcon} value={email} onChange={setEmail} isRequired hideRequiredIndicator />
              <Button size="lg" type="submit" isLoading={busy}>Email me a sign-in link</Button>
            </form>
            <div className="flex items-center gap-3 text-sm text-quaternary" aria-hidden><span className="h-px flex-1 bg-border-secondary" />or<span className="h-px flex-1 bg-border-secondary" /></div>
            <SocialButton social="google" size="lg" theme="gray" onClick={google}>Continue with Google</SocialButton>
            <p className="text-xs text-quaternary">No password to remember. We only use your email to sign you in.</p>
          </Panel>
        )}

        {status === 'signed-out' && sent && (
          <Panel>
            <CheckCircleIcon className="size-10 text-success-primary" weight="duotone" aria-hidden />
            <Title>Check your inbox</Title>
            <p className="text-md text-tertiary">We sent a sign-in link to <span className="font-semibold text-secondary">{email.trim()}</span>. Open it on this device to carry on where you left off.</p>
            <Button size="lg" color="secondary" onClick={() => setSent(false)}>Use a different email</Button>
          </Panel>
        )}

        {error && (
          <p role="alert" className="flex items-start gap-2 rounded-xl bg-error-primary px-4 py-3 text-sm text-error-primary">
            <WarningCircleIcon className="mt-0.5 size-4 shrink-0" weight="bold" aria-hidden />{error}
          </p>
        )}
      </main>
    </div>
  );
}

const Panel = ({ children }: { children: React.ReactNode }) => (
  <section className="flex flex-col gap-4 rounded-2xl bg-primary p-6 shadow-lg ring-1 ring-secondary ring-inset sm:p-8">{children}</section>
);
const Title = ({ children }: { children: React.ReactNode }) => <h1 className="text-display-xs font-semibold text-primary">{children}</h1>;
