"use client";
import { useEffect, useRef } from "react";
import Script from "next/script";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useConsent } from "./consent-context";
import { getConsent } from "@/lib/consent";

const GA_ID = /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA_ID || "")
  ? process.env.NEXT_PUBLIC_GA_ID
  : undefined;
const ADS_ID = /^AW-\d+$/.test(process.env.NEXT_PUBLIC_ADS_ID || "")
  ? process.env.NEXT_PUBLIC_ADS_ID
  : undefined;
export const SiteAnalytics = () => {
  const { consent } = useConsent();
  const configured = useRef(false);
  useEffect(() => {
    if (
      consent !== "granted" ||
      getConsent() !== "granted" ||
      (!GA_ID && !ADS_ID)
    )
      return;
    window.dataLayer ||= [];
    window.gtag ||= function () {
      // Google tags consume the gtag arguments object.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
    window.gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
    if (configured.current) return;
    configured.current = true;
    window.gtag("js", new Date());
    const options = {
      page_location: window.location.origin + window.location.pathname,
    };
    if (GA_ID) window.gtag("config", GA_ID, options);
    if (ADS_ID) window.gtag("config", ADS_ID, options);
  }, [consent]);
  return (
    <>
      <VercelAnalytics />
      <SpeedInsights />
      {consent === "granted" && (GA_ID || ADS_ID) && (
        <Script
          id="google-tag"
          strategy="afterInteractive"
          src={
            "https://www.googletagmanager.com/gtag/js?id=" + (GA_ID || ADS_ID)
          }
        />
      )}
    </>
  );
};
