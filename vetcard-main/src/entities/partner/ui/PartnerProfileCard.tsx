import type { User } from '@/entities/user/model/types';
import { motion } from 'framer-motion';
import {
  Building,
  MapPin,
  Phone,
  Globe,
  FileText,
  UserCircle,
  BadgeInfo,
} from 'lucide-react';
import { InfoRow } from './InfoRow';

interface PartnerProfileCardProps {
  user: User;
}

export const PartnerProfileCard: React.FC<PartnerProfileCardProps> = ({ user }) => {
  const partner = user;
  const dataItems = [
    {
      label: 'Тип организации',
      value: partner.type,
      icon: <BadgeInfo size={20} />,
    },
    {
      label: 'Адрес',
      value: partner.address,
      icon: <MapPin size={20} />,
    },
    {
      label: 'Телефон',
      value: partner.phone,
      icon: <Phone size={20} />,
    },
    {
      label: 'Веб-сайт',
      value: partner.website ? (
        <a
          href={partner.website}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-600 transition-all hover:underline hover:text-blue-700"
        >
          {partner.website}
        </a>
      ) : null,
      icon: <Globe size={20} />,
    },
    {
      label: 'Описание',
      value: <p className="leading-relaxed">{partner.description}</p>,
      icon: <FileText size={20} />,
    },
  ];

  const fullName = [partner.last_name, partner.first_name, partner.third_name].filter(Boolean).join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-lg"
    >
      <div className="bg-slate-50 p-6 border-b border-slate-200">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center space-x-4"
        >
          <Building className="h-10 w-10 flex-shrink-0 text-slate-500" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {partner.name_of_organization || 'Название организации не указано'}
            </h1>
            {fullName && (
              <div className="flex items-center space-x-2 text-sm text-slate-600 mt-1">
                <UserCircle size={16} />
                <span>{fullName}</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.3,
            },
          },
        }}
        className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2"
      >
        {dataItems.map((item) => (
          <motion.div
            key={item.label}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ ease: 'easeOut' }}
          >
            <InfoRow icon={item.icon} label={item.label} value={item.value} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}; 