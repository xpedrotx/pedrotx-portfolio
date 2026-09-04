import type { MetadataRoute } from "next";
import { SITE_SEO } from "@/constant/seo";

function isIndexable(): boolean {
  const env = process.env.VERCEL_ENV;
  if (env && env !== "production") return false;
  return process.env.ALLOW_INDEXING === "true";
}

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
