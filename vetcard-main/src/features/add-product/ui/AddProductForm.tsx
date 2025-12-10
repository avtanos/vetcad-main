import React, { useState } from 'react';
import type { Product } from '@/entities/product/model/ProductTypes';

interface AddProductFormProps {
  onAdd: (product: Omit<Product, 'id'>) => void;
  userId: number;
}

export const AddProductForm: React.FC<AddProductFormProps> = ({ onAdd, userId }) => {
  const [name_ru, setNameRu] = useState('');
  const [name_kg, setNameKg] = useState('');
  const [description, setDescription] = useState('');
  const [img_url, setImgUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name_ru || !name_kg || !description || !img_url) return;
    onAdd({
      name_ru,
      name_kg,
      description,
      img_url,
      is_active: true,
      user: userId,
    });
    setNameRu('');
    setNameKg('');
    setDescription('');
    setImgUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col gap-3 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Название (рус)"
        value={name_ru}
        onChange={e => setNameRu(e.target.value)}
        className="border rounded px-3 py-2"
        required
      />
      <input
        type="text"
        placeholder="Название (кырг)"
        value={name_kg}
        onChange={e => setNameKg(e.target.value)}
        className="border rounded px-3 py-2"
        required
      />
      <textarea
        placeholder="Описание"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="border rounded px-3 py-2"
        required
      />
      <input
        type="text"
        placeholder="Ссылка на картинку (img_url)"
        value={img_url}
        onChange={e => setImgUrl(e.target.value)}
        className="border rounded px-3 py-2"
        required
      />
      <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition">Добавить товар</button>
    </form>
  );
}; 