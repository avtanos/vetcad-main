import { FaTrash } from 'react-icons/fa';
import { usePets } from '@/entities/pet/model/PetContext';
import { api } from '@/shared/api';

export const DeletePetButton = ({ petId, petName }: { petId: string, petName: string }) => {
    const { removePet } = usePets();

    const handleDelete = async () => {
        if (window.confirm(`Вы уверены, что хотите удалить профиль питомца по имени ${petName}?`)) {
            try {
                const accessToken = localStorage.getItem('authToken');
                const userFromStorage = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
                const userId = userFromStorage?.user || userFromStorage?.id;

                await api.delete(
                    `/v1/pet/${petId}/`,
                    { user: userId },
                    { Authorization: `Bearer ${accessToken}` }
                );
                removePet(petId);
            } catch (error) {
            }
        }
    };

    return (
        <button onClick={handleDelete} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
            <FaTrash className="mr-3" /> Удалить
        </button>
    );
}