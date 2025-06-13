import { useState, useEffect } from 'react';
import { getManagerProfile } from '@/services/managerService';
import { Manager } from '@/types';

export function useManagerProfile() {
  const [manager, setManager] = useState<Manager | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getManagerProfile();
        setManager(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { manager, loading, error };
}