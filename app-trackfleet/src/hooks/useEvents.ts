import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { getEvents } from '@/services/eventService';

export function useEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [fetchEvents])
  );

  const activeEvents = events.filter(
    event => event.status === 'EXIT' && event.car?.status === 'IN_USE'
  );

  return { events, activeEvents, loading, error, refetchEvents: fetchEvents };
}

export function isValidOdometer(value: string): boolean {
    const num = parseInt(value, 10);
    return !isNaN(num) && num >= 0;
}