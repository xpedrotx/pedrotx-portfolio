"use client";

import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { useConsent } from "./consent-context";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const ADS_ID = process.env.NEXT_PUBLIC_ADS_ID;

/**
 * - Vercel Analytics + Speed Insights: cookieless, run for everyone.
 * - Google Analytics / Google Ads: loaded ONLY after the visitor accepts.
 */
export const SiteAnalytics = () => {
  const { consent } = useConsent();
  const trackingAllowed = consent === "granted";

  return (
    <>
      <VercelAnalytics />
      <SpeedInsights />

      {trackingAllowed && GA_ID && <GoogleAnalytics gaId={GA_ID} />}

      {trackingAllowed && ADS_ID && (
        <>
          <Script
            id="google-ads"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`}
          />
          <Script id="google-ads-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${ADS_ID}');`}
          </Script>
        </>
      )}
    </>
  );
};
