import React from 'react';

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

export const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
  <div className="flex items-start space-x-4">
    <div className="mt-1 flex-shrink-0 text-blue-500">{icon}</div>
    <div className="flex-1">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <div className="text-base text-slate-800">{value || '—'}</div>
    </div>
  </div>
); 