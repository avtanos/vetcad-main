"""
Инициализация категорий и подкатегорий товаров для ветеринарии
"""
from app.database import SessionLocal, engine, Base
from app.models.reference import ProductCategory, ProductSubcategory

def init_product_categories():
    """Создание категорий и подкатегорий товаров"""
    # Создаем таблицы, если их еще нет
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Проверяем, есть ли уже категории
        existing_count = db.query(ProductCategory).count()
        if existing_count > 0:
            print(f"Найдено существующих категорий: {existing_count}")
            # Проверяем подкатегории
            subcat_count = db.query(ProductSubcategory).count()
            print(f"Найдено существующих подкатегорий: {subcat_count}")
            if subcat_count == 0:
                print("Подкатегории отсутствуют. Удаляем категории и пересоздаем...")
                db.query(ProductSubcategory).delete()
                db.query(ProductCategory).delete()
                db.commit()
            else:
                print("Категории и подкатегории уже существуют. Пропускаем инициализацию.")
                return
        
        categories_data = [
            {
                "name_ru": "Лекарства и препараты",
                "name_kg": "Дарттар жана препараттар",
                "description": "Ветеринарные лекарственные препараты",
                "sort_order": 1,
                "subcategories": [
                    {"name_ru": "Антибиотики", "name_kg": "Антибиотиктер", "sort_order": 1},
                    {"name_ru": "Противовоспалительные", "name_kg": "Сезамга каршы", "sort_order": 2},
                    {"name_ru": "Противопаразитарные", "name_kg": "Паразиттерге каршы", "sort_order": 3},
                    {"name_ru": "Витамины и добавки", "name_kg": "Витаминдер жана кошулмалар", "sort_order": 4},
                    {"name_ru": "Гормональные препараты", "name_kg": "Гормоналдык препараттар", "sort_order": 5},
                    {"name_ru": "Анестетики", "name_kg": "Анестетиктер", "sort_order": 6},
                ]
            },
            {
                "name_ru": "Корма и питание",
                "name_kg": "Азыктар жана тамактануу",
                "description": "Корма для животных различных видов",
                "sort_order": 2,
                "subcategories": [
                    {"name_ru": "Сухие корма", "name_kg": "Кургак азыктар", "sort_order": 1},
                    {"name_ru": "Влажные корма", "name_kg": "Нымдуу азыктар", "sort_order": 2},
                    {"name_ru": "Лечебные корма", "name_kg": "Дарылоочу азыктар", "sort_order": 3},
                    {"name_ru": "Корма для щенков/котят", "name_kg": "Кутучалар/мышыктар үчүн азыктар", "sort_order": 4},
                    {"name_ru": "Корма для пожилых животных", "name_kg": "Кары жандыктар үчүн азыктар", "sort_order": 5},
                    {"name_ru": "Лакомства", "name_kg": "Таттуулар", "sort_order": 6},
                ]
            },
            {
                "name_ru": "Инструменты и оборудование",
                "name_kg": "Куралдар жана жабдуулар",
                "description": "Ветеринарные инструменты и медицинское оборудование",
                "sort_order": 3,
                "subcategories": [
                    {"name_ru": "Хирургические инструменты", "name_kg": "Хирургиялык куралдар", "sort_order": 1},
                    {"name_ru": "Диагностическое оборудование", "name_kg": "Диагностикалык жабдуулар", "sort_order": 2},
                    {"name_ru": "Шприцы и иглы", "name_kg": "Шприцтер жана ийнелер", "sort_order": 3},
                    {"name_ru": "Стетоскопы", "name_kg": "Стетоскоптор", "sort_order": 4},
                    {"name_ru": "Термометры", "name_kg": "Термометрлер", "sort_order": 5},
                    {"name_ru": "Весы для животных", "name_kg": "Жандыктар үчүн таразылар", "sort_order": 6},
                ]
            },
            {
                "name_ru": "Аксессуары и уход",
                "name_kg": "Аксессуарлар жана кам көрүү",
                "description": "Аксессуары для ухода за животными",
                "sort_order": 4,
                "subcategories": [
                    {"name_ru": "Ошейники и поводки", "name_kg": "Мойнунчалар жана жүгүртүүчүлөр", "sort_order": 1},
                    {"name_ru": "Шлейки", "name_kg": "Шлейкалар", "sort_order": 2},
                    {"name_ru": "Миски и поилки", "name_kg": "Чынылар жана суу ичүүчүлөр", "sort_order": 3},
                    {"name_ru": "Лежанки и домики", "name_kg": "Жаткан жерлер жана үйлөр", "sort_order": 4},
                    {"name_ru": "Расчески и щетки", "name_kg": "Тарактар жана щеткалар", "sort_order": 5},
                    {"name_ru": "Когтерезы", "name_kg": "Тырнак кесүүчүлөр", "sort_order": 6},
                ]
            },
            {
                "name_ru": "Переноски и одежда",
                "name_kg": "Ташуучулар жана кийимдер",
                "description": "Переноски для животных и одежда",
                "sort_order": 5,
                "subcategories": [
                    {"name_ru": "Переноски", "name_kg": "Ташуучулар", "sort_order": 1},
                    {"name_ru": "Одежда для собак", "name_kg": "Иттер үчүн кийимдер", "sort_order": 2},
                    {"name_ru": "Одежда для кошек", "name_kg": "Мышыктар үчүн кийимдер", "sort_order": 3},
                    {"name_ru": "Обувь для животных", "name_kg": "Жандыктар үчүн бут кийимдери", "sort_order": 4},
                    {"name_ru": "Попоны и жилеты", "name_kg": "Попондар жана жилеттер", "sort_order": 5},
                ]
            },
            {
                "name_ru": "Игрушки",
                "name_kg": "Оюнчуктар",
                "description": "Игрушки для животных",
                "sort_order": 6,
                "subcategories": [
                    {"name_ru": "Мячи и фрисби", "name_kg": "Топтор жана фрисби", "sort_order": 1},
                    {"name_ru": "Интерактивные игрушки", "name_kg": "Интерактивдүү оюнчуктар", "sort_order": 2},
                    {"name_ru": "Игрушки для кошек", "name_kg": "Мышыктар үчүн оюнчуктар", "sort_order": 3},
                    {"name_ru": "Игрушки для собак", "name_kg": "Иттер үчүн оюнчуктар", "sort_order": 4},
                    {"name_ru": "Развивающие игрушки", "name_kg": "Өнүктүрүүчү оюнчуктар", "sort_order": 5},
                ]
            },
            {
                "name_ru": "Средства гигиены",
                "name_kg": "Гигиена каражаттары",
                "description": "Средства для гигиены животных",
                "sort_order": 7,
                "subcategories": [
                    {"name_ru": "Шампуни", "name_kg": "Шампундар", "sort_order": 1},
                    {"name_ru": "Кондиционеры", "name_kg": "Кондиционерлер", "sort_order": 2},
                    {"name_ru": "Средства для ушей", "name_kg": "Кулактар үчүн каражаттар", "sort_order": 3},
                    {"name_ru": "Средства для зубов", "name_kg": "Тиштер үчүн каражаттар", "sort_order": 4},
                    {"name_ru": "Влажные салфетки", "name_kg": "Нымдуу салфеткалар", "sort_order": 5},
                    {"name_ru": "Дезинфицирующие средства", "name_kg": "Дезинфекциялоочу каражаттар", "sort_order": 6},
                ]
            },
            {
                "name_ru": "Прочее",
                "name_kg": "Башкалар",
                "description": "Прочие товары для животных",
                "sort_order": 8,
                "subcategories": [
                    {"name_ru": "Книги и литература", "name_kg": "Китептер жана адабият", "sort_order": 1},
                    {"name_ru": "Подарочные наборы", "name_kg": "Белек топтомдору", "sort_order": 2},
                    {"name_ru": "Другое", "name_kg": "Башка", "sort_order": 3},
                ]
            },
        ]
        
        total_subcategories = 0
        for cat_data in categories_data:
            # Сохраняем подкатегории перед удалением из cat_data
            subcategories_data = cat_data.get("subcategories", [])
            # Создаем копию без subcategories для создания категории
            cat_data_copy = {k: v for k, v in cat_data.items() if k != "subcategories"}
            category = ProductCategory(**cat_data_copy)
            db.add(category)
            db.flush()
            
            # Создаем подкатегории
            for subcat_data in subcategories_data:
                subcategory = ProductSubcategory(
                    category_id=category.id,
                    **subcat_data
                )
                db.add(subcategory)
                total_subcategories += 1
        
        db.commit()
        print("OK: Категории и подкатегории товаров успешно созданы!")
        print(f"   Создано категорий: {len(categories_data)}")
        print(f"   Создано подкатегорий: {total_subcategories}")
        
    except Exception as e:
        db.rollback()
        print(f"ERROR: Ошибка при создании категорий: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    init_product_categories()

