"""
Роутер для админ-панели
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.database import get_db
from app.models.user import User, Profile
from app.models.pet import Pet
from app.models.article import Article
from app.models.reference import RefShop
from app.schemas.admin import (
    UserDetailResponse, UserResponse, ProfileResponse,
    UserUpdate, ProfileUpdate, UserCreate, UserListResponse, StatsResponse
)
from app.dependencies import get_current_user
from app.core.security import get_password_hash

router = APIRouter()


def verify_admin_role(current_user: User = Depends(get_current_user)):
    """Проверка, что пользователь - администратор"""
    if not current_user.profile or current_user.profile.role != 4:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ разрешен только администраторам"
        )
    return current_user.id


@router.get("/stats", response_model=StatsResponse)
async def get_stats(
    current_user_id: int = Depends(verify_admin_role),
    db: Session = Depends(get_db)
):
    """Получение статистики системы"""
    total_users = db.query(func.count(User.id)).scalar()
    active_users = db.query(func.count(User.id)).filter(User.is_active == True).scalar()
    
    pet_owners = db.query(func.count(Profile.id)).filter(Profile.role == 1).scalar()
    veterinarians = db.query(func.count(Profile.id)).filter(Profile.role == 2).scalar()
    partners = db.query(func.count(Profile.id)).filter(Profile.role == 3).scalar()
    admins = db.query(func.count(Profile.id)).filter(Profile.role == 4).scalar()
    
    total_pets = db.query(func.count(Pet.id)).scalar()
    total_articles = db.query(func.count(Article.id)).scalar()
    total_products = db.query(func.count(RefShop.id)).scalar()
    
    return StatsResponse(
        total_users=total_users or 0,
        active_users=active_users or 0,
        pet_owners=pet_owners or 0,
        veterinarians=veterinarians or 0,
        partners=partners or 0,
        admins=admins or 0,
        total_pets=total_pets or 0,
        total_articles=total_articles or 0,
        total_products=total_products or 0
    )


@router.get("/users", response_model=UserListResponse)
async def get_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    role: Optional[int] = Query(None, description="Фильтр по роли"),
    is_active: Optional[bool] = Query(None, description="Фильтр по активности"),
    search: Optional[str] = Query(None, description="Поиск по username или email"),
    current_user_id: int = Depends(verify_admin_role),
    db: Session = Depends(get_db)
):
    """Получение списка пользователей с пагинацией"""
    query = db.query(User)
    
    # Фильтры
    if role is not None:
        query = query.join(Profile).filter(Profile.role == role)
    
    if is_active is not None:
        query = query.filter(User.is_active == is_active)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (User.username.ilike(search_filter)) |
            (User.email.ilike(search_filter))
        )
    
    # Подсчет общего количества
    total = query.count()
    
    # Получение данных с пагинацией
    users = query.offset(skip).limit(limit).all()
    
    # Формирование ответа
    user_list = []
    for user in users:
        profile = db.query(Profile).filter(Profile.user_id == user.id).first()
        user_list.append(UserDetailResponse(
            user=UserResponse(
                id=user.id,
                username=user.username,
                email=user.email,
                is_active=user.is_active
            ),
            profile=ProfileResponse(
                id=profile.id,
                user_id=profile.user_id,
                first_name=profile.first_name,
                last_name=profile.last_name,
                third_name=profile.third_name,
                phone=profile.phone,
                city=profile.city,
                address=profile.address,
                role=profile.role,
                clinic=profile.clinic,
                position=profile.position,
                specialization=profile.specialization,
                experience=profile.experience,
                license_number=profile.license_number,
                name_of_organization=profile.name_of_organization,
                type=profile.type,
                website=profile.website,
                description=profile.description
            ) if profile else None
        ))
    
    return UserListResponse(total=total, users=user_list)


@router.get("/users/{user_id}", response_model=UserDetailResponse)
async def get_user(
    user_id: int,
    current_user_id: int = Depends(verify_admin_role),
    db: Session = Depends(get_db)
):
    """Получение детальной информации о пользователе"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден"
        )
    
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    
    return UserDetailResponse(
        user=UserResponse(
            id=user.id,
            username=user.username,
            email=user.email,
            is_active=user.is_active
        ),
        profile=ProfileResponse(
            id=profile.id,
            user_id=profile.user_id,
            first_name=profile.first_name,
            last_name=profile.last_name,
            third_name=profile.third_name,
            phone=profile.phone,
            city=profile.city,
            address=profile.address,
            role=profile.role
        ) if profile else None
    )


@router.post("/users", response_model=UserDetailResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: UserCreate,
    current_user_id: int = Depends(verify_admin_role),
    db: Session = Depends(get_db)
):
    """Создание нового пользователя"""
    # Проверка существования пользователя
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким именем уже существует"
        )
    
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким email уже существует"
        )
    
    # Создание пользователя
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_password,
        is_active=True
    )
    db.add(new_user)
    db.flush()
    
    # Создание профиля
    new_profile = Profile(
        user_id=new_user.id,
        role=user_data.role,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        third_name=user_data.third_name,
        phone=user_data.phone,
        city=user_data.city,
        address=user_data.address
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_user)
    db.refresh(new_profile)
    
    return UserDetailResponse(
        user=UserResponse(
            id=new_user.id,
            username=new_user.username,
            email=new_user.email,
            is_active=new_user.is_active
        ),
        profile=ProfileResponse(
            id=new_profile.id,
            user_id=new_profile.user_id,
            first_name=new_profile.first_name,
            last_name=new_profile.last_name,
            third_name=new_profile.third_name,
            phone=new_profile.phone,
            city=new_profile.city,
            address=new_profile.address,
            role=new_profile.role
        )
    )


@router.put("/users/{user_id}", response_model=UserDetailResponse)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    current_user_id: int = Depends(verify_admin_role),
    db: Session = Depends(get_db)
):
    """Обновление данных пользователя"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден"
        )
    
    # Обновление данных пользователя
    if user_data.username is not None:
        # Проверка уникальности username
        existing = db.query(User).filter(User.username == user_data.username, User.id != user_id).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Пользователь с таким именем уже существует"
            )
        user.username = user_data.username
    
    if user_data.email is not None:
        # Проверка уникальности email
        existing = db.query(User).filter(User.email == user_data.email, User.id != user_id).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Пользователь с таким email уже существует"
            )
        user.email = user_data.email
    
    if user_data.is_active is not None:
        user.is_active = user_data.is_active
    
    if user_data.password is not None:
        user.password_hash = get_password_hash(user_data.password)
    
    db.commit()
    db.refresh(user)
    
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    
    return UserDetailResponse(
        user=UserResponse(
            id=user.id,
            username=user.username,
            email=user.email,
            is_active=user.is_active
        ),
        profile=ProfileResponse(
            id=profile.id,
            user_id=profile.user_id,
            first_name=profile.first_name,
            last_name=profile.last_name,
            third_name=profile.third_name,
            phone=profile.phone,
            city=profile.city,
            address=profile.address,
            role=profile.role
        ) if profile else None
    )


@router.put("/users/{user_id}/profile", response_model=UserDetailResponse)
async def update_user_profile(
    user_id: int,
    profile_data: ProfileUpdate,
    current_user_id: int = Depends(verify_admin_role),
    db: Session = Depends(get_db)
):
    """Обновление профиля пользователя"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден"
        )
    
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if not profile:
        # Создаем профиль, если его нет
        profile = Profile(user_id=user.id, role=1)
        db.add(profile)
        db.flush()
    
    # Обновление данных профиля
    if profile_data.first_name is not None:
        profile.first_name = profile_data.first_name
    if profile_data.last_name is not None:
        profile.last_name = profile_data.last_name
    if profile_data.third_name is not None:
        profile.third_name = profile_data.third_name
    if profile_data.phone is not None:
        profile.phone = profile_data.phone
    if profile_data.city is not None:
        profile.city = profile_data.city
    if profile_data.address is not None:
        profile.address = profile_data.address
    if profile_data.role is not None:
        profile.role = profile_data.role
    
    db.commit()
    db.refresh(profile)
    
    return UserDetailResponse(
        user=UserResponse(
            id=user.id,
            username=user.username,
            email=user.email,
            is_active=user.is_active
        ),
        profile=ProfileResponse(
            id=profile.id,
            user_id=profile.user_id,
            first_name=profile.first_name,
            last_name=profile.last_name,
            third_name=profile.third_name,
            phone=profile.phone,
            city=profile.city,
            address=profile.address,
            role=profile.role
        )
    )


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    current_user_id: int = Depends(verify_admin_role),
    db: Session = Depends(get_db)
):
    """Удаление пользователя"""
    if user_id == current_user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Нельзя удалить самого себя"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден"
        )
    
    # Удаление профиля
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if profile:
        db.delete(profile)
    
    # Удаление пользователя
    db.delete(user)
    db.commit()
    
    return None

