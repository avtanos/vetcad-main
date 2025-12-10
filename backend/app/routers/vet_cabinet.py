"""
Роутер для кабинета ветеринара
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User, Profile
from app.models.pet import Pet
from app.models.reference import TypeOfAnimal
from app.models.vet_cabinet import VetAppointment, VetConsultation, VetArticle
from app.schemas.vet_cabinet import (
    VetAppointmentResponse, VetAppointmentCreate, VetAppointmentUpdate,
    VetConsultationResponse, VetConsultationCreate, VetConsultationAnswer,
    VetArticleResponse, VetArticleCreate, PetCardSummary, VeterinarianPublic
)
from datetime import datetime

router = APIRouter()


@router.get("/list", response_model=List[VeterinarianPublic])
async def get_veterinarians(
    db: Session = Depends(get_db)
):
    """Получить список всех ветеринаров (публичный endpoint)"""
    veterinarians = db.query(User).join(Profile).filter(
        Profile.role == 2,
        User.is_active == True
    ).all()
    
    result = []
    for vet in veterinarians:
        if vet.profile:
            result.append(VeterinarianPublic(
                id=vet.id,
                username=vet.username,
                email=vet.email,
                first_name=vet.profile.first_name,
                last_name=vet.profile.last_name,
                third_name=vet.profile.third_name,
                phone=vet.profile.phone,
                clinic=vet.profile.clinic,
                position=vet.profile.position,
                specialization=vet.profile.specialization,
                experience=vet.profile.experience,
                license_number=vet.profile.license_number,
                city=vet.profile.city,
                address=vet.profile.address,
                description=vet.profile.description
            ))
    
    return result


def verify_vet_role(current_user: User = Depends(get_current_user)):
    """Проверка, что пользователь - ветеринар"""
    if not current_user.profile or current_user.profile.role != 2:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ разрешен только ветеринарам"
        )
    return current_user


@router.get("/patients", response_model=List[PetCardSummary])
async def get_patients(
    current_user: User = Depends(verify_vet_role),
    db: Session = Depends(get_db)
):
    """Получить список пациентов (питомцев, которые записывались к ветеринару)"""
    # Получаем всех питомцев, у которых есть записи к этому ветеринару
    appointments = db.query(VetAppointment).filter(
        VetAppointment.vet_id == current_user.id
    ).all()
    
    pet_ids = {app.pet_id for app in appointments}
    pets = db.query(Pet).filter(Pet.id.in_(pet_ids)).all()
    
    # Получаем виды животных
    species_types = db.query(TypeOfAnimal).all()
    species_dict = {st.id: st.name_ru for st in species_types}
    
    result = []
    for pet in pets:
        owner = db.query(User).filter(User.id == pet.user_id).first()
        owner_name = None
        if owner and owner.profile:
            parts = [owner.profile.first_name, owner.profile.last_name]
            owner_name = " ".join([p for p in parts if p])
        
        result.append(PetCardSummary(
            id=pet.id,
            name=pet.name,
            species=species_dict.get(pet.species, "Неизвестно"),
            breed=pet.breed,
            birth_date=pet.birth_date,
            weight=pet.weight,
            special_notes=pet.special_notes,
            owner_name=owner_name
        ))
    
    return result


@router.get("/appointments", response_model=List[VetAppointmentResponse])
async def get_appointments(
    status_filter: str = None,
    current_user: User = Depends(verify_vet_role),
    db: Session = Depends(get_db)
):
    """Получить список записей к ветеринару"""
    query = db.query(VetAppointment).filter(
        VetAppointment.vet_id == current_user.id
    )
    
    if status_filter:
        query = query.filter(VetAppointment.status == status_filter)
    
    appointments = query.order_by(VetAppointment.appointment_date).all()
    return appointments


@router.put("/appointments/{appointment_id}", response_model=VetAppointmentResponse)
async def update_appointment(
    appointment_id: int,
    appointment_data: VetAppointmentUpdate,
    current_user: User = Depends(verify_vet_role),
    db: Session = Depends(get_db)
):
    """Обновить запись (изменить статус или добавить заметки)"""
    appointment = db.query(VetAppointment).filter(
        VetAppointment.id == appointment_id,
        VetAppointment.vet_id == current_user.id
    ).first()
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Запись не найдена"
        )
    
    if appointment_data.status:
        appointment.status = appointment_data.status
    
    if appointment_data.notes is not None:
        appointment.notes = appointment_data.notes
    
    db.commit()
    db.refresh(appointment)
    
    return appointment


@router.get("/consultations", response_model=List[VetConsultationResponse])
async def get_consultations(
    status_filter: str = None,
    current_user: User = Depends(verify_vet_role),
    db: Session = Depends(get_db)
):
    """Получить список консультаций"""
    query = db.query(VetConsultation).filter(
        VetConsultation.vet_id == current_user.id
    )
    
    if status_filter:
        query = query.filter(VetConsultation.status == status_filter)
    
    consultations = query.order_by(VetConsultation.created_at.desc()).all()
    return consultations


@router.post("/consultations/{consultation_id}/answer", response_model=VetConsultationResponse)
async def answer_consultation(
    consultation_id: int,
    answer_data: VetConsultationAnswer,
    current_user: User = Depends(verify_vet_role),
    db: Session = Depends(get_db)
):
    """Ответить на консультацию"""
    consultation = db.query(VetConsultation).filter(
        VetConsultation.id == consultation_id,
        VetConsultation.vet_id == current_user.id
    ).first()
    
    if not consultation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Консультация не найдена"
        )
    
    consultation.answer = answer_data.answer
    consultation.status = "answered"
    consultation.answered_at = datetime.utcnow()
    
    db.commit()
    db.refresh(consultation)
    
    return consultation


@router.get("/articles", response_model=List[VetArticleResponse])
async def get_my_articles(
    current_user: User = Depends(verify_vet_role),
    db: Session = Depends(get_db)
):
    """Получить список статей ветеринара"""
    articles = db.query(VetArticle).filter(
        VetArticle.vet_id == current_user.id
    ).order_by(VetArticle.created_at.desc()).all()
    return articles


@router.post("/articles", response_model=VetArticleResponse, status_code=status.HTTP_201_CREATED)
async def create_article(
    article_data: VetArticleCreate,
    current_user: User = Depends(verify_vet_role),
    db: Session = Depends(get_db)
):
    """Создать статью"""
    article = VetArticle(
        vet_id=current_user.id,
        **article_data.dict()
    )
    
    if article_data.is_published:
        article.published_at = datetime.utcnow()
    
    db.add(article)
    db.commit()
    db.refresh(article)
    
    return article


@router.put("/articles/{article_id}", response_model=VetArticleResponse)
async def update_article(
    article_id: int,
    article_data: VetArticleCreate,
    current_user: User = Depends(verify_vet_role),
    db: Session = Depends(get_db)
):
    """Обновить статью"""
    article = db.query(VetArticle).filter(
        VetArticle.id == article_id,
        VetArticle.vet_id == current_user.id
    ).first()
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Статья не найдена"
        )
    
    for key, value in article_data.dict().items():
        setattr(article, key, value)
    
    if article_data.is_published and not article.published_at:
        article.published_at = datetime.utcnow()
    
    db.commit()
    db.refresh(article)
    
    return article


@router.delete("/articles/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_article(
    article_id: int,
    current_user: User = Depends(verify_vet_role),
    db: Session = Depends(get_db)
):
    """Удалить статью"""
    article = db.query(VetArticle).filter(
        VetArticle.id == article_id,
        VetArticle.vet_id == current_user.id
    ).first()
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Статья не найдена"
        )
    
    db.delete(article)
    db.commit()
    
    return None

