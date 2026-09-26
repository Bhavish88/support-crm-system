#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

echo "=== 1/2: Installing Python backend dependencies ==="
pip install -r requirements.txt

echo "=== 2/2: Installing frontend dependencies & building React app ==="
npm --prefix frontend install
npm --prefix frontend run build

echo "=== Build completed successfully! frontend/dist is ready. ==="
