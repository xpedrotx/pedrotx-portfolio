"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useTranslations } from "next-intl";

import { SectionHeader } from "@/components/common";
import { journey } from "@/constant";
import { cn } from "@/lib/utils";

export const JourneySection = () => {
  const t = useTranslations("journey");
  const tSection = useTranslations("sections.journey");

  const completed = journey.filter((s) => !s.nextQuest).length;
  const total = journey.length;

  return (
    <section
      id="experience"
      className="relative w-full px-6 py-28 md:px-12 lg:px-20 overflow-hidden"
    >
      <div className="mx-auto w-full max-w-4xl">
        <SectionHeader
          number={tSection("number")}
          title={tSection("title")}
          align="left"
        />

        <div className="-mt-8 mb-10 flex flex-col gap-4">
          <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">
            {t("kicker")}
          </span>
          <p className="max-w-2xl font-mono text-sm leading-relaxed text-muted-foreground">
            {t("intro")}
          </p>

          {/* XP / progress bar */}
          <div className="mt-2 flex items-center gap-3">
            <div className="relative h-2 w-full max-w-xs overflow-hidden rounded-full border border-card-border bg-muted">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${(completed / total) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-y-0 left-0 rounded-full bg-accent"
              />
            </div>
            <span className="font-mono text-[11px] font-semibold text-muted-foreground">
              {completed}/{total} {t("xpLabel")}
            </span>
          </div>
        </div>

        <ol className="relative flex flex-col">
          {journey.map((stage, index) => (
            <JourneyStageRow
              key={stage.id}
              index={index}
              isLast={index === journey.length - 1}
              icon={stage.icon}
              year={t(`stages.${stage.id}.year`)}
              unlocked={t.raw(`stages.${stage.id}.unlocked`) as string[]}
              current={stage.current}
              nextQuest={stage.nextQuest}
              levelLabel={t("levelLabel")}
              youAreHere={t("youAreHere")}
              unlockedLabel={t("unlockedLabel")}
              nextQuestLabel={t("nextQuestLabel")}
              title={t(`stages.${stage.id}.title`)}
              description={t(`stages.${stage.id}.description`)}
            />
          ))}
        </ol>
      </div>
    </section>
  );
};

interface JourneyStageRowProps {
  index: number;
  isLast: boolean;
  icon: React.ComponentType<{ className?: string }>;
  year: string;
  unlocked: string[];
  current?: boolean;
  nextQuest?: boolean;
  levelLabel: string;
  youAreHere: string;
  unlockedLabel: string;
  nextQuestLabel: string;
  title: string;
  description: string;
}

const JourneyStageRow = ({
  index,
  isLast,
  icon: Icon,
  year,
  unlocked,
  current,
  nextQuest,
  levelLabel,
  youAreHere,
  unlockedLabel,
  nextQuestLabel,
  title,
  description,
}: JourneyStageRowProps) => {
  const ref = useRef<HTMLLIElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <li ref={ref} className="relative flex gap-4 sm:gap-6">
      {/* Rail + node */}
      <div className="relative flex w-10 shrink-0 flex-col items-center sm:w-12">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "relative z-10 flex h-10 w-10 items-center justify-center rounded-xl border sm:h-12 sm:w-12",
            nextQuest
              ? "border-dashed border-card-border-hover bg-muted text-muted-foreground"
              : current
                ? "border-accent bg-accent/15 text-accent shadow-lg shadow-accent/20"
                : "border-card-border bg-card text-primary",
          )}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          {current && (
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
            </span>
          )}
        </motion.div>

        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.08 + 0.15 }}
            style={{ transformOrigin: "top" }}
            className={cn(
              "w-px flex-1",
              nextQuest || journeyNextIsQuest(index)
                ? "border-l border-dashed border-card-border-hover"
                : "bg-card-border",
            )}
          />
        )}
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.08 + 0.1, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "mb-6 flex-1 rounded-2xl border p-5 backdrop-blur-md transition-colors sm:p-6",
          nextQuest
            ? "border-dashed border-card-border-hover bg-muted/20"
            : current
              ? "border-accent/40 bg-accent/[0.06]"
              : "border-card-border/60 bg-muted/30 hover:border-border",
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-accent">
            {nextQuest
              ? nextQuestLabel
              : `${levelLabel} ${String(index + 1).padStart(2, "0")}`}
          </span>
          <span className="rounded-md border border-card-border bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
            {year}
          </span>
          {current && (
            <span className="inline-flex items-center gap-1 rounded-md border border-accent/40 bg-accent/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-accent">
              {youAreHere}
            </span>
          )}
        </div>

        <h3
          className={cn(
            "mt-2 font-heading text-lg font-bold tracking-tight sm:text-xl",
            nextQuest ? "text-muted-foreground" : "text-primary",
          )}
        >
          {nextQuest ? "??? " : ""}
          {title}
        </h3>

        <p className="mt-2 font-mono text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {description}
        </p>

        {unlocked.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-card-border/40 pt-3">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {unlockedLabel}
            </span>
            {unlocked.map((u) => (
              <span
                key={u}
                className="rounded-md border border-accent/20 bg-accent/5 px-2 py-0.5 font-mono text-[11px] text-primary"
              >
                {u}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </li>
  );
};

// The connector below stage `index` is dashed when the *next* stage is the open quest.
function journeyNextIsQuest(index: number) {
  return journey[index + 1]?.nextQuest ?? false;
}
