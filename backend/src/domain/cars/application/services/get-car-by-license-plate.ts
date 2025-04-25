import { Either, left, right } from '@/core/errors/either'
import { CarRepository } from '../repositories/car-repository'
import { I18nService } from 'nestjs-i18n'
import { CarNotFoundError } from './errors/car-not-found'
import { Car } from '../../enterprise/entities/car.entity'

export interface GetCarByLicensePlateServiceRequest {
  licensePlate: string
}

type GetCarByLicensePlateServiceResponse = Either<
  CarNotFoundError,
  { car: Car }
>

export class GetCarByLicensePlateService {
  constructor(
    private carRepository: CarRepository,
    private i18n: I18nService,
  ) {}

  async execute({
    licensePlate,
  }: GetCarByLicensePlateServiceRequest): Promise<GetCarByLicensePlateServiceResponse> {
    const findedCar = await this.carRepository.findByLicensePlate(licensePlate)

    if (!findedCar) {
      const errorMessage = await this.i18n.translate('erros.car.notFound')
      return left(new CarNotFoundError(errorMessage))
    }

    return right({ car: findedCar })
  }
}
