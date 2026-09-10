export function allowedOrigins(): string[] {
  const candidates = [
    ...(process.env.NODE_ENV === "development"
      ? ["http://localhost:3000", "http://localhost:3001"]
      : []),
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
      ? "https://" + process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
      : undefined,
    process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : undefined,
  ];
  return candidates.flatMap((value) => {
    try {
      return value ? [new URL(value).origin] : [];
    } catch {
      return [];
    }
  });
}

export function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (origin) return allowedOrigins().includes(origin);
  try {
    return allowedOrigins().includes(
      new URL(request.headers.get("referer") || "").origin,
    );
  } catch {
    return false;
  }
}
