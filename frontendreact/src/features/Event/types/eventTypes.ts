export interface Car {
  id: string;
  licensePlate: string;
  model: string;
}

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
}

export interface EventTypes {
  id: string;
  carId: string;
  driverId: string;
  managerId: string;
  odometer: number;
  status: string;
  startAt: string;
  endAt?: string;
  createdAt: string;
  car?: Car;
  driver?: Driver;
}

export interface EventFormData {
  managerId: string;
  carId: string;
  driverId: string;
  odometer: string;
  status: string;
  startAt: string;
  endAt?: string;
}

export interface EventTableData {
  id: string;
  carId: string;
  driverId: string;
  odometer: string;
  status: string;
  startAt: string;
  endAt?: string;
  createdAt: string;
  car?: Car;
  driver?: Driver;
}