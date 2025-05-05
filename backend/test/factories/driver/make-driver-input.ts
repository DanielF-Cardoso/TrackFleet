import { CreateDriverServiceRequest } from '@/domain/driver/application/services/create-driver.service'
import { faker } from '@faker-js/faker'

export function makeDriverInput(
  overrides: Partial<CreateDriverServiceRequest> = {},
) {
  return {
    firstName: overrides.firstName ?? faker.person.firstName(),
    lastName: overrides.lastName ?? faker.person.lastName(),
    email: overrides.email ?? faker.internet.email().toLowerCase(),
    cnh: overrides.cnh ?? '62050501904',
    cnhType:
      overrides.cnhType ??
      faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E']),
    phone:
      overrides.phone ??
      `11${faker.number.int({ min: 200000000, max: 999999999 })}`,
    street: overrides.street ?? faker.location.streetAddress(),
    number: overrides.number ?? faker.number.int({ min: 1, max: 1000 }),
    district: overrides.district ?? faker.location.street(),
    zipCode: overrides.zipCode ?? faker.location.zipCode('#####-###'),
    city: overrides.city ?? faker.location.city(),
    state: overrides.state ?? faker.location.state(),
  }
}
