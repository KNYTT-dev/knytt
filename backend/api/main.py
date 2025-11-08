"""
Knytt FastAPI Backend
Minimal version for local development
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from pydantic import BaseModel
from typing import List, Optional
import sys
from pathlib import Path

# Add parent directory to path so we can import config
sys.path.append(str(Path(__file__).parent.parent.parent))

from backend.config.settings import get_settings

# Get settings
settings = get_settings()

# Initialize FastAPI
app = FastAPI(
    title="Knytt API",
    description="AI-Powered Product Discovery Platform",
    version="0.1.0",
    debug=settings.debug
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase client
supabase: Client = create_client(
    settings.supabase_url,
    settings.supabase_service_key
)


# =====================================================
# Pydantic Models
# =====================================================

class Product(BaseModel):
    """Product model"""
    title: str
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    brand: Optional[str] = None
    image_url: Optional[str] = None
    in_stock: bool = True


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    environment: str
    supabase_connected: bool


# =====================================================
# Routes
# =====================================================

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Knytt API",
        "version": "0.1.0",
        "docs": "/docs"
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""

    # Test Supabase connection
    supabase_connected = False
    try:
        # Try to query the products table
        response = supabase.table("products").select("count").execute()
        supabase_connected = True
    except Exception as e:
        print(f"Supabase connection failed: {e}")

    return HealthResponse(
        status="healthy" if supabase_connected else "degraded",
        environment=settings.environment,
        supabase_connected=supabase_connected
    )


@app.get("/api/v1/products", response_model=List[dict])
async def get_products(limit: int = 10):
    """Get all products"""
    try:
        response = supabase.table("products").select("*").limit(limit).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/products", response_model=dict)
async def create_product(product: Product):
    """Create a new product"""
    try:
        response = supabase.table("products").insert(product.dict()).execute()
        return response.data[0] if response.data else {}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/products/{product_id}", response_model=dict)
async def get_product(product_id: str):
    """Get a single product by ID"""
    try:
        response = supabase.table("products").select("*").eq("id", product_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Product not found")

        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/stats")
async def get_stats():
    """Get database statistics"""
    try:
        # Count products
        products_response = supabase.table("products").select("id", count="exact").execute()
        products_count = products_response.count if hasattr(products_response, 'count') else 0

        # Count users (from user_profiles)
        users_response = supabase.table("user_profiles").select("id", count="exact").execute()
        users_count = users_response.count if hasattr(users_response, 'count') else 0

        return {
            "products": products_count,
            "users": users_count,
            "database": "connected",
            "version": "0.1.0"
        }
    except Exception as e:
        return {
            "products": 0,
            "users": 0,
            "database": "error",
            "error": str(e)
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug
    )
