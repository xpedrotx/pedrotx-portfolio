"use client";

import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/common";
import { experience } from "@/constant";
import { ExperienceList } from "./_components/ExperienceList";

export const ExperienceSection = () => {
  const t = useTranslations("sections.experience");
  const tExp = useTranslations("experience");

  return (
    <section
      id="experience"
      className="relative w-full px-6 py-28 md:px-12 lg:px-20 overflow-hidden"
    >
      <div className="mx-auto w-full max-w-5xl relative">
        <SectionHeader number={t("number")} title={t("title")} align="left" />

        {experience.length > 0 ? (
          <ExperienceList items={experience} />
        ) : (
          <p className="mt-8 max-w-2xl rounded-2xl border border-card-border bg-muted/40 p-6 font-mono text-sm leading-relaxed text-muted-foreground">
            {tExp("empty")}
          </p>
        )}
      </div>
    </section>
  );
};
