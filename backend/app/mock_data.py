"""
Скрипт для создания мокап данных для тестирования
"""
from app.database import SessionLocal
from app.models.user import User, Profile
from app.models.pet import Pet
from app.models.reference import TypeOfAnimal, RefShop, ProductCategory, ProductSubcategory
from app.models.article import Article
from app.models.reminder import Reminder
from app.models.vet_cabinet import VetAppointment, VetConsultation, VetArticle
from app.core.security import get_password_hash
from datetime import date, timedelta, datetime
import random

db = SessionLocal()

try:
    print("Создание мокап данных...")
    
    # Очистка существующих данных (опционально)
    print("\n1. Очистка старых данных...")
    db.query(VetArticle).delete()
    db.query(VetConsultation).delete()
    db.query(VetAppointment).delete()
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
        print("WARNING: Типы животных не найдены. Запустите init_db.py сначала.")
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
    
    # Создаем ветеринаров
    veterinarians_data = [
        {
            "username": "veterinarian",
            "email": "vet@vetcard.com",
            "first_name": "Мария",
            "last_name": "Иванова",
            "third_name": "Александровна",
            "phone": "+996 (555) 234-56-78",
            "city": "Бишкек",
            "address": "ул. Ленина, д. 45",
            "clinic": "Ветеринарная клиника 'Здоровье'",
            "position": "Главный ветеринар",
            "specialization": "Мелкие животные",
            "experience": "10 лет",
            "license_number": "VET-KG-2024-001",
            "description": "Опытный ветеринар с многолетним стажем работы. Специализация на лечении собак и кошек."
        },
        {
            "username": "vet2",
            "email": "vet2@vetcard.com",
            "first_name": "Алексей",
            "last_name": "Смирнов",
            "third_name": "Владимирович",
            "phone": "+996 (555) 345-67-89",
            "city": "Бишкек",
            "address": "ул. Чуй, д. 120",
            "clinic": "Ветеринарный центр 'Доктор Айболит'",
            "position": "Ветеринар-хирург",
            "specialization": "Хирургия, экзотические животные",
            "experience": "8 лет",
            "license_number": "VET-KG-2024-002",
            "description": "Специалист по хирургическим операциям и лечению экзотических животных."
        },
        {
            "username": "vet3",
            "email": "vet3@vetcard.com",
            "first_name": "Елена",
            "last_name": "Козлова",
            "third_name": "Петровна",
            "phone": "+996 (555) 456-78-90",
            "city": "Бишкек",
            "address": "ул. Советская, д. 56",
            "clinic": "Клиника 'ВетМед'",
            "position": "Ветеринар-терапевт",
            "specialization": "Терапия, диагностика",
            "experience": "12 лет",
            "license_number": "VET-KG-2024-003",
            "description": "Ветеринар-терапевт с большим опытом диагностики и лечения различных заболеваний."
        },
        {
            "username": "vet4",
            "email": "vet4@vetcard.com",
            "first_name": "Дмитрий",
            "last_name": "Новиков",
            "third_name": "Игоревич",
            "phone": "+996 (555) 567-89-01",
            "city": "Ош",
            "address": "ул. Ленина, д. 34",
            "clinic": "Ветеринарная клиника 'Питомец'",
            "position": "Ветеринар",
            "specialization": "Мелкие и крупные животные",
            "experience": "15 лет",
            "license_number": "VET-KG-2024-004",
            "description": "Опытный ветеринар, работающий с мелкими и крупными животными."
        }
    ]
    
    vet_users = []
    for vet_data in veterinarians_data:
        vet_user = User(
            username=vet_data["username"],
            email=vet_data["email"],
            password_hash=get_password_hash("password123"),
            is_active=True
        )
        db.add(vet_user)
        db.flush()
        
        vet_profile = Profile(
            user_id=vet_user.id,
            first_name=vet_data["first_name"],
            last_name=vet_data["last_name"],
            third_name=vet_data["third_name"],
            phone=vet_data["phone"],
            city=vet_data["city"],
            address=vet_data["address"],
            role=2,  # veterinarian
            clinic=vet_data["clinic"],
            position=vet_data["position"],
            specialization=vet_data["specialization"],
            experience=vet_data["experience"],
            license_number=vet_data["license_number"],
            description=vet_data["description"]
        )
        db.add(vet_profile)
        vet_users.append(vet_user)
    
    # Сохраняем первого ветеринара для использования в других данных
    vet_user = vet_users[0]
    
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
    
    # Создаем супер админа
    admin_user = User(
        username="admin",
        email="admin@vetcard.com",
        password_hash=get_password_hash("admin123"),
        is_active=True
    )
    db.add(admin_user)
    db.flush()
    
    admin_profile = Profile(
        user_id=admin_user.id,
        first_name="Администратор",
        last_name="Системы",
        third_name="",
        phone="+996 (555) 000-00-00",
        city="Бишкек",
        address="Административный офис",
        role=4  # admin
    )
    db.add(admin_profile)
    
    db.commit()
    print(f"   OK: Создано {4 + len(veterinarians_data) - 1} пользователей:")
    print(f"      - petowner (владелец питомца)")
    print(f"      - {len(veterinarians_data)} ветеринаров")
    print(f"      - partner (партнер)")
    print(f"      - admin (супер администратор)")
    
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
    print(f"   OK: Создано {len(pets_data)} питомца для владельца")
    
    print("\n4. Создание товаров с категориями...")
    
    # Получаем категории и подкатегории
    categories = db.query(ProductCategory).all()
    subcategories = db.query(ProductSubcategory).all()
    
    if not categories or not subcategories:
        print("   WARNING: Категории не найдены. Запустите init_product_categories.py сначала.")
    else:
        # Создаем словарь для быстрого поиска подкатегорий по названию
        subcat_dict = {}
        for subcat in subcategories:
            key = subcat.name_ru.lower()
            if "антибиотик" in key:
                subcat_dict["antibiotic"] = subcat.id
            elif "сух" in key or "dry" in key:
                subcat_dict["dry_food"] = subcat.id
            elif "влажн" in key or "wet" in key:
                subcat_dict["wet_food"] = subcat.id
            elif "мяч" in key or "ball" in key:
                subcat_dict["ball"] = subcat.id
            elif "наполнитель" in key:
                subcat_dict["litter"] = subcat.id
            elif "зернов" in key:
                subcat_dict["grain"] = subcat.id
            elif "витамин" in key:
                subcat_dict["vitamin"] = subcat.id
            elif "шампун" in key:
                subcat_dict["shampoo"] = subcat.id
            elif "ошейник" in key:
                subcat_dict["collar"] = subcat.id
            elif "переноск" in key:
                subcat_dict["carrier"] = subcat.id
        
        products_data = [
            {
                "name_ru": "Амоксициллин 250мг",
                "name_kg": "Амоксициллин 250мг",
                "is_active": True,
                "img_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
                "description": "Антибактериальный препарат широкого спектра действия для лечения инфекций у собак и кошек.",
                "user_id": partner_user.id,
                "subcategory_id": subcat_dict.get("antibiotic"),
                "price": "850",
                "stock_quantity": 25
            },
            {
                "name_ru": "Сухой корм для собак премиум класса",
                "name_kg": "Иттер үчүн премиум классты кургак азык",
                "is_active": True,
                "img_url": "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400",
                "description": "Полнорационный сухой корм для взрослых собак всех пород. Содержит натуральное мясо, овощи и витамины.",
                "user_id": partner_user.id,
                "subcategory_id": subcat_dict.get("dry_food"),
                "price": "2500",
                "stock_quantity": 50
            },
            {
                "name_ru": "Корм для кошек с лососем",
                "name_kg": "Лосос менен мышык азыгы",
                "is_active": True,
                "img_url": "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400",
                "description": "Влажный корм для кошек с натуральным лососем. Богат омега-3 жирными кислотами.",
                "user_id": partner_user.id,
                "subcategory_id": subcat_dict.get("wet_food"),
                "price": "450",
                "stock_quantity": 30
            },
            {
                "name_ru": "Игрушка для собак 'Мяч'",
                "name_kg": "Иттер үчүн оюнчук 'Топ'",
                "is_active": True,
                "img_url": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400",
                "description": "Прочная резиновая игрушка для активных игр с собакой. Безопасна для зубов.",
                "user_id": partner_user.id,
                "subcategory_id": subcat_dict.get("ball"),
                "price": "350",
                "stock_quantity": 15
            },
            {
                "name_ru": "Наполнитель для кошачьего туалета",
                "name_kg": "Мышык туалети үчүн толтуруучу",
                "is_active": True,
                "img_url": "https://images.unsplash.com/photo-1545529468-42764ef8c85f?w=400",
                "description": "Древесный наполнитель с отличной впитываемостью и нейтрализацией запахов.",
                "user_id": partner_user.id,
                "subcategory_id": subcat_dict.get("litter"),
                "price": "800",
                "stock_quantity": 40
            },
            {
                "name_ru": "Корм для птиц 'Зерновая смесь'",
                "name_kg": "Куштар үчүн 'Дан аралашмасы'",
                "is_active": True,
                "img_url": "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=400",
                "description": "Сбалансированная зерновая смесь для попугаев и других декоративных птиц.",
                "user_id": partner_user.id,
                "subcategory_id": subcat_dict.get("grain"),
                "price": "300",
                "stock_quantity": 20
            },
            {
                "name_ru": "Витаминный комплекс для собак",
                "name_kg": "Иттер үчүн витамин комплекси",
                "is_active": True,
                "img_url": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
                "description": "Комплекс витаминов и минералов для поддержания здоровья собак всех возрастов.",
                "user_id": partner_user.id,
                "subcategory_id": subcat_dict.get("vitamin"),
                "price": "1200",
                "stock_quantity": 18
            },
            {
                "name_ru": "Шампунь для собак с дегтем",
                "name_kg": "Дегот менен иттер үчүн шампунь",
                "is_active": True,
                "img_url": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400",
                "description": "Лечебный шампунь для собак с дегтем. Помогает при кожных проблемах и блохах.",
                "user_id": partner_user.id,
                "subcategory_id": subcat_dict.get("shampoo"),
                "price": "650",
                "stock_quantity": 12
            },
            {
                "name_ru": "Ошейник кожаный для собак",
                "name_kg": "Иттер үчүн териден мойнунча",
                "is_active": True,
                "img_url": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400",
                "description": "Прочный кожаный ошейник с регулируемой длиной. Подходит для собак средних и крупных пород.",
                "user_id": partner_user.id,
                "subcategory_id": subcat_dict.get("collar"),
                "price": "950",
                "stock_quantity": 22
            },
            {
                "name_ru": "Переноска для кошек",
                "name_kg": "Мышыктар үчүн ташуучу",
                "is_active": True,
                "img_url": "https://images.unsplash.com/photo-1545529468-42764ef8c85f?w=400",
                "description": "Удобная переноска для кошек с вентиляцией. Подходит для поездок и визитов к ветеринару.",
                "user_id": partner_user.id,
                "subcategory_id": subcat_dict.get("carrier"),
                "price": "1800",
                "stock_quantity": 8
            }
        ]
        
        for product_data in products_data:
            product = RefShop(**product_data)
            db.add(product)
        
        db.commit()
        print(f"   OK: Создано {len(products_data)} товаров с категориями")
    
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
    print(f"   OK: Создано {len(articles_data)} статей")
    
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
    print(f"   OK: Создано {len(reminders_data)} напоминаний")
    
    print("\n7. Создание данных для кабинета ветеринара...")
    
    # Получаем питомцев владельца
    owner_pets = db.query(Pet).filter(Pet.user_id == owner_user.id).all()
    if owner_pets and vet_user:
        # Создаем записи к ветеринару
        appointments_data = [
            {
                "vet_id": vet_user.id,
                "pet_owner_id": owner_user.id,
                "pet_id": owner_pets[0].id if owner_pets else None,
                "appointment_date": datetime.now() + timedelta(days=3),
                "reason": "Плановый осмотр",
                "status": "confirmed",
                "notes": None
            },
            {
                "vet_id": vet_user.id,
                "pet_owner_id": owner_user.id,
                "pet_id": owner_pets[0].id if owner_pets else None,
                "appointment_date": datetime.now() + timedelta(days=7),
                "reason": "Вакцинация",
                "status": "pending",
                "notes": None
            },
            {
                "vet_id": vet_user.id,
                "pet_owner_id": owner_user.id,
                "pet_id": owner_pets[1].id if len(owner_pets) > 1 else owner_pets[0].id,
                "appointment_date": datetime.now() - timedelta(days=2),
                "reason": "Консультация по питанию",
                "status": "completed",
                "notes": "Рекомендовано перейти на специальный корм"
            }
        ]
        
        for app_data in appointments_data:
            if app_data["pet_id"]:
                appointment = VetAppointment(**app_data)
                db.add(appointment)
        
        # Создаем консультации
        consultations_data = [
            {
                "vet_id": vet_user.id,
                "pet_owner_id": owner_user.id,
                "pet_id": owner_pets[0].id if owner_pets else None,
                "question": "Мой питомец стал вялым и плохо ест. Что делать?",
                "answer": "Рекомендую записаться на осмотр. Возможно, это признаки заболевания. До визита обеспечьте покой и доступ к воде.",
                "status": "answered",
                "answered_at": datetime.now() - timedelta(hours=5)
            },
            {
                "vet_id": vet_user.id,
                "pet_owner_id": owner_user.id,
                "pet_id": owner_pets[1].id if len(owner_pets) > 1 else owner_pets[0].id,
                "question": "Как часто нужно делать прививки собаке?",
                "answer": None,
                "status": "pending",
                "answered_at": None
            },
            {
                "vet_id": vet_user.id,
                "pet_owner_id": owner_user.id,
                "pet_id": owner_pets[0].id if owner_pets else None,
                "question": "Можно ли давать кошке молоко?",
                "answer": "Взрослым кошкам молоко не рекомендуется, так как у многих развивается непереносимость лактозы. Лучше использовать специальные молочные продукты для кошек.",
                "status": "answered",
                "answered_at": datetime.now() - timedelta(days=1)
            }
        ]
        
        for cons_data in consultations_data:
            if cons_data["pet_id"]:
                consultation = VetConsultation(**cons_data)
                db.add(consultation)
        
        # Создаем статьи ветеринара
        vet_articles_data = [
            {
                "vet_id": vet_user.id,
                "title": "Как правильно ухаживать за собакой в зимний период",
                "content": "Зима - особое время для наших питомцев. Важно обеспечить правильный уход...",
                "excerpt": "Советы по уходу за собакой в холодное время года",
                "image_url": "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=800",
                "category": "Уход",
                "is_published": True,
                "views_count": 125,
                "published_at": datetime.now() - timedelta(days=5)
            },
            {
                "vet_id": vet_user.id,
                "title": "Признаки заболеваний у кошек",
                "content": "Владельцы кошек должны знать основные признаки заболеваний...",
                "excerpt": "На что обратить внимание, чтобы вовремя заметить болезнь",
                "image_url": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800",
                "category": "Здоровье",
                "is_published": True,
                "views_count": 89,
                "published_at": datetime.now() - timedelta(days=10)
            },
            {
                "vet_id": vet_user.id,
                "title": "Правильное питание для щенков",
                "content": "Питание щенков требует особого внимания...",
                "excerpt": "Рекомендации по кормлению щенков",
                "image_url": None,
                "category": "Питание",
                "is_published": False,
                "views_count": 0,
                "published_at": None
            }
        ]
        
        for art_data in vet_articles_data:
            article = VetArticle(**art_data)
            db.add(article)
        
        db.commit()
        print(f"   OK: Создано {len([a for a in appointments_data if a['pet_id']])} записей")
        print(f"   OK: Создано {len([c for c in consultations_data if c['pet_id']])} консультаций")
        print(f"   OK: Создано {len(vet_articles_data)} статей")
    
    print("\n" + "=" * 50)
    print("OK: МОКАП ДАННЫЕ УСПЕШНО СОЗДАНЫ!")
    print("=" * 50)
    print("\nINFO: Созданные данные:")
    print(f"   • Пользователи: {4 + len(veterinarians_data) - 1}")
    print(f"      - petowner / password123 (владелец)")
    print(f"      - {len(veterinarians_data)} ветеринаров (veterinarian, vet2, vet3, vet4)")
    print(f"      - partner / password123 (партнер)")
    print(f"      - admin / admin123 (супер администратор)")
    print(f"   • Питомцы: {len(pets_data)}")
    print(f"   • Товары: {len(products_data)}")
    print(f"   • Статьи: {len(articles_data)}")
    print(f"   • Напоминания: {len(reminders_data)}")
    print("\nINFO: Теперь вы можете войти в систему с любым из созданных пользователей!")
    
except Exception as e:
    print(f"\nERROR: Ошибка при создании мокап данных: {e}")
    import traceback
    traceback.print_exc()
    db.rollback()
finally:
    db.close()

