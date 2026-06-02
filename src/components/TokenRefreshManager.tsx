import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { jwtDecode } from 'jwt-decode';
import { setCredentials, logout } from '../features/auth/authSlice';
import axios from 'axios';
import { AuthResponse } from '../types/api';

export const TokenRefresher: React.FC = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!token || !user) return;

    let timeoutId: NodeJS.Timeout;
    let isRefreshing = false;

    try {
      const decoded: any = jwtDecode(token);
      if (decoded && decoded.exp) {
        const expirationTime = decoded.exp * 1000;
        const currentTime = Date.now();
        
        const refreshThreshold = 90000; // 1.5 minutes
        const refreshTime = expirationTime - refreshThreshold;
        const delay = refreshTime - currentTime;
        const safeDelay = Math.max(delay, 5000);

        const runRefresh = async () => {
          if (isRefreshing) return;
          isRefreshing = true;
          
          try {
            const response = await axios.post<AuthResponse>(
              '/api/users/refresh',
              null,
              { withCredentials: true }
            );

            if (response.data && response.data.accessToken) {
              const { accessToken, userId, userName } = response.data;
              
              localStorage.setItem('token', accessToken);
              
              if (user) {
                dispatch(setCredentials({
                  token: accessToken,
                  user: {
                    userId: userId || user.userId,
                    userName: userName || user.userName,
                    email: user.email || ''
                  }
                }));
              }
              
              console.log('Token refreshed preemptively');
            }
          } catch (error) {
            console.error('Preemptive token refresh failed:', error);
            
            const stillValid = (decoded.exp * 1000) > Date.now();
            if (stillValid) {
              timeoutId = setTimeout(runRefresh, 30000);
            } else {
              dispatch(logout());
              window.location.href = '/login';
            }
          } finally {
            isRefreshing = false;
          }
        };

        timeoutId = setTimeout(runRefresh, safeDelay);
        console.log(`Token refresh scheduled in ${Math.round(safeDelay / 1000)} seconds`);
      }
    } catch (e) {
      console.error('Failed to decode token:', e);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [token, user, dispatch]);

  return null;
};