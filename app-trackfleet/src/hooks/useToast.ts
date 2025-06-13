import { useCallback } from 'react';
import { ToastMessage } from '../types';

export const useToast = () => {
  const showToast = useCallback((toast: ToastMessage) => {
    console.log(`TOAST: ${toast.type} - ${toast.message}`);
  }, []);

  return { showToast };
};