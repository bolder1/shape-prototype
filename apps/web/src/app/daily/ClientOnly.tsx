'use client';
import dynamic from 'next/dynamic';

// Today's brief depends on the learner's local date and results saved in this browser, so it renders on the client.
export const ClientOnly = dynamic(() => import('@/features/daily/DailyScreen'), {
  ssr: false,
  loading: () => <div className="min-h-dvh bg-secondary" aria-busy="true" />,
});
