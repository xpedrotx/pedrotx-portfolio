"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useTheme } from "next-themes";
import { GrainGradient } from "@paper-design/shaders-react";

type Shape =
  | "truchet"
  | "wave"
  | "dots"
  | "corners"
  | "ripple"
  | "blob"
  | "sphere";

export interface SectionGradiendBgProps {
  /** Picks a palette variation within the current theme's accent family. */
  seed?: number;
  /** Explicit override — skips the theme palettes entirely. */
  colors?: string[];
  shape?: Shape;
  speed?: number;
  scale?: number;
  softness?: number;
  intensity?: number;
  noise?: number;
  className?: string;
}

// Accent-family palettes: red in dark, blue in light. Each entry is a subtle
// variation so a grid of cards doesn't look identical.
const PALETTES = {
  dark: [
    ["hsl(0, 84%, 55%)", "hsl(0, 72%, 36%)", "hsl(14, 80%, 42%)"],
    ["hsl(350, 78%, 54%)", "hsl(0, 70%, 38%)", "hsl(332, 62%, 40%)"],
    ["hsl(10, 85%, 55%)", "hsl(0, 74%, 40%)", "hsl(28, 78%, 46%)"],
    ["hsl(0, 78%, 50%)", "hsl(344, 68%, 42%)", "hsl(6, 82%, 48%)"],
  ],
  light: [
    ["hsl(217, 91%, 62%)", "hsl(224, 76%, 52%)", "hsl(206, 90%, 64%)"],
    ["hsl(199, 89%, 56%)", "hsl(217, 85%, 58%)", "hsl(190, 82%, 56%)"],
    ["hsl(224, 80%, 62%)", "hsl(238, 68%, 62%)", "hsl(213, 90%, 60%)"],
    ["hsl(206, 95%, 62%)", "hsl(217, 88%, 55%)", "hsl(199, 90%, 58%)"],
  ],
} as const;

const BACK = { dark: "hsl(0, 0%, 0%)", light: "hsl(210, 40%, 99%)" } as const;

export function SectionGradiendBg({
  seed = 0,
  colors,
  shape = "corners",
  speed = 1,
  scale = 1,
  softness = 0.76,
  intensity = 0.45,
  noise = 0.25,
  className,
}: SectionGradiendBgProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "100px" });
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const themeKey = mounted && resolvedTheme === "light" ? "light" : "dark";
  const palette = PALETTES[themeKey];
  const resolved = colors ?? [...palette[((seed % palette.length) + palette.length) % palette.length]];
  const colorBack = colors ? "hsl(0, 0%, 0%)" : BACK[themeKey];

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className || ""}`}
    >
      {isInView ? (
        <GrainGradient
          style={{ height: "100%", width: "100%" }}
          colorBack={colorBack}
          softness={softness}
          intensity={intensity}
          noise={noise}
          shape={shape}
          offsetX={0}
          offsetY={0}
          scale={scale}
          rotation={0}
          speed={speed}
          colors={resolved}
        />
      ) : (
        <div
          className="w-full h-full opacity-60"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${resolved[0]}, transparent 70%)`,
          }}
        />
      )}
    </div>
  );
}
