import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { getDrivers } from '@/services/driverService';

export function useDrivers() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDrivers();
      setDrivers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchAndSet = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getDrivers();
          if (isActive) setDrivers(data);
        } catch (err: any) {
          if (isActive) setError(err.message);
        } finally {
          if (isActive) setLoading(false);
        }
      };
      fetchAndSet();
      return () => {
        isActive = false;
      };
    }, [])
  );

  return { drivers, loading, error, refetchDrivers: fetchDrivers };
}