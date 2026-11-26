-- Skill Passport (docs/08-engagement-plan.md §3): a public page at /@handle that a learner can put on a CV.
-- Private until the learner switches it on (decision 4). The page is built on the server from the event log,
-- so what it shows is what the learner actually did; nothing on it is typed in except the name and headline.

create table passports (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  -- 3–24 characters: lowercase letters, digits and inner hyphens. Reserved words are refused by the app.
  handle        text not null unique check (handle ~ '^[a-z0-9][a-z0-9-]{1,22}[a-z0-9]$' and handle not like '%--%'),
  display_name  text check (char_length(display_name) between 1 and 60),
  headline      text check (char_length(headline) <= 120),
  is_public     boolean not null default false,   -- off until the learner opts in
  open_to_work  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table passports enable row level security;

-- The owner manages their own row. Nobody else reads the table directly: public pages go through public_passport().
create policy "own passport: read"   on passports for select using (auth.uid() = user_id);
create policy "own passport: insert" on passports for insert with check (auth.uid() = user_id);
create policy "own passport: update" on passports for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own passport: delete" on passports for delete using (auth.uid() = user_id);

create function touch_passport() returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;
create trigger passports_touch before update on passports for each row execute function touch_passport();

-- Everything the public page needs, in one call, and only for a passport that is switched on.
-- security definer so it can read events and learner_state past their row-level security, which is why it
-- returns a fixed, small shape: never email, never drafts, never the onboarding answers beyond the name.
create function public_passport(p_handle text) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'userId',        p.user_id,
    'handle',        p.handle,
    'name',          coalesce(p.display_name, s.profile->'answers'->>'name', p.handle),
    'headline',      p.headline,
    'openToWork',    p.open_to_work,
    'since',         p.created_at,
    'longestStreak', coalesce((s.progress->'streak'->>'longest')::int, 0),
    'events', coalesce((
      select jsonb_agg(jsonb_build_object('kind', e.kind, 'ref', e.ref, 'at', e.at, 'data', e.data) order by e.at)
      from events e where e.user_id = p.user_id and e.kind <> 'signin'
    ), '[]'::jsonb)
  )
  from passports p left join learner_state s on s.user_id = p.user_id
  where p.handle = lower(p_handle) and p.is_public
$$;

-- Whether a handle is free, without revealing whose it is or whether that passport is public.
create function handle_available(p_handle text) returns boolean
language sql stable security definer set search_path = public as $$
  select not exists (select 1 from passports where handle = lower(p_handle) and user_id is distinct from auth.uid())
$$;

revoke all on function public_passport(text) from public;
revoke all on function handle_available(text) from public;
grant execute on function public_passport(text) to anon, authenticated;
grant execute on function handle_available(text) to authenticated;
