import type { Metadata } from "next";
import ProjectsClient from "./_components/ProjectsClient";
import {
  constructMetadata,
  generateProjectsItemListJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo";
import { PAGE_SEO } from "@/constant/seo";

const TITLE: Record<string, string> = { "pt-br": "Projetos", en: "Projects" };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return constructMetadata({
    ...PAGE_SEO.projects,
    title: TITLE[locale] ?? TITLE["pt-br"],
    locale,
  });
}

export default function ProjectsPage() {
  const projectsJsonLd = generateProjectsItemListJsonLd();
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Projects", url: "/projects" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([projectsJsonLd, breadcrumbJsonLd]),
        }}
      />
      <ProjectsClient />
    </>
  );
}

