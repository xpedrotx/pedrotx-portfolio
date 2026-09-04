import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { isValidEmail } from "@/lib/validators";
import { EmailTemplate } from "@/template/email";
import { rateLimit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { profile } from "@/constant/profile";

function sanitize(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

/** Where leads are delivered. Falls back to the public contact address. */
const OWNER_EMAIL = process.env.CONTACT_TO_EMAIL || profile.email;

/** Verified sending domain on Resend; not a real inbox. */
const NOREPLY_ADDRESS = "noreply@pedrotx.com.br";
const LEAD_FROM = `PEDROTX <${NOREPLY_ADDRESS}>`;
const AUTOREPLY_FROM = `${profile.name.full} <${NOREPLY_ADDRESS}>`;

function allowedOrigins(): string[] {
  return [
    "http://localhost:3000",
    "http://localhost:3001",
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  ].filter((v): v is string => Boolean(v));
}

/** Exact-origin check (no startsWith, that let `pedrotx.com.br.evil.com` through). */
function isAllowedOrigin(request: NextRequest): boolean {
  const raw = request.headers.get("origin");
  const origins = allowedOrigins();
  if (raw) return origins.includes(raw);

  // Some browsers omit Origin on same-origin POST; fall back to Referer's origin.
  const referer = request.headers.get("referer");
  if (!referer) return false;
  try {
    return origins.includes(new URL(referer).origin);
  } catch {
    return false;
  }
}

type Attribution = Record<string, string | undefined>;

function attributionBlock(attr: Attribution): string {
  const rows = Object.entries(attr)
    .filter(([, v]) => typeof v === "string" && v.length > 0)
    .map(([k, v]) => `${k}: ${sanitize(String(v)).slice(0, 300)}`);
  return rows.length ? `\n\n--- Attribution ---\n${rows.join("\n")}` : "";
}

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const { success: withinLimit } = rateLimit(ip, {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (!withinLimit) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": "3600" } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field.
  if (typeof body.company === "string" && body.company.trim().length > 0) {
    // Pretend success so bots don't learn the field name.
    return NextResponse.json({ message: "ok" }, { status: 200 });
  }

  // Cloudflare Turnstile (no-op unless TURNSTILE_SECRET_KEY is set).
  if (!(await verifyTurnstile(body.turnstileToken, ip))) {
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 400 },
    );
  }

  const { senderName, senderEmail, reasonToContact, senderMsg } = body as Record<
    string,
    string
  >;

  if (
    !senderName ||
    !senderEmail ||
    !reasonToContact ||
    !senderMsg ||
    typeof senderName !== "string" ||
    typeof senderEmail !== "string" ||
    typeof reasonToContact !== "string" ||
    typeof senderMsg !== "string"
  ) {
    return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
  }
  if (senderName.length > 100)
    return NextResponse.json({ error: "Name is too long" }, { status: 400 });
  if (senderEmail.length > 254)
    return NextResponse.json({ error: "Email is too long" }, { status: 400 });
  if (reasonToContact.length > 100)
    return NextResponse.json({ error: "Reason is too long" }, { status: 400 });
  if (senderMsg.length > 2000)
    return NextResponse.json(
      { error: "Message is too long (max 2000 characters)" },
      { status: 400 },
    );

  const cleanName = sanitize(senderName);
  const cleanEmail = sanitize(senderEmail);
  const cleanReason = sanitize(reasonToContact);
  const cleanMsg = sanitize(senderMsg);

  if (!isValidEmail(cleanEmail)) {
    return NextResponse.json(
      { error: "Email format is not valid" },
      { status: 400 },
    );
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("Contact form: RESEND_API_KEY is not configured");
    return NextResponse.json(
      { error: "Contact form is not configured yet." },
      { status: 503 },
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const attribution = (body.attribution ?? {}) as Attribution;

  // 1. The actual lead, delivered to the site owner, replyable to the sender.
  const leadText =
    `New message from the portfolio contact form\n\n` +
    `Name: ${cleanName}\n` +
    `Email: ${cleanEmail}\n` +
    `Reason: ${cleanReason}\n\n` +
    `Message:\n${cleanMsg}\n` +
    `${attributionBlock(attribution)}`;

  try {
    const { error } = await resend.emails.send({
      from: LEAD_FROM,
      to: OWNER_EMAIL,
      replyTo: `${cleanName} <${cleanEmail}>`,
      subject: `Novo contato: ${cleanName}, ${cleanReason}`.slice(0, 180),
      text: leadText,
      headers: { "X-Entity-Ref-ID": "portfolio-lead" },
    });
    if (error) throw new Error(error.message);
  } catch (err) {
    console.error(
      "Contact form: failed to deliver lead:",
      err instanceof Error ? err.message : "unknown error",
    );
    return NextResponse.json(
      { error: "Failed to send message. Please email me directly." },
      { status: 502 },
    );
  }

  // 2. Best-effort auto-reply to the sender (never fails the request).
  try {
    const { error } = await resend.emails.send({
      from: AUTOREPLY_FROM,
      to: `${cleanName} <${cleanEmail}>`,
      subject: "Recebi sua mensagem. Respondo em breve 🚀",
      react: EmailTemplate({
        userName: cleanName,
        contactReason: cleanReason,
        userMessage: cleanMsg,
      }),
      headers: { "X-Entity-Ref-ID": "portfolio-autoreply" },
    });
    if (error) throw new Error(error.message);
  } catch (err) {
    console.warn(
      "Contact form: auto-reply not sent:",
      err instanceof Error ? err.message : "unknown error",
    );
  }

  return NextResponse.json({ message: "Message sent successfully" }, { status: 200 });
}
