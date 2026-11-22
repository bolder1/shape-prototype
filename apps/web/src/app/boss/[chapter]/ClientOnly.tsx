'use client';
import dynamic from 'next/dynamic';
import { getBoss } from '@shape/content';

// Drafts and results live in this browser, so the screen renders on the client only.
const BossScreen = dynamic(() => import('@/features/boss/BossScreen').then(m => m.BossScreen), {
  ssr: false,
  loading: () => <div className="min-h-dvh bg-secondary" aria-busy="true" />,
});

export function ClientOnly({ chapterId }: { chapterId: string }) {
  return <BossScreen brief={getBoss(chapterId)!} />;
}
