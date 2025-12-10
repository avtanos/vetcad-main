import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/shared/api';
import { FaArrowLeft, FaEdit, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';
import { Button } from '@/shared/ui/Button';

interface UserDetail {
  user: {
    id: number;
    username: string;
    email: string;
    is_active: boolean;
  };
  profile?: {
    id: number;
    user_id: number;
    first_name?: string;
    last_name?: string;
    third_name?: string;
    phone?: string;
    city?: string;
    address?: string;
    role?: number;
    clinic?: string;
    position?: string;
    specialization?: string;
    experience?: string;
    license_number?: string;
    name_of_organization?: string;
    type?: string;
    website?: string;
    description?: string;
  };
}

const roleNames: Record<number, string> = {
  1: 'Владелец питомца',
  2: 'Ветеринар',
  3: 'Партнер',
  4: 'Администратор',
};

export const AdminUserProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadUserProfile();
    }
  }, [userId]);

  const loadUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<UserDetail>(`/v1/admin/users/${userId}`);
      setUserDetail(data);
    } catch (e: any) {
      setError(e.message || 'Ошибка загрузки профиля пользователя');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  if (error || !userDetail) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error || 'Пользователь не найден'}</p>
        </div>
        <Button onClick={() => navigate('/admin')} variant="outline">
          <FaArrowLeft className="mr-2" /> Вернуться к списку пользователей
        </Button>
      </div>
    );
  }

  const { user, profile } = userDetail;
  const fullName = profile
    ? [profile.last_name, profile.first_name, profile.third_name].filter(Boolean).join(' ')
    : user.username;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          onClick={() => navigate('/admin')}
          variant="outline"
          className="mb-4"
        >
          <FaArrowLeft className="mr-2" /> Вернуться к списку пользователей
        </Button>
        <h1 className="text-3xl font-bold text-slate-800">Профиль пользователя</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Основная информация */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-teal-600">
              {profile?.first_name?.[0] || user.username[0].toUpperCase()}
            </div>
            <div className="flex-1 text-white">
              <h2 className="text-2xl font-bold mb-1">{fullName}</h2>
              <p className="text-teal-100">{user.email}</p>
              {profile?.role && (
                <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                  {roleNames[profile.role]}
                </span>
              )}
            </div>
            <div className="text-right text-white">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.is_active ? 'bg-green-500/30' : 'bg-red-500/30'
              }`}>
                {user.is_active ? 'Активен' : 'Неактивен'}
              </div>
            </div>
          </div>
        </div>

        {/* Детальная информация */}
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Личная информация */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FaUser className="text-teal-500" /> Личная информация
              </h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-slate-500">ID пользователя</dt>
                  <dd className="mt-1 text-slate-900">{user.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Имя пользователя</dt>
                  <dd className="mt-1 text-slate-900">{user.username}</dd>
                </div>
                {profile?.first_name && (
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Имя</dt>
                    <dd className="mt-1 text-slate-900">{profile.first_name}</dd>
                  </div>
                )}
                {profile?.last_name && (
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Фамилия</dt>
                    <dd className="mt-1 text-slate-900">{profile.last_name}</dd>
                  </div>
                )}
                {profile?.third_name && (
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Отчество</dt>
                    <dd className="mt-1 text-slate-900">{profile.third_name}</dd>
                  </div>
                )}
                {profile?.phone && (
                  <div>
                    <dt className="text-sm font-medium text-slate-500 flex items-center gap-2">
                      <FaPhone className="text-slate-400" /> Телефон
                    </dt>
                    <dd className="mt-1 text-slate-900">{profile.phone}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Контактная информация */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FaEnvelope className="text-teal-500" /> Контактная информация
              </h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-slate-500">Email</dt>
                  <dd className="mt-1 text-slate-900">{user.email}</dd>
                </div>
                {profile?.city && (
                  <div>
                    <dt className="text-sm font-medium text-slate-500 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-slate-400" /> Город
                    </dt>
                    <dd className="mt-1 text-slate-900">{profile.city}</dd>
                  </div>
                )}
                {profile?.address && (
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Адрес</dt>
                    <dd className="mt-1 text-slate-900">{profile.address}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Профессиональная информация для ветеринаров */}
          {profile?.role === 2 && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FaShieldAlt className="text-teal-500" /> Профессиональная информация
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                {profile.clinic && (
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Клиника</dt>
                    <dd className="mt-1 text-slate-900">{profile.clinic}</dd>
                  </div>
                )}
                {profile.position && (
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Должность</dt>
                    <dd className="mt-1 text-slate-900">{profile.position}</dd>
                  </div>
                )}
                {profile.specialization && (
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Специализация</dt>
                    <dd className="mt-1 text-slate-900">{profile.specialization}</dd>
                  </div>
                )}
                {profile.experience && (
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Опыт работы</dt>
                    <dd className="mt-1 text-slate-900">{profile.experience}</dd>
                  </div>
                )}
                {profile.license_number && (
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Номер лицензии</dt>
                    <dd className="mt-1 text-slate-900">{profile.license_number}</dd>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Информация для партнеров */}
          {profile?.role === 3 && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FaShieldAlt className="text-teal-500" /> Информация об организации
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                {profile.name_of_organization && (
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Название организации</dt>
                    <dd className="mt-1 text-slate-900">{profile.name_of_organization}</dd>
                  </div>
                )}
                {profile.type && (
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Тип организации</dt>
                    <dd className="mt-1 text-slate-900">{profile.type}</dd>
                  </div>
                )}
                {profile.website && (
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Веб-сайт</dt>
                    <dd className="mt-1 text-slate-900">
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                        {profile.website}
                      </a>
                    </dd>
                  </div>
                )}
                {profile.description && (
                  <div className="md:col-span-2">
                    <dt className="text-sm font-medium text-slate-500">Описание</dt>
                    <dd className="mt-1 text-slate-900">{profile.description}</dd>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Кнопки действий */}
          <div className="mt-6 pt-6 border-t border-slate-200 flex gap-3">
            <Button
              onClick={() => navigate(`/admin`, { state: { editUserId: user.id } })}
              variant="primary"
            >
              <FaEdit className="mr-2" /> Редактировать пользователя
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

