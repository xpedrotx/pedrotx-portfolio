"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { mono } from "@/app/fonts";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { key: "home", href: "/#hero" },
  { key: "about", href: "/#about" },
  { key: "work", href: "/#work" },
  { key: "experience", href: "/#experience" },
  { key: "contact", href: "/#contact" },
] as const;

export const NavigationColumn = () => {
  const t = useTranslations("nav");
  const tFooter = useTranslations("footer");

  return (
    <div className="w-full flex flex-col justify-start space-y-3">
      <span
        className={cn(
          mono.className,
          "text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-1",
        )}
      >
        {tFooter("navigation")}
      </span>
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className="hover:text-foreground hover:underline transition-colors uppercase"
          >
            {t(item.key)}
          </Link>
        ))}
      </div>
    </div>
  );
};
