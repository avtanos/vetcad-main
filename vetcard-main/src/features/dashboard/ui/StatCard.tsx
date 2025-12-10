import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
  to: string;
  custom?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color, to, custom }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.03 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: (custom ?? 0) * 0.1 }}
  >
    <Link to={to} className={`block p-6 rounded-2xl shadow-md transition-all duration-300 ${color}`}>
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-3xl opacity-60">{icon}</div>
      </div>
    </Link>
  </motion.div>
); 