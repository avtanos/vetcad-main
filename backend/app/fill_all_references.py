"""
Скрипт для заполнения всех справочников и категорий мокап данными
"""
from app.database import SessionLocal, engine, Base
from app.models.reference import TypeOfAnimal, ProductCategory, ProductSubcategory, RefShop
from app.models.user import User
from app.core.security import get_password_hash
from datetime import datetime
import random

# Создаем таблицы
Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    print("=" * 60)
    print("Заполнение всех справочников и категорий мокап данными")
    print("=" * 60)
    
    # 1. Типы животных
    print("\n1. Заполнение типов животных...")
    animal_types = [
        {"name_ru": "Собака", "name_kg": "Ит", "is_active": True},
        {"name_ru": "Кошка", "name_kg": "Мышык", "is_active": True},
        {"name_ru": "Птица", "name_kg": "Куш", "is_active": True},
        {"name_ru": "Кролик", "name_kg": "Коён", "is_active": True},
        {"name_ru": "Хомяк", "name_kg": "Хомяк", "is_active": True},
        {"name_ru": "Морская свинка", "name_kg": "Деңиз чочко", "is_active": True},
        {"name_ru": "Хорек", "name_kg": "Хорек", "is_active": True},
        {"name_ru": "Черепаха", "name_kg": "Ташбака", "is_active": True},
        {"name_ru": "Рыбка", "name_kg": "Балык", "is_active": True},
        {"name_ru": "Ящерица", "name_kg": "Кескелдирик", "is_active": True},
        {"name_ru": "Змея", "name_kg": "Жылан", "is_active": True},
        {"name_ru": "Крыса", "name_kg": "Чычкан", "is_active": True},
        {"name_ru": "Мышь", "name_kg": "Чычкан", "is_active": True},
        {"name_ru": "Шиншилла", "name_kg": "Шиншилла", "is_active": True},
        {"name_ru": "Другое", "name_kg": "Башка", "is_active": True},
    ]
    
    animal_count = 0
    for animal_type in animal_types:
        existing = db.query(TypeOfAnimal).filter(TypeOfAnimal.name_ru == animal_type["name_ru"]).first()
        if not existing:
            db_type = TypeOfAnimal(**animal_type)
            db.add(db_type)
            animal_count += 1
    
    db.commit()
    print(f"   OK: Добавлено {animal_count} новых типов животных")
    
    # 2. Категории и подкатегории товаров
    print("\n2. Проверка категорий товаров...")
    categories_count = db.query(ProductCategory).count()
    subcategories_count = db.query(ProductSubcategory).count()
    
    if categories_count == 0 or subcategories_count == 0:
        print("   WARNING: Категории товаров не найдены. Запустите init_product_categories.py сначала.")
    else:
        print(f"   OK: Найдено {categories_count} категорий и {subcategories_count} подкатегорий")
    
    # 3. Заполнение товаров по всем категориям
    print("\n3. Заполнение товаров по всем категориям...")
    
    # Получаем все категории и подкатегории
    categories = db.query(ProductCategory).all()
    subcategories = db.query(ProductSubcategory).all()
    
    if not categories or not subcategories:
        print("   WARNING: Категории не найдены. Пропускаем заполнение товаров.")
    else:
        # Получаем пользователя-партнера для привязки товаров
        partner_user = db.query(User).join(User.profile).filter(User.profile.has(role=3)).first()
        
        if not partner_user:
            print("   WARNING: Партнер не найден. Создаем тестового партнера...")
            partner_user = User(
                username="test_partner",
                email="test_partner@vetcard.com",
                password_hash=get_password_hash("password123"),
                is_active=True
            )
            db.add(partner_user)
            db.flush()
            from app.models.user import Profile
            partner_profile = Profile(
                user_id=partner_user.id,
                first_name="Тестовый",
                last_name="Партнер",
                role=3
            )
            db.add(partner_profile)
            db.commit()
            db.refresh(partner_user)
        
        # Создаем словарь для быстрого поиска подкатегорий
        subcat_dict = {}
        for subcat in subcategories:
            key = subcat.name_ru.lower()
            if "антибиотик" in key:
                subcat_dict.setdefault("antibiotic", []).append(subcat.id)
            elif "противовоспалительн" in key:
                subcat_dict.setdefault("anti_inflammatory", []).append(subcat.id)
            elif "противопаразитарн" in key:
                subcat_dict.setdefault("antiparasitic", []).append(subcat.id)
            elif "витамин" in key:
                subcat_dict.setdefault("vitamin", []).append(subcat.id)
            elif "сух" in key or "dry" in key:
                subcat_dict.setdefault("dry_food", []).append(subcat.id)
            elif "влажн" in key or "wet" in key:
                subcat_dict.setdefault("wet_food", []).append(subcat.id)
            elif "лечебн" in key:
                subcat_dict.setdefault("therapeutic_food", []).append(subcat.id)
            elif "лакомств" in key:
                subcat_dict.setdefault("treats", []).append(subcat.id)
            elif "хирургическ" in key:
                subcat_dict.setdefault("surgical", []).append(subcat.id)
            elif "диагностическ" in key:
                subcat_dict.setdefault("diagnostic", []).append(subcat.id)
            elif "шприц" in key:
                subcat_dict.setdefault("syringe", []).append(subcat.id)
            elif "стетоскоп" in key:
                subcat_dict.setdefault("stethoscope", []).append(subcat.id)
            elif "термометр" in key:
                subcat_dict.setdefault("thermometer", []).append(subcat.id)
            elif "вес" in key:
                subcat_dict.setdefault("scale", []).append(subcat.id)
            elif "ошейник" in key or "поводок" in key:
                subcat_dict.setdefault("collar", []).append(subcat.id)
            elif "шлейк" in key:
                subcat_dict.setdefault("harness", []).append(subcat.id)
            elif "миск" in key or "поилк" in key:
                subcat_dict.setdefault("bowl", []).append(subcat.id)
            elif "лежанк" in key or "домик" in key:
                subcat_dict.setdefault("bed", []).append(subcat.id)
            elif "расческ" in key or "щетк" in key:
                subcat_dict.setdefault("brush", []).append(subcat.id)
            elif "когтерез" in key:
                subcat_dict.setdefault("nail_clipper", []).append(subcat.id)
            elif "переноск" in key:
                subcat_dict.setdefault("carrier", []).append(subcat.id)
            elif "одежд" in key:
                subcat_dict.setdefault("clothing", []).append(subcat.id)
            elif "обув" in key:
                subcat_dict.setdefault("shoes", []).append(subcat.id)
            elif "попон" in key or "жилет" in key:
                subcat_dict.setdefault("vest", []).append(subcat.id)
            elif "мяч" in key or "фрисби" in key:
                subcat_dict.setdefault("ball", []).append(subcat.id)
            elif "интерактивн" in key:
                subcat_dict.setdefault("interactive", []).append(subcat.id)
            elif "игрушк" in key and "кошк" in key:
                subcat_dict.setdefault("cat_toy", []).append(subcat.id)
            elif "игрушк" in key and "собак" in key:
                subcat_dict.setdefault("dog_toy", []).append(subcat.id)
            elif "развивающ" in key:
                subcat_dict.setdefault("puzzle", []).append(subcat.id)
            elif "шампун" in key:
                subcat_dict.setdefault("shampoo", []).append(subcat.id)
            elif "кондиционер" in key:
                subcat_dict.setdefault("conditioner", []).append(subcat.id)
            elif "ух" in key:
                subcat_dict.setdefault("ear", []).append(subcat.id)
            elif "зуб" in key:
                subcat_dict.setdefault("dental", []).append(subcat.id)
            elif "салфетк" in key:
                subcat_dict.setdefault("wipes", []).append(subcat.id)
            elif "дезинфицирующ" in key:
                subcat_dict.setdefault("disinfectant", []).append(subcat.id)
            elif "наполнитель" in key:
                subcat_dict.setdefault("litter", []).append(subcat.id)
            elif "зернов" in key:
                subcat_dict.setdefault("grain", []).append(subcat.id)
        
        # Расширенный список товаров
        products_data = [
            # Лекарства - Антибиотики
            {
                "name_ru": "Амоксициллин 250мг",
                "name_kg": "Амоксициллин 250мг",
                "description": "Антибактериальный препарат широкого спектра действия для лечения инфекций у собак и кошек.",
                "img_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
                "subcategory_id": subcat_dict.get("antibiotic", [None])[0] if subcat_dict.get("antibiotic") else None,
                "price": "850",
                "stock_quantity": 25,
                "user_id": partner_user.id
            },
            {
                "name_ru": "Цефтриаксон 1г",
                "name_kg": "Цефтриаксон 1г",
                "description": "Антибиотик цефалоспоринового ряда для лечения тяжелых инфекций.",
                "img_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
                "subcategory_id": subcat_dict.get("antibiotic", [None])[0] if subcat_dict.get("antibiotic") else None,
                "price": "1200",
                "stock_quantity": 15,
                "user_id": partner_user.id
            },
            {
                "name_ru": "Энрофлоксацин 10%",
                "name_kg": "Энрофлоксацин 10%",
                "description": "Антибактериальный препарат для лечения респираторных и кишечных инфекций.",
                "img_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
                "subcategory_id": subcat_dict.get("antibiotic", [None])[0] if subcat_dict.get("antibiotic") else None,
                "price": "950",
                "stock_quantity": 20,
                "user_id": partner_user.id
            },
            # Лекарства - Противовоспалительные
            {
                "name_ru": "Мовалис для собак",
                "name_kg": "Иттер үчүн Мовалис",
                "description": "Противовоспалительный препарат для лечения артрита и болей у собак.",
                "img_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
                "subcategory_id": subcat_dict.get("anti_inflammatory", [None])[0] if subcat_dict.get("anti_inflammatory") else None,
                "price": "1500",
                "stock_quantity": 12,
                "user_id": partner_user.id
            },
            {
                "name_ru": "Римадил 20мг",
                "name_kg": "Римадил 20мг",
                "description": "Нестероидный противовоспалительный препарат для собак.",
                "img_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
                "subcategory_id": subcat_dict.get("anti_inflammatory", [None])[0] if subcat_dict.get("anti_inflammatory") else None,
                "price": "1800",
                "stock_quantity": 10,
                "user_id": partner_user.id
            },
            # Лекарства - Противопаразитарные
            {
                "name_ru": "Адвокат для собак",
                "name_kg": "Иттер үчүн Адвокат",
                "description": "Комплексный препарат против блох, клещей и гельминтов.",
                "img_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
                "subcategory_id": subcat_dict.get("antiparasitic", [None])[0] if subcat_dict.get("antiparasitic") else None,
                "price": "2200",
                "stock_quantity": 30,
                "user_id": partner_user.id
            },
            {
                "name_ru": "Стронгхолд для кошек",
                "name_kg": "Мышыктар үчүн Стронгхолд",
                "description": "Препарат против блох, клещей и внутренних паразитов для кошек.",
                "img_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
                "subcategory_id": subcat_dict.get("antiparasitic", [None])[0] if subcat_dict.get("antiparasitic") else None,
                "price": "1900",
                "stock_quantity": 25,
                "user_id": partner_user.id
            },
            # Лекарства - Витамины
            {
                "name_ru": "Витаминный комплекс для собак",
                "name_kg": "Иттер үчүн витамин комплекси",
                "description": "Комплекс витаминов и минералов для поддержания здоровья собак всех возрастов.",
                "img_url": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
                "subcategory_id": subcat_dict.get("vitamin", [None])[0] if subcat_dict.get("vitamin") else None,
                "price": "1200",
                "stock_quantity": 18,
                "user_id": partner_user.id
            },
            {
                "name_ru": "Омега-3 для кошек",
                "name_kg": "Мышыктар үчүн Омега-3",
                "description": "Жирные кислоты Омега-3 для здоровья кожи и шерсти кошек.",
                "img_url": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
                "subcategory_id": subcat_dict.get("vitamin", [None])[0] if subcat_dict.get("vitamin") else None,
                "price": "1100",
                "stock_quantity": 22,
                "user_id": partner_user.id
            },
            # Корма - Сухие
            {
                "name_ru": "Сухой корм для собак премиум класса",
                "name_kg": "Иттер үчүн премиум классты кургак азык",
                "description": "Полнорационный сухой корм для взрослых собак всех пород. Содержит натуральное мясо, овощи и витамины.",
                "img_url": "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400",
                "subcategory_id": subcat_dict.get("dry_food", [None])[0] if subcat_dict.get("dry_food") else None,
                "price": "2500",
                "stock_quantity": 50,
                "user_id": partner_user.id
            },
            {
                "name_ru": "Сухой корм для щенков",
                "name_kg": "Кутучалар үчүн кургак азык",
                "description": "Специальный корм для щенков с повышенным содержанием белка и кальция.",
                "img_url": "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400",
                "subcategory_id": subcat_dict.get("dry_food", [None])[0] if subcat_dict.get("dry_food") else None,
                "price": "2800",
                "stock_quantity": 35,
                "user_id": partner_user.id
            },
            {
                "name_ru": "Сухой корм для кошек",
                "name_kg": "Мышыктар үчүн кургак азык",
                "description": "Сбалансированный сухой корм для взрослых кошек с курицей и рисом.",
                "img_url": "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400",
                "subcategory_id": subcat_dict.get("dry_food", [None])[0] if subcat_dict.get("dry_food") else None,
                "price": "2200",
                "stock_quantity": 40,
                "user_id": partner_user.id
            },
            # Корма - Влажные
            {
                "name_ru": "Корм для кошек с лососем",
                "name_kg": "Лосос менен мышык азыгы",
                "description": "Влажный корм для кошек с натуральным лососем. Богат омега-3 жирными кислотами.",
                "img_url": "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400",
                "subcategory_id": subcat_dict.get("wet_food", [None])[0] if subcat_dict.get("wet_food") else None,
                "price": "450",
                "stock_quantity": 30,
                "user_id": partner_user.id
            },
            {
                "name_ru": "Влажный корм для собак с говядиной",
                "name_kg": "Буйвол эти менен иттер үчүн нымдуу азык",
                "description": "Влажный корм для собак с натуральной говядиной и овощами.",
                "img_url": "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400",
                "subcategory_id": subcat_dict.get("wet_food", [None])[0] if subcat_dict.get("wet_food") else None,
                "price": "500",
                "stock_quantity": 28,
                "user_id": partner_user.id
            },
            # Корма - Лечебные
            {
                "name_ru": "Лечебный корм для почек",
                "name_kg": "Буйректер үчүн дарылоочу азык",
                "description": "Специальный корм для животных с заболеваниями почек.",
                "img_url": "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400",
                "subcategory_id": subcat_dict.get("therapeutic_food", [None])[0] if subcat_dict.get("therapeutic_food") else None,
                "price": "3200",
                "stock_quantity": 15,
                "user_id": partner_user.id
            },
            # Лакомства
            {
                "name_ru": "Лакомства для собак из говядины",
                "name_kg": "Буйвол этинен иттер үчүн таттуулар",
                "description": "Натуральные лакомства из сушеной говядины для собак.",
                "img_url": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400",
                "subcategory_id": subcat_dict.get("treats", [None])[0] if subcat_dict.get("treats") else None,
                "price": "800",
                "stock_quantity": 20,
                "user_id": partner_user.id
            },
            # Инструменты - Хирургические
            {
                "name_ru": "Хирургический скальпель",
                "name_kg": "Хирургиялык скальпель",
                "description": "Одноразовый хирургический скальпель для ветеринарных операций.",
                "img_url": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
                "subcategory_id": subcat_dict.get("surgical", [None])[0] if subcat_dict.get("surgical") else None,
                "price": "150",
                "stock_quantity": 100,
                "user_id": partner_user.id
            },
            # Инструменты - Шприцы
            {
                "name_ru": "Шприц инсулиновый 1мл",
                "name_kg": "Инсулин шприци 1мл",
                "description": "Одноразовый инсулиновый шприц для точного дозирования.",
                "img_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
                "subcategory_id": subcat_dict.get("syringe", [None])[0] if subcat_dict.get("syringe") else None,
                "price": "50",
                "stock_quantity": 200,
                "user_id": partner_user.id
            },
            {
                "name_ru": "Шприц 5мл с иглой",
                "name_kg": "Ийне менен 5мл шприц",
                "description": "Одноразовый шприц объемом 5мл с иглой.",
                "img_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
                "subcategory_id": subcat_dict.get("syringe", [None])[0] if subcat_dict.get("syringe") else None,
                "price": "80",
                "stock_quantity": 150,
                "user_id": partner_user.id
            },
            # Инструменты - Стетоскопы
            {
                "name_ru": "Ветеринарный стетоскоп",
                "name_kg": "Ветеринариялык стетоскоп",
                "description": "Профессиональный стетоскоп для прослушивания сердца и легких животных.",
                "img_url": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
                "subcategory_id": subcat_dict.get("stethoscope", [None])[0] if subcat_dict.get("stethoscope") else None,
                "price": "3500",
                "stock_quantity": 8,
                "user_id": partner_user.id
            },
            # Инструменты - Термометры
            {
                "name_ru": "Электронный термометр для животных",
                "name_kg": "Жандыктар үчүн электрондук термометр",
                "description": "Цифровой термометр с гибким наконечником для измерения температуры у животных.",
                "img_url": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
                "subcategory_id": subcat_dict.get("thermometer", [None])[0] if subcat_dict.get("thermometer") else None,
                "price": "1200",
                "stock_quantity": 12,
                "user_id": partner_user.id
            },
            # Аксессуары - Ошейники
            {
                "name_ru": "Ошейник кожаный для собак",
                "name_kg": "Иттер үчүн териден мойнунча",
                "description": "Прочный кожаный ошейник с регулируемой длиной. Подходит для собак средних и крупных пород.",
                "img_url": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400",
                "subcategory_id": subcat_dict.get("collar", [None])[0] if subcat_dict.get("collar") else None,
                "price": "950",
                "stock_quantity": 22,
                "user_id": partner_user.id
            },
            {
                "name_ru": "Ошейник с адресником",
                "name_kg": "Дарек табличкасы менен мойнунча",
                "description": "Нейлоновый ошейник с металлическим адресником для гравировки контактов.",
                "img_url": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400",
                "subcategory_id": subcat_dict.get("collar", [None])[0] if subcat_dict.get("collar") else None,
                "price": "650",
                "stock_quantity": 30,
                "user_id": partner_user.id
            },
            # Аксессуары - Миски
            {
                "name_ru": "Миска керамическая для кошек",
                "name_kg": "Мышыктар үчүн керамикалык чыны",
                "description": "Керамическая миска для корма и воды. Легко моется, не впитывает запахи.",
                "img_url": "https://images.unsplash.com/photo-1545529468-42764ef8c85f?w=400",
                "subcategory_id": subcat_dict.get("bowl", [None])[0] if subcat_dict.get("bowl") else None,
                "price": "450",
                "stock_quantity": 25,
                "user_id": partner_user.id
            },
            {
                "name_ru": "Миска нержавеющая для собак",
                "name_kg": "Иттер үчүн зыянсыз темир чыны",
                "description": "Миска из нержавеющей стали для собак. Гигиенична и долговечна.",
                "img_url": "https://images.unsplash.com/photo-1545529468-42764ef8c85f?w=400",
                "subcategory_id": subcat_dict.get("bowl", [None])[0] if subcat_dict.get("bowl") else None,
                "price": "550",
                "stock_quantity": 20,
                "user_id": partner_user.id
            },
            # Аксессуары - Расчески
            {
                "name_ru": "Расческа для длинношерстных собак",
                "name_kg": "Узун жүндүү иттер үчүн тарак",
                "description": "Профессиональная расческа с длинными зубьями для ухода за длинной шерстью.",
                "img_url": "https://images.unsplash.com/photo-1545529468-42764ef8c85f?w=400",
                "subcategory_id": subcat_dict.get("brush", [None])[0] if subcat_dict.get("brush") else None,
                "price": "750",
                "stock_quantity": 15,
                "user_id": partner_user.id
            },
            # Переноски
            {
                "name_ru": "Переноска для кошек",
                "name_kg": "Мышыктар үчүн ташуучу",
                "description": "Удобная переноска для кошек с вентиляцией. Подходит для поездок и визитов к ветеринару.",
                "img_url": "https://images.unsplash.com/photo-1545529468-42764ef8c85f?w=400",
                "subcategory_id": subcat_dict.get("carrier", [None])[0] if subcat_dict.get("carrier") else None,
                "price": "1800",
                "stock_quantity": 8,
                "user_id": partner_user.id
            },
            {
                "name_ru": "Переноска для собак",
                "name_kg": "Иттер үчүн ташуучу",
                "description": "Прочная переноска для собак средних размеров с ручками и вентиляцией.",
                "img_url": "https://images.unsplash.com/photo-1545529468-42764ef8c85f?w=400",
                "subcategory_id": subcat_dict.get("carrier", [None])[0] if subcat_dict.get("carrier") else None,
                "price": "2500",
                "stock_quantity": 6,
                "user_id": partner_user.id
            },
            # Игрушки - Мячи
            {
                "name_ru": "Игрушка для собак 'Мяч'",
                "name_kg": "Иттер үчүн оюнчук 'Топ'",
                "description": "Прочная резиновая игрушка для активных игр с собакой. Безопасна для зубов.",
                "img_url": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400",
                "subcategory_id": subcat_dict.get("ball", [None])[0] if subcat_dict.get("ball") else None,
                "price": "350",
                "stock_quantity": 15,
                "user_id": partner_user.id
            },
            {
                "name_ru": "Фрисби для собак",
                "name_kg": "Иттер үчүн фрисби",
                "description": "Легкий и прочный фрисби для активных игр на свежем воздухе.",
                "img_url": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400",
                "subcategory_id": subcat_dict.get("ball", [None])[0] if subcat_dict.get("ball") else None,
                "price": "450",
                "stock_quantity": 12,
                "user_id": partner_user.id
            },
            # Игрушки для кошек
            {
                "name_ru": "Игрушка-удочка для кошек",
                "name_kg": "Мышыктар үчүн оюнчук-кайык",
                "description": "Интерактивная игрушка-удочка с перьями для активных игр с кошкой.",
                "img_url": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400",
                "subcategory_id": subcat_dict.get("cat_toy", [None])[0] if subcat_dict.get("cat_toy") else None,
                "price": "550",
                "stock_quantity": 18,
                "user_id": partner_user.id
            },
            # Гигиена - Шампуни
            {
                "name_ru": "Шампунь для собак с дегтем",
                "name_kg": "Дегот менен иттер үчүн шампунь",
                "description": "Лечебный шампунь для собак с дегтем. Помогает при кожных проблемах и блохах.",
                "img_url": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400",
                "subcategory_id": subcat_dict.get("shampoo", [None])[0] if subcat_dict.get("shampoo") else None,
                "price": "650",
                "stock_quantity": 12,
                "user_id": partner_user.id
            },
            {
                "name_ru": "Шампунь для кошек гипоаллергенный",
                "name_kg": "Мышыктар үчүн гипоаллергендик шампунь",
                "description": "Мягкий гипоаллергенный шампунь для кошек с чувствительной кожей.",
                "img_url": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400",
                "subcategory_id": subcat_dict.get("shampoo", [None])[0] if subcat_dict.get("shampoo") else None,
                "price": "600",
                "stock_quantity": 15,
                "user_id": partner_user.id
            },
            # Гигиена - Наполнители
            {
                "name_ru": "Наполнитель для кошачьего туалета",
                "name_kg": "Мышык туалети үчүн толтуруучу",
                "description": "Древесный наполнитель с отличной впитываемостью и нейтрализацией запахов.",
                "img_url": "https://images.unsplash.com/photo-1545529468-42764ef8c85f?w=400",
                "subcategory_id": subcat_dict.get("litter", [None])[0] if subcat_dict.get("litter") else None,
                "price": "800",
                "stock_quantity": 40,
                "user_id": partner_user.id
            },
            {
                "name_ru": "Наполнитель силикагелевый",
                "name_kg": "Силикагел толтуруучу",
                "description": "Силикагелевый наполнитель с максимальной впитываемостью.",
                "img_url": "https://images.unsplash.com/photo-1545529468-42764ef8c85f?w=400",
                "subcategory_id": subcat_dict.get("litter", [None])[0] if subcat_dict.get("litter") else None,
                "price": "1200",
                "stock_quantity": 25,
                "user_id": partner_user.id
            },
            # Корма для птиц
            {
                "name_ru": "Корм для птиц 'Зерновая смесь'",
                "name_kg": "Куштар үчүн 'Дан аралашмасы'",
                "description": "Сбалансированная зерновая смесь для попугаев и других декоративных птиц.",
                "img_url": "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=400",
                "subcategory_id": subcat_dict.get("grain", [None])[0] if subcat_dict.get("grain") else None,
                "price": "300",
                "stock_quantity": 20,
                "user_id": partner_user.id
            },
        ]
        
        # Проверяем существующие товары
        existing_products = db.query(RefShop).count()
        print(f"   INFO: Найдено существующих товаров: {existing_products}")
        
        # Добавляем только новые товары
        new_products_count = 0
        for product_data in products_data:
            # Проверяем, существует ли уже такой товар
            existing = db.query(RefShop).filter(
                RefShop.name_ru == product_data["name_ru"]
            ).first()
            
            if not existing:
                product = RefShop(**product_data, is_active=True)
                db.add(product)
                new_products_count += 1
        
        db.commit()
        print(f"   OK: Добавлено {new_products_count} новых товаров")
        print(f"   INFO: Всего товаров в базе: {db.query(RefShop).count()}")
    
    print("\n" + "=" * 60)
    print("OK: Все справочники и категории заполнены мокап данными!")
    print("=" * 60)
    
except Exception as e:
    print(f"\nERROR: Ошибка при заполнении справочников: {e}")
    import traceback
    traceback.print_exc()
    db.rollback()
finally:
    db.close()

