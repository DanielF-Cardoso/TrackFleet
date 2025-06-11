import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { EventRepository } from '../repositories/event-repository'
import { CarRepository } from '@/domain/cars/application/repositories/car-repository'
import { Either, left, right } from '@/core/errors/either'
import { I18nService } from 'nestjs-i18n'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { Car } from '@/domain/cars/enterprise/entities/car.entity'

interface ListDriverCarsByPeriodServiceRequest {
  driverId: string
  startDate: Date
  endDate: Date
}

type ListDriverCarsByPeriodServiceResponse = Either<
  ResourceNotFoundError,
  { cars: Car[] }
>

@Injectable()
export class ListDriverCarsByPeriodService {
  constructor(
    private eventRepository: EventRepository,
    private carRepository: CarRepository,
    private i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    driverId,
    startDate,
    endDate,
  }: ListDriverCarsByPeriodServiceRequest): Promise<ListDriverCarsByPeriodServiceResponse> {
    this.logger.log(
      `Fetching cars used by driver ${driverId} between ${startDate} and ${endDate}`,
      'ListDriverCarsByPeriodService',
    )

    const events = await this.eventRepository.findManyByDriverAndPeriod(
      driverId,
      startDate,
      endDate,
    )

    if (!events.length) {
      const errorMessage = await this.i18n.translate('errors.event.notFound')
      this.logger.warn(
        'No events found for this driver in the given period',
        'ListDriverCarsByPeriodService',
      )
      return left(new ResourceNotFoundError(errorMessage))
    }

    const carIds = [...new Set(events.map((event) => event.carId.toString()))]
    const cars = await this.carRepository.findManyByIds(carIds)

    this.logger.log(
      `Successfully retrieved ${cars.length} cars used by driver`,
      'ListDriverCarsByPeriodService',
    )

    return right({ cars })
  }
}
