import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import "../globals.css";

import { cn } from "@/lib/utils";
import { routing, htmlLang, type Locale } from "@/i18n/routing";
import { main, heading, signature, mono, serif } from "@/app/fonts";
import { Background, PreLoader } from "@/components/mics";
import { SmoothScrollProvider } from "@/components/common";
import { ThemeProvider } from "@/components/common/theme-provider";
import { ConsentProvider } from "@/components/analytics/consent-context";
import { ConsentBanner } from "@/components/analytics/consent-banner";
import { SiteAnalytics } from "@/components/analytics";
import { Toaster } from "@/components/ui/sonner";
import {
  constructMetadata,
  generatePersonJsonLd,
  generateWebSiteJsonLd,
  generateSiteNavigationJsonLd,
  generateOrganizationJsonLd,
} from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return constructMetadata({ useTitleTemplate: true, locale, path: "" });
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const personJsonLd = generatePersonJsonLd();
  const websiteJsonLd = generateWebSiteJsonLd();
  const orgJsonLd = generateOrganizationJsonLd();
  const siteNavJsonLd = generateSiteNavigationJsonLd();

  return (
    <html
      lang={htmlLang[locale as Locale]}
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        main.variable,
        heading.variable,
        signature.variable,
        mono.variable,
        serif.variable,
      )}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              personJsonLd,
              websiteJsonLd,
              orgJsonLd,
              ...siteNavJsonLd,
            ]),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <ConsentProvider>
            <ThemeProvider>
              <SmoothScrollProvider>
                <PreLoader />
                <div id="app-content" className="min-h-full flex flex-col flex-1">
                  {children}
                </div>
                <Background />
                <Toaster />
                <ConsentBanner />
              </SmoothScrollProvider>
            </ThemeProvider>
            <SiteAnalytics />
          </ConsentProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
