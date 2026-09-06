export function isIndexable(): boolean {
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production")
    return false;
  return process.env.ALLOW_INDEXING === "true";
}
