import axios from 'axios';
import { User } from '../types/api';
import { jwtDecode } from 'jwt-decode';

// Используем относительный путь /api, который будет проксироваться на бэкенд
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post<{ accessToken: string, userId: number, userName: string }>(
          '/api/users/refresh',
          null,
          { withCredentials: true }
        );
        const { accessToken } = refreshResponse.data;
        if (accessToken) {
          localStorage.setItem('token', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (data: any) => {
    // Путь: /api/users/signin
    const response = await api.post<{ accessToken: string, userId: number, userName: string }>('/users/signin', {
      email: data.email,
      password: data.password,
    });
    
    const { accessToken, userId, userName } = response.data;
    
    if (!accessToken) {
      throw new Error('Не удалось получить токен авторизации');
    }

    // Декодируем токен для получения данных пользователя или используем готовые данные
    let decoded: any = {};
    try {
      decoded = jwtDecode(accessToken);
    } catch (e) {
      console.error('Failed to decode token, using response values', e);
    }

    const user: User = {
      userId: userId || decoded.userId,
      userName: userName || decoded.userName || decoded.sub,
      email: data.email,
    };
    
    return {
      token: accessToken,
      user,
      message: 'Авторизация прошла успешно'
    };
  },
  register: async (data: any) => {
    // Путь: /api/users/signup
    const response = await api.post<string>('/users/signup', {
      email: data.email,
      password: data.password,
      userName: data.fullName,
    });
    
    const message = response.data;
    
    return {
      message
    };
  },
};

export default api;
