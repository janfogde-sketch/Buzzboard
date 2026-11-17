import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";

// Login-linket fra e-mailen lander her og bytter koden til en session.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const locale = routing.locales.find((l) => l === url.searchParams.get("locale")) ?? routing.defaultLocale;
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(`${prefix}/dashboard`, url.origin));
  }
  return NextResponse.redirect(new URL(`${prefix}/login?error=callback`, url.origin));
}
