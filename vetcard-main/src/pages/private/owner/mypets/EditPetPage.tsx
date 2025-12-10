import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { usePets } from '@/entities/pet/model/PetContext';
import type { Pet } from '@/entities/pet/model/types';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/Button';
import { api } from '@/shared/api/index';

export const EditPetPage = () => {
  const { id } = useParams<{ id: string }>();
  const { pets, updatePet } = usePets();
  const navigate = useNavigate();

  const pet = pets.find(p => String(p.id) === String(id));
  const [formData, setFormData] = useState<Pet | null>(pet ? { ...pet } : null);
  const [speciesOptions, setSpeciesOptions] = useState<{ id: number; name_ru: string }[]>([]);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const data = await api.get<any[]>('/v1/reference/ref_type_of_animal/');
        setSpeciesOptions(data.filter((item: any) => item.is_active));
      } catch (e) {
        setSpeciesOptions([]);
      }
    };
    fetchSpecies();
  }, []);

  if (!formData) {
    return <div className="p-8">Питомец не найден</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : prev);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      try {
        const accessToken = localStorage.getItem('authToken');
        const userFromStorage = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
        const userId = userFromStorage?.user || userFromStorage?.id;

        await api.put(
          `/v1/pet/${formData.id}/`,
          {
            ...formData,
            user: userId,
          },
          { Authorization: `Bearer ${accessToken}` }
        );
        updatePet({ ...formData, user: userId });
        navigate('/mypets');
      } catch (error) {
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <h1 className="text-2xl font-bold mb-6">Редактировать питомца</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input label="Имя питомца" name="name" required value={formData.name} onChange={handleChange} />
        <label className="block text-sm font-medium text-slate-700 mb-1">Вид</label>
        <select
          name="species"
          required
          value={formData.species}
          onChange={handleSelectChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">Выберите вид</option>
          {speciesOptions.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.name_ru}</option>
          ))}
        </select>
        <Input label="Порода" name="breed" value={formData.breed} onChange={handleChange} />
        <Input label="Дата рождения" name="birth_date" type="date" required value={formData.birth_date} onChange={handleChange} />
        <Input label="Вес (кфг)" name="weight" type="number" step="0.1" value={formData.weight} onChange={handleChange} />
        <Input label="URL фотографии" name="image_url" value={formData.image_url} onChange={handleChange} />
        <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={() => navigate('/mypets')}>Отмена</Button>
          <Button type="submit" variant="primary">Сохранить изменения</Button>
        </div>
      </form>
    </div>
  );
}; 