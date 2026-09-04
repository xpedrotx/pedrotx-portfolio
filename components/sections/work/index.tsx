import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/common";
import { Link } from "@/i18n/navigation";
import { selected_works } from "@/constant";
import { WorkCard } from "./_components/WorkCard";

export const WorkSection = () => {
  const t = useTranslations("sections.work");
  const tItems = useTranslations("projects.items");

  return (
    <section
      id="work"
      className="relative w-full px-6 py-28 md:px-12 lg:px-20"
    >
      <div className="mx-auto w-full max-w-5xl">
        <SectionHeader number={t("number")} title={t("title")} align="right" />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {selected_works.map((project, index) => (
            <WorkCard
              key={project.id}
              index={index}
              name={project.name}
              description={tItems(project.id)}
              technologies={project.technologies}
              links={project.links}
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 rounded-xl border border-card-border bg-card/60 px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-foreground transition-all duration-200 hover:border-accent/40 hover:bg-card"
          >
            {t("seeAll")}
            <ArrowRight className="size-3.5 text-accent transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
