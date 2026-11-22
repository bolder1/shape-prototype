# Shape — a playable school for end-to-end designers

> Working name. You learn design by **playing it, seeing it, and shipping it**. Each learner gets their own **T-shape**, and that T-shape produces their own syllabus.

---

## 1. What we learned from the reference

The reference ([system-design-learning-hub](https://system-design-learning-hub.vercel.app/topics/high-level-design)) is a static topic wiki: about 17 topics in 7 groups, each page a static SVG plus bullet lists, and "continue learning" links at the bottom.

| Reference does | We do instead |
|---|---|
| Same order of topics for everyone | A **personal T-shape → personal path** |
| Read-only bullet summaries | Every lesson is a **playable interaction** (drag, fix, choose, critique) |
| No self-assessment | Checks in every lesson, **spaced review**, boss assignments |
| No progress tracking | XP for mastery, streaks, a skill graph that "lights up", leagues |
| Static diagram | Animated, interactive visuals are the main content, not decoration |
| Learning ends at the page | Learning ends in a **real product** you build in the Studio |

## 2. Principles (your list, made testable)

| Principle | How we test it in a design review |
|---|---|
| **Challenging** | Every chapter ends with a boss you can fail. Difficulty adapts to roughly 80% success. |
| **Approachable** | First playable moment within 10 seconds of opening a lesson. No lesson over 5 min. |
| **Playful** | At least one hands-on interaction per screen of reading. Every tap, drag and answer gets a physical, animated response. It should feel like a playground, not a course. |
| **Visual** | Each concept has a canonical animated visual. If it can't be shown, we cut it or rethink it. |
| **Readable** | 60–75 characters per line, at most 3 sentences per card, a glossary on hover. |
| **Measurable growth** | The T-shape redraws itself as you level up. Growth is literally visible. |

Research caveat we design against: Duolingo-style XP **for completion** drives speed-running and hurts learning ([dev.to analysis](https://dev.to/pocket_linguist/why-duolingos-gamification-works-and-when-it-doesnt-1d4), [arXiv case study](https://arxiv.org/pdf/2203.16175)). Our rule: **XP is earned for demonstrated skill** (passed checks, reviews done on time, peer-approved work, shipped projects), not for opening lessons.

## 3. Who it's for

Two audiences, one T-shape model:

| Audience | Examples | What they want | Default goal |
|---|---|---|---|
| **Becoming a designer** | Students, career switchers, UI/UX/product designers, researchers | Find or deepen a spine, build the bar | `I → T`, `T`, `π`, `Full-stack` |
| **From a neighbouring craft** | Graphic designers, motion designers, front-end engineers, marketers, brand/creative, sales & CS, PMs | Understand *the whole product* (how research, flows, UI, strategy and growth fit together) **without changing careers** | `Product-literate` |

For the second group, **their craft is their spine** (motion → Prototyping & Motion, front-end → Design Engineering & AI, sales → Business, PM → Strategy, …). The `product-literate` goal brings the **core product loop** (Foundations, Research, IA & Interaction, Strategy) to Practitioner, puts everything else at Literacy, and doesn't push their own craft to Expert. Later, **role lenses** can reskin the same chapter with examples from the learner's craft: a motion designer sees onboarding examples built from transitions, an engineer sees them as component states.

## 4. The T-shape model

```
   ◄──────────── BAR (breadth: literacy across all 14 domains) ────────────►
   ┌──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┐
   │F │RS│IA│UI│DS│PR│CW│AX│ST│GR│BR│BZ│DC│LD│
   └──┴──┴──┴─╥┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┘
              ║  ◄── STEM (depth: 1–2 spine domains to expert)
              ║
              ║
```

- **14 domains** (see `docs/02-syllabus.md`). Each has three **tiers**:
  - `bar` (Literacy): what every product designer must speak fluently
  - `stem` (Practitioner): can do it unsupervised on a real product
  - `deep` (Expert): can teach it, set the standard, invent new methods
- A learner's T-shape is a vector of **current level 0–5 per domain** plus a **target level** per domain.
  - **Spine** domain(s): target 5
  - **Adjacent** domains (graph neighbours of the spine): target 3
  - Everything else: target 2 (the bar)
- **Shapes we support** (chosen in onboarding, changeable later):
  - `I → T`: specialist who wants breadth (the most common case)
  - `T`: start from scratch, find a spine, then build the bar
  - `π` (pi): two spines (e.g. UI + Growth)
  - `Full-stack`: raise the whole bar to 3 and keep one spine at 5
  - `Product-literate`: keep your own craft as the spine; core product loop to 3, the rest to 2

## 4. Onboarding → "Find your T" (the hero moment)

About 3–4 minutes. Prototype: `prototype/onboarding/` (run `node scripts/serve.mjs`). All copy is in `content.mjs`.

**Layout:** a chat with **Tee** (the mascot, a T with eyes) in the centre, like an AI assistant. Questions arrive as messages with tappable answer cards, and typing also works. A **3D T** panel that you can hide sits on the right (a strip on top on phones). Later the same chat becomes Tee, the AI coach.

1. **Name** (typed, optional).
2. **The dream:** *"Who do you want to become?"* (Product designer, UI, researcher, motion, brand, growth, design engineer, leader, *better at my own job*, *not sure yet*). This sets the goal and the deep skill.
3. **Today:** *"What do you do right now?"* (designers *and* neighbouring crafts).
4. **What sounds fun?** Only asked when "not sure yet".
5. **Learn the T** in two messages, then **14 skill questions**. Each one *explains the skill in plain words with an example*, then asks *Never tried / I've read about it / I do it at work / I could teach it*. Every answer stacks 3D blocks under that skill.
6. **Bonus round (quiz show):** three timed questions on the learner's strongest skills, with *Lock it in*, a suspense reveal, the reasoning and +XP. Results calibrate self-ratings.
7. **Pace:** Casual / Regular / Serious / Intense (minutes a day).
8. **"Creating your personality…"**: a slot-reel of archetypes that settles on theirs, with a checklist.
9. **Character card (today):** a tilting 3D card with rarity, level, top 5 skills, and *Share*.
10. **Power-up:** the card charges, flashes and transforms into **Future you**: the aspiration title, Legendary, holographic border, stats at goal level.
11. **Roadmap:** Today → *Find your feet* → *Build your bar* → *Go deep* → *Final form* → Future you, revealed as you scroll.
12. **Choose your start:** *Follow my path* or *Start from zero*.
13. **Pricing:** Free (live) · Pro and Teams (coming soon). Everything is free during early access.
14. **Dashboard:** the T rebuilds with goal outlines, Tee welcomes you, plus streak, XP, league, *Up next* and *Coming up*. Tap a column to change your focus.

## 5. Core experience surfaces

| Surface | What it is |
|---|---|
| **Skill Graph (Map)** | A force-directed constellation of every chapter. Edges are prerequisites and "pairs well with". Your path is a glowing route. Nodes fill as you master them. Pan, zoom, and tap to preview. |
| **Lesson Player** | 3–5 minute bite. Mechanics: drag-to-arrange, spot-the-flaw, A/B pick + justify, slider tuning (contrast, spacing, type scale), card sort, flow builder, rewrite-the-copy, estimate-the-metric. |
| **Boss Assignment** | Chapter-end brief, 30–90 min, judged by rubric (auto checks + AI critique + peer review). |
| **Review Deck** | Spaced-repetition of weak concepts (an SM-2-style scheduler on every individual concept). Keeps streaks honest. |
| **Studio** | A persistent real product the learner builds across the whole curriculum (pick a brief or bring your own). Each domain adds a layer: research → IA → UI → system → launch → growth → brand → sales deck. It ends as a portfolio case study. |
| **Arena** | Weekly leagues (XP from mastery only), design duels (same brief, 20 min, community votes), team jams. |
| **Growth Profile** | T-shape over time (animated replay), skill radar, streak, badges, portfolio export. |

## 6. Learning loop

```
learn (lesson) → check (micro-quiz) → apply (boss) → ship (Studio layer)
      ▲                                                     │
      └──── review (spaced) ◄──── critique (peer + AI) ◄────┘
```

## 7. XP & progression rules (draft)

| Event | XP |
|---|---|
| Pass lesson check on first try | 10 |
| Pass after retry | 5 |
| Review card answered correctly when due | 3 |
| Boss assignment passed (rubric ≥ 70%) | 50 |
| Boss assignment "distinction" (≥ 90%) | +25 |
| Give a peer review rated helpful | 15 |
| Ship a Studio layer | 100 |

- Domain level is calculated from **mastered chapters**, not XP. Level 2 = all `bar` chapters passed. Level 3 = all `stem` chapters passed. Level 4–5 = `deep` chapters plus Studio evidence.
- Streak counts a day only when a check is passed or a due review is done.

## 8. Visual language: a playful playground

> Status: **direction set, design to be planned with the product.** The first onboarding prototype (`prototype/onboarding.html`) used a dark, editorial, minimal look and was **rejected as AI-generic**. Treat that file as a working proof of the engine and flow only, not as the visual reference.

Target feel: **Duolingo-level playfulness and juice, with better-crafted visuals.** A place you *want* to poke at.

- **Colour:** bright, confident, light-first. Each domain gets a vivid colour you can recognise instantly. No dark-mode-by-default, no muted "premium" palettes.
- **Your T is a toy.** It's built from chunky blocks that stack, wobble, squash and pop into place as you rate yourself and level up. You can grab and play with it.
- **Character:** a character or mascot system (to explore), possibly one per domain, that reacts to progress, mistakes and streaks.
- **Motion:** springy, physics-based, with overshoot and settle. Every input gets feedback (press-down states, haptics on mobile, sound, toggleable).
- **Rewards:** celebrations for passed checks, bosses, level-ups and streaks. Confetti is the floor, not the ceiling: the T itself should celebrate.
- **Illustration:** characterful and hand-crafted, built from the same shapes learners use in lessons, so the visuals still double as design material.
- **Avoid:** thin hairlines, serif-plus-gold "luxury", calm editorial layouts, generic gradients and glows. Those read as the default AI look.

## 9. Curated resource library (per domain, linked from chapters)

Starter list from research. Verify before launch.

- Research & usability: Nielsen Norman Group articles + "UX in 60 seconds" videos
- Principles: Laws of UX (lawsofux.com)
- Accessibility: The A11y Project checklist, WCAG 2.2 quick reference
- Design thinking: Stanford d.school guides
- Articles: Smashing Magazine, UX Collective
- Video: DesignCourse, AJ&Smart (design sprints), Figma official channel
- Practice & mentorship: Figma Community, ADPList, Uxcel
- Competency frameworks used to shape levels: [Semrush matrix](https://careers.semrush.com/blog/enter-the-matrix/), [Vend growth plan](https://medium.com/we-build-vend/a-growth-plan-for-designers-21c8f287e63a), [skills-matrix levels](https://mikeofmagnesia.github.io/career-framework/skills-matrix.html)

## 10. Repo map

| Path | Purpose |
|---|---|
| `curriculum/curriculum.mjs` | **Single source of truth**: domains, chapters, lessons, bosses, prerequisite edges |
| `scripts/build-syllabus.mjs` | Generates `docs/02-syllabus.md` from the data |
| `engine/personalize.mjs` | Profile → T-shape → ordered personal path |
| `db/schema.sql` | Postgres schema for users, paths, progress, SRS, XP, leagues, Studio |
| `docs/03-backend.md` | Backend architecture & API surface |
