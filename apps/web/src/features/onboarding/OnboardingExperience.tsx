'use client';
import dynamic from 'next/dynamic';

// The survey reads its saved draft and motion preference from the browser on first render,
// so it only ever renders on the client.
export const OnboardingExperience = dynamic(() => import('./survey/SurveyFlow'), {
  ssr: false,
  loading: () => <div className="min-h-dvh bg-primary" aria-busy="true" />,
});
