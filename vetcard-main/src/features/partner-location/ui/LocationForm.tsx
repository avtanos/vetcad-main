import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/input';

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface LocationFormProps {
  onSave: (location: Location) => Promise<void>;
  onCancel: () => void;
  initialData?: Location | null;
}

export const LocationForm = ({ onSave, onCancel, initialData }: LocationFormProps) => {
  const [formData, setFormData] = useState<Location>({
    latitude: 0,
    longitude: 0,
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        latitude: initialData.latitude || 0,
        longitude: initialData.longitude || 0,
        address: initialData.address || ''
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'latitude' || name === 'longitude' ? parseFloat(value) || 0 : value }));
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        () => {
          setError('Не удалось получить текущее местоположение');
        }
      );
    } else {
      setError('Геолокация не поддерживается вашим браузером');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.latitude || !formData.longitude) {
      setError('Укажите координаты или используйте текущее местоположение');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSave(formData);
    } catch (e: any) {
      setError(e.message || 'Ошибка при сохранении геолокации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Широта (latitude) *"
          name="latitude"
          type="number"
          step="any"
          value={formData.latitude}
          onChange={handleChange}
          placeholder="42.8746"
          required
        />
        <Input
          label="Долгота (longitude) *"
          name="longitude"
          type="number"
          step="any"
          value={formData.longitude}
          onChange={handleChange}
          placeholder="74.5698"
          required
        />
      </div>

      <div>
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Использовать текущее местоположение
        </button>
      </div>

      <Input
        label="Адрес"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="г. Бишкек, ул. Примерная, д. 1"
      />

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

