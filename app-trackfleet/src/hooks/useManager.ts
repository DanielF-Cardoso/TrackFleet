import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { getManagers, createManager } from '@/services/managerService';

export function useManagers() {
  const [managers, setManagers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchManagers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getManagers();
      setManagers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchManagers();
    }, [fetchManagers])
  );

  const handleCreateManager = async (data: any) => {
    await createManager(data);
    await fetchManagers();
  };

  return { managers, loading, error, refetchManagers: fetchManagers, createManager: handleCreateManager };
}