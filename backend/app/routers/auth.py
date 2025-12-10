from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from app.database import get_db
from app.models.user import User, Profile
from app.schemas.auth import (
    UserRegister, Token, TokenRefresh, UserLogin,
    ProfileResponse, ProfileUpdate
)
from app.core.security import (
    verify_password, get_password_hash,
    create_access_token, create_refresh_token, decode_token
)
from app.core.config import settings
from app.dependencies import get_current_user

router = APIRouter()


@router.post("/register/", response_model=ProfileResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    try:
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
        
        if user_data.password != user_data.password2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Пароли не совпадают"
            )
        
        # Создание пользователя
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            username=user_data.username,
            email=user_data.email,
            password_hash=hashed_password
        )
        db.add(db_user)
        db.flush()
        
        # Создание профиля
        db_profile = Profile(user_id=db_user.id, role=1)
        db.add(db_profile)
        db.commit()
        db.refresh(db_user)
        db.refresh(db_profile)
        
        return ProfileResponse(
            id=db_user.id,
            profile_id=db_profile.id,
            username=db_user.username,
            email=db_user.email,
            role=db_profile.role
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при регистрации: {str(e)}"
        )


@router.post("/token/", response_model=Token)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == user_data.username).first()
    
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Пользователь неактивен"
        )
    
    access_token = create_access_token(data={"sub": user.id})
    refresh_token = create_refresh_token(data={"sub": user.id})
    
    return Token(access=access_token, refresh=refresh_token)


@router.post("/token/refresh/", response_model=Token)
async def refresh_token(token_data: TokenRefresh):
    """Обновление access токена с помощью refresh токена"""
    if not token_data.refresh:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh токен не предоставлен"
        )
    
    payload = decode_token(token_data.refresh)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный или истекший refresh токен"
        )
    
    # Проверяем тип токена
    token_type = payload.get("type")
    if token_type != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Неверный тип токена. Ожидается 'refresh', получен '{token_type}'"
        )
    
    # Получаем user_id из токена
    user_id_raw = payload.get("sub")
    if user_id_raw is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный refresh токен: отсутствует идентификатор пользователя"
        )
    
    # Конвертируем user_id в int (может быть строкой из токена)
    try:
        user_id = int(user_id_raw)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный формат refresh токена"
        )
    
    # Создаем новые токены
    access_token = create_access_token(data={"sub": user_id})
    refresh_token = create_refresh_token(data={"sub": user_id})
    
    return Token(access=access_token, refresh=refresh_token)


@router.get("/get_profile/", response_model=ProfileResponse)
async def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Профиль не найден"
        )
    
    return ProfileResponse(
        id=current_user.id,
        profile_id=profile.id,
        username=current_user.username,
        email=current_user.email,
        first_name=profile.first_name,
        last_name=profile.last_name,
        third_name=profile.third_name,
        phone=profile.phone,
        city=profile.city,
        address=profile.address,
        logo=profile.logo,
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
    )


@router.put("/profile/{profile_id}/", response_model=ProfileResponse)
async def update_profile(
    profile_id: int,
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Фронтенд отправляет user.id, но мы ищем профиль по user_id
    # Сначала пробуем найти по profile_id, если не найдено - по user_id
    profile = db.query(Profile).filter(Profile.id == profile_id).first()
    
    # Если не найден по profile_id, возможно фронтенд отправил user.id
    if not profile:
        profile = db.query(Profile).filter(Profile.user_id == profile_id).first()
    
    # Если все еще не найден, используем профиль текущего пользователя
    if not profile:
        profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Профиль не найден"
        )
    
    if profile.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нет доступа к этому профилю"
        )
    
    # Обновление полей (исключаем поля, которые не должны обновляться)
    update_data = profile_data.model_dump(
        exclude_unset=True,
        exclude={"id", "profile_id", "username", "email"}
    )
    for field, value in update_data.items():
        if hasattr(profile, field):
            setattr(profile, field, value)
    
    db.commit()
    db.refresh(profile)
    db.refresh(current_user)
    
    return ProfileResponse(
        id=current_user.id,
        profile_id=profile.id,
        username=current_user.username,
        email=current_user.email,
        first_name=profile.first_name,
        last_name=profile.last_name,
        third_name=profile.third_name,
        phone=profile.phone,
        city=profile.city,
        address=profile.address,
        logo=profile.logo,
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
    )

