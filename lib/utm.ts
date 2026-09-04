/**
 * Campaign attribution helpers. Reads UTM params from the current URL on first
 * visit and keeps them for the session so a later form submit can be tied back
 * to the ad/campaign that brought the visitor in.
 */

const KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "msclkid",
] as const;

export type Attribution = Partial<Record<(typeof KEYS)[number], string>> & {
  landing_page?: string;
  referrer?: string;
};

const STORAGE_KEY = "pedrotx_attribution";

/** Call once on mount (client only). Captures attribution on the first page seen. */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    const existing = window.sessionStorage.getItem(STORAGE_KEY);
    if (existing) return;

    const params = new URLSearchParams(window.location.search);
    const data: Attribution = {};
    for (const key of KEYS) {
      const value = params.get(key);
      if (value) data[key] = value.slice(0, 200);
    }
    data.landing_page = window.location.pathname + window.location.search;
    if (document.referrer && !document.referrer.startsWith(window.location.origin)) {
      data.referrer = document.referrer.slice(0, 300);
    }

    // Store even when empty so we don't re-read on internal navigation.
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* sessionStorage unavailable, attribution is best-effort */
  }
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}
