import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { EventRepository } from '../repositories/event-repository'
import { Either, left, right } from '@/core/errors/either'
import { I18nService } from 'nestjs-i18n'
import { Event } from '../../enterprise/entities/event.entity'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { CarRepository } from '@/domain/cars/application/repositories/car-repository'
import { InvalidOdometerError } from './errors/invalid-odometer.error'
import { InvalidEventStatusError } from './errors/invalid-event-status.error'

interface FinalizeEventServiceRequest {
  eventId: string
  odometer: number
}

type FinalizeEventServiceResponse = Either<
  ResourceNotFoundError | InvalidOdometerError | InvalidEventStatusError,
  {
    event: Event
  }
>

@Injectable()
export class FinalizeEventService {
  constructor(
    private eventRepository: EventRepository,
    private carRepository: CarRepository,
    private i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    eventId,
    odometer,
  }: FinalizeEventServiceRequest): Promise<FinalizeEventServiceResponse> {
    this.logger.log(
      `Attempting to finalize event ${eventId} with odometer ${odometer}`,
      'FinalizeEventService',
    )

    const event = await this.eventRepository.findById(eventId)

    if (!event) {
      const errorMessage = await this.i18n.translate('errors.event.notFound')
      this.logger.warn(`Event not found: ${eventId}`, 'FinalizeEventService')
      return left(new ResourceNotFoundError(errorMessage))
    }

    if (event.status !== 'EXIT') {
      const errorMessage = await this.i18n.translate(
        'errors.event.invalidStatus',
      )
      this.logger.warn(
        `Cannot finalize event ${eventId} with status ${event.status}`,
        'FinalizeEventService',
      )
      return left(new InvalidEventStatusError(errorMessage))
    }

    const car = await this.carRepository.findById(event.carId.toString())
    if (!car) {
      const errorMessage = await this.i18n.translate('errors.car.notFound')
      this.logger.warn(
        `Car not found for event ${eventId}: ${event.carId}`,
        'FinalizeEventService',
      )
      return left(new ResourceNotFoundError(errorMessage))
    }

    if (odometer < car.odometer) {
      const errorMessage = await this.i18n.translate(
        'errors.event.invalidOdometer',
      )
      this.logger.warn(
        `Invalid odometer value: ${odometer} (current: ${car.odometer})`,
        'FinalizeEventService',
      )
      return left(new InvalidOdometerError(errorMessage))
    }

    const now = new Date()
    event.finalize(now, odometer)
    car.updateStatus('AVAILABLE')
    car.updateOdometer(odometer)

    await this.carRepository.save(car)
    await this.eventRepository.save(event)

    this.logger.log(
      `Successfully finalized event ${eventId} with odometer ${odometer}`,
      'FinalizeEventService',
    )

    return right({
      event,
    })
  }
}
