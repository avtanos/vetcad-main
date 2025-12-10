# AI Сервисы VetCard

## Структура

- `ai_service.py` - Основной сервис для работы с AI (llama3.2 через Ollama)
- `pet_tools.py` - Инструменты для анализа данных о питомцах

## Использование

### AIService

Основной сервис для взаимодействия с AI моделью.

```python
from app.services.ai_service import ai_service

# Простой запрос
response = await ai_service.chat(
    message="Какой корм лучше для щенка?",
    user=current_user,
    pets=pets_list,
    species_dict=species_dict
)
```

### PetTools

Инструменты для анализа данных о питомцах.

```python
from app.services.pet_tools import PetTools

# Анализ здоровья
health = PetTools.analyze_pet_health(pet, species_dict)

# График прививок
schedule = PetTools.get_vaccination_schedule(pet, species_dict)

# Рекомендации по кормлению
feeding = PetTools.get_feeding_recommendations(pet, species_dict)
```

## Конфигурация

Модель по умолчанию: `llama3.2`

Для изменения модели измените в `ai_service.py`:
```python
ai_service = AIService(model_name="другая_модель")
```

