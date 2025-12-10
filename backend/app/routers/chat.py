"""
Роутер для AI чата
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, Profile
from app.models.pet import Pet
from app.models.reference import TypeOfAnimal, RefShop
from app.dependencies import get_current_user
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.ai_service import ai_service

router = APIRouter()


@router.post("/chat/", response_model=ChatResponse)
async def chat_with_ai(
    chat_request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Отправка сообщения в AI ассистент и получение ответа
    """
    try:
        # Получаем питомцев пользователя
        pets = db.query(Pet).filter(Pet.user_id == current_user.id).all()
        
        # Получаем словарь видов животных
        species_types = db.query(TypeOfAnimal).filter(TypeOfAnimal.is_active == True).all()
        species_dict = {st.id: st.name_ru for st in species_types}
        
        # Получаем список ветеринаров (специалистов)
        veterinarians_query = db.query(User).join(Profile).filter(
            Profile.role == 2,
            User.is_active == True
        ).all()
        
        veterinarians = []
        for vet in veterinarians_query:
            if vet.profile:
                vet_dict = {
                    "id": vet.id,
                    "username": vet.username,
                    "email": vet.email,
                    "first_name": vet.profile.first_name,
                    "last_name": vet.profile.last_name,
                    "third_name": vet.profile.third_name,
                    "phone": vet.profile.phone,
                    "clinic": vet.profile.clinic,
                    "position": vet.profile.position,
                    "specialization": vet.profile.specialization,
                    "city": vet.profile.city,
                    "address": vet.profile.address,
                    "description": vet.profile.description
                }
                veterinarians.append(vet_dict)
        
        # Получаем список активных товаров
        products_query = db.query(RefShop).filter(RefShop.is_active == True).limit(20).all()
        
        products = []
        for product in products_query:
            product_dict = {
                "id": product.id,
                "name_ru": product.name_ru,
                "name_kg": product.name_kg,
                "description": product.description,
                "img_url": product.img_url,
                "price": product.price,
                "stock_quantity": product.stock_quantity,
                "is_active": product.is_active
            }
            # Добавляем информацию о подкатегории, если есть
            if product.subcategory:
                product_dict["subcategory"] = {
                    "id": product.subcategory.id,
                    "name_ru": product.subcategory.name_ru,
                    "name_kg": product.subcategory.name_kg,
                    "category": {
                        "id": product.subcategory.category.id,
                        "name_ru": product.subcategory.category.name_ru
                    } if product.subcategory.category else None
                }
            products.append(product_dict)
        
        # Подготавливаем историю разговора
        conversation_history = None
        if chat_request.conversation_history:
            conversation_history = [
                {"sender": msg.sender, "text": msg.text}
                for msg in chat_request.conversation_history
            ]
        
        # Получаем ответ от AI с контекстом о специалистах и товарах
        ai_response = await ai_service.chat(
            message=chat_request.message,
            user=current_user,
            pets=pets,
            species_dict=species_dict,
            conversation_history=conversation_history,
            veterinarians=veterinarians,
            products=products
        )
        
        # Проверяем, нужно ли предложить создать напоминание
        reminder_suggestion = await ai_service.create_reminder_suggestion(
            message=chat_request.message,
            user=current_user,
            pets=pets
        )
        
        return ChatResponse(
            response=ai_response,
            reminder_suggestion=reminder_suggestion
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при обработке запроса: {str(e)}"
        )

