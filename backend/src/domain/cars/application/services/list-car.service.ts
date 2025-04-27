import { Either, left, right } from '@/core/errors/either'
import { CarRepository } from '../repositories/car-repository'
import { I18nService } from 'nestjs-i18n'
import { CarNotFoundError } from './errors/car-not-found'
import { Car } from '../../enterprise/entities/car.entity'
import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'

type ListCarServiceResponse = Either<CarNotFoundError, { findedAll: Car[] }>

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

    const findedAll = await this.carRepository.findAll()

    if (findedAll.length === 0) {
      const errorMessage = await this.i18n.translate('errors.car.notFound')
      this.logger.warn('No cars found during listing', 'ListCarService')
      return left(new CarNotFoundError(errorMessage))
    }

    this.logger.log(
      `Found ${findedAll.length} car(s) during listing`,
      'ListCarService',
    )
    return right({ findedAll })
  }
}
