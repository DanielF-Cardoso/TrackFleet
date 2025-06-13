import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getManagerProfile = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  if (!token) throw new Error('Token não encontrado');

  const response = await axios.get(`${API_URL}/managers/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.manager;
};

export const getManagers = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  if (!token) throw new Error('Token não encontrado');

  const response = await axios.get(`${API_URL}/managers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.managers || [];
};

export const createManager = async (data: any) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (!token) throw new Error('Token não encontrado');

  const response = await axios.post(`${API_URL}/managers`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateManager = async (managerId: string, data: any) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (!token) throw new Error('Token não encontrado');

  const response = await axios.patch(`${API_URL}/managers/${managerId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const inactivateManager = async (managerId: string) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (!token) throw new Error('Token não encontrado');

  const response = await axios.patch(`${API_URL}/managers/inactivate/${managerId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

