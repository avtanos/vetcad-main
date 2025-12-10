# VetCard Backend API

Backend API для приложения VetCard, реализованный на FastAPI.

## Установка

1. Создайте виртуальное окружение:
```bash
python -m venv venv
source venv/bin/activate  # На Windows: venv\Scripts\activate
```

2. Установите зависимости:
```bash
pip install -r requirements.txt
```

3. Создайте файл `.env` на основе `.env.example`:
```bash
cp .env.example .env
```

4. Настройте переменные окружения в `.env`:
- `DATABASE_URL` - URL подключения к PostgreSQL
- `SECRET_KEY` - секретный ключ для JWT (используйте надежный ключ в продакшене)
- `ALGORITHM` - алгоритм шифрования (по умолчанию HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - время жизни access токена (по умолчанию 30 минут)
- `REFRESH_TOKEN_EXPIRE_DAYS` - время жизни refresh токена (по умолчанию 7 дней)

5. Создайте базу данных PostgreSQL:
```sql
CREATE DATABASE vetcard_db;
```

6. Инициализируйте базу данных с начальными данными:
```bash
python -m app.init_db
```

Это создаст таблицы и добавит начальные данные (типы животных, примеры статей).

7. (Опционально) Создайте мокап данные для тестирования:
```bash
python -m app.mock_data
```

Это создаст тестовых пользователей, питомцев, товары, статьи и напоминания.
См. `MOCK_DATA.md` для подробностей о созданных данных.

7. Запустите приложение:
```bash
# Вариант 1: Через uvicorn напрямую
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Вариант 2: Через скрипт run.py
python run.py
```

API будет доступно по адресу: http://localhost:8000

Документация API (Swagger): http://localhost:8000/docs
Альтернативная документация (ReDoc): http://localhost:8000/redoc

## Структура проекта

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # Точка входа приложения
│   ├── database.py          # Настройка базы данных
│   ├── dependencies.py      # Зависимости (аутентификация)
│   ├── core/
│   │   ├── config.py        # Конфигурация
│   │   └── security.py       # Функции безопасности (JWT, хеширование)
│   ├── models/              # SQLAlchemy модели
│   │   ├── user.py
│   │   ├── pet.py
│   │   ├── reference.py
│   │   ├── article.py
│   │   └── reminder.py
│   ├── schemas/             # Pydantic схемы
│   │   ├── auth.py
│   │   ├── pet.py
│   │   ├── reference.py
│   │   ├── article.py
│   │   └── reminder.py
│   └── routers/             # API роутеры
│       ├── auth.py          # Аутентификация
│       ├── pet.py           # Питомцы
│       ├── reference.py     # Справочники
│       ├── parser.py        # Статьи
│       └── assistant.py     # Напоминания
├── requirements.txt
├── .env.example
└── README.md
```

## API Endpoints

### Аутентификация (`/api/v1/auth`)
- `POST /register/` - Регистрация пользователя
- `POST /token/` - Получение JWT токенов (логин)
- `POST /token/refresh/` - Обновление access токена
- `GET /get_profile/` - Получение профиля пользователя
- `PUT /profile/{profile_id}/` - Обновление профиля

### Питомцы (`/api/v1/pet`)
- `GET /` - Получение списка питомцев пользователя
- `POST /` - Создание питомца
- `PUT /{pet_id}/` - Обновление питомца
- `DELETE /{pet_id}/` - Удаление питомца

### Справочники (`/api/v1/reference`)
- `GET /ref_type_of_animal/` - Получение типов животных
- `GET /ref_shop/` - Получение товаров
- `POST /ref_shop/` - Создание товара

### Статьи (`/api/v1/parser`)
- `GET /articles/` - Получение статей

### Напоминания (`/api/v1/assistant`)
- `GET /reminder/` - Получение напоминаний пользователя
- `POST /reminder/` - Создание напоминания

## Роли пользователей

- `1` - Владелец питомца (petOwner)
- `2` - Ветеринар (veterinarian)
- `3` - Партнер (partner)

## Безопасность

- Все эндпоинты (кроме регистрации и логина) требуют JWT токен в заголовке `Authorization: Bearer <token>`
- Пароли хешируются с использованием bcrypt
- Access токены имеют ограниченное время жизни
- Refresh токены используются для обновления access токенов

## Миграции базы данных

Для управления миграциями базы данных рекомендуется использовать Alembic:

```bash
# Инициализация
alembic init alembic

# Создание миграции
alembic revision --autogenerate -m "Initial migration"

# Применение миграций
alembic upgrade head
```

## Разработка

Для разработки с автоматической перезагрузкой:
```bash
uvicorn app.main:app --reload
```

или

```bash
python run.py
```

## Инициализация базы данных

После создания базы данных выполните:
```bash
python app/init_db.py
```

Этот скрипт:
- Создаст все необходимые таблицы
- Добавит типы животных (собака, кошка, птица и т.д.)
- Добавит примеры статей (опционально)

## Примеры использования API

### Регистрация пользователя
```bash
curl -X POST "http://localhost:8000/api/v1/auth/register/" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "password2": "testpass123"
  }'
```

### Вход в систему
```bash
curl -X POST "http://localhost:8000/api/v1/auth/token/" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'
```

### Получение профиля (требует авторизации)
```bash
curl -X GET "http://localhost:8000/api/v1/auth/get_profile/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Создание питомца
```bash
curl -X POST "http://localhost:8000/api/v1/pet/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Рекс",
    "birth_date": "2020-01-15",
    "type_of_animal": 1,
    "user": 1
  }'
```

## Тестирование

Примеры запросов можно найти в документации Swagger UI по адресу `/docs`.

