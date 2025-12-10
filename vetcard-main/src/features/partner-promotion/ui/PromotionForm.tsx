import { useState, useEffect } from 'react';
import { api } from '@/shared/api';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/input';

interface Product {
  id: number;
  name_ru: string;
}

interface Service {
  id: number;
  name_ru: string;
}

interface Promotion {
  title: string;
  description?: string;
  discount_percent?: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  product_id?: number;
  service_id?: number;
}

interface PromotionFormProps {
  onSave: (promotion: Promotion) => Promise<void>;
  onCancel: () => void;
  initialData?: Promotion | null;
}

export const PromotionForm = ({ onSave, onCancel, initialData }: PromotionFormProps) => {
  const [formData, setFormData] = useState<Promotion>({
    title: '',
    description: '',
    discount_percent: undefined,
    start_date: '',
    end_date: '',
    is_active: true,
    product_id: undefined,
    service_id: undefined
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promotionType, setPromotionType] = useState<'none' | 'product' | 'service'>('none');

  useEffect(() => {
    loadProductsAndServices();
  }, []);

  useEffect(() => {
    if (initialData) {
      const formatDate = (date: string | Date) => {
        const d = new Date(date);
        return d.toISOString().slice(0, 16);
      };
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        discount_percent: initialData.discount_percent,
        start_date: formatDate(initialData.start_date),
        end_date: formatDate(initialData.end_date),
        is_active: initialData.is_active ?? true,
        product_id: initialData.product_id,
        service_id: initialData.service_id
      });
      
      if (initialData.product_id) {
        setPromotionType('product');
      } else if (initialData.service_id) {
        setPromotionType('service');
      } else {
        setPromotionType('none');
      }
    }
  }, [initialData]);

  const loadProductsAndServices = async () => {
    setLoadingData(true);
    try {
      const [productsData, servicesData] = await Promise.all([
        api.get<Product[]>('/v1/reference/ref_shop/my/').catch(() => []),
        api.get<Service[]>('/v1/partner/services').catch(() => [])
      ]);
      setProducts(productsData);
      setServices(servicesData);
    } catch (e) {
      console.error('Ошибка загрузки товаров и услуг:', e);
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value ? parseInt(value) : undefined }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Название акции обязательно для заполнения');
      return;
    }

    if (!formData.start_date || !formData.end_date) {
      setError('Укажите даты начала и окончания акции');
      return;
    }

    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      setError('Дата окончания должна быть позже даты начала');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Преобразуем даты в формат ISO для отправки на сервер
      const promotionData = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString()
      };
      await onSave(promotionData);
    } catch (e: any) {
      setError(e.message || 'Ошибка при сохранении акции');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Название акции *"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Скидка 20% на все услуги"
        required
      />

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Описание
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Подробное описание акции..."
        />
      </div>

      <Input
        label="Скидка (%)"
        name="discount_percent"
        type="number"
        min="0"
        max="100"
        value={formData.discount_percent || ''}
        onChange={handleChange}
        placeholder="20"
      />

      {/* Привязка к товару или услуге */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Привязать акцию к:
        </label>
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="radio"
              id="promotion_none"
              name="promotion_type"
              checked={promotionType === 'none'}
              onChange={() => {
                setPromotionType('none');
                setFormData({ ...formData, product_id: undefined, service_id: undefined });
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <label htmlFor="promotion_none" className="ml-2 block text-sm text-slate-700">
              Без привязки
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="radio"
              id="promotion_product"
              name="promotion_type"
              checked={promotionType === 'product'}
              onChange={() => {
                setPromotionType('product');
                setFormData({ ...formData, service_id: undefined });
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <label htmlFor="promotion_product" className="ml-2 block text-sm text-slate-700">
              Товар
            </label>
          </div>
          
          {promotionType === 'product' && (
            <div className="ml-6">
              <select
                value={formData.product_id || ''}
                onChange={(e) => setFormData({ ...formData, product_id: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={loadingData}
              >
                <option value="">Выберите товар</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.name_ru}</option>
                ))}
              </select>
              {products.length === 0 && !loadingData && (
                <p className="text-xs text-slate-500 mt-1">У вас пока нет товаров</p>
              )}
            </div>
          )}
          
          <div className="flex items-center">
            <input
              type="radio"
              id="promotion_service"
              name="promotion_type"
              checked={promotionType === 'service'}
              onChange={() => {
                setPromotionType('service');
                setFormData({ ...formData, product_id: undefined });
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <label htmlFor="promotion_service" className="ml-2 block text-sm text-slate-700">
              Услуга
            </label>
          </div>
          
          {promotionType === 'service' && (
            <div className="ml-6">
              <select
                value={formData.service_id || ''}
                onChange={(e) => setFormData({ ...formData, service_id: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={loadingData}
              >
                <option value="">Выберите услугу</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>{service.name_ru}</option>
                ))}
              </select>
              {services.length === 0 && !loadingData && (
                <p className="text-xs text-slate-500 mt-1">У вас пока нет услуг</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Дата начала *"
          name="start_date"
          type="datetime-local"
          value={formData.start_date}
          onChange={handleChange}
          required
        />
        <Input
          label="Дата окончания *"
          name="end_date"
          type="datetime-local"
          value={formData.end_date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_active"
          name="is_active"
          checked={formData.is_active}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-slate-700">
          Активна
        </label>
      </div>

      {error && (
        <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Отмена
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Сохранение...' : initialData ? 'Сохранить изменения' : 'Создать акцию'}
        </Button>
      </div>
    </form>
  );
};

