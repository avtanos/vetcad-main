import { useReminders } from '@/entities/reminder/data/useReminders';
import { Loader } from '@/shared/ui/Loader';
import { FaBell, FaCalendarCheck, FaSyringe, FaBone } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect } from 'react';

export const UpcomingRemindersWidget: React.FC = () => {
  const { t } = useTranslation();
  const { reminders, loading, error, fetchReminders } = useReminders();

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const upcoming = reminders
    .filter((reminder) => reminder.status === 'Запланировано')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  const getIconForReminder = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('прививка') || lowerText.includes('вакцинация')) return <FaSyringe />;
    if (lowerText.includes('корм')) return <FaBone />;
    return <FaCalendarCheck />;
  };

  if (loading) {
    return <div className="bg-white p-6 rounded-2xl shadow-lg text-center"><Loader /></div>;
  }
  if (error) {
    return <div className="bg-white p-6 rounded-2xl shadow-lg text-center text-red-500">{error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white p-6 rounded-2xl shadow-lg"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800">{t('dashboard.upcoming')}</h3>
        <Link to="/reminders" className="text-sm font-medium text-teal-600 hover:text-teal-500">{t('dashboard.all')}</Link>
      </div>
      <AnimatePresence>
        {upcoming.length > 0 ? (
          <motion.ul
            className="space-y-2"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.12 } },
            }}
          >
            {upcoming.map((reminder) => (
              <motion.li
                key={reminder.id}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="p-3 bg-slate-100 text-slate-500 rounded-full">
                  {getIconForReminder(reminder.event)}
                </div>
                <div className="flex-grow">
                  <p className="font-semibold text-slate-700">{reminder.event}</p>
                  <p className="text-xs text-slate-500">{t('dashboard.pet')}: {reminder.animalName}</p>
                </div>
                <div className="text-sm font-medium text-slate-800 text-right">
                  {new Date(reminder.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                </div>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FaBell className="mx-auto text-4xl text-slate-300 mb-2" />
            <p className="text-slate-500 text-sm">{t('dashboard.noReminders')}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}; 