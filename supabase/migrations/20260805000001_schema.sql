-- ============================================================================
-- Schéma initial — plateforme de théorie plongée
-- Contenu pédagogique : lecture publique. Données utilisateur : RLS stricte.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Profils
-- ----------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  target_level text check (target_level in ('n1', 'n2', 'n3', 'n4', 'mf1')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid () = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid () = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid () = id) with check (auth.uid () = id);

-- Création automatique du profil à l'inscription
create function public.handle_new_user () returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user ();

-- ----------------------------------------------------------------------------
-- Contenu pédagogique (référence, lecture publique — la vérité vit dans content/)
-- ----------------------------------------------------------------------------
create table public.levels (
  slug text primary key,
  title text not null,
  subtitle text not null,
  description text not null,
  sort_order int not null
);

create table public.modules (
  slug text primary key,
  level_slug text not null references public.levels (slug),
  domain text not null,
  title text not null,
  description text not null,
  sort_order int not null,
  duration_minutes int not null,
  prerequisites text[] not null default '{}'
);

create table public.sections (
  id bigint generated always as identity primary key,
  module_slug text not null references public.modules (slug) on delete cascade,
  anchor text not null,
  title text not null,
  sort_order int not null,
  unique (module_slug, anchor)
);

create table public.questions (
  id text primary key,
  module_slug text not null references public.modules (slug) on delete cascade,
  level_slug text not null references public.levels (slug),
  domain text not null,
  question_type text not null check (question_type in ('qcm', 'calcul', 'vrai-faux')),
  section_anchor text not null,
  prompt text not null,
  explanation text not null,
  difficulty int not null check (difficulty between 1 and 3)
);

create table public.question_options (
  id bigint generated always as identity primary key,
  question_id text not null references public.questions (id) on delete cascade,
  option_id text not null,
  option_text text not null,
  is_correct boolean not null default false,
  unique (question_id, option_id)
);

alter table public.levels enable row level security;
alter table public.modules enable row level security;
alter table public.sections enable row level security;
alter table public.questions enable row level security;
alter table public.question_options enable row level security;

create policy "levels_public_read" on public.levels for select using (true);
create policy "modules_public_read" on public.modules for select using (true);
create policy "sections_public_read" on public.sections for select using (true);
create policy "questions_public_read" on public.questions for select using (true);
create policy "question_options_public_read" on public.question_options for select using (true);

-- ----------------------------------------------------------------------------
-- Progression utilisateur
-- ----------------------------------------------------------------------------
create table public.user_progress (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  module_slug text not null,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed')),
  percent int not null default 0 check (percent between 0 and 100),
  last_anchor text,
  best_validation_score int check (best_validation_score between 0 and 100),
  updated_at timestamptz not null default now(),
  unique (user_id, module_slug)
);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('entrainement', 'validation', 'examen', 'revision')),
  level_slug text not null,
  module_slug text,
  score int not null default 0,
  max_score int not null default 0,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create table public.quiz_answers (
  id bigint generated always as identity primary key,
  attempt_id uuid not null references public.quiz_attempts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id text not null,
  selected_option_ids text[] not null default '{}',
  is_correct boolean not null,
  time_seconds int not null default 0
);

create table public.srs_cards (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id text not null,
  level_slug text not null,
  domain text not null,
  module_slug text not null,
  easiness real not null default 2.5,
  interval_days int not null default 0,
  repetitions int not null default 0,
  lapses int not null default 0,
  due_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, question_id)
);

create table public.exam_sessions (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references auth.users (id) on delete cascade,
  level_slug text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  duration_minutes int not null,
  score int not null default 0,
  max_score int not null default 0,
  passed boolean not null default false,
  by_domain jsonb not null default '[]',
  answers jsonb not null default '[]'
);

create table public.bookmarks (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references auth.users (id) on delete cascade,
  module_slug text not null,
  anchor text not null,
  title text not null,
  created_at timestamptz not null default now(),
  unique (user_id, module_slug, anchor)
);

create table public.notes (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references auth.users (id) on delete cascade,
  module_slug text not null,
  anchor text not null,
  content text not null,
  updated_at timestamptz not null default now(),
  unique (user_id, module_slug, anchor)
);

-- RLS : chaque utilisateur ne lit et n'écrit que ses propres lignes
alter table public.user_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.quiz_answers enable row level security;
alter table public.srs_cards enable row level security;
alter table public.exam_sessions enable row level security;
alter table public.bookmarks enable row level security;
alter table public.notes enable row level security;

create policy "user_progress_own" on public.user_progress
  for all using (auth.uid () = user_id) with check (auth.uid () = user_id);

create policy "quiz_attempts_own" on public.quiz_attempts
  for all using (auth.uid () = user_id) with check (auth.uid () = user_id);

create policy "quiz_answers_own" on public.quiz_answers
  for all using (auth.uid () = user_id) with check (auth.uid () = user_id);

create policy "srs_cards_own" on public.srs_cards
  for all using (auth.uid () = user_id) with check (auth.uid () = user_id);

create policy "exam_sessions_own" on public.exam_sessions
  for all using (auth.uid () = user_id) with check (auth.uid () = user_id);

create policy "bookmarks_own" on public.bookmarks
  for all using (auth.uid () = user_id) with check (auth.uid () = user_id);

create policy "notes_own" on public.notes
  for all using (auth.uid () = user_id) with check (auth.uid () = user_id);

-- Index utiles
create index idx_user_progress_user on public.user_progress (user_id);
create index idx_quiz_attempts_user on public.quiz_attempts (user_id, started_at desc);
create index idx_quiz_answers_attempt on public.quiz_answers (attempt_id);
create index idx_srs_cards_due on public.srs_cards (user_id, due_date);
create index idx_exam_sessions_user on public.exam_sessions (user_id, started_at desc);
create index idx_sections_module on public.sections (module_slug);
create index idx_questions_module on public.questions (module_slug);
