from pydantic import BaseModel, EmailStr
from typing import Optional


class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str
    password2: str


class Token(BaseModel):
    access: str
    refresh: str


class TokenRefresh(BaseModel):
    refresh: str


class UserLogin(BaseModel):
    username: str
    password: str


class ProfileResponse(BaseModel):
    id: int
    profile_id: int
    username: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    third_name: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    logo: Optional[str] = None
    role: Optional[int] = None
    clinic: Optional[str] = None
    position: Optional[str] = None
    specialization: Optional[str] = None
    experience: Optional[str] = None
    license_number: Optional[str] = None
    name_of_organization: Optional[str] = None
    type: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    third_name: Optional[str] = None
    role: Optional[int] = None
    clinic: Optional[str] = None
    position: Optional[str] = None
    specialization: Optional[str] = None
    experience: Optional[str] = None
    license_number: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    name_of_organization: Optional[str] = None
    type: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    logo: Optional[str] = None
    # Игнорируем поля, которые фронтенд может отправить, но не должны обновляться
    id: Optional[int] = None
    profile_id: Optional[int] = None
    username: Optional[str] = None
    email: Optional[str] = None

