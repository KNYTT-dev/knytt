"""
Celery Application Configuration
"""

import os

from celery import Celery
from celery.schedules import crontab


def _build_redis_url() -> str:
    """
    Build Redis URL from environment variables.

    Supports two configuration styles:
    1. REDIS_URL (full URL) - used in local development
    2. REDIS_HOST, REDIS_PORT, REDIS_PASSWORD - used in Cloud Run

    Returns:
        Redis URL string
    """
    # Option 1: Use REDIS_URL if explicitly set
    if redis_url := os.getenv("REDIS_URL"):
        return redis_url

    # Option 2: Construct from REDIS_HOST, REDIS_PORT, REDIS_PASSWORD
    redis_host = os.getenv("REDIS_HOST", "localhost")
    redis_port = os.getenv("REDIS_PORT", "6379")
    redis_password = os.getenv("REDIS_PASSWORD")
    redis_db = os.getenv("REDIS_DB", "0")

    if redis_password:
        return f"redis://:{redis_password}@{redis_host}:{redis_port}/{redis_db}"
    else:
        return f"redis://{redis_host}:{redis_port}/{redis_db}"


# Get configuration from environment
REDIS_URL = _build_redis_url()
CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", REDIS_URL)
CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", REDIS_URL)

# Create Celery app
app = Celery(
    "greenthumb",
    broker=CELERY_BROKER_URL,
    backend=CELERY_RESULT_BACKEND,
    include=[
        "backend.tasks.ingestion",
        "backend.tasks.embeddings",
    ],
)

# Celery configuration
app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
    # Redis backend connection retry settings - fail faster
    redis_retry_on_timeout=True,
    redis_socket_timeout=2,  # 2 second timeout for socket operations
    redis_socket_connect_timeout=2,  # 2 second timeout for connection
    redis_max_connections=10,
    # Reduce backend retry attempts from default 20 to 3
    result_backend_transport_options={
        "master_name": None,
        "socket_timeout": 2,
        "socket_connect_timeout": 2,
        "retry_on_timeout": True,
        "max_connections": 10,
        "retry_max_attempts": 3,  # Reduce from default 20 to 3
    },
    broker_transport_options={
        "socket_timeout": 2,
        "socket_connect_timeout": 2,
        "retry_on_timeout": True,
        "max_connections": 10,
        "retry_max_attempts": 3,  # Reduce from default 20 to 3
    },
)

# Configure periodic tasks with Celery Beat
app.conf.beat_schedule = {
    # Rebuild FAISS index weekly (every Sunday at 3 AM)
    "rebuild-faiss-index-weekly": {
        "task": "tasks.rebuild_faiss_index",
        "schedule": crontab(hour=3, minute=0, day_of_week=0),
        "kwargs": {"embedding_type": "text"},
    },
    # Generate embeddings for new products daily (2 AM)
    "generate-new-product-embeddings-daily": {
        "task": "tasks.generate_product_embeddings",
        "schedule": crontab(hour=2, minute=0),
        "kwargs": {
            "force_regenerate": False,
            "batch_size": 32,
        },
    },
    # Refresh user embeddings for active users (every 6 hours)
    "refresh-active-user-embeddings": {
        "task": "tasks.batch_refresh_user_embeddings",
        "schedule": crontab(minute=0, hour="*/6"),
        "kwargs": {"hours_active": 24},
    },
    # Clean up old sessions (daily at 4 AM)
    "cleanup-old-sessions": {
        "task": "tasks.cleanup_old_sessions",
        "schedule": crontab(hour=4, minute=0),
        "kwargs": {"days_old": 7},
    },
}

if __name__ == "__main__":
    app.start()
