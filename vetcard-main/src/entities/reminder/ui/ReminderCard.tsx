
import { memo } from 'react';
import { motion } from 'framer-motion';
import { FaSyringe, FaBone, FaCalendarCheck, FaTrash, FaCheckCircle, FaEdit } from 'react-icons/fa';
import { Reminder, ReminderStatus } from '../model/types';

interface ReminderCardProps {
    reminder: Reminder;
    onUpdateStatus: (id: string, newStatus: ReminderStatus) => void;
    onDelete: (id: string) => void;
    onEdit: (reminder: Reminder) => void;
}

const getIconForEvent = (event: string) => {
    const lowerEvent = event.toLowerCase();
    if (lowerEvent.includes('прививка') || lowerEvent.includes('вакцинация')) return <FaSyringe />;
    if (lowerEvent.includes('корм')) return <FaBone />;
    if (lowerEvent.includes('стрижка') || lowerEvent.includes('груминг')) return <FaCalendarCheck />;
    return <FaCalendarCheck />;
};

export const ReminderCard = memo(({ reminder, onUpdateStatus, onDelete, onEdit }: ReminderCardProps) => {
    const isDone = reminder.status === 'Сделано';
    const cardDate = new Date(reminder.date);
    const day = cardDate.toLocaleDateString('ru-RU', { day: '2-digit' });
    const month = cardDate.toLocaleDateString('ru-RU', { month: 'short' }).replace('.', '');

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
            transition={{ type: 'spring' }}
            className={`flex items-start gap-4 p-4 bg-white rounded-xl shadow-md border-l-4 transition-colors ${isDone ? 'border-green-400 bg-slate-50' : 'border-teal-400'}`}
        >
            <div className="flex flex-col items-center justify-center w-16 text-center flex-shrink-0">
                <p className={`text-xs font-bold uppercase ${isDone ? 'text-slate-400' : 'text-teal-600'}`}>{month}</p>
                <p className={`text-3xl font-extrabold ${isDone ? 'text-slate-400' : 'text-slate-800'}`}>{day}</p>
            </div>

            <div className="flex-grow">
                <p className={`font-semibold ${isDone ? 'line-through text-slate-500' : 'text-slate-800'}`} title={reminder.event}>
                    {reminder.event}
                </p>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                    <div className={`p-1 rounded-full ${isDone ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                        {getIconForEvent(reminder.event)}
                    </div>
                    <span>{reminder.animalName}</span>
                </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
                {!isDone && (
                    <button
                        type="button"
                        title="Отметить выполненным"
                        onClick={() => onUpdateStatus(reminder.id, 'Сделано')}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-600 transition-colors hover:bg-green-200 hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                    >
                        <FaCheckCircle />
                    </button>
                )}
                <button
                    type="button"
                    title="Редактировать"
                    onClick={() => onEdit(reminder)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
                >
                    <FaEdit />
                </button>
                <button
                    type="button"
                    title="Удалить"
                    onClick={() => onDelete(reminder.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600 transition-colors hover:bg-red-200 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                >
                    <FaTrash />
                </button>
            </div>
        </motion.div>
    );
});