import { useEffect, useState } from 'react';
import type { Product, ProductCategory, ProductSubcategory } from '@/entities/product/model/ProductTypes';
import { ProductCard } from '@/entities/product/ui/ProductCard';
import { api } from '@/shared/api';
import { FaFilter, FaSearch, FaShoppingBag } from 'react-icons/fa';

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | undefined>(undefined);
  const [subcategories, setSubcategories] = useState<ProductSubcategory[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Загрузка товаров и категорий...');
        const [productsData, categoriesData] = await Promise.all([
          api.get<Product[]>('/v1/reference/ref_shop/'),
          api.get<ProductCategory[]>('/v1/reference/categories')
        ]);
        console.log('Получены товары:', productsData?.length || 0);
        console.log('Получены категории:', categoriesData);
        setProducts(productsData || []);
        setFilteredProducts(productsData || []);
        if (categoriesData && Array.isArray(categoriesData)) {
          setCategories(categoriesData);
          console.log('OK: Загружено категорий:', categoriesData.length);
        } else {
          console.warn('WARNING: Категории не получены или неверный формат:', categoriesData);
          setCategories([]);
        }
      } catch (e: any) {
        console.error('ERROR: Ошибка загрузки данных:', e);
        console.error('ERROR: Детали:', {
          message: e.message,
          stack: e.stack
        });
        setError(e.message || 'Ошибка загрузки товаров');
        // Пытаемся загрузить товары отдельно, если категории не загрузились
        try {
          console.log('Попытка загрузить только товары...');
          const productsData = await api.get<Product[]>('/v1/reference/ref_shop/');
          setProducts(productsData || []);
          setFilteredProducts(productsData || []);
          console.log('OK: Товары загружены отдельно');
        } catch (productsError: any) {
          console.error('ERROR: Ошибка загрузки товаров:', productsError);
        }
        // Пытаемся загрузить категории отдельно
        try {
          console.log('Попытка загрузить только категории...');
          const categoriesData = await api.get<ProductCategory[]>('/v1/reference/categories');
          if (categoriesData && Array.isArray(categoriesData)) {
            setCategories(categoriesData);
            console.log('OK: Категории загружены отдельно:', categoriesData.length);
          }
        } catch (categoriesError: any) {
          console.error('ERROR: Ошибка загрузки категорий:', categoriesError);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      const loadSubcategories = async () => {
        try {
          const data = await api.get<ProductSubcategory[]>(`/v1/reference/subcategories?category_id=${selectedCategoryId}`);
          setSubcategories(data);
        } catch (e) {
          console.error('Ошибка загрузки подкатегорий:', e);
        }
      };
      loadSubcategories();
    } else {
      setSubcategories([]);
      setSelectedSubcategoryId(undefined);
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    let filtered = products;
    
    // Фильтр по поисковому запросу
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name_ru.toLowerCase().includes(query) ||
        p.name_kg?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.subcategory?.name_ru?.toLowerCase().includes(query)
      );
    }
    
    // Фильтр по подкатегории
    if (selectedSubcategoryId) {
      filtered = filtered.filter(p => p.subcategory_id === selectedSubcategoryId);
    } else if (selectedCategoryId) {
      // Фильтруем по категории (все подкатегории этой категории)
      const categorySubcatIds = subcategories.map(s => s.id);
      filtered = filtered.filter(p => p.subcategory_id && categorySubcatIds.includes(p.subcategory_id));
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategoryId, selectedSubcategoryId, products, subcategories, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Заголовок с иконкой */}
      <div className="flex items-center gap-3 mb-6">
        <FaShoppingBag className="text-4xl text-teal-600" />
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Онлайн-магазин</h1>
          <p className="text-slate-600 mt-1">Найдите и купите товары для ваших питомцев</p>
        </div>
      </div>
      
      {/* Поиск и фильтры */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        {/* Поиск */}
        <div className="mb-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Поиск товаров по названию, описанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>
        
        {/* Фильтры по категориям */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <FaFilter className="text-slate-500" />
            <span className="font-medium text-slate-700">Фильтры:</span>
          </div>
          
          <select
            value={selectedCategoryId || ''}
            onChange={(e) => {
              const catId = e.target.value ? parseInt(e.target.value) : undefined;
              setSelectedCategoryId(catId);
              setSelectedSubcategoryId(undefined);
            }}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            disabled={loading}
          >
            <option value="">Все категории</option>
            {categories.length === 0 && !loading && (
              <option value="" disabled>Категории не загружены</option>
            )}
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name_ru}</option>
            ))}
          </select>
          {categories.length === 0 && !loading && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-500">Категории не загружены</span>
              <button
                onClick={async () => {
                  try {
                    const data = await api.get<ProductCategory[]>('/v1/reference/categories');
                    if (data && Array.isArray(data)) {
                      setCategories(data);
                    }
                  } catch (e) {
                    console.error('Ошибка повторной загрузки категорий:', e);
                  }
                }}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Обновить
              </button>
            </div>
          )}

          {selectedCategoryId && subcategories.length > 0 && (
            <select
              value={selectedSubcategoryId || ''}
              onChange={(e) => setSelectedSubcategoryId(e.target.value ? parseInt(e.target.value) : undefined)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Все подкатегории</option>
              {subcategories.map(subcat => (
                <option key={subcat.id} value={subcat.id}>{subcat.name_ru}</option>
              ))}
            </select>
          )}

          {(selectedCategoryId || selectedSubcategoryId || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategoryId(undefined);
                setSelectedSubcategoryId(undefined);
                setSearchQuery('');
              }}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Сбросить все
            </button>
          )}
        </div>
      </div>

      {/* Состояния загрузки и ошибки */}
      {loading && (
        <div className="text-center text-slate-500 py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
          <p>Загрузка товаров...</p>
        </div>
      )}
      
      {error && (
        <div className="text-center text-red-500 mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          {error}
        </div>
      )}
      
      {/* Список товаров */}
      {!loading && !error && (
        <>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <FaShoppingBag className="mx-auto mb-4 text-6xl text-slate-300" />
              <p className="text-lg font-medium text-slate-700 mb-2">Товары не найдены</p>
              <p className="text-sm text-slate-500">
                {searchQuery || selectedCategoryId || selectedSubcategoryId
                  ? 'Попробуйте изменить параметры поиска или фильтры'
                  : 'В магазине пока нет товаров'}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div className="text-slate-600">
                  Найдено товаров: <span className="font-semibold text-slate-800">{filteredProducts.length}</span>
                </div>
                {searchQuery && (
                  <div className="text-sm text-slate-500">
                    По запросу "{searchQuery}"
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
