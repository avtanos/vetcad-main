from pydantic import BaseModel, Field, model_validator
from typing import Optional, Any


class TypeOfAnimalResponse(BaseModel):
    id: int
    name_ru: str
    name_kg: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True


class RefShopBase(BaseModel):
    name_ru: str
    name_kg: Optional[str] = None
    is_active: bool = True
    img_url: Optional[str] = None
    description: Optional[str] = None
    subcategory_id: Optional[int] = None
    price: Optional[str] = None
    stock_quantity: Optional[int] = None


class RefShopCreate(RefShopBase):
    user: Optional[int] = None


class RefShopResponse(RefShopBase):
    id: int
    user: Optional[int] = None
    subcategory: Optional[dict] = None  # Информация о подкатегории

    @model_validator(mode='before')
    @classmethod
    def map_user_id(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if 'user_id' in data and 'user' not in data:
                data['user'] = data.get('user_id')
            # Маппинг подкатегории
            if 'subcategory' in data and data['subcategory']:
                subcat = data['subcategory']
                data['subcategory'] = {
                    'id': getattr(subcat, 'id', None) or subcat.get('id') if isinstance(subcat, dict) else None,
                    'name_ru': getattr(subcat, 'name_ru', None) or subcat.get('name_ru') if isinstance(subcat, dict) else None,
                    'name_kg': getattr(subcat, 'name_kg', None) or subcat.get('name_kg') if isinstance(subcat, dict) else None,
                    'category_id': getattr(subcat, 'category_id', None) or subcat.get('category_id') if isinstance(subcat, dict) else None,
                }
        elif hasattr(data, 'user_id'):
            # Для SQLAlchemy объектов
            result = {
                **{k: getattr(data, k) for k in ['id', 'name_ru', 'name_kg', 'is_active', 'img_url', 'description', 'subcategory_id', 'price', 'stock_quantity']},
                'user': getattr(data, 'user_id', None)
            }
            # Добавляем информацию о подкатегории
            if hasattr(data, 'subcategory') and data.subcategory:
                result['subcategory'] = {
                    'id': data.subcategory.id,
                    'name_ru': data.subcategory.name_ru,
                    'name_kg': data.subcategory.name_kg,
                    'category_id': data.subcategory.category_id,
                }
            return result
        return data

    class Config:
        from_attributes = True

