import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getDrivers = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  if (!token) throw new Error('Token não encontrado');

  const response = await axios.get(`${API_URL}/drivers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.drivers || [];
};

export const createDriver = async (data: any) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (!token) throw new Error('Token não encontrado');

  const response = await axios.post(`${API_URL}/drivers`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateDriver = async (driverId: string, data: any) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (!token) throw new Error('Token não encontrado');

  const response = await axios.patch(`${API_URL}/drivers/${driverId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const inactivateDriver = async (driverId: string) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (!token) throw new Error('Token não encontrado');

  const response = await axios.patch(`${API_URL}/drivers/inactivate/${driverId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};