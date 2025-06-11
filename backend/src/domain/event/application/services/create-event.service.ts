import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { EventRepository } from '../repositories/event-repository'
import { Either, left, right } from '@/core/errors/either'
import { CarRepository } from '@/domain/cars/application/repositories/car-repository'
import { DriverRepository } from '@/domain/driver/application/repositories/driver-repository'
import { I18nService } from 'nestjs-i18n'
import { Event } from '../../enterprise/entities/event.entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DriverNotFoundError } from './errors/driver-not-found.error'
import { OdometerValidation } from './validations/odometer.validation'
import { CarNotFoundError } from './errors/car-not-found.error'
import { CarInUseError } from './errors/car-in-use.error'
import { InvalidOdometerError } from './errors/invalid-odometer.error'
import { OdometerToHighError } from './errors/odometer-to-high.error'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { InactiveDriverError } from './errors/inactive-driver.error'
import { InactiveCarError } from './errors/inactive-car.error'

interface CreateEventServiceRequest {
  carId: string
  driverId: string
  managerId: string
  odometer: number
}

type CreateEventServiceResponse = Either<
  | DriverNotFoundError
  | CarNotFoundError
  | CarInUseError
  | InvalidOdometerError
  | OdometerToHighError,
  { event: Event }
>

@Injectable()
export class CreateEventService {
  constructor(
    private eventRepository: EventRepository,
    private carRepository: CarRepository,
    private driverRepository: DriverRepository,
    private i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    carId,
    driverId,
    managerId,
    odometer,
  }: CreateEventServiceRequest): Promise<CreateEventServiceResponse> {
    this.logger.log(
      `Creating event for car ${carId} with driver ${driverId}`,
      'CreateEventService',
    )

    const car = await this.carRepository.findById(carId)
    if (!car) {
      const errorMessage = await this.i18n.translate('car.notFound')
      this.logger.warn(`Car not found: ${carId}`, 'CreateEventService')
      return left(new CarNotFoundError(errorMessage))
    }
    if (car.isActive === false) {
      const errorMessage = await this.i18n.translate('car.inactive')
      this.logger.warn(`Car is inactive: ${carId}`, 'CreateEventService')
      return left(new InactiveCarError(errorMessage))
    }

    const driver = await this.driverRepository.findById(driverId)
    if (!driver) {
      const errorMessage = await this.i18n.translate('driver.notFound')
      this.logger.warn(`Driver not found: ${driverId}`, 'CreateEventService')
      return left(new DriverNotFoundError(errorMessage))
    }
    if (driver.isActive === false) {
      const errorMessage = await this.i18n.translate('driver.inactive')
      this.logger.warn(`Driver is inactive: ${driverId}`, 'CreateEventService')
      return left(new InactiveDriverError(errorMessage))
    }

    if (odometer < car.odometer) {
      const errorMessage = await this.i18n.translate('event.invalidOdometer')
      this.logger.warn(
        `Invalid odometer value: ${odometer} (current: ${car.odometer})`,
        'CreateEventService',
      )
      return left(new InvalidOdometerError(errorMessage))
    }

    if (!OdometerValidation.validate(car.odometer, odometer)) {
      const errorMessage = await this.i18n.translate('event.odometerTooHigh')
      this.logger.warn(
        `Odometer increase too high: ${odometer} (current: ${car.odometer})`,
        'CreateEventService',
      )
      return left(new OdometerToHighError(errorMessage))
    }

    const activeEvent = await this.eventRepository.findActiveEventByCarId(carId)
    if (activeEvent) {
      const errorMessage = await this.i18n.translate('event.carInUse')
      this.logger.warn(`Car already in use: ${carId}`, 'CreateEventService')
      return left(new CarInUseError(errorMessage))
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

    this.logger.log(
      `Event created successfully for car ${carId} with driver ${driverId}`,
      'CreateEventService',
    )

    return right({ event })
  }
}
