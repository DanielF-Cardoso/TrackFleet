import { Either, left, right } from '@/core/errors/either'
import { CarRepository } from '../repositories/car-repository'
import { I18nService } from 'nestjs-i18n'
import { CarNotFoundError } from './errors/car-not-found'
import { Car } from '../../enterprise/entities/car.entity'

type ListCarServiceResponse = Either<CarNotFoundError, { findedAll: Car[] }>

export class ListCarService {
  constructor(
    private carRepository: CarRepository,
    private i18n: I18nService,
  ) {}

  async execute(): Promise<ListCarServiceResponse> {
    const findedAll = await this.carRepository.findAll()

    if (findedAll.length === 0) {
      const errorMessage = await this.i18n.translate('erros.car.notFound')
      return left(new CarNotFoundError(errorMessage))
    }

    return right({ findedAll })
  }
}
