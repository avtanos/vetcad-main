
import type { Pet } from "../model/types";
import { PetCard } from "./PetCard";
import { motion, AnimatePresence } from 'framer-motion';

interface PetListProps {
    pets: Pet[];
}

export const PetList = ({ pets }: PetListProps) => {
    return (
      <AnimatePresence mode="wait">
        {pets.length === 0 ? (
          <motion.div
            key="no-pets"
            className="text-center py-12 bg-slate-100 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-medium text-slate-700">У вас пока нет питомцев</h3>
            <p className="text-slate-500 mt-2">Нажмите "Добавить питомца", чтобы создать первую карточку.</p>
          </motion.div>
        ) : (
          <motion.div
            key="pet-list"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              visible: { transition: { staggerChildren: 0.13 } },
              hidden: {},
            }}
          >
            <AnimatePresence>
              {pets.map(pet => (
                <motion.div
                  key={pet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <PetCard pet={pet} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    );
};