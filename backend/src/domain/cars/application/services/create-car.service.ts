import { Either, left, right } from '@/core/errors/either'
import { Car } from '../../enterprise/entities/car.entity'
import { CarAlreadyExistsError } from './errors/car-already-exists-error'
import { CarRepository } from '../repositories/car-repository'
import { LicensePlate } from '@/core/value-objects/license-plate.vo'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { I18nService } from 'nestjs-i18n'
import { Renavam } from '@/core/value-objects/renavam.vo'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { Inject, Injectable, LoggerService } from '@nestjs/common'

export interface CreateCarServiceRequest {
  managerId: string
  licensePlate: string
  brand: string
  model: string
  year: number
  color: string
  odometer: number
  renavam: string
}

type CreateCarServiceResponse = Either<CarAlreadyExistsError, { car: Car }>

@Injectable()
export class CreateCarService {
  constructor(
    private carRepository: CarRepository,
    private i18n: I18nService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    managerId,
    licensePlate,
    brand,
    model,
    year,
    color,
    odometer,
    renavam,
  }: CreateCarServiceRequest): Promise<CreateCarServiceResponse> {
    this.logger.log(
      `Starting car creation with license plate: ${licensePlate}`,
      'CreateCarService',
    )

    const existingCar =
      await this.carRepository.findByLicensePlate(licensePlate)

    if (existingCar) {
      const errorMessage = await this.i18n.translate('errors.car.alreadyExists')
      this.logger.warn(
        `Car already exists with license plate: ${licensePlate}`,
        'CreateCarService',
      )
      return left(new CarAlreadyExistsError(errorMessage))
    }

    const existingCarByRenavam = await this.carRepository.findByRenavam(renavam)
    if (existingCarByRenavam) {
      const errorMessage = await this.i18n.translate('errors.car.alreadyExists')
      this.logger.warn(
        `Car already exists with renavam: ${renavam}`,
        'CreateCarService',
      )
      return left(new CarAlreadyExistsError(errorMessage))
    }

    const licensePlateVo = new LicensePlate(licensePlate)
    const renavamVo = new Renavam(renavam)

    const car = Car.create({
      managerId: new UniqueEntityID(managerId),
      licensePlate: licensePlateVo,
      brand,
      model,
      year,
      color,
      odometer,
      renavam: renavamVo,
      status: 'AVAILABLE',
    })

    await this.carRepository.create(car)

    this.logger.log(
      `Car created successfully with license plate: ${licensePlate}`,
      'CreateCarService',
    )

    return right({ car })
  }
}
