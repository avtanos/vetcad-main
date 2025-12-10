import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/shared/api';
import { FaUsers, FaUserPlus, FaEdit, FaTrash, FaChartBar, FaSearch, FaCheck, FaTimes } from 'react-icons/fa';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';

interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  role?: number;
  first_name?: string;
  last_name?: string;
}

interface Stats {
  total_users: number;
  active_users: number;
  pet_owners: number;
  veterinarians: number;
  partners: number;
  admins: number;
  total_pets: number;
  total_articles: number;
  total_products: number;
}

interface UserCreate {
  username: string;
  email: string;
  password: string;
  role: number;
}

interface UserUpdate {
  username?: string;
  email?: string;
  password?: string;
  is_active?: boolean;
}

export const AdminPanelPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'stats'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<number | null>(null);
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  
  // Модальные окна
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Формы
  const [createForm, setCreateForm] = useState<UserCreate>({
    username: '',
    email: '',
    password: '',
    role: 1,
  });
  const [editForm, setEditForm] = useState<UserUpdate>({});

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    } else {
      loadStats();
    }
  }, [activeTab, page, searchTerm, roleFilter, isActiveFilter]);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const limit = 10;
      const skip = (page - 1) * limit;
      const params = new URLSearchParams({
        skip: skip.toString(),
        limit: limit.toString(),
      });
      if (searchTerm) params.append('search', searchTerm);
      if (roleFilter !== null) params.append('role', roleFilter.toString());
      if (isActiveFilter !== null) params.append('is_active', isActiveFilter.toString());

      const response = await api.get<{ total: number; users: Array<{ user: User; profile?: { first_name?: string; last_name?: string; role?: number } }> }>(
        `/v1/admin/users?${params.toString()}`
      );
      // Преобразуем ответ в нужный формат
      const usersList = response.users.map((item: any) => ({
        ...item.user,
        first_name: item.profile?.first_name,
        last_name: item.profile?.last_name,
        role: item.profile?.role,
      }));
      setUsers(usersList);
      setTotalUsers(response.total);
      setTotalPages(Math.ceil(response.total / limit));
    } catch (e: any) {
      setError(e.message || 'Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const statsData = await api.get<Stats>('/v1/admin/stats');
      setStats(statsData);
    } catch (e: any) {
      setError(e.message || 'Ошибка загрузки статистики');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      await api.post('/v1/admin/users', createForm);
      setShowCreateModal(false);
      setCreateForm({ username: '', email: '', password: '', role: 1 });
      await loadUsers();
    } catch (e: any) {
      setError(e.message || 'Ошибка создания пользователя');
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      await api.put(`/v1/admin/users/${selectedUser.id}`, editForm);
      setShowEditModal(false);
      setSelectedUser(null);
      setEditForm({});
      await loadUsers();
    } catch (e: any) {
      setError(e.message || 'Ошибка обновления пользователя');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
    try {
      await api.delete(`/v1/admin/users/${userId}`);
      await loadUsers();
    } catch (e: any) {
      setError(e.message || 'Ошибка удаления пользователя');
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      is_active: user.is_active,
    });
    setShowEditModal(true);
  };

  const roleNames: Record<number, string> = {
    1: 'Владелец питомца',
    2: 'Ветеринар',
    3: 'Партнер',
    4: 'Администратор',
  };

  const tabs = [
    { id: 'users' as const, label: 'Пользователи', icon: <FaUsers /> },
    { id: 'stats' as const, label: 'Статистика', icon: <FaChartBar /> },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Панель администратора</h1>

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

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        </div>
      )}

      {!loading && (
        <>
          {/* Пользователи */}
          {activeTab === 'users' && (
            <div>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Поиск по имени, email..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={roleFilter === null ? '' : roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value === '' ? null : Number(e.target.value));
                    setPage(1);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Все роли</option>
                  <option value="1">Владелец питомца</option>
                  <option value="2">Ветеринар</option>
                  <option value="3">Партнер</option>
                  <option value="4">Администратор</option>
                </select>
                <select
                  value={isActiveFilter === null ? '' : isActiveFilter.toString()}
                  onChange={(e) => {
                    setIsActiveFilter(e.target.value === '' ? null : e.target.value === 'true');
                    setPage(1);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Все статусы</option>
                  <option value="true">Активные</option>
                  <option value="false">Неактивные</option>
                </select>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                >
                  <FaUserPlus /> Создать пользователя
                </button>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                {users.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <FaUsers className="mx-auto mb-4 text-4xl text-slate-300" />
                    <p>Пользователи не найдены</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                              ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                              Имя пользователя
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                              Имя
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                              Роль
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                              Статус
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                              Действия
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                          {users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                {user.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => navigate(`/admin/users/${user.id}`)}
                                  className="font-medium text-slate-900 hover:text-teal-600 hover:underline transition-colors"
                                >
                                  {user.username}
                                </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                {user.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                {user.first_name && user.last_name ? (
                                  <button
                                    onClick={() => navigate(`/admin/users/${user.id}`)}
                                    className="hover:text-teal-600 hover:underline transition-colors"
                                  >
                                    {`${user.first_name} ${user.last_name}`}
                                  </button>
                                ) : (
                                  '-'
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                {user.role ? roleNames[user.role] || `Роль ${user.role}` : '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                    user.is_active
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {user.is_active ? (
                                    <>
                                      <FaCheck /> Активен
                                    </>
                                  ) : (
                                    <>
                                      <FaTimes /> Неактивен
                                    </>
                                  )}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => openEditModal(user)}
                                    className="text-teal-600 hover:text-teal-900"
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {totalPages > 1 && (
                      <div className="bg-slate-50 px-6 py-4 flex items-center justify-between">
                        <div className="text-sm text-slate-700">
                          Показано {users.length} из {totalUsers} пользователей
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
                          >
                            Назад
                          </button>
                          <span className="px-4 py-2 text-sm text-slate-700">
                            Страница {page} из {totalPages}
                          </span>
                          <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
                          >
                            Вперед
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Статистика */}
          {activeTab === 'stats' && stats && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Всего пользователей</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.total_users}</p>
                  </div>
                  <FaUsers className="text-4xl text-teal-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Владельцы питомцев</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.pet_owners}</p>
                  </div>
                  <FaUsers className="text-4xl text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Ветеринары</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.veterinarians}</p>
                  </div>
                  <FaUsers className="text-4xl text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Партнеры</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.partners}</p>
                  </div>
                  <FaUsers className="text-4xl text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Администраторы</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.admins}</p>
                  </div>
                  <FaUsers className="text-4xl text-red-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Питомцы</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.total_pets}</p>
                  </div>
                  <FaChartBar className="text-4xl text-yellow-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Статьи</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.total_articles}</p>
                  </div>
                  <FaChartBar className="text-4xl text-indigo-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Товары</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.total_products}</p>
                  </div>
                  <FaChartBar className="text-4xl text-pink-500" />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Модальное окно создания пользователя */}
      {showCreateModal && (
        <Modal
          isOpen={true}
          onClose={() => {
            setShowCreateModal(false);
            setCreateForm({ username: '', email: '', password: '', role: 1 });
          }}
          title="Создать пользователя"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Имя пользователя
              </label>
              <input
                type="text"
                value={createForm.username}
                onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Пароль</label>
              <input
                type="password"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Роль</label>
              <select
                value={createForm.role}
                onChange={(e) => setCreateForm({ ...createForm, role: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="1">Владелец питомца</option>
                <option value="2">Ветеринар</option>
                <option value="3">Партнер</option>
                <option value="4">Администратор</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateForm({ username: '', email: '', password: '', role: 1 });
                }}
                variant="secondary"
              >
                Отмена
              </Button>
              <Button onClick={handleCreateUser}>Создать</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Модальное окно редактирования пользователя */}
      {showEditModal && selectedUser && (
        <Modal
          isOpen={true}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
            setEditForm({});
          }}
          title="Редактировать пользователя"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Имя пользователя
              </label>
              <input
                type="text"
                value={editForm.username || selectedUser.username}
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={editForm.email || selectedUser.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Новый пароль (оставьте пустым, чтобы не менять)
              </label>
              <input
                type="password"
                value={editForm.password || ''}
                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editForm.is_active !== undefined ? editForm.is_active : selectedUser.is_active}
                  onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                  className="rounded border-slate-300 text-teal-500 focus:ring-teal-500"
                />
                <span className="text-sm font-medium text-slate-700">Активен</span>
              </label>
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                  setEditForm({});
                }}
                variant="secondary"
              >
                Отмена
              </Button>
              <Button onClick={handleUpdateUser}>Сохранить</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

