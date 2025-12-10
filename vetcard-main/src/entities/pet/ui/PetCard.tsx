import { memo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEllipsisV, FaBirthdayCake, FaWeightHanging, FaRegStickyNote, FaUndoAlt } from 'react-icons/fa';
import type { Pet } from '../model/types';
import { EditPetButton } from '@/features/edit-pet/ui/EditPetButton';
import { DeletePetButton } from '@/features/delete-pet/ui/DeletePetButton';
import { usePets } from '@/entities/pet/model/PetContext';

const calculateAge = (dateOfBirth: string): string => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  if (age % 10 === 1 && age % 100 !== 11) return `${age} год`;
  if ([2, 3, 4].includes(age % 10) && ![12, 13, 14].includes(age % 100)) return `${age} года`;
  return `${age} лет`;
};

const gradients = [
 'from-slate-700 to-gray-800',
    'from-sky-800 to-indigo-900',
    'from-purple-800 to-violet-900',
    'from-teal-700 to-emerald-800',
    'from-rose-800 to-red-900',
];

export const PetCard = memo(({ pet }: { pet: Pet }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { speciesDict } = usePets();
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const age = calculateAge(pet.birth_date);

  const cardGradient = gradients[Number(pet.id) % gradients.length];

  const handleFlip = (e: React.MouseEvent) => {
    if (menuRef.current && menuRef.current.contains(e.target as Node)) {
      return;
    }
    if (pet.special_notes) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div className="w-full h-[450px] [perspective:1000px]">
      <div ref={menuRef} className="absolute top-4 right-4 z-20">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors backdrop-blur-sm">
          <FaEllipsisV />
        </button>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-20"
            >
              <EditPetButton petId={pet.id} />
              <DeletePetButton petId={pet.id} petName={pet.name} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className="relative w-full h-full [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        onClick={handleFlip}
      >
        <div className="absolute w-full h-full bg-white rounded-xl shadow-lg overflow-hidden [backface-visibility:hidden]">
          {(!pet.image_url || imgError) ? (
            <div className="h-56 w-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
              <span className="text-6xl font-bold text-slate-400 drop-shadow">{pet.name?.[0]?.toUpperCase() || '?'}</span>
            </div>
          ) : (
            <img className="h-56 w-full object-cover" src={pet.image_url} onError={() => setImgError(true)} alt={pet.name} />
          )}
          <div className="p-6">
            <p className="text-sm font-semibold text-teal-500">{speciesDict[pet.species] || pet.species}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{pet.name}</h3>
            <p className="text-slate-600">{pet.breed}</p>

            <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col space-y-3 text-sm">
              <div className="flex items-center text-slate-500"><FaBirthdayCake className="mr-3 text-slate-400" /> {age}</div>
              <div className="flex items-center text-slate-500"><FaWeightHanging className="mr-3 text-slate-400" /> {pet.weight} кг</div>
            </div>
          </div>
          {pet.special_notes && (
            <div className="absolute bottom-4 right-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold">
                <FaRegStickyNote />
                <span>Заметки</span>
              </div>
            </div>
          )}
        </div>

        {/* === ОБРАТНАЯ СТОРОНА КАРТОЧКИ (ЗАМЕТКИ) === */}
        <div className={`absolute w-full h-full bg-gradient-to-br ${cardGradient} rounded-xl shadow-lg p-6 flex flex-col [transform:rotateY(180deg)] [backface-visibility:hidden]`}>
    <div className="flex justify-between items-center text-white mb-4 flex-shrink-0">
        <h4 className="text-lg font-bold flex items-center gap-2"><FaRegStickyNote /> Особые заметки</h4>
        <button className="p-1 rounded-full hover:bg-white/20" onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}>
            <FaUndoAlt size={14} />
        </button>
    </div>
    

    <div className="flex-grow overflow-y-auto text-white/90 text-sm leading-relaxed pr-2
                  [&::-webkit-scrollbar]:w-1.5 
                  [&::-webkit-scrollbar-track]:bg-white/10
                  [&::-webkit-scrollbar-thumb]:bg-white/40
                  [&::-webkit-scrollbar-thumb]:rounded-full">
        {pet.special_notes}
    </div>
</div>
      </motion.div>
    </div>
  );
});