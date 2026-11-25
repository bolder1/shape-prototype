-- Accounts for Release 1 (docs/08-engagement-plan.md §6): every learner is a Supabase auth user.
-- Progress keeps living in the browser stores and syncs here as snapshots (merged on sign-in, see
-- packages/engine/src/sync.ts), plus an append-only event log that badges, quests and analytics read.
-- The design-time tables in 0001 (users, xp_events, ...) stay for later; nothing writes them yet.

-- One row per learner: their synced browser state. jsonb because the stores evolve faster than a schema should.
create table learner_state (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  progress    jsonb not null default '{}'::jsonb,   -- shape.progress.v1 (XP ledger, streak, lessons, reviews, bosses)
  league      jsonb not null default '{}'::jsonb,   -- shape.league.v1
  profile     jsonb not null default '{}'::jsonb,   -- shape.profile.v1 (onboarding answers, name, goal)
  version     int   not null default 1,             -- bumped on every write; a stale writer can detect it lost a race
  updated_at  timestamptz not null default now()
);

-- Everything a learner does, once. Badges and quests are rules over these rows.
-- `client_id` is made in the browser so a retried upload never double-counts.
create table events (
  id          bigserial primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  client_id   text not null,
  kind        text not null check (kind in ('lesson_done', 'review_done', 'boss_submitted', 'grade', 'share', 'badge', 'puzzle', 'signin')),
  ref         text,                                  -- lesson / chapter / badge id
  data        jsonb not null default '{}'::jsonb,
  at          timestamptz not null,                  -- when it happened (client clock), not when it arrived
  received_at timestamptz not null default now(),
  unique (user_id, client_id)
);
create index events_by_user_time on events(user_id, at);
create index events_by_kind on events(kind, at);

alter table learner_state enable row level security;
alter table events enable row level security;

-- A learner reads and writes only their own state.
create policy "own state: read"   on learner_state for select using (auth.uid() = user_id);
create policy "own state: insert" on learner_state for insert with check (auth.uid() = user_id);
create policy "own state: update" on learner_state for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Events are append-only from the client: insert and read your own, never update or delete.
create policy "own events: read"   on events for select using (auth.uid() = user_id);
create policy "own events: insert" on events for insert with check (auth.uid() = user_id);

-- Keep updated_at and version honest whatever the client sends.
create function touch_learner_state() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  new.version := coalesce(old.version, 0) + 1;
  return new;
end $$;
create trigger learner_state_touch before insert or update on learner_state
  for each row execute function touch_learner_state();
