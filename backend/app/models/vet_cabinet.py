"""
Модели для кабинета ветеринара
"""
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Text, DateTime, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class VetAppointment(Base):
    """Запись к ветеринару"""
    __tablename__ = "vet_appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    vet_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    pet_owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    pet_id = Column(Integer, ForeignKey("pets.id"), nullable=False)
    appointment_date = Column(DateTime, nullable=False)
    reason = Column(String, nullable=True)  # Причина визита
    status = Column(String, default="pending")  # pending, confirmed, completed, cancelled
    notes = Column(Text, nullable=True)  # Заметки ветеринара
    created_at = Column(DateTime, default=datetime.utcnow)
    
    vet = relationship("User", foreign_keys=[vet_id])
    pet_owner = relationship("User", foreign_keys=[pet_owner_id])
    pet = relationship("Pet", lazy="joined")


class VetConsultation(Base):
    """Онлайн консультация"""
    __tablename__ = "vet_consultations"
    
    id = Column(Integer, primary_key=True, index=True)
    vet_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    pet_owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    pet_id = Column(Integer, ForeignKey("pets.id"), nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=True)
    status = Column(String, default="pending")  # pending, answered, closed
    created_at = Column(DateTime, default=datetime.utcnow)
    answered_at = Column(DateTime, nullable=True)
    
    vet = relationship("User", foreign_keys=[vet_id])
    pet_owner = relationship("User", foreign_keys=[pet_owner_id])
    pet = relationship("Pet", lazy="joined")


class VetArticle(Base):
    """Статьи ветеринара"""
    __tablename__ = "vet_articles"
    
    id = Column(Integer, primary_key=True, index=True)
    vet_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    excerpt = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    category = Column(String, nullable=True)
    is_published = Column(Boolean, default=False)
    views_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    published_at = Column(DateTime, nullable=True)
    
    vet = relationship("User")

