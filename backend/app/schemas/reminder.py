from pydantic import BaseModel
from typing import Optional
from datetime import date


class ReminderBase(BaseModel):
    animal_name: Optional[str] = ""
    assistant_sms: str
    date_assistant: date
    status: bool = True


class ReminderCreate(BaseModel):
    assistant_sms: str
    date_assistant: date
    status: bool = True
    animal_name: Optional[str] = ""


class ReminderUpdate(BaseModel):
    assistant_sms: Optional[str] = None
    date_assistant: Optional[date] = None
    status: Optional[bool] = None
    animal_name: Optional[str] = None


class ReminderResponse(BaseModel):
    id: int
    animalName: str
    assistant_sms: str
    date_assistant: date
    status: bool

    class Config:
        from_attributes = True

