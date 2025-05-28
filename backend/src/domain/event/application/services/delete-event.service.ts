import { Injectable } from '@nestjs/common'
import { EventRepository } from '../repositories/event-repository'
import { Either, left, right } from '@/core/errors/either'
import { I18nService } from 'nestjs-i18n'
import { CarRepository } from '@/domain/cars/application/repositories/car-repository'
import { CannotDeleteFinalizedEventError } from './errors/cannot-delete-finalized-event.error'
import { CarNotFoundError } from './errors/car-not-found.error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

interface DeleteEventServiceRequest {
  eventId: string
}

type DeleteEventServiceResponse = Either<
  ResourceNotFoundError | CannotDeleteFinalizedEventError | CarNotFoundError,
  void
>

@Injectable()
export class DeleteEventService {
  constructor(
    private eventRepository: EventRepository,
    private carRepository: CarRepository,
    private i18n: I18nService,
  ) {}

  async execute({
    eventId,
  }: DeleteEventServiceRequest): Promise<DeleteEventServiceResponse> {
    const event = await this.eventRepository.findById(eventId)
    if (!event) {
      const errorMessage = await this.i18n.translate('event.notFound')
      return left(new ResourceNotFoundError(errorMessage))
    }

    const car = await this.carRepository.findById(event.carId.toValue())
    if (!car) {
      const errorMessage = await this.i18n.translate('car.notFound')
      return left(new CarNotFoundError(errorMessage))
    }

    if (event.status === 'ENTRY') {
      const errorMessage = await this.i18n.translate(
        'event.cannotDeleteFinalized',
      )
      return left(new CannotDeleteFinalizedEventError(errorMessage))
    }

    car.updateStatus('AVAILABLE')
    await this.carRepository.save(car)

    await this.eventRepository.delete(eventId)

    return right(undefined)
  }
}
