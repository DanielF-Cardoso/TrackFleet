import { Either, left, right } from '@/core/errors/either'
import { CarRepository } from '../repositories/car-repository'
import { I18nService } from 'nestjs-i18n'
import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { EventRepository } from '@/domain/event/application/repositories/event-repository'
import { CarHasEventsError } from './errors/car-has-events-error'

export interface InactivateCarServiceRequest {
  carId: string
}

type InactivateCarServiceResponse = Either<
  ResourceNotFoundError | CarHasEventsError,
  null
>

@Injectable()
export class InactivateCarService {
  constructor(
    private carRepository: CarRepository,
    private i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
    private eventRepository: EventRepository,
  ) {}

  async execute({
    carId,
  }: InactivateCarServiceRequest): Promise<InactivateCarServiceResponse> {
    this.logger.log(
      `Attempting to inactivate car with ID: ${carId}`,
      'InactivateCarService',
    )

    const car = await this.carRepository.findById(carId)

    if (!car) {
      const errorMessage = await this.i18n.translate('errors.car.notFound')
      this.logger.warn(
        `Car not found for inactivation: ID ${carId}`,
        'InactivateCarService',
      )
      return left(new ResourceNotFoundError(errorMessage))
    }

    const events = await this.eventRepository.findManyByCarId(carId)
    const isInEvent = events.some((event) => event.status === 'EXIT')
    if (isInEvent) {
      const errorMessage = await this.i18n.translate('errors.car.hasEvents')
      this.logger.warn(
        `Car is currently in use and cannot be inactivated: ID ${carId}`,
        'InactivateCarService',
      )
      return left(new CarHasEventsError(errorMessage))
    }

    car.inactivate()
    await this.carRepository.save(car)

    this.logger.log(
      `Car inactivated successfully with ID: ${carId}`,
      'InactivateCarService',
    )

    return right(null)
  }
}
