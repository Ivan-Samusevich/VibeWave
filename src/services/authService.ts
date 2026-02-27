import axios from 'axios';

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
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock response
    if (data.email === 'test@example.com' && data.password === 'password123') {
      return {
        user: { id: '1', email: data.email, name: 'Test User' },
        token: 'mock-jwt-token',
      };
    }
    throw new Error('Invalid email or password');
  },
  register: async (data: any) => {
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    return {
      user: { id: '2', email: data.email, name: data.fullName },
      token: 'mock-jwt-token-new',
    };
  },
};

export default api;
