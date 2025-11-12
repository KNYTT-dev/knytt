"""
Pydantic Models
Request/response models for API endpoints.
"""

from .common import ErrorResponse, PaginationParams
from .feedback import FeedbackRequest, FeedbackResponse, InteractionType
from .recommend import RecommendationContext, RecommendRequest, RecommendResponse
from .search import ProductResult, SearchRequest, SearchResponse

__all__ = [
    "ErrorResponse",
    "PaginationParams",
    "SearchRequest",
    "SearchResponse",
    "ProductResult",
    "RecommendRequest",
    "RecommendResponse",
    "RecommendationContext",
    "FeedbackRequest",
    "FeedbackResponse",
    "InteractionType",
]
