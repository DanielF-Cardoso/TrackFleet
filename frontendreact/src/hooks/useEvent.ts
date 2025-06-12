import { useEffect, useState, useCallback } from 'react';
import { fetchEvents, Event } from '../services/eventService';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = useCallback(() => {
    setLoading(true);
    fetchEvents()
      .then(data => {
        setEvents(data);
        setError(null);
      })
      .catch(() => setError('Erro ao buscar eventos'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return { events, loading, error, refetch: loadEvents };
}