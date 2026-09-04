"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

// WebGL shader — heavy, so it's client-only and only mounted once the page
// is idle. A CSS gradient stands in until then (and forever, for reduced-motion).
const GradientBackground = dynamic(
  () => import("./GradientBg").then((m) => m.GradientBackground),
  { ssr: false },
);

export const Background = () => {
  const reduceMotion = useReducedMotion();
  const [showShader, setShowShader] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;

    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    let id: number;
    if (typeof w.requestIdleCallback === "function") {
      id = w.requestIdleCallback(() => setShowShader(true), { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }
    id = window.setTimeout(() => setShowShader(true), 1200);
    return () => clearTimeout(id);
  }, [reduceMotion]);

  return (
    <div className="fixed inset-0 -z-50 h-full w-full overflow-hidden pointer-events-none">
      {/* Immediate, cheap fallback */}
      <div
        aria-hidden
        className="absolute inset-0 bg-background"
        style={{
          backgroundImage:
            "radial-gradient(60% 55% at 15% 10%, var(--accent) 0%, transparent 55%), radial-gradient(55% 50% at 90% 85%, var(--accent) 0%, transparent 55%)",
          opacity: 0.1,
        }}
      />
      {showShader && <GradientBackground />}
    </div>
  );
};
