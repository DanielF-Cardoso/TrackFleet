import { Either, left, right } from '@/core/errors/either'
import { CarRepository } from '../repositories/car-repository'
import { I18nService } from 'nestjs-i18n'
import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

export interface DeleteCarServiceRequest {
  carId: string
}

type DeleteCarServiceResponse = Either<ResourceNotFoundError, null>

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

    const car = await this.carRepository.findById(carId)

    if (!car) {
      const errorMessage = await this.i18n.translate('errors.car.notFound')
      this.logger.warn(
        `Car not found for deletion: ID ${carId}`,
        'DeleteCarService',
      )
      return left(new ResourceNotFoundError(errorMessage))
    }

    await this.carRepository.delete(car.id.toString())

    this.logger.log(
      `Car deleted successfully with ID: ${carId}`,
      'DeleteCarService',
    )

    return right(null)
  }
}
