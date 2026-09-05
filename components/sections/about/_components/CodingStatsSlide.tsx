"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useCodingStats } from "@/hooks/useCodingStats";
import { SnakeAnimation } from "./SnakeAnimation";

export const CodingStatsSlide = () => {
  const t = useTranslations("about.codingStats");
  const { github, loading } = useCodingStats();

  return (
    <motion.div
      key="slide-2"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">
          {t("title")}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          @{github?.handle || "xpedrotx"}
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-1">
          {[...Array(4)].map((_, i) => (
            <div
              key={`stat-skeleton-${i}`}
              className="h-16 rounded-xl bg-muted/80 border border-card-border animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="flex flex-col p-3 rounded-xl border border-card-border bg-muted/80 backdrop-blur-md">
            <span className="font-mono text-xl sm:text-2xl font-extrabold text-primary">
              {github?.repos ?? 0}
            </span>
            <span className="font-mono text-[10px] uppercase text-muted-foreground mt-1 font-semibold">
              {t("repos")}
            </span>
          </div>

          <div className="flex flex-col p-3 rounded-xl border border-card-border bg-muted/80 backdrop-blur-md">
            <span className="font-mono text-xl sm:text-2xl font-extrabold text-primary">
              {github?.followers ?? 0}
            </span>
            <span className="font-mono text-[10px] uppercase text-muted-foreground mt-1 font-semibold">
              {t("followers")}
            </span>
          </div>

          <div className="flex flex-col p-3 rounded-xl border border-card-border bg-muted/80 backdrop-blur-md">
            <span className="font-mono text-xl sm:text-2xl font-extrabold text-primary">
              {github?.following ?? 0}
            </span>
            <span className="font-mono text-[10px] uppercase text-muted-foreground mt-1 font-semibold">
              {t("following")}
            </span>
          </div>

          <div className="flex flex-col p-3 rounded-xl border border-card-border bg-muted/80 backdrop-blur-md">
            <span className="font-mono text-xl sm:text-2xl font-extrabold text-primary">
              {github?.gists ?? 0}
            </span>
            <span className="font-mono text-[10px] uppercase text-muted-foreground mt-1 font-semibold">
              {t("gists")}
            </span>
          </div>
        </div>
      )}

      <SnakeAnimation />
    </motion.div>
  );
};
