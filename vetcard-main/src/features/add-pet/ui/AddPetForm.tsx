import { useState, useRef, useEffect } from 'react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/Button';
import type { Pet } from '@/entities/pet/model/types';
import { useUserStore } from '@/entities/user/model/user-store';
import { api } from '@/shared/api';

type AddPetFormProps = {
    onAddPet: (pet: Pet) => void;
    onCancel: () => void;
};

export const AddPetForm: React.FC<AddPetFormProps> = ({ onAddPet, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        species: '',
        breed: '',
        birth_date: '',
        weight: '',
        notes: '',
        image_url: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user } = useUserStore();
    const userFromStorage = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
    const userId = userFromStorage?.user || user?.id;
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, image_url: e.target.value }));
        setImageFile(null);
        setPreview(e.target.value ? e.target.value : null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setFormData(prev => ({ ...prev, image_url: '' }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const accessToken = localStorage.getItem('authToken');
            if (!userId || !accessToken) {
                setError('Ошибка авторизации. Попробуйте войти заново.');
                setLoading(false);
                return;
            }
            await api.post(
                '/v1/pet/',
                {
                    name: formData.name,
                    birth_date: formData.birth_date,
                    image_url: formData.image_url,
                    special_notes: formData.notes,
                    type_of_animal: Number(formData.species),
                    user: userId
                },
                { Authorization: `Bearer ${accessToken}` }
            );
            setLoading(false);
            onAddPet({
                ...formData,
                id: Date.now().toString(),
                image_url: formData.image_url,
                weight: Number(formData.weight),
                species: Number(formData.species),
                special_notes: formData.notes,
            });
        } catch (e) {
            setError('Ошибка при добавлении питомца');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4">Основная информация</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Имя питомца" name="name" placeholder="Рекс" required value={formData.name} onChange={handleChange} />
                    <div>
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
                    </div>
                    <Input label="Порода" name="breed" placeholder="Немецкая овчарка" value={formData.breed} onChange={handleChange} />
                    <Input label="Дата рождения" name="birth_date" type="date" required value={formData.birth_date} onChange={handleChange} />
                    <Input label="Вес (кг)" name="weight" type="number" step="0.1" placeholder="32.5" value={formData.weight} onChange={handleChange} />
                </div>
            </div>

            <div>
                 <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4">Дополнительно</h3>
                 <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Фото питомца</label>
                            <div className="mt-1 flex items-center gap-5">
                                <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden relative">
                                    {preview ? (
                                        <>
                                            <img src={preview} alt="Pet preview" className="h-full w-full object-cover" />
                                            <button
                                                type="button"
                                                className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-slate-500 hover:text-red-500 shadow"
                                                onClick={() => {
                                                    setPreview(null);
                                                    setImageFile(null);
                                                    setFormData(prev => ({ ...prev, image_url: '' }));
                                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                                }}
                                                aria-label="Удалить фото"
                                            >
                                                ×
                                            </button>
                                        </>
                                    ) : (
                                        <span className="text-slate-400">Нет фото</span>
                                    )}
                                </div>
                                <label htmlFor="file-upload" className={`relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500 ${formData.image_url ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <span>{imageFile ? imageFile.name : 'Загрузить фото'}</span>
                                    <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        className="sr-only"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        ref={fileInputRef}
                                        disabled={!!formData.image_url}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="flex-1">
                            <Input
                                label="URL фотографии"
                                name="image_url"
                                placeholder="https://..."
                                value={formData.image_url}
                                onChange={handleImageUrlChange}
                                disabled={!!imageFile}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">Особые пометки</label>
                        <textarea id="notes" name="notes" rows={4} className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Аллергия на курицу, боится громких звуков..." value={formData.notes} onChange={handleChange}></textarea>
                    </div>
                </div>
            </div>
            
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                    Отмена
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Сохраняем...' : 'Сохранить питомца'}
                </Button>
            </div>
        </form>
    );
};