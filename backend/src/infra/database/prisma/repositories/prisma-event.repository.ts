import { EventRepository } from '@/domain/event/application/repositories/event-repository'
import { Event } from '@/domain/event/enterprise/entities/event.entity'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaEventMapper } from '../mappers/prisma-event.mapper'

@Injectable()
export class PrismaEventRepository implements EventRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Event | null> {
    const event = await this.prisma.event.findUnique({
      where: { id },
    })

    if (!event) {
      return null
    }

    return PrismaEventMapper.toDomain(event)
  }

  async findActiveEventByCarId(carId: string): Promise<Event | null> {
    const event = await this.prisma.event.findFirst({
      where: {
        carId,
        status: 'EXIT',
      },
    })

    if (!event) {
      return null
    }

    return PrismaEventMapper.toDomain(event)
  }

  async findManyByCarId(carId: string): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      where: { carId },
    })

    return events.map(PrismaEventMapper.toDomain)
  }

  async findManyByDriverId(driverId: string): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      where: { driverId },
    })

    return events.map(PrismaEventMapper.toDomain)
  }

  async findActiveEventByDriverId(driverId: string): Promise<Event | null> {
    const event = await this.prisma.event.findFirst({
      where: {
        driverId,
        status: 'EXIT',
      },
    })

    if (!event) {
      return null
    }

    return PrismaEventMapper.toDomain(event)
  }

  async create(event: Event): Promise<void> {
    const data = PrismaEventMapper.toPersistence(event)

    await this.prisma.event.create({
      data,
    })
  }

  async save(event: Event): Promise<void> {
    const data = PrismaEventMapper.toPersistence(event)

    await this.prisma.event.update({
      where: { id: data.id },
      data,
    })
  }

  async delete(eventId: string): Promise<void> {
    await this.prisma.event.delete({
      where: { id: eventId },
    })
  }

  async findAll(): Promise<Event[]> {
    const events = await this.prisma.event.findMany()

    return events.map(PrismaEventMapper.toDomain)
  }
}
