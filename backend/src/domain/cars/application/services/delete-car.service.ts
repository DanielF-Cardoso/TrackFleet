import { Either, left, right } from '@/core/errors/either'
import { CarRepository } from '../repositories/car-repository'
import { I18nService } from 'nestjs-i18n'
import { CarNotFoundError } from './errors/car-not-found'
import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'

export interface DeleteCarServiceRequest {
  carId: string
}

type DeleteCarServiceResponse = Either<CarNotFoundError, { sucess: true }>

@Injectable()
export class DeleteCarService {
  constructor(
    private carRepository: CarRepository,
    private i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    carId,
  }: DeleteCarServiceRequest): Promise<DeleteCarServiceResponse> {
    this.logger.log(
      `Attempting to delete car with ID: ${carId}`,
      'DeleteCarService',
    )

    const findedCar = await this.carRepository.findById(carId)

    if (!findedCar) {
      const errorMessage = await this.i18n.translate('errors.car.notFound')
      this.logger.warn(
        `Car not found for deletion: ID ${carId}`,
        'DeleteCarService',
      )
      return left(new CarNotFoundError(errorMessage))
    }

    await this.carRepository.delete(findedCar.id.toString())

    this.logger.log(
      `Car deleted successfully with ID: ${carId}`,
      'DeleteCarService',
    )

    return right({ sucess: true })
  }
}
