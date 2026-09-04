"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/common";

import { StatementCard, type SlideItem } from "./_components/StatementCard";
import { OriginCard } from "./_components/OriginCard";
import { EducationSlide } from "./_components/EducationSlide";
import { CodingStatsSlide } from "./_components/CodingStatsSlide";
import { QuoteSlide } from "./_components/QuoteSlide";

interface AboutSectionProps {
  slides?: SlideItem[];
  imageSrc?: string | string[] | { light: string; dark: string };
}

export const AboutSection = ({
  slides,
  imageSrc = { light: "/images/avatarwhite.svg", dark: "/images/avatardark.svg" },
}: AboutSectionProps) => {
  const t = useTranslations("about");
  const tSection = useTranslations("sections.about");

  const resolvedSlides: SlideItem[] = slides ?? [
    t("brief"),
    <EducationSlide key="edu" />,
    <CodingStatsSlide key="stats" />,
    <QuoteSlide key="quote" quote={t("quote")} />,
  ];

  const slideLabels = [
    t("slideLabels.brief"),
    t("slideLabels.edu"),
    t("slideLabels.stats"),
    t("slideLabels.quote"),
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const totalItems = resolvedSlides.length;

  // Gentle auto-advance; pauses while the visitor is interacting with the card.
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalItems);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, totalItems]);

  return (
    <section
      id="about"
      className="relative w-full px-6 py-24 md:px-12 lg:px-20"
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="mx-auto w-full max-w-5xl"
      >
        <SectionHeader
          number={tSection("number")}
          title={tSection("title")}
          align="left"
        />

        {/* Bento Grid — Statement & Origin */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3 items-stretch">
          <StatementCard
            slides={resolvedSlides}
            slideLabels={slideLabels}
            activeIndex={activeIndex}
            onSelectIndex={setActiveIndex}
            index={0}
          />
          <OriginCard
            imageSrc={imageSrc}
            activeIndex={activeIndex}
            onSelectIndex={setActiveIndex}
            index={1}
          />
        </div>
      </div>
    </section>
  );
};
