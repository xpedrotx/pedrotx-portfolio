"use client";

import { useTranslations } from "next-intl";

import { mono } from "@/app/fonts";
import { Link } from "@/i18n/navigation";
import { profile } from "@/constant";
import { SITE_LAUNCH_YEAR } from "@/constant/seo";
import { cn } from "@/lib/utils";
import { CONSENT_REQUIRED, useConsent } from "@/components/analytics/consent-context";

export const CopyrightBar = () => {
  const currentYear = new Date().getFullYear();
  const yearRange =
    currentYear > SITE_LAUNCH_YEAR
      ? `${SITE_LAUNCH_YEAR}-${currentYear}`
      : `${currentYear}`;

  const { reset } = useConsent();
  const t = useTranslations("consent");
  const tLegal = useTranslations("legal");

  return (
    <div className="mt-4 rounded-md border border-border/60 bg-card/30 px-4 py-3 sm:px-6 flex flex-col items-center gap-1.5 text-center">
      <span className={cn(mono.className, "text-[11px] sm:text-xs text-muted-foreground")}>
        © {yearRange} {profile.name.brand.toUpperCase()}. {tLegal("rights")}
      </span>
      <div className={cn(mono.className, "flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-muted-foreground")}>
        <Link href="/terms" className="hover:text-foreground hover:underline transition-colors">
          {tLegal("terms.title")}
        </Link>
        <span>|</span>
        <Link href="/privacy" className="hover:text-foreground hover:underline transition-colors">
          {tLegal("privacy.title")}
        </Link>
        {CONSENT_REQUIRED && (
          <>
            <span>|</span>
            <button
              onClick={reset}
              className="hover:text-foreground hover:underline transition-colors uppercase cursor-pointer"
            >
              {t("title")}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
