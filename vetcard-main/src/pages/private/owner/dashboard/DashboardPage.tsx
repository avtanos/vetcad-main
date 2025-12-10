import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { usePets } from '@/entities/pet/model/PetContext';
import { useReminders } from '@/entities/reminder/data/useReminders';
import { StatCard } from '@/features/dashboard/ui/StatCard';
import { QuickActionsWidget } from '@/features/dashboard/ui/QuickActionsWidget';
import { UpcomingRemindersWidget } from '@/entities/reminder/ui/UpcomingRemindersWidget';

const useUser = () => {
    const { pets } = usePets();
    let name = 'Пользователь';
    if (typeof window !== 'undefined') {
        const userFromStorage = JSON.parse(localStorage.getItem('user') || 'null');
        if (userFromStorage && userFromStorage.name) {
            name = userFromStorage.name;
        } else if (userFromStorage && userFromStorage.first_name) {
            name = userFromStorage.first_name;
        }
    }
    const petsCount = pets.length;
    return { name, petsCount };
};

export const DashboardPage = () => {
    const { name, petsCount } = useUser();
    const { t } = useTranslation();
    const { reminders, fetchReminders } = useReminders();

    useEffect(() => {
        fetchReminders();
    }, [fetchReminders]);

    const remindersCount = reminders.filter(r => r.status === 'Запланировано').length;
    const today = new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
            <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{t("dashboard.welcome", { name })}</h1>
                    <p className="mt-1 text-slate-500 capitalize">{today}</p>
                </div>
            </header>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.13 } },
              }}
            >
                <StatCard 
                    icon={<i className="fa fa-paw" />} 
                    title={t("dashboard.pets")} 
                    value={petsCount} 
                    color="bg-teal-50 text-teal-600" 
                    to="/mypets"
                    custom={0}
                />
                <StatCard 
                    icon={<i className="fa fa-bell" />} 
                    title={t("dashboard.events")} 
                    value={remindersCount} 
                    color="bg-amber-50 text-amber-600" 
                    to="/reminders"
                    custom={1}
                />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    <UpcomingRemindersWidget />
                </div>
                <div>
                    <QuickActionsWidget />
                </div>
            </div>
        </motion.div>
    );
};
