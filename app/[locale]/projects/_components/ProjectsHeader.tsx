"use client";

import React from "react";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { SectionHeader } from "@/components/common";

export const ProjectsHeader: React.FC = () => {
  const t = useTranslations("projects.page");
  const tSection = useTranslations("sections.work");
  const tResume = useTranslations("resume");
  return (
    <header className="space-y-6">
      {/* Top Navigation Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-accent transition-colors group px-3.5 py-2 rounded-xl border border-card-border bg-card/85 backdrop-blur-xl hover:border-card-border-hover"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>{tResume("back")}</span>
        </Link>
      </motion.div>

      <div className="pt-4">
        <SectionHeader
          number={tSection("number")}
          title={tSection("title")}
          align="left"
        />
        <p className="text-xs sm:text-sm font-mono text-muted-foreground max-w-2xl leading-relaxed -mt-10">
          {t("subtitle")}
        </p>
      </div>
    </header>
  );
};
