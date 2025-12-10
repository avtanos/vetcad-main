"""
Скрипт для создания мокап данных для тестирования
"""
from app.database import SessionLocal
from app.models.user import User, Profile
from app.models.pet import Pet
from app.models.reference import TypeOfAnimal, RefShop
from app.models.article import Article
from app.models.reminder import Reminder
from app.core.security import get_password_hash
from datetime import date, timedelta
import random

db = SessionLocal()

try:
    print("🔄 Создание мокап данных...")
    
    # Очистка существующих данных (опционально)
    print("\n1. Очистка старых данных...")
    db.query(Reminder).delete()
    db.query(Pet).delete()
    db.query(RefShop).delete()
    db.query(Article).delete()
    db.query(Profile).delete()
    db.query(User).delete()
    db.commit()
    
    # Получаем типы животных
    species_types = db.query(TypeOfAnimal).all()
    if not species_types:
        print("⚠️  Типы животных не найдены. Запустите init_db.py сначала.")
        db.close()
        exit(1)
    
    species_dict = {st.id: st.name_ru for st in species_types}
    
    print("\n2. Создание пользователей...")
    
    # Создаем владельца питомца
    owner_user = User(
        username="petowner",
        email="owner@vetcard.com",
        password_hash=get_password_hash("password123"),
        is_active=True
    )
    db.add(owner_user)
    db.flush()
    
    owner_profile = Profile(
        user_id=owner_user.id,
        first_name="Иван",
        last_name="Петров",
        third_name="Сергеевич",
        phone="+996 (555) 123-45-67",
        city="Бишкек",
        address="ул. Чуй, д. 123",
        role=1  # petOwner
    )
    db.add(owner_profile)
    
    # Создаем ветеринара
    vet_user = User(
        username="veterinarian",
        email="vet@vetcard.com",
        password_hash=get_password_hash("password123"),
        is_active=True
    )
    db.add(vet_user)
    db.flush()
    
    vet_profile = Profile(
        user_id=vet_user.id,
        first_name="Мария",
        last_name="Иванова",
        third_name="Александровна",
        phone="+996 (555) 234-56-78",
        city="Бишкек",
        address="ул. Ленина, д. 45",
        role=2,  # veterinarian
        clinic="Ветеринарная клиника 'Здоровье'",
        position="Главный ветеринар",
        specialization="Мелкие животные",
        experience="10 лет",
        license_number="VET-KG-2024-001"
    )
    db.add(vet_profile)
    
    # Создаем партнера
    partner_user = User(
        username="partner",
        email="partner@vetcard.com",
        password_hash=get_password_hash("password123"),
        is_active=True
    )
    db.add(partner_user)
    db.flush()
    
    partner_profile = Profile(
        user_id=partner_user.id,
        first_name="ООО",
        last_name="ЗооМаркет",
        city="Бишкек",
        address="ул. Советская, д. 78",
        role=3,  # partner
        name_of_organization="ЗооМаркет",
        type="Зоомагазин",
        phone="+996 (555) 345-67-89",
        website="https://zoomarket.kg",
        description="Крупнейший зоомагазин в Бишкеке. Полный ассортимент кормов, игрушек и аксессуаров для животных."
    )
    db.add(partner_profile)
    
    db.commit()
    print(f"   ✅ Создано 3 пользователя:")
    print(f"      - petowner (владелец питомца)")
    print(f"      - veterinarian (ветеринар)")
    print(f"      - partner (партнер)")
    
    print("\n3. Создание питомцев...")
    
    # Питомцы для владельца
    pets_data = [
        {
            "name": "Рекс",
            "species": next((st.id for st in species_types if "собака" in st.name_ru.lower() or "dog" in st.name_ru.lower()), species_types[0].id),
            "breed": "Немецкая овчарка",
            "birth_date": date(2020, 1, 15),
            "weight": 32.5,
            "image_url": "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400",
            "special_notes": "Активный, любит играть на улице. Аллергия на курицу."
        },
        {
            "name": "Мурка",
            "species": next((st.id for st in species_types if "кошка" in st.name_ru.lower() or "cat" in st.name_ru.lower()), species_types[1].id if len(species_types) > 1 else species_types[0].id),
            "breed": "Британская короткошерстная",
            "birth_date": date(2021, 5, 20),
            "weight": 4.2,
            "image_url": "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400",
            "special_notes": "Спокойная, любит спать. Нужен специальный корм для чувствительного желудка."
        },
        {
            "name": "Чарли",
            "species": next((st.id for st in species_types if "птица" in st.name_ru.lower() or "bird" in st.name_ru.lower()), species_types[2].id if len(species_types) > 2 else species_types[0].id),
            "breed": "Волнистый попугай",
            "birth_date": date(2022, 3, 10),
            "weight": 0.05,
            "image_url": "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=400",
            "special_notes": "Очень общительный, любит петь."
        }
    ]
    
    for pet_data in pets_data:
        pet = Pet(
            user_id=owner_user.id,
            **pet_data
        )
        db.add(pet)
    
    db.commit()
    print(f"   ✅ Создано {len(pets_data)} питомца для владельца")
    
    print("\n4. Создание товаров...")
    
    products_data = [
        {
            "name_ru": "Сухой корм для собак премиум класса",
            "name_kg": "Иттер үчүн премиум классты кургак азык",
            "is_active": True,
            "img_url": "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400",
            "description": "Полнорационный сухой корм для взрослых собак всех пород. Содержит натуральное мясо, овощи и витамины.",
            "user_id": partner_user.id
        },
        {
            "name_ru": "Корм для кошек с лососем",
            "name_kg": "Лосос менен мышык азыгы",
            "is_active": True,
            "img_url": "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400",
            "description": "Влажный корм для кошек с натуральным лососем. Богат омега-3 жирными кислотами.",
            "user_id": partner_user.id
        },
        {
            "name_ru": "Игрушка для собак 'Мяч'",
            "name_kg": "Иттер үчүн оюнчук 'Топ'",
            "is_active": True,
            "img_url": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400",
            "description": "Прочная резиновая игрушка для активных игр с собакой. Безопасна для зубов.",
            "user_id": partner_user.id
        },
        {
            "name_ru": "Наполнитель для кошачьего туалета",
            "name_kg": "Мышык туалети үчүн толтуруучу",
            "is_active": True,
            "img_url": "https://images.unsplash.com/photo-1545529468-42764ef8c85f?w=400",
            "description": "Древесный наполнитель с отличной впитываемостью и нейтрализацией запахов.",
            "user_id": partner_user.id
        },
        {
            "name_ru": "Корм для птиц 'Зерновая смесь'",
            "name_kg": "Куштар үчүн 'Дан аралашмасы'",
            "is_active": True,
            "img_url": "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=400",
            "description": "Сбалансированная зерновая смесь для попугаев и других декоративных птиц.",
            "user_id": None  # Общий товар
        }
    ]
    
    for product_data in products_data:
        product = RefShop(**product_data)
        db.add(product)
    
    db.commit()
    print(f"   ✅ Создано {len(products_data)} товаров")
    
    print("\n5. Создание статей...")
    
    articles_data = [
        {
            "title": "Уход за собакой в зимний период",
            "excerpt": "Зима - особое время для наших питомцев. Узнайте, как правильно ухаживать за собакой в холодное время года, защитить лапы от реагентов и обеспечить комфорт в морозную погоду.",
            "image_url": "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800",
            "category": "Уход",
            "published_date": date.today() - timedelta(days=5),
            "author_name": "Доктор Иванов",
            "author_avatar_url": "https://randomuser.me/api/portraits/men/1.jpg",
            "source_url": "https://example.com/article1",
            "content": "Полная статья о зимнем уходе за собаками..."
        },
        {
            "title": "Правильное питание кошек",
            "excerpt": "Сбалансированное питание - основа здоровья вашей кошки. Читайте о правильном рационе для домашних кошек, режиме кормления и выборе качественного корма.",
            "image_url": "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800",
            "category": "Питание",
            "published_date": date.today() - timedelta(days=10),
            "author_name": "Ветеринар Петрова",
            "author_avatar_url": "https://randomuser.me/api/portraits/women/2.jpg",
            "source_url": "https://example.com/article2",
            "content": "Полная статья о питании кошек..."
        },
        {
            "title": "График прививок для щенков",
            "excerpt": "Вакцинация - важнейшая часть заботы о здоровье щенка. Узнайте о графике прививок, необходимых вакцинах и подготовке к процедуре.",
            "image_url": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800",
            "category": "Здоровье",
            "published_date": date.today() - timedelta(days=15),
            "author_name": "Доктор Сидоров",
            "author_avatar_url": "https://randomuser.me/api/portraits/men/3.jpg",
            "source_url": "https://example.com/article3",
            "content": "Полная статья о прививках для щенков..."
        },
        {
            "title": "Признаки здорового питомца",
            "excerpt": "Как понять, что ваш питомец здоров? Узнайте о ключевых признаках здоровья у собак и кошек, на что обращать внимание и когда стоит обратиться к ветеринару.",
            "image_url": "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800",
            "category": "Здоровье",
            "published_date": date.today() - timedelta(days=20),
            "author_name": "Ветеринар Козлова",
            "author_avatar_url": "https://randomuser.me/api/portraits/women/4.jpg",
            "source_url": "https://example.com/article4",
            "content": "Полная статья о признаках здоровья..."
        },
        {
            "title": "Поведение кошек: что это значит?",
            "excerpt": "Понимание поведения кошек поможет лучше заботиться о вашем питомце. Разбираемся в языке тела, звуках и привычках наших пушистых друзей.",
            "image_url": "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800",
            "category": "Поведение",
            "published_date": date.today() - timedelta(days=25),
            "author_name": "Зоопсихолог Новикова",
            "author_avatar_url": "https://randomuser.me/api/portraits/women/5.jpg",
            "source_url": "https://example.com/article5",
            "content": "Полная статья о поведении кошек..."
        }
    ]
    
    for article_data in articles_data:
        article = Article(**article_data)
        db.add(article)
    
    db.commit()
    print(f"   ✅ Создано {len(articles_data)} статей")
    
    print("\n6. Создание напоминаний...")
    
    # Получаем созданных питомцев
    owner_pets = db.query(Pet).filter(Pet.user_id == owner_user.id).all()
    
    reminders_data = [
        {
            "user_id": owner_user.id,
            "animal_name": owner_pets[0].name if owner_pets else "Рекс",
            "assistant_sms": "Плановый осмотр у ветеринара",
            "date_assistant": date.today() + timedelta(days=7),
            "status": True
        },
        {
            "user_id": owner_user.id,
            "animal_name": owner_pets[0].name if owner_pets else "Рекс",
            "assistant_sms": "Ревакцинация",
            "date_assistant": date.today() + timedelta(days=14),
            "status": True
        },
        {
            "user_id": owner_user.id,
            "animal_name": owner_pets[1].name if len(owner_pets) > 1 else "Мурка",
            "assistant_sms": "Дегельминтизация",
            "date_assistant": date.today() + timedelta(days=3),
            "status": True
        },
        {
            "user_id": owner_user.id,
            "animal_name": owner_pets[0].name if owner_pets else "Рекс",
            "assistant_sms": "Купить корм",
            "date_assistant": date.today() + timedelta(days=1),
            "status": True
        },
        {
            "user_id": owner_user.id,
            "animal_name": owner_pets[1].name if len(owner_pets) > 1 else "Мурка",
            "assistant_sms": "Плановый осмотр",
            "date_assistant": date.today() - timedelta(days=2),
            "status": False  # Выполнено
        }
    ]
    
    for reminder_data in reminders_data:
        reminder = Reminder(**reminder_data)
        db.add(reminder)
    
    db.commit()
    print(f"   ✅ Создано {len(reminders_data)} напоминаний")
    
    print("\n" + "=" * 50)
    print("✅ МОКАП ДАННЫЕ УСПЕШНО СОЗДАНЫ!")
    print("=" * 50)
    print("\n📋 Созданные данные:")
    print(f"   • Пользователи: 3")
    print(f"      - petowner / password123 (владелец)")
    print(f"      - veterinarian / password123 (ветеринар)")
    print(f"      - partner / password123 (партнер)")
    print(f"   • Питомцы: {len(pets_data)}")
    print(f"   • Товары: {len(products_data)}")
    print(f"   • Статьи: {len(articles_data)}")
    print(f"   • Напоминания: {len(reminders_data)}")
    print("\n💡 Теперь вы можете войти в систему с любым из созданных пользователей!")
    
except Exception as e:
    print(f"\n❌ Ошибка при создании мокап данных: {e}")
    import traceback
    traceback.print_exc()
    db.rollback()
finally:
    db.close()

