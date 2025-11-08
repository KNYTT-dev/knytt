"""add image validation fields

Revision ID: e9f0g1h2i3j4
Revises: d7e8f9g0h1i2
Create Date: 2025-11-07 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic
revision = 'e9f0g1h2i3j4'
down_revision = 'd7e8f9g0h1i2'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add image validation tracking fields to products table
    op.add_column('products', sa.Column('image_url_validated', sa.Boolean(),
                                        nullable=False, server_default='false',
                                        comment='Whether image URL has been validated (HTTP HEAD check)'))
    op.add_column('products', sa.Column('image_content_validated', sa.Boolean(),
                                        nullable=False, server_default='false',
                                        comment='Whether image content has been validated (PIL integrity check)'))
    op.add_column('products', sa.Column('image_validation_status', sa.String(50),
                                        nullable=True,
                                        comment='Validation status: pending, valid, invalid_url, invalid_content, unreachable'))
    op.add_column('products', sa.Column('image_validation_error', sa.Text(),
                                        nullable=True,
                                        comment='Error message if validation failed'))
    op.add_column('products', sa.Column('image_validated_at', sa.TIMESTAMP(),
                                        nullable=True,
                                        comment='When image was last validated'))
    op.add_column('products', sa.Column('image_dimensions', postgresql.JSONB(astext_type=sa.Text()),
                                        nullable=True,
                                        comment='Image dimensions: {width: int, height: int}'))

    # Add index for querying unvalidated images
    op.create_index('idx_products_image_url_validated', 'products', ['image_url_validated'])
    op.create_index('idx_products_image_validation_status', 'products', ['image_validation_status'])


def downgrade() -> None:
    # Drop indexes
    op.drop_index('idx_products_image_validation_status', table_name='products')
    op.drop_index('idx_products_image_url_validated', table_name='products')

    # Drop columns
    op.drop_column('products', 'image_dimensions')
    op.drop_column('products', 'image_validated_at')
    op.drop_column('products', 'image_validation_error')
    op.drop_column('products', 'image_validation_status')
    op.drop_column('products', 'image_content_validated')
    op.drop_column('products', 'image_url_validated')
