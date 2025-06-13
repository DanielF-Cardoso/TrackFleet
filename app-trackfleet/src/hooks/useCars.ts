import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { getCars } from '@/services/carService';
import { Car } from '@/types';

export function useCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetchCars = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCars();
      setCars(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchCars = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getCars();
          if (isActive) setCars(data);
        } catch (err: any) {
          if (isActive) setError(err.message);
        } finally {
          if (isActive) setLoading(false);
        }
      };
      fetchCars();
      return () => {
        isActive = false;
      };
    }, [])
  );

  const totalCars = cars.length;
  const totalKilometers = cars.reduce((sum, car) => sum + (car.odometer || 0), 0);
  const activeCars = cars.filter(car => car.status === 'IN_USE').length;

  return { cars, totalCars, totalKilometers, activeCars, loading, error, refetchCars };
}