import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/shared/api';
import type { Product } from '@/entities/product/model/ProductTypes';
import { FaArrowLeft, FaSpinner, FaShoppingCart } from 'react-icons/fa';
import { Button } from '@/shared/ui/Button';
import { useAuth } from '@/entities/user/model/useAuth';

export const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('ID товара не указан');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await api.get<Product>(`/v1/reference/ref_shop/${id}`);
        setProduct(data);
      } catch (e: any) {
        setError(e.message || 'Ошибка загрузки товара');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <FaSpinner className="animate-spin text-4xl text-slate-400" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <button
          onClick={() => navigate('/products')}
          className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
        >
          <FaArrowLeft /> Назад к товарам
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-semibold">
            {error || 'Товар не найден'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Кнопка назад */}
      <button
        onClick={() => navigate('/products')}
        className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors font-medium"
      >
        <FaArrowLeft /> Назад к товарам
      </button>

      {/* Основной контент */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
          {/* Изображение */}
          <div className="flex items-center justify-center bg-slate-50 rounded-xl p-4">
            <img
              src={product.img_url || '/placeholder-product.png'}
              alt={product.name_ru}
              className="w-full h-auto max-h-[500px] object-contain rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-product.png';
              }}
            />
          </div>

          {/* Информация о товаре */}
          <div className="flex flex-col">
            {/* Заголовок */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                {product.name_ru}
              </h1>
              {product.name_kg && (
                <p className="text-lg text-slate-600">{product.name_kg}</p>
              )}
            </div>

            {/* Описание */}
            <div className="mb-6 flex-grow">
              <h2 className="text-xl font-semibold text-slate-800 mb-3">
                Описание
              </h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {product.description || 'Описание отсутствует'}
              </p>
            </div>

            {/* Дополнительная информация */}
            <div className="border-t border-slate-200 pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {product.subcategory && (
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Категория</p>
                    <p className="font-semibold text-slate-700">
                      {product.subcategory.name_ru}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-500 mb-1">Статус</p>
                  <p className="font-semibold">
                    {product.is_active ? (
                      <span className="text-green-600">Активен</span>
                    ) : (
                      <span className="text-red-600">Неактивен</span>
                    )}
                  </p>
                </div>
                {product.price && (
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Цена</p>
                    <p className="font-semibold text-green-600 text-xl">
                      {product.price} сом
                    </p>
                  </div>
                )}
                {product.stock_quantity !== undefined && (
                  <div>
                    <p className="text-sm text-slate-500 mb-1">В наличии</p>
                    <p className="font-semibold text-slate-700">
                      {product.stock_quantity} шт.
                    </p>
                  </div>
                )}
                {product.user && (
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Продавец</p>
                    <p className="font-semibold text-slate-700">
                      ID: {product.user}
                    </p>
                  </div>
                )}
              </div>

              {/* Кнопка покупки */}
              <div className="pt-4">
                {isAuthenticated && product.is_active && !(product.stock_quantity !== undefined && product.stock_quantity <= 0) ? (
                  <Button
                    onClick={async () => {
                      setPurchasing(true);
                      try {
                        // Здесь можно добавить логику покупки
                        // Например, создание заказа или переход на страницу оплаты
                        alert('Функционал покупки будет реализован позже. Товар добавлен в корзину!');
                      } catch (e: any) {
                        alert(e.message || 'Ошибка при оформлении покупки');
                      } finally {
                        setPurchasing(false);
                      }
                    }}
                    disabled={purchasing}
                    className="w-full"
                  >
                    <FaShoppingCart className="mr-2" />
                    {purchasing ? 'Оформление...' : 'Купить'}
                  </Button>
                ) : !isAuthenticated ? (
                  <Button
                    onClick={() => navigate(`/login?returnUrl=${encodeURIComponent(`/products/${id}`)}`)}
                    variant="primary"
                    className="w-full"
                  >
                    <FaShoppingCart className="mr-2" />
                    Войти для покупки
                  </Button>
                ) : product.stock_quantity !== undefined && product.stock_quantity <= 0 ? (
                  <Button
                    disabled
                    variant="outline"
                    className="w-full"
                  >
                    Нет в наличии
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

