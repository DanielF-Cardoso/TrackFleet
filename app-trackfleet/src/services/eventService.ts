import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getEvents = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  if (!token) throw new Error('Token não encontrado');

  const response = await axios.get(`${API_URL}/events`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.events || [];
};

export const finalizeEvent = async (eventId: string, odometer: number) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (!token) throw new Error('Token não encontrado');

  const url = `${API_URL}/events/${eventId}/finalize`;
  const body = { odometer };

  const response = await axios.patch(
    url,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export async function createEvent(carId: string, driverId: string, odometer: number) {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) throw new Error('Token não encontrado');
    await axios.post(
        `${API_URL}/events`,
        { carId, driverId, odometer },
        { headers: { Authorization: `Bearer ${token}` } }
    );
}