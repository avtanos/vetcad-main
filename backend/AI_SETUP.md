# Настройка AI Ассистента с llama3.2

## Обзор

AI Ассистент VetCard использует модель llama3.2 через Ollama для предоставления интеллектуальных ответов на вопросы о питомцах.

## Установка Ollama

### Windows

1. Скачайте Ollama с официального сайта: https://ollama.ai
2. Установите Ollama
3. Запустите Ollama (он будет работать в фоновом режиме)

### Linux/Mac

```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

## Установка модели llama3.2

После установки Ollama выполните:

```bash
ollama pull llama3.2
```

Или для более легкой версии (меньше ресурсов):

```bash
ollama pull llama3.2:1b
```

## Проверка установки

```bash
ollama list
```

Должна быть видна модель `llama3.2`

## Тестирование

```bash
ollama run llama3.2 "Привет, как дела?"
```

## Использование в проекте

После установки Ollama и модели, API автоматически будет использовать AI для ответов.

### Эндпоинт

```
POST /api/v1/ai/chat/
```

**Запрос:**
```json
{
  "message": "Какой корм лучше для щенка?",
  "conversation_history": [
    {"text": "Привет", "sender": "user"},
    {"text": "Здравствуйте!", "sender": "ai"}
  ]
}
```

**Ответ:**
```json
{
  "response": "Ответ AI ассистента...",
  "reminder_suggestion": {
    "event": "Плановый осмотр",
    "pet_name": "Рекс"
  }
}
```

## Fallback режим

Если Ollama не установлен или недоступен, API будет использовать простые шаблонные ответы на частые вопросы.

## Требования к системе

- Минимум 4GB RAM для llama3.2:1b
- Рекомендуется 8GB+ RAM для полной версии llama3.2
- Свободное место на диске: ~2GB для модели

## Альтернативные модели

Можно использовать другие модели Ollama:

```bash
ollama pull mistral
ollama pull codellama
```

И изменить в `backend/app/services/ai_service.py`:
```python
ai_service = AIService(model_name="mistral")
```

## Устранение проблем

### Ollama не запускается
- Проверьте, что Ollama установлен
- Перезапустите Ollama
- Проверьте логи: `ollama serve`

### Модель не найдена
- Убедитесь, что модель загружена: `ollama list`
- Загрузите модель: `ollama pull llama3.2`

### Медленные ответы
- Используйте более легкую модель (llama3.2:1b)
- Увеличьте объем RAM
- Используйте GPU, если доступен

