import { useEffect, useState } from 'react';
import type { Product } from '@/entities/product/model/ProductTypes';
import { ProductCard } from '@/entities/product/ui/ProductCard';
import { AddProductForm } from '@/features/add-product/ui/AddProductForm';
import { api } from '@/shared/api';
import { useUserStore } from '@/entities/user/model/user-store';

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserStore();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get<Product[]>('/v1/reference/ref_shop/');
        setProducts(data);
      } catch (e: any) {
        setError(e.message || 'Ошибка загрузки товаров');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async (product: Omit<Product, 'id'>) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const newProduct = await api.post<Omit<Product, 'id'>, Product>('/v1/reference/ref_shop/', product);
      setProducts(prev => [newProduct, ...prev]);
    } catch (e: any) {
      setError(e.message || 'Ошибка добавления товара');
    } finally {
      setLoading(false);
    }
  };

  const userRole = user?.role;
  const userId = user?.id;

  let visibleProducts = products;
  if (userRole === 3 && userId) {
    visibleProducts = products.filter(p => p.user === userId);
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Товары</h1>
      {userRole === 3 && userId && <AddProductForm onAdd={handleAddProduct} userId={userId} />}
      {loading && <div className="text-center text-slate-500">Загрузка...</div>}
      {error && <div className="text-center text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {visibleProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
