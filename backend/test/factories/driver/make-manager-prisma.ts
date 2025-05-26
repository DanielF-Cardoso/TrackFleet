import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaDriverMapper } from '@/infra/database/prisma/mappers/prisma-driver.mapper'
import { Name } from '@/core/value-objects/name.vo'
import { Email } from '@/core/value-objects/email.vo'
import { faker } from '@faker-js/faker'
import { Phone } from '@/core/value-objects/phone.vo'
import { Address } from '@/core/value-objects/address.vo'
import { Cnh } from '@/core/value-objects/cnh.vo'
import {
  CnhType,
  Driver,
} from '@/domain/driver/enterprise/entities/driver.entity'

interface MakePrismaDriverData {
  firstName?: string
  lastName?: string
  email?: string
  cnh?: string
  cnhType?: string
}

@Injectable()
export class DriverFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDriver(data: MakePrismaDriverData = {}): Promise<Driver> {
    const firstName = data.firstName ?? faker.person.firstName()
    const lastName = data.lastName ?? faker.person.lastName()
    const email = data.email ?? faker.internet.email()
    const cnh = data.cnh ?? '70069298086'
    const cnhType =
      data.cnhType ?? faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E'])

    const driver = Driver.create({
      name: new Name(firstName, lastName),
      phone: new Phone(
        `11${faker.number.int({ min: 200000000, max: 999999999 })}`,
      ),
      email: new Email(email),
      cnh: new Cnh(cnh),
      cnhType: cnhType as CnhType,
      address: new Address(
        faker.location.street(),
        faker.number.int({ min: 1, max: 9999 }),
        faker.location.city(),
        faker.location.zipCode('#####-###'),
        faker.location.city(),
        faker.location.state(),
      ),
    })

    await this.prisma.driver.create({
      data: PrismaDriverMapper.toPersistence(driver),
    })

    return driver
  }
}
