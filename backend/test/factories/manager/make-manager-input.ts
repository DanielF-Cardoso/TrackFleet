import { CreateManagerServiceRequest } from '@/domain/manager/application/services/create-manager.service'
import { faker } from '@faker-js/faker'

export function makeManagerInput(
  overrides: Partial<CreateManagerServiceRequest> = {},
) {
  return {
    firstName: overrides.firstName ?? faker.person.firstName(),
    lastName: overrides.lastName ?? faker.person.lastName(),
    email: overrides.email ?? faker.internet.email().toLowerCase(),
    password: overrides.password ?? faker.internet.password(),
    phone:
      overrides.phone ??
      `11${faker.number.int({ min: 200000000, max: 999999999 })}`,
    street: overrides.street ?? faker.location.street(),
    number: overrides.number ?? faker.number.int({ min: 1, max: 9999 }),
    district: overrides.district ?? faker.location.city(),
    zipCode: overrides.zipCode ?? faker.location.zipCode('#####-###'),
    city: overrides.city ?? faker.location.city(),
    state: overrides.state ?? faker.location.state(),
  }
}
