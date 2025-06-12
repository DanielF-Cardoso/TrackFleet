import { useEffect, useState, useCallback } from 'react';
import { fetchFleets, Fleet } from '../services/fleetService';

export function useFleets() {
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFleets = useCallback(() => {
    setLoading(true);
    fetchFleets()
      .then(data => {
        setFleets(data);
        setError(null);
      })
      .catch(() => setError('Erro ao buscar Carros'))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    loadFleets();
  }, [loadFleets]);

  return { fleets, loading, error, refetch: loadFleets };
}