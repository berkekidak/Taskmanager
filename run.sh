#!/bin/bash

function cleanup {
  echo "Stopping servers..."

  kill "$B_PID" 2>/dev/null || true
  kill "$F_PID" 2>/dev/null || true

  wait "$B_PID" 2>/dev/null || true
  wait "$F_PID" 2>/dev/null || true

  exit
}

function setup_frontend {
  echo "Setting up frontend..."

  (
    cd ./frontend/ || exit 1

    if [ ! -d "node_modules" ]; then
      echo "Installing node dependencies..."
      npm install
    fi

    npm run dev >../front.log 2>&1
  ) &

  F_PID=$!
}

function setup_backend {
  echo "Setting up backend..."

  (
    cd ./backend/ || exit 1

    if [ ! -d ".venv" ]; then
      echo "Setting up venv..."
      python3 -m venv .venv
      if [ -f "requirements.txt" ]; then
        pip install -r requirements.txt
      fi
    fi

    source .venv/bin/activate

    uvicorn main:app --reload --port 5000 >../back.log 2>&1
  ) &

  B_PID=$!
}

trap cleanup SIGINT SIGTERM

clear
echo "Running servers and setting up..."

setup_backend
setup_frontend

echo
echo "Frontend: http://localhost:8000"
echo "Backend:  http://localhost:5000"
echo
echo "Press Ctrl+C to stop both."

wait
