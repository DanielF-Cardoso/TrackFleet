import { Injectable } from '@nestjs/common'
import { EventRepository } from '../repositories/event-repository'
import { Either, left, right } from '@/core/errors/either'
import { CarRepository } from '@/domain/cars/application/repositories/car-repository'
import { I18nService } from 'nestjs-i18n'
import { InvalidEventError } from './errors/invalid-event.error'
import { OdometerValidation } from './validations/odometer.validation'
import { EventNotFoundError } from './errors/event-not-found.error'
import { Event } from '../../enterprise/entities/event.entity'

interface FinalizeEventServiceRequest {
  eventId: string
  odometer: number
}

type FinalizeEventServiceResponse = Either<
  EventNotFoundError | InvalidEventError,
  { event: Event }
>

@Injectable()
export class FinalizeEventService {
  constructor(
    private eventRepository: EventRepository,
    private carRepository: CarRepository,
    private i18n: I18nService,
  ) {}

  async execute({
    eventId,
    odometer,
  }: FinalizeEventServiceRequest): Promise<FinalizeEventServiceResponse> {
    const event = await this.eventRepository.findById(eventId)
    if (!event) {
      const errorMessage = await this.i18n.translate('event.notFound')
      return left(new EventNotFoundError(errorMessage))
    }

    if (event.status === 'ENTRY') {
      const errorMessage = await this.i18n.translate('event.alreadyFinalized')
      return left(new InvalidEventError(errorMessage))
    }

    const car = await this.carRepository.findById(event.carId.toValue())
    if (!car) {
      const errorMessage = await this.i18n.translate('car.notFound')
      return left(new InvalidEventError(errorMessage))
    }

    if (odometer < event.odometer) {
      const errorMessage = await this.i18n.translate('event.invalidOdometer')
      return left(new InvalidEventError(errorMessage))
    }

    if (!OdometerValidation.validate(event.odometer, odometer)) {
      const errorMessage = await this.i18n.translate('event.odometerTooHigh')
      return left(new InvalidEventError(errorMessage))
    }

    const now = new Date()
    event.finalize(now, odometer)

    car.updateOdometer(odometer)
    car.updateStatus('AVAILABLE')
    await this.carRepository.save(car)

    await this.eventRepository.save(event)

    return right({ event })
  }
}
