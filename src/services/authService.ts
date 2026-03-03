import axios from 'axios';
import { User } from '../types/api';

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
    
    const token = response.data;
    
    return {
      token,
      user: { email: data.email, username: 'User' } as User,
    };
  },
  register: async (data: any) => {
    // Путь: /api/users/signup
    const response = await api.post<string>('/users/signup', {
      email: data.email,
      password: data.password,
      username: data.fullName,
    });
    
    const token = response.data;
    
    return {
      token,
      user: { email: data.email, username: data.fullName } as User,
    };
  },
};

export default api;
