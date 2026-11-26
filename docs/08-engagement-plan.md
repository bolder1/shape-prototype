# Engagement, showcase & dashboard plan

Draft 2026-11-25, for discussion. Lesson videos are planned separately (session "Lesson video plan").

## The shift

Learners don't come to Shape just to *learn*. They come to **take part, get better, and have something to show for it.** Every system below serves one of three loops:

| Loop | Question it answers | Time scale |
|---|---|---|
| **Daily** | "Why open Shape today?" | 2–10 min |
| **Progress** | "What am I working towards?" | weeks |
| **Showcase** | "What can I show people?" | months; this is what markets Shape |

Ground rule: **no dark patterns.** We teach confirmshaming, roach motels and guilt-trip streaks in gr.1-4 and gr.4-3, so our own systems must pass that lesson. Streaks get freezes, notifications are capped and kind, and nothing is paywalled behind a timer. All badge and reward art is drawn by hand as vectors, matching the product's look. No AI-generated imagery.

## What exists today (and what's missing)

**Have:** XP ledger, daily streak, weekly goal, spaced review, S–D grade cards with a share page (`/s/[code]`), leagues (engine done, rivals are fake), bosses with AI rubric review, a skill map with prerequisite *visuals*.

**Missing:**
- Accounts: everything lives in this browser's localStorage.
- Badges: a table exists in `db/schema.sql` but nothing uses it.
- Real unlocks: lessons aren't gated, only bosses.
- Anything to showcase beyond a single card.
- Grade "tokens": they're decoration only and never stored.
- The Studio / Growth Profile ideas in `01-product-vision.md`, none built yet.

## 1. Daily loop: a reason to come back

- **Daily Brief (headline idea).** One 2-minute design puzzle a day, the same for everyone: spot the flaw, pick the better screen, fix the contrast, fit the grid. It's drawn from the existing game mechanics, so new puzzles are cheap to make. The result is a **spoiler-free share grid** (like Wordle) with "Shape Daily #142 · 4/5 · 38s". This is the main marketing loop: shares drive installs without anyone posting their work.
- **Streak, done fairly.** One free **freeze** a week, plus more earned at milestones. A missed day shows "Streak saved", not a guilt screen. Milestones at 7, 30, 100 and 365 days give a badge and a card frame.
- **Buddy streaks** (the Snapchat-style hook, done kindly). Pair up with a friend: you both do anything that day and the buddy flame grows. If one of you misses, the other gets a *nudge* button, not a shame notification.
- **Weekly quests.** Three per week, matched to *your* path: "Get an A in a research lesson", "Clear 10 reviews", "Try a boss". Finishing all three opens a weekly chest (cosmetics, freezes, a hint lifeline).
- **Combo.** Back-to-back correct answers inside an episode build a combo meter that pays bonus XP and drives a small celebration in the scene.

## 2. Progress loop: unlocks you earn

- **Soft gating plus need-based unlocks.** Lessons stay open, since learning shouldn't be blocked, but **extra content is earned:**
  - **Deep Cuts.** Hidden bonus episodes per chapter: an advanced case or a real-company teardown. They unlock with an **S grade** on any lesson in that chapter. The map shows them as locked silhouettes with a teaser.
  - **Practice Gym.** When the review queue or quiz misses show a weak skill (say, contrast), a targeted drill set unlocks: "You've missed 4 contrast calls this week → *Contrast Gym* unlocked". This is the "unlock based on need" idea.
  - **Remix mode.** Finish a chapter and its mini-games come back harder: timed, no lifelines, new cards. That gives replay value from content we already have.
  - **Masterclass bosses.** Pass three bosses in a skill family to open one cross-chapter capstone, for example "Redesign Dabba end to end".
- **Badges, in four kinds:**
  1. *Mastery:* all S grades in a chapter; a skill family complete.
  2. *Craft:* a boss passed with distinction; a perfect prize ladder.
  3. *Habit:* streak milestones; reviews cleared.
  4. *Secret:* hidden. For example, find the dark pattern in our own checkout scene, or replay a lesson at 2 am.

  Each badge has **tiers** (bronze/silver/gold), so one idea goes three levels deep.
- **Skill levels instead of raw XP.** Each of the 13 skill families gets a level from mastered chapters and boss results, not from time spent. That fits the vision doc's "XP for demonstrated skill".
- **Avatar & studio cosmetics.** The buddy/avatar from the product decisions gets accessories, card frames and studio themes from badges and chests. Cosmetic only, never pay-to-win.

## 3. Showcase loop: proof that travels

- **Skill Passport (public profile `/@handle`).** One page with:
  - verified skill levels as a radar or bars,
  - boss projects as mini case studies with the rubric verdicts,
  - a badge shelf, streak, league tier,
  - an "Open to work" switch.

  This is what goes on a CV, LinkedIn and Instagram.
- **Verifiable credentials.** Each passed boss and each completed skill family issues a credential with a **signed** URL. Today's share codes are unsigned, so they can be faked. Adds:
  - LinkedIn's "Add to profile → Licenses & certifications" flow, pre-filled,
  - a one-page **PDF résumé insert**: the "Product design skills, verified by Shape" section.
- **Studio portfolio.** The vision doc's "Studio" made real: a product the learner builds across bosses. It exports as a portfolio case study (ld.2 already teaches how to write one).
- **Shareable moments.** Auto-made cards for a chapter cleared, a badge earned, a league promotion, a streak milestone or a Daily Brief score. Each card links back to the passport, which is the marketing engine.

## 4. Social & competition

- **Real leagues** need accounts. Swap the 19 fake seats for real learners, and keep bots only to fill thin groups (labelled as practice rivals).
- **Weekly Design Jam.** One brief every week, for example "Redesign a ration-shop queue screen". Entries go in a public gallery, peers vote, and the top 3 get a badge plus a feature on Shape's socials. It also fills the boss "peer review queue" gap.
- **Async duels.** Challenge a friend to the same 10-question quiz, then compare scores and times.
- **Friends & invites.** Invite with your passport link; both of you get a streak freeze when they finish their first lesson.

## 5. Dashboard redesign (`/play`)

Today the dashboard is a stat row plus "continue". The new layout leads with **Today**:

1. **Today strip:** Daily Brief (big), reviews due (count and minutes), continue lesson, buddy streak status.
2. **Quick actions** (one tap each): ▶ Continue · ⚡ 2-min review · 🧩 Daily Brief · 🎯 Practice my weak skill · 🏆 League · 🪪 Share my passport.
3. **Next unlock teaser:** "2 more S grades in Colour → *Deep Cut: Swiggy's dark mode teardown*". It's always visible, because a visible next reward drives return visits.
4. **Weekly quests** with progress bars and the chest.
5. **Skill levels:** a compact radar for the 13 families, each tappable into its chapters.
6. **Badge shelf:** latest three badges plus "4 secret badges left to find".
7. Right rail on desktop: league position, buddy streaks, Jam of the week.

On a phone it becomes one column ordered Today → Quick actions → Next unlock → Quests.

## 6. Product fixes that come first

1. **Accounts & sync (Supabase).** Leagues, buddies, passports, credentials and jams all depend on it, so it's step zero. Move the localStorage stores onto server tables, and migrate existing local progress the first time someone signs in.
2. **Signed share codes / credentials.** Without this, the showcase loop can't be trusted.
3. **Event log.** One `events` table (lesson_done, grade, badge, share, puzzle). Badges, quests and analytics are all just rules over events, so new badges need no new plumbing.
4. **Game QA.** Hand-test the later screens of the 95 games the automated pass couldn't reach (see `chapter-review-notes.md`).
5. **Notifications** (web push, opt-in): one daily reminder at the learner's chosen time, plus buddy nudges. Hard cap of one a day.

## Phasing

| Phase | Ships | Why first |
|---|---|---|
| **0 · Foundation** | Accounts + sync, event log, signed codes | Everything social and showcase needs it |
| **1 · Daily loop** | Daily Brief + share grid, fair streak + freezes, new dashboard with quick actions | Biggest retention and marketing lift for the effort |
| **2 · Collect** | Badges (4 kinds, tiers), weekly quests + chest, skill levels | Gives the dashboard something to show |
| **3 · Showcase** | Skill Passport, credentials (LinkedIn + PDF), moment cards | Turns progress into marketing |
| **4 · Unlocks** | Deep Cuts, Practice Gym, Remix mode, Masterclass bosses | Depth for committed learners |
| **5 · Social** | Real leagues, buddy streaks, friends, Design Jam, duels | Needs a user base, so it comes last |

## How we'll know it works

D1 / D7 / D30 retention · weekly active learners · Daily Brief completion and **share rate** · passport views from outside the app · invites per active learner (K) · share of learners with ≥1 credential on LinkedIn.

## Decisions (2026-11-25)

1. **Accounts come first.** Supabase sign-in (email magic link + Google), progress synced, local progress migrated the first time someone signs in.
2. **Unlocking: both.** Soft by default: lessons are open and only *extra* content (Deep Cuts, Practice Gym, Remix, Masterclass) is earned. There's also an optional **Guided path** switch that locks chapters until their prerequisites are done, using the skill map's existing lock states.
3. **First release = Daily Brief + share grid, new dashboard, badges + weekly quests, and the Skill Passport.** In the phasing table that's phases 1–3 shipping together after the foundation.
4. **Passports are private until opt-in.** One switch makes `/@handle` public.
5. *Answered for Release 1 (2026-11-26):* "verified" means the project was reviewed by the server's AI reviewer against the rubric, and the server signed the verdict for that signed-in learner (a review receipt, checked again whenever the passport is shown). Self-reviewed passes still appear, labelled as such. A peer or mentor review can become a higher tier later, once the Design Jam brings reviewers.

## Release 1 build order

1. Foundation: accounts + sync, the `events` table, signed codes.
2. Badges & quests engine: rules over events in `packages/engine`, tested like `league.ts`.
3. New dashboard: Today strip, quick actions, next-unlock teaser, quests, skill levels, badge shelf.
4. Daily Brief: a puzzle bank built from existing game mechanics, a daily seed, the share grid with an OG image.
5. Skill Passport: `/@handle`, credentials, LinkedIn pre-fill, PDF insert, privacy switch.
6. Guided path switch.
