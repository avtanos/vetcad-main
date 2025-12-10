
import { AddPetForm } from '@/features/add-pet/ui/AddPetForm';
import { FaPaw } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { usePets } from '@/entities/pet/model/PetContext';
import type { Pet } from '@/entities/pet/model/types';

export const AddPetPage = () => {
    const { addPet } = usePets();
    const navigate = useNavigate();

    const handleAddPet = (pet: Pet) => {
        addPet(pet);
        navigate('/mypets');
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900">
                    <FaPaw className="text-teal-500" />
                    Добавление нового питомца
                </h1>
                <p className="mt-2 text-slate-600">Заполните анкету, чтобы создать полный цифровой паспорт для вашего любимца.</p>
            </header>

            <div className="bg-white rounded-xl shadow-lg p-8">
                <AddPetForm onAddPet={handleAddPet} onCancel={() => navigate('/mypets')} />
            </div>
        </div>
    );
};