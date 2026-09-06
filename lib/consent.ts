export type ConsentState = "unknown" | "granted" | "denied";
const STORAGE_KEY = "pedrotx_consent";
const EVENT = "pedrotx:consent";
let memory: ConsentState | undefined;
export function getConsent(): ConsentState {
  if (typeof window === "undefined") return "unknown";
  if (memory) return memory;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "granted" || stored === "denied" ? stored : "unknown";
  } catch {
    return "unknown";
  }
}
function applyGoogleConsent(value: ConsentState) {
  const granted = value === "granted";
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (id)
    (window as unknown as Record<string, unknown>)["ga-disable-" + id] =
      !granted;
  window.gtag?.("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
    ad_storage: granted ? "granted" : "denied",
    ad_user_data: granted ? "granted" : "denied",
    ad_personalization: granted ? "granted" : "denied",
  });
  if (!granted) {
    try {
      sessionStorage.removeItem("pedrotx_attribution");
    } catch {}
    const host = window.location.hostname.split(".");
    for (const cookie of document.cookie.split(";")) {
      const name = cookie.split("=")[0].trim();
      if (!/^(_ga($|_)|_gid$|_gat($|_)|_gcl_)/.test(name)) continue;
      const expired = name + "=; Max-Age=0; Path=/";
      document.cookie = expired;
      for (let i = 0; i < host.length - 1; i++)
        document.cookie = expired + "; Domain=." + host.slice(i).join(".");
    }
  }
}
export function setConsent(value: ConsentState) {
  memory = value;
  try {
    if (value === "unknown") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, value);
  } catch {}
  applyGoogleConsent(value);
  window.dispatchEvent(new Event(EVENT));
}
export function subscribeConsent(listener: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    memory = undefined;
    applyGoogleConsent(getConsent());
    listener();
  };
  window.addEventListener(EVENT, listener);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, listener);
    window.removeEventListener("storage", onStorage);
  };
}
