'use client';
import dynamic from 'next/dynamic';

// Reads the saved profile and measures the screen, so it renders on the client only.
export const ClientOnly = dynamic(() => import('@/features/map/journey/JourneyScreen'), {
  ssr: false,
  loading: () => <div className="min-h-dvh bg-secondary" aria-busy="true" />,
});
