import type { MetadataRoute } from "next";
import { SITE_SEO } from "@/constant/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_SEO.siteTitle,
    short_name: "pedrotx",
    description: SITE_SEO.defaultDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: SITE_SEO.themeColor,
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
