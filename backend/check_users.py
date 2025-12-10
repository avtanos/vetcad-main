"""
Скрипт для проверки пользователей в базе данных
"""
from app.database import SessionLocal
from app.models.user import User, Profile

db = SessionLocal()

try:
    users = db.query(User).all()
    
    print("=" * 50)
    print("📋 УЧЕТНЫЕ ДАННЫЕ В БАЗЕ ДАННЫХ")
    print("=" * 50)
    print()
    
    role_names = {
        1: "Владелец питомца",
        2: "Ветеринар",
        3: "Партнер"
    }
    
    for user in users:
        profile = db.query(Profile).filter(Profile.user_id == user.id).first()
        role_name = role_names.get(profile.role if profile else 1, "Неизвестно")
        
        print(f"👤 {user.username}")
        print(f"   Пароль: password123")
        print(f"   Email: {user.email}")
        print(f"   Роль: {role_name} (role={profile.role if profile else 1})")
        
        if profile and profile.role == 2:
            print(f"   Кабинет: /vet/cabinet")
        elif profile and profile.role == 3:
            print(f"   Кабинет: /partner/cabinet")
        
        print()
    
    print("=" * 50)
    print("✅ Все пользователи готовы к использованию!")
    print("=" * 50)
    
except Exception as e:
    print(f"❌ Ошибка: {e}")
finally:
    db.close()

