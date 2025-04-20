import { Either, left, right } from '@/core/errors/either'
import { Car } from '../../enterprise/entities/car.entity'
import { CarAlreadyExistsError } from './errors/car-already-exists-error'
import { CarRepository } from '../repositories/car-repository'
import { LicensePlate } from '@/core/value-objects/license-plate.vo'
import { I18nService } from 'nestjs-i18n'
import { CarNotFoundError } from './errors/car-not-found'

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

export class UpdateCarService {
  constructor(
    private carRepository: CarRepository,
    private i18n: I18nService,
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
    const findedCar = await this.carRepository.findById(carId)

    if (!findedCar) {
      const errorMessage = await this.i18n.translate('erros.car.notFound')
      return left(new CarNotFoundError(errorMessage))
    }

    if (licensePlate) {
      const licensePlateVo = new LicensePlate(licensePlate)
      const existingCar = await this.carRepository.findByLicensePlate(
        licensePlateVo.toValue(),
      )
      if (existingCar && existingCar.id.equals(findedCar.id)) {
        const errorMessage = await this.i18n.translate(
          'erros.car.alreadyExists',
        )
        return left(new CarAlreadyExistsError(errorMessage))
      }
      findedCar.updateLicensePlate(licensePlateVo)
    }

    if (renavam) {
      const existingRenavam = await this.carRepository.findByRenavam(renavam)
      if (existingRenavam && existingRenavam.id.equals(findedCar.id)) {
        const errorMessage = await this.i18n.translate(
          'erros.car.alreadyExists',
        )
        return left(new CarAlreadyExistsError(errorMessage))
      }
      findedCar.updateRenavam(renavam)
    }

    findedCar.updateCar({
      brand,
      model,
      year,
      color,
      odometer,
    })

    await this.carRepository.save(findedCar)

    return right({ findedCar })
  }
}
