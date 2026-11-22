'use client';
import { useState } from 'react';
import { CheckCircleIcon } from '@phosphor-icons/react/ssr';
import { findExercise } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { dueReviews, parseExerciseKey, useProgress } from '../progress/store';
import { LessonPlayer, type PlayerStep } from './LessonPlayer';

const MAX = 10;

/** Client-only (reads persisted progress). Replays due exercises; right answers push them further out. */
export default function ReviewScreen() {
  const review = useProgress(s => s.review);
  const completeReview = useProgress(s => s.completeReview);
  // Freeze the session at start, so finishing doesn't reshuffle what's on screen.
  const [steps] = useState<PlayerStep[]>(() => dueReviews(review).slice(0, MAX).flatMap(r => {
    const { lessonId, exerciseId } = parseExerciseKey(r.exerciseKey);
    const ex = findExercise(lessonId, exerciseId);
    return ex ? [{ key: r.exerciseKey, exercise: ex }] : [];
  }));

  if (!steps.length) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-primary px-4 text-center">
        <CheckCircleIcon className="size-12 text-mint-600" weight="fill" />
        <h1 className="text-display-xs font-semibold text-primary">Nothing to review right now</h1>
        <p className="max-w-sm text-md text-tertiary">Questions you miss in lessons come back here on a growing schedule: tomorrow, then in 3 days, then about a week.</p>
        <Button size="lg" href="/play">Back home</Button>
      </main>
    );
  }
  return <LessonPlayer eyebrow={`Review · ${steps.length} ${steps.length === 1 ? 'question' : 'questions'}`} steps={steps} exitHref="/play" doneTitle="Review complete" onComplete={completeReview} />;
}
