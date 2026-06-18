/**
 * storage.js
 * ----------
 * Tiny localStorage helper for the list of recently-scanned repo paths,
 * shown as quick-pick chips under the scan bar.
 */

const RECENTS_KEY = "omnitrace.recentRepos";
const MAX_RECENTS = 6;

/** Return the saved repo paths (most recent first), or []. */
export function loadRecentRepos() {
  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

/**
 * Add a path to the front of the recents list (de-duplicated, capped) and
 * return the new list so the caller can update state in one step.
 */
export function pushRecentRepo(path) {
  const trimmed = (path || "").trim();
  if (!trimmed) return loadRecentRepos();
  const existing = loadRecentRepos().filter((p) => p !== trimmed);
  const next = [trimmed, ...existing].slice(0, MAX_RECENTS);
  try {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — non-fatal */
  }
  return next;
}

/** Remove one path (the little × on a chip). */
export function removeRecentRepo(path) {
  const next = loadRecentRepos().filter((p) => p !== path);
  try {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  } catch {
    /* non-fatal */
  }
  return next;
}
