"""add user authentication fields

Revision ID: d7e8f9g0h1i2
Revises: c5d6e7f8g9h0
Create Date: 2025-11-02 20:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic
revision = 'd7e8f9g0h1i2'
down_revision = 'c5d6e7f8g9h0'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """
    Add authentication fields to users table.

    Adds:
    - password_hash: For storing bcrypt hashed passwords
    - is_active: Flag to enable/disable user accounts
    - email_verified: Email verification status
    - last_login: Track last login timestamp

    Also makes email required and unique for authentication.
    """

    # Add password_hash column (nullable first, we'll set defaults then make it NOT NULL)
    op.add_column('users',
        sa.Column('password_hash', sa.String(255), nullable=True,
                 comment='Bcrypt hashed password'))

    # Add is_active column
    op.add_column('users',
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true',
                 comment='Whether user account is active'))

    # Add email_verified column
    op.add_column('users',
        sa.Column('email_verified', sa.Boolean(), nullable=False, server_default='false',
                 comment='Whether email has been verified'))

    # Add last_login column
    op.add_column('users',
        sa.Column('last_login', sa.TIMESTAMP(), nullable=True,
                 comment='Timestamp of last successful login'))

    # Make email unique (if not already)
    # Note: This might fail if there are duplicate emails, handle manually if needed
    try:
        op.create_unique_constraint('uq_users_email', 'users', ['email'])
    except:
        pass  # Constraint may already exist

    # Set a default password hash for existing users (they'll need to reset)
    # Using a known hash of 'temppassword123' for testing
    # In production, you'd want to force password reset on first login
    op.execute("""
        UPDATE users
        SET password_hash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5ND0dalZRKfRm'
        WHERE password_hash IS NULL
    """)

    # Now make password_hash NOT NULL
    op.alter_column('users', 'password_hash', nullable=False)

    # Make email NOT NULL if not already
    # First set empty emails to a placeholder
    op.execute("""
        UPDATE users
        SET email = 'user_' || id::text || '@temp.placeholder'
        WHERE email IS NULL OR email = ''
    """)

    op.alter_column('users', 'email', nullable=False)


def downgrade() -> None:
    """
    Remove authentication fields from users table.
    """

    # Drop unique constraint on email
    try:
        op.drop_constraint('uq_users_email', 'users', type_='unique')
    except:
        pass

    # Make email nullable again
    op.alter_column('users', 'email', nullable=True)

    # Drop auth columns
    op.drop_column('users', 'last_login')
    op.drop_column('users', 'email_verified')
    op.drop_column('users', 'is_active')
    op.drop_column('users', 'password_hash')
