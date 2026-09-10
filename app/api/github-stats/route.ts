import { NextResponse } from "next/server";

export const revalidate = 3600;

const HANDLE = "xpedrotx";
const API_HEADERS = { "User-Agent": "pedrotx-portfolio" };

async function safe<T>(task: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await task();
  } catch {
    return fallback;
  }
}

async function getUser() {
  const res = await fetch("https://api.github.com/users/" + HANDLE, {
    headers: API_HEADERS,
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("user " + res.status);
  const data = (await res.json()) as { followers?: number; following?: number };
  return { followers: data.followers ?? 0, following: data.following ?? 0 };
}

async function getStars() {
  const res = await fetch(
    "https://api.github.com/users/" + HANDLE + "/repos?per_page=100&type=owner",
    { headers: API_HEADERS, next: { revalidate: 3600 } },
  );
  if (!res.ok) throw new Error("repos " + res.status);
  const repos = (await res.json()) as { stargazers_count?: number }[];
  return repos.reduce((total, repo) => total + (repo.stargazers_count ?? 0), 0);
}

async function getCommits() {
  const res = await fetch(
    "https://api.github.com/search/commits?q=author:" + HANDLE + "&per_page=1",
    { headers: API_HEADERS, next: { revalidate: 3600 } },
  );
  if (!res.ok) throw new Error("commits " + res.status);
  const data = (await res.json()) as { total_count?: number };
  return data.total_count ?? 0;
}

export async function GET() {
  const [user, stars, commits] = await Promise.all([
    safe(getUser, { followers: 0, following: 0 }),
    safe(getStars, 0),
    safe(getCommits, 0),
  ]);

  return NextResponse.json(
    { ...user, stars, commits, handle: HANDLE },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    },
  );
}
