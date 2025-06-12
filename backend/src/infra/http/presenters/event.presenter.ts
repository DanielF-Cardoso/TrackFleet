import { Event } from '@/domain/event/enterprise/entities/event.entity'
import { Car } from '@/domain/cars/enterprise/entities/car.entity'
import { Driver } from '@/domain/driver/enterprise/entities/driver.entity'
import { CarPresenter } from './car.presenter' // Crie se não existir
import { DriverPresenter } from './driver.presenter' // Crie se não existir

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

  static toHTTPWithDetails(
    event: Event,
    car: Car | null,
    driver: Driver | null,
  ) {
    return {
      ...EventPresenter.toHTTP(event),
      car: car ? CarPresenter.toHTTP(car) : null,
      driver: driver ? DriverPresenter.toHTTP(driver) : null,
    }
  }
}
