import { Either, left, right } from '@/core/errors/either'
import { CarRepository } from '../repositories/car-repository'
import { I18nService } from 'nestjs-i18n'
import { Car } from '../../enterprise/entities/car.entity'
import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

type ListCarServiceResponse = Either<ResourceNotFoundError, { cars: Car[] }>

@Injectable()
export class ListCarService {
  constructor(
    private carRepository: CarRepository,
    private i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute(): Promise<ListCarServiceResponse> {
    this.logger.log('Listing all cars', 'ListCarService')

    const cars = await this.carRepository.findAll()

    if (cars.length === 0) {
      const errorMessage = await this.i18n.translate('errors.car.notFound')
      this.logger.warn('No cars found during listing', 'ListCarService')
      return left(new ResourceNotFoundError(errorMessage))
    }

    this.logger.log(
      `Found ${cars.length} car(s) during listing`,
      'ListCarService',
    )
    return right({ cars })
  }
}
