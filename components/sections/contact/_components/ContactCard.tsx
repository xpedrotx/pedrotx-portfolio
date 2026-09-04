"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { FaWhatsapp } from "react-icons/fa6";

import { StepForm } from "./StepForm";
import { SocialLinks } from "./SocialLinks";
import { ContactInfo } from "./ContactInfo";
import { Separator } from "@/components/ui/separator";
import { whatsappUrl } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

export const ContactCard = () => {
  const t = useTranslations("contact");
  const wa = whatsappUrl(t("whatsappMessage"));
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full overflow-hidden rounded-3xl border border-card-border bg-card/85 p-6 sm:p-10 md:p-14 backdrop-blur-xl shadow-2xl text-primary"
    >
      {/* Soft Ambient Background Glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-10 md:gap-12">
        {/* Top Part: Big Heading + Step Form */}
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-primary font-bold tracking-wide drop-shadow-md lowercase">
            {t("heading")}
          </h2>

          <div className="flex w-full flex-col gap-3 md:w-auto md:min-w-85">
            <StepForm />
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("whatsapp_click")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 py-2.5 font-mono text-xs font-semibold text-accent transition-colors hover:bg-accent/20"
              >
                <FaWhatsapp className="size-4" />
                {t("whatsappCta")}
              </a>
            )}
          </div>
        </div>

        {/* Middle Separator with Signature Font */}
        <Separator showSignature className="my-2 border-card-border" />

        {/* Bottom Part: Social Links (Left) + Contact Info (Right) */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full lg:w-auto">
            <SocialLinks />
          </div>

          <div className="w-full lg:w-auto pt-2 lg:pt-0">
            <ContactInfo />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

