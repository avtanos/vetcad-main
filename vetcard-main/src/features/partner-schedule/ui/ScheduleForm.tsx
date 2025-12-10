import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/input';

interface Schedule {
  day_of_week: number;
  open_time?: string;
  close_time?: string;
  is_closed: boolean;
}

interface ScheduleFormProps {
  onSave: (schedule: Schedule) => Promise<void>;
  onCancel: () => void;
  initialData?: Schedule | null;
}

const DAYS_OF_WEEK = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

export const ScheduleForm = ({ onSave, onCancel, initialData }: ScheduleFormProps) => {
  const [formData, setFormData] = useState<Schedule>({
    day_of_week: 0,
    open_time: '',
    close_time: '',
    is_closed: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        day_of_week: initialData.day_of_week,
        open_time: initialData.open_time || '',
        close_time: initialData.close_time || '',
        is_closed: initialData.is_closed || false
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.is_closed && (!formData.open_time || !formData.close_time)) {
      setError('Укажите время работы или отметьте день как выходной');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSave(formData);
    } catch (e: any) {
      setError(e.message || 'Ошибка при сохранении графика');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          День недели
        </label>
        <select
          name="day_of_week"
          value={formData.day_of_week}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={!!initialData}
        >
          {DAYS_OF_WEEK.map((day, index) => (
            <option key={index} value={index}>{day}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_closed"
          name="is_closed"
          checked={formData.is_closed}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
        />
        <label htmlFor="is_closed" className="ml-2 block text-sm text-slate-700">
          Выходной день
        </label>
      </div>

      {!formData.is_closed && (
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Время открытия"
            name="open_time"
            type="time"
            value={formData.open_time}
            onChange={handleChange}
            required={!formData.is_closed}
          />
          <Input
            label="Время закрытия"
            name="close_time"
            type="time"
            value={formData.close_time}
            onChange={handleChange}
            required={!formData.is_closed}
          />
        </div>
      )}

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
          {loading ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>
    </form>
  );
};

