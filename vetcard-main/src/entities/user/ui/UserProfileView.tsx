import React from 'react';
import type { User } from '@/entities/user/model/types';
import { motion } from 'framer-motion';
import { FaUserEdit, FaPhone, FaMapMarkerAlt, FaHome } from 'react-icons/fa';
import { Button } from '@/shared/ui/Button';

const BentoBox = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
        }}
        className={`bg-slate-50 border border-slate-200/90 rounded-2xl p-6 ${className}`}
    >
        {children}
    </motion.div>
);

export const UserProfileView: React.FC<{ user: User; onEdit: () => void }> = ({ user, onEdit }) => {
    const fullName = [user.last_name, user.first_name].filter(Boolean).join(' ');
    const initials = (user.first_name?.[0] || '') + (user.last_name?.[0] || '');

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
                },
            }}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
            <BentoBox className="sm:col-span-2 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="w-24 h-24 rounded-full bg-teal-100 flex-shrink-0 border-4 border-white shadow-md flex items-center justify-center">
                    {user.logo ? (
                        <img 
                            src={user.logo} 
                            alt="avatar" 
                            className="w-full h-full rounded-full object-cover" 
                        />
                    ) : (
                        <span className="text-3xl font-bold text-teal-600">{initials}</span>
                    )}
                </div>
                <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">{fullName}</h1>
                        <p className="text-slate-500 mt-1">{user.email}</p>
                    </div>
                    <Button variant="primary" className="mt-4 sm:mt-0 sm:ml-4" onClick={onEdit}>
                        <FaUserEdit className="mr-2" />
                        Редактировать профиль
                    </Button>
                </div>
            </BentoBox>

            <BentoBox>
                <h3 className="text-sm font-semibold text-slate-500 mb-2 flex items-center gap-2">
                    <FaPhone /> Телефон
                </h3>
                <p className="text-lg font-semibold text-slate-800">{user.phone || 'Не указан'}</p>
            </BentoBox>

            <BentoBox>
                 <h3 className="text-sm font-semibold text-slate-500 mb-2 flex items-center gap-2">
                    <FaMapMarkerAlt /> Город
                </h3>
                <p className="text-lg font-semibold text-slate-800">{user.city || 'Не указан'}</p>
            </BentoBox>

            <BentoBox className="sm:col-span-2">
                 <h3 className="text-sm font-semibold text-slate-500 mb-2 flex items-center gap-2">
                    <FaHome /> Адрес
                </h3>
                <p className="text-lg font-semibold text-slate-800">{user.address || 'Не указан'}</p>
            </BentoBox>

        </motion.div>
    );
};