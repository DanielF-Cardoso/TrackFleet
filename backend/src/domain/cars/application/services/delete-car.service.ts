import { Either, left, right } from '@/core/errors/either'
import { CarRepository } from '../repositories/car-repository'
import { I18nService } from 'nestjs-i18n'
import { CarNotFoundError } from './errors/car-not-found'

export interface DeleteCarServiceRequest {
  carId: string
}

type DeleteCarServiceResponse = Either<CarNotFoundError, { sucess: true }>

export class DeleteCarService {
  constructor(
    private carRepository: CarRepository,
    private i18n: I18nService,
  ) {}

  async execute({
    carId,
  }: DeleteCarServiceRequest): Promise<DeleteCarServiceResponse> {
    const findedCar = await this.carRepository.findById(carId)

    if (!findedCar) {
      const errorMessage = await this.i18n.translate('erros.car.notFound')
      return left(new CarNotFoundError(errorMessage))
    }

    await this.carRepository.delete(findedCar.id.toString())
    return right({ sucess: true })
  }
}
