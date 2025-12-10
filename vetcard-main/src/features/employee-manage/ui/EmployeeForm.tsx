import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/input';

interface Employee {
  id?: number;
  first_name: string;
  last_name?: string;
  position?: string;
  specialization?: string;
  phone?: string;
  email?: string;
  photo_url?: string;
  is_active: boolean;
}

interface EmployeeFormProps {
  onSave: (employee: Omit<Employee, 'id'>) => Promise<void>;
  onCancel: () => void;
  initialData?: Employee | null;
}

export const EmployeeForm = ({ onSave, onCancel, initialData }: EmployeeFormProps) => {
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    first_name: '',
    last_name: '',
    position: '',
    specialization: '',
    phone: '',
    email: '',
    photo_url: '',
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        position: initialData.position || '',
        specialization: initialData.specialization || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        photo_url: initialData.photo_url || '',
        is_active: initialData.is_active ?? true
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.first_name.trim()) {
      setError('Имя обязательно для заполнения');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSave(formData);
    } catch (e: any) {
      setError(e.message || 'Ошибка при сохранении сотрудника');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Имя *"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="Иван"
          required
        />
        <Input
          label="Фамилия"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Иванов"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Должность"
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="Ветеринарный врач"
        />
        <Input
          label="Специализация"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          placeholder="Терапевт, хирург и т.д."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Телефон"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+996 (555) 123-45-67"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="employee@example.com"
        />
      </div>

      <Input
        label="Фото (URL)"
        name="photo_url"
        value={formData.photo_url}
        onChange={handleChange}
        placeholder="https://example.com/photo.jpg"
      />

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_active"
          name="is_active"
          checked={formData.is_active}
          onChange={handleCheckboxChange}
          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-slate-700">
          Активен
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
          {loading ? 'Сохранение...' : initialData ? 'Сохранить изменения' : 'Добавить сотрудника'}
        </Button>
      </div>
    </form>
  );
};

