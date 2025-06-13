import { useState, useEffect, useCallback } from 'react';
import { loginApi } from '@/services/api';
import { User, AuthState } from '@/types';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoggedIn: false,
    isLoading: false,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        setAuthState((prev) => ({
          ...prev,
          user: { email: '' } as User,
          isLoggedIn: true,
          isLoading: false,
        }));
      } else {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      setError(null);
      try {
        const accessToken = await loginApi(email, password);
        await AsyncStorage.setItem('accessToken', accessToken);
        setAuthState({
          user: { email } as User,
          isLoggedIn: true,
          isLoading: false,
        });
        router.replace('/(tabs)');
        return true;
      } catch (error: any) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        setError(error.message);
        throw error;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem('accessToken');
    setAuthState({
      user: null,
      isLoggedIn: false,
      isLoading: false,
    });
    router.replace('/');
  }, []);

  return {
    ...authState,
    login,
    logout,
    error,
  };
};