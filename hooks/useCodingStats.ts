"use client";

import { useState, useEffect } from "react";

export interface GithubStats {
  followers: number;
  following: number;
  stars: number;
  commits: number;
  handle: string;
}

export interface CodingStats {
  github: GithubStats | null;
  loading: boolean;
}

interface CachedStats {
  data: GithubStats;
  timestamp: number;
}

const STORAGE_KEY = "pedrotx-portfolio-github-stats-v2";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const useCodingStats = (): CodingStats => {
  const [stats, setStats] = useState<CodingStats>({
    github: null,
    loading: true,
  });

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      let cached: CachedStats | null = null;
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) cached = JSON.parse(stored);
      } catch {}

      const now = Date.now();
      const isCacheValid =
        cached &&
        cached.timestamp &&
        cached.data &&
        now - cached.timestamp < ONE_DAY_MS;

      if (isCacheValid && cached) {
        if (isMounted) setStats({ github: cached.data, loading: false });
        return;
      }

      try {
        const res = await fetch("/api/github-stats");
        if (!res.ok) throw new Error("Failed to fetch GitHub stats");
        const data = (await res.json()) as GithubStats;

        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ data, timestamp: now } satisfies CachedStats),
          );
        } catch {}

        if (isMounted) setStats({ github: data, loading: false });
      } catch {
        if (isMounted)
          setStats({ github: cached?.data ?? null, loading: false });
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return stats;
};
