'use client';
import dynamic from 'next/dynamic';

// Reads and writes the profile saved in this browser, so it renders on the client only.
export const ClientOnly = dynamic(() => import('@/features/syllabus/SyllabusScreen'), {
  ssr: false,
  loading: () => <div className="min-h-dvh bg-secondary" aria-busy="true" />,
});
