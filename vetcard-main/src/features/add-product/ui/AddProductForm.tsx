import React, { useState, useEffect } from 'react';
import { api } from '@/shared/api';
import type { Product, ProductCategory, ProductSubcategory } from '@/entities/product/model/ProductTypes';

interface AddProductFormProps {
  onAdd: (product: Omit<Product, 'id'>) => void | Promise<void>;
  userId: number;
}

export const AddProductForm: React.FC<AddProductFormProps> = ({ onAdd, userId }) => {
  const [name_ru, setNameRu] = useState('');
  const [name_kg, setNameKg] = useState('');
  const [description, setDescription] = useState('');
  const [img_url, setImgUrl] = useState('');
  const [price, setPrice] = useState('');
  const [stock_quantity, setStockQuantity] = useState('');
  const [subcategory_id, setSubcategoryId] = useState<number | undefined>(undefined);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [subcategories, setSubcategories] = useState<ProductSubcategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  // Повторная попытка загрузки при ошибке
  const retryLoadCategories = () => {
    loadCategories();
  };

  useEffect(() => {
    if (selectedCategoryId) {
      loadSubcategories(selectedCategoryId);
    } else {
      setSubcategories([]);
      setSubcategoryId(undefined);
    }
  }, [selectedCategoryId]);

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      console.log('Загрузка категорий из /v1/reference/categories...');
      const data = await api.get<ProductCategory[]>('/v1/reference/categories');
      console.log('Получены данные категорий:', data);
      if (data && Array.isArray(data)) {
        setCategories(data);
        console.log('OK: Загружено категорий:', data.length);
      } else {
        console.warn('WARNING: Категории не получены или неверный формат:', data);
        setCategories([]);
      }
    } catch (e: any) {
      console.error('ERROR: Ошибка загрузки категорий:', e);
      console.error('ERROR: Детали ошибки:', {
        message: e.message,
        stack: e.stack,
        name: e.name
      });
      setCategories([]);
      // Не показываем alert, чтобы не раздражать пользователя
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadSubcategories = async (categoryId: number) => {
    try {
      const data = await api.get<ProductSubcategory[]>(`/v1/reference/subcategories?category_id=${categoryId}`);
      setSubcategories(data);
    } catch (e: any) {
      console.error('Ошибка загрузки подкатегорий:', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name_ru || !name_kg || !description || !img_url) return;
    setLoading(true);
    try {
      await onAdd({
        name_ru,
        name_kg,
        description,
        img_url,
        is_active: true,
        user: userId,
        subcategory_id: subcategory_id,
        price: price || undefined,
        stock_quantity: stock_quantity ? parseInt(stock_quantity) : undefined,
      });
      setNameRu('');
      setNameKg('');
      setDescription('');
      setImgUrl('');
      setPrice('');
      setStockQuantity('');
      setSubcategoryId(undefined);
      setSelectedCategoryId(undefined);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col gap-3 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Название (рус) *"
        value={name_ru}
        onChange={e => setNameRu(e.target.value)}
        className="border rounded px-3 py-2"
        required
      />
      <input
        type="text"
        placeholder="Название (кырг) *"
        value={name_kg}
        onChange={e => setNameKg(e.target.value)}
        className="border rounded px-3 py-2"
        required
      />
      <textarea
        placeholder="Описание *"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="border rounded px-3 py-2"
        rows={3}
        required
      />
      <input
        type="text"
        placeholder="Ссылка на картинку (img_url) *"
        value={img_url}
        onChange={e => setImgUrl(e.target.value)}
        className="border rounded px-3 py-2"
        required
      />
      
      {/* Категория */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Категория {loadingCategories && <span className="text-xs text-slate-500">(загрузка...)</span>}
        </label>
        <select
          value={selectedCategoryId || ''}
          onChange={(e) => setSelectedCategoryId(e.target.value ? parseInt(e.target.value) : undefined)}
          className="w-full border rounded px-3 py-2"
          disabled={loadingCategories}
        >
          <option value="">Выберите категорию</option>
          {categories.length === 0 && !loadingCategories && (
            <option value="" disabled>Категории не загружены</option>
          )}
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name_ru}</option>
          ))}
        </select>
        {categories.length === 0 && !loadingCategories && (
          <div className="mt-1">
            <p className="text-xs text-red-500 mb-1">Не удалось загрузить категории. Проверьте подключение к серверу.</p>
            <button
              type="button"
              onClick={retryLoadCategories}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Попробовать снова
            </button>
          </div>
        )}
      </div>

      {/* Подкатегория */}
      {selectedCategoryId && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Подкатегория</label>
          <select
            value={subcategory_id || ''}
            onChange={(e) => setSubcategoryId(e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Выберите подкатегорию</option>
            {subcategories.map(subcat => (
              <option key={subcat.id} value={subcat.id}>{subcat.name_ru}</option>
            ))}
          </select>
        </div>
      )}

      {/* Цена и количество */}
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Цена (сом)"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Количество"
          value={stock_quantity}
          onChange={e => setStockQuantity(e.target.value)}
          className="border rounded px-3 py-2"
          min="0"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Добавление...' : 'Добавить товар'}
      </button>
    </form>
  );
}; 