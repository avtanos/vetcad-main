"""
Тестовый скрипт для проверки логина
"""
import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_login(username, password):
    """Тестирует логин пользователя"""
    print(f"\n{'='*50}")
    print(f"Тестирование входа для: {username}")
    print(f"{'='*50}")
    
    try:
        # Тест 1: Логин
        login_url = f"{BASE_URL}/v1/auth/token/"
        login_data = {
            "username": username,
            "password": password
        }
        
        print(f"\n1. Отправка запроса на {login_url}")
        print(f"   Данные: {login_data}")
        
        response = requests.post(login_url, json=login_data)
        
        print(f"   Статус: {response.status_code}")
        print(f"   Ответ: {response.text[:200]}")
        
        if response.status_code != 200:
            print(f"   ❌ Ошибка логина: {response.text}")
            return False
        
        token_data = response.json()
        access_token = token_data.get("access")
        refresh_token = token_data.get("refresh")
        
        if not access_token:
            print("   ❌ Токен не получен")
            return False
        
        print(f"   ✅ Токен получен: {access_token[:50]}...")
        
        # Тест 2: Получение профиля
        profile_url = f"{BASE_URL}/v1/auth/get_profile/"
        headers = {
            "Authorization": f"Bearer {access_token}"
        }
        
        print(f"\n2. Получение профиля с {profile_url}")
        print(f"   Заголовки: Authorization: Bearer ...")
        
        profile_response = requests.get(profile_url, headers=headers)
        
        print(f"   Статус: {profile_response.status_code}")
        print(f"   Ответ: {profile_response.text[:200]}")
        
        if profile_response.status_code != 200:
            print(f"   ❌ Ошибка получения профиля: {profile_response.text}")
            return False
        
        profile = profile_response.json()
        print(f"   ✅ Профиль получен:")
        print(f"      - Username: {profile.get('username')}")
        print(f"      - Email: {profile.get('email')}")
        print(f"      - Role: {profile.get('role')}")
        
        return True
        
    except requests.exceptions.ConnectionError:
        print(f"   ❌ Не удалось подключиться к серверу")
        print(f"   Убедитесь, что бэкенд запущен: python run.py")
        return False
    except Exception as e:
        print(f"   ❌ Ошибка: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("="*50)
    print("ТЕСТИРОВАНИЕ ЛОГИНА")
    print("="*50)
    
    # Тестируем всех пользователей
    users = [
        ("petowner", "password123"),
        ("veterinarian", "password123"),
        ("partner", "password123")
    ]
    
    results = []
    for username, password in users:
        result = test_login(username, password)
        results.append((username, result))
    
    print(f"\n{'='*50}")
    print("РЕЗУЛЬТАТЫ")
    print(f"{'='*50}")
    for username, result in results:
        status = "✅ Успешно" if result else "❌ Ошибка"
        print(f"{username}: {status}")

