import api from './api';

export interface Fleet {
  id: string;
  managerId: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  odometer: number;
  status: 'AVAILABLE' | 'IN_USE' | 'IN_MAINTENANCE';
  renavam: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFleetDTO {
  brand: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  odometer: number;
  renavam: string;
}

export async function fetchFleets(): Promise<Fleet[]> {
  const response = await api.get('/cars');
  return (response.data as { cars: Fleet[] }).cars;
}

export async function createFleet(data: CreateFleetDTO) {
  const response = await api.post('/cars', data);
  return response.data;
}

export async function inactivateFleet(id: string) {
  const response = await api.patch(`/cars/inactivate/${id}`);
  return response.data;
}

export async function updateFleet(id: string, data: Partial<CreateFleetDTO>) {
  const response = await api.patch(`/cars/${id}`, data);
  return response.data;
}

export async function deleteFleet(id: string) {
  const response = await api.delete(`/cars/${id}`);
  return response.data;
}