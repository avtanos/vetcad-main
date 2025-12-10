
import { memo } from 'react';
import { motion } from 'framer-motion';
import { FaSyringe, FaBone, FaCalendarCheck, FaTrash, FaCheckCircle, FaEdit } from 'react-icons/fa';
import { Reminder } from '../model/types';
import { Button } from '@/shared/ui/Button'; 

interface ReminderCardProps {
    reminder: Reminder;
    onUpdateStatus: (id: string, status: Reminder['status']) => void;
    onDelete: (id: string) => void;
}

const getIconForReminder = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('прививка') || lowerText.includes('вакцинация')) return <FaSyringe />;
    if (lowerText.includes('корм')) return <FaBone />;
    return <FaCalendarCheck />;
};

export const ReminderCard = memo(({ reminder, onUpdateStatus, onDelete }: ReminderCardProps) => {
    const isDone = reminder.status === 'Сделано';
    const cardDate = new Date(reminder.date);
    const day = cardDate.toLocaleDateString('ru-RU', { day: '2-digit' });
    const month = cardDate.toLocaleDateString('ru-RU', { month: 'short' });

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'spring' }}
            className={`flex items-start gap-4 p-4 bg-white rounded-xl shadow-md border-l-4 transition-colors ${isDone ? 'border-green-400 bg-green-50/50' : 'border-teal-400'}`}
        >
            <div className="flex flex-col items-center justify-center w-16 text-center flex-shrink-0">
                <p className="text-xs font-bold text-teal-600 uppercase">{month.replace('.', '')}</p>
                <p className="text-3xl font-extrabold text-slate-800">{day}</p>
            </div>

            <div className="flex-grow">
                <p className={`font-semibold text-slate-800 ${isDone ? 'line-through text-slate-500' : ''}`}>
                    {reminder.assistant_sms}
                </p>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                    <div className={`p-1 rounded-full ${isDone ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                        {getIconForReminder(reminder.assistant_sms)}
                    </div>
                    <span>{reminder.animalName}</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {!isDone && (
                    <Button variant="ghost" className="p-2 h-8 w-8 !shadow-none" onClick={() => onUpdateStatus(reminder.id, 'Сделано')}>
                        <FaCheckCircle className="text-green-500" />
                    </Button>
                )}
                <Button variant="ghost" className="p-2 h-8 w-8 !shadow-none" >
                    <FaEdit className="text-slate-400" />
                </Button>
                <Button variant="ghost" className="p-2 h-8 w-8 !shadow-none" onClick={() => onDelete(reminder.id)}>
                    <FaTrash className="text-red-400" />
                </Button>
            </div>
        </motion.div>
    );
});