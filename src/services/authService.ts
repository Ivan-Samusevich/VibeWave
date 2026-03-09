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
    
    const message = response.data;
    
    return {
      token: 'dummy-token', 
      user: { email: data.email, userName: 'User' } as User,
      message
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
      token: 'dummy-token',
      user: { email: data.email, userName: data.fullName } as User,
      message
    };
  },
};

export default api;
