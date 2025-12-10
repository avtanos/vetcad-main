from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.reference import TypeOfAnimal, RefShop
from app.models.user import User
from app.schemas.reference import (
    TypeOfAnimalResponse, RefShopCreate, RefShopResponse
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
        user_id=current_user.id if product_data.user is None else product_data.user
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    return db_product

