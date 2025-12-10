from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey
from app.database import Base


class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    animal_name = Column(String, nullable=False)
    assistant_sms = Column(String, nullable=False)
    date_assistant = Column(Date, nullable=False)
    status = Column(Boolean, default=True)  # True = Запланировано, False = Сделано

