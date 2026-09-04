import type { Metadata } from "next";
import { Fragment } from "react";
import { setRequestLocale } from "next-intl/server";

import { Footer, Navbar } from "@/components/common";
import {
  HeroSection,
  AboutSection,
  SkillsSection,
  JourneySection,
  WorkSection,
  ContactSection,
} from "@/components/sections";
import { constructMetadata } from "@/lib/seo";
import { PAGE_SEO } from "@/constant/seo";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const HOME_TITLE: Record<string, string> = {
  "pt-br": "PEDROTX | Desenvolvedor Full Stack",
  en: "PEDROTX | Full-Stack Developer",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    ...constructMetadata({ ...PAGE_SEO.home, locale, path: "" }),
    title: { absolute: HOME_TITLE[locale] ?? HOME_TITLE["pt-br"] },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Fragment>
      <div className="min-h-screen flex flex-col relative">
        <Navbar />
        <main>
          <HeroSection />
          <div className="relative z-10 bg-background/70 backdrop-blur-sm">
            <AboutSection />
            <SkillsSection />
            <JourneySection />
            <WorkSection />
            <ContactSection />
          </div>
        </main>
        <Footer />
      </div>
    </Fragment>
  );
}
