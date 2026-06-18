/**
 * api.js
 * ------
 * Thin wrapper around the FastAPI backend. All requests go through the
 * Vite dev proxy (/api -> http://localhost:8000), so there's no CORS or
 * hardcoded host to worry about in development.
 */

async function postJSON(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Server responded ${res.status}`);
  }
  return res.json();
}

/** Cheap liveness ping shown as the green/red dot in the header. */
export async function checkHealth() {
  try {
    const res = await fetch("/api/health");
    return res.ok;
  } catch {
    return false;
  }
}

/** Scan a local repo path → { ok, overview, graveyard } | { ok:false, error }. */
export function scanRepo(repoPath, topN = 12) {
  return postJSON("/api/scan", { repo_path: repoPath, top_n: topN });
}

/**
 * Ask the chosen AI provider to analyze one file.
 * `settings` is the object from providers.js (provider/model/apiKey/baseUrl).
 */
export function analyzeFile(repoPath, filePath, settings) {
  return postJSON("/api/analyze", {
    repo_path: repoPath,
    file_path: filePath,
    provider: settings.provider,
    model: settings.model,
    api_key: settings.apiKey || null,
    base_url: settings.baseUrl || null,
  });
}
