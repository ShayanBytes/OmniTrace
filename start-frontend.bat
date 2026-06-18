@echo off
REM ===========================================================================
REM  OmniTrace - Start the React frontend (the web UI)
REM ---------------------------------------------------------------------------
REM  This launches the Vite dev server on http://localhost:5173 and proxies
REM  /api calls to the backend on port 8000. Start start-backend.bat first.
REM ===========================================================================

echo.
echo ==========================================================
echo             OMNITRACE - WEB UI (port 5173)
echo ==========================================================
echo.

cd frontend

REM --- Install node modules on first run ------------------------------------
if not exist node_modules (
    echo [1/2] Installing frontend dependencies (first run only)...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo   [!] npm install failed. Is Node.js installed?
        pause
        exit /b 1
    )
)

echo [2/2] Starting the UI on http://localhost:5173 ...
echo       (Press Ctrl+C to stop.)
echo.
call npm run dev

pause
