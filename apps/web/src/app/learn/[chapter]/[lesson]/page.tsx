import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CONTENT, getLesson } from "@shape/content";
import { LessonScreen } from "@/features/lessons/LessonScreen";

// Every lesson with content is prerendered.
export function generateStaticParams() {
  return Object.entries(CONTENT).flatMap(([chapter, lessons]) => lessons.map((_, i) => ({ chapter, lesson: String(i + 1) })));
}

export async function generateMetadata({ params }: PageProps<"/learn/[chapter]/[lesson]">) {
  const { chapter, lesson } = await params;
  return { title: getLesson(decodeURIComponent(chapter), Number(lesson))?.title ?? "Lesson" };
}

// URL data (params) is read inside Suspense, so navigation to a lesson shows its shell instantly (Next 16 Partial Prefetching).
export default function LessonPage({ params }: PageProps<"/learn/[chapter]/[lesson]">) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-primary" aria-busy="true" />}>
      <Lesson params={params} />
    </Suspense>
  );
}

async function Lesson({ params }: { params: PageProps<"/learn/[chapter]/[lesson]">["params"] }) {
  const { chapter: raw, lesson } = await params;
  const chapter = decodeURIComponent(raw);
  if (!getLesson(chapter, Number(lesson))) notFound();
  return <LessonScreen chapterId={chapter} n={Number(lesson)} />;
}
