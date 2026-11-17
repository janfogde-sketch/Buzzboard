import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "../login/actions";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return redirect({ href: "/login", locale });

  const t = await getTranslations("Dashboard");
  const common = await getTranslations("Common");

  return (
    <main className="hero">
      <h1>{t("title")}</h1>
      <p className="lead">{t("welcome", { email: data.user.email ?? "" })}</p>
      <p>{t("empty")}</p>
      <form action={signOut.bind(null, locale)}>
        <button type="submit" className="btn ghost">{common("signOut")}</button>
      </form>
    </main>
  );
}
