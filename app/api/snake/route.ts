import { NextResponse } from "next/server";

export const revalidate = 3600;

const SNAKE_URL =
  "https://raw.githubusercontent.com/xpedrotx/xpedrotx/output/pedrotx-snake.svg";

/** Proxies the Platane/snk animation so it can be served same-origin as image/svg+xml. */
export async function GET() {
  try {
    const res = await fetch(SNAKE_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`GitHub responded ${res.status}`);

    const svg = await res.text();
    if (!svg.trimStart().startsWith("<svg")) throw new Error("Unexpected response");

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error(
      "Snake animation: failed to fetch:",
      err instanceof Error ? err.message : "unknown error",
    );
    return new NextResponse(null, { status: 502 });
  }
}
