import { useState, useEffect } from 'react';
import { api } from '@/shared/api';
import { useUserStore } from '@/entities/user/model/user-store';
import { useAuth } from '@/entities/user/model/useAuth';
import { FaUserMd, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaGraduationCap, FaBriefcase } from 'react-icons/fa';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/input';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Veterinarian {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  third_name?: string;
  phone?: string;
  clinic?: string;
  position?: string;
  specialization?: string;
  experience?: number;
  license_number?: string;
  city?: string;
  address?: string;
  description?: string;
}

interface Pet {
  id: number;
  name: string;
  species: string;
  breed?: string;
}

export const SpecialistsPage = () => {
  const { t } = useTranslation();
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedVet, setSelectedVet] = useState<Veterinarian | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointmentForm, setAppointmentForm] = useState({
    pet_id: '',
    appointment_date: '',
    reason: '',
  });
  const { user } = useUserStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadVeterinarians();
    if (user) {
      loadPets();
    }
  }, [user]);

  useEffect(() => {
    // Проверяем, есть ли параметр vet в URL (после входа)
    const urlParams = new URLSearchParams(window.location.search);
    const vetId = urlParams.get('vet');
    if (vetId && user && veterinarians.length > 0) {
      const vet = veterinarians.find(v => v.id === parseInt(vetId));
      if (vet) {
        setSelectedVet(vet);
        setShowAppointmentModal(true);
        // Очищаем параметр из URL
        window.history.replaceState({}, '', '/specialists');
      }
    }
  }, [user, veterinarians]);

  const loadVeterinarians = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Veterinarian[]>('/v1/vet/list');
      setVeterinarians(data || []);
    } catch (e: any) {
      console.error('Ошибка загрузки ветеринаров:', e);
      setError(e.message || t('specialists.error'));
    } finally {
      setLoading(false);
    }
  };

  const loadPets = async () => {
    try {
      const data = await api.get<Pet[]>('/v1/pet/');
      setPets(data || []);
    } catch (e: any) {
      console.error('Ошибка загрузки питомцев:', e);
    }
  };

  const handleBookAppointment = (vet: Veterinarian) => {
    if (!isAuthenticated || !user) {
      // Сохраняем информацию о выбранном ветеринаре для редиректа после входа
      navigate(`/login?returnUrl=${encodeURIComponent(location.pathname)}`);
      return;
    }
    setSelectedVet(vet);
    setShowAppointmentModal(true);
  };

  const handleSubmitAppointment = async () => {
    if (!selectedVet || !appointmentForm.pet_id || !appointmentForm.appointment_date) {
      alert(t('forms.required'));
      return;
    }

    try {
      await api.post('/v1/owner/appointments/', {
        vet_id: selectedVet.id,
        pet_id: parseInt(appointmentForm.pet_id),
        appointment_date: new Date(appointmentForm.appointment_date).toISOString(),
        reason: appointmentForm.reason || undefined,
      });
      alert(t('common.success'));
      setShowAppointmentModal(false);
      setSelectedVet(null);
      setAppointmentForm({
        pet_id: '',
        appointment_date: '',
        reason: '',
      });
    } catch (e: any) {
      console.error('Ошибка создания записи:', e);
      alert(e.message || t('common.error'));
    }
  };

  const getVetFullName = (vet: Veterinarian) => {
    const parts = [vet.first_name, vet.last_name, vet.third_name].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : vet.username;
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">{t('specialists.title')}</h1>

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
          {veterinarians.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center text-slate-500">
              <FaUserMd className="mx-auto mb-4 text-4xl text-slate-300" />
              <p>{t('specialists.noSpecialists')}</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {veterinarians.map((vet) => (
                <div
                  key={vet.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaUserMd className="text-2xl text-teal-600" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-slate-900 text-lg mb-1">
                        {getVetFullName(vet)}
                      </h3>
                      {vet.position && (
                        <p className="text-sm text-slate-600 mb-1 flex items-center gap-1">
                          <FaBriefcase className="text-slate-400" />
                          {vet.position}
                        </p>
                      )}
                      {vet.clinic && (
                        <p className="text-sm text-slate-600 mb-1">{vet.clinic}</p>
                      )}
                    </div>
                  </div>

                  {vet.specialization && (
                    <div className="mb-3">
                      <p className="text-sm text-slate-700">
                        <span className="font-medium">{t('specialists.appointment.specialization')}:</span> {vet.specialization}
                      </p>
                    </div>
                  )}

                  {vet.experience && (
                    <div className="mb-3 flex items-center gap-1 text-sm text-slate-600">
                      <FaGraduationCap className="text-slate-400" />
                      <span>{t('register_form.step5.vet.experience')}: {vet.experience}</span>
                    </div>
                  )}

                  {vet.city && (
                    <div className="mb-3 flex items-center gap-1 text-sm text-slate-600">
                      <FaMapMarkerAlt className="text-slate-400" />
                      <span>{vet.city}{vet.address ? `, ${vet.address}` : ''}</span>
                    </div>
                  )}

                  {vet.phone && (
                    <div className="mb-3 flex items-center gap-1 text-sm text-slate-600">
                      <FaPhone className="text-slate-400" />
                      <span>{vet.phone}</span>
                    </div>
                  )}

                  {vet.description && (
                    <p className="text-sm text-slate-600 mb-4 line-clamp-3">{vet.description}</p>
                  )}

                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => handleBookAppointment(vet)}
                  >
                    <FaCalendarAlt className="mr-2" />
                    {t('specialists.bookAppointment')}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Модальное окно записи */}
      {showAppointmentModal && selectedVet && isAuthenticated && user && (
        <Modal
          isOpen={true}
          onClose={() => {
            setShowAppointmentModal(false);
            setSelectedVet(null);
            setAppointmentForm({
              pet_id: '',
              appointment_date: '',
              reason: '',
            });
          }}
          title={`${t('specialists.appointment.title')} ${getVetFullName(selectedVet)}`}
        >
          <div className="space-y-4">
            {pets.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-slate-600 mb-4">{t('specialists.appointment.noPets')}</p>
                <Button
                  variant="primary"
                  onClick={() => {
                    setShowAppointmentModal(false);
                    navigate('/mypets');
                  }}
                >
                  {t('pets.addPet')}
                </Button>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('specialists.appointment.selectPet')} *
                  </label>
                  <select
                    value={appointmentForm.pet_id}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, pet_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    required
                  >
                    <option value="">-- {t('specialists.appointment.selectPet')} --</option>
                    {pets.map((pet) => (
                      <option key={pet.id} value={pet.id}>
                        {pet.name} ({pet.species}{pet.breed ? `, ${pet.breed}` : ''})
                      </option>
                    ))}
                  </select>
                </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('specialists.appointment.date')} {t('specialists.appointment.time')} *
              </label>
              <Input
                type="datetime-local"
                value={appointmentForm.appointment_date}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, appointment_date: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('specialists.appointment.reason')}
              </label>
              <textarea
                value={appointmentForm.reason}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, reason: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                rows={3}
                placeholder={t('specialists.appointment.enterReason')}
              />
            </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="primary"
                    onClick={handleSubmitAppointment}
                    className="flex-1"
                  >
                    {t('specialists.appointment.submit')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAppointmentModal(false);
                      setSelectedVet(null);
                      setAppointmentForm({
                        pet_id: '',
                        appointment_date: '',
                        reason: '',
                      });
                    }}
                    className="flex-1"
                  >
                    {t('common.cancel')}
                  </Button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

