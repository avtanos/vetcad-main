import React, { useState } from 'react';
import type { User } from '@/entities/user/model/types';
import { api } from '@/shared/api';
import { Button } from '@/shared/ui/Button';

const EditField = ({ label, name, value, onChange, placeholder }: { label:string, name:string, value?:string | null, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?:string }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <input
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
            placeholder={placeholder || label}
            autoComplete="off"
        />
    </div>
);

export const EditUserProfileForm: React.FC<{ user: User; onSave: (user: User) => void; onCancel: () => void }> = ({ user, onSave, onCancel }) => {
  const [form, setForm] = useState({ ...user });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem('authToken');
      const updated = await api.put<typeof form, User>(`/v1/auth/profile/${user.id}/`, form, accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined);
      onSave(updated);
    } catch (e) {
      setError('Ошибка при сохранении');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-lg space-y-6 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900">Редактирование профиля</h2>
        
        {error && <div className="text-red-500 text-sm text-center bg-red-100 p-3 rounded-lg">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EditField label="Имя" name="first_name" value={form.first_name} onChange={handleChange} />
            <EditField label="Фамилия" name="last_name" value={form.last_name} onChange={handleChange} />
            <EditField label="Отчество" name="third_name" value={form.third_name} onChange={handleChange} />
            <EditField label="Телефон" name="phone" value={form.phone} onChange={handleChange} placeholder="+996 (999) 123-45-67" />
            <EditField label="Город" name="city" value={form.city} onChange={handleChange} />
            <EditField label="Адрес" name="address" value={form.address} onChange={handleChange} />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200/80">
            <Button type="button" variant="outline" onClick={onCancel}>Отмена</Button>
            <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
        </div>
    </form>
);
};

  