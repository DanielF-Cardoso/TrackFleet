import api from './api';
import { Driver } from './driverService';
import { Fleet } from './fleetService';

export interface Event {
  id: string;
  carId: string;
  driverId: string;
  managerId: string;
  odometer: number;
  status: 'EXIT' | 'RETURN' | string;
  startAt: string;
  endAt: string | null;
  createdAt: string;
  car?: Fleet;
  driver?: Driver;
}

export interface CreateEventDTO {
  carId: string;
  driverId: string;
  managerId: string;
  odometer: number;
  status: 'EXIT' | 'RETURN' | string;
  startAt: string;
}

export async function fetchEvents(): Promise<Event[]> {
  const response = await api.get('/events');
  return (response.data as { events: Event[] }).events;
}

export async function createEvent(data: CreateEventDTO) {
  const response = await api.post('/events', data);
  return response.data;
}

export async function finalizeEvent(id: string, data: { odometer: number; endAt: string }) {
  const response = await api.patch(`/events/${id}/finalize`, data);
  return response.data;
}

export async function deleteEvent(id: string) {
  const response = await api.delete(`/events/${id}`);
  return response.data;
}