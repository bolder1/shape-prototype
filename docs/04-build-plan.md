# Build Plan: the functional prototype

> **Goal:** before investing money in artists, infrastructure or marketing, build a **functional prototype that behaves exactly like the production product**. It should be animation-heavy, 3D, and Duolingo-level playful, with real accounts, real progress and real AI. It runs on free tiers. Generated assets stand in for commissioned ones and can be swapped later without code changes.

## Decisions so far

| Decision | Choice |
|---|---|
| Platform | **Web first** (works in mobile browsers); native apps after it's proven |
| Characters | **Buddy mascot** guides everyone + each learner gets **their own evolving avatar** |
| Character art | **AI-generated 3D, then refined** |
| Team | **You + Claude**, beta in about 3 months |
| Content | **AI drafts, you review** |
| Beta scope | Onboarding · lessons, XP, streaks · skill map · boss projects · leagues & social |
| Market | **India first, English** (₹ pricing; Razorpay/UPI when payments arrive) |
| AI coach | Decide after seeing what's possible (§4). Recommended: basic coach in the prototype |

---

## 1. Tech stack

| Layer | Pick | Why this, for this product |
|---|---|---|
| App framework | **Next.js 16 (App Router, Turbopack, Cache Components) + TypeScript** | One codebase for marketing pages, app and API. Server components keep the app fast while 3D and animation stay client-side. |
| Design system | **Untitled UI React** (free, MIT; React Aria + Tailwind v4), **Phosphor** icons, **Inter** | Professional, accessible components with a matching free Figma kit. Palette: midnight + mint. Rules in `docs/06-design-system.md`. |
| UI motion | **Motion** (formerly Framer Motion) | Springs, layout animations and gestures (drag, swipe, press) for every button, card and transition. |
| Character animation | **Rive** | What Duolingo uses for its characters: tiny files, state machines (idle → happy → sad → cheer) driven by app events, crisp at any size. Used for the buddy's expressions in chat, lessons and reactions. |
| 3D | **React Three Fiber + drei** (three.js) | The 3D T, the avatar showcase, the skill map world and the character cards. Declarative 3D that lives inside React. |
| 3D physics | **@react-three/rapier** | Blocks that drop, bounce and wobble for real; satisfying "juice". |
| Sound | **use-sound / Howler** | Taps, correct/wrong, level-up, streak sounds (toggleable). Half of Duolingo's feel is audio. |
| State | **Zustand** (app state) + **XState** (onboarding and lesson flows) | Flows with many steps, branches and resumes are state machines; XState makes them testable and visualizable. |
| Backend | **Supabase**: Postgres, Auth, Storage, Realtime, Edge Functions | `db/schema.sql` already targets Postgres. Realtime powers leagues and duels. Free tier covers the prototype. Already connected here. |
| Auth | Supabase Auth: **Google + email magic link** (phone OTP later for India) | Low-friction sign-up *after* onboarding (Duolingo pattern: value first, account second). |
| AI | **Claude API via the Vercel AI SDK** (streaming chat + tool use) | Tee's chat, lesson feedback, boss-project reviews and content drafting. Sonnet for coaching and reviews, Haiku for cheap, high-volume tasks. |
| Curriculum and engine | Existing `curriculum/` + `engine/`, ported to **TypeScript in `packages/engine`** | Already tested logic; shared by the server and the browser. |
| Lesson content | Structured **JSON per lesson, validated with Zod**, stored in the repo | Every exercise type (drag, spot, pick, tune…) has a schema. Claude drafts, you review in a small admin page. A CMS only if needed later. |
| Share cards | **@vercel/og** (dynamic images) | Character cards and T-shapes as shareable images for WhatsApp, LinkedIn and Instagram. |
| Analytics | **PostHog** (free tier) | Onboarding funnel, drop-off per question, retention. |
| Hosting | **Vercel** (free tier) | Preview link per change. Already connected here. |
| Payments (later) | **Razorpay** | UPI and Indian cards. Wired after the prototype proves demand. |

**Repo shape**

```
apps/web            Next.js app (marketing, onboarding, app, admin)
packages/engine     curriculum data + personalization engine (TS)
packages/content    lesson JSON + Zod schemas + validation script
packages/ui         design tokens, buttons, cards, motion presets, sounds
assets/             characters (.glb, .riv), sounds, illustrations
supabase/           migrations (from db/schema.sql), seed, edge functions
```

## 2. Characters: buddy + your own avatar

**The buddy (mascot).** An original creature with a big personality, not a T. It guides onboarding, reacts in lessons, and is the face of the AI coach. It needs about 8 core reactions: idle, wave, talk, think, cheer, celebrate, sad and surprised.

**Your avatar.** Each learner gets a character that **visibly evolves with their T-shape**. Three to four forms (Rookie → Rare → Epic → Legendary): outfit, aura and props change as levels rise. Colours come from the learner's deep skill, and accessories unlock from skills (headphones for research, a pen tablet for UI, a rocket for growth). It appears on the character card, the dashboard and in leagues.

**Pipeline (AI-generated, then refined):**

| Step | Tool | Who |
|---|---|---|
| 1. Concept art: 3 directions × buddy + avatar, with turnarounds | Image generation (connected here) | Claude generates, **you pick** |
| 2. Image → 3D mesh | **Meshy** or **Tripo** (free tiers, external) | You upload the chosen concept (a 2-minute task) |
| 3. Rig + base animations | **Mixamo** (free, auto-rig + animation library) | You or Claude-guided |
| 4. Clean-up, toon shading, compression | Blender + `gltf-transform` (Draco/meshopt) | Claude writes scripts; Blender pass by you or later a freelancer |
| 5. 2D expression rig for chat and reactions | **Rive** (free editor) | You build from the concept art, or a Rive freelancer later |
| 6. Integration | R3F (3D) + Rive runtime (2D) | Claude |

**Avoiding the "AI-generic" look:** AI meshes look generic when they're realistic and detailed. So we design for **simple, chunky shapes, a strict 6–8 colour palette, and a toon/cel shader with outlines**. That style hides mesh artifacts and gives a recognisable silhouette. The character's personality comes from **animation and timing**, not detail.

**Until the final assets land,** the code uses a placeholder character with the same animation names, so swapping in the real `.glb`/`.riv` files is a file replacement, not a rebuild.

## 3. What Claude can (and can't) produce for you right now

| Asset | Can do here? | How |
|---|---|---|
| All app code: UI, 3D scenes, physics, animation, backend, DB, auth, AI | ✅ | Directly in this repo |
| Character concept art, turnarounds, illustrations, lesson visuals | ✅ | Connected image generation (uses your generation credits) |
| Short animated loops / promo video | ✅ | Connected video generation, or code-rendered video (HyperFrames) |
| Designs and design system in Figma | ✅ | Figma connector |
| Procedural 3D: T blocks, worlds, particles, shaders, effects | ✅ | Code (three.js / R3F) |
| **Rigged 3D character mesh** | ❌ directly | Via Meshy/Tripo + Mixamo (pipeline above) |
| Rive character rig | ❌ directly | Rive editor (Claude can write the state-machine spec and integration) |
| Lesson content, quizzes, copy | ✅ | Drafted from the syllabus, reviewed by you |
| Sound effects | ❌ | Licensed SFX packs (free/cheap) or an AI SFX tool outside |
| Deploy + database | ✅ | Vercel + Supabase connectors (with your approval per action) |

## 4. The AI coach (Tee) options

| Level | What it does | Cost and risk |
|---|---|---|
| **A. Scripted** | Pre-written lines, reacts to events | Free, no risk, feels static |
| **B. Basic coach** (recommended for the prototype) | Answers questions about the current lesson, explains wrong answers, onboarding chat understands free text | Low cost with per-user daily limits; big "wow" for demos |
| **C. Full coach** | B + reviews boss projects (images/links), portfolio feedback, remembers your progress | Higher cost and more prompt work; add once real users arrive |

## 5. Milestones (about 12 weeks, you + Claude)

| Week | Milestone | Done when |
|---|---|---|
| 1 | **Foundation**: repo, tokens, motion and sound kits, Supabase project, engine ported to TS. **Character concepts generated, you pick a direction.** | App shell deploys to a Vercel preview |
| 2–3 | **Onboarding (production quality)**: buddy-led chat, skill questions, quiz-show round, personality reveal, avatar creation, card power-up, roadmap, pricing, sign-up | A stranger can finish onboarding on their phone and lands on the dashboard with a saved profile |
| 3–4 | **Characters in**: buddy (.riv + .glb) and avatar forms integrated; animation events wired | Buddy reacts to every answer; the avatar evolves on the card |
| 4–5 | **Lesson player** ✅ v0 (2026-11-21): 6 exercise types (concept, pick, sort, order, spot, tune), feedback with why, one retry per miss, XP, daily streak, spaced review, home screen. Content: fd.1, fd.2, rs.1 (12 lessons, drafts for review). **Episodes** v0 (2026-11-22): the rich lesson format (watch an animated scene → quick check → topic mini-game → finish the story → takeaways → timed quiz → prize ladder with lifelines → 3D grade card). Every playable lesson (fd.1, fd.2, rs.1, ia.1, ui.1, cw.1, st.1, rs.2, ui.2, ui.3, ds.1, pr.1, ax.1 — 49) is now an episode: rs.1-1 explore vs check (flashlight in the dark, Flashlight game), rs.1-2 qual vs quant (where vs why, The scale), rs.1-3 research question (hunch forged into a question, Question forge word tiles), rs.1-4 bias (four interview acts, Red pen); fd.1-1 (split-space scene, swipe game), fd.1-2 (Double Diamond scene, diamond sort), fd.1-3 (workshop myth vs. the loop, myth-buster bubbles), fd.1-4 (three roles and a trade-off, timed ticket routing); fd.2-1 Gestalt (form fixed by proximity/similarity/closure, Gestalt hunt on drawn visuals), fd.2-2 hierarchy (5-second gaze test + squint blur, squint-test game), fd.2-3 UX laws (three acts, Law lab experiments that time you), fd.2-4 cognitive load (memory slots, Chunk lab real memory test); **ia.1** (2026-11-22): ia.1-1 mental models (Meera vs. the bank’s menu, Jargon swap relabels a phone menu), ia.1-2 card sorting (open sort → agreement → closed sort, Crowd sort against 20 participants’ votes), ia.1-3 navigation patterns (an app outgrows its tab bar, Pattern fit with drawn wireframes), ia.1-4 sitemaps (too deep vs. too wide, Tree test with first-click scoring), plus the boss “Untangle the Profile tab”; **ui.1** (2026-11-22): ui.1-1 the 8-pt grid (a card snaps to a spacing scale, Spacing fix animates each gap), ui.1-2 columns (12 → 8 → 4 columns, Span it fills a 12-column grid), ui.1-3 whitespace (20 lines replaced by grouping, Cut the lines), ui.1-4 alignment (shared edges, right-aligned numbers, Snap to the line drag game), plus the boss “Fix three broken cards”; **cw.1** (2026-11-22): cw.1-1 clear > clever (a clever sign-up screen fails the two-second glance, Glance test flashes each line), cw.1-2 buttons (OK deletes the wrong photos, Button forge builds labels inside a dialog), cw.1-3 errors (Error 4012 becomes what + how + where, Error doctor), cw.1-4 empty states (what · why · next, Fill the empty draws four kinds), plus the boss “Rewrite a broken onboarding”; **st.1** (2026-11-22, 3 lessons): st.1-1 problem → outcome → output (12 features, flat line, then an outcome; Three rungs ladder), st.1-2 opportunity solution trees (the tree grows level by level; Grow the tree), st.1-3 RICE and Kano (the loudest voice vs. scores, Kano curves; RICE duel, whose answers are checked against the formula in tests), plus the boss “Pick the top 3 of 10”; **rs.2** (2026-11-22): rs.2-1 script anatomy (the interview funnel; Build the script on paper), rs.2-2 open questions and follow-ups (a story-depth meter; Follow-up chat game), rs.2-3 Jobs-to-be-Done (Priya’s 1:10 pm order and its real rivals; Job story forge), rs.2-4 contextual inquiry (the kirana ledger, say vs. do; Ask or watch?), plus the real-world boss “Interview three people”; **ui.2** (2026-11-22): ui.2-1 type anatomy (four lines drawn onto a giant word, and x-height changing apparent size; Pin the line), ui.2-2 type scales (sizes by eye turning muddy, then base × ratio; Size the screen on a phone mock), ui.2-3 pairing fonts (a five-font menu calmed to a serif + sans pair; Pair or clash? with real font specimens), ui.2-4 line length and leading (the eye losing its line; Tune the text with two sliders, then judging paragraphs, with the verdict checked by `measureVerdict`), plus the boss “Set the type for a reading app”; **ui.3** (2026-11-22): ui.3-1 colour models (a hex code becomes three HSL dials, and an OKLCH row evens out HSL’s uneven lightness; Turn the right dial, with a matcher first and `hslDial` checking that only one dial moves), ui.3-2 building a palette (one blue becomes a 50–900 ramp with jobs; Pick from the ramp, where a miss shows your shade next to the better one), ui.3-3 semantic colour (red brand vs. red error, meaning names, and a greyscale test; Colour the message, ending with a greyscale switch), ui.3-4 contrast and dark mode (live WCAG ratios, lazy vs. proper dark mode; Pass or fail? with a tuner, verdicts checked by `contrastRatio`/`contrastLane`), plus the boss “A light and dark palette that passes”; **ds.1** (2026-11-22): ds.1-1 atomic design (atoms snap into molecules, a header, a template, then a real page; Stack the parts, a drag-and-drop tower), ds.1-2 tokens (a hand-made rebrand misses a copy, then color-primary changes nine places at once; Swap in the tokens, ending with live rebrand/radius/spacing switches), ds.1-3 inconsistency debt (five drifted buttons, an inventory and its costs, five become two; Hunt the debt, an audit wall where the test checks every “matches” button shares one style), plus the real-world boss “Audit a real app”; **pr.1** (2026-11-22): pr.1-1 paper to clickable (an over-polished prototype, then the fidelity ladder with each rung’s artefact and cost; Pick the rung, which charges hours for every choice), pr.1-2 prototype for a question (a 40-screen demo gets vague praise, then four screens and a clear answer; Scope the prototype: forge the question, then pick the screens on its path), pr.1-3 Figma prototyping basics (hotspot, connection, trigger/action/animation, overlay, present mode; Wire the flow, which plays back each action), plus the boss “A prototype that answers one question”; **ax.1** (2026-11-22): ax.1-1 disability as a spectrum (a 3 × 3 persona grid, one-handed mode across a row; Fill the spectrum, tested to fill every cell once), ax.1-2 WCAG POUR (a booking page tagged pillar by pillar; Build the four pillars, drag and drop), ax.1-3 contrast and colour blindness (side-by-side simulation with Machado 2009 matrices in linear RGB; Through other eyes, with a four-vision explorer), ax.1-4 target sizes and focus (thumb misses, 44 px tap areas, spacing, visible focus; Thumb and Tab test, an audit that draws a 44 px thumb over every target), plus the boss “Audit a landing page for accessibility” with a 15-point checklist. Schema `packages/content/src/episode.ts`; player `apps/web/src/features/episode`. Each new episode needs its own scene and game component; lessons without one stay classic | The first 3 beginner chapters are playable end to end |
| 6 | **Skill map** ✅ v0 (2026-11-21): all 60 chapters as a 2D graph at `/map` (rows = skills, columns = prerequisite depth), your path numbered and lit in mint, pan/zoom/pinch, focus-on-my-path, chapter panel with why-it’s-on-your-path, builds-on/unlocks, and a list view. The 3D world version comes later | Tap any chapter to see what it is and why it's on your path |
| 7–8 | **Boss projects** ✅ v0 (2026-11-21): briefs for fd.1, fd.2, rs.1 (drafts for review) at `/boss/[chapter]`, opens after the chapter’s lessons; text hand-in with auto checks and autosaved drafts; AI rubric review (`/api/boss/review`, Claude Opus 5.5, structured output) with self-review fallback when no key; 50 XP pass + 25 distinction, best attempt counts. Still to do: uploads/links, peer review queue | Submit → feedback in under a minute |
| 9 | **Leagues & social**: weekly leagues (Realtime), shareable card images, friend invites. **Leagues** ✅ v0 (2026-11-22): 7 tiers (Sketch → Masterpiece), groups of 20, top 5 up / bottom 5 down, Monday rollover with a once-only result banner, `/league` table that re-ranks live, league card on home. Rules in `packages/engine/src/league.ts` (tested, ready for the rollover cron); XP is now a ledger in the progress store (`xp_events` shape). You join a week only by earning XP in it. The other 19 seats are seeded practice rivals until accounts exist. Still to do: Supabase accounts + Realtime, share cards, friend invites | 10 test users competing in a league |
| 10 | **Tee AI coach** (level B) in chat and lessons. **Ask Nib** v0 (2026-11-22): a coach in every episode (`/api/coach`, streaming, Claude Opus 5.5 at low effort, server-side fallback) that knows the lesson and the learner’s last miss; locked during the quiz and ladder; 40 questions per day per IP; offline mode answers from the lesson when there’s no API key. Still to do: per-account limits once accounts exist, coach in the onboarding chat | Asks and answers work with usage limits |
| 11–12 | **Content + polish**: all 16 beginner chapters drafted and reviewed, sound pass, performance on low-end Android, PostHog funnels | Closed beta with 20–50 people |

**Biggest risk to the timeline:** content review (about 70 lessons in beta). Mitigation: Claude drafts a chapter per day from week 2, so review runs alongside the build instead of at the end.

## 6. Running costs during the prototype

| Item | Cost |
|---|---|
| Vercel, Supabase, PostHog, Rive, Mixamo | Free tiers |
| Claude API (coach + reviews + content drafting) | Usage-based, small at beta scale; set a monthly cap |
| Image/video generation for concepts | Your existing generation credits |
| Meshy/Tripo | Free tier; a paid month if you need higher-quality exports |
| Domain | ~₹1,000/year |

## 7. Still to decide (not blocking week 1)

1. Buddy concept direction (after seeing the generated options)
2. Product name and brand (*Shape* is a working name)
3. AI coach level for beta (A / B / C above)
4. Avatar customisation depth: colour + accessories only, or body and face options too
