import { isIndexable } from "@/lib/indexing";
import type { MetadataRoute } from "next";
import { SITE_SEO } from "@/constant/seo";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${SITE_SEO.siteUrl}/sitemap.xml`,
    host: SITE_SEO.siteUrl,
  };
}
