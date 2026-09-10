import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import {
  ClientConfirmationEmail,
  LeadNotificationEmail,
} from "@/template/email";
import { rateLimit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { validateContact } from "@/lib/contact-validation";
import { readContactBody } from "@/lib/request-body";
import { isAllowedOrigin } from "@/lib/request-origin";
import { profile } from "@/constant/profile";

const OWNER_EMAIL = process.env.CONTACT_TO_EMAIL || profile.email;
const SENDER_ADDRESS = profile.email;
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
      return fail("rateLimit", 429, {
        "Retry-After": String(limit.retryAfter),
      });
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
  const result = validateContact(input);
  if (result.error || !result.data) return fail(result.error || "invalid", 400);
  if (!process.env.RESEND_API_KEY) return fail("unavailable", 503);
  if (!(await verifyTurnstile(input.turnstileToken, ip)))
    return fail("verification", 400);
  const { senderName, senderEmail, reasonToContact, senderMsg } = result.data;
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { error } = await resend.emails.send({
      from: "Portfólio Pedrotx <" + SENDER_ADDRESS + ">",
      to: OWNER_EMAIL,
      replyTo: senderEmail,
      subject: ("Novo contato: " + senderName + ", " + reasonToContact).slice(
        0,
        180,
      ),
      react: LeadNotificationEmail({
        senderName,
        senderEmail,
        contactReason: reasonToContact,
        senderMessage: senderMsg,
      }),
      text:
        "Novo contato pelo formulário do portfólio\n\nNome: " +
        senderName +
        "\nEmail: " +
        senderEmail +
        "\nMotivo: " +
        reasonToContact +
        "\n\nMensagem:\n" +
        senderMsg,
    });
    if (error) throw new Error("Lead delivery failed");
  } catch {
    console.error("Contact form: lead delivery failed");
    return fail("delivery", 502);
  }
  try {
    const { error } = await resend.emails.send({
      from: "Pedro Teixeira <" + SENDER_ADDRESS + ">",
      to: senderEmail,
      subject: "Recebi sua mensagem. Respondo em breve",
      react: ClientConfirmationEmail({
        userName: senderName,
        contactReason: reasonToContact,
        userMessage: senderMsg,
      }),
    });
    if (error) throw new Error("Confirmation delivery failed");
  } catch {
    console.warn("Contact form: confirmation delivery failed");
  }
  return NextResponse.json({ message: "ok" });
}
