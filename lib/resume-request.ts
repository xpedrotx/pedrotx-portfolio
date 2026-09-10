import { isValidEmail } from "./validators";

export const RESUME_REQUEST_LIMITS = {
  requesterName: 100,
  requesterEmail: 254,
} as const;

export type ResumeRequestField = keyof typeof RESUME_REQUEST_LIMITS;
export type ResumeRequestData = Record<ResumeRequestField, string>;
export const RESUME_REQUEST_FIELDS = Object.keys(
  RESUME_REQUEST_LIMITS,
) as ResumeRequestField[];

function cleanValue(value: string): string {
  return value.replace(/<[^>]*>/g, "").trim();
}

function hasControlChars(value: string): boolean {
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    if (code < 32 || code === 127) return true;
  }
  return false;
}

export function validateResumeRequestField(
  field: ResumeRequestField,
  input: unknown,
): "required" | "email" | "tooLong" | "invalid" | null {
  if (typeof input !== "string") return "invalid";
  if (input.length > RESUME_REQUEST_LIMITS[field]) return "tooLong";
  const clean = cleanValue(input);
  if (!clean) return "required";
  if (hasControlChars(clean)) return "invalid";
  if (field === "requesterEmail" && !isValidEmail(clean)) return "email";
  return null;
}

export function validateResumeRequest(
  input: unknown,
):
  | { data: ResumeRequestData; error?: never }
  | { error: string; data?: never } {
  if (!input || typeof input !== "object" || Array.isArray(input))
    return { error: "invalid" };
  const source = input as Record<string, unknown>;
  const data = {} as ResumeRequestData;
  for (const field of RESUME_REQUEST_FIELDS) {
    const error = validateResumeRequestField(field, source[field]);
    if (error) return { error };
    data[field] = cleanValue(source[field] as string);
  }
  return { data };
}
