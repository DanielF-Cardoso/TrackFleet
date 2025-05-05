import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Email } from '@/core/value-objects/email.vo'
import { Name } from '@/core/value-objects/name.vo'
import { Driver } from '@/domain/driver/enterprise/entities/driver.entity'
import { Address } from '@/core/value-objects/address.vo'
import { Phone } from '@/core/value-objects/phone.vo'
import { Cnh } from '@/core/value-objects/cnh.vo'
import { CnhType } from '@prisma/client'

interface Override {
  name?: Name
  email?: Email
  phone?: Phone
  cnh?: Cnh
  cnhType?: CnhType
  street?: string
  number?: number
  district?: string
  zipCode?: string
  city?: string
  state?: string
}

export function makeDriver(
  override: Override = {},
  id?: UniqueEntityID,
): Driver {
  const name =
    override.name ?? new Name(faker.person.firstName(), faker.person.lastName())

  const email = override.email ?? new Email(faker.internet.email())

  const phone =
    override.phone ??
    new Phone(`77${faker.number.int({ min: 200000000, max: 999999999 })}`)

  const street = override.street ?? faker.location.street()

  const number = override.number ?? faker.number.int({ min: 1, max: 9999 })

  const district = override.district ?? faker.location.city()

  const zipCode = override.zipCode ?? faker.location.zipCode('#####-###')

  const city = override.city ?? faker.location.city()

  const state = override.state ?? faker.location.state()

  const cnh = override.cnh ?? new Cnh('10101248907')

  const cnhType =
    override.cnhType ??
    (faker.helpers.arrayElement([
      CnhType.A,
      CnhType.B,
      CnhType.C,
      CnhType.D,
      CnhType.E,
    ]) as CnhType)

  return Driver.create(
    {
      name,
      email,
      phone,
      cnh,
      cnhType,
      address: new Address(street, number, district, zipCode, city, state),
    },
    id,
  )
}
