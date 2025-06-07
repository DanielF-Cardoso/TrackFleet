import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Event } from '@/domain/event/enterprise/entities/event.entity'
import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface MakePrismaEventData {
  carId?: string
  driverId?: string
  managerId?: string
  odometer?: number
  status?: 'ENTRY' | 'EXIT'
}

@Injectable()
export class EventFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaEvent(data: MakePrismaEventData = {}): Promise<Event> {
    const carId = data.carId ?? faker.string.uuid()
    const driverId = data.driverId ?? faker.string.uuid()
    const managerId = data.managerId ?? faker.string.uuid()
    const odometer = data.odometer ?? faker.number.int({ min: 0, max: 100000 })
    const status = data.status ?? 'EXIT'
    const now = new Date()

    const event = Event.create({
      carId: new UniqueEntityID(carId),
      driverId: new UniqueEntityID(driverId),
      managerId: new UniqueEntityID(managerId),
      odometer,
      status,
      startAt: now,
      endAt: status === 'ENTRY' ? now : undefined,
    })

    await this.prisma.event.create({
      data: {
        id: event.id.toString(),
        carId: event.carId.toString(),
        driverId: event.driverId.toString(),
        managerId: event.managerId.toString(),
        odometer: event.odometer,
        status: event.status,
        start_at: event.startAt,
        end_at: event.endAt,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      },
    })

    return event
  }
} 