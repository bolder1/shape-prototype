'use client';
import dynamic from 'next/dynamic';

// The preview is built from progress saved in this browser, so the page renders on the client.
export const ClientOnly = dynamic(() => import('@/features/passport/PassportScreen'), {
  ssr: false,
  loading: () => <div className="min-h-dvh bg-secondary" aria-busy="true" />,
});
