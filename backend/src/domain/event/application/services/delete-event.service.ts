import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { EventRepository } from '../repositories/event-repository'
import { Either, left, right } from '@/core/errors/either'
import { I18nService } from 'nestjs-i18n'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { CarRepository } from '@/domain/cars/application/repositories/car-repository'
import { InvalidEventStatusError } from './errors/invalid-event-status.error'

interface DeleteEventServiceRequest {
  eventId: string
}

type DeleteEventServiceResponse = Either<
  ResourceNotFoundError | InvalidEventStatusError,
  null
>

@Injectable()
export class DeleteEventService {
  constructor(
    private eventRepository: EventRepository,
    private carRepository: CarRepository,
    private i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    eventId,
  }: DeleteEventServiceRequest): Promise<DeleteEventServiceResponse> {
    this.logger.log(
      `Attempting to delete event ${eventId}`,
      'DeleteEventService',
    )

    const event = await this.eventRepository.findById(eventId)

    if (!event) {
      const errorMessage = await this.i18n.translate('errors.event.notFound')
      this.logger.warn(`Event not found: ${eventId}`, 'DeleteEventService')
      return left(new ResourceNotFoundError(errorMessage))
    }

    if (event.status === 'ENTRY') {
      const errorMessage = await this.i18n.translate(
        'errors.event.cannotDeleteFinalized',
      )
      this.logger.warn(
        `Cannot delete finalized event ${eventId}`,
        'DeleteEventService',
      )
      return left(new InvalidEventStatusError(errorMessage))
    }

    const car = await this.carRepository.findById(event.carId.toString())
    if (!car) {
      const errorMessage = await this.i18n.translate('errors.car.notFound')
      this.logger.warn(
        `Car not found for event ${eventId}: ${event.carId.toString()}`,
        'DeleteEventService',
      )
      return left(new ResourceNotFoundError(errorMessage))
    }

    car.updateStatus('AVAILABLE')

    await this.eventRepository.delete(event.id.toString())

    this.logger.log(
      `Successfully deleted event ${eventId}`,
      'DeleteEventService',
    )

    return right(null)
  }
}
