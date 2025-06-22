@echo off
setlocal enabledelayedexpansion

REM 28_lab Ransomware Detection System Automation Script
REM This script will:
REM 1. Create and activate a Python virtual environment
REM 2. Install dependencies from requirements.txt
REM 3. Check if ransomware_model.joblib exists, run modeling.py if not
REM 4. Run file_monitor.py in the background
REM 5. Run app.py (Flask web application)

echo === 28_lab Ransomware Detection System Automation ===

REM Check if Python is available
echo Checking Python version...
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is required but not found.
    echo Please install Python and try again.
    pause
    exit /b 1
)

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo Failed to create virtual environment.
        pause
        exit /b 1
    )
    echo Virtual environment created successfully.
) else (
    echo Virtual environment already exists.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo Failed to activate virtual environment.
    pause
    exit /b 1
)

REM Install dependencies
echo Installing dependencies from requirements.txt...
pip install -r requirements.txt
if errorlevel 1 (
    echo Failed to install dependencies.
    pause
    exit /b 1
)
echo Dependencies installed successfully.

REM Check if ransomware model exists
if not exist "28_lab\ransomware_model.joblib" (
    echo Ransomware model not found. Running modeling.py...
    python 28_lab\modeling.py
    if errorlevel 1 (
        echo Failed to run modeling.py.
        pause
        exit /b 1
    )
    echo Modeling completed successfully.
) else (
    echo Ransomware model found.
)

REM Start file monitor in background (run from 28_lab directory)
echo Starting file monitor...
cd 28_lab
start /B python file_monitor.py
set FILE_MONITOR_PID=%ERRORLEVEL%
cd ..
echo File monitor started.

REM Give file monitor a moment to start
timeout /t 2 /nobreak >nul

REM Start Flask app in background (run from 28_lab directory)
echo Starting Flask application...
cd 28_lab
start /B python app.py
set FLASK_PID=%ERRORLEVEL%
cd ..
echo Flask app started.
echo Flask application is running at http://localhost:5000

echo.
echo === System is running ===
echo File monitor: Running in background
echo Flask app: http://localhost:5000
echo Press Ctrl+C to stop all services
echo.

REM Keep the script alive
echo Press any key to stop all services...
pause >nul

REM Cleanup - stop background processes
echo.
echo Cleaning up processes...
taskkill /f /im python.exe >nul 2>&1
echo All services stopped.
pause 