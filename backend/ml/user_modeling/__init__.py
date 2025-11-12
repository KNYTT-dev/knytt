"""
User Modeling Package
User embedding generation and management.
"""

from .blending import UserEmbeddingBlender, blend_user_embeddings, get_user_blender
from .cold_start import ColdStartEmbedding, create_user_from_quiz, get_cold_start_generator
from .embedding_builder import UserEmbeddingBuilder, get_embedding_builder
from .session import SessionEmbedding, SessionManager, get_session_manager
from .warm_user import WarmUserEmbedding, get_warm_user_updater, update_user_from_interaction

__all__ = [
    # Cold start
    "ColdStartEmbedding",
    "get_cold_start_generator",
    "create_user_from_quiz",
    # Warm user
    "WarmUserEmbedding",
    "get_warm_user_updater",
    "update_user_from_interaction",
    # Session
    "SessionEmbedding",
    "SessionManager",
    "get_session_manager",
    # Blending
    "UserEmbeddingBlender",
    "get_user_blender",
    "blend_user_embeddings",
    # Embedding builder
    "UserEmbeddingBuilder",
    "get_embedding_builder",
]
