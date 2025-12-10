"""
Схемы для админ-панели
"""
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class UserResponse(BaseModel):
    """Ответ с информацией о пользователе"""
    id: int
    username: str
    email: str
    is_active: bool
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class ProfileResponse(BaseModel):
    """Ответ с информацией о профиле"""
    id: int
    user_id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    third_name: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    role: int
    
    # Для ветеринаров
    clinic: Optional[str] = None
    position: Optional[str] = None
    specialization: Optional[str] = None
    experience: Optional[str] = None
    license_number: Optional[str] = None
    
    # Для партнеров
    name_of_organization: Optional[str] = None
    type: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    
    class Config:
        from_attributes = True


class UserDetailResponse(BaseModel):
    """Детальная информация о пользователе с профилем"""
    user: UserResponse
    profile: Optional[ProfileResponse] = None
    
    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    """Обновление данных пользователя"""
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None


class ProfileUpdate(BaseModel):
    """Обновление профиля пользователя"""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    third_name: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    role: Optional[int] = None


class UserCreate(BaseModel):
    """Создание нового пользователя"""
    username: str
    email: EmailStr
    password: str
    role: int = 1
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    third_name: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None


class UserListResponse(BaseModel):
    """Список пользователей с пагинацией"""
    total: int
    users: List[UserDetailResponse]


class StatsResponse(BaseModel):
    """Статистика системы"""
    total_users: int
    active_users: int
    pet_owners: int
    veterinarians: int
    partners: int
    admins: int
    total_pets: int
    total_articles: int
    total_products: int

