import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getCars = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  if (!token) throw new Error('Token não encontrado');

  const response = await axios.get(`${API_URL}/cars`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.cars || [];
};

export async function createCar(data: any) {
  const token = await AsyncStorage.getItem('accessToken');
  if (!token) throw new Error('Token não encontrado');
  const response = await axios.post(`${API_URL}/cars`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function updateCar(id: string, data: any) {
  const token = await AsyncStorage.getItem('accessToken');
  if (!token) throw new Error('Token não encontrado');
  const response = await axios.patch(`${API_URL}/cars/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function deleteCar(id: string) {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) throw new Error('Token não encontrado');
    await axios.delete(`${API_URL}/cars/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function inactivateCar(carId: string) {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) throw new Error('Token não encontrado');
    await axios.patch(`${API_URL}/cars/inactivate/${carId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

