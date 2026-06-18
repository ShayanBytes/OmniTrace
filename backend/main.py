"""
main.py
-------
The FastAPI backend for Code Archaeologist.

It exposes the git-digging + AI logic as a small JSON API that the
React frontend calls. Run it with:

    uvicorn main:app --reload --port 8000

Endpoints:
    GET  /api/health              -> simple "is the server up?" check
    POST /api/scan                -> repo overview + abandoned/graveyard files
    POST /api/analyze             -> AI 'Archaeology Report' for one file

All git/complexity work happens locally. API keys for cloud AI providers
are passed per-request from the browser and are never stored on disk.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

import excavator
import brain


app = FastAPI(title="Code Archaeologist API", version="1.0.0")

# ---------------------------------------------------------------------------
# CORS: allow the Vite dev server (localhost:5173) to call this API.
# We keep it permissive because this is a LOCAL-only developer tool.
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # local tool: any local origin may call us
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Request body shapes (Pydantic validates these automatically).
# ---------------------------------------------------------------------------
class ScanRequest(BaseModel):
    repo_path: str
    top_n: int = 10


class AnalyzeRequest(BaseModel):
    repo_path: str
    file_path: str
    provider: str = "ollama"
    model: str = "llama3"
    api_key: Optional[str] = None
    base_url: Optional[str] = None


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/api/health")
def health():
    """Tiny endpoint the frontend pings to confirm the backend is alive."""
    return {"status": "ok"}


@app.post("/api/scan")
def scan(req: ScanRequest):
    """
    Excavate a repository: return overview stats plus the 'graveyard'
    (most abandoned files enriched with complexity scores).
    """
    try:
        overview = excavator.get_repo_overview(req.repo_path)
        abandoned = excavator.find_abandoned_files(req.repo_path, top_n=req.top_n)
        graveyard = excavator.score_complexity(req.repo_path, abandoned)
        return {"ok": True, "overview": overview, "graveyard": graveyard}
    except ValueError as err:
        # Not a git repo / bad path -> return a clean error the UI can show.
        return {"ok": False, "error": str(err)}


@app.post("/api/analyze")
def analyze(req: AnalyzeRequest):
    """
    Generate an AI 'Archaeology Report' for a single file using the
    provider/model/key the user selected in the frontend.
    """
    # Step 1: read the raw code of the file.
    code = excavator.read_file_text(req.repo_path, req.file_path)
    if code is None:
        return {
            "ok": False,
            "error": "Could not read this file as text (it may be binary).",
        }

    # Step 2: gather the 5 most recent commit messages for context.
    try:
        messages: List[str] = excavator.get_recent_commit_messages(
            req.repo_path, req.file_path, count=5
        )
    except Exception:
        messages = []

    # Step 3: ask the chosen AI provider.
    report = brain.analyze_code(
        code=code,
        recent_commit_messages=messages,
        provider=req.provider,
        model=req.model,
        api_key=req.api_key,
        base_url=req.base_url,
    )

    return {
        "ok": True,
        "report": report,
        "commit_messages": messages,
        "code": code,
    }
