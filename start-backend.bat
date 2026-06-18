@echo off
REM ===========================================================================
REM  Code Archaeologist - Start the FastAPI backend (the "API" half)
REM ---------------------------------------------------------------------------
REM  This serves the git-digging + AI endpoints on http://localhost:8000.
REM  Run start-frontend.bat in a SECOND terminal for the web UI.
REM ===========================================================================

echo.
echo ==========================================================
echo        CODE ARCHAEOLOGIST - BACKEND API (port 8000)
echo ==========================================================
echo.

REM --- Create the virtual environment on first run --------------------------
if not exist venv (
    echo [1/3] Creating Python virtual environment...
    python -m venv venv
    if %ERRORLEVEL% NEQ 0 (
        echo   [!] Could not create venv. Is Python 3 installed and on PATH?
        pause
        exit /b 1
    )
)

REM --- Activate it ----------------------------------------------------------
call venv\Scripts\activate.bat

REM --- Install backend requirements -----------------------------------------
echo [2/3] Installing Python requirements...
python -m pip install --upgrade pip >nul
pip install -r backend\requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo   [!] Failed to install requirements. See messages above.
    pause
    exit /b 1
)

REM --- Launch uvicorn from inside the backend folder ------------------------
echo [3/3] Starting the API on http://localhost:8000 ...
echo       (Press Ctrl+C to stop.)
echo.
cd backend
uvicorn main:app --reload --port 8000

pause
