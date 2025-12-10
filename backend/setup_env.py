"""
Скрипт для настройки .env файла
"""
import os
from pathlib import Path

def setup_env():
    env_file = Path(".env")
    env_example = Path("env.example")
    
    # Если .env не существует, создаем из примера
    if not env_file.exists():
        if env_example.exists():
            with open(env_example, 'r', encoding='utf-8') as f:
                content = f.read()
            # Заменяем PostgreSQL на SQLite для быстрого запуска
            content = content.replace(
                "DATABASE_URL=postgresql://user:password@localhost:5432/vetcard_db",
                "DATABASE_URL=sqlite:///./vetcard.db"
            )
            with open(env_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print("✅ Создан файл .env с настройками SQLite")
        else:
            # Создаем новый .env файл
            content = """DATABASE_URL=sqlite:///./vetcard.db
SECRET_KEY=your-secret-key-here-change-in-production-change-me-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
"""
            with open(env_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print("✅ Создан файл .env с настройками по умолчанию")
    else:
        # Проверяем содержимое .env
        with open(env_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if "postgresql://" in content and "sqlite://" not in content:
            print("⚠️  В .env файле указан PostgreSQL.")
            print("   Автоматически изменяю на SQLite для быстрого запуска...")
            # Заменяем все варианты PostgreSQL URL на SQLite
            import re
            content = re.sub(
                r'DATABASE_URL=postgresql://[^\n]+',
                'DATABASE_URL=sqlite:///./vetcard.db',
                content
            )
            with open(env_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print("✅ Файл .env обновлен для использования SQLite")
        else:
            print("✅ Файл .env настроен корректно")

if __name__ == "__main__":
    setup_env()

