"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

/** Platane/snk contribution-eating snake, generated daily in the profile repo. */
export const SnakeAnimation = () => {
  const [failed, setFailed] = useState(false);
  const t = useTranslations("about.codingStats");
  const label = t("contributionsLabel");

  if (failed) return null;

  return (
    <div className="mt-3 flex flex-col items-center gap-2">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
        {label}
      </span>
      {/* Animated SVG proxied from the profile repo; next/image would strip the animation. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/api/snake"
        alt={label}
        loading="lazy"
        onError={() => setFailed(true)}
        className="mx-auto w-full max-w-xl opacity-90"
      />
    </div>
  );
};
