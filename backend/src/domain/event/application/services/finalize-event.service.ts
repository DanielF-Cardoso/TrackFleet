import { Injectable } from '@nestjs/common'
import { EventRepository } from '../repositories/event-repository'
import { Either, left, right } from '@/core/errors/either'
import { CarRepository } from '@/domain/cars/application/repositories/car-repository'
import { I18nService } from 'nestjs-i18n'
import { OdometerValidation } from './validations/odometer.validation'
import { Event } from '../../enterprise/entities/event.entity'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { CarNotFoundError } from './errors/car-not-found.error'
import { EventAlreadyFinalizedError } from './errors/event-already-finalized.error'
import { InvalidOdometerError } from './errors/invalid-odometer.error'

interface FinalizeEventServiceRequest {
  eventId: string
  odometer: number
}

type FinalizeEventServiceResponse = Either<
  | ResourceNotFoundError
  | CarNotFoundError
  | EventAlreadyFinalizedError
  | InvalidOdometerError,
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
      return left(new ResourceNotFoundError(errorMessage))
    }

    if (event.status === 'ENTRY') {
      const errorMessage = await this.i18n.translate('event.alreadyFinalized')
      return left(new EventAlreadyFinalizedError(errorMessage))
    }

    const car = await this.carRepository.findById(event.carId.toValue())
    if (!car) {
      const errorMessage = await this.i18n.translate('car.notFound')
      return left(new CarNotFoundError(errorMessage))
    }

    if (odometer < event.odometer) {
      const errorMessage = await this.i18n.translate('event.invalidOdometer')
      return left(new InvalidOdometerError(errorMessage))
    }

    if (!OdometerValidation.validate(event.odometer, odometer)) {
      const errorMessage = await this.i18n.translate('event.odometerTooHigh')
      return left(new InvalidOdometerError(errorMessage))
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
