"""
app.py
------
The Streamlit dashboard for Code Archaeologist.

Run it with:
    streamlit run app.py

It ties everything together:
  - excavator.py  -> digs through git history & scores complexity
  - brain.py      -> asks local Llama 3 to explain a file

The whole tool is local and free. Nothing leaves your machine.
"""

import os

import streamlit as st

# Our own helper modules (the two files we wrote alongside this one).
from excavator import (
    find_abandoned_files,
    score_complexity,
    get_repo_overview,
    get_recent_commit_messages,
)
from brain import analyze_code_with_ollama


# ---------------------------------------------------------------------------
# Page configuration (title, icon, layout). Must be the first Streamlit call.
# ---------------------------------------------------------------------------
st.set_page_config(
    page_title="Code Archaeologist",
    page_icon="🏺",
    layout="wide",
)


def read_file_safely(repo_path, relative_path):
    """
    Read a file's contents as text, ignoring weird/binary bytes.

    Returns the file text, or None if it can't be read (e.g. binary).
    """
    full_path = os.path.join(repo_path, relative_path)
    try:
        # errors="ignore" lets us skip bytes that aren't valid text
        # instead of crashing on a binary file.
        with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    except (OSError, UnicodeDecodeError):
        return None


# ---------------------------------------------------------------------------
# Sidebar: where the user types the path to the repo they want to excavate.
# ---------------------------------------------------------------------------
st.sidebar.title("🏺 Code Archaeologist")
st.sidebar.caption("Dig up your repo's forgotten, risky code. 100% local.")

repo_path = st.sidebar.text_input(
    "Local repository folder path",
    placeholder="C:/path/to/your/project",
    help="Point this at a folder that is a git repository (has a .git folder).",
)

scan_clicked = st.sidebar.button("⛏️  Excavate", type="primary")

# We use Streamlit's "session_state" to remember results between clicks,
# so the dashboard doesn't have to re-scan every time the user switches tabs.
if "scanned" not in st.session_state:
    st.session_state.scanned = False

# When the user clicks "Excavate", do the heavy scanning ONCE and cache it.
if scan_clicked:
    if not repo_path:
        st.sidebar.error("Please enter a repository path first.")
    else:
        try:
            with st.spinner("Digging through git history..."):
                overview = get_repo_overview(repo_path)
                abandoned = find_abandoned_files(repo_path, top_n=10)
                graveyard = score_complexity(repo_path, abandoned)

            # Stash everything we found into session_state for the tabs to use.
            st.session_state.scanned = True
            st.session_state.repo_path = repo_path
            st.session_state.overview = overview
            st.session_state.graveyard = graveyard
            st.sidebar.success("Excavation complete!")
        except ValueError as err:
            # Friendly message if the path wasn't a real git repo.
            st.session_state.scanned = False
            st.sidebar.error(str(err))


# ---------------------------------------------------------------------------
# Main area: three tabs.
# ---------------------------------------------------------------------------
st.title("Code Archaeologist")

tab_overview, tab_graveyard, tab_explorer = st.tabs(
    ["📊 Overview", "🪦 The Graveyard", "🔎 File Explorer"]
)


# --- Tab 1: Overview --------------------------------------------------------
with tab_overview:
    st.header("Repository Overview")

    if not st.session_state.scanned:
        st.info("👈 Enter a repo path in the sidebar and click **Excavate** to begin.")
    else:
        overview = st.session_state.overview

        # st.columns lets us show several stats side-by-side as metric cards.
        col1, col2, col3, col4 = st.columns(4)
        col1.metric("Total Commits", overview["total_commits"])
        col2.metric("Tracked Files", overview["total_files"])
        col3.metric("Contributors", overview["contributors"])
        col4.metric("Active Branch", overview["active_branch"])

        if overview["last_commit_date"]:
            st.caption(
                "Most recent commit: "
                f"{overview['last_commit_date'].strftime('%Y-%m-%d %H:%M')}"
            )


# --- Tab 2: The Graveyard ---------------------------------------------------
with tab_graveyard:
    st.header("🪦 The Graveyard — most abandoned files")
    st.caption(
        "These files have gone the longest without a commit. "
        "High complexity + long neglect = likely technical debt."
    )

    if not st.session_state.scanned:
        st.info("👈 Run an excavation first to populate the graveyard.")
    else:
        graveyard = st.session_state.graveyard

        # Build a clean, table-friendly list of rows for display.
        table_rows = []
        for record in graveyard:
            table_rows.append({
                "File": record["path"],
                "Days Idle": record["days_idle"],
                "Last Touched": record["last_commit"].strftime("%Y-%m-%d"),
                "Last Author": record["author"],
                "Avg Complexity": record["avg_complexity"],
                "Max Complexity": record["max_complexity"],
                "Functions": record["function_count"],
                "Lines (NLOC)": record["nloc"],
            })

        # st.dataframe gives us a nice sortable table for free.
        st.dataframe(table_rows, use_container_width=True, hide_index=True)

        # Gently flag the scariest file: old AND complex.
        risky = [r for r in graveyard if r["avg_complexity"] >= 10]
        if risky:
            st.warning(
                f"⚠️ {len(risky)} abandoned file(s) have high average "
                "complexity (>=10). These are prime technical-debt suspects."
            )


# --- Tab 3: File Explorer ---------------------------------------------------
with tab_explorer:
    st.header("🔎 File Explorer — AI Archaeology Report")
    st.caption(
        "Pick a file, then let the local Llama 3 model explain why it "
        "exists and what changed most recently."
    )

    if not st.session_state.scanned:
        st.info("👈 Run an excavation first, then pick a file to analyze.")
    else:
        graveyard = st.session_state.graveyard
        repo_path = st.session_state.repo_path

        # Let the user choose one of the abandoned files to investigate.
        file_choices = [record["path"] for record in graveyard]
        selected_file = st.selectbox("Choose a file to analyze", file_choices)

        if st.button("🧠 Generate Archaeology Report"):
            # Step 1: read the raw code of the chosen file.
            code = read_file_safely(repo_path, selected_file)

            if code is None:
                st.error(
                    "Could not read this file as text (it may be binary)."
                )
            else:
                # Step 2: get its 5 most recent commit messages for context.
                commit_messages = get_recent_commit_messages(
                    repo_path, selected_file, count=5
                )

                # Step 3: ask the local model and show the result.
                with st.spinner("Consulting the local Llama 3 oracle..."):
                    report = analyze_code_with_ollama(code, commit_messages)

                st.subheader("📜 Archaeology Report")
                st.write(report)

                # Show the context we used, tucked away in expanders so the
                # main report stays clean.
                with st.expander("Recent commit messages used as context"):
                    if commit_messages:
                        for i, msg in enumerate(commit_messages, start=1):
                            st.write(f"{i}. {msg}")
                    else:
                        st.write("(none found)")

                with st.expander("Raw source code"):
                    st.code(code)
