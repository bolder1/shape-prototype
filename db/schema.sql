-- Shape: Postgres schema (v0)
-- Content tables are seeded from curriculum/curriculum.mjs; never edit them by hand in prod.

create extension if not exists pgcrypto;

-- ========== CONTENT (seeded) ==========
create table domains (
  id        text primary key,               -- 'ui', 'rs', ...
  name      text not null,
  tagline   text not null,
  sort      int  not null
);
create table domain_adjacency (
  domain_id   text references domains(id),
  adjacent_id text references domains(id),
  primary key (domain_id, adjacent_id)
);
create type tier as enum ('bar', 'stem', 'deep');
create table chapters (
  id          text primary key,             -- 'ui.4'
  domain_id   text not null references domains(id),
  title       text not null,
  tier        tier not null,
  boss_brief  text not null,
  studio_layer text,                         -- null if chapter adds no Studio layer
  sort        int  not null
);
create table chapter_prereqs (
  chapter_id text references chapters(id),
  prereq_id  text references chapters(id),
  primary key (chapter_id, prereq_id)
);
create table lessons (
  id          uuid primary key default gen_random_uuid(),
  chapter_id  text not null references chapters(id),
  title       text not null,
  mechanic    text not null,                 -- drag | spot | pick | tune | ...
  content     jsonb not null default '{}',   -- interaction definition for the Lesson Player
  sort        int  not null
);
-- Atomic concepts are the unit of spaced repetition (a lesson teaches 2–5).
create table concepts (
  id         uuid primary key default gen_random_uuid(),
  lesson_id  uuid not null references lessons(id),
  prompt     jsonb not null,                 -- review card definition
  answer     jsonb not null
);

-- ========== USERS & PROFILE ==========
create table users (
  id          uuid primary key default gen_random_uuid(),
  handle      text unique not null,
  display_name text,
  created_at  timestamptz not null default now()
);
create table profiles (
  user_id      uuid primary key references users(id) on delete cascade,
  role         text,
  years        int,
  about        text,                         -- free-text "tell us about you"
  home_discipline text,                      -- 'motion-designer', 'frontend-engineer', ... (engine ROLE_HOME)
  goal         text not null check (goal in ('i-to-t','t','pi','full-stack','product-literate')),
  spine        text[] not null default '{}',
  interests    text[] not null default '{}',
  weekly_hours int not null default 5,
  updated_at   timestamptz not null default now()
);
-- One row per onboarding / re-assessment, so the T-shape can be replayed over time.
create table assessments (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references users(id) on delete cascade,
  self_rating  jsonb not null,               -- {domain: 0-5}
  calibration  jsonb not null default '{}',  -- {domain: 0-1}
  created_at   timestamptz not null default now()
);
-- Snapshot of the computed T-shape (current/target per domain).
create table t_shapes (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references users(id) on delete cascade,
  assessment_id uuid references assessments(id),
  columns       jsonb not null,              -- [{domain, current, target, role}]
  created_at    timestamptz not null default now()
);

-- ========== PERSONAL PATH ==========
create table paths (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users(id) on delete cascade,
  t_shape_id  uuid not null references t_shapes(id),
  engine_version text not null,              -- re-generate when engine changes
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);
create unique index one_active_path on paths(user_id) where active;
create table path_items (
  path_id     uuid references paths(id) on delete cascade,
  position    int  not null,
  chapter_id  text not null references chapters(id),
  primary key (path_id, position)
);

-- ========== PROGRESS ==========
create type progress_state as enum ('locked','available','in_progress','mastered');
create table chapter_progress (
  user_id     uuid references users(id) on delete cascade,
  chapter_id  text references chapters(id),
  state       progress_state not null default 'locked',
  mastered_at timestamptz,
  primary key (user_id, chapter_id)
);
create table lesson_attempts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users(id) on delete cascade,
  lesson_id   uuid not null references lessons(id),
  score       real not null,                 -- 0–1
  passed      boolean not null,
  attempt_no  int not null,
  response    jsonb,
  created_at  timestamptz not null default now()
);
-- SM-2-style scheduler state per user × concept.
create table review_cards (
  user_id     uuid references users(id) on delete cascade,
  concept_id  uuid references concepts(id),
  ease        real not null default 2.5,
  interval_days int not null default 0,
  reps        int not null default 0,
  due_at      timestamptz not null default now(),
  lapses      int not null default 0,
  primary key (user_id, concept_id)
);
create index review_due on review_cards(user_id, due_at);

-- ========== ASSIGNMENTS, CRITIQUE, STUDIO ==========
create table studio_projects (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users(id) on delete cascade,
  title       text not null,
  brief       text not null,
  is_own_idea boolean not null default false,
  public      boolean not null default false,
  created_at  timestamptz not null default now()
);
create table submissions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users(id) on delete cascade,
  chapter_id  text not null references chapters(id),
  studio_project_id uuid references studio_projects(id),
  artifact_urls text[] not null default '{}',  -- Figma links, uploads, live URLs
  write_up    text,
  ai_score    real,                            -- 0–1 rubric score from AI critique
  ai_feedback jsonb,
  final_score real,                            -- blended AI + peer
  status      text not null default 'submitted' check (status in ('submitted','in_review','passed','needs_work')),
  created_at  timestamptz not null default now()
);
create table peer_reviews (
  id            uuid primary key default gen_random_uuid(),
  submission_id uuid not null references submissions(id) on delete cascade,
  reviewer_id   uuid not null references users(id),
  rubric_scores jsonb not null,               -- {criterion: 1-4}
  comment       text not null,
  helpful_votes int not null default 0,
  created_at    timestamptz not null default now(),
  unique (submission_id, reviewer_id)
);

-- ========== GAMIFICATION ==========
-- Append-only ledger: XP total and league score are derived, never stored as mutable counters.
create table xp_events (
  id          bigserial primary key,
  user_id     uuid not null references users(id) on delete cascade,
  kind        text not null,                 -- lesson_pass | review | boss_pass | boss_distinction | peer_review | studio_ship
  amount      int  not null,
  ref_id      text,                          -- lesson / submission / review id
  created_at  timestamptz not null default now()
);
create index xp_by_user_time on xp_events(user_id, created_at);
create table streaks (
  user_id       uuid primary key references users(id) on delete cascade,
  current_days  int not null default 0,
  longest_days  int not null default 0,
  last_active_on date,
  freezes       int not null default 0
);
create table leagues (
  id          uuid primary key default gen_random_uuid(),
  tier_rank   int  not null,                 -- 1 = Sketch … 7 = Masterpiece
  week_start  date not null
);
create table league_members (
  league_id   uuid references leagues(id) on delete cascade,
  user_id     uuid references users(id) on delete cascade,
  outcome     text check (outcome in ('promoted','stayed','demoted')),
  primary key (league_id, user_id)
);
create table duels (
  id          uuid primary key default gen_random_uuid(),
  brief       text not null,
  domain_id   text references domains(id),
  starts_at   timestamptz not null,
  ends_at     timestamptz not null
);
create table duel_entries (
  duel_id     uuid references duels(id) on delete cascade,
  user_id     uuid references users(id) on delete cascade,
  artifact_url text not null,
  votes       int not null default 0,
  primary key (duel_id, user_id)
);
create table badges (
  id          text primary key,              -- 'first-boss', 'pi-shaped', ...
  name        text not null,
  description text not null
);
create table user_badges (
  user_id     uuid references users(id) on delete cascade,
  badge_id    text references badges(id),
  earned_at   timestamptz not null default now(),
  primary key (user_id, badge_id)
);
