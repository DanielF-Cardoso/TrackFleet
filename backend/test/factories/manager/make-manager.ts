import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Email } from '@/core/value-objects/email.vo'
import { Name } from '@/core/value-objects/name.vo'
import { Manager } from '@/domain/manager/enterprise/entities/manager.entity'
import { Address } from '@/core/value-objects/address.vo'
import { Phone } from '@/core/value-objects/phone.vo'

interface Override {
  name?: Name
  email?: Email
  password?: string
  phone?: Phone
  street?: string
  number?: number
  district?: string
  zipCode?: string
  city?: string
  state?: string
  isActive?: boolean
}

export function makeManager(
  override: Override = {},
  id?: UniqueEntityID,
): Manager {
  const name =
    override.name ?? new Name(faker.person.firstName(), faker.person.lastName())

  const email = override.email ?? new Email(faker.internet.email())

  const password = override.password ?? 'hashed-password'

  const phone =
    override.phone ??
    new Phone(`77${faker.number.int({ min: 200000000, max: 999999999 })}`)

  const street = override.street ?? faker.location.street()

  const number = override.number ?? faker.number.int({ min: 1, max: 9999 })

  const district = override.district ?? faker.location.city()

  const zipCode = override.zipCode ?? faker.location.zipCode('#####-###')

  const city = override.city ?? faker.location.city()

  const state = override.state ?? faker.location.state()

  return Manager.create(
    {
      name,
      email,
      password,
      phone,
      isActive: override.isActive ?? true,
      address: new Address(street, number, district, zipCode, city, state),
    },
    id,
  )
}
