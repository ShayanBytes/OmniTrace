"""
brain.py
--------
The "AI" layer of OmniTrace.

This module talks to a LOCAL Llama 3 model running inside Ollama.
There are NO paid cloud APIs here. Everything happens on your own
machine via a simple HTTP request to Ollama's local server.

Ollama, once installed and running, exposes an HTTP endpoint at:
    http://localhost:11434/api/generate

We send it a prompt, it sends back a generated explanation.
"""

import requests

# Where the local Ollama server listens. This is the default and
# does not need to change unless you reconfigured Ollama yourself.
OLLAMA_URL = "http://localhost:11434/api/generate"

# The local model we ask the user to install via `ollama pull llama3`.
OLLAMA_MODEL = "llama3"

# How long (seconds) we wait before giving up. Local models can be
# slow on the first run, so we allow a generous timeout.
REQUEST_TIMEOUT = 120


def analyze_code_with_ollama(code, recent_commit_messages):
    """
    Ask the local Llama 3 model to explain a file for a junior developer.

    Args:
        code (str):
            The raw text contents of the file we want explained.
        recent_commit_messages (list[str]):
            The file's 5 most recent commit messages, newest first.
            These give the model context about what changed lately.

    Returns:
        str: The model's "Archaeology Report" text, OR a friendly
             error message explaining what went wrong (e.g. Ollama
             not running). We never raise here so the UI stays alive.
    """
    # Turn the list of commit messages into a clean, numbered block
    # so the model can read the recent history easily.
    if recent_commit_messages:
        history_block = "\n".join(
            f"{i + 1}. {msg}" for i, msg in enumerate(recent_commit_messages)
        )
    else:
        history_block = "(no recent commit messages found)"

    # Build the full prompt. The core instruction is exactly what the
    # spec asks for; we wrap it with the code and commit history so the
    # model has everything it needs to give a useful answer.
    prompt = (
        "You are a helpful senior engineer mentoring a junior developer.\n\n"
        "Here are the 5 most recent commit messages for this file "
        "(newest first):\n"
        f"{history_block}\n\n"
        "Here is the raw source code of the file:\n"
        "-----------------------------------------\n"
        f"{code}\n"
        "-----------------------------------------\n\n"
        "Explain why this file exists and what the latest major change "
        "was, in 3 sentences for a junior developer."
    )

    # The JSON body Ollama expects. stream=False means "send the whole
    # answer back at once" instead of streaming token-by-token, which
    # keeps our code simple.
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
    }

    # Step 1: Try to reach the local Ollama server.
    try:
        response = requests.post(
            OLLAMA_URL,
            json=payload,
            timeout=REQUEST_TIMEOUT,
        )
    except requests.exceptions.ConnectionError:
        # The most common problem: Ollama isn't running at all.
        return (
            "Could not connect to Ollama at http://localhost:11434.\n\n"
            "Please make sure Ollama is installed and running, then try "
            "again. You can start it by opening the Ollama app, and make "
            "sure you have run:  ollama pull llama3"
        )
    except requests.exceptions.Timeout:
        # The model took too long (often on a very first, cold request).
        return (
            "Ollama took too long to respond. The model may still be "
            "loading into memory. Please wait a moment and try again."
        )

    # Step 2: Check that the server actually returned success (HTTP 200).
    if response.status_code != 200:
        return (
            f"Ollama returned an error (HTTP {response.status_code}). "
            "Make sure the 'llama3' model is installed with: "
            "ollama pull llama3"
        )

    # Step 3: Pull the generated text out of the JSON response.
    # Ollama puts the answer in the "response" field.
    data = response.json()
    return data.get("response", "(Ollama returned an empty response.)").strip()
