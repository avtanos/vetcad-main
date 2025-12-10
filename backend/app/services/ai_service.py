"""
Сервис для работы с AI ассистентом на основе llama3.2
"""
try:
    import ollama
    OLLAMA_AVAILABLE = True
except ImportError:
    OLLAMA_AVAILABLE = False
    ollama = None

from typing import List, Dict, Optional, Any
from app.models.pet import Pet
from app.models.user import User
from app.services.pet_tools import PetTools


class AIService:
    """Сервис для взаимодействия с AI моделью llama3.2"""
    
    def __init__(self, model_name: str = "llama3.2:1b"):
        self.model_name = model_name
        self.system_prompt = self._get_system_prompt()
        self._check_model_availability()
    
    def _check_model_availability(self):
        """Проверяет доступность модели и пытается найти альтернативу"""
        if not OLLAMA_AVAILABLE:
            return
        
        try:
            # Пытаемся найти доступную модель
            models_response = ollama.list()
            # ollama.list() возвращает объект с атрибутом models (список объектов Model)
            available_models = [m.model for m in models_response.models] if hasattr(models_response, 'models') else []
            
            # Проверяем, доступна ли модель по умолчанию
            if self.model_name not in available_models:
                # Пытаемся найти альтернативу
                alternatives = [
                    "llama3.2:1b",
                    "llama3.2",
                    "llama3.2:3b",
                    "llama3"
                ]
                
                for alt in alternatives:
                    if alt in available_models:
                        old_name = self.model_name
                        self.model_name = alt
                        print(f"⚠️  Модель {old_name} не найдена, используется {alt}")
                        break
                else:
                    if available_models:
                        old_name = self.model_name
                        self.model_name = available_models[0]
                        print(f"⚠️  Модель {old_name} не найдена, используется первая доступная: {self.model_name}")
        except Exception as e:
            print(f"⚠️  Не удалось проверить доступность моделей: {e}")
    
    def _get_system_prompt(self) -> str:
        """Системный промпт для AI ассистента"""
        return """Ты - профессиональный ветеринарный AI ассистент VetCard. 
Твоя задача - помогать владельцам питомцев с вопросами о здоровье, уходе, питании и поведении животных.

Правила:
1. Всегда давай точные и полезные советы на основе ветеринарных знаний
2. Если вопрос касается серьезного заболевания или экстренной ситуации, настоятельно рекомендуй обратиться к ветеринару
3. Будь дружелюбным, профессиональным и понятным
4. Используй информацию о питомцах пользователя для персонализированных ответов
5. Можешь предлагать создать напоминания о важных событиях (прививки, осмотры, кормление)
6. Отвечай на русском языке, если пользователь пишет на русском

ВАЖНО - Использование данных сайта:
- Если в контексте есть список СПЕЦИАЛИСТОВ (ветеринаров), ОБЯЗАТЕЛЬНО рекомендуй их при вопросах о здоровье, лечении, консультациях
- Указывай конкретные имена специалистов, их клиники и специализации из предоставленного списка
- Если в контексте есть список ТОВАРОВ, можешь рекомендовать их при вопросах о кормах, игрушках, аксессуарах
- Указывай конкретные названия товаров и цены из предоставленного списка
- При вопросах о конкретном питомце используй его имя и характеристики из контекста

Формат ответов:
- Краткие и структурированные ответы
- Используй списки и выделения для важной информации
- Предлагай конкретные действия, когда это уместно
- Рекомендуй конкретных специалистов и товары из предоставленных данных"""
    
    def _build_context(
        self, 
        user: User, 
        pets: List[Pet], 
        species_dict: Dict[int, str],
        veterinarians: Optional[List[Dict[str, Any]]] = None,
        products: Optional[List[Dict[str, Any]]] = None
    ) -> str:
        """Строит контекст о пользователе, его питомцах, доступных специалистах и товарах"""
        context_parts = []
        
        # Информация о питомцах
        if pets:
            context_parts.append("=== ИНФОРМАЦИЯ О ПИТОМЦАХ ПОЛЬЗОВАТЕЛЯ ===")
            context_parts.append("ВАЖНО: При ответах на вопросы используй конкретные данные о питомцах пользователя!")
            for pet in pets:
                species_name = species_dict.get(pet.species, "Неизвестный вид")
                pet_info = f"\nПитомец: {pet.name}"
                pet_info += f"\n  Вид: {species_name}"
                if pet.birth_date:
                    pet_info += f"\n  Дата рождения: {pet.birth_date}"
                if pet.breed:
                    pet_info += f"\n  Порода: {pet.breed}"
                if pet.weight:
                    pet_info += f"\n  Вес: {pet.weight} кг"
                if pet.special_notes:
                    pet_info += f"\n  Особые пометки: {pet.special_notes}"
                context_parts.append(pet_info)
                
                # Добавляем анализ здоровья
                health_analysis = PetTools.analyze_pet_health(pet, species_dict)
                if health_analysis.get("age"):
                    context_parts.append(f"  Возраст {pet.name}: {health_analysis['age']}")
        else:
            context_parts.append("У пользователя пока нет зарегистрированных питомцев.")
        
        # Информация о специалистах (ветеринарах)
        if veterinarians:
            context_parts.append("\n=== ДОСТУПНЫЕ СПЕЦИАЛИСТЫ (ВЕТЕРИНАРЫ) ===")
            context_parts.append("При необходимости консультации или записи на прием, рекомендую следующих специалистов:")
            for vet in veterinarians[:5]:  # Ограничиваем до 5 для контекста
                vet_info = f"- {vet.get('first_name', '')} {vet.get('last_name', '')}".strip()
                if not vet_info or vet_info == "-":
                    vet_info = f"- {vet.get('username', 'Ветеринар')}"
                if vet.get('clinic'):
                    vet_info += f" ({vet.get('clinic')})"
                if vet.get('specialization'):
                    vet_info += f", специализация: {vet.get('specialization')}"
                if vet.get('city'):
                    vet_info += f", город: {vet.get('city')}"
                context_parts.append(vet_info)
            if len(veterinarians) > 5:
                context_parts.append(f"... и еще {len(veterinarians) - 5} специалистов")
        
        # Информация о товарах
        if products:
            context_parts.append("\n=== ДОСТУПНЫЕ ТОВАРЫ ===")
            context_parts.append("При необходимости покупки товаров для питомца, рекомендую следующие варианты:")
            # Группируем товары по категориям для лучшей структуры
            products_by_category = {}
            for product in products[:10]:  # Ограничиваем до 10 для контекста
                category = product.get('subcategory', {}).get('name_ru', 'Без категории') if product.get('subcategory') else 'Без категории'
                if category not in products_by_category:
                    products_by_category[category] = []
                products_by_category[category].append(product)
            
            for category, cat_products in list(products_by_category.items())[:3]:  # Максимум 3 категории
                context_parts.append(f"\n{category}:")
                for product in cat_products[:3]:  # Максимум 3 товара на категорию
                    product_info = f"  - {product.get('name_ru', 'Товар')}"
                    if product.get('price'):
                        product_info += f" ({product.get('price')} сом)"
                    if product.get('description'):
                        desc = product.get('description', '')[:50]  # Первые 50 символов
                        product_info += f" - {desc}..."
                    context_parts.append(product_info)
        
        # Добавляем инструкции для AI
        context_parts.append("\n=== ИНСТРУКЦИИ ДЛЯ AI ===")
        context_parts.append("1. При ответах на вопросы о здоровье питомцев используй информацию о конкретных питомцах пользователя")
        context_parts.append("2. Если вопрос касается симптомов или проблем со здоровьем, РЕКОМЕНДУЙ обратиться к специалисту из списка выше")
        context_parts.append("3. При вопросах о товарах (корм, игрушки, аксессуары) МОЖЕШЬ РЕКОМЕНДОВАТЬ товары из списка выше")
        context_parts.append("4. Всегда учитывай возраст, породу и особые пометки питомцев при даче рекомендаций")
        context_parts.append("5. Если вопрос касается конкретного питомца, используй его имя и характеристики")
        
        return "\n".join(context_parts)
    
    async def chat(
        self,
        message: str,
        user: User,
        pets: List[Pet],
        species_dict: Dict[int, str],
        conversation_history: Optional[List[Dict[str, str]]] = None,
        veterinarians: Optional[List[Dict[str, Any]]] = None,
        products: Optional[List[Dict[str, Any]]] = None
    ) -> str:
        """
        Отправляет сообщение в AI и получает ответ
        
        Args:
            message: Сообщение пользователя
            user: Пользователь
            pets: Список питомцев пользователя
            species_dict: Словарь видов животных
            conversation_history: История разговора (опционально)
            veterinarians: Список доступных ветеринаров (опционально)
            products: Список доступных товаров (опционально)
        
        Returns:
            Ответ AI ассистента
        """
        try:
            # Строим контекст о питомцах, специалистах и товарах
            context = self._build_context(user, pets, species_dict, veterinarians, products)
            
            # Формируем полный промпт
            full_prompt = f"{self.system_prompt}\n\n{context}\n\nВопрос пользователя: {message}\n\nОтвет:"
            
            # Если есть история, добавляем её
            messages = []
            if conversation_history:
                for hist in conversation_history:
                    messages.append({
                        "role": "user" if hist.get("sender") == "user" else "assistant",
                        "content": hist.get("text", "")
                    })
            
            # Добавляем текущее сообщение
            messages.append({"role": "user", "content": full_prompt})
            
            # Вызываем модель через Ollama
            if not OLLAMA_AVAILABLE:
                return self._get_fallback_response(message, pets, species_dict, veterinarians, products)
            
            try:
                # Используем простой вызов без истории для начала
                response = ollama.chat(
                    model=self.model_name,
                    messages=[{"role": "user", "content": full_prompt}],
                    stream=False
                )
                
                # Извлекаем ответ
                if response and "message" in response:
                    content = response["message"].get("content", "")
                    if content:
                        return content
                    else:
                        print("⚠️  Пустой ответ от модели")
                        return self._get_fallback_response(message, pets, species_dict, veterinarians, products)
                else:
                    print("⚠️  Неверный формат ответа от модели")
                    return self._get_fallback_response(message, pets, species_dict, veterinarians, products)
            except ConnectionError as e:
                # Ollama сервер не запущен
                print(f"❌ Ollama сервер не запущен: {e}")
                return self._get_fallback_response(message, pets, species_dict, veterinarians, products, "Ollama сервер не запущен. Пожалуйста, запустите Ollama.")
            except Exception as e:
                # Если Ollama не запущен или модель не найдена, возвращаем fallback ответ
                error_msg = str(e)
                print(f"❌ Ошибка при обращении к Ollama: {error_msg}")
                return self._get_fallback_response(message, pets, species_dict, veterinarians, products, error_msg)
                
        except Exception as e:
            # Общая ошибка
            return self._get_fallback_response(message, pets, species_dict, veterinarians, products, str(e))
    
    def _get_fallback_response(
        self, 
        message: str, 
        pets: List[Pet], 
        species_dict: Dict[int, str],
        veterinarians: Optional[List[Dict[str, Any]]] = None,
        products: Optional[List[Dict[str, Any]]] = None,
        error: str = ""
    ) -> str:
        """Fallback ответ, если AI недоступен"""
        message_lower = message.lower()
        
        # Простые ответы на частые вопросы
        if any(word in message_lower for word in ["прививка", "вакцинация"]):
            return "Прививки - важная часть здоровья питомца. Рекомендую проконсультироваться с ветеринаром для составления индивидуального графика прививок. Обычно щенкам и котятам делают первую прививку в 6-8 недель, затем повторяют через 3-4 недели."
        
        if any(word in message_lower for word in ["корм", "питание", "еда"]):
            return "Правильное питание очень важно для здоровья питомца. Рекомендую:\n- Выбирать качественный корм, соответствующий возрасту и породе\n- Соблюдать режим кормления\n- Обеспечить постоянный доступ к чистой воде\n- Консультироваться с ветеринаром по поводу диеты"
        
        if any(word in message_lower for word in ["здоров", "болезнь", "симптом"]):
            return "Если вы заметили изменения в поведении или состоянии питомца, важно как можно скорее обратиться к ветеринару. Признаки, требующие внимания: потеря аппетита, вялость, рвота, диарея, изменения в дыхании."
        
        if pets:
            pets_info = ", ".join([f"{p.name}" for p in pets])
            if error:
                if "Connection" in error or "не запущен" in error.lower():
                    return f"Я вижу, что у вас есть питомцы: {pets_info}. Для получения персонализированных рекомендаций, пожалуйста, запустите Ollama сервер. Вы можете установить Ollama с https://ollama.ai и запустить его командой 'ollama serve'."
                elif "model" in error.lower() or "not found" in error.lower():
                    return f"Я вижу, что у вас есть питомцы: {pets_info}. Модель AI не найдена. Пожалуйста, установите модель командой 'ollama pull llama3.2:1b'."
                else:
                    return f"Я вижу, что у вас есть питомцы: {pets_info}. Произошла ошибка при обращении к AI: {error}. Пожалуйста, убедитесь, что Ollama запущен и модель установлена."
            else:
                return f"Я вижу, что у вас есть питомцы: {pets_info}. Для получения персонализированных рекомендаций по уходу за вашими питомцами, пожалуйста, убедитесь, что Ollama запущен и модель llama3.2 установлена. Вы можете установить Ollama с https://ollama.ai"
        else:
            return "Для получения подробных рекомендаций по уходу за питомцами, пожалуйста, добавьте информацию о ваших питомцах в профиль. Также убедитесь, что Ollama запущен для работы AI ассистента."
    
    async def create_reminder_suggestion(
        self,
        message: str,
        user: User,
        pets: List[Pet]
    ) -> Optional[Dict[str, str]]:
        """
        Анализирует сообщение и предлагает создать напоминание, если это уместно
        
        Returns:
            Словарь с данными для напоминания или None
        """
        # Ключевые слова для напоминаний
        reminder_keywords = [
            "прививка", "вакцинация", "осмотр", "визит к ветеринару",
            "лекарство", "таблетка", "корм", "питание", "процедура"
        ]
        
        message_lower = message.lower()
        for keyword in reminder_keywords:
            if keyword in message_lower:
                # Пытаемся извлечь информацию через AI
                prompt = f"""Проанализируй следующее сообщение и определи, нужно ли создать напоминание.
Если да, верни только JSON в формате: {{"event": "описание события", "pet_name": "имя питомца или 'любой'", "suggested": true}}
Если нет, верни: {{"suggested": false}}

Сообщение: {message}
Питомцы пользователя: {', '.join([p.name for p in pets]) if pets else 'нет'}

Ответ (только JSON):"""
                
                if OLLAMA_AVAILABLE:
                    try:
                        response = ollama.chat(
                            model=self.model_name,
                            messages=[{"role": "user", "content": prompt}],
                            stream=False
                        )
                        
                        if response and "message" in response:
                            content = response["message"].get("content", "")
                            # Пытаемся извлечь JSON из ответа
                            import json
                            import re
                            json_match = re.search(r'\{[^}]+\}', content)
                            if json_match:
                                suggestion = json.loads(json_match.group())
                                if suggestion.get("suggested"):
                                    return {
                                        "event": suggestion.get("event", "Напоминание"),
                                        "pet_name": suggestion.get("pet_name", "любой")
                                    }
                    except:
                        pass
        
        return None


# Глобальный экземпляр сервиса
ai_service = AIService()

