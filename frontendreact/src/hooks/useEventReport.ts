import { useState, useCallback } from 'react';
import { fetchCarsByDriverAndPeriod, fetchEventsByPeriod, Car, Event } from '../services/eventService';

export function useCarsByDriverAndPeriod() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCars = useCallback(async (driverId: string, startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCarsByDriverAndPeriod(driverId, startDate, endDate);
      setCars(data);
    } catch {
      setError('Erro ao buscar carros do motorista no período');
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { cars, loading, error, loadCars };
}

export function useEventsByPeriod() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = useCallback(async (startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEventsByPeriod(startDate, endDate);
      setEvents(data);
    } catch {
      setError('Erro ao buscar eventos no período');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { events, loading, error, loadEvents };
}