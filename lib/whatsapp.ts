/**
 * WhatsApp click-to-chat. Configured via NEXT_PUBLIC_WHATSAPP (digits only,
 * with country + area code, e.g. "5544999999999"). Returns null when unset.
 */
const NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP || "").replace(/\D/g, "");

export const whatsappNumber = NUMBER || null;

export function whatsappUrl(message?: string): string | null {
  if (!NUMBER) return null;
  const base = `https://wa.me/${NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
