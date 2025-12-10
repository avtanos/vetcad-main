# Быстрый старт AI Ассистента

## Минимальная настройка (5 минут)

### 1. Установите Ollama

**Windows:**
- Скачайте с https://ollama.ai/download
- Установите и запустите

**Linux/Mac:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### 2. Установите модель llama3.2

```bash
ollama pull llama3.2:1b
```

> Примечание: `:1b` - легкая версия (быстрее, меньше памяти). Для полной версии используйте `ollama pull llama3.2`

### 3. Проверьте установку

```bash
ollama list
```

Должна быть видна модель `llama3.2:1b`

### 4. Перезапустите бэкенд

Остановите текущий сервер (Ctrl+C) и запустите снова:
```bash
python run.py
```

### 5. Готово!

Откройте фронтенд и перейдите в раздел "AI Ассистент". Начните диалог!

## Тестирование через API

```bash
# 1. Получите токен (зарегистрируйтесь или войдите)
curl -X POST "http://localhost:8000/api/v1/auth/token/" \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'

# 2. Отправьте сообщение в AI
curl -X POST "http://localhost:8000/api/v1/ai/chat/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Какой корм лучше для щенка?"}'
```

## Fallback режим

Если Ollama не установлен, API будет работать в fallback режиме с простыми ответами на частые вопросы.

## Требования

- **Минимум**: 4GB RAM для llama3.2:1b
- **Рекомендуется**: 8GB+ RAM для полной версии
- **Диск**: ~1GB для легкой версии, ~4GB для полной

