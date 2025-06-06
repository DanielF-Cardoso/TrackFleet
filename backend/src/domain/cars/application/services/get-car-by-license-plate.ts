import { Either, left, right } from '@/core/errors/either'
import { CarRepository } from '../repositories/car-repository'
import { I18nService } from 'nestjs-i18n'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { Car } from '../../enterprise/entities/car.entity'
import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'

export interface GetCarByLicensePlateServiceRequest {
  licensePlate: string
}

type GetCarByLicensePlateServiceResponse = Either<
  ResourceNotFoundError,
  { car: Car }
>

@Injectable()
export class GetCarByLicensePlateService {
  constructor(
    private carRepository: CarRepository,
    private i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    licensePlate,
  }: GetCarByLicensePlateServiceRequest): Promise<GetCarByLicensePlateServiceResponse> {
    this.logger.log(
      `Fetching car by license plate: ${licensePlate}`,
      'GetCarByLicensePlateService',
    )

    const car = await this.carRepository.findByLicensePlate(licensePlate)

    if (!car) {
      const errorMessage = await this.i18n.translate('errors.car.notFound')
      this.logger.warn(
        `Car not found for license plate: ${licensePlate}`,
        'GetCarByLicensePlateService',
      )
      return left(new ResourceNotFoundError(errorMessage))
    }

    this.logger.log(
      `Car found for license plate: ${licensePlate}`,
      'GetCarByLicensePlateService',
    )

    return right({ car })
  }
}
