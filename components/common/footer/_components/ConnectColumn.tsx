"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { mono } from "@/app/fonts";
import { cn } from "@/lib/utils";

export const ConnectColumn = () => {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <div className="w-full flex flex-col justify-between space-y-4">
      <div>
        <span
          className={cn(
            mono.className,
            "text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-3 block",
          )}
        >
          {t("connect")} ✦
        </span>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t("connectText")}
        </p>
      </div>
      <div>
        <Link
          href="/#contact"
          className={cn(
            mono.className,
            "text-xs font-medium uppercase tracking-wider text-foreground hover:underline inline-block pt-2",
          )}
        >
          {tNav("contact")}
        </Link>
      </div>
    </div>
  );
};
