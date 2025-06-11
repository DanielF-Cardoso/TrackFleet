import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { LicensePlate } from '@/core/value-objects/license-plate.vo'
import { Renavam } from '@/core/value-objects/renavam.vo'
import { Car } from '@/domain/cars/enterprise/entities/car.entity'
import { Cars as PrismaCar, Prisma } from '@prisma/client'

export class PrismaCarMapper {
  static toDomain(raw: PrismaCar): Car {
    const car = Car.create(
      {
        managerId: new UniqueEntityID(raw.managerId),
        licensePlate: new LicensePlate(raw.licensePlate),
        brand: raw.brand,
        model: raw.model,
        year: raw.year,
        color: raw.color,
        odometer: raw.odometer,
        status: raw.status as 'AVAILABLE' | 'IN_USE' | 'IN_MAINTENANCE',
        renavam: new Renavam(raw.renavam),
        isActive: raw.isActive,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityID(raw.id),
    )

    return car
  }

  static toPersistence(car: Car): Prisma.CarsUncheckedCreateInput {
    return {
      id: car.id.toString(),
      managerId: car.managerId.toString(),
      licensePlate: car.licensePlate.toValue(),
      brand: car.brand,
      model: car.model,
      year: car.year,
      color: car.color,
      odometer: car.odometer,
      status: car.status,
      renavam: car.renavam.toValue(),
      createdAt: car.createdAt,
      updatedAt: car.updatedAt ?? undefined,
    }
  }
}
