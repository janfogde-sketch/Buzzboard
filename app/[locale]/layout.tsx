import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = { title: { default: "Buzzboard", template: "%s · Buzzboard" } };

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("Common");

  return (
    <html lang={locale}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;700&display=swap"
        />
      </head>
      <body>
        <NextIntlClientProvider>
          <div className="shell">
            <header className="topbar">
              <Link href="/" className="brand">{t("appName")}</Link>
              <nav className="lang" aria-label={t("language")}>
                {routing.locales.map((l) => (
                  <Link key={l} href="/" locale={l} aria-current={l === locale ? "true" : undefined}>
                    {l.toUpperCase()}
                  </Link>
                ))}
              </nav>
            </header>
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
