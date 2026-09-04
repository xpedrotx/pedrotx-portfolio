import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_SEO } from "@/constant/seo";

// The real <html>/<body> shell lives in app/[locale]/layout.tsx so it can
// carry the active locale. This root layout only forwards children — plus a
// metadataBase so file-convention OG images always resolve to an absolute URL.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_SEO.siteUrl),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
