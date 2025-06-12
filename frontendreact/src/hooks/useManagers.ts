import { useEffect, useState, useCallback } from 'react';
import { fetchManagers, Manager } from '../services/managerService';

export function useManagers() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadManagers = useCallback(() => {
    setLoading(true);
    fetchManagers()
      .then(data => {
        setManagers(data);
        setError(null);
      })
      .catch(() => setError('Erro ao buscar gestores'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadManagers();
  }, [loadManagers]);

  return { managers, loading, error, refetch: loadManagers };
}