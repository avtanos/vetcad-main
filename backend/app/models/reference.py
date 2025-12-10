from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class TypeOfAnimal(Base):
    __tablename__ = "type_of_animals"

    id = Column(Integer, primary_key=True, index=True)
    name_ru = Column(String, nullable=False)
    name_kg = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)


class ProductCategory(Base):
    """Категории товаров (например: Лекарства, Корма, Инструменты)"""
    __tablename__ = "product_categories"

    id = Column(Integer, primary_key=True, index=True)
    name_ru = Column(String, nullable=False)
    name_kg = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    icon_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)

    subcategories = relationship("ProductSubcategory", back_populates="category", cascade="all, delete-orphan")


class ProductSubcategory(Base):
    """Подкатегории товаров (например: Антибиотики, Сухие корма, Хирургические инструменты)"""
    __tablename__ = "product_subcategories"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("product_categories.id"), nullable=False)
    name_ru = Column(String, nullable=False)
    name_kg = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)

    category = relationship("ProductCategory", back_populates="subcategories")


class RefShop(Base):
    __tablename__ = "ref_shop"

    id = Column(Integer, primary_key=True, index=True)
    name_ru = Column(String, nullable=False)
    name_kg = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    img_url = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    subcategory_id = Column(Integer, ForeignKey("product_subcategories.id"), nullable=True)
    price = Column(String, nullable=True)  # Цена товара
    stock_quantity = Column(Integer, nullable=True)  # Количество на складе

    subcategory = relationship("ProductSubcategory", lazy="joined")

