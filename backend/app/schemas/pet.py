from pydantic import BaseModel
from typing import Optional
from datetime import date


class PetBase(BaseModel):
    name: str
    species: int
    breed: Optional[str] = None
    birth_date: Optional[date] = None
    weight: Optional[float] = None
    image_url: Optional[str] = None
    special_notes: Optional[str] = None


class PetCreate(BaseModel):
    name: str
    birth_date: Optional[date] = None
    image_url: Optional[str] = None
    special_notes: Optional[str] = None
    type_of_animal: int
    user: int


class PetResponse(PetBase):
    id: int
    user: Optional[int] = None

    class Config:
        from_attributes = True


class PetUpdate(BaseModel):
    name: Optional[str] = None
    species: Optional[int] = None
    breed: Optional[str] = None
    birth_date: Optional[date] = None
    weight: Optional[float] = None
    image_url: Optional[str] = None
    special_notes: Optional[str] = None
    user: Optional[int] = None  # Фронтенд отправляет user, но мы его игнорируем

