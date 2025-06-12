export interface FleetTypes {
  id: string;
  managerId: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  renavam: string;
  odometer: number;
  isActive: boolean;
  status: 'AVAILABLE' | 'IN_USE' | 'IN_MAINTENANCE';
}

export interface FleetFormData {
  licensePlate: string;
  brand: string;
  model: string;
  year: string;
  color: string;
  renavam: string;
  odometer: string;
  isActive: boolean;
  status: 'AVAILABLE' | 'IN_USE' | 'IN_MAINTENANCE';
}

export interface FleetTableData {
  id: string;
  brand: string;
  model: string;
  year: string;
  odometer: string;
  color: string;
  licensePlate: string;
  renavam: string;
  status: 'Ativo' | 'Inativo';
}