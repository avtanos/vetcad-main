"""
Роутер для кабинета партнера
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.reference import RefShop
from app.models.partner_cabinet import (
    PartnerSchedule, PartnerLocation, PartnerService,
    PartnerEmployee, PartnerPromotion, ProductView
)
from app.schemas.partner_cabinet import (
    PartnerScheduleCreate, PartnerScheduleResponse,
    PartnerLocationCreate, PartnerLocationResponse,
    PartnerServiceCreate, PartnerServiceResponse,
    PartnerEmployeeCreate, PartnerEmployeeResponse,
    PartnerPromotionCreate, PartnerPromotionResponse,
    ProductStatsResponse
)
from datetime import datetime, timedelta
from sqlalchemy import func

router = APIRouter()


def verify_partner_role(current_user: User = Depends(get_current_user)):
    """Проверка, что пользователь - партнер"""
    if not current_user.profile or current_user.profile.role != 3:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ разрешен только партнерам"
        )
    return current_user


# График работы
@router.get("/schedule", response_model=List[PartnerScheduleResponse])
async def get_schedule(
    current_user: User = Depends(verify_partner_role),
    db: Session = Depends(get_db)
):
    """Получить график работы"""
    schedules = db.query(PartnerSchedule).filter(
        PartnerSchedule.partner_id == current_user.id
    ).order_by(PartnerSchedule.day_of_week).all()
    return schedules


@router.post("/schedule", response_model=PartnerScheduleResponse, status_code=status.HTTP_201_CREATED)
async def create_schedule(
    schedule_data: PartnerScheduleCreate,
    current_user: User = Depends(verify_partner_role),
    db: Session = Depends(get_db)
):
    """Создать/обновить график работы"""
    # Проверяем, существует ли уже запись для этого дня
    existing = db.query(PartnerSchedule).filter(
        PartnerSchedule.partner_id == current_user.id,
        PartnerSchedule.day_of_week == schedule_data.day_of_week
    ).first()
    
    if existing:
        for key, value in schedule_data.dict().items():
            setattr(existing, key, value)
        db.commit()
        db.refresh(existing)
        return existing
    else:
        schedule = PartnerSchedule(
            partner_id=current_user.id,
            **schedule_data.dict()
        )
        db.add(schedule)
        db.commit()
        db.refresh(schedule)
        return schedule


# Геолокация
@router.get("/location", response_model=PartnerLocationResponse)
async def get_location(
    current_user: User = Depends(verify_partner_role),
    db: Session = Depends(get_db)
):
    """Получить геолокацию"""
    location = db.query(PartnerLocation).filter(
        PartnerLocation.partner_id == current_user.id
    ).first()
    
    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Геолокация не установлена"
        )
    
    return location


@router.post("/location", response_model=PartnerLocationResponse)
async def set_location(
    location_data: PartnerLocationCreate,
    current_user: User = Depends(verify_partner_role),
    db: Session = Depends(get_db)
):
    """Установить геолокацию"""
    location = db.query(PartnerLocation).filter(
        PartnerLocation.partner_id == current_user.id
    ).first()
    
    if location:
        for key, value in location_data.dict().items():
            setattr(location, key, value)
        db.commit()
        db.refresh(location)
        return location
    else:
        location = PartnerLocation(
            partner_id=current_user.id,
            **location_data.dict()
        )
        db.add(location)
        db.commit()
        db.refresh(location)
        return location


# Услуги
@router.get("/services", response_model=List[PartnerServiceResponse])
async def get_services(
    current_user: User = Depends(verify_partner_role),
    db: Session = Depends(get_db)
):
    """Получить список услуг"""
    services = db.query(PartnerService).filter(
        PartnerService.partner_id == current_user.id
    ).order_by(PartnerService.created_at.desc()).all()
    return services


@router.post("/services", response_model=PartnerServiceResponse, status_code=status.HTTP_201_CREATED)
async def create_service(
    service_data: PartnerServiceCreate,
    current_user: User = Depends(verify_partner_role),
    db: Session = Depends(get_db)
):
    """Создать услугу"""
    service = PartnerService(
        partner_id=current_user.id,
        **service_data.dict()
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@router.put("/services/{service_id}", response_model=PartnerServiceResponse)
async def update_service(
    service_id: int,
    service_data: PartnerServiceCreate,
    current_user: User = Depends(verify_partner_role),
    db: Session = Depends(get_db)
):
    """Обновить услугу"""
    service = db.query(PartnerService).filter(
        PartnerService.id == service_id,
        PartnerService.partner_id == current_user.id
    ).first()
    
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Услуга не найдена"
        )
    
    for key, value in service_data.dict().items():
        setattr(service, key, value)
    
    db.commit()
    db.refresh(service)
    return service


@router.delete("/services/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_service(
    service_id: int,
    current_user: User = Depends(verify_partner_role),
    db: Session = Depends(get_db)
):
    """Удалить услугу"""
    service = db.query(PartnerService).filter(
        PartnerService.id == service_id,
        PartnerService.partner_id == current_user.id
    ).first()
    
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Услуга не найдена"
        )
    
    db.delete(service)
    db.commit()
    return None


# Сотрудники
@router.get("/employees", response_model=List[PartnerEmployeeResponse])
async def get_employees(
    current_user: User = Depends(verify_partner_role),
    db: Session = Depends(get_db)
):
    """Получить список сотрудников"""
    employees = db.query(PartnerEmployee).filter(
        PartnerEmployee.partner_id == current_user.id
    ).order_by(PartnerEmployee.created_at.desc()).all()
    return employees


@router.post("/employees", response_model=PartnerEmployeeResponse, status_code=status.HTTP_201_CREATED)
async def create_employee(
    employee_data: PartnerEmployeeCreate,
    current_user: User = Depends(verify_partner_role),
    db: Session = Depends(get_db)
):
    """Добавить сотрудника"""
    employee = PartnerEmployee(
        partner_id=current_user.id,
        **employee_data.dict()
    )
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


@router.put("/employees/{employee_id}", response_model=PartnerEmployeeResponse)
async def update_employee(
    employee_id: int,
    employee_data: PartnerEmployeeCreate,
    current_user: User = Depends(verify_partner_role),
    db: Session = Depends(get_db)
):
    """Обновить сотрудника"""
    employee = db.query(PartnerEmployee).filter(
        PartnerEmployee.id == employee_id,
        PartnerEmployee.partner_id == current_user.id
    ).first()
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Сотрудник не найден"
        )
    
    for key, value in employee_data.dict().items():
        setattr(employee, key, value)
    
    db.commit()
    db.refresh(employee)
    return employee


@router.delete("/employees/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(
    employee_id: int,
    current_user: User = Depends(verify_partner_role),
    db: Session = Depends(get_db)
):
    """Удалить сотрудника"""
    employee = db.query(PartnerEmployee).filter(
        PartnerEmployee.id == employee_id,
        PartnerEmployee.partner_id == current_user.id
    ).first()
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Сотрудник не найден"
        )
    
    db.delete(employee)
    db.commit()
    return None


# Акции
@router.get("/promotions", response_model=List[PartnerPromotionResponse])
async def get_promotions(
    current_user: User = Depends(verify_partner_role),
    db: Session = Depends(get_db)
):
    """Получить список акций"""
    promotions = db.query(PartnerPromotion).filter(
        PartnerPromotion.partner_id == current_user.id
    ).order_by(PartnerPromotion.created_at.desc()).all()
    return promotions


@router.post("/promotions", response_model=PartnerPromotionResponse, status_code=status.HTTP_201_CREATED)
async def create_promotion(
    promotion_data: PartnerPromotionCreate,
    current_user: User = Depends(verify_partner_role),
    db: Session = Depends(get_db)
):
    """Создать акцию"""
    promotion = PartnerPromotion(
        partner_id=current_user.id,
        **promotion_data.dict()
    )
    db.add(promotion)
    db.commit()
    db.refresh(promotion)
    return promotion


@router.put("/promotions/{promotion_id}", response_model=PartnerPromotionResponse)
async def update_promotion(
    promotion_id: int,
    promotion_data: PartnerPromotionCreate,
    current_user: User = Depends(verify_partner_role),
    db: Session = Depends(get_db)
):
    """Обновить акцию"""
    promotion = db.query(PartnerPromotion).filter(
        PartnerPromotion.id == promotion_id,
        PartnerPromotion.partner_id == current_user.id
    ).first()
    
    if not promotion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Акция не найдена"
        )
    
    for key, value in promotion_data.dict().items():
        setattr(promotion, key, value)
    
    db.commit()
    db.refresh(promotion)
    return promotion


@router.delete("/promotions/{promotion_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_promotion(
    promotion_id: int,
    current_user: User = Depends(verify_partner_role),
    db: Session = Depends(get_db)
):
    """Удалить акцию"""
    promotion = db.query(PartnerPromotion).filter(
        PartnerPromotion.id == promotion_id,
        PartnerPromotion.partner_id == current_user.id
    ).first()
    
    if not promotion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Акция не найдена"
        )
    
    db.delete(promotion)
    db.commit()
    return None


# Статистика товаров
@router.get("/products/stats", response_model=List[ProductStatsResponse])
async def get_products_stats(
    current_user: User = Depends(verify_partner_role),
    db: Session = Depends(get_db)
):
    """Получить статистику просмотров товаров"""
    # Получаем товары партнера
    products = db.query(RefShop).filter(
        RefShop.user_id == current_user.id
    ).all()
    
    stats = []
    now = datetime.utcnow()
    today_start = datetime(now.year, now.month, now.day)
    week_start = today_start - timedelta(days=now.weekday())
    month_start = datetime(now.year, now.month, 1)
    
    for product in products:
        views = db.query(ProductView).filter(
            ProductView.product_id == product.id
        )
        
        total_views = views.count()
        unique_views = views.distinct(ProductView.user_id).count()
        views_today = views.filter(ProductView.viewed_at >= today_start).count()
        views_this_week = views.filter(ProductView.viewed_at >= week_start).count()
        views_this_month = views.filter(ProductView.viewed_at >= month_start).count()
        
        stats.append(ProductStatsResponse(
            product_id=product.id,
            total_views=total_views,
            unique_views=unique_views,
            views_today=views_today,
            views_this_week=views_this_week,
            views_this_month=views_this_month
        ))
    
    return stats

