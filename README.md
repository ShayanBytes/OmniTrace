# 🛰️ OmniTrace

Point it at any local **git repository** and it traces the **forgotten, risky
corners** of your codebase — the files nobody has touched in ages, ranked by how
dangerous they are to revive (old **and** complex = highest risk). Then any AI
model you like writes a short report explaining what each file was for and what
the last big change was.

Everything git-related runs **locally**. AI is **bring-your-own** — pick a
provider and (for cloud ones) paste your own key. Keys are sent only with your
analysis request and are **never stored on the server**.

---

## ✨ What's inside

| Part         | Tech                                   | Job                                            |
| ------------ | -------------------------------------- | ---------------------------------------------- |
| **Backend**  | FastAPI · GitPython · Lizard           | Digs git history, scores complexity, calls AI  |
| **Frontend** | React · Tailwind CSS · Framer Motion   | Masonry "graveyard" grid with 3D tilt cards    |

### Handy extras

- 🔎 **Search, sort & risk filters** over the graveyard grid (sort by idle /
  risk / complexity / name; filter to High / Watch / Stable). Press **`/`** to
  jump to the filter, **`Esc`** to close any modal.
- 🕘 **Recent repos** — one-click re-scan of paths you've traced before.
- 🎚️ **Scan depth** — choose how many abandoned files to surface (Top 8–50).
- 📋 **Copy / download** any AI report as Markdown.
- 🔔 Lightweight **toasts** for quick feedback.

### Dynamic AI — use whatever model you want

Configure it from the **⚙ AI provider** panel in the UI. No backend changes
needed to add a service.

| Provider                     | Key?  | Notes                                                   |
| ---------------------------- | ----- | ------------------------------------------------------- |
| **Ollama** (default)         | No    | Local & free — `llama3`, `qwen2.5-coder`, `mistral`, …  |
| **OpenAI**                   | Yes   | `gpt-4o`, `gpt-4o-mini`, …                              |
| **Anthropic**                | Yes   | `claude-opus-4-8`, `claude-sonnet-4-6`, …               |
| **Custom (OpenAI-compatible)** | Usually | Groq, OpenRouter, Together, LM Studio — paste a base URL |

The model field is a free-text input with suggestions, so you can type **any**
model name the provider supports.

---

## 🚀 Run it (Windows)

Open **two** terminals in this folder:

```bat
:: Terminal 1 — the API (http://localhost:8000)
start-backend.bat

:: Terminal 2 — the web UI (http://localhost:5173)
start-frontend.bat
```

Then open <http://localhost:5173>, paste a local repo path, and hit **Trace**.

### Manual / non-Windows

```bash
# Backend
python -m venv venv
source venv/bin/activate            # Windows: venv\Scripts\activate
pip install -r backend/requirements.txt
cd backend && uvicorn main:app --reload --port 8000

# Frontend (second terminal)
cd frontend
npm install
npm run dev
```

### Using a local model (free path)

1. Install [Ollama](https://ollama.com/download) and run `ollama serve`.
2. Pull a model: `ollama pull llama3`.
3. Leave the provider on **Ollama** in Settings. Done — no key required.

---

## 🗺️ How it works

1. **Scan** (`POST /api/scan`) — lists tracked files, finds the ones with the
   oldest most-recent commit, and runs [Lizard](https://github.com/terryyin/lizard)
   for cyclomatic complexity.
2. **Analyze a file** (`POST /api/analyze`) — reads the file + its last 5
   commit messages and asks your chosen AI provider to explain it.

The frontend renders the results as a responsive **masonry grid** (`columns-1
sm:columns-2 lg:columns-3 xl:columns-4`) of cards that **tilt in 3D** toward your
cursor, color-coded by risk.

---

## 📁 Layout

```
.
├── backend/            # FastAPI app
│   ├── main.py         #   API routes (/api/health, /api/scan, /api/analyze)
│   ├── excavator.py    #   git digging + Lizard complexity
│   ├── brain.py        #   provider-agnostic AI layer (ollama/openai/anthropic/custom)
│   └── requirements.txt
├── frontend/           # React + Vite + Tailwind + Framer Motion
│   └── src/
│       ├── App.jsx
│       ├── api.js          # fetch helpers
│       ├── providers.js    # the "bring your own AI" config + presets
│       ├── storage.js      # recent-repos persistence
│       ├── utils.js        # risk scoring, formatting
│       └── components/     # ScanBar, GraveyardToolbar, Masonry, FileCard (3D),
│                           # SettingsModal, ReportModal, Toasts, …
├── start-backend.bat
└── start-frontend.bat
```

> Note: `app.py`, `brain.py`, `excavator.py` in the repo **root** are the older
> all-in-one Streamlit prototype. The web app lives in `backend/` + `frontend/`.
