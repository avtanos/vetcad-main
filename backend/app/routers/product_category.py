"""
Роутер для категорий и подкатегорий товаров
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.reference import ProductCategory, ProductSubcategory
from app.schemas.product_category import (
    ProductCategoryCreate, ProductCategoryResponse,
    ProductSubcategoryCreate, ProductSubcategoryResponse
)

router = APIRouter()


@router.get("/categories", response_model=List[ProductCategoryResponse])
async def get_categories(
    db: Session = Depends(get_db)
):
    """Получить все категории с подкатегориями"""
    categories = db.query(ProductCategory).filter(
        ProductCategory.is_active == True
    ).order_by(ProductCategory.sort_order, ProductCategory.name_ru).all()
    return categories


@router.get("/categories/{category_id}", response_model=ProductCategoryResponse)
async def get_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    """Получить категорию по ID"""
    category = db.query(ProductCategory).filter(
        ProductCategory.id == category_id
    ).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Категория не найдена"
        )
    return category


@router.get("/subcategories", response_model=List[ProductSubcategoryResponse])
async def get_subcategories(
    category_id: Optional[int] = Query(None, description="Фильтр по категории"),
    db: Session = Depends(get_db)
):
    """Получить подкатегории (опционально по категории)"""
    query = db.query(ProductSubcategory).filter(
        ProductSubcategory.is_active == True
    )
    if category_id:
        query = query.filter(ProductSubcategory.category_id == category_id)
    subcategories = query.order_by(ProductSubcategory.sort_order, ProductSubcategory.name_ru).all()
    return subcategories


@router.get("/subcategories/{subcategory_id}", response_model=ProductSubcategoryResponse)
async def get_subcategory(
    subcategory_id: int,
    db: Session = Depends(get_db)
):
    """Получить подкатегорию по ID"""
    subcategory = db.query(ProductSubcategory).filter(
        ProductSubcategory.id == subcategory_id
    ).first()
    if not subcategory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Подкатегория не найдена"
        )
    return subcategory

