import type { Metadata } from "next";
import ResumeClient from "./_components/ResumeClient";
import {
  constructMetadata,
  generateProfilePageJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo";
import { PAGE_SEO } from "@/constant/seo";

const TITLE: Record<string, string> = { "pt-br": "Currículo", en: "Resume" };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return constructMetadata({
    ...PAGE_SEO.resume,
    title: TITLE[locale] ?? TITLE["pt-br"],
    locale,
  });
}

export default function ResumePage() {
  const profileJsonLd = generateProfilePageJsonLd();
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Resume", url: "/resume" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([profileJsonLd, breadcrumbJsonLd]),
        }}
      />
      <ResumeClient />
    </>
  );
}

