import { isIndexable } from "@/lib/indexing";
import type { Metadata } from "next";
import { SITE_SEO, type ConstructMetadataOptions } from "@/constant/seo";
import { selected_works, works } from "@/constant/projects";
import { localePath } from "@/i18n/routing";

/**
 * Constructs a fully compliant Next.js Metadata object with centralized SEO fallbacks.
 */
const LOCALE_TO_OG: Record<string, string> = {
  "pt-br": "pt_BR",
  en: "en_US",
};

/**
 * Search engines are allowed in only when this is a production deploy AND
 * ALLOW_INDEXING is explicitly "true". Keeps the *.vercel.app URL out of Google
 * until the real domain is wired up.
 */

export function constructMetadata({
  title,
  useTitleTemplate = false,
  description,
  keywords,
  locale = "pt-br",
  path = "",
  type = "website",
  publishedTime,
  authors,
  noIndex = false,
}: ConstructMetadataOptions = {}): Metadata {
  const metaTitle = title ? title : SITE_SEO.siteTitle;
  const metaDescription = description || SITE_SEO.defaultDescription;
  const metaKeywords = keywords?.length
    ? keywords
    : Array.from(SITE_SEO.defaultKeywords);

  const abs = (p: string) =>
    p === "/" ? SITE_SEO.siteUrl : `${SITE_SEO.siteUrl}${p}`;
  const canonicalUrl = abs(localePath(locale, path));
  const languages: Record<string, string> = {
    "pt-BR": abs(localePath("pt-br", path)),
    "en-US": abs(localePath("en", path)),
    "x-default": abs(localePath("pt-br", path)),
  };

  return {
    title: useTitleTemplate
      ? { default: metaTitle, template: SITE_SEO.titleTemplate }
      : metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    authors: authors || [
      { name: SITE_SEO.author.name, url: SITE_SEO.author.url },
    ],
    creator: SITE_SEO.creator,
    publisher: SITE_SEO.publisher,
    metadataBase: new URL(SITE_SEO.siteUrl),
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: SITE_SEO.siteName,
      locale: LOCALE_TO_OG[locale] ?? SITE_SEO.locale,
      type,
      ...(publishedTime && { publishedTime }),
      images: [
        { url: "/opengraph-image", width: 1200, height: 630, alt: metaTitle },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      creator: SITE_SEO.twitterHandle,
      images: ["/opengraph-image"],
    },
    robots:
      noIndex || !isIndexable()
        ? { index: false, follow: false }
        : SITE_SEO.robotsDefault,
  };
}

/**
 * JSON-LD Schema Generator for Person / Profile
 */
export function generatePersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_SEO.author.name,
    url: SITE_SEO.siteUrl,
    email: SITE_SEO.author.email,
    jobTitle: "Full-Stack Developer",
    sameAs: Array.from(SITE_SEO.socialLinks),
  };
}

/**
 * JSON-LD Schema Generator for WebSite
 */
export function generateWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_SEO.siteName,
    url: SITE_SEO.siteUrl,
    description: SITE_SEO.defaultDescription,
    author: {
      "@type": "Person",
      name: SITE_SEO.author.name,
    },
    publisher: {
      "@type": "Person",
      name: SITE_SEO.author.name,
    },
    hasPart: [
      {
        "@type": "WebPage",
        name: "Projects & Selected Works",
        url: `${SITE_SEO.siteUrl}/projects`,
      },
      {
        "@type": "WebPage",
        name: "Resume & Curriculum Vitae",
        url: `${SITE_SEO.siteUrl}/resume`,
      },
    ],
  };
}

/**
 * JSON-LD Schema Generator for Site Navigation (Google Sitelinks)
 */
export function generateSiteNavigationJsonLd() {
  const baseUrl = SITE_SEO.siteUrl;

  const siteLinks = [
    {
      name: "Projects & Selected Works",
      description: `Web applications, experiments, and open-source GitHub repositories created by ${SITE_SEO.author.name}.`,
      url: `${baseUrl}/projects`,
    },
    {
      name: "Resume & Curriculum Vitae",
      description: `Request the resume of ${SITE_SEO.author.name}, delivered by email as a PDF.`,
      url: `${baseUrl}/resume`,
    },
  ];

  return siteLinks.map((item, index) => ({
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    position: index + 1,
    name: item.name,
    description: item.description,
    url: item.url,
  }));
}

/**
 * JSON-LD Schema Generator for Organization (Homepage)
 */
export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_SEO.siteName,
    url: SITE_SEO.siteUrl,
    logo: `${SITE_SEO.siteUrl}/apple-icon`,
    sameAs: Array.from(SITE_SEO.socialLinks),
  };
}

/**
 * JSON-LD Schema Generator for BreadcrumbList (Nested Pages)
 */
export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${SITE_SEO.siteUrl}${item.url}`,
    })),
  };
}

/**
 * JSON-LD Schema Generator for ProfilePage (Resume)
 */
export function generateProfilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `Resume & CV of ${SITE_SEO.author.name}`,
    url: `${SITE_SEO.siteUrl}/resume`,
    mainEntity: generatePersonJsonLd(),
  };
}

/**
 * JSON-LD Schema Generator for Projects ItemList
 */
export function generateProjectsItemListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects & Selected Works",
    description:
      "Full-stack web applications, AI tools, and open-source GitHub repositories.",
    url: `${SITE_SEO.siteUrl}/projects`,
    mainEntity: {
      "@type": "ItemList",
      name: "Portfolio Projects",
      itemListElement: [...selected_works, ...works].map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.name,
        ...(project.links.live || project.links.github
          ? { url: project.links.live || project.links.github }
          : {}),
      })),
    },
  };
}
