import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const loginApi = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    return response.data.accessToken;
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error('Credenciais inválidas');
    }
    if (error.response?.status === 401) {
      throw new Error('Gestor inativo');
    }
    throw new Error('Erro ao conectar com o servidor');
  }
};