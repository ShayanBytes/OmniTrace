"""
brain.py
--------
The provider-agnostic "AI" layer of OmniTrace.

The user chooses an AI provider at runtime from the UI and (for cloud
providers) supplies their OWN API key. Supported providers:

  - "ollama"   : local Llama 3 (or any local model). FREE, no key.
  - "openai"   : OpenAI Chat Completions (bring your own key).
  - "anthropic": Anthropic Claude Messages API (bring your own key).
  - "custom"   : any OpenAI-COMPATIBLE endpoint (Groq, OpenRouter,
                 LM Studio, Together, etc.) via a custom base URL.

Keys are passed in per-request from the frontend; we never store them.
The function never raises on a provider/network error — it returns a
readable message string instead, so the UI stays alive.
"""

import requests

# Generous timeout: local models can be slow on a cold first request.
REQUEST_TIMEOUT = 120

# The instruction at the heart of every prompt (same for all providers).
CORE_INSTRUCTION = (
    "Explain why this file exists and what the latest major change was, "
    "in 3 sentences for a junior developer."
)


def build_prompt(code, recent_commit_messages):
    """Assemble the full prompt text shared by every provider."""
    if recent_commit_messages:
        history_block = "\n".join(
            f"{i + 1}. {msg}" for i, msg in enumerate(recent_commit_messages)
        )
    else:
        history_block = "(no recent commit messages found)"

    return (
        "You are a helpful senior engineer mentoring a junior developer.\n\n"
        "Here are the 5 most recent commit messages for this file "
        "(newest first):\n"
        f"{history_block}\n\n"
        "Here is the raw source code of the file:\n"
        "-----------------------------------------\n"
        f"{code}\n"
        "-----------------------------------------\n\n"
        f"{CORE_INSTRUCTION}"
    )


def analyze_code(
    code,
    recent_commit_messages,
    provider="ollama",
    model="llama3",
    api_key=None,
    base_url=None,
):
    """
    Generate an 'Archaeology Report' using the chosen AI provider.

    Args:
        code (str):                     Raw file contents.
        recent_commit_messages (list):  Up to 5 recent commit summaries.
        provider (str):                 ollama | openai | anthropic | custom
        model (str):                    Model name for that provider.
        api_key (str | None):           User's key (cloud providers only).
        base_url (str | None):          Base URL (custom / override ollama).

    Returns:
        str: the generated report, or a friendly error message.
    """
    prompt = build_prompt(code, recent_commit_messages)

    # Dispatch to the right provider-specific helper.
    try:
        if provider == "ollama":
            return _call_ollama(prompt, model, base_url)
        elif provider == "openai":
            return _call_openai_compatible(
                prompt, model, api_key,
                base_url or "https://api.openai.com/v1",
                provider_label="OpenAI",
            )
        elif provider == "anthropic":
            return _call_anthropic(prompt, model, api_key, base_url)
        elif provider == "custom":
            if not base_url:
                return "Custom provider needs a Base URL (e.g. https://api.groq.com/openai/v1)."
            return _call_openai_compatible(
                prompt, model, api_key, base_url,
                provider_label="Custom",
            )
        else:
            return f"Unknown provider '{provider}'."
    except requests.exceptions.ConnectionError:
        return (
            f"Could not connect to the '{provider}' provider. "
            "If using Ollama, make sure it is running. If using a cloud "
            "provider, check your internet connection and Base URL."
        )
    except requests.exceptions.Timeout:
        return "The AI provider took too long to respond. Please try again."


# ---------------------------------------------------------------------------
# Ollama (local, free) -- POST http://localhost:11434/api/generate
# ---------------------------------------------------------------------------
def _call_ollama(prompt, model, base_url=None):
    url = (base_url or "http://localhost:11434").rstrip("/") + "/api/generate"
    payload = {"model": model or "llama3", "prompt": prompt, "stream": False}

    response = requests.post(url, json=payload, timeout=REQUEST_TIMEOUT)
    if response.status_code != 200:
        return (
            f"Ollama returned HTTP {response.status_code}. "
            f"Make sure the model is installed:  ollama pull {model or 'llama3'}"
        )
    return response.json().get("response", "(empty response)").strip()


# ---------------------------------------------------------------------------
# OpenAI & OpenAI-compatible (OpenAI, Groq, OpenRouter, LM Studio, ...)
# POST {base_url}/chat/completions  with  Authorization: Bearer <key>
# ---------------------------------------------------------------------------
def _call_openai_compatible(prompt, model, api_key, base_url, provider_label):
    if not api_key:
        return f"{provider_label} requires an API key. Please add one in Settings."

    url = base_url.rstrip("/") + "/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
    }

    response = requests.post(
        url, headers=headers, json=payload, timeout=REQUEST_TIMEOUT
    )
    if response.status_code != 200:
        return (
            f"{provider_label} returned HTTP {response.status_code}: "
            f"{response.text[:300]}"
        )

    data = response.json()
    # Standard OpenAI shape: choices[0].message.content
    return data["choices"][0]["message"]["content"].strip()


# ---------------------------------------------------------------------------
# Anthropic Claude -- POST https://api.anthropic.com/v1/messages
# Uses x-api-key + anthropic-version headers (different shape from OpenAI).
# ---------------------------------------------------------------------------
def _call_anthropic(prompt, model, api_key, base_url=None):
    if not api_key:
        return "Anthropic requires an API key. Please add one in Settings."

    url = (base_url or "https://api.anthropic.com").rstrip("/") + "/v1/messages"
    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "max_tokens": 1024,
        "messages": [{"role": "user", "content": prompt}],
    }

    response = requests.post(
        url, headers=headers, json=payload, timeout=REQUEST_TIMEOUT
    )
    if response.status_code != 200:
        return (
            f"Anthropic returned HTTP {response.status_code}: "
            f"{response.text[:300]}"
        )

    data = response.json()
    # Claude returns content as a list of blocks; grab the text blocks.
    parts = [block.get("text", "") for block in data.get("content", [])]
    return "".join(parts).strip() or "(empty response)"
