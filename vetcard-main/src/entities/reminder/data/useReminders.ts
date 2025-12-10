import { useState, useCallback } from 'react';
import { api } from '@/shared/api';
import type { Reminder } from '../model/types';

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReminders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem('authToken');
      const data = await api.get<any[]>('/v1/assistant/reminder/', accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined);
      const mapped = data.map((item: any) => ({
        id: String(item.id),
        animalName: item.animalName || '',
        event: item.assistant_sms,
        date: item.date_assistant,
        status: item.status ? ('Запланировано' as const) : ('Сделано' as const),
      }));
      setReminders(mapped);
    } catch (e: any) {
      setError(e.message || 'Ошибка загрузки напоминаний');
      setReminders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { reminders, loading, error, fetchReminders, setReminders };
} 