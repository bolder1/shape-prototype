# Backend architecture (v0)

## Stack (proposed)
- **Next.js (App Router)** for web + API routes, deployed on Vercel
- **Postgres** (Supabase or Neon) with schema in `db/schema.sql`
- **Auth:** Supabase Auth or Clerk
- **Storage:** submission uploads in object storage. Figma work is linked by URL.
- **AI critique:** Claude API scores boss submissions against each chapter's rubric (one of three signals: auto checks, AI and peers)
- **Jobs:** a cron for weekly league rollover, streak resets and the review-due digest

## Data flow

```
Onboarding answers ──► assessments ──► engine.buildTShape ──► t_shapes
                                              │
                                              ▼
                                     engine.buildPath ──► paths + path_items
                                              │
Lesson Player ──► lesson_attempts ──► chapter_progress ──► (level-up?) ──► new t_shape snapshot
      │                                                                  │
      └──► review_cards (SRS)                                            └──► re-generate path
Boss ──► submissions ──► AI score + peer_reviews ──► passed ──► xp_events, studio layer
```

**Key rules**
1. **Content is code.** `curriculum/curriculum.mjs` is the source. A seed script upserts `domains`, `chapters`, `chapter_prereqs` and `lessons`.
2. **The T-shape is a snapshot, not a mutable field.** Every reassessment or level-up writes a new `t_shapes` row, so "replay my growth" is just a query.
3. **XP is a ledger.** Totals, weekly league scores and streaks are derived from `xp_events`, which makes them auditable and immune to double-counting bugs.
4. **Paths are versioned by `engine_version`.** When the engine changes, active paths are regenerated, while progress (stored per chapter, not per path) is kept.
5. **Levels come from mastery, not XP.** Level 2 = all `bar` chapters mastered, 3 = `stem`, 4–5 = `deep` plus Studio evidence.

## API surface

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/onboarding` | Save profile + assessment → returns T-shape + path |
| GET  | `/api/me/tshape?history=1` | Current T-shape (or the full history for the replay animation) |
| GET  | `/api/me/path` | Ordered path with progress state per chapter |
| GET  | `/api/graph` | All domains / chapters / edges for the Skill Graph |
| GET  | `/api/chapters/:id` | Chapter + lessons + boss brief |
| POST | `/api/lessons/:id/attempt` | Submit an interaction result → score, XP, newly unlocked chapters |
| GET  | `/api/reviews/due` | Due review cards |
| POST | `/api/reviews/:conceptId` | Grade a card (0–5) → SM-2 update |
| POST | `/api/submissions` | Submit boss assignment → queues AI critique |
| GET  | `/api/submissions/:id/review-queue` | Peer submissions to review |
| POST | `/api/peer-reviews` | Submit a rubric review |
| GET  | `/api/leagues/current` | This week's league table |
| POST | `/api/duels/:id/entries` | Enter a design duel |
| POST | `/api/reassess` | Retake calibration → new T-shape → regenerated path |

## Build order (MVP → v1)
1. **MVP:** onboarding + T-shape animation, Skill Graph, Lesson Player with 3 mechanics (`spot`, `pick`, `drag`), progress, XP + streaks. Content: all `bar` chapters (16).
2. **v0.5:** boss assignments + AI critique, Studio project, SRS reviews.
3. **v1:** peer review, leagues, duels, remaining mechanics, `stem`/`deep` content.
