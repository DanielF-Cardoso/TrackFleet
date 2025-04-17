import { CreateCarServiceRequest } from '@/domain/cars/application/services/create-car.service'
import { faker } from '@faker-js/faker'

export function makeCarInput(
  overrides: Partial<CreateCarServiceRequest> = {},
): CreateCarServiceRequest {
  return {
    managerId: faker.string.uuid(),
    brand: faker.vehicle.manufacturer(),
    model: faker.vehicle.model(),
    year: faker.number.int({ min: 2000, max: 2025 }),
    color: faker.color.human(),
    licensePlate: overrides.licensePlate ?? 'ABC1234',
    odometer: faker.number.int({ min: 0, max: 100000 }),
    renavam: faker.string.numeric(11),
    ...overrides,
  }
}
