import api from './api';

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cnh: string;
  cnhType: "A" | "B" | "C" | "D" | "E" | "AB" | "AC" | "AD" | "AE";
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
  createdAt: string;
  updatedAt: string;
}

export interface CreateDriverDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cnh: string;
  cnhType: "A" | "B" | "C" | "D" | "E" | "AB" | "AC" | "AD" | "AE";
  street: string;
  number: number;
  district: string;
  zipCode: string;
  city: string;
  state: string;
}

export async function fetchDrivers(): Promise<Driver[]> {
  const response = await api.get('/drivers');
  return (response.data as { drivers: Driver[] }).drivers;
}


export async function createDriver(data: CreateDriverDTO) {
  const response = await api.post('/drivers', data);
  return response.data;
}

export async function inactivateDriver(id: string) {
  const response = await api.patch(`/drivers/inactivate/${id}`);
  return response.data;
}

export async function updateDriver(id: string, data: Partial<CreateDriverDTO>) {
  const response = await api.patch(`/drivers/${id}`, data);
  return response.data;
}