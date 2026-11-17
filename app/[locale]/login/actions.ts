"use server";

import { headers } from "next/headers";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

export async function sendLoginLink(locale: string, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return redirect({ href: "/login?error=send", locale });

  const origin = (await headers()).get("origin") ?? "";
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback?locale=${locale}` },
  });
  if (error) return redirect({ href: "/login?error=send", locale });
  return redirect({ href: `/login?sent=${encodeURIComponent(email)}`, locale });
}

export async function signOut(locale: string) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect({ href: "/", locale });
}
