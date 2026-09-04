"use client";

import { serif } from "@/app/fonts";
import { profile } from "@/constant";
import { cn } from "@/lib/utils";

export const LastName = () => {
  return (
    <div className="w-full my-2 overflow-hidden">
      <span
        className={cn(
          serif.className,
          "block w-full text-foreground font-medium leading-[0.8] tracking-tight",
          "text-[clamp(3.5rem,17vw,13rem)]",
        )}
      >
        {profile.name.last}
      </span>
    </div>
  );
};
