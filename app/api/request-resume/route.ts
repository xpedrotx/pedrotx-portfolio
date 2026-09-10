import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import {
  ResumeDeliveryEmail,
  ResumeRequestNotificationEmail,
} from "@/template/email";
import { rateLimit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { validateResumeRequest } from "@/lib/resume-request";
import { readContactBody } from "@/lib/request-body";
import { isAllowedOrigin } from "@/lib/request-origin";
import { profile } from "@/constant/profile";

export const runtime = "nodejs";

const OWNER_EMAIL = process.env.CONTACT_TO_EMAIL || profile.email;
const NOREPLY_ADDRESS = "noreply@pedrotx.com.br";
const RESUME_FILE = join(process.cwd(), "assets", "resume.pdf");
const RESUME_ATTACHMENT_NAME = "Pedro-Teixeira-Curriculo.pdf";

function fail(code: string, status: number, headers?: Record<string, string>) {
  return NextResponse.json({ code }, { status, headers });
}

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) return fail("forbidden", 403);
  if (
    request.headers.get("content-type")?.split(";")[0].trim() !==
    "application/json"
  )
    return fail("invalid", 415);

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  try {
    const limit = await rateLimit(ip, { maxRequests: 5, windowMs: 3600000 });
    if (!limit.success)
      return fail("rateLimit", 429, { "Retry-After": String(limit.retryAfter) });
  } catch {
    return fail("unavailable", 503);
  }

  let body: unknown;
  try {
    body = await readContactBody(request);
  } catch (error) {
    return fail(
      error instanceof Error && error.message === "tooLarge"
        ? "tooLong"
        : "invalid",
      400,
    );
  }
  if (!body || typeof body !== "object" || Array.isArray(body))
    return fail("invalid", 400);
  const input = body as Record<string, unknown>;
  if (typeof input.company === "string" && input.company.trim())
    return NextResponse.json({ message: "ok" });

  const result = validateResumeRequest(input);
  if (result.error || !result.data) return fail(result.error || "invalid", 400);
  if (!process.env.RESEND_API_KEY) return fail("unavailable", 503);
  if (!(await verifyTurnstile(input.turnstileToken, ip)))
    return fail("verification", 400);

  const { requesterName, requesterEmail } = result.data;

  const pdf = await readFile(RESUME_FILE).catch(() => null);
  if (!pdf) {
    console.error("Resume request: PDF file could not be read");
    return fail("unavailable", 503);
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error } = await resend.emails.send({
      from: "Pedrotx | Desenvolvedor <" + NOREPLY_ADDRESS + ">",
      to: requesterEmail,
      replyTo: OWNER_EMAIL,
      subject: "Meu currículo, como pedido",
      react: ResumeDeliveryEmail({ userName: requesterName }),
      attachments: [{ filename: RESUME_ATTACHMENT_NAME, content: pdf }],
    });
    if (error) throw new Error("Resume delivery failed");
  } catch {
    console.error("Resume request: delivery failed");
    return fail("delivery", 502);
  }

  try {
    const { error } = await resend.emails.send({
      from: "PEDROTX <" + NOREPLY_ADDRESS + ">",
      to: OWNER_EMAIL,
      replyTo: requesterEmail,
      subject: "Novo pedido de currículo: " + requesterName,
      react: ResumeRequestNotificationEmail({ requesterName, requesterEmail }),
      text:
        "Novo pedido de currículo pelo portfólio\n\nNome: " +
        requesterName +
        "\nEmail: " +
        requesterEmail,
    });
    if (error) throw new Error("Notification delivery failed");
  } catch {
    console.warn("Resume request: owner notification failed");
  }

  return NextResponse.json({ message: "ok" });
}
