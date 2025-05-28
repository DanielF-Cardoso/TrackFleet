import { Injectable } from '@nestjs/common'
import { EventRepository } from '../repositories/event-repository'
import { Either, left, right } from '@/core/errors/either'
import { CarRepository } from '@/domain/cars/application/repositories/car-repository'
import { DriverRepository } from '@/domain/driver/application/repositories/driver-repository'
import { I18nService } from 'nestjs-i18n'
import { Event } from '../../enterprise/entities/event.entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DriverNotFoundError } from './errors/driver-not-found.error'
import { InvalidEventError } from './errors/invalid-event.error'
import { OdometerValidation } from './validations/odometer.validation'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { CarNotFoundError } from './errors/car-not-found.error'

interface CreateEventServiceRequest {
  carId: string
  driverId: string
  managerId: string
  odometer: number
}

type CreateEventServiceResponse = Either<
  | ResourceNotFoundError
  | DriverNotFoundError
  | InvalidEventError
  | CarNotFoundError,
  { event: Event }
>

@Injectable()
export class CreateEventService {
  constructor(
    private eventRepository: EventRepository,
    private carRepository: CarRepository,
    private driverRepository: DriverRepository,
    private i18n: I18nService,
  ) {}

  async execute({
    carId,
    driverId,
    managerId,
    odometer,
  }: CreateEventServiceRequest): Promise<CreateEventServiceResponse> {
    const car = await this.carRepository.findById(carId)
    if (!car) {
      const errorMessage = await this.i18n.translate('car.notFound')
      return left(new CarNotFoundError(errorMessage))
    }

    const driver = await this.driverRepository.findById(driverId)
    if (!driver) {
      const errorMessage = await this.i18n.translate('driver.notFound')
      return left(new DriverNotFoundError(errorMessage))
    }

    if (odometer < car.odometer) {
      const errorMessage = await this.i18n.translate('event.invalidOdometer')
      return left(new InvalidEventError(errorMessage))
    }

    if (!OdometerValidation.validate(car.odometer, odometer)) {
      const errorMessage = await this.i18n.translate('event.odometerTooHigh')
      return left(new InvalidEventError(errorMessage))
    }

    const activeEvent = await this.eventRepository.findActiveEventByCarId(carId)
    if (activeEvent) {
      const errorMessage = await this.i18n.translate('event.carInUse')
      return left(new InvalidEventError(errorMessage))
    }

    const now = new Date()

    const event = Event.create({
      carId: new UniqueEntityID(carId),
      driverId: new UniqueEntityID(driverId),
      managerId: new UniqueEntityID(managerId),
      odometer,
      status: 'EXIT',
      startAt: now,
      endAt: undefined,
    })

    car.updateStatus('IN_USE')
    await this.carRepository.save(car)

    await this.eventRepository.create(event)

    return right({ event })
  }
}
