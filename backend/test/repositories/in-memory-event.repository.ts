import { Event } from '@/domain/event/enterprise/entities/event.entity'
import { EventRepository } from '@/domain/event/application/repositories/event-repository'

export class InMemoryEventRepository implements EventRepository {
  public items: Event[] = []

  async findById(id: string): Promise<Event | null> {
    const event = this.items.find((item) => item.id.toValue() === id)
    return event || null
  }

  async findActiveEventByCarId(carId: string): Promise<Event | null> {
    const event = this.items.find(
      (item) => item.carId.toValue() === carId && !item.endAt,
    )
    return event || null
  }

  async findActiveEventByDriverId(driverId: string): Promise<Event | null> {
    const event = this.items.find(
      (item) => item.driverId.toValue() === driverId && !item.endAt,
    )
    return event || null
  }

  async findManyByCarId(carId: string): Promise<Event[]> {
    return this.items.filter((item) => item.carId.toValue() === carId)
  }

  async findManyByDriverId(driverId: string): Promise<Event[]> {
    return this.items.filter((item) => item.driverId.toValue() === driverId)
  }

  async create(event: Event): Promise<void> {
    this.items.push(event)
  }

  async save(event: Event): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(event.id))
    if (index >= 0) {
      this.items[index] = event
    }
  }

  async delete(eventId: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toValue() === eventId)
    if (index >= 0) {
      this.items.splice(index, 1)
    }
  }

  async findAll(): Promise<Event[]> {
    return this.items
  }
}
