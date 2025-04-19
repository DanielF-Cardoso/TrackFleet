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
  }
}
