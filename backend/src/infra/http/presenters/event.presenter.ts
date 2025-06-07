import { Event } from '@/domain/event/enterprise/entities/event.entity'

export class EventPresenter {
  static toHTTP(event: Event) {
    return {
      id: event.id.toString(),
      carId: event.carId.toString(),
      driverId: event.driverId.toString(),
      managerId: event.managerId.toString(),
      odometer: event.odometer,
      status: event.status,
      startAt: event.startAt,
      endAt: event.endAt,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    }
  }
} 