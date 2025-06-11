import { LicensePlate } from '@/core/value-objects/license-plate.vo'
import { Renavam } from '@/core/value-objects/renavam.vo'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { faker } from '@faker-js/faker'
import { Car, CarStatus } from '@/domain/cars/enterprise/entities/car.entity'

interface MakeCarOverrides {
  carId?: string
  managerId?: string
  licensePlate?: string
  renavam?: string
  brand?: string
  model?: string
  year?: number
  color?: string
  odometer?: number
  status?: CarStatus
  isActive?: boolean
}

export function makeCar(overrides: MakeCarOverrides = {}): Car {
  const managerId = overrides.managerId
    ? new UniqueEntityID(overrides.managerId)
    : new UniqueEntityID()

  const licensePlateVo = new LicensePlate(overrides.licensePlate ?? 'AAA1A11')

  const renavamVo = new Renavam(overrides.renavam ?? faker.string.numeric(11))

  const car = Car.create(
    {
      managerId,
      licensePlate: licensePlateVo,
      brand: overrides.brand ?? faker.vehicle.manufacturer(),
      model: overrides.model ?? faker.vehicle.model(),
      year: overrides.year ?? faker.number.int({ min: 2000, max: 2025 }),
      color: overrides.color ?? faker.color.human(),
      odometer: overrides.odometer ?? faker.number.int({ min: 0, max: 100000 }),
      status: overrides.status ?? 'AVAILABLE',
      isActive: overrides.isActive ?? true,
      renavam: renavamVo,
    },
    overrides.carId ? new UniqueEntityID(overrides.carId) : undefined,
  )

  return car
}
