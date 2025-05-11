import {
  Event,
  EventType,
} from '@/domain/event/enterprise/entities/event.entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface Override {
  carId?: UniqueEntityID
  driverId?: UniqueEntityID
  managerId?: UniqueEntityID
  odometer?: number
  status?: EventType
  startAt?: Date
  endAt?: Date
}

export function makeEvent(override: Override = {}) {
  const event = Event.create(
    {
      carId: override.carId ?? new UniqueEntityID(),
      driverId: override.driverId ?? new UniqueEntityID(),
      managerId: override.managerId ?? new UniqueEntityID(),
      odometer: override.odometer ?? 1000,
      status: override.status ?? 'ENTRY',
      startAt: override.startAt ?? new Date(),
      endAt: override.endAt,
    },
    new UniqueEntityID(),
  )

  return event
}
