import { Event } from '@/domain/event/enterprise/entities/event.entity'

export abstract class EventRepository {
  abstract findById(id: string): Promise<Event | null>
  abstract findActiveEventByCarId(carId: string): Promise<Event | null>
  abstract findManyByCarId(carId: string): Promise<Event[]>
  abstract findManyByPeriod(startDate: Date, endDate: Date): Promise<Event[]>

  abstract findManyByDriverAndPeriod(
    driverId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Event[]>

  abstract findManyByDriverId(driverId: string): Promise<Event[]>
  abstract findActiveEventByDriverId(driverId: string): Promise<Event | null>
  abstract create(event: Event): Promise<void>
  abstract save(event: Event): Promise<void>
  abstract delete(eventId: string): Promise<void>
  abstract findAll(): Promise<Event[]>
}
