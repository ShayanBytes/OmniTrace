@echo off
REM ===========================================================================
REM  Code Archaeologist - One-Click Setup for Windows
REM ---------------------------------------------------------------------------
REM  This script walks you through getting the app running:
REM    1. Reminds you to install Ollama (the local AI engine).
REM    2. Downloads the free Llama 3 model.
REM    3. Creates an isolated Python virtual environment.
REM    4. Installs the Python libraries the app needs.
REM    5. Launches the Streamlit dashboard in your browser.
REM
REM  Everything is local and free. No paid API keys required.
REM ===========================================================================

echo.
echo ==========================================================
echo            CODE ARCHAEOLOGIST - SETUP
echo ==========================================================
echo.

REM --- Step 1: Make sure Ollama is installed --------------------------------
echo [STEP 1 of 5] Checking for Ollama (the local AI engine)...
echo.
echo   If you have NOT installed Ollama yet, please:
echo     1. Open https://ollama.com/download in your browser
echo     2. Download and install Ollama for Windows
echo     3. Then re-run this setup.bat
echo.
where ollama >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo   [!] Ollama was not found on your system PATH.
    echo       Please install it from https://ollama.com/download and run this again.
    echo.
    pause
    exit /b 1
)
echo   [OK] Ollama is installed.
echo.

REM --- Step 2: Pull the Llama 3 model ---------------------------------------
echo [STEP 2 of 5] Downloading the Llama 3 model (this can take a while)...
echo.
ollama pull llama3
if %ERRORLEVEL% NEQ 0 (
    echo   [!] Failed to pull the llama3 model. Make sure Ollama is running.
    pause
    exit /b 1
)
echo   [OK] llama3 model is ready.
echo.

REM --- Step 3: Create a Python virtual environment --------------------------
echo [STEP 3 of 5] Creating a Python virtual environment (folder: venv)...
echo.
python -m venv venv
if %ERRORLEVEL% NEQ 0 (
    echo   [!] Could not create the virtual environment.
    echo       Make sure Python 3 is installed and on your PATH.
    pause
    exit /b 1
)
echo   [OK] Virtual environment created.
echo.

REM --- Step 4: Install the Python requirements ------------------------------
echo [STEP 4 of 5] Installing Python libraries from requirements.txt...
echo.
REM  Activate the venv so 'pip' installs INTO it, not globally.
call venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo   [!] Failed to install requirements. Check the messages above.
    pause
    exit /b 1
)
echo   [OK] All libraries installed.
echo.

REM --- Step 5: Launch the app -----------------------------------------------
echo [STEP 5 of 5] Launching Code Archaeologist...
echo.
echo   The dashboard will open in your web browser shortly.
echo   To stop the app later, come back to this window and press Ctrl+C.
echo.
streamlit run app.py

pause
