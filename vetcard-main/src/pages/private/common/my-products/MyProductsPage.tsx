import { useState, useEffect } from 'react';
import { api } from '@/shared/api';
import { useUserStore } from '@/entities/user/model/user-store';
import type { Product } from '@/entities/product/model/ProductTypes';
import { AddProductForm } from '@/features/add-product/ui/AddProductForm';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/input';

export const MyProductsPage = () => {
  const { user } = useUserStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({
    name_ru: '',
    name_kg: '',
    description: '',
    img_url: '',
    is_active: true,
    subcategory_id: undefined as number | undefined,
    price: '',
    stock_quantity: undefined as number | undefined,
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (user) {
      loadProducts();
      loadCategories();
    }
  }, [user]);

  useEffect(() => {
    if (selectedCategoryId) {
      loadSubcategories(selectedCategoryId);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategoryId]);

  const loadCategories = async () => {
    try {
      const data = await api.get<any[]>('/v1/reference/categories');
      setCategories(data);
    } catch (e: any) {
      console.error('Ошибка загрузки категорий:', e);
    }
  };

  const loadSubcategories = async (categoryId: number) => {
    try {
      const data = await api.get<any[]>(`/v1/reference/subcategories?category_id=${categoryId}`);
      setSubcategories(data);
    } catch (e: any) {
      console.error('Ошибка загрузки подкатегорий:', e);
    }
  };

  const loadProducts = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Product[]>('/v1/reference/ref_shop/my/');
      setProducts(data || []);
    } catch (e: any) {
      setError(e.message || 'Ошибка загрузки товаров');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (product: Omit<Product, 'id'>) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const newProduct = await api.post<Omit<Product, 'id'>, Product>('/v1/reference/ref_shop/', product);
      setProducts(prev => [newProduct, ...prev]);
      setShowAddForm(false);
    } catch (e: any) {
      setError(e.message || 'Ошибка добавления товара');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      name_ru: product.name_ru,
      name_kg: product.name_kg,
      description: product.description,
      img_url: product.img_url,
      is_active: product.is_active,
      subcategory_id: product.subcategory_id,
      price: product.price?.toString() || '',
      stock_quantity: product.stock_quantity,
    });
    setShowEditForm(true);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    setLoading(true);
    setError(null);
    try {
      const updateData = {
        ...editForm,
        price: editForm.price || undefined,
        stock_quantity: editForm.stock_quantity || undefined,
      };
      const updatedProduct = await api.put<typeof updateData, Product>(`/v1/reference/ref_shop/${editingProduct.id}`, updateData);
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
      setShowEditForm(false);
      setEditingProduct(null);
      setSelectedCategoryId(undefined);
      setSubcategories([]);
    } catch (e: any) {
      setError(e.message || 'Ошибка обновления товара');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/v1/reference/ref_shop/${productId}`);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (e: any) {
      setError(e.message || 'Ошибка удаления товара');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="text-center text-slate-500">
          <p>Необходима авторизация</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Мои товары</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <FaPlus /> Добавить товар
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {loading && !products.length ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center text-slate-500">
          <p className="mb-4">У вас пока нет товаров</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Добавить первый товар
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow p-4 relative hover:shadow-lg transition-shadow">
              <div className="absolute top-2 right-2 flex gap-2 z-10">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  title="Редактировать"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  title="Удалить"
                >
                  <FaTrash />
                </button>
              </div>
              <div onClick={() => window.location.href = `/products/${product.id}`} className="cursor-pointer">
                <img
                  src={product.img_url}
                  alt={product.name_ru}
                  className="w-full h-48 object-cover rounded mb-3"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-product.png';
                  }}
                />
                <h3 className="font-semibold text-slate-900 mb-2">{product.name_ru}</h3>
                <p className="text-slate-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                <span className={`inline-block px-2 py-1 rounded text-xs ${
                  product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.is_active ? 'Активен' : 'Неактивен'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Модальное окно добавления товара */}
      {showAddForm && (
        <Modal
          isOpen={true}
          onClose={() => setShowAddForm(false)}
          title="Добавить товар"
        >
          <AddProductForm
            onAdd={async (product) => {
              await handleAddProduct(product);
              setShowAddForm(false);
            }}
            userId={user.id}
          />
        </Modal>
      )}

      {/* Модальное окно редактирования товара */}
      {showEditForm && editingProduct && (
        <Modal
          isOpen={true}
          onClose={() => {
            setShowEditForm(false);
            setEditingProduct(null);
          }}
          title="Редактировать товар"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateProduct();
            }}
            className="space-y-4"
          >
            <Input
              label="Название (RU) *"
              name="name_ru"
              value={editForm.name_ru}
              onChange={(e) => setEditForm({ ...editForm, name_ru: e.target.value })}
              required
            />
            <Input
              label="Название (KG) *"
              name="name_kg"
              value={editForm.name_kg}
              onChange={(e) => setEditForm({ ...editForm, name_kg: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Описание *
              </label>
              <textarea
                name="description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <Input
              label="Ссылка на изображение *"
              name="img_url"
              value={editForm.img_url}
              onChange={(e) => setEditForm({ ...editForm, img_url: e.target.value })}
              required
            />
            
            {/* Категория */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Категория</label>
              <select
                value={selectedCategoryId || ''}
                onChange={(e) => {
                  const catId = e.target.value ? parseInt(e.target.value) : undefined;
                  setSelectedCategoryId(catId);
                  if (!catId) {
                    setEditForm({ ...editForm, subcategory_id: undefined });
                  }
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Выберите категорию</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name_ru}</option>
                ))}
              </select>
            </div>

            {/* Подкатегория */}
            {selectedCategoryId && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Подкатегория</label>
                <select
                  value={editForm.subcategory_id || ''}
                  onChange={(e) => setEditForm({ ...editForm, subcategory_id: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Выберите подкатегорию</option>
                  {subcategories.map(subcat => (
                    <option key={subcat.id} value={subcat.id}>{subcat.name_ru}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Цена и количество */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Цена (сом)"
                name="price"
                value={editForm.price}
                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
              />
              <Input
                label="Количество на складе"
                name="stock_quantity"
                type="number"
                value={editForm.stock_quantity || ''}
                onChange={(e) => setEditForm({ ...editForm, stock_quantity: e.target.value ? parseInt(e.target.value) : undefined })}
                min="0"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={editForm.is_active}
                onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-slate-700">
                Активен
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowEditForm(false);
                  setEditingProduct(null);
                }}
                disabled={loading}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

