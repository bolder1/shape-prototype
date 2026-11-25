'use client';
import { useEffect, useState } from 'react';
import { ListIcon, XIcon } from '@phosphor-icons/react/ssr';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';

// Every link points at a section that exists on this page (antislop R-24).
const LINKS = [
  { href: '#play', label: 'Try an episode' },
  { href: '#road', label: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={cx('sticky top-0 z-40 bg-primary transition-shadow duration-200', scrolled && 'shadow-xs ring-1 ring-secondary')}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 md:px-8">
        {/* Wordmark as text until a real logo exists (antislop R-23). */}
        <a href="#top" className="-mx-2 rounded-md px-2 py-2.5 text-lg font-semibold tracking-tight text-primary outline-brand focus-visible:outline-2 focus-visible:outline-offset-4">
          Shape
        </a>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {LINKS.map(l => (
              <li key={l.href}>
                <a href={l.href} className="rounded-md px-3 py-2 text-sm font-semibold text-tertiary transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-brand">{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Button size="sm" href="/onboarding" className="hidden sm:inline-flex">Map my skills</Button>
          <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid size-11 cursor-pointer place-items-center rounded-lg text-secondary hover:bg-primary_hover focus-visible:outline-2 focus-visible:outline-brand lg:hidden">
            {open ? <XIcon className="size-5" aria-hidden /> : <ListIcon className="size-5" aria-hidden />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-secondary bg-primary px-4 pt-2 pb-4 lg:hidden">
          <ul className="flex flex-col">
            {LINKS.map(l => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block rounded-md px-2 py-3 text-md font-semibold text-secondary hover:bg-primary_hover focus-visible:outline-2 focus-visible:outline-brand">{l.label}</a>
              </li>
            ))}
          </ul>
          <Button size="lg" href="/onboarding" className="mt-3 w-full">Map my skills</Button>
        </nav>
      )}
    </header>
  );
}
