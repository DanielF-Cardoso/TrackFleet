
export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  odometer: number;
  renavam: string;
  status: 'AVAILABLE' | 'IN_USE' | 'IN_MAINTENANCE';
  isActive: boolean;
  managerId: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

export interface DashboardSummary {
  totalCars: number;
  totalKilometers: number;
  activeCars: number;
  recentlyAddedCars: Car[];
}

export interface ToastMessage {
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  brand: string;
  odometer: number;
  year: number;
  manager: string;
  status: 'available' | 'in_use' | 'maintenance';
  lastMaintenance?: string;
  nextMaintenance?: string;
}

export interface Manager {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    number: number;
    district: string;
    zipCode: string;
    city: string;
    state: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  inactiveAt?: string;
}