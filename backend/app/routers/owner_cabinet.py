"""
Роутер для функционала владельца питомца (записи, консультации)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User, Profile
from app.models.pet import Pet
from app.models.vet_cabinet import VetAppointment, VetConsultation
from app.schemas.vet_cabinet import (
    VetAppointmentResponse, VetAppointmentCreate,
    VetConsultationResponse, VetConsultationCreate
)
from datetime import datetime

router = APIRouter()


def verify_owner_role(current_user: User = Depends(get_current_user)):
    """Проверка, что пользователь - владелец питомца"""
    if not current_user.profile or current_user.profile.role != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ разрешен только владельцам питомцев"
        )
    return current_user


@router.post("/appointments/", response_model=VetAppointmentResponse, status_code=status.HTTP_201_CREATED)
async def create_appointment(
    appointment_data: VetAppointmentCreate,
    current_user: User = Depends(verify_owner_role),
    db: Session = Depends(get_db)
):
    """Создать запись к ветеринару"""
    # Проверяем, что питомец принадлежит пользователю
    pet = db.query(Pet).filter(
        Pet.id == appointment_data.pet_id,
        Pet.user_id == current_user.id
    ).first()
    
    if not pet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Питомец не найден или не принадлежит вам"
        )
    
    # Проверяем, что ветеринар существует и имеет роль ветеринара
    vet = db.query(User).join(Profile).filter(
        User.id == appointment_data.vet_id,
        Profile.role == 2
    ).first()
    
    if not vet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ветеринар не найден"
        )
    
    appointment = VetAppointment(
        vet_id=appointment_data.vet_id,
        pet_owner_id=current_user.id,
        pet_id=appointment_data.pet_id,
        appointment_date=appointment_data.appointment_date,
        reason=appointment_data.reason,
        status="pending"
    )
    
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    
    return appointment


@router.get("/appointments/", response_model=List[VetAppointmentResponse])
async def get_my_appointments(
    current_user: User = Depends(verify_owner_role),
    db: Session = Depends(get_db)
):
    """Получить список моих записей"""
    appointments = db.query(VetAppointment).filter(
        VetAppointment.pet_owner_id == current_user.id
    ).order_by(VetAppointment.appointment_date.desc()).all()
    return appointments


@router.post("/consultations/", response_model=VetConsultationResponse, status_code=status.HTTP_201_CREATED)
async def create_consultation(
    consultation_data: VetConsultationCreate,
    current_user: User = Depends(verify_owner_role),
    db: Session = Depends(get_db)
):
    """Создать консультацию"""
    # Проверяем, что питомец принадлежит пользователю
    pet = db.query(Pet).filter(
        Pet.id == consultation_data.pet_id,
        Pet.user_id == current_user.id
    ).first()
    
    if not pet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Питомец не найден или не принадлежит вам"
        )
    
    # Проверяем, что ветеринар существует и имеет роль ветеринара
    vet = db.query(User).join(Profile).filter(
        User.id == consultation_data.vet_id,
        Profile.role == 2
    ).first()
    
    if not vet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ветеринар не найден"
        )
    
    consultation = VetConsultation(
        vet_id=consultation_data.vet_id,
        pet_owner_id=current_user.id,
        pet_id=consultation_data.pet_id,
        question=consultation_data.question,
        status="pending"
    )
    
    db.add(consultation)
    db.commit()
    db.refresh(consultation)
    
    return consultation


@router.get("/consultations/", response_model=List[VetConsultationResponse])
async def get_my_consultations(
    current_user: User = Depends(verify_owner_role),
    db: Session = Depends(get_db)
):
    """Получить список моих консультаций"""
    consultations = db.query(VetConsultation).filter(
        VetConsultation.pet_owner_id == current_user.id
    ).order_by(VetConsultation.created_at.desc()).all()
    return consultations

