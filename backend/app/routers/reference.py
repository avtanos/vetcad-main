from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.reference import TypeOfAnimal, RefShop, ProductCategory, ProductSubcategory
from app.models.user import User
from app.schemas.reference import (
    TypeOfAnimalResponse, RefShopCreate, RefShopResponse
)
from app.schemas.product_category import (
    ProductCategoryResponse, ProductSubcategoryResponse
)
from app.dependencies import get_current_user

router = APIRouter()


@router.get("/ref_type_of_animal/", response_model=List[TypeOfAnimalResponse])
async def get_animal_types(db: Session = Depends(get_db)):
    types = db.query(TypeOfAnimal).all()
    return types


@router.get("/ref_shop/", response_model=List[RefShopResponse])
async def get_products(
    db: Session = Depends(get_db)
):
    # Показываем все активные товары
    products = db.query(RefShop).filter(RefShop.is_active == True).all()
    return products


@router.get("/ref_shop/{product_id}", response_model=RefShopResponse)
async def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    """Получить товар по ID"""
    product = db.query(RefShop).filter(RefShop.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Товар не найден"
        )
    if not product.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Товар не активен"
        )
    return product


@router.post("/ref_shop/", response_model=RefShopResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: RefShopCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_product = RefShop(
        name_ru=product_data.name_ru,
        name_kg=product_data.name_kg,
        is_active=product_data.is_active,
        img_url=product_data.img_url,
        description=product_data.description,
        user_id=current_user.id if product_data.user is None else product_data.user,
        subcategory_id=product_data.subcategory_id,
        price=product_data.price,
        stock_quantity=product_data.stock_quantity
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    return db_product


@router.get("/ref_shop/my/", response_model=List[RefShopResponse])
async def get_my_products(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Получить товары текущего пользователя"""
    products = db.query(RefShop).filter(RefShop.user_id == current_user.id).all()
    return products


@router.put("/ref_shop/{product_id}", response_model=RefShopResponse)
async def update_product(
    product_id: int,
    product_data: RefShopCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Обновить товар (только свой)"""
    product = db.query(RefShop).filter(RefShop.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Товар не найден"
        )
    
    # Проверяем, что товар принадлежит текущему пользователю
    if product.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Вы можете редактировать только свои товары"
        )
    
    product.name_ru = product_data.name_ru
    product.name_kg = product_data.name_kg
    product.is_active = product_data.is_active
    product.img_url = product_data.img_url
    product.description = product_data.description
    product.subcategory_id = product_data.subcategory_id
    product.price = product_data.price
    product.stock_quantity = product_data.stock_quantity
    
    db.commit()
    db.refresh(product)
    return product


@router.delete("/ref_shop/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Удалить товар (только свой)"""
    product = db.query(RefShop).filter(RefShop.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Товар не найден"
        )
    
    # Проверяем, что товар принадлежит текущему пользователю
    if product.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Вы можете удалять только свои товары"
        )
    
    db.delete(product)
    db.commit()
    return None


# Endpoints для категорий товаров
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