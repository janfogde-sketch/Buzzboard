# Buzzboard

Jeopardy til fester, firmaarrangementer og quizaftener. Værten styrer spillet, storskærmen viser brættet, og holdene buzzer fra telefonen. Kun en browser.

Next.js (App Router), Supabase (auth, database, realtime) og Vercel. Dansk og engelsk med next-intl.

## Kom i gang

1. `cp .env.example .env.local` og udfyld Supabase-URL og anon-nøgle (aldrig i Git).
2. Kør `supabase/migrations/0001_profiles.sql` i Supabase SQL Editor.
3. I Supabase: Authentication → URL Configuration, tilføj `http://localhost:3000/auth/callback` (og produktions-URL'en) som redirect-URL.
4. `npm install` og `npm run dev`.

## Struktur

- `app/[locale]/` sider (forside, login, dashboard)
- `app/auth/callback/` bytter login-linket til en session
- `proxy.ts` sprog-routing og fornyelse af session
- `messages/` tekster på dansk og engelsk
- `supabase/migrations/` databasen, ét trin ad gangen

Planen og byggetrinene står i projektets plan-side.
