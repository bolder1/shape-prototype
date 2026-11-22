import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BOSSES, getBoss } from "@shape/content";
import { ClientOnly } from "./ClientOnly";

export function generateStaticParams() {
  return Object.keys(BOSSES).map(chapter => ({ chapter }));
}

export async function generateMetadata({ params }: PageProps<"/boss/[chapter]">) {
  const { chapter } = await params;
  return { title: getBoss(decodeURIComponent(chapter))?.title ?? "Chapter project" };
}

// A chapter's boss project: brief → work → review → result.
export default function BossPage({ params }: PageProps<"/boss/[chapter]">) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-secondary" aria-busy="true" />}>
      <Boss params={params} />
    </Suspense>
  );
}

async function Boss({ params }: { params: PageProps<"/boss/[chapter]">["params"] }) {
  const { chapter } = await params;
  const id = decodeURIComponent(chapter);
  if (!getBoss(id)) notFound();
  return <ClientOnly chapterId={id} />;
}
