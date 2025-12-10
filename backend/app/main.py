from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, pet, reference, parser, assistant, chat, vet_cabinet, partner_cabinet, owner_cabinet, admin, product_category

# Импортируем все модели для создания таблиц
from app.models import user as user_model, pet as pet_model, reference as reference_model, article as article_model, reminder as reminder_model
from app.models import vet_cabinet as vet_cabinet_model, partner_cabinet as partner_cabinet_model

# Создаем таблицы
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="VetCard API",
    description="API для ветеринарной карты",
    version="1.0.0"
)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене указать конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутеров
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(pet.router, prefix="/api/v1/pet", tags=["pet"])
app.include_router(reference.router, prefix="/api/v1/reference", tags=["reference"])
app.include_router(parser.router, prefix="/api/v1/parser", tags=["parser"])
app.include_router(assistant.router, prefix="/api/v1/assistant", tags=["assistant"])
app.include_router(chat.router, prefix="/api/v1/ai", tags=["ai"])
app.include_router(vet_cabinet.router, prefix="/api/v1/vet", tags=["vet-cabinet"])
app.include_router(partner_cabinet.router, prefix="/api/v1/partner", tags=["partner-cabinet"])
app.include_router(owner_cabinet.router, prefix="/api/v1/owner", tags=["owner-cabinet"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])


@app.get("/")
async def root():
    return {"message": "VetCard API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "ok"}

