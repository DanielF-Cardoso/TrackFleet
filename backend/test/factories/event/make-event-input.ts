import { EventType } from '@/domain/event/enterprise/entities/event.entity'

interface Override {
  carId?: string
  driverId?: string
  managerId?: string
  odometer?: number
  status?: EventType
}

export function makeEventInput(override: Override = {}) {
  return {
    carId: 'car-1',
    driverId: 'driver-1',
    managerId: 'manager-1',
    odometer: 1000,
    status: 'ENTRY' as EventType,
    ...override,
  }
}
