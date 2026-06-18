/**
 * localStorage helper for recently-scanned repo paths (quick-pick chips).
 * SSR-safe: all accesses guard for `window`.
 */
const RECENTS_KEY = "omnitrace.recentRepos";
const MAX_RECENTS = 6;

export function loadRecentRepos(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function pushRecentRepo(path: string): string[] {
  const trimmed = (path || "").trim();
  if (!trimmed) return loadRecentRepos();
  const existing = loadRecentRepos().filter((p) => p !== trimmed);
  const next = [trimmed, ...existing].slice(0, MAX_RECENTS);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
    } catch {
      /* non-fatal */
    }
  }
  return next;
}

export function removeRecentRepo(path: string): string[] {
  const next = loadRecentRepos().filter((p) => p !== path);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
    } catch {
      /* non-fatal */
    }
  }
  return next;
}
