'use client';
import dynamic from 'next/dynamic';

// Reads the profile and progress saved in this browser, so it renders on the client only.
export const ClientOnly = dynamic(() => import('@/features/map/MapScreen'), {
  ssr: false,
  loading: () => <div className="min-h-dvh bg-secondary" aria-busy="true" />,
});
