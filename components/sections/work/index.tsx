import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/common";
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
      </div>
    </section>
  );
};
