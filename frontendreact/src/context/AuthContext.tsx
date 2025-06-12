import React, { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { useCookies } from 'react-cookie';
import Preloader from '../components/Preloader';
import { env } from '../config/env';

interface Address {
  street: string;
  number: number;
  district: string;
  zipCode: string;
  city: string;
  state: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: Address;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

interface ManagerResponse {
  manager: User;
}

interface LoginResponse {
  accessToken: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(['TrackFleetToken']);

  const fetchUserData = async () => {
    try {
      const token = cookies.TrackFleetToken;
      if (!token) throw new Error('Token não encontrado');
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await api.get<ManagerResponse>('/managers/me');
      setUser(response.data.manager);
    } catch (error: any) {
      if (error.response?.status === 401) {
        removeCookie('TrackFleetToken', { path: '/' });
        delete api.defaults.headers.common['Authorization'];
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = cookies.TrackFleetToken;
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await fetchUserData();
      } else {
        setLoading(false);
      }
    };
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies.TrackFleetToken]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<LoginResponse>('/login', { email, password });
      const { accessToken } = response.data;
      setCookie('TrackFleetToken', accessToken, {
        path: '/',
        maxAge: 60 * 60 * 24,
        secure: env.VITE_ENV === 'production',
        sameSite: 'strict',
      });
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      await fetchUserData();
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Credenciais inválidas, verifique se o email e a senha estão corretos');
      }
      if (error.response?.status === 401) {
        throw new Error('Gestor inativo, entre em contato com o suporte');
      }
      throw new Error('Ocorreu um erro ao fazer login, tente novamente mais tarde');
    }
  };

  const logout = () => {
    removeCookie('TrackFleetToken', { path: '/' });
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 