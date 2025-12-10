import { useState, useEffect } from 'react';
import { api } from '@/shared/api';
import { FaUsers, FaCalendarAlt, FaComments, FaFileAlt, FaPlus } from 'react-icons/fa';
import { ConsultationAnswerForm } from '@/features/consultation-answer/ui/ConsultationAnswerForm';
import { Modal } from '@/shared/ui/Modal';

interface Patient {
  id: number;
  name: string;
  species: string;
  breed?: string;
  birth_date?: string;
  weight?: number;
  special_notes?: string;
  owner_name?: string;
}

interface Appointment {
  id: number;
  pet_id: number;
  pet_owner_id: number;
  appointment_date: string;
  reason?: string;
  status: string;
  notes?: string;
}

interface Consultation {
  id: number;
  pet_id: number;
  pet_owner_id: number;
  question: string;
  answer?: string;
  status: string;
  created_at: string;
}

interface Article {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  category?: string;
  is_published: boolean;
  views_count: number;
  created_at: string;
}

export const VetCabinetPage = () => {
  const [activeTab, setActiveTab] = useState<'patients' | 'appointments' | 'consultations' | 'articles'>('patients');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answeringConsultation, setAnsweringConsultation] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      switch (activeTab) {
        case 'patients':
          const patientsData = await api.get<Patient[]>('/v1/vet/patients');
          setPatients(patientsData);
          break;
        case 'appointments':
          const appointmentsData = await api.get<Appointment[]>('/v1/vet/appointments');
          setAppointments(appointmentsData);
          break;
        case 'consultations':
          const consultationsData = await api.get<Consultation[]>('/v1/vet/consultations');
          setConsultations(consultationsData);
          break;
        case 'articles':
          const articlesData = await api.get<Article[]>('/v1/vet/articles');
          setArticles(articlesData);
          break;
      }
    } catch (e: any) {
      setError(e.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'patients' as const, label: 'Пациенты', icon: <FaUsers /> },
    { id: 'appointments' as const, label: 'Записи', icon: <FaCalendarAlt /> },
    { id: 'consultations' as const, label: 'Консультации', icon: <FaComments /> },
    { id: 'articles' as const, label: 'Статьи', icon: <FaFileAlt /> },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Кабинет ветеринара</h1>

      {/* Вкладки */}
      <div className="border-b border-slate-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Контент */}
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
          {/* Пациенты */}
          {activeTab === 'patients' && (
            <div className="bg-white rounded-lg shadow">
              {patients.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <FaUsers className="mx-auto mb-4 text-4xl text-slate-300" />
                  <p>Пока нет пациентов</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Имя питомца
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Вид
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Порода
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Владелец
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Особые пометки
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {patients.map((patient) => (
                        <tr key={patient.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                            {patient.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                            {patient.species}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                            {patient.breed || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                            {patient.owner_name || '-'}
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {patient.special_notes || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Записи */}
          {activeTab === 'appointments' && (
            <div className="bg-white rounded-lg shadow">
              {appointments.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <FaCalendarAlt className="mx-auto mb-4 text-4xl text-slate-300" />
                  <p>Нет записей</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="p-6 hover:bg-slate-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {new Date(appointment.appointment_date).toLocaleString('ru-RU')}
                          </p>
                          {appointment.reason && (
                            <p className="text-slate-600 mt-1">Причина: {appointment.reason}</p>
                          )}
                          {appointment.notes && (
                            <p className="text-slate-500 mt-2 text-sm">{appointment.notes}</p>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.status === 'pending' ? 'Ожидает' :
                           appointment.status === 'confirmed' ? 'Подтверждена' :
                           appointment.status === 'completed' ? 'Завершена' :
                           'Отменена'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Консультации */}
          {activeTab === 'consultations' && (
            <div className="bg-white rounded-lg shadow">
              {consultations.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <FaComments className="mx-auto mb-4 text-4xl text-slate-300" />
                  <p>Нет консультаций</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {consultations.map((consultation) => (
                    <div key={consultation.id} className="p-6">
                      <div className="mb-4">
                        <p className="text-sm text-slate-500 mb-2">
                          {new Date(consultation.created_at).toLocaleString('ru-RU')}
                        </p>
                        <p className="font-semibold text-slate-900 mb-2">Вопрос:</p>
                        <p className="text-slate-700">{consultation.question}</p>
                      </div>
                      {consultation.answer ? (
                        <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded">
                          <p className="font-semibold text-teal-900 mb-2">Ответ:</p>
                          <p className="text-teal-800">{consultation.answer}</p>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setAnsweringConsultation(consultation.id)}
                          className="mt-2 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
                        >
                          Ответить
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Статьи */}
          {activeTab === 'articles' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Мои статьи</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors">
                  <FaPlus /> Создать статью
                </button>
              </div>
              {articles.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center text-slate-500">
                  <FaFileAlt className="mx-auto mb-4 text-4xl text-slate-300" />
                  <p>У вас пока нет статей</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {articles.map((article) => (
                    <div key={article.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                      {article.image_url && (
                        <img src={article.image_url} alt={article.title} className="w-full h-48 object-cover" />
                      )}
                      <div className="p-6">
                        <h3 className="font-semibold text-slate-900 mb-2">{article.title}</h3>
                        {article.excerpt && (
                          <p className="text-slate-600 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                        )}
                        <div className="flex justify-between items-center text-sm">
                          <span className={`px-2 py-1 rounded ${
                            article.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {article.is_published ? 'Опубликовано' : 'Черновик'}
                          </span>
                          <span className="text-slate-500">{article.views_count} просмотров</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Модальное окно для ответа на консультацию */}
      {answeringConsultation && (
        <Modal
          isOpen={true}
          onClose={() => setAnsweringConsultation(null)}
          title="Ответить на консультацию"
        >
          <ConsultationAnswerForm
            consultationId={answeringConsultation}
            onSave={async (consultationId, answer) => {
              try {
                await api.post(`/v1/vet/consultations/${consultationId}/answer`, { answer });
                await loadData();
                setAnsweringConsultation(null);
              } catch (e: any) {
                throw new Error(e.message || 'Ошибка при сохранении ответа');
              }
            }}
            onCancel={() => setAnsweringConsultation(null)}
          />
        </Modal>
      )}
    </div>
  );
};

