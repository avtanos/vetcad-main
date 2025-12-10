"""
Схемы для кабинета ветеринара
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date


class VetAppointmentBase(BaseModel):
    pet_id: int
    appointment_date: datetime
    reason: Optional[str] = None
    notes: Optional[str] = None


class VetAppointmentCreate(VetAppointmentBase):
    vet_id: int


class VetAppointmentResponse(VetAppointmentBase):
    id: int
    vet_id: int
    pet_owner_id: int
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class VetAppointmentUpdate(BaseModel):
    """Обновление записи ветеринаром"""
    status: Optional[str] = None  # pending, confirmed, completed, cancelled
    notes: Optional[str] = None


class VetConsultationBase(BaseModel):
    pet_id: int
    question: str


class VetConsultationCreate(VetConsultationBase):
    vet_id: int


class VetConsultationResponse(VetConsultationBase):
    id: int
    vet_id: int
    pet_owner_id: int
    answer: Optional[str] = None
    status: str
    created_at: datetime
    answered_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class VetConsultationAnswer(BaseModel):
    answer: str


class VetArticleBase(BaseModel):
    title: str
    content: str
    excerpt: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    is_published: bool = False


class VetArticleCreate(VetArticleBase):
    pass


class VetArticleResponse(VetArticleBase):
    id: int
    vet_id: int
    views_count: int
    created_at: datetime
    published_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class PetCardSummary(BaseModel):
    """Краткая информация о питомце для ветеринара"""
    id: int
    name: str
    species: str
    breed: Optional[str] = None
    birth_date: Optional[date] = None
    weight: Optional[float] = None
    special_notes: Optional[str] = None
    owner_name: Optional[str] = None
    
    class Config:
        from_attributes = True


class VeterinarianPublic(BaseModel):
    """Публичная информация о ветеринаре"""
    id: int
    username: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    third_name: Optional[str] = None
    phone: Optional[str] = None
    clinic: Optional[str] = None
    position: Optional[str] = None
    specialization: Optional[str] = None
    experience: Optional[str] = None  # Может быть строкой или числом
    license_number: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    description: Optional[str] = None
    
    class Config:
        from_attributes = True

