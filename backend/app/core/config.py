from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # По умолчанию используем SQLite для быстрого запуска
    # Для продакшена установите DATABASE_URL в .env файле
    DATABASE_URL: str = "sqlite:///./vetcard.db"
    SECRET_KEY: str = "your-secret-key-here-change-in-production-change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


settings = Settings()

