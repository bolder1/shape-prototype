'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FireIcon, HouseIcon, LightningIcon, ListChecksIcon, MapTrifoldIcon, TrophyIcon } from '@phosphor-icons/react/ssr';
import { cx } from '@/utils/cx';
import { doneToday, liveStreak, useProgress } from '../progress/store';
import { SoundToggle } from '@/components/SoundToggle';

const NAV = [
  { href: '/play', label: 'Home', icon: HouseIcon },
  { href: '/syllabus', label: 'Syllabus', icon: ListChecksIcon },
  { href: '/map', label: 'Skill map', icon: MapTrifoldIcon },
  { href: '/league', label: 'League', icon: TrophyIcon },
];

/** Top bar for signed-in app screens: navigation, streak, XP, avatar. Client-only (reads progress). */
export function AppHeader({ name, wide }: { name?: string; wide?: boolean }) {
  const pathname = usePathname();
  const { xp, streak } = useProgress();
  const today = doneToday(streak.lastDay);
  return (
    <header className="sticky top-0 z-20 border-b border-secondary bg-primary/90 backdrop-blur">
      <div className={cx('mx-auto flex items-center gap-2 px-4 py-2.5 md:gap-6 md:px-6', wide ? 'max-w-none' : 'max-w-6xl')}>
        <Link href="/play" className="text-lg font-semibold tracking-tight text-primary">Shape</Link>
        <nav aria-label="Main" className="flex items-center gap-1">
          {NAV.map(n => {
            const active = pathname === n.href;
            return (
              <Link key={n.href} href={n.href} aria-current={active ? 'page' : undefined}
                className={cx('inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold transition',
                  active ? 'bg-secondary text-primary' : 'text-tertiary hover:bg-primary_hover hover:text-secondary')}>
                <n.icon className="size-4" weight={active ? 'fill' : 'regular'} /><span className="hidden sm:inline">{n.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <SoundToggle />
          <span className={cx('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-inset', today ? 'bg-warning-primary text-warning-primary ring-[#FEDF89]' : 'bg-primary text-tertiary ring-secondary')}
            title={today ? 'Today counts toward your streak' : 'Finish a lesson to keep your streak'}>
            <FireIcon className="size-4" weight={today ? 'fill' : 'regular'} />{liveStreak(streak)}<span className="sr-only">day streak</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-50 px-3 py-1 text-sm font-semibold text-mint-700 ring-1 ring-mint-200 ring-inset">
            <LightningIcon className="size-4" weight="fill" />{xp}<span className="sr-only">XP</span>
          </span>
          <span className="grid size-9 place-items-center rounded-full bg-brand-solid text-sm font-semibold text-white" aria-hidden>{(name || 'Y')[0].toUpperCase()}</span>
        </div>
      </div>
    </header>
  );
}
