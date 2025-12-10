import React, { useState } from 'react';
import { api } from '@/shared/api';

export const PartnerProductsManager = () => {
  const partnerProducts = [
    { id: 1, name: 'Товар 1', description: 'Описание товара 1' },
    { id: 2, name: 'Товар 2', description: 'Описание товара 2' },
  ];

  const [form, setForm] = useState({
    name_ru: '',
    name_kg: '',
    description: '',
    is_active: true,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userFromStorage = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
      const userId = userFromStorage?.user || userFromStorage?.id || 0;
      await api.post('/reference/ref_shop/', {
        ...form,
        user: userId,
        is_active: true,
      });
      setForm({ name_ru: '', name_kg: '', description: '', is_active: true });
      alert('Товар успешно создан!');
    } catch (e: any) {
      alert('Ошибка при создании товара');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Мои товары</h1>
      <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-white p-4 rounded shadow">
        <input
          name="name_ru"
          value={form.name_ru}
          onChange={handleChange}
          placeholder="Название (рус)"
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          name="name_kg"
          value={form.name_kg}
          onChange={handleChange}
          placeholder="Название (кырг)"
          className="w-full border rounded px-3 py-2"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Описание"
          className="w-full border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
          disabled={loading}
        >
          {loading ? 'Создание...' : 'Создать товар'}
        </button>
      </form>
      <ul className="space-y-4">
        {partnerProducts.map(product => (
          <li key={product.id} className="p-4 border rounded shadow bg-white">
            <div className="font-semibold">{product.name}</div>
            <div className="text-slate-600">{product.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}; 