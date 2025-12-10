import { motion } from 'framer-motion';
import { Button } from '@/shared/ui/Button';
import { FaPlus } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import React from 'react';

export const QuickActionsWidget: React.FC = () => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="bg-white p-6 rounded-2xl shadow-lg h-full"
    >
      <h3 className="font-bold text-slate-800 mb-4">{t('dashboard.quickActions')}</h3>
      <div className="space-y-3">
        <Button to="/add-pet" variant="outline" className="w-full justify-start text-left text-base py-3">
          <FaPlus className="mr-3 text-teal-500" /> {t('dashboard.addPet')}
        </Button>
        <Button to="/assistant" variant="outline" className="w-full justify-start text-left text-base py-3">
          <FaPlus className="mr-3 text-indigo-500" /> {t('dashboard.chatWithAI', { defaultValue: 'Чат с ИИ' })}
        </Button>
        <Button to="/products" variant="outline" className="w-full justify-start text-left text-base py-3">
          <FaPlus className="mr-3 text-amber-500" /> {t('dashboard.products', { defaultValue: 'Товары' })}
        </Button>
      </div>
    </motion.div>
  );
} 