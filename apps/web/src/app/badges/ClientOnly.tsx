'use client';
import dynamic from 'next/dynamic';

// Badges are worked out from progress saved in this browser, so the page renders on the client.
export const ClientOnly = dynamic(() => import('@/features/rewards/BadgesScreen'), {
  ssr: false,
  loading: () => <div className="min-h-dvh bg-secondary" aria-busy="true" />,
});
