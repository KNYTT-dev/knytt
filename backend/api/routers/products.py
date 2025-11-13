"""
Products Endpoint
GET /products/{product_id} - Fetch product details by ID.
"""

import logging
from uuid import UUID

from fastapi import APIRouter, Depends, Path, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ...db.models import Product
from ..dependencies import get_db, get_request_id
from ..errors import APIError
from ..models.search import ProductResult
from ..services.metadata_service import MetadataService, get_metadata_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["products"])


@router.get("/products/{product_id}", response_model=ProductResult, status_code=status.HTTP_200_OK)
async def get_product(
    product_id: str = Path(..., description="Product UUID"),
    db: Session = Depends(get_db),
    metadata_service: MetadataService = Depends(get_metadata_service),
    request_id: str = Depends(get_request_id),
) -> ProductResult:
    """
    Get product details by ID.

    Args:
        product_id: Product UUID
        db: Database session
        metadata_service: Metadata service for enriching product data
        request_id: Request ID for tracing

    Returns:
        Product details

    Raises:
        APIError: If product not found or invalid UUID
    """
    logger.info(f"Product details request: product_id={product_id}", extra={"request_id": request_id})

    # Validate UUID format
    try:
        product_uuid = UUID(product_id)
    except ValueError:
        raise APIError(
            message="Invalid product ID format (expected UUID)",
            details={"product_id": product_id},
            status_code=400,
        )

    # Fetch product from database
    try:
        product = db.execute(
            select(Product).where(Product.id == product_uuid)
        ).scalar_one_or_none()

        if not product:
            raise APIError(
                message="Product not found",
                details={"product_id": product_id},
                status_code=404,
            )

        # Enrich with metadata service
        # MetadataService.enrich_results expects List[str] for product_ids (UUID strings)
        # and Dict[str, Dict] for scores, so we need to convert UUID to string
        product_id_str = str(product.id)
        enriched_results = metadata_service.enrich_results(
            product_ids=[product_id_str],
            scores={product_id_str: {"similarity": 1.0, "rank": 1}},  # Default scores for single product
            db=db,
        )

        if not enriched_results:
            raise APIError(
                message="Failed to enrich product data",
                details={"product_id": product_id},
                status_code=500,
            )

        result = enriched_results[0]

        logger.info(
            f"Product details fetched: id={product_id}, title={result.title}",
            extra={"request_id": request_id},
        )

        return result

    except APIError:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch product details: {e}", exc_info=True)
        raise APIError(
            message="Failed to fetch product details",
            details={"product_id": product_id, "error": str(e)},
            status_code=500,
        )
