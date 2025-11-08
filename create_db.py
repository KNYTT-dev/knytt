#!/usr/bin/env python3
"""
Create database schema using SQLAlchemy models
"""

import sys
from sqlalchemy import text
from backend.db.models import Base
from backend.db.session import engine

def create_schema():
    """Create all tables defined in models"""
    print("Creating database schema...")

    try:
        # Enable required extensions
        with engine.connect() as conn:
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"))
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS \"vector\";"))  # Supabase uses "vector" not "pgvector"
            conn.commit()
            print("✓ Extensions enabled (uuid-ossp, vector)")

        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✓ All tables created successfully")

        # Verify tables
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"\n✓ Created {len(tables)} tables:")
        for table in sorted(tables):
            print(f"  - {table}")

        return True

    except Exception as e:
        print(f"\n✗ Error creating schema: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = create_schema()
    sys.exit(0 if success else 1)
