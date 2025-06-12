import api from './api';

export interface Manager {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    number: number;
    district: string;
    zipCode: string;
    city: string;
    state: string;
  };
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateManagerDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  street: string;
  number: number;
  district: string;
  zipCode: string;
  city: string;
  state: string;
}

export async function fetchManagers(): Promise<Manager[]> {
  const response = await api.get('/managers');
  return (response.data as { managers: Manager[] }).managers;
}


export async function createManager(data: CreateManagerDTO) {
  const response = await api.post('/managers', data);
  return response.data;
}

export async function inactivateManager(id: string) {
  const response = await api.patch(`/managers/inactivate/${id}`);
  return response.data;
}

export async function updateManager(id: string, data: Partial<CreateManagerDTO>) {
  const response = await api.patch(`/managers/${id}`, data);
  return response.data;
}