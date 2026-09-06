"use client";
import { createContext, useContext, useSyncExternalStore } from "react";
import {
  getConsent,
  setConsent,
  subscribeConsent,
  type ConsentState,
} from "@/lib/consent";
export type { ConsentState } from "@/lib/consent";
export const CONSENT_REQUIRED = Boolean(
  process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_ADS_ID,
);
interface ConsentContextValue {
  consent: ConsentState;
  accept: () => void;
  decline: () => void;
  reset: () => void;
}
const ConsentContext = createContext<ConsentContextValue | null>(null);
export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsent,
    () => "unknown" as const,
  );
  return (
    <ConsentContext.Provider
      value={{
        consent,
        accept: () => setConsent("granted"),
        decline: () => setConsent("denied"),
        reset: () => setConsent("unknown"),
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}
export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context)
    throw new Error("useConsent must be used within ConsentProvider");
  return context;
}
