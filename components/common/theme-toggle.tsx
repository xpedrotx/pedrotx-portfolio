"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

export const ThemeToggle = ({ className }: { className?: string }) => {
  const t = useTranslations("theme");
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={t("toggle")}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-glass-bg text-foreground shadow-md backdrop-blur-md transition-all duration-200 hover:border-accent/40 hover:text-accent cursor-pointer",
        className,
      )}
    >
      {mounted ? (
        isDark ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )
      ) : (
        <span className="h-4 w-4" />
      )}
    </button>
  );
};
