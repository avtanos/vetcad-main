from sqlalchemy import Column, Integer, String, ForeignKey, Date, Float, Text
from sqlalchemy.orm import relationship
from app.database import Base


class Pet(Base):
    __tablename__ = "pets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    species = Column(Integer, ForeignKey("type_of_animals.id"), nullable=False)
    breed = Column(String, nullable=True)
    birth_date = Column(Date, nullable=True)
    weight = Column(Float, nullable=True)
    image_url = Column(String, nullable=True)
    special_notes = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

