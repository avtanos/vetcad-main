// Мокап API для GitHub Pages
import {
  mockUsers,
  mockPets,
  mockAnimalTypes,
  mockArticles,
  mockReminders,
  mockProducts,
  mockCategories,
  mockSubcategories,
  mockVetPatients,
  mockVetAppointments,
  mockVetConsultations,
  mockVetArticles,
} from './mockData';

// Проверяем, используем ли мы мокап данные (для GitHub Pages)
const USE_MOCK_DATA = import.meta.env.PROD && !import.meta.env.VITE_API_URL;

// Генерируем мокап токены
function generateMockToken(): string {
  return `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Задержка для имитации сетевого запроса
function delay(ms: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Генерация уникального ID на основе максимального существующего ID
function generateNextId<T extends { id: number | string }>(items: T[], isString: boolean = false): number | string {
  if (items.length === 0) {
    return isString ? '1' : 1;
  }
  const maxId = items.reduce((max, item) => {
    const id = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id;
    return Math.max(max, isNaN(id) ? 0 : id);
  }, 0);
  const nextId = maxId + 1;
  return isString ? String(nextId) : nextId;
}

// Нормализация эндпоинта (удаление trailing slash для единообразия)
function normalizeEndpoint(endpoint: string): string {
  return endpoint.endsWith('/') && endpoint.length > 1 ? endpoint.slice(0, -1) : endpoint;
}

// Мокап API функции
export const mockApi = {
  post: async <T, R>(endpoint: string, data: T): Promise<R> => {
    await delay();
    const normalizedEndpoint = normalizeEndpoint(endpoint);

    // Авторизация
    if (normalizedEndpoint === '/v1/auth/token') {
      const { username, password } = data as any;
      const user = Object.values(mockUsers).find(u => u.username === username);
      
      if (user && (password === 'password123' || password === 'admin123')) {
        const accessToken = generateMockToken();
        const refreshToken = generateMockToken();
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        return {
          access: accessToken,
          refresh: refreshToken,
        } as R;
      }
      throw new Error('Неверный логин или пароль');
    }

    // Обновление токена
    if (normalizedEndpoint === '/v1/auth/token/refresh') {
      const newToken = generateMockToken();
      localStorage.setItem('authToken', newToken);
      return { access: newToken } as R;
    }

    // Создание питомца
    if (normalizedEndpoint === '/v1/pet') {
      const newPet = {
        id: generateNextId(mockPets, true),
        ...(data as any),
      };
      mockPets.push(newPet);
      return newPet as R;
    }

    // Создание напоминания
    if (normalizedEndpoint === '/v1/assistant/reminder') {
      const newReminder = {
        id: generateNextId(mockReminders, false),
        ...(data as any),
      };
      mockReminders.push(newReminder);
      return newReminder as R;
    }

    // Создание товара
    if (normalizedEndpoint === '/v1/reference/ref_shop') {
      const newProduct = {
        id: generateNextId(mockProducts, false),
        ...(data as any),
      };
      mockProducts.push(newProduct);
      return newProduct as R;
    }

    // Создание консультации
    if (normalizedEndpoint === '/v1/vet/consultations') {
      const newConsultation = {
        id: generateNextId(mockVetConsultations, false),
        ...(data as any),
        status: 'pending',
        answered_at: null,
      };
      mockVetConsultations.push(newConsultation);
      return newConsultation as R;
    }

    // Создание записи
    if (normalizedEndpoint === '/v1/vet/appointments') {
      const newAppointment = {
        id: generateNextId(mockVetAppointments, false),
        ...(data as any),
      };
      mockVetAppointments.push(newAppointment);
      return newAppointment as R;
    }

    // Создание статьи ветеринара
    if (normalizedEndpoint === '/v1/vet/articles') {
      const newArticle = {
        id: generateNextId(mockVetArticles, false),
        ...(data as any),
        views_count: 0,
        created_at: new Date().toISOString(),
      };
      mockVetArticles.push(newArticle);
      return newArticle as R;
    }

    // AI чат
    if (normalizedEndpoint === '/v1/ai/chat') {
      // Простой мокап ответа AI
      const responses = [
        'Это интересный вопрос о здоровье питомца. Рекомендую проконсультироваться с ветеринаром для точного диагноза.',
        'Для решения этой проблемы важно учитывать возраст и состояние здоровья вашего питомца. Лучше всего обратиться к специалисту.',
        'Это распространенная ситуация. Обычно это не требует немедленного вмешательства, но стоит понаблюдать за питомцем.',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      return {
        response: randomResponse,
      } as R;
    }

    // Создание записи к ветеринару
    if (normalizedEndpoint === '/v1/owner/appointments') {
      const newAppointment = {
        id: generateNextId(mockVetAppointments, false),
        ...(data as any),
        pet_owner_name: 'Иван Петров',
        pet_name: 'Рекс',
        status: 'pending',
        notes: null,
      };
      mockVetAppointments.push(newAppointment);
      return newAppointment as R;
    }

    throw new Error(`Метод POST для ${endpoint} не реализован в мокап API`);
  },

  get: async <R>(endpoint: string): Promise<R> => {
    await delay();
    const normalizedEndpoint = normalizeEndpoint(endpoint);

    // Получение профиля пользователя
    if (normalizedEndpoint === '/v1/auth/get_profile') {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Не авторизован');
      
      // Возвращаем первого пользователя для демо
      return mockUsers.petowner as R;
    }

    // Получение питомцев
    if (normalizedEndpoint === '/v1/pet') {
      return mockPets as R;
    }

    // Получение типов животных
    if (normalizedEndpoint === '/v1/reference/ref_type_of_animal') {
      return mockAnimalTypes as R;
    }

    // Получение статей
    if (normalizedEndpoint === '/v1/parser/articles') {
      return mockArticles as R;
    }

    // Получение напоминаний
    if (normalizedEndpoint === '/v1/assistant/reminder') {
      return mockReminders as R;
    }

    // Получение товаров
    if (normalizedEndpoint === '/v1/reference/ref_shop') {
      return mockProducts as R;
    }

    // Получение категорий
    if (normalizedEndpoint === '/v1/reference/categories') {
      return mockCategories as R;
    }

    // Получение подкатегорий
    if (normalizedEndpoint.startsWith('/v1/reference/subcategories')) {
      const url = new URL(endpoint, 'http://localhost');
      const categoryId = url.searchParams.get('category_id');
      if (categoryId) {
        return mockSubcategories.filter(s => s.category_id === parseInt(categoryId)) as R;
      }
      return mockSubcategories as R;
    }

    // Получение пациентов ветеринара
    if (normalizedEndpoint === '/v1/vet/patients') {
      return mockVetPatients as R;
    }

    // Получение записей ветеринара
    if (normalizedEndpoint === '/v1/vet/appointments') {
      return mockVetAppointments as R;
    }

    // Получение консультаций ветеринара
    if (normalizedEndpoint === '/v1/vet/consultations') {
      return mockVetConsultations as R;
    }

    // Получение статей ветеринара
    if (normalizedEndpoint === '/v1/vet/articles') {
      return mockVetArticles as R;
    }

    throw new Error(`Метод GET для ${endpoint} не реализован в мокап API`);
  },

  put: async <T, R>(endpoint: string, data: T): Promise<R> => {
    await delay();

    // Обновление питомца
    if (endpoint.startsWith('/v1/pet/')) {
      const id = endpoint.split('/').pop();
      const index = mockPets.findIndex(p => p.id === id);
      if (index !== -1) {
        mockPets[index] = { ...mockPets[index], ...(data as any) };
        return mockPets[index] as R;
      }
      throw new Error('Питомец не найден');
    }

    // Обновление напоминания
    if (endpoint.startsWith('/v1/assistant/reminder/')) {
      const id = endpoint.split('/').pop();
      const index = mockReminders.findIndex(r => r.id === parseInt(id || '0'));
      if (index !== -1) {
        mockReminders[index] = { ...mockReminders[index], ...(data as any) };
        return mockReminders[index] as R;
      }
      throw new Error('Напоминание не найдено');
    }

    // Обновление товара
    if (endpoint.startsWith('/v1/reference/ref_shop/')) {
      const id = endpoint.split('/').pop();
      const index = mockProducts.findIndex(p => p.id === parseInt(id || '0'));
      if (index !== -1) {
        mockProducts[index] = { ...mockProducts[index], ...(data as any) };
        return mockProducts[index] as R;
      }
      throw new Error('Товар не найден');
    }

    // Обновление консультации (ответ ветеринара)
    if (endpoint.startsWith('/v1/vet/consultations/')) {
      const id = endpoint.split('/').pop();
      const index = mockVetConsultations.findIndex(c => c.id === parseInt(id || '0'));
      if (index !== -1) {
        mockVetConsultations[index] = {
          ...mockVetConsultations[index],
          ...(data as any),
          status: 'answered',
          answered_at: new Date().toISOString(),
        };
        return mockVetConsultations[index] as R;
      }
      throw new Error('Консультация не найдена');
    }

    // Обновление записи
    if (endpoint.startsWith('/v1/vet/appointments/')) {
      const id = endpoint.split('/').pop();
      const index = mockVetAppointments.findIndex(a => a.id === parseInt(id || '0'));
      if (index !== -1) {
        mockVetAppointments[index] = { ...mockVetAppointments[index], ...(data as any) };
        return mockVetAppointments[index] as R;
      }
      throw new Error('Запись не найдена');
    }

    // Обновление профиля
    if (normalizeEndpoint(endpoint) === '/v1/auth/update_profile') {
      return { ...mockUsers.petowner, ...(data as any) } as R;
    }

    throw new Error(`Метод PUT для ${endpoint} не реализован в мокап API`);
  },

  delete: async <_T, R>(endpoint: string): Promise<R> => {
    await delay();

    // Удаление питомца
    if (endpoint.startsWith('/v1/pet/')) {
      const id = endpoint.split('/').pop();
      const index = mockPets.findIndex(p => p.id === id);
      if (index !== -1) {
        mockPets.splice(index, 1);
        return {} as R;
      }
      throw new Error('Питомец не найден');
    }

    // Удаление напоминания
    if (endpoint.startsWith('/v1/assistant/reminder/')) {
      const id = endpoint.split('/').pop();
      const index = mockReminders.findIndex(r => r.id === parseInt(id || '0'));
      if (index !== -1) {
        mockReminders.splice(index, 1);
        return {} as R;
      }
      throw new Error('Напоминание не найдено');
    }

    // Удаление товара
    if (endpoint.startsWith('/v1/reference/ref_shop/')) {
      const id = endpoint.split('/').pop();
      const index = mockProducts.findIndex(p => p.id === parseInt(id || '0'));
      if (index !== -1) {
        mockProducts.splice(index, 1);
        return {} as R;
      }
      throw new Error('Товар не найден');
    }

    throw new Error(`Метод DELETE для ${endpoint} не реализован в мокап API`);
  },
};

export { USE_MOCK_DATA };