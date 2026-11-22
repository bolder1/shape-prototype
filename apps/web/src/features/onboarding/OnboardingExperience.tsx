'use client';
import dynamic from 'next/dynamic';

// The flow reads saved progress, WebGL support and motion preferences from the browser on first render,
// so it only ever renders on the client.
export const OnboardingExperience = dynamic(() => import('./Flow'), {
  ssr: false,
  loading: () => <div className="min-h-dvh bg-[#F3F5F9]" aria-busy="true" />,
});
