/**
 * Cloudflare Turnstile server-side verification.
 * Skipped entirely when TURNSTILE_SECRET_KEY isn't configured.
 */
const SECRET = process.env.TURNSTILE_SECRET_KEY;

export const turnstileEnabled = Boolean(SECRET);

export async function verifyTurnstile(
  token: unknown,
  ip?: string | null,
): Promise<boolean> {
  if (!SECRET) return true; // not configured -> don't block
  if (typeof token !== "string" || !token) return false;

  try {
    const body = new URLSearchParams({ secret: SECRET, response: token });
    if (ip) body.set("remoteip", ip);

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body },
    );
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
