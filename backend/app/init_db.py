"""
Скрипт для инициализации базы данных с начальными данными
"""
from app.database import SessionLocal, engine, Base
from app.models.reference import TypeOfAnimal
from app.models.article import Article
from app.core.security import get_password_hash
from app.models.user import User, Profile

# Создаем таблицы
Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # Добавляем типы животных
    animal_types = [
        {"name_ru": "Собака", "name_kg": "Ит"},
        {"name_ru": "Кошка", "name_kg": "Мышык"},
        {"name_ru": "Птица", "name_kg": "Куш"},
        {"name_ru": "Кролик", "name_kg": "Коён"},
        {"name_ru": "Хомяк", "name_kg": "Хомяк"},
        {"name_ru": "Морская свинка", "name_kg": "Деңиз чочко"},
        {"name_ru": "Хорек", "name_kg": "Хорек"},
        {"name_ru": "Черепаха", "name_kg": "Ташбака"},
        {"name_ru": "Рыбка", "name_kg": "Балык"},
        {"name_ru": "Другое", "name_kg": "Башка"},
    ]
    
    for animal_type in animal_types:
        existing = db.query(TypeOfAnimal).filter(TypeOfAnimal.name_ru == animal_type["name_ru"]).first()
        if not existing:
            db_type = TypeOfAnimal(**animal_type, is_active=True)
            db.add(db_type)
    
    # Добавляем примеры статей
    articles = [
        {
            "title": "Уход за собакой в зимний период",
            "excerpt": "Зима - особое время для наших питомцев. Узнайте, как правильно ухаживать за собакой в холодное время года.",
            "category": "Уход",
            "author_name": "Доктор Иванов",
            "source_url": "https://example.com/article1"
        },
        {
            "title": "Правильное питание кошек",
            "excerpt": "Сбалансированное питание - основа здоровья вашей кошки. Читайте о правильном рационе для домашних кошек.",
            "category": "Питание",
            "author_name": "Ветеринар Петрова",
            "source_url": "https://example.com/article2"
        },
    ]
    
    for article in articles:
        existing = db.query(Article).filter(Article.title == article["title"]).first()
        if not existing:
            db_article = Article(**article)
            db.add(db_article)
    
    db.commit()
    print("База данных успешно инициализирована!")
    
except Exception as e:
    print(f"Ошибка при инициализации: {e}")
    db.rollback()
finally:
    db.close()

