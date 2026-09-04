import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/common";
import { ContactCard } from "./_components/ContactCard";

export const ContactSection = () => {
  const t = useTranslations("sections.contact");
  return (
    <section
      id="contact"
      className="relative w-full px-6 py-28 md:px-12 lg:px-20"
    >
      <div className="mx-auto w-full max-w-5xl flex flex-col gap-12">
        <SectionHeader number={t("number")} title={t("title")} align="left" />

        <ContactCard />
      </div>
    </section>
  );
};
