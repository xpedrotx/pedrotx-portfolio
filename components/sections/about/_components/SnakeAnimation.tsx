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
    <div className="mt-1">
      <span className="block font-mono text-[10px] uppercase text-muted-foreground font-semibold">
        {label}
      </span>
      {/* Animated SVG proxied from the profile repo; next/image would strip the animation. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/api/snake"
        alt={label}
        loading="lazy"
        onError={() => setFailed(true)}
        className="mt-1.5 w-full max-w-md opacity-90"
      />
    </div>
  );
};
