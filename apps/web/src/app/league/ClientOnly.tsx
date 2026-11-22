'use client';
import dynamic from 'next/dynamic';

// Reads the progress and league saved in this browser, so it renders on the client only.
export const ClientOnly = dynamic(() => import('@/features/league/LeagueScreen'), {
  ssr: false,
  loading: () => <div className="min-h-dvh bg-secondary" aria-busy="true" />,
});
