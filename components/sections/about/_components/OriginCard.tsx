"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { BentoCard } from "./BentoCard";
import { cn } from "@/lib/utils";

type ThemedImage = { light: string; dark: string };

interface OriginCardProps {
  imageSrc: string | string[] | ThemedImage;
  activeIndex?: number;
  onSelectIndex?: (index: number) => void;
  index?: number;
}


const isThemed = (src: OriginCardProps["imageSrc"]): src is ThemedImage =>
  typeof src === "object" && !Array.isArray(src) && "light" in src;

export const OriginCard = ({
  imageSrc,
  activeIndex = 0,
  onSelectIndex,
  index = 0,
}: OriginCardProps) => {
  const themed = isThemed(imageSrc) ? imageSrc : null;
  const plainSrc: string | string[] = themed
    ? themed.light
    : (imageSrc as string | string[]);
  const images = Array.isArray(plainSrc) ? plainSrc : [plainSrc];
  const currentImgIndex = Math.min(activeIndex, images.length - 1);
  const currentImage = images[currentImgIndex] || images[0];

  return (
    <BentoCard
      gradientSeed={0}
      className="flex flex-col p-0 overflow-hidden relative min-h-72 sm:min-h-80 justify-between"
      index={index}
    >
      {/* Photo Container */}
      <div className="group relative flex-1 aspect-square w-full overflow-hidden bg-card">
        {themed ? (
          <>
            <Image
              src={themed.light}
              alt="Pedro Teixeira"
              fill
              className="object-cover object-top grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105 dark:hidden"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <Image
              src={themed.dark}
              alt="Pedro Teixeira"
              fill
              className="hidden object-cover object-top grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105 dark:block"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImgIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={currentImage}
                alt="Pedro Teixeira"
                fill
                className="object-cover object-top grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </motion.div>
          </AnimatePresence>
        )}

        {/* Subtle Scanline Overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04] z-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 4px)",
          }}
        />

        {/* Monospace Tech Corner Brackets */}
        <span className="pointer-events-none absolute top-3 left-3 z-10 font-mono text-[10px] text-accent/70">
          ┌
        </span>
        <span className="pointer-events-none absolute top-3 right-3 z-10 font-mono text-[10px] text-accent/70">
          ┐
        </span>
        <span className="pointer-events-none absolute bottom-3 left-3 z-10 font-mono text-[10px] text-accent/70">
          └
        </span>
        <span className="pointer-events-none absolute bottom-3 right-3 z-10 font-mono text-[10px] text-accent/70">
          ┘
        </span>

        {/* Image Pagination Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 px-3 py-1 rounded-full bg-card/85 backdrop-blur-md border border-card-border">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => onSelectIndex?.(i)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300 focus:outline-none",
                  i === currentImgIndex
                    ? "bg-accent scale-125 shadow-sm"
                    : "bg-muted-foreground/50 hover:bg-muted-foreground/70 cursor-pointer",
                )}
                title={`Image ${i + 1} of ${images.length}`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </BentoCard>
  );
};
