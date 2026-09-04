"use client";

import { FaArrowUp } from "react-icons/fa6";
import { serif } from "@/app/fonts";
import { profile } from "@/constant";
import { cn } from "@/lib/utils";

export const FirstName = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Scroll to Top icon in the top-left corner */}
      <div className="flex justify-start pt-1">
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="p-2.5 rounded-lg border border-border/70 hover:border-primary/80 text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer bg-card/40 hover:bg-card/80"
        >
          <FaArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>

      <span
        className={cn(
          serif.className,
          "block text-foreground font-medium leading-[0.85] tracking-tight",
          "text-[clamp(3rem,9vw,7rem)]",
        )}
      >
        {profile.name.first}
      </span>
    </div>
  );
};
