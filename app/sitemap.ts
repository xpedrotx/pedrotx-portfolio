import type { MetadataRoute } from "next";
import { SITE_SEO } from "@/constant/seo";
import { routing, localePath } from "@/i18n/routing";

const HREFLANG: Record<string, string> = { "pt-br": "pt-BR", en: "en-US" };

const PATHS: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "", changeFrequency: "daily", priority: 1.0 },
  { path: "/projects", changeFrequency: "weekly", priority: 0.9 },
  { path: "/resume", changeFrequency: "monthly", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_SEO.siteUrl;
  const abs = (p: string) => (p === "/" ? base : `${base}${p}`);
  const lastModified = new Date();

  const routes: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const { path, changeFrequency, priority } of PATHS) {
      routes.push({
        url: abs(localePath(locale, path)),
        lastModified,
        changeFrequency,
        priority,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [
              HREFLANG[l] ?? l,
              abs(localePath(l, path)),
            ]),
          ),
        },
      });
    }
  }

  routes.push({
    url: `${base}/llms.txt`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  });

  return routes;
}
