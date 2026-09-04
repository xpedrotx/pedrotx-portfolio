"use client";

import { useTranslations } from "next-intl";

import { mono } from "@/app/fonts";
import { profile } from "@/constant";
import { cn } from "@/lib/utils";
import { useConsent } from "@/components/analytics/consent-context";

export const CopyrightBar = () => {
  const currentYear = new Date().getFullYear();
  const { reset } = useConsent();
  const t = useTranslations("consent");

  return (
    <div className="mt-4 rounded-md border border-border/60 bg-card/30 px-4 py-3 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
      <span className={cn(mono.className, "text-[11px] sm:text-xs text-muted-foreground")}>
        © {currentYear} {profile.name.brand.toUpperCase()}
      </span>
      <div className={cn(mono.className, "flex items-center gap-4 text-[11px] sm:text-xs text-muted-foreground")}>
        <button
          onClick={reset}
          className="hover:text-foreground hover:underline transition-colors uppercase cursor-pointer"
        >
          {t("title")}
        </button>
      </div>
    </div>
  );
};
