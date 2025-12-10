import { FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const EditPetButton = ({ petId }: { petId: string }) => {
    const navigate = useNavigate();
    const handleEdit = () => navigate(`/mypets/edit/${petId}`);

    return (
        <button onClick={handleEdit} className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
            <FaEdit className="mr-3" /> Редактировать
        </button>
    );
}