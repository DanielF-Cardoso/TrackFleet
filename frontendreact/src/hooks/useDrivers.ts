import { useEffect, useState, useCallback } from 'react';
import { Driver, fetchDrivers } from '../services/driverService';

export function useDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDrivers = useCallback(() => {
    setLoading(true);
    fetchDrivers()
      .then(data => {
        setDrivers(data);
        setError(null); // Limpa o erro em caso de sucesso
      })
      .catch(() => setError('Erro ao buscar motoristas'))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    loadDrivers();
  }, [loadDrivers]);

  return { drivers, loading, error, refetch: loadDrivers };
}