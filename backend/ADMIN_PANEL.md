# Админ-панель VetCard

## Описание

Админ-панель предоставляет супер администратору полный контроль над системой, включая управление пользователями, просмотр статистики и другие административные функции.

## Доступ

- **Роль:** Супер администратор (role=4)
- **Эндпоинты:** `/api/v1/admin/*`
- **Аутентификация:** Требуется JWT токен в заголовке `Authorization: Bearer <token>`

## API Эндпоинты

### Статистика

#### GET `/api/v1/admin/stats`

Получение статистики системы.

**Ответ:**
```json
{
  "total_users": 100,
  "active_users": 95,
  "pet_owners": 60,
  "veterinarians": 20,
  "partners": 15,
  "admins": 5,
  "total_pets": 150,
  "total_articles": 50,
  "total_products": 200
}
```

### Управление пользователями

#### GET `/api/v1/admin/users`

Получение списка пользователей с пагинацией и фильтрацией.

**Параметры запроса:**
- `skip` (int, default=0) - количество пропущенных записей
- `limit` (int, default=100, max=1000) - количество записей на странице
- `role` (int, optional) - фильтр по роли (1=petOwner, 2=veterinarian, 3=partner, 4=admin)
- `is_active` (bool, optional) - фильтр по активности
- `search` (string, optional) - поиск по username или email

**Пример:**
```
GET /api/v1/admin/users?skip=0&limit=10&role=1&is_active=true&search=pet
```

**Ответ:**
```json
{
  "total": 50,
  "users": [
    {
      "user": {
        "id": 1,
        "username": "petowner",
        "email": "owner@vetcard.com",
        "is_active": true
      },
      "profile": {
        "id": 1,
        "user_id": 1,
        "first_name": "Иван",
        "last_name": "Петров",
        "third_name": "Сергеевич",
        "phone": "+996 (555) 123-45-67",
        "city": "Бишкек",
        "address": "ул. Чуй, д. 123",
        "role": 1
      }
    }
  ]
}
```

#### GET `/api/v1/admin/users/{user_id}`

Получение детальной информации о пользователе.

**Ответ:** Аналогичен структуре пользователя из списка

#### POST `/api/v1/admin/users`

Создание нового пользователя.

**Тело запроса:**
```json
{
  "username": "newuser",
  "email": "newuser@vetcard.com",
  "password": "password123",
  "role": 1,
  "first_name": "Имя",
  "last_name": "Фамилия",
  "third_name": "Отчество",
  "phone": "+996 (555) 000-00-00",
  "city": "Бишкек",
  "address": "Адрес"
}
```

**Ответ:** Созданный пользователь с профилем

#### PUT `/api/v1/admin/users/{user_id}`

Обновление данных пользователя.

**Тело запроса:**
```json
{
  "username": "updated_username",
  "email": "updated@vetcard.com",
  "is_active": true,
  "password": "newpassword123"
}
```

**Примечание:** Все поля опциональны. Указывайте только те, которые нужно обновить.

#### PUT `/api/v1/admin/users/{user_id}/profile`

Обновление профиля пользователя.

**Тело запроса:**
```json
{
  "first_name": "Новое имя",
  "last_name": "Новая фамилия",
  "role": 2,
  "city": "Ош"
}
```

**Примечание:** Все поля опциональны. Можно изменить роль пользователя.

#### DELETE `/api/v1/admin/users/{user_id}`

Удаление пользователя.

**Примечание:** Нельзя удалить самого себя.

**Ответ:** 204 No Content

## Примеры использования

### Создание нового ветеринара

```bash
curl -X POST "http://localhost:8000/api/v1/admin/users" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newvet",
    "email": "newvet@vetcard.com",
    "password": "password123",
    "role": 2,
    "first_name": "Новый",
    "last_name": "Ветеринар",
    "clinic": "Клиника",
    "specialization": "Терапия"
  }'
```

### Изменение роли пользователя

```bash
curl -X PUT "http://localhost:8000/api/v1/admin/users/1/profile" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "role": 2
  }'
```

### Деактивация пользователя

```bash
curl -X PUT "http://localhost:8000/api/v1/admin/users/1" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "is_active": false
  }'
```

### Получение статистики

```bash
curl -X GET "http://localhost:8000/api/v1/admin/stats" \
  -H "Authorization: Bearer <admin_token>"
```

## Безопасность

- Все эндпоинты требуют аутентификации
- Доступ разрешен только пользователям с ролью 4 (admin)
- Администратор не может удалить самого себя
- При изменении пароля он автоматически хешируется

## Учетные данные супер администратора

- **Логин:** `admin`
- **Пароль:** `admin123`
- **Email:** `admin@vetcard.com`
- **Роль:** 4 (admin)

**Важно:** После первого входа рекомендуется изменить пароль администратора!

