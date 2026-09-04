"use client";

import { profile } from "@/constant";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

interface QuoteSlideProps {
  quote: string;
}

export const QuoteSlide = ({ quote }: QuoteSlideProps) => {
  const t = useTranslations("about");
  return (
    <motion.div
      key="slide-3"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col justify-center gap-3 py-2"
    >
      <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">
        {"// "}
        {t("quoteKicker")}
      </span>
      <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-primary italic leading-tight">
        &ldquo;{quote}&rdquo;
      </blockquote>

      <span className="font-mono text-xs text-muted-foreground self-end font-medium">
        — {profile.name.full}
      </span>
    </motion.div>
  );
};
