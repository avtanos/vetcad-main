from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.reminder import Reminder
from app.models.user import User
from app.schemas.reminder import ReminderCreate, ReminderResponse, ReminderUpdate
from app.dependencies import get_current_user

router = APIRouter()


@router.get("/reminder/", response_model=List[ReminderResponse])
async def get_reminders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    reminders = db.query(Reminder).filter(Reminder.user_id == current_user.id).all()
    
    result = []
    for reminder in reminders:
        result.append(ReminderResponse(
            id=reminder.id,
            animalName=reminder.animal_name,
            assistant_sms=reminder.assistant_sms,
            date_assistant=reminder.date_assistant,
            status=reminder.status
        ))
    
    return result


@router.post("/reminder/", response_model=ReminderResponse, status_code=status.HTTP_201_CREATED)
async def create_reminder(
    reminder_data: ReminderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Автоматически берем user_id из токена
    db_reminder = Reminder(
        user_id=current_user.id,
        animal_name=reminder_data.animal_name or "",
        assistant_sms=reminder_data.assistant_sms,
        date_assistant=reminder_data.date_assistant,
        status=reminder_data.status
    )
    db.add(db_reminder)
    db.commit()
    db.refresh(db_reminder)
    
    return ReminderResponse(
        id=db_reminder.id,
        animalName=db_reminder.animal_name,
        assistant_sms=db_reminder.assistant_sms,
        date_assistant=db_reminder.date_assistant,
        status=db_reminder.status
    )


@router.put("/reminder/{reminder_id}/", response_model=ReminderResponse)
async def update_reminder(
    reminder_id: int,
    reminder_data: ReminderUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_reminder = db.query(Reminder).filter(Reminder.id == reminder_id).first()
    
    if not db_reminder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Напоминание не найдено"
        )
    
    if db_reminder.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нет доступа к этому напоминанию"
        )
    
    update_data = reminder_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if field == "animal_name":
            setattr(db_reminder, "animal_name", value)
        else:
            setattr(db_reminder, field, value)
    
    db.commit()
    db.refresh(db_reminder)
    
    return ReminderResponse(
        id=db_reminder.id,
        animalName=db_reminder.animal_name,
        assistant_sms=db_reminder.assistant_sms,
        date_assistant=db_reminder.date_assistant,
        status=db_reminder.status
    )


@router.delete("/reminder/{reminder_id}/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_reminder(
    reminder_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_reminder = db.query(Reminder).filter(Reminder.id == reminder_id).first()
    
    if not db_reminder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Напоминание не найдено"
        )
    
    if db_reminder.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нет доступа к этому напоминанию"
        )
    
    db.delete(db_reminder)
    db.commit()
    
    return None

