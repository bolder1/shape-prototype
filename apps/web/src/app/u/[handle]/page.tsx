import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadPassport } from "@/features/passport/load";
import { PassportView } from "@/features/passport/PassportView";

// The public Skill Passport. Reached as /@handle (a rewrite in next.config.ts); private passports are a 404,
// the same as handles nobody holds, so a private one can't be told apart from a free one.

export async function generateMetadata({ params }: PageProps<"/u/[handle]">) {
  const { handle } = await params;
  const p = await loadPassport(decodeURIComponent(handle));
  if (!p) return { title: "Skill Passport" };
  const verified = p.summary.credentials.filter(c => c.verified).length;
  const title = `${p.name} · Skill Passport`;
  const description = p.headline ?? `${p.summary.skills.length} product design skills and ${verified} verified projects on Shape.`;
  return { title, description, openGraph: { title, description, type: "profile" }, twitter: { card: "summary", title, description } };
}

export default function PassportPage({ params }: PageProps<"/u/[handle]">) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-secondary" aria-busy="true" />}>
      <Passport params={params} />
    </Suspense>
  );
}

async function Passport({ params }: { params: PageProps<"/u/[handle]">["params"] }) {
  const { handle } = await params;
  const p = await loadPassport(decodeURIComponent(handle));
  if (!p) notFound();
  return (
    <div className="min-h-dvh bg-secondary">
      <header className="border-b border-secondary bg-primary">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3 md:px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight text-primary">Shape</Link>
          <span className="text-sm text-tertiary">Skill Passport</span>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        <PassportView p={p} />
      </main>
    </div>
  );
}
