"""
Board-specific request/response schemas.
Pydantic models for Pinterest-style board functionality.
"""

from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class BoardCreate(BaseModel):
    """Request schema for creating a new board."""

    name: str = Field(..., min_length=1, max_length=255, description="Board name")
    description: Optional[str] = Field(None, description="Optional board description")
    is_public: bool = Field(False, description="Whether board is publicly visible")


class BoardUpdate(BaseModel):
    """Request schema for updating a board."""

    name: Optional[str] = Field(None, min_length=1, max_length=255, description="Board name")
    description: Optional[str] = Field(None, description="Board description")
    cover_image_url: Optional[str] = Field(None, description="Board cover image URL")
    is_public: Optional[bool] = Field(None, description="Whether board is publicly visible")
    position: Optional[int] = Field(None, ge=0, description="Display order position")


class BoardResponse(BaseModel):
    """Response schema for a board (without items)."""

    id: str
    user_id: str
    name: str
    description: Optional[str]
    cover_image_url: Optional[str]
    is_public: bool
    is_default: bool
    position: int
    item_count: int = Field(0, description="Number of items in this board")
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class BoardItemCreate(BaseModel):
    """Request schema for adding a product to a board."""

    product_id: str = Field(..., description="Product UUID to add to board")
    note: Optional[str] = Field(None, description="Optional note about this item")


class BoardItemUpdate(BaseModel):
    """Request schema for updating a board item."""

    note: Optional[str] = Field(None, description="Update the note")
    position: Optional[int] = Field(None, ge=0, description="Update the position")


class ProductCardData(BaseModel):
    """Minimal product data for display in board items."""

    id: str
    product_name: str
    brand_name: Optional[str]
    search_price: Optional[float]
    currency: str
    merchant_image_url: Optional[str]
    aw_image_url: Optional[str]
    large_image: Optional[str]
    in_stock: bool
    is_active: bool

    model_config = {"from_attributes": True}


class BoardItemResponse(BaseModel):
    """Response schema for a board item."""

    id: str
    board_id: str
    product_id: str
    user_id: str
    note: Optional[str]
    position: int
    created_at: datetime
    product: ProductCardData

    model_config = {"from_attributes": True}


class BoardDetailResponse(BaseModel):
    """Response schema for a board with its items."""

    id: str
    user_id: str
    name: str
    description: Optional[str]
    cover_image_url: Optional[str]
    is_public: bool
    is_default: bool
    position: int
    created_at: datetime
    updated_at: datetime
    items: List[BoardItemResponse] = Field(default_factory=list)

    model_config = {"from_attributes": True}


class BoardListResponse(BaseModel):
    """Response schema for listing boards."""

    boards: List[BoardResponse]
    total: int


class BoardItemMoveRequest(BaseModel):
    """Request schema for moving/copying item between boards."""

    target_board_id: str = Field(..., description="Target board UUID")
    copy: bool = Field(
        False, description="If true, copy the item; if false, move it (remove from current board)"
    )


class BoardReorderRequest(BaseModel):
    """Request schema for reordering items in a board."""

    item_positions: List[dict] = Field(
        ...,
        description="List of {item_id: str, position: int} for reordering",
    )
