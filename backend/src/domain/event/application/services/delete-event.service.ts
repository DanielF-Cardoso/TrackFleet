import { Injectable } from '@nestjs/common'
import { EventRepository } from '../repositories/event-repository'
import { Either, left, right } from '@/core/errors/either'
import { EventNotFoundError } from './errors/event-not-found.error'
import { I18nService } from 'nestjs-i18n'
import { CarRepository } from '@/domain/cars/application/repositories/car-repository'
import { InvalidEventError } from './errors/invalid-event.error'

interface DeleteEventServiceRequest {
  eventId: string
}

type DeleteEventServiceResponse = Either<
  EventNotFoundError | InvalidEventError,
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
      return left(new EventNotFoundError(errorMessage))
    }

    if (event.status === 'ENTRY') {
      const errorMessage = await this.i18n.translate(
        'event.cannotDeleteFinalized',
      )
      return left(new InvalidEventError(errorMessage))
    }

    const car = await this.carRepository.findById(event.carId.toValue())
    if (!car) {
      const errorMessage = await this.i18n.translate('car.notFound')
      return left(new InvalidEventError(errorMessage))
    }

    car.updateStatus('AVAILABLE')
    await this.carRepository.save(car)

    await this.eventRepository.delete(eventId)

    return right(undefined)
  }
}
