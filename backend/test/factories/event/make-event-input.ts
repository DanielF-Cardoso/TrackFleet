interface Override {
  carId?: string
  driverId?: string
  managerId?: string
  odometer?: number
}

export function makeEventInput(override: Override = {}) {
  return {
    carId: 'car-1',
    driverId: 'driver-1',
    managerId: 'manager-1',
    odometer: 1000,
    ...override,
  }
}
