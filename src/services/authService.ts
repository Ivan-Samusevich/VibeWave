import axios from 'axios';
import { User } from '../types/api';
import { jwtDecode } from 'jwt-decode';

// Используем относительный путь /api, который будет проксироваться на бэкенд
const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (data: any) => {
    // Путь: /api/users/signin
    const response = await api.post<{ accessToken: string, tokenType: string }>('/users/signin', {
      email: data.email,
      password: data.password,
    });
    
    // Бэкенд возвращает JSON объект: { accessToken: "...", tokenType: "Bearer " }
    const { accessToken } = response.data;
    
    if (!accessToken) {
      throw new Error('Не удалось получить токен авторизации');
    }

    // Декодируем токен для получения данных пользователя
    const decoded: any = jwtDecode(accessToken);
    const user: User = {
      userId: decoded.userId,
      userName: decoded.userName || decoded.sub,
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
