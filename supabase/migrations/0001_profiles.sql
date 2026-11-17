-- Trin 1: værtens profil. Oprettes automatisk ved første login.
-- Kør i Supabase SQL Editor (eller med Supabase CLI). Ændrer og sletter intet eksisterende.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  locale text not null default 'da' check (locale in ('da', 'en')),
  logo_url text,
  brand_color text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Kun ejeren kan se og rette sin egen profil.
create policy "profiles: ejer læser" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy "profiles: ejer opretter" on public.profiles
  for insert to authenticated with check (id = (select auth.uid()));
create policy "profiles: ejer retter" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- Opret profilrække automatisk, når en ny bruger logger ind første gang.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
