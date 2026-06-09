#!/bin/sh
set -e

# ─── start.sh — Robust container startup ─────────────────────────────
# Starts Express API server with auto-restart and nginx in foreground.
# If Express crashes for any reason (DB timeout, port conflict, etc.),
# it restarts automatically after 3 seconds.
# ──────────────────────────────────────────────────────────────────────

echo "[start.sh] 🚀 Starting municipalidad eldorado.gob.ar..."

# ─── Start Express API with auto-restart ──────────────────────────────
start_api() {
  while true; do
    echo "[start.sh] 📡 Starting Express API server..."
    node /app/server/index.cjs
    EXIT_CODE=$?
    echo "[start.sh] ⚠️  Express API exited with code $EXIT_CODE — restarting in 3s..."
    sleep 3
  done
}

start_api &
API_PID=$!
echo "[start.sh] 📡 Express API monitor started (PID: $API_PID)"

# ─── Start nginx in foreground ───────────────────────────────────────
echo "[start.sh] 🌐 Starting nginx..."
exec nginx -g 'daemon off;'
