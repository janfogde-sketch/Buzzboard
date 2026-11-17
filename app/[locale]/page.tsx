import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  return (
    <main className="hero">
      <h1>{t("title")}</h1>
      <p className="lead">{t("lead")}</p>
      <div>
        <Link href="/dashboard" className="btn">{t("cta")}</Link>
      </div>
    </main>
  );
}
