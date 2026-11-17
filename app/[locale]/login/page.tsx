import { getTranslations, setRequestLocale } from "next-intl/server";
import { sendLoginLink } from "./actions";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { locale } = await params;
  const { sent, error } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("Login");

  return (
    <main className="hero">
      <h1>{t("title")}</h1>
      <p className="lead">{t("lead")}</p>
      <form action={sendLoginLink.bind(null, locale)} className="card">
        <label htmlFor="email">
          {t("email")}
          <input id="email" name="email" type="email" required autoComplete="email" defaultValue={sent ?? ""} />
        </label>
        <button type="submit" className="btn">{t("send")}</button>
        {sent && <p className="notice" role="status">{t("sent", { email: sent })}</p>}
        {error === "send" && <p className="notice error" role="alert">{t("error")}</p>}
        {error === "callback" && <p className="notice error" role="alert">{t("callbackError")}</p>}
      </form>
    </main>
  );
}
