"""
Image Validation Tasks
Background tasks for deep image validation using PIL
"""

import logging
from typing import Dict, Any, List, Optional
import asyncio
import json
from datetime import datetime

from .celery_app import app

logger = logging.getLogger(__name__)


@app.task(bind=True, name='tasks.validate_product_images', max_retries=2, default_retry_delay=300)
def validate_product_images(
    self,
    product_ids: Optional[List[str]] = None,
    batch_size: int = 50,
    force_revalidate: bool = False
) -> Dict[str, Any]:
    """
    Deep validation of product images using PIL.

    This task:
    1. Fetches products with unvalidated images or those needing revalidation
    2. Downloads each image and validates with PIL
    3. Checks image integrity, format, and dimensions
    4. Updates database with validation results

    Args:
        product_ids: Optional list of specific product UUIDs to validate. If None, process all unvalidated.
        batch_size: Number of products to process at once (default: 50)
        force_revalidate: If True, revalidate even if already validated

    Returns:
        Dictionary with validation results
    """
    from sqlalchemy import select, and_, text
    from uuid import UUID

    try:
        logger.info(
            f"Starting deep image validation for "
            f"{len(product_ids) if product_ids else 'all unvalidated'} products"
        )

        # Import here to avoid circular dependencies
        from ..db.session import SessionLocal
        from ..db.models import Product
        from ..models.quality import ImageValidator

        # Create database session
        db = SessionLocal()

        try:
            # Build query for products to process
            if product_ids:
                # Process specific products
                uuid_list = [UUID(pid) if isinstance(pid, str) else pid for pid in product_ids]
                query = select(Product).where(
                    and_(
                        Product.id.in_(uuid_list),
                        Product.is_active == True
                    )
                )
            else:
                # Process all products with unvalidated images
                if force_revalidate:
                    query = select(Product).where(
                        and_(
                            Product.is_active == True,
                            Product.is_duplicate == False
                        )
                    )
                else:
                    # Only process products without content validation
                    query = select(Product).where(
                        and_(
                            Product.is_active == True,
                            Product.is_duplicate == False,
                            Product.image_content_validated == False,
                            # Must have at least one image URL
                            (Product.merchant_image_url.isnot(None) |
                             Product.aw_image_url.isnot(None) |
                             Product.large_image.isnot(None))
                        )
                    )

            query = query.order_by(Product.id).limit(batch_size if not product_ids else None)
            products = db.execute(query).scalars().all()
            total = len(products)

            logger.info(f"Found {total} products to validate")

            if total == 0:
                return {
                    'status': 'success',
                    'processed': 0,
                    'valid': 0,
                    'invalid': 0,
                    'errors': 0
                }

            # Update task state
            self.update_state(
                state='PROGRESS',
                meta={
                    'current': 0,
                    'total': total,
                    'status': 'Starting validation...'
                }
            )

            # Process products
            processed = 0
            valid_count = 0
            invalid_count = 0
            error_count = 0

            for idx, product in enumerate(products):
                try:
                    # Determine primary image URL
                    primary_url = (
                        product.merchant_image_url or
                        product.aw_image_url or
                        product.large_image
                    )

                    if not primary_url:
                        logger.debug(f"Product {product.id} has no image URL")
                        processed += 1
                        continue

                    # Perform deep PIL validation (synchronous wrapper)
                    is_valid, error_msg, metadata = asyncio.run(
                        ImageValidator.validate_image_integrity(primary_url)
                    )

                    # Update product in database
                    if is_valid:
                        # Extract dimensions
                        dimensions = None
                        if metadata and 'width' in metadata and 'height' in metadata:
                            dimensions = {
                                'width': metadata['width'],
                                'height': metadata['height']
                            }

                        db.execute(
                            text("""
                                UPDATE products
                                SET image_content_validated = true,
                                    image_validation_status = 'valid',
                                    image_validation_error = NULL,
                                    image_validated_at = NOW(),
                                    image_dimensions = CAST(:dimensions AS jsonb)
                                WHERE id = :product_id
                            """),
                            {
                                'product_id': product.id,
                                'dimensions': json.dumps(dimensions) if dimensions else None
                            }
                        )
                        valid_count += 1
                    else:
                        db.execute(
                            text("""
                                UPDATE products
                                SET image_content_validated = false,
                                    image_validation_status = 'invalid_content',
                                    image_validation_error = :error_msg,
                                    image_validated_at = NOW()
                                WHERE id = :product_id
                            """),
                            {
                                'product_id': product.id,
                                'error_msg': error_msg[:500]  # Truncate long errors
                            }
                        )
                        invalid_count += 1
                        logger.debug(f"Product {product.id} has invalid image: {error_msg}")

                    # Commit after each product
                    db.commit()
                    processed += 1

                    # Update progress
                    if processed % 10 == 0:
                        self.update_state(
                            state='PROGRESS',
                            meta={
                                'current': processed,
                                'total': total,
                                'valid': valid_count,
                                'invalid': invalid_count,
                                'status': f'Validated {processed}/{total} images'
                            }
                        )
                        logger.info(f"Progress: {processed}/{total} - Valid: {valid_count}, Invalid: {invalid_count}")

                except Exception as e:
                    db.rollback()
                    error_count += 1
                    logger.error(f"Failed to validate product {product.id}: {str(e)[:200]}")
                    processed += 1
                    continue

            result = {
                'status': 'success',
                'processed': processed,
                'valid': valid_count,
                'invalid': invalid_count,
                'errors': error_count,
                'timestamp': datetime.now().isoformat()
            }

            logger.info(
                f"Validation complete: {processed} processed, "
                f"{valid_count} valid, {invalid_count} invalid, {error_count} errors"
            )

            return result

        finally:
            db.close()

    except Exception as e:
        logger.error(f"Image validation task failed: {str(e)}")
        return {
            'status': 'error',
            'error': str(e)[:500],
            'processed': 0,
            'valid': 0,
            'invalid': 0,
            'errors': 0
        }


@app.task(bind=True, name='tasks.revalidate_failed_images', max_retries=1)
def revalidate_failed_images(
    self,
    days_old: int = 7,
    batch_size: int = 100
) -> Dict[str, Any]:
    """
    Revalidate images that previously failed validation.
    Useful for recovering from temporary network issues.

    Args:
        days_old: Only revalidate images that failed more than this many days ago
        batch_size: Number of products to revalidate

    Returns:
        Dictionary with revalidation results
    """
    from sqlalchemy import text
    from datetime import timedelta

    try:
        logger.info(f"Starting revalidation of images that failed {days_old}+ days ago")

        from ..db.session import SessionLocal

        db = SessionLocal()

        try:
            # Find products with failed validation older than specified days
            cutoff_date = datetime.now() - timedelta(days=days_old)

            result = db.execute(
                text("""
                    SELECT id::text
                    FROM products
                    WHERE image_validation_status IN ('invalid_url', 'invalid_content', 'unreachable')
                      AND image_validated_at < :cutoff_date
                      AND is_active = true
                    LIMIT :batch_size
                """),
                {
                    'cutoff_date': cutoff_date,
                    'batch_size': batch_size
                }
            )

            product_ids = [row[0] for row in result]

            logger.info(f"Found {len(product_ids)} products to revalidate")

            if not product_ids:
                return {
                    'status': 'success',
                    'message': 'No products need revalidation',
                    'processed': 0
                }

            # Call the main validation task
            return validate_product_images(
                self,
                product_ids=product_ids,
                batch_size=batch_size,
                force_revalidate=True
            )

        finally:
            db.close()

    except Exception as e:
        logger.error(f"Revalidation task failed: {str(e)}")
        return {
            'status': 'error',
            'error': str(e)[:500],
            'processed': 0
        }
