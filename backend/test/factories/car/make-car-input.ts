import { CreateCarServiceRequest } from '@/domain/cars/application/services/create-car.service'
import { faker } from '@faker-js/faker'

export function makeCarInput(
  overrides: Partial<CreateCarServiceRequest> = {},
): CreateCarServiceRequest {
  const generateLicensePlate = () => {
    const isMercosul = faker.datatype.boolean()
    if (isMercosul) {
      // Mercosul format: BRA1A23
      const letters = faker.string.alpha({ length: 3, casing: 'upper' })
      const number = faker.number.int({ min: 0, max: 9 })
      const letterOrNumber = faker.helpers.arrayElement([
        ...faker.string.alpha({ length: 1, casing: 'upper' }),
        faker.number.int({ min: 0, max: 9 }).toString(),
      ])
      const lastNumbers = faker.number
        .int({ min: 10, max: 99 })
        .toString()
        .padStart(2, '0')
      return `${letters}${number}${letterOrNumber}${lastNumbers}`
    } else {
      // Old format: ABC1234
      const letters = faker.string.alpha({ length: 3, casing: 'upper' })
      const numbers = faker.number.int({ min: 1000, max: 9999 }).toString()
      return `${letters}${numbers}`
    }
  }

  return {
    managerId: faker.string.uuid(),
    brand: faker.vehicle.manufacturer(),
    model: faker.vehicle.model(),
    year: faker.number.int({ min: 2000, max: 2025 }),
    color: faker.color.human(),
    licensePlate: overrides.licensePlate ?? generateLicensePlate(),
    odometer: faker.number.int({ min: 0, max: 100000 }),
    renavam: overrides.renavam ?? faker.string.numeric(11),
    ...overrides,
  }
}
