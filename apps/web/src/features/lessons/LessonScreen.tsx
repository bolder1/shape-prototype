'use client';
import { useMemo } from 'react';
import { BOSSES, CONTENT, EPISODES, getLesson } from '@shape/content';
import { EpisodePlayer } from '../episode/EpisodePlayer';
import { readProfile } from '../onboarding/storage';
import { chapterById } from '@shape/engine';
import { exerciseKey, useProgress } from '../progress/store';
import { LessonPlayer } from './LessonPlayer';

/** Next lesson: the rest of this chapter, then its project, then the next chapter that has content. */
function nextLessonOf(chapterId: string, n: number) {
  if (getLesson(chapterId, n + 1)) return { href: `/learn/${chapterId}/${n + 1}`, label: 'Next lesson' };
  // Last lesson of the chapter: its project comes next.
  if (BOSSES[chapterId]) return { href: `/boss/${chapterId}`, label: 'Take on the chapter project' };
  const ids = Object.keys(CONTENT);
  const nextChapter = ids[ids.indexOf(chapterId) + 1];
  return nextChapter ? { href: `/learn/${nextChapter}/1`, label: `Start: ${chapterById[nextChapter].title}` } : undefined;
}

export function LessonScreen({ chapterId, n }: { chapterId: string; n: number }) {
  const lesson = getLesson(chapterId, n)!;
  const completeLesson = useProgress(s => s.completeLesson);
  const steps = useMemo(() => lesson.steps.map(ex => ({ key: exerciseKey(lesson.id, ex.id), exercise: ex })), [lesson]);
  const eyebrow = `${chapterById[chapterId].title} · Lesson ${n} of ${CONTENT[chapterId].length}`;
  // Lessons with an episode play the rich format; the rest stay classic until their episode is written.
  const episode = EPISODES[lesson.id];
  if (episode) {
    return <EpisodePlayer key={lesson.id} episode={episode} title={lesson.title} eyebrow={eyebrow} name={readProfile()?.answers.name || 'You'}
      exitHref="/play" next={nextLessonOf(chapterId, n)} onComplete={(results, xp) => completeLesson(lesson.id, results, xp)} />;
  }
  return (
    <LessonPlayer
      key={lesson.id}
      eyebrow={`${chapterById[chapterId].title} · Lesson ${n} of ${CONTENT[chapterId].length}`}
      steps={steps}
      exitHref="/play"
      next={nextLessonOf(chapterId, n)}
      onComplete={results => completeLesson(lesson.id, results)}
    />
  );
}
