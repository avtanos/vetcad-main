from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey
from app.database import Base


class TypeOfAnimal(Base):
    __tablename__ = "type_of_animals"

    id = Column(Integer, primary_key=True, index=True)
    name_ru = Column(String, nullable=False)
    name_kg = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)


class RefShop(Base):
    __tablename__ = "ref_shop"

    id = Column(Integer, primary_key=True, index=True)
    name_ru = Column(String, nullable=False)
    name_kg = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    img_url = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

