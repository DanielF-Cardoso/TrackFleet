import { Either, left, right } from '@/core/errors/either'
import { Car } from '../../enterprise/entities/car.entity'
import { CarAlreadyExistsError } from './errors/car-already-exists-error'
import { CarRepository } from '../repositories/car-repository'
import { LicensePlate } from '@/core/value-objects/license-plate.vo'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

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

export class CreateCarService {
  constructor(private carRepository: CarRepository) {}

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
    const existingCar =
      await this.carRepository.findByLicensePlate(licensePlate)

    if (existingCar) {
      return left(new CarAlreadyExistsError())
    }

    const licensePlateVo = new LicensePlate(licensePlate)

    const car = Car.create({
      managerId: new UniqueEntityID(managerId),
      licensePlate: licensePlateVo,
      brand,
      model,
      year,
      color,
      odometer,
      renavam,
      status: 'AVAILABLE',
    })

    await this.carRepository.create(car)

    return right({ car })
  }
}
