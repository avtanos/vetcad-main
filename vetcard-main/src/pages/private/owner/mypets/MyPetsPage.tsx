import { PetList } from '@/entities/pet/ui/PetList';
import { AddPetButton } from '@/features/add-pet/ui/AddPetButton';
import { usePets } from '@/entities/pet/model/PetContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const MyPetsPage = () => {
    const { pets } = usePets();
    const { t } = useTranslation();

    return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
            <motion.header
              className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
                <div>
                    <motion.h1
                      className="text-3xl font-bold text-slate-900"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      {t ("myPetsPage.myPets")}
                    </motion.h1>
                    <motion.p
                      className="mt-1 text-slate-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {t ("myPetsPage.controlText")}
                    </motion.p>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Link to="/add-pet">
                    <AddPetButton />
                  </Link>
                </motion.div>
            </motion.header>
            <PetList pets={pets} />
        </motion.div>
    );
};