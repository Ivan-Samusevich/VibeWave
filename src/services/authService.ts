import axios from 'axios';
import { User } from '../types/api';
import { jwtDecode } from 'jwt-decode';


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
    const response = await api.post<string>('/users/signin', {
      email: data.email,
      password: data.password,
    });
    
    // Бэкенд возвращает строку: "Авторизация прошла успешно <token>"
    const responseData = response.data;
    const parts = responseData.split(' ');
    const token = parts[parts.length - 1];
    
    if (!token || token.length < 20) {
      throw new Error('Не удалось получить токен авторизации');
    }

    // Декодируем токен для получения данных пользователя
    const decoded: any = jwtDecode(token);
    const user: User = {
      userId: decoded.userId,
      userName: decoded.userName || decoded.sub,
      email: data.email,
    };
    
    return {
      token,
      user,
      message: parts.slice(0, -1).join(' ')
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
