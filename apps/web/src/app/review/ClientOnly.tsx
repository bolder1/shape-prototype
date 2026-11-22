'use client';
import dynamic from 'next/dynamic';

// Reads progress saved in this browser, so it renders on the client only.
export const ClientOnly = dynamic(() => import('@/features/lessons/ReviewScreen'), {
  ssr: false,
  loading: () => <div className="min-h-dvh bg-primary" aria-busy="true" />,
});
