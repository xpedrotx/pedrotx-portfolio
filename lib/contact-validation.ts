import { isValidEmail } from "./validators";
export const CONTACT_LIMITS = {
  senderName: 100,
  senderEmail: 254,
  reasonToContact: 100,
  senderMsg: 2000,
} as const;
export type ContactField = keyof typeof CONTACT_LIMITS;
export type ContactData = Record<ContactField, string>;
export function cleanContactValue(value: string): string {
  return value.replace(/<[^>]*>/g, "").trim();
}
export function validateContactField(
  field: ContactField,
  input: unknown,
): "required" | "email" | "tooLong" | "invalid" | null {
  if (typeof input !== "string") return "invalid";
  if (input.length > CONTACT_LIMITS[field]) return "tooLong";
  const clean = cleanContactValue(input);
  if (!clean) return "required";
  if (field !== "senderMsg" && /[\r\n\u0000-\u001f\u007f]/.test(clean))
    return "invalid";
  if (field === "senderEmail" && !isValidEmail(clean)) return "email";
  return null;
}
export function validateContact(
  input: unknown,
): { data: ContactData; error?: never } | { error: string; data?: never } {
  if (!input || typeof input !== "object" || Array.isArray(input))
    return { error: "invalid" };
  const source = input as Record<string, unknown>;
  const data = {} as ContactData;
  for (const field of Object.keys(CONTACT_LIMITS) as ContactField[]) {
    const error = validateContactField(field, source[field]);
    if (error) return { error };
    data[field] = cleanContactValue(source[field] as string);
  }
  return { data };
}
