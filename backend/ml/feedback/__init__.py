"""
Feedback Module
Handles user interaction events and updates embeddings in real-time.
"""

from .feedback_handler import FeedbackHandler, FeedbackProcessor, InteractionEvent, InteractionType

__all__ = [
    "FeedbackHandler",
    "InteractionEvent",
    "InteractionType",
    "FeedbackProcessor",
]
