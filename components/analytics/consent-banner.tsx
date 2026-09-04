"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { CONSENT_REQUIRED, useConsent } from "./consent-context";

export const ConsentBanner = () => {
  const t = useTranslations("consent");
  const { consent, accept, decline } = useConsent();

  return (
    <AnimatePresence>
      {CONSENT_REQUIRED && consent === "unknown" && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-live="polite"
          aria-label={t("title")}
          className="fixed inset-x-3 bottom-3 z-[200] mx-auto max-w-xl rounded-2xl border border-card-border bg-popover/95 p-4 shadow-2xl backdrop-blur-md sm:inset-x-auto sm:right-4 sm:left-auto sm:p-5"
        >
          <p className="font-mono text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {t("body")}{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-primary transition-colors">
              {t("policyLink")}
            </Link>
          </p>
          <div className="mt-3 flex items-center gap-2.5">
            <button
              onClick={accept}
              className="rounded-lg bg-accent px-4 py-2 font-mono text-xs font-semibold text-accent-foreground transition-colors hover:bg-accent/90 cursor-pointer"
            >
              {t("accept")}
            </button>
            <button
              onClick={decline}
              className="rounded-lg border border-card-border px-4 py-2 font-mono text-xs font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer"
            >
              {t("decline")}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
