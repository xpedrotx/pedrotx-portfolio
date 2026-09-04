import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { constructMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";
import { PAGE_SEO } from "@/constant/seo";

const TITLE: Record<string, string> = {
  "pt-br": "Política de Privacidade",
  en: "Privacy Policy",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return constructMetadata({
    ...PAGE_SEO.privacy,
    title: TITLE[locale] ?? TITLE["pt-br"],
    locale,
  });
}

export default function PrivacyPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Privacy Policy", url: "/privacy" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <LegalPage namespace="legal.privacy" />
    </>
  );
}
