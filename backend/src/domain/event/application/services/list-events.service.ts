import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { EventRepository } from '../repositories/event-repository'
import { Either, left, right } from '@/core/errors/either'
import { Event } from '../../enterprise/entities/event.entity'
import { I18nService } from 'nestjs-i18n'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { CarRepository } from '@/domain/cars/application/repositories/car-repository'
import { DriverRepository } from '@/domain/driver/application/repositories/driver-repository'
import { Car } from '@/domain/cars/enterprise/entities/car.entity'
import { Driver } from '@/domain/driver/enterprise/entities/driver.entity'

type EventWithDetails = {
  event: Event
  car: Car | null
  driver: Driver | null
}

type ListEventsServiceResponse = Either<
  ResourceNotFoundError,
  {
    events: EventWithDetails[]
  }
>

@Injectable()
export class ListEventsService {
  constructor(
    private eventRepository: EventRepository,
    private carRepository: CarRepository,
    private driverRepository: DriverRepository,
    private i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute(): Promise<ListEventsServiceResponse> {
    this.logger.log('Fetching all events from repository', 'ListEventsService')

    const events = await this.eventRepository.findAll()

    if (!events.length) {
      const errorMessage = await this.i18n.translate('errors.event.notFound')
      this.logger.warn('No events found in the system', 'ListEventsService')
      return left(new ResourceNotFoundError(errorMessage))
    }

    const cars = await Promise.all(
      events.map((e) => this.carRepository.findById(e.carId.toString())),
    )
    const drivers = await Promise.all(
      events.map((e) => this.driverRepository.findById(e.driverId.toString())),
    )

    const eventsWithDetails = events.map((event, idx) => ({
      event,
      car: cars[idx],
      driver: drivers[idx],
    }))

    this.logger.log(
      `Successfully retrieved ${events.length} events`,
      'ListEventsService',
    )

    return right({
      events: eventsWithDetails,
    })
  }
}
