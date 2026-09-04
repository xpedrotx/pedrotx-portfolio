import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt-br", "en"],
  defaultLocale: "pt-br",
  // Portuguese lives at the root ("/"); English is prefixed ("/en").
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

/** Maps our URL locale segment to a proper BCP-47 tag for <html lang>. */
export const htmlLang: Record<Locale, string> = {
  "pt-br": "pt-BR",
  en: "en-US",
};

/** OpenGraph locale strings. */
export const ogLocale: Record<Locale, string> = {
  "pt-br": "pt_BR",
  en: "en_US",
};

/**
 * Path for a locale under the `as-needed` strategy:
 * default locale has no prefix, others do.
 */
export function localePath(locale: string, path = ""): string {
  const clean = path === "/" ? "" : path;
  if (locale === routing.defaultLocale) return clean || "/";
  return `/${locale}${clean}`;
}
