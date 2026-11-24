# Shape

Learn product design by playing it. Plans and specs live in `docs/`. Start with `docs/04-build-plan.md`.

## Layout

| Path | What |
|---|---|
| `apps/web` | Next.js 16 app on Untitled UI + Phosphor (landing, onboarding, home `/play`, lessons `/learn`, review, skill map `/map`, boss projects `/boss`, `/dev/kit`). Rules: `docs/06-design-system.md` |
| `packages/engine` | Curriculum (60 chapters) + personalization engine, TypeScript, tested |
| `packages/content` | Lesson content (71 lessons, 20 chapters), boss briefs (20), Zod schemas, grading. Drafts for review: `src/chapters/`, `src/bosses.ts` |
| `packages/ui` | Motion presets (shared beyond the web app) |
| `supabase/` | `migrations/0001_init.sql` + generated `seed.sql` |
| `prototype/` | Earlier HTML prototypes, kept as behaviour reference (run `node scripts/serve.mjs`) |
| `curriculum/`, `engine/` | Legacy JS used only by `prototype/`; the source of truth is `packages/engine` |

## Commands

```
npm install          # once
npm run dev          # http://localhost:3000  (UI kit at /dev/kit)
npm test             # engine + content tests
npm run typecheck    # all packages
npm run build        # production build
npm run seed:sql     # regenerate supabase/seed.sql from the curriculum
```
