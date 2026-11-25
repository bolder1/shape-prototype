import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SealCheckIcon } from "@phosphor-icons/react/ssr";
import { decodeShare } from "@/lib/share";
import { verifyCode } from "@/lib/share-sign";
import { gradeByLetter } from "@/features/episode/grades";

// The public page behind a shared grade card. Its link preview is the card itself (1200×630),
// and it invites whoever opens it to try the same episode.

export async function generateMetadata({ params }: PageProps<"/s/[code]">) {
  const { code } = await params;
  const d = decodeShare(code);
  if (!d) return { title: "Grade card" };
  const title = `${d.n} scored ${d.g} on “${d.title}”`;
  const description = `${gradeByLetter(d.g).label}: ${d.p}% mastery. Learn product design by playing it on Shape.`;
  const image = { url: `/api/card/${code}?format=og`, width: 1200, height: 630, alt: `Grade ${d.g} card for ${d.title}` };
  return {
    title,
    description,
    openGraph: { title, description, images: [image], type: "website" },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

export default function SharePage({ params }: PageProps<"/s/[code]">) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-brand-950" aria-busy="true" />}>
      <Shared params={params} />
    </Suspense>
  );
}

async function Shared({ params }: { params: PageProps<"/s/[code]">["params"] }) {
  const { code } = await params;
  const d = decodeShare(code);
  if (!d) notFound();
  const g = gradeByLetter(d.g);
  const verified = await verifyCode(code);
  return (
    <main className="relative flex min-h-dvh flex-col items-center overflow-hidden bg-brand-950 px-4 py-10 text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(50% 40% at 50% 20%, ${g.colors[0]}55, transparent 70%), radial-gradient(40% 40% at 80% 90%, ${g.colors[1]}44, transparent 70%)` }} />
      <div className="relative flex w-full max-w-md flex-col items-center gap-6 text-center">
        <p className="text-sm font-semibold tracking-wide text-mint-300 uppercase">Shape · Grade card</p>
        <h1 className="text-display-xs font-bold md:text-display-sm">{d.n} scored {d.g} on “{d.title}”</h1>
        {verified && (
          <p className="inline-flex items-center gap-1.5 rounded-full bg-mint-500/15 px-3 py-1 text-sm font-semibold text-mint-200 ring-1 ring-mint-400/40">
            <SealCheckIcon className="size-4" weight="fill" aria-hidden />Verified by Shape
          </p>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element -- a generated PNG from our own route, sized by its container */}
        <img src={`/api/card/${code}`} alt={`Grade ${d.g} (${g.label}), ${d.p}% mastery on ${d.title}. ${d.r} of ${d.t} right, ${d.x} XP, ${d.s}-day streak.`}
          width={1080} height={1350} className="h-auto w-full rounded-3xl shadow-2xl ring-1 ring-white/15" />
        <p className="text-md text-white/75">Every lesson on Shape is a playable episode: an animated story, a game, a quiz-show finale and a grade to earn.</p>
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <Link href={d.href} className="flex-1 rounded-2xl bg-mint-500 px-6 py-4 text-lg font-bold text-brand-950 shadow-lg transition hover:bg-mint-400">Try this episode</Link>
          <Link href="/onboarding" className="flex-1 rounded-2xl bg-white/10 px-6 py-4 text-lg font-bold text-white ring-1 ring-white/20 transition hover:bg-white/15">Map my skills</Link>
        </div>
      </div>
    </main>
  );
}
