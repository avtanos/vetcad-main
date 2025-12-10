"""
Роутер для AI чата
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.pet import Pet
from app.models.reference import TypeOfAnimal
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
        
        # Подготавливаем историю разговора
        conversation_history = None
        if chat_request.conversation_history:
            conversation_history = [
                {"sender": msg.sender, "text": msg.text}
                for msg in chat_request.conversation_history
            ]
        
        # Получаем ответ от AI
        ai_response = await ai_service.chat(
            message=chat_request.message,
            user=current_user,
            pets=pets,
            species_dict=species_dict,
            conversation_history=conversation_history
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

