import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { domains } from "@shape/engine";
import { Button } from "@/components/base/buttons/button";
import { BadgeWithDot } from "@/components/base/badges/badges";

// Landing page (placeholder). The storytelling hero arrives with the onboarding story (docs/05-onboarding-story.md).
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <BadgeWithDot type="pill-color" color="success" size="md">Early access</BadgeWithDot>
      <h1 className="text-display-lg font-semibold text-primary sm:text-display-xl">Become a complete<br />product designer.</h1>
      <p className="max-w-md text-xl text-tertiary">
        Map your skills across {domains.length} disciplines, see the designer you can become, and follow a path built around you.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {/* Server page → client Button: pass a rendered icon element, not the component function. */}
        <Button size="xl" href="/onboarding" iconTrailing={<ArrowRightIcon data-icon weight="bold" />}>Map my skills</Button>
        <Button size="xl" color="secondary" href="/dev/kit">UI kit</Button>
      </div>
    </main>
  );
}
