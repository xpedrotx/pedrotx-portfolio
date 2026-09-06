"use client";

import { useEffect, useMemo, useState } from "react";
import { Project } from "@/constant/projects";
import { GithubRepo } from "@/app/[locale]/projects/_components/GithubRepoCard";

const REPOS_CACHE_KEY = "pedrotx_github_repos_data";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour TTL to prevent GitHub rate-limiting
const ITEMS_PER_PAGE = 6;

interface CachedReposPayload {
  data: GithubRepo[];
  timestamp: number;
}

export interface UseGithubReposReturn {
  allFilteredCount: number;
  displayedRepos: GithubRepo[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  remainingCount: number;
  visibleCount: number;
  loadMore: () => void;
  refetch: () => void;
}

export const useGithubRepos = (
  constantProjects: Project[],
  searchQuery: string,
): UseGithubReposReturn => {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const [requestVersion, setRequestVersion] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      const now = Date.now();
      if (requestVersion === 0) {
        try {
          const stored = localStorage.getItem(REPOS_CACHE_KEY);
          const cached: CachedReposPayload | null = stored
            ? JSON.parse(stored)
            : null;
          if (
            cached &&
            Array.isArray(cached.data) &&
            now - cached.timestamp < CACHE_TTL_MS
          )
            return cached.data;
        } catch {}
      }
      const response = await fetch(
        "https://api.github.com/users/xpedrotx/repos?sort=updated&per_page=100",
        { signal: controller.signal },
      );
      if (!response.ok) throw new Error("Failed to load GitHub repositories");
      const data: GithubRepo[] = await response.json();
      if (!Array.isArray(data)) throw new Error("Invalid GitHub response");
      try {
        localStorage.setItem(
          REPOS_CACHE_KEY,
          JSON.stringify({ data, timestamp: now }),
        );
      } catch {}
      return data;
    }
    load()
      .then((data) => {
        if (!controller.signal.aborted) setRepos(data);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted)
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load GitHub repositories",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [requestVersion]);

  // Filter out repos whose name matches any project in constant/projects.ts
  const filteredRepos = useMemo(() => {
    const normalize = (str: string) =>
      str.toLowerCase().replace(/[^a-z0-9]/g, "");

    const constantNames = constantProjects.map((p) => normalize(p.name));
    const constantGithubNames = constantProjects
      .map((p) => p.links?.github)
      .filter(Boolean)
      .map((url) => normalize((url as string).split("/").pop() || ""));

    return repos
      .filter((repo) => {
        const normRepo = normalize(repo.name);
        const isAlreadyInConstant =
          constantNames.includes(normRepo) ||
          constantGithubNames.includes(normRepo);
        return !isAlreadyInConstant;
      })
      .filter((repo) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          repo.name.toLowerCase().includes(q) ||
          (repo.description && repo.description.toLowerCase().includes(q)) ||
          (repo.language && repo.language.toLowerCase().includes(q))
        );
      });
  }, [repos, constantProjects, searchQuery]);

  const displayedRepos = useMemo(
    () => filteredRepos.slice(0, visibleCount),
    [filteredRepos, visibleCount],
  );

  const hasMore = visibleCount < filteredRepos.length;
  const remainingCount = Math.max(0, filteredRepos.length - visibleCount);

  const loadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const refetch = () => {
    setLoading(true);
    setError(null);
    setRequestVersion((value) => value + 1);
  };

  return {
    allFilteredCount: filteredRepos.length,
    displayedRepos,
    loading,
    error,
    hasMore,
    remainingCount,
    visibleCount,
    loadMore,
    refetch,
  };
};
