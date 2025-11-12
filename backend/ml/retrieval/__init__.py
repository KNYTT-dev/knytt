"""
Retrieval & Search Module
FAISS-based vector similarity search with filtering and ranking.
"""

from .filtered_search import FilteredSimilaritySearch
from .filters import (
    FilteredSearcher,
    FilterOperator,
    ProductFilter,
    ProductFilters,
    combine_filters,
    create_category_filter,
    create_merchant_filter,
    create_price_filter,
)
from .index_builder import FAISSIndexBuilder
from .index_manager import FAISSIndexManager, get_index_manager
from .personalized_search import PersonalizedSearch, UserContext, create_user_context
from .ranking import (
    BrandMatchScorer,
    HeuristicRanker,
    PopularityScorer,
    PriceAffinityScorer,
    RankingConfig,
)
from .similarity_search import SearchResult, SearchResults, SimilaritySearch

__all__ = [
    "FAISSIndexBuilder",
    "FAISSIndexManager",
    "get_index_manager",
    "SimilaritySearch",
    "SearchResult",
    "SearchResults",
    "ProductFilter",
    "ProductFilters",
    "FilteredSearcher",
    "FilterOperator",
    "FilteredSimilaritySearch",
    "create_price_filter",
    "create_merchant_filter",
    "create_category_filter",
    "combine_filters",
    "RankingConfig",
    "PopularityScorer",
    "PriceAffinityScorer",
    "BrandMatchScorer",
    "HeuristicRanker",
    "PersonalizedSearch",
    "UserContext",
    "create_user_context",
]
