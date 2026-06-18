/**
 * Typed client for the OmniTrace FastAPI backend. Requests go to same-origin
 * /api/* and are proxied to the backend by the rewrite in next.config.mjs, so
 * there's no CORS or hardcoded host in the browser.
 */
import type { GraveyardFile, RepoOverview } from "@/lib/mock-data";
import type { Settings } from "@/lib/providers";

export type ScanResult =
  | { ok: true; overview: RepoOverview; graveyard: GraveyardFile[] }
  | { ok: false; error: string };

export type AnalyzeResult =
  | { ok: true; report: string; commit_messages: string[]; code: string }
  | { ok: false; error: string };

async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Server responded ${res.status}`);
  return res.json() as Promise<T>;
}

/** Cheap liveness ping → green/red dot. */
export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch("/api/health");
    return res.ok;
  } catch {
    return false;
  }
}

/** Scan a local repo path → overview + graveyard, or an error. */
export function scanRepo(repoPath: string, topN = 12): Promise<ScanResult> {
  return postJSON<ScanResult>("/api/scan", {
    repo_path: repoPath,
    top_n: topN,
  });
}

/** Ask the chosen AI provider to analyze a single file. */
export function analyzeFile(
  repoPath: string,
  filePath: string,
  settings: Settings
): Promise<AnalyzeResult> {
  return postJSON<AnalyzeResult>("/api/analyze", {
    repo_path: repoPath,
    file_path: filePath,
    provider: settings.provider,
    model: settings.model,
    api_key: settings.apiKey || null,
    base_url: settings.baseUrl || null,
  });
}
