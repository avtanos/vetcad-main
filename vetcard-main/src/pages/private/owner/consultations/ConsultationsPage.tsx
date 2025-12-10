import { useState, useEffect } from 'react';
import { api } from '@/shared/api';
import { FaComments, FaPlus, FaCheckCircle } from 'react-icons/fa';
import { ConsultationCreateForm } from '@/features/consultation-create/ui/ConsultationCreateForm';
import { Modal } from '@/shared/ui/Modal';

interface Consultation {
  id: number;
  vet_id: number;
  pet_id: number;
  question: string;
  answer?: string;
  status: string;
  created_at: string;
  answered_at?: string;
}

export const ConsultationsPage = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [vetId, setVetId] = useState<number | null>(null);

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Consultation[]>('/v1/owner/consultations/');
      setConsultations(data);
    } catch (e: any) {
      setError(e.message || 'Ошибка загрузки консультаций');
    } finally {
      setLoading(false);
    }
  };

  // Для демонстрации используем ID ветеринара из мокап данных
  const handleCreateConsultation = () => {
    setVetId(2); // ID ветеринара из мокап данных
    setShowCreateForm(true);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Мои консультации</h1>
        <button
          onClick={handleCreateConsultation}
          className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
        >
          <FaPlus /> Задать вопрос ветеринару
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
          {consultations.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center text-slate-500">
              <FaComments className="mx-auto mb-4 text-4xl text-slate-300" />
              <p>У вас пока нет консультаций</p>
            </div>
          ) : (
            <div className="space-y-4">
              {consultations.map((consultation) => (
                <div key={consultation.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                  <div className="mb-4">
                    <p className="text-sm text-slate-500 mb-2">
                      {new Date(consultation.created_at).toLocaleString('ru-RU')}
                    </p>
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 mb-2">Вопрос:</p>
                        <p className="text-slate-700">{consultation.question}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        consultation.status === 'answered' ? 'bg-green-100 text-green-800' :
                        consultation.status === 'closed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {consultation.status === 'pending' ? 'Ожидает ответа' :
                         consultation.status === 'answered' ? 'Отвечено' :
                         'Закрыто'}
                      </span>
                    </div>
                  </div>
                  {consultation.answer ? (
                    <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <FaCheckCircle className="text-teal-600" />
                        <p className="font-semibold text-teal-900">Ответ ветеринара:</p>
                        {consultation.answered_at && (
                          <p className="text-xs text-teal-600 ml-auto">
                            {new Date(consultation.answered_at).toLocaleString('ru-RU')}
                          </p>
                        )}
                      </div>
                      <p className="text-teal-800">{consultation.answer}</p>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                      <p className="text-yellow-800 text-sm">
                        Ветеринар еще не ответил на ваш вопрос. Ожидайте ответа.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Модальное окно для создания консультации */}
      {showCreateForm && vetId && (
        <Modal
          isOpen={true}
          onClose={() => {
            setShowCreateForm(false);
            setVetId(null);
          }}
          title="Задать вопрос ветеринару"
        >
          <ConsultationCreateForm
            vetId={vetId}
            onSave={async () => {
              await loadConsultations();
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

