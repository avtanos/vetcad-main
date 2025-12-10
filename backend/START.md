# Инструкция по запуску проекта

## Быстрый запуск

### 1. Убедитесь, что Python установлен
```bash
python --version
```

### 2. Установите зависимости
```bash
pip install -r requirements.txt
```

### 3. Настройте базу данных

**Вариант A: Использование SQLite (для разработки)**
- Создайте файл `.env` в папке `backend/` со следующим содержимым:
```
DATABASE_URL=sqlite:///./vetcard.db
SECRET_KEY=your-secret-key-here-change-in-production-change-me-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

**Вариант B: Использование PostgreSQL (для продакшена)**
- Установите и запустите PostgreSQL
- Создайте базу данных:
```sql
CREATE DATABASE vetcard_db;
```
- Создайте файл `.env` с настройками подключения:
```
DATABASE_URL=postgresql://user:password@localhost:5432/vetcard_db
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

### 4. Инициализируйте базу данных (опционально)
```bash
python app/init_db.py
```

### 5. Запустите сервер

**Вариант 1: Через uvicorn**
```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

**Вариант 2: Через скрипт run.py**
```bash
python run.py
```

### 6. Проверьте работу API

Откройте в браузере:
- **Главная страница**: http://localhost:8000
- **Документация Swagger**: http://localhost:8000/docs
- **Альтернативная документация**: http://localhost:8000/redoc
- **Health check**: http://localhost:8000/health

## Решение проблем

### Ошибка подключения к базе данных
Если видите ошибку `connection to server at "localhost" (::1), port 5432 failed`:
- Убедитесь, что используете SQLite (см. Вариант A выше)
- Или установите и запустите PostgreSQL

### Модуль не найден
Если видите `ModuleNotFoundError`:
```bash
pip install -r requirements.txt
```

### Порт занят
Если порт 8000 занят, используйте другой:
```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

## Структура API

После запуска сервера будут доступны следующие эндпоинты:

- `/api/v1/auth/` - Аутентификация
- `/api/v1/pet/` - Управление питомцами
- `/api/v1/reference/` - Справочники
- `/api/v1/parser/` - Статьи
- `/api/v1/assistant/` - Напоминания

Подробная документация доступна в Swagger UI: http://localhost:8000/docs

