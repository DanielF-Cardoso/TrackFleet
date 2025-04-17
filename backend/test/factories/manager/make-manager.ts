import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Email } from '@/core/value-objects/email.vo'
import { Name } from '@/core/value-objects/name.vo'
import { Manager } from '@/domain/manager/enterprise/entities/manager.entity'

interface Override {
  name?: Name
  email?: Email
  password?: string
}

export function makeManager(
  override: Override = {},
  id?: UniqueEntityID,
): Manager {
  const name =
    override.name ?? new Name(faker.person.firstName(), faker.person.lastName())
  const email = override.email ?? new Email(faker.internet.email())
  const password = override.password ?? 'hashed-password'

  return Manager.create({ name, email, password }, id)
}
