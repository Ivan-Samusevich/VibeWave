import axios from 'axios';
import { User, AuthResponse } from '../types/api';
import { jwtDecode } from 'jwt-decode';
import { store } from '../store';
import { setCredentials, logout } from '../features/auth/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api' || '/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function refreshAccessToken(): Promise<AuthResponse> {
  const response = await axios.post<AuthResponse>(
    '/api/users/refresh',
    null,
    { withCredentials: true }
  );
  return response.data;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await refreshAccessToken();
        const { accessToken, userId, userName } = refreshResponse;
        
        if (accessToken) {
          localStorage.setItem('token', accessToken);
          
          const storedUser = localStorage.getItem('user');
          let currentUser = null;
          if (storedUser) {
            try {
              currentUser = JSON.parse(storedUser);
            } catch (e) {
              console.error('Failed to parse user from localStorage', e);
            }
          }
          if (currentUser && userId && userName) {
            store.dispatch(setCredentials({
              token: accessToken,
              user: {
                userId: userId,
                userName: userName,
                email: currentUser.email || ''
              }
            }));
          }
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (data: any) => {
    const response = await api.post<AuthResponse>('/users/signin', {
      email: data.email,
      password: data.password,
    });
    
    const authResponse = response.data;
    const { accessToken, userId, userName } = authResponse;
    
    if (!accessToken) {
      throw new Error('Не удалось получить токен авторизации');
    }

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
  refreshToken: async (): Promise<AuthResponse> => {
    return refreshAccessToken();
  },
  register: async (data: any) => {
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