import { buildPath } from "@shape/engine";
import { OutcomeSummary } from "@/components/outcome/OutcomeSummary";
import { SkillOutcome } from "@/components/outcome/SkillOutcome";
import { FAMILIES, FAMILY_ORDER, SKILL_META, skillsInFamily } from "@/lib/skills";
import { KitInteractive } from "./KitInteractive";

export const metadata = { title: "UI kit" };

// The real engine, run on the server: a motion designer who wants to understand the whole product.
const sample = buildPath({ goal: "product-literate", weeklyHours: 3, spine: ["pr"], selfRating: { pr: 4, ui: 3, br: 2, fd: 1 } });

const SWATCHES = [
  { name: "Midnight", note: "Chrome, primary actions", cls: "bg-brand-600" },
  { name: "Midnight 50", note: "Selected surfaces", cls: "bg-brand-50" },
  { name: "Mint", note: "Progress and rewards only", cls: "bg-mint-500" },
  { name: "Mint 600", note: "Bars and marks", cls: "bg-mint-600" },
  { name: "Gray", note: "Text and borders", cls: "bg-gray-500" },
  { name: "Surface", note: "Page and cards", cls: "bg-primary ring-1 ring-secondary ring-inset" },
];

const card = "rounded-xl bg-primary shadow-xs ring-1 ring-secondary ring-inset";

export default function KitPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-12 sm:px-6">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-brand-secondary">Internal</p>
        <h1 className="text-display-sm font-semibold text-primary">UI kit</h1>
        <p className="max-w-2xl text-lg text-tertiary">
          Built on Untitled UI (React Aria + Tailwind), icons from Phosphor. Midnight carries the interface; mint marks progress; four colours group the 14 skills.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-primary">Colour</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {SWATCHES.map(s => (
            <div key={s.name} className={`${card} overflow-hidden`}>
              <div className={`h-16 ${s.cls}`} />
              <div className="p-3"><p className="text-sm font-semibold text-primary">{s.name}</p><p className="text-xs text-tertiary">{s.note}</p></div>
            </div>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FAMILY_ORDER.map(f => (
            <div key={f} className={`${card} p-5`}>
              <p className="flex items-center gap-2 text-md font-semibold text-primary"><i className="size-2.5 rounded-full" style={{ background: FAMILIES[f].color }} />{FAMILIES[f].label}</p>
              <p className="mt-1 text-sm text-tertiary">{FAMILIES[f].blurb}</p>
              <ul className="mt-4 flex flex-col gap-2">
                {skillsInFamily(f).map(id => { const { icon: Icon, short } = SKILL_META[id]; return (
                  <li key={id} className="flex items-center gap-2 text-sm text-secondary"><Icon className="size-4.5" style={{ color: FAMILIES[f].color }} weight="duotone" />{short}</li>
                ); })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-primary">Type (Inter, Untitled UI scale)</h2>
        <div className={`${card} flex flex-col gap-2 p-6`}>
          <p className="text-display-md font-semibold text-primary">Become a complete designer</p>
          <p className="text-display-xs font-semibold text-primary">Your skill profile</p>
          <p className="max-w-prose text-md text-tertiary">Body text in Inter. Lines stay under about 70 characters, so longer explanations are easy to read.</p>
        </div>
      </section>

      <KitInteractive />

      <section className="flex flex-col gap-4 border-t border-secondary pt-12">
        <div>
          <h2 className="text-lg font-semibold text-primary">Outcome</h2>
          <p className="text-sm text-tertiary">Engine output for a motion designer who wants to understand the whole product.</p>
        </div>
        <div className={`${card} flex flex-col gap-8 p-6`}>
          <OutcomeSummary result={sample} role="Product-minded motion designer" />
          <SkillOutcome result={sample} />
        </div>
      </section>
    </main>
  );
}
