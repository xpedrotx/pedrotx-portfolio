"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { GrainGradient } from "@paper-design/shaders-react";

const PALETTE = {
  dark: {
    colorBack: "hsl(0, 0%, 0%)",
    colors: ["hsl(0, 84%, 42%)", "hsl(0, 72%, 28%)", "hsl(12, 80%, 22%)"],
    intensity: 0.28,
    softness: 0.5,
  },
  light: {
    colorBack: "hsl(210, 40%, 99%)",
    colors: ["hsl(217, 90%, 86%)", "hsl(206, 95%, 92%)", "hsl(224, 80%, 90%)"],
    intensity: 0.16,
    softness: 0.72,
  },
} as const;

export function GradientBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const palette =
    mounted && resolvedTheme === "light" ? PALETTE.light : PALETTE.dark;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <GrainGradient
        style={{ height: "100%", width: "100%" }}
        colorBack={palette.colorBack}
        softness={palette.softness}
        intensity={palette.intensity}
        noise={0}
        shape="corners"
        offsetX={0}
        offsetY={0}
        scale={1}
        rotation={0}
        speed={1}
        colors={[...palette.colors]}
      />
    </div>
  );
}
