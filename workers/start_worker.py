#!/usr/bin/env python3
"""
Start Celery worker with HTTP health check server for Cloud Run.
Cloud Run Services require listening on PORT, even for workers.
"""
import os
import sys
import signal
import subprocess
from http.server import HTTPServer, BaseHTTPRequestHandler
from threading import Thread


class HealthCheckHandler(BaseHTTPRequestHandler):
    """Simple health check handler for Cloud Run."""

    def do_GET(self):
        """Handle GET requests to health endpoint."""
        if self.path in ('/', '/health', '/healthz'):
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'OK')
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        """Suppress default logging."""
        pass  # Silent by default


def start_health_server(port=8080):
    """Start HTTP server for health checks in background thread."""
    server = HTTPServer(('0.0.0.0', port), HealthCheckHandler)
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    print(f"Health check server started on port {port}", flush=True)
    return server


def start_celery():
    """Start Celery worker process."""
    celery_cmd = [
        'celery', '-A', 'backend.tasks.celery_app', 'worker',
        '--loglevel=info',
        '--concurrency=2',
        '--max-tasks-per-child=10',
        '--time-limit=900',
        '--soft-time-limit=840'
    ]

    print(f"Starting Celery worker: {' '.join(celery_cmd)}", flush=True)
    return subprocess.Popen(celery_cmd)


def main():
    """Start health server and Celery worker."""
    port = int(os.environ.get('PORT', 8080))

    # Start health check server
    health_server = start_health_server(port)

    # Start Celery worker
    celery_process = start_celery()

    # Handle shutdown signals
    def shutdown_handler(signum, frame):
        print(f"\nReceived signal {signum}, shutting down...", flush=True)
        health_server.shutdown()
        celery_process.terminate()
        celery_process.wait(timeout=10)
        sys.exit(0)

    signal.signal(signal.SIGTERM, shutdown_handler)
    signal.signal(signal.SIGINT, shutdown_handler)

    # Wait for Celery to exit
    try:
        exit_code = celery_process.wait()
        print(f"Celery worker exited with code {exit_code}", flush=True)
        sys.exit(exit_code)
    except KeyboardInterrupt:
        shutdown_handler(signal.SIGINT, None)


if __name__ == '__main__':
    main()
