import { useState, useEffect } from 'react';
import { api } from '@/shared/api';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/input';
import { usePets } from '@/entities/pet/model/PetContext';

interface ConsultationCreateFormProps {
  vetId: number;
  onSave: () => void;
  onCancel: () => void;
}

export const ConsultationCreateForm = ({ vetId, onSave, onCancel }: ConsultationCreateFormProps) => {
  const { pets } = usePets();
  const [petId, setPetId] = useState<number | ''>('');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!petId || !question.trim()) {
      setError('Заполните все обязательные поля');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post('/v1/owner/consultations/', {
        vet_id: vetId,
        pet_id: Number(petId),
        question: question.trim()
      });

      onSave();
    } catch (e: any) {
      setError(e.message || 'Ошибка при создании консультации');
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

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Вопрос <span className="text-red-500">*</span>
        </label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Опишите ваш вопрос или проблему..."
          className="w-full border border-slate-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[120px]"
          required
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
          {loading ? 'Отправка...' : 'Отправить вопрос'}
        </Button>
      </div>
    </form>
  );
};

