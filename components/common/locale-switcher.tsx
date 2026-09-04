"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { Globe } from "lucide-react";

import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const LABELS: Record<Locale, string> = {
  "pt-br": "PT",
  en: "EN",
};

export const LocaleSwitcher = ({ className }: { className?: string }) => {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const nextLocale =
    routing.locales[(routing.locales.indexOf(locale) + 1) % routing.locales.length];

  const switchTo = () => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- pathname params are compatible with the current route
        { pathname, params },
        { locale: nextLocale },
      );
    });
  };

  return (
    <button
      type="button"
      onClick={switchTo}
      disabled={isPending}
      aria-label={`Switch language to ${LABELS[nextLocale]}`}
      className={cn(
        "relative flex h-9 items-center gap-1.5 rounded-xl border border-primary/20 bg-glass-bg px-2.5 text-xs font-medium tracking-wide text-foreground shadow-md backdrop-blur-md transition-all duration-200 hover:border-accent/40 hover:text-accent cursor-pointer",
        className,
      )}
    >
      <Globe className="h-3.5 w-3.5" />
      <span>{LABELS[locale]}</span>
    </button>
  );
};
