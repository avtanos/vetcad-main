from pydantic import BaseModel
from typing import Optional


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


class RefShopCreate(RefShopBase):
    user: Optional[int] = None


class RefShopResponse(RefShopBase):
    id: int
    user: Optional[int] = None

    class Config:
        from_attributes = True

