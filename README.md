# OmniTrace

**AI-powered code archaeology.** Point OmniTrace at any local **git repository**
and it surfaces the **forgotten, risky corners** of your codebase — the files
nobody has touched in ages, ranked by how dangerous they are to revive (old
**and** complex = highest risk). Then any AI model you like writes a short report
explaining what each file was for and what the last big change was.

Everything git-related runs **locally**. AI is **bring-your-own** — pick a
provider and (for cloud ones) paste your own key. Keys are sent only with your
analysis request and are **never stored on a server**. With a local model
(Ollama) **nothing leaves your machine** at all.

---

## Stack

| Part         | Tech                                                                 | Job                                                   |
| ------------ | -------------------------------------------------------------------- | ----------------------------------------------------- |
| **Backend**  | FastAPI · GitPython · Lizard                                         | Digs git history, scores complexity, calls the AI     |
| **Frontend** | Next.js 14 · TypeScript · Tailwind CSS · Framer Motion · React Three Fiber | Marketing site **+** the functional console |

### Site map (frontend routes)

| Route        | What it is                                                              |
| ------------ | ----------------------------------------------------------------------- |
| `/`          | Marketing landing page (hero, 3D scenes, feature sections)              |
| `/features`  | Feature deep-dive                                                       |
| `/docs`      | Setup & usage docs                                                      |
| **`/app`**   | **The console** — scan a repo, browse the graveyard, run AI reports     |

---

## Prerequisites

- **Python 3.10+** (for the backend)
- **Node.js 18.18+** and npm (for the frontend)
- **(Optional) [Ollama](https://ollama.com/download)** — for free, fully-local AI
  with no API key. Cloud providers (OpenAI/Anthropic/etc.) work too with your own key.

---

## Quick start

You need **two terminals**: one for the API, one for the web UI.

### Windows (one-click scripts)

```bat
:: Terminal 1 — the API  (http://localhost:8000)
start-backend.bat

:: Terminal 2 — the web UI  (http://localhost:3000)
start-frontend.bat
```

Then open <http://localhost:3000> and click **Open App** (or go straight to
<http://localhost:3000/app>), paste a local repo path, and hit **Trace**.

### macOS / Linux (manual)

```bash
# Terminal 1 — backend API on :8000
python -m venv venv
source venv/bin/activate                 # Windows: venv\Scripts\activate
pip install -r backend/requirements.txt
cd backend && uvicorn main:app --reload --port 8000

# Terminal 2 — frontend on :3000
cd frontend
npm install
npm run dev
```

The frontend proxies `/api/*` to the backend on `:8000` automatically (see
`frontend/next.config.mjs`). To point at a backend on a different host/port:

```bash
# frontend/.env.local
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

---

## Using a local LLM (the free, private path)

This is the default and needs **no API key**:

1. Install **[Ollama](https://ollama.com/download)** and make sure it's running
   (`ollama serve` — on Windows/macOS the app runs it for you).
2. Pull a model:
   ```bash
   ollama pull llama3            # or: qwen2.5-coder, mistral, codellama, …
   ```
3. In the console (`/app`), open **Settings** → keep the provider on **Ollama**
   and set the model name to whatever you pulled. That's it.

Ollama listens on `http://localhost:11434` by default; the backend talks to it
there. Everything stays on your machine.

### Other providers

Open **Settings** in the console to switch. The model field is free-text with
suggestions, so any model the provider supports works.

| Provider                       | Key?     | Notes                                                       |
| ------------------------------ | -------- | ----------------------------------------------------------- |
| **Ollama** (default)           | No       | Local & free — `llama3`, `qwen2.5-coder`, `mistral`, …      |
| **OpenAI**                     | Yes      | `gpt-4o`, `gpt-4o-mini`, …                                  |
| **Anthropic**                  | Yes      | `claude-opus-4-8`, `claude-sonnet-4-6`, …                   |
| **Custom (OpenAI-compatible)** | Usually  | Groq, OpenRouter, Together, LM Studio — paste a base URL    |

---

## How it works

1. **Scan** (`POST /api/scan`) — lists tracked files, finds those with the oldest
   most-recent commit, and runs [Lizard](https://github.com/terryyin/lizard) for
   cyclomatic complexity. Returns repo overview + the "graveyard".
2. **Analyze a file** (`POST /api/analyze`) — reads the file plus its last 5
   commit messages and asks your chosen AI provider to explain it in plain English.
3. **Health** (`GET /api/health`) — liveness check shown as the green/red dot.

---

## Project layout

```
.
├── backend/                 # FastAPI app (run from this folder)
│   ├── main.py              #   routes: /api/health, /api/scan, /api/analyze
│   ├── excavator.py         #   git digging + Lizard complexity
│   ├── brain.py             #   provider-agnostic AI layer (ollama/openai/anthropic/custom)
│   └── requirements.txt
├── frontend/                # Next.js 14 (App Router) + TS + Tailwind + R3F
│   ├── app/
│   │   ├── (site)/          #   marketing pages: / , /features , /docs (shared nav+footer)
│   │   ├── app/             #   the functional console (/app)
│   │   ├── layout.tsx       #   root layout, fonts, global overlays
│   │   └── globals.css
│   ├── components/
│   │   ├── sections/        #   landing-page sections
│   │   ├── app/             #   console UI (scan bar, settings, report, toasts)
│   │   ├── three/           #   React Three Fiber scenes (lazy, SSR-safe)
│   │   ├── shared/          #   reusable building blocks
│   │   └── ui/              #   shadcn-style primitives
│   ├── lib/                 #   api client, providers, storage, helpers
│   └── next.config.mjs      #   /api proxy → backend
├── start-backend.bat
└── start-frontend.bat
```

> Note: `app.py`, `brain.py`, `excavator.py` in the repo **root** are the older
> all-in-one Streamlit prototype. The current web app lives in `backend/` +
> `frontend/`.

---

## Production build

```bash
cd frontend
npm run build      # static + server build
npm run start      # serve the production build
```

The site is static-friendly (the console talks to your local backend at runtime),
so it deploys to any Node host or Vercel.
