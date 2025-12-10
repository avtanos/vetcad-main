import { JSX, useState } from 'react';
import { FaClinicMedical, FaMapMarkerAlt, FaIdBadge, FaCalendarAlt, FaPencilAlt } from 'react-icons/fa';
import { Button } from '@/shared/ui/Button';
import {EditVetProfileForm }from '../mydata/EditVetProfileForm'

const defaultDoctor = {
  fullName: 'Иванов Иван Иванович',
  description: 'Ветеринарный врач, специализация: терапия и хирургия мелких домашних животных. Обладаю большим опытом в лечении экзотических птиц и рептилий.',
  clinic: 'ВетКлиника "Добрый Доктор"',
  experience: 8, 
  license: 'VET-2024-123456',
  city: 'Москва',
  address: 'ул. Ветеринарная, д. 15, каб. 3',
  avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
  coverUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.0&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600'
};

const InfoRow = ({ icon, label, value }: { icon: JSX.Element, label: string, value: React.ReactNode }) => (
    <div>
        <dt className="text-sm font-medium text-slate-500 flex items-center gap-2">
            {icon} {label}
        </dt>
        <dd className="mt-1 text-md font-semibold text-slate-900">{value}</dd>
    </div>
);


export const MyDataPage = () => {
  const [doctor, setDoctor] = useState(defaultDoctor);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-40 bg-slate-200">
          <img src={doctor.coverUrl} alt="Cover" className="w-full h-full object-cover" />
        </div>
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-20">
          <div className="relative flex-shrink-0">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
              <img src={doctor.avatarUrl} alt={doctor.fullName} className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 text-center sm:text-left">{doctor.fullName}</h1>
              <p className="text-slate-600 text-center sm:text-left">Ветеринарный врач</p>
            </div>
            {!isEditing && (
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsEditing(true)}>
                <FaPencilAlt className="mr-2" /> Редактировать
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {isEditing ? (
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-8">
            <EditVetProfileForm
              initialData={doctor}
              onSave={(data) => { setDoctor(data); setIsEditing(false); }}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <>
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Обо мне</h2>
              <p className="text-slate-600 leading-relaxed">{doctor.description}</p>
            </div>
            <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Профессиональные данные</h2>
              <dl className="space-y-6">
                <InfoRow icon={<FaClinicMedical className="text-teal-500" />} label="Клиника" value={doctor.clinic} />
                <InfoRow icon={<FaCalendarAlt className="text-teal-500" />} label="Стаж работы" value={`${doctor.experience} лет`} />
                <InfoRow icon={<FaIdBadge className="text-teal-500" />} label="Номер лицензии" value={doctor.license} />
                <InfoRow icon={<FaMapMarkerAlt className="text-teal-500" />} label="Адрес" value={`${doctor.city}, ${doctor.address}`} />
              </dl>
            </div>
          </>
        )}
      </div>
    </div>
  );
};