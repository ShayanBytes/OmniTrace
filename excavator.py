"""
excavator.py
------------
The "digging" layer of OmniTrace.

This module is responsible for two jobs:
  1. Finding the most "abandoned" files in a git repository
     (the files that have gone the longest without being touched).
  2. Measuring how complex those files are using Lizard, so we can
     spot risky "technical debt" hiding in forgotten corners.

Everything here is local and free: it only reads the git history
that already lives on your machine.
"""

import os
from datetime import datetime, timezone

import lizard
from git import Repo, InvalidGitRepositoryError, NoSuchPathError


# File extensions Lizard understands well. We only run complexity
# analysis on these so we don't waste time on images, text, etc.
ANALYZABLE_EXTENSIONS = {
    ".py", ".js", ".ts", ".jsx", ".tsx", ".java", ".c", ".cpp",
    ".cc", ".h", ".hpp", ".cs", ".go", ".rb", ".php", ".swift",
    ".kt", ".rs", ".m", ".scala",
}


def _is_text_file(extension):
    """Tiny helper: should we even try to read/analyze this file type?"""
    return extension.lower() in ANALYZABLE_EXTENSIONS


def find_abandoned_files(repo_path, top_n=10):
    """
    Scan a local git repository and return the most 'abandoned' files.

    An abandoned file is simply one whose most recent commit is the
    oldest. In other words: nobody has touched it in a long time.

    Args:
        repo_path (str): Path to a local folder that is a git repo.
        top_n (int):     How many abandoned files to return (default 10).

    Returns:
        list[dict]: One dict per file, sorted oldest-touched first:
            {
                "path":        "src/old_module.py",
                "last_commit": datetime,      # when it was last changed
                "days_idle":   412,           # days since that change
                "author":      "Jane Dev",    # who last touched it
                "message":     "fix typo",    # last commit message
            }

    Raises:
        ValueError: if the path is not a valid git repository.
    """
    # Step 1: Try to open the folder as a git repo. If it isn't one,
    # give the caller a clear, friendly error instead of a cryptic crash.
    try:
        repo = Repo(repo_path)
    except (InvalidGitRepositoryError, NoSuchPathError):
        raise ValueError(
            f"'{repo_path}' is not a valid git repository. "
            "Make sure the folder exists and contains a .git directory."
        )

    # Step 2: Ask git for the list of files it is actually tracking.
    # 'git ls-files' is fast and ignores untracked junk like venv/.
    tracked_files = repo.git.ls_files().splitlines()

    abandoned = []
    # 'now' is timezone-aware (UTC) so we can safely subtract commit dates.
    now = datetime.now(timezone.utc)

    # Step 3: For each tracked file, find ITS most recent commit.
    for file_path in tracked_files:
        # iter_commits(paths=...) walks the history of just this one file.
        # max_count=1 means "only give me the newest commit that touched it".
        commits = list(repo.iter_commits(paths=file_path, max_count=1))
        if not commits:
            # No commit history for this file (rare) -> skip it.
            continue

        last_commit = commits[0]
        # committed_datetime is timezone-aware, so this subtraction is safe.
        last_date = last_commit.committed_datetime
        days_idle = (now - last_date).days

        abandoned.append({
            "path": file_path,
            "last_commit": last_date,
            "days_idle": days_idle,
            "author": last_commit.author.name,
            "message": last_commit.message.strip().split("\n")[0],
        })

    # Step 4: Sort so the most idle (largest days_idle) come first,
    # then keep only the top N "graveyard" files.
    abandoned.sort(key=lambda item: item["days_idle"], reverse=True)
    return abandoned[:top_n]


def score_complexity(repo_path, file_records):
    """
    Run Lizard on a set of files to measure their code complexity.

    Cyclomatic complexity roughly counts the number of independent
    paths through the code. Higher numbers = harder to test and more
    likely to hide bugs. Combine that with "nobody has touched this
    in a year" and you have classic technical debt.

    Args:
        repo_path (str):           Path to the local git repo.
        file_records (list[dict]): The output of find_abandoned_files().

    Returns:
        list[dict]: The same records, each enriched with:
            {
                ... (original keys) ...,
                "avg_complexity": 7.5,   # average cyclomatic complexity
                "max_complexity": 22,    # worst single function
                "function_count": 12,    # number of functions found
                "nloc": 340,             # lines of code (no blanks/comments)
                "analyzed": True,        # False if we couldn't analyze it
            }
    """
    enriched = []

    for record in file_records:
        # Work on a copy so we never mutate the caller's data unexpectedly.
        item = dict(record)

        # Build the absolute path to the file on disk.
        full_path = os.path.join(repo_path, record["path"])
        extension = os.path.splitext(full_path)[1]

        # Default values for files we can't (or shouldn't) analyze.
        item.update({
            "avg_complexity": 0.0,
            "max_complexity": 0,
            "function_count": 0,
            "nloc": 0,
            "analyzed": False,
        })

        # Only analyze supported source files that still exist on disk.
        if _is_text_file(extension) and os.path.isfile(full_path):
            try:
                # Lizard does all the heavy lifting in one call.
                analysis = lizard.analyze_file(full_path)
                functions = analysis.function_list

                if functions:
                    complexities = [fn.cyclomatic_complexity for fn in functions]
                    item["avg_complexity"] = round(
                        sum(complexities) / len(complexities), 2
                    )
                    item["max_complexity"] = max(complexities)
                    item["function_count"] = len(functions)

                # nloc = "normalized lines of code" (code only, no blanks).
                item["nloc"] = analysis.nloc
                item["analyzed"] = True
            except Exception:
                # If Lizard chokes on a weird file, don't crash the app;
                # just leave the default zeros and mark it un-analyzed.
                item["analyzed"] = False

        enriched.append(item)

    return enriched


def get_repo_overview(repo_path):
    """
    Collect simple, high-level stats about the repository.

    Used by the dashboard's "Overview" tab.

    Returns:
        dict: {
            "total_commits": int,
            "total_files":   int,
            "contributors":  int,
            "active_branch": str,
            "last_commit_date": datetime or None,
        }
    """
    try:
        repo = Repo(repo_path)
    except (InvalidGitRepositoryError, NoSuchPathError):
        raise ValueError(f"'{repo_path}' is not a valid git repository.")

    commits = list(repo.iter_commits())
    # A set automatically removes duplicate author names.
    contributors = {commit.author.name for commit in commits}
    tracked_files = repo.git.ls_files().splitlines()

    # The active branch can fail in a "detached HEAD" state, so guard it.
    try:
        branch_name = repo.active_branch.name
    except TypeError:
        branch_name = "(detached HEAD)"

    return {
        "total_commits": len(commits),
        "total_files": len(tracked_files),
        "contributors": len(contributors),
        "active_branch": branch_name,
        "last_commit_date": commits[0].committed_datetime if commits else None,
    }


def get_recent_commit_messages(repo_path, file_path, count=5):
    """
    Get the most recent commit messages that touched a single file.

    The AI 'brain' uses these messages as context so it can explain
    what the latest major change to a file actually was.

    Args:
        repo_path (str):  Path to the local git repo.
        file_path (str):  File path relative to the repo root.
        count (int):      How many recent messages to fetch (default 5).

    Returns:
        list[str]: Up to `count` commit message summaries, newest first.
    """
    repo = Repo(repo_path)
    commits = repo.iter_commits(paths=file_path, max_count=count)
    # Keep just the first line of each message to stay short and readable.
    return [commit.message.strip().split("\n")[0] for commit in commits]
