import { useState } from 'react';
import { Button } from '@/shared/ui/Button';

interface ConsultationAnswerFormProps {
  consultationId: number;
  onSave: (consultationId: number, answer: string) => Promise<void>;
  onCancel: () => void;
  initialAnswer?: string;
}

export const ConsultationAnswerForm = ({ 
  consultationId, 
  onSave, 
  onCancel,
  initialAnswer = '' 
}: ConsultationAnswerFormProps) => {
  const [answer, setAnswer] = useState(initialAnswer);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) {
      setError('Ответ не может быть пустым');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSave(consultationId, answer);
      setAnswer('');
    } catch (e: any) {
      setError(e.message || 'Ошибка при сохранении ответа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Ответ на консультацию
        </label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Введите ваш ответ..."
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
          {loading ? 'Сохранение...' : 'Отправить ответ'}
        </Button>
      </div>
    </form>
  );
};

