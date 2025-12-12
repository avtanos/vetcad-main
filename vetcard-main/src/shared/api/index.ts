// Для локальной разработки используем localhost, для продакшена - удаленный сервер
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Импортируем мокап API для GitHub Pages
import { mockApi, USE_MOCK_DATA } from './mockApi'; 

async function refreshAccessToken() {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) throw new Error('Нет refresh токена');
    const response = await fetch(`${API_BASE_URL}/v1/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
    });
    if (!response.ok) throw new Error('Не удалось обновить access токен');
    const data = await response.json();
    localStorage.setItem('authToken', data.access);
    return data.access;
}

async function fetchWithAuthRetry(input: RequestInfo, init?: RequestInit, retry = true): Promise<Response> {
    let accessToken = localStorage.getItem('authToken');
    // Добавляем токен только если он есть (для публичных endpoints это не обязательно)
    if (accessToken) {
        init = init || {};
        init.headers = {
            ...(init.headers || {}),
            Authorization: `Bearer ${accessToken}`,
        };
    }
    let response = await fetch(input, init);
    // Пытаемся обновить токен только если получили 401 и есть refresh токен
    if (response.status === 401 && retry && accessToken) {
        try {
            accessToken = await refreshAccessToken();
            if (accessToken) {
                init = init || {};
                init.headers = {
                    ...(init.headers || {}),
                    Authorization: `Bearer ${accessToken}`,
                };
            }
            response = await fetch(input, init);
        } catch {
            // Если не удалось обновить токен, возвращаем исходный ответ
            // Это позволит публичным endpoints работать без авторизации
        }
    }
    return response;
}

const handleResponse = async (response: Response) => {
    if (response.ok) {
        if (response.status === 204 || response.headers.get("Content-Length") === "0") {
            return null;
        }
        return response.json();
    } else {
        const errorData = await response.json().catch(() => ({}));
        // Бэкенд возвращает ошибки в поле 'detail', а не 'message'
        const errorMessage = errorData.detail || errorData.message || `Ошибка ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
    }
};

export const api = {
    post: async <T, R>(endpoint: string, data: T, headers?: Record<string, string>): Promise<R> => {
        // Используем мокап API для GitHub Pages
        if (USE_MOCK_DATA) {
            return mockApi.post<T, R>(endpoint, data);
        }
        const response = await fetchWithAuthRetry(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(headers || {}),
            },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },
    put: async <T, R>(endpoint: string, data: T, headers?: Record<string, string>): Promise<R> => {
        // Используем мокап API для GitHub Pages
        if (USE_MOCK_DATA) {
            return mockApi.put<T, R>(endpoint, data);
        }
        const response = await fetchWithAuthRetry(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(headers || {}),
            },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },
    get: async <R>(endpoint: string, headers?: Record<string, string>): Promise<R> => {
        // Используем мокап API для GitHub Pages
        if (USE_MOCK_DATA) {
            return mockApi.get<R>(endpoint);
        }
        const response = await fetchWithAuthRetry(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(headers || {}),
            },
        });
        return handleResponse(response);
    },
    delete: async <T, R>(endpoint: string, data?: T, headers?: Record<string, string>): Promise<R> => {
        // Используем мокап API для GitHub Pages
        if (USE_MOCK_DATA) {
            return mockApi.delete<T, R>(endpoint);
        }
        const response = await fetchWithAuthRetry(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(headers || {}),
            },
            body: data ? JSON.stringify(data) : undefined,
        });
        return handleResponse(response);
    },
};