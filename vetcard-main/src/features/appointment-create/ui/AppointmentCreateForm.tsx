import { useState, useEffect } from 'react';
import { api } from '@/shared/api';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/input';
import { usePets } from '@/entities/pet/model/PetContext';

interface AppointmentCreateFormProps {
  vetId: number;
  onSave: () => void;
  onCancel: () => void;
}

interface Pet {
  id: number;
  name: string;
}

export const AppointmentCreateForm = ({ vetId, onSave, onCancel }: AppointmentCreateFormProps) => {
  const { pets } = usePets();
  const [petId, setPetId] = useState<number | ''>('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Устанавливаем минимальную дату (сегодня)
    const today = new Date().toISOString().split('T')[0];
    setAppointmentDate(today);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!petId || !appointmentDate || !appointmentTime) {
      setError('Заполните все обязательные поля');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Объединяем дату и время
      const datetime = `${appointmentDate}T${appointmentTime}:00`;
      
      await api.post('/v1/owner/appointments/', {
        vet_id: vetId,
        pet_id: Number(petId),
        appointment_date: datetime,
        reason: reason || null
      });

      onSave();
    } catch (e: any) {
      setError(e.message || 'Ошибка при создании записи');
    } finally {
      setLoading(false);
    }
  };

  if (pets.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">У вас нет питомцев. Сначала добавьте питомца.</p>
        <Button type="button" onClick={onCancel} className="mt-4">
          Закрыть
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Питомец <span className="text-red-500">*</span>
        </label>
        <select
          value={petId}
          onChange={(e) => setPetId(e.target.value ? Number(e.target.value) : '')}
          className="w-full border border-slate-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
        >
          <option value="">Выберите питомца</option>
          {pets.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Дата <span className="text-red-500">*</span>
          </label>
          <Input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Время <span className="text-red-500">*</span>
          </label>
          <Input
            type="time"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Причина визита
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Опишите причину визита..."
          className="w-full border border-slate-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[80px]"
        />
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
          {loading ? 'Создание...' : 'Создать запись'}
        </Button>
      </div>
    </form>
  );
};

