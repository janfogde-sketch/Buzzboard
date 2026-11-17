import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intl = createIntlMiddleware(routing);

// Sprog-routing først, derefter fornyes Supabase-sessionen på det samme svar.
export async function proxy(request: NextRequest) {
  const response = intl(request);

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (list) => list.forEach(({ name, value, options }) => response.cookies.set(name, value, options)),
        },
      },
    );
    await supabase.auth.getUser();
  }
  return response;
}

export const config = {
  matcher: ["/((?!api|auth|_next|_vercel|.*\\..*).*)"],
};
