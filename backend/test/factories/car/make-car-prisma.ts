import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaCarMapper } from '@/infra/database/prisma/mappers/prisma-car.mapper'
import { Car } from '@/domain/cars/enterprise/entities/car.entity'
import { faker } from '@faker-js/faker'
import { LicensePlate } from '@/core/value-objects/license-plate.vo'
import { Renavam } from '@/core/value-objects/renavam.vo'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface MakePrismaCarData {
  managerId?: string
  licensePlate?: string
  brand?: string
  model?: string
  year?: number
  color?: string
  odometer?: number
  renavam?: string
}

@Injectable()
export class CarFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCar(data: MakePrismaCarData = {}): Promise<Car> {
    const managerId = data.managerId ?? faker.string.uuid()
    const licensePlate = data.licensePlate ?? 'ABC1234'
    const brand = data.brand ?? faker.vehicle.manufacturer()
    const model = data.model ?? faker.vehicle.model()
    const year = data.year ?? faker.number.int({ min: 2000, max: 2025 })
    const color = data.color ?? faker.vehicle.color()
    const odometer = data.odometer ?? faker.number.int({ min: 0, max: 100000 })
    const renavam = data.renavam ?? faker.string.numeric(11)

    const car = Car.create({
      managerId: new UniqueEntityID(managerId),
      licensePlate: new LicensePlate(licensePlate),
      brand,
      model,
      year,
      color,
      odometer,
      renavam: new Renavam(renavam),
      status: 'AVAILABLE',
    })

    await this.prisma.cars.create({
      data: PrismaCarMapper.toPersistence(car),
    })

    return car
  }
}
