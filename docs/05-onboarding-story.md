# Onboarding as a story

> **Status: v0 built (2026-11-21)** at `/onboarding`. Code: `apps/web/src/features/onboarding/` (XState flow in `machine.ts`, copy in `content.ts`, 3D in `world/`, panels in `steps/`). The world and characters are placeholder primitives with the final object names, so generated `.glb`/`.riv` assets can replace them. Defaults taken for the open questions below: road kept, neutral stylised placeholder character, all 14 skill questions plus a "3D story" off switch.
>
> Replaces the chat-first onboarding. The *content* stays the same (the dream, today, 14 skills, quick check, pace, character, future self, roadmap, start choice, pricing). What changes is the *stage*: a short, cinematic 3D story through the world of product design, with the learner in it. The buddy (AI) is a **companion at the edge of the screen**, never the main body.

## The idea in one line

**"Walk through how a product gets made, and find where you fit."** The learner doesn't fill in a survey. They travel through a product's life, from idea to launch, and at each stop they meet the discipline that does that work, see what it really is, and say how much they've done it.

The questions become part of the story, and the story teaches the whole field, so even a sales colleague finishes knowing what research, IA or design systems are.

## Structure: 7 scenes, about 4 minutes

The camera moves along a single continuous 3D world (one scene graph, a camera on a rail). The UI is a light DOM layer on top. Each scene is a "stop" on the rail.

| # | Scene | On screen (3D + motion) | What the learner does | Data |
|---|---|---|---|---|
| 0 | **Arrival** | Dark-to-light dawn over a quiet studio desk: a sketchbook, a phone, sticky notes. Title types in: *"Every product starts as a problem someone noticed."* | Tap to begin. Optional name field. | name |
| 1 | **The dream** | The camera pulls back to show a horizon of **role portals** (Product designer, UI, Research, Motion, Brand, Growth, Design engineer, Lead, *Better at my own job*, *Not sure yet*). Hovering a portal plays a 2-second vignette of that role's day. | Pick one portal. | aspiration |
| 2 | **Today** | Your **character appears** at the start of a road (default pose, neutral outfit). A row of craft tokens hovers by it. | Pick your current role; the character's outfit and prop change to match (headphones, pen tablet, laptop…). | role |
| 3 | **The journey: 4 stations** | The road runs through four stations, one per skill family:<br>**Discover** (interview room, sticky-note wall) → **Design** (drafting table where wireframes turn into polished UI, a component library, motion curves) → **Grow** (launch stage, growth chart, brand billboard) → **Build & lead** (code terminal, workshop table). At each station a **5–8 s micro-story** shows the work happening (e.g. sticky notes clustering into an insight). | For each skill at the station (2–7 per station), a compact card slides in: **what it is**, **a real example**, then **Not yet / Aware / Practitioner / Expert**. Answers light up that part of the station; your character picks up the matching tool. | 14 self-ratings |
| 4 | **Quick check** | A spotlight narrows onto a real artefact from your strongest station: a screen, a flow, an error message. Calm, focused, a slim 20 s timer bar. | 3 scenario questions ("What's the biggest problem on this screen?"), each with *Confirm*, a short reveal and **why**. | calibration |
| 5 | **Your profile** | The world fades to a clean surface. Your **skill profile** assembles: the today → goal outcome chart (the same component as `/dev/kit`), "29% ready for Product designer", archetype title. | Pace: *10 / 20 / 30 / 60 min a day*. | minutes/day |
| 6 | **Future you** | The camera returns to your character at the start of the road, then **flies forward along the road** to its end, where your *future* character stands (evolved outfit, aura, tools from every station). The character card flips from Today to Future. | Share card · see roadmap. | – |
| 7 | **The road ahead** | The road becomes your **roadmap**: 4 milestones (Find your feet → Build your bar → Go deep → Final form) placed on the road you just travelled, with chapter counts and weeks. | *Follow my path* / *Start from zero* → Pricing (Free now; Pro and Teams coming soon) → Create account. | start mode, account |

**Why a road:** it turns the abstract T-shape into something everyone gets: a journey from today to future you, through every discipline. The same road becomes the roadmap and, later, the in-app skill map.

## The buddy (AI companion)

- Lives **bottom-right** as a small animated character in a pill: *"Ask me anything"*.
- **Reactive, not leading.** It comments briefly at moments that matter (*"Most designers skip research. Nice."*) and stays quiet otherwise.
- **"What's this?"** on any skill card opens the buddy panel with a deeper explanation, which uses the AI (Claude) once enabled.
- Open the panel anytime to ask questions in free text. Closing it never loses your place.
- After onboarding it becomes the in-app coach (lessons, feedback, questions).

## Visual and motion direction

- **World style:** soft-lit, stylised 3D (clay/matte materials, warm paper and ink palette, colour only from the four skill families as accents at each station). Premium toy-like *objects*, never toy-like *UI*.
- **UI layer:** the design system in `docs/06-design-system.md` (Untitled UI, Inter, Phosphor, midnight + mint). Cards are compact and white over the scene, with crisp type. Each question uses the control that fits it (cards, type-to-search, dropdown, segmented, chips).
- **Motion:** camera moves on eased splines (1–1.5 s between stops); micro-stories are short, looping and skippable; answers trigger small physical responses in the world (a lamp turns on, a tool flies to your character).
- **Sound:** subtle ambient bed + soft UI ticks (off by default on first visit, one-tap toggle).
- **Accessibility:** every scene has a reduced-motion version (cross-fades instead of camera flights) and a "skip story" path that shows the same questions as a plain sequence. Low-end devices automatically get a 2D illustrated version of each scene.

## Build approach

| Part | Tech |
|---|---|
| World + camera rail | React Three Fiber, drei (`CameraControls` / spline path), one scene with per-station groups loaded lazily |
| Station objects | AI-generated 3D (Meshy/Tripo) → cleaned in Blender → glTF + Draco; until then, stylised primitives with the same names |
| Characters (learner + buddy) | Same pipeline; learner avatar has swappable props/outfits per role and evolution tier; buddy also gets a Rive 2D rig for the companion pill |
| Flow logic | XState machine: scenes as states, answers as events; resume where you left off (saved to localStorage, then to the account) |
| UI layer | Untitled UI + our inputs (`ChoiceCards`, `RoleField`, `Segmented`, `ChipSelect`), Motion for entrances |
| Outcome | `@shape/engine` (same as today) + `SkillOutcome` chart |
| Fallbacks | `prefers-reduced-motion`, a WebGL capability check → 2D scene images, a "skip story" list mode |

## Build order (inside weeks 2–3 of the plan)

1. **Flow skeleton**: the XState machine and all 7 scenes as simple 2D panels (questions, outcome, roadmap, pricing work end to end).
2. **World v0**: camera rail through 4 stations with primitive placeholder objects and transitions.
3. **Characters v0**: placeholder learner and buddy with role props and today/future states.
4. **Micro-stories**: one short animation per station.
5. **Polish**: sound, reduced-motion, 2D fallback, mobile tuning.
6. **Swap in generated 3D assets** as they're approved.

## Questions to settle before building

1. **The road metaphor:** keep it (it doubles as the roadmap and skill map), or prefer another world (a city of disciplines, a studio building with floors)?
2. **Character style:** stylised human (Memoji-like proportions) or a non-human creature for the learner avatar? (The buddy should differ from the learner either way.)
3. **Length:** 14 skill questions inside the story takes about 4 minutes. OK, or should some skills be asked later in the app?
