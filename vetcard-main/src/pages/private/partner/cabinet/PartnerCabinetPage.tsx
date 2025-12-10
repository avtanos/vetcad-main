import { useState, useEffect } from 'react';
import { api } from '@/shared/api';
import { FaCalendarAlt, FaMapMarkerAlt, FaConciergeBell, FaUsers, FaTags, FaChartBar, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { EmployeeForm } from '@/features/employee-manage/ui/EmployeeForm';
import { Modal } from '@/shared/ui/Modal';

interface Schedule {
  id: number;
  day_of_week: number;
  open_time?: string;
  close_time?: string;
  is_closed: boolean;
}

interface Location {
  id: number;
  latitude: number;
  longitude: number;
  address?: string;
}

interface Service {
  id: number;
  name_ru: string;
  name_kg?: string;
  description?: string;
  price?: number;
  duration_minutes?: number;
  is_active: boolean;
}

interface Employee {
  id: number;
  first_name: string;
  last_name?: string;
  position?: string;
  specialization?: string;
  phone?: string;
  email?: string;
  photo_url?: string;
  is_active: boolean;
}

interface Promotion {
  id: number;
  title: string;
  description?: string;
  discount_percent?: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  views_count: number;
}

interface ProductStats {
  product_id: number;
  total_views: number;
  unique_views: number;
  views_today: number;
  views_this_week: number;
  views_this_month: number;
}

const DAYS_OF_WEEK = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

export const PartnerCabinetPage = () => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'location' | 'services' | 'employees' | 'promotions' | 'stats'>('schedule');
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [location, setLocation] = useState<Location | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [stats, setStats] = useState<ProductStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      switch (activeTab) {
        case 'schedule':
          const scheduleData = await api.get<Schedule[]>('/v1/partner/schedule');
          setSchedule(scheduleData);
          break;
        case 'location':
          try {
            const locationData = await api.get<Location>('/v1/partner/location');
            setLocation(locationData);
          } catch (e: any) {
            if (e.message?.includes('404')) {
              setLocation(null);
            } else {
              throw e;
            }
          }
          break;
        case 'services':
          const servicesData = await api.get<Service[]>('/v1/partner/services');
          setServices(servicesData);
          break;
        case 'employees':
          const employeesData = await api.get<Employee[]>('/v1/partner/employees');
          setEmployees(employeesData);
          break;
        case 'promotions':
          const promotionsData = await api.get<Promotion[]>('/v1/partner/promotions');
          setPromotions(promotionsData);
          break;
        case 'stats':
          const statsData = await api.get<ProductStats[]>('/v1/partner/products/stats');
          setStats(statsData);
          break;
      }
    } catch (e: any) {
      setError(e.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'schedule' as const, label: 'График работы', icon: <FaCalendarAlt /> },
    { id: 'location' as const, label: 'Геолокация', icon: <FaMapMarkerAlt /> },
    { id: 'services' as const, label: 'Услуги', icon: <FaConciergeBell /> },
    { id: 'employees' as const, label: 'Сотрудники', icon: <FaUsers /> },
    { id: 'promotions' as const, label: 'Акции', icon: <FaTags /> },
    { id: 'stats' as const, label: 'Статистика', icon: <FaChartBar /> },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Кабинет партнера</h1>

      {/* Вкладки */}
      <div className="border-b border-slate-200 mb-6">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
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
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* График работы */}
          {activeTab === 'schedule' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-800">График работы</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                  <FaPlus /> Настроить график
                </button>
              </div>
              <div className="space-y-4">
                {DAYS_OF_WEEK.map((day, index) => {
                  const daySchedule = schedule.find(s => s.day_of_week === index);
                  return (
                    <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <span className="font-medium text-slate-900">{day}</span>
                      {daySchedule?.is_closed ? (
                        <span className="text-red-600 font-medium">Выходной</span>
                      ) : daySchedule ? (
                        <span className="text-slate-600">
                          {daySchedule.open_time} - {daySchedule.close_time}
                        </span>
                      ) : (
                        <span className="text-slate-400">Не установлено</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Геолокация */}
          {activeTab === 'location' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Геолокация</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                  <FaPlus /> Установить локацию
                </button>
              </div>
              {location ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Координаты</p>
                    <p className="font-medium">{location.latitude}, {location.longitude}</p>
                  </div>
                  {location.address && (
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Адрес</p>
                      <p className="font-medium">{location.address}</p>
                    </div>
                  )}
                  <div className="bg-slate-100 rounded-lg h-64 flex items-center justify-center">
                    <p className="text-slate-500">Карта будет здесь</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <FaMapMarkerAlt className="mx-auto mb-4 text-4xl text-slate-300" />
                  <p>Геолокация не установлена</p>
                </div>
              )}
            </div>
          )}

          {/* Услуги */}
          {activeTab === 'services' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Услуги</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                  <FaPlus /> Добавить услугу
                </button>
              </div>
              {services.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center text-slate-500">
                  <FaConciergeBell className="mx-auto mb-4 text-4xl text-slate-300" />
                  <p>У вас пока нет услуг</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {services.map((service) => (
                    <div key={service.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                      <h3 className="font-semibold text-slate-900 mb-2">{service.name_ru}</h3>
                      {service.description && (
                        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{service.description}</p>
                      )}
                      <div className="flex justify-between items-center">
                        {service.price && (
                          <span className="font-semibold text-blue-600">{service.price} сом</span>
                        )}
                        <span className={`px-2 py-1 rounded text-xs ${
                          service.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {service.is_active ? 'Активна' : 'Неактивна'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Сотрудники */}
          {activeTab === 'employees' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Сотрудники</h2>
                <button 
                  onClick={() => {
                    setEditingEmployee(null);
                    setShowEmployeeForm(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  <FaPlus /> Добавить сотрудника
                </button>
              </div>
              {employees.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center text-slate-500">
                  <FaUsers className="mx-auto mb-4 text-4xl text-slate-300" />
                  <p>У вас пока нет сотрудников</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {employees.map((employee) => (
                    <div key={employee.id} className="bg-white rounded-lg shadow p-6 relative hover:shadow-lg transition-shadow">
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button
                          onClick={() => {
                            setEditingEmployee(employee);
                            setShowEmployeeForm(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Редактировать"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm('Удалить сотрудника?')) {
                              try {
                                await api.delete(`/v1/partner/employees/${employee.id}`);
                                await loadData();
                              } catch (e: any) {
                                alert(e.message || 'Ошибка при удалении');
                              }
                            }
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Удалить"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      {employee.photo_url ? (
                        <img src={employee.photo_url} alt={employee.first_name} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover" />
                      ) : (
                        <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-slate-200 flex items-center justify-center">
                          <FaUsers className="text-slate-400 text-2xl" />
                        </div>
                      )}
                      <h3 className="font-semibold text-slate-900 text-center mb-2">
                        {employee.first_name} {employee.last_name}
                      </h3>
                      {employee.position && (
                        <p className="text-slate-600 text-sm text-center mb-2">{employee.position}</p>
                      )}
                      {employee.specialization && (
                        <p className="text-slate-500 text-xs text-center mb-4">{employee.specialization}</p>
                      )}
                      {employee.phone && (
                        <p className="text-slate-600 text-sm text-center mb-1">{employee.phone}</p>
                      )}
                      {employee.email && (
                        <p className="text-slate-600 text-sm text-center">{employee.email}</p>
                      )}
                      <div className="mt-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          employee.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {employee.is_active ? 'Активен' : 'Неактивен'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Акции */}
          {activeTab === 'promotions' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Акции и предложения</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                  <FaPlus /> Создать акцию
                </button>
              </div>
              {promotions.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center text-slate-500">
                  <FaTags className="mx-auto mb-4 text-4xl text-slate-300" />
                  <p>У вас пока нет акций</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {promotions.map((promotion) => (
                    <div key={promotion.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                      <h3 className="font-semibold text-slate-900 mb-2">{promotion.title}</h3>
                      {promotion.description && (
                        <p className="text-slate-600 text-sm mb-4">{promotion.description}</p>
                      )}
                      <div className="flex justify-between items-center">
                        {promotion.discount_percent && (
                          <span className="font-bold text-blue-600 text-xl">{promotion.discount_percent}%</span>
                        )}
                        <span className="text-slate-500 text-sm">
                          {promotion.views_count} просмотров
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs mt-4">
                        {new Date(promotion.start_date).toLocaleDateString('ru-RU')} - {new Date(promotion.end_date).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Статистика */}
          {activeTab === 'stats' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">Статистика просмотров товаров</h2>
              {stats.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <FaChartBar className="mx-auto mb-4 text-4xl text-slate-300" />
                  <p>Нет данных для отображения</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">ID товара</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Всего просмотров</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Уникальных</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Сегодня</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Эта неделя</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Этот месяц</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {stats.map((stat) => (
                        <tr key={stat.product_id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium">{stat.product_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{stat.total_views}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{stat.unique_views}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{stat.views_today}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{stat.views_this_week}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{stat.views_this_month}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Модальное окно для управления сотрудником */}
      {showEmployeeForm && (
        <Modal
          isOpen={true}
          onClose={() => {
            setShowEmployeeForm(false);
            setEditingEmployee(null);
          }}
          title={editingEmployee ? 'Редактировать сотрудника' : 'Добавить сотрудника'}
        >
          <EmployeeForm
            initialData={editingEmployee}
            onSave={async (employeeData) => {
              try {
                if (editingEmployee) {
                  await api.put(`/v1/partner/employees/${editingEmployee.id}`, employeeData);
                } else {
                  await api.post('/v1/partner/employees', employeeData);
                }
                await loadData();
                setShowEmployeeForm(false);
                setEditingEmployee(null);
              } catch (e: any) {
                throw new Error(e.message || 'Ошибка при сохранении сотрудника');
              }
            }}
            onCancel={() => {
              setShowEmployeeForm(false);
              setEditingEmployee(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

