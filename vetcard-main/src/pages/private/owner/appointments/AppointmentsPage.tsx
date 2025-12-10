import { useState, useEffect } from 'react';
import { api } from '@/shared/api';
import { FaCalendarAlt, FaPlus, FaClock, FaUserMd } from 'react-icons/fa';
import { AppointmentCreateForm } from '@/features/appointment-create/ui/AppointmentCreateForm';
import { Modal } from '@/shared/ui/Modal';
import { useUserStore } from '@/entities/user/model/user-store';

interface Appointment {
  id: number;
  vet_id: number;
  pet_id: number;
  appointment_date: string;
  reason?: string;
  status: string;
  notes?: string;
}

export const AppointmentsPage = () => {
  const { user } = useUserStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [vetId, setVetId] = useState<number | null>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Appointment[]>('/v1/owner/appointments/');
      setAppointments(data);
    } catch (e: any) {
      setError(e.message || 'Ошибка загрузки записей');
    } finally {
      setLoading(false);
    }
  };

  // Для демонстрации используем ID ветеринара из мокап данных
  // В реальном приложении это должно быть из списка доступных ветеринаров
  const handleCreateAppointment = () => {
    // Получаем ID ветеринара (можно сделать выбор из списка)
    setVetId(2); // ID ветеринара из мокап данных
    setShowCreateForm(true);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Мои записи</h1>
        <button
          onClick={handleCreateAppointment}
          className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
        >
          <FaPlus /> Записаться к ветеринару
        </button>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {appointments.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center text-slate-500">
              <FaCalendarAlt className="mx-auto mb-4 text-4xl text-slate-300" />
              <p>У вас пока нет записей</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <FaClock className="text-teal-500" />
                        <p className="font-semibold text-slate-900 text-lg">
                          {new Date(appointment.appointment_date).toLocaleString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {appointment.reason && (
                        <p className="text-slate-600 mb-2">
                          <span className="font-medium">Причина:</span> {appointment.reason}
                        </p>
                      )}
                      {appointment.notes && (
                        <p className="text-slate-500 text-sm mt-2 italic">
                          Заметки ветеринара: {appointment.notes}
                        </p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status === 'pending' ? 'Ожидает подтверждения' :
                       appointment.status === 'confirmed' ? 'Подтверждена' :
                       appointment.status === 'completed' ? 'Завершена' :
                       'Отменена'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Модальное окно для создания записи */}
      {showCreateForm && vetId && (
        <Modal
          isOpen={true}
          onClose={() => {
            setShowCreateForm(false);
            setVetId(null);
          }}
          title="Записаться к ветеринару"
        >
          <AppointmentCreateForm
            vetId={vetId}
            onSave={async () => {
              await loadAppointments();
              setShowCreateForm(false);
              setVetId(null);
            }}
            onCancel={() => {
              setShowCreateForm(false);
              setVetId(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

