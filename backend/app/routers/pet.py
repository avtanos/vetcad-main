from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.pet import Pet
from app.models.user import User
from app.schemas.pet import PetCreate, PetResponse, PetUpdate
from app.dependencies import get_current_user

router = APIRouter()


@router.get("/", response_model=List[PetResponse])
async def get_pets(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pets = db.query(Pet).filter(Pet.user_id == current_user.id).all()
    return pets


@router.post("/", response_model=PetResponse, status_code=status.HTTP_201_CREATED)
async def create_pet(
    pet_data: PetCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Проверка, что user_id соответствует текущему пользователю
    if pet_data.user != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нет доступа для создания питомца для другого пользователя"
        )
    
    db_pet = Pet(
        name=pet_data.name,
        species=pet_data.type_of_animal,
        breed=None,  # Frontend doesn't send breed in create
        birth_date=pet_data.birth_date,
        weight=None,  # Frontend doesn't send weight in create
        image_url=pet_data.image_url,
        special_notes=pet_data.special_notes,
        user_id=pet_data.user
    )
    db.add(db_pet)
    db.commit()
    db.refresh(db_pet)
    
    return db_pet


@router.put("/{pet_id}/", response_model=PetResponse)
async def update_pet(
    pet_id: int,
    pet_data: PetUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_pet = db.query(Pet).filter(Pet.id == pet_id).first()
    
    if not db_pet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Питомец не найден"
        )
    
    if db_pet.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нет доступа к этому питомцу"
        )
    
    update_data = pet_data.model_dump(exclude_unset=True, exclude={"user"})  # Игнорируем user
    for field, value in update_data.items():
        if field == "species" and value is not None:
            setattr(db_pet, "species", value)
        elif field != "user":  # Не обновляем user_id
            setattr(db_pet, field, value)
    
    db.commit()
    db.refresh(db_pet)
    
    return db_pet


@router.delete("/{pet_id}/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pet(
    pet_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_pet = db.query(Pet).filter(Pet.id == pet_id).first()
    
    if not db_pet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Питомец не найден"
        )
    
    if db_pet.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нет доступа к этому питомцу"
        )
    
    db.delete(db_pet)
    db.commit()
    
    return None

