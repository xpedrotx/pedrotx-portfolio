import { getConsent } from "./consent";
/**
 * Thin analytics layer. All calls are safe no-ops when the corresponding
 * provider isn't loaded (e.g. no GA id set, or consent not granted).
 */

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

export function trackEvent(
  name: string,
  params: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined" || getConsent() !== "granted") return;
  try {
    window.gtag?.("event", name, params);
  } catch {
    /* provider not ready */
  }
}

/** Fired when the contact form is submitted successfully. */
export function trackLead(params: Record<string, unknown> = {}): void {
  trackEvent("generate_lead", { currency: "BRL", value: 0, ...params });

  // Google Ads conversion, only fires if the label env is present.
  const sendTo = process.env.NEXT_PUBLIC_ADS_CONVERSION_LABEL;
  if (sendTo && typeof window !== "undefined" && getConsent() === "granted") {
    try {
      window.gtag?.("event", "conversion", { send_to: sendTo });
    } catch {
      /* noop */
    }
  }
}
