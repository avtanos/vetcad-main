import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/input';

interface Service {
  name_ru: string;
  name_kg?: string;
  description?: string;
  price?: number;
  duration_minutes?: number;
  is_active: boolean;
}

interface ServiceFormProps {
  onSave: (service: Service) => Promise<void>;
  onCancel: () => void;
  initialData?: Service | null;
}

export const ServiceForm = ({ onSave, onCancel, initialData }: ServiceFormProps) => {
  const [formData, setFormData] = useState<Service>({
    name_ru: '',
    name_kg: '',
    description: '',
    price: undefined,
    duration_minutes: undefined,
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name_ru: initialData.name_ru || '',
        name_kg: initialData.name_kg || '',
        description: initialData.description || '',
        price: initialData.price,
        duration_minutes: initialData.duration_minutes,
        is_active: initialData.is_active ?? true
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value ? parseFloat(value) : undefined }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name_ru.trim()) {
      setError('Название услуги обязательно для заполнения');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSave(formData);
    } catch (e: any) {
      setError(e.message || 'Ошибка при сохранении услуги');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Название услуги (RU) *"
        name="name_ru"
        value={formData.name_ru}
        onChange={handleChange}
        placeholder="Консультация ветеринара"
        required
      />

      <Input
        label="Название услуги (KG)"
        name="name_kg"
        value={formData.name_kg}
        onChange={handleChange}
        placeholder="Ветеринардын консультациясы"
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
          placeholder="Подробное описание услуги..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Цена (сом)"
          name="price"
          type="number"
          step="0.01"
          value={formData.price || ''}
          onChange={handleChange}
          placeholder="1000"
        />
        <Input
          label="Длительность (минуты)"
          name="duration_minutes"
          type="number"
          value={formData.duration_minutes || ''}
          onChange={handleChange}
          placeholder="30"
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
          {loading ? 'Сохранение...' : initialData ? 'Сохранить изменения' : 'Добавить услугу'}
        </Button>
      </div>
    </form>
  );
};

