from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

    profile = relationship("Profile", back_populates="user", uselist=False)


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    third_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    city = Column(String, nullable=True)
    address = Column(String, nullable=True)
    logo = Column(String, nullable=True)
    role = Column(Integer, default=1)  # 1=petOwner, 2=veterinarian, 3=partner
    
    # Для ветеринаров
    clinic = Column(String, nullable=True)
    position = Column(String, nullable=True)
    specialization = Column(String, nullable=True)
    experience = Column(String, nullable=True)
    license_number = Column(String, nullable=True)
    
    # Для партнеров
    name_of_organization = Column(String, nullable=True)
    type = Column(String, nullable=True)
    website = Column(String, nullable=True)
    description = Column(String, nullable=True)

    user = relationship("User", back_populates="profile")

