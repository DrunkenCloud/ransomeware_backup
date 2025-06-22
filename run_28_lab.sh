#!/bin/bash

# 28_lab Ransomware Detection System Automation Script
# This script will:
# 1. Create and activate a Python virtual environment
# 2. Install dependencies from requirements.txt
# 3. Check if ransomware_model.joblib exists, run modeling.py if not
# 4. Run file_monitor.py in the background
# 5. Run app.py (Flask web application)

set -e  # Exit on any error

echo "=== 28_lab Ransomware Detection System Automation ==="

# Function to cleanup processes on exit
cleanup() {
    echo -e "\nCleaning up processes..."
    if [ ! -z "$FILE_MONITOR_PID" ]; then
        echo "Stopping file monitor (PID: $FILE_MONITOR_PID)..."
        kill $FILE_MONITOR_PID 2>/dev/null || true
    fi
    if [ ! -z "$FLASK_PID" ]; then
        echo "Stopping Flask app (PID: $FLASK_PID)..."
        kill $FLASK_PID 2>/dev/null || true
    fi
    echo "All services stopped."
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check if Python 3 is available
echo "Checking Python version..."
python3 --version || {
    echo "Error: Python 3 is required but not found."
    echo "Please install Python 3 and try again."
    exit 1
}

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo "Virtual environment created successfully."
else
    echo "Virtual environment already exists."
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies from requirements.txt..."
pip install -r requirements.txt
echo "Dependencies installed successfully."

# Check if ransomware model exists
if [ ! -f "28_lab/ransomware_model.joblib" ]; then
    echo "Ransomware model not found. Running modeling.py..."
    python 28_lab/modeling.py
    echo "Modeling completed successfully."
else
    echo "Ransomware model found."
fi

# Start file monitor in background (run from 28_lab directory)
echo "Starting file monitor..."
cd 28_lab
python file_monitor.py &
FILE_MONITOR_PID=$!
cd ..
echo "File monitor started with PID: $FILE_MONITOR_PID"

# Give file monitor a moment to start
sleep 2

# Start Flask app in background (run from 28_lab directory)
echo "Starting Flask application..."
cd 28_lab
python app.py &
FLASK_PID=$!
cd ..
echo "Flask app started with PID: $FLASK_PID"
echo "Flask application is running at http://localhost:5000"

echo -e "\n=== System is running ==="
echo "File monitor: Running in background (PID: $FILE_MONITOR_PID)"
echo "Flask app: http://localhost:5000 (PID: $FLASK_PID)"
echo "Press Ctrl+C to stop all services"

# Keep the script alive and monitor processes
while true; do
    # Check if file monitor is still running
    if ! kill -0 $FILE_MONITOR_PID 2>/dev/null; then
        echo "File monitor has stopped unexpectedly."
        break
    fi
    
    # Check if Flask app is still running
    if ! kill -0 $FLASK_PID 2>/dev/null; then
        echo "Flask app has stopped unexpectedly."
        break
    fi
    
    sleep 1
done

# Cleanup will be called automatically by the trap 