"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type ConsentState = "unknown" | "granted" | "denied";

const STORAGE_KEY = "pedrotx_consent";

/** Consent is only relevant when a cookie-setting provider is configured. */
export const CONSENT_REQUIRED = Boolean(
  process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_ADS_ID,
);

interface ConsentContextValue {
  consent: ConsentState;
  accept: () => void;
  decline: () => void;
  /** Re-open the choice (e.g. from a footer "cookies" link). */
  reset: () => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>("unknown");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "granted" || stored === "denied") setConsent(stored);
    } catch {
      /* storage blocked — stay "unknown" */
    }
  }, []);

  const persist = useCallback((value: ConsentState) => {
    setConsent(value);
    try {
      if (value === "unknown") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* noop */
    }
  }, []);

  const value: ConsentContextValue = {
    consent,
    accept: () => persist("granted"),
    decline: () => persist("denied"),
    reset: () => persist("unknown"),
  };

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used within <ConsentProvider>");
  return ctx;
}
