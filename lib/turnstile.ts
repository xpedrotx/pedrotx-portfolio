const SECRET = process.env.TURNSTILE_SECRET_KEY;
export const turnstileEnabled = Boolean(SECRET);
export async function verifyTurnstile(
  token: unknown,
  ip?: string | null,
): Promise<boolean> {
  if (!SECRET) return !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (typeof token !== "string" || !token || token.length > 2048) return false;
  try {
    const body = new URLSearchParams({ secret: SECRET, response: token });
    if (ip) body.set("remoteip", ip);
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body,
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
