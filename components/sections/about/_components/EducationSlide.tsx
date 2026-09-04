"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { profile } from "@/constant";

export const EducationSlide = () => {
  const t = useTranslations("about");
  return (
    <motion.div
      key="slide-1"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-2.5"
    >
      <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">
        {"// "}
        {t("eduKicker")}
      </span>
      <h3 className="font-heading text-lg sm:text-xl font-bold text-primary leading-snug">
        {profile.education.uni}
      </h3>
      <p className="font-mono text-xs sm:text-sm text-muted-foreground font-medium">
        {t("education.degree")}
      </p>
      <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground pt-1">
        <span className="px-2 py-0.5 rounded-md bg-muted border border-card-border text-accent">
          {t("education.batchLabel")}: {t("education.batch")}
        </span>
        <span>•</span>
        <span>
          {profile.education.location.city}, {profile.education.location.state}
        </span>
      </div>
    </motion.div>
  );
};
