"""
Схемы для категорий и подкатегорий товаров
"""
from pydantic import BaseModel
from typing import Optional, List


class ProductSubcategoryBase(BaseModel):
    name_ru: str
    name_kg: Optional[str] = None
    description: Optional[str] = None
    is_active: bool = True
    sort_order: int = 0


class ProductSubcategoryCreate(ProductSubcategoryBase):
    category_id: int


class ProductSubcategoryResponse(ProductSubcategoryBase):
    id: int
    category_id: int

    class Config:
        from_attributes = True


class ProductCategoryBase(BaseModel):
    name_ru: str
    name_kg: Optional[str] = None
    description: Optional[str] = None
    icon_url: Optional[str] = None
    is_active: bool = True
    sort_order: int = 0


class ProductCategoryCreate(ProductCategoryBase):
    pass


class ProductCategoryResponse(ProductCategoryBase):
    id: int
    subcategories: List[ProductSubcategoryResponse] = []

    class Config:
        from_attributes = True


class ProductCategoryWithSubcategories(ProductCategoryResponse):
    """Категория с подкатегориями"""
    pass

