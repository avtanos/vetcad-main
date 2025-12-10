import { useUserStore } from '@/entities/user/model/user-store';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { PartnerProfileCard } from '@/entities/partner/ui/PartnerProfileCard';

const PartnerMyDataPage: React.FC = () => {
  const { user } = useUserStore();

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-screen items-center justify-center bg-slate-50"
      >
        <div className="flex flex-col items-center space-y-3 text-center">
          <Info className="h-10 w-10 text-slate-400" />
          <h2 className="text-lg font-medium text-slate-700">Нет данных о пользователе</h2>
          <p className="text-sm text-slate-500">Пожалуйста, попробуйте обновить страницу.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex items-start justify-center font-sans mt-6">
      <PartnerProfileCard user={user} />
    </div>
  );
};

export default PartnerMyDataPage;