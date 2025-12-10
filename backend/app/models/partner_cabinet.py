"""
Модели для кабинета партнера
"""
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Text, Float, DateTime, Time
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class PartnerSchedule(Base):
    """График работы партнера"""
    __tablename__ = "partner_schedules"
    
    id = Column(Integer, primary_key=True, index=True)
    partner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    day_of_week = Column(Integer, nullable=False)  # 0=Monday, 6=Sunday
    open_time = Column(Time, nullable=True)
    close_time = Column(Time, nullable=True)
    is_closed = Column(Boolean, default=False)
    
    partner = relationship("User")


class PartnerLocation(Base):
    """Геолокация партнера"""
    __tablename__ = "partner_locations"
    
    id = Column(Integer, primary_key=True, index=True)
    partner_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(String, nullable=True)
    
    partner = relationship("User")


class PartnerService(Base):
    """Услуги партнера"""
    __tablename__ = "partner_services"
    
    id = Column(Integer, primary_key=True, index=True)
    partner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name_ru = Column(String, nullable=False)
    name_kg = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=True)
    duration_minutes = Column(Integer, nullable=True)  # Длительность услуги в минутах
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    partner = relationship("User")


class PartnerEmployee(Base):
    """Сотрудники партнера"""
    __tablename__ = "partner_employees"
    
    id = Column(Integer, primary_key=True, index=True)
    partner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=True)
    position = Column(String, nullable=True)  # Должность
    specialization = Column(String, nullable=True)  # Специализация (для ветеринаров)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    photo_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    partner = relationship("User")


class PartnerPromotion(Base):
    """Акции и специальные предложения"""
    __tablename__ = "partner_promotions"
    
    id = Column(Integer, primary_key=True, index=True)
    partner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    discount_percent = Column(Integer, nullable=True)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
    views_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    partner = relationship("User")


class ProductView(Base):
    """Статистика просмотров товаров"""
    __tablename__ = "product_views"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("ref_shop.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Может быть null для анонимных просмотров
    viewed_at = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String, nullable=True)
    
    product = relationship("RefShop")
    user = relationship("User")

