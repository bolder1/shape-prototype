import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SKILL_LEVEL_NAME } from "@shape/engine";
import { loadPassport } from "@/features/passport/load";
import { PrintButton } from "@/features/passport/PrintButton";
import { monthYear, passportPath, siteUrl } from "@/features/passport/types";

// A one-page CV insert: "Product design skills, verified by Shape". The learner prints it to PDF from the browser,
// so there is no PDF library and the text stays selectable (and readable by applicant-tracking systems).
// Always light and plain, in print colours, whatever the site theme.

export const metadata = { title: "CV insert · Skill Passport", robots: { index: false } };

export default function PrintPage({ params }: PageProps<"/u/[handle]/print">) {
  return (
    <Suspense fallback={null}>
      <Insert params={params} />
    </Suspense>
  );
}

async function Insert({ params }: { params: PageProps<"/u/[handle]/print">["params"] }) {
  const { handle } = await params;
  const p = await loadPassport(decodeURIComponent(handle));
  if (!p) notFound();
  const url = `${siteUrl()}${passportPath(p.handle)}`;
  const s = p.summary;
  return (
    <div className="min-h-dvh bg-[#F2F4F7] py-8 text-[#101828] print:bg-white print:py-0">
      <div className="mx-auto mb-4 flex max-w-[210mm] justify-end px-4 print:hidden"><PrintButton /></div>
      <main className="mx-auto max-w-[210mm] bg-white px-[14mm] py-[12mm] shadow-lg print:shadow-none">
        <header className="flex items-baseline justify-between border-b-2 border-[#101828] pb-2">
          <h1 className="text-xl font-bold">Product design skills</h1>
          <p className="text-xs text-[#475467]">Verified by Shape · {url.replace(/^https?:\/\//, '')}</p>
        </header>
        <p className="mt-2 text-sm"><strong>{p.name}</strong>{p.headline ? ` · ${p.headline}` : ''}</p>
        <p className="text-xs text-[#475467]">{s.lessons} lessons · {s.skills.length} skills · learning since {monthYear(p.since)}</p>

        {s.skills.length > 0 && <>
          <h2 className="mt-5 text-xs font-bold tracking-wider text-[#475467] uppercase">Skills</h2>
          <table className="mt-1 w-full text-sm">
            <tbody>
              {s.skills.map(k => (
                <tr key={k.domain} className="border-b border-[#EAECF0]">
                  <td className="py-1.5 pr-3 font-semibold">{k.name}</td>
                  <td className="py-1.5 pr-3">{SKILL_LEVEL_NAME[k.level]}</td>
                  <td className="py-1.5 text-right text-xs text-[#475467]">{k.chaptersDone} of {k.chaptersTotal} chapters{k.verified ? ' · verified project' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>}

        {s.credentials.length > 0 && <>
          <h2 className="mt-5 text-xs font-bold tracking-wider text-[#475467] uppercase">Projects</h2>
          <ul className="mt-1 text-sm">
            {s.credentials.map(c => (
              <li key={c.chapterId} className="flex justify-between gap-4 border-b border-[#EAECF0] py-1.5">
                <span><strong>{c.title}</strong> <span className="text-[#475467]">· {c.skill}</span></span>
                <span className="shrink-0 text-xs text-[#475467]">{c.verdict === 'distinction' ? 'Distinction' : 'Pass'} {c.percent}% · {c.verified ? 'AI-reviewed, verified' : 'self-reviewed'} · {monthYear(c.at)}</span>
              </li>
            ))}
          </ul>
        </>}

        <p className="mt-6 text-[11px] text-[#667085]">
          Shape teaches product design through playable lessons. Each chapter ends in a project scored against a written rubric.
          “Verified” means Shape’s server reviewed the submission and signed the result. Check it at {url}.
        </p>
      </main>
    </div>
  );
}
