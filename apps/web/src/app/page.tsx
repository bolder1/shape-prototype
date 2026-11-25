import Image from 'next/image';
import { CheckIcon, ClockIcon, PlusIcon } from '@phosphor-icons/react/ssr';
import { chapters, domains } from '@shape/engine';
import { BOSSES, EPISODES } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { PLANS } from '@/features/onboarding/content';
import { FAQ, HERO, XP_RULES } from '@/features/marketing/copy';
import { HeroDemo } from '@/features/marketing/HeroDemo';
import { PlayDemo } from '@/features/marketing/PlayDemo';
import { Road } from '@/features/marketing/Road';
import { SiteHeader } from '@/features/marketing/SiteHeader';

// Every number on this page is read from the curriculum and content packages, so it stays true as content grows.
const episodeCount = Object.keys(EPISODES).length;
const bossCount = Object.keys(BOSSES).length;
const gameTitles = [...new Set(Object.values(EPISODES).map(e => e.game.title))];
const [free, ...later] = PLANS;

export default function Home() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary focus:ring-2 focus:ring-brand">Skip to content</a>
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* 1. Hero: the promise on the left, the actual outcome chart on the right. */}
        <section id="top" className="mx-auto grid max-w-7xl scroll-mt-16 items-center gap-12 px-4 pt-12 pb-20 md:px-8 lg:pt-20 lg:pb-28 xl:grid-cols-[1fr_1.15fr]">
          <div>
            <h1 className="text-display-md font-semibold tracking-tight text-balance text-primary sm:text-display-lg xl:text-display-xl">{HERO.headline}</h1>
            <p className="mt-6 max-w-xl text-lg text-pretty text-tertiary sm:text-xl">{HERO.sub}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="xl" href="/onboarding">Map my skills</Button>
              <Button size="xl" color="secondary" href="#play">Play a game first</Button>
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm text-tertiary">
              <ClockIcon className="size-4" aria-hidden /> About 4 minutes. Free during early access.
            </p>
          </div>
          <HeroDemo />
        </section>

        {/* 2. Proof before promises: a real game, playable right here. */}
        <section id="play" className="scroll-mt-16 bg-secondary py-20 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 md:px-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <h2 className="text-display-sm font-semibold tracking-tight text-primary sm:text-display-md">Lessons you play, not lessons you read</h2>
              <p className="mt-4 text-lg text-tertiary">Each episode is 3 to 5 minutes: a short scene, a game, and a check. This one is from <span className="font-semibold text-secondary">Visual hierarchy</span>. Squint, judge, and see why.</p>
              <p className="mt-8 text-sm font-semibold text-secondary">Other games in the first {episodeCount} episodes</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {gameTitles.filter(t => t !== 'Squint test').map(t => (
                  <li key={t} className="rounded-md bg-primary px-2.5 py-1 text-sm text-secondary ring-1 ring-secondary ring-inset">{t}</li>
                ))}
              </ul>
            </div>
            <PlayDemo />
          </div>
        </section>

        {/* 3. How it works: the onboarding road through all four families. */}
        <section id="road" className="mx-auto grid max-w-7xl scroll-mt-16 gap-12 px-4 py-20 md:px-8 lg:grid-cols-2 lg:py-28">
          <div>
            <h2 className="text-display-sm font-semibold tracking-tight text-primary sm:text-display-md">Walk through how a product gets made, and find where you fit</h2>
            <p className="mt-4 text-lg text-tertiary">Onboarding is a short story, not a survey. You travel one road from idea to launch. At each station you meet the {domains.length} skills that do that work, see a real example, and say how much you have done it.</p>
            <p className="mt-4 text-lg text-tertiary">At the end you get your profile today, the designer you are aiming for, and a roadmap that skips what you already know.</p>
            <Button size="lg" className="mt-8" href="/onboarding">Start the road</Button>
          </div>
          <Road />
        </section>

        {/* 4. Two audiences, one model. Asymmetric split, no cards: this is an argument, not a feature list. */}
        <section className="border-y border-secondary">
          <div className="mx-auto grid max-w-7xl md:grid-cols-2">
            <div className="px-4 py-16 md:px-8 md:py-20 md:pr-12">
              <p className="text-sm font-semibold text-mint-700">Becoming a designer</p>
              <h2 className="mt-3 text-display-xs font-semibold text-primary sm:text-display-sm">Go deep in one craft. Speak all of them.</h2>
              <p className="mt-4 text-md text-tertiary">Students, career switchers, UI and UX designers, researchers. Pick the role you want; Shape takes one or two skills to expert and brings the rest up to the level a product team expects.</p>
            </div>
            <div className="border-t border-secondary px-4 py-16 md:border-t-0 md:border-l md:px-8 md:py-20 md:pl-12">
              <p className="text-sm font-semibold text-mint-700">From a neighbouring craft</p>
              <h2 className="mt-3 text-display-xs font-semibold text-primary sm:text-display-sm">Keep your job. Understand the whole product.</h2>
              <p className="mt-4 text-md text-tertiary">Motion designers, front-end engineers, marketers, PMs, sales. Your craft stays your home base. Shape fills in research, flows and strategy so you can hold your own in any product conversation.</p>
            </div>
          </div>
        </section>

        {/* 5. The accent moment: midnight band for the rule that makes this different from streak apps. */}
        <section className="bg-brand-section py-20 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 md:px-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="text-display-sm font-semibold tracking-tight text-primary_on-brand sm:text-display-md">XP for what you can do, not for showing up</h2>
              <p className="mt-4 text-lg text-tertiary_on-brand">Opening a lesson earns nothing. Points come from checks you pass, reviews you keep up with, and boss projects you can fail. So the weekly league measures skill, not who tapped fastest.</p>
              <p className="mt-6 text-lg text-tertiary_on-brand">Each chapter ends with a boss: a 30 to 90 minute brief scored against a weighted rubric. {bossCount} are live today.</p>
            </div>
            <table className="w-full self-center text-left">
              <caption className="sr-only">How XP is earned</caption>
              <thead>
                <tr className="text-sm text-tertiary_on-brand">
                  <th scope="col" className="pb-3 font-medium">You</th>
                  <th scope="col" className="pb-3 text-right font-medium">XP</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-white/10">
                  <td className="py-4 text-md text-tertiary_on-brand">Open a lesson</td>
                  <td className="py-4 text-right text-lg font-semibold text-tertiary_on-brand tabular-nums">0</td>
                </tr>
                {XP_RULES.map(r => (
                  <tr key={r.event} className="border-t border-white/10">
                    <td className="py-4 text-md text-primary_on-brand">{r.event}</td>
                    <td className="py-4 text-right text-lg font-semibold text-mint-300 tabular-nums">{r.xp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 6. Nib: the buddy, using the approved character concept art. */}
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:px-8 lg:grid-cols-[1.3fr_1fr] lg:py-28">
          <Image src="/marketing/nib-expressions.png" alt="Nib, a small midnight-blue creature with a glowing mint pen-nib tip, shown in six expressions: idle, waving, thinking, glowing, unsure, and drawing a mint line"
            width={1536} height={864} sizes="(min-width: 1024px) 55vw, 100vw" className="h-auto w-full rounded-2xl bg-[#F1F3F6]" />
          <div>
            <h2 className="text-display-sm font-semibold tracking-tight text-primary">Meet Nib, who walks the road with you</h2>
            <p className="mt-4 text-lg text-tertiary">Part pen nib, part cursor. Nib explains why each onboarding question matters, cheers when you get it, and sits inside every episode so you can ask about the idea you are stuck on.</p>
            <p className="mt-4 text-lg text-tertiary">Watch the tip: the mint line Nib draws becomes your progress line through the whole app.</p>
          </div>
        </section>

        {/* 7. Pricing: one live plan, so one card. The rest is honest about being later. */}
        <section id="pricing" className="scroll-mt-16 bg-secondary py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <h2 className="max-w-2xl text-display-sm font-semibold tracking-tight text-primary sm:text-display-md">Free while we build it with you</h2>
            <p className="mt-4 max-w-2xl text-lg text-tertiary">Early access is open. Today there are {episodeCount} playable episodes and {bossCount} boss projects, out of a planned map of {chapters.length} chapters.</p>
            <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              <div className="rounded-2xl bg-primary p-6 shadow-md ring-1 ring-secondary sm:p-8">
                <h3 className="text-lg font-semibold text-primary">{free.name}</h3>
                <p className="mt-2 flex items-baseline gap-2"><span className="text-display-lg font-semibold text-primary">{free.price}</span><span className="text-md text-tertiary">{free.per}</span></p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {free.perks.map(p => (
                    <li key={p} className="flex gap-2 text-md text-secondary"><CheckIcon className="mt-1 size-4 shrink-0 text-mint-700" weight="bold" aria-hidden />{p}</li>
                  ))}
                </ul>
                <Button size="xl" href="/onboarding" className="mt-8 w-full sm:w-auto">Map my skills for free</Button>
              </div>
              <div className="flex flex-col gap-4">
                {later.map(plan => (
                  <div key={plan.id} className="rounded-2xl p-6 ring-1 ring-secondary ring-inset">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-md font-semibold text-primary">{plan.name}</h3>
                      <span className="text-sm text-tertiary">Coming soon</span>
                    </div>
                    <ul className="mt-3 flex flex-col gap-2">
                      {plan.perks.map(p => (
                        <li key={p} className="flex gap-2 text-sm text-tertiary"><PlusIcon className="mt-0.5 size-4 shrink-0" aria-hidden />{p}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 8. FAQ: native details/summary, keyboard and screen-reader friendly with no script. */}
        <section id="faq" className="mx-auto grid max-w-7xl scroll-mt-16 gap-10 px-4 py-20 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:py-28">
          <h2 className="text-display-sm font-semibold tracking-tight text-primary">Questions before you start</h2>
          <div className="divide-y divide-secondary border-y border-secondary">
            {FAQ.map(f => (
              <details key={f.q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md py-5 text-lg font-semibold text-primary focus-visible:outline-2 focus-visible:outline-brand [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <PlusIcon className="size-5 shrink-0 text-tertiary transition-transform group-open:rotate-45 motion-reduce:transition-none" aria-hidden />
                </summary>
                <p className="pb-5 text-md text-tertiary">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 9. Close: one ask. */}
        <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8 lg:pb-28">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-brand-section p-8 sm:p-12 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-display-xs font-semibold text-primary_on-brand sm:text-display-sm">See the designer you could be in 4 minutes</h2>
              <p className="mt-2 text-lg text-tertiary_on-brand">No account needed to start.</p>
            </div>
            <Button size="xl" color="secondary" href="/onboarding">Map my skills</Button>
          </div>
        </section>
      </main>
      <footer className="border-t border-secondary">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-tertiary sm:flex-row sm:items-center sm:justify-between md:px-8">
          <p><span className="font-semibold text-primary">Shape</span> · Learn product design by playing it.</p>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <li><a href="#play" className="hover:text-primary focus-visible:outline-2 focus-visible:outline-brand">Try an episode</a></li>
              <li><a href="#pricing" className="hover:text-primary focus-visible:outline-2 focus-visible:outline-brand">Pricing</a></li>
              <li><a href="/onboarding" className="hover:text-primary focus-visible:outline-2 focus-visible:outline-brand">Map my skills</a></li>
            </ul>
          </nav>
        </div>
      </footer>
    </>
  );
}
