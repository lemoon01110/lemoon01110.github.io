#!/bin/bash
set -e

# Instead of passing an absolute path to output-dir (which triggers a bug in Quarto),
# we copy the project to a temp directory and render it there for isolation.
TMP_DIR=$(mktemp -d)
echo "Building site into $TMP_DIR..."
cp -r . "$TMP_DIR/project"
cd "$TMP_DIR/project"

quarto render

echo "Setting up Python virtual environment..."
python3 -m venv .venv
source .venv/bin/activate
pip install playwright
playwright install chromium

echo "Starting local HTTP server..."
python3 -m http.server 8080 --directory _site &
SERVER_PID=$!

# Wait for server to start
sleep 2

echo "Running E2E tests..."
python3 e2e_screenshot.py "http://localhost:8080"

echo "Shutting down server..."
kill $SERVER_PID

echo "E2E tests successfully completed."

# Copy screenshots back to the original root so they can be inspected
cd - > /dev/null
cp "$TMP_DIR/project/screenshot_"*.png .
