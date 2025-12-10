"""
Схемы для кабинета партнера
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, time, date


class PartnerScheduleBase(BaseModel):
    day_of_week: int  # 0=Monday, 6=Sunday
    open_time: Optional[time] = None
    close_time: Optional[time] = None
    is_closed: bool = False


class PartnerScheduleCreate(PartnerScheduleBase):
    pass


class PartnerScheduleResponse(PartnerScheduleBase):
    id: int
    partner_id: int
    
    class Config:
        from_attributes = True


class PartnerLocationBase(BaseModel):
    latitude: float
    longitude: float
    address: Optional[str] = None


class PartnerLocationCreate(PartnerLocationBase):
    pass


class PartnerLocationResponse(PartnerLocationBase):
    id: int
    partner_id: int
    
    class Config:
        from_attributes = True


class PartnerServiceBase(BaseModel):
    name_ru: str
    name_kg: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    duration_minutes: Optional[int] = None
    is_active: bool = True


class PartnerServiceCreate(PartnerServiceBase):
    pass


class PartnerServiceResponse(PartnerServiceBase):
    id: int
    partner_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class PartnerEmployeeBase(BaseModel):
    first_name: str
    last_name: Optional[str] = None
    position: Optional[str] = None
    specialization: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    photo_url: Optional[str] = None
    is_active: bool = True


class PartnerEmployeeCreate(PartnerEmployeeBase):
    pass


class PartnerEmployeeResponse(PartnerEmployeeBase):
    id: int
    partner_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class PartnerPromotionBase(BaseModel):
    title: str
    description: Optional[str] = None
    discount_percent: Optional[int] = None
    start_date: datetime
    end_date: datetime
    is_active: bool = True


class PartnerPromotionCreate(PartnerPromotionBase):
    pass


class PartnerPromotionResponse(PartnerPromotionBase):
    id: int
    partner_id: int
    views_count: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class ProductStatsResponse(BaseModel):
    """Статистика просмотров товара"""
    product_id: int
    total_views: int
    unique_views: int
    views_today: int
    views_this_week: int
    views_this_month: int

