"""
excavator.py
------------
The "digging" layer of Code Archaeologist (backend version).

Two jobs:
  1. Find the most "abandoned" files in a git repo (longest time
     since their last commit).
  2. Score those files with Lizard for cyclomatic complexity, so we
     can surface risky technical debt.

Everything is local and free: it only reads git history already on
your machine.
"""

import os
from datetime import datetime, timezone

import lizard
from git import Repo, InvalidGitRepositoryError, NoSuchPathError


# Source extensions Lizard understands. We only run complexity analysis
# on these so we don't waste time on images, docs, etc.
ANALYZABLE_EXTENSIONS = {
    ".py", ".js", ".ts", ".jsx", ".tsx", ".java", ".c", ".cpp",
    ".cc", ".h", ".hpp", ".cs", ".go", ".rb", ".php", ".swift",
    ".kt", ".rs", ".m", ".scala",
}


def _is_text_file(extension):
    """Should we even try to analyze this file type?"""
    return extension.lower() in ANALYZABLE_EXTENSIONS


def _open_repo(repo_path):
    """Open a folder as a git repo, with a clear error if it isn't one."""
    try:
        return Repo(repo_path)
    except (InvalidGitRepositoryError, NoSuchPathError):
        raise ValueError(
            f"'{repo_path}' is not a valid git repository. "
            "Make sure the folder exists and contains a .git directory."
        )


def find_abandoned_files(repo_path, top_n=10):
    """
    Return the most 'abandoned' files (oldest most-recent-commit first).

    Args:
        repo_path (str): Path to a local git repo.
        top_n (int):     How many files to return.

    Returns:
        list[dict]: each {path, last_commit (ISO str), days_idle,
                          author, message}
    """
    repo = _open_repo(repo_path)

    # 'git ls-files' = the files git actually tracks (ignores venv/ etc).
    tracked_files = repo.git.ls_files().splitlines()

    abandoned = []
    now = datetime.now(timezone.utc)  # timezone-aware so subtraction is safe

    for file_path in tracked_files:
        # Newest commit that touched just this one file.
        commits = list(repo.iter_commits(paths=file_path, max_count=1))
        if not commits:
            continue

        last_commit = commits[0]
        last_date = last_commit.committed_datetime
        days_idle = (now - last_date).days

        abandoned.append({
            "path": file_path,
            # Send dates to the frontend as ISO strings (JSON-friendly).
            "last_commit": last_date.isoformat(),
            "days_idle": days_idle,
            "author": last_commit.author.name,
            "message": last_commit.message.strip().split("\n")[0],
        })

    # Most idle first, then keep the top N.
    abandoned.sort(key=lambda item: item["days_idle"], reverse=True)
    return abandoned[:top_n]


def score_complexity(repo_path, file_records):
    """
    Enrich file records with Lizard complexity metrics.

    Adds: avg_complexity, max_complexity, function_count, nloc, analyzed.
    """
    enriched = []

    for record in file_records:
        item = dict(record)  # copy so we don't mutate the caller's data

        full_path = os.path.join(repo_path, record["path"])
        extension = os.path.splitext(full_path)[1]

        item.update({
            "avg_complexity": 0.0,
            "max_complexity": 0,
            "function_count": 0,
            "nloc": 0,
            "analyzed": False,
        })

        if _is_text_file(extension) and os.path.isfile(full_path):
            try:
                analysis = lizard.analyze_file(full_path)
                functions = analysis.function_list

                if functions:
                    complexities = [fn.cyclomatic_complexity for fn in functions]
                    item["avg_complexity"] = round(
                        sum(complexities) / len(complexities), 2
                    )
                    item["max_complexity"] = max(complexities)
                    item["function_count"] = len(functions)

                item["nloc"] = analysis.nloc
                item["analyzed"] = True
            except Exception:
                # Never crash on a weird file; just leave the zeros.
                item["analyzed"] = False

        enriched.append(item)

    return enriched


def get_repo_overview(repo_path):
    """High-level repo stats for the Overview view."""
    repo = _open_repo(repo_path)

    commits = list(repo.iter_commits())
    contributors = {commit.author.name for commit in commits}
    tracked_files = repo.git.ls_files().splitlines()

    try:
        branch_name = repo.active_branch.name
    except TypeError:
        branch_name = "(detached HEAD)"

    return {
        "total_commits": len(commits),
        "total_files": len(tracked_files),
        "contributors": len(contributors),
        "active_branch": branch_name,
        "last_commit_date": (
            commits[0].committed_datetime.isoformat() if commits else None
        ),
    }


def get_recent_commit_messages(repo_path, file_path, count=5):
    """Most recent commit message summaries that touched a single file."""
    repo = _open_repo(repo_path)
    commits = repo.iter_commits(paths=file_path, max_count=count)
    return [commit.message.strip().split("\n")[0] for commit in commits]


def read_file_text(repo_path, file_path):
    """
    Read a file's contents as text, ignoring undecodable bytes.

    Returns the text, or None if it can't be read (e.g. binary file).
    """
    full_path = os.path.join(repo_path, file_path)
    try:
        with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    except (OSError, UnicodeDecodeError):
        return None
