import { Either, left, right } from '@/core/errors/either'
import { Car } from '../../enterprise/entities/car.entity'
import { CarAlreadyExistsError } from './errors/car-already-exists-error'
import { CarRepository } from '../repositories/car-repository'
import { LicensePlate } from '@/core/value-objects/license-plate.vo'
import { I18nService } from 'nestjs-i18n'
import { CarNotFoundError } from './errors/car-not-found'
import { Renavam } from '@/core/value-objects/renavam.vo'
import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'

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
  CarAlreadyExistsError | CarNotFoundError,
  { findedCar: Car }
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

    const findedCar = await this.carRepository.findById(carId)

    if (!findedCar) {
      const errorMessage = await this.i18n.translate('errors.car.notFound')
      this.logger.warn(
        `Car not found for update: ID ${carId}`,
        'UpdateCarService',
      )
      return left(new CarNotFoundError(errorMessage))
    }

    if (licensePlate) {
      const licensePlateVo = new LicensePlate(licensePlate)
      const existingCar = await this.carRepository.findByLicensePlate(
        licensePlateVo.toValue(),
      )
      if (existingCar && !existingCar.id.equals(findedCar.id)) {
        const errorMessage = await this.i18n.translate(
          'errors.car.alreadyExists',
        )
        this.logger.warn(
          `License plate already in use: ${licensePlate}`,
          'UpdateCarService',
        )
        return left(new CarAlreadyExistsError(errorMessage))
      }
      findedCar.updateLicensePlate(licensePlateVo)
    }

    if (renavam) {
      const renavamVo = new Renavam(renavam)
      const existingRenavam = await this.carRepository.findByRenavam(
        renavamVo.toValue(),
      )
      if (existingRenavam && !existingRenavam.id.equals(findedCar.id)) {
        const errorMessage = await this.i18n.translate(
          'errors.car.alreadyExists',
        )
        this.logger.warn(
          `Renavam already in use: ${renavam}`,
          'UpdateCarService',
        )
        return left(new CarAlreadyExistsError(errorMessage))
      }
      findedCar.updateRenavam(renavamVo)
    }

    findedCar.updateCar({
      brand,
      model,
      year,
      color,
      odometer,
    })

    await this.carRepository.save(findedCar)

    this.logger.log(
      `Car updated successfully with ID: ${carId}`,
      'UpdateCarService',
    )

    return right({ findedCar })
  }
}
