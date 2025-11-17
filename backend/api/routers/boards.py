"""
Board routes.
Handles Pinterest-style board functionality for organizing products.
"""

import logging
from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import desc, func
from sqlalchemy.orm import Session, joinedload

logger = logging.getLogger(__name__)

from ...db.models import Board, BoardItem, Product, User
from ..dependencies import get_current_user, get_db
from ..schemas.board import (
    BoardCreate,
    BoardDetailResponse,
    BoardItemCreate,
    BoardItemResponse,
    BoardItemUpdate,
    BoardListResponse,
    BoardResponse,
    BoardUpdate,
    ProductCardData,
)

router = APIRouter(prefix="/api/v1/boards", tags=["Boards"])


@router.post("", response_model=BoardResponse, status_code=status.HTTP_201_CREATED)
async def create_board(
    board_data: BoardCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new board.
    """
    # Check if board name already exists for this user
    existing_board = (
        db.query(Board)
        .filter(Board.user_id == current_user.id, Board.name == board_data.name)
        .first()
    )

    if existing_board:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Board with name '{board_data.name}' already exists",
        )

    # Get the highest position for this user's boards
    max_position = db.query(func.max(Board.position)).filter(Board.user_id == current_user.id).scalar()
    next_position = (max_position or -1) + 1

    # Create new board
    new_board = Board(
        user_id=current_user.id,
        name=board_data.name,
        description=board_data.description,
        is_public=board_data.is_public,
        is_default=False,  # Only auto-created boards are default
        position=next_position,
    )

    db.add(new_board)
    db.commit()
    db.refresh(new_board)

    logger.info(f"User {current_user.id} created board '{board_data.name}' (id={new_board.id})")

    # Return response with item_count
    return BoardResponse(
        id=str(new_board.id),
        user_id=str(new_board.user_id),
        name=new_board.name,
        description=new_board.description,
        cover_image_url=new_board.cover_image_url,
        is_public=new_board.is_public,
        is_default=new_board.is_default,
        position=new_board.position,
        item_count=0,
        created_at=new_board.created_at,
        updated_at=new_board.updated_at,
    )


@router.get("/me", response_model=BoardListResponse)
async def get_my_boards(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get all boards for the current user.
    """
    # Query boards with item counts
    boards_query = (
        db.query(Board, func.count(BoardItem.id).label("item_count"))
        .outerjoin(BoardItem, Board.id == BoardItem.board_id)
        .filter(Board.user_id == current_user.id)
        .group_by(Board.id)
        .order_by(Board.position, Board.created_at)
        .all()
    )

    # Build response
    boards = []
    for board, item_count in boards_query:
        boards.append(
            BoardResponse(
                id=str(board.id),
                user_id=str(board.user_id),
                name=board.name,
                description=board.description,
                cover_image_url=board.cover_image_url,
                is_public=board.is_public,
                is_default=board.is_default,
                position=board.position,
                item_count=item_count or 0,
                created_at=board.created_at,
                updated_at=board.updated_at,
            )
        )

    return BoardListResponse(boards=boards, total=len(boards))


@router.get("/{board_id}", response_model=BoardDetailResponse)
async def get_board_detail(
    board_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get a board with all its items.
    """
    # Convert board_id to UUID
    try:
        board_uuid = UUID(board_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid board ID format"
        )

    # Query board with items
    board = (
        db.query(Board)
        .filter(Board.id == board_uuid)
        .options(joinedload(Board.items).joinedload(BoardItem.product))
        .first()
    )

    if not board:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")

    # Check if user owns the board or if it's public
    if board.user_id != current_user.id and not board.is_public:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    # Build items list
    items = []
    for board_item in sorted(board.items, key=lambda x: (x.position, x.created_at)):
        product = board_item.product
        items.append(
            BoardItemResponse(
                id=str(board_item.id),
                board_id=str(board_item.board_id),
                product_id=str(board_item.product_id),
                user_id=str(board_item.user_id),
                note=board_item.note,
                position=board_item.position,
                created_at=board_item.created_at,
                product=ProductCardData(
                    id=str(product.id),
                    product_name=product.product_name,
                    brand_name=product.brand_name,
                    search_price=float(product.search_price) if product.search_price else None,
                    currency=product.currency or "GBP",
                    merchant_image_url=product.merchant_image_url,
                    aw_image_url=product.aw_image_url,
                    large_image=product.large_image,
                    in_stock=product.in_stock,
                    is_active=product.is_active,
                ),
            )
        )

    return BoardDetailResponse(
        id=str(board.id),
        user_id=str(board.user_id),
        name=board.name,
        description=board.description,
        cover_image_url=board.cover_image_url,
        is_public=board.is_public,
        is_default=board.is_default,
        position=board.position,
        created_at=board.created_at,
        updated_at=board.updated_at,
        items=items,
    )


@router.put("/{board_id}", response_model=BoardResponse)
async def update_board(
    board_id: str,
    board_data: BoardUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update a board's metadata.
    """
    # Convert board_id to UUID
    try:
        board_uuid = UUID(board_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid board ID format"
        )

    # Get board
    board = db.query(Board).filter(Board.id == board_uuid, Board.user_id == current_user.id).first()

    if not board:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")

    # Don't allow renaming default board to avoid confusion
    if board.is_default and board_data.name and board_data.name != board.name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot rename default board",
        )

    # Check for duplicate name if renaming
    if board_data.name and board_data.name != board.name:
        existing = (
            db.query(Board)
            .filter(
                Board.user_id == current_user.id,
                Board.name == board_data.name,
                Board.id != board_uuid,
            )
            .first()
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Board with name '{board_data.name}' already exists",
            )

    # Update fields
    if board_data.name is not None:
        board.name = board_data.name
    if board_data.description is not None:
        board.description = board_data.description
    if board_data.cover_image_url is not None:
        board.cover_image_url = board_data.cover_image_url
    if board_data.is_public is not None:
        board.is_public = board_data.is_public
    if board_data.position is not None:
        board.position = board_data.position

    db.commit()
    db.refresh(board)

    # Get item count
    item_count = db.query(func.count(BoardItem.id)).filter(BoardItem.board_id == board.id).scalar()

    return BoardResponse(
        id=str(board.id),
        user_id=str(board.user_id),
        name=board.name,
        description=board.description,
        cover_image_url=board.cover_image_url,
        is_public=board.is_public,
        is_default=board.is_default,
        position=board.position,
        item_count=item_count or 0,
        created_at=board.created_at,
        updated_at=board.updated_at,
    )


@router.delete("/{board_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_board(
    board_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Delete a board and all its items.
    """
    # Convert board_id to UUID
    try:
        board_uuid = UUID(board_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid board ID format"
        )

    # Get board
    board = db.query(Board).filter(Board.id == board_uuid, Board.user_id == current_user.id).first()

    if not board:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")

    # Don't allow deleting default board
    if board.is_default:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete default board",
        )

    # Delete board (cascade will delete items)
    db.delete(board)
    db.commit()

    logger.info(f"User {current_user.id} deleted board '{board.name}' (id={board_id})")

    return None


@router.post("/{board_id}/items", response_model=BoardItemResponse, status_code=status.HTTP_201_CREATED)
async def add_item_to_board(
    board_id: str,
    item_data: BoardItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Add a product to a board.
    """
    # Convert UUIDs
    try:
        board_uuid = UUID(board_id)
        product_uuid = UUID(item_data.product_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ID format")

    # Verify board exists and user owns it
    board = db.query(Board).filter(Board.id == board_uuid, Board.user_id == current_user.id).first()

    if not board:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")

    # Verify product exists
    product = db.query(Product).filter(Product.id == product_uuid).first()

    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    # Check if item already exists in this board
    existing_item = (
        db.query(BoardItem)
        .filter(BoardItem.board_id == board_uuid, BoardItem.product_id == product_uuid)
        .first()
    )

    if existing_item:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product already exists in this board",
        )

    # Get the highest position for items in this board
    max_position = (
        db.query(func.max(BoardItem.position)).filter(BoardItem.board_id == board_uuid).scalar()
    )
    next_position = (max_position or -1) + 1

    # Create board item
    board_item = BoardItem(
        board_id=board_uuid,
        product_id=product_uuid,
        user_id=current_user.id,
        note=item_data.note,
        position=next_position,
    )

    db.add(board_item)

    # Update board's cover image if it's the first item and no cover is set
    if not board.cover_image_url:
        board.cover_image_url = product.merchant_image_url or product.aw_image_url or product.large_image

    db.commit()
    db.refresh(board_item)

    logger.info(
        f"User {current_user.id} added product {product_uuid} to board '{board.name}' (id={board_id})"
    )

    return BoardItemResponse(
        id=str(board_item.id),
        board_id=str(board_item.board_id),
        product_id=str(board_item.product_id),
        user_id=str(board_item.user_id),
        note=board_item.note,
        position=board_item.position,
        created_at=board_item.created_at,
        product=ProductCardData(
            id=str(product.id),
            product_name=product.product_name,
            brand_name=product.brand_name,
            search_price=float(product.search_price) if product.search_price else None,
            currency=product.currency or "GBP",
            merchant_image_url=product.merchant_image_url,
            aw_image_url=product.aw_image_url,
            large_image=product.large_image,
            in_stock=product.in_stock,
            is_active=product.is_active,
        ),
    )


@router.delete("/{board_id}/items/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_item_from_board(
    board_id: str,
    product_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Remove a product from a board.
    """
    # Convert UUIDs
    try:
        board_uuid = UUID(board_id)
        product_uuid = UUID(product_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ID format")

    # Verify board exists and user owns it
    board = db.query(Board).filter(Board.id == board_uuid, Board.user_id == current_user.id).first()

    if not board:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")

    # Delete board item
    deleted_count = (
        db.query(BoardItem)
        .filter(
            BoardItem.board_id == board_uuid,
            BoardItem.product_id == product_uuid,
            BoardItem.user_id == current_user.id,
        )
        .delete()
    )

    if deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found in board")

    db.commit()

    logger.info(f"User {current_user.id} removed product {product_id} from board {board_id}")

    return None


@router.put("/{board_id}/items/{product_id}", response_model=BoardItemResponse)
async def update_board_item(
    board_id: str,
    product_id: str,
    item_data: BoardItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update a board item (note or position).
    """
    # Convert UUIDs
    try:
        board_uuid = UUID(board_id)
        product_uuid = UUID(product_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ID format")

    # Get board item with product
    board_item = (
        db.query(BoardItem)
        .filter(
            BoardItem.board_id == board_uuid,
            BoardItem.product_id == product_uuid,
            BoardItem.user_id == current_user.id,
        )
        .options(joinedload(BoardItem.product))
        .first()
    )

    if not board_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found in board")

    # Update fields
    if item_data.note is not None:
        board_item.note = item_data.note
    if item_data.position is not None:
        board_item.position = item_data.position

    db.commit()
    db.refresh(board_item)

    product = board_item.product

    return BoardItemResponse(
        id=str(board_item.id),
        board_id=str(board_item.board_id),
        product_id=str(board_item.product_id),
        user_id=str(board_item.user_id),
        note=board_item.note,
        position=board_item.position,
        created_at=board_item.created_at,
        product=ProductCardData(
            id=str(product.id),
            product_name=product.product_name,
            brand_name=product.brand_name,
            search_price=float(product.search_price) if product.search_price else None,
            currency=product.currency or "GBP",
            merchant_image_url=product.merchant_image_url,
            aw_image_url=product.aw_image_url,
            large_image=product.large_image,
            in_stock=product.in_stock,
            is_active=product.is_active,
        ),
    )


@router.get("/product/{product_id}/boards", response_model=List[BoardResponse])
async def get_boards_with_product(
    product_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get all boards that contain a specific product.
    Useful for showing which boards a product is already saved to.
    """
    # Convert product_id to UUID
    try:
        product_uuid = UUID(product_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid product ID format")

    # Query boards that contain this product for the current user
    boards_query = (
        db.query(Board)
        .join(BoardItem, Board.id == BoardItem.board_id)
        .filter(BoardItem.product_id == product_uuid, Board.user_id == current_user.id)
        .order_by(Board.position, Board.created_at)
        .all()
    )

    # Build response
    boards = []
    for board in boards_query:
        # Get item count for this board
        item_count = db.query(func.count(BoardItem.id)).filter(BoardItem.board_id == board.id).scalar()

        boards.append(
            BoardResponse(
                id=str(board.id),
                user_id=str(board.user_id),
                name=board.name,
                description=board.description,
                cover_image_url=board.cover_image_url,
                is_public=board.is_public,
                is_default=board.is_default,
                position=board.position,
                item_count=item_count or 0,
                created_at=board.created_at,
                updated_at=board.updated_at,
            )
        )

    return boards
