"use client";

import { useEffect, useState } from "react";
import { Clock, Mail, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { useLocale, useTranslations } from "next-intl";
import { profile } from "@/constant/profile";
import { whatsappUrl } from "@/lib/whatsapp";

const TIME_ZONE = "America/Sao_Paulo";

export const ContactInfo = () => {
  const t = useTranslations("contact");
  const locale = useLocale();

  const { city, state, country } = profile.curr_location;
  const locationString = `${city}, ${state}, ${country}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    locationString,
  )}`;

  const wa = whatsappUrl(t("whatsappMessage"));
  const [localTime, setLocalTime] = useState<string | null>(null);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat(
      locale === "pt-br" ? "pt-BR" : "en-US",
      {
        timeZone: TIME_ZONE,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      },
    );
    const tick = () => setLocalTime(formatter.format(new Date()));
    tick();
    const id = setInterval(tick, 20_000);
    return () => clearInterval(id);
  }, [locale]);

  return (
    <div className="flex flex-col gap-2.5 font-mono text-xs sm:text-sm text-muted-foreground font-medium">
      <a
        href={`mailto:${profile.email}`}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary hover:underline underline-offset-4 transition-colors group shrink-0"
      >
        <Mail className="size-4 text-accent group-hover:scale-110 transition-transform shrink-0" />
        <span>{profile.email}</span>
      </a>

      {wa && (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary hover:underline underline-offset-4 transition-colors group shrink-0"
        >
          <FaWhatsapp className="size-4 text-accent group-hover:scale-110 transition-transform shrink-0" />
          <span>{t("whatsapp")}</span>
        </a>
      )}

      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-muted-foreground hover:text-primary hover:underline underline-offset-4 transition-colors group shrink-0"
      >
        <MapPin className="size-4 text-accent group-hover:scale-110 transition-transform shrink-0" />
        <span>{locationString}</span>
      </a>

      <span className="flex items-center gap-2 shrink-0" suppressHydrationWarning>
        <Clock className="size-4 text-accent shrink-0" />
        <span>
          {localTime ? `${localTime} · ${t("localTime")}` : " "}
        </span>
      </span>
    </div>
  );
};
