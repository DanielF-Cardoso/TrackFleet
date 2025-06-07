import { Event } from '@/domain/event/enterprise/entities/event.entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Event as PrismaEvent, Prisma } from '@prisma/client'

export class PrismaEventMapper {
  static toDomain(raw: PrismaEvent): Event {
    const event = Event.create(
      {
        managerId: new UniqueEntityID(raw.managerId),
        driverId: new UniqueEntityID(raw.driverId),
        carId: new UniqueEntityID(raw.carId),
        odometer: raw.odometer,
        status: raw.status,
        startAt: raw.start_at,
        endAt: raw.end_at ?? undefined,
      },
      new UniqueEntityID(raw.id),
    )

    return event
  }

  static toPersistence(event: Event): Prisma.EventUncheckedCreateInput {
    return {
      id: event.id.toString(),
      managerId: event.managerId.toString(),
      driverId: event.driverId.toString(),
      carId: event.carId.toString(),
      odometer: event.odometer,
      status: event.status,
      start_at: event.startAt,
      end_at: event.endAt,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt ?? undefined,
    }
  }
} 