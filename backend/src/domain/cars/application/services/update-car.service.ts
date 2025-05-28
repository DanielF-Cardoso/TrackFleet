import { Either, left, right } from '@/core/errors/either'
import { Car } from '../../enterprise/entities/car.entity'
import { CarRepository } from '../repositories/car-repository'
import { LicensePlate } from '@/core/value-objects/license-plate.vo'
import { I18nService } from 'nestjs-i18n'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { Renavam } from '@/core/value-objects/renavam.vo'
import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { LicensePlateAlreadyExistsError } from './errors/license-plate-already-exists.error'
import { RenavamAlreadyExistsError } from './errors/renavam-already-exists.error'

export interface UpdateCarServiceRequest {
  carId: string
  licensePlate?: string
  brand?: string
  model?: string
  year?: number
  color?: string
  odometer?: number
  renavam?: string
}

type UpdateCarServiceResponse = Either<
  | ResourceNotFoundError
  | LicensePlateAlreadyExistsError
  | RenavamAlreadyExistsError,
  { car: Car }
>

@Injectable()
export class UpdateCarService {
  constructor(
    private carRepository: CarRepository,
    private i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    carId,
    licensePlate,
    brand,
    model,
    year,
    color,
    odometer,
    renavam,
  }: UpdateCarServiceRequest): Promise<UpdateCarServiceResponse> {
    this.logger.log(
      `Attempting to update car with ID: ${carId}`,
      'UpdateCarService',
    )

    const car = await this.carRepository.findById(carId)

    if (!car) {
      const errorMessage = await this.i18n.translate('errors.car.notFound')
      this.logger.warn(
        `Car not found for update: ID ${carId}`,
        'UpdateCarService',
      )
      return left(new ResourceNotFoundError(errorMessage))
    }

    if (licensePlate) {
      const licensePlateVo = new LicensePlate(licensePlate)
      const existingCarByLicensePlate =
        await this.carRepository.findByLicensePlate(licensePlateVo.toValue())
      if (
        existingCarByLicensePlate &&
        !existingCarByLicensePlate.id.equals(car.id)
      ) {
        const errorMessage = await this.i18n.translate(
          'errors.car.licensePlateAlreadyExists',
        )
        this.logger.warn(
          `License plate already in use: ${licensePlate}`,
          'UpdateCarService',
        )
        return left(new LicensePlateAlreadyExistsError(errorMessage))
      }
      car.updateLicensePlate(licensePlateVo)
    }

    if (renavam) {
      const renavamVo = new Renavam(renavam)
      const existingCarByRenavam = await this.carRepository.findByRenavam(
        renavamVo.toValue(),
      )
      if (existingCarByRenavam && !existingCarByRenavam.id.equals(car.id)) {
        const errorMessage = await this.i18n.translate(
          'errors.car.renavamAlreadyExists',
        )
        this.logger.warn(
          `Renavam already in use: ${renavam}`,
          'UpdateCarService',
        )
        return left(new RenavamAlreadyExistsError(errorMessage))
      }
      car.updateRenavam(renavamVo)
    }

    car.updateCar({
      brand,
      model,
      year,
      color,
      odometer,
    })

    await this.carRepository.save(car)

    this.logger.log(
      `Car updated successfully with ID: ${carId}`,
      'UpdateCarService',
    )

    return right({ car })
  }
}
